(function () {
  "use strict";
  var __create, __isArray, __name, __num, __owns, __slice, __strnum, __toArray, __typeof, _ref, AccessMultiNode, AccessNode, addParamToScope, ArgsNode, ArrayNode, AssignNode, BinaryNode, BlockNode, BreakNode, CallNode, CommentNode, ConstNode, ContinueNode, DebuggerNode, DefNode, EmbedWriteNode, EvalNode, ForInNode, ForNode, FunctionNode, IdentNode, IfNode, MacroAccessNode, MacroHelper, map, Node, nodeToType, NothingNode, ObjectNode, ParamNode, RegexpNode, ReturnNode, RootNode, Scope, SpreadNode, SuperNode, SwitchNode, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, ThisNode, ThrowNode, TmpNode, TmpWrapperNode, TryCatchNode, TryFinallyNode, Type, TypeFunctionNode, TypeGenericNode, TypeObjectNode, TypeUnionNode, UnaryNode, VarNode, YieldNode;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
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
  Node = require("./parser-nodes");
  Type = require("./types");
  Scope = require("./parser-scope");
  nodeToType = (_ref = require("./parser-utils")).nodeToType;
  addParamToScope = _ref.addParamToScope;
  map = _ref.map;
  AccessNode = Node.Access;
  AccessMultiNode = Node.AccessMulti;
  ArgsNode = Node.Args;
  ArrayNode = Node.Array;
  AssignNode = Node.Assign;
  BinaryNode = Node.Binary;
  BlockNode = Node.Block;
  BreakNode = Node.Break;
  CallNode = Node.Call;
  CommentNode = Node.Comment;
  ConstNode = Node.Const;
  ContinueNode = Node.Continue;
  DebuggerNode = Node.Debugger;
  DefNode = Node.Def;
  EmbedWriteNode = Node.EmbedWrite;
  EvalNode = Node.Eval;
  ForNode = Node.For;
  ForInNode = Node.ForIn;
  FunctionNode = Node.Function;
  IdentNode = Node.Ident;
  IfNode = Node.If;
  MacroAccessNode = Node.MacroAccess;
  NothingNode = Node.Nothing;
  ObjectNode = Node.Object;
  ParamNode = Node.Param;
  RegexpNode = Node.Regexp;
  ReturnNode = Node.Return;
  RootNode = Node.Root;
  SpreadNode = Node.Spread;
  SuperNode = Node.Super;
  SwitchNode = Node.Switch;
  SyntaxChoiceNode = Node.SyntaxChoice;
  SyntaxManyNode = Node.SyntaxMany;
  SyntaxParamNode = Node.SyntaxParam;
  SyntaxSequenceNode = Node.SyntaxSequence;
  ThisNode = Node.This;
  ThrowNode = Node.Throw;
  TmpNode = Node.Tmp;
  TmpWrapperNode = Node.TmpWrapper;
  TryCatchNode = Node.TryCatch;
  TryFinallyNode = Node.TryFinally;
  TypeFunctionNode = Node.TypeFunction;
  TypeGenericNode = Node.TypeGeneric;
  TypeObjectNode = Node.TypeObject;
  TypeUnionNode = Node.TypeUnion;
  UnaryNode = Node.Unary;
  VarNode = Node.Var;
  YieldNode = Node.Yield;
  function identity(x) {
    return x;
  }
  function retThis() {
    return this;
  }
  MacroHelper = (function () {
    var _MacroHelper_prototype, mutators;
    function MacroHelper(parser, index, position, inGenerator, inEvilAst) {
      var _this;
      _this = this instanceof MacroHelper ? this : __create(_MacroHelper_prototype);
      _this.parser = parser;
      _this.index = index;
      _this.position = position;
      _this.inGenerator = inGenerator;
      _this.inEvilAst = inEvilAst;
      _this.unsavedTmps = [];
      _this.savedTmps = [];
      return _this;
    }
    _MacroHelper_prototype = MacroHelper.prototype;
    MacroHelper.displayName = "MacroHelper";
    _MacroHelper_prototype.doWrap = function (node) {
      if (node instanceof Node) {
        return node.doWrap(this.parser);
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.error = function (message, node) {
      if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
      }
      if (node == null) {
        node = null;
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be one of " + (__name(Node) + " or null") + ", got " + __typeof(node));
      }
      throw this.parser.buildError(message, node || this.index);
    };
    _MacroHelper_prototype.scope = function () {
      return this.parser.scope.peek();
    };
    _MacroHelper_prototype["let"] = function (ident, isMutable, type) {
      if (!(ident instanceof TmpNode) && !(ident instanceof IdentNode)) {
        throw TypeError("Expected ident to be one of " + (__name(TmpNode) + " or " + __name(IdentNode)) + ", got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
      }
      if (ident instanceof IdentNode && isMutable && type.isSubsetOf(Type.undefinedOrNull)) {
        type = Type.any;
      }
      return this.scope().add(ident, isMutable, type);
    };
    _MacroHelper_prototype.hasVariable = function (ident) {
      if (!(ident instanceof TmpNode) && !(ident instanceof IdentNode)) {
        throw TypeError("Expected ident to be one of " + (__name(TmpNode) + " or " + __name(IdentNode)) + ", got " + __typeof(ident));
      }
      return this.scope().has(ident);
    };
    _MacroHelper_prototype.isVariableMutable = function (ident) {
      if (!(ident instanceof TmpNode) && !(ident instanceof IdentNode)) {
        throw TypeError("Expected ident to be one of " + (__name(TmpNode) + " or " + __name(IdentNode)) + ", got " + __typeof(ident));
      }
      return this.scope().isMutable(ident);
    };
    _MacroHelper_prototype["var"] = function (ident, isMutable) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be one of " + (__name(IdentNode) + " or " + __name(TmpNode)) + ", got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      return this.parser.Var(this.index, ident, isMutable);
    };
    _MacroHelper_prototype.def = function (key, value) {
      if (key == null) {
        key = NothingNode(0, 0, this.scope());
      } else if (!(key instanceof Node)) {
        throw TypeError("Expected key to be a " + __name(Node) + ", got " + __typeof(key));
      }
      if (value == null) {
        value = void 0;
      } else if (!(value instanceof Node)) {
        throw TypeError("Expected value to be one of " + (__name(Node) + " or undefined") + ", got " + __typeof(value));
      }
      return this.parser.Def(this.index, key, this.doWrap(value));
    };
    _MacroHelper_prototype.noop = function () {
      return this.parser.Nothing(this.index);
    };
    _MacroHelper_prototype.block = function (nodes, label) {
      var _i;
      if (!__isArray(nodes)) {
        throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
      } else {
        for (_i = nodes.length; _i--; ) {
          if (!(nodes[_i] instanceof Node)) {
            throw TypeError("Expected " + ("nodes[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(nodes[_i]));
          }
        }
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.Block(this.index, nodes, label).reduce(this.parser);
    };
    _MacroHelper_prototype["if"] = function (test, whenTrue, whenFalse, label) {
      if (test == null) {
        test = NothingNode(0, 0, this.scope());
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a " + __name(Node) + ", got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = NothingNode(0, 0, this.scope());
      } else if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a " + __name(Node) + ", got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = null;
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be one of " + (__name(Node) + " or null") + ", got " + __typeof(whenFalse));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.If(
        this.index,
        this.doWrap(test),
        whenTrue,
        whenFalse,
        label
      ).reduce(this.parser);
    };
    _MacroHelper_prototype["switch"] = function (node, cases, defaultCase, label) {
      var _this;
      _this = this;
      if (node == null) {
        node = NothingNode(0, 0, this.scope());
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      if (!__isArray(cases)) {
        throw TypeError("Expected cases to be an Array, got " + __typeof(cases));
      }
      if (defaultCase == null) {
        defaultCase = null;
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be one of " + (__name(Node) + " or null") + ", got " + __typeof(defaultCase));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.Switch(
        this.index,
        this.doWrap(node),
        (function () {
          var _arr, _i, _len, case_;
          for (_arr = [], _i = 0, _len = cases.length; _i < _len; ++_i) {
            case_ = cases[_i];
            _arr.push({ node: _this.doWrap(case_.node), body: case_.body, fallthrough: case_.fallthrough });
          }
          return _arr;
        }()),
        defaultCase,
        label
      ).reduce(this.parser);
    };
    _MacroHelper_prototype["for"] = function (init, test, step, body, label) {
      if (init == null) {
        init = null;
      } else if (!(init instanceof Node)) {
        throw TypeError("Expected init to be one of " + (__name(Node) + " or null") + ", got " + __typeof(init));
      }
      if (test == null) {
        test = null;
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be one of " + (__name(Node) + " or null") + ", got " + __typeof(test));
      }
      if (step == null) {
        step = null;
      } else if (!(step instanceof Node)) {
        throw TypeError("Expected step to be one of " + (__name(Node) + " or null") + ", got " + __typeof(step));
      }
      if (body == null) {
        body = NothingNode(0, 0, this.scope());
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.For(
        this.index,
        this.doWrap(init),
        this.doWrap(test),
        this.doWrap(step),
        body,
        label
      ).reduce(this.parser);
    };
    _MacroHelper_prototype.forIn = function (key, object, body, label) {
      if (!(key instanceof IdentNode)) {
        throw TypeError("Expected key to be a " + __name(IdentNode) + ", got " + __typeof(key));
      }
      if (object == null) {
        object = NothingNode(0, 0);
      } else if (!(object instanceof Node)) {
        throw TypeError("Expected object to be a " + __name(Node) + ", got " + __typeof(object));
      }
      if (body == null) {
        body = NothingNode(0, 0, this.scope());
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.ForIn(
        this.index,
        key,
        this.doWrap(object),
        body,
        label
      ).reduce(this.parser);
    };
    _MacroHelper_prototype.tryCatch = function (tryBody, catchIdent, catchBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, 0, this.scope());
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a " + __name(Node) + ", got " + __typeof(tryBody));
      }
      if (catchIdent == null) {
        catchIdent = NothingNode(0, 0, this.scope());
      } else if (!(catchIdent instanceof Node)) {
        throw TypeError("Expected catchIdent to be a " + __name(Node) + ", got " + __typeof(catchIdent));
      }
      if (catchBody == null) {
        catchBody = NothingNode(0, 0, this.scope());
      } else if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a " + __name(Node) + ", got " + __typeof(catchBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.TryCatch(
        this.index,
        tryBody,
        catchIdent,
        catchBody,
        label
      ).reduce(this.parser);
    };
    _MacroHelper_prototype.tryFinally = function (tryBody, finallyBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, 0, this.scope());
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a " + __name(Node) + ", got " + __typeof(tryBody));
      }
      if (finallyBody == null) {
        finallyBody = NothingNode(0, 0, this.scope());
      } else if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a " + __name(Node) + ", got " + __typeof(finallyBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.TryFinally(this.index, tryBody, finallyBody, label).reduce(this.parser);
    };
    _MacroHelper_prototype.assign = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, 0, this.scope());
      } else if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a " + __name(Node) + ", got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == null) {
        right = NothingNode(0, 0, this.scope());
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a " + __name(Node) + ", got " + __typeof(right));
      }
      return this.parser.Assign(this.index, left, op, this.doWrap(right)).reduce(this.parser);
    };
    _MacroHelper_prototype.binary = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, 0, this.scope());
      } else if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a " + __name(Node) + ", got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == null) {
        right = NothingNode(0, 0, this.scope());
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a " + __name(Node) + ", got " + __typeof(right));
      }
      return this.parser.Binary(this.index, this.doWrap(left), op, this.doWrap(right)).reduce(this.parser);
    };
    _MacroHelper_prototype.binaryChain = function (op, nodes) {
      var _i, _i2, _len, left, result, right;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!__isArray(nodes)) {
        throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
      } else {
        for (_i = nodes.length; _i--; ) {
          if (!(nodes[_i] instanceof Node)) {
            throw TypeError("Expected " + ("nodes[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(nodes[_i]));
          }
        }
      }
      if (nodes.length === 0) {
        throw Error("Expected nodes to at least have a length of 1");
      }
      left = this.doWrap(nodes[0]);
      for (_i2 = 1, _len = nodes.length; _i2 < _len; ++_i2) {
        right = nodes[_i2];
        left = this.parser.Binary(this.index, left, op, this.doWrap(right));
      }
      result = left;
      return result.reduce(this.parser);
    };
    _MacroHelper_prototype.unary = function (op, node) {
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (node == null) {
        node = NothingNode(0, 0, this.scope());
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      return this.parser.Unary(this.index, op, this.doWrap(node)).reduce(this.parser);
    };
    _MacroHelper_prototype["throw"] = function (node) {
      if (node == null) {
        node = NothingNode(0, 0, this.scope());
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      return this.parser.Throw(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroHelper_prototype["return"] = function (node) {
      if (node == null) {
        node = void 0;
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be one of " + (__name(Node) + " or undefined") + ", got " + __typeof(node));
      }
      return this.parser.Return(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroHelper_prototype["yield"] = function (node) {
      if (node == null) {
        node = NothingNode(0, 0, this.scope());
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      return this.parser.Yield(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroHelper_prototype["debugger"] = function () {
      return this.parser.Debugger(this.index);
    };
    _MacroHelper_prototype["break"] = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.Break(this.index, label);
    };
    _MacroHelper_prototype["continue"] = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return this.parser.Continue(this.index, label);
    };
    _MacroHelper_prototype.spread = function (node) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      return this.parser.Spread(this.index, node);
    };
    _MacroHelper_prototype.real = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof TmpWrapperNode) {
        return node.node;
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.rewrap = function (newNode, oldNode) {
      oldNode = this.macroExpand1(oldNode);
      if (oldNode instanceof TmpWrapperNode) {
        if (newNode instanceof TmpWrapperNode) {
          return TmpWrapperNode(
            newNode.line,
            newNode.column,
            newNode.scope,
            newNode,
            oldNode.tmps.concat(newNode.tmps)
          );
        } else {
          return TmpWrapperNode(
            newNode.line,
            newNode.column,
            newNode.scope,
            newNode,
            oldNode.tmps.slice()
          );
        }
      } else {
        return newNode;
      }
    };
    _MacroHelper_prototype.eq = function (alpha, bravo) {
      alpha = this.real(alpha);
      bravo = this.real(bravo);
      if (alpha instanceof ConstNode) {
        return bravo instanceof ConstNode && alpha.value === bravo.value;
      } else if (alpha instanceof IdentNode) {
        return bravo instanceof IdentNode && alpha.name === bravo.name;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.isLabeledBlock = function (node) {
      node = this.real(node);
      if (node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryFinallyNode) {
        return node.label != null;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.isBreak = function (node) {
      return this.real(node) instanceof BreakNode;
    };
    _MacroHelper_prototype.isContinue = function (node) {
      return this.real(node) instanceof ContinueNode;
    };
    _MacroHelper_prototype.label = function (node) {
      node = this.real(node);
      if (node instanceof BreakNode || node instanceof ContinueNode || node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryFinallyNode) {
        return node.label;
      } else {
        return null;
      }
    };
    _MacroHelper_prototype.withLabel = function (node, label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be one of " + (__name(IdentNode) + " or " + __name(TmpNode) + " or null") + ", got " + __typeof(label));
      }
      return node.withLabel(label, this.parser);
    };
    _MacroHelper_prototype.macroExpand1 = function (node) {
      var expanded;
      if (node instanceof Node) {
        expanded = this.parser.macroExpand1(node);
        if (expanded instanceof Node) {
          return expanded.reduce(this.parser);
        } else {
          return expanded;
        }
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.macroExpandAll = function (node) {
      var expanded;
      if (node instanceof Node) {
        expanded = this.parser.macroExpandAll(node);
        if (expanded instanceof Node) {
          return expanded.reduce(this.parser);
        } else {
          return expanded;
        }
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.tmp = function (name, save, type) {
      var tmp;
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      if (type == null) {
        type = Type.any;
      } else if (typeof type === "string") {
        if (!((__owns.call(Type, type) ? Type[type] : void 0) instanceof Type)) {
          throw Error(__strnum(type) + " is not a known type name");
        }
        type = __owns.call(Type, type) ? Type[type] : void 0;
      } else if (!(type instanceof Type)) {
        throw Error("Must provide a Type or a string for type, got " + __typeof(type));
      }
      tmp = this.parser.makeTmp(this.index, name, type);
      (save ? this.savedTmps : this.unsavedTmps).push(tmp.id);
      return tmp;
    };
    _MacroHelper_prototype.getTmps = function () {
      return { unsaved: this.unsavedTmps.slice(), saved: this.savedTmps.slice() };
    };
    _MacroHelper_prototype.isConst = function (node) {
      return node === void 0 || node instanceof Node && this.real(node).isConst();
    };
    _MacroHelper_prototype.value = function (node) {
      var expanded;
      if (node === void 0) {
        return;
      } else if (node instanceof Node) {
        expanded = this.real(node);
        if (expanded.isConst()) {
          return expanded.constValue();
        }
      }
    };
    _MacroHelper_prototype["const"] = function (value) {
      return this.parser.Const(this.index, value);
    };
    _MacroHelper_prototype.isSpread = function (node) {
      return this.real(node) instanceof SpreadNode;
    };
    _MacroHelper_prototype.spreadSubnode = function (node) {
      node = this.real(node);
      if (node instanceof SpreadNode) {
        return node.node;
      }
    };
    _MacroHelper_prototype.isNode = function (node) {
      return node instanceof Node;
    };
    _MacroHelper_prototype.isIdent = function (node) {
      return this.real(node) instanceof IdentNode;
    };
    _MacroHelper_prototype.isTmp = function (node) {
      return this.real(node) instanceof TmpNode;
    };
    _MacroHelper_prototype.isIdentOrTmp = function (node) {
      var _ref;
      return (_ref = this.real(node)) instanceof IdentNode || _ref instanceof TmpNode;
    };
    _MacroHelper_prototype.name = function (node) {
      node = this.real(node);
      if (this.isIdent(node)) {
        return node.name;
      }
    };
    _MacroHelper_prototype.ident = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (require("./jsutils").isAcceptableIdent(name, true)) {
        return this.parser.Ident(this.index, name);
      }
    };
    _MacroHelper_prototype.isCall = function (node) {
      return this.real(node) instanceof CallNode;
    };
    _MacroHelper_prototype.callFunc = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return node.func;
      }
    };
    _MacroHelper_prototype.callArgs = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return node.args;
      }
    };
    _MacroHelper_prototype.isSuper = function (node) {
      return this.real(node) instanceof SuperNode;
    };
    _MacroHelper_prototype.superChild = function (node) {
      node = this.real(node);
      if (this.isSuper(node)) {
        return node.child;
      }
    };
    _MacroHelper_prototype.superArgs = function (node) {
      node = this.real(node);
      if (this.isSuper(node)) {
        return node.args;
      }
    };
    _MacroHelper_prototype.callIsNew = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return !!node.isNew;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.callIsApply = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return !!node.isApply;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.call = function (func, args, isNew, isApply) {
      var _i, _this;
      _this = this;
      if (!(func instanceof Node)) {
        throw TypeError("Expected func to be a " + __name(Node) + ", got " + __typeof(func));
      }
      if (args == null) {
        args = [];
      } else if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = args.length; _i--; ) {
          if (!(args[_i] instanceof Node)) {
            throw TypeError("Expected " + ("args[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(args[_i]));
          }
        }
      }
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (isApply == null) {
        isApply = false;
      } else if (typeof isApply !== "boolean") {
        throw TypeError("Expected isApply to be a Boolean, got " + __typeof(isApply));
      }
      if (isNew && isApply) {
        throw Error("Cannot specify both is-new and is-apply");
      }
      return CallNode(
        func.line,
        func.column,
        this.scope(),
        this.doWrap(func),
        (function () {
          var _arr, _i2, _len, arg;
          for (_arr = [], _i2 = 0, _len = args.length; _i2 < _len; ++_i2) {
            arg = args[_i2];
            _arr.push(_this.doWrap(arg));
          }
          return _arr;
        }()),
        isNew,
        isApply
      ).reduce(this.parser);
    };
    _MacroHelper_prototype.func = function (params, body, autoReturn, bound, curry, asType, generator, generic) {
      var _i, _this, func, scope;
      _this = this;
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      if (autoReturn == null) {
        autoReturn = true;
      } else if (typeof autoReturn !== "boolean") {
        throw TypeError("Expected autoReturn to be a Boolean, got " + __typeof(autoReturn));
      }
      if (bound == null) {
        bound = false;
      } else if (!(bound instanceof Node) && typeof bound !== "boolean") {
        throw TypeError("Expected bound to be one of " + (__name(Node) + " or Boolean") + ", got " + __typeof(bound));
      }
      if (curry == null) {
        curry = false;
      } else if (typeof curry !== "boolean") {
        throw TypeError("Expected curry to be a Boolean, got " + __typeof(curry));
      }
      if (asType == null) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be one of " + (__name(Node) + " or undefined") + ", got " + __typeof(asType));
      }
      if (generator == null) {
        generator = false;
      } else if (typeof generator !== "boolean") {
        throw TypeError("Expected generator to be a Boolean, got " + __typeof(generator));
      }
      if (generic == null) {
        generic = [];
      } else if (!__isArray(generic)) {
        throw TypeError("Expected generic to be an Array, got " + __typeof(generic));
      } else {
        for (_i = generic.length; _i--; ) {
          if (!(generic[_i] instanceof IdentNode)) {
            throw TypeError("Expected " + ("generic[" + _i + "]") + " to be a " + __name(IdentNode) + ", got " + __typeof(generic[_i]));
          }
        }
      }
      scope = this.parser.pushScope(true);
      params = (function () {
        var _arr, _arr2, _i2, _len, p, param;
        for (_arr = [], _arr2 = __toArray(params), _i2 = 0, _len = _arr2.length; _i2 < _len; ++_i2) {
          param = _arr2[_i2];
          p = param.rescope(scope);
          addParamToScope(scope, p);
          _arr.push(p);
        }
        return _arr;
      }());
      func = FunctionNode(
        body.line,
        body.column,
        scope.parent,
        params,
        body.rescope(scope),
        autoReturn,
        bound,
        curry,
        asType,
        generator,
        generic
      ).reduce(this.parser);
      this.parser.popScope();
      return func;
    };
    _MacroHelper_prototype.isFunc = function (node) {
      return this.real(node) instanceof FunctionNode;
    };
    _MacroHelper_prototype.funcBody = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.body;
      }
    };
    _MacroHelper_prototype.funcParams = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.params;
      }
    };
    _MacroHelper_prototype.funcIsAutoReturn = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.autoReturn;
      }
    };
    _MacroHelper_prototype.funcIsBound = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.bound && !(node.bound instanceof Node);
      }
    };
    _MacroHelper_prototype.funcIsCurried = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.curry;
      }
    };
    _MacroHelper_prototype.funcAsType = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.asType;
      }
    };
    _MacroHelper_prototype.funcIsGenerator = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.generator;
      }
    };
    _MacroHelper_prototype.funcGeneric = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.generic.slice();
      } else {
        return [];
      }
    };
    _MacroHelper_prototype.param = function (ident, defaultValue, spread, isMutable, asType) {
      if (!(ident instanceof Node)) {
        throw TypeError("Expected ident to be a " + __name(Node) + ", got " + __typeof(ident));
      }
      return ParamNode(
        ident.line,
        ident.column,
        ident.scope,
        ident,
        defaultValue,
        spread,
        isMutable,
        asType
      ).reduce(this.parser);
    };
    _MacroHelper_prototype.isParam = function (node) {
      return this.real(node) instanceof ParamNode;
    };
    _MacroHelper_prototype.paramIdent = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.ident;
      }
    };
    _MacroHelper_prototype.paramDefaultValue = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.defaultValue;
      }
    };
    _MacroHelper_prototype.paramIsSpread = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.spread;
      }
    };
    _MacroHelper_prototype.paramIsMutable = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.isMutable;
      }
    };
    _MacroHelper_prototype.paramType = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.asType;
      }
    };
    _MacroHelper_prototype.isArray = function (node) {
      return this.real(node) instanceof ArrayNode;
    };
    _MacroHelper_prototype.elements = function (node) {
      node = this.real(node);
      if (this.isArray(node)) {
        return node.elements;
      }
    };
    _MacroHelper_prototype.arrayHasSpread = function (node) {
      var _this;
      _this = this;
      node = this.real(node);
      if (node instanceof ArrayNode) {
        return (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(node.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (_this.real(element) instanceof SpreadNode) {
              return true;
            }
          }
          return false;
        }());
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.isObject = function (node) {
      return this.real(node) instanceof ObjectNode;
    };
    _MacroHelper_prototype.pairs = function (node) {
      node = this.real(node);
      if (this.isObject(node) || this.isTypeObject(node)) {
        return node.pairs;
      }
    };
    _MacroHelper_prototype.isBlock = function (node) {
      return this.real(node) instanceof BlockNode;
    };
    _MacroHelper_prototype.nodes = function (node) {
      node = this.real(node);
      if (this.isBlock(node)) {
        return node.nodes;
      }
    };
    _MacroHelper_prototype.array = function (elements) {
      var _i, _this;
      _this = this;
      if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = elements.length; _i--; ) {
          if (!(elements[_i] instanceof Node)) {
            throw TypeError("Expected " + ("elements[" + _i + "]") + " to be a " + __name(Node) + ", got " + __typeof(elements[_i]));
          }
        }
      }
      return this.parser.Array(0, (function () {
        var _arr, _i2, _len, element;
        for (_arr = [], _i2 = 0, _len = elements.length; _i2 < _len; ++_i2) {
          element = elements[_i2];
          _arr.push(_this.doWrap(element));
        }
        return _arr;
      }())).reduce(this.parser);
    };
    _MacroHelper_prototype.object = function (pairs) {
      var _i, _this;
      _this = this;
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be an Array, got " + __typeof(pairs));
      } else {
        for (_i = pairs.length; _i--; ) {
          if (typeof pairs[_i] !== "object" || pairs[_i] === null) {
            throw TypeError("Expected " + ("pairs[" + _i + "]") + " to be an Object, got " + __typeof(pairs[_i]));
          } else {
            if (!(pairs[_i].key instanceof Node)) {
              throw TypeError("Expected " + ("pairs[" + _i + "].key") + " to be a " + __name(Node) + ", got " + __typeof(pairs[_i].key));
            }
            if (!(pairs[_i].value instanceof Node)) {
              throw TypeError("Expected " + ("pairs[" + _i + "].value") + " to be a " + __name(Node) + ", got " + __typeof(pairs[_i].value));
            }
          }
        }
      }
      return this.parser.Object(0, (function () {
        var _arr, _i2, _len, _ref, key, property, value;
        for (_arr = [], _i2 = 0, _len = pairs.length; _i2 < _len; ++_i2) {
          key = (_ref = pairs[_i2]).key;
          value = _ref.value;
          property = _ref.property;
          _arr.push({ key: _this.doWrap(key), value: _this.doWrap(value)(property) });
        }
        return _arr;
      }())).reduce(this.parser);
    };
    _MacroHelper_prototype.type = function (node) {
      var _this;
      _this = this;
      if (typeof node === "string") {
        return __owns.call(Type, node) && Type[node] || (function () {
          throw Error("Unknown type " + __strnum(node));
        }());
      } else if (node instanceof Node) {
        return node.type(this.parser);
      } else {
        throw Error("Can only retrieve type from a String or Node, got " + __typeof(node));
      }
    };
    _MacroHelper_prototype.toType = nodeToType;
    _MacroHelper_prototype.isComplex = function (node) {
      node = this.real(node);
      return node != null && !(node instanceof ConstNode) && !(node instanceof IdentNode) && !(node instanceof TmpNode) && !(node instanceof ThisNode) && !(node instanceof ArgsNode) && (!(node instanceof BlockNode) || node.nodes.length !== 0);
    };
    _MacroHelper_prototype.isNoop = function (node) {
      node = this.real(node);
      return node.isNoop(this.parser);
    };
    _MacroHelper_prototype.isNothing = function (node) {
      return this.real(node) instanceof NothingNode;
    };
    _MacroHelper_prototype.isTypeArray = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Array";
    };
    _MacroHelper_prototype.subtype = function (node) {
      node = this.real(node);
      if (node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Array") {
        return node.args[0];
      }
    };
    _MacroHelper_prototype.isTypeGeneric = function (node) {
      return this.real(node) instanceof TypeGenericNode;
    };
    _MacroHelper_prototype.basetype = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype;
    };
    _MacroHelper_prototype.typeArguments = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.args;
    };
    _MacroHelper_prototype.isTypeObject = function (node) {
      return this.real(node) instanceof TypeObjectNode;
    };
    _MacroHelper_prototype.isTypeFunction = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Function";
    };
    _MacroHelper_prototype.returnType = function (node) {
      node = this.real(node);
      if (node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Function") {
        return node.args[0];
      }
    };
    _MacroHelper_prototype.isTypeUnion = function (node) {
      return this.real(node) instanceof TypeUnionNode;
    };
    _MacroHelper_prototype.types = function (node) {
      node = this.real(node);
      return this.isTypeUnion(node) && node.types;
    };
    _MacroHelper_prototype.isThis = function (node) {
      return this.real(node) instanceof ThisNode;
    };
    _MacroHelper_prototype.isArguments = function (node) {
      node = this.real(node);
      return node instanceof ArgsNode;
    };
    _MacroHelper_prototype.isDef = function (node) {
      return this.real(node) instanceof DefNode;
    };
    _MacroHelper_prototype.isAssign = function (node) {
      return this.real(node) instanceof AssignNode;
    };
    _MacroHelper_prototype.isBinary = function (node) {
      return this.real(node) instanceof BinaryNode;
    };
    _MacroHelper_prototype.isUnary = function (node) {
      return this.real(node) instanceof UnaryNode;
    };
    _MacroHelper_prototype.op = function (node) {
      node = this.real(node);
      if (this.isAssign(node) || this.isBinary(node) || this.isUnary(node)) {
        return node.op;
      }
    };
    _MacroHelper_prototype.left = function (node) {
      node = this.real(node);
      if (this.isDef(node) || this.isBinary(node)) {
        return node.left;
      }
    };
    _MacroHelper_prototype.right = function (node) {
      node = this.real(node);
      if (this.isDef(node) || this.isBinary(node)) {
        return node.right;
      }
    };
    _MacroHelper_prototype.unaryNode = function (node) {
      node = this.real(node);
      if (this.isUnary(node)) {
        return node.node;
      }
    };
    _MacroHelper_prototype.isAccess = function (node) {
      return this.real(node) instanceof AccessNode;
    };
    _MacroHelper_prototype.parent = function (node) {
      node = this.real(node);
      if (node instanceof AccessNode) {
        return node.parent;
      }
    };
    _MacroHelper_prototype.child = function (node) {
      node = this.real(node);
      if (node instanceof AccessNode) {
        return node.child;
      }
    };
    _MacroHelper_prototype.isIf = function (node) {
      return this.real(node) instanceof IfNode;
    };
    _MacroHelper_prototype.test = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.test;
      }
    };
    _MacroHelper_prototype.whenTrue = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.whenTrue;
      }
    };
    _MacroHelper_prototype.whenFalse = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.whenFalse;
      }
    };
    _MacroHelper_prototype.cache = function (node, init, name, save) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      return this.maybeCache(
        node,
        function (setNode, node, cached) {
          if (cached) {
            init.push(setNode);
          }
          return node;
        },
        name,
        save
      );
    };
    _MacroHelper_prototype.maybeCache = function (node, func, name, save) {
      var tmp, type;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      node = this.macroExpand1(node);
      if (this.isComplex(node)) {
        type = node.type(this.parser);
        tmp = this.tmp(name, save, type);
        this.scope().add(tmp, false, type);
        return func(
          this.parser.Block(this.index, [
            this.parser.Var(this.index, tmp, false),
            this.parser.Assign(this.index, tmp, "=", this.doWrap(node))
          ]),
          tmp,
          true
        );
      } else {
        return func(node, node, false);
      }
    };
    _MacroHelper_prototype.maybeCacheAccess = function (node, func, parentName, childName, save) {
      var _this;
      _this = this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
      }
      if (parentName == null) {
        parentName = "ref";
      } else if (typeof parentName !== "string") {
        throw TypeError("Expected parentName to be a String, got " + __typeof(parentName));
      }
      if (childName == null) {
        childName = "ref";
      } else if (typeof childName !== "string") {
        throw TypeError("Expected childName to be a String, got " + __typeof(childName));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      node = this.macroExpand1(node);
      if (this.isAccess(node)) {
        return this.maybeCache(
          this.parent(node),
          function (setParent, parent, parentCached) {
            return _this.maybeCache(
              _this.child(node),
              function (setChild, child, childCached) {
                if (parentCached || childCached) {
                  return func(
                    _this.parser.Access(_this.index, setParent, setChild),
                    _this.parser.Access(_this.index, parent, child),
                    true
                  );
                } else {
                  return func(node, node, false);
                }
              },
              childName,
              save
            );
          },
          parentName,
          save
        );
      } else {
        return func(node, node, false);
      }
    };
    _MacroHelper_prototype.empty = function (node) {
      var _this;
      _this = this;
      if (node == null) {
        return true;
      } else if (!(node instanceof Node)) {
        return false;
      } else if (node instanceof BlockNode) {
        return (function () {
          var _arr, _i, item;
          for (_arr = __toArray(node.nodes), _i = _arr.length; _i--; ) {
            item = _arr[_i];
            if (!_this.empty(item)) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return node instanceof NothingNode;
      }
    };
    function constifyObject(obj, line, column, scope) {
      if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
      }
      if (typeof obj !== "object" || obj === null || obj instanceof RegExp) {
        return ConstNode(line, column, scope, obj);
      } else if (__isArray(obj)) {
        return ArrayNode(line, column, scope, (function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(item, line, column, scope));
          }
          return _arr;
        }()));
      } else if (obj instanceof IdentNode && __num(obj.name.length) > 1 && obj.name.charCodeAt(0) === 36) {
        return CallNode(
          obj.line,
          obj.column,
          scope,
          IdentNode(obj.line, obj.column, scope, "__wrap"),
          [IdentNode(obj.line, obj.column, scope, obj.name.substring(1))]
        );
      } else if (obj instanceof CallNode && !obj.isNew && !obj.isApply && obj.func instanceof IdentNode && obj.func.name === "$") {
        if (obj.args.length !== 1 || obj.args[0] instanceof SpreadNode) {
          throw Error("Can only use $() in an AST if it has one argument.");
        }
        return CallNode(
          obj.line,
          obj.column,
          scope,
          IdentNode(obj.line, obj.column, scope, "__wrap"),
          [obj.args[0]]
        );
      } else if (obj instanceof Node) {
        if (obj.constructor === Node) {
          throw Error("Cannot constify a raw node");
        }
        return CallNode(
          obj.line,
          obj.column,
          scope,
          IdentNode(obj.line, obj.column, scope, "__node"),
          [
            ConstNode(obj.line, obj.column, scope, obj.constructor.cappedName),
            ConstNode(obj.line, obj.column, scope, obj.line),
            ConstNode(obj.line, obj.column, scope, obj.column)
          ].concat((function () {
            var _arr, _arr2, _i, _len, k;
            for (_arr = [], _arr2 = __toArray(obj.constructor.argNames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              k = _arr2[_i];
              _arr.push(constifyObject(obj[k], obj.line, obj.column, scope));
            }
            return _arr;
          }()))
        );
      } else {
        return ObjectNode(line, column, scope, (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push({
                key: ConstNode(line, column, scope, k),
                value: constifyObject(v, line, column, scope)
              });
            }
          }
          return _arr;
        }()));
      }
    }
    MacroHelper.constifyObject = constifyObject;
    function walk(node, func) {
      var _ref;
      if (typeof node !== "object" || node === null || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to walk through: " + __typeof(node));
      }
      if (!(node instanceof BlockNode) && (_ref = func(node)) != null) {
        return _ref;
      }
      return node.walk(function (x) {
        return walk(x, func);
      });
    }
    _MacroHelper_prototype.wrap = function (value) {
      var _ref;
      if (__isArray(value)) {
        return BlockNode(0, 0, this.scope(), value).reduce(this.parser);
      } else if (value instanceof Node) {
        return value;
      } else if (value == null) {
        return NothingNode(0, 0, this.scope());
      } else if (value instanceof RegExp || (_ref = typeof value) === "string" || _ref === "boolean" || _ref === "number") {
        return ConstNode(0, 0, this.scope(), value);
      } else {
        return value;
      }
    };
    _MacroHelper_prototype.node = function (type, line, column) {
      var args;
      args = __slice.call(arguments, 3);
      return Node[type].apply(Node, [line, column, this.scope()].concat(__toArray(args))).reduce(this.parser);
    };
    _MacroHelper_prototype.walk = function (node, func) {
      if (node != null && !(node instanceof Node)) {
        throw TypeError("Expected node to be one of " + (__name(Node) + " or undefined or null") + ", got " + __typeof(node));
      }
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (node != null) {
        return walk(node, func);
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.hasFunc = function (node) {
      var FOUND, walker;
      if (this._hasFunc != null) {
        return this._hasFunc;
      } else {
        FOUND = {};
        walker = function (x) {
          if (x instanceof FunctionNode) {
            throw FOUND;
          } else {
            return x.walk(walker);
          }
        };
        try {
          walk(this.macroExpandAll(node), walker);
        } catch (e) {
          if (e !== FOUND) {
            throw e;
          }
          return this._hasFunc = true;
        }
        return this._hasFunc = false;
      }
    };
    _MacroHelper_prototype.isStatement = function (node) {
      node = this.macroExpand1(node);
      return node instanceof Node && node.isStatement();
    };
    _MacroHelper_prototype.isType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
      }
      return node.type(this.parser).isSubsetOf(type);
    };
    _MacroHelper_prototype.hasType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
      }
      return node.type(this.parser).overlaps(type);
    };
    mutators = {
      Block: function (x, func) {
        var lastNode, len, nodes;
        nodes = x.nodes;
        len = nodes.length;
        if (len !== 0) {
          lastNode = this.mutateLast(nodes[__num(len) - 1], func);
          if (lastNode !== nodes[__num(len) - 1]) {
            return BlockNode(
              x.line,
              x.column,
              x.scope,
              __toArray(__slice.call(nodes, 0, -1)).concat([lastNode]),
              x.label
            );
          }
        }
        return x;
      },
      If: function (x, func) {
        var whenFalse, whenTrue;
        whenTrue = this.mutateLast(x.whenTrue, func);
        whenFalse = this.mutateLast(x.whenFalse, func);
        if (whenTrue !== x.whenTrue || whenFalse !== x.whenFalse) {
          return IfNode(
            x.line,
            x.column,
            x.scope,
            x.test,
            whenTrue,
            whenFalse,
            x.label
          );
        } else {
          return x;
        }
      },
      Switch: function (x, func) {
        var _this, cases, defaultCase;
        _this = this;
        cases = map(x.cases, function (case_) {
          var body;
          if (case_.fallthrough) {
            return case_;
          } else {
            body = _this.mutateLast(case_.body, func);
            if (body !== case_.body) {
              return { node: case_.node, body: body, fallthrough: case_.fallthrough };
            } else {
              return case_;
            }
          }
        });
        defaultCase = this.mutateLast(x.defaultCase || this.noop(), func);
        if (cases !== x.cases || defaultCase !== x.defaultCase) {
          return SwitchNode(
            x.line,
            x.column,
            x.scope,
            x.node,
            cases,
            defaultCase,
            x.label
          );
        } else {
          return x;
        }
      },
      TmpWrapper: function (x, func) {
        var node;
        node = this.mutateLast(x.node, func);
        if (node !== x.node) {
          return TmpWrapperNode(
            x.line,
            x.column,
            x.scope,
            node,
            x.tmps
          );
        } else {
          return x;
        }
      },
      MacroAccess: function (x, func) {
        return this.mutateLast(this.macroExpand1(x), func);
      },
      Break: identity,
      Continue: identity,
      Nothing: identity,
      Return: identity,
      Debugger: identity,
      Throw: identity
    };
    _MacroHelper_prototype.mutateLast = function (node, func, includeNoop) {
      var _ref;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (typeof node !== "object" || node === null || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to mutate-last through: " + __typeof(node));
      }
      if (!__owns.call(mutators, node.constructor.cappedName) || includeNoop && node instanceof NothingNode) {
        if ((_ref = func.call(this, node)) != null) {
          return _ref;
        } else {
          return node;
        }
      } else {
        return mutators[node.constructor.cappedName].call(this, node, func);
      }
    };
    _MacroHelper_prototype.canMutateLast = function (node) {
      return node instanceof Node && __owns.call(mutators, node.constructor.cappedName);
    };
    return MacroHelper;
  }());
  module.exports = MacroHelper;
}.call(this));
