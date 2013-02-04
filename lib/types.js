(function () {
  "use strict";
  var __cmp, __create, __isArray, __lt, __lte, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, inspect, Type;
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
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __str = function (str) {
    if (typeof str !== "string") {
      throw TypeError("Expected a string, got " + __typeof(str));
    } else {
      return str;
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
  inspect = require("util").inspect;
  module.exports = Type = (function () {
    var _Type_prototype, any, AnyType, ArrayType, ComplementType, fromJSONTypes, FunctionType, getId, none, NoneType, ObjectType, SimpleType, UnionType;
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
      while (i < __num(alphaLen) && j < __num(bravoLen)) {
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
      while (i < __num(alphaLen) && j < __num(bravoLen)) {
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
      while (i < __num(alphaLen) && j < __num(bravoLen)) {
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
      if (alpha === bravo) {
        return true;
      }
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
        while (j < __num(bravoLen)) {
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
      if (alpha === bravo && __num(alphaLen) > 0) {
        return true;
      }
      bravoLen = bravo.length;
      i = 0;
      j = 0;
      while (i < __num(alphaLen) && j < __num(bravoLen)) {
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
    Type.fromJSON = function (x) {
      var type;
      if (!x || typeof x !== "object") {
        throw TypeError("Expected an Object, got " + typeof x);
      }
      type = x.type;
      if (typeof type !== "string") {
        throw TypeError("Unspecified type");
      } else if (!__owns.call(fromJSONTypes, type)) {
        throw TypeError("Unknown serialization type: " + __strnum(type));
      } else {
        return fromJSONTypes[type](x);
      }
    };
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
        if (typeof name !== "string") {
          throw TypeError("Expected name to be a String, got " + __typeof(name));
        }
        _this.name = name;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _SimpleType_prototype = SimpleType.prototype = __create(_Type_prototype2);
      _SimpleType_prototype.constructor = SimpleType;
      SimpleType.displayName = "SimpleType";
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
            var _arr, _i, type;
            for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
              type = _arr[_i];
              if (_this === type) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
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
        var _ref;
        if ((_ref = this._complement) == null) {
          return this._complement = ComplementType(this);
        } else {
          return _ref;
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
          return "Type.make(" + __strnum(inspect(_this.name)) + ")";
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
                return { type: "simple", name: k };
              }
            }
          }
          throw Error("Cannot serialize custom type: " + String(_this));
        }());
      };
      fromJSONTypes.simple = function (_p) {
        var name;
        name = _p.name;
        return __owns.call(Type, name) && Type[name] || (function () {
          throw Error("Unknown type: " + String(name));
        }());
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
        _this = this instanceof ArrayType ? this : __create(_ArrayType_prototype);
        if (!(subtype instanceof Type)) {
          throw TypeError("Expected subtype to be a Type, got " + __typeof(subtype));
        }
        _this.subtype = subtype;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ArrayType_prototype = ArrayType.prototype = __create(_Type_prototype2);
      _ArrayType_prototype.constructor = ArrayType;
      ArrayType.displayName = "ArrayType";
      function become(alpha, bravo) {
        if (__lt(alpha.id, bravo.id)) {
          bravo.subtype = alpha.subtype;
          bravo.id = alpha.id;
        } else {
          alpha.subtype = bravo.subtype;
          alpha.id = bravo.id;
        }
      }
      _ArrayType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = this.subtype === any ? "[]" : "[" + String(this.subtype) + "]";
        } else {
          return _ref;
        }
      };
      _ArrayType_prototype.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof ArrayType) {
          if (this.id === other.id) {
            return true;
          } else if (this.subtype.equals(other.subtype)) {
            become(this, other);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      _ArrayType_prototype.compare = function (other) {
        if (this.equals(other)) {
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
            var _arr, _i, type;
            for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
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
        var _ref;
        if ((_ref = this._complement) == null) {
          return this._complement = ComplementType(this);
        } else {
          return _ref;
        }
      };
      _ArrayType_prototype.inspect = function (depth) {
        if (this.subtype === any) {
          return "Type.array";
        } else {
          return __strnum(inspect(this.subtype, null, depth)) + ".array()";
        }
      };
      _ArrayType_prototype.toJSON = function () {
        return { type: "array", subtype: this.subtype };
      };
      fromJSONTypes.array = function (_p) {
        var subtype;
        subtype = _p.subtype;
        return Type.fromJSON(subtype).array();
      };
      return ArrayType;
    }(Type));
    ObjectType = (function (Type) {
      var _ObjectType_prototype, _Type_prototype2;
      function ObjectType(data) {
        var _this, k, pairs, v;
        _this = this instanceof ObjectType ? this : __create(_ObjectType_prototype);
        if (typeof data !== "object" || data instanceof RegExp) {
          throw TypeError("Expected an object, got " + __typeof(data));
        }
        pairs = [];
        for (k in data) {
          if (__owns.call(data, k)) {
            v = data[k];
            if (!(v instanceof Type)) {
              throw TypeError("Expected data[" + __str(JSON.stringify(k)) + "] to be a Type, got " + __typeof(v));
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
      _ObjectType_prototype.toString = function () {
        var _ref, _this;
        _this = this;
        if ((_ref = this._name) == null) {
          return this._name = "{" + __strnum((function () {
            var _arr, _arr2, _i, _len, _ref, k, v;
            for (_arr = [], _arr2 = __toArray(_this.pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              k = (_ref = _arr2[_i])[0];
              v = _ref[1];
              _arr.push(__strnum(k) + ": " + String(v));
            }
            return _arr;
          }()).join(", ")) + "}";
        } else {
          return _ref;
        }
      };
      function become(alpha, bravo) {
        if (__lt(alpha.id, bravo.id)) {
          bravo.pairs = alpha.pairs;
          bravo.id = alpha.id;
        } else {
          alpha.pairs = bravo.pairs;
          alpha.id = bravo.id;
        }
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
          return __cmp("ObjectType", other.constructor.name);
        }
      };
      _ObjectType_prototype.union = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
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
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
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
              k = (_ref = _arr[_i])[0];
              v = _ref[1];
              merged[k] = v;
            }
            for (_arr = __toArray(other.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
              k = (_ref = _arr[_i])[0];
              v = _ref[1];
              if (__owns.call(merged, k)) {
                merged[k] = merged[k].intersect(v);
              } else {
                merged[k] = v;
              }
            }
            return ObjectType(merged);
          }
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
          return none;
        } else {
          return other.intersect(this);
        }
      };
      _ObjectType_prototype.isSubsetOf = function (other) {
        var _arr, _i, _len, _ref, _this, i, len, otherK, otherPairs, otherV, pair, pairs;
        _this = this;
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
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
                otherK = (_ref = _arr[_i])[0];
                otherV = _ref[1];
                for (; i <= __num(len); ++i) {
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
                  } else if (!__lte(pair[0], otherK)) {
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
          return (function () {
            var _arr, _i, type;
            for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
        } else {
          return other === any;
        }
      };
      _ObjectType_prototype.overlaps = function (other) {
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ObjectType) {
          return true;
        } else if (other instanceof SimpleType || other instanceof ArrayType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _ObjectType_prototype.complement = function () {
        var _ref;
        if ((_ref = this._complement) == null) {
          return this._complement = ComplementType(this);
        } else {
          return _ref;
        }
      };
      _ObjectType_prototype.value = function (key) {
        var _arr, _i, pair, pairKey;
        if (typeof key !== "string") {
          throw TypeError("Expected key to be a String, got " + __typeof(key));
        }
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
            k = (_ref = _arr[_i])[0];
            v = _ref[1];
            obj[k] = v;
          }
          return "Type.makeObject(" + __strnum(inspect(obj, null, depth != null ? __num(depth) - 1 : null)) + ")";
        }
      };
      _ObjectType_prototype.toJSON = function () {
        var _arr, _i, _len, _ref, k, pairs, v;
        pairs = {};
        for (_arr = __toArray(this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          k = (_ref = _arr[_i])[0];
          v = _ref[1];
          pairs[k] = v;
        }
        return { type: "object", pairs: pairs };
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
    FunctionType = (function (Type) {
      var _FunctionType_prototype, _Type_prototype2;
      function FunctionType(returnType) {
        var _this;
        _this = this instanceof FunctionType ? this : __create(_FunctionType_prototype);
        if (!(returnType instanceof Type)) {
          throw TypeError("Expected returnType to be a Type, got " + __typeof(returnType));
        }
        _this.returnType = returnType;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _FunctionType_prototype = FunctionType.prototype = __create(_Type_prototype2);
      _FunctionType_prototype.constructor = FunctionType;
      FunctionType.displayName = "FunctionType";
      _FunctionType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = this.returnType === any ? "->" : "-> " + String(this.returnType);
        } else {
          return _ref;
        }
      };
      function become(alpha, bravo) {
        if (__lt(alpha.id, bravo.id)) {
          bravo.returnType = alpha.returnType;
          return bravo.id = alpha.id;
        } else {
          alpha.returnType = bravo.returnType;
          return alpha.id = bravo.id;
        }
      }
      _FunctionType_prototype.equals = function (other) {
        if (other === this) {
          return true;
        } else if (other instanceof FunctionType) {
          if (this.id === other.id) {
            return true;
          } else if (this.returnType.equals(other.returnType)) {
            become(this, other);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      };
      _FunctionType_prototype.compare = function (other) {
        var cmp;
        if (this === other) {
          return 0;
        } else if (other instanceof FunctionType) {
          if (this.id === other.id) {
            return 0;
          } else {
            cmp = this.returnType.compare(other.returnType);
            if (cmp === 0) {
              become(this, other);
            }
            return cmp;
          }
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
        } else if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType) {
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
        } else if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType) {
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
            var _arr, _i, type;
            for (_arr = __toArray(other.types), _i = _arr.length; _i--; ) {
              type = _arr[_i];
              if (_this.isSubsetOf(type)) {
                return true;
              }
            }
            return false;
          }());
        } else if (other instanceof ComplementType) {
          return !this.isSubsetOf(other.untype);
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
        } else if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType) {
          return false;
        } else {
          return other.overlaps(this);
        }
      };
      _FunctionType_prototype.complement = function () {
        var _ref;
        if ((_ref = this._complement) == null) {
          return this._complement = ComplementType(this);
        } else {
          return _ref;
        }
      };
      _FunctionType_prototype.inspect = function (depth) {
        if (this.returnType === any) {
          return "Type.function";
        } else {
          return __strnum(inspect(this.returnType, null, depth)) + ".function()";
        }
      };
      _FunctionType_prototype.toJSON = function () {
        return { type: "function", returnType: this.returnType };
      };
      fromJSONTypes["function"] = function (_p) {
        var returnType;
        returnType = _p.returnType;
        return Type.fromJSON(returnType)["function"]();
      };
      return FunctionType;
    }(Type));
    UnionType = (function (Type) {
      var _Type_prototype2, _UnionType_prototype;
      function UnionType(types) {
        var _i, _len, _this;
        _this = this instanceof UnionType ? this : __create(_UnionType_prototype);
        if (!__isArray(types)) {
          throw TypeError("Expected types to be an Array, got " + __typeof(types));
        } else {
          for (_i = 0, _len = types.length; _i < _len; ++_i) {
            if (!(types[_i] instanceof Type)) {
              throw TypeError("Expected types[" + _i + "] to be a Type, got " + __typeof(types[_i]));
            }
          }
        }
        _this.types = types;
        if (types.length <= 1) {
          throw Error("Must provide at least 2 types to UnionType");
        }
        _this.id = getId();
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
      function become(alpha, bravo) {
        if (__lt(alpha.id, bravo.id)) {
          bravo.types = alpha.types;
          return bravo.id = alpha.id;
        } else {
          alpha.types = bravo.types;
          return alpha.id = bravo.id;
        }
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
          return __cmp("UnionType", other.constructor.name);
        }
      };
      _UnionType_prototype.union = function (other) {
        var _arr, _i, _len, newTypes, type, types;
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType || other instanceof FunctionType) {
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
          return !this.overlaps(other.untype);
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
        } else if (other instanceof ArrayType || other instanceof ObjectType || other instanceof FunctionType) {
          return (function () {
            var _arr, _i, type;
            for (_arr = __toArray(_this.types), _i = _arr.length; _i--; ) {
              type = _arr[_i];
              if (type.overlaps(other)) {
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
        var _ref;
        if ((_ref = this._complement) == null) {
          return this._complement = ComplementType(this);
        } else {
          return _ref;
        }
      };
      _UnionType_prototype.inspect = function (depth) {
        var _this;
        _this = this;
        return "(" + __strnum((function () {
          var _arr, _arr2, _i, _len, type;
          for (_arr = [], _arr2 = __toArray(_this.types), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            type = _arr2[_i];
            _arr.push(inspect(type, null, depth != null ? __num(depth) - 1 : null));
          }
          return _arr;
        }()).join(").union(")) + ")";
      };
      _UnionType_prototype.toJSON = function () {
        return { type: "union", types: this.types };
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
        if (!(untype instanceof Type)) {
          throw TypeError("Expected untype to be a Type, got " + __typeof(untype));
        }
        _this.untype = untype;
        _this.id = getId();
        return _this;
      }
      _Type_prototype2 = Type.prototype;
      _ComplementType_prototype = ComplementType.prototype = __create(_Type_prototype2);
      _ComplementType_prototype.constructor = ComplementType;
      ComplementType.displayName = "ComplementType";
      _ComplementType_prototype.toString = function () {
        var _ref;
        if ((_ref = this._name) == null) {
          return this._name = "any \\ " + String(this.untype);
        } else {
          return _ref;
        }
      };
      function become(alpha, bravo) {
        if (__lt(alpha.id, bravo.id)) {
          bravo.id = alpha.id;
          return bravo.untype = alpha.untype;
        } else {
          alpha.id = bravo.id;
          return alpha.untype = bravo.untype;
        }
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
          return __cmp("ComplementType", other.constructor.name);
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType || other instanceof FunctionType) {
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof ObjectType || other instanceof FunctionType) {
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
        if (!(other instanceof Type)) {
          throw TypeError("Expected other to be a Type, got " + __typeof(other));
        }
        if (other instanceof ComplementType) {
          return other.untype.isSubsetOf(this.untype);
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
        if (other instanceof SimpleType || other instanceof ArrayType || other instanceof FunctionType) {
          return !this.untype.overlaps(other);
        } else if (other instanceof ObjectType) {
          return (function () {
            var _arr, _i, untype;
            for (_arr = getUntypes(_this.untype), _i = _arr.length; _i--; ) {
              untype = _arr[_i];
              if (untype instanceof ObjectType && other.isSubsetOf(untype)) {
                return false;
              }
            }
            return true;
          }());
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
        return __strnum(this.untype.inspect(depth)) + ".complement()";
      };
      _ComplementType_prototype.toJSON = function () {
        return { type: "complement", untype: this.complement() };
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
        return "Type.any";
      };
      _AnyType_prototype.toJSON = function () {
        return { type: "any" };
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
        return "Type.none";
      };
      _NoneType_prototype.toJSON = function () {
        return { type: "none" };
      };
      fromJSONTypes.none = function () {
        return none;
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
    Type.object = Type.makeObject({});
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
