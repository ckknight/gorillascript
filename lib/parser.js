(function (GLOBAL) {
  "use strict";
  var __bind, __cmp, __compose, __create, __curry, __defer,
      __generatorToPromise, __import, __in, __isArray, __owns, __promise,
      __slice, __toArray, __toPromise, __typeof, _Block, _DefineMacro,
      _FunctionBody, _FunctionDeclaration, _IdentifierOrAccess, _Name, _o, _ref,
      _ref2, _SomeEmptyLinesWithCheckIndent, _Symbol, _this, addParamToScope,
      allowSpaceBeforeAccess, AnyArrayLiteral, AnyObjectLiteral,
      ArgumentsLiteral, ArrayLiteral, ArrayParameter, ArrayType,
      AssignmentAsExpression, Ast, AsterixChar, AstExpression, AstPosition,
      AstStatement, AtSignChar, BackslashChar, BackslashEscapeSequence,
      BackslashStringLiteral, BasicInvocationOrAccess, BinaryDigit,
      BinaryNumber, BinaryOperationByPrecedence, Block, Body, BodyNoEnd,
      BodyNoIndent, BodyNoIndentNoEnd, BodyWithIndent, BOM, Box,
      BracketedObjectKey, cache, CaretChar, Cascade, CascadePart,
      CascadePartWithCascade, CheckPeriodNotDoublePeriod, CheckStop,
      CloseCurlyBrace, CloseCurlyBraceChar, ClosedArguments, CloseParenthesis,
      CloseSquareBracket, Colon, ColonChar, ColonEmbeddedClose,
      ColonEmbeddedCloseWrite, ColonEqual, ColonNewline, Comma, CommaChar,
      CommaOrNewline, CommaOrSomeEmptyLinesWithCheckIndent, ConstantLiteral,
      ConstantLiteralAccessPart, ConstObjectKey, convertInvocationOrAccess,
      CountIndent, CurrentArrayLength, CustomOperatorCloseParenthesis,
      DecimalDigit, DecimalNumber, DedentedBody, DefineConstLiteral,
      DefineHelper, DefineMacro, DefineOperator, DefineSyntax,
      disallowEmbeddedText, DollarSign, DollarSignChar,
      dontRequireParameterSequence, DoubleColonChar, DoubleQuote,
      DoubleStringArrayLiteral, DoubleStringLiteral, DoubleStringLiteralInner,
      DualObjectKey, EmbeddedBlock, EmbeddedClose, EmbeddedCloseComment,
      EmbeddedCloseLiteral, EmbeddedCloseWrite, EmbeddedLiteralText,
      EmbeddedLiteralTextInnerPart, EmbeddedLiteralTextInnerPartWithBlock,
      EmbeddedOpen, EmbeddedOpenComment, EmbeddedOpenLiteral, EmbeddedOpenWrite,
      EmbeddedRootGeneratorP, EmbeddedRootInnerP, EmbeddedRootP,
      EmbeddedWriteExpression, EmptyLine, EmptyLines, EmptyLinesSpace,
      EndNoIndent, EqualChar, EqualSign, EqualSignChar, Eval,
      ExclamationPointChar, Expression, ExpressionAsStatement,
      ExpressionOrAssignment, ExpressionOrAssignmentOrBody, fromCharCode,
      FunctionBody, FunctionDeclaration, FunctionGlyph, FunctionLiteral,
      FunctionType, GeneratorBody, GeneratorBodyNoEnd, GeneratorFunctionBody,
      getPackageVersion, getReservedIdents, GetSetToken, GreaterThan,
      GreaterThanChar, HashSignChar, HexDigit, HexEscapeSequence, HexNumber,
      Identifier, IdentifierNameConst, IdentifierNameConstOrNumberLiteral,
      IdentifierOrAccess, IdentifierOrSimpleAccess,
      IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart,
      IdentifierOrThisAccess, IdentifierParameter, Imports, inAst, inCascade,
      IndentedUnclosedArrayLiteral, IndentedUnclosedArrayLiteralInner,
      IndentedUnclosedObjectLiteral, IndentedUnclosedObjectLiteralInner,
      INDENTS, inEvilAst, inExpression, inFunctionTypeParams, inMacro,
      insideIndentedAccess, inStatement, InvocationArguments,
      InvocationOrAccess, InvocationOrAccessPart, InvocationOrAccessParts,
      KeyValuePair, KvpParameter, LAccess, LCall, LessThan, LessThanChar,
      Letter, LicenseComment, Line, LInternalCall, Literal, Logic, LSymbol,
      LValue, MacroBody, MacroContext, MacroError, MacroHolder, MacroName,
      macroName, MacroNames, MacroOptions, MacroSyntax,
      MacroSyntaxChoiceParameters, MacroSyntaxParameter,
      MacroSyntaxParameterLookahead, MacroSyntaxParameters,
      MacroSyntaxParameterType, makeEmbeddedRule, MapLiteral, MaybeAsType,
      MaybeAtSignChar, MaybeComma, MaybeCommaOrNewline, MaybeComment,
      MaybeExclamationPointChar, MaybeNotToken, MaybeQuestionMarkChar,
      MaybeSpreadToken, MaybeUnderscores, MethodDeclaration, MinusChar, mutate,
      Name, NameChar, NameOrSymbol, NamePart, NameStart, NoNewlineIfNoIndent,
      NonUnionType, NoSpace, NoSpaceNewline, NotColon,
      NotColonUnlessNoIndentAndNewline, NotEmbeddedOpenComment,
      NotEmbeddedOpenLiteral, NotEmbeddedOpenWrite, Nothing,
      notInFunctionTypeParams, NumberChar, NumberLiteral, ObjectKey,
      ObjectKeyColon, ObjectLiteral, ObjectParameter, ObjectType,
      ObjectTypePair, OctalDigit, OctalNumber, OpenCurlyBrace,
      OpenCurlyBraceChar, OpenParenthesis, OpenParenthesisChar,
      OpenSquareBracket, OpenSquareBracketChar, ParamDualObjectKey, Parameter,
      ParameterOrNothing, Parameters, ParameterSequence, ParamSingularObjectKey,
      Parenthetical, parse, Parser, ParserError, ParserNode, PercentSign,
      PercentSignChar, Period, PeriodOrDoubleColonChar, Pipe, PipeChar,
      PlusChar, PlusOrMinusChar, PostfixUnaryOperation, PrefixUnaryOperation,
      preventUnclosedObjectLiteral, PrimaryExpression, PropertyDualObjectKey,
      PropertyOrDualObjectKey, PropertyOrDualObjectKeyOrMethodDeclaration,
      quote, RadixNumber, RegexLiteral, requireParameterSequence, RootInnerP,
      RootP, Scope, Semicolon, SemicolonChar, Semicolons, setImmediate,
      SetLiteral, Shebang, SHORT_CIRCUIT, SingleEscapeCharacter, SingleQuote,
      SingleStringLiteral, SingularObjectKey, SomeEmptyLines,
      SomeEmptyLinesWithCheckIndent, Space, SpaceChar, SpaceChars,
      SpreadOrExpression, SpreadToken, Stack, Statement, StringInterpolation,
      StringLiteral, stringRepeat, SuperInvocation, Symbol, symbol, SymbolChar,
      ThisLiteral, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod,
      ThisShorthandLiteral, trimRight, TripleDoubleQuote,
      TripleDoubleStringArrayLiteral, TripleDoubleStringLine,
      TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine,
      TripleSingleStringLiteral, Type, TypeReference, UnclosedArguments,
      UnclosedArrayLiteralElement, UnclosedObjectLiteral,
      UnclosedObjectLiteralsAllowed, Underscore, UnicodeEscapeSequence, unique,
      unusedCaches, UseMacro, word, wordOrSymbol, Zero;
  _this = this;
  __bind = function (parent, child) {
    var func;
    if (parent == null) {
      throw new TypeError("Expected parent to be an object, got " + __typeof(parent));
    }
    func = parent[child];
    if (typeof func !== "function") {
      throw new Error("Trying to bind child '" + String(child) + "' which is not a function");
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
  __compose = function (left, right) {
    if (typeof left !== "function") {
      throw new TypeError("Expected left to be a Function, got " + __typeof(left));
    }
    if (typeof right !== "function") {
      throw new TypeError("Expected right to be a Function, got " + __typeof(right));
    }
    return function () {
      return left.call(this, right.apply(this, arguments));
    };
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
      throw new TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw new TypeError("Expected f to be a Function, got " + __typeof(f));
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
  __defer = (function () {
    function __defer() {
      var deferred, isError, value;
      isError = false;
      value = null;
      deferred = [];
      function complete(newIsError, newValue) {
        var funcs;
        if (deferred) {
          funcs = deferred;
          deferred = null;
          isError = newIsError;
          value = newValue;
          if (funcs.length) {
            setImmediate(function () {
              var _end, i;
              for (i = 0, _end = funcs.length; i < _end; ++i) {
                funcs[i]();
              }
            });
          }
        }
      }
      return {
        promise: {
          then: function (onFulfilled, onRejected, allowSync) {
            var _ref, fulfill, promise, reject;
            if (allowSync !== true) {
              allowSync = void 0;
            }
            _ref = __defer();
            promise = _ref.promise;
            fulfill = _ref.fulfill;
            reject = _ref.reject;
            _ref = null;
            function step() {
              var f, result;
              try {
                if (isError) {
                  f = onRejected;
                } else {
                  f = onFulfilled;
                }
                if (typeof f === "function") {
                  result = f(value);
                  if (result && typeof result.then === "function") {
                    result.then(fulfill, reject, allowSync);
                  } else {
                    fulfill(result);
                  }
                } else {
                  (isError ? reject : fulfill)(value);
                }
              } catch (e) {
                reject(e);
              }
            }
            if (deferred) {
              deferred.push(step);
            } else if (allowSync) {
              step();
            } else {
              setImmediate(step);
            }
            return promise;
          },
          sync: function () {
            var result, state;
            state = 0;
            result = 0;
            this.then(
              function (ret) {
                state = 1;
                result = ret;
              },
              function (err) {
                state = 2;
                result = err;
              },
              true
            );
            switch (state) {
            case 0: throw new Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw new Error("Unknown state");
            }
          }
        },
        fulfill: function (value) {
          complete(false, value);
        },
        reject: function (reason) {
          complete(true, reason);
        }
      };
    }
    __defer.fulfilled = function (value) {
      var d;
      d = __defer();
      d.fulfill(value);
      return d.promise;
    };
    __defer.rejected = function (reason) {
      var d;
      d = __defer();
      d.reject(reason);
      return d.promise;
    };
    return __defer;
  }());
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw new TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw new TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw new TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    function continuer(verb, arg) {
      var item;
      try {
        item = generator[verb](arg);
      } catch (e) {
        return __defer.rejected(e);
      }
      if (item.done) {
        return __defer.fulfilled(item.value);
      } else {
        return item.value.then(callback, errback, allowSync);
      }
    }
    function callback(value) {
      return continuer("send", value);
    }
    function errback(value) {
      return continuer("throw", value);
    }
    return callback(void 0);
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
  __in = typeof Array.prototype.indexOf === "function"
    ? (function (indexOf) {
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }(Array.prototype.indexOf))
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
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __owns = Object.prototype.hasOwnProperty;
  __promise = function (value, allowSync) {
    var factory;
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    if (typeof value === "function") {
      factory = function () {
        return __generatorToPromise(value.apply(this, arguments));
      };
      factory.sync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        ).sync();
      };
      factory.maybeSync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        );
      };
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
  };
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
  __toPromise = function (func, context, args) {
    var _ref, fulfill, promise, reject;
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    _ref = __defer();
    promise = _ref.promise;
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    _ref = null;
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          reject(err);
        } else {
          fulfill(value);
        }
      }
    ]));
    return promise;
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  ParserNode = require("./parser-nodes");
  LValue = ParserNode.Value;
  LCall = ParserNode.Call;
  LInternalCall = ParserNode.InternalCall;
  LAccess = ParserNode.Access;
  LSymbol = ParserNode.Symbol;
  Scope = require("./parser-scope");
  MacroContext = require("./parser-macrocontext");
  MacroHolder = require("./parser-macroholder");
  Type = require("./types");
  stringRepeat = require("./utils").stringRepeat;
  addParamToScope = require("./parser-utils").addParamToScope;
  _ref = require("./utils");
  quote = _ref.quote;
  unique = _ref.unique;
  getPackageVersion = _ref.getPackageVersion;
  _ref = null;
  function isNothing(node) {
    return node instanceof LSymbol.nothing;
  }
  ParserError = (function (Error) {
    var _Error_prototype, _ParserError_prototype;
    function ParserError(message, parser, index) {
      var _this, err, pos;
      _this = this instanceof ParserError ? this : __create(_ParserError_prototype);
      if (message == null) {
        message = "";
      }
      _this.message = message;
      if (parser == null) {
        parser = null;
      }
      if (index == null) {
        index = 0;
      }
      _this.index = index;
      if (parser) {
        _this.source = parser.source;
        _this.filename = parser.options.filename;
        pos = parser.getPosition(index);
        _this.line = pos.line;
        _this.column = pos.column;
        _this.message = message + (" at " + (_this.filename ? _this.filename + ":" : "") + _this.line + ":" + _this.column);
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
    _ParserError_prototype.name = "ParserError";
    return ParserError;
  }(Error));
  MacroError = (function (Error) {
    var _Error_prototype, _MacroError_prototype;
    function MacroError(inner, parser, index) {
      var _this, err, msg, pos;
      _this = this instanceof MacroError ? this : __create(_MacroError_prototype);
      if (inner == null) {
        inner = "";
      }
      if (parser == null) {
        parser = null;
      }
      if (index == null) {
        index = 0;
      }
      _this.index = index;
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
    _MacroError_prototype.name = "MacroError";
    _MacroError_prototype.setPosition = function (line, column) {};
    return MacroError;
  }(Error));
  Box = (function () {
    var _Box_prototype;
    function Box(index, value) {
      var _this;
      _this = this instanceof Box ? this : __create(_Box_prototype);
      _this.index = index;
      _this.value = value;
      if (index % 1 !== 0 || index < 0) {
        throw new RangeError("Expected index to be a non-negative integer, got " + index);
      }
      return _this;
    }
    _Box_prototype = Box.prototype;
    Box.displayName = "Box";
    return Box;
  }());
  cache = (function () {
    var id;
    id = -1;
    return function (rule) {
      var cacheKey;
      cacheKey = ++id;
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
          return item.result;
        } else {
          result = rule(parser, index);
          inner[cacheKey] = { start: index, result: result };
          return result;
        }
      }
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
  function wrap(name, func) {
    return func;
  }
  fromCharCode = (function () {
    var f;
    f = String.fromCharCode;
    return function (charCode) {
      if (charCode > 65535) {
        return f((charCode - 65536 >> 10) + 55296) + f((charCode - 65536) % 1024 + 56320);
      } else {
        return f(charCode);
      }
    };
  }());
  function processCharCodes(codes, array, start) {
    var _i, _len, code;
    if (array == null) {
      array = [];
    }
    if (start == null) {
      start = 0;
    }
    for (_len = codes.length, _i = +start, _i < 0 && (_i += _len); _i < _len; ++_i) {
      code = codes[_i];
      array.push(fromCharCode(code));
    }
    return array;
  }
  function codesToString(codes) {
    return processCharCodes(codes).join("");
  }
  function makeAlterStack(name, value) {
    return function (rule) {
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
  }
  function charsToFakeSet(array) {
    var _arr, _end, _i, _len, c, item, obj;
    obj = __create(null);
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (typeof item === "number") {
        obj[item] = true;
      } else {
        for (c = +item[0], _end = +item[1]; c <= _end; ++c) {
          obj[c] = true;
        }
      }
    }
    return obj;
  }
  function stackWrap(func) {
    return func;
  }
  function character(name, expected) {
    return function (parser, index) {
      if (parser.source.charCodeAt(index) === expected) {
        return Box(index + 1, expected);
      } else {
        return parser.fail(name, index);
      }
    };
  }
  function characters(name, expected) {
    return function (parser, index) {
      var c;
      c = parser.source.charCodeAt(index);
      if (expected[c]) {
        return Box(index + 1, c);
      } else {
        return parser.fail(name, index);
      }
    };
  }
  mutate = __curry(2, function (mutator, rule) {
    if (mutator === identity) {
      return rule;
    }
    if (typeof mutator !== "function") {
      mutator = makeReturn(mutator);
    }
    function f(parser, index) {
      var result;
      result = rule(parser, index);
      if (result) {
        return Box(result.index, mutator(result.value, parser, index, result.index));
      }
    }
    f.rule = rule;
    f.mutator = mutator;
    return f;
  });
  function bool(rule) {
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
  function multiple(rule, minimum, maximum, ignoreValue) {
    var mutator;
    if (minimum == null) {
      minimum = 0;
    }
    if (maximum == null) {
      maximum = 1/0;
    }
    if (ignoreValue == null) {
      ignoreValue = false;
    }
    if (minimum % 1 !== 0 || minimum < 0) {
      throw new RangeError("Expected minimum to be a non-negative integer, got " + minimum);
    }
    if (maximum !== 1/0 && maximum % 1 !== 0 || maximum < minimum) {
      throw new RangeError("Expected maximum to be Infinity or an integer of at least " + minimum + ", got " + maximum);
    }
    mutator = identity;
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      mutator = rule.mutator;
      rule = rule.rule;
    }
    if (ignoreValue) {
      return function (parser, index) {
        var count, item, newIndex;
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
          ++count;
          newIndex = item.index;
          if (newIndex === index) {
            throw new Error("Infinite loop detected");
          } else {
            index = newIndex;
          }
        }
        return Box(index, count);
      };
    } else if (mutator === identity) {
      return function (parser, index) {
        var count, item, newIndex, result;
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
          result[count] = item.value;
          ++count;
          newIndex = item.index;
          if (newIndex === index) {
            throw new Error("Infinite loop detected");
          } else {
            index = newIndex;
          }
        }
        return Box(index, result);
      };
    } else {
      return mutate(
        function (items, parser, index) {
          var _arr, _arr2, _i, _len, item;
          _arr = [];
          for (_arr2 = __toArray(items), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(mutator(item.value, parser, item.startIndex, item.endIndex));
          }
          return _arr;
        },
        function (parser, index) {
          var count, item, newIndex, result;
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
            newIndex = item.index;
            result[count] = { startIndex: index, endIndex: newIndex, value: item.value };
            if (newIndex === index) {
              throw new Error("Infinite loop detected");
            } else {
              index = newIndex;
            }
            ++count;
          }
          return Box(index, result);
        }
      );
    }
  }
  function zeroOrMore(rule, ignoreValue) {
    return multiple(rule, 0, 1/0, ignoreValue);
  }
  function oneOrMore(rule, ignoreValue) {
    return multiple(rule, 1, 1/0, ignoreValue);
  }
  function maybe(rule, defaultValue) {
    var MISSING, mutator, subrule;
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
        function (parser, index) {
          return subrule(parser, index) || Box(index, MISSING);
        }
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
        function (parser, index) {
          return rule(parser, index) || Box(index, MISSING);
        }
      );
    } else {
      return function (parser, index) {
        return rule(parser, index) || Box(index, defaultValue);
      };
    }
  }
  function oneOf() {
    var _arr, _i, _i2, _len, _len2, expandedRules, func, rule, rules, subrule;
    rules = __slice.call(arguments);
    switch (rules.length) {
    case 0: throw new Error("Expected rules to be non-empty");
    case 1: return rules[0];
    default:
      expandedRules = [];
      for (_i = 0, _len = rules.length; _i < _len; ++_i) {
        rule = rules[_i];
        if (rule.oneOf) {
          for (_arr = __toArray(rule.oneOf), _i2 = 0, _len2 = _arr.length; _i2 < _len2; ++_i2) {
            subrule = _arr[_i2];
            expandedRules.push(subrule);
          }
        } else {
          expandedRules.push(rule);
        }
      }
      func = function (parser, index) {
        var _len, i, result, rule;
        for (i = 0, _len = expandedRules.length; i < _len; ++i) {
          rule = expandedRules[i];
          result = rule(parser, index);
          if (result) {
            return result;
          }
        }
      };
      func.oneOf = expandedRules;
      return func;
    }
  }
  function zeroOrMoreOf() {
    var rules;
    rules = __slice.call(arguments);
    return zeroOrMore(oneOf.apply(void 0, rules));
  }
  function oneOrMoreOf() {
    var rules;
    rules = __slice.call(arguments);
    return oneOrMore(oneOf.apply(void 0, rules));
  }
  function check(rule) {
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return function (parser, index) {
      var result;
      result = rule(parser, index);
      if (result) {
        return Box(index);
      }
    };
  }
  SHORT_CIRCUIT = {};
  function sequential() {
    var _len, hasMutations, hasOther, i, item, items, key, keys, mapping,
        mutations, mutator, rule, rules, shortCircuitIndex, thisIndex;
    items = __slice.call(arguments);
    if (items.length === 0) {
      throw new Error("Expected items to be non-empty");
    }
    if (items.length === 1) {
      if (__isArray(items[0])) {
        if (items[0][0] === "this") {
          return items[0][1];
        }
      } else if (typeof items[0] === "function") {
        rule = items[0];
        return function (parser, index) {
          var item;
          item = rule(parser, index);
          if (!item) {
            return;
          }
          return Box(item.index);
        };
      }
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
          throw new Error("Found an array with " + item.length + " length at index #" + i);
        }
        if (typeof item[0] !== "string") {
          throw new TypeError("Array in index #" + i + " has an improper key: " + __typeof(item[0]));
        }
        if (typeof item[1] !== "function") {
          throw new TypeError("Array in index #" + i + " has an improper rule: " + __typeof(item[1]));
        }
        key = item[0];
        if (__in(key, keys)) {
          throw new Error("Can only have one " + JSON.stringify(key) + " key in sequential");
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
          throw new Error("Can only have one SHORT_CIRCUIT per sequential");
        }
        shortCircuitIndex = i;
        continue;
      } else {
        throw new TypeError("Found a non-array, non-function in index #" + i + ": " + __typeof(item));
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
        throw new Error("Cannot specify both the 'this' key and another key");
      }
      if (!hasMutations) {
        return function (parser, index) {
          var _len, i, item, result, rule;
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
            index = item.index;
            if (i === thisIndex) {
              result = item.value;
            }
          }
          return Box(index, result);
        };
      } else {
        mutator = mutations[thisIndex];
        return mutate(
          function (item, parser, index) {
            return mutator(item.value, parser, item.startIndex, item.endIndex);
          },
          function (parser, index) {
            var _len, i, item, result, rule, valueIndex;
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
              if (i === thisIndex) {
                result = { value: item.value, startIndex: index, endIndex: item.index };
              }
              index = item.index;
            }
            return Box(index, result);
          }
        );
      }
    } else if (hasOther) {
      if (hasMutations) {
        return mutate(
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
              key = mapping[i];
              if (key) {
                result[key] = { value: item.value, startIndex: index, endIndex: item.index };
              }
              index = item.index;
            }
            return Box(index, result);
          }
        );
      } else {
        return function (parser, index) {
          var i, item, key, length, rule, value;
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
            index = item.index;
            key = mapping[i];
            if (key) {
              value[key] = item.value;
            }
          }
          return Box(index, value);
        };
      }
    } else {
      if (hasMutations) {
        throw new Error("Cannot use a mutator on a sequential without keys");
      }
      return function (parser, index) {
        var _len, i, item, rule;
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
          index = item.index;
        }
        return Box(index);
      };
    }
  }
  function cons(headRule, tailRule) {
    return function (parser, index) {
      var head, tail;
      head = headRule(parser, index);
      if (!head) {
        return;
      }
      tail = tailRule(parser, head.index);
      if (!tail) {
        return;
      }
      return Box(tail.index, [head.value].concat(tail.value));
    };
  }
  function concat(leftRule, rightRule) {
    return function (parser, index) {
      var left, right;
      left = leftRule(parser, index);
      if (!left) {
        return;
      }
      right = rightRule(parser, left.index);
      if (!right) {
        return;
      }
      return Box(right.index, left.value.concat(right.value));
    };
  }
  function nothingRule(parser, index) {
    return Box(index);
  }
  function separatedList(itemRule, separatorRule, tailRule) {
    if (separatorRule == null) {
      separatorRule = nothingRule;
    }
    if (tailRule == null) {
      tailRule = itemRule;
    }
    return function (parser, index) {
      var currentIndex, head, i, item, newIndex, result, separator;
      head = itemRule(parser, index);
      if (!head) {
        return;
      }
      currentIndex = head.index;
      result = [head.value];
      i = 0;
      for (; ; ++i) {
        separator = separatorRule(parser, currentIndex);
        if (!separator) {
          break;
        }
        item = tailRule(parser, separator.index);
        if (!item) {
          break;
        }
        newIndex = item.index;
        if (newIndex === currentIndex) {
          throw new Error("Infinite loop detected");
        } else {
          currentIndex = newIndex;
        }
        result.push(item.value);
      }
      return Box(currentIndex, result);
    };
  }
  function except(rule) {
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return function (parser, index) {
      if (!rule(parser, index)) {
        return Box(index);
      }
    };
  }
  function anyExcept(rule) {
    if (typeof rule.mutator === "function" && typeof rule.rule === "function" && false) {
      rule = rule.rule;
    }
    return function (parser, index) {
      if (!rule(parser, index)) {
        return AnyChar(parser, index);
      }
    };
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
  OpenParenthesisChar = character('"("', 40);
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
  CheckStop = oneOf(Newline, Eof, function (parser, index) {
    return EmbeddedClose(parser, index) || EmbeddedCloseWrite(parser, index);
  });
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
    return sequential(Space, ["this", rule]);
  }
  NoSpace = cache(except(SpaceChar));
  EmptyLine = cache(withSpace(Newline));
  EmptyLines = cache(zeroOrMore(EmptyLine, true));
  SomeEmptyLines = cache(oneOrMore(EmptyLine, true));
  EmptyLinesSpace = sequential(EmptyLines, Space);
  NoSpaceNewline = except(EmptyLine);
  OpenParenthesis = cache(withSpace(character('"("', 40)));
  CloseParenthesis = cache(withSpace(character('")"', 41)));
  OpenSquareBracket = cache(withSpace(OpenSquareBracketChar));
  CloseSquareBracket = cache(withSpace(character('"]"', 93)));
  OpenCurlyBrace = cache(withSpace(OpenCurlyBraceChar));
  CloseCurlyBrace = cache(withSpace(CloseCurlyBraceChar));
  EqualSign = withSpace(EqualSignChar);
  PercentSign = cache(withSpace(PercentSignChar));
  DollarSign = cache(withSpace(DollarSignChar));
  Comma = cache(withSpace(CommaChar));
  MaybeComma = cache(maybe(Comma));
  CommaOrNewline = oneOf(
    sequential(
      ["this", Comma],
      EmptyLines
    ),
    SomeEmptyLines
  );
  MaybeCommaOrNewline = cache(maybe(CommaOrNewline));
  _SomeEmptyLinesWithCheckIndent = sequential(SomeEmptyLines, CheckIndent);
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
    return Box(index, LSymbol.nothing(index));
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
  function End(parser, index) {
    if (parser.options.noindent) {
      return EndNoIndent(parser, index);
    } else {
      return Box(index);
    }
  }
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
  MacroNames = separatedList(MacroName, Comma);
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
  function memoize(func) {
    var cache;
    cache = __create(null);
    return function (key) {
      if (__owns.call(cache, key)) {
        return cache[key];
      } else {
        return cache[key] = func(key);
      }
    };
  }
  word = memoize(function (text) {
    return ruleEqual(Name, text);
  });
  symbol = memoize(function (text) {
    return ruleEqual(Symbol, text);
  });
  macroName = memoize(function (text) {
    return ruleEqual(MacroName, text);
  });
  wordOrSymbol = memoize(function (text) {
    var _arr, _len, _ref, i, part, parts;
    parts = [Space];
    for (_arr = text.split(/([a-z]+)/ig), i = 0, _len = _arr.length; i < _len; ++i) {
      part = _arr[i];
      if (part) {
        parts.push(ruleEqual(
          i % 2 === 0 ? _Symbol : _Name,
          part
        ));
      }
    }
    _ref = sequential.apply(void 0, parts);
    return mutate(text)(_ref);
  });
  _o = __create(null);
  _o[9] = 4;
  _o[32] = 1;
  INDENTS = _o;
  _ref = zeroOrMore(SpaceChar);
  CountIndent = mutate(function (spaces) {
    var _arr, _i, c, count, indent;
    count = 0;
    for (_arr = __toArray(spaces), _i = _arr.length; _i--; ) {
      c = _arr[_i];
      indent = INDENTS[c];
      if (!indent) {
        throw new Error("Unexpected indent char: " + JSON.stringify(c));
      }
      count += +indent;
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
      throw new Error("Can't use Advance if in noindent mode");
    }
    count = CountIndent(parser, index);
    countValue = count.value;
    indent = parser.indent;
    if (countValue > indent.peek()) {
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
    return function (parser, index) {
      var _end, count, i, indent;
      indent = parser.indent;
      count = indent.count();
      try {
        return rule(parser, index);
      } finally {
        for (i = +count, _end = +indent.count(); i < _end; ++i) {
          indent.pop();
        }
      }
    };
  }
  ThisLiteral = cache((_ref = word("this"), mutate(function (_p, parser, index) {
    return LSymbol.ident(index, parser.scope.peek(), "this");
  })(_ref)));
  ThisShorthandLiteral = cache((_ref = withSpace(AtSignChar), mutate(function (_p, parser, index) {
    return LSymbol.ident(index, parser.scope.peek(), "this");
  })(_ref)));
  ArgumentsLiteral = cache((_ref = word("arguments"), mutate(function (_p, parser, index) {
    return LSymbol.ident(index, parser.scope.peek(), "arguments");
  })(_ref)));
  ThisOrShorthandLiteral = cache(oneOf(ThisLiteral, ThisShorthandLiteral));
  ThisOrShorthandLiteralPeriod = oneOf(
    sequential(
      ["this", ThisLiteral],
      Period
    ),
    sequential(
      ["this", ThisShorthandLiteral],
      maybe(Period)
    )
  );
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
    RESERVED_IDENTS_NOINDENT = RESERVED_IDENTS.concat(["end"]).sort();
    return function (options) {
      if (options && options.noindent) {
        return RESERVED_IDENTS_NOINDENT;
      } else {
        return RESERVED_IDENTS;
      }
    };
  }());
  SpreadToken = cache(withSpace((_ref = sequential(Period, Period, Period), mutate("...")(_ref))));
  MaybeSpreadToken = cache(maybe(SpreadToken));
  SpreadOrExpression = cache((_ref = sequential(
    ["spread", MaybeSpreadToken],
    ["node", Expression]
  ), mutate(function (_p, parser, index) {
    var node, spread;
    spread = _p.spread;
    node = _p.node;
    if (spread === "...") {
      return LInternalCall("spread", index, parser.scope.peek(), node);
    } else {
      return node;
    }
  })(_ref)));
  allowSpaceBeforeAccess = __compose(
    makeAlterStack("disallowSpaceBeforeAccess", 0),
    makeAlterStack("insideIndentedAccess", false)
  );
  ClosedArguments = cache(sequential(
    OpenParenthesisChar,
    Space,
    [
      "this",
      allowSpaceBeforeAccess(concat(
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
            MaybeCommaOrNewline,
            PopIndent
          )),
          function () {
            return [];
          }
        )
      ))
    ],
    CloseParenthesis
  ));
  function disallowSpaceBeforeAccess(rule) {
    return function (parser, index) {
      var stack;
      stack = parser.disallowSpaceBeforeAccess;
      stack.push(+stack.peek() + 1);
      try {
        return rule(parser, index);
      } finally {
        stack.pop();
      }
    };
  }
  UnclosedArguments = cache(disallowSpaceBeforeAccess(sequential(
    oneOf(
      sequential(SpaceChar, Space),
      check(Newline)
    ),
    [
      "this",
      concat(
        separatedList(SpreadOrExpression, Comma),
        oneOf(
          sequential(IndentationRequired, Comma, SomeEmptyLines, [
            "this",
            retainIndent(sequential(
              Advance,
              CheckIndent,
              [
                "this",
                separatedList(SpreadOrExpression, CommaOrSomeEmptyLinesWithCheckIndent)
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
  )));
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
      return LCall(
        index,
        parser.scope.peek(),
        LSymbol.ident(index, parser.scope.peek(), "$"),
        args
      );
    })(_ref)),
    function (parser, index) {
      var name;
      name = Name(parser, index);
      if (!name || __in(name.value, getReservedIdents(parser.options)) || parser.hasMacroOrOperator(name.value || parser.scope.peek().hasConst(name.value))) {
        return parser.fail("identifier", index);
      } else {
        return Box(name.index, LSymbol.ident(index, parser.scope.peek(), name.value));
      }
    }
  ));
  function makeDigitsRule(digit) {
    var _ref;
    _ref = separatedList(oneOrMore(digit), oneOrMore(Underscore, true));
    return mutate(function (parts) {
      var _arr, _i, _len, part, result;
      result = [];
      for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        part = _arr[_i];
        processCharCodes(part, result);
      }
      return result.join("");
    })(_ref);
  }
  MaybeUnderscores = cache(zeroOrMore(Underscore, true));
  function parseRadixNumber(integer, fraction, radix, exponent) {
    var _i, _len, c, currentValue, fractionalExponent, fractionalValue, i;
    if (exponent == null) {
      exponent = 0;
    }
    if (exponent % 1 !== 0) {
      throw new RangeError("Expected exponent to be an integer, got " + exponent);
    }
    while (exponent > 0) {
      integer += fraction.charAt(0) || "0";
      fraction = fraction.substring(1);
      --exponent;
    }
    while (exponent < 0) {
      fraction = integer.slice(-1) + fraction;
      integer = integer.slice(0, -1);
      ++exponent;
    }
    currentValue = 0;
    for (_i = 0, _len = integer.length; _i < _len; ++_i) {
      c = integer.charAt(_i);
      currentValue = currentValue * radix + parseInt(c, radix);
    }
    if (fraction) {
      fractionalValue = 0;
      fractionalExponent = 0;
      for (i = 0, _len = fraction.length; i < _len; ++i) {
        c = fraction.charAt(i);
        if (fractionalValue >= 4503599627370496 / radix) {
          break;
        }
        fractionalValue = fractionalValue * radix + parseInt(c, radix);
        ++fractionalExponent;
      }
      currentValue += fractionalValue / Math.pow(radix, fractionalExponent);
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
            return (sign ? fromCharCode(sign) : "") + digits;
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
          "Unable to parse number " + quote(parser.source.substring(index, endIndex)),
          parser,
          index
        );
      }
      return LValue(index, value);
    })(_ref);
  }()));
  function makeRadixNumber(radix, separator, digit) {
    var _ref, digits;
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
          "Unable to parse number " + quote(parser.source.substring(index, endIndex)),
          parser,
          index
        );
      }
      return LValue(index, value);
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
      var _end, _ref, digit, i, letterEnd, name, set;
      if ((_ref = digitsCache[radix]) == null) {
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
          for (i = 0, _end = radix > 10 ? +radix : 10; i < _end; ++i) {
            set[i + 48] = true;
          }
          for (i = 0, _end = (radix > 36 ? +radix : 36) - 10; i < _end; ++i) {
            set[i + 65] = true;
            set[i + 97] = true;
          }
          name = ["[0-"];
          name.push(String.fromCharCode((radix > 9 ? +radix : 9) + 48));
          if (radix >= 10) {
            letterEnd = (radix > 36 ? +radix : 36) - 10;
            name.push("A-");
            name.push(String.fromCharCode(letterEnd + 65));
            name.push("a-");
            name.push(String.fromCharCode(letterEnd + 97));
          }
          name.push("]");
          digit = characters(name.join(""), set);
        }
        return digitsCache[radix] = makeDigitsRule(digit);
      } else {
        return _ref;
      }
    }
    Radix = multiple(DecimalDigit, 1, 2);
    R = characters("[Rr]", charsToFakeSet([82, 114]));
    return function (parser, index) {
      var currentIndex, digitsRule, fraction, integer, period, radix, radixNum,
          radixValue, separator, trailing, value;
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
        throw ParserError("Unable to parse radix " + quote(radixValue), parser, index);
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
          "Unable to parse number " + quote(parser.source.substring(index, currentIndex)),
          parser,
          index
        );
      }
      trailing = MaybeUnderscores(parser, currentIndex);
      return Box(trailing.index, LValue(index, value));
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
      return Box(name.index, LValue(index, name.value));
    }
  });
  IdentifierNameConstOrNumberLiteral = cache(oneOf(IdentifierNameConst, NumberLiteral));
  function makeConstLiteral(name, value) {
    var _ref;
    _ref = word(name);
    return mutate(function (_p, parser, index) {
      return LValue(index, value);
    })(_ref);
  }
  _ref = sequential(
    character('"x"', 120),
    SHORT_CIRCUIT,
    [
      "this",
      multiple(HexDigit, 2, 2)
    ]
  );
  HexEscapeSequence = mutate(function (digits) {
    return parseInt(codesToString(digits), 16);
  })(_ref);
  UnicodeEscapeSequence = sequential(
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
  );
  SingleEscapeCharacter = (function () {
    var _o, ESCAPED_CHARACTERS;
    _o = __create(null);
    _o[98] = 8;
    _o[102] = 12;
    _o[114] = 13;
    _o[110] = 10;
    _o[116] = 9;
    _o[118] = 11;
    ESCAPED_CHARACTERS = _o;
    return oneOf(mutate(0)(Zero), mutate(function (c) {
      return ESCAPED_CHARACTERS[c] || c;
    })(AnyChar));
  }());
  BackslashEscapeSequence = sequential(BackslashChar, SHORT_CIRCUIT, [
    "this",
    oneOf(HexEscapeSequence, UnicodeEscapeSequence, SingleEscapeCharacter)
  ]);
  inExpression = makeAlterStack("position", "expression");
  inStatement = makeAlterStack("position", "statement");
  AssignmentAsExpression = inExpression(function (parser, index) {
    return Assignment(parser, index);
  });
  ExpressionOrAssignment = cache(oneOf(AssignmentAsExpression, Expression));
  ExpressionOrAssignmentOrBody = cache(oneOf(ExpressionOrAssignment, Body));
  StringInterpolation = sequential(DollarSignChar, NoSpace, SHORT_CIRCUIT, [
    "this",
    oneOf(CustomConstantLiteral, Identifier, sequential(
      OpenParenthesis,
      [
        "this",
        allowSpaceBeforeAccess(oneOf(Expression, Nothing))
      ],
      CloseParenthesis
    ))
  ]);
  SingleStringLiteral = cache((_ref = sequential(
    SingleQuote,
    SHORT_CIRCUIT,
    [
      "this",
      zeroOrMoreOf(BackslashEscapeSequence, anyExcept(oneOf(SingleQuote, Newline)))
    ],
    SingleQuote
  ), mutate(function (codes, parser, index) {
    return LValue(index, codesToString(codes));
  })(_ref)));
  DoubleStringLiteralInner = zeroOrMoreOf(BackslashEscapeSequence, StringInterpolation, anyExcept(oneOf(DoubleQuote, Newline)));
  function doubleStringLiteralHandler(parts, parser, index) {
    var _arr, _i, _len, currentLiteral, part, stringParts;
    stringParts = [];
    currentLiteral = [];
    for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      part = _arr[_i];
      if (typeof part === "number") {
        currentLiteral.push(part);
      } else if (!isNothing(part)) {
        stringParts.push(LValue(index, codesToString(currentLiteral)));
        currentLiteral = [];
        stringParts.push(part);
      }
    }
    if (currentLiteral.length > 0) {
      stringParts.push(LValue(index, codesToString(currentLiteral)));
    }
    return stringParts;
  }
  function concatString(parser, index, parts) {
    var _i, _len, concatOp, current, len, part;
    len = parts.length;
    if (len === 0) {
      return LValue(index, "");
    } else if (len === 1 && parts[0].isConstType("string")) {
      return parts[0];
    }
    concatOp = parser.getMacroByLabel("stringConcat");
    if (!concatOp) {
      throw new Error("Cannot use string interpolation until the string-concat operator has been defined");
    }
    if (len === 1) {
      return concatOp.func(
        {
          left: LValue(index, ""),
          op: "",
          right: parts[0]
        },
        parser,
        index
      );
    } else {
      current = parts[0];
      for (_i = 1, _len = parts.length; _i < _len; ++_i) {
        part = parts[_i];
        current = concatOp.func(
          { left: current, op: "", right: part },
          parser,
          index
        );
      }
      return current;
    }
  }
  DoubleStringLiteral = cache((_ref = sequential(
    DoubleQuote,
    SHORT_CIRCUIT,
    ["this", DoubleStringLiteralInner],
    DoubleQuote
  ), mutate(function (parts, parser, index) {
    var _arr, _arr2, _i, _len, part, stringParts;
    _arr = [];
    for (_arr2 = doubleStringLiteralHandler(parts, parser, index), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
      part = _arr2[_i];
      if (!part.isConstValue("")) {
        _arr.push(part);
      }
    }
    stringParts = _arr;
    return concatString(parser, index, stringParts);
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
    return LInternalCall("array", index, parser.scope.peek(), stringParts);
  })(_ref)));
  function StringIndent(parser, index) {
    var c, count, currentIndent, currentIndex, indentValue;
    count = 0;
    currentIndent = parser.indent.peek();
    currentIndex = index;
    while (count < currentIndent) {
      c = SpaceChar(parser, currentIndex);
      if (!c) {
        break;
      }
      currentIndex = c.index;
      indentValue = INDENTS[c.value];
      if (!indentValue) {
        throw new Error("Unexpected indent char: " + JSON.stringify(c.value));
      }
      count += +indentValue;
    }
    if (count > currentIndent) {
      throw ParserError("Mixed tabs and spaces in string literal", parser, currentIndex);
    } else if (count === currentIndent || Newline(parser, currentIndex)) {
      return Box(currentIndex, count);
    }
  }
  if (typeof String.prototype.trimRight === "function") {
    trimRight = function (x) {
      return x.trimRight();
    };
  } else {
    trimRight = function (x) {
      return x.replace(/\s+$/, "");
    };
  }
  _ref = zeroOrMoreOf(BackslashEscapeSequence, anyExcept(oneOf(TripleSingleQuote, Newline)));
  TripleSingleStringLine = mutate(function (codes) {
    return [trimRight(codesToString(codes))];
  })(_ref);
  _ref = zeroOrMoreOf(BackslashEscapeSequence, StringInterpolation, anyExcept(oneOf(TripleDoubleQuote, Newline)));
  TripleDoubleStringLine = mutate(function (parts) {
    var _arr, _i, _len, currentLiteral, part, stringParts;
    stringParts = [];
    currentLiteral = [];
    for (_arr = __toArray(parts), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      part = _arr[_i];
      if (typeof part === "number") {
        currentLiteral.push(part);
      } else if (!isNothing(part)) {
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
  })(_ref);
  function tripleStringHandler(x, parser, index) {
    var _end, _len, i, j, len, line, lines, part, stringParts;
    lines = [x.first];
    if (lines[0].length === 0 || lines[0].length === 1 && lines[0][0] === "") {
      lines.shift();
    }
    for (j = 1, _end = +x.numEmptyLines; j < _end; ++j) {
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
        stringParts[i] = LValue(index, part);
      }
    }
    return stringParts;
  }
  function makeTripleString(quote, line) {
    var _ref;
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
      _arr = [];
      for (_arr2 = tripleStringHandler(parts, parser, index), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        part = _arr2[_i];
        if (!part.isConstValue("")) {
          _arr.push(part);
        }
      }
      stringParts = _arr;
      return concatString(parser, index, stringParts);
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
    return LInternalCall("array", index, parser.scope.peek(), stringParts);
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
  RegexLiteral = (function () {
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
      var _arr, _i, _len, currentLiteral, flag, flags, part, seenFlags,
          stringParts, text;
      text = _p.text;
      flags = _p.flags;
      stringParts = [];
      currentLiteral = [];
      for (_arr = __toArray(text), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        part = _arr[_i];
        if (typeof part === "number") {
          currentLiteral.push(part);
        } else if (part !== NOTHING && !isNothing(part)) {
          if (currentLiteral.length > 0) {
            stringParts.push(LValue(index, codesToString(currentLiteral)));
            currentLiteral = [];
          }
          stringParts.push(part);
        }
      }
      if (currentLiteral.length > 0) {
        stringParts.push(LValue(index, codesToString(currentLiteral)));
      }
      text = concatString(parser, index, stringParts);
      if (text.isConst()) {
        try {
          new RegExp(String(text.constValue()));
        } catch (e) {
          throw ParserError(e.message, parser, index);
        }
      }
      seenFlags = [];
      for (_arr = __toArray(flags), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        flag = _arr[_i];
        if (__in(flag, seenFlags)) {
          throw ParserError("Invalid regular expression: flag " + quote(flag) + " occurred more than once", parser, index);
        } else if (flag !== "g" && flag !== "i" && flag !== "m" && flag !== "y") {
          throw ParserError("Invalid regular expression: unknown flag " + quote(flag), parser, index);
        }
        seenFlags.push(flag);
      }
      return LInternalCall(
        "new",
        index,
        parser.scope.peek(),
        LSymbol.ident(index, parser.scope.peek(), "RegExp"),
        text,
        LValue(index, flags)
      );
    })(_ref)));
  }());
  ConstantLiteralAccessPart = oneOf(
    sequential(Period, ["this", IdentifierNameConstOrNumberLiteral]),
    sequential(
      OpenSquareBracketChar,
      ["this", allowSpaceBeforeAccess(Expression)],
      CloseSquareBracket
    )
  );
  function CustomConstantLiteral(parser, index) {
    var current, currentIndex, key, name, part, value;
    name = Name(parser, index);
    if (!name) {
      return;
    }
    value = parser.getConst(name.value);
    if (!value) {
      return;
    }
    if (parser.inAst.peek()) {
      return Box(name.index, LInternalCall("macroConst", index, parser.scope.peek(), LValue(index, name.value)));
    } else {
      current = value.value;
      currentIndex = name.index;
      while (typeof current === "object" && current !== null) {
        part = ConstantLiteralAccessPart(parser, currentIndex);
        if (!part) {
          throw ParserError("Constant '" + name.value + "' cannot appear without being accessed upon.", parser, index);
        }
        if (!part.value.isConst()) {
          throw ParserError("Constant '" + name.value + "' must only be accessed with constant keys.", parser, currentIndex);
        }
        key = part.value.constValue();
        if (!__owns.call(current, key)) {
          throw ParserError("Unknown key " + JSON.stringify(String(key)) + " in constant.", parser, currentIndex);
        }
        current = current[key];
        currentIndex = part.index;
      }
      return Box(currentIndex, LValue(index, current));
    }
  }
  function NullOrVoidLiteral(parser, index) {
    var constant;
    constant = CustomConstantLiteral(parser, index);
    if (!constant) {
      return;
    }
    if (constant.value.value != null) {
      return;
    }
    return constant;
  }
  ConstantLiteral = cache(oneOf(CustomConstantLiteral, NumberLiteral, StringLiteral, RegexLiteral));
  Literal = cache(oneOf(ThisOrShorthandLiteral, ArgumentsLiteral, ConstantLiteral));
  MaybeNotToken = cache(maybe(word("not")));
  MaybeQuestionMarkChar = cache(maybe(character('"?"', 63)));
  GeneratorBody = makeAlterStack("inGenerator", true)(Body);
  GeneratorBodyNoEnd = makeAlterStack("inGenerator", true)(BodyNoEnd);
  LessThanChar = character('"<"', 60);
  LessThan = withSpace(LessThanChar);
  GreaterThanChar = character('">"', 62);
  GreaterThan = withSpace(GreaterThanChar);
  FunctionGlyph = cache(sequential(Space, MinusChar, GreaterThanChar));
  _FunctionBody = oneOf(
    sequential(FunctionGlyph, [
      "this",
      oneOf(Statement, Nothing)
    ]),
    Body,
    Statement
  );
  FunctionBody = makeAlterStack("inGenerator", false)(_FunctionBody);
  GeneratorFunctionBody = makeAlterStack("inGenerator", true)(_FunctionBody);
  IdentifierOrSimpleAccessStart = oneOf(
    Identifier,
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteralPeriod],
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (_p, parser, index) {
      var child, parent;
      parent = _p.parent;
      child = _p.child;
      return LAccess(index, parser.scope.peek(), parent, child);
    })(_ref)),
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteral],
      DoubleColonChar,
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (_p, parser, index) {
      var child, parent;
      parent = _p.parent;
      child = _p.child;
      return LAccess(
        index,
        parser.scope.peek(),
        parent,
        LValue(index, "prototype"),
        child
      );
    })(_ref)),
    (_ref = sequential(
      ["parent", ThisOrShorthandLiteral],
      ["isProto", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      ["child", allowSpaceBeforeAccess(Expression)],
      CloseSquareBracket
    ), mutate(function (_p, parser, index) {
      var child, isProto, parent;
      parent = _p.parent;
      isProto = _p.isProto;
      child = _p.child;
      if (isProto) {
        return LAccess(
          index,
          parser.scope.peek(),
          parent,
          LValue(index, "prototype"),
          child
        );
      } else {
        return LAccess(index, parser.scope.peek(), parent, child);
      }
    })(_ref))
  );
  PeriodOrDoubleColonChar = cache(oneOf(Period, DoubleColonChar));
  _ref = oneOf(
    sequential(
      ["type", PeriodOrDoubleColonChar],
      ["child", IdentifierNameConstOrNumberLiteral]
    ),
    sequential(
      ["type", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      ["child", allowSpaceBeforeAccess(Expression)],
      CloseSquareBracket
    )
  );
  IdentifierOrSimpleAccessPart = mutate(function (_p, parser, childIndex) {
    var child, isProto, type;
    type = _p.type;
    child = _p.child;
    isProto = type === "::";
    return function (parent, parser, index) {
      if (isProto) {
        return LAccess(
          index,
          parser.scope.peek(),
          parent,
          LValue(childIndex, "prototype"),
          child
        );
      } else {
        return LAccess(index, parser.scope.peek(), parent, child);
      }
    };
  })(_ref);
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
  inFunctionTypeParams = makeAlterStack("inFunctionTypeParams", true);
  notInFunctionTypeParams = makeAlterStack("inFunctionTypeParams", false);
  TypeReference = function (parser, index) {
    return TypeReference(parser, index);
  };
  ArrayType = cache((_ref = sequential(
    OpenSquareBracket,
    ["this", maybe(allowSpaceBeforeAccess(TypeReference))],
    CloseSquareBracket
  ), mutate(function (subtype, parser, index) {
    var arrayIdent;
    arrayIdent = LSymbol.ident(index, parser.scope.peek(), "Array");
    if (subtype) {
      return LInternalCall(
        "typeGeneric",
        index,
        parser.scope.peek(),
        arrayIdent,
        subtype
      );
    } else {
      return arrayIdent;
    }
  })(_ref)));
  ObjectTypePair = sequential(
    [
      "key",
      function (parser, index) {
        return ConstObjectKey(parser, index);
      }
    ],
    Colon,
    ["value", TypeReference]
  );
  ObjectType = cache((_ref = sequential(
    OpenCurlyBrace,
    [
      "this",
      allowSpaceBeforeAccess(maybe(
        separatedList(ObjectTypePair, CommaOrNewline),
        function () {
          return [];
        }
      ))
    ],
    MaybeComma,
    CloseCurlyBrace
  ), mutate(function (pairs, parser, index) {
    var _arr, _i, _len, _ref, args, key, keys, keyValue, value;
    if (pairs.length === 0) {
      return LSymbol.ident(index, parser.scope.peek(), "Object");
    } else {
      keys = [];
      args = [];
      for (_arr = __toArray(pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        _ref = _arr[_i];
        key = _ref.key;
        value = _ref.value;
        _ref = null;
        if (!key.isConst()) {
          throw ParserError("Expected a constant key, got " + __typeof(key), parser, key.index);
        } else {
          keyValue = String(key.constValue());
          if (__in(keyValue, keys)) {
            throw ParserError("Duplicate object key: " + quote(keyValue), parser, key.index);
          }
          keys.push(keyValue);
        }
        args.push(key, value);
      }
      return LInternalCall("typeObject", index, parser.scope.peek(), args);
    }
  })(_ref)));
  _ref = sequential(
    oneOf(
      sequential(
        OpenParenthesis,
        allowSpaceBeforeAccess(separatedList(TypeReference, CommaOrNewline)),
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
    functionIdent = LSymbol.ident(index, parser.scope.peek(), "Function");
    if (returnType) {
      return LInternalCall(
        "typeGeneric",
        index,
        parser.scope.peek(),
        functionIdent,
        returnType
      );
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
        allowSpaceBeforeAccess(notInFunctionTypeParams(function (parser, index) {
          return TypeReference(parser, index);
        }))
      ],
      CloseParenthesis
    ),
    ArrayType,
    ObjectType,
    NullOrVoidLiteral,
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
        return LInternalCall("typeGeneric", index, parser.scope.peek(), [base].concat(__toArray(args)));
      }
    })(_ref))
  );
  Pipe = cache(withSpace(PipeChar));
  TypeReference = cache((_ref = separatedList(NonUnionType, Pipe), mutate(function (types, parser, index) {
    var _arr, _len, i, result, type;
    result = [];
    for (_arr = __toArray(types), i = 0, _len = _arr.length; i < _len; ++i) {
      type = _arr[i];
      if (type.isInternalCall("typeUnion")) {
        result.push.apply(result, __toArray(type.args));
      } else {
        result.push(type);
      }
    }
    if (result.length === 1) {
      return result[0];
    } else {
      return LInternalCall("typeUnion", index, parser.scope.peek(), result);
    }
  })(_ref)));
  MaybeAsType = maybe(sequential(word("as"), SHORT_CIRCUIT, ["this", TypeReference]));
  BracketedObjectKey = cache(sequential(
    OpenSquareBracket,
    ["this", allowSpaceBeforeAccess(ExpressionOrAssignment)],
    CloseSquareBracket
  ));
  ConstObjectKey = oneOf(
    StringLiteral,
    mutate(function (node, parser, index) {
      return LValue(index, String(node.constValue()));
    })(NumberLiteral),
    IdentifierNameConst
  );
  ObjectKey = cache(oneOf(BracketedObjectKey, ConstObjectKey));
  ObjectKeyColon = cache(sequential(
    ["this", ObjectKey],
    Colon,
    except(EqualChar),
    function (parser, index) {
      if (parser.options.noindent) {
        if (EmptyLine(parser, index)) {
          return;
        } else if (parser.options.embedded && (EmbeddedClose(parser, index) || EmbeddedCloseWrite(parser, index))) {
          return;
        }
      }
      return Box(index);
    }
  ));
  function mutateFunction(node, parser, index) {
    var mutateFunctionMacro;
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
      if (param.isInternalCall("param") && param.args[2].constValue()) {
        ++spreadCount;
        if (spreadCount > 1) {
          throw ParserError("Cannot have more than one spread parameter", parser, param.index);
        }
      }
    }
    return params;
  }
  function removeTrailingNothings(array) {
    var last;
    while (array.length) {
      last = array[array.length - 1];
      if (!isNothing(last)) {
        break;
      }
      array.pop();
    }
    return array;
  }
  IdentifierOrThisAccess = oneOf(Identifier, (_ref = sequential(
    ["parent", ThisOrShorthandLiteralPeriod],
    ["child", IdentifierNameConst]
  ), mutate(function (_p, parser, index) {
    var child, parent;
    parent = _p.parent;
    child = _p.child;
    return LAccess(index, parser.scope.peek(), parent, child);
  })(_ref)));
  _ref = sequential(
    ["isMutable", bool(maybe(word("mutable")))],
    ["isSpread", bool(MaybeSpreadToken)],
    ["ident", IdentifierOrThisAccess],
    ["asType", MaybeAsType],
    [
      "defaultValue",
      maybe(sequential(EqualSign, ["this", Expression]))
    ]
  );
  IdentifierParameter = mutate(function (_p, parser, index) {
    var asType, defaultValue, ident, isMutable, isSpread;
    isMutable = _p.isMutable;
    isSpread = _p.isSpread;
    ident = _p.ident;
    asType = _p.asType;
    defaultValue = _p.defaultValue;
    if (isSpread && defaultValue) {
      throw ParserError(
        "Cannot specify a default value for a spread parameter",
        parser,
        index
      );
    }
    return LInternalCall(
      "param",
      index,
      parser.scope.peek(),
      ident,
      defaultValue || LSymbol.nothing(index),
      LValue(index, isSpread),
      LValue(index, isMutable),
      asType || LSymbol.nothing(index)
    );
  })(_ref);
  Parameter = function (parser, index) {
    return Parameter(parser, index);
  };
  _ref = sequential(
    OpenSquareBracket,
    EmptyLines,
    [
      "this",
      allowSpaceBeforeAccess(function (parser, index) {
        return Parameters(parser, index);
      })
    ],
    EmptyLines,
    CloseSquareBracket
  );
  ArrayParameter = mutate(function (params, parser, index) {
    return LInternalCall("array", index, parser.scope.peek(), params);
  })(_ref);
  ParamDualObjectKey = sequential(
    ["key", ObjectKeyColon],
    ["value", Parameter]
  );
  _ref = sequential(
    ["this", IdentifierParameter],
    NotColon
  );
  ParamSingularObjectKey = mutate(function (param, parser, index) {
    var ident, key;
    ident = param.args[0];
    if (ident.isSymbol && ident.isIdent) {
      key = LValue(index, ident.name);
    } else if (ident.isInternalCall("access")) {
      key = ident.args[1];
    } else {
      throw new Error("Unknown object key type: " + __typeof(ident));
    }
    return { key: key, value: param };
  })(_ref);
  KvpParameter = maybe(oneOf(ParamDualObjectKey, ParamSingularObjectKey));
  function makeObjectNode(parser, index, prototype, pairs) {
    var _arr, _i, _len, _ref, key, keyValue, knownKeys, lastPropertyPair,
        ParserError, property;
    knownKeys = [];
    lastPropertyPair = null;
    for (_arr = __toArray(pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      _ref = _arr[_i];
      key = _ref.key;
      property = _ref.property;
      _ref = null;
      if (key.isConst()) {
        keyValue = String(key.constValue());
        if ((property === "get" || property === "set") && lastPropertyPair && lastPropertyPair.property !== property && lastPropertyPair.key === keyValue) {
          lastPropertyPair = null;
          continue;
        } else if (__in(keyValue, knownKeys)) {
          ParserError = require("./parser").ParserError;
          throw ParserError("Duplicate key " + quote(keyValue) + " in object", parser, key.index);
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
    return LInternalCall("object", index, parser.scope.peek(), [prototype || LSymbol.nothing(index)].concat((function () {
      var _arr, _arr2, _i, _len, _ref, key, property, value;
      _arr = [];
      for (_arr2 = __toArray(pairs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        _ref = _arr2[_i];
        key = _ref.key;
        value = _ref.value;
        property = _ref.property;
        _ref = null;
        _arr.push(LInternalCall("array", key.index, parser.scope.peek(), [key, value].concat(property
          ? (typeof property === "string"
            ? [LValue(index, property)]
            : [property])
          : [])));
      }
      return _arr;
    }())));
  }
  _ref = sequential(
    OpenCurlyBrace,
    EmptyLines,
    [
      "this",
      allowSpaceBeforeAccess(separatedList(KvpParameter, CommaOrNewline))
    ],
    EmptyLines,
    CloseCurlyBrace
  );
  ObjectParameter = mutate(function (params, parser, index) {
    return makeObjectNode(parser, index, LSymbol.nothing(index), (function () {
      var _arr, _arr2, _i, _len, param;
      _arr = [];
      for (_arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        if (param) {
          _arr.push(param);
        }
      }
      return _arr;
    }()));
  })(_ref);
  Parameter = oneOf(IdentifierParameter, ArrayParameter, ObjectParameter);
  ParameterOrNothing = oneOf(Parameter, Nothing);
  Parameters = allowSpaceBeforeAccess((_ref = separatedList(ParameterOrNothing, CommaOrNewline), mutate(function (params, parser, index) {
    return validateSpreadParameters(removeTrailingNothings(params), parser);
  })(_ref)));
  _ref = sequential(
    OpenParenthesis,
    SHORT_CIRCUIT,
    EmptyLines,
    ["this", Parameters],
    EmptyLines,
    CloseParenthesis
  );
  ParameterSequence = mutate((function () {
    function checkParam(param, parser, names) {
      var _arr, _i, _len, child, element, ident, name, pair;
      if (param.isInternalCall()) {
        if (param.func.isParam) {
          ident = param.args[0];
          if (ident.isSymbol && ident.isIdent) {
            name = ident.name;
          } else if (ident.isInternalCall("access")) {
            child = ident.args[1];
            if (!child.isConstType("string")) {
              throw new Error("Expected constant access");
            }
            name = child.constValue();
          } else {
            throw new Error("Unknown param ident type: " + __typeof(param));
          }
          if (__in(name, names)) {
            throw ParserError("Duplicate parameter name: " + quote(name), parser, ident.index);
          } else {
            names.push(name);
          }
        } else if (param.func.isArray) {
          for (_arr = __toArray(param.args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            checkParam(element, parser, names);
          }
        } else if (param.func.isObject) {
          for (_arr = __toArray(param.args), _i = 1, _len = _arr.length; _i < _len; ++_i) {
            pair = _arr[_i];
            checkParam(pair.args[1], parser, names);
          }
        } else {
          throw new Error("Unknown param type: " + __typeof(param));
        }
      } else if (!isNothing(param)) {
        throw new Error("Unknown param type: " + __typeof(param));
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
  }()))(_ref);
  requireParameterSequence = makeAlterStack("requireParameterSequence", true);
  dontRequireParameterSequence = makeAlterStack("requireParameterSequence", false);
  _FunctionDeclaration = (function () {
    var _ref, asTypeRule, FunctionFlag, FunctionFlags, GenericDefinitionPart,
        maybeParamsRule;
    FunctionFlag = oneOf(ExclamationPointChar, AtSignChar, AsterixChar, CaretChar);
    _ref = zeroOrMore(FunctionFlag);
    FunctionFlags = mutate(function (codes, parser, index) {
      var _arr, _i, _len, c, flags, uniqueChars;
      flags = { autoReturn: true, bound: false, generator: false, curry: false };
      uniqueChars = [];
      for (_arr = __toArray(codes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        c = _arr[_i];
        if (__in(c, uniqueChars)) {
          throw ParserError("Function flag " + quote(fromCharCode(c)) + " specified more than once", parser, index);
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
          default: throw new Error("Unknown function flag: " + quote(fromCharCode(c)));
          }
        }
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
    maybeParamsRule = maybe(ParameterSequence, function () {
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
    return allowSpaceBeforeAccess(function (parser, index) {
      var _arr, _i, asType, body, flags, flagsValue, func, generic,
          genericMacro, param, params, paramsRule, result, scope;
      generic = GenericDefinitionPart(parser, index);
      scope = parser.pushScope(true);
      if (parser.requireParameterSequence.peek()) {
        paramsRule = ParameterSequence;
      } else {
        paramsRule = maybeParamsRule;
      }
      params = paramsRule(parser, generic.index);
      if (!params) {
        parser.popScope();
        return;
      }
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
      func = LInternalCall(
        "function",
        index,
        parser.scope.peek(),
        LInternalCall("array", index, parser.scope.peek(), params.value),
        flagsValue.autoReturn ? LInternalCall("autoReturn", body.value.index, body.value.scope, body.value) : body.value,
        LValue(index, flagsValue.bound),
        asType.value || LSymbol.nothing(index),
        LValue(index, flagsValue.generator)
      );
      result = mutateFunction(func, parser, index);
      if (flagsValue.curry && params.value.length > 1) {
        result = LCall(
          index,
          parser.scope.peek(),
          LSymbol.ident(index, parser.scope.peek(), "__curry"),
          LValue(index, params.value.length),
          result
        );
      }
      if (generic.value.length) {
        genericMacro = parser.getMacroByLabel("generic");
        if (!genericMacro) {
          throw ParserError(
            "Cannot use generics until the generic macro has been defined",
            parser,
            index
          );
        }
        result = genericMacro.func(
          { macroData: [result, generic.value] },
          parser,
          index
        );
      }
      parser.popScope();
      return Box(body.index, result);
    });
  }());
  FunctionDeclaration = requireParameterSequence(_FunctionDeclaration);
  FunctionLiteral = cache(sequential(Space, HashSignChar, ["this", dontRequireParameterSequence(_FunctionDeclaration)]));
  preventUnclosedObjectLiteral = makeAlterStack("preventUnclosedObjectLiteral", true);
  ArrayLiteral = cache(preventUnclosedObjectLiteral((_ref = sequential(
    OpenSquareBracket,
    Space,
    [
      "this",
      allowSpaceBeforeAccess(concat(
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
      ))
    ],
    CloseSquareBracket
  ), mutate(function (items, parser, index) {
    return LInternalCall("array", index, parser.scope.peek(), items);
  })(_ref))));
  SetLiteral = cache((_ref = sequential(PercentSign, check(OpenSquareBracketChar), SHORT_CIRCUIT, ["this", ArrayLiteral]), mutate(function (value, parser, index) {
    var constructSet;
    constructSet = parser.getMacroByLabel("constructSet");
    if (!constructSet) {
      throw new Error("Cannot use literal set until the construct-set macro has been defined");
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
  DualObjectKey = sequential(
    ["key", ObjectKeyColon],
    NoNewlineIfNoIndent,
    ["value", Expression]
  );
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
  MethodDeclaration = sequential(
    ["property", maybe(GetSetToken)],
    ["key", ObjectKey],
    NotColon,
    ["value", FunctionDeclaration]
  );
  PropertyOrDualObjectKeyOrMethodDeclaration = oneOf(PropertyOrDualObjectKey, MethodDeclaration);
  UnclosedObjectLiteral = cache((_ref = separatedList(PropertyOrDualObjectKey, Comma), mutate(function (pairs, parser, index) {
    return makeObjectNode(parser, index, LSymbol.nothing(index), pairs);
  })(_ref)));
  IdentifierOrAccess = cache(function (parser, index) {
    var result, value;
    result = _IdentifierOrAccess(parser, index);
    if (result) {
      value = result.value;
      if (value.isSymbol && value.isIdent || value.isInternalCall("access")) {
        return result;
      }
    }
  });
  SingularObjectKey = oneOf(
    (_ref = sequential(
      ["this", IdentifierOrAccess],
      NotColon
    ), mutate(function (ident, parser, index) {
      var key;
      if (ident.isSymbol && ident.isIdent) {
        key = LValue(index, ident.name);
      } else if (ident.isInternalCall("access")) {
        key = ident.args[1];
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
        key = LValue(index, String(node.value));
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
        key: LValue(index, "this"),
        value: node
      };
    })(_ref)),
    (_ref = sequential(
      ["this", ArgumentsLiteral],
      NotColon
    ), mutate(function (node, parser, index) {
      return {
        key: LValue(index, "arguments"),
        value: node
      };
    })(_ref)),
    (_ref = sequential(
      ["this", BracketedObjectKey],
      NotColon
    ), mutate(function (node, parser, index) {
      return { key: node, value: node };
    })(_ref))
  );
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
          value: LValue(index, flag === 43)
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
        value: LValue(index, bool === 43)
      };
    })(_ref))
  ));
  ObjectLiteral = cache(allowSpaceBeforeAccess((_ref = sequential(
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
  ), mutate(function (_p, parser, index) {
    var pairs, prototype;
    prototype = _p.prototype;
    pairs = _p.pairs;
    return makeObjectNode(parser, index, prototype, pairs);
  })(_ref))));
  MapLiteral = cache((_ref = sequential(
    PercentSign,
    OpenCurlyBraceChar,
    SHORT_CIRCUIT,
    Space,
    [
      "this",
      allowSpaceBeforeAccess(concat(
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
      ))
    ],
    EmptyLines,
    MaybeCommaOrNewline,
    EmptyLines,
    CloseCurlyBrace
  ), mutate(function (pairs, parser, index) {
    var constructMap;
    constructMap = parser.macros.getByLabel("constructMap");
    if (!constructMap) {
      throw new Error("Cannot use literal map until the construct-map macro has been defined");
    }
    return constructMap.func(
      {
        op: "",
        node: makeObjectNode(parser, index, LSymbol.nothing(index), pairs)
      },
      parser,
      index
    );
  })(_ref)));
  function RighthandAssignment(parser, index) {
    var _arr, _i, op, operator, right, rule;
    function makeFunc(op, right) {
      return function (left, startIndex) {
        return operator.func(
          { left: left, op: op, right: right },
          parser,
          startIndex
        );
      };
    }
    for (_arr = __toArray(parser.assignOperators()), _i = _arr.length; _i--; ) {
      operator = _arr[_i];
      rule = operator.rule;
      op = rule(parser, index);
      if (!op) {
        continue;
      }
      right = ExpressionOrAssignmentOrBody(parser, op.index);
      if (!right) {
        continue;
      }
      return Box(right.index, makeFunc(op.value, right.value));
    }
  }
  function Assignment(parser, index) {
    var left, right;
    left = IdentifierOrAccess(parser, index);
    if (!left) {
      return;
    }
    right = RighthandAssignment(parser, left.index);
    if (!right) {
      return;
    }
    return Box(right.index, right.value(left.value, index));
  }
  CustomOperatorCloseParenthesis = (function () {
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
      node = LSymbol.ident(index, parser.scope.peek(), "x");
      scope = parser.pushScope(true);
      scope.add(node, false, Type.any);
      result = mutateFunction(
        LInternalCall(
          "function",
          index,
          parser.scope.peek(),
          LInternalCall("array", index, parser.scope.peek(), LInternalCall(
            "param",
            index,
            parser.scope.peek(),
            node,
            LSymbol.nothing(index),
            LValue(index, false),
            LValue(index, false),
            LSymbol.nothing(index)
          )),
          LInternalCall("autoReturn", index, parser.scope.peek(), operator.func(
            { op: op.value, node: node },
            parser,
            index
          )),
          LValue(index, false),
          LSymbol.nothing(index),
          LValue(index, false)
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
      left = LSymbol.ident(index, parser.scope.peek(), "x");
      right = LSymbol.ident(index, parser.scope.peek(), "y");
      scope = parser.pushScope(true);
      scope.add(left, false, Type.any);
      scope.add(right, false, Type.any);
      result = mutateFunction(
        LInternalCall(
          "function",
          index,
          parser.scope.peek(),
          LInternalCall("array", index, parser.scope.peek(), (function () {
            var _arr, _arr2, _i, _len, ident;
            _arr = [];
            for (_arr2 = [left, right], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              ident = _arr2[_i];
              _arr.push(LInternalCall(
                "param",
                index,
                parser.scope.peek(),
                ident,
                LSymbol.nothing(index),
                LValue(index, false),
                LValue(index, false),
                LSymbol.nothing(index)
              ));
            }
            return _arr;
          }())),
          LInternalCall("autoReturn", index, parser.scope.peek(), operator.func(
            { left: left, inverted: inverted, op: op.value, right: right },
            parser,
            index
          )),
          LValue(index, false),
          LSymbol.nothing(index),
          LValue(index, false)
        ),
        parser,
        index
      );
      parser.popScope();
      return Box(close.index, LCall(
        index,
        parser.scope.peek(),
        LSymbol.ident(index, parser.scope.peek(), "__curry"),
        LValue(index, 2),
        result
      ));
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
  }());
  function CustomBinaryOperator(parser, index) {
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
  }
  Parenthetical = cache(allowSpaceBeforeAccess(sequential(OpenParenthesis, [
    "this",
    oneOf(
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
          LInternalCall(
            "function",
            index,
            parser.scope.peek(),
            LInternalCall("array", index, parser.scope.peek(), LInternalCall(
              "param",
              index,
              parser.scope.peek(),
              right,
              LSymbol.nothing(index),
              LValue(index, false),
              LValue(index, false),
              LSymbol.nothing(index)
            )),
            LInternalCall("autoReturn", index, parser.scope.peek(), operator.operator.func(
              { left: left.rescope(scope), inverted: operator.inverted, op: operator.op, right: right },
              parser,
              index
            )),
            LValue(index, false),
            LSymbol.nothing(index),
            LValue(index, false)
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
          LInternalCall(
            "function",
            index,
            parser.scope.peek(),
            LInternalCall("array", index, parser.scope.peek(), LInternalCall(
              "param",
              index,
              parser.scope.peek(),
              left,
              LSymbol.nothing(index),
              LValue(index, false),
              LValue(index, false),
              LSymbol.nothing(index)
            )),
            LInternalCall("autoReturn", index, parser.scope.peek(), operator.func(
              { left: left, inverted: inverted, op: op, right: right.rescope(scope) },
              parser,
              index
            )),
            LValue(index, false),
            LSymbol.nothing(index),
            LValue(index, false)
          ),
          parser,
          index
        );
        parser.popScope();
        return result;
      })(_ref)),
      (_ref = sequential(
        ["this", SomeInvocationOrAccessParts],
        CloseParenthesis
      ), mutate(function (tail, parser, index) {
        var left, result, scope;
        scope = parser.pushScope(true);
        left = parser.makeTmp(index, "o");
        result = mutateFunction(
          LInternalCall(
            "function",
            index,
            parser.scope.peek(),
            LInternalCall("array", index, parser.scope.peek(), LInternalCall(
              "param",
              index,
              parser.scope.peek(),
              left,
              LSymbol.nothing(index),
              LValue(index, false),
              LValue(index, false),
              LSymbol.nothing(index)
            )),
            LInternalCall("autoReturn", index, parser.scope.peek(), convertInvocationOrAccess(
              false,
              { type: "normal", existential: false, node: left },
              tail,
              parser,
              index
            ).rescope(scope)),
            LValue(index, false),
            LSymbol.nothing(index),
            LValue(index, false)
          ),
          parser,
          index
        );
        parser.popScope();
        return result;
      })(_ref))
    )
  ])));
  CurrentArrayLength = cache(function (parser, index) {
    var asterix;
    if (parser.asterixAsArrayLength.peek()) {
      asterix = AsterixChar(parser, index);
      if (asterix) {
        return Box(asterix.index, LSymbol.ident(index, parser.scope.peek(), "__currentArrayLength"));
      }
    }
  });
  IndentedUnclosedObjectLiteralInner = cache((_ref = separatedList(PropertyOrDualObjectKey, CommaOrSomeEmptyLinesWithCheckIndent), mutate(function (pairs, parser, index) {
    return makeObjectNode(parser, index, LSymbol.nothing(index), pairs);
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
  UnclosedArrayLiteralElement = sequential(AsterixChar, Space, [
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
  ]);
  IndentedUnclosedArrayLiteralInner = cache((_ref = separatedList(UnclosedArrayLiteralElement, sequential(MaybeComma, SomeEmptyLinesWithCheckIndent)), mutate(function (items, parser, index) {
    return LInternalCall("array", index, parser.scope.peek(), items);
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
  inAst = makeAlterStack("inAst", true);
  inEvilAst = makeAlterStack("inEvilAst", true);
  AstPosition = maybe(sequential(
    OpenParenthesisChar,
    ["this", Expression],
    CloseParenthesis
  ));
  AstExpression = sequential(
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
    ["position", AstPosition],
    [
      "body",
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
  );
  AstStatement = sequential(
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
    ["position", AstPosition],
    [
      "body",
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
  );
  Ast = cache((_ref = oneOf(AstExpression, AstStatement), mutate(function (_p, parser, index) {
    var body, position;
    position = _p.position;
    body = _p.body;
    if (position && typeof position.index !== "number") {
      throw ParserError("Unexpected position node in AST", parser, index);
    }
    return MacroContext.constifyObject(position, body, index, parser.scope.peek());
  })(_ref)));
  PrimaryExpression = cache(oneOf(
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
                setParent = LCall(
                  index,
                  parser.scope.peek(),
                  LSymbol.assign["="](index),
                  tmp,
                  parent.doWrap(parser)
                );
                parent = tmp;
              }
              result = LInternalCall("array", index, parser.scope.peek(), (function () {
                var _arr, _arr2, _len, element, i;
                _arr = [];
                for (_arr2 = __toArray(child.elements), i = 0, _len = _arr2.length; i < _len; ++i) {
                  element = _arr2[i];
                  _arr.push(LAccess(
                    index,
                    parser.scope.peek(),
                    i === 0 ? setParent : parent,
                    element
                  ));
                }
                return _arr;
              }()));
              if (tmpIds.length) {
                return LInternalCall("tmpWrapper", index, result.scope, [result].concat((function () {
                  var _arr, _i, _len, tmpId;
                  _arr = [];
                  for (_i = 0, _len = tmpIds.length; _i < _len; ++_i) {
                    tmpId = tmpIds[_i];
                    _arr.push(LValue(index, tmpId));
                  }
                  return _arr;
                }())));
              } else {
                return result;
              }
            };
          }
        };
        return function (parser, index, head, link, linkIndex, links) {
          var bindAccess, child, existentialOp, makeAccess, result, setChild,
              setHead, tmp, tmpIds;
          if (link.bind) {
            bindAccess = function (parent, child) {
              return LCall(
                index,
                parser.scope.peek(),
                LSymbol.ident(index, parser.scope.peek(), "__bind"),
                parent,
                child
              );
            };
          } else {
            bindAccess = function (parent, child) {
              return LAccess(index, parser.scope.peek(), parent, child);
            };
          }
          if (link.owns) {
            tmpIds = [];
            setHead = head;
            if (head.cacheable) {
              tmp = parser.makeTmp(index, "ref", head.type(parser));
              tmpIds.push(tmp.id);
              setHead = LCall(
                index,
                parser.scope.peek(),
                LSymbol.assign["="](index),
                tmp,
                head.doWrap(parser)
              );
              head = tmp;
            }
            child = link.child;
            setChild = child;
            if (child.cacheable) {
              tmp = parser.makeTmp(index, "ref", child.type(parser));
              tmpIds.push(tmp.id);
              setChild = LCall(
                index,
                parser.scope.peek(),
                LSymbol.assign["="](index),
                tmp,
                child.doWrap(parser)
              );
              child = tmp;
            }
            result = LInternalCall(
              "if",
              index,
              parser.scope.peek(),
              (function () {
                var existentialOp, ownershipOp;
                ownershipOp = parser.getMacroByLabel("ownership");
                if (!ownershipOp) {
                  throw new Error("Cannot use ownership access until the ownership operator has been defined");
                }
                if (link.existential) {
                  existentialOp = parser.getMacroByLabel("existential");
                  if (!existentialOp) {
                    throw new Error("Cannot use existential access until the existential operator has been defined");
                  }
                  return LCall(
                    index,
                    parser.scope.peek(),
                    LSymbol.binary["&&"](index),
                    existentialOp.func(
                      { op: "", node: setHead },
                      parser,
                      index
                    ),
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
                +linkIndex + 1,
                links
              ),
              LSymbol.nothing(index)
            );
            if (tmpIds.length) {
              return LInternalCall("tmpWrapper", index, result.scope, [result].concat((function () {
                var _arr, _i, _len, tmpId;
                _arr = [];
                for (_i = 0, _len = tmpIds.length; _i < _len; ++_i) {
                  tmpId = tmpIds[_i];
                  _arr.push(LValue(index, tmpId));
                }
                return _arr;
              }())));
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
                throw new Error("Unknown index type: " + link.child.type);
              }
              makeAccess = indexTypes[link.child.type](parser, index, link.child);
              break;
            default: throw new Error("Unknown link type: " + link.type);
            }
            if (link.existential) {
              tmpIds = [];
              setHead = head;
              if (head.cacheable) {
                tmp = parser.makeTmp(index, "ref", head.type(parser));
                tmpIds.push(tmp.id);
                setHead = LCall(
                  index,
                  parser.scope.peek(),
                  LSymbol.assign["="](index),
                  tmp,
                  head.doWrap(parser)
                );
                head = tmp;
              }
              existentialOp = parser.getMacroByLabel("existential");
              if (!existentialOp) {
                throw new Error("Cannot use existential access until the existential operator has been defined");
              }
              result = LInternalCall(
                "if",
                index,
                parser.scope.peek(),
                existentialOp.func(
                  { op: "", node: setHead },
                  parser,
                  index
                ),
                convertCallChain(
                  parser,
                  index,
                  makeAccess(head),
                  +linkIndex + 1,
                  links
                ),
                LSymbol.nothing(index)
              );
              if (tmpIds.length) {
                return LInternalCall("tmpWrapper", index, result.scope, [result].concat((function () {
                  var _arr, _i, _len, tmpId;
                  _arr = [];
                  for (_i = 0, _len = tmpIds.length; _i < _len; ++_i) {
                    tmpId = tmpIds[_i];
                    _arr.push(LValue(index, tmpId));
                  }
                  return _arr;
                }())));
              } else {
                return result;
              }
            } else {
              return convertCallChain(
                parser,
                index,
                makeAccess(head),
                +linkIndex + 1,
                links
              );
            }
          }
        };
      }()),
      call: function (parser, index, head, link, linkIndex, links) {
        var _ref, child, parent, result, setChild, setHead, setParent, tmp,
            tmpIds;
        function nextChain() {
          return convertCallChain(
            parser,
            index,
            link.isContextCall ? LInternalCall("contextCall", index, parser.scope.peek(), [head].concat(__toArray(link.args)))
              : link.isNew ? LInternalCall("new", index, parser.scope.peek(), [head].concat(__toArray(link.args)))
              : LCall(index, parser.scope.peek(), head, link.args),
            +linkIndex + 1,
            links
          );
        }
        if (!link.existential) {
          return nextChain();
        } else {
          tmpIds = [];
          setHead = head;
          if (head.isInternalCall("access") && !link.isContextCall && !link.isNew) {
            _ref = head.args;
            parent = _ref[0];
            child = _ref[1];
            _ref = null;
            setParent = parent;
            setChild = child;
            if (parent.cacheable) {
              tmp = parser.makeTmp(index, "ref", parent.type(parser));
              tmpIds.push(tmp.id);
              setParent = LCall(
                index,
                parser.scope.peek(),
                LSymbol.assign["="](index),
                tmp,
                parent.doWrap(parser)
              );
              parent = tmp;
            }
            if (child.cacheable) {
              tmp = parser.makeTmp(index, "ref", child.type(parser));
              tmpIds.push(tmp.id);
              setChild = LCall(
                index,
                parser.scope.peek(),
                LSymbol.assign["="](index),
                tmp,
                child.doWrap(parser)
              );
              child = tmp;
            }
            if (parent !== setParent || child !== setChild) {
              setHead = LAccess(index, parser.scope.peek(), setParent, setChild);
              head = LAccess(index, parser.scope.peek(), parent, child);
            }
          } else if (head.cacheable) {
            tmp = parser.makeTmp(index, "ref", head.type(parser));
            tmpIds.push(tmp.id);
            setHead = LCall(
              index,
              parser.scope.peek(),
              LSymbol.assign["="](index),
              tmp,
              head.doWrap(parser)
            );
            head = tmp;
          }
          result = LInternalCall(
            "if",
            index,
            parser.scope.peek(),
            LCall(
              index,
              parser.scope.peek(),
              LSymbol.binary["==="](index),
              LCall(index, parser.scope.peek(), LSymbol.unary["typeof"](index), setHead),
              LValue(index, "function")
            ),
            nextChain(),
            LSymbol.nothing(index)
          );
          if (tmpIds.length) {
            return LInternalCall("tmpWrapper", index, result.scope, [result].concat((function () {
              var _arr, _i, _len, tmpId;
              _arr = [];
              for (_i = 0, _len = tmpIds.length; _i < _len; ++_i) {
                tmpId = tmpIds[_i];
                _arr.push(LValue(index, tmpId));
              }
              return _arr;
            }())));
          } else {
            return result;
          }
        }
      }
    };
    linkTypes.accessIndex = linkTypes.access;
    function convertCallChain(parser, index, head, linkIndex, links) {
      var link;
      if (linkIndex >= links.length) {
        return head;
      } else {
        link = links[linkIndex];
        if (!__owns.call(linkTypes, link.type)) {
          throw new Error("Unknown call-chain link: " + link.type);
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
            child: LValue(index, "prototype"),
            existential: part.existential
          });
          links.push((_ref = __import({}, part), part.type === "protoAccess" ? (_ref.type = "access") : (_ref.type = "accessIndex"), _ref));
          break;
        case "access":
        case "accessIndex":
          links.push(part);
          break;
        case "call":
          if (isNew && part.isContextCall) {
            throw ParserError("Cannot call with both new and @ at the same time", parser, index);
          }
          links.push((_ref = __import({}, part), _ref.isNew = isNew, _ref));
          isNew = false;
          break;
        case "generic":
          if (!parser.getConstValue("DISABLE_GENERICS", false)) {
            links.push({
              type: "access",
              child: LValue(index, "generic"),
              existential: false
            });
            links.push({ type: "call", args: part.args, existential: false });
          }
          break;
        default: throw new Error("Unknown link type: " + part.type);
        }
      }
      if (isNew) {
        links.push({
          type: "call",
          args: [],
          existential: false,
          isNew: true,
          isContextCall: false
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
  function SpaceBeforeAccess(parser, index) {
    if (parser.disallowSpaceBeforeAccess.peek()) {
      return Box(index);
    } else {
      return Space(parser, index);
    }
  }
  InvocationOrAccessPart = oneOf(
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
    ), mutate(function (args, _p, _p2, index) {
      return { type: "generic", args: args, index: index };
    })(_ref)),
    (_ref = sequential(
      ["existential", MaybeQuestionMarkChar],
      ["owns", MaybeExclamationPointChar],
      ["bind", MaybeAtSignChar],
      SpaceBeforeAccess,
      ["type", PeriodOrDoubleColonChar],
      ["child", IdentifierNameConstOrNumberLiteral]
    ), mutate(function (x, _p, _p2, index) {
      return {
        type: x.type === "::" ? "protoAccess" : "access",
        child: x.child,
        existential: x.existential,
        owns: x.owns,
        bind: x.bind,
        index: index
      };
    })(_ref)),
    (_ref = sequential(
      ["existential", MaybeQuestionMarkChar],
      ["owns", MaybeExclamationPointChar],
      ["bind", MaybeAtSignChar],
      ["type", maybe(DoubleColonChar)],
      OpenSquareBracketChar,
      [
        "child",
        allowSpaceBeforeAccess((_ref2 = separatedList(
          makeAlterStack("asterixAsArrayLength", true)(Expression),
          CommaOrNewline
        ), mutate(function (nodes) {
          if (nodes.length > 1) {
            return { type: "multi", elements: nodes };
          } else {
            return { type: "single", node: nodes[0] };
          }
        })(_ref2)))
      ],
      CloseSquareBracket
    ), mutate(function (x, parser, index, endIndex) {
      if (x.child.type === "single") {
        return {
          type: x.type === "::" ? "protoAccess" : "access",
          child: x.child.node,
          existential: x.existential,
          owns: x.owns,
          bind: x.bind,
          index: endIndex
        };
      } else {
        if (x.owns) {
          throw ParserError(
            "Cannot use ! when using a multiple or slicing index",
            parser,
            index
          );
        } else if (x.bind) {
          throw ParserError(
            "Cannot use @ when using a multiple or slicing index",
            parser,
            index
          );
        }
        return {
          type: x.type === "::" ? "protoAccessIndex" : "accessIndex",
          child: x.child,
          existential: x.existential,
          index: endIndex
        };
      }
    })(_ref)),
    (_ref = sequential(
      ["existential", bool(MaybeQuestionMarkChar)],
      ["isContextCall", bool(MaybeAtSignChar)],
      ["args", InvocationArguments]
    ), mutate(function (x, _p, _p2, index) {
      return {
        type: "call",
        args: x.args,
        existential: x.existential,
        isNew: false,
        isContextCall: x.isContextCall,
        index: index
      };
    })(_ref))
  );
  CheckPeriodNotDoublePeriod = check(sequential(Period, except(Period)));
  insideIndentedAccess = makeAlterStack("insideIndentedAccess", true);
  InvocationOrAccessParts = concat(zeroOrMore(InvocationOrAccessPart), maybe(
    sequential(
      function (parser, index) {
        var disallowSpace;
        disallowSpace = parser.disallowSpaceBeforeAccess.peek();
        if (!disallowSpace || disallowSpace === 1 && parser.insideIndentedAccess.peek()) {
          return Box(index);
        }
      },
      IndentationRequired,
      SomeEmptyLines,
      [
        "this",
        retainIndent((_ref = sequential(
          Advance,
          CheckIndent,
          CheckPeriodNotDoublePeriod,
          [
            "this",
            separatedList(insideIndentedAccess(zeroOrMore(InvocationOrAccessPart)), sequential(SomeEmptyLinesWithCheckIndent, CheckPeriodNotDoublePeriod))
          ],
          PopIndent
        ), mutate(function (x) {
          var _ref;
          return (_ref = []).concat.apply(_ref, __toArray(x));
        })(_ref)))
      ]
    ),
    function () {
      return [];
    }
  ));
  function SomeInvocationOrAccessParts(parser, index) {
    var result;
    result = InvocationOrAccessParts(parser, index);
    if (result.value.length > 0) {
      return result;
    }
  }
  _ref = sequential(
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
          return { type: "normal", node: node };
        })(PrimaryExpression)
      )
    ],
    ["tail", InvocationOrAccessParts]
  );
  BasicInvocationOrAccess = mutate(function (_p, parser, index) {
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
  })(_ref);
  _ref = sequential(
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
          return { type: "normal", node: node };
        })(PrimaryExpression)
      )
    ],
    [
      "tail",
      function (parser, index) {
        var _ref, tail;
        tail = InvocationOrAccessParts(parser, index).value;
        tail = tail.slice();
        while (tail.length > 0 && (_ref = tail[tail.length - 1].type) !== "access" && _ref !== "protoAccess") {
          tail.pop();
        }
        if (tail.length === 0) {
          return Box(index, []);
        } else {
          return Box(tail[tail.length - 1].index, tail);
        }
      }
    ]
  );
  _IdentifierOrAccess = mutate(function (_p, parser, index) {
    var head, tail;
    head = _p.head;
    tail = _p.tail;
    return convertInvocationOrAccess(
      false,
      __import({}, head),
      tail,
      parser,
      index
    );
  })(_ref);
  SuperInvocation = cache((_ref = sequential(
    word("super"),
    SHORT_CIRCUIT,
    [
      "child",
      maybe(oneOf(
        sequential(EmptyLines, Space, Period, ["this", IdentifierNameConstOrNumberLiteral]),
        sequential(
          OpenSquareBracketChar,
          ["this", allowSpaceBeforeAccess(Expression)],
          CloseSquareBracket
        )
      ))
    ],
    ["args", InvocationArguments]
  ), mutate(function (_p, parser, index) {
    var args, child;
    child = _p.child;
    args = _p.args;
    return LInternalCall("super", index, parser.scope.peek(), [child || LSymbol.nothing(index)].concat(__toArray(args)));
  })(_ref)));
  Eval = cache((_ref = sequential(word("eval"), SHORT_CIRCUIT, ["this", InvocationArguments]), mutate(function (args, parser, index) {
    if (args.length !== 1) {
      throw ParserError("Expected only one argument to eval, got " + args.length, parser, index);
    }
    return LCall(
      index,
      parser.scope.peek(),
      LSymbol.ident(index, parser.scope.peek(), "eval", true),
      args[0]
    );
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
        return Box(args.index, LCall(
          index,
          parser.scope.peek(),
          LSymbol.ident(index, parser.scope.peek(), "$"),
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
  inCascade = makeAlterStack("inCascade", true);
  CascadePart = cache(sequential(
    except(SpreadToken),
    Period,
    check(Period),
    ["accesses", zeroOrMore(InvocationOrAccessPart)],
    ["assignment", maybe(inCascade(RighthandAssignment))]
  ));
  CascadePartWithCascade = function (parser, index) {
    return CascadePartWithCascade(parser, index);
  };
  CascadePartWithCascade = cache(sequential(
    ["main", CascadePart],
    [
      "subcascades",
      maybe(
        retainIndent(sequential(
          SomeEmptyLines,
          Advance,
          CheckIndent,
          [
            "this",
            separatedList(CascadePartWithCascade, SomeEmptyLinesWithCheckIndent)
          ],
          PopIndent
        )),
        function () {
          return [];
        }
      )
    ]
  ));
  Cascade = cache((_ref = sequential(
    ["head", InvocationOrAccess],
    [
      "tail",
      oneOf(
        function (parser, index) {
          if (parser.inCascade.peek()) {
            return Box(index, []);
          }
        },
        concat(
          zeroOrMore(sequential(SpaceBeforeAccess, [
            "this",
            mutate(function (main) {
              return { main: main, subcascades: [] };
            })(CascadePart)
          ])),
          maybe(
            sequential(
              IndentationRequired,
              function (parser, index) {
                if (!parser.disallowSpaceBeforeAccess.peek()) {
                  return Box(index);
                }
              },
              SomeEmptyLines,
              [
                "this",
                retainIndent(sequential(
                  Advance,
                  CheckIndent,
                  [
                    "this",
                    separatedList(CascadePartWithCascade, SomeEmptyLinesWithCheckIndent)
                  ],
                  PopIndent
                ))
              ]
            ),
            function () {
              return [];
            }
          )
        )
      )
    ]
  ), mutate(function (_p, parser, index) {
    var handle, head, mutateFunctionMacro, tail;
    head = _p.head;
    tail = _p.tail;
    if (tail.length) {
      mutateFunctionMacro = parser.getMacroByLabel("cascade");
      if (!mutateFunctionMacro) {
        throw ParserError(
          "Cannot use cascades until the cascade macro has been defined",
          parser,
          index
        );
      }
      handle = function (head, tail, index) {
        var _this;
        _this = this;
        if (tail.length) {
          return mutateFunctionMacro.func(
            {
              macroData: [
                head,
                (function () {
                  var _arr, _arr2, _f, _i, _len;
                  _arr = [];
                  for (_arr2 = __toArray(tail), _i = 0, _len = _arr2.length, _f = function (_v) {
                    var _ref, accesses, assignment, subcascades;
                    _ref = _v.main;
                    accesses = _ref.accesses;
                    assignment = _ref.assignment;
                    _ref = null;
                    subcascades = _v.subcascades;
                    return function (node) {
                      var access, ret;
                      access = convertInvocationOrAccess(
                        false,
                        { type: "normal", node: node },
                        accesses,
                        parser,
                        index
                      );
                      if (assignment != null) {
                        ret = assignment(access, index);
                      } else {
                        ret = access;
                      }
                      if (subcascades) {
                        return handle(ret, subcascades, index);
                      } else {
                        return ret;
                      }
                    };
                  }; _i < _len; ++_i) {
                    _arr.push(_f.call(_this, _arr2[_i]));
                  }
                  return _arr;
                }())
              ]
            },
            parser,
            index
          );
        } else {
          return head;
        }
      };
      return handle(head, tail, index);
    } else {
      return head;
    }
  })(_ref)));
  PostfixUnaryOperation = cache(function (parser, index) {
    var _arr, _i, found, node, op, operator, rule;
    node = Cascade(parser, index);
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
        var _arr, _i, _i2, _len, currentIndex, head, invert, inverted, j, left,
            nextRule, node, op, operator, operators, part, result, right, rule,
            tail;
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
            if (operator.maximum && tail.length >= operator.maximum) {
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
        var _len, ch, currentIndex, i, indent, l, len, line, lines, result,
            source;
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
            return Box(currentIndex + 2, LInternalCall("comment", index, parser.scope.peek(), LValue(index, result.join(""))));
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
  MacroSyntaxParameterType = allowSpaceBeforeAccess((_ref = sequential(
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
          return LInternalCall("syntaxSequence", index, parser.scope.peek(), value);
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
        ), mutate(function (choices, parser, index) {
          return LInternalCall("syntaxChoice", index, parser.scope.peek(), choices);
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
      return LInternalCall(
        "syntaxMany",
        index,
        parser.scope.peek(),
        type,
        LValue(index, multiplier)
      );
    } else {
      return type;
    }
  })(_ref)));
  MacroSyntaxParameter = oneOf(StringLiteral, (_ref = sequential(
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
    return LInternalCall(
      "syntaxParam",
      index,
      parser.scope.peek(),
      ident,
      type || LSymbol.nothing(index)
    );
  })(_ref)));
  MacroSyntaxParameterLookahead = oneOf(
    (_ref = sequential(
      [
        "lookahead",
        oneOf(symbol("?="), symbol("?!"))
      ],
      [
        "type",
        oneOf(StringLiteral, MacroSyntaxParameterType)
      ]
    ), mutate(function (_p, parser, index) {
      var lookahead, type;
      lookahead = _p.lookahead;
      type = _p.type;
      return LInternalCall(
        "syntaxLookahead",
        index,
        parser.scope.peek(),
        LValue(index, lookahead === "?!"),
        type
      );
    })(_ref)),
    MacroSyntaxParameter
  );
  MacroSyntaxParameters = separatedList(MacroSyntaxParameterLookahead, Comma);
  MacroSyntaxChoiceParameters = separatedList(MacroSyntaxParameterType, Pipe);
  MacroOptions = maybe(
    (_ref = sequential(word("with"), ["this", UnclosedObjectLiteral]), mutate(function (object, parser, index) {
      object = object.reduce(parser);
      if (!object.isLiteral()) {
        throw ParserError(
          "Macro options must be a literal object without any logic, invocation, or anything else",
          parser,
          index
        );
      }
      return object.literalValue();
    })(_ref)),
    function () {
      return {};
    }
  );
  function addMacroSyntaxParametersToScope(params, scope) {
    var _arr, _i, _len, ident, param;
    for (_arr = __toArray(params), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      param = _arr[_i];
      if (param.isInternalCall("syntaxParam")) {
        ident = param.args[0];
        if (ident.isSymbol && ident.isIdent) {
          scope.add(ident, true, Type.any);
        }
      }
    }
  }
  MacroSyntax = sequential(
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
      addMacroSyntaxParametersToScope(params.value, scope);
      scope.add(
        LSymbol.ident(index, parser.scope.peek(), "macroName"),
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
  );
  MacroBody = oneOf(
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
      return Box(body.index, LSymbol.nothing(index));
    }
  );
  inMacro = makeAlterStack("inMacro", true);
  _DefineMacro = sequential(word("macro"), [
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
      return Box(body.index, LSymbol.nothing(index));
    })
  ]);
  DefineSyntax = (function () {
    var topRule;
    topRule = sequential(
      oneOf(word("define"), word("macro")),
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
        LSymbol.nothing(index)
      );
    });
  }());
  _ref = sequential(
    oneOf(word("define"), word("macro")),
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
  );
  DefineHelper = mutate(function (_p, parser, index) {
    var name, value;
    name = _p.name;
    value = _p.value;
    parser.defineHelper(index, name, value);
    return LSymbol.nothing(index);
  })(_ref);
  DefineOperator = (function () {
    var mainRule;
    mainRule = sequential(
      oneOf(word("define"), word("macro")),
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
      _ref = x.value;
      type = _ref.type;
      ops = _ref.ops;
      options = _ref.options;
      _ref = null;
      scope = parser.pushScope(true);
      switch (type) {
      case "binary":
      case "assign":
        scope.add(
          LSymbol.ident(index, parser.scope.peek(), "left"),
          true,
          Type.any
        );
        scope.add(
          LSymbol.ident(index, parser.scope.peek(), "op"),
          true,
          Type.string
        );
        scope.add(
          LSymbol.ident(index, parser.scope.peek(), "right"),
          true,
          Type.any
        );
        break;
      case "unary":
        scope.add(
          LSymbol.ident(index, parser.scope.peek(), "op"),
          true,
          Type.string
        );
        scope.add(
          LSymbol.ident(index, parser.scope.peek(), "node"),
          true,
          Type.any
        );
        break;
      default: throw new Error("Unhandled value in switch");
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
      default: throw new Error();
      }
      parser.popScope();
      return Box(body.index, LSymbol.nothing(index));
    });
  }());
  DefineMacro = cache(oneOf(DefineSyntax, DefineHelper, DefineOperator, _DefineMacro));
  _ref = sequential(
    word("const"),
    SHORT_CIRCUIT,
    ["name", Name],
    EqualSign,
    ["value", Expression]
  );
  DefineConstLiteral = mutate(function (_p, parser, index) {
    var name, value;
    name = _p.name;
    value = _p.value;
    value = parser.macroExpandAll(value.reduce(parser));
    if (!value.isLiteral()) {
      throw ParserError("const value must be a literal.", parser, index);
    }
    parser.defineConst(index, name, value.literalValue());
    return LSymbol.nothing(index);
  })(_ref);
  Statement = cache(sequential(
    [
      "this",
      inStatement(oneOf(
        LicenseComment,
        DefineMacro,
        DefineConstLiteral,
        Assignment,
        ExpressionAsStatement
      ))
    ],
    Space
  ));
  makeEmbeddedRule = (function () {
    var rules;
    function make(text) {
      var _arr, codes, i, len;
      len = text.length;
      _arr = [];
      for (i = 0; i < len; ++i) {
        _arr.push(text.charCodeAt(i));
      }
      codes = _arr;
      return function (parser, index) {
        var i, source;
        source = parser.source;
        for (i = 0; i < len; ++i) {
          if (source.charCodeAt(+index + i) !== codes[i]) {
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
  EmbeddedOpenLiteral = cache(makeEmbeddedRule("embeddedOpenLiteral", "<%@"));
  EmbeddedCloseLiteral = makeEmbeddedRule("embeddedCloseLiteral", "@%>");
  function EmbeddedReadExplicitLiteralText(parser, index) {
    var c, close, codes, currentIndex, len, open, source;
    open = EmbeddedOpenLiteral(parser, index);
    if (!open) {
      return;
    }
    source = parser.source;
    len = source.length;
    currentIndex = open.index;
    codes = [];
    for (; currentIndex < len; ++currentIndex) {
      close = EmbeddedCloseLiteral(parser, currentIndex);
      if (close) {
        return Box(close.index, codes);
      }
      c = source.charCodeAt(currentIndex);
      if (c === 13 && source.charCodeAt(+currentIndex + 1) === 10) {
        c = 10;
        ++currentIndex;
      }
      codes.push(c);
    }
    throw ParserError("Literal text never ends", parser, index);
  }
  function unprettyText(text) {
    return text.replace(/\s+/g, " ");
  }
  function EmbeddedReadLiteralText(parser, index) {
    var c, codes, currentIndex, explicitLiteral, len, source, text;
    source = parser.source;
    len = source.length;
    currentIndex = index;
    codes = [];
    for (; currentIndex < len; ++currentIndex) {
      explicitLiteral = EmbeddedReadExplicitLiteralText(parser, currentIndex);
      if (explicitLiteral) {
        currentIndex = explicitLiteral.index - 1;
        codes = codes.concat(explicitLiteral.value);
        continue;
      }
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
    return Box(currentIndex, LInternalCall(
      "embedWrite",
      index,
      parser.scope.peek(),
      LValue(index, text),
      LValue(index, false)
    ));
  }
  EmbeddedOpenComment = cache(makeEmbeddedRule("embeddedOpenComment", "<%--"));
  EmbeddedCloseComment = makeEmbeddedRule("embeddedCloseComment", "--%>");
  function EmbeddedComment(parser, index) {
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
        throw new Error("Infinite loop detected");
      }
      currentIndex = any.index;
    }
    return Box(currentIndex, LSymbol.nothing(index));
  }
  EmbeddedOpen = cache(makeEmbeddedRule("embeddedOpen", "<%"));
  EmbeddedClose = cache(sequential(EmptyLines, Space, oneOf(Eof, makeEmbeddedRule("embeddedClose", "%>"))));
  EmbeddedOpenWrite = cache(makeEmbeddedRule("embeddedOpenWrite", "<%="));
  EmbeddedCloseWrite = cache(sequential(EmptyLines, Space, oneOf(Eof, makeEmbeddedRule("embeddedCloseWrite", "%>"))));
  ColonEmbeddedClose = cache(sequential(Colon, EmbeddedClose));
  ColonEmbeddedCloseWrite = cache(sequential(Colon, EmbeddedCloseWrite));
  NotEmbeddedOpenLiteral = cache(except(EmbeddedOpenLiteral));
  NotEmbeddedOpenComment = cache(except(EmbeddedOpenComment));
  NotEmbeddedOpenWrite = cache(except(EmbeddedOpenWrite));
  disallowEmbeddedText = makeAlterStack("allowEmbeddedText", false);
  EmbeddedWriteExpression = disallowEmbeddedText((_ref = sequential(
    NotEmbeddedOpenComment,
    NotEmbeddedOpenLiteral,
    EmbeddedOpenWrite,
    ["this", Expression],
    EmbeddedCloseWrite
  ), mutate(function (node, parser, index) {
    return LInternalCall(
      "embedWrite",
      index,
      parser.scope.peek(),
      node,
      LValue(index, true)
    );
  })(_ref)));
  EmbeddedLiteralTextInnerPart = oneOf(EmbeddedComment, EmbeddedWriteExpression, EmbeddedReadLiteralText);
  EmbeddedLiteralText = cache((_ref = sequential(
    function (parser, index) {
      if (parser.options.embedded && parser.allowEmbeddedText.peek() && index < parser.source.length) {
        return Box(index);
      }
    },
    EmbeddedClose,
    ["this", zeroOrMore(EmbeddedLiteralTextInnerPart)],
    oneOf(Eof, sequential(NotEmbeddedOpenComment, NotEmbeddedOpenWrite, NotEmbeddedOpenLiteral, EmbeddedOpen))
  ), mutate(function (nodes, parser, index) {
    return LInternalCall("block", index, parser.scope.peek(), nodes);
  })(_ref)));
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
          needSemicolon = false;
          parts.push(ret.value);
          currentIndex = ret.index;
        } else {
          if (needSemicolon) {
            ret = SemicolonsStatement(parser, currentIndex);
          } else {
            ret = Statement(parser, currentIndex);
          }
          if (ret) {
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
        if (part.isInternalCall("block")) {
          nodes.push.apply(nodes, __toArray(part.args));
        } else if (!isNothing(part)) {
          nodes.push(part);
        }
      }
    }
    switch (nodes.length) {
    case 0: return LSymbol.nothing(index);
    case 1: return nodes[0];
    default:
      return LInternalCall("block", index, parser.scope.peek(), nodes);
    }
  }
  RootInnerP = __promise(function (parser, index) {
    var _e, _send, _state, _step, _throw, currentIndex, head, item, result,
        separator;
    _state = 0;
    function _close() {
      _state = 9;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          parser.clearCache();
          head = Line(parser, index);
          _state = !head ? 9 : 1;
          break;
        case 1:
          result = [head.value];
          currentIndex = head.index;
          ++_state;
        case 2: ++_state;
        case 3:
          parser.clearCache();
          _state = !parser.options.sync ? 4 : 5;
          break;
        case 4:
          ++_state;
          return { done: false, value: __defer.fulfilled(void 0) };
        case 5:
          separator = SomeEmptyLines(parser, currentIndex);
          _state = !separator ? 8 : 6;
          break;
        case 6:
          item = Line(parser, separator.index);
          _state = !item ? 8 : 7;
          break;
        case 7:
          currentIndex = item.index;
          result.push(item.value);
          _state = 2;
          break;
        case 8:
          parser.clearCache();
          ++_state;
          return {
            done: true,
            value: Box(currentIndex, _BlockMutator(result, parser, index))
          };
        case 9:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      _close();
      throw _e;
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _throw(_e);
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
  _Block = mutate(_BlockMutator, separatedList(Line, SomeEmptyLines));
  Block = oneOf(
    sequential(CheckIndent, [
      "this",
      oneOf(IndentedUnclosedObjectLiteralInner, IndentedUnclosedArrayLiteralInner)
    ]),
    _Block
  );
  EmbeddedBlock = sequential(
    NotEmbeddedOpenWrite,
    NotEmbeddedOpenComment,
    NotEmbeddedOpenLiteral,
    EmbeddedOpen,
    ["this", _Block],
    EmbeddedClose
  );
  EmbeddedLiteralTextInnerPartWithBlock = oneOf(EmbeddedLiteralTextInnerPart, EmbeddedBlock);
  EmbeddedRootInnerP = __promise(function (parser, index) {
    var _e, _send, _state, _step, _throw, currentIndex, item, nodes;
    _state = 0;
    function _close() {
      _state = 7;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          nodes = [];
          currentIndex = index;
          ++_state;
        case 1: ++_state;
        case 2:
          parser.clearCache();
          _state = !parser.options.sync ? 3 : 4;
          break;
        case 3:
          ++_state;
          return { done: false, value: __defer.fulfilled(void 0) };
        case 4:
          item = EmbeddedLiteralTextInnerPartWithBlock(parser, currentIndex);
          _state = !item ? 6 : 5;
          break;
        case 5:
          nodes.push(item.value);
          if (currentIndex === item.index) {
            throw new Error("Infinite loop detected");
          }
          currentIndex = item.index;
          _state = 1;
          break;
        case 6:
          parser.clearCache();
          ++_state;
          return {
            done: true,
            value: Box(currentIndex, LInternalCall("block", index, parser.scope.peek(), nodes.concat([
              LInternalCall("return", index, parser.scope.peek(), LSymbol.ident(index, parser.scope.peek(), "write"))
            ])))
          };
        case 7:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      _close();
      throw _e;
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _throw(_e);
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
  EndNoIndent = sequential(EmptyLines, Space, maybe(Semicolons), word("end"));
  BodyWithIndent = retainIndent(sequential(
    Space,
    Newline,
    EmptyLines,
    Advance,
    ["this", Block],
    PopIndent
  ));
  BodyNoIndentNoEnd = sequential(
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
  );
  BodyNoIndent = sequential(
    ["this", BodyNoIndentNoEnd],
    EndNoIndent
  );
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
  Imports = maybe(
    separatedList(
      (_ref = sequential(word("import"), Space, ["this", SingleStringLiteral]), mutate(function (x, parser, index) {
        if (!x.isConst() || typeof x.constValue() !== "string") {
          throw ParserError("Expected a string literal in import statement", parser, index);
        }
        return x.constValue();
      })(_ref)),
      SomeEmptyLines
    ),
    function () {
      return [];
    }
  );
  RootP = __promise(function (parser) {
    var _arr, _e, _i, _len, _send, _state, _step, _throw, bom, empty,
        emptyAgain, endSpace, importFile, imports, root, shebang;
    _state = 0;
    function _close() {
      _state = 14;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          bom = BOM(parser, 0);
          shebang = Shebang(parser, bom.index);
          empty = EmptyLines(parser, shebang.index);
          imports = Imports(parser, empty.index);
          if (imports.value.length && !parser.options.filename) {
            throw ParserError(
              "Cannot use the import statement if not compiling from a file",
              parser,
              empty.index
            );
          }
          empty = EmptyLines(parser, imports.index);
          _state = Eof(parser, empty.index) ? 1 : 2;
          break;
        case 1:
          _state = 14;
          return {
            done: true,
            value: Box(empty.index, LInternalCall(
              "root",
              empty.index,
              parser.scope.peek(),
              LValue(empty.index, parser.options.filename || null),
              LSymbol.nothing(empty.index),
              LValue(empty.index, false),
              LValue(empty.index, false)
            ))
          };
        case 2:
          _arr = __toArray(imports.value);
          _i = 0;
          _len = _arr.length;
          ++_state;
        case 3:
          _state = _i < _len ? 4 : 8;
          break;
        case 4:
          importFile = _arr[_i];
          parser.clearCache();
          _state = parser.options.sync ? 5 : 6;
          break;
        case 5:
          parser.importSync(importFile, imports.index);
          _state = 7;
          break;
        case 6:
          ++_state;
          return {
            done: false,
            value: parser["import"](importFile, imports.index)
          };
        case 7:
          ++_i;
          _state = 3;
          break;
        case 8:
          parser.clearCache();
          _state = parser.options.sync ? 9 : 10;
          break;
        case 9:
          root = RootInnerP.sync(parser, empty.index);
          _state = 12;
          break;
        case 10:
          ++_state;
          return {
            done: false,
            value: RootInnerP(parser, empty.index)
          };
        case 11:
          root = _received;
          ++_state;
        case 12:
          parser.clearCache();
          _state = !root ? 14 : 13;
          break;
        case 13:
          emptyAgain = EmptyLines(parser, root.index);
          endSpace = Space(parser, emptyAgain.index);
          parser.clearCache();
          ++_state;
          return {
            done: true,
            value: Box(endSpace.index, LInternalCall(
              "root",
              empty.index,
              parser.scope.peek(),
              LValue(empty.index, parser.options.filename || null),
              root.value,
              LValue(empty.index, false),
              LValue(empty.index, false)
            ))
          };
        case 14:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      _close();
      throw _e;
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _throw(_e);
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
  EmbeddedRootP = __promise(function (parser) {
    var _e, _send, _state, _step, _throw, bom, root, shebang;
    _state = 0;
    function _close() {
      _state = 6;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          bom = BOM(parser, 0);
          shebang = Shebang(parser, bom.index);
          parser.clearCache();
          _state = parser.options.sync ? 1 : 2;
          break;
        case 1:
          root = EmbeddedRootInnerP.sync(parser, shebang.index);
          _state = 4;
          break;
        case 2:
          ++_state;
          return {
            done: false,
            value: EmbeddedRootInnerP(parser, shebang.index)
          };
        case 3:
          root = _received;
          ++_state;
        case 4:
          parser.clearCache();
          _state = !root ? 6 : 5;
          break;
        case 5:
          ++_state;
          return {
            done: true,
            value: Box(root.index, LInternalCall(
              "root",
              shebang.index,
              parser.scope.peek(),
              LValue(shebang.index, parser.options.filename || null),
              root.value,
              LValue(shebang.index, true),
              LValue(shebang.index, parser.inGenerator.peek())
            ))
          };
        case 6:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      _close();
      throw _e;
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _throw(_e);
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
  EmbeddedRootGeneratorP = __promise(function (parser) {
    var _e, _send, _state, _step, _throw, result;
    _state = 0;
    function _close() {
      _state = 5;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          parser.inGenerator.push(true);
          _state = parser.options.sync ? 1 : 2;
          break;
        case 1:
          result = EmbeddedRootP.sync(parser);
          _state = 4;
          break;
        case 2:
          ++_state;
          return { done: false, value: EmbeddedRootP(parser) };
        case 3:
          result = _received;
          ++_state;
        case 4:
          parser.inGenerator.pop();
          ++_state;
          return { done: true, value: result };
        case 5:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      _close();
      throw _e;
    }
    function _send(_received) {
      try {
        return _step(_received);
      } catch (_e) {
        _throw(_e);
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
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
  Stack = (function () {
    var _Stack_prototype;
    function Stack(initial) {
      var _this;
      _this = this instanceof Stack ? this : __create(_Stack_prototype);
      _this.initial = initial;
      _this.data = [];
      return _this;
    }
    _Stack_prototype = Stack.prototype;
    Stack.displayName = "Stack";
    _Stack_prototype.count = function () {
      return this.data.length;
    };
    _Stack_prototype.push = function (value) {
      this.data.push(value);
    };
    _Stack_prototype.pop = function () {
      var data;
      data = this.data;
      if (data.length === 0) {
        throw new Error("Cannot pop");
      }
      return data.pop();
    };
    _Stack_prototype.canPop = function () {
      return this.data.length > 0;
    };
    _Stack_prototype.peek = function () {
      var data, len;
      data = this.data;
      len = data.length;
      if (len === 0) {
        return this.initial;
      } else {
        return data[len - 1];
      }
    };
    return Stack;
  }());
  function makeMacroHolder() {
    return MacroHolder(
      {
        Logic: preventUnclosedObjectLiteral(Logic),
        Expression: Expression,
        Assignment: Assignment,
        ExpressionOrAssignment: ExpressionOrAssignment,
        ExpressionOrAssignmentOrBody: ExpressionOrAssignmentOrBody,
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
    var _Parser_prototype, ASSIGN_OPERATOR, BINARY_OPERATOR, DEFINE_SYNTAX,
        deserializeParam, deserializeParamType, macroDeserializers,
        macroSyntaxConstLiterals, macroSyntaxTypes, UNARY_OPERATOR;
    function Parser(source, macros, options) {
      var _this;
      _this = this instanceof Parser ? this : __create(_Parser_prototype);
      if (source == null) {
        source = "";
      }
      _this.source = source;
      if (macros == null) {
        macros = makeMacroHolder();
      }
      _this.macros = macros;
      if (options == null) {
        options = {};
      }
      _this.options = options;
      _this.indent = Stack(0);
      _this.position = Stack("statement");
      _this.inAst = Stack(false);
      _this.inGenerator = Stack(false);
      _this.inFunctionTypeParams = Stack(false);
      _this.preventUnclosedObjectLiteral = Stack(false);
      _this.allowEmbeddedText = Stack(true);
      _this.inMacro = Stack(false);
      _this.inAst = Stack(false);
      _this.inEvilAst = Stack(false);
      _this.asterixAsArrayLength = Stack(false);
      _this.disallowSpaceBeforeAccess = Stack(0);
      _this.insideIndentedAccess = Stack(false);
      _this.inCascade = Stack(false);
      _this.requireParameterSequence = Stack(false);
      _this.scope = Stack(Scope(null, true));
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
      if (typeof node === "number") {
        index = node;
      } else {
        index = node.index;
      }
      return MacroError(message, this, index);
    };
    _Parser_prototype.makeTmp = function (index, name) {
      return LSymbol.tmp(index, this.scope.peek(), ++this.currentTmpId, name);
    };
    function makeGetPosition(lineInfo) {
      return function (index) {
        var current, i, left, right;
        if (index === 0) {
          return { line: 0, column: 0 };
        }
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
        return { line: left + 1, column: index - lineInfo[left] + 1 };
      };
    }
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
        index = +match.index + +match[0].length;
        lineInfo.push(index);
      }
      this.getPosition = makeGetPosition(lineInfo);
    };
    _Parser_prototype.indexFromPosition = function (line, column) {
      var lineInfo;
      lineInfo = this.lineInfo[line - 1];
      if (lineInfo != null) {
        return +lineInfo + column - 1;
      } else {
        return 0;
      }
    };
    _Parser_prototype.getPosition = function (index) {
      throw new Error("line-info not initialized");
    };
    _Parser_prototype.getLine = function (index) {
      if (index == null) {
        index = this.index;
      }
      return this.getPosition(index).line;
    };
    _Parser_prototype.getColumn = function (index) {
      if (index == null) {
        index = this.index;
      }
      return this.getPosition(index).column;
    };
    _Parser_prototype.fail = function (message, index) {
      if (index > this.failureIndex) {
        this.failureMessages = [];
        this.failureIndex = index;
      }
      if (index >= this.failureIndex) {
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
      case 2: return errors[0] + " or " + errors[1];
      default:
        return __slice.call(errors, 0, -1).join(", ") + ", or " + errors[errors.length - 1];
      }
    }
    _Parser_prototype.getFailure = function (index) {
      var lastToken, source;
      if (index == null) {
        index = this.failureIndex;
      }
      source = this.source;
      if (index < source.length) {
        lastToken = JSON.stringify(source.substring(index, index + 20));
      } else {
        lastToken = "end-of-input";
      }
      return ParserError("Expected " + buildExpected(this.failureMessages) + ", but " + lastToken + " found", this, index);
    };
    _Parser_prototype["import"] = __promise(function (filename, index) {
      var _e, _send, _state, _step, _this, _throw, fs, fullFilename,
          parseOptions, path, result, source;
      _this = this;
      _state = 0;
      function _close() {
        _state = 9;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            fs = require("fs");
            path = require("path");
            if (typeof _this.options.filename !== "string") {
              throw ParserError(
                "Cannot import if the filename option is not provided",
                _this,
                index
              );
            }
            fullFilename = path.resolve(path.dirname(_this.options.filename), filename);
            _state = _this.options.sync ? 1 : 2;
            break;
          case 1:
            source = fs.readFileSync(fullFilename, "utf8");
            _state = 4;
            break;
          case 2:
            ++_state;
            return {
              done: false,
              value: __toPromise(fs.readFile, fs, [fullFilename, "utf8"])
            };
          case 3:
            source = _received;
            ++_state;
          case 4:
            parseOptions = { filename: fullFilename, noindent: _this.options.noindent, sync: _this.options.sync };
            _state = _this.options.sync ? 5 : 6;
            break;
          case 5:
            result = parse.sync(source, _this.macros, parseOptions);
            _state = 8;
            break;
          case 6:
            ++_state;
            return {
              done: false,
              value: parse(source, _this.macros, parseOptions)
            };
          case 7:
            result = _received;
            ++_state;
          case 8:
            _this.macros = result.macros;
            ++_state;
          case 9:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        _close();
        throw _e;
      }
      function _send(_received) {
        try {
          return _step(_received);
        } catch (_e) {
          _throw(_e);
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
        "throw": function (_e) {
          _throw(_e);
          return _send(void 0);
        }
      };
    });
    _Parser_prototype.importSync = function (filename, index) {
      if (!this.options.sync) {
        throw new Error("Expected options.sync to be true");
      }
      return this["import"].sync.call(this, filename, index);
    };
    _Parser_prototype.pushScope = function (isTop, parent) {
      var scope;
      if (isTop == null) {
        isTop = false;
      }
      if (parent == null) {
        parent = null;
      }
      scope = (parent || this.scope.peek()).clone(isTop);
      this.scope.push(scope);
      return scope;
    };
    _Parser_prototype.popScope = function () {
      this.scope.pop();
    };
    _Parser_prototype.getPackageVersion = function () {
      var _ref;
      if ((_ref = this._packageVersion) == null) {
        return this._packageVersion = getPackageVersion(this.options.filename);
      } else {
        return _ref;
      }
    };
    _Parser_prototype.hasMacroOrOperator = function (name) {
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
      return this.macros.getByName(name);
    };
    _Parser_prototype.getMacroByLabel = function (label) {
      return this.macros.getByLabel(label);
    };
    _Parser_prototype.enterMacro = function (index, names) {
      if (!names) {
        throw new Error("Must provide a macro name");
      }
      if (this.currentMacro) {
        throw ParserError("Attempting to define a macro " + quote(String(names)) + " inside a macro " + quote(String(this.currentMacro)), this, index);
      }
      this.currentMacro = names;
    };
    _Parser_prototype.exitMacro = function () {
      if (!this.currentMacro) {
        throw new Error("Attempting to exit a macro when not in one");
      }
      this.currentMacro = null;
    };
    _Parser_prototype.defineHelper = function (i, name, value) {
      var _ref, dependencies, helper, node, translator, type;
      translator = require("./jstranslator");
      node = this.macroExpandAll(value).reduce(this);
      type = node.type(this);
      _ref = translator.defineHelper(
        this.macros,
        this.getPosition,
        name,
        node,
        type
      );
      helper = _ref.helper;
      dependencies = _ref.dependencies;
      _ref = null;
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
      if (obj instanceof ParserNode) {
        return obj.reduce(o);
      } else if (__isArray(obj)) {
        _arr = [];
        for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          _arr.push(reduceObject(o, item));
        }
        return _arr;
      } else if (typeof obj === "object" && obj !== null && obj.constructor === Object) {
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
    function makeMacroRoot(index, macroFullDataParam, body) {
      var _this, scope;
      _this = this;
      scope = this.scope.peek();
      return LInternalCall(
        "root",
        index,
        scope,
        LValue(index, null),
        LInternalCall("return", index, scope, LInternalCall(
          "function",
          index,
          scope,
          LInternalCall("array", index, scope, [macroFullDataParam].concat((function () {
            var _arr, _arr2, _i, _len, name;
            _arr = [];
            for (_arr2 = [
              "__wrap",
              "__const",
              "__value",
              "__symbol",
              "__call",
              "__macro"
            ], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              name = _arr2[_i];
              _arr.push(LInternalCall(
                "param",
                index,
                scope,
                LSymbol.ident(index, scope, name),
                LSymbol.nothing(index),
                LValue(index, false),
                LValue(index, true),
                LSymbol.nothing(index)
              ));
            }
            return _arr;
          }()))),
          LInternalCall("autoReturn", body.index, body.scope, body),
          LValue(index, false),
          LSymbol.nothing(index),
          LValue(index, false)
        )),
        LValue(index, false),
        LValue(index, false)
      );
    }
    function serializeParamType(asType) {
      if (asType.isSymbol && asType.isIdent) {
        return ["ident", asType.name];
      } else if (asType.isConst()) {
        return ["const", asType.constValue()];
      } else if (asType.isInternalCall()) {
        switch (asType.func.name) {
        case "syntaxSequence": return ["sequence"].concat(__toArray(fixArray(serializeParams(asType.args))));
        case "syntaxChoice":
          return ["choice"].concat((function () {
            var _arr, _arr2, _i, _len, choice;
            _arr = [];
            for (_arr2 = __toArray(asType.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              choice = _arr2[_i];
              _arr.push(serializeParamType(choice));
            }
            return _arr;
          }()));
        case "syntaxMany":
          return ["many", asType.args[1].constValue()].concat(serializeParamType(asType.args[0]));
        default: throw new Error("Unhandled value in switch");
        }
      } else {
        throw new Error("Unhandled value in switch");
      }
    }
    function serializeParam(param) {
      var _ref, asType, ident, inner, negate, value;
      if (param.isConst()) {
        return ["const", param.constValue()];
      } else if (param.isInternalCall("syntaxParam")) {
        _ref = param.args;
        ident = _ref[0];
        asType = _ref[1];
        _ref = null;
        if (ident.name === "this") {
          value = ["this"];
        } else {
          value = ["ident", ident.name];
        }
        if (!isNothing(asType)) {
          value.push.apply(value, serializeParamType(asType));
        }
        return value;
      } else if (param.isInternalCall("syntaxLookahead")) {
        _ref = param.args;
        negate = _ref[0];
        inner = _ref[1];
        _ref = null;
        return [
          "lookahead",
          negate.constValue() ? 1 : 0
        ].concat(serializeParamType(inner));
      } else {
        throw new Error("Unhandled value in switch");
      }
    }
    function serializeParams(params) {
      return simplifyArray((function () {
        var _arr, _i, _len, param;
        _arr = [];
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          param = params[_i];
          _arr.push(serializeParam(param));
        }
        return _arr;
      }()));
    }
    deserializeParamType = (function () {
      var deserializeParamTypeByType;
      deserializeParamTypeByType = {
        ident: function (scope, name) {
          return LSymbol.ident(0, scope, name);
        },
        sequence: function (scope) {
          var items;
          items = __slice.call(arguments, 1);
          return LInternalCall("syntaxSequence", 0, scope, deserializeParams(items, scope));
        },
        choice: function (scope) {
          var choices;
          choices = __slice.call(arguments, 1);
          return LInternalCall("syntaxChoice", 0, scope, (function () {
            var _arr, _i, _len, choice;
            _arr = [];
            for (_i = 0, _len = choices.length; _i < _len; ++_i) {
              choice = choices[_i];
              _arr.push(deserializeParamType(choice, scope));
            }
            return _arr;
          }()));
        },
        "const": function (scope, value) {
          return LValue(0, value);
        },
        many: function (scope, multiplier) {
          var inner;
          inner = __slice.call(arguments, 2);
          return LInternalCall(
            "syntaxMany",
            0,
            scope,
            deserializeParamType(inner, scope),
            LValue(0, multiplier)
          );
        }
      };
      return function (asType, scope) {
        var type;
        if (asType == null) {
          asType = [];
        }
        if (asType.length === 0) {
          return LSymbol.nothing(0);
        } else {
          type = asType[0];
          if (__owns.call(deserializeParamTypeByType, type)) {
            return deserializeParamTypeByType[type].apply(deserializeParamTypeByType, [scope].concat(__toArray(__slice.call(asType, 1))));
          } else {
            throw new Error("Unknown as-type: " + String(type));
          }
        }
      };
    }());
    deserializeParam = (function () {
      var deserializeParamByType;
      deserializeParamByType = {
        "const": function (scope, value) {
          return LValue(0, value);
        },
        ident: function (scope, name) {
          var asType;
          asType = __slice.call(arguments, 2);
          return LInternalCall(
            "syntaxParam",
            0,
            scope,
            LSymbol.ident(0, scope, name),
            deserializeParamType(asType, scope)
          );
        },
        "this": function (scope) {
          var asType;
          asType = __slice.call(arguments, 1);
          return LInternalCall(
            "syntaxParam",
            0,
            scope,
            LSymbol.ident(0, scope, "this"),
            deserializeParamType(asType, scope)
          );
        },
        lookahead: function (scope, negate) {
          var asType;
          asType = __slice.call(arguments, 2);
          return LInternalCall(
            "syntaxLookahead",
            0,
            scope,
            LValue(0, !!negate),
            deserializeParamType(asType, scope)
          );
        }
      };
      return function (param, scope) {
        var type;
        type = param[0];
        if (__owns.call(deserializeParamByType, type)) {
          return deserializeParamByType[type].apply(deserializeParamByType, [scope].concat(__toArray(__slice.call(param, 1))));
        } else {
          throw new Error("Unknown param type: " + String(type));
        }
      };
    }());
    function deserializeParams(params, scope) {
      var _arr, _arr2, _i, _len, param;
      _arr = [];
      for (_arr2 = __toArray(fixArray(params)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        _arr.push(deserializeParam(param));
      }
      return _arr;
    }
    function calcParam(param) {
      var _ref, _this, calced, inner, macros, multiplier, name, string;
      _this = this;
      if (param.isSymbol && param.isIdent) {
        name = param.name;
        macros = this.macros;
        if (macros.hasSyntax(name)) {
          return macros.getSyntax(name);
        } else {
          return function (parser, index) {
            return parser.macros.getSyntax(name).call(this, parser, index);
          };
        }
      } else if (param.isConstType("string")) {
        string = param.constValue();
        return __owns.call(macroSyntaxConstLiterals, string) && macroSyntaxConstLiterals[string] || wordOrSymbol(string);
      } else if (param.isInternalCall()) {
        switch (param.func.name) {
        case "syntaxSequence":
          return handleParams.call(this, param.args);
        case "syntaxChoice":
          return oneOf.apply(void 0, (function () {
            var _arr, _arr2, _i, _len, choice;
            _arr = [];
            for (_arr2 = __toArray(param.args), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              choice = _arr2[_i];
              _arr.push(calcParam.call(_this, choice));
            }
            return _arr;
          }()));
        case "syntaxMany":
          _ref = param.args;
          inner = _ref[0];
          multiplier = _ref[1];
          _ref = null;
          calced = calcParam.call(this, inner);
          switch (multiplier.constValue()) {
          case "*": return zeroOrMore(calced);
          case "+": return oneOrMore(calced);
          case "?":
            return oneOf(calced, Nothing);
          default: throw new Error("Unhandled value in switch");
          }
          break;
        default: throw new Error("Unhandled value in switch");
        }
      } else {
        throw new Error("Unhandled value in switch");
      }
    }
    function handleParam(param) {
      var _ref, asType, calced, ident, negate, string;
      if (param.isConstType("string")) {
        string = param.constValue();
        return __owns.call(macroSyntaxConstLiterals, string) && macroSyntaxConstLiterals[string] || wordOrSymbol(string);
      } else if (param.isInternalCall("syntaxParam")) {
        _ref = param.args;
        ident = _ref[0];
        asType = _ref[1];
        _ref = null;
        return [
          ident.name,
          calcParam.call(this, !isNothing(asType) ? asType : LSymbol.ident(0, param.scope, "Expression"))
        ];
      } else if (param.isInternalCall("syntaxLookahead")) {
        _ref = param.args;
        negate = _ref[0];
        asType = _ref[1];
        _ref = null;
        calced = calcParam.call(this, asType);
        if (negate.constValue()) {
          return except(calced);
        } else {
          return check(calced);
        }
      } else {
        throw new Error("Unhandled value in switch");
      }
    }
    function handleParams(params) {
      var _this;
      _this = this;
      return sequential.apply(void 0, (function () {
        var _arr, _i, _len, param;
        _arr = [];
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          param = params[_i];
          _arr.push(handleParam.call(_this, param));
        }
        return _arr;
      }()));
    }
    function simplifyArray(operators) {
      if (operators.length !== 0) {
        if (operators.length === 1 && !__isArray(operators[0])) {
          return operators[0];
        } else {
          return operators;
        }
      }
    }
    function simplifyObject(options) {
      var k, v;
      for (k in options) {
        if (__owns.call(options, k)) {
          v = options[k];
          return options;
        }
      }
    }
    function getCompilationOptions(stateOptions) {
      return { bare: true };
    }
    macroSyntaxTypes = {
      syntax: function (index, params, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent,
            macroFullDataIdent, macroNameIdent, rawFunc, scope, serialization,
            translated;
        _this = this;
        scope = this.scope.peek();
        macroFullDataIdent = LSymbol.ident(index, scope, "macroFullData");
        funcParam = LInternalCall(
          "param",
          index,
          scope,
          macroFullDataIdent,
          LSymbol.nothing(index),
          LValue(index, false),
          LValue(index, false),
          LSymbol.nothing(index)
        );
        macroNameIdent = LSymbol.ident(index, scope, "macroName");
        scope.add(macroNameIdent, false, Type.string);
        macroDataIdent = LSymbol.ident(index, scope, "macroData");
        scope.add(macroDataIdent, false, Type.object);
        body = LInternalCall("block", index, scope, [
          LInternalCall("var", index, scope, macroNameIdent),
          LCall(
            index,
            scope,
            LSymbol.assign["="](index),
            macroNameIdent,
            LInternalCall(
              "access",
              index,
              scope,
              macroFullDataIdent,
              LValue(index, "macroName")
            )
          ),
          LInternalCall("var", index, scope, macroDataIdent),
          LCall(
            index,
            scope,
            LSymbol.assign["="](index),
            macroDataIdent,
            LInternalCall(
              "access",
              index,
              scope,
              macroFullDataIdent,
              LValue(index, "macroData")
            )
          )
        ].concat(
          (function () {
            var _arr, _arr2, _i, _len, param;
            _arr = [];
            for (_arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              param = _arr2[_i];
              if (param.isInternalCall("syntaxParam")) {
                scope.add(param.args[0], true, Type.any);
                _arr.push(LInternalCall(
                  "block",
                  index,
                  scope,
                  LInternalCall(
                    "var",
                    index,
                    scope,
                    param.args[0],
                    LValue(index, true)
                  ),
                  LCall(
                    index,
                    scope,
                    LSymbol.assign["="](index),
                    param.args[0],
                    LInternalCall(
                      "access",
                      index,
                      scope,
                      macroDataIdent,
                      LValue(index, param.args[0].name)
                    )
                  )
                ));
              }
            }
            return _arr;
          }()),
          [body]
        ));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, this.getPosition, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw new Error("Error creating function for macro: " + String(this.currentMacro));
        }
        return {
          handler: function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return handler.apply(this, [reduceObject(this.parser, args)].concat(rest)).reduce(this.parser);
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
        var _this, handler, serialization;
        _this = this;
        if (body != null) {
          handler = (function () {
            var compilation, funcParam, handler, macroDataIdent, rawFunc, scope,
                translated;
            scope = _this.scope.peek();
            macroDataIdent = LSymbol.ident(index, scope, "macroData");
            funcParam = LInternalCall(
              "param",
              index,
              scope,
              macroDataIdent,
              LSymbol.nothing(index),
              LValue(index, false),
              LValue(index, false),
              LSymbol.nothing(index)
            );
            body = LInternalCall("block", index, scope, (function () {
              var _arr, _arr2, _i, _len, param;
              _arr = [];
              for (_arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                param = _arr2[_i];
                if (param.isInternalCall("syntaxParam")) {
                  scope.add(param.args[0], true, Type.any);
                  _arr.push(LInternalCall(
                    "block",
                    index,
                    scope,
                    LInternalCall(
                      "var",
                      index,
                      scope,
                      param.args[0],
                      ParserNode.Value(index, true)
                    ),
                    LCall(
                      index,
                      scope,
                      LSymbol.assign["="](index),
                      param.args[0],
                      LInternalCall(
                        "access",
                        index,
                        scope,
                        macroDataIdent,
                        LValue(index, param.args[0].name)
                      )
                    )
                  ));
                }
              }
              return _arr;
            }()).concat([body]));
            rawFunc = makeMacroRoot.call(_this, index, funcParam, body);
            translated = translator(_this.macroExpandAll(rawFunc).reduce(_this), _this.macros, _this.getPosition, { "return": true });
            compilation = translated.node.toString(getCompilationOptions(stateOptions));
            if (stateOptions.serializeMacros) {
              serialization = compilation;
            }
            handler = Function(compilation)();
            if (typeof handler !== "function") {
              throw new Error("Error creating function for syntax: " + options.name);
            }
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return reduceObject(this.parser, handler.apply(this, [reduceObject(this.parser, args)].concat(rest)));
            };
          }());
        } else {
          handler = function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return reduceObject(this.parser, args);
          };
        }
        return {
          handler: handler,
          rule: handleParams.call(this, params),
          serialization: stateOptions.serializeMacros ? { type: "defineSyntax", code: serialization, options: simplifyObject(options), params: serializeParams(params) } : void 0
        };
      },
      call: function (index, params, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent,
            macroFullDataIdent, macroNameIdent, rawFunc, scope, serialization,
            translated;
        _this = this;
        scope = this.scope.peek();
        macroFullDataIdent = LSymbol.ident(index, scope, "macroFullData");
        funcParam = LInternalCall(
          "param",
          index,
          scope,
          macroFullDataIdent,
          LSymbol.nothing(index),
          LValue(index, false),
          LValue(index, false),
          LSymbol.nothing(index)
        );
        macroNameIdent = LSymbol.ident(index, scope, "macroName");
        scope.add(macroNameIdent, false, Type.string);
        macroDataIdent = LSymbol.ident(index, scope, "macroData");
        scope.add(macroDataIdent, false, Type.object);
        body = LInternalCall("block", index, scope, [
          LInternalCall("var", index, scope, macroNameIdent),
          LCall(
            index,
            scope,
            LSymbol.assign["="](index),
            macroNameIdent,
            LInternalCall(
              "access",
              index,
              scope,
              macroFullDataIdent,
              LValue(index, "macroName")
            )
          ),
          LInternalCall("var", index, scope, macroDataIdent),
          LCall(
            index,
            scope,
            LSymbol.assign["="](index),
            macroDataIdent,
            LInternalCall(
              "access",
              index,
              scope,
              macroFullDataIdent,
              LValue(index, "macroData")
            )
          )
        ].concat(
          (function () {
            var _arr, _arr2, _len, i, ident, param;
            _arr = [];
            for (_arr2 = __toArray(params), i = 0, _len = _arr2.length; i < _len; ++i) {
              param = _arr2[i];
              if (param.isInternalCall("param")) {
                ident = param.args[0];
                scope.add(ident, true, Type.any);
                _arr.push(LInternalCall(
                  "block",
                  index,
                  scope,
                  LInternalCall(
                    "var",
                    index,
                    scope,
                    ident,
                    ParserNode.Value(index, true)
                  ),
                  LCall(
                    index,
                    scope,
                    LSymbol.assign["="](index),
                    ident,
                    LInternalCall(
                      "access",
                      index,
                      scope,
                      macroDataIdent,
                      LValue(index, i)
                    )
                  )
                ));
              }
            }
            return _arr;
          }()),
          [body]
        ));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, this.getPosition, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw new Error("Error creating function for macro: " + this.currentMacro);
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
          };
        }(handler));
        return {
          handler: handler,
          rule: InvocationArguments,
          serialization: serialization != null ? { type: "call", code: serialization, options: simplifyObject(options), names: simplifyArray(this.currentMacro) } : void 0
        };
      },
      binaryOperator: function (index, operators, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc,
            scope, serialization, translated;
        _this = this;
        macroDataIdent = LSymbol.ident(index, scope, "macroData");
        funcParam = LInternalCall(
          "param",
          index,
          scope,
          macroDataIdent,
          LSymbol.nothing(index),
          LValue(index, false),
          LValue(index, false),
          LSymbol.nothing(index)
        );
        scope = this.scope.peek();
        body = LInternalCall("block", index, scope, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          _arr = [];
          for (_arr2 = ["left", "op", "right"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = LSymbol.ident(index, scope, name);
            scope.add(ident, true, Type.any);
            _arr.push(LInternalCall(
              "block",
              index,
              scope,
              LInternalCall(
                "var",
                index,
                scope,
                ident,
                ParserNode.Value(index, true)
              ),
              LCall(
                index,
                scope,
                LSymbol.assign["="](index),
                ident,
                LInternalCall(
                  "access",
                  index,
                  scope,
                  macroDataIdent,
                  LValue(index, name)
                )
              )
            ));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, this.getPosition, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw new Error("Error creating function for binary operator " + operators.join(", "));
        }
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice.call(arguments, 1);
              result = inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return LCall(result.index, result.scope, LSymbol.unary["!"](result.index), result).reduce(this.parser);
              } else {
                return result.reduce(this.parser);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc,
            scope, serialization, translated;
        _this = this;
        scope = this.scope.peek();
        macroDataIdent = LSymbol.ident(index, scope, "macroData");
        funcParam = LInternalCall(
          "param",
          index,
          scope,
          macroDataIdent,
          LSymbol.nothing(index),
          LValue(index, false),
          LValue(index, false),
          LSymbol.nothing(index)
        );
        body = LInternalCall("block", index, scope, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          _arr = [];
          for (_arr2 = ["left", "op", "right"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = LSymbol.ident(index, scope, name);
            scope.add(ident, true, Type.any);
            _arr.push(LInternalCall(
              "block",
              index,
              scope,
              LInternalCall(
                "var",
                index,
                scope,
                ident,
                ParserNode.Value(index, true)
              ),
              LCall(
                index,
                scope,
                LSymbol.assign["="](index),
                ident,
                LInternalCall(
                  "access",
                  index,
                  scope,
                  macroDataIdent,
                  LValue(index, name)
                )
              )
            ));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, this.getPosition, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw new Error("Error creating function for assign operator " + operators.join(", "));
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
          };
        }(handler));
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "assignOperator", code: serialization, operators: simplifyArray(operators), options: simplifyObject(options) } : void 0
        };
      },
      unaryOperator: function (index, operators, body, options, stateOptions, translator) {
        var _this, compilation, funcParam, handler, macroDataIdent, rawFunc,
            scope, serialization, translated;
        _this = this;
        scope = this.scope.peek();
        macroDataIdent = LSymbol.ident(index, scope, "macroData");
        funcParam = LInternalCall(
          "param",
          index,
          scope,
          macroDataIdent,
          LSymbol.nothing(index),
          LValue(index, false),
          LValue(index, false),
          LSymbol.nothing(index)
        );
        body = LInternalCall("block", index, scope, (function () {
          var _arr, _arr2, _i, _len, ident, name;
          _arr = [];
          for (_arr2 = ["op", "node"], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            name = _arr2[_i];
            ident = LSymbol.ident(index, scope, name);
            scope.add(ident, true, Type.any);
            _arr.push(LInternalCall(
              "block",
              index,
              scope,
              LInternalCall(
                "var",
                index,
                scope,
                ident,
                ParserNode.Value(index, true)
              ),
              LCall(
                index,
                scope,
                LSymbol.assign["="](index),
                ident,
                LInternalCall(
                  "access",
                  index,
                  scope,
                  macroDataIdent,
                  LValue(index, name)
                )
              )
            ));
          }
          return _arr;
        }()).concat([body]));
        rawFunc = makeMacroRoot.call(this, index, funcParam, body);
        translated = translator(this.macroExpandAll(rawFunc).reduce(this), this.macros, this.getPosition, { "return": true });
        compilation = translated.node.toString(getCompilationOptions(stateOptions));
        if (stateOptions.serializeMacros) {
          serialization = compilation;
        }
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw new Error("Error creating function for unary operator " + operators.join(", "));
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, code, handler, id, names, options, params;
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
        handler = code;
        if (typeof handler !== "function") {
          throw new Error("Error deserializing function for macro " + name);
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, code, handler, id, names, options;
        _this = this;
        code = _p.code;
        names = _p.names;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        names = fixArray(names);
        handler = code;
        if (typeof handler !== "function") {
          throw new Error("Error deserializing function for macro " + name);
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, code, handler, id, options, params;
        _this = this;
        code = _p.code;
        params = _p.params;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        if (this.macros.hasSyntax(options.name)) {
          throw new Error("Cannot override already-defined syntax: " + options.name);
        }
        if (code != null) {
          handler = code;
          if (typeof handler !== "function") {
            throw new Error("Error deserializing function for macro syntax " + options.name);
          }
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return reduceObject(this.parser, inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))));
            };
          }(handler));
        } else {
          handler = function (args) {
            return reduceObject(this.parser, args);
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
        var _this, code, handler, id, operators, options;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = code;
        if (typeof handler !== "function") {
          throw new Error("Error deserializing function for binary operator " + operators.join(", "));
        }
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice.call(arguments, 1);
              result = inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return LCall(result.index, result.scope, LSymbol.unary["!"](result.index), result).reduce(this.parser);
              } else {
                return result.reduce(this.parser);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice.call(arguments, 1);
              return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, code, handler, id, operators, options;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = code;
        if (typeof handler !== "function") {
          throw new Error("Error deserializing function for assign operator " + operators.join(", "));
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        var _this, code, handler, id, operators, options;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        if (options == null) {
          options = {};
        }
        id = _p.id;
        operators = fixArray(operators);
        handler = code;
        if (typeof handler !== "function") {
          throw new Error("Error deserializing function for unary operator " + operators.join(", "));
        }
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice.call(arguments, 1);
            return inner.apply(this, [reduceObject(this.parser, args)].concat(__toArray(rest))).reduce(this.parser);
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
        _arr = [];
        for (_arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          item = _arr2[_i];
          if (isNothing(item)) {
            _arr.push(void 0);
          } else {
            _arr.push(removeNoops(item));
          }
        }
        return _arr;
      } else if (typeof obj === "object" && obj !== null && obj.constructor === Object) {
        result = {};
        for (k in obj) {
          if (__owns.call(obj, k)) {
            v = obj[k];
            if (!isNothing(v)) {
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
      if (options == null) {
        options = {};
      }
      if (!this.currentMacro) {
        throw new Error("Attempting to specify a macro syntax when not in a macro");
      }
      rule = handleParams.call(this, params);
      macros = this.macros;
      function mutator(data, parser, index) {
        if (parser.inAst.peek() || !parser.expandingMacros) {
          return ParserNode.MacroAccess(
            index,
            parser.scope.peek(),
            macroId,
            removeNoops(data),
            parser.position.peek() === "statement",
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
        } else {
          throw new Error("Cannot use macro until fully defined");
        }
      }
      for (_arr = __toArray(macros.getOrAddByNames(this.currentMacro)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        m = _arr[_i];
        m.data.push((_ref = sequential(
          ["macroName", m.token],
          ["macroData", rule]
        ), mutate(mutator)(_ref)));
      }
      this.pendingMacroId = macroId = macros.addMacro(mutator, void 0, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
      return params;
    };
    function handleMacroSyntax(index, type, handler, rule, params, options, macroId) {
      var _arr, _i, _len, _ref, id, m, macros;
      function mutator(data, parser, index) {
        var left, macroContext, pos, result, scope, tmps;
        if (parser.inAst.peek() || !parser.expandingMacros) {
          return ParserNode.MacroAccess(
            index,
            parser.scope.peek(),
            macroId,
            removeNoops(data),
            parser.position.peek() === "statement",
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
        } else {
          scope = parser.pushScope(false);
          macroContext = MacroContext(
            parser,
            index,
            parser.position.peek(),
            parser.inGenerator.peek(),
            parser.inEvilAst.peek()
          );
          if (type === "assignOperator") {
            left = macroContext.macroExpand1(data.left);
            if (left.isIdent && !parser.inEvilAst.peek()) {
              if (!macroContext.hasVariable(left)) {
                macroContext.error("Trying to assign with " + data.op + " to unknown variable '" + left.name + "'", left);
              } else if (!macroContext.isVariableMutable(left)) {
                macroContext.error("Trying to assign with " + data.op + " to immutable variable '" + left.name + "'", left);
              }
            }
          }
          try {
            result = handler.call(
              macroContext,
              removeNoops(data),
              __bind(macroContext, "wrap"),
              __bind(macroContext, "getConst"),
              __bind(macroContext, "makeLispyValue"),
              __bind(macroContext, "makeLispySymbol"),
              __bind(macroContext, "makeLispyCall"),
              __bind(macroContext, "macro")
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
          if (result instanceof ParserNode) {
            result = result.reduce(parser);
            tmps = macroContext.getTmps();
            if (tmps.unsaved.length) {
              result = LInternalCall("tmpWrapper", index, result.scope, [result].concat((function () {
                var _arr, _arr2, _i, _len, tmpId;
                _arr = [];
                for (_arr2 = __toArray(tmps.unsaved), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                  tmpId = _arr2[_i];
                  _arr.push(LValue(index, tmpId));
                }
                return _arr;
              }())));
            }
          }
          parser.popScope();
          return result;
        }
      }
      macros = this.macros;
      switch (this.currentMacro) {
      case BINARY_OPERATOR:
        return macroId = macros.addBinaryOperator(params, mutator, options, macroId);
      case ASSIGN_OPERATOR:
        return macroId = macros.addAssignOperator(params, mutator, options, macroId);
      case UNARY_OPERATOR:
        return macroId = macros.addUnaryOperator(params, mutator, options, macroId);
      case DEFINE_SYNTAX:
        if (!rule) {
          throw new Error("Expected rule to exist");
        }
        macros.addSyntax(options.name, mutate(mutator)(rule));
        return macroId = macros.addMacro(mutator, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
      default:
        if (!rule) {
          throw new Error("Expected rule to exist");
        }
        for (_arr = __toArray(macros.getOrAddByNames(this.currentMacro)), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          m = _arr[_i];
          if (this.pendingMacroId != null) {
            m.data.pop();
          }
          m.data.push(cache((_ref = sequential(
            ["macroName", m.token],
            ["macroData", rule]
          ), mutate(mutator)(_ref))));
        }
        if (options.label) {
          macros.addByLabel(options.label, { func: mutator });
        }
        if (this.pendingMacroId != null) {
          if (macroId != null) {
            throw new Error("Cannot provide the macro id if there is a pending macro id");
          }
          id = this.pendingMacroId;
          this.pendingMacroId = null;
          macros.replaceMacro(id, mutator, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
          return macroId = id;
        } else {
          return macroId = macros.addMacro(mutator, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
        }
      }
    }
    _Parser_prototype.macroSyntax = function (index, type, params, options, body) {
      var _ref, handler, macroId, rule, serialization;
      if (!__owns.call(macroSyntaxTypes, type)) {
        throw new Error("Unknown macro-syntax type: " + type);
      }
      if (!this.currentMacro) {
        this.error("Attempting to specify a macro syntax when not in a macro");
      }
      _ref = macroSyntaxTypes[type].call(
        this,
        index,
        params,
        body,
        options,
        this.options,
        require("./jstranslator")
      );
      handler = _ref.handler;
      rule = _ref.rule;
      serialization = _ref.serialization;
      _ref = null;
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
    _Parser_prototype.defineConst = function (index, name, value) {
      var scope;
      scope = this.scope.peek();
      if (scope === this.scope.initial) {
        this.macros.addConst(name, value);
        if (this.options.serializeMacros) {
          this.macros.addSerializedConst(name);
        }
      }
      scope.addConst(name, value);
    };
    _Parser_prototype.getConst = function (name, scope) {
      var _ref, consts;
      if (scope == null) {
        scope = this.scope.peek();
      }
      if ((_ref = scope.constValue(name)) != null) {
        return _ref;
      }
      consts = this.macros.consts;
      if (__owns.call(consts, name)) {
        return { value: consts[name] };
      }
    };
    _Parser_prototype.getConstValue = function (name, defaultValue) {
      var c;
      c = this.getConst(name);
      if (c) {
        return c.value;
      } else {
        return defaultValue;
      }
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
      } else if (node instanceof ParserNode.MacroAccess) {
        nodes = [];
        while (node instanceof ParserNode.MacroAccess) {
          nodes.push(node);
          this.position.push(node.inStatement ? "statement" : "expression");
          this.inGenerator.push(node.inGenerator);
          this.inEvilAst.push(node.inEvilAst);
          this.scope.push(node.scope);
          oldExpandingMacros = this.expandingMacros;
          this.expandingMacros = true;
          result = void 0;
          try {
            result = this.macros.getById(node.id)(node.data, this, node.index);
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
          if (node.doWrapped) {
            node = result.doWrap(this);
          } else {
            node = result;
          }
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
    function withDelay(func) {
      var startTime;
      startTime = new Date().getTime();
      function wrapped() {
        if (new Date().getTime() - startTime > 5) {
          return setImmediate(
            function (x, y) {
              startTime = new Date().getTime();
              return wrapped.apply(x, __toArray(y));
            },
            this,
            arguments
          );
        } else {
          return func.apply(this, arguments);
        }
      }
      return wrapped;
    }
    function makeMacroExpandAllAsyncWalker() {
      var walker;
      return walker = withDelay(function (node, callback) {
        var _once, _once2, _this, expanded;
        _this = this;
        if (node._macroExpandAlled != null) {
          return callback(null, node._macroExpandAlled);
        } else if (!(node instanceof ParserNode.MacroAccess)) {
          return node.walkAsync(walker, this, (_once = false, function (_e, walked) {
            if (_once) {
              throw new Error("Attempted to call function more than once");
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
            expanded = this.macroExpand1(node);
          } catch (e) {
            return callback(e);
          }
          if (!(expanded instanceof ParserNode)) {
            return callback(null, node._macroExpandAlled = node._macroExpanded = expanded);
          }
          return walker.call(this, expanded, (_once2 = false, function (_e, walked) {
            if (_once2) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e != null) {
              return callback(_e);
            }
            return callback(null, expanded._macroExpandAlled = expanded._macroExpanded = walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked);
          }));
        }
      });
    }
    _Parser_prototype.macroExpandAllAsync = function (node, callback) {
      return makeMacroExpandAllAsyncWalker().call(this, node, function (err, result) {
        return callback(err, result);
      });
    };
    function macroExpandAllWalker(node) {
      var expanded, walked;
      if (node._macroExpandAlled != null) {
        return node._macroExpandAlled;
      } else if (!(node instanceof ParserNode.MacroAccess)) {
        walked = node.walk(macroExpandAllWalker, this);
        return walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked;
      } else {
        expanded = this.macroExpand1(node);
        if (!(expanded instanceof ParserNode)) {
          return node._macroExpandAlled = node._macroExpanded = expanded;
        }
        walked = macroExpandAllWalker.call(this, expanded);
        return expanded._macroExpandAlled = expanded._macroExpanded = walked._macroExpandAlled = walked._macroExpanded = node._macroExpandAlled = node._macroExpanded = walked;
      }
    }
    _Parser_prototype.macroExpandAll = function (node) {
      return macroExpandAllWalker.call(this, node);
    };
    _Parser_prototype.macroExpandAllPromise = function (node) {
      var defer;
      if (this.options.sync) {
        return __defer.fulfilled(this.macroExpandAll(node));
      } else {
        defer = __defer();
        this.macroExpandAllAsync(node, function (err, result) {
          if (err) {
            return defer.reject(err);
          } else {
            return defer.fulfill(result);
          }
        });
        return defer.promise;
      }
    };
    _Parser_prototype.clearCache = function () {
      this.cache = [];
    };
    return Parser;
  }());
  parse = __promise(function (source, macros, options) {
    var _e, _send, _state, _step, _throw, e, endExpandTime, endParseTime,
        endReduceTime, expanded, getPosition, parser, reduced, result, rootRule,
        startTime;
    _state = 0;
    function _close() {
      _state = 8;
    }
    function _step(_received) {
      while (true) {
        switch (_state) {
        case 0:
          if (macros == null) {
            macros = null;
          }
          if (options == null) {
            options = {};
          }
          parser = Parser(
            source,
            macros != null ? macros.clone() : void 0,
            options
          );
          macros = parser.macros;
          if (options.embeddedGenerator) {
            rootRule = EmbeddedRootGeneratorP;
          } else if (options.embedded) {
            rootRule = EmbeddedRootP;
          } else {
            rootRule = RootP;
          }
          startTime = new Date().getTime();
          ++_state;
        case 1:
          _state = options.sync ? 2 : 3;
          break;
        case 2:
          result = rootRule.sync(parser);
          _state = 6;
          break;
        case 3:
          ++_state;
          return { done: false, value: rootRule(parser) };
        case 4:
          result = _received;
          _state = 6;
          break;
        case 5:
          if (e !== SHORT_CIRCUIT) {
            throw e;
          }
          ++_state;
        case 6:
          parser.clearCache();
          endParseTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("parse", endParseTime - startTime);
          }
          if (!result || result.index < source.length) {
            throw parser.getFailure(result != null ? result.index : void 0);
          }
          ++_state;
          return { done: false, value: parser.macroExpandAllPromise(result.value) };
        case 7:
          expanded = _received;
          endExpandTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("macroExpand", endExpandTime - endParseTime);
          }
          reduced = expanded.reduce(parser);
          endReduceTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("reduce", endReduceTime - endExpandTime);
          }
          getPosition = parser.getPosition;
          parser = null;
          ++_state;
          return {
            done: true,
            value: {
              result: reduced,
              macros: macros,
              getPosition: getPosition,
              parseTime: endParseTime - startTime,
              macroExpandTime: endExpandTime - endParseTime,
              reduceTime: endReduceTime - endExpandTime,
              time: endReduceTime - startTime
            }
          };
        case 8:
          return { done: true, value: void 0 };
        default: throw new Error("Unknown state: " + _state);
        }
      }
    }
    function _throw(_e) {
      if (_state >= 1 && _state <= 4) {
        e = _e;
        _state = 5;
      } else {
        _close();
        throw _e;
      }
    }
    function _send(_received) {
      while (true) {
        try {
          return _step(_received);
        } catch (_e) {
          _throw(_e);
        }
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
      "throw": function (_e) {
        _throw(_e);
        return _send(void 0);
      }
    };
  });
  parse.ParserError = ParserError;
  parse.MacroError = MacroError;
  parse.Node = ParserNode;
  parse.MacroHolder = MacroHolder;
  parse.unusedCaches = unusedCaches;
  parse.deserializePrelude = function (data) {
    var parsed, parser;
    if (typeof data === "string") {
      parsed = Function("'use strict'; return " + data)();
    } else {
      parsed = data;
    }
    parser = Parser();
    parser.macros.deserialize(parsed, parser, {});
    return parser.macros;
  };
  parse.getReservedWords = function (macros, options) {
    if (options == null) {
      options = {};
    }
    return unique(getReservedIdents(options).concat(__toArray(macros != null && typeof macros.getMacroAndOperatorNames === "function" && macros.getMacroAndOperatorNames() || [])));
  };
  module.exports = parse;
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
