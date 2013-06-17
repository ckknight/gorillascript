(function (GLOBAL) {
  "use strict";
  var __async, __create, __curry, __isArray, __keys, __once, __owns, __slice,
      __toArray, __typeof, _ref, AssignNode, BinaryNode, CallNode,
      EmbedWriteNode, FunctionNode, IdentNode, inspect, isPrimordial,
      MacroAccessNode, MacroConstNode, map, mapAsync, Node, nodeToType,
      NothingNode, ParamNode, quote, RootNode, SuperNode, SyntaxChoiceNode,
      SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, TmpNode, Type,
      TypeFunctionNode, TypeGenericNode, TypeObjectNode, TypeUnionNode;
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
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (numArgs > 1) {
      currier = function (args) {
        var ret;
        if (args.length >= numArgs) {
          return f.apply(this, args);
        } else {
          ret = function () {
            if (arguments.length === 0) {
              return ret;
            } else {
              return currier.call(this, args.concat(__slice.call(arguments)));
            }
          };
          return ret;
        }
      };
      return currier([]);
    } else {
      return f;
    }
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __keys = typeof Object.keys === "function" ? Object.keys
    : function (x) {
      var key, keys;
      keys = [];
      for (key in x) {
        if (__owns.call(x, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
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
  _ref = require("./parser-utils");
  nodeToType = _ref.nodeToType;
  map = _ref.map;
  mapAsync = _ref.mapAsync;
  _ref = require("./utils");
  quote = _ref.quote;
  isPrimordial = _ref.isPrimordial;
  if ((_ref = require("util")) != null) {
    inspect = _ref.inspect;
  }
  function LispyNode_Value(index, value) {
    return require("./parser-lispynodes").Value(index, value);
  }
  function simplifyArray(array) {
    var i, item;
    if (array.length === 0) {
      return array;
    } else {
      array = array.slice();
      for (i = array.length; i--; ) {
        item = array[i];
        if (!item || item instanceof NothingNode || item.length === 0) {
          array.pop();
        } else {
          break;
        }
      }
      return array;
    }
  }
  Node = (function () {
    var _Node_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw Error("Node should not be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    Node.displayName = "Node";
    _Node_prototype.type = function () {
      return Type.any;
    };
    _Node_prototype.walk = function (f, context) {
      return this;
    };
    _Node_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    _Node_prototype.cacheable = true;
    _Node_prototype.withLabel = function (label) {
      var LispyNode;
      if (label == null) {
        label = null;
      }
      LispyNode = require("./parser-lispynodes");
      if (label === null) {
        return this;
      } else {
        return LispyNode.InternalCall(
          "label",
          this.index,
          this.scope,
          label,
          this
        );
      }
    };
    _Node_prototype._reduce = function (parser) {
      return this.walk(function (node) {
        return node.reduce(parser);
      });
    };
    _Node_prototype.reduce = function (parser) {
      var reduced;
      if (this._reduced != null) {
        return this._reduced;
      } else {
        reduced = this._reduce(parser);
        if (reduced === this) {
          return this._reduced = this;
        } else {
          return this._reduced = reduced.reduce(parser);
        }
      }
    };
    _Node_prototype.isConst = function () {
      return false;
    };
    _Node_prototype.constValue = function () {
      throw Error("Not a const: " + __typeof(this));
    };
    _Node_prototype.isConstType = function () {
      return false;
    };
    _Node_prototype.isConstValue = function () {
      return false;
    };
    _Node_prototype.isLiteral = function () {
      return this.isConst();
    };
    _Node_prototype.literalValue = function () {
      return this.constValue();
    };
    _Node_prototype.isNoop = function (o) {
      return this.reduce(o)._isNoop(o);
    };
    _Node_prototype._isNoop = function (o) {
      return false;
    };
    _Node_prototype.isStatement = function () {
      return false;
    };
    _Node_prototype.rescope = function (newScope) {
      var oldScope;
      if (!this.scope || this.scope === newScope) {
        return this;
      }
      oldScope = this.scope;
      this.scope = newScope;
      function walker(node) {
        var nodeScope, parent;
        nodeScope = node.scope;
        if (!nodeScope || nodeScope === newScope) {
          return node;
        } else if (nodeScope === oldScope) {
          return node.rescope(newScope);
        } else {
          parent = nodeScope.parent;
          if (parent === oldScope) {
            nodeScope.reparent(newScope);
          }
          return node.walk(walker);
        }
      }
      return this.walk(walker);
    };
    _Node_prototype.doWrap = function (parser) {
      var innerScope, result;
      if (this.isStatement()) {
        innerScope = parser.pushScope(true, this.scope);
        result = CallNode(
          this.index,
          this.scope,
          FunctionNode(
            this.index,
            this.scope,
            [],
            this.rescope(innerScope),
            true,
            true
          ),
          []
        );
        parser.popScope();
        return result;
      } else {
        return this;
      }
    };
    _Node_prototype.mutateLast = function (o, func, context, includeNoop) {
      var _ref;
      if ((_ref = func.call(context, this)) != null) {
        return _ref;
      } else {
        return this;
      }
    };
    Node.byTypeId = [];
    _Node_prototype._toJSON = function () {
      var _this;
      _this = this;
      return simplifyArray((function () {
        var _arr, _arr2, _i, _len, argName;
        for (_arr = [], _arr2 = __toArray(_this.constructor.argNames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          argName = _arr2[_i];
          _arr.push(_this[argName]);
        }
        return _arr;
      }()));
    };
    return Node;
  }());
  function inspectHelper(depth, name, index) {
    var _arr, _i, _len, _some, arg, args, d, found, hasLarge, part, parts;
    args = __slice.call(arguments, 3);
    if (depth != null) {
      d = depth - 1;
    } else {
      d = null;
    }
    found = false;
    for (_i = args.length; _i--; ) {
      arg = args[_i];
      if (!arg || arg instanceof NothingNode || __isArray(arg) && arg.length === 0) {
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
        _arr.push("  " + part.split("\n").join("\n  "));
      }
      parts = _arr;
      return name + "(\n" + parts.join(",\n") + ")";
    } else {
      return name + "(" + parts.join(", ") + ")";
    }
  }
  Node.Assign = Node.byTypeId[5] = AssignNode = (function (Node) {
    var _AssignNode_prototype, _Node_prototype;
    function AssignNode(index, scope, left, op, right) {
      var _this;
      _this = this instanceof AssignNode ? this : __create(_AssignNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AssignNode_prototype = AssignNode.prototype = __create(_Node_prototype);
    _AssignNode_prototype.constructor = AssignNode;
    AssignNode.displayName = "AssignNode";
    if (typeof Node.extended === "function") {
      Node.extended(AssignNode);
    }
    _AssignNode_prototype.typeId = 5;
    AssignNode.argNames = ["left", "op", "right"];
    _AssignNode_prototype.type = (function () {
      var ops;
      ops = {
        "=": function (left, right) {
          return right;
        },
        "+=": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
            return Type.stringOrNumber;
          } else {
            return Type.string;
          }
        },
        "-=": Type.number,
        "*=": Type.number,
        "/=": Type.number,
        "%=": Type.number,
        "<<=": Type.number,
        ">>=": Type.number,
        ">>>=": Type.number,
        "&=": Type.number,
        "^=": Type.number,
        "|=": Type.number
      };
      return function (o) {
        var _ref, _ref2, type;
        if ((_ref = this._type) == null) {
          if (__owns.call(ops, _ref2 = this.op)) {
            type = ops[_ref2];
          }
          if (!type) {
            return this._type = Type.any;
          } else if (typeof type === "function") {
            return this._type = type(this.left.type(o), this.right.type(o));
          } else {
            return this._type = type;
          }
        } else {
          return _ref;
        }
      };
    }());
    _AssignNode_prototype._reduce = function (o) {
      var left, right;
      left = this.left.reduce(o);
      right = this.right.reduce(o).doWrap(o);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "AssignNode",
        this.index,
        this.left,
        this.op,
        this.right
      );
    };
    _AssignNode_prototype.walk = function (f, context) {
      var left, right;
      left = f.call(context, this.left);
      right = f.call(context, this.right);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.left, (_once = false, function (_e, left) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.right, (_once2 = false, function (_e2, right) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? AssignNode(
              _this.index,
              _this.scope,
              left,
              _this.op,
              right
            )
            : _this);
        }));
      }));
    };
    return AssignNode;
  }(Node));
  Node.Binary = Node.byTypeId[6] = BinaryNode = (function (Node) {
    var _BinaryNode_prototype, _Node_prototype;
    function BinaryNode(index, scope, left, op, right) {
      var _this;
      _this = this instanceof BinaryNode ? this : __create(_BinaryNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BinaryNode_prototype = BinaryNode.prototype = __create(_Node_prototype);
    _BinaryNode_prototype.constructor = BinaryNode;
    BinaryNode.displayName = "BinaryNode";
    if (typeof Node.extended === "function") {
      Node.extended(BinaryNode);
    }
    _BinaryNode_prototype.typeId = 6;
    BinaryNode.argNames = ["left", "op", "right"];
    _BinaryNode_prototype.type = (function () {
      var ops;
      ops = {
        "*": Type.number,
        "/": Type.number,
        "%": Type.number,
        "+": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
            return Type.stringOrNumber;
          } else {
            return Type.string;
          }
        },
        "-": Type.number,
        "<<": Type.number,
        ">>": Type.number,
        ">>>": Type.number,
        "<": Type.boolean,
        "<=": Type.boolean,
        ">": Type.boolean,
        ">=": Type.boolean,
        "in": Type.boolean,
        "instanceof": Type.boolean,
        "==": Type.boolean,
        "!=": Type.boolean,
        "===": Type.boolean,
        "!==": Type.boolean,
        "&": Type.number,
        "^": Type.number,
        "|": Type.number,
        "&&": function (left, right) {
          return left.intersect(Type.potentiallyFalsy).union(right);
        },
        "||": function (left, right) {
          return left.intersect(Type.potentiallyTruthy).union(right);
        }
      };
      return function (o) {
        var _ref, _ref2, type;
        if ((_ref = this._type) == null) {
          if (__owns.call(ops, _ref2 = this.op)) {
            type = ops[_ref2];
          }
          if (!type) {
            return this._type = Type.any;
          } else if (typeof type === "function") {
            return this._type = type(this.left.type(o), this.right.type(o));
          } else {
            return this._type = type;
          }
        } else {
          return _ref;
        }
      };
    }());
    _BinaryNode_prototype._reduce = (function () {
      var constOps, leftConstOps, nonConstOps, rightConstOps;
      constOps = {
        "*": __curry(2, function (x, y) {
          return x * y;
        }),
        "/": __curry(2, function (x, y) {
          return x / y;
        }),
        "%": __curry(2, function (x, y) {
          return x % y;
        }),
        "+": (function () {
          function isJSNumeric(x) {
            var _ref;
            return x === null || (_ref = typeof x) === "number" || _ref === "boolean" || _ref === "undefined";
          }
          return function (left, right) {
            if (isJSNumeric(left) && isJSNumeric(right)) {
              return left - -right;
            } else {
              return "" + left + right;
            }
          };
        }()),
        "-": __curry(2, function (x, y) {
          return x - y;
        }),
        "<<": __curry(2, function (x, y) {
          return x << y;
        }),
        ">>": __curry(2, function (x, y) {
          return x >> y;
        }),
        ">>>": __curry(2, function (x, y) {
          return x >>> y;
        }),
        "<": __curry(2, function (x, y) {
          return x < y;
        }),
        "<=": __curry(2, function (x, y) {
          return x <= y;
        }),
        ">": __curry(2, function (x, y) {
          return x > y;
        }),
        ">=": __curry(2, function (x, y) {
          return x >= y;
        }),
        "==": __curry(2, function (x, y) {
          return x == y;
        }),
        "!=": __curry(2, function (x, y) {
          return x != y;
        }),
        "===": __curry(2, function (x, y) {
          return x === y;
        }),
        "!==": __curry(2, function (x, y) {
          return x !== y;
        }),
        "&": __curry(2, function (x, y) {
          return x & y;
        }),
        "^": __curry(2, function (x, y) {
          return x ^ y;
        }),
        "|": __curry(2, function (x, y) {
          return x | y;
        }),
        "&&": __curry(2, function (x, y) {
          return x && y;
        }),
        "||": __curry(2, function (x, y) {
          return x || y;
        })
      };
      function leftConstNan(x, y) {
        var _ref, LispyNode;
        if ((_ref = x.constValue()) !== _ref) {
          LispyNode = require("./parser-lispynodes");
          return LispyNode.InternalCall(
            "block",
            this.index,
            this.scope,
            y,
            x
          );
        }
      }
      leftConstOps = {
        "*": function (x, y) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (x.constValue() === 1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), y);
          } else if (x.constValue() === -1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["-"](this.index), y);
          } else if ((_ref = x.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              y,
              x
            );
          }
        },
        "/": leftConstNan,
        "%": leftConstNan,
        "+": function (x, y, o) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (x.constValue() === 0 && y.type(o).isSubsetOf(Type.number)) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), y);
          } else if (x.constValue() === "" && y.type(o).isSubsetOf(Type.string)) {
            return y;
          } else if (typeof x.constValue() === "string" && y instanceof BinaryNode && y.op === "+" && y.left.isConst() && typeof y.left.constValue() === "string") {
            return BinaryNode(
              this.index,
              this.scope,
              LispyNode_Value(x.index, "" + x.constValue() + y.left.constValue()),
              "+",
              y.right
            );
          } else if ((_ref = x.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              y,
              x
            );
          }
        },
        "-": function (x, y) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (x.constValue() === 0) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["-"](this.index), y);
          } else if ((_ref = x.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              y,
              x
            );
          }
        },
        "<<": leftConstNan,
        ">>": leftConstNan,
        ">>>": leftConstNan,
        "&": leftConstNan,
        "|": leftConstNan,
        "^": leftConstNan,
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
        }
      };
      function rightConstNan(x, y) {
        var _ref, LispyNode;
        if ((_ref = y.constValue()) !== _ref) {
          LispyNode = require("./parser-lispynodes");
          return LispyNode.InternalCall(
            "block",
            this.index,
            this.scope,
            x,
            y
          );
        }
      }
      rightConstOps = {
        "*": function (x, y) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (y.constValue() === 1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), x);
          } else if (y.constValue() === -1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["-"](this.index), x);
          } else if ((_ref = y.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          }
        },
        "/": function (x, y) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (y.constValue() === 1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), x);
          } else if (y.constValue() === -1) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["-"](this.index), x);
          } else if ((_ref = y.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          }
        },
        "%": rightConstNan,
        "+": function (x, y, o) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (y.constValue() === 0 && x.type(o).isSubsetOf(Type.number)) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), x);
          } else if (typeof y.constValue() === "number" && y.constValue() < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.index,
              this.scope,
              x,
              "-",
              LispyNode_Value(y.index, -y.constValue())
            );
          } else if (y.constValue() === "" && x.type(o).isSubsetOf(Type.string)) {
            return x;
          } else if (typeof y.constValue() === "string" && x instanceof BinaryNode && x.op === "+" && x.right.isConst() && typeof x.right.constValue() === "string") {
            return BinaryNode(
              this.index,
              this.scope,
              x.left,
              "+",
              LispyNode_Value(x.right.index, "" + x.right.constValue() + y.constValue())
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          }
        },
        "-": function (x, y, o) {
          var _ref, LispyNode;
          LispyNode = require("./parser-lispynodes");
          if (y.constValue() === 0) {
            return LispyNode.Call(this.index, this.scope, LispyNode.Symbol.unary["+"](this.index), x);
          } else if (typeof y.constValue() === "number" && y.constValue() < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.index,
              this.scope,
              x,
              "+",
              LispyNode_Value(y.index, -y.constValue())
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          }
        },
        "<<": rightConstNan,
        ">>": rightConstNan,
        ">>>": rightConstNan,
        "&": rightConstNan,
        "|": rightConstNan,
        "^": rightConstNan
      };
      function removeUnaryPlus(x, y) {
        var LispyNode, newX, newY;
        LispyNode = require("./parser-lispynodes");
        if (x instanceof LispyNode && x.isUnaryCall("+")) {
          newX = x.args[0];
        } else {
          newX = x;
        }
        if (y instanceof LispyNode && y.isUnaryCall("+")) {
          newY = y.args[0];
        } else {
          newY = y;
        }
        if (x !== newX || y !== newY) {
          return BinaryNode(
            this.index,
            this.scope,
            newX,
            this.op,
            newY
          );
        }
      }
      nonConstOps = {
        "*": removeUnaryPlus,
        "/": removeUnaryPlus,
        "%": removeUnaryPlus,
        "-": removeUnaryPlus,
        "<<": removeUnaryPlus,
        ">>": removeUnaryPlus,
        ">>>": removeUnaryPlus,
        "&": removeUnaryPlus,
        "^": removeUnaryPlus,
        "|": removeUnaryPlus,
        "&&": function (x, y, o) {
          var LispyNode, truthy, xRightType, xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            LispyNode = require("./parser-lispynodes");
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            return x;
          } else if (x instanceof BinaryNode && x.op === "&&") {
            if (x.right.isConst()) {
              truthy = !!x.right.constValue();
            } else {
              xRightType = x.right.type(o);
              if (xRightType.isSubsetOf(Type.alwaysTruthy)) {
                truthy = true;
              } else if (xRightType.isSubsetOf(Type.alwaysFalsy)) {
                truthy = false;
              } else {
                truthy = null;
              }
            }
            if (truthy === true) {
              LispyNode = require("./parser-lispynodes");
              return BinaryNode(
                this.index,
                this.scope,
                x.left,
                "&&",
                LispyNode.InternalCall(
                  "block",
                  x.right.index,
                  this.scope,
                  x.right,
                  y
                )
              );
            } else if (truthy === false) {
              return x;
            }
          }
        },
        "||": function (x, y, o) {
          var LispyNode, test, truthy, whenTrue, xRightType, xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            return x;
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            LispyNode = require("./parser-lispynodes");
            return LispyNode.InternalCall(
              "block",
              this.index,
              this.scope,
              x,
              y
            );
          } else if (x instanceof BinaryNode && x.op === "||") {
            if (x.right.isConst()) {
              truthy = !!x.right.constValue();
            } else {
              xRightType = x.right.type(o);
              if (xRightType.isSubsetOf(Type.alwaysTruthy)) {
                truthy = true;
              } else if (xRightType.isSubsetOf(Type.alwaysFalsy)) {
                truthy = false;
              } else {
                truthy = null;
              }
            }
            if (truthy === true) {
              return x;
            } else if (truthy === false) {
              LispyNode = require("./parser-lispynodes");
              return BinaryNode(
                this.index,
                this.scope,
                x.left,
                "||",
                LispyNode.InternalCall(
                  "block",
                  x.right.index,
                  this.scope,
                  x.right,
                  y
                )
              );
            }
          } else {
            LispyNode = require("./parser-lispynodes");
            if (x instanceof LispyNode && x.isInternalCall("if") && x.args[2].isConst() && !x.args[2].constValue()) {
              test = x.args[0];
              whenTrue = x.args[1];
              while (whenTrue instanceof LispyNode && whenTrue.isInternalCall("if") && whenTrue.args[2].isConst() && !whenTrue.args[2].constValue()) {
                test = BinaryNode(
                  x.index,
                  x.scope,
                  test,
                  "&&",
                  whenTrue.args[0]
                );
                whenTrue = whenTrue.args[2];
              }
              return BinaryNode(
                this.index,
                this.scope,
                BinaryNode(
                  x.index,
                  x.scope,
                  test,
                  "&&",
                  whenTrue
                ),
                "||",
                y
              );
            }
          }
        }
      };
      return function (o) {
        var _ref, _ref2, left, op, right;
        left = this.left.reduce(o).doWrap(o);
        right = this.right.reduce(o).doWrap(o);
        op = this.op;
        if (left.isConst()) {
          if (right.isConst() && __owns.call(constOps, op)) {
            return LispyNode_Value(this.index, constOps[op](left.constValue(), right.constValue()));
          }
          if (__owns.call(leftConstOps, op)) {
            if ((_ref = leftConstOps[op].call(this, left, right, o)) != null) {
              return _ref;
            }
          } else if ((_ref2 = void 0) != null) {
            return _ref2;
          }
        }
        if (right.isConst()) {
          if (__owns.call(rightConstOps, op)) {
            if ((_ref = rightConstOps[op].call(this, left, right, o)) != null) {
              return _ref;
            }
          } else if ((_ref2 = void 0) != null) {
            return _ref2;
          }
        }
        if (__owns.call(nonConstOps, op)) {
          if ((_ref = nonConstOps[op].call(this, left, right, o)) != null) {
            return _ref;
          }
        } else if ((_ref2 = void 0) != null) {
          return _ref2;
        }
        if (left !== this.left || right !== this.right) {
          return BinaryNode(
            this.index,
            this.scope,
            left,
            op,
            right
          );
        } else {
          return this;
        }
      };
    }());
    _BinaryNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.left.isNoop(o) && this.right.isNoop(o);
      } else {
        return _ref;
      }
    };
    _BinaryNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "BinaryNode",
        this.index,
        this.left,
        this.op,
        this.right
      );
    };
    _BinaryNode_prototype.walk = function (f, context) {
      var left, right;
      left = f.call(context, this.left);
      right = f.call(context, this.right);
      if (left !== this.left || right !== this.right) {
        return BinaryNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _BinaryNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.left, (_once = false, function (_e, left) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.right, (_once2 = false, function (_e2, right) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? BinaryNode(
              _this.index,
              _this.scope,
              left,
              _this.op,
              right
            )
            : _this);
        }));
      }));
    };
    return BinaryNode;
  }(Node));
  Node.Call = Node.byTypeId[9] = CallNode = (function (Node) {
    var _CallNode_prototype, _Node_prototype;
    function CallNode(index, scope, func, args, isNew, isApply) {
      var _this;
      _this = this instanceof CallNode ? this : __create(_CallNode_prototype);
      if (typeof args === "undefined" || args === null) {
        args = [];
      }
      if (typeof isNew === "undefined" || isNew === null) {
        isNew = false;
      }
      if (typeof isApply === "undefined" || isApply === null) {
        isApply = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      _this.isApply = isApply;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _CallNode_prototype = CallNode.prototype = __create(_Node_prototype);
    _CallNode_prototype.constructor = CallNode;
    CallNode.displayName = "CallNode";
    if (typeof Node.extended === "function") {
      Node.extended(CallNode);
    }
    _CallNode_prototype.typeId = 9;
    CallNode.argNames = ["func", "args", "isNew", "isApply"];
    _CallNode_prototype.type = (function () {
      var PRIMORDIAL_FUNCTIONS, PRIMORDIAL_METHODS, PRIMORDIAL_SUBFUNCTIONS;
      PRIMORDIAL_FUNCTIONS = {
        Object: Type.object,
        String: Type.string,
        Number: Type.number,
        Boolean: Type.boolean,
        Function: Type["function"],
        Array: Type.array,
        Date: Type.string,
        RegExp: Type.regexp,
        Error: Type.error,
        RangeError: Type.error,
        ReferenceError: Type.error,
        SyntaxError: Type.error,
        TypeError: Type.error,
        URIError: Type.error,
        escape: Type.string,
        unescape: Type.string,
        parseInt: Type.number,
        parseFloat: Type.number,
        isNaN: Type.boolean,
        isFinite: Type.boolean,
        decodeURI: Type.string,
        decodeURIComponent: Type.string,
        encodeURI: Type.string,
        encodeURIComponent: Type.string
      };
      PRIMORDIAL_SUBFUNCTIONS = {
        Object: {
          getPrototypeOf: Type.object,
          getOwnPropertyDescriptor: Type.object,
          getOwnPropertyNames: Type.string.array(),
          create: Type.object,
          defineProperty: Type.object,
          defineProperties: Type.object,
          seal: Type.object,
          freeze: Type.object,
          preventExtensions: Type.object,
          isSealed: Type.boolean,
          isFrozen: Type.boolean,
          isExtensible: Type.boolean,
          keys: Type.string.array()
        },
        String: { fromCharCode: Type.string },
        Number: { isFinite: Type.boolean, isNaN: Type.boolean },
        Array: { isArray: Type.boolean },
        Math: {
          abs: Type.number,
          acos: Type.number,
          asin: Type.number,
          atan: Type.number,
          atan2: Type.number,
          ceil: Type.number,
          cos: Type.number,
          exp: Type.number,
          floor: Type.number,
          log: Type.number,
          max: Type.number,
          min: Type.number,
          pow: Type.number,
          random: Type.number,
          round: Type.number,
          sin: Type.number,
          sqrt: Type.number,
          tan: Type.number
        },
        JSON: { stringify: Type.string.union(Type["undefined"]), parse: Type.string.union(Type.number).union(Type.boolean).union(Type["null"]).union(Type.array).union(Type.object) },
        Date: { UTC: Type.number, now: Type.number }
      };
      PRIMORDIAL_METHODS = {
        String: {
          toString: Type.string,
          valueOf: Type.string,
          charAt: Type.string,
          charCodeAt: Type.number,
          concat: Type.string,
          indexOf: Type.number,
          lastIndexOf: Type.number,
          localeCompare: Type.number,
          match: Type.array.union(Type["null"]),
          replace: Type.string,
          search: Type.number,
          slice: Type.string,
          split: Type.string.array(),
          substring: Type.string,
          toLowerCase: Type.string,
          toLocaleLowerCase: Type.string,
          toUpperCase: Type.string,
          toLocaleUpperCase: Type.string,
          trim: Type.string
        },
        Boolean: { toString: Type.string, valueOf: Type.boolean },
        Number: {
          toString: Type.string,
          valueOf: Type.number,
          toLocaleString: Type.string,
          toFixed: Type.string,
          toExponential: Type.string,
          toPrecision: Type.string
        },
        Date: {
          toString: Type.string,
          toDateString: Type.string,
          toTimeString: Type.string,
          toLocaleString: Type.string,
          toLocaleDateString: Type.string,
          toLocaleTimeString: Type.string,
          valueOf: Type.number,
          getTime: Type.number,
          getFullYear: Type.number,
          getUTCFullYear: Type.number,
          getMonth: Type.number,
          getUTCMonth: Type.number,
          getDate: Type.number,
          getUTCDate: Type.number,
          getDay: Type.number,
          getUTCDay: Type.number,
          getHours: Type.number,
          getUTCHours: Type.number,
          getMinutes: Type.number,
          getUTCMinutes: Type.number,
          getSeconds: Type.number,
          getUTCSeconds: Type.number,
          getMilliseconds: Type.number,
          getUTCMilliseconds: Type.number,
          getTimezoneOffset: Type.number,
          setTime: Type.number,
          setMilliseconds: Type.number,
          setUTCMilliseconds: Type.number,
          setSeconds: Type.number,
          setUTCSeconds: Type.number,
          setMinutes: Type.number,
          setUTCMinutes: Type.number,
          setHours: Type.number,
          setUTCHours: Type.number,
          setDate: Type.number,
          setUTCDate: Type.number,
          setMonth: Type.number,
          setUTCMonth: Type.number,
          setFullYear: Type.number,
          setUTCFullYear: Type.number,
          toUTCString: Type.string,
          toISOString: Type.string,
          toJSON: Type.string
        },
        RegExp: { exec: Type.array.union(Type["null"]), test: Type.boolean, toString: Type.string },
        Error: { toString: Type.string }
      };
      return function (o) {
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, _ref2, _ref3, _ref4, _ref5, child, func, funcType,
                LispyNode, name, parent, parentType;
            func = _this.func;
            funcType = func.type(o);
            if (funcType.isSubsetOf(Type["function"])) {
              return funcType.args[0];
            } else if (func instanceof IdentNode) {
              name = func.name;
              if (__owns.call(PRIMORDIAL_FUNCTIONS, name)) {
                return PRIMORDIAL_FUNCTIONS[name];
              } else if (o != null ? o.macros.hasHelper(name) : void 0) {
                funcType = o.macros.helperType(name);
                if (funcType.isSubsetOf(Type["function"])) {
                  return funcType.args[0];
                }
              }
            } else {
              LispyNode = require("./parser-lispynodes");
              if (func instanceof LispyNode && func.isInternalCall("access")) {
                _ref = func.args;
                parent = _ref[0];
                child = _ref[1];
                if (child.isConst()) {
                  if ((_ref = child.constValue()) === "call" || _ref === "apply") {
                    parentType = parent.type(o);
                    if (parentType.isSubsetOf(Type["function"])) {
                      return parentType.args[0];
                    }
                  } else if (parent instanceof IdentNode) {
                    if (__owns.call(PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name)) {
                      if (__owns.call(_ref2 = PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.constValue())) {
                        if ((_ref4 = _ref2[_ref3]) != null) {
                          return _ref4;
                        }
                      } else if ((_ref5 = void 0) != null) {
                        return _ref5;
                      }
                    } else if ((_ref2 = void 0) != null) {
                      return _ref2;
                    }
                  }
                }
              }
            }
            return Type.any;
          }());
        } else {
          return _ref;
        }
      };
    }());
    _CallNode_prototype._reduce = (function () {
      var EVAL_SIMPLIFIERS, PURE_PRIMORDIAL_FUNCTIONS,
          PURE_PRIMORDIAL_SUBFUNCTIONS;
      EVAL_SIMPLIFIERS = {
        "true": function () {
          return LispyNode_Value(this.index, true);
        },
        "false": function () {
          return LispyNode_Value(this.index, false);
        },
        "void 0": function () {
          return LispyNode_Value(this.index, void 0);
        },
        "null": function () {
          return LispyNode_Value(this.index, null);
        }
      };
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
        String: true,
        Boolean: true,
        Number: true,
        RegExp: true
      };
      PURE_PRIMORDIAL_SUBFUNCTIONS = {
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
      return function (o) {
        var _arr, _i, _len, _ref, _ref2, _ref3, allConst, arg, args, child,
            constArgs, cValue, func, LispyNode, parent, pValue, value;
        func = this.func.reduce(o).doWrap(o);
        args = map(this.args, function (node) {
          return node.reduce(o).doWrap(o);
        });
        if (!this.isNew && !this.isApply) {
          constArgs = [];
          allConst = true;
          for (_arr = __toArray(args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            arg = _arr[_i];
            if (arg.isConst()) {
              constArgs.push(arg.constValue());
            } else {
              allConst = false;
              break;
            }
          }
          if (allConst) {
            if (func instanceof IdentNode) {
              if (func.name === "eval") {
                if (__owns.call(EVAL_SIMPLIFIERS, constArgs[0])) {
                  return EVAL_SIMPLIFIERS[constArgs[0]].call(this);
                }
              } else if (__owns.call(PURE_PRIMORDIAL_FUNCTIONS, func.name)) {
                try {
                  value = GLOBAL[func.name].apply(void 0, __toArray(constArgs));
                  if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                    return LispyNode_Value(this.index, value);
                  }
                } catch (e) {}
              }
            } else {
              LispyNode = require("./parser-lispynodes");
              if (func instanceof LispyNode && func.isInternalCall("access") && func.args[1].isConst()) {
                _ref = func.args;
                parent = _ref[0];
                child = _ref[1];
                cValue = child.constValue();
                if (parent.isConst()) {
                  pValue = parent.constValue();
                  if (typeof pValue[cValue] === "function") {
                    try {
                      value = pValue[cValue].apply(pValue, __toArray(constArgs));
                      if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                        return LispyNode_Value(this.index, value);
                      }
                    } catch (e) {}
                  }
                } else if (parent instanceof IdentNode && (__owns.call(PURE_PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name) && __owns.call(_ref2 = PURE_PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.value) ? _ref2[_ref3] : void 0)) {
                  try {
                    value = (_ref = GLOBAL[parent.name])[cValue].apply(_ref, __toArray(constArgs));
                    if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                      return LispyNode_Value(this.index, value);
                    }
                  } catch (e) {}
                }
              }
            }
          }
        }
        if (func !== this.func || args !== this.args) {
          return CallNode(
            this.index,
            this.scope,
            func,
            args,
            this.isNew,
            this.isApply
          );
        } else {
          return this;
        }
      };
    }());
    _CallNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "CallNode",
        this.index,
        this.func,
        this.args,
        this.isNew,
        this.isApply
      );
    };
    _CallNode_prototype.walk = function (f, context) {
      var args, func;
      func = f.call(context, this.func);
      args = map(this.args, f, context);
      if (func !== this.func || args !== this.args) {
        return CallNode(
          this.index,
          this.scope,
          func,
          args,
          this.isNew,
          this.isApply
        );
      } else {
        return this;
      }
    };
    _CallNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.func, (_once = false, function (_e, func) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.args, f, context, (_once2 = false, function (_e2, args) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, func !== _this.func || args !== _this.args
            ? CallNode(
              _this.index,
              _this.scope,
              func,
              args,
              _this.isNew,
              _this.isApply
            )
            : _this);
        }));
      }));
    };
    return CallNode;
  }(Node));
  Node.EmbedWrite = Node.byTypeId[16] = EmbedWriteNode = (function (Node) {
    var _EmbedWriteNode_prototype, _Node_prototype;
    function EmbedWriteNode(index, scope, text, escape) {
      var _this;
      _this = this instanceof EmbedWriteNode ? this : __create(_EmbedWriteNode_prototype);
      if (escape == null) {
        escape = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.text = text;
      _this.escape = escape;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _EmbedWriteNode_prototype = EmbedWriteNode.prototype = __create(_Node_prototype);
    _EmbedWriteNode_prototype.constructor = EmbedWriteNode;
    EmbedWriteNode.displayName = "EmbedWriteNode";
    if (typeof Node.extended === "function") {
      Node.extended(EmbedWriteNode);
    }
    _EmbedWriteNode_prototype.typeId = 16;
    EmbedWriteNode.argNames = ["text", "escape"];
    _EmbedWriteNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "EmbedWriteNode",
        this.index,
        this.text,
        this.escape
      );
    };
    _EmbedWriteNode_prototype.walk = function (f, context) {
      var text;
      text = f.call(context, this.text);
      if (text !== this.text) {
        return EmbedWriteNode(this.index, this.scope, text, this.escape);
      } else {
        return this;
      }
    };
    _EmbedWriteNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.text, (_once = false, function (_e, text) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, text !== _this.text ? EmbedWriteNode(_this.index, _this.scope, text, _this.escape) : _this);
      }));
    };
    return EmbedWriteNode;
  }(Node));
  Node.Function = Node.byTypeId[20] = FunctionNode = (function (Node) {
    var _FunctionNode_prototype, _Node_prototype;
    function FunctionNode(index, scope, params, body, autoReturn, bound, curry, asType, generator, generic) {
      var _this;
      _this = this instanceof FunctionNode ? this : __create(_FunctionNode_prototype);
      if (typeof params === "undefined" || params === null) {
        params = [];
      }
      if (typeof autoReturn === "undefined" || autoReturn === null) {
        autoReturn = true;
      }
      if (typeof bound === "undefined" || bound === null) {
        bound = false;
      }
      if (typeof curry === "undefined" || curry === null) {
        curry = false;
      }
      if (typeof asType === "undefined" || asType === null) {
        asType = void 0;
      }
      if (typeof generator === "undefined" || generator === null) {
        generator = false;
      }
      if (typeof generic === "undefined" || generic === null) {
        generic = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      _this.body = body;
      _this.autoReturn = autoReturn;
      _this.bound = bound;
      _this.curry = curry;
      _this.asType = asType;
      _this.generator = generator;
      _this.generic = generic;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _FunctionNode_prototype = FunctionNode.prototype = __create(_Node_prototype);
    _FunctionNode_prototype.constructor = FunctionNode;
    FunctionNode.displayName = "FunctionNode";
    if (typeof Node.extended === "function") {
      Node.extended(FunctionNode);
    }
    _FunctionNode_prototype.typeId = 20;
    FunctionNode.argNames = [
      "params",
      "body",
      "autoReturn",
      "bound",
      "curry",
      "asType",
      "generator",
      "generic"
    ];
    _FunctionNode_prototype.type = function (o) {
      var _ref, LispyNode, returnType, walker;
      if ((_ref = this._type) == null) {
        if (this.asType != null) {
          return this._type = nodeToType(this.asType)["function"]();
        } else {
          if (this.autoReturn) {
            returnType = this.body.type(o);
          } else {
            returnType = Type["undefined"];
          }
          LispyNode = require("./parser-lispynodes");
          walker = function (node) {
            var _ref;
            if (node instanceof LispyNode && node.isInternalCall("return")) {
              returnType = returnType.union(node.args[0].type(o));
              return node;
            } else if (node instanceof FunctionNode) {
              return node;
            } else if (node instanceof MacroAccessNode) {
              if ((_ref = node.data.macroName) === "return" || _ref === "return?") {
                if (node.data.macroData.node) {
                  returnType = returnType.union(node.data.macroData.node.type(o));
                } else {
                  returnType = returnType.union(Type["undefined"]);
                }
              }
              return node.walk(walker);
            } else {
              return node.walk(walker);
            }
          };
          walker(this.body);
          return this._type = returnType["function"]();
        }
      } else {
        return _ref;
      }
    };
    _FunctionNode_prototype._isNoop = function (o) {
      return true;
    };
    _FunctionNode_prototype._toJSON = function () {
      return [this.params, this.body, this.autoReturn].concat(__toArray(simplifyArray([
        this.bound,
        this.curry,
        this.asType,
        this.generator,
        this.generic
      ])));
    };
    _FunctionNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "FunctionNode",
        this.index,
        this.params,
        this.body,
        this.autoReturn,
        this.bound,
        this.curry,
        this.asType,
        this.generator,
        this.generic
      );
    };
    _FunctionNode_prototype.walk = function (f, context) {
      var asType, body, bound, params;
      params = map(this.params, f, context);
      body = f.call(context, this.body);
      if (this.bound instanceof Node) {
        bound = f.call(context, this.bound);
      } else {
        bound = this.bound;
      }
      if (this.asType instanceof Node) {
        asType = f.call(context, this.asType);
      } else {
        asType = this.asType;
      }
      if (params !== this.params || body !== this.body || bound !== this.bound || asType !== this.asType) {
        return FunctionNode(
          this.index,
          this.scope,
          params,
          body,
          this.autoReturn,
          bound,
          this.curry,
          asType,
          this.generator,
          this.generic
        );
      } else {
        return this;
      }
    };
    _FunctionNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.params, f, context, (_once = false, function (_e, params) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.body, (_once2 = false, function (_e2, body) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return (_this.bound instanceof Node
            ? function (next) {
              var _once3;
              return f.call(context, _this.bound, (_once3 = false, function (_e3, bound) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e3 != null) {
                  return callback(_e3);
                }
                return next(bound);
              }));
            }
            : function (next) {
              return next(_this.bound);
            })(function (bound) {
            return (_this.asType instanceof Node
              ? function (next) {
                var _once3;
                return f.call(context, _this.asType, (_once3 = false, function (_e3, asType) {
                  if (_once3) {
                    throw Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  if (_e3 != null) {
                    return callback(_e3);
                  }
                  return next(asType);
                }));
              }
              : function (next) {
                return next(_this.asType);
              })(function (asType) {
              return callback(null, params !== _this.params || body !== _this.body || bound !== _this.bound || asType !== _this.asType
                ? FunctionNode(
                  _this.index,
                  _this.scope,
                  params,
                  body,
                  _this.autoReturn,
                  bound,
                  _this.curry,
                  asType,
                  _this.generator,
                  _this.generic
                )
                : _this);
            });
          });
        }));
      }));
    };
    return FunctionNode;
  }(Node));
  Node.Ident = Node.byTypeId[21] = IdentNode = (function (Node) {
    var _IdentNode_prototype, _Node_prototype;
    function IdentNode(index, scope, name) {
      var _this;
      _this = this instanceof IdentNode ? this : __create(_IdentNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _IdentNode_prototype = IdentNode.prototype = __create(_Node_prototype);
    _IdentNode_prototype.constructor = IdentNode;
    IdentNode.displayName = "IdentNode";
    if (typeof Node.extended === "function") {
      Node.extended(IdentNode);
    }
    _IdentNode_prototype.typeId = 21;
    IdentNode.argNames = ["name"];
    _IdentNode_prototype.cacheable = false;
    _IdentNode_prototype.type = function (o) {
      if (this.name === "__currentArrayLength") {
        return Type.number;
      } else if (o) {
        return this.scope.type(this);
      } else {
        return Type.any;
      }
    };
    _IdentNode_prototype._isNoop = function (o) {
      return true;
    };
    _IdentNode_prototype.isPrimordial = function () {
      return isPrimordial(this.name);
    };
    _IdentNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "IdentNode", this.index, this.name);
    };
    _IdentNode_prototype.walk = function (f, context) {
      return this;
    };
    _IdentNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return IdentNode;
  }(Node));
  Node.MacroAccess = Node.byTypeId[23] = MacroAccessNode = (function (Node) {
    var _MacroAccessNode_prototype, _Node_prototype;
    function MacroAccessNode(index, scope, id, callLine, data, inStatement, inGenerator, inEvilAst, doWrapped) {
      var _this;
      _this = this instanceof MacroAccessNode ? this : __create(_MacroAccessNode_prototype);
      if (typeof inStatement === "undefined" || inStatement === null) {
        inStatement = false;
      }
      if (typeof inGenerator === "undefined" || inGenerator === null) {
        inGenerator = false;
      }
      if (typeof inEvilAst === "undefined" || inEvilAst === null) {
        inEvilAst = false;
      }
      if (typeof doWrapped === "undefined" || doWrapped === null) {
        doWrapped = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.callLine = callLine;
      _this.data = data;
      _this.inStatement = inStatement;
      _this.inGenerator = inGenerator;
      _this.inEvilAst = inEvilAst;
      _this.doWrapped = doWrapped;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _MacroAccessNode_prototype = MacroAccessNode.prototype = __create(_Node_prototype);
    _MacroAccessNode_prototype.constructor = MacroAccessNode;
    MacroAccessNode.displayName = "MacroAccessNode";
    if (typeof Node.extended === "function") {
      Node.extended(MacroAccessNode);
    }
    _MacroAccessNode_prototype.typeId = 23;
    MacroAccessNode.argNames = [
      "id",
      "callLine",
      "data",
      "inStatement",
      "inGenerator",
      "inEvilAst",
      "doWrapped"
    ];
    _MacroAccessNode_prototype.type = function (o) {
      var _ref, type;
      if ((_ref = this._type) == null) {
        type = o.macros.getTypeById(this.id);
        if (type != null) {
          if (typeof type === "string") {
            return this._type = this.data[type].type(o);
          } else {
            return this._type = type;
          }
        } else {
          return this._type = o.macroExpand1(this).type(o);
        }
      } else {
        return _ref;
      }
    };
    _MacroAccessNode_prototype.withLabel = function (label, o) {
      if (label == null) {
        label = null;
      }
      return o.macroExpand1(this).withLabel(label, o);
    };
    _MacroAccessNode_prototype.walk = (function () {
      function walkObject(obj, func, context) {
        var changed, k, newV, result, v;
        result = {};
        changed = false;
        for (k in obj) {
          if (__owns.call(obj, k)) {
            v = obj[k];
            newV = walkItem(v, func, context);
            if (newV !== v) {
              changed = true;
            }
            result[k] = newV;
          }
        }
        if (changed) {
          return result;
        } else {
          return obj;
        }
      }
      function walkItem(item, func, context) {
        if (item instanceof Node) {
          return func.call(context, item);
        } else if (__isArray(item)) {
          return map(item, function (x) {
            return walkItem(x, func, context);
          });
        } else if (typeof item === "object" && item !== null) {
          return walkObject(item, func, context);
        } else {
          return item;
        }
      }
      return function (func, context) {
        var data;
        data = walkItem(this.data, func, context);
        if (data !== this.data) {
          return MacroAccessNode(
            this.index,
            this.scope,
            this.id,
            this.callLine,
            data,
            this.inStatement,
            this.inGenerator,
            this.inEvilAst,
            this.doWrapped
          );
        } else {
          return this;
        }
      };
    }());
    _MacroAccessNode_prototype.walkAsync = (function () {
      function walkObject(obj, func, context, callback) {
        var _keys, changed, result;
        changed = false;
        result = {};
        _keys = __keys(obj);
        return __async(
          1,
          _keys.length,
          false,
          function (_i, next) {
            var _once, k, v;
            k = _keys[_i];
            v = obj[k];
            return walkItem(item, func, context, (_once = false, function (_e, newItem) {
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
              result[k] = newItem;
              return next(null);
            }));
          },
          function (err) {
            if (typeof err !== "undefined" && err !== null) {
              return callback(err);
            } else {
              return callback(null, changed ? result : obj);
            }
          }
        );
      }
      function walkItem(item, func, context, callback) {
        if (item instanceof Node) {
          return func(item, context, callback);
        } else if (__isArray(item)) {
          return mapAsync(
            item,
            function (x, cb) {
              return walkItem(x, func, context, cb);
            },
            null,
            callback
          );
        } else if (typeof item === "object" && item !== null) {
          return walkObject(item, func, context, callback);
        } else {
          return callback(null, item);
        }
      }
      return function (func, context, callback) {
        var _once, _this;
        _this = this;
        return walkItem(this.data, func, context, (_once = false, function (_e, data) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, data !== _this.data
            ? MacroAccessNode(
              _this.index,
              _this.scope,
              _this.id,
              _this.callLine,
              data,
              _this.inStatement,
              _this.inGenerator,
              _this.inEvilAst,
              _this.doWrapped
            )
            : _this);
        }));
      };
    }());
    _MacroAccessNode_prototype._isNoop = function (o) {
      return o.macroExpand1(this).isNoop(o);
    };
    _MacroAccessNode_prototype.doWrap = function () {
      if (this.doWrapped) {
        return this;
      } else {
        return MacroAccessNode(
          this.index,
          this.scope,
          this.id,
          this.callLine,
          this.data,
          this.inStatement,
          this.inGenerator,
          this.inEvilAst,
          true
        );
      }
    };
    _MacroAccessNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      return o.macroExpand1(this).mutateLast(o, func, context, includeNoop);
    };
    _MacroAccessNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "MacroAccessNode",
        this.index,
        this.id,
        this.callLine,
        this.data,
        this.inStatement,
        this.inGenerator,
        this.inEvilAst,
        this.doWrapped
      );
    };
    return MacroAccessNode;
  }(Node));
  Node.MacroConst = Node.byTypeId[24] = MacroConstNode = (function (Node) {
    var _MacroConstNode_prototype, _Node_prototype;
    function MacroConstNode(index, scope, name) {
      var _this;
      _this = this instanceof MacroConstNode ? this : __create(_MacroConstNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _MacroConstNode_prototype = MacroConstNode.prototype = __create(_Node_prototype);
    _MacroConstNode_prototype.constructor = MacroConstNode;
    MacroConstNode.displayName = "MacroConstNode";
    if (typeof Node.extended === "function") {
      Node.extended(MacroConstNode);
    }
    _MacroConstNode_prototype.typeId = 24;
    MacroConstNode.argNames = ["name"];
    _MacroConstNode_prototype.type = function (o) {
      var _ref, c, value;
      if ((_ref = this._type) == null) {
        c = o.getConst(this.name);
        if (!c) {
          return this._type = Type.any;
        } else {
          value = c.value;
          if (value === null) {
            return this._type = Type["null"];
          } else {
            switch (typeof value) {
            case "number": return this._type = Type.number;
            case "string": return this._type = Type.string;
            case "boolean": return this._type = Type.boolean;
            case "undefined": return this._type = Type["undefined"];
            default: throw Error("Unknown type for " + String(c.value));
            }
          }
        }
      } else {
        return _ref;
      }
    };
    _MacroConstNode_prototype._isNoop = function (o) {
      return true;
    };
    _MacroConstNode_prototype.toConst = function (o) {
      var _ref;
      return LispyNode_Value(this.index, (_ref = o.getConst(this.name)) != null ? _ref.value : void 0);
    };
    _MacroConstNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "MacroConstNode", this.index, this.name);
    };
    _MacroConstNode_prototype.walk = function (f, context) {
      return this;
    };
    _MacroConstNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return MacroConstNode;
  }(Node));
  Node.Nothing = Node.byTypeId[25] = NothingNode = (function (Node) {
    var _Node_prototype, _NothingNode_prototype;
    function NothingNode(index, scope) {
      var _this;
      _this = this instanceof NothingNode ? this : __create(_NothingNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _NothingNode_prototype = NothingNode.prototype = __create(_Node_prototype);
    _NothingNode_prototype.constructor = NothingNode;
    NothingNode.displayName = "NothingNode";
    if (typeof Node.extended === "function") {
      Node.extended(NothingNode);
    }
    _NothingNode_prototype.typeId = 25;
    NothingNode.argNames = [];
    _NothingNode_prototype.type = function () {
      return Type["undefined"];
    };
    _NothingNode_prototype.cacheable = false;
    _NothingNode_prototype.isConst = function () {
      return true;
    };
    _NothingNode_prototype.constValue = function () {};
    _NothingNode_prototype.isConstType = function (type) {
      return type === "undefined";
    };
    _NothingNode_prototype.isConstValue = function (value) {
      return value === void 0;
    };
    _NothingNode_prototype._isNoop = function () {
      return true;
    };
    _NothingNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      var _ref;
      if (includeNoop) {
        if ((_ref = func.call(context, this)) != null) {
          return _ref;
        } else {
          return this;
        }
      } else {
        return this;
      }
    };
    _NothingNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "NothingNode", this.index);
    };
    return NothingNode;
  }(Node));
  Node.Param = Node.byTypeId[27] = ParamNode = (function (Node) {
    var _Node_prototype, _ParamNode_prototype;
    function ParamNode(index, scope, ident, defaultValue, spread, isMutable, asType) {
      var _this;
      _this = this instanceof ParamNode ? this : __create(_ParamNode_prototype);
      if (typeof defaultValue === "undefined" || defaultValue === null) {
        defaultValue = void 0;
      }
      if (typeof spread === "undefined" || spread === null) {
        spread = false;
      }
      if (typeof isMutable === "undefined" || isMutable === null) {
        isMutable = false;
      }
      if (typeof asType === "undefined" || asType === null) {
        asType = void 0;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.defaultValue = defaultValue;
      _this.spread = spread;
      _this.isMutable = isMutable;
      _this.asType = asType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ParamNode_prototype = ParamNode.prototype = __create(_Node_prototype);
    _ParamNode_prototype.constructor = ParamNode;
    ParamNode.displayName = "ParamNode";
    if (typeof Node.extended === "function") {
      Node.extended(ParamNode);
    }
    _ParamNode_prototype.typeId = 27;
    ParamNode.argNames = [
      "ident",
      "defaultValue",
      "spread",
      "isMutable",
      "asType"
    ];
    _ParamNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ParamNode",
        this.index,
        this.ident,
        this.defaultValue,
        this.spread,
        this.isMutable,
        this.asType
      );
    };
    _ParamNode_prototype.walk = function (f, context) {
      var asType, defaultValue, ident;
      ident = f.call(context, this.ident);
      if (this.defaultValue instanceof Node) {
        defaultValue = f.call(context, this.defaultValue);
      } else {
        defaultValue = this.defaultValue;
      }
      if (this.asType instanceof Node) {
        asType = f.call(context, this.asType);
      } else {
        asType = this.asType;
      }
      if (ident !== this.ident || defaultValue !== this.defaultValue || asType !== this.asType) {
        return ParamNode(
          this.index,
          this.scope,
          ident,
          defaultValue,
          this.spread,
          this.isMutable,
          asType
        );
      } else {
        return this;
      }
    };
    _ParamNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.ident, (_once = false, function (_e, ident) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return (_this.defaultValue instanceof Node
          ? function (next) {
            var _once2;
            return f.call(context, _this.defaultValue, (_once2 = false, function (_e2, defaultValue) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(defaultValue);
            }));
          }
          : function (next) {
            return next(_this.defaultValue);
          })(function (defaultValue) {
          return (_this.asType instanceof Node
            ? function (next) {
              var _once2;
              return f.call(context, _this.asType, (_once2 = false, function (_e2, asType) {
                if (_once2) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                if (_e2 != null) {
                  return callback(_e2);
                }
                return next(asType);
              }));
            }
            : function (next) {
              return next(_this.asType);
            })(function (asType) {
            return callback(null, ident !== _this.ident || defaultValue !== _this.defaultValue || asType !== _this.asType
              ? ParamNode(
                _this.index,
                _this.scope,
                ident,
                defaultValue,
                _this.spread,
                _this.isMutable,
                asType
              )
              : _this);
          });
        });
      }));
    };
    return ParamNode;
  }(Node));
  Node.Root = Node.byTypeId[30] = RootNode = (function (Node) {
    var _Node_prototype, _RootNode_prototype;
    function RootNode(index, scope, file, body, isEmbedded, isGenerator) {
      var _this;
      _this = this instanceof RootNode ? this : __create(_RootNode_prototype);
      if (typeof file === "undefined" || file === null) {
        file = void 0;
      }
      if (typeof isEmbedded === "undefined" || isEmbedded === null) {
        isEmbedded = false;
      }
      if (typeof isGenerator === "undefined" || isGenerator === null) {
        isGenerator = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.file = file;
      _this.body = body;
      _this.isEmbedded = isEmbedded;
      _this.isGenerator = isGenerator;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _RootNode_prototype = RootNode.prototype = __create(_Node_prototype);
    _RootNode_prototype.constructor = RootNode;
    RootNode.displayName = "RootNode";
    if (typeof Node.extended === "function") {
      Node.extended(RootNode);
    }
    _RootNode_prototype.typeId = 30;
    RootNode.argNames = ["file", "body", "isEmbedded", "isGenerator"];
    _RootNode_prototype.isStatement = function () {
      return true;
    };
    _RootNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "RootNode",
        this.index,
        this.file,
        this.body,
        this.isEmbedded,
        this.isGenerator
      );
    };
    _RootNode_prototype.walk = function (f, context) {
      var body;
      body = f.call(context, this.body);
      if (body !== this.body) {
        return RootNode(
          this.index,
          this.scope,
          this.file,
          body,
          this.isEmbedded,
          this.isGenerator
        );
      } else {
        return this;
      }
    };
    _RootNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.body, (_once = false, function (_e, body) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, body !== _this.body
          ? RootNode(
            _this.index,
            _this.scope,
            _this.file,
            body,
            _this.isEmbedded,
            _this.isGenerator
          )
          : _this);
      }));
    };
    return RootNode;
  }(Node));
  Node.Super = Node.byTypeId[32] = SuperNode = (function (Node) {
    var _Node_prototype, _SuperNode_prototype;
    function SuperNode(index, scope, child, args) {
      var _this;
      _this = this instanceof SuperNode ? this : __create(_SuperNode_prototype);
      if (typeof child === "undefined" || child === null) {
        child = void 0;
      }
      if (typeof args === "undefined" || args === null) {
        args = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.child = child;
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SuperNode_prototype = SuperNode.prototype = __create(_Node_prototype);
    _SuperNode_prototype.constructor = SuperNode;
    SuperNode.displayName = "SuperNode";
    if (typeof Node.extended === "function") {
      Node.extended(SuperNode);
    }
    _SuperNode_prototype.typeId = 32;
    SuperNode.argNames = ["child", "args"];
    _SuperNode_prototype._reduce = function (o) {
      var args, child;
      if (this.child != null) {
        child = this.child.reduce(o).doWrap(o);
      } else {
        child = this.child;
      }
      args = map(this.args, function (node) {
        return node.reduce(o).doWrap(o);
      });
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.index, this.scope, child, args);
      } else {
        return this;
      }
    };
    _SuperNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SuperNode",
        this.index,
        this.child,
        this.args
      );
    };
    _SuperNode_prototype.walk = function (f, context) {
      var args, child;
      if (this.child instanceof Node) {
        child = f.call(context, this.child);
      } else {
        child = this.child;
      }
      args = map(this.args, f, context);
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.index, this.scope, child, args);
      } else {
        return this;
      }
    };
    _SuperNode_prototype.walkAsync = function (f, context, callback) {
      var _this;
      _this = this;
      return (this.child instanceof Node
        ? function (next) {
          var _once;
          return f.call(context, _this.child, (_once = false, function (_e, child) {
            if (_once) {
              throw Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return next(child);
          }));
        }
        : function (next) {
          return next(_this.child);
        })(function (child) {
        var _once;
        return mapAsync(_this.args, f, context, (_once = false, function (_e, args) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, child !== _this.child || args !== _this.args ? SuperNode(_this.index, _this.scope, child, args) : _this);
        }));
      });
    };
    return SuperNode;
  }(Node));
  Node.SyntaxChoice = Node.byTypeId[34] = SyntaxChoiceNode = (function (Node) {
    var _Node_prototype, _SyntaxChoiceNode_prototype;
    function SyntaxChoiceNode(index, scope, choices) {
      var _this;
      _this = this instanceof SyntaxChoiceNode ? this : __create(_SyntaxChoiceNode_prototype);
      if (choices == null) {
        choices = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.choices = choices;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxChoiceNode_prototype = SyntaxChoiceNode.prototype = __create(_Node_prototype);
    _SyntaxChoiceNode_prototype.constructor = SyntaxChoiceNode;
    SyntaxChoiceNode.displayName = "SyntaxChoiceNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxChoiceNode);
    }
    _SyntaxChoiceNode_prototype.typeId = 34;
    SyntaxChoiceNode.argNames = ["choices"];
    _SyntaxChoiceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxChoiceNode", this.index, this.choices);
    };
    _SyntaxChoiceNode_prototype.walk = function (f, context) {
      var choices;
      choices = map(this.choices, f, context);
      if (choices !== this.choices) {
        return SyntaxChoiceNode(this.index, this.scope, choices);
      } else {
        return this;
      }
    };
    _SyntaxChoiceNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.choices, f, context, (_once = false, function (_e, choices) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, choices !== _this.choices ? SyntaxChoiceNode(_this.index, _this.scope, choices) : _this);
      }));
    };
    return SyntaxChoiceNode;
  }(Node));
  Node.SyntaxMany = Node.byTypeId[35] = SyntaxManyNode = (function (Node) {
    var _Node_prototype, _SyntaxManyNode_prototype;
    function SyntaxManyNode(index, scope, inner, multiplier) {
      var _this;
      _this = this instanceof SyntaxManyNode ? this : __create(_SyntaxManyNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.inner = inner;
      _this.multiplier = multiplier;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxManyNode_prototype = SyntaxManyNode.prototype = __create(_Node_prototype);
    _SyntaxManyNode_prototype.constructor = SyntaxManyNode;
    SyntaxManyNode.displayName = "SyntaxManyNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxManyNode);
    }
    _SyntaxManyNode_prototype.typeId = 35;
    SyntaxManyNode.argNames = ["inner", "multiplier"];
    _SyntaxManyNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SyntaxManyNode",
        this.index,
        this.inner,
        this.multiplier
      );
    };
    _SyntaxManyNode_prototype.walk = function (f, context) {
      var inner;
      inner = f.call(context, this.inner);
      if (inner !== this.inner) {
        return SyntaxManyNode(this.index, this.scope, inner, this.multiplier);
      } else {
        return this;
      }
    };
    _SyntaxManyNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.inner, (_once = false, function (_e, inner) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, inner !== _this.inner ? SyntaxManyNode(_this.index, _this.scope, inner, _this.multiplier) : _this);
      }));
    };
    return SyntaxManyNode;
  }(Node));
  Node.SyntaxParam = Node.byTypeId[36] = SyntaxParamNode = (function (Node) {
    var _Node_prototype, _SyntaxParamNode_prototype;
    function SyntaxParamNode(index, scope, ident, asType) {
      var _this;
      _this = this instanceof SyntaxParamNode ? this : __create(_SyntaxParamNode_prototype);
      if (asType == null) {
        asType = void 0;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.asType = asType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxParamNode_prototype = SyntaxParamNode.prototype = __create(_Node_prototype);
    _SyntaxParamNode_prototype.constructor = SyntaxParamNode;
    SyntaxParamNode.displayName = "SyntaxParamNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxParamNode);
    }
    _SyntaxParamNode_prototype.typeId = 36;
    SyntaxParamNode.argNames = ["ident", "asType"];
    _SyntaxParamNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SyntaxParamNode",
        this.index,
        this.ident,
        this.asType
      );
    };
    _SyntaxParamNode_prototype.walk = function (f, context) {
      var asType, ident;
      ident = f.call(context, this.ident);
      if (this.asType instanceof Node) {
        asType = f.call(context, this.asType);
      } else {
        asType = this.asType;
      }
      if (ident !== this.ident || asType !== this.asType) {
        return SyntaxParamNode(this.index, this.scope, ident, asType);
      } else {
        return this;
      }
    };
    _SyntaxParamNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.ident, (_once = false, function (_e, ident) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return (_this.asType instanceof Node
          ? function (next) {
            var _once2;
            return f.call(context, _this.asType, (_once2 = false, function (_e2, asType) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(asType);
            }));
          }
          : function (next) {
            return next(_this.asType);
          })(function (asType) {
          return callback(null, ident !== _this.ident || asType !== _this.asType ? SyntaxParamNode(_this.index, _this.scope, ident, asType) : _this);
        });
      }));
    };
    return SyntaxParamNode;
  }(Node));
  Node.SyntaxSequence = Node.byTypeId[37] = SyntaxSequenceNode = (function (Node) {
    var _Node_prototype, _SyntaxSequenceNode_prototype;
    function SyntaxSequenceNode(index, scope, params) {
      var _this;
      _this = this instanceof SyntaxSequenceNode ? this : __create(_SyntaxSequenceNode_prototype);
      if (params == null) {
        params = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxSequenceNode_prototype = SyntaxSequenceNode.prototype = __create(_Node_prototype);
    _SyntaxSequenceNode_prototype.constructor = SyntaxSequenceNode;
    SyntaxSequenceNode.displayName = "SyntaxSequenceNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxSequenceNode);
    }
    _SyntaxSequenceNode_prototype.typeId = 37;
    SyntaxSequenceNode.argNames = ["params"];
    _SyntaxSequenceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxSequenceNode", this.index, this.params);
    };
    _SyntaxSequenceNode_prototype.walk = function (f, context) {
      var params;
      params = map(this.params, f, context);
      if (params !== this.params) {
        return SyntaxSequenceNode(this.index, this.scope, params);
      } else {
        return this;
      }
    };
    _SyntaxSequenceNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.params, f, context, (_once = false, function (_e, params) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, params !== _this.params ? SyntaxSequenceNode(_this.index, _this.scope, params) : _this);
      }));
    };
    return SyntaxSequenceNode;
  }(Node));
  Node.Tmp = Node.byTypeId[40] = TmpNode = (function (Node) {
    var _Node_prototype, _TmpNode_prototype;
    function TmpNode(index, scope, id, name, _type) {
      var _this;
      _this = this instanceof TmpNode ? this : __create(_TmpNode_prototype);
      if (_type == null) {
        _type = Type.any;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.name = name;
      _this._type = _type;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TmpNode_prototype = TmpNode.prototype = __create(_Node_prototype);
    _TmpNode_prototype.constructor = TmpNode;
    TmpNode.displayName = "TmpNode";
    if (typeof Node.extended === "function") {
      Node.extended(TmpNode);
    }
    _TmpNode_prototype.typeId = 40;
    TmpNode.argNames = ["id", "name", "_type"];
    _TmpNode_prototype.cacheable = false;
    _TmpNode_prototype.type = function () {
      return this._type;
    };
    _TmpNode_prototype._isNoop = function () {
      return true;
    };
    _TmpNode_prototype._toJSON = function () {
      if (this._type === Type.any || true) {
        return [this.id, this.name];
      } else {
        return [this.id, this.name, this._type];
      }
    };
    _TmpNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TmpNode",
        this.index,
        this.id,
        this.name,
        this._type
      );
    };
    _TmpNode_prototype.walk = function (f, context) {
      return this;
    };
    _TmpNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return TmpNode;
  }(Node));
  Node.TypeFunction = Node.byTypeId[44] = TypeFunctionNode = (function (Node) {
    var _Node_prototype, _TypeFunctionNode_prototype;
    function TypeFunctionNode(index, scope, returnType) {
      var _this;
      _this = this instanceof TypeFunctionNode ? this : __create(_TypeFunctionNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.returnType = returnType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeFunctionNode_prototype = TypeFunctionNode.prototype = __create(_Node_prototype);
    _TypeFunctionNode_prototype.constructor = TypeFunctionNode;
    TypeFunctionNode.displayName = "TypeFunctionNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeFunctionNode);
    }
    _TypeFunctionNode_prototype.typeId = 44;
    TypeFunctionNode.argNames = ["returnType"];
    _TypeFunctionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeFunctionNode", this.index, this.returnType);
    };
    _TypeFunctionNode_prototype.walk = function (f, context) {
      var returnType;
      returnType = f.call(context, this.returnType);
      if (returnType !== this.returnType) {
        return TypeFunctionNode(this.index, this.scope, returnType);
      } else {
        return this;
      }
    };
    _TypeFunctionNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.returnType, (_once = false, function (_e, returnType) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, returnType !== _this.returnType ? TypeFunctionNode(_this.index, _this.scope, returnType) : _this);
      }));
    };
    return TypeFunctionNode;
  }(Node));
  Node.TypeGeneric = Node.byTypeId[45] = TypeGenericNode = (function (Node) {
    var _Node_prototype, _TypeGenericNode_prototype;
    function TypeGenericNode(index, scope, basetype, args) {
      var _this;
      _this = this instanceof TypeGenericNode ? this : __create(_TypeGenericNode_prototype);
      if (args == null) {
        args = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.basetype = basetype;
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeGenericNode_prototype = TypeGenericNode.prototype = __create(_Node_prototype);
    _TypeGenericNode_prototype.constructor = TypeGenericNode;
    TypeGenericNode.displayName = "TypeGenericNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeGenericNode);
    }
    _TypeGenericNode_prototype.typeId = 45;
    TypeGenericNode.argNames = ["basetype", "args"];
    _TypeGenericNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TypeGenericNode",
        this.index,
        this.basetype,
        this.args
      );
    };
    _TypeGenericNode_prototype.walk = function (f, context) {
      var args, basetype;
      basetype = f.call(context, this.basetype);
      args = map(this.args, f, context);
      if (basetype !== this.basetype || args !== this.args) {
        return TypeGenericNode(this.index, this.scope, basetype, args);
      } else {
        return this;
      }
    };
    _TypeGenericNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.basetype, (_once = false, function (_e, basetype) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.args, f, context, (_once2 = false, function (_e2, args) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, basetype !== _this.basetype || args !== _this.args ? TypeGenericNode(_this.index, _this.scope, basetype, args) : _this);
        }));
      }));
    };
    return TypeGenericNode;
  }(Node));
  Node.TypeObject = Node.byTypeId[46] = TypeObjectNode = (function (Node) {
    var _Node_prototype, _TypeObjectNode_prototype;
    function TypeObjectNode(index, scope, pairs) {
      var _this;
      _this = this instanceof TypeObjectNode ? this : __create(_TypeObjectNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.pairs = pairs;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeObjectNode_prototype = TypeObjectNode.prototype = __create(_Node_prototype);
    _TypeObjectNode_prototype.constructor = TypeObjectNode;
    TypeObjectNode.displayName = "TypeObjectNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeObjectNode);
    }
    _TypeObjectNode_prototype.typeId = 46;
    TypeObjectNode.argNames = ["pairs"];
    _TypeObjectNode_prototype._reduce = function (o) {
      var pairs;
      pairs = map(this.pairs, function (pair) {
        var key, value;
        key = pair.key.reduce(o);
        value = pair.value.reduce(o);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value };
        } else {
          return pair;
        }
      });
      if (pairs !== this.pairs) {
        return TypeObjectNode(this.index, this.scope, pairs);
      } else {
        return this;
      }
    };
    _TypeObjectNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeObjectNode", this.index, this.pairs);
    };
    _TypeObjectNode_prototype.walk = function (f, context) {
      return this;
    };
    _TypeObjectNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return TypeObjectNode;
  }(Node));
  Node.TypeUnion = Node.byTypeId[47] = TypeUnionNode = (function (Node) {
    var _Node_prototype, _TypeUnionNode_prototype;
    function TypeUnionNode(index, scope, types) {
      var _this;
      _this = this instanceof TypeUnionNode ? this : __create(_TypeUnionNode_prototype);
      if (types == null) {
        types = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.types = types;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeUnionNode_prototype = TypeUnionNode.prototype = __create(_Node_prototype);
    _TypeUnionNode_prototype.constructor = TypeUnionNode;
    TypeUnionNode.displayName = "TypeUnionNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeUnionNode);
    }
    _TypeUnionNode_prototype.typeId = 47;
    TypeUnionNode.argNames = ["types"];
    _TypeUnionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeUnionNode", this.index, this.types);
    };
    _TypeUnionNode_prototype.walk = function (f, context) {
      var types;
      types = map(this.types, f, context);
      if (types !== this.types) {
        return TypeUnionNode(this.index, this.scope, types);
      } else {
        return this;
      }
    };
    _TypeUnionNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.types, f, context, (_once = false, function (_e, types) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, types !== _this.types ? TypeUnionNode(_this.index, _this.scope, types) : _this);
      }));
    };
    return TypeUnionNode;
  }(Node));
  module.exports = Node;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
