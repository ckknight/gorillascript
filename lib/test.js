(function () {
  "use strict";
  var __async, __in, __isArray, __num, __owns, __range, __slice, __strnum, __toArray, __typeof, assert, currentFile, fs, gorilla, k, noPrelude, numFailures, passedTests, path, totalTime, waiters;
  __async = function (limit, length, onValue, onComplete) {
    var broken, index, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null);
    }
    if (limit <= 0) {
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
        onValue(i, onValueCallback);
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
      len = parent.length;
      i = -1;
      while (++i < __num(len)) {
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
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = (function () {
    var has;
    has = Object.prototype.hasOwnProperty;
    return function (parent, child) {
      return has.call(parent, child);
    };
  }());
  __range = function (start, end, step, inclusive) {
    var i, result;
    if (typeof start !== "number") {
      throw TypeError("Expected start to be a Number, got " + __typeof(start));
    }
    if (typeof end !== "number") {
      throw TypeError("Expected end to be a Number, got " + __typeof(end));
    }
    if (typeof step !== "number") {
      throw TypeError("Expected step to be a Number, got " + __typeof(step));
    }
    if (inclusive == null) {
      inclusive = false;
    } else if (typeof inclusive !== "boolean") {
      throw TypeError("Expected inclusive to be a Boolean, got " + __typeof(inclusive));
    }
    if (step === 0) {
      throw RangeError("step cannot be zero");
    } else if (!isFinite(start)) {
      throw RangeError("start must be finite");
    } else if (!isFinite(end)) {
      throw RangeError("end must be finite");
    }
    result = [];
    i = start;
    if (step > 0) {
      for (; i < end; i += step) {
        result.push(i);
      }
      if (inclusive && i <= end) {
        result.push(i);
      }
    } else {
      for (; i > end; i += step) {
        result.push(i);
      }
      if (inclusive && i >= end) {
        result.push(i);
      }
    }
    return result;
  };
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
      return __slice(x);
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
  fs = require("fs");
  path = require("path");
  assert = require("assert");
  gorilla = require("./gorilla");
  noPrelude = false;
  passedTests = 0;
  function addGlobal(name, func) {
    global[name] = function () {
      var args, result;
      args = __slice(arguments);
      result = func.apply(void 0, __toArray(args));
      ++passedTests;
      return result;
    };
  }
  for (k in assert) {
    if (__owns(assert, k)) {
      addGlobal(k, assert[k]);
    }
  }
  addGlobal("success", function () {});
  global.eq = global.strictEqual;
  global.runOnce = function (value) {
    function f() {
      if (f.ran) {
        fail("called more than once");
      }
      f.ran = true;
      return value;
    }
    f.ran = false;
    return f;
  };
  global.gorilla = gorilla;
  currentFile = null;
  numFailures = 0;
  function addFailure(filename, error) {
    ++numFailures;
    if (filename) {
      console.log(filename);
    }
    if (error.description) {
      console.log("  " + __strnum(error.description));
    }
    if (error.stack) {
      console.log(error.stack);
    } else {
      console.log(String(error));
    }
    if (error.source) {
      console.log(error.source);
    }
  }
  global.test = function (description, fn) {
    try {
      fn.test = { description: description, currentFile: currentFile };
      fn.call(fn);
    } catch (e) {
      e.description = description;
      e.source = fn.toString();
      addFailure(currentFile, e);
    }
  };
  waiters = [[], []];
  function handleWaiters() {
    var _i, _len, found, type;
    found = true;
    while (found) {
      found = false;
      for (_i = 0, _len = waiters.length; _i < _len; ++_i) {
        type = waiters[_i];
        if (type.length) {
          found = true;
          type.splice(Math.floor(+(Math.random() * __num(type.length))), 1)[0]();
          break;
        }
      }
    }
  }
  global.asyncTest = function (description, fn) {
    fn.wait = function (getValue, cb) {
      if (typeof getValue !== "function") {
        throw TypeError("Expected getValue to be a Function, got " + __typeof(getValue));
      }
      if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a Function, got " + __typeof(cb));
      }
      waiters[0].push(function () {
        return fn.dontWait(getValue, cb);
      });
    };
    fn.after = function (getValue, cb) {
      if (typeof getValue !== "function") {
        throw TypeError("Expected getValue to be a Function, got " + __typeof(getValue));
      }
      if (cb == null) {
        cb = null;
      } else if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a null or Function, got " + __typeof(cb));
      }
      waiters[1].push(function () {
        return fn.dontWait(getValue, cb || function () {});
      });
    };
    fn.dontWait = function (getValue, cb) {
      var _else, result;
      if (typeof getValue !== "function") {
        throw TypeError("Expected getValue to be a Function, got " + __typeof(getValue));
      }
      if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a Function, got " + __typeof(cb));
      }
      result = void 0;
      _else = true;
      try {
        result = getValue();
      } catch (e) {
        _else = false;
        e.description = description;
        e.source = fn.toString();
        addFailure(currentFile, e);
      } finally {
        if (_else) {
          cb(null, result);
        }
      }
    };
    test(description, fn);
  };
  function arrayEqual(a, b) {
    if (a === b) {
      return a !== 0 || 1 / __num(a) === 1 / __num(b);
    } else if (__isArray(a)) {
      if (!__isArray(b) || a.length !== b.length) {
        return false;
      } else {
        return (function () {
          var _arr, _len, i, item;
          for (_arr = __toArray(a), i = 0, _len = _arr.length; i < _len; ++i) {
            item = _arr[i];
            if (!arrayEqual(item, b[i])) {
              return false;
            }
          }
          return true;
        }());
      }
    } else {
      return a !== a && b !== b;
    }
  }
  global.arrayEq = function (a, b, msg) {
    if (!arrayEqual(a, b)) {
      return fail((JSON.stringify(a) || "undefined") + " != " + (JSON.stringify(b) || "undefined") + (msg ? ": " + __strnum(msg) : ""));
    } else {
      return success();
    }
  };
  totalTime = 0;
  fs.realpath(__filename, function (err, filenamePath) {
    var testsPath;
    if (err != null) {
      throw err;
    }
    testsPath = path.join(path.dirname(filenamePath), "../tests");
    return fs.readdir(testsPath, function (err, files) {
      var inputs;
      if (err != null) {
        throw err;
      }
      if (__num(process.argv.length) > 2) {
        files = (function () {
          var _arr, _arr2, _i, _len, file;
          for (_arr = [], _arr2 = __toArray(files), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            file = _arr2[_i];
            if (__in(file, __slice(process.argv, 2))) {
              _arr.push(file);
            }
          }
          return _arr;
        }());
      }
      files.sort();
      inputs = {};
      return __async(
        0,
        __num(files.length),
        function (i, next) {
          var file, filename;
          file = files[i];
          if (!/\.gs$/i.test(file)) {
            return next();
          }
          filename = currentFile = path.join(testsPath, file);
          return fs.readFile(filename, function (err, code) {
            if (err != null) {
              return next(err);
            }
            inputs[file] = { code: code, filename: filename };
            return next();
          });
        },
        function (err) {
          if (err != null) {
            throw err;
          }
          return __async(
            1,
            __num(files.length),
            function (i, next) {
              var _ref, basename, code, endTime, failure, file, filename, result, start, startTime;
              file = files[i];
              if (i === 0 && !noPrelude) {
                gorilla.init();
              }
              if (!__owns(inputs, file)) {
                return next();
              }
              code = (_ref = inputs[file]).code;
              filename = _ref.filename;
              basename = path.basename(filename);
              process.stdout.write(__strnum(basename) + ": ");
              start = Date.now();
              failure = false;
              result = void 0;
              startTime = Date.now();
              try {
                result = gorilla["eval"](code.toString(), { filename: filename, includeGlobals: true, noPrelude: noPrelude });
              } catch (e) {
                failure = true;
                addFailure(basename, e);
              }
              handleWaiters();
              endTime = Date.now();
              totalTime += endTime - startTime;
              process.stdout.write((failure ? "fail" : "pass") + " " + __strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
              return next();
            },
            function (_err) {
              var message;
              message = "passed " + passedTests + " tests in " + __strnum((totalTime / 1000).toFixed(3)) + " seconds";
              if (numFailures === 0) {
                return console.log(message);
              } else {
                console.log("failed " + numFailures + " and " + message);
                return setTimeout(
                  function () {
                    return process.exit(1);
                  },
                  100
                );
              }
            }
          );
        }
      );
    });
  });
}.call(this));
