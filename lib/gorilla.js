(function (GLOBAL) {
  "use strict";
  var __defer, __generatorToPromise, __isArray, __lte, __num, __owns, __promise,
      __slice, __strnum, __toArray, __toPromise, __typeof, fetchAndParsePrelude,
      fs, init, os, parser, path, setImmediate;
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
  exports.version = "0.7.9";
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
    var getPreludeCachePath, getPreludeSrcPath, parsedPreludeByLang,
        preludePromisesByLang, real__filename, work;
    parsedPreludeByLang = {};
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
    preludePromisesByLang = {};
    work = __promise(function (lang, sync) {
      var _e, _send, _state, _step, _throw, cachePrelude, e, errored,
          parsedPrelude, prelude, preludeCachePath, preludeCacheStat,
          preludeSrcPath, preludeSrcStat;
      _state = 0;
      function _close() {
        _state = 30;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            if (typeof lang !== "string") {
              throw TypeError("Expected lang to be a String, got " + __typeof(lang));
            }
            preludeSrcPath = getPreludeSrcPath(lang);
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
          case 4:
            preludeCachePath = getPreludeCachePath(lang);
            preludeCacheStat = void 0;
            ++_state;
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
            parsedPrelude = void 0;
            _state = preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime()) ? 11 : 19;
            break;
          case 11:
            _state = sync ? 12 : 13;
            break;
          case 12:
            cachePrelude = fs.readFileSync(preludeCachePath("utf8"));
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
              parsedPrelude = parsedPreludeByLang[lang] = parser.deserializePrelude(cachePrelude);
            } catch (e) {
              if (e instanceof ReferenceError) {
                throw e;
              } else {
                console.error("Error deserializing prelude, reloading. " + String(e));
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
            _state = parsedPrelude == null ? 20 : 29;
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
            parsedPrelude = parsedPreludeByLang[lang] = parser.sync(prelude, null, { serializeMacros: true, sync: true });
            _state = 28;
            break;
          case 26:
            ++_state;
            return {
              done: false,
              value: parser(prelude, null, { serializeMacros: true })
            };
          case 27:
            parsedPreludeByLang[lang] = _received;
            parsedPrelude = parsedPreludeByLang[lang];
            ++_state;
          case 28:
            fs.writeFile(preludeCachePath, parsedPrelude.macros.serialize(), "utf8", function () {});
            ++_state;
          case 29:
            delete preludePromisesByLang[lang];
            ++_state;
            return { done: true, value: parsedPrelude };
          case 30:
            return { done: true, value: void 0 };
          default: throw Error("Unknown state: " + _state);
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
    function f(lang, sync) {
      var _ref, parsedPrelude;
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (sync == null) {
        sync = false;
      } else if (typeof sync !== "boolean") {
        throw TypeError("Expected sync to be a Boolean, got " + __typeof(sync));
      }
      if (__owns.call(parsedPreludeByLang, lang)) {
        parsedPrelude = parsedPreludeByLang[lang];
      }
      if (parsedPrelude != null) {
        if (sync) {
          return parsedPrelude;
        } else {
          return __defer.fulfilled(parsedPrelude);
        }
      } else if (sync) {
        return work.sync(lang, true);
      } else if ((_ref = preludePromisesByLang[lang]) == null) {
        return preludePromisesByLang[lang] = work(lang);
      } else {
        return _ref;
      }
    }
    f.serialized = __promise(function (lang) {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            if (typeof lang !== "string") {
              throw TypeError("Expected lang to be a String, got " + __typeof(lang));
            }
            ++_state;
            return { done: false, value: f(lang) };
          case 1:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [getPreludeCachePath(lang), "utf8"])
            };
          case 2:
            ++_state;
            return { done: true, value: _received };
          case 3:
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
    });
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
  exports.parse = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, _tmp, macros, sync;
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
          macros = fetchAndParsePrelude(options.lang || "js", true).macros;
          _state = 8;
          break;
        case 6:
          ++_state;
          return { done: false, value: fetchAndParsePrelude(options.lang || "js") };
        case 7:
          _tmp = _received;
          macros = _tmp.macros;
          ++_state;
        case 8:
          _state = sync ? 9 : 10;
          break;
        case 9:
          _state = 12;
          return {
            done: true,
            value: parser.sync(source, macros, options)
          };
        case 10:
          ++_state;
          return {
            done: false,
            value: parser(source, macros, options)
          };
        case 11:
          ++_state;
          return { done: true, value: _received };
        case 12:
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
  });
  exports.parseSync = function (source, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.parse.sync(source, options);
  };
  exports.getReservedWords = function (options) {
    if (options == null) {
      options = {};
    }
    if (options.noPrelude) {
      return parser.getReservedWords(null, options);
    } else {
      return parser.getReservedWords(
        fetchAndParsePrelude(options.lang || "js", true).macros,
        options
      );
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
  exports.ast = __promise(function (source, options) {
    var _arr, _arr2, _e, _i, _len, _send, _state, _step, _throw, _tmp, _tmp2,
        array, item, parsed, startTime, sync, translated, translator;
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
          _tmp2 = array.push;
          _arr2 = [];
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
          _arr2.push(_tmp);
          _tmp2.apply(void 0, _arr2);
          ++_state;
        case 8:
          ++_i;
          _state = 2;
          break;
        case 9:
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
          translated = translator(parsed.result, parsed.macros, options);
          ++_state;
          return {
            done: true,
            value: {
              node: translated.node,
              parseTime: parsed.parseTime,
              macroExpandTime: parsed.macroExpandTime,
              reduceTime: parsed.reduceTime,
              translateTime: translated.time,
              time: __num(new Date().getTime()) - __num(startTime)
            }
          };
        case 15:
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
  });
  exports.astSync = function (source, options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.ast.sync(source, options);
  };
  exports.compile = __promise(function (source, options) {
    var _e, _send, _state, _step, _throw, compiled, startTime, sync, translated;
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
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.compile.sync(source, options);
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
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports["eval"].sync(source, options);
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
    if (options == null) {
      options = {};
    }
    options.sync = true;
    return exports.run.sync(source, options);
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
          fetchAndParsePrelude(options.lang || "js", true);
          _state = 3;
          break;
        case 2:
          ++_state;
          return { done: false, value: fetchAndParsePrelude(options.lang || "js") };
        case 3:
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
  });
  exports.initSync = function (options) {
    if (options == null) {
      options = {};
    }
    options.sync = true;
    init.sync(options);
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
