(function () {
  "use strict";
  var __create, __import, __isArray, __name, __owns, __slice, __strnum, __toArray, __typeof, _ref, IdentNode, Node, Scope, ScopeDestroyedError, TmpNode, Type;
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
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __name = function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else {
      return __slice.call(x);
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
  Node = require("./parser-nodes");
  IdentNode = Node.Ident;
  TmpNode = Node.Tmp;
  ScopeDestroyedError = (function (Error) {
    var _Error_prototype, _ScopeDestroyedError_prototype;
    function ScopeDestroyedError(message) {
      var _this, err;
      _this = this instanceof ScopeDestroyedError ? this : __create(_ScopeDestroyedError_prototype);
      if (message == null) {
        message = "Scope already destroyed";
      } else if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
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
      } else if (!(parent instanceof Scope)) {
        throw TypeError("Expected parent to be one of " + (__name(Scope) + " or null") + ", got " + __typeof(parent));
      }
      _this.parent = parent;
      if (isTop == null) {
        isTop = false;
      } else if (typeof isTop !== "boolean") {
        throw TypeError("Expected isTop to be a Boolean, got " + __typeof(isTop));
      }
      _this.isTop = isTop;
      if (!parent && !isTop) {
        throw Error("Must either provide a parent or is-top = true");
      }
      _this.destroyed = false;
      _this.children = [];
      _this.variables = {};
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
    _Scope_prototype.inspect = function () {
      var inspect, text;
      if (!this.isTop) {
        return this.top().inspect();
      }
      inspect = require("util").inspect;
      text = "Scope(" + __strnum(inspect(this._allVariables())) + ", " + __strnum(inspect(this._allTmps())) + ")";
      if (this.parent) {
        return text + " -> " + __strnum(inspect(this.parent));
      } else {
        return text;
      }
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
          throw Error("Not found in parents' children");
        }
        parentChildren.splice(index, 1);
      }
    };
    _Scope_prototype.clone = function (isTop) {
      if (isTop == null) {
        isTop = false;
      } else if (typeof isTop !== "boolean") {
        throw TypeError("Expected isTop to be a Boolean, got " + __typeof(isTop));
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
      } else if (!(parent instanceof Scope)) {
        throw TypeError("Expected parent to be one of " + (__name(Scope) + " or null") + ", got " + __typeof(parent));
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      if (!parent && !this.isTop) {
        throw Error("Must either provide a parent or is-top = true");
      }
      oldParent = this.parent;
      if (parent === oldParent) {
        return;
      }
      if (parent === this) {
        throw Error("Cannot parent to self");
      }
      if (parent && parent.parent === this) {
        throw Error("Trying to become your own grandpa");
      }
      this.parent = parent;
      if (!this.isTop) {
        oldParentChildren = oldParent.children;
        index = oldParentChildren.lastIndexOf(this);
        if (index === -1) {
          throw Error("Not found in old parents' children");
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
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be one of " + (__name(IdentNode) + " or " + __name(TmpNode)) + ", got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      if (ident instanceof TmpNode) {
        this.tmps[ident.id] = { isMutable: isMutable, type: type };
      } else {
        this.variables[ident.name] = { isMutable: isMutable, type: type };
      }
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
      isTmp = ident instanceof TmpNode;
      layers = 0;
      while (current) {
        ++layers;
        if (layers > 1000) {
          throw Error("Infinite loop detected");
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
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be one of " + (__name(IdentNode) + " or " + __name(TmpNode)) + ", got " + __typeof(ident));
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return get(this, ident) != null;
    };
    _Scope_prototype.isMutable = function (ident) {
      var _ref;
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be one of " + (__name(IdentNode) + " or " + __name(TmpNode)) + ", got " + __typeof(ident));
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return ((_ref = get(this, ident)) != null ? _ref.isMutable : void 0) || false;
    };
    _Scope_prototype.type = function (ident) {
      var _ref;
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be one of " + (__name(IdentNode) + " or " + __name(TmpNode)) + ", got " + __typeof(ident));
      }
      if (this.destroyed) {
        throw ScopeDestroyedError();
      }
      return ((_ref = get(this, ident)) != null ? _ref.type : void 0) || Type.any;
    };
    return Scope;
  }());
  module.exports = Scope;
  (_ref = module.exports).ScopeDestroyedError = ScopeDestroyedError;
}.call(this));
