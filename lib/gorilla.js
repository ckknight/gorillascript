(function (GLOBAL) {
  "use strict";
  var __defer, __everyPromise, __generatorToPromise, __import, __isArray, __lte,
      __num, __owns, __promise, __promiseLoop, __slice, __strnum, __toArray,
      __toPromise, __typeof, _ref, ast, fetchAndParsePreludeMacros, fs, init,
      isAcceptableIdent, os, parser, path, real__filename, setImmediate,
      SourceMap, writeFileWithMkdirp, writeFileWithMkdirpSync;
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
  __everyPromise = function (promises) {
    var _arr, _ref, fulfill, i, isArray, k, promise, reject, remaining, result,
        resultPromise;
    if (typeof promises !== "object" || promises === null) {
      throw new TypeError("Expected promises to be an Object, got " + __typeof(promises));
    }
    isArray = __isArray(promises);
    _ref = __defer();
    resultPromise = _ref.promise;
    fulfill = _ref.fulfill;
    reject = _ref.reject;
    _ref = null;
    if (isArray) {
      result = [];
    } else {
      result = {};
    }
    remaining = 1;
    function dec() {
      if (--remaining === 0) {
        fulfill(result);
      }
    }
    function handle(key, promise) {
      promise.then(
        function (value) {
          result[key] = value;
          dec();
        },
        reject
      );
    }
    if (isArray) {
      for (_arr = __toArray(promises), i = _arr.length; i--; ) {
        promise = _arr[i];
        ++remaining;
        handle(i, promise);
      }
    } else {
      for (k in promises) {
        if (__owns.call(promises, k)) {
          promise = promises[k];
          ++remaining;
          handle(k, promise);
        }
      }
    }
    dec();
    return resultPromise;
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
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw new TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
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
  __promiseLoop = function (limit, length, body) {
    var _ref, done, fulfill, index, promise, reject, result, slotsUsed;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (typeof body !== "function") {
      throw new TypeError("Expected body to be a Function, got " + __typeof(body));
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    result = [];
    done = false;
    slotsUsed = 0;
    _ref = __defer();
    fulfill = _ref.fulfill;
    reject = _ref.reject;
    promise = _ref.promise;
    _ref = null;
    index = 0;
    function handle(index) {
      ++slotsUsed;
      return body(index).then(
        function (value) {
          result[index] = value;
          --slotsUsed;
          return flush();
        },
        function (reason) {
          done = true;
          return reject(reason);
        }
      );
    }
    function flush() {
      for (; !done && slotsUsed < limit && index < length; ++index) {
        handle(index);
      }
      if (!done && index >= length && slotsUsed === 0) {
        done = true;
        return fulfill(result);
      }
    }
    setImmediate(flush);
    return promise;
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
      throw new TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
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
  parser = require("./parser");
  ast = require("./jsast");
  os = require("os");
  fs = require("fs");
  path = require("path");
  SourceMap = require("./source-map");
  _ref = require("./utils");
  writeFileWithMkdirp = _ref.writeFileWithMkdirp;
  writeFileWithMkdirpSync = _ref.writeFileWithMkdirpSync;
  _ref = null;
  isAcceptableIdent = require("./jsutils").isAcceptableIdent;
  exports.version = "0.9.10";
  exports.ParserError = parser.ParserError;
  exports.MacroError = parser.MacroError;
  if (require.extensions) {
    require.extensions[".gs"] = function (module, filename) {
      var compiled;
      compiled = exports.compileSync(
        fs.readFileSync(filename, "utf8"),
        { filename: filename }
      );
      return module._compile(compiled.code, filename);
    };
  } else if (require.registerExtension) {
    require.registerExtension(".gs", function (content) {
      return exports.compileSync(content, { filename: filename });
    });
  }
  if (typeof __filename !== "undefined" && __filename !== null) {
    real__filename = fs.realpathSync(__filename);
  }
  fetchAndParsePreludeMacros = (function () {
    var parsedPreludeMacros, preludeCachePath, preludePromise, preludeSrcPath,
        work;
    if (real__filename != null) {
      preludeSrcPath = path.join(path.dirname(real__filename), "../src/jsprelude.gs");
    }
    if (os != null) {
      preludeCachePath = path.join(os.tmpDir(), "gs-jsprelude-" + __strnum(exports.version) + ".cache");
    }
    work = __promise(function (sync) {
      var _e, _send, _state, _step, _throw, cachePrelude, e, errored,
          parsedPrelude, prelude, preludeCacheStat, preludeSrcStat;
      _state = 0;
      function _close() {
        _state = 30;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            _state = sync ? 1 : 2;
            break;
          case 1:
            preludeSrcStat = fs.statSync(preludeSrcPath);
            _state = 4;
            break;
          case 2:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.stat, fs, [preludeSrcPath])
            };
          case 3:
            preludeSrcStat = _received;
            ++_state;
          case 4: ++_state;
          case 5:
            _state = sync ? 6 : 7;
            break;
          case 6:
            preludeCacheStat = fs.statSync(preludeCachePath);
            _state = 10;
            break;
          case 7:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.stat, fs, [preludeCachePath])
            };
          case 8:
            preludeCacheStat = _received;
            _state = 10;
            break;
          case 9:
            if (e.code !== "ENOENT") {
              throw e;
            }
            ++_state;
          case 10:
            _state = preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime()) ? 11 : 19;
            break;
          case 11:
            _state = sync ? 12 : 13;
            break;
          case 12:
            cachePrelude = fs.readFileSync(preludeCachePath, "utf8");
            _state = 15;
            break;
          case 13:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [preludeCachePath, "utf8"])
            };
          case 14:
            cachePrelude = _received;
            ++_state;
          case 15:
            errored = false;
            try {
              parsedPreludeMacros = parser.deserializePrelude(cachePrelude);
            } catch (e) {
              if (e instanceof ReferenceError) {
                throw e;
              } else {
                console.error("Error deserializing prelude, reloading. " + String(e.stack || e));
                errored = true;
              }
            }
            _state = errored ? 16 : 19;
            break;
          case 16:
            _state = sync ? 17 : 18;
            break;
          case 17:
            fs.unlinkSync(preludeCachePath);
            _state = 19;
            break;
          case 18:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.unlink, fs, [preludeCachePath])
            };
          case 19:
            _state = parsedPreludeMacros == null ? 20 : 29;
            break;
          case 20:
            _state = sync ? 21 : 22;
            break;
          case 21:
            prelude = fs.readFileSync(preludeSrcPath, "utf8");
            _state = 24;
            break;
          case 22:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [preludeSrcPath, "utf8"])
            };
          case 23:
            prelude = _received;
            ++_state;
          case 24:
            _state = sync ? 25 : 26;
            break;
          case 25:
            parsedPrelude = parser.sync(prelude, null, { serializeMacros: true, sync: true, filename: preludeSrcPath });
            _state = 28;
            break;
          case 26:
            ++_state;
            return {
              done: false,
              value: parser(prelude, null, { serializeMacros: true, filename: preludeSrcPath })
            };
          case 27:
            parsedPrelude = _received;
            ++_state;
          case 28:
            parsedPreludeMacros = parsedPrelude.macros;
            writeFileWithMkdirp(preludeCachePath, parsedPreludeMacros.serialize(), "utf8");
            ++_state;
          case 29:
            work = null;
            preludePromise = void 0;
            ++_state;
            return { done: true, value: parsedPreludeMacros };
          case 30:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        if (_state >= 5 && _state <= 8) {
          e = _e;
          _state = 9;
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
    });
    function f(sync) {
      if (sync == null) {
        sync = false;
      } else if (typeof sync !== "boolean") {
        throw new TypeError("Expected sync to be a Boolean, got " + __typeof(sync));
      }
      if (parsedPreludeMacros != null) {
        if (sync) {
          return parsedPreludeMacros;
        } else {
          return __defer.fulfilled(parsedPreludeMacros);
        }
      } else if (sync) {
        return work.sync(true);
      } else if (preludePromise == null) {
        return preludePromise = work();
      } else {
        return preludePromise;
      }
    }
    exports.getSerializedPrelude = __promise(function () {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: f() };
          case 1:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [preludeCachePath, "utf8"])
            };
          case 2:
            ++_state;
            return { done: true, value: _received };
          case 3:
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
    });
    exports.withPrelude = function (serializedPrelude) {
      if (typeof serializedPrelude !== "function") {
        throw new TypeError("Expected serializedPrelude to be a Function, got " + __typeof(serializedPrelude));
      }
      exports.withPrelude = function () {
        throw new Error("Cannot provide a prelude more than once");
      };
      parsedPreludeMacros = parser.deserializePrelude(serializedPrelude);
      work = null;
      return this;
    };
    return f;
  }());
  exports.parse = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, macros, parseOptions, sync;
    _state = 0;
    function _close() {
      _state = 12;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          sync = options.sync;
          _state = options.macros ? 1 : 2;
          break;
        case 1:
          macros = options.macros;
          _state = 8;
          break;
        case 2:
          _state = options.noPrelude ? 3 : 4;
          break;
        case 3:
          macros = null;
          _state = 8;
          break;
        case 4:
          _state = sync ? 5 : 6;
          break;
        case 5:
          macros = fetchAndParsePreludeMacros(true);
          _state = 8;
          break;
        case 6:
          ++_state;
          return { done: false, value: fetchAndParsePreludeMacros() };
        case 7:
          macros = _received;
          ++_state;
        case 8:
          parseOptions = { filename: options.filename, noindent: !!options.noindent, sync: !!options.sync, progress: options.progress };
          if (options.embedded) {
            parseOptions.embedded = !!options.embedded;
            parseOptions.embeddedUnpretty = !!options.embeddedUnpretty;
            parseOptions.embeddedGenerator = !!options.embeddedGenerator;
            parseOptions.embeddedOpen = options.embeddedOpen;
            parseOptions.embeddedClose = options.embeddedClose;
            parseOptions.embeddedOpenWrite = options.embeddedOpenWrite;
            parseOptions.embeddedCloseWrite = options.embeddedCloseWrite;
            parseOptions.embeddedOpenComment = options.embeddedOpenComment;
            parseOptions.embeddedCloseComment = options.embeddedCloseComment;
            parseOptions.embeddedOpenLiteral = options.embeddedOpenLiteral;
            parseOptions.embeddedCloseLiteral = options.embeddedCloseLiteral;
          }
          _state = sync ? 9 : 10;
          break;
        case 9:
          _state = 12;
          return {
            done: true,
            value: parser.sync(source, macros, parseOptions)
          };
        case 10:
          ++_state;
          return {
            done: false,
            value: parser(source, macros, parseOptions)
          };
        case 11:
          ++_state;
          return { done: true, value: _received };
        case 12:
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
  });
  exports.parseSync = function (source, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports.parse.sync(source, (_ref = __import({}, options), _ref.sync = true, _ref));
  };
  exports.getReservedWords = function (options) {
    if (options == null) {
      options = {};
    }
    if (options.noPrelude) {
      return parser.getReservedWords(null, options);
    } else {
      return parser.getReservedWords(fetchAndParsePreludeMacros(true), options);
    }
  };
  function joinParsedResults(results) {
    var _arr, _i, _len, joinedParsed, parsed;
    joinedParsed = {
      parseTime: 0,
      macroExpandTime: 0,
      reduceTime: 0,
      macros: results[0].macros,
      result: []
    };
    for (_arr = __toArray(results), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      parsed = _arr[_i];
      joinedParsed.parseTime += __num(parsed.parseTime);
      joinedParsed.macroExpandTime += __num(parsed.macroExpandTime);
      joinedParsed.reduceTime += __num(parsed.reduceTime);
      joinedParsed.result.push(parsed.result);
    }
    return joinedParsed;
  }
  function handleAstPipe(node, options, fileSources) {
    var coverage, coverageName;
    if (typeof options.astPipe === "function") {
      node = options.astPipe(node, fileSources, ast);
      if (!(node instanceof ast.Root)) {
        throw new Error("Expected astPipe to return a Root, got " + __typeof(node));
      }
    }
    if (options.coverage) {
      coverage = require("./coverage");
      if (typeof options.coverage === "string") {
        if (!isAcceptableIdent(options.coverage)) {
          throw new Error("coverage option must be an acceptable ident. '" + __strnum(options.coverage) + "' is not.");
        }
        coverageName = options.coverage;
      } else {
        coverageName = null;
      }
      node = coverage(node, fileSources, coverageName);
    }
    return node;
  }
  exports.ast = __promise(function (source, options) {
    var _arr, _arr2, _e, _i, _len, _send, _state, _step, _throw, _tmp, array,
        doneAstPipeTime, fileSources, item, name, node, originalProgress,
        parsed, progressCounts, startAstPipeTime, startTime, sync, translated,
        translator;
    _state = 0;
    function _close() {
      _state = 15;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          startTime = new Date().getTime();
          sync = options.sync;
          if (typeof options.translator === "function") {
            translator = options.translator;
          } else {
            translator = require(typeof options.translator === "string" ? options.translator : "./jstranslator");
          }
          _state = __isArray(source) ? 1 : 10;
          break;
        case 1:
          array = [];
          originalProgress = options.progress;
          progressCounts = { parse: 0, macroExpand: 0, reduce: 0 };
          if (typeof originalProgress === "function") {
            options.progress = function (name, time) {
              return progressCounts[name] = __num(progressCounts[name]) + __num(time);
            };
          }
          _arr = __toArray(source);
          _i = 0;
          _len = _arr.length;
          ++_state;
        case 2:
          _state = _i < _len ? 3 : 9;
          break;
        case 3:
          item = _arr[_i];
          if (__isArray(options.filenames)) {
            options.filename = options.filenames[i];
          }
          _state = sync ? 4 : 5;
          break;
        case 4:
          _tmp = exports.parseSync(item, options);
          _state = 7;
          break;
        case 5:
          ++_state;
          return {
            done: false,
            value: exports.parse(item, options)
          };
        case 6:
          _tmp = _received;
          ++_state;
        case 7:
          array.push(_tmp);
          ++_state;
        case 8:
          ++_i;
          _state = 2;
          break;
        case 9:
          options.progress = originalProgress;
          if (typeof originalProgress === "function") {
            for (_arr = ["parse", "macroExpand", "reduce"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
              name = _arr[_i];
              options.progress(name, progressCounts[name]);
            }
          }
          parsed = joinParsedResults(array);
          _state = 14;
          break;
        case 10:
          _state = sync ? 11 : 12;
          break;
        case 11:
          parsed = exports.parseSync(source, options);
          _state = 14;
          break;
        case 12:
          ++_state;
          return {
            done: false,
            value: exports.parse(source, options)
          };
        case 13:
          parsed = _received;
          ++_state;
        case 14:
          translated = translator(parsed.result, parsed.macros, parsed.getPosition, options);
          fileSources = {};
          if (options.filename) {
            fileSources[options.filename] = source;
          }
          startAstPipeTime = new Date().getTime();
          node = handleAstPipe(translated.node, options, fileSources);
          doneAstPipeTime = new Date().getTime();
          ++_state;
          return {
            done: true,
            value: {
              node: node,
              parseTime: parsed.parseTime,
              macroExpandTime: parsed.macroExpandTime,
              reduceTime: parsed.reduceTime,
              translateTime: translated.time,
              astPipeTime: doneAstPipeTime - startAstPipeTime,
              time: doneAstPipeTime - startTime
            }
          };
        case 15:
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
  });
  exports.astSync = function (source, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports.ast.sync(source, (_ref = __import({}, options), _ref.sync = true, _ref));
  };
  exports.compile = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, compiled, node, startTime, sync,
        translated;
    _state = 0;
    function _close() {
      _state = 5;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          sync = options.sync;
          startTime = new Date().getTime();
          _state = sync ? 1 : 2;
          break;
        case 1:
          translated = exports.astSync(source, options);
          _state = 4;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: exports.ast(source, options)
          };
        case 3:
          translated = _received;
          ++_state;
        case 4:
          node = translated.node;
          compiled = node.compile(options);
          ++_state;
          return {
            done: true,
            value: {
              parseTime: translated.parseTime,
              macroExpandTime: translated.macroExpandTime,
              reduceTime: translated.reduceTime,
              translateTime: translated.translateTime,
              compileTime: compiled.compileTime,
              uglifyTime: compiled.uglifyTime,
              time: new Date().getTime() - startTime,
              code: compiled.code
            }
          };
        case 5:
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
  });
  exports.compileSync = function (source, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports.compile.sync(source, (_ref = __import({}, options), _ref.sync = true, _ref));
  };
  exports.compileFile = __promise(function (options) {
    var _arr, _arr2, _e, _i, _len, _send, _state, _step, _throw, code, compiled,
        fileSources, footer, i, input, inputs, linefeed, name, node,
        originalProgress, output, parsed, progressCounts, source, sourceMapFile,
        sources, startParseTime, sync, translated, translator;
    _state = 0;
    function _close() {
      _state = 20;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          options = __import({}, options);
          sync = options.sync;
          inputs = options.input;
          if (typeof inputs === "string") {
            inputs = [inputs];
          } else if (!__isArray(inputs)) {
            throw new Error("Expected options.input to be a string or array of strings");
          } else if (inputs.length === 0) {
            throw new Error("Expected options.input to not be empty");
          }
          output = options.output;
          if (typeof output !== "string") {
            throw new Error("Expected options.output to be a string, got " + __typeof(output));
          }
          if (!options.sourceMap) {
            options.sourceMap = null;
          } else if (typeof options.sourceMap === "string") {
            sourceMapFile = options.sourceMap;
            options.sourceMap = SourceMap(sourceMapFile, options.output, "");
          } else {
            if (typeof options.sourceMap.file !== "string") {
              throw new Error("Expected options.sourceMap.file to be a string, got " + __typeof(options.sourceMap.file));
            }
            if (typeof options.sourceMap.sourceRoot !== "string") {
              throw new Error("Expected options.sourceMap.sourceRoot to be a string, got " + __typeof(options.sourceMap.sourceRoot));
            }
            sourceMapFile = options.sourceMap.file;
            options.sourceMap = SourceMap(sourceMapFile, options.output, options.sourceMap.sourceRoot);
          }
          sources = [];
          _state = sync ? 1 : 2;
          break;
        case 1:
          for (_arr = __toArray(inputs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            input = _arr[_i];
            sources.push(fs.readFileSync(input, "utf8"));
          }
          _state = 4;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: __promiseLoop(5, __num(inputs.length), __promise(function (_i) {
              var _e2, _send2, _state2, _step2, _throw2, input;
              _state2 = 0;
              function _close2() {
                _state2 = 2;
              }
              function _step2(_received) {
                while (true) {
                  switch (_state2) {
                  case 0:
                    input = inputs[_i];
                    ++_state2;
                    return {
                      done: false,
                      value: __toPromise(fs.readFile, fs, [input, "utf8"])
                    };
                  case 1:
                    ++_state2;
                    return { done: true, value: _received };
                  case 2:
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
            }))
          };
        case 3:
          sources = _received;
          ++_state;
        case 4:
          originalProgress = sources.length > 0 && options.progress;
          progressCounts = { parse: 0, macroExpand: 0, reduce: 0 };
          if (typeof originalProgress === "function") {
            options.progress = function (name, time) {
              return progressCounts[name] = __num(progressCounts[name]) + __num(time);
            };
          }
          _arr = [];
          i = 0;
          _len = sources.length;
          ++_state;
        case 5:
          _state = i < _len ? 6 : 11;
          break;
        case 6:
          source = sources[i];
          startParseTime = Date.now();
          options.filename = inputs[i];
          _state = sync ? 7 : 8;
          break;
        case 7:
          _arr.push(exports.parseSync(source, options));
          _state = 10;
          break;
        case 8:
          ++_state;
          return {
            done: false,
            value: exports.parse(source, options)
          };
        case 9:
          _arr.push(_received);
          ++_state;
        case 10:
          ++i;
          _state = 5;
          break;
        case 11:
          parsed = _arr;
          if (typeof originalProgress === "function") {
            options.progress = originalProgress;
            for (_arr = ["parse", "macroExpand", "reduce"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
              name = _arr[_i];
              options.progress(name, progressCounts[name]);
            }
          }
          options.filenames = inputs;
          translator = require("./jstranslator");
          translated = translator(
            (function () {
              var _arr, _i, _len, x;
              _arr = [];
              for (_i = 0, _len = parsed.length; _i < _len; ++_i) {
                x = parsed[_i];
                _arr.push(x.result);
              }
              return _arr;
            }()),
            parsed[0].macros,
            (function () {
              var _arr, _i, _len, x;
              _arr = [];
              for (_i = 0, _len = parsed.length; _i < _len; ++_i) {
                x = parsed[_i];
                _arr.push(x.getPosition);
              }
              return _arr;
            }()),
            options
          );
          node = translated.node;
          fileSources = {};
          for (_arr = __toArray(inputs), i = 0, _len = _arr.length; i < _len; ++i) {
            input = _arr[i];
            fileSources[input] = sources[i];
          }
          node = handleAstPipe(node, options, fileSources);
          compiled = node.compile(options);
          _state = !sync ? 12 : 13;
          break;
        case 12:
          ++_state;
          return { done: false, value: __defer.fulfilled() };
        case 13:
          code = compiled.code;
          if (sourceMapFile) {
            linefeed = options.linefeed || "\n";
            footer = __strnum(linefeed) + "//# sourceMappingURL=" + __strnum(path.relative(path.dirname(options.output), sourceMapFile)) + __strnum(linefeed);
            code = __strnum(code) + footer;
          }
          _state = sync ? 14 : 15;
          break;
        case 14:
          writeFileWithMkdirpSync(options.output, code, options.encoding || "utf8");
          _state = 16;
          break;
        case 15:
          ++_state;
          return {
            done: false,
            value: writeFileWithMkdirp(options.output, code, options.encoding || "utf8")
          };
        case 16:
          _state = sourceMapFile ? 17 : 20;
          break;
        case 17:
          _state = sync ? 18 : 19;
          break;
        case 18:
          writeFileWithMkdirpSync(sourceMapFile, options.sourceMap.toString(), "utf8");
          _state = 20;
          break;
        case 19:
          ++_state;
          return {
            done: false,
            value: writeFileWithMkdirp(sourceMapFile, options.sourceMap.toString(), "utf8")
          };
        case 20:
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
  });
  exports.compileFileSync = function (options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports.compileFile.sync((_ref = __import({}, options), _ref.sync = true, _ref));
  };
  function evaluate(code, options) {
    var _arr, _i, _module, _obj, _ref, _require, fun, k, Module, r, sandbox,
        Script, v;
    if (typeof require === "function" && (_ref = require("vm")) != null) {
      Script = _ref.Script;
    }
    if (Script) {
      sandbox = Script.createContext();
      sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
      if (options.sandbox != null) {
        if (options.sandbox instanceof sandbox.constructor) {
          sandbox = options.sandbox;
        } else {
          _obj = options.sandbox;
          for (k in _obj) {
            if (__owns.call(_obj, k)) {
              v = _obj[k];
              sandbox[k] = v;
            }
          }
        }
      } else {
        for (k in GLOBAL) {
          if (__owns.call(GLOBAL, k)) {
            v = GLOBAL[k];
            sandbox[k] = v;
          }
        }
      }
      sandbox.__filename = options.filename || "eval";
      sandbox.__dirname = path.dirname(sandbox.__filename);
      if (!sandbox.module && !sandbox.require) {
        Module = require("module");
        _module = sandbox.module = new Module(options.modulename || "eval");
        _require = sandbox.require = function (path) {
          return Module._load(path, _module);
        };
        _module.filename = sandbox.__filename;
        for (_arr = Object.getOwnPropertyNames(require), _i = _arr.length; _i--; ) {
          r = _arr[_i];
          try {
            _require[r] = require[r];
          } catch (e) {}
        }
      }
      if (options.includeGlobals) {
        for (k in GLOBAL) {
          if (__owns.call(GLOBAL, k) && !(k in sandbox)) {
            sandbox[k] = GLOBAL[k];
          }
        }
      }
      return Script.runInContext(code, sandbox);
    } else {
      fun = Function("return " + __strnum(code));
      return fun();
    }
  }
  exports["eval"] = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, compiled, result, startTime, sync;
    _state = 0;
    function _close() {
      _state = 5;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          sync = options.sync;
          options["eval"] = true;
          options["return"] = false;
          _state = sync ? 1 : 2;
          break;
        case 1:
          compiled = exports.compileSync(source, options);
          _state = 4;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: exports.compile(source, options)
          };
        case 3:
          compiled = _received;
          ++_state;
        case 4:
          startTime = new Date().getTime();
          result = evaluate(compiled.code, options);
          if (typeof options.progress === "function") {
            options.progress("eval", new Date().getTime() - startTime);
          }
          ++_state;
          return { done: true, value: result };
        case 5:
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
  });
  exports.evalSync = function (source, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports["eval"].sync(source, (_ref = __import({}, options), _ref.sync = true, _ref));
  };
  exports.run = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, compiled, mainModule, Module, sync;
    _state = 0;
    function _close() {
      _state = 12;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          sync = options.sync;
          _state = typeof process === "undefined" ? 1 : 5;
          break;
        case 1:
          _state = sync ? 2 : 3;
          break;
        case 2:
          _state = 12;
          return {
            done: true,
            value: exports.evalSync(source, options)
          };
        case 3:
          ++_state;
          return {
            done: false,
            value: exports["eval"](source, options)
          };
        case 4:
          _state = 12;
          return { done: true, value: _received };
        case 5:
          mainModule = require.main;
          mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : ".";
          if (mainModule.moduleCache) {
            mainModule.moduleCache = {};
          }
          if (process.binding("natives").module) {
            Module = require("module").Module;
            mainModule.paths = Module._nodeModulePaths(path.dirname(options.filename));
          }
          _state = path.extname(mainModule.filename) !== ".gs" || require.extensions ? 6 : 11;
          break;
        case 6:
          _state = sync ? 7 : 8;
          break;
        case 7:
          compiled = exports.compileSync(source, options);
          _state = 10;
          break;
        case 8:
          ++_state;
          return {
            done: false,
            value: exports.compile(source, options)
          };
        case 9:
          compiled = _received;
          ++_state;
        case 10:
          _state = 12;
          return {
            done: true,
            value: mainModule._compile(compiled.code, mainModule.filename)
          };
        case 11:
          ++_state;
          return {
            done: true,
            value: mainModule._compile(source, mainModule.filename)
          };
        case 12:
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
  });
  exports.runSync = function (source, options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    return exports.run.sync(source, (_ref = __import({}, options), _ref.sync = true, _ref));
  };
  init = exports.init = __promise(function (options) {
    var _e, _send, _state, _step, _throw;
    _state = 0;
    function _close() {
      _state = 3;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (options == null) {
            options = {};
          }
          _state = options.sync ? 1 : 2;
          break;
        case 1:
          fetchAndParsePreludeMacros(true);
          _state = 3;
          break;
        case 2:
          ++_state;
          return { done: false, value: fetchAndParsePreludeMacros() };
        case 3:
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
  });
  exports.initSync = function (options) {
    var _ref;
    if (options == null) {
      options = {};
    }
    init.sync((_ref = __import({}, options), _ref.sync = true, _ref));
  };
  exports.getMtime = __promise(function (source) {
    var _arr, _e, _err, _i, _len, _ref, _send, _state, _step, _throw, acc,
        files, fileStats, fileStatsP, libDir, libFile, libFiles, stat, time;
    _state = 0;
    function _close() {
      _state = 6;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          files = [];
          files.push(path.join(path.dirname(real__filename), "../src/jsprelude.gs"));
          libDir = path.join(path.dirname(real__filename), "../lib");
          ++_state;
          return {
            done: false,
            value: __toPromise(fs.readdir, fs, [libDir])
          };
        case 1:
          libFiles = _received;
          for (_arr = __toArray(libFiles), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            libFile = _arr[_i];
            if (path.extname(libFile) === ".js") {
              files.push(path.join(libDir, libFile));
            }
          }
          fileStatsP = __everyPromise((function () {
            var _arr, _i, _len, file;
            _arr = [];
            for (_i = 0, _len = files.length; _i < _len; ++_i) {
              file = files[_i];
              _arr.push(__toPromise(fs.stat, fs, [file]));
            }
            return _arr;
          }()));
          ++_state;
        case 2:
          ++_state;
          return { done: false, value: fileStatsP };
        case 3:
          fileStats = _received;
          _state = 5;
          break;
        case 4:
          _state = 6;
          return { done: true, value: new Date() };
        case 5:
          acc = -4503599627370496;
          for (_arr = __toArray(fileStats), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            stat = _arr[_i];
            if (acc > __num(_ref = stat.mtime.getTime())) {
              acc = acc;
            } else {
              acc = _ref;
            }
          }
          time = acc;
          ++_state;
          return { done: true, value: new Date(time) };
        case 6:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      if (_state === 2 || _state === 3) {
        _err = _e;
        _state = 4;
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
  });
  exports.AST = ast;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
