"use strict";
var __lte, __num, __owns, compile, fetchAndParsePrelude, fs, parse, parser, path, translate, translator;
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
    throw TypeError("Expected a number, got " + typeof num);
  } else {
    return num;
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
fs = require("fs");
path = require("path");
if (require.extensions) {
  require.extensions[".ms"] = function (module, filename) {
    var content;
    content = compile(
      fs.readFileSync(filename, "utf8"),
      { filename: filename }
    );
    return module._compile(content, filename);
  };
} else if (require.registerExtension) {
  require.registerExtension(".ms", function (content) {
    return compiler(content);
  });
}
fetchAndParsePrelude = (function () {
  var fetchers, parsedPrelude, preludePath;
  parsedPrelude = void 0;
  fetchers = [];
  function flush(err, value) {
    for (; !__lte(fetchers.length, 0); ) {
      fetchers.shift()(err, value);
    }
  }
  preludePath = path.join(path.dirname(fs.realpathSync(__filename)), "../src/prelude.ms");
  function f(cb) {
    if (parsedPrelude != null) {
      return cb(null, parsedPrelude);
    }
    fetchers.push(cb);
    if (!__lte(fetchers.length, 1)) {
      return;
    }
    return fs.readFile(preludePath, "utf8", function (err, prelude) {
      if (err) {
        return flush(err, null);
      }
      if (parsedPrelude == null) {
        parsedPrelude = parser(prelude);
        translator(parsedPrelude.result);
      }
      return flush(null, parsedPrelude);
    });
  }
  f.sync = function () {
    var prelude;
    if (parsedPrelude != null) {
      return parsedPrelude;
    } else {
      prelude = fs.readFileSync(preludePath, "utf8");
      parsedPrelude = parser(prelude);
      translator(parsedPrelude.result);
      return parsedPrelude;
    }
  };
  return f;
}());
setTimeout(
  function () {
    return fetchAndParsePrelude(function (err) {
      if (err) {
        throw err;
      }
    });
  },
  1
);
parse = exports.parse = function (source, options) {
  var prelude;
  if (options == null) {
    options = {};
  }
  if (options.noPrelude) {
    return parser(source, null, options).result;
  } else {
    prelude = fetchAndParsePrelude.sync();
    return parser(source, prelude.macros, options);
  }
};
translate = exports.ast = function (source, options) {
  var parsed;
  if (options == null) {
    options = {};
  }
  parsed = parse(source, options);
  return translator(parsed.result, options).node;
};
compile = exports.compile = function (source, options) {
  var node;
  if (options == null) {
    options = {};
  }
  node = translate(source, options);
  return node.compile(options);
};
exports["eval"] = function (source, options) {
  var _arr, _i, _len, _module, _obj, _require, code, fun, k, Module, r, root, sandbox, Script, v;
  if (options == null) {
    options = {};
  }
  options["return"] = false;
  root = translate(source, options);
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
      for (_arr = Object.getOwnPropertyNames(require), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        r = _arr[_i];
        try {
          _require[r] = require[r];
        } catch (e) {}
      }
    }
    if (options.includeGlobals) {
      for (k in global) {
        if (__owns(global, k)) {
          if (!(k in sandbox)) {
            sandbox[k] = global[k];
          }
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
};
exports.run = function (source, options) {
  var mainModule, Module;
  if (options == null) {
    options = {};
  }
  mainModule = require.main;
  mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : ".";
  mainModule.moduleCache && (mainModule.moduleCache = {});
  if (process.binding("natives").module) {
    Module = require("module").Module;
    mainModule.paths = Module._nodeModulePaths(path.dirname(options.filename));
  }
  if (path.extname(mainModule.filename) !== ".ms" || require.extensions) {
    return mainModule._compile(
      compile(source, options),
      mainModule.filename
    );
  } else {
    return mainModule._compile(source, mainModule.filename);
  }
};
exports.init = function () {
  fetchAndParsePrelude.sync();
};
