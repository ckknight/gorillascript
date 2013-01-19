(function () {
  "use strict";
  var __async, __in, __num, __slice, __strnum, fs, gorilla, path, startTime;
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
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
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
      for (_arr = [], _arr2 = files.sort(), _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
        file = _arr2[_i];
        if ((__num(process.argv.length) < 3 || __in(file, __slice(process.argv, 2, void 0))) && file.match(/\.gs$/i) && file !== "prelude.gs") {
          _arr.push(file);
        }
      }
      return _arr;
    }());
    function done(err) {
      if (err != null) {
        console.log("Failure building after " + __strnum(((Date.now() - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
        throw err;
      } else {
        return console.log("Finished building after " + __strnum(((Date.now() - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
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
        var _i, _len, _ref, code, file, filename, results, startFileTime;
        if (err != null) {
          return done(err);
        }
        results = {};
        for (_i = 0, _len = __num(files.length); _i < _len; ++_i) {
          file = files[_i];
          filename = (_ref = inputs[file]).filename;
          code = _ref.code;
          process.stdout.write(__strnum(filename) + ": ");
          startFileTime = Date.now();
          results[file] = gorilla.compile(code, { filename: filename });
          process.stdout.write(__strnum(((Date.now() - __num(startFileTime)) / 1000).toFixed(3)) + " seconds\n");
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
