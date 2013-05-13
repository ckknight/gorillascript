(function (GLOBAL) {
  "use strict";
  var __async, __isArray, __lte, __num, __once, __owns, __slice, __strnum, __toArray, __typeof, compile, DEFAULT_TRANSLATOR, fetchAndParsePrelude, fs, init, os, parse, parser, path, translate;
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
  parser = require("./parser");
  os = require("os");
  fs = require("fs");
  path = require("path");
  DEFAULT_TRANSLATOR = "./jstranslator";
  exports.version = "0.5.4";
  if (require.extensions) {
    require.extensions[".gs"] = function (module, filename) {
      var compiled;
      compiled = compile(
        fs.readFileSync(filename, "utf8"),
        { filename: filename }
      );
      return module._compile(compiled.code, filename);
    };
  } else if (require.registerExtension) {
    require.registerExtension(".gs", function (content) {
      return compiler(content);
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
        return path.join(os.tmpDir(), "gs-" + __strnum(lang) + "prelude.cache");
      };
    }
    function f(lang, cb) {
      var parsedPrelude;
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
      return fs.stat(getPreludeSrcPath(lang), __once(function (_e, preludeSrcStat) {
        if (_e != null) {
          return flush(_e);
        }
        return fs.stat(getPreludeCachePath(lang), __once(function (err, preludeCacheStat) {
          var _f;
          if (err != null && err.code !== "ENOENT") {
            return flush(err, null);
          }
          if (preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime())) {
            _f = function (next) {
              return fs.readFile(getPreludeCachePath(lang), "utf8", __once(function (_e2, cachePrelude) {
                var _else;
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
                    console.error("Error deserializing prelude, reloading. " + String(e));
                    return fs.unlink(getPreludeCachePath(lang), __once(function (_e3) {
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
            return fs.readFile(getPreludeSrcPath(lang), "utf8", __once(function (_e2, prelude) {
              if (_e2 != null) {
                return flush(_e2);
              }
              if (parsedPrelude == null) {
                parsedPreludeByLang[lang] = parsedPrelude = parser(prelude, null, { serializeMacros: true });
                fs.writeFile(getPreludeCachePath(lang), parsedPrelude.macros.serialize(), "utf8", function (err) {
                  if (err != null) {
                    throw err;
                  }
                });
              }
              return flush(null, parsedPrelude);
            }));
          });
        }));
      }));
    }
    f.serialized = function (lang, cb) {
      if (typeof lang !== "string") {
        throw TypeError("Expected lang to be a String, got " + __typeof(lang));
      }
      if (typeof cb !== "function") {
        throw TypeError("Expected cb to be a Function, got " + __typeof(cb));
      }
      return f(lang, __once(function (_e) {
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
          parsedPrelude = parsedPreludeByLang[lang] = parser(prelude, null, { serializeMacros: true });
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
    var prelude;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return parse(source, null, options);
    }
    if (options.macros) {
      return parser(source, options.macros, options, callback);
    } else if (options.noPrelude) {
      return parser(source, null, options, callback);
    } else if (callback != null) {
      return fetchAndParsePrelude(options.lang || "js", __once(function (_e, prelude) {
        if (_e != null) {
          return callback(_e);
        }
        return parser(source, prelude.macros, options, callback);
      }));
    } else {
      prelude = fetchAndParsePrelude.sync(options.lang || "js");
      return parser(source, prelude.macros, options, callback);
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
    joinedParsed = { parseTime: 0, macroExpandTime: 0, reduceTime: 0, result: [] };
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
      translator = require(typeof options.translator === "string" ? options.translator : DEFAULT_TRANSLATOR);
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
            return parse(source, options, __once(function (_e, parsed) {
              if (_e != null) {
                return callback(_e);
              }
              return next2(parsed);
            }));
          };
        }
        return _f(function (parsed) {
          return translator(parsed.result, parsed.macros, options, __once(function (_e, translated) {
            if (_e != null) {
              return callback(_e);
            }
            return next(parsed, translated);
          }));
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
        return next(parsed, translator(parsed.result, parsed.macros, options));
      };
    }
    return _f(function (parsed, translated) {
      var result;
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
  compile = exports.compile = function (source, options, callback) {
    var _f, startTime;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return compile(source, null, options);
    }
    startTime = new Date().getTime();
    if (callback != null) {
      _f = function (next) {
        return translate(source, options, __once(function (_e, translated) {
          if (_e != null) {
            return callback(_e);
          }
          return next(translated);
        }));
      };
    } else {
      _f = function (next) {
        return next(translate(source, options));
      };
    }
    return _f(function (translated) {
      var compiled, result;
      compiled = translated.node.compile(options);
      result = {
        parseTime: translated.parseTime,
        macroExpandTime: translated.macroExpandTime,
        reduceTime: translated.reduceTime,
        translateTime: translated.translateTime,
        compileTime: compiled.compileTime,
        uglifyTime: compiled.uglifyTime,
        time: __num(new Date().getTime()) - __num(startTime),
        code: compiled.code
      };
      if (callback != null) {
        return callback(null, result);
      } else {
        return result;
      }
    });
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
  exports["eval"] = function (source, options, callback) {
    var _f;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return exports["eval"](source, null, options);
    }
    options["eval"] = true;
    options["return"] = false;
    if (callback != null) {
      _f = function (next) {
        return compile(source, options, __once(function (_e, compiled) {
          if (_e != null) {
            return callback(_e);
          }
          return next(compiled);
        }));
      };
    } else {
      _f = function (next) {
        return next(compile(source, options));
      };
    }
    return _f(function (compiled) {
      var result, startTime;
      startTime = new Date().getTime();
      result = null;
      try {
        result = evaluate(compiled.code, options);
      } catch (e) {
        if (callback != null) {
          return callback(e);
        } else {
          throw e;
        }
      }
      if (typeof options.progress === "function") {
        options.progress("eval", __num(new Date().getTime()) - __num(startTime));
      }
      if (callback != null) {
        return callback(null, result);
      } else {
        return result;
      }
    });
  };
  exports.run = function (source, options, callback) {
    var _f, mainModule, Module;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return exports.run(source, null, options);
    }
    if (typeof process === "undefined") {
      exports["eval"](source, options, callback != null
        ? function (err) {
          return callback(err);
        }
        : void 0);
      return;
    }
    mainModule = require.main;
    mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : ".";
    if (mainModule.moduleCache) {
      mainModule.moduleCache = {};
    }
    if (process.binding("natives").module) {
      Module = require("module").Module;
      mainModule.paths = Module._nodeModulePaths(path.dirname(options.filename));
    }
    if (path.extname(mainModule.filename) !== ".gs" || require.extensions) {
      if (callback != null) {
        _f = function (next) {
          return compile(source, options, __once(function (_e, ret) {
            if (_e != null) {
              return callback(_e);
            }
            return next(ret);
          }));
        };
      } else {
        _f = function (next) {
          return next(compile(source, options));
        };
      }
      _f(function (compiled) {
        mainModule._compile(compiled.code, mainModule.filename);
        if (typeof callback === "function") {
          return callback();
        }
      });
    } else {
      mainModule._compile(source, mainModule.filename);
      if (typeof callback === "function") {
        callback();
      }
    }
  };
  init = exports.init = function (options, callback) {
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return init(void 0, options);
    }
    if (callback != null) {
      fetchAndParsePrelude(options.lang || "js", callback);
    } else {
      fetchAndParsePrelude.sync(options.lang || "js");
    }
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
