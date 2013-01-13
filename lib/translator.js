(function () {
  "use strict";
  var __cmp, __create, __in, __isArray, __num, __owns, __slice, __strnum, __toArray, __typeof, __xor, ast, GeneratorBuilder, generatorTranslate, Helpers, HELPERS, parser, Scope, translators, Type;
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
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
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
      if (y) {
        return false;
      } else {
        return x;
      }
    } else {
      return y || x;
    }
  };
  ast = require("./ast");
  Type = require("./types");
  parser = require("./parser");
  function needsCaching(item) {
    return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
  }
  Scope = (function () {
    var _proto, getId;
    function Scope(options, bound, usedTmps, helpers, variables, tmps) {
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
      if (tmps == null) {
        tmps = {};
      }
      _this = this instanceof Scope ? this : __create(_proto);
      _this.options = options;
      _this.bound = bound;
      _this.usedTmps = usedTmps;
      _this.helpers = helpers;
      _this.variables = variables ? __create(variables) : {};
      _this.tmps = tmps;
      _this.hasBound = false;
      _this.usedThis = false;
      _this.hasStopIteration = false;
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
        ident = this.reserveIdent("ref", item.type());
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
    _proto.reserveIdent = function (namePart, type) {
      var i, ident, name;
      if (namePart == null) {
        namePart = "ref";
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      for (i = 1; ; ++i) {
        name = i === 1 ? "_" + __strnum(namePart) : "_" + __strnum(namePart) + __strnum(i);
        if (!(name in this.usedTmps)) {
          this.usedTmps[name] = true;
          ident = ast.Ident(name);
          this.addVariable(ident, type);
          return ident;
        }
      }
    };
    _proto.reserveParam = function () {
      var i, name;
      for (i = 1; ; ++i) {
        name = i === 1 ? "_p" : "_p" + __strnum(i);
        if (!(name in this.usedTmps)) {
          this.usedTmps[name] = true;
          return ast.Ident(name);
        }
      }
    };
    _proto.getTmp = function (id, name, type) {
      var tmp, tmps;
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      tmps = this.tmps;
      if (id in tmps) {
        tmp = tmps[id];
        if (tmp instanceof ast.Ident) {
          return tmp;
        }
      }
      return tmps[id] = this.reserveIdent(name || "tmp", type);
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
    _proto.addVariable = function (ident, type) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be a Ident, got " + __typeof(ident));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      this.variables[ident.name] = type;
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
        this.variables,
        __create(this.tmps)
      );
    };
    return Scope;
  }());
  function wrapReturn(x) {
    return x.mutateLast(ast.Return);
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
  HELPERS = new (Helpers = (function () {
    var _proto;
    function Helpers() {
      var _this;
      _this = this instanceof Helpers ? this : __create(_proto);
      _this.data = {};
      return _this;
    }
    _proto = Helpers.prototype;
    Helpers.displayName = "Helpers";
    _proto.add = function (name, value) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (!(value instanceof ast.Expression)) {
        throw TypeError("Expected value to be a Expression, got " + __typeof(value));
      }
      return this.data[name] = value;
    };
    _proto.has = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns(this.data, name);
    };
    _proto.get = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns(this.data, name)) {
        return this.data[name];
      } else {
        throw Error("No such helper: " + __strnum(name));
      }
    };
    return Helpers;
  }()))();
  GeneratorBuilder = (function () {
    var _proto;
    function GeneratorBuilder(scope, states, currentState, stateIdent, pendingFinalliesIdent, finallies, catches, currentCatch) {
      var _this;
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
      }
      if (currentState == null) {
        currentState = 1;
      }
      if (finallies == null) {
        finallies = [];
      }
      if (catches == null) {
        catches = [];
      }
      if (currentCatch == null) {
        currentCatch = [];
      }
      _this = this instanceof GeneratorBuilder ? this : __create(_proto);
      _this.scope = scope;
      _this.states = states != null ? states
        : [
          [
            function () {
              return ast.Throw(ast.Ident("StopIteration"));
            }
          ],
          []
        ];
      _this.currentState = currentState;
      _this.stateIdent = stateIdent != null ? stateIdent : scope.reserveIdent("state", Type.number);
      _this.pendingFinalliesIdent = pendingFinalliesIdent != null ? pendingFinalliesIdent : scope.reserveIdent("finallies", Type["function"].array());
      _this.finallies = finallies;
      _this.catches = catches;
      _this.currentCatch = currentCatch;
      return _this;
    }
    _proto = GeneratorBuilder.prototype;
    GeneratorBuilder.displayName = "GeneratorBuilder";
    _proto.add = function (tNode) {
      if (!(tNode instanceof GeneratorBuilder)) {
        if (typeof tNode !== "function") {
          throw TypeError("Expected node to be a GeneratorBuilder or Function, got " + __typeof(tNode));
        }
        this.states[this.currentState].push(tNode);
        return this;
      } else {
        return tNode;
      }
    };
    _proto["yield"] = function (tNode) {
      var _this, branch;
      _this = this;
      if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be a Function, got " + __typeof(tNode));
      }
      branch = this.branch();
      this.states[this.currentState].push(
        function () {
          return ast.Assign(_this.stateIdent, branch.state);
        },
        function () {
          return ast.Return(tNode());
        }
      );
      return branch.builder;
    };
    _proto.goto = function (tState) {
      var _this;
      _this = this;
      this.states[this.currentState].push(
        function () {
          return ast.Assign(_this.stateIdent, tState());
        },
        function () {
          return ast.Break();
        }
      );
    };
    _proto.pendingFinally = function (tFinallyBody) {
      var _this, ident;
      _this = this;
      if (typeof tFinallyBody !== "function") {
        throw TypeError("Expected tFinallyBody to be a Function, got " + __typeof(tFinallyBody));
      }
      ident = this.scope.reserveIdent("finally", Type["function"]);
      this.scope.removeVariable(ident);
      this.finallies.push(function () {
        return ast.Func(ident, [], [], tFinallyBody());
      });
      this.states[this.currentState].push(function () {
        return ast.Call(
          ast.Access(_this.pendingFinalliesIdent, "push"),
          [ident]
        );
      });
      return this;
    };
    _proto.runPendingFinally = function () {
      var _this;
      _this = this;
      this.states[this.currentState].push(function () {
        return ast.Call(
          ast.Access(
            ast.Call(ast.Access(_this.pendingFinalliesIdent, "pop")),
            "call"
          ),
          [ast.This()]
        );
      });
      return this;
    };
    _proto.noop = function () {
      var _this, branch;
      _this = this;
      if (this.states[this.currentState].length) {
        branch = this.branch();
        this.states[this.currentState].push(function () {
          return ast.Assign(_this.stateIdent, branch.state);
        });
        return branch.builder;
      } else {
        return this;
      }
    };
    _proto.enterTryCatch = function () {
      var fresh;
      fresh = this.noop();
      fresh.currentCatch = __toArray(fresh.currentCatch).concat([[fresh.currentState]]);
      return fresh;
    };
    _proto.exitTryCatch = function (tIdent, tPostState) {
      var catchStates, fresh;
      if (typeof tIdent !== "function") {
        throw TypeError("Expected tIdent to be a Function, got " + __typeof(tIdent));
      }
      if (typeof tPostState !== "function") {
        throw TypeError("Expected tPostState to be a Function, got " + __typeof(tPostState));
      }
      if (this.currentCatch.length === 0) {
        throw Error("Unable to exit-try-catch without first using enter-try-catch");
      }
      this.goto(tPostState);
      fresh = this.noop();
      catchStates = fresh.currentCatch.pop();
      catchStates.splice(catchStates.indexOf(fresh.currentState), 1);
      fresh.catches.push({ tryStates: catchStates, tIdent: tIdent, catchState: fresh.currentState });
      return fresh;
    };
    _proto.branch = function () {
      var state;
      state = this.states.length;
      if (this.currentCatch.length) {
        this.currentCatch[__num(this.currentCatch.length) - 1].push(state);
      }
      this.states.push([]);
      return {
        state: state,
        builder: GeneratorBuilder(
          this.scope,
          this.states,
          state,
          this.stateIdent,
          this.pendingFinalliesIdent,
          this.finallies,
          this.catches,
          this.currentCatch
        )
      };
    };
    _proto.create = function () {
      var _this, body, catches, close, err, f, innerScope, scope, stateIdent;
      _this = this;
      if (this.currentCatch.length) {
        throw Error("Cannot create a generator if there are stray catches");
      }
      this.states[this.currentState].push(function () {
        return ast.Assign(_this.stateIdent, 0);
      });
      body = [ast.Assign(this.stateIdent, 1)];
      close = this.scope.reserveIdent("close", Type["function"]);
      this.scope.removeVariable(close);
      if (this.finallies.length === 0) {
        this.scope.removeVariable(this.pendingFinalliesIdent);
        body.push(ast.Func(close, [], [], ast.Block([ast.Assign(this.stateIdent, 0)])));
      } else {
        body.push(ast.Assign(this.pendingFinalliesIdent, ast.Arr()));
        body.push.apply(body, __toArray((function () {
          var _arr, _arr2, _i, _len, f;
          for (_arr = [], _arr2 = _this.finallies, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
            f = _arr2[_i];
            _arr.push(f());
          }
          return _arr;
        }())));
        innerScope = this.scope.clone(false);
        f = innerScope.reserveIdent("f", Type["function"].union(Type["undefined"]));
        body.push(ast.Func(close, [], innerScope.getVariables(), ast.Block([
          ast.Assign(this.stateIdent, 0),
          ast.Assign(f, ast.Call(ast.Access(this.pendingFinalliesIdent, "pop"))),
          ast.If(f, ast.TryFinally(ast.Call(f), ast.Call(close)))
        ])));
      }
      scope = this.scope;
      err = scope.reserveIdent("e", Type.any);
      catches = this.catches;
      stateIdent = this.stateIdent;
      body.push(ast.Return(ast.Obj([
        ast.Obj.Pair("close", close),
        ast.Obj.Pair("next", ast.Func(null, [], [], ast.While(true, ast.TryCatch(
          ast.Switch(
            stateIdent,
            (function () {
              var _arr, _arr2, _f, _len, i;
              for (_arr = [], _arr2 = _this.states, i = 0, _len = __num(_arr2.length), _f = function (i) {
                var state;
                state = _arr2[i];
                return ast.Switch.Case(i, ast.Block(__toArray((function () {
                  var _arr3, _i, _len2, item;
                  for (_arr3 = [], _i = 0, _len2 = __num(state.length); _i < _len2; ++_i) {
                    item = state[_i];
                    _arr3.push(item());
                  }
                  return _arr3;
                }())).concat([ast.Break()])));
              }; i < _len; ++i) {
                _arr.push(_f(i));
              }
              return _arr;
            }()),
            ast.Throw(ast.Call(ast.Ident("Error")))
          ),
          err,
          (function () {
            var _f, current, i;
            current = ast.Block([ast.Call(close), ast.Throw(err)]);
            for (i = __num(catches.length) - 1, _f = function (i) {
              var catchInfo, errIdent;
              catchInfo = catches[i];
              errIdent = catchInfo.tIdent();
              scope.addVariable(errIdent);
              return current = ast.If(
                ast.Or.apply(ast, __toArray((function () {
                  var _arr, _arr2, _i, _len, state;
                  for (_arr = [], _arr2 = catchInfo.tryStates, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
                    state = _arr2[_i];
                    _arr.push(ast.Binary(stateIdent, "===", state));
                  }
                  return _arr;
                }()))),
                ast.Block([
                  ast.Assign(errIdent, err),
                  ast.Assign(stateIdent, catchInfo.catchState)
                ]),
                current
              );
            }; i >= 0; --i) {
              _f(i);
            }
            return current;
          }())
        ))))
      ])));
      return ast.Block(body);
    };
    return GeneratorBuilder;
  }());
  function wrapInFunctionCall(node) {
    return parser.Node.Call(
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
      []
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
  generatorTranslate = (function () {
    var generatorTranslators;
    generatorTranslators = {
      Block: function (node, scope, builder, breakState, continueState) {
        var _arr, _i, _len, subnode;
        for (_arr = node.nodes, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          subnode = _arr[_i];
          builder = generatorTranslate(
            subnode,
            scope,
            builder,
            breakState,
            continueState
          );
        }
        return builder;
      },
      Break: function (node, scope, builder, breakState) {
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(breakState);
        return builder;
      },
      Continue: function (node, scope, builder, breakState, continueState) {
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(continueState);
        return builder;
      },
      For: function (node, scope, builder) {
        var bodyBranch, postBranch, stepBranch, testBranch, tTest;
        if (node.init != null) {
          builder = generatorTranslate(node.init, scope, builder);
        }
        stepBranch = builder.branch();
        stepBranch.builder = generatorTranslate(node.step, scope, stepBranch.builder);
        testBranch = builder.branch();
        tTest = translate(node.test, scope, "expression", false);
        bodyBranch = builder.branch();
        bodyBranch.builder = generatorTranslate(
          node.body,
          scope,
          bodyBranch.builder,
          function () {
            return postBranch.state;
          },
          function () {
            return stepBranch.state;
          }
        );
        postBranch = builder.branch();
        builder.goto(function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(function () {
          return testBranch.state;
        });
        testBranch.builder.goto(function () {
          return ast.IfExpression(tTest(), bodyBranch.state, postBranch.state);
        });
        bodyBranch.builder.goto(function () {
          return stepBranch.state;
        });
        return postBranch.builder;
      },
      ForIn: function (node, scope, builder) {
        var bodyBranch, index, key, keys, length, postBranch, stepBranch, testBranch, tKey, tObject;
        tKey = translate(node.key, scope, "leftExpression");
        tObject = translate(node.object, scope, "expression");
        keys = scope.reserveIdent("keys", Type.string.array());
        key = void 0;
        function getKey() {
          if (key != null) {
            return key;
          } else {
            key = tKey();
            if (!(key instanceof ast.Ident)) {
              throw Error("Expected an Ident for a for-in key");
            }
            scope.addVariable(key, Type.string);
            return key;
          }
        }
        index = scope.reserveIdent("i", Type.number);
        length = scope.reserveIdent("len", Type.number);
        builder.add(function () {
          return ast.Block([
            ast.Assign(keys, ast.Arr()),
            ast.ForIn(getKey(), tObject(), ast.Call(
              ast.Access(keys, "push"),
              [getKey()]
            )),
            ast.Assign(index, 0),
            ast.Assign(length, ast.Access(keys, "length"))
          ]);
        });
        stepBranch = builder.branch();
        stepBranch.builder.add(function () {
          return ast.Unary("++", index);
        });
        testBranch = builder.branch();
        bodyBranch = builder.branch();
        bodyBranch.builder.add(function () {
          return ast.Assign(getKey(), ast.Access(keys, index));
        });
        bodyBranch.builder = generatorTranslate(
          node.body,
          scope,
          bodyBranch.builder,
          function () {
            return postBranch.state;
          },
          function () {
            return stepBranch.state;
          }
        );
        postBranch = builder.branch();
        builder.goto(function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(function () {
          return testBranch.state;
        });
        testBranch.builder.goto(function () {
          return ast.IfExpression(
            ast.Binary(index, "<", length),
            bodyBranch.state,
            postBranch.state
          );
        });
        bodyBranch.builder.goto(function () {
          return stepBranch.state;
        });
        return postBranch.builder;
      },
      If: function (node, scope, builder, breakState, continueState) {
        var gWhenFalse, gWhenTrue, postBranch, tTest, whenFalse, whenFalseBranch, whenTrueBranch;
        tTest = translate(node.test, scope, "expression");
        whenTrueBranch = builder.branch();
        gWhenTrue = generatorTranslate(
          node.whenTrue,
          scope,
          whenTrueBranch.builder,
          breakState,
          continueState
        );
        whenFalse = node.whenFalse;
        if (whenFalse instanceof parser.Node.Nothing) {
          whenFalse = null;
        }
        whenFalseBranch = whenFalse != null ? builder.branch() : void 0;
        gWhenFalse = whenFalse != null
          ? generatorTranslate(
            node.whenFalse,
            scope,
            whenFalseBranch.builder,
            breakState,
            continueState
          )
          : void 0;
        postBranch = builder.branch();
        builder.goto(function () {
          return ast.IfExpression(tTest(), whenTrueBranch.state, whenFalseBranch != null ? whenFalseBranch.state : postBranch.state);
        });
        gWhenTrue.goto(function () {
          return postBranch.state;
        });
        if (whenFalse != null) {
          gWhenFalse.goto(function () {
            return postBranch.state;
          });
        }
        return postBranch.builder;
      },
      TmpWrapper: function (node, scope, builder, breakState, continueState) {
        var _arr, _i, _len, tmp;
        builder = generatorTranslate(
          node.node,
          scope,
          builder,
          breakState,
          continueState
        );
        for (_arr = node.tmps, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          tmp = _arr[_i];
          scope.releaseTmp(tmp);
        }
        return builder;
      },
      TryCatch: function (node, scope, builder, breakState, continueState) {
        var postBranch;
        builder = builder.enterTryCatch();
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        builder = builder.exitTryCatch(
          translate(node.catchIdent, scope, "leftExpression", false),
          function () {
            return postBranch.state;
          }
        );
        builder = generatorTranslate(
          node.catchBody,
          scope,
          builder,
          breakState,
          continueState
        );
        postBranch = builder.branch();
        builder.goto(function () {
          return postBranch.state;
        });
        return postBranch.builder;
      },
      TryFinally: function (node, scope, builder, breakState, continueState) {
        builder = builder.pendingFinally(translate(node.finallyBody, scope, "topStatement"));
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        return builder.runPendingFinally();
      },
      Yield: function (node, scope, builder) {
        if (node.multiple) {
          throw Error("Not implemented: yield*");
        }
        return builder["yield"](translate(node.node, scope, "expression"));
      }
    };
    return function (node, scope, builder, breakState, continueState) {
      var ret;
      if (__owns(generatorTranslators, node.constructor.cappedName)) {
        ret = generatorTranslators[node.constructor.cappedName](
          node,
          scope,
          builder,
          breakState,
          continueState
        );
        if (!(ret instanceof GeneratorBuilder)) {
          throw Error("Translated non-GeneratorBuilder: " + __typeof(ret));
        }
        return ret;
      } else {
        return builder.add(translate(node, scope, "statement", false));
      }
    };
  }());
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
          if (__num(translatedItem.length) > 0) {
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
            if (item.type().isSubsetOf(Type.array)) {
              return item;
            } else {
              scope.addHelper("__slice");
              scope.addHelper("__isArray");
              scope.addHelper("__toArray");
              return ast.Call(ast.Ident("__toArray"), [item]);
            }
          };
        }
      }; i >= 0; --i) {
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
        slice: function (tParent, child, value, scope) {
          var left, right, tLeft, tRight;
          left = child.left;
          right = child.right;
          tLeft = left && !(left instanceof parser.Node.Nothing) ? translate(left, scope, "expression")
            : function () {
              return ast.Const(0);
            };
          tRight = right && !(right instanceof parser.Node.Nothing) ? translate(right, scope, "expression")
            : function () {
              return ast.Const(1/0);
            };
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
    Call: function (node, scope, location, autoReturn) {
      var args, isApply, isNew, tArgArray, tFunc, tStart;
      tFunc = translate(node.func, scope, "expression");
      isApply = node.isApply;
      isNew = node.isNew;
      args = node.args;
      if (isApply && (args.length === 0 || !(args[0] instanceof parser.Node.Spread))) {
        tStart = args.length === 0
          ? function () {
            return ast.Const(void 0);
          }
          : translate(args[0], scope, "expression");
        tArgArray = arrayTranslate(
          __slice(args, 1, void 0),
          scope,
          false
        );
        return function () {
          var argArray, func, start;
          func = tFunc();
          start = tStart();
          argArray = tArgArray();
          if (argArray instanceof ast.Arr) {
            return autoReturn(ast.Call(
              ast.Access(func, "call"),
              [start].concat(__toArray(argArray.elements))
            ));
          } else {
            return autoReturn(ast.Call(
              ast.Access(func, "apply"),
              [start, argArray]
            ));
          }
        };
      } else {
        tArgArray = arrayTranslate(args, scope, false);
        return function () {
          var argArray, func;
          func = tFunc();
          argArray = tArgArray();
          if (isApply) {
            return scope.maybeCache(argArray, function (setArray, array) {
              scope.addHelper("__slice");
              return autoReturn(ast.Call(
                ast.Access(func, "apply"),
                [
                  ast.Access(setArray, 0),
                  ast.Call(ast.Ident("__slice"), [array, ast.Const(1)])
                ]
              ));
            });
          } else if (argArray instanceof ast.Arr) {
            return autoReturn(ast.Call(func, argArray.elements, isNew));
          } else if (isNew) {
            scope.addHelper("__new");
            return autoReturn(ast.Call(ast.Ident("__new"), [func, argArray]));
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, function (setParent, parent) {
              return autoReturn(ast.Call(
                ast.Access(
                  ast.Access(setParent, func.right),
                  "apply"
                ),
                [parent, argArray]
              ));
            });
          } else {
            return autoReturn(ast.Call(
              ast.Access(func, "apply"),
              [ast.Const(void 0), argArray]
            ));
          }
        };
      }
    },
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
            ast.Func(null, [], [], ast.Debugger()),
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
    Eval: function (node, scope, location, autoReturn) {
      var tCode;
      tCode = translate(node.code, scope, "expression");
      return function () {
        return autoReturn(ast.Eval(tCode()));
      };
    },
    For: function (node, scope, location, autoReturn) {
      var tBody, tInit, tStep, tTest;
      tInit = node.init != null ? translate(node.init, scope, "expression") : void 0;
      tTest = node.test != null ? translate(node.test, scope, "expression") : void 0;
      tStep = node.step != null ? translate(node.step, scope, "expression") : void 0;
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
        scope.addVariable(key, Type.string);
        return ast.ForIn(key, tObject(), tBody());
      };
    },
    Function: (function () {
      var primitiveTypes, translateParamTypes, translateType, translateTypeChecks;
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
          access = arrayIndex != null ? ast.Access(ident, arrayIndex) : ident;
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
            return {
              check: ast.If(
                ast.Binary(ident, "==", null),
                ast.Assign(ident, ast.Const(false)),
                result
              ),
              type: Type.boolean
            };
          } else {
            return {
              check: result,
              type: __owns(primitiveTypes, node.name) ? Type[primitiveTypes[node.name]] : Type.any
            };
          }
        },
        Access: function (ident, node, scope, hasDefaultValue, arrayIndex) {
          var access, type;
          access = arrayIndex != null ? ast.Access(ident, arrayIndex) : ident;
          scope.addHelper("__typeof");
          type = translate(node, scope, "expression")();
          return {
            check: ast.If(
              ast.Unary("!", ast.Binary(access, "instanceof", type)),
              ast.Throw(ast.Call(ast.Ident("TypeError"), [
                arrayIndex != null
                  ? ast.Concat("Expected " + __strnum(ident.name) + "[", arrayIndex, "] to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [access]))
                  : ast.Concat("Expected " + __strnum(ident.name) + " to be a " + __strnum(type.right.value) + ", got ", ast.Call(ast.Ident("__typeof"), [ident]))
              ]))
            ),
            type: Type.any
          };
        },
        TypeUnion: function (ident, node, scope, hasDefaultValue, arrayIndex) {
          var _arr, _i, _len, check, hasBoolean, hasNull, hasVoid, names, result, tests, type, types;
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
          types = [];
          for (_arr = node.types, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            type = _arr[_i];
            if (type instanceof parser.Node.Const) {
              if (type.value === null) {
                hasNull = true;
                names.push("null");
                types.push(Type["null"]);
              } else if (type.value === void 0) {
                hasVoid = true;
                names.push("undefined");
                types.push(Type["undefined"]);
              } else {
                throw Error("Unknown const value for typechecking: " + String(type.value));
              }
            } else if (type instanceof parser.Node.Ident) {
              if (type.name === "Boolean") {
                hasBoolean = true;
              }
              names.push(type.name);
              tests.push(makeTypeCheckTest(ident, type.name, scope));
              types.push(__owns(primitiveTypes, type.name) ? Type[primitiveTypes[type.name]] : Type.any);
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
          return {
            check: result,
            type: (function () {
              var current;
              current = Type.none;
              (function () {
                var _arr, _i, _len, type;
                for (_arr = [], _i = 0, _len = __num(types.length); _i < _len; ++_i) {
                  type = types[_i];
                  _arr.push(current = current.union(type));
                }
                return _arr;
              }());
              return current;
            }())
          };
        },
        TypeArray: function (ident, node, scope, hasDefaultValue, arrayIndex) {
          var index, length, result, subCheck;
          if (arrayIndex) {
            throw Error("Not implemented: arrays within arrays as types");
          }
          scope.addHelper("__isArray");
          index = scope.reserveIdent("i", Type.number);
          length = scope.reserveIdent("len", Type.number);
          subCheck = translateTypeCheck(
            ident,
            node.subtype,
            scope,
            false,
            index
          );
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
              subCheck.check
            )
          );
          scope.releaseIdent(index);
          scope.releaseIdent(length);
          return { check: result, type: subCheck.type.array() };
        }
      };
      function translateTypeCheck(ident, node, scope, hasDefaultValue, arrayIndex) {
        if (!__owns(translateTypeChecks, node.constructor.cappedName)) {
          throw Error("Unknown type: " + String(node.constructor.cappedName));
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
          typeCheck = param.asType ? translateTypeCheck(ident, param.asType, scope, param.defaultValue != null) : void 0;
          if (inner) {
            scope.addVariable(ident, typeCheck != null ? typeCheck.type : void 0);
          }
          init = [];
          if (param.defaultValue != null) {
            init.push(ast.If(
              ast.Binary(ident, "==", null),
              ast.Assign(ident, translate(param.defaultValue, scope, "expression")()),
              typeCheck != null ? typeCheck.check : void 0
            ));
          } else if (typeCheck) {
            init.push(typeCheck.check);
          }
          return { init: __toArray(init).concat(__toArray(laterInit)), ident: ident, spread: !!param.spread };
        },
        Array: function (array, scope, inner) {
          var _arr, arrayIdent, diff, foundSpread, i, init, len, p, param, spreadCounter;
          arrayIdent = inner ? scope.reserveIdent("p", Type.array) : scope.reserveParam();
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
                spreadCounter = scope.reserveIdent("i", Type.number);
                init.push(ast.Assign(param.ident, ast.IfExpression(
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
          objectIdent = inner ? scope.reserveIdent("p", Type.object) : scope.reserveParam();
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
      translateType = (function () {
        var translateTypes;
        translateTypes = {
          Ident: (function () {
            var primordialTypes;
            primordialTypes = {
              String: Type.string,
              Number: Type.number,
              Boolean: Type.boolean,
              Function: Type["function"],
              Array: Type.array
            };
            return function (node, scope) {
              if (!__owns(primordialTypes, node.name)) {
                throw Error("Not implemented: custom type " + __strnum(node.name));
              }
              return primordialTypes[node.name];
            };
          }()),
          Const: function (node, scope) {
            switch (node.value) {
            case null:
              return Type["null"];
            case void 0:
              return Type["undefined"];
            default:
              throw Error("Unexpected const type: " + String(node.value));
            }
          },
          TypeArray: function (node, scope) {
            return translateType(node.subtype, scope).array();
          },
          TypeUnion: function (node, scope) {
            var _arr, _i, _len, current, type;
            current = Type.none;
            for (_arr = node.types, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              type = _arr[_i];
              current = current.union(translateType(type));
            }
            return current;
          }
        };
        return function (node, scope) {
          if (!__owns(translateTypes, node.constructor.cappedName)) {
            throw Error("Unknown type to translate: " + String(node.constructor.cappedName));
          }
          return translateTypes[node.constructor.cappedName](node, scope);
        };
      }());
      return function (node, scope, location, autoReturn) {
        return function () {
          var _arr, asType, body, diff, fakeThis, foundSpread, func, i, initializers, innerScope, len, p, param, paramIdents, spreadCounter;
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
              innerScope.addVariable(param.ident, Type.array);
              if (i === __num(len) - 1) {
                initializers.push(ast.Assign(param.ident, ast.Call(ast.Ident("__slice"), [ast.Arguments()].concat(i === 0 ? [] : [ast.Const(i)]))));
              } else {
                spreadCounter = innerScope.reserveIdent("ref", Type.number);
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
          body = node.generator
            ? generatorTranslate(node.body, innerScope, GeneratorBuilder(innerScope)).create()
            : translate(node.body, innerScope, "topStatement", node.autoReturn)();
          innerScope.releaseTmps();
          body = ast.Block(__toArray(initializers).concat([body]));
          if (innerScope.usedThis) {
            if (innerScope.bound) {
              scope.usedThis = true;
            }
            if (innerScope.hasBound && !innerScope.bound) {
              fakeThis = ast.Ident("_this");
              innerScope.addVariable(fakeThis);
              body = ast.Block([
                ast.Assign(fakeThis, ast.This()),
                body
              ]);
            }
          }
          if (innerScope.hasStopIteration) {
            scope.hasStopIteration = true;
          }
          asType = node.asType != null ? translateType(node.asType, scope) : void 0;
          func = ast.Func(
            null,
            paramIdents,
            innerScope.getVariables(),
            body,
            [],
            { asType: asType }
          );
          return autoReturn(func);
        };
      };
    }()),
    Ident: function (node, scope, location, autoReturn) {
      var name;
      name = node.name;
      if (__num(name.length) > 2 && name.charCodeAt(0) === 95 && name.charCodeAt(1) === 95) {
        scope.addHelper(name);
      }
      if (name === "StopIteration") {
        scope.hasStopIteration = true;
      }
      return function () {
        return autoReturn(ast.Ident(name));
      };
    },
    If: function (node, scope, location, autoReturn) {
      var innerLocation, tTest, tWhenFalse, tWhenTrue;
      innerLocation = location === "statement" || location === "topStatement" ? "statement" : location;
      tTest = translate(node.test, scope, "expression");
      tWhenTrue = translate(node.whenTrue, scope, innerLocation, autoReturn);
      tWhenFalse = node.whenFalse != null ? translate(node.whenFalse, scope, innerLocation, autoReturn) : void 0;
      return function () {
        return ast.If(tTest(), tWhenTrue(), tWhenFalse != null ? tWhenFalse() : void 0);
      };
    },
    Let: (function () {
      var ArrayDeclarable, declarables, ObjectDeclarable;
      ArrayDeclarable = (function () {
        var _proto;
        function ArrayDeclarable(elements) {
          var _this;
          _this = this instanceof ArrayDeclarable ? this : __create(_proto);
          _this.elements = elements;
          return _this;
        }
        _proto = ArrayDeclarable.prototype;
        ArrayDeclarable.displayName = "ArrayDeclarable";
        return ArrayDeclarable;
      }());
      ObjectDeclarable = (function () {
        var _proto;
        function ObjectDeclarable(pairs) {
          var _this;
          _this = this instanceof ObjectDeclarable ? this : __create(_proto);
          _this.pairs = pairs;
          return _this;
        }
        _proto = ObjectDeclarable.prototype;
        ObjectDeclarable.displayName = "ObjectDeclarable";
        return ObjectDeclarable;
      }());
      declarables = {
        Declarable: function (node, scope) {
          var _ref, tIdent;
          if ((_ref = node.ident) instanceof parser.Node.Declarable || _ref instanceof parser.Node.ArrayDeclarable || _ref instanceof parser.Node.ObjectDeclarable) {
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
        },
        ArrayDeclarable: function (node, scope) {
          var elements;
          elements = (function () {
            var _arr, _arr2, _i, _len, element;
            for (_arr = [], _arr2 = node.elements, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              element = _arr2[_i];
              _arr.push({
                tDeclarable: translateDeclarable(element, scope),
                spread: element.spread
              });
            }
            return _arr;
          }());
          return function () {
            return ArrayDeclarable((function () {
              var _arr, _i, _len, element;
              for (_arr = [], _i = 0, _len = __num(elements.length); _i < _len; ++_i) {
                element = elements[_i];
                _arr.push({ declarable: element.tDeclarable(), spread: element.spread });
              }
              return _arr;
            }()));
          };
        },
        ObjectDeclarable: function (node, scope) {
          var pairs;
          pairs = (function () {
            var _arr, _arr2, _i, _len, pair;
            for (_arr = [], _arr2 = node.pairs, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              pair = _arr2[_i];
              _arr.push({
                tKey: translate(pair.key, scope, "expresion"),
                tValue: translateDeclarable(pair.value, scope)
              });
            }
            return _arr;
          }());
          return function () {
            return ObjectDeclarable((function () {
              var _arr, _i, _len, pair;
              for (_arr = [], _i = 0, _len = __num(pairs.length); _i < _len; ++_i) {
                pair = pairs[_i];
                _arr.push({ key: pair.tKey(), value: pair.tValue() });
              }
              return _arr;
            }()));
          };
        }
      };
      function handleDeclarable(scope, location, autoReturn, left, right) {
        var _arr, _i, _len, arrayIdent, diff, element, foundSpread, func, i, init, len, node, objectIdent, pair, spreadCounter;
        if (location === "topStatement" && left instanceof ast.Ident && right instanceof ast.Func && right.name == null) {
          scope.removeVariable(left);
          func = ast.Func(
            left,
            right.params,
            right.variables,
            right.body,
            right.declarations
          );
          if (autoReturn !== identity) {
            return ast.Block([func, autoReturn(left)]);
          } else {
            return func;
          }
        } else if (left instanceof ArrayDeclarable) {
          if (left.elements.length === 1 && !left.elements[0].spread) {
            return autoReturn(ast.Assign(left.elements[0].declarable, ast.Access(right, 0)));
          } else {
            init = [];
            arrayIdent = void 0;
            if (needsCaching(right)) {
              arrayIdent = scope.reserveIdent("a", Type.array);
              init.push(ast.Assign(arrayIdent, right));
            } else {
              arrayIdent = right;
            }
            foundSpread = -1;
            spreadCounter = void 0;
            for (_arr = left.elements, i = 0, len = __num(_arr.length); i < len; ++i) {
              element = _arr[i];
              node = element.declarable;
              if (!element.spread) {
                if (foundSpread === -1) {
                  init.push(handleDeclarable(
                    scope,
                    location,
                    identity,
                    node,
                    ast.Access(arrayIdent, i)
                  ));
                } else {
                  diff = __num(i) - __num(foundSpread) - 1;
                  init.push(handleDeclarable(
                    scope,
                    location,
                    identity,
                    node,
                    ast.Access(arrayIdent, diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", diff))
                  ));
                }
              } else {
                if (foundSpread !== -1) {
                  throw Error("Encountered multiple spread identifiers");
                }
                foundSpread = i;
                scope.addHelper("__slice");
                if (i === __num(len) - 1) {
                  init.push(handleDeclarable(
                    scope,
                    location,
                    identity,
                    node,
                    ast.Call(ast.Ident("__slice"), [arrayIdent].concat(i === 0 ? [] : [ast.Const(i)]))
                  ));
                } else {
                  spreadCounter = scope.reserveIdent("i", Type.number);
                  init.push(handleDeclarable(
                    scope,
                    location,
                    identity,
                    node,
                    ast.IfExpression(
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
                    )
                  ));
                }
              }
            }
            if (spreadCounter != null) {
              scope.releaseIdent(spreadCounter);
            }
            if (autoReturn !== identity) {
              init.push(autoReturn(arrayIdent));
            }
            if (arrayIdent !== right) {
              scope.releaseIdent(arrayIdent);
            }
            return ast.Block(init);
          }
        } else if (left instanceof ObjectDeclarable) {
          if (left.pairs.length === 1) {
            return autoReturn(ast.Assign(left.pairs[0].value, ast.Access(right, left.pairs[0].key)));
          } else {
            init = [];
            objectIdent = void 0;
            if (needsCaching(right)) {
              objectIdent = scope.reserveIdent("o", Type.object);
              init.push(ast.Assign(objectIdent, right));
            } else {
              objectIdent = right;
            }
            for (_arr = left.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              pair = _arr[_i];
              init.push(handleDeclarable(
                scope,
                location,
                identity,
                pair.value,
                ast.Access(objectIdent, pair.key)
              ));
            }
            if (autoReturn !== identity) {
              init.push(autoReturn(objectIdent));
            }
            if (objectIdent !== right) {
              scope.releaseIdent(objectIdent);
            }
            return ast.Block(init);
          }
        } else {
          return autoReturn(ast.Assign(left, right));
        }
      }
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
          return handleDeclarable(
            scope,
            location,
            autoReturn,
            tLeft(),
            tRight()
          );
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
          ident = scope.reserveIdent("o", Type.object);
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
    Return: function (node, scope, location) {
      var tValue;
      if (location !== "statement" && location !== "topStatement") {
        throw Error("Expected Return in statement position");
      }
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
      tBody = translate(node.body, scope, "topStatement", scope.options["return"] || scope.options["eval"]);
      return function () {
        var _arr, _i, _len, bareInit, body, callFunc, fakeThis, helper, ident, init, walker;
        body = tBody();
        init = [];
        if (scope.hasBound && scope.usedThis) {
          fakeThis = ast.Ident("_this");
          scope.addVariable(fakeThis);
          init.push(ast.Assign(fakeThis, ast.This()));
        }
        for (_arr = scope.getHelpers(), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          helper = _arr[_i];
          if (HELPERS.has(helper)) {
            ident = ast.Ident(helper);
            scope.addVariable(ident);
            init.push(ast.Assign(ident, HELPERS.get(helper)));
          }
        }
        bareInit = [];
        if (scope.hasStopIteration) {
          bareInit.push(ast.If(
            ast.Binary(
              ast.Unary("typeof", ast.Ident("StopIteration")),
              "===",
              "undefined"
            ),
            ast.Assign(ast.Ident("StopIteration"), ast.If(
              ast.Binary(
                ast.Unary("typeof", ast.Access(ast.Ident("Object"), "freeze")),
                "===",
                "function"
              ),
              ast.Call(
                ast.Access(ast.Ident("Object"), "freeze"),
                [ast.Obj()]
              ),
              ast.Obj()
            ))
          ));
        }
        if (scope.options.bare) {
          return ast.Root(
            ast.Block(__toArray(bareInit).concat(__toArray(init), [body])),
            scope.getVariables(),
            ["use strict"]
          );
        } else {
          if (scope.options["eval"]) {
            walker = function (node) {
              if (node instanceof ast.Func) {
                if (node.name != null) {
                  return ast.Block([
                    node,
                    ast.Assign(
                      ast.Access(ast.Ident("GLOBAL"), node.name.name),
                      node.name
                    )
                  ]);
                } else {
                  return node;
                }
              } else if (node instanceof ast.Binary && node.op === "=" && node.left instanceof ast.Ident) {
                return ast.Assign(
                  ast.Access(ast.Ident("GLOBAL"), node.left.name),
                  node.walk(walker)
                );
              }
            };
            body = body.walk(walker);
          }
          callFunc = ast.Call(
            ast.Access(
              ast.Func(
                null,
                [],
                scope.getVariables(),
                ast.Block(__toArray(init).concat([body])),
                ["use strict"]
              ),
              "call"
            ),
            [ast.This()]
          );
          if (scope.options["return"]) {
            callFunc = ast.Return(callFunc);
          }
          return ast.Root(ast.Block(__toArray(bareInit).concat([callFunc])), [], []);
        }
      };
    },
    Switch: function (node, scope, location, autoReturn) {
      var tCases, tDefaultCase, tNode;
      tNode = translate(node.node, scope, "expression");
      tCases = (function () {
        var _arr, _arr2, _i, _len, case_;
        for (_arr = [], _arr2 = node.cases, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
          case_ = _arr2[_i];
          _arr.push({
            tNode: translate(case_.node, scope, "expression"),
            tBody: translate(case_.body, scope, "statement"),
            fallthrough: case_.fallthrough
          });
        }
        return _arr;
      }());
      tDefaultCase = node.defaultCase != null ? translate(node.defaultCase, scope, "statement") : void 0;
      return function () {
        var defaultCase, node;
        node = tNode();
        defaultCase = tDefaultCase != null ? autoReturn(tDefaultCase()) : ast.Noop();
        return ast.Switch(
          node,
          (function () {
            var _arr, case_, caseBody, caseNode, i, len;
            for (_arr = [], i = 0, len = __num(tCases.length); i < len; ++i) {
              case_ = tCases[i];
              caseNode = case_.tNode();
              caseBody = case_.tBody();
              if (!case_.fallthrough || i === __num(len) - 1 && defaultCase.isNoop()) {
                caseBody = ast.Block([autoReturn(caseBody), ast.Break()]);
              }
              _arr.push(ast.Switch.Case(caseNode, caseBody));
            }
            return _arr;
          }()),
          defaultCase
        );
      };
    },
    Super: function (node, scope, location, autoReturn) {
      throw Error("Cannot have a stray super call");
    },
    Tmp: function (node, scope, location, autoReturn) {
      var ident;
      ident = scope.getTmp(node.id, node.name, node.type());
      return function () {
        return autoReturn(ident);
      };
    },
    TmpWrapper: function (node, scope, location, autoReturn) {
      var _arr, _i, _len, tmp, tResult;
      tResult = translate(node.node, scope, location, autoReturn);
      for (_arr = node.tmps, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        tmp = _arr[_i];
        scope.releaseTmp(tmp);
      }
      return tResult;
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
      throw Error("Unable to translate unknown node type: " + String(node.constructor.cappedName));
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
  module.exports.helpers = HELPERS;
  module.exports.defineHelper = function (name, value) {
    var ident, scope;
    if (!(name instanceof parser.Node.Ident)) {
      throw TypeError("Expected name to be a Ident, got " + __typeof(name));
    }
    if (!(value instanceof parser.Node)) {
      throw TypeError("Expected value to be a Node, got " + __typeof(value));
    }
    scope = Scope({}, false);
    ident = translate(name, scope, "leftExpression")();
    if (!(ident instanceof ast.Ident)) {
      throw Error("Expected name to be an Ident, got " + __typeof(ident));
    }
    return HELPERS.add(ident.name, translate(value, scope, "expression")());
  };
}.call(this));
