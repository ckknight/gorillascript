(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __bind, __cmp, __create, __curry, __genericFunc, __getInstanceof, __import, __in, __indexOfIdentical, __int, __isArray, __isObject, __iter, __lt, __lte, __name, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, _arr, _Block, _BlockWithClearCache, _DefineMacro, _FunctionBody, _i, _len, _Name, _o, _ref, _ref2, _SomeEmptyLinesWithCheckIndent, _Symbol, AccessMultiNode, AccessNode, addParamToScope, AnyArrayLiteral, AnyObjectLiteral, ArgsNode, ArgumentsLiteral, ArrayLiteral, ArrayNode, ArrayParameter, ArrayType, Assignment, AssignmentAsExpression, AssignNode, Ast, AsterixChar, AstExpression, AstStatement, AtSignChar, BackslashChar, BackslashEscapeSequence, BackslashStringLiteral, BasicInvocationOrAccess, BinaryDigit, BinaryNode, BinaryNumber, BinaryOperationByPrecedence, Block, BlockNode, Body, BodyNoEnd, BodyNoIndent, BodyNoIndentNoEnd, BodyWithIndent, BOM, Box, BracketedObjectKey, BreakNode, cache, CallNode, CaretChar, CheckStop, CloseCurlyBrace, CloseCurlyBraceChar, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonChar, ColonEmbeddedClose, ColonEmbeddedCloseWrite, ColonEqual, ColonNewline, Comma, CommaChar, CommaOrNewline, CommaOrSomeEmptyLinesWithCheckIndent, CommentNode, concat, cons, ConstantLiteral, ConstNode, ConstObjectKey, ContinueNode, convertInvocationOrAccess, CountIndent, CURRENT_ARRAY_LENGTH_NAME, CurrentArrayLength, CustomBinaryOperator, CustomOperatorCloseParenthesis, DebuggerNode, DecimalDigit, DecimalNumber, DedentedBody, DefineHelper, DefineMacro, DefineOperator, DefineSyntax, DefNode, disallowEmbeddedText, DollarSign, DollarSignChar, DoubleColonChar, DoubleQuote, DoubleStringArrayLiteral, DoubleStringLiteral, DoubleStringLiteralInner, DualObjectKey, EMBED_CLOSE_COMMENT_DEFAULT, EMBED_CLOSE_DEFAULT, EMBED_CLOSE_WRITE_DEFAULT, EMBED_OPEN_COMMENT_DEFAULT, EMBED_OPEN_DEFAULT, EMBED_OPEN_WRITE_DEFAULT, EmbeddedBlock, EmbeddedClose, EmbeddedCloseComment, EmbeddedCloseWrite, EmbeddedComment, EmbeddedLiteralText, EmbeddedLiteralTextInner, EmbeddedLiteralTextInnerPart, EmbeddedLiteralTextInnerPartWithBlock, EmbeddedLiteralTextInnerWithBlock, EmbeddedLiteralTextInnerWithBlockWithClearCache, EmbeddedOpen, EmbeddedOpenComment, EmbeddedOpenWrite, EmbeddedReadLiteralText, EmbeddedWriteExpression, EmbedWriteNode, EmptyLine, EmptyLines, End, EndNoIndent, EqualChar, EqualSign, EqualSignChar, Eval, EvalNode, ExclamationPointChar, Expression, ExpressionAsStatement, ExpressionOrAssignment, FalseLiteral, ForInNode, ForNode, fromCharCode, FunctionBody, FunctionDeclaration, FunctionGlyph, FunctionLiteral, FunctionNode, FunctionType, GeneratorBody, GeneratorBodyNoEnd, GeneratorFunctionBody, getReservedIdents, GetSetToken, GreaterThan, GreaterThanChar, HashSignChar, HexDigit, HexEscapeSequence, HexNumber, Identifier, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierOrThisAccess, IdentifierParameter, IdentNode, IfNode, inAst, IndentedUnclosedArrayLiteral, IndentedUnclosedArrayLiteralInner, IndentedUnclosedObjectLiteral, IndentedUnclosedObjectLiteralInner, INDENTS, Index, inEvilAst, inExpression, InfinityLiteral, inFunctionTypeParams, inMacro, inStatement, InvocationArguments, InvocationOrAccess, InvocationOrAccessPart, KeyValuePair, KvpParameter, LessThan, LessThanChar, Letter, LicenseComment, Line, Literal, Logic, MacroAccessNode, MacroBody, MacroError, MacroHelper, MacroHolder, MacroName, MacroNames, MacroOptions, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, makeAlterStack, makeEmbeddedRule, Map, MapLiteral, MaybeAsType, MaybeAtSignChar, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExclamationPointChar, MaybeNotToken, MaybeQuestionMarkChar, MaybeSpreadToken, MaybeUnderscores, MethodDeclaration, MinusChar, multiple, mutate, Name, NameChar, NameOrSymbol, NamePart, NameStart, NaNLiteral, Node, nodeType, NoNewlineIfNoIndent, NonUnionType, NoSpace, NoSpaceNewline, NotColon, NotColonUnlessNoIndentAndNewline, NotEmbeddedOpenComment, NotEmbeddedOpenWrite, Nothing, NothingNode, notInFunctionTypeParams, NullLiteral, NumberChar, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectKeyNotColon, ObjectLiteral, ObjectNode, ObjectParameter, ObjectType, ObjectTypePair, OctalDigit, OctalNumber, oneOf, oneOrMore, oneOrMoreOf, OpenCurlyBrace, OpenCurlyBraceChar, OpenParenthesis, OpenSquareBracket, OpenSquareBracketChar, ParamDualObjectKey, Parameter, ParameterOrNothing, Parameters, ParameterSequence, ParamNode, ParamSingularObjectKey, Parenthetical, Parser, ParserError, PercentSign, PercentSignChar, Period, PeriodOrDoubleColonChar, Pipe, PipeChar, PlusChar, PlusOrMinusChar, PostfixUnaryOperation, PrefixUnaryOperation, preventUnclosedObjectLiteral, PrimaryExpression, PropertyDualObjectKey, PropertyOrDualObjectKey, PropertyOrDualObjectKeyOrMethodDeclaration, quote, RadixNumber, RegexLiteral, RegexpNode, ReturnNode, RootNode, Scope, Semicolon, SemicolonChar, Semicolons, separatedList, sequential, setImmediate, SetLiteral, Shebang, SHORT_CIRCUIT, SimpleConstantLiteral, SingleEscapeCharacter, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, Space, SpaceChar, SpaceChars, SpreadNode, SpreadOrExpression, Stack, Statement, StringIndent, StringInterpolation, StringLiteral, stringRepeat, SuperInvocation, SuperNode, SwitchNode, Symbol, SymbolChar, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, ThisLiteral, ThisNode, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, ThrowNode, TmpNode, TmpWrapperNode, trimRight, TripleDoubleQuote, TripleDoubleStringArrayLiteral, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TryCatchNode, TryFinallyNode, Type, TypeFunctionNode, TypeGenericNode, TypeObjectNode, TypeReference, TypeUnionNode, UnaryNode, UnclosedArguments, UnclosedArrayLiteralElement, UnclosedObjectLiteral, UnclosedObjectLiteralsAllowed, Underscore, UnicodeEscapeSequence, unique, unusedCaches, UseMacro, VarNode, VoidLiteral, WeakMap, wrapIndent, YieldNode, Zero, zeroOrMore, zeroOrMoreOf;
  __arrayToIter = (function () {
    var proto;
    proto = {
      iterator: function () {
        return this;
      },
      next: function () {
        var array, i;
        i = __num(this.index) + 1;
        array = this.array;
        if (i >= __num(array.length)) {
          return { done: true, value: void 0 };
        } else {
          this.index = i;
          return { done: false, value: array[i] };
        }
      }
    };
    return function (array) {
      var _o;
      if (!__isArray(array)) {
        throw TypeError("Expected array to be an Array, got " + __typeof(array));
      }
      _o = __create(proto);
      _o.array = array;
      _o.index = -1;
      return _o;
    };
  }());
  __bind = function (parent, child) {
    var func;
    if (parent == null) {
      throw TypeError("Expected parent to be an object, got " + __typeof(parent));
    }
    func = parent[child];
    if (typeof func !== "function") {
      throw Error("Trying to bind child '" + String(child) + "' which is not a function");
    }
    return function () {
      return func.apply(parent, arguments);
    };
  };
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
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (__num(numArgs) > 1) {
      currier = function (args) {
        var ret;
        if (!__lt(args.length, numArgs)) {
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
  __genericFunc = function (numArgs, make) {
    var any, cache, result;
    cache = WeakMap();
    any = {};
    function generic() {
      var _ref, current, i, item, type;
      current = cache;
      for (i = numArgs - 1; i >= 0; --i) {
        if ((_ref = arguments[i]) != null) {
          type = _ref;
        } else {
          type = any;
        }
        item = current.get(type);
        if (item == null) {
          item = i === 0 ? make.apply(this, arguments) : WeakMap();
          current.set(type, item);
        }
        current = item;
      }
      return current;
    }
    result = generic();
    result.generic = generic;
    return result;
  };
  __getInstanceof = (function () {
    function isAny() {
      return true;
    }
    function isStr(x) {
      return typeof x === "string";
    }
    function isNum(x) {
      return typeof x === "number";
    }
    function isFunc(x) {
      return typeof x === "function";
    }
    function isBool(x) {
      return typeof x === "boolean";
    }
    return function (ctor) {
      if (ctor == null) {
        return isAny;
      } else {
        switch (ctor) {
        case String: return isStr;
        case Number: return isNum;
        case Function: return isFunc;
        case Boolean: return isBool;
        case Array: return __isArray;
        case Object: return __isObject;
        default:
          return function (_x) {
            return _x instanceof ctor;
          };
        }
      }
    };
  }());
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
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
  __indexOfIdentical = function (array, item) {
    var _arr, check, i, inf;
    if (typeof item === "number") {
      if (item !== item) {
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check !== check) {
            return i;
          }
        }
        return -1;
      } else if (item === 0) {
        inf = 1 / item;
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check === 0 && 1 / check === inf) {
            return i;
          }
        }
        return -1;
      }
    }
    return array.indexOf(item);
  };
  __int = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else if (num % 1 !== 0) {
      throw TypeError("Expected an integer, got " + num);
    } else {
      return num;
    }
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __isObject = function (x) {
    return typeof x === "object" && x !== null;
  };
  __iter = function (iterable) {
    if (iterable == null) {
      throw TypeError("Expected iterable to be an Object, got " + __typeof(iterable));
    } else if (__isArray(iterable)) {
      return __arrayToIter(iterable);
    } else if (typeof iterable.iterator === "function") {
      return iterable.iterator();
    } else if (typeof iterable.next === "function") {
      return iterable;
    } else {
      throw Error("Expected iterable to be an Array or an Object with an 'iterator' function or an Object with a 'next' function, got " + __typeof(iterable));
    }
  };
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
  __name = function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
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
  Map = typeof GLOBAL.Map === "function" ? GLOBAL.Map
    : (Map = (function () {
      var _Map_prototype;
      function Map(iterable) {
        var _item, _iter, _this, x;
        _this = this instanceof Map ? this : __create(_Map_prototype);
        _this._keys = [];
        _this._values = [];
        if (iterable != null) {
          try {
            for (_iter = __iter(iterable); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              x = _item.value;
              _this.set(x[0], x[1]);
            }
          } finally {
            try {
              _iter.close();
            } catch (_e) {}
          }
        }
        return _this;
      }
      _Map_prototype = Map.prototype;
      Map.displayName = "Map";
      _Map_prototype.get = function (key) {
        var index;
        index = __indexOfIdentical(this._keys, key);
        if (index === -1) {
          return;
        } else {
          return this._values[index];
        }
      };
      _Map_prototype.has = function (key) {
        return __indexOfIdentical(this._keys, key) !== -1;
      };
      _Map_prototype.set = function (key, value) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          index = keys.length;
          keys[index] = key;
        }
        this._values[index] = value;
      };
      _Map_prototype["delete"] = function (key) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          return false;
        } else {
          keys.splice(index, 1);
          return this._values.splice(index, 1);
        }
      };
      _Map_prototype.keys = function () {
        var _arr, _e, _i, _send, _state, _step, _this, key;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._keys);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[_i];
              _state = 1;
              return { done: false, value: key };
            case 3:
              return { done: true, value: void 0 };
            default: throw Error("Unknown state: " + _state);
            }
          }
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (e) {
            throw e;
          }
        };
      };
      _Map_prototype.values = function () {
        var _arr, _e, _i, _send, _state, _step, _this, value;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._values);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              value = _arr[_i];
              _state = 1;
              return { done: false, value: value };
            case 3:
              return { done: true, value: void 0 };
            default: throw Error("Unknown state: " + _state);
            }
          }
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (e) {
            throw e;
          }
        };
      };
      _Map_prototype.items = function () {
        var _arr, _e, _send, _state, _step, _this, i, key, values;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              values = _this._values;
              _arr = __toArray(_this._keys);
              i = _arr.length;
              ++_state;
            case 1:
              _state = i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[i];
              _state = 1;
              return {
                done: false,
                value: [key, values[i]]
              };
            case 3:
              return { done: true, value: void 0 };
            default: throw Error("Unknown state: " + _state);
            }
          }
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _close();
            throw _e;
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (e) {
            throw e;
          }
        };
      };
      _Map_prototype.iterator = Map.prototype.items;
      return Map;
    }()));
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function () {
      var nextTick;
      nextTick = process.nextTick;
      return function (func) {
        var args;
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }())
    : function (func) {
      var args;
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, __toArray(args));
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  WeakMap = typeof GLOBAL.WeakMap === "function" ? GLOBAL.WeakMap
    : (WeakMap = (function () {
      var _WeakMap_prototype, defProp, isExtensible;
      function WeakMap() {
        var _this;
        _this = this instanceof WeakMap ? this : __create(_WeakMap_prototype);
        _this._keys = [];
        _this._values = [];
        _this._chilly = [];
        _this._uid = createUid();
        return _this;
      }
      _WeakMap_prototype = WeakMap.prototype;
      WeakMap.displayName = "WeakMap";
      function uidRand() {
        return Math.random().toString(36).slice(2);
      }
      function createUid() {
        return __strnum(uidRand()) + "-" + __strnum(new Date().getTime()) + "-" + __strnum(uidRand()) + "-" + __strnum(uidRand());
      }
      isExtensible = Object.isExtensible || function () {
        return true;
      };
      function check(key) {
        var chilly, uid;
        uid = this._uid;
        if (__owns.call(key, uid)) {
          chilly = this._chilly;
          if (chilly.indexOf(key) === -1) {
            chilly.push(key);
            this._keys.push(key);
            this._values.push(key[uid]);
          }
        }
      }
      _WeakMap_prototype.get = function (key) {
        var _ref, index;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          if (__owns.call(key, _ref = this._uid)) {
            return key[_ref];
          }
        } else {
          check.call(this, key);
          index = this._keys.indexOf(key);
          if (index === -1) {
            return;
          } else {
            return this._values[index];
          }
        }
      };
      _WeakMap_prototype.has = function (key) {
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          return __owns.call(key, this._uid);
        } else {
          check.call(this, key);
          return this._keys.indexOf(key) !== -1;
        }
      };
      if (typeof Object.defineProperty === "function") {
        defProp = Object.defineProperty;
      } else {
        defProp = function (o, k, d) {
          o[k] = d.value;
        };
      }
      _WeakMap_prototype.set = function (key, value) {
        var index, keys;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          defProp(key, this._uid, { configurable: true, writable: true, enumerable: false, value: value });
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index === -1) {
            index = keys.length;
            keys[index] = key;
          }
          this._values[index] = value;
        }
      };
      _WeakMap_prototype["delete"] = function (key) {
        var index, keys;
        if (Object(key) !== key) {
          throw TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          delete key[this._uid];
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index !== -1) {
            keys.splice(index, 1);
            this._values.splice(index, 1);
          }
        }
      };
      return WeakMap;
    }()));
  Node = require("./parser-nodes");
  Scope = require("./parser-scope");
  MacroHelper = require("./parser-macrohelper");
  MacroHolder = require("./parser-macroholder");
  Type = require("./types");
  stringRepeat = require("./utils").stringRepeat;
  addParamToScope = require("./parser-utils").addParamToScope;
  quote = (_ref = require("./utils")).quote;
  unique = _ref.unique;
  CURRENT_ARRAY_LENGTH_NAME = "__currentArrayLength";
  EMBED_OPEN_DEFAULT = "<%";
  EMBED_CLOSE_DEFAULT = "%>";
  EMBED_OPEN_WRITE_DEFAULT = "<%=";
  EMBED_CLOSE_WRITE_DEFAULT = "%>";
  EMBED_OPEN_COMMENT_DEFAULT = "<%--";
  EMBED_CLOSE_COMMENT_DEFAULT = "--%>";
  AccessNode = Node.Access;
  AccessMultiNode = Node.AccessMulti;
  ArgsNode = Node.Args;
  ArrayNode = Node.Array;
  AssignNode = Node.Assign;
  BinaryNode = Node.Binary;
  BlockNode = Node.Block;
  BreakNode = Node.Break;
  CallNode = Node.Call;
  CommentNode = Node.Comment;
  ConstNode = Node.Const;
  ContinueNode = Node.Continue;
  DebuggerNode = Node.Debugger;
  DefNode = Node.Def;
  EmbedWriteNode = Node.EmbedWrite;
  EvalNode = Node.Eval;
  ForNode = Node.For;
  ForInNode = Node.ForIn;
  FunctionNode = Node.Function;
  IdentNode = Node.Ident;
  IfNode = Node.If;
  MacroAccessNode = Node.MacroAccess;
  NothingNode = Node.Nothing;
  ObjectNode = Node.Object;
  ParamNode = Node.Param;
  RegexpNode = Node.Regexp;
  ReturnNode = Node.Return;
  RootNode = Node.Root;
  SpreadNode = Node.Spread;
  SuperNode = Node.Super;
  SwitchNode = Node.Switch;
  SyntaxChoiceNode = Node.SyntaxChoice;
  SyntaxManyNode = Node.SyntaxMany;
  SyntaxParamNode = Node.SyntaxParam;
  SyntaxSequenceNode = Node.SyntaxSequence;
  ThisNode = Node.This;
  ThrowNode = Node.Throw;
  TmpNode = Node.Tmp;
  TmpWrapperNode = Node.TmpWrapper;
  TryCatchNode = Node.TryCatch;
  TryFinallyNode = Node.TryFinally;
  TypeFunctionNode = Node.TypeFunction;
  TypeGenericNode = Node.TypeGeneric;
  TypeObjectNode = Node.TypeObject;
  TypeUnionNode = Node.TypeUnion;
  UnaryNode = Node.Unary;
  VarNode = Node.Var;
  YieldNode = Node.Yield;
  ParserError = (function (Error) {
    var _Error_prototype, _ParserError_prototype;
    function ParserError(message, parser, index) {
      var _this, err, pos;
      _this = this instanceof ParserError ? this : __create(_ParserError_prototype);
      if (message == null) {
        message = "";
      } else if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
      }
      if (parser == null) {
        parser = null;
      } else if (!(parser instanceof Parser)) {
        throw TypeError("Expected parser to be one of " + (__name(Parser) + " or null") + ", got " + __typeof(parser));
      }
      if (index == null) {
        index = 0;
      } else if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      _this.index = index;
      if (message && !parser) {
        throw TypeError("Expected parser to be a Parser, got " + __typeof(parser));
      }
      if (parser) {
        _this.source = parser.source;
        _this.filename = parser.options.filename;
        pos = parser.getPosition(index);
        _this.line = pos.line;
        _this.column = pos.column;
        _this.message = message + (" at " + (_this.filename ? __strnum(_this.filename) + ":" : "") + __strnum(_this.line) + ":" + __strnum(_this.column));
      } else {
        _this.line = 0;
        _this.column = 0;
      }
      err = Error.call(_this, _this.message);
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, ParserError);
      } else if ("stack" in err) {
        _this.stack = err.stack;
      }
      return _this;
    }
    _Error_prototype = Error.prototype;
    _ParserError_prototype = ParserError.prototype = __create(_Error_prototype);
    _ParserError_prototype.constructor = ParserError;
    ParserError.displayName = "ParserError";
    if (typeof Error.extended === "function") {
      Error.extended(ParserError);
    }
    _ParserError_prototype.name = ParserError.name;
    return ParserError;
  }(Error));
  MacroError = (function (Error) {
    var _Error_prototype, _MacroError_prototype;
    function MacroError(inner, parser, index) {
      var _this, err, msg, pos;
      _this = this instanceof MacroError ? this : __create(_MacroError_prototype);
      if (inner == null) {
        inner = "";
      } else if (!(inner instanceof Error) && typeof inner !== "string") {
        throw TypeError("Expected inner to be one of " + (__name(Error) + " or String") + ", got " + __typeof(inner));
      }
      if (parser == null) {
        parser = null;
      } else if (!(parser instanceof Parser)) {
        throw TypeError("Expected parser to be one of " + (__name(Parser) + " or null") + ", got " + __typeof(parser));
      }
      if (index == null) {
        index = 0;
      } else if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      _this.index = index;
      if (inner && !parser) {
        throw TypeError("Expected parser to be a Parser, got " + __typeof(parser));
      }
      if (parser) {
        _this.source = parser.source;
        _this.filename = parser.options.filename;
        pos = parser.getPosition(index);
        _this.line = pos.line;
        _this.column = pos.column;
        msg = [];
        if (inner instanceof Error) {
          if (__typeof(inner) !== "Error") {
            msg.push(__typeof(inner));
            msg.push(": ");
          }
          msg.push(String(inner.message));
        } else {
          msg.push(String(inner));
        }
        msg.push(" at ");
        if (_this.filename) {
          msg.push(String(_this.filename));
          msg.push(":");
        }
        _this._message = msg.join("");
        msg.push(_this.line);
        msg.push(":");
        msg.push(_this.column);
        _this.message = msg.join("");
      } else {
        _this.line = 0;
        _this.column = 0;
        _this._message = "";
        _this.message = "";
      }
      err = Error.call(_this, _this.message);
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, MacroError);
      } else if ("stack" in err) {
        _this.stack = err.stack;
      }
      if (inner instanceof Error) {
        _this.inner = inner;
      }
      return _this;
    }
    _Error_prototype = Error.prototype;
    _MacroError_prototype = MacroError.prototype = __create(_Error_prototype);
    _MacroError_prototype.constructor = MacroError;
    MacroError.displayName = "MacroError";
    if (typeof Error.extended === "function") {
      Error.extended(MacroError);
    }
    _MacroError_prototype.name = MacroError.name;
    _MacroError_prototype.setPosition = function (line, column) {
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      return;
    };
    return MacroError;
  }(Error));
  Box = (function () {
    var _Box_prototype;
    function Box(index, value) {
      var _this;
      _this = this instanceof Box ? this : __create(_Box_prototype);
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      _this.index = index;
      _this.value = value;
      if (index % 1 !== 0 || index < 0) {
        throw RangeError("Expected index to be a non-negative integer, got " + index);
      }
      return _this;
    }
    _Box_prototype = Box.prototype;
    Box.displayName = "Box";
    return Box;
  }());
  unusedCaches = Map();
  cache = (function () {
    var id;
    id = -1;
    return function (rule) {
      var cacheKey, stack;
      if (typeof rule !== "function") {
        throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
      }
      if (arguments.length > 1) {
        throw Error("Expected only one argument");
      }
      cacheKey = ++id;
      stack = Error().stack;
      function f(parser, index) {
        var _ref, _ref2, cache, indent, indentCache, inner, item, result;
        cache = parser.cache;
        indent = parser.indent.peek();
        if ((_ref = cache[indent]) != null) {
          indentCache = _ref;
        } else {
          indentCache = cache[indent] = [];
        }
        if ((_ref = indentCache[_ref2 = index % 16]) != null) {
          inner = _ref;
        } else {
          inner = indentCache[_ref2] = [];
        }
        item = inner[cacheKey];
        if (item && item.start === index) {
          unusedCaches["delete"](f);
          return item.result;
        } else {
          result = rule(parser, index);
          if (parser.indent.peek() !== indent) {
            throw Error("Changed indent during cache process: from " + __strnum(indent) + " to " + __strnum(_indent.peek(o)));
          } else if (result && !(result instanceof Box)) {
            throw Error("Expected result to be a Box, got " + __typeof(result));
          }
          inner[cacheKey] = { start: index, result: result };
          return result;
        }
      }
      unusedCaches.set(f, stack);
      return f;
    };
  }());
  function identity(x) {
    return x;
  }
  function makeReturn(x) {
    return function () {
      return x;
    };
  }
  wrapIndent = -1;
  function wrap(name, func) {
    var inspect;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    inspect = require("util").inspect;
    return function (parser, index) {
      var indentText, newPos, pos, result;
      ++wrapIndent;
      indentText = stringRepeat(" ", wrapIndent);
      try {
        pos = parser.getPosition(index);
        console.log(__strnum(indentText) + name + ": begin at " + __strnum(pos.line) + ":" + __strnum(pos.column) + ": " + __strnum(inspect(parser.source.substring(index, +index + 20))));
        try {
          result = func(parser, index);
          if (result) {
            newPos = parser.getPosition(result.index);
            console.log(__strnum(indentText) + name + ": done  at " + __strnum(pos.line) + ":" + __strnum(pos.column) + " -> " + __strnum(newPos.line) + ":" + __strnum(newPos.column) + ", " + __strnum(inspect(result.value)));
          } else {
            console.log(__strnum(indentText) + name + ": fail  at " + __strnum(pos.line) + ":" + __strnum(pos.column));
          }
          return result;
        } catch (e) {
          console.log(__strnum(indentText) + name + ": ERROR " + __strnum(pos.line) + ":" + __strnum(pos.column) + " !!! " + String(e));
          throw e;
        }
      } finally {
        --wrapIndent;
      }
    };
  }
  fromCharCode = (function () {
    var f;
    f = String.fromCharCode;
    return function (charCode) {
      if (charCode > 65535) {
        return "" + f((charCode - 65536 >> 10) + 55296) + f((charCode - 65536) % 1024 + 56320);
      } else {
        return f(charCode);
      }
    };
  }());
  function processCharCodes(codes, array, start) {
    var _i, _len, code;
    if (!__isArray(codes)) {
      throw TypeError("Expected codes to be an Array, got " + __typeof(codes));
    }
    if (array == null) {
      array = [];
    }
    if (start == null) {
      start = 0;
    }
    for (_len = codes.length, _i = __int(start), _i < 0 && (_i += _len); _i < _len; ++_i) {
      code = codes[_i];
      array.push(fromCharCode(code));
    }
    return array;
  }
  function codesToString(codes) {
    if (!__isArray(codes)) {
      throw TypeError("Expected codes to be an Array, got " + __typeof(codes));
    }
    return processCharCodes(codes).join("");
  }
  makeAlterStack = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function (name, value) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (!_instanceof_T(value)) {
        throw TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
      }
      return function (rule) {
        if (typeof rule !== "function") {
          throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
        }
        return function (parser, index) {
          var stack;
          stack = parser[name];
          stack.push(value);
          try {
            return rule(parser, index);
          } finally {
            stack.pop();
          }
        };
      };
    };
  });
  function charsToFakeSet(array) {
    var _arr, _end, _i, _len, c, item, obj;
    obj = __create(null);
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (typeof item === "number") {
        obj[item] = true;
      } else {
        for (c = __num(item[0]), _end = __num(item[1]); c <= _end; ++c) {
          obj[c] = true;
        }
      }
    }
    return obj;
  }
  function stackWrap(func) {
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    func.stack = Error().stack;
    return func;
  }
  function character(name, expected) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (typeof expected !== "number") {
      throw TypeError("Expected expected to be a Number, got " + __typeof(expected));
    }
    return stackWrap(function (parser, index) {
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (parser.source.charCodeAt(index) === expected) {
        return Box(index + 1, expected);
      } else {
        return parser.fail(name, index);
      }
    });
  }
  function characters(name, expected) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (typeof expected !== "object" || expected === null) {
      throw TypeError("Expected expected to be an Object, got " + __typeof(expected));
    }
    return stackWrap(function (parser, index) {
      var c;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      c = parser.source.charCodeAt(index);
      if (expected[c]) {
        return Box(index + 1, c);
      } else {
        return parser.fail(name, index);
      }
    });
  }
  mutate = __curry(2, function (mutator, rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (arguments.length > 2) {
      throw Error("Expected only two arguments");
    }
    if (mutator === identity) {
      return rule;
    }
    if (typeof mutator !== "function") {
      mutator = makeReturn(mutator);
    }
    function f(parser, index) {
      var result;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      result = rule(parser, index);
      if (result) {
        if (!(result instanceof Box)) {
          throw TypeError("Expected result to be a Box, got " + __typeof(result));
        }
        return Box(result.index, mutator(result.value, parser, index, result.index));
      }
    }
    f.rule = rule;
    f.mutator = mutator;
    return stackWrap(f);
  });
  function bool(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (arguments.length > 1) {
      throw Error("Expected only two arguments");
    }
    if (typeof rule.mutator === "function" && typeof rule.rule === "function") {
      return bool(rule.rule);
    } else {
      return mutate(
        function (x) {
          return !!x;
        },
        rule
      );
    }
  }
  multiple = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function (rule, minimum, maximum, ignoreValue) {
      var mutator;
      if (typeof rule !== "function") {
        throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
      }
      if (minimum == null) {
        minimum = 0;
      } else if (typeof minimum !== "number") {
        throw TypeError("Expected minimum to be a Number, got " + __typeof(minimum));
      }
      if (maximum == null) {
        maximum = 1/0;
      } else if (typeof maximum !== "number") {
        throw TypeError("Expected maximum to be a Number, got " + __typeof(maximum));
      }
      if (ignoreValue == null) {
        ignoreValue = false;
      } else if (typeof ignoreValue !== "boolean") {
        throw TypeError("Expected ignoreValue to be a Boolean, got " + __typeof(ignoreValue));
      }
      if (arguments.length > 5) {
        throw Error("Expected only five arguments");
      }
      if (minimum % 1 !== 0 || minimum < 0) {
        throw RangeError("Expected minimum to be a non-negative integer, got " + minimum);
      }
      if (maximum !== 1/0 && maximum % 1 !== 0 || maximum < minimum) {
        throw RangeError("Expected maximum to be Infinity or an integer of at least " + minimum + ", got " + maximum);
      }
      mutator = identity;
      if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
        mutator = rule.mutator;
        rule = rule.rule;
      }
      if (ignoreValue) {
        return stackWrap(function (parser, index) {
          var count, item, newIndex;
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          count = 0;
          while (count < maximum) {
            item = rule(parser, index);
            if (!item) {
              if (count < minimum) {
                return;
              } else {
                break;
              }
            }
            if (!(item instanceof Box)) {
              throw TypeError("Expected item to be a Box, got " + __typeof(item));
            }
            if (!_instanceof_T(item.value)) {
              throw TypeError("Expected item.value to be a " + __name(T) + ", got " + __typeof(item.value));
            }
            ++count;
            newIndex = item.index;
            if (newIndex === index) {
              throw Error("Infinite loop detected");
            } else {
              index = newIndex;
            }
          }
          return Box(index, count);
        });
      } else if (mutator === identity) {
        return stackWrap(function (parser, index) {
          var count, item, newIndex, result;
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          result = [];
          count = 0;
          while (count < maximum) {
            item = rule(parser, index);
            if (!item) {
              if (count < minimum) {
                return;
              } else {
                break;
              }
            }
            if (!(item instanceof Box)) {
              throw TypeError("Expected item to be a Box, got " + __typeof(item));
            }
            if (!_instanceof_T(item.value)) {
              throw TypeError("Expected item.value to be a " + __name(T) + ", got " + __typeof(item.value));
            }
            result[count] = item.value;
            ++count;
            newIndex = item.index;
            if (newIndex === index) {
              throw Error("Infinite loop detected");
            } else {
              index = newIndex;
            }
          }
          return Box(index, result);
        });
      } else {
        return stackWrap(mutate(
          function (items, parser, index) {
            var _arr, _arr2, _i, _len, item;
            for (_arr = [], _arr2 = __toArray(items), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              item = _arr2[_i];
              _arr.push(mutator(item.value, parser, item.startIndex, item.endIndex));
            }
            return _arr;
          },
          function (parser, index) {
            var count, item, newIndex, result;
            if (typeof index !== "number") {
              throw TypeError("Expected index to be a Number, got " + __typeof(index));
            }
            result = [];
            count = 0;
            while (count < maximum) {
              item = rule(parser, index);
              if (!item) {
                if (count < minimum) {
                  return;
                } else {
                  break;
                }
              }
              if (!(item instanceof Box)) {
                throw TypeError("Expected item to be a Box, got " + __typeof(item));
              }
              if (!_instanceof_T(item.value)) {
                throw TypeError("Expected item.value to be a " + __name(T) + ", got " + __typeof(item.value));
              }
              newIndex = item.index;
              if (newIndex === index) {
                throw Error("Infinite loop detected");
              } else {
                index = newIndex;
              }
              result[count] = { startIndex: index, endIndex: newIndex, value: item.value };
              ++count;
            }
            return Box(index, result);
          }
        ));
      }
    };
  });
  zeroOrMore = __genericFunc(1, function (T) {
    return function (rule, ignoreValue) {
      return multiple.generic(T)(rule, 0, 1/0, ignoreValue);
    };
  });
  oneOrMore = __genericFunc(1, function (T) {
    return function (rule, ignoreValue) {
      return multiple.generic(T)(rule, 1, 1/0, ignoreValue);
    };
  });
  function maybe(rule, defaultValue) {
    var MISSING, mutator, subrule;
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (arguments.length > 2) {
      throw Error("Expected only two arguments");
    }
    MISSING = {};
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      subrule = rule.rule;
      mutator = rule.mutator;
      return mutate(
        typeof defaultValue === "function"
          ? function (value, parser, startIndex, endIndex) {
            if (value === MISSING) {
              return defaultValue(parser, startIndex);
            } else {
              return mutator(value, parser, startIndex, endIndex);
            }
          }
          : function (value, parser, startIndex, endIndex) {
            if (value === MISSING) {
              return defaultValue;
            } else {
              return mutator(value, parser, startIndex, endIndex);
            }
          },
        stackWrap(function (parser, index) {
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          return subrule(parser, index) || Box(index, MISSING);
        })
      );
    } else if (typeof defaultValue === "function") {
      return mutate(
        function (value, parser, startIndex, endIndex) {
          if (value === MISSING) {
            return defaultValue(parser, startIndex);
          } else {
            return value;
          }
        },
        stackWrap(function (parser, index) {
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          return rule(parser, index) || Box(index, MISSING);
        })
      );
    } else {
      return stackWrap(function (parser, index) {
        if (typeof index !== "number") {
          throw TypeError("Expected index to be a Number, got " + __typeof(index));
        }
        return rule(parser, index) || Box(index, defaultValue);
      });
    }
  }
  oneOf = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function () {
      var _arr, _i, _i2, _i3, _len, _len2, expandedRules, func, rule, rules, subrule;
      rules = __slice.call(arguments);
      if (!__isArray(rules)) {
        throw TypeError("Expected rules to be an Array, got " + __typeof(rules));
      } else {
        for (_i = rules.length; _i--; ) {
          if (typeof rules[_i] !== "function") {
            throw TypeError("Expected " + ("rules[" + _i + "]") + " to be a Function, got " + __typeof(rules[_i]));
          }
        }
      }
      switch (rules.length) {
      case 0: throw Error("Expected rules to be non-empty");
      case 1: return rules[0];
      default:
        expandedRules = [];
        for (_i2 = 0, _len = rules.length; _i2 < _len; ++_i2) {
          rule = rules[_i2];
          if (rule.oneOf) {
            for (_arr = __toArray(rule.oneOf), _i3 = 0, _len2 = _arr.length; _i3 < _len2; ++_i3) {
              subrule = _arr[_i3];
              expandedRules.push(subrule);
            }
          } else {
            expandedRules.push(rule);
          }
        }
        func = function (parser, index) {
          var _len, i, result, rule;
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          for (i = 0, _len = expandedRules.length; i < _len; ++i) {
            rule = expandedRules[i];
            result = rule(parser, index);
            if (result) {
              if (!(result instanceof Box)) {
                throw TypeError("Expected rules[" + i + "] to return a Box, got " + __typeof(result));
              }
              if (!_instanceof_T(result.value)) {
                throw TypeError("Expected rules[" + i + "]'s return value to be a " + __name(T) + ", got " + __typeof(result.value));
              }
              return result;
            }
          }
        };
        func.oneOf = expandedRules;
        return stackWrap(func);
      }
    };
  });
  zeroOrMoreOf = __genericFunc(1, function (T) {
    return function () {
      var rules;
      rules = __slice.call(arguments);
      return zeroOrMore.generic(T)(oneOf.generic(T).apply(void 0, __toArray(rules)));
    };
  });
  oneOrMoreOf = __genericFunc(1, function (T) {
    return function () {
      var rules;
      rules = __slice.call(arguments);
      return oneOrMore.generic(T)(oneOf.generic(T).apply(void 0, __toArray(rules)));
    };
  });
  function check(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return function (parser, index) {
      var result;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      result = rule(parser, index);
      if (result) {
        if (!(result instanceof Box)) {
          throw TypeError("Expected result to be a Box, got " + __typeof(result));
        }
        return Box(index);
      }
    };
  }
  SHORT_CIRCUIT = {};
  sequential = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function () {
      var _len, hasMutations, hasOther, i, item, items, key, keys, mapping, mutations, mutator, rule, rules, shortCircuitIndex, thisIndex;
      items = __slice.call(arguments);
      if (items.length === 0) {
        throw Error("Expected items to be non-empty");
      }
      rules = [];
      mapping = [];
      keys = [];
      mutations = [];
      thisIndex = -1;
      hasOther = false;
      shortCircuitIndex = 1/0;
      hasMutations = false;
      for (i = 0, _len = items.length; i < _len; ++i) {
        item = items[i];
        key = void 0;
        rule = void 0;
        if (__isArray(item)) {
          if (item.length !== 2) {
            throw Error("Found an array with " + __strnum(item.length) + " length at index #" + i);
          }
          if (typeof item[0] !== "string") {
            throw TypeError("Array in index #" + i + " has an improper key: " + __typeof(item[0]));
          }
          if (typeof item[1] !== "function") {
            throw TypeError("Array in index #" + i + " has an improper rule: " + __typeof(item[1]));
          }
          key = item[0];
          if (__in(key, keys)) {
            throw Error("Can only have one " + __str(JSON.stringify(key)) + " key in sequential");
          }
          keys.push(key);
          rule = item[1];
          if (key === "this") {
            thisIndex = rules.length;
          } else {
            hasOther = true;
          }
        } else if (typeof item === "function") {
          rule = item;
        } else if (item === SHORT_CIRCUIT) {
          if (shortCircuitIndex !== 1/0) {
            throw Error("Can only have one SHORT_CIRCUIT per sequential");
          }
          shortCircuitIndex = i;
          continue;
        } else {
          throw TypeError("Found a non-array, non-function in index #" + i + ": " + __typeof(item));
        }
        if (key && typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
          hasMutations = true;
          mutations.push(rule.mutator);
          rules.push(rule.rule);
        } else {
          mutations.push(null);
          rules.push(rule);
        }
        mapping.push(key);
      }
      if (thisIndex !== -1) {
        if (hasOther) {
          throw Error("Cannot specify both the 'this' key and another key");
        }
        if (!hasMutations) {
          return stackWrap(function (parser, index) {
            var _len, i, item, result, rule;
            if (typeof index !== "number") {
              throw TypeError("Expected index to be a Number, got " + __typeof(index));
            }
            for (i = 0, _len = rules.length; i < _len; ++i) {
              rule = rules[i];
              item = rule(parser, index);
              if (!item) {
                if (i < shortCircuitIndex) {
                  return;
                } else {
                  throw SHORT_CIRCUIT;
                }
              }
              if (!(item instanceof Box)) {
                throw TypeError("Expected item to be a Box, got " + __typeof(item));
              }
              index = item.index;
              if (i === thisIndex) {
                result = item.value;
              }
            }
            if (!_instanceof_T(result)) {
              throw TypeError("Expected result to be a " + __name(T) + ", got " + __typeof(result));
            }
            return Box(index, result);
          });
        } else {
          mutator = mutations[thisIndex];
          return stackWrap(mutate(
            function (item, parser, index) {
              return mutator(item.value, parser, item.startIndex, item.endIndex);
            },
            function (parser, index) {
              var _len, i, item, result, rule, valueIndex;
              if (typeof index !== "number") {
                throw TypeError("Expected index to be a Number, got " + __typeof(index));
              }
              valueIndex = 0;
              for (i = 0, _len = rules.length; i < _len; ++i) {
                rule = rules[i];
                item = rule(parser, index);
                if (!item) {
                  if (i < shortCircuitIndex) {
                    return;
                  } else {
                    throw SHORT_CIRCUIT;
                  }
                }
                if (!(item instanceof Box)) {
                  throw TypeError("Expected item to be a Box, got " + __typeof(item));
                }
                if (i === thisIndex) {
                  result = { value: item.value, startIndex: index, endIndex: item.index };
                }
                index = item.index;
              }
              if (!_instanceof_T(result)) {
                throw TypeError("Expected result to be a " + __name(T) + ", got " + __typeof(result));
              }
              return Box(index, result);
            }
          ));
        }
      } else if (hasOther) {
        if (hasMutations) {
          return stackWrap(mutate(
            function (value, parser, index) {
              var _len, i, item, key, mutator, result;
              result = {};
              for (i = 0, _len = keys.length; i < _len; ++i) {
                key = keys[i];
                if (key) {
                  item = value[key];
                  mutator = mutations[i];
                  if (mutator) {
                    result[key] = mutator(item.value, parser, item.startIndex, item.endIndex);
                  } else {
                    result[key] = item.value;
                  }
                }
              }
              return result;
            },
            function (parser, index) {
              var _len, i, indexes, item, key, result, rule;
              if (typeof index !== "number") {
                throw TypeError("Expected index to be a Number, got " + __typeof(index));
              }
              result = {};
              indexes = {};
              for (i = 0, _len = rules.length; i < _len; ++i) {
                rule = rules[i];
                item = rule(parser, index);
                if (!item) {
                  if (i < shortCircuitIndex) {
                    return;
                  } else {
                    throw SHORT_CIRCUIT;
                  }
                }
                if (!(item instanceof Box)) {
                  throw TypeError("Expected item to be a Box, got " + __typeof(item));
                }
                key = mapping[i];
                if (key) {
                  result[key] = { value: item.value, startIndex: index, endIndex: item.index };
                }
                index = item.index;
              }
              return Box(index, result);
            }
          ));
        } else {
          return stackWrap(function (parser, index) {
            var i, item, key, length, rule, value;
            if (typeof index !== "number") {
              throw TypeError("Expected index to be a Number, got " + __typeof(index));
            }
            value = {};
            i = 0;
            length = rules.length;
            for (; i < length; ++i) {
              rule = rules[i];
              item = rule(parser, index);
              if (!item) {
                if (i < shortCircuitIndex) {
                  return;
                } else {
                  throw SHORT_CIRCUIT;
                }
              }
              if (!(item instanceof Box)) {
                throw TypeError("Expected item to be a Box, got " + __typeof(item));
              }
              index = item.index;
              key = mapping[i];
              if (key) {
                value[key] = item.value;
              }
            }
            return Box(index, value);
          });
        }
      } else {
        if (hasMutations) {
          throw Error("Cannot use a mutator on a sequential without keys");
        }
        return stackWrap(function (parser, index) {
          var _len, i, item, rule;
          if (typeof index !== "number") {
            throw TypeError("Expected index to be a Number, got " + __typeof(index));
          }
          for (i = 0, _len = rules.length; i < _len; ++i) {
            rule = rules[i];
            item = rule(parser, index);
            if (!item) {
              if (i < shortCircuitIndex) {
                return;
              } else {
                throw SHORT_CIRCUIT;
              }
            }
            if (!(item instanceof Box)) {
              throw TypeError("Expected item to be a Box, got " + __typeof(item));
            }
            index = item.index;
          }
          return Box(index);
        });
      }
    };
  });
  cons = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function (headRule, tailRule) {
      if (typeof headRule !== "function") {
        throw TypeError("Expected headRule to be a Function, got " + __typeof(headRule));
      }
      if (typeof tailRule !== "function") {
        throw TypeError("Expected tailRule to be a Function, got " + __typeof(tailRule));
      }
      if (arguments.length > 2) {
        throw Error("Expected only two arguments");
      }
      return stackWrap(function (parser, index) {
        var _arr, head, i, item, tail;
        if (typeof index !== "number") {
          throw TypeError("Expected index to be a Number, got " + __typeof(index));
        }
        head = headRule(parser, index);
        if (!head) {
          return;
        }
        if (!(head instanceof Box)) {
          throw TypeError("Expected head to be a Box, got " + __typeof(head));
        } else if (!_instanceof_T(head.value)) {
          throw TypeError("Expected head.value to be a " + __name(T) + ", got " + __typeof(head.value));
        }
        tail = tailRule(parser, head.index);
        if (!tail) {
          return;
        }
        if (!(tail instanceof Box)) {
          throw TypeError("Expected tail to be a Box, got " + __typeof(tail));
        }
        if (!__isArray(tail.value)) {
          throw TypeError("Expected tail.value to be a Box, got " + __typeof(tail.value));
        }
        for (_arr = __toArray(tail.value), i = _arr.length; i--; ) {
          item = _arr[i];
          if (!_instanceof_T(item)) {
            throw TypeError("Expected tail.value[" + i + "] to be a " + __name(T) + ", got " + __typeof(item));
          }
        }
        return Box(tail.index, [head.value].concat(tail.value));
      });
    };
  });
  concat = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function (leftRule, rightRule) {
      if (typeof leftRule !== "function") {
        throw TypeError("Expected leftRule to be a Function, got " + __typeof(leftRule));
      }
      if (typeof rightRule !== "function") {
        throw TypeError("Expected rightRule to be a Function, got " + __typeof(rightRule));
      }
      if (arguments.length > 2) {
        throw Error("Expected only two arguments");
      }
      return stackWrap(function (parser, index) {
        var _arr, i, item, left, right;
        if (typeof index !== "number") {
          throw TypeError("Expected index to be a Number, got " + __typeof(index));
        }
        left = leftRule(parser, index);
        if (!left) {
          return;
        }
        if (!(left instanceof Box)) {
          throw TypeError("Expected left to be a Box, got " + __typeof(left));
        }
        if (!__isArray(left.value)) {
          throw TypeError("Expected left.value to be a Box, got " + __typeof(left.value));
        }
        for (_arr = __toArray(left.value), i = _arr.length; i--; ) {
          item = _arr[i];
          if (!_instanceof_T(item)) {
            throw TypeError("Expected left.value[" + i + "] to be a " + __name(T) + ", got " + __typeof(item));
          }
        }
        right = rightRule(parser, left.index);
        if (!right) {
          return;
        }
        if (!(right instanceof Box)) {
          throw TypeError("Expected right to be a Box, got " + __typeof(right));
        }
        if (!__isArray(right.value)) {
          throw TypeError("Expected right.value to be a Box, got " + __typeof(right.value));
        }
        for (_arr = __toArray(right.value), i = _arr.length; i--; ) {
          item = _arr[i];
          if (!_instanceof_T(item)) {
            throw TypeError("Expected right.value[" + i + "] to be a " + __name(T) + ", got " + __typeof(item));
          }
        }
        return Box(right.index, left.value.concat(right.value));
      });
    };
  });
  function nothingRule(parser, index) {
    return Box(index);
  }
  separatedList = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return function (itemRule, separatorRule, tailRule) {
      if (typeof itemRule !== "function") {
        throw TypeError("Expected itemRule to be a Function, got " + __typeof(itemRule));
      }
      if (separatorRule == null) {
        separatorRule = nothingRule;
      } else if (typeof separatorRule !== "function") {
        throw TypeError("Expected separatorRule to be a Function, got " + __typeof(separatorRule));
      }
      if (tailRule == null) {
        tailRule = itemRule;
      } else if (typeof tailRule !== "function") {
        throw TypeError("Expected tailRule to be a Function, got " + __typeof(tailRule));
      }
      if (arguments.length > 3) {
        throw Error("Expected only three arguments");
      }
      return stackWrap(function (parser, index) {
        var currentIndex, head, i, item, newIndex, result, separator;
        if (typeof index !== "number") {
          throw TypeError("Expected index to be a Number, got " + __typeof(index));
        }
        head = itemRule(parser, index);
        if (!head) {
          return;
        }
        if (!(head instanceof Box)) {
          throw TypeError("Expected head to be a Box, got " + __typeof(head));
        } else if (!_instanceof_T(head.value)) {
          throw TypeError("Expected head.value to be a " + __name(T) + ", got " + __typeof(head.value));
        }
        currentIndex = head.index;
        result = [head.value];
        i = 0;
        for (; ; ++i) {
          separator = separatorRule(parser, currentIndex);
          if (!separator) {
            break;
          }
          if (!(separator instanceof Box)) {
            throw TypeError("Expected separator to be a Box, got " + __typeof(separator));
          }
          item = tailRule(parser, separator.index);
          if (!item) {
            break;
          }
          if (!(item instanceof Box)) {
            throw TypeError("Expected item to be a Box, got " + __typeof(item));
          } else if (!_instanceof_T(item.value)) {
            throw TypeError("Expected head.value to be a " + __name(T) + ", got " + __typeof(item.value));
          }
          newIndex = item.index;
          if (newIndex === currentIndex) {
            throw Error("Infinite loop detected");
          } else {
            currentIndex = newIndex;
          }
          result.push(item.value);
        }
        return Box(currentIndex, result);
      });
    };
  });
  function except(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (arguments.length > 1) {
      throw Error("Expected only one argument");
    }
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return stackWrap(function (parser, index) {
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!rule(parser, index)) {
        return Box(index);
      }
    });
  }
  function anyExcept(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (arguments.length > 1) {
      throw Error("Expected only one argument");
    }
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return stackWrap(function (parser, index) {
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!rule(parser, index)) {
        return AnyChar(parser, index);
      }
    });
  }
  SpaceChar = characters("space", charsToFakeSet([
    9,
    11,
    12,
    32,
    160,
    5760,
    6158,
    [8192, 8202],
    8239,
    8287,
    12288,
    65263
  ]));
  SpaceChars = cache(zeroOrMore(SpaceChar, true));
  Zero = character('"0"', 48);
  DecimalDigit = characters("[0-9]", charsToFakeSet([[48, 57]]));
  Period = character('"."', 46);
  ColonChar = character('":"', 58);
  DoubleColonChar = cache((_ref = sequential(ColonChar, ColonChar), mutate("::")(_ref)));
  PipeChar = character('"|"', 124);
  EqualChar = character('"="', 61);
  MinusChar = character('"-"', 45);
  PlusChar = character('"+"', 43);
  PlusOrMinusChar = characters("[+\\-]", charsToFakeSet([43, 45]));
  Letter = characters("letter", charsToFakeSet([
    [65, 90],
    [97, 122],
    170,
    181,
    186,
    [192, 214],
    [216, 246],
    [248, 705],
    [710, 721],
    [736, 740],
    748,
    750,
    [880, 884],
    886,
    887,
    [890, 893],
    902,
    [904, 906],
    908,
    [910, 929],
    [931, 1013],
    [1015, 1153],
    [1162, 1317],
    [1329, 1366],
    1369,
    [1377, 1415],
    [1488, 1514],
    [1520, 1522],
    [1569, 1610],
    1646,
    1647,
    [1649, 1747],
    1749,
    1765,
    1766,
    1774,
    1775,
    [1786, 1788],
    1791,
    1808,
    [1810, 1839],
    [1869, 1957],
    1969,
    [1994, 2026],
    2036,
    2037,
    2042,
    [2048, 2069],
    2074,
    2084,
    2088,
    [2308, 2361],
    2365,
    2384,
    [2392, 2401],
    2417,
    2418,
    [2425, 2431],
    [2437, 2444],
    2447,
    2448,
    [2451, 2472],
    [2474, 2480],
    2482,
    [2486, 2489],
    2493,
    2510,
    2524,
    2525,
    [2527, 2529],
    2544,
    2545,
    [2565, 2570],
    2575,
    2576,
    [2579, 2600],
    [2602, 2608],
    2610,
    2611,
    2613,
    2614,
    2616,
    2617,
    [2649, 2652],
    2654,
    [2674, 2676],
    [2693, 2701],
    [2703, 2705],
    [2707, 2728],
    [2730, 2736],
    2738,
    2739,
    [2741, 2745],
    2749,
    2768,
    2784,
    2785,
    [2821, 2828],
    2831,
    2832,
    [2835, 2856],
    [2858, 2864],
    2866,
    2867,
    [2869, 2873],
    2877,
    2908,
    2909,
    [2911, 2913],
    2929,
    2947,
    [2949, 2954],
    [2958, 2960],
    [2962, 2965],
    2969,
    2970,
    2972,
    2974,
    2975,
    2979,
    2980,
    [2984, 2986],
    [2990, 3001],
    3024,
    [3077, 3084],
    [3086, 3088],
    [3090, 3112],
    [3114, 3123],
    [3125, 3129],
    3133,
    3160,
    3161,
    3168,
    3169,
    [3205, 3212],
    [3214, 3216],
    [3218, 3240],
    [3242, 3251],
    [3253, 3257],
    3261,
    3294,
    3296,
    3297,
    [3333, 3340],
    [3342, 3344],
    [3346, 3368],
    [3370, 3385],
    3389,
    3424,
    3425,
    [3450, 3455],
    [3461, 3478],
    [3482, 3505],
    [3507, 3515],
    3517,
    [3520, 3526],
    [3585, 3632],
    3634,
    3635,
    [3648, 3654],
    3713,
    3714,
    3716,
    3719,
    3720,
    3722,
    3725,
    [3732, 3735],
    [3737, 3743],
    [3745, 3747],
    3749,
    3751,
    3754,
    3755,
    [3757, 3760],
    3762,
    3763,
    3773,
    [3776, 3780],
    3782,
    3804,
    3805,
    3840,
    [3904, 3911],
    [3913, 3948],
    [3976, 3979],
    [4096, 4138],
    4159,
    [4176, 4181],
    [4186, 4189],
    4193,
    4197,
    4198,
    [4206, 4208],
    [4213, 4225],
    4238,
    [4256, 4293],
    [4304, 4346],
    4348,
    [4352, 4680],
    [4682, 4685],
    [4688, 4694],
    4696,
    [4698, 4701],
    [4704, 4744],
    [4746, 4749],
    [4752, 4784],
    [4786, 4789],
    [4792, 4798],
    4800,
    [4802, 4805],
    [4808, 4822],
    [4824, 4880],
    [4882, 4885],
    [4888, 4954],
    [4992, 5007],
    [5024, 5108],
    [5121, 5740],
    [5743, 5759],
    [5761, 5786],
    [5792, 5866],
    [5888, 5900],
    [5902, 5905],
    [5920, 5937],
    [5952, 5969],
    [5984, 5996],
    [5998, 6000],
    [6016, 6067],
    6103,
    6108,
    [6176, 6263],
    [6272, 6312],
    6314,
    [6320, 6389],
    [6400, 6428],
    [6480, 6509],
    [6512, 6516],
    [6528, 6571],
    [6593, 6599],
    [6656, 6678],
    [6688, 6740],
    6823,
    [6917, 6963],
    [6981, 6987],
    [7043, 7072],
    7086,
    7087,
    [7168, 7203],
    [7245, 7247],
    [7258, 7293],
    [7401, 7404],
    [7406, 7409],
    [7424, 7615],
    [7680, 7957],
    [7960, 7965],
    [7968, 8005],
    [8008, 8013],
    [8016, 8023],
    8025,
    8027,
    8029,
    [8031, 8061],
    [8064, 8116],
    [8118, 8124],
    8126,
    [8130, 8132],
    [8134, 8140],
    [8144, 8147],
    [8150, 8155],
    [8160, 8172],
    [8178, 8180],
    [8182, 8188],
    8305,
    8319,
    [8336, 8340],
    8450,
    8455,
    [8458, 8467],
    8469,
    [8473, 8477],
    8484,
    8486,
    8488,
    [8490, 8493],
    [8495, 8505],
    [8508, 8511],
    [8517, 8521],
    8526,
    8579,
    8580,
    [11264, 11310],
    [11312, 11358],
    [11360, 11492],
    [11499, 11502],
    [11520, 11557],
    [11568, 11621],
    11631,
    [11648, 11670],
    [11680, 11686],
    [11688, 11694],
    [11696, 11702],
    [11704, 11710],
    [11712, 11718],
    [11720, 11726],
    [11728, 11734],
    [11736, 11742],
    11823,
    12293,
    12294,
    [12337, 12341],
    12347,
    12348,
    [12353, 12438],
    [12445, 12447],
    [12449, 12538],
    [12540, 12543],
    [12549, 12589],
    [12593, 12686],
    [12704, 12727],
    [12784, 12799],
    [13312, 19893],
    [19968, 40907],
    [40960, 42124],
    [42192, 42237],
    [42240, 42508],
    [42512, 42527],
    42538,
    42539,
    [42560, 42591],
    [42594, 42606],
    [42623, 42647],
    [42656, 42725],
    [42775, 42783],
    [42786, 42888],
    42891,
    42892,
    [43003, 43009],
    [43011, 43013],
    [43015, 43018],
    [43020, 43042],
    [43072, 43123],
    [43138, 43187],
    [43250, 43255],
    43259,
    [43274, 43301],
    [43312, 43334],
    [43360, 43388],
    [43396, 43442],
    43471,
    [43520, 43560],
    [43584, 43586],
    [43588, 43595],
    [43616, 43638],
    43642,
    [43648, 43695],
    43697,
    43701,
    43702,
    [43705, 43709],
    43712,
    43714,
    [43739, 43741],
    [43968, 44002],
    [44032, 55203],
    [55216, 55238],
    [55243, 55291],
    [63744, 64045],
    [64048, 64109],
    [64112, 64217],
    [64256, 64262],
    [64275, 64279],
    64285,
    [64287, 64296],
    [64298, 64310],
    [64312, 64316],
    64318,
    64320,
    64321,
    64323,
    64324,
    [64326, 64433],
    [64467, 64829],
    [64848, 64911],
    [64914, 64967],
    [65008, 65019],
    [65136, 65140],
    [65142, 65262],
    [65264, 65276],
    [65313, 65338],
    [65345, 65370],
    [65382, 65470],
    [65474, 65479],
    [65482, 65487],
    [65490, 65495],
    [65498, 65500]
  ]));
  NumberChar = characters("number", charsToFakeSet([
    [48, 57],
    178,
    179,
    185,
    [188, 190],
    [1632, 1641],
    [1776, 1785],
    [1984, 1993],
    [2406, 2415],
    [2534, 2543],
    [2548, 2553],
    [2662, 2671],
    [2790, 2799],
    [2918, 2927],
    [3046, 3058],
    [3174, 3183],
    [3192, 3198],
    [3302, 3311],
    [3430, 3445],
    [3664, 3673],
    [3792, 3801],
    [3872, 3891],
    [4160, 4169],
    [4240, 4249],
    [4969, 4988],
    [5870, 5872],
    [6112, 6121],
    [6128, 6137],
    [6160, 6169],
    [6470, 6479],
    [6608, 6618],
    [6784, 6793],
    [6800, 6809],
    [6992, 7001],
    [7088, 7097],
    [7232, 7241],
    [7248, 7257],
    8304,
    [8308, 8313],
    [8320, 8329],
    [8528, 8578],
    [8581, 8585],
    [9312, 9371],
    [9450, 9471],
    [10102, 10131],
    11517,
    12295,
    [12321, 12329],
    [12344, 12346],
    [12690, 12693],
    [12832, 12841],
    [12881, 12895],
    [12928, 12937],
    [12977, 12991],
    [42528, 42537],
    [42726, 42735],
    [43056, 43061],
    [43216, 43225],
    [43264, 43273],
    [43472, 43481],
    [43600, 43609],
    [44016, 44025],
    [65296, 65305]
  ]));
  Underscore = character('"_"', 95);
  DollarSignChar = character('"$"', 36);
  AtSignChar = character('"@"', 64);
  HashSignChar = character('"#"', 35);
  PercentSignChar = character('"%"', 37);
  EqualSignChar = character('"="', 61);
  SymbolChar = characters("symbolic", charsToFakeSet([
    33,
    35,
    37,
    38,
    42,
    43,
    45,
    47,
    [60, 63],
    92,
    94,
    96,
    124,
    126,
    127,
    [128, 159],
    [161, 169],
    [171, 177],
    180,
    [182, 184],
    187,
    191,
    215,
    247,
    [706, 709],
    [722, 735],
    [741, 747],
    749,
    [751, 879],
    885,
    888,
    889,
    [894, 901],
    903,
    907,
    909,
    930,
    1014,
    [1154, 1161],
    [1318, 1328],
    1367,
    1368,
    [1370, 1376],
    [1416, 1487],
    [1515, 1519],
    [1523, 1568],
    [1611, 1631],
    [1642, 1645],
    1648,
    1748,
    [1750, 1764],
    [1767, 1773],
    1789,
    1790,
    [1792, 1807],
    1809,
    [1840, 1868],
    [1958, 1968],
    [1970, 1983],
    [2027, 2035],
    [2038, 2041],
    [2043, 2047],
    [2070, 2073],
    [2075, 2083],
    [2085, 2087],
    [2089, 2307],
    [2362, 2364],
    [2366, 2383],
    [2385, 2391],
    [2402, 2405],
    2416,
    [2419, 2424],
    [2432, 2436],
    2445,
    2446,
    2449,
    2450,
    2473,
    2481,
    [2483, 2485],
    [2490, 2492],
    [2494, 2509],
    [2511, 2523],
    2526,
    [2530, 2533],
    2546,
    2547,
    [2554, 2564],
    [2571, 2574],
    2577,
    2578,
    2601,
    2609,
    2612,
    2615,
    [2618, 2648],
    2653,
    [2655, 2661],
    2672,
    2673,
    [2677, 2692],
    2702,
    2706,
    2729,
    2737,
    2740,
    [2746, 2748],
    [2750, 2767],
    [2769, 2783],
    [2786, 2789],
    [2800, 2820],
    2829,
    2830,
    2833,
    2834,
    2857,
    2865,
    2868,
    [2874, 2876],
    [2878, 2907],
    2910,
    [2914, 2917],
    2928,
    [2930, 2946],
    2948,
    [2955, 2957],
    2961,
    [2966, 2968],
    2971,
    2973,
    [2976, 2978],
    [2981, 2983],
    [2987, 2989],
    [3002, 3023],
    [3025, 3045],
    [3059, 3076],
    3085,
    3089,
    3113,
    3124,
    [3130, 3132],
    [3134, 3159],
    [3162, 3167],
    [3170, 3173],
    [3184, 3191],
    [3199, 3204],
    3213,
    3217,
    3241,
    3252,
    [3258, 3260],
    [3262, 3293],
    3295,
    [3298, 3301],
    [3312, 3332],
    3341,
    3345,
    3369,
    [3386, 3388],
    [3390, 3423],
    [3426, 3429],
    [3446, 3449],
    [3456, 3460],
    [3479, 3481],
    3506,
    3516,
    3518,
    3519,
    [3527, 3584],
    3633,
    [3636, 3647],
    [3655, 3663],
    [3674, 3712],
    3715,
    3717,
    3718,
    3721,
    3723,
    3724,
    [3726, 3731],
    3736,
    3744,
    3748,
    3750,
    3752,
    3753,
    3756,
    3761,
    [3764, 3772],
    3774,
    3775,
    3781,
    [3783, 3791],
    3802,
    3803,
    [3806, 3839],
    [3841, 3871],
    [3892, 3903],
    3912,
    [3949, 3975],
    [3980, 4095],
    [4139, 4158],
    [4170, 4175],
    [4182, 4185],
    [4190, 4192],
    [4194, 4196],
    [4199, 4205],
    [4209, 4212],
    [4226, 4237],
    4239,
    [4250, 4255],
    [4294, 4303],
    4347,
    [4349, 4351],
    4681,
    4686,
    4687,
    4695,
    4697,
    4702,
    4703,
    4745,
    4750,
    4751,
    4785,
    4790,
    4791,
    4799,
    4801,
    4806,
    4807,
    4823,
    4881,
    4886,
    4887,
    [4955, 4968],
    [4989, 4991],
    [5008, 5023],
    [5109, 5120],
    5741,
    5742,
    [5787, 5791],
    [5867, 5869],
    [5873, 5887],
    5901,
    [5906, 5919],
    [5938, 5951],
    [5970, 5983],
    5997,
    [6001, 6015],
    [6068, 6102],
    [6104, 6107],
    [6109, 6111],
    [6122, 6127],
    [6138, 6157],
    6159,
    [6170, 6175],
    [6264, 6271],
    6313,
    [6315, 6319],
    [6390, 6399],
    [6429, 6469],
    6510,
    6511,
    [6517, 6527],
    [6572, 6592],
    [6600, 6607],
    [6619, 6655],
    [6679, 6687],
    [6741, 6783],
    [6794, 6799],
    [6810, 6822],
    [6824, 6916],
    [6964, 6980],
    [6988, 6991],
    [7002, 7042],
    [7073, 7085],
    [7098, 7167],
    [7204, 7231],
    [7242, 7244],
    [7294, 7400],
    7405,
    [7410, 7423],
    [7616, 7679],
    7958,
    7959,
    7966,
    7967,
    8006,
    8007,
    8014,
    8015,
    8024,
    8026,
    8028,
    8030,
    8062,
    8063,
    8117,
    8125,
    [8127, 8129],
    8133,
    [8141, 8143],
    8148,
    8149,
    [8156, 8159],
    [8173, 8177],
    8181,
    [8189, 8191],
    [8203, 8231],
    [8234, 8238],
    [8240, 8286],
    [8288, 8303],
    8306,
    8307,
    [8314, 8318],
    [8330, 8335],
    [8341, 8449],
    [8451, 8454],
    8456,
    8457,
    8468,
    [8470, 8472],
    [8478, 8483],
    8485,
    8487,
    8489,
    8494,
    8506,
    8507,
    [8512, 8516],
    [8522, 8525],
    8527,
    [8586, 9311],
    [9372, 9449],
    [9472, 10101],
    [10132, 11263],
    11311,
    11359,
    [11493, 11498],
    [11503, 11516],
    11518,
    11519,
    [11558, 11567],
    [11622, 11630],
    [11632, 11647],
    [11671, 11679],
    11687,
    11695,
    11703,
    11711,
    11719,
    11727,
    11735,
    [11743, 11822],
    [11824, 12287],
    [12289, 12292],
    [12296, 12320],
    [12330, 12336],
    12342,
    12343,
    [12349, 12352],
    [12439, 12444],
    12448,
    12539,
    [12544, 12548],
    [12590, 12592],
    [12687, 12689],
    [12694, 12703],
    [12728, 12783],
    [12800, 12831],
    [12842, 12880],
    [12896, 12927],
    [12938, 12976],
    [12992, 13311],
    [19894, 19967],
    [40908, 40959],
    [42125, 42191],
    42238,
    42239,
    [42509, 42511],
    [42540, 42559],
    42592,
    42593,
    [42607, 42622],
    [42648, 42655],
    [42736, 42774],
    42784,
    42785,
    42889,
    42890,
    [42893, 43002],
    43010,
    43014,
    43019,
    [43043, 43055],
    [43062, 43071],
    [43124, 43137],
    [43188, 43215],
    [43226, 43249],
    [43256, 43258],
    [43260, 43263],
    [43302, 43311],
    [43335, 43359],
    [43389, 43395],
    [43443, 43470],
    [43482, 43519],
    [43561, 43583],
    43587,
    [43596, 43599],
    [43610, 43615],
    [43639, 43641],
    [43643, 43647],
    43696,
    [43698, 43700],
    43703,
    43704,
    43710,
    43711,
    43713,
    [43715, 43738],
    [43742, 43967],
    [44003, 44015],
    [44026, 44031],
    [55204, 55215],
    [55239, 55242],
    [55292, 63743],
    64046,
    64047,
    64110,
    64111,
    [64218, 64255],
    [64263, 64274],
    [64280, 64284],
    64286,
    64297,
    64311,
    64317,
    64319,
    64322,
    64325,
    [64434, 64466],
    [64830, 64847],
    64912,
    64913,
    [64968, 65007],
    [65020, 65135],
    65141,
    [65277, 65295],
    [65306, 65312],
    [65339, 65344],
    [65371, 65381],
    [65471, 65473],
    65480,
    65481,
    65488,
    65489,
    65496,
    65497,
    [65501, 65535]
  ]));
  DoubleQuote = character("'\"'", 34);
  SingleQuote = character('"\'"', 39);
  TripleDoubleQuote = cache(multiple(DoubleQuote, 3, 3, true));
  TripleSingleQuote = cache(multiple(SingleQuote, 3, 3, true));
  SemicolonChar = character('";"', 59);
  AsterixChar = character('"*"', 42);
  CaretChar = character('"^"', 94);
  OpenSquareBracketChar = character('"["', 91);
  OpenCurlyBraceChar = character('"{"', 123);
  CloseCurlyBraceChar = character('"}"', 125);
  BackslashChar = character('"\\\\"', 92);
  CommaChar = character('","', 44);
  function AnyChar(parser, index) {
    var c, source;
    source = parser.source;
    if (index >= source.length) {
      return parser.fail("any", index);
    } else {
      c = source.charCodeAt(index);
      if (c === 13 && source.charCodeAt(+index + 1) === 10) {
        ++index;
        c = 10;
      }
      return Box(+index + 1, c);
    }
  }
  function Newline(parser, index) {
    var c, source;
    source = parser.source;
    c = source.charCodeAt(index);
    if (c === 13) {
      if (source.charCodeAt(+index + 1) === 10) {
        ++index;
        c = 10;
      }
    } else if (c !== 10 && c !== 8232 && c !== 8233) {
      return;
    }
    return Box(+index + 1, c);
  }
  function Eof(parser, index) {
    if (index >= parser.source.length) {
      return Box(index);
    }
  }
  CheckStop = cache(oneOf(Newline, Eof, function (parser, index) {
    return EmbeddedClose(parser, index) || EmbeddedCloseWrite(parser, index);
  }));
  MaybeComment = cache((function () {
    function SingleLineComment(parser, index) {
      var _ref, len, source;
      source = parser.source;
      if (source.charCodeAt(index) === 47 && source.charCodeAt(+index + 1) === 47) {
        len = source.length;
        index -= -2;
        for (; ; ++index) {
          if (index >= len || (_ref = source.charCodeAt(index)) === 13 || _ref === 10 || _ref === 8232 || _ref === 8233) {
            return Box(index);
          }
        }
      }
    }
    function MultiLineComment(parser, index) {
      var len, source, startIndex;
      source = parser.source;
      startIndex = index;
      if (source.charCodeAt(index) === 47 && source.charCodeAt(+index + 1) === 42 && source.charCodeAt(+index + 2) !== 33) {
        len = source.length;
        index -= -2;
        for (; ; ++index) {
          if (index >= len) {
            throw ParserError("Multi-line comment never ends", parser, startIndex);
          }
          if (source.charCodeAt(index) === 42 && source.charCodeAt(+index + 1) === 47) {
            return Space(parser, +index + 2);
          }
        }
      }
    }
    return maybe(oneOf(SingleLineComment, MultiLineComment));
  }()));
  Space = cache(sequential(SpaceChars, MaybeComment));
  function withSpace(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    return sequential(Space, ["this", rule]);
  }
  NoSpace = cache(except(SpaceChar));
  EmptyLine = cache(withSpace(Newline));
  EmptyLines = cache(zeroOrMore(EmptyLine, true));
  SomeEmptyLines = cache(oneOrMore(EmptyLine, true));
  NoSpaceNewline = cache(except(EmptyLine));
  OpenParenthesis = cache(withSpace(character('"("', 40)));
  CloseParenthesis = cache(withSpace(character('")"', 41)));
  OpenSquareBracket = cache(withSpace(OpenSquareBracketChar));
  CloseSquareBracket = cache(withSpace(character('"]"', 93)));
  OpenCurlyBrace = cache(withSpace(OpenCurlyBraceChar));
  CloseCurlyBrace = cache(withSpace(CloseCurlyBraceChar));
  EqualSign = cache(withSpace(EqualSignChar));
  PercentSign = cache(withSpace(PercentSignChar));
  DollarSign = cache(withSpace(DollarSignChar));
  Comma = cache(withSpace(CommaChar));
  MaybeComma = cache(maybe(Comma));
  CommaOrNewline = cache(oneOf(
    sequential(
      ["this", Comma],
      EmptyLines
    ),
    SomeEmptyLines
  ));
  MaybeCommaOrNewline = cache(maybe(CommaOrNewline));
  _SomeEmptyLinesWithCheckIndent = cache(sequential(SomeEmptyLines, CheckIndent));
  SomeEmptyLinesWithCheckIndent = cache(function (parser, index) {
    if (parser.options.noindent) {
      return EmptyLines(parser, index);
    } else {
      return _SomeEmptyLinesWithCheckIndent(parser, index);
    }
  });
  CommaOrSomeEmptyLinesWithCheckIndent = cache(oneOf(
    sequential(Comma, maybe(SomeEmptyLinesWithCheckIndent)),
    SomeEmptyLinesWithCheckIndent
  ));
  ExclamationPointChar = cache(character('"!"', 33));
  MaybeExclamationPointChar = cache(maybe(ExclamationPointChar));
  MaybeAtSignChar = cache(maybe(AtSignChar));
  Colon = cache(sequential(
    Space,
    ["this", ColonChar],
    except(ColonChar)
  ));
  ColonNewline = cache(sequential(Colon, Space, ["this", Newline]));
  NotColon = cache(except(Colon));
  NotColonUnlessNoIndentAndNewline = cache(function (parser, index) {
    var options;
    options = parser.options;
    if (options.noindent) {
      if (ColonNewline(parser, index)) {
        return Box(index);
      } else if (options.embedded && (ColonEmbeddedClose(parser, index) || ColonEmbeddedCloseWrite(parser, index))) {
        return Box(index);
      }
    }
    return NotColon(parser, index);
  });
  NameStart = cache(oneOf(Letter, Underscore, DollarSignChar));
  NameChar = cache(oneOf(NameStart, NumberChar));
  NamePart = cache(oneOrMore(NameChar));
  Nothing = cache(function (parser, index) {
    return Box(index, parser.Nothing(index));
  });
  Expression = function (parser, index) {
    return Expression(parser, index);
  };
  Statement = function (parser, index) {
    return Statement(parser, index);
  };
  Body = function (parser, index) {
    return Body(parser, index);
  };
  BodyNoEnd = function (parser, index) {
    return BodyNoEnd(parser, index);
  };
  Logic = function (parser, index) {
    return Logic(parser, index);
  };
  End = cache(function (parser, index) {
    if (parser.options.noindent) {
      return EndNoIndent(parser, index);
    } else {
      return Box(index);
    }
  });
  _Name = cache((_ref = separatedList(
    cons(NameStart, zeroOrMore(NameChar)),
    MinusChar,
    NamePart
  ), mutate(function (items) {
    var _arr, _i, _len, item, parts;
    parts = processCharCodes(items[0]);
    for (_arr = __toArray(items), _i = 1, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      parts.push(fromCharCode(item[0]).toUpperCase());
      processCharCodes(item, parts, 1);
    }
    return parts.join("");
  })(_ref)));
  Name = cache(withSpace(_Name));
  _Symbol = cache((_ref = oneOrMore(SymbolChar), mutate(codesToString)(_ref)));
  Symbol = cache(withSpace(_Symbol));
  ColonEqual = cache(withSpace((_ref = sequential(ColonChar, EqualSignChar), mutate(":=")(_ref))));
  NameOrSymbol = cache(withSpace(oneOf(
    (_ref = withSpace(oneOrMoreOf(_Name, _Symbol)), mutate(function (parts) {
      return parts.join("");
    })(_ref)),
    ColonEqual
  )));
  MacroName = cache(withSpace(sequential(
    ["this", NameOrSymbol],
    NotColonUnlessNoIndentAndNewline
  )));
  MacroNames = cache(separatedList.generic(String)(MacroName, Comma));
  UseMacro = cache(function (parser, index) {
    var m, name, result;
    name = MacroName(parser, index);
    if (!name) {
      return;
    }
    m = parser.getMacroByName(name.value);
    if (!m) {
      return;
    }
    result = m(parser, index);
    if (!result) {
      throw SHORT_CIRCUIT;
    }
    return result;
  });
  function ruleEqual(rule, text) {
    var failureMessage;
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    failureMessage = JSON.stringify(text);
    return function (parser, index) {
      var result;
      result = rule(parser, index);
      if (result && result.value === text) {
        return result;
      } else {
        return parser.fail(failureMessage, index);
      }
    };
  }
  function word(text) {
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    return ruleEqual(Name, text);
  }
  function symbol(text) {
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    return ruleEqual(Symbol, text);
  }
  function macroName(text) {
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    return ruleEqual(MacroName, text);
  }
  function wordOrSymbol(text) {
    var _arr, _len, _ref, i, part, parts;
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    parts = [Space];
    for (_arr = __toArray(text.split(/([a-z]+)/ig)), i = 0, _len = _arr.length; i < _len; ++i) {
      part = _arr[i];
      if (part) {
        parts.push(ruleEqual(
          i % 2 === 0 ? _Symbol : _Name,
          part
        ));
      }
    }
    _ref = sequential.apply(void 0, __toArray(parts));
    return mutate(text)(_ref);
  }
  INDENTS = (_o = __create(null), _o[9] = 4, _o[32] = 1, _o);
  _ref = zeroOrMore(SpaceChar);
  CountIndent = mutate(function (spaces) {
    var _arr, _i, c, count, indent;
    count = 0;
    for (_arr = __toArray(spaces), _i = _arr.length; _i--; ) {
      c = _arr[_i];
      indent = INDENTS[c];
      if (!indent) {
        throw Error("Unexpected indent char: " + __str(JSON.stringify(c)));
      }
      count += __num(indent);
    }
    return count;
  })(_ref);
  function IndentationRequired(parser, index) {
    if (!parser.options.noindent) {
      return Box(index);
    }
  }
  function CheckIndent(parser, index) {
    var count;
    count = CountIndent(parser, index);
    if (parser.options.noindent || count.value === parser.indent.peek()) {
      return count;
    }
  }
  function Advance(parser, index) {
    var count, countValue, indent;
    if (parser.options.noindent) {
      throw Error("Can't use Advance if in noindent mode");
    }
    count = CountIndent(parser, index);
    countValue = count.value;
    indent = parser.indent;
    if (!__lte(countValue, indent.peek())) {
      indent.push(countValue);
      return Box(index, countValue);
    }
  }
  function MaybeAdvance(parser, index) {
    var count;
    count = CountIndent(parser, index);
    parser.indent.push(count.value);
    return Box(index, count.value);
  }
  function PushFakeIndent(n) {
    if (typeof n !== "number") {
      throw TypeError("Expected n to be a Number, got " + __typeof(n));
    }
    return function (parser, index) {
      var indent;
      indent = parser.indent;
      indent.push(+indent.peek() + n);
      return Box(index, 0);
    };
  }
  function PopIndent(parser, index) {
    var indent;
    indent = parser.indent;
    if (indent.canPop()) {
      indent.pop();
      return Box(index);
    } else {
      throw ParserError("Unexpected dedent", parser, index);
    }
  }
  function retainIndent(rule) {
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    return function (parser, index) {
      var _end, count, i, indent;
      indent = parser.indent;
      count = indent.count();
      try {
        return rule(parser, index);
      } finally {
        for (i = __num(count), _end = __num(indent.count()); i < _end; ++i) {
          indent.pop();
        }
      }
    };
  }
  ThisLiteral = cache((_ref = word("this"), mutate(function (_p, parser, index) {
    return parser.This(index);
  })(_ref)));
  ThisShorthandLiteral = cache((_ref = withSpace(AtSignChar), mutate(function (_p, parser, index) {
    return parser.This(index);
  })(_ref)));
  ArgumentsLiteral = cache((_ref = word("arguments"), mutate(function (_p, parser, index) {
    return parser.Args(index);
  })(_ref)));
  ThisOrShorthandLiteral = cache(oneOf.generic(ThisNode)(ThisLiteral, ThisShorthandLiteral));
  ThisOrShorthandLiteralPeriod = cache(oneOf.generic(ThisNode)(
    sequential(
      ["this", ThisLiteral],
      Period
    ),
    sequential(
      ["this", ThisShorthandLiteral],
      maybe(Period)
    )
  ));
  getReservedIdents = (function () {
    var RESERVED_IDENTS, RESERVED_IDENTS_NOINDENT;
    RESERVED_IDENTS = [
      "as",
      "AST",
      "arguments",
      "break",
      "case",
      "catch",
      "class",
      "const",
      "continue",
      "debugger",
      "default",
      "delete",
      "do",
      "else",
      "enum",
      "eval",
      "export",
      "extends",
      "false",
      "finally",
      "for",
      "function",
      "if",
      "import",
      "Infinity",
      "instanceof",
      "in",
      "let",
      "macro",
      "mutable",
      "NaN",
      "new",
      "not",
      "null",
      "package",
      "private",
      "protected",
      "public",
      "return",
      "static",
      "super",
      "switch",
      "then",
      "this",
      "throw",
      "true",
      "try",
      "typeof",
      "undefined",
      "var",
      "void",
      "while",
      "with",
      "yield"
    ];
    RESERVED_IDENTS_NOINDENT = __toArray(RESERVED_IDENTS).concat(["end"]).sort();
    return function (options) {
      if (options && options.noindent) {
        return RESERVED_IDENTS_NOINDENT;
      } else {
        return RESERVED_IDENTS;
      }
    };
  }());
  MaybeSpreadToken = cache(maybe(withSpace((_ref = sequential(Period, Period, Period), mutate("...")(_ref)))));
  SpreadOrExpression = cache((_ref = sequential(
    ["spread", MaybeSpreadToken],
    ["node", Expression]
  ), mutate(function (_p, parser, index) {
    var node, spread;
    spread = _p.spread;
    node = _p.node;
    if (spread === "...") {
      return parser.Spread(index, node);
    } else {
      return node;
    }
  })(_ref)));
  ClosedArguments = cache(sequential(
    NoSpace,
    OpenParenthesis,
    Space,
    [
      "this",
      concat.generic(Node)(
        maybe(
          sequential(
            [
              "this",
              separatedList.generic(Node)(SpreadOrExpression, Comma)
            ],
            MaybeComma
          ),
          function () {
            return [];
          }
        ),
        maybe(
          retainIndent(sequential.generic(Array)(
            SomeEmptyLines,
            MaybeAdvance,
            [
              "this",
              maybe(
                sequential(CheckIndent, [
                  "this",
                  separatedList.generic(Node)(SpreadOrExpression, CommaOrSomeEmptyLinesWithCheckIndent)
                ]),
                function () {
                  return [];
                }
              )
            ],
            EmptyLines,
            MaybeCommaOrNewline,
            PopIndent
          )),
          function () {
            return [];
          }
        )
      )
    ],
    CloseParenthesis
  ));
  UnclosedArguments = cache(sequential(
    oneOf(
      sequential(SpaceChar, Space),
      check(Newline)
    ),
    [
      "this",
      concat.generic(Node)(
        separatedList.generic(Node)(SpreadOrExpression, Comma),
        oneOf.generic(Array)(
          sequential(IndentationRequired, Comma, SomeEmptyLines, [
            "this",
            retainIndent(sequential(
              Advance,
              CheckIndent,
              [
                "this",
                separatedList.generic(Node)(SpreadOrExpression, CommaOrSomeEmptyLinesWithCheckIndent)
              ],
              MaybeComma,
              PopIndent
            ))
          ]),
          mutate(function () {
            return [];
          })(MaybeComma)
        )
      )
    ]
  ));
  InvocationArguments = cache(oneOf(ClosedArguments, UnclosedArguments));
  Identifier = cache(oneOf(
    (_ref = sequential(
      function (parser, index) {
        if (parser.inAst.peek()) {
          return Box(index);
        }
      },
      DollarSign,
      NoSpace,
      ["this", InvocationArguments]
    ), mutate(function (args, parser, index) {
      return parser.Call(
        index,
        parser.Ident(index, "$"),
        args
      );
    })(_ref)),
    function (parser, index) {
      var name;
      name = Name(parser, index);
      if (!name || __in(name.value, getReservedIdents(parser.options)) || parser.hasMacroOrOperator(name.value)) {
        return parser.fail("identifier", index);
      } else {
        return Box(name.index, parser.Ident(index, name.value));
      }
    }
  ));
  function makeDigitsRule(digit) {
    var _ref;
    if (typeof digit !== "function") {
      throw TypeError("Expected digit to be a Function, got " + __typeof(digit));
    }
    return cache((_ref = separatedList(oneOrMore(digit), oneOrMore(Underscore, true)), mutate(function (parts) {
      var _arr, _i, _len, part, result;
      result = [];
      for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        part = _arr[_i];
        processCharCodes(part, result);
      }
      return result.join("");
    })(_ref)));
  }
  MaybeUnderscores = cache(zeroOrMore(Underscore, true));
  function parseRadixNumber(integer, fraction, radix, exponent) {
    var _i, _len, c, currentValue, i;
    if (typeof integer !== "string") {
      throw TypeError("Expected integer to be a String, got " + __typeof(integer));
    }
    if (typeof fraction !== "string") {
      throw TypeError("Expected fraction to be a String, got " + __typeof(fraction));
    }
    if (typeof radix !== "number") {
      throw TypeError("Expected radix to be a Number, got " + __typeof(radix));
    }
    if (exponent == null) {
      exponent = 0;
    } else if (typeof exponent !== "number") {
      throw TypeError("Expected exponent to be a Number, got " + __typeof(exponent));
    }
    if (exponent % 1 !== 0) {
      throw RangeError("Expected exponent to be an integer, got " + exponent);
    }
    while (exponent > 0) {
      integer += __strnum(fraction.charAt(0) || "0");
      fraction = fraction.substring(1);
      --exponent;
    }
    while (exponent < 0) {
      fraction = __strnum(integer.slice(-1)) + fraction;
      integer = integer.slice(0, -1);
      ++exponent;
    }
    currentValue = 0;
    for (_i = 0, _len = integer.length; _i < _len; ++_i) {
      c = integer.charAt(_i);
      currentValue = currentValue * radix + parseInt(c, radix);
    }
    if (fraction) {
      for (i = 0, _len = fraction.length; i < _len; ++i) {
        c = fraction.charAt(i);
        currentValue += parseInt(c, radix) / Math.pow(radix, i + 1);
      }
    }
    return currentValue;
  }
  DecimalNumber = cache((function () {
    var _ref, _ref2, DecimalDigits;
    DecimalDigits = makeDigitsRule(DecimalDigit);
    _ref = sequential(
      ["integer", DecimalDigits],
      [
        "fraction",
        maybe(
          sequential(MaybeUnderscores, Period, MaybeUnderscores, ["this", DecimalDigits]),
          ""
        )
      ],
      [
        "exponent",
        maybe(
          (_ref2 = sequential(
            characters("[Ee]", charsToFakeSet([69, 101])),
            ["sign", maybe(PlusOrMinusChar)],
            ["digits", DecimalDigits]
          ), mutate(function (_p) {
            var digits, e, sign;
            e = _p.e;
            sign = _p.sign;
            digits = _p.digits;
            return (sign ? fromCharCode(sign) : "") + __strnum(digits);
          })(_ref2)),
          ""
        )
      ],
      maybe(sequential(Underscore, maybe(NamePart)))
    );
    return mutate(function (_p, parser, index, endIndex) {
      var exponent, fraction, integer, value;
      integer = _p.integer;
      fraction = _p.fraction;
      exponent = _p.exponent;
      value = parseRadixNumber(integer, fraction, 10, exponent ? parseInt(exponent, 10) : 0);
      if (!isFinite(value)) {
        throw ParserError(
          "Unable to parse number " + __strnum(quote(parser.source.substring(index, endIndex))),
          parser,
          index
        );
      }
      return parser.Const(index, value);
    })(_ref);
  }()));
  function makeRadixNumber(radix, separator, digit) {
    var _ref, digits;
    if (typeof radix !== "number") {
      throw TypeError("Expected radix to be a Number, got " + __typeof(radix));
    }
    if (typeof separator !== "function") {
      throw TypeError("Expected separator to be a Function, got " + __typeof(separator));
    }
    if (typeof digit !== "function") {
      throw TypeError("Expected digit to be a Function, got " + __typeof(digit));
    }
    digits = makeDigitsRule(digit);
    _ref = sequential(
      Zero,
      ["separator", separator],
      SHORT_CIRCUIT,
      ["integer", digits],
      [
        "fraction",
        maybe(
          sequential(MaybeUnderscores, Period, MaybeUnderscores, ["this", digits]),
          ""
        )
      ],
      MaybeUnderscores
    );
    return mutate(function (_p, parser, index, endIndex) {
      var fraction, integer, separator, value;
      separator = _p.separator;
      integer = _p.integer;
      fraction = _p.fraction;
      value = parseRadixNumber(integer, fraction, radix);
      if (!isFinite(value)) {
        throw ParserError(
          "Unable to parse number " + __strnum(quote(parser.source.substring(index, endIndex))),
          parser,
          index
        );
      }
      return parser.Const(index, value);
    })(_ref);
  }
  HexDigit = characters("[0-9A-Fa-f]", charsToFakeSet([
    [48, 57],
    [65, 70],
    [97, 102]
  ]));
  HexNumber = cache(makeRadixNumber(
    16,
    characters("[Xx]", charsToFakeSet([88, 120])),
    HexDigit
  ));
  OctalDigit = characters("[0-7]", charsToFakeSet([[48, 55]]));
  OctalNumber = cache(makeRadixNumber(
    8,
    characters("[Oo]", charsToFakeSet([79, 111])),
    HexDigit
  ));
  BinaryDigit = characters("[01]", charsToFakeSet([48, 49]));
  BinaryNumber = cache(makeRadixNumber(
    2,
    characters("[Bb]", charsToFakeSet([66, 98])),
    HexDigit
  ));
  RadixNumber = cache((function () {
    var digitsCache, R, Radix;
    digitsCache = [];
    function getDigitsRule(radix) {
      var _ref;
      if ((_ref = digitsCache[radix]) == null) {
        return digitsCache[radix] = (function () {
          var _end, digit, i, letterEnd, name, set;
          switch (radix) {
          case 2:
            digit = BinaryDigit;
            break;
          case 8:
            digit = OctalDigit;
            break;
          case 10:
            digit = DecimalDigit;
            break;
          case 16:
            digit = HexDigit;
            break;
          default:
            set = __create(null);
            for (i = 0, _end = __num(radix) > 10 ? __num(radix) : 10; i < _end; ++i) {
              set[i + 48] = true;
            }
            for (i = 0, _end = (__num(radix) > 36 ? __num(radix) : 36) - 10; i < _end; ++i) {
              set[i + 65] = true;
              set[i + 97] = true;
            }
            name = ["[0-"];
            name.push(String.fromCharCode((__num(radix) > 9 ? __num(radix) : 9) + 48));
            if (__num(radix) >= 10) {
              letterEnd = (__num(radix) > 36 ? __num(radix) : 36) - 10;
              name.push("A-");
              name.push(String.fromCharCode(letterEnd + 65));
              name.push("a-");
              name.push(String.fromCharCode(letterEnd + 97));
            }
            name.push("]");
            digit = characters(name.join(""), set);
          }
          return makeDigitsRule(digit);
        }());
      } else {
        return _ref;
      }
    }
    Radix = multiple(DecimalDigit, 1, 2);
    R = characters("[Rr]", charsToFakeSet([82, 114]));
    return function (parser, index) {
      var currentIndex, digitsRule, fraction, integer, period, radix, radixNum, radixValue, separator, trailing, value;
      radix = Radix(parser, index);
      if (!radix) {
        return;
      }
      radixValue = codesToString(radix.value);
      separator = R(parser, radix.index);
      if (!separator) {
        return;
      }
      radixNum = parseInt(radixValue, 10);
      if (!isFinite(radixNum)) {
        throw ParserError("Unable to parse radix " + __strnum(quote(radixValue)), parser, index);
      } else if (radixNum < 2) {
        throw ParserError("Radix must be at least 2, got " + radixNum, parser, index);
      } else if (radixNum > 36) {
        throw ParserError("Radix must be at most 36, got " + radixNum, parser, index);
      }
      digitsRule = getDigitsRule(radixNum);
      integer = digitsRule(parser, separator.index);
      if (!integer) {
        parser.fail("integer after radix", separator.index);
        throw SHORT_CIRCUIT;
      }
      currentIndex = MaybeUnderscores(parser, integer.index).index;
      period = Period(parser, currentIndex);
      if (period) {
        fraction = digitsRule(parser, MaybeUnderscores(parser, period.index).index);
        if (fraction) {
          value = parseRadixNumber(integer.value, fraction.value, radixNum);
          currentIndex = fraction.index;
        }
      }
      if (value == null) {
        value = parseRadixNumber(integer.value, "", radixNum);
      }
      if (!isFinite(value)) {
        throw ParserError(
          "Unable to parse number " + __strnum(quote(parser.source.substring(index, currentIndex))),
          parser,
          index
        );
      }
      trailing = MaybeUnderscores(parser, currentIndex);
      return Box(trailing.index, parser.Const(index, value));
    };
  }()));
  NumberLiteral = cache(withSpace(oneOf(
    HexNumber,
    OctalNumber,
    BinaryNumber,
    RadixNumber,
    DecimalNumber
  )));
  IdentifierNameConst = cache(function (parser, index) {
    var name;
    name = Name(parser, index);
    if (name) {
      return Box(name.index, parser.Const(index, name.value));
    }
  });
  IdentifierNameConstOrNumberLiteral = cache(oneOf(IdentifierNameConst, NumberLiteral));
  function makeConstLiteral(name, value) {
    var _ref;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    _ref = word(name);
    return mutate(function (_p, parser, index) {
      return parser.Const(index, value);
    })(_ref);
  }
  NullLiteral = cache(makeConstLiteral("null", null));
  VoidLiteral = cache(oneOf(
    makeConstLiteral("undefined", void 0),
    makeConstLiteral("void", void 0)
  ));
  InfinityLiteral = cache(makeConstLiteral("Infinity", 1/0));
  NaNLiteral = cache(makeConstLiteral("NaN", 0/0));
  TrueLiteral = cache(makeConstLiteral("true", true));
  FalseLiteral = cache(makeConstLiteral("false", false));
  SimpleConstantLiteral = cache(oneOf(
    NullLiteral,
    VoidLiteral,
    InfinityLiteral,
    NaNLiteral,
    TrueLiteral,
    FalseLiteral
  ));
  HexEscapeSequence = cache((_ref = sequential(
    character('"x"', 120),
    SHORT_CIRCUIT,
    [
      "this",
      multiple(HexDigit, 2, 2)
    ]
  ), mutate(function (digits) {
    return parseInt(codesToString(digits), 16);
  })(_ref)));
  UnicodeEscapeSequence = cache(sequential(
    character('"u"', 117),
    SHORT_CIRCUIT,
    [
      "this",
      oneOf(
        (_ref = multiple(HexDigit, 4, 4), mutate(function (digits) {
          return parseInt(codesToString(digits), 16);
        })(_ref)),
        (_ref = sequential(
          OpenCurlyBraceChar,
          [
            "this",
            multiple(HexDigit, 1, 6)
          ],
          CloseCurlyBraceChar
        ), mutate(function (digits, parser, index) {
          var inner, value;
          inner = codesToString(digits);
          value = parseInt(inner, 16);
          if (value > 1114111) {
            throw ParserError("Unicode escape sequence too large: '\\u{" + inner + "}'", parser, index);
          }
          return value;
        })(_ref))
      )
    ]
  ));
  SingleEscapeCharacter = cache((function () {
    var _o, ESCAPED_CHARACTERS;
    ESCAPED_CHARACTERS = (_o = __create(null), _o[98] = 8, _o[102] = 12, _o[114] = 13, _o[110] = 10, _o[116] = 9, _o[118] = 11, _o);
    return oneOf(mutate(0)(Zero), mutate(function (c) {
      return ESCAPED_CHARACTERS[c] || c;
    })(AnyChar));
  }()));
  BackslashEscapeSequence = cache(sequential(BackslashChar, SHORT_CIRCUIT, [
    "this",
    oneOf(HexEscapeSequence, UnicodeEscapeSequence, SingleEscapeCharacter)
  ]));
  inExpression = makeAlterStack.generic(String)("position", "expression");
  inStatement = makeAlterStack.generic(String)("position", "statement");
  AssignmentAsExpression = cache(inExpression(function (parser, index) {
    return Assignment(parser, index);
  }));
  ExpressionOrAssignment = cache(oneOf(AssignmentAsExpression, Expression));
  StringInterpolation = cache(sequential(DollarSignChar, NoSpace, SHORT_CIRCUIT, [
    "this",
    oneOf(Identifier, sequential(
      OpenParenthesis,
      [
        "this",
        oneOf(Expression, Nothing)
      ],
      CloseParenthesis
    ))
  ]));
  SingleStringLiteral = cache((_ref = sequential(
    SingleQuote,
    SHORT_CIRCUIT,
    [
      "this",
      zeroOrMoreOf(BackslashEscapeSequence, anyExcept(oneOf(SingleQuote, Newline)))
    ],
    SingleQuote
  ), mutate(function (codes, parser, index) {
    return parser.Const(index, codesToString(codes));
  })(_ref)));
  DoubleStringLiteralInner = cache(zeroOrMoreOf(BackslashEscapeSequence, StringInterpolation, anyExcept(oneOf(DoubleQuote, Newline))));
  function doubleStringLiteralHandler(parts, parser, index) {
    var _arr, _i, _len, currentLiteral, part, stringParts;
    stringParts = [];
    currentLiteral = [];
    for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      part = _arr[_i];
      if (typeof part === "number") {
        currentLiteral.push(part);
      } else if (!(part instanceof NothingNode)) {
        stringParts.push(parser.Const(index, codesToString(currentLiteral)));
        currentLiteral = [];
        stringParts.push(part);
      }
    }
    if (currentLiteral.length > 0) {
      stringParts.push(parser.Const(index, codesToString(currentLiteral)));
    }
    return stringParts;
  }
  DoubleStringLiteral = cache((_ref = sequential(
    DoubleQuote,
    SHORT_CIRCUIT,
    ["this", DoubleStringLiteralInner],
    DoubleQuote
  ), mutate(function (parts, parser, index) {
    var _arr, _arr2, _i, _len, part, stringParts;
    for (_arr = [], _arr2 = __toArray(doubleStringLiteralHandler(parts, parser, index)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
      part = _arr2[_i];
      if (!part.isConstValue("")) {
        _arr.push(part);
      }
    }
    stringParts = _arr;
    if (stringParts.length === 0) {
      return parser.Const(index, "");
    } else if (stringParts.length === 1 && stringParts[0].isConstType("string")) {
      return stringParts[0];
    } else {
      return parser.string(index, stringParts);
    }
  })(_ref)));
  DoubleStringArrayLiteral = cache((_ref = sequential(
    PercentSignChar,
    DoubleQuote,
    SHORT_CIRCUIT,
    ["this", DoubleStringLiteralInner],
    DoubleQuote
  ), mutate(function (parts, parser, index) {
    var stringParts;
    stringParts = doubleStringLiteralHandler(parts, parser, index);
    return parser.Array(index, stringParts);
  })(_ref)));
  StringIndent = cache(function (parser, index) {
    var c, count, currentIndent, currentIndex, indentValue;
    count = 0;
    currentIndent = parser.indent.peek();
    currentIndex = index;
    while (count < __num(currentIndent)) {
      c = SpaceChar(parser, currentIndex);
      if (!c) {
        break;
      }
      currentIndex = c.index;
      indentValue = INDENTS[c.value];
      if (!indentValue) {
        throw Error("Unexpected indent char: " + __str(JSON.stringify(c.value)));
      }
      count += +indentValue;
    }
    if (count > __num(currentIndent)) {
      throw ParserError("Mixed tabs and spaces in string literal", parser, currentIndex);
    } else if (count === currentIndent || Newline(parser, currentIndex)) {
      return Box(currentIndex, count);
    }
  });
  if (typeof String.prototype.trimRight === "function") {
    trimRight = function (x) {
      return x.trimRight();
    };
  } else {
    trimRight = function (x) {
      return x.replace(/\s+$/, "");
    };
  }
  TripleSingleStringLine = cache((_ref = zeroOrMoreOf(BackslashEscapeSequence, anyExcept(oneOf(TripleSingleQuote, Newline))), mutate(function (codes) {
    return [trimRight(codesToString(codes))];
  })(_ref)));
  TripleDoubleStringLine = cache((_ref = zeroOrMoreOf(BackslashEscapeSequence, StringInterpolation, anyExcept(oneOf(TripleDoubleQuote, Newline))), mutate(function (parts) {
    var _arr, _i, _len, currentLiteral, part, stringParts;
    stringParts = [];
    currentLiteral = [];
    for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      part = _arr[_i];
      if (typeof part === "number") {
        currentLiteral.push(part);
      } else if (!(part instanceof NothingNode)) {
        if (currentLiteral.length > 0) {
          stringParts.push(codesToString(currentLiteral));
          currentLiteral = [];
        }
        stringParts.push(part);
      }
    }
    if (currentLiteral.length > 0) {
      stringParts.push(trimRight(codesToString(currentLiteral)));
    }
    return stringParts;
  })(_ref)));
  function tripleStringHandler(x, parser, index) {
    var _end, _len, i, j, len, line, lines, part, stringParts;
    lines = [x.first];
    if (lines[0].length === 0 || lines[0].length === 1 && lines[0][0] === "") {
      lines.shift();
    }
    for (j = 1, _end = __num(x.numEmptyLines); j < _end; ++j) {
      lines.push([""]);
    }
    lines.push.apply(lines, __toArray(x.rest));
    len = lines.length;
    if (len > 0 && (lines[len - 1].length === 0 || lines[len - 1].length === 1 && lines[len - 1][0] === "")) {
      lines.pop();
      --len;
    }
    stringParts = [];
    for (j = 0, _len = lines.length; j < _len; ++j) {
      line = lines[j];
      if (j > 0) {
        stringParts.push("\n");
      }
      stringParts.push.apply(stringParts, __toArray(line));
    }
    for (i = stringParts.length - 2; i >= 0; --i) {
      if (typeof stringParts[i] === "string" && typeof stringParts[i + 1] === "string") {
        stringParts.splice(i, 2, "" + stringParts[i] + stringParts[i + 1]);
      }
    }
    for (i = 0, _len = stringParts.length; i < _len; ++i) {
      part = stringParts[i];
      if (typeof part === "string") {
        stringParts[i] = parser.Const(index, part);
      }
    }
    return stringParts;
  }
  function makeTripleString(quote, line) {
    var _ref;
    if (typeof quote !== "function") {
      throw TypeError("Expected quote to be a Function, got " + __typeof(quote));
    }
    if (typeof line !== "function") {
      throw TypeError("Expected line to be a Function, got " + __typeof(line));
    }
    _ref = sequential(
      quote,
      SHORT_CIRCUIT,
      ["first", line],
      [
        "numEmptyLines",
        zeroOrMore(
          sequential(Space, ["this", Newline]),
          true
        )
      ],
      [
        "rest",
        maybe(
          retainIndent(sequential(
            MaybeAdvance,
            [
              "this",
              maybe(
                separatedList(
                  sequential(StringIndent, ["this", line]),
                  Newline
                ),
                function () {
                  return [];
                }
              )
            ],
            maybe(Newline),
            PopIndent
          )),
          function () {
            return [];
          }
        )
      ],
      quote
    );
    return mutate(function (parts, parser, index) {
      var _arr, _arr2, _i, _len, part, stringParts;
      for (_arr = [], _arr2 = __toArray(tripleStringHandler(parts, parser, index)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        part = _arr2[_i];
        if (!part.isConstValue("")) {
          _arr.push(part);
        }
      }
      stringParts = _arr;
      if (stringParts.length === 0) {
        return parser.Const(index, "");
      } else if (stringParts.length === 1 && stringParts[0].isConstType("string")) {
        return stringParts[0];
      } else {
        return parser.string(index, stringParts);
      }
    })(_ref);
  }
  TripleSingleStringLiteral = cache(makeTripleString(TripleSingleQuote, TripleSingleStringLine));
  TripleDoubleStringLiteral = cache(makeTripleString(TripleDoubleQuote, TripleDoubleStringLine));
  TripleDoubleStringArrayLiteral = cache((_ref = sequential(
    PercentSignChar,
    TripleDoubleQuote,
    SHORT_CIRCUIT,
    ["first", TripleDoubleStringLine],
    [
      "numEmptyLines",
      zeroOrMore(
        sequential(Space, ["this", Newline]),
        true
      )
    ],
    [
      "rest",
      maybe(
        retainIndent(sequential(
          MaybeAdvance,
          [
            "this",
            maybe(
              sequential(StringIndent, [
                "this",
                separatedList(TripleDoubleStringLine, sequential(Newline, StringIndent))
              ]),
              function () {
                return [];
              }
            )
          ],
          maybe(Newline),
          PopIndent
        )),
        function () {
          return [];
        }
      )
    ],
    TripleDoubleQuote
  ), mutate(function (parts, parser, index) {
    var stringParts;
    stringParts = tripleStringHandler(parts, parser, index);
    return parser.Array(index, stringParts);
  })(_ref)));
  BackslashStringLiteral = cache(sequential(BackslashChar, NoSpace, ["this", IdentifierNameConst]));
  StringLiteral = cache(withSpace(oneOf(
    BackslashStringLiteral,
    TripleSingleStringLiteral,
    TripleDoubleStringLiteral,
    TripleDoubleStringArrayLiteral,
    SingleStringLiteral,
    DoubleStringLiteral,
    DoubleStringArrayLiteral
  )));
  RegexLiteral = cache((function () {
    var _ref, _ref2, LowerR, NOTHING, RegexComment, RegexFlags, RegexSpace;
    LowerR = character('"r"', 114);
    _ref = zeroOrMore(NameChar);
    RegexFlags = mutate(codesToString)(_ref);
    NOTHING = {};
    _ref = sequential(HashSignChar, zeroOrMore(anyExcept(Newline), true));
    RegexComment = mutate(NOTHING)(_ref);
    _ref = oneOf(SpaceChar, Newline);
    RegexSpace = mutate(NOTHING)(_ref);
    return withSpace((_ref = sequential(
      LowerR,
      [
        "text",
        oneOf(
          sequential(
            TripleDoubleQuote,
            SHORT_CIRCUIT,
            [
              "this",
              zeroOrMoreOf(
                (_ref2 = sequential(BackslashChar, DollarSignChar), mutate(36)(_ref2)),
                RegexSpace,
                RegexComment,
                StringInterpolation,
                anyExcept(TripleDoubleQuote)
              )
            ],
            TripleDoubleQuote
          ),
          sequential(
            TripleSingleQuote,
            SHORT_CIRCUIT,
            [
              "this",
              zeroOrMoreOf(RegexSpace, RegexComment, anyExcept(TripleSingleQuote))
            ],
            TripleSingleQuote
          ),
          sequential(
            DoubleQuote,
            SHORT_CIRCUIT,
            [
              "this",
              zeroOrMoreOf(
                (_ref2 = sequential(DoubleQuote, DoubleQuote), mutate(34)(_ref2)),
                (_ref2 = sequential(BackslashChar, DollarSignChar), mutate(36)(_ref2)),
                StringInterpolation,
                anyExcept(oneOf(DoubleQuote, Newline, DollarSignChar))
              )
            ],
            DoubleQuote
          ),
          sequential(
            SingleQuote,
            SHORT_CIRCUIT,
            [
              "this",
              zeroOrMoreOf(
                (_ref2 = sequential(SingleQuote, SingleQuote), mutate(39)(_ref2)),
                anyExcept(oneOf(SingleQuote, Newline))
              )
            ],
            SingleQuote
          )
        )
      ],
      ["flags", RegexFlags]
    ), mutate(function (_p, parser, index) {
      var _arr, _i, _len, currentLiteral, flag, flags, part, seenFlags, stringParts, text;
      text = _p.text;
      flags = _p.flags;
      stringParts = [];
      currentLiteral = [];
      for (_arr = __toArray(text), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        part = _arr[_i];
        if (typeof part === "number") {
          currentLiteral.push(part);
        } else if (part !== NOTHING && !(part instanceof NothingNode)) {
          if (currentLiteral.length > 0) {
            stringParts.push(parser.Const(index, codesToString(currentLiteral)));
            currentLiteral = [];
          }
          stringParts.push(part);
        }
      }
      if (currentLiteral.length > 0) {
        stringParts.push(parser.Const(index, codesToString(currentLiteral)));
      }
      if (stringParts.length === 0) {
        text = parser.Const(index, "");
      } else if (stringParts.length === 1 && stringParts[0].isConstType("string")) {
        text = stringParts[0];
      } else {
        text = parser.string(index, stringParts);
      }
      if (text.isConst()) {
        try {
          RegExp(String(text.constValue()));
        } catch (e) {
          throw ParserError(e.message, parser, index);
        }
      }
      seenFlags = [];
      for (_arr = __toArray(flags), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        flag = _arr[_i];
        if (__in(flag, seenFlags)) {
          throw ParserError("Invalid regular expression: flag " + __strnum(quote(flag)) + " occurred more than once", parser, index);
        } else if (flag !== "g" && flag !== "i" && flag !== "m" && flag !== "y") {
          throw ParserError("Invalid regular expression: unknown flag " + __strnum(quote(flag)), parser, index);
        }
        seenFlags.push(flag);
      }
      return parser.Regexp(index, text, flags);
    })(_ref)));
  }()));
  ConstantLiteral = cache(oneOf(SimpleConstantLiteral, NumberLiteral, StringLiteral, RegexLiteral));
  Literal = cache(oneOf(ThisOrShorthandLiteral, ArgumentsLiteral, ConstantLiteral));
  MaybeNotToken = cache(maybe(word("not")));
  MaybeQuestionMarkChar = cache(maybe(character('"?"', 63)));
  GeneratorBody = cache(makeAlterStack.generic(Boolean)("inGenerator", true)(Body));
  GeneratorBodyNoEnd = cache(makeAlterStack.generic(Boolean)("inGenerator", true)(BodyNoEnd));
  LessThanChar = character('"<"', 60);
  LessThan = cache(withSpace(LessThanChar));
  GreaterThanChar = character('">"', 62);
  GreaterThan = cache(withSpace(GreaterThanChar));
  FunctionGlyph = cache(sequential(Space, MinusChar, GreaterThanChar));
  _FunctionBody = cache(oneOf.generic(Node)(
    sequential(FunctionGlyph, [
      "this",
      oneOf(Statement, Nothing)
    ]),
    Body
  ));
  FunctionBody = cache(makeAlterStack.generic(Boolean)("inGenerator", false)(_FunctionBody));
  GeneratorFunctionBody = cache(makeAlterStack.generic(Boolean)("inGenerator", true)(_FunctionBody));
  IdentifierOrSimpleAccessStart = cache(oneOf(
    Identifier,
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteralPeriod],
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (_p, parser, index) {
      var child, parent;
      parent = _p.parent;
      child = _p.child;
      return parser.Access(index, parent, child);
    })(_ref)),
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteral],
      DoubleColonChar,
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (_p, parser, index) {
      var child, parent;
      parent = _p.parent;
      child = _p.child;
      return parser.Access(
        index,
        parser.Access(index, parent, parser.Const(index, "prototype")),
        child
      );
    })(_ref)),
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteral],
      ["isProto", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      ["child", Expression],
      CloseSquareBracket
    ), mutate(function (_p, parser, index) {
      var child, isProto, parent;
      parent = _p.parent;
      isProto = _p.isProto;
      child = _p.child;
      return parser.Access(
        index,
        isProto
          ? parser.Access(index, parent, parser.Const(index, "prototype"))
          : parent,
        child
      );
    })(_ref))
  ));
  PeriodOrDoubleColonChar = cache(oneOf(Period, DoubleColonChar));
  IdentifierOrSimpleAccessPart = cache((_ref = oneOf(
    sequential(
      ["type", PeriodOrDoubleColonChar],
      ["child", IdentifierNameConstOrNumberLiteral]
    ),
    sequential(
      ["type", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      ["child", Expression],
      CloseSquareBracket
    )
  ), mutate(function (_p, parser, childIndex) {
    var child, isProto, type;
    type = _p.type;
    child = _p.child;
    isProto = type === "::";
    return function (parent, parser, index) {
      return parser.Access(
        index,
        isProto
          ? parser.Access(index, parent, parser.Const(childIndex, "prototype"))
          : parent,
        child
      );
    };
  })(_ref)));
  IdentifierOrSimpleAccess = cache((_ref = sequential(
    ["head", IdentifierOrSimpleAccessStart],
    ["tail", zeroOrMore(IdentifierOrSimpleAccessPart)]
  ), mutate(function (parts, parser, index) {
    var _arr, _i, _len, acc, creator;
    acc = parts.head;
    for (_arr = __toArray(parts.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      creator = _arr[_i];
      acc = creator(acc, parser, index);
    }
    return acc;
  })(_ref)));
  IdentifierOrAccess = cache(function (parser, index) {
    var node, value;
    node = InvocationOrAccess(parser, index);
    if (!node) {
      return;
    }
    value = node.value;
    if (value instanceof IdentNode || value instanceof AccessNode) {
      return node;
    }
  });
  inFunctionTypeParams = makeAlterStack.generic(Boolean)("inFunctionTypeParams", true);
  notInFunctionTypeParams = makeAlterStack.generic(Boolean)("inFunctionTypeParams", false);
  TypeReference = function (parser, index) {
    return TypeReference(parser, index);
  };
  ArrayType = cache((_ref = sequential(
    OpenSquareBracket,
    ["this", maybe(TypeReference)],
    CloseSquareBracket
  ), mutate(function (subtype, parser, index) {
    var arrayIdent;
    arrayIdent = parser.Ident(index, "Array");
    if (subtype) {
      return parser.TypeGeneric(index, arrayIdent, [subtype]);
    } else {
      return arrayIdent;
    }
  })(_ref)));
  ObjectTypePair = cache(sequential(
    [
      "key",
      function (parser, index) {
        return ConstObjectKey(parser, index);
      }
    ],
    Colon,
    ["value", TypeReference]
  ));
  ObjectType = cache((_ref = sequential(
    OpenCurlyBrace,
    [
      "this",
      maybe(
        separatedList(ObjectTypePair, CommaOrNewline),
        function () {
          return [];
        }
      )
    ],
    MaybeComma,
    CloseCurlyBrace
  ), mutate(function (pairs, parser, index) {
    var _arr, _i, _len, key, keys, keyValue;
    if (pairs.length === 0) {
      return parser.Ident(index, "Object");
    } else {
      keys = [];
      for (_arr = __toArray(pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        key = _arr[_i].key;
        if (!key.isConst()) {
          throw ParserError("Expected a constant key, got " + __typeof(key), parser, key.index);
        } else {
          keyValue = String(key.constValue());
          if (__in(keyValue, keys)) {
            throw ParserError("Duplicate object key: " + __strnum(quote(keyValue)), parser, key.index);
          }
          keys.push(keyValue);
        }
      }
      return parser.TypeObject(index, pairs);
    }
  })(_ref)));
  _ref = sequential(
    oneOf(
      sequential(
        OpenParenthesis,
        separatedList(TypeReference, CommaOrNewline),
        CloseParenthesis
      ),
      inFunctionTypeParams(TypeReference),
      Nothing
    ),
    FunctionGlyph,
    ["this", maybe(TypeReference)]
  );
  FunctionType = mutate(function (returnType, parser, index) {
    var functionIdent;
    functionIdent = parser.Ident(index, "Function");
    if (returnType) {
      return parser.TypeGeneric(index, functionIdent, [returnType]);
    } else {
      return functionIdent;
    }
  })(_ref);
  NonUnionType = oneOf(
    function (parser, index) {
      if (!parser.inFunctionTypeParams.peek()) {
        return FunctionType(parser, index);
      }
    },
    sequential(
      OpenParenthesis,
      [
        "this",
        notInFunctionTypeParams(function (parser, index) {
          return TypeReference(parser, index);
        })
      ],
      CloseParenthesis
    ),
    ArrayType,
    ObjectType,
    VoidLiteral,
    NullLiteral,
    (_ref = sequential(
      ["base", IdentifierOrSimpleAccess],
      [
        "args",
        maybe(
          sequential(
            character('"<"', 60),
            SHORT_CIRCUIT,
            [
              "this",
              separatedList(
                function (parser, index) {
                  return TypeReference(parser, index);
                },
                Comma
              )
            ],
            Space,
            character('">"', 62)
          ),
          function () {
            return [];
          }
        )
      ]
    ), mutate(function (_p, parser, index) {
      var args, base;
      base = _p.base;
      args = _p.args;
      if (!args.length) {
        return base;
      } else {
        return parser.TypeGeneric(index, base, args);
      }
    })(_ref))
  );
  Pipe = cache(withSpace(PipeChar));
  TypeReference = cache((_ref = separatedList(NonUnionType, Pipe), mutate(function (types, parser, index) {
    var _arr, i, type;
    types = types.slice();
    for (_arr = __toArray(types), i = _arr.length; i--; ) {
      type = _arr[i];
      if (type instanceof TypeUnionNode) {
        types.splice.apply(types, [i, 1].concat(__toArray(type.types)));
      }
    }
    if (types.length === 1) {
      return types[0];
    } else {
      return parser.TypeUnion(index, types);
    }
  })(_ref)));
  MaybeAsType = cache(maybe(sequential(word("as"), SHORT_CIRCUIT, ["this", TypeReference])));
  BracketedObjectKey = cache(sequential(
    OpenSquareBracket,
    ["this", ExpressionOrAssignment],
    CloseSquareBracket
  ));
  ConstObjectKey = cache(oneOf(
    StringLiteral,
    mutate(function (node, parser, index) {
      return parser.Const(index, String(node.constValue()));
    })(NumberLiteral),
    IdentifierNameConst
  ));
  ObjectKey = cache(oneOf(BracketedObjectKey, ConstObjectKey));
  ObjectKeyColon = cache(sequential(
    ["this", ObjectKey],
    Colon,
    except(EqualChar),
    function (parser, index) {
      if (parser.options.noindent) {
        if (EmptyLine(parser, index)) {
          return;
        } else if (parser.options.embedded && (EmbeddedClose(parser, index) || EmbeddedCloseWrite(parser, index) || EmbeddedCloseComment(parser, index))) {
          return;
        }
      }
      return Box(index);
    }
  ));
  function mutateFunction(node, parser, index) {
    var mutateFunctionMacro;
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
    }
    mutateFunctionMacro = parser.getMacroByLabel("mutateFunction");
    if (!mutateFunctionMacro) {
      return node;
    } else {
      return mutateFunctionMacro.func(
        { op: "", node: node },
        parser,
        index
      );
    }
  }
  function validateSpreadParameters(params, parser) {
    var _arr, _i, _len, param, spreadCount;
    spreadCount = 0;
    for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      param = _arr[_i];
      if (param instanceof ParamNode && param.spread) {
        ++spreadCount;
        if (spreadCount > 1) {
          throw ParserError("Cannot have more than one spread parameter", parser, parser.indexFromPosition(param.line, param.column));
        }
      }
    }
    return params;
  }
  function removeTrailingNothings(array) {
    var last;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be an Array, got " + __typeof(array));
    }
    while (array.length) {
      last = array[array.length - 1];
      if (!(last instanceof NothingNode)) {
        break;
      }
      array.pop();
    }
    return array;
  }
  IdentifierOrThisAccess = cache(oneOf(Identifier, (_ref = sequential(
    ["parent", ThisOrShorthandLiteralPeriod],
    ["child", IdentifierNameConst]
  ), mutate(function (_p, parser, index) {
    var child, parent;
    parent = _p.parent;
    child = _p.child;
    return parser.Access(index, parent, child);
  })(_ref))));
  IdentifierParameter = cache((_ref = sequential(
    ["isMutable", bool(maybe(word("mutable")))],
    ["spread", bool(MaybeSpreadToken)],
    ["ident", IdentifierOrThisAccess],
    ["asType", MaybeAsType],
    [
      "defaultValue",
      maybe(sequential(EqualSign, ["this", Expression]))
    ]
  ), mutate(function (_p, parser, index) {
    var asType, defaultValue, ident, isMutable, spread;
    isMutable = _p.isMutable;
    spread = _p.spread;
    ident = _p.ident;
    asType = _p.asType;
    defaultValue = _p.defaultValue;
    if (spread && defaultValue) {
      throw ParserError("Cannot specify a default value for a spread parameter", parser, index);
    }
    return parser.Param(
      index,
      ident,
      defaultValue,
      spread,
      isMutable,
      asType
    );
  })(_ref)));
  Parameter = function (parser, index) {
    return Parameter(parser, index);
  };
  ArrayParameter = cache((_ref = sequential(
    OpenSquareBracket,
    EmptyLines,
    [
      "this",
      function (parser, index) {
        return Parameters(parser, index);
      }
    ],
    EmptyLines,
    CloseSquareBracket
  ), mutate(function (params, parser, index) {
    return parser.Array(index, params);
  })(_ref)));
  ParamDualObjectKey = cache(sequential(
    ["key", ObjectKeyColon],
    ["value", Parameter]
  ));
  ParamSingularObjectKey = cache((_ref = sequential(
    ["this", IdentifierParameter],
    NotColon
  ), mutate(function (param, parser, index) {
    var ident, key;
    ident = param.ident;
    if (ident instanceof IdentNode) {
      key = parser.Const(index, ident.name);
    } else if (ident instanceof AccessNode) {
      key = ident.child;
    } else {
      throw Error("Unknown object key type: " + __strnum(param.type));
    }
    return { key: key, value: param };
  })(_ref)));
  KvpParameter = cache(maybe(oneOf(ParamDualObjectKey, ParamSingularObjectKey)));
  ObjectParameter = cache((_ref = sequential(
    OpenCurlyBrace,
    EmptyLines,
    [
      "this",
      separatedList(KvpParameter, CommaOrNewline)
    ],
    EmptyLines,
    CloseCurlyBrace
  ), mutate(function (params, parser, index) {
    return parser.object(index, (function () {
      var _arr, _arr2, _i, _len, param;
      for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        if (param) {
          _arr.push(param);
        }
      }
      return _arr;
    }()));
  })(_ref)));
  Parameter = cache(oneOf(IdentifierParameter, ArrayParameter, ObjectParameter));
  ParameterOrNothing = cache(oneOf(Parameter, Nothing));
  Parameters = cache((_ref = separatedList(ParameterOrNothing, CommaOrNewline), mutate(function (params, parser, index) {
    return validateSpreadParameters(removeTrailingNothings(params), parser);
  })(_ref)));
  ParameterSequence = cache((_ref = sequential(
    OpenParenthesis,
    SHORT_CIRCUIT,
    EmptyLines,
    ["this", Parameters],
    EmptyLines,
    CloseParenthesis
  ), mutate((function () {
    function checkParam(param, parser, names) {
      var _arr, _i, _len, child, element, ident, name, pair;
      if (!(param instanceof Node)) {
        throw TypeError("Expected param to be a " + __name(Node) + ", got " + __typeof(param));
      }
      if (!__isArray(names)) {
        throw TypeError("Expected names to be an Array, got " + __typeof(names));
      }
      if (param instanceof ParamNode) {
        ident = param.ident;
        if (ident instanceof IdentNode) {
          name = ident.name;
        } else if (ident instanceof AccessNode) {
          child = ident.child;
          if (!child.isConstType("string")) {
            throw Error("Expected constant access");
          }
          name = child.constValue();
        } else {
          throw Error("Unknown param ident type: " + __typeof(param));
        }
        if (__in(name, names)) {
          throw ParserError("Duplicate parameter name: " + __strnum(quote(name)), parser, parser.indexFromPosition(ident.line, ident.column));
        } else {
          names.push(name);
        }
      } else if (param instanceof ArrayNode) {
        for (_arr = __toArray(param.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          element = _arr[_i];
          checkParam(element, parser, names);
        }
      } else if (param instanceof ObjectNode) {
        for (_arr = __toArray(param.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          pair = _arr[_i];
          checkParam(pair.value, parser, names);
        }
      } else if (!param instanceof NothingNode) {
        throw Error("Unknown param type: " + __typeof(param));
      }
    }
    return function (params, parser, index) {
      var _arr, _i, _len, names, param;
      names = [];
      for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        param = _arr[_i];
        checkParam(param, parser, names);
      }
      return params;
    };
  }()))(_ref)));
  FunctionDeclaration = cache((function () {
    var _ref, asTypeRule, FunctionFlag, FunctionFlags, GenericDefinitionPart, paramsRule;
    FunctionFlag = oneOf(ExclamationPointChar, AtSignChar, AsterixChar, CaretChar);
    _ref = zeroOrMore(FunctionFlag);
    FunctionFlags = mutate(function (codes, parser, index) {
      var _arr, _i, _len, c, flags, uniqueChars;
      flags = { autoReturn: true, bound: false, generator: false, curry: false };
      uniqueChars = [];
      for (_arr = __toArray(codes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        c = _arr[_i];
        if (__in(c, uniqueChars)) {
          throw ParserError("Function flag " + __strnum(quote(fromCharCode(c))) + " specified more than once", parser, index);
        } else {
          uniqueChars.push(c);
          switch (c) {
          case 33:
            flags.autoReturn = false;
            break;
          case 64:
            flags.bound = true;
            break;
          case 42:
            flags.generator = true;
            break;
          case 94:
            flags.curry = true;
            break;
          default: throw Error("Unknown function flag: " + __strnum(quote(fromCharCode(c))));
          }
        }
      }
      if (!flags.autoReturn && flags.generator) {
        throw ParserError("A function cannot be both non-returning (!) and a generator (*)", parser, index);
      }
      return flags;
    })(_ref);
    GenericDefinitionPart = maybe(
      sequential(
        LessThanChar,
        [
          "this",
          separatedList(Identifier, Comma)
        ],
        GreaterThan
      ),
      function () {
        return [];
      }
    );
    paramsRule = maybe(ParameterSequence, function () {
      return [];
    });
    asTypeRule = inFunctionTypeParams(MaybeAsType);
    function getBodyRule(generator) {
      if (generator) {
        return GeneratorFunctionBody;
      } else {
        return FunctionBody;
      }
    }
    return function (parser, index) {
      var _arr, _i, asType, body, flags, flagsValue, func, generic, param, params, result, scope;
      generic = GenericDefinitionPart(parser, index);
      scope = parser.pushScope(true);
      params = paramsRule(parser, generic.index);
      for (_arr = __toArray(params.value), _i = _arr.length; _i--; ) {
        param = _arr[_i];
        addParamToScope(scope, param);
      }
      flags = FunctionFlags(parser, params.index);
      flagsValue = flags.value;
      asType = asTypeRule(parser, flags.index);
      body = getBodyRule(flags.value.generator)(parser, asType.index);
      if (!body) {
        parser.popScope();
        return;
      }
      func = parser.Function(
        index,
        params.value,
        body.value,
        flagsValue.autoReturn,
        flagsValue.bound,
        flagsValue.curry,
        asType.value,
        flagsValue.generator,
        generic.value
      );
      result = mutateFunction(func, parser, index);
      parser.popScope();
      return Box(body.index, result);
    };
  }()));
  FunctionLiteral = cache(sequential(Space, HashSignChar, ["this", FunctionDeclaration]));
  preventUnclosedObjectLiteral = makeAlterStack.generic(Boolean)("preventUnclosedObjectLiteral", true);
  ArrayLiteral = cache(preventUnclosedObjectLiteral((_ref = sequential(
    OpenSquareBracket,
    Space,
    [
      "this",
      concat(
        maybe(
          sequential(
            [
              "this",
              separatedList(SpreadOrExpression, Comma)
            ],
            MaybeComma
          ),
          function () {
            return [];
          }
        ),
        maybe(
          retainIndent(sequential(
            SomeEmptyLines,
            MaybeAdvance,
            [
              "this",
              maybe(
                sequential(CheckIndent, [
                  "this",
                  separatedList(SpreadOrExpression, CommaOrSomeEmptyLinesWithCheckIndent)
                ]),
                function () {
                  return [];
                }
              )
            ],
            EmptyLines,
            MaybeCommaOrNewline
          )),
          function () {
            return [];
          }
        )
      )
    ],
    CloseSquareBracket
  ), mutate(function (items, parser, index) {
    return parser.Array(index, items);
  })(_ref))));
  SetLiteral = cache((_ref = sequential(PercentSign, check(OpenSquareBracketChar), SHORT_CIRCUIT, ["this", ArrayLiteral]), mutate(function (value, parser, index) {
    var constructSet;
    constructSet = parser.getMacroByLabel("constructSet");
    if (!constructSet) {
      throw Error("Cannot use literal set until the construct-set macro has been defined");
    }
    return constructSet.func(
      { op: "", node: value },
      parser,
      index
    );
  })(_ref)));
  NoNewlineIfNoIndent = cache(function (parser, index) {
    if (parser.options.noindent) {
      return NoSpaceNewline(parser, index);
    } else {
      return Box(index);
    }
  });
  DualObjectKey = cache(sequential(
    ["key", ObjectKeyColon],
    NoNewlineIfNoIndent,
    ["value", Expression]
  ));
  GetSetToken = cache(oneOf(word("get"), word("set")));
  PropertyDualObjectKey = cache(sequential(
    [
      "property",
      oneOf(word("property"), GetSetToken)
    ],
    Space,
    ["key", ObjectKeyColon],
    NoNewlineIfNoIndent,
    SHORT_CIRCUIT,
    ["value", Expression]
  ));
  PropertyOrDualObjectKey = cache(oneOf(PropertyDualObjectKey, DualObjectKey));
  ObjectKeyNotColon = cache(sequential(
    ["this", ObjectKey],
    NotColon
  ));
  MethodDeclaration = cache(sequential(
    ["property", maybe(GetSetToken)],
    ["key", ObjectKeyNotColon],
    ["value", FunctionDeclaration]
  ));
  PropertyOrDualObjectKeyOrMethodDeclaration = cache(oneOf(PropertyOrDualObjectKey, MethodDeclaration));
  UnclosedObjectLiteral = cache((_ref = separatedList(PropertyOrDualObjectKey, Comma), mutate(function (pairs, parser, index) {
    return parser.object(index, pairs);
  })(_ref)));
  SingularObjectKey = cache(oneOf(
    (_ref = sequential(
      ["this", IdentifierOrAccess],
      NotColon
    ), mutate(function (ident, parser, index) {
      var key;
      if (ident instanceof AccessNode) {
        key = ident.child;
      } else if (ident instanceof IdentNode) {
        key = parser.Const(index, ident.name);
      } else {
        throw ParserError("Unknown ident type: " + __typeof(ident), parser, index);
      }
      return { key: key, value: ident };
    })(_ref)),
    (_ref = sequential(
      ["this", ConstantLiteral],
      NotColon
    ), mutate(function (node, parser, index) {
      var key;
      if (node.isConst() && !node.isConstType("string")) {
        key = parser.Const(index, String(node.value));
      } else {
        key = node;
      }
      return { key: key, value: node };
    })(_ref)),
    (_ref = sequential(
      ["this", ThisLiteral],
      NotColon
    ), mutate(function (node, parser, index) {
      return {
        key: parser.Const(index, "this"),
        value: node
      };
    })(_ref)),
    (_ref = sequential(
      ["this", ArgumentsLiteral],
      NotColon
    ), mutate(function (node, parser, index) {
      return {
        key: parser.Const(index, "arguments"),
        value: node
      };
    })(_ref)),
    (_ref = sequential(
      ["this", BracketedObjectKey],
      NotColon
    ), mutate(function (node, parser, index) {
      return { key: node, value: node };
    })(_ref))
  ));
  KeyValuePair = cache(oneOf(
    PropertyOrDualObjectKeyOrMethodDeclaration,
    (_ref = sequential(
      Space,
      ["flag", maybe(PlusOrMinusChar)],
      ["key", SingularObjectKey]
    ), mutate(function (_p, parser, index) {
      var flag, key;
      flag = _p.flag;
      key = _p.key;
      if (flag) {
        return {
          key: key.key,
          value: parser.Const(index, flag === 43)
        };
      } else {
        return key;
      }
    })(_ref)),
    (_ref = sequential(
      Space,
      ["bool", PlusOrMinusChar],
      ["key", IdentifierNameConst]
    ), mutate(function (_p, parser, index) {
      var bool, key;
      bool = _p.bool;
      key = _p.key;
      return {
        key: key,
        value: parser.Const(index, bool === 43)
      };
    })(_ref))
  ));
  ObjectLiteral = cache((_ref = sequential(
    OpenCurlyBrace,
    Space,
    [
      "prototype",
      maybe(sequential(
        word("extends"),
        ["this", preventUnclosedObjectLiteral(Logic)],
        Space,
        oneOf(Comma, check(Newline), check(CloseCurlyBrace))
      ))
    ],
    [
      "pairs",
      concat(
        maybe(
          sequential(
            [
              "this",
              separatedList(KeyValuePair, Comma)
            ],
            MaybeComma
          ),
          function () {
            return [];
          }
        ),
        maybe(
          retainIndent(sequential(
            SomeEmptyLines,
            MaybeAdvance,
            [
              "this",
              maybe(
                sequential(CheckIndent, [
                  "this",
                  separatedList(KeyValuePair, CommaOrSomeEmptyLinesWithCheckIndent)
                ]),
                function () {
                  return [];
                }
              )
            ],
            PopIndent
          )),
          function () {
            return [];
          }
        )
      )
    ],
    EmptyLines,
    MaybeCommaOrNewline,
    EmptyLines,
    CloseCurlyBrace
  ), mutate(function (x, parser, index) {
    return parser.object(index, x.pairs, x.prototype);
  })(_ref)));
  MapLiteral = cache((_ref = sequential(
    PercentSign,
    OpenCurlyBraceChar,
    SHORT_CIRCUIT,
    Space,
    [
      "this",
      concat(
        maybe(
          sequential(
            [
              "this",
              separatedList(DualObjectKey, Comma)
            ],
            MaybeComma
          ),
          function () {
            return [];
          }
        ),
        maybe(
          retainIndent(sequential(
            SomeEmptyLines,
            MaybeAdvance,
            [
              "this",
              maybe(
                sequential(CheckIndent, [
                  "this",
                  separatedList(DualObjectKey, CommaOrSomeEmptyLinesWithCheckIndent)
                ]),
                function () {
                  return [];
                }
              )
            ],
            PopIndent
          )),
          function () {
            return [];
          }
        )
      )
    ],
    EmptyLines,
    MaybeCommaOrNewline,
    EmptyLines,
    CloseCurlyBrace
  ), mutate(function (pairs, parser, index) {
    var constructMap;
    constructMap = parser.macros.getByLabel("constructMap");
    if (!constructMap) {
      throw Error("Cannot use literal map until the construct-map macro has been defined");
    }
    return constructMap.func(
      {
        op: "",
        node: parser.object(index, pairs)
      },
      parser,
      index
    );
  })(_ref)));
  Assignment = cache(function (parser, index) {
    var _arr, _i, left, op, operator, right, rule;
    left = IdentifierOrAccess(parser, index);
    if (!left) {
      return;
    }
    for (_arr = __toArray(parser.assignOperators()), _i = _arr.length; _i--; ) {
      operator = _arr[_i];
      rule = operator.rule;
      op = rule(parser, left.index);
      if (!op) {
        continue;
      }
      right = ExpressionOrAssignment(parser, op.index);
      if (!right) {
        continue;
      }
      return Box(right.index, operator.func(
        { left: left.value, op: op.value, right: right.value },
        parser,
        index
      ));
    }
  });
  CustomOperatorCloseParenthesis = cache((function () {
    function handleUnaryOperator(operator, parser, index) {
      var close, node, op, result, scope;
      op = operator.rule(parser, index);
      if (!op) {
        return;
      }
      close = CloseParenthesis(parser, op.index);
      if (!close) {
        return;
      }
      node = parser.Ident(index, "x");
      scope = parser.pushScope(true);
      scope.add(node, false, Type.any);
      result = mutateFunction(
        parser.Function(
          index,
          [parser.Param(index, node)],
          operator.func(
            { op: op.value, node: node },
            parser,
            index
          ),
          true
        ),
        parser,
        index
      );
      parser.popScope();
      return Box(close.index, result);
    }
    function handleBinaryOperator(operator, parser, index) {
      var close, invert, inverted, left, op, result, right, scope;
      inverted = false;
      if (operator.invertible) {
        invert = MaybeNotToken(parser, index);
        if (invert.value) {
          inverted = true;
        }
        index = invert.index;
      }
      op = operator.rule(parser, index);
      if (!op) {
        return;
      }
      close = CloseParenthesis(parser, op.index);
      if (!close) {
        return;
      }
      left = parser.Ident(index, "x");
      right = parser.Ident(index, "y");
      scope = parser.pushScope(true);
      scope.add(left, false, Type.any);
      scope.add(right, false, Type.any);
      result = mutateFunction(
        parser.Function(
          index,
          [
            parser.Param(index, left),
            parser.Param(index, right)
          ],
          operator.func(
            { left: left, inverted: inverted, op: op.value, right: right },
            parser,
            index
          ),
          true,
          false,
          true
        ),
        parser,
        index
      );
      parser.popScope();
      return Box(close.index, result);
    }
    return function (parser, index) {
      var _arr, _i, _ref, operator;
      for (_arr = __toArray(parser.allBinaryOperators()), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        if ((_ref = handleBinaryOperator(operator, parser, index)) != null) {
          return _ref;
        }
      }
      for (_arr = __toArray(parser.prefixUnaryOperators()), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, parser, index)) != null) {
          return _ref;
        }
      }
      for (_arr = __toArray(parser.postfixUnaryOperators()), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, parser, index)) != null) {
          return _ref;
        }
      }
    };
  }()));
  CustomBinaryOperator = cache(function (parser, index) {
    var _arr, _i, currentIndex, invert, inverted, op, operator;
    for (_arr = __toArray(parser.allBinaryOperators()), _i = _arr.length; _i--; ) {
      operator = _arr[_i];
      inverted = false;
      currentIndex = index;
      if (operator.invertible) {
        invert = MaybeNotToken(parser, index);
        if (invert.value) {
          inverted = true;
        }
        currentIndex = invert.index;
      }
      op = operator.rule(parser, currentIndex);
      if (!op) {
        continue;
      }
      return Box(op.index, { op: op.value, operator: operator, inverted: inverted });
    }
  });
  Parenthetical = cache(sequential(OpenParenthesis, [
    "this",
    oneOf.generic(Node)(
      sequential(
        ["this", AssignmentAsExpression],
        CloseParenthesis
      ),
      (_ref = sequential(
        ["left", Expression],
        ["operator", maybe(CustomBinaryOperator)],
        CloseParenthesis
      ), mutate(function (_p, parser, index) {
        var left, operator, result, right, scope;
        left = _p.left;
        operator = _p.operator;
        if (!operator) {
          return left;
        }
        scope = parser.pushScope(true);
        right = parser.makeTmp(index, "x");
        result = mutateFunction(
          parser.Function(
            index,
            [parser.Param(index, right)],
            operator.operator.func(
              { left: left.rescope(scope), inverted: operator.inverted, op: operator.op, right: right },
              parser,
              index
            ),
            true
          ),
          parser,
          index
        );
        parser.popScope();
        return result;
      })(_ref)),
      CustomOperatorCloseParenthesis,
      (_ref = sequential(
        ["operator", CustomBinaryOperator],
        ["right", Expression],
        CloseParenthesis
      ), mutate(function (_p, parser, index) {
        var _p2, inverted, left, op, operator, result, right, scope;
        right = _p.right;
        _p2 = _p.operator;
        op = _p2.op;
        operator = _p2.operator;
        inverted = _p2.inverted;
        scope = parser.pushScope(true);
        left = parser.makeTmp(index, "x");
        result = mutateFunction(
          parser.Function(
            index,
            [parser.Param(index, left)],
            operator.func(
              { left: left, inverted: inverted, op: op, right: right.rescope(scope) },
              parser,
              index
            ),
            true
          ),
          parser,
          index
        );
        parser.popScope();
        return result;
      })(_ref)),
      (_ref = sequential(
        [
          "this",
          oneOrMore(function (parser, index) {
            return InvocationOrAccessPart(parser, index);
          })
        ],
        CloseParenthesis
      ), mutate(function (tail, parser, index) {
        var left, result, scope;
        scope = parser.pushScope(true);
        left = parser.makeTmp(index, "o");
        result = mutateFunction(
          parser.Function(
            index,
            [parser.Param(index, left)],
            convertInvocationOrAccess(
              false,
              { type: "normal", existential: false, node: left },
              tail,
              parser,
              index
            ).rescope(scope),
            true,
            false
          ),
          parser,
          index
        );
        parser.popScope();
        return result;
      })(_ref))
    )
  ]));
  CurrentArrayLength = cache(function (parser, index) {
    var asterix;
    if (parser.asterixAsArrayLength.peek()) {
      asterix = AsterixChar(parser, index);
      if (asterix) {
        return Box(asterix.index, parser.Ident(index, CURRENT_ARRAY_LENGTH_NAME));
      }
    }
  });
  IndentedUnclosedObjectLiteralInner = cache((_ref = separatedList(PropertyOrDualObjectKey, CommaOrSomeEmptyLinesWithCheckIndent), mutate(function (pairs, parser, index) {
    return parser.object(index, pairs);
  })(_ref)));
  UnclosedObjectLiteralsAllowed = cache(function (parser, index) {
    if (!parser.preventUnclosedObjectLiteral.peek()) {
      return Box(index);
    }
  });
  IndentedUnclosedObjectLiteral = cache(sequential(
    UnclosedObjectLiteralsAllowed,
    IndentationRequired,
    Space,
    Newline,
    EmptyLines,
    [
      "this",
      retainIndent(sequential(
        Advance,
        CheckIndent,
        ["this", IndentedUnclosedObjectLiteralInner],
        PopIndent
      ))
    ]
  ));
  UnclosedArrayLiteralElement = cache(sequential(AsterixChar, Space, [
    "this",
    oneOf(
      retainIndent(sequential(PushFakeIndent(2), [
        "this",
        oneOf(
          IndentedUnclosedObjectLiteralInner,
          function (parser, index) {
            return IndentedUnclosedArrayLiteralInner(parser, index);
          },
          SpreadOrExpression
        )
      ])),
      SpreadOrExpression
    )
  ]));
  IndentedUnclosedArrayLiteralInner = cache((_ref = separatedList(UnclosedArrayLiteralElement, sequential(MaybeComma, SomeEmptyLinesWithCheckIndent)), mutate(function (items, parser, index) {
    return parser.Array(index, items);
  })(_ref)));
  IndentedUnclosedArrayLiteral = cache(sequential(
    UnclosedObjectLiteralsAllowed,
    IndentationRequired,
    Space,
    Newline,
    EmptyLines,
    [
      "this",
      retainIndent(sequential(
        Advance,
        CheckIndent,
        ["this", IndentedUnclosedArrayLiteralInner],
        PopIndent
      ))
    ]
  ));
  inAst = makeAlterStack.generic(Boolean)("inAst", true);
  inEvilAst = makeAlterStack.generic(Boolean)("inEvilAst", true);
  AstExpression = cache(sequential(
    word("ASTE"),
    SHORT_CIRCUIT,
    function (parser, index) {
      if (!parser.inMacro.peek()) {
        throw ParserError("Can only use ASTE inside of a macro", parser, index);
      } else if (parser.inAst.peek()) {
        throw ParserError("Can only use ASTE inside of another AST", parser, index);
      } else {
        return Box(index);
      }
    },
    [
      "this",
      (function () {
        var evilRule, rule;
        rule = inAst(ExpressionOrAssignment);
        evilRule = inEvilAst(rule);
        return function (parser, index) {
          var isEvil;
          isEvil = ExclamationPointChar(parser, index);
          if (isEvil) {
            return evilRule(parser, isEvil.index);
          } else {
            return rule(parser, index);
          }
        };
      }())
    ]
  ));
  AstStatement = cache(sequential(
    word("AST"),
    SHORT_CIRCUIT,
    function (parser, index) {
      if (!parser.inMacro.peek()) {
        throw ParserError("Can only use AST inside of a macro", parser, index);
      } else if (parser.inAst.peek()) {
        throw ParserError("Can only use AST inside of another AST", parser, index);
      } else {
        return Box(index);
      }
    },
    [
      "this",
      (function () {
        var evilRule, rule;
        rule = inAst(oneOf(Body, Statement));
        evilRule = inEvilAst(rule);
        return function (parser, index) {
          var isEvil;
          isEvil = ExclamationPointChar(parser, index);
          if (isEvil) {
            return evilRule(parser, isEvil.index);
          } else {
            return rule(parser, index);
          }
        };
      }())
    ]
  ));
  Ast = cache((_ref = oneOf(AstExpression, AstStatement), mutate(function (node, parser, index) {
    var position;
    position = parser.getPosition(index);
    return MacroHelper.constifyObject(node, position.line, position.column, parser.scope.peek());
  })(_ref)));
  PrimaryExpression = cache(oneOf.generic(Node)(
    UnclosedObjectLiteral,
    Literal,
    ArrayLiteral,
    ObjectLiteral,
    SetLiteral,
    MapLiteral,
    Ast,
    Parenthetical,
    FunctionLiteral,
    UseMacro,
    Identifier,
    CurrentArrayLength,
    IndentedUnclosedObjectLiteral,
    IndentedUnclosedArrayLiteral
  ));
  convertInvocationOrAccess = (function () {
    var linkTypes;
    linkTypes = {
      access: (function () {
        var indexTypes;
        indexTypes = {
          multi: function (parser, index, child) {
            return function (parent) {
              var result, setParent, tmp, tmpIds;
              setParent = parent;
              tmpIds = [];
              if (parent.cacheable) {
                tmp = parser.makeTmp(index, "ref", parent.type(parser));
                tmpIds.push(tmp.id);
                setParent = parser.Assign(index, tmp, "=", parent.doWrap(parser));
                parent = tmp;
              }
              result = parser.Array(index, (function () {
                var _arr, _arr2, _len, element, i;
                for (_arr = [], _arr2 = __toArray(child.elements), i = 0, _len = _arr2.length; i < _len; ++i) {
                  element = _arr2[i];
                  _arr.push(parser.Access(
                    index,
                    i === 0 ? setParent : parent,
                    element
                  ));
                }
                return _arr;
              }()));
              if (tmpIds.length) {
                return parser.TmpWrapper(index, result, tmpIds);
              } else {
                return result;
              }
            };
          }
        };
        return function (parser, index, head, link, linkIndex, links) {
          var bindAccess, child, existentialOp, makeAccess, result, setChild, setHead, tmp, tmpIds;
          if (link.bind) {
            bindAccess = function (parent, child) {
              return parser.Call(
                index,
                parser.Ident(index, "__bind"),
                [parent, child]
              );
            };
          } else {
            bindAccess = function (parent, child) {
              return parser.Access(index, parent, child);
            };
          }
          if (link.owns) {
            tmpIds = [];
            setHead = head;
            if (head.cacheable) {
              tmp = parser.makeTmp(index, "ref", head.type(parser));
              tmpIds.push(tmp.id);
              setHead = parser.Assign(index, tmp, "=", head.doWrap(parser));
              head = tmp;
            }
            child = link.child;
            setChild = child;
            if (child.cacheable) {
              tmp = parser.makeTmp(index, "ref", child.type(parser));
              tmpIds.push(tmp.id);
              setChild = parser.Assign(index, tmp, "=", child.doWrap(parser));
              child = tmp;
            }
            result = parser.If(
              index,
              (function () {
                var existentialOp, ownershipOp;
                ownershipOp = parser.getMacroByLabel("ownership");
                if (!ownershipOp) {
                  throw Error("Cannot use ownership access until the ownership operator has been defined");
                }
                if (link.existential) {
                  existentialOp = parser.getMacroByLabel("existential");
                  if (!existentialOp) {
                    throw Error("Cannot use existential access until the existential operator has been defined");
                  }
                  return parser.Binary(
                    index,
                    existentialOp.func(
                      { op: "", node: setHead },
                      parser,
                      index
                    ),
                    "&&",
                    ownershipOp.func(
                      { left: head, op: "", right: setChild },
                      parser,
                      index
                    )
                  );
                } else {
                  return ownershipOp.func(
                    { left: setHead, op: "", right: setChild },
                    parser,
                    index
                  );
                }
              }()),
              convertCallChain(
                parser,
                index,
                bindAccess(head, child),
                __num(linkIndex) + 1,
                links
              )
            );
            if (tmpIds.length) {
              return parser.TmpWrapper(index, result, tmpIds);
            } else {
              return result;
            }
          } else {
            switch (link.type) {
            case "access":
              makeAccess = function (parent) {
                return bindAccess(parent, link.child);
              };
              break;
            case "accessIndex":
              if (!__owns.call(indexTypes, link.child.type)) {
                throw Error("Unknown index type: " + __strnum(link.child.type));
              }
              makeAccess = indexTypes[link.child.type](parser, index, link.child);
              break;
            default: throw Error("Unknown link type: " + __strnum(link.type));
            }
            if (link.existential) {
              tmpIds = [];
              setHead = head;
              if (head.cacheable) {
                tmp = parser.makeTmp(index, "ref", head.type(parser));
                tmpIds.push(tmp.id);
                setHead = parser.Assign(index, tmp, "=", head.doWrap(parser));
                head = tmp;
              }
              existentialOp = parser.getMacroByLabel("existential");
              if (!existentialOp) {
                throw Error("Cannot use existential access until the existential operator has been defined");
              }
              result = parser.If(
                index,
                existentialOp.func(
                  { op: "", node: setHead },
                  parser,
                  index
                ),
                convertCallChain(
                  parser,
                  index,
                  makeAccess(head),
                  __num(linkIndex) + 1,
                  links
                )
              );
              if (tmpIds.length) {
                return parser.TmpWrapper(index, result, tmpIds);
              } else {
                return result;
              }
            } else {
              return convertCallChain(
                parser,
                index,
                makeAccess(head),
                __num(linkIndex) + 1,
                links
              );
            }
          }
        };
      }()),
      call: function (parser, index, head, link, linkIndex, links) {
        var child, parent, result, setChild, setHead, setParent, tmp, tmpIds;
        if (!link.existential) {
          return convertCallChain(
            parser,
            index,
            parser.Call(
              index,
              head,
              link.args,
              link.isNew,
              link.isApply
            ),
            __num(linkIndex) + 1,
            links
          );
        } else {
          tmpIds = [];
          setHead = head;
          if (head instanceof AccessNode && !link.isApply && !link.isNew) {
            parent = head.parent;
            child = head.child;
            setParent = parent;
            setChild = child;
            if (parent.cacheable) {
              tmp = parser.makeTmp(index, "ref", parent.type(parser));
              tmpIds.push(tmp.id);
              setParent = parser.Assign(index, tmp, "=", parent.doWrap(parser));
              parent = tmp;
            }
            if (child.cacheable) {
              tmp = parser.makeTmp(index, "ref", child.type(parser));
              tmpIds.push(tmp.id);
              setChild = parser.Assign(index, tmp, "=", child.doWrap(parser));
              child = tmp;
            }
            if (parent !== setParent || child !== setChild) {
              setHead = parser.Access(index, setParent, setChild);
              head = parser.Access(index, parent, child);
            }
          } else if (head.cacheable) {
            tmp = parser.makeTmp(index, "ref", head.type(parser));
            tmpIds.push(tmp.id);
            setHead = parser.Assign(index, tmp, "=", head.doWrap(parser));
            head = tmp;
          }
          result = parser.If(
            index,
            parser.Binary(
              index,
              parser.Unary(index, "typeof", setHead),
              "===",
              parser.Const(index, "function")
            ),
            convertCallChain(
              parser,
              index,
              parser.Call(
                index,
                head,
                link.args,
                link.isNew,
                link.isApply
              ),
              __num(linkIndex) + 1,
              links
            )
          );
          if (tmpIds.length) {
            return parser.TmpWrapper(index, result, tmpIds);
          } else {
            return result;
          }
        }
      }
    };
    linkTypes.accessIndex = linkTypes.access;
    function convertCallChain(parser, index, head, linkIndex, links) {
      var link;
      if (!__lt(linkIndex, links.length)) {
        return head;
      } else {
        link = links[linkIndex];
        if (!__owns.call(linkTypes, link.type)) {
          throw Error("Unknown call-chain link: " + __strnum(link.type));
        }
        return linkTypes[link.type](
          parser,
          index,
          head,
          link,
          linkIndex,
          links
        );
      }
    }
    return function (isNew, head, tail, parser, index) {
      var _arr, _i, _len, _ref, links, part;
      if (tail.length === 0 && !isNew && head.type === "normal") {
        return head.node;
      }
      links = [];
      if (head.type === "thisAccess") {
        links.push({ type: "access", child: head.child, existential: head.existential });
      }
      for (_arr = __toArray(tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        part = _arr[_i];
        switch (part.type) {
        case "protoAccess":
        case "protoAccessIndex":
          links.push({
            type: "access",
            child: parser.Const(index, "prototype"),
            existential: part.existential
          });
          links.push(((_ref = __import({}, part)).type = part.type === "protoAccess" ? "access" : "accessIndex", _ref));
          break;
        case "access":
        case "accessIndex":
          links.push(part);
          break;
        case "call":
          if (isNew && part.isApply) {
            throw ParserError("Cannot call with both new and @ at the same time", parser, index);
          }
          links.push(((_ref = __import({}, part)).isNew = isNew, _ref));
          isNew = false;
          break;
        case "generic":
          links.push({
            type: "access",
            child: parser.Const(index, "generic"),
            existential: false
          });
          links.push({ type: "call", args: part.args, existential: false });
          break;
        default: throw Error("Unknown link type: " + __strnum(part.type));
        }
      }
      if (isNew) {
        links.push({
          type: "call",
          args: [],
          existential: false,
          isNew: true,
          isApply: false
        });
      }
      return convertCallChain(
        parser,
        index,
        head.node,
        0,
        links
      );
    };
  }());
  Index = cache((function () {
    var _ref, asterixAsArrayLength, ExpressionWithAsterixAsArrayLength;
    asterixAsArrayLength = makeAlterStack.generic(Boolean)("asterixAsArrayLength", true);
    ExpressionWithAsterixAsArrayLength = asterixAsArrayLength(Expression);
    _ref = separatedList(ExpressionWithAsterixAsArrayLength, CommaOrNewline);
    return mutate(function (nodes) {
      if (__num(nodes.length) > 1) {
        return { type: "multi", elements: nodes };
      } else {
        return { type: "single", node: nodes[0] };
      }
    })(_ref);
  }()));
  InvocationOrAccessPart = cache(oneOf(
    (_ref = sequential(
      LessThanChar,
      [
        "this",
        separatedList(
          function (parser, index) {
            return BasicInvocationOrAccess(parser, index);
          },
          Comma
        )
      ],
      GreaterThan
    ), mutate(function (args) {
      return { type: "generic", args: args };
    })(_ref)),
    (_ref = sequential(
      ["existential", MaybeQuestionMarkChar],
      ["owns", MaybeExclamationPointChar],
      ["bind", MaybeAtSignChar],
      EmptyLines,
      Space,
      ["type", PeriodOrDoubleColonChar],
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (x) {
      return {
        type: x.type === "::" ? "protoAccess" : "access",
        child: x.child,
        existential: x.existential,
        owns: x.owns,
        bind: x.bind
      };
    })(_ref)),
    (_ref = sequential(
      ["existential", MaybeQuestionMarkChar],
      ["owns", MaybeExclamationPointChar],
      ["bind", MaybeAtSignChar],
      ["type", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      ["child", Index],
      CloseSquareBracket
    ), mutate(function (x, parser, index) {
      if (x.child.type === "single") {
        return {
          type: x.type === "::" ? "protoAccess" : "access",
          child: x.child.node,
          existential: x.existential,
          owns: x.owns,
          bind: x.bind
        };
      } else {
        if (x.owns) {
          throw ParserError("Cannot use ! when using a multiple or slicing index", parser, index);
        } else if (x.bind) {
          throw ParserError("Cannot use @ when using a multiple or slicing index", parser, index);
        }
        return {
          type: x.type === "::" ? "protoAccessIndex" : "accessIndex",
          child: x.child,
          existential: x.existential
        };
      }
    })(_ref)),
    (_ref = sequential(
      ["existential", bool(MaybeQuestionMarkChar)],
      ["isApply", bool(MaybeAtSignChar)],
      ["args", InvocationArguments]
    ), mutate(function (x) {
      return {
        type: "call",
        args: x.args,
        existential: x.existential,
        isNew: false,
        isApply: x.isApply
      };
    })(_ref))
  ));
  BasicInvocationOrAccess = cache((_ref = sequential(
    ["isNew", bool(maybe(word("new")))],
    [
      "head",
      oneOf(
        (_ref2 = sequential(
          ["node", ThisShorthandLiteral],
          ["existential", MaybeQuestionMarkChar],
          ["owns", MaybeExclamationPointChar],
          ["bind", MaybeAtSignChar],
          ["child", IdentifierNameConstOrNumberLiteral]
        ), mutate(function (x, parser, index) {
          return __import({ type: "thisAccess" }, x);
        })(_ref2)),
        mutate(function (node) {
          if (!(node instanceof Node)) {
            throw TypeError("Expected node to be a " + __name(Node) + ", got " + __typeof(node));
          }
          return { type: "normal", node: node };
        })(PrimaryExpression)
      )
    ],
    ["tail", zeroOrMore(InvocationOrAccessPart)]
  ), mutate(function (_p, parser, index) {
    var head, isNew, tail;
    isNew = _p.isNew;
    head = _p.head;
    tail = _p.tail;
    return convertInvocationOrAccess(
      isNew,
      __import({}, head),
      tail,
      parser,
      index
    );
  })(_ref)));
  SuperInvocation = cache((_ref = sequential(
    word("super"),
    SHORT_CIRCUIT,
    [
      "child",
      maybe(oneOf(
        sequential(EmptyLines, Space, Period, ["this", IdentifierNameConstOrNumberLiteral]),
        sequential(
          OpenSquareBracketChar,
          ["this", Expression],
          CloseSquareBracket
        )
      ))
    ],
    ["args", InvocationArguments]
  ), mutate(function (_p, parser, index) {
    var args, child;
    child = _p.child;
    args = _p.args;
    return parser.Super(index, child, args);
  })(_ref)));
  Eval = cache((_ref = sequential(word("eval"), SHORT_CIRCUIT, ["this", InvocationArguments]), mutate(function (args, parser, index) {
    if (args.length !== 1) {
      throw ParserError("Expected only one argument to eval, got " + __strnum(args.length), parser, index);
    }
    return parser.Eval(index, args[0]);
  })(_ref)));
  InvocationOrAccess = cache(oneOf(
    function (parser, index) {
      var args, dollar, inAst;
      inAst = parser.inAst;
      if (!inAst.peek()) {
        return;
      }
      dollar = DollarSign(parser, Space(parser, index).index);
      if (!dollar) {
        return;
      }
      inAst.push(false);
      try {
        args = InvocationArguments(parser, dollar.index);
        if (!args) {
          return;
        }
        return Box(args.index, parser.Call(
          index,
          parser.Ident(index, "$"),
          args.value
        ));
      } finally {
        inAst.pop();
      }
    },
    BasicInvocationOrAccess,
    SuperInvocation,
    Eval
  ));
  PostfixUnaryOperation = cache(function (parser, index) {
    var _arr, _i, found, node, op, operator, rule;
    node = InvocationOrAccess(parser, index);
    if (!node) {
      return;
    }
    found = true;
    while (found) {
      found = false;
      for (_arr = __toArray(parser.postfixUnaryOperators()), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        rule = operator.rule;
        op = rule(parser, node.index);
        if (!op) {
          continue;
        }
        node = Box(op.index, operator.func(
          { op: op.value, node: node.value },
          parser,
          index
        ));
        found = true;
        break;
      }
    }
    return node;
  });
  PrefixUnaryOperation = cache(function (parser, index) {
    var _arr, _i, node, op, operator, rule;
    for (_arr = __toArray(parser.prefixUnaryOperators()), _i = _arr.length; _i--; ) {
      operator = _arr[_i];
      rule = operator.rule;
      op = rule(parser, index);
      if (!op) {
        continue;
      }
      node = PrefixUnaryOperation(parser, op.index);
      if (!node) {
        continue;
      }
      return Box(node.index, operator.func(
        { op: op.value, node: node.value },
        parser,
        index
      ));
    }
    return PostfixUnaryOperation(parser, index);
  });
  BinaryOperationByPrecedence = (function () {
    var precedenceCache;
    precedenceCache = [];
    return function (precedence) {
      return precedenceCache[precedence] || (precedenceCache[precedence] = cache(function (parser, index) {
        var _arr, _i, _i2, _len, currentIndex, head, invert, inverted, j, left, nextRule, node, op, operator, operators, part, result, right, rule, tail;
        operators = parser.binaryOperators(precedence);
        if (!operators) {
          return PrefixUnaryOperation(parser, index);
        }
        nextRule = BinaryOperationByPrecedence(+precedence + 1);
        head = nextRule(parser, index);
        if (!head) {
          return;
        }
        for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
          operator = _arr[_i];
          rule = operator.rule;
          tail = [];
          currentIndex = head.index;
          while (true) {
            inverted = false;
            if (operator.invertible) {
              invert = MaybeNotToken(parser, currentIndex);
              if (invert.value) {
                inverted = true;
              }
              currentIndex = invert.index;
            }
            op = rule(parser, currentIndex);
            if (!op) {
              break;
            }
            node = nextRule(parser, op.index);
            if (!node) {
              break;
            }
            currentIndex = node.index;
            tail.push({ inverted: inverted, op: op.value, node: node.value });
            if (operator.maximum && tail.length >= __num(operator.maximum)) {
              break;
            }
          }
          if (tail.length) {
            if (!operator.rightToLeft) {
              left = head.value;
              for (_i2 = 0, _len = tail.length; _i2 < _len; ++_i2) {
                part = tail[_i2];
                left = operator.func(
                  { left: left, inverted: part.inverted, op: part.op, right: part.node },
                  parser,
                  index
                );
              }
              result = left;
            } else {
              right = tail[tail.length - 1].node;
              for (j = tail.length; j--; ) {
                part = tail[j];
                right = operator.func(
                  {
                    left: j === 0 ? head.value : tail[j - 1].node,
                    inverted: part.inverted,
                    op: part.op,
                    right: right
                  },
                  parser,
                  index
                );
              }
              result = right;
            }
            return Box(currentIndex, result);
          }
        }
        return head;
      }));
    };
  }());
  Logic = cache(BinaryOperationByPrecedence(0));
  ExpressionAsStatement = cache(oneOf(UseMacro, Logic));
  Expression = cache(inExpression(ExpressionAsStatement));
  LicenseComment = cache(sequential(
    SpaceChars,
    [
      "this",
      function (parser, index) {
        var _len, ch, currentIndex, i, indent, l, len, line, lines, result, source;
        source = parser.source;
        if (source.charCodeAt(index) !== 47 || source.charCodeAt(+index + 1) !== 42 || source.charCodeAt(+index + 2) !== 33) {
          return;
        }
        line = [47, 42, 33];
        lines = [line];
        len = source.length;
        currentIndex = +index + 3;
        for (; ; ++currentIndex) {
          if (currentIndex >= len) {
            throw ParserError("Multi-line license comment never ends", parser, index);
          }
          ch = source.charCodeAt(currentIndex);
          if (ch === 42 && source.charCodeAt(currentIndex + 1) === 47) {
            line.push(42, 47);
            result = [];
            for (i = 0, _len = lines.length; i < _len; ++i) {
              l = lines[i];
              if (i > 0) {
                result.push("\n");
              }
              processCharCodes(l, result);
            }
            return Box(currentIndex + 2, parser.Comment(index, result.join("")));
          } else if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233) {
            if (ch === 13 && data.charCodeAt(currentIndex + 1) === 10) {
              ++currentIndex;
            }
            lines.push(line = []);
            indent = StringIndent(parser, currentIndex + 1);
            if (!indent) {
              throw ParserError("Improper indent in multi-line license comment", parser, currentIndex + 1);
            }
            currentIndex = indent.index - 1;
          } else {
            line.push(ch);
          }
        }
      }
    ],
    Space
  ));
  MacroSyntaxParameterType = cache((_ref = sequential(
    [
      "type",
      oneOf(
        Identifier,
        StringLiteral,
        (_ref2 = sequential(
          OpenParenthesis,
          EmptyLines,
          [
            "this",
            function (parser, index) {
              return MacroSyntaxParameters(parser, index);
            }
          ],
          EmptyLines,
          MaybeCommaOrNewline,
          CloseParenthesis
        ), mutate(function (value, parser, index) {
          return parser.SyntaxSequence(index, value);
        })(_ref2)),
        (_ref2 = sequential(
          OpenParenthesis,
          EmptyLines,
          [
            "this",
            function (parser, index) {
              return MacroSyntaxChoiceParameters(parser, index);
            }
          ],
          EmptyLines,
          CloseParenthesis
        ), mutate(function (value, parser, index) {
          return parser.SyntaxChoice(index, value);
        })(_ref2))
      )
    ],
    [
      "multiplier",
      maybe(oneOf(symbol("?"), symbol("*"), symbol("+")))
    ]
  ), mutate(function (_p, parser, index) {
    var multiplier, type;
    type = _p.type;
    multiplier = _p.multiplier;
    if (multiplier) {
      return parser.SyntaxMany(index, type, multiplier);
    } else {
      return type;
    }
  })(_ref)));
  MacroSyntaxParameter = cache(oneOf(StringLiteral, (_ref = sequential(
    [
      "ident",
      oneOf(ThisOrShorthandLiteral, Identifier)
    ],
    [
      "type",
      maybe(sequential(word("as"), ["this", MacroSyntaxParameterType]))
    ]
  ), mutate(function (_p, parser, index) {
    var ident, type;
    ident = _p.ident;
    type = _p.type;
    return parser.SyntaxParam(index, ident, type);
  })(_ref))));
  MacroSyntaxParameters = cache(separatedList(MacroSyntaxParameter, Comma));
  MacroSyntaxChoiceParameters = cache(separatedList(MacroSyntaxParameterType, Pipe));
  MacroOptions = cache(maybe(
    (_ref = sequential(word("with"), ["this", UnclosedObjectLiteral]), mutate(function (object, parser, index) {
      if (!object.isLiteral()) {
        throw ParserError("Macro options must be a literal object without any logic, invocation, or anything else", parser, index);
      }
      return object.literalValue();
    })(_ref)),
    function () {
      return {};
    }
  ));
  function addMacroSyntaxParametersToScope(params, scope) {
    var _arr, _i, _len, ident, param;
    for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      param = _arr[_i];
      if (param instanceof SyntaxParamNode) {
        ident = param.ident;
        if (ident instanceof IdentNode) {
          scope.add(ident, true, Type.any);
        }
      }
    }
  }
  MacroSyntax = cache(sequential(
    CheckIndent,
    word("syntax"),
    SHORT_CIRCUIT,
    function (parser, index) {
      var body, options, params, scope;
      scope = parser.pushScope(true);
      params = MacroSyntaxParameters(parser, index);
      if (!params) {
        throw SHORT_CIRCUIT;
      }
      options = MacroOptions(parser, params.index);
      parser.startMacroSyntax(index, params.value, options.value);
      addMacroSyntaxParametersToScope(params, scope);
      scope.add(
        parser.Ident(index, "macroName"),
        true,
        Type.string
      );
      body = FunctionBody(parser, options.index);
      if (!body) {
        throw SHORT_CIRCUIT;
      }
      parser.macroSyntax(
        index,
        "syntax",
        params.value,
        options.value,
        body.value
      );
      parser.popScope();
      return Box(body.index);
    },
    Space,
    CheckStop
  ));
  MacroBody = cache(oneOf(
    sequential(
      function (parser, index) {
        if (parser.options.noindent) {
          return Colon(parser, index);
        } else {
          return Box(index);
        }
      },
      Space,
      Newline,
      EmptyLines,
      retainIndent(sequential(
        function (parser, index) {
          if (parser.options.noindent) {
            return MaybeAdvance(parser, index);
          } else {
            return Advance(parser, index);
          }
        },
        separatedList(MacroSyntax, SomeEmptyLines),
        PopIndent
      )),
      End
    ),
    function (parser, index) {
      var _arr, _i, body, options, param, params, scope;
      scope = parser.pushScope(true);
      params = ParameterSequence(parser, index);
      if (!params) {
        throw SHORT_CIRCUIT;
      }
      for (_arr = __toArray(params.value), _i = _arr.length; _i--; ) {
        param = _arr[_i];
        addParamToScope(scope, param, true);
      }
      options = MacroOptions(parser, params.index);
      body = FunctionBody(parser, options.index);
      if (!body) {
        throw SHORT_CIRCUIT;
      }
      parser.macroSyntax(
        index,
        "call",
        params.value,
        options.value,
        body.value
      );
      parser.popScope();
      return Box(body.index, parser.Nothing(index));
    }
  ));
  inMacro = makeAlterStack.generic(Boolean)("inMacro", true);
  _DefineMacro = cache(sequential(word("macro"), [
    "this",
    inMacro(function (parser, index) {
      var body, names;
      names = MacroNames(parser, index);
      if (!names) {
        return;
      }
      parser.enterMacro(index, names.value);
      body = MacroBody(parser, names.index);
      parser.exitMacro();
      return Box(body.index, parser.Nothing(index));
    })
  ]));
  DefineSyntax = cache((function () {
    var topRule;
    topRule = sequential(
      word("define"),
      word("syntax"),
      SHORT_CIRCUIT,
      ["name", Identifier],
      EqualSign,
      ["value", MacroSyntaxParameters]
    );
    return inMacro(function (parser, index) {
      var body, top;
      top = topRule(parser, index);
      if (!top) {
        return;
      }
      body = FunctionBody(parser, top.index);
      parser.defineSyntax(index, top.value.name.name, top.value.value, body != null ? body.value : void 0);
      return Box(
        body ? body.index : top.index,
        parser.Nothing(index)
      );
    });
  }()));
  DefineHelper = cache((_ref = sequential(
    word("define"),
    word("helper"),
    SHORT_CIRCUIT,
    ["name", Identifier],
    [
      "value",
      oneOf(
        sequential(EqualSign, ["this", Expression]),
        FunctionDeclaration
      )
    ]
  ), mutate(function (_p, parser, index) {
    var name, value;
    name = _p.name;
    value = _p.value;
    parser.defineHelper(index, name, value);
    return parser.Nothing(index);
  })(_ref)));
  DefineOperator = cache((function () {
    var mainRule;
    mainRule = sequential(
      word("define"),
      word("operator"),
      SHORT_CIRCUIT,
      [
        "type",
        oneOf(word("binary"), word("assign"), word("unary"))
      ],
      [
        "ops",
        separatedList(NameOrSymbol, Comma)
      ],
      ["options", MacroOptions]
    );
    return inMacro(function (parser, index) {
      var _ref, body, ops, options, ret, scope, type, x;
      x = mainRule(parser, index);
      if (!x) {
        return;
      }
      type = (_ref = x.value).type;
      ops = _ref.ops;
      options = _ref.options;
      scope = parser.pushScope(true);
      switch (type) {
      case "binary":
      case "assign":
        scope.add(
          parser.Ident(index, "left"),
          true,
          Type.any
        );
        scope.add(
          parser.Ident(index, "op"),
          true,
          Type.string
        );
        scope.add(
          parser.Ident(index, "right"),
          true,
          Type.any
        );
        break;
      case "unary":
        scope.add(
          parser.Ident(index, "op"),
          true,
          Type.string
        );
        scope.add(
          parser.Ident(index, "node"),
          true,
          Type.any
        );
        break;
      }
      body = FunctionBody(parser, x.index);
      if (!body) {
        throw SHORT_CIRCUIT;
      }
      switch (type) {
      case "binary":
        ret = parser.defineBinaryOperator(index, ops, options, body.value);
        break;
      case "assign":
        ret = parser.defineAssignOperator(index, ops, options, body.value);
        break;
      case "unary":
        ret = parser.defineUnaryOperator(index, ops, options, body.value);
        break;
      default: throw Error();
      }
      parser.popScope();
      return Box(body.index, parser.Nothing(index));
    });
  }()));
  DefineMacro = cache(oneOf.generic(NothingNode)(_DefineMacro, DefineSyntax, DefineHelper, DefineOperator));
  Statement = cache(sequential(
    [
      "this",
      inStatement(oneOf.generic(Node)(LicenseComment, DefineMacro, Assignment, ExpressionAsStatement))
    ],
    Space
  ));
  function unprettyText(text) {
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    return text.replace(/\s+/g, " ");
  }
  EmbeddedReadLiteralText = cache(function (parser, index) {
    var c, codes, currentIndex, len, source, text;
    source = parser.source;
    len = source.length;
    currentIndex = index;
    codes = [];
    for (; currentIndex < len; ++currentIndex) {
      if (EmbeddedOpen(parser, currentIndex) || EmbeddedOpenWrite(parser, currentIndex) || EmbeddedOpenComment(parser, currentIndex)) {
        break;
      }
      c = source.charCodeAt(currentIndex);
      if (c === 13 && source.charCodeAt(currentIndex + 1) === 10) {
        c = 10;
        ++currentIndex;
      }
      codes.push(c);
    }
    if (currentIndex === index) {
      return;
    }
    text = codesToString(codes);
    if (parser.options.embeddedUnpretty) {
      text = unprettyText(text);
    }
    return Box(currentIndex, parser.EmbedWrite(
      index,
      parser.Const(index, text),
      false
    ));
  });
  makeEmbeddedRule = (function () {
    var rules;
    function make(text) {
      var _arr, codes, i, len;
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      len = text.length;
      for (_arr = [], i = 0; i < len; ++i) {
        _arr.push(text.charCodeAt(i));
      }
      codes = _arr;
      return function (parser, index) {
        var i, source;
        source = parser.source;
        for (i = 0; i < len; ++i) {
          if (source.charCodeAt(__num(index) + i) !== codes[i]) {
            return;
          }
        }
        return Box(+index + len, text);
      };
    }
    rules = __create(null);
    function getEmbeddedRule(text) {
      return rules[text] || (rules[text] = make(text));
    }
    return function (key, defaultValue) {
      if (typeof key !== "string") {
        throw TypeError("Expected key to be a String, got " + __typeof(key));
      }
      return function (parser, index) {
        var text;
        text = parser.options[key];
        if (typeof text !== "string") {
          text = defaultValue;
        }
        return getEmbeddedRule(text)(parser, index);
      };
    };
  }());
  EmbeddedOpenComment = cache(makeEmbeddedRule("embeddedOpenComment", EMBED_OPEN_COMMENT_DEFAULT));
  EmbeddedCloseComment = cache(makeEmbeddedRule("embeddedCloseComment", EMBED_CLOSE_COMMENT_DEFAULT));
  EmbeddedComment = cache(function (parser, index) {
    var any, close, currentIndex, len, open;
    open = EmbeddedOpenComment(parser, index);
    if (!open) {
      return;
    }
    currentIndex = open.index;
    len = parser.source.length;
    while (currentIndex < len) {
      close = EmbeddedCloseComment(parser, currentIndex);
      if (close) {
        currentIndex = close.index;
        break;
      }
      any = AnyChar(parser, currentIndex);
      if (!any) {
        break;
      }
      if (currentIndex === any.index) {
        throw Error("Infinite loop detected");
      }
      currentIndex = any.index;
    }
    return Box(currentIndex, parser.Nothing(index));
  });
  EmbeddedOpen = cache(makeEmbeddedRule("embeddedOpen", EMBED_OPEN_DEFAULT));
  EmbeddedClose = cache(sequential(EmptyLines, Space, oneOf(Eof, makeEmbeddedRule("embeddedClose", EMBED_CLOSE_DEFAULT))));
  EmbeddedOpenWrite = cache(makeEmbeddedRule("embeddedOpenWrite", EMBED_OPEN_WRITE_DEFAULT));
  EmbeddedCloseWrite = cache(sequential(EmptyLines, Space, oneOf(Eof, makeEmbeddedRule("embeddedCloseWrite", EMBED_CLOSE_WRITE_DEFAULT))));
  ColonEmbeddedClose = cache(sequential(Colon, EmbeddedClose));
  ColonEmbeddedCloseWrite = cache(sequential(Colon, EmbeddedCloseWrite));
  NotEmbeddedOpenComment = cache(except(EmbeddedOpenComment));
  NotEmbeddedOpenWrite = cache(except(EmbeddedOpenWrite));
  disallowEmbeddedText = makeAlterStack.generic(Boolean)("allowEmbeddedText", false);
  EmbeddedWriteExpression = cache(disallowEmbeddedText((_ref = sequential(
    NotEmbeddedOpenComment,
    EmbeddedOpenWrite,
    ["this", Expression],
    EmbeddedCloseWrite
  ), mutate(function (node, parser, index) {
    return parser.EmbedWrite(index, node, true);
  })(_ref))));
  EmbeddedLiteralTextInnerPart = cache(oneOf(EmbeddedComment, EmbeddedWriteExpression, EmbeddedReadLiteralText));
  EmbeddedLiteralTextInner = cache((_ref = zeroOrMore(EmbeddedLiteralTextInnerPart), mutate(function (nodes, parser, index) {
    return parser.Block(index, nodes);
  })(_ref)));
  EmbeddedLiteralText = cache(sequential(
    function (parser, index) {
      if (parser.options.embedded && parser.allowEmbeddedText.peek() && index < parser.source.length) {
        return Box(index);
      }
    },
    EmbeddedClose,
    ["this", EmbeddedLiteralTextInner],
    oneOf(Eof, sequential(NotEmbeddedOpenComment, NotEmbeddedOpenWrite, EmbeddedOpen))
  ));
  Semicolon = cache(withSpace(SemicolonChar));
  Semicolons = cache(zeroOrMore(Semicolon, true));
  Line = cache((function () {
    var SemicolonsStatement;
    SemicolonsStatement = sequential(Semicolons, ["this", Statement]);
    return function (parser, index) {
      var currentIndex, endSemis, indent, needSemicolon, parts, ret;
      indent = CheckIndent(parser, index);
      if (!indent) {
        return;
      }
      currentIndex = index;
      parts = [];
      needSemicolon = false;
      while (true) {
        ret = EmbeddedLiteralText(parser, currentIndex);
        if (ret) {
          if (!(ret.value instanceof Node)) {
            throw TypeError("Expected EmbeddedLiteralText to return a Node, got " + __typeof(ret.value));
          }
          needSemicolon = false;
          parts.push(ret.value);
          currentIndex = ret.index;
        } else {
          ret = needSemicolon ? SemicolonsStatement(parser, currentIndex) : Statement(parser, currentIndex);
          if (ret) {
            if (!(ret.value instanceof Node)) {
              throw TypeError("Expected " + (needSemicolon ? "Semicolons" : "") + "Statement to return a Node, got " + __typeof(ret.value));
            }
            needSemicolon = true;
            parts.push(ret.value);
            currentIndex = ret.index;
          } else {
            break;
          }
        }
      }
      if (parts.length === 0) {
        return;
      }
      endSemis = Semicolons(parser, currentIndex);
      if (endSemis) {
        currentIndex = endSemis.index;
      }
      return Box(currentIndex, parts);
    };
  }()));
  function _BlockMutator(lines, parser, index) {
    var _arr, _arr2, _len, _len2, i, item, j, nodes, part;
    nodes = [];
    for (_arr = __toArray(lines), i = 0, _len = _arr.length; i < _len; ++i) {
      item = _arr[i];
      for (_arr2 = __toArray(item), j = 0, _len2 = _arr2.length; j < _len2; ++j) {
        part = _arr2[j];
        if (!(part instanceof Node)) {
          throw TypeError("Expected lines[" + i + "][" + j + "] to be a Node, got " + __typeof(part));
        } else if (part instanceof BlockNode && item.label == null) {
          nodes.push.apply(nodes, __toArray(part.nodes));
        } else if (!(part instanceof NothingNode)) {
          nodes.push(part);
        }
      }
    }
    switch (nodes.length) {
    case 0: return parser.Nothing(index);
    case 1: return nodes[0];
    default:
      return parser.Block(index, nodes);
    }
  }
  _BlockWithClearCache = (function () {
    var syncRule;
    syncRule = mutate(_BlockMutator, function (parser, index) {
      var currentIndex, head, item, result, separator;
      parser.clearCache();
      head = Line(parser, index);
      if (!head) {
        return;
      }
      result = [head.value];
      currentIndex = head.index;
      while (true) {
        parser.clearCache();
        separator = SomeEmptyLines(parser, currentIndex);
        if (!separator) {
          break;
        }
        item = Line(parser, separator.index);
        if (!item) {
          break;
        }
        currentIndex = item.index;
        result.push(item.value);
      }
      parser.clearCache();
      return Box(currentIndex, result);
    });
    return function (parser, index, callback) {
      var currentIndex, head, result;
      if (callback == null) {
        return syncRule(parser, index);
      }
      parser.clearCache();
      try {
        head = Line(parser, index);
      } catch (e) {
        return callback(e);
      }
      if (!head) {
        return callback(null);
      }
      parser.clearCache();
      result = [head.value];
      currentIndex = head.index;
      function next() {
        var item, separator;
        parser.clearCache();
        try {
          separator = SomeEmptyLines(parser, currentIndex);
        } catch (e) {
          return callback(e);
        }
        if (!separator) {
          return done();
        }
        try {
          item = Line(parser, separator.index);
        } catch (e) {
          return callback(e);
        }
        if (!item) {
          return done();
        }
        currentIndex = item.index;
        result.push(item.value);
        return setImmediate(next);
      }
      function done() {
        parser.clearCache();
        return callback(null, Box(currentIndex, _BlockMutator(result, parser, index)));
      }
      return setImmediate(next);
    };
  }());
  _Block = cache(mutate(_BlockMutator, separatedList(Line, SomeEmptyLines)));
  Block = cache(oneOf(
    sequential(CheckIndent, [
      "this",
      oneOf.generic(Node)(IndentedUnclosedObjectLiteralInner, IndentedUnclosedArrayLiteralInner)
    ]),
    _Block
  ));
  EmbeddedBlock = cache(sequential(
    NotEmbeddedOpenWrite,
    NotEmbeddedOpenComment,
    EmbeddedOpen,
    ["this", _Block],
    EmbeddedClose
  ));
  EmbeddedLiteralTextInnerPartWithBlock = cache(oneOf(EmbeddedLiteralTextInnerPart, EmbeddedBlock));
  EmbeddedLiteralTextInnerWithBlock = cache((_ref = zeroOrMore(EmbeddedLiteralTextInnerPartWithBlock), mutate(function (nodes, parser, index) {
    return parser.Block(index, nodes);
  })(_ref)));
  EmbeddedLiteralTextInnerWithBlockWithClearCache = (function () {
    function syncRule(parser, index) {
      var currentIndex, item, nodes;
      nodes = [];
      currentIndex = index;
      while (true) {
        parser.clearCache();
        item = EmbeddedLiteralTextInnerPartWithBlock(parser, currentIndex);
        if (!item) {
          break;
        }
        nodes.push(item.value);
        if (currentIndex === item.index) {
          throw Error("Infinite loop detected");
        }
        currentIndex = item.index;
      }
      parser.clearCache();
      return Box(currentIndex, parser.Block(index, nodes));
    }
    return function (parser, index, callback) {
      var currentIndex, nodes;
      if (callback == null) {
        return syncRule(parser, index);
      }
      nodes = [];
      currentIndex = index;
      function next() {
        var item;
        parser.clearCache();
        try {
          item = EmbeddedLiteralTextInnerPartWithBlock(parser, currentIndex);
        } catch (e) {
          return callback(e);
        }
        if (!item) {
          return done();
        }
        nodes.push(item.value);
        if (currentIndex === item.index) {
          return callback(Error("Infinite loop detected"));
        }
        currentIndex = item.index;
        parser.clearCache();
        return setImmediate(next);
      }
      function done() {
        parser.clearCache();
        return callback(null, Box(currentIndex, parser.Block(index, nodes)));
      }
      return next();
    };
  }());
  EndNoIndent = cache(sequential(EmptyLines, Space, maybe(Semicolons), word("end")));
  BodyWithIndent = cache(retainIndent(sequential(
    Space,
    Newline,
    EmptyLines,
    Advance,
    ["this", Block],
    PopIndent
  )));
  BodyNoIndentNoEnd = cache(sequential(
    function (parser, index) {
      if (ColonNewline(parser, index) || parser.options.embedded && (ColonEmbeddedClose(parser, index) || ColonEmbeddedCloseWrite(parser, index))) {
        return Box(index);
      }
    },
    Colon,
    EmptyLines,
    [
      "this",
      function (parser, index) {
        var indent;
        indent = parser.indent;
        indent.push(+indent.peek() + 1);
        try {
          return Block(parser, index);
        } finally {
          indent.pop();
        }
      }
    ]
  ));
  BodyNoIndent = cache(sequential(
    ["this", BodyNoIndentNoEnd],
    EndNoIndent
  ));
  Body = cache(function (parser, index) {
    var ret, scope;
    scope = parser.pushScope(true);
    if (parser.options.noindent) {
      ret = BodyNoIndent(parser, index);
    } else {
      ret = BodyWithIndent(parser, index);
    }
    parser.popScope();
    return ret;
  });
  BodyNoEnd = cache(function (parser, index) {
    var ret, scope;
    scope = parser.pushScope(true);
    if (parser.options.noindent) {
      ret = BodyNoIndentNoEnd(parser, index);
    } else {
      ret = BodyWithIndent(parser, index);
    }
    parser.popScope();
    return ret;
  });
  BOM = maybe(character('"\ufeff"', 65279));
  Shebang = maybe(sequential(HashSignChar, ExclamationPointChar, zeroOrMore(anyExcept(Newline))));
  function Root(parser, callback) {
    var _once, bom, empty, emptyAgain, endSpace, root, shebang;
    if (!(parser instanceof Parser)) {
      throw TypeError("Expected parser to be a " + __name(Parser) + ", got " + __typeof(parser));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    bom = BOM(parser, 0);
    shebang = Shebang(parser, bom.index);
    empty = EmptyLines(parser, shebang.index);
    parser.clearCache();
    if (callback != null) {
      return _BlockWithClearCache(parser, empty.index, (_once = false, function (err, root) {
        var emptyAgain, endSpace;
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        if (err != null) {
          parser.clearCache();
          return callback(err);
        }
        if (!root) {
          return callback(null, null);
        }
        emptyAgain = EmptyLines(parser, root.index);
        endSpace = Space(parser, emptyAgain.index);
        parser.clearCache();
        return callback(null, Box(endSpace.index, parser.Root(empty.index, parser.options.filename, root.value)));
      }));
    } else {
      try {
        root = _BlockWithClearCache(parser, 0);
        if (!root) {
          return;
        }
        emptyAgain = EmptyLines(parser, root.index);
        endSpace = Space(parser, emptyAgain.index);
        return Box(endSpace.index, parser.Root(0, parser.options.filename, root.value));
      } finally {
        parser.clearCache();
      }
    }
  }
  function EmbeddedRoot(parser, callback) {
    var _once, bom, root, shebang;
    if (!(parser instanceof Parser)) {
      throw TypeError("Expected parser to be a " + __name(Parser) + ", got " + __typeof(parser));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    bom = BOM(parser, 0);
    shebang = Shebang(parser, bom.index);
    parser.clearCache();
    if (callback != null) {
      return EmbeddedLiteralTextInnerWithBlockWithClearCache(parser, shebang.index, (_once = false, function (err, root) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        parser.clearCache();
        if (err != null) {
          return callback(err);
        }
        return callback(null, Box(root.index, parser.Root(
          0,
          parser.options.filename,
          root.value,
          true,
          parser.inGenerator.peek()
        )));
      }));
    } else {
      try {
        root = EmbeddedLiteralTextInnerWithBlockWithClearCache(parser, shebang.index);
        if (!root) {
          return;
        }
        return Box(root.index, parser.Root(
          0,
          parser.options.filename,
          root.value,
          true,
          parser.inGenerator.peek()
        ));
      } finally {
        parser.clearCache();
      }
    }
  }
  function EmbeddedRootGenerator(parser, callback) {
    var _once;
    if (!(parser instanceof Parser)) {
      throw TypeError("Expected parser to be a " + __name(Parser) + ", got " + __typeof(parser));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    parser.inGenerator.push(true);
    if (callback != null) {
      return EmbeddedRoot(parser, (_once = false, function (err, result) {
        if (_once) {
          throw Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        parser.inGenerator.pop();
        return callback(err, result);
      }));
    } else {
      try {
        return EmbeddedRoot(parser);
      } finally {
        parser.inGenerator.pop();
      }
    }
  }
  AnyObjectLiteral = cache(oneOf(UnclosedObjectLiteral, ObjectLiteral, IndentedUnclosedObjectLiteral));
  AnyArrayLiteral = cache(oneOf(ArrayLiteral, IndentedUnclosedArrayLiteral));
  DedentedBody = cache(withSpace(oneOf(
    sequential(Newline, EmptyLines, ["this", Block]),
    sequential(
      function (parser, index) {
        if (parser.options.embedded) {
          return Box(index);
        }
      },
      check(EmbeddedClose),
      EmptyLines,
      ["this", Block]
    ),
    Nothing
  )));
  Stack = __genericFunc(1, function (T) {
    var _instanceof_T;
    _instanceof_T = __getInstanceof(T);
    return (function () {
      var _Stack_prototype;
      function Stack(initial) {
        var _this;
        _this = this instanceof Stack ? this : __create(_Stack_prototype);
        if (!_instanceof_T(initial)) {
          throw TypeError("Expected initial to be a " + __name(T) + ", got " + __typeof(initial));
        }
        _this.initial = initial;
        _this.data = [];
        return _this;
      }
      _Stack_prototype = Stack.prototype;
      Stack.displayName = "Stack<" + (T != null ? __name(T) : "") + ">";
      _Stack_prototype.count = function () {
        return this.data.length;
      };
      _Stack_prototype.push = function (value) {
        if (!_instanceof_T(value)) {
          throw TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
        }
        this.data.push(value);
      };
      _Stack_prototype.pop = function () {
        var data;
        data = this.data;
        if (data.length === 0) {
          throw Error("Cannot pop");
        }
        return data.pop();
      };
      _Stack_prototype.canPop = function () {
        return __num(this.data.length) > 0;
      };
      _Stack_prototype.peek = function () {
        var data, len;
        data = this.data;
        len = data.length;
        if (len === 0) {
          return this.initial;
        } else {
          return data[__num(len) - 1];
        }
      };
      return Stack;
    }());
  });
  function makeMacroHolder() {
    return MacroHolder(
      {
        Logic: preventUnclosedObjectLiteral(Logic),
        Expression: Expression,
        Assignment: Assignment,
        ExpressionOrAssignment: ExpressionOrAssignment,
        FunctionDeclaration: FunctionDeclaration,
        Statement: Statement,
        Body: Body,
        BodyNoEnd: BodyNoEnd,
        GeneratorBody: GeneratorBody,
        GeneratorBodyNoEnd: GeneratorBodyNoEnd,
        End: End,
        Identifier: Identifier,
        SimpleAssignable: IdentifierOrSimpleAccess,
        Parameter: Parameter,
        InvocationArguments: InvocationArguments,
        ObjectLiteral: AnyObjectLiteral,
        ArrayLiteral: AnyArrayLiteral,
        DedentedBody: DedentedBody,
        ObjectKey: ObjectKey,
        Type: TypeReference,
        NoSpace: NoSpace,
        ColonEqual: ColonEqual
      },
      macroName,
      wordOrSymbol,
      oneOf,
      sequential
    );
  }
  Parser = (function () {
    var _Parser_prototype, ASSIGN_OPERATOR, BINARY_OPERATOR, DEFINE_SYNTAX, deserializeParams, deserializeParamType, macroDeserializers, macroSyntaxConstLiterals, macroSyntaxTypes, UNARY_OPERATOR;
    function Parser(source, macros, options) {
      var _this;
      _this = this instanceof Parser ? this : __create(_Parser_prototype);
      if (source == null) {
        source = "";
      } else if (typeof source !== "string") {
        throw TypeError("Expected source to be a String, got " + __typeof(source));
      }
      _this.source = source;
      if (macros == null) {
        macros = makeMacroHolder();
      } else if (!(macros instanceof MacroHolder)) {
        throw TypeError("Expected macros to be a " + __name(MacroHolder) + ", got " + __typeof(macros));
      }
      _this.macros = macros;
      if (options == null) {
        options = {};
      } else if (typeof options !== "object" || options === null) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      _this.options = options;
      _this.indent = Stack.generic(Number)(0);
      _this.position = Stack.generic(String)("statement");
      _this.inAst = Stack.generic(Boolean)(false);
      _this.inGenerator = Stack.generic(Boolean)(false);
      _this.inFunctionTypeParams = Stack.generic(Boolean)(false);
      _this.preventUnclosedObjectLiteral = Stack.generic(Boolean)(false);
      _this.allowEmbeddedText = Stack.generic(Boolean)(true);
      _this.inMacro = Stack.generic(Boolean)(false);
      _this.inAst = Stack.generic(Boolean)(false);
      _this.inEvilAst = Stack.generic(Boolean)(false);
      _this.asterixAsArrayLength = Stack.generic(Boolean)(false);
      _this.scope = Stack.generic(Scope)(Scope(null, true));
      _this.failureMessages = [];
      _this.failureIndex = -1;
      _this.calculateLineInfo();
      _this.cache = [];
      _this.currentTmpId = -1;
      return _this;
    }
    _Parser_prototype = Parser.prototype;
    Parser.displayName = "Parser";
    _Parser_prototype.buildError = function (message, node) {
      var index;
      if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
      }
      if (typeof node !== "number" && !(node instanceof Node)) {
        throw TypeError("Expected node to be one of Number or " + __name(Node) + ", got " + __typeof(node));
      }
      if (typeof node === "number") {
        index = node;
      } else {
        index = this.indexFromPosition(node.line, node.column);
      }
      return MacroError(message, this, index);
    };
    _Parser_prototype.makeTmp = function (index, name, type) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a " + __name(Type) + ", got " + __typeof(type));
      }
      return this.Tmp(index, this.currentTmpId = __num(this.currentTmpId) + 1, name, type);
    };
    _Parser_prototype.calculateLineInfo = function () {
      var index, lineInfo, match, newlineRegex, source;
      newlineRegex = /(?:\r\n?|[\n\u2028\u2029])/g;
      source = this.source;
      lineInfo = this.lineInfo = [];
      index = 0;
      lineInfo.push(0);
      while (true) {
        match = newlineRegex.exec(source);
        if (!match) {
          break;
        }
        index = __num(match.index) + __num(match[0].length);
        lineInfo.push(index);
      }
    };
    _Parser_prototype.indexFromPosition = function (line, column) {
      var lineInfo;
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (typeof column !== "number") {
        throw TypeError("Expected column to be a Number, got " + __typeof(column));
      }
      lineInfo = this.lineInfo[line - 1];
      if (lineInfo != null) {
        return __num(lineInfo) + column - 1;
      } else {
        return 0;
      }
    };
    _Parser_prototype.getPosition = function (index) {
      var current, i, left, lineInfo, right;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      lineInfo = this.lineInfo;
      left = 0;
      right = lineInfo.length;
      while (left !== right) {
        i = Math.floor((left + right) / 2);
        current = lineInfo[i];
        if (current > index) {
          right = i;
        } else if (current < index) {
          if (left === i) {
            break;
          }
          left = i;
        } else {
          left = i;
          break;
        }
      }
      return { line: left + 1, column: index - __num(lineInfo[left]) + 1 };
    };
    _Parser_prototype.getLine = function (index) {
      if (index == null) {
        index = this.index;
      } else if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      return this.getPosition(index).line;
    };
    _Parser_prototype.fail = function (message, index) {
      if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
      }
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (index > __num(this.failureIndex)) {
        this.failureMessages = [];
        this.failureIndex = index;
      }
      if (index >= __num(this.failureIndex)) {
        this.failureMessages.push(message);
      }
    };
    function buildExpected(messages) {
      var errors;
      errors = unique(messages).sort(function (a, b) {
        return __cmp(a.toLowerCase(), b.toLowerCase());
      });
      switch (errors.length) {
      case 0: return "End of input";
      case 1: return errors[0];
      case 2: return __strnum(errors[0]) + " or " + __strnum(errors[1]);
      default:
        return __strnum(__slice.call(errors, 0, -1).join(", ")) + ", or " + __strnum(errors[__num(errors.length) - 1]);
      }
    }
    _Parser_prototype.getFailure = function (index) {
      var lastToken, source;
      if (index == null) {
        index = this.failureIndex;
      } else if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      source = this.source;
      if (index < __num(source.length)) {
        lastToken = JSON.stringify(source.substring(index, index + 20));
      } else {
        lastToken = "end-of-input";
      }
      return ParserError("Expected " + __strnum(buildExpected(this.failureMessages)) + ", but " + __str(lastToken) + " found", this, index);
    };
    _Parser_prototype.pushScope = function (isTop, parent) {
      var scope;
      if (isTop == null) {
        isTop = false;
      } else if (typeof isTop !== "boolean") {
        throw TypeError("Expected isTop to be a Boolean, got " + __typeof(isTop));
      }
      if (parent == null) {
        parent = null;
      } else if (!(parent instanceof Scope)) {
        throw TypeError("Expected parent to be one of " + (__name(Scope) + " or null") + ", got " + __typeof(parent));
      }
      scope = (parent || this.scope.peek()).clone(isTop);
      this.scope.push(scope);
      return scope;
    };
    _Parser_prototype.popScope = function () {
      this.scope.pop();
    };
    _Parser_prototype.hasMacroOrOperator = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return this.macros.hasMacroOrOperator(name);
    };
    _Parser_prototype.assignOperators = function () {
      return this.macros.assignOperators;
    };
    _Parser_prototype.allBinaryOperators = function () {
      return this.macros.allBinaryOperators();
    };
    _Parser_prototype.binaryOperators = function (precedence) {
      return this.macros.binaryOperators[precedence];
    };
    _Parser_prototype.prefixUnaryOperators = function () {
      return this.macros.prefixUnaryOperators;
    };
    _Parser_prototype.postfixUnaryOperators = function () {
      return this.macros.postfixUnaryOperators;
    };
    _Parser_prototype.getMacroByName = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return this.macros.getByName(name);
    };
    _Parser_prototype.getMacroByLabel = function (label) {
      if (typeof label !== "string") {
        throw TypeError("Expected label to be a String, got " + __typeof(label));
      }
      return this.macros.getByLabel(label);
    };
    _Parser_prototype.enterMacro = function (index, names) {
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!names) {
        throw Error("Must provide a macro name");
      }
      if (this.currentMacro) {
        throw ParserError("Attempting to define a macro " + __strnum(quote(String(names))) + " inside a macro " + __strnum(quote(String(this.currentMacro))), this, index);
      }
      this.currentMacro = names;
    };
    _Parser_prototype.exitMacro = function () {
      if (!this.currentMacro) {
        throw Error("Attempting to exit a macro when not in one");
      }
      this.currentMacro = null;
    };
    _Parser_prototype.defineHelper = function (i, name, value) {
      var _ref, dependencies, helper, node, translator, type;
      if (!(name instanceof IdentNode)) {
        throw TypeError("Expected name to be a " + __name(IdentNode) + ", got " + __typeof(name));
      }
      if (!(value instanceof Node)) {
        throw TypeError("Expected value to be a " + __name(Node) + ", got " + __typeof(value));
      }
      translator = require("./jstranslator");
      node = this.macroExpandAll(value).reduce(this);
      type = node.type(this);
      helper = (_ref = translator.defineHelper(this.macros, name, node, type)).helper;
      dependencies = _ref.dependencies;
      if (this.options.serializeMacros) {
        this.macros.addSerializedHelper(name.name, helper, type, dependencies);
      }
    };
    macroSyntaxConstLiterals = {
      ",": Comma,
      ";": Semicolon,
      ":": Colon,
      ":=": ColonEqual,
      "": Nothing,
      "\n": SomeEmptyLinesWithCheckIndent,
      "<": LessThan,
      ">": GreaterThan,
      "(": OpenParenthesis,
      ")": CloseParenthesis,
      "[": OpenSquareBracket,
      "]": CloseSquareBracket,
      "{": OpenCurlyBrace,
      "}": CloseCurlyBrace,
      end: End
    };
    function reduceObject(o, obj) {
      var _arr, _arr2, _i, _len, item, k, result, v;
      if (__isArray(obj)) {
        for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          _arr.push(reduceObject(o, item));
        }
        return _arr;
      } else if (obj instanceof Node) {
        return obj.reduce(o);
      } else if (typeof obj === "object" && obj !== null) {
        result = {};
        for (k in obj) {
          if (__owns.call(obj, k)) {
            v = obj[k];
            result[k] = reduceObject(o, v);
          }
        }
        return result;
      } else {
        return obj;
      }
    }
    function makeMacroRoot(index, params, body) {
      return this.Root(index, void 0, this.Return(
        index,
        this.Function(
          index,
          [
            params,
            this.Param(
              index,
              this.Ident(index, "__wrap"),
              void 0,
              false,
              true,
              void 0
            ),
            this.Param(
              index,
              this.Ident(index, "__node"),
              void 0,
              false,
              true,
              void 0
            )
          ],
          body,
          true,
          false
        ),
        false
      ));
    }
    function serializeParamType(asType) {
      if (asType instanceof IdentNode) {
        return ["ident", asType.name];
      } else if (asType instanceof SyntaxSequenceNode) {
        return ["sequence"].concat(__toArray(fixArray(serializeParams(asType.params))));
      } else if (asType instanceof SyntaxChoiceNode) {
        return ["choice"].concat((function () {
          var _arr, _arr2, _i, _len, choice;
          for (_arr = [], _arr2 = __toArray(asType.choices), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            choice = _arr2[_i];
            _arr.push(serializeParamType(choice));
          }
          return _arr;
        }()));
      } else if (asType.isConst()) {
        return ["const", asType.constValue()];
      } else if (asType instanceof SyntaxManyNode) {
        return ["many", asType.multiplier].concat(__toArray(serializeParamType(asType.inner)));
      } else {
        throw Error("Unknown param type: " + __typeof(asType));
      }
    }
    function serializeParams(params) {
      return simplifyArray((function () {
        var _arr, _arr2, _i, _len, ident, param, value;
        for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          param = _arr2[_i];
          if (param.isConst()) {
            _arr.push(["const", param.constValue()]);
          } else if (param instanceof SyntaxParamNode) {
            ident = param.ident;
            if (ident instanceof IdentNode) {
              value = ["ident", ident.name];
            } else if (ident instanceof ThisNode) {
              value = ["this"];
            } else {
              throw Error();
            }
            if (param.asType) {
              value.push.apply(value, __toArray(serializeParamType(param.asType)));
            }
            _arr.push(value);
          } else {
            throw Error();
          }
        }
        return _arr;
      }()));
    }
    deserializeParamType = (function () {
      var deserializeParamTypeByType;
      deserializeParamTypeByType = {
        ident: function (scope, name) {
          return IdentNode(0, 0, scope, name);
        },
        sequence: function (scope) {
          var items;
          items = __slice.call(arguments, 1);
          return SyntaxSequenceNode(0, 0, scope, deserializeParams(items, scope));
        },
        choice: function (scope) {
          var choices;
          choices = __slice.call(arguments, 1);
          return SyntaxChoiceNode(0, 0, scope, (function () {
            var _arr, _i, _len, choice;
            for (_arr = [], _i = 0, _len = choices.length; _i < _len; ++_i) {
              choice = choices[_i];
              _arr.push(deserializeParamType(choice, scope));
            }
            return _arr;
          }()));
        },
        "const": function (scope, value) {
          return ConstNode(0, 0, scope, value);
        },
        many: function (scope, multiplier) {
          var inner;
          inner = __slice.call(arguments, 2);
          return SyntaxManyNode(
            0,
            0,
            scope,
            deserializeParamType(inner, scope),
            multiplier
          );
        }
      };
      return function (asType, scope) {
        var type;
        if (asType == null) {
          asType = [];
        } else if (!__isArray(asType)) {
          throw TypeError("Expected asType to be an Array, got " + __typeof(asType));
        }
        if (asType.length === 0) {
          return;
        } else {
          type = asType[0];
          if (__owns.call(deserializeParamTypeByType, type)) {
            return deserializeParamTypeByType[type].apply(deserializeParamTypeByType, [scope].concat(__toArray(__slice.call(asType, 1))));
          } else {
            throw Error("Unknown as-type: " + String(type));
          }
        }
      };
    }());
    deserializeParams = (function () {
      var deserializeParamByType;
      deserializeParamByType = {
        "const": function (scope, value) {
          return ConstNode(0, 0, scope, value);
        },
        ident: function (scope, name) {
          var asType;
          asType = __slice.call(arguments, 2);
          return SyntaxParamNode(
            0,
            0,
            scope,
            IdentNode(0, 0, scope, name),
            deserializeParamType(asType, scope)
          );
        },
        "this": function (scope) {
          var asType;
          asType = __slice.call(arguments, 1);
          return SyntaxParamNode(
            0,
            0,
            scope,
            ThisNode(0, 0, scope),
            deserializeParamType(asType, scope)
          );
        }
      };
      return function (params, scope) {
        var _arr, _arr2, _i, _len, param, type;
        if (!(scope instanceof Scope)) {
          throw TypeError("Expected scope to be a " + __name(Scope) + ", got " + __typeof(scope));
        }
        for (_arr = [], _arr2 = __toArray(fixArray(params)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          param = _arr2[_i];
          type = param[0];
          if (__owns.call(deserializeParamByType, type)) {
            _arr.push(deserializeParamByType[type].apply(deserializeParamByType, [scope].concat(__toArray(__slice.call(param, 1)))));
          } else {
            throw Error("Unknown param type: " + String(type));
          }
        }
        return _arr;
      };
    }());
    function calcParam(param) {
      var _this, calced, macros, multiplier, name, string;
      _this = this;
      if (param instanceof IdentNode) {
        name = param.name;
        macros = this.macros;
        if (macros.hasSyntax(name)) {
          return macros.getSyntax(name);
        } else {
          return function (parser, index) {
            return macros.getSyntax(name).call(this, parser, index);
          };
        }
      } else if (param instanceof SyntaxSequenceNode) {
        return handleParams.call(this, param.params);
      } else if (param instanceof SyntaxChoiceNode) {
        return oneOf.apply(void 0, (function () {
          var _arr, _arr2, _i, _len, choice;
          for (_arr = [], _arr2 = __toArray(param.choices), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            choice = _arr2[_i];
            _arr.push(calcParam.call(_this, choice));
          }
          return _arr;
        }()));
      } else if (param.isConst()) {
        string = param.constValue();
        if (typeof string !== "string") {
          this.error("Expected a constant string parameter, got " + __typeof(string));
        }
        return __owns.call(macroSyntaxConstLiterals, string) && macroSyntaxConstLiterals[string] || wordOrSymbol(string);
      } else if (param instanceof SyntaxManyNode) {
        multiplier = param.multiplier;
        calced = calcParam.call(this, param.inner);
        switch (multiplier) {
        case "*": return zeroOrMore(calced);
        case "+": return oneOrMore(calced);
        case "?":
          return oneOf(calced, Nothing);
        default: throw Error("Unknown syntax multiplier: " + __strnum(multiplier));
        }
      } else {
        return this.error("Unexpected type: " + __typeof(param));
      }
    }
    function handleParams(params) {
      var _arr, _i, _len, _ref, ident, key, param, sequence, string, type;
      sequence = [];
      for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        param = _arr[_i];
        if (param.isConst()) {
          string = param.constValue();
          if (typeof string !== "string") {
            this.error("Expected a constant string parameter, got " + __typeof(string));
          }
          sequence.push(__owns.call(macroSyntaxConstLiterals, string) && macroSyntaxConstLiterals[string] || wordOrSymbol(string));
        } else if (param instanceof SyntaxParamNode) {
          ident = param.ident;
          if (ident instanceof IdentNode) {
            key = ident.name;
          } else if (ident instanceof ThisNode) {
            key = "this";
          } else {
            throw Error("Don't know how to handle ident type: " + __typeof(ident));
          }
          if ((_ref = param.asType) != null) {
            type = _ref;
          } else {
            type = IdentNode(0, 0, param.scope, "Expression");
          }
          sequence.push([
            key,
            calcParam.call(this, type)
          ]);
        } else {
          this.error("Unexpected parameter type: " + __typeof(param));
        }
      }
      return sequential.apply(void 0, __toArray(sequence));
    }
    function simplifyArray(operators) {
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      }
      if (operators.length === 0) {
        return;
      } else if (operators.length === 1 && !__isArray(operators[0])) {
        return operators[0];
      } else {
        return operators;
      }
    }
    function simplifyObject(options) {
      var k, v;
      if (typeof options !== "object" || options === null) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      for (k in options) {
        if (__owns.call(options, k)) {
          v = options[k];
          return options;
        }
      }
      return;
    }
    function getCompilationOptions(stateOptions) {
      if (typeof stateOptions !== "object" || stateOptions === null) {
        throw TypeError("Expected stateOptions to be an Object, got " + __typeof(stateOptions));
      }
      if (stateOptions.serializeMacros) {
        return { minify: true };
      } else {
        return {};
      }
    }
    macroSyntaxTypes = {
      syntax: function (index, params, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, macroFullDataIdent, macroNameIdent, rawFunc, scope, serialization, state, translated;
        _this = this;
        macroFullDataIdent = this.Ident(index, "macroFullData");
        funcParam = this.Param(
          index,
          macroFullDataIdent,
          void 0,
          false,
          false,
          void 0
        );
        macroNameIdent = this.Ident(index, "macroName");
        scope = this.scope.peek();
        scope.add(macroNameIdent, false, Type.string);
        macroDataIdent = this.Ident(index, "macroData");
        scope.add(macroDataIdent, false, Type.object);
        body = this.Block(index, [
          this.Var(index, macroNameIdent, false),
          this.Assign(index, macroNameIdent, "=", this.Access(index, macroFullDataIdent, this.Const(index, "macroName"))),
          this.Var(index, macroDataIdent, false),
          this.Assign(index, macroDataIdent, "=", this.Access(index, macroFullDataIdent, this.Const(index, "macroData")))
        ].concat(
          (function () {
            var _arr, _arr2, _i, _len, param;
            for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              param = _arr2[_i];
              if (param instanceof SyntaxParamNode) {
                scope.add(param.ident, true, Type.any);
                _arr.push(_this.Block(index, [
                  _this.Var(index, param.ident, true),
                  _this.Assign(index, param.ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, param.ident.name)))
                ]));
              }
            }
            return _arr;
          }()),
          [body]
        ));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for macro: " + String(this.currentMacro));
        }
        state = this;
        return {
          handler: function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return handler.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          },
          rule: handleParams.call(this, params),
          serialization: serialization != null
            ? {
              type: "syntax",
              code: serialization,
              options: simplifyObject(options),
              params: serializeParams(params),
              names: simplifyArray(this.currentMacro)
            }
            : void 0
        };
      },
      defineSyntax: function (index, params, body, options, stateOptions, translator) {
        var _this, handler, serialization, state;
        _this = this;
        state = this;
        if (body != null) {
          handler = (function () {
            var compilation, funcParam, handler, macroDataIdent, rawFunc, scope, translated;
            macroDataIdent = _this.Ident(index, "macroData");
            funcParam = _this.Param(
              index,
              macroDataIdent,
              void 0,
              false,
              false,
              void 0
            );
            scope = _this.scope.peek();
            body = _this.Block(index, (function () {
              var _arr, _arr2, _i, _len, param;
              for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                param = _arr2[_i];
                if (param instanceof SyntaxParamNode) {
                  scope.add(param.ident, true, Type.any);
                  _arr.push(_this.Block(index, [
                    _this.Var(index, param.ident, true),
                    _this.Assign(index, param.ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, param.ident.name)))
                  ]));
                }
              }
              return _arr;
            }()).concat([body]));
            rawFunc = makeMacroRoot.call(_this, index, funcParam, body);
            translated = translator(_this.macroExpandAll(rawFunc).reduce(state), _this.macros, { "return": true });
            compilation = translated.node.toString(getCompilationOptions(stateOptions));
            if (stateOptions.serializeMacros) {
              serialization = compilation;
            }
            handler = Function(compilation)();
            if (typeof handler !== "function") {
              throw Error("Error creating function for syntax: " + __strnum(options.name));
            }
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return reduceObject(state, handler.apply(this, [reduceObject(state, args)].concat(__toArray(rest))));
            };
          }());
        } else {
          handler = function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return reduceObject(state, args);
          };
        }
        return {
          handler: handler,
          rule: handleParams.call(this, params),
          serialization: stateOptions.serializeMacros ? { type: "defineSyntax", code: serialization, options: simplifyObject(options), params: serializeParams(params) } : void 0
        };
      },
      call: function (index, params, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, macroFullDataIdent, macroNameIdent, rawFunc, scope, serialization, state, translated;
        _this = this;
        macroFullDataIdent = this.Ident(index, "macroFullData");
        funcParam = this.Param(
          index,
          macroFullDataIdent,
          void 0,
          false,
          false,
          void 0
        );
        scope = this.scope.peek();
        macroNameIdent = this.Ident(index, "macroName");
        scope.add(macroNameIdent, false, Type.string);
        macroDataIdent = this.Ident(index, "macroData");
        scope.add(macroDataIdent, false, Type.object);
        body = this.Block(index, [
          this.Var(index, macroNameIdent, false),
          this.Assign(index, macroNameIdent, "=", this.Access(index, macroFullDataIdent, this.Const(index, "macroName"))),
          this.Var(index, macroDataIdent, false),
          this.Assign(index, macroDataIdent, "=", this.Access(index, macroFullDataIdent, this.Const(index, "macroData")))
        ].concat(
          (function () {
            var _arr, _arr2, _len, i, param;
            for (_arr = [], _arr2 = __toArray(params), i = 0, _len = _arr2.length; i < _len; ++i) {
              param = _arr2[i];
              if (param instanceof ParamNode) {
                scope.add(param.ident, true, Type.any);
                _arr.push(_this.Block(index, [
                  _this.Var(index, param.ident, true),
                  _this.Assign(index, param.ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, i)))
                ]));
              }
            }
            return _arr;
          }()),
          [body]
        ));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for macro: " + __strnum(this.currentMacro));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: InvocationArguments,
          serialization: serialization != null ? { type: "call", code: serialization, options: simplifyObject(options), names: simplifyArray(this.currentMacro) } : void 0
        };
      },
      binaryOperator: function (index, operators, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc, scope, serialization, state, translated;
        _this = this;
        macroDataIdent = this.Ident(index, "macroData");
        funcParam = this.Param(
          index,
          macroDataIdent,
          void 0,
          false,
          false,
          void 0
        );
        scope = this.scope.peek();
        body = this.Block(index, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          for (_arr = [], _arr2 = ["left", "op", "right"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = _this.Ident(index, name);
            scope.add(ident, true, Type.any);
            _arr.push(_this.Block(index, [
              _this.Var(index, ident, true),
              _this.Assign(index, ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, name)))
            ]));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for binary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice.call(arguments, 1);
              result = inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return UnaryNode(
                  result.line,
                  result.column,
                  result.scope,
                  "!",
                  result
                ).reduce(state);
              } else {
                return result.reduce(state);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
            };
          }(handler));
        }
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "binaryOperator", code: serialization, operators: simplifyArray(operators), options: simplifyObject(options) } : void 0
        };
      },
      assignOperator: function (index, operators, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc, scope, serialization, state, translated;
        _this = this;
        macroDataIdent = this.Ident(index, "macroData");
        funcParam = this.Param(
          index,
          macroDataIdent,
          void 0,
          false,
          false,
          void 0
        );
        scope = this.scope.peek();
        body = this.Block(index, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          for (_arr = [], _arr2 = ["left", "op", "right"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = _this.Ident(index, name);
            scope.add(ident, true, Type.any);
            _arr.push(_this.Block(index, [
              _this.Var(index, ident, true),
              _this.Assign(index, ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, name)))
            ]));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for assign operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "assignOperator", code: serialization, operators: simplifyArray(operators), options: simplifyObject(options) } : void 0
        };
      },
      unaryOperator: function (index, operators, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc, scope, serialization, state, translated;
        _this = this;
        macroDataIdent = this.Ident(index, "macroData");
        funcParam = this.Param(
          index,
          macroDataIdent,
          void 0,
          false,
          false,
          void 0
        );
        scope = this.scope.peek();
        body = this.Block(index, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          for (_arr = [], _arr2 = ["op", "node"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = _this.Ident(index, name);
            scope.add(ident, true, Type.any);
            _arr.push(_this.Block(index, [
              _this.Var(index, ident, true),
              _this.Assign(index, ident, "=", _this.Access(index, macroDataIdent, _this.Const(index, name)))
            ]));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for unary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "unaryOperator", code: serialization, operators: simplifyArray(operators), options: simplifyObject(options) } : void 0
        };
      }
    };
    function fixArray(operators) {
      if (operators == null) {
        return [];
      } else if (__isArray(operators)) {
        return operators;
      } else {
        return [operators];
      }
    }
    macroDeserializers = {
      syntax: function (_p) {
        var _this, code, handler, id, names, options, params, state;
        _this = this;
        code = _p.code;
        params = _p.params;
        names = _p.names;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        names = fixArray(names);
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for macro " + __strnum(name));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        this.enterMacro(0, names);
        handleMacroSyntax.call(
          this,
          0,
          "syntax",
          handler,
          handleParams.call(this, deserializeParams(params, this.scope.peek())),
          null,
          options,
          id
        );
        return this.exitMacro();
      },
      call: function (_p) {
        var _this, code, handler, id, names, options, state;
        _this = this;
        code = _p.code;
        names = _p.names;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        names = fixArray(names);
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for macro " + __strnum(name));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        this.enterMacro(0, names);
        handleMacroSyntax.call(
          this,
          0,
          "call",
          handler,
          InvocationArguments,
          null,
          options,
          id
        );
        return this.exitMacro();
      },
      defineSyntax: function (_p) {
        var _this, code, handler, id, options, params, state;
        _this = this;
        code = _p.code;
        params = _p.params;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        if (this.macros.hasSyntax(options.name)) {
          throw Error("Cannot override already-defined syntax: " + __strnum(options.name));
        }
        state = this;
        if (code != null) {
          handler = Function(code)();
          if (typeof handler !== "function") {
            throw Error("Error deserializing function for macro syntax " + __strnum(options.name));
          }
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return reduceObject(state, inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))));
            };
          }(handler));
        } else {
          handler = function (args) {
            return reduceObject(state, args);
          };
        }
        this.enterMacro(0, DEFINE_SYNTAX);
        handleMacroSyntax.call(
          this,
          0,
          "defineSyntax",
          handler,
          handleParams.call(this, deserializeParams(params, this.scope.peek())),
          null,
          options,
          id
        );
        return this.exitMacro();
      },
      binaryOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for binary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice.call(arguments, 1);
              result = inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return UnaryNode(
                  result.line,
                  result.column,
                  result.scope,
                  "!",
                  result
                ).reduce(state);
              } else {
                return result.reduce(state);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
            };
          }(handler));
        }
        this.enterMacro(0, BINARY_OPERATOR);
        handleMacroSyntax.call(
          this,
          0,
          "binaryOperator",
          handler,
          void 0,
          operators,
          options,
          id
        );
        return this.exitMacro();
      },
      assignOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for assign operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        this.enterMacro(0, ASSIGN_OPERATOR);
        handleMacroSyntax.call(
          this,
          0,
          "assignOperator",
          handler,
          void 0,
          operators,
          options,
          id
        );
        return this.exitMacro();
      },
      unaryOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for unary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        this.enterMacro(0, UNARY_OPERATOR);
        handleMacroSyntax.call(
          this,
          0,
          "unaryOperator",
          handler,
          void 0,
          operators,
          options,
          id
        );
        this.exitMacro();
      }
    };
    function removeNoops(obj) {
      var _arr, _arr2, _i, _len, item, k, result, v;
      if (__isArray(obj)) {
        for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          if (item instanceof NothingNode) {
            _arr.push(void 0);
          } else {
            _arr.push(removeNoops(item));
          }
        }
        return _arr;
      } else if (obj instanceof Node) {
        return obj;
      } else if (typeof obj === "object" && obj !== null && !(obj instanceof RegExp)) {
        result = {};
        for (k in obj) {
          if (__owns.call(obj, k)) {
            v = obj[k];
            if (!(v instanceof NothingNode)) {
              result[k] = removeNoops(v);
            }
          }
        }
        return result;
      } else {
        return obj;
      }
    }
    _Parser_prototype.startMacroSyntax = function (index, params, options) {
      var _arr, _i, _len, _ref, m, macroId, macros, rule;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      }
      if (options == null) {
        options = {};
      }
      if (!this.currentMacro) {
        throw Error("Attempting to specify a macro syntax when not in a macro");
      }
      rule = handleParams.call(this, params);
      macros = this.macros;
      function mutator(data, parser, index) {
        if (parser.inAst.peek() || !parser.expandingMacros) {
          return parser.MacroAccess(
            index,
            macroId,
            parser.getLine(index),
            removeNoops(data),
            parser.position.peek(),
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
        } else {
          throw Error("Cannot use macro until fully defined");
        }
      }
      for (_arr = __toArray(macros.getOrAddByNames(this.currentMacro)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        m = _arr[_i];
        m.data.push((_ref = sequential(
          ["macroName", m.token],
          ["macroData", rule]
        ), mutate(mutator)(_ref)));
      }
      macroId = macros.addMacro(mutator, void 0, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
      this.pendingMacroId = macroId;
      return params;
    };
    function handleMacroSyntax(index, type, handler, rule, params, options, macroId) {
      var _this, macros;
      _this = this;
      if (typeof handler !== "function") {
        throw TypeError("Expected handler to be a Function, got " + __typeof(handler));
      }
      macros = this.macros;
      function mutator(data, parser, index) {
        var line, macroHelper, pos, result, scope, tmps, walker;
        if (parser.inAst.peek() || !parser.expandingMacros) {
          return parser.MacroAccess(
            index,
            macroId,
            parser.getLine(index),
            removeNoops(data),
            parser.position.peek(),
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
        } else {
          scope = parser.pushScope(false);
          macroHelper = MacroHelper(
            parser,
            index,
            parser.position.peek(),
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
          if (type === "assignOperator" && macroHelper.isIdent(data.left)) {
            if (!macroHelper.hasVariable(data.left)) {
              throw parser.buildError("Trying to assign with " + __strnum(data.op) + " to unknown variable '" + __strnum(macroHelper.name(data.left)) + "'", data.left);
            } else if (!macroHelper.isVariableMutable(data.left) && !parser.inEvilAst.peek()) {
              throw parser.buildError("Trying to assign with " + __strnum(data.op) + " to immutable variable '" + __strnum(macroHelper.name(data.left)) + "'", data.left);
            }
          }
          try {
            result = handler.call(
              macroHelper,
              removeNoops(data),
              __bind(macroHelper, "wrap"),
              __bind(macroHelper, "node")
            );
          } catch (e) {
            if (e instanceof ReferenceError) {
              throw e;
            } else if (e instanceof MacroError) {
              pos = parser.getPosition(index);
              e.setPosition(pos.line, pos.column);
              throw e;
            } else {
              throw MacroError(e, parser, index);
            }
          }
          parser.popScope();
          if (result instanceof Node) {
            line = parser.getLine(index);
            walker = function (node) {
              if (node instanceof MacroAccessNode) {
                node.callLine = line;
              }
              return node.walk(walker);
            };
            result = walker(result.reduce(_this));
            tmps = macroHelper.getTmps();
            if (tmps.unsaved.length) {
              return parser.TmpWrapper(index, result, tmps.unsaved);
            } else {
              return result;
            }
          } else {
            return result;
          }
        }
      }
      return macroId = (function () {
        var _arr, _i, _len, _ref, id, m;
        switch (_this.currentMacro) {
        case BINARY_OPERATOR:
          return macros.addBinaryOperator(params, mutator, options, macroId);
        case ASSIGN_OPERATOR:
          return macros.addAssignOperator(params, mutator, options, macroId);
        case UNARY_OPERATOR:
          return macros.addUnaryOperator(params, mutator, options, macroId);
        case DEFINE_SYNTAX:
          if (!rule) {
            throw Error("Expected rule to exist");
          }
          macros.addSyntax(options.name, mutate(mutator)(rule));
          return macros.addMacro(mutator, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
        default:
          if (!rule) {
            throw Error("Expected rule to exist");
          }
          for (_arr = __toArray(macros.getOrAddByNames(_this.currentMacro)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            m = _arr[_i];
            if (_this.pendingMacroId != null) {
              m.data.pop();
            }
            m.data.push(cache((_ref = sequential(
              ["macroName", m.token],
              ["macroData", rule]
            ), mutate(mutator)(_ref))));
          }
          if (_this.pendingMacroId != null) {
            if (macroId != null) {
              throw Error("Cannot provide the macro id if there is a pending macro id");
            }
            id = _this.pendingMacroId;
            _this.pendingMacroId = null;
            macros.replaceMacro(id, mutator, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
            return id;
          } else {
            return macros.addMacro(mutator, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
          }
        }
      }());
    }
    _Parser_prototype.macroSyntax = function (index, type, params, options, body) {
      var _ref, handler, macroId, rule, serialization;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      }
      if (!__owns.call(macroSyntaxTypes, type)) {
        throw Error("Unknown macro-syntax type: " + __strnum(type));
      }
      if (!this.currentMacro) {
        this.error("Attempting to specify a macro syntax when not in a macro");
      }
      handler = (_ref = macroSyntaxTypes[type].call(
        this,
        index,
        params,
        body,
        options,
        this.options,
        require("./jstranslator")
      )).handler;
      rule = _ref.rule;
      serialization = _ref.serialization;
      macroId = handleMacroSyntax.call(
        this,
        index,
        type,
        handler,
        rule,
        params,
        options
      );
      if (serialization != null) {
        serialization.id = macroId;
        this.macros.addMacroSerialization(serialization);
      }
    };
    BINARY_OPERATOR = {};
    _Parser_prototype.defineBinaryOperator = function (index, operators, options, body) {
      var _i;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = operators.length; _i--; ) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected " + ("operators[" + _i + "]") + " to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (typeof options !== "object" || options === null) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      this.enterMacro(index, BINARY_OPERATOR);
      this.macroSyntax(
        index,
        "binaryOperator",
        operators,
        options,
        body
      );
      return this.exitMacro();
    };
    ASSIGN_OPERATOR = {};
    _Parser_prototype.defineAssignOperator = function (index, operators, options, body) {
      var _i;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = operators.length; _i--; ) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected " + ("operators[" + _i + "]") + " to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (typeof options !== "object" || options === null) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      this.enterMacro(index, ASSIGN_OPERATOR);
      this.macroSyntax(
        index,
        "assignOperator",
        operators,
        options,
        body
      );
      return this.exitMacro();
    };
    UNARY_OPERATOR = {};
    _Parser_prototype.defineUnaryOperator = function (index, operators, options, body) {
      var _i;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = operators.length; _i--; ) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected " + ("operators[" + _i + "]") + " to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (typeof options !== "object" || options === null) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a " + __name(Node) + ", got " + __typeof(body));
      }
      this.enterMacro(index, UNARY_OPERATOR);
      this.macroSyntax(
        index,
        "unaryOperator",
        operators,
        options,
        body
      );
      return this.exitMacro();
    };
    DEFINE_SYNTAX = {};
    _Parser_prototype.defineSyntax = function (index, name, params, body) {
      this.enterMacro(index, DEFINE_SYNTAX);
      this.macroSyntax(
        index,
        "defineSyntax",
        params,
        { name: name },
        body
      );
      return this.exitMacro();
    };
    _Parser_prototype.deserializeMacros = function (data) {
      var _arr, _i, _len, _ref, deserializer, item, type;
      for (type in macroDeserializers) {
        if (__owns.call(macroDeserializers, type)) {
          deserializer = macroDeserializers[type];
          for (_arr = __toArray((_ref = __owns.call(data, type) ? data[type] : void 0) != null ? _ref : []), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            item = _arr[_i];
            deserializer.call(this, item);
          }
        }
      }
    };
    _Parser_prototype.macroExpand1 = function (node) {
      var _i, _len, n, nodes, oldExpandingMacros, result;
      if (node._macroExpanded != null) {
        return node._macroExpanded;
      } else if (node instanceof MacroAccessNode) {
        nodes = [];
        while (node instanceof MacroAccessNode) {
          nodes.push(node);
          this.position.push(node.position);
          this.inGenerator.push(node.inGenerator);
          this.inEvilAst.push(node.inEvilAst);
          this.scope.push(node.scope);
          oldExpandingMacros = this.expandingMacros;
          this.expandingMacros = true;
          result = void 0;
          try {
            result = this.macros.getById(node.id)(
              node.data,
              this,
              node.startIndex || 0,
              node.callLine,
              node.scope
            );
          } catch (e) {
            if (e instanceof MacroError) {
              e.setPosition(node.callLine, 0);
            }
            throw e;
          } finally {
            this.scope.pop();
            this.position.pop();
            this.inGenerator.pop();
            this.inEvilAst.pop();
            this.expandingMacros = oldExpandingMacros;
          }
          node = result;
        }
        for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
          n = nodes[_i];
          n._macroExpanded = node;
        }
        return node;
      } else {
        return node._macroExpanded = node;
      }
    };
    _Parser_prototype.macroExpandAllAsync = function (node, callback) {
      var _this, startTime;
      _this = this;
      startTime = new Date().getTime();
      function walker(node, callback) {
        var _once, _once2, expanded;
        if (__num(new Date().getTime()) - __num(startTime) > 5) {
          return setImmediate(function () {
            startTime = new Date().getTime();
            return walker(node, callback);
          });
        }
        if (node._macroExpandAlled != null) {
          return callback(null, node._macroExpandAlled);
        } else if (!(node instanceof MacroAccessNode)) {
          return node.walkAsync(walker, (_once = false, function (_e, walked) {
            if (_once) {
              throw Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return callback(null, walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked);
          }));
        } else {
          try {
            expanded = _this.macroExpand1(node);
          } catch (e) {
            return callback(e);
          }
          if (!(expanded instanceof Node)) {
            return callback(null, node._macroExpandAlled = node._macroExpanded = expanded);
          }
          return walker(expanded, (_once2 = false, function (_e, walked) {
            if (_once2) {
              throw Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return callback(null, expanded._macroExpandAlled = expanded._macroExpanded = walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked);
          }));
        }
      }
      return walker(node, callback);
    };
    _Parser_prototype.macroExpandAll = function (node, callback) {
      var _this;
      _this = this;
      function walker(node) {
        var expanded, walked;
        if (node._macroExpandAlled != null) {
          return node._macroExpandAlled;
        } else if (!(node instanceof MacroAccessNode)) {
          walked = node.walk(walker);
          return walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked;
        } else {
          expanded = _this.macroExpand1(node);
          if (!(expanded instanceof Node)) {
            return node._macroExpandAlled = node._macroExpanded = expanded;
          }
          walked = walker(expanded);
          return expanded._macroExpandAlled = expanded._macroExpanded = walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked;
        }
      }
      return walker(node);
    };
    _Parser_prototype.clearCache = function () {
      this.cache = [];
    };
    Parser.addNodeFactory = function (name, type) {
      Parser.prototype[name] = function (index) {
        var args, pos;
        args = __slice.call(arguments, 1);
        pos = this.getPosition(index);
        return type.apply(void 0, [pos.line, pos.column, this.scope.peek()].concat(__toArray(args)));
      };
    };
    return Parser;
  }());
  function parse(source, macros, options, callback) {
    var _f, parser, rootRule, startTime;
    if (typeof source !== "string") {
      throw TypeError("Expected source to be a String, got " + __typeof(source));
    }
    if (macros == null) {
      macros = null;
    } else if (!(macros instanceof MacroHolder)) {
      throw TypeError("Expected macros to be one of " + (__name(MacroHolder) + " or null") + ", got " + __typeof(macros));
    }
    if (options == null) {
      options = {};
    } else if (typeof options !== "object" || options === null) {
      throw TypeError("Expected options to be an Object, got " + __typeof(options));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be one of Function or null, got " + __typeof(callback));
    }
    parser = Parser(
      source,
      macros != null ? macros.clone() : void 0,
      options
    );
    if (options.embeddedGenerator) {
      rootRule = EmbeddedRootGenerator;
    } else if (options.embedded) {
      rootRule = EmbeddedRoot;
    } else {
      rootRule = Root;
    }
    startTime = new Date().getTime();
    if (callback != null) {
      _f = function (next) {
        var _once;
        return rootRule(parser, (_once = false, function (err, root) {
          if (_once) {
            throw Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (err != null && err !== SHORT_CIRCUIT) {
            return callback(err);
          }
          return next(root);
        }));
      };
    } else {
      _f = function (next) {
        try {
          return next(rootRule(parser));
        } catch (e) {
          if (e !== SHORT_CIRCUIT) {
            throw e;
          } else {
            return next();
          }
        }
      };
    }
    return _f(function (result) {
      var _f, endParseTime, err;
      parser.clearCache();
      endParseTime = new Date().getTime();
      if (typeof options.progress === "function") {
        options.progress("parse", __num(endParseTime) - __num(startTime));
      }
      if (!result || __num(result.index) < source.length) {
        err = parser.getFailure(typeof result !== "undefined" && result !== null ? result.index : void 0);
        if (callback != null) {
          return callback(err);
        } else {
          throw err;
        }
      }
      if (callback != null) {
        _f = function (next) {
          var _once;
          return parser.macroExpandAllAsync(result.value, (_once = false, function (_e, expanded) {
            if (_once) {
              throw Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return next(expanded);
          }));
        };
      } else {
        _f = function (next) {
          return next(parser.macroExpandAll(result.value));
        };
      }
      return _f(function (expanded) {
        var endExpandTime, endReduceTime, reduced, ret;
        endExpandTime = new Date().getTime();
        if (typeof options.progress === "function") {
          options.progress("macroExpand", __num(endExpandTime) - __num(endParseTime));
        }
        reduced = expanded.reduce(parser);
        endReduceTime = new Date().getTime();
        if (typeof options.progress === "function") {
          options.progress("reduce", __num(endReduceTime) - __num(endExpandTime));
        }
        ret = {
          result: reduced,
          macros: parser.macros,
          parseTime: __num(endParseTime) - __num(startTime),
          macroExpandTime: __num(endExpandTime) - __num(endParseTime),
          reduceTime: __num(endReduceTime) - __num(endExpandTime),
          time: __num(endReduceTime) - __num(startTime)
        };
        if (callback != null) {
          return callback(null, ret);
        } else {
          return ret;
        }
      });
    });
  }
  module.exports = parse;
  parse.ParserError = ParserError;
  parse.MacroError = MacroError;
  parse.Node = Node;
  parse.MacroHolder = MacroHolder;
  parse.deserializePrelude = function (data) {
    var parsed, parser;
    if (typeof data === "string") {
      parsed = JSON.parse(data);
    } else {
      parsed = data;
    }
    parser = Parser();
    parser.macros.deserialize(parsed, parser, {});
    return {
      result: NothingNode(0, 0, parser.scope.peek()),
      macros: parser.macros
    };
  };
  parse.getReservedWords = function (macros, options) {
    if (options == null) {
      options = {};
    }
    return unique(__toArray(getReservedIdents(options)).concat(__toArray(macros != null && typeof macros.getMacroAndOperatorNames === "function" && macros.getMacroAndOperatorNames() || [])));
  };
  for (_arr = [
    "Access",
    "AccessMulti",
    "Args",
    "Array",
    "Assign",
    "Binary",
    "Block",
    "Break",
    "Call",
    "Comment",
    "Const",
    "Continue",
    "Debugger",
    "Def",
    "EmbedWrite",
    "Eval",
    "For",
    "ForIn",
    "Function",
    "Ident",
    "If",
    "MacroAccess",
    "Nothing",
    "Object",
    "Param",
    "Regexp",
    "Return",
    "Root",
    "Spread",
    "Super",
    "Switch",
    "SyntaxChoice",
    "SyntaxMany",
    "SyntaxParam",
    "SyntaxSequence",
    "This",
    "Throw",
    "Tmp",
    "TmpWrapper",
    "TryCatch",
    "TryFinally",
    "TypeFunction",
    "TypeGeneric",
    "TypeObject",
    "TypeUnion",
    "Unary",
    "Var",
    "Yield"
  ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
    nodeType = _arr[_i];
    Parser.addNodeFactory(nodeType, Node[nodeType]);
  }
  Parser.prototype.string = Node.string;
  Parser.prototype.arrayParam = Parser.prototype.array;
  Parser.prototype.object = Node.object;
  Parser.prototype.objectParam = Node.objectParam;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
