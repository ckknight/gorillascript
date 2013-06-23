(function () {
  "use strict";
  var __async, __create, __isArray, __keys, __once, __owns, __slice, __toArray,
      __typeof, _ref, inspect, isPrimordial, MacroAccessNode, map, mapAsync,
      Node, nodeToType, quote, Type;
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
        result = LispyNode.Call(this.index, this.scope, LispyNode.InternalCall(
          "function",
          this.index,
          this.scope,
          LispyNode.InternalCall("array", this.index, this.scope),
          LispyNode.InternalCall("return", this.index, innerScope, this.rescope(innerScope)),
          LispyNode.Value(this.index, true),
          LispyNode.Symbol.nothing(this.index),
          LispyNode.Value(this.index, false)
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
    _MacroAccessNode_prototype.returnType = function (o, isLast) {
      var _ref, type;
      if ((_ref = this.data.macroName) === "return" || _ref === "return?") {
        if (this.data.macroData.node) {
          return this.data.macroData.node.type(o);
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
          type = type.union(node.returnType(o, false));
          return node;
        });
        return type;
      }
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
  module.exports = Node;
}.call(this));
