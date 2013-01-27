(function () {
  "use strict";
  var __cmp, __create, __isArray, __lte, __num, __slice, __strnum, __toArray, __typeof, inspect, Type;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
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
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
      return __slice(x);
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
  inspect = require("util").inspect;
  module.exports = Type = (function () {
    var _Type_prototype, any, AnyType, ArrayType, ComplementType, FunctionType, none, NoneType, SimpleType, UnionType;
    function Type() {
      var _this;
      _this = this instanceof Type ? this : __create(_Type_prototype);
      throw TypeError("Type should not be instantiated");
    }
    _Type_prototype = Type.prototype;
    Type.displayName = "Type";
    _Type_prototype.isSubsetOf = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".isSubsetOf()");
    };
    _Type_prototype.isSupersetOf = function (other) {
      return other.isSubsetOf(this);
    };
    _Type_prototype.overlaps = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".overlaps()");
    };
    _Type_prototype.compare = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".compare()");
    };
    _Type_prototype.equals = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".equals()");
    };
    _Type_prototype.union = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".union()");
    };
    _Type_prototype.intersect = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".intersect()");
    };
    _Type_prototype.complement = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + ".complement()");
    };
    _Type_prototype.array = function () {
      var _ref;
      if ((_ref = this._array) == null) {
        return this._array = ArrayType(this);
      } else {
        return _ref;
      }
    };
    _Type_prototype["function"] = function () {
      var _ref;
      if ((_ref = this._function) == null) {
        return this._function = FunctionType(this);
      } else {
        return _ref;
      }
    };
    function contains(alpha, bravo) {
      var _arr, _i, _len, item;
      for (_arr = __toArray(alpha), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
      for (; i < __num(alphaLen) && j < __num(bravoLen); ) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          ++i;
          ++j;
        } else if (__num(cmp) < 0) {
          result.push(a);
          ++i;
        } else {
          result.push(b);
          ++j;
        }
      }
      for (; i < __num(alphaLen); ++i) {
        result.push(alpha[i]);
      }
      for (; j < __num(bravoLen); ++j) {
        result.push(bravo[j]);
      }
      switch (result.length) {
      case alphaLen:
        return alpha;
      case bravoLen:
        return bravo;
      default:
        return result;
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
      for (; i < __num(alphaLen) && j < __num(bravoLen); ) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          ++i;
          ++j;
        } else if (__num(cmp) < 0) {
          ++i;
        } else {
          ++j;
        }
      }
      switch (result.length) {
      case alphaLen:
        return alpha;
      case bravoLen:
        return bravo;
      default:
        return result;
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
      for (; i < __num(alphaLen) && j < __num(bravoLen); ) {
        a = alpha[i];
        cmp = a.compare(bravo[j]);
        if (cmp === 0) {
          ++i;
          ++j;
        } else if (__num(cmp) < 0) {
          result.push(a);
          ++i;
        } else {
          ++j;
        }
      }
      for (; i < __num(alphaLen); ++i) {
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
      alphaLen = alpha.length;
      if (alphaLen === 0) {
        return true;
      }
      bravoLen = bravo.length;
      if (!__lte(alphaLen, bravoLen)) {
        return false;
      } else {
        i = 0;
        j = 0;
        for (; j < __num(bravoLen); ) {
          if (alpha[i].equals(bravo[j])) {
            ++i;
            if (i >= __num(alphaLen)) {
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
      bravoLen = bravo.length;
      i = 0;
      j = 0;
      for (; i < __num(alphaLen) && j < __num(bravoLen); ) {
        cmp = alpha[i].compare(bravo[j]);
        if (cmp === 0) {
          return true;
        } else if (__num(cmp) < 0) {
          ++i;
        } else {
          ++j;
        }
      }
      return false;
    }
    function compare(alpha, bravo) {
      var c, i, len;
      if (alpha === bravo) {
        return 0;
      } else {
        len = alpha.length;
        c = __cmp(len, bravo.length);
        if (c) {
          return c;
        } else {
          for (i = 0, __num(len); i < len; ++i) {
            c = alpha[i].compare(bravo[i]);
            if (c) {
              return c;
            }
          }
          return 0;
        }
      }
    }
    function equals(alpha, bravo) {
      var i, len;
      if (alpha === bravo) {
        return true;
      } else {
        len = alpha.length;
        if (len !== bravo.length) {
          return false;
        } else {
          for (i = 0, __num(len); i < len; ++i) {
            if (!alpha[i].equals(bravo[i])) {
              return false;
            }
          }
          return true;
        }
      }
    }
    function typeComparer(a, b) {
      return a.compare(b);
    }
    function makeUnionType(types, needsSort) {
      switch (types.length) {
      case 0:
        return none;
      case 1:
        return types[0];
      default:
        if (needsSort) {
          types.sort(typeComparer);
        }
        return UnionType(types);
      }
    }
    function makeComplementType(types) {
      if (types.length === 0) {
        return any;
      } else {
        return ComplementType(types);
      }
    }
    SimpleType = (function (Type) {
      var _SimpleType_prototype, _Type_prototype2, getId;
      function SimpleType(name) {
        var _this;
        if (typeof name !== "string") {
          throw TypeError("Expected name to be a String, got " + __typeof(name));
        }
        _this = this instanceof SimpleType ? this : __create(_SimpleType_prototype);
        _this.name = name;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _SimpleType_prototype = SimpleType.prototype = __create(_Type_prototype2);
      _SimpleType_prototype.constructor = SimpleType;
      SimpleType.displayName = "SimpleType";
      getId = (function () {
        var id;
        id = -1;
        return function () {
          ++id;
          return id;
        };
      }());
      _SimpleType_prototype.toString = function () {
        return this.name;
      };
      _SimpleType_prototype.equals = function (other) {
        return this === other;
      };
      _SimpleType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof SimpleType) {
          return __cmp(this.name, other.name) || __cmp(this.id, other.id);
        } else {
          return __cmp("SimpleType", other.constructor.name);
        }
      };
      _SimpleType_prototype.union = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
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
        var _this;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          return this === other;
        } else if (other instanceof UnionType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this === type) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.untypes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this === type) {
                return false;
              }
            }
            return true;
          }());
        } else {
          return other === any;
        }
      };
      _SimpleType_prototype.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          return this === other;
        } else {
          return other.overlaps(this);
        }
      };
      _SimpleType_prototype.complement = function () {
        return ComplementType([this]);
      };
      _SimpleType_prototype.inspect = function () {
        return "SimpleType(" + __strnum(inspect(this.name)) + ")";
      };
      return SimpleType;
    }(Type));
    Type.make = function (name) {
      return SimpleType(name);
    };
    ArrayType = (function (Type) {
      var _ArrayType_prototype, _Type_prototype2;
      function ArrayType(subtype) {
        var _this;
        if (!(subtype instanceof Type)) {
          throw TypeError("Expected subtype to be a Type, got " + __typeof(subtype));
        }
        _this = this instanceof ArrayType ? this : __create(_ArrayType_prototype);
        _this.subtype = subtype;
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ArrayType_prototype = ArrayType.prototype = __create(_Type_prototype2);
      _ArrayType_prototype.constructor = ArrayType;
      ArrayType.displayName = "ArrayType";
      _ArrayType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "[" + String(this.subtype) + "]";
        } else {
          return _ref;
        }
      };
      _ArrayType_prototype.equals = function (other) {
        return other === this || other instanceof ArrayType && this.subtype.equals(other.subtype);
      };
      _ArrayType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof ArrayType) {
          return this.subtype.compare(other.subtype);
        } else {
          return __cmp("ArrayType", other.constructor.name);
        }
      };
      _ArrayType_prototype.union = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ArrayType) {
          if (this.equals(other)) {
            return this;
          } else if (this.subtype.isSubsetOf(other.subtype)) {
            return other;
          } else if (other.subtype.isSubsetOf(this.subtype)) {
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
      _ArrayType_prototype.intersect = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ArrayType) {
          if (this.equals(other)) {
            return this;
          } else if (this.subtype.isSubsetOf(other.subtype)) {
            return this;
          } else if (other.subtype.isSubsetOf(this.subtype)) {
            return other;
          } else {
            return none.array();
          }
        } else if (other instanceof SimpleType) {
          return none;
        } else {
          return other.intersect(this);
        }
      };
      _ArrayType_prototype.isSubsetOf = function (other) {
        var _this;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ArrayType) {
          return this.subtype.isSubsetOf(other.subtype);
        } else if (other instanceof UnionType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.untypes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return false;
              }
            }
            return true;
          }());
        } else {
          return other === any;
        }
      };
      _ArrayType_prototype.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ArrayType) {
          return this.subtype.overlaps(other.subtype);
        } else if (other instanceof SimpleType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _ArrayType_prototype.complement = function () {
        return ComplementType([this]);
      };
      _ArrayType_prototype.inspect = function (depth) {
        return __strnum(inspect(this.subtype, null, depth)) + ".array()";
      };
      return ArrayType;
    }(Type));
    FunctionType = (function (Type) {
      var _FunctionType_prototype, _Type_prototype2;
      function FunctionType(returnType) {
        var _this;
        if (!(returnType instanceof Type)) {
          throw TypeError("Expected returnType to be a Type, got " + __typeof(returnType));
        }
        _this = this instanceof FunctionType ? this : __create(_FunctionType_prototype);
        _this.returnType = returnType;
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _FunctionType_prototype = FunctionType.prototype = __create(_Type_prototype2);
      _FunctionType_prototype.constructor = FunctionType;
      FunctionType.displayName = "FunctionType";
      _FunctionType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "-> " + String(this.returnType);
        } else {
          return _ref;
        }
      };
      _FunctionType_prototype.equals = function (other) {
        return other === this || other instanceof FunctionType && this.returnType.equals(other.returnType);
      };
      _FunctionType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof FunctionType) {
          return this.returnType.compare(other.returnType);
        } else {
          return __cmp("FunctionType", other.constructor.name);
        }
      };
      _FunctionType_prototype.union = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof FunctionType) {
          if (this.equals(other)) {
            return this;
          } else if (this.returnType.isSubsetOf(other.returnType)) {
            return other;
          } else if (other.returnType.isSubsetOf(this.returnType)) {
            return this;
          } else {
            return makeUnionType(
              [this, other],
              true
            );
          }
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
          return makeUnionType(
            [this, other],
            true
          );
        } else {
          return other.union(this);
        }
      };
      _FunctionType_prototype.intersect = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof FunctionType) {
          if (this.equals(other)) {
            return this;
          } else if (this.returnType.isSubsetOf(other.returnType)) {
            return this;
          } else if (other.returnType.isSubsetOf(this.returnType)) {
            return other;
          } else {
            return none["function"]();
          }
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
          return none;
        } else {
          return other.intersect(this);
        }
      };
      _FunctionType_prototype.isSubsetOf = function (other) {
        var _this;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof FunctionType) {
          return this.returnType.isSubsetOf(other.returnType);
        } else if (other instanceof UnionType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(other.untypes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return false;
              }
            }
            return true;
          }());
        } else {
          return other === any;
        }
      };
      _FunctionType_prototype.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof FunctionType) {
          return this.returnType.overlaps(other.returnType);
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _FunctionType_prototype.complement = function () {
        return ComplementType([this]);
      };
      _FunctionType_prototype.inspect = function (depth) {
        return __strnum(inspect(this.subtype, null, depth)) + ".array()";
      };
      return FunctionType;
    }(Type));
    UnionType = (function (Type) {
      var _Type_prototype2, _UnionType_prototype;
      function UnionType(types) {
        var _i, _len, _this;
        if (!__isArray(types)) {
          throw TypeError("Expected types to be an Array, got " + __typeof(types));
        } else {
          for (_i = 0, _len = types.length; _i < _len; ++_i) {
            if (!(types[_i] instanceof Type)) {
              throw TypeError("Expected types[" + _i + "] to be a Type, got " + __typeof(types[_i]));
            }
          }
        }
        _this = this instanceof UnionType ? this : __create(_UnionType_prototype);
        if (types.length <= 1) {
          throw Error("Must provide at least 2 types to UnionType");
        }
        _this.types = types;
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _UnionType_prototype = UnionType.prototype = __create(_Type_prototype2);
      _UnionType_prototype.constructor = UnionType;
      UnionType.displayName = "UnionType";
      _UnionType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "(" + __strnum(this.types.join("|")) + ")";
        } else {
          return _ref;
        }
      };
      _UnionType_prototype.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof UnionType) {
          return equals(this.types, other.types);
        } else {
          return false;
        }
      };
      _UnionType_prototype.compare = function (other) {
        if (other === this) {
          return 0;
        } else if (other instanceof UnionType) {
          return compare(this.types, other.types);
        } else {
          return __cmp("UnionType", other.constructor.name);
        }
      };
      _UnionType_prototype.union = function (other) {
        var types;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof FunctionType) {
          types = union(this.types, [other]);
          if (types === this.types) {
            return this;
          } else {
            return makeUnionType(types);
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof FunctionType) {
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof UnionType) {
          return isSubsetOf(this.types, other.types);
        } else if (other instanceof ComplementType) {
          return !overlaps(this.types, other.untypes);
        } else {
          return other === any;
        }
      };
      _UnionType_prototype.overlaps = function (other) {
        var _this;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          return contains(this.types, other);
        } else if (other instanceof ArrayType || other instanceof FunctionType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = __toArray(_this.types), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              type = _arr[_i];
              if (other.overlaps(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof UnionType) {
          return overlaps(this.types, other.types);
        } else {
          return other.overlaps(this);
        }
      };
      _UnionType_prototype.complement = function () {
        return ComplementType(this.types);
      };
      _UnionType_prototype.inspect = function (depth) {
        return "UnionType(" + __strnum(inspect(this.types, null, depth != null ? __num(depth) - 1 : null)) + ")";
      };
      return UnionType;
    }(Type));
    ComplementType = (function (Type) {
      var _ComplementType_prototype, _Type_prototype2;
      function ComplementType(untypes) {
        var _i, _len, _this;
        if (!__isArray(untypes)) {
          throw TypeError("Expected untypes to be an Array, got " + __typeof(untypes));
        } else {
          for (_i = 0, _len = untypes.length; _i < _len; ++_i) {
            if (!(untypes[_i] instanceof Type)) {
              throw TypeError("Expected untypes[" + _i + "] to be a Type, got " + __typeof(untypes[_i]));
            }
          }
        }
        _this = this instanceof ComplementType ? this : __create(_ComplementType_prototype);
        if (untypes.length === 0) {
          throw Error("Must provide at least 1 untype to ComplementType");
        }
        _this.untypes = untypes;
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ComplementType_prototype = ComplementType.prototype = __create(_Type_prototype2);
      _ComplementType_prototype.constructor = ComplementType;
      ComplementType.displayName = "ComplementType";
      _ComplementType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = this.untypes.length === 1 ? "any \\ " + String(this.untypes[0]) : "any \\ (" + __strnum(this.untypes.join("|")) + ")";
        } else {
          return _ref;
        }
      };
      _ComplementType_prototype.equals = function (other) {
        if (this === other) {
          return true;
        } else if (other instanceof ComplementType) {
          return equals(this.untypes, other.untypes);
        } else {
          return false;
        }
      };
      _ComplementType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof ComplementType) {
          return compare(this.untypes, other.untypes);
        } else {
          return __cmp("ComplementType", other.constructor.name);
        }
      };
      _ComplementType_prototype.union = function (other) {
        var untypes;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof FunctionType) {
          untypes = relativeComplement(this.untypes, [other]);
          if (untypes === this.untypes) {
            return this;
          } else {
            return makeComplementType(untypes);
          }
        } else if (other instanceof UnionType) {
          untypes = relativeComplement(this.untypes, other.types);
          if (untypes === this.untypes) {
            return this;
          } else {
            return makeComplementType(untypes);
          }
        } else if (other instanceof ComplementType) {
          untypes = intersect(this.untypes, other.untypes);
          if (untypes === this.untypes) {
            return this;
          } else if (untypes === other.untypes) {
            return other;
          } else {
            return makeComplementType(untypes);
          }
        } else {
          return other.union(this);
        }
      };
      _ComplementType_prototype.intersect = function (other) {
        var types, untypes;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof FunctionType) {
          if (contains(this.untypes, other)) {
            return none;
          } else {
            return other;
          }
        } else if (other instanceof UnionType) {
          types = relativeComplement(other.types, this.untypes);
          if (types === other.types) {
            return other;
          } else {
            return makeUnionType(types);
          }
        } else if (other instanceof ComplementType) {
          untypes = union(this.untypes, other.untypes);
          if (untypes === this.untypes) {
            return this;
          } else if (untypes === other.untypes) {
            return other;
          } else {
            return makeComplementType(untypes);
          }
        } else {
          return other.intersect(this);
        }
      };
      _ComplementType_prototype.isSubsetOf = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ComplementType) {
          return isSubsetOf(other.untypes, this.untypes);
        } else {
          return other === any;
        }
      };
      _ComplementType_prototype.overlaps = function (other) {
        var _this;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          return !contains(this.untypes, other);
        } else if (other instanceof ArrayType || other instanceof FunctionType) {
          return (function () {
            var _arr, _i, _len, untype;
            for (_arr = __toArray(_this.untypes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              untype = _arr[_i];
              if (other.overlaps(untype)) {
                return false;
              }
            }
            return true;
          }());
        } else if (other instanceof UnionType) {
          return __num(relativeComplement(other.types, this.untypes).length) > 0;
        } else if (other instanceof ComplementType) {
          return true;
        } else {
          return other.overlaps(this);
        }
      };
      _ComplementType_prototype.complement = function () {
        var untypes;
        untypes = this.untypes;
        if (untypes.length === 1) {
          return untypes[0];
        } else {
          return makeUnionType(untypes);
        }
      };
      _ComplementType_prototype.inspect = function (depth) {
        return "ComplementType(" + __strnum(inspect(this.types, null, depth != null ? __num(depth) - 1 : null)) + ")";
      };
      return ComplementType;
    }(Type));
    any = Type.any = new (AnyType = (function (Type) {
      var _AnyType_prototype, _Type_prototype2;
      function AnyType() {
        var _this;
        _this = this instanceof AnyType ? this : __create(_AnyType_prototype);
        if (any) {
          throw Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _AnyType_prototype = AnyType.prototype = __create(_Type_prototype2);
      _AnyType_prototype.constructor = AnyType;
      AnyType.displayName = "AnyType";
      _AnyType_prototype.toString = function () {
        return "any";
      };
      _AnyType_prototype.equals = function (other) {
        return this === other;
      };
      _AnyType_prototype.compare = function (other) {
        if (this === other) {
          return 0;
        } else {
          return __cmp("AnyType", other.constructor.name);
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
        return "AnyType()";
      };
      return AnyType;
    }(Type)))();
    none = Type.none = new (NoneType = (function (Type) {
      var _NoneType_prototype, _Type_prototype2;
      function NoneType() {
        var _this;
        _this = this instanceof NoneType ? this : __create(_NoneType_prototype);
        if (none) {
          throw Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _NoneType_prototype = NoneType.prototype = __create(_Type_prototype2);
      _NoneType_prototype.constructor = NoneType;
      NoneType.displayName = "NoneType";
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
          return __cmp("NoneType", other.constructor.name);
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
        return "NoneType()";
      };
      return NoneType;
    }(Type)))();
    Type["undefined"] = Type.make("undefined");
    Type["null"] = Type.make("null");
    Type.boolean = Type.make("Boolean");
    Type.string = Type.make("String");
    Type.stringArray = Type.string.array();
    Type.number = Type.make("Number");
    Type.numberArray = Type.number.array();
    Type.array = any.array();
    Type.args = Type.make("Arguments");
    Type.object = Type.make("Object");
    Type["function"] = any["function"]();
    Type.regexp = Type.make("RegExp");
    Type.date = Type.make("Date");
    Type.error = Type.make("Error");
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
