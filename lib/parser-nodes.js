(function () {
  "use strict";
  var __async, __create, __isArray, __keys, __once, __owns, __slice, __toArray,
      __typeof, _ref, FunctionNode, inspect, isPrimordial, MacroAccessNode, map,
      mapAsync, Node, nodeToType, ParamNode, quote, Type, TypeObjectNode;
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
    var i, item, LispyNode;
    if (array.length === 0) {
      return array;
    } else {
      array = array.slice();
      LispyNode = require("./parser-lispynodes");
      for (i = array.length; i--; ) {
        item = array[i];
        if (!item || item instanceof LispyNode && item.isSymbol && item.isInternal && item.isNothing || item.length === 0) {
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
      if (!label) {
        return this;
      } else {
        LispyNode = require("./parser-lispynodes");
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
      throw Error("Not a const: " + (typeof this === "undefined" ? "Undefined" : __typeof(this)));
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
      var innerScope, LispyNode, result;
      if (this.isStatement()) {
        innerScope = parser.pushScope(true, this.scope);
        LispyNode = require("./parser-lispynodes");
        result = LispyNode.Call(this.index, this.scope, FunctionNode(
          this.index,
          this.scope,
          [],
          this.rescope(innerScope),
          true,
          true
        ));
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
    var _arr, _i, _len, _some, arg, args, d, found, hasLarge, LispyNode, part,
        parts;
    args = __slice.call(arguments, 3);
    if (depth != null) {
      d = depth - 1;
    } else {
      d = null;
    }
    found = false;
    LispyNode = require("./parser-lispynodes");
    for (_i = args.length; _i--; ) {
      arg = args[_i];
      if (!arg || arg instanceof LispyNode && arg.isSymbol && arg.isInternal && arg.isNothing || __isArray(arg) && arg.length === 0) {
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
      return [this.params, this.body, this.autoReturn].concat(simplifyArray([
        this.bound,
        this.curry,
        this.asType,
        this.generator,
        this.generic
      ]));
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
      var asType, body, bound, generic, params;
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
      generic = map(this.generic, f, context);
      if (params !== this.params || body !== this.body || bound !== this.bound || asType !== this.asType || generic !== this.generic) {
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
          generic
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
              var _once3;
              return mapAsync(_this.generic, f, context, (_once3 = false, function (_e3, generic) {
                if (_once3) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once3 = true;
                }
                if (_e3 != null) {
                  return callback(_e3);
                }
                return callback(null, params !== _this.params || body !== _this.body || bound !== _this.bound || asType !== _this.asType || generic !== _this.generic
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
                    generic
                  )
                  : _this);
              }));
            });
          });
        }));
      }));
    };
    return FunctionNode;
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
  module.exports = Node;
}.call(this));
