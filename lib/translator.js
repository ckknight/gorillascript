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
        ident = this.reserveIdent(item.line, item.column, "ref", type);
        result = func(
          ast.Assign(item.line, item.column, ident, item),
          ident,
          true
        );
        this.releaseIdent(ident);
        return result;
      }
    };
    _Scope_prototype.reserveIdent = function (line, column, namePart, type) {
      var _this;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
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
            ident = ast.Ident(line, column, name);
            _this.addVariable(ident, type);
            return ident;
          }
        }
      }());
    };
    _Scope_prototype.reserveParam = function (line, column) {
      var _this;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
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
            return ast.Ident(line, column, name);
          }
        }
      }());
    };
    _Scope_prototype.getTmp = function (line, column, id, name, type) {
      var tmp, tmps;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
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
      return tmps[id] = this.reserveIdent(line, column, name || "tmp", type);
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
    return x.mutateLast(function (n) {
      return ast.Return(n.line, n.column, n);
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
    function GeneratorBuilder(line, column, scope, states, currentState, stateIdent, pendingFinalliesIdent, finallies, catches, currentCatch) {
      var _this;
      _this = this instanceof GeneratorBuilder ? this : __create(_GeneratorBuilder_prototype);
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      _this.line = line;
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      _this.column = column;
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
              return ast.Throw(line, column, ast.Ident(line, column, "StopIteration"));
            }
          ],
          []
        ];
      _this.stateIdent = stateIdent != null ? stateIdent : scope.reserveIdent(line, column, "state", Type.number);
      _this.pendingFinalliesIdent = pendingFinalliesIdent != null ? pendingFinalliesIdent : scope.reserveIdent(line, column, "finallies", Type["undefined"]["function"]().array());
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
    _GeneratorBuilder_prototype["yield"] = function (line, column, tNode) {
      var _this, branch;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      branch = this.branch();
      this.states[this.currentState].push(
        function () {
          return ast.Assign(line, column, _this.stateIdent, branch.state);
        },
        function () {
          return ast.Return(line, column, tNode());
        }
      );
      return branch.builder;
    };
    _GeneratorBuilder_prototype.goto = function (line, column, tState) {
      var _this;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      this.states[this.currentState].push(
        function () {
          return ast.Assign(line, column, _this.stateIdent, tState());
        },
        function () {
          return ast.Break(line, column);
        }
      );
    };
    _GeneratorBuilder_prototype.pendingFinally = function (line, column, tFinallyBody) {
      var _this, ident;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      ident = this.scope.reserveIdent(line, column, "finally", Type["undefined"]["function"]());
      this.scope.removeVariable(ident);
      this.finallies.push(function () {
        return ast.Func(
          line,
          column,
          ident,
          [],
          [],
          tFinallyBody()
        );
      });
      this.states[this.currentState].push(function () {
        return ast.Call(
          line,
          column,
          ast.Access(line, column, _this.pendingFinalliesIdent, "push"),
          [ident]
        );
      });
      return this;
    };
    _GeneratorBuilder_prototype.runPendingFinally = function (line, column) {
      var _this;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      this.states[this.currentState].push(function () {
        return ast.Call(
          line,
          column,
          ast.Access(
            line,
            column,
            ast.Call(line, column, ast.Access(line, column, _this.pendingFinalliesIdent, "pop")),
            "call"
          ),
          [ast.This(line, column)]
        );
      });
      return this;
    };
    _GeneratorBuilder_prototype.noop = function (line, column) {
      var _this, branch;
      _this = this;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      if (this.states[this.currentState].length) {
        branch = this.branch();
        this.states[this.currentState].push(function () {
          return ast.Assign(line, column, _this.stateIdent, branch.state);
        });
        return branch.builder;
      } else {
        return this;
      }
    };
    _GeneratorBuilder_prototype.enterTryCatch = function (line, column) {
      var fresh;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      fresh = this.noop(line, column);
      fresh.currentCatch = __toArray(fresh.currentCatch).concat([[fresh.currentState]]);
      return fresh;
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (line, column, tIdent, tPostState) {
      var catchStates, fresh;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      if (this.currentCatch.length === 0) {
        throw Error("Unable to exit-try-catch without first using enter-try-catch");
      }
      this.goto(line, column, tPostState);
      fresh = this.noop(line, column);
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
          this.line,
          this.column,
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
        return ast.Assign(_this.line, _this.column, _this.stateIdent, 0);
      });
      body = [ast.Assign(this.line, this.column, this.stateIdent, 1)];
      close = this.scope.reserveIdent(this.line, this.column, "close", Type["undefined"]["function"]());
      this.scope.removeVariable(close);
      if (this.finallies.length === 0) {
        this.scope.removeVariable(this.pendingFinalliesIdent);
        body.push(ast.Func(
          this.line,
          this.column,
          close,
          [],
          [],
          ast.Block(this.line, this.column, [ast.Assign(this.line, this.column, this.stateIdent, 0)])
        ));
      } else {
        body.push(ast.Assign(this.line, this.column, this.pendingFinalliesIdent, ast.Arr(this.line, this.column)));
        body.push.apply(body, (function () {
          var _arr, _arr2, _i, _len, f;
          for (_arr = [], _arr2 = __toArray(_this.finallies), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            f = _arr2[_i];
            _arr.push(f());
          }
          return _arr;
        }()));
        innerScope = this.scope.clone(false);
        f = innerScope.reserveIdent(this.line, this.column, "f", Type["undefined"]["function"]().union(Type["undefined"]));
        body.push(ast.Func(
          this.line,
          this.column,
          close,
          [],
          innerScope.getVariables(),
          ast.Block(this.line, this.column, [
            ast.Assign(this.line, this.column, this.stateIdent, 0),
            ast.Assign(this.line, this.column, f, ast.Call(this.line, this.column, ast.Access(this.line, this.column, this.pendingFinalliesIdent, "pop"))),
            ast.If(this.line, this.column, f, ast.TryFinally(
              this.line,
              this.column,
              ast.Call(this.line, this.column, f),
              ast.Call(this.line, this.column, close)
            ))
          ])
        ));
      }
      scope = this.scope;
      err = scope.reserveIdent(this.line, this.column, "e", Type.any);
      catches = this.catches;
      stateIdent = this.stateIdent;
      body.push(ast.Return(this.line, this.column, ast.Obj(this.line, this.column, [
        ast.Obj.Pair(this.line, this.column, "close", close),
        ast.Obj.Pair(this.line, this.column, "iterator", ast.Func(
          this.line,
          this.column,
          null,
          [],
          [],
          ast.Return(this.line, this.column, ast.This(this.line, this.column))
        )),
        ast.Obj.Pair(this.line, this.column, "next", ast.Func(
          this.line,
          this.column,
          null,
          [],
          [],
          ast.While(this.line, this.column, true, ast.TryCatch(
            this.line,
            this.column,
            ast.Switch(
              this.line,
              this.column,
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
                  _arr.push(ast.Switch.Case(items[0].line, items[0].column, i, ast.Block(_this.line, _this.column, __toArray(items).concat([ast.Break(items[items.length - 1].line, items[items.length - 1].column)]))));
                }
                return _arr;
              }()),
              ast.Throw(this.line, this.column, ast.Call(
                this.line,
                this.column,
                ast.Ident(this.line, this.column, "Error"),
                [
                  ast.Binary(
                    this.line,
                    this.column,
                    "Unknown state: ",
                    "+",
                    stateIdent
                  )
                ]
              ))
            ),
            err,
            (function () {
              var _arr, _f, _i, current;
              current = ast.Block(_this.line, _this.column, [
                ast.Call(_this.line, _this.column, close),
                ast.Throw(_this.line, _this.column, err)
              ]);
              for (_arr = __toArray(catches), _i = _arr.length, _f = function (catchInfo) {
                var _this, errIdent;
                _this = this;
                errIdent = catchInfo.tIdent();
                scope.addVariable(errIdent);
                return current = ast.If(
                  this.line,
                  this.column,
                  ast.Or.apply(ast, [this.line, this.column].concat((function () {
                    var _arr, _arr2, _i, _len, state;
                    for (_arr = [], _arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                      state = _arr2[_i];
                      _arr.push(ast.Binary(
                        _this.line,
                        _this.column,
                        stateIdent,
                        "===",
                        state
                      ));
                    }
                    return _arr;
                  }()))),
                  ast.Block(this.line, this.column, [
                    ast.Assign(this.line, this.column, errIdent, err),
                    ast.Assign(this.line, this.column, stateIdent, catchInfo.catchState)
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
      return ast.Block(this.line, this.column, body);
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
        builder.goto(node.line, node.column, breakState);
        return builder;
      },
      Continue: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: continue with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop");
        }
        builder.goto(node.line, node.column, continueState);
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
        builder.goto(node.line, node.column, function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(node.step.line, node.step.column, function () {
          return testBranch.state;
        });
        testBranch.builder.goto(node.test.line, node.test.column, function () {
          return ast.IfExpression(
            node.test.line,
            node.test.column,
            tTest(),
            bodyBranch.state,
            postBranch.state
          );
        });
        bodyBranch.builder.goto(node.body.line, node.body.column, function () {
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
        keys = scope.reserveIdent(node.line, node.column, "keys", Type.string.array());
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
        index = scope.reserveIdent(node.line, node.column, "i", Type.number);
        length = scope.reserveIdent(node.line, node.column, "len", Type.number);
        builder.add(function () {
          return ast.Block(node.line, node.column, [
            ast.Assign(node.line, node.column, keys, ast.Arr(node.line, node.column)),
            ast.ForIn(
              node.line,
              node.column,
              getKey(),
              tObject(),
              ast.Call(
                node.line,
                node.column,
                ast.Access(node.line, node.column, keys, "push"),
                [getKey()]
              )
            ),
            ast.Assign(node.line, node.column, index, 0),
            ast.Assign(node.line, node.column, length, ast.Access(node.line, node.column, keys, "length"))
          ]);
        });
        stepBranch = builder.branch();
        stepBranch.builder.add(function () {
          return ast.Unary(node.line, node.column, "++", index);
        });
        testBranch = builder.branch();
        bodyBranch = builder.branch();
        bodyBranch.builder.add(function () {
          return ast.Assign(node.line, node.column, getKey(), ast.Access(node.line, node.column, keys, index));
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
        builder.goto(node.line, node.column, function () {
          return testBranch.state;
        });
        stepBranch.builder.goto(node.line, node.column, function () {
          return testBranch.state;
        });
        testBranch.builder.goto(node.line, node.column, function () {
          return ast.IfExpression(
            node.line,
            node.column,
            ast.Binary(
              node.line,
              node.column,
              index,
              "<",
              length
            ),
            bodyBranch.state,
            postBranch.state
          );
        });
        bodyBranch.builder.goto(node.body.line, node.body.column, function () {
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
        builder.goto(node.line, node.column, function () {
          return ast.IfExpression(
            node.test.line,
            node.test.column,
            tTest(),
            whenTrueBranch.state,
            whenFalseBranch != null ? whenFalseBranch.state : postBranch.state
          );
        });
        gWhenTrue.goto(node.whenTrue.line, node.whenTrue.column, function () {
          return postBranch.state;
        });
        if (whenFalse != null) {
          gWhenFalse.goto(node.whenFalse.line, node.whenFalse.column, function () {
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
        builder = builder.enterTryCatch(node.line, node.column);
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        builder = builder.exitTryCatch(
          node.tryBody.line,
          node.tryBody.column,
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
        builder.goto(node.line, node.column, function () {
          return postBranch.state;
        });
        return postBranch.builder;
      },
      TryFinally: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
        builder = builder.pendingFinally(node.line, node.column, translate(node.finallyBody, scope, "topStatement"));
        builder = generatorTranslate(
          node.tryBody,
          scope,
          builder,
          breakState,
          continueState
        );
        return builder.runPendingFinally(node.line, node.column);
      },
      Yield: function (node, scope, builder) {
        return builder["yield"](node.line, node.column, translate(node.node, scope, "expression"));
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
  function arrayTranslate(line, column, elements, scope, replaceWithSlice, allowArrayLike, unassigned) {
    var _arr, _f, _i, _len, current, element, i, translatedItems;
    if (typeof line !== "number") {
      throw TypeError("Expected line to be a Number, got " + __typeof(line));
    }
    if (typeof column !== "number") {
      throw TypeError("Expected column to be a Number, got " + __typeof(column));
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
        return ast.Arr(line, column, (function () {
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
              return ast.Arr(items[0].line, items[0].column, items);
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
                node.line,
                node.column,
                ast.Ident(node.line, node.column, "__toArray"),
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
              line,
              column,
              ast.Access(
                line,
                column,
                ast.Ident(line, column, "__slice"),
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
            line,
            column,
            ast.Access(line, column, head, "concat"),
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
        return autoReturn(ast.Access(node.line, node.column, tParent(), tChild()));
      };
    },
    Args: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Arguments(node.line, node.column));
      };
    },
    Array: function (node, scope, location, autoReturn, unassigned) {
      var tArr;
      tArr = arrayTranslate(
        node.line,
        node.column,
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
              return ast.Noop(node.line, node.column);
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
              left.line,
              left.column,
              left,
              right.params,
              right.variables,
              right.body,
              right.declarations
            );
            if (autoReturn !== identity) {
              return ast.Block(node.line, node.column, [func, autoReturn(left)]);
            } else {
              return func;
            }
          } else {
            return autoReturn(ast.Binary(
              node.line,
              node.column,
              left,
              op,
              right
            ));
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
        return autoReturn(ast.Binary(
          node.line,
          node.column,
          tLeft(),
          node.op,
          tRight()
        ));
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
          node.line,
          node.column,
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
        return ast.Break(node.line, node.column, typeof tLabel === "function" ? tLabel() : void 0);
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
            return ast.Const(node.line, node.column, void 0);
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
          node.line,
          node.column,
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
              node.line,
              node.column,
              ast.Access(node.line, node.column, func, "call"),
              [start].concat(__toArray(argArray.elements))
            ));
          } else {
            return autoReturn(ast.Call(
              node.line,
              node.column,
              ast.Access(node.line, node.column, func, "apply"),
              [start, argArray]
            ));
          }
        };
      } else {
        tArgArray = arrayTranslate(
          node.line,
          node.column,
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
                node.line,
                node.column,
                ast.Access(node.line, node.column, func, "apply"),
                [
                  ast.Access(node.line, node.column, setArray, 0),
                  ast.Call(
                    node.line,
                    node.column,
                    ast.Access(
                      node.line,
                      node.column,
                      ast.Ident(node.line, node.column, "__slice"),
                      "call"
                    ),
                    [
                      array,
                      ast.Const(node.line, node.column, 1)
                    ]
                  )
                ]
              ));
            });
          } else if (argArray instanceof ast.Arr) {
            return autoReturn(ast.Call(
              node.line,
              node.column,
              func,
              argArray.elements,
              isNew
            ));
          } else if (isNew) {
            scope.addHelper("__new");
            return autoReturn(ast.Call(
              node.line,
              node.column,
              ast.Ident(node.line, node.column, "__new"),
              [func, argArray]
            ));
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, Type["function"], function (setParent, parent) {
              return autoReturn(ast.Call(
                node.line,
                node.column,
                ast.Access(
                  node.line,
                  node.column,
                  setParent,
                  func.right,
                  "apply"
                ),
                [parent, argArray]
              ));
            });
          } else {
            return autoReturn(ast.Call(
              node.line,
              node.column,
              ast.Access(node.line, node.column, func, "apply"),
              [
                ast.Const(node.line, node.column, void 0),
                argArray
              ]
            ));
          }
        };
      }
    },
    Comment: function (node, scope, location, autoReturn) {
      return function () {
        return ast.Comment(node.line, node.column, node.text);
      };
    },
    Const: function (node, scope, location, autoReturn) {
      return function () {
        return autoReturn(ast.Const(node.line, node.column, node.value));
      };
    },
    Continue: function (node, scope) {
      var tLabel;
      tLabel = node.label && translate(node.label, scope, "label");
      return function () {
        return ast.Continue(node.line, node.column, typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    Debugger: function (node) {
      return function () {
        return ast.Debugger(node.line, node.column);
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
        return autoReturn(ast.Eval(node.line, node.column, tCode()));
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
          node.line,
          node.column,
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
          node.line,
          node.column,
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
            ident.line,
            ident.column,
            ast.Unary(ident.line, ident.column, "typeof", ident),
            "!==",
            primitiveTypes[type]
          );
        } else if (type === "Array") {
          scope.addHelper("__isArray");
          return ast.Unary(ident.line, ident.column, "!", ast.Call(
            ident.line,
            ident.column,
            ast.Ident(ident.line, ident.column, "__isArray"),
            [ident]
          ));
        } else if (type === "Object") {
          scope.addHelper("__isObject");
          return ast.Unary(ident.line, ident.column, "!", ast.Call(
            ident.line,
            ident.column,
            ast.Ident(ident.line, ident.column, "__isObject"),
            [ident]
          ));
        } else {
          return ast.Unary(ident.line, ident.column, "!", ast.Binary(
            ident.line,
            ident.column,
            ident,
            "instanceof",
            ast.Ident(ident.line, ident.column, type)
          ));
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
        Ident: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, result;
          access = ast.Access.apply(ast, [ident.line, ident.column, ident].concat(__toArray(accesses)));
          scope.addHelper("__typeof");
          result = ast.If(
            ident.line,
            ident.column,
            makeTypeCheckTest(access, node.name, scope),
            ast.Throw(ident.line, ident.column, ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "TypeError"),
              [
                ast.BinaryChain.apply(ast, [ident.line, ident.column, "+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                  " to be " + withArticle(node.name) + ", got ",
                  ast.Call(
                    ident.line,
                    ident.column,
                    ast.Ident(ident.line, ident.column, "__typeof"),
                    [access]
                  )
                ]))
              ]
            ))
          );
          if (!hasDefaultValue && node.name === "Boolean") {
            return {
              check: ast.If(
                ident.line,
                ident.column,
                ast.Binary(
                  ident.line,
                  ident.column,
                  ident,
                  "==",
                  ast.Const(ident.line, ident.column, null)
                ),
                ast.Assign(ident.line, ident.column, ident, ast.Const(ident.line, ident.column, false)),
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
          access = ast.Access.apply(ast, [ident.line, ident.column, ident].concat(__toArray(accesses)));
          scope.addHelper("__typeof");
          type = translate(node, scope, "expression")();
          return {
            check: ast.If(
              ident.line,
              ident.column,
              ast.Unary(ident.line, ident.column, "!", ast.Binary(
                ident.line,
                ident.column,
                access,
                "instanceof",
                type
              )),
              ast.Throw(ident.line, ident.column, ast.Call(
                ident.line,
                ident.column,
                ast.Ident(ident.line, ident.column, "TypeError"),
                [
                  ast.BinaryChain.apply(ast, [ident.line, ident.column, "+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                    " to be " + withArticle(type.right.value) + ", got ",
                    ast.Call(
                      ident.line,
                      ident.column,
                      ast.Ident(ident.line, ident.column, "__typeof"),
                      [access]
                    )
                  ]))
                ]
              ))
            ),
            type: Type.any
          };
        },
        TypeUnion: function (ident, node, scope, hasDefaultValue, accesses) {
          var _arr, _i, _len, access, check, hasBoolean, hasNull, hasVoid, names, result, tests, type, types;
          access = ast.Access.apply(ast, [ident.line, ident.column, ident].concat(__toArray(accesses)));
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
            tests.unshift(ast.Binary(
              ident.line,
              ident.column,
              access,
              "!=",
              null
            ));
          }
          result = ast.If(
            ident.line,
            ident.column,
            ast.And.apply(ast, [ident.line, ident.column].concat(__toArray(tests))),
            ast.Throw(ident.line, ident.column, ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "TypeError"),
              [
                ast.BinaryChain.apply(ast, [ident.line, ident.column, "+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                  " to be " + withArticle(names.join(" or ")) + ", got ",
                  ast.Call(
                    ident.line,
                    ident.column,
                    ast.Ident(ident.line, ident.column, "__typeof"),
                    [access]
                  )
                ]))
              ]
            ))
          );
          if (!hasDefaultValue) {
            if (hasNull || hasVoid) {
              if (__xor(hasNull, hasVoid)) {
                result = ast.If(
                  ident.line,
                  ident.column,
                  ast.Binary(
                    ident.line,
                    ident.column,
                    access,
                    "==",
                    ast.Const(ident.line, ident.column, null)
                  ),
                  ast.Assign(ident.line, ident.column, access, ast.Const(ident.line, ident.column, hasNull ? null : void 0)),
                  result
                );
              }
            } else if (hasBoolean) {
              result = ast.If(
                ident.line,
                ident.column,
                ast.Binary(
                  ident.line,
                  ident.column,
                  access,
                  "==",
                  ast.Const(ident.line, ident.column, null)
                ),
                ast.Assign(ident.line, ident.column, access, ast.Const(ident.line, ident.column, false)),
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
          access = ast.Access.apply(ast, [ident.line, ident.column, ident].concat(__toArray(accesses)));
          scope.addHelper("__isArray");
          index = scope.reserveIdent(ident.line, ident.column, "i", Type.number);
          length = scope.reserveIdent(ident.line, ident.column, "len", Type.number);
          subCheck = translateTypeCheck(
            ident,
            node.subtype,
            scope,
            false,
            __toArray(accesses).concat([index])
          );
          result = ast.If(
            ident.line,
            ident.column,
            ast.Unary(ident.line, ident.column, "!", ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "__isArray"),
              [access]
            )),
            ast.Throw(ident.line, ident.column, ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "TypeError"),
              [
                ast.BinaryChain.apply(ast, [ident.line, ident.column, "+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                  " to be an Array, got ",
                  ast.Call(
                    ident.line,
                    ident.column,
                    ast.Ident(ident.line, ident.column, "__typeof"),
                    [access]
                  )
                ]))
              ]
            )),
            ast.For(
              ident.line,
              ident.column,
              ast.Block(ident.line, ident.column, [
                ast.Assign(ident.line, ident.column, index, ast.Const(ident.line, ident.column, 0)),
                ast.Assign(ident.line, ident.column, length, ast.Access(ident.line, ident.column, access, "length"))
              ]),
              ast.Binary(
                ident.line,
                ident.column,
                index,
                "<",
                length
              ),
              ast.Unary(ident.line, ident.column, "++", index),
              subCheck.check
            )
          );
          scope.releaseIdent(index);
          scope.releaseIdent(length);
          return { check: result, type: subCheck.type.array() };
        },
        TypeObject: function (ident, node, scope, hasDefaultValue, accesses) {
          var access, result, typeData;
          access = ast.Access.apply(ast, [ident.line, ident.column, ident].concat(__toArray(accesses)));
          scope.addHelper("__isObject");
          typeData = {};
          result = ast.If(
            ident.line,
            ident.column,
            ast.Unary(ident.line, ident.column, "!", ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "__isObject"),
              [access]
            )),
            ast.Throw(ident.line, ident.column, ast.Call(
              ident.line,
              ident.column,
              ast.Ident(ident.line, ident.column, "TypeError"),
              [
                ast.BinaryChain.apply(ast, [ident.line, ident.column, "+", "Expected " + __strnum(ident.name)].concat(__toArray(buildAccessStringNode(accesses)), [
                  " to be an Object, got ",
                  ast.Call(
                    ident.line,
                    ident.column,
                    ast.Ident(ident.line, ident.column, "__typeof"),
                    [access]
                  )
                ]))
              ]
            )),
            (function () {
              var _arr, _i, _len, _ref, check, current, key, type, value;
              current = ast.Noop(ident.line, ident.column);
              for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                key = (_ref = _arr[_i]).key;
                value = _ref.value;
                if (key instanceof ParserNode.Const) {
                  check = (_ref = translateTypeCheck(
                    ident,
                    value,
                    scope,
                    false,
                    __toArray(accesses).concat([ast.Const(key.line, key.column, key.value)])
                  )).check;
                  type = _ref.type;
                  typeData[key.value] = type;
                  current = ast.Block(ident.line, ident.column, [current, check]);
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
            tmp = ast.Ident(ident.line, ident.column, ident.right.value);
            laterInit.push(ast.Binary(
              ident.line,
              ident.column,
              ident,
              "=",
              tmp
            ));
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
              ident.line,
              ident.column,
              ast.Binary(
                ident.line,
                ident.column,
                ident,
                "==",
                ast.Const(ident.line, ident.column, null)
              ),
              ast.Assign(ident.line, ident.column, ident, translate(param.defaultValue, scope, "expression")()),
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
            arrayIdent = scope.reserveIdent(array.line, array.column, "p", Type.array);
          } else {
            arrayIdent = scope.reserveParam(array.line, array.column);
          }
          init = [];
          foundSpread = -1;
          for (_arr = __toArray(array.elements), i = 0, len = _arr.length; i < len; ++i) {
            p = _arr[i];
            param = translateParam(p, scope, true);
            if (!param.spread) {
              if (param.ident != null) {
                if (foundSpread === -1) {
                  init.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.Access(param.ident.line, param.ident.column, arrayIdent, i)));
                } else {
                  diff = i - foundSpread - 1;
                  init.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.Access(param.ident.line, param.ident.column, arrayIdent, diff === 0 ? spreadCounter
                    : ast.Binary(
                      param.ident.line,
                      param.ident.column,
                      spreadCounter,
                      "+",
                      diff
                    ))));
                }
              }
            } else {
              if (foundSpread !== -1) {
                throw Error("Encountered multiple spread parameters");
              }
              foundSpread = i;
              scope.addHelper("__slice");
              if (i === len - 1) {
                init.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.Call(
                  param.ident.line,
                  param.ident.column,
                  ast.Access(
                    param.ident.line,
                    param.ident.column,
                    ast.Ident(param.ident.line, param.ident.column, "__slice"),
                    "call"
                  ),
                  [arrayIdent].concat(i === 0 ? []
                    : [ast.Const(param.ident.line, param.ident.column, i)])
                )));
              } else {
                spreadCounter = scope.reserveIdent(param.ident.line, param.ident.column, "i", Type.number);
                init.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.IfExpression(
                  param.ident.line,
                  param.ident.column,
                  ast.Binary(
                    param.ident.line,
                    param.ident.column,
                    i,
                    "<",
                    ast.Assign(param.ident.line, param.ident.column, spreadCounter, ast.Binary(
                      param.ident.line,
                      param.ident.column,
                      ast.Access(param.ident.line, param.ident.column, arrayIdent, "length"),
                      "-",
                      len - i - 1
                    ))
                  ),
                  ast.Call(
                    param.ident.line,
                    param.ident.column,
                    ast.Access(
                      param.ident.line,
                      param.ident.column,
                      ast.Ident(param.ident.line, param.ident.column, "__slice"),
                      "call"
                    ),
                    [
                      arrayIdent,
                      ast.Const(param.ident.line, param.ident.column, i),
                      spreadCounter
                    ]
                  ),
                  ast.BlockExpression(param.ident.line, param.ident.column, [
                    ast.Assign(param.ident.line, param.ident.column, spreadCounter, ast.Const(param.ident.line, param.ident.column, i)),
                    ast.Arr(param.ident.line, param.ident.column)
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
            objectIdent = scope.reserveIdent(object.line, object.column, "p", Type.object);
          } else {
            objectIdent = scope.reserveParam(object.line, object.column);
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
              init.push(ast.Assign(key.line, key.column, value.ident, ast.Access(key.line, key.column, objectIdent, key)));
              init.push.apply(init, __toArray(value.init));
            }
          }
          if (inner) {
            scope.releaseIdent(objectIdent);
          }
          return { init: init, ident: objectIdent, spread: false };
        },
        Nothing: function (node, scope, inner) {
          return {
            init: [],
            ident: inner ? null : scope.reserveParam(node.line, node.column),
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
                initializers.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.Access(
                  param.ident.line,
                  param.ident.column,
                  ast.Arguments(param.ident.line, param.ident.column),
                  diff === 0 ? spreadCounter
                    : ast.Binary(
                      param.ident.line,
                      param.ident.column,
                      spreadCounter,
                      "+",
                      diff
                    )
                )));
              }
            } else {
              if (foundSpread !== -1) {
                throw Error("Encountered multiple spread parameters");
              }
              foundSpread = i;
              innerScope.addHelper("__slice");
              innerScope.addVariable(param.ident, Type.array, param.isMutable);
              if (i === len - 1) {
                initializers.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.Call(
                  param.ident.line,
                  param.ident.column,
                  ast.Access(
                    param.ident.line,
                    param.ident.column,
                    ast.Ident(param.ident.line, param.ident.column, "__slice"),
                    "call"
                  ),
                  [ast.Arguments(param.ident.line, param.ident.column)].concat(i === 0 ? []
                    : [ast.Const(param.ident.line, param.ident.column, i)])
                )));
              } else {
                spreadCounter = innerScope.reserveIdent(param.ident.line, param.ident.column, "ref", Type.number);
                initializers.push(ast.Assign(param.ident.line, param.ident.column, param.ident, ast.IfExpression(
                  param.ident.line,
                  param.ident.column,
                  ast.Binary(
                    param.ident.line,
                    param.ident.column,
                    i,
                    "<",
                    ast.Assign(param.ident.line, param.ident.column, spreadCounter, ast.Binary(
                      param.ident.line,
                      param.ident.column,
                      ast.Access(
                        param.ident.line,
                        param.ident.column,
                        ast.Arguments(param.ident.line, param.ident.column),
                        "length"
                      ),
                      "-",
                      len - i - 1
                    ))
                  ),
                  ast.Call(
                    param.ident.line,
                    param.ident.column,
                    ast.Access(
                      param.ident.line,
                      param.ident.column,
                      ast.Ident(param.ident.line, param.ident.column, "__slice"),
                      "call"
                    ),
                    [
                      ast.Arguments(param.ident.line, param.ident.column),
                      ast.Const(param.ident.line, param.ident.column, i),
                      spreadCounter
                    ]
                  ),
                  ast.BlockExpression(param.ident.line, param.ident.column, [
                    ast.Assign(param.ident.line, param.ident.column, spreadCounter, ast.Const(param.ident.line, param.ident.column, i)),
                    ast.Arr(param.ident.line, param.ident.column)
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
            body = generatorTranslate(node.body, innerScope, GeneratorBuilder(node.line, node.column, innerScope)).create();
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
          body = ast.Block(node.body.line, node.body.column, __toArray(initializers).concat([body]));
          if (innerScope.usedThis || node.bound instanceof ParserNode) {
            if (node.bound instanceof ParserNode) {
              fakeThis = ast.Ident(node.body.line, node.body.column, "_this");
              innerScope.addVariable(fakeThis);
              body = ast.Block(node.body.line, node.body.column, [
                ast.Assign(node.body.line, node.body.column, fakeThis, translate(
                  node.bound,
                  scope,
                  "expression",
                  null,
                  unassigned
                )()),
                body,
                ast.Return(node.body.line, node.body.column, fakeThis)
              ]);
            } else {
              if (innerScope.bound) {
                scope.usedThis = true;
              }
              if (innerScope.hasBound && !innerScope.bound) {
                fakeThis = ast.Ident(node.body.line, node.body.column, "_this");
                innerScope.addVariable(fakeThis);
                body = ast.Block(node.body.line, node.body.column, [
                  ast.Assign(node.body.line, node.body.column, fakeThis, ast.This(node.body.line, node.body.column)),
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
            node.line,
            node.column,
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
      if (name === "GLOBAL") {
        scope.hasGlobal = true;
      }
      return function () {
        return autoReturn(ast.Ident(node.line, node.column, name));
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
          node.line,
          node.column,
          tTest(),
          tWhenTrue(),
          typeof tWhenFalse === "function" ? tWhenFalse() : void 0,
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Nothing: function (node) {
      return function () {
        return ast.Noop(node.line, node.column);
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
            node.line,
            node.column,
            ast.Ident(node.line, node.column, "__create"),
            [prototype]
          );
        } else {
          obj = ast.Obj(node.line, node.column, (function () {
            var _arr, _i, _len, _ref, key, value;
            for (_arr = [], _i = 0, _len = constPairs.length; _i < _len; ++_i) {
              key = (_ref = constPairs[_i]).key;
              value = _ref.value;
              _arr.push(ast.Obj.Pair(key.line, key.column, String(key.value), value));
            }
            return _arr;
          }()));
        }
        if (postConstPairs.length === 0) {
          return autoReturn(obj);
        } else {
          ident = scope.reserveIdent(node.line, node.column, "o", Type.object);
          result = ast.BlockExpression(node.line, node.column, [ast.Assign(node.line, node.column, ident, obj)].concat(
            (function () {
              var _arr, _f, _i, _len;
              for (_arr = [], _i = 0, _len = postConstPairs.length, _f = function (pair) {
                var key, property;
                key = pair.key;
                property = pair.property;
                if (property) {
                  scope.addHelper("__defProp");
                  return ast.Call(
                    pair.key.line,
                    pair.key.column,
                    ast.Ident(pair.key.line, pair.key.column, "__defProp"),
                    [
                      ident,
                      key,
                      property === "property" ? pair.value
                        : property === "getset"
                        ? ast.Obj(pair.get.line, pair.get.column, [
                          ast.Obj.Pair(pair.get.line, pair.get.column, "get", pair.get),
                          ast.Obj.Pair(pair.set.line, pair.set.column, "set", pair.set),
                          ast.Obj.Pair(pair.set.line, pair.set.column, "configurable", ast.Const(pair.set.line, pair.set.column, true)),
                          ast.Obj.Pair(pair.set.line, pair.set.column, "enumerable", ast.Const(pair.set.line, pair.set.column, true))
                        ])
                        : property === "setget"
                        ? ast.Obj(pair.set.line, pair.set.column, [
                          ast.Obj.Pair(pair.set.line, pair.set.column, "set", pair.set),
                          ast.Obj.Pair(pair.get.line, pair.get.column, "get", pair.get),
                          ast.Obj.Pair(pair.get.line, pair.get.column, "configurable", ast.Const(pair.get.line, pair.get.column, true)),
                          ast.Obj.Pair(pair.get.line, pair.get.column, "enumerable", ast.Const(pair.get.line, pair.get.column, true))
                        ])
                        : property === "get"
                        ? ast.Obj(pair.value.line, pair.value.column, [
                          ast.Obj.Pair(pair.value.line, pair.value.column, "get", pair.value),
                          ast.Obj.Pair(pair.value.line, pair.value.column, "configurable", ast.Const(pair.value.line, pair.value.column, true)),
                          ast.Obj.Pair(pair.value.line, pair.value.column, "enumerable", ast.Const(pair.value.line, pair.value.column, true))
                        ])
                        : property === "set"
                        ? ast.Obj(pair.value.line, pair.value.column, [
                          ast.Obj.Pair(pair.value.line, pair.value.column, "set", pair.value),
                          ast.Obj.Pair(pair.value.line, pair.value.column, "configurable", ast.Const(pair.value.line, pair.value.column, true)),
                          ast.Obj.Pair(pair.value.line, pair.value.column, "enumerable", ast.Const(pair.value.line, pair.value.column, true))
                        ])
                        : (function () {
                          throw Error("Unknown property type: " + String(property));
                        }())
                    ]
                  );
                } else {
                  return ast.Assign(
                    key.line,
                    key.column,
                    ast.Access(key.line, key.column, ident, key),
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
          return autoReturn(ast.Regex(node.line, node.column, String(source.constValue()), flags));
        } else {
          return autoReturn(ast.Call(
            node.line,
            node.column,
            ast.Ident(node.line, node.column, "RegExp"),
            [
              source,
              ast.Const(node.line, node.column, flags)
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
        return ast.Return(node.line, node.column, tValue());
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
          line: case_.node.line,
          column: case_.node.column,
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
          node.line,
          node.column,
          tNode(),
          (function () {
            var _arr, case_, caseBody, caseNode, i, len;
            for (_arr = [], i = 0, len = tCases.length; i < len; ++i) {
              case_ = tCases[i];
              caseNode = case_.tNode();
              caseBody = case_.tBody();
              if (!case_.fallthrough || i === len - 1 && defaultCase.isNoop()) {
                caseBody = ast.Block(case_.line, case_.column, [
                  autoReturn(caseBody),
                  ast.Break(caseBody.line, caseBody.column)
                ]);
              }
              _arr.push(ast.Switch.Case(case_.line, case_.column, caseNode, caseBody));
            }
            return _arr;
          }()),
          tDefaultCase != null ? autoReturn(tDefaultCase()) : ast.Noop(node.line, node.column),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    Super: function (node, scope, location, autoReturn) {
      throw Error("Cannot have a stray super call");
    },
    Tmp: function (node, scope, location, autoReturn) {
      var ident;
      ident = scope.getTmp(
        node.line,
        node.column,
        node.id,
        node.name,
        node.type()
      );
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
        return autoReturn(scope.bound ? ast.Ident(node.line, node.column, "_this") : ast.This(node.line, node.column));
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
        return ast.Throw(node.line, node.column, tNode());
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
          node.line,
          node.column,
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
        return ast.TryFinally(
          node.line,
          node.column,
          tTryBody(),
          tFinallyBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
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
        return autoReturn(ast.Unary(node.line, node.column, node.op, tSubnode()));
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
        return ast.Noop(node.line, node.column);
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
  function translateRoot(roots, scope) {
    var _arr, _arr2, _i, _len, _ref, bareInit, bodies, body, callFunc, comments, fakeThis, globalNode, helper, i, ident, init, innerScope, len, root, uncommentedBody, walker;
    if (!__isObject(roots)) {
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
    for (_arr = [], _arr2 = __toArray(roots), i = 0, len = _arr2.length; i < len; ++i) {
      root = _arr2[i];
      if (len > 1) {
        innerScope = scope.clone(true);
      } else {
        innerScope = scope;
      }
      _arr.push(translate(
        root.body,
        innerScope,
        "topStatement",
        scope.options["return"] || scope.options["eval"],
        []
      )());
    }
    bodies = _arr;
    if (roots.length === 1) {
      if (!(roots[0] instanceof ParserNode.Root)) {
        throw Error("Cannot translate non-Root object");
      }
      body = translate(
        roots[0].body,
        scope,
        "topStatement",
        scope.options["return"] || scope.options["eval"],
        []
      )();
    } else {
      body = ast.Block(0, 0, (function () {
        var _arr, _arr2, _i, _len, _ref, comments, innerScope, root, rootBody;
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
          _arr.push(ast.Block(root.line, root.column, __toArray(comments).concat([
            ast.Call(root.line, root.column, ast.Func(
              root.line,
              root.column,
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
      body.line,
      body.column,
      ast.Binary(
        body.line,
        body.column,
        ast.Unary(body.line, body.column, "typeof", ast.Ident(body.line, body.column, "window")),
        "!==",
        "undefined"
      ),
      ast.Ident(body.line, body.column, "window"),
      ast.If(
        body.line,
        body.column,
        ast.Binary(
          body.line,
          body.column,
          ast.Unary(body.line, body.column, "typeof", ast.Ident(body.line, body.column, "global")),
          "!==",
          "undefined"
        ),
        ast.Ident(body.line, body.column, "global"),
        ast.This(body.line, body.column)
      )
    );
    init = [];
    if (scope.hasBound && scope.usedThis) {
      fakeThis = ast.Ident(body.line, body.column, "_this");
      scope.addVariable(fakeThis);
      init.push(ast.Assign(body.line, body.column, fakeThis, ast.This(body.line, body.column)));
    }
    scope.fillHelperDependencies();
    for (_arr = __toArray(scope.getHelpers()), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      helper = _arr[_i];
      if (HELPERS.has(helper)) {
        ident = ast.Ident(body.line, body.column, helper);
        scope.addVariable(ident);
        init.push(ast.Assign(body.line, body.column, ident, HELPERS.get(helper)));
      }
    }
    bareInit = [];
    if (scope.hasStopIteration) {
      bareInit.push(ast.If(
        body.line,
        body.column,
        ast.Binary(
          body.line,
          body.column,
          ast.Unary(body.line, body.column, "typeof", ast.Ident(body.line, body.column, "StopIteration")),
          "===",
          "undefined"
        ),
        ast.Assign(
          body.line,
          body.column,
          ast.Ident(body.line, body.column, "StopIteration"),
          ast.If(
            body.line,
            body.column,
            ast.Binary(
              body.line,
              body.column,
              ast.Unary(body.line, body.column, "typeof", ast.Access(
                body.line,
                body.column,
                ast.Ident(body.line, body.column, "Object"),
                "freeze"
              )),
              "===",
              "function"
            ),
            ast.Call(
              body.line,
              body.column,
              ast.Access(
                body.line,
                body.column,
                ast.Ident(body.line, body.column, "Object"),
                "freeze"
              ),
              [ast.Obj(body.line, body.column)]
            ),
            ast.Obj(body.line, body.column)
          )
        )
      ));
    }
    function splitComments(body) {
      var comments;
      comments = [];
      while (true) {
        if (body instanceof ast.Comment) {
          comments.push(body);
          body = ast.Noop(body.line, body.column);
        } else if (body instanceof ast.Block && body.body[0] instanceof ast.Comment) {
          comments.push(body.body[0]);
          body = ast.Block(body.line, body.column, __slice.call(body.body, 1));
        } else {
          break;
        }
      }
      return { comments: comments, body: body };
    }
    if (scope.options["eval"]) {
      scope.hasGlobal = true;
      walker = function (node) {
        if (node instanceof ast.Func) {
          if (node.name != null) {
            return ast.Block(node.line, node.column, [
              node,
              ast.Assign(
                node.line,
                node.column,
                ast.Access(
                  node.line,
                  node.column,
                  ast.Ident(node.line, node.column, "GLOBAL"),
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
            node.line,
            node.column,
            ast.Access(
              node.line,
              node.column,
              ast.Ident(node.line, node.column, "GLOBAL"),
              node.left.name
            ),
            node.walk(walker)
          );
        }
      };
      body = body.walk(walker);
    }
    if (scope.options.bare) {
      if (scope.hasGlobal) {
        scope.addVariable(ast.Ident(body.line, body.column, "GLOBAL"));
        bareInit.unshift(ast.Assign(
          body.line,
          body.column,
          ast.Ident(body.line, body.column, "GLOBAL"),
          globalNode
        ));
      }
      if (scope.options.undefinedName != null) {
        scope.addVariable(scope.options.undefinedName);
      }
      comments = (_ref = splitComments(bodies[0])).comments;
      uncommentedBody = _ref.body;
      return ast.Root(
        body.line,
        body.column,
        ast.Block(body.line, body.column, __toArray(comments).concat(__toArray(bareInit), __toArray(init), [uncommentedBody])),
        scope.getVariables(),
        ["use strict"]
      );
    } else {
      comments = (_ref = splitComments(body)).comments;
      uncommentedBody = _ref.body;
      callFunc = ast.Call(
        body.line,
        body.column,
        ast.Access(
          body.line,
          body.column,
          ast.Func(
            body.line,
            body.column,
            null,
            (scope.hasGlobal
              ? [ast.Ident(body.line, body.column, "GLOBAL")]
              : []).concat(scope.options.undefinedName != null
              ? [ast.Ident(body.line, body.column, scope.options.undefinedName, true)]
              : []),
            scope.getVariables(),
            ast.Block(body.line, body.column, __toArray(init).concat([uncommentedBody])),
            ["use strict"]
          ),
          "call"
        ),
        [ast.This(body.line, body.column)].concat(scope.hasGlobal ? [globalNode] : [])
      );
      if (scope.options["return"]) {
        callFunc = ast.Return(body.line, body.column, callFunc);
      }
      return ast.Root(
        body.line,
        body.column,
        ast.Block(body.line, body.column, __toArray(comments).concat(__toArray(bareInit), [callFunc])),
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
      ident = ast.Ident(0, 0, name);
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
