(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __import, __indexOfIdentical, __isArray, __iter, __name, __num, __owns, __slice, __strnum, __throw, __toArray, __typeof, _ref, ast, AstNode, Cache, GeneratorBuilder, GeneratorState, generatorTranslate, MacroHolder, Map, ParserNode, Scope, translators, Type;
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
        if (index === -1) {
          return;
        } else {
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
        var _arr, _e, _i, _send, _state, _step, _this, key;
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
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
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
          "throw": function (e) {
            _close();
            throw e;
          }
        };
      };
      _Map_prototype.values = function () {
        var _arr, _e, _i, _send, _state, _step, _this, value;
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
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
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
          "throw": function (e) {
            _close();
            throw e;
          }
        };
      };
      _Map_prototype.items = function () {
        var _arr, _e, _send, _state, _step, _this, i, key, values;
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
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
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
          "throw": function (e) {
            _close();
            throw e;
          }
        };
      };
      _Map_prototype.iterator = Map.prototype.items;
      return Map;
    }()));
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
  function makeHasGeneratorNode() {
    var inLoopCache, inSwitchCache, normalCache, returnFreeCache;
    inLoopCache = Cache.generic(ParserNode, Boolean)();
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
        if (node instanceof ParserNode.Yield || node instanceof ParserNode.Return) {
          return true;
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
              return true;
            } else {
              throw e;
            }
          }
        }
        return false;
      }));
    }
    inSwitchCache = Cache.generic(ParserNode, Boolean)();
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
        }
        return false;
      }));
    }
    returnFreeCache = Cache.generic(ParserNode, Boolean)();
    normalCache = Cache.generic(ParserNode, Boolean)();
    function hasGeneratorNode(node, allowReturn) {
      var _once;
      if (!(node instanceof ParserNode)) {
        throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
      }
      if (allowReturn == null) {
        allowReturn = false;
      } else if (typeof allowReturn !== "boolean") {
        throw TypeError("Expected allowReturn to be a Boolean, got " + __typeof(allowReturn));
      }
      return (allowReturn ? returnFreeCache : normalCache).getOrAdd(node, (_once = false, function (node) {
        var _ref, FOUND;
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
        if (node instanceof ParserNode.Yield || node instanceof ParserNode.Continue || node instanceof ParserNode.Break || !allowReturn && node instanceof ParserNode.Return) {
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
    return __strnum(Math.random().toString(36).slice(2)) + "-" + __strnum(new Date().getTime());
  }
  GeneratorState = (function () {
    var _GeneratorState_prototype;
    function GeneratorState(builder) {
      var _this;
      _this = this instanceof GeneratorState ? this : __create(_GeneratorState_prototype);
      if (!(builder instanceof GeneratorBuilder)) {
        throw TypeError("Expected builder to be a " + __name(GeneratorBuilder) + ", got " + __typeof(builder));
      }
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
      if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be a Function, got " + __typeof(tNode));
      }
      this.nodes.push(tNode);
      return this;
    };
    _GeneratorState_prototype.branch = function () {
      var _ref, state;
      state = GeneratorState(this.builder);
      if (this.builder.currentCatch.length) {
        (_ref = this.builder.currentCatch)[__num(_ref.length) - 1].push(state);
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tState !== "function") {
        throw TypeError("Expected tState to be a Function, got " + __typeof(tState));
      }
      if (includeBreak == null) {
        includeBreak = false;
      } else if (typeof includeBreak !== "boolean") {
        throw TypeError("Expected includeBreak to be a Boolean, got " + __typeof(includeBreak));
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
        if (caseId instanceof ast.Const && typeof caseId.value === "number" && caseId.value === __num(_this.caseId()) + 1) {
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be a Function, got " + __typeof(tNode));
      }
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (tNode == null) {
        tNode = null;
      } else if (typeof tNode !== "function") {
        throw TypeError("Expected tNode to be one of Function or null, got " + __typeof(tNode));
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
          return ast.Return(pos, ast.Obj(pos, [
            ast.Obj.Pair(pos, "done", ast.Const(pos, true)),
            ast.Obj.Pair(pos, "value", tNode())
          ]));
        });
      }
    };
    _GeneratorState_prototype.getRedirect = function () {
      return this.builder.getRedirect(this);
    };
    function getCaseId(pos, value) {
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tState !== "function") {
        throw TypeError("Expected tState to be a Function, got " + __typeof(tState));
      }
      if (preventRedirect == null) {
        preventRedirect = false;
      } else if (typeof preventRedirect !== "boolean") {
        throw TypeError("Expected preventRedirect to be a Boolean, got " + __typeof(preventRedirect));
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tFinallyBody !== "function") {
        throw TypeError("Expected tFinallyBody to be a Function, got " + __typeof(tFinallyBody));
      }
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      this.nodes.push(function () {
        return ast.Call(pos, ast.Call(pos, ast.Access(pos, _this.builder.pendingFinalliesIdent, "pop")));
      });
      return this;
    };
    _GeneratorState_prototype.enterTryCatch = function (pos) {
      var fresh;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      fresh = this.noop(pos);
      this.builder.enterTryCatch(fresh);
      return fresh;
    };
    _GeneratorState_prototype.exitTryCatch = function (pos, tIdent, tPostState) {
      var fresh;
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      if (typeof tIdent !== "function") {
        throw TypeError("Expected tIdent to be a Function, got " + __typeof(tIdent));
      }
      if (typeof tPostState !== "function") {
        throw TypeError("Expected tPostState to be a Function, got " + __typeof(tPostState));
      }
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
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      _this.scope = scope;
      if (typeof hasGeneratorNode !== "function") {
        throw TypeError("Expected hasGeneratorNode to be a Function, got " + __typeof(hasGeneratorNode));
      }
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
      _this.stateIdent = typeof stateIdent !== "undefined" && stateIdent !== null ? stateIdent : scope.reserveIdent(pos, "state", Type.number);
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
      if (!(fromState instanceof GeneratorState)) {
        throw TypeError("Expected fromState to be a " + __name(GeneratorState) + ", got " + __typeof(fromState));
      }
      if (typeof toState !== "function") {
        throw TypeError("Expected toState to be a Function, got " + __typeof(toState));
      }
      this.redirects.set(fromState, toState);
    };
    _GeneratorBuilder_prototype.getRedirect = function (fromState) {
      var redirect, redirectFunc;
      if (!(fromState instanceof GeneratorState)) {
        throw TypeError("Expected fromState to be a " + __name(GeneratorState) + ", got " + __typeof(fromState));
      }
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
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
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
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
      this.currentCatch.push([state]);
    };
    _GeneratorBuilder_prototype.exitTryCatch = function (state, tIdent) {
      var catchStates, index;
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
      if (typeof tIdent !== "function") {
        throw TypeError("Expected tIdent to be a Function, got " + __typeof(tIdent));
      }
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
    _GeneratorBuilder_prototype.create = function () {
      var _this, body, catches, close, err, f, innerScope, send, sendTryCatch, stateIdent, step;
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
      body.push(ast.Func(
        this.pos,
        step,
        [this.receivedIdent],
        [],
        ast.While(this.pos, true, ast.Switch(
          this.pos,
          stateIdent,
          (function () {
            var _arr, _arr2, _arr3, _arr4, _i, _i2, _len, _len2, nodes, state, tNode;
            for (_arr = [], _arr2 = __toArray(_this.statesOrder), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              state = _arr2[_i];
              if (!_this.redirects.has(state)) {
                for (_arr3 = [], _arr4 = __toArray(state.nodes), _i2 = 0, _len2 = _arr4.length; _i2 < _len2; ++_i2) {
                  tNode = _arr4[_i2];
                  _arr3.push(tNode());
                }
                nodes = _arr3;
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
      sendTryCatch = ast.TryCatch(
        this.pos,
        ast.Return(this.pos, ast.Call(this.pos, step, [this.receivedIdent])),
        err,
        (function () {
          var _arr, _f, _i, current;
          current = ast.Block(_this.pos, [
            ast.Call(_this.pos, close, []),
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
                  if (!_this.redirects.has(state)) {
                    _arr.push(ast.Binary(_this.pos, stateIdent, "===", ast.Const(_this.pos, state.caseId())));
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
      );
      body.push(ast.Func(
        this.pos,
        send,
        [this.receivedIdent],
        [],
        catches.length ? ast.While(this.pos, true, sendTryCatch) : sendTryCatch
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
          ast.Block(this.pos, [
            ast.Call(this.pos, close, []),
            ast.Throw(this.pos, ast.Ident(this.pos, "e"))
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
    function handleAssign(assignTo, scope, state, tNode, cleanup) {
      var nodeNeedsCaching, tAssignTo, tTmp;
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
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
    function generatorArrayTranslate(pos, elements, scope, state, assignTo) {
      var _arr, _f, _len, i, tArrayStart, tTmp;
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
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
              var _ref, tmp;
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
                    [(_ref = expr.tNode(), expr.cleanup(), _ref)]
                  )
                ]
              );
            });
          } else {
            expr = generatorTranslateExpression(element, scope, state, false);
            return state = expr.state.add(function () {
              var _ref;
              return ast.Call(
                getPos(element),
                ast.Access(getPos(element), tTmp(), ast.Const(getPos(element), "push")),
                [(_ref = expr.tNode(), expr.cleanup(), _ref)]
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
      Access: function (node, scope, state, assignTo) {
        var gChild, gParent;
        gParent = generatorTranslateExpression(node.parent, scope, state, true);
        gChild = generatorTranslateExpression(node.child, scope, gParent.state, false);
        return handleAssign(assignTo, scope, gChild.state, function () {
          var _ref;
          _ref = ast.Access(getPos(node), gParent.tNode(), gChild.tNode());
          gParent.cleanup();
          gChild.cleanup();
          return _ref;
        });
      },
      Array: function (node, scope, state, assignTo) {
        return generatorArrayTranslate(
          getPos(node),
          node.elements,
          scope,
          state,
          assignTo
        );
      },
      Assign: function (node, scope, state, assignTo) {
        var gChild, gLeft, gParent, gRight, left;
        left = node.left;
        if (left instanceof ParserNode.Access) {
          gParent = generatorTranslateExpression(left.parent, scope, state, true);
          gChild = generatorTranslateExpression(left.child, scope, gParent.state, true);
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
          gLeft = {
            state: state,
            tNode: translate(node.left, scope, "leftExpression"),
            cleanup: doNothing
          };
        }
        gRight = generatorTranslateExpression(node.right, scope, gLeft.state, gLeft.tNode);
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
      Binary: (function () {
        var lazyOps;
        lazyOps = {
          "&&": function (node, scope, state, assignTo) {
            var gLeft, gRight, postBranch, tNode, whenTrueBranch;
            gLeft = generatorTranslateExpression(node.left, scope, state, assignTo || true);
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
            gRight = generatorTranslateExpression(node.right, scope, whenTrueBranch, tNode);
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
          "||": function (node, scope, state, assignTo) {
            var gLeft, gRight, postBranch, tNode, whenFalseBranch;
            gLeft = generatorTranslateExpression(node.left, scope, state, assignTo || true);
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
            gRight = generatorTranslateExpression(node.right, scope, whenFalseBranch, tNode);
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
        return function (node, scope, state, assignTo) {
          var gLeft, gRight;
          if (__owns.call(lazyOps, node.op)) {
            return lazyOps[node.op](node, scope, state, assignTo);
          } else {
            gLeft = generatorTranslateExpression(node.left, scope, state, true);
            gRight = generatorTranslateExpression(node.right, scope, gLeft.state, false);
            return handleAssign(assignTo, scope, gRight.state, function () {
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
      Block: function (node, scope, state, assignTo) {
        var _arr, i, len, result, subnode;
        for (_arr = __toArray(node.nodes), i = 0, len = _arr.length; i < len; ++i) {
          subnode = _arr[i];
          result = generatorTranslateExpression(subnode, scope, state, i === len - 1 && assignTo);
          state = result.state;
          if (i === len - 1) {
            return result;
          }
        }
        throw Error("Unreachable state");
      },
      Call: function (node, scope, state, assignTo) {
        var args, gArgs, gFunc, gStart, isApply, isNew;
        gFunc = generatorTranslateExpression(node.func, scope, state, true);
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
            gStart = generatorTranslateExpression(args[0], scope, gFunc.state, true);
          }
          gArgs = generatorArrayTranslate(
            getPos(node),
            __slice.call(args, 1),
            scope,
            gStart.state
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
          gArgs = generatorArrayTranslate(getPos(node), args, scope, gFunc.state);
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
      EmbedWrite: function (node, scope, state, assignTo) {
        var gText;
        gText = generatorTranslateExpression(node.text, scope, state, false);
        return handleAssign(
          assignTo,
          scope,
          gText.state,
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
      Eval: function (node, scope, state, assignTo) {
        var gCode;
        gCode = generatorTranslateExpression(node.code, scope, state, false);
        return handleAssign(assignTo, scope, gCode.state, function () {
          return ast.Eval(getPos(node), gCode.tNode(), gCode.cleanup);
        });
      },
      If: function (node, scope, state, assignTo) {
        var cleanup, gWhenFalse, gWhenTrue, postBranch, test, tTmp, tWhenFalse, tWhenTrue, whenFalseBranch, whenTrueBranch;
        test = generatorTranslateExpression(node.test, scope, state, state.hasGeneratorNode(node.test));
        state = test.state;
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
          gWhenTrue = generatorTranslateExpression(node.whenTrue, scope, whenTrueBranch, tTmp);
          gWhenTrue.state.goto(getPos(node.whenTrue), function () {
            return postBranch;
          });
          whenFalseBranch = state.branch();
          gWhenFalse = generatorTranslateExpression(node.whenFalse, scope, whenFalseBranch, tTmp);
          gWhenFalse.state.goto(getPos(node.whenFalse), function () {
            return postBranch;
          });
          postBranch = state.branch();
          cleanup = makeCleanup(assignTo, scope, tTmp);
          return {
            state: postBranch,
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
          return handleAssign(assignTo, scope, state, function () {
            return ast.If(
              getPos(node),
              test.tNode(),
              (test.cleanup(), tWhenTrue()),
              tWhenFalse()
            );
          });
        }
      },
      Regexp: function (node, scope, state, assignTo) {
        var gSource;
        gSource = generatorTranslateExpression(node.source, scope, state, false);
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
      TmpWrapper: function (node, scope, state, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, state, false);
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
      Unary: function (node, scope, state, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, state, false);
        return handleAssign(assignTo, scope, gNode.state, function () {
          var _ref;
          return ast.Unary(getPos(node), node.op, (_ref = gNode.tNode(), gNode.cleanup(), _ref));
        });
      },
      Yield: function (node, scope, state, assignTo) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, state, false);
        state = state["yield"](getPos(node), gNode.tNode);
        return handleAssign(
          assignTo,
          scope,
          state,
          function () {
            return state.builder.receivedIdent;
          },
          gNode.cleanup
        );
      }
    };
    function generatorTranslateExpression(node, scope, state, assignTo) {
      var key;
      if (!(node instanceof ParserNode)) {
        throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
      }
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
      if (assignTo == null) {
        assignTo = false;
      } else if (typeof assignTo !== "boolean" && typeof assignTo !== "function") {
        throw TypeError("Expected assignTo to be one of Boolean or Function, got " + __typeof(assignTo));
      }
      key = node.constructor.cappedName;
      if (state.hasGeneratorNode(node)) {
        if (__owns.call(expressions, key)) {
          return expressions[key](node, scope, state, assignTo);
        } else {
          throw Error("Unknown expression type: " + __typeof(node));
        }
      } else {
        return handleAssign(assignTo, scope, state, translate(node, scope, "expression"));
      }
    }
    statements = {
      Block: function (node, scope, state, breakState, continueState) {
        var _arr, _i, _len, acc, subnode;
        if (node.label != null) {
          throw Error("Not implemented: block with label in generator");
        }
        acc = state;
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
      Break: function (node, scope, state, breakState) {
        if (node.label != null) {
          throw Error("Not implemented: break with label in a generator");
        }
        if (breakState == null) {
          throw Error("break found outside of a loop or switch");
        }
        state.goto(getPos(node), breakState);
        return state;
      },
      Continue: function (node, scope, state, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: break with label in a generator");
        }
        if (continueState == null) {
          throw Error("continue found outside of a loop");
        }
        state.goto(getPos(node), continueState);
        return state;
      },
      For: function (node, scope, state) {
        var bodyBranch, gTest, postBranch, stepBranch, testBranch;
        if (node.label != null) {
          throw Error("Not implemented: for with label in generator");
        }
        if (node.init != null && !(node.init instanceof ParserNode.Nothing)) {
          state = generatorTranslate(node.init, scope, state);
        }
        state.goto(getPos(node), function () {
          return testBranch;
        });
        testBranch = state.branch();
        gTest = generatorTranslateExpression(node.test, scope, testBranch, state.hasGeneratorNode(node.test));
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
          }
        ).goto(getPos(node.body), function () {
          return stepBranch || testBranch;
        });
        stepBranch = null;
        if (node.step != null && !(node.step instanceof ParserNode.Nothing)) {
          stepBranch = state.branch();
          generatorTranslate(node.step, scope, stepBranch).goto(getPos(node.step), function () {
            return testBranch;
          });
        }
        postBranch = state.branch();
        return postBranch;
      },
      ForIn: function (node, scope, state) {
        var bodyBranch, getKey, gObject, index, keys, length, postBranch, stepBranch, testBranch, tKey;
        if (node.label != null) {
          throw Error("Not implemented: for-in with label in generator");
        }
        tKey = translate(node.key, scope, "leftExpression");
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
        generatorTranslate(
          node.body,
          scope,
          state,
          function () {
            return postBranch;
          },
          function () {
            return stepBranch;
          }
        ).goto(getPos(node.body), function () {
          return stepBranch;
        });
        stepBranch = bodyBranch.branch();
        stepBranch.add(function () {
          return ast.Unary(getPos(node), "++", index);
        }).goto(getPos(node), function () {
          return testBranch;
        });
        postBranch = stepBranch.branch();
        return postBranch;
      },
      If: function (node, scope, state, breakState, continueState) {
        var postBranch, test, tWhenFalse, tWhenTrue, whenFalseBranch, whenTrueBranch;
        test = generatorTranslateExpression(node.test, scope, state, state.hasGeneratorNode(node.test));
        state = test.state;
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
              continueState
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
              continueState
            ).goto(getPos(node.whenFalse), function () {
              return postBranch;
            });
          }
          postBranch = state.branch();
          return postBranch;
        } else {
          tWhenTrue = translate(node.whenTrue, scope, "statement");
          tWhenFalse = translate(node.whenFalse, scope, "statement");
          return state.add(function () {
            return ast.If(
              getPos(node),
              test.tNode(),
              (test.cleanup(), tWhenTrue()),
              tWhenFalse()
            );
          });
        }
      },
      Return: function (node, scope, state) {
        var gNode, pos;
        pos = getPos(node);
        if (node.node.isConst() && node.node.constValue() === void 0) {
          state["return"](getPos(node));
          return state;
        } else {
          gNode = generatorTranslateExpression(node.node, scope, state, false);
          state = gNode.state;
          state["return"](getPos(node), function () {
            var _ref;
            _ref = gNode.tNode();
            gNode.cleanup();
            return _ref;
          });
          return state;
        }
      },
      Switch: function (node, scope, state, _p, continueState) {
        var _arr, _f, _len, bodyStates, defaultBranch, defaultCase, gDefaultBody, gNode, i, postBranch, resultCases;
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
        for (_arr = __toArray(node.cases), i = 0, _len = _arr.length, _f = function (case_, i) {
          var caseBranch, gCaseBody, tCaseNode, tGoto;
          if (state.hasGeneratorNode(case_.node)) {
            throw Error("Cannot use yield in the check of a switch's case");
          }
          tCaseNode = translate(case_.node, scope, "expression");
          caseBranch = gNode.state.branch();
          bodyStates[i] = caseBranch;
          gCaseBody = generatorTranslate(
            case_.body,
            scope,
            caseBranch,
            function () {
              return postBranch;
            },
            continueState
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
          return resultCases.push(function () {
            return ast.Switch.Case(getPos(case_.node), tCaseNode(), ast.Block(getPos(case_.node), [tGoto(), ast.Break(getPos(case_.node))]));
          });
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
            continueState
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
        postBranch = state.branch();
        return postBranch;
      },
      Throw: function (node, scope, state, breakState, continueState) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, state, false);
        return gNode.state.add(function () {
          var _ref;
          return ast.Throw(getPos(node), (_ref = gNode.tNode(), gNode.cleanup(), _ref));
        });
      },
      TmpWrapper: function (node, scope, state, breakState, continueState) {
        var _arr, _i, result, tmp;
        result = generatorTranslate(
          node.node,
          scope,
          state,
          breakState,
          continueState
        );
        for (_arr = __toArray(node.tmps), _i = _arr.length; _i--; ) {
          tmp = _arr[_i];
          scope.releaseTmp(tmp);
        }
        return result;
      },
      TryCatch: function (node, scope, state, breakState, continueState) {
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
          continueState
        );
        state = state.exitTryCatch(
          getPos(node.tryBody),
          translate(node.catchIdent, scope, "leftExpression", false),
          function () {
            return postBranch;
          }
        );
        state = generatorTranslate(
          node.catchBody,
          scope,
          state,
          breakState,
          continueState
        );
        state.goto(getPos(node), function () {
          return postBranch;
        });
        postBranch = state.branch();
        return postBranch;
      },
      TryFinally: function (node, scope, state, breakState, continueState) {
        if (node.label != null) {
          throw Error("Not implemented: try-finally with label in generator");
        }
        if (state.hasGeneratorNode(node.finallyBody)) {
          throw Error("Cannot use yield in a finally");
        }
        state = state.pendingFinally(getPos(node), translate(node.finallyBody, scope, "statement"));
        state = generatorTranslate(
          node.tryBody,
          scope,
          state,
          breakState,
          continueState
        );
        return state.runPendingFinally(getPos(node));
      },
      Yield: function (node, scope, state) {
        var gNode;
        gNode = generatorTranslateExpression(node.node, scope, state, false);
        return state["yield"](getPos(node), function () {
          var _ref;
          _ref = gNode.tNode();
          gNode.cleanup();
          return _ref;
        });
      }
    };
    return function (node, scope, state, breakState, continueState) {
      var key, ret;
      if (!(node instanceof ParserNode)) {
        throw TypeError("Expected node to be a " + __name(ParserNode) + ", got " + __typeof(node));
      }
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      if (!(state instanceof GeneratorState)) {
        throw TypeError("Expected state to be a " + __name(GeneratorState) + ", got " + __typeof(state));
      }
      if (state.hasGeneratorNode(node)) {
        key = node.constructor.cappedName;
        if (__owns.call(statements, key)) {
          ret = statements[key](
            node,
            scope,
            state,
            breakState,
            continueState
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
        return state.add(translate(node, scope, "statement", false));
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
              ast.Access(
                getPos(node),
                ast.Ident(getPos(node), "__new"),
                ast.Const(getPos(node), "apply")
              ),
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
          var _arr, _ref, body, fakeThis, i, initializers, innerScope, len, p, param, paramIdents, realInnerScope, unassigned, wrap;
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
          body = (_ref = translateFunctionBody(
            getPos(node),
            node.generator,
            node.autoReturn,
            innerScope,
            node.body,
            unassigned
          )).body;
          wrap = _ref.wrap;
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
          return autoReturn(wrap(ast.Func(
            getPos(node),
            null,
            paramIdents,
            innerScope.getVariables(),
            body,
            []
          )));
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
        var _len, constPairs, currentPair, currentPairs, i, ident, key, lastProperty, obj, postConstPairs, property, prototype, result, tKey, tValue, value;
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
  function translateFunctionBody(pos, isGenerator, autoReturn, scope, body, unassigned) {
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
        generatorTranslate(body, scope, builder.start).goto(pos, function () {
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
    translatedBody = translate(
      body,
      scope,
      "topStatement",
      !isSimpleGenerator && autoReturn,
      unassigned
    )();
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
  function translateRoot(roots, scope) {
    var _arr, _i, _len, _ref, bareInit, body, callFunc, comments, fakeThis, helper, ident, init, name, noPos, uncommentedBody, walker, wrap;
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
    wrap = (_ref = roots.length === 1
      ? (function () {
        var _ref, ret, rootPos;
        if (!(roots[0] instanceof ParserNode.Root)) {
          throw Error("Cannot translate non-Root object");
        }
        if (roots[0].isGenerator) {
          scope = scope.clone(true);
        }
        rootPos = getPos(roots[0]);
        ret = translateFunctionBody(
          rootPos,
          roots[0].isGenerator,
          scope.options["return"] || scope.options["eval"],
          scope,
          roots[0].body
        );
        if (!(_ref = ret.body.pos).file) {
          _ref.file = rootPos.file;
        }
        return ret;
      }())
      : {
        wrap: function (x) {
          return x;
        },
        body: ast.Block(noPos, (function () {
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
        }()))
      }).wrap;
    body = _ref.body;
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
        ast.Return(body.pos, wrap(ast.Func(
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
        )))
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
  module.exports = function (node, macros, options) {
    var endTime, result, scope, startTime;
    if (!(macros instanceof MacroHolder)) {
      throw TypeError("Expected macros to be a " + __name(MacroHolder) + ", got " + __typeof(macros));
    }
    if (options == null) {
      options = {};
    }
    startTime = new Date().getTime();
    try {
      scope = Scope(options, macros, false);
      result = translateRoot(node, scope);
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
      options.progress("translate", __num(endTime) - __num(startTime));
    }
    return { node: result, time: __num(endTime) - __num(startTime) };
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
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
