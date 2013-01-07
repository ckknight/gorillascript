(function () {
  "use strict";
  var __isArray, __lt, __num, __slice, __strnum, __toArray, _i, _len, ACCESSOR, backlog, enableColors, g, module, monkey, nonContextGlobals, readline, repl, REPL_PROMPT, REPL_PROMPT_CONTINUATION, sandbox, SIMPLEVAR, stdin, stdout, util, vm;
  if (typeof Array.isArray === "function") {
    __isArray = Array.isArray;
  } else {
    __isArray = (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  }
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
      throw TypeError("Expected a number, got " + typeof num);
    } else {
      return num;
    }
  };
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
      throw TypeError("Expected a string or number, got " + type);
    }
  };
  __toArray = function (x) {
    if (__isArray(x)) {
      return x;
    } else {
      return __slice(x);
    }
  };
  monkey = require("./monkey");
  readline = require("readline");
  util = require("util");
  vm = require("vm");
  module = require("module");
  REPL_PROMPT = "monkey> ";
  REPL_PROMPT_CONTINUATION = "......> ";
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
  function run(buffer) {
    var code, ret;
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
      ret = monkey["eval"](code, { sandbox: sandbox, filename: "repl", modulename: "repl" });
      if (ret !== void 0) {
        sandbox._ = ret;
        process.stdout.write(__strnum(util.inspect(ret, false, 2, enableColors)) + "\n");
      }
    } catch (err) {
      error(err);
    }
    return repl.prompt();
  }
  ACCESSOR = /\s*([\w\.]+)(?:\.(\w*))$/;
  SIMPLEVAR = /\s*(\w*)$/;
  function autocomplete(text) {
    return completeAttribute(text) || completeVariable(text) || [[], text];
  }
  function completeAttribute(text) {
    var all, completions, match, obj, prefix, val;
    match = text.match(ACCESSOR);
    if (match) {
      all = match[0];
      obj = match[1];
      prefix = match[2];
      val = (function () {
        try {
          return vm.Script.runInContext(obj, sandbox);
        } catch (err) {
          return;
        }
      }());
      completions = getCompletions(prefix, Object.getOwnPropertyNames(val));
      return [completions, prefix];
    }
  }
  function completeVariable(text) {
    var _ref, completions, free, possibilities, vars;
    if ((_ref = text.match(SIMPLEVAR)) != null) {
      free = _ref[1];
    } else {
      free = void 0;
    }
    if (free) {
      vars = vm.Script.runInContext("Object.getOwnPropertyNames(this)", sandbox);
      possibilities = __toArray(vars).concat(__toArray(monkey.RESERVED));
      completions = getCompletions(free, possibilities);
      return [completions, free];
    }
  }
  function startsWith(source, check) {
    var checkLength;
    checkLength = check.length;
    if (__lt(source.length, checkLength)) {
      return false;
    } else if (checkLength === 0) {
      return true;
    } else if (source.charCodeAt(0) !== check.charCodeAt(0)) {
      return false;
    } else if (source.charCodeAt(__num(checkLength) - 1) !== check.charCodeAt(__num(checkLength) - 1)) {
      return false;
    } else {
      return source.substring(0, checkLength) === check;
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
  if (__lt(readline.createInterface.length, 3)) {
    stdin.on("data", function (buffer) {
      return repl.write(buffer);
    });
    repl = readline.createInterface(stdin, autocomplete);
  } else {
    repl = readline.createInterface(stdin, stdout, autocomplete);
  }
  repl.on("attemptClose", function () {
    if (backlog) {
      backlog = "";
      process.stdout.write("\n");
      repl.setPrompt(REPL_PROMPT);
      return repl.prompt();
    } else {
      return repl.close();
    }
  });
  repl.on("close", function () {
    process.stdout.write("\n");
    return stdin.destroy();
  });
  repl.on("line", run);
  repl.setPrompt(REPL_PROMPT);
  repl.prompt();
}.call(this));
