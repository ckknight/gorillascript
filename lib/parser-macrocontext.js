(function () {
  "use strict";
  var __create, __isArray, __owns, __slice, __throw, __toArray, __typeof, _ref,
      addParamToScope, Cache, Ident, isPrimordial, MacroContext, nodeToType,
      ParserNode, Scope, Symbol, Tmp, Type, Value;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __throw = function (x) {
    throw x;
  };
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
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
  ParserNode = require("./parser-nodes");
  Type = require("./types");
  Scope = require("./parser-scope");
  _ref = require("./parser-utils");
  nodeToType = _ref.nodeToType;
  addParamToScope = _ref.addParamToScope;
  _ref = require("./utils");
  Cache = _ref.Cache;
  isPrimordial = _ref.isPrimordial;
  Symbol = ParserNode.Symbol;
  Value = ParserNode.Value;
  Tmp = Symbol.tmp;
  Ident = Symbol.ident;
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
    _MacroContext_prototype.error = function (message, node) {
      if (node == null) {
        node = null;
      }
      throw this.parser.buildError(message, node || this.index);
    };
    _MacroContext_prototype.isNode = function (node) {
      return node instanceof ParserNode;
    };
    _MacroContext_prototype["const"] = function (value) {
      var _ref;
      if (value != null && !((_ref = typeof value) === "string" || _ref === "number" || _ref === "boolean")) {
        throw new TypeError("Expected value to be null, undefined, a String, Number, or Boolean. Got " + __typeof(value));
      }
      return Value(this.index, value);
    };
    _MacroContext_prototype.ident = function (name) {
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (require("./jsutils").isAcceptableIdent(name, true)) {
        return Ident(this.index, this.scope(), name);
      }
    };
    _MacroContext_prototype.tmp = function (name, save) {
      var tmp;
      if (name == null) {
        name = "ref";
      }
      if (save == null) {
        save = false;
      }
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      tmp = this.parser.makeTmp(this.index, name);
      (save ? this.savedTmps : this.unsavedTmps).push(tmp.id);
      return tmp;
    };
    _MacroContext_prototype.internal = function (name) {
      var factory;
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(Symbol, name)) {
        factory = Symbol[name];
      }
      if (typeof factory !== "function") {
        throw new Error("Unknown internal symbol '" + name + "'");
      }
      return factory(this.index);
    };
    _MacroContext_prototype.assignOperator = function (name) {
      var _ref, factory;
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(_ref = Symbol.assign, name)) {
        factory = _ref[name];
      }
      if (typeof factory !== "function") {
        throw new Error("Unknown assign operator '" + name + "'");
      }
      return factory(this.index);
    };
    _MacroContext_prototype.binaryOperator = function (name) {
      var _ref, factory;
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(_ref = Symbol.binary, name)) {
        factory = _ref[name];
      }
      if (typeof factory !== "function") {
        throw new Error("Unknown binary operator '" + name + "'");
      }
      return factory(this.index);
    };
    _MacroContext_prototype.unaryOperator = function (name) {
      var _ref, factory;
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(_ref = Symbol.unary, name)) {
        factory = _ref[name];
      }
      if (typeof factory !== "function") {
        throw new Error("Unknown unary operator '" + name + "'");
      }
      return factory(this.index);
    };
    _MacroContext_prototype.call = function (func) {
      var _len, arg, args, i, scope;
      args = __slice.call(arguments, 1);
      if (!(func instanceof ParserNode)) {
        throw new TypeError("Expected func to be a Node, got " + __typeof(func));
      }
      if (args.length === 1 && __isArray(args[0])) {
        args = args[0];
      }
      scope = func.scope;
      for (i = 0, _len = args.length; i < _len; ++i) {
        arg = args[i];
        if (!(arg instanceof ParserNode)) {
          throw new TypeError("Expected args[" + i + "] to be a Node, got " + __typeof(arg));
        }
        if (!scope) {
          scope = arg.scope;
        }
      }
      return ParserNode.Call.apply(ParserNode, [func.index, scope || this.scope(), func].concat(args)).reduce(this.parser);
    };
    _MacroContext_prototype.internalCall = function (name) {
      var args;
      args = __slice.call(arguments, 1);
      return this.call.apply(this, [this.internal(name)].concat(args));
    };
    _MacroContext_prototype.mutateLast = function (node, mutator, includeNoop) {
      if (node == null) {
        node = Symbol.nothing(this.index);
      } else if (!(node instanceof ParserNode)) {
        throw new TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (typeof mutator !== "function") {
        throw new TypeError("Expected mutator to be a Function, got " + __typeof(mutator));
      }
      return node.mutateLast(this.parser, mutator, this, includeNoop);
    };
    _MacroContext_prototype.isPrimordial = function (node) {
      if (typeof node === "string") {
        return isPrimordial(node);
      } else if (node instanceof Ident) {
        return node.isPrimordial();
      } else {
        throw new TypeError("Expected a String or Ident, got " + __typeof(node));
      }
    };
    _MacroContext_prototype.func = function (params, body, bound, asType, isGenerator) {
      var _arr, _arr2, _len, func, i, p, param, scope;
      if (bound == null) {
        bound = false;
      }
      if (isGenerator == null) {
        isGenerator = false;
      }
      if (params instanceof ParserNode) {
        if (params.isInternalCall("array")) {
          params = params.args;
        } else {
          throw new TypeError("Expected params to be an AST array or an Array, got " + __typeof(params));
        }
      } else if (!__isArray(params)) {
        throw new TypeError("Expected params to be an AST array or an Array, got " + __typeof(params));
      }
      scope = this.parser.pushScope(true);
      _arr = [];
      for (_arr2 = __toArray(params), i = 0, _len = _arr2.length; i < _len; ++i) {
        param = _arr2[i];
        if (!(param instanceof ParserNode)) {
          throw new TypeError("Expected params[" + i + "] to be a Node, got " + __typeof(param));
        } else if (!param.isInternalCall("param", "array", "object")) {
          throw new Error("Expected params[" + i + "] to be an internal call to param, array, or object, got " + param.inspect(0));
        }
        p = param.rescope(scope);
        addParamToScope(scope, p);
        _arr.push(p);
      }
      params = _arr;
      if (asType && !(asType instanceof ParserNode)) {
        throw new TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      func = ParserNode.InternalCall(
        "function",
        body.index,
        scope.parent,
        ParserNode.InternalCall.apply(ParserNode, ["array", body.index, scope.parent].concat(__toArray(params))),
        body.rescope(scope),
        bound instanceof ParserNode ? bound : ParserNode.Value(body.index, !!bound),
        asType || ParserNode.Symbol.nothing(body.index),
        isGenerator instanceof Value ? isGenerator : ParserNode.Value(body.index, !!isGenerator)
      ).reduce(this.parser);
      this.parser.popScope();
      return func;
    };
    _MacroContext_prototype.hasFunc = (function () {
      var cache;
      cache = Cache();
      return function (node) {
        var _this, _value;
        _this = this;
        if (node instanceof ParserNode) {
          _value = cache.get(node);
          if (_value === void 0) {
            _value = (function () {
              var expandedNode, FOUND;
              if (node.isInternalCall("function")) {
                return true;
              } else {
                expandedNode = _this.macroExpand1(node);
                if (expandedNode !== node) {
                  return _this.hasFunc(expandedNode);
                } else {
                  FOUND = {};
                  try {
                    node.walk(
                      function (subnode) {
                        if (this.hasFunc(subnode)) {
                          throw FOUND;
                        }
                        return subnode;
                      },
                      _this
                    );
                  } catch (e) {
                    if (e === FOUND) {
                      return true;
                    } else {
                      throw e;
                    }
                  }
                  return false;
                }
              }
            }());
            cache.set(node, _value);
          }
          return _value;
        } else {
          return false;
        }
      };
    }());
    _MacroContext_prototype.getTmps = function () {
      return { unsaved: this.unsavedTmps.slice(), saved: this.savedTmps.slice() };
    };
    _MacroContext_prototype.doWrap = function (node) {
      if (node instanceof ParserNode) {
        return node.doWrap(this.parser);
      } else {
        return node;
      }
    };
    _MacroContext_prototype.scope = function () {
      return this.parser.scope.peek();
    };
    _MacroContext_prototype.line = function (node) {
      var index;
      if (node instanceof ParserNode) {
        index = node.index;
      } else {
        index = this.index;
      }
      return this.parser.getPosition(index).line;
    };
    _MacroContext_prototype.column = function (node) {
      var index;
      if (node instanceof ParserNode) {
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
    _MacroContext_prototype.addVariable = function (ident, isMutable, type) {
      if (!(ident instanceof Ident) && !(ident instanceof Tmp)) {
        throw new TypeError("Expected ident to be an Ident or Tmp, got " + __typeof(ident));
      }
      if (typeof type === "function") {
        type = type.call(this);
      }
      if (isMutable && type && type.isSubsetOf(Type.undefinedOrNull)) {
        type = null;
      }
      return this.scope().add(ident, !!isMutable, type || Type.any);
    };
    _MacroContext_prototype["let"] = function (ident, isMutable, type) {
      if (isMutable == null) {
        isMutable = false;
      }
      if (type == null) {
        type = Type.any;
      }
      if (ident instanceof Ident && isMutable && type.isSubsetOf(Type.undefinedOrNull)) {
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
    _MacroContext_prototype["var"] = function (ident) {
      return ParserNode.InternalCall(
        "var",
        this.index,
        this.scope(),
        ident,
        ParserNode.Value(this.index, this.isVariableMutable(ident))
      );
    };
    _MacroContext_prototype.custom = function (name) {
      var data;
      data = __slice.call(arguments, 1);
      return ParserNode.InternalCall.apply(ParserNode, [
        "custom",
        this.index,
        this.scope(),
        ParserNode.Value(this.index, name)
      ].concat(data)).reduce(this.parser);
    };
    _MacroContext_prototype.noop = function () {
      return ParserNode.Symbol.nothing(this.index);
    };
    _MacroContext_prototype.block = function (nodes) {
      return ParserNode.InternalCall.apply(ParserNode, ["block", this.index, this.scope()].concat(nodes)).reduce(this.parser);
    };
    _MacroContext_prototype["if"] = function (test, whenTrue, whenFalse) {
      if (test == null) {
        test = ParserNode.Symbol.nothing(0);
      }
      if (whenTrue == null) {
        whenTrue = ParserNode.Symbol.nothing(0);
      }
      if (whenFalse == null) {
        whenFalse = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall(
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
        topic = ParserNode.Symbol.nothing(0);
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
      return ParserNode.InternalCall.apply(ParserNode, ["switch", this.index, this.scope()].concat(args)).reduce(this.parser);
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
        body = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall(
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
        object = ParserNode.Symbol.nothing(0);
      }
      if (body == null) {
        body = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall(
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
        tryBody = ParserNode.Symbol.nothing(0);
      }
      if (catchIdent == null) {
        catchIdent = ParserNode.Symbol.nothing(0);
      }
      if (catchBody == null) {
        catchBody = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall(
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
        tryBody = ParserNode.Symbol.nothing(0);
      }
      if (finallyBody == null) {
        finallyBody = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall(
        "tryFinally",
        this.index,
        this.scope(),
        tryBody,
        finallyBody
      ).reduce(this.parser);
    };
    _MacroContext_prototype.assign = function (left, op, right) {
      if (left == null) {
        left = ParserNode.Symbol.nothing(0);
      }
      if (right == null) {
        right = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.Call(
        this.index,
        this.scope(),
        ParserNode.Symbol.assign[op](this.index),
        left,
        this.doWrap(right)
      ).reduce(this.parser);
    };
    _MacroContext_prototype.binary = function (left, op, right) {
      if (left == null) {
        left = ParserNode.Symbol.nothing(0);
      }
      if (right == null) {
        right = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.Call(
        this.index,
        this.scope(),
        ParserNode.Symbol.binary[op](this.index),
        this.doWrap(left),
        this.doWrap(right)
      ).reduce(this.parser);
    };
    _MacroContext_prototype.binaryChain = function (op, nodes) {
      var _i, _len, left, result, right;
      if (nodes.length === 0) {
        throw new Error("Expected nodes to at least have a length of 1");
      }
      left = this.doWrap(nodes[0]);
      for (_i = 1, _len = nodes.length; _i < _len; ++_i) {
        right = nodes[_i];
        left = ParserNode.Call(
          this.index,
          this.scope(),
          ParserNode.Symbol.binary[op](this.index),
          left,
          this.doWrap(right)
        );
      }
      result = left;
      return result.reduce(this.parser);
    };
    _MacroContext_prototype.unary = function (op, node) {
      if (node == null) {
        node = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.Call(this.index, this.scope(), ParserNode.Symbol.unary[op](this.index), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["throw"] = function (node) {
      if (node == null) {
        node = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall("throw", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["return"] = function (node) {
      if (node == null) {
        node = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall("return", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["yield"] = function (node) {
      if (node == null) {
        node = ParserNode.Symbol.nothing(0);
      }
      return ParserNode.InternalCall("yield", this.index, this.scope(), this.doWrap(node)).reduce(this.parser);
    };
    _MacroContext_prototype["debugger"] = function () {
      return ParserNode.InternalCall("debugger", this.index, this.scope());
    };
    _MacroContext_prototype["break"] = function (label) {
      if (label == null) {
        label = null;
      }
      return ParserNode.InternalCall.apply(ParserNode, ["break", this.index, this.scope()].concat(label ? [label] : []));
    };
    _MacroContext_prototype["continue"] = function (label) {
      if (label == null) {
        label = null;
      }
      return ParserNode.InternalCall.apply(ParserNode, ["continue", this.index, this.scope()].concat(label ? [label] : []));
    };
    _MacroContext_prototype.spread = function (node) {
      return ParserNode.InternalCall("spread", this.index, this.scope(), node);
    };
    _MacroContext_prototype.real = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof ParserNode && node.isInternalCall("tmpWrapper")) {
        return node.args[0];
      } else {
        return node;
      }
    };
    _MacroContext_prototype.rewrap = function (newNode, oldNode) {
      if (newNode instanceof ParserNode) {
        if (!(oldNode instanceof ParserNode)) {
          throw new TypeError("Expected oldNode to be a ParserNode, got " + __typeof(oldNode));
        }
        oldNode = this.macroExpand1(oldNode);
        if (oldNode.isInternalCall("tmpWrapper")) {
          if (newNode.isInternalCall("tmpWrapper")) {
            return ParserNode.InternalCall.apply(ParserNode, ["tmpWrapper", newNode.index, newNode.scope, newNode.args[0]].concat(
              __toArray(__slice.call(oldNode.args, 1)),
              __toArray(__slice.call(newNode.args, 1))
            ));
          } else {
            return ParserNode.InternalCall.apply(ParserNode, ["tmpWrapper", newNode.index, newNode.scope, newNode].concat(__toArray(__slice.call(oldNode.args, 1))));
          }
        } else {
          return newNode;
        }
      } else {
        return newNode;
      }
    };
    _MacroContext_prototype.eq = function (alpha, bravo) {
      alpha = this.real(alpha);
      bravo = this.real(bravo);
      return alpha === bravo || alpha instanceof ParserNode && alpha.equals(bravo);
    };
    _MacroContext_prototype.isLabel = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("label");
    };
    _MacroContext_prototype.isBreak = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("break");
    };
    _MacroContext_prototype.isContinue = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("continue");
    };
    _MacroContext_prototype.isReturn = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("return");
    };
    _MacroContext_prototype.isAutoReturn = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("autoReturn");
    };
    _MacroContext_prototype.autoReturn = function (node) {
      return ParserNode.InternalCall("autoReturn", node.index, node.scope, node);
    };
    _MacroContext_prototype.label = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("break", "continue", "label")) {
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
      if (node instanceof ParserNode) {
        expanded = this.parser.macroExpand1(node);
        if (expanded instanceof ParserNode) {
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
      if (node instanceof ParserNode) {
        expanded = this.parser.macroExpandAll(node);
        if (expanded instanceof ParserNode) {
          return expanded.reduce(this.parser);
        } else {
          return expanded;
        }
      } else {
        return node;
      }
    };
    _MacroContext_prototype.isConst = function (node) {
      return node === void 0 || node instanceof ParserNode && this.real(node).isConst();
    };
    _MacroContext_prototype.value = function (node) {
      var expanded;
      if (node !== void 0 && node instanceof ParserNode) {
        expanded = this.real(node);
        if (expanded.isConst()) {
          return expanded.constValue();
        }
      }
    };
    _MacroContext_prototype.isSpread = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("spread");
    };
    _MacroContext_prototype.spreadSubnode = function (node) {
      node = this.real(node);
      if (this.isSpread(node)) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.isIdent = function (node) {
      return this.real(node) instanceof Ident;
    };
    _MacroContext_prototype.isTmp = function (node) {
      return this.real(node) instanceof Tmp;
    };
    _MacroContext_prototype.isIdentOrTmp = function (node) {
      var _ref;
      return (_ref = this.real(node)) instanceof Ident || _ref instanceof Tmp;
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
    _MacroContext_prototype.isCall = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isCall && !node.isInternalCall();
    };
    _MacroContext_prototype.isContextCall = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("contextCall");
    };
    _MacroContext_prototype.contextCall = function (func, context) {
      var args;
      args = __slice.call(arguments, 2);
      return ParserNode.InternalCall.apply(ParserNode, [
        "contextCall",
        this.index,
        this.scope(),
        func,
        context
      ].concat(args));
    };
    _MacroContext_prototype.isNew = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("new");
    };
    _MacroContext_prototype["new"] = function (func) {
      var args;
      args = __slice.call(arguments, 1);
      return ParserNode.InternalCall.apply(ParserNode, ["new", this.index, this.scope(), func].concat(args));
    };
    _MacroContext_prototype.callFunc = function (node) {
      node = this.real(node);
      if (this.isCall(node)) {
        return node.func;
      }
    };
    _MacroContext_prototype.callArgs = function (node) {
      node = this.real(node);
      if (this.isCall(node)) {
        return node.args;
      }
    };
    _MacroContext_prototype.isSuper = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("super");
    };
    _MacroContext_prototype.superChild = function (node) {
      node = this.real(node);
      if (this.isSuper(node) && !this.isNothing(node.args[0])) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.superArgs = function (node) {
      node = this.real(node);
      if (this.isSuper(node)) {
        return __slice.call(node.args, 1);
      }
    };
    _MacroContext_prototype.isFunc = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("function");
    };
    _MacroContext_prototype.funcBody = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("function")) {
        return node.args[1];
      }
    };
    _MacroContext_prototype.funcParams = function (node) {
      var params;
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("function")) {
        params = node.args[0];
        if (params.isInternalCall("array")) {
          return params.args;
        } else {
          throw new Error("For some reason, func params is not an array");
        }
      }
    };
    _MacroContext_prototype.funcIsBound = function (node) {
      var bound;
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("function")) {
        bound = node.args[2];
        if (bound.isConst()) {
          return bound.constValue();
        } else {
          return false;
        }
      }
    };
    _MacroContext_prototype.funcAsType = function (node) {
      var asType;
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("function")) {
        asType = node.args[3];
        if (!(asType.isSymbol && asType.isInternal && asType.isNothing)) {
          return asType;
        }
      }
    };
    _MacroContext_prototype.funcIsGenerator = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("function")) {
        return node.args[4].constValue();
      }
    };
    _MacroContext_prototype.param = function (ident, defaultValue, spread, isMutable, asType) {
      if (defaultValue == null) {
        defaultValue = null;
      }
      if (spread == null) {
        spread = false;
      }
      if (isMutable == null) {
        isMutable = false;
      }
      if (asType == null) {
        asType = null;
      }
      return ParserNode.InternalCall(
        "param",
        ident.index,
        ident.scope,
        ident,
        defaultValue || ParserNode.Symbol.nothing(ident.index),
        ParserNode.Value(ident.index, spread),
        ParserNode.Value(ident.index, isMutable),
        asType || ParserNode.Symbol.nothing(ident.index)
      ).reduce(this.parser);
    };
    _MacroContext_prototype.isParam = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("param");
    };
    _MacroContext_prototype.paramIdent = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.paramDefaultValue = function (node) {
      var defaultValue;
      node = this.real(node);
      if (this.isParam(node)) {
        defaultValue = node.args[1];
        if (defaultValue.isSymbol && defaultValue.isInternal && defaultValue.isNothing) {
          return null;
        } else {
          return defaultValue;
        }
      }
    };
    _MacroContext_prototype.paramIsSpread = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.args[2].constValue();
      }
    };
    _MacroContext_prototype.paramIsMutable = function (node) {
      node = this.real(node);
      if (this.isParam(node)) {
        return !!node.args[3].constValue();
      }
    };
    _MacroContext_prototype.paramType = function (node) {
      var asType;
      node = this.real(node);
      if (this.isParam(node)) {
        asType = node.args[4];
        if (asType.isSymbol && asType.isInternal && asType.isNothing) {
          return null;
        } else {
          return asType;
        }
      }
    };
    _MacroContext_prototype.isArray = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("array");
    };
    _MacroContext_prototype.elements = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("array")) {
        return node.args;
      }
    };
    _MacroContext_prototype.arrayHasSpread = function (node) {
      var _arr, _i, _len, _some, element;
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("array")) {
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
      return node instanceof ParserNode && node.isInternalCall("object");
    };
    _MacroContext_prototype.pairs = function (node) {
      var _arr, _arr2, _end, _i, _len, array, i, pair;
      node = this.real(node);
      if (node instanceof ParserNode) {
        if (node.isInternalCall("typeObject")) {
          _arr = [];
          for (i = 0, _end = +node.args.length; i < _end; i += 2) {
            _arr.push({ key: node.args[i], value: node.args[i + 1] });
          }
          return _arr;
        } else if (node.isInternalCall("object")) {
          _arr = [];
          for (_arr2 = __toArray(node.args), _i = 1, _len = _arr2.length; _i < _len; ++_i) {
            array = _arr2[_i];
            pair = { key: array.args[0], value: array.args[1] };
            if (array.args[2]) {
              pair.property = array.args[2].constValue();
            }
            _arr.push(pair);
          }
          return _arr;
        }
      }
    };
    _MacroContext_prototype.isBlock = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("block");
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
      return ParserNode.InternalCall.apply(ParserNode, ["array", this.index, this.scope()].concat((function () {
        var _arr, _i, _len, element;
        _arr = [];
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
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
      _arr = [];
      for (i = 0, _len = pairs.length; i < _len; ++i) {
        pair = pairs[i];
        if (pair instanceof ParserNode) {
          if (pair.isInternalCall("array")) {
            if ((_ref = pair.args.length) !== 2 && _ref !== 3) {
              throw new Error("Expected object pair #" + i + " to have a length of 2 or 3, got " + pair.args.length);
            }
            if (pair.args.length === 3 && !pair.args[2].isConstType("string")) {
              throw new Error("Expected object pair #" + i + " to have a constant property type, got " + __typeof(pair.args[2]));
            }
            _arr.push(pair);
          } else {
            throw new Error("Exected object pair #" + i + " to be an AST Array, got " + __typeof(pair));
          }
        } else if (pair.constructor === Object) {
          key = pair.key;
          value = pair.value;
          property = pair.property;
          _arr.push(ParserNode.InternalCall.apply(ParserNode, [
            "array",
            this.index,
            this.scope(),
            this.doWrap(key),
            this.doWrap(value)
          ].concat(__toArray(property
            ? (typeof property === "string"
              ? [ParserNode.Value(this.index, property)]
              : property instanceof ParserNode && property.isConstType("string") ? [property]
              : __throw(new Error("Expected property in object pair #" + i + " to be a string or a Value containing a string, got " + __typeof(property))))
            : []))));
        } else {
          throw new Error("Expected object pair #" + i + " to be an AST Array or a literal object, got " + __typeof(pair));
        }
      }
      arrayPairs = _arr;
      return ParserNode.InternalCall.apply(ParserNode, ["object", this.index, this.scope(), prototype || ParserNode.Symbol.nothing(this.index)].concat(arrayPairs)).reduce(this.parser);
    };
    _MacroContext_prototype.type = function (node) {
      if (typeof node === "string") {
        return __owns.call(Type, node) && Type[node] || __throw(new Error("Unknown type " + node));
      } else if (node instanceof ParserNode) {
        return node.type(this.parser);
      } else {
        throw new Error("Can only retrieve type from a String or ParserNode, got " + __typeof(node));
      }
    };
    _MacroContext_prototype.toType = nodeToType;
    _MacroContext_prototype.isComplex = function (node) {
      node = this.real(node);
      if (node == null) {
        return false;
      } else if (node instanceof ParserNode) {
        return node.cacheable;
      } else {
        return true;
      }
    };
    _MacroContext_prototype.isNoop = function (node) {
      node = this.real(node);
      return node.isNoop(this.parser);
    };
    _MacroContext_prototype.isNothing = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isSymbol && node.isInternal && node.isNothing;
    };
    _MacroContext_prototype.isTypeArray = function (node) {
      var basetype;
      if (this.isTypeGeneric(node)) {
        basetype = this.basetype(node);
        return basetype instanceof Ident && basetype.name === "Array";
      }
    };
    _MacroContext_prototype.subtype = function (node) {
      if (this.isTypeArray(node)) {
        return this.typeArguments(node)[0];
      }
    };
    _MacroContext_prototype.isTypeGeneric = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("typeGeneric");
    };
    _MacroContext_prototype.basetype = function (node) {
      node = this.real(node);
      if (this.isTypeGeneric(node)) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.typeArguments = function (node) {
      node = this.real(node);
      if (this.isTypeGeneric(node)) {
        return __slice.call(node.args, 1);
      }
    };
    _MacroContext_prototype.isTypeObject = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("typeObject");
    };
    _MacroContext_prototype.isTypeUnion = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("typeUnion");
    };
    _MacroContext_prototype.types = function (node) {
      node = this.real(node);
      return this.isTypeUnion(node) && node.args;
    };
    _MacroContext_prototype.isThis = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isIdent && node.name === "this";
    };
    _MacroContext_prototype.isArguments = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isIdent && node.name === "arguments";
    };
    _MacroContext_prototype.isCustom = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("custom");
    };
    _MacroContext_prototype.isAssign = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isAssignCall();
    };
    _MacroContext_prototype.isBinary = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isBinaryCall();
    };
    _MacroContext_prototype.isUnary = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isUnaryCall();
    };
    _MacroContext_prototype.op = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isCall && node.func.isSymbol && node.func.isOperator) {
        return node.func.name;
      }
    };
    _MacroContext_prototype.left = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && (node.isBinaryCall() || node.isAssignCall())) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.right = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && (node.isBinaryCall() || node.isAssignCall())) {
        return node.args[1];
      }
    };
    _MacroContext_prototype.unaryNode = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isUnaryCall()) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.isAccess = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("access");
    };
    _MacroContext_prototype.parent = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("access")) {
        return node.args[0];
      }
    };
    _MacroContext_prototype.child = function (node) {
      node = this.real(node);
      if (node instanceof ParserNode && node.isInternalCall("access")) {
        return node.args[1];
      }
    };
    _MacroContext_prototype.isIf = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("if");
    };
    _MacroContext_prototype.test = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("if") && node.args[0];
    };
    _MacroContext_prototype.whenTrue = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("if") && node.args[1];
    };
    _MacroContext_prototype.whenFalse = function (node) {
      node = this.real(node);
      return node instanceof ParserNode && node.isInternalCall("if") && node.args[2];
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
        setTmp = ParserNode.InternalCall(
          "block",
          this.index,
          this.scope(),
          ParserNode.InternalCall("var", this.index, this.scope(), tmp),
          ParserNode.Call(
            this.index,
            this.scope(),
            ParserNode.Symbol.assign["="](this.index),
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
                    ParserNode.InternalCall(
                      "access",
                      this.index,
                      this.parser.scope.peek(),
                      setParent,
                      setChild
                    ),
                    ParserNode.InternalCall(
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
      } else if (node instanceof ParserNode) {
        if (node.isInternalCall("block")) {
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
          return this.isNothing(node);
        }
      } else {
        return false;
      }
    };
    function constifyObject(position, obj, index, scope) {
      var _ref, arg;
      if (obj === null || (_ref = typeof obj) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
        return ParserNode.Value(index, obj);
      } else if (obj instanceof RegExp) {
        return ParserNode.InternalCall(
          "new",
          obj.index,
          scope,
          Ident(obj.index, scope, "RegExp"),
          ParserNode.Value(index, obj.source),
          ParserNode.Value(index, (obj.global ? "g" : "") + (obj.ignoreCase ? "i" : "") + (obj.multiline ? "m" : "") + (obj.sticky ? "y" : ""))
        );
      } else if (__isArray(obj)) {
        return ParserNode.InternalCall.apply(ParserNode, ["array", index, scope].concat((function () {
          var _arr, _arr2, _i, _len, item;
          _arr = [];
          for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(position, item, index, scope));
          }
          return _arr;
        }())));
      } else if (obj instanceof ParserNode) {
        switch (obj.nodeTypeId) {
        case 0:
          return ParserNode.Call(
            obj.index,
            scope,
            Ident(obj.index, scope, "__value"),
            position || ParserNode.Value(obj.index, void 0),
            obj
          );
        case 1:
          if (obj.isIdent && obj.name.length > 1 && obj.name.charCodeAt(0) === 36) {
            return ParserNode.Call(
              obj.index,
              scope,
              Ident(obj.index, scope, "__wrap"),
              Ident(obj.index, scope, obj.name.substring(1))
            );
          } else {
            return ParserNode.Call.apply(ParserNode, [
              obj.index,
              scope,
              Ident(obj.index, scope, "__symbol"),
              position || ParserNode.Value(obj.index, void 0)
            ].concat((function () {
              switch (obj.symbolTypeId) {
              case 1:
                return [
                  ParserNode.Value(obj.index, "ident"),
                  ParserNode.Value(obj.index, obj.name)
                ];
              case 2:
                return [
                  ParserNode.Value(obj.index, "tmp"),
                  ParserNode.Value(obj.index, obj.id),
                  ParserNode.Value(obj.index, obj.name)
                ];
              case 0:
                return [
                  ParserNode.Value(obj.index, "internal"),
                  ParserNode.Value(obj.index, obj.name)
                ];
              case 3:
                return [
                  ParserNode.Value(obj.index, "operator"),
                  ParserNode.Value(obj.index, obj.operatorType),
                  ParserNode.Value(obj.index, obj.name)
                ];
              default: throw new Error("Unhandled value in switch");
              }
            }())));
          }
        case 2:
          if (obj.isInternalCall("macroConst")) {
            return ParserNode.Call(
              obj.index,
              scope,
              Ident(obj.index, scope, "__const"),
              obj.args[0]
            );
          } else if (obj.func instanceof Ident && obj.func.name === "$") {
            if (obj.args.length !== 1) {
              throw new Error("Can only use $() in an AST if it has one argument.");
            }
            arg = obj.args[0];
            if (arg.isInternalCall("spread")) {
              throw new Error("Cannot use ... in $() in an AST.");
            }
            return ParserNode.Call(
              obj.index,
              scope,
              Ident(obj.index, scope, "__wrap"),
              arg
            );
          } else {
            return ParserNode.Call.apply(ParserNode, [
              obj.index,
              scope,
              Ident(obj.index, scope, "__call"),
              position || ParserNode.Value(obj.index, void 0),
              constifyObject(position, obj.func, index, scope)
            ].concat((function () {
              var _arr, _arr2, _i, _len, arg;
              _arr = [];
              for (_arr2 = __toArray(obj.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                arg = _arr2[_i];
                _arr.push(constifyObject(position, arg, index, scope));
              }
              return _arr;
            }())));
          }
        case 3:
          return ParserNode.Call(
            obj.index,
            scope,
            Ident(obj.index, scope, "__macro"),
            position || ParserNode.Value(obj.index, void 0),
            ParserNode.Value(obj.index, obj.id),
            constifyObject(position, obj.data, obj.index, scope),
            ParserNode.Value(obj.index, obj.inStatement),
            ParserNode.Value(obj.index, obj.inGenerator),
            ParserNode.Value(obj.index, obj.inEvilAst),
            ParserNode.Value(obj.index, obj.doWrapped)
          );
        default: throw new Error("Unhandled value in switch");
        }
      } else if (obj.constructor === Object) {
        return ParserNode.InternalCall.apply(ParserNode, ["object", index, scope, ParserNode.Symbol.nothing(index)].concat((function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push(ParserNode.InternalCall(
                "array",
                index,
                scope,
                ParserNode.Value(index, k),
                constifyObject(position, v, index, scope)
              ));
            }
          }
          return _arr;
        }())));
      } else {
        throw new Error("Trying to constify a " + __typeof(obj));
      }
    }
    MacroContext.constifyObject = constifyObject;
    _MacroContext_prototype.wrap = function (value) {
      var _ref;
      if (value == null) {
        return ParserNode.Symbol.nothing(this.index);
      } else if ((_ref = typeof value) === "string" || _ref === "boolean" || _ref === "number") {
        return ParserNode.Value(this.index, value);
      } else if (value instanceof ParserNode) {
        return value;
      } else if (__isArray(value)) {
        return ParserNode.InternalCall.apply(ParserNode, ["block", this.index, this.scope()].concat(__toArray(value))).reduce(this.parser);
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
      return ParserNode.Value(index, value);
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
      case "internal": return ParserNode.Symbol[args[0]](index);
      case "ident":
        return ParserNode.Symbol.ident(index, this.scope(), args[0]);
      case "tmp":
        return ParserNode.Symbol.tmp(index, this.scope(), args[0], args[1]);
      case "operator": return ParserNode.Symbol[args[0]][args[1]](index);
      default: throw new Error("Unhandled value in switch");
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
      return ParserNode.Call.apply(ParserNode, [index, this.scope(), func].concat(args));
    };
    _MacroContext_prototype.getConstValue = function (name, defaultValue) {
      var c;
      c = this.parser.getConst(name);
      if (!c) {
        if (arguments.length < 2) {
          throw new Error("Unknown const '" + name + "'");
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
        return ParserNode.Value(0, obj);
      } else if (__isArray(obj)) {
        return ParserNode.InternalCall.apply(ParserNode, ["array", 0, this.scope()].concat((function () {
          var _arr, _arr2, _i, _len, item;
          _arr = [];
          for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(toLiteralNode.call(_this, item));
          }
          return _arr;
        }())));
      } else if (obj.constructor === Object) {
        return ParserNode.InternalCall.apply(ParserNode, ["object", 0, this.scope(), ParserNode.Symbol.nothing(0)].concat((function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push(ParserNode.InternalCall(
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
        throw new Error("Cannot convert " + __typeof(obj) + " to a literal node");
      }
    }
    _MacroContext_prototype.getConst = function (name) {
      return toLiteralNode.call(this, this.getConstValue(name));
    };
    _MacroContext_prototype.macro = function (fromPosition, id, data, position, inGenerator, inEvilAst) {
      var index;
      if (fromPosition && typeof fromPosition.index === "number") {
        index = fromPosition.index;
      } else {
        index = this.index;
      }
      return ParserNode.MacroAccess(
        index,
        this.scope(),
        id,
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
      if (!(node instanceof ParserNode)) {
        throw new Error("Unexpected type to walk through: " + __typeof(node));
      }
      if (!node.isInternalCall("block") && (_ref = func.call(this, node)) != null) {
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
    _MacroContext_prototype.isStatement = function (node) {
      node = this.macroExpand1(node);
      return node instanceof ParserNode && node.isStatement();
    };
    _MacroContext_prototype.isType = function (node, name) {
      var type;
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw new Error(name + " is not a known type name");
      }
      return node.type(this.parser).isSubsetOf(type);
    };
    _MacroContext_prototype.hasType = function (node, name) {
      var type;
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw new Error(name + " is not a known type name");
      }
      return node.type(this.parser).overlaps(type);
    };
    return MacroContext;
  }());
  module.exports = MacroContext;
}.call(this));
