(function () {
  "use strict";
  var __async, __isArray, __num, __once, __slice, __toArray, __typeof, GorillaScript, runScripts;
  __async = function (limit, length, onValue, onComplete) {
    var broken, index, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    function onValueCallback(err) {
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (!sync) {
        return next();
      }
    }
    index = 0;
    function next() {
      var f, i;
      while (broken == null && slotsUsed < limit && index < length) {
        ++slotsUsed;
        i = index;
        ++index;
        sync = true;
        onValue(i, __once(onValueCallback));
        sync = false;
      }
      if (broken != null || slotsUsed === 0) {
        f = onComplete;
        onComplete = void 0;
        if (f) {
          return f(broken);
        }
      }
    }
    return next();
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
  __once = function (func) {
    if (typeof func !== "function") {
      throw Error("Expected func to be a Function, got " + __typeof(func));
    }
    return function () {
      var f;
      if (func) {
        f = func;
        func = null;
        return f.apply(this, arguments);
      } else {
        throw Error("Attempted to call function more than once");
      }
    };
  };
  __slice = Array.prototype.slice;
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
  GorillaScript = require("./gorilla");
  GorillaScript.require = require;
  if (typeof window !== "undefined" && window !== null) {
    GorillaScript.load = function (url, callback) {
      var xhr;
      if (typeof url !== "string") {
        throw TypeError("Expected url to be a String, got " + __typeof(url));
      }
      if (typeof callback !== "function") {
        throw TypeError("Expected callback to be a Function, got " + __typeof(callback));
      }
      if (typeof XMLHttpRequest === "function") {
        xhr = new XMLHttpRequest();
      } else if (typeof window.ActiveXObject === "function") {
        xhr = new (window.ActiveXObject)("Microsoft.XMLHTTP");
      } else {
        throw Error("Unable to create XMLHttpRequest");
      }
      xhr.open("GET", url, true);
      if (typeof xhr.overrideMimeType === "function") {
        xhr.overrideMimeType("text/plain");
      }
      xhr.onreadystatechange = function () {
        var _ref;
        if (xhr.readyState === 4) {
          if ((_ref = xhr.status) === 0 || _ref === 200) {
            return GorillaScript.run(xhr.responseText, callback);
          } else {
            return callback(Error("Could not load " + url));
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
        function (_i, next) {
          var script;
          script = scripts[_i];
          if (script.type === "text/gorillascript") {
            if (script.src) {
              return GorillaScript.load(script.src, next);
            } else {
              GorillaScript.run(script.innerHTML);
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
}.call(this));
