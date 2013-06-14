(function () {
  "use strict";
  var __async, __create, __is, __isArray, __once, __owns, __slice, __toArray,
      __typeof, Call, Node, OldNode, Symbol, toJSSource, Type, Value;
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
  __is = typeof Object.is === "function" ? Object.is
    : function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
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
  toJSSource = require("./jsutils").toJSSource;
  Type = require("./types");
  OldNode = require("./parser-nodes");
  function capitalize(value) {
    return "" + value.charAt(0).toUpperCase() + value.substring(1);
  }
  Node = (function (OldNode) {
    var _Node_prototype, _OldNode_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw Error("Node is not intended to be initialized directly");
    }
    _OldNode_prototype = OldNode.prototype;
    _Node_prototype = Node.prototype = __create(_OldNode_prototype);
    _Node_prototype.constructor = Node;
    Node.displayName = "Node";
    if (typeof OldNode.extended === "function") {
      OldNode.extended(Node);
    }
    _Node_prototype.isValue = false;
    _Node_prototype.isSymbol = false;
    _Node_prototype.isCall = false;
    _Node_prototype.isConst = function () {
      return false;
    };
    _Node_prototype.isConstValue = function () {
      return false;
    };
    _Node_prototype.isConstType = function () {
      return false;
    };
    _Node_prototype.isLiteral = function () {
      return this.isConst();
    };
    _Node_prototype.literalValue = function () {
      return this.constValue();
    };
    _Node_prototype.isStatement = function () {
      return false;
    };
    _Node_prototype.doWrap = function () {
      return this;
    };
    _Node_prototype.type = function () {
      return Type.any;
    };
    _Node_prototype.walk = function () {
      return this;
    };
    _Node_prototype.walkAsync = function (f, context, callback) {
      callback(null, this);
    };
    return Node;
  }(OldNode));
  Value = (function (Node) {
    var _Node_prototype, _Value_prototype;
    function Value(index, value) {
      var _this;
      _this = this instanceof Value ? this : __create(_Value_prototype);
      _this.index = index;
      _this.value = value;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _Value_prototype = Value.prototype = __create(_Node_prototype);
    _Value_prototype.constructor = Value;
    Value.displayName = "Value";
    if (typeof Node.extended === "function") {
      Node.extended(Value);
    }
    _Value_prototype.isValue = true;
    _Value_prototype.nodeType = "value";
    _Value_prototype.cacheable = false;
    _Value_prototype.reduce = function () {
      return this;
    };
    _Value_prototype.constValue = function () {
      return this.value;
    };
    _Value_prototype.isConst = function () {
      return true;
    };
    _Value_prototype.isConstValue = function (value) {
      return value === this.value;
    };
    _Value_prototype.isConstType = function (type) {
      return type === typeof this.value;
    };
    _Value_prototype.equals = function (other) {
      return other instanceof Value && __is(this.value, other.value);
    };
    _Value_prototype.type = function () {
      var value;
      value = this.value;
      if (value === null) {
        return Type["null"];
      } else {
        switch (typeof value) {
        case "number": return Type.number;
        case "string": return Type.string;
        case "boolean": return Type.boolean;
        case "undefined": return Type["undefined"];
        default: throw Error("Unhandled value in switch");
        }
      }
    };
    _Value_prototype.inspect = function () {
      return "Value(" + toJSSource(this.value) + ")";
    };
    return Value;
  }(Node));
  Symbol = (function (Node) {
    var _Node_prototype, _Symbol_prototype, Ident, Internal, Operator, Tmp;
    function Symbol() {
      var _this;
      _this = this instanceof Symbol ? this : __create(_Symbol_prototype);
      throw Error("Symbol is not intended to be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    _Symbol_prototype = Symbol.prototype = __create(_Node_prototype);
    _Symbol_prototype.constructor = Symbol;
    Symbol.displayName = "Symbol";
    if (typeof Node.extended === "function") {
      Node.extended(Symbol);
    }
    _Symbol_prototype.isSymbol = true;
    _Symbol_prototype.nodeType = "symbol";
    _Symbol_prototype.isIdent = false;
    _Symbol_prototype.isTmp = false;
    _Symbol_prototype.isIdentOrTmp = false;
    _Symbol_prototype.isInternal = false;
    _Symbol_prototype.isOperator = false;
    _Symbol_prototype.reduce = function () {
      return this;
    };
    _Symbol_prototype.cacheable = false;
    Internal = (function (Symbol) {
      var _Internal_prototype, _Symbol_prototype2, internalSymbols, name;
      function Internal() {
        var _this;
        _this = this instanceof Internal ? this : __create(_Internal_prototype);
        throw Error("Internal is not intended to be instantiated directly");
      }
      _Symbol_prototype2 = Symbol.prototype;
      _Internal_prototype = Internal.prototype = __create(_Symbol_prototype2);
      _Internal_prototype.constructor = Internal;
      Internal.displayName = "Internal";
      if (typeof Symbol.extended === "function") {
        Symbol.extended(Internal);
      }
      _Internal_prototype.inspect = function () {
        return "Symbol." + this.name;
      };
      _Internal_prototype.isInternal = true;
      _Internal_prototype.isGoto = false;
      _Internal_prototype.usedAsStatement = false;
      internalSymbols = {
        access: {},
        accessMulti: {},
        apply: {},
        array: {},
        block: {},
        "break": { isGoto: true, usedAsStatement: true },
        cascade: {},
        comment: {},
        "continue": { isGoto: true, usedAsStatement: true },
        "debugger": { usedAsStatement: true },
        def: {},
        "for": {
          usedAsStatement: true,
          _withLabel: function (call, label) {
            return Call(
              call.index,
              call.scope,
              call.func,
              call.args[0],
              call.args[1],
              call.args[2],
              call.args[3],
              label
            );
          }
        },
        forIn: {
          usedAsStatement: true,
          _withLabel: function (call, label) {
            return Call(
              call.index,
              call.scope,
              call.func,
              call.args[0],
              call.args[1],
              call.args[2],
              label
            );
          }
        },
        "function": {},
        "if": {},
        label: { usedAsStatement: true },
        macroConst: {},
        "new": {},
        noop: {
          constValue: function () {},
          isConstType: function (_x) {
            return "undefined" === _x;
          },
          isConst: function () {
            return true;
          },
          isConstValue: function (_x) {
            return void 0 === _x;
          }
        },
        object: {},
        param: {},
        "return": { isGoto: true, usedAsStatement: true },
        root: { usedAsStatement: true },
        spread: {},
        "super": {},
        "throw": {
          isGoto: true,
          usedAsStatement: true,
          _doWrap: function (call, parser) {
            return OldNode.Call(
              call.index,
              call.scope,
              OldNode.Ident(call.index, call.scope, "__throw"),
              [call.args[0]]
            );
          }
        },
        tmpWrapper: {},
        tryCatch: {
          usedAsStatement: true,
          _withLabel: function (call, label) {
            return Call(
              call.index,
              call.scope,
              call.func,
              call.args[0],
              call.args[1],
              call.args[2],
              label
            );
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var catchBody, tryBody;
            tryBody = call.args[0].mutateLast(parser, mutator, context, includeNoop);
            catchBody = call.args[2].mutateLast(parser, mutator, context, includeNoop);
            if (tryBody !== call.args[0] || catchBody !== call.args[2]) {
              return Call.apply(void 0, [
                call.index,
                call.scope,
                call.func,
                tryBody,
                call.args[1],
                catchBody
              ].concat(__toArray(__slice.call(call.args, 3))));
            } else {
              return call;
            }
          }
        },
        tryFinally: {
          usedAsStatement: true,
          _withLabel: function (call, label) {
            return Call(
              call.index,
              call.scope,
              call.func,
              call.args[0],
              call.args[1],
              label
            );
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var tryBody;
            tryBody = call.args[0].mutateLast(parser, mutator, context, includeNoop);
            if (tryBody !== call.args[0]) {
              return Call.apply(void 0, [call.index, call.scope, call.func, tryBody].concat(__toArray(__slice.call(call.args, 1))));
            } else {
              return call;
            }
          }
        },
        write: {},
        "var": {},
        "yield": {}
      };
      function _f(name, data) {
        var isNameKey, Symbol_name;
        isNameKey = "is" + capitalize(name);
        _Internal_prototype[isNameKey] = false;
        return Symbol[name] = Symbol_name = (function (Internal) {
          var _Internal_prototype2, _Symbol_name_prototype, k, v;
          function Symbol_name(index) {
            var _this;
            _this = this instanceof Symbol_name ? this : __create(_Symbol_name_prototype);
            _this.index = index;
            _this.name = name;
            return _this;
          }
          _Internal_prototype2 = Internal.prototype;
          _Symbol_name_prototype = Symbol_name.prototype = __create(_Internal_prototype2);
          _Symbol_name_prototype.constructor = Symbol_name;
          Symbol_name.displayName = "Symbol_name";
          if (typeof Internal.extended === "function") {
            Internal.extended(Symbol_name);
          }
          _Symbol_name_prototype.displayName = "Symbol." + name;
          _Symbol_name_prototype.equals = function (other) {
            return other instanceof Symbol_name;
          };
          _Symbol_name_prototype[isNameKey] = true;
          for (k in data) {
            if (__owns.call(data, k)) {
              v = data[k];
              _Symbol_name_prototype[k] = v;
            }
          }
          return Symbol_name;
        }(Internal));
      }
      for (name in internalSymbols) {
        if (__owns.call(internalSymbols, name)) {
          _f.call(Internal, name, internalSymbols[name]);
        }
      }
      return Internal;
    }(Symbol));
    Ident = (function (Symbol) {
      var _Ident_prototype, _Symbol_prototype2;
      function Ident(index, scope, name) {
        var _this;
        _this = this instanceof Ident ? this : __create(_Ident_prototype);
        _this.index = index;
        _this.scope = scope;
        _this.name = name;
        return _this;
      }
      _Symbol_prototype2 = Symbol.prototype;
      _Ident_prototype = Ident.prototype = __create(_Symbol_prototype2);
      _Ident_prototype.constructor = Ident;
      Ident.displayName = "Ident";
      if (typeof Symbol.extended === "function") {
        Symbol.extended(Ident);
      }
      _Ident_prototype.isIdent = true;
      _Ident_prototype.isIdentOrTmp = true;
      _Ident_prototype.inspect = function () {
        return "Symbol.ident(" + toJSSource(this.name) + ")";
      };
      _Ident_prototype.equals = function (other) {
        return other instanceof Ident && this.scope === other.scope && this.name === other.name;
      };
      Symbol.ident = Ident;
      return Ident;
    }(Symbol));
    Tmp = (function (Symbol) {
      var _Symbol_prototype2, _Tmp_prototype;
      function Tmp(index, scope, id, name) {
        var _this;
        _this = this instanceof Tmp ? this : __create(_Tmp_prototype);
        _this.index = index;
        _this.scope = scope;
        _this.id = id;
        _this.name = name;
        return _this;
      }
      _Symbol_prototype2 = Symbol.prototype;
      _Tmp_prototype = Tmp.prototype = __create(_Symbol_prototype2);
      _Tmp_prototype.constructor = Tmp;
      Tmp.displayName = "Tmp";
      if (typeof Symbol.extended === "function") {
        Symbol.extended(Tmp);
      }
      _Tmp_prototype.isTmp = true;
      _Tmp_prototype.isIdentOrTmp = true;
      _Tmp_prototype.inspect = function () {
        return "Symbol.tmp(" + this.id + ", " + toJSSource(this.name) + ")";
      };
      _Tmp_prototype.equals = function (other) {
        return other instanceof Tmp && this.scope === other.scope && this.id === other.id;
      };
      Symbol.tmp = Tmp;
      return Tmp;
    }(Symbol));
    Operator = (function (Symbol) {
      var _f, _i, _len, _Operator_prototype, _Symbol_prototype2, AssignOperator,
          assignOperators, BinaryOperator, binaryOperators, UnaryOperator,
          unaryOperators;
      function Operator() {
        var _this;
        _this = this instanceof Operator ? this : __create(_Operator_prototype);
        throw Error("Operator is not meant to be instantiated directly");
      }
      _Symbol_prototype2 = Symbol.prototype;
      _Operator_prototype = Operator.prototype = __create(_Symbol_prototype2);
      _Operator_prototype.constructor = Operator;
      Operator.displayName = "Operator";
      if (typeof Symbol.extended === "function") {
        Symbol.extended(Operator);
      }
      _Operator_prototype.isOperator = true;
      _Operator_prototype.isBinary = false;
      _Operator_prototype.isUnary = false;
      _Operator_prototype.isAssign = false;
      BinaryOperator = (function (Operator) {
        var _BinaryOperator_prototype, _Operator_prototype2;
        function BinaryOperator(index, name) {
          var _this;
          _this = this instanceof BinaryOperator ? this : __create(_BinaryOperator_prototype);
          _this.index = index;
          _this.name = name;
          return _this;
        }
        _Operator_prototype2 = Operator.prototype;
        _BinaryOperator_prototype = BinaryOperator.prototype = __create(_Operator_prototype2);
        _BinaryOperator_prototype.constructor = BinaryOperator;
        BinaryOperator.displayName = "BinaryOperator";
        if (typeof Operator.extended === "function") {
          Operator.extended(BinaryOperator);
        }
        _BinaryOperator_prototype.isBinary = true;
        _BinaryOperator_prototype.operatorType = "binary";
        _BinaryOperator_prototype.inspect = function () {
          return "Symbol.binary[" + toJSSource(this.name) + "]";
        };
        _BinaryOperator_prototype.equals = function (other) {
          return other instanceof BinaryOperator && this.name === other.name;
        };
        return BinaryOperator;
      }(Operator));
      UnaryOperator = (function (Operator) {
        var _Operator_prototype2, _UnaryOperator_prototype;
        function UnaryOperator(index, name) {
          var _this;
          _this = this instanceof UnaryOperator ? this : __create(_UnaryOperator_prototype);
          _this.index = index;
          _this.name = name;
          return _this;
        }
        _Operator_prototype2 = Operator.prototype;
        _UnaryOperator_prototype = UnaryOperator.prototype = __create(_Operator_prototype2);
        _UnaryOperator_prototype.constructor = UnaryOperator;
        UnaryOperator.displayName = "UnaryOperator";
        if (typeof Operator.extended === "function") {
          Operator.extended(UnaryOperator);
        }
        _UnaryOperator_prototype.isUnary = true;
        _UnaryOperator_prototype.operatorType = "unary";
        _UnaryOperator_prototype.inspect = function () {
          return "Symbol.unary[" + toJSSource(this.name) + "]";
        };
        _UnaryOperator_prototype.equals = function (other) {
          return other instanceof UnaryOperator && this.name === other.name;
        };
        return UnaryOperator;
      }(Operator));
      AssignOperator = (function (Operator) {
        var _AssignOperator_prototype, _Operator_prototype2;
        function AssignOperator(index, name) {
          var _this;
          _this = this instanceof AssignOperator ? this : __create(_AssignOperator_prototype);
          _this.index = index;
          _this.name = name;
          return _this;
        }
        _Operator_prototype2 = Operator.prototype;
        _AssignOperator_prototype = AssignOperator.prototype = __create(_Operator_prototype2);
        _AssignOperator_prototype.constructor = AssignOperator;
        AssignOperator.displayName = "AssignOperator";
        if (typeof Operator.extended === "function") {
          Operator.extended(AssignOperator);
        }
        _AssignOperator_prototype.isAssign = true;
        _AssignOperator_prototype.operatorType = "assign";
        _AssignOperator_prototype.inspect = function () {
          return "Symbol.assign[" + toJSSource(this.name) + "]";
        };
        _AssignOperator_prototype.equals = function (other) {
          return other instanceof AssignOperator && this.name === other.name;
        };
        return AssignOperator;
      }(Operator));
      binaryOperators = [
        "*",
        "/",
        "%",
        "+",
        "-",
        "<<",
        ">>",
        ">>>",
        "<",
        "<=",
        ">",
        ">=",
        "in",
        "instanceof",
        "==",
        "!=",
        "===",
        "!==",
        "&",
        "^",
        "|",
        "&&",
        "||"
      ];
      Symbol.binary = {};
      for (_i = 0, _len = binaryOperators.length, _f = function (name) {
        return Symbol.binary[name] = function (index) {
          return BinaryOperator(index, name);
        };
      }; _i < _len; ++_i) {
        _f.call(Operator, binaryOperators[_i]);
      }
      unaryOperators = [
        "-",
        "+",
        "--",
        "++",
        "--post",
        "++post",
        "!",
        "~",
        "typeof",
        "delete"
      ];
      Symbol.unary = {};
      for (_i = 0, _len = unaryOperators.length, _f = function (name) {
        return Symbol.unary[name] = function (index) {
          return UnaryOperator(index, name);
        };
      }; _i < _len; ++_i) {
        _f.call(Operator, unaryOperators[_i]);
      }
      assignOperators = [
        "=",
        "+=",
        "-=",
        "*=",
        "/=",
        "%=",
        "<<=",
        ">>=",
        ">>>=",
        "&=",
        "^=",
        "|="
      ];
      Symbol.assign = {};
      for (_i = 0, _len = assignOperators.length, _f = function (name) {
        return Symbol.assign[name] = function (index) {
          return AssignOperator(index, name);
        };
      }; _i < _len; ++_i) {
        _f.call(Operator, assignOperators[_i]);
      }
      return Operator;
    }(Symbol));
    return Symbol;
  }(Node));
  Call = (function (Node) {
    var _Call_prototype, _Node_prototype;
    function Call(index, scope, func) {
      var _this, args;
      _this = this instanceof Call ? this : __create(_Call_prototype);
      _this.index = index;
      _this.scope = scope;
      _this.func = func;
      args = __slice.call(arguments, 3);
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _Call_prototype = Call.prototype = __create(_Node_prototype);
    _Call_prototype.constructor = Call;
    Call.displayName = "Call";
    if (typeof Node.extended === "function") {
      Node.extended(Call);
    }
    _Call_prototype.isCall = true;
    _Call_prototype.nodeType = "call";
    _Call_prototype.inspect = function (depth) {
      var _arr, _i, _len, arg, depth1, sb;
      if (depth != null) {
        depth1 = depth - 1;
      } else {
        depth1 = null;
      }
      sb = [];
      sb.push("Call(");
      sb.push("\n  ");
      sb.push(this.func.inspect(depth1).split("\n").join("\n  "));
      for (_arr = __toArray(this.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        arg = _arr[_i];
        sb.push(",\n  ");
        sb.push(arg.inspect(depth1).split("\n").join("\n  "));
      }
      sb.push(")");
      return sb.join("");
    };
    _Call_prototype.equals = function (other) {
      var _arr, _len, arg, args, i, len, otherArgs;
      if (!(other instanceof Call) || !this.func.equals(other.func)) {
        return false;
      } else {
        args = this.args;
        otherArgs = other.args;
        len = args.length;
        if (len !== otherArgs.length) {
          return false;
        } else {
          for (_arr = __toArray(args), i = 0, _len = _arr.length; i < _len; ++i) {
            arg = _arr[i];
            if (!arg.equals(otherArgs[i])) {
              return false;
            }
          }
          return true;
        }
      }
    };
    _Call_prototype._reduce = function (o) {
      return this.walk(
        function (x) {
          return x.reduce(this);
        },
        o
      );
    };
    _Call_prototype.walk = function (walker, context) {
      var _arr, _i, _len, arg, args, changedArgs, func, newArg;
      func = walker.call(context, this.func) || this.func.walk(walker, context);
      args = [];
      changedArgs = false;
      for (_arr = __toArray(this.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        arg = _arr[_i];
        newArg = walker.call(context, arg) || arg.walk(walker, context);
        if (!changedArgs) {
          changedArgs = newArg !== arg;
        }
        args.push(newArg);
      }
      if (func !== this.func || changedArgs) {
        return Call.apply(void 0, [this.index, this.scope, func].concat(__toArray(args)));
      } else {
        return this;
      }
    };
    _Call_prototype.walkAsync = function (walker, context, callback) {
      var _once, _this;
      _this = this;
      walker.call(context, this.func, (_once = false, function (_e, func) {
        var _arr, changedArgs;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        changedArgs = false;
        _arr = _this.args;
        return __async(
          1,
          +_arr.length,
          true,
          function (_i, next) {
            var _once2, arg;
            arg = _arr[_i];
            return walker.call(context, arg, (_once2 = false, function (_e2, newArg) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (_e2 != null) {
                return next(_e2);
              }
              if (!changedArgs) {
                changedArgs = newArg !== arg;
              }
              return next(null, newArg);
            }));
          },
          function (err, args) {
            if (err) {
              return callback(err);
            } else if (func !== _this.func || changedArgs) {
              return callback(null, Call.apply(void 0, [_this.index, _this.scope, func].concat(__toArray(args))));
            } else {
              return callback(null, _this);
            }
          }
        );
      }));
    };
    _Call_prototype.isStatement = function () {
      return this.func.isInternal && this.func.usedAsStatement;
    };
    _Call_prototype.mutateLast = function (o, func, context, includeNoop) {
      if (typeof this.func._mutateLast === "function") {
        return this.func._mutateLast(
          this,
          o,
          func,
          context,
          includeNoop
        );
      } else if (this.isStatement()) {
        return this;
      } else {
        return _Node_prototype.mutateLast.call(
          this,
          o,
          func,
          context,
          includeNoop
        );
      }
    };
    _Call_prototype.doWrap = function (parser) {
      var innerScope, result;
      if (typeof this.func._doWrap === "function") {
        return this.func._doWrap(this, parser);
      } else if (this.isStatement()) {
        innerScope = parser.pushScope(true, this.scope);
        result = OldNode.Call(
          this.index,
          this.scope,
          OldNode.Function(
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
    _Call_prototype.withLabel = function (label) {
      if (typeof this.func._withLabel === "function") {
        return this.func._withLabel(this, label);
      } else {
        return _Node_prototype.withLabel.call(this, label);
      }
    };
    return Call;
  }(Node));
  Node.Value = Value;
  Node.Symbol = Symbol;
  Node.Call = Call;
  Node.InternalCall = function (internalName, index, scope) {
    var args;
    args = __slice.call(arguments, 3);
    return Call.apply(void 0, [index, scope, Symbol[internalName](index)].concat(__toArray(args)));
  };
  Node.Access = function (index, scope, parent) {
    var _i, _len, child, children, current;
    children = __slice.call(arguments, 3);
    current = parent;
    for (_i = 0, _len = children.length; _i < _len; ++_i) {
      child = children[_i];
      current = Call(
        index,
        scope,
        Symbol.access,
        current,
        child
      );
    }
    return current;
  };
  module.exports = Node;
}.call(this));
