(function () {
  "use strict";
  var __async, __in, __isArray, __num, __range, __slice, __strnum, __toArray, __typeof, fs, gorilla, path, startTime;
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
  startTime = Date.now();
  gorilla = require("./gorilla");
  fs.readdir("./src", function (err, files) {
    var inputs;
    if (err != null) {
      throw err;
    }
    files = (function () {
      var _arr, _arr2, _i, _len, file;
      for (_arr = [], _arr2 = __toArray(files.sort()), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        file = _arr2[_i];
        if ((__num(process.argv.length) < 3 || __in(file, __slice(process.argv, 2))) && file.match(/\.gs$/i) && file !== "prelude.gs") {
          _arr.push(file);
        }
      }
      return _arr;
    }());
    function done(err) {
      if (err != null) {
        console.log("Failure building after " + __strnum(((Date.now() - startTime) / 1000).toFixed(3)) + " seconds\n");
        throw err;
      } else {
        return console.log("Finished building after " + __strnum(((Date.now() - startTime) / 1000).toFixed(3)) + " seconds\n");
      }
    }
    if (files.length === 0) {
      return done(null);
    }
    gorilla.init();
    inputs = {};
    return __async(
      0,
      __num(files.length),
      function (_i, next) {
        var file, filename;
        file = files[_i];
        filename = path.join("./src", file);
        return fs.readFile(filename, "utf8", function (err, code) {
          if (err != null) {
            return next(err);
          }
          inputs[file] = { filename: filename, code: code };
          return next();
        });
      },
      function (err) {
        var _arr, _i, _len, _ref, code, file, filename, results, startFileTime;
        if (err != null) {
          return done(err);
        }
        results = {};
        for (_arr = __toArray(files), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          file = _arr[_i];
          filename = (_ref = inputs[file]).filename;
          code = _ref.code;
          process.stdout.write(__strnum(filename) + ": ");
          startFileTime = Date.now();
          results[file] = gorilla.compile(code, { filename: filename });
          process.stdout.write(__strnum(((Date.now() - startFileTime) / 1000).toFixed(3)) + " seconds\n");
        }
        return __async(
          0,
          __num(files.length),
          function (_i, next) {
            var compiled, file, outputFile;
            file = files[_i];
            compiled = results[file];
            outputFile = path.join("./lib", file.replace(/\.gs$/, ".js"));
            return fs.rename(outputFile, __strnum(outputFile) + ".bak", function (err) {
              if (err != null && err.code !== "ENOENT") {
                return next(err);
              }
              return fs.writeFile(outputFile, compiled, "utf8", function (err) {
                if (err != null) {
                  return next(err);
                }
                return next();
              });
            });
          },
          function (err) {
            return done(err);
          }
        );
      }
    );
  });
}.call(this));
