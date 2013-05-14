(function () {
  "use strict";
  var __cmp, __create, __import, __isArray, __name, __num, __owns, __slice, __strnum, __toArray, __typeof, _ref, ast, AstNode, Cache, GeneratorBuilder, generatorTranslate, MacroHolder, ParserNode, Scope, translators, Type;
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
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __name = function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
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
  ParserNode = (_ref = require("./parser")).Node;
  MacroHolder = _ref.MacroHolder;
  Cache = require("./utils").Cache;
  function needsCaching(item) {
    return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
  }
  Scope = (function () {
    var _Scope_prototype, getId;
    function Scope(options, macros, bound, usedTmps, helperNames, variables, tmps) {
      var _this;
      _this = this instanceof Scope ? this : __create(_Scope_prototype);
      if (options == null) {
        options = {};
      }
      _this.options = options;
      if (!(macros instanceof MacroHolder)) {
        throw TypeError("Expected macros to be a " + __name(MacroHolder) + ", got " + __typeof(macros));
      }
      _this.macros = macros;
      if (bound == null) {
        bound = false;
      }
      _this.bound = bound;
      if (usedTmps == null) {
        usedTmps = {};
      }
      _this.usedTmps = usedTmps;
      if (helperNames == null) {
        helperNames = {};
      }
      _this.helperNames = helperNames;
      if (tmps == null) {
        tmps = {};
      }
      _this.tmps = tmps;
      _this.variables = variables ? __create(variables) : {};
      _this.hasBound = false;
      _this.usedThis = false;
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
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
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
    _Scope_prototype.maybeCacheAccess = function (item, func, parentName, childName, save) {
      var _this;
      _this = this;
      if (!(item instanceof ast.Expression)) {
        throw TypeError("Expected item to be an Expression, got " + __typeof(item));
      }
      if (parentName == null) {
        parentName = "ref";
      } else if (typeof parentName !== "string") {
        throw TypeError("Expected parentName to be a String, got " + __typeof(parentName));
      }
      if (childName == null) {
        childName = "ref";
      } else if (typeof childName !== "string") {
        throw TypeError("Expected childName to be a String, got " + __typeof(childName));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      if (item instanceof ast.Binary && item.op === ".") {
        return this.maybeCache(item.left, Type.any, function (setParent, parent, parentCached) {
          return _this.maybeCache(item.right, Type.any, function (setChild, child, childCached) {
            if (parentCached || childCached) {
              return func(
                ast.Access(item.pos, setParent, setChild),
                ast.Access(item.pos, parent, child),
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
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
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
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
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
      this.variables[ident.name].isParam = true;
    };
    _Scope_prototype.markAsFunction = function (ident) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      this.variables[ident.name].isFunction = true;
    };
    _Scope_prototype.addHelper = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      this.helperNames[name] = true;
    };
    _Scope_prototype.fillHelperDependencies = function () {
      var _arr, _else, _i, dep, helperNames, name, toAdd;
      helperNames = this.helperNames;
      toAdd = {};
      while (true) {
        for (name in helperNames) {
          if (__owns.call(helperNames, name) && this.macros.hasHelper(name)) {
            for (_arr = __toArray(this.macros.helperDependencies(name)), _i = _arr.length; _i--; ) {
              dep = _arr[_i];
              if (!__owns.call(helperNames, dep)) {
                toAdd[dep] = true;
              }
            }
          }
        }
        _else = true;
        for (name in toAdd) {
          if (__owns.call(toAdd, name)) {
            _else = false;
            this.addHelper(name);
          }
        }
        if (_else) {
          break;
        }
        helperNames = toAdd;
        toAdd = {};
      }
    };
    function lowerSorter(a, b) {
      return __cmp(a.toLowerCase(), b.toLowerCase());
    }
    _Scope_prototype.getHelpers = function () {
      var _arr, _obj, k, names;
      _arr = [];
      _obj = this.helperNames;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _arr.push(k);
        }
      }
      names = _arr;
      return names.sort(lowerSorter);
    };
    _Scope_prototype.hasHelper = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns.call(this.helperNames, name);
    };
    _Scope_prototype.addVariable = function (ident, type, isMutable) {
      if (!(ident instanceof ast.Ident)) {
        throw TypeError("Expected ident to be an Ident, got " + __typeof(ident));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
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
      var _arr, _obj, k, v, variables;
      _arr = [];
      _obj = this.variables;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          v = _obj[k];
          if (!v.isParam && !v.isFunction) {
            _arr.push(k);
          }
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
        this.macros,
        bound,
        __create(this.usedTmps),
        this.helperNames,
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
  GeneratorBuilder = (function () {
    var _GeneratorBuilder_prototype;
    function GeneratorBuilder(pos, scope, states, statesOrder, stateRedirects, stateIds, currentState, stopState, stateIdent, pendingFinalliesIdent, finallies, catches, currentCatch, hasGeneratorNode) {
      var _o, _this, sendScope;
      _this = this instanceof GeneratorBuilder ? this : __create(_GeneratorBuilder_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      _this.scope = scope;
      if (stateRedirects == null) {
        stateRedirects = {};
      }
      _this.stateRedirects = stateRedirects;
      if (stateIds == null) {
        stateIds = {};
      }
      _this.stateIds = stateIds;
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
      if (hasGeneratorNode == null) {
        hasGeneratorNode = makeHasGeneratorNode();
      }
      _this.hasGeneratorNode = hasGeneratorNode;
      scope.addHelper("StopIteration");
      if (states != null) {
        _this.states = states;
        _this.statesOrder = statesOrder;
        _this.currentState = currentState;
        _this.stopState = stopState;
      } else {
        _this.statesOrder = [uid(0), uid(1)];
        _this.states = (_o = {}, _o[_this.statesOrder[0]] = [
          function () {
            return ast.Throw(pos, ast.Ident(pos, "StopIteration"));
          }
        ], _o[_this.statesOrder[1]] = [], _o);
        _this.currentState = _this.statesOrder[1];
        _this.stopState = _this.statesOrder[0];
      }
      _this.stateIdent = stateIdent != null ? stateIdent : scope.reserveIdent(pos, "state", Type.number);
      _this.pendingFinalliesIdent = pendingFinalliesIdent != null ? pendingFinalliesIdent : scope.reserveIdent(pos, "finallies", Type["undefined"]["function"]().array());
      sendScope = scope.clone(false);
      _this.receivedIdent = sendScope.reserveIdent(pos, "received", Type.any);
      sendScope.markAsParam(_this.receivedIdent);
      return _this;
    }
    _GeneratorBuilder_prototype = GeneratorBuilder.prototype;
    GeneratorBuilder.displayName = "GeneratorBuilder";
    function uid(id) {
      return __strnum(id) + "-" + __strnum(Math.random().toString(36).slice(2)) + "-" + __strnum(new Date().getTime());
    }
    _GeneratorBuilder_prototype.clone = function (newState) {
      return GeneratorBuilder(
        this.pos,
        this.scope,
        this.states,
        this.statesOrder,
        this.stateRedirects,
        this.stateIds,
        newState,
        this.stopState,
        this.stateIdent,
        this.pendingFinalliesIdent,
        this.finallies,
        this.catches,
        this.currentCatch,
        this.hasGeneratorNode
      );
    };
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
    _GeneratorBuilder_prototype._redirectState = function (state) {
      var start;
      if (typeof state !== "string") {
        throw TypeError("Expected state to be a String, got " + __typeof(state));
      }
      start = state;
      while (__owns.call(this.stateRedirects, state)) {
        state = this.stateRedirects[state]();
      }
      return this.stateIds[state];
    };
    _GeneratorBuilder_prototype.makeGoto = function (pos, tState) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tState !== "function") {
        throw TypeError("Expected tState to be a Function, got " + __typeof(tState));
      }
      return function () {
        var state;
        state = tState();
        if (typeof state === "string") {
          state = ast.Const(pos, _this._redirectState(state));
        }
        return ast.Assign(pos, _this.stateIdent, state);
      };
    };
    _GeneratorBuilder_prototype["yield"] = function (pos, tNode) {
      var branch;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be a Function, got " + __typeof(tNode));
      }
      branch = this.branch();
      this.states[this.currentState].push(
        this.makeGoto(pos, function () {
          return branch.state;
        }),
        function () {
          return ast.Return(pos, tNode());
        }
      );
      return branch.builder;
    };
    _GeneratorBuilder_prototype.goto = function (pos, tState, dontRedirect) {
      var _this, current;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tState !== "function") {
        throw TypeError("Expected tState to be a Function, got " + __typeof(tState));
      }
      current = this.states[this.currentState];
      if (current.length === 0 && !dontRedirect) {
        this.stateRedirects[this.currentState] = tState;
      }
      current.push(
        this.makeGoto(pos, function () {
          var state;
          state = tState();
          if (typeof state === "string") {
            return _this._redirectState(state);
          } else {
            return state;
          }
        }),
        function () {
          return ast.Break(pos);
        }
      );
    };
    _GeneratorBuilder_prototype.gotoIf = function (pos, tTest, tWhenTrue, tWhenFalse) {
      var _this;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tTest !== "function") {
        throw TypeError("Expected tTest to be a Function, got " + __typeof(tTest));
      }
      if (typeof tWhenTrue !== "function") {
        throw TypeError("Expected tWhenTrue to be a Function, got " + __typeof(tWhenTrue));
      }
      if (typeof tWhenFalse !== "function") {
        throw TypeError("Expected tWhenFalse to be a Function, got " + __typeof(tWhenFalse));
      }
      this.goto(
        pos,
        function () {
          return ast.IfExpression(pos, tTest(), _this._redirectState(tWhenTrue()), _this._redirectState(tWhenFalse()));
        },
        true
      );
    };
    _GeneratorBuilder_prototype.pendingFinally = function (pos, tFinallyBody) {
      var _this, ident;
      _this = this;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tFinallyBody !== "function") {
        throw TypeError("Expected tFinallyBody to be a Function, got " + __typeof(tFinallyBody));
      }
      ident = this.scope.reserveIdent(pos, "finally", Type["undefined"]["function"]());
      this.scope.markAsFunction(ident);
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
      var branch;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (this.states[this.currentState].length) {
        branch = this.branch();
        this.goto(pos, function () {
          return branch.state;
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
      if (typeof tIdent !== "function") {
        throw TypeError("Expected tIdent to be a Function, got " + __typeof(tIdent));
      }
      if (typeof tPostState !== "function") {
        throw TypeError("Expected tPostState to be a Function, got " + __typeof(tPostState));
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
      state = uid(this.statesOrder.length);
      if (this.currentCatch.length) {
        (_ref = this.currentCatch)[__num(_ref.length) - 1].push(state);
      }
      this.statesOrder.push(state);
      this.states[state] = [];
      return { state: state, builder: this.clone(state) };
    };
    _GeneratorBuilder_prototype._calculateStateIds = function () {
      var _arr, _i, _len, id, state;
      id = -1;
      for (_arr = __toArray(this.statesOrder), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        state = _arr[_i];
        if (!__owns.call(this.stateRedirects, state)) {
          this.stateIds[state] = ++id;
        }
      }
    };
    _GeneratorBuilder_prototype.create = function () {
      var _this, body, catches, close, err, f, innerScope, send, stateIdent;
      _this = this;
      if (this.currentCatch.length) {
        throw Error("Cannot create a generator if there are stray catches");
      }
      this.goto(this.pos, function () {
        return _this.stopState;
      });
      this._calculateStateIds();
      body = [
        ast.Assign(this.pos, this.stateIdent, ast.Const(this.pos, this._redirectState(this.statesOrder[1])))
      ];
      close = this.scope.reserveIdent(this.pos, "close", Type["undefined"]["function"]());
      this.scope.markAsFunction(close);
      if (this.finallies.length === 0) {
        this.scope.removeVariable(this.pendingFinalliesIdent);
        body.push(ast.Func(
          this.pos,
          close,
          [],
          [],
          ast.Block(this.pos, [ast.Assign(this.pos, this.stateIdent, this._redirectState(this.stopState))])
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
            ast.Assign(this.pos, this.stateIdent, this._redirectState(this.stopState)),
            ast.Assign(this.pos, f, ast.Call(this.pos, ast.Access(this.pos, this.pendingFinalliesIdent, "pop"))),
            ast.If(this.pos, f, ast.TryFinally(
              this.pos,
              ast.Call(this.pos, f),
              ast.Call(this.pos, close)
            ))
          ])
        ));
      }
      err = this.scope.reserveIdent(this.pos, "e", Type.any);
      catches = this.catches;
      stateIdent = this.stateIdent;
      send = this.scope.reserveIdent(this.pos, "send", Type["function"]);
      body.push(ast.Func(
        this.pos,
        send,
        [this.receivedIdent],
        [],
        ast.While(this.pos, true, ast.TryCatch(
          this.pos,
          ast.Switch(
            this.pos,
            stateIdent,
            (function () {
              var _arr, _arr2, _arr3, _arr4, _i, _i2, _len, _len2, items, state, tItem;
              for (_arr = [], _arr2 = __toArray(_this.statesOrder), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                state = _arr2[_i];
                if (!__owns.call(_this.stateRedirects, state)) {
                  for (_arr3 = [], _arr4 = __toArray(_this.states[state]), _i2 = 0, _len2 = _arr4.length; _i2 < _len2; ++_i2) {
                    tItem = _arr4[_i2];
                    _arr3.push(tItem());
                  }
                  items = _arr3;
                  if (items.length === 0) {
                    throw Error("Found state with no jump in it");
                  }
                  _arr.push(ast.Switch.Case(
                    items[0].pos,
                    ast.Const(items[0].pos, _this.stateIds[state]),
                    ast.Block(items[0].pos, __toArray(items).concat([ast.Break(items[items.length - 1].pos)]))
                  ));
                }
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
              this.scope.addVariable(errIdent);
              return current = ast.If(
                this.pos,
                ast.Or.apply(ast, [this.pos].concat((function () {
                  var _arr, _arr2, _i, _len, state;
                  for (_arr = [], _arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                    state = _arr2[_i];
                    if (!__owns.call(_this.stateRedirects, state)) {
                      _arr.push(ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, _this.stateIds[state])));
                    }
                  }
                  return _arr;
                }()))),
                ast.Block(this.pos, [
                  ast.Assign(this.pos, errIdent, err),
                  ast.Assign(this.pos, stateIdent, ast.Const(this.pos, this.stateIds[catchInfo.catchState]))
                ]),
                current
              );
            }; _i--; ) {
              _f.call(_this, _arr[_i]);
            }
            return current;
          }())
        ))
      ));
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
          ast.Return(this.pos, ast.Call(this.pos, send, [ast.Const(this.pos, void 0)]))
        )),
        ast.Obj.Pair(this.pos, "send", send),
        ast.Obj.Pair(this.pos, "throw", ast.Func(
          this.pos,
          null,
          [ast.Ident(this.pos, "e")],
          [],
          ast.Throw(this.pos, ast.Ident(this.pos, "e"))
        ))
      ])));
      return ast.Block(this.pos, body);
    };
    function makeHasGeneratorNode() {
      var inLoopCache, inSwitchCache, normalCache;
      inLoopCache = Cache.generic(ParserNode, Boolean)();
      function hasInLoop(node) {
        var _once;
        return inLoopCache.getOrAdd(node, (_once = false, function () {
          var FOUND, result;
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          result = false;
          if (node instanceof ParserNode.Yield || node instanceof ParserNode.Return) {
            result = true;
          } else if (!(node instanceof ParserNode.Function)) {
            FOUND = {};
            try {
              node.walk(function (n) {
                if (hasInLoop(n)) {
                  throw FOUND;
                }
                return n;
              });
            } catch (e) {
              if (e === FOUND) {
                result = true;
              } else {
                throw e;
              }
            }
          }
          return result;
        }));
      }
      inSwitchCache = Cache.generic(ParserNode, Boolean)();
      function hasInSwitch(node) {
        var _once;
        return inSwitchCache.getOrAdd(node, (_once = false, function () {
          var _ref, FOUND;
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_ref = inLoopCache.get(node)) {
            return _ref;
          }
          if (node instanceof ParserNode.Yield || node instanceof ParserNode.Return || node instanceof ParserNode.Continue) {
            return true;
          } else if (!(node instanceof ParserNode.Function)) {
            FOUND = {};
            try {
              node.walk(function (n) {
                if (n instanceof ParserNode.For || n instanceof ParserNode.ForIn) {
                  if (hasInLoop(n)) {
                    throw FOUND;
                  }
                } else if (hasInSwitch(n)) {
                  throw FOUND;
                }
                return n;
              });
            } catch (e) {
              if (e === FOUND) {
                return true;
              } else {
                throw e;
              }
            }
            return false;
          }
        }));
      }
      normalCache = Cache.generic(ParserNode, Boolean)();
      function hasGeneratorNode(node) {
        var _once;
        if (!(node instanceof ParserNode)) {
          throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
        }
        return normalCache.getOrAdd(node, (_once = false, function () {
          var _ref, FOUND;
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_ref = inLoopCache.get(node)) {
            return _ref;
          }
          if (_ref = inSwitchCache.get(node)) {
            return _ref;
          }
          if (node instanceof ParserNode.Yield || node instanceof ParserNode.Return || node instanceof ParserNode.Continue || node instanceof ParserNode.Break) {
            return true;
          } else if (!(node instanceof ParserNode.Function)) {
            FOUND = {};
            try {
              node.walk(function (n) {
                if (n instanceof ParserNode.For || n instanceof ParserNode.ForIn) {
                  if (hasInLoop(n)) {
                    throw FOUND;
                  }
                } else if (n instanceof ParserNode.Switch) {
                  if (hasInSwitch(n)) {
                    throw FOUND;
                  }
                } else if (hasGeneratorNode(n)) {
                  throw FOUND;
                }
                return n;
              });
            } catch (e) {
              if (e === FOUND) {
                return true;
              } else {
                throw e;
              }
            }
            return false;
          }
        }));
      }
      return hasGeneratorNode;
    }
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
      throw TypeError("Expected file to be one of String or undefined, got " + __typeof(file));
    }
    pos = { line: line, column: column };
    if (file != null) {
      pos.file = file;
    }
    return pos;
  }
  function getPos(node) {
    if (!(node instanceof ParserNode)) {
      throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
    }
    return makePos(node.line, node.column, node.file);
  }
  function doNothing() {}
  generatorTranslate = (function () {
    var expressions, statements;
    function memoize(func) {
      var _ref, result;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (func.memoized) {
        return func;
      } else {
        (_ref = function () {
          if (func) {
            result = func();
            func = null;
          }
          return result;
        }).memoized = true;
        return _ref;
      }
    }
    function same(value) {
      var _ref;
      (_ref = function () {
        return value;
      }).memoized = true;
      return _ref;
    }
    function maybeMemoize(value) {
      if (typeof value === "function") {
        return memoize(value);
      } else {
        return same(value);
      }
    }
    function handleAssign(assignTo, scope, builder, tNode, cleanup) {
      var nodeNeedsCaching, tAssignTo, tTmp;
      if (!(builder instanceof GeneratorBuilder)) {
        throw TypeError("Expected builder to be a " + __name(GeneratorBuilder) + ", got " + __typeof(builder));
      }
      if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be a Function, got " + __typeof(tNode));
      }
      if (cleanup == null) {
        cleanup = doNothing;
      } else if (typeof cleanup !== "function") {
        throw TypeError("Expected cleanup to be a Function, got " + __typeof(cleanup));
      }
      if (typeof assignTo === "function") {
        tAssignTo = memoize(assignTo);
        return {
          builder: builder.add(function () {
            var node;
            node = tNode();
            return ast.Assign(node.pos, tAssignTo(), node);
          }),
          tNode: tAssignTo,
          cleanup: cleanup
        };
      } else if (assignTo) {
        tNode = memoize(tNode);
        tTmp = memoize(function () {
          return scope.reserveIdent(tNode().pos, "tmp", Type.any);
        });
        nodeNeedsCaching = memoize(function () {
          return tNode() === builder.receivedIdent || needsCaching(tNode());
        });
        return {
          builder: builder.add(function () {
            var node;
            if (nodeNeedsCaching()) {
              node = tNode();
              return ast.Assign(node.pos, tTmp(), node);
            } else {
              return tNode();
            }
          }),
          tNode: function () {
            if (nodeNeedsCaching()) {
              return tTmp();
            } else {
              return tNode();
            }
          },
          cleanup: function () {
            cleanup();
            if (nodeNeedsCaching()) {
              return scope.releaseIdent(tTmp());
            }
          }
        };
      } else {
        return { builder: builder, tNode: tNode, cleanup: cleanup };
      }
    }
    function makeTTmp(assignTo, scope, pos, name, type) {
      if (name == null) {
        name = "tmp";
      }
      if (type == null) {
        type = Type.any;
      }
      if (typeof assignTo === "function") {
        return memoize(assignTo);
      } else {
        return same(scope.reserveIdent(pos, name, type));
      }
    }
    function makeCleanup(assignTo, scope, tTmp) {
      if (typeof tTmp !== "function") {
        throw TypeError("Expected tTmp to be a Function, got " + __typeof(tTmp));
      }
      if (typeof assignTo === "function") {
        return function () {
          var tmp, value;
          value = assignTo();
          tmp = tTmp();
          if (value === tmp) {
            return scope.releaseIdent(tmp);
          }
        };
      } else {
        return function () {
          return scope.releaseIdent(tTmp());
        };
      }
    }
    function generatorArrayTranslate(pos, elements, scope, builder, assignTo) {
      var _arr, _f, _len, i, tArrayStart, tTmp;
      tTmp = makeTTmp(
        assignTo,
        scope,
        pos,
        "arr",
        Type.array
      );
      tArrayStart = null;
      for (_arr = __toArray(elements), i = 0, _len = _arr.length, _f = function (element, i) {
        var expr;
        if (tArrayStart || builder.hasGeneratorNode(element)) {
          if (tArrayStart == null) {
            tArrayStart = arrayTranslate(
              pos,
              __slice.call(elements, 0, i),
              scope,
              true,
              false
            );
            builder = builder.add(function () {
              return ast.Assign(pos, tTmp(), tArrayStart());
            });
          }
          if (element instanceof ParserNode.Spread) {
            expr = generatorTranslateExpression(element.node, scope, builder, false);
            builder = expr.builder;
            return builder.add(function () {
              var tmp;
              tmp = tTmp();
              scope.addHelper("__toArray");
              return ast.Call(
                getPos(element),
                ast.Access(
                  getPos(element),
                  tmp,
                  ast.Const(getPos(element), "push"),
                  ast.Const(getPos(element), "apply")
                ),
                [
                  tmp,
                  ast.Call(
                    getPos(element),
                    ast.Ident(getPos(element), "__toArray"),
                    [expr.tNode()]
                  )
                ]
              );
            });
          } else {
            expr = generatorTranslateExpression(element, scope, builder, false);
            builder = expr.builder;
            return builder.add(function () {
              return ast.Call(
                getPos(element),
                ast.Access(getPos(element), tTmp(), ast.Const(getPos(element), "push")),
                [expr.tNode()]
              );
            });
          }
        }
      }; i < _len; ++i) {
        _f.call(this, _arr[i], i);
      }
      if (tArrayStart == null) {
        return {
          builder: builder,
          tNode: arrayTranslate(
            pos,
            elements,
            scope,
            true,
            false
          ),
          cleanup: doNothing
        };
      } else {
        return {
          builder: builder,
          tNode: tTmp,
          cleanup: makeCleanup(assignTo, scope, tTmp)
        };
      }
    }
    expressions = {
      Access: function (node, scope, builder, assignTo) {
        var gChild, gParent;
        gParent = generatorTranslateExpression(node.parent, scope, builder, true);
        gChild = generatorTranslateExpression(node.child, scope, gParent.builder, false);
        return handleAssign(assignTo, scope, gChild.builder, function () {
          var _ref;
          _ref = ast.Access(getPos(node), gParent.tNode(), gChild.tNode());
          gParent.cleanup();
          gChild.cleanup();
          return _ref;
        });
      },
      Array: function (node, scope, builder, assignTo) {
        return generatorArrayTranslate(
          getPos(node),
          node.elements,
          scope,
          builder,
          assignTo
        );
      },
      Assign: function (node, scope, builder, assignTo) {
        var gChild, gLeft, gParent, gRight, left;
        left = node.left;
        if (left instanceof ParserNode.Access) {
          gParent = generatorTranslateExpression(left.parent, scope, builder, true);
          gChild = generatorTranslateExpression(left.child, scope, gParent.builder, true);
          gLeft = {
            builder: gChild.builder,
            tNode: function () {
              return ast.Access(getPos(left), gParent.tNode(), gChild.tNode());
            },
            cleanup: function () {
              gParent.cleanup();
              return gChild.cleanup();
            }
          };
        } else {
          gLeft = {
            builder: builder,
            tNode: translate(node.left, scope, "leftExpression"),
            cleanup: doNothing
          };
        }
        gRight = generatorTranslateExpression(node.right, scope, gLeft.builder, gLeft.tNode);
        return handleAssign(
          assignTo,
          scope,
          gRight.builder,
          gRight.tNode,
          function () {
            gLeft.cleanup();
            return gRight.cleanup();
          }
        );
      },
      Binary: (function () {
        var lazyOps;
        lazyOps = {
          "&&": function (node, scope, builder, assignTo) {
            var gLeft, gRight, postBranch, tNode, whenTrueBranch;
            gLeft = generatorTranslateExpression(node.left, scope, builder, assignTo || true);
            tNode = memoize(gLeft.tNode);
            gLeft.builder.gotoIf(
              getPos(node),
              tNode,
              function () {
                return whenTrueBranch.state;
              },
              function () {
                return postBranch.state;
              }
            );
            whenTrueBranch = gLeft.builder.branch();
            gRight = generatorTranslateExpression(node.right, scope, whenTrueBranch.builder, tNode);
            gRight.builder.goto(getPos(node), function () {
              return postBranch.state;
            });
            postBranch = gLeft.builder.branch();
            return {
              tNode: tNode,
              builder: postBranch.builder,
              cleanup: function () {
                gLeft.cleanup();
                return gRight.cleanup();
              }
            };
          },
          "||": function (node, scope, builder, assignTo) {
            var gLeft, gRight, postBranch, tNode, whenFalseBranch;
            gLeft = generatorTranslateExpression(node.left, scope, builder, assignTo || true);
            tNode = memoize(gLeft.tNode);
            gLeft.builder.gotoIf(
              getPos(node),
              tNode,
              function () {
                return postBranch.state;
              },
              function () {
                return whenFalseBranch.state;
              }
            );
            whenFalseBranch = gLeft.builder.branch();
            gRight = generatorTranslateExpression(node.right, scope, whenFalseBranch.builder, tNode);
            gRight.builder.goto(getPos(node), function () {
              return postBranch.state;
            });
            postBranch = gLeft.builder.branch();
            return {
              tNode: tNode,
              builder: postBranch.builder,
              cleanup: function () {
                gLeft.cleanup();
                return gRight.cleanup();
              }
            };
          }
        };
        return function (node, scope, builder, assignTo) {
          var gLeft, gRight;
          if (__owns.call(lazyOps, node.op)) {
            return lazyOps[node.op](node, scope, builder, assignTo);
          } else {
            gLeft = generatorTranslateExpression(node.left, scope, builder, true);
            gRight = generatorTranslateExpression(node.right, scope, gLeft.builder, false);
            return handleAssign(assignTo, scope, gRight.builder, function () {
              var _ref;
              return ast.Binary(
                getPos(node),
                gLeft.tNode(),
                (gLeft.cleanup(), node.op),
                (_ref = gRight.tNode(), gRight.cleanup(), _ref)
              );
            });
          }
        };
      }()),
      Block: function (node, scope, builder, assignTo) {
        var _arr, i, len, result, subnode;
        for (_arr = __toArray(node.nodes), i = 0, len = _arr.length; i < len; ++i) {
          subnode = _arr[i];
          result = generatorTranslateExpression(subnode, scope, builder, i === len - 1 && assignTo);
          builder = result.builder;
          if (i === len - 1) {
            return result;
          }
        }
        throw Error("Unreachable state");
      },
      Call: function (node, scope, builder, assignTo) {
        var args, gArgs, gFunc, gStart, isApply, isNew;
        gFunc = generatorTranslateExpression(node.func, scope, builder, true);
        isApply = node.isApply;
        isNew = node.isNew;
        args = node.args;
        if (isApply && (args.length === 0 || !(args[0] instanceof ParserNode.Spread))) {
          if (args.length === 0) {
            gStart = {
              builder: gFunc.builder,
              tNode: function () {
                return ast.Const(getPos(node), void 0);
              },
              cleanup: doNothing
            };
          } else {
            gStart = generatorTranslateExpression(args[0], scope, gFunc.builder, true);
          }
          gArgs = generatorArrayTranslate(
            getPos(node),
            __slice.call(args, 1),
            scope,
            gStart.builder
          );
          return handleAssign(assignTo, scope, gArgs.builder, function () {
            var args, func, start;
            func = gFunc.tNode();
            start = gStart.tNode();
            args = gArgs.tNode();
            gFunc.cleanup();
            gStart.cleanup();
            gArgs.cleanup();
            if (args instanceof ast.Arr) {
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), func, "call"),
                [start].concat(__toArray(args.elements))
              );
            } else {
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), func, "apply"),
                [start, args]
              );
            }
          });
        } else {
          gArgs = generatorArrayTranslate(getPos(node), args, scope, gFunc.builder);
          return handleAssign(assignTo, scope, gArgs.builder, function () {
            var args, func;
            func = gFunc.tNode();
            args = gArgs.tNode();
            gFunc.cleanup();
            gArgs.cleanup();
            if (isApply) {
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), func, "apply"),
                [
                  ast.Access(getPos(node), args, ast.Const(getPos(node), 0)),
                  ast.Call(
                    getPos(node),
                    ast.Access(getPos(node), args, ast.Const(getPos(node), "slice")),
                    [ast.Const(getPos(node), 1)]
                  )
                ]
              );
            } else if (isNew) {
              scope.addHelper("__new");
              return ast.Call(
                getPos(node),
                ast.Ident(getPos(node), "__new"),
                [func, args]
              );
            } else if (args instanceof ast.Arr) {
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), func, "call"),
                [
                  func instanceof ast.Binary && func.op === "." ? func.left : ast.Const(getPos(node), void 0)
                ].concat(__toArray(args.elements))
              );
            } else {
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), func, "apply"),
                [
                  func instanceof ast.Binary && func.op === "." ? func.left : ast.Const(getPos(node), void 0),
                  args
                ]
              );
            }
          });
        }
      },
      EmbedWrite: function (node, scope, builder, assignTo) {
        var gText;
        gText = generatorTranslateExpression(node.text, scope, builder, false);
        return handleAssign(
          assignTo,
          scope,
          gText.builder,
          function () {
            return ast.Call(
              getPos(node),
              ast.Ident(getPos(node), "write"),
              [gText.tNode()].concat(node.escape
                ? [ast.Const(getPos(node), true)]
                : [])
            );
          },
          gText.cleanup
        );
      },
      Eval: function (node, scope, builder, assignTo) {
        var gCode;
        gCode = generatorTranslateExpression(node.code, scope, builder, false);
        return handleAssign(assignTo, scope, gCode.builder, function () {
          return ast.Eval(getPos(node), gCode.tNode(), gCode.cleanup);
        });
      },
      If: function (node, scope, builder, assignTo) {
        var cleanup, gWhenFalse, gWhenTrue, postBranch, test, tTmp, tWhenFalse, tWhenTrue, whenFalseBranch, whenTrueBranch;
        test = generatorTranslateExpression(node.test, scope, builder, builder.hasGeneratorNode(node.test));
        builder = test.builder;
        if (builder.hasGeneratorNode(node.whenTrue) || builder.hasGeneratorNode(node.whenFalse)) {
          builder.gotoIf(
            getPos(node),
            function () {
              var _ref;
              _ref = test.tNode();
              test.cleanup();
              return _ref;
            },
            function () {
              return whenTrueBranch.state;
            },
            function () {
              return whenFalseBranch.state;
            }
          );
          tTmp = makeTTmp(assignTo, scope, getPos(node));
          whenTrueBranch = builder.branch();
          gWhenTrue = generatorTranslateExpression(node.whenTrue, scope, whenTrueBranch, tTmp);
          gWhenTrue.builder.goto(getPos(node.whenTrue), function () {
            return postBranch.state;
          });
          whenFalseBranch = builder.branch();
          gWhenFalse = generatorTranslateExpression(node.whenFalse, scope, whenFalseBranch, tTmp);
          gWhenFalse.builder.goto(getPos(node.whenFalse), function () {
            return postBranch.state;
          });
          postBranch = builder.branch();
          cleanup = makeCleanup(assignTo, scope, tTmp);
          return {
            builder: postBranch.builder,
            tNode: tTmp,
            cleanup: function () {
              gWhenTrue.cleanup();
              gWhenFalse.cleanup();
              return cleanup();
            }
          };
        } else {
          tWhenTrue = translate(node.whenTrue, scope, "expression");
          tWhenFalse = translate(node.whenFalse, scope, "expression");
          return handleAssign(assignTo, scope, builder, function () {
            return ast.If(
              getPos(node),
              test.tNode(),
              (test.cleanup(), tWhenTrue()),
              tWhenFalse()
            );
          });
        }
      },
      Regexp: function (node, scope, builder, assignTo) {
        var gSource;
        gSource = generatorTranslateExpression(node.source, scope, builder, false);
        return handleAssign(
          assignTo,
          scope,
          builder,
          function () {
            var source;
            source = gSource.tNode();
            if (source.isConst()) {
              return ast.Regex(getPos(node), String(source.constValue()), node.flags);
            } else {
              return ast.Call(
                getPos(node),
                ast.Ident(getPos(node), "RegExp"),
                [
                  source,
                  ast.Const(getPos(node), flags)
                ]
              );
            }
          },
          gSource.cleanup
        );
      },
      TmpWrapper: function (node, scope, builder, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        return handleAssign(
          assignTo,
          scope,
          gNode.builder,
          gNode.tNode,
          function () {
            var _arr, _i, tmp;
            gNode.cleanup();
            for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
              tmp = _arr[_i];
              scope.releaseTmp(tmp);
            }
          }
        );
      },
      Unary: function (node, scope, builder, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        return handleAssign(assignTo, scope, gNode.builder, function () {
          var _ref;
          return ast.Unary(getPos(node), node.op, (_ref = gNode.tNode(), gNode.cleanup(), _ref));
        });
      },
      Yield: function (node, scope, builder, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        builder = builder["yield"](getPos(node), gNode.tNode);
        return handleAssign(
          assignTo,
          scope,
          builder,
          function () {
            return builder.receivedIdent;
          },
          gNode.cleanup
        );
      }
    };
    function generatorTranslateExpression(node, scope, builder, assignTo) {
      var key;
      if (!(node instanceof ParserNode)) {
        throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
      }
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      if (!(builder instanceof GeneratorBuilder)) {
        throw TypeError("Expected builder to be a " + __name(GeneratorBuilder) + ", got " + __typeof(builder));
      }
      if (assignTo == null) {
        assignTo = false;
      } else if (typeof assignTo !== "boolean" && typeof assignTo !== "function") {
        throw TypeError("Expected assignTo to be one of Boolean or Function, got " + __typeof(assignTo));
      }
      key = node.constructor.cappedName;
      if (builder.hasGeneratorNode(node)) {
        if (__owns.call(expressions, key)) {
          return expressions[key](node, scope, builder, assignTo);
        } else {
          throw Error("Unknown expression type: " + __typeof(node));
        }
      } else {
        return handleAssign(assignTo, scope, builder, translate(node, scope, "expression"));
      }
    }
    statements = {
      Block: function (node, scope, builder, breakState, continueState) {
        var _arr, _i, _len, acc, subnode;
        if (node.label != null) {
          throw Error("Not implemented: block with label in generator");
        }
        acc = builder;
        for (_arr = __toArray(node.nodes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          subnode = _arr[_i];
          acc = generatorTranslate(
            subnode,
            scope,
            acc,
            breakState,
            continueState
          );
        }
        return acc;
      },
      Break: function (node, scope, builder, breakState) {
        if (node.label != null) {
          throw Error("Not implemented: break with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop or switch");
        }
        builder.goto(getPos(node), breakState);
        return builder;
      },
      Continue: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: break with label in a generator");
        }
        if (continueState == null) {
          throw Error("continue found outside of a loop");
        }
        builder.goto(getPos(node), continueState);
        return builder;
      },
      For: function (node, scope, builder) {
        var bodyBranch, gTest, postBranch, stepBranch, testBranch;
        if (node.label != null) {
          throw Error("Not implemented: for with label in generator");
        }
        if (node.init != null) {
          builder = generatorTranslate(node.init, scope, builder);
        }
        builder.goto(getPos(node), function () {
          return testBranch.state;
        });
        testBranch = builder.branch();
        gTest = generatorTranslateExpression(node.test, scope, testBranch.builder, builder.hasGeneratorNode(node.test));
        testBranch.builder.gotoIf(
          getPos(node.test),
          function () {
            var _ref;
            _ref = gTest.tNode();
            gTest.cleanup();
            return _ref;
          },
          function () {
            return bodyBranch.state;
          },
          function () {
            return postBranch.state;
          }
        );
        bodyBranch = builder.branch();
        generatorTranslate(
          node.body,
          scope,
          bodyBranch.builder,
          function () {
            return postBranch.state;
          },
          function () {
            return stepBranch.state;
          }
        ).goto(getPos(node.body), function () {
          return (stepBranch || testBranch).state;
        });
        stepBranch = null;
        if (node.step != null) {
          stepBranch = builder.branch();
          generatorTranslate(node.step, scope, stepBranch.builder).goto(getPos(node.step), function () {
            return testBranch.state;
          });
        }
        postBranch = builder.branch();
        return postBranch.builder;
      },
      ForIn: function (node, scope, builder) {
        var bodyBranch, getKey, gObject, index, keys, length, postBranch, stepBranch, testBranch, tKey;
        if (node.label != null) {
          throw Error("Not implemented: for-in with label in generator");
        }
        tKey = translate(node.key, scope, "leftExpression");
        gObject = generatorTranslateExpression(node.object, scope, builder, false);
        builder = gObject.builder;
        keys = scope.reserveIdent(getPos(node), "keys", Type.string.array());
        getKey = memoize(function () {
          var key;
          key = tKey();
          if (!(key instanceof ast.Ident)) {
            throw Error("Expected an Ident for a for-in key");
          }
          scope.addVariable(key, Type.string);
          return key;
        });
        index = scope.reserveIdent(getPos(node), "i", Type.number);
        length = scope.reserveIdent(getPos(node), "len", Type.number);
        scope.addHelper("__allkeys");
        builder = builder.add(function () {
          var _ref;
          return ast.Block(getPos(node), [
            ast.Assign(getPos(node), keys, ast.Call(
              getPos(node),
              ast.Ident(getPos(node), "__allkeys"),
              [(_ref = gObject.tNode(), gObject.cleanup(), _ref)]
            )),
            ast.Assign(getPos(node), index, 0),
            ast.Assign(getPos(node), length, ast.Access(getPos(node), keys, "length"))
          ]);
        });
        builder.goto(getPos(node), function () {
          return testBranch.state;
        });
        testBranch = builder.branch();
        testBranch.builder.gotoIf(
          getPos(node),
          function () {
            return ast.Binary(getPos(node), index, "<", length);
          },
          function () {
            return bodyBranch.state;
          },
          function () {
            return postBranch.state;
          }
        );
        bodyBranch = builder.branch();
        builder = bodyBranch.builder.add(function () {
          return ast.Assign(getPos(node), getKey(), ast.Access(getPos(node), keys, index));
        });
        generatorTranslate(
          node.body,
          scope,
          builder,
          function () {
            return postBranch.state;
          },
          function () {
            return stepBranch.state;
          }
        ).goto(getPos(node.body), function () {
          return stepBranch.state;
        });
        stepBranch = builder.branch();
        stepBranch.builder.add(function () {
          return ast.Unary(getPos(node), "++", index);
        }).goto(getPos(node), function () {
          return testBranch.state;
        });
        postBranch = builder.branch();
        return postBranch.builder;
      },
      If: function (node, scope, builder, breakState, continueState) {
        var postBranch, test, tWhenFalse, tWhenTrue, whenFalseBranch, whenTrueBranch;
        test = generatorTranslateExpression(node.test, scope, builder, builder.hasGeneratorNode(node.test));
        builder = test.builder;
        if (builder.hasGeneratorNode(node.whenTrue) || builder.hasGeneratorNode(node.whenFalse)) {
          builder.gotoIf(
            getPos(node),
            function () {
              var _ref;
              _ref = test.tNode();
              test.cleanup();
              return _ref;
            },
            function () {
              return whenTrueBranch.state;
            },
            function () {
              return (whenFalseBranch || postBranch).state;
            }
          );
          whenTrueBranch = builder.branch();
          generatorTranslate(
            node.whenTrue,
            scope,
            whenTrueBranch.builder,
            breakState,
            continueState
          ).goto(getPos(node.whenTrue), function () {
            return postBranch.state;
          });
          if (node.whenFalse && !(node.whenFalse instanceof ParserNode.Nothing)) {
            whenFalseBranch = builder.branch();
          }
          if (whenFalseBranch) {
            generatorTranslate(
              node.whenFalse,
              scope,
              whenFalseBranch.builder,
              breakState,
              continueState
            ).goto(getPos(node.whenFalse), function () {
              return postBranch.state;
            });
          }
          postBranch = builder.branch();
          return postBranch.builder;
        } else {
          tWhenTrue = translate(node.whenTrue, scope, "statement");
          tWhenFalse = translate(node.whenFalse, scope, "statement");
          return builder.add(function () {
            return ast.If(
              getPos(node),
              test.tNode(),
              (test.cleanup(), tWhenTrue()),
              tWhenFalse()
            );
          });
        }
      },
      Return: function (node, scope, builder) {
        if (!node.node.isConst() || node.node.constValue() !== void 0) {
          throw Error("Cannot use a valued return in a generator");
        }
        builder.goto(getPos(node), function () {
          return builder.stopState;
        });
        return builder;
      },
      Switch: function (node, scope, builder, _p, continueState) {
        var _arr, _f, _len, bodyStates, defaultBranch, defaultCase, gDefaultBody, gNode, i, postBranch, resultCases;
        if (node.label != null) {
          throw Error("Not implemented: switch with label in generator");
        }
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        bodyStates = [];
        resultCases = [];
        gNode.builder.add(function () {
          return ast.Switch(
            getPos(node),
            gNode.tNode(),
            (function () {
              var _arr, _i, _len, case_;
              for (_arr = [], _i = 0, _len = resultCases.length; _i < _len; ++_i) {
                case_ = resultCases[_i];
                _arr.push(case_());
              }
              return _arr;
            }()),
            defaultCase()
          );
        });
        for (_arr = __toArray(node.cases), i = 0, _len = _arr.length, _f = function (case_, i) {
          var caseBranch, gCaseBody, tCaseNode, tGoto;
          if (builder.hasGeneratorNode(case_.node)) {
            throw Error("Cannot use yield in the check of a switch's case");
          }
          tCaseNode = translate(case_.node, scope, "expression");
          caseBranch = gNode.builder.branch();
          bodyStates[i] = caseBranch.state;
          gCaseBody = generatorTranslate(
            case_.body,
            scope,
            caseBranch.builder,
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
          tGoto = caseBranch.builder.makeGoto(getPos(case_.node), function () {
            return caseBranch.state;
          });
          return resultCases.push(function () {
            return ast.Switch.Case(getPos(case_.node), tCaseNode(), ast.Block(getPos(case_.node), [tGoto(), ast.Break(getPos(case_.node))]));
          });
        }; i < _len; ++i) {
          _f.call(this, _arr[i], i);
        }
        if (node.defaultCase != null) {
          defaultBranch = gNode.builder.branch();
          gDefaultBody = generatorTranslate(
            node.defaultCase,
            scope,
            defaultBranch.builder,
            function () {
              return postBranch.state;
            },
            continueState
          );
          gDefaultBody.goto(getPos(node.defaultCase), function () {
            return postBranch.state;
          });
          defaultCase = defaultBranch.builder.makeGoto(getPos(node.defaultCase), function () {
            return defaultBranch.state;
          });
        } else {
          defaultCase = gNode.builder.makeGoto(getPos(node), function () {
            return postBranch.state;
          });
        }
        postBranch = builder.branch();
        return postBranch.builder;
      },
      Throw: function (node, scope, builder, breakState, continueState) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        return gNode.builder.add(function () {
          var _ref;
          return ast.Throw(getPos(node), (_ref = gNode.tNode(), gNode.cleanup(), _ref));
        });
      },
      TmpWrapper: function (node, scope, builder, breakState, continueState) {
        var _arr, _i, result, tmp;
        result = generatorTranslate(
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
        return result;
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
        builder.goto(getPos(node), function () {
          return postBranch.state;
        });
        postBranch = builder.branch();
        return postBranch.builder;
      },
      TryFinally: function (node, scope, builder, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
        if (builder.hasGeneratorNode(node.finallyBody)) {
          throw Error("Cannot use yield in a finally");
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
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, builder, false);
        return builder["yield"](getPos(node), function () {
          var _ref;
          _ref = gNode.tNode();
          gNode.cleanup();
          return _ref;
        });
      }
    };
    return function (node, scope, builder, breakState, continueState) {
      var key, ret;
      if (!(node instanceof ParserNode)) {
        throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
      }
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      if (!(builder instanceof GeneratorBuilder)) {
        throw TypeError("Expected builder to be a " + __name(GeneratorBuilder) + ", got " + __typeof(builder));
      }
      if (builder.hasGeneratorNode(node)) {
        key = node.constructor.cappedName;
        if (__owns.call(statements, key)) {
          ret = statements[key](
            node,
            scope,
            builder,
            breakState,
            continueState
          );
          if (!(ret instanceof GeneratorBuilder)) {
            throw Error("Translated non-GeneratorBuilder from " + __typeof(node) + ": " + __typeof(ret));
          }
          return ret;
        } else {
          ret = generatorTranslateExpression(node, scope, builder);
          return ret.builder.add(function () {
            var _ref;
            _ref = ret.tNode();
            ret.cleanup();
            return _ref;
          });
        }
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
    Assign: function (node, scope, location, autoReturn, unassigned) {
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
          scope.markAsFunction(left);
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
    },
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
          var _once, _once2, argArray, func;
          func = tFunc();
          argArray = tArgArray();
          if (isApply) {
            return scope.maybeCache(argArray, Type.array, (_once = false, function (setArray, array) {
              if (_once) {
                throw Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
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
            }));
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
            return scope.maybeCache(func.left, Type["function"], (_once2 = false, function (setParent, parent) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              return autoReturn(ast.Call(
                getPos(node),
                ast.Access(getPos(node), setParent, func.right, "apply"),
                [parent, argArray]
              ));
            }));
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
    EmbedWrite: function (node, scope, location, autoReturn, unassigned) {
      var tText;
      tText = translate(
        node.text,
        scope,
        "expression",
        null,
        unassigned
      );
      return function () {
        return ast.Call(
          getPos(node),
          ast.Ident(getPos(node), "write"),
          [tText()].concat(node.escape
            ? [ast.Const(getPos(node), true)]
            : [])
        );
      };
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
          scope.addVariable(ident, type, param.isMutable);
          scope.markAsParam(ident);
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
          var _arr, body, fakeThis, i, initializers, innerScope, len, p, param, paramIdents, realInnerScope, unassigned;
          innerScope = scope.clone(!!node.bound);
          realInnerScope = innerScope;
          if (node.generator && !innerScope.bound) {
            innerScope = innerScope.clone(true);
          }
          paramIdents = [];
          initializers = [];
          for (_arr = __toArray(node.params), i = 0, len = _arr.length; i < len; ++i) {
            p = _arr[i];
            param = translateParam(p, innerScope, false);
            if (param.spread) {
              throw Error("Encountered a spread parameter");
            }
            paramIdents.push(param.ident);
            initializers.push.apply(initializers, __toArray(param.init));
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
          if (node.curry) {
            throw Error("Expected node to already be curried");
          }
          return autoReturn(ast.Func(
            getPos(node),
            null,
            paramIdents,
            innerScope.getVariables(),
            body,
            []
          ));
        };
      };
    }()),
    Ident: (function () {
      var PRIMORDIAL_GLOBALS;
      PRIMORDIAL_GLOBALS = {
        Object: true,
        String: true,
        Number: true,
        Boolean: true,
        Function: true,
        Array: true,
        Math: true,
        JSON: true,
        Date: true,
        RegExp: true,
        Error: true,
        RangeError: true,
        ReferenceError: true,
        SyntaxError: true,
        TypeError: true,
        URIError: true,
        escape: true,
        unescape: true,
        parseInt: true,
        parseFloat: true,
        isNaN: true,
        isFinite: true,
        decodeURI: true,
        decodeURIComponent: true,
        encodeURI: true,
        encodeURIComponent: true
      };
      return function (node, scope, location, autoReturn) {
        var name;
        name = node.name;
        scope.addHelper(name);
        return function () {
          var ident;
          ident = ast.Ident(getPos(node), name);
          if (!scope.options.embedded || __owns.call(PRIMORDIAL_GLOBALS, name) || location !== "expression" || scope.hasVariable(ident) || scope.macros.hasHelper(name)) {
            return autoReturn(ident);
          } else {
            return ast.Access(
              getPos(node),
              ast.Ident(getPos(node), "context"),
              ast.Const(getPos(node), name)
            );
          }
        };
      };
    }()),
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
      var innerScope, tCatchBody, tCatchIdent, tLabel, tTryBody;
      tLabel = node.label && translate(node.label, scope, "label");
      tTryBody = translate(
        node.tryBody,
        scope,
        "statement",
        autoReturn,
        unassigned
      );
      innerScope = scope.clone(false);
      tCatchIdent = translate(node.catchIdent, innerScope, "leftExpression");
      tCatchBody = translate(
        node.catchBody,
        innerScope,
        "statement",
        autoReturn,
        unassigned
      );
      return function () {
        var catchIdent, result;
        catchIdent = tCatchIdent();
        if (catchIdent instanceof ast.Ident) {
          innerScope.addVariable(catchIdent);
          innerScope.markAsParam(catchIdent);
        }
        result = ast.TryCatch(
          getPos(node),
          tTryBody(),
          catchIdent,
          tCatchBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
        __import(scope.variables, innerScope.variables);
        return result;
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
      throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
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
      throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
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
    var _arr, _i, _len, _ref, bareInit, body, callFunc, comments, fakeThis, helper, ident, init, name, noPos, uncommentedBody, walker;
    if (typeof roots !== "object" || roots === null) {
      throw TypeError("Expected roots to be an Object, got " + __typeof(roots));
    }
    if (!(scope instanceof Scope)) {
      throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
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
    if (scope.options.embedded) {
      for (_arr = ["write", "context"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        name = _arr[_i];
        ident = ast.Ident(
          { line: 0, column: 0 },
          name
        );
        scope.addVariable(ident);
        scope.markAsParam(ident);
      }
    }
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
    init = [];
    if (scope.hasBound && scope.usedThis) {
      fakeThis = ast.Ident(body.pos, "_this");
      scope.addVariable(fakeThis);
      init.push(ast.Assign(body.pos, fakeThis, ast.This(body.pos)));
    }
    scope.fillHelperDependencies();
    for (_arr = __toArray(scope.getHelpers()), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      helper = _arr[_i];
      if (helper !== "GLOBAL" && scope.macros.hasHelper(helper)) {
        ident = ast.Ident(body.pos, helper);
        scope.addVariable(ident);
        init.push(ast.Assign(body.pos, ident, scope.macros.getHelper(helper)));
      }
    }
    bareInit = [];
    if (scope.options["eval"]) {
      walker = function (node) {
        if (node instanceof ast.Func) {
          scope.addHelper("GLOBAL");
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
          scope.addHelper("GLOBAL");
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
          scope.addHelper("GLOBAL");
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
    comments = (_ref = splitComments(body)).comments;
    uncommentedBody = _ref.body;
    if (scope.options.embedded) {
      uncommentedBody = ast.Block(body.pos, [
        ast.Return(body.pos, ast.Func(
          body.pos,
          null,
          [
            ast.Ident(body.pos, "write"),
            ast.Ident(body.pos, "context")
          ],
          [],
          ast.Block(body.pos, [
            ast.If(
              body.pos,
              ast.Binary(
                body.pos,
                ast.Ident(body.pos, "context"),
                "==",
                ast.Const(body.pos, null)
              ),
              ast.Assign(
                body.pos,
                ast.Ident(body.pos, "context"),
                ast.Obj(body.pos)
              )
            ),
            uncommentedBody
          ])
        ))
      ]);
    }
    if (scope.options.bare) {
      if (scope.hasHelper("GLOBAL")) {
        scope.addVariable(ast.Ident(body.pos, "GLOBAL"));
        bareInit.unshift(ast.Assign(
          body.pos,
          ast.Ident(body.pos, "GLOBAL"),
          scope.macros.getHelper("GLOBAL")
        ));
      }
      if (scope.options.undefinedName != null) {
        scope.addVariable(scope.options.undefinedName);
      }
      return ast.Root(
        body.pos,
        ast.Block(body.pos, __toArray(comments).concat(__toArray(bareInit), __toArray(init), [uncommentedBody])),
        scope.getVariables(),
        ["use strict"]
      );
    } else {
      callFunc = ast.Call(
        body.pos,
        ast.Access(
          body.pos,
          ast.Func(
            body.pos,
            null,
            (scope.hasHelper("GLOBAL")
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
        [ast.This(body.pos)].concat(scope.hasHelper("GLOBAL") ? [scope.macros.getHelper("GLOBAL")] : [])
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
  module.exports = function (node, macros, options, callback) {
    var endTime, result, ret, scope, startTime;
    if (!(macros instanceof MacroHolder)) {
      throw TypeError("Expected macros to be a " + __name(MacroHolder) + ", got " + __typeof(macros));
    }
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return module.exports(node, macros, null, options);
    }
    startTime = new Date().getTime();
    try {
      scope = Scope(options, macros, false);
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
  module.exports.defineHelper = function (macros, name, value, type, dependencies) {
    var helper, ident, scope;
    if (!(macros instanceof MacroHolder)) {
      throw TypeError("Expected macros to be a " + __name(MacroHolder) + ", got " + __typeof(macros));
    }
    if (!(type instanceof Type)) {
      throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
    }
    scope = Scope({}, macros, false);
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
    macros.addHelper(ident.name, helper, type, dependencies);
    return { helper: helper, dependencies: dependencies };
  };
}.call(this));
