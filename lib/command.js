(function () {
  "use strict";
  var __async, __isArray, __num, __slice, __strnum, __toArray, __typeof, child_process, cli, fs, gorilla, path, util;
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
  cli = require("cli");
  gorilla = require("./gorilla");
  util = require("util");
  fs = require("fs");
  path = require("path");
  child_process = require("child_process");
  cli.enable("version");
  cli.setApp("gorilla", "1.0");
  cli.setUsage("gorilla [OPTIONS] path/to/script.gs");
  cli.parse({
    ast: ["a", "Display JavaScript AST nodes instead of compilation"],
    compile: ["c", "Compile to JavaScript and save as .js files"],
    output: ["o", "Set the directory for compiled JavaScript", "path"],
    interactive: ["i", "Run interactively with the REPL"],
    nodes: ["n", "Display GorillaScript parser nodes instead of compilation"],
    stdout: ["p", "Print the compiled JavaScript to stdout"],
    stdin: ["s", "Listen for and compile GorillaScript from stdin"],
    "eval": ["e", "Compile and run a string from command line", "string"],
    "no-prelude": [false, "Do not include the standard prelude"]
  });
  cli.main(function (filenames, options) {
    var opts;
    opts = {};
    function next() {
      var input;
      function handleCode(code) {
        var result;
        if (options.ast) {
          result = util.inspect(
            gorilla.ast(code, opts),
            false,
            null
          );
        } else if (options.nodes) {
          result = util.inspect(
            gorilla.parse(code, opts).result,
            false,
            null
          );
        } else if (options.stdout) {
          result = gorilla.compile(code, opts);
        } else {
          result = util.inspect(gorilla["eval"](code, opts));
        }
        return process.stdout.write(__strnum(result) + "\n");
      }
      if (options.ast && options.compile) {
        return console.error("Cannot specify both --ast and --compile");
      } else if (options.ast && options.nodes) {
        return console.error("Cannot specify both --ast and --nodes");
      } else if (options.nodes && options.compile) {
        return console.error("Cannot specify both --nodes and --compile");
      } else if (options["eval"] != null) {
        return handleCode(String(options["eval"]));
      } else if (options.interactive) {
        return require("./repl");
      } else if (options.stdin) {
        return cli.withStdin(handleCode);
      } else if (filenames.length) {
        input = {};
        return __async(
          0,
          __num(filenames.length),
          function (_i, next) {
            var filename;
            filename = filenames[_i];
            return fs.readFile(filename, function (_e, code) {
              if (_e != null) {
                return next(_e);
              }
              input[filename] = code.toString();
              return next();
            });
          },
          function (err) {
            var _arr, _i, _len, code, compiled, endTime, filename, jsCode, startTime;
            if (typeof err !== "undefined" && err !== null) {
              throw err;
            }
            compiled = {};
            for (_arr = __toArray(filenames), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              filename = _arr[_i];
              code = input[filename];
              if (options.compile) {
                process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
                startTime = Date.now();
                jsCode = gorilla.compile(code, opts);
                endTime = Date.now();
                process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                compiled[filename] = jsCode;
              } else if (options.stdout) {
                handleCode(code);
              } else {
                opts.filename = filename;
                gorilla.run(code, opts);
                opts.filename = null;
              }
            }
            if (options.compile) {
              return __async(
                0,
                __num(filenames.length),
                function (_i, next) {
                  var baseDir, dir, filename, jsFilename, jsPath, sourceDir;
                  filename = filenames[_i];
                  jsFilename = __strnum(path.basename(filename, path.extname(filename))) + ".js";
                  sourceDir = path.dirname(filename);
                  baseDir = sourceDir;
                  if (options.output) {
                    dir = path.join(options.output, baseDir);
                  } else {
                    dir = sourceDir;
                  }
                  jsPath = path.join(dir, jsFilename);
                  return fs.exists(dir, function (exists) {
                    function done() {
                      var jsCode;
                      jsCode = compiled[filename];
                      return fs.writeFile(jsPath, jsCode, function (err) {
                        if (err) {
                          cli.error(err.toString());
                        }
                        return next();
                      });
                    }
                    if (!exists) {
                      return child_process.exec("mkdir -p " + __strnum(dir), function () {
                        return done();
                      });
                    } else {
                      return done();
                    }
                  });
                },
                function (_err) {}
              );
            }
          }
        );
      } else {
        return require("./repl");
      }
    }
    if (options["no-prelude"]) {
      opts.noPrelude = true;
      return next();
    } else {
      return gorilla.init(function (err) {
        if (err != null) {
          throw err;
        }
        return next();
      });
    }
  });
}.call(this));
