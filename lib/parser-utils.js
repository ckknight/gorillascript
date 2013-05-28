(function () {
  "use strict";
  var __async, __isArray, __once, __owns, __slice, __toArray, __typeof,
      nodeToType, Type;
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
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw TypeError("Expected an object with a length property, got " + __typeof(x));
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
      var _arr, _arr2, _i, _len, _ref, arg, args, basetype, current, data, key,
          Node, type, value;
      Node = require("./parser-nodes");
      if (!(node instanceof Node)) {
        throw TypeError("Expected a Node, got " + __typeof(node));
      }
      if (node instanceof Node.Ident) {
        return (__owns.call(identToType, _ref = node.name) ? identToType[_ref] : void 0) || Type.any;
      } else if (node instanceof Node.Const) {
        if (node.value === null) {
          return Type["null"];
        } else if (node.value === void 0) {
          return Type["undefined"];
        } else {
          return Type.any;
        }
      } else if (node instanceof Node.TypeGeneric) {
        basetype = nodeToType(node.basetype);
        for (_arr = [], _arr2 = __toArray(node.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          arg = _arr2[_i];
          _arr.push(nodeToType(arg));
        }
        args = _arr;
        if (basetype === Type.array || basetype === Type["function"]) {
          return Type.generic.apply(Type, [basetype.base].concat(__toArray(args)));
        } else if (basetype !== Type.any) {
          return Type.generic.apply(Type, [basetype].concat(__toArray(args)));
        } else {
          return Type.any;
        }
      } else if (node instanceof Node.TypeUnion) {
        current = Type.none;
        for (_arr = __toArray(node.types), _i = _arr.length; _i--; ) {
          type = _arr[_i];
          current = current.union(nodeToType(type));
        }
        return current;
      } else if (node instanceof Node.TypeObject) {
        data = {};
        for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          _ref = _arr[_i];
          key = _ref.key;
          value = _ref.value;
          if (key instanceof Node.Const) {
            data[key.value] = nodeToType(value);
          }
        }
        return Type.makeObject(data);
      } else {
        return Type.any;
      }
    };
  }());
  function map(array, func, arg) {
    var _arr, _i, _len, changed, item, newItem, result;
    result = [];
    changed = false;
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      newItem = func(item, arg);
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
  function mapAsync(array, func) {
    var _i, args, callback, changed;
    _i = arguments.length - 1;
    if (_i > 2) {
      args = __slice.call(arguments, 2, _i);
    } else {
      _i = 2;
      args = [];
    }
    callback = arguments[_i];
    changed = false;
    return __async(
      1,
      +array.length,
      true,
      function (_i2, next) {
        var _once, item;
        item = array[_i2];
        return func.apply(void 0, [item].concat(__toArray(args), [
          (_once = false, function (_e, newItem) {
            if (_once) {
              throw Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (_e != null) {
              return next(_e);
            }
            if (item !== newItem) {
              changed = true;
            }
            return next(null, newItem);
          })
        ]));
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
    var _arr, _i, _ref, element, Node, pair;
    Node = require("./parser-nodes");
    if (param instanceof Node.Param) {
      if ((_ref = param.ident) instanceof Node.Ident || _ref instanceof Node.Tmp) {
        scope.add(param.ident, forceMutable || param.isMutable, param.asType ? nodeToType(param.asType) : param.spread ? Type.array : Type.any);
      } else if (param.ident instanceof Node.Access) {
        if (!(param.ident.child instanceof Node.Const) || typeof param.ident.child.value !== "string") {
          throw Error("Expected constant access: " + __typeof(param.ident.child));
        }
        scope.add(
          Node.Ident(param.index, param.scope, param.ident.child.value),
          forceMutable || param.isMutable,
          param.asType ? nodeToType(param.asType) : param.spread ? Type.array : Type.any
        );
      } else {
        throw Error("Unknown param ident: " + __typeof(param.ident));
      }
    } else if (param instanceof Node.Array) {
      for (_arr = __toArray(param.elements), _i = _arr.length; _i--; ) {
        element = _arr[_i];
        addParamToScope(scope, element, forceMutable);
      }
    } else if (param instanceof Node.Object) {
      for (_arr = __toArray(param.pairs), _i = _arr.length; _i--; ) {
        pair = _arr[_i];
        addParamToScope(scope, pair.value, forceMutable);
      }
    } else if (!(param instanceof Node.Nothing)) {
      throw Error("Unknown param node type: " + __typeof(param));
    }
  }
  exports.nodeToType = nodeToType;
  exports.map = map;
  exports.mapAsync = mapAsync;
  exports.addParamToScope = addParamToScope;
}.call(this));
