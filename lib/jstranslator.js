(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __curry, __first, __import,
      __indexOfIdentical, __isArray, __iter, __num, __owns, __slice, __throw,
      __toArray, __typeof, _ref, ast, AstNode, Cache, GeneratorBuilder,
      GeneratorState, generatorTranslate, getPos, isPrimordial, LispyNode,
      MacroHolder, Map, ParserNode, Scope, translators, Type;
  __arrayToIter = (function () {
    var proto;
    proto = {
      iterator: function () {
        return this;
      },
      next: function () {
        var array, i;
        i = __num(this.index) + 1;
        array = this.array;
        if (i >= __num(array.length)) {
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
        throw TypeError("Expected array to be an Array, got " + __typeof(array));
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
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw TypeError("Expected f to be a Function, got " + __typeof(f));
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
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __iter = function (iterable) {
    if (iterable == null) {
      throw TypeError("Expected iterable to be an Object, got " + __typeof(iterable));
    } else if (__isArray(iterable)) {
      return __arrayToIter(iterable);
    } else if (typeof iterable.iterator === "function") {
      return iterable.iterator();
    } else if (typeof iterable.next === "function") {
      return iterable;
    } else {
      throw Error("Expected iterable to be an Array or an Object with an 'iterator' function or an Object with a 'next' function, got " + __typeof(iterable));
    }
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
  __throw = function (err) {
    throw err;
  };
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw TypeError("Expected an object with a length property, got " + __typeof(x));
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
            default: throw Error("Unknown state: " + _state);
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
            default: throw Error("Unknown state: " + _state);
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
            default: throw Error("Unknown state: " + _state);
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
  ParserNode = _ref.Node;
  MacroHolder = _ref.MacroHolder;
  LispyNode = require("./parser-lispynodes");
  _ref = require("./utils");
  Cache = _ref.Cache;
  isPrimordial = _ref.isPrimordial;
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
        throw Error("Trying to release a non-reserved ident: " + ident.name);
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
      var _once;
      return inLoopCache.getOrAdd(node, (_once = false, function (node) {
        var FOUND, result;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        result = false;
        if (node instanceof LispyNode && node.isCall && (node.func.isYield || node.func.isReturn)) {
          return true;
        }
        if (!(node instanceof ParserNode.Function)) {
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
        }
        return false;
      }));
    }
    inSwitchCache = Cache();
    function hasInSwitch(node) {
      var _once;
      return inSwitchCache.getOrAdd(node, (_once = false, function (node) {
        var _ref, FOUND;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_ref = inLoopCache.get(node)) {
          return _ref;
        }
        if (node instanceof LispyNode && node.isCall && (node.func.isContinue || node.func.isYield || node.func.isReturn)) {
          return true;
        }
        if (!(node instanceof ParserNode.Function)) {
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
        }
        return false;
      }));
    }
    returnFreeCache = Cache();
    normalCache = Cache();
    function hasGeneratorNode(node, allowReturn) {
      var _once;
      if (allowReturn == null) {
        allowReturn = false;
      }
      return (allowReturn ? returnFreeCache : normalCache).getOrAdd(node, (_once = false, function (node) {
        var _ref, FOUND, func;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (!allowReturn && (_ref = returnFreeCache.get(node))) {
          return _ref;
        }
        if (_ref = inLoopCache.get(node)) {
          return _ref;
        }
        if (_ref = inSwitchCache.get(node)) {
          return _ref;
        }
        if (node instanceof LispyNode && node.isCall) {
          func = node.func;
          if (func.isBreak || func.isContinue || func.isYield || !allowReturn && func.isReturn) {
            return true;
          }
        }
        if (!(node instanceof ParserNode.Function)) {
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
              } else if (hasGeneratorNode(n, allowReturn)) {
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
        }
        return false;
      }));
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
          throw Error("Expected a GeneratorState or Node, got " + __typeof(state));
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
        throw TypeError("Expected a GeneratorState or Node, got " + __typeof(value));
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
          throw Error("Expected a GeneratorState, got " + __typeof(redirectFunc));
        }
        this.redirects.set(fromState, redirect);
        return redirect;
      } else {
        throw Error("Unknown value in redirects: " + __typeof(redirectFunc));
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
        throw Error("_calculate-case-ids must be called first");
      }
      if (!caseIds.has(state)) {
        throw Error("case-ids does not contain state");
      }
      return caseIds.get(state);
    };
    _GeneratorBuilder_prototype.enterTryCatch = function (state) {
      this.currentCatch.push([state]);
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (state, tIdent) {
      var catchStates, index;
      if (this.currentCatch.length === 0) {
        throw Error("Unable to exit-try-catch without first using enter-try-catch");
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
        throw Error("Cannot create a generator if there are stray catches");
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
            for (_arr = [], _arr2 = __toArray(_this.statesOrder), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              state = _arr2[_i];
              if (!_this.redirects.has(state)) {
                for (_arr3 = [], _arr4 = __toArray(state.nodes), _i2 = 0, _len2 = _arr4.length; _i2 < _len2; ++_i2) {
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
                  throw Error("Found state with no nodes in it");
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
            [ast.Binary(this.pos, "Unknown state: ", "+", stateIdent)]
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
            for (_arr = [], _arr2 = __toArray(catchInfo.tryStates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
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
                for (_arr = [], _i = 0, _len = tryStateRanges.length; _i < _len; ++_i) {
                  _ref = tryStateRanges[_i];
                  start = _ref.start;
                  finish = _ref.finish;
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
    throw Error("get-pos must be overridden");
  };
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
        if (node instanceof ParserNode.Spread) {
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
          throw Error("Unreachable state");
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
              for (_arr = [], _i = 0, _len = translatedNodes.length; _i < _len; ++_i) {
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
          if (element instanceof ParserNode.Spread) {
            expr = generatorTranslateExpression(element.node, scope, state, false);
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
                    [__first(expr.tNode(), expr.cleanup())]
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
                [__first(expr.tNode(), expr.cleanup())]
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
    expressions = {
      1: function (node, scope, state, assignTo, unassigned) {
        var gChild, gParent;
        gParent = generatorTranslateExpression(
          node.parent,
          scope,
          state,
          true,
          unassigned
        );
        gChild = generatorTranslateExpression(
          node.child,
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
      },
      4: function (node, scope, state, assignTo, unassigned) {
        return generatorArrayTranslate(
          getPos(node),
          node.elements,
          scope,
          state,
          assignTo,
          unassigned
        );
      },
      5: function (node, scope, state, assignTo, unassigned) {
        var gChild, gLeft, gParent, gRight, left;
        left = node.left;
        if (left instanceof ParserNode.Access) {
          gParent = generatorTranslateExpression(
            left.parent,
            scope,
            state,
            true,
            unassigned
          );
          gChild = generatorTranslateExpression(
            left.child,
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
          if (unassigned && node.left instanceof ParserNode.Ident) {
            unassigned[node.left.name] = false;
          }
          gLeft = {
            state: state,
            tNode: translate(node.left, scope, "leftExpression"),
            cleanup: doNothing
          };
        }
        gRight = generatorTranslateExpression(
          node.right,
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
      },
      6: (function () {
        var lazyOps;
        lazyOps = {
          "&&": function (node, scope, state, assignTo, unassigned) {
            var gLeft, gRight, postBranch, tNode, whenTrueBranch;
            gLeft = generatorTranslateExpression(
              node.left,
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
              node.right,
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
          "||": function (node, scope, state, assignTo, unassigned) {
            var gLeft, gRight, postBranch, tNode, whenFalseBranch;
            gLeft = generatorTranslateExpression(
              node.left,
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
              node.right,
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
        return function (node, scope, state, assignTo, unassigned) {
          var gLeft, gRight;
          if (__owns.call(lazyOps, node.op)) {
            return lazyOps[node.op](
              node,
              scope,
              state,
              assignTo,
              unassigned
            );
          } else {
            gLeft = generatorTranslateExpression(
              node.left,
              scope,
              state,
              true,
              unassigned
            );
            gRight = generatorTranslateExpression(
              node.right,
              scope,
              gLeft.state,
              false,
              unassigned
            );
            return handleAssign(assignTo, scope, gRight.state, function () {
              return ast.Binary(
                getPos(node),
                gLeft.tNode(),
                (gLeft.cleanup(), node.op),
                __first(gRight.tNode(), gRight.cleanup())
              );
            });
          }
        };
      }()),
      7: function (node, scope, state, assignTo, unassigned) {
        var _arr, i, len, subnode;
        for (_arr = __toArray(node.nodes), i = 0, len = _arr.length; i < len; ++i) {
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
              unassigned
            );
          }
        }
        throw Error("Unreachable state");
      },
      9: function (node, scope, state, assignTo, unassigned) {
        var args, gArgs, gChild, gFunc, gParent, gStart, isApply, isNew;
        if (node.func instanceof ParserNode.Access) {
          gParent = generatorTranslateExpression(
            node.func.parent,
            scope,
            state,
            true,
            unassigned
          );
          gChild = generatorTranslateExpression(
            node.func.child,
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
            node.func,
            scope,
            state,
            true,
            unassigned
          );
        }
        isApply = node.isApply;
        isNew = node.isNew;
        args = node.args;
        if (isApply && (args.length === 0 || !(args[0] instanceof ParserNode.Spread))) {
          if (args.length === 0) {
            gStart = {
              state: gFunc.state,
              tNode: function () {
                return ast.Const(getPos(node), void 0);
              },
              cleanup: doNothing
            };
          } else {
            gStart = generatorTranslateExpression(
              args[0],
              scope,
              gFunc.state,
              true,
              unassigned
            );
          }
          gArgs = generatorArrayTranslate(
            getPos(node),
            __slice.call(args, 1),
            scope,
            gStart.state,
            unassigned
          );
          return handleAssign(assignTo, scope, gArgs.state, function () {
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
                ast.Access(
                  getPos(node),
                  ast.Ident(getPos(node), "__new"),
                  ast.Const(getPos(node), "apply")
                ),
                [func, args]
              );
            } else if (args instanceof ast.Arr) {
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
      },
      17: function (node, scope, state, assignTo, unassigned) {
        var gCode;
        gCode = generatorTranslateExpression(
          node.code,
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
      },
      22: function (node, scope, state, assignTo, unassigned) {
        var cleanup, gWhenFalse, gWhenTrue, k, postBranch, ret, test, tTmp,
            tWhenFalse, tWhenTrue, v, whenFalseBranch, whenFalseUnassigned,
            whenTrueBranch;
        test = generatorTranslateExpression(
          node.test,
          scope,
          state,
          state.hasGeneratorNode(node.test),
          unassigned
        );
        state = test.state;
        whenFalseUnassigned = unassigned && __import({}, unassigned);
        if (state.hasGeneratorNode(node.whenTrue) || state.hasGeneratorNode(node.whenFalse)) {
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
            node.whenTrue,
            scope,
            whenTrueBranch,
            tTmp,
            unassigned
          );
          gWhenTrue.state.goto(getPos(node.whenTrue), function () {
            return postBranch;
          });
          whenFalseBranch = state.branch();
          gWhenFalse = generatorTranslateExpression(
            node.whenFalse,
            scope,
            whenFalseBranch,
            tTmp,
            whenFalseUnassigned
          );
          gWhenFalse.state.goto(getPos(node.whenFalse), function () {
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
          tWhenTrue = translate(node.whenTrue, scope, "expression", unassigned);
          tWhenFalse = translate(node.whenFalse, scope, "expression", whenFalseUnassigned);
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
      },
      28: function (node, scope, state, assignTo, unassigned) {
        var gSource;
        gSource = generatorTranslateExpression(
          node.source,
          scope,
          state,
          false,
          unassigned
        );
        return handleAssign(
          assignTo,
          scope,
          state,
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
      41: function (node, scope, state, assignTo, unassigned) {
        var gNode;
        gNode = generatorTranslateExpression(
          node.node,
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
            var _arr, _i, tmp;
            gNode.cleanup();
            for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
              tmp = _arr[_i];
              scope.releaseTmp(tmp);
            }
          }
        );
      },
      48: function (node, scope, state, assignTo, unassigned) {
        var gNode;
        gNode = generatorTranslateExpression(
          node.node,
          scope,
          state,
          false,
          unassigned
        );
        return handleAssign(assignTo, scope, gNode.state, function () {
          return ast.Unary(getPos(node), node.op, __first(gNode.tNode(), gNode.cleanup()));
        });
      }
    };
    function generatorTranslateExpressionLispy(node, scope, state, assignTo, unassigned) {
      var args, func, gNode;
      if (assignTo == null) {
        assignTo = false;
      }
      if (node.isCall) {
        func = node.func;
        args = node.args;
        if (func.isInternal) {
          if (func.isYield) {
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
          } else {
            throw Error("Unhandled value in switch");
          }
        } else {
          throw Error("wat");
        }
      } else {
        throw Error("Unhandled value in switch");
      }
    }
    function generatorTranslateExpression(node, scope, state, assignTo, unassigned) {
      var key;
      if (assignTo == null) {
        assignTo = false;
      }
      if (state.hasGeneratorNode(node)) {
        if (node instanceof LispyNode) {
          return generatorTranslateExpressionLispy(
            node,
            scope,
            state,
            assignTo,
            unassigned
          );
        }
        key = node.typeId;
        if (__owns.call(expressions, key)) {
          return expressions[key](
            node,
            scope,
            state,
            assignTo,
            unassigned
          );
        } else {
          throw Error("Unknown expression type: " + __typeof(node));
        }
      } else {
        return handleAssign(assignTo, scope, state, translate(node, scope, "expression", unassigned));
      }
    }
    function isExpression(node) {
      if (node instanceof LispyNode) {
        return true;
      } else {
        return __owns.call(expressions, node.typeId);
      }
    }
    statements = {
      7: function (node, scope, state, breakState, continueState, unassigned, isTop) {
        var _arr, acc, i, len, subnode;
        if (node.label != null) {
          throw Error("Not implemented: block with label in generator");
        }
        acc = state;
        for (_arr = __toArray(node.nodes), i = 0, len = _arr.length; i < len; ++i) {
          subnode = _arr[i];
          acc = generatorTranslate(
            subnode,
            scope,
            acc,
            breakState,
            continueState,
            unassigned,
            isTop
          );
        }
        return acc;
      },
      16: function (node, scope, state, breakState, continueState, unassigned) {
        var gText;
        if (isExpression(node.text)) {
          gText = generatorTranslateExpression(
            node.text,
            scope,
            state,
            false,
            unassigned
          );
        } else {
          gText = {
            state: generatorTranslate(
              node.text,
              scope,
              state,
              breakState,
              continueState,
              unassigned
            ),
            tNode: function () {
              return ast.Noop(getPos(node.text));
            },
            cleanup: function () {}
          };
        }
        return gText.state.add(function () {
          return ast.Call(
            getPos(node),
            ast.Ident(getPos(node), "write"),
            [__first(gText.tNode(), gText.cleanup())].concat(node.escape
              ? [ast.Const(getPos(node), true)]
              : [])
          );
        });
      },
      18: function (node, scope, state, _p, _p2, unassigned) {
        var bodyBranch, bodyUnassigned, gTest, k, postBranch, stepBranch,
            testBranch, v;
        if (node.label != null) {
          throw Error("Not implemented: for with label in generator");
        }
        if (node.init != null && !(node.init instanceof ParserNode.Nothing)) {
          state = generatorTranslate(
            node.init,
            scope,
            state,
            null,
            null,
            unassigned
          );
        }
        state.goto(getPos(node), function () {
          return testBranch;
        });
        bodyUnassigned = unassigned && __import({ "\u0000": true }, unassigned);
        testBranch = state.branch();
        gTest = generatorTranslateExpression(
          node.test,
          scope,
          testBranch,
          state.hasGeneratorNode(node.test),
          bodyUnassigned
        );
        testBranch.gotoIf(
          getPos(node.test),
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
          node.body,
          scope,
          bodyBranch,
          function () {
            return postBranch;
          },
          function () {
            return stepBranch;
          },
          bodyUnassigned
        ).goto(getPos(node.body), function () {
          return stepBranch || testBranch;
        });
        stepBranch = null;
        if (node.step != null && !(node.step instanceof ParserNode.Nothing)) {
          stepBranch = state.branch();
          generatorTranslate(
            node.step,
            scope,
            stepBranch,
            null,
            null,
            bodyUnassigned
          ).goto(getPos(node.step), function () {
            return testBranch;
          });
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
        postBranch = state.branch();
        return postBranch;
      },
      19: function (node, scope, state, _p, _p2, unassigned) {
        var bodyBranch, bodyUnassigned, getKey, gObject, index, k, keys, length,
            postBranch, stepBranch, testBranch, tKey, v;
        if (node.label != null) {
          throw Error("Not implemented: for-in with label in generator");
        }
        tKey = translate(node.key, scope, "leftExpression");
        if (unassigned && node.key instanceof ParserNode.Ident) {
          unassigned[node.key.name] = false;
        }
        gObject = generatorTranslateExpression(node.object, scope, state, false);
        state = gObject.state;
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
        state = state.add(function () {
          return ast.Block(getPos(node), [
            ast.Assign(getPos(node), keys, ast.Call(
              getPos(node),
              ast.Ident(getPos(node), "__allkeys"),
              [__first(gObject.tNode(), gObject.cleanup())]
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
          node.body,
          scope,
          state,
          function () {
            return postBranch;
          },
          function () {
            return stepBranch;
          },
          bodyUnassigned
        ).goto(getPos(node.body), function () {
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
        postBranch = stepBranch.branch();
        return postBranch;
      },
      22: function (node, scope, state, breakState, continueState, unassigned) {
        var k, postBranch, ret, test, tWhenFalse, tWhenTrue, v, whenFalseBranch,
            whenFalseUnassigned, whenTrueBranch;
        test = generatorTranslateExpression(node.test, scope, state, state.hasGeneratorNode(node.test));
        state = test.state;
        whenFalseUnassigned = unassigned && __import({}, unassigned);
        if (state.hasGeneratorNode(node.whenTrue) || state.hasGeneratorNode(node.whenFalse)) {
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
          if (node.whenTrue && !(node.whenTrue instanceof ParserNode.Nothing)) {
            whenTrueBranch = state.branch();
          }
          if (whenTrueBranch) {
            generatorTranslate(
              node.whenTrue,
              scope,
              whenTrueBranch,
              breakState,
              continueState,
              unassigned
            ).goto(getPos(node.whenTrue), function () {
              return postBranch;
            });
          }
          if (node.whenFalse && !(node.whenFalse instanceof ParserNode.Nothing)) {
            whenFalseBranch = state.branch();
          }
          if (whenFalseBranch) {
            generatorTranslate(
              node.whenFalse,
              scope,
              whenFalseBranch,
              breakState,
              continueState,
              whenFalseUnassigned
            ).goto(getPos(node.whenFalse), function () {
              return postBranch;
            });
          }
          postBranch = state.branch();
          ret = postBranch;
        } else {
          tWhenTrue = translate(node.whenTrue, scope, "statement", unassigned);
          tWhenFalse = translate(node.whenFalse, scope, "statement", whenFalseUnassigned);
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
      },
      33: function (node, scope, state, _p, continueState, unassigned) {
        var _arr, _f, _len, baseUnassigned, bodyStates, currentUnassigned,
            defaultBranch, defaultCase, gDefaultBody, gNode, i, k, postBranch,
            resultCases, v;
        if (node.label != null) {
          throw Error("Not implemented: switch with label in generator");
        }
        gNode = generatorTranslateExpression(node.node, scope, state, false);
        bodyStates = [];
        resultCases = [];
        gNode.state.add(function () {
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
        gNode.state.add(function () {
          return ast.Break(getPos(node));
        });
        baseUnassigned = unassigned && __import({}, unassigned);
        currentUnassigned = unassigned && __import({}, unassigned);
        for (_arr = __toArray(node.cases), i = 0, _len = _arr.length, _f = function (case_, i) {
          var caseBranch, gCaseBody, k, tCaseNode, tGoto, v;
          if (state.hasGeneratorNode(case_.node)) {
            throw Error("Cannot use yield in the check of a switch's case");
          }
          tCaseNode = translate(case_.node, scope, "expression", currentUnassigned);
          caseBranch = gNode.state.branch();
          bodyStates[i] = caseBranch;
          gCaseBody = generatorTranslate(
            case_.body,
            scope,
            caseBranch,
            function () {
              return postBranch;
            },
            continueState,
            currentUnassigned
          );
          gCaseBody.goto(getPos(case_.node), case_.fallthrough
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
          if (!case_.fallthrough && unassigned) {
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
        if (node.defaultCase != null) {
          defaultBranch = gNode.state.branch();
          gDefaultBody = generatorTranslate(
            node.defaultCase,
            scope,
            defaultBranch,
            function () {
              return postBranch;
            },
            continueState,
            currentUnassigned
          );
          gDefaultBody.goto(getPos(node.defaultCase), function () {
            return postBranch;
          });
          defaultCase = defaultBranch.makeGoto(getPos(node.defaultCase), function () {
            return defaultBranch;
          });
        } else {
          defaultCase = gNode.state.makeGoto(getPos(node), function () {
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
        postBranch = state.branch();
        return postBranch;
      },
      41: function (node, scope, state, breakState, continueState, unassigned, isTop) {
        var _arr, _i, result, tmp;
        result = generatorTranslate(
          node.node,
          scope,
          state,
          breakState,
          continueState,
          unassigned,
          isTop
        );
        for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
          tmp = _arr[_i];
          scope.releaseTmp(tmp);
        }
        return result;
      },
      42: function (node, scope, state, breakState, continueState, unassigned) {
        var postBranch;
        if (node.label != null) {
          throw Error("Not implemented: try-catch with label in generator");
        }
        state = state.enterTryCatch(getPos(node));
        state = generatorTranslate(
          node.tryBody,
          scope,
          state,
          breakState,
          continueState,
          unassigned
        );
        state = state.exitTryCatch(
          getPos(node.tryBody),
          translate(node.catchIdent, scope, "leftExpression"),
          function () {
            return postBranch;
          }
        );
        state = generatorTranslate(
          node.catchBody,
          scope,
          state,
          breakState,
          continueState,
          unassigned
        );
        state.goto(getPos(node), function () {
          return postBranch;
        });
        postBranch = state.branch();
        return postBranch;
      },
      43: function (node, scope, state, breakState, continueState, unassigned) {
        var tFinally;
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
        if (state.hasGeneratorNode(node.finallyBody)) {
          throw Error("Cannot use yield in a finally");
        }
        state = state.pendingFinally(getPos(node), function () {
          return tFinally();
        });
        state = generatorTranslate(
          node.tryBody,
          scope,
          state,
          breakState,
          continueState,
          unassigned
        );
        tFinally = translate(node.finallyBody, scope, "statement", unassigned);
        return state.runPendingFinally(getPos(node));
      }
    };
    function generatorTranslateLispy(node, scope, state, breakState, continueState, unassigned, isTop) {
      var args, func, gNode, mutatedNode;
      if (node.isCall) {
        func = node.func;
        args = node.args;
        if (func.isInternal) {
          if (func.isBreak) {
            if (args[0]) {
              throw Error("Not implemented: break with label in a generator");
            }
            if (breakState == null) {
              throw Error("break found outside of a loop or switch");
            }
            state.goto(getPos(node), breakState);
            return state;
          } else if (func.isContinue) {
            if (args[0]) {
              throw Error("Not implemented: continue with label in a generator");
            }
            if (continueState == null) {
              throw Error("continue found outside of a loop");
            }
            state.goto(getPos(node), continueState);
            return state;
          } else if (func.isThrow) {
            gNode = generatorTranslateExpression(args[0], scope, state, false);
            return gNode.state.add(function () {
              return ast.Throw(getPos(node), __first(gNode.tNode(), gNode.cleanup()));
            });
          } else if (func.isYield) {
            gNode = generatorTranslateExpression(args[0], scope, state, false);
            return gNode.state["yield"](getPos(node), function () {
              var _ref;
              _ref = gNode.tNode();
              gNode.cleanup();
              return _ref;
            });
          } else if (func.isReturn) {
            mutatedNode = args[0].mutateLast(
              null,
              function (n) {
                return LispyNode.InternalCall("return", n.index, n.scope, n);
              },
              null,
              true
            );
            if (mutatedNode instanceof LispyNode && mutatedNode.isCall && mutatedNode.func.isReturn && mutatedNode.args[0] === args[0]) {
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
                  null,
                  null,
                  unassigned
                );
              }
            } else {
              return generatorTranslate(
                mutatedNode,
                scope,
                state,
                null,
                null,
                unassigned
              );
            }
          } else {
            throw Error("Unhandled value in switch");
          }
        } else {
          throw Error("wat");
        }
      } else {
        throw Error("Unhandled value in switch");
      }
    }
    return function (node, scope, state, breakState, continueState, unassigned, isTop) {
      var key, ret;
      if (state.hasGeneratorNode(node)) {
        if (node instanceof LispyNode) {
          return generatorTranslateLispy(
            node,
            scope,
            state,
            breakState,
            continueState,
            unassigned,
            isTop
          );
        }
        key = node.typeId;
        if (__owns.call(statements, key)) {
          ret = statements[key](
            node,
            scope,
            state,
            breakState,
            continueState,
            unassigned,
            isTop
          );
          if (!(ret instanceof GeneratorState)) {
            throw Error("Translated non-GeneratorState from " + __typeof(node) + ": " + __typeof(ret));
          }
          return ret;
        } else {
          ret = generatorTranslateExpression(node, scope, state);
          return ret.state.add(function () {
            var _ref;
            _ref = ret.tNode();
            ret.cleanup();
            return _ref;
          });
        }
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
      if (element instanceof ParserNode.Spread) {
        translatedItems.push({
          tNode: translate(element.node, scope, "expression", unassigned),
          type: element.node.type()
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
          if (translatedItem.length > 0) {
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
    1: function (node, scope, location, unassigned) {
      var tChild, tParent;
      tParent = translate(node.parent, scope, "expression", unassigned);
      tChild = translate(node.child, scope, "expression", unassigned);
      return function () {
        return ast.Access(getPos(node), tParent(), tChild());
      };
    },
    4: function (node, scope, location, unassigned) {
      var tArr;
      tArr = arrayTranslate(
        getPos(node),
        node.elements,
        scope,
        true,
        unassigned
      );
      return function () {
        return tArr();
      };
    },
    5: function (node, scope, location, unassigned) {
      var op, tLeft, tRight;
      op = node.op;
      tLeft = translate(node.left, scope, "leftExpression");
      tRight = translate(node.right, scope, "expression", unassigned);
      if (unassigned && node.left instanceof ParserNode.Ident) {
        if (op === "=" && unassigned[node.left.name] && !unassigned["\u0000"] && node.right.isConst() && node.right.constValue() === void 0) {
          return function () {
            return ast.Noop(getPos(node));
          };
        }
        unassigned[node.left.name] = false;
      }
      return function () {
        var left, right;
        left = tLeft();
        right = tRight();
        if (op === "=" && location === "topStatement" && left instanceof ast.Ident && right instanceof ast.Func && right.name == null && scope.hasOwnVariable(left) && !scope.isVariableMutable(left)) {
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
          return ast.Binary(getPos(node), left, op, right);
        }
      };
    },
    6: function (node, scope, location, unassigned) {
      var tLeft, tRight;
      tLeft = translate(node.left, scope, "expression", unassigned);
      tRight = translate(node.right, scope, "expression", unassigned);
      return function () {
        return ast.Binary(getPos(node), tLeft(), node.op, tRight());
      };
    },
    7: function (node, scope, location, unassigned) {
      var _arr, _arr2, i, len, subnode, tLabel, tNodes;
      tLabel = node.label && translate(node.label, scope, "label");
      for (_arr = [], _arr2 = __toArray(node.nodes), i = 0, len = _arr2.length; i < len; ++i) {
        subnode = _arr2[i];
        _arr.push(translate(subnode, scope, location, unassigned));
      }
      tNodes = _arr;
      return function () {
        return ast.Block(
          getPos(node),
          (function () {
            var _arr, _i, _len, tNode;
            for (_arr = [], _i = 0, _len = tNodes.length; _i < _len; ++_i) {
              tNode = tNodes[_i];
              _arr.push(tNode());
            }
            return _arr;
          }()),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    9: function (node, scope, location, unassigned) {
      var args, isApply, isNew, tArgArray, tFunc, tStart;
      tFunc = translate(node.func, scope, "expression", unassigned);
      isApply = node.isApply;
      isNew = node.isNew;
      args = node.args;
      if (isApply && (args.length === 0 || !(args[0] instanceof ParserNode.Spread))) {
        if (args.length === 0) {
          tStart = function () {
            return ast.Const(getPos(node), void 0);
          };
        } else {
          tStart = translate(args[0], scope, "expression", unassigned);
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
            return ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "call"),
              [start].concat(__toArray(argArray.elements))
            );
          } else {
            return ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "apply"),
              [start, argArray]
            );
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
              return ast.Call(
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
              );
            }));
          } else if (argArray instanceof ast.Arr) {
            return ast.Call(getPos(node), func, argArray.elements, isNew);
          } else if (isNew) {
            scope.addHelper("__new");
            return ast.Call(
              getPos(node),
              ast.Access(
                getPos(node),
                ast.Ident(getPos(node), "__new"),
                ast.Const(getPos(node), "apply")
              ),
              [func, argArray]
            );
          } else if (func instanceof ast.Binary && func.op === ".") {
            return scope.maybeCache(func.left, Type["function"], (_once2 = false, function (setParent, parent) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              return ast.Call(
                getPos(node),
                ast.Access(getPos(node), setParent, func.right, "apply"),
                [parent, argArray]
              );
            }));
          } else {
            return ast.Call(
              getPos(node),
              ast.Access(getPos(node), func, "apply"),
              [
                ast.Const(getPos(node), void 0),
                argArray
              ]
            );
          }
        };
      }
    },
    11: function (node, scope, location) {
      return function () {
        return ast.Comment(getPos(node), node.text);
      };
    },
    15: function (node, scope, location) {
      throw Error("Cannot have a stray def");
    },
    16: function (node, scope, location, unassigned) {
      var innerScope, tText, wrapped;
      if (node.text.isStatement()) {
        innerScope = node.text.scope.clone();
        wrapped = ParserNode.Call(
          node.text.index,
          node.text.scope,
          ParserNode.Function(
            node.text.index,
            innerScope,
            [],
            node.text.rescope(innerScope),
            true,
            true
          ),
          []
        );
      } else {
        wrapped = node.text;
      }
      tText = translate(wrapped, scope, "expression", unassigned);
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
    17: function (node, scope, location, unassigned) {
      var tCode;
      tCode = translate(node.code, scope, "expression", unassigned);
      return function () {
        return ast.Eval(getPos(node), tCode());
      };
    },
    18: function (node, scope, location, unassigned) {
      var bodyUnassigned, tBody, tInit, tLabel, tStep, tTest;
      tLabel = node.label && translate(node.label, scope, "label");
      if (node.init != null) {
        tInit = translate(node.init, scope, "expression", unassigned);
      }
      bodyUnassigned = unassigned && { "\u0000": true };
      if (node.test != null) {
        tTest = translate(node.test, scope, "expression", bodyUnassigned);
      }
      tBody = translate(node.body, scope, "statement", bodyUnassigned);
      if (node.step != null) {
        tStep = translate(node.step, scope, "expression", bodyUnassigned);
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
          tBody(),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    19: function (node, scope, location, unassigned) {
      var bodyUnassigned, tBody, tKey, tLabel, tObject;
      tLabel = node.label && translate(node.label, scope, "label");
      tKey = translate(node.key, scope, "leftExpression");
      if (unassigned && node.key instanceof ParserNode.Ident) {
        unassigned[node.key.name] = false;
      }
      tObject = translate(node.object, scope, "expression", unassigned);
      bodyUnassigned = unassigned && { "\u0000": true };
      tBody = translate(node.body, scope, "statement", bodyUnassigned);
      if (unassigned) {
        __import(unassigned, bodyUnassigned);
      }
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
    20: (function () {
      var primitiveTypes, translateParamTypes, translateType,
          translateTypeChecks;
      primitiveTypes = { Boolean: "boolean", String: "string", Number: "number", Function: "function" };
      translateTypeChecks = {
        21: function (node) {
          if (__owns.call(primitiveTypes, node.name)) {
            return Type[primitiveTypes[node.name]];
          } else {
            return Type.any;
          }
        },
        1: function (node) {
          return Type.any;
        },
        47: function (node) {
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
        44: function (node) {
          return Type["function"];
        },
        45: function (node) {
          if (node.basetype.name === "Array") {
            return translateTypeCheck(node.args[0]).array();
          } else if (node.basetype.name === "Function") {
            return Type["function"];
          } else {
            return Type.any;
          }
        },
        46: function (node) {
          var _arr, _i, _len, _ref, key, typeData, value;
          typeData = {};
          for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            _ref = _arr[_i];
            key = _ref.key;
            value = _ref.value;
            if (key instanceof ParserNode.Const) {
              typeData[key.value] = translateTypeCheck(value);
            }
          }
          return Type.makeObject(typeData);
        }
      };
      function translateTypeCheck(node) {
        if (!__owns.call(translateTypeChecks, node.typeId)) {
          throw Error("Unknown type: " + String(__typeof(node)));
        }
        return translateTypeChecks[node.typeId](node);
      }
      translateParamTypes = {
        27: function (param, scope, inner) {
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
        type = param.typeId;
        if (!__owns.call(translateParamTypes, type)) {
          throw Error("Unknown parameter type: " + __typeof(param));
        }
        return translateParamTypes[type](param, scope, inner);
      }
      translateType = (function () {
        var translateTypes;
        translateTypes = {
          21: (function () {
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
                throw Error("Not implemented: custom type " + node.name);
              }
              return primordialTypes[node.name];
            };
          }()),
          45: function (node, scope) {
            var _arr, _arr2, _i, _len, arg, args, base;
            base = translateType(node.basetype, scope);
            for (_arr = [], _arr2 = __toArray(node.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              arg = _arr2[_i];
              _arr.push(translateType(arg, scope));
            }
            args = _arr;
            return Type.generic.apply(Type, [base].concat(__toArray(args)));
          },
          47: function (node, scope) {
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
          if (node instanceof LispyNode && node.isValue) {
            switch (node.value) {
            case null: return Type["null"];
            case void 0: return Type["undefined"];
            default: throw Error("Unexpected Value type: " + String(node.value));
            }
          }
          if (!__owns.call(translateTypes, node.typeId)) {
            throw Error("Unknown type to translate: " + __typeof(node));
          }
          return translateTypes[node.typeId](node, scope);
        };
      }());
      return function (node, scope, location) {
        return function () {
          var _arr, _ref, body, fakeThis, i, initializers, innerScope, len, p,
              param, paramIdents, realInnerScope, unassigned, wrap;
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
          _ref = translateFunctionBody(
            getPos(node),
            node.generator,
            innerScope,
            node.autoReturn ? LispyNode.InternalCall("return", node.body.index, node.body.scope, node.body) : node.body,
            unassigned
          );
          body = _ref.body;
          wrap = _ref.wrap;
          innerScope.releaseTmps();
          body = ast.Block(getPos(node.body), __toArray(initializers).concat([body]));
          if (innerScope.usedThis || node.bound instanceof ParserNode) {
            if (node.bound instanceof ParserNode) {
              fakeThis = ast.Ident(getPos(node.body), "_this");
              innerScope.addVariable(fakeThis);
              body = ast.Block(getPos(node.body), [
                ast.Assign(getPos(node.body), fakeThis, translate(node.bound, scope, "expression", unassigned)()),
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
    }()),
    21: function (node, scope, location) {
      var name;
      name = node.name;
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
    },
    22: function (node, scope, location, unassigned) {
      var innerLocation, k, tLabel, tTest, tWhenFalse, tWhenTrue, v,
          whenFalseUnassigned;
      if (location === "statement" || location === "topStatement") {
        innerLocation = "statement";
      } else {
        innerLocation = location;
      }
      tLabel = node.label && translate(node.label, scope, "label");
      tTest = translate(node.test, scope, "expression", unassigned);
      whenFalseUnassigned = unassigned && __import({}, unassigned);
      tWhenTrue = translate(node.whenTrue, scope, innerLocation, unassigned);
      if (node.whenFalse != null) {
        tWhenFalse = translate(node.whenFalse, scope, innerLocation, whenFalseUnassigned);
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
    25: function (node) {
      return function () {
        return ast.Noop(getPos(node));
      };
    },
    26: function (node, scope, location, unassigned) {
      var _arr, _i, _len, pair, properties, tKeys, tPrototype, tValues;
      tKeys = [];
      tValues = [];
      properties = [];
      for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        pair = _arr[_i];
        tKeys.push(translate(pair.key, scope, "expression", unassigned));
        tValues.push(translate(pair.value, scope, "expression", unassigned));
        properties.push(pair.property);
      }
      if (node.prototype != null) {
        tPrototype = translate(node.prototype, scope, "expression", unassigned);
      } else {
        tPrototype = void 0;
      }
      return function () {
        var _len, constPairs, currentPair, currentPairs, i, ident, key,
            lastProperty, obj, postConstPairs, property, prototype, result,
            tKey, tValue, value;
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
            for (_arr = [], _i = 0, _len = constPairs.length; _i < _len; ++_i) {
              _ref = constPairs[_i];
              key = _ref.key;
              value = _ref.value;
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
              for (_arr = [], _i = 0, _len = postConstPairs.length; _i < _len; ++_i) {
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
                        : __throw(Error("Unknown property type: " + String(property)))
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
    },
    28: function (node, scope, location, unassigned) {
      var tSource;
      tSource = translate(node.source, scope, "expression", unassigned);
      return function () {
        var flags, source;
        source = tSource();
        flags = node.flags;
        if (source.isConst()) {
          return ast.Regex(getPos(node), String(source.constValue()), flags);
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
      };
    },
    33: function (node, scope, location, unassigned) {
      var _arr, _arr2, _i, _len, baseUnassigned, case_, currentUnassigned, k,
          newCase, tCases, tDefaultCase, tLabel, tNode, v;
      tLabel = node.label && translate(node.label, scope, "label");
      tNode = translate(node.node, scope, "expression", unassigned);
      baseUnassigned = unassigned && __import({}, unassigned);
      currentUnassigned = unassigned && __import({}, baseUnassigned);
      for (_arr = [], _arr2 = __toArray(node.cases), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        case_ = _arr2[_i];
        newCase = {
          pos: getPos(case_.node),
          tNode: translate(case_.node, scope, "expression", currentUnassigned),
          tBody: translate(case_.body, scope, "statement", currentUnassigned),
          fallthrough: case_.fallthrough
        };
        if (!case_.fallthrough && unassigned) {
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
      if (node.defaultCase != null) {
        tDefaultCase = translate(node.defaultCase, scope, "statement", currentUnassigned);
      } else {
        tDefaultCase = void 0;
      }
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
          tNode(),
          (function () {
            var _arr, case_, caseBody, caseNode, i, len;
            for (_arr = [], i = 0, len = tCases.length; i < len; ++i) {
              case_ = tCases[i];
              caseNode = case_.tNode();
              caseBody = case_.tBody();
              if (!case_.fallthrough || i === len - 1 && defaultCase.isNoop()) {
                caseBody = ast.Block(case_.pos, [caseBody, ast.Break(caseBody.pos)]);
              }
              _arr.push(ast.Switch.Case(case_.pos, caseNode, caseBody));
            }
            return _arr;
          }()),
          tDefaultCase != null ? tDefaultCase() : ast.Noop(getPos(node)),
          typeof tLabel === "function" ? tLabel() : void 0
        );
      };
    },
    32: function (node, scope, location) {
      throw Error("Cannot have a stray super call");
    },
    40: function (node, scope, location) {
      var ident;
      ident = scope.getTmp(getPos(node), node.id, node.name, node.type());
      return function () {
        return ident;
      };
    },
    41: function (node, scope, location, unassigned) {
      var _arr, _i, tmp, tResult;
      tResult = translate(node.node, scope, location, unassigned);
      for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
        tmp = _arr[_i];
        scope.releaseTmp(tmp);
      }
      return tResult;
    },
    42: function (node, scope, location, unassigned) {
      var innerScope, tCatchBody, tCatchIdent, tLabel, tTryBody;
      tLabel = node.label && translate(node.label, scope, "label");
      tTryBody = translate(node.tryBody, scope, "statement", unassigned);
      innerScope = scope.clone(false);
      tCatchIdent = translate(node.catchIdent, innerScope, "leftExpression");
      tCatchBody = translate(node.catchBody, innerScope, "statement", unassigned);
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
    43: function (node, scope, location, unassigned) {
      var tFinallyBody, tLabel, tTryBody;
      tLabel = node.label && translate(node.label, scope, "label");
      tTryBody = translate(node.tryBody, scope, "statement", unassigned);
      tFinallyBody = translate(node.finallyBody, scope, "statement", unassigned);
      return function () {
        return ast.TryFinally(getPos(node), tTryBody(), tFinallyBody(), typeof tLabel === "function" ? tLabel() : void 0);
      };
    },
    48: function (node, scope, location, unassigned) {
      var _ref, tSubnode;
      if (unassigned && ((_ref = node.op) === "++" || _ref === "--" || _ref === "++post" || _ref === "--post") && node.node instanceof ParserNode.Ident) {
        unassigned[node.node.name] = false;
      }
      tSubnode = translate(node.node, scope, "expression", unassigned);
      return function () {
        return ast.Unary(getPos(node), node.op, tSubnode());
      };
    },
    49: function (node, scope, location, unassigned) {
      var tIdent;
      if (unassigned && !unassigned["\u0000"] && node.ident instanceof ParserNode.Ident && !__owns.call(unassigned, node.ident.name)) {
        unassigned[node.ident.name] = true;
      }
      tIdent = translate(node.ident, scope, "leftExpression");
      return function () {
        var ident;
        ident = tIdent();
        scope.addVariable(ident, Type.any, node.isMutable);
        return ast.Noop(getPos(node));
      };
    }
  };
  function translateLispy(node, scope, location, unassigned) {
    var args, func, mutatedNode, tLabel, tNode, tValue;
    if (node.isValue) {
      return function () {
        return ast.Const(getPos(node), node.value);
      };
    } else if (node.isIdent) {
      switch (node.name) {
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
      default: throw Error("Unhandled value in switch");
      }
    } else if (node.isCall) {
      func = node.func;
      args = node.args;
      if (func.isInternal) {
        switch (func.name) {
        case "break":
          tLabel = args[0] && translate(args[0], scope, "label");
          return function () {
            return ast.Break(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
          };
        case "continue":
          tLabel = args[0] && translate(args[0], scope, "label");
          return function () {
            return ast.Continue(getPos(node), typeof tLabel === "function" ? tLabel() : void 0);
          };
        case "debugger":
          return function () {
            return ast.Debugger(getPos(node));
          };
        case "throw":
          tNode = translate(args[0], scope, "expression", unassigned);
          return function () {
            return ast.Throw(getPos(node), tNode());
          };
        case "return":
          if (location !== "statement" && location !== "topStatement") {
            throw Error("Expected Return in statement position");
          }
          mutatedNode = args[0].mutateLast(
            null,
            function (n) {
              return LispyNode.InternalCall("return", n.index, n.scope, n);
            },
            null,
            true
          );
          if (mutatedNode instanceof LispyNode && mutatedNode.isCall && mutatedNode.func.isReturn && mutatedNode.args[0] === args[0]) {
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
        default: throw Error("Unhandled value in switch");
        }
      } else {
        throw Error("wat");
      }
    } else {
      throw Error("Unhandled value in switch");
    }
  }
  function translate(node, scope, location, unassigned) {
    var ret;
    if (node instanceof LispyNode) {
      return translateLispy(node, scope, location, unassigned);
    }
    if (!__owns.call(translators, node.typeId)) {
      throw Error("Unable to translate unknown node type: " + __typeof(node));
    }
    ret = translators[node.typeId](node, scope, location, unassigned);
    if (typeof ret !== "function") {
      throw Error("Translated non-function: " + __typeof(ret));
    }
    return ret;
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
      return makePos(pos.line, pos.column, node.file);
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
        fakeThis, helper, ident, init, innerScope, name, noPos, ret, rootPos,
        walker;
    if (!__isArray(roots)) {
      roots = [roots];
    }
    if (!__isArray(getPosition)) {
      getPosition = [getPosition];
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
        return ast.Block(body.pos, __toArray(commentsBody.comments).concat([
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
      if (!(roots[0] instanceof ParserNode.Root)) {
        throw Error("Cannot translate non-Root object");
      }
      if (roots[0].isGenerator) {
        innerScope = innerScope.clone(true);
      }
      rootPos = getPos(roots[0]);
      ret = translateFunctionBody(rootPos, roots[0].isGenerator, innerScope, scope.options["return"] || scope.options["eval"] ? LispyNode.InternalCall("return", roots[0].body.index, roots[0].body.scope, roots[0].body) : roots[0].body);
      if (!(_ref = ret.body.pos).file) {
        _ref.file = rootPos.file;
      }
      getPos = null;
      body = handleEmbedded(ret.body, ret.wrap, innerScope);
    } else {
      body = ast.Block(noPos, (function () {
        var _arr, _arr2, _len, _ref, bodyScope, comments, i, ret, root,
            rootBody, rootPos;
        for (_arr = [], _arr2 = __toArray(roots), i = 0, _len = _arr2.length; i < _len; ++i) {
          root = _arr2[i];
          getPos = makeGetPos(getPosition[i]);
          if (!(root instanceof ParserNode.Root)) {
            throw Error("Cannot translate non-Root object");
          }
          bodyScope = innerScope.clone(root.isGenerator);
          ret = translateFunctionBody(getPos(root), root.isGenerator, bodyScope, root.body);
          if (!(_ref = ret.body.pos).file) {
            _ref.file = rootPos.file;
          }
          rootPos = getPos(root);
          getPos = null;
          _ref = splitComments(ret.body);
          comments = _ref.comments;
          rootBody = _ref.body;
          _arr.push(ast.Block(rootPos, __toArray(comments).concat([
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
        ast.Block(body.pos, __toArray(comments).concat(__toArray(bareInit), __toArray(init), [body])),
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
            ast.Block(body.pos, __toArray(init).concat([body])),
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
    getPos = null;
    return { helper: helper, dependencies: dependencies };
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
