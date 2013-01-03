"use strict";
var __cmp, __create, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, __xor, ast, binaryOps, HELPERS, KNOWN_HELPERS, Scope, translators, types, unaryOps;
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
__create = typeof Object.create === "function" ? Object.create : function (x) {
  function F() {}
  F.prototype = x;
  return new F();
};
__isArray = typeof Array.isArray === "function" ? Array.isArray : (function () {
  var _toString;
  _toString = Object.prototype.toString;
  return function (x) {
    return _toString.call(x) === "[object Array]";
  };
}());
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
__slice = Function.prototype.call.bind(Array.prototype.slice);
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
function needsCaching(item) {
  return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
}
Scope = (function () {
  function Scope(options, bound, usedTmps, helpers, macroHelpers, variables, tmps) {
    if (options == null) {
      options = {};
    }
    this.options = options;
    if (bound == null) {
      bound = false;
    }
    this.bound = bound;
    if (usedTmps == null) {
      usedTmps = {};
    }
    this.usedTmps = usedTmps;
    if (helpers == null) {
      helpers = {};
    }
    this.helpers = helpers;
    if (macroHelpers == null) {
      macroHelpers = {};
    }
    this.macroHelpers = macroHelpers;
    if (tmps == null) {
      tmps = {};
    }
    this.tmps = tmps;
    this.variables = variables ? __create(variables) : {};
    this.hasBound = false;
    this.usedThis = false;
  }
  Scope.prototype.maybeCache = function (item, func) {
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
      result = func(ast.Assign(ident, item), ident, true);
      this.releaseIdent(ident);
      return result;
    }
  };
  Scope.prototype.maybeCacheAccess = function (item, func) {
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
          return func(ast.Access(setLeft, setRight), ast.Access(left, right), true);
        });
      });
    } else {
      return func(item, item, false);
    }
  };
  Scope.prototype.reserveIdent = function (namePart) {
    var i, ident, name;
    if (namePart == null) {
      namePart = "ref";
    }
    for (i = 1; ; ++i) {
      name = i === 1 ? "_" + __strnum(namePart) : "_" + __strnum(namePart) + __strnum(i);
      if (!(name in this.usedTmps)) {
        this.usedTmps[name] = true;
        ident = ast.Ident(name);
        this.addVariable(ident);
        return ident;
      }
    }
  };
  Scope.prototype.reserveParam = function () {
    var i, name;
    for (i = 1; ; ++i) {
      name = i === 1 ? "_p" : "_p" + __strnum(i);
      if (!(name in this.usedTmps)) {
        this.usedTmps[name] = true;
        return ast.Ident(name);
      }
    }
  };
  Scope.prototype.getTmp = function (id, name) {
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
  Scope.prototype.releaseTmp = function (id) {
    var ident;
    if (__owns(this.tmps, id)) {
      ident = this.tmps[id];
      delete this.tmps[id];
      this.releaseIdent(ident);
    }
  };
  Scope.prototype.releaseTmps = function () {
    var _obj, id;
    _obj = this.tmps;
    for (id in _obj) {
      if (__owns(_obj, id)) {
        this.releaseTmp(id);
      }
    }
    this.tmps = {};
  };
  Scope.prototype.releaseIdent = function (ident) {
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
  Scope.prototype.markAsParam = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    this.removeVariable(ident);
  };
  Scope.prototype.addHelper = function (name) {
    this.helpers[name] = true;
  };
  function lowerSorter(a, b) {
    return __cmp(a.toLowerCase(), b.toLowerCase());
  }
  Scope.prototype.getHelpers = function () {
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
  Scope.prototype.addMacroHelper = function (name) {
    this.macroHelpers[name] = true;
  };
  Scope.prototype.getMacroHelpers = function () {
    var _this, helpers;
    _this = this;
    helpers = (function () {
      var _arr, _obj, k;
      _arr = [];
      _obj = _this.macroHelpers;
      for (k in _obj) {
        if (__owns(_obj, k)) {
          _arr.push(k);
        }
      }
      return _arr;
    }());
    return helpers.sort(lowerSorter);
  };
  Scope.prototype.addVariable = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    this.variables[ident.name] = true;
  };
  Scope.prototype.removeVariable = function (ident) {
    if (!(ident instanceof ast.Ident)) {
      throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
    }
    delete this.variables[ident.name];
  };
  Scope.prototype.getVariables = function () {
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
  Scope.prototype.clone = function (bound) {
    if (bound) {
      this.hasBound = true;
    }
    return new Scope(
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
    return ast.Binary(ast.Const(""), "+", node);
  } else {
    scope.addHelper("__strnum");
    return ast.Call(ast.Ident("__strnum"), [node]);
  }
}
binaryOps = {
  "~^": function (left, right) {
    return ast.Call(ast.Access(ast.Ident("Math"), ast.Const("pow")), [left, right]);
  },
  "^": function (left, right, scope) {
    return binaryOps["~^"](numWrap(left, scope), numWrap(right, scope));
  },
  "~*": "*",
  "*": function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "*", numWrap(right, scope));
  },
  "~/": "/",
  "/": function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "/", numWrap(right, scope));
  },
  "~%": "%",
  "%": function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "%", numWrap(right, scope));
  },
  "~\\": function (left, right) {
    return ast.Call(ast.Access(ast.Ident("Math"), ast.Const("floor")), [ast.Binary(left, "/", right)]);
  },
  "\\": function (left, right, scope) {
    return binaryOps["~\\"](numWrap(left, scope), numWrap(right, scope));
  },
  "~+": function (left, right) {
    if (!left.type().isSubsetOf(types.number)) {
      left = ast.Unary("+", left);
    }
    if (!right.type().isSubsetOf(types.number)) {
      right = ast.Unary("+", right);
    }
    return ast.Binary(left, "+", right);
  },
  "+": function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "+", numWrap(right, scope));
  },
  "~-": "-",
  "-": function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "-", numWrap(right, scope));
  },
  "~bitlshift": "<<",
  bitlshift: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "<<", numWrap(right, scope));
  },
  "~bitrshift": ">>",
  bitrshift: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), ">>", numWrap(right, scope));
  },
  "~biturshift": ">>>",
  biturshift: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), ">>>", numWrap(right, scope));
  },
  "~min": function (left, right, scope) {
    return scope.maybeCache(left, function (setLeft, left) {
      return scope.maybeCache(right, function (setRight, right) {
        return ast.IfExpression(ast.Binary(setLeft, "<", setRight), left, right);
      });
    });
  },
  min: function (left, right, scope) {
    return scope.maybeCache(left, function (setLeft, left) {
      return scope.maybeCache(right, function (setRight, right) {
        return ast.IfExpression(binaryOps["<"](setLeft, setRight, scope), left, right);
      });
    });
  },
  "~max": function (left, right, scope) {
    return scope.maybeCache(left, function (setLeft, left) {
      return scope.maybeCache(right, function (setRight, right) {
        return ast.IfExpression(ast.Binary(setLeft, ">", setRight), left, right);
      });
    });
  },
  max: function (left, right, scope) {
    return scope.maybeCache(left, function (setLeft, left) {
      return scope.maybeCache(right, function (setRight, right) {
        return ast.IfExpression(binaryOps[">"](setLeft, setRight, scope), left, right);
      });
    });
  },
  "~&": function (left, right) {
    if (left.type().overlaps(types.number) && right.type().overlaps(types.number)) {
      left = ast.Binary(ast.Const(""), "+", left);
    }
    return ast.Binary(left, "+", right);
  },
  "&": function (left, right, scope) {
    if (!left.type().isSubsetOf(types.string)) {
      if (left.type().isSubsetOf(types.stringOrNumber) && !right.type().isSubsetOf(types.string)) {
        left = ast.Binary(ast.Const(""), "+", left);
      } else {
        left = strnumWrap(left, scope);
      }
    }
    if (!right.type().isSubsetOf(types.stringOrNumber)) {
      right = strnumWrap(right, scope);
    }
    return ast.Binary(left, "+", right);
  },
  "in": function (left, right, scope) {
    var elements, len;
    if (right instanceof ast.Arr) {
      elements = right.elements;
      len = elements.length;
      if (len === 0) {
        if (needsCaching(left)) {
          return ast.BlockExpression([left, ast.Const(false)]);
        } else {
          return ast.Const(false);
        }
      } else if (len === 1) {
        return ast.Binary(left, "===", elements[0]);
      } else {
        return scope.maybeCache(left, function (setLeft, left) {
          var check, current, i;
          current = void 0;
          for (i = __num(len) - 1; i > 0; --i) {
            check = ast.Binary(left, "===", elements[i]);
            if (current == null) {
              current = check;
            } else {
              current = ast.Binary(check, "||", current);
            }
          }
          return ast.Binary(ast.Binary(setLeft, "===", elements[0]), "||", current);
        });
      }
    } else {
      scope.addHelper("__in");
      return ast.Call(ast.Ident("__in"), [left, right]);
    }
  },
  haskey: function (left, right, scope) {
    return ast.Binary(right, "in", left);
  },
  ownskey: function (left, right, scope) {
    scope.addHelper("__owns");
    return ast.Call(ast.Ident("__owns"), [left, right]);
  },
  "instanceof": "instanceof",
  instanceofsome: function (left, right, scope) {
    var elements, len;
    if (right instanceof ast.Arr) {
      elements = right.elements;
      len = elements.length;
      if (len === 0) {
        if (needsCaching(left)) {
          return ast.BlockExpression([left, ast.Const(false)]);
        } else {
          return ast.Const(false);
        }
      } else if (len === 1) {
        return ast.Binary(left, "instanceof", elements[0]);
      } else {
        return scope.maybeCache(left, function (setLeft, left) {
          var check, current, i;
          current = void 0;
          for (i = __num(len) - 1; i > 0; --i) {
            check = ast.Binary(left, "instanceof", elements[i]);
            if (current == null) {
              current = check;
            } else {
              current = ast.Binary(check, "||", current);
            }
          }
          return ast.Binary(ast.Binary(setLeft, "instanceof", elements[0]), "||", current);
        });
      }
    } else {
      scope.addHelper("__instanceofsome");
      return ast.Call(ast.Ident("__instanceofsome"), [left, right]);
    }
  },
  "<=>": function (left, right, scope) {
    scope.addHelper("__cmp");
    return ast.Call(ast.Ident("__cmp"), [left, right]);
  },
  "~=": "==",
  "!~=": "!=",
  "==": "===",
  "!=": "!==",
  "~%%": function (left, right) {
    return ast.Binary(ast.Binary(left, "%", right), "===", ast.Const(0));
  },
  "%%": function (left, right, scope) {
    return ast.Binary(ast.Binary(numWrap(left, scope), "%", numWrap(right, scope)), "===", ast.Const(0));
  },
  "!~%%": function (left, right, scope) {
    return ast.Unary("!", binaryOps["~%%"](left, right, scope));
  },
  "!%%": function (left, right, scope) {
    return ast.Unary("!", binaryOps["%%"](left, right, scope));
  },
  "~<": "<",
  "~<=": "<=",
  "~>": ">",
  "~>=": ">=",
  "<": function (left, right, scope) {
    scope.addHelper("__lt");
    return ast.Call(ast.Ident("__lt"), [left, right]);
  },
  "<=": function (left, right, scope) {
    scope.addHelper("__lte");
    return ast.Call(ast.Ident("__lte"), [left, right]);
  },
  ">": function (left, right, scope) {
    scope.addHelper("__lte");
    return ast.Unary("!", ast.Call(ast.Ident("__lte"), [left, right]));
  },
  ">=": function (left, right, scope) {
    scope.addHelper("__lt");
    return ast.Unary("!", ast.Call(ast.Ident("__lt"), [left, right]));
  },
  and: "&&",
  or: "||",
  xor: function (left, right, scope) {
    scope.addHelper("__xor");
    return ast.Call(ast.Ident("__xor"), [left, right]);
  },
  "?": function (left, right, scope) {
    return scope.maybeCache(left, function (setLeft, left) {
      return ast.IfExpression(ast.Binary(setLeft, "!=", ast.Const(null)), left, right);
    });
  },
  "~bitand": "&",
  bitand: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "&", numWrap(right, scope));
  },
  "~bitor": "|",
  bitor: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "|", numWrap(right, scope));
  },
  "~bitxor": "^",
  bitxor: function (left, right, scope) {
    return ast.Binary(numWrap(left, scope), "^", numWrap(right, scope));
  }
};
unaryOps = {
  "~-": "-",
  "-": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("-", numWrap(translate(node.node, scope, "expression"), scope)));
  },
  "~+": "+",
  "+": function (node, scope, location, autoReturn) {
    return autoReturn(numWrap(translate(node.node, scope, "expression"), scope));
  },
  not: "!",
  bool: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("!", ast.Unary("!", translate(node.node, scope, "expression"))));
  },
  "?": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Binary(translate(node.node, scope, "expression"), "!=", ast.Const(null)));
  },
  "~bitnot": "~",
  bitnot: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Unary("~", numWrap(translate(node.node, scope, "expression"), scope)));
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
      return scope.maybeCacheAccess(translate(node.node, scope, "expression"), function (setNode, node) {
        var block, ident;
        ident = scope.reserveIdent("ref");
        block = ast.Block([ast.Assign(ident, setNode), ast.Unary("delete", node, scope, "expression"), ident]);
        scope.releaseIdent(ident);
        return block;
      });
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
      return scope.maybeCache(translate(node.node, scope, "expression"), function (setNode, node) {
        return ast.If(ast.Binary(setNode, "!=", ast.Const(null)), ast.Throw(node, scope, "expression"));
      });
    }
  },
  "^": function (node, scope, location, autoReturn) {
    scope.addHelper("__create");
    return autoReturn(ast.Call(ast.Ident("__create"), [translate(node.node, scope, "expression")]));
  }
};
HELPERS = {};
function wrapInFunctionCall(node) {
  var parser;
  parser = require("./parser");
  return parser.ParserNode("callChain", node.startIndex, node.endIndex, {
    head: parser.ParserNode("function", node.startIndex, node.endIndex, { params: [], autoReturn: true, body: node, bound: true }),
    links: [{ type: "call", args: [], existential: false }]
  });
}
translators = {
  access: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Access(translate(node.parent, scope, "expression"), translate(node.child, scope, "expression")));
  },
  "arguments": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Arguments());
  },
  array: function (node, scope, location, autoReturn) {
    var _arr, _i, _len, array, current, element, i, translatedItem, translatedItems;
    translatedItems = [];
    current = [];
    translatedItems.push(current);
    for (_arr = node.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      element = _arr[_i];
      if (element.type === "spread") {
        translatedItems.push(translate(element.node, scope, "expression"));
        current = [];
        translatedItems.push(current);
      } else {
        current.push(translate(element, scope, "expression"));
      }
    }
    if (translatedItems.length === 1) {
      return autoReturn(ast.Arr(translatedItems[0]));
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
        if (array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray") {
          return autoReturn(ast.Call(ast.Ident("__slice"), array.args));
        } else {
          return autoReturn(array);
        }
      } else {
        return autoReturn(ast.Call(ast.Access(translatedItems[0], ast.Const("concat")), __slice(translatedItems, 1, void 0)));
      }
    }
  },
  assign: (function () {
    var indexes, ops;
    ops = {
      "~^=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["~^"](left, right, scope));
        });
      },
      "^=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["^"](left, right, scope));
        });
      },
      "~*=": "*=",
      "*=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "*=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps["*"](left, right, scope));
          });
        }
      },
      "~/=": "/=",
      "/=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "/=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps["/"](left, right, scope));
          });
        }
      },
      "~%=": "%=",
      "%=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "%=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps["%"](left, right, scope));
          });
        }
      },
      "~\\=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["~\\"](left, right, scope));
        });
      },
      "\\=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["\\"](left, right, scope));
        });
      },
      "~+=": function (left, right, scope) {
        if (right instanceof ast.Const && typeof right.value === "number") {
          if (right.value === 1) {
            return ast.Unary("++", left);
          } else if (right.value === -1) {
            return ast.Unary("--", left);
          } else {
            return ast.Binary(left, "-=", ast.Const(-__num(right.value)));
          }
        } else {
          if (!right.type().isSubsetOf(types.number)) {
            right = ast.Unary("+", right);
          }
          if (!left.type().isSubsetOf(types.number)) {
            return scope.maybeCacheAccess(left, function (setLeft, left) {
              return ast.Assign(setLeft, ast.Binary(ast.Unary("+", left), "+", right));
            });
          } else {
            return ast.Binary(left, "+=", right);
          }
        }
      },
      "+=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          if (right.type().isSubsetOf(types.number)) {
            return ops["~+="](left, right, scope);
          } else {
            return ast.Binary(left, "-=", numWrap(right, scope));
          }
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps["+"](left, right, scope));
          });
        }
      },
      "~-=": function (left, right, scope) {
        if (right instanceof ast.Const && typeof right.value === "number") {
          if (right.value === 1) {
            return ast.Unary("--", left);
          } else if (right.value === -1) {
            return ast.Unary("++", left);
          }
        }
        return ast.Binary(left, "-=", right);
      },
      "-=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          if (right.type().isSubsetOf(types.number)) {
            return ops["~-="](left, right, scope);
          } else {
            return ast.Binary(left, "-=", numWrap(right, scope));
          }
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps["-"](left, right, scope));
          });
        }
      },
      "~bitlshift=": "<<=",
      "bitlshift=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "<<=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitlshift(left, right, scope));
          });
        }
      },
      "~bitrshift=": ">>=",
      "bitrshift=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, ">>=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitrshift(left, right, scope));
          });
        }
      },
      "~biturshift=": ">>>=",
      "biturshift=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, ">>>=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitrshift(left, right, scope));
          });
        }
      },
      "~min=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["~min"](left, right, scope));
        });
      },
      "min=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps.min(left, right, scope));
        });
      },
      "~max=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps["~max"](left, right, scope));
        });
      },
      "max=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, binaryOps.max(left, right, scope));
        });
      },
      "~&=": function (left, right, scope) {
        if (left.type().overlaps(types.number) && right.type().overlaps(types.number)) {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Binary(setLeft, "+=", ast.Binary(ast.Const(""), "+", right));
          });
        } else {
          return ast.Binary(left, "+=", right);
        }
      },
      "&=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.string)) {
          return ast.Binary(left, "+=", strnumWrap(right, scope));
        } else if (left.type().isSubsetOf(types.stringOrNumber)) {
          if (right.type().isSubsetOf(types.string)) {
            return ast.Binary(left, "+=", right);
          } else {
            return ast.Binary(left, "+=", strnumWrap(right, scope));
          }
        } else {
          if (!right.type().isSubsetOf(types.stringOrNumber)) {
            right = strnumWrap(right, scope);
          }
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, ast.Binary(strnumWrap(left, scope), "+", right));
          });
        }
      },
      "and=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Binary(setLeft, "&&", ast.Assign(left, right));
        });
      },
      "or=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Binary(setLeft, "||", ast.Assign(left, right));
        });
      },
      "xor=": function (left, right, scope) {
        scope.addHelper("__xor");
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return ast.Assign(setLeft, ast.Call(ast.Ident("__xor"), [left, right]));
        });
      },
      "?=": function (left, right, scope) {
        return scope.maybeCacheAccess(left, function (setLeft, left) {
          return scope.maybeCache(setLeft, function (setLeft, leftValue) {
            return ast.If(ast.Binary(setLeft, "!=", ast.Const(null)), leftValue, ast.Binary(left, "=", right));
          });
        });
      },
      "~bitand=": "&=",
      "bitand=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "&=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitand(left, right, scope));
          });
        }
      },
      "~bitor=": "|=",
      "bitor=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "|=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitor(left, right, scope));
          });
        }
      },
      "~bitxor=": "^=",
      "bitxor=": function (left, right, scope) {
        if (left.type().isSubsetOf(types.number)) {
          return ast.Binary(left, "^=", numWrap(right, scope));
        } else {
          return scope.maybeCacheAccess(left, function (setLeft, left) {
            return ast.Assign(setLeft, binaryOps.bitxor(left, right, scope));
          });
        }
      },
      ":=": "="
    };
    indexes = {
      single: function (parent, child, value, scope) {
        return ast.Assign(ast.Access(parent, translate(child.node, scope, "expression")), value);
      },
      slice: function (parent, child, value, scope) {
        var left, right;
        left = child.left;
        right = child.right;
        scope.addHelper("__splice");
        return ast.Call(ast.Ident("__splice"), [parent, left && left.type !== "nothing" ? translate(left, scope, "expression") : ast.Const(0), right && right.type !== "nothing" ? translate(right, scope, "expression") : ast.Const(1/0), value]);
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
                _arr.push(ast.Assign(ast.Access(i === 0 ? setParent : parent, element), ast.Access(i === 0 ? setValue : value, ast.Const(i))));
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
      if (op === ":=" && node.left.type === "index") {
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
          throw Error("Unexpected handler type: " + __strnum(__typeof(handler)));
        }
      }
    };
  }()),
  binary: function (node, scope, location, autoReturn) {
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
      throw Error("Unexpected handler type: " + __strnum(__typeof(handler)));
    }
  },
  block: function (node, scope, location, autoReturn) {
    return ast.Block(translateArray(node.nodes, scope, location, autoReturn));
  },
  "break": function (node) {
    return ast.Break();
  },
  callChain: (function () {
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
                    _arr.push(ast.Access(i === 0 ? setParent : parent, element));
                  }
                  return _arr;
                }()));
              });
            };
          }
        };
        return function (links, link, scope, i, current) {
          var makeAccess;
          makeAccess = link.type === "access" ? function (parent) {
            return ast.Access(parent, translate(link.child, scope, "expression"));
          } : link.type === "index" ? (!__owns(indexTypes, link.child.type) ? (function () {
            throw Error("Unknown index type: " + __strnum(link.child.type));
          }()) : void 0, indexTypes[link.child.type](link.child, scope)) : (function () {
            throw Error("Unknown link type: " + __strnum(link.type));
          }());
          if (!link.existential) {
            return handle(links, scope, __num(i) + 1, makeAccess(current));
          } else {
            return scope.maybeCache(current, function (setObj, obj) {
              return ast.If(ast.Binary(setObj, "!=", ast.Const(null)), handle(links, scope, __num(i) + 1, makeAccess(obj)));
            });
          }
        };
      }()),
      index: function () {
        var args;
        args = __slice(arguments);
        return linkTypes.access.apply(this, args);
      },
      call: (function () {
        function handleSpreadCall(func, array, isNew, scope) {
          if (isNew) {
            scope.addHelper("__new");
            return ast.Call(ast.Ident("__new"), [func, array]);
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, function (setParent, parent) {
              return ast.Call(ast.Access(ast.Access(setParent, func.right), ast.Const("apply")), [parent, array]);
            });
          } else {
            return ast.Call(ast.Access(func, ast.Const("apply")), [ast.Const(void 0), array]);
          }
        }
        function makeCall(func, args, isNew, scope) {
          var _i, _len, arg, array, current, i, translatedArg, translatedArgs;
          current = [];
          translatedArgs = [current];
          for (_i = 0, _len = __num(args.length); _i < _len; ++_i) {
            arg = args[_i];
            if (arg.type === "spread") {
              current = [];
              translatedArgs.push(translate(arg.node, scope, "expression"), current);
            } else {
              current.push(translate(arg, scope, "expression"));
            }
          }
          if (translatedArgs.length === 1) {
            return ast.Call(func, translatedArgs[0], isNew);
          } else {
            for (i = __num(translatedArgs.length) - 1; i > -1; --i) {
              translatedArg = translatedArgs[i];
              if (__num(i) % 2 === 0) {
                if (!__lte(translatedArg.length, 0)) {
                  translatedArgs[i] = ast.Arr(translatedArg);
                } else {
                  translatedArgs.splice(i, 1);
                }
              } else if (!translatedArg.type().isSubsetOf(types.array)) {
                scope.addHelper("__slice");
                scope.addHelper("__isArray");
                scope.addHelper("__toArray");
                translatedArgs[i] = ast.Call(ast.Ident("__toArray"), [translatedArg]);
              }
            }
            array = translatedArgs.length === 1 ? translatedArgs[0] : ast.Call(ast.Access(translatedArgs[0], ast.Const("concat")), __slice(translatedArgs, 1, void 0));
            return handleSpreadCall(func, array, isNew, scope);
          }
        }
        return function (links, link, scope, i, current) {
          if (!link.existential) {
            return handle(links, scope, __num(i) + 1, makeCall(current, link.args, link.isNew, scope));
          } else if (current instanceof ast.Binary && current.op === ".") {
            return scope.maybeCache(current.left, function (setParent, parent) {
              return scope.maybeCache(current.right, function (setChild, child) {
                return ast.If(ast.Binary(ast.Unary("typeof", ast.Access(setParent, setChild)), "===", ast.Const("function")), handle(links, scope, __num(i) + 1, makeCall(ast.Access(parent, child), link.args, link.isNew, scope)));
              });
            });
          } else {
            return scope.maybeCache(current, function (setFunc, func) {
              return ast.If(ast.Binary(ast.Unary("typeof", setFunc), "===", ast.Const("function")), handle(links, scope, __num(i) + 1, makeCall(func, link.args, link.isNew, scope)));
            });
          }
        };
      }()),
      "?": function (links, link, scope, i, current) {
        return scope.maybeCache(current, function (setLeft, left) {
          return ast.IfExpression(ast.Binary(setLeft, "!=", ast.Const(null)), left, translate(link.child, scope, "expression"));
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
  "const": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Const(node.value));
  },
  "continue": function () {
    return ast.Continue();
  },
  "debugger": function (node, scope, location, autoReturn) {
    if (location === "expression") {
      return ast.Call(
        ast.Func(null, [], [], [ast.Debugger()]),
        []
      );
    } else {
      return ast.Debugger();
    }
  },
  defineHelper: function (node, scope, location, autoReturn) {
    var ident, value;
    ident = translate(node.name, scope, "leftExpression");
    if (!(ident instanceof ast.Ident)) {
      throw Error("Expected name to be an Ident, got " + __strnum(__typeof(ident)));
    }
    value = translate(node.value, scope, "expression");
    HELPERS[ident.name] = function () {
      return value;
    };
    KNOWN_HELPERS.push(ident.name);
    return ast.BlockExpression();
  },
  "eval": function (node, scope, location, autoReturn) {
    return autoReturn(ast.Eval(translate(node.code, scope, "expression")));
  },
  "for": function (node, scope, location, autoReturn) {
    return ast.For(node.init != null ? translate(node.init, scope, "expression") : void 0, node.test != null ? translate(node.test, scope, "expression") : void 0, node.step != null ? translate(node.step, scope, "expression") : void 0, translate(node.body, scope, "statement"));
  },
  forIn: function (node, scope, location, autoReturn) {
    var key;
    key = translate(node.key, scope, "leftExpression");
    if (!(key instanceof ast.Ident)) {
      throw Error("Expected an Ident for a for-in key");
    }
    scope.addVariable(key);
    return ast.ForIn(key, translate(node.object, scope, "expression"), translate(node.body, scope, "statement"));
  },
  "function": (function () {
    var primitiveTypes, translateParamTypes, translateTypeChecks;
    primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
    function makeTypeCheckTest(ident, type, scope) {
      if (__owns(primitiveTypes, type)) {
        return ast.Binary(ast.Unary("typeof", ident), "!==", ast.Const(primitiveTypes[type]));
      } else if (type === "Array") {
        scope.addHelper("__isArray");
        return ast.Unary("!", ast.Call(ast.Ident("__isArray"), [ident]));
      } else {
        return ast.Unary("!", ast.Binary(ident, "instanceof", ast.Ident(type)));
      }
    }
    translateTypeChecks = {
      ident: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var access, result;
        access = arrayIndex != null ? ast.Access(ident, arrayIndex) : ident;
        scope.addHelper("__typeof");
        result = ast.If(makeTypeCheckTest(access, node.name, scope), ast.Throw(ast.Call(ast.Ident("TypeError"), [arrayIndex != null ? ast.Concat(ast.Const("Expected " + __strnum(ident.name) + "["), arrayIndex, ast.Const("] to be a " + __strnum(node.name) + ", got "), ast.Call(ast.Ident("__typeof"), [access])) : ast.Concat(ast.Const("Expected " + __strnum(ident.name) + " to be a " + __strnum(node.name) + ", got "), ast.Call(ast.Ident("__typeof"), [ident]))])));
        if (!hasDefaultValue && node.name === "Boolean") {
          return ast.If(ast.Binary(ident, "==", ast.Const(null)), ast.Assign(ident, ast.Const(false)), result);
        } else {
          return result;
        }
      },
      access: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var access, type;
        access = arrayIndex != null ? ast.Access(ident, arrayIndex) : ident;
        scope.addHelper("__typeof");
        type = translate(node, scope, "expression");
        return ast.If(ast.Unary("!", ast.Binary(access, "instanceof", type)), ast.Throw(ast.Call(ast.Ident("TypeError"), [arrayIndex != null ? ast.Concat(ast.Const("Expected " + __strnum(ident.name) + "["), arrayIndex, ast.Const("] to be a " + __strnum(type.right.value) + ", got "), ast.Call(ast.Ident("__typeof"), [access])) : ast.Concat(ast.Const("Expected " + __strnum(ident.name) + " to be a " + __strnum(type.right.value) + ", got "), ast.Call(ast.Ident("__typeof"), [ident]))])));
      },
      typeUnion: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var _arr, _i, _len, check, hasBoolean, hasNull, hasVoid, names, result, tests, type;
        if (arrayIndex != null) {
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
          if (type.type === "const") {
            if (type.value === null) {
              hasNull = true;
              names.push("null");
            } else if (type.value === void 0) {
              hasVoid = true;
              names.push("undefined");
            } else {
              throw Error("Unknown const value for typechecking: " + __strnum(String(type.value)));
            }
          } else {
            if (type.type !== "ident") {
              throw Error("Not implemented: typechecking for non-idents/consts within a type-union");
            }
            if (type.name === "Boolean") {
              hasBoolean = true;
            }
            names.push(type.name);
            tests.push(makeTypeCheckTest(ident, type.name, scope));
          }
        }
        if (hasNull && hasVoid && !hasDefaultValue) {
          tests.unshift(ast.Binary(ident, "!=", ast.Const(null)));
        }
        result = ast.If(ast.And.apply(ast, __toArray(tests)), ast.Throw(ast.Call(ast.Ident("TypeError"), [ast.Concat(ast.Const("Expected " + __strnum(ident.name) + " to be a " + __strnum(names.join(" or ")) + ", got "), ast.Call(ast.Ident("__typeof"), [ident]))])));
        if (!hasDefaultValue) {
          if (hasNull || hasVoid) {
            if (__xor(hasNull, hasVoid)) {
              result = ast.If(ast.Binary(ident, "==", ast.Const(null)), ast.Assign(ident, ast.Const(hasNull ? null : void 0)), result);
            }
          } else if (hasBoolean) {
            result = ast.If(ast.Binary(ident, "==", ast.Const(null)), ast.Assign(ident, ast.Const(false)), result);
          }
        }
        return result;
      },
      typeArray: function (ident, node, scope, hasDefaultValue, arrayIndex) {
        var index, length;
        if (arrayIndex) {
          throw Error("Not implemented: arrays within arrays as types");
        }
        scope.addHelper("__isArray");
        index = scope.reserveIdent("i");
        length = scope.reserveIdent("len");
        return ast.If(
          ast.Unary("!", ast.Call(ast.Ident("__isArray"), [ident])),
          ast.Throw(ast.Call(ast.Ident("TypeError"), [ast.Concat(ast.Const("Expected " + __strnum(ident.name) + " to be an Array, got "), ast.Call(ast.Ident("__typeof"), [ident]))])),
          ast.For(
            ast.Block([ast.Assign(index, ast.Const(0)), ast.Assign(length, ast.Access(ident, ast.Const("length")))]),
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
      if (!__owns(translateTypeChecks, node.type)) {
        throw Error("Unknown type: " + __strnum(String(node.type)));
      }
      return translateTypeChecks[node.type](
        ident,
        node,
        scope,
        hasDefaultValue,
        arrayIndex
      );
    }
    translateParamTypes = {
      param: function (param, scope, inner) {
        var ident, init, laterInit, tmp, typeCheck;
        ident = translate(param.ident, scope, "param");
        if (param.ident.type === "tmp") {
          scope.markAsParam(ident);
        }
        laterInit = [];
        if (ident instanceof ast.Binary && ident.op === "." && ident.right instanceof ast.Const && typeof ident.right.value === "string") {
          tmp = ast.Ident(ident.right.value);
          laterInit.push(ast.Binary(ident, "=", tmp));
          ident = tmp;
        }
        if (!(ident instanceof ast.Ident)) {
          throw Error("Expecting param to be an Ident, got " + __strnum(__typeof(ident)));
        }
        if (inner) {
          scope.addVariable(ident);
        }
        init = [];
        typeCheck = param.asType ? translateTypeCheck(ident, param.asType, scope, param.defaultValue != null) : void 0;
        if (param.defaultValue != null) {
          init.push(ast.If(ast.Binary(ident, "==", ast.Const(null)), ast.Assign(ident, translate(param.defaultValue, scope, "expression")), typeCheck));
        } else if (typeCheck) {
          init.push(typeCheck);
        }
        return { init: __toArray(init).concat(__toArray(laterInit)), ident: ident, spread: !!param.spread };
      },
      array: function (array, scope, inner) {
        var _arr, arrayIdent, diff, foundSpread, i, init, len, p, param, spreadCounter;
        arrayIdent = inner ? scope.reserveIdent("p") : scope.reserveParam();
        init = [];
        foundSpread = -1;
        spreadCounter = void 0;
        for (_arr = array.elements, i = 0, len = __num(_arr.length); i < len; ++i) {
          p = _arr[i];
          param = translateParam(p, scope, true);
          if (!param.spread) {
            if (foundSpread === -1) {
              init.push(ast.Assign(param.ident, ast.Access(arrayIdent, ast.Const(i))));
            } else {
              diff = __num(i) - __num(foundSpread) - 1;
              init.push(ast.Assign(param.ident, ast.Access(arrayIdent, diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", ast.Const(diff)))));
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
                ast.Binary(ast.Const(i), "<", ast.Assign(spreadCounter, ast.Binary(ast.Binary(arrayIdent, ".", ast.Const("length")), "-", ast.Const(__num(len) - __num(i) - 1)))),
                ast.Call(ast.Ident("__slice"), [arrayIdent, ast.Const(i), spreadCounter]),
                ast.BlockExpression([ast.Assign(spreadCounter, ast.Const(i)), ast.Arr()])
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
      object: function (object, scope, inner) {
        var _arr, _i, _len, init, key, objectIdent, pair, value;
        objectIdent = inner ? scope.reserveIdent("p") : scope.reserveParam();
        init = [];
        for (_arr = object.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          pair = _arr[_i];
          key = translate(pair.key, scope, "expression");
          if (!(key instanceof ast.Const)) {
            throw Error("Unexpected non-const object key: " + __strnum(__typeof(key)));
          }
          value = translateParam(pair.value, scope, true);
          scope.addVariable(value.ident);
          init.push.apply(init, [ast.Assign(value.ident, ast.Access(objectIdent, key))].concat(__toArray(value.init)));
        }
        if (inner) {
          scope.releaseIdent(objectIdent);
        }
        return { init: init, ident: objectIdent, spread: false };
      }
    };
    function translateParam(param, scope, inner) {
      var type;
      type = param.type;
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
            initializers.push(ast.Assign(param.ident, ast.Access(ast.Arguments(), diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", ast.Const(diff)))));
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
              ast.Binary(ast.Const(i), "<", ast.Assign(spreadCounter, ast.Binary(ast.Binary(ast.Arguments(), ".", ast.Const("length")), "-", ast.Const(__num(len) - __num(i) - 1)))),
              ast.Call(ast.Ident("__slice"), [ast.Arguments(), ast.Const(i), spreadCounter]),
              ast.BlockExpression([ast.Assign(spreadCounter, ast.Const(i)), ast.Arr()])
            )));
          }
        }
        initializers.push.apply(initializers, __toArray(param.init));
      }
      if (spreadCounter) {
        innerScope.releaseIdent(spreadCounter);
      }
      body = translate(node.body, innerScope, "topStatement", node.autoReturn);
      body = body instanceof ast.BlockExpression || body instanceof ast.BlockStatement ? body.body : [body];
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
  ident: function (node, scope, location, autoReturn) {
    return autoReturn(ast.Ident(node.name));
  },
  "if": function (node, scope, location, autoReturn) {
    var innerLocation;
    innerLocation = location === "statement" || location === "topStatement" ? "statement" : location;
    return ast.If(translate(node.test, scope, "expression"), translate(node.whenTrue, scope, innerLocation, autoReturn), node.whenFalse != null ? translate(node.whenFalse, scope, innerLocation, autoReturn) : void 0);
  },
  index: function (node, scope, location, autoReturn) {
    var type;
    type = node.child.type;
    if (type === "single") {
      return autoReturn(ast.Access(translate(node.parent, scope, "expression"), translate(node.child.node, scope, "expression")));
    } else if (type === "multi") {
      throw Error("Not implemented: index multi");
    } else if (type === "slice") {
      throw Error("Not implemented: index slice");
    } else {
      throw Error("Unknown index type: " + __strnum(type));
    }
  },
  "let": (function () {
    var declarables;
    declarables = {
      declarable: function (node, scope) {
        var ident;
        if (node.ident.type === "declarable") {
          return translateDeclarable(node.ident, scope);
        } else {
          ident = translate(node.ident, scope, "leftExpression");
          scope.addVariable(ident);
          return ident;
        }
      }
    };
    function translateDeclarable(node, scope) {
      if (!__owns(declarables, node.type)) {
        throw Error("Unknown declarable type " + __strnum(node.type));
      }
      return declarables[node.type](node, scope);
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
  macroHelper: function (node, scope, location, autoReturn) {
    var name;
    name = node.name;
    scope.addMacroHelper(name);
    return autoReturn(ast.Obj([ast.Obj.Pair("type", ast.Const("ident")), ast.Obj.Pair("name", ast.Const(name))]));
  },
  nothing: function () {
    return ast.BlockExpression();
  },
  object: function (node, scope, location, autoReturn) {
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
            _arr.push(ast.Assign(ast.Access(ident, pair.key), pair.value));
          }
          return _arr;
        }())),
        [ident]
      ));
      scope.releaseIdent(ident);
      return autoReturn(result);
    }
  },
  operator: (function () {
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
          [ast.Return(ast.Binary(numWrap(left, scope), op, numWrap(right, scope)))]
        );
      };
    }
    operators = {
      "~^": function (scope) {
        return ast.Access(ast.Ident("Math"), ast.Const("pow"));
      },
      "^": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Call(ast.Access(ast.Ident("Math"), ast.Const("pow")), [numWrap(left, scope), numWrap(right, scope)]))]
        );
      },
      "*": makeNumOp("*"),
      "/": makeNumOp("/"),
      "%": makeNumOp("%"),
      "~\\": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Call(ast.Access(ast.Ident("Math"), ast.Const("floor")), [ast.Binary(left, "/", right)]))]
        );
      },
      "\\": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Call(ast.Access(ast.Ident("Math"), ast.Const("floor")), [ast.Binary(numWrap(left, scope), "/", numWrap(right, scope))]))]
        );
      },
      "~+": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Binary(ast.Unary("+", left), "+", ast.Unary("+", right)))]
        );
      },
      "+": makeNumOp("+"),
      "-": makeNumOp("-"),
      bitlshift: makeNumOp("<<"),
      bitrshift: makeNumOp(">>"),
      biturshift: makeNumOp(">>>"),
      bitand: makeNumOp("&"),
      bitor: makeNumOp("|"),
      bitxor: makeNumOp("^"),
      "~min": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.IfExpression(ast.Binary(left, "<", right), left, right))]
        );
      },
      min: function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.IfExpression(binaryOps["<"](left, right, scope), left, right))]
        );
      },
      "~max": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.IfExpression(ast.Binary(left, ">", right), left, right))]
        );
      },
      max: function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.IfExpression(binaryOps[">"](left, right, scope), left, right))]
        );
      },
      "~&": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Binary(ast.Binary(ast.Const(""), "+", left), "+", right))]
        );
      },
      "&": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Binary(strnumWrap(left, scope), "+", strnumWrap(right, scope)))]
        );
      },
      "in": function (scope) {
        scope.addHelper("__in");
        return ast.Ident("__in");
      },
      haskey: function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Binary(right, "in", left))]
        );
      },
      ownskey: function (scope) {
        scope.addHelper("__owns");
        return ast.Ident("__owns");
      },
      instanceofsome: function (scope) {
        scope.addHelper("__instanceofsome");
        return ast.Ident("__instanceofsome");
      },
      "<=>": function (scope) {
        scope.addHelper("__cmp");
        return ast.Ident("__cmp");
      },
      "~%%": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(binaryOps["~%%"](left, right, scope))]
        );
      },
      "%%": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(binaryOps["%%"](left, right, scope))]
        );
      },
      "!~%%": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(binaryOps["!~%%"](left, right, scope))]
        );
      },
      "!%%": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(binaryOps["!%%"](left, right, scope))]
        );
      },
      "<": function (scope) {
        scope.addHelper("__lt");
        return ast.Ident("__lt");
      },
      "<=": function (scope) {
        scope.addHelper("__lte");
        return ast.Ident("__lte");
      },
      ">": function (scope) {
        var left, right;
        scope.addHelper("__lte");
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Unary("!", ast.Call(ast.Ident("__lte"), [left, right])))]
        );
      },
      ">=": function (scope) {
        var left, right;
        scope.addHelper("__lt");
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.Unary("!", ast.Call(ast.Ident("__lt"), [left, right])))]
        );
      },
      xor: function (scope) {
        scope.addHelper("__xor");
        return ast.Ident("__xor");
      },
      "?": function (scope) {
        var left, right;
        left = ast.Ident("x");
        right = ast.Ident("y");
        return ast.Func(
          null,
          [left, right],
          [],
          [ast.Return(ast.IfExpression(ast.Binary(left, "!=", ast.Const(null)), left, right))]
        );
      },
      bitnot: function (scope) {
        var left;
        left = ast.Ident("x");
        return ast.Func(
          null,
          [left],
          [],
          [ast.Return(ast.Unary("~", numWrap(left, scope)))]
        );
      },
      bool: function (scope) {
        var value;
        value = ast.Ident("x");
        return ast.Func(
          null,
          [value],
          [],
          [ast.Return(ast.Unary("!", ast.Unary("!", value)))]
        );
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
          [ast.Assign(ident, ast.Access(object, key)), ast.Unary("delete", ast.Access(object, key)), ast.Return(ident)]
        );
      },
      "throw": function (scope) {
        var error;
        error = ast.Ident("e");
        return ast.Func(
          null,
          [error],
          [],
          [ast.Throw(error)]
        );
      },
      "throw?": function (scope) {
        var error;
        error = ast.Ident("e");
        return ast.Func(
          null,
          [error],
          [],
          [ast.IfStatement(ast.Binary(error, "!=", ast.Const(null)), ast.Throw(error))]
        );
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
          [ast.Return(ast.Binary(left, binaryOps[op], right))]
        ));
      } else if (__owns(unaryOps, op) && typeof unaryOps[op] === "string") {
        value = ast.Ident("x");
        return autoReturn(ast.Func(
          null,
          [value],
          [],
          [ast.Return(ast.Unary(unaryOps[op], value))]
        ));
      } else {
        throw Error("Unknown operator: " + __strnum(String(op)));
      }
    };
  }()),
  regexp: function (node, scope, location, autoReturn) {
    var flags, text;
    text = translate(node.text, scope, "expression");
    flags = node.flags;
    if (text instanceof ast.Const && typeof text.value === "string") {
      return autoReturn(ast.Const(RegExp(text.value, flags)));
    } else {
      return autoReturn(ast.Call(ast.Ident("RegExp"), [text, ast.Const(flags)]));
    }
  },
  "return": function (node, scope) {
    var value;
    value = translate(node.node, scope, "expression");
    if (node.existential) {
      return scope.maybeCache(value, function (setValue, value) {
        return ast.IfStatement(ast.Binary(setValue, "!=", ast.Const(null)), ast.Return(value));
      });
    } else {
      return ast.Return(value);
    }
  },
  root: function (node, scope) {
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
      if (!__owns(HELPERS, helper)) {
        throw Error("Helper not defined: " + __strnum(helper));
      }
      ident = ast.Ident(helper);
      scope.addVariable(ident);
      init.push(ast.Assign(ident, HELPERS[helper]()));
    }
    return ast.Root(
      __toArray(init).concat([body]),
      scope.getVariables(),
      ["use strict"]
    );
  },
  string: function (node, scope, location, autoReturn) {
    var _i, _len, current, p, part, parts;
    parts = node.parts;
    current = void 0;
    for (_i = 0, _len = __num(parts.length); _i < _len; ++_i) {
      p = parts[_i];
      part = typeof p === "string" ? ast.Const(p) : translate(p, scope, "expression");
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
  tmp: function (node, scope, location, autoReturn) {
    return autoReturn(scope.getTmp(node.id, node.name));
  },
  "this": function (node, scope, location, autoReturn) {
    scope.usedThis = true;
    return autoReturn(scope.bound ? ast.Ident("_this") : ast.This());
  },
  tryCatch: function (node, scope, location, autoReturn) {
    return ast.TryCatch(translate(node.tryBody, scope, "statement", autoReturn), translate(node.catchIdent, scope, "leftExpression"), translate(node.catchBody, scope, "expression", autoReturn));
  },
  tryFinally: function (node, scope, location, autoReturn) {
    return ast.TryFinally(translate(node.tryBody, scope, "statement", autoReturn), translate(node.finallyBody, scope, "statement"));
  },
  unary: function (node, scope, location, autoReturn) {
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
      throw Error("Unexpected handler type: " + __strnum(__typeof(handler)));
    }
  },
  useMacro: function (node, scope, location, autoReturn) {
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
  if (!__owns(translators, node.type)) {
    throw Error("Unable to translate unknown node type: " + __strnum(JSON.stringify(node.type)));
  }
  return translators[node.type](node, scope, location, autoReturn);
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
  scope = new Scope(options, false);
  result = translate(node, scope, "statement", false);
  scope.releaseTmps();
  return { node: result, macroHelpers: scope.getMacroHelpers() };
};
KNOWN_HELPERS = module.exports.knownHelpers = [];
