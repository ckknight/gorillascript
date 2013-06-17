(function () {
  "use strict";
  var __create, __isArray, __owns, __slice, __throw, __toArray, __typeof, _ref,
      addParamToScope, CallNode, FunctionNode, IdentNode, LispyNode,
      MacroAccessNode, MacroContext, Node, nodeToType, NothingNode, ParamNode,
      Scope, SuperNode, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode,
      SyntaxSequenceNode, TmpNode, Type, TypeFunctionNode, TypeGenericNode,
      TypeObjectNode, TypeUnionNode;
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
  CallNode = Node.Call;
  FunctionNode = Node.Function;
  IdentNode = Node.Ident;
  MacroAccessNode = Node.MacroAccess;
  NothingNode = Node.Nothing;
  ParamNode = Node.Param;
  SuperNode = Node.Super;
  SyntaxChoiceNode = Node.SyntaxChoice;
  SyntaxManyNode = Node.SyntaxMany;
  SyntaxParamNode = Node.SyntaxParam;
  SyntaxSequenceNode = Node.SyntaxSequence;
  TmpNode = Node.Tmp;
  TypeFunctionNode = Node.TypeFunction;
  TypeGenericNode = Node.TypeGeneric;
  TypeObjectNode = Node.TypeObject;
  TypeUnionNode = Node.TypeUnion;
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
      return LispyNode.InternalCall(
        "var",
        this.index,
        this.scope(),
        ident,
        LispyNode.Value(this.index, isMutable)
      );
    };
    _MacroContext_prototype.custom = function (name) {
      var data;
      data = __slice.call(arguments, 1);
      return LispyNode.InternalCall.apply(LispyNode, [
        "custom",
        this.index,
        this.scope(),
        LispyNode.Value(this.index, name)
      ].concat(__toArray(data))).reduce(this.parser);
    };
    _MacroContext_prototype.noop = function () {
      return this.parser.Nothing(this.index);
    };
    _MacroContext_prototype.block = function (nodes) {
      return LispyNode.InternalCall.apply(LispyNode, ["block", this.index, this.scope()].concat(__toArray(nodes))).reduce(this.parser);
    };
    _MacroContext_prototype["if"] = function (test, whenTrue, whenFalse) {
      if (test == null) {
        test = NothingNode(0, this.scope());
      }
      if (whenTrue == null) {
        whenTrue = NothingNode(0, this.scope());
      }
      if (whenFalse == null) {
        whenFalse = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall(
        "if",
        this.index,
        this.scope(),
        this.doWrap(test),
        whenTrue,
        whenFalse
      ).reduce(this.parser);
    };
    _MacroContext_prototype["switch"] = function (topic, cases, defaultCase) {
      var _i, _len, args, case_;
      if (topic == null) {
        topic = NothingNode(0, this.scope());
      }
      if (defaultCase == null) {
        defaultCase = null;
      }
      args = [this.doWrap(topic)];
      for (_i = 0, _len = cases.length; _i < _len; ++_i) {
        case_ = cases[_i];
        args.push(this.doWrap(case_.node), case_.body, this["const"](case_.fallthrough));
      }
      args.push(defaultCase);
      return LispyNode.InternalCall.apply(LispyNode, ["switch", this.index, this.scope()].concat(__toArray(args))).reduce(this.parser);
    };
    _MacroContext_prototype["for"] = function (init, test, step, body) {
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
      return LispyNode.InternalCall(
        "for",
        this.index,
        this.scope(),
        this.doWrap(init),
        this.doWrap(test),
        this.doWrap(step),
        body
      ).reduce(this.parser);
    };
    _MacroContext_prototype.forIn = function (key, object, body) {
      if (object == null) {
        object = NothingNode(0);
      }
      if (body == null) {
        body = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall(
        "forIn",
        this.index,
        this.scope(),
        key,
        this.doWrap(object),
        body
      ).reduce(this.parser);
    };
    _MacroContext_prototype.tryCatch = function (tryBody, catchIdent, catchBody) {
      if (tryBody == null) {
        tryBody = NothingNode(0, this.scope());
      }
      if (catchIdent == null) {
        catchIdent = NothingNode(0, this.scope());
      }
      if (catchBody == null) {
        catchBody = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall(
        "tryCatch",
        this.index,
        this.scope(),
        tryBody,
        catchIdent,
        catchBody
      ).reduce(this.parser);
    };
    _MacroContext_prototype.tryFinally = function (tryBody, finallyBody) {
      if (tryBody == null) {
        tryBody = NothingNode(0, this.scope());
      }
      if (finallyBody == null) {
        finallyBody = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall(
        "tryFinally",
        this.index,
        this.scope(),
        tryBody,
        finallyBody
      ).reduce(this.parser);
    };
    _MacroContext_prototype.assign = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, this.scope());
      }
      if (right == null) {
        right = NothingNode(0, this.scope());
      }
      return LispyNode.Call(
        this.index,
        this.scope(),
        LispyNode.Symbol.assign[op](this.index),
        left,
        this.doWrap(right)
      ).reduce(this.parser);
    };
    _MacroContext_prototype.binary = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, this.scope());
      }
      if (right == null) {
        right = NothingNode(0, this.scope());
      }
      return LispyNode.Call(
        this.index,
        this.scope(),
        LispyNode.Symbol.binary[op](this.index),
        this.doWrap(left),
        this.doWrap(right)
      ).reduce(this.parser);
    };
    _MacroContext_prototype.binaryChain = function (op, nodes) {
      var _i, _len, left, result, right;
      if (nodes.length === 0) {
        throw Error("Expected nodes to at least have a length of 1");
      }
      left = this.doWrap(nodes[0]);
      for (_i = 1, _len = nodes.length; _i < _len; ++_i) {
        right = nodes[_i];
        left = LispyNode.Call(
          this.index,
          this.scope(),
          LispyNode.Symbol.binary[op](this.index),
          left,
          this.doWrap(right)
        );
      }
      result = left;
      return result.reduce(this.parser);
    };
    _MacroContext_prototype.unary = function (op, node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return LispyNode.Call(this.index, this.scope(), LispyNode.Symbol.unary[op](this.index), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["throw"] = function (node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall("throw", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["return"] = function (node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall("return", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["yield"] = function (node) {
      if (node == null) {
        node = NothingNode(0, this.scope());
      }
      return LispyNode.InternalCall("yield", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["debugger"] = function () {
      return LispyNode.InternalCall("debugger", this.index, this.scope());
    };
    _MacroContext_prototype["break"] = function (label) {
      if (label == null) {
        label = null;
      }
      return LispyNode.InternalCall.apply(LispyNode, ["break", this.index, this.scope()].concat(label ? [label] : []));
    };
    _MacroContext_prototype["continue"] = function (label) {
      if (label == null) {
        label = null;
      }
      return LispyNode.InternalCall.apply(LispyNode, ["continue", this.index, this.scope()].concat(label ? [label] : []));
    };
    _MacroContext_prototype.spread = function (node) {
      return LispyNode.InternalCall("spread", this.index, this.scope(), node);
    };
    _MacroContext_prototype.real = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof LispyNode && node.isInternalCall("tmpWrapper")) {
        return node.args[0];
      } else {
        return node;
      }
    };
    _MacroContext_prototype.rewrap = function (newNode, oldNode) {
      oldNode = this.macroExpand1(oldNode);
      if (oldNode instanceof LispyNode && oldNode.isInternalCall("tmpWrapper")) {
        if (newNode instanceof LispyNode && newNode.isInternalCall("tmpWrapper")) {
          return LispyNode.InternalCall.apply(LispyNode, ["tmpWrapper", newNode.index, newNode.scope, newNode.args[0]].concat(
            __toArray(__slice.call(oldNode.args, 1)),
            __toArray(__slice.call(newNode.args, 1))
          ));
        } else {
          return LispyNode.InternalCall.apply(LispyNode, ["tmpWrapper", newNode.index, newNode.scope, newNode].concat(__toArray(__slice.call(oldNode.args, 1))));
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
    _MacroContext_prototype.isLabel = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("label");
    };
    _MacroContext_prototype.isBreak = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("break");
    };
    _MacroContext_prototype.isContinue = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("continue");
    };
    _MacroContext_prototype.label = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isInternalCall("break", "continue", "label")) {
        return node.args[0];
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
      if (node !== void 0 && node instanceof Node) {
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
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("spread");
    };
    _MacroContext_prototype.spreadSubnode = function (node) {
      node = this.real(node);
      if (this.isSpread(node)) {
        return node.args[0];
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
      } else if (this.isCustom(node)) {
        return node.args[0].constValue();
      }
    };
    _MacroContext_prototype.customData = function (node) {
      node = this.real(node);
      if (this.isCustom(node)) {
        return node.args.slice(1);
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
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("array");
    };
    _MacroContext_prototype.elements = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isInternalCall("array")) {
        return node.args;
      }
    };
    _MacroContext_prototype.arrayHasSpread = function (node) {
      var _arr, _i, _len, _some, element;
      node = this.real(node);
      if (node instanceof LispyNode && node.isInternalCall("array")) {
        _some = false;
        for (_arr = __toArray(node.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          if (this.isSpread(element)) {
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
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("object");
    };
    _MacroContext_prototype.pairs = function (node) {
      var _arr, _arr2, _i, _len, array, pair;
      node = this.real(node);
      if (this.isTypeObject(node)) {
        return node.pairs;
      } else if (node instanceof LispyNode && node.isInternalCall("object")) {
        for (_arr = [], _arr2 = __toArray(node.args), _i = 1, _len = _arr2.length; _i < _len; ++_i) {
          array = _arr2[_i];
          pair = { key: array.args[0], value: array.args[1] };
          if (array.args[2]) {
            pair.property = array.args[2].constValue();
          }
          _arr.push(pair);
        }
        return _arr;
      }
    };
    _MacroContext_prototype.isBlock = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("block");
    };
    _MacroContext_prototype.nodes = function (node) {
      node = this.real(node);
      if (this.isBlock(node)) {
        return __slice.call(node.args);
      }
    };
    _MacroContext_prototype.array = function (elements) {
      var _this;
      _this = this;
      return LispyNode.InternalCall.apply(LispyNode, ["array", this.index, this.scope()].concat((function () {
        var _arr, _i, _len, element;
        for (_arr = [], _i = 0, _len = elements.length; _i < _len; ++_i) {
          element = elements[_i];
          _arr.push(_this.doWrap(element));
        }
        return _arr;
      }()))).reduce(this.parser);
    };
    _MacroContext_prototype.object = function (pairs, prototype) {
      var _arr, _len, _ref, arrayPairs, i, key, pair, property, value;
      if (prototype == null) {
        prototype = null;
      }
      for (_arr = [], i = 0, _len = pairs.length; i < _len; ++i) {
        pair = pairs[i];
        if (pair instanceof OldNode) {
          if (pair instanceof LispyNode && pair.isInternalCall("array")) {
            if ((_ref = pair.args.length) !== 2 && _ref !== 3) {
              throw Error("Expected object pair #" + i + " to have a length of 2 or 3, got " + pair.args.length);
            }
            if (pair.args.length === 3 && (!(pair.args[2] instanceof Node) || !pair.args[2].isConstType("string"))) {
              throw Error("Expected object pair #" + i + " to have a constant property type, got " + __typeof(pair.args[2]));
            }
            _arr.push(pair);
          } else {
            throw Error("Exected object pair #" + i + " to be an AST Array, got " + __typeof(pair));
          }
        } else if (pair.constructor === Object) {
          key = pair.key;
          value = pair.value;
          property = pair.property;
          _arr.push(LispyNode.InternalCall.apply(LispyNode, [
            "array",
            this.index,
            this.scope(),
            this.doWrap(key),
            this.doWrap(value)
          ].concat(__toArray(property
            ? (typeof property === "string"
              ? [LispyNode.Value(this.index, property)]
              : property instanceof Node && property.isConstType("string") ? [property]
              : __throw(Error("Expected property in object pair #" + i + " to be a string or a Value containing a string, got " + __typeof(property))))
            : []))));
        } else {
          throw Error("Expected object pair #" + i + " to be an AST Array or a literal object, got " + __typeof(pair));
        }
      }
      arrayPairs = _arr;
      return LispyNode.InternalCall.apply(LispyNode, [
        "object",
        this.index,
        this.scope(),
        prototype || NothingNode(this.index, this.scope())
      ].concat(__toArray(arrayPairs))).reduce(this.parser);
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
        return !(node instanceof IdentNode) && !(node instanceof TmpNode);
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
      node = this.real(node);
      return node instanceof LispyNode && node.isIdent && node.name === "this";
    };
    _MacroContext_prototype.isArguments = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isIdent && node.name === "arguments";
    };
    _MacroContext_prototype.isCustom = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("custom");
    };
    _MacroContext_prototype.isAssign = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isAssignCall();
    };
    _MacroContext_prototype.isBinary = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isBinaryCall();
    };
    _MacroContext_prototype.isUnary = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isUnaryCall();
    };
    _MacroContext_prototype.op = function (node) {
      node = this.real(node);
      if (this.isAssign(node)) {
        return node.op;
      } else if (node instanceof LispyNode && node.isCall && node.func.isSymbol && node.func.isOperator) {
        return node.func.name;
      }
    };
    _MacroContext_prototype.left = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isBinaryCall()) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.right = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isBinaryCall()) {
        return node.args[1];
      }
    };
    _MacroContext_prototype.unaryNode = function (node) {
      node = this.real(node);
      if (this.isUnary(node)) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.isAccess = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("access");
    };
    _MacroContext_prototype.parent = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isInternalCall("access")) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.child = function (node) {
      node = this.real(node);
      if (node instanceof LispyNode && node.isInternalCall("access")) {
        return node.args[1];
      }
    };
    _MacroContext_prototype.isIf = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("if");
    };
    _MacroContext_prototype.test = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("if") && node.args[0];
    };
    _MacroContext_prototype.whenTrue = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("if") && node.args[1];
    };
    _MacroContext_prototype.whenFalse = function (node) {
      node = this.real(node);
      return node instanceof LispyNode && node.isInternalCall("if") && node.args[2];
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
      var setTmp, tmp, type;
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
        setTmp = LispyNode.InternalCall(
          "block",
          this.index,
          this.scope(),
          LispyNode.InternalCall("var", this.index, this.scope(), tmp),
          LispyNode.Call(
            this.index,
            this.scope(),
            LispyNode.Symbol.assign["="](this.index),
            tmp,
            this.doWrap(node)
          )
        );
        return func.call(this, setTmp, tmp, true);
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
                    LispyNode.InternalCall(
                      "access",
                      this.index,
                      this.parser.scope.peek(),
                      setParent,
                      setChild
                    ),
                    LispyNode.InternalCall(
                      "access",
                      this.index,
                      this.parser.scope.peek(),
                      parent,
                      child
                    ),
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
      } else if (node instanceof LispyNode && node.isInternalCall("block")) {
        _every = true;
        for (_arr = __toArray(node.args), _i = _arr.length; _i--; ) {
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
      var _ref, arg;
      if (obj === null || (_ref = typeof obj) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
        return LispyNode.Value(index, obj);
      } else if (obj instanceof RegExp) {
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "RegExp"),
          [
            LispyNode.Value(index, obj.source),
            LispyNode.Value(index, (obj.global ? "g" : "") + (obj.ignoreCase ? "i" : "") + (obj.multiline ? "m" : "") + (obj.sticky ? "y" : ""))
          ]
        );
      } else if (__isArray(obj)) {
        return LispyNode.InternalCall.apply(LispyNode, ["array", index, scope].concat((function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(position, item, index, scope));
          }
          return _arr;
        }())));
      } else if (obj instanceof IdentNode && obj.name.length > 1 && obj.name.charCodeAt(0) === 36) {
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__wrap"),
          [IdentNode(obj.index, scope, obj.name.substring(1))]
        );
      } else if (obj instanceof CallNode && !obj.isNew && !obj.isApply && obj.func instanceof IdentNode && obj.func.name === "$") {
        if (obj.args.length !== 1) {
          throw Error("Can only use $() in an AST if it has one argument.");
        }
        arg = obj.args[0];
        if (arg instanceof LispyNode && arg.isInternalCall("spread")) {
          throw Error("Cannot use ... in $() in an AST.");
        }
        return CallNode(
          obj.index,
          scope,
          IdentNode(obj.index, scope, "__wrap"),
          [arg]
        );
      } else if (obj instanceof LispyNode) {
        switch (obj.nodeType) {
        case "value":
          return CallNode(
            obj.index,
            scope,
            IdentNode(obj.index, scope, "__value"),
            [
              position || LispyNode.Value(obj.index, void 0),
              obj
            ]
          );
        case "symbol":
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
        case "call":
          if (obj.isInternalCall("macroConst")) {
            return CallNode(
              obj.index,
              scope,
              IdentNode(obj.index, scope, "__const"),
              obj.args
            );
          } else {
            return CallNode(
              obj.index,
              scope,
              IdentNode(obj.index, scope, "__call"),
              [
                position || LispyNode.Value(obj.index, void 0),
                constifyObject(position, obj.func, index, scope)
              ].concat((function () {
                var _arr, _arr2, _i, _len, arg;
                for (_arr = [], _arr2 = __toArray(obj.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                  arg = _arr2[_i];
                  _arr.push(constifyObject(position, arg, index, scope));
                }
                return _arr;
              }()))
            );
          }
        default: throw Error("Unhandled value in switch");
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
        return LispyNode.InternalCall.apply(LispyNode, [
          "object",
          index,
          scope,
          NothingNode(index, scope)
        ].concat((function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push(LispyNode.InternalCall(
                "array",
                index,
                scope,
                LispyNode.Value(index, k),
                constifyObject(position, v, index, scope)
              ));
            }
          }
          return _arr;
        }())));
      } else {
        throw Error("Trying to constify a " + __typeof(obj));
      }
    }
    MacroContext.constifyObject = constifyObject;
    _MacroContext_prototype.wrap = function (value) {
      var _ref;
      if (__isArray(value)) {
        return LispyNode.InternalCall.apply(LispyNode, ["block", this.index, this.scope()].concat(__toArray(value))).reduce(this.parser);
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
      case "operator": return LispyNode.Symbol[args[0]][args[1]](index);
      default: throw Error("Unhandled value in switch");
      }
    };
    _MacroContext_prototype.makeLispyCall = function (fromPosition, func) {
      var args, index;
      args = __slice.call(arguments, 2);
      if (fromPosition && typeof fromPosition.index === "number") {
        index = fromPosition.index;
      } else {
        index = this.index;
      }
      return LispyNode.Call.apply(LispyNode, [index, this.scope(), func].concat(__toArray(args)));
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
        return LispyNode.InternalCall.apply(LispyNode, ["array", 0, this.scope()].concat((function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(toLiteralNode.call(_this, item));
          }
          return _arr;
        }())));
      } else if (obj.constructor === Object) {
        return LispyNode.InternalCall.apply(LispyNode, [
          "object",
          0,
          this.scope(),
          NothingNode(0, this.scope())
        ].concat((function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push(LispyNode.InternalCall(
                "array",
                0,
                _this.scope(),
                toLiteralNode.call(_this, k),
                toLiteralNode.call(_this, v)
              ));
            }
          }
          return _arr;
        }())));
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
      if ((!(node instanceof LispyNode) || !node.isInternalCall("block")) && (_ref = func.call(this, node)) != null) {
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
