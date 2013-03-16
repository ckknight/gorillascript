(function () {
  "use strict";
  var __cmp, __create, __instanceofsome, __isArray, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, ast, AstNode, GeneratorBuilder, generatorTranslate, Helpers, HELPERS, ParserNode, Scope, translators, Type;
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
  __instanceofsome = function (value, array) {
    return (function () {
      var _arr, _i, item;
      for (_arr = __toArray(array), _i = _arr.length; _i--; ) {
        item = _arr[_i];
        if (value instanceof item) {
          return true;
        }
      }
      return false;
    }());
  };
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
  ast = require("./jsast");
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
        ident = this.reserveIdent(item.pos, "ref", type);
        result = func(
          ast.Assign(item.pos, ident, item),
          ident,
          true
        );
        this.releaseIdent(ident);
        return result;
      }
    };
    _Scope_prototype.reserveIdent = function (pos, namePart, type) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
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
            ident = ast.Ident(pos, name);
            _this.addVariable(ident, type);
            return ident;
          }
        }
      }());
    };
    _Scope_prototype.reserveParam = function (pos) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
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
            return ast.Ident(pos, name);
          }
        }
      }());
    };
    _Scope_prototype.getTmp = function (pos, id, name, type) {
      var tmp, tmps;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
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
      return tmps[id] = this.reserveIdent(pos, name || "tmp", type);
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
      return ident.name in this.variables && typeof this.variables[ident.name] === "object" && this.variables[ident.name] !== null;
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
    return x.mutateLast(function (n) {
      return ast.Return(n.pos, n);
    });
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
      var _i;
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
        for (_i = dependencies.length; _i--; ) {
          if (typeof dependencies[_i] !== "string") {
            throw TypeError("Expected " + ("dependencies[" + _i + "]") + " to be a String, got " + __typeof(dependencies[_i]));
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
    function GeneratorBuilder(pos, scope, states, currentState, stateIdent, pendingFinalliesIdent, finallies, catches, currentCatch) {
      var _this;
      _this = this instanceof GeneratorBuilder ? this : __create(_GeneratorBuilder_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
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
      scope.hasStopIteration = true;
      _this.states = states != null ? states
        : [
          [
            function () {
              return ast.Throw(pos, ast.Ident(pos, "StopIteration"));
            }
          ],
          []
        ];
      _this.stateIdent = stateIdent != null ? stateIdent : scope.reserveIdent(pos, "state", Type.number);
      _this.pendingFinalliesIdent = pendingFinalliesIdent != null ? pendingFinalliesIdent : scope.reserveIdent(pos, "finallies", Type["undefined"]["function"]().array());
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
    _GeneratorBuilder_prototype["yield"] = function (pos, tNode) {
      var _this, branch;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      branch = this.branch();
      this.states[this.currentState].push(
        function () {
          return ast.Assign(pos, _this.stateIdent, branch.state);
        },
        function () {
          return ast.Return(pos, tNode());
        }
      );
      return branch.builder;
    };
    _GeneratorBuilder_prototype.goto = function (pos, tState) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      this.states[this.currentState].push(
        function () {
          return ast.Assign(pos, _this.stateIdent, tState());
        },
        function () {
          return ast.Break(pos);
        }
      );
    };
    _GeneratorBuilder_prototype.pendingFinally = function (pos, tFinallyBody) {
      var _this, ident;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      ident = this.scope.reserveIdent(pos, "finally", Type["undefined"]["function"]());
      this.scope.removeVariable(ident);
      this.finallies.push(function () {
        return ast.Func(
          pos,
          ident,
          [],
          [],
          tFinallyBody()
        );
      });
      this.states[this.currentState].push(function () {
        return ast.Call(
          pos,
          ast.Access(pos, _this.pendingFinalliesIdent, "push"),
          [ident]
        );
      });
      return this;
    };
    _GeneratorBuilder_prototype.runPendingFinally = function (pos) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      this.states[this.currentState].push(function () {
        return ast.Call(
          pos,
          ast.Access(
            pos,
            ast.Call(pos, ast.Access(pos, _this.pendingFinalliesIdent, "pop")),
            "call"
          ),
          [ast.This(pos)]
        );
      });
      return this;
    };
    _GeneratorBuilder_prototype.noop = function (pos) {
      var _this, branch;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (this.states[this.currentState].length) {
        branch = this.branch();
        this.states[this.currentState].push(function () {
          return ast.Assign(pos, _this.stateIdent, branch.state);
        });
        return branch.builder;
      } else {
        return this;
      }
    };
    _GeneratorBuilder_prototype.enterTryCatch = function (pos) {
      var fresh;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      fresh = this.noop(pos);
      fresh.currentCatch = __toArray(fresh.currentCatch).concat([[fresh.currentState]]);
      return fresh;
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (pos, tIdent, tPostState) {
      var catchStates, fresh;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (this.currentCatch.length === 0) {
        throw Error("Unable to exit-try-catch without first using enter-try-catch");
      }
      this.goto(pos, tPostState);
      fresh = this.noop(pos);
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
          this.pos,
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
        return ast.Assign(_this.pos, _this.stateIdent, 0);
      });
      body = [ast.Assign(this.pos, this.stateIdent, 1)];
      close = this.scope.reserveIdent(this.pos, "close", Type["undefined"]["function"]());
      this.scope.removeVariable(close);
      if (this.finallies.length === 0) {
        this.scope.removeVariable(this.pendingFinalliesIdent);
        body.push(ast.Func(
          this.pos,
          close,
          [],
          [],
          ast.Block(this.pos, [ast.Assign(this.pos, this.stateIdent, 0)])
        ));
      } else {
        body.push(ast.Assign(this.pos, this.pendingFinalliesIdent, ast.Arr(this.pos)));
        body.push.apply(body, (function () {
          var _arr, _arr2, _i, _len, f;
          for (_arr = [], _arr2 = __toArray(_this.finallies), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            f = _arr2[_i];
            _arr.push(f());
          }
          return _arr;
        }()));
        innerScope = this.scope.clone(false);
        f = innerScope.reserveIdent(this.pos, "f", Type["undefined"]["function"]().union(Type["undefined"]));
        body.push(ast.Func(
          this.pos,
          close,
          [],
          innerScope.getVariables(),
          ast.Block(this.pos, [
            ast.Assign(this.pos, this.stateIdent, 0),
            ast.Assign(this.pos, f, ast.Call(this.pos, ast.Access(this.pos, this.pendingFinalliesIdent, "pop"))),
            ast.If(this.pos, f, ast.TryFinally(
              this.pos,
              ast.Call(this.pos, f),
              ast.Call(this.pos, close)
            ))
          ])
        ));
      }
      scope = this.scope;
      err = scope.reserveIdent(this.pos, "e", Type.any);
      catches = this.catches;
      stateIdent = this.stateIdent;
      body.push(ast.Return(this.pos, ast.Obj(this.pos, [
        ast.Obj.Pair(this.pos, "close", close),
        ast.Obj.Pair(this.pos, "iterator", ast.Func(
          this.pos,
          null,
          [],
          [],
          ast.Return(this.pos, ast.This(this.pos))
        )),
        ast.Obj.Pair(this.pos, "next", ast.Func(
          this.pos,
          null,
          [],
          [],
          ast.While(this.pos, true, ast.TryCatch(
            this.pos,
            ast.Switch(
              this.pos,
              stateIdent,
              (function () {
                var _arr, _arr2, _arr3, _arr4, _i, _len, _len2, i, item, items, state;
                for (_arr = [], _arr2 = __toArray(_this.states), i = 0, _len = _arr2.length; i < _len; ++i) {
                  state = _arr2[i];
                  for (_arr3 = [], _arr4 = __toArray(state), _i = 0, _len2 = _arr4.length; _i < _len2; ++_i) {
                    item = _arr4[_i];
                    _arr3.push(item());
                  }
                  items = _arr3;
                  _arr.push(ast.Switch.Case(items[0].pos, i, ast.Block(_this.pos, __toArray(items).concat([ast.Break(items[items.length - 1].pos)]))));
                }
                return _arr;
              }()),
              ast.Throw(this.pos, ast.Call(
                this.pos,
                ast.Ident(this.pos, "Error"),
                [ast.Binary(this.pos, "Unknown state: ", "+", stateIdent)]
              ))
            ),
            err,
            (function () {
              var _arr, _f, _i, current;
              current = ast.Block(_this.pos, [
                ast.Call(_this.pos, close),
                ast.Throw(_this.pos, err)
              ]);
              for (_arr = __toArray(catches), _i = _arr.length, _f = function (catchInfo) {
                var _this, errIdent;
                _this = this;
                errIdent = catchInfo.tIdent();
                scope.addVariable(errIdent);
                return current = ast.If(
                  this.pos,
                  ast.Or.apply(ast, [this.pos].concat((function () {
                    var _arr, _arr2, _i, _len, state;
                    for (_arr = [], _arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                      state = _arr2[_i];
                      _arr.push(ast.Binary(_this.pos, stateIdent, "===", state));
                    }
                    return _arr;
                  }()))),
                  ast.Block(this.pos, [
                    ast.Assign(this.pos, errIdent, err),
                    ast.Assign(this.pos, stateIdent, catchInfo.catchState)
                  ]),
                  current
                );
              }; _i--; ) {
                _f.call(_this, _arr[_i]);
              }
              return current;
            }())
          ))
        ))
      ])));
      return ast.Block(this.pos, body);
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
  function makePos(line, column, file) {
    var pos;
    if (typeof line !== "number") {
      throw TypeError("Expected line to be a Number, got " + __typeof(line));
    }
    if (typeof column !== "number") {
      throw TypeError("Expected column to be a Number, got " + __typeof(column));
    }
    if (file == null) {
      file = void 0;
    } else if (typeof file !== "string") {
      throw TypeError("Expected file to be a String or undefined, got " + __typeof(file));
    }
    pos = { line: line, column: column };
    if (file != null) {
      pos.file = file;
    }
    return pos;
  }
  function getPos(node) {
    if (!(node instanceof ParserNode)) {
      throw TypeError("Expected node to be a ParserNode, got " + __typeof(node));
    }
    return makePos(node.line, node.column, node.file);
  }
  generatorTranslate = (function () {
    var generatorTranslators;
    function hasGeneratorNode(node, checking) {
      var FOUND;
      if (checking == null) {
        checking = [ParserNode.Yield, ParserNode.Break, ParserNode.Continue];
      }
      FOUND = {};
      function walker(node) {
        if (__instanceofsome(node, checking)) {
          throw FOUND;
        } else if (node instanceof ParserNode.For || node instanceof ParserNode.ForIn) {
          return node.walk(function (n) {
            if (hasGeneratorNode(n, [ParserNode.Yield])) {
              throw FOUND;
            } else {
              return n;
            }
          });
        } else if (node instanceof ParserNode.Switch) {
          return node.walk(function (n) {
            if (hasGeneratorNode(n, [ParserNode.Yield, ParserNode.Continue])) {
              throw FOUND;
            } else {
              return n;
            }
          });
        } else {
          return node.walk(walker);
        }
      }
      try {
        walker(node);
      } catch (e) {
        if (e === FOUND) {
          return true;
        } else {
          throw e;
        }
      }
      return false;
    }
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
        builder.goto(getPos(node), breakState);
        return builder;
      },
      Continue: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: continue with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(getPos(node), continueState);
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
        builder.goto(getPos(node), function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(getPos(node.step), function () {
          return testBranch.state;
        });
        testBranch.builder.goto(getPos(node.test), function () {
          return ast.IfExpression(getPos(node.test), tTest(), bodyBranch.state, postBranch.state);
        });
        bodyBranch.builder.goto(getPos(node.body), function () {
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
        keys = scope.reserveIdent(getPos(node), "keys", Type.string.array());
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
        index = scope.reserveIdent(getPos(node), "i", Type.number);
        length = scope.reserveIdent(getPos(node), "len", Type.number);
        builder.add(function () {
          return ast.Block(getPos(node), [
            ast.Assign(getPos(node), keys, ast.Arr(getPos(node))),
            ast.ForIn(getPos(node), getKey(), tObject(), ast.Call(
              getPos(node),
              ast.Access(getPos(node), keys, "push"),
              [getKey()]
            )),
            ast.Assign(getPos(node), index, 0),
            ast.Assign(getPos(node), length, ast.Access(getPos(node), keys, "length"))
          ]);
        });
        stepBranch = builder.branch();
        stepBranch.builder.add(function () {
          return ast.Unary(getPos(node), "++", index);
        });
        testBranch = builder.branch();
        bodyBranch = builder.branch();
        bodyBranch.builder.add(function () {
          return ast.Assign(getPos(node), getKey(), ast.Access(getPos(node), keys, index));
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
        builder.goto(getPos(node), function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(getPos(node), function () {
          return testBranch.state;
        });
        testBranch.builder.goto(getPos(node), function () {
          return ast.IfExpression(
            getPos(node),
            ast.Binary(getPos(node), index, "<", length),
            bodyBranch.state,
            postBranch.state
          );
        });
        bodyBranch.builder.goto(getPos(node.body), function () {
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
        builder.goto(getPos(node), function () {
          return ast.IfExpression(getPos(node.test), tTest(), whenTrueBranch.state, whenFalseBranch != null ? whenFalseBranch.state : postBranch.state);
        });
        gWhenTrue.goto(getPos(node.whenTrue), function () {
          return postBranch.state;
        });
        if (whenFalse != null) {
          gWhenFalse.goto(getPos(node.whenFalse), function () {
            return postBranch.state;
          });
        }
        return postBranch.builder;
      },
      Switch: function (node, scope, builder, breakState, continueState) {
        var _arr, _f, _len, bodyStates, cachedNode, gDefaultBody, i, postBranch, tNode;
        tNode = translate(node.node, scope, "expression");
        cachedNode = scope.reserveIdent(getPos(node), "ref");
        builder.add(function () {
          return ast.Assign(getPos(node), cachedNode, tNode());
        });
        bodyStates = [];
        for (_arr = __toArray(node.cases), i = 0, _len = _arr.length, _f = function (case_, i) {
          var equalBranch, gCaseBody, inequalBranch, tCaseNode;
          tCaseNode = translate(case_.node, scope, "expression");
          equalBranch = builder.branch();
          bodyStates[i] = equalBranch.state;
          gCaseBody = generatorTranslate(
            case_.body,
            scope,
            equalBranch.builder,
            function () {
              return postBranch.state;
            },
            continueState
          );
          gCaseBody.goto(getPos(case_.node), case_.fallthrough
            ? function () {
              return bodyStates[i + 1] || postBranch.state;
            }
            : function () {
              return postBranch.state;
            });
          inequalBranch = builder.branch();
          builder.goto(getPos(node), function () {
            return ast.IfExpression(
              getPos(node.node),
              ast.Binary(getPos(case_.node), cachedNode, "===", tCaseNode()),
              equalBranch.state,
              inequalBranch.state
            );
          });
          return builder = inequalBranch.builder;
        }; i < _len; ++i) {
          _f.call(this, _arr[i], i);
        }
        if (node.defaultCase != null) {
          gDefaultBody = generatorTranslate(
            node.defaultCase,
            scope,
            builder,
            function () {
              return postBranch.state;
            },
            continueState
          );
          gDefaultBody.goto(getPos(node.defaultCase), function () {
            return postBranch.state;
          });
        } else {
          builder.goto(getPos(node), function () {
            return postBranch.state;
          });
        }
        postBranch = builder.branch();
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
        builder = builder.enterTryCatch(getPos(node));
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        builder = builder.exitTryCatch(
          getPos(node.tryBody),
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
        builder.goto(getPos(node), function () {
          return postBranch.state;
        });
        return postBranch.builder;
      },
      TryFinally: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
        builder = builder.pendingFinally(getPos(node), translate(node.finallyBody, scope, "topStatement"));
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        return builder.runPendingFinally(getPos(node));
      },
      Yield: function (node, scope, builder) {
        return builder["yield"](getPos(node), translate(node.node, scope, "expression"));
      }
    };
    return function (node, scope, builder, breakState, continueState) {
      var ret;
      if (__owns.call(generatorTranslators, node.constructor.cappedName) && hasGeneratorNode(node)) {
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
  function arrayTranslate(pos, elements, scope, replaceWithSlice, allowArrayLike, unassigned) {
    var _arr, _f, _i, _len, current, element, i, translatedItems;
    if (typeof pos !== "object" || pos === null) {
      throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
    }
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
        return ast.Arr(pos, (function () {
          var _arr, _arr2, _i, _len, tItem;
          for (_arr = [], _arr2 = __toArray(translatedItems[0]), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            tItem = _arr2[_i];
            _arr.push(tItem());
          }
          return _arr;
        }()));
      };
    } else {
      for (i = translatedItems.length, _f = function (translatedItem, i) {
        if (i % 2 === 0) {
          if (__num(translatedItem.length) > 0) {
            return translatedItems[i] = function () {
              var _arr, _arr2, _i, _len, items, tItem;
              for (_arr = [], _arr2 = __toArray(translatedItem), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                tItem = _arr2[_i];
                _arr.push(tItem());
              }
              items = _arr;
              return ast.Arr(items[0].pos, items);
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
              return ast.Call(
                node.pos,
                ast.Ident(node.pos, "__toArray"),
                [node]
              );
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
              pos,
              ast.Access(
                pos,
                ast.Ident(pos, "__slice"),
                "call"
              ),
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
            pos,
            ast.Access(pos, head, "concat"),
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
        return autoReturn(ast.Access(getPos(node), tParent(), tChild()));
      };
    },
    Args: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Arguments(getPos(node)));
      };
    },
    Array: function (node, scope, location, autoReturn, unassigned) {
      var tArr;
      tArr = arrayTranslate(
        getPos(node),
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
              return ast.Noop(getPos(node));
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
              getPos(node),
              left,
              right.params,
              right.variables,
              right.body,
              right.declarations
            );
            if (autoReturn !== identity) {
              return ast.Block(getPos(node), [func, autoReturn(left)]);
            } else {
              return func;
            }
          } else {
            return autoReturn(ast.Binary(getPos(node), left, op, right));
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
        return autoReturn(ast.Binary(getPos(node), tLeft(), node.op, tRight()));
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
          getPos(node),
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
        return ast.Break(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
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
            return ast.Const(getPos(node), void 0);
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
          getPos(node),
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
              getPos(node),
              ast.Access(getPos(node), func, "call"),
              [start].concat(__toArray(argArray.elements))
            ));
          } else {
            return autoReturn(ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "apply"),
              [start, argArray]
            ));
          }
        };
      } else {
        tArgArray = arrayTranslate(
          getPos(node),
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
                getPos(node),
                ast.Access(getPos(node), func, "apply"),
                [
                  ast.Access(getPos(node), setArray, 0),
                  ast.Call(
                    getPos(node),
                    ast.Access(
                      getPos(node),
                      ast.Ident(getPos(node), "__slice"),
                      "call"
                    ),
                    [
                      array,
                      ast.Const(getPos(node), 1)
                    ]
                  )
                ]
              ));
            });
          } else if (argArray instanceof ast.Arr) {
            return autoReturn(ast.Call(getPos(node), func, argArray.elements, isNew));
          } else if (isNew) {
            scope.addHelper("__new");
            return autoReturn(ast.Call(
              getPos(node),
              ast.Ident(getPos(node), "__new"),
              [func, argArray]
            ));
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, Type["function"], function (setParent, parent) {
              return autoReturn(ast.Call(
                getPos(node),
                ast.Access(getPos(node), setParent, func.right, "apply"),
                [parent, argArray]
              ));
            });
          } else {
            return autoReturn(ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "apply"),
              [
                ast.Const(getPos(node), void 0),
                argArray
              ]
            ));
          }
        };
      }
    },
    Comment: function (node, scope, location, autoReturn) {
      return function () {
        return ast.Comment(getPos(node), node.text);
      };
    },
    Const: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Const(getPos(node), node.value));
      };
    },
    Continue: function (node, scope) {
      var tLabel;
      tLabel = node.label && translate(node.label, scope, "label");
      return function () {
        return ast.Continue(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    Debugger: function (node) {
      return function () {
        return ast.Debugger(getPos(node));
      };
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
        return autoReturn(ast.Eval(getPos(node), tCode()));
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
          getPos(node),
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
        return ast.ForIn(
          getPos(node),
          key,
          tObject(),
          tBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Function: (function () {
      var primitiveTypes, translateParamTypes, translateType, translateTypeChecks;
      primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
      function makeTypeCheckTest(ident, type, scope) {
        if (__owns.call(primitiveTypes, type)) {
          return ast.Binary(
            ident.pos,
            ast.Unary(ident.pos, "typeof", ident),
            "!==",
            primitiveTypes[type]
          );
        } else if (type === "Array") {
          scope.addHelper("__isArray");
          return ast.Unary(ident.pos, "!", ast.Call(
            ident.pos,
            ast.Ident(ident.pos, "__isArray"),
            [ident]
          ));
        } else if (type === "Object") {
          scope.addHelper("__isObject");
          return ast.Unary(ident.pos, "!", ast.Call(
            ident.pos,
            ast.Ident(ident.pos, "__isObject"),
            [ident]
          ));
        } else {
          return ast.Unary(ident.pos, "!", ast.Binary(ident.pos, ident, "instanceof", ast.Ident(ident.pos, type)));
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
          return [typeof accesses[0].value === "string" && ast.isAcceptableIdent(accesses[0].value) ? "." + __strnum(accesses[0].value) : "[" + __str(JSON.stringify(accesses[0].value)) + "]"].concat(__toArray(buildAccessStringNode(__slice.call(accesses, 1))));
        } else {
          return ["[", accesses[0], "]"].concat(__toArray(buildAccessStringNode(__slice.call(accesses, 1))));
        }
      }
      translateTypeChecks = {
        Ident: function (node) {
          if (__owns.call(primitiveTypes, node.name)) {
            return Type[primitiveTypes[node.name]];
          } else {
            return Type.any;
          }
        },
        Access: function (node) {
          return Type.any;
        },
        TypeUnion: function (node) {
          var _arr, _i, _len, result, type;
          result = Type.none;
          for (_arr = __toArray(node.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            type = _arr[_i];
            if (type instanceof ParserNode.Const) {
              if (type.value === null) {
                result = result.union(Type["null"]);
              } else if (type.value === void 0) {
                result = result.union(Type["undefined"]);
              } else {
                throw Error("Unknown const value for typechecking: " + String(type.value));
              }
            } else if (type instanceof ParserNode.Ident) {
              result = result.union(__owns.call(primitiveTypes, type.name) ? Type[primitiveTypes[type.name]] : Type.any);
            } else {
              throw Error("Not implemented: typechecking for non-idents/consts within a type-union");
            }
          }
          return result;
        },
        TypeFunction: function (node) {
          return Type["function"];
        },
        TypeGeneric: function (node) {
          if (node.basetype.name === "Array") {
            return translateTypeCheck(node.args[0]).array();
          } else if (node.basetype.name === "Function") {
            return Type["function"];
          } else {
            return Type.any;
          }
        },
        TypeObject: function (node) {
          var _arr, _i, _len, _ref, key, typeData, value;
          typeData = {};
          for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            key = (_ref = _arr[_i]).key;
            value = _ref.value;
            if (key instanceof ParserNode.Const) {
              typeData[key.value] = translateTypeCheck(value);
            }
          }
          return Type.makeObject(typeData);
        }
      };
      function translateTypeCheck(node) {
        if (!__owns.call(translateTypeChecks, node.constructor.cappedName)) {
          throw Error("Unknown type: " + String(node.constructor.cappedName));
        }
        return translateTypeChecks[node.constructor.cappedName](node);
      }
      translateParamTypes = {
        Param: function (param, scope, inner) {
          var ident, laterInit, tmp, type;
          ident = translate(param.ident, scope, "param")();
          if (param.ident instanceof ParserNode.Tmp) {
            scope.markAsParam(ident);
          }
          laterInit = [];
          if (ident instanceof ast.Binary && ident.op === "." && ident.right instanceof ast.Const && typeof ident.right.value === "string") {
            tmp = ast.Ident(ident.pos, ident.right.value);
            laterInit.push(ast.Binary(ident.pos, ident, "=", tmp));
            ident = tmp;
          }
          if (!(ident instanceof ast.Ident)) {
            throw Error("Expecting param to be an Ident, got " + __typeof(ident));
          }
          if (param.asType) {
            type = translateTypeCheck(param.asType);
          }
          if (inner) {
            scope.addVariable(ident, type, param.isMutable);
          }
          return { init: laterInit, ident: ident, spread: !!param.spread };
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
          TypeGeneric: function (node, scope) {
            var _arr, _arr2, _i, _len, arg, args, base;
            base = translateType(node.basetype, scope);
            for (_arr = [], _arr2 = __toArray(node.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              arg = _arr2[_i];
              _arr.push(translateType(arg, scope));
            }
            args = _arr;
            return Type.generic.apply(Type, [base].concat(__toArray(args)));
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
          var _arr, body, diff, fakeThis, foundSpread, func, i, initializers, innerScope, len, p, param, paramIdents, realInnerScope, spreadCounter, unassigned;
          innerScope = scope.clone(!!node.bound);
          realInnerScope = innerScope;
          if (node.generator && !innerScope.bound) {
            innerScope = innerScope.clone(true);
          }
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
                initializers.push(ast.Assign(param.ident.pos, param.ident, ast.Access(param.ident.pos, ast.Arguments(param.ident.pos), diff === 0 ? spreadCounter : ast.Binary(param.ident.pos, spreadCounter, "+", diff))));
              }
            } else {
              if (foundSpread !== -1) {
                throw Error("Encountered multiple spread parameters");
              }
              foundSpread = i;
              innerScope.addHelper("__slice");
              innerScope.addVariable(param.ident, Type.array, param.isMutable);
              if (i === len - 1) {
                initializers.push(ast.Assign(param.ident.pos, param.ident, ast.Call(
                  param.ident.pos,
                  ast.Access(
                    param.ident.pos,
                    ast.Ident(param.ident.pos, "__slice"),
                    "call"
                  ),
                  [ast.Arguments(param.ident.pos)].concat(i === 0 ? []
                    : [ast.Const(param.ident.pos, i)])
                )));
              } else {
                spreadCounter = innerScope.reserveIdent(param.ident.pos, "ref", Type.number);
                initializers.push(ast.Assign(param.ident.pos, param.ident, ast.IfExpression(
                  param.ident.pos,
                  ast.Binary(param.ident.pos, i, "<", ast.Assign(param.ident.pos, spreadCounter, ast.Binary(
                    param.ident.pos,
                    ast.Access(param.ident.pos, ast.Arguments(param.ident.pos), "length"),
                    "-",
                    len - i - 1
                  ))),
                  ast.Call(
                    param.ident.pos,
                    ast.Access(
                      param.ident.pos,
                      ast.Ident(param.ident.pos, "__slice"),
                      "call"
                    ),
                    [
                      ast.Arguments(param.ident.pos),
                      ast.Const(param.ident.pos, i),
                      spreadCounter
                    ]
                  ),
                  ast.BlockExpression(param.ident.pos, [
                    ast.Assign(param.ident.pos, spreadCounter, ast.Const(param.ident.pos, i)),
                    ast.Arr(param.ident.pos)
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
            body = generatorTranslate(node.body, innerScope, GeneratorBuilder(getPos(node), innerScope)).create();
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
          body = ast.Block(getPos(node.body), __toArray(initializers).concat([body]));
          if (innerScope.usedThis || node.bound instanceof ParserNode) {
            if (node.bound instanceof ParserNode) {
              fakeThis = ast.Ident(getPos(node.body), "_this");
              innerScope.addVariable(fakeThis);
              body = ast.Block(getPos(node.body), [
                ast.Assign(getPos(node.body), fakeThis, translate(
                  node.bound,
                  scope,
                  "expression",
                  null,
                  unassigned
                )()),
                body,
                ast.Return(getPos(node.body), fakeThis)
              ]);
            } else {
              if (innerScope.bound) {
                scope.usedThis = true;
              }
              if ((innerScope.hasBound || node.generator) && !realInnerScope.bound) {
                fakeThis = ast.Ident(getPos(node.body), "_this");
                innerScope.addVariable(fakeThis);
                body = ast.Block(getPos(node.body), [
                  ast.Assign(getPos(node.body), fakeThis, ast.This(getPos(node.body))),
                  body
                ]);
              }
            }
          }
          if (innerScope.hasStopIteration) {
            scope.hasStopIteration = true;
          }
          if (innerScope.hasGlobal) {
            scope.hasGlobal = true;
          }
          func = ast.Func(
            getPos(node),
            null,
            paramIdents,
            innerScope.getVariables(),
            body,
            []
          );
          return autoReturn(node.curry
            ? (scope.addHelper("__curry"), ast.Call(
              func.pos,
              ast.Ident(func.pos, "__curry"),
              [func]
            ))
            : func);
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
      if (name === "GLOBAL") {
        scope.hasGlobal = true;
      }
      return function () {
        return autoReturn(ast.Ident(getPos(node), name));
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
          getPos(node),
          tTest(),
          tWhenTrue(),
          typeof tWhenFalse === "function" ? tWhenFalse() : void 0,
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Nothing: function (node) {
      return function () {
        return ast.Noop(getPos(node));
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
          obj = ast.Call(
            getPos(node),
            ast.Ident(getPos(node), "__create"),
            [prototype]
          );
        } else {
          obj = ast.Obj(getPos(node), (function () {
            var _arr, _i, _len, _ref, key, value;
            for (_arr = [], _i = 0, _len = constPairs.length; _i < _len; ++_i) {
              key = (_ref = constPairs[_i]).key;
              value = _ref.value;
              _arr.push(ast.Obj.Pair(key.pos, String(key.value), value));
            }
            return _arr;
          }()));
        }
        if (postConstPairs.length === 0) {
          return autoReturn(obj);
        } else {
          ident = scope.reserveIdent(getPos(node), "o", Type.object);
          result = ast.BlockExpression(getPos(node), [ast.Assign(getPos(node), ident, obj)].concat(
            (function () {
              var _arr, _f, _i, _len;
              for (_arr = [], _i = 0, _len = postConstPairs.length, _f = function (pair) {
                var key, property;
                key = pair.key;
                property = pair.property;
                if (property) {
                  scope.addHelper("__defProp");
                  return ast.Call(
                    key.pos,
                    ast.Ident(key.pos, "__defProp"),
                    [
                      ident,
                      key,
                      property === "property" ? pair.value
                        : property === "getset"
                        ? ast.Obj(pair.get.pos, [
                          ast.Obj.Pair(pair.get.pos, "get", pair.get),
                          ast.Obj.Pair(pair.set.pos, "set", pair.set),
                          ast.Obj.Pair(pair.set.pos, "configurable", ast.Const(pair.set.pos, true)),
                          ast.Obj.Pair(pair.set.pos, "enumerable", ast.Const(pair.set.pos, true))
                        ])
                        : property === "setget"
                        ? ast.Obj(pair.set.pos, [
                          ast.Obj.Pair(pair.set.pos, "set", pair.set),
                          ast.Obj.Pair(pair.get.pos, "get", pair.get),
                          ast.Obj.Pair(pair.get.pos, "configurable", ast.Const(pair.get.pos, true)),
                          ast.Obj.Pair(pair.get.pos, "enumerable", ast.Const(pair.get.pos, true))
                        ])
                        : property === "get"
                        ? ast.Obj(pair.value.pos, [
                          ast.Obj.Pair(pair.value.pos, "get", pair.value),
                          ast.Obj.Pair(pair.value.pos, "configurable", ast.Const(pair.value.pos, true)),
                          ast.Obj.Pair(pair.value.pos, "enumerable", ast.Const(pair.value.pos, true))
                        ])
                        : property === "set"
                        ? ast.Obj(pair.value.pos, [
                          ast.Obj.Pair(pair.value.pos, "set", pair.value),
                          ast.Obj.Pair(pair.value.pos, "configurable", ast.Const(pair.value.pos, true)),
                          ast.Obj.Pair(pair.value.pos, "enumerable", ast.Const(pair.value.pos, true))
                        ])
                        : (function () {
                          throw Error("Unknown property type: " + String(property));
                        }())
                    ]
                  );
                } else {
                  return ast.Assign(
                    key.pos,
                    ast.Access(key.pos, ident, key),
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
          return autoReturn(ast.Regex(getPos(node), String(source.constValue()), flags));
        } else {
          return autoReturn(ast.Call(
            getPos(node),
            ast.Ident(getPos(node), "RegExp"),
            [
              source,
              ast.Const(getPos(node), flags)
            ]
          ));
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
        return ast.Return(getPos(node), tValue());
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
          pos: getPos(case_.node),
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
        return ast.Switch(
          getPos(node),
          tNode(),
          (function () {
            var _arr, case_, caseBody, caseNode, i, len;
            for (_arr = [], i = 0, len = tCases.length; i < len; ++i) {
              case_ = tCases[i];
              caseNode = case_.tNode();
              caseBody = case_.tBody();
              if (!case_.fallthrough || i === len - 1 && defaultCase.isNoop()) {
                caseBody = ast.Block(case_.pos, [autoReturn(caseBody), ast.Break(caseBody.pos)]);
              }
              _arr.push(ast.Switch.Case(case_.pos, caseNode, caseBody));
            }
            return _arr;
          }()),
          tDefaultCase != null ? autoReturn(tDefaultCase()) : ast.Noop(getPos(node)),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Super: function (node, scope, location, autoReturn) {
      throw Error("Cannot have a stray super call");
    },
    Tmp: function (node, scope, location, autoReturn) {
      var ident;
      ident = scope.getTmp(getPos(node), node.id, node.name, node.type());
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
        return autoReturn(scope.bound ? ast.Ident(getPos(node), "_this") : ast.This(getPos(node)));
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
        return ast.Throw(getPos(node), tNode());
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
        return ast.TryCatch(
          getPos(node),
          tTryBody(),
          tCatchIdent(),
          tCatchBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
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
        return ast.TryFinally(getPos(node), tTryBody(), tFinallyBody(), typeof tLabel === "function" ? tLabel() : void 0);
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
        return autoReturn(ast.Unary(getPos(node), node.op, tSubnode()));
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
        return ast.Noop(getPos(node));
      };
    }
  };
  function translate(node, scope, location, autoReturn, unassigned) {
    var ret;
    if (typeof node !== "object" || node === null) {
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
  function translateRoot(roots, scope) {
    var _arr, _i, _len, _ref, bareInit, body, callFunc, comments, fakeThis, globalNode, helper, ident, init, noPos, uncommentedBody, walker;
    if (typeof roots !== "object" || roots === null) {
      throw TypeError("Expected roots to be an Object, got " + __typeof(roots));
    }
    if (!(scope instanceof Scope)) {
      throw TypeError("Expected scope to be a Scope, got " + __typeof(scope));
    }
    if (!__isArray(roots)) {
      roots = [roots];
    }
    if (roots.length === 0) {
      roots.push({
        type: "Root",
        line: 0,
        column: 0,
        body: { type: "Nothing", line: 0, column: 0 }
      });
    }
    function splitComments(body) {
      var comments;
      comments = [];
      while (true) {
        if (body instanceof ast.Comment) {
          comments.push(body);
          body = ast.Noop(body.pos);
        } else if (body instanceof ast.Block && body.body[0] instanceof ast.Comment) {
          comments.push(body.body[0]);
          body = ast.Block(body.pos, __slice.call(body.body, 1));
        } else {
          break;
        }
      }
      return { comments: comments, body: body };
    }
    noPos = makePos(0, 0);
    if (roots.length === 1) {
      if (!(roots[0] instanceof ParserNode.Root)) {
        throw Error("Cannot translate non-Root object");
      }
      body = ast.Block(getPos(roots[0]), [
        translate(
          roots[0].body,
          scope,
          "topStatement",
          scope.options["return"] || scope.options["eval"],
          []
        )()
      ]);
    } else {
      body = ast.Block(noPos, (function () {
        var _arr, _arr2, _i, _len, _ref, comments, innerScope, root, rootBody, rootPos;
        for (_arr = [], _arr2 = __toArray(roots), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          root = _arr2[_i];
          if (!(root instanceof ParserNode.Root)) {
            throw Error("Cannot translate non-Root object");
          }
          innerScope = scope.clone(true);
          comments = (_ref = splitComments(translate(
            root.body,
            innerScope,
            "topStatement",
            scope.options["return"] || scope.options["eval"],
            []
          )())).comments;
          rootBody = _ref.body;
          rootPos = getPos(root);
          _arr.push(ast.Block(rootPos, __toArray(comments).concat([
            ast.Call(rootPos, ast.Func(
              rootPos,
              null,
              [],
              innerScope.getVariables(),
              rootBody
            ))
          ])));
        }
        return _arr;
      }()));
    }
    globalNode = ast.If(
      body.pos,
      ast.Binary(
        body.pos,
        ast.Unary(body.pos, "typeof", ast.Ident(body.pos, "window")),
        "!==",
        "undefined"
      ),
      ast.Ident(body.pos, "window"),
      ast.If(
        body.pos,
        ast.Binary(
          body.pos,
          ast.Unary(body.pos, "typeof", ast.Ident(body.pos, "global")),
          "!==",
          "undefined"
        ),
        ast.Ident(body.pos, "global"),
        ast.This(body.pos)
      )
    );
    init = [];
    if (scope.hasBound && scope.usedThis) {
      fakeThis = ast.Ident(body.pos, "_this");
      scope.addVariable(fakeThis);
      init.push(ast.Assign(body.pos, fakeThis, ast.This(body.pos)));
    }
    scope.fillHelperDependencies();
    for (_arr = __toArray(scope.getHelpers()), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      helper = _arr[_i];
      if (HELPERS.has(helper)) {
        ident = ast.Ident(body.pos, helper);
        scope.addVariable(ident);
        init.push(ast.Assign(body.pos, ident, HELPERS.get(helper)));
      }
    }
    bareInit = [];
    if (scope.hasStopIteration) {
      bareInit.push(ast.If(
        body.pos,
        ast.Binary(
          body.pos,
          ast.Unary(body.pos, "typeof", ast.Ident(body.pos, "StopIteration")),
          "===",
          "undefined"
        ),
        ast.Assign(
          body.pos,
          ast.Ident(body.pos, "StopIteration"),
          ast.If(
            body.pos,
            ast.Binary(
              body.pos,
              ast.Unary(body.pos, "typeof", ast.Access(
                body.pos,
                ast.Ident(body.pos, "Object"),
                "freeze"
              )),
              "===",
              "function"
            ),
            ast.Call(
              body.pos,
              ast.Access(
                body.pos,
                ast.Ident(body.pos, "Object"),
                "freeze"
              ),
              [ast.Obj(body.pos)]
            ),
            ast.Obj(body.pos)
          )
        )
      ));
    }
    if (scope.options["eval"]) {
      scope.hasGlobal = true;
      walker = function (node) {
        if (node instanceof ast.Func) {
          if (node.name != null) {
            return ast.Block(node.pos, [
              node,
              ast.Assign(
                node.pos,
                ast.Access(
                  node.pos,
                  ast.Ident(node.pos, "GLOBAL"),
                  node.name.name
                ),
                node.name
              )
            ]);
          } else {
            return node;
          }
        } else if (node instanceof ast.Binary && node.op === "=" && node.left instanceof ast.Ident) {
          return ast.Assign(
            node.pos,
            ast.Access(
              node.pos,
              ast.Ident(node.pos, "GLOBAL"),
              node.left.name
            ),
            node.walk(walker)
          );
        }
      };
      body = body.walk(walker);
      body = body.mutateLast(
        function (node) {
          return ast.Assign(
            node.pos,
            ast.Access(
              node.pos,
              ast.Ident(node.pos, "GLOBAL"),
              ast.Const(node.pos, "_")
            ),
            node
          );
        },
        { "return": true }
      );
    }
    if (scope.options.bare) {
      if (scope.hasGlobal) {
        scope.addVariable(ast.Ident(body.pos, "GLOBAL"));
        bareInit.unshift(ast.Assign(
          body.pos,
          ast.Ident(body.pos, "GLOBAL"),
          globalNode
        ));
      }
      if (scope.options.undefinedName != null) {
        scope.addVariable(scope.options.undefinedName);
      }
      comments = (_ref = splitComments(body)).comments;
      uncommentedBody = _ref.body;
      return ast.Root(
        body.pos,
        ast.Block(body.pos, __toArray(comments).concat(__toArray(bareInit), __toArray(init), [uncommentedBody])),
        scope.getVariables(),
        ["use strict"]
      );
    } else {
      comments = (_ref = splitComments(body)).comments;
      uncommentedBody = _ref.body;
      callFunc = ast.Call(
        body.pos,
        ast.Access(
          body.pos,
          ast.Func(
            body.pos,
            null,
            (scope.hasGlobal
              ? [ast.Ident(body.pos, "GLOBAL")]
              : []).concat(scope.options.undefinedName != null
              ? [ast.Ident(body.pos, scope.options.undefinedName, true)]
              : []),
            scope.getVariables(),
            ast.Block(body.pos, __toArray(init).concat([uncommentedBody])),
            ["use strict"]
          ),
          "call"
        ),
        [ast.This(body.pos)].concat(scope.hasGlobal ? [globalNode] : [])
      );
      if (scope.options["return"]) {
        callFunc = ast.Return(body.pos, callFunc);
      }
      return ast.Root(
        body.pos,
        ast.Block(body.pos, __toArray(comments).concat(__toArray(bareInit), [callFunc])),
        [],
        []
      );
    }
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
      result = translateRoot(node, scope);
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
      ident = ast.Ident(
        makePos(0, 0),
        name
      );
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
