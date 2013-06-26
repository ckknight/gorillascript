(function () {
  "use strict";
  var __bind, __create, __in, __isArray, __owns, __slice, __toArray, __typeof,
      isAcceptableIdent, padLeft, toJSSource;
  __bind = function (parent, child) {
    var func;
    if (parent == null) {
      throw new TypeError("Expected parent to be an object, got " + __typeof(parent));
    }
    func = parent[child];
    if (typeof func !== "function") {
      throw new Error("Trying to bind child '" + String(child) + "' which is not a function");
    }
    return function () {
      return func.apply(parent, arguments);
    };
  };
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
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
  padLeft = require("./utils").padLeft;
  isAcceptableIdent = (function () {
    var IDENTIFIER_REGEX, IDENTIFIER_UNICODE_REGEX, RESERVED;
    IDENTIFIER_REGEX = /^[a-zA-Z_\$][a-zA-Z_\$0-9]*$/;
    IDENTIFIER_UNICODE_REGEX = /^[a-zA-Z_\$\u00a0-\uffff][a-zA-Z_\$0-9\u00a0-\uffff]*$/;
    RESERVED = [
      "arguments",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "enum",
      "export",
      "extends",
      "eval",
      "false",
      "finally",
      "for",
      "function",
      "if",
      "implements",
      "import",
      "in",
      "Infinity",
      "instanceof",
      "interface",
      "let",
      "NaN",
      "new",
      "null",
      "package",
      "private",
      "protected",
      "public",
      "return",
      "static",
      "super",
      "switch",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "undefined",
      "var",
      "void",
      "while",
      "with",
      "yield"
    ];
    return function (name, allowUnicode) {
      var regex;
      if (allowUnicode == null) {
        allowUnicode = false;
      }
      if (allowUnicode) {
        regex = IDENTIFIER_UNICODE_REGEX;
      } else {
        regex = IDENTIFIER_REGEX;
      }
      return regex.test(name) && !__in(name, RESERVED);
    };
  }());
  toJSSource = (function () {
    var LARGE_CHARACTER_SIZE, LARGE_CONTAINER_SIZE, types;
    function indent(sb, amount, space) {
      var i;
      if (space == null) {
        space = "  ";
      }
      for (i = 0; i < amount; ++i) {
        sb(space);
      }
    }
    function moreIndent(options) {
      var _o;
      _o = __create(options);
      _o.indent = +options.indent + 1;
      return _o;
    }
    LARGE_CHARACTER_SIZE = 50;
    LARGE_CONTAINER_SIZE = 7;
    function isLarge(value) {
      var i, k, v;
      if (value == null) {
        return false;
      } else if (value instanceof RegExp) {
        return isLarge(value.source);
      } else if (value instanceof Date) {
        return false;
      } else if (__isArray(value)) {
        switch (value.length) {
        case 0: return false;
        case 1: return isLarge(value[0]);
        default: return true;
        }
      } else {
        switch (typeof value) {
        case "string": return value.length >= LARGE_CHARACTER_SIZE;
        case "number":
        case "boolean": return false;
        case "object":
          i = -1;
          for (k in value) {
            if (__owns.call(value, k)) {
              ++i;
              v = value[k];
              if (i >= 1 || isLarge(k) || isLarge(v)) {
                return true;
              }
            }
          }
          return false;
        default: return true;
        }
      }
    }
    types = {
      "null": function (_p, sb) {
        sb("null");
      },
      "undefined": function (_p, sb) {
        sb("void 0");
      },
      number: function (value, sb) {
        sb(value === 0 ? (1 / value < 0 ? "-0" : "0")
          : isFinite(value) ? String(value)
          : value !== value ? "0/0"
          : value > 0 ? "1/0"
          : "-1/0");
      },
      regexp: function (regex, sb) {
        sb("/");
        sb(regex.source.replace(/(\\\\)*\\?\//g, "$1\\/") || "(?:)");
        sb("/");
        if (regex.global) {
          sb("g");
        }
        if (regex.ignoreCase) {
          sb("i");
        }
        if (regex.multiline) {
          sb("m");
        }
      },
      string: (function () {
        var DOUBLE_QUOTE_REGEX, SINGLE_QUOTE_REGEX;
        function escapeHelper(m) {
          switch (m) {
          case "\b": return "\\b";
          case "\t": return "\\t";
          case "\n":
            return "\\n";
          case "\f": return "\\f";
          case "\r": return "\\r";
          case "\n":
            return "\\n";
          case '"': return '\\"';
          case "'": return "\\'";
          case "\\": return "\\\\";
          default:
            return "\\u" + padLeft(m.charCodeAt(0).toString(16), 4, "0");
          }
        }
        DOUBLE_QUOTE_REGEX = /[\u0000-\u001f"\\\u0080-\uffff]/g;
        SINGLE_QUOTE_REGEX = /[\u0000-\u001f'\\\u0080-\uffff]/g;
        function doubleQuote(value) {
          return '"' + value.replace(DOUBLE_QUOTE_REGEX, escapeHelper) + '"';
        }
        function singleQuote(value) {
          return "'" + value.replace(SINGLE_QUOTE_REGEX, escapeHelper) + "'";
        }
        function shorter(x, y) {
          if (x.length <= y.length) {
            return x;
          } else {
            return y;
          }
        }
        return function (string, sb) {
          return sb(string.indexOf('"') === -1 ? doubleQuote(string)
            : string.indexOf("'") === -1 ? singleQuote(string)
            : shorter(doubleQuote(string), singleQuote(string)));
        };
      }()),
      boolean: function (bool, sb) {
        return sb(bool ? "true" : "false");
      },
      date: function (date, sb) {
        sb("new Date(");
        sb(String(date.getTime()));
        return sb(")");
      },
      array: function (array, sb, options) {
        var _arr, _len, childOptions, hasIndent, i, item, len;
        hasIndent = "indent" in options;
        if (array.length === 0) {
          return sb("[]");
        } else if (hasIndent && array.length > 1 && (array.length >= LARGE_CONTAINER_SIZE || (function () {
          var _arr, _i, _len, _some, item;
          _some = false;
          for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            item = _arr[_i];
            if (isLarge(item)) {
              _some = true;
              break;
            }
          }
          return _some;
        }()))) {
          sb("[\n");
          childOptions = moreIndent(options);
          for (_arr = __toArray(array), i = 0, len = _arr.length; i < len; ++i) {
            item = _arr[i];
            indent(sb, childOptions.indent);
            toJSSource(item, sb, childOptions);
            if (i < len - 1) {
              sb(",");
            }
            sb("\n");
          }
          indent(sb, options.indent);
          return sb("]");
        } else {
          sb("[");
          for (_arr = __toArray(array), i = 0, _len = _arr.length; i < _len; ++i) {
            item = _arr[i];
            if (i > 0) {
              sb(",");
              if (hasIndent) {
                sb(" ");
              }
            }
            toJSSource(item, sb, options);
          }
          return sb("]");
        }
      },
      object: (function () {
        function writeSafeKey(key, sb, options) {
          var num;
          if (isAcceptableIdent(key)) {
            sb(key);
          } else {
            num = Number(key);
            if (num === num && String(num) === key) {
              sb(key);
            } else {
              toJSSource(key, sb, options);
            }
          }
        }
        return function (obj, sb, options) {
          var _arr, _len, _ref, childOptions, hasIndent, i, key, len, pairs,
              value;
          _arr = [];
          for (key in obj) {
            if (__owns.call(obj, key)) {
              value = obj[key];
              _arr.push({ key: key, value: value });
            }
          }
          pairs = _arr;
          hasIndent = "indent" in options;
          if (pairs.length === 0) {
            return sb("{}");
          } else if (hasIndent && pairs.length > 1 && (pairs.length >= LARGE_CONTAINER_SIZE || (function () {
            var _i, _len, _ref, _some, key, value;
            _some = false;
            for (_i = 0, _len = pairs.length; _i < _len; ++_i) {
              _ref = pairs[_i];
              key = _ref.key;
              value = _ref.value;
              _ref = null;
              if (isLarge(key) || isLarge(value)) {
                _some = true;
                break;
              }
            }
            return _some;
          }()))) {
            sb("{\n");
            childOptions = moreIndent(options);
            for (i = 0, len = pairs.length; i < len; ++i) {
              _ref = pairs[i];
              key = _ref.key;
              value = _ref.value;
              _ref = null;
              indent(sb, childOptions.indent);
              writeSafeKey(key, sb, childOptions);
              sb(": ");
              toJSSource(value, sb, childOptions);
              if (i < len - 1) {
                sb(",");
              }
              sb("\n");
            }
            indent(sb, options.indent);
            return sb("}");
          } else {
            sb("{");
            for (i = 0, _len = pairs.length; i < _len; ++i) {
              _ref = pairs[i];
              key = _ref.key;
              value = _ref.value;
              _ref = null;
              if (i > 0) {
                sb(",");
                if (hasIndent) {
                  sb(" ");
                }
              }
              writeSafeKey(key, sb, options);
              sb(":");
              if (hasIndent) {
                sb(" ");
              }
              toJSSource(value, sb, options);
            }
            return sb("}");
          }
        };
      }())
    };
    return function (value, sb, options) {
      var _ref, arr, handler;
      if (sb == null) {
        sb = null;
      }
      if (options == null) {
        options = {};
      }
      if (sb == null) {
        arr = [];
        toJSSource(
          value,
          __bind(arr, "push"),
          options
        );
        return arr.join("");
      } else if (value === null) {
        types["null"](value, sb, options);
      } else if (__isArray(value)) {
        types.array(value, sb, options);
      } else if (value instanceof RegExp) {
        types.regexp(value, sb, options);
      } else if (value instanceof Date) {
        types.date(value, sb, options);
      } else {
        if (__owns.call(types, _ref = typeof value)) {
          handler = types[_ref];
        }
        if (typeof handler !== "function") {
          throw new Error("Cannot convert " + __typeof(value) + " to JS source");
        }
        handler(value, sb, options);
      }
    };
  }());
  exports.toJSSource = toJSSource;
  exports.isAcceptableIdent = isAcceptableIdent;
}.call(this));
