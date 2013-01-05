"use strict";
var __isArray, __num, __owns, __slice, __toArray;
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
__slice = Function.prototype.call.bind(Array.prototype.slice);
__toArray = function (x) {
  if (__isArray(x)) {
    return x;
  } else {
    return __slice(x);
  }
};

