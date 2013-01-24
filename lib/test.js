(function () {
  "use strict";
  var __async, __in, __isArray, __num, __owns, __slice, __str, __strnum, __toArray, assert, currentFile, fs, gorilla, k, noPrelude, numFailures, passedTests, path, totalTime;
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
      for (; broken == null && slotsUsed < limit && index < length; ) {
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
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
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
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
    if (__isArray(x)) {
      return x;
    } else {
      return __slice(x);
    }
  };
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
      passedTests = __num(passedTests) + 1;
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
    numFailures = __num(numFailures) + 1;
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
  function arrayEqual(a, b) {
    if (a === b) {
      return a !== 0 || 1 / __num(a) === 1 / __num(b);
    } else if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) {
        return false;
      } else {
        return (function () {
          var _len, i, item;
          for (i = 0, _len = __num(a.length); i < _len; ++i) {
            item = a[i];
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
      return fail(__str(JSON.stringify(a)) + " != " + __str(JSON.stringify(b)) + (msg ? ": " + __strnum(msg) : ""));
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
          var _arr, _i, _len, file;
          for (_arr = [], _i = 0, _len = __num(files.length); _i < _len; ++_i) {
            file = files[_i];
            if (__in(file, __slice(process.argv, 2, void 0))) {
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
              var _ref, basename, code, failure, file, filename, result, start, startTime;
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
              function end() {
                var endTime;
                endTime = Date.now();
                totalTime = __num(totalTime) + (__num(endTime) - __num(startTime));
                process.stdout.write((failure ? "fail" : "pass") + " " + __strnum(((__num(endTime) - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
                return next();
              }
              if (basename.indexOf("async") !== -1) {
                return setTimeout(end, 500);
              } else {
                return end();
              }
            },
            function (_err) {
              var message;
              message = "passed " + __strnum(passedTests) + " tests in " + __strnum((__num(totalTime) / 1000).toFixed(3)) + " seconds";
              if (numFailures === 0) {
                return console.log(message);
              } else {
                console.log("failed " + __strnum(numFailures) + " and " + __strnum(message));
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
