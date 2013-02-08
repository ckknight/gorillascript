(function () {
  "use strict";
  var __async, __create, __isArray, __num, __once, __slice, __strnum, __toArray, __typeof, child_process, cli, fs, gorilla, path, util;
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
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
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
    output: ["o", "Set the file/directory for compiled JavaScript", "path"],
    interactive: ["i", "Run interactively with the REPL"],
    nodes: ["n", "Display GorillaScript parser nodes instead of compilation"],
    stdout: ["p", "Print the compiled JavaScript to stdout"],
    stdin: ["s", "Listen for and compile GorillaScript from stdin"],
    "eval": ["e", "Compile and run a string from command line", "string"],
    uglify: ["u", "Uglify compiled code with UglifyJS2"],
    sourcemap: ["m", "Build a SourceMap", "file"],
    join: ["j", "Join all the generated JavaScript into a single file"],
    "no-prelude": [false, "Do not include the standard prelude"]
  });
  cli.main(function (filenames, options) {
    var opts;
    opts = {};
    if (options.uglify) {
      opts.undefinedName = "undefined";
      opts.uglify = true;
    }
    function next() {
      var input;
      if (options.stdout) {
        opts.writer = function (text) {
          return process.stdout.write(text);
        };
      }
      function handleCode(code, callback) {
        if (callback == null) {
          callback = function () {};
        }
        function next(err, result) {
          if (typeof err !== "undefined" && err !== null) {
            return callback(err);
          } else {
            if (result !== "") {
              process.stdout.write(__strnum(result) + "\n");
            }
            return callback();
          }
        }
        if (options.ast) {
          return gorilla.ast(code, opts, function (_e, ast) {
            if (_e != null) {
              return next(_e);
            }
            return next(null, util.inspect(ast.node, false, null));
          });
        } else if (options.nodes) {
          return gorilla.parse(code, opts, function (_e, nodes) {
            if (_e != null) {
              return next(_e);
            }
            return next(null, util.inspect(nodes.result, false, null));
          });
        } else if (options.stdout) {
          return gorilla.compile(code, opts, function (_e, result) {
            if (_e != null) {
              return next(_e);
            }
            if (opts.uglify) {
              process.stdout.write("\n");
            }
            return next(null, result.code);
          });
        } else {
          return gorilla["eval"](code, opts, function (_e, result) {
            if (_e != null) {
              return next(_e);
            }
            return next(null, util.inspect(result));
          });
        }
      }
      if (options.ast && options.compile) {
        return console.error("Cannot specify both --ast and --compile");
      } else if (options.ast && options.nodes) {
        return console.error("Cannot specify both --ast and --nodes");
      } else if (options.nodes && options.compile) {
        return console.error("Cannot specify both --nodes and --compile");
      } else if (options.output && !options.compile) {
        return console.error("Must specify --compile if specifying --output");
      } else if (options.sourcemap && !options.output) {
        return console.error("Must specify --output if specifying --sourcemap");
      } else if (__num(filenames.length) > 1 && options.sourcemap && !options.join) {
        return console.error("Cannot specify --sourcemap with multiple files unless using --join");
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
            var compiled, sourcemap;
            if (typeof err !== "undefined" && err !== null) {
              throw err;
            }
            if (options.sourcemap) {
              sourcemap = require("./sourcemap")(options.output, ".");
            }
            compiled = {};
            function next() {
              var jsPath;
              if (options.compile) {
                if (!options.join) {
                  __async(
                    0,
                    __num(filenames.length),
                    function (_i, next) {
                      var baseDir, dir, filename, jsDir, jsFilename, jsPath, sourceDir;
                      filename = filenames[_i];
                      jsFilename = __strnum(path.basename(filename, path.extname(filename))) + ".js";
                      sourceDir = path.dirname(filename);
                      baseDir = sourceDir;
                      if (options.output && filenames.length === 1) {
                        jsPath = options.output;
                      } else {
                        if (options.output) {
                          dir = path.join(options.output, baseDir);
                        } else {
                          dir = sourceDir;
                        }
                        jsPath = path.join(dir, jsFilename);
                      }
                      jsDir = path.dirname(jsPath);
                      return fs.exists(jsDir, function (exists) {
                        function done() {
                          var jsCode;
                          jsCode = compiled[filename];
                          return fs.writeFile(jsPath, jsCode, "utf8", function (err) {
                            if (err) {
                              cli.error(err.toString());
                            }
                            return next();
                          });
                        }
                        if (!exists) {
                          return child_process.exec("mkdir -p " + __strnum(jsDir), function () {
                            return done();
                          });
                        } else {
                          return done();
                        }
                      });
                    },
                    function (_err) {}
                  );
                } else {
                  if (options.output) {
                    jsPath = options.output;
                  } else {
                    jsPath = path.join(path.dirname(filenames[0]), "out.js");
                  }
                  fs.writeFile(jsPath, compiled.join, "utf8", function (err) {
                    if (err) {
                      return cli.error(err.toString());
                    }
                  });
                }
              }
              if (sourcemap != null) {
                return fs.writeFile(options.sourcemap, sourcemap.toString(), "utf8", function (err) {
                  if (err) {
                    return cli.error(err.toString());
                  }
                });
              }
            }
            if (!options.join) {
              return __async(
                1,
                __num(filenames.length),
                function (_i, done) {
                  var _o, code, filename, startTime;
                  filename = filenames[_i];
                  code = input[filename];
                  if (options.compile) {
                    process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
                    if (options.sourcemap) {
                      sourcemap.setSource(path.basename(filename));
                      opts.sourcemap = sourcemap;
                    }
                    startTime = Date.now();
                    return gorilla.compile(code, opts, function (_e, compilation) {
                      var endTime;
                      if (_e != null) {
                        return done(_e);
                      }
                      endTime = Date.now();
                      process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                      compiled[filename] = compilation.code;
                      return done();
                    });
                  } else if (options.stdout) {
                    return handleCode(code, done);
                  } else {
                    return gorilla.run(
                      code,
                      (_o = __create(opts), _o.filename = filename, _o),
                      done
                    );
                  }
                },
                function (err) {
                  if (typeof err !== "undefined" && err !== null) {
                    throw err;
                  }
                  return next();
                }
              );
            } else {
              return gorilla.compile(
                (function () {
                  var _arr, _arr2, _i, _len, filename;
                  for (_arr = [], _arr2 = __toArray(filenames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                    filename = _arr2[_i];
                    _arr.push(input[filename]);
                  }
                  return _arr;
                }()),
                opts,
                function (err, compilation) {
                  if (err != null) {
                    throw err;
                  }
                  compiled.join = compilation.code;
                  return next();
                }
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
