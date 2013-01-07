(function () {
  "use strict";
  var __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, Arguments, Arr, Binary, Block, BlockExpression, BlockStatement, Break, Call, Const, Continue, Debugger, DoWhile, Eval, Expression, For, ForIn, Func, Ident, If, IfExpression, IfStatement, INDENT, isAcceptableIdent, Level, Node, Noop, Obj, Return, Root, Statement, Switch, This, Throw, toJSSourceTypes, TryCatch, TryFinally, types, Unary, While;
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
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
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
  types = require("./types");
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
    this.call = 18;
    this.access = 19;
    return this;
  }.call({}));
  INDENT = "  ";
  function incIndent(options) {
    var clone;
    clone = __create(options);
    clone.indent = __num(clone.indent) + 1;
    return clone;
  }
  function StringBuilder() {
    var data;
    data = [];
    function sb(item) {
      data.push(item);
    }
    sb.indent = function (count) {
      var i;
      for (i = 0, __num(count); i < count; ++i) {
        data.push(INDENT);
      }
    };
    sb.toString = function () {
      var len, text;
      len = data.length;
      if (len === 0) {
        return "";
      } else if (len === 1) {
        return data[0];
      } else {
        text = data.join("");
        data.splice(0, len, text);
        return text;
      }
    };
    return sb;
  }
  function escapeUnicodeHelper(m) {
    var len, num;
    num = m.charCodeAt(0).toString(16);
    len = num.length;
    if (len === 1) {
      return "\\u000" + __strnum(num);
    } else if (len === 2) {
      return "\\u00" + __strnum(num);
    } else if (len === 3) {
      return "\\u0" + __strnum(num);
    } else if (len === 4) {
      return "\\u" + __strnum(num);
    } else {
      throw Error();
    }
  }
  function escapeUnicode(text) {
    return text.replace(/[\u0000-\u001f\u0080-\uffff]/g, escapeUnicodeHelper);
  }
  toJSSourceTypes = {
    "undefined": function () {
      return "void 0";
    },
    number: function (value) {
      if (isFinite(value)) {
        return JSON.stringify(value);
      } else if (isNaN(value)) {
        return "0/0";
      } else if (!__lte(value, 0)) {
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
    var f;
    f = toJSSourceTypes[typeof value];
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
    _proto = Node.prototype;
    Node.displayName = "Node";
    function Node() {
      var _this;
      if (this instanceof Node) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      throw Error("Node cannot be instantiated directly");
    }
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
    return Node;
  }());
  exports.Expression = Expression = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Expression.prototype = __create(_superproto);
    _proto.constructor = Expression;
    Expression.displayName = "Expression";
    function Expression() {
      var _this;
      if (this instanceof Expression) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      throw Error("Expression cannot be instantiated directly");
    }
    _proto.toString = function () {
      return __strnum(_superproto.toString.call(this)) + ";";
    };
    _proto.compileAsStatement = function (options, lineStart, sb) {
      if (typeof this.toStatement === "function") {
        this.toStatement().compileAsStatement(options, lineStart, sb);
      } else {
        this.compile(options, Level.block, lineStart, sb);
        sb(";");
      }
    };
    _proto.type = function () {
      return types.any;
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
    _superproto = _super.prototype;
    _proto = Statement.prototype = __create(_superproto);
    _proto.constructor = Statement;
    Statement.displayName = "Statement";
    function Statement() {
      var _this;
      if (this instanceof Statement) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      throw Error("Expression cannot be instantiated directly");
    }
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
    _superproto = _super.prototype;
    _proto = Arguments.prototype = __create(_superproto);
    _proto.constructor = Arguments;
    Arguments.displayName = "Arguments";
    function Arguments() {
      var _this;
      if (this instanceof Arguments) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      sb("arguments");
    };
    _proto.type = function () {
      return types.args;
    };
    _proto.walk = function () {
      return this;
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
  exports.Arr = Arr = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Arr.prototype = __create(_superproto);
    _proto.constructor = Arr;
    Arr.displayName = "Arr";
    function Arr(elements) {
      var _i, _len, _this;
      if (elements == null) {
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
      if (this instanceof Arr) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.elements = elements;
      return _this;
    }
    function compileLarge(elements, options, level, lineStart, sb) {
      var childOptions, i, item, len;
      childOptions = incIndent(options);
      for (i = 0, len = __num(elements.length); i < len; ++i) {
        item = elements[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, Level.sequence, false, sb);
        if (__lt(i, __num(len) - 1)) {
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
          if (!__lte(i, 0)) {
            sb(", ");
          }
          item.compile(options, Level.sequence, false, sb);
        }
      }
    }
    _proto.compile = function (options, level, lineStart, sb) {
      var f;
      sb("[");
      if (this.shouldCompileLarge()) {
        f = compileLarge;
      } else {
        f = compileSmall;
      }
      f(
        this.elements,
        options,
        level,
        lineStart,
        sb
      );
      sb("]");
    };
    _proto.type = function () {
      return types.array;
    };
    _proto.shouldCompileLarge = function () {
      var len;
      len = this.elements.length;
      if (len === 0) {
        return false;
      } else if (len === 1) {
        return this.elements[0].isLarge();
      } else {
        return this.isLarge();
      }
    };
    _proto.isSmall = function () {
      var len;
      len = this.elements.length;
      if (len === 0) {
        return true;
      } else if (len === 1) {
        return this.elements[0].isSmall();
      } else {
        return false;
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) != null) {
        return _ref;
      } else {
        return this._isLarge = !__lte(this.elements.length, 4) || (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isSmall()) {
              return true;
            }
          }
          return false;
        }());
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
    return Arr;
  }(Expression));
  exports.Assign = function (left, right) {
    return Binary(left, "=", right);
  };
  exports.Concat = function () {
    var _i, _len, arg, args, current;
    args = __slice(arguments);
    current = Const("");
    for (_i = 0, _len = __num(args.length); _i < _len; ++_i) {
      arg = args[_i];
      current = Binary(current, "+", arg);
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
    var _o, _proto, _superproto, ASSIGNMENT_OPS, CONST_OPERATIONS, LEFT_CONSTANT_OPERATIONS, LEVEL_TO_ASSOCIATIVITY, OPERATOR_PRECEDENCE, OPERATOR_TYPES, RIGHT_CONSTANT_OPERATIONS;
    _superproto = _super.prototype;
    _proto = Binary.prototype = __create(_superproto);
    _proto.constructor = Binary;
    Binary.displayName = "Binary";
    function Binary(left, op, right) {
      var _ref, _this, node;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (this instanceof Binary) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (!__owns(OPERATOR_PRECEDENCE, op)) {
        throw Error("Unknown binary operator: " + __strnum(JSON.stringify(op)));
      }
      if (!(left instanceof Expression)) {
        left = toConst(left);
      }
      if (!(right instanceof Expression)) {
        right = toConst(right);
      }
      if (__owns(CONST_OPERATIONS, op) && left.isConst() && right.isConst()) {
        node = CONST_OPERATIONS[op](left.constValue(), right.constValue());
        if (node !== void 0) {
          if (node instanceof Expression) {
            return node;
          } else {
            return Const(node);
          }
        }
      }
      if (__owns(LEFT_CONSTANT_OPERATIONS, op) && left.isConst()) {
        if ((_ref = LEFT_CONSTANT_OPERATIONS[op](left, right)) != null) {
          return _ref;
        }
      }
      if (__owns(RIGHT_CONSTANT_OPERATIONS, op) && right.isConst()) {
        if ((_ref = RIGHT_CONSTANT_OPERATIONS[op](left, right)) != null) {
          return _ref;
        }
      }
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    function compileAccess(op, left, right, options, level, lineStart, sb) {
      var dotAccess, stringLeft;
      dotAccess = right instanceof Const && typeof right.value === "string" && isAcceptableIdent(right.value);
      if (left instanceof Const && typeof left.value === "number") {
        stringLeft = toJSSource(left.value);
        if (__lt(left.value, 0) || !isFinite(left.value)) {
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
        left.compile(options, Level.access, lineStart, sb);
      }
      if (dotAccess) {
        sb(".");
        sb(right.value);
      } else {
        sb("[");
        right.compile(options, Level.insideParentheses, false, sb);
        sb("]");
      }
    }
    function compileOther(op, left, right, options, level, lineStart, sb) {
      var associativity, opLevel, wrap;
      opLevel = OPERATOR_PRECEDENCE[op];
      associativity = LEVEL_TO_ASSOCIATIVITY[opLevel];
      if (associativity === "paren") {
        wrap = !__lt(level, opLevel);
      } else {
        wrap = !__lte(level, opLevel);
      }
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
      if (this.op === ".") {
        f = compileAccess;
      } else {
        f = compileOther;
      }
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
      if (__owns(ASSIGNMENT_OPS, op) && left instanceof Ident && typeof this.right.toStatement === "function") {
        this.right.toStatement().mutateLast(
          function (node) {
            return Binary(left, op, node);
          },
          true
        ).compileAsStatement(options, lineStart, sb);
      } else {
        _superproto.compileAsStatement.call(this, options, lineStart, sb);
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
    OPERATOR_TYPES = {
      ".": types.any,
      "*": types.number,
      "/": types.number,
      "%": types.number,
      "+": function (left, right) {
        if (left.isSubsetOf(types.number) && right.isSubsetOf(types.number)) {
          return types.number;
        } else if (left.overlaps(types.number) && right.overlaps(types.number)) {
          return types.stringOrNumber;
        } else {
          return types.string;
        }
      },
      "-": types.number,
      "<<": types.number,
      ">>": types.number,
      ">>>": types.number,
      "<": types.boolean,
      "<=": types.boolean,
      ">": types.boolean,
      ">=": types.boolean,
      "in": types.boolean,
      "instanceof": types.boolean,
      "==": types.boolean,
      "!=": types.boolean,
      "===": types.boolean,
      "!==": types.boolean,
      "&": types.number,
      "^": types.number,
      "|": types.number,
      "&&": function (left, right) {
        return left.intersect(types.potentiallyFalsy).union(right);
      },
      "||": function (left, right) {
        return left.intersect(types.potentiallyTruthy).union(right);
      },
      "=": function (left, right) {
        return right;
      },
      "+=": function (left, right) {
        return OPERATOR_TYPES["+"](left, right);
      },
      "-=": types.number,
      "*=": types.number,
      "/=": types.number,
      "%=": types.number,
      "<<=": types.number,
      ">>=": types.number,
      ">>>=": types.number,
      "&=": types.number,
      "^=": types.number,
      "|=": types.number
    };
    _proto.type = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) != null) {
        return _ref;
      } else {
        return this._type = (function () {
          var handler;
          handler = OPERATOR_TYPES[_this.op];
          if (typeof handler === "function") {
            return handler(_this.left.type(), _this.right.type());
          } else {
            return handler;
          }
        }());
      }
    };
    CONST_OPERATIONS = {
      "*": function (x, y) {
        return x * y;
      },
      "/": function (x, y) {
        return x / y;
      },
      "%": function (x, y) {
        return x % y;
      },
      "+": function (x, y) {
        if (typeof x === "number" && typeof y === "number") {
          return +x + +y;
        } else {
          return "" + x + y;
        }
      },
      "-": function (x, y) {
        return x - y;
      },
      "<<": function (x, y) {
        return x << y;
      },
      ">>": function (x, y) {
        return x >> y;
      },
      ">>>": function (x, y) {
        return x >>> y;
      },
      "<": function (x, y) {
        return x < y;
      },
      "<=": function (x, y) {
        return x <= y;
      },
      ">": function (x, y) {
        return x > y;
      },
      ">=": function (x, y) {
        return x >= y;
      },
      "===": function (x, y) {
        return x === y;
      },
      "!==": function (x, y) {
        return x !== y;
      },
      "==": function (x, y) {
        return x == y;
      },
      "!=": function (x, y) {
        return x != y;
      },
      "&": function (x, y) {
        return x & y;
      },
      "^": function (x, y) {
        return x ^ y;
      },
      "|": function (x, y) {
        return x | y;
      },
      "&&": function (x, y) {
        return x && y;
      },
      "||": function (x, y) {
        return x || y;
      },
      ".": function (x, y) {
        if (y in Object(x) && typeof x[y] !== "function") {
          return toConst(x[y]);
        }
      }
    };
    LEFT_CONSTANT_OPERATIONS = {
      "&&": function (x, y) {
        if (x.constValue()) {
          return y;
        } else {
          return x;
        }
      },
      "||": function (x, y) {
        if (x.constValue()) {
          return x;
        } else {
          return y;
        }
      },
      "*": function (x, y) {
        if (x.constValue() === 1) {
          return Unary("+", y);
        } else if (x.constValue() === -1) {
          return Unary("-", y);
        }
      },
      "+": function (x, y) {
        if (x.constValue() === 0) {
          return Unary("+", y);
        } else if (x.constValue() === "" && y.type().isSubsetOf(types.string)) {
          return y;
        }
      },
      "-": function (x, y) {
        if (x.constValue() === 0) {
          return Unary("-", y);
        }
      }
    };
    RIGHT_CONSTANT_OPERATIONS = {
      "*": function (x, y) {
        if (y.constValue() === 1) {
          return Unary("+", x);
        } else if (y.constValue() === -1) {
          return Unary("-", x);
        }
      },
      "/": function (x, y) {
        if (y.constValue() === 1) {
          return Unary("+", x);
        } else if (y.constValue() === -1) {
          return Unary("-", x);
        }
      },
      "+": function (x, y) {
        var yValue;
        yValue = y.constValue();
        if (yValue === 0) {
          return Unary("+", x);
        } else if (typeof yValue === "number" && __lt(yValue, 0)) {
          return Binary(x, "-", Const(-__num(yValue)));
        } else if (yValue === "" && x.type().isSubsetOf(types.string)) {
          return x;
        }
      },
      "-": function (x, y) {
        var yValue;
        yValue = y.constValue();
        if (yValue === 0) {
          return Unary("+", x);
        } else if (typeof yValue === "number" && __lt(yValue, 0)) {
          return Binary(x, "+", Const(-__num(yValue)));
        }
      }
    };
    OPERATOR_PRECEDENCE = {
      ".": Level.access,
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
    _o = {};
    _o[Level.equality] = "paren";
    _o[Level.relational] = "paren";
    _o[Level.addition] = "left";
    _o[Level.multiplication] = "left";
    _o[Level.bitwiseAnd] = "none";
    _o[Level.bitwiseOr] = "none";
    _o[Level.bitwiseXor] = "none";
    _o[Level.bitwiseShift] = "left";
    _o[Level.assignment] = "right";
    LEVEL_TO_ASSOCIATIVITY = _o;
    _proto.isLarge = function () {
      var _ref;
      if ((_ref = this._isLarge) != null) {
        return _ref;
      } else {
        return this._isLarge = !this.left.isSmall() || !this.right.isSmall();
      }
    };
    _proto.isSmall = function () {
      var _ref;
      if ((_ref = this._isSmall) != null) {
        return _ref;
      } else {
        return this._isSmall = this.left.isSmall() && this.right.isSmall();
      }
    };
    _proto.walk = function (walker) {
      var _ref, changed, left, right;
      changed = false;
      if ((_ref = walker(this.left)) != null) {
        left = _ref;
      } else {
        left = this.left.walk(walker);
      }
      if ((_ref = walker(this.right)) != null) {
        right = _ref;
      } else {
        right = this.right.walk(walker);
      }
      if (this.left !== left || this.right !== right) {
        return Binary(left, this.op, right);
      } else {
        return this;
      }
    };
    return Binary;
  }(Expression));
  exports.BlockStatement = BlockStatement = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = BlockStatement.prototype = __create(_superproto);
    _proto.constructor = BlockStatement;
    BlockStatement.displayName = "BlockStatement";
    function BlockStatement(body) {
      var _i, _i2, _len, _len2, _this, item, result, statement;
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
      if (this instanceof BlockStatement) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      result = [];
      for (_i2 = 0, _len2 = __num(body.length); _i2 < _len2; ++_i2) {
        item = body[_i2];
        statement = item.maybeToStatement();
        if (!statement.isNoop()) {
          if (statement instanceof BlockStatement) {
            result.push.apply(result, __toArray(statement.body));
          } else {
            result.push(statement);
          }
          if (statement.exitType() != null) {
            break;
          }
        }
      }
      if (result.length === 0) {
        return Noop();
      } else if (result.length === 1) {
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      var _arr, _len, i, item;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      for (_arr = this.body, i = 0, _len = __num(_arr.length); i < _len; ++i) {
        item = _arr[i];
        if (!__lte(i, 0)) {
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
      body = this.body;
      last = body[__num(body.length) - 1];
      newLast = last.mutateLast(func, includeNoop);
      if (last !== newLast) {
        body = __slice(body, void 0, __num(body.length) - 1);
        body.push(newLast);
        return Block(body);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return this.body[__num(this.body.length) - 1].exitType();
    };
    return BlockStatement;
  }(Statement));
  exports.BlockExpression = BlockExpression = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = BlockExpression.prototype = __create(_superproto);
    _proto.constructor = BlockExpression;
    BlockExpression.displayName = "BlockExpression";
    function BlockExpression(body) {
      var _i, _len, _this, i, item, len, result;
      if (body == null) {
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
      if (this instanceof BlockExpression) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      result = [];
      result = [];
      for (i = 0, len = __num(body.length); i < len; ++i) {
        item = body[i];
        if (i === __num(len) - 1 || !item.isNoop()) {
          if (item instanceof BlockExpression) {
            result.push.apply(result, __toArray(item.body));
            if (__lt(i, __num(len) - 1) && result[__num(result.length) - 1].isNoop()) {
              result.pop();
            }
          } else if (!(item instanceof Noop)) {
            result.push(item);
          }
        }
      }
      if (result.length === 0) {
        return Noop();
      } else if (result.length === 1) {
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _proto.toStatement = function () {
      return BlockStatement(this.body);
    };
    _proto.compile = function (options, level, lineStart, sb) {
      var _len, body, i, item, len, wrap;
      if (level === Level.block) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        body = this.body;
        len = body.length;
        if (len === 0) {
          Const(void 0).compile(options, level, lineStart, sb);
        } else if (len === 1) {
          body[0].compile(options, level, lineStart, sb);
        } else {
          wrap = !__lte(level, Level.insideParentheses);
          if (wrap) {
            sb("(");
          }
          for (i = 0, _len = __num(body.length); i < _len; ++i) {
            item = body[i];
            if (!__lte(i, 0)) {
              sb(", ");
            }
            item.compile(options, Level.sequence, false, sb);
          }
          if (wrap) {
            sb(")");
          }
        }
      }
    };
    _proto.type = function () {
      var body;
      body = this.body;
      if (body.length === 0) {
        return types["undefined"];
      } else {
        return body[__num(body.length) - 1].type();
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) != null) {
        return _ref;
      } else {
        return this._isLarge = !__lte(this.body.length, 4) || (function () {
          var _arr, _i, _len, part;
          for (_arr = _this.body, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            part = _arr[_i];
            if (part.isLarge()) {
              return true;
            }
          }
          return false;
        }());
      }
    };
    _proto.isSmall = function () {
      return false;
    };
    _proto.walk = BlockStatement.prototype.walk;
    return BlockExpression;
  }(Expression));
  Block = exports.Block = function (body) {
    var _i, _len, allExpressions;
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
    } else {
      allExpressions = (function () {
        var _i2, _len2, item;
        for (_i2 = 0, _len2 = __num(body.length); _i2 < _len2; ++_i2) {
          item = body[_i2];
          if (!(item instanceof Expression)) {
            return false;
          }
        }
        return true;
      }());
      if (allExpressions) {
        return BlockExpression(body);
      } else {
        return BlockStatement(body);
      }
    }
  };
  exports.Break = Break = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Break.prototype = __create(_superproto);
    _proto.constructor = Break;
    Break.displayName = "Break";
    function Break() {
      var _this;
      if (this instanceof Break) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
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
    return Break;
  }(Statement));
  exports.Call = Call = (function (_super) {
    var _proto, _superproto, HELPER_TYPES, PURE_PRIMORDIAL_FUNCTIONS;
    _superproto = _super.prototype;
    _proto = Call.prototype = __create(_superproto);
    _proto.constructor = Call;
    Call.displayName = "Call";
    function Call(func, args, isNew) {
      var _i, _len, _ref, _this;
      _this = this;
      if (!(func instanceof Expression)) {
        throw TypeError("Expected func to be a Expression, got " + __typeof(func));
      }
      if (args == null) {
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
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (this instanceof Call) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (!isNew && (function () {
        var _i2, _len2, arg;
        for (_i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
          arg = args[_i2];
          if (!arg.isConst()) {
            return false;
          }
        }
        return true;
      }())) {
        if (func instanceof Ident) {
          if (__owns(PURE_PRIMORDIAL_FUNCTIONS, func.name) && PURE_PRIMORDIAL_FUNCTIONS[func.name] === true && typeof global !== "undefined" && typeof global[func.name] === "function") {
            try {
              return toConst(global[func.name].apply(void 0, __toArray((function () {
                var _arr, _i2, _len2, arg;
                for (_arr = [], _i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
                  arg = args[_i2];
                  _arr.push(arg.constValue());
                }
                return _arr;
              }()))));
            } catch (e) {}
          }
        } else if (func instanceof Binary && func.op === ".") {
          if (func.left.isConst() && func.right.isConst()) {
            if (typeof func.left.constValue()[func.right.constValue()] === "function") {
              try {
                return toConst((_ref = func.left.constValue())[func.right.constValue()].apply(_ref, __toArray((function () {
                  var _arr, _i2, _len2, arg;
                  for (_arr = [], _i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
                    arg = args[_i2];
                    _arr.push(arg.constValue());
                  }
                  return _arr;
                }()))));
              } catch (e) {}
            }
          } else if (func.left instanceof Ident && func.right.isConst() && typeof func.right.constValue() === "string" && __owns(PURE_PRIMORDIAL_FUNCTIONS, func.left.name) && typeof PURE_PRIMORDIAL_FUNCTIONS[func.left.name] === "object" && PURE_PRIMORDIAL_FUNCTIONS[func.left.name][func.right.constValue()] === true && typeof Object(global[func.left.name])[func.right.constValue()] === "function") {
            try {
              return toConst((_ref = global[func.left.name])[func.right.constValue()].apply(_ref, __toArray((function () {
                var _arr, _i2, _len2, arg;
                for (_arr = [], _i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
                  arg = args[_i2];
                  _arr.push(arg.constValue());
                }
                return _arr;
              }()))));
            } catch (e) {}
          }
        }
      }
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      return _this;
    }
    PURE_PRIMORDIAL_FUNCTIONS = {
      escape: true,
      unescape: true,
      parseInt: true,
      parseFloat: true,
      isNaN: true,
      isFinite: true,
      decodeURI: true,
      decodeURIComponent: true,
      encodeURI: true,
      encodeURIComponent: true,
      String: { fromCharCode: true },
      Number: { isFinite: true, isNaN: true },
      Math: {
        abs: true,
        acos: true,
        asin: true,
        atan: true,
        atan2: true,
        ceil: true,
        cos: true,
        exp: true,
        floor: true,
        log: true,
        max: true,
        min: true,
        pow: true,
        round: true,
        sin: true,
        sqrt: true,
        tan: true
      },
      JSON: { parse: true, stringify: true }
    };
    function compileLarge(args, options, level, lineStart, sb) {
      var childOptions, i, item, len;
      sb("(");
      childOptions = incIndent(options);
      for (i = 0, len = __num(args.length); i < len; ++i) {
        item = args[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, Level.sequence, false, sb);
        if (__lt(i, __num(len) - 1)) {
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
        if (!__lte(i, 0)) {
          sb(", ");
        }
        arg.compile(options, Level.sequence, false, sb);
      }
      sb(")");
    }
    _proto.compile = function (options, level, lineStart, sb) {
      var f, wrap;
      if (this.isNew) {
        sb("new ");
      }
      wrap = !this.isNew && (this.func instanceof Func || this.func instanceof Binary && this.func.op === "." && this.func.left instanceof Func);
      if (wrap) {
        sb("(");
      }
      this.func.compile(options, Level.call, lineStart && !wrap && !this.isNew, sb);
      if (this.shouldCompileLarge()) {
        f = compileLarge;
      } else {
        f = compileSmall;
      }
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
      if (!__lte(this.args.length, 4)) {
        return true;
      } else {
        return (function () {
          var _arr, _i, _len, arg;
          for (_arr = __slice(_this.args, void 0, -1), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
      if ((_ref = this._hasLargeArgs) != null) {
        return _ref;
      } else {
        return this._hasLargeArgs = !__lte(this.args.length, 4) ? true
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
      }
    };
    _proto.isLarge = function () {
      return this.func.isLarge() || this.hasLargeArgs();
    };
    _proto.isSmall = function () {
      var _ref;
      if ((_ref = this._isSmall) != null) {
        return _ref;
      } else {
        return this._isSmall = !this.func.isSmall() ? false
          : this.args.length === 0 ? true
          : this.args.length === 1 ? this.args[0].isSmall()
          : false;
      }
    };
    _proto.walk = function (walker) {
      var _ref, args, func;
      if ((_ref = walker(this.func)) != null) {
        func = _ref;
      } else {
        func = this.func.walk(walker);
      }
      args = walkArray(this.args, walker);
      if (this.func !== func || this.args !== args) {
        return Call(func, args, this.isNew);
      } else {
        return this;
      }
    };
    HELPER_TYPES = {
      __num: types.number,
      __str: types.string,
      __strnum: types.string,
      __lt: types.boolean,
      __lte: types.boolean,
      __owns: types.boolean,
      __in: types.boolean,
      __slice: types.array,
      __splice: types.array,
      __typeof: types.string,
      __cmp: types.number,
      __freeze: function (args) {
        if (!__lt(args.length, 1)) {
          return args[0].type();
        } else {
          return types["undefined"];
        }
      },
      __freezeFunc: function (args) {
        if (!__lt(args.length, 1)) {
          return args[0].type();
        } else {
          return types["undefined"];
        }
      },
      __isArray: types.boolean,
      __toArray: types.array,
      __create: types.object,
      __pow: types.number,
      __floor: types.number,
      __sqrt: types.number,
      __log: types.number,
      __keys: types.string.array(),
      __allkeys: types.string.array(),
      __new: types.any,
      __instanceofsome: types.boolean,
      __xor: function (args) {
        return types.boolean.union(!__lt(args.length, 2) ? args[1].type() : types["undefined"]);
      }
    };
    _proto.type = function () {
      var _ref, helper;
      if ((_ref = this._type) != null) {
        return _ref;
      } else {
        return this._type = this.func instanceof Ident && __owns(HELPER_TYPES, this.func.name) ? (helper = HELPER_TYPES[this.func.name], typeof helper === "function" ? helper(this.args) : helper) : types.any;
      }
    };
    return Call;
  }(Expression));
  function toConst(value) {
    if (value instanceof Node) {
      throw Error("Cannot convert " + __typeof(value) + " to a Const");
    } else if (Array.isArray(value)) {
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
            _arr.push(ObjPair(k, toConst(v)));
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
    _superproto = _super.prototype;
    _proto = Const.prototype = __create(_superproto);
    _proto.constructor = Const;
    Const.displayName = "Const";
    function Const(value) {
      var _this;
      if (value != null && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string" && !(value instanceof RegExp)) {
        throw TypeError("Expected value to be a undefined or null or Boolean or Number or String or RegExp, got " + __typeof(value));
      }
      if (this instanceof Const) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.value = value;
      return _this;
    }
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
    _proto.type = function () {
      var type, value;
      value = this.value;
      type = typeof value;
      if (type === "undefined") {
        return types["undefined"];
      } else if (type === "boolean") {
        return types.boolean;
      } else if (type === "number") {
        return types.number;
      } else if (type === "string") {
        return types.string;
      } else if (value === null) {
        return types["null"];
      } else if (value instanceof RegExp) {
        return types.regexp;
      } else {
        throw Error("Unknown value type: " + __strnum(type));
      }
    };
    _proto.walk = function () {
      return this;
    };
    return Const;
  }(Expression));
  exports.Continue = Continue = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Continue.prototype = __create(_superproto);
    _proto.constructor = Continue;
    Continue.displayName = "Continue";
    function Continue() {
      var _this;
      if (this instanceof Continue) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
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
    return Continue;
  }(Statement));
  exports.Debugger = Debugger = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Debugger.prototype = __create(_superproto);
    _proto.constructor = Debugger;
    Debugger.displayName = "Debugger";
    function Debugger() {
      var _this;
      if (this instanceof Debugger) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      return sb("debugger;");
    };
    _proto.walk = function () {
      return this;
    };
    return Debugger;
  }(Statement));
  exports.DoWhile = DoWhile = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = DoWhile.prototype = __create(_superproto);
    _proto.constructor = DoWhile;
    DoWhile.displayName = "DoWhile";
    function DoWhile(body, test) {
      var _this;
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (this instanceof DoWhile) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.body = body.maybeToStatement();
      _this.test = test;
      return _this;
    }
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
      if ((_ref = walker(this.body)) != null) {
        body = _ref;
      } else {
        body = this.body.walk(walker);
      }
      if ((_ref = walker(this.test)) != null) {
        test = _ref;
      } else {
        test = this.test.walk(walker);
      }
      if (body !== this.body || test !== this.test) {
        return DoWhile(body, test);
      } else {
        return this;
      }
    };
    return DoWhile;
  }(Statement));
  exports.Eval = Eval = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Eval.prototype = __create(_superproto);
    _proto.constructor = Eval;
    Eval.displayName = "Eval";
    function Eval(code) {
      var _this;
      if (this instanceof Eval) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (!(code instanceof Expression)) {
        code = toConst(code);
      }
      _this.code = code;
      return _this;
    }
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
      if ((_ref = walker(this.code)) != null) {
        code = _ref;
      } else {
        code = this.code.walk(walker);
      }
      if (code !== this.code) {
        return Eval(code);
      } else {
        return this;
      }
    };
    return Eval;
  }(Expression));
  exports.For = For = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = For.prototype = __create(_superproto);
    _proto.constructor = For;
    For.displayName = "For";
    function For(init, test, step, body) {
      var _this;
      if (init == null) {
        init = Noop();
      } else if (!(init instanceof Expression)) {
        throw TypeError("Expected init to be a Expression, got " + __typeof(init));
      }
      if (test == null) {
        test = Const(true);
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (step == null) {
        step = Noop();
      } else if (!(step instanceof Expression)) {
        throw TypeError("Expected step to be a Expression, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (this instanceof For) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.init = init;
      _this.test = test;
      _this.step = step;
      _this.body = body.maybeToStatement();
      return _this;
    }
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
      if ((_ref = walker(this.init)) != null) {
        init = _ref;
      } else {
        init = this.init.walk(walker);
      }
      if ((_ref = walker(this.test)) != null) {
        test = _ref;
      } else {
        test = this.test.walk(walker);
      }
      if ((_ref = walker(this.step)) != null) {
        step = _ref;
      } else {
        step = this.step.walk(walker);
      }
      if ((_ref = walker(this.body)) != null) {
        body = _ref;
      } else {
        body = this.body.walk(walker);
      }
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body) {
        return For(init, test, step, body);
      } else {
        return this;
      }
    };
    return For;
  }(Statement));
  exports.ForIn = ForIn = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = ForIn.prototype = __create(_superproto);
    _proto.constructor = ForIn;
    ForIn.displayName = "ForIn";
    function ForIn(key, object, body) {
      var _this;
      if (!(key instanceof Ident)) {
        throw TypeError("Expected key to be a Ident, got " + __typeof(key));
      }
      if (!(object instanceof Expression)) {
        throw TypeError("Expected object to be a Expression, got " + __typeof(object));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (this instanceof ForIn) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.key = key;
      _this.object = object;
      _this.body = body.maybeToStatement();
      return _this;
    }
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
      if ((_ref = walker(this.key)) != null) {
        key = _ref;
      } else {
        key = this.key.walk(walker);
      }
      if ((_ref = walker(this.object)) != null) {
        object = _ref;
      } else {
        object = this.object.walk(walker);
      }
      if ((_ref = walker(this.body)) != null) {
        body = _ref;
      } else {
        body = this.body.walk(walker);
      }
      if (key !== this.key || object !== this.object || body !== this.body) {
        return ForIn(key, object, body);
      } else {
        return this;
      }
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
    var _i, _len, declaration, i, line, variable;
    for (_i = 0, _len = __num(declarations.length); _i < _len; ++_i) {
      declaration = declarations[_i];
      sb.indent(options.indent);
      sb(toJSSource(declaration));
      sb(";\n");
    }
    if (!__lte(variables.length, 0)) {
      sb.indent(options.indent);
      sb("var ");
      for (i = 0, _len = __num(variables.length); i < _len; ++i) {
        variable = variables[i];
        if (!__lte(i, 0)) {
          sb(", ");
        }
        sb(variables[i]);
      }
      sb(";\n");
    }
    for (_i = 0, _len = __num(body.length); _i < _len; ++_i) {
      line = body[_i];
      sb.indent(options.indent);
      line.compileAsStatement(options, true, sb);
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
      if (!__lte(i, 0)) {
        sb(", ");
      }
      param.compile(options, Level.insideParentheses, false, sb);
    }
    sb(") {");
    if (variables.length || declarations.length || body.length) {
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
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Func.prototype = __create(_superproto);
    _proto.constructor = Func;
    Func.displayName = "Func";
    function Func(name, params, variables, body, declarations) {
      var _i, _i2, _i3, _i4, _len, _len2, _len3, _len4, _this;
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
            throw TypeError("Expected params[" + _i + "] to be a Ident, got " + __typeof(params[_i]));
          }
        }
      }
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i2 = 0, _len2 = variables.length; _i2 < _len2; ++_i2) {
          if (typeof variables[_i2] !== "string") {
            throw TypeError("Expected variables[" + _i2 + "] to be a String, got " + __typeof(variables[_i2]));
          }
        }
      }
      if (body == null) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i3 = 0, _len3 = body.length; _i3 < _len3; ++_i3) {
          if (!(body[_i3] instanceof Node)) {
            throw TypeError("Expected body[" + _i3 + "] to be a Node, got " + __typeof(body[_i3]));
          }
        }
      }
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i4 = 0, _len4 = declarations.length; _i4 < _len4; ++_i4) {
          if (typeof declarations[_i4] !== "string") {
            throw TypeError("Expected declarations[" + _i4 + "] to be a String, got " + __typeof(declarations[_i4]));
          }
        }
      }
      if (this instanceof Func) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      validateFuncParamsAndVariables(params, variables);
      _this.name = name;
      _this.params = params;
      _this.variables = variables;
      _this.body = body;
      _this.declarations = declarations;
      return _this;
    }
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
    _proto.type = function () {
      return types["function"];
    };
    _proto.isLarge = function () {
      return true;
    };
    _proto.walk = function (walker) {
      var _ref, body, name, params;
      if (this.name) {
        if ((_ref = walker(this.name)) != null) {
          name = _ref;
        } else {
          name = this.name.walk(walker);
        }
      } else {
        name = this.name;
      }
      params = walkArray(this.params, walker);
      body = walkArray(this.body, walker);
      if (name !== this.name || params !== this.params || body !== this.body) {
        return Func(
          name,
          params,
          this.variables,
          body,
          this.declarations
        );
      } else {
        return this;
      }
    };
    return Func;
  }(Expression));
  exports.Ident = Ident = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Ident.prototype = __create(_superproto);
    _proto.constructor = Ident;
    Ident.displayName = "Ident";
    function Ident(name) {
      var _this;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (this instanceof Ident) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (!isAcceptableIdent(name)) {
        throw Error("Not an acceptable identifier name: " + __strnum(name));
      }
      _this.name = name;
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      sb(this.name);
    };
    _proto.walk = function () {
      return this;
    };
    return Ident;
  }(Expression));
  exports.IfStatement = IfStatement = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = IfStatement.prototype = __create(_superproto);
    _proto.constructor = IfStatement;
    IfStatement.displayName = "IfStatement";
    function IfStatement(test, whenTrue, whenFalse) {
      var _this;
      if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = Noop();
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
      }
      if (this instanceof IfStatement) {
        _this = this;
      } else {
        _this = __create(_proto);
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
        if (whenTrue.isNoop()) {
          if (whenFalse.isNoop()) {
            return test.maybeToStatement();
          } else {
            _this.test = Unary("!", test);
            _this.whenTrue = whenFalse;
            _this.whenFalse = whenTrue;
          }
        } else {
          _this.test = test;
          _this.whenTrue = whenTrue;
          _this.whenFalse = whenFalse;
        }
      }
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      var childOptions, whenFalse;
      if (level !== Level.block) {
        throw Error("Cannot compile a statement except on the Block level");
      }
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
    };
    _proto.walk = function (walker) {
      var _ref, test, whenFalse, whenTrue;
      if ((_ref = walker(this.test)) != null) {
        test = _ref;
      } else {
        test = this.test.walk(walker);
      }
      if ((_ref = walker(this.whenTrue)) != null) {
        whenTrue = _ref;
      } else {
        whenTrue = this.whenTrue.walk(walker);
      }
      if ((_ref = walker(this.whenFalse)) != null) {
        whenFalse = _ref;
      } else {
        whenFalse = this.whenFalse.walk(walker);
      }
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
    return IfStatement;
  }(Statement));
  exports.IfExpression = IfExpression = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = IfExpression.prototype = __create(_superproto);
    _proto.constructor = IfExpression;
    IfExpression.displayName = "IfExpression";
    function IfExpression(test, whenTrue, whenFalse) {
      var _this;
      if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a Expression, got " + __typeof(test));
      }
      if (!(whenTrue instanceof Expression)) {
        throw TypeError("Expected whenTrue to be a Expression, got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = Noop();
      } else if (!(whenFalse instanceof Expression)) {
        throw TypeError("Expected whenFalse to be a Expression, got " + __typeof(whenFalse));
      }
      if (this instanceof IfExpression) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (test.isConst()) {
        if (test.constValue()) {
          return whenTrue;
        } else {
          return whenFalse;
        }
      } else {
        _this.test = test;
        _this.whenTrue = whenTrue;
        _this.whenFalse = whenFalse;
      }
      return _this;
    }
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
        if (this.whenTrue.isLarge() || this.whenFalse.isLarge()) {
          f = compileLarge;
        } else {
          f = compileSmall;
        }
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
    _proto.type = function () {
      var _ref;
      if ((_ref = this._type) != null) {
        return _ref;
      } else {
        return this._type = this.whenTrue.type().union(this.whenFalse.type());
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) != null) {
        return _ref;
      } else {
        return this._isLarge = (function () {
          var _arr, _i, _len, part;
          for (_arr = [_this.test, _this.whenTrue, _this.whenFalse], _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            part = _arr[_i];
            if (!part.isSmall()) {
              return true;
            }
          }
          return false;
        }());
      }
    };
    _proto.isSmall = function () {
      return false;
    };
    _proto.walk = IfStatement.prototype.walk;
    return IfExpression;
  }(Expression));
  If = exports.If = function (test, whenTrue, whenFalse) {
    if (whenTrue instanceof Expression && (!whenFalse || whenFalse instanceof Expression)) {
      return IfExpression(test, whenTrue, whenFalse);
    } else {
      return IfStatement(test, whenTrue, whenFalse);
    }
  };
  exports.Noop = Noop = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Noop.prototype = __create(_superproto);
    _proto.constructor = Noop;
    Noop.displayName = "Noop";
    function Noop() {
      var _this;
      if (this instanceof Noop) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
    _proto.compileAsStatement = function () {
      
    };
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
    _proto.type = function () {
      return types["undefined"];
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
    return Noop;
  }(Expression));
  exports.Obj = Obj = (function (_super) {
    var _proto, _superproto, ObjPair;
    _superproto = _super.prototype;
    _proto = Obj.prototype = __create(_superproto);
    _proto.constructor = Obj;
    Obj.displayName = "Obj";
    function Obj(elements) {
      var _i, _len, _this;
      if (elements == null) {
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
      if (this instanceof Obj) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      validateUniqueKeys(elements);
      _this.elements = elements;
      return _this;
    }
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
    function compileLarge(elements, options, sb) {
      var childOptions, element, i, key, len;
      childOptions = incIndent(options);
      for (i = 0, len = __num(elements.length); i < len; ++i) {
        element = elements[i];
        sb("\n");
        sb.indent(childOptions.indent);
        key = element.key;
        sb(isAcceptableIdent(key) ? key : toJSSource(key));
        sb(": ");
        element.value.compile(childOptions, Level.sequence, false, sb);
        if (__lt(i, __num(len) - 1)) {
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
          if (!__lte(i, 0)) {
            sb(", ");
          }
          key = element.key;
          sb(isAcceptableIdent(key) ? key : toJSSource(key));
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
      if (this.shouldCompileLarge()) {
        f = compileLarge;
      } else {
        f = compileSmall;
      }
      f(this.elements, options, sb);
      sb("}");
      if (lineStart) {
        sb(")");
      }
    };
    _proto.type = function () {
      return types.object;
    };
    _proto.shouldCompileLarge = function () {
      var len;
      len = this.elements.length;
      if (len === 0) {
        return false;
      } else if (len === 1) {
        return this.elements[0].isLarge();
      } else {
        return this.isLarge();
      }
    };
    _proto.isSmall = function () {
      var len;
      len = this.elements.length;
      if (len === 0) {
        return true;
      } else if (len === 1) {
        return this.elements[0].isSmall();
      } else {
        return false;
      }
    };
    _proto.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) != null) {
        return _ref;
      } else {
        return this._isLarge = !__lte(this.elements.length, 4) || (function () {
          var _arr, _i, _len, element;
          for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isSmall()) {
              return true;
            }
          }
          return false;
        }());
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
    Obj.Pair = ObjPair = (function () {
      var _proto2;
      _proto2 = ObjPair.prototype;
      ObjPair.displayName = "ObjPair";
      function ObjPair(key, value) {
        var _this;
        if (typeof key !== "string") {
          throw TypeError("Expected key to be a String, got " + __typeof(key));
        }
        if (this instanceof ObjPair) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        if (!(value instanceof Expression)) {
          value = toConst(value);
        }
        _this.key = key;
        _this.value = value;
        return _this;
      }
      _proto2.isSmall = function () {
        return this.value.isSmall();
      };
      _proto2.isLarge = function () {
        return this.value.isLarge();
      };
      _proto2.walk = function (walker) {
        var _ref, value;
        if ((_ref = walker(this.value)) != null) {
          value = _ref;
        } else {
          value = this.value.walk(walker);
        }
        if (value !== this.value) {
          return ObjPair(this.key, value);
        } else {
          return this;
        }
      };
      return ObjPair;
    }());
    return Obj;
  }(Expression));
  exports.Return = Return = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Return.prototype = __create(_superproto);
    _proto.constructor = Return;
    Return.displayName = "Return";
    function Return(node) {
      var _this;
      if (node == null) {
        node = Const(void 0);
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a Expression, got " + __typeof(node));
      }
      if (this instanceof Return) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Return);
      }
      _this.node = node;
      return _this;
    }
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
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Return(node);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return "return";
    };
    return Return;
  }(Statement));
  exports.Root = Root = (function () {
    var _proto;
    _proto = Root.prototype;
    Root.displayName = "Root";
    function Root(body, variables, declarations) {
      var _i, _i2, _i3, _i4, _len, _len2, _len3, _len4, _ref, _this, item, statement;
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
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i2 = 0, _len2 = variables.length; _i2 < _len2; ++_i2) {
          if (typeof variables[_i2] !== "string") {
            throw TypeError("Expected variables[" + _i2 + "] to be a String, got " + __typeof(variables[_i2]));
          }
        }
      }
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i3 = 0, _len3 = declarations.length; _i3 < _len3; ++_i3) {
          if (typeof declarations[_i3] !== "string") {
            throw TypeError("Expected declarations[" + _i3 + "] to be a String, got " + __typeof(declarations[_i3]));
          }
        }
      }
      if (this instanceof Root) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      validateFuncParamsAndVariables([], variables);
      _this.body = [];
      for (_i4 = 0, _len4 = __num(body.length); _i4 < _len4; ++_i4) {
        item = body[_i4];
        statement = item.maybeToStatement();
        if (!statement.isNoop()) {
          if (statement instanceof BlockStatement) {
            (_ref = _this.body).push.apply(_ref, __toArray(statement.body));
          } else {
            _this.body.push(statement);
          }
          if (statement.exitType() != null) {
            break;
          }
        }
      }
      _this.variables = variables;
      _this.declarations = declarations;
      return _this;
    }
    _proto.compile = function (options) {
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
    _proto.toString = function () {
      return this.compile();
    };
    _proto.toFunction = Node.prototype.toFunction;
    _proto.isLarge = function () {
      return true;
    };
    _proto.walk = function (walker) {
      var body;
      body = walkArray(this.body, walker);
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
      return this.body[__num(this.body.length) - 1].exitType();
    };
    return Root;
  }());
  exports.This = This = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = This.prototype = __create(_superproto);
    _proto.constructor = This;
    This.displayName = "This";
    function This() {
      var _this;
      if (this instanceof This) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      sb("this");
    };
    _proto.walk = function () {
      return this;
    };
    return This;
  }(Expression));
  exports.Throw = Throw = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = Throw.prototype = __create(_superproto);
    _proto.constructor = Throw;
    Throw.displayName = "Throw";
    function Throw(node) {
      var _this;
      if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a Expression, got " + __typeof(node));
      }
      if (this instanceof Throw) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(Throw, true);
      }
      _this.node = node;
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      sb("throw ");
      this.node.compile(options, Level.insideParentheses, false, sb);
      return sb(";");
    };
    _proto.walk = function (walker) {
      var _ref, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Throw(node);
      } else {
        return this;
      }
    };
    _proto.exitType = function () {
      return "throw";
    };
    return Throw;
  }(Statement));
  exports.Switch = Switch = (function (_super) {
    var _proto, _superproto, SwitchCase;
    _superproto = _super.prototype;
    _proto = Switch.prototype = __create(_superproto);
    _proto.constructor = Switch;
    Switch.displayName = "Switch";
    function Switch(node, cases, defaultCase) {
      var _i, _len, _this;
      if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a Expression, got " + __typeof(node));
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
      if (this instanceof Switch) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase.maybeToStatement();
      return _this;
    }
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
        this.defaultCase.compileAsStatement(options, true, sb);
      }
      sb("\n");
      sb.indent(options.indent);
      sb("}");
    };
    _proto.walk = function (walker) {
      var _ref, cases, defaultCase, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      cases = walkArray(this.cases, walker);
      if ((_ref = walker(this.defaultCase)) != null) {
        defaultCase = _ref;
      } else {
        defaultCase = this.defaultCase.walk(walker);
      }
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase) {
        return Switch(node, cases, defaultCase);
      } else {
        return this;
      }
    };
    Switch.Case = SwitchCase = (function () {
      var _proto2;
      _proto2 = SwitchCase.prototype;
      SwitchCase.displayName = "SwitchCase";
      function SwitchCase(node, body) {
        if (!(node instanceof Expression)) {
          throw TypeError("Expected node to be a Expression, got " + __typeof(node));
        }
        if (!(body instanceof Node)) {
          throw TypeError("Expected body to be a Node, got " + __typeof(body));
        }
        if (!(this instanceof SwitchCase)) {
          throw TypeError("SwitchCase must be called with new");
        }
        this.node = node;
        this.body = body.maybeToStatement();
      }
      _proto2.isLarge = function () {
        return true;
      };
      _proto2.isSmall = function () {
        return false;
      };
      _proto2.walk = function (walker) {
        var _ref, body, node;
        if ((_ref = walker(this.node)) != null) {
          node = _ref;
        } else {
          node = this.node.walk(walker);
        }
        if ((_ref = walker(this.body)) != null) {
          body = _ref;
        } else {
          body = this.body.walk(walker);
        }
        if (node !== this.node || body !== this.body) {
          return SwitchCase(node, body);
        } else {
          return this;
        }
      };
      return SwitchCase;
    }());
    return Switch;
  }(Statement));
  exports.TryCatch = TryCatch = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = TryCatch.prototype = __create(_superproto);
    _proto.constructor = TryCatch;
    TryCatch.displayName = "TryCatch";
    function TryCatch(tryBody, catchIdent, catchBody) {
      var _this;
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Ident)) {
        throw TypeError("Expected catchIdent to be a Ident, got " + __typeof(catchIdent));
      }
      if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      if (this instanceof TryCatch) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.tryBody = tryBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.tryBody;
      }
      _this.catchIdent = catchIdent;
      _this.catchBody = catchBody.maybeToStatement();
      return _this;
    }
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
      if ((_ref = walker(this.tryBody)) != null) {
        tryBody = _ref;
      } else {
        tryBody = this.tryBody.walk(walker);
      }
      if ((_ref = walker(this.catchIdent)) != null) {
        catchIdent = _ref;
      } else {
        catchIdent = this.catchIdent.walk(walker);
      }
      if ((_ref = walker(this.catchBody)) != null) {
        catchBody = _ref;
      } else {
        catchBody = this.catchBody.walk(walker);
      }
      if (tryBody !== this.tryBody || catchIdent !== this.catchIdent || catchBody !== this.catchBody) {
        return TryCatch(tryBody, catchIdent, catchBody);
      } else {
        return this;
      }
    };
    return TryCatch;
  }(Statement));
  exports.TryFinally = TryFinally = (function (_super) {
    var _proto, _superproto;
    _superproto = _super.prototype;
    _proto = TryFinally.prototype = __create(_superproto);
    _proto.constructor = TryFinally;
    TryFinally.displayName = "TryFinally";
    function TryFinally(tryBody, finallyBody) {
      var _this;
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      if (this instanceof TryFinally) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      _this.tryBody = tryBody.maybeToStatement();
      _this.finallyBody = finallyBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.finallyBody;
      } else if (_this.finallyBody.isNoop()) {
        return _this.tryBody;
      }
      return _this;
    }
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
      if ((_ref = walker(this.tryBody)) != null) {
        tryBody = _ref;
      } else {
        tryBody = this.tryBody.walk(walker);
      }
      if ((_ref = walker(this.finallyBody)) != null) {
        finallyBody = _ref;
      } else {
        finallyBody = this.finallyBody.walk(walker);
      }
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
        return TryFinally(tryBody, finallyBody);
      } else {
        return this;
      }
    };
    return TryFinally;
  }(Statement));
  exports.Unary = Unary = (function (_super) {
    var _proto, _superproto, CONST_OPERATIONS, KNOWN_OPERATORS, NONCONST_OPERATIONS, OPERATOR_TYPES;
    _superproto = _super.prototype;
    _proto = Unary.prototype = __create(_superproto);
    _proto.constructor = Unary;
    Unary.displayName = "Unary";
    function Unary(op, node) {
      var _ref, _this;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (this instanceof Unary) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      if (!__in(op, KNOWN_OPERATORS)) {
        throw Error("Unknown unary operator: " + __strnum(op));
      }
      if (!(node instanceof Expression)) {
        node = toConst(node);
      }
      if (op === "delete" && (!(node instanceof Binary) || node.op !== ".")) {
        throw Error("Cannot use delete operator on a non-access");
      }
      if (__owns(CONST_OPERATIONS, op) && node.isConst()) {
        return Const(CONST_OPERATIONS[op](node.constValue()));
      }
      if (__owns(NONCONST_OPERATIONS, op)) {
        if ((_ref = NONCONST_OPERATIONS[op](node)) != null) {
          return _ref;
        }
      }
      _this.op = op;
      _this.node = node;
      return _this;
    }
    _proto.compile = function (options, level, lineStart, sb) {
      var op;
      op = this.op;
      if (op === "++post" || op === "--post") {
        this.node.compile(options, Level.unary, false, sb);
        sb(op.substring(0, 2));
      } else {
        sb(op);
        if (op === "typeof" || op === "void" || op === "delete" || (op === "+" || op === "-" || op === "++" || op === "--") && (this.node instanceof Unary && (op === "+" || op === "-" || op === "++" || op === "--") || this.node instanceof Const && typeof this.node.value === "number" && __lt(this.node.value, 0))) {
          sb(" ");
        }
        this.node.compile(options, Level.unary, false, sb);
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
    CONST_OPERATIONS = {
      "!": function (x) {
        return !x;
      },
      "~": function (x) {
        return ~__num(x);
      },
      "+": function (x) {
        return __num(x);
      },
      "-": function (x) {
        return -__num(x);
      },
      "typeof": function (x) {
        return typeof x;
      }
    };
    NONCONST_OPERATIONS = {
      "+": function (x) {
        if (x.type().isSubsetOf(types.number)) {
          return x;
        }
      },
      "-": function (x) {
        var _ref;
        if (x instanceof Unary) {
          if ((_ref = x.op) === "-" || _ref === "+") {
            return Unary(
              x.op === "-" ? "+" : "-",
              x.node
            );
          }
        } else if (x instanceof Binary) {
          if ((_ref = x.op) === "-" || _ref === "+") {
            return Binary(
              x.left,
              x.op === "-" ? "+" : "-",
              x.right
            );
          } else if ((_ref = x.op) === "*" || _ref === "/") {
            return Binary(
              Unary("-", x.left),
              x.op,
              x.right
            );
          }
        }
      },
      "!": (function () {
        var BINARY_INVERTABLE;
        BINARY_INVERTABLE = {
          "<": ">=",
          "<=": ">",
          ">": "<=",
          ">=": "<",
          "==": "!=",
          "!=": "==",
          "===": "!==",
          "!==": "===",
          "&&": function (x, y) {
            return Binary(
              Unary("!", x),
              "||",
              Unary("!", y)
            );
          },
          "||": function (x, y) {
            return Binary(
              Unary("!", x),
              "&&",
              Unary("!", y)
            );
          }
        };
        return function (x) {
          var invert;
          if (x instanceof Unary) {
            if (x.op === "!" && x.node.type().isSubsetOf(types.boolean)) {
              return x.node;
            }
          } else if (x instanceof Binary) {
            if (__owns(BINARY_INVERTABLE, x.op)) {
              invert = BINARY_INVERTABLE[x.op];
              if (typeof invert === "function") {
                return invert(x.left, x.right);
              } else if (typeof invert === "string") {
                return Binary(x.left, invert, x.right);
              } else {
                throw Error();
              }
            }
          }
        };
      }())
    };
    OPERATOR_TYPES = {
      "++": types.number,
      "--": types.number,
      "++post": types.number,
      "--post": types.number,
      "!": types.boolean,
      "~": types.number,
      "+": types.number,
      "-": types.number,
      "typeof": types.string,
      "void": types["undefined"],
      "delete": types.boolean
    };
    _proto.type = function () {
      return OPERATOR_TYPES[this.op];
    };
    _proto.isLarge = function () {
      return this.node.isLarge();
    };
    _proto.isSmall = function () {
      return this.node.isSmall();
    };
    _proto.walk = function (walker) {
      var _ref, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Unary(this.op, node);
      } else {
        return this;
      }
    };
    return Unary;
  }(Expression));
  While = exports.While = function (test, body) {
    return For(null, test, null, body);
  };
}.call(this));
