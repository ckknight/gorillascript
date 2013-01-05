"use strict";
var __cmp, __create, __isArray, __lt, __lte, __num, __strnum, __typeof;
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
    function F() {
      
    }
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
module.exports = (function () {
  var ArrayType, ComplementType, SimpleType, UnionType;
  function Type() {
    throw TypeError("Type should not be instantiated");
  }
  function notImplemented(name) {
    return function () {
      throw Error("Not implemented: " + __strnum(this.constructor.name) + "." + __strnum(name));
    };
  }
  Type.prototype.isSubsetOf = notImplemented("isSubsetOf");
  Type.prototype.isSupersetOf = function (other) {
    return other.isSubsetOf(this);
  };
  Type.prototype.overlaps = notImplemented("overlaps");
  Type.prototype.compare = notImplemented("compare");
  Type.prototype.equals = notImplemented("equals");
  Type.prototype.union = notImplemented("union");
  Type.prototype.intersect = notImplemented("intersect");
  Type.prototype.complement = notImplemented("complement");
  Type.prototype.array = function () {
    var _ref;
    return (_ref = this._array) != null ? _ref : (this._array = new ArrayType(this));
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
    var a, alphaLen, b, bravoLen, cmp, i, j, result, resultLen;
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
    resultLen = result.length;
    if (resultLen === alphaLen) {
      return alpha;
    } else if (resultLen === bravoLen) {
      return bravo;
    } else {
      return result;
    }
  }
  function intersect(alpha, bravo) {
    var a, alphaLen, b, bravoLen, cmp, i, j, result, resultLen;
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
    resultLen = result.length;
    if (resultLen === alphaLen) {
      return alpha;
    } else if (resultLen === bravoLen) {
      return bravo;
    } else {
      return result;
    }
  }
  function relativeComplement(alpha, bravo) {
    var a, alphaLen, bravoLen, cmp, i, j, result;
    result = [];
    alphaLen = alpha.length;
    bravoLen = bravo.length;
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
    var len;
    len = types.length;
    if (len === 0) {
      return Type.none;
    } else if (len === 1) {
      return types[0];
    } else {
      if (needsSort) {
        types.sort(typeComparer);
      }
      return new UnionType(types);
    }
  }
  function makeComplementType(types) {
    if (types.length === 0) {
      return Type.any;
    } else {
      return new ComplementType(types);
    }
  }
  SimpleType = (function () {
    var getId;
    getId = (function () {
      var id;
      id = -1;
      return function () {
        id = __num(id) + 1;
        return id;
      };
    }());
    function SimpleType(name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      this.name = name;
      if (!(this instanceof SimpleType)) {
        throw TypeError("Must be instantiated with new");
      }
      this.id = getId();
    }
    SimpleType.prototype = __create(Type.prototype);
    SimpleType.prototype.constructor = SimpleType;
    SimpleType.prototype.toString = function () {
      return this.name;
    };
    SimpleType.prototype.equals = function (other) {
      return this === other;
    };
    SimpleType.prototype.compare = function (other) {
      if (this === other) {
        return 0;
      } else if (other instanceof SimpleType) {
        return __cmp(this.name, other.name) || __cmp(this.id, other.id);
      } else {
        return __cmp("SimpleType", other.constructor.name);
      }
    };
    SimpleType.prototype.union = function (other) {
      if (!(other instanceof Type)) {
        throw TypeError("Expected other to be a Type, got " + __typeof(other));
      } else if (other instanceof SimpleType) {
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
    SimpleType.prototype.intersect = function (other) {
      if (!(other instanceof Type)) {
        throw TypeError("Expected other to be a Type, got " + __typeof(other));
      } else if (other instanceof SimpleType) {
        if (this === other) {
          return this;
        } else {
          return Type.none;
        }
      } else {
        return other.intersect(this);
      }
    };
    SimpleType.prototype.isSubsetOf = function (other) {
      var _this;
      _this = this;
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
    SimpleType.prototype.overlaps = function (other) {
      if (other instanceof SimpleType) {
        return this === other;
      } else {
        return other.overlaps(this);
      }
    };
    SimpleType.prototype.complement = function () {
      return new ComplementType([this]);
    };
    return SimpleType;
  }());
  Type.make = function (name) {
    return new SimpleType(name);
  };
  ArrayType = (function () {
    function ArrayType(subtype) {
      if (!(subtype instanceof Type)) {
        throw TypeError("Expected subtype to be a Type, got " + __typeof(subtype));
      }
      this.subtype = subtype;
      if (!(this instanceof ArrayType)) {
        throw TypeError("Must be instantiated with new");
      }
    }
    ArrayType.prototype = __create(Type.prototype);
    ArrayType.prototype.constructor = ArrayType;
    ArrayType.prototype.toString = function () {
      var _ref;
      return (_ref = this._name) != null ? _ref : (this._name = "[" + __strnum(this.subtype.toString()) + "]");
    };
    ArrayType.prototype.equals = function (other) {
      return other === this || other instanceof ArrayType && this.subtype.equals(other.subtype);
    };
    ArrayType.prototype.compare = function (other) {
      if (this === other) {
        return 0;
      } else if (other instanceof ArrayType) {
        return this.subtype.compare(other.subtype);
      } else {
        return __cmp("ArrayType", other.constructor.name);
      }
    };
    ArrayType.prototype.union = function (other) {
      if (!(other instanceof Type)) {
        throw TypeError("Expected other to be a Type, got " + __typeof(other));
      } else if (other instanceof ArrayType) {
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
    ArrayType.prototype.intersect = function (other) {
      if (!(other instanceof Type)) {
        throw TypeError("Expected other to be a Type, got " + __typeof(other));
      } else if (other instanceof ArrayType) {
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
    ArrayType.prototype.isSubsetOf = function (other) {
      var _this;
      _this = this;
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
    ArrayType.prototype.overlaps = function (other) {
      if (other instanceof ArrayType) {
        return this.subtype.overlaps(other.subtype);
      } else if (other instanceof SimpleType) {
        return false;
      } else {
        return other.overlaps(this);
      }
    };
    ArrayType.prototype.complement = function () {
      return new ComplementType([this]);
    };
    return ArrayType;
  }());
  UnionType = (function () {
    function UnionType(types) {
      var _i, _len;
      if (!__isArray(types)) {
        throw TypeError("Expected types to be an Array, got " + __typeof(types));
      } else {
        for (_i = 0, _len = types.length; _i < _len; ++_i) {
          if (!(types[_i] instanceof Type)) {
            throw TypeError("Expected types[" + _i + "] to be a Type, got " + __typeof(types[_i]));
          }
        }
      }
      this.types = types;
      if (!(this instanceof UnionType)) {
        throw TypeError("Must be instantiated with new");
      }
      if (__lte(types.length, 1)) {
        throw Error("Must provide at least 2 types to UnionType");
      }
    }
    UnionType.prototype = __create(Type.prototype);
    UnionType.prototype.constructor = UnionType;
    UnionType.prototype.toString = function () {
      var _ref;
      return (_ref = this._name) != null ? _ref : (this._name = "(" + __strnum(this.types.join("|")) + ")");
    };
    UnionType.prototype.equals = function (other) {
      if (other === this) {
        return true;
      } else if (other instanceof UnionType) {
        return equals(this.types, other.types);
      } else {
        return false;
      }
    };
    UnionType.prototype.compare = function (other) {
      if (other === this) {
        return 0;
      } else if (other instanceof UnionType) {
        return compare(this.types, other.types);
      } else {
        return __cmp("UnionType", other.constructor.name);
      }
    };
    UnionType.prototype.union = function (other) {
      var types;
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
    UnionType.prototype.intersect = function (other) {
      var types;
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
    UnionType.prototype.isSubsetOf = function (other) {
      if (other instanceof UnionType) {
        return isSubsetOf(this.types, other.types);
      } else if (other instanceof ComplementType) {
        return !overlaps(this.types, other.untypes);
      } else {
        return other === Type.any;
      }
    };
    UnionType.prototype.overlaps = function (other) {
      if (other instanceof SimpleType || other instanceof ArrayType) {
        return contains(this.types, other);
      } else if (other instanceof UnionType) {
        return overlaps(this.types, other.types);
      } else {
        return other.overlaps(this);
      }
    };
    UnionType.prototype.complement = function () {
      return new ComplementType(this.types);
    };
    return UnionType;
  }());
  ComplementType = (function () {
    function ComplementType(untypes) {
      var _i, _len;
      if (!__isArray(untypes)) {
        throw TypeError("Expected untypes to be an Array, got " + __typeof(untypes));
      } else {
        for (_i = 0, _len = untypes.length; _i < _len; ++_i) {
          if (!(untypes[_i] instanceof Type)) {
            throw TypeError("Expected untypes[" + _i + "] to be a Type, got " + __typeof(untypes[_i]));
          }
        }
      }
      this.untypes = untypes;
      if (!(this instanceof ComplementType)) {
        throw TypeError("Must be instantiated with new");
      } else if (untypes.length === 0) {
        throw Error("Must provide at least 1 untype to ComplementType");
      }
    }
    ComplementType.prototype = __create(Type.prototype);
    ComplementType.prototype.constructor = ComplementType;
    ComplementType.prototype.toString = function () {
      var _ref;
      return (_ref = this._name) != null ? _ref
        : (this._name = this.untypes.length === 1 ? "any \\ " + __strnum(this.untypes[0].toString()) : "any \\ (" + __strnum(this.untypes.join("|")) + ")");
    };
    ComplementType.prototype.equals = function (other) {
      if (this === other) {
        return true;
      } else if (other instanceof ComplementType) {
        return equals(this.untypes, other.untypes);
      } else {
        return false;
      }
    };
    ComplementType.prototype.compare = function (other) {
      if (this === other) {
        return 0;
      } else if (other instanceof ComplementType) {
        return compare(this.untypes, other.untypes);
      } else {
        return __cmp("ComplementType", other.constructor.name);
      }
    };
    ComplementType.prototype.union = function (other) {
      var untypes;
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
    ComplementType.prototype.intersect = function (other) {
      var types, untypes;
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
    ComplementType.prototype.isSubsetOf = function (other) {
      if (other instanceof ComplementType) {
        return isSubsetOf(other.untypes, this.untypes);
      } else {
        return other === Type.any;
      }
    };
    ComplementType.prototype.overlaps = function (other) {
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
    ComplementType.prototype.complement = function (other) {
      var untypes;
      untypes = this.untypes;
      if (untypes.length === 1) {
        return untypes[0];
      } else {
        return makeUnionType(untypes);
      }
    };
    return ComplementType;
  }());
  Type.any = (function () {
    function AnyType() {
      if (!(this instanceof AnyType)) {
        throw TypeError("Must be instantiated with new");
      }
      if (Type.any) {
        throw Error("Cannot instantiate more than once");
      }
    }
    AnyType.prototype = __create(Type.prototype);
    AnyType.prototype.constructor = AnyType;
    AnyType.prototype.toString = function () {
      return "any";
    };
    AnyType.prototype.equals = function (other) {
      return this === other;
    };
    AnyType.prototype.compare = function (other) {
      if (this === other) {
        return 0;
      } else {
        return __cmp("AnyType", other.constructor.name);
      }
    };
    AnyType.prototype.union = function (other) {
      return this;
    };
    AnyType.prototype.intersect = function (other) {
      return other;
    };
    AnyType.prototype.isSubsetOf = function (other) {
      return this === other;
    };
    AnyType.prototype.overlaps = function (other) {
      return true;
    };
    AnyType.prototype.complement = function () {
      return Type.none;
    };
    return new AnyType();
  }());
  Type.none = (function () {
    function NoneType() {
      if (!(this instanceof NoneType)) {
        throw TypeError("Must be instantiated with new");
      }
      if (Type.none) {
        throw Error("Cannot instantiate more than once");
      }
    }
    NoneType.prototype = __create(Type.prototype);
    NoneType.prototype.constructor = NoneType;
    NoneType.prototype.toString = function () {
      return "none";
    };
    NoneType.prototype.equals = function (other) {
      return this === other;
    };
    NoneType.prototype.compare = function (other) {
      if (this === other) {
        return 0;
      } else {
        return __cmp("NoneType", other.constructor.name);
      }
    };
    NoneType.prototype.union = function (other) {
      return other;
    };
    NoneType.prototype.intersect = function (other) {
      return this;
    };
    NoneType.prototype.isSubsetOf = function (other) {
      return true;
    };
    NoneType.prototype.overlaps = function (other) {
      return false;
    };
    NoneType.prototype.complement = function () {
      return Type.any;
    };
    return new NoneType();
  }());
  Type["undefined"] = new SimpleType("undefined");
  Type["null"] = new SimpleType("null");
  Type.boolean = new SimpleType("Boolean");
  Type.string = new SimpleType("String");
  Type.number = new SimpleType("Number");
  Type.array = Type.any.array();
  Type.args = new SimpleType("Arguments");
  Type.object = new SimpleType("Object");
  Type["function"] = new SimpleType("Function");
  Type.regexp = new SimpleType("RegExp");
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
