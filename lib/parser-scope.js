(function () {
  "use strict";
  var __create, __import, __isArray, __owns, __slice, __toArray, __typeof, _ref,
      Ident, ParserNode, Scope, ScopeDestroyedError, Tmp, Type;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
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
  Type = require("./types");
  ParserNode = require("./parser-nodes");
  Ident = ParserNode.Symbol.ident;
  Tmp = ParserNode.Symbol.tmp;
  ScopeDestroyedError = (function (Error) {
    var _Error_prototype, _ScopeDestroyedError_prototype;
    function ScopeDestroyedError(message) {
      var _this, err;
      _this = this instanceof ScopeDestroyedError ? this : __create(_ScopeDestroyedError_prototype);
      if (message == null) {
        message = "Scope already destroyed";
      }
      _this.message = message;
      err = Error.call(_this, _this.message);
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, ScopeDestroyedError);
      } else if ("stack" in err) {
        _this.stack = err.stack;
      }
      return _this;
    }
    _Error_prototype = Error.prototype;
    _ScopeDestroyedError_prototype = ScopeDestroyedError.prototype = __create(_Error_prototype);
    _ScopeDestroyedError_prototype.constructor = ScopeDestroyedError;
    ScopeDestroyedError.displayName = "ScopeDestroyedError";
    if (typeof Error.extended === "function") {
      Error.extended(ScopeDestroyedError);
    }
    _ScopeDestroyedError_prototype.name = "ScopeDestroyedError";
    return ScopeDestroyedError;
  }(Error));
  Scope = (function () {
    var _Scope_prototype;
    function Scope(parent, isTop) {
      var _this;
      _this = this instanceof Scope ? this : __create(_Scope_prototype);
      if (parent == null) {
        parent = null;
      }
      _this.parent = parent;
      if (isTop == null) {
        isTop = false;
      }
      _this.isTop = isTop;
      if (!parent && !isTop) {
        throw new Error("Must either provide a parent or is-top = true");
      }
      _this.destroyed = false;
      _this.children = [];
      _this.variables = {};
      _this.consts = {};
      _this.tmps = {};
      if (!isTop) {
        parent.children.push(_this);
      }
      return _this;
    }
    _Scope_prototype = Scope.prototype;
    Scope.displayName = "Scope";
    _Scope_prototype._allVariables = function () {
      var _arr, _i, _len, child, obj;
      obj = __import({}, this.variables);
      for (_arr = __toArray(this.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        child = _arr[_i];
        __import(obj, child._allVariables());
      }
      return obj;
    };
    _Scope_prototype._allTmps = function () {
      var _arr, _i, _len, child, obj;
      obj = __import({}, this.tmps);
      for (_arr = __toArray(this.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        child = _arr[_i];
        __import(obj, child._allTmps());
      }
      return obj;
    };
    _Scope_prototype._allConsts = function () {
      var _arr, _i, _len, child, obj;
      obj = __import({}, this.consts);
      for (_arr = __toArray(this.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        child = _arr[_i];
        __import(obj, child._allConsts());
      }
      return obj;
    };
    function isEmpty(obj) {
      var k;
      for (k in obj) {
        if (__owns.call(obj, k)) {
          return false;
        }
      }
      return true;
    }
    _Scope_prototype.inspect = function () {
      var consts, inspect, text, tmps, variables;
      if (!this.isTop) {
        return this.top().inspect();
      }
      inspect = require("util").inspect;
      variables = this._allVariables();
      tmps = this._allTmps();
      consts = this._allConsts();
      text = [];
      text.push("Scope(");
      if (!isEmpty(variables) || !isEmpty(tmps) || !isEmpty(consts)) {
        text.push(inspect(variables));
      }
      if (!isEmpty(tmps) || !isEmpty(consts)) {
        text.push(", ");
        text.push(inspect(tmps));
      }
      if (!isEmpty(consts)) {
        text.push(", ");
        text.push(inspect(consts));
      }
      text.push(")");
      if (this.parent) {
        text.push(" -> ");
        text.push(this.parent.inspect());
      }
      return text.join("");
    };
    _Scope_prototype.destroy = function () {
      var _arr, _i, child, index, parentChildren;
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      for (_arr = __toArray(this.children), _i = _arr.length; _i--; ) {
        child = _arr[_i];
        child.destroy();
      }
      if (!this.isTop) {
        parentChildren = this.parent.children;
        index = parentChildren.lastIndexOf(this);
        if (index === -1) {
          throw new Error("Not found in parents' children");
        }
        parentChildren.splice(index, 1);
      }
    };
    _Scope_prototype.clone = function (isTop) {
      if (isTop == null) {
        isTop = false;
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return Scope(this, isTop);
    };
    _Scope_prototype.reparent = function (parent) {
      var index, oldParent, oldParentChildren;
      if (parent == null) {
        parent = null;
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      if (!parent && !this.isTop) {
        throw new Error("Must either provide a parent or is-top = true");
      }
      oldParent = this.parent;
      if (parent === oldParent) {
        return;
      }
      if (parent === this) {
        throw new Error("Cannot parent to self");
      }
      if (parent && parent.parent === this) {
        throw new Error("Trying to become your own grandpa");
      }
      this.parent = parent;
      if (!this.isTop) {
        oldParentChildren = oldParent.children;
        index = oldParentChildren.lastIndexOf(this);
        if (index === -1) {
          throw new Error("Not found in old parents' children");
        }
        oldParentChildren.splice(index, 1);
        parent.children.push(this);
      }
    };
    _Scope_prototype.top = function () {
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      if (this.isTop) {
        return this;
      } else {
        return this.parent.top();
      }
    };
    _Scope_prototype.add = function (ident, isMutable, type) {
      if (isMutable == null) {
        isMutable = false;
      }
      if (type == null) {
        type = null;
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      if (ident instanceof Tmp) {
        this.tmps[ident.id] = { isMutable: isMutable, type: type };
      } else {
        this.variables[ident.name] = { isMutable: isMutable, type: type };
      }
    };
    _Scope_prototype.addConst = function (name, value) {
      this.consts[name] = value;
    };
    function getIdent(scope, name) {
      var _arr, _i, _len, _ref, child, variables;
      variables = scope.variables;
      if (__owns.call(variables, name)) {
        return variables[name];
      } else {
        for (_arr = __toArray(scope.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          child = _arr[_i];
          if ((_ref = getIdent(child, name)) != null) {
            return _ref;
          }
        }
      }
    }
    function getTmp(scope, id) {
      var _arr, _i, _len, _ref, child, tmps;
      tmps = scope.tmps;
      if (__owns.call(tmps, id)) {
        return tmps[id];
      } else {
        for (_arr = __toArray(scope.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          child = _arr[_i];
          if ((_ref = getTmp(child, id)) != null) {
            return _ref;
          }
        }
      }
    }
    function get(scope, ident) {
      var _ref, _ref2, current, isTmp, layers;
      current = scope;
      isTmp = ident instanceof Tmp;
      layers = 0;
      while (current) {
        ++layers;
        if (layers > 1000) {
          throw new Error("Infinite loop detected");
        }
        current = current.top();
        if (isTmp) {
          if ((_ref = getTmp(current, ident.id)) != null) {
            return _ref;
          }
        } else if ((_ref2 = getIdent(current, ident.name)) != null) {
          return _ref2;
        }
        current = current.parent;
      }
    }
    _Scope_prototype.has = function (ident) {
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return get(this, ident) != null;
    };
    _Scope_prototype.isMutable = function (ident) {
      var _ref;
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return ((_ref = get(this, ident)) != null ? _ref.isMutable : void 0) || false;
    };
    _Scope_prototype.type = function (ident) {
      var data, type;
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      data = get(this, ident);
      if (data) {
        type = data.type;
        if (typeof type === "function") {
          data.type = Type.any;
          data.type = type = type();
        }
        if (data.isMutable && type && type.isSubsetOf(Type.undefinedOrNull)) {
          return data.type = Type.any;
        } else {
          return type;
        }
      } else {
        return Type.any;
      }
    };
    function getConst(scope, name) {
      var _arr, _i, _len, _ref, child, consts;
      consts = scope.consts;
      if (__owns.call(consts, name)) {
        return { value: consts[name] };
      } else {
        for (_arr = __toArray(scope.children), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          child = _arr[_i];
          if ((_ref = getConst(child, name)) != null) {
            return _ref;
          }
        }
      }
    }
    _Scope_prototype.constValue = function (name) {
      var _ref, current, layers;
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      current = this;
      layers = 0;
      while (current) {
        ++layers;
        if (layers > 1000) {
          throw new Error("Infinite loop detected");
        }
        current = current.top();
        if ((_ref = getConst(current, name)) != null) {
          return _ref;
        }
        current = current.parent;
      }
    };
    return Scope;
  }());
  module.exports = Scope;
  _ref = module.exports;
  _ref.ScopeDestroyedError = ScopeDestroyedError;
}.call(this));
