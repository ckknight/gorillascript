(function () {
  "use strict";
  var __cmp, __isArray, __lt, __num, __owns, __slice, __strnum, __toArray, __typeof, _i, _len, backlog, enableColors, g, gorilla, module, nonContextGlobals, readline, recentSigint, repl, REPL_PROMPT, REPL_PROMPT_CONTINUATION, sandbox, stdin, stdout, toGsIdent, toJsIdent, util, vm;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
      } else if (left < right) {
        return -1;
      } else {
        return 1;
      }
    }
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __lt = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x < y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
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
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
    if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else {
      return __slice(x);
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
  gorilla = require("./gorilla");
  readline = require("readline");
  util = require("util");
  vm = require("vm");
  module = require("module");
  REPL_PROMPT = "gs> ";
  REPL_PROMPT_CONTINUATION = "..> ";
  enableColors = process.platform !== "win32" && !process.env.NODE_DISABLE_COLORS;
  stdin = process.openStdin();
  stdout = process.stdout;
  function error(err) {
    return process.stderr.write(__strnum(err.stack || err.toString()) + "\n\n");
  }
  backlog = "";
  sandbox = vm.Script.createContext();
  nonContextGlobals = [
    "Buffer",
    "console",
    "process",
    "setInterval",
    "clearInterval",
    "setTimeout",
    "clearTimeout"
  ];
  for (_i = 0, _len = __num(nonContextGlobals.length); _i < _len; ++_i) {
    g = nonContextGlobals[_i];
    sandbox[g] = this[g];
  }
  sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
  sandbox._ = void 0;
  function unique(array) {
    var _i, _len, item, result;
    result = [];
    for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
      item = array[_i];
      if (result.indexOf(item) === -1) {
        result.push(item);
      }
    }
    return result;
  }
  function getAllPropertyNames(obj) {
    var current, result;
    result = [];
    current = obj;
    for (; current != null; ) {
      result.push.apply(result, Object.getOwnPropertyNames(current));
      current = Object.getPrototypeOf(current);
    }
    return unique(result);
  }
  function memoize(func) {
    var cache;
    cache = {};
    return function (name) {
      if (__owns(cache, name)) {
        return cache[name];
      } else {
        return cache[name] = func(name);
      }
    };
  }
  toJsIdent = memoize(function (name) {
    var _end, i, part, parts;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    parts = name.split("-");
    for (i = 1, _end = __num(parts.length); i < _end; ++i) {
      part = parts[i];
      parts[i] = __strnum(part.charAt(0).toUpperCase()) + __strnum(part.substring(1));
    }
    return parts.join("");
  });
  toGsIdent = memoize(function (name) {
    var _end, i, lower, parts, result, upper;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (name.match(/^[A-Z]/) || !name.match(/[A-Z]/)) {
      return name;
    } else if (name === "isNaN") {
      return "is-NaN";
    } else {
      parts = name.split(/([A-Z]+)/);
      if (parts.length === 1) {
        return parts[0];
      } else {
        result = [];
        result.push(parts[0]);
        for (i = 1, _end = __num(parts.length); i < _end; i -= -2) {
          upper = parts[i];
          lower = parts[__num(i) + 1];
          if (__num(lower.length) > 0) {
            if (__num(upper.length) > 1) {
              result.push(upper.substring(0, __num(upper.length) - 1));
            }
            result.push(__strnum(upper.charAt(__num(upper.length) - 1).toLowerCase()) + __strnum(lower));
          } else if (__num(upper.length) > 0) {
            result.push(upper);
          }
        }
        return result.join("-");
      }
    }
  });
  function arrayToGsIdents(names) {
    if (!__isArray(names)) {
      throw TypeError("Expected names to be a Array, got " + __typeof(names));
    }
    return (function () {
      var _arr, _i, _len, name;
      for (_arr = [], _i = 0, _len = __num(names.length); _i < _len; ++_i) {
        name = names[_i];
        _arr.push(toGsIdent(name));
      }
      return _arr;
    }());
  }
  function autoComplete(text) {
    return completeAttribute(text) || completeVariable(text) || [[], text];
  }
  function completeSegment(prefix, possibilities) {
    var completions;
    completions = unique(getCompletions(prefix, arrayToGsIdents(possibilities))).sort(function (a, b) {
      return __cmp(a.toLowerCase(), b.toLowerCase());
    });
    return [completions, prefix];
  }
  function completeAttribute(text) {
    var all, match, obj, prefix, val;
    match = text.match(/\s*([\w\-\.]+)(?:\.([\w\-]*))$/);
    if (match) {
      all = match[0];
      obj = match[1];
      prefix = match[2];
      val = (function () {
        try {
          return vm.Script.runInContext(toJsIdent(obj), sandbox);
        } catch (err) {
          return;
        }
      }());
      return completeSegment(prefix, getAllPropertyNames(val));
    }
  }
  function completeVariable(text) {
    var _ref, free, globalThis;
    free = (_ref = text.match(/\s*([\w\-]*)$/)) != null ? _ref[1] : void 0;
    if (free) {
      globalThis = (function () {
        try {
          return vm.Script.runInContext("this", sandbox);
        } catch (err) {
          return;
        }
      }());
      return completeSegment(free, __toArray(getAllPropertyNames(globalThis)).concat(__toArray(getAllPropertyNames(sandbox)), __toArray(gorilla.getReservedWords())));
    }
  }
  function startsWith(source, check) {
    var checkLength;
    checkLength = check.length;
    if (__lt(source.length, checkLength)) {
      return false;
    } else if (checkLength === 0) {
      return true;
    } else {
      return source.lastIndexOf(check, 0) === 0;
    }
  }
  function getCompletions(prefix, candidates) {
    return (function () {
      var _arr, _i, _len, e;
      for (_arr = [], _i = 0, _len = __num(candidates.length); _i < _len; ++_i) {
        e = candidates[_i];
        if (startsWith(e, prefix)) {
          _arr.push(e);
        }
      }
      return _arr;
    }());
  }
  process.on("uncaughtException", error);
  repl = __num(readline.createInterface.length) < 3
    ? (stdin.on("data", function (buffer) {
      return repl.write(buffer);
    }), readline.createInterface(stdin, autoComplete))
    : readline.createInterface(stdin, stdout, autoComplete);
  recentSigint = false;
  repl.on("SIGINT", function () {
    if (backlog) {
      backlog = "";
      process.stdout.write("\n");
      repl.setPrompt(REPL_PROMPT);
      repl.prompt();
      return repl.write(null, { ctrl: true, name: "u" });
    } else if (!recentSigint) {
      process.stdout.write("\n(^C again to quit)\n");
      repl.setPrompt(REPL_PROMPT);
      repl.prompt();
      repl.write(null, { ctrl: true, name: "u" });
      return recentSigint = true;
    } else {
      return repl.close();
    }
  });
  repl.on("close", function () {
    process.stdout.write("\n");
    return stdin.destroy();
  });
  repl.on("line", function (buffer) {
    var code, ret;
    recentSigint = false;
    if (!buffer.toString().trim() && !backlog) {
      repl.prompt();
      return;
    }
    backlog = __strnum(backlog) + __strnum(buffer);
    if (backlog.charAt(__num(backlog.length) - 1) === "\\") {
      backlog = __strnum(backlog.substring(0, __num(backlog.length) - 1)) + "\n";
      repl.setPrompt(REPL_PROMPT_CONTINUATION);
      repl.prompt();
      return;
    }
    repl.setPrompt(REPL_PROMPT);
    code = backlog;
    backlog = "";
    try {
      ret = gorilla["eval"](code, { sandbox: sandbox, filename: "repl", modulename: "repl" });
      if (ret !== void 0) {
        sandbox._ = ret;
        process.stdout.write(__strnum(util.inspect(ret, false, 2, enableColors)) + "\n");
      }
    } catch (err) {
      error(err);
    }
    return repl.prompt();
  });
  repl.setPrompt(REPL_PROMPT);
  repl.prompt();
}.call(this));
