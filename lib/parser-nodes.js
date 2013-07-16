(function (GLOBAL) {
  "use strict";
  var __async, __create, __in, __is, __isArray, __keys, __name, __once, __owns,
      __slice, __toArray, __typeof, _ref, Cache, Call, isPrimordial,
      MacroAccess, Node, nodeToType, Symbol, toJSSource, Type, Value;
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw new TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw new TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw new TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
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
  __in = typeof Array.prototype.indexOf === "function"
    ? (function (indexOf) {
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }(Array.prototype.indexOf))
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
  __is = typeof Object.is === "function" ? Object.is
    : function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
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
  __name = function (func) {
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
  __once = (function () {
    function replacement() {
      throw new Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw new TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
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
  toJSSource = require("./jsutils").toJSSource;
  Type = require("./types");
  _ref = require("./utils");
  Cache = _ref.Cache;
  isPrimordial = _ref.isPrimordial;
  _ref = null;
  nodeToType = require("./parser-utils").nodeToType;
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.substring(1);
  }
  function isPrimitive(value) {
    var _ref;
    return value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined";
  }
  Node = (function () {
    var _Node_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw new Error("Node is not intended to be initialized directly");
    }
    _Node_prototype = Node.prototype;
    Node.displayName = "Node";
    _Node_prototype.isValue = false;
    _Node_prototype.isSymbol = false;
    _Node_prototype.isCall = false;
    _Node_prototype.isMacroAccess = false;
    _Node_prototype.isNoop = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".isNoop()");
    };
    _Node_prototype.isConst = function () {
      return false;
    };
    _Node_prototype.constValue = function () {
      throw new Error("Not a const: " + (typeof this === "undefined" ? "Undefined" : __typeof(this)));
    };
    _Node_prototype.isConstValue = function () {
      return false;
    };
    _Node_prototype.isConstType = function () {
      return false;
    };
    _Node_prototype.isConstTruthy = function () {
      return false;
    };
    _Node_prototype.isConstFalsy = function () {
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
    _Node_prototype.walkWithThis = function (f, context) {
      var _ref;
      if ((_ref = f.call(context, this)) != null) {
        return _ref;
      } else {
        return this.walk(f, context);
      }
    };
    _Node_prototype.walkWithThisAsync = function (f, context, callback) {
      var _this;
      _this = this;
      f.call(context, function (err, value) {
        if (err) {
          callback(err);
        } else if (value != null) {
          callback(null, value);
        } else {
          _this.walkAsync(f, context, callback);
        }
      });
    };
    _Node_prototype.isInternalCall = function () {
      return false;
    };
    _Node_prototype.isUnaryCall = function () {
      return false;
    };
    _Node_prototype.isBinaryCall = function () {
      return false;
    };
    _Node_prototype.isAssignCall = function () {
      return false;
    };
    _Node_prototype.isNormalCall = function () {
      return false;
    };
    _Node_prototype.doWrapArgs = true;
    _Node_prototype.convertNothing = function () {
      return this;
    };
    _Node_prototype.returnType = function (parser, isLast) {
      if (isLast) {
        return Type["undefined"];
      } else {
        return Type.none;
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
    _Node_prototype.withLabel = function (label) {
      if (!label) {
        return this;
      } else {
        return InternalCall(
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
    return Node;
  }());
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
    _Value_prototype.nodeTypeId = 0;
    _Value_prototype.cacheable = false;
    _Value_prototype.reduce = function () {
      return this;
    };
    _Value_prototype.isNoop = function () {
      return true;
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
    _Value_prototype.isConstTruthy = function () {
      return !!this.value;
    };
    _Value_prototype.isConstFalsy = function () {
      return !this.value;
    };
    _Value_prototype.equals = function (other) {
      return other === this || other instanceof Value && __is(this.value, other.value);
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
        default: throw new Error("Unhandled value in switch");
        }
      }
    };
    _Value_prototype.inspect = function () {
      return "Value(" + toJSSource(this.value) + ")";
    };
    _Value_prototype.toString = function () {
      var value;
      value = this.value;
      if (value !== value) {
        return "NaN";
      } else {
        switch (value) {
        case void 0: return "void";
        case null: return "null";
        case 1/0: return "Infinity";
        case -1/0: return "-Infinity";
        default: return toJSSource(value);
        }
      }
    };
    return Value;
  }(Node));
  Symbol = (function (Node) {
    var _Node_prototype, _Symbol_prototype, Ident, Internal, Operator, Tmp;
    function Symbol() {
      var _this;
      _this = this instanceof Symbol ? this : __create(_Symbol_prototype);
      throw new Error("Symbol is not intended to be instantiated directly");
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
    _Symbol_prototype.nodeTypeId = 1;
    _Symbol_prototype.isNoop = function () {
      return true;
    };
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
        throw new Error("Internal is not intended to be instantiated directly");
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
      _Internal_prototype.toString = function () {
        return this.name + "!";
      };
      _Internal_prototype.isInternal = true;
      _Internal_prototype.symbolType = "internal";
      _Internal_prototype.symbolTypeId = 0;
      _Internal_prototype.isGoto = false;
      _Internal_prototype.usedAsStatement = false;
      internalSymbols = {
        access: {
          internalId: 0,
          validateArgs: function (parent, child) {
            var rest;
            rest = __slice.call(arguments, 2);
          },
          _toString: function (call) {
            var key, sb;
            sb = [];
            sb.push(call.args[0]);
            key = call.args[1];
            if (key.isConstType("string") && /^[\w\$_][\w\d\$_]*$/.test(key.constValue())) {
              sb.push(".");
              sb.push(key.constValue());
            } else {
              sb.push("[");
              sb.push(key);
              sb.push("]");
            }
            return sb.join("");
          },
          _type: (function () {
            var cache, PRIMORDIAL_INSTANCE_PROPERTIES,
                PRIMORDIAL_STATIC_PROPERTIES;
            PRIMORDIAL_STATIC_PROPERTIES = {
              Object: {
                getPrototypeOf: Type.object["function"]().union(Type["undefined"]),
                getOwnPropertyDescriptor: Type.object["function"]().union(Type["undefined"]),
                getOwnPropertyNames: Type.string.array()["function"]().union(Type["undefined"]),
                create: Type.object["function"]().union(Type["undefined"]),
                defineProperty: Type.object["function"]().union(Type["undefined"]),
                defineProperties: Type.object["function"]().union(Type["undefined"]),
                seal: Type.object["function"]().union(Type["undefined"]),
                freeze: Type.object["function"]().union(Type["undefined"]),
                preventExtensions: Type.object["function"]().union(Type["undefined"]),
                isSealed: Type.boolean["function"]().union(Type["undefined"]),
                isFrozen: Type.boolean["function"]().union(Type["undefined"]),
                isExtensible: Type.boolean["function"]().union(Type["undefined"]),
                keys: Type.string.array()["function"]().union(Type["undefined"])
              },
              String: { fromCharCode: Type.string["function"]() },
              Number: { isFinite: Type.boolean["function"]().union(Type["undefined"]), isNaN: Type.boolean["function"]().union(Type["undefined"]) },
              Array: { isArray: Type.boolean["function"]().union(Type["undefined"]) },
              Math: {
                abs: Type.number["function"](),
                acos: Type.number["function"](),
                asin: Type.number["function"](),
                atan: Type.number["function"](),
                atan2: Type.number["function"](),
                ceil: Type.number["function"](),
                cos: Type.number["function"](),
                exp: Type.number["function"](),
                floor: Type.number["function"](),
                imul: Type.number["function"]().union(Type["undefined"]),
                log: Type.number["function"](),
                max: Type.number["function"](),
                min: Type.number["function"](),
                pow: Type.number["function"](),
                random: Type.number["function"](),
                round: Type.number["function"](),
                sin: Type.number["function"](),
                sqrt: Type.number["function"](),
                tan: Type.number["function"]()
              },
              JSON: { stringify: Type.string.union(Type["undefined"])["function"]().union(Type["undefined"]), parse: Type.string.union(Type.number).union(Type.boolean).union(Type["null"]).union(Type.array).union(Type.object)["function"]().union(Type["undefined"]) },
              Date: { UTC: Type.number["function"]().union(Type["undefined"]), now: Type.number["function"]().union(Type["undefined"]) }
            };
            PRIMORDIAL_INSTANCE_PROPERTIES = {
              Object: { toString: Type.string["function"](), toLocaleString: Type.string["function"]() },
              String: {
                valueOf: Type.string["function"](),
                charAt: Type.string["function"](),
                charCodeAt: Type.number["function"](),
                concat: Type.string["function"](),
                indexOf: Type.number["function"](),
                lastIndexOf: Type.number["function"](),
                localeCompare: Type.number["function"](),
                match: Type.array.union(Type["null"])["function"](),
                replace: Type.string["function"](),
                search: Type.number["function"](),
                slice: Type.string["function"](),
                split: Type.string.array()["function"](),
                substring: Type.string["function"](),
                toLowerCase: Type.string["function"](),
                toLocaleLowerCase: Type.string["function"](),
                toUpperCase: Type.string["function"](),
                toLocaleUpperCase: Type.string["function"](),
                trim: Type.string["function"](),
                length: Type.number
              },
              Boolean: { valueOf: Type.boolean["function"]() },
              Number: { valueOf: Type.number["function"](), toFixed: Type.string["function"](), toExponential: Type.string["function"](), toPrecision: Type.string["function"]() },
              Array: {
                length: Type.number,
                join: Type.string["function"](),
                pop: Type.any["function"](),
                push: Type.number["function"](),
                concat: Type.array["function"](),
                reverse: Type.array["function"](),
                shift: Type.any["function"](),
                unshift: Type.number["function"](),
                slice: Type.array["function"](),
                splice: Type.array["function"](),
                sort: Type.array["function"](),
                filter: Type.array["function"]().union(Type["undefined"]),
                forEach: Type["undefined"]["function"]().union(Type["undefined"]),
                some: Type.boolean["function"]().union(Type["undefined"]),
                every: Type.boolean["function"]().union(Type["undefined"]),
                map: Type.array["function"]().union(Type["undefined"]),
                indexOf: Type.number["function"](),
                lastIndexOf: Type.number["function"](),
                reduce: Type.any["function"]().union(Type["undefined"]),
                reduceRight: Type.any["function"]().union(Type["undefined"])
              },
              Arguments: { length: Type.number, callee: Type.none, caller: Type.none },
              Date: {
                toDateString: Type.string["function"](),
                toTimeString: Type.string["function"](),
                toLocaleDateString: Type.string["function"](),
                toLocaleTimeString: Type.string["function"](),
                valueOf: Type.number["function"](),
                getTime: Type.number["function"](),
                getFullYear: Type.number["function"](),
                getUTCFullYear: Type.number["function"](),
                getMonth: Type.number["function"](),
                getUTCMonth: Type.number["function"](),
                getDate: Type.number["function"](),
                getUTCDate: Type.number["function"](),
                getDay: Type.number["function"](),
                getUTCDay: Type.number["function"](),
                getHours: Type.number["function"](),
                getUTCHours: Type.number["function"](),
                getMinutes: Type.number["function"](),
                getUTCMinutes: Type.number["function"](),
                getSeconds: Type.number["function"](),
                getUTCSeconds: Type.number["function"](),
                getMilliseconds: Type.number["function"](),
                getUTCMilliseconds: Type.number["function"](),
                getTimezoneOffset: Type.number["function"](),
                setTime: Type.number["function"](),
                setMilliseconds: Type.number["function"](),
                setUTCMilliseconds: Type.number["function"](),
                setSeconds: Type.number["function"](),
                setUTCSeconds: Type.number["function"](),
                setMinutes: Type.number["function"](),
                setUTCMinutes: Type.number["function"](),
                setHours: Type.number["function"](),
                setUTCHours: Type.number["function"](),
                setDate: Type.number["function"](),
                setUTCDate: Type.number["function"](),
                setMonth: Type.number["function"](),
                setUTCMonth: Type.number["function"](),
                setFullYear: Type.number["function"](),
                setUTCFullYear: Type.number["function"](),
                toUTCString: Type.string["function"](),
                toISOString: Type.string["function"](),
                toJSON: Type.string["function"]()
              },
              RegExp: {
                exec: Type.array.union(Type["null"])["function"](),
                test: Type.boolean["function"](),
                global: Type.boolean,
                ignoreCase: Type.boolean,
                multiline: Type.boolean,
                sticky: Type.boolean.union(Type["undefined"])
              },
              Error: { name: Type.string, message: Type.string, stack: Type.any }
            };
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = (function () {
                  var _ref, child, childValue, methodGroup, parent, parentType,
                      propertyTypes, type;
                  _ref = call.args;
                  parent = _ref[0];
                  child = _ref[1];
                  _ref = null;
                  if (parser) {
                    child = parser.macroExpand1(child).reduce(parser);
                  }
                  parentType = parent.type(parser);
                  if (child.isConst()) {
                    childValue = child.constValue();
                    if (parent instanceof Ident && __owns.call(PRIMORDIAL_STATIC_PROPERTIES, parent.name)) {
                      propertyTypes = PRIMORDIAL_STATIC_PROPERTIES[parent.name];
                      if (__owns.call(propertyTypes, childValue)) {
                        return propertyTypes[childValue];
                      }
                    }
                    if (parentType.isSubsetOf(Type.string)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.String;
                    } else if (parentType.isSubsetOf(Type.boolean)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.Boolean;
                    } else if (parentType.isSubsetOf(Type.number)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.Number;
                    } else if (parentType.isSubsetOf(Type.array)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.Array;
                    } else if (parentType.isSubsetOf(Type.date)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.Date;
                    } else if (parentType.isSubsetOf(Type.regexp)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.RegExp;
                    } else if (parentType.isSubsetOf(Type.error)) {
                      methodGroup = PRIMORDIAL_INSTANCE_PROPERTIES.Error;
                    }
                    if (methodGroup && __owns.call(methodGroup, childValue)) {
                      return methodGroup[childValue];
                    }
                    if (__owns.call(PRIMORDIAL_INSTANCE_PROPERTIES.Object, childValue)) {
                      return PRIMORDIAL_INSTANCE_PROPERTIES.Object[childValue];
                    }
                    if (parentType.isSubsetOf(Type.object) && typeof parentType.value === "function") {
                      type = parentType.value(String(child.constValue()));
                      if (type !== Type.any) {
                        return type;
                      }
                    }
                  }
                  if (child.type(parser).isSubsetOf(Type.number)) {
                    if (parentType.isSubsetOf(Type.string)) {
                      return Type.string.union(Type["undefined"]);
                    }
                    if (parentType.subtype && parentType.isSubsetOf(Type.array)) {
                      return parentType.subtype;
                    }
                  }
                  return Type.any;
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          __reduce: function (call, parser) {
            var _arr, _i, _len, _ref, args, cachedParent, child, cValue, end,
                hasEnd, hasStep, inclusive, pair, parent, pValue, start, step,
                value;
            parent = call.args[0];
            cachedParent = null;
            function replaceLengthIdent(node) {
              if (node instanceof Ident && node.name === "__currentArrayLength") {
                if (parent.cacheable && cachedParent == null) {
                  cachedParent = parser.makeTmp(node.index, "ref", parent.type(parser));
                  cachedParent.scope = node.scope;
                }
                return Call(
                  node.index,
                  node.scope,
                  Symbol.access(node.index),
                  cachedParent != null ? cachedParent : parent,
                  Value(node.index, "length")
                );
              } else if (node instanceof Node && node.isInternalCall("access")) {
                return node;
              } else {
                return node.walk(replaceLengthIdent);
              }
            }
            child = replaceLengthIdent(call.args[1].reduce(parser));
            if (cachedParent != null) {
              return Call(
                call.index,
                call.scope,
                Symbol.tmpWrapper(call.index),
                Call(
                  call.index,
                  call.scope,
                  Symbol.access(call.index),
                  Call(
                    call.index,
                    call.scope,
                    Symbol.assign["="](call.index),
                    cachedParent,
                    parent
                  ),
                  child
                ),
                Value(call.index, cachedParent.id)
              );
            }
            if (parent.isLiteral() && child.isConst()) {
              cValue = child.constValue();
              if (parent.isConst()) {
                pValue = parent.constValue();
                if (cValue in Object(pValue)) {
                  value = pValue[cValue];
                  if (value === null || (_ref = typeof value) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
                    return Value(call.index, value);
                  }
                }
              } else if (parent instanceof Node && parent.isInternalCall()) {
                if (parent.func.isArray) {
                  if (cValue === "length") {
                    return Value(this.index, parent.args.length);
                  } else if (typeof cValue === "number") {
                    return parent.args[cValue] || Value(this.index, void 0);
                  }
                } else if (parent.func.isObject) {
                  for (_arr = __toArray(parent.args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
                    pair = _arr[_i];
                    if (pair.args[0].isConstValue(cValue) && !pair.args[2]) {
                      return pair.args[1];
                    }
                  }
                }
              }
            }
            if (child instanceof Call && child.func instanceof Ident && child.func.name === "__range") {
              _ref = child.args;
              start = _ref[0];
              end = _ref[1];
              step = _ref[2];
              inclusive = _ref[3];
              _ref = null;
              hasStep = !step.isConst() || step.constValue() !== 1;
              if (!hasStep) {
                if (inclusive.isConst()) {
                  if (inclusive.constValue()) {
                    if (end.isConst() && typeof end.constValue() === "number") {
                      end = Value(end.index, +end.constValue() + 1 || 1/0);
                    } else {
                      end = Call(
                        end.index,
                        end.scope,
                        Symbol.binary["||"](end.index),
                        Call(
                          end.index,
                          end.scope,
                          Symbol.binary["+"](end.index),
                          end,
                          Value(inclusive.index, 1)
                        ),
                        Value(end.index, 1/0)
                      );
                    }
                  }
                } else {
                  end = Call(
                    end.index,
                    end.scope,
                    Symbol["if"](end.index),
                    inclusive,
                    Call(
                      end.index,
                      end.scope,
                      Symbol.binary["||"](end.index),
                      Call(
                        end.index,
                        end.scope,
                        Symbol.binary["+"](end.index),
                        end,
                        Value(inclusive.index, 1)
                      ),
                      Value(end.index, 1/0)
                    ),
                    end
                  );
                }
              }
              args = [parent];
              hasEnd = !end.isConst() || (_ref = end.constValue()) !== void 0 && _ref !== 1/0;
              if (!start.isConst() || start.constValue() !== 0 || hasEnd || hasStep) {
                args.push(start);
              }
              if (hasEnd || hasStep) {
                args.push(end);
              }
              if (hasStep) {
                args.push(step);
                if (!inclusive.isConst() || inclusive.constValue()) {
                  args.push(inclusive);
                }
              }
              if (hasStep) {
                return Call.apply(void 0, [
                  call.index,
                  call.scope,
                  Ident(call.index, call.scope, "__sliceStep")
                ].concat(args)).reduce(parser);
              } else {
                return Call.apply(void 0, [
                  call.index,
                  call.scope,
                  Symbol.contextCall(call.index),
                  Ident(call.index, call.scope, "__slice")
                ].concat(args)).reduce(parser);
              }
            } else if (child !== call.args[1]) {
              return Call(
                call.index,
                call.scope,
                call.func,
                parent,
                child
              );
            }
          },
          ___reduce: (function () {
            var PURE_PRIMORDIAL_SUBFUNCTIONS;
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
            return function (access, call, parser) {
              var _arr, _i, _len, _ref, arg, child, childValue, constArgs,
                  parent, parentValue, value;
              _ref = access.args;
              parent = _ref[0];
              child = _ref[1];
              _ref = null;
              if (child.isConst()) {
                constArgs = [];
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  arg = _arr[_i];
                  if (arg.isConst()) {
                    constArgs.push(arg.constValue());
                  } else {
                    return;
                  }
                }
                childValue = child.constValue();
                if (parent.isConst()) {
                  parentValue = parent.constValue();
                  if (typeof parentValue[childValue] === "function") {
                    try {
                      value = parentValue[childValue].apply(parentValue, constArgs);
                    } catch (_err) {
                      return;
                    }
                    if (isPrimitive(value)) {
                      return Value(call.index, value);
                    }
                  }
                } else if (parent instanceof Ident && __owns.call(PURE_PRIMORDIAL_SUBFUNCTIONS, parent.name) && __owns.call(PURE_PRIMORDIAL_SUBFUNCTIONS[parent.name], childValue)) {
                  try {
                    value = (_ref = GLOBAL[parent.name])[childValue].apply(_ref, constArgs);
                  } catch (_err) {
                    return;
                  }
                  if (isPrimitive(value)) {
                    return Value(call.index, value);
                  }
                }
              }
            };
          }()),
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[0].isNoop(parser) && call.args[1].isNoop(parser);
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        array: {
          internalId: 1,
          validateArgs: function () {
            var args;
            args = __slice.call(arguments);
          },
          _toString: function (call) {
            var sb;
            sb = [];
            sb.push("[");
            sb.push(call.args.join(", "));
            sb.push("]");
            return sb.join("");
          },
          _type: function () {
            return Type.array;
          },
          _isLiteral: (function () {
            var cache;
            cache = Cache();
            return function (call) {
              var _arr, _every, _i, _len, _value, element;
              _value = cache.get(call);
              if (_value === void 0) {
                _every = true;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  element = _arr[_i];
                  if (!element.isLiteral()) {
                    _every = false;
                    break;
                  }
                }
                _value = _every;
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _literalValue: function (call) {
            var _arr, _arr2, _i, _len, element;
            _arr = [];
            for (_arr2 = __toArray(call.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              element = _arr2[_i];
              _arr.push(element.literalValue());
            }
            return _arr;
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _arr, _every, _i, _len, _value, element;
              _value = cache.get(call);
              if (_value === void 0) {
                _every = true;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  element = _arr[_i];
                  if (!element.isNoop(parser)) {
                    _every = false;
                    break;
                  }
                }
                _value = _every;
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        autoReturn: {
          internalId: 2,
          doWrapArgs: false,
          validateArgs: function (node) {
            var rest;
            rest = __slice.call(arguments, 1);
          },
          isGoto: true,
          usedAsStatement: true,
          _returnType: function (call, parser, isLast) {
            return call.args[0].returnType(parser, false).union(call.args[0].type(parser));
          }
        },
        block: {
          internalId: 3,
          doWrapArgs: false,
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = (function () {
                  var _arr, _end, _i, _len, args, node;
                  args = call.args;
                  if (args.length === 0) {
                    return Type["undefined"];
                  } else {
                    for (_arr = __toArray(args), _i = 0, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); _i < _end; ++_i) {
                      node = _arr[_i];
                      node.type(parser);
                    }
                    return args[args.length - 1].type(parser);
                  }
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _returnType: function (call, parser, isLast) {
            var _arr, arg, current, i, len;
            current = Type.none;
            for (_arr = __toArray(call.args), i = 0, len = _arr.length; i < len; ++i) {
              arg = _arr[i];
              current = current.union(arg.returnType(parser, isLast && i === len - 1));
            }
            return current;
          },
          _withLabel: function (call, label, parser) {
            var args, last, len;
            args = call.args;
            len = args.length;
            if (len === 1) {
              return args[0].withLabel(label(parser));
            } else if (len > 1) {
              last = args[len - 1];
              if (last instanceof Node && last.isInternalCall("forIn") && (function () {
                var _arr, _end, _every, _i, _len, node;
                _every = true;
                for (_arr = __toArray(args), _i = 0, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); _i < _end; ++_i) {
                  node = _arr[_i];
                  if (!(node instanceof Node) || !node.isInternalCall("var") && !node.isAssignCall()) {
                    _every = false;
                    break;
                  }
                }
                return _every;
              }())) {
                return Call.apply(void 0, [call.index, call.scope, call.func].concat(
                  __toArray(__slice.call(args, 0, -1)),
                  [last.withLabel(label, parser)]
                ));
              }
            }
            return Call(
              call.index,
              call.scope,
              Symbol.label(call.index),
              label,
              call
            );
          },
          __reduce: (function () {
            function squishBody(body) {
              var changed, current, i, previous;
              changed = false;
              for (i = body.length - 1; i > 0; --i) {
                current = body[i];
                previous = body[i - 1];
                if (previous.isAssignCall("=") && (!previous.args[0].isIdentOrTmp || !!previous.scope.isMutable(previous.args[0]) || !previous.args[1].isInternalCall("function"))) {
                  if (previous.args[0].equals(current)) {
                    if (!changed) {
                      body = body.slice();
                      changed = true;
                    }
                    body.splice(i, 1);
                  } else if (current.isAssignCall() && previous.args[0].equals(current.args[1]) && (!current.args[0].isInternalCall("access") || !current.args[0].args[0].equals(previous.args[0]))) {
                    if (!changed) {
                      body = body.slice();
                      changed = true;
                    }
                    body.splice(i - 1, 2, Call(
                      current.index,
                      current.scope,
                      current.func,
                      current.args[0],
                      previous
                    ));
                  }
                }
              }
              return body;
            }
            return function (call, parser) {
              var _arr, args, body, changed, i, len, newBody, node;
              changed = false;
              body = [];
              args = call.args;
              for (_arr = __toArray(args), i = 0, len = _arr.length; i < len; ++i) {
                node = _arr[i];
                if (node instanceof Symbol.nothing || i < len - 1 && node.isConst()) {
                  changed = true;
                } else if (node instanceof Node && node.isInternalCall()) {
                  if (node.func.isBlock) {
                    body.push.apply(body, __toArray(node.args));
                    changed = true;
                  } else if (node.func.isGoto) {
                    body.push(node);
                    if (i < len - 1) {
                      changed = true;
                    }
                    break;
                  } else {
                    body.push(node);
                  }
                } else {
                  body.push(node);
                }
              }
              newBody = squishBody(body);
              if (newBody !== body) {
                changed = true;
                body = newBody;
              }
              switch (body.length) {
              case 0: return Symbol.nothing(this.index);
              case 1: return body[0];
              default:
                if (changed) {
                  return Call.apply(void 0, [this.index, this.scope, call.func].concat(body));
                } else {
                  return;
                }
              }
            };
          }()),
          _isStatement: (function () {
            var cache;
            cache = Cache();
            return function (call) {
              var _arr, _i, _len, _some, _value, node;
              _value = cache.get(call);
              if (_value === void 0) {
                _some = false;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  node = _arr[_i];
                  if (node.isStatement()) {
                    _some = true;
                    break;
                  }
                }
                _value = _some;
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _mutateLast: function (call, parser, func, context, includeNoop) {
            var args, lastNode, len;
            args = call.args;
            len = args.length;
            if (len === 0) {
              return Symbol.nothing(this.index).mutateLast(parser, func, context, includeNoop);
            } else {
              lastNode = args[len - 1].mutateLast(parser, func, context, includeNoop);
              if (lastNode !== args[len - 1]) {
                return Call.apply(void 0, [this.index, this.scope, call.func].concat(
                  __toArray(__slice.call(args, 0, -1)),
                  [lastNode]
                ));
              } else {
                return call;
              }
            }
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _arr, _every, _i, _len, _value, node;
              _value = cache.get(call);
              if (_value === void 0) {
                _every = true;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  node = _arr[_i];
                  if (!node.isNoop(parser)) {
                    _every = false;
                    break;
                  }
                }
                _value = _every;
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        "break": {
          internalId: 4,
          doWrapArgs: false,
          validateArgs: function (label) {
            var rest;
            if (label == null) {
              label = null;
            }
            rest = __slice.call(arguments, 1);
          },
          isGoto: true,
          usedAsStatement: true
        },
        comment: {
          internalId: 5,
          doWrapArgs: false,
          validateArgs: function (text) {
            var rest;
            rest = __slice.call(arguments, 1);
          }
        },
        contextCall: {
          internalId: 6,
          validateArgs: function (func, context) {},
          _type: function (call, parser) {
            var fakeCall, func;
            func = call.args[0];
            if (typeof func._type === "function") {
              fakeCall = Call.apply(void 0, [call.index, call.scope].concat(__toArray(call.args)));
              return func._type(fakeCall, parser);
            } else {
              return Type.any;
            }
          }
        },
        "continue": {
          internalId: 7,
          doWrapArgs: false,
          validateArgs: function (label) {
            var rest;
            if (label == null) {
              label = null;
            }
            rest = __slice.call(arguments, 1);
          },
          isGoto: true,
          usedAsStatement: true
        },
        custom: {
          internalId: 8,
          doWrapArgs: false,
          validateArgs: function (name) {
            var rest;
            rest = __slice.call(arguments, 1);
          }
        },
        "debugger": {
          internalId: 9,
          doWrapArgs: false,
          validateArgs: function () {
            var rest;
            rest = __slice.call(arguments);
          },
          usedAsStatement: true
        },
        embedWrite: {
          internalId: 10,
          doWrapArgs: false,
          validateArgs: function (text, escape) {
            var rest;
            rest = __slice.call(arguments, 2);
          }
        },
        "for": {
          internalId: 11,
          doWrapArgs: false,
          validateArgs: function (init, test, step, body) {
            var rest;
            rest = __slice.call(arguments, 4);
          },
          usedAsStatement: true,
          _returnType: function (call, parser, isLast) {
            var type;
            if (isLast) {
              type = Type["undefined"];
            } else {
              type = Type.none;
            }
            return type.union(call.args[3].returnType(parser, false));
          }
        },
        forIn: {
          internalId: 12,
          doWrapArgs: false,
          validateArgs: function (key, object, body) {
            var rest;
            rest = __slice.call(arguments, 3);
          },
          usedAsStatement: true,
          _returnType: function (call, parser, isLast) {
            var type;
            if (isLast) {
              type = Type["undefined"];
            } else {
              type = Type.none;
            }
            return type.union(call.args[2].returnType(parser, false));
          }
        },
        "function": {
          internalId: 13,
          doWrapArgs: false,
          validateArgs: function (params, body, bound, asType, isGenerator) {
            if (!params.isInternalCall("array")) {
              throw new Error("Expected params to be an internal Array call, got " + __typeof(params));
            }
          },
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                if (call.args[3] && !(call.args[3] instanceof Symbol.nothing)) {
                  _value = nodeToType(call.args[3])["function"]();
                } else if (call.args[4].constValue()) {
                  _value = Type.generator;
                } else {
                  _value = call.args[1].returnType(parser, true)["function"]();
                }
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _isNoop: function () {
            return true;
          }
        },
        "if": {
          internalId: 14,
          doWrapArgs: false,
          validateArgs: function (test, whenTrue, whenFalse) {
            var rest;
            rest = __slice.call(arguments, 3);
          },
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[1].type(parser).union(call.args[2].type(parser));
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _returnType: function (call, parser, isLast) {
            return call.args[1].returnType(parser, isLast).union(call.args[2].returnType(parser, isLast));
          },
          _isStatement: (function () {
            var cache;
            cache = Cache();
            return function (call) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[1].isStatement() || call.args[2].isStatement();
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _doWrap: function (call, parser) {
            var whenFalse, whenTrue;
            whenTrue = call.args[1].doWrap(parser);
            whenFalse = call.args[2].doWrap(parser);
            if (whenTrue !== call.args[1] || whenFalse !== call.args[2]) {
              return Call(
                call.index,
                call.scope,
                call.func,
                call.args[0],
                whenTrue,
                whenFalse
              );
            } else {
              return call;
            }
          },
          __reduce: function (call, parser) {
            var _ref, test, testType, whenFalse, whenTrue, wrappedTest;
            _ref = call.args;
            test = _ref[0];
            whenTrue = _ref[1];
            whenFalse = _ref[2];
            _ref = null;
            if (test.isConst()) {
              if (test.constValue()) {
                return whenTrue;
              } else {
                return whenFalse;
              }
            } else {
              testType = test.type(parser);
              if (testType.isSubsetOf(Type.alwaysTruthy)) {
                return Call(
                  call.index,
                  call.scope,
                  Symbol.block(call.index),
                  test,
                  whenTrue
                ).reduce(parser);
              } else if (testType.isSubsetOf(Type.alwaysFalsy)) {
                return Call(
                  call.index,
                  call.scope,
                  Symbol.block(call.index),
                  test,
                  whenFalse
                ).reduce(parser);
              } else {
                wrappedTest = test.doWrap(parser);
                if (wrappedTest !== test) {
                  return Call(
                    call.index,
                    call.scope,
                    call.func,
                    wrappedTest,
                    whenTrue,
                    whenFalse
                  );
                }
              }
            }
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var whenFalse, whenTrue;
            whenTrue = call.args[1].mutateLast(parser, mutator, context, includeNoop);
            whenFalse = call.args[2].mutateLast(parser, mutator, context, includeNoop);
            if (whenTrue !== call.args[1] || whenFalse !== call.args[2]) {
              return Call(
                call.index,
                call.scope,
                call.func,
                call.args[0],
                whenTrue,
                whenFalse
              );
            } else {
              return call;
            }
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _arr, _every, _i, _len, _value, arg;
              _value = cache.get(call);
              if (_value === void 0) {
                _every = true;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  arg = _arr[_i];
                  if (!arg.isNoop(parser)) {
                    _every = false;
                    break;
                  }
                }
                _value = _every;
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        label: {
          internalId: 15,
          doWrapArgs: false,
          validateArgs: function (label, node) {
            var rest;
            rest = __slice.call(arguments, 2);
          },
          usedAsStatement: true
        },
        macroConst: {
          internalId: 16,
          doWrapArgs: false,
          validateArgs: function (name) {
            var rest;
            rest = __slice.call(arguments, 1);
          },
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = (function () {
                  var c, value;
                  c = o.getConst(call.args[0].constValue());
                  if (!c) {
                    return Type.any;
                  } else {
                    value = c.value;
                    if (value === null) {
                      return Type["null"];
                    } else {
                      switch (typeof value) {
                      case "number": return Type.number;
                      case "string": return Type.string;
                      case "boolean": return Type.boolean;
                      case "undefined": return Type["undefined"];
                      default: throw new Error("Unknown type for " + String(c.value));
                      }
                    }
                  }
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _isNoop: function () {
            return true;
          }
        },
        "new": {
          internalId: 17,
          validateArgs: function (ctor) {},
          _type: (function () {
            var PRIMORDIAL_CONSTRUCTOR_TYPES;
            PRIMORDIAL_CONSTRUCTOR_TYPES = {
              Array: Type.array,
              Function: Type["function"],
              Boolean: Type.object,
              String: Type.object,
              Number: Type.object,
              RegExp: Type.regexp,
              Date: Type.date,
              Error: Type.error,
              RangeError: Type.error,
              ReferenceError: Type.error,
              SyntaxError: Type.error,
              TypeError: Type.error,
              URIError: Type.error
            };
            return function (call, parser) {
              var ctor, name;
              ctor = call.args[0];
              if (ctor instanceof Ident) {
                name = ctor.name;
                if (__owns.call(PRIMORDIAL_CONSTRUCTOR_TYPES, name)) {
                  return PRIMORDIAL_CONSTRUCTOR_TYPES[name];
                }
              }
              return Type.notUndefinedOrNull;
            };
          }())
        },
        nothing: {
          internalId: 18,
          type: function () {
            return Type["undefined"];
          },
          constValue: function () {},
          isConstType: function (_x) {
            return "undefined" === _x;
          },
          isConst: function () {
            return true;
          },
          isConstValue: function (_x) {
            return void 0 === _x;
          },
          isConstTruthy: function () {
            return false;
          },
          isConstFalsy: function () {
            return true;
          },
          isNoop: function () {
            return true;
          },
          mutateLast: function (parser, func, context, includeNoop) {
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
          },
          convertNothing: function (value) {
            if (typeof value === "function") {
              return value();
            } else {
              return value;
            }
          }
        },
        object: {
          internalId: 19,
          validateArgs: function (prototype) {
            var pairs;
            pairs = __slice.call(arguments, 1);
          },
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = (function () {
                  var _arr, _i, _len, data, pair;
                  data = {};
                  for (_arr = __toArray(call.args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
                    pair = _arr[_i];
                    if (pair.args.length === 2 && pair.args[0].isConst()) {
                      data[pair.args[0].constValue()] = pair.args[1].isConst() && pair.args[1].constValue() == null ? Type.any : pair.args[1].type(parser);
                    }
                  }
                  return Type.makeObject(data);
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _isLiteral: (function () {
            var cache;
            cache = Cache();
            return function (call) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[0] instanceof Symbol.nothing && (function () {
                  var _arr, _every, _i, _len, arg;
                  _every = true;
                  for (_arr = __toArray(call.args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
                    arg = _arr[_i];
                    if (arg.args.length !== 2 || !arg.args[0].isConst() || !arg.args[1].isLiteral()) {
                      _every = false;
                      break;
                    }
                  }
                  return _every;
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _literalValue: function (call) {
            var _arr, _i, _len, pair, result;
            if (!(call.args[0] instanceof Symbol.nothing)) {
              throw new Error("Cannot convert object with prototype to a literal");
            }
            result = {};
            for (_arr = __toArray(call.args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
              pair = _arr[_i];
              result[pair.args[0].constValue()] = pair.args[1].literalValue();
            }
            return result;
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _arr, _every, _i, _len, _value, arg;
              _value = cache.get(call);
              if (_value === void 0) {
                _every = true;
                for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                  arg = _arr[_i];
                  if (!arg.isNoop(parser)) {
                    _every = false;
                    break;
                  }
                }
                _value = _every;
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _toString: function (call) {
            var _arr, _len, constKey, i, pair, prototype, sb;
            if (!(call.args[0] instanceof Symbol.nothing)) {
              prototype = call.args[0];
            } else {
              prototype = null;
            }
            if (!prototype && call.args.length <= 1) {
              return "{}";
            } else {
              sb = [];
              sb.push("{ ");
              if (prototype) {
                sb.push("extends " + prototype.toString() + "; ");
              }
              for (_arr = __toArray(call.args), i = 1, _len = _arr.length; i < _len; ++i) {
                pair = _arr[i];
                if (i > 1) {
                  sb.push(", ");
                }
                if (pair.args.length === 3) {
                  sb.push(pair.args[2].constValue());
                  sb.push(" ");
                }
                if (pair.args[0].isConstType("string")) {
                  constKey = pair.args[0].constValue();
                  sb.push(/^[\w\$_][\w\d\$_]*$/.test(constKey) ? constKey : toJSSource(constKey));
                } else {
                  sb.push("[");
                  sb.push(pair.args[0]);
                  sb.push("]");
                }
                sb.push(": ");
                sb.push(pair.args[1]);
              }
              sb.push(" }");
              return sb.join("");
            }
          }
        },
        param: {
          internalId: 20,
          doWrapArgs: false,
          validateArgs: function (ident, defaultValue, isSpread, isMutable, asType) {
            var rest;
            rest = __slice.call(arguments, 5);
          }
        },
        "return": {
          internalId: 21,
          doWrapArgs: false,
          validateArgs: function (node) {
            var rest;
            rest = __slice.call(arguments, 1);
          },
          isGoto: true,
          usedAsStatement: true,
          _returnType: function (call, parser) {
            return call.args[0].returnType(parser, false).union(call.args[0].type(parser));
          }
        },
        root: {
          internalId: 22,
          doWrapArgs: false,
          validateArgs: function (file, body, isEmbedded, isGenerator) {
            var rest;
            rest = __slice.call(arguments, 4);
          },
          usedAsStatement: true
        },
        spread: {
          internalId: 23,
          validateArgs: function (node) {
            var rest;
            rest = __slice.call(arguments, 1);
          },
          _toString: function (call) {
            return "..." + call.args[0].toString();
          }
        },
        "switch": {
          internalId: 24,
          doWrapArgs: false,
          validateArgs: function () {
            var args;
            args = __slice.call(arguments);
          },
          usedAsStatement: true,
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = (function () {
                  var _end, args, current, i, len;
                  args = call.args;
                  len = args.length;
                  current = Type.none;
                  for (i = 2, _end = len - 1; i < _end; i += 3) {
                    if (!args[i + 1].constValue()) {
                      current = current.union(args[i].type(parser));
                    }
                  }
                  return current.union(args[len - 1].type(parser));
                }());
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _returnType: function (call, parser, isLast) {
            var _end, args, current, i, len;
            args = call.args;
            len = args.length;
            current = Type.none;
            for (i = 2, _end = len - 1; i < _end; i += 3) {
              current = current.union(args[i].returnType(parser, false));
            }
            return current.union(args[len - 1].returnType(parser, isLast));
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var _end, args, body, changed, defaultCase, i, len, newArgs,
                newBody, newDefaultCase;
            args = call.args;
            len = args.length;
            changed = false;
            newArgs = [];
            newArgs.push(args[0]);
            for (i = 1, _end = len - 1; i < _end; i += 3) {
              newArgs.push(args[i]);
              if (args[i + 2].constValue()) {
                newArgs.push(args[i + 1]);
              } else {
                body = args[i + 1];
                newBody = body.mutateLast(parser, mutator, context, includeNoop);
                if (!changed) {
                  changed = body !== newBody;
                }
                newArgs.push(newBody);
              }
              newArgs.push(args[i + 2]);
            }
            defaultCase = args[args.length - 1];
            newDefaultCase = defaultCase.mutateLast(parser, mutator, context, includeNoop);
            if (!changed) {
              changed = defaultCase !== newDefaultCase;
            }
            newArgs.push(newDefaultCase);
            if (changed) {
              return Call.apply(void 0, [call.index, call.scope, call.func].concat(newArgs));
            } else {
              return call;
            }
          }
        },
        "super": {
          internalId: 25,
          validateArgs: function (child) {}
        },
        syntaxChoice: { internalId: 26, doWrapArgs: false },
        syntaxLookahead: {
          internalId: 27,
          doWrapArgs: false,
          validateArgs: function (negated, node) {
            var rest;
            rest = __slice.call(arguments, 2);
          }
        },
        syntaxMany: {
          internalId: 28,
          doWrapArgs: false,
          validateArgs: function (node, multiplier) {
            var rest;
            rest = __slice.call(arguments, 2);
          }
        },
        syntaxParam: {
          internalId: 29,
          doWrapArgs: false,
          validateArgs: function (node, asType) {
            var rest;
            rest = __slice.call(arguments, 2);
          }
        },
        syntaxSequence: { internalId: 30, doWrapArgs: false },
        "throw": {
          internalId: 31,
          validateArgs: function (node) {
            var rest;
            rest = __slice.call(arguments, 1);
          },
          _type: function () {
            return Type.none;
          },
          _returnType: function () {
            return Type.none;
          },
          isGoto: true,
          usedAsStatement: true,
          _doWrap: function (call, parser) {
            return Call(
              call.index,
              call.scope,
              Ident(call.index, call.scope, "__throw"),
              call.args[0]
            );
          }
        },
        tmpWrapper: {
          internalId: 32,
          doWrapArgs: false,
          _isStatement: function (call) {
            return call.args[0].isStatement();
          },
          validateArgs: function (node) {
            var tmpIds;
            tmpIds = __slice.call(arguments, 1);
          },
          _type: function (call, parser) {
            return call.args[0].type(parser);
          },
          _returnType: function (call, parser, isLast) {
            return call.args[0].returnType(parser, isLast);
          },
          _withLabel: function (call, label, parser) {
            var labelled;
            labelled = call.args[0].withLabel(label, parser);
            if (labelled !== call.args[0]) {
              return Call.apply(void 0, [call.index, call.scope, call.func, labelled].concat(__toArray(__slice.call(call.args, 1))));
            } else {
              return call;
            }
          },
          _doWrap: function (call, parser) {
            var wrapped;
            wrapped = call.args[0].doWrap(parser);
            if (wrapped !== call.args[0]) {
              return Call.apply(void 0, [call.index, call.scope, call.func, wrapped].concat(__toArray(__slice.call(call.args, 1))));
            } else {
              return call;
            }
          },
          _mutateLast: function (call, parser, func, context, includeNoop) {
            var mutated;
            mutated = call.args[0].mutateLast(parser, func, context, includeNoop);
            if (mutated !== call.args[0]) {
              return Call.apply(void 0, [call.index, call.scope, call.func, mutated].concat(__toArray(__slice.call(call.args, 1))));
            } else {
              return call;
            }
          },
          _isNoop: function (call, parser) {
            return call.args[0].isNoop(parser);
          }
        },
        tryCatch: {
          internalId: 33,
          doWrapArgs: false,
          validateArgs: function (tryBody, catchIdent, catchBody) {
            var rest;
            rest = __slice.call(arguments, 3);
          },
          usedAsStatement: true,
          _type: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[0].type(parser).union(call.args[2].type(parser));
                cache.set(call, _value);
              }
              return _value;
            };
          }()),
          _returnType: function (call, parser, isLast) {
            return call.args[0].returnType(parser, isLast).union(call.args[2].returnType(parser, isLast));
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var catchBody, tryBody;
            tryBody = call.args[0].mutateLast(parser, mutator, context, includeNoop);
            catchBody = call.args[2].mutateLast(parser, mutator, context, includeNoop);
            if (tryBody !== call.args[0] || catchBody !== call.args[2]) {
              return Call(
                call.index,
                call.scope,
                call.func,
                tryBody,
                call.args[1],
                catchBody
              );
            } else {
              return call;
            }
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[0].isNoop(parser) && call.args[2].isNoop(parser);
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        tryFinally: {
          internalId: 34,
          doWrapArgs: false,
          validateArgs: function (tryBody, finallyBody) {
            var rest;
            rest = __slice.call(arguments, 2);
          },
          usedAsStatement: true,
          _type: function (call, parser) {
            return call.args[0].type(parser);
          },
          _returnType: function (call, parser, isLast) {
            return call.args[0].returnType(parser, false).union(call.args[1].returnType(parser, isLast));
          },
          _mutateLast: function (call, parser, mutator, context, includeNoop) {
            var tryBody;
            tryBody = call.args[0].mutateLast(parser, mutator, context, includeNoop);
            if (tryBody !== call.args[0]) {
              return Call(
                call.index,
                call.scope,
                call.func,
                tryBody,
                call.args[1]
              );
            } else {
              return call;
            }
          },
          _isNoop: (function () {
            var cache;
            cache = Cache();
            return function (call, parser) {
              var _value;
              _value = cache.get(call);
              if (_value === void 0) {
                _value = call.args[0].isNoop(parser) && call.args[1].isNoop(parser);
                cache.set(call, _value);
              }
              return _value;
            };
          }())
        },
        typeGeneric: {
          internalId: 35,
          doWrapArgs: false,
          validateArgs: function (node, arg) {}
        },
        typeObject: {
          internalId: 36,
          doWrapArgs: false,
          validateArgs: function () {
            var args;
            args = __slice.call(arguments);
          }
        },
        typeUnion: { internalId: 37, doWrapArgs: false },
        "var": {
          internalId: 38,
          doWrapArgs: false,
          validateArgs: function (node, isMutable) {
            var rest;
            if (isMutable == null) {
              isMutable = null;
            }
            rest = __slice.call(arguments, 2);
          }
        },
        "yield": {
          internalId: 39,
          validateArgs: function (node) {
            var rest;
            rest = __slice.call(arguments, 1);
          }
        }
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
            return _this;
          }
          _Internal_prototype2 = Internal.prototype;
          _Symbol_name_prototype = Symbol_name.prototype = __create(_Internal_prototype2);
          _Symbol_name_prototype.constructor = Symbol_name;
          Symbol_name.displayName = "Symbol_name";
          if (typeof Internal.extended === "function") {
            Internal.extended(Symbol_name);
          }
          _Symbol_name_prototype.name = name;
          Symbol_name.displayName = "Symbol." + name;
          _Symbol_name_prototype.equals = function (other) {
            return other === this || other instanceof Symbol_name;
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
      var _Ident_prototype, _Symbol_prototype2, EVAL_SIMPLIFIERS,
          PRIMORDIAL_FUNCTION_RETURN_TYPES, PURE_PRIMORDIAL_FUNCTIONS;
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
      _Ident_prototype.symbolType = "ident";
      _Ident_prototype.symbolTypeId = 1;
      _Ident_prototype.inspect = function () {
        return "Symbol.ident(" + toJSSource(this.name) + ")";
      };
      _Ident_prototype.toString = function () {
        return this.name;
      };
      _Ident_prototype.equals = function (other) {
        return other === this || other instanceof Ident && this.scope === other.scope && this.name === other.name;
      };
      _Ident_prototype.type = function (parser) {
        var name, type;
        name = this.name;
        switch (name) {
        case "__currentArrayLength": return Type.number;
        case "arguments": return Type.args;
        default:
          type = this.scope.type(this);
          if (type === Type.any && parser && parser.macros.hasHelper(name)) {
            return parser.macros.helperType(name);
          } else {
            return type;
          }
        }
      };
      PRIMORDIAL_FUNCTION_RETURN_TYPES = {
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
      _Ident_prototype._type = function (call, parser) {
        var name;
        name = this.name;
        if (__owns.call(PRIMORDIAL_FUNCTION_RETURN_TYPES, name)) {
          return PRIMORDIAL_FUNCTION_RETURN_TYPES[name];
        } else {
          return this.type(parser).returnType();
        }
      };
      EVAL_SIMPLIFIERS = {
        "true": function (index) {
          return Value(index, true);
        },
        "false": function (index) {
          return Value(index, false);
        },
        "void 0": function (index) {
          return Value(index, void 0);
        },
        "null": function (index) {
          return Value(index, null);
        },
        "-1": function (index) {
          return Value(index, -1);
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
        Number: true
      };
      _Ident_prototype.__reduce = function (call, parser) {
        var _arr, _i, _len, _ref, arg, constArgs, evalArg, name, value;
        name = this.name;
        if (name === "eval") {
          if (call.args.length === 1 && call.args[0].isConst()) {
            evalArg = call.args[0].constValue();
            if (__owns.call(EVAL_SIMPLIFIERS, evalArg)) {
              return EVAL_SIMPLIFIERS[evalArg](call.index);
            }
          }
        } else if (__owns.call(PURE_PRIMORDIAL_FUNCTIONS, name)) {
          constArgs = [];
          for (_arr = __toArray(call.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            arg = _arr[_i];
            if (arg.isConst()) {
              constArgs.push(arg.constValue());
            } else {
              return;
            }
          }
          try {
            value = GLOBAL[func.name].apply(void 0, constArgs);
            if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
              return Value(this.index, value);
            }
          } catch (_err) {}
        }
      };
      _Ident_prototype.isNoop = function () {
        return true;
      };
      _Ident_prototype.isPrimordial = function () {
        return isPrimordial(this.name);
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
      _Tmp_prototype.symbolType = "tmp";
      _Tmp_prototype.symbolTypeId = 2;
      _Tmp_prototype.inspect = function () {
        return "Symbol.tmp(" + this.id + ", " + toJSSource(this.name) + ")";
      };
      _Tmp_prototype.toString = function () {
        return "_" + this.name + "-" + this.id;
      };
      _Tmp_prototype.equals = function (other) {
        return other === this || other instanceof Tmp && this.scope === other.scope && this.id === other.id;
      };
      _Tmp_prototype.type = function (parser) {
        return this.scope.type(this);
      };
      Symbol.tmp = Tmp;
      return Tmp;
    }(Symbol));
    Operator = (function (Symbol) {
      var _Operator_prototype, _Symbol_prototype2, AssignOperator,
          BinaryOperator, UnaryOperator;
      function Operator() {
        var _this;
        _this = this instanceof Operator ? this : __create(_Operator_prototype);
        throw new Error("Operator is not meant to be instantiated directly");
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
      _Operator_prototype.symbolType = "operator";
      _Operator_prototype.symbolTypeId = 3;
      _Operator_prototype.equals = function (other) {
        return other === this || other instanceof this.constructor;
      };
      _Operator_prototype.toString = function () {
        return this.name;
      };
      BinaryOperator = (function (Operator) {
        var _BinaryOperator_prototype, _Operator_prototype2, AddOrStringConcat,
            BitwiseAnd, BitwiseLeftShift, BitwiseOr, BitwiseRightShift,
            BitwiseUnsignedRightShift, BitwiseXor, Divide, GreaterThan,
            GreaterThanOrEqual, HasKey, Instanceof, LessThan, LessThanOrEqual,
            LogicalAnd, LogicalOr, Modulo, Multiply, StrictEqual, StrictInequal,
            Subtract, UnstrictEqual, UnstrictInequal;
        function BinaryOperator() {
          var _this;
          _this = this instanceof BinaryOperator ? this : __create(_BinaryOperator_prototype);
          throw new Error("UnaryOperator is not meant to be instantiated directly");
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
        _BinaryOperator_prototype.operatorTypeId = 0;
        _BinaryOperator_prototype.inspect = function () {
          return "Symbol.binary[" + toJSSource(this.name) + "]";
        };
        _BinaryOperator_prototype.validateArgs = function (left, right) {
          var rest;
          rest = __slice.call(arguments, 2);
        };
        _BinaryOperator_prototype._toString = function (call) {
          return "(" + call.args[0].toString() + " " + this.name + " " + call.args[1].toString() + ")";
        };
        _BinaryOperator_prototype._isNoop = (function () {
          var cache;
          cache = Cache();
          return function (call, parser) {
            var _value;
            _value = cache.get(call);
            if (_value === void 0) {
              _value = call.args[0].isNoop(parser) && call.args[1].isNoop(parser);
              cache.set(call, _value);
            }
            return _value;
          };
        }());
        function removeUnaryPlus(node) {
          if (node instanceof Call && node.isUnaryCall("+")) {
            return node.args[0];
          } else {
            return node;
          }
        }
        function leftConstNan(call, left, right) {
          var _ref;
          if ((_ref = left.constValue()) !== _ref) {
            return Call(
              call.index,
              call.scope,
              Symbol.block(call.index),
              right,
              left
            );
          }
        }
        function rightConstNan(call, left, right) {
          var _ref;
          if ((_ref = right.constValue()) !== _ref) {
            return Call(
              call.index,
              call.scope,
              Symbol.block(call.index),
              left,
              right
            );
          }
        }
        Symbol.binary = {
          "*": Multiply = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _Multiply_prototype;
            function Multiply(index) {
              var _this;
              _this = this instanceof Multiply ? this : __create(_Multiply_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _Multiply_prototype = Multiply.prototype = __create(_BinaryOperator_prototype2);
            _Multiply_prototype.constructor = Multiply;
            Multiply.displayName = "Multiply";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(Multiply);
            }
            _Multiply_prototype.name = "*";
            _Multiply_prototype._type = function () {
              return Type.number;
            };
            _Multiply_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() * right.constValue());
                } else {
                  switch (left.constValue()) {
                  case 1:
                    return Call(call.index, call.scope, Symbol.unary["+"](call.index), right);
                  case -1:
                    return Call(call.index, call.scope, Symbol.unary["-"](call.index), right);
                  default:
                    if ((_ref = leftConstNan(call, left, right)) != null) {
                      return _ref;
                    }
                  }
                }
              } else if (right.isConst()) {
                switch (right.constValue()) {
                case 1:
                  return Call(call.index, call.scope, Symbol.unary["+"](call.index), left);
                case -1:
                  return Call(call.index, call.scope, Symbol.unary["-"](call.index), left);
                default:
                  if ((_ref = rightConstNan(call, left, right)) != null) {
                    return _ref;
                  }
                }
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return Multiply;
          }(BinaryOperator)),
          "/": Divide = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _Divide_prototype;
            function Divide(index) {
              var _this;
              _this = this instanceof Divide ? this : __create(_Divide_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _Divide_prototype = Divide.prototype = __create(_BinaryOperator_prototype2);
            _Divide_prototype.constructor = Divide;
            Divide.displayName = "Divide";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(Divide);
            }
            _Divide_prototype.name = "/";
            _Divide_prototype._type = function () {
              return Type.number;
            };
            _Divide_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() / right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst()) {
                switch (right.constValue()) {
                case 1:
                  return Call(call.index, call.scope, Symbol.unary["+"](call.index), left);
                case -1:
                  return Call(call.index, call.scope, Symbol.unary["-"](call.index), left);
                default:
                  if ((_ref = rightConstNan(call, left, right)) != null) {
                    return _ref;
                  }
                }
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return Divide;
          }(BinaryOperator)),
          "%": Modulo = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _Modulo_prototype;
            function Modulo(index) {
              var _this;
              _this = this instanceof Modulo ? this : __create(_Modulo_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _Modulo_prototype = Modulo.prototype = __create(_BinaryOperator_prototype2);
            _Modulo_prototype.constructor = Modulo;
            Modulo.displayName = "Modulo";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(Modulo);
            }
            _Modulo_prototype.name = "%";
            _Modulo_prototype._type = function () {
              return Type.number;
            };
            _Modulo_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() % right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return Modulo;
          }(BinaryOperator)),
          "+": AddOrStringConcat = (function (BinaryOperator) {
            var _AddOrStringConcat_prototype, _BinaryOperator_prototype2;
            function AddOrStringConcat(index) {
              var _this;
              _this = this instanceof AddOrStringConcat ? this : __create(_AddOrStringConcat_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _AddOrStringConcat_prototype = AddOrStringConcat.prototype = __create(_BinaryOperator_prototype2);
            _AddOrStringConcat_prototype.constructor = AddOrStringConcat;
            AddOrStringConcat.displayName = "AddOrStringConcat";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(AddOrStringConcat);
            }
            _AddOrStringConcat_prototype.name = "+";
            _AddOrStringConcat_prototype._type = (function () {
              var cache;
              cache = Cache();
              return function (call, parser) {
                var _value;
                _value = cache.get(call);
                if (_value === void 0) {
                  _value = (function () {
                    var left, right;
                    left = call.args[0].type(parser);
                    right = call.args[1].type(parser);
                    if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
                      return Type.number;
                    } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
                      return Type.stringOrNumber;
                    } else {
                      return Type.string;
                    }
                  }());
                  cache.set(call, _value);
                }
                return _value;
              };
            }());
            function isJSNumeric(x) {
              var _ref;
              return x === null || (_ref = typeof x) === "number" || _ref === "boolean" || _ref === "undefined";
            }
            _AddOrStringConcat_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, isJSNumeric(left.constValue()) && isJSNumeric(right.constValue()) ? left.constValue() - -right.constValue() : "" + left.constValue() + right.constValue());
                } else if (left.isConstValue(0) && right.type(parser).isSubsetOf(Type.numeric)) {
                  return Call(call.index, call.scope, Symbol.unary["+"](call.index), right);
                } else if (left.isConstValue("") && right.type(parser).isSubsetOf(Type.string)) {
                  return right;
                } else if (left.isConstType("string") && right instanceof Call && right.isBinaryCall("+") && right.args[0].isConstType("string")) {
                  return Call(
                    call.index,
                    call.scope,
                    call.func,
                    Value(left.index, "" + left.constValue() + right.args[0].constValue()),
                    right.args[1]
                  );
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst()) {
                if (right.isConstValue(0) && left.type(parser).isSubsetOf(Type.number)) {
                  return Call(call.index, call.scope, Symbol.unary["+"](call.index), left);
                } else if (right.isConstType("number") && right.constValue() < 0 && left.type(parser).isSubsetOf(Type.numeric)) {
                  return Call(
                    call.index,
                    call.scope,
                    Subtract(call.index),
                    left,
                    Value(right.index, -right.constValue())
                  );
                } else if (right.isConstValue("") && left.type(parser).isSubsetOf(Type.string)) {
                  return left;
                } else if (right.isConstType("string") && left instanceof Call && left.isBinaryCall("+") && left.args[1].isConstType("string")) {
                  return Call(
                    call.index,
                    call.scope,
                    call.func,
                    left.args[0],
                    Value(left.args[1].index, "" + left.args[1].constValue() + right.constValue())
                  );
                } else if ((_ref = rightConstNan(call, left, right)) != null) {
                  return _ref;
                }
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return AddOrStringConcat;
          }(BinaryOperator)),
          "-": Subtract = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _Subtract_prototype;
            function Subtract(index) {
              var _this;
              _this = this instanceof Subtract ? this : __create(_Subtract_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _Subtract_prototype = Subtract.prototype = __create(_BinaryOperator_prototype2);
            _Subtract_prototype.constructor = Subtract;
            Subtract.displayName = "Subtract";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(Subtract);
            }
            _Subtract_prototype.name = "-";
            _Subtract_prototype._type = function () {
              return Type.number;
            };
            _Subtract_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() - right.constValue());
                } else if (left.isConstValue(0)) {
                  return Call(call.index, call.scope, Symbol.unary["-"](call.index), right);
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst()) {
                if (right.isConstValue(0)) {
                  return Call(call.index, call.scope, Symbol.unary["+"](call.index), right);
                } else if (right.isConstType("number") && right.constValue() < 0 && left.type(parser).isSubsetOf(Type.numeric)) {
                  return Call(
                    call.index,
                    call.scope,
                    AddOrStringConcat(call.index),
                    left,
                    Value(right.index, -right.constValue())
                  );
                } else if ((_ref = rightConstNan(call, left, right)) != null) {
                  return _ref;
                }
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return Subtract;
          }(BinaryOperator)),
          "<<": BitwiseLeftShift = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _BitwiseLeftShift_prototype;
            function BitwiseLeftShift(index) {
              var _this;
              _this = this instanceof BitwiseLeftShift ? this : __create(_BitwiseLeftShift_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseLeftShift_prototype = BitwiseLeftShift.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseLeftShift_prototype.constructor = BitwiseLeftShift;
            BitwiseLeftShift.displayName = "BitwiseLeftShift";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseLeftShift);
            }
            _BitwiseLeftShift_prototype.name = "<<";
            _BitwiseLeftShift_prototype._type = function () {
              return Type.number;
            };
            _BitwiseLeftShift_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() << right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseLeftShift;
          }(BinaryOperator)),
          ">>": BitwiseRightShift = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _BitwiseRightShift_prototype;
            function BitwiseRightShift(index) {
              var _this;
              _this = this instanceof BitwiseRightShift ? this : __create(_BitwiseRightShift_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseRightShift_prototype = BitwiseRightShift.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseRightShift_prototype.constructor = BitwiseRightShift;
            BitwiseRightShift.displayName = "BitwiseRightShift";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseRightShift);
            }
            _BitwiseRightShift_prototype.name = ">>";
            _BitwiseRightShift_prototype._type = function () {
              return Type.number;
            };
            _BitwiseRightShift_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() >> right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseRightShift;
          }(BinaryOperator)),
          ">>>": BitwiseUnsignedRightShift = (function (BinaryOperator) {
            var _BinaryOperator_prototype2,
                _BitwiseUnsignedRightShift_prototype;
            function BitwiseUnsignedRightShift(index) {
              var _this;
              _this = this instanceof BitwiseUnsignedRightShift ? this : __create(_BitwiseUnsignedRightShift_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseUnsignedRightShift_prototype = BitwiseUnsignedRightShift.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseUnsignedRightShift_prototype.constructor = BitwiseUnsignedRightShift;
            BitwiseUnsignedRightShift.displayName = "BitwiseUnsignedRightShift";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseUnsignedRightShift);
            }
            _BitwiseUnsignedRightShift_prototype.name = ">>>";
            _BitwiseUnsignedRightShift_prototype._type = function () {
              return Type.number;
            };
            _BitwiseUnsignedRightShift_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() >>> right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseUnsignedRightShift;
          }(BinaryOperator)),
          "&": BitwiseAnd = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _BitwiseAnd_prototype;
            function BitwiseAnd(index) {
              var _this;
              _this = this instanceof BitwiseAnd ? this : __create(_BitwiseAnd_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseAnd_prototype = BitwiseAnd.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseAnd_prototype.constructor = BitwiseAnd;
            BitwiseAnd.displayName = "BitwiseAnd";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseAnd);
            }
            _BitwiseAnd_prototype.name = "&";
            _BitwiseAnd_prototype._type = function () {
              return Type.number;
            };
            _BitwiseAnd_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() & right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseAnd;
          }(BinaryOperator)),
          "|": BitwiseOr = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _BitwiseOr_prototype;
            function BitwiseOr(index) {
              var _this;
              _this = this instanceof BitwiseOr ? this : __create(_BitwiseOr_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseOr_prototype = BitwiseOr.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseOr_prototype.constructor = BitwiseOr;
            BitwiseOr.displayName = "BitwiseOr";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseOr);
            }
            _BitwiseOr_prototype.name = "|";
            _BitwiseOr_prototype._type = function () {
              return Type.number;
            };
            _BitwiseOr_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() | right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseOr;
          }(BinaryOperator)),
          "^": BitwiseXor = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _BitwiseXor_prototype;
            function BitwiseXor(index) {
              var _this;
              _this = this instanceof BitwiseXor ? this : __create(_BitwiseXor_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _BitwiseXor_prototype = BitwiseXor.prototype = __create(_BinaryOperator_prototype2);
            _BitwiseXor_prototype.constructor = BitwiseXor;
            BitwiseXor.displayName = "BitwiseXor";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(BitwiseXor);
            }
            _BitwiseXor_prototype.name = "^";
            _BitwiseXor_prototype._type = function () {
              return Type.number;
            };
            _BitwiseXor_prototype.__reduce = function (call, parser) {
              var _ref, left, right;
              left = removeUnaryPlus(call.args[0].reduce(parser));
              right = removeUnaryPlus(call.args[1].reduce(parser));
              if (left.isConst()) {
                if (right.isConst()) {
                  return Value(call.index, left.constValue() ^ right.constValue());
                } else if ((_ref = leftConstNan(call, left, right)) != null) {
                  return _ref;
                }
              } else if (right.isConst() && (_ref = rightConstNan(call, left, right)) != null) {
                return _ref;
              }
              if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return BitwiseXor;
          }(BinaryOperator)),
          "<": LessThan = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _LessThan_prototype;
            function LessThan(index) {
              var _this;
              _this = this instanceof LessThan ? this : __create(_LessThan_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _LessThan_prototype = LessThan.prototype = __create(_BinaryOperator_prototype2);
            _LessThan_prototype.constructor = LessThan;
            LessThan.displayName = "LessThan";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(LessThan);
            }
            _LessThan_prototype.name = "<";
            _LessThan_prototype._type = function () {
              return Type.boolean;
            };
            _LessThan_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() < right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return LessThan;
          }(BinaryOperator)),
          "<=": LessThanOrEqual = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _LessThanOrEqual_prototype;
            function LessThanOrEqual(index) {
              var _this;
              _this = this instanceof LessThanOrEqual ? this : __create(_LessThanOrEqual_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _LessThanOrEqual_prototype = LessThanOrEqual.prototype = __create(_BinaryOperator_prototype2);
            _LessThanOrEqual_prototype.constructor = LessThanOrEqual;
            LessThanOrEqual.displayName = "LessThanOrEqual";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(LessThanOrEqual);
            }
            _LessThanOrEqual_prototype.name = "<=";
            _LessThanOrEqual_prototype._type = function () {
              return Type.boolean;
            };
            _LessThanOrEqual_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() <= right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return LessThanOrEqual;
          }(BinaryOperator)),
          ">": GreaterThan = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _GreaterThan_prototype;
            function GreaterThan(index) {
              var _this;
              _this = this instanceof GreaterThan ? this : __create(_GreaterThan_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _GreaterThan_prototype = GreaterThan.prototype = __create(_BinaryOperator_prototype2);
            _GreaterThan_prototype.constructor = GreaterThan;
            GreaterThan.displayName = "GreaterThan";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(GreaterThan);
            }
            _GreaterThan_prototype.name = ">";
            _GreaterThan_prototype._type = function () {
              return Type.boolean;
            };
            _GreaterThan_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() > right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return GreaterThan;
          }(BinaryOperator)),
          ">=": GreaterThanOrEqual = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _GreaterThanOrEqual_prototype;
            function GreaterThanOrEqual(index) {
              var _this;
              _this = this instanceof GreaterThanOrEqual ? this : __create(_GreaterThanOrEqual_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _GreaterThanOrEqual_prototype = GreaterThanOrEqual.prototype = __create(_BinaryOperator_prototype2);
            _GreaterThanOrEqual_prototype.constructor = GreaterThanOrEqual;
            GreaterThanOrEqual.displayName = "GreaterThanOrEqual";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(GreaterThanOrEqual);
            }
            _GreaterThanOrEqual_prototype.name = ">=";
            _GreaterThanOrEqual_prototype._type = function () {
              return Type.boolean;
            };
            _GreaterThanOrEqual_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() >= right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return GreaterThanOrEqual;
          }(BinaryOperator)),
          "==": UnstrictEqual = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _UnstrictEqual_prototype;
            function UnstrictEqual(index) {
              var _this;
              _this = this instanceof UnstrictEqual ? this : __create(_UnstrictEqual_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _UnstrictEqual_prototype = UnstrictEqual.prototype = __create(_BinaryOperator_prototype2);
            _UnstrictEqual_prototype.constructor = UnstrictEqual;
            UnstrictEqual.displayName = "UnstrictEqual";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(UnstrictEqual);
            }
            _UnstrictEqual_prototype.name = "==";
            _UnstrictEqual_prototype._type = function () {
              return Type.boolean;
            };
            _UnstrictEqual_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() == right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return UnstrictEqual;
          }(BinaryOperator)),
          "!=": UnstrictInequal = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _UnstrictInequal_prototype;
            function UnstrictInequal(index) {
              var _this;
              _this = this instanceof UnstrictInequal ? this : __create(_UnstrictInequal_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _UnstrictInequal_prototype = UnstrictInequal.prototype = __create(_BinaryOperator_prototype2);
            _UnstrictInequal_prototype.constructor = UnstrictInequal;
            UnstrictInequal.displayName = "UnstrictInequal";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(UnstrictInequal);
            }
            _UnstrictInequal_prototype.name = "!=";
            _UnstrictInequal_prototype._type = function () {
              return Type.boolean;
            };
            _UnstrictInequal_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() != right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return UnstrictInequal;
          }(BinaryOperator)),
          "===": StrictEqual = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _StrictEqual_prototype;
            function StrictEqual(index) {
              var _this;
              _this = this instanceof StrictEqual ? this : __create(_StrictEqual_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _StrictEqual_prototype = StrictEqual.prototype = __create(_BinaryOperator_prototype2);
            _StrictEqual_prototype.constructor = StrictEqual;
            StrictEqual.displayName = "StrictEqual";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(StrictEqual);
            }
            _StrictEqual_prototype.name = "===";
            _StrictEqual_prototype._type = function () {
              return Type.boolean;
            };
            _StrictEqual_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() === right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return StrictEqual;
          }(BinaryOperator)),
          "!==": StrictInequal = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _StrictInequal_prototype;
            function StrictInequal(index) {
              var _this;
              _this = this instanceof StrictInequal ? this : __create(_StrictInequal_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _StrictInequal_prototype = StrictInequal.prototype = __create(_BinaryOperator_prototype2);
            _StrictInequal_prototype.constructor = StrictInequal;
            StrictInequal.displayName = "StrictInequal";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(StrictInequal);
            }
            _StrictInequal_prototype.name = "!==";
            _StrictInequal_prototype._type = function () {
              return Type.boolean;
            };
            _StrictInequal_prototype.__reduce = function (call, parser) {
              var left, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst() && right.isConst()) {
                return Value(call.index, left.constValue() !== right.constValue());
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return StrictInequal;
          }(BinaryOperator)),
          "instanceof": Instanceof = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _Instanceof_prototype;
            function Instanceof(index) {
              var _this;
              _this = this instanceof Instanceof ? this : __create(_Instanceof_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _Instanceof_prototype = Instanceof.prototype = __create(_BinaryOperator_prototype2);
            _Instanceof_prototype.constructor = Instanceof;
            Instanceof.displayName = "Instanceof";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(Instanceof);
            }
            _Instanceof_prototype.name = "instanceof";
            _Instanceof_prototype._type = function () {
              return Type.boolean;
            };
            return Instanceof;
          }(BinaryOperator)),
          "in": HasKey = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _HasKey_prototype;
            function HasKey(index) {
              var _this;
              _this = this instanceof HasKey ? this : __create(_HasKey_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _HasKey_prototype = HasKey.prototype = __create(_BinaryOperator_prototype2);
            _HasKey_prototype.constructor = HasKey;
            HasKey.displayName = "HasKey";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(HasKey);
            }
            _HasKey_prototype.name = "in";
            _HasKey_prototype._type = function () {
              return Type.boolean;
            };
            return HasKey;
          }(BinaryOperator)),
          "&&": LogicalAnd = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _LogicalAnd_prototype;
            function LogicalAnd(index) {
              var _this;
              _this = this instanceof LogicalAnd ? this : __create(_LogicalAnd_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _LogicalAnd_prototype = LogicalAnd.prototype = __create(_BinaryOperator_prototype2);
            _LogicalAnd_prototype.constructor = LogicalAnd;
            LogicalAnd.displayName = "LogicalAnd";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(LogicalAnd);
            }
            _LogicalAnd_prototype.name = "&&";
            _LogicalAnd_prototype._type = (function () {
              var cache;
              cache = Cache();
              return function (call, parser) {
                var _value;
                _value = cache.get(call);
                if (_value === void 0) {
                  _value = call.args[0].type(parser).intersect(Type.potentiallyFalsy).union(call.args[1].type(parser));
                  cache.set(call, _value);
                }
                return _value;
              };
            }());
            _LogicalAnd_prototype.__reduce = function (call, parser) {
              var left, leftType, right;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst()) {
                if (left.constValue()) {
                  return right;
                } else {
                  return left;
                }
              }
              leftType = left.type(parser);
              if (leftType.isSubsetOf(Type.alwaysTruthy)) {
                return Call(
                  call.index,
                  call.scope,
                  Symbol.block(call.index),
                  left,
                  right
                );
              } else if (leftType.isSubsetOf(Type.alwaysFalsy)) {
                return left;
              } else if (left instanceof Call && left.isBinaryCall("&&")) {
                return Call(
                  call.index,
                  call.scope,
                  left.func,
                  left.args[0],
                  Call(
                    left.args[1].index,
                    call.scope,
                    call.func,
                    left.args[1],
                    right
                  )
                );
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return LogicalAnd;
          }(BinaryOperator)),
          "||": LogicalOr = (function (BinaryOperator) {
            var _BinaryOperator_prototype2, _LogicalOr_prototype;
            function LogicalOr(index) {
              var _this;
              _this = this instanceof LogicalOr ? this : __create(_LogicalOr_prototype);
              _this.index = index;
              return _this;
            }
            _BinaryOperator_prototype2 = BinaryOperator.prototype;
            _LogicalOr_prototype = LogicalOr.prototype = __create(_BinaryOperator_prototype2);
            _LogicalOr_prototype.constructor = LogicalOr;
            LogicalOr.displayName = "LogicalOr";
            if (typeof BinaryOperator.extended === "function") {
              BinaryOperator.extended(LogicalOr);
            }
            _LogicalOr_prototype.name = "||";
            _LogicalOr_prototype._type = (function () {
              var cache;
              cache = Cache();
              return function (call, parser) {
                var _value;
                _value = cache.get(call);
                if (_value === void 0) {
                  _value = call.args[0].type(parser).intersect(Type.potentiallyTruthy).union(call.args[1].type(parser));
                  cache.set(call, _value);
                }
                return _value;
              };
            }());
            _LogicalOr_prototype.__reduce = function (call, parser) {
              var left, leftType, right, test, whenTrue;
              left = call.args[0].reduce(parser);
              right = call.args[1].reduce(parser);
              if (left.isConst()) {
                if (left.constValue()) {
                  return left;
                } else {
                  return right;
                }
              }
              leftType = left.type(parser);
              if (leftType.isSubsetOf(Type.alwaysTruthy)) {
                return left;
              } else if (leftType.isSubsetOf(Type.alwaysFalsy)) {
                return Call(
                  call.index,
                  call.scope,
                  Symbol.block(call.index),
                  left,
                  right
                );
              } else if (left instanceof Call && left.isBinaryCall("||")) {
                return Call(
                  call.index,
                  call.scope,
                  left.func,
                  left.args[0],
                  Call(
                    left.args[1].index,
                    call.scope,
                    call.func,
                    left.args[1],
                    right
                  )
                );
              } else if (left instanceof Call && left.isInternalCall("if") && left.args[2].isConst() && !left.args[2].constValue()) {
                test = left.args[0];
                whenTrue = left.args[1];
                while (whenTrue instanceof Call && whenTrue.isInternalCall("if") && whenTrue.args[2].isConst() && !whenTrue.args[2].constValue()) {
                  test = Call(
                    left.index,
                    left.scope,
                    Symbol.binary["&&"](left.index),
                    test,
                    whenTrue.args[0]
                  );
                  whenTrue = whenTrue.args[1];
                }
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  Call(
                    left.index,
                    left.scope,
                    Symbol.binary["&&"](left.index),
                    test,
                    whenTrue
                  ),
                  right
                );
              } else if (left !== call.args[0] || right !== call.args[1]) {
                return Call(
                  call.index,
                  call.scope,
                  call.func,
                  left,
                  right
                );
              } else {
                return call;
              }
            };
            return LogicalOr;
          }(BinaryOperator))
        };
        return BinaryOperator;
      }(Operator));
      UnaryOperator = (function (Operator) {
        var _Operator_prototype2, _UnaryOperator_prototype, BitwiseNot,
            Decrement, Delete, Increment, Negate, Not, PostDecrement,
            PostIncrement, ToNumber, Typeof;
        function UnaryOperator() {
          var _this;
          _this = this instanceof UnaryOperator ? this : __create(_UnaryOperator_prototype);
          throw new Error("UnaryOperator is not meant to be instantiated directly");
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
        _UnaryOperator_prototype.operatorTypeId = 1;
        _UnaryOperator_prototype.inspect = function () {
          return "Symbol.unary[" + toJSSource(this.name) + "]";
        };
        _UnaryOperator_prototype.validateArgs = function (node) {
          var rest;
          rest = __slice.call(arguments, 1);
        };
        function noopUnary(call, parser) {
          return call.args[0].isNoop(parser);
        }
        function symbolicToString(call) {
          return "(" + this.name + call.args[0].toString() + ")";
        }
        function wordyToString(call) {
          return this.name + " " + call.args[0].toString();
        }
        Symbol.unary = {
          "+": ToNumber = (function (UnaryOperator) {
            var _ToNumber_prototype, _UnaryOperator_prototype2;
            function ToNumber(index) {
              var _this;
              _this = this instanceof ToNumber ? this : __create(_ToNumber_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _ToNumber_prototype = ToNumber.prototype = __create(_UnaryOperator_prototype2);
            _ToNumber_prototype.constructor = ToNumber;
            ToNumber.displayName = "ToNumber";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(ToNumber);
            }
            _ToNumber_prototype.name = "+";
            _ToNumber_prototype._toString = symbolicToString;
            _ToNumber_prototype._type = function () {
              return Type.number;
            };
            _ToNumber_prototype._isNoop = noopUnary;
            _ToNumber_prototype.__reduce = function (call, parser) {
              var node;
              node = call.args[0].reduce(parser);
              if (node.isConst()) {
                return Value(call.index, +node.constValue());
              } else if (node.type(parser).isSubsetOf(Type.number)) {
                return node;
              } else if (node !== call.args[0]) {
                return Call(call.index, call.scope, call.func, node);
              } else {
                return call;
              }
            };
            return ToNumber;
          }(UnaryOperator)),
          "-": Negate = (function (UnaryOperator) {
            var _Negate_prototype, _UnaryOperator_prototype2;
            function Negate(index) {
              var _this;
              _this = this instanceof Negate ? this : __create(_Negate_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Negate_prototype = Negate.prototype = __create(_UnaryOperator_prototype2);
            _Negate_prototype.constructor = Negate;
            Negate.displayName = "Negate";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Negate);
            }
            _Negate_prototype.name = "-";
            _Negate_prototype._toString = symbolicToString;
            _Negate_prototype._type = function () {
              return Type.number;
            };
            _Negate_prototype._isNoop = noopUnary;
            _Negate_prototype.__reduce = function (call, parser) {
              var _ref, node;
              node = call.args[0].reduce(parser);
              if (node.isConst()) {
                return Value(call.index, -node.constValue());
              } else if (node instanceof Call) {
                if ((_ref = node.func) instanceof ToNumber || _ref instanceof Negate) {
                  return Call(
                    call.index,
                    call.scope,
                    node.func instanceof ToNumber ? Negate(call.index) : ToNumber(call.index),
                    node.args[0]
                  );
                } else if (node.func instanceof BinaryOperator) {
                  if ((_ref = node.func.name) === "-" || _ref === "+") {
                    return Call(
                      call.index,
                      call.scope,
                      Symbol.binary[node.func.name === "-" ? "+" : "-"](call.index),
                      Call(node.args[0].index, node.args[0].scope, Negate(node.args[0].index), node.args[0]),
                      node.args[1]
                    );
                  } else if ((_ref = node.func.name) === "*" || _ref === "/") {
                    return Call(
                      call.index,
                      call.scope,
                      node.func,
                      Call(node.args[0].index, node.args[0].scope, Negate(node.args[0].index), node.args[0]),
                      node.args[1]
                    );
                  }
                }
              }
              if (node !== call.args[0]) {
                return Call(call.index, call.scope, call.func, node);
              } else {
                return call;
              }
            };
            return Negate;
          }(UnaryOperator)),
          "++": Increment = (function (UnaryOperator) {
            var _Increment_prototype, _UnaryOperator_prototype2;
            function Increment(index) {
              var _this;
              _this = this instanceof Increment ? this : __create(_Increment_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Increment_prototype = Increment.prototype = __create(_UnaryOperator_prototype2);
            _Increment_prototype.constructor = Increment;
            Increment.displayName = "Increment";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Increment);
            }
            _Increment_prototype.name = "++";
            _Increment_prototype._toString = symbolicToString;
            _Increment_prototype._type = function () {
              return Type.number;
            };
            return Increment;
          }(UnaryOperator)),
          "--": Decrement = (function (UnaryOperator) {
            var _Decrement_prototype, _UnaryOperator_prototype2;
            function Decrement(index) {
              var _this;
              _this = this instanceof Decrement ? this : __create(_Decrement_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Decrement_prototype = Decrement.prototype = __create(_UnaryOperator_prototype2);
            _Decrement_prototype.constructor = Decrement;
            Decrement.displayName = "Decrement";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Decrement);
            }
            _Decrement_prototype.name = "--";
            _Decrement_prototype._toString = symbolicToString;
            _Decrement_prototype._type = function () {
              return Type.number;
            };
            return Decrement;
          }(UnaryOperator)),
          "++post": PostIncrement = (function (UnaryOperator) {
            var _PostIncrement_prototype, _UnaryOperator_prototype2;
            function PostIncrement(index) {
              var _this;
              _this = this instanceof PostIncrement ? this : __create(_PostIncrement_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _PostIncrement_prototype = PostIncrement.prototype = __create(_UnaryOperator_prototype2);
            _PostIncrement_prototype.constructor = PostIncrement;
            PostIncrement.displayName = "PostIncrement";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(PostIncrement);
            }
            _PostIncrement_prototype.name = "++post";
            _PostIncrement_prototype._toString = function (call) {
              return "(" + call.args[0].toString() + "++)";
            };
            _PostIncrement_prototype._type = function () {
              return Type.number;
            };
            return PostIncrement;
          }(UnaryOperator)),
          "--post": PostDecrement = (function (UnaryOperator) {
            var _PostDecrement_prototype, _UnaryOperator_prototype2;
            function PostDecrement(index) {
              var _this;
              _this = this instanceof PostDecrement ? this : __create(_PostDecrement_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _PostDecrement_prototype = PostDecrement.prototype = __create(_UnaryOperator_prototype2);
            _PostDecrement_prototype.constructor = PostDecrement;
            PostDecrement.displayName = "PostDecrement";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(PostDecrement);
            }
            _PostDecrement_prototype.name = "--post";
            _PostDecrement_prototype._toString = function (call) {
              return "(" + call.args[0].toString() + "--)";
            };
            _PostDecrement_prototype._type = function () {
              return Type.number;
            };
            return PostDecrement;
          }(UnaryOperator)),
          "!": Not = (function (UnaryOperator) {
            var _Not_prototype, _UnaryOperator_prototype2, invertibleBinaryOps;
            function Not(index) {
              var _this;
              _this = this instanceof Not ? this : __create(_Not_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Not_prototype = Not.prototype = __create(_UnaryOperator_prototype2);
            _Not_prototype.constructor = Not;
            Not.displayName = "Not";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Not);
            }
            _Not_prototype.name = "!";
            _Not_prototype._toString = symbolicToString;
            _Not_prototype._type = function () {
              return Type.boolean;
            };
            _Not_prototype._isNoop = noopUnary;
            invertibleBinaryOps = {
              "<": ">=",
              "<=": ">",
              ">": "<=",
              ">=": "<",
              "==": "!=",
              "!=": "==",
              "===": "!==",
              "!==": "===",
              "&&": function (x, y) {
                return Call(
                  this.index,
                  this.scope,
                  Symbol.binary["||"](this.index),
                  Call(x.index, x.scope, Not(x.index), x),
                  Call(y.index, y.scope, Not(y.index), y)
                );
              },
              "||": function (x, y) {
                return Call(
                  this.index,
                  this.scope,
                  Symbol.binary["&&"](this.index),
                  Call(x.index, x.scope, Not(x.index), x),
                  Call(y.index, y.scope, Not(y.index), y)
                );
              }
            };
            _Not_prototype.__reduce = function (call, parser) {
              var invert, node;
              node = call.args[0].reduce(parser);
              if (node.isConst()) {
                return Value(call.index, !node.constValue());
              } else if (node instanceof Call) {
                if (node.func instanceof Not) {
                  if (node.args[0].type(parser).isSubsetOf(Type.boolean)) {
                    return node.args[0];
                  }
                } else if (node.func instanceof BinaryOperator && __owns.call(invertibleBinaryOps, node.func.name)) {
                  invert = invertibleBinaryOps[node.func.name];
                  if (typeof invert === "function") {
                    return invert.call(call, node.args[0], node.args[1]);
                  } else {
                    return Call(
                      call.index,
                      call.scope,
                      Symbol.binary[invert](call.index),
                      node.args[0],
                      node.args[1]
                    );
                  }
                }
              }
              if (node !== call.args[0]) {
                return Call(call.index, call.scope, call.func, node);
              } else {
                return call;
              }
            };
            return Not;
          }(UnaryOperator)),
          "~": BitwiseNot = (function (UnaryOperator) {
            var _BitwiseNot_prototype, _UnaryOperator_prototype2;
            function BitwiseNot(index) {
              var _this;
              _this = this instanceof BitwiseNot ? this : __create(_BitwiseNot_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _BitwiseNot_prototype = BitwiseNot.prototype = __create(_UnaryOperator_prototype2);
            _BitwiseNot_prototype.constructor = BitwiseNot;
            BitwiseNot.displayName = "BitwiseNot";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(BitwiseNot);
            }
            _BitwiseNot_prototype.name = "~";
            _BitwiseNot_prototype._toString = symbolicToString;
            _BitwiseNot_prototype._type = function () {
              return Type.number;
            };
            _BitwiseNot_prototype._isNoop = noopUnary;
            _BitwiseNot_prototype.__reduce = function (call, parser) {
              var node;
              node = call.args[0].reduce(parser);
              if (node.isConst()) {
                return Value(call.index, ~node.constValue());
              } else if (node !== call.args[0]) {
                return Call(call.index, call.scope, call.func, node);
              } else {
                return call;
              }
            };
            return BitwiseNot;
          }(UnaryOperator)),
          "typeof": Typeof = (function (UnaryOperator) {
            var _Typeof_prototype, _UnaryOperator_prototype2, objectType;
            function Typeof(index) {
              var _this;
              _this = this instanceof Typeof ? this : __create(_Typeof_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Typeof_prototype = Typeof.prototype = __create(_UnaryOperator_prototype2);
            _Typeof_prototype.constructor = Typeof;
            Typeof.displayName = "Typeof";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Typeof);
            }
            _Typeof_prototype.name = "typeof";
            _Typeof_prototype._toString = wordyToString;
            _Typeof_prototype._type = function () {
              return Type.string;
            };
            _Typeof_prototype._isNoop = noopUnary;
            objectType = Type["null"].union(Type.object).union(Type.arrayLike).union(Type.regexp).union(Type.date).union(Type.error);
            _Typeof_prototype.__reduce = function (call, parser) {
              var node, type;
              node = call.args[0].reduce(parser);
              if (node.isConst()) {
                return Value(call.index, typeof node.constValue());
              } else if (node.isNoop(parser)) {
                type = node.type(parser);
                if (type.isSubsetOf(Type.number)) {
                  return Value(call.index, "number");
                } else if (type.isSubsetOf(Type.string)) {
                  return Value(call.index, "string");
                } else if (type.isSubsetOf(Type.boolean)) {
                  return Value(call.index, "boolean");
                } else if (type.isSubsetOf(Type["undefined"])) {
                  return Value(call.index, "undefined");
                } else if (type.isSubsetOf(Type["function"])) {
                  return Value(call.index, "function");
                } else if (type.isSubsetOf(objectType)) {
                  return Value(call.index, "object");
                }
              }
              if (node !== call.args[0]) {
                return Call(call.index, call.scope, call.func, node);
              } else {
                return call;
              }
            };
            return Typeof;
          }(UnaryOperator)),
          "delete": Delete = (function (UnaryOperator) {
            var _Delete_prototype, _UnaryOperator_prototype2;
            function Delete(index) {
              var _this;
              _this = this instanceof Delete ? this : __create(_Delete_prototype);
              _this.index = index;
              return _this;
            }
            _UnaryOperator_prototype2 = UnaryOperator.prototype;
            _Delete_prototype = Delete.prototype = __create(_UnaryOperator_prototype2);
            _Delete_prototype.constructor = Delete;
            Delete.displayName = "Delete";
            if (typeof UnaryOperator.extended === "function") {
              UnaryOperator.extended(Delete);
            }
            _Delete_prototype.name = "delete";
            _Delete_prototype._toString = wordyToString;
            _Delete_prototype._type = function () {
              return Type.boolean;
            };
            return Delete;
          }(UnaryOperator))
        };
        return UnaryOperator;
      }(Operator));
      AssignOperator = (function (Operator) {
        var _AssignOperator_prototype, _Operator_prototype2,
            AddOrStringConcatAssign, BitwiseAndAssign, BitwiseLeftShiftAssign,
            BitwiseOrAssign, BitwiseRightShiftAssign,
            BitwiseUnsignedRightShiftAssign, BitwiseXorAssign, DivideAssign,
            ModuloAssign, MultiplyAssign, NormalAssign, SubtractAssign;
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
        _AssignOperator_prototype.operatorTypeId = 2;
        _AssignOperator_prototype.inspect = function () {
          return "Symbol.assign[" + toJSSource(this.name) + "]";
        };
        _AssignOperator_prototype.validateArgs = function (left, right) {
          var rest;
          rest = __slice.call(arguments, 2);
        };
        _AssignOperator_prototype._toString = function (call) {
          return call.args[0].toString() + " " + this.name + " " + call.args[1].toString();
        };
        Symbol.assign = {
          "=": NormalAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _NormalAssign_prototype;
            function NormalAssign(index) {
              var _this;
              _this = this instanceof NormalAssign ? this : __create(_NormalAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _NormalAssign_prototype = NormalAssign.prototype = __create(_AssignOperator_prototype2);
            _NormalAssign_prototype.constructor = NormalAssign;
            NormalAssign.displayName = "NormalAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(NormalAssign);
            }
            _NormalAssign_prototype.name = "=";
            _NormalAssign_prototype._type = function (call, parser) {
              return call.args[1].type(parser);
            };
            return NormalAssign;
          }(AssignOperator)),
          "+=": AddOrStringConcatAssign = (function (AssignOperator) {
            var _AddOrStringConcatAssign_prototype, _AssignOperator_prototype2;
            function AddOrStringConcatAssign(index) {
              var _this;
              _this = this instanceof AddOrStringConcatAssign ? this : __create(_AddOrStringConcatAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _AddOrStringConcatAssign_prototype = AddOrStringConcatAssign.prototype = __create(_AssignOperator_prototype2);
            _AddOrStringConcatAssign_prototype.constructor = AddOrStringConcatAssign;
            AddOrStringConcatAssign.displayName = "AddOrStringConcatAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(AddOrStringConcatAssign);
            }
            _AddOrStringConcatAssign_prototype.name = "+=";
            _AddOrStringConcatAssign_prototype._type = (function () {
              var cache;
              cache = Cache();
              return function (call, parser) {
                var _value;
                _value = cache.get(call);
                if (_value === void 0) {
                  _value = (function () {
                    var left, right;
                    left = call.args[0].type(parser);
                    right = call.args[1].type(parser);
                    if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
                      return Type.number;
                    } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
                      return Type.stringOrNumber;
                    } else {
                      return Type.string;
                    }
                  }());
                  cache.set(call, _value);
                }
                return _value;
              };
            }());
            return AddOrStringConcatAssign;
          }(AssignOperator)),
          "-=": SubtractAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _SubtractAssign_prototype;
            function SubtractAssign(index) {
              var _this;
              _this = this instanceof SubtractAssign ? this : __create(_SubtractAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _SubtractAssign_prototype = SubtractAssign.prototype = __create(_AssignOperator_prototype2);
            _SubtractAssign_prototype.constructor = SubtractAssign;
            SubtractAssign.displayName = "SubtractAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(SubtractAssign);
            }
            _SubtractAssign_prototype.name = "-=";
            _SubtractAssign_prototype._type = function () {
              return Type.number;
            };
            return SubtractAssign;
          }(AssignOperator)),
          "*=": MultiplyAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _MultiplyAssign_prototype;
            function MultiplyAssign(index) {
              var _this;
              _this = this instanceof MultiplyAssign ? this : __create(_MultiplyAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _MultiplyAssign_prototype = MultiplyAssign.prototype = __create(_AssignOperator_prototype2);
            _MultiplyAssign_prototype.constructor = MultiplyAssign;
            MultiplyAssign.displayName = "MultiplyAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(MultiplyAssign);
            }
            _MultiplyAssign_prototype.name = "*=";
            _MultiplyAssign_prototype._type = function () {
              return Type.number;
            };
            return MultiplyAssign;
          }(AssignOperator)),
          "/=": DivideAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _DivideAssign_prototype;
            function DivideAssign(index) {
              var _this;
              _this = this instanceof DivideAssign ? this : __create(_DivideAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _DivideAssign_prototype = DivideAssign.prototype = __create(_AssignOperator_prototype2);
            _DivideAssign_prototype.constructor = DivideAssign;
            DivideAssign.displayName = "DivideAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(DivideAssign);
            }
            _DivideAssign_prototype.name = "/=";
            _DivideAssign_prototype._type = function () {
              return Type.number;
            };
            return DivideAssign;
          }(AssignOperator)),
          "%=": ModuloAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _ModuloAssign_prototype;
            function ModuloAssign(index) {
              var _this;
              _this = this instanceof ModuloAssign ? this : __create(_ModuloAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _ModuloAssign_prototype = ModuloAssign.prototype = __create(_AssignOperator_prototype2);
            _ModuloAssign_prototype.constructor = ModuloAssign;
            ModuloAssign.displayName = "ModuloAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(ModuloAssign);
            }
            _ModuloAssign_prototype.name = "%=";
            _ModuloAssign_prototype._type = function () {
              return Type.number;
            };
            return ModuloAssign;
          }(AssignOperator)),
          "<<=": BitwiseLeftShiftAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _BitwiseLeftShiftAssign_prototype;
            function BitwiseLeftShiftAssign(index) {
              var _this;
              _this = this instanceof BitwiseLeftShiftAssign ? this : __create(_BitwiseLeftShiftAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseLeftShiftAssign_prototype = BitwiseLeftShiftAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseLeftShiftAssign_prototype.constructor = BitwiseLeftShiftAssign;
            BitwiseLeftShiftAssign.displayName = "BitwiseLeftShiftAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseLeftShiftAssign);
            }
            _BitwiseLeftShiftAssign_prototype.name = "<<=";
            _BitwiseLeftShiftAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseLeftShiftAssign;
          }(AssignOperator)),
          ">>=": BitwiseRightShiftAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _BitwiseRightShiftAssign_prototype;
            function BitwiseRightShiftAssign(index) {
              var _this;
              _this = this instanceof BitwiseRightShiftAssign ? this : __create(_BitwiseRightShiftAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseRightShiftAssign_prototype = BitwiseRightShiftAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseRightShiftAssign_prototype.constructor = BitwiseRightShiftAssign;
            BitwiseRightShiftAssign.displayName = "BitwiseRightShiftAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseRightShiftAssign);
            }
            _BitwiseRightShiftAssign_prototype.name = ">>=";
            _BitwiseRightShiftAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseRightShiftAssign;
          }(AssignOperator)),
          ">>>=": BitwiseUnsignedRightShiftAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2,
                _BitwiseUnsignedRightShiftAssign_prototype;
            function BitwiseUnsignedRightShiftAssign(index) {
              var _this;
              _this = this instanceof BitwiseUnsignedRightShiftAssign ? this : __create(_BitwiseUnsignedRightShiftAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseUnsignedRightShiftAssign_prototype = BitwiseUnsignedRightShiftAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseUnsignedRightShiftAssign_prototype.constructor = BitwiseUnsignedRightShiftAssign;
            BitwiseUnsignedRightShiftAssign.displayName = "BitwiseUnsignedRightShiftAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseUnsignedRightShiftAssign);
            }
            _BitwiseUnsignedRightShiftAssign_prototype.name = ">>>=";
            _BitwiseUnsignedRightShiftAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseUnsignedRightShiftAssign;
          }(AssignOperator)),
          "&=": BitwiseAndAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _BitwiseAndAssign_prototype;
            function BitwiseAndAssign(index) {
              var _this;
              _this = this instanceof BitwiseAndAssign ? this : __create(_BitwiseAndAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseAndAssign_prototype = BitwiseAndAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseAndAssign_prototype.constructor = BitwiseAndAssign;
            BitwiseAndAssign.displayName = "BitwiseAndAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseAndAssign);
            }
            _BitwiseAndAssign_prototype.name = "&=";
            _BitwiseAndAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseAndAssign;
          }(AssignOperator)),
          "|=": BitwiseOrAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _BitwiseOrAssign_prototype;
            function BitwiseOrAssign(index) {
              var _this;
              _this = this instanceof BitwiseOrAssign ? this : __create(_BitwiseOrAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseOrAssign_prototype = BitwiseOrAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseOrAssign_prototype.constructor = BitwiseOrAssign;
            BitwiseOrAssign.displayName = "BitwiseOrAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseOrAssign);
            }
            _BitwiseOrAssign_prototype.name = "|=";
            _BitwiseOrAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseOrAssign;
          }(AssignOperator)),
          "^=": BitwiseXorAssign = (function (AssignOperator) {
            var _AssignOperator_prototype2, _BitwiseXorAssign_prototype;
            function BitwiseXorAssign(index) {
              var _this;
              _this = this instanceof BitwiseXorAssign ? this : __create(_BitwiseXorAssign_prototype);
              _this.index = index;
              return _this;
            }
            _AssignOperator_prototype2 = AssignOperator.prototype;
            _BitwiseXorAssign_prototype = BitwiseXorAssign.prototype = __create(_AssignOperator_prototype2);
            _BitwiseXorAssign_prototype.constructor = BitwiseXorAssign;
            BitwiseXorAssign.displayName = "BitwiseXorAssign";
            if (typeof AssignOperator.extended === "function") {
              AssignOperator.extended(BitwiseXorAssign);
            }
            _BitwiseXorAssign_prototype.name = "^=";
            _BitwiseXorAssign_prototype._type = function () {
              return Type.number;
            };
            return BitwiseXorAssign;
          }(AssignOperator))
        };
        return AssignOperator;
      }(Operator));
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
      while (args.length === 1 && __isArray(args[0])) {
        args = args[0];
      }
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
    _Call_prototype.nodeTypeId = 2;
    _Call_prototype.cacheable = true;
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
    _Call_prototype.toString = function () {
      var _arr, _len, arg, i, sb;
      if (typeof this.func._toString === "function") {
        return this.func._toString(this);
      } else {
        sb = [];
        sb.push(this.func);
        sb.push("(");
        for (_arr = __toArray(this.args), i = 0, _len = _arr.length; i < _len; ++i) {
          arg = _arr[i];
          if (i > 0) {
            sb.push(", ");
          }
          sb.push(arg);
        }
        sb.push(")");
        return sb.join("");
      }
    };
    _Call_prototype.equals = function (other) {
      var _arr, _len, arg, args, i, len, otherArgs;
      if (other === this) {
        return true;
      }
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
    _Call_prototype.type = function (parser) {
      var _ref, func, reduced;
      reduced = this.reduce(parser);
      if (reduced === this) {
        func = this.func;
        if (typeof func._type === "function" && (_ref = func._type(this, parser)) != null) {
          return _ref;
        }
        return func.type(parser).returnType();
      } else {
        return reduced.type(parser);
      }
    };
    _Call_prototype._type = function (call, parser) {
      if (typeof this.func.__type === "function") {
        return this.func.__type(this, call, parser);
      }
    };
    _Call_prototype.returnType = function (parser, isLast) {
      var _ref, func, reduced;
      reduced = this.reduce(parser);
      if (reduced === this) {
        func = this.func;
        if (typeof func._returnType === "function" && (_ref = func._returnType(this, parser, isLast)) != null) {
          return _ref;
        }
        return _Node_prototype.returnType.call(this, parser, isLast);
      } else {
        return reduced.returnType(parser, isLast);
      }
    };
    _Call_prototype._reduce = function (parser) {
      var _ref, reduced;
      reduced = this.walk(
        function (x) {
          return x.reduce(this);
        },
        parser
      );
      if (reduced.func.doWrapArgs) {
        reduced = reduced.walk(
          function (x) {
            return x.doWrap(this);
          },
          parser
        );
      }
      if (typeof reduced.func.__reduce === "function" && (_ref = reduced.func.__reduce(reduced, parser)) != null) {
        return _ref;
      }
      return reduced;
    };
    _Call_prototype.__reduce = function (call, parser) {
      if (typeof this.func.___reduce === "function") {
        return this.func.___reduce(this, call, parser);
      }
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
        return Call.apply(void 0, [this.index, this.scope, func].concat(args));
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
          throw new Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (typeof _e !== "undefined" && _e !== null) {
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
                throw new Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (typeof _e2 !== "undefined" && _e2 !== null) {
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
    _Call_prototype.isLiteral = function () {
      if (typeof this.func._isLiteral === "function") {
        return this.func._isLiteral(this);
      } else {
        return false;
      }
    };
    _Call_prototype.literalValue = function () {
      if (typeof this.func._literalValue === "function") {
        return this.func._literalValue(this);
      } else {
        return _Node_prototype.literalValue.call(this);
      }
    };
    _Call_prototype.isNoop = function (parser) {
      var self;
      self = this.reduce(parser);
      if (typeof self.func._isNoop === "function") {
        return self.func._isNoop(self, parser);
      } else {
        return false;
      }
    };
    _Call_prototype.isStatement = function () {
      var func;
      func = this.func;
      if (typeof func._isStatement === "function") {
        return func._isStatement(this);
      } else if (func instanceof Symbol) {
        return func.isInternal && func.usedAsStatement;
      } else {
        return false;
      }
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
        result = Call(this.index, this.scope, InternalCall(
          "function",
          this.index,
          this.scope,
          InternalCall("array", this.index, this.scope),
          InternalCall("autoReturn", this.index, innerScope, this.rescope(innerScope)),
          Value(this.index, true),
          Symbol.nothing(this.index),
          Value(this.index, false)
        ));
        parser.popScope();
        return result;
      } else {
        return this;
      }
    };
    _Call_prototype.withLabel = function (label, parser) {
      if (typeof this.func._withLabel === "function") {
        return this.func._withLabel(this, label, parser);
      } else {
        return _Node_prototype.withLabel.call(this, label, parser);
      }
    };
    function isNameMatch(name, args) {
      switch (args.length) {
      case 0: return true;
      case 1: return name === args[0];
      default:
        return __in(name, args);
      }
    }
    _Call_prototype.isInternalCall = function () {
      var func;
      func = this.func;
      if (func.isSymbol && func.isInternal) {
        return isNameMatch(func.name, arguments);
      } else {
        return false;
      }
    };
    _Call_prototype.isUnaryCall = function () {
      var func;
      func = this.func;
      if (func.isSymbol && func.isOperator && func.isUnary) {
        return isNameMatch(func.name, arguments);
      } else {
        return false;
      }
    };
    _Call_prototype.isBinaryCall = function () {
      var func;
      func = this.func;
      if (func.isSymbol && func.isOperator && func.isBinary) {
        return isNameMatch(func.name, arguments);
      } else {
        return false;
      }
    };
    _Call_prototype.isAssignCall = function () {
      var func;
      func = this.func;
      if (func.isSymbol && func.isOperator && func.isAssign) {
        return isNameMatch(func.name, arguments);
      } else {
        return false;
      }
    };
    _Call_prototype.isNormalCall = function () {
      var func;
      func = this.func;
      return !func.isSymbol || !func.isInternal && !func.isOperator;
    };
    return Call;
  }(Node));
  function InternalCall(internalName, index, scope) {
    var args;
    args = __slice.call(arguments, 3);
    return Call.apply(void 0, [index, scope, Symbol[internalName](index)].concat(args));
  }
  MacroAccess = (function (Node) {
    var _MacroAccess_prototype, _Node_prototype;
    function MacroAccess(index, scope, id, data, inStatement, inGenerator, inEvilAst, doWrapped) {
      var _this;
      _this = this instanceof MacroAccess ? this : __create(_MacroAccess_prototype);
      _this.index = index;
      _this.scope = scope;
      _this.id = id;
      _this.data = data;
      if (inStatement == null) {
        inStatement = false;
      }
      _this.inStatement = inStatement;
      if (inGenerator == null) {
        inGenerator = false;
      }
      _this.inGenerator = inGenerator;
      if (inEvilAst == null) {
        inEvilAst = false;
      }
      _this.inEvilAst = inEvilAst;
      if (doWrapped == null) {
        doWrapped = false;
      }
      _this.doWrapped = doWrapped;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _MacroAccess_prototype = MacroAccess.prototype = __create(_Node_prototype);
    _MacroAccess_prototype.constructor = MacroAccess;
    MacroAccess.displayName = "MacroAccess";
    if (typeof Node.extended === "function") {
      Node.extended(MacroAccess);
    }
    _MacroAccess_prototype.isMacroAccess = true;
    _MacroAccess_prototype.nodeType = "macroAccess";
    _MacroAccess_prototype.nodeTypeId = 3;
    _MacroAccess_prototype.cacheable = true;
    _MacroAccess_prototype.inspect = function (depth) {
      var _arr, _i, _len, depth1, inspect, key, sb;
      if (depth != null) {
        depth1 = depth - 1;
      } else {
        depth1 = null;
      }
      sb = [];
      sb.push("MacroAccess(");
      sb.push("\n  id: ");
      sb.push(this.id);
      sb.push("\n  data: ");
      inspect = require("util").inspect;
      sb.push(inspect(this.data, null, depth1).split("\n").join("\n  "));
      for (_arr = ["inStatement", "inGenerator", "inEvilAst", "doWrapped"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        key = _arr[_i];
        if (this[key]) {
          sb.push("\n  ");
          sb.push(key);
          sb.push(": true");
        }
      }
      sb.push(")");
      return sb.join("");
    };
    _MacroAccess_prototype.toString = function () {
      var _arr, _i, _len, _obj, i, k, key, sb, v;
      sb = [];
      sb.push("macro(");
      sb.push(this.id);
      sb.push(", ");
      sb.push("{");
      _obj = this.data;
      i = -1;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          ++i;
          v = _obj[k];
          if (i > 0) {
            sb.push(", ");
          }
          sb.push(k);
          sb.push(": ");
          if (typeof v === "string") {
            sb.push(toJSSource(v));
          } else {
            sb.push(v);
          }
        }
      }
      sb.push("}");
      for (_arr = ["inStatement", "inGenerator", "inEvilAst", "doWrapped"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        key = _arr[_i];
        if (this[key]) {
          sb.push(", +");
          sb.push(key);
        }
      }
      sb.push(")");
      return sb.join("");
    };
    _MacroAccess_prototype.equals = (function () {
      function objectEql(left, right) {
        var _every, _i, _len, key, leftKeys, rightKeys;
        leftKeys = __keys(left);
        rightKeys = __keys(right);
        if (arrayEql(leftKeys, rightKeys)) {
          _every = true;
          for (_i = 0, _len = leftKeys.length; _i < _len; ++_i) {
            key = leftKeys[_i];
            if (!itemEql(left[key], right[key])) {
              _every = false;
              break;
            }
          }
          return _every;
        } else {
          return false;
        }
      }
      function arrayEql(left, right) {
        var _every, i, len;
        len = left.length;
        if (right.length !== len) {
          return false;
        } else {
          _every = true;
          for (i = 0; i < len; ++i) {
            if (!itemEql(left[i], right[i])) {
              _every = false;
              break;
            }
          }
          return _every;
        }
      }
      function itemEql(left, right) {
        if (left === right) {
          return true;
        } else if (left instanceof Node) {
          return right instanceof Node && left.equals(right);
        } else if (__isArray(left)) {
          return arrayEql(left, right);
        } else if (typeof left === "object" && left !== null) {
          return objectEql(left, right);
        } else {
          return false;
        }
      }
      return function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof MacroAccess) {
          if (this.inStatement !== other.inStatement || this.inGenerator !== other.inGenerator || this.inEvilAst !== other.inEvilAst || this.doWrapped !== other.doWrapped) {
            return false;
          } else {
            return objectEql(this.data, other.data);
          }
        } else {
          return false;
        }
      };
    }());
    _MacroAccess_prototype.type = (function () {
      var cache;
      cache = Cache();
      return function (parser) {
        var _this, _value;
        _this = this;
        _value = cache.get(this);
        if (_value === void 0) {
          _value = (function () {
            var type;
            type = parser.macros.getTypeById(_this.id);
            if (type != null) {
              if (typeof type === "string") {
                return _this.data[type].type(parser);
              } else {
                return type;
              }
            } else {
              return parser.macroExpand1(_this).type(parser);
            }
          }());
          cache.set(this, _value);
        }
        return _value;
      };
    }());
    _MacroAccess_prototype.withLabel = function (label, parser) {
      return parser.macroExpand1(this).withLabel(label, parser);
    };
    _MacroAccess_prototype.reduce = function () {
      return this;
    };
    _MacroAccess_prototype.walk = (function () {
      function walkArray(array, func, context) {
        var _arr, _i, _len, changed, item, newItem, result;
        result = [];
        changed = false;
        for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          item = _arr[_i];
          newItem = walkItem(item, func, context);
          if (!changed && newItem !== item) {
            changed = true;
          }
          result.push(item);
        }
        if (changed) {
          return result;
        } else {
          return array;
        }
      }
      function walkObject(obj, func, context) {
        var changed, k, newV, result, v;
        result = {};
        changed = false;
        for (k in obj) {
          if (__owns.call(obj, k)) {
            v = obj[k];
            newV = walkItem(v, func, context);
            if (!changed && newV !== v) {
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
        var _ref;
        if (item instanceof Node) {
          if ((_ref = func.call(context, item)) != null) {
            return _ref;
          } else {
            return item.walk(func, context);
          }
        } else if (__isArray(item)) {
          return walkArray(item, func, context);
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
          return MacroAccess(
            this.index,
            this.scope,
            this.id,
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
    _MacroAccess_prototype.walkAsync = (function () {
      function walkArray(array, func, context, callback) {
        var changed, result;
        changed = false;
        result = [];
        return __async(
          1,
          +array.length,
          false,
          function (_i, next) {
            var _once, item;
            item = array[_i];
            return walkItem(item, func, context, (_once = false, function (_e, newItem) {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (typeof _e !== "undefined" && _e !== null) {
                return next(_e);
              }
              if (!changed && item !== newItem) {
                changed = true;
              }
              result.push(newItem);
              return next(null);
            }));
          },
          function (err) {
            if (typeof err !== "undefined" && err !== null) {
              return callback(err);
            } else {
              return callback(null, changed ? result : array);
            }
          }
        );
      }
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
            return walkItem(v, func, context, (_once = false, function (_e, newV) {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (typeof _e !== "undefined" && _e !== null) {
                return next(_e);
              }
              if (!changed && v !== newV) {
                changed = true;
              }
              result[k] = newV;
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
          return func(item, context, function (err, value) {
            if (err) {
              return callback(err);
            } else {
              return callback(null, value != null ? value : item);
            }
          });
        } else if (__isArray(item)) {
          return walkArray(item, func, context, callback);
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
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, data !== _this.data
            ? MacroAccess(
              _this.index,
              _this.scope,
              _this.id,
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
    _MacroAccess_prototype.isNoop = function (parser) {
      return parser.macroExpand1(this).isNoop(parser);
    };
    _MacroAccess_prototype.doWrap = function () {
      if (this.doWrapped) {
        return this;
      } else {
        return MacroAccess(
          this.index,
          this.scope,
          this.id,
          this.data,
          this.inStatement,
          this.inGenerator,
          this.inEvilAst,
          true
        );
      }
    };
    _MacroAccess_prototype.mutateLast = function (parser, func, context, includeNoop) {
      return parser.macroExpand1(this).mutateLast(parser, func, context, includeNoop);
    };
    _MacroAccess_prototype.returnType = function (parser, isLast) {
      var _ref, type;
      if ((_ref = this.data.macroName) === "return" || _ref === "return?") {
        if (this.data.macroData.node) {
          return this.data.macroData.node.type(parser);
        } else {
          return Type["undefined"];
        }
      } else {
        if (isLast) {
          type = Type["undefined"];
        } else {
          type = Type.none;
        }
        this.walk(function (node) {
          type = type.union(node.returnType(parser, false));
          return node;
        });
        return type;
      }
    };
    return MacroAccess;
  }(Node));
  Node.Value = Value;
  Node.Symbol = Symbol;
  Node.Call = Call;
  Node.MacroAccess = MacroAccess;
  Node.InternalCall = InternalCall;
  Node.Access = function (index, scope, parent) {
    var _i, _len, child, children, current;
    children = __slice.call(arguments, 3);
    current = parent;
    for (_i = 0, _len = children.length; _i < _len; ++_i) {
      child = children[_i];
      current = Call(
        index,
        scope,
        Symbol.access(index),
        current,
        child
      );
    }
    return current;
  };
  module.exports = Node;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
