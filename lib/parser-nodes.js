(function () {
  "use strict";
  var __create, __isArray, __slice, __toArray, __typeof, _ref, inspect,
      isPrimordial, map, mapAsync, Node, nodeToType, quote, Type;
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
  module.exports = Node;
}.call(this));
