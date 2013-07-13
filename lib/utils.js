(function (GLOBAL) {
  "use strict";
  var __create, __defer, __generatorToPromise, __in, __isArray, __owns,
      __promise, __slice, __toArray, __toPromise, __typeof, _ref, Cache, fs,
      inspect, isPrimordial, mkdirp, path, setImmediate, WeakMap,
      writeFileWithMkdirp;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __defer = (function () {
    function __defer() {
      var deferred, isError, value;
      isError = false;
      value = null;
      deferred = [];
      function complete(newIsError, newValue) {
        var funcs;
        if (deferred) {
          funcs = deferred;
          deferred = null;
          isError = newIsError;
          value = newValue;
          if (funcs.length) {
            setImmediate(function () {
              var _end, i;
              for (i = 0, _end = funcs.length; i < _end; ++i) {
                funcs[i]();
              }
            });
          }
        }
      }
      return {
        promise: {
          then: function (onFulfilled, onRejected, allowSync) {
            var _ref, fulfill, promise, reject;
            if (allowSync !== true) {
              allowSync = void 0;
            }
            _ref = __defer();
            promise = _ref.promise;
            fulfill = _ref.fulfill;
            reject = _ref.reject;
            _ref = null;
            function step() {
              var f, result;
              try {
                if (isError) {
                  f = onRejected;
                } else {
                  f = onFulfilled;
                }
                if (typeof f === "function") {
                  result = f(value);
                  if (result && typeof result.then === "function") {
                    result.then(fulfill, reject, allowSync);
                  } else {
                    fulfill(result);
                  }
                } else {
                  (isError ? reject : fulfill)(value);
                }
              } catch (e) {
                reject(e);
              }
            }
            if (deferred) {
              deferred.push(step);
            } else if (allowSync) {
              step();
            } else {
              setImmediate(step);
            }
            return promise;
          },
          sync: function () {
            var result, state;
            state = 0;
            result = 0;
            this.then(
              function (ret) {
                state = 1;
                result = ret;
              },
              function (err) {
                state = 2;
                result = err;
              },
              true
            );
            switch (state) {
            case 0: throw new Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw new Error("Unknown state");
            }
          }
        },
        fulfill: function (value) {
          complete(false, value);
        },
        reject: function (reason) {
          complete(true, reason);
        }
      };
    }
    __defer.fulfilled = function (value) {
      var d;
      d = __defer();
      d.fulfill(value);
      return d.promise;
    };
    __defer.rejected = function (reason) {
      var d;
      d = __defer();
      d.reject(reason);
      return d.promise;
    };
    return __defer;
  }());
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw new TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw new TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw new TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    function continuer(verb, arg) {
      var item;
      try {
        item = generator[verb](arg);
      } catch (e) {
        return __defer.rejected(e);
      }
      if (item.done) {
        return __defer.fulfilled(item.value);
      } else {
        return item.value.then(callback, errback, allowSync);
      }
    }
    function callback(value) {
      return continuer("send", value);
    }
    function errback(value) {
      return continuer("throw", value);
    }
    return callback(void 0);
  };
  __in = typeof Array.prototype.indexOf === "function"
    ? (function (indexOf) {
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }(Array.prototype.indexOf))
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
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __promise = function (value, allowSync) {
    var factory;
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    if (typeof value === "function") {
      factory = function () {
        return __generatorToPromise(value.apply(this, arguments));
      };
      factory.sync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        ).sync();
      };
      factory.maybeSync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        );
      };
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
  };
  __slice = Array.prototype.slice;
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
  __toPromise = function (func, context, args) {
    var _ref, fulfill, promise, reject;
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    _ref = __defer();
    promise = _ref.promise;
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    _ref = null;
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          reject(err);
        } else {
          fulfill(value);
        }
      }
    ]));
    return promise;
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
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
        return uidRand() + "-" + new Date().getTime() + "-" + uidRand() + "-" + uidRand();
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
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          if (__owns.call(key, _ref = this._uid)) {
            return key[_ref];
          }
        } else {
          check.call(this, key);
          index = this._keys.indexOf(key);
          if (index !== -1) {
            return this._values[index];
          }
        }
      };
      _WeakMap_prototype.has = function (key) {
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
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
          throw new TypeError("Invalid value used as weak map key");
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
          throw new TypeError("Invalid value used as weak map key");
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
    if (count < 1) {
      return "";
    } else if (count === 1) {
      return text;
    } else if (count & 1) {
      return "" + text + stringRepeat(text, count - 1);
    } else {
      return stringRepeat("" + text + text, count / 2);
    }
  }
  function padLeft(text, len, padding) {
    return "" + stringRepeat(padding, len - text.length) + text;
  }
  function padRight(text, len, padding) {
    return "" + text + stringRepeat(padding, len - text.length);
  }
  Cache = (function () {
    var _Cache_prototype;
    function Cache() {
      var _this;
      _this = this instanceof Cache ? this : __create(_Cache_prototype);
      _this.weakmap = WeakMap();
      return _this;
    }
    _Cache_prototype = Cache.prototype;
    Cache.displayName = "Cache";
    _Cache_prototype.get = function (key) {
      return this.weakmap.get(key);
    };
    _Cache_prototype.set = function (key, value) {
      this.weakmap.set(key, value);
    };
    _Cache_prototype.getOrAdd = function (key, factory) {
      var value, weakmap;
      weakmap = this.weakmap;
      value = weakmap.get(key);
      if (value === void 0) {
        value = factory(key);
        weakmap.set(key, value);
      }
      return value;
    };
    return Cache;
  }());
  function quote(value) {
    if (inspect) {
      return inspect(value);
    } else if (value.indexOf("'") === -1) {
      return "'" + JSON.stringify(value).slice(1, -1) + "'";
    } else {
      return JSON.stringify(value);
    }
  }
  function unique(items) {
    var _arr, _i, _len, item, result;
    result = [];
    for (_arr = __toArray(items), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (!__in(item, result)) {
        result.push(item);
      }
    }
    return result;
  }
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
  function getPackageVersion(filename) {
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
  }
  isPrimordial = (function () {
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
      return __owns.call(PRIMORDIAL_GLOBALS, name);
    };
  }());
  function fsExistsPromise(path) {
    var defer;
    defer = __defer();
    fs.exists(path, defer.fulfill);
    return defer.promise;
  }
  mkdirp = __promise(function (dirpath, mode, sync) {
    var _arr, _e, _i, _len, _send, _state, _step, _throw, acc, current, e,
        exists, part;
    _state = 0;
    function _close() {
      _state = 14;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (mode == null) {
            mode = 511 & ~+process.umask();
          }
          if (dirpath.charAt(0) === "/") {
            acc = "/";
          } else {
            acc = "";
          }
          _arr = __toArray(dirpath.split(/[\/\\]/g));
          _i = 0;
          _len = _arr.length;
          ++_state;
        case 1:
          _state = _i < _len ? 2 : 13;
          break;
        case 2:
          part = _arr[_i];
          current = path.resolve(path.join(acc, part));
          _state = sync ? 3 : 4;
          break;
        case 3:
          exists = fs.existsSync(current);
          _state = 6;
          break;
        case 4:
          ++_state;
          return { done: false, value: fsExistsPromise(current) };
        case 5:
          exists = _received;
          ++_state;
        case 6:
          _state = !exists ? 7 : 11;
          break;
        case 7:
          _state = sync ? 8 : 9;
          break;
        case 8:
          fs.mkdirSync(current, mode);
          _state = 11;
          break;
        case 9:
          _state = 11;
          return {
            done: false,
            value: __toPromise(fs.mkdir, fs, [current, mode])
          };
        case 10: throw new Error("Unable to create directory '" + current + "' (Error code: " + e.code + ")");
        case 11:
          acc = current;
          ++_state;
        case 12:
          ++_i;
          _state = 1;
          break;
        case 13:
          ++_state;
        case 14:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      if (_state >= 7 && _state <= 9) {
        e = _e;
        _state = 10;
      } else {
        _close();
        throw _e;
      }
    }
    function _send(_received) {
      while (true) {
        try {
          return _step(_received);
        } catch (_e) {
          _throw(_e);
        }
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
  });
  function mkdirpSync(dirpath, mode) {
    return mkdirp.sync(dirpath, mode, true);
  }
  writeFileWithMkdirp = __promise(function (filepath, text, encoding, sync) {
    var _e, _send, _state, _step, _throw;
    _state = 0;
    function _close() {
      _state = 4;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          _state = sync ? 1 : 2;
          break;
        case 1:
          mkdirpSync(path.dirname(filepath));
          fs.writeFileSync(filepath, text, encoding);
          _state = 4;
          break;
        case 2:
          ++_state;
          return { done: false, value: mkdirp(path.dirname(filepath)) };
        case 3:
          ++_state;
          return {
            done: false,
            value: __toPromise(fs.writeFile, fs, [filepath, text, encoding])
          };
        case 4:
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
  });
  function writeFileWithMkdirpSync(filepath, text, encoding) {
    return writeFileWithMkdirp.sync(filepath, text, encoding, true);
  }
  exports.stringRepeat = stringRepeat;
  exports.padLeft = padLeft;
  exports.padRight = padRight;
  exports.Cache = Cache;
  exports.quote = quote;
  exports.unique = unique;
  exports.getPackageVersion = getPackageVersion;
  exports.isPrimordial = isPrimordial;
  exports.mkdirp = mkdirp;
  exports.mkdirpSync = mkdirpSync;
  exports.writeFileWithMkdirp = writeFileWithMkdirp;
  exports.writeFileWithMkdirpSync = writeFileWithMkdirpSync;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
