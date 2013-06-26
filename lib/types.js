(function () {
  "use strict";
  var __cmp, __create, __isArray, __name, __owns, __slice, __throw, __toArray,
      __typeof, inspect, Type, util;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw new TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
      } else if (left < right) {
        return -1;
      } else {
        return 1;
      }
    }
  };
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
  __name = function (func) {
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
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
  util = require("util");
  if (util != null) {
    inspect = util.inspect;
  }
  module.exports = Type = (function () {
    var _Type_prototype, any, AnyType, arrayBase, ComplementType, fromJSONTypes,
        functionBase, GenericType, getId, none, NoneType, ObjectType,
        SimpleType, UnionType;
    function Type() {
      var _this;
      _this = this instanceof Type ? this : __create(_Type_prototype);
      throw new TypeError("Type should not be instantiated");
    }
    _Type_prototype = Type.prototype;
    Type.displayName = "Type";
    _Type_prototype.isSubsetOf = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".isSubsetOf()");
    };
    _Type_prototype.isSupersetOf = function (other) {
      return other.isSubsetOf(this);
    };
    _Type_prototype.overlaps = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".overlaps()");
    };
    _Type_prototype.compare = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".compare()");
    };
    _Type_prototype.equals = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".equals()");
    };
    _Type_prototype.union = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".union()");
    };
    _Type_prototype.intersect = function () {
      throw new Error("Not implemented: " + __name(this.constructor) + ".intersect()");
    };
    _Type_prototype.complement = function () {
      var _ref;
      if ((_ref = this._complement) == null) {
        return this._complement = ComplementType(this);
      } else {
        return _ref;
      }
    };
    _Type_prototype.array = function () {
      var _ref;
      if ((_ref = this._array) == null) {
        return this._array = Type.generic(arrayBase, this);
      } else {
        return _ref;
      }
    };
    _Type_prototype["function"] = function () {
      var _ref, args;
      args = __slice.call(arguments);
      if ((_ref = this._function) == null) {
        return this._function = Type.generic.apply(Type, [functionBase, this].concat(args));
      } else {
        return _ref;
      }
    };
    _Type_prototype.returnType = function () {
      return none;
    };
    function contains(alpha, bravo) {
      var _arr, _i, item;
      for (_arr = __toArray(alpha), _i = _arr.length; _i--; ) {
        item = _arr[_i];
        if (item.equals(bravo)) {
          return true;
        }
      }
      return false;
    }
    function union(alpha, bravo) {
      var a, alphaLen, b, bravoLen, cmp, i, j, result;
      if (alpha === bravo) {
        return alpha;
      }
      result = [];
      alphaLen = alpha.length;
      bravoLen = bravo.length;
      i = 0;
      j = 0;
      while (i < alphaLen && j < bravoLen) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          ++i;
          ++j;
        } else if (cmp < 0) {
          result.push(a);
          ++i;
        } else {
          result.push(b);
          ++j;
        }
      }
      for (; i < alphaLen; ++i) {
        result.push(alpha[i]);
      }
      for (; j < bravoLen; ++j) {
        result.push(bravo[j]);
      }
      switch (result.length) {
      case alphaLen: return alpha;
      case bravoLen: return bravo;
      default: return result;
      }
    }
    function intersect(alpha, bravo) {
      var a, alphaLen, b, bravoLen, cmp, i, j, result;
      if (alpha === bravo) {
        return alpha;
      }
      alphaLen = alpha.length;
      bravoLen = bravo.length;
      result = [];
      i = 0;
      j = 0;
      while (i < alphaLen && j < bravoLen) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          ++i;
          ++j;
        } else if (cmp < 0) {
          ++i;
        } else {
          ++j;
        }
      }
      switch (result.length) {
      case alphaLen: return alpha;
      case bravoLen: return bravo;
      default: return result;
      }
    }
    function relativeComplement(alpha, bravo) {
      var a, alphaLen, bravoLen, cmp, i, j, result;
      if (alpha === bravo) {
        return [];
      }
      result = [];
      alphaLen = alpha.length;
      if (alphaLen === 0) {
        return result;
      }
      bravoLen = bravo.length;
      if (bravoLen === 0) {
        return alpha;
      }
      i = 0;
      j = 0;
      while (i < alphaLen && j < bravoLen) {
        a = alpha[i];
        cmp = a.compare(bravo[j]);
        if (cmp === 0) {
          ++i;
          ++j;
        } else if (cmp < 0) {
          result.push(a);
          ++i;
        } else {
          ++j;
        }
      }
      for (; i < alphaLen; ++i) {
        result.push(alpha[i]);
      }
      if (result.length === alphaLen) {
        return alpha;
      } else {
        return result;
      }
    }
    function isSubsetOf(alpha, bravo) {
      var alphaLen, bravoLen, i, j;
      if (alpha === bravo) {
        return true;
      }
      alphaLen = alpha.length;
      if (alphaLen === 0) {
        return true;
      }
      bravoLen = bravo.length;
      if (alphaLen > bravoLen) {
        return false;
      } else {
        i = 0;
        j = 0;
        while (j < bravoLen) {
          if (alpha[i].equals(bravo[j])) {
            ++i;
            if (i >= alphaLen) {
              return true;
            }
            ++j;
          } else {
            ++j;
          }
        }
        return false;
      }
    }
    function overlaps(alpha, bravo) {
      var alphaLen, bravoLen, cmp, i, j;
      alphaLen = alpha.length;
      if (alpha === bravo && alphaLen > 0) {
        return true;
      }
      bravoLen = bravo.length;
      i = 0;
      j = 0;
      while (i < alphaLen && j < bravoLen) {
        cmp = alpha[i].compare(bravo[j]);
        if (cmp === 0) {
          return true;
        } else if (cmp < 0) {
          ++i;
        } else {
          ++j;
        }
      }
      return false;
    }
    function compare(alpha, bravo) {
      var _ref, i, len;
      if (alpha !== bravo) {
        len = alpha.length;
        if (_ref = __cmp(len, bravo.length)) {
          return _ref;
        }
        for (i = 0; i < len; ++i) {
          if (_ref = alpha[i].compare(bravo[i])) {
            return _ref;
          }
        }
      }
      return 0;
    }
    function equals(alpha, bravo) {
      var i, len;
      if (alpha !== bravo) {
        len = alpha.length;
        if (len !== bravo.length) {
          return false;
        }
        for (i = 0; i < len; ++i) {
          if (!alpha[i].equals(bravo[i])) {
            return false;
          }
        }
      }
      return true;
    }
    function typeComparer(a, b) {
      return a.compare(b);
    }
    function makeUnionType(types, needsSort) {
      switch (types.length) {
      case 0: return none;
      case 1: return types[0];
      default:
        if (needsSort) {
          types.sort(typeComparer);
        }
        return UnionType(types);
      }
    }
    fromJSONTypes = {};
    function fromJSON(x) {
      var type;
      if (typeof x === "string") {
        return fromJSON({ type: "simple", name: x });
      } else {
        type = x.type;
        if (typeof type !== "string") {
          throw new TypeError("Unspecified type");
        } else if (!__owns.call(fromJSONTypes, type)) {
          throw new TypeError("Unknown serialization type: " + type);
        } else {
          return fromJSONTypes[type](x);
        }
      }
    }
    Type.fromJSON = fromJSON;
    getId = (function () {
      var id;
      id = -1;
      return function () {
        ++id;
        return id;
      };
    }());
    SimpleType = (function (Type) {
      var _SimpleType_prototype, _Type_prototype2;
      function SimpleType(name) {
        var _this;
        _this = this instanceof SimpleType ? this : __create(_SimpleType_prototype);
        _this.name = name;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _SimpleType_prototype = SimpleType.prototype = __create(_Type_prototype2);
      _SimpleType_prototype.constructor = SimpleType;
      SimpleType.displayName = "SimpleType";
      if (typeof Type.extended === "function") {
        Type.extended(SimpleType);
      }
      _SimpleType_prototype.toString = function () {
        return this.name;
      };
      _SimpleType_prototype.equals = function (other) {
        return this === other;
      };
      _SimpleType_prototype.returnType = function () {
        if (this === functionBase) {
          return any;
        } else {
          return none;
        }
      };
      _SimpleType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof SimpleType) {
          return __cmp(this.name, other.name) || __cmp(this.id, other.id);
        } else {
          return __cmp("SimpleType", other.constructor.displayName);
        }
      };
      _SimpleType_prototype.union = function (other) {
        if (other instanceof SimpleType) {
          if (this === other) {
            return this;
          } else {
            return makeUnionType(
              [this, other],
              true
            );
          }
        } else {
          return other.union(this);
        }
      };
      _SimpleType_prototype.intersect = function (other) {
        if (other instanceof SimpleType) {
          if (this === other) {
            return this;
          } else {
            return none;
          }
        } else {
          return other.intersect(this);
        }
      };
      _SimpleType_prototype.isSubsetOf = function (other) {
        var _arr, _i, _some, type;
        if (other instanceof SimpleType) {
          return this === other;
        } else if (other instanceof UnionType) {
          _some = false;
          for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
            type = _arr[_i];
            if (this === type) {
              _some = true;
              break;
            }
          }
          return _some;
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
        } else {
          return other === any;
        }
      };
      _SimpleType_prototype.overlaps = function (other) {
        if (other instanceof SimpleType) {
          return this === other;
        } else {
          return other.overlaps(this);
        }
      };
      _SimpleType_prototype.inspect = function () {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return "Type." + k;
              }
            }
          }
          return "Type.make(" + inspect(_this.name) + ")";
        }());
      };
      _SimpleType_prototype.toAst = function (ast, pos, ident) {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return ast.Access(pos, ident, ast.Const(pos, k));
              }
            }
          }
          throw new Error("Cannot serialize custom type: " + String(_this));
        }());
      };
      _SimpleType_prototype.toJSON = function () {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return k;
              }
            }
          }
          throw new Error("Cannot serialize custom type: " + String(_this));
        }());
      };
      fromJSONTypes.simple = function (_p) {
        var name;
        name = _p.name;
        return __owns.call(Type, name) && Type[name] || __throw(new Error("Unknown type: " + String(name)));
      };
      return SimpleType;
    }(Type));
    Type.make = function (name) {
      return SimpleType(name);
    };
    GenericType = (function (Type) {
      var _GenericType_prototype, _Type_prototype2;
      function GenericType(base, args) {
        var _ref, _this;
        _this = this instanceof GenericType ? this : __create(_GenericType_prototype);
        _this.base = base;
        if (args.length === 0) {
          throw new Error("Must provide at least one generic type argument");
        }
        _this.id = getId();
        _this.args = args.slice();
        if (_this.base === arrayBase && args.length === 1) {
          if ((_ref = args[0]._array) != null) {
            return _ref;
          }
          args[0]._array = _this;
        } else if (_this.base === functionBase && args.length === 1) {
          if ((_ref = args[0]._function) != null) {
            return _ref;
          }
          args[0]._function = _this;
        }
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _GenericType_prototype = GenericType.prototype = __create(_Type_prototype2);
      _GenericType_prototype.constructor = GenericType;
      GenericType.displayName = "GenericType";
      if (typeof Type.extended === "function") {
        Type.extended(GenericType);
      }
      function become(alpha, bravo) {
        if (alpha.id > bravo.id) {
          return become(bravo, alpha);
        }
        bravo.base = alpha.base;
        bravo.args = alpha.args;
        bravo.id = alpha.id;
      }
      _GenericType_prototype.toString = function () {
        var _arr, _len, _ref, arg, i, sb;
        if ((_ref = this._name) == null) {
          if (this.base === arrayBase && this.args.length === 1) {
            if (this.args[0] === any) {
              return this._name = "[]";
            } else {
              return this._name = "[" + String(this.args[0]) + "]";
            }
          } else if (this.base === functionBase && this.args.length === 1) {
            if (this.args[0] === any) {
              return this._name = "->";
            } else {
              return this._name = "-> " + String(this.args[0]);
            }
          } else {
            sb = [];
            sb.push(String(this.base));
            sb.push("<");
            for (_arr = __toArray(this.args), i = 0, _len = _arr.length; i < _len; ++i) {
              arg = _arr[i];
              if (i > 0) {
                sb.push(",");
                if (arg !== any && this.args[i - 1] !== any) {
                  sb.push(" ");
                }
              }
              if (arg !== any) {
                sb.push(String(arg));
              }
            }
            sb.push(">");
            return this._name = sb.join("");
          }
        } else {
          return _ref;
        }
      };
      _GenericType_prototype.returnType = function () {
        if (this.base === functionBase) {
          return this.args[0];
        } else {
          return none;
        }
      };
      _GenericType_prototype.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof GenericType) {
          if (this.id === other.id) {
            return true;
          } else if (this.base === other.base && equals(this.args, other.args)) {
            become(this, other);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      _GenericType_prototype.compare = function (other) {
        var _ref, cmp;
        if (other === this) {
          return 0;
        } else if (other instanceof GenericType) {
          if (this.id === other.id) {
            return 0;
          } else {
            if (_ref = this.base.compare(other.base)) {
              return _ref;
            }
            cmp = compare(this.args, other.args);
            if (!cmp) {
              become(this, other);
            }
            return cmp;
          }
        } else {
          return __cmp("GenericType", other.constructor.displayName);
        }
      };
      _GenericType_prototype.union = function (other) {
        if (other instanceof GenericType) {
          if (this.equals(other)) {
            return this;
          } else if (this.isSubsetOf(other)) {
            return other;
          } else if (other.isSubsetOf(this)) {
            return this;
          } else {
            return makeUnionType(
              [this, other],
              true
            );
          }
        } else if (other instanceof SimpleType) {
          return makeUnionType(
            [this, other],
            true
          );
        } else {
          return other.union(this);
        }
      };
      _GenericType_prototype.intersect = function (other) {
        var arg, args, i, isOther, isThis, len, newArg, newArgs, otherArg,
            otherArgs;
        if (other instanceof GenericType) {
          if (this.base !== other.base) {
            return none;
          } else if (this.equals(other)) {
            return this;
          } else {
            args = this.args;
            otherArgs = other.args;
            len = args.length;
            if (len !== otherArgs.length) {
              return none;
            } else {
              isThis = true;
              isOther = true;
              newArgs = [];
              for (i = 0; i < len; ++i) {
                arg = args[i];
                otherArg = otherArgs[i];
                newArg = args[i].intersect(otherArgs[i]);
                if (isThis && arg !== newArg) {
                  isThis = false;
                }
                if (isOther && otherArg !== newArg) {
                  isOther = false;
                }
                newArgs.push(newArg);
              }
              if (isThis) {
                return this;
              } else if (isOther) {
                return other;
              } else {
                return GenericType(this.base, newArgs);
              }
            }
          }
        } else if (other instanceof SimpleType) {
          return none;
        } else {
          return other.intersect(this);
        }
      };
      _GenericType_prototype.isSubsetOf = function (other) {
        var _arr, _i, _some, args, i, len, otherArgs, type;
        if (other instanceof GenericType) {
          if (this.base !== other.base) {
            return false;
          } else if (this.equals(other)) {
            return true;
          } else {
            args = this.args;
            otherArgs = other.args;
            len = args.length;
            if (len !== otherArgs.length) {
              return false;
            } else {
              for (i = 0; i < len; ++i) {
                if (!args[i].isSubsetOf(otherArgs[i])) {
                  return false;
                }
              }
              return true;
            }
          }
        } else if (other instanceof UnionType) {
          _some = false;
          for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
            type = _arr[_i];
            if (this.isSubsetOf(type)) {
              _some = true;
              break;
            }
          }
          return _some;
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
        } else {
          return other === any;
        }
      };
      _GenericType_prototype.overlaps = function (other) {
        if (other instanceof GenericType) {
          if (this.base !== other.base) {
            return false;
          } else {
            return this.args.length === other.args.length;
          }
        } else if (other instanceof SimpleType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _GenericType_prototype.inspect = function (depth) {
        var _arr, _i, _len, arg, sb;
        if (depth != null) {
          --depth;
        }
        sb = ["Type.generic("];
        sb.push(inspect(this.base, null, depth));
        for (_arr = __toArray(this.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          arg = _arr[_i];
          sb.push(", ");
          sb.push(inspect(arg, null, depth));
        }
        sb.push(")");
        return sb.join("");
      };
      _GenericType_prototype.toAst = function (ast, pos, ident) {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return ast.Access(pos, ident, ast.Const(pos, k));
              }
            }
          }
          return ast.Call(
            pos,
            ast.Access(pos, ident, ast.Const(pos, "generic")),
            [_this.base.toAst(ast, pos, ident)].concat((function () {
              var _arr, _arr2, _i, _len, arg;
              _arr = [];
              for (_arr2 = __toArray(_this.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                arg = _arr2[_i];
                _arr.push(arg.toAst(ast, pos, ident));
              }
              return _arr;
            }()))
          );
        }());
      };
      _GenericType_prototype.toJSON = function () {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return k;
              }
            }
          }
          return { type: "generic", base: _this.base, args: _this.args };
        }());
      };
      fromJSONTypes.generic = function (_p) {
        var args, base, baseType;
        base = _p.base;
        args = _p.args;
        baseType = Type.fromJSON(base);
        if (baseType === arrayBase && args.length === 1) {
          return Type.fromJSON(args[0]).array();
        } else if (baseType === functionBase && args.length === 1) {
          return Type.fromJSON(args[0])["function"]();
        } else {
          return GenericType(baseType, (function () {
            var _arr, _arr2, _i, _len, arg;
            _arr = [];
            for (_arr2 = __toArray(args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              arg = _arr2[_i];
              _arr.push(Type.fromJSON(arg));
            }
            return _arr;
          }()));
        }
      };
      return GenericType;
    }(Type));
    Type.generic = function (base) {
      var args;
      args = __slice.call(arguments, 1);
      return GenericType(
        typeof base === "string" ? Type.make(base) : base,
        args
      );
    };
    ObjectType = (function (Type) {
      var _ObjectType_prototype, _Type_prototype2;
      function ObjectType(data) {
        var _this, k, pairs, v;
        _this = this instanceof ObjectType ? this : __create(_ObjectType_prototype);
        pairs = [];
        for (k in data) {
          if (__owns.call(data, k)) {
            v = data[k];
            if (!(v instanceof Type)) {
              throw new TypeError("Expected data[" + JSON.stringify(k) + "] to be a Type, got " + __typeof(v));
            }
            if (v !== any) {
              pairs.push([k, v]);
            }
          }
        }
        pairs.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        if (pairs.length === 0 && Type.object != null) {
          return Type.object;
        }
        _this.pairs = pairs;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ObjectType_prototype = ObjectType.prototype = __create(_Type_prototype2);
      _ObjectType_prototype.constructor = ObjectType;
      ObjectType.displayName = "ObjectType";
      if (typeof Type.extended === "function") {
        Type.extended(ObjectType);
      }
      _ObjectType_prototype.toString = function () {
        var _ref, _this;
        _this = this;
        if ((_ref = this._name) == null) {
          return this._name = "{" + (function () {
            var _arr, _arr2, _i, _len, _ref, k, v;
            _arr = [];
            for (_arr2 = __toArray(_this.pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              _ref = _arr2[_i];
              k = _ref[0];
              v = _ref[1];
              _ref = null;
              _arr.push(k + ": " + String(v));
            }
            return _arr;
          }()).join(", ") + "}";
        } else {
          return _ref;
        }
      };
      function become(alpha, bravo) {
        if (alpha.id > bravo.id) {
          return become(bravo, alpha);
        }
        bravo.pairs = alpha.pairs;
        bravo.id = alpha.id;
      }
      _ObjectType_prototype.equals = function (other) {
        var _arr, _len, i, otherPair, otherPairs, pair, pairs;
        if (other === this) {
          return true;
        } else if (other instanceof ObjectType) {
          pairs = this.pairs;
          otherPairs = other.pairs;
          if (pairs === otherPairs) {
            return true;
          } else if (pairs.length !== otherPairs.length) {
            return false;
          } else {
            for (_arr = __toArray(pairs), i = 0, _len = _arr.length; i < _len; ++i) {
              pair = _arr[i];
              otherPair = otherPairs[i];
              if (pair[0] !== otherPair[0] || !pair[1].equals(otherPair[1])) {
                return false;
              }
            }
            become(this, other);
            return true;
          }
        } else {
          return false;
        }
      };
      _ObjectType_prototype.compare = function (other) {
        var _arr, _len, cmp, i, otherPair, otherPairs, pair, pairs;
        if (this === other) {
          return 0;
        } else if (other instanceof ObjectType) {
          pairs = this.pairs;
          otherPairs = other.pairs;
          if (pairs === otherPairs) {
            return 0;
          } else {
            cmp = __cmp(pairs.length, otherPairs.length);
            if (cmp) {
              return cmp;
            } else {
              for (_arr = __toArray(pairs), i = 0, _len = _arr.length; i < _len; ++i) {
                pair = _arr[i];
                otherPair = otherPairs[i];
                cmp = __cmp(pair[0], otherPair[0]) || pair[1].compare(otherPair[1]);
                if (cmp) {
                  return cmp;
                }
              }
              become(this, other);
              return 0;
            }
          }
        } else {
          return __cmp("ObjectType", other.constructor.displayName);
        }
      };
      _ObjectType_prototype.union = function (other) {
        if (other instanceof ObjectType) {
          if (this.equals(other)) {
            return this;
          } else if (this.isSubsetOf(other)) {
            return other;
          } else if (other.isSubsetOf(this)) {
            return this;
          } else {
            return makeUnionType(
              [this, other],
              true
            );
          }
        } else if (other instanceof SimpleType || other instanceof GenericType) {
          return makeUnionType(
            [this, other],
            true
          );
        } else {
          return other.union(this);
        }
      };
      _ObjectType_prototype.intersect = function (other) {
        var _arr, _i, _len, _ref, k, merged, v;
        if (other instanceof ObjectType) {
          if (this.equals(other)) {
            return this;
          } else if (this.isSubsetOf(other)) {
            return this;
          } else if (other.isSubsetOf(this)) {
            return other;
          } else {
            merged = {};
            for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              _ref = _arr[_i];
              k = _ref[0];
              v = _ref[1];
              _ref = null;
              merged[k] = v;
            }
            for (_arr = __toArray(other.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              _ref = _arr[_i];
              k = _ref[0];
              v = _ref[1];
              _ref = null;
              if (__owns.call(merged, k)) {
                merged[k] = merged[k].intersect(v);
              } else {
                merged[k] = v;
              }
            }
            return ObjectType(merged);
          }
        } else if (other instanceof SimpleType || other instanceof GenericType) {
          return none;
        } else {
          return other.intersect(this);
        }
      };
      _ObjectType_prototype.isSubsetOf = function (other) {
        var _arr, _i, _len, _ref, _some, i, len, otherK, otherPairs, otherV,
            pair, pairs, type;
        if (other instanceof ObjectType) {
          if (this === other || other === Type.object) {
            return true;
          } else if (this === Type.object) {
            return false;
          } else {
            pairs = this.pairs;
            otherPairs = other.pairs;
            if (pairs === other.pairs) {
              return true;
            } else {
              i = 0;
              len = pairs.length;
              for (_arr = __toArray(otherPairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
                _ref = _arr[_i];
                otherK = _ref[0];
                otherV = _ref[1];
                _ref = null;
                for (; i <= len; ++i) {
                  if (i === len) {
                    return false;
                  }
                  pair = pairs[i];
                  if (pair[0] === otherK) {
                    if (pair[1].isSubsetOf(otherV)) {
                      ++i;
                      break;
                    } else {
                      return false;
                    }
                  } else if (pair[0] > otherK) {
                    return false;
                  }
                }
              }
              if (i === len) {
                become(this, other);
              }
              return true;
            }
          }
        } else if (other instanceof UnionType) {
          _some = false;
          for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
            type = _arr[_i];
            if (this.isSubsetOf(type)) {
              _some = true;
              break;
            }
          }
          return _some;
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
        } else {
          return other === any;
        }
      };
      _ObjectType_prototype.overlaps = function (other) {
        if (other instanceof ObjectType) {
          return true;
        } else if (other instanceof SimpleType || other instanceof GenericType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _ObjectType_prototype.value = function (key) {
        var _arr, _i, pair, pairKey;
        for (_arr = __toArray(this.pairs), _i = _arr.length; _i--; ) {
          pair = _arr[_i];
          pairKey = pair[0];
          if (pairKey === key) {
            return pair[1];
          } else if (pairKey < key) {
            return Type.any;
          }
        }
        return Type.any;
      };
      _ObjectType_prototype.inspect = function (depth) {
        var _arr, _i, _len, _ref, k, obj, v;
        if (this === Type.object) {
          return "Type.object";
        } else {
          obj = {};
          for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            _ref = _arr[_i];
            k = _ref[0];
            v = _ref[1];
            _ref = null;
            obj[k] = v;
          }
          return "Type.makeObject(" + inspect(obj, null, depth != null ? depth - 1 : null) + ")";
        }
      };
      _ObjectType_prototype.toAst = function (ast, pos, ident) {
        var _this;
        _this = this;
        if (this.pairs.length === 0) {
          return ast.Access(pos, ident, ast.Const(pos, "object"));
        } else {
          return ast.Call(
            pos,
            ast.Access(pos, ident, ast.Const(pos, "makeObject")),
            [
              ast.Obj(pos, (function () {
                var _arr, _arr2, _i, _len, _ref, k, v;
                _arr = [];
                for (_arr2 = __toArray(_this.pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                  _ref = _arr2[_i];
                  k = _ref[0];
                  v = _ref[1];
                  _ref = null;
                  _arr.push(ast.Obj.Pair(pos, k, v.toAst(ast, pos, ident)));
                }
                return _arr;
              }()))
            ]
          );
        }
      };
      _ObjectType_prototype.toJSON = function () {
        var _arr, _i, _len, _ref, k, pairs, v;
        if (this.pairs.length === 0) {
          return "object";
        } else {
          pairs = {};
          for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            _ref = _arr[_i];
            k = _ref[0];
            v = _ref[1];
            _ref = null;
            pairs[k] = v;
          }
          return { type: "object", pairs: pairs };
        }
      };
      fromJSONTypes.object = function (_p) {
        var deserializedPairs, k, pairs, v;
        pairs = _p.pairs;
        deserializedPairs = {};
        for (k in pairs) {
          if (__owns.call(pairs, k)) {
            v = pairs[k];
            deserializedPairs[k] = Type.fromJSON(v);
          }
        }
        return ObjectType(deserializedPairs);
      };
      return ObjectType;
    }(Type));
    Type.makeObject = function (data) {
      return ObjectType(data);
    };
    UnionType = (function (Type) {
      var _Type_prototype2, _UnionType_prototype;
      function UnionType(types) {
        var _this;
        _this = this instanceof UnionType ? this : __create(_UnionType_prototype);
        _this.types = types;
        if (types.length <= 1) {
          throw new Error("Must provide at least 2 types to UnionType");
        }
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _UnionType_prototype = UnionType.prototype = __create(_Type_prototype2);
      _UnionType_prototype.constructor = UnionType;
      UnionType.displayName = "UnionType";
      if (typeof Type.extended === "function") {
        Type.extended(UnionType);
      }
      _UnionType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "(" + this.types.join("|") + ")";
        } else {
          return _ref;
        }
      };
      _UnionType_prototype.returnType = function () {
        var _arr, _i, _len, current, type;
        current = none;
        for (_arr = __toArray(this.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          type = _arr[_i];
          current = current.union(type.returnType());
        }
        return current;
      };
      function become(alpha, bravo) {
        if (alpha.id > bravo.id) {
          return become(bravo, alpha);
        }
        bravo.types = alpha.types;
        return bravo.id = alpha.id;
      }
      _UnionType_prototype.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof UnionType) {
          if (this.id === other.id) {
            return true;
          } else if (this.types === other.types || equals(this.types, other.types)) {
            become(this, other);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      _UnionType_prototype.compare = function (other) {
        var cmp;
        if (other === this) {
          return 0;
        } else if (other instanceof UnionType) {
          if (this.id === other.id) {
            return 0;
          } else if (this.types === other.types) {
            become(this, other);
            return 0;
          } else {
            cmp = compare(this.types, other.types);
            if (cmp === 0) {
              become(this, other);
            }
            return cmp;
          }
        } else {
          return __cmp("UnionType", other.constructor.displayName);
        }
      };
      _UnionType_prototype.union = function (other) {
        var _arr, _i, _len, newTypes, type, types;
        if (other instanceof SimpleType || other instanceof GenericType) {
          types = union(this.types, [other]);
          if (types === this.types) {
            return this;
          } else {
            return makeUnionType(types);
          }
        } else if (other instanceof ObjectType) {
          if (other === Type.object) {
            newTypes = [other];
            for (_arr = __toArray(this.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (type instanceof ObjectType) {
                if (type === Type.object) {
                  return this;
                }
              } else {
                newTypes.push(type);
              }
            }
            return makeUnionType(newTypes);
          } else {
            newTypes = [other];
            for (_arr = __toArray(this.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (type instanceof ObjectType) {
                if (other.isSubsetOf(type)) {
                  return this;
                } else if (!type.isSubsetOf(other)) {
                  newTypes.push(type);
                }
              } else {
                newTypes.push(type);
              }
            }
            return makeUnionType(newTypes);
          }
        } else if (other instanceof UnionType) {
          types = union(this.types, other.types);
          if (types === this.types) {
            return this;
          } else if (types === other.types) {
            return other;
          } else {
            return makeUnionType(types);
          }
        } else {
          return other.union(this);
        }
      };
      _UnionType_prototype.intersect = function (other) {
        var types;
        if (other instanceof SimpleType || other instanceof GenericType || other instanceof ObjectType) {
          return makeUnionType(intersect(this.types, [other]));
        } else if (other instanceof UnionType) {
          types = intersect(this.types, other.types);
          if (types === this.types) {
            return this;
          } else if (types === other.types) {
            return other;
          } else {
            return makeUnionType(types);
          }
        } else {
          return other.intersect(this);
        }
      };
      _UnionType_prototype.isSubsetOf = function (other) {
        if (other instanceof UnionType) {
          return isSubsetOf(this.types, other.types);
        } else if (other instanceof ComplementType) {
          return !this.overlaps(other.untype);
        } else {
          return other === any;
        }
      };
      _UnionType_prototype.overlaps = function (other) {
        var _arr, _i, _some, type;
        if (other instanceof SimpleType) {
          return contains(this.types, other);
        } else if (other instanceof GenericType || other instanceof ObjectType) {
          _some = false;
          for (_arr = __toArray(this.types), _i = _arr.length; _i--; ) {
            type = _arr[_i];
            if (type.overlaps(other)) {
              _some = true;
              break;
            }
          }
          return _some;
        } else if (other instanceof UnionType) {
          return overlaps(this.types, other.types);
        } else {
          return other.overlaps(this);
        }
      };
      _UnionType_prototype.inspect = function (depth) {
        var _this;
        _this = this;
        return "(" + (function () {
          var _arr, _arr2, _i, _len, type;
          _arr = [];
          for (_arr2 = __toArray(_this.types), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            type = _arr2[_i];
            _arr.push(inspect(type, null, depth != null ? depth - 1 : null));
          }
          return _arr;
        }()).join(").union(") + ")";
      };
      _UnionType_prototype.toAst = function (ast, pos, ident) {
        var _this;
        _this = this;
        return (function () {
          var _arr, _else, _i, _len, current, k, type, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return ast.Access(pos, ident, ast.Const(pos, k));
              }
            }
          }
          current = _this.types[0].toAst(ast, pos, ident);
          for (_arr = __toArray(_this.types), _i = 1, _len = _arr.length; _i < _len; ++_i) {
            type = _arr[_i];
            current = ast.Call(
              pos,
              ast.Access(pos, current, ast.Const(pos, "union")),
              [type.toAst(ast, pos, ident)]
            );
          }
          return current;
        }());
      };
      _UnionType_prototype.toJSON = function () {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return k;
              }
            }
          }
          return { type: "union", types: _this.types };
        }());
      };
      fromJSONTypes.union = function (_p) {
        var _arr, _i, current, type, types;
        types = _p.types;
        current = Type.none;
        for (_arr = __toArray(types), _i = _arr.length; _i--; ) {
          type = _arr[_i];
          current = current.union(Type.fromJSON(type));
        }
        return current;
      };
      return UnionType;
    }(Type));
    ComplementType = (function (Type) {
      var _ComplementType_prototype, _Type_prototype2;
      function ComplementType(untype) {
        var _this;
        _this = this instanceof ComplementType ? this : __create(_ComplementType_prototype);
        _this.untype = untype;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ComplementType_prototype = ComplementType.prototype = __create(_Type_prototype2);
      _ComplementType_prototype.constructor = ComplementType;
      ComplementType.displayName = "ComplementType";
      if (typeof Type.extended === "function") {
        Type.extended(ComplementType);
      }
      _ComplementType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "any \\ " + String(this.untype);
        } else {
          return _ref;
        }
      };
      _ComplementType_prototype.returnType = function () {
        return any;
      };
      function become(alpha, bravo) {
        if (alpha.id > bravo.id) {
          return become(bravo, alpha);
        }
        bravo.id = alpha.id;
        return bravo.untype = alpha.untype;
      }
      _ComplementType_prototype.equals = function (other) {
        if (this === other) {
          return true;
        } else if (other instanceof ComplementType) {
          if (this.id === other.id) {
            return true;
          } else if (this.untype.equals(other.untype)) {
            become(this, other);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      _ComplementType_prototype.compare = function (other) {
        var cmp;
        if (this === other) {
          return 0;
        } else if (other instanceof ComplementType) {
          if (this.id === other.id) {
            return 0;
          } else {
            cmp = this.untype.compare(other.untype);
            if (cmp === 0) {
              become(this, other);
            }
            return cmp;
          }
        } else {
          return __cmp("ComplementType", other.constructor.displayName);
        }
      };
      function getUntypes(untype) {
        if (untype instanceof UnionType) {
          return untype.types;
        } else {
          return [untype];
        }
      }
      _ComplementType_prototype.union = function (other) {
        var myUntypes, untypes;
        if (other instanceof SimpleType || other instanceof GenericType || other instanceof ObjectType) {
          myUntypes = getUntypes(this.untype);
          untypes = relativeComplement(myUntypes, [other]);
          if (untypes === myUntypes) {
            return this;
          } else {
            return makeUnionType(untypes).complement();
          }
        } else if (other instanceof UnionType) {
          myUntypes = getUntypes(this.untype);
          untypes = relativeComplement(myUntypes, other.types);
          if (untypes === myUntypes) {
            return this;
          } else {
            return makeUnionType(untypes).complement();
          }
        } else if (other instanceof ComplementType) {
          return this.untype.intersect(other.untype).complement();
        } else {
          return other.union(this);
        }
      };
      _ComplementType_prototype.intersect = function (other) {
        var types;
        if (other instanceof SimpleType || other instanceof GenericType || other instanceof ObjectType) {
          if (contains(getUntypes(this.untype), other)) {
            return none;
          } else {
            return other;
          }
        } else if (other instanceof UnionType) {
          types = relativeComplement(other.types, getUntypes(this.untype));
          if (types === other.types) {
            return other;
          } else {
            return makeUnionType(types);
          }
        } else if (other instanceof ComplementType) {
          return this.untype.union(other.untype).complement();
        } else {
          return other.intersect(this);
        }
      };
      _ComplementType_prototype.isSubsetOf = function (other) {
        if (other instanceof ComplementType) {
          return other.untype.isSubsetOf(this.untype);
        } else {
          return other === any;
        }
      };
      _ComplementType_prototype.overlaps = function (other) {
        var _arr, _every, _i, untype;
        if (other instanceof SimpleType || other instanceof GenericType) {
          return !this.untype.overlaps(other);
        } else if (other instanceof ObjectType) {
          _every = true;
          for (_arr = getUntypes(this.untype), _i = _arr.length; _i--; ) {
            untype = _arr[_i];
            if (untype instanceof ObjectType && other.isSubsetOf(untype)) {
              _every = false;
              break;
            }
          }
          return _every;
        } else if (other instanceof UnionType) {
          return relativeComplement(other.types, getUntypes(this.untype)).length > 0;
        } else if (other instanceof ComplementType) {
          return true;
        } else {
          return other.overlaps(this);
        }
      };
      _ComplementType_prototype.complement = function () {
        return this.untype;
      };
      _ComplementType_prototype.inspect = function (depth) {
        return this.untype.inspect(depth) + ".complement()";
      };
      _ComplementType_prototype.toAst = function (ast, pos, ident) {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return ast.Access(pos, ident, ast.Const(pos, k));
              }
            }
          }
          return ast.Call(
            pos,
            ast.Access(
              pos,
              _this.complement().toAst(ast, pos, ident),
              ast.Const(pos, "complement")
            ),
            []
          );
        }());
      };
      _ComplementType_prototype.toJSON = function () {
        var _this;
        _this = this;
        return (function () {
          var _else, k, v;
          _else = true;
          for (k in Type) {
            if (__owns.call(Type, k)) {
              _else = false;
              v = Type[k];
              if (v === _this) {
                return k;
              }
            }
          }
          return { type: "complement", untype: _this.complement() };
        }());
      };
      fromJSONTypes.complement = function (_p) {
        var untype;
        untype = _p.untype;
        return Type.fromJSON(untype).complement();
      };
      return ComplementType;
    }(Type));
    any = Type.any = new (AnyType = (function (Type) {
      var _AnyType_prototype, _Type_prototype2;
      function AnyType() {
        var _this;
        _this = this instanceof AnyType ? this : __create(_AnyType_prototype);
        if (any) {
          throw new Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _AnyType_prototype = AnyType.prototype = __create(_Type_prototype2);
      _AnyType_prototype.constructor = AnyType;
      AnyType.displayName = "AnyType";
      if (typeof Type.extended === "function") {
        Type.extended(AnyType);
      }
      _AnyType_prototype.toString = function () {
        return "any";
      };
      _AnyType_prototype.returnType = function () {
        return any;
      };
      _AnyType_prototype.equals = function (other) {
        return this === other;
      };
      _AnyType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else {
          return __cmp("AnyType", other.constructor.displayName);
        }
      };
      _AnyType_prototype.union = function (other) {
        return this;
      };
      _AnyType_prototype.intersect = function (other) {
        return other;
      };
      _AnyType_prototype.isSubsetOf = function (other) {
        return this === other;
      };
      _AnyType_prototype.overlaps = function (other) {
        return true;
      };
      _AnyType_prototype.complement = function () {
        return none;
      };
      _AnyType_prototype.inspect = function () {
        return "Type.any";
      };
      _AnyType_prototype.toAst = function (ast, pos, ident) {
        return ast.Access(pos, ident, ast.Const(pos, "any"));
      };
      _AnyType_prototype.toJSON = function () {
        return "any";
      };
      fromJSONTypes.any = function () {
        return any;
      };
      return AnyType;
    }(Type)))();
    none = Type.none = new (NoneType = (function (Type) {
      var _NoneType_prototype, _Type_prototype2;
      function NoneType() {
        var _this;
        _this = this instanceof NoneType ? this : __create(_NoneType_prototype);
        if (none) {
          throw new Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _NoneType_prototype = NoneType.prototype = __create(_Type_prototype2);
      _NoneType_prototype.constructor = NoneType;
      NoneType.displayName = "NoneType";
      if (typeof Type.extended === "function") {
        Type.extended(NoneType);
      }
      _NoneType_prototype.toString = function () {
        return "none";
      };
      _NoneType_prototype.equals = function (other) {
        return this === other;
      };
      _NoneType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else {
          return __cmp("NoneType", other.constructor.displayName);
        }
      };
      _NoneType_prototype.union = function (other) {
        return other;
      };
      _NoneType_prototype.intersect = function (other) {
        return this;
      };
      _NoneType_prototype.isSubsetOf = function (other) {
        return true;
      };
      _NoneType_prototype.overlaps = function (other) {
        return false;
      };
      _NoneType_prototype.complement = function () {
        return any;
      };
      _NoneType_prototype.inspect = function () {
        return "Type.none";
      };
      _NoneType_prototype.toAst = function (ast, pos, ident) {
        return ast.Access(pos, ident, ast.Const(pos, "none"));
      };
      _NoneType_prototype.toJSON = function () {
        return "none";
      };
      fromJSONTypes.none = function () {
        return none;
      };
      return NoneType;
    }(Type)))();
    arrayBase = Type.arrayBase = Type.make("Array");
    functionBase = Type.functionBase = Type.make("Function");
    Type["undefined"] = Type.make("undefined");
    Type["null"] = Type.make("null");
    Type.boolean = Type.make("Boolean");
    Type.string = Type.make("String");
    Type.stringArray = Type.string.array();
    Type.number = Type.make("Number");
    Type.numberArray = Type.number.array();
    Type.array = any.array();
    Type.args = Type.make("Arguments");
    Type.object = Type.makeObject({});
    Type["function"] = any["function"]();
    Type.regexp = Type.make("RegExp");
    Type.date = Type.make("Date");
    Type.error = Type.make("Error");
    Type.promise = Type.makeObject({ then: Type.any["function"](Type["function"], Type["function"]) });
    Type.generatorResult = Type.makeObject({ done: Type.boolean, value: any });
    Type.generator = Type.generatorResult["function"]();
    Type.numeric = Type.number.union(Type["undefined"]).union(Type["null"]).union(Type.boolean);
    Type.stringOrNumber = Type.string.union(Type.number);
    Type.arrayLike = Type.array.union(Type.args);
    Type.undefinedOrNull = Type["undefined"].union(Type["null"]);
    Type.notUndefinedOrNull = Type.undefinedOrNull.complement();
    Type.primitive = Type.undefinedOrNull.union(Type.boolean).union(Type.string).union(Type.number);
    Type.nonPrimitive = Type.primitive.complement();
    Type.alwaysFalsy = Type.undefinedOrNull;
    Type.potentiallyTruthy = Type.alwaysFalsy.complement();
    Type.potentiallyFalsy = Type.alwaysFalsy.union(Type.number).union(Type.string).union(Type.boolean);
    Type.alwaysTruthy = Type.potentiallyFalsy.complement();
    return Type;
  }());
}.call(this));
