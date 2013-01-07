(function () {
  "use strict";
  var __isArray, __lte, __num, __owns, __slice, __strnum, __toArray, assert, currentFile, fs, k, monkey, noPrelude, numFailures, passedTests, path, totalTime;
  if (typeof Array.isArray === "function") {
    __isArray = Array.isArray;
  } else {
    __isArray = (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  }
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + typeof num);
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
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + type);
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
  monkey = require("./monkey");
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
      return fail(__strnum(JSON.stringify(a)) + " != " + __strnum(JSON.stringify(b)) + (msg ? ": " + __strnum(msg) : ""));
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
      var _first, _len, i;
      if (err != null) {
        throw err;
      }
      if (!__lte(process.argv.length, 2)) {
        files = (function () {
          var _arr, _i, _len, file;
          for (_arr = [], _i = 0, _len = __num(files.length); _i < _len; ++_i) {
            file = files[_i];
            if (file === process.argv[2]) {
              _arr.push(file);
            }
          }
          return _arr;
        }());
      }
      i = 0;
      _len = __num(files.length);
      _first = true;
      function _done() {
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
      function next() {
        var file, filename;
        if (_first) {
          _first = false;
        } else {
          ++i;
        }
        if (i >= _len) {
          return _done();
        }
        file = files[i];
        if (i === 0 && !noPrelude) {
          monkey.init();
        }
        if (!/\.ms$/i.test(file)) {
          return next();
        }
        filename = currentFile = path.join(testsPath, file);
        return fs.readFile(filename, function (err, code) {
          var basename, endTime, failure, result, start, startTime;
          if (err != null) {
            throw err;
          }
          basename = path.basename(filename);
          process.stdout.write(__strnum(basename) + ": ");
          start = Date.now();
          failure = false;
          result = void 0;
          startTime = Date.now();
          endTime = void 0;
          try {
            result = monkey["eval"](code.toString(), { includeGlobals: true, noPrelude: noPrelude });
          } catch (e) {
            failure = true;
            addFailure(basename, e);
          } finally {
            endTime = Date.now();
            totalTime = __num(totalTime) + (__num(endTime) - __num(startTime));
          }
          function end() {
            process.stdout.write((failure ? "fail" : "pass") + " " + __strnum(((__num(endTime) - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
            return next();
          }
          if (basename.indexOf("async") !== -1) {
            return setTimeout(end, 100);
          } else {
            return end();
          }
        });
      }
      return next();
    });
  });
}.call(this));
