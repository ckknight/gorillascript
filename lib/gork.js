(function (GLOBAL) {
  "use strict";
  var __async, __in, __isArray, __num, __once, __owns, __slice, __strnum, __toArray, __typeof, cli, commandToAction, commandToDependencies, commandToDescription, fs, gorilla, options, path, ranCommands, switches;
  __async = function (limit, length, onValue, onComplete) {
    var broken, index, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    function onValueCallback(err) {
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (!sync) {
        return next();
      }
    }
    index = 0;
    function next() {
      var f, i;
      while (broken == null && slotsUsed < limit && index < length) {
        ++slotsUsed;
        i = index;
        ++index;
        sync = true;
        onValue(i, __once(onValueCallback));
        sync = false;
      }
      if (broken != null || slotsUsed === 0) {
        f = onComplete;
        onComplete = void 0;
        if (f) {
          return f(broken);
        }
      }
    }
    return next();
  };
  __in = typeof Array.prototype.indexOf === "function"
    ? (function () {
      var indexOf;
      indexOf = Array.prototype.indexOf;
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }())
    : function (child, parent) {
      var i, len;
      len = +parent.length;
      i = -1;
      while (++i < len) {
        if (child === parent[i] && i in parent) {
          return true;
        }
      }
      return false;
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
  __once = function (func) {
    if (typeof func !== "function") {
      throw Error("Expected func to be a Function, got " + __typeof(func));
    }
    return function () {
      var f;
      if (func) {
        f = func;
        func = null;
        return f.apply(this, arguments);
      } else {
        throw Error("Attempted to call function more than once");
      }
    };
  };
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
  gorilla = require("./gorilla");
  fs = require("fs");
  path = require("path");
  cli = require("cli");
  cli.enable("version");
  cli.setApp("gork", "1.0");
  cli.setUsage("gork [OPTIONS]");
  commandToAction = {};
  commandToDescription = {};
  commandToDependencies = {};
  switches = {};
  options = {};
  GLOBAL.command = function (name, description, dependencies, action) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (typeof description === "function") {
      return GLOBAL.command(name, null, null, description);
    } else if (__isArray(description)) {
      return GLOBAL.command(name, null, description, action);
    } else if (typeof dependencies === "function") {
      return GLOBAL.command(name, description, null, dependencies);
    }
    if (description != null && typeof description !== "string") {
      throw TypeError("Expected action to be a String or null, got " + __typeof(description));
    }
    if (dependencies != null && !__isArray(dependencies)) {
      throw TypeError("Expected action to be an Array or null, got " + __typeof(dependencies));
    }
    if (typeof action !== "function") {
      throw TypeError("Expected action to be a Function, got " + __typeof(action));
    }
    if (description != null) {
      commandToDescription[name] = description;
    }
    if (dependencies != null) {
      commandToDependencies[name] = dependencies;
    }
    return commandToAction[name] = action;
  };
  GLOBAL.option = function (flag, letter, description, type) {
    if (typeof flag !== "string") {
      throw TypeError("Expected flag to be a String, got " + __typeof(flag));
    }
    if (letter == null) {
      letter = null;
    } else if (typeof letter !== "string") {
      throw TypeError("Expected letter to be a String or null, got " + __typeof(letter));
    }
    if (typeof description !== "string") {
      throw TypeError("Expected description to be a String, got " + __typeof(description));
    }
    if (type == null) {
      type = void 0;
    } else if (typeof type !== "string") {
      throw TypeError("Expected type to be a String or undefined, got " + __typeof(type));
    }
    switches[flag] = [letter, description].concat(type != null ? [type] : []);
  };
  ranCommands = [];
  function invokeCommand(name, explicit, callback) {
    var _arr, _i, _len, dependencies, dependency;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (explicit == null) {
      explicit = false;
    } else if (typeof explicit !== "boolean") {
      throw TypeError("Expected explicit to be a Boolean, got " + __typeof(explicit));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be a Function or null, got " + __typeof(callback));
    }
    if (!explicit && __in(name, ranCommands) && typeof callback === "function") {
      return callback();
    }
    if (!__owns.call(commandToAction, name)) {
      fatalError("No such command: '" + name + "'");
    }
    ranCommands.push(name);
    dependencies = __owns.call(commandToDependencies, name) && commandToDependencies[name] || [];
    function next() {
      var action, result;
      action = commandToAction[name];
      if (__num(action.length) >= 2 && callback == null) {
        fatalError("Cannot invoke command '" + name + "' without specifying a callback");
      }
      if (__num(action.length) < 2 && callback != null) {
        try {
          result = action(options);
        } catch (e) {
          return callback(e);
        }
        return callback(null, result);
      } else {
        return action(options, callback);
      }
    }
    if (callback != null) {
      return __async(
        1,
        __num(dependencies.length),
        function (_i, next) {
          var dependency;
          dependency = dependencies[_i];
          return invokeCommand(dependency, false, next);
        },
        function (err) {
          if (typeof err !== "undefined" && err !== null) {
            return callback(err);
          }
          return next();
        }
      );
    } else {
      for (_arr = __toArray(dependencies), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        dependency = _arr[_i];
        invokeCommand(dependency, false);
      }
      return next();
    }
  }
  GLOBAL.invoke = function (name, callback) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be a Function or null, got " + __typeof(callback));
    }
    return invokeCommand(name, true, callback);
  };
  GLOBAL.exit = process.exit;
  GLOBAL.output = cli.output;
  exports.run = function (callback) {
    if (callback == null) {
      callback = fatalError;
    }
    return fs.realpath(".", function (_e, currentPath) {
      if (_e != null) {
        return callback(_e);
      }
      return findGorkfile(currentPath, function (_e2, filepath) {
        if (_e2 != null) {
          return callback(_e2);
        }
        return fs.readFile(filepath, "utf-8", function (_e3, text) {
          if (_e3 != null) {
            return callback(_e3);
          }
          process.chdir(path.dirname(filepath));
          return gorilla["eval"](
            text,
            { filename: "Gorkfile", includeGlobals: true },
            function (_e4) {
              if (_e4 != null) {
                return callback(_e4);
              }
              cli.parse(switches, commandToDescription);
              if (__num(process.argv.length) <= 2) {
                cli.getUsage();
                return;
              }
              return cli.main(function (args, opts) {
                var _i, _len, _this, command, commands;
                _this = this;
                commands = [this.command].concat(__toArray(args));
                for (_i = 0, _len = commands.length; _i < _len; ++_i) {
                  command = commands[_i];
                  if (command && !__owns.call(commandToAction, command)) {
                    fatalError("Unknown command: " + __strnum(command));
                  }
                }
                options = opts;
                return __async(
                  1,
                  commands.length,
                  function (_i, next) {
                    var command;
                    command = commands[_i];
                    if (command) {
                      return invoke(command, next);
                    } else {
                      return next();
                    }
                  },
                  function (err) {
                    return callback(err);
                  }
                );
              });
            }
          );
        });
      });
    });
  };
  function stringRepeat(text, count) {
    if (__num(count) < 1) {
      return "";
    } else if (count === 1) {
      return text;
    } else if (__num(count) & 1) {
      return __strnum(text) + __strnum(stringRepeat(text, __num(count) - 1));
    } else {
      return stringRepeat(__strnum(text) + __strnum(text), __num(count) / 2);
    }
  }
  function padRight(text, length) {
    return __strnum(text) + __strnum(stringRepeat(" ", __num(length) - __num(text.length)));
  }
  function fatalError(message) {
    if (message == null) {
      return;
    }
    console.error(String(message) + "\n");
    console.log("To see a list of all commands/options, run 'gork'.");
    return process.exit(1);
  }
  function findGorkfile(dir, callback) {
    var filepath;
    if (typeof callback !== "function") {
      throw TypeError("Expected callback to be a Function, got " + __typeof(callback));
    }
    filepath = path.join(dir, "Gorkfile");
    return fs.exists(filepath, function (exists) {
      var parent;
      if (exists) {
        return callback(null, filepath);
      } else {
        parent = path.normalize(path.join(dir, ".."));
        if (parent === dir) {
          return callback(Error("Gorkfile not found in " + __strnum(process.cwd())));
        }
        return findGorkfile(parent, callback);
      }
    });
  }
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));