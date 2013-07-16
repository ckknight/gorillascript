(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __curry, __first, __import,
      __indexOfIdentical, __isArray, __iter, __owns, __slice, __throw,
      __toArray, __typeof, _ref, ast, AstNode, Cache, GeneratorBuilder,
      GeneratorState, generatorTranslate, getPos, isPrimordial, MacroHolder,
      Map, ParserNode, primordialsBetterWithNew, Scope, translateLispyInternal,
      translateLispyOperator, Type;
  __arrayToIter = (function () {
    var proto;
    proto = {
      iterator: function () {
        return this;
      },
      next: function () {
        var array, i;
        i = +this.index + 1;
        array = this.array;
        if (i >= array.length) {
          return { done: true, value: void 0 };
        } else {
          this.index = i;
          return { done: false, value: array[i] };
        }
      }
    };
    return function (array) {
      var _o;
      if (!__isArray(array)) {
        throw new TypeError("Expected array to be an Array, got " + __typeof(array));
      }
      _o = __create(proto);
      _o.array = array;
      _o.index = -1;
      return _o;
    };
  }());
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw new TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
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
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw new TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw new TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (numArgs > 1) {
      currier = function (args) {
        var ret;
        if (args.length >= numArgs) {
          return f.apply(this, args);
        } else {
          ret = function () {
            if (arguments.length === 0) {
              return ret;
            } else {
              return currier.call(this, args.concat(__slice.call(arguments)));
            }
          };
          return ret;
        }
      };
      return currier([]);
    } else {
      return f;
    }
  };
  __first = function (x) {
    return x;
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
  __indexOfIdentical = function (array, item) {
    var _arr, check, i, inf;
    if (typeof item === "number") {
      if (item !== item) {
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check !== check) {
            return i;
          }
        }
        return -1;
      } else if (item === 0) {
        inf = 1 / item;
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check === 0 && 1 / check === inf) {
            return i;
          }
        }
        return -1;
      }
    }
    return array.indexOf(item);
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __iter = function (iterable) {
    if (iterable == null) {
      throw new TypeError("Expected iterable to be an Object, got " + __typeof(iterable));
    } else if (__isArray(iterable)) {
      return __arrayToIter(iterable);
    } else if (typeof iterable.iterator === "function") {
      return iterable.iterator();
    } else if (typeof iterable.next === "function") {
      return iterable;
    } else {
      throw new Error("Expected iterable to be an Array or an Object with an 'iterator' function or an Object with a 'next' function, got " + __typeof(iterable));
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __throw = function (x) {
    throw x;
  };
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
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
  Map = typeof GLOBAL.Map === "function" ? GLOBAL.Map
    : (Map = (function () {
      var _Map_prototype;
      function Map(iterable) {
        var _item, _iter, _this, x;
        _this = this instanceof Map ? this : __create(_Map_prototype);
        _this._keys = [];
        _this._values = [];
        if (iterable != null) {
          try {
            for (_iter = __iter(iterable); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              x = _item.value;
              _this.set(x[0], x[1]);
            }
          } finally {
            try {
              _iter.close();
            } catch (_e) {}
          }
        }
        return _this;
      }
      _Map_prototype = Map.prototype;
      Map.displayName = "Map";
      _Map_prototype.get = function (key) {
        var index;
        index = __indexOfIdentical(this._keys, key);
        if (index !== -1) {
          return this._values[index];
        }
      };
      _Map_prototype.has = function (key) {
        return __indexOfIdentical(this._keys, key) !== -1;
      };
      _Map_prototype.set = function (key, value) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          index = keys.length;
          keys[index] = key;
        }
        this._values[index] = value;
      };
      _Map_prototype["delete"] = function (key) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          return false;
        } else {
          keys.splice(index, 1);
          return this._values.splice(index, 1);
        }
      };
      _Map_prototype.keys = function () {
        var _arr, _e, _i, _send, _state, _step, _this, _throw, key;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._keys);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[_i];
              _state = 1;
              return { done: false, value: key };
            case 3:
              return { done: true, value: void 0 };
            default: throw new Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          _close();
          throw _e;
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (_e) {
            _throw(_e);
            return _send(void 0);
          }
        };
      };
      _Map_prototype.values = function () {
        var _arr, _e, _i, _send, _state, _step, _this, _throw, value;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._values);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              value = _arr[_i];
              _state = 1;
              return { done: false, value: value };
            case 3:
              return { done: true, value: void 0 };
            default: throw new Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          _close();
          throw _e;
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (_e) {
            _throw(_e);
            return _send(void 0);
          }
        };
      };
      _Map_prototype.items = function () {
        var _arr, _e, _send, _state, _step, _this, _throw, i, key, values;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              values = _this._values;
              _arr = __toArray(_this._keys);
              i = _arr.length;
              ++_state;
            case 1:
              _state = i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[i];
              _state = 1;
              return {
                done: false,
                value: [key, values[i]]
              };
            case 3:
              return { done: true, value: void 0 };
            default: throw new Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          _close();
          throw _e;
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (_e) {
            _throw(_e);
            return _send(void 0);
          }
        };
      };
      _Map_prototype.iterator = Map.prototype.items;
      return Map;
    }()));
  ast = require("./jsast");
  AstNode = ast.Node;
  Type = require("./types");
  _ref = require("./parser");
  MacroHolder = _ref.MacroHolder;
  ParserNode = _ref.Node;
  _ref = null;
  _ref = require("./utils");
  Cache = _ref.Cache;
  isPrimordial = _ref.isPrimordial;
  _ref = null;
  function needsCaching(item) {
    return !(item instanceof ast.Ident) && !(item instanceof ast.Const) && !(item instanceof ast.This) && !(item instanceof ast.Arguments);
  }
  function isNothing(node) {
    return node instanceof ParserNode.Symbol.nothing;
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
      if (variables) {
        _this.variables = __create(variables);
      } else {
        _this.variables = {};
      }
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
      if (type == null) {
        type = Type.any;
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
      if (parentName == null) {
        parentName = "ref";
      }
      if (childName == null) {
        childName = "ref";
      }
      if (save == null) {
        save = false;
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
      if (namePart == null) {
        namePart = "ref";
      }
      if (type == null) {
        type = Type.any;
      }
      return (function () {
        var i, ident, name;
        for (i = 1; ; ++i) {
          if (i === 1) {
            name = "_" + namePart;
          } else {
            name = "_" + namePart + i;
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
      if (type == null) {
        type = Type.any;
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
      if (!__owns.call(this.usedTmps, ident.name)) {
        throw new Error("Trying to release a non-reserved ident: " + ident.name);
      }
      delete this.usedTmps[ident.name];
    };
    _Scope_prototype.markAsParam = function (ident) {
      this.variables[ident.name].isParam = true;
    };
    _Scope_prototype.markAsFunction = function (ident) {
      this.variables[ident.name].isFunction = true;
    };
    _Scope_prototype.addHelper = function (name) {
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
      return __owns.call(this.helperNames, name);
    };
    _Scope_prototype.addVariable = function (ident, type, isMutable) {
      if (type == null) {
        type = Type.any;
      }
      if (isMutable == null) {
        isMutable = false;
      }
      this.variables[ident.name] = { type: type, isMutable: isMutable };
    };
    _Scope_prototype.hasVariable = function (ident) {
      return ident.name in this.variables && typeof this.variables[ident.name] === "object" && this.variables[ident.name] !== null;
    };
    _Scope_prototype.hasOwnVariable = function (ident) {
      return __owns.call(this.variables, ident.name);
    };
    _Scope_prototype.isVariableMutable = function (ident) {
      var _ref;
      if ((_ref = this.variables[ident.name]) != null) {
        return _ref.isMutable;
      }
    };
    _Scope_prototype.removeVariable = function (ident) {
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
  function makeHasGeneratorNode() {
    var inLoopCache, inSwitchCache, normalCache, returnFreeCache;
    inLoopCache = Cache();
    function hasInLoop(node) {
      var _value;
      _value = inLoopCache.get(node);
      if (_value === void 0) {
        _value = (function () {
          var FOUND;
          if (node.isInternalCall()) {
            switch (node.func.internalId) {
            case 39:
            case 21: return true;
            case 13: return false;
            }
          }
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
              return true;
            } else {
              throw e;
            }
          }
          return false;
        }());
        inLoopCache.set(node, _value);
      }
      return _value;
    }
    inSwitchCache = Cache();
    function hasInSwitch(node) {
      var _value;
      _value = inSwitchCache.get(node);
      if (_value === void 0) {
        _value = (function () {
          var _ref, FOUND;
          if (_ref = inLoopCache.get(node)) {
            return _ref;
          }
          if (node.isInternalCall()) {
            switch (node.func.internalId) {
            case 7:
            case 39:
            case 21: return true;
            case 13: return false;
            }
          }
          FOUND = {};
          try {
            node.walk(function (n) {
              var check;
              if (n.isInternalCall("for", "forIn")) {
                check = hasInLoop;
              } else {
                check = hasInSwitch;
              }
              if (check(n)) {
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
        }());
        inSwitchCache.set(node, _value);
      }
      return _value;
    }
    returnFreeCache = Cache();
    normalCache = Cache();
    function hasGeneratorNode(node, allowReturn) {
      var _ref, _value;
      if (allowReturn == null) {
        allowReturn = false;
      }
      _value = (_ref = allowReturn ? returnFreeCache : normalCache).get(node);
      if (_value === void 0) {
        _value = (function () {
          var _ref, FOUND;
          if (!allowReturn && (_ref = returnFreeCache.get(node))) {
            return _ref;
          }
          if (_ref = inLoopCache.get(node)) {
            return _ref;
          }
          if (_ref = inSwitchCache.get(node)) {
            return _ref;
          }
          if (node.isInternalCall()) {
            switch (node.func.internalId) {
            case 4:
            case 7:
            case 39: return true;
            case 21:
              if (!allowReturn) {
                return true;
              }
              break;
            case 13: return false;
            }
          }
          FOUND = {};
          try {
            node.walk(function (n) {
              var check;
              check = hasGeneratorNode;
              if (n.isInternalCall()) {
                switch (n.func.internalId) {
                case 12:
                case 11:
                  check = hasInLoop;
                  break;
                case 24:
                  check = hasInSwitch;
                  break;
                }
              }
              if (check(n, allowReturn)) {
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
        }());
        _ref.set(node, _value);
      }
      return _value;
    }
    return hasGeneratorNode;
  }
  function uid() {
    return Math.random().toString(36).slice(2) + "-" + new Date().getTime();
  }
  GeneratorState = (function () {
    var _GeneratorState_prototype;
    function GeneratorState(builder) {
      var _this;
      _this = this instanceof GeneratorState ? this : __create(_GeneratorState_prototype);
      _this.builder = builder;
      _this.nodes = [];
      return _this;
    }
    _GeneratorState_prototype = GeneratorState.prototype;
    GeneratorState.displayName = "GeneratorState";
    _GeneratorState_prototype.hasGeneratorNode = function (node) {
      return this.builder.hasGeneratorNode(node);
    };
    _GeneratorState_prototype.add = function (tNode) {
      this.nodes.push(tNode);
      return this;
    };
    _GeneratorState_prototype.branch = function () {
      var _ref, state;
      state = GeneratorState(this.builder);
      if (this.builder.currentCatch.length) {
        (_ref = this.builder.currentCatch)[_ref.length - 1].push(state);
      }
      this.builder.statesOrder.push(state);
      return state;
    };
    _GeneratorState_prototype.caseId = function () {
      return this.builder.caseId(this.getRedirect());
    };
    _GeneratorState_prototype.makeGoto = function (pos, tState, includeBreak) {
      var _this;
      _this = this;
      if (includeBreak == null) {
        includeBreak = false;
      }
      return function () {
        var assign, caseId, state;
        state = tState();
        if (state instanceof GeneratorState) {
          caseId = ast.Const(pos, state.caseId());
        } else if (state instanceof ast.Node) {
          caseId = state;
        } else {
          throw new Error("Expected a GeneratorState or Node, got " + __typeof(state));
        }
        if (caseId instanceof ast.Const && typeof caseId.value === "number" && caseId.value === +_this.caseId() + 1) {
          return ast.Unary(pos, "++", _this.builder.stateIdent);
        } else {
          assign = ast.Assign(pos, _this.builder.stateIdent, caseId);
          if (includeBreak) {
            return ast.Block(pos, [assign, ast.Break(pos)]);
          } else {
            return assign;
          }
        }
      };
    };
    _GeneratorState_prototype["yield"] = function (pos, tNode) {
      var branch;
      branch = this.branch();
      this.nodes.push(
        this.makeGoto(
          pos,
          function () {
            return branch;
          },
          false
        ),
        function () {
          return ast.Return(pos, ast.Obj(pos, [
            ast.Obj.Pair(pos, "done", ast.Const(pos, false)),
            ast.Obj.Pair(pos, "value", tNode())
          ]));
        }
      );
      return branch;
    };
    _GeneratorState_prototype["return"] = function (pos, tNode) {
      var _this;
      _this = this;
      if (tNode == null) {
        tNode = null;
      }
      if (tNode == null) {
        this.goto(pos, function () {
          return _this.builder.stop;
        });
      } else {
        this.add(this.makeGoto(
          pos,
          function () {
            return _this.builder.stop;
          },
          false
        ));
        this.add(function () {
          var node;
          node = tNode();
          if (!(node instanceof ast.Statement)) {
            return ast.Return(pos, ast.Obj(pos, [
              ast.Obj.Pair(pos, "done", ast.Const(pos, true)),
              ast.Obj.Pair(pos, "value", node)
            ]));
          } else {
            return node;
          }
        });
      }
    };
    _GeneratorState_prototype.getRedirect = function () {
      return this.builder.getRedirect(this);
    };
    function getCaseId(pos, value) {
      if (value instanceof GeneratorState) {
        return ast.Const(pos, value.caseId());
      } else if (value instanceof ast.Node) {
        return value;
      } else {
        throw new TypeError("Expected a GeneratorState or Node, got " + __typeof(value));
      }
    }
    _GeneratorState_prototype.goto = function (pos, tState, preventRedirect) {
      var nodes;
      if (preventRedirect == null) {
        preventRedirect = false;
      }
      nodes = this.nodes;
      if (nodes.length === 0 && !preventRedirect) {
        this.builder.addRedirect(this, tState);
      }
      nodes.push(this.makeGoto(
        pos,
        function () {
          return getCaseId(pos, tState());
        },
        true
      ));
    };
    _GeneratorState_prototype.noop = function (pos) {
      var branch;
      if (this.nodes.length === 0) {
        return this;
      } else {
        branch = this.branch();
        this.goto(pos, function () {
          return branch;
        });
        return branch;
      }
    };
    _GeneratorState_prototype.gotoIf = function (pos, tTest, tWhenTrue, tWhenFalse) {
      var _this;
      _this = this;
      this.goto(
        pos,
        function () {
          return ast.IfExpression(
            pos,
            tTest(),
            getCaseId(pos, tWhenTrue()),
            getCaseId(pos, tWhenFalse())
          );
        },
        true
      );
    };
    _GeneratorState_prototype.pendingFinally = function (pos, tFinallyBody) {
      var _this, ident, scope;
      _this = this;
      scope = this.builder.scope;
      ident = scope.reserveIdent(pos, "finally", Type["undefined"]["function"]());
      scope.markAsFunction(ident);
      this.builder.finallies.push(function () {
        return ast.Func(
          pos,
          ident,
          [],
          [],
          tFinallyBody()
        );
      });
      this.nodes.push(function () {
        return ast.Call(
          pos,
          ast.Access(pos, _this.builder.pendingFinalliesIdent, "push"),
          [ident]
        );
      });
      return this;
    };
    _GeneratorState_prototype.runPendingFinally = function (pos) {
      var _this;
      _this = this;
      this.nodes.push(function () {
        return ast.Call(pos, ast.Call(pos, ast.Access(pos, _this.builder.pendingFinalliesIdent, "pop")));
      });
      return this;
    };
    _GeneratorState_prototype.enterTryCatch = function (pos) {
      var fresh;
      fresh = this.noop(pos);
      this.builder.enterTryCatch(fresh);
      return fresh;
    };
    _GeneratorState_prototype.exitTryCatch = function (pos, tIdent, tPostState) {
      var fresh;
      this.goto(pos, tPostState);
      fresh = this.noop(pos);
      this.builder.exitTryCatch(fresh, tIdent);
      return fresh;
    };
    return GeneratorState;
  }());
  GeneratorBuilder = (function () {
    var _GeneratorBuilder_prototype;
    function GeneratorBuilder(pos, scope, hasGeneratorNode) {
      var _this, sendScope;
      _this = this instanceof GeneratorBuilder ? this : __create(_GeneratorBuilder_prototype);
      _this.pos = pos;
      _this.scope = scope;
      _this.hasGeneratorNode = hasGeneratorNode;
      _this.currentCatch = [];
      _this.redirects = Map();
      _this.start = GeneratorState(_this);
      _this.stop = GeneratorState(_this).add(function () {
        return ast.Return(pos, ast.Obj(pos, [
          ast.Obj.Pair(pos, "done", ast.Const(pos, true)),
          ast.Obj.Pair(pos, "value", ast.Const(pos, void 0))
        ]));
      });
      _this.statesOrder = [_this.start];
      if (typeof stateIdent !== "undefined" && stateIdent !== null) {
        _this.stateIdent = stateIdent;
      } else {
        _this.stateIdent = scope.reserveIdent(pos, "state", Type.number);
      }
      _this.pendingFinalliesIdent = scope.reserveIdent(pos, "finallies", Type["undefined"]["function"]().array());
      sendScope = scope.clone(false);
      _this.receivedIdent = sendScope.reserveIdent(pos, "received", Type.any);
      sendScope.markAsParam(_this.receivedIdent);
      _this.finallies = [];
      _this.catches = [];
      return _this;
    }
    _GeneratorBuilder_prototype = GeneratorBuilder.prototype;
    GeneratorBuilder.displayName = "GeneratorBuilder";
    _GeneratorBuilder_prototype.addRedirect = function (fromState, toState) {
      this.redirects.set(fromState, toState);
    };
    _GeneratorBuilder_prototype.getRedirect = function (fromState) {
      var redirect, redirectFunc;
      redirectFunc = this.redirects.get(fromState);
      if (redirectFunc == null) {
        return fromState;
      } else if (redirectFunc instanceof GeneratorState) {
        return redirectFunc;
      } else if (typeof redirectFunc === "function") {
        redirect = redirectFunc();
        if (redirect instanceof GeneratorState) {
          redirect = this.getRedirect(redirect);
        } else {
          throw new Error("Expected a GeneratorState, got " + __typeof(redirectFunc));
        }
        this.redirects.set(fromState, redirect);
        return redirect;
      } else {
        throw new Error("Unknown value in redirects: " + __typeof(redirectFunc));
      }
    };
    _GeneratorBuilder_prototype._calculateCaseIds = function () {
      var _arr, _i, _len, caseIds, id, state;
      id = -1;
      caseIds = this.caseIds = Map();
      for (_arr = __toArray(this.statesOrder), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        state = _arr[_i];
        if (!this.redirects.has(state)) {
          caseIds.set(state, ++id);
        }
      }
    };
    _GeneratorBuilder_prototype.caseId = function (state) {
      var caseIds;
      caseIds = this.caseIds;
      if (caseIds == null) {
        throw new Error("_calculate-case-ids must be called first");
      }
      if (!caseIds.has(state)) {
        throw new Error("case-ids does not contain state");
      }
      return caseIds.get(state);
    };
    _GeneratorBuilder_prototype.enterTryCatch = function (state) {
      this.currentCatch.push([state]);
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (state, tIdent) {
      var catchStates, index;
      if (this.currentCatch.length === 0) {
        throw new Error("Unable to exit-try-catch without first using enter-try-catch");
      }
      catchStates = this.currentCatch.pop();
      index = catchStates.indexOf(state);
      if (index !== -1) {
        catchStates.splice(index, 1);
      }
      this.catches.push({ tryStates: catchStates, tIdent: tIdent, catchState: state });
    };
    function calculateRanges(stateIds) {
      var _arr, i, id, lastRangeId, len, ranges, rangeStart;
      ranges = [];
      rangeStart = -1/0;
      lastRangeId = -1;
      for (_arr = __toArray(stateIds), i = 0, len = _arr.length; i < len; ++i) {
        id = _arr[i];
        if (id !== lastRangeId + 1) {
          if (lastRangeId !== -1) {
            ranges.push({ start: rangeStart, finish: lastRangeId });
          }
          rangeStart = id;
        }
        lastRangeId = id;
      }
      if (lastRangeId !== -1) {
        ranges.push({ start: rangeStart, finish: lastRangeId });
      }
      return ranges;
    }
    _GeneratorBuilder_prototype.create = function () {
      var _this, body, catches, close, err, f, innerScope, send, sendTryCatch,
          sendTryFinally, stateIdent, step, throwIdent;
      _this = this;
      if (this.currentCatch.length) {
        throw new Error("Cannot create a generator if there are stray catches");
      }
      this.statesOrder.push(this.stop);
      this._calculateCaseIds();
      body = [
        ast.Assign(this.pos, this.stateIdent, ast.Const(this.pos, this.start.caseId()))
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
          ast.Block(this.pos, [ast.Assign(this.pos, this.stateIdent, this.stop.caseId())])
        ));
      } else {
        body.push(ast.Assign(this.pos, this.pendingFinalliesIdent, ast.Arr(this.pos)));
        body.push.apply(body, (function () {
          var _arr, _arr2, _i, _len, f;
          _arr = [];
          for (_arr2 = __toArray(_this.finallies), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
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
            ast.Assign(this.pos, this.stateIdent, this.stop.caseId()),
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
      step = this.scope.reserveIdent(this.pos, "step", Type["function"]);
      send = this.scope.reserveIdent(this.pos, "send", Type["function"]);
      throwIdent = this.scope.reserveIdent(this.pos, "throw", Type["function"]);
      body.push(ast.Func(
        this.pos,
        step,
        [this.receivedIdent],
        [],
        ast.While(this.pos, true, ast.Switch(
          this.pos,
          stateIdent,
          (function () {
            var _arr, _arr2, _arr3, _arr4, _i, _i2, _len, _len2, i, node, nodes,
                state, tNode;
            _arr = [];
            for (_arr2 = __toArray(_this.statesOrder), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              state = _arr2[_i];
              if (!_this.redirects.has(state)) {
                _arr3 = [];
                for (_arr4 = __toArray(state.nodes), _i2 = 0, _len2 = _arr4.length; _i2 < _len2; ++_i2) {
                  tNode = _arr4[_i2];
                  _arr3.push(tNode());
                }
                nodes = _arr3;
                i = 0;
                for (; i < nodes.length; ++i) {
                  node = nodes[i];
                  if (node instanceof ast.Func && node.name != null) {
                    body.push(node);
                    nodes.splice(i, 1);
                    --i;
                  }
                }
                if (nodes.length === 0) {
                  throw new Error("Found state with no nodes in it");
                }
                _arr.push(ast.Switch.Case(
                  nodes[0].pos,
                  ast.Const(nodes[0].pos, state.caseId()),
                  ast.Block(nodes[0].pos, nodes)
                ));
              }
            }
            return _arr;
          }()),
          ast.Throw(this.pos, ast.Call(
            this.pos,
            ast.Ident(this.pos, "Error"),
            [ast.Binary(this.pos, "Unknown state: ", "+", stateIdent)],
            true
          ))
        ))
      ));
      body.push(ast.Func(
        this.pos,
        throwIdent,
        [err],
        [],
        (function () {
          var _arr, _f, _i, current;
          current = ast.Block(_this.pos, [
            ast.Call(_this.pos, close, []),
            ast.Throw(_this.pos, err)
          ]);
          for (_arr = __toArray(catches), _i = _arr.length, _f = function (catchInfo) {
            var _arr, _arr2, _i, _len, _this, errIdent, state, tryStateIds,
                tryStateRanges;
            _this = this;
            errIdent = catchInfo.tIdent();
            this.scope.addVariable(errIdent);
            _arr = [];
            for (_arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              state = _arr2[_i];
              if (!this.redirects.has(state)) {
                _arr.push(state.caseId());
              }
            }
            tryStateIds = _arr;
            tryStateIds.sort(__curry(2, function (x, y) {
              return __cmp(x, y);
            }));
            tryStateRanges = calculateRanges(tryStateIds);
            return current = ast.If(
              this.pos,
              ast.Or.apply(ast, [this.pos].concat((function () {
                var _arr, _i, _len, _ref, finish, start;
                _arr = [];
                for (_i = 0, _len = tryStateRanges.length; _i < _len; ++_i) {
                  _ref = tryStateRanges[_i];
                  start = _ref.start;
                  finish = _ref.finish;
                  _ref = null;
                  if (start === -1/0) {
                    if (finish === 0) {
                      _arr.push(ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, 0)));
                    } else {
                      _arr.push(ast.Binary(_this.pos, stateIdent, "<=", ast.Const(_this.pos, finish)));
                    }
                  } else if (finish === start) {
                    _arr.push(ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, start)));
                  } else if (finish === +start + 1) {
                    _arr.push(ast.Or(
                      _this.pos,
                      ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, start)),
                      ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, finish))
                    ));
                  } else {
                    _arr.push(ast.And(
                      _this.pos,
                      ast.Binary(_this.pos, stateIdent, ">=", ast.Const(_this.pos, start)),
                      ast.Binary(_this.pos, stateIdent, "<=", ast.Const(_this.pos, finish))
                    ));
                  }
                }
                return _arr;
              }()))),
              ast.Block(this.pos, [
                ast.Assign(this.pos, errIdent, err),
                ast.Assign(this.pos, stateIdent, ast.Const(this.pos, catchInfo.catchState.caseId()))
              ]),
              current
            );
          }; _i--; ) {
            _f.call(_this, _arr[_i]);
          }
          return current;
        }())
      ));
      sendTryCatch = ast.TryCatch(
        this.pos,
        ast.Return(this.pos, ast.Call(this.pos, step, [this.receivedIdent])),
        err,
        ast.Call(this.pos, throwIdent, [err])
      );
      if (this.finallies.length === 0) {
        sendTryFinally = sendTryCatch;
      } else {
        sendTryFinally = ast.TryFinally(this.pos, sendTryCatch, ast.If(
          this.pos,
          ast.Binary(this.pos, stateIdent, "===", this.stop.caseId()),
          ast.Call(this.pos, close, [])
        ));
      }
      body.push(ast.Func(
        this.pos,
        send,
        [this.receivedIdent],
        [],
        catches.length ? ast.While(this.pos, true, sendTryFinally) : sendTryFinally
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
          [err],
          [],
          ast.Block(this.pos, [
            ast.Call(this.pos, throwIdent, [err]),
            ast.Return(this.pos, ast.Call(this.pos, send, [ast.Const(this.pos, void 0)]))
          ])
        ))
      ])));
      return ast.Block(this.pos, body);
    };
    return GeneratorBuilder;
  }());
  function flattenSpreadArray(elements) {
    var _arr, _i, _len, changed, element, node, result;
    result = [];
    changed = false;
    for (_arr = __toArray(elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      element = _arr[_i];
      if (element.isInternalCall("spread")) {
        node = element.args[0];
        if (node.isInternalCall("array")) {
          result.push.apply(result, __toArray(node.args));
          changed = true;
        } else {
          result.push(element);
        }
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
    if (file == null) {
      file = void 0;
    }
    pos = { line: line, column: column };
    if (file != null) {
      pos.file = file;
    }
    return pos;
  }
  getPos = function (node) {
    throw new Error("get-pos must be overridden");
  };
  function parseSwitch(args) {
    var _end, i, len, result;
    result = { topic: args[0], cases: [] };
    len = args.length;
    for (i = 1, _end = len - 1; i < _end; i += 3) {
      result.cases.push({ node: args[i], body: args[i + 1], fallthrough: args[i + 2] });
    }
    result.defaultCase = args[len - 1];
    return result;
  }
  function doNothing() {}
  generatorTranslate = (function () {
    var _ref, generatorTranslateExpressionLispyInternals,
        generatorTranslateExpressionLispyOperators,
        generatorTranslateLispyInternals;
    function memoize(func) {
      var _ref, result;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (func.memoized) {
        return func;
      } else {
        _ref = function () {
          if (func) {
            result = func();
            func = null;
          }
          return result;
        };
        _ref.memoized = true;
        return _ref;
      }
    }
    function same(value) {
      function _ref() {
        return value;
      }
      _ref.memoized = true;
      return _ref;
    }
    function maybeMemoize(value) {
      if (typeof value === "function") {
        return memoize(value);
      } else {
        return same(value);
      }
    }
    function handleAssign(assignTo, scope, state, tNode, cleanup) {
      var nodeNeedsCaching, tAssignTo, tTmp;
      if (cleanup == null) {
        cleanup = doNothing;
      }
      if (typeof assignTo === "function") {
        tAssignTo = memoize(assignTo);
        return {
          state: state.add(function () {
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
          return tNode() === state.builder.receivedIdent || needsCaching(tNode());
        });
        return {
          state: state.add(function () {
            var node;
            node = tNode();
            if (nodeNeedsCaching()) {
              return ast.Assign(node.pos, tTmp(), node);
            } else {
              return node;
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
        return { state: state, tNode: tNode, cleanup: cleanup };
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
    function hasSingleNodeWithNoopsNoSpread(nodes, state) {
      var _i, _len, count, node;
      count = 0;
      for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
        node = nodes[_i];
        if (node.isInternalCall("spread")) {
          return false;
        } else if (state.hasGeneratorNode(node)) {
          ++count;
          if (count > 1) {
            return false;
          }
        } else if (!node.isNoop()) {
          return false;
        }
      }
      return count === 1;
    }
    function generatorArrayTranslate(pos, elements, scope, state, assignTo) {
      var _arr, _f, _i, _len, _this, element, gExpr, i, tArrayStart,
          translatedNodes, tTmp;
      _this = this;
      tTmp = makeTTmp(
        assignTo,
        scope,
        pos,
        "arr",
        Type.array
      );
      if (hasSingleNodeWithNoopsNoSpread(elements, state)) {
        gExpr = (function () {
          var _arr, _len, element, i;
          for (_arr = __toArray(elements), i = 0, _len = _arr.length; i < _len; ++i) {
            element = _arr[i];
            if (!element.isNoop()) {
              return generatorTranslateExpression(element, scope, state, false);
            }
          }
          throw new Error("Unreachable state");
        }());
        translatedNodes = [];
        for (_arr = __toArray(elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          if (state.hasGeneratorNode(element)) {
            translatedNodes.push(gExpr.tNode);
          } else {
            translatedNodes.push(translate(element, scope, "expression"));
          }
        }
        return {
          tNode: function () {
            return ast.Arr(pos, (function () {
              var _arr, _i, _len, tItem;
              _arr = [];
              for (_i = 0, _len = translatedNodes.length; _i < _len; ++_i) {
                tItem = translatedNodes[_i];
                _arr.push(tItem());
              }
              return _arr;
            }()));
          },
          state: gExpr.state,
          cleanup: gExpr.cleanup
        };
      }
      tArrayStart = null;
      for (_arr = __toArray(elements), i = 0, _len = _arr.length, _f = function (element, i) {
        var expr;
        if (tArrayStart || state.hasGeneratorNode(element)) {
          if (tArrayStart == null) {
            tArrayStart = arrayTranslate(
              pos,
              __slice.call(elements, 0, i),
              scope,
              true,
              false
            );
            state = state.add(function () {
              return ast.Assign(pos, tTmp(), tArrayStart());
            });
          }
          if (element.isInternalCall("spread")) {
            expr = generatorTranslateExpression(element.args[0], scope, state, false);
            return state = expr.state.add(function () {
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
                    [
                      __first(expr.tNode(), (expr.cleanup(), void 0))
                    ]
                  )
                ]
              );
            });
          } else {
            expr = generatorTranslateExpression(element, scope, state, false);
            return state = expr.state.add(function () {
              return ast.Call(
                getPos(element),
                ast.Access(getPos(element), tTmp(), ast.Const(getPos(element), "push")),
                [
                  __first(expr.tNode(), (expr.cleanup(), void 0))
                ]
              );
            });
          }
        }
      }; i < _len; ++i) {
        _f.call(this, _arr[i], i);
      }
      if (tArrayStart == null) {
        return {
          state: state,
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
          state: state,
          tNode: tTmp,
          cleanup: makeCleanup(assignTo, scope, tTmp)
        };
      }
    }
    _ref = [];
    _ref[0] = function (node, args, scope, state, assignTo, unassigned) {
      var gChild, gParent;
      gParent = generatorTranslateExpression(
        args[0],
        scope,
        state,
        true,
        unassigned
      );
      gChild = generatorTranslateExpression(
        args[1],
        scope,
        gParent.state,
        false,
        unassigned
      );
      return handleAssign(assignTo, scope, gChild.state, function () {
        var _ref;
        _ref = ast.Access(getPos(node), gParent.tNode(), gChild.tNode());
        gParent.cleanup();
        gChild.cleanup();
        return _ref;
      });
    };
    _ref[1] = function (node, args, scope, state, assignTo, unassigned) {
      return generatorArrayTranslate(
        getPos(node),
        args,
        scope,
        state,
        assignTo,
        unassigned
      );
    };
    _ref[3] = function (node, args, scope, state, assignTo, unassigned) {
      var _arr, i, len, subnode;
      for (_arr = __toArray(args), i = 0, len = _arr.length; i < len; ++i) {
        subnode = _arr[i];
        if (i === len - 1) {
          return generatorTranslateExpression(
            subnode,
            scope,
            state,
            assignTo,
            unassigned
          );
        } else {
          state = generatorTranslate(
            subnode,
            scope,
            state,
            null,
            null,
            null,
            unassigned
          );
        }
      }
      throw new Error("Unreachable state");
    };
    _ref[6] = function (node, args, scope, state, assignTo, unassigned) {
      var context, contextAndArgs, func, gArgs, gContext, gContextAndArgs,
          gFunc, realArgs;
      func = args[0];
      context = args[1];
      realArgs = args.slice(2);
      gFunc = generatorTranslateExpression(
        func,
        scope,
        state,
        true,
        unassigned
      );
      if (!context.isInternalCall("spread")) {
        gContext = generatorTranslateExpression(
          context,
          scope,
          gFunc.state,
          true,
          unassigned
        );
        gArgs = generatorArrayTranslate(
          getPos(node),
          realArgs,
          scope,
          gContext.state,
          unassigned
        );
        return handleAssign(assignTo, scope, gArgs.state, function () {
          var args, context, func;
          func = gFunc.tNode();
          context = gContext.tNode();
          args = gArgs.tNode();
          gFunc.cleanup();
          gContext.cleanup();
          gArgs.cleanup();
          if (args instanceof ast.Arr) {
            return ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "call"),
              [context].concat(__toArray(args.elements))
            );
          } else {
            return ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "apply"),
              [context, args]
            );
          }
        });
      } else {
        contextAndArgs = args.slice(1);
        gContextAndArgs = generatorArrayTranslate(
          getPos(node),
          contextAndArgs,
          scope,
          gFunc.state,
          unassigned
        );
        return handleAssign(assignTo, scope, gArgs.state, function () {
          var contextAndArgs, func;
          func = gFunc.tNode();
          contextAndArgs = gContextAndArgs.tNode();
          gFunc.cleanup();
          gContextAndArgs.cleanup();
          return ast.Call(
            getPos(node),
            ast.Access(getPos(node), func, "apply"),
            [
              ast.Access(getPos(node), contextAndArgs, ast.Const(getPos(node), 0)),
              ast.Call(
                getPos(node),
                ast.Access(getPos(node), contextAndArgs, ast.Const(getPos(node), "slice")),
                [ast.Const(getPos(node), 1)]
              )
            ]
          );
        });
      }
    };
    _ref[14] = function (node, args, scope, state, assignTo, unassigned) {
      var cleanup, gWhenFalse, gWhenTrue, k, postBranch, ret, test, tTmp,
          tWhenFalse, tWhenTrue, v, whenFalseBranch, whenFalseUnassigned,
          whenTrueBranch;
      test = generatorTranslateExpression(
        args[0],
        scope,
        state,
        state.hasGeneratorNode(args[0]),
        unassigned
      );
      state = test.state;
      whenFalseUnassigned = unassigned && __import({}, unassigned);
      if (state.hasGeneratorNode(args[1]) || state.hasGeneratorNode(args[2])) {
        state.gotoIf(
          getPos(node),
          function () {
            var _ref;
            _ref = test.tNode();
            test.cleanup();
            return _ref;
          },
          function () {
            return whenTrueBranch;
          },
          function () {
            return whenFalseBranch;
          }
        );
        tTmp = makeTTmp(assignTo, scope, getPos(node));
        whenTrueBranch = state.branch();
        gWhenTrue = generatorTranslateExpression(
          args[1],
          scope,
          whenTrueBranch,
          tTmp,
          unassigned
        );
        gWhenTrue.state.goto(getPos(args[1]), function () {
          return postBranch;
        });
        whenFalseBranch = state.branch();
        gWhenFalse = generatorTranslateExpression(
          args[2],
          scope,
          whenFalseBranch,
          tTmp,
          whenFalseUnassigned
        );
        gWhenFalse.state.goto(getPos(args[2]), function () {
          return postBranch;
        });
        postBranch = state.branch();
        cleanup = makeCleanup(assignTo, scope, tTmp);
        ret = {
          state: postBranch,
          tNode: tTmp,
          cleanup: function () {
            gWhenTrue.cleanup();
            gWhenFalse.cleanup();
            return cleanup();
          }
        };
      } else {
        tWhenTrue = translate(args[1], scope, "expression", unassigned);
        tWhenFalse = translate(args[2], scope, "expression", whenFalseUnassigned);
        ret = handleAssign(assignTo, scope, state, function () {
          return ast.If(
            getPos(node),
            test.tNode(),
            (test.cleanup(), tWhenTrue()),
            tWhenFalse()
          );
        });
      }
      if (unassigned) {
        for (k in whenFalseUnassigned) {
          if (__owns.call(whenFalseUnassigned, k)) {
            v = whenFalseUnassigned[k];
            if (!v) {
              unassigned[k] = false;
            }
          }
        }
      }
      return ret;
    };
    _ref[17] = function (node, args, scope, state, assignTo, unassigned) {
      var gArgs, gFunc;
      gFunc = generatorTranslateExpression(
        args[0],
        scope,
        state,
        true,
        unassigned
      );
      gArgs = generatorArrayTranslate(
        getPos(node),
        __slice.call(args, 1),
        scope,
        gFunc.state,
        unassigned
      );
      return handleAssign(assignTo, scope, gArgs.state, function () {
        var args, func;
        func = gFunc.tNode();
        args = gArgs.tNode();
        gFunc.cleanup();
        gArgs.cleanup();
        scope.addHelper("__new");
        return ast.Call(
          getPos(node),
          ast.Access(
            getPos(node),
            ast.Ident(getPos(node), "__new"),
            ast.Const(getPos(node), "apply")
          ),
          [func, args]
        );
      });
    };
    _ref[32] = function (node, args, scope, state, assignTo, unassigned) {
      var gNode;
      gNode = generatorTranslateExpression(
        args[0],
        scope,
        state,
        false,
        unassigned
      );
      return handleAssign(
        assignTo,
        scope,
        gNode.state,
        gNode.tNode,
        function () {
          var _arr, _i, _len, tmp;
          gNode.cleanup();
          for (_arr = __toArray(args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
            tmp = _arr[_i];
            scope.releaseTmp(tmp.constValue());
          }
        }
      );
    };
    _ref[39] = function (node, args, scope, state, assignTo, unassigned) {
      var gNode;
      gNode = generatorTranslateExpression(
        args[0],
        scope,
        state,
        false,
        unassigned
      );
      state = gNode.state["yield"](getPos(node), gNode.tNode);
      return handleAssign(
        assignTo,
        scope,
        state,
        function () {
          return state.builder.receivedIdent;
        },
        gNode.cleanup
      );
    };
    generatorTranslateExpressionLispyInternals = _ref;
    _ref = [];
    _ref[0] = (function () {
      var lazyOps;
      lazyOps = {
        "&&": function (node, args, scope, state, assignTo, unassigned) {
          var gLeft, gRight, postBranch, tNode, whenTrueBranch;
          gLeft = generatorTranslateExpression(
            args[0],
            scope,
            state,
            assignTo || true,
            unassigned
          );
          tNode = memoize(gLeft.tNode);
          gLeft.state.gotoIf(
            getPos(node),
            tNode,
            function () {
              return whenTrueBranch;
            },
            function () {
              return postBranch;
            }
          );
          whenTrueBranch = gLeft.state.branch();
          gRight = generatorTranslateExpression(
            args[1],
            scope,
            whenTrueBranch,
            tNode,
            unassigned
          );
          gRight.state.goto(getPos(node), function () {
            return postBranch;
          });
          postBranch = gLeft.state.branch();
          return {
            tNode: tNode,
            state: postBranch,
            cleanup: function () {
              gLeft.cleanup();
              return gRight.cleanup();
            }
          };
        },
        "||": function (node, args, scope, state, assignTo, unassigned) {
          var gLeft, gRight, postBranch, tNode, whenFalseBranch;
          gLeft = generatorTranslateExpression(
            args[0],
            scope,
            state,
            assignTo || true,
            unassigned
          );
          tNode = memoize(gLeft.tNode);
          gLeft.state.gotoIf(
            getPos(node),
            tNode,
            function () {
              return postBranch;
            },
            function () {
              return whenFalseBranch;
            }
          );
          whenFalseBranch = gLeft.state.branch();
          gRight = generatorTranslateExpression(
            args[1],
            scope,
            whenFalseBranch,
            tNode,
            unassigned
          );
          gRight.state.goto(getPos(node), function () {
            return postBranch;
          });
          postBranch = gLeft.state.branch();
          return {
            tNode: tNode,
            state: postBranch,
            cleanup: function () {
              gLeft.cleanup();
              return gRight.cleanup();
            }
          };
        }
      };
      return function (node, args, scope, state, assignTo, unassigned) {
        var gLeft, gRight;
        if (__owns.call(lazyOps, node.func.name)) {
          return lazyOps[node.func.name](
            node,
            args,
            scope,
            state,
            assignTo,
            unassigned
          );
        } else {
          gLeft = generatorTranslateExpression(
            args[0],
            scope,
            state,
            true,
            unassigned
          );
          gRight = generatorTranslateExpression(
            args[1],
            scope,
            gLeft.state,
            false,
            unassigned
          );
          return handleAssign(assignTo, scope, gRight.state, function () {
            return ast.Binary(
              getPos(node),
              gLeft.tNode(),
              (gLeft.cleanup(), node.func.name),
              __first(gRight.tNode(), (gRight.cleanup(), void 0))
            );
          });
        }
      };
    }());
    _ref[1] = function (node, args, scope, state, assignTo, unassigned) {
      var gNode;
      gNode = generatorTranslateExpression(
        args[0],
        scope,
        state,
        false,
        unassigned
      );
      return handleAssign(assignTo, scope, gNode.state, function () {
        return ast.Unary(getPos(node), node.func.name, __first(gNode.tNode(), (gNode.cleanup(), void 0)));
      });
    };
    _ref[2] = function (node, args, scope, state, assignTo, unassigned) {
      var gChild, gLeft, gParent, gRight, left, right;
      left = args[0];
      right = args[1];
      if (left.isInternalCall("access")) {
        gParent = generatorTranslateExpression(
          left.args[0],
          scope,
          state,
          true,
          unassigned
        );
        gChild = generatorTranslateExpression(
          left.args[1],
          scope,
          gParent.state,
          true,
          unassigned
        );
        gLeft = {
          state: gChild.state,
          tNode: function () {
            return ast.Access(getPos(left), gParent.tNode(), gChild.tNode());
          },
          cleanup: function () {
            gParent.cleanup();
            return gChild.cleanup();
          }
        };
      } else {
        if (unassigned && left.isSymbol && left.isIdent) {
          unassigned[left.name] = false;
        }
        gLeft = {
          state: state,
          tNode: translate(left, scope, "leftExpression"),
          cleanup: doNothing
        };
      }
      if (node.func.name === "=") {
        gRight = generatorTranslateExpression(
          right,
          scope,
          gLeft.state,
          gLeft.tNode,
          unassigned
        );
        return handleAssign(
          assignTo,
          scope,
          gRight.state,
          gRight.tNode,
          function () {
            gLeft.cleanup();
            return gRight.cleanup();
          }
        );
      } else {
        throw new Error("Not implemented: assigning with non-= in a generator");
      }
    };
    generatorTranslateExpressionLispyOperators = _ref;
    function generatorTranslateExpressionLispyCall(node, func, args, scope, state, assignTo, unassigned) {
      var gArgs, gChild, gCode, gFunc, gParent;
      if (func.isSymbol && func.isIdent && func.name === "eval") {
        gCode = generatorTranslateExpression(
          node.args[0],
          scope,
          state,
          false,
          unassigned
        );
        return handleAssign(
          assignTo,
          scope,
          gCode.state,
          function () {
            return ast.Eval(getPos(node), gCode.tNode());
          },
          gCode.cleanup
        );
      }
      if (func.isInternalCall("access")) {
        gParent = generatorTranslateExpression(
          func.args[0],
          scope,
          state,
          true,
          unassigned
        );
        gChild = generatorTranslateExpression(
          func.args[1],
          scope,
          gParent.state,
          true,
          unassigned
        );
        gFunc = {
          tNode: function () {
            return ast.Access(getPos(node), gParent.tNode(), gChild.tNode());
          },
          cleanup: function () {
            gParent.cleanup();
            return gChild.cleanup();
          },
          state: gChild.state
        };
      } else {
        gFunc = generatorTranslateExpression(
          func,
          scope,
          state,
          true,
          unassigned
        );
      }
      gArgs = generatorArrayTranslate(
        getPos(node),
        args,
        scope,
        gFunc.state,
        unassigned
      );
      return handleAssign(assignTo, scope, gArgs.state, function () {
        var args, func;
        func = gFunc.tNode();
        args = gArgs.tNode();
        gFunc.cleanup();
        gArgs.cleanup();
        if (args instanceof ast.Arr) {
          return ast.Call(getPos(node), func, args.elements);
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
    function generatorTranslateExpressionLispy(node, scope, state, assignTo, unassigned) {
      var args, func;
      if (assignTo == null) {
        assignTo = false;
      }
      if (node.isCall) {
        func = node.func;
        args = node.args;
        if (func.isSymbol) {
          switch (func.symbolTypeId) {
          case 0:
            return generatorTranslateExpressionLispyInternals[func.internalId](
              node,
              args,
              scope,
              state,
              assignTo,
              unassigned
            );
          case 3:
            return generatorTranslateExpressionLispyOperators[func.operatorTypeId](
              node,
              args,
              scope,
              state,
              assignTo,
              unassigned
            );
          }
        }
        return generatorTranslateExpressionLispyCall(
          node,
          func,
          args,
          scope,
          state,
          assignTo,
          unassigned
        );
      } else {
        throw new Error("Unhandled value in switch");
      }
    }
    function generatorTranslateExpression(node, scope, state, assignTo, unassigned) {
      if (assignTo == null) {
        assignTo = false;
      }
      if (state.hasGeneratorNode(node)) {
        return generatorTranslateExpressionLispy(
          node,
          scope,
          state,
          assignTo,
          unassigned
        );
      } else {
        return handleAssign(assignTo, scope, state, translate(node, scope, "expression", unassigned));
      }
    }
    function isExpression(node) {
      if (node.isInternalCall()) {
        return !!generatorTranslateExpressionLispyInternals[node.func.internalId];
      } else {
        return true;
      }
    }
    _ref = [];
    _ref[3] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var _arr, acc, endState, i, len, subnode;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return endState;
          }
        };
        delete namedStates["\u0000"];
      }
      acc = state;
      for (_arr = __toArray(args), i = 0, len = _arr.length; i < len; ++i) {
        subnode = _arr[i];
        acc = generatorTranslate(
          subnode,
          scope,
          acc,
          breakState,
          continueState,
          namedStates,
          unassigned,
          isTop
        );
      }
      return endState = acc;
    };
    _ref[4] = function (node, args, scope, state, breakState, _p, namedStates) {
      if (breakState == null) {
        throw new Error("break found outside of a loop or switch");
      }
      state.goto(getPos(node), args[0] ? namedStates[args[0].name]["break"] : breakState);
      return state;
    };
    _ref[7] = function (node, args, scope, state, _p, continueState, namedStates) {
      if (continueState == null) {
        throw new Error("continue found outside of a loop");
      }
      state.goto(getPos(node), args[0] ? namedStates[args[0].name]["continue"] : continueState);
      return state;
    };
    _ref[10] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned) {
      var gText;
      if (isExpression(args[0])) {
        gText = generatorTranslateExpression(
          args[0],
          scope,
          state,
          false,
          unassigned
        );
      } else {
        gText = {
          state: generatorTranslate(
            args[0],
            scope,
            state,
            breakState,
            continueState,
            namedStates,
            unassigned
          ),
          tNode: function () {
            return ast.Noop(getPos(args[0]));
          },
          cleanup: function () {}
        };
      }
      return gText.state.add(function () {
        return ast.Call(
          getPos(node),
          ast.Ident(getPos(node), "write"),
          [
            __first(gText.tNode(), (gText.cleanup(), void 0))
          ].concat(args[1].constValue()
            ? [ast.Const(getPos(node), true)]
            : [])
        );
      });
    };
    _ref[11] = function (node, args, scope, state, _p, _p2, namedStates, unassigned) {
      var bodyBranch, bodyUnassigned, gTest, k, postBranch, stepBranch,
          testBranch, v;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          },
          "continue": function () {
            return stepBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      if (!isNothing(args[0])) {
        state = generatorTranslate(
          args[0],
          scope,
          state,
          null,
          null,
          namedStates,
          unassigned
        );
      }
      state.goto(getPos(node), function () {
        return testBranch;
      });
      bodyUnassigned = unassigned && __import({ "\u0000": true }, unassigned);
      testBranch = state.branch();
      gTest = generatorTranslateExpression(
        args[1],
        scope,
        testBranch,
        state.hasGeneratorNode(args[1]),
        bodyUnassigned
      );
      testBranch.gotoIf(
        getPos(args[1]),
        function () {
          var _ref;
          _ref = gTest.tNode();
          gTest.cleanup();
          return _ref;
        },
        function () {
          return bodyBranch;
        },
        function () {
          return postBranch;
        }
      );
      bodyBranch = state.branch();
      generatorTranslate(
        args[3],
        scope,
        bodyBranch,
        function () {
          return postBranch;
        },
        function () {
          return stepBranch;
        },
        namedStates,
        bodyUnassigned
      ).goto(getPos(args[3]), function () {
        return stepBranch;
      });
      stepBranch = null;
      if (!isNothing(args[2])) {
        stepBranch = state.branch();
        generatorTranslate(
          args[2],
          scope,
          stepBranch,
          null,
          null,
          namedStates,
          bodyUnassigned
        ).goto(getPos(args[2]), function () {
          return testBranch;
        });
      } else {
        stepBranch = testBranch;
      }
      if (unassigned) {
        for (k in bodyUnassigned) {
          if (__owns.call(bodyUnassigned, k)) {
            v = bodyUnassigned[k];
            if (!v) {
              unassigned[k] = false;
            }
          }
        }
      }
      return postBranch = state.branch();
    };
    _ref[12] = function (node, args, scope, state, _p, _p2, namedStates, unassigned) {
      var bodyBranch, bodyUnassigned, getKey, gObject, index, k, keys, length,
          postBranch, stepBranch, testBranch, tKey, v;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          },
          "continue": function () {
            return stepBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      tKey = translate(args[0], scope, "leftExpression");
      if (unassigned && args[0].isSymbol && args[0].isIdent) {
        unassigned[args[0].name] = false;
      }
      gObject = generatorTranslateExpression(args[1], scope, state, false);
      state = gObject.state;
      keys = scope.reserveIdent(getPos(node), "keys", Type.string.array());
      getKey = memoize(function () {
        var key;
        key = tKey();
        if (!(key instanceof ast.Ident)) {
          throw new Error("Expected an Ident for a for-in key");
        }
        scope.addVariable(key, Type.string);
        return key;
      });
      index = scope.reserveIdent(getPos(node), "i", Type.number);
      length = scope.reserveIdent(getPos(node), "len", Type.number);
      scope.addHelper("__allkeys");
      state = state.add(function () {
        return ast.Block(getPos(node), [
          ast.Assign(getPos(node), keys, ast.Call(
            getPos(node),
            ast.Ident(getPos(node), "__allkeys"),
            [
              __first(gObject.tNode(), (gObject.cleanup(), void 0))
            ]
          )),
          ast.Assign(getPos(node), index, 0),
          ast.Assign(getPos(node), length, ast.Access(getPos(node), keys, "length"))
        ]);
      });
      state.goto(getPos(node), function () {
        return testBranch;
      });
      testBranch = state.branch();
      testBranch.gotoIf(
        getPos(node),
        function () {
          return ast.Binary(getPos(node), index, "<", length);
        },
        function () {
          return bodyBranch;
        },
        function () {
          return postBranch;
        }
      );
      bodyBranch = testBranch.branch();
      state = bodyBranch.add(function () {
        return ast.Assign(getPos(node), getKey(), ast.Access(getPos(node), keys, index));
      });
      bodyUnassigned = __import({ "\u0000": true }, unassigned);
      generatorTranslate(
        args[2],
        scope,
        state,
        function () {
          return postBranch;
        },
        function () {
          return stepBranch;
        },
        namedStates,
        bodyUnassigned
      ).goto(getPos(args[2]), function () {
        return stepBranch;
      });
      stepBranch = bodyBranch.branch();
      stepBranch.add(function () {
        return ast.Unary(getPos(node), "++", index);
      }).goto(getPos(node), function () {
        return testBranch;
      });
      if (unassigned) {
        for (k in bodyUnassigned) {
          if (__owns.call(bodyUnassigned, k)) {
            v = bodyUnassigned[k];
            if (!v) {
              unassigned[k] = false;
            }
          }
        }
      }
      return postBranch = stepBranch.branch();
    };
    _ref[14] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned) {
      var k, postBranch, ret, test, tWhenFalse, tWhenTrue, v, whenFalseBranch,
          whenFalseUnassigned, whenTrueBranch;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      test = generatorTranslateExpression(args[0], scope, state, state.hasGeneratorNode(args[0]));
      state = test.state;
      whenFalseUnassigned = unassigned && __import({}, unassigned);
      if (state.hasGeneratorNode(args[1]) || state.hasGeneratorNode(args[2])) {
        state.gotoIf(
          getPos(node),
          function () {
            var _ref;
            _ref = test.tNode();
            test.cleanup();
            return _ref;
          },
          function () {
            return whenTrueBranch || postBranch;
          },
          function () {
            return whenFalseBranch || postBranch;
          }
        );
        if (!isNothing(args[1])) {
          whenTrueBranch = state.branch();
        }
        if (whenTrueBranch) {
          generatorTranslate(
            args[1],
            scope,
            whenTrueBranch,
            breakState,
            continueState,
            namedStates,
            unassigned
          ).goto(getPos(args[1]), function () {
            return postBranch;
          });
        }
        if (!isNothing(args[2])) {
          whenFalseBranch = state.branch();
        }
        if (whenFalseBranch) {
          generatorTranslate(
            args[2],
            scope,
            whenFalseBranch,
            breakState,
            continueState,
            namedStates,
            whenFalseUnassigned
          ).goto(getPos(args[2]), function () {
            return postBranch;
          });
        }
        ret = postBranch = state.branch();
      } else {
        tWhenTrue = translate(args[1], scope, "statement", unassigned);
        tWhenFalse = translate(args[2], scope, "statement", whenFalseUnassigned);
        ret = state.add(function () {
          return ast.If(
            getPos(node),
            test.tNode(),
            (test.cleanup(), tWhenTrue()),
            tWhenFalse()
          );
        });
      }
      if (unassigned) {
        for (k in whenFalseUnassigned) {
          if (__owns.call(whenFalseUnassigned, k)) {
            v = whenFalseUnassigned[k];
            if (!v) {
              unassigned[k] = false;
            }
          }
        }
      }
      return ret;
    };
    _ref[15] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      if (!namedStates) {
        namedStates = {};
      }
      namedStates["\u0000"] = args[0].name;
      return generatorTranslateLispy(
        args[1],
        scope,
        state,
        breakState,
        continueState,
        namedStates,
        unassigned,
        isTop
      );
    };
    _ref[21] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var gNode, mutatedNode;
      mutatedNode = args[0].mutateLast(
        null,
        function (n) {
          if (n.isInternalCall("return")) {
            return n;
          } else {
            return ParserNode.InternalCall("return", n.index, n.scope, n);
          }
        },
        null,
        true
      );
      if (mutatedNode.isInternalCall("return") && mutatedNode.args[0] === args[0]) {
        if (args[0].isConst() && args[0].isConstValue(void 0)) {
          state["return"](getPos(node));
          return state;
        } else if (!args[0].isStatement()) {
          gNode = generatorTranslateExpression(args[0], scope, state, false);
          state = gNode.state;
          state["return"](getPos(node), function () {
            var _ref;
            _ref = gNode.tNode();
            gNode.cleanup();
            return _ref;
          });
          return state;
        } else {
          return generatorTranslate(
            args[0],
            scope,
            state,
            breakState,
            continueState,
            namedStates,
            unassigned,
            isTop
          );
        }
      } else {
        return generatorTranslate(
          mutatedNode,
          scope,
          state,
          breakState,
          continueState,
          namedStates,
          unassigned,
          isTop
        );
      }
    };
    _ref[24] = function (node, args, scope, state, _p, continueState, namedStates, unassigned) {
      var _arr, _f, _len, baseUnassigned, bodyStates, currentUnassigned, data,
          defaultBranch, defaultCase, gDefaultBody, gTopic, i, k, postBranch,
          resultCases, v;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      data = parseSwitch(args);
      gTopic = generatorTranslateExpression(data.topic, scope, state, false);
      bodyStates = [];
      resultCases = [];
      gTopic.state.add(function () {
        return ast.Switch(
          getPos(node),
          gTopic.tNode(),
          (function () {
            var _arr, _i, _len, case_;
            _arr = [];
            for (_i = 0, _len = resultCases.length; _i < _len; ++_i) {
              case_ = resultCases[_i];
              _arr.push(case_());
            }
            return _arr;
          }()),
          defaultCase()
        );
      });
      gTopic.state.add(function () {
        return ast.Break(getPos(node));
      });
      baseUnassigned = unassigned && __import({}, unassigned);
      currentUnassigned = unassigned && __import({}, unassigned);
      for (_arr = data.cases, i = 0, _len = _arr.length, _f = function (case_, i) {
        var caseBranch, gCaseBody, k, tCaseNode, tGoto, v;
        if (state.hasGeneratorNode(case_.node)) {
          throw new Error("Cannot use yield in the check of a switch's case");
        }
        tCaseNode = translate(case_.node, scope, "expression", currentUnassigned);
        bodyStates[i] = caseBranch = gTopic.state.branch();
        gCaseBody = generatorTranslate(
          case_.body,
          scope,
          caseBranch,
          function () {
            return postBranch;
          },
          continueState,
          namedStates,
          currentUnassigned
        );
        gCaseBody.goto(getPos(case_.node), case_.fallthrough.constValue()
          ? function () {
            return bodyStates[i + 1] || postBranch;
          }
          : function () {
            return postBranch;
          });
        tGoto = caseBranch.makeGoto(getPos(case_.node), function () {
          return caseBranch;
        });
        resultCases.push(function () {
          return ast.Switch.Case(getPos(case_.node), tCaseNode(), ast.Block(getPos(case_.node), [tGoto(), ast.Break(getPos(case_.node))]));
        });
        if (!case_.fallthrough.constValue() && unassigned) {
          for (k in currentUnassigned) {
            if (__owns.call(currentUnassigned, k)) {
              v = currentUnassigned[k];
              if (!v) {
                unassigned[k] = false;
              }
            }
          }
          return currentUnassigned = __import({}, baseUnassigned);
        }
      }; i < _len; ++i) {
        _f.call(this, _arr[i], i);
      }
      if (!isNothing(data.defaultCase)) {
        defaultBranch = gTopic.state.branch();
        gDefaultBody = generatorTranslate(
          data.defaultCase,
          scope,
          defaultBranch,
          function () {
            return postBranch;
          },
          continueState,
          namedStates,
          currentUnassigned
        );
        gDefaultBody.goto(getPos(data.defaultCase), function () {
          return postBranch;
        });
        defaultCase = defaultBranch.makeGoto(getPos(data.defaultCase), function () {
          return defaultBranch;
        });
      } else {
        defaultCase = gTopic.state.makeGoto(getPos(node), function () {
          return postBranch;
        });
      }
      for (k in currentUnassigned) {
        if (__owns.call(currentUnassigned, k)) {
          v = currentUnassigned[k];
          if (!v) {
            unassigned[k] = false;
          }
        }
      }
      return postBranch = state.branch();
    };
    _ref[31] = function (node, args, scope, state) {
      var gNode;
      gNode = generatorTranslateExpression(args[0], scope, state, false);
      return gNode.state.add(function () {
        return ast.Throw(getPos(node), __first(gNode.tNode(), (gNode.cleanup(), void 0)));
      });
    };
    _ref[32] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var _arr, _i, _len, result, tmp;
      result = generatorTranslate(
        args[0],
        scope,
        state,
        breakState,
        continueState,
        namedStates,
        unassigned,
        isTop
      );
      for (_arr = __toArray(args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
        tmp = _arr[_i];
        scope.releaseTmp(tmp.constValue());
      }
      return result;
    };
    _ref[33] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var postBranch;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      state = state.enterTryCatch(getPos(node));
      state = generatorTranslate(
        args[0],
        scope,
        state,
        breakState,
        continueState,
        namedStates,
        unassigned
      );
      state = state.exitTryCatch(
        getPos(args[0]),
        translate(args[1], scope, "leftExpression"),
        function () {
          return postBranch;
        }
      );
      state = generatorTranslate(
        args[2],
        scope,
        state,
        breakState,
        continueState,
        namedStates,
        unassigned
      );
      state.goto(getPos(node), function () {
        return postBranch;
      });
      return postBranch = state.branch();
    };
    _ref[34] = function (node, args, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var tFinally;
      if (namedStates && __owns.call(namedStates, "\u0000")) {
        namedStates[namedStates["\u0000"]] = {
          "break": function () {
            return postBranch;
          }
        };
        delete namedStates["\u0000"];
      }
      if (state.hasGeneratorNode(args[1])) {
        throw new Error("Cannot use yield in a finally");
      }
      state = state.pendingFinally(getPos(node), function () {
        return tFinally();
      });
      state = generatorTranslate(
        args[0],
        scope,
        state,
        breakState,
        continueState,
        namedStates,
        unassigned
      );
      tFinally = translate(args[1], scope, "statement", unassigned);
      return state.runPendingFinally(getPos(node));
    };
    _ref[39] = function (node, args, scope, state) {
      var gNode;
      gNode = generatorTranslateExpression(args[0], scope, state, false);
      return gNode.state["yield"](getPos(node), function () {
        var _ref;
        _ref = gNode.tNode();
        gNode.cleanup();
        return _ref;
      });
    };
    generatorTranslateLispyInternals = _ref;
    function generatorTranslateLispy(node, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      var internalId, ret;
      if (node.isInternalCall()) {
        internalId = node.func.internalId;
        if (generatorTranslateLispyInternals[internalId]) {
          return generatorTranslateLispyInternals[internalId](
            node,
            node.args,
            scope,
            state,
            breakState,
            continueState,
            namedStates,
            unassigned,
            isTop
          );
        }
      }
      ret = generatorTranslateExpressionLispy(
        node,
        scope,
        state,
        false,
        unassigned
      );
      return ret.state.add(function () {
        var _ref;
        _ref = ret.tNode();
        ret.cleanup();
        return _ref;
      });
    }
    return function (node, scope, state, breakState, continueState, namedStates, unassigned, isTop) {
      if (state.hasGeneratorNode(node)) {
        return generatorTranslateLispy(
          node,
          scope,
          state,
          breakState,
          continueState,
          namedStates,
          unassigned,
          isTop
        );
      } else {
        return state.add(translate(
          node,
          scope,
          isTop ? "topStatement" : "statement",
          unassigned
        ));
      }
    };
  }());
  function arrayTranslate(pos, elements, scope, replaceWithSlice, allowArrayLike, unassigned) {
    var _arr, _f, _i, _len, current, element, i, translatedItems;
    translatedItems = [];
    current = [];
    translatedItems.push(current);
    for (_arr = __toArray(flattenSpreadArray(elements)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      element = _arr[_i];
      if (element.isInternalCall("spread")) {
        translatedItems.push({
          tNode: translate(element.args[0], scope, "expression", unassigned),
          type: element.args[0].type()
        });
        current = [];
        translatedItems.push(current);
      } else {
        current.push(translate(element, scope, "expression", unassigned));
      }
    }
    if (translatedItems.length === 1) {
      return function () {
        return ast.Arr(pos, (function () {
          var _arr, _arr2, _i, _len, tItem;
          _arr = [];
          for (_arr2 = __toArray(translatedItems[0]), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            tItem = _arr2[_i];
            _arr.push(tItem());
          }
          return _arr;
        }()));
      };
    } else {
      for (i = translatedItems.length, _f = function (translatedItem, i) {
        if (i % 2 === 0) {
          if (translatedItem.length > 0) {
            return translatedItems[i] = function () {
              var _arr, _arr2, _i, _len, items, tItem;
              _arr = [];
              for (_arr2 = __toArray(translatedItem), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
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
          if (replaceWithSlice) {
            return ast.Call(
              pos,
              ast.Access(
                pos,
                ast.Ident(pos, "__slice"),
                "call"
              ),
              array instanceof ast.Call && array.func instanceof ast.Ident && array.func.name === "__toArray" ? array.args : [array]
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
          _arr = [];
          for (_i = 1, _len = translatedItems.length; _i < _len; ++_i) {
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
  _ref = [];
  _ref[0] = function (node, args, scope, location, unassigned) {
    var tChild, tParent;
    tParent = translate(args[0], scope, "expression", unassigned);
    tChild = translate(args[1], scope, "expression", unassigned);
    return function () {
      return ast.Access(getPos(node), tParent(), tChild());
    };
  };
  _ref[1] = function (node, args, scope, location, unassigned) {
    var tArr;
    tArr = arrayTranslate(
      getPos(node),
      args,
      scope,
      true,
      unassigned
    );
    return function () {
      return tArr();
    };
  };
  _ref[3] = function (node, args, scope, location, unassigned) {
    var _arr, _arr2, i, len, subnode, tNodes;
    _arr = [];
    for (_arr2 = __toArray(args), i = 0, len = _arr2.length; i < len; ++i) {
      subnode = _arr2[i];
      _arr.push(translate(subnode, scope, location, unassigned));
    }
    tNodes = _arr;
    return function () {
      return ast.Block(getPos(node), (function () {
        var _arr, _i, _len, tNode;
        _arr = [];
        for (_i = 0, _len = tNodes.length; _i < _len; ++_i) {
          tNode = tNodes[_i];
          _arr.push(tNode());
        }
        return _arr;
      }()));
    };
  };
  _ref[4] = function (node, args, scope) {
    var tLabel;
    tLabel = args[0] && translate(args[0], scope, "label");
    return function () {
      return ast.Break(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
    };
  };
  _ref[5] = function (node, args, scope, location, unassigned) {
    var tText;
    tText = translate(args[0], scope, "expression", unassigned);
    return function () {
      return ast.Comment(getPos(node), tText().constValue());
    };
  };
  _ref[6] = function (node, args, scope, location, unassigned) {
    var context, contextAndArgs, func, realArgs, tArgs, tContext,
        tContextAndArgs, tFunc;
    func = args[0];
    context = args[1];
    realArgs = args.slice(2);
    tFunc = translate(func, scope, "expression", unassigned);
    if (!context.isInternalCall("spread")) {
      tContext = translate(context, scope, "expression", unassigned);
      tArgs = arrayTranslate(
        getPos(node),
        realArgs,
        scope,
        false,
        true,
        unassigned
      );
      return function () {
        var args, context, func;
        func = tFunc();
        context = tContext();
        args = tArgs();
        if (args instanceof ast.Arr) {
          return ast.Call(
            getPos(node),
            ast.Access(getPos(node), func, "call"),
            [context].concat(__toArray(args.elements))
          );
        } else {
          return ast.Call(
            getPos(node),
            ast.Access(getPos(node), func, "apply"),
            [context, args]
          );
        }
      };
    } else {
      contextAndArgs = args.slice(1);
      tContextAndArgs = arrayTranslate(
        getPos(node),
        contextAndArgs,
        scope,
        false,
        true,
        unassigned
      );
      return function () {
        var contextAndArgs, func;
        func = tFunc();
        contextAndArgs = tContextAndArgs();
        return scope.maybeCache(contextAndArgs, Type.array, function (setContextAndArgs, contextAndArgs) {
          scope.addHelper("__slice");
          return ast.Call(
            getPos(node),
            ast.Access(getPos(node), func, "apply"),
            [
              ast.Access(getPos(node), setContextAndArgs, 0),
              ast.Call(
                getPos(node),
                ast.Access(getPos(node), contextAndArgs, "slice"),
                [ast.Const(getPos(node), 1)]
              )
            ]
          );
        });
      };
    }
  };
  _ref[7] = function (node, args, scope) {
    var tLabel;
    tLabel = args[0] && translate(args[0], scope, "label");
    return function () {
      return ast.Continue(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
    };
  };
  _ref[8] = function (node, args, scope, location, unassigned) {
    throw new Error("Cannot have a stray custom node '" + args[0].constValue() + "'");
  };
  _ref[9] = function (node) {
    return function () {
      return ast.Debugger(getPos(node));
    };
  };
  _ref[10] = function (node, args, scope, location, unassigned) {
    var innerScope, tText, wrapped;
    if (args[0].isStatement()) {
      innerScope = args[0].scope.clone();
      wrapped = ParserNode.Call(args[0].index, args[0].scope, ParserNode.InternalCall(
        "function",
        args[0].index,
        innerScope,
        ParserNode.InternalCall("array", args[0].index, innerScope),
        ParserNode.InternalCall("autoReturn", args[0].index, innerScope, args[0].rescope(innerScope)),
        ParserNode.Value(args[0].index, true),
        ParserNode.Symbol.nothing(args[0].index),
        ParserNode.Value(args[0].index, false)
      ));
    } else {
      wrapped = args[0];
    }
    tText = translate(wrapped, scope, "expression", unassigned);
    return function () {
      return ast.Call(
        getPos(node),
        ast.Ident(getPos(node), "write"),
        [tText()].concat(args[1].constValue()
          ? [ast.Const(getPos(node), true)]
          : [])
      );
    };
  };
  _ref[11] = function (node, args, scope, location, unassigned) {
    var bodyUnassigned, tBody, tInit, tStep, tTest;
    if (args[0] != null) {
      tInit = translate(args[0], scope, "expression", unassigned);
    }
    bodyUnassigned = unassigned && { "\u0000": true };
    if (args[1] != null) {
      tTest = translate(args[1], scope, "expression", bodyUnassigned);
    }
    tBody = translate(args[3], scope, "statement", bodyUnassigned);
    if (args[2] != null) {
      tStep = translate(args[2], scope, "expression", bodyUnassigned);
    }
    if (unassigned) {
      __import(unassigned, bodyUnassigned);
    }
    return function () {
      return ast.For(
        getPos(node),
        typeof tInit === "function" ? tInit() : void 0,
        typeof tTest === "function" ? tTest() : void 0,
        typeof tStep === "function" ? tStep() : void 0,
        tBody()
      );
    };
  };
  _ref[12] = function (node, args, scope, location, unassigned) {
    var bodyUnassigned, tBody, tKey, tObject;
    tKey = translate(args[0], scope, "leftExpression");
    if (unassigned && args[0].isSymbol && args[0].isIdent) {
      unassigned[args[0].name] = false;
    }
    tObject = translate(args[1], scope, "expression", unassigned);
    bodyUnassigned = unassigned && { "\u0000": true };
    tBody = translate(args[2], scope, "statement", bodyUnassigned);
    if (unassigned) {
      __import(unassigned, bodyUnassigned);
    }
    return function () {
      var key;
      key = tKey();
      if (!(key instanceof ast.Ident)) {
        throw new Error("Expected an Ident for a for-in key");
      }
      scope.addVariable(key, Type.string);
      return ast.ForIn(getPos(node), key, tObject(), tBody());
    };
  };
  _ref[13] = (function () {
    var primitiveTypes, translateType;
    primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
    function translateTypeCheck(node) {
      var _arr, _end, _i, _len, i, result, type, typeData;
      switch (node.nodeTypeId) {
      case 1:
        switch (node.symbolTypeId) {
        case 1:
          if (__owns.call(primitiveTypes, node.name)) {
            return Type[primitiveTypes[node.name]];
          } else {
            return Type.any;
          }
        case 0:
          if (node.isNothing) {
            return Type.any;
          } else {
            throw new Error("Unknown type: " + __typeof(node));
          }
          break;
        default: throw new Error("Unhandled value in switch");
        }
        break;
      case 2:
        if (!node.isInternalCall()) {
          throw new Error("Unknown type: " + __typeof(node));
        }
        switch (node.func.name) {
        case "access": return Type.any;
        case "typeUnion":
          result = Type.none;
          for (_arr = __toArray(node.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            type = _arr[_i];
            result = result.union(type.isConst()
              ? (function () {
                switch (type.constValue()) {
                case null: return Type["null"];
                case void 0: return Type["undefined"];
                default: throw new Error("Unknown const value for typechecking: " + String(type.value));
                }
              }())
              : type instanceof ParserNode.Symbol.ident
              ? (__owns.call(primitiveTypes, type.name) ? Type[primitiveTypes[type.name]] : Type.any)
              : __throw(new Error("Not implemented: typechecking for non-idents/consts within a type-union")));
          }
          return result;
        case "typeGeneric":
          if (node.args[0].isIdent) {
            switch (node.args[0].name) {
            case "Array": return translateTypeCheck(node.args[1]).array();
            case "Function": return translateTypeCheck(node.args[1])["function"]();
            default: return Type.any;
            }
          } else {
            return Type.any;
          }
          break;
        case "typeObject":
          typeData = {};
          for (i = 0, _end = +node.args.length; i < _end; i += 2) {
            if (node.args[i].isConst()) {
              typeData[node.args[i].constValue()] = translateTypeCheck(node.args[i + 1]);
            }
          }
          return Type.makeObject(typeData);
        default: throw new Error("Unhandled value in switch");
        }
        break;
      default: throw new Error("Unhandled value in switch");
      }
    }
    function translateParam(param, scope, inner) {
      var ident, laterInit, tmp, type;
      if (!param.isInternalCall("param")) {
        throw new Error("Unknown parameter type: " + __typeof(param));
      }
      ident = translate(param.args[0], scope, "param")();
      laterInit = [];
      if (ident instanceof ast.Binary && ident.op === "." && ident.right instanceof ast.Const && typeof ident.right.value === "string") {
        tmp = ast.Ident(ident.pos, ident.right.value);
        laterInit.push(ast.Binary(ident.pos, ident, "=", tmp));
        ident = tmp;
      }
      if (!(ident instanceof ast.Ident)) {
        throw new Error("Expecting param to be an Ident, got " + __typeof(ident));
      }
      type = translateTypeCheck(param.args[4]);
      scope.addVariable(ident, type, !!param.args[3].constValue());
      scope.markAsParam(ident);
      return { init: laterInit, ident: ident, spread: !!param.args[2].constValue() };
    }
    translateType = (function () {
      var primordialTypes;
      primordialTypes = {
        String: Type.string,
        Number: Type.number,
        Boolean: Type.boolean,
        Function: Type["function"],
        Array: Type.array
      };
      return function (node, scope) {
        var _arr, _arr2, _i, _len, arg, args, base, current, type;
        switch (node.nodeTypeId) {
        case 0:
          switch (node.value) {
          case null: return Type["null"];
          case void 0: return Type["undefined"];
          default: throw new Error("Unexpected Value type: " + String(node.value));
          }
          break;
        case 1:
          if (node.isIdent) {
            if (!__owns.call(primordialTypes, node.name)) {
              throw new Error("Not implemented: custom type: " + node.name);
            }
            return primordialTypes[node.name];
          } else {
            throw new Error("Unexpected type: " + __typeof(node));
          }
          break;
        case 2:
          if (!node.isInternalCall()) {
            throw new Error("Unexpected type: " + __typeof(node));
          }
          switch (node.func.name) {
          case "typeUnion":
            current = Type.none;
            for (_arr = __toArray(node.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              current = current.union(translateType(type));
            }
            return current;
          case "typeGeneric":
            base = translateType(node.args[0], scope);
            _arr = [];
            for (_arr2 = __toArray(node.args), _i = 1, _len = _arr2.length; _i < _len; ++_i) {
              arg = _arr2[_i];
              _arr.push(translateType(arg, scope));
            }
            args = _arr;
            return Type.generic.apply(Type, [base].concat(args));
          default: throw new Error("Unhandled value in switch");
          }
          break;
        default: throw new Error("Unhandled value in switch");
        }
      };
    }());
    return function (node, args, scope, location, unassigned) {
      return function () {
        var _arr, _ref, body, bodyPos, convertAutoReturn, fakeThis, i,
            initializers, innerScope, isGenerator, len, p, param, paramIdents,
            realInnerScope, unassigned, wrap;
        innerScope = scope.clone(!node.args[2].isConst() || !!node.args[2].constValue());
        realInnerScope = innerScope;
        isGenerator = node.args[4].constValue();
        if (isGenerator && !innerScope.bound) {
          innerScope = innerScope.clone(true);
        }
        paramIdents = [];
        initializers = [];
        for (_arr = __toArray(node.args[0].args), i = 0, len = _arr.length; i < len; ++i) {
          p = _arr[i];
          param = translateParam(p, innerScope, false);
          if (param.spread) {
            throw new Error("Encountered a spread parameter");
          }
          paramIdents.push(param.ident);
          initializers.push.apply(initializers, param.init);
        }
        if (!node.args[2].isConst()) {
          convertAutoReturn = function (subnode) {
            return subnode.args[0];
          };
        } else {
          convertAutoReturn = function (subnode) {
            return ParserNode.Call(subnode.index, subnode.scope, ParserNode.Symbol["return"](subnode.index), subnode.args[0]);
          };
        }
        function translateAutoReturn(subnode) {
          if (subnode.isInternalCall("function")) {
            return subnode;
          }
          if (subnode.isInternalCall("autoReturn")) {
            subnode = convertAutoReturn(subnode);
          }
          return subnode.walk(translateAutoReturn);
        }
        unassigned = {};
        _ref = translateFunctionBody(
          getPos(node),
          isGenerator,
          innerScope,
          translateAutoReturn(node.args[1]),
          unassigned
        );
        body = _ref.body;
        wrap = _ref.wrap;
        _ref = null;
        innerScope.releaseTmps();
        bodyPos = getPos(node.args[1]);
        body = ast.Block(bodyPos, initializers.concat([body]));
        if (!node.args[2].isConst()) {
          fakeThis = ast.Ident(bodyPos, "_this");
          innerScope.addVariable(fakeThis);
          body = ast.Block(bodyPos, [
            ast.Assign(bodyPos, fakeThis, translate(node.args[2], scope, "expression", unassigned)()),
            body,
            ast.Return(bodyPos, fakeThis)
          ]);
        } else if (innerScope.usedThis) {
          if (innerScope.bound) {
            scope.usedThis = true;
          }
          if ((innerScope.hasBound || isGenerator) && !realInnerScope.bound) {
            fakeThis = ast.Ident(bodyPos, "_this");
            innerScope.addVariable(fakeThis);
            body = ast.Block(bodyPos, [
              ast.Assign(bodyPos, fakeThis, ast.This(bodyPos)),
              body
            ]);
          }
        }
        return wrap(ast.Func(
          getPos(node),
          null,
          paramIdents,
          innerScope.getVariables(),
          body,
          []
        ));
      };
    };
  }());
  _ref[14] = function (node, args, scope, location, unassigned) {
    var innerLocation, k, tTest, tWhenFalse, tWhenTrue, v, whenFalseUnassigned;
    if (location === "statement" || location === "topStatement") {
      innerLocation = "statement";
    } else {
      innerLocation = location;
    }
    tTest = translate(args[0], scope, "expression", unassigned);
    whenFalseUnassigned = unassigned && __import({}, unassigned);
    tWhenTrue = translate(args[1], scope, innerLocation, unassigned);
    tWhenFalse = translate(args[2], scope, innerLocation, whenFalseUnassigned);
    if (unassigned) {
      for (k in whenFalseUnassigned) {
        if (__owns.call(whenFalseUnassigned, k)) {
          v = whenFalseUnassigned[k];
          if (!v) {
            unassigned[k] = false;
          }
        }
      }
    }
    return function () {
      return ast.If(getPos(node), tTest(), tWhenTrue(), typeof tWhenFalse === "function" ? tWhenFalse() : void 0);
    };
  };
  _ref[15] = function (node, args, scope, location, unassigned) {
    var tLabel, tNode;
    tLabel = translate(args[0], scope, "label");
    tNode = translate(args[1], scope, location, unassigned);
    return function () {
      return tNode().withLabel(tLabel());
    };
  };
  _ref[17] = function (node, args, scope, location, unassigned) {
    var tArgs, tFunc;
    if (args[0].isSymbol && args[0].isIdent && args[0].name === "RegExp" && args[1].isConst() && (!args[2] || args[2].isConst())) {
      if (args[2] && args[2].constValue()) {
        return function () {
          return ast.Regex(getPos(node), String(args[1].constValue()), String(args[2].constValue()));
        };
      } else {
        return function () {
          return ast.Regex(getPos(node), String(args[1].constValue()));
        };
      }
    }
    tFunc = translate(args[0], scope, "expression", unassigned);
    tArgs = arrayTranslate(
      getPos(node),
      __slice.call(args, 1),
      scope,
      false,
      true,
      unassigned
    );
    return function () {
      var args, func;
      func = tFunc();
      args = tArgs();
      if (args instanceof ast.Arr) {
        return ast.Call(getPos(node), func, args.elements, true);
      } else {
        scope.addHelper("__new");
        return ast.Call(
          getPos(node),
          ast.Access(
            getPos(node),
            ast.Ident(getPos(node), "__new"),
            ast.Const(getPos(node), "apply")
          ),
          [func, args]
        );
      }
    };
  };
  _ref[19] = function (node, args, scope, location, unassigned) {
    var _arr, _i, _len, _ref, pair, properties, tKeys, tPrototype, tValues;
    tKeys = [];
    tValues = [];
    properties = [];
    for (_arr = __toArray(args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
      pair = _arr[_i];
      tKeys.push(translate(pair.args[0], scope, "expression", unassigned));
      tValues.push(translate(pair.args[1], scope, "expression", unassigned));
      properties.push((_ref = pair.args[2]) != null ? _ref.constValue() : void 0);
    }
    if (!isNothing(args[0])) {
      tPrototype = translate(args[0], scope, "expression", unassigned);
    } else {
      tPrototype = void 0;
    }
    return function () {
      var _len, constPairs, currentPair, currentPairs, i, ident, key,
          lastProperty, obj, postConstPairs, property, prototype, result, tKey,
          tValue, value;
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
          currentPair.property = "" + lastProperty + property;
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
          _arr = [];
          for (_i = 0, _len = constPairs.length; _i < _len; ++_i) {
            _ref = constPairs[_i];
            key = _ref.key;
            value = _ref.value;
            _ref = null;
            _arr.push(ast.Obj.Pair(key.pos, String(key.value), value));
          }
          return _arr;
        }()));
      }
      if (postConstPairs.length === 0) {
        return obj;
      } else {
        ident = scope.reserveIdent(getPos(node), "o", Type.object);
        result = ast.BlockExpression(getPos(node), [ast.Assign(getPos(node), ident, obj)].concat(
          (function () {
            var _arr, _i, _len, key, pair, property;
            _arr = [];
            for (_i = 0, _len = postConstPairs.length; _i < _len; ++_i) {
              pair = postConstPairs[_i];
              key = pair.key;
              property = pair.property;
              if (property) {
                scope.addHelper("__defProp");
                _arr.push(ast.Call(
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
                      : __throw(new Error("Unknown property type: " + String(property)))
                  ]
                ));
              } else {
                _arr.push(ast.Assign(
                  key.pos,
                  ast.Access(key.pos, ident, key),
                  pair.value
                ));
              }
            }
            return _arr;
          }()),
          [ident]
        ));
        scope.releaseIdent(ident);
        return result;
      }
    };
  };
  _ref[21] = function (node, args, scope, location, unassigned) {
    var mutatedNode, tValue;
    if (location !== "statement" && location !== "topStatement") {
      throw new Error("Expected Return in statement position");
    }
    mutatedNode = args[0].mutateLast(
      null,
      function (n) {
        if (n.isInternalCall("return")) {
          return n;
        } else {
          return ParserNode.InternalCall("return", n.index, n.scope, n);
        }
      },
      null,
      true
    );
    if (mutatedNode.isInternalCall("return") && mutatedNode.args[0] === args[0]) {
      tValue = translate(args[0], scope, "expression", unassigned);
      if (args[0].isStatement()) {
        return tValue;
      } else {
        return function () {
          return ast.Return(getPos(node), tValue());
        };
      }
    } else {
      return translate(mutatedNode, scope, location, unassigned);
    }
  };
  _ref[25] = function (node, args) {
    throw new Error("Cannot have a stray super call");
  };
  _ref[24] = function (node, args, scope, location, unassigned) {
    var _arr, _arr2, _i, _len, baseUnassigned, case_, currentUnassigned, data,
        k, newCase, tCases, tDefaultCase, tTopic, v;
    data = parseSwitch(args);
    tTopic = translate(data.topic, scope, "expression", unassigned);
    baseUnassigned = unassigned && __import({}, unassigned);
    currentUnassigned = unassigned && __import({}, baseUnassigned);
    _arr = [];
    for (_arr2 = data.cases, _i = 0, _len = _arr2.length; _i < _len; ++_i) {
      case_ = _arr2[_i];
      newCase = {
        pos: getPos(case_.node),
        tNode: translate(case_.node, scope, "expression", currentUnassigned),
        tBody: translate(case_.body, scope, "statement", currentUnassigned),
        fallthrough: case_.fallthrough.constValue()
      };
      if (!newCase.fallthrough && unassigned) {
        for (k in currentUnassigned) {
          if (__owns.call(currentUnassigned, k)) {
            v = currentUnassigned[k];
            if (!v) {
              unassigned[k] = false;
            }
          }
        }
        currentUnassigned = __import({}, baseUnassigned);
      }
      _arr.push(newCase);
    }
    tCases = _arr;
    tDefaultCase = translate(data.defaultCase, scope, "statement", currentUnassigned);
    for (k in currentUnassigned) {
      if (__owns.call(currentUnassigned, k)) {
        v = currentUnassigned[k];
        if (!v) {
          unassigned[k] = false;
        }
      }
    }
    return function () {
      return ast.Switch(
        getPos(node),
        tTopic(),
        (function () {
          var _arr, case_, caseBody, caseNode, i, len;
          _arr = [];
          for (i = 0, len = tCases.length; i < len; ++i) {
            case_ = tCases[i];
            caseNode = case_.tNode();
            caseBody = case_.tBody();
            if (!case_.fallthrough) {
              caseBody = ast.Block(case_.pos, [caseBody, ast.Break(caseBody.pos)]);
            }
            _arr.push(ast.Switch.Case(case_.pos, caseNode, caseBody));
          }
          return _arr;
        }()),
        tDefaultCase()
      );
    };
  };
  _ref[31] = function (node, args, scope, location, unassigned) {
    var tNode;
    tNode = translate(args[0], scope, "expression", unassigned);
    return function () {
      return ast.Throw(getPos(node), tNode());
    };
  };
  _ref[32] = function (node, args, scope, location, unassigned) {
    var _arr, _i, _len, tmp, tResult;
    tResult = translate(args[0], scope, location, unassigned);
    for (_arr = __toArray(args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
      tmp = _arr[_i];
      scope.releaseTmp(tmp.constValue());
    }
    return tResult;
  };
  _ref[33] = function (node, args, scope, location, unassigned) {
    var innerScope, tCatchBody, tCatchIdent, tTryBody;
    tTryBody = translate(args[0], scope, "statement", unassigned);
    innerScope = scope.clone(false);
    tCatchIdent = translate(args[1], innerScope, "leftExpression");
    tCatchBody = translate(args[2], innerScope, "statement", unassigned);
    return function () {
      var catchIdent, result;
      catchIdent = tCatchIdent();
      if (catchIdent instanceof ast.Ident) {
        innerScope.addVariable(catchIdent);
        innerScope.markAsParam(catchIdent);
      }
      result = ast.TryCatch(getPos(node), tTryBody(), catchIdent, tCatchBody());
      __import(scope.variables, innerScope.variables);
      return result;
    };
  };
  _ref[34] = function (node, args, scope, location, unassigned) {
    var tFinallyBody, tTryBody;
    tTryBody = translate(args[0], scope, "statement", unassigned);
    tFinallyBody = translate(args[1], scope, "statement", unassigned);
    return function () {
      return ast.TryFinally(getPos(node), tTryBody(), tFinallyBody());
    };
  };
  _ref[38] = function (node, args, scope, location, unassigned) {
    var ident, isMutable, tIdent;
    ident = args[0];
    if (unassigned && !unassigned["\u0000"] && ident.isSymbol && ident.isIdent && !__owns.call(unassigned, ident.name)) {
      unassigned[ident.name] = true;
    }
    tIdent = translate(ident, scope, "leftExpression");
    isMutable = node.scope.isMutable(ident);
    return function () {
      scope.addVariable(tIdent(), Type.any, isMutable);
      return ast.Noop(getPos(node));
    };
  };
  translateLispyInternal = _ref;
  _ref = [];
  _ref[0] = function (node, args, scope, location, unassigned) {
    var tLeft, tRight;
    tLeft = translate(args[0], scope, "expression", unassigned);
    tRight = translate(args[1], scope, "expression", unassigned);
    return function () {
      return ast.Binary(getPos(node), tLeft(), node.func.name, tRight());
    };
  };
  _ref[1] = function (node, args, scope, location, unassigned) {
    var opName, tSubnode;
    opName = node.func.name;
    if (unassigned && (opName === "++" || opName === "--" || opName === "++post" || opName === "--post") && args[0].isSymbol && args[0].isIdent) {
      unassigned[args[0].name] = false;
    }
    tSubnode = translate(args[0], scope, "expression", unassigned);
    return function () {
      return ast.Unary(getPos(node), opName, tSubnode());
    };
  };
  _ref[2] = function (node, args, scope, location, unassigned) {
    var opName, tLeft, tRight;
    opName = node.func.name;
    tLeft = translate(args[0], scope, "leftExpression");
    tRight = translate(args[1], scope, "expression", unassigned);
    if (unassigned && args[0].isSymbol && args[0].isIdent) {
      if (opName === "=" && unassigned[args[0].name] && !unassigned["\u0000"] && args[1].isConstValue(void 0)) {
        return function () {
          return ast.Noop(getPos(node));
        };
      }
      unassigned[args[0].name] = false;
    }
    return function () {
      var left, right;
      left = tLeft();
      right = tRight();
      if (opName === "=" && location === "topStatement" && left instanceof ast.Ident && right instanceof ast.Func && right.name == null && scope.hasOwnVariable(left) && !scope.isVariableMutable(left)) {
        scope.markAsFunction(left);
        return ast.Func(
          getPos(node),
          left,
          right.params,
          right.variables,
          right.body,
          right.declarations
        );
      } else {
        return ast.Binary(getPos(node), left, opName, right);
      }
    };
  };
  translateLispyOperator = _ref;
  primordialsBetterWithNew = {
    Error: true,
    RangeError: true,
    ReferenceError: true,
    SyntaxError: true,
    TypeError: true,
    URIError: true
  };
  function translateLispyCall(node, func, args, scope, location, unassigned) {
    var tArgs, tCode, tFunc;
    if (func.isSymbol && func.isIdent) {
      if (func.name === "RegExp" && args[0].isConst() && (!args[1] || args[1].isConst())) {
        if (args[1] && args[1].constValue()) {
          return function () {
            return ast.Regex(getPos(node), String(args[0].constValue()), String(args[1].constValue()));
          };
        } else {
          return function () {
            return ast.Regex(getPos(node), String(args[0].constValue()));
          };
        }
      } else if (func.name === "eval") {
        tCode = translate(args[0], scope, "expression", unassigned);
        return function () {
          return ast.Eval(getPos(node), tCode());
        };
      }
    }
    tFunc = translate(func, scope, "expression", unassigned);
    tArgs = arrayTranslate(
      getPos(node),
      args,
      scope,
      false,
      true,
      unassigned
    );
    return function () {
      var args, func;
      func = tFunc();
      args = tArgs();
      if (args instanceof ast.Arr) {
        return ast.Call(getPos(node), func, args.elements, func instanceof ast.Ident && __owns.call(primordialsBetterWithNew, func.name));
      } else if (func instanceof ast.Binary && func.op === ".") {
        return scope.maybeCache(func.left, Type["function"], function (setParent, parent) {
          return ast.Call(
            getPos(node),
            ast.Access(getPos(node), setParent, func.right, "apply"),
            [parent, args]
          );
        });
      } else {
        return ast.Call(
          getPos(node),
          ast.Access(getPos(node), func, "apply"),
          [
            ast.Const(getPos(node), void 0),
            args
          ]
        );
      }
    };
  }
  function translateLispy(node, scope, location, unassigned) {
    var args, func, ident, name;
    switch (node.nodeTypeId) {
    case 0:
      return function () {
        return ast.Const(getPos(node), node.value);
      };
    case 1:
      switch (node.symbolTypeId) {
      case 1:
        name = node.name;
        switch (name) {
        case "arguments":
          return function () {
            return ast.Arguments(getPos(node));
          };
        case "this":
          return function () {
            scope.usedThis = true;
            if (scope.bound) {
              return ast.Ident(getPos(node), "_this");
            } else {
              return ast.This(getPos(node));
            }
          };
        default:
          scope.addHelper(name);
          return function () {
            var ident;
            ident = ast.Ident(getPos(node), name);
            if (!scope.options.embedded || isPrimordial(name) || location !== "expression" || scope.hasVariable(ident) || scope.macros.hasHelper(name)) {
              return ident;
            } else {
              return ast.Access(
                getPos(node),
                ast.Ident(getPos(node), "context"),
                ast.Const(getPos(node), name)
              );
            }
          };
        }
        break;
      case 2:
        ident = scope.getTmp(getPos(node), node.id, node.name, node.scope.type(node));
        return function () {
          return ident;
        };
      case 0:
        if (node.isNothing) {
          return function () {
            return ast.Noop(getPos(node));
          };
        } else {
          throw new Error("Unhandled symbol: " + __typeof(node));
        }
        break;
      default: throw new Error("Unhandled value in switch");
      }
      break;
    case 2:
      func = node.func;
      args = node.args;
      if (func.isSymbol) {
        switch (func.symbolTypeId) {
        case 0:
          return translateLispyInternal[func.internalId](
            node,
            args,
            scope,
            location,
            unassigned
          );
        case 3:
          return translateLispyOperator[func.operatorTypeId](
            node,
            args,
            scope,
            location,
            unassigned
          );
        }
      }
      return translateLispyCall(
        node,
        func,
        args,
        scope,
        location,
        unassigned
      );
    default: throw new Error("Unhandled value in switch");
    }
  }
  function translate(node, scope, location, unassigned) {
    return translateLispy(node, scope, location, unassigned);
  }
  function translateFunctionBody(pos, isGenerator, scope, body, unassigned) {
    var _ref, builder, hasGeneratorNode, isSimpleGenerator, translatedBody;
    if (unassigned == null) {
      unassigned = {};
    }
    isSimpleGenerator = false;
    if (isGenerator) {
      hasGeneratorNode = makeHasGeneratorNode();
      isSimpleGenerator = !hasGeneratorNode(body, true);
      if (!isSimpleGenerator) {
        builder = GeneratorBuilder(pos, scope, hasGeneratorNode);
        generatorTranslate(
          body,
          scope,
          builder.start,
          null,
          null,
          null,
          unassigned,
          true
        ).goto(pos, function () {
          return builder.stop;
        });
        translatedBody = builder.create();
        if (pos.file) {
          if (!(_ref = translatedBody.pos).file) {
            _ref.file = pos.file;
          }
        }
        return {
          wrap: function (x) {
            return x;
          },
          body: translatedBody
        };
      }
    }
    translatedBody = translate(body, scope, "topStatement", unassigned)();
    if (pos.file) {
      if (!(_ref = translatedBody.pos).file) {
        _ref.file = pos.file;
      }
    }
    return {
      wrap: isSimpleGenerator
        ? (scope.addHelper("__generator"), function (x) {
          return ast.Call(
            pos,
            ast.Ident(pos, "__generator"),
            [x]
          );
        })
        : function (x) {
          return x;
        },
      body: translatedBody
    };
  }
  function makeGetPos(getPosition) {
    return function (node) {
      var pos;
      pos = getPosition(node.index);
      return makePos(pos.line, pos.column);
    };
  }
  function propagateFilenames(node) {
    var file;
    file = node.pos.file;
    if (file) {
      return node.walk(function (subnode) {
        var _ref;
        if (!(_ref = subnode.pos).file) {
          _ref.file = file;
        }
        return propagateFilenames(subnode);
      });
    } else {
      return node.walk(propagateFilenames);
    }
  }
  function translateRoot(roots, scope, getPosition) {
    var _arr, _i, _len, _ref, bareInit, body, callFunc, comments, commentsBody,
        fakeThis, helper, ident, init, innerScope, isGenerator, name, noPos,
        ret, root, rootBody, rootPos, walker;
    if (!__isArray(roots)) {
      roots = [roots];
    }
    if (!__isArray(getPosition)) {
      getPosition = [getPosition];
    }
    if (roots.length === 0) {
      return ast.Root(
        { line: 0, column: 0 },
        ast.Noop({ line: 0, column: 0 }),
        [],
        []
      );
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
    innerScope = scope;
    if (scope.options.embedded) {
      innerScope = scope.clone();
      for (_arr = ["write", "context"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        name = _arr[_i];
        ident = ast.Ident(
          { line: 0, column: 0 },
          name
        );
        innerScope.addVariable(ident);
        innerScope.markAsParam(ident);
      }
    }
    function handleEmbedded(body, wrap, scope) {
      var commentsBody;
      if (scope.options.embedded) {
        commentsBody = splitComments(body);
        body = commentsBody.body;
        return ast.Block(body.pos, commentsBody.comments.concat([
          ast.Return(body.pos, wrap(ast.Func(
            body.pos,
            null,
            [
              ast.Ident(body.pos, "write"),
              ast.Ident(body.pos, "context")
            ],
            scope.getVariables(),
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
              body
            ])
          )))
        ]));
      } else {
        return wrap(body);
      }
    }
    if (roots.length === 1) {
      getPos = makeGetPos(getPosition[0]);
      root = roots[0];
      if (!(root instanceof ParserNode) || !root.isInternalCall("root")) {
        throw new Error("Cannot translate non-Root object");
      }
      isGenerator = root.args[3].constValue();
      if (isGenerator) {
        innerScope = innerScope.clone(true);
      }
      rootPos = getPos(root);
      rootPos.file = root.args[0].constValue();
      rootBody = root.args[1];
      if (scope.options["return"] || scope.options["eval"]) {
        rootBody = ParserNode.InternalCall("return", rootBody.index, rootBody.scope, rootBody);
      }
      ret = translateFunctionBody(rootPos, isGenerator, innerScope, rootBody);
      if (!(_ref = ret.body.pos).file) {
        _ref.file = rootPos.file;
      }
      getPos = null;
      body = handleEmbedded(ret.body, ret.wrap, innerScope);
    } else {
      body = ast.Block(noPos, (function () {
        var _arr, _arr2, _len, _ref, bodyScope, comments, i, isGenerator, ret,
            root, rootBody, rootPos;
        _arr = [];
        for (_arr2 = __toArray(roots), i = 0, _len = _arr2.length; i < _len; ++i) {
          root = _arr2[i];
          getPos = makeGetPos(getPosition[i]);
          if (!(root instanceof ParserNode) || !root.isInternalCall("root")) {
            throw new Error("Cannot translate non-Root object");
          }
          isGenerator = root.args[3].constValue();
          bodyScope = innerScope.clone(isGenerator);
          ret = translateFunctionBody(getPos(root), isGenerator, bodyScope, root.args[1]);
          rootPos = getPos(root);
          rootPos.file = root.args[0].constValue();
          if (!(_ref = ret.body.pos).file) {
            _ref.file = rootPos.file;
          }
          getPos = null;
          _ref = splitComments(ret.body);
          comments = _ref.comments;
          rootBody = _ref.body;
          _ref = null;
          _arr.push(ast.Block(rootPos, comments.concat([
            ast.Call(
              rootPos,
              ast.Access(
                rootPos,
                ast.Func(
                  rootPos,
                  null,
                  [],
                  bodyScope.getVariables(),
                  handleEmbedded(ret.body, ret.wrap, bodyScope)
                ),
                ast.Const(rootPos, "call")
              ),
              [ast.This(rootPos)]
            )
          ])));
        }
        return _arr;
      }()));
    }
    commentsBody = splitComments(body);
    comments = commentsBody.comments;
    body = commentsBody.body;
    init = [];
    if (innerScope.hasBound && innerScope.usedThis) {
      fakeThis = ast.Ident(body.pos, "_this");
      innerScope.addVariable(fakeThis);
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
    body = propagateFilenames(body);
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
      return propagateFilenames(ast.Root(
        body.pos,
        ast.Block(body.pos, comments.concat(bareInit, init, [body])),
        scope.getVariables(),
        ["use strict"]
      ));
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
            ast.Block(body.pos, init.concat([body])),
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
        ast.Block(body.pos, comments.concat(bareInit, [callFunc])),
        [],
        []
      );
    }
  }
  module.exports = function (node, macros, getPosition, options) {
    var endTime, result, scope, startTime;
    if (options == null) {
      options = {};
    }
    startTime = new Date().getTime();
    try {
      scope = Scope(options, macros, false);
      result = translateRoot(node, scope, getPosition);
      scope.releaseTmps();
    } catch (e) {
      if (typeof callback !== "undefined" && callback !== null) {
        return callback(e);
      } else {
        throw e;
      }
    }
    endTime = new Date().getTime();
    if (typeof options.progress === "function") {
      options.progress("translate", endTime - startTime);
    }
    return { node: result, time: endTime - startTime };
  };
  module.exports.defineHelper = function (macros, getPosition, name, value, type, dependencies) {
    var helper, ident, scope;
    scope = Scope({}, macros, false);
    getPos = makeGetPos(getPosition);
    if (typeof name === "string") {
      ident = ast.Ident(
        makePos(0, 0),
        name
      );
    } else if (name instanceof ParserNode.Symbol.ident) {
      ident = translate(name, scope, "leftExpression")();
    } else {
      throw new TypeError("Expecting name to be a String or Ident, got " + __typeof(name));
    }
    if (!(ident instanceof ast.Ident)) {
      throw new Error("Expected name to be an Ident, got " + __typeof(ident));
    }
    if (value instanceof AstNode) {
      helper = value;
    } else if (value instanceof ParserNode) {
      helper = translate(value, scope, "expression")();
    } else {
      throw new TypeError("Expected value to be a parser or ast Node, got " + __typeof(value));
    }
    if (dependencies == null) {
      dependencies = scope.getHelpers();
    }
    macros.addHelper(ident.name, helper, type, dependencies);
    getPos = null;
    return { helper: helper, dependencies: dependencies };
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
