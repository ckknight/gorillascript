"use strict";
var __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, Arguments, Arr, Binary, BlockExpression, BlockStatement, Break, Call, Const, Continue, Debugger, DoWhile, Eval, Expression, For, ForIn, Func, Ident, IfExpression, IfStatement, INDENT, isAcceptableIdent, LEVEL_ACCESS, LEVEL_ADDITION, LEVEL_ASSIGNMENT, LEVEL_BITWISE_AND, LEVEL_BITWISE_OR, LEVEL_BITWISE_SHIFT, LEVEL_BITWISE_XOR, LEVEL_BLOCK, LEVEL_CALL, LEVEL_EQUALITY, LEVEL_INCREMENT, LEVEL_INLINE_CONDITION, LEVEL_INSIDE_PARENTHESES, LEVEL_LOGICAL_AND, LEVEL_LOGICAL_OR, LEVEL_MULTIPLICATION, LEVEL_RELATIONAL, LEVEL_SEQUENCE, LEVEL_UNARY, Node, Obj, Return, Root, Statement, Switch, This, Throw, toJSSourceTypes, TryCatch, TryFinally, types, Unary;
__create = typeof Object.create === "function" ? Object.create : function (x) {
  function F() {}
  F.prototype = x;
  return new F();
};
__in = (function () {
  var indexOf;
  indexOf = Array.prototype.indexOf;
  return function (child, parent) {
    return indexOf.call(parent, child) !== -1;
  };
}());
__isArray = typeof Array.isArray === "function" ? Array.isArray : (function () {
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
LEVEL_BLOCK = 0;
LEVEL_INSIDE_PARENTHESES = 1;
LEVEL_SEQUENCE = 2;
LEVEL_ASSIGNMENT = 3;
LEVEL_INLINE_CONDITION = 4;
LEVEL_LOGICAL_OR = 5;
LEVEL_LOGICAL_AND = 6;
LEVEL_BITWISE_OR = 7;
LEVEL_BITWISE_XOR = 8;
LEVEL_BITWISE_AND = 9;
LEVEL_EQUALITY = 10;
LEVEL_RELATIONAL = 11;
LEVEL_BITWISE_SHIFT = 12;
LEVEL_ADDITION = 13;
LEVEL_MULTIPLICATION = 14;
LEVEL_UNARY = 14;
LEVEL_INCREMENT = 15;
LEVEL_CALL = 16;
LEVEL_ACCESS = 17;
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
    throw TypeError("Cannot compile const " + __strnum(__typeof(value)));
  }
  return f(value);
}
isAcceptableIdent = (function () {
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
exports.isAcceptableIdent = isAcceptableIdent;
Node = (function () {
  function Node() {
    throw Error("Node cannot be instantiated directly");
  }
  Node.prototype.toString = function () {
    var sb;
    sb = StringBuilder();
    this.compileAsStatement(
      { indent: 0 },
      true,
      sb
    );
    return sb.toString();
  };
  Node.prototype.toFunction = function () {
    return new Function(this.toString());
  };
  Node.prototype.compile = function () {
    throw Error("compile not implemented: " + __strnum(this.constructor.name));
  };
  Node.prototype.maybeToStatement = function () {
    if (typeof this.toStatement === "function") {
      return this.toStatement();
    } else {
      return this;
    }
  };
  Node.prototype.isConst = function () {
    return false;
  };
  Node.prototype.isNoop = function () {
    return false;
  };
  Node.prototype.constValue = function () {
    throw Error(__strnum(this.constructor.name) + " has no const value");
  };
  return exports.Node = Node;
}());
Expression = (function () {
  function Expression() {
    throw Error("Expression cannot be instantiated directly");
  }
  Expression.prototype = __create(Node.prototype);
  Expression.prototype.constructor = Expression;
  Expression.prototype.toString = function () {
    return __strnum(Node.prototype.toString.call(this)) + ";";
  };
  Expression.prototype.compileAsStatement = function (options, lineStart, sb) {
    if (typeof this.toStatement === "function") {
      this.toStatement().compileAsStatement(options, lineStart, sb);
    } else {
      this.compile(options, LEVEL_BLOCK, lineStart, sb);
      sb(";");
    }
  };
  Expression.prototype.type = function () {
    return types.any;
  };
  Expression.prototype.isLarge = function () {
    return false;
  };
  return exports.Expression = Expression;
}());
Statement = (function () {
  function Statement() {
    throw Error("Expression cannot be instantiated directly");
  }
  Statement.prototype = __create(Node.prototype);
  Statement.prototype.constructor = Statement;
  Statement.prototype.compileAsStatement = function (options, lineStart, sb) {
    return this.compile(options, LEVEL_BLOCK, lineStart, sb);
  };
  Statement.prototype.isLarge = function () {
    return true;
  };
  return exports.Statement = Statement;
}());
function Access(parent) {
  var _i, _len, child, children, current;
  children = __slice(arguments, 1);
  current = parent;
  for (_i = 0, _len = __num(children.length); _i < _len; ++_i) {
    child = children[_i];
    current = Binary(current, ".", child);
  }
  return current;
}
exports.Access = Access;
Arguments = (function () {
  function Arguments() {
    var self;
    self = this instanceof Arguments ? this : __create(Arguments.prototype);
    return self;
  }
  Arguments.prototype = __create(Expression.prototype);
  Arguments.prototype.constructor = Arguments;
  Arguments.prototype.compile = function (options, level, lineStart, sb) {
    sb("arguments");
  };
  Arguments.prototype.type = function () {
    return types.args;
  };
  Arguments.prototype.walk = function () {
    return this;
  };
  return exports.Arguments = Arguments;
}());
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
Arr = (function () {
  function Arr(elements) {
    var _i, _len, self;
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
    self = this instanceof Arr ? this : __create(Arr.prototype);
    self.elements = elements;
    return self;
  }
  Arr.prototype = __create(Expression.prototype);
  Arr.prototype.constructor = Arr;
  function compileLarge(elements, options, level, lineStart, sb) {
    var childOptions, i, item, len;
    childOptions = incIndent(options);
    for (i = 0, len = __num(elements.length); i < len; ++i) {
      item = elements[i];
      sb("\n");
      sb.indent(childOptions.indent);
      item.compile(childOptions, LEVEL_SEQUENCE, false, sb);
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
        item.compile(options, LEVEL_SEQUENCE, false, sb);
      }
    }
  }
  Arr.prototype.compile = function (options, level, lineStart, sb) {
    var f;
    sb("[");
    f = this.isLarge() ? compileLarge : compileSmall;
    f(
      this.elements,
      options,
      level,
      lineStart,
      sb
    );
    sb("]");
  };
  Arr.prototype.type = function () {
    return types.array;
  };
  Arr.prototype.isEmpty = function () {
    return this.elements.length === 0;
  };
  Arr.prototype.isLarge = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._isLarge) != null ? _ref : (this._isLarge = !__lte(this.elements.length, 4) || (function () {
      var _arr, _i, _len, element;
      for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        element = _arr[_i];
        if ((element instanceof Arr || element instanceof Obj) && !element.isEmpty() || element.isLarge()) {
          return true;
        }
      }
      return false;
    }()));
  };
  Arr.prototype.walk = function (walker) {
    var elements;
    elements = walkArray(this.elements, walker);
    if (this.elements !== elements) {
      return Arr(elements);
    } else {
      return this;
    }
  };
  return exports.Arr = Arr;
}());
function Assign(left, right) {
  if (!(left instanceof Expression)) {
    throw TypeError("Expected left to be a Expression, got " + __typeof(left));
  }
  if (!(right instanceof Expression)) {
    throw TypeError("Expected right to be a Expression, got " + __typeof(right));
  }
  return Binary(left, "=", right);
}
exports.Assign = Assign;
function Concat() {
  var _i, _i2, _len, _len2, arg, args, current;
  args = __slice(arguments);
  if (!__isArray(args)) {
    throw TypeError("Expected args to be an Array, got " + __typeof(args));
  } else {
    for (_i = 0, _len = args.length; _i < _len; ++_i) {
      if (!(args[_i] instanceof Expression)) {
        throw TypeError("Expected args[" + _i + "] to be a Expression, got " + __typeof(args[_i]));
      }
    }
  }
  current = Const("");
  for (_i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
    arg = args[_i2];
    current = Binary(current, "+", arg);
  }
  return current;
}
exports.Concat = Concat;
function And() {
  var _end, _i, _len, args, current, i;
  args = __slice(arguments);
  if (!__isArray(args)) {
    throw TypeError("Expected args to be an Array, got " + __typeof(args));
  } else {
    for (_i = 0, _len = args.length; _i < _len; ++_i) {
      if (!(args[_i] instanceof Expression)) {
        throw TypeError("Expected args[" + _i + "] to be a Expression, got " + __typeof(args[_i]));
      }
    }
  }
  if (args.length === 0) {
    return Const(true);
  } else {
    current = args[0];
    for (i = 1, _end = __num(args.length); i < _end; ++i) {
      current = Binary(current, "&&", args[i]);
    }
    return current;
  }
}
exports.And = And;
function Or() {
  var _end, _i, _len, args, current, i;
  args = __slice(arguments);
  if (!__isArray(args)) {
    throw TypeError("Expected args to be an Array, got " + __typeof(args));
  } else {
    for (_i = 0, _len = args.length; _i < _len; ++_i) {
      if (!(args[_i] instanceof Expression)) {
        throw TypeError("Expected args[" + _i + "] to be a Expression, got " + __typeof(args[_i]));
      }
    }
  }
  if (args.length === 0) {
    return Const(false);
  } else {
    current = args[0];
    for (i = 1, _end = __num(args.length); i < _end; ++i) {
      current = Binary(current, "||", args[i]);
    }
    return current;
  }
}
exports.Or = Or;
Binary = (function () {
  var _o, ASSIGNMENT_OPS, CONST_OPERATIONS, LEFT_CONSTANT_OPERATIONS, LEVEL_TO_ASSOCIATIVITY, OPERATOR_PRECEDENCE, OPERATOR_TYPES, RIGHT_CONSTANT_OPERATIONS;
  function Binary(left, op, right) {
    var _ref, node, self;
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    self = this instanceof Binary ? this : __create(Binary.prototype);
    if (!__owns(OPERATOR_PRECEDENCE, op)) {
      throw Error("Unknown binary operator: " + __strnum(JSON.stringify(op)));
    }
    if (!(left instanceof Expression)) {
      left = toConst(left);
    }
    if (!(right instanceof Expression)) {
      right = toConst(right);
    }
    if (left.isConst() && right.isConst() && __owns(CONST_OPERATIONS, op)) {
      node = CONST_OPERATIONS[op](left.constValue(), right.constValue());
      if (node !== void 0) {
        if (node instanceof Expression) {
          return node;
        } else {
          return Const(node);
        }
      }
    }
    if (left.isConst() && __owns(LEFT_CONSTANT_OPERATIONS, op)) {
      if ((_ref = LEFT_CONSTANT_OPERATIONS[op](left, right)) != null) {
        return _ref;
      }
    }
    if (right.isConst() && __owns(RIGHT_CONSTANT_OPERATIONS, op)) {
      if ((_ref = RIGHT_CONSTANT_OPERATIONS[op](left, right)) != null) {
        return _ref;
      }
    }
    self.left = left;
    self.op = op;
    self.right = right;
    return self;
  }
  Binary.prototype = __create(Expression.prototype);
  Binary.prototype.constructor = Binary;
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
      left.compile(options, LEVEL_ACCESS, lineStart, sb);
    }
    if (dotAccess) {
      sb(".");
      sb(right.value);
    } else {
      sb("[");
      right.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
      sb("]");
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
    left.compile(options, associativity === "right" && left instanceof Binary && OPERATOR_PRECEDENCE[left.op] === opLevel ? __num(opLevel) + 1 : opLevel, lineStart && !wrap, sb);
    sb(" ");
    sb(op);
    sb(" ");
    right.compile(options, associativity === "left" && right instanceof Binary && OPERATOR_PRECEDENCE[right.op] === opLevel ? __num(opLevel) + 1 : opLevel, false, sb);
    if (wrap) {
      sb(")");
    }
  }
  Binary.prototype.compile = function (options, level, lineStart, sb) {
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
  Binary.prototype.type = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._type) != null ? _ref : (this._type = (function () {
      var handler;
      handler = OPERATOR_TYPES[_this.op];
      if (typeof handler === "function") {
        return handler(_this.left.type(), _this.right.type());
      } else {
        return handler;
      }
    }()));
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
      return __num(x) << __num(y);
    },
    ">>": function (x, y) {
      return __num(x) >> __num(y);
    },
    ">>>": function (x, y) {
      return __num(x) >>> __num(y);
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
      return __num(x) & __num(y);
    },
    "^": function (x, y) {
      return __num(x) ^ __num(y);
    },
    "|": function (x, y) {
      return __num(x) | __num(y);
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
    ".": LEVEL_ACCESS,
    "*": LEVEL_MULTIPLICATION,
    "/": LEVEL_MULTIPLICATION,
    "%": LEVEL_MULTIPLICATION,
    "+": LEVEL_ADDITION,
    "-": LEVEL_ADDITION,
    "<<": LEVEL_BITWISE_SHIFT,
    ">>": LEVEL_BITWISE_SHIFT,
    ">>>": LEVEL_BITWISE_SHIFT,
    "<": LEVEL_RELATIONAL,
    "<=": LEVEL_RELATIONAL,
    ">": LEVEL_RELATIONAL,
    ">=": LEVEL_RELATIONAL,
    "in": LEVEL_RELATIONAL,
    "instanceof": LEVEL_RELATIONAL,
    "==": LEVEL_EQUALITY,
    "!=": LEVEL_EQUALITY,
    "===": LEVEL_EQUALITY,
    "!==": LEVEL_EQUALITY,
    "&": LEVEL_BITWISE_AND,
    "^": LEVEL_BITWISE_XOR,
    "|": LEVEL_BITWISE_OR,
    "&&": LEVEL_LOGICAL_AND,
    "||": LEVEL_LOGICAL_OR,
    "=": LEVEL_ASSIGNMENT,
    "+=": LEVEL_ASSIGNMENT,
    "-=": LEVEL_ASSIGNMENT,
    "*=": LEVEL_ASSIGNMENT,
    "/=": LEVEL_ASSIGNMENT,
    "%=": LEVEL_ASSIGNMENT,
    "<<=": LEVEL_ASSIGNMENT,
    ">>=": LEVEL_ASSIGNMENT,
    ">>>=": LEVEL_ASSIGNMENT,
    "&=": LEVEL_ASSIGNMENT,
    "^=": LEVEL_ASSIGNMENT,
    "|=": LEVEL_ASSIGNMENT
  };
  LEVEL_TO_ASSOCIATIVITY = (_o = {}, _o[LEVEL_EQUALITY] = "paren", _o[LEVEL_RELATIONAL] = "paren", _o[LEVEL_ADDITION] = "left", _o[LEVEL_MULTIPLICATION] = "left", _o[LEVEL_BITWISE_AND] = "none", _o[LEVEL_BITWISE_OR] = "none", _o[LEVEL_BITWISE_XOR] = "none", _o[LEVEL_BITWISE_SHIFT] = "left", _o[LEVEL_ASSIGNMENT] = "right", _o);
  Binary.prototype.isLarge = function () {
    return this._isLarge = this.left.isLarge() || this.right.isLarge();
  };
  Binary.prototype.walk = function (walker) {
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
  return exports.Binary = Binary;
}());
BlockStatement = (function () {
  function BlockStatement(body) {
    var _i, _i2, _len, _len2, item, result, self, statement;
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
    self = this instanceof BlockStatement ? this : __create(BlockStatement.prototype);
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
      }
    }
    if (result.length === 1) {
      return result[0];
    }
    self.body = result;
    return self;
  }
  BlockStatement.prototype = __create(Statement.prototype);
  BlockStatement.prototype.constructor = BlockStatement;
  BlockStatement.prototype.compile = function (options, level, lineStart, sb) {
    var _arr, _len, i, item;
    if (level !== LEVEL_BLOCK) {
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
  BlockStatement.prototype.isNoop = function () {
    return this.body.length === 0;
  };
  BlockStatement.prototype.walk = function (walker) {
    var body;
    body = walkArray(this.body, walker);
    if (this.body !== body) {
      return Block(body);
    } else {
      return this;
    }
  };
  return exports.BlockStatement = BlockStatement;
}());
BlockExpression = (function () {
  function BlockExpression(body) {
    var _i, _len, i, item, len, result, self;
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
    self = this instanceof BlockExpression ? this : __create(BlockExpression.prototype);
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
        } else {
          result.push(item);
        }
      }
    }
    if (result.length === 1) {
      return result[0];
    }
    self.body = result;
    return self;
  }
  BlockExpression.prototype = __create(Expression.prototype);
  BlockExpression.prototype.constructor = BlockExpression;
  BlockExpression.prototype.toStatement = function () {
    return BlockStatement(this.body);
  };
  BlockExpression.prototype.compile = function (options, level, lineStart, sb) {
    var _len, body, i, item, len, wrap;
    if (level === LEVEL_BLOCK) {
      this.toStatement().compile(options, level, lineStart, sb);
    } else {
      body = this.body;
      len = body.length;
      if (len === 0) {
        Const(void 0).compile(options, level, lineStart, sb);
      } else if (len === 1) {
        body[0].compile(options, level, lineStart, sb);
      } else {
        wrap = !__lte(level, LEVEL_INSIDE_PARENTHESES);
        if (wrap) {
          sb("(");
        }
        for (i = 0, _len = __num(body.length); i < _len; ++i) {
          item = body[i];
          if (!__lte(i, 0)) {
            sb(", ");
          }
          item.compile(options, LEVEL_SEQUENCE, false, sb);
        }
        if (wrap) {
          sb(")");
        }
      }
    }
  };
  BlockExpression.prototype.isConst = function () {
    return this.body.length === 0;
  };
  BlockExpression.prototype.isNoop = BlockExpression.prototype.isConst;
  BlockExpression.prototype.constValue = function () {
    if (this.body.length === 0) {
      return;
    } else {
      throw Error("BlockExpression has no const value");
    }
  };
  BlockExpression.prototype.type = function () {
    var body;
    body = this.body;
    if (body.length === 0) {
      return types["undefined"];
    } else {
      return body[__num(body.length) - 1].type();
    }
  };
  BlockExpression.prototype.isLarge = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._isLarge) != null ? _ref : (this._isLarge = !__lte(this.body.length, 4) || (function () {
      var _arr, _i, _len, part;
      for (_arr = _this.body, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        part = _arr[_i];
        if (part.isLarge()) {
          return true;
        }
      }
      return false;
    }()));
  };
  BlockExpression.prototype.walk = BlockStatement.prototype.walk;
  return exports.BlockExpression = BlockExpression;
}());
function Block(body) {
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
exports.Block = Block;
Break = (function () {
  function Break() {
    var self;
    self = this instanceof Break ? this : __create(Break.prototype);
    return self;
  }
  Break.prototype = __create(Statement.prototype);
  Break.prototype.constructor = Break;
  Break.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("break;");
  };
  Break.prototype.walk = function () {
    return this;
  };
  return exports.Break = Break;
}());
Call = (function () {
  var PRIMORDIAL_FUNCTIONS;
  function Call(func, args, isNew) {
    var _i, _len, _ref, _this, self;
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
    self = this instanceof Call ? this : __create(Call.prototype);
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
        if (__owns(PRIMORDIAL_FUNCTIONS, func.name) && PRIMORDIAL_FUNCTIONS[func.name] === true && typeof global !== "undefined" && typeof global[func.name] === "function") {
          try {
            return toConst(global[func.name].apply(null, (function () {
              var _arr, _i2, _len2, arg;
              for (_arr = [], _i2 = 0, _len2 = __num(args.length); _i2 < _len2; ++_i2) {
                arg = args[_i2];
                _arr.push(arg.constValue());
              }
              return _arr;
            }())));
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
        } else if (func.left instanceof Ident && func.right.isConst() && typeof func.right.constValue() === "string" && __owns(PRIMORDIAL_FUNCTIONS, func.left.name) && typeof PRIMORDIAL_FUNCTIONS[func.left.name] === "object" && PRIMORDIAL_FUNCTIONS[func.left.name][func.right.constValue()] === true && typeof Object(global[func.left.name])[func.right.constValue()] === "function") {
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
    self.func = func;
    self.args = args;
    self.isNew = isNew;
    return self;
  }
  Call.prototype = __create(Expression.prototype);
  Call.prototype.constructor = Call;
  PRIMORDIAL_FUNCTIONS = {
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
      item.compile(childOptions, LEVEL_SEQUENCE, false, sb);
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
      arg.compile(options, LEVEL_SEQUENCE, false, sb);
    }
    sb(")");
  }
  Call.prototype.compile = function (options, level, lineStart, sb) {
    var f, wrap;
    if (this.isNew) {
      sb("new ");
    }
    wrap = !this.isNew && (this.func instanceof Func || this.func instanceof Binary && this.func.op === "." && this.func.left instanceof Func);
    if (wrap) {
      sb("(");
    }
    this.func.compile(options, LEVEL_CALL, lineStart && !wrap && !this.isNew, sb);
    f = this.shouldCompileLargeArgs() ? compileLarge : compileSmall;
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
  Call.prototype.shouldCompileLargeArgs = function () {
    var _this;
    _this = this;
    if (!__lte(this.args.length, 4)) {
      return true;
    } else {
      return (function () {
        var _arr, _i, _len, arg;
        for (_arr = __slice(_this.args, void 0, -1), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          arg = _arr[_i];
          if ((arg instanceof Arr || arg instanceof Obj) && !arg.isEmpty() || arg.isLarge()) {
            return true;
          }
        }
        return false;
      }());
    }
  };
  Call.prototype.hasLargeArgs = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._hasLargeArgs) != null ? _ref : (this._hasLargeArgs = !__lte(this.args.length, 4) ? true : (function () {
      var _arr, _i, _len, arg;
      for (_arr = _this.args, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        arg = _arr[_i];
        if ((arg instanceof Arr || arg instanceof Obj) && !arg.isEmpty() || arg.isLarge()) {
          return true;
        }
      }
      return false;
    }()));
  };
  Call.prototype.isLarge = function () {
    return this.func.isLarge() || this.hasLargeArgs();
  };
  Call.prototype.walk = function (walker) {
    var _ref, args, func;
    func = (_ref = walker(this.func)) != null ? _ref : this.func.walk(walker);
    args = walkArray(this.args, walker);
    if (this.func !== func || this.args !== args) {
      return Call(func, args, this.isNew);
    } else {
      return this;
    }
  };
  return exports.Call = Call;
}());
function toConst(value) {
  if (value instanceof Node) {
    throw Error("Cannot convert " + __strnum(__typeof(value)) + " to a Const");
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
Const = (function () {
  function Const(value) {
    var self;
    if (value != null && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string" && !(value instanceof RegExp)) {
      throw TypeError("Expected value to be a undefined or null or Boolean or Number or String or RegExp, got " + __typeof(value));
    }
    self = this instanceof Const ? this : __create(Const.prototype);
    self.value = value;
    return self;
  }
  Const.prototype = __create(Expression.prototype);
  Const.prototype.constructor = Const;
  Const.prototype.compile = function (options, level, lineStart, sb) {
    var value, wrap;
    value = this.value;
    wrap = !__lt(level, LEVEL_INCREMENT) && (value === void 0 || typeof value === "number" && !isFinite(value));
    if (wrap) {
      sb("(");
    }
    sb(toJSSource(value));
    if (wrap) {
      sb(")");
    }
  };
  Const.prototype.isConst = function () {
    return true;
  };
  Const.prototype.isNoop = Const.prototype.isConst;
  Const.prototype.constValue = function () {
    return this.value;
  };
  Const.prototype.type = function () {
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
  Const.prototype.walk = function () {
    return this;
  };
  return exports.Const = Const;
}());
Continue = (function () {
  function Continue() {
    var self;
    self = this instanceof Continue ? this : __create(Continue.prototype);
    return self;
  }
  Continue.prototype = __create(Statement.prototype);
  Continue.prototype.constructor = Continue;
  Continue.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("continue;");
  };
  Continue.prototype.walk = function () {
    return this;
  };
  return exports.Continue = Continue;
}());
Debugger = (function () {
  function Debugger() {
    var self;
    self = this instanceof Debugger ? this : __create(Debugger.prototype);
    return self;
  }
  Debugger.prototype = __create(Statement.prototype);
  Debugger.prototype.constructor = Debugger;
  Debugger.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    return sb("debugger;");
  };
  Debugger.prototype.walk = function () {
    return this;
  };
  return exports.Debugger = Debugger;
}());
DoWhile = (function () {
  function DoWhile(body, test) {
    var self;
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    if (!(test instanceof Expression)) {
      throw TypeError("Expected test to be a Expression, got " + __typeof(test));
    }
    self = this instanceof DoWhile ? this : __create(DoWhile.prototype);
    self.body = body.maybeToStatement();
    self.test = test;
    return self;
  }
  DoWhile.prototype = __create(Statement.prototype);
  DoWhile.prototype.constructor = DoWhile;
  DoWhile.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
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
    this.test.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    sb(");");
  };
  DoWhile.prototype.walk = function (walker) {
    var _ref, body, test;
    body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
    test = (_ref = walker(this.test)) != null ? _ref : this.test.walk(walker);
    if (body !== this.body || test !== this.test) {
      return DoWhile(body, test);
    } else {
      return this;
    }
  };
  return exports.DoWhile = DoWhile;
}());
Eval = (function () {
  function Eval(code) {
    var self;
    self = this instanceof Eval ? this : __create(Eval.prototype);
    if (!(code instanceof Expression)) {
      code = toConst(code);
    }
    self.code = code;
    return self;
  }
  Eval.prototype = __create(Expression.prototype);
  Eval.prototype.constructor = Eval;
  Eval.prototype.compile = function (options, level, lineStart, sb) {
    if (this.code instanceof Const) {
      sb(String(this.code.value));
    } else {
      sb("eval(");
      this.code.compile(options, LEVEL_SEQUENCE, false, sb);
      sb(")");
    }
  };
  Eval.prototype.walk = function (walker) {
    var _ref, code;
    code = (_ref = walker(this.code)) != null ? _ref : this.code.walk(walker);
    if (code !== this.code) {
      return Eval(code);
    } else {
      return this;
    }
  };
  return exports.Eval = Eval;
}());
For = (function () {
  function For(init, test, step, body) {
    var self;
    if (init == null) {
      init = BlockExpression();
    } else if (!(init instanceof Expression)) {
      throw TypeError("Expected init to be a Expression, got " + __typeof(init));
    }
    if (test == null) {
      test = Const(true);
    } else if (!(test instanceof Expression)) {
      throw TypeError("Expected test to be a Expression, got " + __typeof(test));
    }
    if (step == null) {
      step = BlockExpression();
    } else if (!(step instanceof Expression)) {
      throw TypeError("Expected step to be a Expression, got " + __typeof(step));
    }
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = this instanceof For ? this : __create(For.prototype);
    self.init = init;
    self.test = test;
    self.step = step;
    self.body = body.maybeToStatement();
    return self;
  }
  For.prototype = __create(Statement.prototype);
  For.prototype.constructor = For;
  For.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("for (");
    if (!this.init.isNoop()) {
      this.init.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    }
    sb("; ");
    if (!this.test.isConst() || !this.test.constValue()) {
      this.test.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    }
    sb("; ");
    if (!this.step.isNoop()) {
      this.step.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  For.prototype.walk = function (walker) {
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
  return exports.For = For;
}());
ForIn = (function () {
  function ForIn(key, object, body) {
    var self;
    if (!(key instanceof Ident)) {
      throw TypeError("Expected key to be a Ident, got " + __typeof(key));
    }
    if (!(object instanceof Expression)) {
      throw TypeError("Expected object to be a Expression, got " + __typeof(object));
    }
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = this instanceof ForIn ? this : __create(ForIn.prototype);
    self.key = key;
    self.object = object;
    self.body = body.maybeToStatement();
    return self;
  }
  ForIn.prototype = __create(Statement.prototype);
  ForIn.prototype.constructor = ForIn;
  ForIn.prototype.compile = function (options, level, lineStart, sb) {
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("for (");
    this.key.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    sb(" in ");
    this.object.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  ForIn.prototype.walk = function (walker) {
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
  return exports.ForIn = ForIn;
}());
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
    name.compile(sb, LEVEL_INSIDE_PARENTHESES, false, sb);
  }
  sb("(");
  for (i = 0, _len = __num(params.length); i < _len; ++i) {
    param = params[i];
    if (!__lte(i, 0)) {
      sb(", ");
    }
    param.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
Func = (function () {
  function Func(name, params, variables, body, declarations) {
    var _i, _i2, _i3, _i4, _len, _len2, _len3, _len4, self;
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
    self = this instanceof Func ? this : __create(Func.prototype);
    validateFuncParamsAndVariables(params, variables);
    self.name = name;
    self.params = params;
    self.variables = variables;
    self.body = body;
    self.declarations = declarations;
    return self;
  }
  Func.prototype = __create(Expression.prototype);
  Func.prototype.constructor = Func;
  Func.prototype.compile = function (options, level, lineStart, sb) {
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
  Func.prototype.compileAsStatement = function (options, lineStart, sb) {
    this.compile(options, LEVEL_BLOCK, lineStart, sb);
    if (!lineStart || !this.name) {
      sb(";");
    }
  };
  Func.prototype.type = function () {
    return types["function"];
  };
  Func.prototype.isLarge = function () {
    return true;
  };
  Func.prototype.walk = function (walker) {
    var _ref, body, name, params;
    name = this.name ? (_ref = walker(this.name)) != null ? _ref : this.name.walk(walker) : this.name;
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
  return exports.Func = Func;
}());
Ident = (function () {
  function Ident(name) {
    var self;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    self = this instanceof Ident ? this : __create(Ident.prototype);
    if (!isAcceptableIdent(name)) {
      throw Error("Not an acceptable identifier name: " + __strnum(name));
    }
    self.name = name;
    return self;
  }
  Ident.prototype = __create(Expression.prototype);
  Ident.prototype.constructor = Ident;
  Ident.prototype.compile = function (options, level, lineStart, sb) {
    sb(this.name);
  };
  Ident.prototype.walk = function () {
    return this;
  };
  return exports.Ident = Ident;
}());
IfStatement = (function () {
  function IfStatement(test, whenTrue, whenFalse) {
    var self;
    if (!(test instanceof Expression)) {
      throw TypeError("Expected test to be a Expression, got " + __typeof(test));
    }
    if (!(whenTrue instanceof Node)) {
      throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
    }
    if (whenFalse == null) {
      whenFalse = BlockExpression();
    } else if (!(whenFalse instanceof Node)) {
      throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
    }
    self = this instanceof IfStatement ? this : __create(IfStatement.prototype);
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
          return test;
        } else {
          return IfStatement.call(self, Unary("!", test), whenFalse, BlockStatement());
        }
      } else {
        self.test = test;
        self.whenTrue = whenTrue;
        self.whenFalse = whenFalse;
        return self;
      }
    }
  }
  IfStatement.prototype = __create(Statement.prototype);
  IfStatement.prototype.constructor = IfStatement;
  IfStatement.prototype.compile = function (options, level, lineStart, sb) {
    var childOptions, whenFalse;
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("if (");
    this.test.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  IfStatement.prototype.walk = function (walker) {
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
  return exports.IfStatement = IfStatement;
}());
IfExpression = (function () {
  function IfExpression(test, whenTrue, whenFalse) {
    var self;
    if (!(test instanceof Expression)) {
      throw TypeError("Expected test to be a Expression, got " + __typeof(test));
    }
    if (!(whenTrue instanceof Expression)) {
      throw TypeError("Expected whenTrue to be a Expression, got " + __typeof(whenTrue));
    }
    if (whenFalse == null) {
      whenFalse = BlockExpression();
    } else if (!(whenFalse instanceof Expression)) {
      throw TypeError("Expected whenFalse to be a Expression, got " + __typeof(whenFalse));
    }
    self = this instanceof IfExpression ? this : __create(IfExpression.prototype);
    if (test.isConst()) {
      if (test.constValue()) {
        return whenTrue;
      } else {
        return whenFalse;
      }
    } else if (whenTrue.isConst() && whenFalse.isConst() && whenTrue.constValue() === whenFalse.constValue()) {
      return BlockExpression([test, whenTrue]);
    } else {
      self.test = test;
      self.whenTrue = whenTrue;
      self.whenFalse = whenFalse;
      return self;
    }
  }
  IfExpression.prototype = __create(Expression.prototype);
  IfExpression.prototype.constructor = IfExpression;
  IfExpression.prototype.toStatement = function () {
    return IfStatement(this.test, this.whenTrue, this.whenFalse);
  };
  IfExpression.prototype.compile = function (options, level, lineStart, sb) {
    var wrap, wrapTest;
    if (level === LEVEL_BLOCK) {
      this.toStatement().compile(options, level, lineStart, sb);
    } else {
      wrap = !__lte(level, LEVEL_INLINE_CONDITION);
      if (wrap) {
        sb("(");
      }
      wrapTest = this.test instanceof IfExpression;
      if (wrapTest) {
        sb("(");
      }
      this.test.compile(options, wrapTest ? LEVEL_INSIDE_PARENTHESES : LEVEL_INLINE_CONDITION, lineStart && !wrap && !wrapTest, sb);
      if (wrapTest) {
        sb(")");
      }
      sb(" ? ");
      this.whenTrue.compile(options, LEVEL_INLINE_CONDITION, false, sb);
      sb(" : ");
      this.whenFalse.compile(options, LEVEL_INLINE_CONDITION, false, sb);
      if (wrap) {
        sb(")");
      }
    }
  };
  IfExpression.prototype.type = function () {
    var _ref;
    return (_ref = this._type) != null ? _ref : (this._type = this.whenTrue.type().union(this.whenFalse.type()));
  };
  IfExpression.prototype.isLarge = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._isLarge) != null ? _ref : (this._isLarge = (function () {
      var _arr, _i, _len, part;
      for (_arr = [_this.test, _this.whenTrue, _this.whenFalse], _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        part = _arr[_i];
        if ((part instanceof Arr || part instanceof Obj) && !part.isEmpty() || part.isLarge()) {
          return true;
        }
      }
      return false;
    }()));
  };
  IfExpression.prototype.walk = IfStatement.prototype.walk;
  return exports.IfExpression = IfExpression;
}());
function If(test, whenTrue, whenFalse) {
  if (whenTrue instanceof Expression && (!whenFalse || whenFalse instanceof Expression)) {
    return IfExpression(test, whenTrue, whenFalse);
  } else {
    return IfStatement(test, whenTrue, whenFalse);
  }
}
exports.If = If;
Obj = (function () {
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
  function Obj(elements) {
    var _i, _len, self;
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
    self = this instanceof Obj ? this : __create(Obj.prototype);
    validateUniqueKeys(elements);
    self.elements = elements;
    return self;
  }
  Obj.prototype = __create(Expression.prototype);
  Obj.prototype.constructor = Obj;
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
      element.value.compile(childOptions, LEVEL_SEQUENCE, false, sb);
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
        element.value.compile(options, LEVEL_SEQUENCE, false, sb);
      }
      sb(" ");
    }
  }
  Obj.prototype.compile = function (options, level, lineStart, sb) {
    var f;
    if (lineStart) {
      sb("(");
    }
    sb("{");
    f = this.isLarge() ? compileLarge : compileSmall;
    f(this.elements, options, sb);
    sb("}");
    if (lineStart) {
      sb(")");
    }
  };
  Obj.prototype.type = function () {
    return types.object;
  };
  Obj.prototype.isEmpty = function () {
    return this.elements.length === 0;
  };
  Obj.prototype.isLarge = function () {
    var _ref, _this;
    _this = this;
    return (_ref = this._isLarge) != null ? _ref : (this._isLarge = !__lte(this.elements.length, 4) || (function () {
      var _arr, _i, _len, _ref, element;
      for (_arr = _this.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        element = _arr[_i];
        if (((_ref = element.value) instanceof Arr || _ref instanceof Obj) && !element.value.isEmpty() || element.isLarge()) {
          return true;
        }
      }
      return false;
    }()));
  };
  Obj.prototype.walk = function (walker) {
    var elements;
    elements = walkArray(this.elements, walker);
    if (elements !== this.elements) {
      return Obj(elements);
    } else {
      return this;
    }
  };
  function ObjPair(key, value) {
    var self;
    if (typeof key !== "string") {
      throw TypeError("Expected key to be a String, got " + __typeof(key));
    }
    self = this instanceof ObjPair ? this : __create(ObjPair.prototype);
    self.key = key;
    if (!(value instanceof Expression)) {
      value = toConst(value);
    }
    self.value = value;
    return self;
  }
  Obj.Pair = ObjPair;
  ObjPair.prototype.isLarge = function () {
    return this.value.isLarge();
  };
  ObjPair.prototype.walk = function (walker) {
    var _ref, value;
    value = (_ref = walker(this.value)) != null ? _ref : this.value.walk(walker);
    if (value !== this.value) {
      return ObjPair(this.key, value);
    } else {
      return this;
    }
  };
  return exports.Obj = Obj;
}());
Return = (function () {
  function Return(node) {
    var self;
    if (node == null) {
      node = Const(void 0);
    } else if (!(node instanceof Expression)) {
      throw TypeError("Expected node to be a Expression, got " + __typeof(node));
    }
    this.node = node;
    self = this instanceof Return ? this : __create(Return.prototype);
    self.node = node;
    return self;
  }
  Return.prototype = __create(Statement.prototype);
  Return.prototype.constructor = Return;
  Return.prototype.compile = function (options, level, lineStart, sb) {
    sb("return");
    if (!this.node.isConst() || this.node.constValue() !== void 0) {
      sb(" ");
      this.node.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    }
    sb(";");
  };
  Return.prototype.walk = function (walker) {
    var _ref, node;
    node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
    if (node !== this.node) {
      return Return(node);
    } else {
      return this;
    }
  };
  return exports.Return = Return;
}());
Root = (function () {
  function Root(body, variables, declarations) {
    var _i, _i2, _i3, _i4, _len, _len2, _len3, _len4, _ref, item, self, statement;
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
    self = this instanceof Root ? this : __create(Root.prototype);
    validateFuncParamsAndVariables([], variables);
    self.body = [];
    for (_i4 = 0, _len4 = __num(body.length); _i4 < _len4; ++_i4) {
      item = body[_i4];
      statement = item.maybeToStatement();
      if (statement instanceof BlockStatement) {
        (_ref = self.body).push.apply(_ref, __toArray(statement.body));
      } else {
        self.body.push(statement);
      }
    }
    self.variables = variables;
    self.declarations = declarations;
    return self;
  }
  Root.prototype.compile = function (options) {
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
  Root.prototype.toString = function () {
    return this.compile();
  };
  Root.prototype.toFunction = Node.prototype.toFunction;
  Root.prototype.isLarge = function () {
    return true;
  };
  Root.prototype.walk = function (walker) {
    var body;
    body = walkArray(this.body, walker);
    if (body !== this.body) {
      return Root(body, this.variables, this.declarations);
    } else {
      return this;
    }
  };
  return exports.Root = Root;
}());
This = (function () {
  function This() {
    var self;
    self = this instanceof This ? this : __create(This.prototype);
    return self;
  }
  This.prototype = __create(Expression.prototype);
  This.prototype.constructor = This;
  This.prototype.compile = function (options, level, lineStart, sb) {
    sb("this");
  };
  This.prototype.walk = function () {
    return this;
  };
  return exports.This = This;
}());
Throw = (function () {
  function Throw(node) {
    var self;
    if (!(node instanceof Expression)) {
      throw TypeError("Expected node to be a Expression, got " + __typeof(node));
    }
    self = this instanceof Throw ? this : __create(Throw.prototype);
    self.node = node;
    return self;
  }
  Throw.prototype = __create(Statement.prototype);
  Throw.prototype.constructor = Throw;
  Throw.prototype.compile = function (options, level, lineStart, sb) {
    sb("throw ");
    this.node.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    return sb(";");
  };
  Throw.prototype.walk = function (walker) {
    var _ref, node;
    node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
    if (node !== this.node) {
      return Throw(node);
    } else {
      return this;
    }
  };
  return exports.Throw = Throw;
}());
Switch = (function () {
  function Switch(node, cases, defaultCase) {
    var _i, _len, self;
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
      defaultCase = BlockStatement();
    } else if (!(defaultCase instanceof Node)) {
      throw TypeError("Expected defaultCase to be a Node, got " + __typeof(defaultCase));
    }
    self = this instanceof Switch ? this : __create(Switch.prototype);
    self.node = node;
    self.cases = cases;
    self.defaultCase = defaultCase.maybeToStatement();
    return self;
  }
  Switch.prototype = __create(Statement.prototype);
  Switch.prototype.constructor = Switch;
  Switch.prototype.compile = function (options, level, lineStart, sb) {
    var _arr, _i, _len, case_, childOptions;
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("switch (");
    this.node.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
    sb(") {");
    childOptions = incIndent(options);
    for (_arr = this.cases, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      case_ = _arr[_i];
      sb("\n");
      sb.indent(options.indent);
      sb("case ");
      case_.node.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  Switch.prototype.walk = function (walker) {
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
  function SwitchCase(node, body) {
    var self;
    if (!(node instanceof Expression)) {
      throw TypeError("Expected node to be a Expression, got " + __typeof(node));
    }
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = this instanceof SwitchCase ? this : __create(SwitchCase.prototype);
    self.node = node;
    self.body = body.maybeToStatement();
    return self;
  }
  Switch.Case = SwitchCase;
  SwitchCase.prototype.isLarge = function () {
    return true;
  };
  SwitchCase.prototype.walk = function (walker) {
    var _ref, body, node;
    node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
    body = (_ref = walker(this.body)) != null ? _ref : this.body.walk(walker);
    if (node !== this.node || body !== this.body) {
      return SwitchCase(node, body);
    } else {
      return this;
    }
  };
  return exports.Switch = Switch;
}());
TryCatch = (function () {
  function TryCatch(tryBody, catchIdent, catchBody) {
    var self;
    if (!(tryBody instanceof Node)) {
      throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
    }
    if (!(catchIdent instanceof Ident)) {
      throw TypeError("Expected catchIdent to be a Ident, got " + __typeof(catchIdent));
    }
    if (!(catchBody instanceof Node)) {
      throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
    }
    self = this instanceof TryCatch ? this : __create(TryCatch.prototype);
    self.tryBody = tryBody.maybeToStatement();
    if (self.tryBody.isNoop()) {
      return BlockStatement();
    }
    self.catchIdent = catchIdent;
    self.catchBody = catchBody.maybeToStatement();
    return self;
  }
  TryCatch.prototype = __create(Statement.prototype);
  TryCatch.prototype.constructor = TryCatch;
  TryCatch.prototype.compile = function (options, level, lineStart, sb) {
    var childOptions;
    if (level !== LEVEL_BLOCK) {
      throw Error("Cannot compile a statement except on the Block level");
    }
    sb("try {\n");
    childOptions = incIndent(options);
    sb.indent(childOptions.indent);
    this.tryBody.compileAsStatement(childOptions, true, sb);
    sb("\n");
    sb.indent(options.indent);
    sb("} catch (");
    this.catchIdent.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  TryCatch.prototype.walk = function (walker) {
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
  return exports.TryCatch = TryCatch;
}());
TryFinally = (function () {
  function TryFinally(tryBody, finallyBody) {
    var self;
    if (!(tryBody instanceof Node)) {
      throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
    }
    if (!(finallyBody instanceof Node)) {
      throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
    }
    self = this instanceof TryFinally ? this : __create(TryFinally.prototype);
    self.tryBody = tryBody.maybeToStatement();
    self.finallyBody = finallyBody.maybeToStatement();
    if (self.tryBody.isNoop()) {
      if (self.finallyBody.isNoop()) {
        return BlockStatement();
      } else {
        return self.finallyBody;
      }
    } else if (self.finallyBody.isNoop()) {
      return self.tryBody;
    } else {
      return self;
    }
  }
  TryFinally.prototype = __create(Statement.prototype);
  TryFinally.prototype.constructor = TryFinally;
  TryFinally.prototype.compile = function (options, level, lineStart, sb) {
    var childOptions;
    if (level !== LEVEL_BLOCK) {
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
      this.tryBody.catchIdent.compile(options, LEVEL_INSIDE_PARENTHESES, false, sb);
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
  TryFinally.prototype.walk = function (walker) {
    var _ref, finallyBody, tryBody;
    tryBody = (_ref = walker(this.tryBody)) != null ? _ref : this.tryBody.walk(walker);
    finallyBody = (_ref = walker(this.finallyBody)) != null ? _ref : this.finallyBody.walk(walker);
    if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
      return TryCatch(tryBody, finallyBody);
    } else {
      return this;
    }
  };
  return exports.TryFinally = TryFinally;
}());
Unary = (function () {
  var CONST_OPERATIONS, KNOWN_OPERATORS, NONCONST_OPERATIONS, OPERATOR_TYPES;
  function Unary(op, node) {
    var _ref, self;
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    self = this instanceof Unary ? this : __create(Unary.prototype);
    if (!__in(op, KNOWN_OPERATORS)) {
      throw Error("Unknown unary operator: " + __strnum(op));
    }
    if (op === "delete" && (!(node instanceof Binary) || node.op !== ".")) {
      throw Error("Cannot use delete operator on a non-access");
    }
    if (!(node instanceof Expression)) {
      node = toConst(node);
    }
    if (node.isConst() && __owns(CONST_OPERATIONS, op)) {
      return Const(CONST_OPERATIONS[op](node.constValue()));
    }
    if (__owns(NONCONST_OPERATIONS, op)) {
      if ((_ref = NONCONST_OPERATIONS[op](node)) != null) {
        return _ref;
      }
    }
    self.op = op;
    self.node = node;
    return self;
  }
  Unary.prototype = __create(Expression.prototype);
  Unary.prototype.constructor = Unary;
  Unary.prototype.compile = function (options, level, lineStart, sb) {
    var op;
    op = this.op;
    if (op === "++post" || op === "--post") {
      this.node.compile(options, LEVEL_UNARY, false, sb);
      sb(op.substring(0, 2));
    } else {
      sb(op);
      if (op === "typeof" || op === "void" || op === "delete" || (op === "+" || op === "-" || op === "++" || op === "--") && (this.node instanceof Unary && (op === "+" || op === "-" || op === "++" || op === "--") || this.node instanceof Const && typeof this.node.value === "number" && __lt(this.node.value, 0))) {
        sb(" ");
      }
      this.node.compile(options, LEVEL_UNARY, false, sb);
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
          return Unary(x.op === "-" ? "+" : "-", x.node);
        }
      } else if (x instanceof Binary) {
        if ((_ref = x.op) === "-" || _ref === "+") {
          return Binary(x.left, x.op === "-" ? "+" : "-", x.right);
        } else if ((_ref = x.op) === "*" || _ref === "/") {
          return Binary(Unary("-", x.left), x.op, x.right);
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
          return Binary(Unary("!", x), "||", Unary("!", y));
        },
        "||": function (x, y) {
          return Binary(Unary("!", x), "&&", Unary("!", y));
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
  Unary.prototype.type = function () {
    return OPERATOR_TYPES[this.op];
  };
  Unary.prototype.isLarge = function () {
    return this.node.isLarge();
  };
  Unary.prototype.walk = function (walker) {
    var _ref, node;
    node = (_ref = walker(this.node)) != null ? _ref : this.node.walk(walker);
    if (node !== this.node) {
      return Unary(this.op, node);
    } else {
      return this;
    }
  };
  return exports.Unary = Unary;
}());
function While(test, body) {
  return For(null, test, null, body);
}
exports.While = While;
