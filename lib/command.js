(function (GLOBAL) {
  "use strict";
  var __create, __defer, __delay, __generatorToPromise, __import, __isArray,
      __owns, __promise, __slice, __toArray, __toPromise, __typeof, _once,
      child_process, fs, gorilla, path, setImmediate, util;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
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
            _ref = null;
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
                result = ret;
              },
              function (err) {
                state = 2;
                result = err;
              },
              true
            );
            switch (state) {
            case 0: throw new Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw new Error("Unknown state");
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
    var _ref, fulfill, promise;
    if (typeof milliseconds !== "number") {
      throw new TypeError("Expected milliseconds to be a Number, got " + __typeof(milliseconds));
    }
    if (milliseconds <= 0) {
      return __defer.fulfilled(value);
    } else {
      _ref = __defer();
      fulfill = _ref.fulfill;
      promise = _ref.promise;
      _ref = null;
      setTimeout(
        function () {
          fulfill(value);
        },
        milliseconds
      );
      return promise;
    }
  };
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw new TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw new TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw new TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
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
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __promise = function (value, allowSync) {
    var factory;
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
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
      factory.maybeSync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        );
      };
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
  };
  __slice = Array.prototype.slice;
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
    }
  };
  __toPromise = function (func, context, args) {
    var _ref, fulfill, promise, reject;
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    _ref = __defer();
    promise = _ref.promise;
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    _ref = null;
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          reject(err);
        } else {
          fulfill(value);
        }
      }
    ]));
    return promise;
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
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
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
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  gorilla = require("./gorilla");
  util = require("util");
  fs = require("fs");
  path = require("path");
  child_process = require("child_process");
  child_process.exec("which gjs", (_once = false, function (err, whichGjsStdout, whichGjsStderr) {
    var argv, filenames, hasGjs, main, optimist;
    if (_once) {
      throw new Error("Attempted to call function more than once");
    } else {
      _once = true;
    }
    hasGjs = err == null && whichGjsStdout.length && !whichGjsStderr.length;
    optimist = require("optimist").usage("$0 [OPTIONS] path/to/script.gs", {
      help: { boolean: true, desc: "Show this help screen" },
      v: { alias: "version", boolean: true, desc: "GorillaScript v" + gorilla.version },
      a: {
        alias: "ast",
        boolean: true,
        desc: "Display JavaScript AST nodes instead of compilation"
      },
      b: { alias: "bare", boolean: true, desc: "Compile without safety top-level closure wrapper" },
      c: { alias: "compile", boolean: true, desc: "Compile to JavaScript and save as .js files" },
      o: { alias: "output", string: true, desc: "Set the file/directory for compiled JavaScript" },
      i: { alias: "interactive", boolean: true, desc: "Run interactively with the REPL" },
      n: {
        alias: "parse",
        boolean: true,
        desc: "Display GorillaScript parser nodes instead of compilation"
      },
      p: { alias: "stdout", boolean: true, desc: "Print the compiled JavaScript to stdout" },
      s: { alias: "stdin", boolean: true, desc: "Listen for and compile GorillaScript from stdin" },
      e: { alias: "eval", string: true, desc: "Compile and a string from command line" },
      u: { alias: "uglify", boolean: true, desc: "Uglify compiled code with UglifyJS2" },
      minify: { boolean: true, desc: "Minimize the use of unnecessary whitespace" },
      m: { alias: "map", string: true, desc: "Build a SourceMap" },
      "source-root": {
        string: true,
        desc: "Specify a sourceRoot in a SourceMap, defaults to ''"
      },
      j: {
        alias: "join",
        boolean: true,
        desc: "Join all the generated JavaScript into a single file"
      },
      "no-prelude": { boolean: true, desc: "Do not include the standard prelude" },
      w: { alias: "watch", boolean: true, desc: "Watch for changes and compile as-needed" },
      options: { string: true, desc: "a JSON object of options to pass into the compiler" },
      coverage: { boolean: true, desc: "Instrument with _$jscoverage support" }
    });
    if (hasGjs) {
      optimist.option("gjs", { boolean: true, desc: "Run with gjs" });
    }
    optimist.check(function (argv) {
      function exclusive() {
        var _i, _len, found, opt, opts;
        opts = __slice.call(arguments);
        found = null;
        for (_i = 0, _len = opts.length; _i < _len; ++_i) {
          opt = opts[_i];
          if (opt === "_") {
            if (argv._.length) {
              if (!found) {
                found = "filenames";
              } else {
                throw "Cannot specify both " + found + " and filenames";
              }
            }
          } else if (argv[opt]) {
            if (!found) {
              found = "--" + opt;
            } else {
              throw "Cannot specify both " + found + " and --" + opt;
            }
          }
        }
      }
      function depend(mainOpt) {
        var _i, _len, opt, opts;
        opts = __slice.call(arguments, 1);
        if (argv[mainOpt]) {
          for (_i = 0, _len = opts.length; _i < _len; ++_i) {
            opt = opts[_i];
            if (!argv[opt]) {
              throw "Must specify --" + opt + " if specifying --" + mainOpt;
            }
          }
        }
      }
      exclusive("ast", "compile", "nodes", "stdout");
      exclusive("nodes", "cov");
      depend("output", "compile");
      depend("map", "output");
      depend("source-root", "map");
      depend("compile", "_");
      exclusive("interactive", "_", "stdin", "eval");
      depend("watch", "compile");
      depend("join", "output");
      if (argv.watch) {
        if (argv.join) {
          throw "TODO: --watch with --join";
        }
        if (argv.map) {
          throw "TODO: --watch with --map";
        }
      }
      if (argv._.length > 1 && argv.map && !argv.join) {
        throw "Cannot specify --map with multiple files unless using --join";
      }
      if (argv.map && typeof argv.map !== "string") {
        throw "Must specify a filename with --map";
      }
      if (argv.options) {
        try {
          if (typeof JSON.parse(argv.options) !== "object" || JSON.parse(argv.options) === null) {
            throw "Expected --options to provide an object";
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw "Unable to parse options: " + e.message;
          } else {
            throw e;
          }
        }
      }
    });
    argv = optimist.argv;
    function readStdin() {
      var buffer, defer;
      defer = __defer();
      buffer = "";
      process.stdin.on("data", function (chunk) {
        return buffer += chunk.toString();
      });
      process.stdin.on("end", function () {
        return defer.fulfill(buffer);
      });
      process.stdin.resume();
      return defer.promise;
    }
    filenames = argv._;
    main = __generatorToPromise((function () {
      var _arr, _arr2, _e, _i, _len, _ref, _send, _state, _step, _throw, _time,
          baseFilenames, code, compileTime, filename, handleCode, handleQueue,
          i, input, item, newArgv, options, replOpts, watchFile, watchQueue;
      _state = 0;
      function _close() {
        _state = 30;
      }
      function getJsOutputPath(filename) {
        var baseDir, dir;
        if (argv.output && filenames.length === 1) {
          return argv.output;
        } else {
          baseDir = path.dirname(filename);
          if (argv.output) {
            dir = path.join(argv.output, baseDir);
          } else {
            dir = baseDir;
          }
          return path.join(dir, path.basename(filename, path.extname(filename)) + ".js");
        }
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            _state = argv.help ? 1 : 2;
            break;
          case 1:
            _state = 30;
            return { done: true, value: optimist.showHelp(console.log) };
          case 2:
            _state = argv.version ? 3 : 4;
            break;
          case 3:
            _state = 30;
            return { done: true, value: console.log("GorillaScript v" + gorilla.version) };
          case 4:
            options = {};
            if (argv.options) {
              __import(options, JSON.parse(argv.options));
            }
            if (argv.uglify) {
              options.undefinedName = "undefined";
              options.uglify = true;
            }
            if (argv.minify) {
              options.minify = true;
            }
            if (argv.bare) {
              options.bare = true;
            }
            if (argv.coverage) {
              options.coverage = true;
            }
            _state = argv["no-prelude"] ? 5 : 6;
            break;
          case 5:
            options.noPrelude = true;
            _state = 7;
            break;
          case 6:
            ++_state;
            return { done: false, value: gorilla.init() };
          case 7:
            _state = argv.interactive || !filenames.length && !argv.stdin && !argv["eval"] ? 8 : 9;
            break;
          case 8:
            replOpts = { stdout: argv.stdout, parse: argv.parse, ast: argv.ast };
            if (argv.gjs) {
              replOpts.pipe = "gjs";
            }
            _state = 30;
            return { done: true, value: require("./repl").start(replOpts) };
          case 9:
            if (argv.stdout) {
              options.writer = function (text) {
                return process.stdout.write(text);
              };
            }
            handleCode = __promise(function (code) {
              var _e2, _send2, _state2, _step2, _throw2, ast, compiled, evaled,
                  gjs, nodes, result;
              _state2 = 0;
              function _close2() {
                _state2 = 20;
              }
              function _step2(_received) {
                while (true) {
                  switch (_state2) {
                  case 0:
                    _state2 = argv.ast ? 1 : 3;
                    break;
                  case 1:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.ast(code, options)
                    };
                  case 2:
                    ast = _received;
                    result = util.inspect(ast.node, false, null);
                    _state2 = 18;
                    break;
                  case 3:
                    _state2 = argv.parse ? 4 : 6;
                    break;
                  case 4:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.parse(code, options)
                    };
                  case 5:
                    nodes = _received;
                    result = util.inspect(nodes.result, false, null);
                    _state2 = 18;
                    break;
                  case 6:
                    _state2 = argv.stdout ? 7 : 9;
                    break;
                  case 7:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.compile(code, options)
                    };
                  case 8:
                    compiled = _received;
                    if (options.uglify) {
                      process.stdout.write("\n");
                    }
                    result = compiled.code;
                    _state2 = 18;
                    break;
                  case 9:
                    _state2 = argv.gjs ? 10 : 13;
                    break;
                  case 10:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.compile(code, __import({ "eval": true }, options))
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
                    _state2 = 18;
                    break;
                  case 13:
                    _state2 = argv["eval"] ? 14 : 16;
                    break;
                  case 14:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla["eval"](code, options)
                    };
                  case 15:
                    evaled = _received;
                    result = util.inspect(evaled, false, null);
                    _state2 = 18;
                    break;
                  case 16:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.run(code, options)
                    };
                  case 17:
                    result = "";
                    ++_state2;
                  case 18:
                    _state2 = result !== "" ? 19 : 20;
                    break;
                  case 19:
                    process.stdout.write(result);
                    ++_state2;
                    return {
                      done: true,
                      value: process.stdout.write("\n")
                    };
                  case 20:
                    return { done: true, value: void 0 };
                  default: throw new Error("Unknown state: " + _state2);
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
            if (argv["embedded-generator"]) {
              options.embeddedGenerator = true;
              argv.embedded = true;
            }
            if (argv.embedded) {
              options.embedded = true;
              options.noindent = true;
            }
            _state = argv["eval"] != null ? 10 : 12;
            break;
          case 10:
            ++_state;
            return { done: false, value: handleCode(String(argv["eval"])) };
          case 11:
            _state = 30;
            return { done: true, value: _received };
          case 12:
            _state = argv.stdin ? 13 : 16;
            break;
          case 13:
            ++_state;
            return { done: false, value: readStdin() };
          case 14:
            code = _received;
            ++_state;
            return { done: false, value: handleCode(String(code)) };
          case 15:
            _state = 30;
            return { done: true, value: _received };
          case 16:
            if (!filenames.length) {
              throw new Error("Expected at least one filename by this point");
            }
            _state = !argv.compile ? 17 : 20;
            break;
          case 17:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [filenames[0]])
            };
          case 18:
            input = _received;
            options.filename = filenames[0];
            newArgv = ["gorilla"];
            for (_arr = __toArray(process.argv), i = 0, _len = _arr.length; i < _len; ++i) {
              item = _arr[i];
              if (item === filenames[0]) {
                newArgv.push.apply(newArgv, __toArray(__slice.call(process.argv, i)));
                break;
              }
            }
            process.argv = newArgv;
            ++_state;
            return { done: false, value: handleCode(String(input)) };
          case 19:
            _state = 30;
            return { done: true, value: _received };
          case 20:
            if (argv.map) {
              options.sourceMap = { file: argv.map, sourceRoot: argv["source-root"] || "" };
            }
            _state = filenames.length > 1 && argv.join ? 21 : 23;
            break;
          case 21:
            _arr = [];
            for (_arr2 = __toArray(filenames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              filename = _arr2[_i];
              _arr.push(path.basename(filename));
            }
            baseFilenames = _arr;
            process.stdout.write("Compiling " + baseFilenames.join(", ") + " ... ");
            _time = new Date().getTime();
            ++_state;
            return {
              done: false,
              value: gorilla.compileFile((_ref = __import({}, options), _ref.input = filenames, _ref.output = argv.output, _ref))
            };
          case 22:
            compileTime = new Date().getTime() - _time;
            process.stdout.write((compileTime / 1000).toFixed(3) + " seconds\n");
            _state = 28;
            break;
          case 23:
            _arr = __toArray(filenames);
            _i = 0;
            _len = _arr.length;
            ++_state;
          case 24:
            _state = _i < _len ? 25 : 28;
            break;
          case 25:
            filename = _arr[_i];
            process.stdout.write("Compiling " + path.basename(filename) + " ... ");
            _time = new Date().getTime();
            ++_state;
            return {
              done: false,
              value: gorilla.compileFile((_ref = __import({}, options), _ref.input = filename, _ref.output = getJsOutputPath(filename), _ref))
            };
          case 26:
            compileTime = new Date().getTime() - _time;
            process.stdout.write((compileTime / 1000).toFixed(3) + " seconds\n");
            ++_state;
          case 27:
            ++_i;
            _state = 24;
            break;
          case 28:
            _state = argv.watch ? 29 : 30;
            break;
          case 29:
            watchQueue = __create(null);
            handleQueue = (function () {
              var inHandle;
              inHandle = false;
              return function () {
                var bestName, lowestTime, name, time;
                if (inHandle) {
                  return;
                }
                lowestTime = new Date().getTime() - 1000;
                for (name in watchQueue) {
                  if (__owns.call(watchQueue, name)) {
                    time = watchQueue[name];
                    if (time < lowestTime) {
                      lowestTime = time;
                      bestName = name;
                    }
                  }
                }
                if (bestName != null) {
                  delete watchQueue[bestName];
                  inHandle = true;
                  return __generatorToPromise((function () {
                    var _e2, _ref, _send2, _state2, _step2, _throw2, _time,
                        compileTime, e;
                    _state2 = 0;
                    function _close2() {
                      _state2 = 4;
                    }
                    function _step2(_received) {
                      while (true) {
                        switch (_state2) {
                        case 0:
                          process.stdout.write("Compiling " + path.basename(bestName) + " ... ");
                          _time = new Date().getTime();
                          ++_state2;
                          return {
                            done: false,
                            value: gorilla.compileFile((_ref = __import({}, options), _ref.input = bestName, _ref.output = getJsOutputPath(bestName), _ref))
                          };
                        case 1:
                          compileTime = new Date().getTime() - _time;
                          process.stdout.write((compileTime / 1000).toFixed(3) + " seconds\n");
                          _state2 = 3;
                          break;
                        case 2:
                          console.error(typeof e !== "undefined" && e !== null && e.stack || e);
                          ++_state2;
                        case 3:
                          inHandle = false;
                          ++_state2;
                          return { done: true, value: handleQueue() };
                        case 4:
                          return { done: true, value: void 0 };
                        default: throw new Error("Unknown state: " + _state2);
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
                }
              };
            }());
            watchFile = function (filename) {
              var watcher;
              watcher = fs.watch(filename, function (event, name) {
                if (name == null) {
                  name = filename;
                }
                watchQueue[name] = new Date().getTime();
                watcher.close();
                setTimeout(
                  function () {
                    return watchFile(filename);
                  },
                  50
                );
              });
              watcher.on("error", function (e) {
                return console.error(e != null && e.stack || e);
              });
            };
            for (_arr = __toArray(filenames), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              filename = _arr[_i];
              watchFile(filename);
            }
            setInterval(handleQueue, 17);
            ++_state;
            return { done: true, value: console.log("Watching " + filenames.join(", ") + "...") };
          case 30:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        _close();
        throw _e;
      }
      function _send(_received) {
        try {
          return _step(_received);
        } catch (_e) {
          _throw(_e);
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
    return main.then(null, function (e) {
      console.error(e != null && e.stack || e);
      return process.exit(1);
    });
  }));
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
