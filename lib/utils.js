(function () {
  "use strict";
  var __num, __strnum, __typeof;
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
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
  exports.stringRepeat = stringRepeat;
  exports.padLeft = function (text, len, padding) {
    return __strnum(stringRepeat(padding, __num(len) - __num(text.length))) + __strnum(text);
  };
  exports.padRight = function (text, len, padding) {
    return __strnum(text) + __strnum(stringRepeat(padding, __num(len) - __num(text.length)));
  };
}.call(this));
