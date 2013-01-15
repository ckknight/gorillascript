(function () {
  "use strict";
  var __in, __num, __slice, __strnum, fs, gorilla, path, startTime;
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + typeof num);
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
      throw TypeError("Expected a string or number, got " + type);
    }
  };
  fs = require("fs");
  path = require("path");
  startTime = Date.now();
  gorilla = require("./gorilla");
  fs.readdir("./src", function (err, files) {
    var _first, _i, _len, inputs;
    if (err != null) {
      throw err;
    }
    files = (function () {
      var _arr, _arr2, _i2, _len2, file;
      for (_arr = [], _arr2 = files.sort(), _i2 = 0, _len2 = __num(_arr2.length); _i2 < _len2; ++_i2) {
        file = _arr2[_i2];
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
    inputs = {};
    _i = 0;
    _len = __num(files.length);
    _first = true;
    function next(_err) {
      var file, filename;
      if (_err != null) {
        return _done(_err);
      }
      if (_first) {
        _first = false;
      } else {
        ++_i;
      }
      if (_i >= _len) {
        return _done();
      }
      file = files[_i];
      filename = path.join("./src", file);
      return fs.readFile(filename, "utf8", function (err, code) {
        if (err != null) {
          return done(err);
        }
        inputs[file] = { filename: filename, code: code };
        return next();
      });
    }
    function _done(_err) {
      var _first2, _i2, _len2, _ref, code, file, filename, results, startFileTime;
      results = {};
      for (_i2 = 0, _len2 = __num(files.length); _i2 < _len2; ++_i2) {
        file = files[_i2];
        filename = (_ref = inputs[file]).filename;
        code = _ref.code;
        process.stdout.write(__strnum(filename) + ": ");
        startFileTime = Date.now();
        results[file] = gorilla.compile(code, { filename: filename });
        process.stdout.write(__strnum(((Date.now() - __num(startFileTime)) / 1000).toFixed(3)) + " seconds\n");
      }
      _i2 = 0;
      _len2 = __num(files.length);
      _first2 = true;
      function next(_err2) {
        var compiled, file, outputFile;
        if (_err2 != null) {
          return _done2(_err2);
        }
        if (_first2) {
          _first2 = false;
        } else {
          ++_i2;
        }
        if (_i2 >= _len2) {
          return _done2();
        }
        file = files[_i2];
        compiled = results[file];
        outputFile = path.join("./lib", file.replace(/\.gs$/, ".js"));
        return fs.rename(outputFile, __strnum(outputFile) + ".bak", function (err) {
          if (err != null) {
            return done(err);
          }
          return fs.writeFile(outputFile, compiled, "utf8", function (err) {
            if (err != null) {
              return done(err);
            }
            return next();
          });
        });
      }
      function _done2(_err2) {
        return done();
      }
      return next();
    }
    return next();
  });
}.call(this));
