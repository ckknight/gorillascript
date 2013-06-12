(function () {
  "use strict";
  var __create, __isArray, __owns, __slice, __throw, __toArray, __typeof, _ref,
      AccessMultiNode, AccessNode, addParamToScope, ArrayNode, AssignNode,
      BinaryNode, BlockNode, BreakNode, CallNode, CommentNode, ContinueNode,
      DebuggerNode, DefNode, EmbedWriteNode, EvalNode, ForInNode, ForNode,
      FunctionNode, IdentNode, IfNode, LispyNode, MacroAccessNode,
      MacroConstNode, MacroContext, Node, nodeToType, NothingNode, ObjectNode,
      ParamNode, RegexpNode, ReturnNode, RootNode, Scope, SpreadNode, SuperNode,
      SwitchNode, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode,
      SyntaxSequenceNode, ThisNode, ThrowNode, TmpNode, TmpWrapperNode,
      TryCatchNode, TryFinallyNode, Type, TypeFunctionNode, TypeGenericNode,
      TypeObjectNode, TypeUnionNode, UnaryNode, VarNode, YieldNode;
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
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __throw = function (err) {
    throw err;
  };
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
  Node = require("./parser-nodes");
  LispyNode = require("./parser-lispynodes");
  Type = require("./types");
  Scope = require("./parser-scope");
  _ref = require("./parser-utils");
  nodeToType = _ref.nodeToType;
  addParamToScope = _ref.addParamToScope;
  AccessNode = Node.Access;
  AccessMultiNode = Node.AccessMulti;
  ArrayNode = Node.Array;
  AssignNode = Node.Assign;
  BinaryNode = Node.Binary;
  BlockNode = Node.Block;
  BreakNode = Node.Break;
  CallNode = Node.Call;
  CommentNode = Node.Comment;
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
  MacroConstNode = Node.MacroConst;
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
  MacroContext = (function () {
    var _MacroContext_prototype;
    function MacroContext(parser, index, position, inGenerator, inEvilAst) {
      var _this;
      _this = this instanceof MacroContext ? this : __create(_MacroContext_prototype);
      _this.parser = parser;
      _this.index = index;
      _this.position = position;
      _this.inGenerator = inGenerator;
      _this.inEvilAst = inEvilAst;
      _this.unsavedTmps = [];
      _this.savedTmps = [];
      return _this;
    }
    _MacroContext_prototype = MacroContext.prototype;
    MacroContext.displayName = "MacroContext";
    _MacroContext_prototype.doWrap = function (node) {
      if (node instanceof Node) {
        return node.doWrap(this.parser);
      } else {
        return node;
      }
    };
    _MacroContext_prototype.error = function (message, node) {
      if (node == null) {
        node = null;
      }
      throw this.parser.buildError(message, node || this.index);
    };
    _MacroContext_prototype.scope = function () {
      return this.parser.scope.peek();
    };
    _MacroContext_prototype.line = function (node) {
      var index;
      if (node instanceof Node) {
        index = node.index;
      } else {
        index = this.index;
      }
      return this.parser.getPosition(index).line;
    };
    _MacroContext_prototype.column = function (node) {
      var index;
      if (node instanceof Node) {
        index = node.index;
      } else {
        index = this.index;
      }
      return this.parser.getPosition(index).column;
    };
    _MacroContext_prototype.file = function () {
      return this.parser.options.filename || "";
    };
    _MacroContext_prototype.version = function () {
      return this.parser.getPackageVersion();
    };
    _MacroContext_prototype["let"] = function (ident, isMutable, type) {
      if (isMutable == null) {
        isMutable = false;
      }
      if (type == null) {
        type = Type.any;
      }
      if (ident instanceof IdentNode && isMutable && type.isSubsetOf(Type.undefinedOrNull)) {
        type = Type.any;
      }
      return this.scope().add(ident, isMutable, type);
    };
    _MacroContext_prototype.hasVariable = function (ident) {
      return this.scope().has(ident);
    };
    _MacroContext_prototype.isVariableMutable = function (ident) {
      return this.scope().isMutable(ident);
    };
    _MacroContext_prototype["var"] = function (ident, isMutable) {
      if (isMutable == null) {
        isMutable = false;
      }
      return this.parser.Var(this.index, ident, isMutable);
    };
    _MacroContext_prototype.def = function (key, value) {
      if (key == null) {
        key = NothingNode(0, this.scope());
      }
      if (value == null) {
        value = void 0;
      }
      return this.parser.Def(this.index, key, this.doWrap(value));
    };
    _MacroContext_prototype.noop = function () {
      return this.parser.Nothing(this.index);
    };
    _MacroContext_prototype.block = function (nodes, label) {
      if (label == null) {
        label = null;
      }
      return this.parser.Block(this.index, nodes, label).reduce(this.parser);
    };
    _MacroContext_prototype["if"] = function (test, whenTrue, whenFalse, label) {
      if (test == null) {
        test = NothingNode(0, this.scope());
      }
      if (whenTrue == null) {
        whenTrue = NothingNode(0, this.scope());
      }
      if (whenFalse == null) {
        whenFalse = null;
      }
      if (label == null) {
        label = null;
      }
      return this.parser.If(
        this.index,
        this.doWrap(test),
        whenTrue,
        whenFalse,
        label
      ).reduce(this.parser);
    };
    _MacroContext_prototype["switch"] = function (node, cases, defaultCase, label) {
      var _this;
      _this = this;
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      if (defaultCase == null) {
        defaultCase = null;
      }
      if (label == null) {
        label = null;
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
    _MacroContext_prototype["for"] = function (init, test, step, body, label) {
      if (init == null) {
        init = null;
      }
      if (test == null) {
        test = null;
      }
      if (step == null) {
        step = null;
      }
      if (body == null) {
        body = NothingNode(0, this.scope());
      }
      if (label == null) {
        label = null;
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
    _MacroContext_prototype.forIn = function (key, object, body, label) {
      if (object == null) {
        object = NothingNode(0);
      }
      if (body == null) {
        body = NothingNode(0, this.scope());
      }
      if (label == null) {
        label = null;
      }
      return this.parser.ForIn(
        this.index,
        key,
        this.doWrap(object),
        body,
        label
      ).reduce(this.parser);
    };
    _MacroContext_prototype.tryCatch = function (tryBody, catchIdent, catchBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, this.scope());
      }
      if (catchIdent == null) {
        catchIdent = NothingNode(0, this.scope());
      }
      if (catchBody == null) {
        catchBody = NothingNode(0, this.scope());
      }
      if (label == null) {
        label = null;
      }
      return this.parser.TryCatch(
        this.index,
        tryBody,
        catchIdent,
        catchBody,
        label
      ).reduce(this.parser);
    };
    _MacroContext_prototype.tryFinally = function (tryBody, finallyBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, this.scope());
      }
      if (finallyBody == null) {
        finallyBody = NothingNode(0, this.scope());
      }
      if (label == null) {
        label = null;
      }
      return this.parser.TryFinally(this.index, tryBody, finallyBody, label).reduce(this.parser);
    };
    _MacroContext_prototype.assign = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, this.scope());
      }
      if (right == null) {
        right = NothingNode(0, this.scope());
      }
      return this.parser.Assign(this.index, left, op, this.doWrap(right)).reduce(this.parser);
    };
    _MacroContext_prototype.binary = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, this.scope());
      }
      if (right == null) {
        right = NothingNode(0, this.scope());
      }
      return this.parser.Binary(this.index, this.doWrap(left), op, this.doWrap(right)).reduce(this.parser);
    };
    _MacroContext_prototype.binaryChain = function (op, nodes) {
      var _i, _len, left, result, right;
      if (nodes.length === 0) {
        throw Error("Expected nodes to at least have a length of 1");
      }
      left = this.doWrap(nodes[0]);
      for (_i = 1, _len = nodes.length; _i < _len; ++_i) {
        right = nodes[_i];
        left = this.parser.Binary(this.index, left, op, this.doWrap(right));
      }
      result = left;
      return result.reduce(this.parser);
    };
    _MacroContext_prototype.unary = function (op, node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return this.parser.Unary(this.index, op, this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["throw"] = function (node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return this.parser.Throw(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["return"] = function (node) {
      if (node == null) {
        node = void 0;
      }
      return this.parser.Return(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["yield"] = function (node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return this.parser.Yield(this.index, this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["debugger"] = function () {
      return this.parser.Debugger(this.index);
    };
    _MacroContext_prototype["break"] = function (label) {
      if (label == null) {
        label = null;
      }
      return this.parser.Break(this.index, label);
    };
    _MacroContext_prototype["continue"] = function (label) {
      if (label == null) {
        label = null;
      }
      return this.parser.Continue(this.index, label);
    };
    _MacroContext_prototype.spread = function (node) {
      return this.parser.Spread(this.index, node);
    };
    _MacroContext_prototype.real = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof TmpWrapperNode) {
        return node.node;
      } else {
        return node;
      }
    };
    _MacroContext_prototype.rewrap = function (newNode, oldNode) {
      oldNode = this.macroExpand1(oldNode);
      if (oldNode instanceof TmpWrapperNode) {
        if (newNode instanceof TmpWrapperNode) {
          return TmpWrapperNode(newNode.index, newNode.scope, newNode, oldNode.tmps.concat(newNode.tmps));
        } else {
          return TmpWrapperNode(newNode.index, newNode.scope, newNode, oldNode.tmps.slice());
        }
      } else {
        return newNode;
      }
    };
    _MacroContext_prototype.eq = function (alpha, bravo) {
      alpha = this.real(alpha);
      bravo = this.real(bravo);
      if (alpha instanceof LispyNode) {
        if (alpha.isValue && bravo.isValue) {
          return alpha.value === bravo.value;
        } else {
          return false;
        }
      } else if (alpha instanceof IdentNode) {
        return bravo instanceof IdentNode && alpha.name === bravo.name;
      } else {
        return false;
      }
    };
    _MacroContext_prototype.isLabeledBlock = function (node) {
      node = this.real(node);
      if (node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryFinallyNode) {
        return node.label != null;
      } else {
        return false;
      }
    };
    _MacroContext_prototype.isBreak = function (node) {
      return this.real(node) instanceof BreakNode;
    };
    _MacroContext_prototype.isContinue = function (node) {
      return this.real(node) instanceof ContinueNode;
    };
    _MacroContext_prototype.label = function (node) {
      node = this.real(node);
      if (node instanceof BreakNode || node instanceof ContinueNode || node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryFinallyNode) {
        return node.label;
      } else {
        return null;
      }
    };
    _MacroContext_prototype.withLabel = function (node, label) {
      if (label == null) {
        label = null;
      }
      return node.withLabel(label, this.parser);
    };
    _MacroContext_prototype.macroExpand1 = function (node) {
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
    _MacroContext_prototype.macroExpandAll = function (node) {
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
    _MacroContext_prototype.tmp = function (name, save, type) {
      var tmp;
      if (name == null) {
        name = "ref";
      }
      if (save == null) {
        save = false;
      }
      if (type == null) {
        type = Type.any;
      } else if (typeof type === "string") {
        if (!((__owns.call(Type, type) ? Type[type] : void 0) instanceof Type)) {
          throw Error(type + " is not a known type name");
        }
        if (__owns.call(Type, type)) {
          type = Type[type];
        } else {
          type = void 0;
        }
      } else if (!(type instanceof Type)) {
        throw Error("Must provide a Type or a string for type, got " + __typeof(type));
      }
      tmp = this.parser.makeTmp(this.index, name, type);
      (save ? this.savedTmps : this.unsavedTmps).push(tmp.id);
      return tmp;
    };
    _MacroContext_prototype.getTmps = function () {
      return { unsaved: this.unsavedTmps.slice(), saved: this.savedTmps.slice() };
    };
    _MacroContext_prototype.isConst = function (node) {
      return node === void 0 || node instanceof Node && this.real(node).isConst();
    };
    _MacroContext_prototype.value = function (node) {
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
    _MacroContext_prototype["const"] = function (value) {
      return LispyNode.Value(this.index, value);
    };
    _MacroContext_prototype.isSpread = function (node) {
      return this.real(node) instanceof SpreadNode;
    };
    _MacroContext_prototype.spreadSubnode = function (node) {
      node = this.real(node);
      if (node instanceof SpreadNode) {
        return node.node;
      }
    };
    _MacroContext_prototype.isNode = function (node) {
      return node instanceof Node;
    };
    _MacroContext_prototype.isIdent = function (node) {
      return this.real(node) instanceof IdentNode;
    };
    _MacroContext_prototype.isPrimordial = function (node) {
      node = this.real(node);
      return node instanceof IdentNode && node.isPrimordial();
    };
    _MacroContext_prototype.isTmp = function (node) {
      return this.real(node) instanceof TmpNode;
    };
    _MacroContext_prototype.isIdentOrTmp = function (node) {
      var _ref;
      return (_ref = this.real(node)) instanceof IdentNode || _ref instanceof TmpNode;
    };
    _MacroContext_prototype.name = function (node) {
      node = this.real(node);
      if (this.isIdent(node)) {
        return node.name;
      }
    };
    _MacroContext_prototype.ident = function (name) {
      if (require("./jsutils").isAcceptableIdent(name, true)) {
        return this.parser.Ident(this.index, name);
      }
    };
    _MacroContext_prototype.isCall = function (node) {
      return this.real(node) instanceof CallNode;
    };
    _MacroContext_prototype.callFunc = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return node.func;
      }
    };
    _MacroContext_prototype.callArgs = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return node.args;
      }
    };
    _MacroContext_prototype.isSuper = function (node) {
      return this.real(node) instanceof SuperNode;
    };
    _MacroContext_prototype.superChild = function (node) {
      node = this.real(node);
      if (this.isSuper(node)) {
        return node.child;
      }
    };
    _MacroContext_prototype.superArgs = function (node) {
      node = this.real(node);
      if (this.isSuper(node)) {
        return node.args;
      }
    };
    _MacroContext_prototype.callIsNew = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return !!node.isNew;
      } else {
        return false;
      }
    };
    _MacroContext_prototype.callIsApply = function (node) {
      node = this.real(node);
      if (node instanceof CallNode) {
        return !!node.isApply;
      } else {
        return false;
      }
    };
    _MacroContext_prototype.call = function (func, args, isNew, isApply) {
      var _this;
      _this = this;
      if (args == null) {
        args = [];
      }
      if (isNew == null) {
        isNew = false;
      }
      if (isApply == null) {
        isApply = false;
      }
      if (isNew && isApply) {
        throw Error("Cannot specify both is-new and is-apply");
      }
      return CallNode(
        func.index,
        this.scope(),
        this.doWrap(func),
        (function () {
          var _arr, _i, _len, arg;
          for (_arr = [], _i = 0, _len = args.length; _i < _len; ++_i) {
            arg = args[_i];
            _arr.push(_this.doWrap(arg));
          }
          return _arr;
        }()),
        isNew,
        isApply
      ).reduce(this.parser);
    };
    _MacroContext_prototype.func = function (params, body, autoReturn, bound, curry, asType, generator, generic) {
      var _arr, _arr2, _i, _len, func, p, param, scope;
      if (autoReturn == null) {
        autoReturn = true;
      }
      if (bound == null) {
        bound = false;
      }
      if (curry == null) {
        curry = false;
      }
      if (asType == null) {
        asType = void 0;
      }
      if (generator == null) {
        generator = false;
      }
      if (generic == null) {
        generic = [];
      }
      scope = this.parser.pushScope(true);
      for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        p = param.rescope(scope);
        addParamToScope(scope, p);
        _arr.push(p);
      }
      params = _arr;
      func = FunctionNode(
        body.index,
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
    _MacroContext_prototype.isFunc = function (node) {
      return this.real(node) instanceof FunctionNode;
    };
    _MacroContext_prototype.funcBody = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.body;
      }
    };
    _MacroContext_prototype.funcParams = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.params;
      }
    };
    _MacroContext_prototype.funcIsAutoReturn = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.autoReturn;
      }
    };
    _MacroContext_prototype.funcIsBound = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.bound && !(node.bound instanceof Node);
      }
    };
    _MacroContext_prototype.funcIsCurried = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.curry;
      }
    };
    _MacroContext_prototype.funcAsType = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.asType;
      }
    };
    _MacroContext_prototype.funcIsGenerator = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return !!node.generator;
      }
    };
    _MacroContext_prototype.funcGeneric = function (node) {
      node = this.real(node);
      if (this.isFunc(node)) {
        return node.generic.slice();
      } else {
        return [];
      }
    };
    _MacroContext_prototype.param = function (ident, defaultValue, spread, isMutable, asType) {
      return ParamNode(
        ident.index,
        ident.scope,
        ident,
        defaultValue,
        spread,
        isMutable,
        asType
      ).reduce(this.parser);
    };
    _MacroContext_prototype.isParam = function (node) {
      return this.real(node) instanceof ParamNode;
    };
    _MacroContext_prototype.paramIdent = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.ident;
      }
    };
    _MacroContext_prototype.paramDefaultValue = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.defaultValue;
      }
    };
    _MacroContext_prototype.paramIsSpread = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.spread;
      }
    };
    _MacroContext_prototype.paramIsMutable = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.isMutable;
      }
    };
    _MacroContext_prototype.paramType = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.asType;
      }
    };
    _MacroContext_prototype.isArray = function (node) {
      return this.real(node) instanceof ArrayNode;
    };
    _MacroContext_prototype.elements = function (node) {
      node = this.real(node);
      if (this.isArray(node)) {
        return node.elements;
      }
    };
    _MacroContext_prototype.arrayHasSpread = function (node) {
      var _arr, _i, _len, _some, element;
      node = this.real(node);
      if (node instanceof ArrayNode) {
        _some = false;
        for (_arr = __toArray(node.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          if (this.real(element) instanceof SpreadNode) {
            _some = true;
            break;
          }
        }
        return _some;
      } else {
        return false;
      }
    };
    _MacroContext_prototype.isObject = function (node) {
      return this.real(node) instanceof ObjectNode;
    };
    _MacroContext_prototype.pairs = function (node) {
      node = this.real(node);
      if (this.isObject(node) || this.isTypeObject(node)) {
        return node.pairs;
      }
    };
    _MacroContext_prototype.isBlock = function (node) {
      return this.real(node) instanceof BlockNode;
    };
    _MacroContext_prototype.nodes = function (node) {
      node = this.real(node);
      if (this.isBlock(node)) {
        return node.nodes;
      }
    };
    _MacroContext_prototype.array = function (elements) {
      var _this;
      _this = this;
      return this.parser.Array(0, (function () {
        var _arr, _arr2, _i, _len, element;
        for (_arr = [], _arr2 = __toArray(elements), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          element = _arr2[_i];
          _arr.push(_this.doWrap(element));
        }
        return _arr;
      }())).reduce(this.parser);
    };
    _MacroContext_prototype.object = function (pairs) {
      var _this;
      _this = this;
      return this.parser.Object(0, (function () {
        var _arr, _arr2, _i, _len, _ref, key, property, value;
        for (_arr = [], _arr2 = __toArray(pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          _ref = _arr2[_i];
          key = _ref.key;
          value = _ref.value;
          property = _ref.property;
          _arr.push({ key: _this.doWrap(key), value: _this.doWrap(value)(property) });
        }
        return _arr;
      }())).reduce(this.parser);
    };
    _MacroContext_prototype.type = function (node) {
      if (typeof node === "string") {
        return __owns.call(Type, node) && Type[node] || __throw(Error("Unknown type " + node));
      } else if (node instanceof Node) {
        return node.type(this.parser);
      } else {
        throw Error("Can only retrieve type from a String or Node, got " + __typeof(node));
      }
    };
    _MacroContext_prototype.toType = nodeToType;
    _MacroContext_prototype.isComplex = function (node) {
      node = this.real(node);
      if (node == null) {
        return false;
      } else if (node instanceof LispyNode) {
        return node.isCall;
      } else {
        return !(node instanceof IdentNode) && !(node instanceof TmpNode) && !(node instanceof ThisNode) && (!(node instanceof BlockNode) || node.nodes.length !== 0);
      }
    };
    _MacroContext_prototype.isNoop = function (node) {
      node = this.real(node);
      return node.isNoop(this.parser);
    };
    _MacroContext_prototype.isNothing = function (node) {
      return this.real(node) instanceof NothingNode;
    };
    _MacroContext_prototype.isTypeArray = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Array";
    };
    _MacroContext_prototype.subtype = function (node) {
      node = this.real(node);
      if (node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Array") {
        return node.args[0];
      }
    };
    _MacroContext_prototype.isTypeGeneric = function (node) {
      return this.real(node) instanceof TypeGenericNode;
    };
    _MacroContext_prototype.basetype = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype;
    };
    _MacroContext_prototype.typeArguments = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.args;
    };
    _MacroContext_prototype.isTypeObject = function (node) {
      return this.real(node) instanceof TypeObjectNode;
    };
    _MacroContext_prototype.isTypeFunction = function (node) {
      node = this.real(node);
      return node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Function";
    };
    _MacroContext_prototype.returnType = function (node) {
      node = this.real(node);
      if (node instanceof TypeGenericNode && node.basetype instanceof IdentNode && node.basetype.name === "Function") {
        return node.args[0];
      }
    };
    _MacroContext_prototype.isTypeUnion = function (node) {
      return this.real(node) instanceof TypeUnionNode;
    };
    _MacroContext_prototype.types = function (node) {
      node = this.real(node);
      return this.isTypeUnion(node) && node.types;
    };
    _MacroContext_prototype.isThis = function (node) {
      return this.real(node) instanceof ThisNode;
    };
    _MacroContext_prototype.isArguments = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isIdent && node.name === "arguments";
    };
    _MacroContext_prototype.isDef = function (node) {
      return this.real(node) instanceof DefNode;
    };
    _MacroContext_prototype.isAssign = function (node) {
      return this.real(node) instanceof AssignNode;
    };
    _MacroContext_prototype.isBinary = function (node) {
      return this.real(node) instanceof BinaryNode;
    };
    _MacroContext_prototype.isUnary = function (node) {
      return this.real(node) instanceof UnaryNode;
    };
    _MacroContext_prototype.op = function (node) {
      node = this.real(node);
      if (this.isAssign(node) || this.isBinary(node) || this.isUnary(node)) {
        return node.op;
      }
    };
    _MacroContext_prototype.left = function (node) {
      node = this.real(node);
      if (this.isDef(node) || this.isBinary(node)) {
        return node.left;
      }
    };
    _MacroContext_prototype.right = function (node) {
      node = this.real(node);
      if (this.isDef(node) || this.isBinary(node)) {
        return node.right;
      }
    };
    _MacroContext_prototype.unaryNode = function (node) {
      node = this.real(node);
      if (this.isUnary(node)) {
        return node.node;
      }
    };
    _MacroContext_prototype.isAccess = function (node) {
      return this.real(node) instanceof AccessNode;
    };
    _MacroContext_prototype.parent = function (node) {
      node = this.real(node);
      if (node instanceof AccessNode) {
        return node.parent;
      }
    };
    _MacroContext_prototype.child = function (node) {
      node = this.real(node);
      if (node instanceof AccessNode) {
        return node.child;
      }
    };
    _MacroContext_prototype.isIf = function (node) {
      return this.real(node) instanceof IfNode;
    };
    _MacroContext_prototype.test = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.test;
      }
    };
    _MacroContext_prototype.whenTrue = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.whenTrue;
      }
    };
    _MacroContext_prototype.whenFalse = function (node) {
      node = this.real(node);
      if (node instanceof IfNode) {
        return node.whenFalse;
      }
    };
    _MacroContext_prototype.cache = function (node, init, name, save) {
      if (name == null) {
        name = "ref";
      }
      if (save == null) {
        save = false;
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
    _MacroContext_prototype.maybeCache = function (node, func, name, save) {
      var tmp, type;
      if (name == null) {
        name = "ref";
      }
      if (save == null) {
        save = false;
      }
      node = this.macroExpand1(node);
      if (this.isComplex(node)) {
        type = node.type(this.parser);
        tmp = this.tmp(name, save, type);
        this.scope().add(tmp, false, type);
        return func.call(
          this,
          this.parser.Block(this.index, [
            this.parser.Var(this.index, tmp, false),
            this.parser.Assign(this.index, tmp, "=", this.doWrap(node))
          ]),
          tmp,
          true
        );
      } else {
        return func.call(this, node, node, false);
      }
    };
    _MacroContext_prototype.maybeCacheAccess = function (node, func, parentName, childName, save) {
      if (parentName == null) {
        parentName = "ref";
      }
      if (childName == null) {
        childName = "ref";
      }
      if (save == null) {
        save = false;
      }
      node = this.macroExpand1(node);
      if (this.isAccess(node)) {
        return this.maybeCache(
          this.parent(node),
          function (setParent, parent, parentCached) {
            return this.maybeCache(
              this.child(node),
              function (setChild, child, childCached) {
                if (parentCached || childCached) {
                  return func.call(
                    this,
                    this.parser.Access(this.index, setParent, setChild),
                    this.parser.Access(this.index, parent, child),
                    true
                  );
                } else {
                  return func.call(this, node, node, false);
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
        return func.call(this, node, node, false);
      }
    };
    _MacroContext_prototype.empty = function (node) {
      var _arr, _every, _i, item;
      if (node == null) {
        return true;
      } else if (!(node instanceof Node)) {
        return false;
      } else if (node instanceof BlockNode) {
        _every = true;
        for (_arr = __toArray(node.nodes), _i = _arr.length; _i--; ) {
          item = _arr[_i];
          if (!this.empty(item)) {
            _every = false;
            break;
          }
        }
        return _every;
      } else {
        return node instanceof NothingNode;
      }
    };
    function constifyObject(position, obj, index, scope) {
      var _ref;
      if (obj === null || (_ref = typeof obj) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
        return LispyNode.Value(index, obj);
      } else if (obj instanceof RegExp) {
        return RegexpNode(index, scope, obj.source, (obj.global ? "g" : "") + (obj.ignoreCase ? "i" : "") + (obj.multiline ? "m" : "") + (obj.sticky ? "y" : ""));
      } else if (__isArray(obj)) {
        return ArrayNode(index, scope, (function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(position, item, index, scope));
          }
          return _arr;
        }()));
      } else if (obj instanceof IdentNode && obj.name.length > 1 && obj.name.charCodeAt(0) === 36) {
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__wrap"),
          [IdentNode(obj.index, scope, obj.name.substring(1))]
        );
      } else if (obj instanceof CallNode && !obj.isNew && !obj.isApply && obj.func instanceof IdentNode && obj.func.name === "$") {
        if (obj.args.length !== 1 || obj.args[0] instanceof SpreadNode) {
          throw Error("Can only use $() in an AST if it has one argument.");
        }
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__wrap"),
          [obj.args[0]]
        );
      } else if (obj instanceof MacroConstNode) {
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__const"),
          [LispyNode.Value(obj.index, obj.name)]
        );
      } else if (obj instanceof LispyNode) {
        if (obj.isValue) {
          return CallNode(
            obj.index,
            scope,
            IdentNode(obj.index, scope, "__value"),
            [
              position || LispyNode.Value(obj.index, void 0),
              obj
            ]
          );
        } else if (obj.isSymbol) {
          return CallNode(
            obj.index,
            scope,
            IdentNode(obj.index, scope, "__symbol"),
            [
              position || LispyNode.Value(obj.index, void 0)
            ].concat(__toArray(obj.isIdent
              ? [
                LispyNode.Value(obj.index, "ident"),
                LispyNode.Value(obj.index, obj.name)
              ]
              : obj.isTmp
              ? [
                LispyNode.Value(obj.index, "tmp"),
                LispyNode.Value(obj.index, obj.id),
                LispyNode.Value(obj.index, obj.name)
              ]
              : obj.isInternal
              ? [
                LispyNode.Value(obj.index, "internal"),
                LispyNode.Value(obj.index, obj.name)
              ]
              : obj.isOperator
              ? [
                LispyNode.Value(obj.index, "operator"),
                LispyNode.Value(obj.index, obj.operatorType),
                LispyNode.Value(obj.index, obj.name)
              ]
              : __throw(Error("Unhandled value in switch"))))
          );
        } else {
          throw Error("Unhandled value in switch");
        }
      } else if (obj instanceof Node) {
        if (obj.constructor === Node) {
          throw Error("Cannot constify a raw node");
        }
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__node"),
          [
            LispyNode.Value(obj.index, obj.typeId),
            position || LispyNode.Value(obj.index, void 0)
          ].concat((function () {
            var _arr, _arr2, _i, _len, item;
            for (_arr = [], _arr2 = __toArray(obj._toJSON()), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              item = _arr2[_i];
              _arr.push(constifyObject(position, item, obj.index, scope));
            }
            return _arr;
          }()))
        );
      } else if (obj.constructor === Object) {
        return ObjectNode(index, scope, (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push({
                key: LispyNode.Value(index, k),
                value: constifyObject(position, v, index, scope)
              });
            }
          }
          return _arr;
        }()));
      } else {
        throw Error("Trying to constify a " + __typeof(obj));
      }
    }
    MacroContext.constifyObject = constifyObject;
    _MacroContext_prototype.wrap = function (value) {
      var _ref;
      if (__isArray(value)) {
        return BlockNode(this.index, this.scope(), value).reduce(this.parser);
      } else if (value instanceof Node) {
        return value;
      } else if (value == null) {
        return NothingNode(this.index, this.scope());
      } else if ((_ref = typeof value) === "string" || _ref === "boolean" || _ref === "number") {
        return LispyNode.Value(this.index, value);
      } else {
        return value;
      }
    };
    _MacroContext_prototype.makeLispyValue = function (fromPosition, value) {
      var index;
      if (fromPosition && typeof fromPosition.index === "number") {
        index = fromPosition.index;
      } else {
        index = this.index;
      }
      return LispyNode.Value(index, value);
    };
    _MacroContext_prototype.makeLispySymbol = function (fromPosition, symbolType) {
      var args, index;
      args = __slice.call(arguments, 2);
      if (fromPosition && typeof fromPosition.index === "number") {
        index = fromPosition.index;
      } else {
        index = this.index;
      }
      switch (symbolType) {
      case "internal": return LispyNode.Symbol[args[0]](index);
      case "ident":
        return LispyNode.Symbol.ident(index, this.scope(), args[0]);
      case "tmp":
        return LispyNode.Symbol.tmp(index, this.scope(), args[0], args[1]);
      case "operator":
        return LispyNode.Symbol[args[0]](index, args[1]);
      default: throw Error("Unhandled value in switch");
      }
    };
    _MacroContext_prototype.node = function (typeId, fromPosition) {
      var _ref, args, index;
      args = __slice.call(arguments, 2);
      if (typeId === 23) {
        return this.macro.apply(this, [fromPosition].concat(__toArray(args)));
      } else {
        if (fromPosition && typeof fromPosition.index === "number") {
          index = fromPosition.index;
        } else {
          index = this.index;
        }
        return (_ref = Node.byTypeId)[typeId].apply(_ref, [index, this.scope()].concat(__toArray(args))).reduce(this.parser);
      }
    };
    _MacroContext_prototype.getConstValue = function (name, defaultValue) {
      var c;
      c = this.parser.getConst(name);
      if (!c) {
        if (arguments.length < 2) {
          throw Error("Unknown const '" + name + "'");
        } else {
          return defaultValue;
        }
      } else {
        return c.value;
      }
    };
    function toLiteralNode(obj) {
      var _ref, _this;
      _this = this;
      if (obj === null || (_ref = typeof obj) === "undefined" || _ref === "boolean" || _ref === "number" || _ref === "string") {
        return LispyNode.Value(0, obj);
      } else if (__isArray(obj)) {
        return ArrayNode(0, this.scope(), (function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(toLiteralNode.call(_this, item));
          }
          return _arr;
        }()));
      } else if (obj.constructor === Object) {
        return ObjectNode(0, this.scope(), (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push({
                key: toLiteralNode.call(_this, k),
                value: toLiteralNode.call(_this, v)
              });
            }
          }
          return _arr;
        }()));
      } else {
        throw Error("Cannot convert " + __typeof(obj) + " to a literal node");
      }
    }
    _MacroContext_prototype.getConst = function (name) {
      return toLiteralNode.call(this, this.getConstValue(name));
    };
    _MacroContext_prototype.macro = function (fromPosition, id, callLine, data, position, inGenerator, inEvilAst) {
      var index;
      if (fromPosition && typeof fromPosition.index === "number") {
        index = fromPosition.index;
      } else {
        index = this.index;
      }
      return Node.MacroAccess(
        index,
        this.scope(),
        id,
        callLine,
        data,
        position,
        inGenerator || this.parser.inGenerator.peek(),
        inEvilAst
      ).reduce(this.parser);
    };
    function walk(node, func) {
      var _ref;
      if (typeof node !== "object" || node === null || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to walk through: " + __typeof(node));
      }
      if (!(node instanceof BlockNode) && (_ref = func.call(this, node)) != null) {
        return _ref;
      }
      return node.walk(
        function (x) {
          return walk.call(this, x, func);
        },
        this
      );
    }
    _MacroContext_prototype.walk = function (node, func) {
      if (node != null) {
        return walk.call(this, node, func);
      } else {
        return node;
      }
    };
    _MacroContext_prototype.hasFunc = function (node) {
      var FOUND, walker;
      if (this._hasFunc != null) {
        return this._hasFunc;
      } else {
        FOUND = {};
        walker = function (x) {
          if (x instanceof FunctionNode) {
            throw FOUND;
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
    _MacroContext_prototype.isStatement = function (node) {
      node = this.macroExpand1(node);
      return node instanceof Node && node.isStatement();
    };
    _MacroContext_prototype.isType = function (node, name) {
      var type;
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
      }
      return node.type(this.parser).isSubsetOf(type);
    };
    _MacroContext_prototype.hasType = function (node, name) {
      var type;
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
      }
      return node.type(this.parser).overlaps(type);
    };
    _MacroContext_prototype.mutateLast = function (node, func, includeNoop) {
      if (typeof node !== "object" || node === null || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to mutate-last through: " + __typeof(node));
      }
      return node.mutateLast(this.parser, func, this, includeNoop);
    };
    return MacroContext;
  }());
  module.exports = MacroContext;
}.call(this));
