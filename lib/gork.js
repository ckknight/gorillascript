(function (GLOBAL) {
  "use strict";
  var __async, __in, __isArray, __num, __once, __owns, __slice, __strnum, __toArray, __typeof, cli, commandToAction, commandToDependencies, commandToDescription, fs, gorilla, options, path, ranCommands, switches;
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
  gorilla = require("./gorilla");
  fs = require("fs");
  path = require("path");
  cli = require("cli");
  cli.enable("version");
  cli.setApp("gork", "0.5.2");
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
      throw TypeError("Expected letter to be one of String or null, got " + __typeof(letter));
    }
    if (typeof description !== "string") {
      throw TypeError("Expected description to be a String, got " + __typeof(description));
    }
    if (type == null) {
      type = void 0;
    } else if (typeof type !== "string") {
      throw TypeError("Expected type to be one of String or undefined, got " + __typeof(type));
    }
    switches[flag] = [letter, description].concat(type != null ? [type] : []);
  };
  ranCommands = [];
  function invokeCommand(name, explicit, callback) {
    var _f, dependencies;
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
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    if (!explicit && __in(name, ranCommands) && typeof callback === "function") {
      return callback();
    }
    if (!__owns.call(commandToAction, name)) {
      fatalError("No such command: '" + name + "'");
    }
    ranCommands.push(name);
    dependencies = __owns.call(commandToDependencies, name) && commandToDependencies[name] || [];
    if (callback != null) {
      _f = function (next) {
        return __async(
          1,
          __num(dependencies.length),
          false,
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
      };
    } else {
      _f = function (next) {
        var _arr, _i, _len, dependency;
        for (_arr = __toArray(dependencies), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          dependency = _arr[_i];
          invokeCommand(dependency, false);
        }
        return next();
      };
    }
    return _f(function () {
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
    });
  }
  GLOBAL.invoke = function (name, callback) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    return invokeCommand(name, true, callback);
  };
  GLOBAL.exit = process.exit;
  GLOBAL.output = cli.output;
  exports.run = function (callback) {
    if (callback == null) {
      callback = fatalError;
    }
    return fs.realpath(".", __once(function (_e, currentPath) {
      if (_e != null) {
        return callback(_e);
      }
      return findGorkfile(currentPath, __once(function (_e2, filepath) {
        if (_e2 != null) {
          return callback(_e2);
        }
        return fs.readFile(filepath, "utf-8", __once(function (_e3, text) {
          if (_e3 != null) {
            return callback(_e3);
          }
          process.chdir(path.dirname(filepath));
          return gorilla.run(
            text,
            { filename: "Gorkfile", includeGlobals: true },
            __once(function (_e4) {
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
                  false,
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
            })
          );
        }));
      }));
    }));
  };
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
    return fs.exists(filepath, __once(function (exists) {
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
    }));
  }
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
