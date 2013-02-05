(function () {
  "use strict";
  var __cmp, __create, __isArray, __isObject, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, __xor, ast, AstNode, GeneratorBuilder, generatorTranslate, Helpers, HELPERS, ParserNode, Scope, translators, Type;
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
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __isObject = function (x) {
    return typeof x === "object" && x !== null;
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __str = function (str) {
    if (typeof str !== "string") {
      throw TypeError("Expected a string, got " + __typeof(str));
    } else {
      return str;
    }
  };
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else {
      return __slice.call(x);
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
  AstNode = ast.Node;
  Type = require("./types");
  ParserNode = require("./parser").Node;
  function needsCaching(item) {
    return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
  }
  Scope = (function () {
    var _Scope_prototype, getId;
    function Scope(options, bound, usedTmps, helpers, variables, tmps) {
      var _this;
      _this = this instanceof Scope ? this : __create(_Scope_prototype);
      if (options == null) {
        options = {};
      }
      _this.options = options;
      if (bound == null) {
        bound = false;
      }
      _this.bound = bound;
      if (usedTmps == null) {
        usedTmps = {};
      }
      _this.usedTmps = usedTmps;
      if (helpers == null) {
        helpers = {};
      }
      _this.helpers = helpers;
      if (tmps == null) {
        tmps = {};
      }
      _this.tmps = tmps;
      _this.variables = variables ? __create(variables) : {};
      _this.hasBound = false;
      _this.usedThis = false;
      _this.hasStopIteration = false;
      _this.id = getId();
      return _this;
    }
    _Scope_prototype = Scope.prototype;
    Scope.displayName = "Scope";
    getId = (function () {
      var id;
      id = -1;
      return function () {
        return ++id;
      };
    }());
    _Scope_prototype.maybeCache = function (item, type, func) {
      var ident, result;
      if (!(item instanceof ast.Expression)) {
        throw TypeError("Expected item to be an Expression, got " + __typeof(item));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (!needsCaching(item)) {
        return func(item, item, false);
      } else {
        ident = this.reserveIdent("ref", type);
        result = func(
          ast.Assign(ident, item),
          ident,
          true
        );
        this.releaseIdent(ident);
        return result;
      }
    };
    _Scope_prototype.reserveIdent = function (namePart, type) {
      var _this;
      _this = this;
      if (namePart == null) {
        namePart = "ref";
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      return (function () {
        var i, ident, name;
        for (i = 1; ; ++i) {
          if (i === 1) {
            name = "_" + __strnum(namePart);
          } else {
            name = "_" + __strnum(namePart) + i;
          }
          if (!(name in _this.usedTmps)) {
            _this.usedTmps[name] = true;
            ident = ast.Ident(name);
            _this.addVariable(ident, type);
            return ident;
          }
        }
      }());
    };
    _Scope_prototype.reserveParam = function () {
      var _this;
      _this = this;
      return (function () {
        var i, name;
        for (i = 1; ; ++i) {
          if (i === 1) {
            name = "_p";
          } else {
            name = "_p" + i;
          }
          if (!(name in _this.usedTmps)) {
            _this.usedTmps[name] = true;
            return ast.Ident(name);
          }
        }
      }());
    };
    _Scope_prototype.getTmp = function (id, name, type) {
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
    _Scope_prototype.releaseTmp = function (id) {
      var _ref, _ref2;
      if (__owns.call(this.tmps, id)) {
        this.releaseIdent((_ref = (_ref2 = this.tmps)[id], delete _ref2[id], _ref));
      }
    };
    _Scope_prototype.releaseTmps = function () {
      var _obj, id;
      _obj = this.tmps;
      for (id in _obj) {
        if (__owns.call(_obj, id)) {
          this.releaseTmp(id);
        }
      }
      this.tmps = {};
    };
    _Scope_prototype.releaseIdent = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      if (!__owns.call(this.usedTmps, ident.name)) {
        throw Error("Trying to release a non-reserved ident: " + __strnum(ident.name));
      }
      delete this.usedTmps[ident.name];
    };
    _Scope_prototype.markAsParam = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      this.removeVariable(ident);
    };
    _Scope_prototype.addHelper = function (name) {
      this.helpers[name] = true;
    };
    _Scope_prototype.fillHelperDependencies = function () {
      var _arr, _else, _i, dep, helper, helpers, toAdd;
      helpers = this.helpers;
      toAdd = {};
      while (true) {
        for (helper in helpers) {
          if (__owns.call(helpers, helper) && HELPERS.has(helper)) {
            for (_arr = __toArray(HELPERS.dependencies(helper)), _i = _arr.length; _i--; ) {
              dep = _arr[_i];
              if (!__owns.call(helpers, dep)) {
                toAdd[dep] = true;
              }
            }
          }
        }
        _else = true;
        for (helper in toAdd) {
          if (__owns.call(toAdd, helper)) {
            _else = false;
            this.addHelper(helper);
          }
        }
        if (_else) {
          break;
        }
        helpers = toAdd;
        toAdd = {};
      }
    };
    function lowerSorter(a, b) {
      return __cmp(a.toLowerCase(), b.toLowerCase());
    }
    _Scope_prototype.getHelpers = function () {
      var _arr, _obj, helpers, k;
      _arr = [];
      _obj = this.helpers;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _arr.push(k);
        }
      }
      helpers = _arr;
      return helpers.sort(lowerSorter);
    };
    _Scope_prototype.addVariable = function (ident, type, isMutable) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      this.variables[ident.name] = { type: type, isMutable: isMutable };
    };
    _Scope_prototype.hasVariable = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      if (typeof this.variables[ident.name] === "object") {
        return ident.name in this.variables;
      } else {
        return false;
      }
    };
    _Scope_prototype.hasOwnVariable = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      return __owns.call(this.variables, ident.name);
    };
    _Scope_prototype.isVariableMutable = function (ident) {
      var _ref;
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      if ((_ref = this.variables[ident.name]) != null) {
        return _ref.isMutable;
      }
    };
    _Scope_prototype.removeVariable = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      delete this.variables[ident.name];
    };
    _Scope_prototype.getVariables = function () {
      var _arr, _obj, k, variables;
      _arr = [];
      _obj = this.variables;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _arr.push(k);
        }
      }
      variables = _arr;
      return variables.sort(lowerSorter);
    };
    _Scope_prototype.clone = function (bound) {
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
    var _Helpers_prototype;
    function Helpers() {
      var _this;
      _this = this instanceof Helpers ? this : __create(_Helpers_prototype);
      _this.data = {};
      _this.types = {};
      _this.deps = {};
      return _this;
    }
    _Helpers_prototype = Helpers.prototype;
    Helpers.displayName = "Helpers";
    _Helpers_prototype.add = function (name, value, type, dependencies) {
      var _i, _len;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (!(value instanceof ast.Expression)) {
        throw TypeError("Expected value to be an Expression, got " + __typeof(value));
      }
      if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      if (!__isArray(dependencies)) {
        throw TypeError("Expected dependencies to be an Array, got " + __typeof(dependencies));
      } else {
        for (_i = 0, _len = dependencies.length; _i < _len; ++_i) {
          if (typeof dependencies[_i] !== "string") {
            throw TypeError("Expected dependencies[" + _i + "] to be a String, got " + __typeof(dependencies[_i]));
          }
        }
      }
      this.data[name] = value;
      this.types[name] = type;
      return this.deps[name] = dependencies;
    };
    _Helpers_prototype.has = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns.call(this.data, name);
    };
    _Helpers_prototype.get = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(this.data, name)) {
        return this.data[name];
      } else {
        throw Error("No such helper: " + name);
      }
    };
    _Helpers_prototype.type = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(this.types, name)) {
        return this.types[name];
      } else {
        throw Error("No such helper: " + name);
      }
    };
    _Helpers_prototype.dependencies = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(this.deps, name)) {
        return this.deps[name];
      } else {
        throw Error("No such helper: " + name);
      }
    };
    return Helpers;
  }()))();
  GeneratorBuilder = (function () {
    var _GeneratorBuilder_prototype;
    function GeneratorBuilder(scope, states, currentState, stateIdent, pendingFinalliesIdent, finallies, catches, currentCatch) {
      var _this;
      _this = this instanceof GeneratorBuilder ? this : __create(_GeneratorBuilder_prototype);
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
      }
      _this.scope = scope;
      if (currentState == null) {
        currentState = 1;
      }
      _this.currentState = currentState;
      if (finallies == null) {
        finallies = [];
      }
      _this.finallies = finallies;
      if (catches == null) {
        catches = [];
      }
      _this.catches = catches;
      if (currentCatch == null) {
        currentCatch = [];
      }
      _this.currentCatch = currentCatch;
      _this.states = states != null ? states
        : [
          [
            function () {
              return ast.Throw(ast.Ident("StopIteration"));
            }
          ],
          []
        ];
      _this.stateIdent = stateIdent != null ? stateIdent : scope.reserveIdent("state", Type.number);
      _this.pendingFinalliesIdent = pendingFinalliesIdent != null ? pendingFinalliesIdent : scope.reserveIdent("finallies", Type["undefined"]["function"]().array());
      return _this;
    }
    _GeneratorBuilder_prototype = GeneratorBuilder.prototype;
    GeneratorBuilder.displayName = "GeneratorBuilder";
    _GeneratorBuilder_prototype.add = function (tNode) {
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
    _GeneratorBuilder_prototype["yield"] = function (tNode) {
      var _this, branch;
      _this = this;
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
    _GeneratorBuilder_prototype.goto = function (tState) {
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
    _GeneratorBuilder_prototype.pendingFinally = function (tFinallyBody) {
      var _this, ident;
      _this = this;
      ident = this.scope.reserveIdent("finally", Type["undefined"]["function"]());
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
    _GeneratorBuilder_prototype.runPendingFinally = function () {
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
    _GeneratorBuilder_prototype.noop = function () {
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
    _GeneratorBuilder_prototype.enterTryCatch = function () {
      var fresh;
      fresh = this.noop();
      fresh.currentCatch = __toArray(fresh.currentCatch).concat([[fresh.currentState]]);
      return fresh;
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (tIdent, tPostState) {
      var catchStates, fresh;
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
    _GeneratorBuilder_prototype.branch = function () {
      var _ref, state;
      state = this.states.length;
      if (this.currentCatch.length) {
        (_ref = this.currentCatch)[__num(_ref.length) - 1].push(state);
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
    _GeneratorBuilder_prototype.create = function () {
      var _this, body, catches, close, err, f, innerScope, scope, stateIdent;
      _this = this;
      if (this.currentCatch.length) {
        throw Error("Cannot create a generator if there are stray catches");
      }
      this.states[this.currentState].push(function () {
        return ast.Assign(_this.stateIdent, 0);
      });
      body = [ast.Assign(this.stateIdent, 1)];
      close = this.scope.reserveIdent("close", Type["undefined"]["function"]());
      this.scope.removeVariable(close);
      if (this.finallies.length === 0) {
        this.scope.removeVariable(this.pendingFinalliesIdent);
        body.push(ast.Func(close, [], [], ast.Block([ast.Assign(this.stateIdent, 0)])));
      } else {
        body.push(ast.Assign(this.pendingFinalliesIdent, ast.Arr()));
        body.push.apply(body, (function () {
          var _arr, _arr2, _i, _len, f;
          for (_arr = [], _arr2 = __toArray(_this.finallies), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            f = _arr2[_i];
            _arr.push(f());
          }
          return _arr;
        }()));
        innerScope = this.scope.clone(false);
        f = innerScope.reserveIdent("f", Type["undefined"]["function"]().union(Type["undefined"]));
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
        ast.Obj.Pair("iterator", ast.Func(null, [], [], ast.Return(ast.This()))),
        ast.Obj.Pair("next", ast.Func(null, [], [], ast.While(true, ast.TryCatch(
          ast.Switch(
            stateIdent,
            (function () {
              var _arr, _arr2, _f, _len, i;
              for (_arr = [], _arr2 = __toArray(_this.states), i = 0, _len = _arr2.length, _f = function (state, i) {
                return ast.Switch.Case(i, ast.Block((function () {
                  var _arr, _arr2, _i, _len, item;
                  for (_arr = [], _arr2 = __toArray(state), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                    item = _arr2[_i];
                    _arr.push(item());
                  }
                  return _arr;
                }()).concat([ast.Break()])));
              }; i < _len; ++i) {
                _arr.push(_f.call(_this, _arr2[i], i));
              }
              return _arr;
            }()),
            ast.Throw(ast.Call(ast.Ident("Error"), [ast.Binary("Unknown state: ", "+", stateIdent)]))
          ),
          err,
          (function () {
            var _arr, _f, _i, current;
            current = ast.Block([ast.Call(close), ast.Throw(err)]);
            for (_arr = __toArray(catches), _i = _arr.length, _f = function (catchInfo) {
              var errIdent;
              errIdent = catchInfo.tIdent();
              scope.addVariable(errIdent);
              return current = ast.If(
                ast.Or.apply(ast, (function () {
                  var _arr, _arr2, _i, _len, state;
                  for (_arr = [], _arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                    state = _arr2[_i];
                    _arr.push(ast.Binary(stateIdent, "===", state));
                  }
                  return _arr;
                }())),
                ast.Block([
                  ast.Assign(errIdent, err),
                  ast.Assign(stateIdent, catchInfo.catchState)
                ]),
                current
              );
            }; _i--; ) {
              _f.call(_this, _arr[_i]);
            }
            return current;
          }())
        ))))
      ])));
      return ast.Block(body);
    };
    return GeneratorBuilder;
  }());
  function flattenSpreadArray(elements) {
    var _arr, _i, _len, changed, element, result;
    result = [];
    changed = false;
    for (_arr = __toArray(elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      element = _arr[_i];
      if (element instanceof ParserNode.Spread && element.node instanceof ParserNode.Array) {
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
        var _arr, _i, _len, b, subnode;
        if (node.label != null) {
          throw Error("Not implemented: block with label in generator");
        }
        b = builder;
        for (_arr = __toArray(node.nodes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          subnode = _arr[_i];
          b = generatorTranslate(
            subnode,
            scope,
            b,
            breakState,
            continueState
          );
        }
        return b;
      },
      Break: function (node, scope, builder, breakState) {
        if (node.label != null) {
          throw Error("Not implemented: break with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(breakState);
        return builder;
      },
      Continue: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: continue with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(continueState);
        return builder;
      },
      For: function (node, scope, builder) {
        var bodyBranch, postBranch, stepBranch, testBranch, tTest;
        if (node.label != null) {
          throw Error("Not implemented: for with label in generator");
        }
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
        if (node.label != null) {
          throw Error("Not implemented: for-in with label in generator");
        }
        tKey = translate(node.key, scope, "leftExpression");
        tObject = translate(node.object, scope, "expression");
        keys = scope.reserveIdent("keys", Type.string.array());
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
        if (node.label != null) {
          throw Error("Not implemented: if with label in generator");
        }
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
        if (whenFalse instanceof ParserNode.Nothing) {
          whenFalse = null;
        }
        if (whenFalse != null) {
          whenFalseBranch = builder.branch();
        }
        if (whenFalse != null) {
          gWhenFalse = generatorTranslate(
            node.whenFalse,
            scope,
            whenFalseBranch.builder,
            breakState,
            continueState
          );
        }
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
        var _arr, _i, tmp;
        builder = generatorTranslate(
          node.node,
          scope,
          builder,
          breakState,
          continueState
        );
        for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
          tmp = _arr[_i];
          scope.releaseTmp(tmp);
        }
        return builder;
      },
      TryCatch: function (node, scope, builder, breakState, continueState) {
        var postBranch;
        if (node.label != null) {
          throw Error("Not implemented: try-catch with label in generator");
        }
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
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
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
        return builder["yield"](translate(node.node, scope, "expression"));
      }
    };
    return function (node, scope, builder, breakState, continueState) {
      var ret;
      if (__owns.call(generatorTranslators, node.constructor.cappedName)) {
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
  function arrayTranslate(elements, scope, replaceWithSlice, allowArrayLike, unassigned) {
    var _arr, _f, _i, _len, current, element, i, translatedItems;
    translatedItems = [];
    current = [];
    translatedItems.push(current);
    for (_arr = __toArray(flattenSpreadArray(elements)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      element = _arr[_i];
      if (element instanceof ParserNode.Spread) {
        translatedItems.push({
          tNode: translate(
            element.node,
            scope,
            "expression",
            null,
            unassigned
          ),
          type: element.node.type()
        });
        current = [];
        translatedItems.push(current);
      } else {
        current.push(translate(
          element,
          scope,
          "expression",
          null,
          unassigned
        ));
      }
    }
    if (translatedItems.length === 1) {
      return function () {
        return ast.Arr((function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(translatedItems[0]), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(item());
          }
          return _arr;
        }()));
      };
    } else {
      for (i = translatedItems.length, _f = function (translatedItem, i) {
        if (i % 2 === 0) {
          if (__num(translatedItem.length) > 0) {
            return translatedItems[i] = function () {
              return ast.Arr((function () {
                var _arr, _arr2, _i, _len, item;
                for (_arr = [], _arr2 = __toArray(translatedItem), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                  item = _arr2[_i];
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
            var node;
            node = translatedItem.tNode();
            if (translatedItem.type.isSubsetOf(Type.array)) {
              return node;
            } else {
              scope.addHelper("__toArray");
              return ast.Call(ast.Ident("__toArray"), [node]);
            }
          };
        }
      }; i--; ) {
        _f.call(this, translatedItems[i], i);
      }
      if (translatedItems.length === 1) {
        return function () {
          var array;
          array = translatedItems[0]();
          if (replaceWithSlice && array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray") {
            return ast.Call(
              ast.Access(ast.Ident("__slice"), "call"),
              array.args
            );
          } else if (allowArrayLike && array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray" && array.args[0] instanceof ast.Arguments) {
            return array.args[0];
          } else {
            return array;
          }
        };
      } else {
        return function () {
          var _arr, _i, _len, head, item, rest;
          head = translatedItems[0]();
          for (_arr = [], _i = 1, _len = translatedItems.length; _i < _len; ++_i) {
            item = translatedItems[_i];
            _arr.push(item());
          }
          rest = _arr;
          return ast.Call(
            ast.Access(head, "concat"),
            rest
          );
        };
      }
    }
  }
  translators = {
    Access: function (node, scope, location, autoReturn, unassigned) {
      var tChild, tParent;
      tParent = translate(
        node.parent,
        scope,
        "expression",
        null,
        unassigned
      );
      tChild = translate(
        node.child,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return autoReturn(ast.Access(tParent(), tChild()));
      };
    },
    Args: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Arguments());
      };
    },
    Array: function (node, scope, location, autoReturn, unassigned) {
      var tArr;
      tArr = arrayTranslate(
        node.elements,
        scope,
        true,
        false,
        unassigned
      );
      return function () {
        return autoReturn(tArr());
      };
    },
    Assign: (function () {
      var ops;
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
      return function (node, scope, location, autoReturn, unassigned) {
        var op, tLeft, tRight;
        op = node.op;
        tLeft = translate(node.left, scope, "leftExpression");
        tRight = translate(
          node.right,
          scope,
          "expression",
          null,
          unassigned
        );
        if (unassigned && node.left instanceof ParserNode.Ident) {
          if (op === "=" && unassigned[node.left.name] && node.right.isConst() && node.right.constValue() === void 0) {
            return function () {
              return ast.Noop();
            };
          }
          unassigned[node.left.name] = false;
        }
        return function () {
          var func, left, right;
          left = tLeft();
          right = tRight();
          if (op === "=" && location === "topStatement" && left instanceof ast.Ident && right instanceof ast.Func && right.name == null && scope.hasOwnVariable(left) && !scope.isVariableMutable(left)) {
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
          } else {
            return autoReturn(ast.Binary(left, op, right));
          }
        };
      };
    }()),
    Binary: function (node, scope, location, autoReturn, unassigned) {
      var tLeft, tRight;
      tLeft = translate(
        node.left,
        scope,
        "expression",
        null,
        unassigned
      );
      tRight = translate(
        node.right,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return autoReturn(ast.Binary(tLeft(), node.op, tRight()));
      };
    },
    Block: function (node, scope, location, autoReturn, unassigned) {
      var tLabel, tNodes;
      tLabel = node.label && translate(node.label, scope, "label");
      tNodes = translateArray(
        node.nodes,
        scope,
        location,
        autoReturn,
        unassigned
      );
      return function () {
        return ast.Block(
          (function () {
            var _arr, _arr2, _i, _len, tNode;
            for (_arr = [], _arr2 = __toArray(tNodes), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              tNode = _arr2[_i];
              _arr.push(tNode());
            }
            return _arr;
          }()),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Break: function (node, scope) {
      var tLabel;
      tLabel = node.label && translate(node.label, scope, "label");
      return function () {
        return ast.Break(typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    Call: function (node, scope, location, autoReturn, unassigned) {
      var args, isApply, isNew, tArgArray, tFunc, tStart;
      tFunc = translate(
        node.func,
        scope,
        "expression",
        null,
        unassigned
      );
      isApply = node.isApply;
      isNew = node.isNew;
      args = node.args;
      if (isApply && (args.length === 0 || !(args[0] instanceof ParserNode.Spread))) {
        if (args.length === 0) {
          tStart = function () {
            return ast.Const(void 0);
          };
        } else {
          tStart = translate(
            args[0],
            scope,
            "expression",
            null,
            unassigned
          );
        }
        tArgArray = arrayTranslate(
          __slice.call(args, 1),
          scope,
          false,
          true,
          unassigned
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
        tArgArray = arrayTranslate(
          args,
          scope,
          false,
          true,
          unassigned
        );
        return function () {
          var argArray, func;
          func = tFunc();
          argArray = tArgArray();
          if (isApply) {
            return scope.maybeCache(argArray, Type.array, function (setArray, array) {
              scope.addHelper("__slice");
              return autoReturn(ast.Call(
                ast.Access(func, "apply"),
                [
                  ast.Access(setArray, 0),
                  ast.Call(
                    ast.Access(ast.Ident("__slice"), "call"),
                    [array, ast.Const(1)]
                  )
                ]
              ));
            });
          } else if (argArray instanceof ast.Arr) {
            return autoReturn(ast.Call(func, argArray.elements, isNew));
          } else if (isNew) {
            scope.addHelper("__new");
            return autoReturn(ast.Call(ast.Ident("__new"), [func, argArray]));
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, Type["function"], function (setParent, parent) {
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
    Continue: function (node, scope) {
      var tLabel;
      tLabel = node.label && translate(node.label, scope, "label");
      return function () {
        return ast.Continue(typeof tLabel === "function" ? tLabel() : void 0);
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
    Eval: function (node, scope, location, autoReturn, unassigned) {
      var tCode;
      tCode = translate(
        node.code,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return autoReturn(ast.Eval(tCode()));
      };
    },
    For: function (node, scope, location, autoReturn, unassigned) {
      var tBody, tInit, tLabel, tStep, tTest;
      tLabel = node.label && translate(node.label, scope, "label");
      if (node.init != null) {
        tInit = translate(
          node.init,
          scope,
          "expression",
          null,
          unassigned
        );
      }
      if (node.test != null) {
        tTest = translate(node.test, scope, "expression");
      }
      if (node.step != null) {
        tStep = translate(node.step, scope, "expression");
      }
      tBody = translate(node.body, scope, "statement");
      return function () {
        return ast.For(
          typeof tInit === "function" ? tInit() : void 0,
          typeof tTest === "function" ? tTest() : void 0,
          typeof tStep === "function" ? tStep() : void 0,
          tBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    ForIn: function (node, scope, location, autoReturn, unassigned) {
      var tBody, tKey, tLabel, tObject;
      tLabel = node.label && translate(node.label, scope, "label");
      tKey = translate(node.key, scope, "leftExpression");
      tObject = translate(
        node.object,
        scope,
        "expression",
        null,
        unassigned
      );
      tBody = translate(node.body, scope, "statement");
      return function () {
        var key;
        key = tKey();
        if (!(key instanceof ast.Ident)) {
          throw Error("Expected an Ident for a for-in key");
        }
        scope.addVariable(key, Type.string);
        return ast.ForIn(key, tObject(), tBody(), typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    Function: (function () {
      var primitiveTypes, translateParamTypes, translateType, translateTypeChecks;
      primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
      function makeTypeCheckTest(ident, type, scope) {
        if (__owns.call(primitiveTypes, type)) {
          return ast.Binary(
            ast.Unary("typeof", ident),
            "!==",
            primitiveTypes[type]
          );
        } else if (type === "Array") {
          scope.addHelper("__isArray");
          return ast.Unary("!", ast.Call(ast.Ident("__isArray"), [ident]));
        } else if (type === "Object") {
          scope.addHelper("__isObject");
          return ast.Unary("!", ast.Call(ast.Ident("__isObject"), [ident]));
        } else {
          return ast.Unary("!", ast.Binary(ident, "instanceof", ast.Ident(type)));
        }
      }
      function article(word) {
        if (/^[aeiou]/i.test(word)) {
          return "an";
        } else {
          return "a";
        }
      }
      function withArticle(word) {
        return article(word) + " " + __strnum(word);
      }
      function buildAccessStringNode(accesses) {
        if (accesses.length === 0) {
          return [];
        } else if (accesses[0] instanceof ast.Const) {
          return [typeof accesses[0].value === "string" && ast.isAcceptableIdent(accesses[0].value) ? ast.Const("." + __strnum(accesses[0].value)) : ast.Const("[" + __str(JSON.stringify(accesses[0].value)) + "]")].concat(__toArray(buildAccessStringNode(__slice.call(accesses, 1))));
        } else {
          return ["[", accesses[0], "]"].concat(__toArray(buildAccessStringNode(__slice.call(accesses, 1))));
        }
      }
      translateTypeChecks = {
        Ident: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, result;
          access = ast.Access.apply(ast, [ident].concat(__toArray(accesses)));
          scope.addHelper("__typeof");
          result = ast.If(
            makeTypeCheckTest(access, node.name, scope),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              ast.BinaryChain.apply(ast, ["+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                " to be " + withArticle(node.name) + ", got ",
                ast.Call(ast.Ident("__typeof"), [access])
              ]))
            ]))
          );
          if (!hasDefaultValue && node.name === "Boolean") {
            return {
              check: ast.If(
                ast.Binary(ident, "==", ast.Const(null)),
                ast.Assign(ident, ast.Const(false)),
                result
              ),
              type: Type.boolean
            };
          } else {
            return {
              check: result,
              type: __owns.call(primitiveTypes, node.name) ? Type[primitiveTypes[node.name]] : Type.any
            };
          }
        },
        Access: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, type;
          access = ast.Access.apply(ast, [ident].concat(__toArray(accesses)));
          scope.addHelper("__typeof");
          type = translate(node, scope, "expression")();
          return {
            check: ast.If(
              ast.Unary("!", ast.Binary(access, "instanceof", type)),
              ast.Throw(ast.Call(ast.Ident("TypeError"), [
                ast.BinaryChain.apply(ast, ["+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                  " to be " + withArticle(type.right.value) + ", got ",
                  ast.Call(ast.Ident("__typeof"), [access])
                ]))
              ]))
            ),
            type: Type.any
          };
        },
        TypeUnion: function (ident, node, scope, hasDefaultValue, accesses) {
          var _arr, _i, _len, access, check, hasBoolean, hasNull, hasVoid, names, result, tests, type, types;
          access = ast.Access.apply(ast, [ident].concat(__toArray(accesses)));
          scope.addHelper("__typeof");
          hasBoolean = false;
          hasVoid = false;
          hasNull = false;
          names = [];
          tests = [];
          types = [];
          for (_arr = __toArray(node.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            type = _arr[_i];
            if (type instanceof ParserNode.Const) {
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
            } else if (type instanceof ParserNode.Ident) {
              if (type.name === "Boolean") {
                hasBoolean = true;
              }
              names.push(type.name);
              tests.push(makeTypeCheckTest(access, type.name, scope));
              types.push(__owns.call(primitiveTypes, type.name) ? Type[primitiveTypes[type.name]] : Type.any);
            } else {
              throw Error("Not implemented: typechecking for non-idents/consts within a type-union");
            }
          }
          if (hasNull && hasVoid && !hasDefaultValue) {
            tests.unshift(ast.Binary(access, "!=", null));
          }
          result = ast.If(
            ast.And.apply(ast, __toArray(tests)),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              ast.BinaryChain.apply(ast, ["+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                " to be " + withArticle(names.join(" or ")) + ", got ",
                ast.Call(ast.Ident("__typeof"), [access])
              ]))
            ]))
          );
          if (!hasDefaultValue) {
            if (hasNull || hasVoid) {
              if (__xor(hasNull, hasVoid)) {
                result = ast.If(
                  ast.Binary(access, "==", ast.Const(null)),
                  ast.Assign(access, ast.Const(hasNull ? null : void 0)),
                  result
                );
              }
            } else if (hasBoolean) {
              result = ast.If(
                ast.Binary(access, "==", ast.Const(null)),
                ast.Assign(access, ast.Const(false)),
                result
              );
            }
          }
          return {
            check: result,
            type: (function () {
              var _i, current, type;
              current = Type.none;
              for (_i = types.length; _i--; ) {
                type = types[_i];
                current = current.union(type);
              }
              return current;
            }())
          };
        },
        TypeFunction: function (ident, node, scope, hasDefaultValue, accesses) {
          return translateTypeChecks.Ident(
            ident,
            { name: "Function" },
            scope,
            hasDefaultValue,
            accesses
          );
        },
        TypeArray: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, index, length, result, subCheck;
          access = ast.Access.apply(ast, [ident].concat(__toArray(accesses)));
          scope.addHelper("__isArray");
          index = scope.reserveIdent("i", Type.number);
          length = scope.reserveIdent("len", Type.number);
          subCheck = translateTypeCheck(
            ident,
            node.subtype,
            scope,
            false,
            __toArray(accesses).concat([index])
          );
          result = ast.If(
            ast.Unary("!", ast.Call(ast.Ident("__isArray"), [access])),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              ast.BinaryChain.apply(ast, ["+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                " to be an Array, got ",
                ast.Call(ast.Ident("__typeof"), [access])
              ]))
            ])),
            ast.For(
              ast.Block([
                ast.Assign(index, ast.Const(0)),
                ast.Assign(length, ast.Access(access, "length"))
              ]),
              ast.Binary(index, "<", length),
              ast.Unary("++", index),
              subCheck.check
            )
          );
          scope.releaseIdent(index);
          scope.releaseIdent(length);
          return { check: result, type: subCheck.type.array() };
        },
        TypeObject: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, result, typeData;
          access = ast.Access.apply(ast, [ident].concat(__toArray(accesses)));
          scope.addHelper("__isObject");
          typeData = {};
          result = ast.If(
            ast.Unary("!", ast.Call(ast.Ident("__isObject"), [access])),
            ast.Throw(ast.Call(ast.Ident("TypeError"), [
              ast.BinaryChain.apply(ast, ["+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                " to be an Object, got ",
                ast.Call(ast.Ident("__typeof"), [access])
              ]))
            ])),
            (function () {
              var _arr, _i, _len, _ref, check, current, key, type, value;
              current = ast.Noop();
              for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                key = (_ref = _arr[_i]).key;
                value = _ref.value;
                if (key instanceof ParserNode.Const) {
                  check = (_ref = translateTypeCheck(
                    ident,
                    value,
                    scope,
                    false,
                    __toArray(accesses).concat([ast.Const(key.value)])
                  )).check;
                  type = _ref.type;
                  typeData[key.value] = type;
                  current = ast.Block([current, check]);
                }
              }
              return current;
            }())
          );
          return { check: result, type: Type.makeObject(typeData) };
        }
      };
      function translateTypeCheck(ident, node, scope, hasDefaultValue, accesses) {
        if (!__owns.call(translateTypeChecks, node.constructor.cappedName)) {
          throw Error("Unknown type: " + String(node.constructor.cappedName));
        }
        return translateTypeChecks[node.constructor.cappedName](
          ident,
          node,
          scope,
          hasDefaultValue,
          accesses
        );
      }
      translateParamTypes = {
        Param: function (param, scope, inner) {
          var ident, init, laterInit, tmp, typeCheck;
          ident = translate(param.ident, scope, "param")();
          if (param.ident instanceof ParserNode.Tmp) {
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
          if (param.asType) {
            typeCheck = translateTypeCheck(
              ident,
              param.asType,
              scope,
              param.defaultValue != null,
              []
            );
          }
          if (inner) {
            scope.addVariable(
              ident,
              typeCheck != null ? typeCheck.type : void 0,
              param.isMutable
            );
          }
          init = [];
          if (param.defaultValue != null) {
            init.push(ast.If(
              ast.Binary(ident, "==", ast.Const(null)),
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
          if (inner) {
            arrayIdent = scope.reserveIdent("p", Type.array);
          } else {
            arrayIdent = scope.reserveParam();
          }
          init = [];
          foundSpread = -1;
          for (_arr = __toArray(array.elements), i = 0, len = _arr.length; i < len; ++i) {
            p = _arr[i];
            param = translateParam(p, scope, true);
            if (!param.spread) {
              if (param.ident != null) {
                if (foundSpread === -1) {
                  init.push(ast.Assign(param.ident, ast.Access(arrayIdent, i)));
                } else {
                  diff = i - foundSpread - 1;
                  init.push(ast.Assign(param.ident, ast.Access(arrayIdent, diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", diff))));
                }
              }
            } else {
              if (foundSpread !== -1) {
                throw Error("Encountered multiple spread parameters");
              }
              foundSpread = i;
              scope.addHelper("__slice");
              if (i === len - 1) {
                init.push(ast.Assign(param.ident, ast.Call(
                  ast.Access(ast.Ident("__slice"), "call"),
                  [arrayIdent].concat(i === 0 ? [] : [ast.Const(i)])
                )));
              } else {
                spreadCounter = scope.reserveIdent("i", Type.number);
                init.push(ast.Assign(param.ident, ast.IfExpression(
                  ast.Binary(i, "<", ast.Assign(spreadCounter, ast.Binary(
                    ast.Access(arrayIdent, "length"),
                    "-",
                    len - i - 1
                  ))),
                  ast.Call(
                    ast.Access(ast.Ident("__slice"), "call"),
                    [arrayIdent, ast.Const(i), spreadCounter]
                  ),
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
            objectIdent = scope.reserveIdent("p", Type.object);
          } else {
            objectIdent = scope.reserveParam();
          }
          init = [];
          for (_arr = __toArray(object.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            pair = _arr[_i];
            key = translate(pair.key, scope, "expression")();
            if (!(key instanceof ast.Const)) {
              throw Error("Unexpected non-const object key: " + __typeof(key));
            }
            value = translateParam(pair.value, scope, true);
            if (value.ident != null) {
              scope.addVariable(value.ident);
              init.push.apply(init, [
                ast.Assign(value.ident, ast.Access(objectIdent, key))
              ].concat(__toArray(value.init)));
            }
          }
          if (inner) {
            scope.releaseIdent(objectIdent);
          }
          return { init: init, ident: objectIdent, spread: false };
        },
        Nothing: function (object, scope, inner) {
          return {
            init: [],
            ident: inner ? null : scope.reserveParam(),
            spread: false
          };
        }
      };
      function translateParam(param, scope, inner) {
        var type;
        type = param.constructor.cappedName;
        if (!__owns.call(translateParamTypes, type)) {
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
              if (!__owns.call(primordialTypes, node.name)) {
                throw Error("Not implemented: custom type " + __strnum(node.name));
              }
              return primordialTypes[node.name];
            };
          }()),
          Const: function (node, scope) {
            switch (node.value) {
            case null: return Type["null"];
            case void 0: return Type["undefined"];
            default: throw Error("Unexpected const type: " + String(node.value));
            }
          },
          TypeArray: function (node, scope) {
            return translateType(node.subtype, scope).array();
          },
          TypeFunction: function (node, scope) {
            return translateType(node.returnType, scope)["function"]();
          },
          TypeUnion: function (node, scope) {
            var _arr, _i, _len, current, type;
            current = Type.none;
            for (_arr = __toArray(node.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              current = current.union(translateType(type));
            }
            return current;
          }
        };
        return function (node, scope) {
          if (!__owns.call(translateTypes, node.constructor.cappedName)) {
            throw Error("Unknown type to translate: " + String(node.constructor.cappedName));
          }
          return translateTypes[node.constructor.cappedName](node, scope);
        };
      }());
      return function (node, scope, location, autoReturn) {
        return function () {
          var _arr, body, diff, fakeThis, foundSpread, func, i, initializers, innerScope, len, p, param, paramIdents, spreadCounter, unassigned;
          innerScope = scope.clone(!!node.bound);
          paramIdents = [];
          initializers = [];
          foundSpread = -1;
          for (_arr = __toArray(node.params), i = 0, len = _arr.length; i < len; ++i) {
            p = _arr[i];
            param = translateParam(p, innerScope, false);
            if (!param.spread) {
              if (foundSpread === -1) {
                paramIdents.push(param.ident);
              } else {
                innerScope.addVariable(param.ident, Type.any, param.isMutable);
                diff = i - foundSpread - 1;
                initializers.push(ast.Assign(param.ident, ast.Access(ast.Arguments(), diff === 0 ? spreadCounter : ast.Binary(spreadCounter, "+", diff))));
              }
            } else {
              if (foundSpread !== -1) {
                throw Error("Encountered multiple spread parameters");
              }
              foundSpread = i;
              innerScope.addHelper("__slice");
              innerScope.addVariable(param.ident, Type.array, param.isMutable);
              if (i === len - 1) {
                initializers.push(ast.Assign(param.ident, ast.Call(
                  ast.Access(ast.Ident("__slice"), "call"),
                  [ast.Arguments()].concat(i === 0 ? [] : [ast.Const(i)])
                )));
              } else {
                spreadCounter = innerScope.reserveIdent("ref", Type.number);
                initializers.push(ast.Assign(param.ident, ast.IfExpression(
                  ast.Binary(i, "<", ast.Assign(spreadCounter, ast.Binary(
                    ast.Access(ast.Arguments(), "length"),
                    "-",
                    len - i - 1
                  ))),
                  ast.Call(
                    ast.Access(ast.Ident("__slice"), "call"),
                    [ast.Arguments(), ast.Const(i), spreadCounter]
                  ),
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
          unassigned = {};
          if (node.generator) {
            body = generatorTranslate(node.body, innerScope, GeneratorBuilder(innerScope)).create();
          } else {
            body = translate(
              node.body,
              innerScope,
              "topStatement",
              node.autoReturn,
              unassigned
            )();
          }
          innerScope.releaseTmps();
          body = ast.Block(__toArray(initializers).concat([body]));
          if (innerScope.usedThis || node.bound instanceof ParserNode) {
            if (node.bound instanceof ParserNode) {
              fakeThis = ast.Ident("_this");
              innerScope.addVariable(fakeThis);
              body = ast.Block([
                ast.Assign(fakeThis, translate(
                  node.bound,
                  scope,
                  "expression",
                  null,
                  unassigned
                )()),
                body,
                ast.Return(fakeThis)
              ]);
            } else {
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
          }
          if (innerScope.hasStopIteration) {
            scope.hasStopIteration = true;
          }
          func = ast.Func(
            null,
            paramIdents,
            innerScope.getVariables(),
            body,
            []
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
    If: function (node, scope, location, autoReturn, unassigned) {
      var innerLocation, tLabel, tTest, tWhenFalse, tWhenTrue;
      if (location === "statement" || location === "topStatement") {
        innerLocation = "statement";
      } else {
        innerLocation = location;
      }
      tLabel = node.label && translate(node.label, scope, "label");
      tTest = translate(
        node.test,
        scope,
        "expression",
        null,
        unassigned
      );
      tWhenTrue = translate(
        node.whenTrue,
        scope,
        innerLocation,
        autoReturn,
        unassigned
      );
      if (node.whenFalse != null) {
        tWhenFalse = translate(
          node.whenFalse,
          scope,
          innerLocation,
          autoReturn,
          unassigned
        );
      }
      return function () {
        return ast.If(
          tTest(),
          tWhenTrue(),
          typeof tWhenFalse === "function" ? tWhenFalse() : void 0,
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Nothing: function () {
      return function () {
        return ast.Noop();
      };
    },
    Object: function (node, scope, location, autoReturn, unassigned) {
      var _arr, _i, _len, pair, properties, tKeys, tPrototype, tValues;
      tKeys = [];
      tValues = [];
      properties = [];
      for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        pair = _arr[_i];
        tKeys.push(translate(
          pair.key,
          scope,
          "expression",
          null,
          unassigned
        ));
        tValues.push(translate(
          pair.value,
          scope,
          "expression",
          null,
          unassigned
        ));
        properties.push(pair.property);
      }
      if (node.prototype != null) {
        tPrototype = translate(
          node.prototype,
          scope,
          "expression",
          null,
          unassigned
        );
      }
      return function () {
        var _len, _this, constPairs, currentPair, currentPairs, i, ident, key, lastProperty, obj, postConstPairs, property, prototype, result, tKey, tValue, value;
        _this = this;
        constPairs = [];
        postConstPairs = [];
        if (typeof tPrototype === "function") {
          prototype = tPrototype();
        }
        if (prototype != null) {
          currentPairs = postConstPairs;
        } else {
          currentPairs = constPairs;
        }
        lastProperty = null;
        for (i = 0, _len = tKeys.length; i < _len; ++i) {
          tKey = tKeys[i];
          tValue = tValues[i];
          key = tKey();
          value = tValue();
          property = properties[i];
          if (!(key instanceof ast.Const) || property) {
            currentPairs = postConstPairs;
          }
          currentPair = currentPairs[currentPairs.length - 1];
          if ((property === "get" || property === "set") && lastProperty && property !== lastProperty && key instanceof ast.Const && currentPair.key instanceof ast.Const && key.value === currentPair.key.value) {
            currentPair[lastProperty] = currentPair.value;
            currentPair.property = __strnum(lastProperty) + __strnum(property);
            delete currentPair.value;
            currentPair[property] = value;
            lastProperty = null;
          } else {
            currentPairs.push({ key: key, value: value, property: property });
            if (property === "get" || property === "set") {
              lastProperty = property;
            }
          }
        }
        if (prototype != null) {
          scope.addHelper("__create");
          obj = ast.Call(ast.Ident("__create"), [prototype]);
        } else {
          obj = ast.Obj((function () {
            var _arr, _i, _len, _ref, key, value;
            for (_arr = [], _i = 0, _len = constPairs.length; _i < _len; ++_i) {
              key = (_ref = constPairs[_i]).key;
              value = _ref.value;
              _arr.push(ast.Obj.Pair(String(key.value), value));
            }
            return _arr;
          }()));
        }
        if (postConstPairs.length === 0) {
          return autoReturn(obj);
        } else {
          ident = scope.reserveIdent("o", Type.object);
          result = ast.BlockExpression([ast.Assign(ident, obj)].concat(
            (function () {
              var _arr, _f, _i, _len;
              for (_arr = [], _i = 0, _len = postConstPairs.length, _f = function (pair) {
                var key, property;
                key = pair.key;
                property = pair.property;
                if (property) {
                  scope.addHelper("__defProp");
                  return ast.Call(ast.Ident("__defProp"), [
                    ident,
                    key,
                    property === "property" ? pair.value
                      : property === "getset"
                      ? ast.Obj([
                        ast.Obj.Pair("get", pair.get),
                        ast.Obj.Pair("set", pair.set),
                        ast.Obj.Pair("configurable", ast.Const(true)),
                        ast.Obj.Pair("enumerable", ast.Const(true))
                      ])
                      : property === "setget"
                      ? ast.Obj([
                        ast.Obj.Pair("set", pair.set),
                        ast.Obj.Pair("get", pair.get),
                        ast.Obj.Pair("configurable", ast.Const(true)),
                        ast.Obj.Pair("enumerable", ast.Const(true))
                      ])
                      : property === "get"
                      ? ast.Obj([
                        ast.Obj.Pair("get", pair.value),
                        ast.Obj.Pair("configurable", ast.Const(true)),
                        ast.Obj.Pair("enumerable", ast.Const(true))
                      ])
                      : property === "set"
                      ? ast.Obj([
                        ast.Obj.Pair("set", pair.value),
                        ast.Obj.Pair("configurable", ast.Const(true)),
                        ast.Obj.Pair("enumerable", ast.Const(true))
                      ])
                      : (function () {
                        throw Error("Unknown property type: " + String(property));
                      }())
                  ]);
                } else {
                  return ast.Assign(
                    ast.Access(ident, key),
                    pair.value
                  );
                }
              }; _i < _len; ++_i) {
                _arr.push(_f.call(_this, postConstPairs[_i]));
              }
              return _arr;
            }()),
            [ident]
          ));
          scope.releaseIdent(ident);
          return autoReturn(result);
        }
      };
    },
    Regexp: function (node, scope, location, autoReturn, unassigned) {
      var tSource;
      tSource = translate(
        node.source,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        var flags, source;
        source = tSource();
        flags = node.flags;
        if (source.isConst()) {
          return autoReturn(ast.Regex(String(source.constValue()), flags));
        } else {
          return autoReturn(ast.Call(ast.Ident("RegExp"), [source, ast.Const(flags)]));
        }
      };
    },
    Return: function (node, scope, location, autoReturn, unassigned) {
      var tValue;
      if (location !== "statement" && location !== "topStatement") {
        throw Error("Expected Return in statement position");
      }
      tValue = translate(
        node.node,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return ast.Return(tValue());
      };
    },
    Root: function (node, scope, location, autoReturn, unassigned) {
      var tBody;
      tBody = translate(
        node.body,
        scope,
        "topStatement",
        scope.options["return"] || scope.options["eval"],
        unassigned
      );
      return function () {
        var _arr, _i, _len, bareInit, body, callFunc, fakeThis, helper, ident, init, walker;
        body = tBody();
        init = [];
        if (scope.hasBound && scope.usedThis) {
          fakeThis = ast.Ident("_this");
          scope.addVariable(fakeThis);
          init.push(ast.Assign(fakeThis, ast.This()));
        }
        scope.fillHelperDependencies();
        for (_arr = __toArray(scope.getHelpers()), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
    Switch: function (node, scope, location, autoReturn, unassigned) {
      var _arr, _arr2, _i, _len, case_, tCases, tDefaultCase, tLabel, tNode;
      tLabel = node.label && translate(node.label, scope, "label");
      tNode = translate(
        node.node,
        scope,
        "expression",
        null,
        unassigned
      );
      for (_arr = [], _arr2 = __toArray(node.cases), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        case_ = _arr2[_i];
        _arr.push({
          tNode: translate(
            case_.node,
            scope,
            "expression",
            null,
            unassigned
          ),
          tBody: translate(
            case_.body,
            scope,
            "statement",
            null,
            unassigned
          ),
          fallthrough: case_.fallthrough
        });
      }
      tCases = _arr;
      if (node.defaultCase != null) {
        tDefaultCase = translate(
          node.defaultCase,
          scope,
          "statement",
          null,
          unassigned
        );
      }
      return function () {
        var defaultCase, node;
        node = tNode();
        if (tDefaultCase != null) {
          defaultCase = autoReturn(tDefaultCase());
        } else {
          defaultCase = ast.Noop();
        }
        return ast.Switch(
          node,
          (function () {
            var _arr, case_, caseBody, caseNode, i, len;
            for (_arr = [], i = 0, len = tCases.length; i < len; ++i) {
              case_ = tCases[i];
              caseNode = case_.tNode();
              caseBody = case_.tBody();
              if (!case_.fallthrough || i === len - 1 && defaultCase.isNoop()) {
                caseBody = ast.Block([autoReturn(caseBody), ast.Break()]);
              }
              _arr.push(ast.Switch.Case(caseNode, caseBody));
            }
            return _arr;
          }()),
          defaultCase,
          typeof tLabel === "function" ? tLabel() : void 0
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
    TmpWrapper: function (node, scope, location, autoReturn, unassigned) {
      var _arr, _i, tmp, tResult;
      tResult = translate(
        node.node,
        scope,
        location,
        autoReturn,
        unassigned
      );
      for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
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
    Throw: function (node, scope, location, autoReturn, unassigned) {
      var tNode;
      tNode = translate(
        node.node,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return ast.Throw(tNode());
      };
    },
    TryCatch: function (node, scope, location, autoReturn, unassigned) {
      var tCatchBody, tCatchIdent, tLabel, tTryBody;
      tLabel = node.label && translate(node.label, scope, "label");
      tTryBody = translate(
        node.tryBody,
        scope,
        "statement",
        autoReturn,
        unassigned
      );
      tCatchIdent = translate(node.catchIdent, scope, "leftExpression");
      tCatchBody = translate(
        node.catchBody,
        scope,
        "statement",
        autoReturn,
        unassigned
      );
      return function () {
        return ast.TryCatch(tTryBody(), tCatchIdent(), tCatchBody(), typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    TryFinally: function (node, scope, location, autoReturn, unassigned) {
      var tFinallyBody, tLabel, tTryBody;
      tLabel = node.label && translate(node.label, scope, "label");
      tTryBody = translate(
        node.tryBody,
        scope,
        "statement",
        autoReturn,
        unassigned
      );
      tFinallyBody = translate(
        node.finallyBody,
        scope,
        "statement",
        null,
        unassigned
      );
      return function () {
        return ast.TryFinally(tTryBody(), tFinallyBody(), typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    Unary: function (node, scope, location, autoReturn, unassigned) {
      var _ref, tSubnode;
      if (unassigned && ((_ref = node.op) === "++" || _ref === "--" || _ref === "++post" || _ref === "--post") && node.node instanceof ParserNode.Ident) {
        unassigned[node.node.name] = false;
      }
      tSubnode = translate(
        node.node,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return autoReturn(ast.Unary(node.op, tSubnode()));
      };
    },
    Var: function (node, scope, location, autoReturn, unassigned) {
      var tIdent;
      if (unassigned && node.ident instanceof ParserNode.Ident && !__owns.call(unassigned, node.ident.name)) {
        unassigned[node.ident.name] = true;
      }
      tIdent = translate(node.ident, scope, "leftExpression", autoReturn);
      return function () {
        var ident;
        ident = tIdent();
        scope.addVariable(ident, Type.any, node.isMutable);
        return ast.Noop();
      };
    }
  };
  function translate(node, scope, location, autoReturn, unassigned) {
    var ret;
    if (!__isObject(node)) {
      throw TypeError("Expected node to be an Object, got " + __typeof(node));
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
    if (!__owns.call(translators, node.constructor.cappedName)) {
      throw Error("Unable to translate unknown node type: " + String(node.constructor.cappedName));
    }
    ret = translators[node.constructor.cappedName](
      node,
      scope,
      location,
      autoReturn,
      unassigned
    );
    if (typeof ret !== "function") {
      throw Error("Translated non-function: " + __typeof(ret));
    }
    return ret;
  }
  function translateArray(nodes, scope, location, autoReturn, unassigned) {
    var _arr, i, len, node;
    if (!__isArray(nodes)) {
      throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
    }
    if (!(scope instanceof Scope)) {
      throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
    }
    if (typeof location !== "string") {
      throw TypeError("Expected location to be a String, got " + __typeof(location));
    }
    for (_arr = [], i = 0, len = nodes.length; i < len; ++i) {
      node = nodes[i];
      _arr.push(translate(
        nodes[i],
        scope,
        location,
        i === len - 1 && autoReturn,
        unassigned
      ));
    }
    return _arr;
  }
  module.exports = function (node, options, callback) {
    var endTime, result, ret, scope, startTime;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return module.exports(node, null, options);
    }
    startTime = new Date().getTime();
    try {
      scope = Scope(options, false);
      result = translate(
        node,
        scope,
        "statement",
        false,
        {}
      )();
      scope.releaseTmps();
    } catch (e) {
      if (callback != null) {
        return callback(e);
      } else {
        throw e;
      }
    }
    endTime = new Date().getTime();
    if (typeof options.progress === "function") {
      options.progress("translate", __num(endTime) - __num(startTime));
    }
    ret = { node: result, time: __num(endTime) - __num(startTime) };
    if (callback != null) {
      return callback(null, ret);
    } else {
      return ret;
    }
  };
  module.exports.helpers = HELPERS;
  module.exports.defineHelper = function (name, value, type, dependencies) {
    var helper, ident, scope;
    if (!(type instanceof Type)) {
      throw TypeError("Expected type to be a Type, got " + __typeof(type));
    }
    scope = Scope({}, false);
    if (typeof name === "string") {
      ident = ast.Ident(name);
    } else if (name instanceof ParserNode.Ident) {
      ident = translate(name, scope, "leftExpression")();
    } else {
      throw TypeError("Expecting name to be a String or Ident, got " + __typeof(name));
    }
    if (!(ident instanceof ast.Ident)) {
      throw Error("Expected name to be an Ident, got " + __typeof(ident));
    }
    if (value instanceof AstNode) {
      helper = value;
    } else if (value instanceof ParserNode) {
      helper = translate(value, scope, "expression")();
    } else {
      throw TypeError("Expected value to be a parser or ast Node, got " + __typeof(value));
    }
    if (dependencies == null) {
      dependencies = scope.getHelpers();
    }
    HELPERS.add(ident.name, helper, type, dependencies);
    return { helper: helper, dependencies: dependencies };
  };
}.call(this));
