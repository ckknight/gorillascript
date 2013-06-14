(function (GLOBAL) {
  "use strict";
  var __async, __create, __curry, __in, __isArray, __keys, __once, __owns,
      __slice, __toArray, __typeof, _ref, AccessMultiNode, AccessNode,
      ArrayNode, AssignNode, BinaryNode, BlockNode, CallNode, DefNode,
      EmbedWriteNode, EvalNode, ForNode, FunctionNode, IdentNode, IfNode,
      inspect, isPrimordial, MacroAccessNode, MacroConstNode, map, mapAsync,
      Node, nodeToType, NothingNode, ObjectNode, ParamNode, quote, RootNode,
      SpreadNode, SuperNode, SwitchNode, SyntaxChoiceNode, SyntaxManyNode,
      SyntaxParamNode, SyntaxSequenceNode, TmpNode, TmpWrapperNode, Type,
      TypeFunctionNode, TypeGenericNode, TypeObjectNode, TypeUnionNode,
      UnaryNode, VarNode;
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
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (numArgs > 1) {
      currier = function (args) {
        var ret;
        if (args.length >= numArgs) {
          return f.apply(this, args);
        } else {
          ret = function () {
            if (arguments.length === 0) {
              return ret;
            } else {
              return currier.call(this, args.concat(__slice.call(arguments)));
            }
          };
          return ret;
        }
      };
      return currier([]);
    } else {
      return f;
    }
  };
  __in = typeof Array.prototype.indexOf === "function"
    ? (function () {
      var indexOf;
      indexOf = Array.prototype.indexOf;
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }())
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
    var i, item;
    if (array.length === 0) {
      return array;
    } else {
      array = array.slice();
      for (i = +array.length; i--; ) {
        item = array[i];
        if (!item || item instanceof NothingNode || item.length === 0) {
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
      if (label == null) {
        label = null;
      }
      return BlockNode(this.index, this.scope, [this], label);
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
      throw Error("Not a const: " + __typeof(this));
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
      var innerScope, result;
      if (this.isStatement()) {
        innerScope = parser.pushScope(true, this.scope);
        result = CallNode(
          this.index,
          this.scope,
          FunctionNode(
            this.index,
            this.scope,
            [],
            this.rescope(innerScope),
            true,
            true
          ),
          []
        );
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
    var _arr, _i, _len, _some, arg, args, d, found, hasLarge, part, parts;
    args = __slice.call(arguments, 3);
    if (depth != null) {
      d = depth - 1;
    } else {
      d = null;
    }
    found = false;
    for (_i = args.length; _i--; ) {
      arg = args[_i];
      if (!arg || arg instanceof NothingNode || __isArray(arg) && arg.length === 0) {
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
  Node.Access = Node.byTypeId[1] = AccessNode = (function (Node) {
    var _AccessNode_prototype, _Node_prototype;
    function AccessNode(index, scope, parent, child) {
      var _this;
      _this = this instanceof AccessNode ? this : __create(_AccessNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.child = child;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AccessNode_prototype = AccessNode.prototype = __create(_Node_prototype);
    _AccessNode_prototype.constructor = AccessNode;
    AccessNode.displayName = "AccessNode";
    if (typeof Node.extended === "function") {
      Node.extended(AccessNode);
    }
    _AccessNode_prototype.typeId = 1;
    AccessNode.argNames = ["parent", "child"];
    _AccessNode_prototype.type = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var child, childType, childValue, isString, parentType;
          parentType = _this.parent.type(o);
          isString = parentType.isSubsetOf(Type.string);
          if (isString || parentType.isSubsetOf(Type.arrayLike)) {
            child = o.macroExpand1(_this.child).reduce(o);
            if (child.isConst()) {
              childValue = child.constValue();
              if (childValue === "length") {
                return Type.number;
              } else if (typeof childValue === "number") {
                if (childValue >= 0 && childValue % 1 === 0) {
                  if (isString) {
                    return Type.string.union(Type["undefined"]);
                  } else if (parentType.subtype) {
                    return parentType.subtype.union(Type["undefined"]);
                  } else {
                    return Type.any;
                  }
                } else {
                  return Type["undefined"];
                }
              }
            } else {
              childType = child.type(o);
              if (childType.isSubsetOf(Type.number)) {
                if (isString) {
                  return Type.string.union(Type["undefined"]);
                } else if (parentType.subtype) {
                  return parentType.subtype.union(Type["undefined"]);
                } else {
                  return Type.any;
                }
              }
            }
          } else if (parentType.isSubsetOf(Type.object) && typeof parentType.value === "function") {
            child = o.macroExpand1(_this.child).reduce(o);
            if (child.isConst()) {
              return parentType.value(String(child.constValue()));
            }
          }
          return Type.any;
        }());
      } else {
        return _ref;
      }
    };
    _AccessNode_prototype._reduce = function (o) {
      var _arr, _i, _len, _ref, args, cachedParent, child, cValue, end, hasEnd,
          hasStep, inclusive, key, parent, pValue, start, step, value;
      parent = this.parent.reduce(o).doWrap(o);
      cachedParent = null;
      function replaceLengthIdent(node) {
        var nodeParent;
        if (node instanceof IdentNode && node.name === "__currentArrayLength") {
          if (parent.cacheable && cachedParent == null) {
            cachedParent = o.makeTmp(node.index, "ref", parent.type(o));
            cachedParent.scope = node.scope;
          }
          return AccessNode(
            node.index,
            node.scope,
            cachedParent != null ? cachedParent : parent,
            LispyNode_Value(node.index, "length")
          );
        } else if (node instanceof AccessNode) {
          nodeParent = replaceLengthIdent(node.parent);
          if (nodeParent !== node.parent) {
            return AccessNode(node.index, node.scope, nodeParent, node.child).walk(replaceLengthIdent);
          } else {
            return node.walk(replaceLengthIdent);
          }
        } else {
          return node.walk(replaceLengthIdent);
        }
      }
      child = replaceLengthIdent(this.child.reduce(o).doWrap(o));
      if (cachedParent != null) {
        return TmpWrapperNode(
          this.index,
          this.scope,
          AccessNode(
            this.index,
            this.scope,
            AssignNode(
              this.index,
              this.scope,
              cachedParent,
              "=",
              parent
            ),
            child
          ),
          [cachedParent.id]
        );
      }
      if (parent.isLiteral() && child.isConst()) {
        cValue = child.constValue();
        if (parent.isConst()) {
          pValue = parent.constValue();
          if (cValue in Object(pValue)) {
            value = pValue[cValue];
            if (value === null || value instanceof RegExp || (_ref = typeof value) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
              return LispyNode_Value(this.index, value);
            }
          }
        } else if (parent instanceof ArrayNode) {
          if (cValue === "length") {
            return LispyNode_Value(this.index, parent.elements.length);
          } else if (typeof cValue === "number") {
            return parent.elements[cValue] || LispyNode_Value(this.index, void 0);
          }
        } else if (parent instanceof ObjectNode) {
          for (_arr = __toArray(parent.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            _ref = _arr[_i];
            key = _ref.key;
            value = _ref.value;
            if (key.constValue() === cValue) {
              return value;
            }
          }
        }
      }
      if (child instanceof CallNode && child.func instanceof IdentNode && child.func.name === "__range") {
        _ref = child.args;
        start = _ref[0];
        end = _ref[1];
        step = _ref[2];
        inclusive = _ref[3];
        hasStep = !step.isConst() || step.constValue() !== 1;
        if (!hasStep) {
          if (inclusive.isConst()) {
            if (inclusive.constValue()) {
              if (end.isConst() && typeof end.constValue() === "number") {
                end = LispyNode_Value(end.index, +end.constValue() + 1 || 1/0);
              } else {
                end = BinaryNode(
                  end.index,
                  end.scope,
                  BinaryNode(
                    end.index,
                    end.scope,
                    end,
                    "+",
                    LispyNode_Value(inclusive.index, 1)
                  ),
                  "||",
                  LispyNode_Value(end.index, 1/0)
                );
              }
            }
          } else {
            end = IfNode(
              end.index,
              end.scope,
              inclusive,
              BinaryNode(
                end.index,
                end.scope,
                BinaryNode(
                  end.index,
                  end.scope,
                  end,
                  "+",
                  LispyNode_Value(inclusive.index, 1)
                ),
                "||",
                LispyNode_Value(end.index, 1/0)
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
        return CallNode(
          this.index,
          this.scope,
          IdentNode(this.index, this.scope, hasStep ? "__sliceStep" : "__slice"),
          args,
          false,
          !hasStep
        ).reduce(o);
      } else if (parent !== this.parent || child !== this.child) {
        return AccessNode(this.index, this.scope, parent, child);
      } else {
        return this;
      }
    };
    _AccessNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.parent.isNoop(o) && this.child.isNoop(o);
      } else {
        return _ref;
      }
    };
    _AccessNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "AccessNode",
        this.index,
        this.parent,
        this.child
      );
    };
    _AccessNode_prototype.walk = function (f, context) {
      var child, parent;
      parent = f.call(context, this.parent);
      child = f.call(context, this.child);
      if (parent !== this.parent || child !== this.child) {
        return AccessNode(this.index, this.scope, parent, child);
      } else {
        return this;
      }
    };
    _AccessNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.parent, (_once = false, function (_e, parent) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.child, (_once2 = false, function (_e2, child) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, parent !== _this.parent || child !== _this.child ? AccessNode(_this.index, _this.scope, parent, child) : _this);
        }));
      }));
    };
    return AccessNode;
  }(Node));
  Node.AccessMulti = Node.byTypeId[2] = AccessMultiNode = (function (Node) {
    var _AccessMultiNode_prototype, _Node_prototype;
    function AccessMultiNode(index, scope, parent, elements) {
      var _this;
      _this = this instanceof AccessMultiNode ? this : __create(_AccessMultiNode_prototype);
      if (elements == null) {
        elements = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.elements = elements;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AccessMultiNode_prototype = AccessMultiNode.prototype = __create(_Node_prototype);
    _AccessMultiNode_prototype.constructor = AccessMultiNode;
    AccessMultiNode.displayName = "AccessMultiNode";
    if (typeof Node.extended === "function") {
      Node.extended(AccessMultiNode);
    }
    _AccessMultiNode_prototype.typeId = 2;
    AccessMultiNode.argNames = ["parent", "elements"];
    _AccessMultiNode_prototype.type = function () {
      return Type.array;
    };
    _AccessMultiNode_prototype._reduce = function (o) {
      var _this, parent, result, setParent, tmp, tmpIds;
      _this = this;
      parent = this.parent.reduce(o);
      setParent = parent;
      tmpIds = [];
      if (parent.cacheable) {
        tmp = o.makeTmp(o.indexFromPosition(this.index), "ref", parent.type(o));
        tmp.scope = this.scope;
        tmpIds.push(tmp.id);
        setParent = AssignNode(
          this.index,
          this.scope,
          tmp,
          "=",
          parent.doWrap(o)
        );
        parent = tmp;
      }
      result = ArrayNode(this.index, this.scope, (function () {
        var _arr, _arr2, _len, element, j;
        for (_arr = [], _arr2 = __toArray(_this.elements), j = 0, _len = _arr2.length; j < _len; ++j) {
          element = _arr2[j];
          _arr.push(AccessNode(
            _this.index,
            _this.scope,
            j === 0 ? setParent : parent,
            element.reduce(o)
          ));
        }
        return _arr;
      }()));
      if (tmpIds.length) {
        return TmpWrapperNode(this.index, this.scope, result, tmpIds);
      } else {
        return result;
      }
    };
    _AccessMultiNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "AccessMultiNode",
        this.index,
        this.parent,
        this.elements
      );
    };
    _AccessMultiNode_prototype.walk = function (f, context) {
      var elements, parent;
      parent = f.call(context, this.parent);
      elements = map(this.elements, f, context);
      if (parent !== this.parent || elements !== this.elements) {
        return AccessMultiNode(this.index, this.scope, parent, elements);
      } else {
        return this;
      }
    };
    _AccessMultiNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.parent, (_once = false, function (_e, parent) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.elements, f, context, (_once2 = false, function (_e2, elements) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, parent !== _this.parent || elements !== _this.elements ? AccessMultiNode(_this.index, _this.scope, parent, elements) : _this);
        }));
      }));
    };
    return AccessMultiNode;
  }(Node));
  Node.Array = Node.byTypeId[4] = ArrayNode = (function (Node) {
    var _ArrayNode_prototype, _Node_prototype;
    function ArrayNode(index, scope, elements) {
      var _this;
      _this = this instanceof ArrayNode ? this : __create(_ArrayNode_prototype);
      if (elements == null) {
        elements = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.elements = elements;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ArrayNode_prototype = ArrayNode.prototype = __create(_Node_prototype);
    _ArrayNode_prototype.constructor = ArrayNode;
    ArrayNode.displayName = "ArrayNode";
    if (typeof Node.extended === "function") {
      Node.extended(ArrayNode);
    }
    _ArrayNode_prototype.typeId = 4;
    ArrayNode.argNames = ["elements"];
    _ArrayNode_prototype.type = function () {
      return Type.array;
    };
    _ArrayNode_prototype._reduce = function (o) {
      var elements;
      elements = map(this.elements, function (x) {
        return x.reduce(o).doWrap(o);
      });
      if (elements !== this.elements) {
        return ArrayNode(this.index, this.scope, elements);
      } else {
        return this;
      }
    };
    _ArrayNode_prototype._isNoop = function (o) {
      var _arr, _every, _i, _len, _ref, element;
      if ((_ref = this.__isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          if (!element.isNoop(o)) {
            _every = false;
            break;
          }
        }
        return this.__isNoop = _every;
      } else {
        return _ref;
      }
    };
    _ArrayNode_prototype.isLiteral = function () {
      var _arr, _every, _i, _len, _ref, element;
      if ((_ref = this._isLiteral) == null) {
        _every = true;
        for (_arr = __toArray(this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          if (!element.isLiteral()) {
            _every = false;
            break;
          }
        }
        return this._isLiteral = _every;
      } else {
        return _ref;
      }
    };
    _ArrayNode_prototype.literalValue = function () {
      var _arr, _arr2, _i, _len, element;
      for (_arr = [], _arr2 = __toArray(this.elements), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        element = _arr2[_i];
        _arr.push(element.literalValue());
      }
      return _arr;
    };
    _ArrayNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ArrayNode", this.index, this.elements);
    };
    _ArrayNode_prototype.walk = function (f, context) {
      var elements;
      elements = map(this.elements, f, context);
      if (elements !== this.elements) {
        return ArrayNode(this.index, this.scope, elements);
      } else {
        return this;
      }
    };
    _ArrayNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.elements, f, context, (_once = false, function (_e, elements) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, elements !== _this.elements ? ArrayNode(_this.index, _this.scope, elements) : _this);
      }));
    };
    return ArrayNode;
  }(Node));
  Node.Assign = Node.byTypeId[5] = AssignNode = (function (Node) {
    var _AssignNode_prototype, _Node_prototype;
    function AssignNode(index, scope, left, op, right) {
      var _this;
      _this = this instanceof AssignNode ? this : __create(_AssignNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AssignNode_prototype = AssignNode.prototype = __create(_Node_prototype);
    _AssignNode_prototype.constructor = AssignNode;
    AssignNode.displayName = "AssignNode";
    if (typeof Node.extended === "function") {
      Node.extended(AssignNode);
    }
    _AssignNode_prototype.typeId = 5;
    AssignNode.argNames = ["left", "op", "right"];
    _AssignNode_prototype.type = (function () {
      var ops;
      ops = {
        "=": function (left, right) {
          return right;
        },
        "+=": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
            return Type.stringOrNumber;
          } else {
            return Type.string;
          }
        },
        "-=": Type.number,
        "*=": Type.number,
        "/=": Type.number,
        "%=": Type.number,
        "<<=": Type.number,
        ">>=": Type.number,
        ">>>=": Type.number,
        "&=": Type.number,
        "^=": Type.number,
        "|=": Type.number
      };
      return function (o) {
        var _ref, _ref2, type;
        if ((_ref = this._type) == null) {
          if (__owns.call(ops, _ref2 = this.op)) {
            type = ops[_ref2];
          }
          if (!type) {
            return this._type = Type.any;
          } else if (typeof type === "function") {
            return this._type = type(this.left.type(o), this.right.type(o));
          } else {
            return this._type = type;
          }
        } else {
          return _ref;
        }
      };
    }());
    _AssignNode_prototype._reduce = function (o) {
      var left, right;
      left = this.left.reduce(o);
      right = this.right.reduce(o).doWrap(o);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "AssignNode",
        this.index,
        this.left,
        this.op,
        this.right
      );
    };
    _AssignNode_prototype.walk = function (f, context) {
      var left, right;
      left = f.call(context, this.left);
      right = f.call(context, this.right);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.left, (_once = false, function (_e, left) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.right, (_once2 = false, function (_e2, right) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? AssignNode(
              _this.index,
              _this.scope,
              left,
              _this.op,
              right
            )
            : _this);
        }));
      }));
    };
    return AssignNode;
  }(Node));
  Node.Binary = Node.byTypeId[6] = BinaryNode = (function (Node) {
    var _BinaryNode_prototype, _Node_prototype;
    function BinaryNode(index, scope, left, op, right) {
      var _this;
      _this = this instanceof BinaryNode ? this : __create(_BinaryNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BinaryNode_prototype = BinaryNode.prototype = __create(_Node_prototype);
    _BinaryNode_prototype.constructor = BinaryNode;
    BinaryNode.displayName = "BinaryNode";
    if (typeof Node.extended === "function") {
      Node.extended(BinaryNode);
    }
    _BinaryNode_prototype.typeId = 6;
    BinaryNode.argNames = ["left", "op", "right"];
    _BinaryNode_prototype.type = (function () {
      var ops;
      ops = {
        "*": Type.number,
        "/": Type.number,
        "%": Type.number,
        "+": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
            return Type.stringOrNumber;
          } else {
            return Type.string;
          }
        },
        "-": Type.number,
        "<<": Type.number,
        ">>": Type.number,
        ">>>": Type.number,
        "<": Type.boolean,
        "<=": Type.boolean,
        ">": Type.boolean,
        ">=": Type.boolean,
        "in": Type.boolean,
        "instanceof": Type.boolean,
        "==": Type.boolean,
        "!=": Type.boolean,
        "===": Type.boolean,
        "!==": Type.boolean,
        "&": Type.number,
        "^": Type.number,
        "|": Type.number,
        "&&": function (left, right) {
          return left.intersect(Type.potentiallyFalsy).union(right);
        },
        "||": function (left, right) {
          return left.intersect(Type.potentiallyTruthy).union(right);
        }
      };
      return function (o) {
        var _ref, _ref2, type;
        if ((_ref = this._type) == null) {
          if (__owns.call(ops, _ref2 = this.op)) {
            type = ops[_ref2];
          }
          if (!type) {
            return this._type = Type.any;
          } else if (typeof type === "function") {
            return this._type = type(this.left.type(o), this.right.type(o));
          } else {
            return this._type = type;
          }
        } else {
          return _ref;
        }
      };
    }());
    _BinaryNode_prototype._reduce = (function () {
      var constOps, leftConstOps, nonConstOps, rightConstOps;
      constOps = {
        "*": __curry(2, function (x, y) {
          return x * y;
        }),
        "/": __curry(2, function (x, y) {
          return x / y;
        }),
        "%": __curry(2, function (x, y) {
          return x % y;
        }),
        "+": (function () {
          function isJSNumeric(x) {
            var _ref;
            return x === null || (_ref = typeof x) === "number" || _ref === "boolean" || _ref === "undefined";
          }
          return function (left, right) {
            if (isJSNumeric(left) && isJSNumeric(right)) {
              return left - -right;
            } else {
              return "" + left + right;
            }
          };
        }()),
        "-": __curry(2, function (x, y) {
          return x - y;
        }),
        "<<": __curry(2, function (x, y) {
          return x << y;
        }),
        ">>": __curry(2, function (x, y) {
          return x >> y;
        }),
        ">>>": __curry(2, function (x, y) {
          return x >>> y;
        }),
        "<": __curry(2, function (x, y) {
          return x < y;
        }),
        "<=": __curry(2, function (x, y) {
          return x <= y;
        }),
        ">": __curry(2, function (x, y) {
          return x > y;
        }),
        ">=": __curry(2, function (x, y) {
          return x >= y;
        }),
        "==": __curry(2, function (x, y) {
          return x == y;
        }),
        "!=": __curry(2, function (x, y) {
          return x != y;
        }),
        "===": __curry(2, function (x, y) {
          return x === y;
        }),
        "!==": __curry(2, function (x, y) {
          return x !== y;
        }),
        "&": __curry(2, function (x, y) {
          return x & y;
        }),
        "^": __curry(2, function (x, y) {
          return x ^ y;
        }),
        "|": __curry(2, function (x, y) {
          return x | y;
        }),
        "&&": __curry(2, function (x, y) {
          return x && y;
        }),
        "||": __curry(2, function (x, y) {
          return x || y;
        })
      };
      function leftConstNan(x, y) {
        var _ref;
        if ((_ref = x.constValue()) !== _ref) {
          return BlockNode(this.index, this.scope, [y, x]);
        }
      }
      leftConstOps = {
        "*": function (x, y) {
          var _ref;
          if (x.constValue() === 1) {
            return UnaryNode(this.index, this.scope, "+", y);
          } else if (x.constValue() === -1) {
            return UnaryNode(this.index, this.scope, "-", y);
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [y, x]);
          }
        },
        "/": leftConstNan,
        "%": leftConstNan,
        "+": function (x, y, o) {
          var _ref;
          if (x.constValue() === 0 && y.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(this.index, this.scope, "+", y);
          } else if (x.constValue() === "" && y.type(o).isSubsetOf(Type.string)) {
            return y;
          } else if (typeof x.constValue() === "string" && y instanceof BinaryNode && y.op === "+" && y.left.isConst() && typeof y.left.constValue() === "string") {
            return BinaryNode(
              this.index,
              this.scope,
              LispyNode_Value(x.index, "" + x.constValue() + y.left.constValue()),
              "+",
              y.right
            );
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [y, x]);
          }
        },
        "-": function (x, y) {
          var _ref;
          if (x.constValue() === 0) {
            return UnaryNode(this.index, this.scope, "-", y);
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [y, x]);
          }
        },
        "<<": leftConstNan,
        ">>": leftConstNan,
        ">>>": leftConstNan,
        "&": leftConstNan,
        "|": leftConstNan,
        "^": leftConstNan,
        "&&": function (x, y) {
          if (x.constValue()) {
            return y;
          } else {
            return x;
          }
        },
        "||": function (x, y) {
          if (x.constValue()) {
            return x;
          } else {
            return y;
          }
        }
      };
      function rightConstNan(x, y) {
        var _ref;
        if ((_ref = y.constValue()) !== _ref) {
          return BlockNode(this.index, this.scope, [x, y]);
        }
      }
      rightConstOps = {
        "*": function (x, y) {
          var _ref;
          if (y.constValue() === 1) {
            return UnaryNode(this.index, this.scope, "+", x);
          } else if (y.constValue() === -1) {
            return UnaryNode(this.index, this.scope, "-", x);
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [x, y]);
          }
        },
        "/": function (x, y) {
          var _ref;
          if (y.constValue() === 1) {
            return UnaryNode(this.index, this.scope, "+", x);
          } else if (y.constValue() === -1) {
            return UnaryNode(this.index, this.scope, "-", x);
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [x, y]);
          }
        },
        "%": rightConstNan,
        "+": function (x, y, o) {
          var _ref;
          if (y.constValue() === 0 && x.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(this.index, this.scope, "+", x);
          } else if (typeof y.constValue() === "number" && y.constValue() < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.index,
              this.scope,
              x,
              "-",
              LispyNode_Value(y.index, -y.constValue())
            );
          } else if (y.constValue() === "" && x.type(o).isSubsetOf(Type.string)) {
            return x;
          } else if (typeof y.constValue() === "string" && x instanceof BinaryNode && x.op === "+" && x.right.isConst() && typeof x.right.constValue() === "string") {
            return BinaryNode(
              this.index,
              this.scope,
              x.left,
              "+",
              LispyNode_Value(x.right.index, "" + x.right.constValue() + y.constValue())
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [x, y]);
          }
        },
        "-": function (x, y, o) {
          var _ref;
          if (y.constValue() === 0) {
            return UnaryNode(this.index, this.scope, "+", x);
          } else if (typeof y.constValue() === "number" && y.constValue() < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.index,
              this.scope,
              x,
              "+",
              LispyNode_Value(y.index, -y.constValue())
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.index, this.scope, [x, y]);
          }
        },
        "<<": rightConstNan,
        ">>": rightConstNan,
        ">>>": rightConstNan,
        "&": rightConstNan,
        "|": rightConstNan,
        "^": rightConstNan
      };
      function removeUnaryPlus(x, y) {
        var newX, newY;
        if (x instanceof UnaryNode && x.op === "+") {
          newX = x.node;
        } else {
          newX = x;
        }
        if (y instanceof UnaryNode && y.op === "+") {
          newY = y.node;
        } else {
          newY = y;
        }
        if (x !== newX || y !== newY) {
          return BinaryNode(
            this.index,
            this.scope,
            newX,
            this.op,
            newY
          );
        }
      }
      nonConstOps = {
        "*": removeUnaryPlus,
        "/": removeUnaryPlus,
        "%": removeUnaryPlus,
        "-": removeUnaryPlus,
        "<<": removeUnaryPlus,
        ">>": removeUnaryPlus,
        ">>>": removeUnaryPlus,
        "&": removeUnaryPlus,
        "^": removeUnaryPlus,
        "|": removeUnaryPlus,
        "&&": function (x, y, o) {
          var truthy, xRightType, xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            return BlockNode(this.index, this.scope, [x, y]);
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            return x;
          } else if (x instanceof BinaryNode && x.op === "&&") {
            if (x.right.isConst()) {
              truthy = !!x.right.constValue();
            } else {
              xRightType = x.right.type(o);
              if (xRightType.isSubsetOf(Type.alwaysTruthy)) {
                truthy = true;
              } else if (xRightType.isSubsetOf(Type.alwaysFalsy)) {
                truthy = false;
              } else {
                truthy = null;
              }
            }
            if (truthy === true) {
              return BinaryNode(
                this.index,
                this.scope,
                x.left,
                "&&",
                BlockNode(x.right.index, this.scope, [x.right, y])
              );
            } else if (truthy === false) {
              return x;
            }
          }
        },
        "||": function (x, y, o) {
          var test, truthy, whenTrue, xRightType, xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            return x;
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            return BlockNode(this.index, this.scope, [x, y]);
          } else if (x instanceof BinaryNode && x.op === "||") {
            if (x.right.isConst()) {
              truthy = !!x.right.constValue();
            } else {
              xRightType = x.right.type(o);
              if (xRightType.isSubsetOf(Type.alwaysTruthy)) {
                truthy = true;
              } else if (xRightType.isSubsetOf(Type.alwaysFalsy)) {
                truthy = false;
              } else {
                truthy = null;
              }
            }
            if (truthy === true) {
              return x;
            } else if (truthy === false) {
              return BinaryNode(
                this.index,
                this.scope,
                x.left,
                "||",
                BlockNode(x.right.index, this.scope, [x.right, y])
              );
            }
          } else if (x instanceof IfNode && x.whenFalse.isConst() && !x.whenFalse.constValue()) {
            test = x.test;
            whenTrue = x.whenTrue;
            while (whenTrue instanceof IfNode && whenTrue.whenFalse.isConst() && !whenTrue.whenFalse.constValue()) {
              test = BinaryNode(
                x.index,
                x.scope,
                test,
                "&&",
                whenTrue.test
              );
              whenTrue = whenTrue.whenTrue;
            }
            return BinaryNode(
              this.index,
              this.scope,
              BinaryNode(
                x.index,
                x.scope,
                test,
                "&&",
                whenTrue
              ),
              "||",
              y
            );
          }
        }
      };
      return function (o) {
        var _ref, _ref2, left, op, right;
        left = this.left.reduce(o).doWrap(o);
        right = this.right.reduce(o).doWrap(o);
        op = this.op;
        if (left.isConst()) {
          if (right.isConst() && __owns.call(constOps, op)) {
            return LispyNode_Value(this.index, constOps[op](left.constValue(), right.constValue()));
          }
          if (__owns.call(leftConstOps, op)) {
            if ((_ref = leftConstOps[op].call(this, left, right, o)) != null) {
              return _ref;
            }
          } else if ((_ref2 = void 0) != null) {
            return _ref2;
          }
        }
        if (right.isConst()) {
          if (__owns.call(rightConstOps, op)) {
            if ((_ref = rightConstOps[op].call(this, left, right, o)) != null) {
              return _ref;
            }
          } else if ((_ref2 = void 0) != null) {
            return _ref2;
          }
        }
        if (__owns.call(nonConstOps, op)) {
          if ((_ref = nonConstOps[op].call(this, left, right, o)) != null) {
            return _ref;
          }
        } else if ((_ref2 = void 0) != null) {
          return _ref2;
        }
        if (left !== this.left || right !== this.right) {
          return BinaryNode(
            this.index,
            this.scope,
            left,
            op,
            right
          );
        } else {
          return this;
        }
      };
    }());
    _BinaryNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.left.isNoop(o) && this.right.isNoop(o);
      } else {
        return _ref;
      }
    };
    _BinaryNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "BinaryNode",
        this.index,
        this.left,
        this.op,
        this.right
      );
    };
    _BinaryNode_prototype.walk = function (f, context) {
      var left, right;
      left = f.call(context, this.left);
      right = f.call(context, this.right);
      if (left !== this.left || right !== this.right) {
        return BinaryNode(
          this.index,
          this.scope,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _BinaryNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.left, (_once = false, function (_e, left) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.right, (_once2 = false, function (_e2, right) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? BinaryNode(
              _this.index,
              _this.scope,
              left,
              _this.op,
              right
            )
            : _this);
        }));
      }));
    };
    return BinaryNode;
  }(Node));
  Node.Block = Node.byTypeId[7] = BlockNode = (function (Node) {
    var _BlockNode_prototype, _Node_prototype;
    function BlockNode(index, scope, nodes, label) {
      var _this;
      _this = this instanceof BlockNode ? this : __create(_BlockNode_prototype);
      if (nodes == null) {
        nodes = [];
      }
      if (label == null) {
        label = null;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.nodes = nodes;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BlockNode_prototype = BlockNode.prototype = __create(_Node_prototype);
    _BlockNode_prototype.constructor = BlockNode;
    BlockNode.displayName = "BlockNode";
    if (typeof Node.extended === "function") {
      Node.extended(BlockNode);
    }
    _BlockNode_prototype.typeId = 7;
    BlockNode.argNames = ["nodes", "label"];
    _BlockNode_prototype.type = function (o) {
      var _arr, _end, _i, _len, _ref, node, nodes;
      if ((_ref = this._type) == null) {
        nodes = this.nodes;
        if (nodes.length === 0) {
          return this._type = Type["undefined"];
        } else {
          for (_arr = __toArray(nodes), _i = 0, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); _i < _end; ++_i) {
            node = _arr[_i];
            node.type(o);
          }
          return this._type = nodes[nodes.length - 1].type(o);
        }
      } else {
        return _ref;
      }
    };
    _BlockNode_prototype.withLabel = function (label, o) {
      var _ref, _this, last;
      _this = this;
      if (label == null) {
        label = null;
      }
      if (this.label == null) {
        if (this.nodes.length === 1) {
          return this.nodes[0].withLabel(label, o);
        } else if (this.nodes.length > 1) {
          last = (_ref = this.nodes)[_ref.length - 1];
          if (last instanceof require("./parser-lispynodes") && last.isCall && last.func.isInternal && last.func.isForIn && (function () {
            var _arr, _end, _every, _i, _len, node;
            _every = true;
            for (_arr = __toArray(_this.nodes), _i = 0, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); _i < _end; ++_i) {
              node = _arr[_i];
              if (!(node instanceof AssignNode) && !(node instanceof VarNode)) {
                _every = false;
                break;
              }
            }
            return _every;
          }())) {
            return BlockNode(this.index, this.scope, __slice.call(this.nodes, 0, -1).concat([last.withLabel(label, o)]));
          }
        }
      }
      return BlockNode(this.index, this.scope, this.nodes, label);
    };
    _BlockNode_prototype._reduce = function (o) {
      var _arr, body, changed, i, label, len, node, reduced;
      changed = false;
      body = [];
      for (_arr = __toArray(this.nodes), i = 0, len = _arr.length; i < len; ++i) {
        node = _arr[i];
        reduced = node.reduce(o);
        if (reduced instanceof BlockNode && reduced.label == null) {
          body.push.apply(body, __toArray(reduced.nodes));
          changed = true;
        } else if (reduced instanceof NothingNode) {
          changed = true;
        } else if (reduced instanceof require("./parser-lispynodes") && reduced.isCall && reduced.func.isGoto) {
          body.push(reduced);
          if (reduced !== node || i < len - 1) {
            changed = true;
          }
          break;
        } else {
          body.push(reduced);
          if (reduced !== node) {
            changed = true;
          }
        }
      }
      if (this.label != null) {
        label = this.label.reduce(o);
      } else {
        label = this.label;
      }
      if (body.length === 0) {
        return NothingNode(this.index, this.scope);
      } else if (label == null && body.length === 1) {
        return body[0];
      } else if (changed || label !== this.label) {
        return BlockNode(this.index, this.scope, body, label);
      } else {
        return this;
      }
    };
    _BlockNode_prototype.isStatement = function () {
      var _arr, _i, _some, node;
      _some = false;
      for (_arr = __toArray(this.nodes), _i = _arr.length; _i--; ) {
        node = _arr[_i];
        if (node.isStatement()) {
          _some = true;
          break;
        }
      }
      return _some;
    };
    _BlockNode_prototype._isNoop = function (o) {
      var _arr, _every, _i, _ref, node;
      if ((_ref = this.__isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.nodes), _i = _arr.length; _i--; ) {
          node = _arr[_i];
          if (!node.isNoop(o)) {
            _every = false;
            break;
          }
        }
        return this.__isNoop = _every;
      } else {
        return _ref;
      }
    };
    _BlockNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      var lastNode, len, nodes;
      nodes = this.nodes;
      len = nodes.length;
      if (len === 0) {
        return Noop(this.index, this.scope).mutateLast(o, func, context, includeNoop);
      } else {
        lastNode = nodes[len - 1].mutateLast(o, func, context, includeNoop);
        if (lastNode !== nodes[len - 1]) {
          return BlockNode(this.index, this.scope, __toArray(__slice.call(nodes, 0, -1)).concat([lastNode]));
        } else {
          return this;
        }
      }
    };
    _BlockNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "BlockNode",
        this.index,
        this.nodes,
        this.label
      );
    };
    _BlockNode_prototype.walk = function (f, context) {
      var label, nodes;
      nodes = map(this.nodes, f, context);
      if (this.label instanceof Node) {
        label = f.call(context, this.label);
      } else {
        label = this.label;
      }
      if (nodes !== this.nodes || label !== this.label) {
        return BlockNode(this.index, this.scope, nodes, label);
      } else {
        return this;
      }
    };
    _BlockNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.nodes, f, context, (_once = false, function (_e, nodes) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return (_this.label instanceof Node
          ? function (next) {
            var _once2;
            return f.call(context, _this.label, (_once2 = false, function (_e2, label) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(label);
            }));
          }
          : function (next) {
            return next(_this.label);
          })(function (label) {
          return callback(null, nodes !== _this.nodes || label !== _this.label ? BlockNode(_this.index, _this.scope, nodes, label) : _this);
        });
      }));
    };
    return BlockNode;
  }(Node));
  Node.Call = Node.byTypeId[9] = CallNode = (function (Node) {
    var _CallNode_prototype, _Node_prototype;
    function CallNode(index, scope, func, args, isNew, isApply) {
      var _this;
      _this = this instanceof CallNode ? this : __create(_CallNode_prototype);
      if (args == null) {
        args = [];
      }
      if (isNew == null) {
        isNew = false;
      }
      if (isApply == null) {
        isApply = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      _this.isApply = isApply;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _CallNode_prototype = CallNode.prototype = __create(_Node_prototype);
    _CallNode_prototype.constructor = CallNode;
    CallNode.displayName = "CallNode";
    if (typeof Node.extended === "function") {
      Node.extended(CallNode);
    }
    _CallNode_prototype.typeId = 9;
    CallNode.argNames = ["func", "args", "isNew", "isApply"];
    _CallNode_prototype.type = (function () {
      var PRIMORDIAL_FUNCTIONS, PRIMORDIAL_METHODS, PRIMORDIAL_SUBFUNCTIONS;
      PRIMORDIAL_FUNCTIONS = {
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
      PRIMORDIAL_SUBFUNCTIONS = {
        Object: {
          getPrototypeOf: Type.object,
          getOwnPropertyDescriptor: Type.object,
          getOwnPropertyNames: Type.string.array(),
          create: Type.object,
          defineProperty: Type.object,
          defineProperties: Type.object,
          seal: Type.object,
          freeze: Type.object,
          preventExtensions: Type.object,
          isSealed: Type.boolean,
          isFrozen: Type.boolean,
          isExtensible: Type.boolean,
          keys: Type.string.array()
        },
        String: { fromCharCode: Type.string },
        Number: { isFinite: Type.boolean, isNaN: Type.boolean },
        Array: { isArray: Type.boolean },
        Math: {
          abs: Type.number,
          acos: Type.number,
          asin: Type.number,
          atan: Type.number,
          atan2: Type.number,
          ceil: Type.number,
          cos: Type.number,
          exp: Type.number,
          floor: Type.number,
          log: Type.number,
          max: Type.number,
          min: Type.number,
          pow: Type.number,
          random: Type.number,
          round: Type.number,
          sin: Type.number,
          sqrt: Type.number,
          tan: Type.number
        },
        JSON: { stringify: Type.string.union(Type["undefined"]), parse: Type.string.union(Type.number).union(Type.boolean).union(Type["null"]).union(Type.array).union(Type.object) },
        Date: { UTC: Type.number, now: Type.number }
      };
      PRIMORDIAL_METHODS = {
        String: {
          toString: Type.string,
          valueOf: Type.string,
          charAt: Type.string,
          charCodeAt: Type.number,
          concat: Type.string,
          indexOf: Type.number,
          lastIndexOf: Type.number,
          localeCompare: Type.number,
          match: Type.array.union(Type["null"]),
          replace: Type.string,
          search: Type.number,
          slice: Type.string,
          split: Type.string.array(),
          substring: Type.string,
          toLowerCase: Type.string,
          toLocaleLowerCase: Type.string,
          toUpperCase: Type.string,
          toLocaleUpperCase: Type.string,
          trim: Type.string
        },
        Boolean: { toString: Type.string, valueOf: Type.boolean },
        Number: {
          toString: Type.string,
          valueOf: Type.number,
          toLocaleString: Type.string,
          toFixed: Type.string,
          toExponential: Type.string,
          toPrecision: Type.string
        },
        Date: {
          toString: Type.string,
          toDateString: Type.string,
          toTimeString: Type.string,
          toLocaleString: Type.string,
          toLocaleDateString: Type.string,
          toLocaleTimeString: Type.string,
          valueOf: Type.number,
          getTime: Type.number,
          getFullYear: Type.number,
          getUTCFullYear: Type.number,
          getMonth: Type.number,
          getUTCMonth: Type.number,
          getDate: Type.number,
          getUTCDate: Type.number,
          getDay: Type.number,
          getUTCDay: Type.number,
          getHours: Type.number,
          getUTCHours: Type.number,
          getMinutes: Type.number,
          getUTCMinutes: Type.number,
          getSeconds: Type.number,
          getUTCSeconds: Type.number,
          getMilliseconds: Type.number,
          getUTCMilliseconds: Type.number,
          getTimezoneOffset: Type.number,
          setTime: Type.number,
          setMilliseconds: Type.number,
          setUTCMilliseconds: Type.number,
          setSeconds: Type.number,
          setUTCSeconds: Type.number,
          setMinutes: Type.number,
          setUTCMinutes: Type.number,
          setHours: Type.number,
          setUTCHours: Type.number,
          setDate: Type.number,
          setUTCDate: Type.number,
          setMonth: Type.number,
          setUTCMonth: Type.number,
          setFullYear: Type.number,
          setUTCFullYear: Type.number,
          toUTCString: Type.string,
          toISOString: Type.string,
          toJSON: Type.string
        },
        RegExp: { exec: Type.array.union(Type["null"]), test: Type.boolean, toString: Type.string },
        Error: { toString: Type.string }
      };
      return function (o) {
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, _ref2, _ref3, _ref4, _ref5, child, func, funcType, name,
                parent, parentType;
            func = _this.func;
            funcType = func.type(o);
            if (funcType.isSubsetOf(Type["function"])) {
              return funcType.args[0];
            } else if (func instanceof IdentNode) {
              name = func.name;
              if (__owns.call(PRIMORDIAL_FUNCTIONS, name)) {
                return PRIMORDIAL_FUNCTIONS[name];
              } else if (o != null ? o.macros.hasHelper(name) : void 0) {
                funcType = o.macros.helperType(name);
                if (funcType.isSubsetOf(Type["function"])) {
                  return funcType.args[0];
                }
              }
            } else if (func instanceof AccessNode) {
              parent = func.parent;
              child = func.child;
              if (child.isConst()) {
                if ((_ref = child.constValue()) === "call" || _ref === "apply") {
                  parentType = parent.type(o);
                  if (parentType.isSubsetOf(Type["function"])) {
                    return parentType.args[0];
                  }
                } else if (parent instanceof IdentNode) {
                  if (__owns.call(PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name)) {
                    if (__owns.call(_ref2 = PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.constValue())) {
                      if ((_ref4 = _ref2[_ref3]) != null) {
                        return _ref4;
                      }
                    } else if ((_ref5 = void 0) != null) {
                      return _ref5;
                    }
                  } else if ((_ref2 = void 0) != null) {
                    return _ref2;
                  }
                }
              }
            }
            return Type.any;
          }());
        } else {
          return _ref;
        }
      };
    }());
    _CallNode_prototype._reduce = (function () {
      var PURE_PRIMORDIAL_FUNCTIONS, PURE_PRIMORDIAL_SUBFUNCTIONS;
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
        Number: true,
        RegExp: true
      };
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
      return function (o) {
        var _arr, _i, _len, _ref, _ref2, _ref3, allConst, arg, args, child,
            constArgs, cValue, func, parent, pValue, value;
        func = this.func.reduce(o).doWrap(o);
        args = map(this.args, function (node) {
          return node.reduce(o).doWrap(o);
        });
        if (!this.isNew && !this.isApply) {
          constArgs = [];
          allConst = true;
          for (_arr = __toArray(args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            arg = _arr[_i];
            if (arg.isConst()) {
              constArgs.push(arg.constValue());
            } else {
              allConst = false;
              break;
            }
          }
          if (allConst) {
            if (func instanceof IdentNode) {
              if (__owns.call(PURE_PRIMORDIAL_FUNCTIONS, func.name)) {
                try {
                  value = GLOBAL[func.name].apply(void 0, __toArray(constArgs));
                  if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                    return LispyNode_Value(this.index, value);
                  }
                } catch (e) {}
              }
            } else if (func instanceof AccessNode && func.child.isConst()) {
              parent = func.parent;
              child = func.child;
              cValue = child.constValue();
              if (parent.isConst()) {
                pValue = parent.constValue();
                if (typeof pValue[cValue] === "function") {
                  try {
                    value = pValue[cValue].apply(pValue, __toArray(constArgs));
                    if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                      return LispyNode_Value(this.index, value);
                    }
                  } catch (e) {}
                }
              } else if (parent instanceof IdentNode && (__owns.call(PURE_PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name) && __owns.call(_ref2 = PURE_PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.value) ? _ref2[_ref3] : void 0)) {
                try {
                  value = (_ref = GLOBAL[parent.name])[cValue].apply(_ref, __toArray(constArgs));
                  if (value === null || (_ref = typeof value) === "number" || _ref === "string" || _ref === "boolean" || _ref === "undefined") {
                    return LispyNode_Value(this.index, value);
                  }
                } catch (e) {}
              }
            }
          }
        }
        if (func !== this.func || args !== this.args) {
          return CallNode(
            this.index,
            this.scope,
            func,
            args,
            this.isNew,
            this.isApply
          );
        } else {
          return this;
        }
      };
    }());
    _CallNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "CallNode",
        this.index,
        this.func,
        this.args,
        this.isNew,
        this.isApply
      );
    };
    _CallNode_prototype.walk = function (f, context) {
      var args, func;
      func = f.call(context, this.func);
      args = map(this.args, f, context);
      if (func !== this.func || args !== this.args) {
        return CallNode(
          this.index,
          this.scope,
          func,
          args,
          this.isNew,
          this.isApply
        );
      } else {
        return this;
      }
    };
    _CallNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.func, (_once = false, function (_e, func) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.args, f, context, (_once2 = false, function (_e2, args) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, func !== _this.func || args !== _this.args
            ? CallNode(
              _this.index,
              _this.scope,
              func,
              args,
              _this.isNew,
              _this.isApply
            )
            : _this);
        }));
      }));
    };
    return CallNode;
  }(Node));
  Node.Def = Node.byTypeId[15] = DefNode = (function (Node) {
    var _DefNode_prototype, _Node_prototype;
    function DefNode(index, scope, left, right) {
      var _this;
      _this = this instanceof DefNode ? this : __create(_DefNode_prototype);
      if (right == null) {
        right = void 0;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _DefNode_prototype = DefNode.prototype = __create(_Node_prototype);
    _DefNode_prototype.constructor = DefNode;
    DefNode.displayName = "DefNode";
    if (typeof Node.extended === "function") {
      Node.extended(DefNode);
    }
    _DefNode_prototype.typeId = 15;
    DefNode.argNames = ["left", "right"];
    _DefNode_prototype.type = function (o) {
      if (this.right != null) {
        return this.right.type(o);
      } else {
        return Type.any;
      }
    };
    _DefNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "DefNode",
        this.index,
        this.left,
        this.right
      );
    };
    _DefNode_prototype.walk = function (f, context) {
      var left, right;
      left = f.call(context, this.left);
      if (this.right instanceof Node) {
        right = f.call(context, this.right);
      } else {
        right = this.right;
      }
      if (left !== this.left || right !== this.right) {
        return DefNode(this.index, this.scope, left, right);
      } else {
        return this;
      }
    };
    _DefNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.left, (_once = false, function (_e, left) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return (_this.right instanceof Node
          ? function (next) {
            var _once2;
            return f.call(context, _this.right, (_once2 = false, function (_e2, right) {
              if (_once2) {
                throw Error("Attempted to call function more than once");
              } else {
                _once2 = true;
              }
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(right);
            }));
          }
          : function (next) {
            return next(_this.right);
          })(function (right) {
          return callback(null, left !== _this.left || right !== _this.right ? DefNode(_this.index, _this.scope, left, right) : _this);
        });
      }));
    };
    return DefNode;
  }(Node));
  Node.EmbedWrite = Node.byTypeId[16] = EmbedWriteNode = (function (Node) {
    var _EmbedWriteNode_prototype, _Node_prototype;
    function EmbedWriteNode(index, scope, text, escape) {
      var _this;
      _this = this instanceof EmbedWriteNode ? this : __create(_EmbedWriteNode_prototype);
      if (escape == null) {
        escape = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.text = text;
      _this.escape = escape;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _EmbedWriteNode_prototype = EmbedWriteNode.prototype = __create(_Node_prototype);
    _EmbedWriteNode_prototype.constructor = EmbedWriteNode;
    EmbedWriteNode.displayName = "EmbedWriteNode";
    if (typeof Node.extended === "function") {
      Node.extended(EmbedWriteNode);
    }
    _EmbedWriteNode_prototype.typeId = 16;
    EmbedWriteNode.argNames = ["text", "escape"];
    _EmbedWriteNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "EmbedWriteNode",
        this.index,
        this.text,
        this.escape
      );
    };
    _EmbedWriteNode_prototype.walk = function (f, context) {
      var text;
      text = f.call(context, this.text);
      if (text !== this.text) {
        return EmbedWriteNode(this.index, this.scope, text, this.escape);
      } else {
        return this;
      }
    };
    _EmbedWriteNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.text, (_once = false, function (_e, text) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, text !== _this.text ? EmbedWriteNode(_this.index, _this.scope, text, _this.escape) : _this);
      }));
    };
    return EmbedWriteNode;
  }(Node));
  Node.Eval = Node.byTypeId[17] = EvalNode = (function (Node) {
    var _EvalNode_prototype, _Node_prototype, simplifiers;
    function EvalNode(index, scope, code) {
      var _this;
      _this = this instanceof EvalNode ? this : __create(_EvalNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.code = code;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _EvalNode_prototype = EvalNode.prototype = __create(_Node_prototype);
    _EvalNode_prototype.constructor = EvalNode;
    EvalNode.displayName = "EvalNode";
    if (typeof Node.extended === "function") {
      Node.extended(EvalNode);
    }
    _EvalNode_prototype.typeId = 17;
    EvalNode.argNames = ["code"];
    simplifiers = {
      "true": function () {
        return LispyNode_Value(this.index, true);
      },
      "false": function () {
        return LispyNode_Value(this.index, false);
      },
      "void 0": function () {
        return LispyNode_Value(this.index, void 0);
      },
      "null": function () {
        return LispyNode_Value(this.index, null);
      }
    };
    _EvalNode_prototype._reduce = function (o) {
      var _ref, code, simplifier;
      code = this.code.reduce(o).doWrap();
      if (code.isConst() && code.isConstType("string")) {
        if (__owns.call(simplifiers, _ref = code.constValue())) {
          simplifier = simplifiers[_ref];
        }
        if (simplifier) {
          return simplifier.call(this);
        }
      }
      if (code !== this.code) {
        return EvalNode(this.index, this.scope, code);
      } else {
        return this;
      }
    };
    _EvalNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "EvalNode", this.index, this.code);
    };
    _EvalNode_prototype.walk = function (f, context) {
      var code;
      code = f.call(context, this.code);
      if (code !== this.code) {
        return EvalNode(this.index, this.scope, code);
      } else {
        return this;
      }
    };
    _EvalNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.code, (_once = false, function (_e, code) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, code !== _this.code ? EvalNode(_this.index, _this.scope, code) : _this);
      }));
    };
    return EvalNode;
  }(Node));
  Node.For = Node.byTypeId[18] = ForNode = (function (Node) {
    var _ForNode_prototype, _Node_prototype;
    function ForNode(index, scope, init, test, step, body, label) {
      var _this;
      _this = this instanceof ForNode ? this : __create(_ForNode_prototype);
      if (init == null) {
        init = NothingNode(0, scope);
      }
      if (test == null) {
        test = LispyNode_Value(0, true);
      }
      if (step == null) {
        step = NothingNode(0, scope);
      }
      if (label == null) {
        label = null;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.init = init;
      _this.test = test;
      _this.step = step;
      _this.body = body;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ForNode_prototype = ForNode.prototype = __create(_Node_prototype);
    _ForNode_prototype.constructor = ForNode;
    ForNode.displayName = "ForNode";
    if (typeof Node.extended === "function") {
      Node.extended(ForNode);
    }
    _ForNode_prototype.typeId = 18;
    ForNode.argNames = [
      "init",
      "test",
      "step",
      "body",
      "label"
    ];
    _ForNode_prototype.type = function () {
      return Type["undefined"];
    };
    _ForNode_prototype.isStatement = function () {
      return true;
    };
    _ForNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      }
      return ForNode(
        this.index,
        this.scope,
        this.init,
        this.test,
        this.step,
        this.body,
        label
      );
    };
    _ForNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ForNode",
        this.index,
        this.init,
        this.test,
        this.step,
        this.body,
        this.label
      );
    };
    _ForNode_prototype.walk = function (f, context) {
      var body, init, label, step, test;
      init = f.call(context, this.init);
      test = f.call(context, this.test);
      step = f.call(context, this.step);
      body = f.call(context, this.body);
      if (this.label instanceof Node) {
        label = f.call(context, this.label);
      } else {
        label = this.label;
      }
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body || label !== this.label) {
        return ForNode(
          this.index,
          this.scope,
          init,
          test,
          step,
          body,
          label
        );
      } else {
        return this;
      }
    };
    _ForNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.init, (_once = false, function (_e, init) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.test, (_once2 = false, function (_e2, test) {
          var _once3;
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return f.call(context, _this.step, (_once3 = false, function (_e3, step) {
            var _once4;
            if (_once3) {
              throw Error("Attempted to call function more than once");
            } else {
              _once3 = true;
            }
            if (_e3 != null) {
              return callback(_e3);
            }
            return f.call(context, _this.body, (_once4 = false, function (_e4, body) {
              if (_once4) {
                throw Error("Attempted to call function more than once");
              } else {
                _once4 = true;
              }
              if (_e4 != null) {
                return callback(_e4);
              }
              return (_this.label instanceof Node
                ? function (next) {
                  var _once5;
                  return f.call(context, _this.label, (_once5 = false, function (_e5, label) {
                    if (_once5) {
                      throw Error("Attempted to call function more than once");
                    } else {
                      _once5 = true;
                    }
                    if (_e5 != null) {
                      return callback(_e5);
                    }
                    return next(label);
                  }));
                }
                : function (next) {
                  return next(_this.label);
                })(function (label) {
                return callback(null, init !== _this.init || test !== _this.test || step !== _this.step || body !== _this.body || label !== _this.label
                  ? ForNode(
                    _this.index,
                    _this.scope,
                    init,
                    test,
                    step,
                    body,
                    label
                  )
                  : _this);
              });
            }));
          }));
        }));
      }));
    };
    return ForNode;
  }(Node));
  Node.Function = Node.byTypeId[20] = FunctionNode = (function (Node) {
    var _FunctionNode_prototype, _Node_prototype;
    function FunctionNode(index, scope, params, body, autoReturn, bound, curry, asType, generator, generic) {
      var _this;
      _this = this instanceof FunctionNode ? this : __create(_FunctionNode_prototype);
      if (params == null) {
        params = [];
      }
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
            if (node instanceof LispyNode && node.isCall && node.func.isReturn) {
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
      return [this.params, this.body, this.autoReturn].concat(__toArray(simplifyArray([
        this.bound,
        this.curry,
        this.asType,
        this.generator,
        this.generic
      ])));
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
      var asType, body, bound, params;
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
      if (params !== this.params || body !== this.body || bound !== this.bound || asType !== this.asType) {
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
          this.generic
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
              return callback(null, params !== _this.params || body !== _this.body || bound !== _this.bound || asType !== _this.asType
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
                  _this.generic
                )
                : _this);
            });
          });
        }));
      }));
    };
    return FunctionNode;
  }(Node));
  Node.Ident = Node.byTypeId[21] = IdentNode = (function (Node) {
    var _IdentNode_prototype, _Node_prototype;
    function IdentNode(index, scope, name) {
      var _this;
      _this = this instanceof IdentNode ? this : __create(_IdentNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _IdentNode_prototype = IdentNode.prototype = __create(_Node_prototype);
    _IdentNode_prototype.constructor = IdentNode;
    IdentNode.displayName = "IdentNode";
    if (typeof Node.extended === "function") {
      Node.extended(IdentNode);
    }
    _IdentNode_prototype.typeId = 21;
    IdentNode.argNames = ["name"];
    _IdentNode_prototype.cacheable = false;
    _IdentNode_prototype.type = function (o) {
      if (this.name === "__currentArrayLength") {
        return Type.number;
      } else if (o) {
        return this.scope.type(this);
      } else {
        return Type.any;
      }
    };
    _IdentNode_prototype._isNoop = function (o) {
      return true;
    };
    _IdentNode_prototype.isPrimordial = function () {
      return isPrimordial(this.name);
    };
    _IdentNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "IdentNode", this.index, this.name);
    };
    _IdentNode_prototype.walk = function (f, context) {
      return this;
    };
    _IdentNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return IdentNode;
  }(Node));
  Node.If = Node.byTypeId[22] = IfNode = (function (Node) {
    var _IfNode_prototype, _Node_prototype;
    function IfNode(index, scope, test, whenTrue, whenFalse, label) {
      var _this;
      _this = this instanceof IfNode ? this : __create(_IfNode_prototype);
      if (whenFalse == null) {
        whenFalse = NothingNode(0, scope);
      }
      if (label == null) {
        label = null;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.test = test;
      _this.whenTrue = whenTrue;
      _this.whenFalse = whenFalse;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _IfNode_prototype = IfNode.prototype = __create(_Node_prototype);
    _IfNode_prototype.constructor = IfNode;
    IfNode.displayName = "IfNode";
    if (typeof Node.extended === "function") {
      Node.extended(IfNode);
    }
    _IfNode_prototype.typeId = 22;
    IfNode.argNames = ["test", "whenTrue", "whenFalse", "label"];
    _IfNode_prototype.type = function (o) {
      var _ref;
      if ((_ref = this._type) == null) {
        return this._type = this.whenTrue.type(o).union(this.whenFalse.type(o));
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      }
      return IfNode(
        this.index,
        this.scope,
        this.test,
        this.whenTrue,
        this.whenFalse,
        label
      );
    };
    _IfNode_prototype._reduce = function (o) {
      var label, test, testType, whenFalse, whenTrue;
      test = this.test.reduce(o);
      whenTrue = this.whenTrue.reduce(o);
      whenFalse = this.whenFalse.reduce(o);
      if (this.label != null) {
        label = this.label.reduce(o);
      } else {
        label = this.label;
      }
      if (test.isConst()) {
        return BlockNode(
          this.index,
          this.scope,
          [test.constValue() ? whenTrue : whenFalse],
          label
        ).reduce(o);
      } else {
        testType = test.type(o);
        if (testType.isSubsetOf(Type.alwaysTruthy)) {
          return BlockNode(
            this.index,
            this.scope,
            [test, whenTrue],
            label
          ).reduce(o);
        } else if (testType.isSubsetOf(Type.alwaysFalsy)) {
          return BlockNode(
            this.index,
            this.scope,
            [test, whenFalse],
            label
          ).reduce(o);
        } else if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse || label !== this.label) {
          return IfNode(
            this.index,
            this.scope,
            test,
            whenTrue,
            whenFalse,
            label
          );
        } else {
          return this;
        }
      }
    };
    _IfNode_prototype.isStatement = function () {
      var _ref;
      if ((_ref = this._isStatement) == null) {
        return this._isStatement = this.whenTrue.isStatement() || this.whenFalse.isStatement();
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.doWrap = function (o) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.doWrap(o);
      whenFalse = this.whenFalse.doWrap(o);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return IfNode(
          this.index,
          this.scope,
          this.test,
          whenTrue,
          whenFalse,
          this.label
        );
      } else {
        return this;
      }
    };
    _IfNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.test.isNoop(o) && this.whenTrue.isNoop(o) && this.whenFalse.isNoop(o);
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.mutateLast(o, func, context, includeNoop);
      whenFalse = this.whenFalse.mutateLast(o, func, context, includeNoop);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return IfNode(
          this.index,
          this.scope,
          this.test,
          whenTrue,
          whenFalse,
          this.label
        );
      } else {
        return this;
      }
    };
    _IfNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "IfNode",
        this.index,
        this.test,
        this.whenTrue,
        this.whenFalse,
        this.label
      );
    };
    _IfNode_prototype.walk = function (f, context) {
      var label, test, whenFalse, whenTrue;
      test = f.call(context, this.test);
      whenTrue = f.call(context, this.whenTrue);
      whenFalse = f.call(context, this.whenFalse);
      if (this.label instanceof Node) {
        label = f.call(context, this.label);
      } else {
        label = this.label;
      }
      if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse || label !== this.label) {
        return IfNode(
          this.index,
          this.scope,
          test,
          whenTrue,
          whenFalse,
          label
        );
      } else {
        return this;
      }
    };
    _IfNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.test, (_once = false, function (_e, test) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return f.call(context, _this.whenTrue, (_once2 = false, function (_e2, whenTrue) {
          var _once3;
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return f.call(context, _this.whenFalse, (_once3 = false, function (_e3, whenFalse) {
            if (_once3) {
              throw Error("Attempted to call function more than once");
            } else {
              _once3 = true;
            }
            if (_e3 != null) {
              return callback(_e3);
            }
            return (_this.label instanceof Node
              ? function (next) {
                var _once4;
                return f.call(context, _this.label, (_once4 = false, function (_e4, label) {
                  if (_once4) {
                    throw Error("Attempted to call function more than once");
                  } else {
                    _once4 = true;
                  }
                  if (_e4 != null) {
                    return callback(_e4);
                  }
                  return next(label);
                }));
              }
              : function (next) {
                return next(_this.label);
              })(function (label) {
              return callback(null, test !== _this.test || whenTrue !== _this.whenTrue || whenFalse !== _this.whenFalse || label !== _this.label
                ? IfNode(
                  _this.index,
                  _this.scope,
                  test,
                  whenTrue,
                  whenFalse,
                  label
                )
                : _this);
            });
          }));
        }));
      }));
    };
    return IfNode;
  }(Node));
  Node.MacroAccess = Node.byTypeId[23] = MacroAccessNode = (function (Node) {
    var _MacroAccessNode_prototype, _Node_prototype;
    function MacroAccessNode(index, scope, id, callLine, data, inStatement, inGenerator, inEvilAst, doWrapped) {
      var _this;
      _this = this instanceof MacroAccessNode ? this : __create(_MacroAccessNode_prototype);
      if (inStatement == null) {
        inStatement = false;
      }
      if (inGenerator == null) {
        inGenerator = false;
      }
      if (inEvilAst == null) {
        inEvilAst = false;
      }
      if (doWrapped == null) {
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
      if (label == null) {
        label = null;
      }
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
  Node.MacroConst = Node.byTypeId[24] = MacroConstNode = (function (Node) {
    var _MacroConstNode_prototype, _Node_prototype;
    function MacroConstNode(index, scope, name) {
      var _this;
      _this = this instanceof MacroConstNode ? this : __create(_MacroConstNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _MacroConstNode_prototype = MacroConstNode.prototype = __create(_Node_prototype);
    _MacroConstNode_prototype.constructor = MacroConstNode;
    MacroConstNode.displayName = "MacroConstNode";
    if (typeof Node.extended === "function") {
      Node.extended(MacroConstNode);
    }
    _MacroConstNode_prototype.typeId = 24;
    MacroConstNode.argNames = ["name"];
    _MacroConstNode_prototype.type = function (o) {
      var _ref, c, value;
      if ((_ref = this._type) == null) {
        c = o.getConst(this.name);
        if (!c) {
          return this._type = Type.any;
        } else {
          value = c.value;
          if (value === null) {
            return this._type = Type["null"];
          } else {
            switch (typeof value) {
            case "number": return this._type = Type.number;
            case "string": return this._type = Type.string;
            case "boolean": return this._type = Type.boolean;
            case "undefined": return this._type = Type["undefined"];
            default: throw Error("Unknown type for " + String(c.value));
            }
          }
        }
      } else {
        return _ref;
      }
    };
    _MacroConstNode_prototype._isNoop = function (o) {
      return true;
    };
    _MacroConstNode_prototype.toConst = function (o) {
      var _ref;
      return LispyNode_Value(this.index, (_ref = o.getConst(this.name)) != null ? _ref.value : void 0);
    };
    _MacroConstNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "MacroConstNode", this.index, this.name);
    };
    _MacroConstNode_prototype.walk = function (f, context) {
      return this;
    };
    _MacroConstNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return MacroConstNode;
  }(Node));
  Node.Nothing = Node.byTypeId[25] = NothingNode = (function (Node) {
    var _Node_prototype, _NothingNode_prototype;
    function NothingNode(index, scope) {
      var _this;
      _this = this instanceof NothingNode ? this : __create(_NothingNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _NothingNode_prototype = NothingNode.prototype = __create(_Node_prototype);
    _NothingNode_prototype.constructor = NothingNode;
    NothingNode.displayName = "NothingNode";
    if (typeof Node.extended === "function") {
      Node.extended(NothingNode);
    }
    _NothingNode_prototype.typeId = 25;
    NothingNode.argNames = [];
    _NothingNode_prototype.type = function () {
      return Type["undefined"];
    };
    _NothingNode_prototype.cacheable = false;
    _NothingNode_prototype.isConst = function () {
      return true;
    };
    _NothingNode_prototype.constValue = function () {};
    _NothingNode_prototype.isConstType = function (type) {
      return type === "undefined";
    };
    _NothingNode_prototype.isConstValue = function (value) {
      return value === void 0;
    };
    _NothingNode_prototype._isNoop = function () {
      return true;
    };
    _NothingNode_prototype.mutateLast = function (o, func, context, includeNoop) {
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
    };
    _NothingNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "NothingNode", this.index);
    };
    return NothingNode;
  }(Node));
  Node.Object = Node.byTypeId[26] = ObjectNode = (function (Node) {
    var _Node_prototype, _ObjectNode_prototype;
    function ObjectNode(index, scope, pairs, prototype) {
      var _this;
      _this = this instanceof ObjectNode ? this : __create(_ObjectNode_prototype);
      if (pairs == null) {
        pairs = [];
      }
      if (prototype == null) {
        prototype = void 0;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.pairs = pairs;
      _this.prototype = prototype;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ObjectNode_prototype = ObjectNode.prototype = __create(_Node_prototype);
    _ObjectNode_prototype.constructor = ObjectNode;
    ObjectNode.displayName = "ObjectNode";
    if (typeof Node.extended === "function") {
      Node.extended(ObjectNode);
    }
    _ObjectNode_prototype.typeId = 26;
    ObjectNode.argNames = ["pairs", "prototype"];
    _ObjectNode_prototype.type = function (o) {
      var _arr, _i, _len, _ref, _ref2, data, key, value;
      if ((_ref = this._type) == null) {
        data = {};
        for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          _ref2 = _arr[_i];
          key = _ref2.key;
          value = _ref2.value;
          if (key.isConst()) {
            data[key.constValue()] = value.isConst() && value.constValue() == null ? Type.any : value.type(o);
          }
        }
        return this._type = Type.makeObject(data);
      } else {
        return _ref;
      }
    };
    _ObjectNode_prototype.walk = function (func, context) {
      var pairs, prototype;
      pairs = map(this.pairs, function (pair) {
        var key, value;
        key = func.call(context, pair.key);
        value = func.call(context, pair.value);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value, property: pair.property };
        } else {
          return pair;
        }
      });
      if (this.prototype != null) {
        prototype = func.call(context, this.prototype);
      } else {
        prototype = this.prototype;
      }
      if (pairs !== this.pairs || prototype !== this.prototype) {
        return ObjectNode(this.index, this.scope, pairs, prototype);
      } else {
        return this;
      }
    };
    _ObjectNode_prototype.walkAsync = function (func, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(
        this.pairs,
        function (pair, cb) {
          var _once2;
          return func.call(context, pair.key, (_once2 = false, function (_e, key) {
            var _once3;
            if (_once2) {
              throw Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e != null) {
              return cb(_e);
            }
            return func.call(context, pair.value, (_once3 = false, function (_e2, value) {
              if (_once3) {
                throw Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              if (_e2 != null) {
                return cb(_e2);
              }
              return cb(null, key !== pair.key || value !== pair.value ? { key: key, value: value, property: pair.property } : pair);
            }));
          }));
        },
        null,
        (_once = false, function (_e, pairs) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return callback(_e);
          }
          return (_this.prototype != null
            ? function (next) {
              var _once2;
              return func.call(context, _this.prototype, (_once2 = false, function (_e2, p) {
                if (_once2) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                if (_e2 != null) {
                  return callback(_e2);
                }
                return next(p);
              }));
            }
            : function (next) {
              return next(_this.prototype);
            })(function (prototype) {
            return callback(null, pairs !== _this.pairs || prototype !== _this.prototype ? ObjectNode(_this.index, _this.scope, pairs, prototype) : _this);
          });
        })
      );
    };
    _ObjectNode_prototype._reduce = function (o) {
      var pairs, prototype;
      pairs = map(this.pairs, function (pair) {
        var key, value;
        key = pair.key.reduce(o);
        value = pair.value.reduce(o).doWrap(o);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value, property: pair.property };
        } else {
          return pair;
        }
      });
      if (this.prototype != null) {
        prototype = this.prototype.reduce(o);
      } else {
        prototype = this.prototype;
      }
      if (pairs !== this.pairs || prototype !== this.prototype) {
        return ObjectNode(this.index, this.scope, pairs, prototype);
      } else {
        return this;
      }
    };
    _ObjectNode_prototype._isNoop = function (o) {
      var _arr, _every, _i, _len, _ref, _ref2, key, value;
      if ((_ref = this.__isNoop) == null) {
        _every = true;
        for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          _ref2 = _arr[_i];
          key = _ref2.key;
          value = _ref2.value;
          if (!key.isNoop(o) || !value.isNoop(o)) {
            _every = false;
            break;
          }
        }
        return this.__isNoop = _every;
      } else {
        return _ref;
      }
    };
    _ObjectNode_prototype.isLiteral = function () {
      var _ref, _this;
      _this = this;
      if ((_ref = this._isLiteral) == null) {
        return this._isLiteral = this.prototype == null && (function () {
          var _arr, _every, _i, _len, _ref, key, property, value;
          _every = true;
          for (_arr = __toArray(_this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            _ref = _arr[_i];
            key = _ref.key;
            value = _ref.value;
            property = _ref.property;
            if (!!property || !key.isLiteral() || !value.isLiteral()) {
              _every = false;
              break;
            }
          }
          return _every;
        }());
      } else {
        return _ref;
      }
    };
    _ObjectNode_prototype.literalValue = function () {
      var _arr, _i, _len, _ref, key, result, value;
      if (this.prototype != null) {
        throw Error("Cannot convert object with prototype to a literal");
      }
      result = {};
      for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        _ref = _arr[_i];
        key = _ref.key;
        value = _ref.value;
        result[key.literalValue()] = value.literalValue();
      }
      return result;
    };
    _ObjectNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ObjectNode",
        this.index,
        this.pairs,
        this.prototype
      );
    };
    return ObjectNode;
  }(Node));
  Node.object = function (index, pairs, prototype) {
    var _arr, _i, _len, _ref, key, keyValue, knownKeys, lastPropertyPair,
        ParserError, property;
    knownKeys = [];
    lastPropertyPair = null;
    for (_arr = __toArray(pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      _ref = _arr[_i];
      key = _ref.key;
      property = _ref.property;
      if (key.isConst()) {
        keyValue = String(key.constValue());
        if ((property === "get" || property === "set") && lastPropertyPair && lastPropertyPair.property !== property && lastPropertyPair.key === keyValue) {
          lastPropertyPair = null;
          continue;
        } else if (__in(keyValue, knownKeys)) {
          ParserError = require("./parser").ParserError;
          throw ParserError("Duplicate key " + quote(keyValue) + " in object", this, key.index);
        }
        knownKeys.push(keyValue);
        if (property === "get" || property === "set") {
          lastPropertyPair = { key: keyValue, property: property };
        } else {
          lastPropertyPair = null;
        }
      } else {
        lastPropertyPair = null;
      }
    }
    return this.Object(index, pairs, prototype);
  };
  Node.objectParam = Node.object;
  Node.Param = Node.byTypeId[27] = ParamNode = (function (Node) {
    var _Node_prototype, _ParamNode_prototype;
    function ParamNode(index, scope, ident, defaultValue, spread, isMutable, asType) {
      var _this;
      _this = this instanceof ParamNode ? this : __create(_ParamNode_prototype);
      if (defaultValue == null) {
        defaultValue = void 0;
      }
      if (spread == null) {
        spread = false;
      }
      if (isMutable == null) {
        isMutable = false;
      }
      if (asType == null) {
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
  Node.Root = Node.byTypeId[30] = RootNode = (function (Node) {
    var _Node_prototype, _RootNode_prototype;
    function RootNode(index, scope, file, body, isEmbedded, isGenerator) {
      var _this;
      _this = this instanceof RootNode ? this : __create(_RootNode_prototype);
      if (file == null) {
        file = void 0;
      }
      if (isEmbedded == null) {
        isEmbedded = false;
      }
      if (isGenerator == null) {
        isGenerator = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.file = file;
      _this.body = body;
      _this.isEmbedded = isEmbedded;
      _this.isGenerator = isGenerator;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _RootNode_prototype = RootNode.prototype = __create(_Node_prototype);
    _RootNode_prototype.constructor = RootNode;
    RootNode.displayName = "RootNode";
    if (typeof Node.extended === "function") {
      Node.extended(RootNode);
    }
    _RootNode_prototype.typeId = 30;
    RootNode.argNames = ["file", "body", "isEmbedded", "isGenerator"];
    _RootNode_prototype.isStatement = function () {
      return true;
    };
    _RootNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "RootNode",
        this.index,
        this.file,
        this.body,
        this.isEmbedded,
        this.isGenerator
      );
    };
    _RootNode_prototype.walk = function (f, context) {
      var body;
      body = f.call(context, this.body);
      if (body !== this.body) {
        return RootNode(
          this.index,
          this.scope,
          this.file,
          body,
          this.isEmbedded,
          this.isGenerator
        );
      } else {
        return this;
      }
    };
    _RootNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.body, (_once = false, function (_e, body) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, body !== _this.body
          ? RootNode(
            _this.index,
            _this.scope,
            _this.file,
            body,
            _this.isEmbedded,
            _this.isGenerator
          )
          : _this);
      }));
    };
    return RootNode;
  }(Node));
  Node.Spread = Node.byTypeId[31] = SpreadNode = (function (Node) {
    var _Node_prototype, _SpreadNode_prototype;
    function SpreadNode(index, scope, node) {
      var _this;
      _this = this instanceof SpreadNode ? this : __create(_SpreadNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SpreadNode_prototype = SpreadNode.prototype = __create(_Node_prototype);
    _SpreadNode_prototype.constructor = SpreadNode;
    SpreadNode.displayName = "SpreadNode";
    if (typeof Node.extended === "function") {
      Node.extended(SpreadNode);
    }
    _SpreadNode_prototype.typeId = 31;
    SpreadNode.argNames = ["node"];
    _SpreadNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap(o);
      if (node !== this.node) {
        return SpreadNode(this.index, this.scope, node);
      } else {
        return this;
      }
    };
    _SpreadNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SpreadNode", this.index, this.node);
    };
    _SpreadNode_prototype.walk = function (f, context) {
      var node;
      node = f.call(context, this.node);
      if (node !== this.node) {
        return SpreadNode(this.index, this.scope, node);
      } else {
        return this;
      }
    };
    _SpreadNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.node, (_once = false, function (_e, node) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? SpreadNode(_this.index, _this.scope, node) : _this);
      }));
    };
    return SpreadNode;
  }(Node));
  Node.Super = Node.byTypeId[32] = SuperNode = (function (Node) {
    var _Node_prototype, _SuperNode_prototype;
    function SuperNode(index, scope, child, args) {
      var _this;
      _this = this instanceof SuperNode ? this : __create(_SuperNode_prototype);
      if (child == null) {
        child = void 0;
      }
      if (args == null) {
        args = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.child = child;
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SuperNode_prototype = SuperNode.prototype = __create(_Node_prototype);
    _SuperNode_prototype.constructor = SuperNode;
    SuperNode.displayName = "SuperNode";
    if (typeof Node.extended === "function") {
      Node.extended(SuperNode);
    }
    _SuperNode_prototype.typeId = 32;
    SuperNode.argNames = ["child", "args"];
    _SuperNode_prototype._reduce = function (o) {
      var args, child;
      if (this.child != null) {
        child = this.child.reduce(o).doWrap(o);
      } else {
        child = this.child;
      }
      args = map(this.args, function (node) {
        return node.reduce(o).doWrap(o);
      });
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.index, this.scope, child, args);
      } else {
        return this;
      }
    };
    _SuperNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SuperNode",
        this.index,
        this.child,
        this.args
      );
    };
    _SuperNode_prototype.walk = function (f, context) {
      var args, child;
      if (this.child instanceof Node) {
        child = f.call(context, this.child);
      } else {
        child = this.child;
      }
      args = map(this.args, f, context);
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.index, this.scope, child, args);
      } else {
        return this;
      }
    };
    _SuperNode_prototype.walkAsync = function (f, context, callback) {
      var _this;
      _this = this;
      return (this.child instanceof Node
        ? function (next) {
          var _once;
          return f.call(context, _this.child, (_once = false, function (_e, child) {
            if (_once) {
              throw Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return next(child);
          }));
        }
        : function (next) {
          return next(_this.child);
        })(function (child) {
        var _once;
        return mapAsync(_this.args, f, context, (_once = false, function (_e, args) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, child !== _this.child || args !== _this.args ? SuperNode(_this.index, _this.scope, child, args) : _this);
        }));
      });
    };
    return SuperNode;
  }(Node));
  Node.Switch = Node.byTypeId[33] = SwitchNode = (function (Node) {
    var _Node_prototype, _SwitchNode_prototype;
    function SwitchNode(index, scope, node, cases, defaultCase, label) {
      var _this;
      _this = this instanceof SwitchNode ? this : __create(_SwitchNode_prototype);
      if (cases == null) {
        cases = [];
      }
      if (defaultCase == null) {
        defaultCase = NoopNode(index, scope);
      }
      if (label == null) {
        label = null;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SwitchNode_prototype = SwitchNode.prototype = __create(_Node_prototype);
    _SwitchNode_prototype.constructor = SwitchNode;
    SwitchNode.displayName = "SwitchNode";
    if (typeof Node.extended === "function") {
      Node.extended(SwitchNode);
    }
    _SwitchNode_prototype.typeId = 33;
    SwitchNode.argNames = ["node", "cases", "defaultCase", "label"];
    _SwitchNode_prototype.type = function (o) {
      var _arr, _i, _len, _ref, case_, type;
      if ((_ref = this._type) == null) {
        if (this.defaultCase != null) {
          type = this.defaultCase.type(o);
        } else {
          type = Type["undefined"];
        }
        for (_arr = __toArray(this.cases), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          case_ = _arr[_i];
          if (case_.fallthrough) {
            type = type;
          } else {
            type = type.union(case_.body.type(o));
          }
        }
        return this._type = type;
      } else {
        return _ref;
      }
    };
    _SwitchNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      }
      return SwitchNode(
        this.index,
        this.scope,
        this.node,
        this.cases,
        this.defaultCase,
        label
      );
    };
    _SwitchNode_prototype.walk = function (f, context) {
      var cases, defaultCase, label, node;
      node = f.call(context, this.node);
      cases = map(this.cases, function (case_) {
        var caseBody, caseNode;
        caseNode = f.call(context, case_.node);
        caseBody = f.call(context, case_.body);
        if (caseNode !== case_.node || caseBody !== case_.body) {
          return { node: caseNode, body: caseBody, fallthrough: case_.fallthrough };
        } else {
          return case_;
        }
      });
      if (this.defaultCase) {
        defaultCase = f.call(context, this.defaultCase);
      } else {
        defaultCase = this.defaultCase;
      }
      if (this.label != null) {
        label = f.call(context, this.label);
      } else {
        label = this.label;
      }
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase || label !== this.label) {
        return SwitchNode(
          this.index,
          this.scope,
          node,
          cases,
          defaultCase,
          label
        );
      } else {
        return this;
      }
    };
    _SwitchNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.node, (_once = false, function (_e, node) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(
          _this.cases,
          function (case_, cb) {
            var _once3;
            return f.call(context, case_.node, (_once3 = false, function (_e2, caseNode) {
              var _once4;
              if (_once3) {
                throw Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              if (_e2 != null) {
                return cb(_e2);
              }
              return f.call(context, case_.body, (_once4 = false, function (_e3, caseBody) {
                if (_once4) {
                  throw Error("Attempted to call function more than once");
                } else {
                  _once4 = true;
                }
                if (_e3 != null) {
                  return cb(_e3);
                }
                return cb(null, caseNode !== case_.node || caseBody !== case_.body ? { node: caseNode, body: caseBody, fallthrough: case_.fallthrough } : case_);
              }));
            }));
          },
          null,
          (_once2 = false, function (_e2, cases) {
            if (_once2) {
              throw Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e2 != null) {
              return callback(_e2);
            }
            return (_this.defaultCase != null
              ? function (next) {
                var _once3;
                return f.call(context, _this.defaultCase, (_once3 = false, function (_e3, x) {
                  if (_once3) {
                    throw Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  if (_e3 != null) {
                    return callback(_e3);
                  }
                  return next(x);
                }));
              }
              : function (next) {
                return next(_this.defaultCase);
              })(function (defaultCase) {
              return (_this.label != null
                ? function (next) {
                  var _once3;
                  return f.call(context, _this.label, (_once3 = false, function (_e3, x) {
                    if (_once3) {
                      throw Error("Attempted to call function more than once");
                    } else {
                      _once3 = true;
                    }
                    if (_e3 != null) {
                      return callback(_e3);
                    }
                    return next(x);
                  }));
                }
                : function (next) {
                  return next(_this.label);
                })(function (label) {
                return callback(null, node !== _this.node || cases !== _this.cases || defaultCase !== _this.defaultCase || label !== _this.label
                  ? SwitchNode(
                    _this.index,
                    _this.scope,
                    node,
                    cases,
                    defaultCase,
                    label
                  )
                  : _this);
              });
            });
          })
        );
      }));
    };
    _SwitchNode_prototype.isStatement = function () {
      return true;
    };
    _SwitchNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      var _arr, _arr2, _i, _len, body, case_, cases, casesChanged, defaultCase;
      casesChanged = false;
      for (_arr = [], _arr2 = __toArray(this.cases), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        case_ = _arr2[_i];
        if (case_.fallthrough) {
          _arr.push(case_);
        } else {
          body = case_.body.mutateLast(o, func, context, includeNoop);
          if (body !== case_.body) {
            casesChanged = true;
            _arr.push({ node: case_.node, body: body, fallthrough: case_.fallthrough });
          } else {
            _arr.push(case_);
          }
        }
      }
      cases = _arr;
      defaultCase = this.defaultCase.mutateLast(o, func, context, includeNoop);
      if (casesChanged || defaultCase !== this.defaultCase) {
        return SwitchNode(
          this.index,
          this.scope,
          this.node,
          cases,
          defaultCase,
          this.label
        );
      } else {
        return this;
      }
    };
    _SwitchNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SwitchNode",
        this.index,
        this.node,
        this.cases,
        this.defaultCase,
        this.label
      );
    };
    return SwitchNode;
  }(Node));
  Node.SyntaxChoice = Node.byTypeId[34] = SyntaxChoiceNode = (function (Node) {
    var _Node_prototype, _SyntaxChoiceNode_prototype;
    function SyntaxChoiceNode(index, scope, choices) {
      var _this;
      _this = this instanceof SyntaxChoiceNode ? this : __create(_SyntaxChoiceNode_prototype);
      if (choices == null) {
        choices = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.choices = choices;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxChoiceNode_prototype = SyntaxChoiceNode.prototype = __create(_Node_prototype);
    _SyntaxChoiceNode_prototype.constructor = SyntaxChoiceNode;
    SyntaxChoiceNode.displayName = "SyntaxChoiceNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxChoiceNode);
    }
    _SyntaxChoiceNode_prototype.typeId = 34;
    SyntaxChoiceNode.argNames = ["choices"];
    _SyntaxChoiceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxChoiceNode", this.index, this.choices);
    };
    _SyntaxChoiceNode_prototype.walk = function (f, context) {
      var choices;
      choices = map(this.choices, f, context);
      if (choices !== this.choices) {
        return SyntaxChoiceNode(this.index, this.scope, choices);
      } else {
        return this;
      }
    };
    _SyntaxChoiceNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.choices, f, context, (_once = false, function (_e, choices) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, choices !== _this.choices ? SyntaxChoiceNode(_this.index, _this.scope, choices) : _this);
      }));
    };
    return SyntaxChoiceNode;
  }(Node));
  Node.SyntaxMany = Node.byTypeId[35] = SyntaxManyNode = (function (Node) {
    var _Node_prototype, _SyntaxManyNode_prototype;
    function SyntaxManyNode(index, scope, inner, multiplier) {
      var _this;
      _this = this instanceof SyntaxManyNode ? this : __create(_SyntaxManyNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.inner = inner;
      _this.multiplier = multiplier;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxManyNode_prototype = SyntaxManyNode.prototype = __create(_Node_prototype);
    _SyntaxManyNode_prototype.constructor = SyntaxManyNode;
    SyntaxManyNode.displayName = "SyntaxManyNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxManyNode);
    }
    _SyntaxManyNode_prototype.typeId = 35;
    SyntaxManyNode.argNames = ["inner", "multiplier"];
    _SyntaxManyNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SyntaxManyNode",
        this.index,
        this.inner,
        this.multiplier
      );
    };
    _SyntaxManyNode_prototype.walk = function (f, context) {
      var inner;
      inner = f.call(context, this.inner);
      if (inner !== this.inner) {
        return SyntaxManyNode(this.index, this.scope, inner, this.multiplier);
      } else {
        return this;
      }
    };
    _SyntaxManyNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.inner, (_once = false, function (_e, inner) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, inner !== _this.inner ? SyntaxManyNode(_this.index, _this.scope, inner, _this.multiplier) : _this);
      }));
    };
    return SyntaxManyNode;
  }(Node));
  Node.SyntaxParam = Node.byTypeId[36] = SyntaxParamNode = (function (Node) {
    var _Node_prototype, _SyntaxParamNode_prototype;
    function SyntaxParamNode(index, scope, ident, asType) {
      var _this;
      _this = this instanceof SyntaxParamNode ? this : __create(_SyntaxParamNode_prototype);
      if (asType == null) {
        asType = void 0;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.asType = asType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxParamNode_prototype = SyntaxParamNode.prototype = __create(_Node_prototype);
    _SyntaxParamNode_prototype.constructor = SyntaxParamNode;
    SyntaxParamNode.displayName = "SyntaxParamNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxParamNode);
    }
    _SyntaxParamNode_prototype.typeId = 36;
    SyntaxParamNode.argNames = ["ident", "asType"];
    _SyntaxParamNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SyntaxParamNode",
        this.index,
        this.ident,
        this.asType
      );
    };
    _SyntaxParamNode_prototype.walk = function (f, context) {
      var asType, ident;
      ident = f.call(context, this.ident);
      if (this.asType instanceof Node) {
        asType = f.call(context, this.asType);
      } else {
        asType = this.asType;
      }
      if (ident !== this.ident || asType !== this.asType) {
        return SyntaxParamNode(this.index, this.scope, ident, asType);
      } else {
        return this;
      }
    };
    _SyntaxParamNode_prototype.walkAsync = function (f, context, callback) {
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
          return callback(null, ident !== _this.ident || asType !== _this.asType ? SyntaxParamNode(_this.index, _this.scope, ident, asType) : _this);
        });
      }));
    };
    return SyntaxParamNode;
  }(Node));
  Node.SyntaxSequence = Node.byTypeId[37] = SyntaxSequenceNode = (function (Node) {
    var _Node_prototype, _SyntaxSequenceNode_prototype;
    function SyntaxSequenceNode(index, scope, params) {
      var _this;
      _this = this instanceof SyntaxSequenceNode ? this : __create(_SyntaxSequenceNode_prototype);
      if (params == null) {
        params = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxSequenceNode_prototype = SyntaxSequenceNode.prototype = __create(_Node_prototype);
    _SyntaxSequenceNode_prototype.constructor = SyntaxSequenceNode;
    SyntaxSequenceNode.displayName = "SyntaxSequenceNode";
    if (typeof Node.extended === "function") {
      Node.extended(SyntaxSequenceNode);
    }
    _SyntaxSequenceNode_prototype.typeId = 37;
    SyntaxSequenceNode.argNames = ["params"];
    _SyntaxSequenceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxSequenceNode", this.index, this.params);
    };
    _SyntaxSequenceNode_prototype.walk = function (f, context) {
      var params;
      params = map(this.params, f, context);
      if (params !== this.params) {
        return SyntaxSequenceNode(this.index, this.scope, params);
      } else {
        return this;
      }
    };
    _SyntaxSequenceNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.params, f, context, (_once = false, function (_e, params) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, params !== _this.params ? SyntaxSequenceNode(_this.index, _this.scope, params) : _this);
      }));
    };
    return SyntaxSequenceNode;
  }(Node));
  Node.Tmp = Node.byTypeId[40] = TmpNode = (function (Node) {
    var _Node_prototype, _TmpNode_prototype;
    function TmpNode(index, scope, id, name, _type) {
      var _this;
      _this = this instanceof TmpNode ? this : __create(_TmpNode_prototype);
      if (_type == null) {
        _type = Type.any;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.name = name;
      _this._type = _type;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TmpNode_prototype = TmpNode.prototype = __create(_Node_prototype);
    _TmpNode_prototype.constructor = TmpNode;
    TmpNode.displayName = "TmpNode";
    if (typeof Node.extended === "function") {
      Node.extended(TmpNode);
    }
    _TmpNode_prototype.typeId = 40;
    TmpNode.argNames = ["id", "name", "_type"];
    _TmpNode_prototype.cacheable = false;
    _TmpNode_prototype.type = function () {
      return this._type;
    };
    _TmpNode_prototype._isNoop = function () {
      return true;
    };
    _TmpNode_prototype._toJSON = function () {
      if (this._type === Type.any || true) {
        return [this.id, this.name];
      } else {
        return [this.id, this.name, this._type];
      }
    };
    _TmpNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TmpNode",
        this.index,
        this.id,
        this.name,
        this._type
      );
    };
    _TmpNode_prototype.walk = function (f, context) {
      return this;
    };
    _TmpNode_prototype.walkAsync = function (f, context, callback) {
      return callback(null, this);
    };
    return TmpNode;
  }(Node));
  Node.TmpWrapper = Node.byTypeId[41] = TmpWrapperNode = (function (Node) {
    var _Node_prototype, _TmpWrapperNode_prototype;
    function TmpWrapperNode(index, scope, node, tmps) {
      var _this;
      _this = this instanceof TmpWrapperNode ? this : __create(_TmpWrapperNode_prototype);
      if (tmps == null) {
        tmps = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.tmps = tmps;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TmpWrapperNode_prototype = TmpWrapperNode.prototype = __create(_Node_prototype);
    _TmpWrapperNode_prototype.constructor = TmpWrapperNode;
    TmpWrapperNode.displayName = "TmpWrapperNode";
    if (typeof Node.extended === "function") {
      Node.extended(TmpWrapperNode);
    }
    _TmpWrapperNode_prototype.typeId = 41;
    TmpWrapperNode.argNames = ["node", "tmps"];
    _TmpWrapperNode_prototype.type = function (o) {
      return this.node.type(o);
    };
    _TmpWrapperNode_prototype.withLabel = function (label, o) {
      if (label == null) {
        label = null;
      }
      return TmpWrapperNode(
        this.index,
        this.scope,
        this.node.withLabel(label, o),
        this.tmps
      );
    };
    _TmpWrapperNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o);
      if (this.tmps.length === 0) {
        return node;
      } else if (this.node !== node) {
        return TmpWrapperNode(this.index, this.scope, node, this.tmps);
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.isStatement = function () {
      return this.node.isStatement();
    };
    _TmpWrapperNode_prototype._isNoop = function (o) {
      return this.node.isNoop(o);
    };
    _TmpWrapperNode_prototype.doWrap = function (o) {
      var node;
      node = this.node.doWrap(o);
      if (node !== this.node) {
        return TmpWrapperNode(this.index, this.scope, node, this.tmps);
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.mutateLast = function (o, func, context, includeNoop) {
      var node;
      node = this.node.mutateLast(o, func, context, includeNoop);
      if (node !== this.node) {
        return TmpWrapperNode(this.index, this.scope, node, this.tmps);
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TmpWrapperNode",
        this.index,
        this.node,
        this.tmps
      );
    };
    _TmpWrapperNode_prototype.walk = function (f, context) {
      var node;
      node = f.call(context, this.node);
      if (node !== this.node) {
        return TmpWrapperNode(this.index, this.scope, node, this.tmps);
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.node, (_once = false, function (_e, node) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? TmpWrapperNode(_this.index, _this.scope, node, _this.tmps) : _this);
      }));
    };
    return TmpWrapperNode;
  }(Node));
  Node.TypeFunction = Node.byTypeId[44] = TypeFunctionNode = (function (Node) {
    var _Node_prototype, _TypeFunctionNode_prototype;
    function TypeFunctionNode(index, scope, returnType) {
      var _this;
      _this = this instanceof TypeFunctionNode ? this : __create(_TypeFunctionNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.returnType = returnType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeFunctionNode_prototype = TypeFunctionNode.prototype = __create(_Node_prototype);
    _TypeFunctionNode_prototype.constructor = TypeFunctionNode;
    TypeFunctionNode.displayName = "TypeFunctionNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeFunctionNode);
    }
    _TypeFunctionNode_prototype.typeId = 44;
    TypeFunctionNode.argNames = ["returnType"];
    _TypeFunctionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeFunctionNode", this.index, this.returnType);
    };
    _TypeFunctionNode_prototype.walk = function (f, context) {
      var returnType;
      returnType = f.call(context, this.returnType);
      if (returnType !== this.returnType) {
        return TypeFunctionNode(this.index, this.scope, returnType);
      } else {
        return this;
      }
    };
    _TypeFunctionNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.returnType, (_once = false, function (_e, returnType) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, returnType !== _this.returnType ? TypeFunctionNode(_this.index, _this.scope, returnType) : _this);
      }));
    };
    return TypeFunctionNode;
  }(Node));
  Node.TypeGeneric = Node.byTypeId[45] = TypeGenericNode = (function (Node) {
    var _Node_prototype, _TypeGenericNode_prototype;
    function TypeGenericNode(index, scope, basetype, args) {
      var _this;
      _this = this instanceof TypeGenericNode ? this : __create(_TypeGenericNode_prototype);
      if (args == null) {
        args = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.basetype = basetype;
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeGenericNode_prototype = TypeGenericNode.prototype = __create(_Node_prototype);
    _TypeGenericNode_prototype.constructor = TypeGenericNode;
    TypeGenericNode.displayName = "TypeGenericNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeGenericNode);
    }
    _TypeGenericNode_prototype.typeId = 45;
    TypeGenericNode.argNames = ["basetype", "args"];
    _TypeGenericNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TypeGenericNode",
        this.index,
        this.basetype,
        this.args
      );
    };
    _TypeGenericNode_prototype.walk = function (f, context) {
      var args, basetype;
      basetype = f.call(context, this.basetype);
      args = map(this.args, f, context);
      if (basetype !== this.basetype || args !== this.args) {
        return TypeGenericNode(this.index, this.scope, basetype, args);
      } else {
        return this;
      }
    };
    _TypeGenericNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.basetype, (_once = false, function (_e, basetype) {
        var _once2;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.args, f, context, (_once2 = false, function (_e2, args) {
          if (_once2) {
            throw Error("Attempted to call function more than once");
          } else {
            _once2 = true;
          }
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, basetype !== _this.basetype || args !== _this.args ? TypeGenericNode(_this.index, _this.scope, basetype, args) : _this);
        }));
      }));
    };
    return TypeGenericNode;
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
  Node.TypeUnion = Node.byTypeId[47] = TypeUnionNode = (function (Node) {
    var _Node_prototype, _TypeUnionNode_prototype;
    function TypeUnionNode(index, scope, types) {
      var _this;
      _this = this instanceof TypeUnionNode ? this : __create(_TypeUnionNode_prototype);
      if (types == null) {
        types = [];
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.types = types;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeUnionNode_prototype = TypeUnionNode.prototype = __create(_Node_prototype);
    _TypeUnionNode_prototype.constructor = TypeUnionNode;
    TypeUnionNode.displayName = "TypeUnionNode";
    if (typeof Node.extended === "function") {
      Node.extended(TypeUnionNode);
    }
    _TypeUnionNode_prototype.typeId = 47;
    TypeUnionNode.argNames = ["types"];
    _TypeUnionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeUnionNode", this.index, this.types);
    };
    _TypeUnionNode_prototype.walk = function (f, context) {
      var types;
      types = map(this.types, f, context);
      if (types !== this.types) {
        return TypeUnionNode(this.index, this.scope, types);
      } else {
        return this;
      }
    };
    _TypeUnionNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return mapAsync(this.types, f, context, (_once = false, function (_e, types) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, types !== _this.types ? TypeUnionNode(_this.index, _this.scope, types) : _this);
      }));
    };
    return TypeUnionNode;
  }(Node));
  Node.Unary = Node.byTypeId[48] = UnaryNode = (function (Node) {
    var _Node_prototype, _UnaryNode_prototype;
    function UnaryNode(index, scope, op, node) {
      var _this;
      _this = this instanceof UnaryNode ? this : __create(_UnaryNode_prototype);
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.op = op;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _UnaryNode_prototype = UnaryNode.prototype = __create(_Node_prototype);
    _UnaryNode_prototype.constructor = UnaryNode;
    UnaryNode.displayName = "UnaryNode";
    if (typeof Node.extended === "function") {
      Node.extended(UnaryNode);
    }
    _UnaryNode_prototype.typeId = 48;
    UnaryNode.argNames = ["op", "node"];
    _UnaryNode_prototype.type = (function () {
      var ops;
      ops = {
        "-": Type.number,
        "+": Type.number,
        "--": Type.number,
        "++": Type.number,
        "--post": Type.number,
        "++post": Type.number,
        "!": Type.boolean,
        "~": Type.number,
        "typeof": Type.string,
        "delete": Type.boolean
      };
      return function () {
        var _ref;
        return (__owns.call(ops, _ref = this.op) ? ops[_ref] : void 0) || Type.any;
      };
    }());
    _UnaryNode_prototype._reduce = (function () {
      var constOps, nonconstOps;
      constOps = {
        "-": function (x) {
          return -x;
        },
        "+": function (x) {
          return +x;
        },
        "!": function (x) {
          return !x;
        },
        "~": function (x) {
          return ~x;
        },
        "typeof": function (x) {
          return typeof x;
        }
      };
      nonconstOps = {
        "+": function (node, o) {
          if (node.type(o).isSubsetOf(Type.number)) {
            return node;
          }
        },
        "-": function (node) {
          var _ref;
          if (node instanceof UnaryNode) {
            if ((_ref = node.op) === "-" || _ref === "+") {
              return UnaryNode(
                this.index,
                this.scope,
                node.op === "-" ? "+" : "-",
                node.node
              );
            }
          } else if (node instanceof BinaryNode) {
            if ((_ref = node.op) === "-" || _ref === "+") {
              return BinaryNode(
                this.index,
                this.scope,
                UnaryNode(node.left.index, node.left.scope, "-", node.left),
                node.op === "-" ? "+" : "-",
                node.right
              );
            } else if ((_ref = node.op) === "*" || _ref === "/") {
              return BinaryNode(
                this.index,
                this.scope,
                UnaryNode(node.left.index, node.left.scope, "-", node.left),
                node.op,
                node.right
              );
            }
          }
        },
        "!": (function () {
          var invertibleBinaryOps;
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
              return BinaryNode(
                this.index,
                this.scope,
                UnaryNode(x.index, x.scope, "!", x),
                "||",
                UnaryNode(y.index, y.scope, "!", y)
              );
            },
            "||": function (x, y) {
              return BinaryNode(
                this.index,
                this.scope,
                UnaryNode(x.index, x.scope, "!", x),
                "&&",
                UnaryNode(y.index, y.scope, "!", y)
              );
            }
          };
          return function (node, o) {
            var invert;
            if (node instanceof UnaryNode) {
              if (node.op === "!" && node.node.type(o).isSubsetOf(Type.boolean)) {
                return node.node;
              }
            } else if (node instanceof BinaryNode && __owns.call(invertibleBinaryOps, node.op)) {
              invert = invertibleBinaryOps[node.op];
              if (typeof invert === "function") {
                return invert.call(this, node.left, node.right);
              } else {
                return BinaryNode(
                  this.index,
                  this.scope,
                  node.left,
                  invert,
                  node.right
                );
              }
            }
          };
        }()),
        "typeof": (function () {
          var objectType;
          objectType = Type["null"].union(Type.object).union(Type.arrayLike).union(Type.regexp).union(Type.date).union(Type.error);
          return function (node, o) {
            var type;
            if (node.isNoop(o)) {
              type = node.type(o);
              if (type.isSubsetOf(Type.number)) {
                return LispyNode_Value(this.index, "number");
              } else if (type.isSubsetOf(Type.string)) {
                return LispyNode_Value(this.index, "string");
              } else if (type.isSubsetOf(Type.boolean)) {
                return LispyNode_Value(this.index, "boolean");
              } else if (type.isSubsetOf(Type["undefined"])) {
                return LispyNode_Value(this.index, "undefined");
              } else if (type.isSubsetOf(Type["function"])) {
                return LispyNode_Value(this.index, "function");
              } else if (type.isSubsetOf(objectType)) {
                return LispyNode_Value(this.index, "object");
              }
            }
          };
        }())
      };
      return function (o) {
        var node, op, result;
        node = this.node.reduce(o).doWrap(o);
        op = this.op;
        if (node.isConst() && __owns.call(constOps, op)) {
          return LispyNode_Value(this.index, constOps[op](node.constValue()));
        }
        if (__owns.call(nonconstOps, op)) {
          result = nonconstOps[op].call(this, node, o);
        }
        if (result != null) {
          return result.reduce(o);
        }
        if (node !== this.node) {
          return UnaryNode(this.index, this.scope, op, node);
        } else {
          return this;
        }
      };
    }());
    _UnaryNode_prototype._isNoop = function (o) {
      var _ref, _ref2;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = (_ref2 = this.op) !== "++" && _ref2 !== "--" && _ref2 !== "++post" && _ref2 !== "--post" && _ref2 !== "delete" && this.node.isNoop(o);
      } else {
        return _ref;
      }
    };
    _UnaryNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "UnaryNode",
        this.index,
        this.op,
        this.node
      );
    };
    _UnaryNode_prototype.walk = function (f, context) {
      var node;
      node = f.call(context, this.node);
      if (node !== this.node) {
        return UnaryNode(this.index, this.scope, this.op, node);
      } else {
        return this;
      }
    };
    _UnaryNode_prototype.walkAsync = function (f, context, callback) {
      var _once, _this;
      _this = this;
      return f.call(context, this.node, (_once = false, function (_e, node) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? UnaryNode(_this.index, _this.scope, _this.op, node) : _this);
      }));
    };
    return UnaryNode;
  }(Node));
  Node.Var = Node.byTypeId[49] = VarNode = (function (Node) {
    var _Node_prototype, _VarNode_prototype;
    function VarNode(index, scope, ident, isMutable) {
      var _this;
      _this = this instanceof VarNode ? this : __create(_VarNode_prototype);
      if (isMutable == null) {
        isMutable = false;
      }
      _this.index = index;
      _this.scope = scope;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.isMutable = isMutable;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _VarNode_prototype = VarNode.prototype = __create(_Node_prototype);
    _VarNode_prototype.constructor = VarNode;
    VarNode.displayName = "VarNode";
    if (typeof Node.extended === "function") {
      Node.extended(VarNode);
    }
    _VarNode_prototype.typeId = 49;
    VarNode.argNames = ["ident", "isMutable"];
    _VarNode_prototype.type = function () {
      return Type["undefined"];
    };
    _VarNode_prototype._reduce = function (o) {
      var ident;
      ident = this.ident.reduce(o);
      if (ident !== this.ident) {
        return VarNode(this.index, this.scope, ident, this.isMutable);
      } else {
        return this;
      }
    };
    _VarNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "VarNode",
        this.index,
        this.ident,
        this.isMutable
      );
    };
    _VarNode_prototype.walk = function (f, context) {
      var ident;
      ident = f.call(context, this.ident);
      if (ident !== this.ident) {
        return VarNode(this.index, this.scope, ident, this.isMutable);
      } else {
        return this;
      }
    };
    _VarNode_prototype.walkAsync = function (f, context, callback) {
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
        return callback(null, ident !== _this.ident ? VarNode(_this.index, _this.scope, ident, _this.isMutable) : _this);
      }));
    };
    return VarNode;
  }(Node));
  module.exports = Node;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
