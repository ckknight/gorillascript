(function (GLOBAL) {
  "use strict";
  var __defer, __delay, __everyPromise, __generatorToPromise, __import,
      __isArray, __num, __owns, __promise, __slice, __strnum, __toArray,
      __toPromise, __typeof, _once, _this, child_process, fs, gorilla, path,
      setImmediate, util;
  _this = this;
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
  gorilla = require("./gorilla");
  util = require("util");
  fs = require("fs");
  path = require("path");
  child_process = require("child_process");
  child_process.exec("which gjs", (_once = false, function (err, whichGjsStdout, whichGjsStderr) {
    var argv, filenames, hasGjs, main, optimist;
    if (_once) {
      throw Error("Attempted to call function more than once");
    } else {
      _once = true;
    }
    hasGjs = err == null && whichGjsStdout.length && !whichGjsStderr.length;
    optimist = require("optimist").usage("$0 [OPTIONS] path/to/script.gs", {
      help: { boolean: true, desc: "Show this help screen" },
      v: { alias: "version", boolean: true, desc: "GorillaScript v" + __strnum(gorilla.version) },
      a: { alias: "ast", boolean: true, desc: "Display JavaScript AST nodes instead of compilation" },
      b: { alias: "bare", boolean: true, desc: "Compile without safety top-level closure wrapper" },
      c: { alias: "compile", boolean: true, desc: "Compile to JavaScript and save as .js files" },
      o: { alias: "output", string: true, desc: "Set the file/directory for compiled JavaScript" },
      i: { alias: "interactive", boolean: true, desc: "Run interactively with the REPL" },
      n: { alias: "parse", boolean: true, desc: "Display GorillaScript parser nodes instead of compilation" },
      p: { alias: "stdout", boolean: true, desc: "Print the compiled JavaScript to stdout" },
      s: { alias: "stdin", boolean: true, desc: "Listen for and compile GorillaScript from stdin" },
      e: { alias: "eval", string: true, desc: "Compile and a string from command line" },
      u: { alias: "uglify", boolean: true, desc: "Uglify compiled code with UglifyJS2" },
      minify: { boolean: true, desc: "Minimize the use of unnecessary whitespace" },
      m: { alias: "sourcemap", string: true, desc: "Build a SourceMap" },
      j: { alias: "join", boolean: true, desc: "Join all the generated JavaScript into a single file" },
      "no-prelude": { boolean: true, desc: "Do not include the standard prelude" },
      w: { alias: "watch", boolean: true, desc: "Watch for changes and compile as-needed" },
      options: { string: true, desc: "a JSON object of options to pass into the compiler" }
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
                throw "Cannot specify both " + __strnum(found) + " and filenames";
              }
            }
          } else if (argv[opt]) {
            if (!found) {
              found = "--" + __strnum(opt);
            } else {
              throw "Cannot specify both " + __strnum(found) + " and --" + __strnum(opt);
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
              throw "Must specify --" + __strnum(opt) + " if specifying --" + __strnum(mainOpt);
            }
          }
        }
      }
      exclusive("ast", "compile", "nodes", "stdout");
      depend("output", "compile");
      depend("sourcemap", "output");
      depend("compile", "_");
      exclusive("interactive", "_", "stdin", "eval");
      depend("watch", "compile");
      depend("join", "output");
      if (argv.watch) {
        if (argv.join) {
          throw "TODO: --watch with --join";
        }
        if (argv.sourcemap) {
          throw "TODO: --watch with --sourcemap";
        }
      }
      if (__num(argv._.length) > 1 && argv.sourcemap && !argv.join) {
        throw "Cannot specify --sourcemap with multiple files unless using --join";
      }
      if (argv.options) {
        try {
          if (typeof JSON.parse(argv.options) !== "object" || JSON.parse(argv.options) === null) {
            throw "Expected --options to provide an object";
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw "Unable to parse options: " + __strnum(e.message);
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
        return buffer += __strnum(chunk.toString());
      });
      process.stdin.on("end", function () {
        return defer.fulfill(buffer);
      });
      process.stdin.resume();
      return defer.promise;
    }
    filenames = argv._;
    main = __generatorToPromise((function () {
      var _arr, _e, _f, _i, _len, _send, _state, _step, _throw, code,
          compilation, compiled, endTime, filename, getJsOutputPath, handleCode,
          handleQueue, handleSingle, input, inputP, lang, options, replOpts,
          sourcemap, startTime, watchQueue, writeSingle;
      _state = 0;
      function _close() {
        _state = 35;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            lang = "js";
            _state = argv.help ? 1 : 2;
            break;
          case 1:
            _state = 35;
            return { done: true, value: optimist.showHelp(console.log) };
          case 2:
            _state = argv.version ? 3 : 4;
            break;
          case 3:
            _state = 35;
            return { done: true, value: console.log("GorillaScript v" + __strnum(gorilla.version)) };
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
            _state = argv["no-prelude"] ? 5 : 6;
            break;
          case 5:
            options.noPrelude = true;
            _state = 7;
            break;
          case 6:
            ++_state;
            return { done: false, value: gorilla.init({ lang: lang }) };
          case 7:
            _state = argv.interactive || !filenames.length && !argv.stdin && !argv["eval"] ? 8 : 9;
            break;
          case 8:
            replOpts = { stdout: argv.stdout, parse: argv.parse, ast: argv.ast };
            if (argv.gjs) {
              replOpts.pipe = "gjs";
            }
            _state = 35;
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
                _state2 = 16;
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
                    _state2 = 15;
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
                    _state2 = 15;
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
                    _state2 = 15;
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
                    _state2 = 15;
                    break;
                  case 13:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla["eval"](code, options)
                    };
                  case 14:
                    evaled = _received;
                    result = util.inspect(evaled, false, null);
                    ++_state2;
                  case 15:
                    ++_state2;
                    return {
                      done: true,
                      value: result !== "" ? (process.stdout.write(result), process.stdout.write("\n")) : void 0
                    };
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
            _state = argv["eval"] != null ? 10 : 12;
            break;
          case 10:
            ++_state;
            return { done: false, value: handleCode(String(argv["eval"])) };
          case 11:
            _state = 35;
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
            _state = 35;
            return { done: true, value: _received };
          case 16:
            if (!filenames.length) {
              throw Error("Trying to compile without filenames");
            }
            if (argv.sourcemap) {
              sourcemap = require("./sourcemap")(argv.output, ".");
            }
            options.sourcemap = sourcemap;
            if (argv["embedded-generator"]) {
              options.embeddedGenerator = true;
              argv.embedded = true;
            }
            if (argv.embedded) {
              options.embedded = true;
              options.noindent = true;
            }
            inputP = {};
            for (_arr = __toArray(filenames), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              filename = _arr[_i];
              inputP[filename] = __toPromise(fs.readFile, fs, [filename, "utf8"]);
            }
            ++_state;
            return { done: false, value: __everyPromise(inputP) };
          case 17:
            input = _received;
            compiled = {};
            handleSingle = __promise(function (filename, code) {
              var _e2, _send2, _state2, _step2, _throw2, compilation, endTime,
                  startTime;
              _state2 = 0;
              function _close2() {
                _state2 = 8;
              }
              function _step2(_received) {
                while (true) {
                  switch (_state2) {
                  case 0:
                    options.filename = filename;
                    _state2 = argv.compile ? 1 : 3;
                    break;
                  case 1:
                    process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
                    startTime = Date.now();
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.compile(code, options)
                    };
                  case 2:
                    compilation = _received;
                    endTime = Date.now();
                    process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
                    _state2 = 8;
                    return { done: true, value: compiled[filename] = compilation.code };
                  case 3:
                    _state2 = argv.stdout || argv.gjs || argv.ast || argv.parse ? 4 : 6;
                    break;
                  case 4:
                    ++_state2;
                    return { done: false, value: handleCode(code) };
                  case 5:
                    _state2 = 8;
                    return { done: true, value: _received };
                  case 6:
                    ++_state2;
                    return {
                      done: false,
                      value: gorilla.run(code, options)
                    };
                  case 7:
                    ++_state2;
                    return { done: true, value: _received };
                  case 8:
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
            _state = !argv.join ? 18 : 22;
            break;
          case 18:
            _arr = __toArray(filenames);
            _i = 0;
            _len = _arr.length;
            ++_state;
          case 19:
            _state = _i < _len ? 20 : 24;
            break;
          case 20:
            filename = _arr[_i];
            ++_state;
            return {
              done: false,
              value: handleSingle(filename, input[filename])
            };
          case 21:
            ++_i;
            _state = 19;
            break;
          case 22:
            options.filenames = filenames;
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
                options
              )
            };
          case 23:
            compilation = _received;
            endTime = Date.now();
            process.stdout.write(__strnum(((endTime - startTime) / 1000).toFixed(3)) + " seconds\n");
            compiled.join = compilation.code;
            ++_state;
          case 24:
            getJsOutputPath = function (filename) {
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
                return path.join(dir, __strnum(path.basename(filename, path.extname(filename))) + ".js");
              }
            };
            writeSingle = __promise(function (filename, jsCode) {
              var _e2, _send2, _state2, _step2, _throw2, defer, exists, jsDir,
                  jsPath;
              _state2 = 0;
              function _close2() {
                _state2 = 5;
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
                    ++_state2;
                    return { done: true, value: _received };
                  case 5:
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
            _state = argv.compile ? 25 : 31;
            break;
          case 25:
            _state = !argv.join ? 26 : 30;
            break;
          case 26:
            _arr = __toArray(filenames);
            _i = 0;
            _len = _arr.length;
            ++_state;
          case 27:
            _state = _i < _len ? 28 : 31;
            break;
          case 28:
            filename = _arr[_i];
            ++_state;
            return {
              done: false,
              value: writeSingle(filename, compiled[filename])
            };
          case 29:
            ++_i;
            _state = 27;
            break;
          case 30:
            ++_state;
            return {
              done: false,
              value: writeSingle(argv.output, compiled.join)
            };
          case 31:
            _state = sourcemap != null ? 32 : 34;
            break;
          case 32:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.writeFile, fs, [argv.sourcemap, options.sourcemap.toString(), "utf8"])
            };
          case 33:
            process.stdout.write("Saved " + __strnum(argv.sourcemap));
            ++_state;
          case 34:
            ++_state;
            if (argv.watch) {
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
                            ++_state2;
                            return { done: true, value: handleQueue() };
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
            ++_state;
          case 35:
            return { done: true, value: void 0 };
          default: throw Error("Unknown state: " + _state);
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
