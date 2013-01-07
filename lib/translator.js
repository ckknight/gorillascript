(function () {
  "use strict";
  var __cmp, __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, __xor, ast, HELPERS, KNOWN_HELPERS, parser, Scope, translators, types;
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
      function F() {}
      F.prototype = x;
      return new F();
    };
  }
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
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
  }
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
    var _proto, getId;
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
      }
      _this.options = options;
      _this.bound = bound;
      _this.usedTmps = usedTmps;
      _this.helpers = helpers;
      _this.macroHelpers = macroHelpers;
      _this.variables = variables ? __create(variables) : {};
      _this.tmps = tmps;
      _this.hasBound = false;
      _this.usedThis = false;
      _this.id = getId();
      return _this;
    }
    _proto = Scope.prototype;
    Scope.displayName = "Scope";
    getId = (function () {
      var id;
      id = -1;
      return function () {
        return id = __num(id) + 1;
      };
    }());
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
        return this.maybeCache(item.left, function (setLeft, left, leftCached) {
          return _this.maybeCache(item.right, function (setRight, right, rightCached) {
            if (leftCached || rightCached) {
              return func(
                ast.Access(setLeft, setRight),
                ast.Access(left, right),
                true
              );
            } else {
              return func(item, item, false);
            }
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
        }
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
        }
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
    var _arr, _f, _i, _len, current, element, i, translatedItems;
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
      return function () {
        return ast.Arr((function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = translatedItems[0], _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(item());
          }
          return _arr;
        }()));
      };
    } else {
      for (i = __num(translatedItems.length) - 1, _f = function (i) {
        var translatedItem;
        translatedItem = translatedItems[i];
        if (__num(i) % 2 === 0) {
          if (!__lte(translatedItem.length, 0)) {
            return translatedItems[i] = function () {
              return ast.Arr((function () {
                var _arr, _i, _len, item;
                for (_arr = [], _i = 0, _len = __num(translatedItem.length); _i < _len; ++_i) {
                  item = translatedItem[_i];
                  _arr.push(item());
                }
                return _arr;
              }()));
            };
          } else {
            return translatedItems.splice(i, 1);
          }
        } else {
          return translatedItems[i] = function () {
            var item;
            item = translatedItem();
            if (item.type().isSubsetOf(types.array)) {
              return item;
            } else {
              scope.addHelper("__slice");
              scope.addHelper("__isArray");
              scope.addHelper("__toArray");
              return ast.Call(ast.Ident("__toArray"), [item]);
            }
          };
        }
      }; i > -1; --i) {
        _f(i);
      }
      if (translatedItems.length === 1) {
        return function () {
          var array;
          array = translatedItems[0]();
          if (replaceWithSlice && array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray") {
            return ast.Call(ast.Ident("__slice"), array.args);
          } else {
            return array;
          }
        };
      } else {
        return function () {
          var head, rest;
          head = translatedItems[0]();
          rest = (function () {
            var _arr, _arr2, _i, _len, item;
            for (_arr = [], _arr2 = __slice(translatedItems, 1, void 0), _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              item = _arr2[_i];
              _arr.push(item());
            }
            return _arr;
          }());
          return ast.Call(
            ast.Access(head, "concat"),
            rest
          );
        };
      }
    }
  }
  translators = {
    Access: function (node, scope, location, autoReturn) {
      var tChild, tParent;
      tParent = translate(node.parent, scope, "expression");
      tChild = translate(node.child, scope, "expression");
      return function () {
        return autoReturn(ast.Access(tParent(), tChild()));
      };
    },
    AccessIndex: (function () {
      var indexes;
      indexes = {
        single: function (node, scope, location, autoReturn) {
          var tChild, tParent;
          tParent = translate(node.parent, scope, "expression");
          tChild = translate(node.child.node, scope, "expression");
          return function () {
            return autoReturn(ast.Access(tParent(), tChild()));
          };
        },
        multi: function () {
          throw Error("Not implemented: index multi");
        },
        slice: function () {
          throw Error("Not implemented: index slice");
        }
      };
      return function (node, scope, location, autoReturn) {
        var type;
        type = node.child.type;
        if (!__owns(indexes, type)) {
          throw Error("Unknown index type: " + __strnum(type));
        }
        return indexes[type](node, scope, location, autoReturn);
      };
    }()),
    Args: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Arguments());
      };
    },
    Array: function (node, scope, location, autoReturn) {
      var tArr;
      tArr = arrayTranslate(node.elements, scope, true);
      return function () {
        return autoReturn(tArr());
      };
    },
    Assign: (function () {
      var indexes, ops;
      ops = {
        "=": "=",
        "*=": "*=",
        "/=": "/=",
        "%=": "%=",
        "+=": "+=",
        "-=": "-=",
        "<<=": "<<=",
        ">>=": ">>=",
        ">>>=": ">>>=",
        "&=": "&=",
        "|=": "|=",
        "^=": "^="
      };
      indexes = {
        single: function (tParent, child, tValue, scope) {
          var tChild;
          tChild = translate(child.node, scope, "expression");
          return function () {
            return ast.Assign(
              ast.Access(tParent(), tChild()),
              tValue()
            );
          };
        },
        slice: function (tParent, child, value, scope) {
          var left, right, tLeft, tRight;
          left = child.left;
          right = child.right;
          if (left && !(left instanceof parser.Node.Nothing)) {
            tLeft = translate(left, scope, "expression");
          } else {
            tLeft = function () {
              return ast.Const(0);
            };
          }
          if (right && !(right instanceof parser.Node.Nothing)) {
            tRight = translate(right, scope, "expression");
          } else {
            tRight = function () {
              return ast.Const(1/0);
            };
          }
          return function () {
            scope.addHelper("__splice");
            return ast.Call(ast.Ident("__splice"), [tParent(), tLeft(), tRight(), value()]);
          };
        },
        multi: function (tParent, child, tValue, scope, location) {
          var tElements;
          tElements = translateArray(child.elements, scope, "expression");
          return function () {
            return scope.maybeCache(tParent(), function (setParent, parent) {
              return scope.maybeCache(tValue(), function (setValue, value) {
                var lines;
                lines = (function () {
                  var _arr, _len, i, tElement;
                  for (_arr = [], i = 0, _len = __num(tElements.length); i < _len; ++i) {
                    tElement = tElements[i];
                    _arr.push(ast.Assign(
                      ast.Access(
                        i === 0 ? setParent : parent,
                        tElement()
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
          };
        }
      };
      return function (node, scope, location, autoReturn) {
        var left, op, result, right, type;
        op = node.op;
        if (__in(op, "=") && node.left instanceof parser.Node.AccessIndex) {
          type = node.left.child.type;
          if (!__owns(indexes, type)) {
            throw Error("Unexpected index type for assignment: " + __strnum(JSON.stringify(type)));
          }
          result = indexes[type](
            translate(node.left.parent, scope, "expression"),
            node.left.child,
            translate(node.right, scope, "expression"),
            scope,
            location
          );
          return function () {
            return autoReturn(result());
          };
        } else {
          left = translate(node.left, scope, "leftExpression");
          right = translate(node.right, scope, "expression");
          return function () {
            return autoReturn(ast.Binary(left(), op, right()));
          };
        }
      };
    }()),
    Binary: function (node, scope, location, autoReturn) {
      var tLeft, tRight;
      tLeft = translate(node.left, scope, "expression");
      tRight = translate(node.right, scope, "expression");
      return function () {
        return autoReturn(ast.Binary(tLeft(), node.op, tRight()));
      };
    },
    Block: function (node, scope, location, autoReturn) {
      var tNodes;
      tNodes = translateArray(node.nodes, scope, location, autoReturn);
      return function () {
        return ast.Block((function () {
          var _arr, _i, _len, tNode;
          for (_arr = [], _i = 0, _len = __num(tNodes.length); _i < _len; ++_i) {
            tNode = tNodes[_i];
            _arr.push(tNode());
          }
          return _arr;
        }()));
      };
    },
    Break: function () {
      return function () {
        return ast.Break();
      };
    },
    CallChain: (function () {
      var linkTypes;
      linkTypes = {
        access: (function () {
          var indexTypes;
          indexTypes = {
            single: function (child, scope) {
              var tChild;
              tChild = translate(child.node, scope, "expression");
              return function (parent) {
                return ast.Access(parent, tChild());
              };
            },
            slice: function (child, scope) {
              var tLeft, tRight;
              if (child.left) {
                tLeft = translate(child.left, scope, "expression");
              } else {
                tLeft = void 0;
              }
              if (child.right) {
                tRight = translate(child.right, scope, "expression");
              } else {
                tRight = void 0;
              }
              return function (parent) {
                var args;
                args = [parent];
                if (tLeft || tRight) {
                  args.push(tLeft ? tLeft() : ast.Const(0));
                }
                if (tRight) {
                  args.push(tRight());
                }
                scope.addHelper("__slice");
                return ast.Call(ast.Ident("__slice"), args);
              };
            },
            multi: function (child, scope) {
              var tElements;
              tElements = translateArray(child.elements, scope, "expression");
              return function (parent) {
                return scope.maybeCache(parent, function (setParent, parent) {
                  return ast.Arr((function () {
                    var _arr, _len, i, tElement;
                    for (_arr = [], i = 0, _len = __num(tElements.length); i < _len; ++i) {
                      tElement = tElements[i];
                      _arr.push(ast.Access(
                        i === 0 ? setParent : parent,
                        tElement()
                      ));
                    }
                    return _arr;
                  }()));
                });
              };
            }
          };
          return function (links, link, scope, i, tCurrent) {
            var _obj, _setObj, makeAccess, tChild, tRight, uncache;
            if (link.type === "access") {
              tChild = translate(link.child, scope, "expression");
              makeAccess = function (parent) {
                return ast.Access(parent, tChild());
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
            }
            if (!link.existential) {
              return handle(links, scope, __num(i) + 1, function () {
                return makeAccess(tCurrent());
              });
            } else {
              _setObj = void 0;
              _obj = void 0;
              uncache = function () {
                if (_obj === void 0) {
                  scope.maybeCache(tCurrent(), function (setObj, obj) {
                    _setObj = setObj;
                    _obj = obj;
                  });
                  if (_obj === void 0) {
                    throw Error();
                  }
                }
              };
              tRight = handle(links, scope, __num(i) + 1, function () {
                uncache();
                return makeAccess(_obj);
              });
              return function () {
                uncache();
                return ast.If(
                  ast.Binary(_setObj, "!=", null),
                  tRight()
                );
              };
            }
          };
        }()),
        call: (function () {
          function makeMakeCall(args, isNew, isApply, scope) {
            var tArgArray, thisArg, tStart;
            thisArg = void 0;
            if (isApply && (args.length === 0 || !(args[0] instanceof parser.Node.Spread))) {
              if (args.length === 0) {
                tStart = function () {
                  return ast.Const(void 0);
                };
              } else {
                tStart = translate(args[0], scope, "expression");
              }
              tArgArray = arrayTranslate(
                __slice(args, 1, void 0),
                scope,
                false
              );
              return function (func) {
                var argArray;
                argArray = tArgArray();
                if (argArray instanceof ast.Arr) {
                  return ast.Call(
                    ast.Access(func, "call"),
                    [tStart()].concat(__toArray(argArray.elements))
                  );
                } else {
                  return ast.Call(
                    ast.Access(func, "apply"),
                    [tStart(), argArray]
                  );
                }
              };
            } else {
              tArgArray = arrayTranslate(args, scope, false);
              return function (func) {
                var argArray;
                argArray = tArgArray();
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
              };
            }
          }
          return function (links, link, scope, i, tCurrent) {
            var _func, _setFunc, makeCall, tRight, uncache;
            if (link.isNew && link.isApply) {
              throw Error("Cannot have a call link with both is-new and is-apply");
            }
            makeCall = makeMakeCall(link.args, link.isNew, link.isApply, scope);
            if (!link.existential) {
              return handle(links, scope, __num(i) + 1, function () {
                return makeCall(tCurrent());
              });
            } else {
              _setFunc = void 0;
              _func = void 0;
              uncache = function () {
                var current, f;
                if (_func === void 0) {
                  f = function (setFunc, func) {
                    _setFunc = setFunc;
                    _func = func;
                  };
                  current = tCurrent();
                  if (current instanceof ast.Binary && current.op === ".") {
                    scope.maybeCacheAccess(current, f);
                  } else {
                    scope.maybeCache(current, f);
                  }
                  if (_func === void 0) {
                    throw Error();
                  }
                }
              };
              tRight = handle(links, scope, __num(i) + 1, function () {
                uncache();
                return makeCall(_func);
              });
              return function () {
                uncache();
                return ast.If(
                  ast.Binary(
                    ast.Unary("typeof", _setFunc),
                    "===",
                    "function"
                  ),
                  tRight()
                );
              };
            }
          };
        }()),
        "?": function (links, link, scope, i, tCurrent) {
          var tChild;
          tChild = translate(link.child, scope, "expression");
          return function () {
            return scope.maybeCache(tCurrent(), function (setLeft, left) {
              return ast.IfExpression(
                ast.Binary(setLeft, "!=", null),
                left,
                tChild()
              );
            });
          };
        }
      };
      linkTypes.accessIndex = linkTypes.access;
      function handle(links, scope, i, tCurrent) {
        var link;
        if (!__lt(i, links.length)) {
          return tCurrent;
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
            tCurrent
          );
        }
      }
      return function (node, scope, location, autoReturn) {
        var tResult;
        tResult = handle(node.links, scope, 0, translate(node.head, scope, "expression"));
        return function () {
          return autoReturn(tResult());
        };
      };
    }()),
    Const: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Const(node.value));
      };
    },
    Continue: function () {
      return function () {
        return ast.Continue();
      };
    },
    Debugger: function (node, scope, location, autoReturn) {
      if (location === "expression") {
        return function () {
          return ast.Call(
            ast.Func(null, [], [], [ast.Debugger()]),
            []
          );
        };
      } else {
        return function () {
          return ast.Debugger();
        };
      }
    },
    Def: function (node, scope, location, autoReturn) {
      throw Error("Cannot have a stray def");
    },
    DefineHelper: function (node, scope, location, autoReturn) {
      var ident, value;
      ident = translate(node.name, scope, "leftExpression")();
      if (!(ident instanceof ast.Ident)) {
        throw Error("Expected name to be an Ident, got " + __typeof(ident));
      }
      value = translate(node.value, scope, "expression")();
      HELPERS[ident.name] = function () {
        return value;
      };
      KNOWN_HELPERS.push(ident.name);
      return function () {
        return ast.BlockExpression();
      };
    },
    Eval: function (node, scope, location, autoReturn) {
      var tCode;
      tCode = translate(node.code, scope, "expression");
      return function () {
        return autoReturn(ast.Eval(tCode()));
      };
    },
    For: function (node, scope, location, autoReturn) {
      var tBody, tInit, tStep, tTest;
      if (node.init != null) {
        tInit = translate(node.init, scope, "expression");
      } else {
        tInit = void 0;
      }
      if (node.test != null) {
        tTest = translate(node.test, scope, "expression");
      } else {
        tTest = void 0;
      }
      if (node.step != null) {
        tStep = translate(node.step, scope, "expression");
      } else {
        tStep = void 0;
      }
      tBody = translate(node.body, scope, "statement");
      return function () {
        return ast.For(
          tInit != null ? tInit() : void 0,
          tTest != null ? tTest() : void 0,
          tStep != null ? tStep() : void 0,
          tBody()
        );
      };
    },
    ForIn: function (node, scope, location, autoReturn) {
      var tBody, tKey, tObject;
      tKey = translate(node.key, scope, "leftExpression");
      tObject = translate(node.object, scope, "expression");
      tBody = translate(node.body, scope, "statement");
      return function () {
        var key;
        key = tKey();
        if (!(key instanceof ast.Ident)) {
          throw Error("Expected an Ident for a for-in key");
        }
        scope.addVariable(key);
        return ast.ForIn(key, tObject(), tBody());
      };
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
          if (arrayIndex != null) {
            access = ast.Access(ident, arrayIndex);
          } else {
            access = ident;
          }
          scope.addHelper("__typeof");
          result = ast.If(
            makeTypeCheckTest(access, node.name, scope),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              arrayIndex != null
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
          if (arrayIndex != null) {
            access = ast.Access(ident, arrayIndex);
          } else {
            access = ident;
          }
          scope.addHelper("__typeof");
          type = translate(node, scope, "expression")();
          return ast.If(
            ast.Unary("!", ast.Binary(access, "instanceof", type)),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              arrayIndex != null
                ? ast.Concat("Expected " + __strnum(ident.name) + "[", arrayIndex, "] to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [access]))
                : ast.Concat("Expected " + __strnum(ident.name) + " to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [ident]))
            ]))
          );
        },
        TypeUnion: function (ident, node, scope, hasDefaultValue, arrayIndex) {
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
          var index, length, result;
          if (arrayIndex) {
            throw Error("Not implemented: arrays within arrays as types");
          }
          scope.addHelper("__isArray");
          index = scope.reserveIdent("i");
          length = scope.reserveIdent("len");
          result = ast.If(
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
          scope.releaseIdent(index);
          scope.releaseIdent(length);
          return result;
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
          ident = translate(param.ident, scope, "param")();
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
          }
          if (param.defaultValue != null) {
            init.push(ast.If(
              ast.Binary(ident, "==", null),
              ast.Assign(ident, translate(param.defaultValue, scope, "expression")()),
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
          }
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
          }
          init = [];
          for (_arr = object.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            pair = _arr[_i];
            key = translate(pair.key, scope, "expression")();
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
        return function () {
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
          body = translate(node.body, innerScope, "topStatement", node.autoReturn)();
          if (body instanceof ast.BlockExpression || body instanceof ast.BlockStatement) {
            body = body.body;
          } else {
            body = [body];
          }
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
      };
    }()),
    Ident: function (node, scope, location, autoReturn) {
      var name;
      name = node.name;
      if (!__lte(name.length, 2) && name.charCodeAt(0) === 95 && name.charCodeAt(1) === 95) {
        scope.addHelper(name);
      }
      return function () {
        return autoReturn(ast.Ident(name));
      };
    },
    If: function (node, scope, location, autoReturn) {
      var innerLocation, tTest, tWhenFalse, tWhenTrue;
      if (location !== "statement" && location !== "topStatement") {
        innerLocation = location;
      } else {
        innerLocation = "statement";
      }
      tTest = translate(node.test, scope, "expression");
      tWhenTrue = translate(node.whenTrue, scope, innerLocation, autoReturn);
      if (node.whenFalse != null) {
        tWhenFalse = translate(node.whenFalse, scope, innerLocation, autoReturn);
      } else {
        tWhenFalse = void 0;
      }
      return function () {
        return ast.If(tTest(), tWhenTrue(), tWhenFalse != null ? tWhenFalse() : void 0);
      };
    },
    Let: (function () {
      var declarables;
      declarables = {
        Declarable: function (node, scope) {
          var tIdent;
          if (node.ident instanceof parser.Node.Declarable) {
            return translateDeclarable(node.ident, scope);
          } else {
            tIdent = translate(node.ident, scope, "leftExpression");
            return function () {
              var ident;
              ident = tIdent();
              scope.addVariable(ident);
              return ident;
            };
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
        var tLeft, tRight;
        tLeft = translateDeclarable(node.left, scope);
        tRight = translate(node.right, scope, "expression");
        return function () {
          var left, right;
          left = tLeft();
          right = tRight();
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
      };
    }()),
    Nothing: function () {
      return function () {
        return ast.Noop();
      };
    },
    Object: function (node, scope, location, autoReturn) {
      var _arr, _i, _len, pair, tKeys, tValues;
      tKeys = [];
      tValues = [];
      for (_arr = node.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        pair = _arr[_i];
        tKeys.push(translate(pair.key, scope, "expression"));
        tValues.push(translate(pair.value, scope, "expression"));
      }
      return function () {
        var _len, constPairs, currentPairs, i, ident, key, obj, postConstPairs, result, tKey, tValue, value;
        constPairs = [];
        postConstPairs = [];
        currentPairs = constPairs;
        for (i = 0, _len = __num(tKeys.length); i < _len; ++i) {
          tKey = tKeys[i];
          tValue = tValues[i];
          key = tKey();
          value = tValue();
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
      };
    },
    Regexp: function (node, scope, location, autoReturn) {
      var flags, tText;
      tText = translate(node.text, scope, "expression");
      flags = node.flags;
      return function () {
        var text;
        text = tText();
        if (text instanceof ast.Const && typeof text.value === "string") {
          return autoReturn(ast.Const(RegExp(text.value, flags)));
        } else {
          return autoReturn(ast.Call(ast.Ident("RegExp"), [text, ast.Const(flags)]));
        }
      };
    },
    Return: function (node, scope) {
      var tValue;
      tValue = translate(node.node, scope, "expression");
      if (node.existential) {
        return function () {
          return scope.maybeCache(tValue(), function (setValue, value) {
            return ast.IfStatement(
              ast.Binary(setValue, "!=", null),
              ast.Return(value)
            );
          });
        };
      } else {
        return function () {
          return ast.Return(tValue());
        };
      }
    },
    Root: function (node, scope) {
      var tBody;
      tBody = translate(node.body, scope, "topStatement", scope.options["return"]);
      return function () {
        var _arr, _i, _len, body, callFunc, fakeThis, helper, ident, init;
        body = tBody();
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
        if (scope.options.bare) {
          return ast.Root(__toArray(init).concat([body]), scope.getVariables(), ["use strict"]);
        } else {
          callFunc = ast.Call(
            ast.Access(
              ast.Func(
                null,
                [],
                scope.getVariables(),
                __toArray(init).concat([body]),
                ["use strict"]
              ),
              "call"
            ),
            [ast.This()]
          );
          if (scope.options["return"]) {
            callFunc = ast.Return(callFunc);
          }
          return ast.Root([callFunc], [], []);
        }
      };
    },
    String: function (node, scope, location, autoReturn) {
      var parts, tParts;
      parts = node.parts;
      tParts = (function () {
        var _arr, _f, _i, _len;
        for (_arr = [], _i = 0, _len = __num(parts.length), _f = function (_i) {
          var p;
          p = parts[_i];
          if (typeof p === "string") {
            return function () {
              return ast.Const(p);
            };
          } else {
            return translate(p, scope, "expression");
          }
        }; _i < _len; ++_i) {
          _arr.push(_f(_i));
        }
        return _arr;
      }());
      return function () {
        var _i, _len, current, part, tPart;
        current = void 0;
        for (_i = 0, _len = __num(tParts.length); _i < _len; ++_i) {
          tPart = tParts[_i];
          part = tPart();
          if (!part.type().isSubsetOf(types.string)) {
            if (part.type().isSubsetOf(types.stringOrNumber)) {
              if (current == null) {
                current = ast.Const("");
              }
            } else {
              scope.addHelper("__strnum");
              part = ast.Call(ast.Ident("__strnum"), [part]);
            }
          }
          if (current != null) {
            current = ast.Binary(current, "+", part);
          } else {
            current = part;
          }
        }
        if (current == null) {
          current = ast.Const("");
        }
        return autoReturn(current);
      };
    },
    Super: function (node, scope, location, autoReturn) {
      throw Error("Cannot have a stray super call");
    },
    Tmp: function (node, scope, location, autoReturn) {
      var ident;
      ident = scope.getTmp(node.id, node.name);
      return function () {
        return autoReturn(ident);
      };
    },
    This: function (node, scope, location, autoReturn) {
      return function () {
        scope.usedThis = true;
        return autoReturn(scope.bound ? ast.Ident("_this") : ast.This());
      };
    },
    Throw: function (node, scope, location) {
      var tNode;
      if (location === "expression") {
        return translate(wrapInFunctionCall(node), scope, "expression");
      } else {
        tNode = translate(node.node, scope, "expression");
        return function () {
          return ast.Throw(tNode());
        };
      }
    },
    TryCatch: function (node, scope, location, autoReturn) {
      var tCatchBody, tCatchIdent, tTryBody;
      tTryBody = translate(node.tryBody, scope, "statement", autoReturn);
      tCatchIdent = translate(node.catchIdent, scope, "leftExpression");
      tCatchBody = translate(node.catchBody, scope, "statement", autoReturn);
      return function () {
        return ast.TryCatch(tTryBody(), tCatchIdent(), tCatchBody());
      };
    },
    TryFinally: function (node, scope, location, autoReturn) {
      var tFinallyBody, tTryBody;
      tTryBody = translate(node.tryBody, scope, "statement", autoReturn);
      tFinallyBody = translate(node.finallyBody, scope, "statement");
      return function () {
        return ast.TryFinally(tTryBody(), tFinallyBody());
      };
    },
    Unary: function (node, scope, location, autoReturn) {
      var tSubnode;
      tSubnode = translate(node.node, scope, "expression");
      return function () {
        return autoReturn(ast.Unary(node.op, tSubnode()));
      };
    },
    UseMacro: function (node, scope, location, autoReturn) {
      var _arr, _i, _len, tmp, tResult;
      tResult = translate(node.node, scope, location, autoReturn);
      for (_arr = node.tmps, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        tmp = _arr[_i];
        scope.releaseTmp(tmp);
      }
      return function () {
        var _arr, _i, _len, helper, result;
        result = tResult();
        for (_arr = node.macroHelpers, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          helper = _arr[_i];
          scope.addHelper(helper);
        }
        return result;
      };
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
    if (typeof ret !== "function") {
      throw Error("Translated non-function: " + __typeof(ret));
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
    result = translate(node, scope, "statement", false)();
    scope.releaseTmps();
    return { node: result, macroHelpers: [] };
  };
  KNOWN_HELPERS = module.exports.knownHelpers = [];
}.call(this));
