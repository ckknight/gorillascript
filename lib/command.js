(function (GLOBAL) {
  "use strict";
  var __async, __create, __fromPromise, __import, __isArray, __num, __once, __owns, __slice, __strnum, __toArray, __typeof, _once, _this, child_process, cli, fs, gorilla, path, setImmediate, util;
  _this = this;
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
    }
    if (hasResult) {
      result = [];
    } else {
      result = null;
    }
    if (length <= 0) {
      return onComplete(null, result);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    completed = false;
    function onValueCallback(err, value) {
      if (completed) {
        return;
      }
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (hasResult && broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        next();
      }
    }
    index = -1;
    function next() {
      while (!completed && broken == null && slotsUsed < limit && ++index < length) {
        ++slotsUsed;
        sync = true;
        onValue(index, __once(onValueCallback));
        sync = false;
      }
      if (!completed && (broken != null || slotsUsed === 0)) {
        completed = true;
        if (broken != null) {
          onComplete(broken);
        } else {
          onComplete(null, result);
        }
      }
    }
    next();
  };
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __fromPromise = function (promise) {
    if (typeof promise !== "object" || promise === null) {
      throw TypeError("Expected promise to be an Object, got " + __typeof(promise));
    } else if (typeof promise.then !== "function") {
      throw TypeError("Expected promise.then to be a Function, got " + __typeof(promise.then));
    }
    return function (callback) {
      promise.then(
        function (value) {
          return setImmediate(callback, null, value);
        },
        function (reason) {
          return setImmediate(callback, reason);
        }
      );
    };
  };
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
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
  __once = (function () {
    function replacement() {
      throw Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
      }
      return function () {
        var f;
        f = func;
        func = silentFail ? doNothing : replacement;
        return f.apply(this, arguments);
      };
    };
  }());
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function () {
      var nextTick;
      nextTick = process.nextTick;
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }())
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, __toArray(args));
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  cli = require("cli");
  gorilla = require("./gorilla");
  util = require("util");
  fs = require("fs");
  path = require("path");
  child_process = require("child_process");
  child_process.exec("which gjs", (_once = false, function (err, whichGjsStdout, whichGjsStderr) {
    var _once2, hasGjs, parseOptions;
    if (_once) {
      throw Error("Attempted to call function more than once");
    } else {
      _once = true;
    }
    hasGjs = err == null && whichGjsStdout.length && !whichGjsStderr.length;
    cli.enable("version");
    cli.setApp("gorilla", gorilla.version);
    cli.setUsage("gorilla [OPTIONS] path/to/script.gs");
    parseOptions = {
      ast: ["a", "Display JavaScript AST nodes instead of compilation"],
      bare: ["b", "Compile without safety top-level closure wrapper"],
      compile: ["c", "Compile to JavaScript and save as .js files"],
      output: ["o", "Set the file/directory for compiled JavaScript", "path"],
      interactive: ["i", "Run interactively with the REPL"],
      nodes: ["n", "Display GorillaScript parser nodes instead of compilation"],
      stdout: ["p", "Print the compiled JavaScript to stdout"],
      stdin: ["s", "Listen for and compile GorillaScript from stdin"],
      "eval": ["e", "Compile and run a string from command line", "string"],
      uglify: ["u", "Uglify compiled code with UglifyJS2"],
      minify: [false, "Minimize the use of unnecessary whitespace"],
      sourcemap: ["m", "Build a SourceMap", "file"],
      join: ["j", "Join all the generated JavaScript into a single file"],
      "no-prelude": [false, "Do not include the standard prelude"],
      watch: ["w", "Watch for changes and compile as-needed"],
      embedded: [false, "Compile as embedded GorillaScript"],
      "embedded-generator": [false, "Compile as a generator-based embedded GorillaScript"]
    };
    if (hasGjs) {
      parseOptions.gjs = [false, "Run with gjs"];
    }
    cli.parse(parseOptions);
    return cli.main((_once2 = false, function (filenames, options) {
      var _f, lang, opts;
      if (_once2) {
        throw Error("Attempted to call function more than once");
      } else {
        _once2 = true;
      }
      lang = "js";
      opts = {};
      if (options.uglify) {
        opts.undefinedName = "undefined";
        opts.uglify = true;
      }
      if (options.minify) {
        opts.minify = true;
      }
      if (options.bare) {
        opts.bare = true;
      }
      if (options["no-prelude"]) {
        _f = function (next) {
          opts.noPrelude = true;
          return next();
        };
      } else {
        _f = function (next) {
          var _once3;
          return __fromPromise(gorilla.init({ lang: lang }))((_once3 = false, function (_e) {
            if (_once3) {
              throw Error("Attempted to call function more than once");
            } else {
              _once3 = true;
            }
            if (_e != null) {
              throw _e;
            }
            return next();
          }));
        };
      }
      return _f(function () {
        var input, sourcemap;
        if (options.stdout) {
          opts.writer = function (text) {
            return process.stdout.write(text);
          };
        }
        function handleCode(code, callback) {
          var _f;
          if (callback == null) {
            callback = function () {};
          }
          if (options.ast) {
            _f = function (next) {
              var _once3;
              return gorilla.ast(code, opts, (_once3 = false, function (_e, ast) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e != null) {
                  return next(_e);
                }
                return next(null, util.inspect(ast.node, false, null));
              }));
            };
          } else if (options.nodes) {
            _f = function (next) {
              var _once3;
              return gorilla.parse(code, opts, (_once3 = false, function (_e, nodes) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e != null) {
                  return next(_e);
                }
                return next(null, util.inspect(nodes.result, false, null));
              }));
            };
          } else if (options.stdout) {
            _f = function (next) {
              var _once3;
              return gorilla.compile(code, opts, (_once3 = false, function (_e, result) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e != null) {
                  return next(_e);
                }
                if (opts.uglify) {
                  process.stdout.write("\n");
                }
                return next(null, result.code);
              }));
            };
          } else if (options.gjs) {
            _f = function (next) {
              var _once3;
              return gorilla.compile(
                code,
                __import({ "eval": true }, opts),
                (_once3 = false, function (_e, compiled) {
                  var gjs;
                  if (_once3) {
                    throw Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  if (_e != null) {
                    return next(_e);
                  }
                  console.log("running with gjs");
                  gjs = child_process.spawn("gjs");
                  gjs.stdout.on("data", function (data) {
                    return process.stdout.write(data);
                  });
                  gjs.stderr.on("data", function (data) {
                    return process.stderr.write(data);
                  });
                  gjs.stdin.write(compiled.code);
                  return setTimeout(
                    function () {
                      gjs.stdin.end();
                      return next(null, "");
                    },
                    50
                  );
                })
              );
            };
          } else {
            _f = function (next) {
              var _once3;
              return __fromPromise(gorilla["eval"](code, opts))((_once3 = false, function (_e, result) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e != null) {
                  return next(_e);
                }
                return next(null, util.inspect(result));
              }));
            };
          }
          return _f(function (err, result) {
            if (err != null) {
              if (err instanceof Error && err.stack) {
                process.stderr.write(err.stack);
              } else {
                process.stderr.write(String(err));
              }
              process.stderr.write("\n");
              return callback(err);
            } else {
              if (result !== "") {
                process.stdout.write(result);
                process.stdout.write("\n");
              }
              return callback();
            }
          });
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
        } else if (options.interactive && options.stdin) {
          return console.error("Cannot specify --interactive and --stdin");
        } else if (options.interactive && filenames.length) {
          return console.error("Cannot specify --interactive and filenames");
        } else if (options.stdin) {
          return cli.withStdin(handleCode);
        } else if (options.watch && !filenames.length) {
          return console.error("Cannot specify --watch without filenames");
        } else if (options.watch && !options.compile) {
          return console.error("Must specify --compile if specifying --watch");
        } else if (options.watch && options.join) {
          return console.error("TODO: Cannot specify --watch and --join");
        } else if (options.watch && options.sourcemap) {
          return console.error("TODO: Cannot specify --watch and --sourcemap");
        } else if (filenames.length) {
          if (options.sourcemap) {
            sourcemap = require("./sourcemap")(options.output, ".");
          }
          opts.sourcemap = sourcemap;
          if (options["embedded-generator"]) {
            opts.embeddedGenerator = true;
            options.embedded = true;
          }
          if (options.embedded) {
            opts.embedded = true;
            opts.noindent = true;
          }
          input = {};
          return __async(
            0,
            __num(filenames.length),
            false,
            function (_i, next) {
              var _once3, filename;
              filename = filenames[_i];
              return fs.readFile(filename, (_once3 = false, function (_e, code) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e != null) {
                  return next(_e);
                }
                input[filename] = code.toString();
                return next();
              }));
            },
            function (err) {
              var _f, compiled;
              if (err != null) {
                throw err;
              }
              compiled = {};
              function handleSingle(filename, code, done) {
                var _o, _once3, startTime;
                if (typeof done !== "function") {
                  throw TypeError("Expected done to be a Function, got " + __typeof(done));
                }
                opts.filename = filename;
                if (options.compile) {
                  process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
                  startTime = Date.now();
                  return gorilla.compile(code, opts, (_once3 = false, function (_e, compilation) {
                    var endTime;
                    if (_once3) {
                      throw Error("Attempted to call function more than once");
                    } else {
                      _once3 = true;
                    }
                    if (_e != null) {
                      return done(_e);
                    }
                    endTime = Date.now();
                    process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                    compiled[filename] = compilation.code;
                    return done();
                  }));
                } else if (options.stdout || options.gjs) {
                  return handleCode(code, done);
                } else {
                  return __fromPromise(gorilla.run(code, (_o = __create(opts), _o.filename = filename, _o)))(done);
                }
              }
              if (!options.join) {
                _f = function (next) {
                  return __async(
                    1,
                    __num(filenames.length),
                    false,
                    function (_i, done) {
                      var filename;
                      filename = filenames[_i];
                      return handleSingle(filename, input[filename], done);
                    },
                    function (err) {
                      if (err != null) {
                        throw err;
                      }
                      return next();
                    }
                  );
                };
              } else {
                _f = function (next) {
                  var _once3, startTime;
                  opts.filenames = filenames;
                  process.stdout.write("Compiling " + __strnum(filenames.join(", ")) + " ... ");
                  startTime = Date.now();
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
                    (_once3 = false, function (_e, compilation) {
                      var endTime;
                      if (_once3) {
                        throw Error("Attempted to call function more than once");
                      } else {
                        _once3 = true;
                      }
                      if (_e != null) {
                        throw _e;
                      }
                      endTime = Date.now();
                      process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                      compiled.join = compilation.code;
                      return next();
                    })
                  );
                };
              }
              return _f(function () {
                var _f;
                function getJsOutputPath(filename) {
                  var baseDir, dir;
                  if (options.output && filenames.length === 1) {
                    return options.output;
                  } else {
                    baseDir = path.dirname(filename);
                    if (options.output) {
                      dir = path.join(options.output, baseDir);
                    } else {
                      dir = baseDir;
                    }
                    return path.join(dir, __strnum(path.basename(filename, path.extname(filename))) + ".js");
                  }
                }
                function writeSingle(filename, done) {
                  var _once3, jsDir, jsPath;
                  if (typeof done !== "function") {
                    throw TypeError("Expected done to be a Function, got " + __typeof(done));
                  }
                  jsPath = getJsOutputPath(filename);
                  jsDir = path.dirname(jsPath);
                  return fs.exists(jsDir, (_once3 = false, function (exists) {
                    var _f;
                    if (_once3) {
                      throw Error("Attempted to call function more than once");
                    } else {
                      _once3 = true;
                    }
                    if (!exists) {
                      _f = function (next) {
                        var _once4;
                        return child_process.exec("mkdir -p " + __strnum(jsDir), (_once4 = false, function () {
                          if (_once4) {
                            throw Error("Attempted to call function more than once");
                          } else {
                            _once4 = true;
                          }
                          return next();
                        }));
                      };
                    } else {
                      _f = function (next) {
                        return next();
                      };
                    }
                    return _f(function () {
                      var _once4, jsCode;
                      jsCode = compiled[filename];
                      return fs.writeFile(jsPath, jsCode, "utf8", (_once4 = false, function (_e) {
                        if (_once4) {
                          throw Error("Attempted to call function more than once");
                        } else {
                          _once4 = true;
                        }
                        if (_e != null) {
                          return done(_e);
                        }
                        return done();
                      }));
                    });
                  }));
                }
                if (options.compile) {
                  _f = function (next) {
                    var _f;
                    if (!options.join) {
                      _f = function (next) {
                        return __async(
                          0,
                          __num(filenames.length),
                          false,
                          function (_i, next) {
                            var filename;
                            filename = filenames[_i];
                            return writeSingle(filename, next);
                          },
                          function (err) {
                            if (err != null) {
                              throw err;
                            }
                            return next();
                          }
                        );
                      };
                    } else {
                      _f = function (next) {
                        var _once3, jsPath;
                        if (options.output) {
                          jsPath = options.output;
                        } else {
                          jsPath = path.join(path.dirname(filenames[0]), "out.js");
                        }
                        return fs.writeFile(jsPath, compiled.join, "utf8", (_once3 = false, function (_e) {
                          if (_once3) {
                            throw Error("Attempted to call function more than once");
                          } else {
                            _once3 = true;
                          }
                          if (_e != null) {
                            throw _e;
                          }
                          return next();
                        }));
                      };
                    }
                    return _f(function () {
                      return next();
                    });
                  };
                } else {
                  _f = function (next) {
                    return next();
                  };
                }
                return _f(function () {
                  var _f;
                  if (sourcemap != null) {
                    _f = function (next) {
                      var _once3;
                      return fs.writeFile(options.sourcemap, opts.sourcemap.toString(), "utf8", (_once3 = false, function (_e) {
                        if (_once3) {
                          throw Error("Attempted to call function more than once");
                        } else {
                          _once3 = true;
                        }
                        if (_e != null) {
                          throw _e;
                        }
                        return next();
                      }));
                    };
                  } else {
                    _f = function (next) {
                      return next();
                    };
                  }
                  return _f(function () {
                    var _arr, _f, _i, _len, handleQueue, watchQueue;
                    if (options.watch) {
                      watchQueue = {};
                      handleQueue = (function () {
                        var inHandle;
                        inHandle = false;
                        return function () {
                          var _once3, bestName, lowestTime, name, time;
                          if (inHandle) {
                            return;
                          }
                          inHandle = true;
                          lowestTime = __num(new Date().getTime()) - 1000;
                          for (name in watchQueue) {
                            if (__owns.call(watchQueue, name)) {
                              time = watchQueue[name];
                              if (__num(time) < lowestTime) {
                                lowestTime = time;
                                bestName = name;
                              }
                            }
                          }
                          if (bestName != null) {
                            delete watchQueue[bestName];
                            return handleSingle(bestName, input[bestName], (_once3 = false, function (_e) {
                              var _once4;
                              if (_once3) {
                                throw Error("Attempted to call function more than once");
                              } else {
                                _once3 = true;
                              }
                              if (_e != null) {
                                throw _e;
                              }
                              return writeSingle(bestName, (_once4 = false, function (_e2) {
                                if (_once4) {
                                  throw Error("Attempted to call function more than once");
                                } else {
                                  _once4 = true;
                                }
                                if (_e2 != null) {
                                  throw _e2;
                                }
                                inHandle = false;
                                return handleQueue();
                              }));
                            }));
                          } else {
                            return inHandle = false;
                          }
                        };
                      }());
                      for (_arr = __toArray(filenames), _i = 0, _len = _arr.length, _f = function (filename) {
                        return fs.watch(filename, function (event, name) {
                          var _once3;
                          if (name == null) {
                            name = filename;
                          }
                          fs.readFile(name, (_once3 = false, function (err, code) {
                            if (_once3) {
                              throw Error("Attempted to call function more than once");
                            } else {
                              _once3 = true;
                            }
                            input[name] = code.toString();
                            if (!__owns.call(watchQueue, name)) {
                              return watchQueue[name] = new Date().getTime();
                            }
                          }));
                        });
                      }; _i < _len; ++_i) {
                        _f.call(_this, _arr[_i]);
                      }
                      setInterval(handleQueue, 17);
                      return console.log("Watching " + __strnum(filenames.join(", ")) + "...");
                    }
                  });
                });
              });
            }
          );
        } else {
          return require("./repl").start(options.gjs ? { pipe: "gjs" } : void 0);
        }
      });
    }));
  }));
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
