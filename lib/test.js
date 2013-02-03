(function () {
  "use strict";
  var __async, __in, __is, __isArray, __num, __once, __owns, __slice, __strnum, __toArray, __typeof, assert, currentFile, fs, gorilla, k, noPrelude, numFailures, passedTests, path, totalTime, waiters;
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
  __is = typeof Object.is === "function" ? Object.is
    : function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
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
  fs = require("fs");
  path = require("path");
  assert = require("assert");
  gorilla = require("./gorilla");
  function write(text) {
    return process.stdout.write(text);
  }
  noPrelude = false;
  passedTests = 0;
  function addGlobal(name, func) {
    global[name] = function () {
      var args, result;
      args = __slice.call(arguments);
      result = func.apply(void 0, __toArray(args));
      ++passedTests;
      return result;
    };
  }
  for (k in assert) {
    if (__owns.call(assert, k)) {
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
      addFailure(fn.test.filename, e);
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
        cb(e);
      } finally {
        if (_else) {
          try {
            cb(null, result);
          } catch (e) {
            e.description = description;
            e.source = fn.toString();
            addFailure(fn.test.currentFile, e);
          }
        }
      }
    };
    test(description, fn);
  };
  function arrayEqual(a, b) {
    if (__isArray(a)) {
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
      return __is(a, b);
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
            if (__in(file, __slice.call(process.argv, 2))) {
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
          filename = path.join(testsPath, file);
          return fs.readFile(filename, function (_e, code) {
            if (_e != null) {
              return next(_e);
            }
            inputs[file] = { code: code, filename: filename };
            return next();
          });
        },
        function (err) {
          var _arr, _i, _len, _ref, current, file, longestNameLen;
          if (err != null) {
            throw err;
          }
          current = 0;
          for (_arr = __toArray(files), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            file = _arr[_i];
            if (__num(_ref = path.basename(file).length) > current) {
              current = _ref;
            } else {
              current = current;
            }
          }
          longestNameLen = current;
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
          function padLeft(text, len, padding) {
            return __strnum(stringRepeat(padding, __num(len) - __num(text.length))) + __strnum(text);
          }
          function padRight(text, len, padding) {
            return __strnum(text) + __strnum(stringRepeat(padding, __num(len) - __num(text.length)));
          }
          if (files.length === 0) {
            console.log("No files to test");
            return;
          }
          function next() {
            var totals;
            write(stringRepeat(" ", longestNameLen));
            write("     parse     macro     reduce    translate compile   eval            total\n");
            totals = {};
            return __async(
              1,
              __num(files.length),
              function (_i, next) {
                var _ref, basename, code, failure, file, filename, start, startTime;
                file = files[_i];
                if (!__owns.call(inputs, file)) {
                  return next(new Error("Missing file input for " + __strnum(file)));
                }
                code = (_ref = inputs[file]).code;
                filename = _ref.filename;
                basename = path.basename(filename);
                write(padRight(__strnum(basename) + ":", __num(longestNameLen) + 1, " ") + " ");
                start = Date.now();
                failure = false;
                startTime = Date.now();
                currentFile = filename;
                function progress(name, time) {
                  totals[name] = __num(totals[name] || 0) + __num(time);
                  return write("  " + padLeft((__num(time) / 1000).toFixed(3), 6, " ") + " s");
                }
                return gorilla["eval"](
                  code.toString(),
                  { filename: filename, includeGlobals: true, noPrelude: noPrelude, progress: progress },
                  function (err, result) {
                    var endTime;
                    if (err != null) {
                      write("\n");
                      failure = true;
                      addFailure(basename, err);
                    }
                    handleWaiters();
                    endTime = Date.now();
                    totalTime += endTime - startTime;
                    write(" | " + (failure ? "fail" : "pass") + " " + padLeft(((endTime - startTime) / 1000).toFixed(3), 6, " ") + " s\n");
                    return next();
                  }
                );
              },
              function (err) {
                var _arr, _i, _len, message, part;
                if (err != null) {
                  throw err;
                }
                if (__num(files.length) > 1) {
                  write(stringRepeat("-", __num(longestNameLen) + 63));
                  write("+");
                  write(stringRepeat("-", 14));
                  write("\n");
                  write(padRight("total: ", __num(longestNameLen) + 2, " "));
                  for (_arr = [
                    "parse",
                    "macroExpand",
                    "reduce",
                    "translate",
                    "compile",
                    "eval"
                  ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
                    part = _arr[_i];
                    write("  " + padLeft((__num(totals[part]) / 1000).toFixed(3), 6, " ") + " s");
                  }
                  write(" | ");
                  write(numFailures === 0 ? "pass" : "fail");
                  write(" " + padLeft((totalTime / 1000).toFixed(3), 6, " ") + " s\n");
                }
                message = "passed " + passedTests + " tests";
                if (numFailures === 0) {
                  return console.log(message);
                } else {
                  console.log("failed " + numFailures);
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
          if (!noPrelude) {
            return gorilla.init(function (err) {
              if (err != null) {
                throw err;
              }
              return next();
            });
          } else {
            return next();
          }
        }
      );
    });
  });
}.call(this));
