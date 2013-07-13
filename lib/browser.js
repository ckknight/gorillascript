(function (GLOBAL) {
  "use strict";
  var __async, __fromPromise, __isArray, __num, __once, __slice, __toArray,
      __typeof, GorillaScript, runScripts, setImmediate;
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw new TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw new TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw new TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
    }
    if (hasResult) {
      result = [];
    } else {
      result = null;
    }
    if (length <= 0) {
      return onComplete(null, result);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    completed = false;
    function onValueCallback(err, value) {
      if (completed) {
        return;
      }
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (hasResult && broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        next();
      }
    }
    index = -1;
    function next() {
      while (!completed && broken == null && slotsUsed < limit && ++index < length) {
        ++slotsUsed;
        sync = true;
        onValue(index, __once(onValueCallback));
        sync = false;
      }
      if (!completed && (broken != null || slotsUsed === 0)) {
        completed = true;
        if (broken != null) {
          onComplete(broken);
        } else {
          onComplete(null, result);
        }
      }
    }
    next();
  };
  __fromPromise = function (promise) {
    if (typeof promise !== "object" || promise === null) {
      throw new TypeError("Expected promise to be an Object, got " + __typeof(promise));
    } else if (typeof promise.then !== "function") {
      throw new TypeError("Expected promise.then to be a Function, got " + __typeof(promise.then));
    }
    return function (callback) {
      if (typeof callback !== "function") {
        throw new TypeError("Expected callback to be a Function, got " + __typeof(callback));
      }
      promise.then(
        function (value) {
          return setImmediate(callback, null, value);
        },
        function (reason) {
          return setImmediate(callback, reason);
        }
      );
    };
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __once = (function () {
    function replacement() {
      throw new Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw new TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
      }
      return function () {
        var f;
        f = func;
        if (silentFail) {
          func = doNothing;
        } else {
          func = replacement;
        }
        return f.apply(this, arguments);
      };
    };
  }());
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
  GorillaScript = require("./gorilla");
  GorillaScript.require = require;
  if (typeof window !== "undefined" && window !== null) {
    GorillaScript.load = function (url, callback) {
      var xhr;
      if (typeof url !== "string") {
        throw new TypeError("Expected url to be a String, got " + __typeof(url));
      }
      if (typeof callback !== "function") {
        throw new TypeError("Expected callback to be a Function, got " + __typeof(callback));
      }
      if (window.ActiveXObject) {
        xhr = new (window.ActiveXObject)("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
        xhr = new (window.XMLHttpRequest)();
      } else {
        throw new Error("Unable to create XMLHttpRequest");
      }
      xhr.open("GET", url, true);
      if (typeof xhr.overrideMimeType === "function") {
        xhr.overrideMimeType("text/plain");
      }
      xhr.onreadystatechange = function () {
        var _ref;
        if (xhr.readyState === 4) {
          if ((_ref = xhr.status) === 0 || _ref === 200) {
            return __fromPromise(GorillaScript.run(xhr.responseText))(callback);
          } else {
            return callback(new Error("Could not load " + url));
          }
        }
      };
      return xhr.send(null);
    };
    runScripts = function () {
      var scripts;
      scripts = document.getElementsByTagName("script");
      return __async(
        1,
        __num(scripts.length),
        false,
        function (_i, next) {
          var script;
          script = scripts[_i];
          if (script.type === "text/gorillascript") {
            if (script.src) {
              return GorillaScript.load(script.src, next);
            } else {
              GorillaScript.runSync(script.innerHTML);
              return next();
            }
          } else {
            return next();
          }
        },
        function (_err) {}
      );
    };
    if (window.addEventListener) {
      addEventListener("DOMContentLoaded", runScripts, false);
    } else {
      attachEvent("onload", runScripts);
    }
  }
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
