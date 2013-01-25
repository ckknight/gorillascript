(function () {
  "use strict";
  var __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, Arguments, Arr, Binary, Block, BlockExpression, BlockStatement, Break, Call, Const, Continue, Debugger, DoWhile, Eval, Expression, For, ForIn, fromJSON, Func, getIndent, Ident, If, IfExpression, IfStatement, INDENT, inspect, isAcceptableIdent, Level, Node, Noop, Obj, Return, Root, Statement, Switch, This, Throw, toJSSourceTypes, TryCatch, TryFinally, Unary, While;
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
  __str = function (str) {
    if (typeof str !== "string") {
      throw TypeError("Expected a string, got " + __typeof(str));
    } else {
      return str;
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
  __toArray = function (x) {
    if (__isArray(x)) {
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
      if (!__lt(indent, cache.length)) {
        result = cache[__num(cache.length) - 1];
        for (i = __num(cache.length), __num(indent); i <= indent; ++i) {
          result = __strnum(result) + __strnum(INDENT);
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
  function escapeUnicodeHelper(m) {
    var num;
    num = m.charCodeAt(0).toString(16);
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
  }
  function escapeUnicode(text) {
    return text.replace(/[\u0000-\u001f\u0080-\uffff]/g, escapeUnicodeHelper);
  }
  function isNegative(value) {
    return __num(value) < 0 || 1 / __num(value) < 0;
  }
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
        return JSON.stringify(value);
      } else if (value !== value) {
        return "0/0";
      } else if (__num(value) > 0) {
        return "1/0";
      } else {
        return "-1/0";
      }
    },
    string: function (value) {
      var jsonString;
      jsonString = escapeUnicode(JSON.stringify(value));
      if (value.indexOf('"') === -1 || value.indexOf("'") !== -1) {
        return jsonString;
      } else {
        return "'" + __strnum(jsonString.substring(1, __num(jsonString.length) - 1).replace(/\\"/g, '"')) + "'";
      }
    },
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
      } else {
        return JSON.stringify(value);
      }
    }
  };
  function toJSSource(value) {
    var _ref, f;
    f = __owns(toJSSourceTypes, _ref = typeof value) ? toJSSourceTypes[_ref] : void 0;
    if (!f) {
      throw TypeError("Cannot compile const " + __typeof(value));
    }
    return f(value);
  }
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
    var _proto;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_proto);
      throw Error("Node cannot be instantiated directly");
    }
    _proto = Node.prototype;
    Node.displayName = "Node";
    _proto.toString = function () {
      var sb;
      sb = StringBuilder();
      this.compileAsStatement(
        { indent: 0, bare: true },
        true,
        sb
      );
      return sb.toString();
    };
    _proto.toFunction = function () {
      return new Function(this.toString());
    };
    _proto.compile = function () {
      throw Error("compile not implemented: " + __strnum(this.constructor.name));
    };
    _proto.maybeToStatement = function () {
      if (typeof this.toStatement === "function") {
        return this.toStatement();
      } else {
        return this;
      }
    };
    _proto.isConst = function () {
      return false;
    };
    _proto.isNoop = function () {
      return false;
    };
    _proto.constValue = function () {
      throw Error(__strnum(this.constructor.name) + " has no const value");
    };
    _proto.isLarge = function () {
      return true;
    };
    _proto.isSmall = function () {
      return !this.isLarge();
    };
    _proto.mutateLast = function () {
      return this;
    };
    _proto.exitType = function () {
      return null;
    };
    _proto.last = function () {
      return this;
    };
    return Node;
  }());
  exports.Expression = Expression = (function (_super) {
    var _proto, _superproto;
    function Expression() {
      var _this;
      _this = this instanceof Expression ? this : __create(_proto);
      throw Error("Expression cannot be instantiated directly");
    }
    _superproto = _super.prototype;
    _proto = Expression.prototype = __create(_superproto);
    _proto.constructor = Expression;
    Expression.displayName = "Expression";
    _proto.compileAsStatement = function (options, lineStart, sb) {
      if (typeof this.toStatement === "function") {
        this.toStatement().compileAsStatement(options, lineStart, sb);
      } else {
        this.compile(options, Level.block, lineStart, sb);
        sb(";");
      }
    };
    _proto.isLarge = function () {
      return false;
    };
    _proto.mutateLast = function (func) {
      return func(this);
    };
    return Expression;
  }(Node));
  exports.Statement = Statement = (function (_super) {
    var _proto, _superproto;
    function Statement() {
      var _this;
      _this = this instanceof Statement ? this : __create(_proto);
      throw Error("Expression cannot be instantiated directly");
    }
    _superproto = _super.prototype;
    _proto = Statement.prototype = __create(_superproto);
    _proto.constructor = Statement;
    Statement.displayName = "Statement";
    _proto.compileAsStatement = function (options, lineStart, sb) {
      return this.compile(options, Level.block, lineStart, sb);
    };
    return Statement;
  }(Node));
  exports.Access = function (parent) {
    var _i, _len, child, children, current;
    children = __slice(arguments, 1);
    current = parent;
    for (_i = 0, _len = __num(children.length); _i < _len; ++_i) {
      child = children[_i];
      current = Binary(current, ".", child);
    }
    return current;
  };
  exports.Arguments = Arguments = (function (_super) {
    var _proto, _superproto;
    function Arguments() {
      var _this;
      _this = this instanceof Arguments ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Arguments.prototype = __create(_superproto);
    _proto.constructor = Arguments;
    Arguments.displayName = "Arguments";
    _proto.compile = function (options, level, lineStart, sb) {
      sb("arguments");
    };
    _proto.walk = function () {
      return this;
    };
    _proto.isNoop = function () {
      return true;
    };
    _proto.inspect = function (depth) {
      return "Arguments()";
    };
    _proto.toJSON = function () {
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
      throw TypeError("Expected array to be a Array, got " + __typeof(array));
    }
    if (typeof walker !== "function") {
      throw TypeError("Expected walker to be a Function, got " + __typeof(walker));
    }
    changed = false;
    result = (function () {
      var _arr, _i, _len, item, newItem;
      for (_arr = [], _i = 0, _len = __num(array.length); _i < _len; ++_i) {
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
    var _len, i, item;
    if (array.length === 0) {
      return sb("[]");
    } else if (depth == null || __num(depth) > 0) {
      sb("[ ");
      for (i = 0, _len = __num(array.length); i < _len; ++i) {
        item = array[i];
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
  exports.Arr = Arr = (function (_super) {
    var _proto, _superproto;
    function Arr(elements) {
      var _i, _len, _this;
      if (elements == void 0) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Expression)) {
            throw TypeError("Expected elements[" + _i + "] to be a Expression, got " + __typeof(elements[_i]));
          }
        }
      }
      _this = this instanceof Arr ? this : __create(_proto);
      _this.elements = elements;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Arr.prototype = __create(_superproto);
    _proto.constructor = Arr;
    Arr.displayName = "Arr";
    function compileLarge(elements, options, level, lineStart, sb) {
      var childOptions, i, item, len;
      childOptions = incIndent(options);
      for (i = 0, len = __num(elements.length); i < len; ++i) {
        item = elements[i];
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
      var _len, i, item;
      if (elements.length) {
        for (i = 0, _len = __num(elements.length); i < _len; ++i) {
          item = elements[i];
          if (__num(i) > 0) {
            sb(", ");
          }
          item.compile(options, Level.sequence, false, sb);
        }
      }
    }
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.compileAsStatement = function (options, lineStart, sb) {
      BlockStatement(this.elements).compile(options, lineStart, sb);
    };
    _proto.shouldCompileLarge = function () {
      switch (this.elements.length) {
      case 0:
        return false;
      case 1:
        return this.elements[0].isLarge();
      default:
        return this.isLarge();
      }
    };
    _proto.isSmall = function () {
      switch (this.elements.length) {
      case 0:
        return true;
      case 1:
        return this.elements[0].isSmall();
      default:
        return false;
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (this.elements !== elements) {
        return Arr(elements);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Arr(" + __strnum(inspect(this.elements, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.BinaryChain = function (op, left) {
    var _i, _len, arg, args, current;
    args = __slice(arguments, 2);
    current = left;
    for (_i = 0, _len = __num(args.length); _i < _len; ++_i) {
      arg = args[_i];
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
      for (i = 1, _end = __num(args.length); i < _end; ++i) {
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
      for (i = 1, _end = __num(args.length); i < _end; ++i) {
        current = Binary(current, "||", args[i]);
      }
      return current;
    }
  };
  exports.Binary = Binary = (function (_super) {
    var _o, _proto, _superproto, ASSIGNMENT_OPS, LEVEL_TO_ASSOCIATIVITY, OPERATOR_PRECEDENCE;
    function Binary(left, op, right) {
      var _this;
      if (left == void 0) {
        left = Noop();
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == void 0) {
        right = Noop();
      }
      _this = this instanceof Binary ? this : __create(_proto);
      if (!__owns(OPERATOR_PRECEDENCE, op)) {
        throw Error("Unknown binary operator: " + __str(JSON.stringify(op)));
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
    _superproto = _super.prototype;
    _proto = Binary.prototype = __create(_superproto);
    _proto.constructor = Binary;
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
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.compileAsStatement = function (options, lineStart, sb) {
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
          _superproto.compileAsStatement.call(this, options, lineStart, sb);
        }
      } else {
        BlockStatement([this.left, this.right]).compileAsStatement(options, lineStart, sb);
      }
    };
    ASSIGNMENT_OPS = {
      "=": true,
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
    _proto.isLarge = function () {
      var _ref;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = !this.left.isSmall() || !this.right.isSmall();
      } else {
        return _ref;
      }
    };
    _proto.isSmall = function () {
      var _ref;
      if ((_ref = this._isSmall) == null) {
        return this._isSmall = this.left.isSmall() && this.right.isSmall();
      } else {
        return _ref;
      }
    };
    _proto.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = !__owns(ASSIGNMENT_OPS, this.op) && this.left.isNoop() && this.right.isNoop();
      } else {
        return _ref;
      }
    };
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Binary(" + __strnum(inspect(this.left, null, d)) + ", " + __strnum(inspect(this.op)) + ", " + __strnum(inspect(this.right, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.BlockStatement = BlockStatement = (function (_super) {
    var _proto, _superproto;
    function BlockStatement(body) {
      var _i, _len, _this, item, result, statement;
      if (body == void 0) {
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
      _this = this instanceof BlockStatement ? this : __create(_proto);
      result = [];
      for (_i = 0, _len = __num(body.length); _i < _len; ++_i) {
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
    _superproto = _super.prototype;
    _proto = BlockStatement.prototype = __create(_superproto);
    _proto.constructor = BlockStatement;
    BlockStatement.displayName = "BlockStatement";
    _proto.compile = function (options, level, lineStart, sb) {
      var _len, _this, i, item, nodes;
      _this = this;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      nodes = (function () {
        var _arr, _arr2, _i, _len, node;
        for (_arr = [], _arr2 = _this.body, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
          node = _arr2[_i];
          if (!node.isNoop()) {
            _arr.push(node);
          }
        }
        return _arr;
      }());
      for (i = 0, _len = __num(nodes.length); i < _len; ++i) {
        item = nodes[i];
        if (__num(i) > 0) {
          sb("\n");
          sb.indent(options.indent);
        }
        item.compileAsStatement(options, true, sb);
      }
    };
    _proto.walk = function (walker) {
      var body;
      body = walkArray(this.body, walker);
      if (this.body !== body) {
        return Block(body);
      } else {
        return this;
      }
    };
    _proto.mutateLast = function (func, includeNoop) {
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
    _proto.exitType = function () {
      return this.last().exitType();
    };
    _proto.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _proto.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, node;
          for (_arr = _this.body, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "BlockStatement(" + __strnum(inspect(this.body, null, d)) + ")";
    };
    _proto.toJSON = function () {
      return { type: "BlockStatement", body: this.body };
    };
    BlockStatement.fromJSON = function (_p) {
      var body;
      body = _p.body;
      return BlockStatement(arrayFromJSON(body));
    };
    return BlockStatement;
  }(Statement));
  exports.BlockExpression = BlockExpression = (function (_super) {
    var _proto, _superproto;
    function BlockExpression(body) {
      var _i, _len, _this, i, item, len, result;
      if (body == void 0) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i = 0, _len = body.length; _i < _len; ++_i) {
          if (!(body[_i] instanceof Expression)) {
            throw TypeError("Expected body[" + _i + "] to be a Expression, got " + __typeof(body[_i]));
          }
        }
      }
      _this = this instanceof BlockExpression ? this : __create(_proto);
      result = [];
      for (i = 0, len = __num(body.length); i < len; ++i) {
        item = body[i];
        if (i === __num(len) - 1 || !(!item instanceof Noop)) {
          if (item instanceof BlockExpression) {
            result.push.apply(result, __toArray(item.body));
            if (__num(i) < __num(len) - 1 && result[__num(result.length) - 1] instanceof Noop) {
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
    _superproto = _super.prototype;
    _proto = BlockExpression.prototype = __create(_superproto);
    _proto.constructor = BlockExpression;
    BlockExpression.displayName = "BlockExpression";
    _proto.toStatement = function () {
      return BlockStatement(this.body);
    };
    _proto.compile = function (options, level, lineStart, sb) {
      var _len, _this, i, item, nodes, wrap;
      _this = this;
      if (level === Level.block) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        nodes = (function () {
          var _arr, _arr2, i, len, node;
          for (_arr = [], _arr2 = _this.body, i = 0, len = __num(_arr2.length); i < len; ++i) {
            node = _arr2[i];
            if (!node.isNoop() || i === __num(len) - 1) {
              _arr.push(node);
            }
          }
          return _arr;
        }());
        wrap = !__lte(level, Level.insideParentheses) && __num(nodes.length) > 1;
        if (wrap) {
          sb("(");
        }
        for (i = 0, _len = __num(nodes.length); i < _len; ++i) {
          item = nodes[i];
          if (__num(i) > 0) {
            sb(", ");
          }
          item.compile(options, Level.sequence, false, sb);
        }
        if (wrap) {
          sb(")");
        }
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.body.length) > 4 || (function () {
          var _arr, _i, _len, part;
          for (_arr = _this.body, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.isSmall = function () {
      return false;
    };
    _proto.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, node;
          for (_arr = _this.body, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.walk = BlockStatement.prototype.walk;
    _proto.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "BlockExpression(" + __strnum(inspect(this.body, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
    if (body == void 0) {
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
      for (_i = 0, _len = __num(body.length); _i < _len; ++_i) {
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
  exports.Break = Break = (function (_super) {
    var _proto, _superproto;
    function Break() {
      var _this;
      _this = this instanceof Break ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Break.prototype = __create(_superproto);
    _proto.constructor = Break;
    Break.displayName = "Break";
    _proto.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("break;");
    };
    _proto.walk = function () {
      return this;
    };
    _proto.exitType = function () {
      return "break";
    };
    _proto.inspect = function () {
      return "Break()";
    };
    _proto.toJSON = function () {
      return { type: "Break" };
    };
    Break.fromJSON = function () {
      return Break();
    };
    return Break;
  }(Statement));
  exports.Call = Call = (function (_super) {
    var _proto, _superproto;
    function Call(func, args, isNew) {
      var _i, _len, _this;
      if (func == void 0) {
        func = Noop();
      } else if (!(func instanceof Expression)) {
        throw TypeError("Expected func to be a Expression, got " + __typeof(func));
      }
      if (args == void 0) {
        args = [];
      } else if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = 0, _len = args.length; _i < _len; ++_i) {
          if (!(args[_i] instanceof Expression)) {
            throw TypeError("Expected args[" + _i + "] to be a Expression, got " + __typeof(args[_i]));
          }
        }
      }
      if (isNew == void 0) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      _this = this instanceof Call ? this : __create(_proto);
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Call.prototype = __create(_superproto);
    _proto.constructor = Call;
    Call.displayName = "Call";
    function compileLarge(args, options, level, lineStart, sb) {
      var childOptions, i, item, len;
      sb("(");
      childOptions = incIndent(options);
      for (i = 0, len = __num(args.length); i < len; ++i) {
        item = args[i];
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
      var _len, arg, i;
      sb("(");
      for (i = 0, _len = __num(args.length); i < _len; ++i) {
        arg = args[i];
        if (__num(i) > 0) {
          sb(", ");
        }
        arg.compile(options, Level.sequence, false, sb);
      }
      sb(")");
    }
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.shouldCompileLarge = function () {
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
    _proto.hasLargeArgs = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._hasLargeArgs) == null) {
        return this._hasLargeArgs = __num(this.args.length) > 4 ? true
          : (function () {
            var _arr, _i, _len, arg;
            for (_arr = _this.args, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.isLarge = function () {
      return this.func.isLarge() || this.hasLargeArgs();
    };
    _proto.isSmall = function () {
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
    _proto.walk = function (walker) {
      var _ref, args, func;
      func = (_ref = walker(this.func)) != null ? _ref : this.func.walk(walker);
      args = walkArray(this.args, walker);
      if (this.func !== func || this.args !== args) {
        return Call(func, args, this.isNew);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
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
    _proto.toJSON = function () {
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
        var _arr, _i, _len, item;
        for (_arr = [], _i = 0, _len = __num(value.length); _i < _len; ++_i) {
          item = value[_i];
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
  exports.Const = Const = (function (_super) {
    var _proto, _superproto;
    function Const(value) {
      var _this;
      if (value != void 0 && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string" && !(value instanceof RegExp)) {
        throw TypeError("Expected value to be a undefined or null or Boolean or Number or String or RegExp, got " + __typeof(value));
      }
      _this = this instanceof Const ? this : __create(_proto);
      _this.value = value;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Const.prototype = __create(_superproto);
    _proto.constructor = Const;
    Const.displayName = "Const";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.isConst = function () {
      return true;
    };
    _proto.isNoop = Const.prototype.isConst;
    _proto.constValue = function () {
      return this.value;
    };
    _proto.walk = function () {
      return this;
    };
    _proto.inspect = function () {
      return "Const(" + __strnum(inspect(this.value)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.Continue = Continue = (function (_super) {
    var _proto, _superproto;
    function Continue() {
      var _this;
      _this = this instanceof Continue ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Continue.prototype = __create(_superproto);
    _proto.constructor = Continue;
    Continue.displayName = "Continue";
    _proto.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      return sb("continue;");
    };
    _proto.walk = function () {
      return this;
    };
    _proto.exitType = function () {
      return "continue";
    };
    _proto.inspect = function () {
      return "Continue()";
    };
    _proto.toJSON = function () {
      return { type: "Continue" };
    };
    Continue.fromJSON = function () {
      return Continue();
    };
    return Continue;
  }(Statement));
  exports.Debugger = Debugger = (function (_super) {
    var _proto, _superproto;
    function Debugger() {
      var _this;
      _this = this instanceof Debugger ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Debugger.prototype = __create(_superproto);
    _proto.constructor = Debugger;
    Debugger.displayName = "Debugger";
    _proto.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      return sb("debugger;");
    };
    _proto.walk = function () {
      return this;
    };
    _proto.inspect = function () {
      return "Debugger()";
    };
    _proto.toJSON = function () {
      return { type: "Debugger" };
    };
    Debugger.fromJSON = function () {
      return Debugger();
    };
    return Debugger;
  }(Statement));
  exports.DoWhile = DoWhile = (function (_super) {
    var _proto, _superproto;
    function DoWhile(body, test) {
      var _this;
      if (body == void 0) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (test == void 0) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      _this = this instanceof DoWhile ? this : __create(_proto);
      _this.body = body.maybeToStatement();
      _this.test = test;
      if (test.isConst() && !test.constValue()) {
        return _this.body;
      }
      return _this;
    }
    _superproto = _super.prototype;
    _proto = DoWhile.prototype = __create(_superproto);
    _proto.constructor = DoWhile;
    DoWhile.displayName = "DoWhile";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.walk = function (walker) {
      var _ref, body, test;
      body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
      test = (_ref = walker(this.test)) != null ? _ref : this.test.walk(walker);
      if (body !== this.body || test !== this.test) {
        return DoWhile(body, test);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "DoWhile(" + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.test, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.Eval = Eval = (function (_super) {
    var _proto, _superproto;
    function Eval(code) {
      var _this;
      if (code == void 0) {
        code = Noop();
      }
      _this = this instanceof Eval ? this : __create(_proto);
      if (!(code instanceof Expression)) {
        code = toConst(code);
      }
      _this.code = code;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Eval.prototype = __create(_superproto);
    _proto.constructor = Eval;
    Eval.displayName = "Eval";
    _proto.compile = function (options, level, lineStart, sb) {
      if (this.code instanceof Const) {
        sb(String(this.code.value));
      } else {
        sb("eval(");
        this.code.compile(options, Level.sequence, false, sb);
        sb(")");
      }
    };
    _proto.walk = function (walker) {
      var _ref, code;
      code = (_ref = walker(this.code)) != null ? _ref : this.code.walk(walker);
      if (code !== this.code) {
        return Eval(code);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Eval(" + __strnum(inspect(this.code, null, d)) + ")";
    };
    _proto.toJSON = function () {
      return { type: "Eval", code: simplify(this.code) };
    };
    Eval.fromJSON = function (_p) {
      var code;
      code = _p.code;
      return Eval(fromJSON(code));
    };
    return Eval;
  }(Expression));
  exports.For = For = (function (_super) {
    var _proto, _superproto;
    function For(init, test, step, body) {
      var _this;
      if (init == void 0) {
        init = Noop();
      } else if (!(init instanceof Expression)) {
        throw TypeError("Expected init to be a Expression, got " + __typeof(init));
      }
      if (test == void 0) {
        test = Const(true);
      }
      if (step == void 0) {
        step = Noop();
      } else if (!(step instanceof Expression)) {
        throw TypeError("Expected step to be a Expression, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof For ? this : __create(_proto);
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
    _superproto = _super.prototype;
    _proto = For.prototype = __create(_superproto);
    _proto.constructor = For;
    For.displayName = "For";
    _proto.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("for (");
      if (!this.init.isNoop()) {
        this.init.compile(options, Level.insideParentheses, false, sb);
      }
      sb("; ");
      if (!this.test.isConst() || !this.test.constValue()) {
        this.test.compile(options, Level.insideParentheses, false, sb);
      }
      sb("; ");
      if (!this.step.isNoop()) {
        this.step.compile(options, Level.insideParentheses, false, sb);
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
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "For(" + __strnum(inspect(this.init, null, d)) + ", " + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.step, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.ForIn = ForIn = (function (_super) {
    var _proto, _superproto;
    function ForIn(key, object, body) {
      var _this;
      if (!(key instanceof Ident)) {
        throw TypeError("Expected key to be a Ident, got " + __typeof(key));
      }
      if (object == void 0) {
        object = Noop();
      } else if (!(object instanceof Expression)) {
        throw TypeError("Expected object to be a Expression, got " + __typeof(object));
      }
      if (body == void 0) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof ForIn ? this : __create(_proto);
      _this.key = key;
      _this.object = object;
      _this.body = body.maybeToStatement();
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ForIn.prototype = __create(_superproto);
    _proto.constructor = ForIn;
    ForIn.displayName = "ForIn";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "ForIn(" + __strnum(inspect(this.key, null, d)) + ", " + __strnum(inspect(this.object, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
    var _i, _len, names, param, variable;
    names = [];
    for (_i = 0, _len = __num(params.length); _i < _len; ++_i) {
      param = params[_i];
      if (__in(param.name, names)) {
        throw Error("Duplicate parameter: " + __strnum(param.name));
      }
      names.push(param.name);
    }
    for (_i = 0, _len = __num(variables.length); _i < _len; ++_i) {
      variable = variables[_i];
      if (__in(variable, names)) {
        throw Error("Duplicate variable: " + __strnum(variable));
      }
      names.push(variable);
    }
  }
  function compileFuncBody(options, sb, declarations, variables, body) {
    var _i, _len, declaration, i, variable;
    for (_i = 0, _len = __num(declarations.length); _i < _len; ++_i) {
      declaration = declarations[_i];
      sb.indent(options.indent);
      sb(toJSSource(declaration));
      sb(";\n");
    }
    if (__num(variables.length) > 0) {
      sb.indent(options.indent);
      sb("var ");
      for (i = 0, _len = __num(variables.length); i < _len; ++i) {
        variable = variables[i];
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
    var _len, i, param;
    sb("function ");
    if (name != null) {
      name.compile(sb, Level.insideParentheses, false, sb);
    }
    sb("(");
    for (i = 0, _len = __num(params.length); i < _len; ++i) {
      param = params[i];
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
  exports.Func = Func = (function (_super) {
    var _proto, _superproto, findTypeName, Type;
    function Func(name, params, variables, body, declarations, meta) {
      var _i, _len, _this;
      if (name == void 0) {
        name = null;
      } else if (!(name instanceof Ident)) {
        throw TypeError("Expected name to be a null or Ident, got " + __typeof(name));
      }
      if (params == void 0) {
        params = [];
      } else if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          if (!(params[_i] instanceof Ident)) {
            throw TypeError("Expected params[" + _i + "] to be a Ident, got " + __typeof(params[_i]));
          }
        }
      }
      if (variables == void 0) {
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
      if (body == void 0) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (declarations == void 0) {
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
      _this = this instanceof Func ? this : __create(_proto);
      validateFuncParamsAndVariables(params, variables);
      _this.name = name;
      _this.params = params;
      _this.variables = variables;
      _this.body = body;
      _this.declarations = declarations;
      _this.meta = meta;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Func.prototype = __create(_superproto);
    _proto.constructor = Func;
    Func.displayName = "Func";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.compileAsStatement = function (options, lineStart, sb) {
      this.compile(options, Level.block, lineStart, sb);
      if (!lineStart || !this.name) {
        sb(";");
      }
    };
    _proto.isLarge = function () {
      return true;
    };
    _proto.isNoop = function () {
      return this.name == null;
    };
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Func(" + __strnum(inspect(this.name, null, d)) + ", " + __strnum(inspect(this.params, null, d)) + ", " + __strnum(inspect(this.variables, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.declarations, null, d)) + ", " + __strnum(inspect(this.meta, null, d)) + ")";
    };
    Type = require("./types");
    findTypeName = (function () {
      var names, types;
      types = [];
      names = [];
      return function (type) {
        var index, name, t;
        if (!(type instanceof Type)) {
          return;
        } else {
          index = types.indexOf(type);
          if (index !== -1) {
            return names[index];
          } else {
            for (name in Type) {
              if (__owns(Type, name)) {
                t = Type[name];
                if (t === type) {
                  names.push(name);
                  types.push(type);
                  return name;
                }
              }
            }
            names.push(void 0);
            types.push(type);
            return;
          }
        }
      };
    }());
    _proto.toJSON = function () {
      var _ref;
      return {
        type: "Func",
        name: this.name || void 0,
        params: simplify(this.params),
        variables: simplify(this.variables),
        body: simplify(this.body),
        declarations: simplify(this.declarations),
        metaType: findTypeName((_ref = this.meta) != null ? _ref.asType : void 0)
      };
    };
    Func.fromJSON = function (_p) {
      var body, declarations, meta, metaType, name, params, variables;
      name = _p.name;
      params = _p.params;
      variables = _p.variables;
      body = _p.body;
      declarations = _p.declarations;
      metaType = _p.metaType;
      meta = metaType != null ? { asType: Type[metaType] } : void 0;
      return Func(
        name ? fromJSON(name) : void 0,
        arrayFromJSON(params),
        variables,
        fromJSON(body),
        declarations,
        meta
      );
    };
    return Func;
  }(Expression));
  exports.Ident = Ident = (function (_super) {
    var _proto, _superproto;
    function Ident(name) {
      var _this;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      _this = this instanceof Ident ? this : __create(_proto);
      if (!isAcceptableIdent(name)) {
        throw Error("Not an acceptable identifier name: " + __strnum(name));
      }
      _this.name = name;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Ident.prototype = __create(_superproto);
    _proto.constructor = Ident;
    Ident.displayName = "Ident";
    _proto.compile = function (options, level, lineStart, sb) {
      sb(this.name);
    };
    _proto.walk = function () {
      return this;
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Ident(" + __strnum(inspect(this.name, null, d)) + ")";
    };
    _proto.isNoop = function () {
      return true;
    };
    _proto.toJSON = function () {
      return { type: "Ident", name: this.name };
    };
    Ident.fromJSON = function (_p) {
      var name;
      name = _p.name;
      return Ident(name);
    };
    return Ident;
  }(Expression));
  exports.IfStatement = IfStatement = (function (_super) {
    var _proto, _superproto;
    function IfStatement(test, whenTrue, whenFalse) {
      var _this;
      if (test == void 0) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (whenTrue == void 0) {
        whenTrue = Noop();
      } else if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == void 0) {
        whenFalse = Noop();
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
      }
      _this = this instanceof IfStatement ? this : __create(_proto);
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
    _superproto = _super.prototype;
    _proto = IfStatement.prototype = __create(_superproto);
    _proto.constructor = IfStatement;
    IfStatement.displayName = "IfStatement";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.walk = function (walker) {
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
    _proto.mutateLast = function (func, includeNoop) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.mutateLast(func, includeNoop);
      whenFalse = this.whenFalse.mutateLast(func, includeNoop);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return If(this.test, whenTrue, whenFalse);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      var falseExit, trueExit;
      if (this._exitType === void 0) {
        trueExit = this.whenTrue.exitType();
        falseExit = this.whenFalse.exitType();
        return this._exitType = trueExit === falseExit ? trueExit : null;
      } else {
        return this._exitType;
      }
    };
    _proto.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = this.test.isNoop() && this.whenTrue.isNoop() && this.whenFalse.isNoop();
      } else {
        return _ref;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "IfStatement(" + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.whenTrue, null, d)) + ", " + __strnum(inspect(this.whenFalse, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.IfExpression = IfExpression = (function (_super) {
    var _proto, _superproto;
    function IfExpression(test, whenTrue, whenFalse) {
      var _this;
      if (test == void 0) {
        test = Noop();
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (whenTrue == void 0) {
        whenTrue = Noop();
      }
      if (whenFalse == void 0) {
        whenFalse = Noop();
      }
      _this = this instanceof IfExpression ? this : __create(_proto);
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
    _superproto = _super.prototype;
    _proto = IfExpression.prototype = __create(_superproto);
    _proto.constructor = IfExpression;
    IfExpression.displayName = "IfExpression";
    _proto.toStatement = function () {
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
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.isLarge = function () {
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
    _proto.isSmall = function () {
      return false;
    };
    _proto.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = this.test.isNoop() && this.whenTrue.isNoop() && this.whenFalse.isNoop();
      } else {
        return _ref;
      }
    };
    _proto.walk = IfStatement.prototype.walk;
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "IfExpression(" + __strnum(inspect(this.test, null, d)) + ", " + __strnum(inspect(this.whenTrue, null, d)) + ", " + __strnum(inspect(this.whenFalse, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.Noop = Noop = (function (_super) {
    var _proto, _superproto;
    function Noop() {
      var _this;
      _this = this instanceof Noop ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Noop.prototype = __create(_superproto);
    _proto.constructor = Noop;
    Noop.displayName = "Noop";
    _proto.compileAsStatement = function () {};
    _proto.compile = function (options, level, lineStart, sb) {
      if (!__lte(level, Level.block)) {
        Const(void 0).compile(options, level, lineStart, sb);
      }
    };
    _proto.isConst = function () {
      return true;
    };
    _proto.isNoop = Noop.prototype.isConst;
    _proto.constValue = function () {
      return;
    };
    _proto.walk = function () {
      return this;
    };
    _proto.mutateLast = function (func, includeNoop) {
      if (includeNoop) {
        return func(this);
      } else {
        return this;
      }
    };
    _proto.inspect = function () {
      return "Noop()";
    };
    _proto.toJSON = function () {
      return { type: "Noop" };
    };
    Noop.fromJSON = function () {
      return Noop();
    };
    return Noop;
  }(Expression));
  exports.Obj = Obj = (function (_super) {
    var _proto, _superproto, ObjPair;
    function Obj(elements) {
      var _i, _len, _this;
      if (elements == void 0) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof ObjPair)) {
            throw TypeError("Expected elements[" + _i + "] to be a ObjPair, got " + __typeof(elements[_i]));
          }
        }
      }
      _this = this instanceof Obj ? this : __create(_proto);
      validateUniqueKeys(elements);
      _this.elements = elements;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Obj.prototype = __create(_superproto);
    _proto.constructor = Obj;
    Obj.displayName = "Obj";
    function validateUniqueKeys(elements) {
      var _i, _len, key, keys, pair;
      keys = [];
      for (_i = 0, _len = __num(elements.length); _i < _len; ++_i) {
        pair = elements[_i];
        key = pair.key;
        if (__in(key, keys)) {
          throw Error("Found duplicate key: " + __strnum(toJSSource(key)));
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
      var childOptions, element, i, key, len;
      childOptions = incIndent(options);
      for (i = 0, len = __num(elements.length); i < len; ++i) {
        element = elements[i];
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
      var _len, element, i, key;
      if (elements.length) {
        sb(" ");
        for (i = 0, _len = __num(elements.length); i < _len; ++i) {
          element = elements[i];
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
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.compileAsStatement = function (options, lineStart, sb) {
      var _this;
      _this = this;
      BlockStatement((function () {
        var _arr, _arr2, _i, _len, element;
        for (_arr = [], _arr2 = _this.elements, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
          element = _arr2[_i];
          _arr.push(element.value);
        }
        return _arr;
      }())).compile(options, lineStart, sb);
    };
    _proto.shouldCompileLarge = function () {
      switch (this.elements.length) {
      case 0:
        return false;
      case 1:
        return this.elements[0].isLarge();
      default:
        return this.isLarge();
      }
    };
    _proto.isSmall = function () {
      switch (this.elements.length) {
      case 0:
        return true;
      case 1:
        return this.elements[0].isSmall();
      default:
        return false;
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.isNoop = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (elements !== this.elements) {
        return Obj(elements);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Obj(" + __strnum(inspect(this.elements, null, d)) + ")";
    };
    _proto.toJSON = function () {
      var _this;
      _this = this;
      return {
        type: "Obj",
        pairs: simplify((function () {
          var _arr, _arr2, _i, _len, pair;
          for (_arr = [], _arr2 = _this.pairs, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
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
      for (_arr = pairs || [], _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        pair = _arr[_i];
        if (!pair || typeof pair !== "object") {
          throw Error("Expecting an object with a key and value");
        }
        resultPairs.push(ObjPair(pair.key, fromJSON(pair.value)));
      }
      return Obj(resultPairs);
    };
    Obj.Pair = ObjPair = (function () {
      var _proto2;
      function ObjPair(key, value) {
        var _this;
        if (typeof key !== "string") {
          throw TypeError("Expected key to be a String, got " + __typeof(key));
        }
        if (value == void 0) {
          value = Noop();
        }
        _this = this instanceof ObjPair ? this : __create(_proto2);
        if (!(value instanceof Expression)) {
          value = toConst(value);
        }
        _this.key = key;
        _this.value = value;
        return _this;
      }
      _proto2 = ObjPair.prototype;
      ObjPair.displayName = "ObjPair";
      _proto2.isSmall = function () {
        return this.value.isSmall();
      };
      _proto2.isLarge = function () {
        return this.value.isLarge();
      };
      _proto2.isNoop = function () {
        return this.value.isNoop();
      };
      _proto2.walk = function (walker) {
        var _ref, value;
        value = (_ref = walker(this.value)) != null ? _ref : this.value.walk(walker);
        if (value !== this.value) {
          return ObjPair(this.key, value);
        } else {
          return this;
        }
      };
      _proto2.inspect = function (depth) {
        var d;
        d = decDepth(depth);
        return "Pair(" + __strnum(inspect(this.key, null, d)) + ", " + __strnum(inspect(this.value, null, d)) + ")";
      };
      return ObjPair;
    }());
    return Obj;
  }(Expression));
  exports.Return = Return = (function (_super) {
    var _proto, _superproto;
    function Return(node) {
      var _this;
      if (node == void 0) {
        node = Noop();
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a Expression, got " + __typeof(node));
      }
      _this = this instanceof Return ? this : __create(_proto);
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Return);
      }
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Return.prototype = __create(_superproto);
    _proto.constructor = Return;
    Return.displayName = "Return";
    _proto.compile = function (options, level, lineStart, sb) {
      sb("return");
      if (!this.node.isConst() || this.node.constValue() !== void 0) {
        sb(" ");
        this.node.compile(options, Level.insideParentheses, false, sb);
      }
      sb(";");
    };
    _proto.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Return(node);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return "return";
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Return(" + __strnum(inspect(this.node, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
    var _proto;
    function Root(body, variables, declarations) {
      var _i, _len, _this;
      if (body == void 0) {
        body = Noop();
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (variables == void 0) {
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
      if (declarations == void 0) {
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
      _this = this instanceof Root ? this : __create(_proto);
      validateFuncParamsAndVariables([], variables);
      _this.body = body;
      _this.variables = variables;
      _this.declarations = declarations;
      return _this;
    }
    _proto = Root.prototype;
    Root.displayName = "Root";
    _proto.compile = function (options) {
      var sb;
      if (options == void 0) {
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
    _proto.toString = function () {
      return this.compile();
    };
    _proto.toFunction = Node.prototype.toFunction;
    _proto.isLarge = function () {
      return true;
    };
    _proto.walk = function (walker) {
      var body;
      body = this.body.walk(walker);
      if (body !== this.body) {
        return Root(body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _proto.mutateLast = function (func, includeNoop) {
      var body;
      body = this.body.mutateLast(func, includeNoop);
      if (body !== this.body) {
        return Root(body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return this.last().exitType();
    };
    _proto.last = function () {
      return this.body[__num(this.body.length) - 1];
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Root(" + __strnum(inspect(this.body, null, d)) + ", " + __strnum(inspect(this.variables, null, d)) + ", " + __strnum(inspect(this.declarations, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.This = This = (function (_super) {
    var _proto, _superproto;
    function This() {
      var _this;
      _this = this instanceof This ? this : __create(_proto);
      return _this;
    }
    _superproto = _super.prototype;
    _proto = This.prototype = __create(_superproto);
    _proto.constructor = This;
    This.displayName = "This";
    _proto.compile = function (options, level, lineStart, sb) {
      sb("this");
    };
    _proto.isNoop = function () {
      return true;
    };
    _proto.walk = function () {
      return this;
    };
    _proto.inspect = function () {
      return "This()";
    };
    _proto.toJSON = function () {
      return { type: "This" };
    };
    This.fromJSON = function () {
      return This();
    };
    return This;
  }(Expression));
  exports.Throw = Throw = (function (_super) {
    var _proto, _superproto;
    function Throw(node) {
      var _this;
      if (node == void 0) {
        node = Noop();
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a Expression, got " + __typeof(node));
      }
      _this = this instanceof Throw ? this : __create(_proto);
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Throw, true);
      }
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Throw.prototype = __create(_superproto);
    _proto.constructor = Throw;
    Throw.displayName = "Throw";
    _proto.compile = function (options, level, lineStart, sb) {
      sb("throw ");
      this.node.compile(options, Level.insideParentheses, false, sb);
      return sb(";");
    };
    _proto.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Throw(node);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return "throw";
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Throw(" + __strnum(inspect(this.node, null, d)) + ")";
    };
    _proto.toJSON = function () {
      return { type: "Throw", node: simplify(this.node) };
    };
    Throw.fromJSON = function (_p) {
      var node;
      node = _p.node;
      return Throw(fromJSON(node));
    };
    return Throw;
  }(Statement));
  exports.Switch = Switch = (function (_super) {
    var _proto, _superproto, SwitchCase;
    function Switch(node, cases, defaultCase) {
      var _i, _len, _this;
      if (node == void 0) {
        node = Noop();
      }
      if (cases == void 0) {
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
      if (defaultCase == void 0) {
        defaultCase = Noop();
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node, got " + __typeof(defaultCase));
      }
      _this = this instanceof Switch ? this : __create(_proto);
      if (!(node instanceof Expression)) {
        node = toConst(node);
      }
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase.maybeToStatement();
      return _this;
    }
    _superproto = _super.prototype;
    _proto = Switch.prototype = __create(_superproto);
    _proto.constructor = Switch;
    Switch.displayName = "Switch";
    _proto.compile = function (options, level, lineStart, sb) {
      var _arr, _i, _len, case_, childOptions;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      sb("switch (");
      this.node.compile(options, Level.insideParentheses, false, sb);
      sb(") {");
      childOptions = incIndent(options);
      for (_arr = this.cases, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Switch(" + __strnum(inspect(this.node, null, d)) + ", " + __strnum(inspect(this.cases, null, d)) + ", " + __strnum(inspect(this.defaultCase, null, d)) + ")";
    };
    _proto.toJSON = function () {
      var _this;
      _this = this;
      return {
        type: "Switch",
        node: simplify(node),
        cases: simplify((function () {
          var _arr, _arr2, _i, _len, case_;
          for (_arr = [], _arr2 = _this.cases, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
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
      for (_arr = cases || [], _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        case_ = _arr[_i];
        if (!case_ || typeof case_ !== "object") {
          throw Error("Expected an object with a node and body");
        }
        resultCases.push(SwitchCase(fromJSON(case_.node), fromJSON(case_.body)));
      }
      return Switch(fromJSON(node), resultCases, fromJSON(defaultCase));
    };
    Switch.Case = SwitchCase = (function () {
      var _proto2;
      function SwitchCase(node, body) {
        var _this;
        if (node == void 0) {
          node = Noop();
        }
        if (body == void 0) {
          body = Noop();
        } else if (!(body instanceof Node)) {
          throw TypeError("Expected body to be a Node, got " + __typeof(body));
        }
        _this = this instanceof SwitchCase ? this : __create(_proto2);
        if (!(node instanceof Expression)) {
          node = toConst(node);
        }
        _this.node = node;
        _this.body = body.maybeToStatement();
        return _this;
      }
      _proto2 = SwitchCase.prototype;
      SwitchCase.displayName = "SwitchCase";
      _proto2.isLarge = function () {
        return true;
      };
      _proto2.isSmall = function () {
        return false;
      };
      _proto2.walk = function (walker) {
        var _ref, body, node;
        node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
        body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
        if (node !== this.node || body !== this.body) {
          return SwitchCase(node, body);
        } else {
          return this;
        }
      };
      _proto2.inspect = function (depth) {
        var d;
        d = decDepth(depth);
        return "Case(" + __strnum(inspect(this.node, null, d)) + ", " + __strnum(inspect(this.body, null, d)) + ")";
      };
      return SwitchCase;
    }());
    return Switch;
  }(Statement));
  exports.TryCatch = TryCatch = (function (_super) {
    var _proto, _superproto;
    function TryCatch(tryBody, catchIdent, catchBody) {
      var _this;
      if (tryBody == void 0) {
        tryBody = Noop();
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Ident)) {
        throw TypeError("Expected catchIdent to be a Ident, got " + __typeof(catchIdent));
      }
      if (catchBody == void 0) {
        catchBody = Noop();
      } else if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      _this = this instanceof TryCatch ? this : __create(_proto);
      _this.tryBody = tryBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.tryBody;
      }
      _this.catchIdent = catchIdent;
      _this.catchBody = catchBody.maybeToStatement();
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TryCatch.prototype = __create(_superproto);
    _proto.constructor = TryCatch;
    TryCatch.displayName = "TryCatch";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.walk = function (walker) {
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
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "TryCatch(" + __strnum(inspect(this.tryBody, null, d)) + ", " + __strnum(inspect(this.catchIdent, null, d)) + ", " + __strnum(inspect(this.catchBody, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.TryFinally = TryFinally = (function (_super) {
    var _proto, _superproto;
    function TryFinally(tryBody, finallyBody) {
      var _this;
      if (tryBody == void 0) {
        tryBody = Noop();
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (finallyBody == void 0) {
        finallyBody = Noop();
      } else if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      _this = this instanceof TryFinally ? this : __create(_proto);
      _this.tryBody = tryBody.maybeToStatement();
      _this.finallyBody = finallyBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.finallyBody;
      } else if (_this.finallyBody.isNoop()) {
        return _this.tryBody;
      }
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TryFinally.prototype = __create(_superproto);
    _proto.constructor = TryFinally;
    TryFinally.displayName = "TryFinally";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.walk = function (walker) {
      var _ref, finallyBody, tryBody;
      tryBody = (_ref = walker(this.tryBody)) != null ? _ref : this.tryBody.walk(walker);
      finallyBody = (_ref = walker(this.finallyBody)) != null ? _ref : this.finallyBody.walk(walker);
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
        return TryFinally(tryBody, finallyBody);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Root(" + __strnum(inspect(this.tryBody, null, d)) + ", " + __strnum(inspect(this.finallyBody, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
  exports.Unary = Unary = (function (_super) {
    var _proto, _superproto, ASSIGNMENT_OPERATORS, KNOWN_OPERATORS;
    function Unary(op, node) {
      var _this;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (node == void 0) {
        node = Noop();
      }
      _this = this instanceof Unary ? this : __create(_proto);
      if (!__in(op, KNOWN_OPERATORS)) {
        throw Error("Unknown unary operator: " + __strnum(op));
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
    _superproto = _super.prototype;
    _proto = Unary.prototype = __create(_superproto);
    _proto.constructor = Unary;
    Unary.displayName = "Unary";
    _proto.compile = function (options, level, lineStart, sb) {
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
    _proto.compileAsStatement = function (options, lineStart, sb) {
      var op;
      op = this.op;
      if (__owns(ASSIGNMENT_OPERATORS, op)) {
        _superproto.compileAsStatement.call(this, options, lineStart, sb);
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
    _proto.isLarge = function () {
      return this.node.isLarge();
    };
    _proto.isSmall = function () {
      return this.node.isSmall();
    };
    _proto.isNoop = function () {
      var _ref;
      if ((_ref = this._isNoop) == null) {
        return this._isNoop = !__owns(ASSIGNMENT_OPERATORS, this.op) && this.node.isNoop();
      } else {
        return _ref;
      }
    };
    _proto.walk = function (walker) {
      var _ref, node;
      node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
      if (node !== this.node) {
        return Unary(this.op, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      var d;
      d = decDepth(depth);
      return "Unary(" + __strnum(inspect(this.op, null, d)) + ", " + __strnum(inspect(this.node, null, d)) + ")";
    };
    _proto.toJSON = function () {
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
        var _arr, _i, _len, item;
        for (_arr = [], _i = 0, _len = __num(array.length); _i < _len; ++_i) {
          item = array[_i];
          _arr.push(fromJSON(item));
        }
        return _arr;
      }());
    } else {
      throw Error("Expected an array, got " + __typeof(array));
    }
  }
}.call(this));
