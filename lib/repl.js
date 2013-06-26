(function (GLOBAL) {
  "use strict";
  var __cmp, __defer, __generatorToPromise, __in, __isArray, __owns, __slice,
      __toArray, __typeof, _i, backlog, child_process, enableColors, g, gorilla,
      module, nonContextGlobals, readline, sandbox, setImmediate, stdin, stdout,
      toGsIdent, toJsIdent, util, vm;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw new TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
      } else if (left < right) {
        return -1;
      } else {
        return 1;
      }
    }
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
            _ref = __defer();
            promise = _ref.promise;
            fulfill = _ref.fulfill;
            reject = _ref.reject;
            _ref = null;
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
                result = ret;
              },
              function (err) {
                state = 2;
                result = err;
              },
              true
            );
            switch (state) {
            case 0: throw new Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw new Error("Unknown state");
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
      throw new TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw new TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw new TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
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
  __in = typeof Array.prototype.indexOf === "function"
    ? (function (indexOf) {
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }(Array.prototype.indexOf))
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
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
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
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  gorilla = require("./gorilla");
  readline = require("readline");
  util = require("util");
  vm = require("vm");
  module = require("module");
  child_process = require("child_process");
  enableColors = process.platform !== "win32" && !process.env.NODE_DISABLE_COLORS;
  stdin = process.openStdin();
  stdout = process.stdout;
  function error(err) {
    return process.stderr.write((err.stack || err.toString()) + "\n\n");
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
  for (_i = nonContextGlobals.length; _i--; ) {
    g = nonContextGlobals[_i];
    sandbox[g] = GLOBAL[g];
  }
  sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
  sandbox._ = void 0;
  function unique(array) {
    var _arr, _i, _len, item, result;
    result = [];
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (!__in(item, result)) {
        result.push(item);
      }
    }
    return result;
  }
  function getAllPropertyNames(obj) {
    var current, result;
    result = [];
    if (obj == null) {
      return result;
    }
    current = Object(obj);
    while (current != null) {
      result.push.apply(result, Object.getOwnPropertyNames(current));
      current = Object.getPrototypeOf(current);
    }
    return unique(result);
  }
  function memoize(func) {
    var cache;
    cache = {};
    return function (name) {
      if (__owns.call(cache, name)) {
        return cache[name];
      } else {
        return cache[name] = func(name);
      }
    };
  }
  toJsIdent = memoize(function (name) {
    var _end, i, part, parts;
    parts = name.split("-");
    for (i = 1, _end = parts.length; i < _end; ++i) {
      part = parts[i];
      parts[i] = "" + part.charAt(0).toUpperCase() + part.substring(1);
    }
    return parts.join("");
  });
  toGsIdent = memoize(function (name) {
    var _end, i, lower, parts, result, upper;
    if (name.match(/^[A-Z]/) || !name.match(/[A-Z]/)) {
      return name;
    } else if (name === "isNaN") {
      return "is-NaN";
    } else {
      parts = name.split(/([A-Z]+)/);
      if (parts.length === 1) {
        return parts[0];
      } else {
        result = [parts[0]];
        for (i = 1, _end = parts.length; i < _end; i += 2) {
          upper = parts[i];
          lower = parts[i + 1];
          if (lower.length > 0) {
            if (upper.length > 1) {
              result.push(upper.substring(0, upper.length - 1));
            }
            result.push("" + upper.charAt(upper.length - 1).toLowerCase() + lower);
          } else if (upper.length > 0) {
            result.push(upper);
          }
        }
        return result.join("-");
      }
    }
  });
  function arrayToGsIdents(names) {
    var _arr, _i, _len, name;
    _arr = [];
    for (_i = 0, _len = names.length; _i < _len; ++_i) {
      name = names[_i];
      _arr.push(toGsIdent(name));
    }
    return _arr;
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
      try {
        val = vm.Script.runInContext(toJsIdent(obj), sandbox);
      } catch (err) {
        return;
      }
      return completeSegment(prefix, getAllPropertyNames(val));
    }
  }
  function completeVariable(text) {
    var _ref, free, globalThis;
    if ((_ref = text.match(/\s*([\w\-]*)$/)) != null) {
      free = _ref[1];
    }
    if (free) {
      try {
        globalThis = vm.Script.runInContext("this", sandbox);
      } catch (err) {
        globalThis = void 0;
      }
      return completeSegment(free, getAllPropertyNames(globalThis).concat(getAllPropertyNames(sandbox), __toArray(gorilla.getReservedWords())));
    }
  }
  function startsWith(source, check) {
    var checkLength;
    checkLength = check.length;
    if (source.length < checkLength) {
      return false;
    } else if (checkLength === 0) {
      return true;
    } else {
      return source.lastIndexOf(check, 0) === 0;
    }
  }
  function getCompletions(prefix, candidates) {
    var _arr, _arr2, _i, _len, e;
    _arr = [];
    for (_arr2 = __toArray(candidates), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
      e = _arr2[_i];
      if (startsWith(e, prefix)) {
        _arr.push(e);
      }
    }
    return _arr;
  }
  exports.start = function (options) {
    var pipe, pipeBacklog, recentSigint, repl;
    if (options == null) {
      options = {};
    }
    process.on("uncaughtException", error);
    if (readline.createInterface.length < 3) {
      stdin.on("data", function (buffer) {
        return repl.write(buffer);
      });
      repl = readline.createInterface(stdin, autoComplete);
    } else {
      repl = readline.createInterface(stdin, stdout, autoComplete);
    }
    if (options.pipe) {
      pipe = child_process.spawn(options.pipe);
      pipeBacklog = "";
      pipe.stdout.on("data", function (data) {
        var line, match;
        pipeBacklog += data.toString();
        while (true) {
          match = pipeBacklog.match(/^[^\n]*\n/);
          if (!match) {
            break;
          }
          line = match[0];
          pipeBacklog = pipeBacklog.substring(line.length);
          if (/^(?:\u001b.*?h)?\w*?> /.test(line)) {
            setTimeout(
              function () {
                return repl.prompt();
              },
              50
            );
          } else if (!/^(?:\u001b.*?h)?\.+ /.test(line)) {
            process.stdout.write(line);
          }
        }
      });
      pipe.stderr.on("data", function (data) {
        return process.stderr.write(data);
      });
    }
    recentSigint = false;
    repl.on("SIGINT", function () {
      if (backlog) {
        backlog = "";
        process.stdout.write("\n");
        repl.setPrompt("gs> ");
        repl.prompt();
        return repl.write(null, { ctrl: true, name: "u" });
      } else if (!recentSigint) {
        process.stdout.write("\n(^C again to quit)\n");
        repl.setPrompt("gs> ");
        repl.prompt();
        repl.write(null, { ctrl: true, name: "u" });
        return recentSigint = true;
      } else {
        repl.close();
        if (pipe != null) {
          return pipe.kill();
        }
      }
    });
    repl.on("close", function () {
      process.stdout.write("\n");
      return stdin.destroy();
    });
    repl.on("line", function (buffer) {
      var code, p;
      recentSigint = false;
      if (!buffer.toString().trim() && !backlog) {
        repl.prompt();
        return;
      }
      backlog += buffer;
      if (backlog.charAt(backlog.length - 1) === "\\") {
        backlog = backlog.substring(0, backlog.length - 1) + "\n";
        repl.setPrompt("..> ");
        repl.prompt();
        return;
      }
      repl.setPrompt("gs> ");
      code = backlog;
      backlog = "";
      if (pipe) {
        p = __generatorToPromise((function () {
          var _e, _send, _state, _step, _throw, compiled;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return {
                  done: false,
                  value: gorilla.compile(code, { "eval": true, filename: "repl", modulename: "repl" })
                };
              case 1:
                compiled = _received;
                ++_state;
                return { done: true, value: pipe.stdin.write(compiled.code) };
              case 2:
                return { done: true, value: void 0 };
              default: throw new Error("Unknown state: " + _state);
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
        }()));
      } else if (options.stdout) {
        p = __generatorToPromise((function () {
          var _e, _send, _state, _step, _throw, compiled;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return {
                  done: false,
                  value: gorilla.compile(code, { bare: true, "return": true, filename: "repl", modulename: "repl" })
                };
              case 1:
                compiled = _received;
                process.stdout.write(compiled.code + "\n");
                ++_state;
                return { done: true, value: repl.prompt() };
              case 2:
                return { done: true, value: void 0 };
              default: throw new Error("Unknown state: " + _state);
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
        }()));
      } else if (options.ast) {
        p = __generatorToPromise((function () {
          var _e, _send, _state, _step, _throw, ret;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return {
                  done: false,
                  value: gorilla.ast(code, { sandbox: sandbox, filename: "repl", modulename: "repl" })
                };
              case 1:
                ret = _received;
                process.stdout.write(util.inspect(ret.node, false, 2, enableColors) + "\n");
                ++_state;
                return { done: true, value: repl.prompt() };
              case 2:
                return { done: true, value: void 0 };
              default: throw new Error("Unknown state: " + _state);
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
        }()));
      } else if (options.parse) {
        p = __generatorToPromise((function () {
          var _e, _send, _state, _step, _throw, ret;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return {
                  done: false,
                  value: gorilla.parse(code, { sandbox: sandbox, filename: "repl", modulename: "repl" })
                };
              case 1:
                ret = _received;
                process.stdout.write(util.inspect(ret.result, false, 2, enableColors) + "\n");
                ++_state;
                return { done: true, value: repl.prompt() };
              case 2:
                return { done: true, value: void 0 };
              default: throw new Error("Unknown state: " + _state);
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
        }()));
      } else {
        p = __generatorToPromise((function () {
          var _e, _send, _state, _step, _throw, ret;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return {
                  done: false,
                  value: gorilla["eval"](code, { sandbox: sandbox, filename: "repl", modulename: "repl" })
                };
              case 1:
                ret = _received;
                if (ret !== void 0) {
                  process.stdout.write(util.inspect(ret, false, 2, enableColors) + "\n");
                }
                ++_state;
                return { done: true, value: repl.prompt() };
              case 2:
                return { done: true, value: void 0 };
              default: throw new Error("Unknown state: " + _state);
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
        }()));
      }
      return p.then(null, function (err) {
        process.stderr.write(String(err != null && err.stack || err) + "\n");
        return repl.prompt();
      });
    });
    repl.setPrompt("gs> ");
    return repl.prompt();
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
