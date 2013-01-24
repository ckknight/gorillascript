(function () {
  "use strict";
  var __cmp, __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, _FunctionBody, _inAst, _indexSlice, _inGenerator, _inMacro, _Name, _NameOrSymbol, _position, _Space, _Symbol, AccessIndexNode, AccessNode, Advance, AnyChar, ArgsNode, ArgumentsLiteral, ArrayLiteral, ArrayNode, ArrayParameter, ArrayType, Assignment, AssignmentAsExpression, AssignNode, Ast, Asterix, AstExpression, AstExpressionToken, AsToken, AstStatement, AstToken, AsType, AtSign, Backslash, BackslashEscapeSequence, BackslashStringLiteral, BasicInvocationOrAccess, BinaryDigit, BinaryInteger, BinaryNode, Block, BlockNode, Body, BodyOrStatementOrNothing, BracketedObjectKey, BreakNode, CallNode, CheckIndent, CheckStop, CloseCurlyBrace, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonChar, ColonEqual, Comma, CommaOrNewline, CommaOrNewlineWithCheckIndent, Comment, ComplexAssignable, ConstantLiteral, ConstNode, ContinueNode, CountIndent, CustomAssignment, CustomBinaryOperator, CustomOperatorCloseParenthesis, CustomPostfixUnary, CustomPrefixUnary, DebuggerNode, DecimalDigit, DecimalDigits, DecimalNumber, DeclareEqualSymbol, DedentedBody, DefineHelper, DefineHelperStart, DefineOperator, DefineOperatorStart, DefineSyntax, DefineSyntaxStart, DefNode, DirectAssignment, DollarSign, DoubleColon, DoubleQuote, DoubleStringLiteral, DualObjectKey, eE, EmptyLine, EmptyLines, Eof, EscapeSequence, Eval, EvalNode, EvalToken, ExistentialSymbol, ExistentialSymbolNoSpace, Expression, ExpressionAsStatement, ExpressionOrAssignment, ExpressionOrNothing, ExtendsToken, FailureManager, FalseLiteral, ForInNode, ForNode, freeze, fromCharCode, FunctionBody, FunctionDeclaration, FunctionLiteral, FunctionNode, generateCacheKey, GeneratorFunctionBody, getTmpId, getUseCustomBinaryOperator, GLOBAL, HashSign, HexDigit, HexEscapeSequence, HexInteger, Identifier, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrAccessPart, IdentifierOrAccessStart, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierParameter, IdentNode, IfNode, inAst, InBlock, IndentedObjectLiteral, INDENTS, Index, IndexMultiple, IndexSlice, inExpression, InfinityLiteral, inIndexSlice, inMacro, inspect, inStatement, InvocationArguments, InvocationOrAccess, KeyValuePair, KvpParameter, Letter, Line, Literal, Logic, LowerR, LowerU, LowerX, Macro, MacroAccessNode, MacroBody, MacroError, MacroHelper, MacroHolder, MacroName, MacroNames, MacroOptions, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, MacroToken, MaybeAdvance, MaybeAsType, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExclamationPointNoSpace, MaybeExistentialSymbol, MaybeExistentialSymbolNoSpace, MaybeMutableToken, MaybeNotToken, MaybeSpreadToken, Minus, MultiLineComment, MutableToken, Name, NameChar, NamePart, NamePartWithNumbers, NameStart, NaNLiteral, Newline, NewlineWithCheckIndent, Node, NoSpace, NotColon, Nothing, NOTHING, NothingNode, NotToken, NullLiteral, NumberChar, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectLiteral, ObjectNode, ObjectParameter, OctalDigit, OctalInteger, OpenCurlyBrace, OpenParenthesis, OpenParenthesisChar, OpenSquareBracket, OpenSquareBracketChar, ParamDualObjectKey, Parameter, Parameters, ParameterSequence, ParamNode, ParamSingularObjectKey, Parenthetical, ParserError, Period, Pipe, PipeChar, Plus, PlusOrMinus, PopIndent, PrimaryExpression, PushIndent, RadixInteger, RawDecimalDigits, RegexComment, RegexDoubleToken, RegexFlags, RegexLiteral, RegexpNode, RegexSingleToken, RegexTripleDoubleToken, RegexTripleSingleToken, RESERVED_IDENTS, ReturnNode, Root, RootNode, Semicolon, SemicolonChar, Shebang, SHORT_CIRCUIT, SimpleAssignable, SimpleConstantLiteral, SimpleOrArrayType, SimpleType, SingleEscapeCharacter, SingleLineComment, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, SomeSpace, Space, SpaceChar, SpaceNewline, SpreadNode, SpreadOrExpression, SpreadToken, Stack, State, Statement, Stop, StringIndent, StringInterpolation, StringLiteral, SuperInvocation, SuperNode, SuperToken, SwitchNode, Symbol, SymbolChar, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, SyntaxToken, ThisLiteral, ThisNode, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, ThrowNode, TmpNode, TmpWrapperNode, TripleDoubleQuote, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TryCatchNode, TryFinallyNode, Type, TypeArrayNode, TypeReference, TypeUnionNode, UnaryNode, UnclosedArguments, UnclosedObjectLiteral, Underscore, UnicodeEscapeSequence, UnionType, UseMacro, VarNode, VoidLiteral, YieldNode, Zero;
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
  __in = (function () {
    var indexOf;
    indexOf = Array.prototype.indexOf;
    return function (child, parent) {
      return indexOf.call(parent, child) !== -1;
    };
  }());
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
  __owns = (function () {
    var has;
    has = Object.prototype.hasOwnProperty;
    return function (parent, child) {
      return has.call(parent, child);
    };
  }());
  __slice = (function () {
    var slice;
    slice = Array.prototype.slice;
    return function (array, start, end) {
      return slice.call(array, start, end);
    };
  }());
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
    if (__isArray(x)) {
      return x;
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
  Type = require("./types");
  inspect = require("util").inspect;
  GLOBAL = typeof window !== "undefined" ? window : global;
  freeze = typeof Object.freeze === "function" ? Object.freeze
    : function (o) {
      return o;
    };
  SHORT_CIRCUIT = freeze({
    toString: function () {
      return "short-circuit";
    }
  });
  NOTHING = freeze({
    toString: function () {
      return "";
    }
  });
  generateCacheKey = (function () {
    var id;
    id = -1;
    return function () {
      return id = __num(id) + 1;
    };
  }());
  function copy(o) {
    var k, result, v;
    if (!(o instanceof Object)) {
      throw TypeError("Expected o to be a Object, got " + __typeof(o));
    }
    result = {};
    for (k in o) {
      if (__owns(o, k)) {
        v = o[k];
        result[k] = v;
      }
    }
    return result;
  }
  function assert(value) {
    if (!value) {
      throw Error("Assertion failed: " + String(value));
    }
    return value;
  }
  function named(name, func) {
    if (name == void 0) {
      name = null;
    } else if (typeof name !== "string") {
      throw TypeError("Expected name to be a null or String, got " + __typeof(name));
    }
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    if (name) {
      func.parserName = name;
    }
    return func;
  }
  function identity(x) {
    return x;
  }
  function retThis() {
    return this;
  }
  getTmpId = (function () {
    var id;
    id = -1;
    return function () {
      return id = __num(id) + 1;
    };
  }());
  function cache(rule, dontCache) {
    var cacheKey;
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (dontCache == void 0) {
      dontCache = false;
    } else if (typeof dontCache !== "boolean") {
      throw TypeError("Expected dontCache to be a Boolean, got " + __typeof(dontCache));
    }
    if (dontCache) {
      return rule;
    } else {
      cacheKey = generateCacheKey();
      return named(
        rule != null ? rule.parserName : void 0,
        function (o) {
          var _ref, cache, indent, indentCache, index, inner, item, result;
          cache = o.cache;
          index = o.index;
          indent = o.indent.peek();
          indentCache = (_ref = cache[indent]) != null ? _ref : (cache[indent] = []);
          inner = (_ref = indentCache[cacheKey]) != null ? _ref : (indentCache[cacheKey] = []);
          item = inner[index];
          if (item === void 0) {
            result = rule(o);
            if (o.indent.peek() !== indent) {
              throw Error("Changed indent during cache process: from " + __strnum(indent) + " to " + __strnum(o.indent.peek()));
            }
            if (!result) {
              inner[index] = false;
            } else {
              inner[index] = [o.index, o.line, result];
            }
            return result;
          } else if (!item) {
            return false;
          } else {
            o.index = item[0];
            o.line = item[1];
            return item[2];
          }
        }
      );
    }
  }
  function sequential(array, mutator, dontCache) {
    var _len, i, item, key, mapping, name, rule, ruleName, rules, shouldWrapName;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be a Array, got " + __typeof(array));
    }
    if (dontCache == void 0) {
      dontCache = false;
    } else if (typeof dontCache !== "boolean") {
      throw TypeError("Expected dontCache to be a Boolean, got " + __typeof(dontCache));
    }
    if (array.length === 0) {
      throw Error("Cannot provide an empty array");
    }
    name = [];
    rules = [];
    mapping = [];
    shouldWrapName = false;
    for (i = 0, _len = __num(array.length); i < _len; ++i) {
      item = array[i];
      key = void 0;
      rule = void 0;
      if (Array.isArray(item)) {
        if (item.length !== 2) {
          throw Error("Found an array with #(item.length) length at index #" + __strnum(i));
        }
        if (typeof item[0] !== "string") {
          throw TypeError("Array in index #" + __strnum(i) + " has an improper key: " + __typeof(item[0]));
        }
        if (typeof item[1] !== "function") {
          throw TypeError("Array in index #" + __strnum(i) + " has an improper rule: " + __typeof(item[1]));
        }
        key = item[0];
        rule = item[1];
      } else if (typeof item === "function") {
        rule = item;
      } else {
        throw TypeError("Found a non-array, non-function in index #" + __strnum(i) + ": " + __typeof(item));
      }
      rules.push(rule);
      mapping.push(key);
      ruleName = rule.parserName || "<unknown>";
      if (__num(i) > 0 && name[__num(name.length) - 1].slice(-1) === '"' && ruleName.charAt(0) === '"' && ruleName.slice(-1) === '"') {
        name[__num(name.length) - 1] = name[__num(name.length) - 1].substring(0, __num(name[__num(name.length) - 1].length) - 1);
        name.push(ruleName.substring(1));
      } else {
        if (__num(i) > 0) {
          name.push(" ");
          shouldWrapName = true;
        }
        name.push(ruleName);
      }
    }
    if (shouldWrapName) {
      name.splice(0, 0, "(");
      name.push(")");
    }
    name = name.join("");
    return (function () {
      var _rule;
      _rule = named(name, function (o) {
        var _len, clone, i, item, key, result, rule;
        clone = o.clone();
        result = {};
        for (i = 0, _len = __num(rules.length); i < _len; ++i) {
          rule = rules[i];
          item = rule(clone);
          if (!item) {
            return false;
          }
          key = mapping[i];
          if (key) {
            if (key === "this") {
              result = item;
            } else {
              result[key] = item;
            }
          }
        }
        o.update(clone);
        return result;
      });
      return named(
        (_rule != null ? _rule.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule(o);
          if (!result) {
            return false;
          } else if (typeof mutator === "function") {
            return mutator(result, o, index, line);
          } else if (mutator !== void 0) {
            return mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }
  function ruleEqual(rule, text, mutator) {
    var failureMessage;
    failureMessage = JSON.stringify(text);
    return (function () {
      var _rule;
      _rule = (function () {
        var _rule2;
        _rule2 = named(failureMessage, function (o) {
          var clone, result;
          clone = o.clone();
          result = rule(clone);
          if (result === text) {
            o.update(clone);
            return result;
          } else {
            o.fail(failureMessage);
            return false;
          }
        });
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof mutator === "function") {
              return mutator(result, o, index, line);
            } else if (mutator !== void 0) {
              return mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return function (o) {
        var result;
        o.preventFail();
        result = void 0;
        try {
          result = _rule(o);
        } finally {
          o.unpreventFail();
        }
        if (result) {
          return result;
        } else {
          o.fail(failureMessage);
          return false;
        }
      };
    }());
  }
  function word(text, mutator) {
    return ruleEqual(Name, text, mutator);
  }
  function symbol(text, mutator) {
    return ruleEqual(Symbol, text, mutator);
  }
  function wordOrSymbol(text, mutator) {
    var parts;
    parts = [Space];
    parts.push.apply(parts, __toArray((function () {
      var _arr, _arr2, _len, i, part;
      for (_arr = [], _arr2 = text.split(/([a-z]+)/gi), i = 0, _len = __num(_arr2.length); i < _len; ++i) {
        part = _arr2[i];
        if (part) {
          if (__num(i) % 2 === 0) {
            _arr.push(ruleEqual(_Symbol, part));
          } else {
            _arr.push(ruleEqual(_Name, part));
          }
        }
      }
      return _arr;
    }())));
    return sequential(parts, mutator || text);
  }
  function macroName(text, mutator) {
    var failureMessage;
    failureMessage = JSON.stringify(text);
    return (function () {
      var _rule;
      _rule = named(failureMessage, function (o) {
        var clone, result;
        clone = o.clone();
        result = MacroName(clone);
        if (result === text) {
          o.update(clone);
          return result;
        } else {
          o.fail(failureMessage);
          return false;
        }
      });
      return named(
        (_rule != null ? _rule.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule(o);
          if (!result) {
            return false;
          } else if (typeof mutator === "function") {
            return mutator(result, o, index, line);
          } else if (mutator !== void 0) {
            return mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }
  function getFuncName(func) {
    var match;
    if (typeof func !== "function") {
      throw TypeError("Expected a function, got " + __typeof(func));
    }
    if (func.displayName) {
      return func.displayName;
    } else if (func.name) {
      return func.name;
    } else {
      match = /^function\s*(.*?)/.exec(func.toString());
      return match && match[1] || func.parserName || "(anonymous)";
    }
  }
  function wrap(func, name) {
    var id;
    if (name == void 0) {
      name = getFuncName(func);
    }
    id = -1;
    return named(func.parserName, function (o) {
      var i, result;
      id = __num(id) + 1;
      i = id;
      console.log(__strnum(i) + "-" + __strnum(name) + " starting at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()));
      result = func(o);
      if (!result) {
        console.log(__strnum(i) + "-" + __strnum(name) + " failure at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()));
      } else {
        console.log(__strnum(i) + "-" + __strnum(name) + " success at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()), result);
      }
      return result;
    });
  }
  Stack = (function () {
    var _proto;
    function Stack(initial, data) {
      var _this;
      if (data == void 0) {
        data = [];
      }
      _this = this instanceof Stack ? this : __create(_proto);
      _this.initial = initial;
      _this.data = data;
      return _this;
    }
    _proto = Stack.prototype;
    Stack.displayName = "Stack";
    _proto.push = function (value) {
      return this.data.push(value);
    };
    _proto.pop = function () {
      var data, len;
      data = this.data;
      len = data.length;
      if (len === 0) {
        throw Error("Cannot pop");
      }
      return data.pop();
    };
    _proto.canPop = function () {
      return __num(this.data.length) > 0;
    };
    _proto.peek = function () {
      var data, len;
      data = this.data;
      len = data.length;
      if (len === 0) {
        return this.initial;
      } else {
        return data[__num(len) - 1];
      }
    };
    _proto.clone = function () {
      return Stack(this.initial, __slice(this.data, void 0, void 0));
    };
    return Stack;
  }());
  function makeAlterStack(stack, value) {
    if (!(stack instanceof Stack)) {
      throw TypeError("Expected stack to be a Stack, got " + __typeof(stack));
    }
    return function (func) {
      if (typeof func !== "function") {
        throw TypeError("Expected a function, got " + __typeof(func));
      }
      return named(func.parserName, function (o) {
        var result;
        stack.push(value);
        result = void 0;
        try {
          result = func(o);
        } finally {
          stack.pop();
        }
        return result;
      });
    };
  }
  _position = Stack("statement");
  inStatement = makeAlterStack(_position, "statement");
  inExpression = makeAlterStack(_position, "expression");
  _inMacro = Stack(false);
  inMacro = makeAlterStack(_inMacro, true);
  _inAst = Stack(false);
  inAst = makeAlterStack(_inAst, true);
  Eof = cache(named("Eof", function (o) {
    return !__lt(o.index, o.data.length);
  }));
  SpaceChar = cache(named("SpaceChar", named("space", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c === 9 || c === 11 || c === 12 || c === 32 : c === 160 || c === 5760 || c === 6158 || c >= 8192 && c <= 8202 || c === 8239 || c === 8287 || c === 12288 || c === 65263) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("space");
      return false;
    }
  })));
  _Space = cache(named("_Space", (function () {
    var _rule;
    _rule = named(
      __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = SpaceChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }())));
  Newline = cache(named("Newline", function (o) {
    var c, data, index;
    data = o.data;
    index = o.index;
    c = data.charCodeAt(index);
    if (c === 13 || c === 10 || c === 8232 || c === 8233) {
      ++index;
      if (c === 13 && data.charCodeAt(index) === 10) {
        ++index;
      }
      o.index = index;
      ++o.line;
      return true;
    } else {
      o.fail("newline");
      return false;
    }
  }));
  Stop = cache(named("Stop", function (o) {
    return Newline(o) || Eof(o);
  }));
  CheckStop = cache(named("CheckStop", function (o) {
    return Stop(o.clone());
  }));
  NewlineWithCheckIndent = cache(named("NewlineWithCheckIndent", function (o) {
    var clone;
    clone = o.clone();
    if (Newline(clone) && EmptyLines(clone) && CheckIndent(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  SingleLineComment = cache(named("SingleLineComment", function (o) {
    var _ref, data, index, len;
    data = o.data;
    index = o.index;
    if (data.charCodeAt(index) === 47 && data.charCodeAt(+index + 1) === 47) {
      len = data.length;
      index = __num(index) + 2;
      for (; ; ++index) {
        if (index >= len || (_ref = data.charCodeAt(index)) === 13 || _ref === 10) {
          o.index = index;
          return true;
        }
      }
    } else {
      return false;
    }
  }));
  MultiLineComment = cache(named("MultiLineComment", function (o) {
    var ch, data, index, len;
    data = o.data;
    index = o.index;
    if (data.charCodeAt(index) === 47 && data.charCodeAt(+index + 1) === 42) {
      len = data.length;
      index = __num(index) + 2;
      for (; ; ++index) {
        if (index >= len) {
          o.error("Multi-line comment never ends");
        } else {
          ch = data.charCodeAt(index);
          if (ch === 42 && data.charCodeAt(+index + 1) === 47) {
            o.index = +index + 2;
            Space(o);
            return true;
          } else if (ch === 13 || ch === 10 || ch === 8232 || ch === 8233) {
            if (ch === 13 && data.charCodeAt(+index + 1) === 10) {
              ++index;
            }
            ++o.line;
          }
        }
      }
    } else {
      return false;
    }
  }));
  Comment = cache(named("Comment", function (o) {
    return SingleLineComment(o) || MultiLineComment(o);
  }));
  MaybeComment = cache(named("MaybeComment", named(
    __strnum((Comment != null ? Comment.parserName : void 0) || "Comment") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = Comment(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  Space = cache(named("Space", (function () {
    function _rule(o) {
      var clone;
      clone = o.clone();
      if (_Space(clone) && MaybeComment(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }())));
  SomeSpace = cache(named("SomeSpace", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = named(
        __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar") + "+",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = SpaceChar(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          if (__num(result.length) >= 1) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
      );
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else {
            return true;
          }
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone;
        clone = o.clone();
        if (_rule(clone) && MaybeComment(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else {
            return true;
          }
        }
      );
    }());
  }())));
  NoSpace = cache(named("NoSpace", named(
    "!" + __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar"),
    function (o) {
      return !SpaceChar(o.clone());
    }
  )));
  SpaceNewline = cache(named("SpaceNewline", (function () {
    function _rule(o) {
      var clone;
      clone = o.clone();
      if (Space(clone) && Newline(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }())));
  EmptyLine = cache(named("EmptyLine", SpaceNewline));
  EmptyLines = cache(named("EmptyLines", (function () {
    var _rule;
    _rule = named(
      __strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "EmptyLine") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = EmptyLine(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }())));
  SomeEmptyLines = cache(named("SomeEmptyLines", (function () {
    var _rule;
    _rule = named(
      __strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "EmptyLine") + "+",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = EmptyLine(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        if (__num(result.length) >= 1) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }())));
  INDENTS = { 9: 4, 32: 1 };
  CountIndent = cache(named("CountIndent", (function () {
    var _rule;
    _rule = named(
      __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = SpaceChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    function _mutator(x) {
      var _i, _len, c, count, i;
      count = 1;
      for (_i = 0, _len = __num(x.length); _i < _len; ++_i) {
        c = x[_i];
        i = INDENTS[c];
        if (!i) {
          throw Error("Unexpected indent char: " + __str(JSON.stringify(c)));
        }
        count = __num(count) + __num(i);
      }
      return count;
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  CheckIndent = cache(named("CheckIndent", function (o) {
    var clone, indent;
    clone = o.clone();
    indent = CountIndent(clone);
    if (indent === clone.indent.peek()) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  Advance = named("Advance", function (o) {
    var clone, indent;
    clone = o.clone();
    indent = CountIndent(clone);
    if (!__lte(indent, clone.indent.peek())) {
      o.indent.push(indent);
      return true;
    } else {
      return false;
    }
  });
  MaybeAdvance = named("MaybeAdvance", function (o) {
    var clone, indent;
    clone = o.clone();
    indent = CountIndent(clone);
    o.indent.push(indent);
    return true;
  });
  PushIndent = named("PushIndent", (function () {
    function _mutator(indent, o) {
      o.indent.push(indent);
      return true;
    }
    return named(
      (CountIndent != null ? CountIndent.parserName : void 0) || "CountIndent",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = CountIndent(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }()));
  PopIndent = named("PopIndent", function (o) {
    if (o.indent.canPop()) {
      o.indent.pop();
      return true;
    } else {
      return o.error("Unexpected dedent");
    }
  });
  Zero = cache(named("Zero", named('"0"', function (o) {
    if (o.data.charCodeAt(o.index) === 48) {
      o.index = __num(o.index) + 1;
      return 48;
    } else {
      o.fail('"0"');
      return false;
    }
  })));
  DecimalDigit = cache(named("DecimalDigit", named("[0-9]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c >= 48 && c <= 57) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[0-9]");
      return false;
    }
  })));
  Period = cache(named("Period", named('"."', function (o) {
    if (o.data.charCodeAt(o.index) === 46) {
      o.index = __num(o.index) + 1;
      return 46;
    } else {
      o.fail('"."');
      return false;
    }
  })));
  ColonChar = cache(named("ColonChar", named('":"', function (o) {
    if (o.data.charCodeAt(o.index) === 58) {
      o.index = __num(o.index) + 1;
      return 58;
    } else {
      o.fail('":"');
      return false;
    }
  })));
  PipeChar = cache(named("PipeChar", named('"|"', function (o) {
    if (o.data.charCodeAt(o.index) === 124) {
      o.index = __num(o.index) + 1;
      return 124;
    } else {
      o.fail('"|"');
      return false;
    }
  })));
  Pipe = cache(named("Pipe", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = PipeChar(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  DoubleColon = cache(named("DoubleColon", (function () {
    function _rule(o) {
      var clone;
      clone = o.clone();
      if (ColonChar(clone) && ColonChar(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return "::";
        }
      }
    );
  }())));
  eE = cache(named("eE", named("[Ee]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 69 || c === 101) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[Ee]");
      return false;
    }
  })));
  Minus = cache(named("Minus", named('"-"', function (o) {
    if (o.data.charCodeAt(o.index) === 45) {
      o.index = __num(o.index) + 1;
      return 45;
    } else {
      o.fail('"-"');
      return false;
    }
  })));
  Plus = cache(named("Plus", named('"+"', function (o) {
    if (o.data.charCodeAt(o.index) === 43) {
      o.index = __num(o.index) + 1;
      return 43;
    } else {
      o.fail('"+"');
      return false;
    }
  })));
  PlusOrMinus = cache(named("PlusOrMinus", function (o) {
    return Minus(o) || Plus(o);
  }));
  LowerU = cache(named("LowerU", named('"u"', function (o) {
    if (o.data.charCodeAt(o.index) === 117) {
      o.index = __num(o.index) + 1;
      return 117;
    } else {
      o.fail('"u"');
      return false;
    }
  })));
  LowerX = cache(named("LowerX", named('"x"', function (o) {
    if (o.data.charCodeAt(o.index) === 120) {
      o.index = __num(o.index) + 1;
      return 120;
    } else {
      o.fail('"x"');
      return false;
    }
  })));
  HexDigit = cache(named("HexDigit", named("[0-9A-Fa-f]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c >= 48 && c <= 57 || c >= 65 && c <= 70 || c >= 97 && c <= 102) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[0-9A-Fa-f]");
      return false;
    }
  })));
  OctalDigit = cache(named("OctalDigit", named("[0-7]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c >= 48 && c <= 55) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[0-7]");
      return false;
    }
  })));
  BinaryDigit = cache(named("BinaryDigit", named("[01]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 48 || c === 49) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[01]");
      return false;
    }
  })));
  Letter = cache(named("Letter", named("letter", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c >= 65 && c <= 90 || c >= 97 && c <= 122 : c === 170 || c === 181 || c === 186 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 705 || c >= 710 && c <= 721 || c >= 736 && c <= 740 || c === 748 || c === 750 || c >= 880 && c <= 884 || c === 886 || c === 887 || c >= 890 && c <= 893 || c === 902 || c >= 904 && c <= 906 || c === 908 || c >= 910 && c <= 929 || c >= 931 && c <= 1013 || c >= 1015 && c <= 1153 || c >= 1162 && c <= 1317 || c >= 1329 && c <= 1366 || c === 1369 || c >= 1377 && c <= 1415 || c >= 1488 && c <= 1514 || c >= 1520 && c <= 1522 || c >= 1569 && c <= 1610 || c === 1646 || c === 1647 || c >= 1649 && c <= 1747 || c === 1749 || c === 1765 || c === 1766 || c === 1774 || c === 1775 || c >= 1786 && c <= 1788 || c === 1791 || c === 1808 || c >= 1810 && c <= 1839 || c >= 1869 && c <= 1957 || c === 1969 || c >= 1994 && c <= 2026 || c === 2036 || c === 2037 || c === 2042 || c >= 2048 && c <= 2069 || c === 2074 || c === 2084 || c === 2088 || c >= 2308 && c <= 2361 || c === 2365 || c === 2384 || c >= 2392 && c <= 2401 || c === 2417 || c === 2418 || c >= 2425 && c <= 2431 || c >= 2437 && c <= 2444 || c === 2447 || c === 2448 || c >= 2451 && c <= 2472 || c >= 2474 && c <= 2480 || c === 2482 || c >= 2486 && c <= 2489 || c === 2493 || c === 2510 || c === 2524 || c === 2525 || c >= 2527 && c <= 2529 || c === 2544 || c === 2545 || c >= 2565 && c <= 2570 || c === 2575 || c === 2576 || c >= 2579 && c <= 2600 || c >= 2602 && c <= 2608 || c === 2610 || c === 2611 || c === 2613 || c === 2614 || c === 2616 || c === 2617 || c >= 2649 && c <= 2652 || c === 2654 || c >= 2674 && c <= 2676 || c >= 2693 && c <= 2701 || c >= 2703 && c <= 2705 || c >= 2707 && c <= 2728 || c >= 2730 && c <= 2736 || c === 2738 || c === 2739 || c >= 2741 && c <= 2745 || c === 2749 || c === 2768 || c === 2784 || c === 2785 || c >= 2821 && c <= 2828 || c === 2831 || c === 2832 || c >= 2835 && c <= 2856 || c >= 2858 && c <= 2864 || c === 2866 || c === 2867 || c >= 2869 && c <= 2873 || c === 2877 || c === 2908 || c === 2909 || c >= 2911 && c <= 2913 || c === 2929 || c === 2947 || c >= 2949 && c <= 2954 || c >= 2958 && c <= 2960 || c >= 2962 && c <= 2965 || c === 2969 || c === 2970 || c === 2972 || c === 2974 || c === 2975 || c === 2979 || c === 2980 || c >= 2984 && c <= 2986 || c >= 2990 && c <= 3001 || c === 3024 || c >= 3077 && c <= 3084 || c >= 3086 && c <= 3088 || c >= 3090 && c <= 3112 || c >= 3114 && c <= 3123 || c >= 3125 && c <= 3129 || c === 3133 || c === 3160 || c === 3161 || c === 3168 || c === 3169 || c >= 3205 && c <= 3212 || c >= 3214 && c <= 3216 || c >= 3218 && c <= 3240 || c >= 3242 && c <= 3251 || c >= 3253 && c <= 3257 || c === 3261 || c === 3294 || c === 3296 || c === 3297 || c >= 3333 && c <= 3340 || c >= 3342 && c <= 3344 || c >= 3346 && c <= 3368 || c >= 3370 && c <= 3385 || c === 3389 || c === 3424 || c === 3425 || c >= 3450 && c <= 3455 || c >= 3461 && c <= 3478 || c >= 3482 && c <= 3505 || c >= 3507 && c <= 3515 || c === 3517 || c >= 3520 && c <= 3526 || c >= 3585 && c <= 3632 || c === 3634 || c === 3635 || c >= 3648 && c <= 3654 || c === 3713 || c === 3714 || c === 3716 || c === 3719 || c === 3720 || c === 3722 || c === 3725 || c >= 3732 && c <= 3735 || c >= 3737 && c <= 3743 || c >= 3745 && c <= 3747 || c === 3749 || c === 3751 || c === 3754 || c === 3755 || c >= 3757 && c <= 3760 || c === 3762 || c === 3763 || c === 3773 || c >= 3776 && c <= 3780 || c === 3782 || c === 3804 || c === 3805 || c === 3840 || c >= 3904 && c <= 3911 || c >= 3913 && c <= 3948 || c >= 3976 && c <= 3979 || c >= 4096 && c <= 4138 || c === 4159 || c >= 4176 && c <= 4181 || c >= 4186 && c <= 4189 || c === 4193 || c === 4197 || c === 4198 || c >= 4206 && c <= 4208 || c >= 4213 && c <= 4225 || c === 4238 || c >= 4256 && c <= 4293 || c >= 4304 && c <= 4346 || c === 4348 || c >= 4352 && c <= 4680 || c >= 4682 && c <= 4685 || c >= 4688 && c <= 4694 || c === 4696 || c >= 4698 && c <= 4701 || c >= 4704 && c <= 4744 || c >= 4746 && c <= 4749 || c >= 4752 && c <= 4784 || c >= 4786 && c <= 4789 || c >= 4792 && c <= 4798 || c === 4800 || c >= 4802 && c <= 4805 || c >= 4808 && c <= 4822 || c >= 4824 && c <= 4880 || c >= 4882 && c <= 4885 || c >= 4888 && c <= 4954 || c >= 4992 && c <= 5007 || c >= 5024 && c <= 5108 || c >= 5121 && c <= 5740 || c >= 5743 && c <= 5759 || c >= 5761 && c <= 5786 || c >= 5792 && c <= 5866 || c >= 5888 && c <= 5900 || c >= 5902 && c <= 5905 || c >= 5920 && c <= 5937 || c >= 5952 && c <= 5969 || c >= 5984 && c <= 5996 || c >= 5998 && c <= 6000 || c >= 6016 && c <= 6067 || c === 6103 || c === 6108 || c >= 6176 && c <= 6263 || c >= 6272 && c <= 6312 || c === 6314 || c >= 6320 && c <= 6389 || c >= 6400 && c <= 6428 || c >= 6480 && c <= 6509 || c >= 6512 && c <= 6516 || c >= 6528 && c <= 6571 || c >= 6593 && c <= 6599 || c >= 6656 && c <= 6678 || c >= 6688 && c <= 6740 || c === 6823 || c >= 6917 && c <= 6963 || c >= 6981 && c <= 6987 || c >= 7043 && c <= 7072 || c === 7086 || c === 7087 || c >= 7168 && c <= 7203 || c >= 7245 && c <= 7247 || c >= 7258 && c <= 7293 || c >= 7401 && c <= 7404 || c >= 7406 && c <= 7409 || c >= 7424 && c <= 7615 || c >= 7680 && c <= 7957 || c >= 7960 && c <= 7965 || c >= 7968 && c <= 8005 || c >= 8008 && c <= 8013 || c >= 8016 && c <= 8023 || c === 8025 || c === 8027 || c === 8029 || c >= 8031 && c <= 8061 || c >= 8064 && c <= 8116 || c >= 8118 && c <= 8124 || c === 8126 || c >= 8130 && c <= 8132 || c >= 8134 && c <= 8140 || c >= 8144 && c <= 8147 || c >= 8150 && c <= 8155 || c >= 8160 && c <= 8172 || c >= 8178 && c <= 8180 || c >= 8182 && c <= 8188 || c === 8305 || c === 8319 || c >= 8336 && c <= 8340 || c === 8450 || c === 8455 || c >= 8458 && c <= 8467 || c === 8469 || c >= 8473 && c <= 8477 || c === 8484 || c === 8486 || c === 8488 || c >= 8490 && c <= 8493 || c >= 8495 && c <= 8505 || c >= 8508 && c <= 8511 || c >= 8517 && c <= 8521 || c === 8526 || c === 8579 || c === 8580 || c >= 11264 && c <= 11310 || c >= 11312 && c <= 11358 || c >= 11360 && c <= 11492 || c >= 11499 && c <= 11502 || c >= 11520 && c <= 11557 || c >= 11568 && c <= 11621 || c === 11631 || c >= 11648 && c <= 11670 || c >= 11680 && c <= 11686 || c >= 11688 && c <= 11694 || c >= 11696 && c <= 11702 || c >= 11704 && c <= 11710 || c >= 11712 && c <= 11718 || c >= 11720 && c <= 11726 || c >= 11728 && c <= 11734 || c >= 11736 && c <= 11742 || c === 11823 || c === 12293 || c === 12294 || c >= 12337 && c <= 12341 || c === 12347 || c === 12348 || c >= 12353 && c <= 12438 || c >= 12445 && c <= 12447 || c >= 12449 && c <= 12538 || c >= 12540 && c <= 12543 || c >= 12549 && c <= 12589 || c >= 12593 && c <= 12686 || c >= 12704 && c <= 12727 || c >= 12784 && c <= 12799 || c >= 13312 && c <= 19893 || c >= 19968 && c <= 40907 || c >= 40960 && c <= 42124 || c >= 42192 && c <= 42237 || c >= 42240 && c <= 42508 || c >= 42512 && c <= 42527 || c === 42538 || c === 42539 || c >= 42560 && c <= 42591 || c >= 42594 && c <= 42606 || c >= 42623 && c <= 42647 || c >= 42656 && c <= 42725 || c >= 42775 && c <= 42783 || c >= 42786 && c <= 42888 || c === 42891 || c === 42892 || c >= 43003 && c <= 43009 || c >= 43011 && c <= 43013 || c >= 43015 && c <= 43018 || c >= 43020 && c <= 43042 || c >= 43072 && c <= 43123 || c >= 43138 && c <= 43187 || c >= 43250 && c <= 43255 || c === 43259 || c >= 43274 && c <= 43301 || c >= 43312 && c <= 43334 || c >= 43360 && c <= 43388 || c >= 43396 && c <= 43442 || c === 43471 || c >= 43520 && c <= 43560 || c >= 43584 && c <= 43586 || c >= 43588 && c <= 43595 || c >= 43616 && c <= 43638 || c === 43642 || c >= 43648 && c <= 43695 || c === 43697 || c === 43701 || c === 43702 || c >= 43705 && c <= 43709 || c === 43712 || c === 43714 || c >= 43739 && c <= 43741 || c >= 43968 && c <= 44002 || c >= 44032 && c <= 55203 || c >= 55216 && c <= 55238 || c >= 55243 && c <= 55291 || c >= 63744 && c <= 64045 || c >= 64048 && c <= 64109 || c >= 64112 && c <= 64217 || c >= 64256 && c <= 64262 || c >= 64275 && c <= 64279 || c === 64285 || c >= 64287 && c <= 64296 || c >= 64298 && c <= 64310 || c >= 64312 && c <= 64316 || c === 64318 || c === 64320 || c === 64321 || c === 64323 || c === 64324 || c >= 64326 && c <= 64433 || c >= 64467 && c <= 64829 || c >= 64848 && c <= 64911 || c >= 64914 && c <= 64967 || c >= 65008 && c <= 65019 || c >= 65136 && c <= 65140 || c >= 65142 && c <= 65262 || c >= 65264 && c <= 65276 || c >= 65313 && c <= 65338 || c >= 65345 && c <= 65370 || c >= 65382 && c <= 65470 || c >= 65474 && c <= 65479 || c >= 65482 && c <= 65487 || c >= 65490 && c <= 65495 || c >= 65498 && c <= 65500) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("letter");
      return false;
    }
  })));
  NumberChar = cache(named("NumberChar", named("number", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c >= 48 && c <= 57 : c === 178 || c === 179 || c === 185 || c >= 188 && c <= 190 || c >= 1632 && c <= 1641 || c >= 1776 && c <= 1785 || c >= 1984 && c <= 1993 || c >= 2406 && c <= 2415 || c >= 2534 && c <= 2543 || c >= 2548 && c <= 2553 || c >= 2662 && c <= 2671 || c >= 2790 && c <= 2799 || c >= 2918 && c <= 2927 || c >= 3046 && c <= 3058 || c >= 3174 && c <= 3183 || c >= 3192 && c <= 3198 || c >= 3302 && c <= 3311 || c >= 3430 && c <= 3445 || c >= 3664 && c <= 3673 || c >= 3792 && c <= 3801 || c >= 3872 && c <= 3891 || c >= 4160 && c <= 4169 || c >= 4240 && c <= 4249 || c >= 4969 && c <= 4988 || c >= 5870 && c <= 5872 || c >= 6112 && c <= 6121 || c >= 6128 && c <= 6137 || c >= 6160 && c <= 6169 || c >= 6470 && c <= 6479 || c >= 6608 && c <= 6618 || c >= 6784 && c <= 6793 || c >= 6800 && c <= 6809 || c >= 6992 && c <= 7001 || c >= 7088 && c <= 7097 || c >= 7232 && c <= 7241 || c >= 7248 && c <= 7257 || c === 8304 || c >= 8308 && c <= 8313 || c >= 8320 && c <= 8329 || c >= 8528 && c <= 8578 || c >= 8581 && c <= 8585 || c >= 9312 && c <= 9371 || c >= 9450 && c <= 9471 || c >= 10102 && c <= 10131 || c === 11517 || c === 12295 || c >= 12321 && c <= 12329 || c >= 12344 && c <= 12346 || c >= 12690 && c <= 12693 || c >= 12832 && c <= 12841 || c >= 12881 && c <= 12895 || c >= 12928 && c <= 12937 || c >= 12977 && c <= 12991 || c >= 42528 && c <= 42537 || c >= 42726 && c <= 42735 || c >= 43056 && c <= 43061 || c >= 43216 && c <= 43225 || c >= 43264 && c <= 43273 || c >= 43472 && c <= 43481 || c >= 43600 && c <= 43609 || c >= 44016 && c <= 44025 || c >= 65296 && c <= 65305) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("number");
      return false;
    }
  })));
  Underscore = cache(named("Underscore", named('"_"', function (o) {
    if (o.data.charCodeAt(o.index) === 95) {
      o.index = __num(o.index) + 1;
      return 95;
    } else {
      o.fail('"_"');
      return false;
    }
  })));
  DollarSign = cache(named("DollarSign", named('"$"', function (o) {
    if (o.data.charCodeAt(o.index) === 36) {
      o.index = __num(o.index) + 1;
      return 36;
    } else {
      o.fail('"$"');
      return false;
    }
  })));
  AtSign = cache(named("AtSign", named('"@"', function (o) {
    if (o.data.charCodeAt(o.index) === 64) {
      o.index = __num(o.index) + 1;
      return 64;
    } else {
      o.fail('"@"');
      return false;
    }
  })));
  HashSign = cache(named("HashSign", (function () {
    var _rule;
    _rule = named('"#"', function (o) {
      if (o.data.charCodeAt(o.index) === 35) {
        o.index = __num(o.index) + 1;
        return 35;
      } else {
        o.fail('"#"');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  NameStart = cache(named("NameStart", function (o) {
    return Letter(o) || Underscore(o) || DollarSign(o);
  }));
  NameChar = cache(named("NameChar", function (o) {
    return NameStart(o) || NumberChar(o);
  }));
  SymbolChar = cache(named("SymbolChar", named("symbolic", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c === 33 || c === 35 || c === 37 || c === 38 || c === 42 || c === 43 || c === 45 || c === 47 || c >= 60 && c <= 63 || c === 92 || c === 94 || c === 96 || c === 124 || c === 126 || c === 127 : c >= 128 && c <= 159 || c >= 161 && c <= 169 || c >= 171 && c <= 177 || c === 180 || c >= 182 && c <= 184 || c === 187 || c === 191 || c === 215 || c === 247 || c >= 706 && c <= 709 || c >= 722 && c <= 735 || c >= 741 && c <= 747 || c === 749 || c >= 751 && c <= 879 || c === 885 || c === 888 || c === 889 || c >= 894 && c <= 901 || c === 903 || c === 907 || c === 909 || c === 930 || c === 1014 || c >= 1154 && c <= 1161 || c >= 1318 && c <= 1328 || c === 1367 || c === 1368 || c >= 1370 && c <= 1376 || c >= 1416 && c <= 1487 || c >= 1515 && c <= 1519 || c >= 1523 && c <= 1568 || c >= 1611 && c <= 1631 || c >= 1642 && c <= 1645 || c === 1648 || c === 1748 || c >= 1750 && c <= 1764 || c >= 1767 && c <= 1773 || c === 1789 || c === 1790 || c >= 1792 && c <= 1807 || c === 1809 || c >= 1840 && c <= 1868 || c >= 1958 && c <= 1968 || c >= 1970 && c <= 1983 || c >= 2027 && c <= 2035 || c >= 2038 && c <= 2041 || c >= 2043 && c <= 2047 || c >= 2070 && c <= 2073 || c >= 2075 && c <= 2083 || c >= 2085 && c <= 2087 || c >= 2089 && c <= 2307 || c >= 2362 && c <= 2364 || c >= 2366 && c <= 2383 || c >= 2385 && c <= 2391 || c >= 2402 && c <= 2405 || c === 2416 || c >= 2419 && c <= 2424 || c >= 2432 && c <= 2436 || c === 2445 || c === 2446 || c === 2449 || c === 2450 || c === 2473 || c === 2481 || c >= 2483 && c <= 2485 || c >= 2490 && c <= 2492 || c >= 2494 && c <= 2509 || c >= 2511 && c <= 2523 || c === 2526 || c >= 2530 && c <= 2533 || c === 2546 || c === 2547 || c >= 2554 && c <= 2564 || c >= 2571 && c <= 2574 || c === 2577 || c === 2578 || c === 2601 || c === 2609 || c === 2612 || c === 2615 || c >= 2618 && c <= 2648 || c === 2653 || c >= 2655 && c <= 2661 || c === 2672 || c === 2673 || c >= 2677 && c <= 2692 || c === 2702 || c === 2706 || c === 2729 || c === 2737 || c === 2740 || c >= 2746 && c <= 2748 || c >= 2750 && c <= 2767 || c >= 2769 && c <= 2783 || c >= 2786 && c <= 2789 || c >= 2800 && c <= 2820 || c === 2829 || c === 2830 || c === 2833 || c === 2834 || c === 2857 || c === 2865 || c === 2868 || c >= 2874 && c <= 2876 || c >= 2878 && c <= 2907 || c === 2910 || c >= 2914 && c <= 2917 || c === 2928 || c >= 2930 && c <= 2946 || c === 2948 || c >= 2955 && c <= 2957 || c === 2961 || c >= 2966 && c <= 2968 || c === 2971 || c === 2973 || c >= 2976 && c <= 2978 || c >= 2981 && c <= 2983 || c >= 2987 && c <= 2989 || c >= 3002 && c <= 3023 || c >= 3025 && c <= 3045 || c >= 3059 && c <= 3076 || c === 3085 || c === 3089 || c === 3113 || c === 3124 || c >= 3130 && c <= 3132 || c >= 3134 && c <= 3159 || c >= 3162 && c <= 3167 || c >= 3170 && c <= 3173 || c >= 3184 && c <= 3191 || c >= 3199 && c <= 3204 || c === 3213 || c === 3217 || c === 3241 || c === 3252 || c >= 3258 && c <= 3260 || c >= 3262 && c <= 3293 || c === 3295 || c >= 3298 && c <= 3301 || c >= 3312 && c <= 3332 || c === 3341 || c === 3345 || c === 3369 || c >= 3386 && c <= 3388 || c >= 3390 && c <= 3423 || c >= 3426 && c <= 3429 || c >= 3446 && c <= 3449 || c >= 3456 && c <= 3460 || c >= 3479 && c <= 3481 || c === 3506 || c === 3516 || c === 3518 || c === 3519 || c >= 3527 && c <= 3584 || c === 3633 || c >= 3636 && c <= 3647 || c >= 3655 && c <= 3663 || c >= 3674 && c <= 3712 || c === 3715 || c === 3717 || c === 3718 || c === 3721 || c === 3723 || c === 3724 || c >= 3726 && c <= 3731 || c === 3736 || c === 3744 || c === 3748 || c === 3750 || c === 3752 || c === 3753 || c === 3756 || c === 3761 || c >= 3764 && c <= 3772 || c === 3774 || c === 3775 || c === 3781 || c >= 3783 && c <= 3791 || c === 3802 || c === 3803 || c >= 3806 && c <= 3839 || c >= 3841 && c <= 3871 || c >= 3892 && c <= 3903 || c === 3912 || c >= 3949 && c <= 3975 || c >= 3980 && c <= 4095 || c >= 4139 && c <= 4158 || c >= 4170 && c <= 4175 || c >= 4182 && c <= 4185 || c >= 4190 && c <= 4192 || c >= 4194 && c <= 4196 || c >= 4199 && c <= 4205 || c >= 4209 && c <= 4212 || c >= 4226 && c <= 4237 || c === 4239 || c >= 4250 && c <= 4255 || c >= 4294 && c <= 4303 || c === 4347 || c >= 4349 && c <= 4351 || c === 4681 || c === 4686 || c === 4687 || c === 4695 || c === 4697 || c === 4702 || c === 4703 || c === 4745 || c === 4750 || c === 4751 || c === 4785 || c === 4790 || c === 4791 || c === 4799 || c === 4801 || c === 4806 || c === 4807 || c === 4823 || c === 4881 || c === 4886 || c === 4887 || c >= 4955 && c <= 4968 || c >= 4989 && c <= 4991 || c >= 5008 && c <= 5023 || c >= 5109 && c <= 5120 || c === 5741 || c === 5742 || c >= 5787 && c <= 5791 || c >= 5867 && c <= 5869 || c >= 5873 && c <= 5887 || c === 5901 || c >= 5906 && c <= 5919 || c >= 5938 && c <= 5951 || c >= 5970 && c <= 5983 || c === 5997 || c >= 6001 && c <= 6015 || c >= 6068 && c <= 6102 || c >= 6104 && c <= 6107 || c >= 6109 && c <= 6111 || c >= 6122 && c <= 6127 || c >= 6138 && c <= 6157 || c === 6159 || c >= 6170 && c <= 6175 || c >= 6264 && c <= 6271 || c === 6313 || c >= 6315 && c <= 6319 || c >= 6390 && c <= 6399 || c >= 6429 && c <= 6469 || c === 6510 || c === 6511 || c >= 6517 && c <= 6527 || c >= 6572 && c <= 6592 || c >= 6600 && c <= 6607 || c >= 6619 && c <= 6655 || c >= 6679 && c <= 6687 || c >= 6741 && c <= 6783 || c >= 6794 && c <= 6799 || c >= 6810 && c <= 6822 || c >= 6824 && c <= 6916 || c >= 6964 && c <= 6980 || c >= 6988 && c <= 6991 || c >= 7002 && c <= 7042 || c >= 7073 && c <= 7085 || c >= 7098 && c <= 7167 || c >= 7204 && c <= 7231 || c >= 7242 && c <= 7244 || c >= 7294 && c <= 7400 || c === 7405 || c >= 7410 && c <= 7423 || c >= 7616 && c <= 7679 || c === 7958 || c === 7959 || c === 7966 || c === 7967 || c === 8006 || c === 8007 || c === 8014 || c === 8015 || c === 8024 || c === 8026 || c === 8028 || c === 8030 || c === 8062 || c === 8063 || c === 8117 || c === 8125 || c >= 8127 && c <= 8129 || c === 8133 || c >= 8141 && c <= 8143 || c === 8148 || c === 8149 || c >= 8156 && c <= 8159 || c >= 8173 && c <= 8177 || c === 8181 || c >= 8189 && c <= 8191 || c >= 8203 && c <= 8231 || c >= 8234 && c <= 8238 || c >= 8240 && c <= 8286 || c >= 8288 && c <= 8303 || c === 8306 || c === 8307 || c >= 8314 && c <= 8318 || c >= 8330 && c <= 8335 || c >= 8341 && c <= 8449 || c >= 8451 && c <= 8454 || c === 8456 || c === 8457 || c === 8468 || c >= 8470 && c <= 8472 || c >= 8478 && c <= 8483 || c === 8485 || c === 8487 || c === 8489 || c === 8494 || c === 8506 || c === 8507 || c >= 8512 && c <= 8516 || c >= 8522 && c <= 8525 || c === 8527 || c >= 8586 && c <= 9311 || c >= 9372 && c <= 9449 || c >= 9472 && c <= 10101 || c >= 10132 && c <= 11263 || c === 11311 || c === 11359 || c >= 11493 && c <= 11498 || c >= 11503 && c <= 11516 || c === 11518 || c === 11519 || c >= 11558 && c <= 11567 || c >= 11622 && c <= 11630 || c >= 11632 && c <= 11647 || c >= 11671 && c <= 11679 || c === 11687 || c === 11695 || c === 11703 || c === 11711 || c === 11719 || c === 11727 || c === 11735 || c >= 11743 && c <= 11822 || c >= 11824 && c <= 12287 || c >= 12289 && c <= 12292 || c >= 12296 && c <= 12320 || c >= 12330 && c <= 12336 || c === 12342 || c === 12343 || c >= 12349 && c <= 12352 || c >= 12439 && c <= 12444 || c === 12448 || c === 12539 || c >= 12544 && c <= 12548 || c >= 12590 && c <= 12592 || c >= 12687 && c <= 12689 || c >= 12694 && c <= 12703 || c >= 12728 && c <= 12783 || c >= 12800 && c <= 12831 || c >= 12842 && c <= 12880 || c >= 12896 && c <= 12927 || c >= 12938 && c <= 12976 || c >= 12992 && c <= 13311 || c >= 19894 && c <= 19967 || c >= 40908 && c <= 40959 || c >= 42125 && c <= 42191 || c === 42238 || c === 42239 || c >= 42509 && c <= 42511 || c >= 42540 && c <= 42559 || c === 42592 || c === 42593 || c >= 42607 && c <= 42622 || c >= 42648 && c <= 42655 || c >= 42736 && c <= 42774 || c === 42784 || c === 42785 || c === 42889 || c === 42890 || c >= 42893 && c <= 43002 || c === 43010 || c === 43014 || c === 43019 || c >= 43043 && c <= 43055 || c >= 43062 && c <= 43071 || c >= 43124 && c <= 43137 || c >= 43188 && c <= 43215 || c >= 43226 && c <= 43249 || c >= 43256 && c <= 43258 || c >= 43260 && c <= 43263 || c >= 43302 && c <= 43311 || c >= 43335 && c <= 43359 || c >= 43389 && c <= 43395 || c >= 43443 && c <= 43470 || c >= 43482 && c <= 43519 || c >= 43561 && c <= 43583 || c === 43587 || c >= 43596 && c <= 43599 || c >= 43610 && c <= 43615 || c >= 43639 && c <= 43641 || c >= 43643 && c <= 43647 || c === 43696 || c >= 43698 && c <= 43700 || c === 43703 || c === 43704 || c === 43710 || c === 43711 || c === 43713 || c >= 43715 && c <= 43738 || c >= 43742 && c <= 43967 || c >= 44003 && c <= 44015 || c >= 44026 && c <= 44031 || c >= 55204 && c <= 55215 || c >= 55239 && c <= 55242 || c >= 55292 && c <= 63743 || c === 64046 || c === 64047 || c === 64110 || c === 64111 || c >= 64218 && c <= 64255 || c >= 64263 && c <= 64274 || c >= 64280 && c <= 64284 || c === 64286 || c === 64297 || c === 64311 || c === 64317 || c === 64319 || c === 64322 || c === 64325 || c >= 64434 && c <= 64466 || c >= 64830 && c <= 64847 || c === 64912 || c === 64913 || c >= 64968 && c <= 65007 || c >= 65020 && c <= 65135 || c === 65141 || c >= 65277 && c <= 65295 || c >= 65306 && c <= 65312 || c >= 65339 && c <= 65344 || c >= 65371 && c <= 65381 || c >= 65471 && c <= 65473 || c === 65480 || c === 65481 || c === 65488 || c === 65489 || c === 65496 || c === 65497 || c >= 65501 && c <= 65535) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("symbolic");
      return false;
    }
  })));
  DoubleQuote = cache(named("DoubleQuote", named("'\"'", function (o) {
    if (o.data.charCodeAt(o.index) === 34) {
      o.index = __num(o.index) + 1;
      return 34;
    } else {
      o.fail("'\"'");
      return false;
    }
  })));
  SingleQuote = cache(named("SingleQuote", named("\"'\"", function (o) {
    if (o.data.charCodeAt(o.index) === 39) {
      o.index = __num(o.index) + 1;
      return 39;
    } else {
      o.fail("\"'\"");
      return false;
    }
  })));
  TripleDoubleQuote = cache(named("TripleDoubleQuote", (function () {
    var _rule;
    _rule = named(
      __strnum((DoubleQuote != null ? DoubleQuote.parserName : void 0) || "DoubleQuote") + "{3}",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = DoubleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (__num(result.length) >= 3) {
            break;
          }
        }
        if (__num(result.length) >= 3) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return '"""';
        }
      }
    );
  }())));
  TripleSingleQuote = cache(named("TripleSingleQuote", (function () {
    var _rule;
    _rule = named(
      __strnum((SingleQuote != null ? SingleQuote.parserName : void 0) || "SingleQuote") + "{3}",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = SingleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (__num(result.length) >= 3) {
            break;
          }
        }
        if (__num(result.length) >= 3) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return "'''";
        }
      }
    );
  }())));
  SemicolonChar = cache(named("SemicolonChar", named('";"', function (o) {
    if (o.data.charCodeAt(o.index) === 59) {
      o.index = __num(o.index) + 1;
      return 59;
    } else {
      o.fail('";"');
      return false;
    }
  })));
  Semicolon = cache(named("Semicolon", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = SemicolonChar(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  Asterix = cache(named("Asterix", named('"*"', function (o) {
    if (o.data.charCodeAt(o.index) === 42) {
      o.index = __num(o.index) + 1;
      return 42;
    } else {
      o.fail('"*"');
      return false;
    }
  })));
  OpenParenthesisChar = cache(named("OpenParenthesisChar", named('"("', function (o) {
    if (o.data.charCodeAt(o.index) === 40) {
      o.index = __num(o.index) + 1;
      return 40;
    } else {
      o.fail('"("');
      return false;
    }
  })));
  OpenParenthesis = cache(named("OpenParenthesis", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = OpenParenthesisChar(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  CloseParenthesis = cache(named("CloseParenthesis", (function () {
    var _rule;
    _rule = named('")"', function (o) {
      if (o.data.charCodeAt(o.index) === 41) {
        o.index = __num(o.index) + 1;
        return 41;
      } else {
        o.fail('")"');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  OpenSquareBracketChar = cache(named("OpenSquareBracketChar", named('"["', function (o) {
    if (o.data.charCodeAt(o.index) === 91) {
      o.index = __num(o.index) + 1;
      return 91;
    } else {
      o.fail('"["');
      return false;
    }
  })));
  OpenSquareBracket = cache(named("OpenSquareBracket", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = OpenSquareBracketChar(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  CloseSquareBracket = cache(named("CloseSquareBracket", (function () {
    var _rule;
    _rule = named('"]"', function (o) {
      if (o.data.charCodeAt(o.index) === 93) {
        o.index = __num(o.index) + 1;
        return 93;
      } else {
        o.fail('"]"');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  OpenCurlyBrace = cache(named("OpenCurlyBrace", (function () {
    var _rule;
    _rule = named('"{"', function (o) {
      if (o.data.charCodeAt(o.index) === 123) {
        o.index = __num(o.index) + 1;
        return 123;
      } else {
        o.fail('"{"');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  CloseCurlyBrace = cache(named("CloseCurlyBrace", (function () {
    var _rule;
    _rule = named('"}"', function (o) {
      if (o.data.charCodeAt(o.index) === 125) {
        o.index = __num(o.index) + 1;
        return 125;
      } else {
        o.fail('"}"');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  Backslash = cache(named("Backslash", named('"\\\\"', function (o) {
    if (o.data.charCodeAt(o.index) === 92) {
      o.index = __num(o.index) + 1;
      return 92;
    } else {
      o.fail('"\\\\"');
      return false;
    }
  })));
  Comma = cache(named("Comma", (function () {
    var _rule;
    _rule = named('","', function (o) {
      if (o.data.charCodeAt(o.index) === 44) {
        o.index = __num(o.index) + 1;
        return 44;
      } else {
        o.fail('","');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  MaybeComma = cache(named("MaybeComma", named(
    __strnum((Comma != null ? Comma.parserName : void 0) || "Comma") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = Comma(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  CommaOrNewline = cache(named("CommaOrNewline", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = Comma(clone)) && EmptyLines(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return function (o) {
      return _rule(o) || SomeEmptyLines(o);
    };
  }())));
  SomeEmptyLinesWithCheckIndent = cache(named("SomeEmptyLinesWithCheckIndent", function (o) {
    var clone;
    clone = o.clone();
    if (SomeEmptyLines(clone) && CheckIndent(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  CommaOrNewlineWithCheckIndent = cache(named("CommaOrNewlineWithCheckIndent", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = named(
        __strnum((SomeEmptyLinesWithCheckIndent != null ? SomeEmptyLinesWithCheckIndent.parserName : void 0) || "SomeEmptyLinesWithCheckIndent") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = SomeEmptyLinesWithCheckIndent(clone);
          if (!result) {
            return true;
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = Comma(clone)) && _rule2(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return _rule(o) || SomeEmptyLinesWithCheckIndent(o);
    };
  }())));
  MaybeCommaOrNewline = cache(named("MaybeCommaOrNewline", named(
    __strnum((CommaOrNewline != null ? CommaOrNewline.parserName : void 0) || "CommaOrNewline") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = CommaOrNewline(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  NamePart = cache(named("NamePart", (function () {
    var _rule;
    _rule = named(
      __strnum((NameChar != null ? NameChar.parserName : void 0) || "NameChar") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = NameChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = NameStart(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        return [x.head].concat(__toArray(x.tail));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  NamePartWithNumbers = cache(named("NamePartWithNumbers", named(
    __strnum((NameChar != null ? NameChar.parserName : void 0) || "NameChar") + "+",
    function (o) {
      var clone, item, result;
      clone = o.clone();
      result = [];
      for (; ; ) {
        item = NameChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      if (__num(result.length) >= 1) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  )));
  fromCharCode = (function () {
    var f;
    f = String.fromCharCode;
    return function (x) {
      if (x === -1) {
        return "\u0000";
      } else {
        return f(x);
      }
    };
  }());
  function processCharCodes(codes, array) {
    var _i, _len, v;
    if (array == void 0) {
      array = [];
    }
    for (_i = 0, _len = __num(codes.length); _i < _len; ++_i) {
      v = codes[_i];
      array.push(fromCharCode(v));
    }
    return array;
  }
  _Name = cache(named("_Name", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Minus(clone) && (result = NamePartWithNumbers(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = NamePart(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        var _arr, _i, _len, part, parts;
        parts = processCharCodes(x.head);
        for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          part = _arr[_i];
          parts.push(fromCharCode(part[0]).toUpperCase());
          processCharCodes(
            __slice(part, 1, void 0),
            parts
          );
        }
        return parts.join("");
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  Name = cache(named("Name", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _Name(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return function (o) {
      var result;
      o.preventFail();
      result = void 0;
      try {
        result = _rule(o);
      } finally {
        o.unpreventFail();
      }
      if (result) {
        return result;
      } else {
        o.fail("name");
        return false;
      }
    };
  }())));
  _Symbol = cache(named("_Symbol", (function () {
    var _rule;
    _rule = named(
      __strnum((SymbolChar != null ? SymbolChar.parserName : void 0) || "SymbolChar") + "+",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = SymbolChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        if (__num(result.length) >= 1) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    function _mutator(x) {
      return processCharCodes(x).join("");
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  Symbol = cache(named("Symbol", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _Symbol(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return function (o) {
      var result;
      o.preventFail();
      result = void 0;
      try {
        result = _rule(o);
      } finally {
        o.unpreventFail();
      }
      if (result) {
        return result;
      } else {
        o.fail("symbol");
        return false;
      }
    };
  }())));
  _NameOrSymbol = (function () {
    function _rule(o) {
      return _Name(o) || _Symbol(o);
    }
    return (function () {
      var _rule2;
      _rule2 = named(
        __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "+",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          if (__num(result.length) >= 1) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
      );
      function _mutator(x) {
        return x.join("");
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }());
  function NameOrSymbol(o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = _NameOrSymbol(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  AnyChar = cache(named("AnyChar", function (o) {
    var data, index;
    data = o.data;
    index = o.index;
    if (!__lt(index, data.length)) {
      o.fail("any");
      return false;
    } else {
      ++o.index;
      return o.data.charCodeAt(index);
    }
  } || -1));
  ThisLiteral = cache(named("ThisLiteral", word("this", function (x, o, i) {
    return o["this"](i);
  })));
  ThisShorthandLiteral = cache(named("ThisShorthandLiteral", (function () {
    function _rule(o) {
      var clone;
      clone = o.clone();
      if (Space(clone) && AtSign(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o["this"](i);
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  ThisOrShorthandLiteral = cache(named("ThisOrShorthandLiteral", function (o) {
    return ThisLiteral(o) || ThisShorthandLiteral(o);
  }));
  ThisOrShorthandLiteralPeriod = cache(named("ThisOrShorthandLiteralPeriod", (function () {
    var _rule2;
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = ThisLiteral(clone)) && Period(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    _rule2 = (function () {
      var _rule3;
      _rule3 = named(
        __strnum((Period != null ? Period.parserName : void 0) || "Period") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = Period(clone);
          if (!result) {
            return true;
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = ThisShorthandLiteral(clone)) && _rule3(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }())));
  RawDecimalDigits = cache(named("RawDecimalDigits", named(
    __strnum((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "DecimalDigit") + "+",
    function (o) {
      var clone, item, result;
      clone = o.clone();
      result = [];
      for (; ; ) {
        item = DecimalDigit(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      if (__num(result.length) >= 1) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  )));
  DecimalDigits = cache(named("DecimalDigits", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = named(
          __strnum((Underscore != null ? Underscore.parserName : void 0) || "Underscore") + "+",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = Underscore(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            if (__num(result.length) >= 1) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
        );
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule3(clone) && (result = RawDecimalDigits(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = RawDecimalDigits(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        var _arr, _i, _len, part, parts;
        parts = processCharCodes(x.head);
        for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          part = _arr[_i];
          processCharCodes(part, parts);
        }
        return parts.join("");
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  DecimalNumber = cache(named("DecimalNumber", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = (function () {
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Period(clone) && (result = DecimalDigits(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return "." + __strnum(x);
        }
        return named(
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = named(
          __strnum((PlusOrMinus != null ? PlusOrMinus.parserName : void 0) || "PlusOrMinus") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = PlusOrMinus(clone);
            if (!result) {
              if (typeof NOTHING === "function") {
                return NOTHING(void 0, o, index, line);
              } else {
                return NOTHING;
              }
            } else {
              o.update(clone);
              return result;
            }
          }
        );
        return (function () {
          function _rule6(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.e = eE(clone)) && (result.op = _rule5(clone)) && (result.digits = DecimalDigits(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return __strnum(fromCharCode(x.e)) + __strnum(x.op !== NOTHING ? fromCharCode(x.op) : "") + __strnum(x.digits);
          }
          return named(
            (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule6(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      function _rule4(o) {
        var clone;
        clone = o.clone();
        if (Underscore(clone) && NamePart(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            return true;
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.integer = DecimalDigits(clone)) && (result.decimal = _rule(clone)) && (result.scientific = _rule2(clone)) && _rule3(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var decimal, scientific, text, value;
        decimal = x.decimal;
        scientific = x.scientific;
        if (decimal === NOTHING) {
          decimal = "";
        }
        if (scientific === NOTHING) {
          scientific = "";
        }
        text = __strnum(x.integer) + __strnum(decimal) + __strnum(scientific);
        value = Number(text);
        if (!isFinite(value)) {
          o.error("Unable to parse number: " + __strnum(text));
        }
        return o["const"](i, value);
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  function makeRadixInteger(radix, separator, digit) {
    var digits;
    digits = (function () {
      var _rule, _rule2;
      _rule = named(
        __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = digit(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          if (__num(result.length) >= 1) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
      );
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          var _rule4, _rule5;
          _rule4 = named(
            __strnum((Underscore != null ? Underscore.parserName : void 0) || "Underscore") + "+",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = Underscore(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (__num(result.length) >= 1) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
          );
          _rule5 = named(
            __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = digit(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (__num(result.length) >= 1) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
          );
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_rule4(clone) && (result = _rule5(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        return named(
          __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = _rule3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            o.update(clone);
            return result;
          }
        );
      }());
      return (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = _rule(clone)) && (result.tail = _rule2(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          var _arr, _i, _len, part, parts;
          parts = processCharCodes(x.head);
          for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            part = _arr[_i];
            processCharCodes(part, parts);
          }
          return parts.join("");
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return (function () {
      var _rule;
      _rule = (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Period(clone) && (result = digits(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(
          __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = _rule2(clone);
            if (!result) {
              if (typeof NOTHING === "function") {
                return NOTHING(void 0, o, index, line);
              } else {
                return NOTHING;
              }
            } else {
              o.update(clone);
              return result;
            }
          }
        );
      }());
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (Zero(clone) && (result.separator = separator(clone)) && (result.integer = digits(clone)) && (result.decimal = _rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var decimal, decimalNum, decimalText, integer, value;
          integer = x.integer;
          decimal = x.decimal;
          if (decimal === NOTHING) {
            decimal = "";
          }
          value = parseInt(integer, radix);
          if (!isFinite(value)) {
            decimalText = decimal ? "." + __strnum(decimal) : "";
            o.error("Unable to parse number: 0" + __strnum(fromCharCode(x.separator)) + __strnum(integer) + __strnum(decimalText));
          }
          if (decimal) {
            for (; ; ) {
              decimalNum = parseInt(decimal, radix);
              if (isFinite(decimalNum)) {
                value = __num(value) + __num(decimalNum) / Math.pow(__num(radix), __num(decimal.length));
                break;
              } else {
                decimal = decimal.slice(0, -1);
              }
            }
          }
          return o["const"](i, value);
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
  }
  HexInteger = cache(named("HexInteger", makeRadixInteger(
    16,
    named("[Xx]", function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 88 || c === 120) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail("[Xx]");
        return false;
      }
    }),
    HexDigit
  )));
  OctalInteger = cache(named("OctalInteger", makeRadixInteger(
    8,
    named("[Oo]", function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 79 || c === 111) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail("[Oo]");
        return false;
      }
    }),
    OctalDigit
  )));
  BinaryInteger = cache(named("BinaryInteger", makeRadixInteger(
    2,
    named("[Bb]", function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 66 || c === 98) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail("[Bb]");
        return false;
      }
    }),
    BinaryDigit
  )));
  RadixInteger = cache(named("RadixInteger", (function () {
    var GetDigits, Radix;
    GetDigits = (function () {
      var digitCache;
      digitCache = [];
      return function (radix) {
        var _ref;
        if ((_ref = digitCache[radix]) == null) {
          return digitCache[radix] = (function () {
            var digit;
            digit = (function () {
              var _end, chars, i;
              switch (radix) {
              case 2:
                return BinaryDigit;
              case 8:
                return OctalDigit;
              case 10:
                return DecimalDigit;
              case 16:
                return HexDigit;
              default:
                chars = [];
                for (i = 0, _end = __num(__num(radix) > 10 ? radix : 10); i < _end; ++i) {
                  chars[__num(i) + 48] = true;
                }
                for (i = 10, _end = __num(__num(radix) > 36 ? radix : 36); i < _end; ++i) {
                  chars[__num(i) - 10 + 97] = true;
                  chars[__num(i) - 10 + 65] = true;
                }
                return function (o) {
                  var c;
                  c = o.data.charCodeAt(o.index);
                  if (chars[c]) {
                    o.index = __num(o.index) + 1;
                    return c;
                  } else {
                    return false;
                  }
                };
              }
            }());
            return (function () {
              var _rule, _rule2;
              _rule = named(
                __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
                function (o) {
                  var clone, item, result;
                  clone = o.clone();
                  result = [];
                  for (; ; ) {
                    item = digit(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  if (__num(result.length) >= 1) {
                    o.update(clone);
                    return result;
                  } else {
                    return false;
                  }
                }
              );
              _rule2 = (function () {
                var _rule3;
                _rule3 = (function () {
                  var _rule4, _rule5;
                  _rule4 = named(
                    __strnum((Underscore != null ? Underscore.parserName : void 0) || "Underscore") + "+",
                    function (o) {
                      var clone, item, result;
                      clone = o.clone();
                      result = [];
                      for (; ; ) {
                        item = Underscore(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      if (__num(result.length) >= 1) {
                        o.update(clone);
                        return result;
                      } else {
                        return false;
                      }
                    }
                  );
                  _rule5 = named(
                    __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
                    function (o) {
                      var clone, item, result;
                      clone = o.clone();
                      result = [];
                      for (; ; ) {
                        item = digit(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      if (__num(result.length) >= 1) {
                        o.update(clone);
                        return result;
                      } else {
                        return false;
                      }
                    }
                  );
                  return function (o) {
                    var clone, result;
                    clone = o.clone();
                    result = void 0;
                    if (_rule4(clone) && (result = _rule5(clone))) {
                      o.update(clone);
                      return result;
                    } else {
                      return false;
                    }
                  };
                }());
                return named(
                  __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
                  function (o) {
                    var clone, item, result;
                    clone = o.clone();
                    result = [];
                    for (; ; ) {
                      item = _rule3(clone);
                      if (!item) {
                        break;
                      }
                      result.push(item);
                    }
                    o.update(clone);
                    return result;
                  }
                );
              }());
              return (function () {
                function _rule3(o) {
                  var clone, result;
                  clone = o.clone();
                  result = {};
                  if ((result.head = _rule(clone)) && (result.tail = _rule2(clone))) {
                    o.update(clone);
                    return result;
                  } else {
                    return false;
                  }
                }
                function _mutator(x) {
                  var _arr, _i, _len, part, parts;
                  parts = processCharCodes(x.head);
                  for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
                    part = _arr[_i];
                    processCharCodes(part, parts);
                  }
                  return parts.join("");
                }
                return named(
                  (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
                  function (o) {
                    var index, line, result;
                    index = o.index;
                    line = o.line;
                    result = _rule3(o);
                    if (!result) {
                      return false;
                    } else if (typeof _mutator === "function") {
                      return _mutator(result, o, index, line);
                    } else if (_mutator !== void 0) {
                      return _mutator;
                    } else {
                      return result;
                    }
                  }
                );
              }());
            }());
          }());
        } else {
          return _ref;
        }
      };
    }());
    Radix = named(
      __strnum((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "DecimalDigit") + "{1,2}",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = DecimalDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (__num(result.length) >= 2) {
            break;
          }
        }
        if (__num(result.length) >= 1) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    return function (o) {
      var clone, decimal, decimalNum, digits, integer, radix, radixNum, startIndex, subClone, value;
      startIndex = o.index;
      clone = o.clone();
      radix = Radix(clone);
      if (!radix) {
        return false;
      }
      radix = processCharCodes(radix).join("");
      if (!LowerR(clone)) {
        return false;
      }
      radixNum = Number(radix);
      if (!isFinite(radixNum)) {
        o.error("Unable to parse radix: " + __strnum(radix));
      } else if (__num(radixNum) < 2 || __num(radixNum) > 36) {
        o.error("Radix must be at least 2 and at most 36, not " + __strnum(radixNum));
      }
      digits = GetDigits(radixNum);
      integer = digits(clone);
      if (!integer) {
        return false;
      }
      value = parseInt(integer, radixNum);
      if (!isFinite(value)) {
        o.error("Unable to parse number: " + __strnum(radixNum) + "r" + __strnum(integer));
      }
      subClone = clone.clone();
      if (Period(subClone)) {
        decimal = digits(subClone);
        if (decimal) {
          clone.update(subClone);
          for (; ; ) {
            decimalNum = parseInt(decimal, radixNum);
            if (decimalNum !== decimalNum) {
              o.error("Unable to parse number: " + __strnum(radixNum) + "r" + __strnum(integer) + "." + __strnum(decimal));
            } else if (isFinite(decimalNum)) {
              value = __num(value) + __num(decimalNum) / Math.pow(__num(radixNum), __num(decimal.length));
              break;
            } else {
              decimal = decimal.slice(0, -1);
            }
          }
        }
      }
      o.update(clone);
      return o["const"](startIndex, value);
    };
  }())));
  NumberLiteral = cache(named("NumberLiteral", (function () {
    function _rule(o) {
      return HexInteger(o) || OctalInteger(o) || BinaryInteger(o) || RadixInteger(o) || DecimalNumber(o);
    }
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  function makeConstLiteral(name, value) {
    return word(name, function (x, o, i) {
      return o["const"](i, value);
    });
  }
  NullLiteral = cache(named("NullLiteral", makeConstLiteral("null", null)));
  VoidLiteral = cache(named("VoidLiteral", (function () {
    var _rule, _rule2;
    _rule = makeConstLiteral("undefined", void 0);
    _rule2 = makeConstLiteral("void", void 0);
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }())));
  InfinityLiteral = cache(named("InfinityLiteral", makeConstLiteral("Infinity", 1/0)));
  NaNLiteral = cache(named("NaNLiteral", makeConstLiteral("NaN", 0/0)));
  TrueLiteral = cache(named("TrueLiteral", makeConstLiteral("true", true)));
  FalseLiteral = cache(named("FalseLiteral", makeConstLiteral("false", false)));
  SimpleConstantLiteral = cache(named("SimpleConstantLiteral", function (o) {
    return NullLiteral(o) || VoidLiteral(o) || InfinityLiteral(o) || NaNLiteral(o) || TrueLiteral(o) || FalseLiteral(o);
  }));
  HexEscapeSequence = cache(named("HexEscapeSequence", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named(
        __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "HexDigit") + "{2}",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (__num(result.length) >= 2) {
              break;
            }
          }
          if (__num(result.length) >= 2) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
      );
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (LowerX(clone) && (result = _rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return parseInt(processCharCodes(x).join(""), 16) || -1;
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!LowerX(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  UnicodeEscapeSequence = cache(named("UnicodeEscapeSequence", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named(
        __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "HexDigit") + "{4}",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (__num(result.length) >= 4) {
              break;
            }
          }
          if (__num(result.length) >= 4) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
      );
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (LowerU(clone) && (result = _rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return parseInt(processCharCodes(x).join(""), 16) || -1;
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!LowerU(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  SingleEscapeCharacter = cache(named("SingleEscapeCharacter", (function () {
    var ESCAPED_CHARACTERS;
    ESCAPED_CHARACTERS = {
      98: 8,
      102: 12,
      114: 13,
      110: 10,
      116: 9,
      118: 11,
      48: -1,
      49: 1,
      50: 2,
      51: 3,
      52: 4,
      53: 5,
      54: 6,
      55: 7
    };
    return (function () {
      function _mutator(c) {
        if (__owns(ESCAPED_CHARACTERS, c)) {
          return ESCAPED_CHARACTERS[c];
        } else {
          return c;
        }
      }
      return named(
        (AnyChar != null ? AnyChar.parserName : void 0) || "AnyChar",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = AnyChar(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  EscapeSequence = cache(named("EscapeSequence", function (o) {
    return HexEscapeSequence(o) || UnicodeEscapeSequence(o) || SingleEscapeCharacter(o);
  }));
  BackslashEscapeSequence = cache(named("BackslashEscapeSequence", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Backslash(clone) && (result = EscapeSequence(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  StringInterpolation = cache(named("StringInterpolation", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (OpenParenthesisChar(clone) && (result = ExpressionOrNothing(clone)) && CloseParenthesis(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return function (o) {
          return Identifier(o) || _rule2(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DollarSign(clone) && (result = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!DollarSign(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  SingleStringLiteral = cache(named("SingleStringLiteral", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = (function () {
        var _rule2;
        _rule2 = (function () {
          var _rule3;
          _rule3 = (function () {
            var _rule4;
            _rule4 = (function () {
              function _rule5(o) {
                return SingleQuote(o) || Newline(o);
              }
              return named(
                "!" + __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>"),
                function (o) {
                  return !_rule5(o.clone());
                }
              );
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_rule4(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return BackslashEscapeSequence(o) || _rule3(o);
          };
        }());
        return named(
          __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = _rule2(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            o.update(clone);
            return result;
          }
        );
      }());
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (SingleQuote(clone) && (result = _rule(clone)) && SingleQuote(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o["const"](i, processCharCodes(x).join(""));
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!SingleQuote(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  DoubleStringLiteral = cache(named("DoubleStringLiteral", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = (function () {
        var _rule2;
        _rule2 = (function () {
          var _rule3;
          _rule3 = (function () {
            var _rule4;
            _rule4 = (function () {
              function _rule5(o) {
                return DoubleQuote(o) || Newline(o);
              }
              return named(
                "!" + __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>"),
                function (o) {
                  return !_rule5(o.clone());
                }
              );
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_rule4(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return BackslashEscapeSequence(o) || StringInterpolation(o) || _rule3(o);
          };
        }());
        return named(
          __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = _rule2(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            o.update(clone);
            return result;
          }
        );
      }());
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (DoubleQuote(clone) && (result = _rule(clone)) && DoubleQuote(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var _i, _len, currentLiteral, part, stringParts;
          stringParts = [];
          currentLiteral = [];
          for (_i = 0, _len = __num(x.length); _i < _len; ++_i) {
            part = x[_i];
            if (typeof part === "number") {
              currentLiteral.push(part);
            } else if (!(part instanceof NothingNode)) {
              if (__num(currentLiteral.length) > 0) {
                stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
                currentLiteral = [];
              }
              stringParts.push(part);
            }
          }
          if (__num(currentLiteral.length) > 0) {
            stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
          }
          if (stringParts.length === 0) {
            return o["const"](i, "");
          } else if (stringParts.length === 1 && stringParts[0].isConst() && typeof stringParts[0].constValue() === "string") {
            return stringParts[0];
          } else {
            return o.string(i, stringParts);
          }
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!DoubleQuote(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  StringIndent = cache(named("StringIndent", function (o) {
    var c, clone, count, currentIndent, i;
    clone = o.clone();
    count = 1;
    currentIndent = clone.indent.peek();
    for (; __lt(count, currentIndent); ) {
      c = SpaceChar(clone);
      if (!c) {
        break;
      }
      i = INDENTS[c];
      if (!i) {
        throw Error("Unexpected indent char: " + __str(JSON.stringify(c)));
      }
      count = __num(count) + __num(i);
    }
    if (!__lte(count, currentIndent)) {
      return o.error("Mixed tabs and spaces in string literal");
    } else if (__lt(count, currentIndent) && !Newline(clone.clone())) {
      return false;
    } else {
      o.update(clone);
      return count;
    }
  }));
  TripleSingleStringLine = cache(named("TripleSingleStringLine", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            return TripleSingleQuote(o) || Newline(o);
          }
          return named(
            "!" + __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>"),
            function (o) {
              return !_rule4(o.clone());
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule3(clone) && (result = AnyChar(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return function (o) {
        return BackslashEscapeSequence(o) || _rule2(o);
      };
    }());
    return (function () {
      var _rule2;
      _rule2 = named(
        __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
      function _mutator(x) {
        return [processCharCodes(x).join("").replace(/[\t ]+$/, "")];
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  TripleDoubleStringLine = cache(named("TripleDoubleStringLine", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            return TripleDoubleQuote(o) || Newline(o);
          }
          return named(
            "!" + __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>"),
            function (o) {
              return !_rule4(o.clone());
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule3(clone) && (result = AnyChar(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return function (o) {
        return BackslashEscapeSequence(o) || StringInterpolation(o) || _rule2(o);
      };
    }());
    return (function () {
      var _rule2;
      _rule2 = named(
        __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
      function _mutator(x) {
        var _i, _len, currentLiteral, part, stringParts;
        stringParts = [];
        currentLiteral = [];
        for (_i = 0, _len = __num(x.length); _i < _len; ++_i) {
          part = x[_i];
          if (typeof part === "number") {
            currentLiteral.push(part);
          } else if (!(part instanceof NothingNode)) {
            if (__num(currentLiteral.length) > 0) {
              stringParts.push(processCharCodes(currentLiteral).join(""));
              currentLiteral = [];
            }
            stringParts.push(part);
          }
        }
        if (__num(currentLiteral.length) > 0) {
          stringParts.push(processCharCodes(currentLiteral).join("").replace(/[\t ]+$/, ""));
        }
        return stringParts;
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  function makeTripleString(quote, line) {
    return (function () {
      var _backend;
      _backend = (function () {
        var _rule, _rule2;
        _rule = (function () {
          function _rule3(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_Space(clone) && (result = Newline(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule3(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        _rule2 = (function () {
          var _rule3;
          _rule3 = (function () {
            var _rule4, _rule5;
            _rule4 = (function () {
              var _rule6;
              _rule6 = (function () {
                var _rule7;
                _rule7 = (function () {
                  function _rule8(o) {
                    var clone, result;
                    clone = o.clone();
                    result = void 0;
                    if (Newline(clone) && StringIndent(clone) && (result = line(clone))) {
                      o.update(clone);
                      return result;
                    } else {
                      return false;
                    }
                  }
                  return named(
                    __strnum((_rule8 != null ? _rule8.parserName : void 0) || "<unknown>") + "*",
                    function (o) {
                      var clone, item, result;
                      clone = o.clone();
                      result = [];
                      for (; ; ) {
                        item = _rule8(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      o.update(clone);
                      return result;
                    }
                  );
                }());
                return (function () {
                  function _rule8(o) {
                    var clone, result;
                    clone = o.clone();
                    result = {};
                    if (StringIndent(clone) && (result.head = line(clone)) && (result.tail = _rule7(clone))) {
                      o.update(clone);
                      return result;
                    } else {
                      return false;
                    }
                  }
                  function _mutator(x) {
                    return [x.head].concat(__toArray(x.tail));
                  }
                  return named(
                    (_rule8 != null ? _rule8.parserName : void 0) || "<unknown>",
                    function (o) {
                      var index, line, result;
                      index = o.index;
                      line = o.line;
                      result = _rule8(o);
                      if (!result) {
                        return false;
                      } else if (typeof _mutator === "function") {
                        return _mutator(result, o, index, line);
                      } else if (_mutator !== void 0) {
                        return _mutator;
                      } else {
                        return result;
                      }
                    }
                  );
                }());
              }());
              function _missing2() {
                return [];
              }
              return named(
                __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "?",
                function (o) {
                  var clone, index, line, result;
                  index = o.index;
                  line = o.line;
                  clone = o.clone();
                  result = _rule6(clone);
                  if (!result) {
                    if (typeof _missing2 === "function") {
                      return _missing2(void 0, o, index, line);
                    } else {
                      return _missing2;
                    }
                  } else {
                    o.update(clone);
                    return result;
                  }
                }
              );
            }());
            _rule5 = named(
              __strnum((Newline != null ? Newline.parserName : void 0) || "Newline") + "?",
              function (o) {
                var clone, index, line, result;
                index = o.index;
                line = o.line;
                clone = o.clone();
                result = Newline(clone);
                if (!result) {
                  return true;
                } else {
                  o.update(clone);
                  return result;
                }
              }
            );
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (MaybeAdvance(clone) && (result = _rule4(clone)) && _rule5(clone) && PopIndent(clone)) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          function _missing() {
            return [];
          }
          return named(
            __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = _rule3(clone);
              if (!result) {
                if (typeof _missing === "function") {
                  return _missing(void 0, o, index, line);
                } else {
                  return _missing;
                }
              } else {
                o.update(clone);
                return result;
              }
            }
          );
        }());
        return (function () {
          function _rule3(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if (quote(clone) && (result.first = line(clone)) && (result.emptyLines = _rule(clone)) && (result.rest = _rule2(clone)) && quote(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x, o, i) {
            var _end, _len, j, len, line, lines, part, stringParts;
            lines = [x.first];
            if (lines[0].length === 0 || lines[0].length === 1 && lines[0][0] === "") {
              lines.shift();
            }
            for (j = 1, _end = __num(x.emptyLines.length); j < _end; ++j) {
              lines.push([""]);
            }
            lines.push.apply(lines, __toArray(x.rest));
            len = lines.length;
            if (__num(len) > 0 && (lines[__num(len) - 1].length === 0 || lines[__num(len) - 1].length === 1 && lines[__num(len) - 1][0] === "")) {
              lines.pop();
              len = __num(len) - 1;
            }
            stringParts = [];
            for (j = 0, _len = __num(lines.length); j < _len; ++j) {
              line = lines[j];
              if (__num(j) > 0) {
                stringParts.push("\n");
              }
              stringParts.push.apply(stringParts, __toArray(line));
            }
            for (j = __num(stringParts.length) - 2, -1; j >= 0; j -= 1) {
              if (typeof stringParts[j] === "string" && typeof stringParts[__num(j) + 1] === "string") {
                stringParts.splice(j, 2, "" + stringParts[j] + stringParts[__num(j) + 1]);
              }
            }
            for (j = 0, _len = __num(stringParts.length); j < _len; ++j) {
              part = stringParts[j];
              if (typeof part === "string") {
                stringParts[j] = o["const"](i, part);
              }
            }
            if (stringParts.length === 0) {
              return o["const"](i, "");
            } else if (stringParts.length === 1 && stringParts[0].isConst() && typeof stringParts[0].constValue() === "string") {
              return stringParts[0];
            } else {
              return o.string(i, stringParts);
            }
          }
          return named(
            (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule3(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!quote(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
  }
  TripleSingleStringLiteral = cache(named("TripleSingleStringLiteral", makeTripleString(TripleSingleQuote, TripleSingleStringLine)));
  TripleDoubleStringLiteral = cache(named("TripleDoubleStringLiteral", makeTripleString(TripleDoubleQuote, TripleDoubleStringLine)));
  LowerR = cache(named("LowerR", named('"r"', function (o) {
    if (o.data.charCodeAt(o.index) === 114) {
      o.index = __num(o.index) + 1;
      return 114;
    } else {
      o.fail('"r"');
      return false;
    }
  })));
  RegexTripleSingleToken = cache(named("RegexTripleSingleToken", function (o) {
    var clone;
    clone = o.clone();
    if (LowerR(clone) && TripleSingleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  RegexTripleDoubleToken = cache(named("RegexTripleDoubleToken", function (o) {
    var clone;
    clone = o.clone();
    if (LowerR(clone) && TripleDoubleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  RegexSingleToken = cache(named("RegexSingleToken", function (o) {
    var clone;
    clone = o.clone();
    if (LowerR(clone) && SingleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  RegexDoubleToken = cache(named("RegexDoubleToken", function (o) {
    var clone;
    clone = o.clone();
    if (LowerR(clone) && DoubleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  RegexFlags = cache(named("RegexFlags", (function () {
    function _missing() {
      return [];
    }
    return named(
      __strnum((NamePart != null ? NamePart.parserName : void 0) || "NamePart") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = NamePart(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index, line);
          } else {
            return _missing;
          }
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }())));
  RegexComment = cache(named("RegexComment", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = named(
          "!" + __strnum((Newline != null ? Newline.parserName : void 0) || "Newline"),
          function (o) {
            return !Newline(o.clone());
          }
        );
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule3(clone) && (result = AnyChar(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone;
        clone = o.clone();
        if (HashSign(clone) && _rule(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof NOTHING === "function") {
            return NOTHING(result, o, index, line);
          } else if (NOTHING !== void 0) {
            return NOTHING;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  RegexLiteral = cache(named("RegexLiteral", (function () {
    var _rule, _rule2, _rule3, _rule4;
    _rule = (function () {
      var _backend;
      _backend = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule10, _rule7, _rule8, _rule9;
            _rule7 = (function () {
              function _rule11(o) {
                var clone;
                clone = o.clone();
                if (Backslash(clone) && DollarSign(clone)) {
                  o.update(clone);
                  return true;
                } else {
                  return false;
                }
              }
              return named(
                (_rule11 != null ? _rule11.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule11(o);
                  if (!result) {
                    return false;
                  } else {
                    return 36;
                  }
                }
              );
            }());
            _rule8 = named(
              (SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = SpaceChar(o);
                if (!result) {
                  return false;
                } else if (typeof NOTHING === "function") {
                  return NOTHING(result, o, index, line);
                } else if (NOTHING !== void 0) {
                  return NOTHING;
                } else {
                  return result;
                }
              }
            );
            _rule9 = named(
              (Newline != null ? Newline.parserName : void 0) || "Newline",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = Newline(o);
                if (!result) {
                  return false;
                } else if (typeof NOTHING === "function") {
                  return NOTHING(result, o, index, line);
                } else if (NOTHING !== void 0) {
                  return NOTHING;
                } else {
                  return result;
                }
              }
            );
            _rule10 = (function () {
              var _rule11;
              _rule11 = named(
                "!" + __strnum((TripleDoubleQuote != null ? TripleDoubleQuote.parserName : void 0) || "TripleDoubleQuote"),
                function (o) {
                  return !TripleDoubleQuote(o.clone());
                }
              );
              return function (o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (_rule11(clone) && (result = AnyChar(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              };
            }());
            return function (o) {
              return _rule7(o) || _rule8(o) || _rule9(o) || RegexComment(o) || StringInterpolation(o) || _rule10(o);
            };
          }());
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule6(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (RegexTripleDoubleToken(clone) && (result.text = _rule5(clone)) && TripleDoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!RegexTripleDoubleToken(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _backend;
      _backend = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7, _rule8, _rule9;
            _rule7 = named(
              (SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = SpaceChar(o);
                if (!result) {
                  return false;
                } else if (typeof NOTHING === "function") {
                  return NOTHING(result, o, index, line);
                } else if (NOTHING !== void 0) {
                  return NOTHING;
                } else {
                  return result;
                }
              }
            );
            _rule8 = named(
              (Newline != null ? Newline.parserName : void 0) || "Newline",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = Newline(o);
                if (!result) {
                  return false;
                } else if (typeof NOTHING === "function") {
                  return NOTHING(result, o, index, line);
                } else if (NOTHING !== void 0) {
                  return NOTHING;
                } else {
                  return result;
                }
              }
            );
            _rule9 = (function () {
              var _rule10;
              _rule10 = named(
                "!" + __strnum((TripleSingleQuote != null ? TripleSingleQuote.parserName : void 0) || "TripleSingleQuote"),
                function (o) {
                  return !TripleSingleQuote(o.clone());
                }
              );
              return function (o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (_rule10(clone) && (result = AnyChar(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              };
            }());
            return function (o) {
              return _rule7(o) || _rule8(o) || RegexComment(o) || _rule9(o);
            };
          }());
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule6(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (RegexTripleSingleToken(clone) && (result.text = _rule5(clone)) && TripleSingleQuote(clone) && (result.flags = RegexFlags(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!RegexTripleDoubleToken(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      var _backend;
      _backend = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7, _rule8, _rule9;
            _rule7 = (function () {
              function _rule10(o) {
                var clone;
                clone = o.clone();
                if (DoubleQuote(clone) && DoubleQuote(clone)) {
                  o.update(clone);
                  return true;
                } else {
                  return false;
                }
              }
              return named(
                (_rule10 != null ? _rule10.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule10(o);
                  if (!result) {
                    return false;
                  } else {
                    return 34;
                  }
                }
              );
            }());
            _rule8 = (function () {
              function _rule10(o) {
                var clone;
                clone = o.clone();
                if (Backslash(clone) && DollarSign(clone)) {
                  o.update(clone);
                  return true;
                } else {
                  return false;
                }
              }
              return named(
                (_rule10 != null ? _rule10.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule10(o);
                  if (!result) {
                    return false;
                  } else {
                    return 36;
                  }
                }
              );
            }());
            _rule9 = (function () {
              var _rule10;
              _rule10 = (function () {
                function _rule11(o) {
                  return DoubleQuote(o) || Newline(o) || DollarSign(o);
                }
                return named(
                  "!" + __strnum((_rule11 != null ? _rule11.parserName : void 0) || "<unknown>"),
                  function (o) {
                    return !_rule11(o.clone());
                  }
                );
              }());
              return function (o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (_rule10(clone) && (result = AnyChar(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              };
            }());
            return function (o) {
              return _rule7(o) || _rule8(o) || _rule9(o) || StringInterpolation(o);
            };
          }());
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule6(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (RegexDoubleToken(clone) && (result.text = _rule5(clone)) && DoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!RegexDoubleToken(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
    _rule4 = (function () {
      var _backend;
      _backend = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7, _rule8;
            _rule7 = (function () {
              function _rule9(o) {
                var clone;
                clone = o.clone();
                if (SingleQuote(clone) && SingleQuote(clone)) {
                  o.update(clone);
                  return true;
                } else {
                  return false;
                }
              }
              return named(
                (_rule9 != null ? _rule9.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule9(o);
                  if (!result) {
                    return false;
                  } else {
                    return 39;
                  }
                }
              );
            }());
            _rule8 = (function () {
              var _rule9;
              _rule9 = (function () {
                function _rule10(o) {
                  return SingleQuote(o) || Newline(o);
                }
                return named(
                  "!" + __strnum((_rule10 != null ? _rule10.parserName : void 0) || "<unknown>"),
                  function (o) {
                    return !_rule10(o.clone());
                  }
                );
              }());
              return function (o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (_rule9(clone) && (result = AnyChar(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              };
            }());
            return function (o) {
              return _rule7(o) || _rule8(o);
            };
          }());
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule6(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (RegexSingleToken(clone) && (result.text = _rule5(clone)) && SingleQuote(clone) && (result.flags = RegexFlags(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!RegexSingleToken(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule5(o) {
        return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o);
      }
      function _mutator(x, o, i) {
        var _arr, _i, _len, currentLiteral, flags, part, stringParts, text;
        stringParts = [];
        currentLiteral = [];
        for (_arr = x.text, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          part = _arr[_i];
          if (typeof part === "number") {
            currentLiteral.push(part);
          } else if (part !== NOTHING && !(part instanceof NothingNode)) {
            if (__num(currentLiteral.length) > 0) {
              stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
              currentLiteral = [];
            }
            stringParts.push(part);
          }
        }
        if (__num(currentLiteral.length) > 0) {
          stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
        }
        flags = processCharCodes(x.flags).join("");
        text = stringParts.length === 0 ? o["const"](i, "")
          : stringParts.length === 1 && stringParts[0].isConst() && typeof stringParts[0].constValue() === "string" ? stringParts[0]
          : o.string(i, stringParts);
        return o.regexp(i, text, flags);
      }
      return named(
        (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule5(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  BackslashStringLiteral = cache(named("BackslashStringLiteral", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Backslash(clone) && NoSpace(clone) && (result = IdentifierNameConst(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  StringLiteral = cache(named("StringLiteral", (function () {
    function _rule(o) {
      return BackslashStringLiteral(o) || TripleSingleStringLiteral(o) || TripleDoubleStringLiteral(o) || SingleStringLiteral(o) || DoubleStringLiteral(o) || RegexLiteral(o);
    }
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  ConstantLiteral = cache(named("ConstantLiteral", function (o) {
    return SimpleConstantLiteral(o) || NumberLiteral(o) || StringLiteral(o);
  }));
  ArgumentsLiteral = cache(named("ArgumentsLiteral", word("arguments", function (x, o, i) {
    return o.args(i);
  })));
  Literal = cache(named("Literal", function (o) {
    return ThisOrShorthandLiteral(o) || ArgumentsLiteral(o) || ConstantLiteral(o);
  }));
  IdentifierNameConst = cache(named("IdentifierNameConst", function (o) {
    var index, result;
    index = o.index;
    result = Name(o);
    if (result) {
      return o["const"](index, result);
    } else {
      return false;
    }
  }));
  IdentifierNameConstOrNumberLiteral = cache(named("IdentifierNameConstOrNumberLiteral", function (o) {
    return IdentifierNameConst(o) || NumberLiteral(o);
  }));
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
  Identifier = cache(named("Identifier", function (o) {
    var clone, index, result;
    index = o.index;
    clone = o.clone();
    result = Name(clone);
    if (!result || __in(result, RESERVED_IDENTS) || o.macros.hasMacroOrOperator(result)) {
      o.fail("identifier");
      return false;
    } else {
      o.update(clone);
      return o.ident(index, result);
    }
  }));
  NotToken = cache(named("NotToken", word("not")));
  MaybeNotToken = cache(named("MaybeNotToken", named(
    __strnum((NotToken != null ? NotToken.parserName : void 0) || "NotToken") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = NotToken(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  ExistentialSymbol = cache(named("ExistentialSymbol", (function () {
    var _rule;
    _rule = named('"?"', function (o) {
      if (o.data.charCodeAt(o.index) === 63) {
        o.index = __num(o.index) + 1;
        return 63;
      } else {
        o.fail('"?"');
        return false;
      }
    });
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return "?";
        }
      }
    );
  }())));
  MaybeExistentialSymbol = cache(named("MaybeExistentialSymbol", named(
    __strnum((ExistentialSymbol != null ? ExistentialSymbol.parserName : void 0) || "ExistentialSymbol") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = ExistentialSymbol(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  ExistentialSymbolNoSpace = cache(named("ExistentialSymbolNoSpace", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (NoSpace(clone) && (result = ExistentialSymbol(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  CustomOperatorCloseParenthesis = cache(named("CustomOperatorCloseParenthesis", (function () {
    function handleUnaryOperator(operator, o, i, line) {
      var clone, node, op;
      clone = o.clone();
      op = operator.rule(clone);
      if (op && CloseParenthesis(clone)) {
        o.update(clone);
        node = o.ident(i, "x");
        return o["function"](
          i,
          [o.param(i, node)],
          operator.func(
            { op: op, node: node },
            o,
            i,
            line
          ),
          true,
          false
        );
      }
    }
    return function (o) {
      var _arr, _i, _i2, _len, _len2, _ref, clone, i, inverted, left, line, op, operator, operators, right;
      i = o.index;
      line = o.line;
      for (_arr = o.macros.binaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        operators = _arr[_i];
        if (operators) {
          for (_i2 = 0, _len2 = __num(operators.length); _i2 < _len2; ++_i2) {
            operator = operators[_i2];
            clone = o.clone();
            inverted = false;
            if (operator.invertible) {
              inverted = MaybeNotToken(clone);
              if (!inverted) {
                continue;
              }
            }
            op = operator.rule(clone);
            if (op && CloseParenthesis(clone)) {
              o.update(clone);
              left = o.ident(i, "x");
              right = o.ident(i, "y");
              return o["function"](
                i,
                [
                  o.param(i, left),
                  o.param(i, right)
                ],
                operator.func(
                  { left: left, inverted: inverted === "not", op: op, right: right },
                  o,
                  i,
                  line
                ),
                true,
                false
              );
            }
          }
        }
      }
      for (_arr = o.macros.prefixUnaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, o, i, line)) != null) {
          return _ref;
        }
      }
      for (_arr = o.macros.postfixUnaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, o, i, line)) != null) {
          return _ref;
        }
      }
      return false;
    };
  }())));
  CustomBinaryOperator = cache(named("CustomBinaryOperator", function (o) {
    var _arr, _i, _i2, _len, _len2, clone, i, inverted, op, operator, operators;
    i = o.index;
    for (_arr = o.macros.binaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      operators = _arr[_i];
      if (operators) {
        for (_i2 = 0, _len2 = __num(operators.length); _i2 < _len2; ++_i2) {
          operator = operators[_i2];
          clone = o.clone();
          inverted = false;
          if (operator.invertible) {
            inverted = MaybeNotToken(clone);
            if (!inverted) {
              continue;
            }
          }
          op = operator.rule(clone);
          if (op) {
            o.update(clone);
            return { op: op, operator: operator, inverted: inverted === "not" };
          }
        }
      }
    }
    return false;
  }));
  Parenthetical = cache(named("Parenthetical", (function () {
    var _rule;
    _rule = (function () {
      var _rule3, _rule5;
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = AssignmentAsExpression(clone)) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      _rule3 = (function () {
        function _rule6(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.left = Expression(clone)) && (result.operator = CustomBinaryOperator(clone)) && CloseParenthesis(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(_p, o, i, line) {
          var _p2, inverted, left, op, operator, right;
          left = _p.left;
          _p2 = _p.operator;
          op = _p2.op;
          operator = _p2.operator;
          inverted = _p2.inverted;
          right = o.tmp(i, getTmpId(), "x");
          return o["function"](
            i,
            [o.param(i, right)],
            operator.func(
              { left: left, inverted: inverted, op: op, right: right },
              o,
              i,
              line
            ),
            true,
            false
          );
        }
        return named(
          (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule6(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = Expression(clone)) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      _rule5 = (function () {
        function _rule6(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.operator = CustomBinaryOperator(clone)) && (result.right = Expression(clone)) && CloseParenthesis(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(_p, o, i, line) {
          var _p2, inverted, left, op, operator, right;
          right = _p.right;
          _p2 = _p.operator;
          op = _p2.op;
          operator = _p2.operator;
          inverted = _p2.inverted;
          left = o.tmp(i, getTmpId(), "x");
          return o["function"](
            i,
            [o.param(i, left)],
            operator.func(
              { left: left, inverted: inverted, op: op, right: right },
              o,
              i,
              line
            ),
            true,
            false
          );
        }
        return named(
          (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule6(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return function (o) {
        return _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o) || CustomOperatorCloseParenthesis(o);
      };
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (OpenParenthesis(clone) && (result = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(node, o, i) {
        return node;
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  SpreadToken = cache(named("SpreadToken", (function () {
    function _rule(o) {
      var clone;
      clone = o.clone();
      if (Space(clone) && Period(clone) && Period(clone) && Period(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else {
          return "...";
        }
      }
    );
  }())));
  MaybeSpreadToken = cache(named("MaybeSpreadToken", named(
    __strnum((SpreadToken != null ? SpreadToken.parserName : void 0) || "SpreadToken") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = SpreadToken(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  SpreadOrExpression = cache(named("SpreadOrExpression", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.spread = MaybeSpreadToken(clone)) && (result.node = Expression(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      if (x.spread === "...") {
        return o.spread(i, x.node.doWrap());
      } else {
        return x.node;
      }
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  ArrayLiteral = cache(named("ArrayLiteral", (function () {
    var _rule, _rule2;
    _rule = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          function _rule5(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (Comma(clone) && (result = SpreadOrExpression(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule5(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return (function () {
          function _rule5(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule4(clone)) && MaybeComma(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return [x.head].concat(__toArray(x.tail));
          }
          return named(
            (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule5(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule5;
          _rule5 = (function () {
            var _rule6;
            _rule6 = (function () {
              function _rule7(o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (CommaOrNewlineWithCheckIndent(clone) && (result = SpreadOrExpression(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              return named(
                __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
                function (o) {
                  var clone, item, result;
                  clone = o.clone();
                  result = [];
                  for (; ; ) {
                    item = _rule7(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  o.update(clone);
                  return result;
                }
              );
            }());
            return (function () {
              function _rule7(o) {
                var clone, result;
                clone = o.clone();
                result = {};
                if (CheckIndent(clone) && (result.head = SpreadOrExpression(clone)) && (result.tail = _rule6(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              function _mutator(x) {
                return [x.head].concat(__toArray(x.tail));
              }
              return named(
                (_rule7 != null ? _rule7.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule7(o);
                  if (!result) {
                    return false;
                  } else if (typeof _mutator === "function") {
                    return _mutator(result, o, index, line);
                  } else if (_mutator !== void 0) {
                    return _mutator;
                  } else {
                    return result;
                  }
                }
              );
            }());
          }());
          function _missing2() {
            return [];
          }
          return named(
            __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = _rule5(clone);
              if (!result) {
                if (typeof _missing2 === "function") {
                  return _missing2(void 0, o, index, line);
                } else {
                  return _missing2;
                }
              } else {
                o.update(clone);
                return result;
              }
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _rule4(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (OpenSquareBracket(clone) && Space(clone) && (result.first = _rule(clone)) && (result.rest = _rule2(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.array(i, __toArray(x.first).concat(__toArray(x.rest)));
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  BracketedObjectKey = cache(named("BracketedObjectKey", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (OpenSquareBracket(clone) && (result = ExpressionOrAssignment(clone)) && CloseSquareBracket(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  ObjectKey = cache(named("ObjectKey", (function () {
    var _rule;
    _rule = (function () {
      function _mutator(x, o, i) {
        return o["const"](i, String(x.value));
      }
      return named(
        (NumberLiteral != null ? NumberLiteral.parserName : void 0) || "NumberLiteral",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = NumberLiteral(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return function (o) {
      return BracketedObjectKey(o) || StringLiteral(o) || _rule(o) || IdentifierNameConst(o);
    };
  }())));
  Colon = cache(named("Colon", (function () {
    var _rule;
    _rule = named(
      "!" + __strnum((ColonChar != null ? ColonChar.parserName : void 0) || "ColonChar"),
      function (o) {
        return !ColonChar(o.clone());
      }
    );
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = ColonChar(clone)) && _rule(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  NotColon = cache(named("NotColon", named(
    "!" + __strnum((Colon != null ? Colon.parserName : void 0) || "Colon"),
    function (o) {
      return !Colon(o.clone());
    }
  )));
  ObjectKeyColon = cache(named("ObjectKeyColon", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = ObjectKey(clone)) && Colon(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return function (o) {
      var result;
      o.preventFail();
      result = void 0;
      try {
        result = _rule(o);
      } finally {
        o.unpreventFail();
      }
      if (result) {
        return result;
      } else {
        o.fail('key ":"');
        return false;
      }
    };
  }())));
  DualObjectKey = cache(named("DualObjectKey", (function () {
    function _backend(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.key = ObjectKeyColon(clone)) && (result.value = Expression(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!ObjectKeyColon(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  IdentifierOrSimpleAccessStart = cache(named("IdentifierOrSimpleAccessStart", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteralPeriod(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.access(i, x.parent, x.child);
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteral(clone)) && DoubleColon(clone) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.access(
          i,
          o.access(i, x.parent, o["const"](i, "prototype")),
          x.child
        );
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      var _rule4;
      _rule4 = named(
        __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "DoubleColon") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = DoubleColon(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.parent = ThisOrShorthandLiteral(clone)) && (result.isProto = _rule4(clone)) && OpenSquareBracketChar(clone) && (result.child = Expression(clone)) && CloseSquareBracket(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var parent;
          parent = x.parent;
          if (x.isProto !== NOTHING) {
            parent = o.access(i, parent, o["const"](i, "prototype"));
          }
          return o.access(i, parent, x.child);
        }
        return named(
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return Identifier(o) || _rule(o) || _rule2(o) || _rule3(o);
    };
  }())));
  IdentifierOrSimpleAccessPart = cache(named("IdentifierOrSimpleAccessPart", (function () {
    var _rule, _rule2;
    _rule = (function () {
      function _rule3(o) {
        return Period(o) || DoubleColon(o);
      }
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.type = _rule3(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var child, isProto;
          isProto = x.type === "::";
          child = x.child;
          return function (parent) {
            return o.access(
              i,
              isProto
                ? o.access(i, parent, o["const"](i, "prototype"))
                : parent,
              child
            );
          };
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    _rule2 = (function () {
      var _rule3;
      _rule3 = named(
        __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "DoubleColon") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = DoubleColon(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.type = _rule3(clone)) && OpenSquareBracketChar(clone) && (result.child = Expression(clone)) && CloseSquareBracket(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var child, isProto;
          isProto = x.type !== NOTHING;
          child = x.child;
          return function (parent) {
            return o.access(
              i,
              isProto
                ? o.access(i, parent, o["const"](i, "prototype"))
                : parent,
              child
            );
          };
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }())));
  IdentifierOrSimpleAccess = cache(named("IdentifierOrSimpleAccess", (function () {
    var _rule;
    _rule = named(
      __strnum((IdentifierOrSimpleAccessPart != null ? IdentifierOrSimpleAccessPart.parserName : void 0) || "IdentifierOrSimpleAccessPart") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = IdentifierOrSimpleAccessPart(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = IdentifierOrSimpleAccessStart(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _arr, _i, _len, creator, current;
        current = x.head;
        for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          creator = _arr[_i];
          current = creator(current);
        }
        return current;
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  SingularObjectKey = cache(named("SingularObjectKey", (function () {
    var _rule, _rule2, _rule3, _rule4, _rule5;
    _rule = (function () {
      function _rule6(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = IdentifierOrSimpleAccess(clone)) && NotColon(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(ident, o, i) {
        var key;
        key = ident instanceof AccessNode ? ident.child
          : ident instanceof IdentNode ? o["const"](i, ident.name)
          : o.error("Unknown ident type: " + __typeof(ident));
        return { key: key, value: ident };
      }
      return named(
        (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule6(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      function _rule6(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = ConstantLiteral(clone)) && NotColon(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(node, o, i) {
        var key;
        key = node.isConst() && typeof node.constValue() ? o["const"](i, String(node.constValue())) : node;
        return { key: key, value: node };
      }
      return named(
        (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule6(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      function _rule6(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = ThisLiteral(clone)) && NotColon(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(node, o, i) {
        return {
          key: o["const"](i, "this"),
          value: node
        };
      }
      return named(
        (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule6(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule4 = (function () {
      function _rule6(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = ArgumentsLiteral(clone)) && NotColon(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(node, o, i) {
        return {
          key: o["const"](i, "arguments"),
          value: node
        };
      }
      return named(
        (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule6(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule5 = (function () {
      function _rule6(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = BracketedObjectKey(clone)) && NotColon(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(node) {
        return { key: node, value: node };
      }
      return named(
        (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule6(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return function (o) {
      return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o);
    };
  }())));
  KeyValuePair = cache(named("KeyValuePair", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = named(
        __strnum((PlusOrMinus != null ? PlusOrMinus.parserName : void 0) || "PlusOrMinus") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = PlusOrMinus(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (Space(clone) && (result.bool = _rule2(clone)) && (result.pair = SingularObjectKey(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          if (x.bool !== NOTHING) {
            return {
              key: x.pair.key,
              value: o["const"](i, x.bool === 43)
            };
          } else {
            return x.pair;
          }
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return DualObjectKey(o) || _rule(o);
    };
  }())));
  ExtendsToken = cache(named("ExtendsToken", word("extends")));
  ObjectLiteral = cache(named("ObjectLiteral", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = (function () {
          function _rule6(o) {
            return Newline(o.clone());
          }
          function _rule7(o) {
            return CloseCurlyBrace(o.clone());
          }
          return function (o) {
            return Comma(o) || _rule6(o) || _rule7(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (ExtendsToken(clone) && (result = InvocationOrAccess(clone)) && Space(clone) && _rule5(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = (function () {
          function _rule6(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (Comma(clone) && (result = KeyValuePair(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule6(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return (function () {
          function _rule6(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.head = KeyValuePair(clone)) && (result.tail = _rule5(clone)) && MaybeComma(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return [x.head].concat(__toArray(x.tail));
          }
          return named(
            (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule6(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              function _rule8(o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (CommaOrNewlineWithCheckIndent(clone) && (result = KeyValuePair(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              return named(
                __strnum((_rule8 != null ? _rule8.parserName : void 0) || "<unknown>") + "*",
                function (o) {
                  var clone, item, result;
                  clone = o.clone();
                  result = [];
                  for (; ; ) {
                    item = _rule8(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  o.update(clone);
                  return result;
                }
              );
            }());
            return (function () {
              function _rule8(o) {
                var clone, result;
                clone = o.clone();
                result = {};
                if (CheckIndent(clone) && (result.head = KeyValuePair(clone)) && (result.tail = _rule7(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              function _mutator(x) {
                return [x.head].concat(__toArray(x.tail));
              }
              return named(
                (_rule8 != null ? _rule8.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule8(o);
                  if (!result) {
                    return false;
                  } else if (typeof _mutator === "function") {
                    return _mutator(result, o, index, line);
                  } else if (_mutator !== void 0) {
                    return _mutator;
                  } else {
                    return result;
                  }
                }
              );
            }());
          }());
          function _missing2() {
            return [];
          }
          return named(
            __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = _rule6(clone);
              if (!result) {
                if (typeof _missing2 === "function") {
                  return _missing2(void 0, o, index, line);
                } else {
                  return _missing2;
                }
              } else {
                o.update(clone);
                return result;
              }
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _rule5(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (OpenCurlyBrace(clone) && Space(clone) && (result.prototype = _rule(clone)) && (result.first = _rule2(clone)) && (result.rest = _rule3(clone)) && CloseCurlyBrace(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.object(i, __toArray(x.first).concat(__toArray(x.rest)), x.prototype !== NOTHING ? x.prototype : void 0);
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  IndentedObjectLiteral = cache(named("IndentedObjectLiteral", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (CommaOrNewline(clone) && CheckIndent(clone) && (result = DualObjectKey(clone)) && Space(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (Space(clone) && Newline(clone) && EmptyLines(clone) && Advance(clone) && CheckIndent(clone) && (result.head = DualObjectKey(clone)) && Space(clone) && (result.tail = _rule(clone)) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.object(i, [x.head].concat(__toArray(x.tail)));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  InBlock = cache(named("InBlock", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Advance(clone) && (result = Block(clone)) && PopIndent(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  Body = cache(named("Body", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && Newline(clone) && EmptyLines(clone) && (result = InBlock(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  BodyOrStatementOrNothing = cache(named("BodyOrStatementOrNothing", function (o) {
    return Body(o) || Statement(o) || Nothing(o);
  }));
  DedentedBody = cache(named("DedentedBody", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Newline(clone) && EmptyLines(clone) && (result = Block(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return function (o) {
        return _rule2(o) || Nothing(o);
      };
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  DeclareEqualSymbol = cache(named("DeclareEqualSymbol", (function () {
    var _rule;
    _rule = named('"="', function (o) {
      if (o.data.charCodeAt(o.index) === 61) {
        o.index = __num(o.index) + 1;
        return 61;
      } else {
        o.fail('"="');
        return false;
      }
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  MutableToken = cache(named("MutableToken", word("mutable")));
  MaybeMutableToken = cache(named("MaybeMutableToken", named(
    __strnum((MutableToken != null ? MutableToken.parserName : void 0) || "MutableToken") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = MutableToken(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  SimpleType = cache(named("SimpleType", function (o) {
    return IdentifierOrSimpleAccess(o) || VoidLiteral(o) || NullLiteral(o);
  }));
  SimpleOrArrayType = cache(named("SimpleOrArrayType", function (o) {
    return SimpleType(o) || ArrayType(o);
  }));
  UnionType = cache(named("UnionType", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Pipe(clone) && (result = SimpleOrArrayType(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (OpenParenthesis(clone) && (result.head = SimpleOrArrayType(clone)) && (result.tail = _rule(clone)) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.typeUnion(i, [x.head].concat(__toArray(x.tail)));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  ArrayType = cache(named("ArrayType", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenSquareBracket(clone) && (result = TypeReference(clone)) && CloseSquareBracket(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o.typeArray(i, x);
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  TypeReference = cache(named("TypeReference", function (o) {
    return IdentifierOrSimpleAccess(o) || UnionType(o) || ArrayType(o);
  }));
  AsToken = cache(named("AsToken", word("as")));
  AsType = cache(named("AsType", (function () {
    function _backend(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (AsToken(clone) && (result = TypeReference(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!AsToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  MaybeAsType = cache(named("MaybeAsType", named(
    __strnum((AsType != null ? AsType.parserName : void 0) || "AsType") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = AsType(clone);
      if (!result) {
        if (typeof NOTHING === "function") {
          return NOTHING(void 0, o, index, line);
        } else {
          return NOTHING;
        }
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  IdentifierParameter = cache(named("IdentifierParameter", (function () {
    var _rule, _rule2;
    _rule = named(
      __strnum((ThisOrShorthandLiteralPeriod != null ? ThisOrShorthandLiteralPeriod.parserName : void 0) || "ThisOrShorthandLiteralPeriod") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = ThisOrShorthandLiteralPeriod(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index, line);
          } else {
            return NOTHING;
          }
        } else {
          o.update(clone);
          return result;
        }
      }
    );
    _rule2 = (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DeclareEqualSymbol(clone) && (result = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.isMutable = MaybeMutableToken(clone)) && (result.spread = MaybeSpreadToken(clone)) && (result.parent = _rule(clone)) && (result.ident = Identifier(clone)) && (result.asType = MaybeAsType(clone)) && (result.defaultValue = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var name;
        name = x.parent !== NOTHING
          ? o.access(i, x.parent, o["const"](i, x.ident.name))
          : x.ident;
        if (x.spread === "..." && x.defaultValue !== NOTHING) {
          o.error("Cannot specify a default value for a spread parameter");
        }
        return o.param(
          i,
          name,
          x.defaultValue !== NOTHING ? x.defaultValue : void 0,
          x.spread === "...",
          x.isMutable === "mutable",
          x.asType !== NOTHING ? x.asType : void 0
        );
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  Parameter = cache(named("Parameter", function (o) {
    return IdentifierParameter(o) || ArrayParameter(o) || ObjectParameter(o);
  }));
  function validateSpreadParameters(params, o) {
    var _i, _len, param, spreadCount;
    spreadCount = 0;
    for (_i = 0, _len = __num(params.length); _i < _len; ++_i) {
      param = params[_i];
      if (param instanceof ParamNode && param.spread) {
        spreadCount = __num(spreadCount) + 1;
        if (__num(spreadCount) > 1) {
          o.error("Cannot have more than one spread parameter");
        }
      }
    }
    return params;
  }
  ArrayParameter = cache(named("ArrayParameter", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (CommaOrNewline(clone) && (result = Parameter(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return (function () {
          function _rule4(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.head = Parameter(clone)) && (result.tail = _rule3(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return [x.head].concat(__toArray(x.tail));
          }
          return named(
            (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule4(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule2(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (OpenSquareBracket(clone) && EmptyLines(clone) && (result = _rule(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.arrayParam(i, validateSpreadParameters(x, o));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  ParamDualObjectKey = cache(named("ParamDualObjectKey", function (o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.key = ObjectKeyColon(clone)) && (result.value = Parameter(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  ParamSingularObjectKey = cache(named("ParamSingularObjectKey", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = IdentifierParameter(clone)) && NotColon(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(param, o, i) {
      var ident, key;
      ident = param.ident;
      key = ident instanceof IdentNode ? o["const"](i, ident.name)
        : ident instanceof AccessNode ? ident.child
        : (function () {
          throw Error("Unknown object key type: " + __typeof(ident));
        }());
      return { key: key, value: param };
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  KvpParameter = cache(named("KvpParameter", function (o) {
    return ParamDualObjectKey(o) || ParamSingularObjectKey(o);
  }));
  ObjectParameter = cache(named("ObjectParameter", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (CommaOrNewline(clone) && (result = KvpParameter(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return (function () {
          function _rule4(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.head = KvpParameter(clone)) && (result.tail = _rule3(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return [x.head].concat(__toArray(x.tail));
          }
          return named(
            (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule4(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule2(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (OpenCurlyBrace(clone) && EmptyLines(clone) && (result = _rule(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseCurlyBrace(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.objectParam(i, x);
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  Parameters = cache(named("Parameters", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (CommaOrNewline(clone) && (result = Parameter(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = Parameter(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return validateSpreadParameters([x.head].concat(__toArray(x.tail)), o);
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  ParameterSequence = cache(named("ParameterSequence", (function () {
    var _rule;
    _rule = (function () {
      function _missing() {
        return [];
      }
      return named(
        __strnum((Parameters != null ? Parameters.parserName : void 0) || "Parameters") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = Parameters(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      var _mutator;
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (OpenParenthesis(clone) && EmptyLines(clone) && (result = _rule(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      _mutator = (function () {
        function check(names, param, o, i) {
          var _arr, _i, _len, element, name, pair;
          if (param instanceof ParamNode) {
            name = param.ident instanceof IdentNode ? param.ident.name
              : param.ident instanceof AccessNode
              ? (function () {
                if (!(param.ident.child instanceof ConstNode) || typeof param.ident.child.value !== "string") {
                  throw Error("Expected constant access: " + __typeof(param.ident.child));
                }
                return param.ident.child.value;
              }())
              : (function () {
                throw Error("Unknown param ident: " + __typeof(param.ident));
              }());
            if (__in(name, names)) {
              o.error("Duplicate parameter name: " + __strnum(name));
            }
            names.push(name);
          } else if (param instanceof ArrayNode) {
            for (_arr = param.elements, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              element = _arr[_i];
              check(names, element, o, i);
            }
          } else if (param instanceof ObjectNode) {
            for (_arr = param.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              pair = _arr[_i];
              check(names, pair.value, o, i);
            }
          } else {
            throw Error("Unknown param node: " + __typeof(param));
          }
        }
        return function (x, o, i) {
          var _i, _len, names, param;
          names = [];
          for (_i = 0, _len = __num(x.length); _i < _len; ++_i) {
            param = x[_i];
            check(names, param, o, i);
          }
          return x;
        };
      }());
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  _FunctionBody = cache(named("_FunctionBody", (function () {
    var _rule;
    _rule = (function () {
      var _rule2, _rule3;
      _rule2 = symbol("->");
      _rule3 = (function () {
        function _missing(x, o, i) {
          return o.nothing(i);
        }
        return named(
          __strnum((Statement != null ? Statement.parserName : void 0) || "Statement") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = Statement(clone);
            if (!result) {
              if (typeof _missing === "function") {
                return _missing(void 0, o, index, line);
              } else {
                return _missing;
              }
            } else {
              o.update(clone);
              return result;
            }
          }
        );
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule2(clone) && (result = _rule3(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return _rule(o) || Body(o);
    };
  }())));
  _inGenerator = Stack(false);
  FunctionBody = cache(named("FunctionBody", makeAlterStack(_inGenerator, false)(_FunctionBody)));
  GeneratorFunctionBody = cache(named("GeneratorFunctionBody", makeAlterStack(_inGenerator, true)(_FunctionBody)));
  FunctionDeclaration = cache(named("FunctionDeclaration", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      function _missing() {
        return [];
      }
      return named(
        __strnum((ParameterSequence != null ? ParameterSequence.parserName : void 0) || "ParameterSequence") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = ParameterSequence(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule5;
      _rule5 = named('"!"', function (o) {
        if (o.data.charCodeAt(o.index) === 33) {
          o.index = __num(o.index) + 1;
          return 33;
        } else {
          o.fail('"!"');
          return false;
        }
      });
      return named(
        __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule5(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule3 = named(
      __strnum((AtSign != null ? AtSign.parserName : void 0) || "AtSign") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = AtSign(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index, line);
          } else {
            return NOTHING;
          }
        } else {
          o.update(clone);
          return result;
        }
      }
    );
    function _rule4(o) {
      var body, generator;
      generator = !!Asterix(o);
      body = generator ? GeneratorFunctionBody(o) : FunctionBody(o);
      return body && { generator: generator, body: body };
    }
    return (function () {
      function _rule5(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.params = _rule(clone)) && (result.asType = MaybeAsType(clone)) && (result.autoReturn = _rule2(clone)) && (result.bound = _rule3(clone)) && (result.generatorBody = _rule4(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _ref, autoReturn, body, generator;
        body = (_ref = x.generatorBody).body;
        generator = _ref.generator;
        autoReturn = x.autoReturn === NOTHING;
        if (!autoReturn && generator) {
          o.error("A function cannot be both non-returning and a generator");
        }
        return o["function"](
          i,
          x.params,
          body,
          autoReturn,
          x.bound !== NOTHING,
          x.asType !== NOTHING ? x.asType : void 0,
          generator
        );
      }
      return named(
        (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule5(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  FunctionLiteral = cache(named("FunctionLiteral", (function () {
    function _backend(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (HashSign(clone) && (result = FunctionDeclaration(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!HashSign(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  AssignmentAsExpression = cache(named("AssignmentAsExpression", inExpression(function (o) {
    return Assignment(o);
  })));
  ExpressionOrAssignment = cache(named("ExpressionOrAssignment", function (o) {
    return AssignmentAsExpression(o) || Expression(o);
  }));
  AstToken = cache(named("AstToken", word("AST")));
  AstExpressionToken = cache(named("AstExpressionToken", word("ASTE")));
  AstExpression = cache(named("AstExpression", (function () {
    var _backend;
    _backend = (function () {
      var _rule2;
      function _rule(o) {
        if (!_inMacro.peek()) {
          return o.error("Can only use AST inside a macro");
        } else if (_inAst.peek()) {
          return o.error("Cannot use AST inside an AST");
        } else {
          return true;
        }
      }
      _rule2 = inAst(ExpressionOrAssignment);
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule(clone) && AstExpressionToken(clone) && (result = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!AstExpressionToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  AstStatement = cache(named("AstStatement", (function () {
    var _backend;
    _backend = (function () {
      var _rule2;
      function _rule(o) {
        if (!_inMacro.peek()) {
          return o.error("Can only use AST inside a macro");
        } else if (_inAst.peek()) {
          return o.error("Cannot use AST inside an AST");
        } else {
          return true;
        }
      }
      _rule2 = inAst(BodyOrStatementOrNothing);
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule(clone) && AstToken(clone) && (result = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!AstToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  Ast = cache(named("Ast", (function () {
    function _rule(o) {
      return AstExpression(o) || AstStatement(o);
    }
    function _mutator(x, o, i) {
      return MacroHelper.constifyObject(x, i, o.index);
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  MacroName = cache(named("MacroName", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            return _Symbol(o) || _Name(o);
          }
          return (function () {
            var _rule5;
            _rule5 = named(
              __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "+",
              function (o) {
                var clone, item, result;
                clone = o.clone();
                result = [];
                for (; ; ) {
                  item = _rule4(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                if (__num(result.length) >= 1) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
            );
            function _mutator(x) {
              return x.join("");
            }
            return named(
              (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule5(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index, line);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if ((result = _rule3(clone)) && NotColon(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Space(clone) && (result = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      var result;
      o.preventFail();
      result = void 0;
      try {
        result = _rule(o);
      } finally {
        o.unpreventFail();
      }
      if (result) {
        return result;
      } else {
        o.fail("macro-name");
        return false;
      }
    };
  }())));
  MacroNames = cache(named("MacroNames", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Comma(clone) && (result = MacroName(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = MacroName(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return [x.head].concat(__toArray(x.tail));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  UseMacro = cache(named("UseMacro", function (o) {
    var clone, m, macros, name;
    clone = o.clone();
    macros = clone.macros;
    name = MacroName(clone);
    if (name) {
      m = macros.getByName(name);
      if (m) {
        return m(o);
      }
    }
    return false;
  }));
  AsToken = cache(named("AsToken", word("as")));
  MacroSyntaxParameterType = cache(named("MacroSyntaxParameterType", (function () {
    var _rule, _rule2;
    _rule = (function () {
      var _rule3, _rule4;
      _rule3 = (function () {
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (OpenParenthesis(clone) && EmptyLines(clone) && (result = MacroSyntaxParameters(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseParenthesis(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o.syntaxSequence(i, x);
        }
        return named(
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      _rule4 = (function () {
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (OpenParenthesis(clone) && EmptyLines(clone) && (result = MacroSyntaxChoiceParameters(clone)) && EmptyLines(clone) && CloseParenthesis(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o.syntaxChoice(i, x);
        }
        return named(
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return function (o) {
        return Identifier(o) || StringLiteral(o) || _rule3(o) || _rule4(o);
      };
    }());
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4, _rule5, _rule6;
        _rule4 = symbol("?");
        _rule5 = symbol("*");
        _rule6 = symbol("+");
        return function (o) {
          return _rule4(o) || _rule5(o) || _rule6(o);
        };
      }());
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _rule(clone)) && (result.multiplier = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        if (x.multiplier === NOTHING) {
          return x.type;
        } else {
          return o.syntaxMany(i, x.type, x.multiplier);
        }
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  MacroSyntaxParameter = cache(named("MacroSyntaxParameter", (function () {
    var _rule;
    _rule = (function () {
      var _rule3;
      function _rule2(o) {
        return ThisOrShorthandLiteral(o) || Identifier(o);
      }
      _rule3 = (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (AsToken(clone) && (result = MacroSyntaxParameterType(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = _rule4(clone);
            if (!result) {
              if (typeof NOTHING === "function") {
                return NOTHING(void 0, o, index, line);
              } else {
                return NOTHING;
              }
            } else {
              o.update(clone);
              return result;
            }
          }
        );
      }());
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.ident = _rule2(clone)) && (result.type = _rule3(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o.syntaxParam(i, x.ident, x.type !== NOTHING ? x.type : void 0);
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return StringLiteral(o) || _rule(o);
    };
  }())));
  MacroSyntaxParameters = cache(named("MacroSyntaxParameters", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Comma(clone) && (result = MacroSyntaxParameter(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = MacroSyntaxParameter(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        return [x.head].concat(__toArray(x.tail));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  MacroSyntaxChoiceParameters = cache(named("MacroSyntaxChoiceParameters", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Pipe(clone) && (result = MacroSyntaxParameterType(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = MacroSyntaxParameterType(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        return [x.head].concat(__toArray(x.tail));
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  SyntaxToken = cache(named("SyntaxToken", word("syntax")));
  MacroOptions = cache(named("MacroOptions", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = word("with");
      return (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule2(clone) && (result = UnclosedObjectLiteral(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          var _arr, _i, _len, _ref, key, options, value;
          options = {};
          for (_arr = x.pairs, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            key = (_ref = _arr[_i]).key;
            value = _ref.value;
            if (!key.isConst()) {
              o.error("Cannot have non-const keys in the options");
            }
            if (!value.isConst()) {
              o.error("Cannot have non-const value in the options");
            }
            options[key.constValue()] = value.constValue();
          }
          return options;
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    function _missing() {
      return {};
    }
    return named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = _rule(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index, line);
          } else {
            return _missing;
          }
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }())));
  MacroSyntax = cache(named("MacroSyntax", (function () {
    var _rule;
    _rule = (function () {
      var _backend;
      _backend = (function () {
        function _rule2(o) {
          var body, i, options, params;
          i = o.index;
          params = MacroSyntaxParameters(o);
          if (!params) {
            throw SHORT_CIRCUIT;
          }
          options = MacroOptions(o);
          o.startMacroSyntax(i, params, options);
          body = FunctionBody(o);
          if (!body) {
            throw SHORT_CIRCUIT;
          }
          o.macroSyntax(
            i,
            "syntax",
            params,
            options,
            body
          );
          return true;
        }
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (SyntaxToken(clone) && (result = _rule2(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        (_backend != null ? _backend.parserName : void 0) || "<unknown>",
        function (o) {
          var result;
          if (!SyntaxToken(o.clone())) {
            return false;
          } else {
            result = _backend(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        }
      );
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (CheckIndent(clone) && (result = _rule(clone)) && Space(clone) && CheckStop(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  MacroBody = cache(named("MacroBody", (function () {
    var _rule, _rule2;
    _rule = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          function _rule5(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (Newline(clone) && EmptyLines(clone) && (result = MacroSyntax(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule5(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (Advance(clone) && (result.head = MacroSyntax(clone)) && (result.tail = _rule4(clone)) && PopIndent(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Space(clone) && Newline(clone) && EmptyLines(clone) && (result = _rule3(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return true;
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    _rule2 = (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.params = ParameterSequence(clone)) && (result.options = MacroOptions(clone)) && (result.body = FunctionBody(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        o.macroSyntax(
          i,
          "call",
          x.params,
          x.options,
          x.body
        );
        return true;
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }())));
  MacroToken = cache(named("MacroToken", word("macro")));
  Macro = cache(named("Macro", inMacro((function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named("(identifier MacroBody)", function (o) {
        var names;
        names = MacroNames(o);
        if (names) {
          return o.enterMacro(names, function () {
            return MacroBody(o);
          });
        } else {
          return false;
        }
      });
      return (function () {
        function _rule2(o) {
          var clone;
          clone = o.clone();
          if (MacroToken(clone) && _rule(clone)) {
            o.update(clone);
            return true;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o.nothing(i);
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!MacroToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }()))));
  DefineSyntaxStart = cache(named("DefineSyntaxStart", (function () {
    var _rule, _rule2;
    _rule = word("define");
    _rule2 = word("syntax");
    return function (o) {
      var clone;
      clone = o.clone();
      if (_rule(clone) && _rule2(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    };
  }())));
  DefineSyntax = cache(named("DefineSyntax", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named(
        __strnum((FunctionBody != null ? FunctionBody.parserName : void 0) || "FunctionBody") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = FunctionBody(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (DefineSyntaxStart(clone) && (result.name = Identifier(clone)) && DeclareEqualSymbol(clone) && (result.value = MacroSyntaxParameters(clone)) && (result.body = _rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o.defineSyntax(i, x.name.name, x.value, x.body !== NOTHING ? x.body : void 0);
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!DefineSyntaxStart(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  DefineHelperStart = cache(named("DefineHelperStart", (function () {
    var _rule, _rule2;
    _rule = word("define");
    _rule2 = word("helper");
    return function (o) {
      var clone;
      clone = o.clone();
      if (_rule(clone) && _rule2(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    };
  }())));
  DefineHelper = cache(named("DefineHelper", (function () {
    var _backend;
    _backend = (function () {
      function _rule(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (DefineHelperStart(clone) && (result.name = Identifier(clone)) && DeclareEqualSymbol(clone) && (result.value = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.defineHelper(i, x.name, x.value);
      }
      return named(
        (_rule != null ? _rule.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!DefineHelperStart(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  DefineOperatorStart = cache(named("DefineOperatorStart", (function () {
    var _rule, _rule2;
    _rule = word("define");
    _rule2 = word("operator");
    return function (o) {
      var clone;
      clone = o.clone();
      if (_rule(clone) && _rule2(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    };
  }())));
  DefineOperator = cache(named("DefineOperator", (function () {
    var _backend;
    _backend = inMacro((function () {
      var _rule, _rule2;
      _rule = (function () {
        var _rule3, _rule4, _rule5;
        _rule3 = wordOrSymbol("binary");
        _rule4 = wordOrSymbol("assign");
        _rule5 = wordOrSymbol("unary");
        return function (o) {
          return _rule3(o) || _rule4(o) || _rule5(o);
        };
      }());
      _rule2 = (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Comma(clone) && (result = NameOrSymbol(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(
          __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = _rule3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            o.update(clone);
            return result;
          }
        );
      }());
      return (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (DefineOperatorStart(clone) && (result.type = _rule(clone)) && (result.head = NameOrSymbol(clone)) && (result.tail = _rule2(clone)) && (result.options = MacroOptions(clone)) && (result.body = FunctionBody(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var ops;
          ops = [x.head].concat(__toArray(x.tail));
          switch (x.type) {
          case "binary":
            return o.defineBinaryOperator(i, ops, x.options, x.body);
          case "assign":
            return o.defineAssignOperator(i, ops, x.options, x.body);
          case "unary":
            return o.defineUnaryOperator(i, ops, x.options, x.body);
          default:
            throw Error();
          }
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }()));
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!DefineOperatorStart(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  Nothing = cache(named("Nothing", function (o) {
    return o.nothing(o.index);
  }));
  ExpressionOrNothing = cache(named("ExpressionOrNothing", function (o) {
    return Expression(o) || Nothing(o);
  }));
  _indexSlice = Stack(false);
  inIndexSlice = makeAlterStack(_indexSlice, true);
  IndexSlice = cache(named("IndexSlice", inIndexSlice((function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.left = ExpressionOrNothing(clone)) && Colon(clone) && (result.right = ExpressionOrNothing(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x) {
      return {
        type: "slice",
        left: x instanceof NothingNode ? null : x.left,
        right: x instanceof NothingNode ? null : x.right
      };
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }()))));
  IndexMultiple = cache(named("IndexMultiple", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (CommaOrNewline(clone) && (result = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = Expression(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        if (__num(x.tail.length) > 0) {
          return { type: "multi", elements: [x.head].concat(__toArray(x.tail)) };
        } else {
          return { type: "single", node: x.head };
        }
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  Index = cache(named("Index", function (o) {
    return IndexSlice(o) || IndexMultiple(o);
  }));
  IdentifierOrAccessStart = cache(named("IdentifierOrAccessStart", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteralPeriod(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.access(i, x.parent, x.child);
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteral(clone)) && DoubleColon(clone) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.access(
          i,
          o.access(i, x.parent, o["const"](i, "prototype")),
          x.child
        );
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      var _rule4;
      _rule4 = named(
        __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "DoubleColon") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = DoubleColon(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.parent = ThisOrShorthandLiteral(clone)) && (result.isProto = _rule4(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var parent;
          parent = x.parent;
          if (x.isProto !== NOTHING) {
            parent = o.access(i, parent, o["const"](i, "prototype"));
          }
          if (x.child.type === "single") {
            return o.access(i, parent, x.child.node);
          } else {
            return o.accessIndex(i, parent, x.child);
          }
        }
        return named(
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return Identifier(o) || _rule(o) || _rule2(o) || _rule3(o);
    };
  }())));
  IdentifierOrAccessPart = cache(named("IdentifierOrAccessPart", (function () {
    var _rule, _rule2;
    _rule = (function () {
      function _rule3(o) {
        return Period(o) || DoubleColon(o);
      }
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.type = _rule3(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return function (parent) {
            if (x.type === "::") {
              parent = o.access(i, parent, o["const"](i, "prototype"));
            }
            return o.access(i, parent, x.child);
          };
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    _rule2 = (function () {
      var _rule3;
      _rule3 = named(
        __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "DoubleColon") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = DoubleColon(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
      return (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.type = _rule3(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return function (parent) {
            if (x.type !== NOTHING) {
              parent = o.access(i, parent, o["const"](i, "prototype"));
            }
            if (x.child.type === "single") {
              return o.access(i, parent, x.child.node);
            } else {
              return o.accessIndex(i, parent, x.child);
            }
          };
        }
        return named(
          (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }())));
  IdentifierOrAccess = cache(named("IdentifierOrAccess", (function () {
    var _rule;
    _rule = named(
      __strnum((IdentifierOrAccessPart != null ? IdentifierOrAccessPart.parserName : void 0) || "IdentifierOrAccessPart") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        for (; ; ) {
          item = IdentifierOrAccessPart(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        o.update(clone);
        return result;
      }
    );
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = IdentifierOrAccessStart(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _arr, _i, _len, current, part;
        current = x.head;
        for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          part = _arr[_i];
          current = part(current);
        }
        return current;
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  SimpleAssignable = IdentifierOrAccess;
  ComplexAssignable = cache(named("ComplexAssignable", SimpleAssignable));
  ColonEqual = cache(named("ColonEqual", (function () {
    var _rule;
    _rule = named('"="', function (o) {
      if (o.data.charCodeAt(o.index) === 61) {
        o.index = __num(o.index) + 1;
        return 61;
      } else {
        o.fail('"="');
        return false;
      }
    });
    return (function () {
      function _rule2(o) {
        var clone;
        clone = o.clone();
        if (Space(clone) && ColonChar(clone) && _rule(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else {
            return ":=";
          }
        }
      );
    }());
  }())));
  DirectAssignment = cache(named("DirectAssignment", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.left = ComplexAssignable(clone)) && ColonEqual(clone) && (result.right = ExpressionOrAssignment(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o.assign(i, x.left, "=", x.right.doWrap());
    }
    return named(
      (_rule != null ? _rule.parserName : void 0) || "<unknown>",
      function (o) {
        var index, line, result;
        index = o.index;
        line = o.line;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index, line);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }())));
  CustomAssignment = cache(named("CustomAssignment", function (o) {
    var _arr, _i, _len, clone, left, line, op, operator, right, rule, startIndex, subClone;
    startIndex = o.index;
    line = o.line;
    clone = o.clone();
    left = SimpleAssignable(clone);
    if (left) {
      for (_arr = o.macros.assignOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        operator = _arr[_i];
        subClone = clone.clone();
        rule = operator.rule;
        op = rule(subClone);
        if (!op) {
          continue;
        }
        right = ExpressionOrAssignment(subClone);
        if (!right) {
          continue;
        }
        o.update(subClone);
        return operator.func(
          { left: left, op: op, right: right },
          o,
          startIndex,
          line
        );
      }
    }
    return false;
  }));
  Assignment = cache(named("Assignment", function (o) {
    return DirectAssignment(o) || CustomAssignment(o);
  }));
  PrimaryExpression = cache(named("PrimaryExpression", function (o) {
    return UnclosedObjectLiteral(o) || Literal(o) || Parenthetical(o) || ArrayLiteral(o) || ObjectLiteral(o) || FunctionLiteral(o) || Ast(o) || UseMacro(o) || Identifier(o);
  }));
  UnclosedObjectLiteral = cache(named("UnclosedObjectLiteral", (function () {
    var _rule2;
    function _rule(o) {
      return !_indexSlice.peek();
    }
    _rule2 = (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Comma(clone) && (result = DualObjectKey(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (_rule(clone) && (result.head = DualObjectKey(clone)) && (result.tail = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.object(i, [x.head].concat(__toArray(x.tail)));
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  ClosedArguments = cache(named("ClosedArguments", (function () {
    var _rule, _rule2;
    _rule = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          function _rule5(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (Comma(clone) && (result = SpreadOrExpression(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return named(
            __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = _rule5(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        }());
        return (function () {
          function _rule5(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule4(clone)) && MaybeComma(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return [x.head].concat(__toArray(x.tail));
          }
          return named(
            (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule5(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index, line);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule5;
          _rule5 = (function () {
            var _rule6;
            _rule6 = (function () {
              function _rule7(o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (CommaOrNewlineWithCheckIndent(clone) && (result = SpreadOrExpression(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              return named(
                __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
                function (o) {
                  var clone, item, result;
                  clone = o.clone();
                  result = [];
                  for (; ; ) {
                    item = _rule7(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  o.update(clone);
                  return result;
                }
              );
            }());
            return (function () {
              function _rule7(o) {
                var clone, result;
                clone = o.clone();
                result = {};
                if (CheckIndent(clone) && (result.head = SpreadOrExpression(clone)) && (result.tail = _rule6(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              function _mutator(x) {
                return [x.head].concat(__toArray(x.tail));
              }
              return named(
                (_rule7 != null ? _rule7.parserName : void 0) || "<unknown>",
                function (o) {
                  var index, line, result;
                  index = o.index;
                  line = o.line;
                  result = _rule7(o);
                  if (!result) {
                    return false;
                  } else if (typeof _mutator === "function") {
                    return _mutator(result, o, index, line);
                  } else if (_mutator !== void 0) {
                    return _mutator;
                  } else {
                    return result;
                  }
                }
              );
            }());
          }());
          function _missing2() {
            return [];
          }
          return named(
            __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = _rule5(clone);
              if (!result) {
                if (typeof _missing2 === "function") {
                  return _missing2(void 0, o, index, line);
                } else {
                  return _missing2;
                }
              } else {
                o.update(clone);
                return result;
              }
            }
          );
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _rule4(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index, line);
            } else {
              return _missing;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (OpenParenthesisChar(clone) && Space(clone) && (result.first = _rule(clone)) && (result.rest = _rule2(clone)) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return __toArray(x.first).concat(__toArray(x.rest));
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  UnclosedArguments = cache(named("UnclosedArguments", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Comma(clone) && (result = SpreadOrExpression(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(
          __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            for (; ; ) {
              item = _rule3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            o.update(clone);
            return result;
          }
        );
      }());
      return (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule2(clone)) && MaybeComma(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (SomeSpace(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  InvocationArguments = cache(named("InvocationArguments", function (o) {
    return ClosedArguments(o) || UnclosedArguments(o);
  }));
  MaybeExclamationPointNoSpace = cache(named("MaybeExclamationPointNoSpace", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = named('"!"', function (o) {
        if (o.data.charCodeAt(o.index) === 33) {
          o.index = __num(o.index) + 1;
          return 33;
        } else {
          o.fail('"!"');
          return false;
        }
      });
      return (function () {
        function _rule3(o) {
          var clone;
          clone = o.clone();
          if (NoSpace(clone) && _rule2(clone)) {
            o.update(clone);
            return true;
          } else {
            return false;
          }
        }
        return named(
          (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule3(o);
            if (!result) {
              return false;
            } else {
              return "!";
            }
          }
        );
      }());
    }());
    return named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = _rule(clone);
        if (!result) {
          return true;
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }())));
  MaybeExistentialSymbolNoSpace = cache(named("MaybeExistentialSymbolNoSpace", named(
    __strnum((ExistentialSymbolNoSpace != null ? ExistentialSymbolNoSpace.parserName : void 0) || "ExistentialSymbolNoSpace") + "?",
    function (o) {
      var clone, index, line, result;
      index = o.index;
      line = o.line;
      clone = o.clone();
      result = ExistentialSymbolNoSpace(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    }
  )));
  BasicInvocationOrAccess = cache(named("BasicInvocationOrAccess", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = word("new");
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, line, result;
          index = o.index;
          line = o.line;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index, line);
            } else {
              return NOTHING;
            }
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    _rule2 = (function () {
      var _rule4, _rule5;
      _rule4 = (function () {
        function _rule6(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.node = ThisShorthandLiteral(clone)) && (result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return {
            type: "thisAccess",
            node: x.node,
            child: x.child,
            existential: x.existential === "?",
            owns: x.owns === "!"
          };
        }
        return named(
          (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule6(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      _rule5 = (function () {
        function _mutator(x) {
          return { type: "normal", node: x };
        }
        return named(
          (PrimaryExpression != null ? PrimaryExpression.parserName : void 0) || "PrimaryExpression",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = PrimaryExpression(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return function (o) {
        return _rule4(o) || _rule5(o);
      };
    }());
    _rule3 = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5, _rule6, _rule7;
        _rule5 = (function () {
          function _rule8(o) {
            return Period(o) || DoubleColon(o);
          }
          return (function () {
            function _rule9(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && EmptyLines(clone) && Space(clone) && (result.type = _rule8(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _mutator(x) {
              return {
                type: x.type === "::" ? "protoAccess" : "access",
                child: x.child,
                existential: x.existential === "?",
                owns: x.owns === "!"
              };
            }
            return named(
              (_rule9 != null ? _rule9.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule9(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index, line);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
        }());
        _rule6 = (function () {
          var _rule8;
          _rule8 = named(
            __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "DoubleColon") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = DoubleColon(clone);
              if (!result) {
                return "accessIndex";
              } else {
                o.update(clone);
                return "protoAccessIndex";
              }
            }
          );
          return (function () {
            function _rule9(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && (result.type = _rule8(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _mutator(x, o, i) {
              if (x.child.type === "single") {
                return {
                  type: x.type === "accessIndex" ? "access" : "protoAccess",
                  child: x.child.node,
                  existential: x.existential === "?",
                  owns: x.owns === "!"
                };
              } else {
                if (x.owns === "!") {
                  o.error("Cannot use ! when using a multiple or slicing index");
                }
                return { type: x.type, child: x.child, existential: x.existential === "?" };
              }
            }
            return named(
              (_rule9 != null ? _rule9.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule9(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index, line);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
        }());
        _rule7 = (function () {
          var _rule8;
          _rule8 = named(
            __strnum((AtSign != null ? AtSign.parserName : void 0) || "AtSign") + "?",
            function (o) {
              var clone, index, line, result;
              index = o.index;
              line = o.line;
              clone = o.clone();
              result = AtSign(clone);
              if (!result) {
                if (typeof NOTHING === "function") {
                  return NOTHING(void 0, o, index, line);
                } else {
                  return NOTHING;
                }
              } else {
                o.update(clone);
                return result;
              }
            }
          );
          return (function () {
            function _rule9(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.isApply = _rule8(clone)) && (result.args = InvocationArguments(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _mutator(x) {
              return {
                type: "call",
                args: x.args,
                existential: x.existential === "?",
                isNew: false,
                isApply: x.isApply !== NOTHING
              };
            }
            return named(
              (_rule9 != null ? _rule9.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule9(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index, line);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
        }());
        return function (o) {
          return _rule5(o) || _rule6(o) || _rule7(o);
        };
      }());
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule4(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      var _mutator;
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.isNew = _rule(clone)) && (result.head = _rule2(clone)) && (result.tail = _rule3(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      _mutator = (function () {
        var linkTypes;
        linkTypes = {
          access: (function () {
            var indexTypes;
            indexTypes = {
              slice: function (o, i, child) {
                return function (parent) {
                  var args;
                  args = [parent];
                  if (child.left || child.right) {
                    args.push(child.left || o["const"](i, 0));
                  }
                  if (child.right) {
                    args.push(child.right);
                  }
                  return o.call(
                    i,
                    o.ident(i, "__slice"),
                    args
                  );
                };
              },
              multi: function (o, i, child) {
                return function (parent) {
                  var result, setParent, tmp, tmpIds;
                  setParent = parent;
                  tmpIds = [];
                  if (parent.cacheable) {
                    tmp = o.tmp(i, getTmpId(), "ref", parent.type(o));
                    tmpIds.push(tmp.id);
                    setParent = o.assign(i, tmp, "=", parent.doWrap());
                    parent = tmp;
                  }
                  result = o.array(i, (function () {
                    var _arr, _arr2, _len, element, j;
                    for (_arr = [], _arr2 = child.elements, j = 0, _len = __num(_arr2.length); j < _len; ++j) {
                      element = _arr2[j];
                      _arr.push(o.access(
                        i,
                        j === 0 ? setParent : parent,
                        element
                      ));
                    }
                    return _arr;
                  }()));
                  if (tmpIds.length) {
                    return o.tmpWrapper(i, result, tmpIds);
                  } else {
                    return result;
                  }
                };
              }
            };
            return function (o, i, head, link, j, links) {
              var child, makeAccess, result, setChild, setHead, test, tmp, tmpIds;
              if (link.owns) {
                tmpIds = [];
                setHead = head;
                if (head.cacheable) {
                  tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
                  tmpIds.push(tmp.id);
                  setHead = o.assign(i, tmp, "=", head.doWrap());
                  head = tmp;
                }
                child = link.child;
                setChild = child;
                if (child.cacheable) {
                  tmp = o.tmp(i, getTmpId(), "ref", child.type(o));
                  tmpIds.push(tmp.id);
                  setChild = o.assign(i, tmp, "=", child.doWrap());
                  child = tmp;
                }
                test = o.call(
                  i,
                  o.ident(i, "__owns"),
                  [setHead, setChild]
                );
                result = o["if"](
                  i,
                  link.existential
                    ? o.binary(
                      i,
                      o.binary(i, setHead, "!=", o["const"](i, null)),
                      "&&",
                      o.call(
                        i,
                        o.ident(i, "__owns"),
                        [head, setChild]
                      )
                    )
                    : o.call(
                      i,
                      o.ident(i, "__owns"),
                      [setHead, setChild]
                    ),
                  convertCallChain(
                    o,
                    i,
                    o.access(i, head, child),
                    __num(j) + 1,
                    links
                  )
                );
                if (tmpIds.length) {
                  return o.tmpWrapper(i, result, tmpIds);
                } else {
                  return result;
                }
              } else {
                makeAccess = (function () {
                  switch (link.type) {
                  case "access":
                    return function (parent) {
                      return o.access(i, parent, link.child);
                    };
                  case "accessIndex":
                    if (!__owns(indexTypes, link.child.type)) {
                      throw Error("Unknown index type: " + __strnum(link.child.type));
                    }
                    return indexTypes[link.child.type](o, i, link.child);
                  default:
                    throw Error("Unknown link type: " + __strnum(link.type));
                  }
                }());
                if (link.existential) {
                  tmpIds = [];
                  setHead = head;
                  if (head.cacheable) {
                    tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
                    tmpIds.push(tmp.id);
                    setHead = o.assign(i, tmp, "=", head.doWrap());
                    head = tmp;
                  }
                  result = o["if"](
                    i,
                    o.binary(i, setHead, "!=", o["const"](i, null)),
                    convertCallChain(
                      o,
                      i,
                      makeAccess(head),
                      __num(j) + 1,
                      links
                    )
                  );
                  if (tmpIds.length) {
                    return o.tmpWrapper(i, result, tmpIds);
                  } else {
                    return result;
                  }
                } else {
                  return convertCallChain(
                    o,
                    i,
                    makeAccess(head),
                    __num(j) + 1,
                    links
                  );
                }
              }
            };
          }()),
          call: (function () {
            return function (o, i, head, link, j, links) {
              var child, parent, result, setChild, setHead, setParent, tmp, tmpIds;
              if (!link.existential) {
                return convertCallChain(
                  o,
                  i,
                  o.call(
                    i,
                    head,
                    link.args,
                    link.isNew,
                    link.isApply
                  ),
                  __num(j) + 1,
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
                    tmp = o.tmp(i, getTmpId(), "ref", parent.type(o));
                    tmpIds.push(tmp.id);
                    setParent = o.assign(i, tmp, "=", parent.doWrap());
                    parent = tmp;
                  }
                  if (child.cacheable) {
                    tmp = o.tmp(i, getTmpId(), "ref", child.type(o));
                    tmpIds.push(tmp.id);
                    setChild = o.assign(i, tmp, "=", child.doWrap());
                    child = tmp;
                  }
                  if (parent !== setParent || child !== setChild) {
                    setHead = o.access(i, setParent, setChild);
                    head = o.access(i, parent, child);
                  }
                } else if (head.cacheable) {
                  tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
                  tmpIds.push(tmp.id);
                  setHead = o.assign(i, tmp, "=", head.doWrap());
                  head = tmp;
                }
                result = o["if"](
                  i,
                  o.binary(
                    i,
                    o.unary(i, "typeof", setHead),
                    "===",
                    o["const"](i, "function")
                  ),
                  convertCallChain(
                    o,
                    i,
                    o.call(
                      i,
                      head,
                      link.args,
                      link.isNew,
                      link.isApply
                    ),
                    __num(j) + 1,
                    links
                  )
                );
                if (tmpIds.length) {
                  return o.tmpWrapper(i, result, tmpIds);
                } else {
                  return result;
                }
              }
            };
          }())
        };
        linkTypes.accessIndex = linkTypes.access;
        function convertCallChain(o, i, head, j, links) {
          var link;
          if (!__lt(j, links.length)) {
            return head;
          } else {
            link = links[j];
            if (!__owns(linkTypes, link.type)) {
              throw Error("Unknown call-chain link: " + __strnum(link.type));
            }
            return linkTypes[link.type](
              o,
              i,
              head,
              link,
              j,
              links
            );
          }
        }
        return function (x, o, i) {
          var _i, _len, clone, head, isNew, links, part, tail;
          isNew = x.isNew !== NOTHING;
          head = x.head;
          tail = x.tail;
          if (tail.length === 0 && !isNew && head.type === "normal") {
            return head.node;
          }
          links = [];
          if (head.type === "thisAccess") {
            links.push({ type: "access", child: head.child, existential: head.existential });
          }
          for (_i = 0, _len = __num(tail.length); _i < _len; ++_i) {
            part = tail[_i];
            switch (part.type) {
            case "protoAccess":
            case "protoAccessIndex":
              links.push({
                type: "access",
                child: o["const"](i, "prototype"),
                existential: part.existential
              });
              clone = copy(part);
              clone.type = part.type === "protoAccess" ? "access" : "accessIndex";
              links.push(clone);
              break;
            case "access":
            case "accessIndex":
              links.push(part);
              break;
            case "call":
              if (isNew && part.isApply) {
                o.error("Cannot call with both new and @ at the same time");
              }
              clone = copy(part);
              clone.isNew = isNew;
              isNew = false;
              links.push(clone);
              break;
            default:
              o.error("Unknown link type: " + __strnum(part.type));
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
            o,
            i,
            head.node,
            0,
            links
          );
        };
      }());
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  SuperToken = cache(named("SuperToken", word("super")));
  SuperInvocation = cache(named("SuperInvocation", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = (function () {
        var _rule2;
        _rule2 = (function () {
          function _rule3(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (EmptyLines(clone) && Space(clone) && Period(clone) && (result = IdentifierNameConstOrNumberLiteral(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _rule4(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (OpenSquareBracketChar(clone) && (result = Expression(clone)) && CloseSquareBracket(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          return function (o) {
            return _rule3(o) || _rule4(o);
          };
        }());
        return named(
          __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = _rule2(clone);
            if (!result) {
              if (typeof NOTHING === "function") {
                return NOTHING(void 0, o, index, line);
              } else {
                return NOTHING;
              }
            } else {
              o.update(clone);
              return result;
            }
          }
        );
      }());
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (SuperToken(clone) && (result.child = _rule(clone)) && (result.args = InvocationArguments(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          return o["super"](
            i,
            x.child !== NOTHING ? x.child : void 0,
            x.args
          );
        }
        return named(
          (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index, line);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!SuperToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  EvalToken = cache(named("EvalToken", word("eval")));
  Eval = cache(named("Eval", (function () {
    var _backend;
    _backend = (function () {
      function _rule(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (EvalToken(clone) && (result = InvocationArguments(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(args, o, i) {
        if (args.length !== 1) {
          o.error("Expected only one argument to eval");
        }
        return o["eval"](i, args[0]);
      }
      return named(
        (_rule != null ? _rule.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!EvalToken(o.clone())) {
          return false;
        } else {
          result = _backend(o);
          if (!result) {
            throw SHORT_CIRCUIT;
          }
          return result;
        }
      }
    );
  }())));
  InvocationOrAccess = cache(named("InvocationOrAccess", (function () {
    function _rule(o) {
      var args, clone, i;
      if (_inAst.peek()) {
        i = o.index;
        clone = o.clone();
        Space(clone);
        if (!DollarSign(clone)) {
          return false;
        }
        _inAst.push(false);
        try {
          args = InvocationArguments(clone);
          if (!args) {
            return false;
          }
          o.update(clone);
          return o.call(
            i,
            o.ident(i, "$"),
            args
          );
        } finally {
          _inAst.pop();
        }
      }
    }
    return function (o) {
      return _rule(o) || BasicInvocationOrAccess(o) || SuperInvocation(o) || Eval(o);
    };
  }())));
  CustomPostfixUnary = cache(named("CustomPostfixUnary", function (o) {
    var _arr, _i, _len, clone, line, node, op, operator, rule, startIndex;
    startIndex = o.index;
    line = o.line;
    node = InvocationOrAccess(o);
    if (!node) {
      return false;
    } else {
      for (_arr = o.macros.postfixUnaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        operator = _arr[_i];
        clone = o.clone();
        rule = operator.rule;
        op = rule(clone);
        if (!op) {
          continue;
        }
        o.update(clone);
        return operator.func(
          { op: op, node: node },
          o,
          startIndex,
          line
        );
      }
      return node;
    }
  }));
  CustomPrefixUnary = cache(named("CustomPrefixUnary", function (o) {
    var _arr, _i, _len, clone, line, node, op, operator, rule, startIndex;
    startIndex = o.index;
    line = o.line;
    for (_arr = o.macros.prefixUnaryOperators, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
      operator = _arr[_i];
      clone = o.clone();
      rule = operator.rule;
      op = rule(clone);
      if (!op) {
        continue;
      }
      node = CustomPrefixUnary(clone);
      if (!node) {
        continue;
      }
      o.update(clone);
      return operator.func(
        { op: op, node: node },
        o,
        startIndex,
        line
      );
    }
    return CustomPostfixUnary(o);
  }));
  getUseCustomBinaryOperator = (function () {
    var precedenceCache;
    precedenceCache = [];
    return function (precedence) {
      var _ref;
      if ((_ref = precedenceCache[precedence]) == null) {
        return precedenceCache[precedence] = cache(function (o) {
          var _i, _i2, _len, _len2, binaryOperators, clone, current, head, inverted, j, line, nextRule, node, op, operator, operators, part, rule, startIndex, tail;
          startIndex = o.index;
          line = o.line;
          binaryOperators = o.macros.binaryOperators;
          if (__lt(binaryOperators.length, precedence)) {
            return CustomPrefixUnary(o);
          } else {
            nextRule = getUseCustomBinaryOperator(__num(precedence) + 1);
            head = nextRule(o);
            if (!head) {
              return false;
            } else {
              operators = binaryOperators[precedence];
              if (operators) {
                for (_i = 0, _len = __num(operators.length); _i < _len; ++_i) {
                  operator = operators[_i];
                  rule = operator.rule;
                  tail = [];
                  for (; ; ) {
                    clone = o.clone();
                    inverted = false;
                    if (operator.invertible) {
                      inverted = MaybeNotToken(clone);
                      if (!inverted) {
                        break;
                      }
                    }
                    op = rule(clone);
                    if (!op) {
                      break;
                    }
                    node = nextRule(clone);
                    if (!node) {
                      break;
                    }
                    o.update(clone);
                    tail.push({ inverted: inverted === "not", op: op, node: node });
                    if (operator.maximum && !__lt(tail.length, operator.maximum)) {
                      break;
                    }
                  }
                  if (tail.length) {
                    if (!operator.rightToLeft) {
                      current = head;
                      for (_i2 = 0, _len2 = __num(tail.length); _i2 < _len2; ++_i2) {
                        part = tail[_i2];
                        current = operator.func(
                          { left: current, inverted: part.inverted, op: part.op, right: part.node },
                          o,
                          startIndex,
                          line
                        );
                      }
                      return current;
                    } else {
                      current = tail[__num(tail.length) - 1].node;
                      for (j = __num(tail.length) - 1, -1; j > 0; j -= 1) {
                        current = operator.func(
                          { left: tail[__num(j) - 1].node, inverted: tail[j].inverted, op: tail[j].op, right: current },
                          o,
                          startIndex,
                          line
                        );
                      }
                      return operator.func(
                        { left: head, inverted: tail[0].inverted, op: tail[0].op, right: current },
                        o,
                        startIndex,
                        line
                      );
                    }
                  }
                }
              }
              return head;
            }
          }
        });
      } else {
        return _ref;
      }
    };
  }());
  Logic = named("Logic", getUseCustomBinaryOperator(0));
  ExpressionAsStatement = cache(named("ExpressionAsStatement", function (o) {
    return UseMacro(o) || Logic(o);
  }));
  Expression = cache(named("Expression", inExpression(ExpressionAsStatement)));
  Statement = cache(named("Statement", (function () {
    var _rule;
    _rule = inStatement(function (o) {
      return Macro(o) || DefineHelper(o) || DefineOperator(o) || DefineSyntax(o) || Assignment(o) || ExpressionAsStatement(o);
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = _rule(clone)) && Space(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  Line = cache(named("Line", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (CheckIndent(clone) && (result = Statement(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }));
  Block = cache(named("Block", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Newline(clone) && EmptyLines(clone) && (result = Line(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = Line(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _arr, _i, _len, item, nodes;
        nodes = [];
        for (_arr = [x.head].concat(__toArray(x.tail)), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          item = _arr[_i];
          if (item instanceof BlockNode) {
            nodes.push.apply(nodes, __toArray(item.nodes));
          } else if (!(item instanceof NothingNode)) {
            nodes.push(item);
          }
        }
        switch (nodes.length) {
        case 0:
          return o.nothing(i);
        case 1:
          return nodes[0];
        default:
          return o.block(i, nodes);
        }
      }
      return named(
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  Shebang = cache(named("Shebang", (function () {
    var _rule, _rule2, _rule3;
    _rule = named('"#"', function (o) {
      if (o.data.charCodeAt(o.index) === 35) {
        o.index = __num(o.index) + 1;
        return 35;
      } else {
        o.fail('"#"');
        return false;
      }
    });
    _rule2 = named('"!"', function (o) {
      if (o.data.charCodeAt(o.index) === 33) {
        o.index = __num(o.index) + 1;
        return 33;
      } else {
        o.fail('"!"');
        return false;
      }
    });
    _rule3 = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = named(
          "!" + __strnum((Newline != null ? Newline.parserName : void 0) || "Newline"),
          function (o) {
            return !Newline(o.clone());
          }
        );
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule5(clone) && (result = AnyChar(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(
        __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<unknown>") + "*",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          for (; ; ) {
            item = _rule4(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          o.update(clone);
          return result;
        }
      );
    }());
    return (function () {
      function _rule4(o) {
        var clone;
        clone = o.clone();
        if (_rule(clone) && _rule2(clone) && _rule3(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      return named(
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else {
            return true;
          }
        }
      );
    }());
  }())));
  Root = cache(named("Root", (function () {
    var _rule;
    _rule = named(
      __strnum((Shebang != null ? Shebang.parserName : void 0) || "Shebang") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = Shebang(clone);
        if (!result) {
          return true;
        } else {
          o.update(clone);
          return result;
        }
      }
    );
    function _rule2(o) {
      return Block(o) || Nothing(o);
    }
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule(clone) && EmptyLines(clone) && (result = _rule2(clone)) && EmptyLines(clone) && Space(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.root(i, x);
      }
      return named(
        (_rule3 != null ? _rule3.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index, line);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }())));
  ParserError = (function (_super) {
    var _proto, _superproto;
    function ParserError(message, text, index, line) {
      var _this;
      _this = this instanceof ParserError ? this : __create(_proto);
      _this.message = __strnum(message) + " at line #" + __strnum(line);
      _this.text = text;
      _this.index = index;
      _this.line = line;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ParserError.prototype = __create(_superproto);
    _proto.constructor = ParserError;
    ParserError.displayName = "ParserError";
    _proto.name = "ParserError";
    return ParserError;
  }(Error));
  MacroError = (function (_super) {
    var _proto, _superproto;
    function MacroError(inner, text, index, line) {
      var _this, innerType;
      _this = this instanceof MacroError ? this : __create(_proto);
      _this.inner = inner;
      innerType = __typeof(inner);
      _this.message = (innerType === "Error" ? "" : __strnum(innerType) + ": ") + String(inner != null ? inner.message : void 0) + " at line #" + __strnum(line);
      _this.text = text;
      _this.index = index;
      _this.line = line;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = MacroError.prototype = __create(_superproto);
    _proto.constructor = MacroError;
    MacroError.displayName = "MacroError";
    _proto.name = "MacroError";
    return MacroError;
  }(Error));
  function map(array, func, arg) {
    var _i, _len, changed, item, newItem, result;
    result = [];
    changed = false;
    for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
      item = array[_i];
      newItem = func(item, arg);
      result.push(newItem);
      if (item !== newItem) {
        changed = true;
      }
    }
    if (changed) {
      return result;
    } else {
      return array;
    }
  }
  FailureManager = (function () {
    var _proto;
    function FailureManager() {
      var _this;
      _this = this instanceof FailureManager ? this : __create(_proto);
      _this.messages = [];
      _this.index = 0;
      _this.line = 0;
      return _this;
    }
    _proto = FailureManager.prototype;
    FailureManager.displayName = "FailureManager";
    _proto.add = function (message, index, line) {
      var _ref;
      if (!__lte(index, this.index)) {
        this.messages = [];
        this.index = index;
      }
      this.line = !__lte(_ref = this.line, line) ? _ref : line;
      if (!__lt(index, this.index)) {
        this.messages.push(message);
      }
    };
    return FailureManager;
  }());
  MacroHelper = (function () {
    var _proto, mutators;
    function MacroHelper(state, index, position, inGenerator) {
      var _this;
      if (!(state instanceof State)) {
        throw TypeError("Expected state to be a State, got " + __typeof(state));
      }
      _this = this instanceof MacroHelper ? this : __create(_proto);
      _this.unsavedTmps = [];
      _this.savedTmps = [];
      _this.state = state;
      _this.index = index;
      _this.position = position;
      _this.inGenerator = inGenerator;
      return _this;
    }
    _proto = MacroHelper.prototype;
    MacroHelper.displayName = "MacroHelper";
    function doWrap(node) {
      if (node instanceof Node) {
        return node.doWrap();
      } else {
        return node;
      }
    }
    _proto["var"] = function (ident, isMutable) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be a IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (isMutable == void 0) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      return this.state["var"](this.index, ident, isMutable);
    };
    _proto.def = function (key, value) {
      if (!(key instanceof Node)) {
        throw TypeError("Expected key to be a Node, got " + __typeof(key));
      }
      if (value == void 0) {
        value = void 0;
      } else if (!(value instanceof Node)) {
        throw TypeError("Expected value to be a Node or undefined, got " + __typeof(value));
      }
      return this.state.def(this.index, key, doWrap(value));
    };
    _proto.noop = function () {
      return this.state.nothing(this.index);
    };
    _proto.block = function (nodes) {
      var _i, _len;
      if (!__isArray(nodes)) {
        throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
      } else {
        for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
          if (!(nodes[_i] instanceof Node)) {
            throw TypeError("Expected nodes[" + _i + "] to be a Node, got " + __typeof(nodes[_i]));
          }
        }
      }
      return this.state.block(this.index, nodes).reduce(this.state);
    };
    _proto["if"] = function (test, whenTrue, whenFalse) {
      if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == void 0) {
        whenFalse = null;
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node or null, got " + __typeof(whenFalse));
      }
      return this.state["if"](this.index, doWrap(test), whenTrue, whenFalse).reduce(this.state);
    };
    _proto["switch"] = function (node, cases, defaultCase) {
      var _this;
      _this = this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(cases)) {
        throw TypeError("Expected cases to be a Array, got " + __typeof(cases));
      }
      if (defaultCase == void 0) {
        defaultCase = null;
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node or null, got " + __typeof(defaultCase));
      }
      return this.state["switch"](
        this.index,
        doWrap(node),
        (function () {
          var _arr, _i, _len, case_;
          for (_arr = [], _i = 0, _len = __num(cases.length); _i < _len; ++_i) {
            case_ = cases[_i];
            _arr.push({ node: doWrap(case_.node), body: case_.body, fallthrough: case_.fallthrough });
          }
          return _arr;
        }()),
        defaultCase
      ).reduce(this.state);
    };
    _proto["for"] = function (init, test, step, body) {
      if (init == void 0) {
        init = null;
      } else if (!(init instanceof Node)) {
        throw TypeError("Expected init to be a Node or null, got " + __typeof(init));
      }
      if (test == void 0) {
        test = null;
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node or null, got " + __typeof(test));
      }
      if (step == void 0) {
        step = null;
      } else if (!(step instanceof Node)) {
        throw TypeError("Expected step to be a Node or null, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      return this.state["for"](
        this.index,
        doWrap(init),
        doWrap(test),
        doWrap(step),
        body
      ).reduce(this.state);
    };
    _proto.forIn = function (key, object, body) {
      if (!(key instanceof IdentNode)) {
        throw TypeError("Expected key to be a IdentNode, got " + __typeof(key));
      }
      if (!(object instanceof Node)) {
        throw TypeError("Expected object to be a Node, got " + __typeof(object));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      return this.state.forIn(this.index, key, doWrap(object), body).reduce(this.state);
    };
    _proto.tryCatch = function (tryBody, catchIdent, catchBody) {
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Node)) {
        throw TypeError("Expected catchIdent to be a Node, got " + __typeof(catchIdent));
      }
      if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      return this.state.tryCatch(this.index, tryBody, catchIdent, catchBody).reduce(this.state);
    };
    _proto.tryFinally = function (tryBody, finallyBody) {
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      return this.state.tryFinally(this.index, tryBody, finallyBody).reduce(this.state);
    };
    _proto.assign = function (left, op, right) {
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      return this.state.assign(this.index, left, op, doWrap(right)).reduce(this.state);
    };
    _proto.binary = function (left, op, right) {
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      return this.state.binary(this.index, doWrap(left), op, doWrap(right)).reduce(this.state);
    };
    _proto.unary = function (op, node) {
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state.unary(this.index, op, doWrap(node)).reduce(this.state);
    };
    _proto["throw"] = function (node) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state["throw"](this.index, doWrap(node)).reduce(this.state);
    };
    _proto["return"] = function (node) {
      if (node == void 0) {
        node = void 0;
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node or undefined, got " + __typeof(node));
      }
      return this.state["return"](this.index, doWrap(node)).reduce(this.state);
    };
    _proto["yield"] = function (node) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state["yield"](this.index, doWrap(node)).reduce(this.state);
    };
    _proto["debugger"] = function () {
      return this.state["debugger"](this.index);
    };
    _proto["break"] = function () {
      return this.state["break"](this.index);
    };
    _proto["continue"] = function () {
      return this.state["continue"](this.index);
    };
    _proto.macroExpand1 = function (node) {
      var expanded;
      if (node instanceof Node) {
        expanded = this.state.macroExpand1(node);
        if (expanded instanceof Node) {
          return expanded.reduce(this.state);
        } else {
          return expanded;
        }
      } else {
        return node;
      }
    };
    _proto.macroExpandAll = function (node) {
      var expanded;
      if (node instanceof Node) {
        expanded = this.state.macroExpandAll(node);
        if (expanded instanceof Node) {
          return expanded.reduce(this.state);
        } else {
          return expanded;
        }
      } else {
        return node;
      }
    };
    _proto.tmp = function (name, save, type) {
      var id;
      if (name == void 0) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == void 0) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      id = getTmpId();
      (save ? this.savedTmps : this.unsavedTmps).push(id);
      if (type == null) {
        type = Type.any;
      } else if (typeof type === "string") {
        if (!((__owns(Type, type) ? Type[type] : void 0) instanceof Type)) {
          throw Error(__strnum(type) + " is not a known type name");
        }
        type = __owns(Type, type) ? Type[type] : void 0;
      } else if (!(type instanceof Type)) {
        throw Error("Must provide a Type or a string for type, got " + __typeof(type));
      }
      return this.state.tmp(this.index, id, name, type);
    };
    _proto.getTmps = function () {
      return {
        unsaved: __slice(this.unsavedTmps, void 0, void 0),
        saved: __slice(this.savedTmps, void 0, void 0)
      };
    };
    _proto.isConst = function (node) {
      return node === void 0 || node instanceof Node && node.isConst();
    };
    _proto.value = function (node) {
      if (node === void 0) {
        return;
      } else if (node instanceof Node && node.isConst()) {
        return node.constValue();
      }
    };
    _proto["const"] = function (value) {
      return this.state["const"](this.index, value);
    };
    _proto.isNode = function (node) {
      return node instanceof Node;
    };
    _proto.isIdent = function (node) {
      return this.macroExpand1(node) instanceof IdentNode;
    };
    _proto.isTmp = function (node) {
      return this.macroExpand1(node) instanceof TmpNode;
    };
    _proto.name = function (node) {
      node = this.macroExpand1(node);
      if (this.isIdent(node)) {
        return node.name;
      }
    };
    _proto.ident = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (require("./ast").isAcceptableIdent(name)) {
        return this.state.ident(this.index, name);
      }
    };
    _proto.isCall = function (node) {
      return this.macroExpand1(node) instanceof CallNode;
    };
    _proto.callFunc = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return node.func;
      }
    };
    _proto.callArgs = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return node.args;
      }
    };
    _proto.isSuper = function (node) {
      return this.macroExpand1(node) instanceof SuperNode;
    };
    _proto.superChild = function (node) {
      node = this.macroExpand1(node);
      if (this.isSuper(node)) {
        return node.child;
      }
    };
    _proto.superArgs = function (node) {
      node = this.macroExpand1(node);
      if (this.isSuper(node)) {
        return node.args;
      }
    };
    _proto.callIsNew = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return !!node.isNew;
      } else {
        return false;
      }
    };
    _proto.callIsApply = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return !!node.isApply;
      } else {
        return false;
      }
    };
    _proto.call = function (func, args, isNew, isApply) {
      var _i, _len, _this;
      _this = this;
      if (!(func instanceof Node)) {
        throw TypeError("Expected func to be a Node, got " + __typeof(func));
      }
      if (args == void 0) {
        args = [];
      } else if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = 0, _len = args.length; _i < _len; ++_i) {
          if (!(args[_i] instanceof Node)) {
            throw TypeError("Expected args[" + _i + "] to be a Node, got " + __typeof(args[_i]));
          }
        }
      }
      if (isNew == void 0) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (isApply == void 0) {
        isApply = false;
      } else if (typeof isApply !== "boolean") {
        throw TypeError("Expected isApply to be a Boolean, got " + __typeof(isApply));
      }
      if (isNew && isApply) {
        throw Error("Cannot specify both is-new and is-apply");
      }
      return this.state.call(
        func.startIndex,
        doWrap(func),
        (function () {
          var _arr, _i, _len, arg;
          for (_arr = [], _i = 0, _len = __num(args.length); _i < _len; ++_i) {
            arg = args[_i];
            _arr.push(doWrap(arg));
          }
          return _arr;
        }()),
        isNew,
        isApply
      ).reduce(this.state);
    };
    _proto.func = function (params, body, autoReturn, bound) {
      if (autoReturn == void 0) {
        autoReturn = true;
      }
      if (bound == void 0) {
        bound = false;
      }
      return this.state["function"](
        0,
        params,
        body,
        autoReturn,
        bound
      ).reduce(this.state);
    };
    _proto.isFunc = function (node) {
      return this.macroExpand1(node) instanceof FunctionNode;
    };
    _proto.funcBody = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return node.body;
      }
    };
    _proto.funcParams = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return node.params;
      }
    };
    _proto.funcIsAutoReturn = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return !!node.autoReturn;
      }
    };
    _proto.funcIsBound = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return !!node.bound;
      }
    };
    _proto.param = function (ident, defaultValue, spread, isMutable, asType) {
      return this.state.param(
        0,
        ident,
        defaultValue,
        spread,
        isMutable,
        asType
      ).reduce(this.state);
    };
    _proto.isParam = function (node) {
      return this.macroExpand1(node) instanceof ParamNode;
    };
    _proto.paramIdent = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.ident;
      }
    };
    _proto.paramDefaultValue = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.defaultValue;
      }
    };
    _proto.paramIsSpread = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return !!node.spread;
      }
    };
    _proto.paramIsMutable = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return !!node.isMutable;
      }
    };
    _proto.paramType = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.asType;
      }
    };
    _proto.isArray = function (node) {
      return this.macroExpand1(node) instanceof ArrayNode;
    };
    _proto.elements = function (node) {
      node = this.macroExpand1(node);
      if (this.isArray(node)) {
        return node.elements;
      }
    };
    _proto.isObject = function (node) {
      return this.macroExpand1(node) instanceof ObjectNode;
    };
    _proto.pairs = function (node) {
      node = this.macroExpand1(node);
      if (this.isObject(node)) {
        return node.pairs;
      }
    };
    _proto.isBlock = function (node) {
      return this.macroExpand1(node) instanceof BlockNode;
    };
    _proto.nodes = function (node) {
      node = this.macroExpand1(node);
      if (this.isBlock(node)) {
        return node.nodes;
      }
    };
    _proto.array = function (elements) {
      var _i, _len, _this;
      _this = this;
      if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Node)) {
            throw TypeError("Expected elements[" + _i + "] to be a Node, got " + __typeof(elements[_i]));
          }
        }
      }
      return this.state.array(0, (function () {
        var _arr, _i, _len, element;
        for (_arr = [], _i = 0, _len = __num(elements.length); _i < _len; ++_i) {
          element = elements[_i];
          _arr.push(doWrap(element));
        }
        return _arr;
      }())).reduce(this.state);
    };
    _proto.object = function (pairs) {
      var _len, _this, i, pair;
      _this = this;
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be a Array, got " + __typeof(pairs));
      }
      for (i = 0, _len = __num(pairs.length); i < _len; ++i) {
        pair = pairs[i];
        if (!pair || typeof pair !== "object") {
          throw Error("Expected an object at index #" + __strnum(i) + ", got " + __typeof(pair));
        } else if (!(pair.key instanceof Node)) {
          throw Error("Expected an object with Node 'key' at index #" + __strnum(i) + ", got " + __typeof(pair.key));
        } else if (!(pair.value instanceof Node)) {
          throw Error("Expected an object with Node 'value' at index #" + __strnum(i) + ", got " + __typeof(pair.value));
        }
      }
      return this.state.object(0, (function () {
        var _arr, _i, _len, _ref, key, value;
        for (_arr = [], _i = 0, _len = __num(pairs.length); _i < _len; ++_i) {
          key = (_ref = pairs[_i]).key;
          value = _ref.value;
          _arr.push({ key: doWrap(key), value: doWrap(value) });
        }
        return _arr;
      }())).reduce(this.state);
    };
    _proto.isComplex = function (node) {
      node = this.macroExpand1(node);
      return node != null && !(node instanceof ConstNode) && !(node instanceof IdentNode) && !(node instanceof TmpNode) && !(node instanceof ThisNode) && !(node instanceof ArgsNode) && (!(node instanceof BlockNode) || node.nodes.length !== 0);
    };
    _proto.isTypeArray = function (node) {
      return this.macroExpand1(node) instanceof TypeArrayNode;
    };
    _proto.subtype = function (node) {
      node = this.macroExpand1(node);
      return this.isTypeArray(node) && node.subtype;
    };
    _proto.isThis = function (node) {
      return this.macroExpand1(node) instanceof ThisNode;
    };
    _proto.isArguments = function (node) {
      node = this.macroExpand1(node);
      return node instanceof ArgsNode;
    };
    _proto.isDef = function (node) {
      return this.macroExpand1(node) instanceof DefNode;
    };
    _proto.isAssign = function (node) {
      return this.macroExpand1(node) instanceof AssignNode;
    };
    _proto.isBinary = function (node) {
      return this.macroExpand1(node) instanceof BinaryNode;
    };
    _proto.isUnary = function (node) {
      return this.macroExpand1(node) instanceof UnaryNode;
    };
    _proto.op = function (node) {
      node = this.macroExpand1(node);
      if (this.isAssign(node) || this.isBinary(node) || this.isUnary(node)) {
        return node.op;
      }
    };
    _proto.left = function (node) {
      node = this.macroExpand1(node);
      if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
        return node.left;
      }
    };
    _proto.right = function (node) {
      node = this.macroExpand1(node);
      if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
        return node.right;
      }
    };
    _proto.unaryNode = function (node) {
      node = this.macroExpand1(node);
      if (this.isUnary(node)) {
        return node.node;
      }
    };
    _proto.isAccess = function (node) {
      return this.macroExpand1(node) instanceof AccessNode;
    };
    _proto.parent = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof AccessNode) {
        return node.parent;
      }
    };
    _proto.child = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof AccessNode) {
        return node.child;
      }
    };
    _proto.cache = function (node, init, name, save) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (name == void 0) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == void 0) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      return this.maybeCache(
        node,
        function (setNode, node, cached) {
          if (cached) {
            init.push(setNode);
          }
          return node;
        },
        name,
        save
      );
    };
    _proto.maybeCache = function (node, func, name, save) {
      var tmp;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (name == void 0) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == void 0) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      node = this.macroExpand1(node);
      if (this.isComplex(node)) {
        tmp = this.tmp(name, save, node.type(this.state));
        return func(
          this.state.block(this.index, [
            this.state["var"](this.index, tmp, false),
            this.state.assign(this.index, tmp, "=", node.doWrap())
          ]),
          tmp,
          true
        );
      } else {
        return func(node, node, false);
      }
    };
    _proto.maybeCacheAccess = function (node, func, parentName, childName, save) {
      var _this;
      _this = this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (parentName == void 0) {
        parentName = "ref";
      } else if (typeof parentName !== "string") {
        throw TypeError("Expected parentName to be a String, got " + __typeof(parentName));
      }
      if (childName == void 0) {
        childName = "ref";
      } else if (typeof childName !== "string") {
        throw TypeError("Expected childName to be a String, got " + __typeof(childName));
      }
      if (save == void 0) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      node = this.macroExpand1(node);
      if (this.isAccess(node)) {
        return this.maybeCache(
          this.parent(node),
          function (setParent, parent, parentCached) {
            return _this.maybeCache(
              _this.child(node),
              function (setChild, child, childCached) {
                if (parentCached || childCached) {
                  return func(
                    _this.state.access(_this.index, setParent, setChild),
                    _this.state.access(_this.index, parent, child),
                    true
                  );
                } else {
                  return func(node, node, false);
                }
              },
              childName,
              save
            );
          },
          parentName,
          save
        );
      } else {
        return func(node, node, false);
      }
    };
    _proto.empty = function (node) {
      var _this;
      _this = this;
      if (node == null) {
        return true;
      } else if (!(node instanceof Node)) {
        return false;
      } else if (node instanceof BlockNode) {
        return (function () {
          var _arr, _i, _len, item;
          for (_arr = node.nodes, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            item = _arr[_i];
            if (!_this.empty(item)) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return node instanceof NothingNode;
      }
    };
    function constifyArray(array, startIndex, endIndex) {
      return ArrayNode(startIndex, endIndex, (function () {
        var _arr, _i, _len, x;
        for (_arr = [], _i = 0, _len = __num(array.length); _i < _len; ++_i) {
          x = array[_i];
          _arr.push(constifyObject(x, startIndex, endIndex));
        }
        return _arr;
      }()));
    }
    function constifyObject(obj, startIndex, endIndex) {
      if (!obj || typeof obj !== "object" || obj instanceof RegExp) {
        return ConstNode(startIndex, endIndex, obj);
      } else if (Array.isArray(obj)) {
        return constifyArray(obj, startIndex, endIndex);
      } else if (obj instanceof IdentNode && __num(obj.name.length) > 1 && obj.name.charCodeAt(0) === 36) {
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          IdentNode(obj.startIndex, obj.endIndex, "__wrap"),
          [IdentNode(obj.startIndex, obj.endIndex, obj.name.substring(1))]
        );
      } else if (obj instanceof CallNode && !obj.isNew && !obj.isApply && obj.func instanceof IdentNode && obj.func.name === "$") {
        if (obj.args.length !== 1 || obj.args[0] instanceof SpreadNode) {
          throw Error("Can only use $() in an AST if it has one argument.");
        }
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          IdentNode(obj.startIndex, obj.endIndex, "__wrap"),
          obj.args
        );
      } else if (obj instanceof MacroAccessNode) {
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          IdentNode(obj.startIndex, obj.endIndex, "__macro"),
          [
            ConstNode(obj.startIndex, obj.endIndex, obj.id),
            ConstNode(obj.startIndex, obj.endIndex, obj.line),
            constifyObject(obj.data, obj.startIndex, obj.endIndex),
            ConstNode(obj.startIndex, obj.endIndex, obj.position),
            ConstNode(obj.startIndex, obj.endIndex, obj.inGenerator)
          ]
        );
      } else if (obj instanceof Node) {
        if (obj.constructor === Node) {
          throw Error("Cannot constify a raw node");
        }
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          IdentNode(obj.startIndex, obj.endIndex, "__node"),
          [
            ConstNode(obj.startIndex, obj.endIndex, obj.constructor.cappedName),
            ConstNode(obj.startIndex, obj.endIndex, obj.startIndex),
            ConstNode(obj.startIndex, obj.endIndex, obj.endIndex)
          ].concat(__toArray((function () {
            var _arr, _arr2, _i, _len, k;
            for (_arr = [], _arr2 = obj.constructor.argNames, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              k = _arr2[_i];
              _arr.push(constifyObject(obj[k], startIndex, endIndex));
            }
            return _arr;
          }())))
        );
      } else {
        return ObjectNode(startIndex, endIndex, (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns(obj, k)) {
              v = obj[k];
              _arr.push({
                key: ConstNode(startIndex, endIndex, k),
                value: constifyObject(v, startIndex, endIndex)
              });
            }
          }
          return _arr;
        }()));
      }
    }
    MacroHelper.constifyObject = constifyObject;
    function walk(node, func) {
      var _ref;
      if (!node || typeof node !== "object" || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to walk through: " + __typeof(node));
      }
      if (!(node instanceof BlockNode) && (_ref = func(node)) != null) {
        return _ref;
      }
      return node.walk(function (x) {
        return walk(x, func);
      });
    }
    _proto.wrap = function (value) {
      var _ref;
      if (value == void 0) {
        value = [];
      }
      if (Array.isArray(value)) {
        return BlockNode(0, 0, value).reduce(this.state);
      } else if (value instanceof Node) {
        return value;
      } else if (value instanceof RegExp || value === null || (_ref = typeof value) === "undefined" || _ref === "string" || _ref === "boolean" || _ref === "number") {
        return ConstNode(0, 0, value);
      } else {
        return value;
      }
    };
    _proto.node = function (type, startIndex, endIndex) {
      var args;
      args = __slice(arguments, 3);
      return Node[type].apply(Node, [startIndex, endIndex].concat(__toArray(args))).reduce(this.state);
    };
    _proto.walk = function (node, func) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      return walk(node, func);
    };
    _proto.hasFunc = function (node) {
      var FOUND;
      FOUND = {};
      function walker(x) {
        if (x instanceof FunctionNode) {
          throw FOUND;
        } else {
          return x.walk(walker);
        }
      }
      try {
        walk(this.macroExpandAll(node), walker);
      } catch (e) {
        if (e !== FOUND) {
          throw e;
        }
        return true;
      }
      return false;
    };
    _proto.isStatement = function (node) {
      node = this.macroExpand1(node);
      return node instanceof Node && node.isStatement();
    };
    _proto.isType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      type = __owns(Type, name) ? Type[name] : void 0;
      if (type == null || !(type instanceof Type)) {
        throw Error(__strnum(name) + " is not a known type name");
      }
      return node.type(this.state).isSubsetOf(type);
    };
    _proto.hasType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      type = __owns(Type, name) ? Type[name] : void 0;
      if (type == null || !(type instanceof Type)) {
        throw Error(__strnum(name) + " is not a known type name");
      }
      return node.type(this.state).overlaps(type);
    };
    mutators = {
      Block: function (x, func) {
        var lastNode, len, nodes;
        nodes = x.nodes;
        len = nodes.length;
        if (len !== 0) {
          lastNode = this.mutateLast(nodes[__num(len) - 1], func);
          if (lastNode !== nodes[__num(len) - 1]) {
            return BlockNode(x.startIndex, x.endIndex, __slice(nodes, void 0, __num(len) - 1).concat([lastNode]));
          }
        }
        return x;
      },
      If: function (x, func) {
        var whenFalse, whenTrue;
        whenTrue = this.mutateLast(x.whenTrue, func);
        whenFalse = this.mutateLast(x.whenFalse, func);
        if (whenTrue !== x.whenTrue || whenFalse !== x.whenFalse) {
          return IfNode(
            x.startIndex,
            x.endIndex,
            x.test,
            whenTrue,
            whenFalse
          );
        } else {
          return x;
        }
      },
      TmpWrapper: function (x, func) {
        var node;
        node = this.mutateLast(x.node, func);
        if (node !== x.node) {
          return TmpWrapperNode(x.startIndex, x.endIndex, node, x.tmps);
        } else {
          return x;
        }
      },
      MacroAccess: function (x, func) {
        return this.mutateLast(this.macroExpand1(x), func);
      },
      Break: identity,
      Continue: identity,
      Nothing: identity,
      Return: identity,
      Debugger: identity,
      Throw: identity
    };
    _proto.mutateLast = function (node, func) {
      var _ref;
      if (!node || typeof node !== "object" || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to mutate-last through: " + __typeof(node));
      }
      if (!__owns(mutators, node.constructor.cappedName)) {
        if ((_ref = func(node)) != null) {
          return _ref;
        } else {
          return node;
        }
      } else {
        return mutators[node.constructor.cappedName].call(this, node, func);
      }
    };
    return MacroHelper;
  }());
  function oneOf(rules) {
    var _i, _len, i, name, rule;
    if (!__isArray(rules)) {
      throw TypeError("Expected rules to be an Array, got " + __typeof(rules));
    } else {
      for (_i = 0, _len = rules.length; _i < _len; ++_i) {
        if (typeof rules[_i] !== "function") {
          throw TypeError("Expected rules[" + _i + "] to be a Function, got " + __typeof(rules[_i]));
        }
      }
    }
    name = ["("];
    for (i = 0, _len = __num(rules.length); i < _len; ++i) {
      rule = rules[i];
      if (__num(i) > 0) {
        name.push(" | ");
      }
      name.push(rule.parserName || "<unknown>");
    }
    name.push(")");
    return named(name.join(""), function (o) {
      var _i, _len, result, rule;
      for (_i = 0, _len = __num(rules.length); _i < _len; ++_i) {
        rule = rules[_i];
        result = rule(o);
        if (result) {
          return result;
        }
      }
      return false;
    });
  }
  MacroHolder = (function () {
    var _proto;
    function MacroHolder() {
      var _this;
      _this = this instanceof MacroHolder ? this : __create(_proto);
      _this.byName = {};
      _this.byId = [];
      _this.typeById = [];
      _this.operatorNames = {};
      _this.binaryOperators = [];
      _this.binaryOperatorsByName = {};
      _this.assignOperators = [];
      _this.prefixUnaryOperators = [];
      _this.postfixUnaryOperators = [];
      _this.serialization = {};
      _this.syntaxes = {
        Logic: Logic,
        Expression: Expression,
        Assignment: Assignment,
        ExpressionOrAssignment: ExpressionOrAssignment,
        FunctionDeclaration: FunctionDeclaration,
        Statement: Statement,
        Body: Body,
        Identifier: Identifier,
        SimpleAssignable: SimpleAssignable,
        Parameter: Parameter,
        ObjectLiteral: ObjectLiteral,
        UnclosedObjectLiteral: UnclosedObjectLiteral,
        ArrayLiteral: ArrayLiteral,
        DedentedBody: DedentedBody,
        ObjectKey: ObjectKey
      };
      return _this;
    }
    _proto = MacroHolder.prototype;
    MacroHolder.displayName = "MacroHolder";
    _proto.clone = function () {
      var clone;
      clone = MacroHolder();
      clone.byName = copy(this.byName);
      clone.byId = __slice(this.byId, void 0, void 0);
      clone.typeById = __slice(this.typeById, void 0, void 0);
      clone.operatorNames = copy(this.operatorNames);
      clone.binaryOperators = __slice(this.binaryOperators, void 0, void 0);
      clone.binaryOperatorsByName = copy(this.binaryOperatorsByName);
      clone.assignOperators = __slice(this.assignOperators, void 0, void 0);
      clone.prefixUnaryOperators = __slice(this.prefixUnaryOperators, void 0, void 0);
      clone.postfixUnaryOperators = __slice(this.postfixUnaryOperators, void 0, void 0);
      clone.serialization = copy(this.serialization);
      clone.syntaxes = copy(this.syntaxes);
      return clone;
    };
    _proto.getByName = function (name) {
      var _ref;
      if (__owns(_ref = this.byName, name)) {
        return _ref[name];
      }
    };
    _proto.getOrAddByName = function (name) {
      var _this, byName, m, token;
      _this = this;
      byName = this.byName;
      if (__owns(byName, name)) {
        return byName[name];
      } else {
        token = macroName(name);
        m = (function () {
          var _backend;
          _backend = named("<" + __strnum(name) + " macro>", function (o) {
            var _arr, _i, _len, item, result;
            for (_arr = m.data, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
              item = _arr[_i];
              result = item(o);
              if (result) {
                return result;
              }
            }
            return false;
          });
          return named(
            (_backend != null ? _backend.parserName : void 0) || "<unknown>",
            function (o) {
              var result;
              if (!token(o.clone())) {
                return false;
              } else {
                result = _backend(o);
                if (!result) {
                  throw SHORT_CIRCUIT;
                }
                return result;
              }
            }
          );
        }());
        m.token = token;
        m.data = [];
        return byName[name] = m;
      }
    };
    _proto.getOrAddByNames = function (names) {
      var _this;
      _this = this;
      if (!__isArray(names)) {
        throw TypeError("Expected names to be a Array, got " + __typeof(names));
      }
      return (function () {
        var _arr, _i, _len, name;
        for (_arr = [], _i = 0, _len = __num(names.length); _i < _len; ++_i) {
          name = names[_i];
          _arr.push(_this.getOrAddByName(name));
        }
        return _arr;
      }());
    };
    _proto.setTypeById = function (id, type) {
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      this.typeById[id] = type;
    };
    _proto.getTypeById = function (id) {
      return this.typeById[id];
    };
    _proto.getById = function (id) {
      var byId;
      byId = this.byId;
      if (__num(id) >= 0 && __lt(id, byId.length)) {
        return byId[id];
      }
    };
    _proto.addMacro = function (m, macroId, type) {
      var byId;
      if (macroId == void 0) {
        macroId = void 0;
      } else if (typeof macroId !== "number") {
        throw TypeError("Expected macroId to be a Number or undefined, got " + __typeof(macroId));
      }
      if (type == void 0) {
        type = void 0;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type or undefined, got " + __typeof(type));
      }
      byId = this.byId;
      if (macroId != null) {
        if (__owns(byId, macroId)) {
          throw Error("Cannot add macro #" + __strnum(macroId) + ", as it already exists");
        }
        byId[macroId] = m;
      } else {
        byId.push(m);
        macroId = __num(byId.length) - 1;
      }
      if (type != null) {
        this.typeById[macroId] = type;
      }
      return macroId;
    };
    _proto.replaceMacro = function (id, m, type) {
      var byId;
      if (type == void 0) {
        type = void 0;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type or undefined, got " + __typeof(type));
      }
      byId = this.byId;
      byId[id] = m;
      if (type != null) {
        this.typeById[id] = type;
      }
    };
    _proto.hasMacroOrOperator = function (name) {
      return __owns(this.byName, name) || __owns(this.operatorNames, name);
    };
    _proto.getMacroAndOperatorNames = function () {
      var _obj, name, names;
      names = [];
      _obj = this.byName;
      for (name in _obj) {
        if (__owns(_obj, name)) {
          names.push(name);
        }
      }
      _obj = this.operatorNames;
      for (name in _obj) {
        if (__owns(_obj, name)) {
          names.push(name);
        }
      }
      return names;
    };
    _proto.addBinaryOperator = function (operators, m, options, macroId) {
      var _i, _len, _ref, _ref2, _this, binaryOperators, data, op, precedence;
      _this = this;
      for (_i = 0, _len = __num(operators.length); _i < _len; ++_i) {
        op = operators[_i];
        this.operatorNames[op] = true;
      }
      precedence = Number(options.precedence) || 0;
      binaryOperators = (_ref = (_ref2 = this.binaryOperators)[precedence]) != null ? _ref : (_ref2[precedence] = []);
      data = {
        rule: oneOf((function () {
          var _arr, _i, _len, op;
          for (_arr = [], _i = 0, _len = __num(operators.length); _i < _len; ++_i) {
            op = operators[_i];
            _arr.push(wordOrSymbol(op));
          }
          return _arr;
        }())),
        func: m,
        rightToLeft: !!options.rightToLeft,
        maximum: options.maximum || 0,
        minimum: options.minimum || 0,
        invertible: !!options.invertible
      };
      binaryOperators.push(data);
      for (_i = 0, _len = __num(operators.length); _i < _len; ++_i) {
        op = operators[_i];
        this.binaryOperatorsByName[op] = data;
      }
      return this.addMacro(m, macroId, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _proto.getBinaryOperatorByName = function (op) {
      var _ref;
      if (__owns(_ref = this.binaryOperatorsByName, op)) {
        return _ref[op];
      }
    };
    _proto.addAssignOperator = function (operators, m, options, macroId) {
      var _i, _len, _ref, _this, op;
      _this = this;
      for (_i = 0, _len = __num(operators.length); _i < _len; ++_i) {
        op = operators[_i];
        this.operatorNames[op] = true;
      }
      this.assignOperators.push({
        rule: oneOf((function () {
          var _arr, _i, _len, op;
          for (_arr = [], _i = 0, _len = __num(operators.length); _i < _len; ++_i) {
            op = operators[_i];
            _arr.push(wordOrSymbol(op));
          }
          return _arr;
        }())),
        func: m
      });
      return this.addMacro(m, macroId, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _proto.addUnaryOperator = function (operators, m, options, macroId) {
      var _i, _len, _ref, _this, data, op;
      _this = this;
      for (_i = 0, _len = __num(operators.length); _i < _len; ++_i) {
        op = operators[_i];
        this.operatorNames[op] = true;
      }
      data = options.postfix ? this.postfixUnaryOperators : this.prefixUnaryOperators;
      data.push({
        rule: oneOf((function () {
          var _arr, _i, _len, op, rule;
          for (_arr = [], _i = 0, _len = __num(operators.length); _i < _len; ++_i) {
            op = operators[_i];
            rule = wordOrSymbol(op);
            if (!/[a-zA-Z]/.test(op)) {
              if (options.postfix) {
                _arr.push(sequential([
                  NoSpace,
                  ["this", rule]
                ]));
              } else {
                _arr.push(sequential([
                  ["this", rule],
                  NoSpace
                ]));
              }
            } else {
              _arr.push(rule);
            }
          }
          return _arr;
        }())),
        func: m,
        standalone: __owns(!options, "standalone") || !!options.standalone
      });
      return this.addMacro(m, macroId, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _proto.addSerializedHelper = function (name, value) {
      var _ref, _ref2, helpers;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      helpers = (_ref = (_ref2 = this.serialization).helpers) != null ? _ref : (_ref2.helpers = {});
      helpers[name] = value;
    };
    _proto.addMacroSerialization = function (serialization) {
      var _ref, _ref2, _ref3, byType, obj;
      if (!(serialization instanceof Object)) {
        throw TypeError("Expected serialization to be a Object, got " + __typeof(serialization));
      }
      if (typeof serialization.type !== "string") {
        throw Error("Expected a string type");
      }
      obj = copy(serialization);
      delete obj.type;
      byType = (_ref = (_ref2 = this.serialization)[_ref3 = serialization.type]) != null ? _ref : (_ref2[_ref3] = []);
      byType.push(obj);
    };
    _proto.addSyntax = function (name, value) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (typeof value !== "function") {
        throw TypeError("Expected value to be a Function, got " + __typeof(value));
      }
      if (__owns(this.syntaxes, name)) {
        throw Error("Cannot override already-defined syntax: " + __strnum(name));
      }
      this.syntaxes[name] = value;
    };
    _proto.hasSyntax = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns(this.syntaxes, name);
    };
    _proto.getSyntax = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns(this.syntaxes, name)) {
        return this.syntaxes[name];
      } else {
        throw Error("Unknown syntax: " + __strnum(name));
      }
    };
    _proto.serialize = function () {
      return JSON.stringify(this.serialization);
    };
    _proto.deserialize = function (data) {
      var _obj, _ref, ast, name, translator, value;
      translator = require("./translator");
      ast = require("./ast");
      _obj = (_ref = __owns(data, "helpers") ? data.helpers : void 0) != null ? _ref : {};
      for (name in _obj) {
        if (__owns(_obj, name)) {
          value = _obj[name];
          translator.defineHelper(name, ast.fromJSON(value));
        }
      }
      State("", this).deserializeMacros(data);
    };
    return MacroHolder;
  }());
  Node = (function () {
    var _proto;
    function Node() {
      if (!(this instanceof Node)) {
        throw TypeError("Node must be called with new");
      }
      throw Error("Node should not be instantiated directly");
    }
    _proto = Node.prototype;
    Node.displayName = "Node";
    _proto.type = function () {
      return Type.any;
    };
    _proto.walk = function () {
      return this;
    };
    _proto.cacheable = true;
    _proto._reduce = function (o) {
      return this.walk(function (node) {
        return node.reduce(o);
      });
    };
    _proto.reduce = function (o) {
      var _ref, reduced;
      if (!(o instanceof State)) {
        throw TypeError("Expected o to be a State, got " + __typeof(o));
      }
      if (this._reduced != null) {
        return this._reduced;
      } else {
        reduced = this._reduce(o);
        if (reduced === this) {
          return this._reduced = this;
        } else {
          return this._reduced = (_ref = reduced._reduced) != null ? _ref : (reduced._reduced = reduced);
        }
      }
    };
    _proto.isConst = function () {
      return false;
    };
    _proto.constValue = function () {
      throw Error("Not a const: " + __typeof(node));
    };
    _proto.isStatement = function () {
      return false;
    };
    _proto.doWrap = function () {
      if (this.isStatement()) {
        return CallNode(
          this.startIndex,
          this.endIndex,
          FunctionNode(
            this.startIndex,
            this.endIndex,
            [],
            this,
            true,
            true
          ),
          []
        );
      } else {
        return this;
      }
    };
    return Node;
  }());
  State = (function () {
    var _proto, ASSIGN_OPERATOR, BINARY_OPERATOR, DEFINE_SYNTAX, macroDeserializers, macroSyntaxConstLiterals, macroSyntaxTypes, UNARY_OPERATOR;
    function State(data, macros, options, index, line, failures, cache, indent, currentMacro, preventFailures) {
      var _this;
      if (macros == void 0) {
        macros = MacroHolder();
      }
      if (options == void 0) {
        options = {};
      }
      if (index == void 0) {
        index = 0;
      }
      if (line == void 0) {
        line = 1;
      }
      if (failures == void 0) {
        failures = FailureManager();
      }
      if (cache == void 0) {
        cache = [];
      }
      if (indent == void 0) {
        indent = Stack(1);
      }
      if (currentMacro == void 0) {
        currentMacro = null;
      }
      if (preventFailures == void 0) {
        preventFailures = 0;
      }
      _this = this instanceof State ? this : __create(_proto);
      _this.data = data;
      _this.macros = macros;
      _this.options = options;
      _this.index = index;
      _this.line = line;
      _this.failures = failures;
      _this.cache = cache;
      _this.indent = indent;
      _this.currentMacro = currentMacro;
      _this.preventFailures = preventFailures;
      _this.expandingMacros = false;
      return _this;
    }
    _proto = State.prototype;
    State.displayName = "State";
    _proto.clone = function (newScope) {
      if (newScope == void 0) {
        newScope = false;
      } else if (typeof newScope !== "boolean") {
        throw TypeError("Expected newScope to be a Boolean, got " + __typeof(newScope));
      }
      return State(
        this.data,
        this.macros,
        this.options,
        this.index,
        this.line,
        this.failures,
        this.cache,
        this.indent.clone(),
        this.currentMacro,
        this.preventFailures
      );
    };
    _proto.update = function (clone) {
      this.index = clone.index;
      this.line = clone.line;
      this.indent = clone.indent.clone();
      this.macros = clone.macros;
    };
    _proto.fail = function (message) {
      if (!this.preventFailures) {
        this.failures.add(message, this.index, this.line);
      }
    };
    _proto.preventFail = function () {
      ++this.preventFailures;
    };
    _proto.unpreventFail = function () {
      --this.preventFailures;
    };
    _proto.error = function (message) {
      throw ParserError(message, this.data, this.index, this.line);
    };
    _proto.enterMacro = function (names, func) {
      if (!names) {
        throw Error("Must provide a macro name");
      }
      if (this.currentMacro) {
        this.error("Attempting to define a macro " + String(names) + " inside a macro " + String(this.currentMacro));
      }
      try {
        this.currentMacro = names;
        func();
      } finally {
        this.currentMacro = null;
      }
      return this.nothing(this.index);
    };
    _proto.defineHelper = function (i, name, value) {
      var helper, translator;
      if (!(name instanceof IdentNode)) {
        throw TypeError("Expected name to be a IdentNode, got " + __typeof(name));
      }
      if (!(value instanceof Node)) {
        throw TypeError("Expected value to be a Node, got " + __typeof(value));
      }
      translator = require("./translator");
      helper = translator.defineHelper(name, this.macroExpandAll(value).reduce(this));
      if (this.options.serializeMacros) {
        this.macros.addSerializedHelper(name.name, helper);
      }
      return this.nothing(i);
    };
    macroSyntaxConstLiterals = {
      ",": Comma,
      ";": Semicolon,
      ":": Colon,
      "": Nothing,
      "\n": NewlineWithCheckIndent,
      "(": OpenParenthesis,
      ")": CloseParenthesis,
      "[": OpenSquareBracket,
      "]": CloseSquareBracket,
      "{": OpenCurlyBrace,
      "}": CloseCurlyBrace
    };
    function reduceObject(o, obj) {
      var k, result, v;
      if (Array.isArray(obj)) {
        return (function () {
          var _arr, _i, _len, item;
          for (_arr = [], _i = 0, _len = __num(obj.length); _i < _len; ++_i) {
            item = obj[_i];
            _arr.push(reduceObject(o, item));
          }
          return _arr;
        }());
      } else if (obj instanceof Node) {
        return obj.reduce(o);
      } else if (typeof obj === "object" && obj !== null) {
        result = {};
        for (k in obj) {
          if (__owns(obj, k)) {
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
      return this.root(index, this["return"](
        index,
        this["function"](
          index,
          [
            params,
            this.param(
              index,
              this.ident(index, "__wrap"),
              void 0,
              false,
              true,
              void 0
            ),
            this.param(
              index,
              this.ident(index, "__node"),
              void 0,
              false,
              true,
              void 0
            ),
            this.param(
              index,
              this.ident(index, "__macro"),
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
        return { type: "ident", name: asType.name };
      } else if (asType instanceof SyntaxSequenceNode) {
        return { type: "sequence", items: serializeParams(asType.params) };
      } else if (asType instanceof SyntaxChoiceNode) {
        return {
          type: "choice",
          choices: (function () {
            var _arr, _arr2, _i, _len, choice;
            for (_arr = [], _arr2 = asType.choices, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              choice = _arr2[_i];
              _arr.push(serializeParamType(choice));
            }
            return _arr;
          }())
        };
      } else if (asType.isConst()) {
        return { type: "const", value: asType.constValue() };
      } else if (asType instanceof SyntaxManyNode) {
        return { type: "many", multiplier: asType.multiplier, inner: serializeParamType(asType.inner) };
      } else {
        throw Error();
      }
    }
    function serializeParams(params) {
      var _this;
      _this = this;
      return (function () {
        var _arr, _f, _i, _len;
        for (_arr = [], _i = 0, _len = __num(params.length), _f = function (_i) {
          var ident, param, value;
          param = params[_i];
          if (param.isConst()) {
            return { type: "const", value: param.constValue() };
          } else if (param instanceof SyntaxParamNode) {
            ident = param.ident;
            value = ident instanceof IdentNode ? { type: "ident", name: ident.name }
              : ident instanceof ThisNode ? { type: "this" }
              : (function () {
                throw Error();
              }());
            if (param.asType) {
              value.asType = serializeParamType(param.asType);
            }
            return value;
          } else {
            throw Error();
          }
        }; _i < _len; ++_i) {
          _arr.push(_f.call(_this, _i));
        }
        return _arr;
      }());
    }
    function deserializeParamType(asType) {
      if (asType == null) {
        return;
      }
      switch (asType.type) {
      case "ident":
        return IdentNode(0, 0, asType.name);
      case "sequence":
        return SyntaxSequenceNode(0, 0, deserializeParams(asType.items));
      case "choice":
        return SyntaxChoiceNode(0, 0, (function () {
          var _arr, _arr2, _i, _len, choice;
          for (_arr = [], _arr2 = asType.choices, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
            choice = _arr2[_i];
            _arr.push(deserializeParamType(choice));
          }
          return _arr;
        }()));
      case "const":
        return ConstNode(0, 0, asType.value);
      case "many":
        return SyntaxManyNode(0, 0, deserializeParamType(asType.inner), asType.multiplier);
      default:
        throw Error("Unknown as-type: " + String(asType.type));
      }
    }
    function deserializeParams(params) {
      var _this;
      _this = this;
      return (function () {
        var _arr, _f, _i, _len;
        for (_arr = [], _i = 0, _len = __num(params.length), _f = function (_i) {
          var node, param;
          param = params[_i];
          if (param.type === "const") {
            return ConstNode(0, 0, param.value);
          } else {
            node = param.type === "ident" ? IdentNode(0, 0, param.name)
              : param.type === "this" ? ThisNode(0, 0)
              : (function () {
                throw Error("Unknown param: " + String(param.type));
              }());
            return SyntaxParamNode(0, 0, node, deserializeParamType(param.asType));
          }
        }; _i < _len; ++_i) {
          _arr.push(_f.call(_this, _i));
        }
        return _arr;
      }());
    }
    function calcParam(param) {
      var _this, calced, macros, multiplier, name, string;
      _this = this;
      if (param instanceof IdentNode) {
        name = param.name;
        macros = this.macros;
        if (macros.hasSyntax(name)) {
          return macros.getSyntax(name);
        } else {
          return named(name, function (o) {
            return macros.getSyntax(name).call(this, o);
          });
        }
      } else if (param instanceof SyntaxSequenceNode) {
        return handleParams.call(this, param.params);
      } else if (param instanceof SyntaxChoiceNode) {
        return cache(oneOf((function () {
          var _arr, _arr2, _i, _len, choice;
          for (_arr = [], _arr2 = param.choices, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
            choice = _arr2[_i];
            _arr.push(calcParam.call(_this, choice));
          }
          return _arr;
        }())));
      } else if (param.isConst()) {
        string = param.constValue();
        if (typeof string !== "string") {
          this.error("Expected a constant string parameter, got " + __typeof(string));
        }
        return (__owns(macroSyntaxConstLiterals, string) ? macroSyntaxConstLiterals[string] : void 0) || wordOrSymbol(string);
      } else if (param instanceof SyntaxManyNode) {
        multiplier = param.multiplier;
        calced = calcParam.call(this, param.inner);
        switch (multiplier) {
        case "*":
          return named(
            __strnum((calced != null ? calced.parserName : void 0) || "calced") + "*",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = calced(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              o.update(clone);
              return result;
            }
          );
        case "+":
          return named(
            __strnum((calced != null ? calced.parserName : void 0) || "calced") + "+",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              for (; ; ) {
                item = calced(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (__num(result.length) >= 1) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
          );
        case "?":
          return (function () {
            function _missing(x, o, i) {
              return o.nothing(i);
            }
            return named(
              __strnum((calced != null ? calced.parserName : void 0) || "calced") + "?",
              function (o) {
                var clone, index, line, result;
                index = o.index;
                line = o.line;
                clone = o.clone();
                result = calced(clone);
                if (!result) {
                  if (typeof _missing === "function") {
                    return _missing(void 0, o, index, line);
                  } else {
                    return _missing;
                  }
                } else {
                  o.update(clone);
                  return result;
                }
              }
            );
          }());
        default:
          throw Error("Unknown syntax multiplier: " + __strnum(multiplier));
        }
      } else {
        return this.error("Unexpected type: " + __typeof(param));
      }
    }
    function handleParams(params) {
      var _f, _i, _len, sequence;
      sequence = [];
      for (_i = 0, _len = __num(params.length), _f = function (_i) {
        var _ref, _this, ident, key, param, string, type;
        _this = this;
        param = params[_i];
        if (param.isConst()) {
          string = param.constValue();
          if (typeof string !== "string") {
            this.error("Expected a constant string parameter, got " + __typeof(string));
          }
          return sequence.push((__owns(macroSyntaxConstLiterals, string) ? macroSyntaxConstLiterals[string] : void 0) || wordOrSymbol(string));
        } else if (param instanceof SyntaxParamNode) {
          ident = param.ident;
          key = ident instanceof IdentNode ? ident.name
            : ident instanceof ThisNode ? "this"
            : (function () {
              throw Error("Don't know how to handle ident type: " + __typeof(ident));
            }());
          type = (_ref = param.asType) != null ? _ref : IdentNode(0, 0, "Expression");
          return sequence.push([
            key,
            calcParam.call(this, type)
          ]);
        } else {
          return this.error("Unexpected parameter type: " + __typeof(param));
        }
      }; _i < _len; ++_i) {
        _f.call(this, _i);
      }
      return sequential(sequence);
    }
    macroSyntaxTypes = {
      syntax: function (index, params, body, options, stateOptions) {
        var _this, compilation, funcParams, handler, rawFunc, serialization, state, translated;
        _this = this;
        funcParams = this.objectParam(index, [
          {
            key: this["const"](index, "macroName"),
            value: this.param(
              index,
              this.ident(index, "macroName"),
              void 0,
              false,
              true,
              void 0
            )
          },
          {
            key: this["const"](index, "macroData"),
            value: this.objectParam(index, (function () {
              var _arr, _i, _len, param;
              for (_arr = [], _i = 0, _len = __num(params.length); _i < _len; ++_i) {
                param = params[_i];
                if (param instanceof SyntaxParamNode) {
                  _arr.push({
                    key: _this["const"](index, param.ident.name),
                    value: _this.param(
                      index,
                      param.ident,
                      void 0,
                      false,
                      true,
                      void 0
                    )
                  });
                }
              }
              return _arr;
            }()))
          }
        ]);
        rawFunc = makeMacroRoot.call(this, index, funcParams, body);
        translated = require("./translator")(this.macroExpandAll(rawFunc).reduce(this), { "return": true });
        compilation = translated.node.toString();
        serialization = stateOptions.serializeMacros ? compilation : void 0;
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for macro: " + String(this.currentMacro));
        }
        state = this;
        return {
          handler: function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return handler.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          },
          rule: handleParams.call(this, params),
          serialization: serialization != null
            ? {
              type: "syntax",
              code: serialization,
              options: options,
              params: serializeParams(params),
              names: this.currentMacro
            }
            : void 0
        };
      },
      defineSyntax: function (index, params, body, options, stateOptions) {
        var _this, funcParams, handler, serialization, state;
        _this = this;
        funcParams = (function () {
          var _arr, _i, _len, param;
          for (_arr = [], _i = 0, _len = __num(params.length); _i < _len; ++_i) {
            param = params[_i];
            if (param instanceof SyntaxParamNode) {
              _arr.push({
                key: _this["const"](index, param.ident.name),
                value: _this.param(
                  index,
                  param.ident,
                  void 0,
                  false,
                  true,
                  void 0
                )
              });
            }
          }
          return _arr;
        }());
        serialization = void 0;
        state = this;
        handler = body != null
          ? (function () {
            var compilation, handler, rawFunc, translated;
            rawFunc = makeMacroRoot.call(
              _this,
              index,
              _this.objectParam(index, funcParams),
              body
            );
            translated = require("./translator")(_this.macroExpandAll(rawFunc).reduce(state), { "return": true });
            compilation = translated.node.toString();
            if (stateOptions.serializeMacros) {
              serialization = compilation;
            }
            handler = Function(compilation)();
            if (typeof handler !== "function") {
              throw Error("Error creating function for syntax: " + __strnum(options.name));
            }
            return function (args) {
              var rest;
              rest = __slice(arguments, 1);
              return reduceObject(state, handler.apply(this, [reduceObject(state, args)].concat(__toArray(rest))));
            };
          }())
          : function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return reduceObject(state, args);
          };
        return {
          handler: handler,
          rule: handleParams.call(this, params),
          serialization: stateOptions.serializeMacros ? { type: "defineSyntax", code: serialization, options: options, params: serializeParams(params) } : void 0
        };
      },
      call: function (index, params, body, options, stateOptions) {
        var _this, compilation, funcParams, handler, rawFunc, serialization, state, translated;
        _this = this;
        funcParams = this.objectParam(index, [
          {
            key: this["const"](index, "macroName"),
            value: this.param(
              index,
              this.ident(index, "macroName"),
              void 0,
              false,
              true,
              void 0
            )
          },
          {
            key: this["const"](index, "macroData"),
            value: this.arrayParam(index, params)
          }
        ]);
        rawFunc = makeMacroRoot.call(this, index, funcParams, body);
        translated = require("./translator")(this.macroExpandAll(rawFunc).reduce(this), { "return": true });
        compilation = translated.node.toString();
        serialization = stateOptions.serializeMacros ? compilation : void 0;
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for macro: " + __strnum(this.currentMacro));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: InvocationArguments,
          serialization: serialization != null ? { type: "call", code: serialization, options: options, names: this.currentMacro } : void 0
        };
      },
      binaryOperator: function (index, operators, body, options, stateOptions) {
        var _this, compilation, handler, rawFunc, serialization, state, translated;
        _this = this;
        rawFunc = makeMacroRoot.call(
          this,
          index,
          this.objectParam(index, [
            {
              key: this["const"](index, "left"),
              value: this.param(
                index,
                this.ident(index, "left"),
                void 0,
                false,
                true,
                void 0
              )
            },
            {
              key: this["const"](index, "op"),
              value: this.param(
                index,
                this.ident(index, "op"),
                void 0,
                false,
                true,
                void 0
              )
            },
            {
              key: this["const"](index, "right"),
              value: this.param(
                index,
                this.ident(index, "right"),
                void 0,
                false,
                true,
                void 0
              )
            }
          ]),
          body
        );
        translated = require("./translator")(this.macroExpandAll(rawFunc).reduce(this), { "return": true });
        compilation = translated.node.toString();
        serialization = stateOptions.serializeMacros ? compilation : void 0;
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for binary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice(arguments, 1);
              result = inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return UnaryNode(result.startIndex, result.endIndex, "!", result).reduce(state);
              } else {
                return result.reduce(state);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice(arguments, 1);
              return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
            };
          }(handler));
        }
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "binaryOperator", code: serialization, operators: operators, options: options } : void 0
        };
      },
      assignOperator: function (index, operators, body, options, stateOptions) {
        var _this, compilation, handler, rawFunc, serialization, state, translated;
        _this = this;
        rawFunc = makeMacroRoot.call(
          this,
          index,
          this.objectParam(index, [
            {
              key: this["const"](index, "left"),
              value: this.param(
                index,
                this.ident(index, "left"),
                void 0,
                false,
                true,
                void 0
              )
            },
            {
              key: this["const"](index, "op"),
              value: this.param(
                index,
                this.ident(index, "op"),
                void 0,
                false,
                true,
                void 0
              )
            },
            {
              key: this["const"](index, "right"),
              value: this.param(
                index,
                this.ident(index, "right"),
                void 0,
                false,
                true,
                void 0
              )
            }
          ]),
          body
        );
        translated = require("./translator")(this.macroExpandAll(rawFunc).reduce(this), { "return": true });
        compilation = translated.node.toString();
        serialization = stateOptions.serializeMacros ? compilation : void 0;
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for assign operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "assignOperator", code: serialization, operators: operators, options: options } : void 0
        };
      },
      unaryOperator: function (index, operators, body, options, stateOptions) {
        var _this, compilation, handler, rawFunc, serialization, state, translated;
        _this = this;
        rawFunc = makeMacroRoot.call(
          this,
          index,
          this.objectParam(index, [
            {
              key: this["const"](index, "op"),
              value: this.param(
                index,
                this.ident(index, "op"),
                void 0,
                false,
                true,
                void 0
              )
            },
            {
              key: this["const"](index, "node"),
              value: this.param(
                index,
                this.ident(index, "node"),
                void 0,
                false,
                true,
                void 0
              )
            }
          ]),
          body
        );
        translated = require("./translator")(this.macroExpandAll(rawFunc).reduce(this), { "return": true });
        compilation = translated.node.toString();
        serialization = stateOptions.serializeMacros ? compilation : void 0;
        handler = Function(compilation)();
        if (typeof handler !== "function") {
          throw Error("Error creating function for unary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return {
          handler: handler,
          rule: void 0,
          serialization: serialization != null ? { type: "unaryOperator", code: serialization, operators: operators, options: options } : void 0
        };
      }
    };
    macroDeserializers = {
      syntax: function (_p) {
        var _this, code, handler, id, names, options, params, state;
        _this = this;
        code = _p.code;
        params = _p.params;
        names = _p.names;
        options = _p.options;
        id = _p.id;
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for macro " + __strnum(name));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return this.enterMacro(names, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "syntax",
            handler,
            handleParams.call(_this, deserializeParams(params)),
            null,
            options,
            id
          );
        });
      },
      call: function (_p) {
        var _this, code, handler, id, names, options, state;
        _this = this;
        code = _p.code;
        names = _p.names;
        options = _p.options;
        id = _p.id;
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for macro " + __strnum(name));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return this.enterMacro(name, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "call",
            handler,
            InvocationArguments,
            null,
            options,
            id
          );
        });
      },
      defineSyntax: function (_p) {
        var _this, code, handler, id, options, params, state;
        _this = this;
        code = _p.code;
        params = _p.params;
        options = _p.options;
        id = _p.id;
        if (this.macros.hasSyntax(options.name)) {
          throw Error("Cannot override already-defined syntax: " + __strnum(options.name));
        }
        handler = void 0;
        state = this;
        if (code != null) {
          handler = Function(code)();
          if (typeof handler !== "function") {
            throw Error("Error deserializing function for macro syntax " + __strnum(options.name));
          }
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice(arguments, 1);
              return reduceObject(state, inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))));
            };
          }(handler));
        } else {
          handler = function (args) {
            return reduceObject(state, args);
          };
        }
        return this.enterMacro(DEFINE_SYNTAX, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "defineSyntax",
            handler,
            handleParams.call(_this, deserializeParams(params)),
            null,
            options,
            id
          );
        });
      },
      binaryOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        id = _p.id;
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for binary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        if (options.invertible) {
          handler = (function (inner) {
            return function (args) {
              var rest, result;
              rest = __slice(arguments, 1);
              result = inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return UnaryNode(result.startIndex, result.endIndex, "!", result).reduce(state);
              } else {
                return result.reduce(state);
              }
            };
          }(handler));
        } else {
          handler = (function (inner) {
            return function (args) {
              var rest;
              rest = __slice(arguments, 1);
              return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
            };
          }(handler));
        }
        return this.enterMacro(BINARY_OPERATOR, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "binaryOperator",
            handler,
            void 0,
            operators,
            options,
            id
          );
        });
      },
      assignOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        id = _p.id;
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for assign operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        return this.enterMacro(ASSIGN_OPERATOR, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "assignOperator",
            handler,
            void 0,
            operators,
            options,
            id
          );
        });
      },
      unaryOperator: function (_p) {
        var _this, code, handler, id, operators, options, state;
        _this = this;
        code = _p.code;
        operators = _p.operators;
        options = _p.options;
        id = _p.id;
        handler = Function(code)();
        if (typeof handler !== "function") {
          throw Error("Error deserializing function for unary operator " + __strnum(operators.join(", ")));
        }
        state = this;
        handler = (function (inner) {
          return function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest))).reduce(state);
          };
        }(handler));
        this.enterMacro(UNARY_OPERATOR, function () {
          return handleMacroSyntax.call(
            _this,
            0,
            "unaryOperator",
            handler,
            void 0,
            operators,
            options,
            id
          );
        });
      }
    };
    _proto.startMacroSyntax = function (index, params, options) {
      var _arr, _f, _i, _len, _ref, macroId, macros, rule;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be a Array, got " + __typeof(params));
      }
      if (!this.currentMacro) {
        this.error("Attempting to specify a macro syntax when not in a macro");
      }
      rule = handleParams.call(this, params);
      macros = this.macros;
      function mutator(x, o, i, line) {
        if (_inAst.peek() || !o.expandingMacros) {
          return o.macroAccess(
            i,
            macroId,
            line,
            x,
            _position.peek(),
            _inGenerator.peek()
          );
        } else {
          throw Error("Cannot use macro until fully defined");
        }
      }
      for (_arr = macros.getOrAddByNames(this.currentMacro), _i = 0, _len = __num(_arr.length), _f = function (_i) {
        var m;
        m = _arr[_i];
        return m.data.push((function () {
          var _rule;
          _rule = m.token;
          return (function () {
            function _rule2(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.macroName = _rule(clone)) && (result.macroData = rule(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            return named(
              (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule2(o);
                if (!result) {
                  return false;
                } else if (typeof mutator === "function") {
                  return mutator(result, o, index, line);
                } else if (mutator !== void 0) {
                  return mutator;
                } else {
                  return result;
                }
              }
            );
          }());
        }()));
      }; _i < _len; ++_i) {
        _f.call(this, _i);
      }
      macroId = macros.addMacro(mutator, void 0, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
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
      function mutator(x, o, i, line) {
        var macroHelper, result, tmps;
        if (_inAst.peek() || !o.expandingMacros) {
          return o.macroAccess(
            i,
            macroId,
            line,
            x,
            _position.peek(),
            _inGenerator.peek()
          );
        } else {
          macroHelper = MacroHelper(o, i, _position.peek(), _inGenerator.peek());
          result = (function () {
            try {
              return handler.call(
                macroHelper,
                x,
                macroHelper.wrap.bind(macroHelper),
                macroHelper.node.bind(macroHelper),
                function (id, line, data, position, inGenerator) {
                  _position.push(position);
                  _inGenerator.push(inGenerator);
                  try {
                    return macros.getById(id)(data, o, i, line);
                  } finally {
                    _position.pop();
                    _inGenerator.pop();
                  }
                }
              );
            } catch (e) {
              if (e instanceof MacroError) {
                throw e;
              } else {
                throw MacroError(e, o.data, i, line);
              }
            }
          }());
          if (result instanceof Node) {
            result = result.reduce(_this);
            tmps = macroHelper.getTmps();
            if (tmps.unsaved.length) {
              return o.tmpWrapper(i, result, tmps.unsaved);
            } else {
              return result;
            }
          } else {
            return result;
          }
        }
      }
      return macroId = (function () {
        var _arr, _f, _i, _len, _ref, id;
        switch (_this.currentMacro) {
        case BINARY_OPERATOR:
          return macros.addBinaryOperator(params, mutator, options, macroId);
        case ASSIGN_OPERATOR:
          return macros.addAssignOperator(params, mutator, options, macroId);
        case UNARY_OPERATOR:
          return macros.addUnaryOperator(params, mutator, options, macroId);
        case DEFINE_SYNTAX:
          assert(rule);
          macros.addSyntax(options.name, named(
            (rule != null ? rule.parserName : void 0) || "rule",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = rule(o);
              if (!result) {
                return false;
              } else if (typeof mutator === "function") {
                return mutator(result, o, index, line);
              } else if (mutator !== void 0) {
                return mutator;
              } else {
                return result;
              }
            }
          ));
          return macros.addMacro(mutator, macroId, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
        default:
          assert(rule);
          for (_arr = macros.getOrAddByNames(_this.currentMacro), _i = 0, _len = __num(_arr.length), _f = function (_i) {
            var _this, m;
            _this = this;
            m = _arr[_i];
            if (this.pendingMacroId != null) {
              m.data.pop();
            }
            return m.data.push((function () {
              var _rule;
              _rule = m.token;
              return (function () {
                function _rule2(o) {
                  var clone, result;
                  clone = o.clone();
                  result = {};
                  if ((result.macroName = _rule(clone)) && (result.macroData = rule(clone))) {
                    o.update(clone);
                    return result;
                  } else {
                    return false;
                  }
                }
                return named(
                  (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
                  function (o) {
                    var index, line, result;
                    index = o.index;
                    line = o.line;
                    result = _rule2(o);
                    if (!result) {
                      return false;
                    } else if (typeof mutator === "function") {
                      return mutator(result, o, index, line);
                    } else if (mutator !== void 0) {
                      return mutator;
                    } else {
                      return result;
                    }
                  }
                );
              }());
            }()));
          }; _i < _len; ++_i) {
            _f.call(_this, _i);
          }
          if (_this.pendingMacroId != null) {
            if (macroId != null) {
              throw Error("Cannot provide the macro id if there is a pending macro id");
            }
            id = _this.pendingMacroId;
            _this.pendingMacroId = null;
            macros.replaceMacro(id, mutator, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
            return id;
          } else {
            return macros.addMacro(mutator, macroId, options.type != null && __owns(Type, _ref = options.type) ? Type[_ref] : void 0);
          }
        }
      }());
    }
    _proto.macroSyntax = function (index, type, params, options, body) {
      var _ref, handler, macroId, rule, serialization;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be a Array, got " + __typeof(params));
      }
      if (!__owns(macroSyntaxTypes, type)) {
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
        this.options
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
    BINARY_OPERATOR = freeze({});
    _proto.defineBinaryOperator = function (index, operators, options, body) {
      var _this;
      _this = this;
      return this.enterMacro(BINARY_OPERATOR, function () {
        return _this.macroSyntax(
          index,
          "binaryOperator",
          operators,
          options,
          body
        );
      });
    };
    ASSIGN_OPERATOR = freeze({});
    _proto.defineAssignOperator = function (index, operators, options, body) {
      var _this;
      _this = this;
      return this.enterMacro(ASSIGN_OPERATOR, function () {
        return _this.macroSyntax(
          index,
          "assignOperator",
          operators,
          options,
          body
        );
      });
    };
    UNARY_OPERATOR = freeze({});
    _proto.defineUnaryOperator = function (index, operators, options, body) {
      var _this;
      _this = this;
      return this.enterMacro(UNARY_OPERATOR, function () {
        return _this.macroSyntax(
          index,
          "unaryOperator",
          operators,
          options,
          body
        );
      });
    };
    DEFINE_SYNTAX = freeze({});
    _proto.defineSyntax = function (index, name, params, body) {
      var _this;
      _this = this;
      return this.enterMacro(DEFINE_SYNTAX, function () {
        return _this.macroSyntax(
          index,
          "defineSyntax",
          params,
          { name: name },
          body
        );
      });
    };
    _proto.deserializeMacros = function (data) {
      var _arr, _i, _len, _ref, deserializer, item, type;
      for (type in macroDeserializers) {
        if (__owns(macroDeserializers, type)) {
          deserializer = macroDeserializers[type];
          for (_arr = (_ref = __owns(data, type) ? data[type] : void 0) != null ? _ref : [], _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
            item = _arr[_i];
            deserializer.call(this, item);
          }
        }
      }
    };
    _proto.macroExpand1 = function (node) {
      var _this, oldExpandingMacros, result;
      _this = this;
      if (node._macroExpanded != null) {
        return node._macroExpanded;
      } else if (node instanceof MacroAccessNode) {
        _position.push(node.position);
        _inGenerator.push(node.inGenerator);
        oldExpandingMacros = this.expandingMacros;
        this.expandingMacros = true;
        result = (function () {
          try {
            return _this.macros.getById(node.id)(node.data, _this, node.startIndex, node.line);
          } catch (e) {
            if (e instanceof MacroError) {
              e.line = node.line;
            }
            throw e;
          } finally {
            _position.pop();
            _inGenerator.pop();
            _this.expandingMacros = oldExpandingMacros;
          }
        }());
        return node._macroExpanded = result instanceof MacroAccessNode ? this.macroExpand1(result) : result;
      } else {
        return node._macroExpanded = node;
      }
    };
    _proto.macroExpandAll = function (node) {
      var _this;
      _this = this;
      function walker(node) {
        var expanded, walked;
        if (node._macroExpandAlled != null) {
          return node._macroExpandAlled;
        } else if (!(node instanceof MacroAccessNode)) {
          walked = node.walk(walker);
          return walked._macroExpanded = walked;
        } else {
          expanded = _this.macroExpand1(node);
          if (!(expanded instanceof Node)) {
            return node._macroExpandAlled = expanded;
          }
          walked = walker(expanded);
          return expanded._macroExpandAlled = walked._macroExpanded = walked;
        }
      }
      return walker(node);
    };
    State.addNodeFactory = function (name, type) {
      State.prototype[name] = function (index) {
        return type.apply(void 0, [index, this.index].concat(__slice(arguments, 1, void 0)));
      };
    };
    return State;
  }());
  Node.Access = AccessNode = (function (_super) {
    var _proto, _superproto;
    function AccessNode(startIndex, endIndex, parent, child) {
      var _this;
      if (!(parent instanceof Node)) {
        throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
      }
      if (!(child instanceof Node)) {
        throw TypeError("Expected child to be a Node, got " + __typeof(child));
      }
      _this = this instanceof AccessNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.child = child;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = AccessNode.prototype = __create(_superproto);
    _proto.constructor = AccessNode;
    AccessNode.displayName = "AccessNode";
    AccessNode.cappedName = "Access";
    AccessNode.argNames = ["parent", "child"];
    State.addNodeFactory("access", AccessNode);
    _proto._reduce = function (o) {
      var _ref, child, cValue, parent, pValue, value;
      parent = this.parent.reduce(o).doWrap();
      child = this.child.reduce(o).doWrap();
      if (parent.isConst() && child.isConst()) {
        pValue = parent.constValue();
        cValue = child.constValue();
        if (cValue in Object(pValue)) {
          value = pValue[cValue];
          if (value === null || value instanceof RegExp || (_ref = typeof value) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
            return ConstNode(this.startIndex, this.endIndex, value);
          }
        }
      }
      if (parent !== this.parent || child !== this.child) {
        return AccessNode(this.startIndex, this.endIndex, parent, child);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var child, parent;
      parent = f(this.parent);
      child = f(this.child);
      if (parent !== this.parent || child !== this.child) {
        return AccessNode(this.startIndex, this.endIndex, parent, child);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "AccessNode(" + inspect(this.parent, null, depth != null ? depth - 1 : null) + ", " + inspect(this.child, null, depth != null ? depth - 1 : null) + ")";
    };
    return AccessNode;
  }(Node));
  Node.AccessIndex = AccessIndexNode = (function (_super) {
    var _proto, _superproto;
    function AccessIndexNode(startIndex, endIndex, parent, child) {
      var _this;
      if (!(parent instanceof Node)) {
        throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
      }
      if (!(child instanceof Object)) {
        throw TypeError("Expected child to be a Object, got " + __typeof(child));
      }
      _this = this instanceof AccessIndexNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.child = child;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = AccessIndexNode.prototype = __create(_superproto);
    _proto.constructor = AccessIndexNode;
    AccessIndexNode.displayName = "AccessIndexNode";
    AccessIndexNode.cappedName = "AccessIndex";
    AccessIndexNode.argNames = ["parent", "child"];
    State.addNodeFactory("accessIndex", AccessIndexNode);
    _proto.walk = (function () {
      var indexTypes;
      indexTypes = {
        multi: function (x, f) {
          var elements;
          elements = map(x.elements, f);
          if (elements !== x.elements) {
            return { type: "multi", elements: elements };
          } else {
            return x;
          }
        },
        slice: function (x, f) {
          var left, right;
          left = x.left != null ? f(x.left) : x.left;
          right = x.right != null ? f(x.right) : x.right;
          if (left !== x.left || right !== x.right) {
            return { type: "slice", left: left, right: right };
          } else {
            return x;
          }
        }
      };
      return function (f) {
        var child, parent;
        if (!__owns(indexTypes, this.child.type)) {
          throw Error("Unknown index type: " + __strnum(this.child.type));
        }
        parent = f(this.parent);
        child = indexTypes[this.child.type](this.child, f);
        if (parent !== this.parent || child !== this.child) {
          return AccessIndexNode(this.startIndex, this.endIndex, parent, child);
        } else {
          return this;
        }
      };
    }());
    _proto.inspect = function (depth) {
      return "AccessIndexNode(" + inspect(this.parent, null, depth != null ? depth - 1 : null) + ", " + inspect(this.child, null, depth != null ? depth - 1 : null) + ")";
    };
    return AccessIndexNode;
  }(Node));
  Node.Args = ArgsNode = (function (_super) {
    var _proto, _superproto;
    function ArgsNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof ArgsNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ArgsNode.prototype = __create(_superproto);
    _proto.constructor = ArgsNode;
    ArgsNode.displayName = "ArgsNode";
    ArgsNode.cappedName = "Args";
    ArgsNode.argNames = [];
    State.addNodeFactory("args", ArgsNode);
    _proto.type = function () {
      return Type.args;
    };
    _proto.cacheable = false;
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "ArgsNode()";
    };
    return ArgsNode;
  }(Node));
  Node.Array = ArrayNode = (function (_super) {
    var _proto, _superproto;
    function ArrayNode(startIndex, endIndex, elements) {
      var _i, _len, _this;
      if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Node)) {
            throw TypeError("Expected elements[" + _i + "] to be a Node, got " + __typeof(elements[_i]));
          }
        }
      }
      _this = this instanceof ArrayNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.elements = elements;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ArrayNode.prototype = __create(_superproto);
    _proto.constructor = ArrayNode;
    ArrayNode.displayName = "ArrayNode";
    ArrayNode.cappedName = "Array";
    ArrayNode.argNames = ["elements"];
    State.addNodeFactory("array", ArrayNode);
    _proto.type = function () {
      return Type.array;
    };
    _proto._reduce = function (o) {
      var elements;
      elements = map(this.elements, function (x) {
        return x.reduce(o).doWrap();
      });
      if (elements !== this.elements) {
        return ArrayNode(this.startIndex, this.endIndex, elements);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var elements;
      elements = map(this.elements, f);
      if (elements !== this.elements) {
        return ArrayNode(this.startIndex, this.endIndex, elements);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "ArrayNode(" + inspect(this.elements, null, depth != null ? depth - 1 : null) + ")";
    };
    return ArrayNode;
  }(Node));
  State.prototype.arrayParam = State.prototype.array;
  Node.Assign = AssignNode = (function (_super) {
    var _proto, _superproto;
    function AssignNode(startIndex, endIndex, left, op, right) {
      var _this;
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      _this = this instanceof AssignNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = AssignNode.prototype = __create(_superproto);
    _proto.constructor = AssignNode;
    AssignNode.displayName = "AssignNode";
    AssignNode.cappedName = "Assign";
    AssignNode.argNames = ["left", "op", "right"];
    State.addNodeFactory("assign", AssignNode);
    _proto.type = (function () {
      var ops;
      ops = {
        "=": function (left, right) {
          return right;
        },
        "+=": function (left, right) {
          if (left.isSubsetOf(Type.number) && right.isSubsetOf(Type.number)) {
            return Type.number;
          } else if (left.overlaps(Type.number) && right.overlaps(Type.number)) {
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
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, type;
            type = __owns(ops, _ref = _this.op) ? ops[_ref] : void 0;
            if (!type) {
              return Type.any;
            } else if (typeof type === "function") {
              return type(_this.left.type(o), _this.right.type(o));
            } else {
              return type;
            }
          }());
        } else {
          return _ref;
        }
      };
    }());
    _proto._reduce = function (o) {
      var left, right;
      left = this.left.reduce(o);
      right = this.right.reduce(o).doWrap();
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.startIndex,
          this.endIndex,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var left, right;
      left = f(this.left);
      right = f(this.right);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.startIndex,
          this.endIndex,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "AssignNode(" + inspect(this.left, null, depth != null ? depth - 1 : null) + ", " + inspect(this.op, null, depth != null ? depth - 1 : null) + ", " + inspect(this.right, null, depth != null ? depth - 1 : null) + ")";
    };
    return AssignNode;
  }(Node));
  Node.Binary = BinaryNode = (function (_super) {
    var _proto, _superproto;
    function BinaryNode(startIndex, endIndex, left, op, right) {
      var _this;
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      _this = this instanceof BinaryNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = BinaryNode.prototype = __create(_superproto);
    _proto.constructor = BinaryNode;
    BinaryNode.displayName = "BinaryNode";
    BinaryNode.cappedName = "Binary";
    BinaryNode.argNames = ["left", "op", "right"];
    State.addNodeFactory("binary", BinaryNode);
    _proto.type = (function () {
      var ops;
      ops = {
        "*": Type.number,
        "/": Type.number,
        "%": Type.number,
        "+": function (left, right) {
          if (left.isSubsetOf(Type.number) && right.isSubsetOf(Type.number)) {
            return Type.number;
          } else if (left.overlaps(Type.number) && right.overlaps(Type.number)) {
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
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, type;
            type = __owns(ops, _ref = _this.op) ? ops[_ref] : void 0;
            if (!type) {
              return Type.any;
            } else if (typeof type === "function") {
              return type(_this.left.type(o), _this.right.type(o));
            } else {
              return type;
            }
          }());
        } else {
          return _ref;
        }
      };
    }());
    _proto._reduce = (function () {
      var constOps, leftConstOps, rightConstOps;
      constOps = {
        "*": function (x, y) {
          return x * y;
        },
        "/": function (x, y) {
          return x / y;
        },
        "%": function (x, y) {
          return x % y;
        },
        "+": function (left, right) {
          if (typeof left === "number" && typeof right === "number") {
            return left - -right;
          } else {
            return "" + left + right;
          }
        },
        "-": function (x, y) {
          return x - y;
        },
        "<<": function (x, y) {
          return x << y;
        },
        ">>": function (x, y) {
          return x >> y;
        },
        ">>>": function (x, y) {
          return x >>> y;
        },
        "<": function (x, y) {
          return x < y;
        },
        "<=": function (x, y) {
          return x <= y;
        },
        ">": function (x, y) {
          return x > y;
        },
        ">=": function (x, y) {
          return x >= y;
        },
        "==": function (x, y) {
          return x == y;
        },
        "!=": function (x, y) {
          return x != y;
        },
        "===": function (x, y) {
          return x === y;
        },
        "!==": function (x, y) {
          return x !== y;
        },
        "&": function (x, y) {
          return x & y;
        },
        "^": function (x, y) {
          return x ^ y;
        },
        "|": function (x, y) {
          return x | y;
        },
        "&&": function (x, y) {
          return x && y;
        },
        "||": function (x, y) {
          return x || y;
        }
      };
      leftConstOps = {
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
        },
        "*": function (x, y) {
          if (x.constValue() === 1) {
            return UnaryNode(this.startIndex, this.endIndex, "+", y);
          } else if (x.constValue() === -1) {
            return UnaryNode(this.startIndex, this.endIndex, "-", y);
          }
        },
        "+": function (x, y, o) {
          if (x.constValue() === 0 && y.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(this.startIndex, this.endIndex, "+", y);
          } else if (x.constValue() === "" && y.type(o).isSubsetOf(Type.string)) {
            return y;
          }
        },
        "-": function (x, y) {
          if (x.constValue() === 0) {
            return UnaryNode(this.startIndex, this.endIndex, "-", y);
          }
        }
      };
      rightConstOps = {
        "*": function (x, y) {
          if (y.constValue() === 1) {
            return UnaryNode(this.startIndex, this.endIndex, "+", x);
          } else if (y.constValue() === -1) {
            return UnaryNode(this.startIndex, this.endIndex, "-", x);
          }
        },
        "/": function (x, y) {
          if (y.constValue() === 1) {
            return UnaryNode(this.startIndex, this.endIndex, "+", x);
          } else if (y.constValue() === -1) {
            return UnaryNode(this.startIndex, this.endIndex, "-", x);
          }
        },
        "+": function (x, y, o) {
          if (y.constValue() === 0 && x.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(this.startIndex, this.endIndex, "+", x);
          } else if (typeof y.constValue() === "number" && __num(y.value) < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              x,
              "-",
              Const(-__num(y.constValue()))
            );
          } else if (y.constValue() === "" && x.type(o).isSubsetOf(Type.string)) {
            return x;
          }
        },
        "-": function (x, y, o) {
          if (y.constValue() === 0) {
            return UnaryNode(this.startIndex, this.endIndex, "+", x);
          } else if (typeof y.constValue() === "number" && __num(y.constValue()) < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              x,
              "+",
              Const(-__num(y.constValue()))
            );
          }
        }
      };
      return function (o) {
        var _ref, left, op, right;
        left = this.left.reduce(o).doWrap();
        right = this.right.reduce(o).doWrap();
        op = this.op;
        if (left.isConst()) {
          if (right.isConst() && __owns(constOps, op)) {
            return ConstNode(this.startIndex, this.endIndex, constOps[op](left.constValue(), right.constValue()));
          }
          if ((_ref = __owns(leftConstOps, op) ? leftConstOps[op].call(this, left, right, o) : void 0) != null) {
            return _ref;
          }
        }
        if (right.isConst() && (_ref = __owns(rightConstOps, op) ? rightConstOps[op].call(this, left, right, o) : void 0) != null) {
          return _ref;
        }
        if (left !== this.left || right !== this.right) {
          return BinaryNode(
            this.startIndex,
            this.endIndex,
            left,
            op,
            right
          );
        } else {
          return this;
        }
      };
    }());
    _proto.walk = function (f) {
      var left, right;
      left = f(this.left);
      right = f(this.right);
      if (left !== this.left || right !== this.right) {
        return BinaryNode(
          this.startIndex,
          this.endIndex,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "BinaryNode(" + inspect(this.left, null, depth != null ? depth - 1 : null) + ", " + inspect(this.op, null, depth != null ? depth - 1 : null) + ", " + inspect(this.right, null, depth != null ? depth - 1 : null) + ")";
    };
    return BinaryNode;
  }(Node));
  Node.Block = BlockNode = (function (_super) {
    var _proto, _superproto;
    function BlockNode(startIndex, endIndex, nodes) {
      var _i, _len, _this;
      if (!__isArray(nodes)) {
        throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
      } else {
        for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
          if (!(nodes[_i] instanceof Node)) {
            throw TypeError("Expected nodes[" + _i + "] to be a Node, got " + __typeof(nodes[_i]));
          }
        }
      }
      _this = this instanceof BlockNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.nodes = nodes;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = BlockNode.prototype = __create(_superproto);
    _proto.constructor = BlockNode;
    BlockNode.displayName = "BlockNode";
    BlockNode.cappedName = "Block";
    BlockNode.argNames = ["nodes"];
    State.addNodeFactory("block", BlockNode);
    _proto.type = function (o) {
      var nodes;
      nodes = this.nodes;
      if (nodes.length === 0) {
        return Type["undefined"];
      } else {
        return nodes[__num(nodes.length) - 1].type(o);
      }
    };
    _proto._reduce = function (o) {
      var _arr, body, changed, i, len, node, reduced;
      changed = false;
      body = [];
      for (_arr = this.nodes, i = 0, len = __num(_arr.length); i < len; ++i) {
        node = _arr[i];
        reduced = node.reduce(o);
        if (reduced instanceof BlockNode) {
          body.push.apply(body, __toArray(reduced.nodes));
          changed = true;
        } else if (reduced instanceof NothingNode) {
          changed = true;
        } else if ((reduced instanceof BreakNode || reduced instanceof ContinueNode || reduced instanceof ThrowNode || reduced instanceof ReturnNode) && !reduced.existential) {
          body.push(reduced);
          if (reduced !== node || __num(i) < __num(len) - 1) {
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
      switch (body.length) {
      case 0:
        return NothingNode(this.startIndex, this.endIndex);
      case 1:
        return body[0];
      default:
        if (changed) {
          return BlockNode(this.startIndex, this.endIndex, body);
        } else {
          return this;
        }
      }
    };
    _proto.isStatement = function () {
      var _this;
      _this = this;
      return (function () {
        var _arr, _i, _len, node;
        for (_arr = _this.nodes, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
          node = _arr[_i];
          if (node.isStatement()) {
            return true;
          }
        }
        return false;
      }());
    };
    _proto.walk = function (f) {
      var nodes;
      nodes = map(this.nodes, f);
      if (nodes !== this.nodes) {
        return BlockNode(this.startIndex, this.endIndex, nodes);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "BlockNode(" + inspect(this.nodes, null, depth != null ? depth - 1 : null) + ")";
    };
    return BlockNode;
  }(Node));
  Node.Break = BreakNode = (function (_super) {
    var _proto, _superproto;
    function BreakNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof BreakNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = BreakNode.prototype = __create(_superproto);
    _proto.constructor = BreakNode;
    BreakNode.displayName = "BreakNode";
    BreakNode.cappedName = "Break";
    BreakNode.argNames = [];
    State.addNodeFactory("break", BreakNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "BreakNode()";
    };
    return BreakNode;
  }(Node));
  Node.Call = CallNode = (function (_super) {
    var _proto, _superproto;
    function CallNode(startIndex, endIndex, func, args, isNew, isApply) {
      var _i, _len, _this;
      if (!(func instanceof Node)) {
        throw TypeError("Expected func to be a Node, got " + __typeof(func));
      }
      if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = 0, _len = args.length; _i < _len; ++_i) {
          if (!(args[_i] instanceof Node)) {
            throw TypeError("Expected args[" + _i + "] to be a Node, got " + __typeof(args[_i]));
          }
        }
      }
      if (isNew == void 0) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (isApply == void 0) {
        isApply = false;
      } else if (typeof isApply !== "boolean") {
        throw TypeError("Expected isApply to be a Boolean, got " + __typeof(isApply));
      }
      _this = this instanceof CallNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      _this.isApply = isApply;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = CallNode.prototype = __create(_superproto);
    _proto.constructor = CallNode;
    CallNode.displayName = "CallNode";
    CallNode.cappedName = "Call";
    CallNode.argNames = ["func", "args", "isNew", "isApply"];
    State.addNodeFactory("call", CallNode);
    _proto.type = (function () {
      var helperTypeCache, PRIMORDIAL_FUNCTIONS, PRIMORDIAL_METHODS, PRIMORDIAL_SUBFUNCTIONS;
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
        RegExp: { test: Type.boolean, toString: Type.string },
        Error: { toString: Type.string }
      };
      helperTypeCache = {};
      function calculateType(node) {
        var _ref, _ref2, ast, last;
        ast = require("./ast");
        last = node.last();
        if (last instanceof ast.Func) {
          if ((_ref = (_ref2 = last.meta) != null ? _ref2.asType : void 0) != null) {
            return _ref;
          } else {
            return Type.any;
          }
        } else if (last instanceof ast.Return) {
          return calculateType(last.node);
        } else if (last instanceof ast.Call && last.func instanceof ast.Func) {
          return calculateType(last.func.body);
        } else {
          return Type.any;
        }
      }
      return function (o) {
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, _ref2, _ref3, _ref4, child, func, helpers, name, parent;
            func = _this.func;
            if (func instanceof IdentNode) {
              name = func.name;
              if (__owns(PRIMORDIAL_FUNCTIONS, name)) {
                return PRIMORDIAL_FUNCTIONS[name];
              } else if (__num(name.length) > 2 && name.charCodeAt(0) === 95 && name.charCodeAt(1) === 95) {
                helpers = require("./translator").helpers;
                if (helpers.has(name)) {
                  if (__owns(helperTypeCache, name)) {
                    return helperTypeCache[name];
                  } else {
                    return helperTypeCache[name] = calculateType(helpers.get(name));
                  }
                }
              }
            } else if (func instanceof FunctionNode) {
              func.returnType(o);
            } else if (func instanceof AccessNode) {
              parent = func.parent;
              child = func.child;
              if (child instanceof ConstNode) {
                if (parent instanceof IdentNode) {
                  if ((_ref = __owns(PRIMORDIAL_SUBFUNCTIONS, _ref2 = parent.name) && __owns(_ref3 = PRIMORDIAL_SUBFUNCTIONS[_ref2], _ref4 = child.value) ? _ref3[_ref4] : void 0) != null) {
                    return _ref;
                  }
                } else if (((_ref = child.value) === "call" || _ref === "apply") && parent instanceof FunctionNode) {
                  parent.returnType(o);
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
    _proto._reduce = (function () {
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
        var _i, _len, _ref, _ref2, _ref3, allConst, arg, args, child, constArgs, cValue, func, parent, pValue, value;
        func = this.func.reduce(o).doWrap();
        args = map(this.args, function (node) {
          return node.reduce(o).doWrap();
        });
        if (!this.isNew && !this.isApply) {
          constArgs = [];
          allConst = true;
          for (_i = 0, _len = __num(args.length); _i < _len; ++_i) {
            arg = args[_i];
            if (arg.isConst()) {
              constArgs.push(arg.constValue());
            } else {
              allConst = false;
              break;
            }
          }
          if (allConst) {
            if (func instanceof IdentNode) {
              if (__owns(PURE_PRIMORDIAL_FUNCTIONS, func.name)) {
                try {
                  value = GLOBAL[func.name].apply(void 0, __toArray(constArgs));
                  return ConstNode(this.startIndex, this.endIndex, value);
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
                    return ConstNode(this.startIndex, this.endIndex, value);
                  } catch (e) {}
                }
              } else if (parent instanceof IdentNode && (__owns(PURE_PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name) && __owns(_ref2 = PURE_PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.value) ? _ref2[_ref3] : void 0)) {
                try {
                  value = (_ref = GLOBAL[parent.name])[cValue].apply(_ref, __toArray(constArgs));
                  return ConstNode(this.startIndex, this.endIndex, value);
                } catch (e) {}
              }
            }
          }
        }
        if (func !== this.func || args !== this.args) {
          return CallNode(
            this.startIndex,
            this.endIndex,
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
    _proto.walk = function (f) {
      var args, func;
      func = f(this.func);
      args = map(this.args, f);
      if (func !== this.func || args !== this.args) {
        return CallNode(
          this.startIndex,
          this.endIndex,
          func,
          args,
          this.isNew,
          this.isApply
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "CallNode(" + inspect(this.func, null, depth != null ? depth - 1 : null) + ", " + inspect(this.args, null, depth != null ? depth - 1 : null) + ", " + inspect(this.isNew, null, depth != null ? depth - 1 : null) + ", " + inspect(this.isApply, null, depth != null ? depth - 1 : null) + ")";
    };
    return CallNode;
  }(Node));
  Node.Const = ConstNode = (function (_super) {
    var _proto, _superproto;
    function ConstNode(startIndex, endIndex, value) {
      var _this;
      if (value != void 0 && typeof value !== "number" && typeof value !== "string" && typeof value !== "boolean" && !(value instanceof RegExp)) {
        throw TypeError("Expected value to be a Number or String or Boolean or RegExp or undefined or null, got " + __typeof(value));
      }
      _this = this instanceof ConstNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.value = value;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ConstNode.prototype = __create(_superproto);
    _proto.constructor = ConstNode;
    ConstNode.displayName = "ConstNode";
    ConstNode.cappedName = "Const";
    ConstNode.argNames = ["value"];
    State.addNodeFactory("const", ConstNode);
    _proto.type = function () {
      var value;
      value = this.value;
      switch (typeof value) {
      case "number":
        return Type.number;
      case "string":
        return Type.string;
      case "boolean":
        return Type.boolean;
      case "undefined":
        return Type["undefined"];
      default:
        if (value === null) {
          return Type["null"];
        } else if (value instanceof RegExp) {
          return Type.regexp;
        } else {
          throw Error("Unknown type for " + String(value));
        }
      }
    };
    _proto.cacheable = false;
    _proto.isConst = function () {
      return true;
    };
    _proto.constValue = function () {
      return this.value;
    };
    _proto.walk = function (f) {
      return this;
    };
    _proto.inspect = function (depth) {
      return "ConstNode(" + inspect(this.value, null, depth != null ? depth - 1 : null) + ")";
    };
    return ConstNode;
  }(Node));
  Node.Continue = ContinueNode = (function (_super) {
    var _proto, _superproto;
    function ContinueNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof ContinueNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ContinueNode.prototype = __create(_superproto);
    _proto.constructor = ContinueNode;
    ContinueNode.displayName = "ContinueNode";
    ContinueNode.cappedName = "Continue";
    ContinueNode.argNames = [];
    State.addNodeFactory("continue", ContinueNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "ContinueNode()";
    };
    return ContinueNode;
  }(Node));
  Node.Debugger = DebuggerNode = (function (_super) {
    var _proto, _superproto;
    function DebuggerNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof DebuggerNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = DebuggerNode.prototype = __create(_superproto);
    _proto.constructor = DebuggerNode;
    DebuggerNode.displayName = "DebuggerNode";
    DebuggerNode.cappedName = "Debugger";
    DebuggerNode.argNames = [];
    State.addNodeFactory("debugger", DebuggerNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "DebuggerNode()";
    };
    return DebuggerNode;
  }(Node));
  Node.Def = DefNode = (function (_super) {
    var _proto, _superproto;
    function DefNode(startIndex, endIndex, left, right) {
      var _this;
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (right == void 0) {
        right = void 0;
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node or undefined, got " + __typeof(right));
      }
      _this = this instanceof DefNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.right = right;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = DefNode.prototype = __create(_superproto);
    _proto.constructor = DefNode;
    DefNode.displayName = "DefNode";
    DefNode.cappedName = "Def";
    DefNode.argNames = ["left", "right"];
    State.addNodeFactory("def", DefNode);
    _proto.walk = function (func) {
      var left, right;
      left = func(this.left);
      right = this.right != null ? func(this.right) : this.right;
      if (left !== this.left || right !== this.right) {
        return DefNode(this.startIndex, this.endIndex, left, right);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "DefNode(" + inspect(this.left, null, depth != null ? depth - 1 : null) + ", " + inspect(this.right, null, depth != null ? depth - 1 : null) + ")";
    };
    return DefNode;
  }(Node));
  Node.Eval = EvalNode = (function (_super) {
    var _proto, _superproto;
    function EvalNode(startIndex, endIndex, code) {
      var _this;
      if (!(code instanceof Node)) {
        throw TypeError("Expected code to be a Node, got " + __typeof(code));
      }
      _this = this instanceof EvalNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.code = code;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = EvalNode.prototype = __create(_superproto);
    _proto.constructor = EvalNode;
    EvalNode.displayName = "EvalNode";
    EvalNode.cappedName = "Eval";
    EvalNode.argNames = ["code"];
    State.addNodeFactory("eval", EvalNode);
    _proto.walk = function (f) {
      var code;
      code = f(this.code);
      if (code !== this.code) {
        return EvalNode(this.startIndex, this.endIndex, code);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "EvalNode(" + inspect(this.code, null, depth != null ? depth - 1 : null) + ")";
    };
    return EvalNode;
  }(Node));
  Node.For = ForNode = (function (_super) {
    var _proto, _superproto;
    function ForNode(startIndex, endIndex, init, test, step, body) {
      var _this;
      if (init == void 0) {
        init = NothingNode(0, 0);
      } else if (!(init instanceof Node)) {
        throw TypeError("Expected init to be a Node, got " + __typeof(init));
      }
      if (test == void 0) {
        test = ConstNode(0, 0, true);
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (step == void 0) {
        step = NothingNode(0, 0);
      } else if (!(step instanceof Node)) {
        throw TypeError("Expected step to be a Node, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof ForNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.init = init;
      _this.test = test;
      _this.step = step;
      _this.body = body;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ForNode.prototype = __create(_superproto);
    _proto.constructor = ForNode;
    ForNode.displayName = "ForNode";
    ForNode.cappedName = "For";
    ForNode.argNames = ["init", "test", "step", "body"];
    State.addNodeFactory("for", ForNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = function (f) {
      var body, init, step, test;
      init = f(this.init);
      test = f(this.test);
      step = f(this.step);
      body = f(this.body);
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body) {
        return ForNode(
          this.startIndex,
          this.endIndex,
          init,
          test,
          step,
          body
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "ForNode(" + inspect(this.init, null, depth != null ? depth - 1 : null) + ", " + inspect(this.test, null, depth != null ? depth - 1 : null) + ", " + inspect(this.step, null, depth != null ? depth - 1 : null) + ", " + inspect(this.body, null, depth != null ? depth - 1 : null) + ")";
    };
    return ForNode;
  }(Node));
  Node.ForIn = ForInNode = (function (_super) {
    var _proto, _superproto;
    function ForInNode(startIndex, endIndex, key, object, body) {
      var _this;
      if (!(key instanceof Node)) {
        throw TypeError("Expected key to be a Node, got " + __typeof(key));
      }
      if (!(object instanceof Node)) {
        throw TypeError("Expected object to be a Node, got " + __typeof(object));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof ForInNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.key = key;
      _this.object = object;
      _this.body = body;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ForInNode.prototype = __create(_superproto);
    _proto.constructor = ForInNode;
    ForInNode.displayName = "ForInNode";
    ForInNode.cappedName = "ForIn";
    ForInNode.argNames = ["key", "object", "body"];
    State.addNodeFactory("forIn", ForInNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = function (f) {
      var body, key, object;
      key = f(this.key);
      object = f(this.object);
      body = f(this.body);
      if (key !== this.key || object !== this.object || body !== this.body) {
        return ForInNode(
          this.startIndex,
          this.endIndex,
          key,
          object,
          body
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "ForInNode(" + inspect(this.key, null, depth != null ? depth - 1 : null) + ", " + inspect(this.object, null, depth != null ? depth - 1 : null) + ", " + inspect(this.body, null, depth != null ? depth - 1 : null) + ")";
    };
    return ForInNode;
  }(Node));
  Node.Function = FunctionNode = (function (_super) {
    var _proto, _superproto;
    function FunctionNode(startIndex, endIndex, params, body, autoReturn, bound, asType, generator) {
      var _i, _len, _this;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          if (!(params[_i] instanceof Node)) {
            throw TypeError("Expected params[" + _i + "] to be a Node, got " + __typeof(params[_i]));
          }
        }
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (autoReturn == void 0) {
        autoReturn = true;
      } else if (typeof autoReturn !== "boolean") {
        throw TypeError("Expected autoReturn to be a Boolean, got " + __typeof(autoReturn));
      }
      if (bound == void 0) {
        bound = false;
      } else if (typeof bound !== "boolean") {
        throw TypeError("Expected bound to be a Boolean, got " + __typeof(bound));
      }
      if (asType == void 0) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      if (generator == void 0) {
        generator = false;
      } else if (typeof generator !== "boolean") {
        throw TypeError("Expected generator to be a Boolean, got " + __typeof(generator));
      }
      _this = this instanceof FunctionNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      _this.body = body;
      _this.autoReturn = autoReturn;
      _this.bound = bound;
      _this.asType = asType;
      _this.generator = generator;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = FunctionNode.prototype = __create(_superproto);
    _proto.constructor = FunctionNode;
    FunctionNode.displayName = "FunctionNode";
    FunctionNode.cappedName = "Function";
    FunctionNode.argNames = [
      "params",
      "body",
      "autoReturn",
      "bound",
      "asType",
      "generator"
    ];
    State.addNodeFactory("function", FunctionNode);
    _proto.type = function () {
      return Type["function"];
    };
    _proto.returnType = function (o) {
      return this.body.type(o);
    };
    _proto.walk = function (func) {
      var asType, body, params;
      params = map(this.params, func);
      body = func(this.body);
      asType = this.asType != null ? func(this.asType) : this.asType;
      if (params !== this.params || body !== this.body || asType !== this.asType) {
        return FunctionNode(
          this.startIndex,
          this.endIndex,
          params,
          body,
          this.autoReturn,
          this.bound,
          this.asType,
          this.generator
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "FunctionNode(" + inspect(this.params, null, depth != null ? depth - 1 : null) + ", " + inspect(this.body, null, depth != null ? depth - 1 : null) + ", " + inspect(this.autoReturn, null, depth != null ? depth - 1 : null) + ", " + inspect(this.bound, null, depth != null ? depth - 1 : null) + ", " + inspect(this.asType, null, depth != null ? depth - 1 : null) + ", " + inspect(this.generator, null, depth != null ? depth - 1 : null) + ")";
    };
    return FunctionNode;
  }(Node));
  Node.Ident = IdentNode = (function (_super) {
    var _proto, _superproto;
    function IdentNode(startIndex, endIndex, name) {
      var _this;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      _this = this instanceof IdentNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = IdentNode.prototype = __create(_superproto);
    _proto.constructor = IdentNode;
    IdentNode.displayName = "IdentNode";
    IdentNode.cappedName = "Ident";
    IdentNode.argNames = ["name"];
    State.addNodeFactory("ident", IdentNode);
    _proto.cacheable = false;
    _proto.walk = function (f) {
      return this;
    };
    _proto.inspect = function (depth) {
      return "IdentNode(" + inspect(this.name, null, depth != null ? depth - 1 : null) + ")";
    };
    return IdentNode;
  }(Node));
  Node.If = IfNode = (function (_super) {
    var _proto, _superproto;
    function IfNode(startIndex, endIndex, test, whenTrue, whenFalse) {
      var _this;
      if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == void 0) {
        whenFalse = NothingNode(0, 0);
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
      }
      _this = this instanceof IfNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.test = test;
      _this.whenTrue = whenTrue;
      _this.whenFalse = whenFalse;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = IfNode.prototype = __create(_superproto);
    _proto.constructor = IfNode;
    IfNode.displayName = "IfNode";
    IfNode.cappedName = "If";
    IfNode.argNames = ["test", "whenTrue", "whenFalse"];
    State.addNodeFactory("if", IfNode);
    _proto.type = function (o) {
      var _ref;
      if ((_ref = this._type) == null) {
        return this._type = this.whenTrue.type(o).union(this.whenFalse.type(o));
      } else {
        return _ref;
      }
    };
    _proto._reduce = function (o) {
      var test, whenFalse, whenTrue;
      test = this.test.reduce(o);
      whenTrue = this.whenTrue.reduce(o);
      whenFalse = this.whenFalse.reduce(o);
      if (test.isConst()) {
        if (test.constValue()) {
          return whenTrue;
        } else {
          return whenFalse;
        }
      } else {
        return IfNode(
          this.startIndex,
          this.endIndex,
          test,
          whenTrue,
          whenFalse
        );
      }
    };
    _proto.isStatement = function () {
      var _ref;
      if ((_ref = this._isStatement) == null) {
        return this._isStatement = this.whenTrue.isStatement() || this.whenFalse.isStatement();
      } else {
        return _ref;
      }
    };
    _proto.doWrap = function () {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.doWrap();
      whenFalse = this.whenFalse.doWrap();
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return IfNode(
          this.startIndex,
          this.endIndex,
          this.test,
          whenTrue,
          whenFalse
        );
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var test, whenFalse, whenTrue;
      test = f(this.test);
      whenTrue = f(this.whenTrue);
      whenFalse = f(this.whenFalse);
      if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return IfNode(
          this.startIndex,
          this.endIndex,
          test,
          whenTrue,
          whenFalse
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "IfNode(" + inspect(this.test, null, depth != null ? depth - 1 : null) + ", " + inspect(this.whenTrue, null, depth != null ? depth - 1 : null) + ", " + inspect(this.whenFalse, null, depth != null ? depth - 1 : null) + ")";
    };
    return IfNode;
  }(Node));
  Node.MacroAccess = MacroAccessNode = (function (_super) {
    var _proto, _superproto;
    function MacroAccessNode(startIndex, endIndex, id, line, data, position, inGenerator) {
      var _this;
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (!(data instanceof Object)) {
        throw TypeError("Expected data to be a Object, got " + __typeof(data));
      }
      if (typeof position !== "string") {
        throw TypeError("Expected position to be a String, got " + __typeof(position));
      }
      if (inGenerator == void 0) {
        inGenerator = false;
      } else if (typeof inGenerator !== "boolean") {
        throw TypeError("Expected inGenerator to be a Boolean, got " + __typeof(inGenerator));
      }
      _this = this instanceof MacroAccessNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.line = line;
      _this.data = data;
      _this.position = position;
      _this.inGenerator = inGenerator;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = MacroAccessNode.prototype = __create(_superproto);
    _proto.constructor = MacroAccessNode;
    MacroAccessNode.displayName = "MacroAccessNode";
    MacroAccessNode.cappedName = "MacroAccess";
    MacroAccessNode.argNames = [
      "id",
      "line",
      "data",
      "position",
      "inGenerator"
    ];
    State.addNodeFactory("macroAccess", MacroAccessNode);
    _proto.type = function (o) {
      var _ref, _this;
      _this = this;
      if (!(o instanceof State)) {
        throw TypeError("Expected o to be a State, got " + __typeof(o));
      }
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var type;
          type = o.macros.getTypeById(_this.id);
          if (type != null) {
            return type;
          } else {
            return o.macroExpand1(_this).type(o);
          }
        }());
      } else {
        return _ref;
      }
    };
    _proto.walk = (function () {
      function walkArray(array, func) {
        var _i, _len, changed, item, newItem, result;
        result = [];
        changed = false;
        for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
          item = array[_i];
          newItem = walkItem(item, func);
          if (newItem !== item) {
            changed = true;
          }
          result.push(newItem);
        }
        if (changed) {
          return result;
        } else {
          return array;
        }
      }
      function walkObject(obj, func) {
        var changed, k, newV, result, v;
        result = {};
        changed = false;
        for (k in obj) {
          if (__owns(obj, k)) {
            v = obj[k];
            newV = walkItem(v, func);
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
      function walkItem(item, func) {
        if (item instanceof Node) {
          return func(item);
        } else if (Array.isArray(item)) {
          return walkArray(item, func);
        } else if (item && typeof item === "object") {
          return walkObject(item, func);
        } else {
          return item;
        }
      }
      return function (func) {
        var data;
        data = walkItem(this.data, func);
        if (data !== this.data) {
          return MacroAccessNode(
            this.startIndex,
            this.endIndex,
            this.id,
            this.line,
            data,
            this.position,
            this.inGenerator
          );
        } else {
          return this;
        }
      };
    }());
    _proto.inspect = function (depth) {
      return "MacroAccessNode(" + inspect(this.id, null, depth != null ? depth - 1 : null) + ", " + inspect(this.line, null, depth != null ? depth - 1 : null) + ", " + inspect(this.data, null, depth != null ? depth - 1 : null) + ", " + inspect(this.position, null, depth != null ? depth - 1 : null) + ", " + inspect(this.inGenerator, null, depth != null ? depth - 1 : null) + ")";
    };
    return MacroAccessNode;
  }(Node));
  Node.Nothing = NothingNode = (function (_super) {
    var _proto, _superproto;
    function NothingNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof NothingNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = NothingNode.prototype = __create(_superproto);
    _proto.constructor = NothingNode;
    NothingNode.displayName = "NothingNode";
    NothingNode.cappedName = "Nothing";
    NothingNode.argNames = [];
    State.addNodeFactory("nothing", NothingNode);
    _proto.type = function () {
      return Type["undefined"];
    };
    _proto.cacheable = false;
    _proto.isConst = function () {
      return true;
    };
    _proto.constValue = function () {
      return;
    };
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "NothingNode()";
    };
    return NothingNode;
  }(Node));
  Node.Object = ObjectNode = (function (_super) {
    var _proto, _superproto;
    function ObjectNode(startIndex, endIndex, pairs, prototype) {
      var _this;
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be a Array, got " + __typeof(pairs));
      }
      if (prototype == void 0) {
        prototype = void 0;
      } else if (!(prototype instanceof Node)) {
        throw TypeError("Expected prototype to be a Node or undefined, got " + __typeof(prototype));
      }
      _this = this instanceof ObjectNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.pairs = pairs;
      _this.prototype = prototype;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ObjectNode.prototype = __create(_superproto);
    _proto.constructor = ObjectNode;
    ObjectNode.displayName = "ObjectNode";
    ObjectNode.cappedName = "Object";
    ObjectNode.argNames = ["pairs", "prototype"];
    State.addNodeFactory("object", ObjectNode);
    _proto.type = function () {
      return Type.object;
    };
    _proto.walk = (function () {
      function walkPair(pair, func) {
        var key, value;
        key = func(pair.key);
        value = func(pair.value);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value };
        } else {
          return pair;
        }
      }
      return function (func) {
        var pairs, prototype;
        pairs = map(this.pairs, walkPair, func);
        prototype = this.prototype != null ? func(this.prototype) : this.prototype;
        if (pairs !== this.pairs || prototype !== this.prototype) {
          return ObjectNode(this.startIndex, this.endIndex, pairs, prototype);
        } else {
          return this;
        }
      };
    }());
    _proto._reduce = (function () {
      function reducePair(pair, o) {
        var key, value;
        key = pair.key.reduce(o);
        value = pair.value.reduce(o).doWrap();
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value };
        } else {
          return pair;
        }
      }
      return function (o) {
        var pairs, prototype;
        pairs = map(this.pairs, reducePair, o);
        prototype = this.prototype != null ? this.prototype.reduce(o) : this.prototype;
        if (pairs !== this.pairs || prototype !== this.prototype) {
          return ObjectNode(this.startIndex, this.endIndex, pairs, prototype);
        } else {
          return this;
        }
      };
    }());
    _proto.inspect = function (depth) {
      return "ObjectNode(" + inspect(this.pairs, null, depth != null ? depth - 1 : null) + ", " + inspect(this.prototype, null, depth != null ? depth - 1 : null) + ")";
    };
    return ObjectNode;
  }(Node));
  State.prototype.object = function (i, pairs, prototype) {
    var _i, _len, key, keyValue, knownKeys;
    knownKeys = [];
    for (_i = 0, _len = __num(pairs.length); _i < _len; ++_i) {
      key = pairs[_i].key;
      if (key instanceof ConstNode) {
        keyValue = String(key.value);
        if (__in(keyValue, knownKeys)) {
          this.error("Duplicate key in object: " + __strnum(keyValue));
        }
        knownKeys.push(keyValue);
      }
    }
    return ObjectNode(i, this.index, pairs, prototype);
  };
  State.prototype.objectParam = State.prototype.object;
  Node.Param = ParamNode = (function (_super) {
    var _proto, _superproto;
    function ParamNode(startIndex, endIndex, ident, defaultValue, spread, isMutable, asType) {
      var _this;
      if (!(ident instanceof Node)) {
        throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
      }
      if (defaultValue == void 0) {
        defaultValue = void 0;
      } else if (!(defaultValue instanceof Node)) {
        throw TypeError("Expected defaultValue to be a Node or undefined, got " + __typeof(defaultValue));
      }
      if (spread == void 0) {
        spread = false;
      } else if (typeof spread !== "boolean") {
        throw TypeError("Expected spread to be a Boolean, got " + __typeof(spread));
      }
      if (isMutable == void 0) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (asType == void 0) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      _this = this instanceof ParamNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
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
    _superproto = _super.prototype;
    _proto = ParamNode.prototype = __create(_superproto);
    _proto.constructor = ParamNode;
    ParamNode.displayName = "ParamNode";
    ParamNode.cappedName = "Param";
    ParamNode.argNames = [
      "ident",
      "defaultValue",
      "spread",
      "isMutable",
      "asType"
    ];
    State.addNodeFactory("param", ParamNode);
    _proto.walk = function (func) {
      var asType, defaultValue, ident;
      ident = func(this.ident);
      defaultValue = this.defaultValue != null ? func(this.defaultValue) : this.defaultValue;
      asType = this.asType != null ? func(this.asType) : this.asType;
      if (ident !== this.ident || defaultValue !== this.defaultValue || asType !== this.asType) {
        return ParamNode(
          this.startIndex,
          this.endIndex,
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
    _proto.inspect = function (depth) {
      return "ParamNode(" + inspect(this.ident, null, depth != null ? depth - 1 : null) + ", " + inspect(this.defaultValue, null, depth != null ? depth - 1 : null) + ", " + inspect(this.spread, null, depth != null ? depth - 1 : null) + ", " + inspect(this.isMutable, null, depth != null ? depth - 1 : null) + ", " + inspect(this.asType, null, depth != null ? depth - 1 : null) + ")";
    };
    return ParamNode;
  }(Node));
  Node.Regexp = RegexpNode = (function (_super) {
    var _proto, _superproto;
    function RegexpNode(startIndex, endIndex, text, flags) {
      var _this;
      if (!(text instanceof Node)) {
        throw TypeError("Expected text to be a Node, got " + __typeof(text));
      }
      if (typeof flags !== "string") {
        throw TypeError("Expected flags to be a String, got " + __typeof(flags));
      }
      _this = this instanceof RegexpNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.text = text;
      _this.flags = flags;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = RegexpNode.prototype = __create(_superproto);
    _proto.constructor = RegexpNode;
    RegexpNode.displayName = "RegexpNode";
    RegexpNode.cappedName = "Regexp";
    RegexpNode.argNames = ["text", "flags"];
    State.addNodeFactory("regexp", RegexpNode);
    _proto.type = function () {
      return Type.regexp;
    };
    _proto._reduce = function (o) {
      var text;
      text = this.text.reduce(o).doWrap();
      if (text.isConst()) {
        return ConstNode(this.startIndex, this.endIndex, RegExp(String(text.constValue()), this.flags));
      } else {
        return CallNode(
          this.startIndex,
          this.endIndex,
          IdentNode(this.startIndex, this.endIndex, "RegExp"),
          [
            text,
            ConstNode(this.startIndex, this.endIndex, this.flags)
          ]
        );
      }
    };
    _proto.walk = function (f) {
      var text;
      text = f(this.text);
      if (text !== this.text) {
        return RegexpNode(this.startIndex, this.endIndex, text, this.flags);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "RegexpNode(" + inspect(this.text, null, depth != null ? depth - 1 : null) + ", " + inspect(this.flags, null, depth != null ? depth - 1 : null) + ")";
    };
    return RegexpNode;
  }(Node));
  Node.Return = ReturnNode = (function (_super) {
    var _proto, _superproto;
    function ReturnNode(startIndex, endIndex, node) {
      var _this;
      if (node == void 0) {
        node = ConstNode(0, 0, void 0);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this = this instanceof ReturnNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ReturnNode.prototype = __create(_superproto);
    _proto.constructor = ReturnNode;
    ReturnNode.displayName = "ReturnNode";
    ReturnNode.cappedName = "Return";
    ReturnNode.argNames = ["node"];
    State.addNodeFactory("return", ReturnNode);
    _proto.type = function (o) {
      return this.node.type(o);
    };
    _proto.isStatement = function () {
      return true;
    };
    _proto._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap();
      if (node !== this.node) {
        return ReturnNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return ReturnNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "ReturnNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ")";
    };
    return ReturnNode;
  }(Node));
  Node.Root = RootNode = (function (_super) {
    var _proto, _superproto;
    function RootNode(startIndex, endIndex, body) {
      var _this;
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this = this instanceof RootNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.body = body;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = RootNode.prototype = __create(_superproto);
    _proto.constructor = RootNode;
    RootNode.displayName = "RootNode";
    RootNode.cappedName = "Root";
    RootNode.argNames = ["body"];
    State.addNodeFactory("root", RootNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = function (f) {
      var body;
      body = f(this.body);
      if (body !== this.body) {
        return RootNode(this.startIndex, this.endIndex, body);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "RootNode(" + inspect(this.body, null, depth != null ? depth - 1 : null) + ")";
    };
    return RootNode;
  }(Node));
  Node.Spread = SpreadNode = (function (_super) {
    var _proto, _superproto;
    function SpreadNode(startIndex, endIndex, node) {
      var _this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this = this instanceof SpreadNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SpreadNode.prototype = __create(_superproto);
    _proto.constructor = SpreadNode;
    SpreadNode.displayName = "SpreadNode";
    SpreadNode.cappedName = "Spread";
    SpreadNode.argNames = ["node"];
    State.addNodeFactory("spread", SpreadNode);
    _proto._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap();
      if (node !== this.node) {
        return SpreadNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return SpreadNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SpreadNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ")";
    };
    return SpreadNode;
  }(Node));
  State.prototype.string = function (index, parts) {
    var _arr, _i, _len, concatOp, current, part;
    if (!__isArray(parts)) {
      throw TypeError("Expected parts to be an Array, got " + __typeof(parts));
    } else {
      for (_i = 0, _len = parts.length; _i < _len; ++_i) {
        if (!(parts[_i] instanceof Node)) {
          throw TypeError("Expected parts[" + _i + "] to be a Node, got " + __typeof(parts[_i]));
        }
      }
    }
    concatOp = this.macros.getBinaryOperatorByName("&");
    if (!concatOp) {
      throw Error("Cannot use string interpolation until binary operator '&' has been defined");
    }
    if (parts.length === 0) {
      return ConstNode(index, index, "");
    } else if (parts.length === 1) {
      return concatOp.func(
        {
          left: ConstNode(index, index, ""),
          op: "&",
          right: parts[0]
        },
        this,
        index,
        this.line
      );
    } else {
      current = parts[0];
      for (_arr = __slice(parts, 1, void 0), _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        part = _arr[_i];
        current = concatOp.func(
          { left: current, op: "&", right: part },
          this,
          index,
          this.line
        );
      }
      return current;
    }
  };
  Node.Super = SuperNode = (function (_super) {
    var _proto, _superproto;
    function SuperNode(startIndex, endIndex, child, args) {
      var _i, _len, _this;
      if (child == void 0) {
        child = void 0;
      } else if (!(child instanceof Node)) {
        throw TypeError("Expected child to be a Node or undefined, got " + __typeof(child));
      }
      if (!__isArray(args)) {
        throw TypeError("Expected args to be an Array, got " + __typeof(args));
      } else {
        for (_i = 0, _len = args.length; _i < _len; ++_i) {
          if (!(args[_i] instanceof Node)) {
            throw TypeError("Expected args[" + _i + "] to be a Node, got " + __typeof(args[_i]));
          }
        }
      }
      _this = this instanceof SuperNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.child = child;
      _this.args = args;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SuperNode.prototype = __create(_superproto);
    _proto.constructor = SuperNode;
    SuperNode.displayName = "SuperNode";
    SuperNode.cappedName = "Super";
    SuperNode.argNames = ["child", "args"];
    State.addNodeFactory("super", SuperNode);
    _proto.walk = function (func) {
      var args, child;
      child = this.child != null ? func(this.child) : this.child;
      args = map(this.args, func);
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.startIndex, this.endIndex, child, args);
      } else {
        return this;
      }
    };
    _proto._reduce = function (o) {
      var args, child;
      child = this.child != null ? this.child.reduce(o).doWrap() : this.child;
      args = map(
        this.args,
        function (node, o) {
          return node.reduce(o).doWrap();
        },
        o
      );
      if (child !== this.child || args !== this.args) {
        return SuperNode(this.startIndex, this.endIndex, child, args);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SuperNode(" + inspect(this.child, null, depth != null ? depth - 1 : null) + ", " + inspect(this.args, null, depth != null ? depth - 1 : null) + ")";
    };
    return SuperNode;
  }(Node));
  Node.Switch = SwitchNode = (function (_super) {
    var _proto, _superproto;
    function SwitchNode(startIndex, endIndex, node, cases, defaultCase) {
      var _this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(cases)) {
        throw TypeError("Expected cases to be a Array, got " + __typeof(cases));
      }
      if (defaultCase == void 0) {
        defaultCase = void 0;
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node or undefined, got " + __typeof(defaultCase));
      }
      _this = this instanceof SwitchNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SwitchNode.prototype = __create(_superproto);
    _proto.constructor = SwitchNode;
    SwitchNode.displayName = "SwitchNode";
    SwitchNode.cappedName = "Switch";
    SwitchNode.argNames = ["node", "cases", "defaultCase"];
    State.addNodeFactory("switch", SwitchNode);
    _proto.walk = function (func) {
      var cases, defaultCase, node;
      node = func(this.node);
      cases = map(this.cases, function (case_) {
        var caseBody, caseNode;
        caseNode = func(case_.node);
        caseBody = func(case_.body);
        if (caseNode !== case_.node || caseBody !== case_.body) {
          return { node: caseNode, body: caseBody, fallthrough: case_.fallthrough };
        } else {
          return case_;
        }
      });
      defaultCase = func(this.defaultCase);
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase) {
        return SwitchNode(
          this.startIndex,
          this.endIndex,
          node,
          cases,
          defaultCase
        );
      } else {
        return this;
      }
    };
    _proto.isStatement = function () {
      return true;
    };
    _proto.inspect = function (depth) {
      return "SwitchNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ", " + inspect(this.cases, null, depth != null ? depth - 1 : null) + ", " + inspect(this.defaultCase, null, depth != null ? depth - 1 : null) + ")";
    };
    return SwitchNode;
  }(Node));
  Node.SyntaxChoice = SyntaxChoiceNode = (function (_super) {
    var _proto, _superproto;
    function SyntaxChoiceNode(startIndex, endIndex, choices) {
      var _i, _len, _this;
      if (!__isArray(choices)) {
        throw TypeError("Expected choices to be an Array, got " + __typeof(choices));
      } else {
        for (_i = 0, _len = choices.length; _i < _len; ++_i) {
          if (!(choices[_i] instanceof Node)) {
            throw TypeError("Expected choices[" + _i + "] to be a Node, got " + __typeof(choices[_i]));
          }
        }
      }
      _this = this instanceof SyntaxChoiceNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.choices = choices;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SyntaxChoiceNode.prototype = __create(_superproto);
    _proto.constructor = SyntaxChoiceNode;
    SyntaxChoiceNode.displayName = "SyntaxChoiceNode";
    SyntaxChoiceNode.cappedName = "SyntaxChoice";
    SyntaxChoiceNode.argNames = ["choices"];
    State.addNodeFactory("syntaxChoice", SyntaxChoiceNode);
    _proto.walk = function (f) {
      var choices;
      choices = map(this.choices, f);
      if (choices !== this.choices) {
        return SyntaxChoiceNode(this.startIndex, this.endIndex, choices);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SyntaxChoiceNode(" + inspect(this.choices, null, depth != null ? depth - 1 : null) + ")";
    };
    return SyntaxChoiceNode;
  }(Node));
  Node.SyntaxMany = SyntaxManyNode = (function (_super) {
    var _proto, _superproto;
    function SyntaxManyNode(startIndex, endIndex, inner, multiplier) {
      var _this;
      if (!(inner instanceof Node)) {
        throw TypeError("Expected inner to be a Node, got " + __typeof(inner));
      }
      if (typeof multiplier !== "string") {
        throw TypeError("Expected multiplier to be a String, got " + __typeof(multiplier));
      }
      _this = this instanceof SyntaxManyNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.inner = inner;
      _this.multiplier = multiplier;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SyntaxManyNode.prototype = __create(_superproto);
    _proto.constructor = SyntaxManyNode;
    SyntaxManyNode.displayName = "SyntaxManyNode";
    SyntaxManyNode.cappedName = "SyntaxMany";
    SyntaxManyNode.argNames = ["inner", "multiplier"];
    State.addNodeFactory("syntaxMany", SyntaxManyNode);
    _proto.walk = function (f) {
      var inner;
      inner = f(this.inner);
      if (inner !== this.inner) {
        return SyntaxManyNode(this.startIndex, this.endIndex, inner, this.multiplier);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SyntaxManyNode(" + inspect(this.inner, null, depth != null ? depth - 1 : null) + ", " + inspect(this.multiplier, null, depth != null ? depth - 1 : null) + ")";
    };
    return SyntaxManyNode;
  }(Node));
  Node.SyntaxParam = SyntaxParamNode = (function (_super) {
    var _proto, _superproto;
    function SyntaxParamNode(startIndex, endIndex, ident, asType) {
      var _this;
      if (!(ident instanceof Node)) {
        throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
      }
      if (asType == void 0) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      _this = this instanceof SyntaxParamNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.asType = asType;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SyntaxParamNode.prototype = __create(_superproto);
    _proto.constructor = SyntaxParamNode;
    SyntaxParamNode.displayName = "SyntaxParamNode";
    SyntaxParamNode.cappedName = "SyntaxParam";
    SyntaxParamNode.argNames = ["ident", "asType"];
    State.addNodeFactory("syntaxParam", SyntaxParamNode);
    _proto.walk = function (func) {
      var asType, ident;
      ident = func(this.ident);
      asType = this.asType != null ? func(this.asType) : this.asType;
      if (ident !== this.ident || asType !== this.asType) {
        return SyntaxParamNode(this.startIndex, this.endIndex, ident, asType);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SyntaxParamNode(" + inspect(this.ident, null, depth != null ? depth - 1 : null) + ", " + inspect(this.asType, null, depth != null ? depth - 1 : null) + ")";
    };
    return SyntaxParamNode;
  }(Node));
  Node.SyntaxSequence = SyntaxSequenceNode = (function (_super) {
    var _proto, _superproto;
    function SyntaxSequenceNode(startIndex, endIndex, params) {
      var _i, _len, _this;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          if (!(params[_i] instanceof Node)) {
            throw TypeError("Expected params[" + _i + "] to be a Node, got " + __typeof(params[_i]));
          }
        }
      }
      _this = this instanceof SyntaxSequenceNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = SyntaxSequenceNode.prototype = __create(_superproto);
    _proto.constructor = SyntaxSequenceNode;
    SyntaxSequenceNode.displayName = "SyntaxSequenceNode";
    SyntaxSequenceNode.cappedName = "SyntaxSequence";
    SyntaxSequenceNode.argNames = ["params"];
    State.addNodeFactory("syntaxSequence", SyntaxSequenceNode);
    _proto.walk = function (f) {
      var params;
      params = map(this.params, f);
      if (params !== this.params) {
        return SyntaxSequenceNode(this.startIndex, this.endIndex, params);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "SyntaxSequenceNode(" + inspect(this.params, null, depth != null ? depth - 1 : null) + ")";
    };
    return SyntaxSequenceNode;
  }(Node));
  Node.This = ThisNode = (function (_super) {
    var _proto, _superproto;
    function ThisNode(startIndex, endIndex) {
      var _this;
      _this = this instanceof ThisNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ThisNode.prototype = __create(_superproto);
    _proto.constructor = ThisNode;
    ThisNode.displayName = "ThisNode";
    ThisNode.cappedName = "This";
    ThisNode.argNames = [];
    State.addNodeFactory("this", ThisNode);
    _proto.cacheable = false;
    _proto.walk = retThis;
    _proto.inspect = function (depth) {
      return "ThisNode()";
    };
    return ThisNode;
  }(Node));
  Node.Throw = ThrowNode = (function (_super) {
    var _proto, _superproto;
    function ThrowNode(startIndex, endIndex, node) {
      var _this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this = this instanceof ThrowNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = ThrowNode.prototype = __create(_superproto);
    _proto.constructor = ThrowNode;
    ThrowNode.displayName = "ThrowNode";
    ThrowNode.cappedName = "Throw";
    ThrowNode.argNames = ["node"];
    State.addNodeFactory("throw", ThrowNode);
    _proto.type = function () {
      return Type.none;
    };
    _proto.isStatement = function () {
      return true;
    };
    _proto._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap();
      if (node !== this.node) {
        return ThrowNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return ThrowNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "ThrowNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ")";
    };
    return ThrowNode;
  }(Node));
  Node.Tmp = TmpNode = (function (_super) {
    var _proto, _superproto;
    function TmpNode(startIndex, endIndex, id, name, _type) {
      var _this;
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (_type == void 0) {
        _type = Type.any;
      } else if (!(_type instanceof Type)) {
        throw TypeError("Expected _type to be a Type, got " + __typeof(_type));
      }
      _this = this instanceof TmpNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.name = name;
      _this._type = _type;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TmpNode.prototype = __create(_superproto);
    _proto.constructor = TmpNode;
    TmpNode.displayName = "TmpNode";
    TmpNode.cappedName = "Tmp";
    TmpNode.argNames = ["id", "name", "_type"];
    State.addNodeFactory("tmp", TmpNode);
    _proto.cacheable = false;
    _proto.type = function () {
      return this._type;
    };
    _proto.walk = function (f) {
      return this;
    };
    _proto.inspect = function (depth) {
      return "TmpNode(" + inspect(this.id, null, depth != null ? depth - 1 : null) + ", " + inspect(this.name, null, depth != null ? depth - 1 : null) + ", " + inspect(this._type, null, depth != null ? depth - 1 : null) + ")";
    };
    return TmpNode;
  }(Node));
  Node.TryCatch = TryCatchNode = (function (_super) {
    var _proto, _superproto;
    function TryCatchNode(startIndex, endIndex, tryBody, catchIdent, catchBody) {
      var _this;
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Node)) {
        throw TypeError("Expected catchIdent to be a Node, got " + __typeof(catchIdent));
      }
      if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      _this = this instanceof TryCatchNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.tryBody = tryBody;
      _this.catchIdent = catchIdent;
      _this.catchBody = catchBody;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TryCatchNode.prototype = __create(_superproto);
    _proto.constructor = TryCatchNode;
    TryCatchNode.displayName = "TryCatchNode";
    TryCatchNode.cappedName = "TryCatch";
    TryCatchNode.argNames = ["tryBody", "catchIdent", "catchBody"];
    State.addNodeFactory("tryCatch", TryCatchNode);
    _proto.type = function (o) {
      var _ref;
      if ((_ref = this._type) == null) {
        return this._type = this.tryBody.type(o).union(this.catchBody.type(o));
      } else {
        return _ref;
      }
    };
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = function (f) {
      var catchBody, catchIdent, tryBody;
      tryBody = f(this.tryBody);
      catchIdent = f(this.catchIdent);
      catchBody = f(this.catchBody);
      if (tryBody !== this.tryBody || catchIdent !== this.catchIdent || catchBody !== this.catchBody) {
        return TryCatchNode(
          this.startIndex,
          this.endIndex,
          tryBody,
          catchIdent,
          catchBody
        );
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "TryCatchNode(" + inspect(this.tryBody, null, depth != null ? depth - 1 : null) + ", " + inspect(this.catchIdent, null, depth != null ? depth - 1 : null) + ", " + inspect(this.catchBody, null, depth != null ? depth - 1 : null) + ")";
    };
    return TryCatchNode;
  }(Node));
  Node.TryFinally = TryFinallyNode = (function (_super) {
    var _proto, _superproto;
    function TryFinallyNode(startIndex, endIndex, tryBody, finallyBody) {
      var _this;
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      _this = this instanceof TryFinallyNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.tryBody = tryBody;
      _this.finallyBody = finallyBody;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TryFinallyNode.prototype = __create(_superproto);
    _proto.constructor = TryFinallyNode;
    TryFinallyNode.displayName = "TryFinallyNode";
    TryFinallyNode.cappedName = "TryFinally";
    TryFinallyNode.argNames = ["tryBody", "finallyBody"];
    State.addNodeFactory("tryFinally", TryFinallyNode);
    _proto.type = function (o) {
      return this.tryBody.type(o);
    };
    _proto._reduce = function (o) {
      var finallyBody, tryBody;
      tryBody = this.tryBody.reduce(o);
      finallyBody = this.finallyBody.reduce(o);
      if (finallyBody instanceof NothingNode) {
        return tryBody;
      } else if (tryBody instanceof NothingNode) {
        return finallyBody;
      } else if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
        return TryFinallyNode(this.startIndex, this.endIndex, tryBody, finallyBody);
      } else {
        return this;
      }
    };
    _proto.isStatement = function () {
      return true;
    };
    _proto.walk = function (f) {
      var finallyBody, tryBody;
      tryBody = f(this.tryBody);
      finallyBody = f(this.finallyBody);
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
        return TryFinallyNode(this.startIndex, this.endIndex, tryBody, finallyBody);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "TryFinallyNode(" + inspect(this.tryBody, null, depth != null ? depth - 1 : null) + ", " + inspect(this.finallyBody, null, depth != null ? depth - 1 : null) + ")";
    };
    return TryFinallyNode;
  }(Node));
  Node.TypeArray = TypeArrayNode = (function (_super) {
    var _proto, _superproto;
    function TypeArrayNode(startIndex, endIndex, subtype) {
      var _this;
      if (!(subtype instanceof Node)) {
        throw TypeError("Expected subtype to be a Node, got " + __typeof(subtype));
      }
      _this = this instanceof TypeArrayNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.subtype = subtype;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TypeArrayNode.prototype = __create(_superproto);
    _proto.constructor = TypeArrayNode;
    TypeArrayNode.displayName = "TypeArrayNode";
    TypeArrayNode.cappedName = "TypeArray";
    TypeArrayNode.argNames = ["subtype"];
    State.addNodeFactory("typeArray", TypeArrayNode);
    _proto.walk = function (f) {
      var subtype;
      subtype = f(this.subtype);
      if (subtype !== this.subtype) {
        return TypeArrayNode(this.startIndex, this.endIndex, subtype);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "TypeArrayNode(" + inspect(this.subtype, null, depth != null ? depth - 1 : null) + ")";
    };
    return TypeArrayNode;
  }(Node));
  Node.TypeUnion = TypeUnionNode = (function (_super) {
    var _proto, _superproto;
    function TypeUnionNode(startIndex, endIndex, types) {
      var _i, _len, _this;
      if (!__isArray(types)) {
        throw TypeError("Expected types to be an Array, got " + __typeof(types));
      } else {
        for (_i = 0, _len = types.length; _i < _len; ++_i) {
          if (!(types[_i] instanceof Node)) {
            throw TypeError("Expected types[" + _i + "] to be a Node, got " + __typeof(types[_i]));
          }
        }
      }
      _this = this instanceof TypeUnionNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.types = types;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TypeUnionNode.prototype = __create(_superproto);
    _proto.constructor = TypeUnionNode;
    TypeUnionNode.displayName = "TypeUnionNode";
    TypeUnionNode.cappedName = "TypeUnion";
    TypeUnionNode.argNames = ["types"];
    State.addNodeFactory("typeUnion", TypeUnionNode);
    _proto.walk = function (f) {
      var types;
      types = map(this.types, f);
      if (types !== this.types) {
        return TypeUnionNode(this.startIndex, this.endIndex, types);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "TypeUnionNode(" + inspect(this.types, null, depth != null ? depth - 1 : null) + ")";
    };
    return TypeUnionNode;
  }(Node));
  Node.Unary = UnaryNode = (function (_super) {
    var _proto, _superproto;
    function UnaryNode(startIndex, endIndex, op, node) {
      var _this;
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this = this instanceof UnaryNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.op = op;
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = UnaryNode.prototype = __create(_superproto);
    _proto.constructor = UnaryNode;
    UnaryNode.displayName = "UnaryNode";
    UnaryNode.cappedName = "Unary";
    UnaryNode.argNames = ["op", "node"];
    State.addNodeFactory("unary", UnaryNode);
    _proto.type = (function () {
      var ops;
      ops = {
        "-": Type.number,
        "+": Type.number,
        "--": Type.number,
        "++": Type.number,
        "!": Type.boolean,
        "~": Type.number,
        "typeof": Type.string,
        "delete": Type.boolean
      };
      return function () {
        var _ref;
        return (__owns(ops, _ref = this.op) ? ops[_ref] : void 0) || Type.any;
      };
    }());
    _proto._reduce = (function () {
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
                this.startIndex,
                this.endIndex,
                node.op === "-" ? "+" : "-",
                node.node
              );
            }
          } else if (node instanceof BinaryNode) {
            if ((_ref = node.op) === "-" || _ref === "+") {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                node.left,
                node.op === "-" ? "+" : "-",
                node.right
              );
            } else if ((_ref = node.op) === "*" || _ref === "/") {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                Unary("-", node.left),
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
                this.startIndex,
                this.endIndex,
                UnaryNode(x.startIndex, x.endIndex, "!", x),
                "||",
                UnaryNode(y.startIndex, y.endIndex, "!", y)
              );
            },
            "||": function (x, y) {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                UnaryNode(x.startIndex, x.endIndex, "!", x),
                "&&",
                UnaryNode(y.startIndex, y.endIndex, "!", y)
              );
            }
          };
          return function (node, o) {
            var invert;
            if (node instanceof UnaryNode) {
              if (node.op === "!" && node.node.type(o).isSubsetOf(Type.boolean)) {
                return node.node;
              }
            } else if (node instanceof BinaryNode && __owns(invertibleBinaryOps, node.op)) {
              invert = invertibleBinaryOps[node.op];
              if (typeof invert === "function") {
                return invert.call(this, node.left, node.right);
              } else {
                return BinaryNode(
                  this.startIndex,
                  this.endIndex,
                  node.left,
                  invert,
                  node.right
                );
              }
            }
          };
        }())
      };
      return function (o) {
        var node, op, result;
        node = this.node.reduce(o).doWrap();
        op = this.op;
        if (node.isConst() && __owns(constOps, op)) {
          return ConstNode(this.startIndex, this.endIndex, constOps[op](node.constValue()));
        }
        result = __owns(nonconstOps, op) ? nonconstOps[op].call(this, node, o) : void 0;
        if (result != null) {
          return result.reduce(o);
        }
        if (node !== this.node) {
          return UnaryNode(this.startIndex, this.endIndex, op, node);
        } else {
          return this;
        }
      };
    }());
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return UnaryNode(this.startIndex, this.endIndex, this.op, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "UnaryNode(" + inspect(this.op, null, depth != null ? depth - 1 : null) + ", " + inspect(this.node, null, depth != null ? depth - 1 : null) + ")";
    };
    return UnaryNode;
  }(Node));
  Node.TmpWrapper = TmpWrapperNode = (function (_super) {
    var _proto, _superproto;
    function TmpWrapperNode(startIndex, endIndex, node, tmps) {
      var _this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(tmps)) {
        throw TypeError("Expected tmps to be a Array, got " + __typeof(tmps));
      }
      _this = this instanceof TmpWrapperNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.tmps = tmps;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = TmpWrapperNode.prototype = __create(_superproto);
    _proto.constructor = TmpWrapperNode;
    TmpWrapperNode.displayName = "TmpWrapperNode";
    TmpWrapperNode.cappedName = "TmpWrapper";
    TmpWrapperNode.argNames = ["node", "tmps"];
    State.addNodeFactory("tmpWrapper", TmpWrapperNode);
    _proto.type = function (o) {
      return this.node.type(o);
    };
    _proto._reduce = function (o) {
      var node;
      node = this.node.reduce(o);
      if (this.tmps.length === 0) {
        return node;
      } else if (this.node !== node) {
        return TmpWrapperNode(this.startIndex, this.endIndex, node, this.tmps);
      } else {
        return this;
      }
    };
    _proto.isStatement = function () {
      return this.node.isStatement();
    };
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return TmpWrapperNode(this.startIndex, this.endIndex, node, this.tmps);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "TmpWrapperNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ", " + inspect(this.tmps, null, depth != null ? depth - 1 : null) + ")";
    };
    return TmpWrapperNode;
  }(Node));
  Node.Var = VarNode = (function (_super) {
    var _proto, _superproto;
    function VarNode(startIndex, endIndex, ident, isMutable) {
      var _this;
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be a IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (isMutable == void 0) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      _this = this instanceof VarNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.isMutable = isMutable;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = VarNode.prototype = __create(_superproto);
    _proto.constructor = VarNode;
    VarNode.displayName = "VarNode";
    VarNode.cappedName = "Var";
    VarNode.argNames = ["ident", "isMutable"];
    State.addNodeFactory("var", VarNode);
    _proto.walk = function (f) {
      return this;
    };
    _proto.inspect = function (depth) {
      return "VarNode(" + inspect(this.ident, null, depth != null ? depth - 1 : null) + ", " + inspect(this.isMutable, null, depth != null ? depth - 1 : null) + ")";
    };
    return VarNode;
  }(Node));
  Node.Yield = YieldNode = (function (_super) {
    var _proto, _superproto;
    function YieldNode(startIndex, endIndex, node) {
      var _this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this = this instanceof YieldNode ? this : __create(_proto);
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _superproto = _super.prototype;
    _proto = YieldNode.prototype = __create(_superproto);
    _proto.constructor = YieldNode;
    YieldNode.displayName = "YieldNode";
    YieldNode.cappedName = "Yield";
    YieldNode.argNames = ["node"];
    State.addNodeFactory("yield", YieldNode);
    _proto.isStatement = function () {
      return true;
    };
    _proto._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap();
      if (node !== this.node) {
        return YieldNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return YieldNode(this.startIndex, this.endIndex, node);
      } else {
        return this;
      }
    };
    _proto.inspect = function (depth) {
      return "YieldNode(" + inspect(this.node, null, depth != null ? depth - 1 : null) + ")";
    };
    return YieldNode;
  }(Node));
  function withoutRepeats(array) {
    var _i, _len, item, lastItem, result;
    result = [];
    lastItem = void 0;
    for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
      item = array[_i];
      if (item !== lastItem) {
        result.push(item);
      }
      lastItem = item;
    }
    return result;
  }
  function buildExpected(errors) {
    var errs;
    errs = withoutRepeats(__slice(errors, void 0, void 0).sort(function (a, b) {
      return __cmp(a.toLowerCase(), b.toLowerCase());
    }));
    switch (errs.length) {
    case 0:
      return "End of input";
    case 1:
      return errs[0];
    case 2:
      return __strnum(errs[0]) + " or " + __strnum(errs[1]);
    default:
      return __strnum(__slice(errs, void 0, -1).join(", ")) + ", or " + __strnum(errs[__num(errs.length) - 1]);
    }
  }
  function buildErrorMessage(errors, lastToken) {
    return "Expected " + __strnum(buildExpected(errors)) + ", but " + __strnum(lastToken) + " found";
  }
  function parse(text, macros, options) {
    var _ref, index, lastToken, line, messages, o, result;
    if (options == void 0) {
      options = {};
    }
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a string, got " + __typeof(text));
    }
    o = State(
      text,
      macros != null ? macros.clone() : void 0,
      options
    );
    result = (function () {
      try {
        return Root(o);
      } catch (e) {
        if (e !== SHORT_CIRCUIT) {
          throw e;
        }
      }
    }());
    o.doneParsing = true;
    if (!result || __lt(o.index, o.data.length)) {
      index = (_ref = o.failures).index;
      line = _ref.line;
      messages = _ref.messages;
      lastToken = __lt(index, o.data.length)
        ? JSON.stringify(o.data.substring(index, __num(index) + 20))
        : "end-of-input";
      throw ParserError(
        buildErrorMessage(messages, lastToken),
        o.data,
        index,
        line
      );
    } else {
      return { result: o.macroExpandAll(result).reduce(o), macros: o.macros };
    }
  }
  module.exports = parse;
  module.exports.ParserError = ParserError;
  module.exports.MacroError = MacroError;
  module.exports.Node = Node;
  module.exports.deserializePrelude = function (data) {
    var macros, parsed;
    if (typeof data !== "string") {
      throw TypeError("Expected data to be a String, got " + __typeof(data));
    }
    parsed = JSON.parse(data);
    macros = MacroHolder();
    macros.deserialize(parsed);
    return {
      result: NothingNode(0, 0),
      macros: macros
    };
  };
  function unique(array) {
    var _i, _len, item, result;
    result = [];
    for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
      item = array[_i];
      if (result.indexOf(item) === -1) {
        result.push(item);
      }
    }
    return result;
  }
  module.exports.getReservedWords = function (macros) {
    return unique(__toArray(RESERVED_IDENTS).concat(__toArray((macros != null && typeof macros.getMacroAndOperatorNames === "function" ? macros.getMacroAndOperatorNames() : void 0) || [])));
  };
}.call(this));
