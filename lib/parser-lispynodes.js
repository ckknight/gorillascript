(function () {
  "use strict";
  var __create, __name, __slice, __typeof, Call, Node, OldNode, Symbol,
      toJSSource, Type, Value;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __name = function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
  __slice = Array.prototype.slice;
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
    _Node_prototype.reduce = function () {
      return this;
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
      return callback(null, this);
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
    _Value_prototype.cacheable = false;
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
    _Symbol_prototype.isIdent = false;
    _Symbol_prototype.isTmp = false;
    _Symbol_prototype.isIdentOrTmp = false;
    _Symbol_prototype.isInternal = false;
    _Symbol_prototype.isOperator = false;
    _Symbol_prototype.cacheable = false;
    Internal = (function (Symbol) {
      var _f, _i, _Internal_prototype, _len, _ref, _Symbol_prototype2,
          internalSymbolNames;
      function Internal(index, name) {
        var _this;
        _this = this instanceof Internal ? this : __create(_Internal_prototype);
        _this.index = index;
        _this.name = name;
        _this["is" + capitalize(name)] = true;
        return _this;
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
      internalSymbolNames = [
        "access",
        "accessMulti",
        "apply",
        "array",
        "block",
        "break",
        "cascade",
        "comment",
        "continue",
        "debugger",
        "def",
        "for",
        "forIn",
        "function",
        "if",
        "label",
        "macroConst",
        "new",
        "noop",
        "object",
        "param",
        "return",
        "root",
        "spread",
        "super",
        "throw",
        "tmpWrapper",
        "tryCatch",
        "tryFinally",
        "write",
        "var",
        "yield"
      ];
      for (_i = 0, _len = internalSymbolNames.length, _f = function (name) {
        _Internal_prototype["is" + capitalize(name)] = false;
        return Symbol[name] = function (index) {
          return Internal(index, name);
        };
      }; _i < _len; ++_i) {
        _f.call(Internal, internalSymbolNames[_i]);
      }
      _ref = Symbol.noop;
      _ref.constValue = function () {
        return;
      };
      _ref.isConstType = function (_x) {
        return "undefined" === _x;
      };
      _ref.isConst = function () {
        return true;
      };
      _ref.isConstValue = function (_x) {
        return void 0 === _x;
      };
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
      Symbol.ident = function (index, scope, name) {
        return Ident(index, scope, name);
      };
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
      Symbol.tmp = function (index, scope, id, name) {
        return Tmp(index, scope, id, name);
      };
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
    _Call_prototype.walk = function () {
      throw Error("Not implemented: " + __name(this.constructor) + ".walk()");
    };
    _Call_prototype.walkAsync = function () {
      throw Error("Not implemented: " + __name(this.constructor) + ".walkAsync()");
    };
    return Call;
  }(Node));
  Node.Value = Value;
  Node.Symbol = Symbol;
  Node.Call = Call;
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
