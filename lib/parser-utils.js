(function () {
  "use strict";
  var __async, __isArray, __once, __owns, __slice, __toArray, __typeof,
      nodeToType, Type;
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw new TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw new TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw new TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
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
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __once = (function () {
    function replacement() {
      throw new Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw new TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
      }
      return function () {
        var f;
        f = func;
        if (silentFail) {
          func = doNothing;
        } else {
          func = replacement;
        }
        return f.apply(this, arguments);
      };
    };
  }());
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
  Type = require("./types");
  nodeToType = (function () {
    var identToType;
    identToType = {
      Boolean: Type.boolean,
      String: Type.string,
      Number: Type.number,
      Array: Type.array,
      Object: Type.object,
      Function: Type["function"],
      RegExp: Type.regexp,
      Date: Type.date,
      Error: Type.error,
      RangeError: Type.error,
      ReferenceError: Type.error,
      SyntaxError: Type.error,
      TypeError: Type.error,
      URIError: Type.error
    };
    return function (node) {
      var _arr, _arr2, _end, _i, _len, arg, args, basetype, current, data, i,
          key, type;
      switch (node.nodeTypeId) {
      case 0:
        switch (node.value) {
        case null: return Type["null"];
        case void 0: return Type["undefined"];
        default: return Type.any;
        }
        break;
      case 1:
        if (node.isIdent && __owns.call(identToType, node.name)) {
          return identToType[node.name];
        } else {
          return Type.any;
        }
      case 2:
        if (node.isInternalCall()) {
          switch (node.func.name) {
          case "typeUnion":
            current = Type.none;
            for (_arr = __toArray(node.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              current = current.union(nodeToType(type));
            }
            return current;
          case "typeGeneric":
            basetype = nodeToType(node.args[0]);
            _arr = [];
            for (_arr2 = __toArray(node.args), _i = 1, _len = _arr2.length; _i < _len; ++_i) {
              arg = _arr2[_i];
              _arr.push(nodeToType(arg));
            }
            args = _arr;
            if (basetype === Type.array || basetype === Type["function"]) {
              return Type.generic.apply(Type, [basetype.base].concat(args));
            } else if (basetype !== Type.any) {
              return Type.generic.apply(Type, [basetype].concat(args));
            } else {
              return Type.any;
            }
          case "typeObject":
            data = {};
            for (i = 0, _end = +node.args.length; i < _end; i += 2) {
              key = node.args[i];
              if (key.isConst()) {
                data[key.constValue()] = nodeToType(node.args[i + 1]);
              }
            }
            return Type.makeObject(data);
          default: return Type.any;
          }
        } else {
          return Type.any;
        }
        break;
      default: return Type.any;
      }
    };
  }());
  function map(array, func, context) {
    var _arr, _i, _len, changed, item, newItem, result;
    result = [];
    changed = false;
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      newItem = func.call(context, item);
      result.push(newItem);
      if (item !== newItem) {
        changed = true;
      }
    }
    if (changed) {
      return result;
    } else {
      return array;
    }
  }
  function mapAsync(array, func, context, callback) {
    var changed;
    changed = false;
    return __async(
      1,
      +array.length,
      true,
      function (_i, next) {
        var _once, item;
        item = array[_i];
        return func.call(context, item, (_once = false, function (_e, newItem) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (typeof _e !== "undefined" && _e !== null) {
            return next(_e);
          }
          if (item !== newItem) {
            changed = true;
          }
          return next(null, newItem);
        }));
      },
      function (err, result) {
        if (typeof err !== "undefined" && err !== null) {
          return callback(err);
        } else {
          return callback(null, changed ? result : array);
        }
      }
    );
  }
  function addParamToScope(scope, param, forceMutable) {
    var _arr, _i, asType, child, element, ident, isMutable, isSpread,
        ParserNode;
    ParserNode = require("./parser-nodes");
    if (param.isInternalCall()) {
      if (param.func.isParam) {
        ident = param.args[0];
        isSpread = param.args[2].constValue();
        isMutable = forceMutable || param.args[3].constValue();
        asType = param.args[4].convertNothing(void 0);
        if (ident.isSymbol && ident.isIdentOrTmp) {
          scope.add(ident, isMutable, asType ? nodeToType(asType) : isSpread ? Type.array : Type.any);
        } else if (ident.isInternalCall("access")) {
          child = ident.args[1];
          if (!child.isConstType("string")) {
            throw new Error("Expected constant access: " + __typeof(child));
          }
          scope.add(
            ParserNode.Symbol.ident(param.index, param.scope, child.value),
            isMutable,
            asType ? nodeToType(asType) : isSpread ? Type.array : Type.any
          );
        } else {
          throw new Error("Unknown param ident: " + __typeof(ident));
        }
      } else if (param.func.isArray) {
        for (_arr = __toArray(param.args), _i = _arr.length; _i--; ) {
          element = _arr[_i];
          addParamToScope(scope, element, forceMutable);
        }
      } else if (param.func.isObject) {
        for (_arr = __toArray(param.args), _i = _arr.length - 1; _i >= 1; --_i) {
          element = _arr[_i];
          addParamToScope(scope, element.args[1], forceMutable);
        }
      }
    } else if (!param.isSymbol || !param.isInternal || !param.isNothing) {
      throw new Error("Unknown param node type: " + __typeof(param));
    }
  }
  exports.nodeToType = nodeToType;
  exports.map = map;
  exports.mapAsync = mapAsync;
  exports.addParamToScope = addParamToScope;
}.call(this));
