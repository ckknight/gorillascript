"use strict";
var __cmp, __create, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, __xor, ast, binaryOps, HELPERS, KNOWN_HELPERS, parser, Scope, translators, types, unaryOps;
__cmp = function (left, right) {
  var type;
  if (left === right) {
    return 0;
  } else {
    type = typeof left;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof right) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
    } else if (left < right) {
      return -1;
    } else {
      return 1;
    }
  }
};
if (typeof Object.create === "function") {
  __create = Object.create;
} else {
  __create = function (x) {
    function F() {
      
    }
    F.prototype = x;
    return new F();
  };
};
if (typeof Array.isArray === "function") {
  __isArray = Array.isArray;
} else {
  __isArray = (function () {
    var _toString;
    _toString = Object.prototype.toString;
    return function (x) {
      return _toString.call(x) === "[object Array]";
    };
  }());
};
__lt = function (x, y) {
  var type;
  type = typeof x;
  if (type !== "number" && type !== "string") {
    throw TypeError("Cannot compare a non-number/string: " + type);
  } else if (type !== typeof y) {
    throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
  } else {
    return x < y;
  }
};
__lte = function (x, y) {
  var type;
  type = typeof x;
  if (type !== "number" && type !== "string") {
    throw TypeError("Cannot compare a non-number/string: " + type);
  } else if (type !== typeof y) {
    throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
  } else {
    return x <= y;
  }
};
__num = function (num) {
  if (typeof num !== "number") {
    throw TypeError("Expected a number, got " + typeof num);
  } else {
    return num;
  }
};
__owns = (function () {
  var has;
  has = Object.prototype.hasOwnProperty;
  return function (parent, child) {
    return has.call(parent, child);
  };
}());
__slice = (function () {
  var slice;
  slice = Array.prototype.slice;
  return function (array, start, end) {
    return slice.call(array, start, end);
  };
}());
__strnum = function (strnum) {
  var type;
  type = typeof strnum;
  if (type === "string") {
    return strnum;
  } else if (type === "number") {
    return String(strnum);
  } else {
    throw TypeError("Expected a string or number, got " + type);
  }
};
__toArray = function (x) {
  if (__isArray(x)) {
    return x;
  } else {
    return __slice(x);
  }
};
__typeof = (function () {
  var _toString;
  _toString = Object.prototype.toString;
  return function (o) {
    if (o === void 0) {
      return "Undefined";
    } else if (o === null) {
      return "Null";
    } else {
      return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
    }
  };
}());
__xor = function (x, y) {
  if (x) {
    return !y;
  } else {
    return y;
  }
};
ast = require("./ast");
types = require("./types");
parser = require("./parser");
function needsCaching(item) {
  return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
}
Scope = (function () {
  var _proto;
  _proto = Scope.prototype;
  Scope.displayName = "Scope";
  function Scope(options, bound, usedTmps, helpers, macroHelpers, variables, tmps) {
    var _this;
    if (options == null) {
      options = {};
    }
    if (bound == null) {
      bound = false;
    }
    if (usedTmps == null) {
      usedTmps = {};
    }
    if (helpers == null) {
      helpers = {};
    }
    if (macroHelpers == null) {
      macroHelpers = {};
    }
    if (tmps == null) {
      tmps = {};
    }
    if (this instanceof Scope) {
      _this = this;
    } else {
      _this = __create(_proto);
    };
    _this.options = options;
    _this.bound = bound;
    _this.usedTmps = usedTmps;
    _this.helpers = helpers;
    _this.macroHelpers = macroHelpers;
    _this.variables = variables ? __create(variables) : {};
    _this.tmps = tmps;
    _this.hasBound = false;
    _this.usedThis = false;
    return _this;
  }
  _proto.maybeCache = function (item, func) {
    var ident, result;
    if (!(item instanceof ast.Expression)) {
      throw TypeError("Expected item to be a Expression, got " + __typeof(item));
    }
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    if (!needsCaching(item)) {
      return func(item, item, false);
    } else {
      ident = this.reserveIdent("ref");
      result = func(
        ast.Assign(ident, item),
        ident,
        true
      );
      this.releaseIdent(ident);
      return result;
    }
  };
  _proto.maybeCacheAccess = function (item, func) {
    var _this;
    _this = this;
    if (!(item instanceof ast.Expression)) {
      throw TypeError("Expected item to be a Expression, got " + __typeof(item));
    }
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    if (item instanceof ast.Binary && item.op === ".") {
      return this.maybeCache(item.left, function (setLeft, left) {
        return _this.maybeCache(item.right, function (setRight, right) {
          return func(
            ast.Access(setLeft, setRight),
            ast.Access(left, right),
            true
          );
        });
      });
    } else {
      return func(item, item, false);
    }
  };
  _proto.reserveIdent = function (namePart) {
    var i, ident, name;
    if (namePart == null) {
      namePart = "ref";
    }
    for (i = 1; ; ++i) {
      if (i === 1) {
        name = "_" + __strnum(namePart);
      } else {
        name = "_" + __strnum(namePart) + __strnum(i);
      };
      if (!(name in this.usedTmps)) {
        this.usedTmps[name] = true;
        ident = ast.Ident(name);
        this.addVariable(ident);
        return ident;
      }
    }
  };
  _proto.reserveParam = function () {
    var i, name;
    for (i = 1; ; ++i) {
      if (i !== 1) {
        name = "_p" + __strnum(i);
      } else {
        name = "_p";
      };
      if (!(name in this.usedTmps)) {
        this.usedTmps[name] = true;
        return ast.Ident(name);
      }
    }
  };
  _proto.getTmp = function (id, name) {
    var tmp, tmps;
    tmps = this.tmps;
    if (id in tmps) {
      tmp = tmps[id];
      if (tmp instanceof ast.Ident) {
        return tmp;
      }
    }
    return tmps[id] = this.reserveIdent(name || "tmp");
  };
  _proto.releaseTmp = function (id) {
    var ident;
    if (__owns(this.tmps, id)) {
      ident = this.tmps[id];
      delete this.tmps[id];
      this.releaseIdent(ident);
    }
  };
  _proto.releaseTmps = function () {
    var _obj, id;
    _obj = this.tmps;
    for (id in _obj) {
      if (__owns(_obj, id)) {
        this.releaseTmp(id);
      }
    }
    this.tmps = {};
  };
  _proto.releaseIdent = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    if (!__owns(this.usedTmps, ident.name)) {
      if (maybe) {
        return;
      }
      throw Error("Trying to release a non-reserved ident: " + __strnum(ident.name));
    }
    delete this.usedTmps[ident.name];
  };
  _proto.markAsParam = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    this.removeVariable(ident);
  };
  _proto.addHelper = function (name) {
    this.helpers[name] = true;
  };
  function lowerSorter(a, b) {
    return __cmp(a.toLowerCase(), b.toLowerCase());
  }
  _proto.getHelpers = function () {
    var _this, helpers;
    _this = this;
    helpers = (function () {
      var _arr, _obj, k;
      _arr = [];
      _obj = _this.helpers;
      for (k in _obj) {
        if (__owns(_obj, k)) {
          _arr.push(k);
        }
      }
      return _arr;
    }());
    return helpers.sort(lowerSorter);
  };
  _proto.addVariable = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    this.variables[ident.name] = true;
  };
  _proto.hasVariable = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    if (this.variables[ident.name]) {
      return ident.name in this.variables;
    } else {
      return false;
    }
  };
  _proto.removeVariable = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    delete this.variables[ident.name];
  };
  _proto.getVariables = function () {
    var _this, variables;
    _this = this;
    variables = (function () {
      var _arr, _obj, k;
      _arr = [];
      _obj = _this.variables;
      for (k in _obj) {
        if (__owns(_obj, k)) {
          _arr.push(k);
        }
      }
      return _arr;
    }());
    return variables.sort(lowerSorter);
  };
  _proto.clone = function (bound) {
    if (bound) {
      this.hasBound = true;
    }
    return Scope(
      this.options,
      bound,
      __create(this.usedTmps),
      this.helpers,
      this.macroHelpers,
      this.variables,
      __create(this.tmps)
    );
  };
  return Scope;
}());
function wrapReturn(x) {
  if (x instanceof ast.Throw) {
    return x;
  } else {
    return ast.Return(x);
  }
}
function identity(x) {
  return x;
}
function makeAutoReturn(x) {
  if (x) {
    return wrapReturn;
  } else {
    return identity;
  }
}
function numWrap(node, scope) {
  if (node.type().isSubsetOf(types.number)) {
    return node;
  } else {
    scope.addHelper("__num");
    return ast.Call(ast.Ident("__num"), [node]);
  }
}
function strnumWrap(node, scope) {
  if (node.type().isSubsetOf(types.string)) {
    return node;
  } else if (node.type().isSubsetOf(types.stringOrNumber)) {
    return ast.Binary("", "+", node);
  } else {
    scope.addHelper("__strnum");
    return ast.Call(ast.Ident("__strnum"), [node]);
  }
}
binaryOps = {
  "~*": "*",
  "~/": "/",
  "~%": "%",
  "~+": function (left, right) {
    if (!left.type().isSubsetOf(types.number)) {
      left = ast.Unary("+", left);
    }
    if (!right.type().isSubsetOf(types.number)) {
      right = ast.Unary("+", right);
    }
    return ast.Binary(left, "+", right);
  },
  "~-": "-",
  "~bitlshift": "<<",
  "~bitrshift": ">>",
  "~biturshift": ">>>",
  "~&": function (left, right) {
    if (left.type().overlaps(types.number) && right.type().overlaps(types.number)) {
      left = ast.Binary("", "+", left);
    }
    return ast.Binary(left, "+", right);
  },
  haskey: function (left, right, scope) {
    return ast.Binary(right, "in", left);
  },
  "instanceof": "instanceof",
  "~=": "==",
  "!~=": "!=",
  "==": "===",
  "!=": "!==",
  "~<": "<",
  "~<=": "<=",
  "~>": ">",
  "~>=": ">=",
  and: "&&",
  or: "||",
  "~bitand": "&",
  "~bitor": "|",
  "~bitxor": "^"
};
unaryOps = {
  "~-": "-",
  "-": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("-", numWrap(
      translate(node.node, scope, "expression"),
      scope
    )));
  },
  "~+": "+",
  "+": function (node, scope, location, autoReturn) {
    return autoReturn(numWrap(
      translate(node.node, scope, "expression"),
      scope
    ));
  },
  dec: "--",
  inc: "++",
  not: "!",
  bool: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("!", ast.Unary("!", translate(node.node, scope, "expression"))));
  },
  "?": function (node, scope, location, autoReturn) {
    var translated;
    translated = translate(node.node, scope, "expression");
    if (translated instanceof ast.Ident && !scope.hasVariable(translated)) {
      return autoReturn(ast.Binary(
        ast.Binary(
          ast.Unary("typeof", translated),
          "!==",
          "undefined"
        ),
        "&&",
        ast.Binary(translated, "!==", null)
      ));
    } else {
      return autoReturn(ast.Binary(translated, "!=", null));
    }
  },
  "~bitnot": "~",
  bitnot: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("~", numWrap(
      translate(node.node, scope, "expression"),
      scope
    )));
  },
  "typeof": "typeof",
  "typeof!": function (node, scope, location, autoReturn) {
    scope.addHelper("__typeof");
    return autoReturn(ast.Call(ast.Ident("__typeof"), [translate(node.node, scope, "expression")]));
  },
  "num!": function (node, scope, location, autoReturn) {
    var translated;
    translated = translate(node.node, scope, "expression");
    if (translated.type().isSubsetOf(types.number)) {
      return autoReturn(translated);
    } else {
      scope.addHelper("__num");
      return autoReturn(ast.Call(ast.Ident("__num"), [translated]));
    }
  },
  "str!": function (node, scope, location, autoReturn) {
    var translated;
    translated = translate(node.node, scope, "expression");
    if (translated.type().isSubsetOf(types.string)) {
      return autoReturn(translated);
    } else {
      scope.addHelper("__str");
      return autoReturn(ast.Call(ast.Ident("__str"), [translated]));
    }
  },
  "strnum!": function (node, scope, location, autoReturn) {
    var translated;
    translated = translate(node.node, scope, "expression");
    return strnumWrap(translated, scope);
  },
  "delete": function (node, scope, location, autoReturn) {
    if (location === "expression") {
      return scope.maybeCacheAccess(
        translate(node.node, scope, "expression"),
        function (setNode, node) {
          var block, ident;
          ident = scope.reserveIdent("ref");
          block = ast.Block([
            ast.Assign(ident, setNode),
            ast.Unary("delete", node, scope, "expression"),
            ident
          ]);
          scope.releaseIdent(ident);
          return block;
        }
      );
    } else {
      return autoReturn(ast.Unary("delete", translate(node.node, scope, "expression")));
    }
  },
  "throw": function (node, scope, location) {
    if (location === "expression") {
      return translate(wrapInFunctionCall(node), scope, "expression");
    } else {
      return ast.Throw(translate(node.node, scope, "expression"));
    }
  },
  "throw?": function (node, scope, location) {
    if (location === "expression") {
      return translate(wrapInFunctionCall(node), scope, "expression");
    } else {
      return scope.maybeCache(
        translate(node.node, scope, "expression"),
        function (setNode, node) {
          return ast.If(
            ast.Binary(setNode, "!=", null),
            ast.Throw(node, scope, "expression")
          );
        }
      );
    }
  },
  "^": function (node, scope, location, autoReturn) {
    scope.addHelper("__create");
    return autoReturn(ast.Call(ast.Ident("__create"), [translate(node.node, scope, "expression")]));
  }
};
HELPERS = {};
function wrapInFunctionCall(node) {
  return parser.Node.CallChain(
    node.startIndex,
    node.endIndex,
    parser.Node.Function(
      node.startIndex,
      node.endIndex,
      [],
      node,
      true,
      true
    ),
    [{ type: "call", args: [], existential: false }]
  );
}
function flattenSpreadArray(elements) {
  var _i, _len, changed, element, result;
  result = [];
  changed = false;
  for (_i = 0, _len = __num(elements.length); _i < _len; ++_i) {
    element = elements[_i];
    if (element instanceof parser.Node.Spread && element.node instanceof parser.Node.Array) {
      result.push.apply(result, __toArray(element.node.elements));
      changed = true;
    } else {
      result.push(element);
    }
  }
  if (changed) {
    return flattenSpreadArray(result);
  } else {
    return elements;
  }
}
function arrayTranslate(elements, scope, replaceWithSlice) {
  var _arr, _i, _len, array, current, element, i, translatedItem, translatedItems;
  translatedItems = [];
  current = [];
  translatedItems.push(current);
  for (_arr = flattenSpreadArray(elements), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
    element = _arr[_i];
    if (element instanceof parser.Node.Spread) {
      translatedItems.push(translate(element.node, scope, "expression"));
      current = [];
      translatedItems.push(current);
    } else {
      current.push(translate(element, scope, "expression"));
    }
  }
  if (translatedItems.length === 1) {
    return ast.Arr(translatedItems[0]);
  } else {
    for (i = __num(translatedItems.length) - 1; i > -1; --i) {
      translatedItem = translatedItems[i];
      if (__num(i) % 2 === 0) {
        if (!__lte(translatedItem.length, 0)) {
          translatedItems[i] = ast.Arr(translatedItem);
        } else {
          translatedItems.splice(i, 1);
        }
      } else if (!translatedItem.type().isSubsetOf(types.array)) {
        scope.addHelper("__slice");
        scope.addHelper("__isArray");
        scope.addHelper("__toArray");
        translatedItems[i] = ast.Call(ast.Ident("__toArray"), [translatedItem]);
      }
    }
    if (translatedItems.length === 1) {
      array = translatedItems[0];
      if (replaceWithSlice && array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray") {
        return ast.Call(ast.Ident("__slice"), array.args);
      } else {
        return array;
      }
    } else {
      return ast.Call(
        ast.Access(translatedItems[0], "concat"),
        __slice(translatedItems, 1, void 0)
      );
    }
  }
}
translators = {
  Access: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Access(
      translate(node.parent, scope, "expression"),
      translate(node.child, scope, "expression")
    ));
  },
  Args: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Arguments());
  },
  Array: function (node, scope, location, autoReturn) {
    return autoReturn(arrayTranslate(node.elements, scope, true));
  },
  Assign: (function () {
    var indexes, ops;
    ops = {
      "~*=": "*=",
      "~/=": "/=",
      "~%=": "%=",
      "~+=": function (left, right, scope) {
        if (right instanceof ast.Const && typeof right.value === "number") {
          return ast.Binary(left, "-=", -__num(right.value));
        } else {
          if (!right.type().isSubsetOf(types.number)) {
            right = ast.Unary("+", right);
          }
          if (!left.type().isSubsetOf(types.number)) {
            return scope.maybeCacheAccess(left, function (setLeft, left) {
              return ast.Assign(setLeft, ast.Binary(
                ast.Unary("+", left),
                "+",
                right
              ));
            });
          } else {
            return ast.Binary(left, "+=", right);
          }
        }
      },
      "~-=": "-=",
      "~bitlshift=": "<<=",
      "~bitrshift=": ">>=",
      "~biturshift=": ">>>=",
      "~&=": function (left, right, scope) {
        if (left.type().overlaps(types.number) && right.type().overlaps(types.number)) {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Binary(setLeft, "+=", ast.Binary("", "+", right));
          });
        } else {
          return ast.Binary(left, "+=", right);
        }
      },
      "~bitand=": "&=",
      "~bitor=": "|=",
      "~bitxor=": "^=",
      ":=": "="
    };
    indexes = {
      single: function (parent, child, value, scope) {
        return ast.Assign(
          ast.Access(parent, translate(child.node, scope, "expression")),
          value
        );
      },
      slice: function (parent, child, value, scope) {
        var left, right;
        left = child.left;
        right = child.right;
        scope.addHelper("__splice");
        return ast.Call(ast.Ident("__splice"), [
          parent,
          left && !(left instanceof parser.Node.Nothing) ? translate(left, scope, "expression") : ast.Const(0),
          right && !(right instanceof parser.Node.Nothing) ? translate(right, scope, "expression") : ast.Const(1/0),
          value
        ]);
      },
      multi: function (parent, child, value, scope, location) {
        return scope.maybeCache(parent, function (setParent, parent) {
          return scope.maybeCache(value, function (setValue, value) {
            var elements, lines;
            elements = translateArray(child.elements, scope, "expression");
            lines = (function () {
              var _arr, _len, element, i;
              for (_arr = [], i = 0, _len = __num(elements.length); i < _len; ++i) {
                element = elements[i];
                _arr.push(ast.Assign(
                  ast.Access(
                    i === 0 ? setParent : parent,
                    element
                  ),
                  ast.Access(
                    i === 0 ? setValue : value,
                    i
                  )
                ));
              }
              return _arr;
            }());
            if (location === "expression") {
              lines.push(value);
            }
            return ast.Block(lines);
          });
        });
      }
    };
    return function (node, scope, location, autoReturn) {
      var handler, left, op, right, type;
      op = node.op;
      if (op === ":=" && node.left instanceof parser.Node.AccessIndex) {
        type = node.left.child.type;
        if (!__owns(indexes, type)) {
          throw Error("Unexpected index type for assignment: " + __strnum(JSON.stringify(type)));
        }
        return autoReturn(indexes[type](
          translate(node.left.parent, scope, "expression"),
          node.left.child,
          translate(node.right, scope, "expression"),
          scope,
          location
        ));
      } else {
        left = translate(node.left, scope, "leftExpression");
        right = translate(node.right, scope, "expression");
        if (!__owns(ops, op)) {
          throw Error("Unexpected assign operator: " + __strnum(JSON.stringify(op)));
        }
        handler = ops[op];
        if (typeof handler === "function") {
          return autoReturn(handler(left, right, scope));
        } else if (typeof handler === "string") {
          return autoReturn(ast.Binary(left, handler, right));
        } else {
          throw Error("Unexpected handler type: " + __typeof(handler));
        }
      }
    };
  }()),
  Binary: function (node, scope, location, autoReturn) {
    var handler, left, op, right;
    op = node.op;
    if (!__owns(binaryOps, op)) {
      throw Error("Unexpected binary operator: " + __strnum(JSON.stringify(op)));
    }
    handler = binaryOps[op];
    left = translate(node.left, scope, "expression");
    right = translate(node.right, scope, "expression");
    if (typeof handler === "function") {
      return autoReturn(handler(left, right, scope));
    } else if (typeof handler === "string") {
      return autoReturn(ast.Binary(left, handler, right));
    } else {
      throw Error("Unexpected handler type: " + __typeof(handler));
    }
  },
  Block: function (node, scope, location, autoReturn) {
    return ast.Block(translateArray(node.nodes, scope, location, autoReturn));
  },
  Break: function (node) {
    return ast.Break();
  },
  CallChain: (function () {
    var linkTypes;
    linkTypes = {
      access: (function () {
        var indexTypes;
        indexTypes = {
          single: function (child, scope) {
            return function (parent) {
              return ast.Access(parent, translate(child.node, scope, "expression"));
            };
          },
          slice: function (child, scope) {
            return function (parent) {
              var args, left, right;
              left = child.left;
              right = child.right;
              args = [parent];
              if (left || right) {
                args.push(left ? translate(left, scope, "expression") : ast.Const(0));
              }
              if (right) {
                args.push(translate(right, scope, "expression"));
              }
              scope.addHelper("__slice");
              return ast.Call(ast.Ident("__slice"), args);
            };
          },
          multi: function (child, scope) {
            return function (parent) {
              return scope.maybeCache(parent, function (setParent, parent) {
                var elements;
                elements = translateArray(child.elements, scope, "expression");
                return ast.Arr((function () {
                  var _arr, _len, element, i;
                  for (_arr = [], i = 0, _len = __num(elements.length); i < _len; ++i) {
                    element = elements[i];
                    _arr.push(ast.Access(
                      i === 0 ? setParent : parent,
                      element
                    ));
                  }
                  return _arr;
                }()));
              });
            };
          }
        };
        return function (links, link, scope, i, current) {
          var makeAccess;
          if (link.type === "access") {
            makeAccess = function (parent) {
              return ast.Access(parent, translate(link.child, scope, "expression"));
            };
          } else if (link.type === "accessIndex") {
            if (!__owns(indexTypes, link.child.type)) {
              (function () {
                throw Error("Unknown index type: " + __strnum(link.child.type));
              }());
            }
            makeAccess = indexTypes[link.child.type](link.child, scope);
          } else {
            makeAccess = (function () {
              throw Error("Unknown link type: " + __strnum(link.type));
            }());
          };
          if (!link.existential) {
            return handle(links, scope, __num(i) + 1, makeAccess(current));
          } else {
            return scope.maybeCache(current, function (setObj, obj) {
              return ast.If(
                ast.Binary(setObj, "!=", null),
                handle(links, scope, __num(i) + 1, makeAccess(obj))
              );
            });
          }
        };
      }()),
      accessIndex: function () {
        var args;
        args = __slice(arguments);
        return linkTypes.access.apply(this, __toArray(args));
      },
      call: (function () {
        function makeCall(func, args, isNew, isApply, scope) {
          var argArray, start, thisArg;
          thisArg = void 0;
          if (isApply && (args.length === 0 || !(args[0] instanceof parser.Node.Spread))) {
            if (args.length === 0) {
              start = ast.Const(void 0);
            } else {
              start = translate(args[0], scope, "expression");
            };
            argArray = arrayTranslate(
              __slice(args, 1, void 0),
              scope,
              false
            );
            if (argArray instanceof ast.Arr) {
              return ast.Call(
                ast.Access(func, "call"),
                [start].concat(__toArray(argArray.elements))
              );
            } else {
              return ast.Call(
                ast.Access(func, "apply"),
                [start, argArray]
              );
            }
          } else {
            argArray = arrayTranslate(args, scope, false);
            if (isApply) {
              return scope.maybeCache(argArray, function (setArray, array) {
                scope.addHelper("__slice");
                return ast.Call(
                  ast.Access(func, "apply"),
                  [
                    ast.Access(setArray, 0),
                    ast.Call(ast.Ident("__slice"), [array, ast.Const(1)])
                  ]
                );
              });
            } else if (argArray instanceof ast.Arr) {
              return ast.Call(func, argArray.elements, isNew);
            } else if (isNew) {
              scope.addHelper("__new");
              return ast.Call(ast.Ident("__new"), [func, argArray]);
            } else if (func instanceof ast.Binary && func.op === ".") {
              return scope.maybeCache(func.left, function (setParent, parent) {
                return ast.Call(
                  ast.Access(
                    ast.Access(setParent, func.right),
                    "apply"
                  ),
                  [parent, argArray]
                );
              });
            } else {
              return ast.Call(
                ast.Access(func, "apply"),
                [ast.Const(void 0), argArray]
              );
            }
          }
        }
        return function (links, link, scope, i, current) {
          if (link.isNew && link.isApply) {
            throw Error("Cannot have a call link with both is-new and is-apply");
          }
          if (!link.existential) {
            return handle(links, scope, __num(i) + 1, makeCall(
              current,
              link.args,
              link.isNew,
              link.isApply,
              scope
            ));
          } else if (current instanceof ast.Binary && current.op === ".") {
            return scope.maybeCache(current.left, function (setParent, parent) {
              return scope.maybeCache(current.right, function (setChild, child) {
                return ast.If(
                  ast.Binary(
                    ast.Unary("typeof", ast.Access(setParent, setChild)),
                    "===",
                    "function"
                  ),
                  handle(links, scope, __num(i) + 1, makeCall(
                    ast.Access(parent, child),
                    link.args,
                    link.isNew,
                    link.isApply,
                    scope
                  ))
                );
              });
            });
          } else {
            return scope.maybeCache(current, function (setFunc, func) {
              return ast.If(
                ast.Binary(
                  ast.Unary("typeof", setFunc),
                  "===",
                  "function"
                ),
                handle(links, scope, __num(i) + 1, makeCall(
                  func,
                  link.args,
                  link.isNew,
                  link.isApply,
                  scope
                ))
              );
            });
          }
        };
      }()),
      "?": function (links, link, scope, i, current) {
        return scope.maybeCache(current, function (setLeft, left) {
          return ast.IfExpression(
            ast.Binary(setLeft, "!=", null),
            left,
            translate(link.child, scope, "expression")
          );
        });
      }
    };
    function handle(links, scope, i, current) {
      var link;
      if (!__lt(i, links.length)) {
        return current;
      } else {
        link = links[i];
        if (link == null) {
          throw Error("Encounted null call-chain link at index #" + __strnum(i));
        }
        if (!__owns(linkTypes, link.type)) {
          throw Error("Unknown call-chain link: " + __strnum(link.type));
        }
        return linkTypes[link.type](
          links,
          link,
          scope,
          i,
          current
        );
      }
    }
    return function (node, scope, location, autoReturn) {
      return autoReturn(handle(node.links, scope, 0, translate(node.head, scope, "expression")));
    };
  }()),
  Const: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Const(node.value));
  },
  Continue: function () {
    return ast.Continue();
  },
  Debugger: function (node, scope, location, autoReturn) {
    if (location === "expression") {
      return ast.Call(
        ast.Func(null, [], [], [ast.Debugger()]),
        []
      );
    } else {
      return ast.Debugger();
    }
  },
  Def: function (node, scope, location, autoReturn) {
    throw Error("Cannot have a stray def");
  },
  DefineHelper: function (node, scope, location, autoReturn) {
    var ident, value;
    ident = translate(node.name, scope, "leftExpression");
    if (!(ident instanceof ast.Ident)) {
      throw Error("Expected name to be an Ident, got " + __typeof(ident));
    }
    value = translate(node.value, scope, "expression");
    HELPERS[ident.name] = function () {
      return value;
    };
    KNOWN_HELPERS.push(ident.name);
    return ast.BlockExpression();
  },
  Eval: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Eval(translate(node.code, scope, "expression")));
  },
  For: function (node, scope, location, autoReturn) {
    return ast.For(
      node.init != null ? translate(node.init, scope, "expression") : void 0,
      node.test != null ? translate(node.test, scope, "expression") : void 0,
      node.step != null ? translate(node.step, scope, "expression") : void 0,
      translate(node.body, scope, "statement")
    );
  },
  ForIn: function (node, scope, location, autoReturn) {
    var key;
    key = translate(node.key, scope, "leftExpression");
    if (!(key instanceof ast.Ident)) {
      throw Error("Expected an Ident for a for-in key");
    }
    scope.addVariable(key);
    return ast.ForIn(
      key,
      translate(node.object, scope, "expression"),
      translate(node.body, scope, "statement")
    );
  },
  Function: (function () {
    var primitiveTypes, translateParamTypes, translateTypeChecks;
    primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
    function makeTypeCheckTest(ident, type, scope) {
      if (__owns(primitiveTypes, type)) {
        return ast.Binary(
          ast.Unary("typeof", ident),
          "!==",
          primitiveTypes[type]
        );
      } else if (type === "Array") {
        scope.addHelper("__isArray");
        return ast.Unary("!", ast.Call(ast.Ident("__isArray"), [ident]));
      } else {
        return ast.Unary("!", ast.Binary(ident, "instanceof", ast.Ident(type)));
      }
    }
    translateTypeChecks = {
      Ident: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var access, result;
        if (typeof arrayIndex !== "undefined" && arrayIndex !== null) {
          access = ast.Access(ident, arrayIndex);
        } else {
          access = ident;
        };
        scope.addHelper("__typeof");
        result = ast.If(
          makeTypeCheckTest(access, node.name, scope),
          ast.Throw(ast.Call(ast.Ident("TypeError"), [
            typeof arrayIndex !== "undefined" && arrayIndex !== null
              ? ast.Concat("Expected " + __strnum(ident.name) + "[", arrayIndex, "] to be a " + __strnum(node.name) + ", got ", ast.Call(ast.Ident("__typeof"), [access]))
              : ast.Concat("Expected " + __strnum(ident.name) + " to be a " + __strnum(node.name) + ", got ", ast.Call(ast.Ident("__typeof"), [ident]))
          ]))
        );
        if (!hasDefaultValue && node.name === "Boolean") {
          return ast.If(
            ast.Binary(ident, "==", null),
            ast.Assign(ident, ast.Const(false)),
            result
          );
        } else {
          return result;
        }
      },
      Access: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var access, type;
        if (typeof arrayIndex !== "undefined" && arrayIndex !== null) {
          access = ast.Access(ident, arrayIndex);
        } else {
          access = ident;
        };
        scope.addHelper("__typeof");
        type = translate(node, scope, "expression");
        return ast.If(
          ast.Unary("!", ast.Binary(access, "instanceof", type)),
          ast.Throw(ast.Call(ast.Ident("TypeError"), [
            typeof arrayIndex !== "undefined" && arrayIndex !== null
              ? ast.Concat("Expected " + __strnum(ident.name) + "[", arrayIndex, "] to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [access]))
              : ast.Concat("Expected " + __strnum(ident.name) + " to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [ident]))
          ]))
        );
      },
      TypeUnion: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var _arr, _i, _len, check, hasBoolean, hasNull, hasVoid, names, result, tests, type;
        if (typeof arrayIndex !== "undefined" && arrayIndex !== null) {
          throw Error("Not implemented: type-union in type-array");
        }
        scope.addHelper("__typeof");
        check = void 0;
        hasBoolean = false;
        hasVoid = false;
        hasNull = false;
        names = [];
        tests = [];
        for (_arr = node.types, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          type = _arr[_i];
          if (type instanceof parser.Node.Const) {
            if (type.value === null) {
              hasNull = true;
              names.push("null");
            } else if (type.value === void 0) {
              hasVoid = true;
              names.push("undefined");
            } else {
              throw Error("Unknown const value for typechecking: " + __strnum(String(type.value)));
            }
          } else if (type instanceof parser.Node.Ident) {
            if (type.name === "Boolean") {
              hasBoolean = true;
            }
            names.push(type.name);
            tests.push(makeTypeCheckTest(ident, type.name, scope));
          } else {
            throw Error("Not implemented: typechecking for non-idents/consts within a type-union");
          }
        }
        if (hasNull && hasVoid && !hasDefaultValue) {
          tests.unshift(ast.Binary(ident, "!=", null));
        }
        result = ast.If(
          ast.And.apply(ast, __toArray(tests)),
          ast.Throw(ast.Call(ast.Ident("TypeError"), [
            ast.Concat("Expected " + __strnum(ident.name) + " to be a " + __strnum(names.join(" or ")) + ", got ", ast.Call(ast.Ident("__typeof"), [ident]))
          ]))
        );
        if (!hasDefaultValue) {
          if (hasNull || hasVoid) {
            if (__xor(hasNull, hasVoid)) {
              result = ast.If(
                ast.Binary(ident, "==", null),
                ast.Assign(ident, ast.Const(hasNull ? null : void 0)),
                result
              );
            }
          } else if (hasBoolean) {
            result = ast.If(
              ast.Binary(ident, "==", null),
              ast.Assign(ident, ast.Const(false)),
              result
            );
          }
        }
        return result;
      },
      TypeArray: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var index, length;
        if (arrayIndex) {
          throw Error("Not implemented: arrays within arrays as types");
        }
        scope.addHelper("__isArray");
        index = scope.reserveIdent("i");
        length = scope.reserveIdent("len");
        return ast.If(
          ast.Unary("!", ast.Call(ast.Ident("__isArray"), [ident])),
          ast.Throw(ast.Call(ast.Ident("TypeError"), [
            ast.Concat("Expected " + __strnum(ident.name) + " to be an Array, got ", ast.Call(ast.Ident("__typeof"), [ident]))
          ])),
          ast.For(
            ast.Block([
              ast.Assign(index, ast.Const(0)),
              ast.Assign(length, ast.Access(ident, "length"))
            ]),
            ast.Binary(index, "<", length),
            ast.Unary("++", index),
            translateTypeCheck(
              ident,
              node.subtype,
              scope,
              false,
              index
            )
          )
        );
      }
    };
    function translateTypeCheck(ident, node, scope, hasDefaultValue, arrayIndex) {
      if (!__owns(translateTypeChecks, node.constructor.cappedName)) {
        throw Error("Unknown type: " + __strnum(String(node.constructor.cappedName)));
      }
      return translateTypeChecks[node.constructor.cappedName](
        ident,
        node,
        scope,
        hasDefaultValue,
        arrayIndex
      );
    }
    translateParamTypes = {
      Param: function (param, scope, inner) {
        var ident, init, laterInit, tmp, typeCheck;
        ident = translate(param.ident, scope, "param");
        if (param.ident instanceof parser.Node.Tmp) {
          scope.markAsParam(ident);
        }
        laterInit = [];
        if (ident instanceof ast.Binary && ident.op === "." && ident.right instanceof ast.Const && typeof ident.right.value === "string") {
          tmp = ast.Ident(ident.right.value);
          laterInit.push(ast.Binary(ident, "=", tmp));
          ident = tmp;
        }
        if (!(ident instanceof ast.Ident)) {
          throw Error("Expecting param to be an Ident, got " + __typeof(ident));
        }
        if (inner) {
          scope.addVariable(ident);
        }
        init = [];
        if (param.asType) {
          typeCheck = translateTypeCheck(ident, param.asType, scope, param.defaultValue != null);
        } else {
          typeCheck = void 0;
        };
        if (param.defaultValue != null) {
          init.push(ast.If(
            ast.Binary(ident, "==", null),
            ast.Assign(ident, translate(param.defaultValue, scope, "expression")),
            typeCheck
          ));
        } else if (typeCheck) {
          init.push(typeCheck);
        }
        return { init: __toArray(init).concat(__toArray(laterInit)), ident: ident, spread: !!param.spread };
      },
      Array: function (array, scope, inner) {
        var _arr, arrayIdent, diff, foundSpread, i, init, len, p, param, spreadCounter;
        if (inner) {
          arrayIdent = scope.reserveIdent("p");
        } else {
          arrayIdent = scope.reserveParam();
        };
        init = [];
        foundSpread = -1;
        spreadCounter = void 0;
        for (_arr = array.elements, i = 0, len = __num(_arr.length); i < len; ++i) {
          p = _arr[i];
          param = translateParam(p, scope, true);
          if (!param.spread) {
            if (foundSpread === -1) {
              init.push(ast.Assign(param.ident, ast.Access(arrayIdent, i)));
            } else {
              diff = __num(i) - __num(foundSpread) - 1;
              init.push(ast.Assign(param.ident, ast.Access(arrayIdent, diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", diff))));
            }
          } else {
            if (foundSpread !== -1) {
              throw Error("Encountered multiple spread parameters");
            }
            foundSpread = i;
            scope.addHelper("__slice");
            if (i === __num(len) - 1) {
              init.push(ast.Assign(param.ident, ast.Call(ast.Ident("__slice"), [arrayIdent].concat(i === 0 ? [] : [ast.Const(i)]))));
            } else {
              spreadCounter = scope.reserveIdent("ref");
              init.push(ast.Assign(param.ident, ast.IfExpresion(
                ast.Binary(i, "<", ast.Assign(spreadCounter, ast.Binary(
                  ast.Access(arrayIdent, "length"),
                  "-",
                  __num(len) - __num(i) - 1
                ))),
                ast.Call(ast.Ident("__slice"), [arrayIdent, ast.Const(i), spreadCounter]),
                ast.BlockExpression([
                  ast.Assign(spreadCounter, ast.Const(i)),
                  ast.Arr()
                ])
              )));
            }
          }
          init.push.apply(init, __toArray(param.init));
        }
        if (spreadCounter != null) {
          scope.releaseIdent(spreadCounter);
        }
        if (inner) {
          scope.releaseIdent(arrayIdent);
        }
        return { init: init, ident: arrayIdent, spread: false };
      },
      Object: function (object, scope, inner) {
        var _arr, _i, _len, init, key, objectIdent, pair, value;
        if (inner) {
          objectIdent = scope.reserveIdent("p");
        } else {
          objectIdent = scope.reserveParam();
        };
        init = [];
        for (_arr = object.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          pair = _arr[_i];
          key = translate(pair.key, scope, "expression");
          if (!(key instanceof ast.Const)) {
            throw Error("Unexpected non-const object key: " + __typeof(key));
          }
          value = translateParam(pair.value, scope, true);
          scope.addVariable(value.ident);
          init.push.apply(init, [
            ast.Assign(value.ident, ast.Access(objectIdent, key))
          ].concat(__toArray(value.init)));
        }
        if (inner) {
          scope.releaseIdent(objectIdent);
        }
        return { init: init, ident: objectIdent, spread: false };
      }
    };
    function translateParam(param, scope, inner) {
      var type;
      type = param.constructor.cappedName;
      if (!__owns(translateParamTypes, type)) {
        throw Error("Unknown parameter type: " + __strnum(type));
      }
      return translateParamTypes[type](param, scope, inner);
    }
    return function (node, scope, location, autoReturn) {
      var _arr, body, diff, fakeThis, foundSpread, func, i, initializers, innerScope, len, p, param, paramIdents, spreadCounter;
      innerScope = scope.clone(node.bound);
      paramIdents = [];
      initializers = [];
      foundSpread = -1;
      spreadCounter = void 0;
      for (_arr = node.params, i = 0, len = __num(_arr.length); i < len; ++i) {
        p = _arr[i];
        param = translateParam(p, innerScope, false);
        if (!param.spread) {
          if (foundSpread === -1) {
            paramIdents.push(param.ident);
          } else {
            innerScope.addVariable(param.ident);
            diff = __num(i) - __num(foundSpread) - 1;
            initializers.push(ast.Assign(param.ident, ast.Access(ast.Arguments(), diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", diff))));
          }
        } else {
          if (foundSpread !== -1) {
            throw Error("Encountered multiple spread parameters");
          }
          foundSpread = i;
          innerScope.addHelper("__slice");
          innerScope.addVariable(param.ident);
          if (i === __num(len) - 1) {
            initializers.push(ast.Assign(param.ident, ast.Call(ast.Ident("__slice"), [ast.Arguments()].concat(i === 0 ? [] : [ast.Const(i)]))));
          } else {
            spreadCounter = innerScope.reserveIdent("ref");
            initializers.push(ast.Assign(param.ident, ast.IfExpression(
              ast.Binary(i, "<", ast.Assign(spreadCounter, ast.Binary(
                ast.Access(ast.Arguments(), "length"),
                "-",
                __num(len) - __num(i) - 1
              ))),
              ast.Call(ast.Ident("__slice"), [ast.Arguments(), ast.Const(i), spreadCounter]),
              ast.BlockExpression([
                ast.Assign(spreadCounter, ast.Const(i)),
                ast.Arr()
              ])
            )));
          }
        }
        initializers.push.apply(initializers, __toArray(param.init));
      }
      if (spreadCounter) {
        innerScope.releaseIdent(spreadCounter);
      }
      body = translate(node.body, innerScope, "topStatement", node.autoReturn);
      if (body instanceof ast.BlockExpression || body instanceof ast.BlockStatement) {
        body = body.body;
      } else {
        body = [body];
      };
      innerScope.releaseTmps();
      body = __toArray(initializers).concat(__toArray(body));
      if (innerScope.usedThis) {
        if (innerScope.bound) {
          scope.usedThis = true;
        }
        if (innerScope.hasBound && !innerScope.bound) {
          fakeThis = ast.Ident("_this");
          innerScope.addVariable(fakeThis);
          body.unshift(ast.Assign(fakeThis, ast.This()));
        }
      }
      func = ast.Func(null, paramIdents, innerScope.getVariables(), body);
      return autoReturn(func);
    };
  }()),
  Ident: function (node, scope, location, autoReturn) {
    var name;
    name = node.name;
    if (!__lte(name.length, 2) && name.charCodeAt(0) === 95 && name.charCodeAt(1) === 95) {
      scope.addHelper(name);
    }
    return autoReturn(ast.Ident(name));
  },
  If: function (node, scope, location, autoReturn) {
    var innerLocation;
    if (location !== "statement" && location !== "topStatement") {
      innerLocation = location;
    } else {
      innerLocation = "statement";
    };
    return ast.If(
      translate(node.test, scope, "expression"),
      translate(node.whenTrue, scope, innerLocation, autoReturn),
      node.whenFalse != null ? translate(node.whenFalse, scope, innerLocation, autoReturn) : void 0
    );
  },
  AccessIndex: function (node, scope, location, autoReturn) {
    var type;
    type = node.child.type;
    if (type === "single") {
      return autoReturn(ast.Access(
        translate(node.parent, scope, "expression"),
        translate(node.child.node, scope, "expression")
      ));
    } else if (type === "multi") {
      throw Error("Not implemented: index multi");
    } else if (type === "slice") {
      throw Error("Not implemented: index slice");
    } else {
      throw Error("Unknown index type: " + __strnum(type));
    }
  },
  Let: (function () {
    var declarables;
    declarables = {
      Declarable: function (node, scope) {
        var ident;
        if (node.ident instanceof parser.Node.Declarable) {
          return translateDeclarable(node.ident, scope);
        } else {
          ident = translate(node.ident, scope, "leftExpression");
          scope.addVariable(ident);
          return ident;
        }
      }
    };
    function translateDeclarable(node, scope) {
      if (!__owns(declarables, node.constructor.cappedName)) {
        throw Error("Unknown declarable type " + __strnum(node.constructor.cappedName));
      }
      return declarables[node.constructor.cappedName](node, scope);
    }
    return function (node, scope, location, autoReturn) {
      var left, right;
      left = translateDeclarable(node.left, scope);
      right = translate(node.right, scope, "expression");
      if (location === "topStatement" && left instanceof ast.Ident && right instanceof ast.Func && right.name == null) {
        scope.removeVariable(left);
        return autoReturn(ast.Func(
          left,
          right.params,
          right.variables,
          right.body,
          right.declarations
        ));
      } else {
        return autoReturn(ast.Assign(left, right));
      }
    };
  }()),
  Nothing: function () {
    return ast.BlockExpression();
  },
  Object: function (node, scope, location, autoReturn) {
    var _arr, _i, _len, constPairs, currentPairs, ident, key, obj, pair, postConstPairs, result, value;
    constPairs = [];
    postConstPairs = [];
    currentPairs = constPairs;
    for (_arr = node.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      pair = _arr[_i];
      key = translate(pair.key, scope, "expression");
      value = translate(pair.value, scope, "expression");
      if (!(key instanceof ast.Const)) {
        currentPairs = postConstPairs;
      }
      currentPairs.push({ key: key, value: value });
    }
    obj = ast.Obj((function () {
      var _arr, _i, _len, pair;
      for (_arr = [], _i = 0, _len = __num(constPairs.length); _i < _len; ++_i) {
        pair = constPairs[_i];
        _arr.push(ast.Obj.Pair(String(pair.key.value), pair.value));
      }
      return _arr;
    }()));
    if (postConstPairs.length === 0) {
      return autoReturn(obj);
    } else {
      ident = scope.reserveIdent("o");
      result = ast.BlockExpression([ast.Assign(ident, obj)].concat(
        __toArray((function () {
          var _arr, _i, _len, pair;
          for (_arr = [], _i = 0, _len = __num(postConstPairs.length); _i < _len; ++_i) {
            pair = postConstPairs[_i];
            _arr.push(ast.Assign(
              ast.Access(ident, pair.key),
              pair.value
            ));
          }
          return _arr;
        }())),
        [ident]
      ));
      scope.releaseIdent(ident);
      return autoReturn(result);
    }
  },
  Operator: (function () {
    var operators;
    function makeNumOp(op) {
      return function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [
            ast.Return(ast.Binary(
              numWrap(left, scope),
              op,
              numWrap(right, scope)
            ))
          ]
        );
      };
    }
    operators = {
      bitnot: function (scope) {
        var left;
        left = ast.Ident("x");
        return ast.Func(null, [left], [], [
          ast.Return(ast.Unary("~", numWrap(left, scope)))
        ]);
      },
      bool: function (scope) {
        var value;
        value = ast.Ident("x");
        return ast.Func(null, [value], [], [
          ast.Return(ast.Unary("!", ast.Unary("!", value)))
        ]);
      },
      "typeof!": function (scope) {
        scope.addHelper("__typeof");
        return ast.Ident("__typeof");
      },
      "num!": function (scope) {
        scope.addHelper("__num");
        return ast.Ident("__num");
      },
      "str!": function (scope) {
        scope.addHelper("__str");
        return ast.Ident("__str");
      },
      "strnum!": function (scope) {
        scope.addHelper("__strnum");
        return ast.Ident("__strnum");
      },
      "delete": function (scope) {
        var ident, key, object;
        object = ast.Ident("o");
        key = ast.Ident("k");
        ident = ast.Ident("v");
        return ast.Func(
          null,
          [object, key],
          [ident.name],
          [
            ast.Assign(ident, ast.Access(object, key)),
            ast.Unary("delete", ast.Access(object, key)),
            ast.Return(ident)
          ]
        );
      },
      "throw": function (scope) {
        var error;
        error = ast.Ident("e");
        return ast.Func(null, [error], [], [ast.Throw(error)]);
      },
      "throw?": function (scope) {
        var error;
        error = ast.Ident("e");
        return ast.Func(null, [error], [], [
          ast.IfStatement(
            ast.Binary(error, "!=", null),
            ast.Throw(error)
          )
        ]);
      }
    };
    return function (node, scope, location, autoReturn) {
      var left, op, right, value;
      op = node.op;
      if (__owns(operators, op)) {
        return autoReturn(operators[op](scope));
      } else if (__owns(binaryOps, op) && typeof binaryOps[op] === "string") {
        left = ast.Ident("x");
        right = ast.Ident("y");
        return autoReturn(ast.Func(
          null,
          [left, right],
          [],
          [
            ast.Return(ast.Binary(left, binaryOps[op], right))
          ]
        ));
      } else if (__owns(unaryOps, op) && typeof unaryOps[op] === "string") {
        value = ast.Ident("x");
        return autoReturn(ast.Func(null, [value], [], [
          ast.Return(ast.Unary(unaryOps[op], value))
        ]));
      } else {
        throw Error("Unknown operator: " + __strnum(String(op)));
      }
    };
  }()),
  Regexp: function (node, scope, location, autoReturn) {
    var flags, text;
    text = translate(node.text, scope, "expression");
    flags = node.flags;
    if (text instanceof ast.Const && typeof text.value === "string") {
      return autoReturn(ast.Const(RegExp(text.value, flags)));
    } else {
      return autoReturn(ast.Call(ast.Ident("RegExp"), [text, ast.Const(flags)]));
    }
  },
  Return: function (node, scope) {
    var value;
    value = translate(node.node, scope, "expression");
    if (node.existential) {
      return scope.maybeCache(value, function (setValue, value) {
        return ast.IfStatement(
          ast.Binary(setValue, "!=", null),
          ast.Return(value)
        );
      });
    } else {
      return ast.Return(value);
    }
  },
  Root: function (node, scope) {
    var _arr, _i, _len, body, fakeThis, helper, ident, init;
    body = translate(node.body, scope, "topStatement", scope.options["return"]);
    init = [];
    if (scope.hasBound && scope.usedThis) {
      fakeThis = ast.Ident("_this");
      scope.addVariable(fakeThis);
      init.push(ast.Assign(fakeThis, ast.This()));
    }
    for (_arr = scope.getHelpers(), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      helper = _arr[_i];
      if (__owns(HELPERS, helper)) {
        ident = ast.Ident(helper);
        scope.addVariable(ident);
        init.push(ast.Assign(ident, HELPERS[helper]()));
      }
    }
    return ast.Root(__toArray(init).concat([body]), scope.getVariables(), ["use strict"]);
  },
  String: function (node, scope, location, autoReturn) {
    var _i, _len, current, p, part, parts;
    parts = node.parts;
    current = void 0;
    for (_i = 0, _len = __num(parts.length); _i < _len; ++_i) {
      p = parts[_i];
      if (typeof p === "string") {
        part = ast.Const(p);
      } else {
        part = translate(p, scope, "expression");
      };
      if (current != null) {
        current = ast.Binary(current, "+", strnumWrap(part, scope));
      } else {
        current = strnumWrap(part, scope);
      }
    }
    if (current == null) {
      current = ast.Const("");
    }
    return autoReturn(current);
  },
  Super: function (node, scope, location, autoReturn) {
    throw Error("Cannot have a stray super call");
  },
  Tmp: function (node, scope, location, autoReturn) {
    return autoReturn(scope.getTmp(node.id, node.name));
  },
  This: function (node, scope, location, autoReturn) {
    scope.usedThis = true;
    return autoReturn(scope.bound ? ast.Ident("_this") : ast.This());
  },
  TryCatch: function (node, scope, location, autoReturn) {
    return ast.TryCatch(
      translate(node.tryBody, scope, "statement", autoReturn),
      translate(node.catchIdent, scope, "leftExpression"),
      translate(node.catchBody, scope, "expression", autoReturn)
    );
  },
  TryFinally: function (node, scope, location, autoReturn) {
    return ast.TryFinally(
      translate(node.tryBody, scope, "statement", autoReturn),
      translate(node.finallyBody, scope, "statement")
    );
  },
  Unary: function (node, scope, location, autoReturn) {
    var handler, op;
    op = node.op;
    if (!__owns(unaryOps, op)) {
      throw Error("Unexpected unary operator: " + __strnum(JSON.stringify(op)));
    }
    handler = unaryOps[op];
    if (typeof handler === "function") {
      return handler(node, scope, location, autoReturn);
    } else if (typeof handler === "string") {
      return autoReturn(ast.Unary(handler, translate(node.node, scope, "expression")));
    } else {
      throw Error("Unexpected handler type: " + __typeof(handler));
    }
  },
  UseMacro: function (node, scope, location, autoReturn) {
    var _arr, _i, _len, helper, result, tmp;
    result = translate(node.node, scope, location, autoReturn);
    for (_arr = node.tmps, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      tmp = _arr[_i];
      scope.releaseTmp(tmp);
    }
    for (_arr = node.macroHelpers, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      helper = _arr[_i];
      scope.addHelper(helper);
    }
    return result;
  }
};
function translate(node, scope, location, autoReturn) {
  var ret;
  if (!(node instanceof Object)) {
    throw TypeError("Expected node to be a Object, got " + __typeof(node));
  }
  if (!(scope instanceof Scope)) {
    throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
  }
  if (typeof location !== "string") {
    throw TypeError("Expected location to be a String, got " + __typeof(location));
  }
  if (typeof autoReturn !== "function") {
    autoReturn = makeAutoReturn(autoReturn);
  }
  if (!__owns(translators, node.constructor.cappedName)) {
    throw Error("Unable to translate unknown node type: " + __strnum(String(node.constructor.cappedName)));
  }
  ret = translators[node.constructor.cappedName](node, scope, location, autoReturn);
  if (!(ret instanceof ast.Node) && !(ret instanceof ast.Root)) {
    throw Error("Translated non-node: " + __typeof(ret));
  }
  return ret;
}
function translateArray(nodes, scope, location, autoReturn) {
  if (!__isArray(nodes)) {
    throw TypeError("Expected nodes to be a Array, got " + __typeof(nodes));
  }
  if (!(scope instanceof Scope)) {
    throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
  }
  if (typeof location !== "string") {
    throw TypeError("Expected location to be a String, got " + __typeof(location));
  }
  return (function () {
    var _arr, i, len, node;
    for (_arr = [], i = 0, len = __num(nodes.length); i < len; ++i) {
      node = nodes[i];
      _arr.push(translate(nodes[i], scope, location, i === __num(len) - 1 && autoReturn));
    }
    return _arr;
  }());
}
module.exports = function (node, options) {
  var result, scope;
  if (options == null) {
    options = {};
  }
  scope = Scope(options, false);
  result = translate(node, scope, "statement", false);
  scope.releaseTmps();
  return { node: result, macroHelpers: [] };
};
KNOWN_HELPERS = module.exports.knownHelpers = [];
