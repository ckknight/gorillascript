(function () {
  "use strict";
  var __allkeys, __cmp, __create, __floor, __freeze, __freezeFunc, __in, __instanceofsome, __isArray, __keys, __log, __lt, __lte, __new, __num, __owns, __pow, __slice, __splice, __sqrt, __strnum, __toArray, __typeof, __xor;
  __allkeys = function (x) {
    var key, keys;
    keys = [];
    for (key in x) {
      keys.push(key);
    }
    return keys;
  };
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
  if (typeof Object.create === "function") {
    __create = Object.create;
  } else {
    __create = function (x) {
      function F() {
        
      }
      F.prototype = x;
      return new F();
    };
  }
  __floor = Math.floor;
  if (typeof Object.freeze === "function") {
    __freeze = Object.freeze;
  } else {
    __freeze = function (x) {
      return x;
    };
  }
  __freezeFunc = function (x) {
    if (x.prototype != null) {
      __freeze(x.prototype);
    }
    return __freeze(x);
  };
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
  __instanceofsome = function (value, array) {
    return (function () {
      var _i, _len, item;
      for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
        item = array[_i];
        if (value instanceof item) {
          return true;
        }
      }
      return false;
    }());
  };
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
  if (typeof Object.keys === "function") {
    __keys = Object.keys;
  } else {
    __keys = function (x) {
      var key, keys;
      keys = [];
      for (key in x) {
        if (__owns(x, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
  }
  __log = Math.log;
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
  __new = (function () {
    var newCreators;
    newCreators = [];
    return function (Ctor, args) {
      var creator, func, i, length;
      length = args.length;
      creator = newCreators[length];
      if (!creator) {
        func = ["return new C("];
        for (i = 0, __num(length); i < length; ++i) {
          if (i > 0) {
            func.push(", ");
          }
          func.push("a[", i, "]");
        }
        func.push(");");
        creator = Function("C", "a", func.join(""));
        newCreators[length] = creator;
      }
      return creator(Ctor, args);
    };
  }());
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
  __pow = Math.pow;
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
  __splice = (function () {
    var splice;
    splice = Array.prototype.splice;
    return function (array, start, end, right) {
      var len;
      len = array.length;
      if (start < 0) {
        start -= -len;
      }
      if (end < 0) {
        end -= -len;
      }
      splice.apply(array, [start, end - start].concat(__toArray(right)));
      return right;
    };
  }());
  __sqrt = Math.sqrt;
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
  __xor = function (x, y) {
    if (x) {
      return !y;
    } else {
      return y;
    }
  };
  
}.call(this));
