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
  _ref = null;
  _ref = require("./utils");
  Cache = _ref.Cache;
  isPrimordial = _ref.isPrimordial;
  _ref = null;
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
    _MacroContext_prototype.noop = function () {
      return ParserNode.Symbol.nothing(this.index);
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
      return ParserNode.Call(func.index, scope || this.scope(), func, args).reduce(this.parser);
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
        ParserNode.InternalCall("array", body.index, scope.parent, params),
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
              var _arr, _i, _len, _some, arg, expandedNode, FOUND;
              if (node.isInternalCall("function")) {
                return true;
              } else if (node.isNormalCall() && node.func.isInternalCall("function")) {
                _some = false;
                for (_arr = __toArray(node.func.args).concat(__toArray(node.args)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  arg = _arr[_i];
                  if (_this.hasFunc(arg)) {
                    _some = true;
                    break;
                  }
                }
                return _some;
              } else if (node.isInternalCall("contextCall") && node.args[0].isInternalCall("function") && node.args[1].isIdent && node.args[1].name === "this") {
                _some = false;
                for (_arr = __toArray(node.args[0].args).concat(__toArray(__slice.call(node.args, 2))), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  arg = _arr[_i];
                  if (_this.hasFunc(arg)) {
                    _some = true;
                    break;
                  }
                }
                return _some;
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
      return this.scope().add(ident, !!isMutable, type);
    };
    _MacroContext_prototype.hasVariable = function (ident) {
      if (ident instanceof Tmp || ident instanceof Ident) {
        return this.scope().has(ident);
      } else {
        return false;
      }
    };
    _MacroContext_prototype.isVariableMutable = function (ident) {
      if (ident instanceof Tmp || ident instanceof Ident) {
        return this.scope().isMutable(ident);
      } else {
        return false;
      }
    };
    _MacroContext_prototype.withLabel = function (node, label) {
      if (label == null) {
        label = null;
      }
      if (node instanceof ParserNode) {
        return node.withLabel(label, this.parser);
      } else {
        return node;
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
      var setTmp, tmp, type;
      if (name == null) {
        name = "ref";
      }
      if (save == null) {
        save = false;
      }
      node = this.macroExpand1(node);
      if (node.cacheable) {
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
            node.doWrap(this.parser)
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
      if (node.isInternalCall("access")) {
        return this.maybeCache(
          node.args[0],
          function (setParent, parent, parentCached) {
            return this.maybeCache(
              node.args[1],
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
    _MacroContext_prototype.isType = function (node, name) {
      var type;
      if (!(node instanceof ParserNode)) {
        return false;
      }
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
      if (!(node instanceof ParserNode)) {
        return false;
      }
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw new Error(name + " is not a known type name");
      }
      return node.type(this.parser).overlaps(type);
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
    _MacroContext_prototype.isNoop = function (node) {
      node = this.real(node);
      return node.isNoop(this.parser);
    };
    _MacroContext_prototype.getConstValue = function (name, defaultValue) {
      var c;
      if (typeof name !== "string") {
        throw new TypeError("Expected name to be a String, got " + __typeof(name));
      }
      c = this.parser.getConst(name);
      if (!c) {
        if (arguments.length < 2) {
          return this.error("Unknown const '" + name + "'");
        } else {
          return defaultValue;
        }
      } else {
        return c.value;
      }
    };
    _MacroContext_prototype.getTmps = function () {
      return { unsaved: this.unsavedTmps.slice(), saved: this.savedTmps.slice() };
    };
    _MacroContext_prototype.scope = function () {
      return this.parser.scope.peek();
    };
    _MacroContext_prototype.real = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof ParserNode && node.isInternalCall("tmpWrapper")) {
        return node.args[0];
      } else {
        return node;
      }
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
        return ParserNode.InternalCall("array", index, scope, (function () {
          var _arr, _arr2, _i, _len, item;
          _arr = [];
          for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(position, item, index, scope));
          }
          return _arr;
        }()));
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
            return ParserNode.Call(
              obj.index,
              scope,
              Ident(obj.index, scope, "__symbol"),
              [
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
              }()))
            );
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
            return ParserNode.Call(
              obj.index,
              scope,
              Ident(obj.index, scope, "__call"),
              [
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
              }()))
            );
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
        return ParserNode.InternalCall("object", index, scope, [ParserNode.Symbol.nothing(index)].concat((function () {
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
        return ParserNode.InternalCall("block", this.index, this.scope(), value).reduce(this.parser);
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
      return ParserNode.Call(index, this.scope(), func, args);
    };
    function toLiteralNode(obj) {
      var _ref, _this;
      _this = this;
      if (obj === null || (_ref = typeof obj) === "undefined" || _ref === "boolean" || _ref === "number" || _ref === "string") {
        return ParserNode.Value(0, obj);
      } else if (__isArray(obj)) {
        return ParserNode.InternalCall("array", 0, this.scope(), (function () {
          var _arr, _arr2, _i, _len, item;
          _arr = [];
          for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(toLiteralNode.call(_this, item));
          }
          return _arr;
        }()));
      } else if (obj.constructor === Object) {
        return ParserNode.InternalCall("object", 0, this.scope(), [ParserNode.Symbol.nothing(0)].concat((function () {
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
    return MacroContext;
  }());
  module.exports = MacroContext;
}.call(this));
