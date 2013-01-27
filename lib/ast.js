(function () {
  "use strict";
  var __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, Arguments, Arr, Binary, Block, BlockExpression, BlockStatement, Break, Call, Const, Continue, Debugger, DoWhile, Eval, Expression, For, ForIn, fromJSON, Func, getIndent, Ident, If, IfExpression, IfStatement, INDENT, inspect, isAcceptableIdent, Level, Node, Noop, Obj, Return, Root, Statement, Switch, This, Throw, toJSSource, TryCatch, TryFinally, Unary, While;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
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
      len = parent.length;
      i = -1;
      for (; ++i < __num(len); ) {
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
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
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
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
  inspect = require("util").inspect;
  Level = (function () {
    this.block = 1;
    this.insideParentheses = 2;
    this.sequence = 3;
    this.assignment = 4;
    this.inlineCondition = 5;
    this.logicalOr = 6;
    this.logicalAnd = 7;
    this.bitwiseOr = 8;
    this.bitwiseAnd = 9;
    this.bitwiseXor = 10;
    this.equality = 11;
    this.relational = 12;
    this.bitwiseShift = 13;
    this.addition = 14;
    this.multiplication = 15;
    this.unary = 16;
    this.increment = 17;
    this.callOrAccess = 18;
    this.newCall = 19;
    return this;
  }.call({}));
  INDENT = "  ";
  function incIndent(options) {
    var clone;
    clone = __create(options);
    clone.indent = __num(clone.indent) + 1;
    return clone;
  }
  getIndent = (function () {
    var cache;
    cache = [""];
    return function (indent) {
      var i, result;
      if (__num(indent) >= cache.length) {
        result = cache[cache.length - 1];
        for (i = cache.length, __num(indent); i <= indent; ++i) {
          result = __strnum(result) + INDENT;
          cache.push(result);
        }
      }
      return cache[indent];
    };
  }());
  function StringBuilder() {
    var data;
    data = [];
    function sb(item) {
      data.push(item);
    }
    sb.indent = function (count) {
      data.push(getIndent(count));
    };
    sb.toString = function () {
      var text;
      switch (data.length) {
      case 0:
        return "";
      case 1:
        return data[0];
      default:
        text = data.join("");
        data.splice(0, data.length, text);
        return text;
      }
    };
    return sb;
  }
  function isNegative(value) {
    return __num(value) < 0 || 1 / __num(value) < 0;
  }
  toJSSource = (function () {
    var toJSSourceTypes;
    toJSSourceTypes = {
      "undefined": function () {
        return "void 0";
      },
      number: function (value) {
        if (value === 0) {
          if (isNegative(value)) {
            return "-0";
          } else {
            return "0";
          }
        } else if (isFinite(value)) {
          return String(value);
        } else if (value !== value) {
          return "0/0";
        } else if (__num(value) > 0) {
          return "1/0";
        } else {
          return "-1/0";
        }
      },
      string: (function () {
        var DOUBLE_QUOTE_REGEX, SINGLE_QUOTE_REGEX;
        function escapeHelper(m) {
          var num;
          switch (m) {
          case "\b":
            return "\\b";
          case "\t":
            return "\\t";
          case "\n":
            return "\\n";
          case "\f":
            return "\\f";
          case "\r":
            return "\\r";
          case "\n":
            return "\\n";
          case '"':
            return '\\"';
          case "'":
            return "\\'";
          case "\\":
            return "\\\\";
          default:
            num = m.charCodeAt(0).toString(16);
            return (function () {
              switch (num.length) {
              case 1:
                return "\\u000" + __strnum(num);
              case 2:
                return "\\u00" + __strnum(num);
              case 3:
                return "\\u0" + __strnum(num);
              case 4:
                return "\\u" + __strnum(num);
              default:
                throw Error();
              }
            }());
          }
        }
        DOUBLE_QUOTE_REGEX = /[\u0000-\u001f"\\\u0080-\uffff]/g;
        SINGLE_QUOTE_REGEX = /[\u0000-\u001f'\\\u0080-\uffff]/g;
        return function (value) {
          if (value.indexOf('"') === -1 || value.indexOf("'") !== -1) {
            return '"' + __strnum(value.replace(DOUBLE_QUOTE_REGEX, escapeHelper)) + '"';
          } else {
            return "'" + __strnum(value.replace(SINGLE_QUOTE_REGEX, escapeHelper)) + "'";
          }
        };
      }()),
      boolean: function (value) {
        if (value) {
          return "true";
        } else {
          return "false";
        }
      },
      object: function (value) {
        var flags, source;
        if (value instanceof RegExp) {
          source = value.source.replace(/(\\\\)*\\?\//g, "$1\\/") || "(?:)";
          flags = [];
          if (value.global) {
            flags.push("g");
          }
          if (value.ignoreCase) {
            flags.push("i");
          }
          if (value.multiline) {
            flags.push("m");
          }
          return "/" + __strnum(source) + "/" + __strnum(flags.join(""));
        } else if (value === null) {
          return "null";
        } else {
          throw Error();
        }
      }
    };
    return function (value) {
      var _ref, f;
      f = __owns(toJSSourceTypes, _ref = typeof value) ? toJSSourceTypes[_ref] : void 0;
      if (!f) {
        throw TypeError("Cannot compile const " + __typeof(value));
      }
      return f(value);
    };
  }());
  isAcceptableIdent = exports.isAcceptableIdent = (function () {
    var IDENTIFIER_REGEX, RESERVED;
    IDENTIFIER_REGEX = /^[a-zA-Z_\$][a-zA-Z_\$0-9]*$/;
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
    return function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return IDENTIFIER_REGEX.test(name) && !__in(name, RESERVED);
    };
  }());
  exports.Node = Node = (function () {
    var _Node_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw Error("Node cannot be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    Node.displayName = "Node";
    _Node_prototype.toString = function () {
      var sb;
      sb = StringBuilder();
      this.compileAsStatement(
        { indent: 0, bare: true },
        true,
        sb
      );
      return sb.toString();
    };
    _Node_prototype.toFunction = function () {
      return new Function(this.toString());
    };
    _Node_prototype.compile = function () {
      throw Error("compile not implemented: " + __strnum(this.constructor.name));
    };
    _Node_prototype.maybeToStatement = function () {
      if (typeof this.toStatement === "function") {
        return this.toStatement();
      } else {
        return this;
      }
    };
    _Node_prototype.isConst = function () {
      return false;
    };
    _Node_prototype.isNoop = function () {
      return false;
    };
    _Node_prototype.constValue = function () {
      throw Error(__strnum(this.constructor.name) + " has no const value");
    };
    _Node_prototype.isLarge = function () {
      return true;
    };
    _Node_prototype.isSmall = function () {
      return !this.isLarge();
    };
    _Node_prototype.mutateLast = function () {
      return this;
    };
    _Node_prototype.exitType = function () {
      return null;
    };
    _Node_prototype.last = function () {
      return this;
    };
    return Node;
  }());
  exports.Expression = Expression = (function (Node) {
    var _Expression_prototype, _Node_prototype;
    function Expression() {
      var _this;
      _this = this instanceof Expression ? this : __create(_Expression_prototype);
      throw Error("Expression cannot be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    _Expression_prototype = Expression.prototype = __create(_Node_prototype);
    _Expression_prototype.constructor = Expression;
    Expression.displayName = "Expression";
    _Expression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      this.compile(options, level, lineStart, sb);
    };
    _Expression_prototype.compileAsStatement = function (options, lineStart, sb) {
      if (typeof this.toStatement === "function") {
        this.toStatement().compileAsStatement(options, lineStart, sb);
      } else {
        this.compile(options, Level.block, lineStart, sb);
        sb(";");
      }
    };
    _Expression_prototype.isLarge = function () {
      return false;
    };
    _Expression_prototype.mutateLast = function (func) {
      return func(this);
    };
    return Expression;
  }(Node));
  exports.Statement = Statement = (function (Node) {
    var _Node_prototype, _Statement_prototype;
    function Statement() {
      var _this;
      _this = this instanceof Statement ? this : __create(_Statement_prototype);
      throw Error("Expression cannot be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    _Statement_prototype = Statement.prototype = __create(_Node_prototype);
    _Statement_prototype.constructor = Statement;
    Statement.displayName = "Statement";
    _Statement_prototype.compileAsStatement = function (options, lineStart, sb) {
      return this.compile(options, Level.block, lineStart, sb);
    };
    return Statement;
  }(Node));
  exports.Access = function (parent) {
    var _i, _len, child, children, current;
    children = __slice(arguments, 1);
    current = parent;
    for (_i = 0, _len = children.length; _i < _len; ++_i) {
      child = children[_i];
      current = Binary(current, ".", child);
    }
    return current;
  };
  exports.Arguments = Arguments = (function (Expression) {
    var _Arguments_prototype, _Expression_prototype;
    function Arguments() {
      var _this;
      _this = this instanceof Arguments ? this : __create(_Arguments_prototype);
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Arguments_prototype = Arguments.prototype = __create(_Expression_prototype);
    _Arguments_prototype.constructor = Arguments;
    Arguments.displayName = "Arguments";
    _Arguments_prototype.compile = function (options, level, lineStart, sb) {
      sb("arguments");
    };
    _Arguments_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop().compileAsBlock(options, level, lineStart, sb);
    };
    _Arguments_prototype.walk = function () {
      return this;
    };
    _Arguments_prototype.isNoop = function () {
      return true;
    };
    _Arguments_prototype.inspect = function (depth) {
      return "Arguments()";
    };
    _Arguments_prototype.toJSON = function () {
      return { type: "Arguments" };
    };
    Arguments.fromJSON = function () {
      return Arguments();
    };
    return Arguments;
  }(Expression));
  function walkArray(array, walker) {
    var changed, result;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be an Array, got " + __typeof(array));
    }
    if (typeof walker !== "function") {
      throw TypeError("Expected walker to be a Function, got " + __typeof(walker));
    }
    changed = false;
    result = (function () {
      var _arr, _i, _len, item, newItem;
      for (_arr = [], _i = 0, _len = array.length; _i < _len; ++_i) {
        item = array[_i];
        newItem = walker(item);
        if (newItem == null) {
          newItem = item.walk(walker);
        }
        if (item !== newItem) {
          changed = true;
        }
        _arr.push(newItem);
      }
      return _arr;
    }());
    if (changed) {
      return result;
    } else {
      return array;
    }
  }
  function inspectArrayHelper(sb, array, depth) {
    var _arr, _len, i, item;
    if (array.length === 0) {
      return sb("[]");
    } else if (depth == null || __num(depth) > 0) {
      sb("[ ");
      for (_arr = __toArray(array), i = 0, _len = _arr.length; i < _len; ++i) {
        item = _arr[i];
        if (__num(i) > 0) {
          sb(", ");
        }
        sb(inspect(item, null, depth != null ? __num(depth) - 1 : null));
      }
      return sb(" ]");
    } else {
      sb("length: ");
      return sb(item.length);
    }
  }
  function decDepth(depth) {
    if (depth != null) {
      return __num(depth) - 1;
    } else {
      return null;
    }
  }
  function simplify(obj) {
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return;
      } else {
        return obj;
      }
    } else if (obj instanceof Noop) {
      return;
    } else {
      return obj;
    }
  }
  exports.Arr = Arr = (function (Expression) {
    var _Arr_prototype, _Expression_prototype;
    function Arr(elements) {
      var _i, _len, _this;
      if (elements == null) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Expression)) {
            throw TypeError("Expected elements[" + _i + "] to be an Expression, got " + __typeof(elements[_i]));
          }
        }
      }
      _this = this instanceof Arr ? this : __create(_Arr_prototype);
      _this.elements = elements;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Arr_prototype = Arr.prototype = __create(_Expression_prototype);
    _Arr_prototype.constructor = Arr;
    Arr.displayName = "Arr";
    function compileLarge(elements, options, level, lineStart, sb) {
      var _arr, childOptions, i, item, len;
      childOptions = incIndent(options);
      for (_arr = __toArray(elements), i = 0, len = _arr.length; i < len; ++i) {
        item = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, Level.sequence, false, sb);
        if (__num(i) < __num(len) - 1) {
          sb(",");
        }
      }
      sb("\n");
      sb.indent(options.indent);
    }
    function compileSmall(elements, options, level, lineStart, sb) {
      var _arr, _len, i, item;
      if (elements.length) {
        for (_arr = __toArray(elements), i = 0, _len = _arr.length; i < _len; ++i) {
          item = _arr[i];
          if (__num(i) > 0) {
            sb(", ");
          }
          item.compile(options, Level.sequence, false, sb);
        }
      }
    }
    _Arr_prototype.compile = function (options, level, lineStart, sb) {
      var f;
      sb("[");
      f = this.shouldCompileLarge() ? compileLarge : compileSmall;
      f(
        this.elements,
        options,
        level,
        lineStart,
        sb
      );
      sb("]");
    };
    _Arr_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      return BlockExpression(this.elements).compileAsBlock(options, level, lineStart, sb);
    };
    _Arr_prototype.compileAsStatement = function (options, lineStart, sb) {
      BlockStatement(this.elements).compile(options, lineStart, sb);
    };
    _Arr_prototype.shouldCompileLarge = function () {
      switch (this.elements.length) {
      case 0:
        return false;
      case 1:
        return this.elements[0].isLarge();
      default:
        return this.isLarge();
      }
    };
    _Arr_prototype.isSmall = function () {
      switch (this.elements.length) {
      case 0:
        return true;
      case 1:
        return this.elements[0].isSmall();
      default:
        return false;
      }
    };
    _Arr_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(_this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isSmall()) {
              return true;
            }
          }
          return false;
        }());
      } else {
        return _ref;
      }
    };
    _Arr_prototype.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(_this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isNoop()) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _Arr_prototype.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (this.elements !== elements) {
        return Arr(elements);
      } else {
        return this;
      }
    };
    _Arr_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Arr(" + __strnum(inspect(this.elements, null, d)) + ")";
    };
    _Arr_prototype.toJSON = function () {
      return { type: "Arr", elements: simplify(this.elements) };
    };
    Arr.fromJSON = function (_p) {
      var elements;
      elements = _p.elements;
      return Arr(arrayFromJSON(elements));
    };
    return Arr;
  }(Expression));
  exports.Assign = function (left, right) {
    return Binary(left, "=", right);
  };
  exports.BinaryChain = function (op) {
    var _arr, _i, _len, arg, args, current, i, left, right;
    args = __slice(arguments, 1);
    if (op === "+") {
      for (i = args.length - 2; i >= 0; --i) {
        left = args[i];
        right = args[__num(i) + 1];
        if ((typeof left === "string" || left instanceof Const && typeof left.value === "string") && (typeof right === "string" || right instanceof Const && typeof right.value === "string")) {
          args.splice(i, 2, __strnum(typeof left === "string" ? left : left.value) + __strnum(typeof right === "string" ? right : right.value));
        }
      }
    }
    current = args[0];
    for (_arr = __slice(args, 1, void 0), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      arg = _arr[_i];
      current = Binary(current, op, arg);
    }
    return current;
  };
  exports.And = function () {
    var _end, args, current, i;
    args = __slice(arguments);
    if (args.length === 0) {
      return Const(true);
    } else {
      current = args[0];
      for (i = 1, _end = args.length; i < _end; ++i) {
        current = Binary(current, "&&", args[i]);
      }
      return current;
    }
  };
  exports.Or = function () {
    var _end, args, current, i;
    args = __slice(arguments);
    if (args.length === 0) {
      return Const(false);
    } else {
      current = args[0];
      for (i = 1, _end = args.length; i < _end; ++i) {
        current = Binary(current, "||", args[i]);
      }
      return current;
    }
  };
  exports.Binary = Binary = (function (Expression) {
    var _Binary_prototype, _Expression_prototype, _o, ASSIGNMENT_OPS, LEVEL_TO_ASSOCIATIVITY, OPERATOR_PRECEDENCE;
    function Binary(left, op, right) {
      var _this;
      if (left == null) {
        left = Noop();
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == null) {
        right = Noop();
      }
      _this = this instanceof Binary ? this : __create(_Binary_prototype);
      if (!__owns(OPERATOR_PRECEDENCE, op)) {
        throw Error("Unknown binary operator: " + toJSSource(op));
      }
      if (!(left instanceof Expression)) {
        left = toConst(left);
      }
      if (!(right instanceof Expression)) {
        right = toConst(right);
      }
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Binary_prototype = Binary.prototype = __create(_Expression_prototype);
    _Binary_prototype.constructor = Binary;
    Binary.displayName = "Binary";
    function compileAccess(op, left, right, options, level, lineStart, sb) {
      var dotAccess, stringLeft, wrap;
      dotAccess = right instanceof Const && typeof right.value === "string" && isAcceptableIdent(right.value);
      wrap = !__lte(level, Level.callOrAccess);
      if (wrap) {
        sb("(");
      }
      if (left instanceof Const && typeof left.value === "number") {
        stringLeft = toJSSource(left.value);
        if (isNegative(left.value) || !isFinite(left.value)) {
          sb("(");
          sb(stringLeft);
          sb(")");
        } else {
          sb(stringLeft);
          if (dotAccess && stringLeft.indexOf("e") === -1 && stringLeft.indexOf(".") === -1) {
            sb(".");
          }
        }
      } else if (left.isConst() && left.constValue() === void 0) {
        sb("(");
        sb(toJSSource(void 0));
        sb(")");
      } else {
        left.compile(options, Level.callOrAccess, lineStart, sb);
      }
      if (dotAccess) {
        sb(".");
        sb(right.value);
      } else {
        sb("[");
        right.compile(options, Level.insideParentheses, false, sb);
        sb("]");
      }
      if (wrap) {
        sb(")");
      }
    }
    function compileOther(op, left, right, options, level, lineStart, sb) {
      var associativity, opLevel, wrap;
      opLevel = OPERATOR_PRECEDENCE[op];
      associativity = LEVEL_TO_ASSOCIATIVITY[opLevel];
      wrap = associativity === "paren" ? !__lt(level, opLevel) : !__lte(level, opLevel);
      if (wrap) {
        sb("(");
      }
      left.compile(
        options,
        associativity === "right" && left instanceof Binary && OPERATOR_PRECEDENCE[left.op] === opLevel ? __num(opLevel) + 1 : opLevel,
        lineStart && !wrap,
        sb
      );
      sb(" ");
      sb(op);
      sb(" ");
      right.compile(
        options,
        associativity === "left" && right instanceof Binary && OPERATOR_PRECEDENCE[right.op] === opLevel ? __num(opLevel) + 1 : opLevel,
        false,
        sb
      );
      if (wrap) {
        sb(")");
      }
    }
    _Binary_prototype.compile = function (options, level, lineStart, sb) {
      var f;
      f = this.op === "." ? compileAccess : compileOther;
      f(
        this.op,
        this.left,
        this.right,
        options,
        level,
        lineStart,
        sb
      );
    };
    _Binary_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      if (__owns(ASSIGNMENT_OPS, this.op)) {
        _Expression_prototype.compileAsBlock.call(
          this,
          options,
          level,
          lineStart,
          sb
        );
      } else {
        BlockExpression([this.left, this.right]).compileAsBlock(options, level, lineStart, sb);
      }
    };
    _Binary_prototype.compileAsStatement = function (options, lineStart, sb) {
      var left, op;
      left = this.left;
      op = this.op;
      if (__owns(ASSIGNMENT_OPS, op)) {
        if (left instanceof Ident && typeof this.right.toStatement === "function" && false) {
          this.right.toStatement().mutateLast(
            function (node) {
              return Binary(left, op, node);
            },
            true
          ).compileAsStatement(options, lineStart, sb);
        } else {
          _Expression_prototype.compileAsStatement.call(this, options, lineStart, sb);
        }
      } else {
        BlockStatement([this.left, this.right]).compileAsStatement(options, lineStart, sb);
      }
    };
    ASSIGNMENT_OPS = {
      "=": true,
      "+=": true,
      "-=": true,
      "*=": true,
      "/=": true,
      "%=": true,
      "<<=": true,
      ">>=": true,
      ">>>=": true,
      "&=": true,
      "^=": true,
      "|=": true
    };
    OPERATOR_PRECEDENCE = {
      ".": Level.callOrAccess,
      "*": Level.multiplication,
      "/": Level.multiplication,
      "%": Level.multiplication,
      "+": Level.addition,
      "-": Level.addition,
      "<<": Level.bitwiseShift,
      ">>": Level.bitwiseShift,
      ">>>": Level.bitwiseShift,
      "<": Level.relational,
      "<=": Level.relational,
      ">": Level.relational,
      ">=": Level.relational,
      "in": Level.relational,
      "instanceof": Level.relational,
      "==": Level.equality,
      "!=": Level.equality,
      "===": Level.equality,
      "!==": Level.equality,
      "&": Level.bitwiseAnd,
      "^": Level.bitwiseXor,
      "|": Level.bitwiseOr,
      "&&": Level.logicalAnd,
      "||": Level.logicalOr,
      "=": Level.assignment,
      "+=": Level.assignment,
      "-=": Level.assignment,
      "*=": Level.assignment,
      "/=": Level.assignment,
      "%=": Level.assignment,
      "<<=": Level.assignment,
      ">>=": Level.assignment,
      ">>>=": Level.assignment,
      "&=": Level.assignment,
      "^=": Level.assignment,
      "|=": Level.assignment
    };
    LEVEL_TO_ASSOCIATIVITY = (_o = {}, _o[Level.equality] = "paren", _o[Level.relational] = "paren", _o[Level.addition] = "left", _o[Level.multiplication] = "left", _o[Level.bitwiseAnd] = "none", _o[Level.bitwiseOr] = "none", _o[Level.bitwiseXor] = "none", _o[Level.bitwiseShift] = "left", _o[Level.assignment] = "right", _o);
    _Binary_prototype.isLarge = function () {
      var _ref;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = !this.left.isSmall() || !this.right.isSmall();
      } else {
        return _ref;
      }
    };
    _Binary_prototype.isSmall = function () {
      var _ref;
      if ((_ref = this._isSmall) == null) {
        return this._isSmall = this.left.isSmall() && this.right.isSmall();
      } else {
        return _ref;
      }
    };
    _Binary_prototype.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = !__owns(ASSIGNMENT_OPS, this.op) && this.left.isNoop() && this.right.isNoop();
      } else {
        return _ref;
      }
    };
    _Binary_prototype.walk = function (walker) {
      var _ref, changed, left, right;
      changed = false;
      left = (_ref = walker(this.left)) != null ? _ref : this.left.walk(walker);
      right = (_ref = walker(this.right)) != null ? _ref : this.right.walk(walker);
      if (this.left !== left || this.right !== right) {
        return Binary(left, this.op, right);
      } else {
        return this;
      }
    };
    _Binary_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Binary(" + __strnum(inspect(this.left, null, d)) + ", " + __strnum(inspect(this.op)) + ", " + __strnum(inspect(this.right, null, d)) + ")";
    };
    _Binary_prototype.toJSON = function () {
      return { type: "Binary", left: simplify(this.left), op: this.op, right: simplify(this.right) };
    };
    Binary.fromJSON = function (_p) {
      var left, op, right;
      left = _p.left;
      op = _p.op;
      right = _p.right;
      return Binary(fromJSON(left), op, fromJSON(right));
    };
    return Binary;
  }(Expression));
  exports.BlockStatement = BlockStatement = (function (Statement) {
    var _BlockStatement_prototype, _Statement_prototype;
    function BlockStatement(body) {
      var _i, _len, _this, item, result, statement;
      if (body == null) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i = 0, _len = body.length; _i < _len; ++_i) {
          if (!(body[_i] instanceof Node)) {
            throw TypeError("Expected body[" + _i + "] to be a Node, got " + __typeof(body[_i]));
          }
        }
      }
      _this = this instanceof BlockStatement ? this : __create(_BlockStatement_prototype);
      result = [];
      for (_i = 0, _len = body.length; _i < _len; ++_i) {
        item = body[_i];
        statement = item.maybeToStatement();
        if (statement instanceof BlockStatement) {
          result.push.apply(result, __toArray(statement.body));
        } else if (!(statement instanceof Noop)) {
          result.push(statement);
        }
        if (statement.exitType() != null) {
          break;
        }
      }
      switch (result.length) {
      case 0:
        return Noop();
      case 1:
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _BlockStatement_prototype = BlockStatement.prototype = __create(_Statement_prototype);
    _BlockStatement_prototype.constructor = BlockStatement;
    BlockStatement.displayName = "BlockStatement";
    _BlockStatement_prototype.compile = function (options, level, lineStart, sb) {
      var _len, _this, i, item, nodes;
      _this = this;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      nodes = (function () {
        var _arr, _arr2, _i, _len, node;
        for (_arr = [], _arr2 = __toArray(_this.body), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          node = _arr2[_i];
          if (!node.isNoop()) {
            _arr.push(node);
          }
        }
        return _arr;
      }());
      for (i = 0, _len = nodes.length; i < _len; ++i) {
        item = nodes[i];
        if (__num(i) > 0) {
          sb("\n");
          sb.indent(options.indent);
        }
        item.compileAsStatement(options, true, sb);
      }
    };
    _BlockStatement_prototype.walk = function (walker) {
      var body;
      body = walkArray(this.body, walker);
      if (this.body !== body) {
        return Block(body);
      } else {
        return this;
      }
    };
    _BlockStatement_prototype.mutateLast = function (func, includeNoop) {
      var body, last, newLast;
      last = this.last();
      newLast = last.mutateLast(func, includeNoop);
      if (last !== newLast) {
        body = __slice(this.body, void 0, -1);
        body.push(newLast);
        return Block(body);
      } else {
        return this;
      }
    };
    _BlockStatement_prototype.exitType = function () {
      return this.last().exitType();
    };
    _BlockStatement_prototype.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _BlockStatement_prototype.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, node;
          for (_arr = __toArray(_this.body), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            node = _arr[_i];
            if (!node.isNoop()) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _BlockStatement_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "BlockStatement(" + __strnum(inspect(this.body, null, d)) + ")";
    };
    _BlockStatement_prototype.toJSON = function () {
      return { type: "BlockStatement", body: this.body };
    };
    BlockStatement.fromJSON = function (_p) {
      var body;
      body = _p.body;
      return BlockStatement(arrayFromJSON(body));
    };
    return BlockStatement;
  }(Statement));
  exports.BlockExpression = BlockExpression = (function (Expression) {
    var _BlockExpression_prototype, _Expression_prototype;
    function BlockExpression(body) {
      var _i, _len, _this, i, item, len, result;
      if (body == null) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i = 0, _len = body.length; _i < _len; ++_i) {
          if (!(body[_i] instanceof Expression)) {
            throw TypeError("Expected body[" + _i + "] to be an Expression, got " + __typeof(body[_i]));
          }
        }
      }
      _this = this instanceof BlockExpression ? this : __create(_BlockExpression_prototype);
      result = [];
      for (i = 0, len = body.length; i < len; ++i) {
        item = body[i];
        if (i === __num(len) - 1 || !(!item instanceof Noop)) {
          if (item instanceof BlockExpression) {
            result.push.apply(result, __toArray(item.body));
            if (__num(i) < __num(len) - 1 && result[result.length - 1] instanceof Noop) {
              result.pop();
            }
          } else if (!(item instanceof Noop)) {
            result.push(item);
          }
        }
      }
      switch (result.length) {
      case 0:
        return Noop();
      case 1:
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _BlockExpression_prototype = BlockExpression.prototype = __create(_Expression_prototype);
    _BlockExpression_prototype.constructor = BlockExpression;
    BlockExpression.displayName = "BlockExpression";
    _BlockExpression_prototype.toStatement = function () {
      return BlockStatement(this.body);
    };
    _BlockExpression_prototype.compile = function (options, level, lineStart, sb) {
      var _len, _this, i, item, nodes, wrap;
      _this = this;
      if (level === Level.block) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        nodes = (function () {
          var _arr, _arr2, i, len, node;
          for (_arr = [], _arr2 = __toArray(_this.body), i = 0, len = _arr2.length; i < len; ++i) {
            node = _arr2[i];
            if (!node.isNoop() || i === __num(len) - 1) {
              _arr.push(node);
            }
          }
          return _arr;
        }());
        wrap = !__lte(level, Level.insideParentheses) && nodes.length > 1;
        if (wrap) {
          sb("(");
        }
        for (i = 0, _len = nodes.length; i < _len; ++i) {
          item = nodes[i];
          if (i > 0) {
            sb(", ");
          }
          item.compile(options, Level.sequence, false, sb);
        }
        if (wrap) {
          sb(")");
        }
      }
    };
    _BlockExpression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var _this;
      _this = this;
      return BlockExpression((function () {
        var _arr, _arr2, _i, _len, item;
        for (_arr = [], _arr2 = __toArray(_this.body), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          if (!item.isNoop()) {
            _arr.push(item);
          }
        }
        return _arr;
      }())).compile(options, level, lineStart, sb);
    };
    _BlockExpression_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.body.length) > 4 || (function () {
          var _arr, _i, _len, part;
          for (_arr = __toArray(_this.body), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            part = _arr[_i];
            if (part.isLarge()) {
              return true;
            }
          }
          return false;
        }());
      } else {
        return _ref;
      }
    };
    _BlockExpression_prototype.isSmall = function () {
      return false;
    };
    _BlockExpression_prototype.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, node;
          for (_arr = __toArray(_this.body), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            node = _arr[_i];
            if (!node.isNoop()) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _BlockExpression_prototype.walk = BlockStatement.prototype.walk;
    _BlockExpression_prototype.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _BlockExpression_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "BlockExpression(" + __strnum(inspect(this.body, null, d)) + ")";
    };
    _BlockExpression_prototype.toJSON = function () {
      return { type: "BlockExpression", body: this.body };
    };
    BlockExpression.fromJSON = function (_p) {
      var body;
      body = _p.body;
      return BlockExpression(arrayFromJSON(body));
    };
    return BlockExpression;
  }(Expression));
  Block = exports.Block = function (body) {
    var _i, _len;
    if (body == null) {
      body = [];
    } else if (!__isArray(body)) {
      throw TypeError("Expected body to be an Array, got " + __typeof(body));
    } else {
      for (_i = 0, _len = body.length; _i < _len; ++_i) {
        if (!(body[_i] instanceof Node)) {
          throw TypeError("Expected body[" + _i + "] to be a Node, got " + __typeof(body[_i]));
        }
      }
    }
    if (body.length === 0) {
      return Noop();
    } else if ((function () {
      var _i, _len, item;
      for (_i = 0, _len = body.length; _i < _len; ++_i) {
        item = body[_i];
        if (!(item instanceof Expression)) {
          return false;
        }
      }
      return true;
    }())) {
      return BlockExpression(body);
    } else {
      return BlockStatement(body);
    }
  };
  exports.Break = Break = (function (Statement) {
    var _Break_prototype, _Statement_prototype;
    function Break() {
      var _this;
      _this = this instanceof Break ? this : __create(_Break_prototype);
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Break_prototype = Break.prototype = __create(_Statement_prototype);
    _Break_prototype.constructor = Break;
    Break.displayName = "Break";
    _Break_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("break;");
    };
    _Break_prototype.walk = function () {
      return this;
    };
    _Break_prototype.exitType = function () {
      return "break";
    };
    _Break_prototype.inspect = function () {
      return "Break()";
    };
    _Break_prototype.toJSON = function () {
      return { type: "Break" };
    };
    Break.fromJSON = function () {
      return Break();
    };
    return Break;
  }(Statement));
  exports.Call = Call = (function (Expression) {
    var _Call_prototype, _Expression_prototype;
    function Call(func, args, isNew) {
      var _i, _len, _this;
      if (func == null) {
        func = Noop();
      } else if (!(func instanceof Expression)) {
        throw TypeError("Expected func to be an Expression, got " + __typeof(func));
      }
      if (args == null) {
        args = [];
      } else if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = 0, _len = args.length; _i < _len; ++_i) {
          if (!(args[_i] instanceof Expression)) {
            throw TypeError("Expected args[" + _i + "] to be an Expression, got " + __typeof(args[_i]));
          }
        }
      }
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      _this = this instanceof Call ? this : __create(_Call_prototype);
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Call_prototype = Call.prototype = __create(_Expression_prototype);
    _Call_prototype.constructor = Call;
    Call.displayName = "Call";
    function compileLarge(args, options, level, lineStart, sb) {
      var _arr, childOptions, i, item, len;
      sb("(");
      childOptions = incIndent(options);
      for (_arr = __toArray(args), i = 0, len = _arr.length; i < len; ++i) {
        item = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, Level.sequence, false, sb);
        if (__num(i) < __num(len) - 1) {
          sb(",");
        }
      }
      sb("\n");
      sb.indent(options.indent);
      sb(")");
    }
    function compileSmall(args, options, level, lineStart, sb) {
      var _arr, _len, arg, i;
      sb("(");
      for (_arr = __toArray(args), i = 0, _len = _arr.length; i < _len; ++i) {
        arg = _arr[i];
        if (__num(i) > 0) {
          sb(", ");
        }
        arg.compile(options, Level.sequence, false, sb);
      }
      sb(")");
    }
    _Call_prototype.compile = function (options, level, lineStart, sb) {
      var f, wrap;
      wrap = !__lte(level, Level.callOrAccess) || !this.isNew && (this.func instanceof Func || this.func instanceof Binary && this.func.op === "." && this.func.left instanceof Func);
      if (wrap) {
        sb("(");
      }
      if (this.isNew) {
        sb("new ");
      }
      this.func.compile(
        options,
        this.isNew ? Level.newCall : Level.callOrAccess,
        lineStart && !wrap && !this.isNew,
        sb
      );
      f = this.shouldCompileLarge() ? compileLarge : compileSmall;
      f(
        this.args,
        options,
        level,
        lineStart,
        sb
      );
      if (wrap) {
        sb(")");
      }
    };
    _Call_prototype.shouldCompileLarge = function () {
      var _this;
      _this = this;
      if (__num(this.args.length) > 4) {
        return true;
      } else {
        return (function () {
          var _arr, _i, _len, arg;
          for (_arr = __slice(_this.args, void 0, -1), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            arg = _arr[_i];
            if (!arg.isSmall()) {
              return true;
            }
          }
          return false;
        }());
      }
    };
    _Call_prototype.hasLargeArgs = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._hasLargeArgs) == null) {
        return this._hasLargeArgs = __num(this.args.length) > 4 ? true
          : (function () {
            var _arr, _i, _len, arg;
            for (_arr = __toArray(_this.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              arg = _arr[_i];
              if (!arg.isSmall()) {
                return true;
              }
            }
            return false;
          }());
      } else {
        return _ref;
      }
    };
    _Call_prototype.isLarge = function () {
      return this.func.isLarge() || this.hasLargeArgs();
    };
    _Call_prototype.isSmall = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isSmall) == null) {
        return this._isSmall = !this.func.isSmall() ? false
          : (function () {
            switch (_this.args.length) {
            case 0:
              return true;
            case 1:
              return _this.args[0].isSmall();
            default:
              return false;
            }
          }());
      } else {
        return _ref;
      }
    };
    _Call_prototype.walk = function (walker) {
      var _ref, args, func;
      func = (_ref = walker(this.func)) != null ? _ref : this.func.walk(walker);
      args = walkArray(this.args, walker);
      if (this.func !== func || this.args !== args) {
        return Call(func, args, this.isNew);
      } else {
        return this;
      }
    };
    _Call_prototype.inspect = function (depth) {
      var d, sb;
      d = decDepth(depth);
      sb = StringBuilder();
      sb("Call(");
      sb(inspect(this.func, null, d));
      if (this.args.length || this.isNew) {
        sb(", ");
        sb(inspect(this.args, null, d));
      }
      if (this.isNew) {
        sb(", true");
      }
      sb(")");
      return sb.toString();
    };
    _Call_prototype.toJSON = function () {
      return { type: "Call", func: simplify(this.func), args: simplify(this.args), isNew: this.isNew || void 0 };
    };
    Call.fromJSON = function (_p) {
      var args, func, isNew;
      func = _p.func;
      args = _p.args;
      isNew = _p.isNew;
      return Call(fromJSON(func), arrayFromJSON(args), isNew);
    };
    return Call;
  }(Expression));
  function toConst(value) {
    if (value instanceof Node) {
      throw Error("Cannot convert " + __typeof(value) + " to a Const");
    } else if (__isArray(value)) {
      return Arr((function () {
        var _arr, _arr2, _i, _len, item;
        for (_arr = [], _arr2 = __toArray(value), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          _arr.push(toConst(item));
        }
        return _arr;
      }()));
    } else if (value && typeof value === "object" && !(value instanceof RegExp)) {
      return Obj((function () {
        var _arr, k, v;
        _arr = [];
        for (k in value) {
          if (__owns(value, k)) {
            v = value[k];
            _arr.push(Obj.Pair(k, toConst(v)));
          }
        }
        return _arr;
      }()));
    } else {
      return Const(value);
    }
  }
  exports.Const = Const = (function (Expression) {
    var _Const_prototype, _Expression_prototype;
    function Const(value) {
      var _this;
      if (value != void 0 && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string" && !(value instanceof RegExp)) {
        throw TypeError("Expected value to be an undefined or null or Boolean or Number or String or RegExp, got " + __typeof(value));
      }
      _this = this instanceof Const ? this : __create(_Const_prototype);
      _this.value = value;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Const_prototype = Const.prototype = __create(_Expression_prototype);
    _Const_prototype.constructor = Const;
    Const.displayName = "Const";
    _Const_prototype.compile = function (options, level, lineStart, sb) {
      var value, wrap;
      value = this.value;
      wrap = !__lt(level, Level.increment) && (value === void 0 || typeof value === "number" && !isFinite(value));
      if (wrap) {
        sb("(");
      }
      sb(toJSSource(value));
      if (wrap) {
        sb(")");
      }
    };
    _Const_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop().compileAsBlock(options, level, lineStart, sb);
    };
    _Const_prototype.isConst = function () {
      return true;
    };
    _Const_prototype.isNoop = Const.prototype.isConst;
    _Const_prototype.constValue = function () {
      return this.value;
    };
    _Const_prototype.walk = function () {
      return this;
    };
    _Const_prototype.inspect = function () {
      return "Const(" + __strnum(inspect(this.value)) + ")";
    };
    _Const_prototype.toJSON = function () {
      var flags;
      if (this.value instanceof RegExp) {
        flags = [];
        if (this.value.global) {
          flags.push("g");
        }
        if (this.value.ignoreCase) {
          flags.push("i");
        }
        if (this.value.multiline) {
          flags.push("m");
        }
        return { type: "Const", regexp: true, source: this.value.source, flags: flags };
      } else if (this.value === 1/0) {
        return { type: "Const", infinite: true, value: 1 };
      } else if (this.value === -1/0) {
        return { type: "Const", infinite: true, value: -1 };
      } else if (this.value !== this.value) {
        return { type: "Const", infinite: true, value: 0 };
      } else {
        return { type: "Const", value: this.value };
      }
    };
    Const.fromJSON = function (obj) {
      if (obj.regexp) {
        return Const(RegExp(obj.source, obj.flags));
      } else if (obj.infinite) {
        return Const(__num(obj.value) / 0);
      } else {
        return Const(obj.value);
      }
    };
    return Const;
  }(Expression));
  exports.Continue = Continue = (function (Statement) {
    var _Continue_prototype, _Statement_prototype;
    function Continue() {
      var _this;
      _this = this instanceof Continue ? this : __create(_Continue_prototype);
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Continue_prototype = Continue.prototype = __create(_Statement_prototype);
    _Continue_prototype.constructor = Continue;
    Continue.displayName = "Continue";
    _Continue_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      return sb("continue;");
    };
    _Continue_prototype.walk = function () {
      return this;
    };
    _Continue_prototype.exitType = function () {
      return "continue";
    };
    _Continue_prototype.inspect = function () {
      return "Continue()";
    };
    _Continue_prototype.toJSON = function () {
      return { type: "Continue" };
    };
    Continue.fromJSON = function () {
      return Continue();
    };
    return Continue;
  }(Statement));
  exports.Debugger = Debugger = (function (Statement) {
    var _Debugger_prototype, _Statement_prototype;
    function Debugger() {
      var _this;
      _this = this instanceof Debugger ? this : __create(_Debugger_prototype);
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Debugger_prototype = Debugger.prototype = __create(_Statement_prototype);
    _Debugger_prototype.constructor = Debugger;
    Debugger.displayName = "Debugger";
    _Debugger_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      return sb("debugger;");
    };
    _Debugger_prototype.walk = function () {
      return this;
    };
    _Debugger_prototype.inspect = function () {
      return "Debugger()";
    };
    _Debugger_prototype.toJSON = function () {
      return { type: "Debugger" };
    };
    Debugger.fromJSON = function () {
      return Debugger();
    };
    return Debugger;
  }(Statement));
  exports.DoWhile = DoWhile = (function (Statement) {
    var _DoWhile_prototype, _Statement_prototype;
    function DoWhile(body, test) {
      var _this;
      if (body == null) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (test == null) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be an Expression, got " + __typeof(test));
      }
      _this = this instanceof DoWhile ? this : __create(_DoWhile_prototype);
      _this.body = body.maybeToStatement();
      _this.test = test;
      if (test.isConst() && !test.constValue()) {
        return _this.body;
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _DoWhile_prototype = DoWhile.prototype = __create(_Statement_prototype);
    _DoWhile_prototype.constructor = DoWhile;
    DoWhile.displayName = "DoWhile";
    _DoWhile_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("do");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        sb(" {\n");
        sb.indent(__num(options.indent) + 1);
        this.body.compileAsStatement(incIndent(options), true, sb);
        sb("\n");
        sb.indent(options.indent);
        sb("}");
      }
      sb(" while (");
      this.test.compile(options, Level.insideParentheses, false, sb);
      sb(");");
    };
    _DoWhile_prototype.walk = function (walker) {
      var _ref, body, test;
      body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
      test = (_ref = walker(this.test)) != null ? _ref : this.test.walk(walker);
      if (body !== this.body || test !== this.test) {
        return DoWhile(body, test);
      } else {
        return this;
      }
    };
    _DoWhile_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "DoWhile(" + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.test, null, d)) + ")";
    };
    _DoWhile_prototype.toJSON = function () {
      return { type: "DoWhile", body: simplify(this.body), test: simplify(this.test) };
    };
    DoWhile.fromJSON = function (_p) {
      var body, test;
      body = _p.body;
      test = _p.test;
      return DoWhile(fromJSON(body), fromJSON(test));
    };
    return DoWhile;
  }(Statement));
  exports.Eval = Eval = (function (Expression) {
    var _Eval_prototype, _Expression_prototype;
    function Eval(code) {
      var _this;
      if (code == null) {
        code = Noop();
      }
      _this = this instanceof Eval ? this : __create(_Eval_prototype);
      if (!(code instanceof Expression)) {
        code = toConst(code);
      }
      _this.code = code;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Eval_prototype = Eval.prototype = __create(_Expression_prototype);
    _Eval_prototype.constructor = Eval;
    Eval.displayName = "Eval";
    _Eval_prototype.compile = function (options, level, lineStart, sb) {
      if (this.code instanceof Const) {
        sb(String(this.code.value));
      } else {
        sb("eval(");
        this.code.compile(options, Level.sequence, false, sb);
        sb(")");
      }
    };
    _Eval_prototype.walk = function (walker) {
      var _ref, code;
      code = (_ref = walker(this.code)) != null ? _ref : this.code.walk(walker);
      if (code !== this.code) {
        return Eval(code);
      } else {
        return this;
      }
    };
    _Eval_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Eval(" + __strnum(inspect(this.code, null, d)) + ")";
    };
    _Eval_prototype.toJSON = function () {
      return { type: "Eval", code: simplify(this.code) };
    };
    Eval.fromJSON = function (_p) {
      var code;
      code = _p.code;
      return Eval(fromJSON(code));
    };
    return Eval;
  }(Expression));
  exports.For = For = (function (Statement) {
    var _For_prototype, _Statement_prototype;
    function For(init, test, step, body) {
      var _this;
      if (init == null) {
        init = Noop();
      } else if (!(init instanceof Expression)) {
        throw TypeError("Expected init to be an Expression, got " + __typeof(init));
      }
      if (test == null) {
        test = Const(true);
      }
      if (step == null) {
        step = Noop();
      } else if (!(step instanceof Expression)) {
        throw TypeError("Expected step to be an Expression, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof For ? this : __create(_For_prototype);
      if (!(test instanceof Expression)) {
        test = toConst(test);
      }
      if (test.isConst() && !test.constValue()) {
        return init;
      }
      _this.init = init;
      _this.test = test;
      _this.step = step;
      _this.body = body.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _For_prototype = For.prototype = __create(_Statement_prototype);
    _For_prototype.constructor = For;
    For.displayName = "For";
    _For_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("for (");
      if (!this.init.isNoop()) {
        this.init.compileAsBlock(options, Level.insideParentheses, false, sb);
      }
      sb("; ");
      if (!this.test.isConst() || !this.test.constValue()) {
        this.test.compile(options, Level.insideParentheses, false, sb);
      }
      sb("; ");
      if (!this.step.isNoop()) {
        this.step.compileAsBlock(options, Level.insideParentheses, false, sb);
      }
      sb(")");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        sb(" {\n");
        sb.indent(__num(options.indent) + 1);
        this.body.compileAsStatement(incIndent(options), true, sb);
        sb("\n");
        sb.indent(options.indent);
        sb("}");
      }
    };
    _For_prototype.walk = function (walker) {
      var _ref, body, init, step, test;
      init = (_ref = walker(this.init)) != null ? _ref : this.init.walk(walker);
      test = (_ref = walker(this.test)) != null ? _ref : this.test.walk(walker);
      step = (_ref = walker(this.step)) != null ? _ref : this.step.walk(walker);
      body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body) {
        return For(init, test, step, body);
      } else {
        return this;
      }
    };
    _For_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "For(" + __strnum(inspect(this.init, null, d)) + ", " + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.step, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
    };
    _For_prototype.toJSON = function () {
      return {
        type: "For",
        init: simplify(this.init),
        test: simplify(this.test),
        step: simplify(this.step),
        body: simplify(this.body)
      };
    };
    For.fromJSON = function (_p) {
      var body, init, step, test;
      init = _p.init;
      test = _p.test;
      step = _p.step;
      body = _p.body;
      return For(fromJSON(init), fromJSON(test), fromJSON(step), fromJSON(body));
    };
    return For;
  }(Statement));
  exports.ForIn = ForIn = (function (Statement) {
    var _ForIn_prototype, _Statement_prototype;
    function ForIn(key, object, body) {
      var _this;
      if (!(key instanceof Ident)) {
        throw TypeError("Expected key to be an Ident, got " + __typeof(key));
      }
      if (object == null) {
        object = Noop();
      } else if (!(object instanceof Expression)) {
        throw TypeError("Expected object to be an Expression, got " + __typeof(object));
      }
      if (body == null) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof ForIn ? this : __create(_ForIn_prototype);
      _this.key = key;
      _this.object = object;
      _this.body = body.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _ForIn_prototype = ForIn.prototype = __create(_Statement_prototype);
    _ForIn_prototype.constructor = ForIn;
    ForIn.displayName = "ForIn";
    _ForIn_prototype.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("for (");
      this.key.compile(options, Level.insideParentheses, false, sb);
      sb(" in ");
      this.object.compile(options, Level.insideParentheses, false, sb);
      sb(")");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        sb(" {\n");
        sb.indent(__num(options.indent) + 1);
        this.body.compileAsStatement(incIndent(options), true, sb);
        sb("\n");
        sb.indent(options.indent);
        sb("}");
      }
    };
    _ForIn_prototype.walk = function (walker) {
      var _ref, body, key, object;
      key = (_ref = walker(this.key)) != null ? _ref : this.key.walk(walker);
      object = (_ref = walker(this.object)) != null ? _ref : this.object.walk(walker);
      body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
      if (key !== this.key || object !== this.object || body !== this.body) {
        return ForIn(key, object, body);
      } else {
        return this;
      }
    };
    _ForIn_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "ForIn(" + __strnum(inspect(this.key, null, d)) + ", " + __strnum(inspect(this.object, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
    };
    _ForIn_prototype.toJSON = function () {
      return { type: "ForIn", key: this.key, object: simplify(this.object), body: simplify(this.body) };
    };
    ForIn.fromJSON = function (_p) {
      var body, key, object;
      key = _p.key;
      object = _p.object;
      body = _p.body;
      return ForIn(fromJSON(key), fromJSON(object), fromJSON(body));
    };
    return ForIn;
  }(Statement));
  function validateFuncParamsAndVariables(params, variables) {
    var _arr, _i, _len, names, param, variable;
    names = [];
    for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      param = _arr[_i];
      if (__in(param.name, names)) {
        throw Error("Duplicate parameter: " + __strnum(param.name));
      }
      names.push(param.name);
    }
    for (_arr = __toArray(variables), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      variable = _arr[_i];
      if (__in(variable, names)) {
        throw Error("Duplicate variable: " + __strnum(variable));
      }
      names.push(variable);
    }
  }
  function compileFuncBody(options, sb, declarations, variables, body) {
    var _arr, _i, _len, declaration, i, variable;
    for (_arr = __toArray(declarations), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      declaration = _arr[_i];
      sb.indent(options.indent);
      sb(toJSSource(declaration));
      sb(";\n");
    }
    if (__num(variables.length) > 0) {
      sb.indent(options.indent);
      sb("var ");
      for (_arr = __toArray(variables), i = 0, _len = _arr.length; i < _len; ++i) {
        variable = _arr[i];
        if (__num(i) > 0) {
          sb(", ");
        }
        sb(variables[i]);
      }
      sb(";\n");
    }
    if (!body.isNoop()) {
      sb.indent(options.indent);
      body.compileAsStatement(options, true, sb);
      sb("\n");
    }
  }
  function compileFunc(options, sb, name, params, declarations, variables, body) {
    var _arr, _len, i, param;
    sb("function ");
    if (name != null) {
      name.compile(sb, Level.insideParentheses, false, sb);
    }
    sb("(");
    for (_arr = __toArray(params), i = 0, _len = _arr.length; i < _len; ++i) {
      param = _arr[i];
      if (__num(i) > 0) {
        sb(", ");
      }
      param.compile(options, Level.insideParentheses, false, sb);
    }
    sb(") {");
    if (variables.length || declarations.length || !body.isNoop()) {
      sb("\n");
      compileFuncBody(
        incIndent(options),
        sb,
        declarations,
        variables,
        body
      );
      sb.indent(options.indent);
    }
    return sb("}");
  }
  exports.Func = Func = (function (Expression) {
    var _Expression_prototype, _Func_prototype;
    function Func(name, params, variables, body, declarations) {
      var _i, _len, _this;
      if (name == null) {
        name = null;
      } else if (!(name instanceof Ident)) {
        throw TypeError("Expected name to be a null or Ident, got " + __typeof(name));
      }
      if (params == null) {
        params = [];
      } else if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          if (!(params[_i] instanceof Ident)) {
            throw TypeError("Expected params[" + _i + "] to be an Ident, got " + __typeof(params[_i]));
          }
        }
      }
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i = 0, _len = variables.length; _i < _len; ++_i) {
          if (typeof variables[_i] !== "string") {
            throw TypeError("Expected variables[" + _i + "] to be a String, got " + __typeof(variables[_i]));
          }
        }
      }
      if (body == null) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i = 0, _len = declarations.length; _i < _len; ++_i) {
          if (typeof declarations[_i] !== "string") {
            throw TypeError("Expected declarations[" + _i + "] to be a String, got " + __typeof(declarations[_i]));
          }
        }
      }
      _this = this instanceof Func ? this : __create(_Func_prototype);
      validateFuncParamsAndVariables(params, variables);
      _this.name = name;
      _this.params = params;
      _this.variables = variables;
      _this.body = body;
      _this.declarations = declarations;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Func_prototype = Func.prototype = __create(_Expression_prototype);
    _Func_prototype.constructor = Func;
    Func.displayName = "Func";
    _Func_prototype.compile = function (options, level, lineStart, sb) {
      var wrap;
      wrap = lineStart && !this.name;
      if (wrap) {
        sb("(");
      }
      compileFunc(
        options,
        sb,
        this.name,
        this.params,
        this.declarations,
        this.variables,
        this.body
      );
      if (wrap) {
        sb(")");
      }
    };
    _Func_prototype.compileAsStatement = function (options, lineStart, sb) {
      this.compile(options, Level.block, lineStart, sb);
      if (!lineStart || !this.name) {
        sb(";");
      }
    };
    _Func_prototype.isLarge = function () {
      return true;
    };
    _Func_prototype.isNoop = function () {
      return this.name == null;
    };
    _Func_prototype.walk = function (walker) {
      var _ref, body, name, params;
      name = this.name ? (_ref = walker(this.name)) != null ? _ref : this.name.walk(walker) : this.name;
      params = walkArray(this.params, walker);
      body = this.body.walk(walker);
      if (name !== this.name || params !== this.params || body !== this.body) {
        return Func(
          name,
          params,
          this.variables,
          body,
          this.declarations,
          this.meta
        );
      } else {
        return this;
      }
    };
    _Func_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Func(" + __strnum(inspect(this.name, null, d)) + ", " + __strnum(inspect(this.params, null, d)) + ", " + __strnum(inspect(this.variables, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.declarations, null, d)) + ", " + __strnum(inspect(this.meta, null, d)) + ")";
    };
    _Func_prototype.toJSON = function () {
      return {
        type: "Func",
        name: this.name || void 0,
        params: simplify(this.params),
        variables: simplify(this.variables),
        body: simplify(this.body),
        declarations: simplify(this.declarations)
      };
    };
    Func.fromJSON = function (_p) {
      var body, declarations, name, params, variables;
      name = _p.name;
      params = _p.params;
      variables = _p.variables;
      body = _p.body;
      declarations = _p.declarations;
      return Func(
        name ? fromJSON(name) : void 0,
        arrayFromJSON(params),
        variables,
        fromJSON(body),
        declarations
      );
    };
    return Func;
  }(Expression));
  exports.Ident = Ident = (function (Expression) {
    var _Expression_prototype, _Ident_prototype;
    function Ident(name) {
      var _this;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      _this = this instanceof Ident ? this : __create(_Ident_prototype);
      if (!isAcceptableIdent(name)) {
        throw Error("Not an acceptable identifier name: " + name);
      }
      _this.name = name;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Ident_prototype = Ident.prototype = __create(_Expression_prototype);
    _Ident_prototype.constructor = Ident;
    Ident.displayName = "Ident";
    _Ident_prototype.compile = function (options, level, lineStart, sb) {
      sb(this.name);
    };
    _Ident_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop().compileAsBlock(options, level, lineStart, sb);
    };
    _Ident_prototype.walk = function () {
      return this;
    };
    _Ident_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Ident(" + __strnum(inspect(this.name, null, d)) + ")";
    };
    _Ident_prototype.isNoop = function () {
      return true;
    };
    _Ident_prototype.toJSON = function () {
      return { type: "Ident", name: this.name };
    };
    Ident.fromJSON = function (_p) {
      var name;
      name = _p.name;
      return Ident(name);
    };
    return Ident;
  }(Expression));
  exports.IfStatement = IfStatement = (function (Statement) {
    var _IfStatement_prototype, _Statement_prototype;
    function IfStatement(test, whenTrue, whenFalse) {
      var _this;
      if (test == null) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be an Expression, got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = Noop();
      } else if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = Noop();
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
      }
      _this = this instanceof IfStatement ? this : __create(_IfStatement_prototype);
      if (test instanceof Unary && test.op === "!" && test.node instanceof Unary && test.node.op === "!") {
        test = test.node.node;
      }
      if (test.isConst()) {
        if (test.constValue()) {
          return whenTrue;
        } else {
          return whenFalse;
        }
      } else {
        whenTrue = whenTrue.maybeToStatement();
        whenFalse = whenFalse.maybeToStatement();
        if (whenTrue instanceof Noop) {
          if (whenFalse instanceof Noop) {
            return test.maybeToStatement();
          } else {
            return IfStatement.call(
              _this,
              Unary("!", test),
              whenFalse,
              whenTrue
            );
          }
        } else if (whenFalse instanceof Noop && whenTrue instanceof IfStatement && whenTrue.whenFalse instanceof Noop) {
          _this.test = Binary(test, "&&", whenTrue.test);
          _this.whenTrue = whenTrue.whenTrue;
          _this.whenFalse = whenFalse;
        } else {
          _this.test = test;
          _this.whenTrue = whenTrue;
          _this.whenFalse = whenFalse;
        }
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _IfStatement_prototype = IfStatement.prototype = __create(_Statement_prototype);
    _IfStatement_prototype.constructor = IfStatement;
    IfStatement.displayName = "IfStatement";
    _IfStatement_prototype.compile = function (options, level, lineStart, sb) {
      var childOptions, whenFalse;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (this.whenTrue.isNoop()) {
        if (this.whenFalse.isNoop()) {
          this.test.compileAsStatement(options, true, sb);
        } else {
          IfStatement(
            Unary("!", this.test),
            this.whenFalse,
            this.whenTrue
          ).compile(options, level, lineStart, sb);
        }
      } else {
        sb("if (");
        this.test.compile(options, Level.insideParentheses, false, sb);
        sb(") {\n");
        childOptions = incIndent(options);
        sb.indent(childOptions.indent);
        this.whenTrue.compileAsStatement(childOptions, true, sb);
        sb("\n");
        sb.indent(options.indent);
        sb("}");
        whenFalse = this.whenFalse;
        if (!whenFalse.isNoop()) {
          sb(" else ");
          if (whenFalse instanceof IfStatement) {
            whenFalse.compile(options, level, false, sb);
          } else {
            sb("{\n");
            sb.indent(childOptions.indent);
            whenFalse.compileAsStatement(childOptions, true, sb);
            sb("\n");
            sb.indent(options.indent);
            sb("}");
          }
        }
      }
    };
    _IfStatement_prototype.walk = function (walker) {
      var _ref, test, whenFalse, whenTrue;
      test = (_ref = walker(this.test)) != null ? _ref : this.test.walk(walker);
      whenTrue = (_ref = walker(this.whenTrue)) != null ? _ref : this.whenTrue.walk(walker);
      whenFalse = (_ref = walker(this.whenFalse)) != null ? _ref : this.whenFalse.walk(walker);
      if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return If(test, whenTrue, whenFalse);
      } else {
        return this;
      }
    };
    _IfStatement_prototype.mutateLast = function (func, includeNoop) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.mutateLast(func, includeNoop);
      whenFalse = this.whenFalse.mutateLast(func, includeNoop);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return If(this.test, whenTrue, whenFalse);
      } else {
        return this;
      }
    };
    _IfStatement_prototype.exitType = function () {
      var falseExit, trueExit;
      if (this._exitType === void 0) {
        trueExit = this.whenTrue.exitType();
        falseExit = this.whenFalse.exitType();
        return this._exitType = trueExit === falseExit ? trueExit : null;
      } else {
        return this._exitType;
      }
    };
    _IfStatement_prototype.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = this.test.isNoop() && this.whenTrue.isNoop() && this.whenFalse.isNoop();
      } else {
        return _ref;
      }
    };
    _IfStatement_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "IfStatement(" + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.whenTrue, null, d)) + ", " + __strnum(inspect(this.whenFalse, null, d)) + ")";
    };
    _IfStatement_prototype.toJSON = function () {
      return { type: "IfStatement", test: simplify(this.test), whenTrue: simplify(this.whenTrue), whenFalse: simplify(this.whenFalse) };
    };
    IfStatement.fromJSON = function (_p) {
      var test, whenFalse, whenTrue;
      test = _p.test;
      whenTrue = _p.whenTrue;
      whenFalse = _p.whenFalse;
      return IfStatement(fromJSON(test), fromJSON(whenTrue), fromJSON(whenFalse));
    };
    return IfStatement;
  }(Statement));
  exports.IfExpression = IfExpression = (function (Expression) {
    var _Expression_prototype, _IfExpression_prototype;
    function IfExpression(test, whenTrue, whenFalse) {
      var _this;
      if (test == null) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be an Expression, got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = Noop();
      }
      if (whenFalse == null) {
        whenFalse = Noop();
      }
      _this = this instanceof IfExpression ? this : __create(_IfExpression_prototype);
      if (!(whenTrue instanceof Expression)) {
        whenTrue = toConst(whenTrue);
      }
      if (!(whenFalse instanceof Expression)) {
        whenFalse = toConst(whenFalse);
      }
      if (test instanceof Unary && test.op === "!" && test.node instanceof Unary && test.node.op === "!") {
        test = test.node.node;
      }
      if (test.isConst()) {
        if (test.constValue()) {
          return whenTrue;
        } else {
          return whenFalse;
        }
      } else if (whenFalse instanceof Noop && whenTrue instanceof IfExpression && whenTrue.whenFalse instanceof Noop) {
        _this.test = Binary(test, "&&", whenTrue.test);
        _this.whenTrue = whenTrue.whenTrue;
        _this.whenFalse = whenFalse;
      } else {
        _this.test = test;
        _this.whenTrue = whenTrue;
        _this.whenFalse = whenFalse;
      }
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _IfExpression_prototype = IfExpression.prototype = __create(_Expression_prototype);
    _IfExpression_prototype.constructor = IfExpression;
    IfExpression.displayName = "IfExpression";
    _IfExpression_prototype.toStatement = function () {
      return IfStatement(this.test, this.whenTrue, this.whenFalse);
    };
    function compileSmall(test, whenTrue, whenFalse, options, lineStart, sb) {
      test.compile(options, Level.inlineCondition, lineStart, sb);
      sb(" ? ");
      whenTrue.compile(options, Level.inlineCondition, false, sb);
      sb(" : ");
      whenFalse.compile(options, Level.inlineCondition, false, sb);
    }
    function compileLarge(test, whenTrue, whenFalse, options, lineStart, sb) {
      var childOptions, largeWhenTrue, wrapTest, wrapWhenTrue;
      childOptions = incIndent(options);
      wrapTest = test instanceof IfExpression;
      if (wrapTest) {
        sb("(");
      }
      test.compile(
        childOptions,
        wrapTest ? Level.insideParentheses : Level.inlineCondition,
        lineStart && !wrapTest,
        sb
      );
      if (wrapTest) {
        sb(")");
      }
      largeWhenTrue = whenTrue.isLarge();
      if (largeWhenTrue) {
        sb("\n");
        sb.indent(childOptions.indent);
        sb("? ");
      } else {
        sb(" ? ");
      }
      wrapWhenTrue = whenTrue instanceof IfExpression;
      if (wrapWhenTrue) {
        sb("(");
      }
      whenTrue.compile(
        childOptions,
        wrapWhenTrue ? Level.insideParentheses : Level.inlineCondition,
        false,
        sb
      );
      if (wrapWhenTrue) {
        sb(")");
      }
      sb("\n");
      sb.indent(childOptions.indent);
      sb(": ");
      if (whenFalse instanceof IfExpression) {
        compileLarge(
          whenFalse.test,
          whenFalse.whenTrue,
          whenFalse.whenFalse,
          options,
          false,
          sb
        );
      } else {
        whenFalse.compile(childOptions, Level.inlineCondition, false, sb);
      }
    }
    _IfExpression_prototype.compile = function (options, level, lineStart, sb) {
      var f, wrap;
      if (level === Level.block) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        wrap = !__lte(level, Level.inlineCondition);
        if (wrap) {
          sb("(");
        }
        f = this.whenTrue.isLarge() || this.whenFalse.isLarge() ? compileLarge : compileSmall;
        f(
          this.test,
          this.whenTrue,
          this.whenFalse,
          options,
          !wrap && lineStart,
          sb
        );
        if (wrap) {
          sb(")");
        }
      }
    };
    _IfExpression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      if (this.test.isNoop()) {
        this.whenFalse.compileAsBlock(options, level, lineStart, sb);
      } else if (this.whenTrue.isNoop()) {
        if (this.whenFalse.isNoop()) {
          this.test.compileAsBlock(options, level, lineStart, sb);
        } else {
          Binary(this.test, "||", this.whenFalse).compileAsBlock(options, level, lineStart, sb);
        }
      } else if (this.whenFalse.isNoop()) {
        Binary(this.test, "&&", this.whenFalse).compileAsBlock(options, level, lineStart, sb);
      } else {
        this.compile(options, level, lineStart, sb);
      }
    };
    _IfExpression_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = (function () {
          var _arr, _i, _len, part;
          for (_arr = [_this.test, _this.whenTrue, _this.whenFalse], _i = 0, _len = _arr.length; _i < _len; ++_i) {
            part = _arr[_i];
            if (!part.isSmall()) {
              return true;
            }
          }
          return false;
        }());
      } else {
        return _ref;
      }
    };
    _IfExpression_prototype.isSmall = function () {
      return false;
    };
    _IfExpression_prototype.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = this.test.isNoop() && this.whenTrue.isNoop() && this.whenFalse.isNoop();
      } else {
        return _ref;
      }
    };
    _IfExpression_prototype.walk = IfStatement.prototype.walk;
    _IfExpression_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "IfExpression(" + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.whenTrue, null, d)) + ", " + __strnum(inspect(this.whenFalse, null, d)) + ")";
    };
    _IfExpression_prototype.toJSON = function () {
      return { type: "IfExpression", test: simplify(this.test), whenTrue: simplify(this.whenTrue), whenFalse: simplify(this.whenFalse) };
    };
    IfExpression.fromJSON = function (_p) {
      var test, whenFalse, whenTrue;
      test = _p.test;
      whenTrue = _p.whenTrue;
      whenFalse = _p.whenFalse;
      return IfExpression(fromJSON(test), fromJSON(whenTrue), fromJSON(whenFalse));
    };
    return IfExpression;
  }(Expression));
  If = exports.If = function (test, whenTrue, whenFalse) {
    if (whenTrue instanceof Statement || whenFalse instanceof Statement) {
      return IfStatement(test, whenTrue, whenFalse);
    } else {
      return IfExpression(test, whenTrue, whenFalse);
    }
  };
  exports.Noop = Noop = (function (Expression) {
    var _Expression_prototype, _Noop_prototype;
    function Noop() {
      var _this;
      _this = this instanceof Noop ? this : __create(_Noop_prototype);
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Noop_prototype = Noop.prototype = __create(_Expression_prototype);
    _Noop_prototype.constructor = Noop;
    Noop.displayName = "Noop";
    _Noop_prototype.compileAsStatement = function () {};
    _Noop_prototype.compile = function (options, level, lineStart, sb) {
      if (!__lte(level, Level.block)) {
        Const(void 0).compile(options, level, lineStart, sb);
      }
    };
    _Noop_prototype.isConst = function () {
      return true;
    };
    _Noop_prototype.isNoop = Noop.prototype.isConst;
    _Noop_prototype.constValue = function () {
      return;
    };
    _Noop_prototype.walk = function () {
      return this;
    };
    _Noop_prototype.mutateLast = function (func, includeNoop) {
      if (includeNoop) {
        return func(this);
      } else {
        return this;
      }
    };
    _Noop_prototype.inspect = function () {
      return "Noop()";
    };
    _Noop_prototype.toJSON = function () {
      return { type: "Noop" };
    };
    Noop.fromJSON = function () {
      return Noop();
    };
    return Noop;
  }(Expression));
  exports.Obj = Obj = (function (Expression) {
    var _Expression_prototype, _Obj_prototype, ObjPair;
    function Obj(elements) {
      var _i, _len, _this;
      if (elements == null) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof ObjPair)) {
            throw TypeError("Expected elements[" + _i + "] to be an ObjPair, got " + __typeof(elements[_i]));
          }
        }
      }
      _this = this instanceof Obj ? this : __create(_Obj_prototype);
      validateUniqueKeys(elements);
      _this.elements = elements;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Obj_prototype = Obj.prototype = __create(_Expression_prototype);
    _Obj_prototype.constructor = Obj;
    Obj.displayName = "Obj";
    function validateUniqueKeys(elements) {
      var _arr, _i, _len, key, keys, pair;
      keys = [];
      for (_arr = __toArray(elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        pair = _arr[_i];
        key = pair.key;
        if (__in(key, keys)) {
          throw Error("Found duplicate key: " + toJSSource(key));
        }
        keys.push(key);
      }
    }
    function toSafeKey(key) {
      var num;
      if (isAcceptableIdent(key)) {
        return key;
      } else {
        num = Number(key);
        if (num === num && String(num) === key) {
          return key;
        } else {
          return toJSSource(key);
        }
      }
    }
    function compileLarge(elements, options, sb) {
      var _arr, childOptions, element, i, key, len;
      childOptions = incIndent(options);
      for (_arr = __toArray(elements), i = 0, len = _arr.length; i < len; ++i) {
        element = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        key = element.key;
        sb(toSafeKey(key));
        sb(": ");
        element.value.compile(childOptions, Level.sequence, false, sb);
        if (__num(i) < __num(len) - 1) {
          sb(",");
        }
      }
      sb("\n");
      sb.indent(options.indent);
    }
    function compileSmall(elements, options, sb) {
      var _arr, _len, element, i, key;
      if (elements.length) {
        sb(" ");
        for (_arr = __toArray(elements), i = 0, _len = _arr.length; i < _len; ++i) {
          element = _arr[i];
          if (__num(i) > 0) {
            sb(", ");
          }
          key = element.key;
          sb(toSafeKey(key));
          sb(": ");
          element.value.compile(options, Level.sequence, false, sb);
        }
        sb(" ");
      }
    }
    _Obj_prototype.compile = function (options, level, lineStart, sb) {
      var f;
      if (lineStart) {
        sb("(");
      }
      sb("{");
      f = this.shouldCompileLarge() ? compileLarge : compileSmall;
      f(this.elements, options, sb);
      sb("}");
      if (lineStart) {
        sb(")");
      }
    };
    _Obj_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var _this;
      _this = this;
      BlockExpression((function () {
        var _arr, _arr2, _i, _len, element;
        for (_arr = [], _arr2 = __toArray(_this.elements), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          element = _arr2[_i];
          _arr.push(element.value);
        }
        return _arr;
      }())).compileAsBlock(options, level, lineStart, sb);
    };
    _Obj_prototype.compileAsStatement = function (options, lineStart, sb) {
      var _this;
      _this = this;
      BlockStatement((function () {
        var _arr, _arr2, _i, _len, element;
        for (_arr = [], _arr2 = __toArray(_this.elements), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          element = _arr2[_i];
          _arr.push(element.value);
        }
        return _arr;
      }())).compileAsStatement(options, lineStart, sb);
    };
    _Obj_prototype.shouldCompileLarge = function () {
      switch (this.elements.length) {
      case 0:
        return false;
      case 1:
        return this.elements[0].isLarge();
      default:
        return this.isLarge();
      }
    };
    _Obj_prototype.isSmall = function () {
      switch (this.elements.length) {
      case 0:
        return true;
      case 1:
        return this.elements[0].isSmall();
      default:
        return false;
      }
    };
    _Obj_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(_this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isSmall()) {
              return true;
            }
          }
          return false;
        }());
      } else {
        return _ref;
      }
    };
    _Obj_prototype.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(_this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isNoop()) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _Obj_prototype.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (elements !== this.elements) {
        return Obj(elements);
      } else {
        return this;
      }
    };
    _Obj_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Obj(" + __strnum(inspect(this.elements, null, d)) + ")";
    };
    _Obj_prototype.toJSON = function () {
      var _this;
      _this = this;
      return {
        type: "Obj",
        pairs: simplify((function () {
          var _arr, _arr2, _i, _len, pair;
          for (_arr = [], _arr2 = __toArray(_this.pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            pair = _arr2[_i];
            _arr.push({ key: pair.key, value: simplify(pair.value) });
          }
          return _arr;
        }()))
      };
    };
    Obj.fromJSON = function (_p) {
      var _arr, _i, _len, pair, pairs, resultPairs;
      pairs = _p.pairs;
      resultPairs = [];
      for (_arr = __toArray(pairs || []), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        pair = _arr[_i];
        if (!pair || typeof pair !== "object") {
          throw Error("Expecting an object with a key and value");
        }
        resultPairs.push(ObjPair(pair.key, fromJSON(pair.value)));
      }
      return Obj(resultPairs);
    };
    Obj.Pair = ObjPair = (function () {
      var _ObjPair_prototype;
      function ObjPair(key, value) {
        var _this;
        if (typeof key !== "string") {
          throw TypeError("Expected key to be a String, got " + __typeof(key));
        }
        if (value == null) {
          value = Noop();
        }
        _this = this instanceof ObjPair ? this : __create(_ObjPair_prototype);
        if (!(value instanceof Expression)) {
          value = toConst(value);
        }
        _this.key = key;
        _this.value = value;
        return _this;
      }
      _ObjPair_prototype = ObjPair.prototype;
      ObjPair.displayName = "ObjPair";
      _ObjPair_prototype.isSmall = function () {
        return this.value.isSmall();
      };
      _ObjPair_prototype.isLarge = function () {
        return this.value.isLarge();
      };
      _ObjPair_prototype.isNoop = function () {
        return this.value.isNoop();
      };
      _ObjPair_prototype.walk = function (walker) {
        var _ref, value;
        value = (_ref = walker(this.value)) != null ? _ref : this.value.walk(walker);
        if (value !== this.value) {
          return ObjPair(this.key, value);
        } else {
          return this;
        }
      };
      _ObjPair_prototype.inspect = function (depth) {
        var d;
        d = decDepth(depth);
        return "Pair(" + __strnum(inspect(this.key, null, d)) + ", " + __strnum(inspect(this.value, null, d)) + ")";
      };
      return ObjPair;
    }());
    return Obj;
  }(Expression));
  exports.Return = Return = (function (Statement) {
    var _Return_prototype, _Statement_prototype;
    function Return(node) {
      var _this;
      if (node == null) {
        node = Noop();
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be an Expression, got " + __typeof(node));
      }
      _this = this instanceof Return ? this : __create(_Return_prototype);
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Return);
      }
      _this.node = node;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Return_prototype = Return.prototype = __create(_Statement_prototype);
    _Return_prototype.constructor = Return;
    Return.displayName = "Return";
    _Return_prototype.compile = function (options, level, lineStart, sb) {
      sb("return");
      if (!this.node.isConst() || this.node.constValue() !== void 0) {
        sb(" ");
        this.node.compile(options, Level.insideParentheses, false, sb);
      }
      sb(";");
    };
    _Return_prototype.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Return(node);
      } else {
        return this;
      }
    };
    _Return_prototype.exitType = function () {
      return "return";
    };
    _Return_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Return(" + __strnum(inspect(this.node, null, d)) + ")";
    };
    _Return_prototype.toJSON = function () {
      return { type: "Return", node: simplify(this.node) };
    };
    Return.fromJSON = function (_p) {
      var node;
      node = _p.node;
      return Return(fromJSON(node));
    };
    return Return;
  }(Statement));
  exports.Root = Root = (function () {
    var _Root_prototype;
    function Root(body, variables, declarations) {
      var _i, _len, _this;
      if (body == null) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i = 0, _len = variables.length; _i < _len; ++_i) {
          if (typeof variables[_i] !== "string") {
            throw TypeError("Expected variables[" + _i + "] to be a String, got " + __typeof(variables[_i]));
          }
        }
      }
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i = 0, _len = declarations.length; _i < _len; ++_i) {
          if (typeof declarations[_i] !== "string") {
            throw TypeError("Expected declarations[" + _i + "] to be a String, got " + __typeof(declarations[_i]));
          }
        }
      }
      _this = this instanceof Root ? this : __create(_Root_prototype);
      validateFuncParamsAndVariables([], variables);
      _this.body = body;
      _this.variables = variables;
      _this.declarations = declarations;
      return _this;
    }
    _Root_prototype = Root.prototype;
    Root.displayName = "Root";
    _Root_prototype.compile = function (options) {
      var sb;
      if (options == null) {
        options = {};
      }
      if (!options.indent) {
        options.indent = 0;
      }
      sb = StringBuilder();
      compileFuncBody(
        options,
        sb,
        this.declarations,
        this.variables,
        this.body
      );
      return sb.toString();
    };
    _Root_prototype.toString = function () {
      return this.compile();
    };
    _Root_prototype.toFunction = Node.prototype.toFunction;
    _Root_prototype.isLarge = function () {
      return true;
    };
    _Root_prototype.walk = function (walker) {
      var body;
      body = this.body.walk(walker);
      if (body !== this.body) {
        return Root(body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _Root_prototype.mutateLast = function (func, includeNoop) {
      var body;
      body = this.body.mutateLast(func, includeNoop);
      if (body !== this.body) {
        return Root(body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _Root_prototype.exitType = function () {
      return this.last().exitType();
    };
    _Root_prototype.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _Root_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Root(" + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.variables, null, d)) + ", " + __strnum(inspect(this.declarations, null, d)) + ")";
    };
    _Root_prototype.toJSON = function () {
      return { type: "Root", body: simplify(this.body), variables: simplify(this.variables), declarations: simplify(this.declarations) };
    };
    Root.fromJSON = function (_p) {
      var body, declarations, variables;
      body = _p.body;
      variables = _p.variables;
      declarations = _p.declarations;
      return Root(fromJSON(body), variables, declarations);
    };
    return Root;
  }());
  exports.This = This = (function (Expression) {
    var _Expression_prototype, _This_prototype;
    function This() {
      var _this;
      _this = this instanceof This ? this : __create(_This_prototype);
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _This_prototype = This.prototype = __create(_Expression_prototype);
    _This_prototype.constructor = This;
    This.displayName = "This";
    _This_prototype.compile = function (options, level, lineStart, sb) {
      sb("this");
    };
    _This_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop().compileAsBlock(options, level, lineStart, sb);
    };
    _This_prototype.isNoop = function () {
      return true;
    };
    _This_prototype.walk = function () {
      return this;
    };
    _This_prototype.inspect = function () {
      return "This()";
    };
    _This_prototype.toJSON = function () {
      return { type: "This" };
    };
    This.fromJSON = function () {
      return This();
    };
    return This;
  }(Expression));
  exports.Throw = Throw = (function (Statement) {
    var _Statement_prototype, _Throw_prototype;
    function Throw(node) {
      var _this;
      if (node == null) {
        node = Noop();
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be an Expression, got " + __typeof(node));
      }
      _this = this instanceof Throw ? this : __create(_Throw_prototype);
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Throw, true);
      }
      _this.node = node;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Throw_prototype = Throw.prototype = __create(_Statement_prototype);
    _Throw_prototype.constructor = Throw;
    Throw.displayName = "Throw";
    _Throw_prototype.compile = function (options, level, lineStart, sb) {
      sb("throw ");
      this.node.compile(options, Level.insideParentheses, false, sb);
      return sb(";");
    };
    _Throw_prototype.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Throw(node);
      } else {
        return this;
      }
    };
    _Throw_prototype.exitType = function () {
      return "throw";
    };
    _Throw_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Throw(" + __strnum(inspect(this.node, null, d)) + ")";
    };
    _Throw_prototype.toJSON = function () {
      return { type: "Throw", node: simplify(this.node) };
    };
    Throw.fromJSON = function (_p) {
      var node;
      node = _p.node;
      return Throw(fromJSON(node));
    };
    return Throw;
  }(Statement));
  exports.Switch = Switch = (function (Statement) {
    var _Statement_prototype, _Switch_prototype, SwitchCase;
    function Switch(node, cases, defaultCase) {
      var _i, _len, _this;
      if (node == null) {
        node = Noop();
      }
      if (cases == null) {
        cases = [];
      } else if (!__isArray(cases)) {
        throw TypeError("Expected cases to be an Array, got " + __typeof(cases));
      } else {
        for (_i = 0, _len = cases.length; _i < _len; ++_i) {
          if (!(cases[_i] instanceof SwitchCase)) {
            throw TypeError("Expected cases[" + _i + "] to be a SwitchCase, got " + __typeof(cases[_i]));
          }
        }
      }
      if (defaultCase == null) {
        defaultCase = Noop();
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node, got " + __typeof(defaultCase));
      }
      _this = this instanceof Switch ? this : __create(_Switch_prototype);
      if (!(node instanceof Expression)) {
        node = toConst(node);
      }
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Switch_prototype = Switch.prototype = __create(_Statement_prototype);
    _Switch_prototype.constructor = Switch;
    Switch.displayName = "Switch";
    _Switch_prototype.compile = function (options, level, lineStart, sb) {
      var _arr, _i, _len, case_, childOptions;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("switch (");
      this.node.compile(options, Level.insideParentheses, false, sb);
      sb(") {");
      childOptions = incIndent(options);
      for (_arr = __toArray(this.cases), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        case_ = _arr[_i];
        sb("\n");
        sb.indent(options.indent);
        sb("case ");
        case_.node.compile(options, Level.insideParentheses, false, sb);
        sb(":");
        if (!case_.body.isNoop()) {
          sb("\n");
          sb.indent(childOptions.indent);
          case_.body.compileAsStatement(childOptions, true, sb);
        }
      }
      if (!this.defaultCase.isNoop()) {
        sb("\n");
        sb.indent(options.indent);
        sb("default:\n");
        sb.indent(childOptions.indent);
        this.defaultCase.compileAsStatement(childOptions, true, sb);
      }
      sb("\n");
      sb.indent(options.indent);
      sb("}");
    };
    _Switch_prototype.walk = function (walker) {
      var _ref, cases, defaultCase, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      cases = walkArray(this.cases, walker);
      defaultCase = (_ref = walker(this.defaultCase)) != null ? _ref : this.defaultCase.walk(walker);
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase) {
        return Switch(node, cases, defaultCase);
      } else {
        return this;
      }
    };
    _Switch_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Switch(" + __strnum(inspect(this.node, null, d)) + ", " + __strnum(inspect(this.cases, null, d)) + ", " + __strnum(inspect(this.defaultCase, null, d)) + ")";
    };
    _Switch_prototype.toJSON = function () {
      var _this;
      _this = this;
      return {
        type: "Switch",
        node: simplify(node),
        cases: simplify((function () {
          var _arr, _arr2, _i, _len, case_;
          for (_arr = [], _arr2 = __toArray(_this.cases), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            case_ = _arr2[_i];
            _arr.push({ node: simplify(case_.node), body: simplify(case_.body) });
          }
          return _arr;
        }())),
        defaultCase: simplify(this.defaultCase)
      };
    };
    Switch.fromJSON = function (_p) {
      var _arr, _i, _len, case_, cases, defaultCase, node, resultCases;
      node = _p.node;
      cases = _p.cases;
      defaultCase = _p.defaultCase;
      resultCases = [];
      for (_arr = __toArray(cases || []), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        case_ = _arr[_i];
        if (!case_ || typeof case_ !== "object") {
          throw Error("Expected an object with a node and body");
        }
        resultCases.push(SwitchCase(fromJSON(case_.node), fromJSON(case_.body)));
      }
      return Switch(fromJSON(node), resultCases, fromJSON(defaultCase));
    };
    Switch.Case = SwitchCase = (function () {
      var _SwitchCase_prototype;
      function SwitchCase(node, body) {
        var _this;
        if (node == null) {
          node = Noop();
        }
        if (body == null) {
          body = Noop();
        } else if (!(body instanceof Node)) {
          throw TypeError("Expected body to be a Node, got " + __typeof(body));
        }
        _this = this instanceof SwitchCase ? this : __create(_SwitchCase_prototype);
        if (!(node instanceof Expression)) {
          node = toConst(node);
        }
        _this.node = node;
        _this.body = body.maybeToStatement();
        return _this;
      }
      _SwitchCase_prototype = SwitchCase.prototype;
      SwitchCase.displayName = "SwitchCase";
      _SwitchCase_prototype.isLarge = function () {
        return true;
      };
      _SwitchCase_prototype.isSmall = function () {
        return false;
      };
      _SwitchCase_prototype.walk = function (walker) {
        var _ref, body, node;
        node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
        body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
        if (node !== this.node || body !== this.body) {
          return SwitchCase(node, body);
        } else {
          return this;
        }
      };
      _SwitchCase_prototype.inspect = function (depth) {
        var d;
        d = decDepth(depth);
        return "Case(" + __strnum(inspect(this.node, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
      };
      return SwitchCase;
    }());
    return Switch;
  }(Statement));
  exports.TryCatch = TryCatch = (function (Statement) {
    var _Statement_prototype, _TryCatch_prototype;
    function TryCatch(tryBody, catchIdent, catchBody) {
      var _this;
      if (tryBody == null) {
        tryBody = Noop();
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Ident)) {
        throw TypeError("Expected catchIdent to be an Ident, got " + __typeof(catchIdent));
      }
      if (catchBody == null) {
        catchBody = Noop();
      } else if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      _this = this instanceof TryCatch ? this : __create(_TryCatch_prototype);
      _this.tryBody = tryBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.tryBody;
      }
      _this.catchIdent = catchIdent;
      _this.catchBody = catchBody.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _TryCatch_prototype = TryCatch.prototype = __create(_Statement_prototype);
    _TryCatch_prototype.constructor = TryCatch;
    TryCatch.displayName = "TryCatch";
    _TryCatch_prototype.compile = function (options, level, lineStart, sb) {
      var childOptions;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("try {\n");
      childOptions = incIndent(options);
      sb.indent(childOptions.indent);
      this.tryBody.compileAsStatement(childOptions, true, sb);
      sb("\n");
      sb.indent(options.indent);
      sb("} catch (");
      this.catchIdent.compile(options, Level.insideParentheses, false, sb);
      sb(") {");
      if (!this.catchBody.isNoop()) {
        sb("\n");
        sb.indent(childOptions.indent);
        this.catchBody.compileAsStatement(childOptions, true, sb);
        sb("\n");
        sb.indent(options.indent);
      }
      sb("}");
    };
    _TryCatch_prototype.walk = function (walker) {
      var _ref, catchBody, catchIdent, tryBody;
      tryBody = (_ref = walker(this.tryBody)) != null ? _ref : this.tryBody.walk(walker);
      catchIdent = (_ref = walker(this.catchIdent)) != null ? _ref : this.catchIdent.walk(walker);
      catchBody = (_ref = walker(this.catchBody)) != null ? _ref : this.catchBody.walk(walker);
      if (tryBody !== this.tryBody || catchIdent !== this.catchIdent || catchBody !== this.catchBody) {
        return TryCatch(tryBody, catchIdent, catchBody);
      } else {
        return this;
      }
    };
    _TryCatch_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "TryCatch(" + __strnum(inspect(this.tryBody, null, d)) + ", " + __strnum(inspect(this.catchIdent, null, d)) + ", " + __strnum(inspect(this.catchBody, null, d)) + ")";
    };
    _TryCatch_prototype.toJSON = function () {
      return { type: "TryCatch", tryBody: simplify(this.tryBody), catchIdent: this.catchIdent, catchBody: simplify(this.catchBody) };
    };
    TryCatch.fromJSON = function (_p) {
      var catchBody, catchIdent, tryBody;
      tryBody = _p.tryBody;
      catchIdent = _p.catchIdent;
      catchBody = _p.catchBody;
      return TryCatch(fromJSON(tryBody), fromJSON(catchIdent), fromJSON(catchBody));
    };
    return TryCatch;
  }(Statement));
  exports.TryFinally = TryFinally = (function (Statement) {
    var _Statement_prototype, _TryFinally_prototype;
    function TryFinally(tryBody, finallyBody) {
      var _this;
      if (tryBody == null) {
        tryBody = Noop();
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (finallyBody == null) {
        finallyBody = Noop();
      } else if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      _this = this instanceof TryFinally ? this : __create(_TryFinally_prototype);
      _this.tryBody = tryBody.maybeToStatement();
      _this.finallyBody = finallyBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.finallyBody;
      } else if (_this.finallyBody.isNoop()) {
        return _this.tryBody;
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _TryFinally_prototype = TryFinally.prototype = __create(_Statement_prototype);
    _TryFinally_prototype.constructor = TryFinally;
    TryFinally.displayName = "TryFinally";
    _TryFinally_prototype.compile = function (options, level, lineStart, sb) {
      var childOptions;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("try {\n");
      childOptions = incIndent(options);
      sb.indent(childOptions.indent);
      if (this.tryBody instanceof TryCatch) {
        this.tryBody.tryBody.compileAsStatement(childOptions, true, sb);
        sb("\n");
        sb.indent(options.indent);
        sb("} catch (");
        this.tryBody.catchIdent.compile(options, Level.insideParentheses, false, sb);
        sb(") {");
        if (!this.tryBody.catchBody.isNoop()) {
          sb("\n");
          sb.indent(childOptions.indent);
          this.tryBody.catchBody.compileAsStatement(childOptions, true, sb);
          sb("\n");
          sb.indent(options.indent);
        }
      } else {
        this.tryBody.compileAsStatement(childOptions, true, sb);
        sb("\n");
        sb.indent(options.indent);
      }
      sb("} finally {\n");
      sb.indent(childOptions.indent);
      this.finallyBody.compileAsStatement(childOptions, true, sb);
      sb("\n");
      sb.indent(options.indent);
      sb("}");
    };
    _TryFinally_prototype.walk = function (walker) {
      var _ref, finallyBody, tryBody;
      tryBody = (_ref = walker(this.tryBody)) != null ? _ref : this.tryBody.walk(walker);
      finallyBody = (_ref = walker(this.finallyBody)) != null ? _ref : this.finallyBody.walk(walker);
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
        return TryFinally(tryBody, finallyBody);
      } else {
        return this;
      }
    };
    _TryFinally_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Root(" + __strnum(inspect(this.tryBody, null, d)) + ", " + __strnum(inspect(this.finallyBody, null, d)) + ")";
    };
    _TryFinally_prototype.toJSON = function () {
      return { type: "TryFinally", tryBody: simplify(this.tryBody), finallyBody: simplify(this.finallyBody) };
    };
    TryFinally.fromJSON = function (_p) {
      var finallyBody, tryBody;
      tryBody = _p.tryBody;
      finallyBody = _p.finallyBody;
      return TryFinally(fromJSON(tryBody), fromJSON(finallyBody));
    };
    return TryFinally;
  }(Statement));
  exports.Unary = Unary = (function (Expression) {
    var _Expression_prototype, _Unary_prototype, ASSIGNMENT_OPERATORS, KNOWN_OPERATORS;
    function Unary(op, node) {
      var _this;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (node == null) {
        node = Noop();
      }
      _this = this instanceof Unary ? this : __create(_Unary_prototype);
      if (!__in(op, KNOWN_OPERATORS)) {
        throw Error("Unknown unary operator: " + op);
      }
      if (!(node instanceof Expression)) {
        node = toConst(node);
      }
      if (op === "delete" && (!(node instanceof Binary) || node.op !== ".")) {
        throw Error("Cannot use delete operator on a non-access");
      }
      _this.op = op;
      _this.node = node;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Unary_prototype = Unary.prototype = __create(_Expression_prototype);
    _Unary_prototype.constructor = Unary;
    Unary.displayName = "Unary";
    _Unary_prototype.compile = function (options, level, lineStart, sb) {
      var op;
      op = this.op;
      if (op === "++post" || op === "--post") {
        this.node.compile(options, Level.unary, false, sb);
        sb(op.substring(0, 2));
      } else {
        sb(op);
        if (op === "typeof" || op === "void" || op === "delete" || (op === "+" || op === "-" || op === "++" || op === "--") && (this.node instanceof Unary && (op === "+" || op === "-" || op === "++" || op === "--") || this.node instanceof Const && typeof this.node.value === "number" && isNegative(this.node.value))) {
          sb(" ");
        }
        this.node.compile(options, Level.unary, false, sb);
      }
    };
    _Unary_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var op;
      op = this.op;
      if (__owns(ASSIGNMENT_OPERATORS, op)) {
        this.compile(options, level, lineStart, sb);
      } else {
        this.node.compileAsBlock(options, level, lineStart, sb);
      }
    };
    _Unary_prototype.compileAsStatement = function (options, lineStart, sb) {
      var op;
      op = this.op;
      if (__owns(ASSIGNMENT_OPERATORS, op)) {
        _Expression_prototype.compileAsStatement.call(this, options, lineStart, sb);
      } else {
        this.node.compileAsStatement(options, lineStart, sb);
      }
    };
    KNOWN_OPERATORS = [
      "++",
      "--",
      "++post",
      "--post",
      "!",
      "~",
      "+",
      "-",
      "typeof",
      "void",
      "delete"
    ];
    ASSIGNMENT_OPERATORS = {
      "++": true,
      "--": true,
      "++post": true,
      "--post": true,
      "delete": true
    };
    _Unary_prototype.isLarge = function () {
      return this.node.isLarge();
    };
    _Unary_prototype.isSmall = function () {
      return this.node.isSmall();
    };
    _Unary_prototype.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = !__owns(ASSIGNMENT_OPERATORS, this.op) && this.node.isNoop();
      } else {
        return _ref;
      }
    };
    _Unary_prototype.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Unary(this.op, node);
      } else {
        return this;
      }
    };
    _Unary_prototype.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Unary(" + __strnum(inspect(this.op, null, d)) + ", " + __strnum(inspect(this.node, null, d)) + ")";
    };
    _Unary_prototype.toJSON = function () {
      return { type: "Unary", op: this.op, node: simplify(this.node) };
    };
    Unary.fromJSON = function (_p) {
      var node, op;
      op = _p.op;
      node = _p.node;
      return Unary(op, fromJSON(node));
    };
    return Unary;
  }(Expression));
  While = exports.While = function (test, body) {
    return For(null, test, null, body);
  };
  fromJSON = exports.fromJSON = function (obj) {
    if (obj == null) {
      return Noop();
    }
    if (typeof obj !== "object") {
      throw TypeError("Must provide an object to deserialize");
    }
    if (Array.isArray(obj)) {
      throw TypeError("Not expecting an array");
    }
    if (typeof obj.type !== "string") {
      throw Error("Expected an object with a string 'type' key");
    }
    if (!__owns(exports, obj.type)) {
      throw Error("Unknown node type: " + __strnum(obj.type));
    }
    return exports[obj.type].fromJSON(obj);
  };
  function arrayFromJSON(array) {
    if (array == null) {
      return [];
    } else if (Array.isArray(array)) {
      return (function () {
        var _arr, _arr2, _i, _len, item;
        for (_arr = [], _arr2 = __toArray(array), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          _arr.push(fromJSON(item));
        }
        return _arr;
      }());
    } else {
      throw Error("Expected an array, got " + __typeof(array));
    }
  }
}.call(this));
