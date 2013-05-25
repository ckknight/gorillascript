(function (GLOBAL) {
  "use strict";
  var __create, __genericFunc, __getInstanceof, __in, __isArray, __isObject,
      __name, __num, __owns, __slice, __strnum, __toArray, __typeof, _ref,
      Cache, fs, inspect, path, WeakMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __genericFunc = function (numArgs, make) {
    var any, cache, result;
    cache = WeakMap();
    any = {};
    function generic() {
      var _ref, current, i, item, type;
      current = cache;
      for (i = numArgs - 1; i >= 0; --i) {
        if ((_ref = arguments[i]) != null) {
          type = _ref;
        } else {
          type = any;
        }
        item = current.get(type);
        if (item == null) {
          if (i === 0) {
            item = make.apply(this, arguments);
          } else {
            item = WeakMap();
          }
          current.set(type, item);
        }
        current = item;
      }
      return current;
    }
    result = generic();
    result.generic = generic;
    return result;
  };
  __getInstanceof = (function () {
    function isAny() {
      return true;
    }
    function isStr(x) {
      return typeof x === "string";
    }
    function isNum(x) {
      return typeof x === "number";
    }
    function isFunc(x) {
      return typeof x === "function";
    }
    function isBool(x) {
      return typeof x === "boolean";
    }
    return function (ctor) {
      if (ctor == null) {
        return isAny;
      } else {
        switch (ctor) {
        case String: return isStr;
        case Number: return isNum;
        case Function: return isFunc;
        case Boolean: return isBool;
        case Array: return __isArray;
        case Object: return __isObject;
        default:
          return function (_x) {
            return _x instanceof ctor;
          };
        }
      }
    };
  }());
  __in = typeof Array.prototype.indexOf === "function"
    ? (function () {
      var indexOf;
      indexOf = Array.prototype.indexOf;
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }())
    : function (child, parent) {
      var i, len;
      len = +parent.length;
      i = -1;
      while (++i < len) {
        if (child === parent[i] && i in parent) {
          return true;
        }
      }
      return false;
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
  WeakMap = typeof GLOBAL.WeakMap === "function" ? GLOBAL.WeakMap
    : (WeakMap = (function () {
      var _WeakMap_prototype, defProp, isExtensible;
      function WeakMap() {
        var _this;
        _this = this instanceof WeakMap ? this : __create(_WeakMap_prototype);
        _this._keys = [];
        _this._values = [];
        _this._chilly = [];
        _this._uid = createUid();
        return _this;
      }
      _WeakMap_prototype = WeakMap.prototype;
      WeakMap.displayName = "WeakMap";
      function uidRand() {
        return Math.random().toString(36).slice(2);
      }
      function createUid() {
        return __strnum(uidRand()) + "-" + __strnum(new Date().getTime()) + "-" + __strnum(uidRand()) + "-" + __strnum(uidRand());
      }
      isExtensible = Object.isExtensible || function () {
        return true;
      };
      function check(key) {
        var chilly, uid;
        uid = this._uid;
        if (__owns.call(key, uid)) {
          chilly = this._chilly;
          if (chilly.indexOf(key) === -1) {
            chilly.push(key);
            this._keys.push(key);
            this._values.push(key[uid]);
          }
        }
      }
      _WeakMap_prototype.get = function (key) {
        var _ref, index;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          if (__owns.call(key, _ref = this._uid)) {
            return key[_ref];
          }
        } else {
          check.call(this, key);
          index = this._keys.indexOf(key);
          if (index === -1) {
            return;
          } else {
            return this._values[index];
          }
        }
      };
      _WeakMap_prototype.has = function (key) {
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          return __owns.call(key, this._uid);
        } else {
          check.call(this, key);
          return this._keys.indexOf(key) !== -1;
        }
      };
      if (typeof Object.defineProperty === "function") {
        defProp = Object.defineProperty;
      } else {
        defProp = function (o, k, d) {
          o[k] = d.value;
        };
      }
      _WeakMap_prototype.set = function (key, value) {
        var index, keys;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          defProp(key, this._uid, { configurable: true, writable: true, enumerable: false, value: value });
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index === -1) {
            index = keys.length;
            keys[index] = key;
          }
          this._values[index] = value;
        }
      };
      _WeakMap_prototype["delete"] = function (key) {
        var index, keys;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          delete key[this._uid];
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index !== -1) {
            keys.splice(index, 1);
            this._values.splice(index, 1);
          }
        }
      };
      return WeakMap;
    }()));
  if ((_ref = require("util")) != null) {
    inspect = _ref.inspect;
  }
  path = require("path");
  fs = require("fs");
  function stringRepeat(text, count) {
    if (__num(count) < 1) {
      return "";
    } else if (count === 1) {
      return text;
    } else if (__num(count) & 1) {
      return __strnum(text) + __strnum(stringRepeat(text, __num(count) - 1));
    } else {
      return stringRepeat(__strnum(text) + __strnum(text), __num(count) / 2);
    }
  }
  exports.stringRepeat = stringRepeat;
  exports.padLeft = function (text, len, padding) {
    return __strnum(stringRepeat(padding, __num(len) - __num(text.length))) + __strnum(text);
  };
  exports.padRight = function (text, len, padding) {
    return __strnum(text) + __strnum(stringRepeat(padding, __num(len) - __num(text.length)));
  };
  exports.Cache = Cache = __genericFunc(2, function (TKey, TValue) {
    var _instanceof_TKey, _instanceof_TValue;
    _instanceof_TKey = __getInstanceof(TKey);
    _instanceof_TValue = __getInstanceof(TValue);
    return (function () {
      var _Cache_prototype;
      function Cache() {
        var _this;
        _this = this instanceof Cache ? this : __create(_Cache_prototype);
        _this.weakmap = WeakMap();
        return _this;
      }
      _Cache_prototype = Cache.prototype;
      Cache.displayName = "Cache<" + (TKey != null ? __name(TKey) : "") + ", " + (TValue != null ? __name(TValue) : "") + ">";
      _Cache_prototype.get = function (key) {
        if (!_instanceof_TKey(key)) {
          throw TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
        }
        return this.weakmap.get(key);
      };
      _Cache_prototype.getOrAdd = function (key, factory) {
        var value, weakmap;
        if (!_instanceof_TKey(key)) {
          throw TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
        }
        if (typeof factory !== "function") {
          throw TypeError("Expected factory to be a Function, got " + __typeof(factory));
        }
        weakmap = this.weakmap;
        value = weakmap.get(key);
        if (value === void 0) {
          value = factory(key);
          if (!_instanceof_TValue(value)) {
            throw Error("Expected factory result to be a " + __name(TValue) + ", got " + __typeof(value));
          }
          weakmap.set(key, value);
        }
        return value;
      };
      return Cache;
    }());
  });
  exports.quote = function (value) {
    if (typeof value !== "string") {
      throw TypeError("Expected value to be a String, got " + __typeof(value));
    }
    if (inspect) {
      return inspect(value);
    } else if (value.indexOf("'") === -1) {
      return "'" + __strnum(JSON.stringify(value).slice(1, -1)) + "'";
    } else {
      return JSON.stringify(value);
    }
  };
  exports.unique = function (items) {
    var _arr, _i, _len, item, result;
    result = [];
    for (_arr = __toArray(items), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (!__in(item, result)) {
        result.push(item);
      }
    }
    return result;
  };
  function findPackageJson(dir) {
    var filepath, parent;
    filepath = path.join(dir, "package.json");
    if (fs.existsSync(filepath)) {
      return filepath;
    } else {
      parent = path.normalize(path.join(dir, ".."));
      if (parent !== dir) {
        return findPackageJson(parent);
      }
    }
  }
  exports.getPackageVersion = function (filename) {
    var packageJsonFilename, version;
    if (typeof filename !== "string" || !fs || !path) {
      return "";
    }
    try {
      packageJsonFilename = findPackageJson(path.dirname(filename));
    } catch (e) {}
    if (!packageJsonFilename) {
      return "";
    }
    try {
      version = JSON.parse(fs.readFileSync(packageJsonFilename)).version;
    } catch (e) {}
    if (typeof version === "string") {
      return version;
    } else {
      return "";
    }
  };
  exports.isPrimordial = (function () {
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
    return function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns.call(PRIMORDIAL_GLOBALS, name);
    };
  }());
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
