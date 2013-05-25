(function (GLOBAL) {
  "use strict";
  var __defer, __delay, __everyPromise, __fromPromise, __generatorToPromise,
      __import, __isArray, __num, __owns, __promise, __slice, __strnum,
      __toArray, __toPromise, __typeof, _once, child_process, cli, fs, gorilla,
      path, setImmediate, util;
  __defer = (function () {
    function __defer() {
      var deferred, isError, value;
      isError = false;
      value = null;
      deferred = [];
      function complete(newIsError, newValue) {
        var funcs;
        if (deferred) {
          funcs = deferred;
          deferred = null;
          isError = newIsError;
          value = newValue;
          if (funcs.length) {
            setImmediate(function () {
              var _end, i;
              for (i = 0, _end = funcs.length; i < _end; ++i) {
                funcs[i]();
              }
            });
          }
        }
      }
      return {
        promise: {
          then: function (onFulfilled, onRejected, allowSync) {
            var _ref, fulfill, promise, reject;
            if (allowSync !== true) {
              allowSync = void 0;
            }
            _ref = __defer();
            promise = _ref.promise;
            fulfill = _ref.fulfill;
            reject = _ref.reject;
            function step() {
              var f, result;
              try {
                if (isError) {
                  f = onRejected;
                } else {
                  f = onFulfilled;
                }
                if (typeof f === "function") {
                  result = f(value);
                  if (result && typeof result.then === "function") {
                    result.then(fulfill, reject, allowSync);
                  } else {
                    fulfill(result);
                  }
                } else {
                  (isError ? reject : fulfill)(value);
                }
              } catch (e) {
                reject(e);
              }
            }
            if (deferred) {
              deferred.push(step);
            } else if (allowSync) {
              step();
            } else {
              setImmediate(step);
            }
            return promise;
          },
          sync: function () {
            var result, state;
            state = 0;
            result = 0;
            this.then(
              function (ret) {
                state = 1;
                return result = ret;
              },
              function (err) {
                state = 2;
                return result = err;
              },
              true
            );
            switch (state) {
            case 0: throw Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw Error("Unknown state");
            }
          }
        },
        fulfill: function (value) {
          complete(false, value);
        },
        reject: function (reason) {
          complete(true, reason);
        }
      };
    }
    __defer.fulfilled = function (value) {
      var d;
      d = __defer();
      d.fulfill(value);
      return d.promise;
    };
    __defer.rejected = function (reason) {
      var d;
      d = __defer();
      d.reject(reason);
      return d.promise;
    };
    return __defer;
  }());
  __delay = function (milliseconds, value) {
    var defer;
    if (typeof milliseconds !== "number") {
      throw TypeError("Expected milliseconds to be a Number, got " + __typeof(milliseconds));
    }
    if (milliseconds <= 0) {
      return __defer.fulfilled(value);
    } else {
      defer = __defer();
      setTimeout(
        function () {
          defer.fulfill(value);
        },
        milliseconds
      );
      return defer.promise;
    }
  };
  __everyPromise = function (promises) {
    var defer, i, isArray, k, remaining, result, v;
    if (typeof promises !== "object" || promises === null) {
      throw TypeError("Expected promises to be an Object, got " + __typeof(promises));
    }
    isArray = __isArray(promises);
    defer = __defer();
    if (isArray) {
      result = [];
    } else {
      result = {};
    }
    remaining = 0;
    function handle(key, promise) {
      return promise.then(
        function (value) {
          result[key] = value;
          if (--remaining === 0) {
            defer.fulfill(result);
          }
        },
        defer.reject
      );
    }
    if (isArray) {
      i = promises.length;
      remaining = i;
      while (i--) {
        handle(i, promises[i]);
      }
    } else {
      for (k in promises) {
        if (__owns.call(promises, k)) {
          v = promises[k];
          ++remaining;
          handle(k, v);
        }
      }
    }
    return defer.promise;
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
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    function continuer(verb, arg) {
      var item;
      try {
        item = generator[verb](arg);
      } catch (e) {
        return __defer.rejected(e);
      }
      if (item.done) {
        return __defer.fulfilled(item.value);
      } else {
        return item.value.then(callback, errback, allowSync);
      }
    }
    function callback(value) {
      return continuer("send", value);
    }
    function errback(value) {
      return continuer("throw", value);
    }
    return callback(void 0);
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
  __owns = Object.prototype.hasOwnProperty;
  __promise = function (value, allowSync) {
    var factory;
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    if (typeof value === "function") {
      factory = function () {
        return __generatorToPromise(value.apply(this, arguments));
      };
      factory.sync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        ).sync();
      };
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
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
  __toPromise = function (func, context, args) {
    var d;
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    d = __defer();
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          d.reject(err);
        } else {
          d.fulfill(value);
        }
      }
    ]));
    return d.promise;
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
    var hasGjs, parseOptions;
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
    return cli.main(function (filenames, options) {
      var _this;
      _this = this;
      __generatorToPromise((function () {
        var _arr, _e, _f, _i, _len, _send, _state, _step, _throw, compilation,
            compiled, e, endTime, filename, getJsOutputPath, handleCode,
            handleQueue, handleSingle, input, inputP, jsPath, lang, opts,
            sourcemap, startTime, watchQueue, writeSingle;
        _state = 0;
        function _close() {
          _state = 52;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
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
              _state = options["no-prelude"] ? 1 : 2;
              break;
            case 1:
              opts.noPrelude = true;
              _state = 3;
              break;
            case 2:
              ++_state;
              return { done: false, value: gorilla.init({ lang: lang }) };
            case 3:
              if (options.stdout) {
                opts.writer = function (text) {
                  return process.stdout.write(text);
                };
              }
              handleCode = __promise(function (code) {
                var _e2, _send2, _state2, _step2, _throw2, ast, compiled,
                    evaled, gjs, nodes, result;
                _state2 = 0;
                function _close2() {
                  _state2 = 16;
                }
                function _step2(_received) {
                  while (true) {
                    switch (_state2) {
                    case 0:
                      _state2 = options.ast ? 1 : 3;
                      break;
                    case 1:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.ast(code, opts)
                      };
                    case 2:
                      ast = _received;
                      result = util.inspect(ast.node, false, null);
                      _state2 = 15;
                      break;
                    case 3:
                      _state2 = options.nodes ? 4 : 6;
                      break;
                    case 4:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.parse(code, opts)
                      };
                    case 5:
                      nodes = _received;
                      result = util.inspect(nodes.result, false, null);
                      _state2 = 15;
                      break;
                    case 6:
                      _state2 = options.stdout ? 7 : 9;
                      break;
                    case 7:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.compile(code, opts)
                      };
                    case 8:
                      compiled = _received;
                      if (opts.uglify) {
                        process.stdout.write("\n");
                      }
                      result = compiled.code;
                      _state2 = 15;
                      break;
                    case 9:
                      _state2 = options.gjs ? 10 : 13;
                      break;
                    case 10:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.compile(code, __import({ "eval": true }, opts))
                      };
                    case 11:
                      compiled = _received;
                      console.log("running with gjs");
                      gjs = child_process.spawn("gjs");
                      gjs.stdout.on("data", function (data) {
                        return process.stdout.write(data);
                      });
                      gjs.stderr.on("data", function (data) {
                        return process.stderr.write(data);
                      });
                      gjs.stdin.write(compiled.code);
                      ++_state2;
                      return { done: false, value: __delay(50) };
                    case 12:
                      gjs.stdin.end();
                      result = "";
                      _state2 = 15;
                      break;
                    case 13:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla["eval"](code, opts)
                      };
                    case 14:
                      evaled = _received;
                      result = util.inspect(evaled, false, null);
                      ++_state2;
                    case 15:
                      if (result !== "") {
                        process.stdout.write(result);
                        process.stdout.write("\n");
                      }
                      ++_state2;
                    case 16:
                      return { done: true, value: void 0 };
                    default: throw Error("Unknown state: " + _state2);
                    }
                  }
                }
                function _throw2(_e2) {
                  _close2();
                  throw _e2;
                }
                function _send2(_received) {
                  try {
                    return _step2(_received);
                  } catch (_e2) {
                    _throw2(_e2);
                  }
                }
                return {
                  close: _close2,
                  iterator: function () {
                    return this;
                  },
                  next: function () {
                    return _send2(void 0);
                  },
                  send: _send2,
                  "throw": function (_e2) {
                    _throw2(_e2);
                    return _send2(void 0);
                  }
                };
              });
              _state = options.ast && options.compile ? 4 : 5;
              break;
            case 4:
              console.error("Cannot specify both --ast and --compile");
              _state = 52;
              break;
            case 5:
              _state = options.ast && options.nodes ? 6 : 7;
              break;
            case 6:
              console.error("Cannot specify both --ast and --nodes");
              _state = 52;
              break;
            case 7:
              _state = options.nodes && options.compile ? 8 : 9;
              break;
            case 8:
              console.error("Cannot specify both --nodes and --compile");
              _state = 52;
              break;
            case 9:
              _state = options.output && !options.compile ? 10 : 11;
              break;
            case 10:
              console.error("Must specify --compile if specifying --output");
              _state = 52;
              break;
            case 11:
              _state = options.sourcemap && !options.output ? 12 : 13;
              break;
            case 12:
              console.error("Must specify --output if specifying --sourcemap");
              _state = 52;
              break;
            case 13:
              _state = __num(filenames.length) > 1 && options.sourcemap && !options.join ? 14 : 15;
              break;
            case 14:
              console.error("Cannot specify --sourcemap with multiple files unless using --join");
              _state = 52;
              break;
            case 15:
              _state = options["eval"] != null ? 16 : 17;
              break;
            case 16:
              _state = 52;
              return { done: false, value: handleCode(String(options["eval"])) };
            case 17:
              _state = options.interactive && options.stdin ? 18 : 19;
              break;
            case 18:
              console.error("Cannot specify --interactive and --stdin");
              _state = 52;
              break;
            case 19:
              _state = options.interactive && filenames.length ? 20 : 21;
              break;
            case 20:
              console.error("Cannot specify --interactive and filenames");
              _state = 52;
              break;
            case 21:
              _state = options.stdin ? 22 : 23;
              break;
            case 22:
              cli.withStdin(function (code, callback) {
                __fromPromise(handleCode(code))(callback);
              });
              _state = 52;
              break;
            case 23:
              _state = options.watch && !filenames.length ? 24 : 25;
              break;
            case 24:
              console.error("Cannot specify --watch without filenames");
              _state = 52;
              break;
            case 25:
              _state = options.watch && !options.compile ? 26 : 27;
              break;
            case 26:
              console.error("Must specify --compile if specifying --watch");
              _state = 52;
              break;
            case 27:
              _state = options.watch && options.join ? 28 : 29;
              break;
            case 28:
              console.error("TODO: Cannot specify --watch and --join");
              _state = 52;
              break;
            case 29:
              _state = options.watch && options.sourcemap ? 30 : 31;
              break;
            case 30:
              console.error("TODO: Cannot specify --watch and --sourcemap");
              _state = 52;
              break;
            case 31:
              _state = filenames.length ? 32 : 50;
              break;
            case 32:
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
              inputP = {};
              for (_arr = __toArray(filenames), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                filename = _arr[_i];
                inputP[filename] = __toPromise(fs.readFile, fs, [filename, "utf8"]);
              }
              ++_state;
              return { done: false, value: __everyPromise(inputP) };
            case 33:
              input = _received;
              compiled = {};
              handleSingle = __promise(function (filename, code) {
                var _e2, _send2, _state2, _step2, _throw2, compilation, endTime,
                    startTime;
                _state2 = 0;
                function _close2() {
                  _state2 = 6;
                }
                function _step2(_received) {
                  while (true) {
                    switch (_state2) {
                    case 0:
                      opts.filename = filename;
                      _state2 = options.compile ? 1 : 3;
                      break;
                    case 1:
                      process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
                      startTime = Date.now();
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.compile(code, opts)
                      };
                    case 2:
                      compilation = _received;
                      endTime = Date.now();
                      process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                      compiled[filename] = compilation.code;
                      _state2 = 6;
                      break;
                    case 3:
                      _state2 = options.stdout || options.gjs || options.ast || options.nodes ? 4 : 5;
                      break;
                    case 4:
                      _state2 = 6;
                      return { done: false, value: handleCode(code) };
                    case 5:
                      ++_state2;
                      return {
                        done: false,
                        value: gorilla.run(code, opts)
                      };
                    case 6:
                      return { done: true, value: void 0 };
                    default: throw Error("Unknown state: " + _state2);
                    }
                  }
                }
                function _throw2(_e2) {
                  _close2();
                  throw _e2;
                }
                function _send2(_received) {
                  try {
                    return _step2(_received);
                  } catch (_e2) {
                    _throw2(_e2);
                  }
                }
                return {
                  close: _close2,
                  iterator: function () {
                    return this;
                  },
                  next: function () {
                    return _send2(void 0);
                  },
                  send: _send2,
                  "throw": function (_e2) {
                    _throw2(_e2);
                    return _send2(void 0);
                  }
                };
              });
              _state = !options.join ? 34 : 38;
              break;
            case 34:
              _arr = __toArray(filenames);
              _i = 0;
              _len = _arr.length;
              ++_state;
            case 35:
              _state = _i < _len ? 36 : 40;
              break;
            case 36:
              filename = _arr[_i];
              ++_state;
              return {
                done: false,
                value: handleSingle(filename, input[filename])
              };
            case 37:
              ++_i;
              _state = 35;
              break;
            case 38:
              opts.filenames = filenames;
              process.stdout.write("Compiling " + __strnum(filenames.join(", ")) + " ... ");
              startTime = Date.now();
              ++_state;
              return {
                done: false,
                value: gorilla.compile(
                  (function () {
                    var _arr, _arr2, _i, _len, filename;
                    for (_arr = [], _arr2 = __toArray(filenames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                      filename = _arr2[_i];
                      _arr.push(input[filename]);
                    }
                    return _arr;
                  }()),
                  opts
                )
              };
            case 39:
              compilation = _received;
              endTime = Date.now();
              process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
              compiled.join = compilation.code;
              ++_state;
            case 40:
              getJsOutputPath = function (filename) {
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
              };
              writeSingle = __promise(function (filename, jsCode) {
                var _e2, _send2, _state2, _step2, _throw2, defer, exists, jsDir,
                    jsPath;
                _state2 = 0;
                function _close2() {
                  _state2 = 4;
                }
                function _step2(_received) {
                  while (true) {
                    switch (_state2) {
                    case 0:
                      jsPath = getJsOutputPath(filename);
                      jsDir = path.dirname(jsPath);
                      defer = __defer();
                      fs.exists(jsDir, defer.fulfill);
                      ++_state2;
                      return { done: false, value: defer.promise };
                    case 1:
                      exists = _received;
                      _state2 = !exists ? 2 : 3;
                      break;
                    case 2:
                      ++_state2;
                      return {
                        done: false,
                        value: __toPromise(child_process.exec, child_process, ["mkdir -p " + __strnum(jsDir)])
                      };
                    case 3:
                      ++_state2;
                      return {
                        done: false,
                        value: __toPromise(fs.writeFile, fs, [jsPath, jsCode, "utf8"])
                      };
                    case 4:
                      return { done: true, value: void 0 };
                    default: throw Error("Unknown state: " + _state2);
                    }
                  }
                }
                function _throw2(_e2) {
                  _close2();
                  throw _e2;
                }
                function _send2(_received) {
                  try {
                    return _step2(_received);
                  } catch (_e2) {
                    _throw2(_e2);
                  }
                }
                return {
                  close: _close2,
                  iterator: function () {
                    return this;
                  },
                  next: function () {
                    return _send2(void 0);
                  },
                  send: _send2,
                  "throw": function (_e2) {
                    _throw2(_e2);
                    return _send2(void 0);
                  }
                };
              });
              _state = options.compile ? 41 : 47;
              break;
            case 41:
              _state = !options.join ? 42 : 46;
              break;
            case 42:
              _arr = __toArray(filenames);
              _i = 0;
              _len = _arr.length;
              ++_state;
            case 43:
              _state = _i < _len ? 44 : 47;
              break;
            case 44:
              filename = _arr[_i];
              ++_state;
              return {
                done: false,
                value: writeSingle(filename, compiled[filename])
              };
            case 45:
              ++_i;
              _state = 43;
              break;
            case 46:
              if (options.output) {
                jsPath = options.output;
              } else {
                jsPath = path.join(path.dirname(filenames[0]), "out.js");
              }
              ++_state;
              return {
                done: false,
                value: writeSingle(jsPath, compiled.join)
              };
            case 47:
              _state = sourcemap != null ? 48 : 49;
              break;
            case 48:
              ++_state;
              return {
                done: false,
                value: __toPromise(fs.writeFile, fs, [options.sourcemap, opts.sourcemap.toString(), "utf8"])
              };
            case 49:
              if (options.watch) {
                watchQueue = {};
                handleQueue = (function () {
                  var inHandle;
                  inHandle = false;
                  return function () {
                    var bestName, lowestTime, name, time;
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
                      return __generatorToPromise((function () {
                        var _e2, _send2, _state2, _step2, _throw2, e;
                        _state2 = 0;
                        function _close2() {
                          _state2 = 4;
                        }
                        function _step2(_received) {
                          while (true) {
                            switch (_state2) {
                            case 0:
                              ++_state2;
                              return {
                                done: false,
                                value: handleSingle(bestName, input[bestName])
                              };
                            case 1:
                              _state2 = 3;
                              return { done: false, value: writeSingle(bestName) };
                            case 2:
                              console.error(typeof e !== "undefined" && e !== null && e.stack || e);
                              ++_state2;
                            case 3:
                              inHandle = false;
                              handleQueue();
                              ++_state2;
                            case 4:
                              return { done: true, value: void 0 };
                            default: throw Error("Unknown state: " + _state2);
                            }
                          }
                        }
                        function _throw2(_e2) {
                          if (_state2 <= 1) {
                            e = _e2;
                            _state2 = 2;
                          } else {
                            _close2();
                            throw _e2;
                          }
                        }
                        function _send2(_received) {
                          while (true) {
                            try {
                              return _step2(_received);
                            } catch (_e2) {
                              _throw2(_e2);
                            }
                          }
                        }
                        return {
                          close: _close2,
                          iterator: function () {
                            return this;
                          },
                          next: function () {
                            return _send2(void 0);
                          },
                          send: _send2,
                          "throw": function (_e2) {
                            _throw2(_e2);
                            return _send2(void 0);
                          }
                        };
                      }()));
                    } else {
                      return inHandle = false;
                    }
                  };
                }());
                for (_arr = __toArray(filenames), _i = 0, _len = _arr.length, _f = function (filename) {
                  return fs.watch(filename, function (event, name) {
                    var _once2;
                    if (name == null) {
                      name = filename;
                    }
                    fs.readFile(name, (_once2 = false, function (err, code) {
                      if (_once2) {
                        throw Error("Attempted to call function more than once");
                      } else {
                        _once2 = true;
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
                console.log("Watching " + __strnum(filenames.join(", ")) + "...");
              }
              _state = 52;
              break;
            case 50:
              require("./repl").start(options.gjs ? { pipe: "gjs" } : void 0);
              _state = 52;
              break;
            case 51:
              console.error(typeof e !== "undefined" && e !== null && e.stack || e);
              process.exit(1);
              ++_state;
            case 52:
              return { done: true, value: void 0 };
            default: throw Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          if (_state <= 50) {
            e = _e;
            _state = 51;
          } else {
            _close();
            throw _e;
          }
        }
        function _send(_received) {
          while (true) {
            try {
              return _step(_received);
            } catch (_e) {
              _throw(_e);
            }
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (_e) {
            _throw(_e);
            return _send(void 0);
          }
        };
      }()));
    });
  }));
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
