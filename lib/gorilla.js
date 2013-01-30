(function () {
  "use strict";
  var __lte, __owns, compile, fetchAndParsePrelude, fs, os, parse, parser, path, translate, translator;
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
  __owns = (function () {
    var has;
    has = Object.prototype.hasOwnProperty;
    return function (parent, child) {
      return has.call(parent, child);
    };
  }());
  parser = require("./parser");
  translator = require("./translator");
  os = require("os");
  fs = require("fs");
  path = require("path");
  if (require.extensions) {
    require.extensions[".gs"] = function (module, filename) {
      var content;
      content = compile(
        fs.readFileSync(filename, "utf8"),
        { filename: filename }
      );
      return module._compile(content, filename);
    };
  } else if (require.registerExtension) {
    require.registerExtension(".gs", function (content) {
      return compiler(content);
    });
  }
  fetchAndParsePrelude = (function () {
    var fetchers, parsedPrelude, preludeCachePath, preludeSrcPath;
    parsedPrelude = void 0;
    fetchers = [];
    function flush(err, value) {
      while (fetchers.length > 0) {
        fetchers.shift()(err, value);
      }
    }
    preludeSrcPath = path.join(path.dirname(fs.realpathSync(__filename)), "../src/prelude.gs");
    preludeCachePath = path.join(os.tmpDir(), "gs-prelude.cache");
    function f(cb) {
      if (parsedPrelude != null) {
        return cb(null, parsedPrelude);
      }
      fetchers.push(cb);
      if (fetchers.length > 1) {
        return;
      }
      return fs.stat(preludeSrcPath, function (_e, preludeSrcStat) {
        if (_e != null) {
          return flush(_e);
        }
        return fs.stat(preludeCachePath, function (err, preludeCacheStat) {
          if (err != null && err.code !== "ENOENT") {
            return flush(err, null);
          }
          function next() {
            return fs.readFile(preludeSrcPath, "utf8", function (_e2, prelude) {
              if (_e2 != null) {
                return flush(_e2);
              }
              if (parsedPrelude == null) {
                parsedPrelude = parser(prelude, null, { serializeMacros: true });
                fs.writeFile(preludeCachePath, parsedPrelude.macros.serialize(), "utf8", function (err) {
                  if (err != null) {
                    throw err;
                  }
                });
              }
              return flush(null, parsedPrelude);
            });
          }
          if (__lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime())) {
            return fs.readFile(preludeCachePath, "utf8", function (_e2, cachePrelude) {
              var _else;
              if (_e2 != null) {
                return flush(_e2);
              }
              _else = true;
              try {
                return parsedPrelude = parser.deserializePrelude(cachePrelude);
              } catch (e) {
                _else = false;
                if (e instanceof ReferenceError) {
                  throw e;
                } else {
                  console.error("Error deserializing prelude, reloading. " + String(e));
                  return fs.unlink(preludeCachePath, function (_e3) {
                    if (_e3 != null) {
                      return flush(_e3);
                    }
                    return next();
                  });
                }
              } finally {
                if (_else) {
                  flush(null, parsedPrelude);
                }
              }
            });
          } else {
            return next();
          }
        });
      });
    }
    f.sync = function () {
      var cachePrelude, prelude, preludeCacheStat, preludeSrcStat;
      if (parsedPrelude != null) {
        return parsedPrelude;
      } else {
        preludeSrcStat = fs.statSync(preludeSrcPath);
        preludeCacheStat = (function () {
          try {
            return fs.statSync(preludeCachePath);
          } catch (e) {
            if (e.code !== "ENOENT") {
              throw e;
            }
          }
        }());
        if (preludeCacheStat && __lte(preludeSrcStat.mtime.getTime(), preludeCacheStat.mtime.getTime())) {
          cachePrelude = fs.readFileSync(preludeCachePath, "utf8");
          try {
            parsedPrelude = parser.deserializePrelude(cachePrelude);
          } catch (e) {
            if (e instanceof ReferenceError) {
              throw e;
            } else {
              console.error("Error deserializing prelude, reloading. " + String(e));
              fs.unlinkSync(preludeCachePath);
            }
          }
        }
        if (parsedPrelude == null) {
          prelude = fs.readFileSync(preludeSrcPath, "utf8");
          parsedPrelude = parser(prelude, null, { serializeMacros: true });
          fs.writeFile(preludeCachePath, parsedPrelude.macros.serialize(), "utf8", function (err) {
            if (err != null) {
              throw err;
            }
          });
        }
        return parsedPrelude;
      }
    };
    return f;
  }());
  parse = exports.parse = function (source, options, callback) {
    var prelude;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return parse(source, null, options);
    }
    if (options.noPrelude) {
      return parser(source, null, options, callback);
    } else if (callback != null) {
      return fetchAndParsePrelude(function (_e, prelude) {
        if (_e != null) {
          return callback(_e);
        }
        return parser(source, prelude.macros, options, callback);
      });
    } else {
      prelude = fetchAndParsePrelude.sync();
      return parser(source, prelude.macros, options, callback);
    }
  };
  exports.getReservedWords = function (options) {
    if (options == null) {
      options = {};
    }
    if (options.noPrelude) {
      return parser.getReservedWords();
    } else {
      return parser.getReservedWords(fetchAndParsePrelude.sync().macros);
    }
  };
  translate = exports.ast = function (source, options, callback) {
    var parsed;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return translate(source, null, callback);
    }
    if (callback != null) {
      return parse(source, options, function (_e, parsed) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, translator(parsed.result, options).node);
      });
    } else {
      parsed = parse(source, options, callback);
      return translator(parsed.result, options).node;
    }
  };
  compile = exports.compile = function (source, options, callback) {
    var node;
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return compile(source, null, callback);
    }
    if (callback != null) {
      return translate(source, options, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node.compile(options));
      });
    } else {
      node = translate(source, options, callback);
      return node.compile(options);
    }
  };
  function evaluate(root, options) {
    var _arr, _i, _module, _obj, _require, code, fun, k, Module, r, sandbox, Script, v;
    Script = require("vm").Script;
    if (Script) {
      sandbox = Script.createContext();
      sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
      if (options.sandbox != null) {
        if (options.sandbox instanceof sandbox.constructor) {
          sandbox = options.sandbox;
        } else {
          _obj = options.sandbox;
          for (k in _obj) {
            if (__owns(_obj, k)) {
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
        for (k in global) {
          if (__owns(global, k) && !(k in sandbox)) {
            sandbox[k] = global[k];
          }
        }
      }
      code = root.compile(options);
      return Script.runInContext(code, sandbox);
    } else {
      code = root.compile(options);
      fun = Function(code);
      return fun();
    }
  }
  exports["eval"] = function (source, options, callback) {
    if (options == null) {
      options = {};
    }
    if (typeof options === "function") {
      return exports["eval"](source, null, callback);
    }
    options["eval"] = true;
    options["return"] = false;
    if (callback != null) {
      return translate(source, options, function (_e, root) {
        var result;
        if (_e != null) {
          return callback(_e);
        }
        result = null;
        try {
          result = evaluate(root, options);
        } catch (e) {
          return callback(e);
        }
        return callback(null, result);
      });
    } else {
      return evaluate(
        translate(source, options),
        options
      );
    }
  };
  exports.run = function (source, options) {
    var mainModule, Module;
    if (options == null) {
      options = {};
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
      return mainModule._compile(
        compile(source, options),
        mainModule.filename
      );
    } else {
      return mainModule._compile(source, mainModule.filename);
    }
  };
  exports.init = function (callback) {
    if (callback != null) {
      fetchAndParsePrelude(callback);
    } else {
      fetchAndParsePrelude.sync();
    }
  };
}.call(this));
