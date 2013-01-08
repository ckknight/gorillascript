(function () {
  "use strict";
  var __cmp, __create, __isArray, __lt, __lte, __num, __strnum, __typeof, Type;
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
  if (typeof Object.create === "function") {
    __create = Object.create;
  } else {
    __create = function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  }
  if (typeof Array.isArray === "function") {
    __isArray = Array.isArray;
  } else {
    __isArray = (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  }
  __lt = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x < y;
    }
  };
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
      throw TypeError("Expected a number, got " + typeof num);
    } else {
      return num;
    }
  };
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + type);
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
  module.exports = Type = (function () {
    var _proto, AnyType, ArrayType, ComplementType, NoneType, SimpleType, UnionType;
    function Type() {
      var _this;
      if (this instanceof Type) {
        _this = this;
      } else {
        _this = __create(_proto);
      }
      throw TypeError("Type should not be instantiated");
    }
    _proto = Type.prototype;
    Type.displayName = "Type";
    _proto.isSubsetOf = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "isSubsetOf" + "()");
    };
    _proto.isSupersetOf = function (other) {
      return other.isSubsetOf(this);
    };
    _proto.overlaps = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "overlaps" + "()");
    };
    _proto.compare = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "compare" + "()");
    };
    _proto.equals = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "equals" + "()");
    };
    _proto.union = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "union" + "()");
    };
    _proto.intersect = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "intersect" + "()");
    };
    _proto.complement = function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + "complement" + "()");
    };
    _proto.array = function () {
      var _ref;
      if ((_ref = this._array) != null) {
        return _ref;
      } else {
        return this._array = ArrayType(this);
      }
    };
    function contains(alpha, bravo) {
      var _i, _len, item;
      for (_i = 0, _len = __num(alpha.length); _i < _len; ++_i) {
        item = alpha[_i];
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
      for (; __lt(i, alphaLen) && __lt(j, bravoLen); ) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          i = __num(i) + 1;
          j = __num(j) + 1;
        } else if (__lt(cmp, 0)) {
          result.push(a);
          i = __num(i) + 1;
        } else {
          result.push(b);
          j = __num(j) + 1;
        }
      }
      for (; __lt(i, alphaLen); i = __num(i) + 1) {
        result.push(alpha[i]);
      }
      for (; __lt(j, bravoLen); j = __num(j) + 1) {
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
      for (; __lt(i, alphaLen) && __lt(j, bravoLen); ) {
        a = alpha[i];
        b = bravo[j];
        cmp = a.compare(b);
        if (cmp === 0) {
          result.push(a);
          i = __num(i) + 1;
          j = __num(j) + 1;
        } else if (__lt(cmp, 0)) {
          i = __num(i) + 1;
        } else {
          j = __num(j) + 1;
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
      for (; __lt(i, alphaLen) && __lt(j, bravoLen); ) {
        a = alpha[i];
        cmp = a.compare(bravo[j]);
        if (cmp === 0) {
          i = __num(i) + 1;
          j = __num(j) + 1;
        } else if (__lt(cmp, 0)) {
          result.push(a);
          i = __num(i) + 1;
        } else {
          j = __num(j) + 1;
        }
      }
      for (; __lt(i, alphaLen); i = __num(i) + 1) {
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
        for (; __lt(j, bravoLen); ) {
          if (alpha[i].equals(bravo[j])) {
            i = __num(i) + 1;
            if (!__lt(i, alphaLen)) {
              return true;
            }
            j = __num(j) + 1;
          } else {
            j = __num(j) + 1;
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
      for (; __lt(i, alphaLen) && __lt(j, bravoLen); ) {
        cmp = alpha[i].compare(bravo[j]);
        if (cmp === 0) {
          return true;
        } else if (__lt(cmp, 0)) {
          i = __num(i) + 1;
        } else {
          j = __num(j) + 1;
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
        return Type.none;
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
        return Type.any;
      } else {
        return ComplementType(types);
      }
    }
    SimpleType = (function (_super) {
      var _proto2, _superproto, getId;
      function SimpleType(name) {
        var _this;
        if (typeof name !== "string") {
          throw TypeError("Expected name to be a String, got " + __typeof(name));
        }
        if (this instanceof SimpleType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        _this.name = name;
        _this.id = getId();
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = SimpleType.prototype = __create(_superproto);
      _proto2.constructor = SimpleType;
      SimpleType.displayName = "SimpleType";
      getId = (function () {
        var id;
        id = -1;
        return function () {
          id = __num(id) + 1;
          return id;
        };
      }());
      _proto2.toString = function () {
        return this.name;
      };
      _proto2.equals = function (other) {
        return this === other;
      };
      _proto2.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof SimpleType) {
          return __cmp(this.name, other.name) || __cmp(this.id, other.id);
        } else {
          return __cmp("SimpleType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
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
      _proto2.intersect = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          if (this === other) {
            return this;
          } else {
            return Type.none;
          }
        } else {
          return other.intersect(this);
        }
      };
      _proto2.isSubsetOf = function (other) {
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
            for (_arr = other.types, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
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
            for (_arr = other.untypes, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              type = _arr[_i];
              if (_this === type) {
                return false;
              }
            }
            return true;
          }());
        } else {
          return other === Type.any;
        }
      };
      _proto2.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType) {
          return this === other;
        } else {
          return other.overlaps(this);
        }
      };
      _proto2.complement = function () {
        return ComplementType([this]);
      };
      return SimpleType;
    }(Type));
    Type.make = function (name) {
      return SimpleType(name);
    };
    ArrayType = (function (_super) {
      var _proto2, _superproto;
      function ArrayType(subtype) {
        var _this;
        if (!(subtype instanceof Type)) {
          throw TypeError("Expected subtype to be a Type, got " + __typeof(subtype));
        }
        if (this instanceof ArrayType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        _this.subtype = subtype;
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = ArrayType.prototype = __create(_superproto);
      _proto2.constructor = ArrayType;
      ArrayType.displayName = "ArrayType";
      _proto2.toString = function () {
        var _ref;
        if ((_ref = this._name) != null) {
          return _ref;
        } else {
          return this._name = "[" + __strnum(String(this.subtype)) + "]";
        }
      };
      _proto2.equals = function (other) {
        return other === this || other instanceof ArrayType && this.subtype.equals(other.subtype);
      };
      _proto2.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof ArrayType) {
          return this.subtype.compare(other.subtype);
        } else {
          return __cmp("ArrayType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
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
      _proto2.intersect = function (other) {
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
            return Type.none.array();
          }
        } else if (other instanceof SimpleType) {
          return Type.none;
        } else {
          return other.intersect(this);
        }
      };
      _proto2.isSubsetOf = function (other) {
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
            for (_arr = other.types, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              type = _arr[_i];
              if (_this.equals(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return (function () {
            var _arr, _i, _len, type;
            for (_arr = other.untypes, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              type = _arr[_i];
              if (!!_this.equals(type)) {
                return false;
              }
            }
            return true;
          }());
        } else {
          return other === Type.any;
        }
      };
      _proto2.overlaps = function (other) {
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
      _proto2.complement = function () {
        return ComplementType([this]);
      };
      return ArrayType;
    }(Type));
    UnionType = (function (_super) {
      var _proto2, _superproto;
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
        if (this instanceof UnionType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        if (__lte(types.length, 1)) {
          throw Error("Must provide at least 2 types to UnionType");
        }
        _this.types = types;
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = UnionType.prototype = __create(_superproto);
      _proto2.constructor = UnionType;
      UnionType.displayName = "UnionType";
      _proto2.toString = function () {
        var _ref;
        if ((_ref = this._name) != null) {
          return _ref;
        } else {
          return this._name = "(" + __strnum(this.types.join("|")) + ")";
        }
      };
      _proto2.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof UnionType) {
          return equals(this.types, other.types);
        } else {
          return false;
        }
      };
      _proto2.compare = function (other) {
        if (other === this) {
          return 0;
        } else if (other instanceof UnionType) {
          return compare(this.types, other.types);
        } else {
          return __cmp("UnionType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
        var types;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
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
      _proto2.intersect = function (other) {
        var types;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
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
      _proto2.isSubsetOf = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof UnionType) {
          return isSubsetOf(this.types, other.types);
        } else if (other instanceof ComplementType) {
          return !overlaps(this.types, other.untypes);
        } else {
          return other === Type.any;
        }
      };
      _proto2.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
          return contains(this.types, other);
        } else if (other instanceof UnionType) {
          return overlaps(this.types, other.types);
        } else {
          return other.overlaps(this);
        }
      };
      _proto2.complement = function () {
        return ComplementType(this.types);
      };
      return UnionType;
    }(Type));
    ComplementType = (function (_super) {
      var _proto2, _superproto;
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
        if (this instanceof ComplementType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        if (untypes.length === 0) {
          throw Error("Must provide at least 1 untype to ComplementType");
        }
        _this.untypes = untypes;
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = ComplementType.prototype = __create(_superproto);
      _proto2.constructor = ComplementType;
      ComplementType.displayName = "ComplementType";
      _proto2.toString = function () {
        var _ref;
        if ((_ref = this._name) != null) {
          return _ref;
        } else {
          return this._name = this.untypes.length === 1 ? "any \\ " + __strnum(String(this.untypes[0])) : "any \\ (" + __strnum(this.untypes.join("|")) + ")";
        }
      };
      _proto2.equals = function (other) {
        if (this === other) {
          return true;
        } else if (other instanceof ComplementType) {
          return equals(this.untypes, other.untypes);
        } else {
          return false;
        }
      };
      _proto2.compare = function (other) {
        if (this === other) {
          return 0;
        } else if (other instanceof ComplementType) {
          return compare(this.untypes, other.untypes);
        } else {
          return __cmp("ComplementType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
        var untypes;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
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
      _proto2.intersect = function (other) {
        var types, untypes;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
          if (contains(this.untypes, other)) {
            return Type.none;
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
      _proto2.isSubsetOf = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ComplementType) {
          return isSubsetOf(other.untypes, this.untypes);
        } else {
          return other === Type.any;
        }
      };
      _proto2.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType) {
          return !contains(this.untypes, other);
        } else if (other instanceof UnionType) {
          return !__lte(
            relativeComplement(other.types, this.untypes).length,
            0
          );
        } else if (other instanceof ComplementType) {
          return true;
        } else {
          return other.overlaps(this);
        }
      };
      _proto2.complement = function () {
        var untypes;
        untypes = this.untypes;
        if (untypes.length === 1) {
          return untypes[0];
        } else {
          return makeUnionType(untypes);
        }
      };
      return ComplementType;
    }(Type));
    Type.any = new (AnyType = (function (_super) {
      var _proto2, _superproto;
      function AnyType() {
        var _this;
        if (this instanceof AnyType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        if (Type.any) {
          throw Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = AnyType.prototype = __create(_superproto);
      _proto2.constructor = AnyType;
      AnyType.displayName = "AnyType";
      _proto2.toString = function () {
        return "any";
      };
      _proto2.equals = function (other) {
        return this === other;
      };
      _proto2.compare = function (other) {
        if (this === other) {
          return 0;
        } else {
          return __cmp("AnyType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
        return this;
      };
      _proto2.intersect = function (other) {
        return other;
      };
      _proto2.isSubsetOf = function (other) {
        return this === other;
      };
      _proto2.overlaps = function (other) {
        return true;
      };
      _proto2.complement = function () {
        return Type.none;
      };
      return AnyType;
    }(Type)))();
    Type.none = new (NoneType = (function (_super) {
      var _proto2, _superproto;
      function NoneType() {
        var _this;
        if (this instanceof NoneType) {
          _this = this;
        } else {
          _this = __create(_proto2);
        }
        if (Type.none) {
          throw Error("Cannot instantiate more than once");
        }
        return _this;
      }
      _superproto = _super.prototype;
      _proto2 = NoneType.prototype = __create(_superproto);
      _proto2.constructor = NoneType;
      NoneType.displayName = "NoneType";
      _proto2.toString = function () {
        return "none";
      };
      _proto2.equals = function (other) {
        return this === other;
      };
      _proto2.compare = function (other) {
        if (this === other) {
          return 0;
        } else {
          return __cmp("NoneType", other.constructor.name);
        }
      };
      _proto2.union = function (other) {
        return other;
      };
      _proto2.intersect = function (other) {
        return this;
      };
      _proto2.isSubsetOf = function (other) {
        return true;
      };
      _proto2.overlaps = function (other) {
        return false;
      };
      _proto2.complement = function () {
        return Type.any;
      };
      return NoneType;
    }(Type)))();
    Type["undefined"] = Type.make("undefined");
    Type["null"] = Type.make("null");
    Type.boolean = Type.make("Boolean");
    Type.string = Type.make("String");
    Type.number = Type.make("Number");
    Type.array = Type.any.array();
    Type.args = Type.make("Arguments");
    Type.object = Type.make("Object");
    Type["function"] = Type.make("Function");
    Type.regexp = Type.make("RegExp");
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
