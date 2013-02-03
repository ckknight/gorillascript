(function () {
  "use strict";
  var __async, __in, __isArray, __num, __slice, __strnum, __toArray, __typeof, fs, gorilla, path, startTime;
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
    function write(text) {
      return process.stdout.write(text);
    }
    function done(err) {
      if (err != null) {
        console.log("Failure building after " + __strnum(((Date.now() - startTime) / 1000).toFixed(3)) + " seconds\n");
        throw err;
      }
    }
    if (files.length === 0) {
      return done(null);
    }
    return gorilla.init(function (_e, err) {
      var inputs;
      if (_e != null) {
        return done(_e);
      }
      inputs = {};
      return __async(
        0,
        __num(files.length),
        function (_i, next) {
          var file, filename;
          file = files[_i];
          filename = path.join("./src", file);
          return fs.readFile(filename, "utf8", function (_e2, code) {
            if (_e2 != null) {
              return next(_e2);
            }
            inputs[file] = { filename: filename, code: code };
            return next();
          });
        },
        function (err) {
          var _arr, _i, _len, _ref, current, file, longestNameLen, results, totals;
          if (err != null) {
            return done(err);
          }
          current = 0;
          for (_arr = __toArray(files), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            file = _arr[_i];
            if (__num(_ref = file.length) > current) {
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
          write(stringRepeat(" ", longestNameLen));
          write("     parse     macro     reduce    translate compile    total\n");
          totals = {};
          results = {};
          return __async(
            1,
            __num(files.length),
            function (_i, next) {
              var _ref, code, file, filename, startFileTime;
              file = files[_i];
              filename = (_ref = inputs[file]).filename;
              code = _ref.code;
              write(padRight(__strnum(file) + ":", __num(longestNameLen) + 1, " ") + " ");
              startFileTime = Date.now();
              function progress(name, time) {
                totals[name] = __num(totals[name] || 0) + __num(time);
                write("  " + padLeft((__num(time) / 1000).toFixed(3), 6, " ") + " s");
              }
              return gorilla.compile(
                code,
                { filename: filename, progress: progress },
                function (err, compiled) {
                  if (err != null) {
                    write("\n");
                    return next(err);
                  }
                  results[file] = compiled.code;
                  write(" | " + padLeft(((Date.now() - startFileTime) / 1000).toFixed(3), 6, " ") + " s\n");
                  return next();
                }
              );
            },
            function (err) {
              var _arr, _i, _len, part;
              if (err != null) {
                return done(err);
              }
              if (__num(files.length) > 1) {
                write(stringRepeat("-", __num(longestNameLen) + 53));
                write("+");
                write(stringRepeat("-", 9));
                write("\n");
                write(padRight("total: ", __num(longestNameLen) + 2, " "));
                for (_arr = [
                  "parse",
                  "macroExpand",
                  "reduce",
                  "translate",
                  "compile"
                ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  part = _arr[_i];
                  write("  " + padLeft((__num(totals[part]) / 1000).toFixed(3), 6, " ") + " s");
                }
                write(" | " + padLeft(((Date.now() - startTime) / 1000).toFixed(3), 6, " ") + " s\n");
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
                    return fs.writeFile(outputFile, compiled, "utf8", function (_e2) {
                      if (_e2 != null) {
                        return next(_e2);
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
        }
      );
    });
  });
}.call(this));
