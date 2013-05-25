(function () {
  "use strict";
  var __cmp, __create, __import, __in, __isArray, __lt, __lte, __name, __num,
      __owns, __slice, __strnum, __toArray, __typeof, _ref, Arguments, Arr,
      Binary, Block, BlockExpression, BlockStatement, Break, Call, Comment,
      Const, Continue, Debugger, DoWhile, Eval, Expression, For, ForIn,
      fromJSON, Func, getIndent, Ident, If, IfExpression, IfStatement, inspect,
      isAcceptableIdent, Node, Noop, Obj, padLeft, Regex, Return, Root,
      Statement, Switch, This, Throw, toJSIdent, toJSSource, TryCatch,
      TryFinally, Unary, util, While;
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
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
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
  __name = function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
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
      return __slice.call(x);
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
  util = require("util");
  if (util != null) {
    inspect = util.inspect;
  }
  padLeft = require("./utils").padLeft;
  _ref = require("./jsutils");
  isAcceptableIdent = _ref.isAcceptableIdent;
  toJSSource = _ref.toJSSource;
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
          result = __strnum(result) + "  ";
          cache.push(result);
        }
      }
      return cache[indent];
    };
  }());
  function wrapStringHandler(callback) {
    function cb(item) {
      var len, parts, s;
      s = String(item);
      parts = s.split(/(?:\r\n?|[\n\u2028\u2029])/g);
      if (parts.length === 1) {
        cb.column = __num(cb.column) + __num(parts[0].length);
      } else {
        len = parts.length;
        cb.line = __num(cb.line) + (__num(len) - 1);
        cb.column = __num(parts[__num(len) - 1].length) + 1;
      }
      callback(s);
    }
    cb.line = 1;
    cb.column = 1;
    cb.indent = function (count) {
      callback(getIndent(count));
      cb.column = __num(cb.column) + __num(count);
    };
    return cb;
  }
  function StringWriter(callback) {
    var sb;
    return sb = wrapStringHandler(callback);
  }
  function StringBuilder() {
    var data, sb;
    data = [];
    sb = wrapStringHandler(function (item) {
      data.push(item);
    });
    sb.toString = function () {
      var text;
      switch (data.length) {
      case 0: return "";
      case 1: return data[0];
      default:
        text = data.join("");
        data.splice(0, data.length, text);
        return text;
      }
    };
    return sb;
  }
  exports.Node = Node = (function () {
    var _Node_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw Error("Node cannot be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    Node.displayName = "Node";
    _Node_prototype.toString = function (options) {
      var sb;
      if (options == null) {
        options = {};
      }
      sb = StringBuilder();
      this.compileAsStatement(
        __import(
          { indent: 0, bare: true },
          options
        ),
        true,
        sb
      );
      return sb.toString();
    };
    _Node_prototype.compile = function () {
      throw Error("Not implemented: " + __name(this.constructor) + ".compile()");
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
    _Node_prototype.toJSON = function () {
      return [this.constructor.name, this.pos.line, this.pos.column, this.pos.file || 0].concat(__toArray(this._toJSON()));
    };
    _Node_prototype._toJSON = function () {
      return [];
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
    if (typeof Node.extended === "function") {
      Node.extended(Expression);
    }
    _Expression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      this.compile(options, level, lineStart, sb);
    };
    _Expression_prototype.compileAsStatement = function (options, lineStart, sb) {
      if (typeof this.toStatement === "function") {
        this.toStatement().compileAsStatement(options, lineStart, sb);
      } else {
        this.compile(options, 1, lineStart, sb);
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
    if (typeof Node.extended === "function") {
      Node.extended(Statement);
    }
    _Statement_prototype.compileAsStatement = function (options, lineStart, sb) {
      return this.compile(options, 1, lineStart, sb);
    };
    return Statement;
  }(Node));
  exports.Access = function (pos, parent) {
    var _i, _len, child, children, current;
    children = __slice.call(arguments, 2);
    current = parent;
    for (_i = 0, _len = children.length; _i < _len; ++_i) {
      child = children[_i];
      current = Binary(pos, current, ".", child);
    }
    return current;
  };
  function makePos(line, column, file) {
    var pos;
    if (typeof line !== "number") {
      throw TypeError("Expected line to be a Number, got " + __typeof(line));
    }
    if (typeof column !== "number") {
      throw TypeError("Expected column to be a Number, got " + __typeof(column));
    }
    if (file == null) {
      file = void 0;
    } else if (typeof file !== "string" && typeof file !== "number") {
      throw TypeError("Expected file to be one of String or Number or undefined, got " + __typeof(file));
    }
    pos = { line: line, column: column };
    if (file) {
      if (typeof file !== "string") {
        throw TypeError("Must provide a valid string for file");
      }
      pos.file = file;
    }
    return pos;
  }
  exports.Arguments = Arguments = (function (Expression) {
    var _Arguments_prototype, _Expression_prototype;
    function Arguments(pos) {
      var _this;
      _this = this instanceof Arguments ? this : __create(_Arguments_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Arguments_prototype = Arguments.prototype = __create(_Expression_prototype);
    _Arguments_prototype.constructor = Arguments;
    Arguments.displayName = "Arguments";
    if (typeof Expression.extended === "function") {
      Expression.extended(Arguments);
    }
    _Arguments_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if ((_ref = options.sourcemap) != null) {
        _ref.add(
          sb.line,
          sb.column,
          this.pos.line,
          this.pos.column,
          this.pos.file
        );
      }
      sb("arguments");
    };
    _Arguments_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop(this.pos).compileAsBlock(options, level, lineStart, sb);
    };
    _Arguments_prototype.walk = function () {
      return this;
    };
    _Arguments_prototype.isNoop = function () {
      return true;
    };
    _Arguments_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Arguments", this.pos);
    };
    Arguments.fromJSON = function (line, column, file) {
      return Arguments(makePos(line, column, file));
    };
    return Arguments;
  }(Expression));
  function walkArray(array, walker) {
    var _arr, _i, _len, changed, item, newItem, result;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be an Array, got " + __typeof(array));
    }
    if (typeof walker !== "function") {
      throw TypeError("Expected walker to be a Function, got " + __typeof(walker));
    }
    changed = false;
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
    result = _arr;
    if (changed) {
      return result;
    } else {
      return array;
    }
  }
  function decDepth(depth) {
    if (depth != null) {
      return __num(depth) - 1;
    } else {
      return null;
    }
  }
  function inspectHelper(depth, name, pos) {
    var _arr, _i, _len, _some, arg, args, d, found, hasLarge, part, parts;
    args = __slice.call(arguments, 3);
    d = decDepth(depth);
    found = false;
    for (_i = args.length; _i--; ) {
      arg = args[_i];
      if (!arg || arg instanceof Noop || __isArray(arg) && arg.length === 0) {
        args.pop();
      } else {
        break;
      }
    }
    for (_arr = [], _i = 0, _len = args.length; _i < _len; ++_i) {
      arg = args[_i];
      _arr.push(inspect(arg, null, d));
    }
    parts = _arr;
    _some = false;
    for (_i = 0, _len = parts.length; _i < _len; ++_i) {
      part = parts[_i];
      if (parts.length > 50 || part.indexOf("\n") !== -1) {
        _some = true;
        break;
      }
    }
    hasLarge = _some;
    if (hasLarge) {
      for (_arr = [], _i = 0, _len = parts.length; _i < _len; ++_i) {
        part = parts[_i];
        _arr.push("  " + __strnum(part.split("\n").join("\n  ")));
      }
      parts = _arr;
      return __strnum(name) + "(\n" + __strnum(parts.join(",\n")) + ")";
    } else {
      return __strnum(name) + "(" + __strnum(parts.join(", ")) + ")";
    }
  }
  function simplifyArray(array, childDefaultValue, keepTrailing) {
    var _len, i, item, lastNoop, result;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be an Array, got " + __typeof(array));
    }
    if (keepTrailing == null) {
      keepTrailing = false;
    } else if (typeof keepTrailing !== "boolean") {
      throw TypeError("Expected keepTrailing to be a Boolean, got " + __typeof(keepTrailing));
    }
    if (array.length === 0) {
      return array;
    } else {
      result = [];
      lastNoop = -1;
      for (i = 0, _len = array.length; i < _len; ++i) {
        item = array[i];
        if (item instanceof Noop) {
          lastNoop = i;
        } else {
          lastNoop = -1;
        }
        result.push(simplify(item, childDefaultValue));
      }
      if (!keepTrailing && lastNoop !== -1) {
        result.splice(lastNoop, 1/0);
      }
      return result;
    }
  }
  function simplify(obj, defaultValue) {
    if (__isArray(obj)) {
      return simplifyArray(obj);
    } else if (obj instanceof Noop) {
      return defaultValue;
    } else {
      return obj;
    }
  }
  exports.Arr = Arr = (function (Expression) {
    var _Arr_prototype, _Expression_prototype;
    function Arr(pos, elements) {
      var _i, _this;
      _this = this instanceof Arr ? this : __create(_Arr_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (elements == null) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = elements.length; _i--; ) {
          if (!(elements[_i] instanceof Expression)) {
            throw TypeError("Expected " + ("elements[" + _i + "]") + " to be a " + __name(Expression) + ", got " + __typeof(elements[_i]));
          }
        }
      }
      _this.elements = elements;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Arr_prototype = Arr.prototype = __create(_Expression_prototype);
    _Arr_prototype.constructor = Arr;
    Arr.displayName = "Arr";
    if (typeof Expression.extended === "function") {
      Expression.extended(Arr);
    }
    function compileLarge(elements, options, level, lineStart, sb) {
      var _arr, childOptions, i, item, len;
      childOptions = incIndent(options);
      for (_arr = __toArray(elements), i = 0, len = _arr.length; i < len; ++i) {
        item = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, 3, false, sb);
        if (i < len - 1) {
          sb(",");
        }
      }
      sb("\n");
      sb.indent(options.indent);
    }
    function compileSmall(elements, options, level, lineStart, sb) {
      var _arr, _len, i, item;
      for (_arr = __toArray(elements), i = 0, _len = _arr.length; i < _len; ++i) {
        item = _arr[i];
        if (i > 0) {
          sb(",");
          if (!options.minify) {
            sb(" ");
          }
        }
        item.compile(options, 3, false, sb);
      }
    }
    _Arr_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, f;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      sb("[");
      if (!options.minify && this.shouldCompileLarge()) {
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
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Arr_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      return BlockExpression(this.pos, this.elements).compileAsBlock(options, level, lineStart, sb);
    };
    _Arr_prototype.compileAsStatement = function (options, lineStart, sb) {
      BlockStatement(this.pos, this.elements).compile(options, 1, lineStart, sb);
    };
    _Arr_prototype.shouldCompileLarge = function () {
      switch (this.elements.length) {
      case 0: return false;
      case 1: return this.elements[0].isLarge();
      default: return this.isLarge();
      }
    };
    _Arr_prototype.isSmall = function () {
      switch (this.elements.length) {
      case 0: return true;
      case 1: return this.elements[0].isSmall();
      default: return false;
      }
    };
    _Arr_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _some, element;
          _some = false;
          for (_arr = __toArray(_this.elements), _i = _arr.length; _i--; ) {
            element = _arr[_i];
            if (!element.isSmall()) {
              _some = true;
              break;
            }
          }
          return _some;
        }());
      } else {
        return _ref;
      }
    };
    _Arr_prototype.isNoop = function () {
      var _arr, _every, _i, _ref, element;
      if ((_ref = this._isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.elements), _i = _arr.length; _i--; ) {
          element = _arr[_i];
          if (!element.isNoop()) {
            _every = false;
            break;
          }
        }
        return this._isNoop = _every;
      } else {
        return _ref;
      }
    };
    _Arr_prototype.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (this.elements !== elements) {
        return Arr(this.pos, elements);
      } else {
        return this;
      }
    };
    _Arr_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Arr", this.pos, this.elements);
    };
    _Arr_prototype._toJSON = function () {
      return simplifyArray(this.elements, 0);
    };
    Arr.fromJSON = function (line, column, file) {
      var elements;
      elements = __slice.call(arguments, 3);
      return Arr(
        makePos(line, column, file),
        arrayFromJSON(elements)
      );
    };
    return Arr;
  }(Expression));
  exports.Assign = function (pos, left, right) {
    return Binary(pos, left, "=", right);
  };
  exports.BinaryChain = function (pos, op) {
    var _i, _len, arg, args, current, i, left, right;
    args = __slice.call(arguments, 2);
    if (op === "+") {
      for (i = args.length - 2; i >= 0; --i) {
        left = args[i];
        right = args[i + 1];
        if ((typeof left === "string" || left instanceof Const && typeof left.value === "string") && (typeof right === "string" || right instanceof Const && typeof right.value === "string")) {
          args.splice(i, 2, __strnum(typeof left === "string" ? left : left.value) + __strnum(typeof right === "string" ? right : right.value));
        }
      }
    }
    current = args[0];
    for (_i = 1, _len = args.length; _i < _len; ++_i) {
      arg = args[_i];
      current = Binary(pos, current, op, arg);
    }
    return current;
  };
  exports.And = function (pos) {
    var _end, args, current, i;
    args = __slice.call(arguments, 1);
    if (args.length === 0) {
      return Const(pos, true);
    } else {
      current = args[0];
      for (i = 1, _end = args.length; i < _end; ++i) {
        current = Binary(pos, current, "&&", args[i]);
      }
      return current;
    }
  };
  exports.Or = function (pos) {
    var _end, args, current, i;
    args = __slice.call(arguments, 1);
    if (args.length === 0) {
      return Const(pos, false);
    } else {
      current = args[0];
      for (i = 1, _end = args.length; i < _end; ++i) {
        current = Binary(pos, current, "||", args[i]);
      }
      return current;
    }
  };
  function toConst(pos, value) {
    if (value instanceof Node) {
      throw Error("Cannot convert " + __typeof(value) + " to a Const");
    } else if (value instanceof RegExp) {
      return Regex(pos, value.source, value.flags);
    } else {
      return Const(pos, value);
    }
  }
  function isNegative(value) {
    if (typeof value !== "number") {
      throw TypeError("Expected value to be a Number, got " + __typeof(value));
    }
    return value < 0 || value === 0 && 1 / value < 0;
  }
  exports.Binary = Binary = (function (Expression) {
    var _Binary_prototype, _Expression_prototype, ASSIGNMENT_OPS,
        LEVEL_TO_ASSOCIATIVITY, OPERATOR_PRECEDENCE;
    function Binary(pos, left, op, right) {
      var _this;
      _this = this instanceof Binary ? this : __create(_Binary_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (left == null) {
        left = Noop(pos);
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      _this.op = op;
      if (right == null) {
        right = Noop(pos);
      }
      if (!__owns.call(OPERATOR_PRECEDENCE, op)) {
        throw Error("Unknown binary operator: " + __strnum(toJSSource(op)));
      }
      if (!(left instanceof Expression)) {
        left = toConst(pos, left);
      }
      if (!(right instanceof Expression)) {
        right = toConst(pos, right);
      }
      _this.left = left;
      _this.right = right;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Binary_prototype = Binary.prototype = __create(_Expression_prototype);
    _Binary_prototype.constructor = Binary;
    Binary.displayName = "Binary";
    if (typeof Expression.extended === "function") {
      Expression.extended(Binary);
    }
    function compileAccess(op, left, right, options, level, lineStart, sb) {
      var dotAccess, stringLeft, wrap;
      dotAccess = right instanceof Const && typeof right.value === "string" && isAcceptableIdent(right.value);
      wrap = __num(level) > 18;
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
        (left instanceof Const ? left : Const(left.pos, void 0)).compile(options, 2, false, sb);
        sb(")");
      } else {
        left.compile(options, 18, lineStart, sb);
      }
      if (dotAccess) {
        sb(".");
        sb(right.value);
      } else {
        sb("[");
        right.compile(options, 2, false, sb);
        sb("]");
      }
      if (wrap) {
        sb(")");
      }
    }
    function compileOther(op, left, right, options, level, lineStart, sb) {
      var associativity, opLevel, spaced, wrap;
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
      spaced = !options.minify || /^\w/.test(op);
      if (spaced) {
        sb(" ");
      }
      sb(op);
      if (spaced) {
        sb(" ");
      }
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
      var _ref, f;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
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
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Binary_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var _ref;
      if (__owns.call(ASSIGNMENT_OPS, this.op) || (_ref = this.op) === "." || _ref === "&&" || _ref === "||") {
        _Expression_prototype.compileAsBlock.call(
          this,
          options,
          level,
          lineStart,
          sb
        );
      } else {
        BlockExpression(this.pos, [this.left, this.right]).compileAsBlock(options, level, lineStart, sb);
      }
    };
    _Binary_prototype.compileAsStatement = function (options, lineStart, sb) {
      var _this, left, op;
      _this = this;
      left = this.left;
      op = this.op;
      if (__owns.call(ASSIGNMENT_OPS, op)) {
        if (left instanceof Ident && typeof this.right.toStatement === "function" && false) {
          this.right.toStatement().mutateLast(
            function (node) {
              return Binary(_this.pos, left, op, node);
            },
            { noop: true }
          ).compileAsStatement(options, lineStart, sb);
        } else {
          _Expression_prototype.compileAsStatement.call(this, options, lineStart, sb);
        }
      } else if (this.op === "&&") {
        IfStatement(this.pos, this.left, this.right).compileAsStatement(options, lineStart, sb);
      } else if (this.op === "||") {
        IfStatement(
          this.pos,
          Unary(this.pos, "!", this.left),
          this.right
        ).compileAsStatement(options, lineStart, sb);
      } else if (op === ".") {
        _Expression_prototype.compileAsStatement.call(this, options, lineStart, sb);
      } else {
        BlockStatement(this.pos, [this.left, this.right]).compileAsStatement(options, lineStart, sb);
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
      ".": 18,
      "*": 15,
      "/": 15,
      "%": 15,
      "+": 14,
      "-": 14,
      "<<": 13,
      ">>": 13,
      ">>>": 13,
      "<": 12,
      "<=": 12,
      ">": 12,
      ">=": 12,
      "in": 12,
      "instanceof": 12,
      "==": 11,
      "!=": 11,
      "===": 11,
      "!==": 11,
      "&": 9,
      "^": 10,
      "|": 8,
      "&&": 7,
      "||": 6,
      "=": 4,
      "+=": 4,
      "-=": 4,
      "*=": 4,
      "/=": 4,
      "%=": 4,
      "<<=": 4,
      ">>=": 4,
      ">>>=": 4,
      "&=": 4,
      "^=": 4,
      "|=": 4
    };
    LEVEL_TO_ASSOCIATIVITY = {
      11: "paren",
      12: "paren",
      14: "left",
      15: "left",
      9: "none",
      8: "none",
      10: "none",
      13: "left",
      4: "right"
    };
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
        return this._isNoop = !__owns.call(ASSIGNMENT_OPS, this.op) && this.op !== "." && this.left.isNoop() && this.right.isNoop();
      } else {
        return _ref;
      }
    };
    _Binary_prototype.walk = function (walker) {
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
        return Binary(this.pos, left, this.op, right);
      } else {
        return this;
      }
    };
    _Binary_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "Binary",
        this.pos,
        this.left,
        this.op,
        this.right
      );
    };
    _Binary_prototype._toJSON = function () {
      var result;
      result = [
        simplify(this.left, 0),
        this.op
      ];
      if (simplify(this.right)) {
        result.push.apply(result, __toArray(this.right.toJSON()));
      }
      return result;
    };
    Binary.fromJSON = function (line, column, file, left, op) {
      var right;
      right = __slice.call(arguments, 5);
      return Binary(
        makePos(line, column, file),
        fromJSON(left),
        op,
        fromJSON(right)
      );
    };
    return Binary;
  }(Expression));
  exports.BlockStatement = BlockStatement = (function (Statement) {
    var _BlockStatement_prototype, _Statement_prototype;
    function BlockStatement(pos, body, label) {
      var _i, _i2, _len, _this, item, result, statement;
      _this = this instanceof BlockStatement ? this : __create(_BlockStatement_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (body == null) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i = body.length; _i--; ) {
          if (!(body[_i] instanceof Node)) {
            throw TypeError("Expected " + ("body[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(body[_i]));
          }
        }
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      result = [];
      for (_i2 = 0, _len = body.length; _i2 < _len; ++_i2) {
        item = body[_i2];
        statement = item.maybeToStatement();
        if (statement instanceof BlockStatement && !statement.label && (statement.pos.file === pos.file || !statement.pos.file)) {
          result.push.apply(result, __toArray(statement.body));
        } else if (!(statement instanceof Noop)) {
          result.push(statement);
        }
        if (statement.exitType() != null) {
          break;
        }
      }
      switch (result.length) {
      case 0: return Noop(pos);
      case 1:
        if (pos.file && !result[0].pos.file) {
          result[0].pos.file = pos.file;
        }
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _BlockStatement_prototype = BlockStatement.prototype = __create(_Statement_prototype);
    _BlockStatement_prototype.constructor = BlockStatement;
    BlockStatement.displayName = "BlockStatement";
    if (typeof Statement.extended === "function") {
      Statement.extended(BlockStatement);
    }
    _BlockStatement_prototype.compile = function (options, level, lineStart, sb) {
      var _arr, _arr2, _i, _len, _ref, childOptions, i, item, minify, node,
          nodes;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      for (_arr = [], _arr2 = __toArray(this.body), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        node = _arr2[_i];
        if (!node.isNoop()) {
          _arr.push(node);
        }
      }
      nodes = _arr;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      if (this.label != null) {
        childOptions = incIndent(options);
      } else {
        childOptions = options;
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        lineStart = false;
        sb(":");
        if (!minify) {
          sb(" ");
        }
        sb("{");
        if (!minify) {
          sb("\n");
          sb.indent(childOptions.indent);
          lineStart = true;
        }
      }
      for (i = 0, _len = nodes.length; i < _len; ++i) {
        item = nodes[i];
        if (i > 0 && !minify) {
          sb("\n");
          sb.indent(childOptions.indent);
          lineStart = true;
        }
        item.compileAsStatement(childOptions, lineStart, sb);
        lineStart = false;
      }
      if (this.label != null) {
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("}");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _BlockStatement_prototype.walk = function (walker) {
      var _ref, body, label;
      body = walkArray(this.body, walker);
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (this.body !== body || this.label !== label) {
        return Block(this.pos, body, label);
      } else {
        return this;
      }
    };
    _BlockStatement_prototype.mutateLast = function (func, options) {
      var body, last, newLast;
      last = this.last();
      newLast = last.mutateLast(func, options);
      if (last !== newLast) {
        body = __slice.call(this.body, 0, -1);
        body.push(newLast);
        return Block(this.pos, body);
      } else {
        return this;
      }
    };
    _BlockStatement_prototype.exitType = function () {
      return this.last().exitType();
    };
    _BlockStatement_prototype.last = function () {
      var _ref;
      return (_ref = this.body)[__num(_ref.length) - 1];
    };
    _BlockStatement_prototype.isNoop = function () {
      var _arr, _every, _i, _ref, node;
      if ((_ref = this._isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.body), _i = _arr.length; _i--; ) {
          node = _arr[_i];
          if (!node.isNoop()) {
            _every = false;
            break;
          }
        }
        return this._isNoop = _every;
      } else {
        return _ref;
      }
    };
    _BlockStatement_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "BlockStatement",
        this.pos,
        this.body,
        this.label
      );
    };
    _BlockStatement_prototype._toJSON = function () {
      return [this.label || 0].concat(__toArray(this.body));
    };
    BlockStatement.fromJSON = function (line, column, file, label) {
      var body;
      body = __slice.call(arguments, 4);
      return BlockStatement(
        makePos(line, column, file),
        arrayFromJSON(body),
        label ? fromJSON(label) : null
      );
    };
    return BlockStatement;
  }(Statement));
  exports.BlockExpression = BlockExpression = (function (Expression) {
    var _BlockExpression_prototype, _Expression_prototype;
    function BlockExpression(pos, body) {
      var _i, _this, i, item, len, result;
      _this = this instanceof BlockExpression ? this : __create(_BlockExpression_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (body == null) {
        body = [];
      } else if (!__isArray(body)) {
        throw TypeError("Expected body to be an Array, got " + __typeof(body));
      } else {
        for (_i = body.length; _i--; ) {
          if (!(body[_i] instanceof Expression)) {
            throw TypeError("Expected " + ("body[" + _i + "]") + " to be a " + __name(Expression) + ", got " + __typeof(body[_i]));
          }
        }
      }
      result = [];
      for (i = 0, len = body.length; i < len; ++i) {
        item = body[i];
        if (i === len - 1 || !(!item instanceof Noop)) {
          if (item instanceof BlockExpression && (item.pos.file === pos.file || !item.pos.file)) {
            result.push.apply(result, __toArray(item.body));
            if (i < len - 1 && result[result.length - 1] instanceof Noop) {
              result.pop();
            }
          } else if (!(item instanceof Noop)) {
            result.push(item);
          }
        }
      }
      switch (result.length) {
      case 0: return Noop(pos);
      case 1:
        if (pos.file && !result[0].pos.file) {
          result[0].pos.file = pos.file;
        }
        return result[0];
      }
      _this.body = result;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _BlockExpression_prototype = BlockExpression.prototype = __create(_Expression_prototype);
    _BlockExpression_prototype.constructor = BlockExpression;
    BlockExpression.displayName = "BlockExpression";
    if (typeof Expression.extended === "function") {
      Expression.extended(BlockExpression);
    }
    _BlockExpression_prototype.toStatement = function () {
      return BlockStatement(this.pos, this.body);
    };
    _BlockExpression_prototype.compile = function (options, level, lineStart, sb) {
      var _arr, _arr2, _len, _ref, i, item, len, node, nodes, wrap;
      if (level === 1) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        for (_arr = [], _arr2 = __toArray(this.body), i = 0, len = _arr2.length; i < len; ++i) {
          node = _arr2[i];
          if (!node.isNoop() || i === len - 1) {
            _arr.push(node);
          }
        }
        nodes = _arr;
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.pushFile(this.pos.file);
        }
        if ((_ref = options.sourcemap) != null) {
          _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
        }
        wrap = __num(level) > 2 && nodes.length > 1;
        if (wrap) {
          sb("(");
        }
        for (i = 0, _len = nodes.length; i < _len; ++i) {
          item = nodes[i];
          if (i > 0) {
            sb(",");
            if (!options.minify) {
              sb(" ");
            }
          }
          item.compile(
            options,
            wrap ? 3 : level,
            false,
            sb
          );
        }
        if (wrap) {
          sb(")");
        }
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.popFile();
        }
      }
    };
    _BlockExpression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var _arr, _arr2, _len, _ref, i, item, len, node, nodes, wrap;
      if (level === 1) {
        this.compile(options, level, lineStart, sb);
      } else {
        for (_arr = [], _arr2 = __toArray(this.body), i = 0, len = _arr2.length; i < len; ++i) {
          node = _arr2[i];
          if (!node.isNoop()) {
            _arr.push(node);
          }
        }
        nodes = _arr;
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.pushFile(this.pos.file);
        }
        if ((_ref = options.sourcemap) != null) {
          _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
        }
        wrap = __num(level) > 2 && nodes.length > 1;
        if (wrap) {
          sb("(");
        }
        for (i = 0, _len = nodes.length; i < _len; ++i) {
          item = nodes[i];
          if (i > 0) {
            sb(", ");
          }
          item.compileAsBlock(
            options,
            wrap ? 3 : level,
            false,
            sb
          );
        }
        if (wrap) {
          sb(")");
        }
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.popFile();
        }
      }
    };
    _BlockExpression_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.body.length) > 4 || (function () {
          var _arr, _i, _some, part;
          _some = false;
          for (_arr = __toArray(_this.body), _i = _arr.length; _i--; ) {
            part = _arr[_i];
            if (part.isLarge()) {
              _some = true;
              break;
            }
          }
          return _some;
        }());
      } else {
        return _ref;
      }
    };
    _BlockExpression_prototype.isSmall = function () {
      return false;
    };
    _BlockExpression_prototype.isNoop = function () {
      var _arr, _every, _i, _ref, node;
      if ((_ref = this._isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.body), _i = _arr.length; _i--; ) {
          node = _arr[_i];
          if (!node.isNoop()) {
            _every = false;
            break;
          }
        }
        return this._isNoop = _every;
      } else {
        return _ref;
      }
    };
    _BlockExpression_prototype.walk = BlockStatement.prototype.walk;
    _BlockExpression_prototype.last = function () {
      var _ref;
      return (_ref = this.body)[__num(_ref.length) - 1];
    };
    _BlockExpression_prototype.inspect = function (depth) {
      return inspectHelper(depth, "BlockExpression", this.pos, this.body);
    };
    _BlockExpression_prototype._toJSON = function () {
      return this.body;
    };
    BlockExpression.fromJSON = function (line, column, file) {
      var body;
      body = __slice.call(arguments, 3);
      return BlockExpression(
        makePos(line, column, file),
        arrayFromJSON(body)
      );
    };
    return BlockExpression;
  }(Expression));
  Block = exports.Block = function (pos, body, label) {
    var _i;
    if (body == null) {
      body = [];
    } else if (!__isArray(body)) {
      throw TypeError("Expected body to be an Array, got " + __typeof(body));
    } else {
      for (_i = body.length; _i--; ) {
        if (!(body[_i] instanceof Node)) {
          throw TypeError("Expected " + ("body[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(body[_i]));
        }
      }
    }
    if (label == null) {
      label = null;
    } else if (!(label instanceof Ident)) {
      throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
    }
    if (body.length === 0) {
      return Noop(pos);
    } else if (label == null && (function () {
      var _every, _i2, item;
      _every = true;
      for (_i2 = body.length; _i2--; ) {
        item = body[_i2];
        if (!(item instanceof Expression)) {
          _every = false;
          break;
        }
      }
      return _every;
    }())) {
      return BlockExpression(pos, body);
    } else {
      return BlockStatement(pos, body, label);
    }
  };
  exports.Break = Break = (function (Statement) {
    var _Break_prototype, _Statement_prototype;
    function Break(pos, label) {
      var _this;
      _this = this instanceof Break ? this : __create(_Break_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Break_prototype = Break.prototype = __create(_Statement_prototype);
    _Break_prototype.constructor = Break;
    Break.displayName = "Break";
    if (typeof Statement.extended === "function") {
      Statement.extended(Break);
    }
    _Break_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      sb("break");
      if (this.label != null) {
        sb(" ");
        this.label.compile(options, 2, false, sb);
      }
      sb(";");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile(this.pos.file);
      }
    };
    _Break_prototype.walk = function () {
      return this;
    };
    _Break_prototype.exitType = function () {
      return "break";
    };
    _Break_prototype.walk = function (walker) {
      var _ref, label;
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (label !== this.label) {
        return Break(this.pos, label);
      } else {
        return this;
      }
    };
    _Break_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Break", this.pos, this.label);
    };
    _Break_prototype.isLarge = function () {
      return false;
    };
    _Break_prototype._toJSON = function () {
      if (this.label != null) {
        return [this.label];
      } else {
        return [];
      }
    };
    Break.fromJSON = function (line, column, file, label) {
      return Break(
        makePos(line, column, file),
        label ? fromJSON(label) : null
      );
    };
    return Break;
  }(Statement));
  exports.Call = Call = (function (Expression) {
    var _Call_prototype, _Expression_prototype;
    function Call(pos, func, args, isNew) {
      var _i, _this;
      _this = this instanceof Call ? this : __create(_Call_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (func == null) {
        func = Noop(pos);
      } else if (!(func instanceof Expression)) {
        throw TypeError("Expected func to be a " + __name(Expression) + ", got " + __typeof(func));
      }
      _this.func = func;
      if (args == null) {
        args = [];
      } else if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = args.length; _i--; ) {
          if (!(args[_i] instanceof Expression)) {
            throw TypeError("Expected " + ("args[" + _i + "]") + " to be a " + __name(Expression) + ", got " + __typeof(args[_i]));
          }
        }
      }
      _this.args = args;
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      _this.isNew = isNew;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Call_prototype = Call.prototype = __create(_Expression_prototype);
    _Call_prototype.constructor = Call;
    Call.displayName = "Call";
    if (typeof Expression.extended === "function") {
      Expression.extended(Call);
    }
    function compileLarge(args, options, level, lineStart, sb) {
      var _arr, childOptions, i, item, len;
      sb("(");
      childOptions = incIndent(options);
      for (_arr = __toArray(args), i = 0, len = _arr.length; i < len; ++i) {
        item = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        item.compile(childOptions, 3, false, sb);
        if (i < len - 1) {
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
        if (i > 0) {
          sb(",");
          if (!options.minify) {
            sb(" ");
          }
        }
        arg.compile(options, 3, false, sb);
      }
      sb(")");
    }
    _Call_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, f, wrap;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      wrap = __num(level) > 18 || !this.isNew && (this.func instanceof Func || this.func instanceof Binary && this.func.op === "." && this.func.left instanceof Func);
      if (wrap) {
        sb("(");
      }
      if (this.isNew) {
        sb("new ");
      }
      this.func.compile(
        options,
        this.isNew ? 19 : 18,
        lineStart && !wrap && !this.isNew,
        sb
      );
      if (!options.minify && this.shouldCompileLarge()) {
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
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Call_prototype.shouldCompileLarge = function () {
      var _arr, _i, _len, _some, arg;
      if (__num(this.args.length) > 4) {
        return true;
      } else {
        _some = false;
        for (_arr = __toArray(this.args), _len = _arr.length, _i = _len - 2; _i >= 0; --_i) {
          arg = _arr[_i];
          if (!arg.isSmall()) {
            _some = true;
            break;
          }
        }
        return _some;
      }
    };
    _Call_prototype.hasLargeArgs = function () {
      var _arr, _i, _ref, _some, arg;
      if ((_ref = this._hasLargeArgs) == null) {
        if (__num(this.args.length) > 4) {
          return this._hasLargeArgs = true;
        } else {
          _some = false;
          for (_arr = __toArray(this.args), _i = _arr.length; _i--; ) {
            arg = _arr[_i];
            if (!arg.isSmall()) {
              _some = true;
              break;
            }
          }
          return this._hasLargeArgs = _some;
        }
      } else {
        return _ref;
      }
    };
    _Call_prototype.isLarge = function () {
      return this.func.isLarge() || this.hasLargeArgs();
    };
    _Call_prototype.isSmall = function () {
      var _ref;
      if ((_ref = this._isSmall) == null) {
        if (!this.func.isSmall()) {
          return this._isSmall = false;
        } else {
          switch (this.args.length) {
          case 0: return this._isSmall = true;
          case 1: return this._isSmall = this.args[0].isSmall();
          default: return this._isSmall = false;
          }
        }
      } else {
        return _ref;
      }
    };
    _Call_prototype.walk = function (walker) {
      var _ref, args, func;
      if ((_ref = walker(this.func)) != null) {
        func = _ref;
      } else {
        func = this.func.walk(walker);
      }
      args = walkArray(this.args, walker);
      if (this.func !== func || this.args !== args) {
        return Call(this.pos, func, args, this.isNew);
      } else {
        return this;
      }
    };
    _Call_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "Call",
        this.pos,
        this.func,
        this.args,
        this.isNew
      );
    };
    _Call_prototype._toJSON = function () {
      return [
        simplify(this.func, 0),
        this.isNew ? 1 : 0
      ].concat(__toArray(simplifyArray(this.args, 0)));
    };
    Call.fromJSON = function (line, column, file, func, isNew) {
      var args;
      args = __slice.call(arguments, 5);
      return Call(
        makePos(line, column, file),
        fromJSON(func),
        arrayFromJSON(args),
        !!isNew
      );
    };
    return Call;
  }(Expression));
  exports.Comment = Comment = (function (Statement) {
    var _Comment_prototype, _Statement_prototype;
    function Comment(pos, text) {
      var _this;
      _this = this instanceof Comment ? this : __create(_Comment_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      _this.text = text;
      if (text.substring(0, 2) !== "/*") {
        throw Error("Expected text to start with '/*'");
      }
      if (text.slice(-2) !== "*/") {
        throw Error("Expected text to end with '*/'");
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Comment_prototype = Comment.prototype = __create(_Statement_prototype);
    _Comment_prototype.constructor = Comment;
    Comment.displayName = "Comment";
    if (typeof Statement.extended === "function") {
      Statement.extended(Comment);
    }
    _Comment_prototype.compile = function (options, level, lineStart, sb) {
      var _arr, _len, i, line, lines;
      lines = this.text.split("\n");
      for (_arr = __toArray(lines), i = 0, _len = _arr.length; i < _len; ++i) {
        line = _arr[i];
        if (i > 0) {
          sb("\n");
          if (!options.minify) {
            sb.indent(options.indent);
          }
        }
        sb(line);
      }
    };
    _Comment_prototype.isConst = function () {
      return true;
    };
    _Comment_prototype.constValue = function () {
      return;
    };
    _Comment_prototype.isNoop = function () {
      return false;
    };
    _Comment_prototype.walk = function () {
      return this;
    };
    _Comment_prototype.inspect = function (depth) {
      return inspectHelper("Comment", this.pos, this.text);
    };
    _Comment_prototype._toJSON = function () {
      return [this.text];
    };
    Comment.fromJSON = function (line, column, file, text) {
      return Comment(
        makePos(line, column, file),
        text
      );
    };
    return Comment;
  }(Statement));
  exports.Const = Const = (function (Expression) {
    var _Const_prototype, _Expression_prototype;
    function Const(pos, value) {
      var _this;
      _this = this instanceof Const ? this : __create(_Const_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (value != null && typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string") {
        throw TypeError("Expected value to be one of undefined or null or Boolean or Number or String, got " + __typeof(value));
      }
      _this.value = value;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Const_prototype = Const.prototype = __create(_Expression_prototype);
    _Const_prototype.constructor = Const;
    Const.displayName = "Const";
    if (typeof Expression.extended === "function") {
      Expression.extended(Const);
    }
    _Const_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, value, wrap;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      value = this.value;
      if (value === void 0 && options.undefinedName != null) {
        sb(options.undefinedName);
      } else {
        wrap = __num(level) >= 17 && (value === void 0 || typeof value === "number" && !isFinite(value));
        if (wrap) {
          sb("(");
        }
        sb(toJSSource(value));
        if (wrap) {
          sb(")");
        }
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Const_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop(this.pos).compileAsBlock(options, level, lineStart, sb);
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
    _Const_prototype.inspect = function (depth) {
      return "Const(" + __strnum(inspect(this.value, null, decDepth(depth))) + ")";
    };
    _Const_prototype._toJSON = function () {
      if (typeof this.value === "number" && !isFinite(this.value)) {
        return [
          __num(this.value) > 0 ? 1 : __num(this.value) < 0 ? -1 : 0,
          1
        ];
      } else if (this.value === 0 && isNegative(this.value)) {
        return [0, 2];
      } else if (this.value === void 0) {
        return [];
      } else {
        return [this.value];
      }
    };
    Const.fromJSON = function (line, column, file, value, state) {
      return Const(
        makePos(line, column, file),
        state === 1 ? __num(value) / 0 : value === 0 && state === 2 ? -0 : value
      );
    };
    return Const;
  }(Expression));
  exports.Continue = Continue = (function (Statement) {
    var _Continue_prototype, _Statement_prototype;
    function Continue(pos, label) {
      var _this;
      _this = this instanceof Continue ? this : __create(_Continue_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Continue_prototype = Continue.prototype = __create(_Statement_prototype);
    _Continue_prototype.constructor = Continue;
    Continue.displayName = "Continue";
    if (typeof Statement.extended === "function") {
      Statement.extended(Continue);
    }
    _Continue_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      sb("continue");
      if (this.label != null) {
        sb(" ");
        this.label.compile(options, 2, false, sb);
      }
      sb(";");
      if (options.sourcemap != null && this.pos.file) {
        return options.sourcemap.popFile();
      }
    };
    _Continue_prototype.walk = function () {
      return this;
    };
    _Continue_prototype.exitType = function () {
      return "continue";
    };
    _Continue_prototype.isLarge = function () {
      return false;
    };
    _Continue_prototype.walk = function (walker) {
      var _ref, label;
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (label !== this.label) {
        return Continue(this.pop, label);
      } else {
        return this;
      }
    };
    _Continue_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Continue", this.pos, this.label);
    };
    _Continue_prototype._toJSON = function () {
      if (this.label != null) {
        return [this.label];
      } else {
        return [];
      }
    };
    Continue.fromJSON = function (line, column, file, label) {
      return Continue(
        makePos(line, column, file),
        label ? fromJSON(label) : null
      );
    };
    return Continue;
  }(Statement));
  exports.Debugger = Debugger = (function (Statement) {
    var _Debugger_prototype, _Statement_prototype;
    function Debugger(pos) {
      var _this;
      _this = this instanceof Debugger ? this : __create(_Debugger_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Debugger_prototype = Debugger.prototype = __create(_Statement_prototype);
    _Debugger_prototype.constructor = Debugger;
    Debugger.displayName = "Debugger";
    if (typeof Statement.extended === "function") {
      Statement.extended(Debugger);
    }
    _Debugger_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(
          sb.line,
          sb.column,
          this.pos.line,
          this.pos.column,
          this.pos.file
        );
      }
      return sb("debugger;");
    };
    _Debugger_prototype.walk = function () {
      return this;
    };
    _Debugger_prototype.isLarge = function () {
      return false;
    };
    _Debugger_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Debugger", this.pos);
    };
    Debugger.fromJSON = function (line, column, file) {
      return Debugger(makePos(line, column, file));
    };
    return Debugger;
  }(Statement));
  exports.DoWhile = DoWhile = (function (Statement) {
    var _DoWhile_prototype, _Statement_prototype;
    function DoWhile(pos, body, test, label) {
      var _this;
      _this = this instanceof DoWhile ? this : __create(_DoWhile_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (body == null) {
        body = Noop(pos);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (test == null) {
        test = Noop(pos);
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a " + __name(Expression) + ", got " + __typeof(test));
      }
      _this.test = test;
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      _this.body = body.maybeToStatement();
      if (test.isConst() && !test.constValue()) {
        return Block(pos, [_this.body], label);
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _DoWhile_prototype = DoWhile.prototype = __create(_Statement_prototype);
    _DoWhile_prototype.constructor = DoWhile;
    DoWhile.displayName = "DoWhile";
    if (typeof Statement.extended === "function") {
      Statement.extended(DoWhile);
    }
    _DoWhile_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, minify;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        lineStart = false;
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      sb("do");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        if (!minify) {
          sb(" ");
        }
        sb("{");
        if (!minify) {
          sb("\n");
          sb.indent(__num(options.indent) + 1);
          lineStart = true;
        }
        this.body.compileAsStatement(incIndent(options), lineStart, sb);
        lineStart = false;
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("}");
      }
      if (!minify) {
        sb(" ");
      }
      sb("while");
      if (!minify) {
        sb(" ");
      }
      sb("(");
      this.test.compile(options, 2, false, sb);
      sb(");");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _DoWhile_prototype.walk = function (walker) {
      var _ref, body, label, test;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (body !== this.body || test !== this.test || label !== this.label) {
        return DoWhile(this.pos, body, test, label);
      } else {
        return this;
      }
    };
    _DoWhile_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "DoWhile",
        this.pos,
        this.body,
        this.test,
        this.label
      );
    };
    _DoWhile_prototype._toJSON = function () {
      return [
        this.label || 0,
        simplify(this.test, 0),
        simplify(this.body, 0)
      ];
    };
    DoWhile.fromJSON = function (line, column, file, label, test, body) {
      return DoWhile(
        makePos(line, column, file),
        fromJSON(body),
        fromJSON(test),
        label ? fromJSON(label) : null
      );
    };
    return DoWhile;
  }(Statement));
  exports.Eval = Eval = (function (Expression) {
    var _Eval_prototype, _Expression_prototype;
    function Eval(pos, code) {
      var _this;
      _this = this instanceof Eval ? this : __create(_Eval_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (code == null) {
        code = Noop(pos);
      }
      if (!(code instanceof Expression)) {
        code = toConst(pos, code);
      }
      _this.code = code;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Eval_prototype = Eval.prototype = __create(_Expression_prototype);
    _Eval_prototype.constructor = Eval;
    Eval.displayName = "Eval";
    if (typeof Expression.extended === "function") {
      Expression.extended(Eval);
    }
    _Eval_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      if (this.code instanceof Const) {
        sb(String(this.code.value));
      } else {
        sb("eval(");
        this.code.compile(options, 3, false, sb);
        sb(")");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Eval_prototype.walk = function (walker) {
      var _ref, code;
      if ((_ref = walker(this.code)) != null) {
        code = _ref;
      } else {
        code = this.code.walk(walker);
      }
      if (code !== this.code) {
        return Eval(this.pops, code);
      } else {
        return this;
      }
    };
    _Eval_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Eval", this.pos, this.code);
    };
    _Eval_prototype._toJSON = function () {
      return [simplify(this.code, 0)];
    };
    Eval.fromJSON = function (line, column, file, code) {
      return Eval(
        makePos(line, column, file),
        fromJSON(code)
      );
    };
    return Eval;
  }(Expression));
  exports.For = For = (function (Statement) {
    var _For_prototype, _Statement_prototype;
    function For(pos, init, test, step, body, label) {
      var _this;
      _this = this instanceof For ? this : __create(_For_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (init == null) {
        init = Noop(pos);
      } else if (!(init instanceof Expression)) {
        throw TypeError("Expected init to be a " + __name(Expression) + ", got " + __typeof(init));
      }
      _this.init = init;
      if (test == null) {
        test = Const(pos, true);
      }
      if (step == null) {
        step = Noop(pos);
      } else if (!(step instanceof Expression)) {
        throw TypeError("Expected step to be a " + __name(Expression) + ", got " + __typeof(step));
      }
      _this.step = step;
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      if (!(test instanceof Expression)) {
        test = toConst(pos, test);
      }
      if (test.isConst() && !test.constValue()) {
        return init;
      }
      _this.test = test;
      _this.body = body.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _For_prototype = For.prototype = __create(_Statement_prototype);
    _For_prototype.constructor = For;
    For.displayName = "For";
    if (typeof Statement.extended === "function") {
      Statement.extended(For);
    }
    _For_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, minify, test;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (this.test.isConst() && typeof this.test.constValue() !== "boolean") {
        test = Const(this.pos, !!this.test.constValue());
      } else {
        test = this.test;
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      if (this.init.isNoop() && this.step.isNoop()) {
        sb("while");
        if (!minify) {
          sb(" ");
        }
        sb("(");
        test.compile(options, 2, false, sb);
      } else {
        sb("for");
        if (!minify) {
          sb(" ");
        }
        sb("(");
        if (!this.init.isNoop()) {
          this.init.compileAsBlock(options, 2, false, sb);
        }
        sb(";");
        if (!minify) {
          sb(" ");
        }
        if (!test.isConst() || !test.constValue()) {
          test.compile(options, 2, false, sb);
        }
        sb(";");
        if (!minify) {
          sb(" ");
        }
        if (!this.step.isNoop()) {
          this.step.compileAsBlock(options, 2, false, sb);
        }
      }
      sb(")");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        if (!minify) {
          sb(" ");
        }
        sb("{");
        if (!minify) {
          sb("\n");
          sb.indent(__num(options.indent) + 1);
        }
        this.body.compileAsStatement(incIndent(options), !minify, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("}");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _For_prototype.walk = function (walker) {
      var _ref, body, init, label, step, test;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body || label !== this.label) {
        return For(
          this.pos,
          init,
          test,
          step,
          body,
          label
        );
      } else {
        return this;
      }
    };
    _For_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "For",
        this.pos,
        this.init,
        this.test,
        this.step,
        this.body,
        this.label
      );
    };
    _For_prototype._toJSON = function () {
      var result;
      result = [
        this.label || 0,
        simplify(this.init, 0),
        simplify(this.test, 0),
        simplify(this.step, 0)
      ];
      if (simplify(this.body)) {
        result.push.apply(result, __toArray(this.body.toJSON()));
      }
      return result;
    };
    For.fromJSON = function (line, column, file, label, init, test, step) {
      var body;
      body = __slice.call(arguments, 7);
      return For(
        makePos(line, column, file),
        fromJSON(init),
        fromJSON(test),
        fromJSON(step),
        fromJSON(body),
        label ? fromJSON(label) : null
      );
    };
    return For;
  }(Statement));
  exports.ForIn = ForIn = (function (Statement) {
    var _ForIn_prototype, _Statement_prototype;
    function ForIn(pos, key, object, body, label) {
      var _this;
      _this = this instanceof ForIn ? this : __create(_ForIn_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (!(key instanceof Ident)) {
        throw TypeError("Expected key to be a " + __name(Ident) + ", got " + __typeof(key));
      }
      _this.key = key;
      if (object == null) {
        object = Noop(line, column);
      } else if (!(object instanceof Expression)) {
        throw TypeError("Expected object to be a " + __name(Expression) + ", got " + __typeof(object));
      }
      _this.object = object;
      if (body == null) {
        body = Noop(line, column);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      _this.body = body.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _ForIn_prototype = ForIn.prototype = __create(_Statement_prototype);
    _ForIn_prototype.constructor = ForIn;
    ForIn.displayName = "ForIn";
    if (typeof Statement.extended === "function") {
      Statement.extended(ForIn);
    }
    _ForIn_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, minify;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      sb("for");
      if (!minify) {
        sb(" ");
      }
      sb("(");
      this.key.compile(options, 2, false, sb);
      sb(" in ");
      this.object.compile(options, 2, false, sb);
      sb(")");
      if (this.body.isNoop()) {
        sb(";");
      } else {
        if (!minify) {
          sb(" ");
        }
        sb("{");
        if (!minify) {
          sb("\n");
          sb.indent(__num(options.indent) + 1);
        }
        this.body.compileAsStatement(incIndent(options), !minify, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("}");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _ForIn_prototype.walk = function (walker) {
      var _ref, body, key, label, object;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (key !== this.key || object !== this.object || body !== this.body || label !== this.label) {
        return ForIn(this.pos, key, object, body);
      } else {
        return this;
      }
    };
    _ForIn_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ForIn",
        this.pos,
        this.key,
        this.object,
        this.body,
        this.label
      );
    };
    _ForIn_prototype._toJSON = function () {
      var result;
      result = [
        this.label || 0,
        this.key,
        simplify(this.object, 0)
      ];
      if (simplify(this.body)) {
        result.push.apply(result, __toArray(this.body.toJSON()));
      }
      return result;
    };
    ForIn.fromJSON = function (line, column, file, label, key, object) {
      var body;
      body = __slice.call(arguments, 6);
      return ForIn(
        makePos(line, column, file),
        fromJSON(key),
        fromJSON(object),
        fromJSON(body),
        label ? fromJSON(label) : null
      );
    };
    return ForIn;
  }(Statement));
  function validateFuncParamsAndVariables(params, variables) {
    var _arr, _i, names, param, variable;
    names = [];
    for (_arr = __toArray(params), _i = _arr.length; _i--; ) {
      param = _arr[_i];
      if (__in(param.name, names)) {
        throw Error("Duplicate parameter: " + __strnum(param.name));
      }
      names.push(param.name);
    }
    for (_arr = __toArray(variables), _i = _arr.length; _i--; ) {
      variable = _arr[_i];
      if (__in(variable, names)) {
        throw Error("Duplicate variable: " + __strnum(variable));
      }
      names.push(variable);
    }
  }
  toJSIdent = (function () {
    function unicodeReplacer(m) {
      return "\\u" + __strnum(padLeft(m.charCodeAt(0).toString(16), 4, "0"));
    }
    return function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return name.replace(/[\u0000-\u001f\u0080-\uffff]/g, unicodeReplacer);
    };
  }());
  function compileFuncBody(options, sb, declarations, variables, body, lineStart) {
    var _arr, _i, _len, column, declaration, i, minify, name, variable;
    minify = options.minify;
    for (_arr = __toArray(declarations), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      declaration = _arr[_i];
      if (!minify) {
        sb.indent(options.indent);
      }
      sb(toJSSource(declaration));
      sb(";");
      lineStart = false;
      if (!minify) {
        sb("\n");
        lineStart = true;
      }
    }
    if (__num(variables.length) > 0) {
      column = 0;
      if (!minify) {
        sb.indent(options.indent);
        column = 4 + 2 * __num(options.indent);
      }
      sb("var ");
      for (_arr = __toArray(variables.sort(function (a, b) {
        return __cmp(a.toLowerCase(), b.toLowerCase()) || __cmp(a, b);
      })), i = 0, _len = _arr.length; i < _len; ++i) {
        variable = _arr[i];
        name = toJSIdent(variables[i]);
        if (i > 0) {
          if (minify) {
            sb(",");
          } else if (column + 2 + name.length < 80) {
            sb(", ");
            column += 2;
          } else {
            sb(",\n");
            sb.indent(options.indent);
            sb("    ");
            column = 4 + 2 * __num(options.indent);
          }
        }
        sb(name);
        column += name.length;
      }
      sb(";");
      lineStart = false;
      if (!minify) {
        sb("\n");
        lineStart = true;
      }
    }
    if (!body.isNoop()) {
      if (!minify) {
        sb.indent(options.indent);
      }
      body.compileAsStatement(options, lineStart, sb);
      if (!minify) {
        sb("\n");
      }
    }
  }
  function compileFunc(options, sb, name, params, declarations, variables, body) {
    var _arr, _len, i, minify, param;
    sb("function");
    minify = options.minify;
    if (!minify || name != null) {
      sb(" ");
    }
    if (name != null) {
      name.compile(options, 2, false, sb);
    }
    sb("(");
    for (_arr = __toArray(params), i = 0, _len = _arr.length; i < _len; ++i) {
      param = _arr[i];
      if (i > 0) {
        sb(",");
        if (!minify) {
          sb(" ");
        }
      }
      param.compile(options, 2, false, sb);
    }
    sb(")");
    if (!minify) {
      sb(" ");
    }
    sb("{");
    if (variables.length || declarations.length || !body.isNoop()) {
      if (!minify) {
        sb("\n");
      }
      compileFuncBody(
        incIndent(options),
        sb,
        declarations,
        variables,
        body,
        !minify
      );
      if (!minify) {
        sb.indent(options.indent);
      }
    }
    return sb("}");
  }
  exports.Func = Func = (function (Expression) {
    var _Expression_prototype, _Func_prototype;
    function Func(pos, name, params, variables, body, declarations) {
      var _i, _i2, _i3, _this;
      _this = this instanceof Func ? this : __create(_Func_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (name == null) {
        name = null;
      } else if (!(name instanceof Ident)) {
        throw TypeError("Expected name to be one of null or " + __name(Ident) + ", got " + __typeof(name));
      }
      _this.name = name;
      if (params == null) {
        params = [];
      } else if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = params.length; _i--; ) {
          if (!(params[_i] instanceof Ident)) {
            throw TypeError("Expected " + ("params[" + _i + "]") + " to be a " + __name(Ident) + ", got " + __typeof(params[_i]));
          }
        }
      }
      _this.params = params;
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i2 = variables.length; _i2--; ) {
          if (typeof variables[_i2] !== "string") {
            throw TypeError("Expected " + ("variables[" + _i2 + "]") + " to be a String, got " + __typeof(variables[_i2]));
          }
        }
      }
      _this.variables = variables;
      if (body == null) {
        body = Noop(line, column);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      _this.body = body;
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i3 = declarations.length; _i3--; ) {
          if (typeof declarations[_i3] !== "string") {
            throw TypeError("Expected " + ("declarations[" + _i3 + "]") + " to be a String, got " + __typeof(declarations[_i3]));
          }
        }
      }
      _this.declarations = declarations;
      validateFuncParamsAndVariables(params, variables);
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Func_prototype = Func.prototype = __create(_Expression_prototype);
    _Func_prototype.constructor = Func;
    Func.displayName = "Func";
    if (typeof Expression.extended === "function") {
      Expression.extended(Func);
    }
    _Func_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, wrap;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
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
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Func_prototype.compileAsStatement = function (options, lineStart, sb) {
      this.compile(options, 1, lineStart, sb);
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
      body = this.body.walk(walker);
      if (name !== this.name || params !== this.params || body !== this.body) {
        return Func(
          this.pos,
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
      return inspectHelper(
        depth,
        "Func",
        this.pos,
        this.name,
        this.params,
        this.variables,
        this.body,
        this.declarations,
        this.meta
      );
    };
    _Func_prototype._toJSON = function () {
      var result;
      result = [
        this.name || 0,
        simplifyArray(this.params, 0),
        simplifyArray(this.variables, 0),
        simplifyArray(this.declarations, 0)
      ];
      if (simplify(this.body)) {
        result.push.apply(result, __toArray(this.body.toJSON()));
      }
      return result;
    };
    Func.fromJSON = function (line, column, file, name, params, variables, declarations) {
      var body;
      body = __slice.call(arguments, 7);
      return Func(
        makePos(line, column, file),
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
    function Ident(pos, name, allowUnacceptable) {
      var _this;
      _this = this instanceof Ident ? this : __create(_Ident_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      _this.name = name;
      if (allowUnacceptable == null) {
        allowUnacceptable = false;
      } else if (typeof allowUnacceptable !== "boolean") {
        throw TypeError("Expected allowUnacceptable to be a Boolean, got " + __typeof(allowUnacceptable));
      }
      if (!allowUnacceptable && !isAcceptableIdent(name, true)) {
        throw Error("Not an acceptable identifier name: " + name);
      }
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Ident_prototype = Ident.prototype = __create(_Expression_prototype);
    _Ident_prototype.constructor = Ident;
    Ident.displayName = "Ident";
    if (typeof Expression.extended === "function") {
      Expression.extended(Ident);
    }
    _Ident_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if ((_ref = options.sourcemap) != null) {
        _ref.add(
          sb.line,
          sb.column,
          this.pos.line,
          this.pos.column,
          this.pos.file
        );
      }
      sb(toJSIdent(this.name));
    };
    _Ident_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop(this.pos).compileAsBlock(options, level, lineStart, sb);
    };
    _Ident_prototype.walk = function () {
      return this;
    };
    _Ident_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Ident", this.pos, this.name);
    };
    _Ident_prototype.isNoop = function () {
      return true;
    };
    _Ident_prototype._toJSON = function () {
      return [this.name];
    };
    Ident.fromJSON = function (line, column, file, name) {
      return Ident(
        makePos(line, column, file),
        name
      );
    };
    return Ident;
  }(Expression));
  exports.IfStatement = IfStatement = (function (Statement) {
    var _IfStatement_prototype, _Statement_prototype;
    function IfStatement(pos, test, whenTrue, whenFalse, label) {
      var _this;
      _this = this instanceof IfStatement ? this : __create(_IfStatement_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (test == null) {
        test = Noop(pos);
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a " + __name(Expression) + ", got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = Noop(pos);
      } else if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a " + __name(Node) + ", got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = Noop(pos);
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a " + __name(Node) + ", got " + __typeof(whenFalse));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      if (test instanceof Unary && test.op === "!" && test.node instanceof Unary && test.node.op === "!") {
        test = test.node.node;
      }
      if (test.isConst()) {
        if (test.constValue()) {
          return Block(pos, [whenTrue], label);
        } else {
          return Block(pos, [whenFalse], label);
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
              pos,
              Unary(test.pos, "!", test),
              whenFalse,
              whenTrue,
              label
            );
          }
        } else if (whenFalse instanceof Noop && whenTrue instanceof IfStatement && whenTrue.whenFalse instanceof Noop && whenTrue.label == null) {
          _this.test = Binary(pos, test, "&&", whenTrue.test);
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
    if (typeof Statement.extended === "function") {
      Statement.extended(IfStatement);
    }
    _IfStatement_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, childOptions, minify, whenFalse;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (this.whenTrue.isNoop()) {
        if (this.whenFalse.isNoop()) {
          this.test.compileAsStatement(options, true, sb);
        } else {
          IfStatement(
            this.pos,
            Unary(this.test.pos, "!", this.test),
            this.whenFalse,
            this.whenTrue,
            this.label
          ).compile(options, level, lineStart, sb);
        }
      } else {
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.pushFile(this.pos.file);
        }
        if ((_ref = options.sourcemap) != null) {
          _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
        }
        minify = options.minify;
        if (this.label != null) {
          this.label.compile(options, level, lineStart, sb);
          sb(":");
          if (!minify) {
            sb(" ");
          }
        }
        sb("if");
        if (!minify) {
          sb(" ");
        }
        sb("(");
        this.test.compile(options, 2, false, sb);
        sb(")");
        if (!minify) {
          sb(" ");
        }
        sb("{");
        childOptions = incIndent(options);
        if (!minify) {
          sb("\n");
          sb.indent(childOptions.indent);
        }
        this.whenTrue.compileAsStatement(childOptions, !minify, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("}");
        whenFalse = this.whenFalse;
        if (!whenFalse.isNoop()) {
          if (!minify) {
            sb(" ");
          }
          sb("else");
          if (whenFalse instanceof IfStatement && whenFalse.label == null) {
            sb(" ");
            whenFalse.compile(options, level, false, sb);
          } else {
            if (!minify) {
              sb(" ");
            }
            sb("{");
            if (!minify) {
              sb("\n");
              sb.indent(childOptions.indent);
            }
            whenFalse.compileAsStatement(childOptions, !minify, sb);
            if (!minify) {
              sb("\n");
              sb.indent(options.indent);
            }
            sb("}");
          }
        }
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.popFile();
        }
      }
    };
    _IfStatement_prototype.walk = function (walker) {
      var _ref, label, test, whenFalse, whenTrue;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse || label !== this.label) {
        return If(
          this.pos,
          test,
          whenTrue,
          whenFalse,
          label
        );
      } else {
        return this;
      }
    };
    _IfStatement_prototype.mutateLast = function (func, options) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.mutateLast(func, options);
      whenFalse = this.whenFalse.mutateLast(func, options);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return If(
          this.pos,
          this.test,
          whenTrue,
          whenFalse,
          this.label
        );
      } else {
        return this;
      }
    };
    _IfStatement_prototype.exitType = function () {
      var falseExit, trueExit;
      if (this._exitType === void 0) {
        trueExit = this.whenTrue.exitType();
        falseExit = this.whenFalse.exitType();
        if (trueExit === falseExit) {
          return this._exitType = trueExit;
        } else {
          return this._exitType = null;
        }
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
      return inspectHelper(
        depth,
        "IfStatement",
        this.pos,
        this.test,
        this.whenTrue,
        this.whenFalse
      );
    };
    _IfStatement_prototype._toJSON = function () {
      var result;
      result = [
        this.label || 0,
        simplify(this.test, 0),
        simplify(this.whenTrue, 0)
      ];
      if (simplify(this.whenFalse)) {
        result.push.apply(result, __toArray(this.whenFalse.toJSON()));
      }
      return result;
    };
    IfStatement.fromJSON = function (line, column, file, label, test, whenTrue) {
      var whenFalse;
      whenFalse = __slice.call(arguments, 6);
      return IfStatement(
        makePos(line, column, file),
        fromJSON(test),
        fromJSON(whenTrue),
        fromJSON(whenFalse),
        label ? fromJSON(label) : null
      );
    };
    return IfStatement;
  }(Statement));
  exports.IfExpression = IfExpression = (function (Expression) {
    var _Expression_prototype, _IfExpression_prototype;
    function IfExpression(pos, test, whenTrue, whenFalse) {
      var _this;
      _this = this instanceof IfExpression ? this : __create(_IfExpression_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (test == null) {
        test = Noop(pos);
      } else if (!(test instanceof Expression)) {
        throw TypeError("Expected test to be a " + __name(Expression) + ", got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = Noop(pos);
      }
      if (whenFalse == null) {
        whenFalse = Noop(pos);
      }
      if (!(whenTrue instanceof Expression)) {
        whenTrue = toConst(pos, whenTrue);
      }
      if (!(whenFalse instanceof Expression)) {
        whenFalse = toConst(pos, whenFalse);
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
        _this.test = Binary(pos, test, "&&", whenTrue.test);
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
    if (typeof Expression.extended === "function") {
      Expression.extended(IfExpression);
    }
    _IfExpression_prototype.toStatement = function () {
      return IfStatement(this.pos, this.test, this.whenTrue, this.whenFalse);
    };
    function compileSmall(test, whenTrue, whenFalse, options, lineStart, sb) {
      var minify;
      minify = options.minify;
      test.compile(options, 5, lineStart, sb);
      sb(minify ? "?" : " ? ");
      whenTrue.compile(options, 5, false, sb);
      sb(minify ? ":" : " : ");
      whenFalse.compile(options, 5, false, sb);
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
        wrapTest ? 2 : 5,
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
        wrapWhenTrue ? 2 : 5,
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
        whenFalse.compile(childOptions, 5, false, sb);
      }
    }
    _IfExpression_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, f, wrap;
      if (level === 1) {
        this.toStatement().compile(options, level, lineStart, sb);
      } else {
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.pushFile(this.pos.file);
        }
        if ((_ref = options.sourcemap) != null) {
          _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
        }
        wrap = __num(level) > 5;
        if (wrap) {
          sb("(");
        }
        if (!options.minify && (this.whenTrue.isLarge() || this.whenFalse.isLarge())) {
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
        if (options.sourcemap != null && this.pos.file) {
          options.sourcemap.popFile();
        }
      }
    };
    _IfExpression_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      if (this.whenTrue.isNoop()) {
        if (this.whenFalse.isNoop()) {
          this.test.compileAsBlock(options, level, lineStart, sb);
        } else {
          Binary(this.pos, this.test, "||", this.whenFalse).compileAsBlock(options, level, lineStart, sb);
        }
      } else if (this.whenFalse.isNoop()) {
        Binary(this.pos, this.test, "&&", this.whenTrue).compileAsBlock(options, level, lineStart, sb);
      } else {
        this.compile(options, level, lineStart, sb);
      }
    };
    _IfExpression_prototype.isLarge = function () {
      var _ref;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = !this.test.isSmall() || !this.whenTrue.isSmall() || !this.whenFalse.isSmall();
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
      return inspectHelper(
        depth,
        "IfExpression",
        this.pos,
        this.test,
        this.whenTrue,
        this.whenFalse
      );
    };
    _IfExpression_prototype._toJSON = function () {
      var result;
      result = [
        simplify(this.test, 0),
        simplify(this.whenTrue, 0)
      ];
      if (simplify(this.whenFalse)) {
        result.push.apply(result, __toArray(this.whenFalse.toJSON()));
      }
      return result;
    };
    IfExpression.fromJSON = function (line, column, file, test, whenTrue) {
      var whenFalse;
      whenFalse = __slice.call(arguments, 5);
      return IfExpression(
        makePos(line, column, file),
        fromJSON(test),
        fromJSON(whenTrue),
        fromJSON(whenFalse)
      );
    };
    return IfExpression;
  }(Expression));
  If = exports.If = function (pos, test, whenTrue, whenFalse, label) {
    if (typeof pos !== "object" || pos === null) {
      throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
    }
    if (whenTrue instanceof Statement || whenFalse instanceof Statement || label != null) {
      return IfStatement(
        pos,
        test,
        whenTrue,
        whenFalse,
        label
      );
    } else {
      return IfExpression(pos, test, whenTrue, whenFalse);
    }
  };
  exports.Noop = Noop = (function (Expression) {
    var _Expression_prototype, _Noop_prototype;
    function Noop(pos) {
      var _this;
      _this = this instanceof Noop ? this : __create(_Noop_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Noop_prototype = Noop.prototype = __create(_Expression_prototype);
    _Noop_prototype.constructor = Noop;
    Noop.displayName = "Noop";
    if (typeof Expression.extended === "function") {
      Expression.extended(Noop);
    }
    _Noop_prototype.compileAsStatement = function () {};
    _Noop_prototype.compile = function (options, level, lineStart, sb) {
      if (__num(level) > 1) {
        Const(this.pos, void 0).compile(options, level, lineStart, sb);
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
    _Noop_prototype.mutateLast = function (func, options) {
      if (options != null ? options.noop : void 0) {
        return func(this);
      } else {
        return this;
      }
    };
    _Noop_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Noop", this.pos);
    };
    Noop.fromJSON = function (line, column, file) {
      return Noop(makePos(line, column, file));
    };
    return Noop;
  }(Expression));
  exports.Obj = Obj = (function (Expression) {
    var _Expression_prototype, _Obj_prototype, ObjPair;
    function Obj(pos, elements) {
      var _i, _this;
      _this = this instanceof Obj ? this : __create(_Obj_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (elements == null) {
        elements = [];
      } else if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = elements.length; _i--; ) {
          if (!(elements[_i] instanceof ObjPair)) {
            throw TypeError("Expected " + ("elements[" + _i + "]") + " to be a " + __name(ObjPair) + ", got " + __typeof(elements[_i]));
          }
        }
      }
      _this.elements = elements;
      validateUniqueKeys(elements);
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Obj_prototype = Obj.prototype = __create(_Expression_prototype);
    _Obj_prototype.constructor = Obj;
    Obj.displayName = "Obj";
    if (typeof Expression.extended === "function") {
      Expression.extended(Obj);
    }
    function validateUniqueKeys(elements) {
      var _arr, _i, key, keys, pair;
      keys = [];
      for (_arr = __toArray(elements), _i = _arr.length; _i--; ) {
        pair = _arr[_i];
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
      var _arr, childOptions, element, i, key, len;
      childOptions = incIndent(options);
      for (_arr = __toArray(elements), i = 0, len = _arr.length; i < len; ++i) {
        element = _arr[i];
        sb("\n");
        sb.indent(childOptions.indent);
        key = element.key;
        sb(toSafeKey(key));
        sb(": ");
        element.value.compile(childOptions, 3, false, sb);
        if (i < len - 1) {
          sb(",");
        }
      }
      sb("\n");
      sb.indent(options.indent);
    }
    function compileSmall(elements, options, sb) {
      var _arr, _len, element, i, key, minify;
      if (elements.length) {
        minify = options.minify;
        if (!minify) {
          sb(" ");
        }
        for (_arr = __toArray(elements), i = 0, _len = _arr.length; i < _len; ++i) {
          element = _arr[i];
          if (i > 0) {
            sb(",");
            if (!minify) {
              sb(" ");
            }
          }
          key = element.key;
          sb(toSafeKey(key));
          sb(":");
          if (!minify) {
            sb(" ");
          }
          element.value.compile(options, 3, false, sb);
        }
        if (!minify) {
          sb(" ");
        }
      }
    }
    _Obj_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, f, wrap;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      wrap = lineStart;
      if (wrap) {
        sb("(");
      }
      sb("{");
      if (!options.minify && this.shouldCompileLarge()) {
        f = compileLarge;
      } else {
        f = compileSmall;
      }
      f(this.elements, options, sb);
      sb("}");
      if (wrap) {
        sb(")");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Obj_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var _this;
      _this = this;
      BlockExpression(this.pos, (function () {
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
      BlockStatement(this.pos, (function () {
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
      case 0: return false;
      case 1: return this.elements[0].isLarge();
      default: return this.isLarge();
      }
    };
    _Obj_prototype.isSmall = function () {
      switch (this.elements.length) {
      case 0: return true;
      case 1: return this.elements[0].isSmall();
      default: return false;
      }
    };
    _Obj_prototype.isLarge = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLarge) == null) {
        return this._isLarge = __num(this.elements.length) > 4 || (function () {
          var _arr, _i, _some, element;
          _some = false;
          for (_arr = __toArray(_this.elements), _i = _arr.length; _i--; ) {
            element = _arr[_i];
            if (!element.isSmall()) {
              _some = true;
              break;
            }
          }
          return _some;
        }());
      } else {
        return _ref;
      }
    };
    _Obj_prototype.isNoop = function () {
      var _arr, _every, _i, _ref, element;
      if ((_ref = this._isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.elements), _i = _arr.length; _i--; ) {
          element = _arr[_i];
          if (!element.isNoop()) {
            _every = false;
            break;
          }
        }
        return this._isNoop = _every;
      } else {
        return _ref;
      }
    };
    _Obj_prototype.walk = function (walker) {
      var elements;
      elements = walkArray(this.elements, walker);
      if (elements !== this.elements) {
        return Obj(this.pos, elements);
      } else {
        return this;
      }
    };
    _Obj_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Obj", this.pos, this.elements);
    };
    _Obj_prototype._toJSON = function () {
      var _arr, _i, _len, pair, pos, result;
      result = [];
      for (_arr = __toArray(this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        pair = _arr[_i];
        pos = pair.pos;
        result.push(
          pos.line,
          pos.column,
          pos.file,
          pair.key,
          simplify(pair.value)
        );
      }
      return result;
    };
    Obj.fromJSON = function (line, column, file) {
      var _end, elementData, i, key, pColumn, pFile, pLine, resultPairs, value;
      elementData = __slice.call(arguments, 3);
      resultPairs = [];
      for (i = 0, _end = elementData.length; i < _end; i += 5) {
        pLine = elementData[i];
        pColumn = elementData[i + 1];
        pFile = elementData[i + 2];
        key = elementData[i + 3];
        value = elementData[i + 4];
        resultPairs.push(ObjPair(
          makePos(pLine, pColumn, pFile),
          key,
          fromJSON(value)
        ));
      }
      return Obj(
        makePos(line, column, file),
        resultPairs
      );
    };
    Obj.Pair = ObjPair = (function () {
      var _ObjPair_prototype;
      function ObjPair(pos, key, value) {
        var _this;
        _this = this instanceof ObjPair ? this : __create(_ObjPair_prototype);
        if (typeof pos !== "object" || pos === null) {
          throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
        }
        _this.pos = pos;
        if (typeof key !== "string") {
          throw TypeError("Expected key to be a String, got " + __typeof(key));
        }
        _this.key = key;
        if (value == null) {
          value = Noop(line, column);
        }
        if (!(value instanceof Expression)) {
          value = toConst(pos, value);
        }
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
        if ((_ref = walker(this.value)) != null) {
          value = _ref;
        } else {
          value = this.value.walk(walker);
        }
        if (value !== this.value) {
          return ObjPair(this.pos, this.key, value);
        } else {
          return this;
        }
      };
      _ObjPair_prototype.inspect = function (depth) {
        return inspectHelper(
          depth,
          "Pair",
          this.pos,
          this.key,
          this.value
        );
      };
      return ObjPair;
    }());
    return Obj;
  }(Expression));
  exports.Regex = Regex = (function (Expression) {
    var _Expression_prototype, _Regex_prototype;
    function Regex(pos, source, flags) {
      var _this;
      _this = this instanceof Regex ? this : __create(_Regex_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (typeof source !== "string") {
        throw TypeError("Expected source to be a String, got " + __typeof(source));
      }
      _this.source = source;
      if (flags == null) {
        flags = "";
      } else if (typeof flags !== "string") {
        throw TypeError("Expected flags to be a String, got " + __typeof(flags));
      }
      _this.flags = flags;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Regex_prototype = Regex.prototype = __create(_Expression_prototype);
    _Regex_prototype.constructor = Regex;
    Regex.displayName = "Regex";
    if (typeof Expression.extended === "function") {
      Expression.extended(Regex);
    }
    _Regex_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if ((_ref = options.sourcemap) != null) {
        _ref.add(
          sb.line,
          sb.column,
          this.pos.line,
          this.pos.column,
          this.pos.file
        );
      }
      sb("/");
      sb(this.source.replace(/(\\\\)*\\?\//g, "$1\\/") || "(?:)");
      sb("/");
      sb(this.flags);
    };
    _Regex_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop(this.pos).compileAsBlock(options, level, lineStart, sb);
    };
    _Regex_prototype.isNoop = function () {
      return true;
    };
    _Regex_prototype.walk = function () {
      return this;
    };
    _Regex_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "Regex",
        this.pos,
        this.source,
        this.flags
      );
    };
    _Regex_prototype._toJSON = function () {
      return [this.source, this.flags];
    };
    Regex.fromJSON = function (line, column, file, source, flags) {
      return Regex(
        makePos(line, column, file),
        source,
        flags
      );
    };
    return Regex;
  }(Expression));
  exports.Return = Return = (function (Statement) {
    var _Return_prototype, _Statement_prototype;
    function Return(pos, node) {
      var _this;
      _this = this instanceof Return ? this : __create(_Return_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (node == null) {
        node = Noop(pos);
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a " + __name(Expression) + ", got " + __typeof(node));
      }
      _this.node = node;
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(
          function (n) {
            return Return(pos, n);
          },
          { noop: true }
        );
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Return_prototype = Return.prototype = __create(_Statement_prototype);
    _Return_prototype.constructor = Return;
    Return.displayName = "Return";
    if (typeof Statement.extended === "function") {
      Statement.extended(Return);
    }
    _Return_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      sb("return");
      if (!this.node.isConst() || this.node.constValue() !== void 0) {
        sb(" ");
        this.node.compile(options, 2, false, sb);
      }
      sb(";");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Return_prototype.walk = function (walker) {
      var _ref, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Return(this.pos, node);
      } else {
        return this;
      }
    };
    _Return_prototype.exitType = function () {
      return "return";
    };
    _Return_prototype.isSmall = function () {
      return this.node.isSmall();
    };
    _Return_prototype.isLarge = function () {
      return this.node.isLarge();
    };
    _Return_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Return", this.pos, this.node);
    };
    _Return_prototype.mutateLast = function (func, options) {
      var node;
      if (options != null ? options["return"] : void 0) {
        node = this.node.mutateLast(func, options);
        if (node !== this.node) {
          return Return(this.pos, node);
        } else {
          return this;
        }
      } else {
        return this;
      }
    };
    _Return_prototype._toJSON = function () {
      if (simplify(this.node)) {
        return this.node.toJSON();
      } else {
        return [];
      }
    };
    Return.fromJSON = function (line, column, file) {
      var node;
      node = __slice.call(arguments, 3);
      return Return(
        makePos(line, column, file),
        fromJSON(node)
      );
    };
    return Return;
  }(Statement));
  exports.Root = Root = (function () {
    var _Root_prototype;
    function Root(pos, body, variables, declarations) {
      var _i, _i2, _this;
      _this = this instanceof Root ? this : __create(_Root_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (body == null) {
        body = Noop(pos);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      _this.body = body;
      if (variables == null) {
        variables = [];
      } else if (!__isArray(variables)) {
        throw TypeError("Expected variables to be an Array, got " + __typeof(variables));
      } else {
        for (_i = variables.length; _i--; ) {
          if (typeof variables[_i] !== "string") {
            throw TypeError("Expected " + ("variables[" + _i + "]") + " to be a String, got " + __typeof(variables[_i]));
          }
        }
      }
      _this.variables = variables;
      if (declarations == null) {
        declarations = [];
      } else if (!__isArray(declarations)) {
        throw TypeError("Expected declarations to be an Array, got " + __typeof(declarations));
      } else {
        for (_i2 = declarations.length; _i2--; ) {
          if (typeof declarations[_i2] !== "string") {
            throw TypeError("Expected " + ("declarations[" + _i2 + "]") + " to be a String, got " + __typeof(declarations[_i2]));
          }
        }
      }
      _this.declarations = declarations;
      validateFuncParamsAndVariables([], variables);
      return _this;
    }
    _Root_prototype = Root.prototype;
    Root.displayName = "Root";
    _Root_prototype.compile = function (options) {
      var _ref, code, endCompileTime, endUglifyTime, fs, minified,
          oldWarn_function, os, path, sb, startTime, tmpMap, UglifyJS, writer;
      if (options == null) {
        options = {};
      }
      if (!options.indent) {
        options.indent = 0;
      }
      if (!options.uglify && typeof options.writer === "function") {
        writer = options.writer;
      }
      if (writer) {
        sb = StringWriter(writer);
      } else {
        sb = StringBuilder();
      }
      startTime = new Date().getTime();
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      compileFuncBody(
        options,
        sb,
        this.declarations,
        this.variables,
        this.body,
        true
      );
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
      endCompileTime = new Date().getTime();
      if (typeof options.progress === "function") {
        options.progress("compile", __num(endCompileTime) - __num(startTime));
      }
      endUglifyTime = 0;
      if (writer == null) {
        code = sb.toString();
        if (options.uglify) {
          fs = require("fs");
          if (options.sourcemap != null) {
            path = require("path");
            os = require("os");
            tmpMap = path.join(os.tmpDir(), "gs-" + Math.random() * 4294967296 + ".map");
            fs.writeFileSync(tmpMap, options.sourcemap.toString(), "utf8");
          }
          UglifyJS = require("uglify-js");
          if ((_ref = UglifyJS.AST_Node) != null) {
            oldWarn_function = _ref.warn_function;
          }
          if (typeof oldWarn_function === "function") {
            UglifyJS.AST_Node.warn_function = function () {};
          }
          minified = UglifyJS.minify(code, {
            fromString: true,
            inSourceMap: tmpMap,
            outSourceMap: (_ref = options.sourcemap) != null ? _ref.generatedFile : void 0
          });
          if (oldWarn_function != null) {
            UglifyJS.AST_Node.warn_function = oldWarn_function;
          }
          if (tmpMap != null) {
            fs.unlinkSync(tmpMap);
          }
          code = minified.code;
          endUglifyTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("uglify", endUglifyTime - __num(endCompileTime));
          }
          if (options.sourcemap != null) {
            options.sourcemap = minified.map;
          }
        }
        if (typeof options.writer === "function") {
          options.writer(code);
          code = "";
        }
      }
      return {
        compileTime: __num(endCompileTime) - __num(startTime),
        uglifyTime: options.uglify ? endUglifyTime - __num(endCompileTime) : void 0,
        code: code || ""
      };
    };
    _Root_prototype.toString = function (options) {
      if (options == null) {
        options = {};
      }
      return this.compile(options).code;
    };
    _Root_prototype.isLarge = function () {
      return true;
    };
    _Root_prototype.walk = function (walker) {
      var body;
      body = this.body.walk(walker);
      if (body !== this.body) {
        return Root(this.pos, body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _Root_prototype.mutateLast = function (func, options) {
      var body;
      body = this.body.mutateLast(func, options);
      if (body !== this.body) {
        return Root(this.pos, body, this.variables, this.declarations);
      } else {
        return this;
      }
    };
    _Root_prototype.exitType = function () {
      return this.last().exitType();
    };
    _Root_prototype.last = function () {
      var _ref;
      return (_ref = this.body)[__num(_ref.length) - 1];
    };
    _Root_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "Root",
        this.pos,
        this.body,
        this.variables,
        this.declarations
      );
    };
    _Root_prototype._toJSON = function () {
      var result;
      result = [
        simplifyArray(this.variables, 0),
        simplifyArray(this.declarations, 0)
      ];
      if (simplify(this.body)) {
        result.push.apply(result, __toArray(this.body.toJSON()));
      }
      return result;
    };
    Root.fromJSON = function (line, column, file, variables, declarations) {
      var body;
      body = __slice.call(arguments, 5);
      return Root(
        makePos(line, column, file),
        fromJSON(body),
        variables,
        declarations
      );
    };
    return Root;
  }());
  exports.This = This = (function (Expression) {
    var _Expression_prototype, _This_prototype;
    function This(pos) {
      var _this;
      _this = this instanceof This ? this : __create(_This_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _This_prototype = This.prototype = __create(_Expression_prototype);
    _This_prototype.constructor = This;
    This.displayName = "This";
    if (typeof Expression.extended === "function") {
      Expression.extended(This);
    }
    _This_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if ((_ref = options.sourcemap) != null) {
        _ref.add(
          sb.line,
          sb.column,
          this.pos.line,
          this.pos.column,
          this.pos.file
        );
      }
      sb("this");
    };
    _This_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      Noop(this.pos).compileAsBlock(options, level, lineStart, sb);
    };
    _This_prototype.isNoop = function () {
      return true;
    };
    _This_prototype.walk = function () {
      return this;
    };
    _This_prototype.inspect = function (depth) {
      return inspectHelper(depth, "This", this.pos);
    };
    This.fromJSON = function (line, column, file) {
      return This(makePos(line, column, file));
    };
    return This;
  }(Expression));
  exports.Throw = Throw = (function (Statement) {
    var _Statement_prototype, _Throw_prototype;
    function Throw(pos, node) {
      var _this;
      _this = this instanceof Throw ? this : __create(_Throw_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (node == null) {
        node = Noop(line, column);
      } else if (!(node instanceof Expression)) {
        throw TypeError("Expected node to be a " + __name(Expression) + ", got " + __typeof(node));
      }
      _this.node = node;
      if (typeof node.toStatement === "function") {
        return node.toStatement().mutateLast(
          function (n) {
            return Throw(_this.pos, n);
          },
          { noop: true }
        );
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Throw_prototype = Throw.prototype = __create(_Statement_prototype);
    _Throw_prototype.constructor = Throw;
    Throw.displayName = "Throw";
    if (typeof Statement.extended === "function") {
      Statement.extended(Throw);
    }
    _Throw_prototype.compile = function (options, level, lineStart, sb) {
      var _ref;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      sb("throw ");
      this.node.compile(options, 2, false, sb);
      sb(";");
      if (options.sourcemap != null && this.pos.file) {
        return options.sourcemap.popFile();
      }
    };
    _Throw_prototype.walk = function (walker) {
      var _ref, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Throw(this.pos, node);
      } else {
        return this;
      }
    };
    _Throw_prototype.exitType = function () {
      return "throw";
    };
    _Throw_prototype.isSmall = function () {
      return this.node.isSmall();
    };
    _Throw_prototype.isLarge = function () {
      return this.node.isLarge();
    };
    _Throw_prototype.inspect = function (depth) {
      return inspectHelper(depth, "Throw", this.pos, this.node);
    };
    _Throw_prototype._toJSON = function () {
      if (simplify(this.node)) {
        return this.node.toJSON();
      } else {
        return [];
      }
    };
    Throw.fromJSON = function (line, column, file) {
      var node;
      node = __slice.call(arguments, 3);
      return Throw(
        makePos(line, column, file),
        fromJSON(node)
      );
    };
    return Throw;
  }(Statement));
  exports.Switch = Switch = (function (Statement) {
    var _Statement_prototype, _Switch_prototype, SwitchCase;
    function Switch(pos, node, cases, defaultCase, label) {
      var _i, _this;
      _this = this instanceof Switch ? this : __create(_Switch_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (node == null) {
        node = Noop(pos);
      }
      if (cases == null) {
        cases = [];
      } else if (!__isArray(cases)) {
        throw TypeError("Expected cases to be an Array, got " + __typeof(cases));
      } else {
        for (_i = cases.length; _i--; ) {
          if (!(cases[_i] instanceof SwitchCase)) {
            throw TypeError("Expected " + ("cases[" + _i + "]") + " to be a " + __name(SwitchCase) + ", got " + __typeof(cases[_i]));
          }
        }
      }
      _this.cases = cases;
      if (defaultCase == null) {
        defaultCase = Noop(pos);
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a " + __name(Node) + ", got " + __typeof(defaultCase));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      if (!(node instanceof Expression)) {
        node = toConst(pos, node);
      }
      _this.node = node;
      _this.defaultCase = defaultCase.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _Switch_prototype = Switch.prototype = __create(_Statement_prototype);
    _Switch_prototype.constructor = Switch;
    Switch.displayName = "Switch";
    if (typeof Statement.extended === "function") {
      Statement.extended(Switch);
    }
    _Switch_prototype.compile = function (options, level, lineStart, sb) {
      var _arr, _i, _len, _ref, case_, childOptions, minify;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      sb("switch");
      if (!minify) {
        sb(" ");
      }
      sb("(");
      this.node.compile(options, 2, false, sb);
      sb(")");
      if (!minify) {
        sb(" ");
      }
      sb("{");
      childOptions = incIndent(options);
      for (_arr = __toArray(this.cases), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        case_ = _arr[_i];
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("case ");
        case_.node.compile(options, 2, false, sb);
        sb(":");
        if (!case_.body.isNoop()) {
          if (case_.node.isSmall() && case_.body.isSmall()) {
            if (!minify) {
              sb(" ");
            }
            case_.body.compileAsStatement(options, true, sb);
          } else {
            if (!minify) {
              sb("\n");
              sb.indent(childOptions.indent);
            }
            case_.body.compileAsStatement(childOptions, true, sb);
          }
        }
      }
      if (!this.defaultCase.isNoop()) {
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb("default:");
        if (this.defaultCase.isSmall()) {
          if (!minify) {
            sb(" ");
          }
          this.defaultCase.compileAsStatement(options, true, sb);
        } else {
          if (!minify) {
            sb("\n");
            sb.indent(childOptions.indent);
          }
          this.defaultCase.compileAsStatement(childOptions, true, sb);
        }
      }
      if (!minify) {
        sb("\n");
        sb.indent(options.indent);
      }
      sb("}");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Switch_prototype.walk = function (walker) {
      var _ref, cases, defaultCase, label, node;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase || label !== this.label) {
        return Switch(
          this.pos,
          node,
          cases,
          defaultCase,
          label
        );
      } else {
        return this;
      }
    };
    _Switch_prototype.inspect = function (depth) {
      return this.inspectHelper(
        depth,
        "Switch",
        this.pos,
        this.node,
        this.cases,
        this.defaultCase,
        this.label
      );
    };
    _Switch_prototype._toJSON = function () {
      var _arr, _i, _len, case_, result;
      result = [
        this.label || 0,
        simplify(this.node, 0)
      ];
      for (_arr = __toArray(this.cases), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        case_ = _arr[_i];
        result.push(
          case_.pos.line,
          case_.pos.column,
          case_.pos.file,
          simplify(case_.node, 0),
          simplify(case_.body, 0)
        );
      }
      if (!(this.defaultCase instanceof Noop)) {
        result.push(simplify(this.defaultCase, 0));
      }
      return result;
    };
    Switch.fromJSON = function (line, column, file, label, node) {
      var caseData, cBody, cColumn, cFile, cLine, cNode, defaultCase, i, len,
          resultCases;
      caseData = __slice.call(arguments, 5);
      len = caseData.length;
      switch (len % 5) {
      case 0:
        break;
      case 1:
        --len;
        defaultCase = caseData[len];
        break;
      default: throw Error("Unknown number of arguments passed to fromJSON");
      }
      resultCases = [];
      for (i = 0; i < len; i += 5) {
        cLine = caseData[i];
        cColumn = caseData[i + 1];
        cFile = caseData[i + 2];
        cNode = caseData[i + 3];
        cBody = caseData[i + 4];
        resultCases.push(SwitchCase(
          makePos(cLine, cColumn, cFile),
          fromJSON(cNode),
          fromJSON(cBody)
        ));
      }
      return Switch(
        makePos(line, column, file),
        fromJSON(node),
        resultCases,
        fromJSON(defaultCase),
        label ? fromJSON(label) : null
      );
    };
    Switch.Case = SwitchCase = (function () {
      var _SwitchCase_prototype;
      function SwitchCase(pos, node, body) {
        var _this;
        _this = this instanceof SwitchCase ? this : __create(_SwitchCase_prototype);
        if (typeof pos !== "object" || pos === null) {
          throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
        }
        _this.pos = pos;
        if (node == null) {
          node = Noop(pos);
        }
        if (body == null) {
          body = Noop(pos);
        } else if (!(body instanceof Node)) {
          throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
        }
        if (!(node instanceof Expression)) {
          node = toConst(pos, node);
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
          return SwitchCase(this.pos, node, body);
        } else {
          return this;
        }
      };
      _SwitchCase_prototype.inspect = function (depth) {
        return inspectHelper(
          depth,
          "Case",
          this.pos,
          this.node,
          this.body
        );
      };
      return SwitchCase;
    }());
    return Switch;
  }(Statement));
  exports.TryCatch = TryCatch = (function (Statement) {
    var _Statement_prototype, _TryCatch_prototype;
    function TryCatch(pos, tryBody, catchIdent, catchBody, label) {
      var _this;
      _this = this instanceof TryCatch ? this : __create(_TryCatch_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (tryBody == null) {
        tryBody = Noop(pos);
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a " + __name(Node) + ", got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Ident)) {
        throw TypeError("Expected catchIdent to be a " + __name(Ident) + ", got " + __typeof(catchIdent));
      }
      _this.catchIdent = catchIdent;
      if (catchBody == null) {
        catchBody = Noop(pos);
      } else if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a " + __name(Node) + ", got " + __typeof(catchBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      _this.tryBody = tryBody.maybeToStatement();
      if (_this.tryBody.isNoop()) {
        return _this.tryBody;
      }
      _this.catchBody = catchBody.maybeToStatement();
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _TryCatch_prototype = TryCatch.prototype = __create(_Statement_prototype);
    _TryCatch_prototype.constructor = TryCatch;
    TryCatch.displayName = "TryCatch";
    if (typeof Statement.extended === "function") {
      Statement.extended(TryCatch);
    }
    _TryCatch_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, childOptions, minify;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      sb(minify ? "try{" : "try {\n");
      childOptions = incIndent(options);
      if (!minify) {
        sb.indent(childOptions.indent);
      }
      this.tryBody.compileAsStatement(childOptions, true, sb);
      if (!minify) {
        sb("\n");
        sb.indent(options.indent);
      }
      sb(minify ? "}catch(" : "} catch (");
      this.catchIdent.compile(options, 2, false, sb);
      sb(minify ? "){" : ") {");
      if (!this.catchBody.isNoop()) {
        if (!minify) {
          sb("\n");
          sb.indent(childOptions.indent);
        }
        this.catchBody.compileAsStatement(childOptions, true, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
      }
      sb("}");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _TryCatch_prototype.walk = function (walker) {
      var _ref, catchBody, catchIdent, label, tryBody;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (tryBody !== this.tryBody || catchIdent !== this.catchIdent || catchBody !== this.catchBody || label !== this.label) {
        return TryCatch(
          this.pos,
          tryBody,
          catchIdent,
          catchBody,
          label
        );
      } else {
        return this;
      }
    };
    _TryCatch_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TryCatch",
        this.pos,
        this.tryBody,
        this.catchIdent,
        this.catchBody,
        this.label
      );
    };
    _TryCatch_prototype._toJSON = function () {
      var result;
      result = [
        this.label || 0,
        simplify(this.tryBody, 0),
        this.catchIdent
      ];
      if (simplify(this.catchBody)) {
        result.push.apply(result, __toArray(this.catchBody.toJSON()));
      }
      return result;
    };
    TryCatch.fromJSON = function (line, column, file, label, tryBody, catchIdent) {
      var catchBody;
      catchBody = __slice.call(arguments, 6);
      return TryCatch(
        makePos(line, column, file),
        fromJSON(tryBody),
        fromJSON(catchIdent),
        fromJSON(catchBody),
        label ? fromJSON(label) : null
      );
    };
    return TryCatch;
  }(Statement));
  exports.TryFinally = TryFinally = (function (Statement) {
    var _Statement_prototype, _TryFinally_prototype;
    function TryFinally(pos, tryBody, finallyBody, label) {
      var _this;
      _this = this instanceof TryFinally ? this : __create(_TryFinally_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (tryBody == null) {
        tryBody = Noop(pos);
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a " + __name(Node) + ", got " + __typeof(tryBody));
      }
      if (finallyBody == null) {
        finallyBody = Noop(pos);
      } else if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a " + __name(Node) + ", got " + __typeof(finallyBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof Ident)) {
        throw TypeError("Expected label to be one of " + (__name(Ident) + " or null") + ", got " + __typeof(label));
      }
      _this.label = label;
      _this.tryBody = tryBody.maybeToStatement();
      _this.finallyBody = finallyBody.maybeToStatement();
      if (label == null) {
        if (_this.tryBody.isNoop()) {
          return _this.finallyBody;
        } else if (_this.finallyBody.isNoop()) {
          return _this.tryBody;
        }
      }
      return _this;
    }
    _Statement_prototype = Statement.prototype;
    _TryFinally_prototype = TryFinally.prototype = __create(_Statement_prototype);
    _TryFinally_prototype.constructor = TryFinally;
    TryFinally.displayName = "TryFinally";
    if (typeof Statement.extended === "function") {
      Statement.extended(TryFinally);
    }
    _TryFinally_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, childOptions, minify;
      if (level !== 1) {
        throw Error("Cannot compile a statement except on the Block level");
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      minify = options.minify;
      if (this.label != null) {
        this.label.compile(options, level, lineStart, sb);
        sb(":");
        if (!minify) {
          sb(" ");
        }
      }
      sb(minify ? "try{" : "try {\n");
      childOptions = incIndent(options);
      if (!minify) {
        sb.indent(childOptions.indent);
      }
      if (this.tryBody instanceof TryCatch && this.tryBody.label == null) {
        this.tryBody.tryBody.compileAsStatement(childOptions, true, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
        sb(minify ? "}catch(" : "} catch (");
        this.tryBody.catchIdent.compile(options, 2, false, sb);
        sb(minify ? "){" : ") {");
        if (!this.tryBody.catchBody.isNoop()) {
          if (!minify) {
            sb("\n");
            sb.indent(childOptions.indent);
          }
          this.tryBody.catchBody.compileAsStatement(childOptions, true, sb);
          if (!minify) {
            sb("\n");
            sb.indent(options.indent);
          }
        }
      } else {
        this.tryBody.compileAsStatement(childOptions, true, sb);
        if (!minify) {
          sb("\n");
          sb.indent(options.indent);
        }
      }
      sb(minify ? "}finally{" : "} finally {\n");
      if (!minify) {
        sb.indent(childOptions.indent);
      }
      this.finallyBody.compileAsStatement(childOptions, true, sb);
      if (!minify) {
        sb("\n");
        sb.indent(options.indent);
      }
      sb("}");
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _TryFinally_prototype.walk = function (walker) {
      var _ref, finallyBody, label, tryBody;
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
      if (this.label != null) {
        if ((_ref = walker(this.label)) != null) {
          label = _ref;
        } else {
          label = this.label.walk(walker);
        }
      } else {
        label = this.label;
      }
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody || label !== this.label) {
        return TryFinally(this.pos, tryBody, finallyBody, label);
      } else {
        return this;
      }
    };
    _TryFinally_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TryFinally",
        this.pos,
        this.tryBody,
        this.finallyBody,
        this.label
      );
    };
    _TryFinally_prototype._toJSON = function () {
      var result;
      result = [
        this.label || 0,
        simplify(this.tryBody, 0)
      ];
      if (simplify(this.finallyBody)) {
        result.push.apply(result, __toArray(this.finallyBody.toJSON()));
      }
      return result;
    };
    TryFinally.fromJSON = function (line, column, file, label, tryBody) {
      var finallyBody;
      finallyBody = __slice.call(arguments, 5);
      return TryFinally(
        makePos(line, column, file),
        fromJSON(tryBody),
        fromJSON(finallyBody),
        label ? fromJSON(label) : null
      );
    };
    return TryFinally;
  }(Statement));
  exports.Unary = Unary = (function (Expression) {
    var _Expression_prototype, _Unary_prototype, ASSIGNMENT_OPERATORS,
        KNOWN_OPERATORS;
    function Unary(pos, op, node) {
      var _this;
      _this = this instanceof Unary ? this : __create(_Unary_prototype);
      if (typeof pos !== "object" || pos === null) {
        throw TypeError("Expected pos to be an Object, got " + __typeof(pos));
      }
      _this.pos = pos;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      _this.op = op;
      if (node == null) {
        node = Noop(pos);
      }
      if (!__in(op, KNOWN_OPERATORS)) {
        throw Error("Unknown unary operator: " + op);
      }
      if (!(node instanceof Expression)) {
        node = toConst(line, column, node);
      }
      if (op === "delete" && (!(node instanceof Binary) || node.op !== ".")) {
        throw Error("Cannot use delete operator on a non-access");
      }
      _this.node = node;
      return _this;
    }
    _Expression_prototype = Expression.prototype;
    _Unary_prototype = Unary.prototype = __create(_Expression_prototype);
    _Unary_prototype.constructor = Unary;
    Unary.displayName = "Unary";
    if (typeof Expression.extended === "function") {
      Expression.extended(Unary);
    }
    _Unary_prototype.compile = function (options, level, lineStart, sb) {
      var _ref, op;
      op = this.op;
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.pushFile(this.pos.file);
      }
      if ((_ref = options.sourcemap) != null) {
        _ref.add(sb.line, sb.column, this.pos.line, this.pos.column);
      }
      if (op === "++post" || op === "--post") {
        this.node.compile(options, 16, false, sb);
        sb(op.substring(0, 2));
      } else {
        sb(op);
        if (op === "typeof" || op === "void" || op === "delete" || (op === "+" || op === "-" || op === "++" || op === "--") && (this.node instanceof Unary && (op === "+" || op === "-" || op === "++" || op === "--") || this.node instanceof Const && typeof this.node.value === "number" && isNegative(this.node.value))) {
          sb(" ");
        }
        this.node.compile(options, 16, false, sb);
      }
      if (options.sourcemap != null && this.pos.file) {
        options.sourcemap.popFile();
      }
    };
    _Unary_prototype.compileAsBlock = function (options, level, lineStart, sb) {
      var op;
      op = this.op;
      if (__owns.call(ASSIGNMENT_OPERATORS, op)) {
        this.compile(options, level, lineStart, sb);
      } else {
        this.node.compileAsBlock(options, level, lineStart, sb);
      }
    };
    _Unary_prototype.compileAsStatement = function (options, lineStart, sb) {
      var op;
      op = this.op;
      if (__owns.call(ASSIGNMENT_OPERATORS, op)) {
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
        return this._isNoop = !__owns.call(ASSIGNMENT_OPERATORS, this.op) && this.node.isNoop();
      } else {
        return _ref;
      }
    };
    _Unary_prototype.walk = function (walker) {
      var _ref, node;
      if ((_ref = walker(this.node)) != null) {
        node = _ref;
      } else {
        node = this.node.walk(walker);
      }
      if (node !== this.node) {
        return Unary(this.pos, this.op, node);
      } else {
        return this;
      }
    };
    _Unary_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "Unary",
        this.pos,
        this.op,
        this.node
      );
    };
    _Unary_prototype._toJSON = function () {
      var result;
      result = [this.op];
      if (simplify(this.node)) {
        result.push.apply(result, __toArray(this.node.toJSON()));
      }
      return result;
    };
    Unary.fromJSON = function (line, column, file, op) {
      var node;
      node = __slice.call(arguments, 4);
      return Unary(
        makePos(line, column, file),
        op,
        fromJSON(node)
      );
    };
    return Unary;
  }(Expression));
  While = exports.While = function (pos, test, body, label) {
    return For(
      pos,
      null,
      test,
      null,
      body,
      label
    );
  };
  fromJSON = exports.fromJSON = function (obj) {
    var _ref, type;
    if (!obj) {
      return Noop(makePos(0, 0));
    }
    if (__isArray(obj)) {
      if (obj.length === 0) {
        return Noop(makePos(0, 0));
      }
      type = obj[0];
      if (__num(obj.length) < 1 || typeof type !== "string") {
        throw Error("Expected an array with a string as its first item");
      }
      if (!__owns.call(exports, type)) {
        throw Error("Unknown node type: " + __strnum(obj.type));
      }
      return (_ref = exports[type]).fromJSON.apply(_ref, __toArray(__slice.call(obj, 1)));
    } else if (typeof obj === "object" && obj !== null) {
      if (typeof obj.type !== "string") {
        throw Error("Expected an object with a string 'type' key");
      }
      if (!__owns.call(exports, obj.type)) {
        throw Error("Unknown node type: " + __strnum(obj.type));
      }
      return exports[obj.type].fromJSON(obj);
    } else {
      throw TypeError("Must provide an object or array to deserialize");
    }
  };
  function arrayFromJSON(array) {
    var _arr, _arr2, _i, _len, item;
    if (array == null) {
      return [];
    } else if (__isArray(array)) {
      for (_arr = [], _arr2 = __toArray(array), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        item = _arr2[_i];
        _arr.push(fromJSON(item));
      }
      return _arr;
    } else {
      throw Error("Expected an array, got " + __typeof(array));
    }
  }
}.call(this));
