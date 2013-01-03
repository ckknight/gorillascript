"use strict";
var __isArray, __lt, __num, __slice, __strnum, __toArray, _tmp, _tmp2, ACCESSOR, backlog, enableColors, g, module, monkey, nonContextGlobals, readline, repl, REPL_PROMPT, REPL_PROMPT_CONTINUATION, sandbox, SIMPLEVAR, stdin, stdout, util, vm;
__isArray = typeof Array.isArray === "function" ? Array.isArray : (function () {
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
    throw TypeError("Expected a number, got " + typeof num);
  } else {
    return num;
  }
};
__slice = Function.prototype.call.bind(Array.prototype.slice);
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
for (_tmp = 0, _tmp2 = __num(nonContextGlobals.length); _tmp < _tmp2; ++_tmp) {
  g = nonContextGlobals[_tmp];
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
  var _tmp, completions, free, possibilities, vars;
  free = (_tmp = text.match(SIMPLEVAR)) != null ? _tmp[1] : void 0;
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
    var _tmp, _tmp2, _tmp3, e;
    for (_tmp = [], _tmp2 = 0, _tmp3 = __num(candidates.length); _tmp2 < _tmp3; ++_tmp2) {
      e = candidates[_tmp2];
      if (startsWith(e, prefix)) {
        _tmp.push(e);
      }
    }
    return _tmp;
  }());
}
process.on("uncaughtException", error);
repl = __lt(readline.createInterface.length, 3) ? (stdin.on("data", function (buffer) {
  return repl.write(buffer);
}), readline.createInterface(stdin, autocomplete)) : readline.createInterface(stdin, stdout, autocomplete);
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
