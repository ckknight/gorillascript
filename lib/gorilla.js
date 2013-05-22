(function (GLOBAL) {
  "use strict";
  var __async, __defer, __fromPromise, __generatorToPromise, __isArray, __lte, __num, __once, __owns, __promise, __slice, __strnum, __toArray, __toPromise, __typeof, fetchAndParsePrelude, fs, init, os, parse, parser, path, setImmediate, translate;
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
            promise = (_ref = __defer()).promise;
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
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
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
  parser = require("./parser");
  os = require("os");
  fs = require("fs");
  path = require("path");
  exports.version = "0.6.18";
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
  fetchAndParsePrelude = (function () {
    var fetchers, getPreludeCachePath, getPreludeSrcPath, parsedPreludeByLang, real__filename;
    parsedPreludeByLang = {};
    fetchers = [];
    function flush(err, value) {
      while (fetchers.length > 0) {
        fetchers.shift()(err, value);
      }
    }
    if (typeof __filename !== "undefined" && __filename !== null) {
      real__filename = fs.realpathSync(__filename);
    }
    if (real__filename != null) {
      getPreludeSrcPath = function (lang) {
        return path.join(path.dirname(real__filename), "../src/" + __strnum(lang) + "prelude.gs");
      };
    }
    if (os != null) {
      getPreludeCachePath = function (lang) {
        return path.join(os.tmpDir(), "gs-" + __strnum(lang) + "prelude-" + __strnum(exports.version) + ".cache");
      };
    }
    function f(lang, cb) {
      var _once, parsedPrelude;
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a Function, got " + __typeof(cb));
      }
      if (__owns.call(parsedPreludeByLang, lang)) {
        parsedPrelude = parsedPreludeByLang[lang];
      }
      if (parsedPrelude != null) {
        return cb(null, parsedPrelude);
      }
      fetchers.push(cb);
      if (fetchers.length > 1) {
        return;
      }
      return fs.stat(getPreludeSrcPath(lang), (_once = false, function (_e, preludeSrcStat) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return flush(_e);
        }
        return fs.stat(getPreludeCachePath(lang), (_once2 = false, function (err, preludeCacheStat) {
          var _f;
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (err != null && err.code !== "ENOENT") {
            return flush(err, null);
          }
          if (preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime())) {
            _f = function (next) {
              var _once3;
              return fs.readFile(getPreludeCachePath(lang), "utf8", (_once3 = false, function (_e2, cachePrelude) {
                var _else, _once4;
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e2 != null) {
                  return flush(_e2);
                }
                _else = true;
                try {
                  return parsedPreludeByLang[lang] = parsedPrelude = parser.deserializePrelude(cachePrelude);
                } catch (e) {
                  _else = false;
                  if (e instanceof ReferenceError) {
                    throw e;
                  } else {
                    console.error("GorillaScript: Error deserializing prelude, reloading. " + String(e));
                    return fs.unlink(getPreludeCachePath(lang), (_once4 = false, function (_e3) {
                      if (_once4) {
                        throw Error("Attempted to call function more than once");
                      } else {
                        _once4 = true;
                      }
                      if (_e3 != null) {
                        return flush(_e3);
                      }
                      return next();
                    }));
                  }
                } finally {
                  if (_else) {
                    flush(null, parsedPrelude);
                  }
                }
              }));
            };
          } else {
            _f = function (next) {
              return next();
            };
          }
          return _f(function () {
            var _once3;
            return fs.readFile(getPreludeSrcPath(lang), "utf8", (_once3 = false, function (_e2, prelude) {
              var _f;
              if (_once3) {
                throw Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              if (_e2 != null) {
                return flush(_e2);
              }
              if (parsedPrelude == null) {
                _f = function (next) {
                  var _once4, startTime;
                  process.stderr.write("GorillaScript: Compiling prelude ... ");
                  startTime = new Date().getTime();
                  return __fromPromise(parser(prelude, null, { serializeMacros: true }))((_once4 = false, function (_e3, result) {
                    if (_once4) {
                      throw Error("Attempted to call function more than once");
                    } else {
                      _once4 = true;
                    }
                    if (_e3 != null) {
                      return flush(_e3);
                    }
                    parsedPreludeByLang[lang] = parsedPrelude = result;
                    process.stderr.write(__strnum(((__num(new Date().getTime()) - __num(startTime)) / 1000).toFixed(3)) + " s\n");
                    fs.writeFile(getPreludeCachePath(lang), parsedPrelude.macros.serialize(), "utf8", function (err) {
                      if (err != null) {
                        throw err;
                      }
                    });
                    return next();
                  }));
                };
              } else {
                _f = function (next) {
                  return next();
                };
              }
              return _f(function () {
                return flush(null, parsedPrelude);
              });
            }));
          });
        }));
      }));
    }
    f.serialized = function (lang, cb) {
      var _once;
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a Function, got " + __typeof(cb));
      }
      return f(lang, (_once = false, function (_e) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return cb(_e);
        }
        return fs.readFile(getPreludeCachePath(lang), "utf8", cb);
      }));
    };
    f.sync = function (lang) {
      var cachePrelude, parsedPrelude, prelude, preludeCacheStat, preludeSrcStat;
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (__owns.call(parsedPreludeByLang, lang)) {
        parsedPrelude = parsedPreludeByLang[lang];
      }
      if (parsedPrelude != null) {
        return parsedPrelude;
      } else {
        preludeSrcStat = fs.statSync(getPreludeSrcPath(lang));
        preludeCacheStat = (function () {
          try {
            return fs.statSync(getPreludeCachePath(lang));
          } catch (e) {
            if (e.code !== "ENOENT") {
              throw e;
            }
          }
        }());
        if (preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime())) {
          cachePrelude = fs.readFileSync(getPreludeCachePath(lang), "utf8");
          try {
            parsedPrelude = parsedPreludeByLang[lang] = parser.deserializePrelude(cachePrelude);
          } catch (e) {
            if (e instanceof ReferenceError) {
              throw e;
            } else {
              console.error("Error deserializing prelude, reloading. " + String(e));
              fs.unlinkSync(getPreludeCachePath(lang));
            }
          }
        }
        if (parsedPrelude == null) {
          prelude = fs.readFileSync(getPreludeSrcPath(lang), "utf8");
          parsedPrelude = parsedPreludeByLang[lang] = parser.sync(prelude, null, { serializeMacros: true });
          fs.writeFile(getPreludeCachePath(lang), parsedPrelude.macros.serialize(), "utf8", function (err) {
            if (err != null) {
              throw err;
            }
          });
        }
        return parsedPrelude;
      }
    };
    exports.withPrelude = function (lang, serializedPrelude) {
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (typeof serializedPrelude !== "object" || serializedPrelude === null) {
        throw TypeError("Expected serializedPrelude to be an Object, got " + __typeof(serializedPrelude));
      }
      parsedPreludeByLang[lang] = parser.deserializePrelude(serializedPrelude);
      return this;
    };
    return f;
  }());
  exports.getSerializedPrelude = fetchAndParsePrelude.serialized;
  parse = exports.parse = function (source, options, callback) {
    var _once, prelude, sync;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return parse(source, null, options);
    }
    sync = options.sync = callback == null;
    if (options.macros) {
      if (sync) {
        return parser.sync(source, options.macros, options);
      } else {
        return __fromPromise(parser(source, options.macros, options))(callback);
      }
    } else if (options.noPrelude) {
      if (sync) {
        return parser.sync(source, null, options);
      } else {
        return __fromPromise(parser(source, null, options))(callback);
      }
    } else if (sync) {
      prelude = fetchAndParsePrelude.sync(options.lang || "js");
      return parser.sync(source, prelude.macros, options);
    } else {
      return fetchAndParsePrelude(options.lang || "js", (_once = false, function (_e, prelude) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return __fromPromise(parser(source, prelude.macros, options))(callback);
      }));
    }
  };
  exports.getReservedWords = function (options) {
    if (options == null) {
      options = {};
    }
    if (options.noPrelude) {
      return parser.getReservedWords(null, options);
    } else {
      return parser.getReservedWords(fetchAndParsePrelude.sync(options.lang || "js").macros, options);
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
  translate = exports.ast = function (source, options, callback) {
    var _f, startTime, translator;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return translate(source, null, options);
    }
    startTime = new Date().getTime();
    if (typeof options.translator === "function") {
      translator = options.translator;
    } else {
      translator = require(typeof options.translator === "string" ? options.translator : "./jstranslator");
    }
    if (callback != null) {
      _f = function (next) {
        var _f;
        if (__isArray(source)) {
          _f = function (next2) {
            return __async(
              1,
              __num(source.length),
              true,
              function (i, next3) {
                var item;
                item = source[i];
                if (__isArray(options.filenames)) {
                  options.filename = options.filenames[i];
                }
                return parse(item, options, next3);
              },
              function (err, results) {
                if (typeof err !== "undefined" && err !== null) {
                  return callback(err);
                }
                return next2(joinParsedResults(results));
              }
            );
          };
        } else {
          _f = function (next2) {
            var _once;
            return parse(source, options, (_once = false, function (_e, parsed) {
              if (_once) {
                throw Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (_e != null) {
                return callback(_e);
              }
              return next2(parsed);
            }));
          };
        }
        return _f(function (parsed) {
          return next(parsed);
        });
      };
    } else {
      _f = function (next) {
        var parsed;
        if (__isArray(source)) {
          parsed = joinParsedResults((function () {
            var _arr, _arr2, _i, _len, item;
            for (_arr = [], _arr2 = __toArray(source), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              item = _arr2[_i];
              if (__isArray(options.filenames)) {
                options.filename = options.filenames[i];
              }
              _arr.push(parse(item, options));
            }
            return _arr;
          }()));
        } else {
          parsed = parse(source, options);
        }
        return next(parsed);
      };
    }
    return _f(function (parsed) {
      var result, translated;
      translated = translator(parsed.result, parsed.macros, options);
      result = {
        node: translated.node,
        parseTime: parsed.parseTime,
        macroExpandTime: parsed.macroExpandTime,
        reduceTime: parsed.reduceTime,
        translateTime: translated.time,
        time: __num(new Date().getTime()) - __num(startTime)
      };
      if (callback != null) {
        return callback(null, result);
      } else {
        return result;
      }
    });
  };
  exports.compile = __promise(function (source, options) {
    var _e, _send, _state, _step, compiled, startTime, sync, translated;
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
          translated = translate(source, options);
          _state = 4;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: __toPromise(translate, void 0, [source, options])
          };
        case 3:
          translated = _received;
          ++_state;
        case 4:
          compiled = translated.node.compile(options);
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
              time: __num(new Date().getTime()) - __num(startTime),
              code: compiled.code
            }
          };
        case 5:
          return { done: true, value: void 0 };
        default: throw Error("Unknown state: " + _state);
        }
      }
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _close();
        throw _e;
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
      "throw": function (e) {
        _close();
        throw e;
      }
    };
  });
  exports.compileSync = function (source, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.compile.sync(source, options);
  };
  function evaluate(code, options) {
    var _arr, _i, _module, _obj, _ref, _require, fun, k, Module, r, sandbox, Script, v;
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
    var _e, _send, _state, _step, compiled, result, startTime, sync;
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
            options.progress("eval", __num(new Date().getTime()) - __num(startTime));
          }
          ++_state;
          return { done: true, value: result };
        case 5:
          return { done: true, value: void 0 };
        default: throw Error("Unknown state: " + _state);
        }
      }
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _close();
        throw _e;
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
      "throw": function (e) {
        _close();
        throw e;
      }
    };
  });
  exports.evalSync = function (source, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports["eval"].sync(source, options);
  };
  exports.run = __promise(function (source, options) {
    var _e, _send, _state, _step, compiled, mainModule, Module, sync;
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
          mainModule._compile(compiled.code, mainModule.filename);
          _state = 12;
          break;
        case 11:
          mainModule._compile(source, mainModule.filename);
          ++_state;
        case 12:
          return { done: true, value: void 0 };
        default: throw Error("Unknown state: " + _state);
        }
      }
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _close();
        throw _e;
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
      "throw": function (e) {
        _close();
        throw e;
      }
    };
  });
  exports.runSync = function (source, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.run.sync(source, options);
  };
  init = exports.init = __promise(function (options) {
    var _e, _send, _state, _step;
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
          fetchAndParsePrelude.sync(options.lang || "js");
          _state = 3;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: __toPromise(fetchAndParsePrelude, void 0, [options.lang || "js"])
          };
        case 3:
          return { done: true, value: void 0 };
        default: throw Error("Unknown state: " + _state);
        }
      }
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _close();
        throw _e;
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
      "throw": function (e) {
        _close();
        throw e;
      }
    };
  });
  exports.initSync = function (options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    init.sync(options);
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
