(function () {
  "use strict";
  var __async, __asyncResult, __bind, __cmp, __create, __in, __isArray, __isObject, __lt, __lte, __num, __owns, __slice, __str, __strnum, __toArray, __typeof, _Block, _FunctionBody, _inAst, _inFunctionTypeParams, _inGenerator, _inMacro, _Name, _NameOrSymbol, _position, _preventUnclosedObjectLiteral, _Space, _Symbol, AccessMultiNode, AccessNode, Advance, AnyArrayLiteral, AnyChar, AnyObjectLiteral, ArgsNode, ArgumentsLiteral, ArrayLiteral, ArrayNode, ArrayParameter, ArrayType, Assignment, AssignmentAsExpression, AssignNode, Ast, Asterix, AstExpression, AstExpressionToken, AsToken, AstStatement, AstToken, AtSign, Backslash, BackslashEscapeSequence, BackslashStringLiteral, BasicInvocationOrAccess, BinaryDigit, BinaryNode, BinaryNumber, Block, BlockNode, Body, BOM, BracketedObjectKey, BreakNode, CallNode, CheckIndent, CheckStop, CloseCurlyBrace, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonChar, Comma, CommaOrNewline, CommaOrNewlineWithCheckIndent, ComplexAssignable, ConstantLiteral, ConstNode, ConstObjectKey, ContinueNode, convertInvocationOrAccess, CountIndent, CustomAssignment, CustomBinaryOperator, CustomOperatorCloseParenthesis, CustomPostfixUnary, CustomPrefixUnary, DebuggerNode, DecimalDigit, DecimalNumber, DeclareEqualSymbol, DedentedBody, DefineHelper, DefineHelperStart, DefineMacro, DefineOperator, DefineOperatorStart, DefineSyntax, DefineSyntaxStart, DefNode, DirectAssignment, DollarSign, DoubleColon, DoubleQuote, DoubleStringArrayLiteral, DoubleStringLiteral, DoubleStringLiteralInner, DualObjectKey, EmptyLine, EmptyLines, Eval, EvalNode, EvalToken, Expression, ExpressionAsStatement, ExpressionOrAssignment, FailureManager, FalseLiteral, ForInNode, ForNode, freeze, fromCharCode, FunctionBody, FunctionDeclaration, FunctionLiteral, FunctionNode, FunctionType, generateCacheKey, GeneratorFunctionBody, getTmpId, getUseCustomBinaryOperator, GLOBAL, HashSign, HexDigit, HexEscapeSequence, HexNumber, Identifier, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrAccessPart, IdentifierOrAccessStart, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierParameter, IdentNode, IfNode, inAst, IndentedUnclosedArrayLiteral, IndentedUnclosedArrayLiteralInner, IndentedUnclosedObjectLiteral, IndentedUnclosedObjectLiteralInner, INDENTS, Index, inExpression, InfinityLiteral, inFunctionTypeParams, inMacro, inspect, inStatement, InvocationArguments, InvocationOrAccess, InvocationOrAccessPart, KeyValuePair, KvpParameter, Letter, Line, Literal, Logic, LowerR, LowerU, LowerX, MacroAccessNode, MacroBody, MacroError, MacroHelper, MacroHolder, MacroName, MacroNames, MacroOptions, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, MacroToken, MaybeAdvance, MaybeAsType, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExclamationPointNoSpace, MaybeExistentialSymbolNoSpace, MaybeNotToken, MaybeSpreadToken, Minus, Name, NameChar, NamePart, NameStart, NaNLiteral, Newline, NewlineWithCheckIndent, nextTick, Node, nodeToType, NonUnionType, NoSpace, NotColon, Nothing, NOTHING, NothingNode, notInFunctionTypeParams, NullLiteral, NumberChar, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectLiteral, ObjectNode, ObjectParameter, ObjectType, ObjectTypePair, OctalDigit, OctalNumber, OpenCurlyBrace, OpenParenthesis, OpenSquareBracket, OpenSquareBracketChar, ParamDualObjectKey, Parameter, Parameters, ParameterSequence, ParamNode, ParamSingularObjectKey, Parenthetical, ParserError, PercentSign, PercentSignDoubleQuote, PercentSignTripleDoubleQuote, Period, Pipe, Plus, PlusOrMinus, PopIndent, preventUnclosedObjectLiteral, PrimaryExpression, PropertyDualObjectKey, PropertyObjectKeyColon, PropertyOrDualObjectKey, PushFakeIndent, PushIndent, RadixNumber, RegexComment, RegexDoubleToken, RegexFlags, RegexLiteral, RegexpNode, RegexSingleToken, RegexTripleDoubleToken, RegexTripleSingleToken, RESERVED_IDENTS, ReturnNode, RootNode, Scope, Semicolon, Shebang, SHORT_CIRCUIT, SimpleAssignable, SimpleConstantLiteral, SingleEscapeCharacter, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, Space, SpaceChar, SpreadNode, SpreadOrExpression, Stack, State, Statement, StringIndent, StringInterpolation, StringLiteral, SuperInvocation, SuperNode, SuperToken, SwitchNode, Symbol, SymbolChar, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, SyntaxToken, ThisLiteral, ThisNode, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, ThrowNode, TmpNode, TmpWrapperNode, TripleDoubleQuote, TripleDoubleStringArrayLiteral, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TryCatchNode, TryFinallyNode, Type, TypeArrayNode, TypeFunctionNode, TypeObjectNode, TypeReference, TypeUnionNode, UnaryNode, UnclosedArguments, UnclosedArrayLiteralElement, UnclosedObjectLiteral, Underscore, UnicodeEscapeSequence, UseMacro, VarNode, VoidLiteral, YieldNode, Zero;
  __async = function (limit, length, onValue, onComplete) {
    var broken, index, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    function onValueCallback(err) {
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (!sync) {
        return next();
      }
    }
    index = 0;
    function next() {
      var f, i;
      while (broken == null && slotsUsed < limit && index < length) {
        ++slotsUsed;
        i = index;
        ++index;
        sync = true;
        onValue(i, onValueCallback);
        sync = false;
      }
      if (broken != null || slotsUsed === 0) {
        f = onComplete;
        onComplete = void 0;
        if (f) {
          return f(broken);
        }
      }
    }
    return next();
  };
  __asyncResult = function (limit, length, onValue, onComplete) {
    var broken, index, result, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null, []);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    result = [];
    function onValueCallback(err, value) {
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        return next();
      }
    }
    index = 0;
    function next() {
      var f, i;
      while (broken == null && slotsUsed < limit && index < length) {
        ++slotsUsed;
        i = index;
        ++index;
        sync = true;
        onValue(i, onValueCallback);
        sync = false;
      }
      if (broken != null || slotsUsed === 0) {
        f = onComplete;
        onComplete = void 0;
        if (f) {
          if (broken != null) {
            return f(broken);
          } else {
            return f(null, result);
          }
        }
      }
    }
    return next();
  };
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
      return func.apply(parent, __toArray(arguments));
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
  Type = require("./types");
  inspect = require("util").inspect;
  if (typeof window !== "undefined") {
    GLOBAL = window;
  } else {
    GLOBAL = global;
  }
  if (typeof Object.freeze === "function") {
    freeze = Object.freeze;
  } else {
    freeze = function (o) {
      return o;
    };
  }
  if (typeof process !== "undefined" && typeof process.nextTick === "function") {
    nextTick = process.nextTick;
  } else {
    nextTick = function (f) {
      return setTimeout(f, 0);
    };
  }
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
      return ++id;
    };
  }());
  function copy(o) {
    var k, result, v;
    if (!__isObject(o)) {
      throw TypeError("Expected o to be an Object, got " + __typeof(o));
    }
    result = {};
    for (k in o) {
      if (__owns.call(o, k)) {
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
    if (name == null) {
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
      return ++id;
    };
  }());
  function cache(rule, dontCache) {
    var cacheKey;
    if (typeof rule !== "function") {
      throw TypeError("Expected rule to be a Function, got " + __typeof(rule));
    }
    if (dontCache == null) {
      dontCache = false;
    } else if (typeof dontCache !== "boolean") {
      throw TypeError("Expected dontCache to be a Boolean, got " + __typeof(dontCache));
    }
    if (dontCache) {
      return rule;
    } else {
      cacheKey = generateCacheKey();
      return named(rule.parserName, function (o) {
        var _ref, cache, indent, indentCache, index, inner, item, result;
        cache = o.cache;
        index = o.index;
        indent = o.indent.peek();
        if ((_ref = cache[indent]) != null) {
          indentCache = _ref;
        } else {
          indentCache = cache[indent] = [];
        }
        if ((_ref = indentCache[cacheKey]) != null) {
          inner = _ref;
        } else {
          inner = indentCache[cacheKey] = [];
        }
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
      });
    }
  }
  function sequential(array, mutator, dontCache) {
    var _len, i, item, key, mapping, name, rule, ruleName, rules, shouldWrapName;
    if (!__isArray(array)) {
      throw TypeError("Expected array to be an Array, got " + __typeof(array));
    }
    if (dontCache == null) {
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
    for (i = 0, _len = array.length; i < _len; ++i) {
      item = array[i];
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
        rule = item[1];
      } else if (typeof item === "function") {
        rule = item;
      } else {
        throw TypeError("Found a non-array, non-function in index #" + i + ": " + __typeof(item));
      }
      rules.push(rule);
      mapping.push(key);
      ruleName = rule.parserName || "<unknown>";
      if (i > 0 && name[name.length - 1].slice(-1) === '"' && ruleName.charAt(0) === '"' && ruleName.slice(-1) === '"') {
        name[name.length - 1] = name[name.length - 1].substring(0, __num(name[name.length - 1].length) - 1);
        name.push(ruleName.substring(1));
      } else {
        if (i > 0) {
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
        for (i = 0, _len = rules.length; i < _len; ++i) {
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
    parts.push.apply(parts, (function () {
      var _arr, _arr2, _len, i, part;
      for (_arr = [], _arr2 = __toArray(text.split(/([a-z]+)/gi)), i = 0, _len = _arr2.length; i < _len; ++i) {
        part = _arr2[i];
        if (part) {
          if (i % 2 === 0) {
            _arr.push(ruleEqual(_Symbol, part));
          } else {
            _arr.push(ruleEqual(_Name, part));
          }
        }
      }
      return _arr;
    }()));
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
    if (name == null) {
      name = getFuncName(func);
    }
    id = -1;
    return named(func.parserName, function (o) {
      var i, result;
      ++id;
      i = id;
      console.log(i + "-" + __strnum(name) + " starting at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()));
      result = func(o);
      if (!result) {
        console.log(i + "-" + __strnum(name) + " failure at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()));
      } else {
        console.log(i + "-" + __strnum(name) + " success at line #" + __strnum(o.line) + ", index " + __strnum(o.index) + ", indent " + __strnum(o.indent.peek()), result);
      }
      return result;
    });
  }
  Stack = (function () {
    var _Stack_prototype;
    function Stack(initial, data) {
      var _this;
      _this = this instanceof Stack ? this : __create(_Stack_prototype);
      if (data == null) {
        data = [];
      }
      _this.initial = initial;
      _this.data = data;
      return _this;
    }
    _Stack_prototype = Stack.prototype;
    Stack.displayName = "Stack";
    _Stack_prototype.push = function (value) {
      return this.data.push(value);
    };
    _Stack_prototype.pop = function () {
      var data, len;
      data = this.data;
      len = data.length;
      if (len === 0) {
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
    _Stack_prototype.clone = function () {
      return Stack(this.initial, this.data.slice());
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
  _preventUnclosedObjectLiteral = Stack(false);
  preventUnclosedObjectLiteral = makeAlterStack(_preventUnclosedObjectLiteral, true);
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
  _Space = named("_Space", (function () {
    var _rule;
    _rule = named(
      __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
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
  }()));
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
  CheckStop = named("CheckStop", (function () {
    var Eof, Stop;
    Eof = named("Eof", function (o) {
      return !__lt(o.index, o.data.length);
    });
    Stop = named("Stop", function (o) {
      return Newline(o) || Eof(o);
    });
    return function (o) {
      return Stop(o.clone());
    };
  }()));
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
  MaybeComment = cache(named("MaybeComment", (function () {
    var Comment, MultiLineComment, SingleLineComment;
    SingleLineComment = named("SingleLineComment", function (o) {
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
    });
    MultiLineComment = named("MultiLineComment", function (o) {
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
    });
    Comment = named("Comment", function (o) {
      return SingleLineComment(o) || MultiLineComment(o);
    });
    return named(
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
    );
  }())));
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
  NoSpace = cache(named("NoSpace", named(
    "!" + __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar"),
    function (o) {
      return !SpaceChar(o.clone());
    }
  )));
  EmptyLine = cache(named("EmptyLine", (function () {
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
  EmptyLines = cache(named("EmptyLines", (function () {
    var _rule;
    _rule = named(
      __strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "EmptyLine") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
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
        while (true) {
          item = EmptyLine(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        if (result.length >= 1) {
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
        while (true) {
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
      var _arr, _i, c, count, i;
      count = 1;
      for (_arr = __toArray(x), _i = _arr.length; _i--; ) {
        c = _arr[_i];
        i = INDENTS[c];
        if (!i) {
          throw Error("Unexpected indent char: " + __str(JSON.stringify(c)));
        }
        count += __num(i);
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
        } else {
          return _mutator(result, o, index, line);
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
        } else {
          return _mutator(result, o, index, line);
        }
      }
    );
  }()));
  PushFakeIndent = (function () {
    var cache;
    cache = [];
    return function (n) {
      var _ref;
      if ((_ref = cache[n]) == null) {
        return cache[n] = named("PushFakeIndent(" + __strnum(n) + ")", function (o) {
          o.indent.push(__num(o.indent.peek()) + __num(n));
          return true;
        });
      } else {
        return _ref;
      }
    };
  }());
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
  Pipe = cache(named("Pipe", (function () {
    var _rule;
    _rule = named('"|"', function (o) {
      if (o.data.charCodeAt(o.index) === 124) {
        o.index = __num(o.index) + 1;
        return 124;
      } else {
        o.fail('"|"');
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
  Minus = named("Minus", named('"-"', function (o) {
    if (o.data.charCodeAt(o.index) === 45) {
      o.index = __num(o.index) + 1;
      return 45;
    } else {
      o.fail('"-"');
      return false;
    }
  }));
  Plus = named("Plus", named('"+"', function (o) {
    if (o.data.charCodeAt(o.index) === 43) {
      o.index = __num(o.index) + 1;
      return 43;
    } else {
      o.fail('"+"');
      return false;
    }
  }));
  PlusOrMinus = named("PlusOrMinus", named("[+\\-]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 43 || c === 45) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[+\\-]");
      return false;
    }
  }));
  Letter = named("Letter", named("letter", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c >= 65 && c <= 90 || c >= 97 && c <= 122 : c === 170 || c === 181 || c === 186 || c >= 192 && c <= 214 || c >= 216 && c <= 246 || c >= 248 && c <= 705 || c >= 710 && c <= 721 || c >= 736 && c <= 740 || c === 748 || c === 750 || c >= 880 && c <= 884 || c === 886 || c === 887 || c >= 890 && c <= 893 || c === 902 || c >= 904 && c <= 906 || c === 908 || c >= 910 && c <= 929 || c >= 931 && c <= 1013 || c >= 1015 && c <= 1153 || c >= 1162 && c <= 1317 || c >= 1329 && c <= 1366 || c === 1369 || c >= 1377 && c <= 1415 || c >= 1488 && c <= 1514 || c >= 1520 && c <= 1522 || c >= 1569 && c <= 1610 || c === 1646 || c === 1647 || c >= 1649 && c <= 1747 || c === 1749 || c === 1765 || c === 1766 || c === 1774 || c === 1775 || c >= 1786 && c <= 1788 || c === 1791 || c === 1808 || c >= 1810 && c <= 1839 || c >= 1869 && c <= 1957 || c === 1969 || c >= 1994 && c <= 2026 || c === 2036 || c === 2037 || c === 2042 || c >= 2048 && c <= 2069 || c === 2074 || c === 2084 || c === 2088 || c >= 2308 && c <= 2361 || c === 2365 || c === 2384 || c >= 2392 && c <= 2401 || c === 2417 || c === 2418 || c >= 2425 && c <= 2431 || c >= 2437 && c <= 2444 || c === 2447 || c === 2448 || c >= 2451 && c <= 2472 || c >= 2474 && c <= 2480 || c === 2482 || c >= 2486 && c <= 2489 || c === 2493 || c === 2510 || c === 2524 || c === 2525 || c >= 2527 && c <= 2529 || c === 2544 || c === 2545 || c >= 2565 && c <= 2570 || c === 2575 || c === 2576 || c >= 2579 && c <= 2600 || c >= 2602 && c <= 2608 || c === 2610 || c === 2611 || c === 2613 || c === 2614 || c === 2616 || c === 2617 || c >= 2649 && c <= 2652 || c === 2654 || c >= 2674 && c <= 2676 || c >= 2693 && c <= 2701 || c >= 2703 && c <= 2705 || c >= 2707 && c <= 2728 || c >= 2730 && c <= 2736 || c === 2738 || c === 2739 || c >= 2741 && c <= 2745 || c === 2749 || c === 2768 || c === 2784 || c === 2785 || c >= 2821 && c <= 2828 || c === 2831 || c === 2832 || c >= 2835 && c <= 2856 || c >= 2858 && c <= 2864 || c === 2866 || c === 2867 || c >= 2869 && c <= 2873 || c === 2877 || c === 2908 || c === 2909 || c >= 2911 && c <= 2913 || c === 2929 || c === 2947 || c >= 2949 && c <= 2954 || c >= 2958 && c <= 2960 || c >= 2962 && c <= 2965 || c === 2969 || c === 2970 || c === 2972 || c === 2974 || c === 2975 || c === 2979 || c === 2980 || c >= 2984 && c <= 2986 || c >= 2990 && c <= 3001 || c === 3024 || c >= 3077 && c <= 3084 || c >= 3086 && c <= 3088 || c >= 3090 && c <= 3112 || c >= 3114 && c <= 3123 || c >= 3125 && c <= 3129 || c === 3133 || c === 3160 || c === 3161 || c === 3168 || c === 3169 || c >= 3205 && c <= 3212 || c >= 3214 && c <= 3216 || c >= 3218 && c <= 3240 || c >= 3242 && c <= 3251 || c >= 3253 && c <= 3257 || c === 3261 || c === 3294 || c === 3296 || c === 3297 || c >= 3333 && c <= 3340 || c >= 3342 && c <= 3344 || c >= 3346 && c <= 3368 || c >= 3370 && c <= 3385 || c === 3389 || c === 3424 || c === 3425 || c >= 3450 && c <= 3455 || c >= 3461 && c <= 3478 || c >= 3482 && c <= 3505 || c >= 3507 && c <= 3515 || c === 3517 || c >= 3520 && c <= 3526 || c >= 3585 && c <= 3632 || c === 3634 || c === 3635 || c >= 3648 && c <= 3654 || c === 3713 || c === 3714 || c === 3716 || c === 3719 || c === 3720 || c === 3722 || c === 3725 || c >= 3732 && c <= 3735 || c >= 3737 && c <= 3743 || c >= 3745 && c <= 3747 || c === 3749 || c === 3751 || c === 3754 || c === 3755 || c >= 3757 && c <= 3760 || c === 3762 || c === 3763 || c === 3773 || c >= 3776 && c <= 3780 || c === 3782 || c === 3804 || c === 3805 || c === 3840 || c >= 3904 && c <= 3911 || c >= 3913 && c <= 3948 || c >= 3976 && c <= 3979 || c >= 4096 && c <= 4138 || c === 4159 || c >= 4176 && c <= 4181 || c >= 4186 && c <= 4189 || c === 4193 || c === 4197 || c === 4198 || c >= 4206 && c <= 4208 || c >= 4213 && c <= 4225 || c === 4238 || c >= 4256 && c <= 4293 || c >= 4304 && c <= 4346 || c === 4348 || c >= 4352 && c <= 4680 || c >= 4682 && c <= 4685 || c >= 4688 && c <= 4694 || c === 4696 || c >= 4698 && c <= 4701 || c >= 4704 && c <= 4744 || c >= 4746 && c <= 4749 || c >= 4752 && c <= 4784 || c >= 4786 && c <= 4789 || c >= 4792 && c <= 4798 || c === 4800 || c >= 4802 && c <= 4805 || c >= 4808 && c <= 4822 || c >= 4824 && c <= 4880 || c >= 4882 && c <= 4885 || c >= 4888 && c <= 4954 || c >= 4992 && c <= 5007 || c >= 5024 && c <= 5108 || c >= 5121 && c <= 5740 || c >= 5743 && c <= 5759 || c >= 5761 && c <= 5786 || c >= 5792 && c <= 5866 || c >= 5888 && c <= 5900 || c >= 5902 && c <= 5905 || c >= 5920 && c <= 5937 || c >= 5952 && c <= 5969 || c >= 5984 && c <= 5996 || c >= 5998 && c <= 6000 || c >= 6016 && c <= 6067 || c === 6103 || c === 6108 || c >= 6176 && c <= 6263 || c >= 6272 && c <= 6312 || c === 6314 || c >= 6320 && c <= 6389 || c >= 6400 && c <= 6428 || c >= 6480 && c <= 6509 || c >= 6512 && c <= 6516 || c >= 6528 && c <= 6571 || c >= 6593 && c <= 6599 || c >= 6656 && c <= 6678 || c >= 6688 && c <= 6740 || c === 6823 || c >= 6917 && c <= 6963 || c >= 6981 && c <= 6987 || c >= 7043 && c <= 7072 || c === 7086 || c === 7087 || c >= 7168 && c <= 7203 || c >= 7245 && c <= 7247 || c >= 7258 && c <= 7293 || c >= 7401 && c <= 7404 || c >= 7406 && c <= 7409 || c >= 7424 && c <= 7615 || c >= 7680 && c <= 7957 || c >= 7960 && c <= 7965 || c >= 7968 && c <= 8005 || c >= 8008 && c <= 8013 || c >= 8016 && c <= 8023 || c === 8025 || c === 8027 || c === 8029 || c >= 8031 && c <= 8061 || c >= 8064 && c <= 8116 || c >= 8118 && c <= 8124 || c === 8126 || c >= 8130 && c <= 8132 || c >= 8134 && c <= 8140 || c >= 8144 && c <= 8147 || c >= 8150 && c <= 8155 || c >= 8160 && c <= 8172 || c >= 8178 && c <= 8180 || c >= 8182 && c <= 8188 || c === 8305 || c === 8319 || c >= 8336 && c <= 8340 || c === 8450 || c === 8455 || c >= 8458 && c <= 8467 || c === 8469 || c >= 8473 && c <= 8477 || c === 8484 || c === 8486 || c === 8488 || c >= 8490 && c <= 8493 || c >= 8495 && c <= 8505 || c >= 8508 && c <= 8511 || c >= 8517 && c <= 8521 || c === 8526 || c === 8579 || c === 8580 || c >= 11264 && c <= 11310 || c >= 11312 && c <= 11358 || c >= 11360 && c <= 11492 || c >= 11499 && c <= 11502 || c >= 11520 && c <= 11557 || c >= 11568 && c <= 11621 || c === 11631 || c >= 11648 && c <= 11670 || c >= 11680 && c <= 11686 || c >= 11688 && c <= 11694 || c >= 11696 && c <= 11702 || c >= 11704 && c <= 11710 || c >= 11712 && c <= 11718 || c >= 11720 && c <= 11726 || c >= 11728 && c <= 11734 || c >= 11736 && c <= 11742 || c === 11823 || c === 12293 || c === 12294 || c >= 12337 && c <= 12341 || c === 12347 || c === 12348 || c >= 12353 && c <= 12438 || c >= 12445 && c <= 12447 || c >= 12449 && c <= 12538 || c >= 12540 && c <= 12543 || c >= 12549 && c <= 12589 || c >= 12593 && c <= 12686 || c >= 12704 && c <= 12727 || c >= 12784 && c <= 12799 || c >= 13312 && c <= 19893 || c >= 19968 && c <= 40907 || c >= 40960 && c <= 42124 || c >= 42192 && c <= 42237 || c >= 42240 && c <= 42508 || c >= 42512 && c <= 42527 || c === 42538 || c === 42539 || c >= 42560 && c <= 42591 || c >= 42594 && c <= 42606 || c >= 42623 && c <= 42647 || c >= 42656 && c <= 42725 || c >= 42775 && c <= 42783 || c >= 42786 && c <= 42888 || c === 42891 || c === 42892 || c >= 43003 && c <= 43009 || c >= 43011 && c <= 43013 || c >= 43015 && c <= 43018 || c >= 43020 && c <= 43042 || c >= 43072 && c <= 43123 || c >= 43138 && c <= 43187 || c >= 43250 && c <= 43255 || c === 43259 || c >= 43274 && c <= 43301 || c >= 43312 && c <= 43334 || c >= 43360 && c <= 43388 || c >= 43396 && c <= 43442 || c === 43471 || c >= 43520 && c <= 43560 || c >= 43584 && c <= 43586 || c >= 43588 && c <= 43595 || c >= 43616 && c <= 43638 || c === 43642 || c >= 43648 && c <= 43695 || c === 43697 || c === 43701 || c === 43702 || c >= 43705 && c <= 43709 || c === 43712 || c === 43714 || c >= 43739 && c <= 43741 || c >= 43968 && c <= 44002 || c >= 44032 && c <= 55203 || c >= 55216 && c <= 55238 || c >= 55243 && c <= 55291 || c >= 63744 && c <= 64045 || c >= 64048 && c <= 64109 || c >= 64112 && c <= 64217 || c >= 64256 && c <= 64262 || c >= 64275 && c <= 64279 || c === 64285 || c >= 64287 && c <= 64296 || c >= 64298 && c <= 64310 || c >= 64312 && c <= 64316 || c === 64318 || c === 64320 || c === 64321 || c === 64323 || c === 64324 || c >= 64326 && c <= 64433 || c >= 64467 && c <= 64829 || c >= 64848 && c <= 64911 || c >= 64914 && c <= 64967 || c >= 65008 && c <= 65019 || c >= 65136 && c <= 65140 || c >= 65142 && c <= 65262 || c >= 65264 && c <= 65276 || c >= 65313 && c <= 65338 || c >= 65345 && c <= 65370 || c >= 65382 && c <= 65470 || c >= 65474 && c <= 65479 || c >= 65482 && c <= 65487 || c >= 65490 && c <= 65495 || c >= 65498 && c <= 65500) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("letter");
      return false;
    }
  }));
  NumberChar = named("NumberChar", named("number", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c < 128 ? c >= 48 && c <= 57 : c === 178 || c === 179 || c === 185 || c >= 188 && c <= 190 || c >= 1632 && c <= 1641 || c >= 1776 && c <= 1785 || c >= 1984 && c <= 1993 || c >= 2406 && c <= 2415 || c >= 2534 && c <= 2543 || c >= 2548 && c <= 2553 || c >= 2662 && c <= 2671 || c >= 2790 && c <= 2799 || c >= 2918 && c <= 2927 || c >= 3046 && c <= 3058 || c >= 3174 && c <= 3183 || c >= 3192 && c <= 3198 || c >= 3302 && c <= 3311 || c >= 3430 && c <= 3445 || c >= 3664 && c <= 3673 || c >= 3792 && c <= 3801 || c >= 3872 && c <= 3891 || c >= 4160 && c <= 4169 || c >= 4240 && c <= 4249 || c >= 4969 && c <= 4988 || c >= 5870 && c <= 5872 || c >= 6112 && c <= 6121 || c >= 6128 && c <= 6137 || c >= 6160 && c <= 6169 || c >= 6470 && c <= 6479 || c >= 6608 && c <= 6618 || c >= 6784 && c <= 6793 || c >= 6800 && c <= 6809 || c >= 6992 && c <= 7001 || c >= 7088 && c <= 7097 || c >= 7232 && c <= 7241 || c >= 7248 && c <= 7257 || c === 8304 || c >= 8308 && c <= 8313 || c >= 8320 && c <= 8329 || c >= 8528 && c <= 8578 || c >= 8581 && c <= 8585 || c >= 9312 && c <= 9371 || c >= 9450 && c <= 9471 || c >= 10102 && c <= 10131 || c === 11517 || c === 12295 || c >= 12321 && c <= 12329 || c >= 12344 && c <= 12346 || c >= 12690 && c <= 12693 || c >= 12832 && c <= 12841 || c >= 12881 && c <= 12895 || c >= 12928 && c <= 12937 || c >= 12977 && c <= 12991 || c >= 42528 && c <= 42537 || c >= 42726 && c <= 42735 || c >= 43056 && c <= 43061 || c >= 43216 && c <= 43225 || c >= 43264 && c <= 43273 || c >= 43472 && c <= 43481 || c >= 43600 && c <= 43609 || c >= 44016 && c <= 44025 || c >= 65296 && c <= 65305) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("number");
      return false;
    }
  }));
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
  PercentSign = cache(named("PercentSign", named('"%"', function (o) {
    if (o.data.charCodeAt(o.index) === 37) {
      o.index = __num(o.index) + 1;
      return 37;
    } else {
      o.fail('"%"');
      return false;
    }
  })));
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
        while (true) {
          item = DoubleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (result.length >= 3) {
            break;
          }
        }
        if (result.length >= 3) {
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
        while (true) {
          item = SingleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (result.length >= 3) {
            break;
          }
        }
        if (result.length >= 3) {
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
  Semicolon = cache(named("Semicolon", (function () {
    var _rule;
    _rule = named('";"', function (o) {
      if (o.data.charCodeAt(o.index) === 59) {
        o.index = __num(o.index) + 1;
        return 59;
      } else {
        o.fail('";"');
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
  Asterix = named("Asterix", named('"*"', function (o) {
    if (o.data.charCodeAt(o.index) === 42) {
      o.index = __num(o.index) + 1;
      return 42;
    } else {
      o.fail('"*"');
      return false;
    }
  }));
  OpenParenthesis = cache(named("OpenParenthesis", (function () {
    var _rule;
    _rule = named('"("', function (o) {
      if (o.data.charCodeAt(o.index) === 40) {
        o.index = __num(o.index) + 1;
        return 40;
      } else {
        o.fail('"("');
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
  SomeEmptyLinesWithCheckIndent = named("SomeEmptyLinesWithCheckIndent", function (o) {
    var clone;
    clone = o.clone();
    if (SomeEmptyLines(clone) && CheckIndent(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  });
  CommaOrNewlineWithCheckIndent = named("CommaOrNewlineWithCheckIndent", (function () {
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
  }()));
  MaybeCommaOrNewline = named("MaybeCommaOrNewline", named(
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
  ));
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
    var _arr, _i, _len, v;
    if (array == null) {
      array = [];
    }
    for (_arr = __toArray(codes), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      v = _arr[_i];
      array.push(fromCharCode(v));
    }
    return array;
  }
  NameStart = named("NameStart", function (o) {
    return Letter(o) || Underscore(o) || DollarSign(o);
  });
  NameChar = named("NameChar", function (o) {
    return NameStart(o) || NumberChar(o);
  });
  NamePart = named("NamePart", named(
    __strnum((NameChar != null ? NameChar.parserName : void 0) || "NameChar") + "+",
    function (o) {
      var clone, item, result;
      clone = o.clone();
      result = [];
      while (true) {
        item = NameChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      if (result.length >= 1) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  ));
  _Name = cache(named("_Name", (function () {
    return (function () {
      var _rule, _rule2;
      _rule = (function () {
        var _rule3;
        _rule3 = named(
          __strnum((NameChar != null ? NameChar.parserName : void 0) || "NameChar") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            while (true) {
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
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = NameStart(clone)) && (result.tail = _rule3(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      _rule2 = (function () {
        function _rule3(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (Minus(clone) && (result = NamePart(clone))) {
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
            while (true) {
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
          parts = [fromCharCode(x.head.head)];
          processCharCodes(x.head.tail, parts);
          for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            part = _arr[_i];
            parts.push(fromCharCode(part[0]).toUpperCase());
            processCharCodes(
              __slice(part, 1),
              parts
            );
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
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
        while (true) {
          item = SymbolChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        if (result.length >= 1) {
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
        } else {
          return _mutator(result, o, index, line);
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
          while (true) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          if (result.length >= 1) {
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
          } else {
            return _mutator(result, o, index, line);
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
  AnyChar = named("AnyChar", function (o) {
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
  });
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
        } else {
          return _mutator(result, o, index, line);
        }
      }
    );
  }())));
  ThisOrShorthandLiteral = cache(named("ThisOrShorthandLiteral", function (o) {
    return ThisLiteral(o) || ThisShorthandLiteral(o);
  }));
  ThisOrShorthandLiteralPeriod = named("ThisOrShorthandLiteralPeriod", (function () {
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
  }()));
  DecimalNumber = cache(named("DecimalNumber", (function () {
    var DecimalDigits, RawDecimalDigits;
    RawDecimalDigits = named("RawDecimalDigits", named(
      __strnum((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "DecimalDigit") + "+",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
          item = DecimalDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        if (result.length >= 1) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    ));
    DecimalDigits = named("DecimalDigits", (function () {
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
              while (true) {
                item = Underscore(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (result.length >= 1) {
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
            while (true) {
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
          for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }()));
    return (function () {
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
              } else {
                return _mutator(result, o, index, line);
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
          var _rule5, _rule6;
          _rule5 = named("[Ee]", function (o) {
            var c;
            c = o.data.charCodeAt(o.index);
            if (c === 69 || c === 101) {
              o.index = __num(o.index) + 1;
              return c;
            } else {
              o.fail("[Ee]");
              return false;
            }
          });
          _rule6 = named(
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
            function _rule7(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.e = _rule5(clone)) && (result.op = _rule6(clone)) && (result.digits = DecimalDigits(clone))) {
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
              (_rule7 != null ? _rule7.parserName : void 0) || "<unknown>",
              function (o) {
                var index, line, result;
                index = o.index;
                line = o.line;
                result = _rule7(o);
                if (!result) {
                  return false;
                } else {
                  return _mutator(result, o, index, line);
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
            o.error("Unable to parse number: " + text);
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
  }())));
  function makeRadixNumber(radix, separator, digit) {
    var digits;
    digits = (function () {
      var _rule, _rule2;
      _rule = named(
        __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          while (true) {
            item = digit(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          if (result.length >= 1) {
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
              while (true) {
                item = Underscore(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (result.length >= 1) {
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
              while (true) {
                item = digit(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (result.length >= 1) {
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
            while (true) {
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
          for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
            } else {
              return _mutator(result, o, index, line);
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
            if (decimal) {
              decimalText = "." + __strnum(decimal);
            } else {
              decimalText = "";
            }
            o.error("Unable to parse number: 0" + __strnum(fromCharCode(x.separator)) + __strnum(integer) + decimalText);
          }
          if (decimal) {
            while (true) {
              decimalNum = parseInt(decimal, radix);
              if (isFinite(decimalNum)) {
                value += decimalNum / Math.pow(__num(radix), __num(decimal.length));
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
  }
  HexDigit = named("HexDigit", named("[0-9A-Fa-f]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c >= 48 && c <= 57 || c >= 65 && c <= 70 || c >= 97 && c <= 102) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[0-9A-Fa-f]");
      return false;
    }
  }));
  HexNumber = named("HexNumber", makeRadixNumber(
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
  ));
  OctalDigit = named("OctalDigit", named("[0-7]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c >= 48 && c <= 55) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[0-7]");
      return false;
    }
  }));
  OctalNumber = named("OctalNumber", makeRadixNumber(
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
  ));
  BinaryDigit = named("BinaryDigit", named("[01]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 48 || c === 49) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[01]");
      return false;
    }
  }));
  BinaryNumber = named("BinaryNumber", makeRadixNumber(
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
  ));
  RadixNumber = named("RadixNumber", (function () {
    var GetDigits, Radix;
    GetDigits = (function () {
      var digitCache;
      digitCache = [];
      return function (radix) {
        var _ref;
        if ((_ref = digitCache[radix]) == null) {
          return digitCache[radix] = (function () {
            var _end, chars, digit, i;
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
              chars = [];
              for (i = 0, _end = __num(radix) > 10 ? __num(radix) : 10; i < _end; ++i) {
                chars[i + 48] = true;
              }
              for (i = 0, _end = (__num(radix) > 36 ? __num(radix) : 36) - 10; i < _end; ++i) {
                chars[i + 97] = true;
                chars[i + 65] = true;
              }
              digit = function (o) {
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
            return (function () {
              var _rule, _rule2;
              _rule = named(
                __strnum((digit != null ? digit.parserName : void 0) || "digit") + "+",
                function (o) {
                  var clone, item, result;
                  clone = o.clone();
                  result = [];
                  while (true) {
                    item = digit(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  if (result.length >= 1) {
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
                      while (true) {
                        item = Underscore(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      if (result.length >= 1) {
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
                      while (true) {
                        item = digit(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      if (result.length >= 1) {
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
                    while (true) {
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
                  for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
                    } else {
                      return _mutator(result, o, index, line);
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
        while (true) {
          item = DecimalDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (result.length >= 2) {
            break;
          }
        }
        if (result.length >= 1) {
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
      } else if (radixNum < 2 || radixNum > 36) {
        o.error("Radix must be at least 2 and at most 36, not " + radixNum);
      }
      digits = GetDigits(radixNum);
      integer = digits(clone);
      if (!integer) {
        return false;
      }
      value = parseInt(integer, radixNum);
      if (!isFinite(value)) {
        o.error("Unable to parse number: " + radixNum + "r" + __strnum(integer));
      }
      subClone = clone.clone();
      if (Period(subClone)) {
        decimal = digits(subClone);
        if (decimal) {
          clone.update(subClone);
          while (true) {
            decimalNum = parseInt(decimal, radixNum);
            if (decimalNum !== decimalNum) {
              o.error("Unable to parse number: " + radixNum + "r" + __strnum(integer) + "." + __strnum(decimal));
            } else if (isFinite(decimalNum)) {
              value += decimalNum / Math.pow(radixNum, __num(decimal.length));
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
  }()));
  NumberLiteral = cache(named("NumberLiteral", (function () {
    function _rule(o) {
      return HexNumber(o) || OctalNumber(o) || BinaryNumber(o) || RadixNumber(o) || DecimalNumber(o);
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
  InfinityLiteral = named("InfinityLiteral", makeConstLiteral("Infinity", 1/0));
  NaNLiteral = named("NaNLiteral", makeConstLiteral("NaN", 0/0));
  TrueLiteral = named("TrueLiteral", makeConstLiteral("true", true));
  FalseLiteral = named("FalseLiteral", makeConstLiteral("false", false));
  SimpleConstantLiteral = named("SimpleConstantLiteral", function (o) {
    return NullLiteral(o) || VoidLiteral(o) || InfinityLiteral(o) || NaNLiteral(o) || TrueLiteral(o) || FalseLiteral(o);
  });
  LowerX = cache(named("LowerX", named('"x"', function (o) {
    if (o.data.charCodeAt(o.index) === 120) {
      o.index = __num(o.index) + 1;
      return 120;
    } else {
      o.fail('"x"');
      return false;
    }
  })));
  HexEscapeSequence = named("HexEscapeSequence", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named(
        __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "HexDigit") + "{2}",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          while (true) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (result.length >= 2) {
              break;
            }
          }
          if (result.length >= 2) {
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
            } else {
              return _mutator(result, o, index, line);
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
  }()));
  LowerU = cache(named("LowerU", named('"u"', function (o) {
    if (o.data.charCodeAt(o.index) === 117) {
      o.index = __num(o.index) + 1;
      return 117;
    } else {
      o.fail('"u"');
      return false;
    }
  })));
  UnicodeEscapeSequence = named("UnicodeEscapeSequence", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = named(
        __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "HexDigit") + "{4}",
        function (o) {
          var clone, item, result;
          clone = o.clone();
          result = [];
          while (true) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (result.length >= 4) {
              break;
            }
          }
          if (result.length >= 4) {
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
            } else {
              return _mutator(result, o, index, line);
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
  }()));
  SingleEscapeCharacter = named("SingleEscapeCharacter", (function () {
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
        if (__owns.call(ESCAPED_CHARACTERS, c)) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  BackslashEscapeSequence = named("BackslashEscapeSequence", (function () {
    function _rule(o) {
      return HexEscapeSequence(o) || UnicodeEscapeSequence(o) || SingleEscapeCharacter(o);
    }
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Backslash(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }()));
  Nothing = named("Nothing", function (o) {
    return o.nothing(o.index);
  });
  StringInterpolation = named("StringInterpolation", (function () {
    var _backend;
    _backend = (function () {
      var _rule;
      _rule = (function () {
        var _rule2;
        _rule2 = (function () {
          function _rule3(o) {
            return Expression(o) || Nothing(o);
          }
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (OpenParenthesis(clone) && (result = _rule3(clone)) && CloseParenthesis(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        return function (o) {
          return Identifier(o) || _rule2(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DollarSign(clone) && NoSpace(clone) && (result = _rule(clone))) {
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
  }()));
  SingleStringLiteral = named("SingleStringLiteral", (function () {
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
            while (true) {
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
            } else {
              return _mutator(result, o, index, line);
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
  }()));
  DoubleStringLiteralInner = named("DoubleStringLiteralInner", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          function _rule4(o) {
            return DoubleQuote(o) || Newline(o);
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
    return named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<unknown>") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
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
  }()));
  function doubleStringLiteralHandler(x, o, i) {
    var _arr, _i, _len, currentLiteral, part, stringParts;
    stringParts = [];
    currentLiteral = [];
    for (_arr = __toArray(x), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      part = _arr[_i];
      if (typeof part === "number") {
        currentLiteral.push(part);
      } else if (!(part instanceof NothingNode)) {
        stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
        currentLiteral = [];
        stringParts.push(part);
      }
    }
    if (currentLiteral.length > 0) {
      stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
    }
    return stringParts;
  }
  DoubleStringLiteral = named("DoubleStringLiteral", (function () {
    var _backend;
    _backend = (function () {
      function _rule(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DoubleQuote(clone) && (result = DoubleStringLiteralInner(clone)) && DoubleQuote(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _arr, _arr2, _i, _len, part, stringParts;
        for (_arr = [], _arr2 = __toArray(doubleStringLiteralHandler(x, o, i)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          part = _arr2[_i];
          if (!part.isConst() || part.constValue() !== "") {
            _arr.push(part);
          }
        }
        stringParts = _arr;
        if (stringParts.length === 0) {
          return o["const"](i, "");
        } else if (stringParts.length === 1 && stringParts[0].isConst() && typeof stringParts[0].constValue() === "string") {
          return stringParts[0];
        } else {
          return o.string(i, stringParts);
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
            return _mutator(result, o, index, line);
          }
        }
      );
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
  }()));
  PercentSignDoubleQuote = cache(named("PercentSignDoubleQuote", function (o) {
    var clone;
    clone = o.clone();
    if (PercentSign(clone) && DoubleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  DoubleStringArrayLiteral = named("DoubleStringArrayLiteral", (function () {
    var _backend;
    _backend = (function () {
      function _rule(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (PercentSignDoubleQuote(clone) && (result = DoubleStringLiteralInner(clone)) && DoubleQuote(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var stringParts;
        stringParts = doubleStringLiteralHandler(x, o, i);
        return o.array(i, stringParts);
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!PercentSignDoubleQuote(o.clone())) {
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
  }()));
  StringIndent = named("StringIndent", function (o) {
    var c, clone, count, currentIndent, i;
    clone = o.clone();
    count = 1;
    currentIndent = clone.indent.peek();
    while (count < __num(currentIndent)) {
      c = SpaceChar(clone);
      if (!c) {
        break;
      }
      i = INDENTS[c];
      if (!i) {
        throw Error("Unexpected indent char: " + __str(JSON.stringify(c)));
      }
      count += __num(i);
    }
    if (count > __num(currentIndent)) {
      return o.error("Mixed tabs and spaces in string literal");
    } else if (count < __num(currentIndent) && !Newline(clone.clone())) {
      return false;
    } else {
      o.update(clone);
      return count;
    }
  });
  TripleSingleStringLine = named("TripleSingleStringLine", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  TripleDoubleStringLine = named("TripleDoubleStringLine", (function () {
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
          while (true) {
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
        var _arr, _i, _len, currentLiteral, part, stringParts;
        stringParts = [];
        currentLiteral = [];
        for (_arr = __toArray(x), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          part = _arr[_i];
          if (typeof part === "number") {
            currentLiteral.push(part);
          } else if (!(part instanceof NothingNode)) {
            stringParts.push(processCharCodes(currentLiteral).join(""));
            currentLiteral = [];
            stringParts.push(part);
          }
        }
        if (currentLiteral.length > 0) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  function tripleStringHandler(x, o, i) {
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
    for (j = stringParts.length - 2; j >= 0; --j) {
      if (typeof stringParts[j] === "string" && typeof stringParts[j + 1] === "string") {
        stringParts.splice(j, 2, "" + stringParts[j] + stringParts[j + 1]);
      }
    }
    for (j = 0, _len = stringParts.length; j < _len; ++j) {
      part = stringParts[j];
      if (typeof part === "string") {
        stringParts[j] = o["const"](i, part);
      }
    }
    return stringParts;
  }
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
              while (true) {
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
                      while (true) {
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
                      } else {
                        return _mutator(result, o, index, line);
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
                    return _missing2(void 0, o, index, line);
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
                return _missing(void 0, o, index, line);
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
            var _arr, _arr2, _i, _len, part, stringParts;
            for (_arr = [], _arr2 = __toArray(tripleStringHandler(x, o, i)), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              part = _arr2[_i];
              if (!part.isConst() || part.constValue() !== "") {
                _arr.push(part);
              }
            }
            stringParts = _arr;
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
              } else {
                return _mutator(result, o, index, line);
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
  TripleSingleStringLiteral = named("TripleSingleStringLiteral", makeTripleString(TripleSingleQuote, TripleSingleStringLine));
  TripleDoubleStringLiteral = named("TripleDoubleStringLiteral", makeTripleString(TripleDoubleQuote, TripleDoubleStringLine));
  PercentSignTripleDoubleQuote = cache(named("PercentSignTripleDoubleQuote", function (o) {
    var clone;
    clone = o.clone();
    if (PercentSign(clone) && TripleDoubleQuote(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }));
  TripleDoubleStringArrayLiteral = named("TripleDoubleStringArrayLiteral", (function () {
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
            while (true) {
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
                  if (Newline(clone) && StringIndent(clone) && (result = TripleDoubleStringLine(clone))) {
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
                    while (true) {
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
                  if (StringIndent(clone) && (result.head = TripleDoubleStringLine(clone)) && (result.tail = _rule7(clone))) {
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
                    } else {
                      return _mutator(result, o, index, line);
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
                  return _missing2(void 0, o, index, line);
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
              return _missing(void 0, o, index, line);
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
          if (PercentSignTripleDoubleQuote(clone) && (result.first = TripleDoubleStringLine(clone)) && (result.emptyLines = _rule(clone)) && (result.rest = _rule2(clone)) && TripleDoubleQuote(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x, o, i) {
          var stringParts;
          stringParts = tripleStringHandler(x, o, i);
          return o.array(i, stringParts);
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
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!PercentSignTripleDoubleQuote(o.clone())) {
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
  }()));
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
  RegexFlags = named("RegexFlags", (function () {
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
          return _missing(void 0, o, index, line);
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }()));
  RegexComment = named("RegexComment", (function () {
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
          while (true) {
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
  }()));
  RegexLiteral = named("RegexLiteral", (function () {
    var _rule;
    _rule = (function () {
      var _rule2, _rule3, _rule4, _rule5;
      _rule2 = (function () {
        var _backend;
        _backend = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              var _rule10, _rule11, _rule8, _rule9;
              _rule8 = (function () {
                function _rule12(o) {
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
                  (_rule12 != null ? _rule12.parserName : void 0) || "<unknown>",
                  function (o) {
                    var index, line, result;
                    index = o.index;
                    line = o.line;
                    result = _rule12(o);
                    if (!result) {
                      return false;
                    } else {
                      return 36;
                    }
                  }
                );
              }());
              _rule9 = named(
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
              _rule10 = named(
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
              _rule11 = (function () {
                var _rule12;
                _rule12 = named(
                  "!" + __strnum((TripleDoubleQuote != null ? TripleDoubleQuote.parserName : void 0) || "TripleDoubleQuote"),
                  function (o) {
                    return !TripleDoubleQuote(o.clone());
                  }
                );
                return function (o) {
                  var clone, result;
                  clone = o.clone();
                  result = void 0;
                  if (_rule12(clone) && (result = AnyChar(clone))) {
                    o.update(clone);
                    return result;
                  } else {
                    return false;
                  }
                };
              }());
              return function (o) {
                return _rule8(o) || _rule9(o) || _rule10(o) || RegexComment(o) || StringInterpolation(o) || _rule11(o);
              };
            }());
            return named(
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
              function (o) {
                var clone, item, result;
                clone = o.clone();
                result = [];
                while (true) {
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
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if (RegexTripleDoubleToken(clone) && (result.text = _rule6(clone)) && TripleDoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
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
          var _rule6;
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              var _rule10, _rule8, _rule9;
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
                  "!" + __strnum((TripleSingleQuote != null ? TripleSingleQuote.parserName : void 0) || "TripleSingleQuote"),
                  function (o) {
                    return !TripleSingleQuote(o.clone());
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
                return _rule8(o) || _rule9(o) || RegexComment(o) || _rule10(o);
              };
            }());
            return named(
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
              function (o) {
                var clone, item, result;
                clone = o.clone();
                result = [];
                while (true) {
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
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if (RegexTripleSingleToken(clone) && (result.text = _rule6(clone)) && TripleSingleQuote(clone) && (result.flags = RegexFlags(clone))) {
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
            if (!RegexTripleSingleToken(o.clone())) {
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
          var _rule6;
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              var _rule10, _rule8, _rule9;
              _rule8 = (function () {
                function _rule11(o) {
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
                  (_rule11 != null ? _rule11.parserName : void 0) || "<unknown>",
                  function (o) {
                    var index, line, result;
                    index = o.index;
                    line = o.line;
                    result = _rule11(o);
                    if (!result) {
                      return false;
                    } else {
                      return 34;
                    }
                  }
                );
              }());
              _rule9 = (function () {
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
              _rule10 = (function () {
                var _rule11;
                _rule11 = (function () {
                  function _rule12(o) {
                    return DoubleQuote(o) || Newline(o) || DollarSign(o);
                  }
                  return named(
                    "!" + __strnum((_rule12 != null ? _rule12.parserName : void 0) || "<unknown>"),
                    function (o) {
                      return !_rule12(o.clone());
                    }
                  );
                }());
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
                return _rule8(o) || _rule9(o) || _rule10(o) || StringInterpolation(o);
              };
            }());
            return named(
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
              function (o) {
                var clone, item, result;
                clone = o.clone();
                result = [];
                while (true) {
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
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if (RegexDoubleToken(clone) && (result.text = _rule6(clone)) && DoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
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
      _rule5 = (function () {
        var _backend;
        _backend = (function () {
          var _rule6;
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              var _rule8, _rule9;
              _rule8 = (function () {
                function _rule10(o) {
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
                  (_rule10 != null ? _rule10.parserName : void 0) || "<unknown>",
                  function (o) {
                    var index, line, result;
                    index = o.index;
                    line = o.line;
                    result = _rule10(o);
                    if (!result) {
                      return false;
                    } else {
                      return 39;
                    }
                  }
                );
              }());
              _rule9 = (function () {
                var _rule10;
                _rule10 = (function () {
                  function _rule11(o) {
                    return SingleQuote(o) || Newline(o);
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
                return _rule8(o) || _rule9(o);
              };
            }());
            return named(
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<unknown>") + "*",
              function (o) {
                var clone, item, result;
                clone = o.clone();
                result = [];
                while (true) {
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
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if (RegexSingleToken(clone) && (result.text = _rule6(clone)) && SingleQuote(clone) && (result.flags = RegexFlags(clone))) {
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
        function _rule6(o) {
          return _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o);
        }
        function _mutator(x, o, i) {
          var _arr, _i, _len, currentLiteral, flags, part, stringParts, text;
          stringParts = [];
          currentLiteral = [];
          for (_arr = __toArray(x.text), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            part = _arr[_i];
            if (typeof part === "number") {
              currentLiteral.push(part);
            } else if (part !== NOTHING && !(part instanceof NothingNode)) {
              if (currentLiteral.length > 0) {
                stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
                currentLiteral = [];
              }
              stringParts.push(part);
            }
          }
          if (currentLiteral.length > 0) {
            stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
          }
          flags = processCharCodes(x.flags).join("");
          if (stringParts.length === 0) {
            text = o["const"](i, "");
          } else if (stringParts.length === 1 && stringParts[0].isConst() && typeof stringParts[0].constValue() === "string") {
            text = stringParts[0];
          } else {
            text = o.string(i, stringParts);
          }
          return o.regexp(i, text, flags);
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
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
  }()));
  BackslashStringLiteral = named("BackslashStringLiteral", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Backslash(clone) && NoSpace(clone) && (result = IdentifierNameConst(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  StringLiteral = cache(named("StringLiteral", (function () {
    function _rule(o) {
      return BackslashStringLiteral(o) || TripleSingleStringLiteral(o) || TripleDoubleStringLiteral(o) || TripleDoubleStringArrayLiteral(o) || SingleStringLiteral(o) || DoubleStringLiteral(o) || DoubleStringArrayLiteral(o);
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
    return SimpleConstantLiteral(o) || NumberLiteral(o) || StringLiteral(o) || RegexLiteral(o);
  }));
  ArgumentsLiteral = cache(named("ArgumentsLiteral", word("arguments", function (x, o, i) {
    return o.args(i);
  })));
  Literal = named("Literal", function (o) {
    return ThisOrShorthandLiteral(o) || ArgumentsLiteral(o) || ConstantLiteral(o);
  });
  IdentifierNameConst = named("IdentifierNameConst", function (o) {
    var index, result;
    index = o.index;
    result = Name(o);
    if (result) {
      return o["const"](index, result);
    } else {
      return false;
    }
  });
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
  MaybeNotToken = cache(named("MaybeNotToken", (function () {
    var _rule;
    _rule = word("not");
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
  MaybeExistentialSymbolNoSpace = cache(named("MaybeExistentialSymbolNoSpace", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = named('"?"', function (o) {
        if (o.data.charCodeAt(o.index) === 63) {
          o.index = __num(o.index) + 1;
          return 63;
        } else {
          o.fail('"?"');
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
              return "?";
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
  CustomOperatorCloseParenthesis = named("CustomOperatorCloseParenthesis", (function () {
    function handleUnaryOperator(operator, o, i, line) {
      var clone, node, op;
      clone = o.clone(o.cloneScope());
      op = operator.rule(clone);
      if (op && CloseParenthesis(clone)) {
        o.update(clone);
        node = clone.ident(i, "x");
        clone.scope.add(node, false, Type.any);
        return o["function"](
          i,
          [clone.param(i, node)],
          operator.func(
            { op: op, node: node },
            clone,
            i,
            line
          ),
          true,
          false
        );
      }
    }
    return function (o) {
      var _arr, _arr2, _i, _i2, _len, _ref, clone, i, inverted, left, line, op, operator, operators, result, right;
      i = o.index;
      line = o.line;
      for (_arr = __toArray(o.macros.binaryOperators), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        operators = _arr[_i];
        if (operators) {
          for (_arr2 = __toArray(operators), _i2 = _arr2.length; _i2--; ) {
            operator = _arr2[_i2];
            clone = o.clone(o.cloneScope());
            inverted = false;
            if (operator.invertible) {
              inverted = MaybeNotToken(clone);
              if (!inverted) {
                continue;
              }
            }
            op = operator.rule(clone);
            if (op && CloseParenthesis(clone)) {
              left = o.ident(i, "x");
              right = o.ident(i, "y");
              clone.scope.add(left, false, Type.any);
              clone.scope.add(right, false, Type.any);
              result = o["function"](
                i,
                [
                  clone.param(i, left),
                  clone.param(i, right)
                ],
                operator.func(
                  { left: left, inverted: inverted === "not", op: op, right: right },
                  clone,
                  i,
                  line
                ),
                true,
                false
              );
              o.update(clone);
              return result;
            }
          }
        }
      }
      for (_arr = __toArray(o.macros.prefixUnaryOperators), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, o, i, line)) != null) {
          return _ref;
        }
      }
      for (_arr = __toArray(o.macros.postfixUnaryOperators), _i = _arr.length; _i--; ) {
        operator = _arr[_i];
        if ((_ref = handleUnaryOperator(operator, o, i, line)) != null) {
          return _ref;
        }
      }
      return false;
    };
  }()));
  CustomBinaryOperator = named("CustomBinaryOperator", function (o) {
    var _arr, _arr2, _i, _i2, _len, clone, i, inverted, op, operator, operators;
    i = o.index;
    for (_arr = __toArray(o.macros.binaryOperators), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      operators = _arr[_i];
      if (operators) {
        for (_arr2 = __toArray(operators), _i2 = _arr2.length; _i2--; ) {
          operator = _arr2[_i2];
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
  });
  Parenthetical = named("Parenthetical", (function () {
    var _rule;
    _rule = (function () {
      var _rule3, _rule4, _rule5;
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
        var _rule6;
        _rule6 = named(
          __strnum((CustomBinaryOperator != null ? CustomBinaryOperator.parserName : void 0) || "CustomBinaryOperator") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = CustomBinaryOperator(clone);
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
          function _rule7(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.left = Expression(clone)) && (result.operator = _rule6(clone)) && CloseParenthesis(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(_p, o, i, line) {
            var clone, left, operator, right;
            left = _p.left;
            operator = _p.operator;
            if (operator === NOTHING) {
              return left;
            } else {
              clone = o.clone(o.cloneScope());
              right = o.tmp(i, getTmpId(), "x");
              clone.scope.add(right, false, Type.any);
              return o["function"](
                i,
                [clone.param(i, right)],
                operator.operator.func(
                  {
                    left: left.rescope(clone.scope.id, clone),
                    inverted: operator.inverted,
                    op: operator.op,
                    right: right
                  },
                  clone,
                  i,
                  line
                ),
                true,
                false
              );
            }
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
              } else {
                return _mutator(result, o, index, line);
              }
            }
          );
        }());
      }());
      _rule4 = (function () {
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
          var _p2, clone, inverted, left, op, operator, right;
          right = _p.right;
          _p2 = _p.operator;
          op = _p2.op;
          operator = _p2.operator;
          inverted = _p2.inverted;
          clone = o.clone(o.cloneScope());
          left = o.tmp(i, getTmpId(), "x");
          clone.scope.add(left, false, Type.any);
          return o["function"](
            i,
            [clone.param(i, left)],
            operator.func(
              {
                left: left,
                inverted: inverted,
                op: op,
                right: right.rescope(clone.scope.id, clone)
              },
              clone,
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
      _rule5 = (function () {
        var _rule6;
        _rule6 = named(
          __strnum((typeof InvocationOrAccessPart !== "undefined" && InvocationOrAccessPart !== null ? InvocationOrAccessPart.parserName : void 0) || "InvocationOrAccessPart") + "+",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            while (true) {
              item = InvocationOrAccessPart(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            if (result.length >= 1) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
        );
        return (function () {
          function _rule7(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if ((result = _rule6(clone)) && CloseParenthesis(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x, o, i) {
            var clone, left;
            clone = o.clone(o.cloneScope());
            left = o.tmp(i, getTmpId(), "x");
            clone.scope.add(left, false, Type.any);
            return o["function"](
              i,
              [clone.param(i, left)],
              convertInvocationOrAccess(
                false,
                { type: "normal", existential: false, node: left },
                x,
                o,
                i
              ).rescope(clone.scope.id, clone),
              true,
              false
            );
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
              } else {
                return _mutator(result, o, index, line);
              }
            }
          );
        }());
      }());
      return function (o) {
        return _rule2(o) || _rule3(o) || CustomOperatorCloseParenthesis(o) || _rule4(o) || _rule5(o);
      };
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenParenthesis(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }()));
  MaybeSpreadToken = named("MaybeSpreadToken", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
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
        (_rule2 != null ? _rule2.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule2(o);
          if (!result) {
            return false;
          } else {
            return "...";
          }
        }
      );
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
  }()));
  SpreadOrExpression = named("SpreadOrExpression", (function () {
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
        return o.spread(i, x.node.doWrap(o));
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
        } else {
          return _mutator(result, o, index, line);
        }
      }
    );
  }()));
  ArrayLiteral = named("ArrayLiteral", preventUnclosedObjectLiteral((function () {
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
              while (true) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
                  while (true) {
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
                  } else {
                    return _mutator(result, o, index, line);
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
                return _missing2(void 0, o, index, line);
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
            return _missing(void 0, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  BracketedObjectKey = named("BracketedObjectKey", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (OpenSquareBracket(clone) && (result = ExpressionOrAssignment(clone)) && CloseSquareBracket(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  ConstObjectKey = named("ConstObjectKey", (function () {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
    return function (o) {
      return StringLiteral(o) || _rule(o) || IdentifierNameConst(o);
    };
  }()));
  ObjectKey = cache(named("ObjectKey", function (o) {
    return BracketedObjectKey(o) || ConstObjectKey(o);
  }));
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
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = named('"="', function (o) {
          if (o.data.charCodeAt(o.index) === 61) {
            o.index = __num(o.index) + 1;
            return 61;
          } else {
            o.fail('"="');
            return false;
          }
        });
        return named(
          "!" + __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>"),
          function (o) {
            return !_rule3(o.clone());
          }
        );
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = ObjectKey(clone)) && Colon(clone) && _rule2(clone)) {
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
        o.fail('key ":"');
        return false;
      }
    };
  }())));
  DualObjectKey = named("DualObjectKey", (function () {
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
  }()));
  PropertyObjectKeyColon = cache(named("PropertyObjectKeyColon", (function () {
    var _rule;
    _rule = (function () {
      var _rule2, _rule3, _rule4;
      _rule2 = word("property");
      _rule3 = word("get");
      _rule4 = word("set");
      return function (o) {
        return _rule2(o) || _rule3(o) || _rule4(o);
      };
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.property = _rule(clone)) && Space(clone) && (result.key = ObjectKeyColon(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }())));
  PropertyDualObjectKey = named("PropertyDualObjectKey", (function () {
    var _backend;
    _backend = (function () {
      function _rule(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.propertyKey = PropertyObjectKeyColon(clone)) && (result.value = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        return { key: x.propertyKey.key, value: x.value, property: x.propertyKey.property };
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
    return named(
      (_backend != null ? _backend.parserName : void 0) || "<unknown>",
      function (o) {
        var result;
        if (!PropertyObjectKeyColon(o.clone())) {
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
  }()));
  PropertyOrDualObjectKey = named("PropertyOrDualObjectKey", function (o) {
    return PropertyDualObjectKey(o) || DualObjectKey(o);
  });
  IdentifierOrSimpleAccessStart = named("IdentifierOrSimpleAccessStart", (function () {
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
          } else {
            return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return Identifier(o) || _rule(o) || _rule2(o) || _rule3(o);
    };
  }()));
  IdentifierOrSimpleAccessPart = named("IdentifierOrSimpleAccessPart", (function () {
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
            } else {
              return _mutator(result, o, index, line);
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }()));
  IdentifierOrSimpleAccess = cache(named("IdentifierOrSimpleAccess", (function () {
    var _rule;
    _rule = named(
      __strnum((IdentifierOrSimpleAccessPart != null ? IdentifierOrSimpleAccessPart.parserName : void 0) || "IdentifierOrSimpleAccessPart") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
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
        for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  SingularObjectKey = named("SingularObjectKey", (function () {
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
        if (ident instanceof AccessNode) {
          key = ident.child;
        } else if (ident instanceof IdentNode) {
          key = o["const"](i, ident.name);
        } else {
          key = o.error("Unknown ident type: " + __typeof(ident));
        }
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
          } else {
            return _mutator(result, o, index, line);
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
        if (node.isConst() && typeof node.constValue()) {
          key = o["const"](i, String(node.constValue()));
        } else {
          key = node;
        }
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
          } else {
            return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
    return function (o) {
      return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o);
    };
  }()));
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
              value: o["const"](i, x.bool === 43),
              property: x.pair.property
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return PropertyOrDualObjectKey(o) || _rule(o);
    };
  }())));
  ObjectLiteral = named("ObjectLiteral", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5, _rule6, _rule7;
        _rule5 = word("extends");
        _rule6 = preventUnclosedObjectLiteral(function (o) {
          return Logic(o);
        });
        _rule7 = (function () {
          function _rule8(o) {
            return Newline(o.clone());
          }
          function _rule9(o) {
            return CloseCurlyBrace(o.clone());
          }
          return function (o) {
            return Comma(o) || _rule8(o) || _rule9(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule5(clone) && (result = _rule6(clone)) && Space(clone) && _rule7(clone)) {
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
              while (true) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
                  while (true) {
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
                  } else {
                    return _mutator(result, o, index, line);
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
                return _missing2(void 0, o, index, line);
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
            return _missing(void 0, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  Body = named("Body", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && Newline(clone) && EmptyLines(clone) && Advance(clone) && (result = Block(clone)) && PopIndent(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  DedentedBody = named("DedentedBody", (function () {
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
  }()));
  DeclareEqualSymbol = named("DeclareEqualSymbol", (function () {
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
  }()));
  ArrayType = cache(named("ArrayType", (function () {
    var _rule;
    _rule = named(
      __strnum((typeof TypeReference !== "undefined" && TypeReference !== null ? TypeReference.parserName : void 0) || "TypeReference") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = TypeReference(clone);
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
        result = void 0;
        if (OpenSquareBracket(clone) && (result = _rule(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        if (x === NOTHING) {
          return o.ident(i, "Array");
        } else {
          return o.typeArray(i, x);
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  ObjectTypePair = named("ObjectTypePair", function (o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.key = ConstObjectKey(clone)) && Colon(clone) && (result.value = TypeReference(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  ObjectType = cache(named("ObjectType", (function () {
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
            if (CommaOrNewline(clone) && (result = ObjectTypePair(clone))) {
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
              while (true) {
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
            if ((result.head = ObjectTypePair(clone)) && (result.tail = _rule3(clone)) && MaybeComma(clone)) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
        if (OpenCurlyBrace(clone) && (result = _rule(clone)) && CloseCurlyBrace(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var _arr, _i, _len, key, keys, keyValue;
        if (x.length === 0) {
          return o.ident(i, "Object");
        } else {
          keys = [];
          for (_arr = __toArray(x), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            key = _arr[_i].key;
            if (!(key instanceof ConstNode)) {
              o.error("Expected a constant key, got " + __typeof(key));
            } else {
              keyValue = String(key.value);
              if (__in(keyValue, keys)) {
                o.error("Duplicate object key: " + keyValue);
              }
              keys.push(keyValue);
            }
          }
          return o.typeObject(i, x);
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  _inFunctionTypeParams = Stack(false);
  inFunctionTypeParams = makeAlterStack(_inFunctionTypeParams, true);
  notInFunctionTypeParams = makeAlterStack(_inFunctionTypeParams, false);
  FunctionType = cache(named("FunctionType", (function () {
    var _rule2, _rule3, _rule4;
    function _rule(o) {
      return !_inFunctionTypeParams.peek();
    }
    _rule2 = (function () {
      var _rule5, _rule6;
      _rule5 = (function () {
        var _rule7;
        _rule7 = (function () {
          function _rule8(o) {
            var clone;
            clone = o.clone();
            if (CommaOrNewline(clone) && TypeReference(clone)) {
              o.update(clone);
              return true;
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
              while (true) {
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
        return function (o) {
          var clone;
          clone = o.clone();
          if (OpenParenthesis(clone) && TypeReference(clone) && _rule7(clone) && CloseParenthesis(clone)) {
            o.update(clone);
            return true;
          } else {
            return false;
          }
        };
      }());
      _rule6 = inFunctionTypeParams(function (o) {
        return TypeReference(o);
      });
      return function (o) {
        return _rule5(o) || _rule6(o) || Nothing(o);
      };
    }());
    _rule3 = symbol("->");
    _rule4 = named(
      __strnum((typeof TypeReference !== "undefined" && TypeReference !== null ? TypeReference.parserName : void 0) || "TypeReference") + "?",
      function (o) {
        var clone, index, line, result;
        index = o.index;
        line = o.line;
        clone = o.clone();
        result = TypeReference(clone);
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
        result = void 0;
        if (_rule(clone) && _rule2(clone) && _rule3(clone) && (result = _rule4(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        if (x === NOTHING) {
          return o.ident(i, "Function");
        } else {
          return o.typeFunction(i, x);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  NonUnionType = cache(named("NonUnionType", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = notInFunctionTypeParams(function (o) {
        return TypeReference(o);
      });
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (OpenParenthesis(clone) && (result = _rule2(clone)) && CloseParenthesis(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return FunctionType(o) || _rule(o) || ArrayType(o) || ObjectType(o) || IdentifierOrSimpleAccess(o) || VoidLiteral(o) || NullLiteral(o);
    };
  }())));
  TypeReference = cache(named("TypeReference", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Pipe(clone) && (result = NonUnionType(clone))) {
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
          while (true) {
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
        if ((result.head = NonUnionType(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var j, type, types;
        types = [x.head].concat(__toArray(x.tail));
        if (types.length === 1) {
          return types[0];
        } else {
          for (j = types.length; j--; ) {
            type = types[j];
            if (type instanceof TypeUnionNode) {
              types.splice.apply(types, [j, 1].concat(__toArray(type.types)));
            }
          }
          if (types.length === 1) {
            return types[0];
          } else {
            return o.typeUnion(i, types);
          }
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  AsToken = cache(named("AsToken", word("as")));
  MaybeAsType = named("MaybeAsType", (function () {
    var _rule;
    _rule = (function () {
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
  }()));
  IdentifierParameter = named("IdentifierParameter", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = word("mutable");
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
    _rule2 = named(
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
    _rule3 = (function () {
      function _rule4(o) {
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
        if ((result.isMutable = _rule(clone)) && (result.spread = MaybeSpreadToken(clone)) && (result.parent = _rule2(clone)) && (result.ident = Identifier(clone)) && (result.asType = MaybeAsType(clone)) && (result.defaultValue = _rule3(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        var name;
        if (x.parent !== NOTHING) {
          name = o.access(i, x.parent, o["const"](i, x.ident.name));
        } else {
          name = x.ident;
        }
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
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  Parameter = named("Parameter", function (o) {
    return IdentifierParameter(o) || ArrayParameter(o) || ObjectParameter(o);
  });
  function validateSpreadParameters(params, o) {
    var _arr, _i, param, spreadCount;
    spreadCount = 0;
    for (_arr = __toArray(params), _i = _arr.length; _i--; ) {
      param = _arr[_i];
      if (param instanceof ParamNode && param.spread) {
        ++spreadCount;
        if (spreadCount > 1) {
          o.error("Cannot have more than one spread parameter");
        }
      }
    }
    return params;
  }
  ArrayParameter = named("ArrayParameter", (function () {
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
              while (true) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  ParamDualObjectKey = named("ParamDualObjectKey", function (o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.key = ObjectKeyColon(clone)) && (result.value = Parameter(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  ParamSingularObjectKey = named("ParamSingularObjectKey", (function () {
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
      if (ident instanceof IdentNode) {
        key = o["const"](i, ident.name);
      } else if (ident instanceof AccessNode) {
        key = ident.child;
      } else {
        throw Error("Unknown object key type: " + __typeof(ident));
      }
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
        } else {
          return _mutator(result, o, index, line);
        }
      }
    );
  }()));
  KvpParameter = named("KvpParameter", function (o) {
    return ParamDualObjectKey(o) || ParamSingularObjectKey(o);
  });
  ObjectParameter = named("ObjectParameter", (function () {
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
              while (true) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  Parameters = named("Parameters", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  ParameterSequence = named("ParameterSequence", (function () {
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
            return _missing(void 0, o, index, line);
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
        function check(names, duplicates, param) {
          var _arr, _i, element, name, pair;
          if (param instanceof ParamNode) {
            if (param.ident instanceof IdentNode) {
              name = param.ident.name;
            } else if (param.ident instanceof AccessNode) {
              if (!(param.ident.child instanceof ConstNode) || typeof param.ident.child.value !== "string") {
                throw Error("Expected constant access: " + __typeof(param.ident.child));
              }
              name = param.ident.child.value;
            } else {
              throw Error("Unknown param ident: " + __typeof(param.ident));
            }
            if (__in(name, names)) {
              if (!__in(name, duplicates)) {
                duplicates.push(name);
              }
            } else {
              names.push(name);
            }
          } else if (param instanceof ArrayNode) {
            for (_arr = __toArray(param.elements), _i = _arr.length; _i--; ) {
              element = _arr[_i];
              check(names, duplicates, element);
            }
          } else if (param instanceof ObjectNode) {
            for (_arr = __toArray(param.pairs), _i = _arr.length; _i--; ) {
              pair = _arr[_i];
              check(names, duplicates, pair.value);
            }
          } else {
            throw Error("Unknown param node: " + __typeof(param));
          }
        }
        return function (x, o, i) {
          var _arr, _i, duplicates, names, param;
          names = [];
          duplicates = [];
          for (_arr = __toArray(x), _i = _arr.length; _i--; ) {
            param = _arr[_i];
            check(names, duplicates, param);
          }
          if (duplicates.length) {
            o.error("Duplicate parameter name: " + __strnum(duplicates.sort().join(", ")));
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  function addParamToScope(o, param) {
    var _arr, _i, _ref, element, pair;
    if (param instanceof ParamNode) {
      if ((_ref = param.ident) instanceof IdentNode || _ref instanceof TmpNode) {
        o.scope.add(param.ident, param.isMutable, param.asType ? nodeToType(param.asType) : param.spread ? Type.array : Type.any);
      } else if (param.ident instanceof AccessNode) {
        if (!(param.ident.child instanceof ConstNode) || typeof param.ident.child.value !== "string") {
          throw Error("Expected constant access: " + __typeof(param.ident.child));
        }
        o.scope.add(
          o.ident(param.startIndex, param.ident.child.value),
          param.isMutable,
          param.asType ? nodeToType(param.asType) : param.spread ? Type.array : Type.any
        );
      } else {
        throw Error("Unknown param ident: " + __typeof(param.ident));
      }
    } else if (param instanceof ArrayNode) {
      for (_arr = __toArray(param.elements), _i = _arr.length; _i--; ) {
        element = _arr[_i];
        addParamToScope(o, element);
      }
    } else if (param instanceof ObjectNode) {
      for (_arr = __toArray(param.pairs), _i = _arr.length; _i--; ) {
        pair = _arr[_i];
        addParamToScope(o, pair.value);
      }
    } else {
      throw Error("Unknown param node type: " + __typeof(param));
    }
  }
  _inGenerator = Stack(false);
  _FunctionBody = named("_FunctionBody", (function () {
    var _rule;
    _rule = (function () {
      var _rule2, _rule3;
      _rule2 = symbol("->");
      _rule3 = (function () {
        function _missing(x, o, i) {
          return o.nothing(i);
        }
        return named(
          __strnum((typeof Statement !== "undefined" && Statement !== null ? Statement.parserName : void 0) || "Statement") + "?",
          function (o) {
            var clone, index, line, result;
            index = o.index;
            line = o.line;
            clone = o.clone();
            result = Statement(clone);
            if (!result) {
              return _missing(void 0, o, index, line);
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
  }()));
  FunctionBody = named("FunctionBody", makeAlterStack(_inGenerator, false)(_FunctionBody));
  GeneratorFunctionBody = named("GeneratorFunctionBody", makeAlterStack(_inGenerator, true)(_FunctionBody));
  FunctionDeclaration = named("FunctionDeclaration", (function () {
    var paramsRule, restRule;
    paramsRule = (function () {
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
            return _missing(void 0, o, index, line);
          } else {
            o.update(clone);
            return result;
          }
        }
      );
    }());
    restRule = (function () {
      var _rule, _rule2, _rule3;
      _rule = inFunctionTypeParams(MaybeAsType);
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
        if (generator) {
          body = GeneratorFunctionBody(o);
        } else {
          body = FunctionBody(o);
        }
        return body && { generator: generator, body: body };
      }
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.asType = _rule(clone)) && (result.autoReturn = _rule2(clone)) && (result.bound = _rule3(clone)) && (result.generatorBody = _rule4(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      var _arr, _i, _ref, asType, autoReturn, body, bound, clone, generator, index, param, params, rest;
      index = o.index;
      clone = o.clone(o.cloneScope());
      params = paramsRule(clone);
      if (!params) {
        return false;
      }
      for (_arr = __toArray(params), _i = _arr.length; _i--; ) {
        param = _arr[_i];
        addParamToScope(clone, param);
      }
      rest = restRule(clone);
      if (!rest) {
        return false;
      }
      asType = rest.asType;
      autoReturn = rest.autoReturn;
      bound = rest.bound;
      generator = (_ref = rest.generatorBody).generator;
      body = _ref.body;
      if (autoReturn !== NOTHING && generator) {
        o.error("A function cannot be both non-returning and a generator");
      }
      o.update(clone);
      return o["function"](
        index,
        params,
        body,
        autoReturn === NOTHING,
        bound !== NOTHING,
        asType !== NOTHING ? asType : void 0,
        generator
      );
    };
  }()));
  FunctionLiteral = named("FunctionLiteral", (function () {
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
  }()));
  AssignmentAsExpression = cache(named("AssignmentAsExpression", inExpression(function (o) {
    return Assignment(o);
  })));
  ExpressionOrAssignment = named("ExpressionOrAssignment", function (o) {
    return AssignmentAsExpression(o) || Expression(o);
  });
  AstExpressionToken = cache(named("AstExpressionToken", word("ASTE")));
  AstExpression = named("AstExpression", (function () {
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
  }()));
  AstToken = cache(named("AstToken", word("AST")));
  AstStatement = named("AstStatement", (function () {
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
      _rule2 = inAst(function (o) {
        return Body(o) || Statement(o) || Nothing(o);
      });
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
  }()));
  Ast = named("Ast", (function () {
    function _rule(o) {
      return AstExpression(o) || AstStatement(o);
    }
    function _mutator(x, o, i) {
      return MacroHelper.constifyObject(x, i, o.index, o.scope.id);
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
          return _mutator(result, o, index, line);
        }
      }
    );
  }()));
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
                while (true) {
                  item = _rule4(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                if (result.length >= 1) {
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
                } else {
                  return _mutator(result, o, index, line);
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
  MacroNames = named("MacroNames", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  UseMacro = named("UseMacro", function (o) {
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
  });
  MacroSyntaxParameterType = named("MacroSyntaxParameterType", (function () {
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
            } else {
              return _mutator(result, o, index, line);
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
            } else {
              return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  MacroSyntaxParameter = named("MacroSyntaxParameter", (function () {
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return StringLiteral(o) || _rule(o);
    };
  }()));
  MacroSyntaxParameters = named("MacroSyntaxParameters", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  MacroSyntaxChoiceParameters = named("MacroSyntaxChoiceParameters", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  MacroOptions = named("MacroOptions", (function () {
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
          for (_arr = __toArray(x.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
            } else {
              return _mutator(result, o, index, line);
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
          return _missing(void 0, o, index, line);
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }()));
  SyntaxToken = cache(named("SyntaxToken", word("syntax")));
  MacroSyntax = named("MacroSyntax", (function () {
    var _rule;
    _rule = (function () {
      var _backend;
      _backend = (function () {
        function _rule2(o) {
          var body, clone, i, options, params;
          i = o.index;
          clone = o.clone(o.cloneScope());
          params = MacroSyntaxParameters(clone);
          if (!params) {
            throw SHORT_CIRCUIT;
          }
          options = MacroOptions(clone);
          clone.startMacroSyntax(i, params, options);
          body = FunctionBody(clone);
          if (!body) {
            throw SHORT_CIRCUIT;
          }
          clone.macroSyntax(
            i,
            "syntax",
            params,
            options,
            body
          );
          o.update(clone);
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
  }()));
  MacroBody = named("MacroBody", (function () {
    var _rule;
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
              while (true) {
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    function _rule2(o) {
      var _arr, _i, body, clone, i, options, param, params;
      i = o.index;
      clone = o.clone(o.cloneScope());
      params = ParameterSequence(clone);
      if (!params) {
        return false;
      }
      for (_arr = __toArray(params), _i = _arr.length; _i--; ) {
        param = _arr[_i];
        addParamToScope(clone, param);
      }
      options = MacroOptions(clone);
      body = FunctionBody(clone);
      if (!body) {
        return false;
      }
      clone.macroSyntax(
        i,
        "call",
        params,
        options,
        body
      );
      o.update(clone);
      return true;
    }
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }()));
  MacroToken = cache(named("MacroToken", word("macro")));
  DefineMacro = named("DefineMacro", inMacro((function () {
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
            } else {
              return _mutator(result, o, index, line);
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
  }())));
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
  DefineSyntax = named("DefineSyntax", (function () {
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
            } else {
              return _mutator(result, o, index, line);
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
  }()));
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
  DefineHelper = named("DefineHelper", (function () {
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
          } else {
            return _mutator(result, o, index, line);
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
  }()));
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
  DefineOperator = named("DefineOperator", (function () {
    var _backend;
    _backend = inMacro((function () {
      var mainRule, nodeType;
      mainRule = (function () {
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
              while (true) {
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
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (DefineOperatorStart(clone) && (result.type = _rule(clone)) && (result.head = NameOrSymbol(clone)) && (result.tail = _rule2(clone)) && (result.options = MacroOptions(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      nodeType = Type.object.union(Type["undefined"]);
      return function (o) {
        var body, clone, i, ops, ret, x;
        i = o.index;
        x = mainRule(o);
        if (!x) {
          throw SHORT_CIRCUIT;
        }
        clone = o.clone(o.cloneScope());
        switch (x.type) {
        case "binary":
        case "assign":
          clone.scope.add(
            clone.ident(i, "left"),
            true,
            nodeType
          );
          clone.scope.add(
            clone.ident(i, "op"),
            true,
            Type.string
          );
          clone.scope.add(
            clone.ident(i, "right"),
            true,
            nodeType
          );
          break;
        case "unary":
          clone.scope.add(
            clone.ident(i, "op"),
            true,
            Type.string
          );
          clone.scope.add(
            clone.ident(i, "node"),
            true,
            nodeType
          );
          break;
        }
        body = FunctionBody(clone);
        if (!body) {
          throw SHORT_CIRCUIT;
        }
        ops = [x.head].concat(__toArray(x.tail));
        switch (x.type) {
        case "binary":
          ret = clone.defineBinaryOperator(i, ops, x.options, body);
          break;
        case "assign":
          ret = clone.defineAssignOperator(i, ops, x.options, body);
          break;
        case "unary":
          ret = clone.defineUnaryOperator(i, ops, x.options, body);
          break;
        default: throw Error();
        }
        o.update(clone);
        return ret;
      };
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
  }()));
  Index = cache(named("Index", (function () {
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
          while (true) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  IdentifierOrAccessStart = named("IdentifierOrAccessStart", (function () {
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
          } else {
            return _mutator(result, o, index, line);
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
          } else {
            return _mutator(result, o, index, line);
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
          } else if (x.child.type === "multi") {
            return o.accessMulti(i, parent, x.child.elements);
          } else {
            throw Error();
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return Identifier(o) || _rule(o) || _rule2(o) || _rule3(o);
    };
  }()));
  IdentifierOrAccessPart = named("IdentifierOrAccessPart", (function () {
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
            } else {
              return _mutator(result, o, index, line);
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
            } else if (x.child.type === "multi") {
              return o.accessMulti(i, parent, x.child.elements);
            } else {
              throw Error();
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return _rule(o) || _rule2(o);
    };
  }()));
  IdentifierOrAccess = cache(named("IdentifierOrAccess", (function () {
    var _rule;
    _rule = named(
      __strnum((IdentifierOrAccessPart != null ? IdentifierOrAccessPart.parserName : void 0) || "IdentifierOrAccessPart") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
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
        for (_arr = __toArray(x.tail), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }())));
  SimpleAssignable = named("SimpleAssignable", IdentifierOrAccess);
  ComplexAssignable = named("ComplexAssignable", SimpleAssignable);
  DirectAssignment = named("DirectAssignment", (function () {
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
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.left = ComplexAssignable(clone)) && Space(clone) && ColonChar(clone) && _rule(clone) && (result.right = ExpressionOrAssignment(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.assign(i, x.left, "=", x.right.doWrap(o));
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  CustomAssignment = named("CustomAssignment", function (o) {
    var _arr, _i, clone, left, line, op, operator, right, rule, startIndex, subClone;
    startIndex = o.index;
    line = o.line;
    clone = o.clone();
    left = SimpleAssignable(clone);
    if (left) {
      for (_arr = __toArray(o.macros.assignOperators), _i = _arr.length; _i--; ) {
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
  });
  Assignment = cache(named("Assignment", function (o) {
    return DirectAssignment(o) || CustomAssignment(o);
  }));
  UnclosedObjectLiteral = named("UnclosedObjectLiteral", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Comma(clone) && (result = PropertyOrDualObjectKey(clone))) {
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
          while (true) {
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
        if ((result.head = PropertyOrDualObjectKey(clone)) && (result.tail = _rule(clone))) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  IndentedUnclosedObjectLiteralInner = named("IndentedUnclosedObjectLiteralInner", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (CommaOrNewlineWithCheckIndent(clone) && (result = PropertyOrDualObjectKey(clone))) {
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
          while (true) {
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
        if ((result.head = PropertyOrDualObjectKey(clone)) && (result.tail = _rule(clone))) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  IndentedUnclosedObjectLiteral = named("IndentedUnclosedObjectLiteral", (function () {
    function _rule(o) {
      return !_preventUnclosedObjectLiteral.peek();
    }
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (_rule(clone) && Space(clone) && Newline(clone) && EmptyLines(clone) && Advance(clone) && CheckIndent(clone) && (result = IndentedUnclosedObjectLiteralInner(clone)) && PopIndent(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }()));
  UnclosedArrayLiteralElement = named("UnclosedArrayLiteralElement", (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = PushFakeIndent(2);
        function _rule4(o) {
          return IndentedUnclosedObjectLiteralInner(o) || IndentedUnclosedArrayLiteralInner(o) || SpreadOrExpression(o);
        }
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule3(clone) && (result = _rule4(clone)) && PopIndent(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return function (o) {
        return _rule2(o) || SpreadOrExpression(o);
      };
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (Asterix(clone) && Space(clone) && (result = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }()));
  IndentedUnclosedArrayLiteralInner = named("IndentedUnclosedArrayLiteralInner", (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (MaybeComma(clone) && SomeEmptyLinesWithCheckIndent(clone) && (result = UnclosedArrayLiteralElement(clone))) {
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
          while (true) {
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
        if ((result.head = UnclosedArrayLiteralElement(clone)) && (result.tail = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.array(i, [x.head].concat(__toArray(x.tail)));
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
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  IndentedUnclosedArrayLiteral = named("IndentedUnclosedArrayLiteral", (function () {
    function _rule(o) {
      return !_preventUnclosedObjectLiteral.peek();
    }
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (_rule(clone) && Space(clone) && Newline(clone) && EmptyLines(clone) && Advance(clone) && CheckIndent(clone) && (result = IndentedUnclosedArrayLiteralInner(clone)) && PopIndent(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }()));
  PrimaryExpression = cache(named("PrimaryExpression", function (o) {
    return UnclosedObjectLiteral(o) || Literal(o) || ArrayLiteral(o) || ObjectLiteral(o) || Ast(o) || Parenthetical(o) || FunctionLiteral(o) || UseMacro(o) || Identifier(o) || IndentedUnclosedObjectLiteral(o) || IndentedUnclosedArrayLiteral(o);
  }));
  ClosedArguments = named("ClosedArguments", (function () {
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
              while (true) {
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
              } else {
                return _mutator(result, o, index, line);
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
            return _missing(void 0, o, index, line);
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
                  while (true) {
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
                  } else {
                    return _mutator(result, o, index, line);
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
                return _missing2(void 0, o, index, line);
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
            return _missing(void 0, o, index, line);
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
        if (NoSpace(clone) && OpenParenthesis(clone) && Space(clone) && (result.first = _rule(clone)) && (result.rest = _rule2(clone)) && CloseParenthesis(clone)) {
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  UnclosedArguments = named("UnclosedArguments", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = named(
            __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "SpaceChar") + "+",
            function (o) {
              var clone, item, result;
              clone = o.clone();
              result = [];
              while (true) {
                item = SpaceChar(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (result.length >= 1) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
          );
          return named(
            (_rule6 != null ? _rule6.parserName : void 0) || "<unknown>",
            function (o) {
              var index, line, result;
              index = o.index;
              line = o.line;
              result = _rule6(o);
              if (!result) {
                return false;
              } else {
                return true;
              }
            }
          );
        }());
        return (function () {
          function _rule6(o) {
            var clone;
            clone = o.clone();
            if (_rule5(clone) && MaybeComment(clone)) {
              o.update(clone);
              return true;
            } else {
              return false;
            }
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
              } else {
                return true;
              }
            }
          );
        }());
      }());
      return function (o) {
        return _rule4(o) || CheckStop(o);
      };
    }());
    _rule2 = (function () {
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
            while (true) {
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
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule4(clone))) {
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    _rule3 = (function () {
      var _rule4, _rule5;
      _rule4 = (function () {
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
              while (true) {
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
            if (Comma(clone) && SomeEmptyLines(clone) && Advance(clone) && CheckIndent(clone) && (result.head = SpreadOrExpression(clone)) && (result.tail = _rule6(clone)) && MaybeComma(clone) && PopIndent(clone)) {
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
              } else {
                return _mutator(result, o, index, line);
              }
            }
          );
        }());
      }());
      _rule5 = (function () {
        function _mutator() {
          return [];
        }
        return named(
          (MaybeComma != null ? MaybeComma.parserName : void 0) || "MaybeComma",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = MaybeComma(o);
            if (!result) {
              return false;
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
      return function (o) {
        return _rule4(o) || _rule5(o);
      };
    }());
    return (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (_rule(clone) && (result.first = _rule2(clone)) && (result.rest = _rule3(clone))) {
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
        (_rule4 != null ? _rule4.parserName : void 0) || "<unknown>",
        function (o) {
          var index, line, result;
          index = o.index;
          line = o.line;
          result = _rule4(o);
          if (!result) {
            return false;
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
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
  InvocationOrAccessPart = named("InvocationOrAccessPart", (function () {
    var _rule, _rule2, _rule3;
    _rule = (function () {
      var _rule4;
      _rule4 = named(
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
      function _rule5(o) {
        return Period(o) || DoubleColon(o);
      }
      return (function () {
        function _rule6(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && (result.bind = _rule4(clone)) && EmptyLines(clone) && Space(clone) && (result.type = _rule5(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
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
            owns: x.owns === "!",
            bind: x.bind !== NOTHING
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    _rule2 = (function () {
      var _rule4, _rule5;
      _rule4 = named(
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
      _rule5 = named(
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
        function _rule6(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && (result.bind = _rule4(clone)) && (result.type = _rule5(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
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
              owns: x.owns === "!",
              bind: x.bind !== NOTHING
            };
          } else {
            if (x.owns === "!") {
              o.error("Cannot use ! when using a multiple or slicing index");
            }
            if (x.bind !== NOTHING) {
              o.error("Cannot use @ when using a multiple or slicing index");
            }
            return { type: x.type, child: x.child, existential: x.existential === "?" };
          }
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    _rule3 = (function () {
      var _rule4;
      _rule4 = named(
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
        function _rule5(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.isApply = _rule4(clone)) && (result.args = InvocationArguments(clone))) {
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
          (_rule5 != null ? _rule5.parserName : void 0) || "<unknown>",
          function (o) {
            var index, line, result;
            index = o.index;
            line = o.line;
            result = _rule5(o);
            if (!result) {
              return false;
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    return function (o) {
      return _rule(o) || _rule2(o) || _rule3(o);
    };
  }()));
  convertInvocationOrAccess = (function () {
    var linkTypes;
    linkTypes = {
      access: (function () {
        var indexTypes;
        indexTypes = {
          multi: function (o, i, child) {
            return function (parent) {
              var result, setParent, tmp, tmpIds;
              setParent = parent;
              tmpIds = [];
              if (parent.cacheable) {
                tmp = o.tmp(i, getTmpId(), "ref", parent.type(o));
                tmpIds.push(tmp.id);
                setParent = o.assign(i, tmp, "=", parent.doWrap(o));
                parent = tmp;
              }
              result = o.array(i, (function () {
                var _arr, _arr2, _len, element, j;
                for (_arr = [], _arr2 = __toArray(child.elements), j = 0, _len = _arr2.length; j < _len; ++j) {
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
          var bindAccess, child, existentialOp, makeAccess, result, setChild, setHead, tmp, tmpIds;
          if (link.bind) {
            bindAccess = function (parent, child) {
              return o.call(
                i,
                o.ident(i, "__bind"),
                [parent, child]
              );
            };
          } else {
            bindAccess = function (parent, child) {
              return o.access(i, parent, child);
            };
          }
          if (link.owns) {
            tmpIds = [];
            setHead = head;
            if (head.cacheable) {
              tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
              tmpIds.push(tmp.id);
              setHead = o.assign(i, tmp, "=", head.doWrap(o));
              head = tmp;
            }
            child = link.child;
            setChild = child;
            if (child.cacheable) {
              tmp = o.tmp(i, getTmpId(), "ref", child.type(o));
              tmpIds.push(tmp.id);
              setChild = o.assign(i, tmp, "=", child.doWrap(o));
              child = tmp;
            }
            result = o["if"](
              i,
              (function () {
                var existentialOp, ownershipOp;
                ownershipOp = o.macros.getByLabel("ownership");
                if (!ownershipOp) {
                  throw Error("Cannot use ownership access until the ownership operator has been defined");
                }
                if (link.existential) {
                  existentialOp = o.macros.getByLabel("existential");
                  if (!existentialOp) {
                    throw Error("Cannot use existential access until the existential operator has been defined");
                  }
                  return o.binary(
                    i,
                    existentialOp.func(
                      { op: "", node: setHead },
                      o,
                      i,
                      o.line
                    ),
                    "&&",
                    ownershipOp.func(
                      { left: head, op: "", right: setChild },
                      o,
                      i,
                      o.line
                    )
                  );
                } else {
                  return ownershipOp.func(
                    { left: setHead, op: "", right: setChild },
                    o,
                    i,
                    o.line
                  );
                }
              }()),
              convertCallChain(
                o,
                i,
                bindAccess(head, child),
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
              makeAccess = indexTypes[link.child.type](o, i, link.child);
              break;
            default: throw Error("Unknown link type: " + __strnum(link.type));
            }
            if (link.existential) {
              tmpIds = [];
              setHead = head;
              if (head.cacheable) {
                tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
                tmpIds.push(tmp.id);
                setHead = o.assign(i, tmp, "=", head.doWrap(o));
                head = tmp;
              }
              existentialOp = o.macros.getByLabel("existential");
              if (!existentialOp) {
                throw Error("Cannot use existential access until the existential operator has been defined");
              }
              result = o["if"](
                i,
                existentialOp.func(
                  { op: "", node: setHead },
                  o,
                  i,
                  o.line
                ),
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
                setParent = o.assign(i, tmp, "=", parent.doWrap(o));
                parent = tmp;
              }
              if (child.cacheable) {
                tmp = o.tmp(i, getTmpId(), "ref", child.type(o));
                tmpIds.push(tmp.id);
                setChild = o.assign(i, tmp, "=", child.doWrap(o));
                child = tmp;
              }
              if (parent !== setParent || child !== setChild) {
                setHead = o.access(i, setParent, setChild);
                head = o.access(i, parent, child);
              }
            } else if (head.cacheable) {
              tmp = o.tmp(i, getTmpId(), "ref", head.type(o));
              tmpIds.push(tmp.id);
              setHead = o.assign(i, tmp, "=", head.doWrap(o));
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
        if (!__owns.call(linkTypes, link.type)) {
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
    return function (isNew, head, tail, o, i) {
      var _arr, _i, _len, clone, links, part;
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
        default: o.error("Unknown link type: " + __strnum(part.type));
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
  BasicInvocationOrAccess = named("BasicInvocationOrAccess", (function () {
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
        var _rule6;
        _rule6 = named(
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
          function _rule7(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.node = ThisShorthandLiteral(clone)) && (result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.owns = MaybeExclamationPointNoSpace(clone)) && (result.bind = _rule6(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
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
              owns: x.owns === "!",
              bind: x.bind !== NOTHING
            };
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
              } else {
                return _mutator(result, o, index, line);
              }
            }
          );
        }());
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
            } else {
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
      return function (o) {
        return _rule4(o) || _rule5(o);
      };
    }());
    _rule3 = named(
      __strnum((InvocationOrAccessPart != null ? InvocationOrAccessPart.parserName : void 0) || "InvocationOrAccessPart") + "*",
      function (o) {
        var clone, item, result;
        clone = o.clone();
        result = [];
        while (true) {
          item = InvocationOrAccessPart(clone);
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
      function _mutator(_p, o, i) {
        var head, isNew, tail;
        isNew = _p.isNew;
        head = _p.head;
        tail = _p.tail;
        return convertInvocationOrAccess(
          isNew !== NOTHING,
          head,
          tail,
          o,
          i
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
          } else {
            return _mutator(result, o, index, line);
          }
        }
      );
    }());
  }()));
  SuperToken = cache(named("SuperToken", word("super")));
  SuperInvocation = named("SuperInvocation", (function () {
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
            } else {
              return _mutator(result, o, index, line);
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
  }()));
  EvalToken = cache(named("EvalToken", word("eval")));
  Eval = named("Eval", (function () {
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
          } else {
            return _mutator(result, o, index, line);
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
  }()));
  InvocationOrAccess = named("InvocationOrAccess", (function () {
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
  }()));
  CustomPostfixUnary = named("CustomPostfixUnary", function (o) {
    var _arr, _i, clone, line, node, op, operator, rule, startIndex;
    startIndex = o.index;
    line = o.line;
    node = InvocationOrAccess(o);
    if (!node) {
      return false;
    } else {
      for (_arr = __toArray(o.macros.postfixUnaryOperators), _i = _arr.length; _i--; ) {
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
  });
  CustomPrefixUnary = named("CustomPrefixUnary", function (o) {
    var _arr, _i, clone, line, node, op, operator, rule, startIndex;
    startIndex = o.index;
    line = o.line;
    for (_arr = __toArray(o.macros.prefixUnaryOperators), _i = _arr.length; _i--; ) {
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
  });
  getUseCustomBinaryOperator = (function () {
    var precedenceCache;
    precedenceCache = [];
    return function (precedence) {
      var _ref;
      if ((_ref = precedenceCache[precedence]) == null) {
        return precedenceCache[precedence] = cache(function (o) {
          var _arr, _i, _i2, _len, binaryOperators, clone, head, inverted, j, left, line, nextRule, node, op, operator, operators, part, right, rule, startIndex, tail;
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
                for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
                  operator = _arr[_i];
                  rule = operator.rule;
                  tail = [];
                  while (true) {
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
                    if (operator.maximum && tail.length >= __num(operator.maximum)) {
                      break;
                    }
                  }
                  if (tail.length) {
                    if (!operator.rightToLeft) {
                      left = head;
                      for (_i2 = 0, _len = tail.length; _i2 < _len; ++_i2) {
                        part = tail[_i2];
                        left = operator.func(
                          { left: left, inverted: part.inverted, op: part.op, right: part.node },
                          o,
                          startIndex,
                          line
                        );
                      }
                      return left;
                    } else {
                      right = tail[tail.length - 1].node;
                      for (j = tail.length; j--; ) {
                        part = tail[j];
                        right = operator.func(
                          {
                            left: j === 0 ? head : tail[j - 1].node,
                            inverted: part.inverted,
                            op: part.op,
                            right: right
                          },
                          o,
                          startIndex,
                          line
                        );
                      }
                      return right;
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
  ExpressionAsStatement = named("ExpressionAsStatement", function (o) {
    return UseMacro(o) || Logic(o);
  });
  Expression = cache(named("Expression", inExpression(ExpressionAsStatement)));
  Statement = named("Statement", (function () {
    var _rule;
    _rule = inStatement(function (o) {
      return DefineMacro(o) || DefineHelper(o) || DefineOperator(o) || DefineSyntax(o) || Assignment(o) || ExpressionAsStatement(o);
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
  }()));
  Line = named("Line", function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (CheckIndent(clone) && (result = Statement(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  _Block = (function () {
    var runSync;
    function mutator(lines, o, i) {
      var _arr, _i, _len, item, nodes;
      nodes = [];
      for (_arr = __toArray(lines), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        item = _arr[_i];
        if (item instanceof BlockNode && item.label == null) {
          nodes.push.apply(nodes, __toArray(item.nodes));
        } else if (!(item instanceof NothingNode)) {
          nodes.push(item);
        }
      }
      switch (nodes.length) {
      case 0: return o.nothing(i);
      case 1: return nodes[0];
      default:
        return o.block(i, nodes);
      }
    }
    runSync = (function () {
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
            while (true) {
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
          return mutator([x.head].concat(__toArray(x.tail)), o, i);
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
              return _mutator(result, o, index, line);
            }
          }
        );
      }());
    }());
    function runAsync(o, callback) {
      var head, i, lines;
      i = o.index;
      head = void 0;
      try {
        head = Line(o);
      } catch (e) {
        return callback(e);
      }
      if (!head) {
        return callback(null, head);
      }
      lines = [head];
      function next() {
        var clone, line, startTime;
        try {
          startTime = new Date().getTime();
          while (true) {
            if (__num(new Date().getTime()) - __num(startTime) > 17) {
              return nextTick(next);
            }
            clone = o.clone();
            if (!Newline(clone) || !EmptyLines(clone)) {
              break;
            }
            line = Line(clone);
            if (!line) {
              break;
            }
            o.update(clone);
            lines.push(line);
          }
        } catch (e) {
          return callback(e);
        }
        return callback(null, mutator(lines, o, i));
      }
      return next();
    }
    return function (o, callback) {
      if (callback != null) {
        return runAsync(o, callback);
      } else {
        return runSync(o);
      }
    };
  }());
  Block = named("Block", (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (CheckIndent(clone) && (result = IndentedUnclosedObjectLiteralInner(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (CheckIndent(clone) && (result = IndentedUnclosedArrayLiteralInner(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return function (o) {
      return _rule(o) || _rule2(o) || _Block(o);
    };
  }()));
  BOM = (function () {
    var _rule;
    _rule = named('"\ufeff"', function (o) {
      if (o.data.charCodeAt(o.index) === 65279) {
        o.index = __num(o.index) + 1;
        return 65279;
      } else {
        o.fail('"\ufeff"');
        return false;
      }
    });
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
  }());
  Shebang = (function () {
    var _rule;
    _rule = (function () {
      var _rule2, _rule3, _rule4;
      _rule2 = named('"#"', function (o) {
        if (o.data.charCodeAt(o.index) === 35) {
          o.index = __num(o.index) + 1;
          return 35;
        } else {
          o.fail('"#"');
          return false;
        }
      });
      _rule3 = named('"!"', function (o) {
        if (o.data.charCodeAt(o.index) === 33) {
          o.index = __num(o.index) + 1;
          return 33;
        } else {
          o.fail('"!"');
          return false;
        }
      });
      _rule4 = (function () {
        var _rule5;
        _rule5 = (function () {
          var _rule6;
          _rule6 = named(
            "!" + __strnum((Newline != null ? Newline.parserName : void 0) || "Newline"),
            function (o) {
              return !Newline(o.clone());
            }
          );
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_rule6(clone) && (result = AnyChar(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        return named(
          __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "*",
          function (o) {
            var clone, item, result;
            clone = o.clone();
            result = [];
            while (true) {
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
          var clone;
          clone = o.clone();
          if (_rule2(clone) && _rule3(clone) && _rule4(clone)) {
            o.update(clone);
            return true;
          } else {
            return false;
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
            } else {
              return true;
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
  }());
  function Root(o, callback) {
    var i;
    i = o.index;
    BOM(o);
    Shebang(o);
    EmptyLines(o);
    function next(block) {
      var result, x;
      x = block || o.nothing(i);
      EmptyLines(o);
      Space(o);
      result = o.root(i, x);
      if (callback != null) {
        return callback(null, result);
      } else {
        return result;
      }
    }
    if (callback != null) {
      return _Block(o, function (_e, block) {
        if (_e != null) {
          return callback(_e);
        }
        return next(block);
      });
    } else {
      return next(_Block(o));
    }
  }
  ParserError = (function (Error) {
    var _Error_prototype, _ParserError_prototype;
    function ParserError(message, text, index, line) {
      var _this, err;
      _this = this instanceof ParserError ? this : __create(_ParserError_prototype);
      if (typeof message !== "string") {
        throw TypeError("Expected message to be a String, got " + __typeof(message));
      }
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      err = Error.call(_this, message + " at line #" + line);
      _this.message = err.message;
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, ParserError);
      } else if ("stack" in err) {
        _this.stack = err.stack;
      }
      _this.text = text;
      _this.index = index;
      _this.line = line;
      return _this;
    }
    _Error_prototype = Error.prototype;
    _ParserError_prototype = ParserError.prototype = __create(_Error_prototype);
    _ParserError_prototype.constructor = ParserError;
    ParserError.displayName = "ParserError";
    _ParserError_prototype.name = ParserError.name;
    return ParserError;
  }(Error));
  MacroError = (function (Error) {
    var _Error_prototype, _MacroError_prototype;
    function MacroError(inner, text, index, line) {
      var _this, err, innerType;
      _this = this instanceof MacroError ? this : __create(_MacroError_prototype);
      if (!(inner instanceof Error)) {
        throw TypeError("Expected inner to be an Error, got " + __typeof(inner));
      }
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      innerType = __typeof(inner);
      err = Error.call(_this, (innerType === "Error" ? "" : innerType + ": ") + String(inner != null ? inner.message : void 0) + " at line #" + line);
      _this.message = err.message;
      if ("stack" in inner && typeof inner.stack === "string") {
        _this.stack = "MacroError: " + __strnum(inner.stack);
      } else if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(_this, MacroError);
      } else if ("stack" in err) {
        _this.stack = err.stack;
      }
      _this.inner = inner;
      _this.text = text;
      _this.index = index;
      _this.line = line;
      return _this;
    }
    _Error_prototype = Error.prototype;
    _MacroError_prototype = MacroError.prototype = __create(_Error_prototype);
    _MacroError_prototype.constructor = MacroError;
    MacroError.displayName = "MacroError";
    _MacroError_prototype.name = MacroError.name;
    return MacroError;
  }(Error));
  function map(array, func, arg) {
    var _arr, _i, _len, changed, item, newItem, result;
    result = [];
    changed = false;
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
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
  function mapAsync(array, func) {
    var _ref, args, callback, changed;
    args = 2 < (_ref = arguments.length - 1) ? __slice(arguments, 2, _ref) : (_ref = 2, []);
    callback = arguments[_ref];
    changed = false;
    return __asyncResult(
      1,
      __num(array.length),
      function (_i, next) {
        var item;
        item = array[_i];
        return func.apply(void 0, [item].concat(__toArray(args), [
          function (_e, newItem) {
            if (_e != null) {
              return next(_e);
            }
            if (item !== newItem) {
              changed = true;
            }
            return next(null, newItem);
          }
        ]));
      },
      function (err, result) {
        if (typeof err !== "undefined" && err !== null) {
          return callback(err);
        } else {
          return callback(null, changed ? result : array);
        }
      }
    );
  }
  FailureManager = (function () {
    var _FailureManager_prototype;
    function FailureManager() {
      var _this;
      _this = this instanceof FailureManager ? this : __create(_FailureManager_prototype);
      _this.messages = [];
      _this.index = 0;
      _this.line = 0;
      return _this;
    }
    _FailureManager_prototype = FailureManager.prototype;
    FailureManager.displayName = "FailureManager";
    _FailureManager_prototype.add = function (message, index, line) {
      if (!__lte(index, this.index)) {
        this.messages = [];
        this.index = index;
      }
      if (__lt(this.line, line)) {
        this.line = line;
      }
      if (!__lt(index, this.index)) {
        this.messages.push(message);
      }
    };
    return FailureManager;
  }());
  nodeToType = (function () {
    var identToType;
    identToType = {
      Boolean: Type.boolean,
      String: Type.string,
      Number: Type.number,
      Array: Type.array,
      Object: Type.object,
      Function: Type["function"],
      RegExp: Type.regexp,
      Date: Type.date,
      Error: Type.error,
      RangeError: Type.error,
      ReferenceError: Type.error,
      SyntaxError: Type.error,
      TypeError: Type.error,
      URIError: Type.error
    };
    return function (node) {
      var _arr, _i, _len, _ref, current, data, key, type, value;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (node instanceof IdentNode) {
        return (__owns.call(identToType, _ref = node.name) ? identToType[_ref] : void 0) || Type.any;
      } else if (node instanceof ConstNode) {
        if (node.value === null) {
          return Type["null"];
        } else if (node.value === void 0) {
          return Type["undefined"];
        } else {
          return Type.any;
        }
      } else if (node instanceof TypeArrayNode) {
        return nodeToType(node.subtype).array();
      } else if (node instanceof TypeFunctionNode) {
        return nodeToType(node.returnType)["function"]();
      } else if (node instanceof TypeUnionNode) {
        current = Type.none;
        for (_arr = __toArray(node.types), _i = _arr.length; _i--; ) {
          type = _arr[_i];
          current = current.union(nodeToType(type));
        }
        return current;
      } else if (node instanceof TypeObjectNode) {
        data = {};
        for (_arr = __toArray(node.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
          key = (_ref = _arr[_i]).key;
          value = _ref.value;
          if (key instanceof ConstNode) {
            data[key.value] = nodeToType(value);
          }
        }
        return Type.makeObject(data);
      } else {
        return Type.any;
      }
    };
  }());
  MacroHelper = (function () {
    var _MacroHelper_prototype, mutators;
    function MacroHelper(state, index, position, inGenerator) {
      var _this;
      _this = this instanceof MacroHelper ? this : __create(_MacroHelper_prototype);
      if (!(state instanceof State)) {
        throw TypeError("Expected state to be a State, got " + __typeof(state));
      }
      _this.unsavedTmps = [];
      _this.savedTmps = [];
      _this.state = state;
      _this.index = index;
      _this.position = position;
      _this.inGenerator = inGenerator;
      return _this;
    }
    _MacroHelper_prototype = MacroHelper.prototype;
    MacroHelper.displayName = "MacroHelper";
    _MacroHelper_prototype.doWrap = function (node) {
      if (node instanceof Node) {
        return node.doWrap(this.state);
      } else {
        return node;
      }
    };
    _MacroHelper_prototype["let"] = function (ident, isMutable, type) {
      if (!(ident instanceof TmpNode) && !(ident instanceof IdentNode)) {
        throw TypeError("Expected ident to be a TmpNode or IdentNode, got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (type == null) {
        type = Type.any;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      if (ident instanceof IdentNode && isMutable && type.isSubsetOf(Type.undefinedOrNull)) {
        type = Type.any;
      }
      return this.state.scope.add(ident, isMutable, type);
    };
    _MacroHelper_prototype.hasVariable = function (ident) {
      if (!(ident instanceof TmpNode) && !(ident instanceof IdentNode)) {
        throw TypeError("Expected ident to be a TmpNode or IdentNode, got " + __typeof(ident));
      }
      return this.state.scope.has(ident);
    };
    _MacroHelper_prototype["var"] = function (ident, isMutable) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      return this.state["var"](this.index, ident, isMutable);
    };
    _MacroHelper_prototype.def = function (key, value) {
      if (key == null) {
        key = NothingNode(0, 0, this.state.scope.id);
      } else if (!(key instanceof Node)) {
        throw TypeError("Expected key to be a Node, got " + __typeof(key));
      }
      if (value == null) {
        value = void 0;
      } else if (!(value instanceof Node)) {
        throw TypeError("Expected value to be a Node or undefined, got " + __typeof(value));
      }
      return this.state.def(this.index, key, this.doWrap(value));
    };
    _MacroHelper_prototype.noop = function () {
      return this.state.nothing(this.index);
    };
    _MacroHelper_prototype.block = function (nodes, label) {
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
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state.block(this.index, nodes, label).reduce(this.state);
    };
    _MacroHelper_prototype["if"] = function (test, whenTrue, whenFalse, label) {
      if (test == null) {
        test = NothingNode(0, 0, this.state.scope.id);
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (whenTrue == null) {
        whenTrue = NothingNode(0, 0, this.state.scope.id);
      } else if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = null;
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node or null, got " + __typeof(whenFalse));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state["if"](
        this.index,
        this.doWrap(test),
        whenTrue,
        whenFalse,
        label
      ).reduce(this.state);
    };
    _MacroHelper_prototype["switch"] = function (node, cases, defaultCase, label) {
      var _this;
      _this = this;
      if (node == null) {
        node = NothingNode(0, 0, this.state.scope.id);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(cases)) {
        throw TypeError("Expected cases to be an Array, got " + __typeof(cases));
      }
      if (defaultCase == null) {
        defaultCase = null;
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node or null, got " + __typeof(defaultCase));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state["switch"](
        this.index,
        this.doWrap(node),
        (function () {
          var _arr, _i, _len, case_;
          for (_arr = [], _i = 0, _len = cases.length; _i < _len; ++_i) {
            case_ = cases[_i];
            _arr.push({ node: _this.doWrap(case_.node), body: case_.body, fallthrough: case_.fallthrough });
          }
          return _arr;
        }()),
        defaultCase,
        label
      ).reduce(this.state);
    };
    _MacroHelper_prototype["for"] = function (init, test, step, body, label) {
      if (init == null) {
        init = null;
      } else if (!(init instanceof Node)) {
        throw TypeError("Expected init to be a Node or null, got " + __typeof(init));
      }
      if (test == null) {
        test = null;
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node or null, got " + __typeof(test));
      }
      if (step == null) {
        step = null;
      } else if (!(step instanceof Node)) {
        throw TypeError("Expected step to be a Node or null, got " + __typeof(step));
      }
      if (body == null) {
        body = NothingNode(0, 0, this.state.scope.id);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state["for"](
        this.index,
        this.doWrap(init),
        this.doWrap(test),
        this.doWrap(step),
        body,
        label
      ).reduce(this.state);
    };
    _MacroHelper_prototype.forIn = function (key, object, body, label) {
      if (!(key instanceof IdentNode)) {
        throw TypeError("Expected key to be an IdentNode, got " + __typeof(key));
      }
      if (object == null) {
        object = NothingNode(0, 0);
      } else if (!(object instanceof Node)) {
        throw TypeError("Expected object to be a Node, got " + __typeof(object));
      }
      if (body == null) {
        body = NothingNode(0, 0, this.state.scope.id);
      } else if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state.forIn(
        this.index,
        key,
        this.doWrap(object),
        body,
        label
      ).reduce(this.state);
    };
    _MacroHelper_prototype.tryCatch = function (tryBody, catchIdent, catchBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, 0, this.state.scope.id);
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (catchIdent == null) {
        catchIdent = NothingNode(0, 0, this.state.scope.id);
      } else if (!(catchIdent instanceof Node)) {
        throw TypeError("Expected catchIdent to be a Node, got " + __typeof(catchIdent));
      }
      if (catchBody == null) {
        catchBody = NothingNode(0, 0, this.state.scope.id);
      } else if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state.tryCatch(
        this.index,
        tryBody,
        catchIdent,
        catchBody,
        label
      ).reduce(this.state);
    };
    _MacroHelper_prototype.tryFinally = function (tryBody, finallyBody, label) {
      if (tryBody == null) {
        tryBody = NothingNode(0, 0, this.state.scope.id);
      } else if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (finallyBody == null) {
        finallyBody = NothingNode(0, 0, this.state.scope.id);
      } else if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state.tryFinally(this.index, tryBody, finallyBody, label).reduce(this.state);
    };
    _MacroHelper_prototype.assign = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, 0, this.state.scope.id);
      } else if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == null) {
        right = NothingNode(0, 0, this.state.scope.id);
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      return this.state.assign(this.index, left, op, this.doWrap(right)).reduce(this.state);
    };
    _MacroHelper_prototype.binary = function (left, op, right) {
      if (left == null) {
        left = NothingNode(0, 0, this.state.scope.id);
      } else if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (right == null) {
        right = NothingNode(0, 0, this.state.scope.id);
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      return this.state.binary(this.index, this.doWrap(left), op, this.doWrap(right)).reduce(this.state);
    };
    _MacroHelper_prototype.unary = function (op, node) {
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (node == null) {
        node = NothingNode(0, 0, this.state.scope.id);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state.unary(this.index, op, this.doWrap(node)).reduce(this.state);
    };
    _MacroHelper_prototype["throw"] = function (node) {
      if (node == null) {
        node = NothingNode(0, 0, this.state.scope.id);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state["throw"](this.index, this.doWrap(node)).reduce(this.state);
    };
    _MacroHelper_prototype["return"] = function (node) {
      if (node == null) {
        node = void 0;
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node or undefined, got " + __typeof(node));
      }
      return this.state["return"](this.index, this.doWrap(node)).reduce(this.state);
    };
    _MacroHelper_prototype["yield"] = function (node) {
      if (node == null) {
        node = NothingNode(0, 0, this.state.scope.id);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      return this.state["yield"](this.index, this.doWrap(node)).reduce(this.state);
    };
    _MacroHelper_prototype["debugger"] = function () {
      return this.state["debugger"](this.index);
    };
    _MacroHelper_prototype["break"] = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state["break"](this.index, label);
    };
    _MacroHelper_prototype["continue"] = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return this.state["continue"](this.index, label);
    };
    _MacroHelper_prototype.isLabeledBlock = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryCatchFinallyNode) {
        return node.label != null;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.isBreak = function (node) {
      return this.macroExpand1(node) instanceof BreakNode;
    };
    _MacroHelper_prototype.isContinue = function (node) {
      return this.macroExpand1(node) instanceof ContinueNode;
    };
    _MacroHelper_prototype.label = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof BreakNode || node instanceof ContinueNode || node instanceof BlockNode || node instanceof IfNode || node instanceof SwitchNode || node instanceof ForNode || node instanceof ForInNode || node instanceof TryCatchNode || node instanceof TryCatchFinallyNode) {
        return node.label;
      } else {
        return null;
      }
    };
    _MacroHelper_prototype.withLabel = function (node, label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return node.withLabel(label, this.state);
    };
    _MacroHelper_prototype.macroExpand1 = function (node) {
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
    _MacroHelper_prototype.macroExpandAll = function (node) {
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
    _MacroHelper_prototype.tmp = function (name, save, type) {
      var id;
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      id = getTmpId();
      (save ? this.savedTmps : this.unsavedTmps).push(id);
      if (type == null) {
        type = Type.any;
      } else if (typeof type === "string") {
        if (!((__owns.call(Type, type) ? Type[type] : void 0) instanceof Type)) {
          throw Error(__strnum(type) + " is not a known type name");
        }
        type = __owns.call(Type, type) ? Type[type] : void 0;
      } else if (!(type instanceof Type)) {
        throw Error("Must provide a Type or a string for type, got " + __typeof(type));
      }
      return this.state.tmp(this.index, id, name, type);
    };
    _MacroHelper_prototype.getTmps = function () {
      return { unsaved: this.unsavedTmps.slice(), saved: this.savedTmps.slice() };
    };
    _MacroHelper_prototype.isConst = function (node) {
      return node === void 0 || node instanceof Node && this.macroExpand1(node).isConst();
    };
    _MacroHelper_prototype.value = function (node) {
      var expanded;
      if (node === void 0) {
        return;
      } else if (node instanceof Node) {
        expanded = this.macroExpand1(node);
        if (expanded.isConst()) {
          return expanded.constValue();
        }
      }
    };
    _MacroHelper_prototype["const"] = function (value) {
      return this.state["const"](this.index, value);
    };
    _MacroHelper_prototype.isNode = function (node) {
      return node instanceof Node;
    };
    _MacroHelper_prototype.isIdent = function (node) {
      return this.macroExpand1(node) instanceof IdentNode;
    };
    _MacroHelper_prototype.isTmp = function (node) {
      return this.macroExpand1(node) instanceof TmpNode;
    };
    _MacroHelper_prototype.isIdentOrTmp = function (node) {
      var _ref;
      return (_ref = this.macroExpand1(node)) instanceof IdentNode || _ref instanceof TmpNode;
    };
    _MacroHelper_prototype.name = function (node) {
      node = this.macroExpand1(node);
      if (this.isIdent(node)) {
        return node.name;
      }
    };
    _MacroHelper_prototype.ident = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (require("./ast").isAcceptableIdent(name)) {
        return this.state.ident(this.index, name);
      }
    };
    _MacroHelper_prototype.isCall = function (node) {
      return this.macroExpand1(node) instanceof CallNode;
    };
    _MacroHelper_prototype.callFunc = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return node.func;
      }
    };
    _MacroHelper_prototype.callArgs = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return node.args;
      }
    };
    _MacroHelper_prototype.isSuper = function (node) {
      return this.macroExpand1(node) instanceof SuperNode;
    };
    _MacroHelper_prototype.superChild = function (node) {
      node = this.macroExpand1(node);
      if (this.isSuper(node)) {
        return node.child;
      }
    };
    _MacroHelper_prototype.superArgs = function (node) {
      node = this.macroExpand1(node);
      if (this.isSuper(node)) {
        return node.args;
      }
    };
    _MacroHelper_prototype.callIsNew = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return !!node.isNew;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.callIsApply = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof CallNode) {
        return !!node.isApply;
      } else {
        return false;
      }
    };
    _MacroHelper_prototype.call = function (func, args, isNew, isApply) {
      var _i, _len, _this;
      _this = this;
      if (!(func instanceof Node)) {
        throw TypeError("Expected func to be a Node, got " + __typeof(func));
      }
      if (args == null) {
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
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (isApply == null) {
        isApply = false;
      } else if (typeof isApply !== "boolean") {
        throw TypeError("Expected isApply to be a Boolean, got " + __typeof(isApply));
      }
      if (isNew && isApply) {
        throw Error("Cannot specify both is-new and is-apply");
      }
      return this.state.call(
        func.startIndex,
        this.doWrap(func),
        (function () {
          var _arr, _i, _len, arg;
          for (_arr = [], _i = 0, _len = args.length; _i < _len; ++_i) {
            arg = args[_i];
            _arr.push(_this.doWrap(arg));
          }
          return _arr;
        }()),
        isNew,
        isApply
      ).reduce(this.state);
    };
    _MacroHelper_prototype.func = function (params, body, autoReturn, bound) {
      var _this, clone;
      _this = this;
      if (autoReturn == null) {
        autoReturn = true;
      }
      if (bound == null) {
        bound = false;
      } else if (!(bound instanceof Node) && typeof bound !== "boolean") {
        throw TypeError("Expected bound to be a Node or Boolean, got " + __typeof(bound));
      }
      clone = this.state.clone(this.state.cloneScope());
      params = (function () {
        var _arr, _arr2, _i, _len, p, param;
        for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          param = _arr2[_i];
          p = param.rescope(clone.scope.id, clone);
          addParamToScope(clone, p);
          _arr.push(p);
        }
        return _arr;
      }());
      return this.state["function"](
        0,
        params,
        body.rescope(clone.scope.id, clone),
        autoReturn,
        bound
      ).reduce(this.state);
    };
    _MacroHelper_prototype.isFunc = function (node) {
      return this.macroExpand1(node) instanceof FunctionNode;
    };
    _MacroHelper_prototype.funcBody = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return node.body;
      }
    };
    _MacroHelper_prototype.funcParams = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return node.params;
      }
    };
    _MacroHelper_prototype.funcIsAutoReturn = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return !!node.autoReturn;
      }
    };
    _MacroHelper_prototype.funcIsBound = function (node) {
      node = this.macroExpand1(node);
      if (this.isFunc(node)) {
        return !!node.bound && !(node.bound instanceof Node);
      }
    };
    _MacroHelper_prototype.param = function (ident, defaultValue, spread, isMutable, asType) {
      return this.state.param(
        0,
        ident,
        defaultValue,
        spread,
        isMutable,
        asType
      ).reduce(this.state);
    };
    _MacroHelper_prototype.isParam = function (node) {
      return this.macroExpand1(node) instanceof ParamNode;
    };
    _MacroHelper_prototype.paramIdent = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.ident;
      }
    };
    _MacroHelper_prototype.paramDefaultValue = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.defaultValue;
      }
    };
    _MacroHelper_prototype.paramIsSpread = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return !!node.spread;
      }
    };
    _MacroHelper_prototype.paramIsMutable = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return !!node.isMutable;
      }
    };
    _MacroHelper_prototype.paramType = function (node) {
      node = this.macroExpand1(node);
      if (this.isParam(node)) {
        return node.asType;
      }
    };
    _MacroHelper_prototype.isArray = function (node) {
      return this.macroExpand1(node) instanceof ArrayNode;
    };
    _MacroHelper_prototype.elements = function (node) {
      node = this.macroExpand1(node);
      if (this.isArray(node)) {
        return node.elements;
      }
    };
    _MacroHelper_prototype.isObject = function (node) {
      return this.macroExpand1(node) instanceof ObjectNode;
    };
    _MacroHelper_prototype.pairs = function (node) {
      node = this.macroExpand1(node);
      if (this.isObject(node) || this.isTypeObject(node)) {
        return node.pairs;
      }
    };
    _MacroHelper_prototype.isBlock = function (node) {
      return this.macroExpand1(node) instanceof BlockNode;
    };
    _MacroHelper_prototype.nodes = function (node) {
      node = this.macroExpand1(node);
      if (this.isBlock(node)) {
        return node.nodes;
      }
    };
    _MacroHelper_prototype.array = function (elements) {
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
        for (_arr = [], _i = 0, _len = elements.length; _i < _len; ++_i) {
          element = elements[_i];
          _arr.push(_this.doWrap(element));
        }
        return _arr;
      }())).reduce(this.state);
    };
    _MacroHelper_prototype.object = function (pairs) {
      var _i, _len, _this;
      _this = this;
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be an Array, got " + __typeof(pairs));
      } else {
        for (_i = 0, _len = pairs.length; _i < _len; ++_i) {
          if (!__isObject(pairs[_i])) {
            throw TypeError("Expected pairs[" + _i + "] to be an Object, got " + __typeof(pairs[_i]));
          } else {
            if (!(pairs[_i].key instanceof Node)) {
              throw TypeError("Expected pairs[" + _i + "].key to be a Node, got " + __typeof(pairs[_i].key));
            }
            if (!(pairs[_i].value instanceof Node)) {
              throw TypeError("Expected pairs[" + _i + "].value to be a Node, got " + __typeof(pairs[_i].value));
            }
          }
        }
      }
      return this.state.object(0, (function () {
        var _arr, _i, _len, _ref, key, property, value;
        for (_arr = [], _i = 0, _len = pairs.length; _i < _len; ++_i) {
          key = (_ref = pairs[_i]).key;
          value = _ref.value;
          property = _ref.property;
          _arr.push({ key: _this.doWrap(key), value: _this.doWrap(value)(property) });
        }
        return _arr;
      }())).reduce(this.state);
    };
    _MacroHelper_prototype.type = function (node) {
      var _this;
      _this = this;
      if (typeof node === "string") {
        return (__owns.call(Type, node) ? Type[node] : void 0) || (function () {
          throw Error("Unknown type " + __strnum(node));
        }());
      } else if (node instanceof Node) {
        return node.type(this.state);
      } else {
        throw Error("Can only retrieve type from a String or Node, got " + __typeof(node));
      }
    };
    _MacroHelper_prototype.toType = nodeToType;
    _MacroHelper_prototype.isComplex = function (node) {
      node = this.macroExpand1(node);
      return node != null && !(node instanceof ConstNode) && !(node instanceof IdentNode) && !(node instanceof TmpNode) && !(node instanceof ThisNode) && !(node instanceof ArgsNode) && (!(node instanceof BlockNode) || node.nodes.length !== 0);
    };
    _MacroHelper_prototype.isTypeArray = function (node) {
      return this.macroExpand1(node) instanceof TypeArrayNode;
    };
    _MacroHelper_prototype.subtype = function (node) {
      node = this.macroExpand1(node);
      return this.isTypeArray(node) && node.subtype;
    };
    _MacroHelper_prototype.isTypeObject = function (node) {
      return this.macroExpand1(node) instanceof TypeObjectNode;
    };
    _MacroHelper_prototype.isTypeFunction = function (node) {
      return this.macroExpand1(node) instanceof TypeFunctionNode;
    };
    _MacroHelper_prototype.returnType = function (node) {
      node = this.macroExpand1(node);
      return this.isTypeFunction(node) && node.returnType;
    };
    _MacroHelper_prototype.isTypeUnion = function (node) {
      return this.macroExpand1(node) instanceof TypeUnionNode;
    };
    _MacroHelper_prototype.types = function (node) {
      node = this.macroExpand1(node);
      return this.isTypeUnion(node) && node.types;
    };
    _MacroHelper_prototype.isThis = function (node) {
      return this.macroExpand1(node) instanceof ThisNode;
    };
    _MacroHelper_prototype.isArguments = function (node) {
      node = this.macroExpand1(node);
      return node instanceof ArgsNode;
    };
    _MacroHelper_prototype.isDef = function (node) {
      return this.macroExpand1(node) instanceof DefNode;
    };
    _MacroHelper_prototype.isAssign = function (node) {
      return this.macroExpand1(node) instanceof AssignNode;
    };
    _MacroHelper_prototype.isBinary = function (node) {
      return this.macroExpand1(node) instanceof BinaryNode;
    };
    _MacroHelper_prototype.isUnary = function (node) {
      return this.macroExpand1(node) instanceof UnaryNode;
    };
    _MacroHelper_prototype.op = function (node) {
      node = this.macroExpand1(node);
      if (this.isAssign(node) || this.isBinary(node) || this.isUnary(node)) {
        return node.op;
      }
    };
    _MacroHelper_prototype.left = function (node) {
      node = this.macroExpand1(node);
      if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
        return node.left;
      }
    };
    _MacroHelper_prototype.right = function (node) {
      node = this.macroExpand1(node);
      if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
        return node.right;
      }
    };
    _MacroHelper_prototype.unaryNode = function (node) {
      node = this.macroExpand1(node);
      if (this.isUnary(node)) {
        return node.node;
      }
    };
    _MacroHelper_prototype.isAccess = function (node) {
      return this.macroExpand1(node) instanceof AccessNode;
    };
    _MacroHelper_prototype.parent = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof AccessNode) {
        return node.parent;
      }
    };
    _MacroHelper_prototype.child = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof AccessNode) {
        return node.child;
      }
    };
    _MacroHelper_prototype.isIf = function (node) {
      return this.macroExpand1(node) instanceof IfNode;
    };
    _MacroHelper_prototype.test = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof IfNode) {
        return node.test;
      }
    };
    _MacroHelper_prototype.whenTrue = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof IfNode) {
        return node.whenTrue;
      }
    };
    _MacroHelper_prototype.whenFalse = function (node) {
      node = this.macroExpand1(node);
      if (node instanceof IfNode) {
        return node.whenFalse;
      }
    };
    _MacroHelper_prototype.cache = function (node, init, name, save) {
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
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
    _MacroHelper_prototype.maybeCache = function (node, func, name, save) {
      var tmp, type;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (name == null) {
        name = "ref";
      } else if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (save == null) {
        save = false;
      } else if (typeof save !== "boolean") {
        throw TypeError("Expected save to be a Boolean, got " + __typeof(save));
      }
      node = this.macroExpand1(node);
      if (this.isComplex(node)) {
        type = node.type(this.state);
        tmp = this.tmp(name, save, type);
        this.state.scope.add(tmp, false, type);
        return func(
          this.state.block(this.index, [
            this.state["var"](this.index, tmp, false),
            this.state.assign(this.index, tmp, "=", this.doWrap(node))
          ]),
          tmp,
          true
        );
      } else {
        return func(node, node, false);
      }
    };
    _MacroHelper_prototype.maybeCacheAccess = function (node, func, parentName, childName, save) {
      var _this;
      _this = this;
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (parentName == null) {
        parentName = "ref";
      } else if (typeof parentName !== "string") {
        throw TypeError("Expected parentName to be a String, got " + __typeof(parentName));
      }
      if (childName == null) {
        childName = "ref";
      } else if (typeof childName !== "string") {
        throw TypeError("Expected childName to be a String, got " + __typeof(childName));
      }
      if (save == null) {
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
    _MacroHelper_prototype.empty = function (node) {
      var _this;
      _this = this;
      if (node == null) {
        return true;
      } else if (!(node instanceof Node)) {
        return false;
      } else if (node instanceof BlockNode) {
        return (function () {
          var _arr, _i, item;
          for (_arr = __toArray(node.nodes), _i = _arr.length; _i--; ) {
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
    function constifyObject(obj, startIndex, endIndex, scopeId) {
      if (!obj || typeof obj !== "object" || obj instanceof RegExp) {
        return ConstNode(startIndex, endIndex, scopeId, obj);
      } else if (__isArray(obj)) {
        return ArrayNode(startIndex, endIndex, scopeId, (function () {
          var _arr, _arr2, _i, _len, item;
          for (_arr = [], _arr2 = __toArray(obj), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            item = _arr2[_i];
            _arr.push(constifyObject(item, startIndex, endIndex, scopeId));
          }
          return _arr;
        }()));
      } else if (obj instanceof IdentNode && __num(obj.name.length) > 1 && obj.name.charCodeAt(0) === 36) {
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          obj.scopeId,
          IdentNode(obj.startIndex, obj.endIndex, obj.scopeId, "__wrap"),
          [
            IdentNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.name.substring(1)),
            ConstNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.scopeId)
          ]
        );
      } else if (obj instanceof CallNode && !obj.isNew && !obj.isApply && obj.func instanceof IdentNode && obj.func.name === "$") {
        if (obj.args.length !== 1 || obj.args[0] instanceof SpreadNode) {
          throw Error("Can only use $() in an AST if it has one argument.");
        }
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          obj.scopeId,
          IdentNode(obj.startIndex, obj.endIndex, obj.scopeId, "__wrap"),
          [
            obj.args[0],
            ConstNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.scopeId)
          ]
        );
      } else if (obj instanceof Node) {
        if (obj.constructor === Node) {
          throw Error("Cannot constify a raw node");
        }
        return CallNode(
          obj.startIndex,
          obj.endIndex,
          obj.scopeId,
          IdentNode(obj.startIndex, obj.endIndex, obj.scopeId, "__node"),
          [
            ConstNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.constructor.cappedName),
            ConstNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.startIndex),
            ConstNode(obj.startIndex, obj.endIndex, obj.scopeId, obj.endIndex)
          ].concat((function () {
            var _arr, _arr2, _i, _len, k;
            for (_arr = [], _arr2 = __toArray(obj.constructor.argNames), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              k = _arr2[_i];
              _arr.push(constifyObject(obj[k], obj.startIndex, obj.endIndex, obj.scopeId));
            }
            return _arr;
          }()))
        );
      } else {
        return ObjectNode(startIndex, endIndex, scopeId, (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns.call(obj, k)) {
              v = obj[k];
              _arr.push({
                key: ConstNode(startIndex, endIndex, scopeId, k),
                value: constifyObject(v, startIndex, endIndex, scopeId)
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
    _MacroHelper_prototype.wrap = function (value) {
      var _ref;
      if (__isArray(value)) {
        return BlockNode(0, 0, this.state.scope.id, value).reduce(this.state);
      } else if (value instanceof Node) {
        return value;
      } else if (value == null) {
        return NothingNode(0, 0, this.state.scope.id);
      } else if (value instanceof RegExp || (_ref = typeof value) === "string" || _ref === "boolean" || _ref === "number") {
        return ConstNode(0, 0, this.state.scope.id, value);
      } else {
        return value;
      }
    };
    _MacroHelper_prototype.node = function (type, startIndex, endIndex) {
      var args;
      args = __slice(arguments, 3);
      return Node[type].apply(Node, [startIndex, endIndex, this.state.scope.id].concat(__toArray(args))).reduce(this.state);
    };
    _MacroHelper_prototype.walk = function (node, func) {
      if (node != void 0 && !(node instanceof Node)) {
        throw TypeError("Expected node to be a Node or undefined or null, got " + __typeof(node));
      }
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (node != null) {
        return walk(node, func);
      } else {
        return node;
      }
    };
    _MacroHelper_prototype.hasFunc = function (node) {
      var FOUND, walker;
      if (this._hasFunc != null) {
        return this._hasFunc;
      } else {
        FOUND = {};
        walker = function (x) {
          if (x instanceof FunctionNode) {
            throw FOUND;
          } else {
            return x.walk(walker);
          }
        };
        try {
          walk(this.macroExpandAll(node), walker);
        } catch (e) {
          if (e !== FOUND) {
            throw e;
          }
          return this._hasFunc = true;
        }
        return this._hasFunc = false;
      }
    };
    _MacroHelper_prototype.isStatement = function (node) {
      node = this.macroExpand1(node);
      return node instanceof Node && node.isStatement();
    };
    _MacroHelper_prototype.isType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
      }
      return node.type(this.state).isSubsetOf(type);
    };
    _MacroHelper_prototype.hasType = function (node, name) {
      var type;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(Type, name)) {
        type = Type[name];
      }
      if (type == null || !(type instanceof Type)) {
        throw Error(name + " is not a known type name");
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
            return BlockNode(
              x.startIndex,
              x.endIndex,
              x.scopeId,
              __slice(nodes, 0, -1).concat([lastNode]),
              x.label
            );
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
            x.scopeId,
            x.test,
            whenTrue,
            whenFalse,
            x.label
          );
        } else {
          return x;
        }
      },
      Switch: function (x, func) {
        var _this, cases, defaultCase;
        _this = this;
        cases = map(x.cases, function (case_) {
          var body;
          if (case_.fallthrough) {
            return case_;
          } else {
            body = _this.mutateLast(case_.body, func);
            if (body !== case_.body) {
              return { node: case_.node, body: body, fallthrough: case_.fallthrough };
            } else {
              return case_;
            }
          }
        });
        defaultCase = this.mutateLast(x.defaultCase || this.noop(), func);
        if (cases !== x.cases || defaultCase !== x.defaultCase) {
          return SwitchNode(
            x.startIndex,
            x.endIndex,
            x.scopeId,
            x.node,
            cases,
            defaultCase,
            x.label
          );
        } else {
          return x;
        }
      },
      TmpWrapper: function (x, func) {
        var node;
        node = this.mutateLast(x.node, func);
        if (node !== x.node) {
          return TmpWrapperNode(
            x.startIndex,
            x.endIndex,
            x.scopeId,
            node,
            x.tmps
          );
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
    _MacroHelper_prototype.mutateLast = function (node, func, includeNoop) {
      var _ref;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (!node || typeof node !== "object" || node instanceof RegExp) {
        return node;
      }
      if (!(node instanceof Node)) {
        throw Error("Unexpected type to mutate-last through: " + __typeof(node));
      }
      if (!__owns.call(mutators, node.constructor.cappedName) || includeNoop && node instanceof NothingNode) {
        if ((_ref = func(node)) != null) {
          return _ref;
        } else {
          return node;
        }
      } else {
        return mutators[node.constructor.cappedName].call(this, node, func);
      }
    };
    _MacroHelper_prototype.canMutateLast = function (node) {
      return node instanceof Node && __owns.call(mutators, node.constructor.cappedName);
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
    for (i = 0, _len = rules.length; i < _len; ++i) {
      rule = rules[i];
      if (i > 0) {
        name.push(" | ");
      }
      name.push(rule.parserName || "<unknown>");
    }
    name.push(")");
    return named(name.join(""), function (o) {
      var _i, _len, result, rule;
      for (_i = 0, _len = rules.length; _i < _len; ++_i) {
        rule = rules[_i];
        result = rule(o);
        if (result) {
          return result;
        }
      }
      return false;
    });
  }
  AnyObjectLiteral = named("AnyObjectLiteral", function (o) {
    return UnclosedObjectLiteral(o) || ObjectLiteral(o) || IndentedUnclosedObjectLiteral(o);
  });
  AnyArrayLiteral = named("AnyArrayLiteral", function (o) {
    return ArrayLiteral(o) || IndentedUnclosedArrayLiteral(o);
  });
  MacroHolder = (function () {
    var _MacroHolder_prototype;
    function MacroHolder() {
      var _this;
      _this = this instanceof MacroHolder ? this : __create(_MacroHolder_prototype);
      _this.byName = {};
      _this.byId = [];
      _this.byLabel = {};
      _this.typeById = [];
      _this.operatorNames = {};
      _this.binaryOperators = [];
      _this.assignOperators = [];
      _this.prefixUnaryOperators = [];
      _this.postfixUnaryOperators = [];
      _this.serialization = {};
      _this.syntaxes = {
        Logic: preventUnclosedObjectLiteral(Logic),
        Expression: Expression,
        Assignment: Assignment,
        ExpressionOrAssignment: ExpressionOrAssignment,
        FunctionDeclaration: FunctionDeclaration,
        Statement: Statement,
        Body: Body,
        Identifier: Identifier,
        SimpleAssignable: SimpleAssignable,
        Parameter: Parameter,
        ObjectLiteral: AnyObjectLiteral,
        ArrayLiteral: AnyArrayLiteral,
        DedentedBody: DedentedBody,
        ObjectKey: ObjectKey,
        Type: TypeReference,
        NoSpace: NoSpace
      };
      return _this;
    }
    _MacroHolder_prototype = MacroHolder.prototype;
    MacroHolder.displayName = "MacroHolder";
    _MacroHolder_prototype.clone = function () {
      var clone;
      clone = MacroHolder();
      clone.byName = copy(this.byName);
      clone.byId = this.byId.slice();
      clone.byLabel = copy(this.byLabel);
      clone.typeById = this.typeById.slice();
      clone.operatorNames = copy(this.operatorNames);
      clone.binaryOperators = this.binaryOperators.slice();
      clone.assignOperators = this.assignOperators.slice();
      clone.prefixUnaryOperators = this.prefixUnaryOperators.slice();
      clone.postfixUnaryOperators = this.postfixUnaryOperators.slice();
      clone.serialization = copy(this.serialization);
      clone.syntaxes = copy(this.syntaxes);
      return clone;
    };
    _MacroHolder_prototype.getByName = function (name) {
      var _ref;
      if (__owns.call(_ref = this.byName, name)) {
        return _ref[name];
      }
    };
    _MacroHolder_prototype.getOrAddByName = function (name) {
      var _this, byName, m, token;
      _this = this;
      byName = this.byName;
      if (__owns.call(byName, name)) {
        return byName[name];
      } else {
        token = macroName(name);
        m = (function () {
          var _backend;
          _backend = named("<" + __strnum(name) + " macro>", function (o) {
            var _arr, _i, _len, item, result;
            for (_arr = __toArray(m.data), _i = 0, _len = _arr.length; _i < _len; ++_i) {
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
    _MacroHolder_prototype.getOrAddByNames = function (names) {
      var _arr, _i, _len, name;
      if (!__isArray(names)) {
        throw TypeError("Expected names to be an Array, got " + __typeof(names));
      } else {
        for (_i = 0, _len = names.length; _i < _len; ++_i) {
          if (typeof names[_i] !== "string") {
            throw TypeError("Expected names[" + _i + "] to be a String, got " + __typeof(names[_i]));
          }
        }
      }
      for (_arr = [], _i = 0, _len = names.length; _i < _len; ++_i) {
        name = names[_i];
        _arr.push(this.getOrAddByName(name));
      }
      return _arr;
    };
    _MacroHolder_prototype.setTypeById = function (id, type) {
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      this.typeById[id] = type;
    };
    _MacroHolder_prototype.getTypeById = function (id) {
      return this.typeById[id];
    };
    _MacroHolder_prototype.getById = function (id) {
      var byId;
      byId = this.byId;
      if (__num(id) >= 0 && __lt(id, byId.length)) {
        return byId[id];
      }
    };
    _MacroHolder_prototype.addMacro = function (m, macroId, type) {
      var byId;
      if (macroId == null) {
        macroId = void 0;
      } else if (typeof macroId !== "number") {
        throw TypeError("Expected macroId to be a Number or undefined, got " + __typeof(macroId));
      }
      if (type == null) {
        type = void 0;
      } else if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type or undefined, got " + __typeof(type));
      }
      byId = this.byId;
      if (macroId != null) {
        if (__owns.call(byId, macroId)) {
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
    _MacroHolder_prototype.replaceMacro = function (id, m, type) {
      var byId;
      if (type == null) {
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
    _MacroHolder_prototype.hasMacroOrOperator = function (name) {
      return __owns.call(this.byName, name) || __owns.call(this.operatorNames, name);
    };
    _MacroHolder_prototype.getMacroAndOperatorNames = function () {
      var _obj, name, names;
      names = [];
      _obj = this.byName;
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          names.push(name);
        }
      }
      _obj = this.operatorNames;
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          names.push(name);
        }
      }
      return names;
    };
    _MacroHolder_prototype.addBinaryOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _ref2, _this, binaryOperators, data, op, precedence;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      precedence = Number(options.precedence) || 0;
      if ((_ref = (_ref2 = this.binaryOperators)[precedence]) != null) {
        binaryOperators = _ref;
      } else {
        binaryOperators = _ref2[precedence] = [];
      }
      data = {
        rule: oneOf((function () {
          var _arr, _arr2, _i, _len, op;
          for (_arr = [], _arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
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
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _MacroHolder_prototype.getByLabel = function (label) {
      var _ref;
      if (__owns.call(_ref = this.byLabel, label)) {
        return _ref[label];
      }
    };
    _MacroHolder_prototype.addByLabel = function (label, data) {
      if (typeof label !== "string") {
        throw TypeError("Expected label to be a String, got " + __typeof(label));
      }
      return this.byLabel[label] = data;
    };
    _MacroHolder_prototype.addAssignOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _this, data, op;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      data = {
        rule: oneOf((function () {
          var _arr, _arr2, _i, _len, op;
          for (_arr = [], _arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
            _arr.push(wordOrSymbol(op));
          }
          return _arr;
        }())),
        func: m
      };
      this.assignOperators.push(data);
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _MacroHolder_prototype.addUnaryOperator = function (operators, m, options, macroId) {
      var _arr, _i, _ref, _this, data, op, store;
      _this = this;
      for (_arr = __toArray(operators), _i = _arr.length; _i--; ) {
        op = _arr[_i];
        this.operatorNames[op] = true;
      }
      if (options.postfix) {
        store = this.postfixUnaryOperators;
      } else {
        store = this.prefixUnaryOperators;
      }
      data = {
        rule: oneOf((function () {
          var _arr, _arr2, _i, _len, op, rule;
          for (_arr = [], _arr2 = __toArray(operators), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            op = _arr2[_i];
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
        standalone: __owns.call(!options, "standalone") || !!options.standalone
      };
      store.push(data);
      if (options.label) {
        this.addByLabel(options.label, data);
      }
      return this.addMacro(m, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
    };
    _MacroHolder_prototype.addSerializedHelper = function (name, helper, type, dependencies) {
      var _ref, _ref2, helpers;
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if ((_ref = (_ref2 = this.serialization).helpers) != null) {
        helpers = _ref;
      } else {
        helpers = _ref2.helpers = {};
      }
      helpers[name] = { helper: helper, type: type, dependencies: dependencies };
    };
    _MacroHolder_prototype.addMacroSerialization = function (serialization) {
      var _ref, _ref2, _ref3, byType, obj;
      if (!__isObject(serialization)) {
        throw TypeError("Expected serialization to be an Object, got " + __typeof(serialization));
      }
      if (typeof serialization.type !== "string") {
        throw Error("Expected a string type");
      }
      obj = copy(serialization);
      delete obj.type;
      if ((_ref = (_ref2 = this.serialization)[_ref3 = serialization.type]) != null) {
        byType = _ref;
      } else {
        byType = _ref2[_ref3] = [];
      }
      byType.push(obj);
    };
    _MacroHolder_prototype.addSyntax = function (name, value) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (typeof value !== "function") {
        throw TypeError("Expected value to be a Function, got " + __typeof(value));
      }
      if (__owns.call(this.syntaxes, name)) {
        throw Error("Cannot override already-defined syntax: " + name);
      }
      this.syntaxes[name] = value;
    };
    _MacroHolder_prototype.hasSyntax = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      return __owns.call(this.syntaxes, name);
    };
    _MacroHolder_prototype.getSyntax = function (name) {
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (__owns.call(this.syntaxes, name)) {
        return this.syntaxes[name];
      } else {
        throw Error("Unknown syntax: " + name);
      }
    };
    _MacroHolder_prototype.serialize = function () {
      return JSON.stringify(this.serialization);
    };
    _MacroHolder_prototype.deserialize = function (data) {
      var _obj, _ref, ast, dependencies, helper, name, translator, type;
      translator = require("./translator");
      ast = require("./ast");
      _obj = (_ref = __owns.call(data, "helpers") ? data.helpers : void 0) != null ? _ref : {};
      for (name in _obj) {
        if (__owns.call(_obj, name)) {
          helper = (_ref = _obj[name]).helper;
          type = _ref.type;
          dependencies = _ref.dependencies;
          translator.defineHelper(name, ast.fromJSON(helper), Type.fromJSON(type), dependencies);
        }
      }
      State("", this).deserializeMacros(data);
    };
    return MacroHolder;
  }());
  Node = (function () {
    var _Node_prototype;
    function Node() {
      var _this;
      _this = this instanceof Node ? this : __create(_Node_prototype);
      throw Error("Node should not be instantiated directly");
    }
    _Node_prototype = Node.prototype;
    Node.displayName = "Node";
    _Node_prototype.type = function () {
      return Type.any;
    };
    _Node_prototype.walk = function (f) {
      return this;
    };
    _Node_prototype.walkAsync = function (f, callback) {
      return callback(null, this);
    };
    _Node_prototype.cacheable = true;
    _Node_prototype.scope = function (o) {
      return o.getScope(this.scopeId);
    };
    _Node_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return BlockNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        [this],
        label
      );
    };
    _Node_prototype._reduce = function (o) {
      return this.walk(function (node) {
        return node.reduce(o);
      });
    };
    _Node_prototype.reduce = function (o) {
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
    _Node_prototype.isConst = function () {
      return false;
    };
    _Node_prototype.constValue = function () {
      throw Error("Not a const: " + (typeof node === "undefined" ? "Undefined" : __typeof(node)));
    };
    _Node_prototype.isNoop = function (o) {
      return this.reduce(o)._isNoop(o);
    };
    _Node_prototype._isNoop = function (o) {
      return false;
    };
    _Node_prototype.isStatement = function () {
      return false;
    };
    _Node_prototype.rescope = function (newScopeId, o) {
      var oldScopeId;
      oldScopeId = this.scopeId;
      if (oldScopeId === newScopeId) {
        return this;
      } else {
        this.scopeId = newScopeId;
        return this.walk(function (node) {
          var nodeScope, parentId;
          if (node.scopeId === oldScopeId) {
            return node.rescope(newScopeId, o);
          } else if (node.scopeId !== newScopeId) {
            nodeScope = node.scope(o);
            if (nodeScope.parent != null) {
              parentId = nodeScope.parent.id;
              if (parentId === oldScopeId) {
                nodeScope.reparent(o.getScope(newScopeId));
              }
            }
            return node;
          } else {
            return node;
          }
        });
      }
    };
    _Node_prototype.doWrap = function (o) {
      var innerScope;
      if (this.isStatement()) {
        innerScope = o.cloneScope(o.getScope(this.scopeId));
        return CallNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          FunctionNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            [],
            this.rescope(innerScope.id, o),
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
  function inspectHelper(depth, name) {
    var _arr, _i, _len, arg, args, d, found, hasLarge, parts;
    args = __slice(arguments, 2);
    if (depth != null) {
      d = __num(depth) - 1;
    } else {
      d = null;
    }
    found = false;
    for (_i = args.length; _i--; ) {
      arg = args[_i];
      if (!arg || arg instanceof NothingNode || __isArray(arg) && arg.length === 0) {
        args.pop();
      } else {
        break;
      }
    }
    for (_arr = [], _i = 0, _len = args.length; _i < _len; ++_i) {
      arg = args[_i];
      _arr.push(inspect(arg, null, d));
    }
    parts = _arr;
    hasLarge = (function () {
      var _i, _len, part;
      for (_i = 0, _len = parts.length; _i < _len; ++_i) {
        part = parts[_i];
        if (parts.length > 50 || part.indexOf("\n") !== -1) {
          return true;
        }
      }
      return false;
    }());
    if (hasLarge) {
      parts = (function () {
        var _arr, _i, _len, part;
        for (_arr = [], _i = 0, _len = parts.length; _i < _len; ++_i) {
          part = parts[_i];
          _arr.push("  " + __strnum(part.split("\n").join("\n  ")));
        }
        return _arr;
      }());
      return __strnum(name) + "(\n" + __strnum(parts.join(",\n")) + ")";
    } else {
      return __strnum(name) + "(" + __strnum(parts.join(", ")) + ")";
    }
  }
  Scope = (function () {
    var _Scope_prototype;
    function Scope(id, parent) {
      var _this;
      _this = this instanceof Scope ? this : __create(_Scope_prototype);
      if (parent == null) {
        parent = null;
      } else if (!(parent instanceof Scope)) {
        throw TypeError("Expected parent to be a Scope or null, got " + __typeof(parent));
      }
      _this.id = id;
      _this.parent = parent;
      _this.variables = {};
      _this.tmps = [];
      return _this;
    }
    _Scope_prototype = Scope.prototype;
    Scope.displayName = "Scope";
    _Scope_prototype.clone = function (id) {
      return Scope(id, this);
    };
    _Scope_prototype.reparent = function (parent) {
      if (!(parent instanceof Scope)) {
        throw TypeError("Expected parent to be a Scope, got " + __typeof(parent));
      }
      if (parent === this) {
        throw Error("Trying to reparent to own scope");
      }
      this.parent = parent;
    };
    _Scope_prototype.add = function (ident, isMutable, type) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (!(type instanceof Type)) {
        throw TypeError("Expected type to be a Type, got " + __typeof(type));
      }
      if (ident instanceof TmpNode) {
        this.tmps[ident.id] = { isMutable: isMutable, type: type };
      } else {
        this.variables[ident.name] = { isMutable: isMutable, type: type };
      }
    };
    _Scope_prototype.owns = function (ident) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (ident instanceof TmpNode) {
        return __owns.call(this.tmps, ident.id);
      } else {
        return __owns.call(this.variables, ident.name);
      }
    };
    _Scope_prototype.has = function (ident) {
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (this.owns(ident)) {
        return true;
      } else if (this.parent != null) {
        return this.parent.has(ident);
      } else {
        return false;
      }
    };
    function get(ident) {
      if (ident instanceof TmpNode) {
        if (__owns.call(this.tmps, ident.id)) {
          return this.tmps[ident.id];
        } else if (this.parent != null) {
          return get.call(this.parent, ident);
        }
      } else if (__owns.call(this.variables, ident.name)) {
        return this.variables[ident.name];
      } else if (this.parent != null) {
        return get.call(this.parent, ident);
      }
    }
    _Scope_prototype.isMutable = function (ident) {
      var data;
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      data = get.call(this, ident);
      if (data) {
        return data.isMutable;
      } else {
        return false;
      }
    };
    _Scope_prototype.type = function (ident) {
      var data;
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      data = get.call(this, ident);
      if (data) {
        return data.type;
      } else {
        return Type.any;
      }
    };
    return Scope;
  }());
  State = (function () {
    var _State_prototype, ASSIGN_OPERATOR, BINARY_OPERATOR, DEFINE_SYNTAX, macroDeserializers, macroSyntaxConstLiterals, macroSyntaxTypes, UNARY_OPERATOR;
    function State(data, macros, options, index, line, failures, cache, indent, currentMacro, preventFailures, knownScopes, scope) {
      var _this;
      _this = this instanceof State ? this : __create(_State_prototype);
      if (macros == null) {
        macros = MacroHolder();
      }
      if (options == null) {
        options = {};
      }
      if (index == null) {
        index = 0;
      }
      if (line == null) {
        line = 1;
      }
      if (failures == null) {
        failures = FailureManager();
      }
      if (cache == null) {
        cache = [];
      }
      if (indent == null) {
        indent = Stack(1);
      }
      if (currentMacro == null) {
        currentMacro = null;
      }
      if (preventFailures == null) {
        preventFailures = 0;
      }
      if (knownScopes == null) {
        knownScopes = [];
      }
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
      _this.knownScopes = knownScopes;
      if (!scope) {
        _this.scope = Scope(knownScopes.length);
        knownScopes.push(_this.scope);
      } else {
        _this.scope = scope;
      }
      _this.expandingMacros = false;
      return _this;
    }
    _State_prototype = State.prototype;
    State.displayName = "State";
    _State_prototype.clone = function (scope) {
      if (scope == null) {
        scope = void 0;
      } else if (!(scope instanceof Scope)) {
        throw TypeError("Expected scope to be a Scope or undefined, got " + __typeof(scope));
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
        this.preventFailures,
        this.knownScopes,
        scope || this.scope
      );
    };
    _State_prototype.cloneScope = function (outerScope) {
      var scope;
      scope = (outerScope || this.scope).clone(this.knownScopes.length);
      this.knownScopes.push(scope);
      return scope;
    };
    _State_prototype.getScope = function (id) {
      var _this;
      _this = this;
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      return this.knownScopes[id] || (function () {
        throw Error("Unknown scope: " + id);
      }());
    };
    _State_prototype.update = function (clone) {
      this.index = clone.index;
      this.line = clone.line;
      this.indent = clone.indent.clone();
      this.macros = clone.macros;
    };
    _State_prototype.fail = function (message) {
      if (!this.preventFailures) {
        this.failures.add(message, this.index, this.line);
      }
    };
    _State_prototype.preventFail = function () {
      ++this.preventFailures;
    };
    _State_prototype.unpreventFail = function () {
      --this.preventFailures;
    };
    _State_prototype.error = function (message) {
      throw ParserError(message, this.data, this.index, this.line);
    };
    _State_prototype.enterMacro = function (names, func) {
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
    _State_prototype.defineHelper = function (i, name, value) {
      var _ref, dependencies, helper, node, translator, type;
      if (!(name instanceof IdentNode)) {
        throw TypeError("Expected name to be an IdentNode, got " + __typeof(name));
      }
      if (!(value instanceof Node)) {
        throw TypeError("Expected value to be a Node, got " + __typeof(value));
      }
      translator = require("./translator");
      node = this.macroExpandAll(value).reduce(this);
      type = node.type(this);
      helper = (_ref = translator.defineHelper(name, node, type)).helper;
      dependencies = _ref.dependencies;
      if (this.options.serializeMacros) {
        this.macros.addSerializedHelper(name.name, helper, type, dependencies);
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
            for (_arr = [], _arr2 = __toArray(asType.choices), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
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
      var _arr, _arr2, _i, _len, ident, param, value;
      for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        if (param.isConst()) {
          _arr.push({ type: "const", value: param.constValue() });
        } else if (param instanceof SyntaxParamNode) {
          ident = param.ident;
          if (ident instanceof IdentNode) {
            value = { type: "ident", name: ident.name };
          } else if (ident instanceof ThisNode) {
            value = { type: "this" };
          } else {
            throw Error();
          }
          if (param.asType) {
            value.asType = serializeParamType(param.asType);
          }
          _arr.push(value);
        } else {
          throw Error();
        }
      }
      return _arr;
    }
    function deserializeParamType(asType, scopeId) {
      if (asType == null) {
        return;
      }
      switch (asType.type) {
      case "ident":
        return IdentNode(0, 0, scopeId, asType.name);
      case "sequence":
        return SyntaxSequenceNode(0, 0, scopeId, deserializeParams(asType.items, scopeId));
      case "choice":
        return SyntaxChoiceNode(0, 0, scopeId, (function () {
          var _arr, _arr2, _i, _len, choice;
          for (_arr = [], _arr2 = __toArray(asType.choices), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            choice = _arr2[_i];
            _arr.push(deserializeParamType(choice, scopeId));
          }
          return _arr;
        }()));
      case "const":
        return ConstNode(0, 0, scopeId, asType.value);
      case "many":
        return SyntaxManyNode(
          0,
          0,
          scopeId,
          deserializeParamType(asType.inner, scopeId),
          asType.multiplier
        );
      default: throw Error("Unknown as-type: " + String(asType.type));
      }
    }
    function deserializeParams(params, scopeId) {
      var _arr, _arr2, _i, _len, node, param;
      for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        param = _arr2[_i];
        if (param.type === "const") {
          _arr.push(ConstNode(0, 0, scopeId, param.value));
        } else {
          if (param.type === "ident") {
            node = IdentNode(0, 0, scopeId, param.name);
          } else if (param.type === "this") {
            node = ThisNode(0, 0, scopeId);
          } else {
            throw Error("Unknown param: " + String(param.type));
          }
          _arr.push(SyntaxParamNode(
            0,
            0,
            scopeId,
            node,
            deserializeParamType(param.asType, scopeId)
          ));
        }
      }
      return _arr;
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
          for (_arr = [], _arr2 = __toArray(param.choices), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
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
        return (__owns.call(macroSyntaxConstLiterals, string) ? macroSyntaxConstLiterals[string] : void 0) || wordOrSymbol(string);
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
              while (true) {
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
              while (true) {
                item = calced(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              if (result.length >= 1) {
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
                  return _missing(void 0, o, index, line);
                } else {
                  o.update(clone);
                  return result;
                }
              }
            );
          }());
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
          sequence.push((__owns.call(macroSyntaxConstLiterals, string) ? macroSyntaxConstLiterals[string] : void 0) || wordOrSymbol(string));
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
            type = IdentNode(0, 0, -1, "Expression");
          }
          sequence.push([
            key,
            calcParam.call(this, type)
          ]);
        } else {
          this.error("Unexpected parameter type: " + __typeof(param));
        }
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
              var _arr, _arr2, _i, _len, param;
              for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
                param = _arr2[_i];
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
        var _arr, _arr2, _i, _len, _this, funcParams, handler, param, serialization, state;
        _this = this;
        for (_arr = [], _arr2 = __toArray(params), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          param = _arr2[_i];
          if (param instanceof SyntaxParamNode) {
            _arr.push({
              key: this["const"](index, param.ident.name),
              value: this.param(
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
        funcParams = _arr;
        serialization = void 0;
        state = this;
        if (body != null) {
          handler = (function () {
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
          }());
        } else {
          handler = function (args) {
            var rest;
            rest = __slice(arguments, 1);
            return reduceObject(state, args);
          };
        }
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
              rest = __slice(arguments, 1);
              result = inner.apply(this, [reduceObject(state, args)].concat(__toArray(rest)));
              if (args.inverted) {
                return UnaryNode(
                  result.startIndex,
                  result.endIndex,
                  result.scopeId,
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
            handleParams.call(_this, deserializeParams(params, _this.scope.id)),
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
            handleParams.call(_this, deserializeParams(params, _this.scope.id)),
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
                return UnaryNode(
                  result.startIndex,
                  result.endIndex,
                  result.scopeId,
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
    function removeNoops(obj) {
      var _arr, _arr2, _i, _len, item, k, result, v;
      if (Array.isArray(obj)) {
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
      } else if (obj && typeof obj === "object" && !(obj instanceof RegExp)) {
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
    _State_prototype.startMacroSyntax = function (index, params, options) {
      var _arr, _f, _i, _len, _ref, macroId, macros, rule;
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
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
            removeNoops(x),
            _position.peek(),
            _inGenerator.peek()
          );
        } else {
          throw Error("Cannot use macro until fully defined");
        }
      }
      for (_arr = __toArray(macros.getOrAddByNames(this.currentMacro)), _i = 0, _len = _arr.length, _f = function (m) {
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
                } else {
                  return mutator(result, o, index, line);
                }
              }
            );
          }());
        }()));
      }; _i < _len; ++_i) {
        _f.call(this, _arr[_i]);
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
      function mutator(x, o, i, line, scopeId) {
        var clone, macroHelper, result, tmps, walker;
        if (_inAst.peek() || !o.expandingMacros) {
          return o.macroAccess(
            i,
            macroId,
            line,
            removeNoops(x),
            _position.peek(),
            _inGenerator.peek()
          );
        } else {
          clone = o.clone(o.getScope(scopeId));
          macroHelper = MacroHelper(clone, i, _position.peek(), _inGenerator.peek());
          result = (function () {
            try {
              return handler.call(
                macroHelper,
                removeNoops(x),
                __bind(macroHelper, "wrap"),
                __bind(macroHelper, "node")
              );
            } catch (e) {
              if (e instanceof MacroError) {
                e.line = line;
                throw e;
              } else {
                throw MacroError(e, o.data, i, line);
              }
            }
          }());
          o.update(clone);
          if (result instanceof Node) {
            walker = function (node) {
              if (node instanceof MacroAccessNode) {
                node.line = line;
              }
              return node.walk(walker);
            };
            result = walker(result.reduce(_this));
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
              } else {
                return mutator(result, o, index, line);
              }
            }
          ));
          return macros.addMacro(mutator, macroId, options.type != null && __owns.call(Type, _ref = options.type) ? Type[_ref] : void 0);
        default:
          assert(rule);
          for (_arr = __toArray(macros.getOrAddByNames(_this.currentMacro)), _i = 0, _len = _arr.length, _f = function (m) {
            var _this;
            _this = this;
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
                    } else {
                      return mutator(result, o, index, line);
                    }
                  }
                );
              }());
            }()));
          }; _i < _len; ++_i) {
            _f.call(_this, _arr[_i]);
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
    _State_prototype.macroSyntax = function (index, type, params, options, body) {
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
    _State_prototype.defineBinaryOperator = function (index, operators, options, body) {
      var _i, _len, _this;
      _this = this;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = 0, _len = operators.length; _i < _len; ++_i) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected operators[" + _i + "] to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (!__isObject(options)) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
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
    _State_prototype.defineAssignOperator = function (index, operators, options, body) {
      var _i, _len, _this;
      _this = this;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = 0, _len = operators.length; _i < _len; ++_i) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected operators[" + _i + "] to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (!__isObject(options)) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
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
    _State_prototype.defineUnaryOperator = function (index, operators, options, body) {
      var _i, _len, _this;
      _this = this;
      if (typeof index !== "number") {
        throw TypeError("Expected index to be a Number, got " + __typeof(index));
      }
      if (!__isArray(operators)) {
        throw TypeError("Expected operators to be an Array, got " + __typeof(operators));
      } else {
        for (_i = 0, _len = operators.length; _i < _len; ++_i) {
          if (typeof operators[_i] !== "string") {
            throw TypeError("Expected operators[" + _i + "] to be a String, got " + __typeof(operators[_i]));
          }
        }
      }
      if (!__isObject(options)) {
        throw TypeError("Expected options to be an Object, got " + __typeof(options));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
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
    _State_prototype.defineSyntax = function (index, name, params, body) {
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
    _State_prototype.deserializeMacros = function (data) {
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
    _State_prototype.macroExpand1 = function (node) {
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
            return _this.macros.getById(node.id)(
              node.data,
              _this,
              node.startIndex,
              node.line,
              node.scopeId
            );
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
    _State_prototype.macroExpandAllAsync = function (node, callback) {
      var _this, startTime;
      _this = this;
      startTime = new Date().getTime();
      function walker(node, callback) {
        var expanded;
        if (__num(new Date().getTime()) - __num(startTime) > 17) {
          return nextTick(function () {
            startTime = new Date().getTime();
            return walker(node, callback);
          });
        }
        if (node._macroExpandAlled != null) {
          return callback(null, node._macroExpandAlled);
        } else if (!(node instanceof MacroAccessNode)) {
          return node.walkAsync(walker, function (_e, walked) {
            if (_e != null) {
              return callback(_e);
            }
            walked._macroExpanded = walked;
            return callback(null, walked);
          });
        } else {
          expanded = void 0;
          try {
            expanded = _this.macroExpand1(node);
          } catch (e) {
            return callback(e);
          }
          if (!(expanded instanceof Node)) {
            return callback(null, node._macroExpandAlled = expanded);
          }
          return walker(expanded, function (_e, walked) {
            if (_e != null) {
              return callback(_e);
            }
            return callback(null, expanded._macroExpandAlled = walked._macroExpanded = walked);
          });
        }
      }
      return walker(node, callback);
    };
    _State_prototype.macroExpandAll = function (node, callback) {
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
        var args;
        args = __slice(arguments, 1);
        return type.apply(void 0, [index, this.index, this.scope.id].concat(__toArray(args)));
      };
    };
    return State;
  }());
  Node.Access = AccessNode = (function (Node) {
    var _AccessNode_prototype, _Node_prototype;
    function AccessNode(startIndex, endIndex, scopeId, parent, child) {
      var _this;
      _this = this instanceof AccessNode ? this : __create(_AccessNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(parent instanceof Node)) {
        throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
      }
      if (!(child instanceof Node)) {
        throw TypeError("Expected child to be a Node, got " + __typeof(child));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.child = child;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AccessNode_prototype = AccessNode.prototype = __create(_Node_prototype);
    _AccessNode_prototype.constructor = AccessNode;
    AccessNode.displayName = "AccessNode";
    AccessNode.cappedName = "Access";
    AccessNode.argNames = ["parent", "child"];
    State.addNodeFactory("access", AccessNode);
    _AccessNode_prototype.type = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var child, childType, childValue, isString, parentType;
          parentType = _this.parent.type(o);
          isString = parentType.isSubsetOf(Type.string);
          if (isString || parentType.isSubsetOf(Type.arrayLike)) {
            child = o.macroExpand1(_this.child).reduce(o);
            if (child.isConst()) {
              childValue = child.constValue();
              if (childValue === "length") {
                return Type.number;
              } else if (typeof childValue === "number") {
                if (__num(childValue) >= 0 && __num(childValue) % 1 === 0) {
                  if (isString) {
                    return Type.string.union(Type["undefined"]);
                  } else if (parentType.subtype) {
                    return parentType.subtype.union(Type["undefined"]);
                  } else {
                    return Type.any;
                  }
                } else {
                  return Type["undefined"];
                }
              }
            } else {
              childType = child.type(o);
              if (childType.isSubsetOf(Type.number)) {
                if (isString) {
                  return Type.string.union(Type["undefined"]);
                } else if (parentType.subtype) {
                  return parentType.subtype.union(Type["undefined"]);
                } else {
                  return Type.any;
                }
              }
            }
          } else if (parentType.isSubsetOf(Type.object) && typeof parentType.value === "function") {
            child = o.macroExpand1(_this.child).reduce(o);
            if (child.isConst()) {
              return parentType.value(String(child.constValue()));
            }
          }
          return Type.any;
        }());
      } else {
        return _ref;
      }
    };
    _AccessNode_prototype._reduce = function (o) {
      var _ref, args, child, cValue, end, hasEnd, hasStep, inclusive, parent, pValue, start, step, value;
      parent = this.parent.reduce(o).doWrap(o);
      child = this.child.reduce(o).doWrap(o);
      if (parent.isConst() && child.isConst()) {
        pValue = parent.constValue();
        cValue = child.constValue();
        if (cValue in Object(pValue)) {
          value = pValue[cValue];
          if (value === null || value instanceof RegExp || (_ref = typeof value) === "string" || _ref === "number" || _ref === "boolean" || _ref === "undefined") {
            return ConstNode(this.startIndex, this.endIndex, this.scopeId, value);
          }
        }
      }
      if (child instanceof CallNode && child.func instanceof IdentNode && child.func.name === "__range") {
        start = (_ref = child.args)[0];
        end = _ref[1];
        step = _ref[2];
        inclusive = _ref[3];
        hasStep = !step.isConst() || step.constValue() !== 1;
        if (!hasStep) {
          if (inclusive.isConst()) {
            if (inclusive.constValue()) {
              end = end.isConst() && typeof end.constValue() === "number" ? ConstNode(end.startIndex, end.endIndex, end.scopeId, __num(end.constValue()) + 1 || 1/0)
                : BinaryNode(
                  end.startIndex,
                  end.endIndex,
                  end.scopeId,
                  BinaryNode(
                    end.startIndex,
                    end.endIndex,
                    end.scopeId,
                    end,
                    "+",
                    ConstNode(inclusive.startIndex, inclusive.endIndex, inclusive.scopeId, 1)
                  ),
                  "||",
                  ConstNode(end.startIndex, end.endIndex, end.scopeId, 1/0)
                );
            }
          } else {
            end = IfNode(
              end.startIndex,
              end.endIndex,
              end.scopeId,
              inclusive,
              BinaryNode(
                end.startIndex,
                end.endIndex,
                end.scopeId,
                BinaryNode(
                  end.startIndex,
                  end.endIndex,
                  end.scopeId,
                  end,
                  "+",
                  ConstNode(inclusive.startIndex, inclusive.endIndex, inclusive.scopeId, 1)
                ),
                "||",
                ConstNode(end.startIndex, end.endIndex, end.scopeId, 1/0)
              ),
              end
            );
          }
        }
        args = [parent];
        hasEnd = !end.isConst() || (_ref = end.constValue()) !== void 0 && _ref !== 1/0;
        if (!start.isConst() || start.constValue() !== 0 || hasEnd || hasStep) {
          args.push(start);
        }
        if (hasEnd || hasStep) {
          args.push(end);
        }
        if (hasStep) {
          args.push(step);
          if (!inclusive.isConst() || inclusive.constValue()) {
            args.push(inclusive);
          }
        }
        return CallNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          IdentNode(this.startIndex, this.endIndex, this.scopeId, hasStep ? "__sliceStep" : "__slice"),
          args,
          false,
          false
        ).reduce(o);
      } else if (parent !== this.parent || child !== this.child) {
        return AccessNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          parent,
          child
        );
      } else {
        return this;
      }
    };
    _AccessNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.parent.isNoop(o) && this.child.isNoop(o);
      } else {
        return _ref;
      }
    };
    _AccessNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "AccessNode", this.parent, this.child);
    };
    _AccessNode_prototype.walk = function (f) {
      var child, parent;
      parent = f(this.parent);
      child = f(this.child);
      if (parent !== this.parent || child !== this.child) {
        return AccessNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          parent,
          child
        );
      } else {
        return this;
      }
    };
    _AccessNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.parent, function (_e, parent) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.child, function (_e2, child) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, parent !== _this.parent || child !== _this.child
            ? AccessNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              parent,
              child
            )
            : _this);
        });
      });
    };
    return AccessNode;
  }(Node));
  Node.AccessMulti = AccessMultiNode = (function (Node) {
    var _AccessMultiNode_prototype, _Node_prototype;
    function AccessMultiNode(startIndex, endIndex, scopeId, parent, elements) {
      var _i, _len, _this;
      _this = this instanceof AccessMultiNode ? this : __create(_AccessMultiNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(parent instanceof Node)) {
        throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
      }
      if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Node)) {
            throw TypeError("Expected elements[" + _i + "] to be a Node, got " + __typeof(elements[_i]));
          }
        }
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.parent = parent;
      _this.elements = elements;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AccessMultiNode_prototype = AccessMultiNode.prototype = __create(_Node_prototype);
    _AccessMultiNode_prototype.constructor = AccessMultiNode;
    AccessMultiNode.displayName = "AccessMultiNode";
    AccessMultiNode.cappedName = "AccessMulti";
    AccessMultiNode.argNames = ["parent", "elements"];
    State.addNodeFactory("accessMulti", AccessMultiNode);
    _AccessMultiNode_prototype.type = function () {
      return Type.array;
    };
    _AccessMultiNode_prototype._reduce = function (o) {
      var _this, parent, result, setParent, tmp, tmpIds;
      _this = this;
      parent = this.parent.reduce(o);
      setParent = parent;
      tmpIds = [];
      if (parent.cacheable) {
        tmp = o.tmp(this.startIndex, getTmpId(), "ref", parent.type(o));
        tmpIds.push(tmp.id);
        setParent = o.assign(i, tmp, "=", parent.doWrap(o));
        parent = tmp;
      }
      result = o.array(this.startIndex, (function () {
        var _arr, _arr2, _len, element, j;
        for (_arr = [], _arr2 = __toArray(_this.elements), j = 0, _len = _arr2.length; j < _len; ++j) {
          element = _arr2[j];
          _arr.push(o.access(
            _this.startIndex,
            j === 0 ? setParent : parent,
            element.reduce(o)
          ));
        }
        return _arr;
      }()));
      if (tmpIds.length) {
        return o.tmpWrapper(this.startIndex, result, tmpIds);
      } else {
        return result;
      }
    };
    _AccessMultiNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "AccessMultiNode", this.parent, this.elements);
    };
    _AccessMultiNode_prototype.walk = function (f) {
      var elements, parent;
      parent = f(this.parent);
      elements = map(this.elements, f);
      if (parent !== this.parent || elements !== this.elements) {
        return AccessMultiNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          parent,
          elements
        );
      } else {
        return this;
      }
    };
    _AccessMultiNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.parent, function (_e, parent) {
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.elements, f, function (_e2, elements) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, parent !== _this.parent || elements !== _this.elements
            ? AccessMultiNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              parent,
              elements
            )
            : _this);
        });
      });
    };
    return AccessMultiNode;
  }(Node));
  Node.Args = ArgsNode = (function (Node) {
    var _ArgsNode_prototype, _Node_prototype;
    function ArgsNode(startIndex, endIndex, scopeId) {
      var _this;
      _this = this instanceof ArgsNode ? this : __create(_ArgsNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ArgsNode_prototype = ArgsNode.prototype = __create(_Node_prototype);
    _ArgsNode_prototype.constructor = ArgsNode;
    ArgsNode.displayName = "ArgsNode";
    ArgsNode.cappedName = "Args";
    ArgsNode.argNames = [];
    State.addNodeFactory("args", ArgsNode);
    _ArgsNode_prototype.type = function () {
      return Type.args;
    };
    _ArgsNode_prototype.cacheable = false;
    _ArgsNode_prototype._isNoop = function () {
      return true;
    };
    _ArgsNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ArgsNode");
    };
    return ArgsNode;
  }(Node));
  Node.Array = ArrayNode = (function (Node) {
    var _ArrayNode_prototype, _Node_prototype;
    function ArrayNode(startIndex, endIndex, scopeId, elements) {
      var _i, _len, _this;
      _this = this instanceof ArrayNode ? this : __create(_ArrayNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(elements)) {
        throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
      } else {
        for (_i = 0, _len = elements.length; _i < _len; ++_i) {
          if (!(elements[_i] instanceof Node)) {
            throw TypeError("Expected elements[" + _i + "] to be a Node, got " + __typeof(elements[_i]));
          }
        }
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.elements = elements;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ArrayNode_prototype = ArrayNode.prototype = __create(_Node_prototype);
    _ArrayNode_prototype.constructor = ArrayNode;
    ArrayNode.displayName = "ArrayNode";
    ArrayNode.cappedName = "Array";
    ArrayNode.argNames = ["elements"];
    State.addNodeFactory("array", ArrayNode);
    _ArrayNode_prototype.type = function () {
      return Type.array;
    };
    _ArrayNode_prototype._reduce = function (o) {
      var elements;
      elements = map(this.elements, function (x) {
        return x.reduce(o).doWrap(o);
      });
      if (elements !== this.elements) {
        return ArrayNode(this.startIndex, this.endIndex, this.scopeId, elements);
      } else {
        return this;
      }
    };
    _ArrayNode_prototype._isNoop = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = (function () {
          var _arr, _i, _len, element;
          for (_arr = __toArray(_this.elements), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            element = _arr[_i];
            if (!element.isNoop(o)) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _ArrayNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ArrayNode", this.elements);
    };
    _ArrayNode_prototype.walk = function (f) {
      var elements;
      elements = map(this.elements, f);
      if (elements !== this.elements) {
        return ArrayNode(this.startIndex, this.endIndex, this.scopeId, elements);
      } else {
        return this;
      }
    };
    _ArrayNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.elements, f, function (_e, elements) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, elements !== _this.elements ? ArrayNode(_this.startIndex, _this.endIndex, _this.scopeId, elements) : _this);
      });
    };
    return ArrayNode;
  }(Node));
  State.prototype.arrayParam = State.prototype.array;
  Node.Assign = AssignNode = (function (Node) {
    var _AssignNode_prototype, _Node_prototype;
    function AssignNode(startIndex, endIndex, scopeId, left, op, right) {
      var _this;
      _this = this instanceof AssignNode ? this : __create(_AssignNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _AssignNode_prototype = AssignNode.prototype = __create(_Node_prototype);
    _AssignNode_prototype.constructor = AssignNode;
    AssignNode.displayName = "AssignNode";
    AssignNode.cappedName = "Assign";
    AssignNode.argNames = ["left", "op", "right"];
    State.addNodeFactory("assign", AssignNode);
    _AssignNode_prototype.type = (function () {
      var ops;
      ops = {
        "=": function (left, right) {
          return right;
        },
        "+=": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
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
            if (__owns.call(ops, _ref = _this.op)) {
              type = ops[_ref];
            }
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
    _AssignNode_prototype._reduce = function (o) {
      var left, right;
      left = this.left.reduce(o);
      right = this.right.reduce(o).doWrap(o);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "AssignNode",
        this.left,
        this.op,
        this.right
      );
    };
    _AssignNode_prototype.walk = function (f) {
      var left, right;
      left = f(this.left);
      right = f(this.right);
      if (left !== this.left || right !== this.right) {
        return AssignNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _AssignNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.left, function (_e, left) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.right, function (_e2, right) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? AssignNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              left,
              _this.op,
              right
            )
            : _this);
        });
      });
    };
    return AssignNode;
  }(Node));
  Node.Binary = BinaryNode = (function (Node) {
    var _BinaryNode_prototype, _Node_prototype;
    function BinaryNode(startIndex, endIndex, scopeId, left, op, right) {
      var _this;
      _this = this instanceof BinaryNode ? this : __create(_BinaryNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node, got " + __typeof(right));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.op = op;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BinaryNode_prototype = BinaryNode.prototype = __create(_Node_prototype);
    _BinaryNode_prototype.constructor = BinaryNode;
    BinaryNode.displayName = "BinaryNode";
    BinaryNode.cappedName = "Binary";
    BinaryNode.argNames = ["left", "op", "right"];
    State.addNodeFactory("binary", BinaryNode);
    _BinaryNode_prototype.type = (function () {
      var ops;
      ops = {
        "*": Type.number,
        "/": Type.number,
        "%": Type.number,
        "+": function (left, right) {
          if (left.isSubsetOf(Type.numeric) && right.isSubsetOf(Type.numeric)) {
            return Type.number;
          } else if (left.overlaps(Type.numeric) && right.overlaps(Type.numeric)) {
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
            if (__owns.call(ops, _ref = _this.op)) {
              type = ops[_ref];
            }
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
    _BinaryNode_prototype._reduce = (function () {
      var constOps, leftConstOps, nonConstOps, rightConstOps;
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
        "+": (function () {
          function isJSNumeric(x) {
            var _ref;
            return x === null || (_ref = typeof x) === "number" || _ref === "boolean" || _ref === "undefined";
          }
          return function (left, right) {
            if (isJSNumeric(left) && isJSNumeric(right)) {
              return left - -right;
            } else {
              return "" + left + right;
            }
          };
        }()),
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
      function leftConstNan(x, y) {
        var _ref;
        if ((_ref = x.constValue()) !== _ref) {
          return BlockNode(this.startIndex, this.endIndex, this.scopeId, [y, x]);
        }
      }
      leftConstOps = {
        "*": function (x, y) {
          var _ref;
          if (x.constValue() === 1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              y
            );
          } else if (x.constValue() === -1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "-",
              y
            );
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [y, x]);
          }
        },
        "/": leftConstNan,
        "%": leftConstNan,
        "+": function (x, y, o) {
          var _ref;
          if (x.constValue() === 0 && y.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              y
            );
          } else if (x.constValue() === "" && y.type(o).isSubsetOf(Type.string)) {
            return y;
          } else if (typeof x.constValue() === "string" && y instanceof BinaryNode && y.op === "+" && y.left.isConst() && typeof y.left.constValue() === "string") {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              ConstNode(x.startIndex, y.left.endIndex, this.scopeId, __strnum(x.constValue()) + __strnum(y.left.constValue())),
              "+",
              y.right
            );
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [y, x]);
          }
        },
        "-": function (x, y) {
          var _ref;
          if (x.constValue() === 0) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "-",
              y
            );
          } else if ((_ref = x.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [y, x]);
          }
        },
        "<<": leftConstNan,
        ">>": leftConstNan,
        ">>>": leftConstNan,
        "&": leftConstNan,
        "|": leftConstNan,
        "^": leftConstNan,
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
        }
      };
      function rightConstNan(x, y) {
        var _ref;
        if ((_ref = y.constValue()) !== _ref) {
          return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
        }
      }
      rightConstOps = {
        "*": function (x, y) {
          var _ref;
          if (y.constValue() === 1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              x
            );
          } else if (y.constValue() === -1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "-",
              x
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          }
        },
        "/": function (x, y) {
          var _ref;
          if (y.constValue() === 1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              x
            );
          } else if (y.constValue() === -1) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "-",
              x
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          }
        },
        "%": rightConstNan,
        "+": function (x, y, o) {
          var _ref;
          if (y.constValue() === 0 && x.type(o).isSubsetOf(Type.number)) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              x
            );
          } else if (typeof y.constValue() === "number" && __num(y.value) < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              x,
              "-",
              ConstNode(y.startIndex, y.endIndex, this.scopeId, -__num(y.constValue()))
            );
          } else if (y.constValue() === "" && x.type(o).isSubsetOf(Type.string)) {
            return x;
          } else if (typeof y.constValue() === "string" && x instanceof BinaryNode && x.op === "+" && x.right.isConst() && typeof x.right.constValue() === "string") {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              x.left,
              "+",
              ConstNode(x.right.startIndex, y.endIndex, this.scopeId, __strnum(x.right.constValue()) + __strnum(y.constValue()))
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          }
        },
        "-": function (x, y, o) {
          var _ref;
          if (y.constValue() === 0) {
            return UnaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              "+",
              x
            );
          } else if (typeof y.constValue() === "number" && __num(y.constValue()) < 0 && x.type(o).isSubsetOf(Type.number)) {
            return BinaryNode(
              this.startIndex,
              this.endIndex,
              this.scopeId,
              x,
              "+",
              ConstNode(y.startIndex, y.endIndex, this.scopeId, -__num(y.constValue()))
            );
          } else if ((_ref = y.constValue()) !== _ref) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          }
        },
        "<<": rightConstNan,
        ">>": rightConstNan,
        ">>>": rightConstNan,
        "&": rightConstNan,
        "|": rightConstNan,
        "^": rightConstNan
      };
      nonConstOps = {
        "&&": function (x, y, o) {
          var xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            return x;
          }
        },
        "||": function (x, y, o) {
          var xType;
          xType = x.type(o);
          if (xType.isSubsetOf(Type.alwaysTruthy)) {
            return x;
          } else if (xType.isSubsetOf(Type.alwaysFalsy)) {
            return BlockNode(this.startIndex, this.endIndex, this.scopeId, [x, y]);
          }
        }
      };
      return function (o) {
        var _ref, left, op, right;
        left = this.left.reduce(o).doWrap(o);
        right = this.right.reduce(o).doWrap(o);
        op = this.op;
        if (left.isConst()) {
          if (right.isConst() && __owns.call(constOps, op)) {
            return ConstNode(this.startIndex, this.endIndex, this.scopeId, constOps[op](left.constValue(), right.constValue()));
          }
          if (__owns.call(leftConstOps, op) && (_ref = leftConstOps[op].call(this, left, right, o)) != null) {
            return _ref;
          }
        }
        if (right.isConst() && __owns.call(rightConstOps, op) && (_ref = rightConstOps[op].call(this, left, right, o)) != null) {
          return _ref;
        }
        if (__owns.call(nonConstOps, op) && (_ref = nonConstOps[op].call(this, left, right, o)) != null) {
          return _ref;
        }
        if (left !== this.left || right !== this.right) {
          return BinaryNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            left,
            op,
            right
          );
        } else {
          return this;
        }
      };
    }());
    _BinaryNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "BinaryNode",
        this.left,
        this.op,
        this.right
      );
    };
    _BinaryNode_prototype.walk = function (f) {
      var left, right;
      left = f(this.left);
      right = f(this.right);
      if (left !== this.left || right !== this.right) {
        return BinaryNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          left,
          this.op,
          right
        );
      } else {
        return this;
      }
    };
    _BinaryNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.left, function (_e, left) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.right, function (_e2, right) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, left !== _this.left || right !== _this.right
            ? BinaryNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              left,
              _this.op,
              right
            )
            : _this);
        });
      });
    };
    return BinaryNode;
  }(Node));
  Node.Block = BlockNode = (function (Node) {
    var _BlockNode_prototype, _Node_prototype;
    function BlockNode(startIndex, endIndex, scopeId, nodes, label) {
      var _i, _len, _this;
      _this = this instanceof BlockNode ? this : __create(_BlockNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(nodes)) {
        throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
      } else {
        for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
          if (!(nodes[_i] instanceof Node)) {
            throw TypeError("Expected nodes[" + _i + "] to be a Node, got " + __typeof(nodes[_i]));
          }
        }
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.nodes = nodes;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BlockNode_prototype = BlockNode.prototype = __create(_Node_prototype);
    _BlockNode_prototype.constructor = BlockNode;
    BlockNode.displayName = "BlockNode";
    BlockNode.cappedName = "Block";
    BlockNode.argNames = ["nodes", "label"];
    State.addNodeFactory("block", BlockNode);
    _BlockNode_prototype.type = function (o) {
      var nodes;
      nodes = this.nodes;
      if (nodes.length === 0) {
        return Type["undefined"];
      } else {
        return nodes[__num(nodes.length) - 1].type(o);
      }
    };
    _BlockNode_prototype.withLabel = function (label, o) {
      var _this;
      _this = this;
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      if (this.label == null) {
        if (this.nodes.length === 1) {
          return this.nodes[0].withLabel(label, o);
        } else if (__num(this.nodes.length) > 1 && this.nodes[__num(this.nodes.length) - 1] instanceof ForInNode && (function () {
          var _arr, _end, _i, _len, node;
          for (_arr = __toArray(_this.nodes), _i = 0, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); _i < _end; ++_i) {
            node = _arr[_i];
            if (!(node instanceof AssignNode) && !(node instanceof VarNode)) {
              return false;
            }
          }
          return true;
        }())) {
          return BlockNode(this.startIndex, this.endIndex, this.scopeId, __slice(this.nodes, 0, -1).concat([this.nodes[__num(this.nodes.length) - 1].withLabel(label, o)]));
        }
      }
      return BlockNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.nodes,
        label
      );
    };
    _BlockNode_prototype._reduce = function (o) {
      var _arr, body, changed, i, label, len, node, reduced;
      changed = false;
      body = [];
      for (_arr = __toArray(this.nodes), i = 0, len = _arr.length; i < len; ++i) {
        node = _arr[i];
        reduced = node.reduce(o);
        if (reduced instanceof BlockNode && reduced.label == null) {
          body.push.apply(body, __toArray(reduced.nodes));
          changed = true;
        } else if (reduced instanceof NothingNode) {
          changed = true;
        } else if (reduced instanceof BreakNode || reduced instanceof ContinueNode || reduced instanceof ThrowNode || reduced instanceof ReturnNode) {
          body.push(reduced);
          if (reduced !== node || i < len - 1) {
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
      if (this.label != null) {
        label = this.label.reduce(o);
      } else {
        label = this.label;
      }
      if (body.length === 0) {
        return NothingNode(this.startIndex, this.endIndex, this.scopeId);
      } else if (label == null && body.length === 1) {
        return body[0];
      } else if (changed || label !== this.label) {
        return BlockNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          body,
          label
        );
      } else {
        return this;
      }
    };
    _BlockNode_prototype.isStatement = function () {
      var _this;
      _this = this;
      return (function () {
        var _arr, _i, node;
        for (_arr = __toArray(_this.nodes), _i = _arr.length; _i--; ) {
          node = _arr[_i];
          if (node.isStatement()) {
            return true;
          }
        }
        return false;
      }());
    };
    _BlockNode_prototype._isNoop = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = (function () {
          var _arr, _i, node;
          for (_arr = __toArray(_this.nodes), _i = _arr.length; _i--; ) {
            node = _arr[_i];
            if (!node.isNoop(o)) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _BlockNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "BlockNode", this.nodes, this.label);
    };
    _BlockNode_prototype.walk = function (f) {
      var label, nodes;
      nodes = map(this.nodes, f);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (nodes !== this.nodes || label !== this.label) {
        return BlockNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          nodes,
          label
        );
      } else {
        return this;
      }
    };
    _BlockNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.nodes, f, function (_e, nodes) {
        if (_e != null) {
          return callback(_e);
        }
        function next(label) {
          return callback(null, nodes !== _this.nodes || label !== _this.label
            ? BlockNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              nodes,
              label
            )
            : _this);
        }
        if (_this.label instanceof Node) {
          return f(_this.label, function (_e2, label) {
            if (_e2 != null) {
              return callback(_e2);
            }
            return next(label);
          });
        } else {
          return next(_this.label);
        }
      });
    };
    return BlockNode;
  }(Node));
  Node.Break = BreakNode = (function (Node) {
    var _BreakNode_prototype, _Node_prototype;
    function BreakNode(startIndex, endIndex, scopeId, label) {
      var _this;
      _this = this instanceof BreakNode ? this : __create(_BreakNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _BreakNode_prototype = BreakNode.prototype = __create(_Node_prototype);
    _BreakNode_prototype.constructor = BreakNode;
    BreakNode.displayName = "BreakNode";
    BreakNode.cappedName = "Break";
    BreakNode.argNames = ["label"];
    State.addNodeFactory("break", BreakNode);
    _BreakNode_prototype.type = function () {
      return Type["undefined"];
    };
    _BreakNode_prototype.isStatement = function () {
      return true;
    };
    _BreakNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return BreakNode(this.startIndex, this.endIndex, this.scopeId, label);
    };
    _BreakNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "BreakNode", this.label);
    };
    _BreakNode_prototype.walk = function (f) {
      var label;
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (label !== this.label) {
        return BreakNode(this.startIndex, this.endIndex, this.scopeId, label);
      } else {
        return this;
      }
    };
    _BreakNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      function next(label) {
        return callback(null, label !== _this.label ? BreakNode(_this.startIndex, _this.endIndex, _this.scopeId, label) : _this);
      }
      if (this.label instanceof Node) {
        return f(this.label, function (_e, label) {
          if (_e != null) {
            return callback(_e);
          }
          return next(label);
        });
      } else {
        return next(this.label);
      }
    };
    return BreakNode;
  }(Node));
  Node.Call = CallNode = (function (Node) {
    var _CallNode_prototype, _Node_prototype;
    function CallNode(startIndex, endIndex, scopeId, func, args, isNew, isApply) {
      var _i, _len, _this;
      _this = this instanceof CallNode ? this : __create(_CallNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
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
      if (isNew == null) {
        isNew = false;
      } else if (typeof isNew !== "boolean") {
        throw TypeError("Expected isNew to be a Boolean, got " + __typeof(isNew));
      }
      if (isApply == null) {
        isApply = false;
      } else if (typeof isApply !== "boolean") {
        throw TypeError("Expected isApply to be a Boolean, got " + __typeof(isApply));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.func = func;
      _this.args = args;
      _this.isNew = isNew;
      _this.isApply = isApply;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _CallNode_prototype = CallNode.prototype = __create(_Node_prototype);
    _CallNode_prototype.constructor = CallNode;
    CallNode.displayName = "CallNode";
    CallNode.cappedName = "Call";
    CallNode.argNames = ["func", "args", "isNew", "isApply"];
    State.addNodeFactory("call", CallNode);
    _CallNode_prototype.type = (function () {
      var PRIMORDIAL_FUNCTIONS, PRIMORDIAL_METHODS, PRIMORDIAL_SUBFUNCTIONS;
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
        RegExp: { exec: Type.array.union(Type["null"]), test: Type.boolean, toString: Type.string },
        Error: { toString: Type.string }
      };
      return function (o) {
        var _ref, _this;
        _this = this;
        if ((_ref = this._type) == null) {
          return this._type = (function () {
            var _ref, _ref2, _ref3, _ref4, child, func, funcType, helpers, name, parent, parentType;
            func = _this.func;
            funcType = func.type(o);
            if (funcType.isSubsetOf(Type["function"])) {
              return funcType.returnType;
            } else if (func instanceof IdentNode) {
              name = func.name;
              if (__owns.call(PRIMORDIAL_FUNCTIONS, name)) {
                return PRIMORDIAL_FUNCTIONS[name];
              } else if (__num(name.length) > 2 && name.charCodeAt(0) === 95 && name.charCodeAt(1) === 95) {
                helpers = require("./translator").helpers;
                if (helpers.has(name)) {
                  funcType = helpers.type(name);
                  if (funcType.isSubsetOf(Type["function"])) {
                    return funcType.returnType;
                  }
                }
              }
            } else if (func instanceof AccessNode) {
              parent = func.parent;
              child = func.child;
              if (child instanceof ConstNode) {
                if ((_ref = child.value) === "call" || _ref === "apply") {
                  parentType = parent.type(o);
                  if (parentType.isSubsetOf(Type["function"])) {
                    return parentType.returnType;
                  }
                } else if (parent instanceof IdentNode && __owns.call(PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name) && __owns.call(_ref2 = PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.value) && (_ref4 = _ref2[_ref3]) != null) {
                  return _ref4;
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
    _CallNode_prototype._reduce = (function () {
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
        var _arr, _i, _len, _ref, _ref2, _ref3, allConst, arg, args, child, constArgs, cValue, func, parent, pValue, value;
        func = this.func.reduce(o).doWrap(o);
        args = map(this.args, function (node) {
          return node.reduce(o).doWrap(o);
        });
        if (!this.isNew && !this.isApply) {
          constArgs = [];
          allConst = true;
          for (_arr = __toArray(args), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            arg = _arr[_i];
            if (arg.isConst()) {
              constArgs.push(arg.constValue());
            } else {
              allConst = false;
              break;
            }
          }
          if (allConst) {
            if (func instanceof IdentNode) {
              if (__owns.call(PURE_PRIMORDIAL_FUNCTIONS, func.name)) {
                try {
                  value = GLOBAL[func.name].apply(void 0, __toArray(constArgs));
                  return ConstNode(this.startIndex, this.endIndex, this.scopeId, value);
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
                    return ConstNode(this.startIndex, this.endIndex, this.scopeId, value);
                  } catch (e) {}
                }
              } else if (parent instanceof IdentNode && (__owns.call(PURE_PRIMORDIAL_SUBFUNCTIONS, _ref = parent.name) && __owns.call(_ref2 = PURE_PRIMORDIAL_SUBFUNCTIONS[_ref], _ref3 = child.value) ? _ref2[_ref3] : void 0)) {
                try {
                  value = (_ref = GLOBAL[parent.name])[cValue].apply(_ref, __toArray(constArgs));
                  return ConstNode(this.startIndex, this.endIndex, this.scopeId, value);
                } catch (e) {}
              }
            }
          }
        }
        if (func !== this.func || args !== this.args) {
          return CallNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
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
    _CallNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "CallNode",
        this.func,
        this.args,
        this.isNew,
        this.isApply
      );
    };
    _CallNode_prototype.walk = function (f) {
      var args, func;
      func = f(this.func);
      args = map(this.args, f);
      if (func !== this.func || args !== this.args) {
        return CallNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          func,
          args,
          this.isNew,
          this.isApply
        );
      } else {
        return this;
      }
    };
    _CallNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.func, function (_e, func) {
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(_this.args, f, function (_e2, args) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return callback(null, func !== _this.func || args !== _this.args
            ? CallNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              func,
              args,
              _this.isNew,
              _this.isApply
            )
            : _this);
        });
      });
    };
    return CallNode;
  }(Node));
  Node.Const = ConstNode = (function (Node) {
    var _ConstNode_prototype, _Node_prototype;
    function ConstNode(startIndex, endIndex, scopeId, value) {
      var _this;
      _this = this instanceof ConstNode ? this : __create(_ConstNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (value != void 0 && typeof value !== "number" && typeof value !== "string" && typeof value !== "boolean" && !(value instanceof RegExp)) {
        throw TypeError("Expected value to be a Number or String or Boolean or RegExp or undefined or null, got " + __typeof(value));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.value = value;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ConstNode_prototype = ConstNode.prototype = __create(_Node_prototype);
    _ConstNode_prototype.constructor = ConstNode;
    ConstNode.displayName = "ConstNode";
    ConstNode.cappedName = "Const";
    ConstNode.argNames = ["value"];
    State.addNodeFactory("const", ConstNode);
    _ConstNode_prototype.type = function () {
      var value;
      value = this.value;
      switch (typeof value) {
      case "number": return Type.number;
      case "string": return Type.string;
      case "boolean": return Type.boolean;
      case "undefined": return Type["undefined"];
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
    _ConstNode_prototype.cacheable = false;
    _ConstNode_prototype.isConst = function () {
      return true;
    };
    _ConstNode_prototype.constValue = function () {
      return this.value;
    };
    _ConstNode_prototype._isNoop = function () {
      return true;
    };
    _ConstNode_prototype.inspect = function (depth) {
      return "ConstNode(" + __strnum(inspect(this.value, null, depth != null ? __num(depth) - 1 : null)) + ")";
    };
    _ConstNode_prototype.walk = function (f) {
      return this;
    };
    _ConstNode_prototype.walkAsync = function (f, callback) {
      return callback(null, this);
    };
    return ConstNode;
  }(Node));
  Node.Continue = ContinueNode = (function (Node) {
    var _ContinueNode_prototype, _Node_prototype;
    function ContinueNode(startIndex, endIndex, scopeId, label) {
      var _this;
      _this = this instanceof ContinueNode ? this : __create(_ContinueNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ContinueNode_prototype = ContinueNode.prototype = __create(_Node_prototype);
    _ContinueNode_prototype.constructor = ContinueNode;
    ContinueNode.displayName = "ContinueNode";
    ContinueNode.cappedName = "Continue";
    ContinueNode.argNames = ["label"];
    State.addNodeFactory("continue", ContinueNode);
    _ContinueNode_prototype.type = function () {
      return Type["undefined"];
    };
    _ContinueNode_prototype.isStatement = function () {
      return true;
    };
    _ContinueNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return ContinueNode(this.startIndex, this.endIndex, this.scopeId, label);
    };
    _ContinueNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ContinueNode", this.label);
    };
    _ContinueNode_prototype.walk = function (f) {
      var label;
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (label !== this.label) {
        return ContinueNode(this.startIndex, this.endIndex, this.scopeId, label);
      } else {
        return this;
      }
    };
    _ContinueNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      function next(label) {
        return callback(null, label !== _this.label ? ContinueNode(_this.startIndex, _this.endIndex, _this.scopeId, label) : _this);
      }
      if (this.label instanceof Node) {
        return f(this.label, function (_e, label) {
          if (_e != null) {
            return callback(_e);
          }
          return next(label);
        });
      } else {
        return next(this.label);
      }
    };
    return ContinueNode;
  }(Node));
  Node.Debugger = DebuggerNode = (function (Node) {
    var _DebuggerNode_prototype, _Node_prototype;
    function DebuggerNode(startIndex, endIndex, scopeId) {
      var _this;
      _this = this instanceof DebuggerNode ? this : __create(_DebuggerNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _DebuggerNode_prototype = DebuggerNode.prototype = __create(_Node_prototype);
    _DebuggerNode_prototype.constructor = DebuggerNode;
    DebuggerNode.displayName = "DebuggerNode";
    DebuggerNode.cappedName = "Debugger";
    DebuggerNode.argNames = [];
    State.addNodeFactory("debugger", DebuggerNode);
    _DebuggerNode_prototype.type = function () {
      return Type["undefined"];
    };
    _DebuggerNode_prototype.isStatement = function () {
      return true;
    };
    _DebuggerNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "DebuggerNode");
    };
    return DebuggerNode;
  }(Node));
  Node.Def = DefNode = (function (Node) {
    var _DefNode_prototype, _Node_prototype;
    function DefNode(startIndex, endIndex, scopeId, left, right) {
      var _this;
      _this = this instanceof DefNode ? this : __create(_DefNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(left instanceof Node)) {
        throw TypeError("Expected left to be a Node, got " + __typeof(left));
      }
      if (right == null) {
        right = void 0;
      } else if (!(right instanceof Node)) {
        throw TypeError("Expected right to be a Node or undefined, got " + __typeof(right));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.left = left;
      _this.right = right;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _DefNode_prototype = DefNode.prototype = __create(_Node_prototype);
    _DefNode_prototype.constructor = DefNode;
    DefNode.displayName = "DefNode";
    DefNode.cappedName = "Def";
    DefNode.argNames = ["left", "right"];
    State.addNodeFactory("def", DefNode);
    _DefNode_prototype.type = function (o) {
      if (this.right != null) {
        return this.right.type(o);
      } else {
        return Type.any;
      }
    };
    _DefNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "DefNode", this.left, this.right);
    };
    _DefNode_prototype.walk = function (f) {
      var left, right;
      left = f(this.left);
      if (this.right instanceof Node) {
        right = f(this.right);
      } else {
        right = this.right;
      }
      if (left !== this.left || right !== this.right) {
        return DefNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          left,
          right
        );
      } else {
        return this;
      }
    };
    _DefNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.left, function (_e, left) {
        if (_e != null) {
          return callback(_e);
        }
        function next(right) {
          return callback(null, left !== _this.left || right !== _this.right
            ? DefNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              left,
              right
            )
            : _this);
        }
        if (_this.right instanceof Node) {
          return f(_this.right, function (_e2, right) {
            if (_e2 != null) {
              return callback(_e2);
            }
            return next(right);
          });
        } else {
          return next(_this.right);
        }
      });
    };
    return DefNode;
  }(Node));
  Node.Eval = EvalNode = (function (Node) {
    var _EvalNode_prototype, _Node_prototype;
    function EvalNode(startIndex, endIndex, scopeId, code) {
      var _this;
      _this = this instanceof EvalNode ? this : __create(_EvalNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(code instanceof Node)) {
        throw TypeError("Expected code to be a Node, got " + __typeof(code));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.code = code;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _EvalNode_prototype = EvalNode.prototype = __create(_Node_prototype);
    _EvalNode_prototype.constructor = EvalNode;
    EvalNode.displayName = "EvalNode";
    EvalNode.cappedName = "Eval";
    EvalNode.argNames = ["code"];
    State.addNodeFactory("eval", EvalNode);
    _EvalNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "EvalNode", this.code);
    };
    _EvalNode_prototype.walk = function (f) {
      var code;
      code = f(this.code);
      if (code !== this.code) {
        return EvalNode(this.startIndex, this.endIndex, this.scopeId, code);
      } else {
        return this;
      }
    };
    _EvalNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.code, function (_e, code) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, code !== _this.code ? EvalNode(_this.startIndex, _this.endIndex, _this.scopeId, code) : _this);
      });
    };
    return EvalNode;
  }(Node));
  Node.For = ForNode = (function (Node) {
    var _ForNode_prototype, _Node_prototype;
    function ForNode(startIndex, endIndex, scopeId, init, test, step, body, label) {
      var _this;
      _this = this instanceof ForNode ? this : __create(_ForNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (init == null) {
        init = NothingNode(0, 0, scopeId);
      } else if (!(init instanceof Node)) {
        throw TypeError("Expected init to be a Node, got " + __typeof(init));
      }
      if (test == null) {
        test = ConstNode(0, 0, scopeId, true);
      } else if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (step == null) {
        step = NothingNode(0, 0, scopeId);
      } else if (!(step instanceof Node)) {
        throw TypeError("Expected step to be a Node, got " + __typeof(step));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.init = init;
      _this.test = test;
      _this.step = step;
      _this.body = body;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ForNode_prototype = ForNode.prototype = __create(_Node_prototype);
    _ForNode_prototype.constructor = ForNode;
    ForNode.displayName = "ForNode";
    ForNode.cappedName = "For";
    ForNode.argNames = [
      "init",
      "test",
      "step",
      "body",
      "label"
    ];
    State.addNodeFactory("for", ForNode);
    _ForNode_prototype.type = function () {
      return Type["undefined"];
    };
    _ForNode_prototype.isStatement = function () {
      return true;
    };
    _ForNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return ForNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.init,
        this.test,
        this.step,
        this.body,
        label
      );
    };
    _ForNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ForNode",
        this.init,
        this.test,
        this.step,
        this.body,
        this.label
      );
    };
    _ForNode_prototype.walk = function (f) {
      var body, init, label, step, test;
      init = f(this.init);
      test = f(this.test);
      step = f(this.step);
      body = f(this.body);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (init !== this.init || test !== this.test || step !== this.step || body !== this.body || label !== this.label) {
        return ForNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          init,
          test,
          step,
          body,
          label
        );
      } else {
        return this;
      }
    };
    _ForNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.init, function (_e, init) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.test, function (_e2, test) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return f(_this.step, function (_e3, step) {
            if (_e3 != null) {
              return callback(_e3);
            }
            return f(_this.body, function (_e4, body) {
              if (_e4 != null) {
                return callback(_e4);
              }
              function next(label) {
                return callback(null, init !== _this.init || test !== _this.test || step !== _this.step || body !== _this.body || label !== _this.label
                  ? ForNode(
                    _this.startIndex,
                    _this.endIndex,
                    _this.scopeId,
                    init,
                    test,
                    step,
                    body,
                    label
                  )
                  : _this);
              }
              if (_this.label instanceof Node) {
                return f(_this.label, function (_e5, label) {
                  if (_e5 != null) {
                    return callback(_e5);
                  }
                  return next(label);
                });
              } else {
                return next(_this.label);
              }
            });
          });
        });
      });
    };
    return ForNode;
  }(Node));
  Node.ForIn = ForInNode = (function (Node) {
    var _ForInNode_prototype, _Node_prototype;
    function ForInNode(startIndex, endIndex, scopeId, key, object, body, label) {
      var _this;
      _this = this instanceof ForInNode ? this : __create(_ForInNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(key instanceof Node)) {
        throw TypeError("Expected key to be a Node, got " + __typeof(key));
      }
      if (!(object instanceof Node)) {
        throw TypeError("Expected object to be a Node, got " + __typeof(object));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.key = key;
      _this.object = object;
      _this.body = body;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ForInNode_prototype = ForInNode.prototype = __create(_Node_prototype);
    _ForInNode_prototype.constructor = ForInNode;
    ForInNode.displayName = "ForInNode";
    ForInNode.cappedName = "ForIn";
    ForInNode.argNames = ["key", "object", "body", "label"];
    State.addNodeFactory("forIn", ForInNode);
    _ForInNode_prototype.type = function () {
      return Type["undefined"];
    };
    _ForInNode_prototype.isStatement = function () {
      return true;
    };
    _ForInNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return ForInNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.key,
        this.object,
        this.body,
        label
      );
    };
    _ForInNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ForInNode",
        this.key,
        this.object,
        this.body,
        this.label
      );
    };
    _ForInNode_prototype.walk = function (f) {
      var body, key, label, object;
      key = f(this.key);
      object = f(this.object);
      body = f(this.body);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (key !== this.key || object !== this.object || body !== this.body || label !== this.label) {
        return ForInNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          key,
          object,
          body,
          label
        );
      } else {
        return this;
      }
    };
    _ForInNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.key, function (_e, key) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.object, function (_e2, object) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return f(_this.body, function (_e3, body) {
            if (_e3 != null) {
              return callback(_e3);
            }
            function next(label) {
              return callback(null, key !== _this.key || object !== _this.object || body !== _this.body || label !== _this.label
                ? ForInNode(
                  _this.startIndex,
                  _this.endIndex,
                  _this.scopeId,
                  key,
                  object,
                  body,
                  label
                )
                : _this);
            }
            if (_this.label instanceof Node) {
              return f(_this.label, function (_e4, label) {
                if (_e4 != null) {
                  return callback(_e4);
                }
                return next(label);
              });
            } else {
              return next(_this.label);
            }
          });
        });
      });
    };
    return ForInNode;
  }(Node));
  Node.Function = FunctionNode = (function (Node) {
    var _FunctionNode_prototype, _Node_prototype;
    function FunctionNode(startIndex, endIndex, scopeId, params, body, autoReturn, bound, asType, generator) {
      var _i, _len, _this;
      _this = this instanceof FunctionNode ? this : __create(_FunctionNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
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
      if (autoReturn == null) {
        autoReturn = true;
      } else if (typeof autoReturn !== "boolean") {
        throw TypeError("Expected autoReturn to be a Boolean, got " + __typeof(autoReturn));
      }
      if (bound == null) {
        bound = false;
      } else if (!(bound instanceof Node) && typeof bound !== "boolean") {
        throw TypeError("Expected bound to be a Node or Boolean, got " + __typeof(bound));
      }
      if (asType == null) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      if (generator == null) {
        generator = false;
      } else if (typeof generator !== "boolean") {
        throw TypeError("Expected generator to be a Boolean, got " + __typeof(generator));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
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
    _Node_prototype = Node.prototype;
    _FunctionNode_prototype = FunctionNode.prototype = __create(_Node_prototype);
    _FunctionNode_prototype.constructor = FunctionNode;
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
    _FunctionNode_prototype.type = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var returnType, walker;
          if (_this.asType != null) {
            return nodeToType(_this.asType)["function"]();
          } else {
            if (_this.autoReturn) {
              returnType = _this.body.type(o);
            } else {
              returnType = Type["undefined"];
            }
            walker = function (node) {
              var _ref;
              if (node instanceof ReturnNode) {
                returnType = returnType.union(node.type(o));
                return node;
              } else if (node instanceof FunctionNode) {
                return node;
              } else if (node instanceof MacroAccessNode) {
                if ((_ref = node.data.macroName) === "return" || _ref === "return?") {
                  if (node.data.macroData.node) {
                    returnType = returnType.union(node.data.macroData.node.type(o));
                  } else {
                    returnType = returnType.union(Type["undefined"]);
                  }
                }
                return node.walk(walker);
              } else {
                return node.walk(walker);
              }
            };
            walker(_this.body);
            return returnType["function"]();
          }
        }());
      } else {
        return _ref;
      }
    };
    _FunctionNode_prototype._isNoop = function (o) {
      return true;
    };
    _FunctionNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "FunctionNode",
        this.params,
        this.body,
        this.autoReturn,
        this.bound,
        this.asType,
        this.generator
      );
    };
    _FunctionNode_prototype.walk = function (f) {
      var asType, body, bound, params;
      params = map(this.params, f);
      body = f(this.body);
      if (this.bound instanceof Node) {
        bound = f(this.bound);
      } else {
        bound = this.bound;
      }
      if (this.asType instanceof Node) {
        asType = f(this.asType);
      } else {
        asType = this.asType;
      }
      if (params !== this.params || body !== this.body || bound !== this.bound || asType !== this.asType) {
        return FunctionNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          params,
          body,
          this.autoReturn,
          bound,
          asType,
          this.generator
        );
      } else {
        return this;
      }
    };
    _FunctionNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.params, f, function (_e, params) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.body, function (_e2, body) {
          if (_e2 != null) {
            return callback(_e2);
          }
          function next(bound) {
            function next(asType) {
              return callback(null, params !== _this.params || body !== _this.body || bound !== _this.bound || asType !== _this.asType
                ? FunctionNode(
                  _this.startIndex,
                  _this.endIndex,
                  _this.scopeId,
                  params,
                  body,
                  _this.autoReturn,
                  bound,
                  asType,
                  _this.generator
                )
                : _this);
            }
            if (_this.asType instanceof Node) {
              return f(_this.asType, function (_e3, asType) {
                if (_e3 != null) {
                  return callback(_e3);
                }
                return next(asType);
              });
            } else {
              return next(_this.asType);
            }
          }
          if (_this.bound instanceof Node) {
            return f(_this.bound, function (_e3, bound) {
              if (_e3 != null) {
                return callback(_e3);
              }
              return next(bound);
            });
          } else {
            return next(_this.bound);
          }
        });
      });
    };
    return FunctionNode;
  }(Node));
  Node.Ident = IdentNode = (function (Node) {
    var _IdentNode_prototype, _Node_prototype;
    function IdentNode(startIndex, endIndex, scopeId, name) {
      var _this;
      _this = this instanceof IdentNode ? this : __create(_IdentNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.name = name;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _IdentNode_prototype = IdentNode.prototype = __create(_Node_prototype);
    _IdentNode_prototype.constructor = IdentNode;
    IdentNode.displayName = "IdentNode";
    IdentNode.cappedName = "Ident";
    IdentNode.argNames = ["name"];
    State.addNodeFactory("ident", IdentNode);
    _IdentNode_prototype.cacheable = false;
    _IdentNode_prototype.type = function (o) {
      if (o) {
        return o.scope.type(this);
      } else {
        return Type.any;
      }
    };
    _IdentNode_prototype._isNoop = function (o) {
      return true;
    };
    _IdentNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "IdentNode", this.name);
    };
    _IdentNode_prototype.walk = function (f) {
      return this;
    };
    _IdentNode_prototype.walkAsync = function (f, callback) {
      return callback(null, this);
    };
    return IdentNode;
  }(Node));
  Node.If = IfNode = (function (Node) {
    var _IfNode_prototype, _Node_prototype;
    function IfNode(startIndex, endIndex, scopeId, test, whenTrue, whenFalse, label) {
      var _this;
      _this = this instanceof IfNode ? this : __create(_IfNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(test instanceof Node)) {
        throw TypeError("Expected test to be a Node, got " + __typeof(test));
      }
      if (!(whenTrue instanceof Node)) {
        throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
      }
      if (whenFalse == null) {
        whenFalse = NothingNode(0, 0, scopeId);
      } else if (!(whenFalse instanceof Node)) {
        throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.test = test;
      _this.whenTrue = whenTrue;
      _this.whenFalse = whenFalse;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _IfNode_prototype = IfNode.prototype = __create(_Node_prototype);
    _IfNode_prototype.constructor = IfNode;
    IfNode.displayName = "IfNode";
    IfNode.cappedName = "If";
    IfNode.argNames = ["test", "whenTrue", "whenFalse", "label"];
    State.addNodeFactory("if", IfNode);
    _IfNode_prototype.type = function (o) {
      var _ref;
      if ((_ref = this._type) == null) {
        return this._type = this.whenTrue.type(o).union(this.whenFalse.type(o));
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return IfNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.test,
        this.whenTrue,
        this.whenFalse,
        label
      );
    };
    _IfNode_prototype._reduce = function (o) {
      var label, test, testType, whenFalse, whenTrue;
      test = this.test.reduce(o);
      whenTrue = this.whenTrue.reduce(o);
      whenFalse = this.whenFalse.reduce(o);
      if (this.label != null) {
        label = this.label.reduce(o);
      } else {
        label = this.label;
      }
      if (test.isConst()) {
        return BlockNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          [test.constValue() ? whenTrue : whenFalse],
          label
        ).reduce(o);
      } else {
        testType = test.type(o);
        if (testType.isSubsetOf(Type.alwaysTruthy)) {
          return BlockNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            [test, whenTrue],
            label
          ).reduce(o);
        } else if (testType.isSubsetOf(Type.alwaysFalsy)) {
          return BlockNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            [test, whenFalse],
            label
          ).reduce(o);
        } else if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse || label !== this.label) {
          return IfNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            test,
            whenTrue,
            whenFalse,
            label
          );
        } else {
          return this;
        }
      }
    };
    _IfNode_prototype.isStatement = function () {
      var _ref;
      if ((_ref = this._isStatement) == null) {
        return this._isStatement = this.whenTrue.isStatement() || this.whenFalse.isStatement();
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.doWrap = function (o) {
      var whenFalse, whenTrue;
      whenTrue = this.whenTrue.doWrap(o);
      whenFalse = this.whenFalse.doWrap(o);
      if (whenTrue !== this.whenTrue || whenFalse !== this.whenFalse) {
        return IfNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          this.test,
          whenTrue,
          whenFalse,
          this.label
        );
      } else {
        return this;
      }
    };
    _IfNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.test.isNoop(o) && this.whenTrue.isNoop(o) && this.whenFalse.isNoop(o);
      } else {
        return _ref;
      }
    };
    _IfNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "IfNode",
        this.test,
        this.whenTrue,
        this.whenFalse,
        this.label
      );
    };
    _IfNode_prototype.walk = function (f) {
      var label, test, whenFalse, whenTrue;
      test = f(this.test);
      whenTrue = f(this.whenTrue);
      whenFalse = f(this.whenFalse);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (test !== this.test || whenTrue !== this.whenTrue || whenFalse !== this.whenFalse || label !== this.label) {
        return IfNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          test,
          whenTrue,
          whenFalse,
          label
        );
      } else {
        return this;
      }
    };
    _IfNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.test, function (_e, test) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.whenTrue, function (_e2, whenTrue) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return f(_this.whenFalse, function (_e3, whenFalse) {
            if (_e3 != null) {
              return callback(_e3);
            }
            function next(label) {
              return callback(null, test !== _this.test || whenTrue !== _this.whenTrue || whenFalse !== _this.whenFalse || label !== _this.label
                ? IfNode(
                  _this.startIndex,
                  _this.endIndex,
                  _this.scopeId,
                  test,
                  whenTrue,
                  whenFalse,
                  label
                )
                : _this);
            }
            if (_this.label instanceof Node) {
              return f(_this.label, function (_e4, label) {
                if (_e4 != null) {
                  return callback(_e4);
                }
                return next(label);
              });
            } else {
              return next(_this.label);
            }
          });
        });
      });
    };
    return IfNode;
  }(Node));
  Node.MacroAccess = MacroAccessNode = (function (Node) {
    var _MacroAccessNode_prototype, _Node_prototype;
    function MacroAccessNode(startIndex, endIndex, scopeId, id, line, data, position, inGenerator) {
      var _this;
      _this = this instanceof MacroAccessNode ? this : __create(_MacroAccessNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (typeof line !== "number") {
        throw TypeError("Expected line to be a Number, got " + __typeof(line));
      }
      if (!__isObject(data)) {
        throw TypeError("Expected data to be an Object, got " + __typeof(data));
      }
      if (typeof position !== "string") {
        throw TypeError("Expected position to be a String, got " + __typeof(position));
      }
      if (inGenerator == null) {
        inGenerator = false;
      } else if (typeof inGenerator !== "boolean") {
        throw TypeError("Expected inGenerator to be a Boolean, got " + __typeof(inGenerator));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
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
    _Node_prototype = Node.prototype;
    _MacroAccessNode_prototype = MacroAccessNode.prototype = __create(_Node_prototype);
    _MacroAccessNode_prototype.constructor = MacroAccessNode;
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
    _MacroAccessNode_prototype.type = function (o) {
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
    _MacroAccessNode_prototype.withLabel = function (label, o) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return o.macroExpand1(this).withLabel(label, o);
    };
    _MacroAccessNode_prototype.walk = (function () {
      function walkObject(obj, func) {
        var changed, k, newV, result, v;
        result = {};
        changed = false;
        for (k in obj) {
          if (__owns.call(obj, k)) {
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
        } else if (__isArray(item)) {
          return map(item, function (x) {
            return walkItem(x, func);
          });
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
            this.scopeId,
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
    _MacroAccessNode_prototype.walkAsync = (function () {
      function walkObject(obj, func, callback) {
        var _keys, changed, k, result;
        changed = false;
        result = {};
        _keys = [];
        for (k in obj) {
          if (__owns.call(obj, k)) {
            _keys.push(k);
          }
        }
        return __async(
          1,
          _keys.length,
          function (_i, next) {
            var k, v;
            k = _keys[_i];
            v = obj[k];
            return walkItem(item, func, function (_e, newItem) {
              if (_e != null) {
                return next(_e);
              }
              if (item !== newItem) {
                changed = true;
              }
              result[k] = newItem;
              return next(null);
            });
          },
          function (err) {
            if (typeof err !== "undefined" && err !== null) {
              return callback(err);
            } else {
              return callback(null, changed ? result : obj);
            }
          }
        );
      }
      function walkItem(item, func, callback) {
        if (item instanceof Node) {
          return func(item, callback);
        } else if (__isArray(item)) {
          return mapAsync(
            item,
            function (x, cb) {
              return walkItem(x, func, cb);
            },
            callback
          );
        } else if (item && typeof item === "object") {
          return walkObject(item, func, callback);
        } else {
          return callback(null, item);
        }
      }
      return function (func, callback) {
        var _this;
        _this = this;
        return walkItem(this.data, func, function (_e, data) {
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, data !== _this.data
            ? MacroAccessNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              _this.id,
              _this.line,
              data,
              _this.position,
              _this.inGenerator
            )
            : _this);
        });
      };
    }());
    _MacroAccessNode_prototype._isNoop = function (o) {
      return o.macroExpand1(this).isNoop(o);
    };
    _MacroAccessNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "MacroAccessNode",
        this.id,
        this.line,
        this.data,
        this.position,
        this.inGenerator
      );
    };
    return MacroAccessNode;
  }(Node));
  Node.Nothing = NothingNode = (function (Node) {
    var _Node_prototype, _NothingNode_prototype;
    function NothingNode(startIndex, endIndex, scopeId) {
      var _this;
      _this = this instanceof NothingNode ? this : __create(_NothingNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _NothingNode_prototype = NothingNode.prototype = __create(_Node_prototype);
    _NothingNode_prototype.constructor = NothingNode;
    NothingNode.displayName = "NothingNode";
    NothingNode.cappedName = "Nothing";
    NothingNode.argNames = [];
    State.addNodeFactory("nothing", NothingNode);
    _NothingNode_prototype.type = function () {
      return Type["undefined"];
    };
    _NothingNode_prototype.cacheable = false;
    _NothingNode_prototype.isConst = function () {
      return true;
    };
    _NothingNode_prototype.constValue = function () {
      return;
    };
    _NothingNode_prototype._isNoop = function () {
      return true;
    };
    _NothingNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "NothingNode");
    };
    return NothingNode;
  }(Node));
  Node.Object = ObjectNode = (function (Node) {
    var _Node_prototype, _ObjectNode_prototype;
    function ObjectNode(startIndex, endIndex, scopeId, pairs, prototype) {
      var _i, _len, _this;
      _this = this instanceof ObjectNode ? this : __create(_ObjectNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be an Array, got " + __typeof(pairs));
      } else {
        for (_i = 0, _len = pairs.length; _i < _len; ++_i) {
          if (!__isObject(pairs[_i])) {
            throw TypeError("Expected pairs[" + _i + "] to be an Object, got " + __typeof(pairs[_i]));
          } else {
            if (!(pairs[_i].key instanceof Node)) {
              throw TypeError("Expected pairs[" + _i + "].key to be a Node, got " + __typeof(pairs[_i].key));
            }
            if (!(pairs[_i].value instanceof Node)) {
              throw TypeError("Expected pairs[" + _i + "].value to be a Node, got " + __typeof(pairs[_i].value));
            }
            if (pairs[_i].property == null) {
              pairs[_i].property = void 0;
            } else if (typeof pairs[_i].property !== "string") {
              throw TypeError("Expected pairs[" + _i + "].property to be a String or undefined, got " + __typeof(pairs[_i].property));
            }
          }
        }
      }
      if (prototype == null) {
        prototype = void 0;
      } else if (!(prototype instanceof Node)) {
        throw TypeError("Expected prototype to be a Node or undefined, got " + __typeof(prototype));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.pairs = pairs;
      _this.prototype = prototype;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ObjectNode_prototype = ObjectNode.prototype = __create(_Node_prototype);
    _ObjectNode_prototype.constructor = ObjectNode;
    ObjectNode.displayName = "ObjectNode";
    ObjectNode.cappedName = "Object";
    ObjectNode.argNames = ["pairs", "prototype"];
    State.addNodeFactory("object", ObjectNode);
    _ObjectNode_prototype.type = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var _arr, _i, _len, _ref, data, key, value;
          data = {};
          for (_arr = __toArray(_this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            key = (_ref = _arr[_i]).key;
            value = _ref.value;
            if (key.isConst()) {
              data[key.constValue()] = value.type(o);
            }
          }
          return Type.makeObject(data);
        }());
      } else {
        return _ref;
      }
    };
    _ObjectNode_prototype.walk = (function () {
      function walkPair(pair, func) {
        var key, value;
        key = func(pair.key);
        value = func(pair.value);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value, property: pair.property };
        } else {
          return pair;
        }
      }
      return function (func) {
        var pairs, prototype;
        pairs = map(this.pairs, walkPair, func);
        if (this.prototype != null) {
          prototype = func(this.prototype);
        } else {
          prototype = this.prototype;
        }
        if (pairs !== this.pairs || prototype !== this.prototype) {
          return ObjectNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            pairs,
            prototype
          );
        } else {
          return this;
        }
      };
    }());
    _ObjectNode_prototype.walkAsync = (function () {
      function walkPair(pair, func, callback) {
        return func(pair.key, function (_e, key) {
          if (_e != null) {
            return callback(_e);
          }
          return func(pair.value, function (_e2, value) {
            if (_e2 != null) {
              return callback(_e2);
            }
            return callback(null, key !== pair.key || value !== pair.value ? { key: key, value: value, property: pair.property } : pair);
          });
        });
      }
      return function (func, callback) {
        var _this;
        _this = this;
        return mapAsync(this.pairs, walkPair, func, function (_e, pairs) {
          if (_e != null) {
            return callback(_e);
          }
          function next(prototype) {
            return callback(null, pairs !== _this.pairs || prototype !== _this.prototype
              ? ObjectNode(
                _this.startIndex,
                _this.endIndex,
                _this.scopeId,
                pairs,
                prototype
              )
              : _this);
          }
          if (_this.prototype != null) {
            return func(_this.prototype, function (_e2, p) {
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(p);
            });
          } else {
            return next(_this.prototype);
          }
        });
      };
    }());
    _ObjectNode_prototype._reduce = (function () {
      function reducePair(pair, o) {
        var key, value;
        key = pair.key.reduce(o);
        value = pair.value.reduce(o).doWrap(o);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value, property: pair.property };
        } else {
          return pair;
        }
      }
      return function (o) {
        var pairs, prototype;
        pairs = map(this.pairs, reducePair, o);
        if (this.prototype != null) {
          prototype = this.prototype.reduce(o);
        } else {
          prototype = this.prototype;
        }
        if (pairs !== this.pairs || prototype !== this.prototype) {
          return ObjectNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            pairs,
            prototype
          );
        } else {
          return this;
        }
      };
    }());
    _ObjectNode_prototype._isNoop = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = (function () {
          var _arr, _i, _len, _ref, key, value;
          for (_arr = __toArray(_this.pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            key = (_ref = _arr[_i]).key;
            value = _ref.value;
            if (!key.isNoop(o) || !value.isNoop(o)) {
              return false;
            }
          }
          return true;
        }());
      } else {
        return _ref;
      }
    };
    _ObjectNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ObjectNode", this.pairs, this.prototype);
    };
    return ObjectNode;
  }(Node));
  State.prototype.object = function (i, pairs, prototype) {
    var _arr, _i, _len, _ref, key, keyValue, knownKeys, lastPropertyPair, property;
    knownKeys = [];
    lastPropertyPair = null;
    for (_arr = __toArray(pairs), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      key = (_ref = _arr[_i]).key;
      property = _ref.property;
      if (key instanceof ConstNode) {
        keyValue = String(key.value);
        if ((property === "get" || property === "set") && lastPropertyPair && lastPropertyPair.property !== property && lastPropertyPair.key === keyValue) {
          lastPropertyPair = null;
          continue;
        } else if (__in(keyValue, knownKeys)) {
          this.error("Duplicate key in object: " + keyValue);
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
    return ObjectNode(
      i,
      this.index,
      this.scope.id,
      pairs,
      prototype
    );
  };
  State.prototype.objectParam = State.prototype.object;
  Node.Param = ParamNode = (function (Node) {
    var _Node_prototype, _ParamNode_prototype;
    function ParamNode(startIndex, endIndex, scopeId, ident, defaultValue, spread, isMutable, asType) {
      var _this;
      _this = this instanceof ParamNode ? this : __create(_ParamNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(ident instanceof Node)) {
        throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
      }
      if (defaultValue == null) {
        defaultValue = void 0;
      } else if (!(defaultValue instanceof Node)) {
        throw TypeError("Expected defaultValue to be a Node or undefined, got " + __typeof(defaultValue));
      }
      if (spread == null) {
        spread = false;
      } else if (typeof spread !== "boolean") {
        throw TypeError("Expected spread to be a Boolean, got " + __typeof(spread));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      if (asType == null) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
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
    _Node_prototype = Node.prototype;
    _ParamNode_prototype = ParamNode.prototype = __create(_Node_prototype);
    _ParamNode_prototype.constructor = ParamNode;
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
    _ParamNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "ParamNode",
        this.ident,
        this.defaultValue,
        this.spread,
        this.isMutable,
        this.asType
      );
    };
    _ParamNode_prototype.walk = function (f) {
      var asType, defaultValue, ident;
      ident = f(this.ident);
      if (this.defaultValue instanceof Node) {
        defaultValue = f(this.defaultValue);
      } else {
        defaultValue = this.defaultValue;
      }
      if (this.asType instanceof Node) {
        asType = f(this.asType);
      } else {
        asType = this.asType;
      }
      if (ident !== this.ident || defaultValue !== this.defaultValue || asType !== this.asType) {
        return ParamNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
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
    _ParamNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.ident, function (_e, ident) {
        if (_e != null) {
          return callback(_e);
        }
        function next(defaultValue) {
          function next(asType) {
            return callback(null, ident !== _this.ident || defaultValue !== _this.defaultValue || asType !== _this.asType
              ? ParamNode(
                _this.startIndex,
                _this.endIndex,
                _this.scopeId,
                ident,
                defaultValue,
                _this.spread,
                _this.isMutable,
                asType
              )
              : _this);
          }
          if (_this.asType instanceof Node) {
            return f(_this.asType, function (_e2, asType) {
              if (_e2 != null) {
                return callback(_e2);
              }
              return next(asType);
            });
          } else {
            return next(_this.asType);
          }
        }
        if (_this.defaultValue instanceof Node) {
          return f(_this.defaultValue, function (_e2, defaultValue) {
            if (_e2 != null) {
              return callback(_e2);
            }
            return next(defaultValue);
          });
        } else {
          return next(_this.defaultValue);
        }
      });
    };
    return ParamNode;
  }(Node));
  Node.Regexp = RegexpNode = (function (Node) {
    var _Node_prototype, _RegexpNode_prototype;
    function RegexpNode(startIndex, endIndex, scopeId, text, flags) {
      var _this;
      _this = this instanceof RegexpNode ? this : __create(_RegexpNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(text instanceof Node)) {
        throw TypeError("Expected text to be a Node, got " + __typeof(text));
      }
      if (typeof flags !== "string") {
        throw TypeError("Expected flags to be a String, got " + __typeof(flags));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.text = text;
      _this.flags = flags;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _RegexpNode_prototype = RegexpNode.prototype = __create(_Node_prototype);
    _RegexpNode_prototype.constructor = RegexpNode;
    RegexpNode.displayName = "RegexpNode";
    RegexpNode.cappedName = "Regexp";
    RegexpNode.argNames = ["text", "flags"];
    State.addNodeFactory("regexp", RegexpNode);
    _RegexpNode_prototype.type = function () {
      return Type.regexp;
    };
    _RegexpNode_prototype._reduce = function (o) {
      var text;
      text = this.text.reduce(o).doWrap(o);
      if (text.isConst()) {
        return ConstNode(this.startIndex, this.endIndex, this.scopeId, RegExp(String(text.constValue()), this.flags));
      } else {
        return CallNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          IdentNode(this.startIndex, this.endIndex, this.scopeId, "RegExp"),
          [
            text,
            ConstNode(this.startIndex, this.endIndex, this.scopeId, this.flags)
          ]
        );
      }
    };
    _RegexpNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "RegexpNode", this.text, this.flags);
    };
    _RegexpNode_prototype.walk = function (f) {
      var text;
      text = f(this.text);
      if (text !== this.text) {
        return RegexpNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          text,
          this.flags
        );
      } else {
        return this;
      }
    };
    _RegexpNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.text, function (_e, text) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, text !== _this.text
          ? RegexpNode(
            _this.startIndex,
            _this.endIndex,
            _this.scopeId,
            text,
            _this.flags
          )
          : _this);
      });
    };
    return RegexpNode;
  }(Node));
  Node.Return = ReturnNode = (function (Node) {
    var _Node_prototype, _ReturnNode_prototype;
    function ReturnNode(startIndex, endIndex, scopeId, node) {
      var _this;
      _this = this instanceof ReturnNode ? this : __create(_ReturnNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (node == null) {
        node = ConstNode(endIndex, endIndex, scopeId, void 0);
      } else if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ReturnNode_prototype = ReturnNode.prototype = __create(_Node_prototype);
    _ReturnNode_prototype.constructor = ReturnNode;
    ReturnNode.displayName = "ReturnNode";
    ReturnNode.cappedName = "Return";
    ReturnNode.argNames = ["node"];
    State.addNodeFactory("return", ReturnNode);
    _ReturnNode_prototype.type = function (o) {
      return this.node.type(o);
    };
    _ReturnNode_prototype.isStatement = function () {
      return true;
    };
    _ReturnNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap(o);
      if (node !== this.node) {
        return ReturnNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _ReturnNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ReturnNode", this.node);
    };
    _ReturnNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return ReturnNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _ReturnNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? ReturnNode(_this.startIndex, _this.endIndex, _this.scopeId, node) : _this);
      });
    };
    return ReturnNode;
  }(Node));
  Node.Root = RootNode = (function (Node) {
    var _Node_prototype, _RootNode_prototype;
    function RootNode(startIndex, endIndex, scopeId, body) {
      var _this;
      _this = this instanceof RootNode ? this : __create(_RootNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(body instanceof Node)) {
        throw TypeError("Expected body to be a Node, got " + __typeof(body));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.body = body;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _RootNode_prototype = RootNode.prototype = __create(_Node_prototype);
    _RootNode_prototype.constructor = RootNode;
    RootNode.displayName = "RootNode";
    RootNode.cappedName = "Root";
    RootNode.argNames = ["body"];
    State.addNodeFactory("root", RootNode);
    _RootNode_prototype.isStatement = function () {
      return true;
    };
    _RootNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "RootNode", this.body);
    };
    _RootNode_prototype.walk = function (f) {
      var body;
      body = f(this.body);
      if (body !== this.body) {
        return RootNode(this.startIndex, this.endIndex, this.scopeId, body);
      } else {
        return this;
      }
    };
    _RootNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.body, function (_e, body) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, body !== _this.body ? RootNode(_this.startIndex, _this.endIndex, _this.scopeId, body) : _this);
      });
    };
    return RootNode;
  }(Node));
  Node.Spread = SpreadNode = (function (Node) {
    var _Node_prototype, _SpreadNode_prototype;
    function SpreadNode(startIndex, endIndex, scopeId, node) {
      var _this;
      _this = this instanceof SpreadNode ? this : __create(_SpreadNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SpreadNode_prototype = SpreadNode.prototype = __create(_Node_prototype);
    _SpreadNode_prototype.constructor = SpreadNode;
    SpreadNode.displayName = "SpreadNode";
    SpreadNode.cappedName = "Spread";
    SpreadNode.argNames = ["node"];
    State.addNodeFactory("spread", SpreadNode);
    _SpreadNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap(o);
      if (node !== this.node) {
        return SpreadNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _SpreadNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SpreadNode", this.node);
    };
    _SpreadNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return SpreadNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _SpreadNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? SpreadNode(_this.startIndex, _this.endIndex, _this.scopeId, node) : _this);
      });
    };
    return SpreadNode;
  }(Node));
  State.prototype.string = function (index, parts) {
    var _i, _len, concatOp, current, part;
    if (!__isArray(parts)) {
      throw TypeError("Expected parts to be an Array, got " + __typeof(parts));
    } else {
      for (_i = 0, _len = parts.length; _i < _len; ++_i) {
        if (!(parts[_i] instanceof Node)) {
          throw TypeError("Expected parts[" + _i + "] to be a Node, got " + __typeof(parts[_i]));
        }
      }
    }
    concatOp = this.macros.getByLabel("stringConcat");
    if (!concatOp) {
      throw Error("Cannot use string interpolation until the string-concat operator has been defined");
    }
    if (parts.length === 0) {
      return ConstNode(index, index, this.scope.id, "");
    } else if (parts.length === 1) {
      return concatOp.func(
        {
          left: ConstNode(index, index, this.scope.id, ""),
          op: "",
          right: parts[0]
        },
        this,
        index,
        this.line
      );
    } else {
      current = parts[0];
      for (_i = 1, _len = parts.length; _i < _len; ++_i) {
        part = parts[_i];
        current = concatOp.func(
          { left: current, op: "", right: part },
          this,
          index,
          this.line
        );
      }
      return current;
    }
  };
  Node.Super = SuperNode = (function (Node) {
    var _Node_prototype, _SuperNode_prototype;
    function SuperNode(startIndex, endIndex, scopeId, child, args) {
      var _i, _len, _this;
      _this = this instanceof SuperNode ? this : __create(_SuperNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (child == null) {
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
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.child = child;
      _this.args = args;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SuperNode_prototype = SuperNode.prototype = __create(_Node_prototype);
    _SuperNode_prototype.constructor = SuperNode;
    SuperNode.displayName = "SuperNode";
    SuperNode.cappedName = "Super";
    SuperNode.argNames = ["child", "args"];
    State.addNodeFactory("super", SuperNode);
    _SuperNode_prototype._reduce = function (o) {
      var args, child;
      if (this.child != null) {
        child = this.child.reduce(o).doWrap(o);
      } else {
        child = this.child;
      }
      args = map(
        this.args,
        function (node, o) {
          return node.reduce(o).doWrap(o);
        },
        o
      );
      if (child !== this.child || args !== this.args) {
        return SuperNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          child,
          args
        );
      } else {
        return this;
      }
    };
    _SuperNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SuperNode", this.child, this.args);
    };
    _SuperNode_prototype.walk = function (f) {
      var args, child;
      if (this.child instanceof Node) {
        child = f(this.child);
      } else {
        child = this.child;
      }
      args = map(this.args, f);
      if (child !== this.child || args !== this.args) {
        return SuperNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          child,
          args
        );
      } else {
        return this;
      }
    };
    _SuperNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      function next(child) {
        return mapAsync(_this.args, f, function (_e, args) {
          if (_e != null) {
            return callback(_e);
          }
          return callback(null, child !== _this.child || args !== _this.args
            ? SuperNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              child,
              args
            )
            : _this);
        });
      }
      if (this.child instanceof Node) {
        return f(this.child, function (_e, child) {
          if (_e != null) {
            return callback(_e);
          }
          return next(child);
        });
      } else {
        return next(this.child);
      }
    };
    return SuperNode;
  }(Node));
  Node.Switch = SwitchNode = (function (Node) {
    var _Node_prototype, _SwitchNode_prototype;
    function SwitchNode(startIndex, endIndex, scopeId, node, cases, defaultCase, label) {
      var _this;
      _this = this instanceof SwitchNode ? this : __create(_SwitchNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(cases)) {
        throw TypeError("Expected cases to be an Array, got " + __typeof(cases));
      }
      if (defaultCase == null) {
        defaultCase = void 0;
      } else if (!(defaultCase instanceof Node)) {
        throw TypeError("Expected defaultCase to be a Node or undefined, got " + __typeof(defaultCase));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.cases = cases;
      _this.defaultCase = defaultCase;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SwitchNode_prototype = SwitchNode.prototype = __create(_Node_prototype);
    _SwitchNode_prototype.constructor = SwitchNode;
    SwitchNode.displayName = "SwitchNode";
    SwitchNode.cappedName = "Switch";
    SwitchNode.argNames = ["node", "cases", "defaultCase", "label"];
    State.addNodeFactory("switch", SwitchNode);
    _SwitchNode_prototype.type = function (o) {
      var _ref, _this;
      _this = this;
      if ((_ref = this._type) == null) {
        return this._type = (function () {
          var _arr, _i, _len, case_, type;
          if (_this.defaultCase != null) {
            type = _this.defaultCase.type(o);
          } else {
            type = Type["undefined"];
          }
          for (_arr = __toArray(_this.cases), _i = 0, _len = _arr.length; _i < _len; ++_i) {
            case_ = _arr[_i];
            if (case_.fallthrough) {
              type = type;
            } else {
              type = type.union(case_.body.type(o));
            }
          }
          return type;
        }());
      } else {
        return _ref;
      }
    };
    _SwitchNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return SwitchNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.node,
        this.cases,
        this.defaultCase,
        label
      );
    };
    _SwitchNode_prototype.walk = function (f) {
      var cases, defaultCase, label, node;
      node = f(this.node);
      cases = map(this.cases, function (case_) {
        var caseBody, caseNode;
        caseNode = f(case_.node);
        caseBody = f(case_.body);
        if (caseNode !== case_.node || caseBody !== case_.body) {
          return { node: caseNode, body: caseBody, fallthrough: case_.fallthrough };
        } else {
          return case_;
        }
      });
      if (this.defaultCase) {
        defaultCase = f(this.defaultCase);
      } else {
        defaultCase = this.defaultCase;
      }
      if (this.label != null) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (node !== this.node || cases !== this.cases || defaultCase !== this.defaultCase || label !== this.label) {
        return SwitchNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          node,
          cases,
          defaultCase,
          label
        );
      } else {
        return this;
      }
    };
    _SwitchNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return mapAsync(
          _this.cases,
          function (case_, cb) {
            return f(case_.node, function (_e2, caseNode) {
              if (_e2 != null) {
                return cb(_e2);
              }
              return f(case_.body, function (_e3, caseBody) {
                if (_e3 != null) {
                  return cb(_e3);
                }
                return cb(null, caseNode !== case_.node || caseBody !== case_.body ? { node: caseNode, body: caseBody, fallthrough: case_.fallthrough } : case_);
              });
            });
          },
          function (_e2, cases) {
            if (_e2 != null) {
              return callback(_e2);
            }
            function next(defaultCase) {
              function next(label) {
                return callback(null, node !== _this.node || cases !== _this.cases || defaultCase !== _this.defaultCase || label !== _this.label
                  ? SwitchNode(
                    _this.startIndex,
                    _this.endIndex,
                    _this.scopeId,
                    node,
                    cases,
                    defaultCase,
                    label
                  )
                  : _this);
              }
              if (_this.label != null) {
                return f(_this.label, function (_e3, x) {
                  if (_e3 != null) {
                    return callback(_e3);
                  }
                  return next(x);
                });
              } else {
                return next(_this.label);
              }
            }
            if (_this.defaultCase != null) {
              return f(_this.defaultCase, function (_e3, x) {
                if (_e3 != null) {
                  return callback(_e3);
                }
                return next(x);
              });
            } else {
              return next(_this.defaultCase);
            }
          }
        );
      });
    };
    _SwitchNode_prototype.isStatement = function () {
      return true;
    };
    _SwitchNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "SwitchNode",
        this.node,
        this.cases,
        this.defaultCase,
        this.label
      );
    };
    return SwitchNode;
  }(Node));
  Node.SyntaxChoice = SyntaxChoiceNode = (function (Node) {
    var _Node_prototype, _SyntaxChoiceNode_prototype;
    function SyntaxChoiceNode(startIndex, endIndex, scopeId, choices) {
      var _i, _len, _this;
      _this = this instanceof SyntaxChoiceNode ? this : __create(_SyntaxChoiceNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(choices)) {
        throw TypeError("Expected choices to be an Array, got " + __typeof(choices));
      } else {
        for (_i = 0, _len = choices.length; _i < _len; ++_i) {
          if (!(choices[_i] instanceof Node)) {
            throw TypeError("Expected choices[" + _i + "] to be a Node, got " + __typeof(choices[_i]));
          }
        }
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.choices = choices;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxChoiceNode_prototype = SyntaxChoiceNode.prototype = __create(_Node_prototype);
    _SyntaxChoiceNode_prototype.constructor = SyntaxChoiceNode;
    SyntaxChoiceNode.displayName = "SyntaxChoiceNode";
    SyntaxChoiceNode.cappedName = "SyntaxChoice";
    SyntaxChoiceNode.argNames = ["choices"];
    State.addNodeFactory("syntaxChoice", SyntaxChoiceNode);
    _SyntaxChoiceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxChoiceNode", this.choices);
    };
    _SyntaxChoiceNode_prototype.walk = function (f) {
      var choices;
      choices = map(this.choices, f);
      if (choices !== this.choices) {
        return SyntaxChoiceNode(this.startIndex, this.endIndex, this.scopeId, choices);
      } else {
        return this;
      }
    };
    _SyntaxChoiceNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.choices, f, function (_e, choices) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, choices !== _this.choices ? SyntaxChoiceNode(_this.startIndex, _this.endIndex, _this.scopeId, choices) : _this);
      });
    };
    return SyntaxChoiceNode;
  }(Node));
  Node.SyntaxMany = SyntaxManyNode = (function (Node) {
    var _Node_prototype, _SyntaxManyNode_prototype;
    function SyntaxManyNode(startIndex, endIndex, scopeId, inner, multiplier) {
      var _this;
      _this = this instanceof SyntaxManyNode ? this : __create(_SyntaxManyNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(inner instanceof Node)) {
        throw TypeError("Expected inner to be a Node, got " + __typeof(inner));
      }
      if (typeof multiplier !== "string") {
        throw TypeError("Expected multiplier to be a String, got " + __typeof(multiplier));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.inner = inner;
      _this.multiplier = multiplier;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxManyNode_prototype = SyntaxManyNode.prototype = __create(_Node_prototype);
    _SyntaxManyNode_prototype.constructor = SyntaxManyNode;
    SyntaxManyNode.displayName = "SyntaxManyNode";
    SyntaxManyNode.cappedName = "SyntaxMany";
    SyntaxManyNode.argNames = ["inner", "multiplier"];
    State.addNodeFactory("syntaxMany", SyntaxManyNode);
    _SyntaxManyNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxManyNode", this.inner, this.multiplier);
    };
    _SyntaxManyNode_prototype.walk = function (f) {
      var inner;
      inner = f(this.inner);
      if (inner !== this.inner) {
        return SyntaxManyNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          inner,
          this.multiplier
        );
      } else {
        return this;
      }
    };
    _SyntaxManyNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.inner, function (_e, inner) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, inner !== _this.inner
          ? SyntaxManyNode(
            _this.startIndex,
            _this.endIndex,
            _this.scopeId,
            inner,
            _this.multiplier
          )
          : _this);
      });
    };
    return SyntaxManyNode;
  }(Node));
  Node.SyntaxParam = SyntaxParamNode = (function (Node) {
    var _Node_prototype, _SyntaxParamNode_prototype;
    function SyntaxParamNode(startIndex, endIndex, scopeId, ident, asType) {
      var _this;
      _this = this instanceof SyntaxParamNode ? this : __create(_SyntaxParamNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(ident instanceof Node)) {
        throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
      }
      if (asType == null) {
        asType = void 0;
      } else if (!(asType instanceof Node)) {
        throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.asType = asType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxParamNode_prototype = SyntaxParamNode.prototype = __create(_Node_prototype);
    _SyntaxParamNode_prototype.constructor = SyntaxParamNode;
    SyntaxParamNode.displayName = "SyntaxParamNode";
    SyntaxParamNode.cappedName = "SyntaxParam";
    SyntaxParamNode.argNames = ["ident", "asType"];
    State.addNodeFactory("syntaxParam", SyntaxParamNode);
    _SyntaxParamNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxParamNode", this.ident, this.asType);
    };
    _SyntaxParamNode_prototype.walk = function (f) {
      var asType, ident;
      ident = f(this.ident);
      if (this.asType instanceof Node) {
        asType = f(this.asType);
      } else {
        asType = this.asType;
      }
      if (ident !== this.ident || asType !== this.asType) {
        return SyntaxParamNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          ident,
          asType
        );
      } else {
        return this;
      }
    };
    _SyntaxParamNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.ident, function (_e, ident) {
        if (_e != null) {
          return callback(_e);
        }
        function next(asType) {
          return callback(null, ident !== _this.ident || asType !== _this.asType
            ? SyntaxParamNode(
              _this.startIndex,
              _this.endIndex,
              _this.scopeId,
              ident,
              asType
            )
            : _this);
        }
        if (_this.asType instanceof Node) {
          return f(_this.asType, function (_e2, asType) {
            if (_e2 != null) {
              return callback(_e2);
            }
            return next(asType);
          });
        } else {
          return next(_this.asType);
        }
      });
    };
    return SyntaxParamNode;
  }(Node));
  Node.SyntaxSequence = SyntaxSequenceNode = (function (Node) {
    var _Node_prototype, _SyntaxSequenceNode_prototype;
    function SyntaxSequenceNode(startIndex, endIndex, scopeId, params) {
      var _i, _len, _this;
      _this = this instanceof SyntaxSequenceNode ? this : __create(_SyntaxSequenceNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(params)) {
        throw TypeError("Expected params to be an Array, got " + __typeof(params));
      } else {
        for (_i = 0, _len = params.length; _i < _len; ++_i) {
          if (!(params[_i] instanceof Node)) {
            throw TypeError("Expected params[" + _i + "] to be a Node, got " + __typeof(params[_i]));
          }
        }
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.params = params;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _SyntaxSequenceNode_prototype = SyntaxSequenceNode.prototype = __create(_Node_prototype);
    _SyntaxSequenceNode_prototype.constructor = SyntaxSequenceNode;
    SyntaxSequenceNode.displayName = "SyntaxSequenceNode";
    SyntaxSequenceNode.cappedName = "SyntaxSequence";
    SyntaxSequenceNode.argNames = ["params"];
    State.addNodeFactory("syntaxSequence", SyntaxSequenceNode);
    _SyntaxSequenceNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "SyntaxSequenceNode", this.params);
    };
    _SyntaxSequenceNode_prototype.walk = function (f) {
      var params;
      params = map(this.params, f);
      if (params !== this.params) {
        return SyntaxSequenceNode(this.startIndex, this.endIndex, this.scopeId, params);
      } else {
        return this;
      }
    };
    _SyntaxSequenceNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.params, f, function (_e, params) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, params !== _this.params ? SyntaxSequenceNode(_this.startIndex, _this.endIndex, _this.scopeId, params) : _this);
      });
    };
    return SyntaxSequenceNode;
  }(Node));
  Node.This = ThisNode = (function (Node) {
    var _Node_prototype, _ThisNode_prototype;
    function ThisNode(startIndex, endIndex, scopeId) {
      var _this;
      _this = this instanceof ThisNode ? this : __create(_ThisNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ThisNode_prototype = ThisNode.prototype = __create(_Node_prototype);
    _ThisNode_prototype.constructor = ThisNode;
    ThisNode.displayName = "ThisNode";
    ThisNode.cappedName = "This";
    ThisNode.argNames = [];
    State.addNodeFactory("this", ThisNode);
    _ThisNode_prototype.cacheable = false;
    _ThisNode_prototype._isNoop = function () {
      return true;
    };
    _ThisNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ThisNode");
    };
    return ThisNode;
  }(Node));
  Node.Throw = ThrowNode = (function (Node) {
    var _Node_prototype, _ThrowNode_prototype;
    function ThrowNode(startIndex, endIndex, scopeId, node) {
      var _this;
      _this = this instanceof ThrowNode ? this : __create(_ThrowNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _ThrowNode_prototype = ThrowNode.prototype = __create(_Node_prototype);
    _ThrowNode_prototype.constructor = ThrowNode;
    ThrowNode.displayName = "ThrowNode";
    ThrowNode.cappedName = "Throw";
    ThrowNode.argNames = ["node"];
    State.addNodeFactory("throw", ThrowNode);
    _ThrowNode_prototype.type = function () {
      return Type.none;
    };
    _ThrowNode_prototype.isStatement = function () {
      return true;
    };
    _ThrowNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap(o);
      if (node !== this.node) {
        return ThrowNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _ThrowNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "ThrowNode", this.node);
    };
    _ThrowNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return ThrowNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _ThrowNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? ThrowNode(_this.startIndex, _this.endIndex, _this.scopeId, node) : _this);
      });
    };
    return ThrowNode;
  }(Node));
  Node.Tmp = TmpNode = (function (Node) {
    var _Node_prototype, _TmpNode_prototype;
    function TmpNode(startIndex, endIndex, scopeId, id, name, _type) {
      var _this;
      _this = this instanceof TmpNode ? this : __create(_TmpNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (typeof id !== "number") {
        throw TypeError("Expected id to be a Number, got " + __typeof(id));
      }
      if (typeof name !== "string") {
        throw TypeError("Expected name to be a String, got " + __typeof(name));
      }
      if (_type == null) {
        _type = Type.any;
      } else if (!(_type instanceof Type)) {
        throw TypeError("Expected _type to be a Type, got " + __typeof(_type));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.id = id;
      _this.name = name;
      _this._type = _type;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TmpNode_prototype = TmpNode.prototype = __create(_Node_prototype);
    _TmpNode_prototype.constructor = TmpNode;
    TmpNode.displayName = "TmpNode";
    TmpNode.cappedName = "Tmp";
    TmpNode.argNames = ["id", "name", "_type"];
    State.addNodeFactory("tmp", TmpNode);
    _TmpNode_prototype.cacheable = false;
    _TmpNode_prototype.type = function () {
      return this._type;
    };
    _TmpNode_prototype._isNoop = function () {
      return true;
    };
    _TmpNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TmpNode",
        this.id,
        this.name,
        this._type
      );
    };
    _TmpNode_prototype.walk = function (f) {
      return this;
    };
    _TmpNode_prototype.walkAsync = function (f, callback) {
      return callback(null, this);
    };
    return TmpNode;
  }(Node));
  Node.TmpWrapper = TmpWrapperNode = (function (Node) {
    var _Node_prototype, _TmpWrapperNode_prototype;
    function TmpWrapperNode(startIndex, endIndex, scopeId, node, tmps) {
      var _this;
      _this = this instanceof TmpWrapperNode ? this : __create(_TmpWrapperNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      if (!__isArray(tmps)) {
        throw TypeError("Expected tmps to be an Array, got " + __typeof(tmps));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      _this.tmps = tmps;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TmpWrapperNode_prototype = TmpWrapperNode.prototype = __create(_Node_prototype);
    _TmpWrapperNode_prototype.constructor = TmpWrapperNode;
    TmpWrapperNode.displayName = "TmpWrapperNode";
    TmpWrapperNode.cappedName = "TmpWrapper";
    TmpWrapperNode.argNames = ["node", "tmps"];
    State.addNodeFactory("tmpWrapper", TmpWrapperNode);
    _TmpWrapperNode_prototype.type = function (o) {
      return this.node.type(o);
    };
    _TmpWrapperNode_prototype.withLabel = function (label, o) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return TmpWrapperNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.node.withLabel(label, o),
        this.tmps
      );
    };
    _TmpWrapperNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o);
      if (this.tmps.length === 0) {
        return node;
      } else if (this.node !== node) {
        return TmpWrapperNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          node,
          this.tmps
        );
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.isStatement = function () {
      return this.node.isStatement();
    };
    _TmpWrapperNode_prototype._isNoop = function (o) {
      return this.node.isNoop(o);
    };
    _TmpWrapperNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TmpWrapperNode", this.node, this.tmps);
    };
    _TmpWrapperNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return TmpWrapperNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          node,
          this.tmps
        );
      } else {
        return this;
      }
    };
    _TmpWrapperNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node
          ? TmpWrapperNode(
            _this.startIndex,
            _this.endIndex,
            _this.scopeId,
            node,
            _this.tmps
          )
          : _this);
      });
    };
    return TmpWrapperNode;
  }(Node));
  Node.TryCatch = TryCatchNode = (function (Node) {
    var _Node_prototype, _TryCatchNode_prototype;
    function TryCatchNode(startIndex, endIndex, scopeId, tryBody, catchIdent, catchBody, label) {
      var _this;
      _this = this instanceof TryCatchNode ? this : __create(_TryCatchNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(catchIdent instanceof Node)) {
        throw TypeError("Expected catchIdent to be a Node, got " + __typeof(catchIdent));
      }
      if (!(catchBody instanceof Node)) {
        throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.tryBody = tryBody;
      _this.catchIdent = catchIdent;
      _this.catchBody = catchBody;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TryCatchNode_prototype = TryCatchNode.prototype = __create(_Node_prototype);
    _TryCatchNode_prototype.constructor = TryCatchNode;
    TryCatchNode.displayName = "TryCatchNode";
    TryCatchNode.cappedName = "TryCatch";
    TryCatchNode.argNames = ["tryBody", "catchIdent", "catchBody", "label"];
    State.addNodeFactory("tryCatch", TryCatchNode);
    _TryCatchNode_prototype.type = function (o) {
      var _ref;
      if ((_ref = this._type) == null) {
        return this._type = this.tryBody.type(o).union(this.catchBody.type(o));
      } else {
        return _ref;
      }
    };
    _TryCatchNode_prototype.isStatement = function () {
      return true;
    };
    _TryCatchNode_prototype._isNoop = function (o) {
      return this.tryBody.isNoop(o);
    };
    _TryCatchNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return TryCatchNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.tryBody,
        this.catchIdent,
        this.catchBody,
        label
      );
    };
    _TryCatchNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TryCatchNode",
        this.tryBody,
        this.catchIdent,
        this.catchBody,
        this.label
      );
    };
    _TryCatchNode_prototype.walk = function (f) {
      var catchBody, catchIdent, label, tryBody;
      tryBody = f(this.tryBody);
      catchIdent = f(this.catchIdent);
      catchBody = f(this.catchBody);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (tryBody !== this.tryBody || catchIdent !== this.catchIdent || catchBody !== this.catchBody || label !== this.label) {
        return TryCatchNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          tryBody,
          catchIdent,
          catchBody,
          label
        );
      } else {
        return this;
      }
    };
    _TryCatchNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.tryBody, function (_e, tryBody) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.catchIdent, function (_e2, catchIdent) {
          if (_e2 != null) {
            return callback(_e2);
          }
          return f(_this.catchBody, function (_e3, catchBody) {
            if (_e3 != null) {
              return callback(_e3);
            }
            function next(label) {
              return callback(null, tryBody !== _this.tryBody || catchIdent !== _this.catchIdent || catchBody !== _this.catchBody || label !== _this.label
                ? TryCatchNode(
                  _this.startIndex,
                  _this.endIndex,
                  _this.scopeId,
                  tryBody,
                  catchIdent,
                  catchBody,
                  label
                )
                : _this);
            }
            if (_this.label instanceof Node) {
              return f(_this.label, function (_e4, label) {
                if (_e4 != null) {
                  return callback(_e4);
                }
                return next(label);
              });
            } else {
              return next(_this.label);
            }
          });
        });
      });
    };
    return TryCatchNode;
  }(Node));
  Node.TryFinally = TryFinallyNode = (function (Node) {
    var _Node_prototype, _TryFinallyNode_prototype;
    function TryFinallyNode(startIndex, endIndex, scopeId, tryBody, finallyBody, label) {
      var _this;
      _this = this instanceof TryFinallyNode ? this : __create(_TryFinallyNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(tryBody instanceof Node)) {
        throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
      }
      if (!(finallyBody instanceof Node)) {
        throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
      }
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.tryBody = tryBody;
      _this.finallyBody = finallyBody;
      _this.label = label;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TryFinallyNode_prototype = TryFinallyNode.prototype = __create(_Node_prototype);
    _TryFinallyNode_prototype.constructor = TryFinallyNode;
    TryFinallyNode.displayName = "TryFinallyNode";
    TryFinallyNode.cappedName = "TryFinally";
    TryFinallyNode.argNames = ["tryBody", "finallyBody", "label"];
    State.addNodeFactory("tryFinally", TryFinallyNode);
    _TryFinallyNode_prototype.type = function (o) {
      return this.tryBody.type(o);
    };
    _TryFinallyNode_prototype._reduce = function (o) {
      var finallyBody, label, tryBody;
      tryBody = this.tryBody.reduce(o);
      finallyBody = this.finallyBody.reduce(o);
      if (this.label != null) {
        label = this.label.reduce(o);
      } else {
        label = this.label;
      }
      if (finallyBody instanceof NothingNode) {
        return BlockNode(this.startIndex, this.endIndex, this.scopeIf([tryBody], label)).reduce(o);
      } else if (tryBody instanceof NothingNode) {
        return BlockNode(this.startIndex, this.endIndex, this.scopeIf([finallyBody], label)).reduce(o);
      } else if (tryBody !== this.tryBody || finallyBody !== this.finallyBody || label !== this.label) {
        return TryFinallyNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          tryBody,
          finallyBody,
          label
        );
      } else {
        return this;
      }
    };
    _TryFinallyNode_prototype.isStatement = function () {
      return true;
    };
    _TryFinallyNode_prototype._isNoop = function (o) {
      var _ref;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = this.tryBody.isNoop(o) && this.finallyBody.isNoop();
      } else {
        return _ref;
      }
    };
    _TryFinallyNode_prototype.withLabel = function (label) {
      if (label == null) {
        label = null;
      } else if (!(label instanceof IdentNode) && !(label instanceof TmpNode)) {
        throw TypeError("Expected label to be an IdentNode or TmpNode or null, got " + __typeof(label));
      }
      return TryFinallyNode(
        this.startIndex,
        this.endIndex,
        this.scopeId,
        this.tryBody,
        this.finallyBody,
        label
      );
    };
    _TryFinallyNode_prototype.inspect = function (depth) {
      return inspectHelper(
        depth,
        "TryFinallyNode",
        this.tryBody,
        this.finallyBody,
        this.label
      );
    };
    _TryFinallyNode_prototype.walk = function (f) {
      var finallyBody, label, tryBody;
      tryBody = f(this.tryBody);
      finallyBody = f(this.finallyBody);
      if (this.label instanceof Node) {
        label = f(this.label);
      } else {
        label = this.label;
      }
      if (tryBody !== this.tryBody || finallyBody !== this.finallyBody || label !== this.label) {
        return TryFinallyNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          tryBody,
          finallyBody,
          label
        );
      } else {
        return this;
      }
    };
    _TryFinallyNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.tryBody, function (_e, tryBody) {
        if (_e != null) {
          return callback(_e);
        }
        return f(_this.finallyBody, function (_e2, finallyBody) {
          if (_e2 != null) {
            return callback(_e2);
          }
          function next(label) {
            return callback(null, tryBody !== _this.tryBody || finallyBody !== _this.finallyBody || label !== _this.label
              ? TryFinallyNode(
                _this.startIndex,
                _this.endIndex,
                _this.scopeId,
                tryBody,
                finallyBody,
                label
              )
              : _this);
          }
          if (_this.label instanceof Node) {
            return f(_this.label, function (_e3, label) {
              if (_e3 != null) {
                return callback(_e3);
              }
              return next(label);
            });
          } else {
            return next(_this.label);
          }
        });
      });
    };
    return TryFinallyNode;
  }(Node));
  Node.TypeArray = TypeArrayNode = (function (Node) {
    var _Node_prototype, _TypeArrayNode_prototype;
    function TypeArrayNode(startIndex, endIndex, scopeId, subtype) {
      var _this;
      _this = this instanceof TypeArrayNode ? this : __create(_TypeArrayNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(subtype instanceof Node)) {
        throw TypeError("Expected subtype to be a Node, got " + __typeof(subtype));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.subtype = subtype;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeArrayNode_prototype = TypeArrayNode.prototype = __create(_Node_prototype);
    _TypeArrayNode_prototype.constructor = TypeArrayNode;
    TypeArrayNode.displayName = "TypeArrayNode";
    TypeArrayNode.cappedName = "TypeArray";
    TypeArrayNode.argNames = ["subtype"];
    State.addNodeFactory("typeArray", TypeArrayNode);
    _TypeArrayNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeArrayNode", this.subtype);
    };
    _TypeArrayNode_prototype.walk = function (f) {
      var subtype;
      subtype = f(this.subtype);
      if (subtype !== this.subtype) {
        return TypeArrayNode(this.startIndex, this.endIndex, this.scopeId, subtype);
      } else {
        return this;
      }
    };
    _TypeArrayNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.subtype, function (_e, subtype) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, subtype !== _this.subtype ? TypeArrayNode(_this.startIndex, _this.endIndex, _this.scopeId, subtype) : _this);
      });
    };
    return TypeArrayNode;
  }(Node));
  Node.TypeFunction = TypeFunctionNode = (function (Node) {
    var _Node_prototype, _TypeFunctionNode_prototype;
    function TypeFunctionNode(startIndex, endIndex, scopeId, returnType) {
      var _this;
      _this = this instanceof TypeFunctionNode ? this : __create(_TypeFunctionNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(returnType instanceof Node)) {
        throw TypeError("Expected returnType to be a Node, got " + __typeof(returnType));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.returnType = returnType;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeFunctionNode_prototype = TypeFunctionNode.prototype = __create(_Node_prototype);
    _TypeFunctionNode_prototype.constructor = TypeFunctionNode;
    TypeFunctionNode.displayName = "TypeFunctionNode";
    TypeFunctionNode.cappedName = "TypeFunction";
    TypeFunctionNode.argNames = ["returnType"];
    State.addNodeFactory("typeFunction", TypeFunctionNode);
    _TypeFunctionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeFunctionNode", this.returnType);
    };
    _TypeFunctionNode_prototype.walk = function (f) {
      var returnType;
      returnType = f(this.returnType);
      if (returnType !== this.returnType) {
        return TypeFunctionNode(this.startIndex, this.endIndex, this.scopeId, returnType);
      } else {
        return this;
      }
    };
    _TypeFunctionNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.returnType, function (_e, returnType) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, returnType !== _this.returnType ? TypeFunctionNode(_this.startIndex, _this.endIndex, _this.scopeId, returnType) : _this);
      });
    };
    return TypeFunctionNode;
  }(Node));
  Node.TypeObject = TypeObjectNode = (function (Node) {
    var _Node_prototype, _TypeObjectNode_prototype;
    function TypeObjectNode(startIndex, endIndex, scopeId, pairs) {
      var _this;
      _this = this instanceof TypeObjectNode ? this : __create(_TypeObjectNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(pairs)) {
        throw TypeError("Expected pairs to be an Array, got " + __typeof(pairs));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.pairs = pairs;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeObjectNode_prototype = TypeObjectNode.prototype = __create(_Node_prototype);
    _TypeObjectNode_prototype.constructor = TypeObjectNode;
    TypeObjectNode.displayName = "TypeObjectNode";
    TypeObjectNode.cappedName = "TypeObject";
    TypeObjectNode.argNames = ["pairs"];
    State.addNodeFactory("typeObject", TypeObjectNode);
    function reducePair(pair, o) {
      var key, value;
      key = pair.key.reduce(o);
      value = pair.value.reduce(o);
      if (key !== pair.key || value !== pair.value) {
        return { key: key, value: value };
      } else {
        return pair;
      }
    }
    _TypeObjectNode_prototype._reduce = function (o) {
      var pairs;
      pairs = map(this.pairs, reducePair, o);
      if (pairs !== this.pairs) {
        return TypeObjectNode(this.startIndex, this.endIndex, this.scopeId, pairs);
      } else {
        return this;
      }
    };
    _TypeObjectNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeObjectNode", this.pairs);
    };
    _TypeObjectNode_prototype.walk = function (f) {
      return this;
    };
    _TypeObjectNode_prototype.walkAsync = function (f, callback) {
      return callback(null, this);
    };
    return TypeObjectNode;
  }(Node));
  Node.TypeUnion = TypeUnionNode = (function (Node) {
    var _Node_prototype, _TypeUnionNode_prototype;
    function TypeUnionNode(startIndex, endIndex, scopeId, types) {
      var _i, _len, _this;
      _this = this instanceof TypeUnionNode ? this : __create(_TypeUnionNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!__isArray(types)) {
        throw TypeError("Expected types to be an Array, got " + __typeof(types));
      } else {
        for (_i = 0, _len = types.length; _i < _len; ++_i) {
          if (!(types[_i] instanceof Node)) {
            throw TypeError("Expected types[" + _i + "] to be a Node, got " + __typeof(types[_i]));
          }
        }
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.types = types;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _TypeUnionNode_prototype = TypeUnionNode.prototype = __create(_Node_prototype);
    _TypeUnionNode_prototype.constructor = TypeUnionNode;
    TypeUnionNode.displayName = "TypeUnionNode";
    TypeUnionNode.cappedName = "TypeUnion";
    TypeUnionNode.argNames = ["types"];
    State.addNodeFactory("typeUnion", TypeUnionNode);
    _TypeUnionNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "TypeUnionNode", this.types);
    };
    _TypeUnionNode_prototype.walk = function (f) {
      var types;
      types = map(this.types, f);
      if (types !== this.types) {
        return TypeUnionNode(this.startIndex, this.endIndex, this.scopeId, types);
      } else {
        return this;
      }
    };
    _TypeUnionNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return mapAsync(this.types, f, function (_e, types) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, types !== _this.types ? TypeUnionNode(_this.startIndex, _this.endIndex, _this.scopeId, types) : _this);
      });
    };
    return TypeUnionNode;
  }(Node));
  Node.Unary = UnaryNode = (function (Node) {
    var _Node_prototype, _UnaryNode_prototype;
    function UnaryNode(startIndex, endIndex, scopeId, op, node) {
      var _this;
      _this = this instanceof UnaryNode ? this : __create(_UnaryNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (typeof op !== "string") {
        throw TypeError("Expected op to be a String, got " + __typeof(op));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.op = op;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _UnaryNode_prototype = UnaryNode.prototype = __create(_Node_prototype);
    _UnaryNode_prototype.constructor = UnaryNode;
    UnaryNode.displayName = "UnaryNode";
    UnaryNode.cappedName = "Unary";
    UnaryNode.argNames = ["op", "node"];
    State.addNodeFactory("unary", UnaryNode);
    _UnaryNode_prototype.type = (function () {
      var ops;
      ops = {
        "-": Type.number,
        "+": Type.number,
        "--": Type.number,
        "++": Type.number,
        "--post": Type.number,
        "++post": Type.number,
        "!": Type.boolean,
        "~": Type.number,
        "typeof": Type.string,
        "delete": Type.boolean
      };
      return function () {
        var _ref;
        return (__owns.call(ops, _ref = this.op) ? ops[_ref] : void 0) || Type.any;
      };
    }());
    _UnaryNode_prototype._reduce = (function () {
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
                this.scopeId,
                node.op === "-" ? "+" : "-",
                node.node
              );
            }
          } else if (node instanceof BinaryNode) {
            if ((_ref = node.op) === "-" || _ref === "+") {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                this.scopeId,
                node.left,
                node.op === "-" ? "+" : "-",
                node.right
              );
            } else if ((_ref = node.op) === "*" || _ref === "/") {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                this.scopeId,
                UnaryNode(
                  this.startIndex,
                  node.left.endIndex,
                  node.left.scopeId,
                  "-",
                  node.left
                ),
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
                this.scopeId,
                UnaryNode(
                  x.startIndex,
                  x.endIndex,
                  x.scopeId,
                  "!",
                  x
                ),
                "||",
                UnaryNode(
                  y.startIndex,
                  y.endIndex,
                  y.scopeId,
                  "!",
                  y
                )
              );
            },
            "||": function (x, y) {
              return BinaryNode(
                this.startIndex,
                this.endIndex,
                this.scopeId,
                UnaryNode(
                  x.startIndex,
                  x.endIndex,
                  x.scopeId,
                  "!",
                  x
                ),
                "&&",
                UnaryNode(
                  y.startIndex,
                  y.endIndex,
                  y.scopeId,
                  "!",
                  y
                )
              );
            }
          };
          return function (node, o) {
            var invert;
            if (node instanceof UnaryNode) {
              if (node.op === "!" && node.node.type(o).isSubsetOf(Type.boolean)) {
                return node.node;
              }
            } else if (node instanceof BinaryNode && __owns.call(invertibleBinaryOps, node.op)) {
              invert = invertibleBinaryOps[node.op];
              if (typeof invert === "function") {
                return invert.call(this, node.left, node.right);
              } else {
                return BinaryNode(
                  this.startIndex,
                  this.endIndex,
                  this.scopeId,
                  node.left,
                  invert,
                  node.right
                );
              }
            }
          };
        }()),
        "typeof": (function () {
          var objectType;
          objectType = Type["null"].union(Type.object).union(Type.arrayLike).union(Type.regexp).union(Type.date).union(Type.error);
          return function (node, o) {
            var type;
            if (node.isNoop(o)) {
              type = node.type(o);
              if (type.isSubsetOf(Type.number)) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "number");
              } else if (type.isSubsetOf(Type.string)) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "string");
              } else if (type.isSubsetOf(Type.boolean)) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "boolean");
              } else if (type.isSubsetOf(Type["undefined"])) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "undefined");
              } else if (type.isSubsetOf(Type["function"])) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "function");
              } else if (type.isSubsetOf(objectType)) {
                return ConstNode(this.startIndex, this.endIndex, this.scopeId, "object");
              }
            }
          };
        }())
      };
      return function (o) {
        var node, op, result;
        node = this.node.reduce(o).doWrap(o);
        op = this.op;
        if (node.isConst() && __owns.call(constOps, op)) {
          return ConstNode(this.startIndex, this.endIndex, this.scopeId, constOps[op](node.constValue()));
        }
        if (__owns.call(nonconstOps, op)) {
          result = nonconstOps[op].call(this, node, o);
        }
        if (result != null) {
          return result.reduce(o);
        }
        if (node !== this.node) {
          return UnaryNode(
            this.startIndex,
            this.endIndex,
            this.scopeId,
            op,
            node
          );
        } else {
          return this;
        }
      };
    }());
    _UnaryNode_prototype._isNoop = function (o) {
      var _ref, _ref2;
      if ((_ref = this.__isNoop) == null) {
        return this.__isNoop = (_ref2 = this.op) !== "++" && _ref2 !== "--" && _ref2 !== "++post" && _ref2 !== "--post" && _ref2 !== "delete" && this.node.isNoop(o);
      } else {
        return _ref;
      }
    };
    _UnaryNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "UnaryNode", this.op, this.node);
    };
    _UnaryNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return UnaryNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          this.op,
          node
        );
      } else {
        return this;
      }
    };
    _UnaryNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node
          ? UnaryNode(
            _this.startIndex,
            _this.endIndex,
            _this.scopeId,
            _this.op,
            node
          )
          : _this);
      });
    };
    return UnaryNode;
  }(Node));
  Node.Var = VarNode = (function (Node) {
    var _Node_prototype, _VarNode_prototype;
    function VarNode(startIndex, endIndex, scopeId, ident, isMutable) {
      var _this;
      _this = this instanceof VarNode ? this : __create(_VarNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(ident instanceof IdentNode) && !(ident instanceof TmpNode)) {
        throw TypeError("Expected ident to be an IdentNode or TmpNode, got " + __typeof(ident));
      }
      if (isMutable == null) {
        isMutable = false;
      } else if (typeof isMutable !== "boolean") {
        throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.ident = ident;
      _this.isMutable = isMutable;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _VarNode_prototype = VarNode.prototype = __create(_Node_prototype);
    _VarNode_prototype.constructor = VarNode;
    VarNode.displayName = "VarNode";
    VarNode.cappedName = "Var";
    VarNode.argNames = ["ident", "isMutable"];
    State.addNodeFactory("var", VarNode);
    _VarNode_prototype.type = function () {
      return Type["undefined"];
    };
    _VarNode_prototype._reduce = function (o) {
      var ident;
      ident = this.ident.reduce(o);
      if (ident !== this.ident) {
        return VarNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          ident,
          this.isMutable
        );
      } else {
        return this;
      }
    };
    _VarNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "VarNode", this.ident, this.isMutable);
    };
    _VarNode_prototype.walk = function (f) {
      var ident;
      ident = f(this.ident);
      if (ident !== this.ident) {
        return VarNode(
          this.startIndex,
          this.endIndex,
          this.scopeId,
          ident,
          this.isMutable
        );
      } else {
        return this;
      }
    };
    _VarNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.ident, function (_e, ident) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, ident !== _this.ident
          ? VarNode(
            _this.startIndex,
            _this.endIndex,
            _this.scopeId,
            ident,
            _this.isMutable
          )
          : _this);
      });
    };
    return VarNode;
  }(Node));
  Node.Yield = YieldNode = (function (Node) {
    var _Node_prototype, _YieldNode_prototype;
    function YieldNode(startIndex, endIndex, scopeId, node) {
      var _this;
      _this = this instanceof YieldNode ? this : __create(_YieldNode_prototype);
      if (typeof startIndex !== "number") {
        throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
      }
      if (typeof endIndex !== "number") {
        throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
      }
      if (typeof scopeId !== "number") {
        throw TypeError("Expected scopeId to be a Number, got " + __typeof(scopeId));
      }
      if (!(node instanceof Node)) {
        throw TypeError("Expected node to be a Node, got " + __typeof(node));
      }
      _this.startIndex = startIndex;
      _this.endIndex = endIndex;
      _this.scopeId = scopeId;
      _this._reduced = void 0;
      _this._macroExpanded = void 0;
      _this._macroExpandAlled = void 0;
      _this.node = node;
      return _this;
    }
    _Node_prototype = Node.prototype;
    _YieldNode_prototype = YieldNode.prototype = __create(_Node_prototype);
    _YieldNode_prototype.constructor = YieldNode;
    YieldNode.displayName = "YieldNode";
    YieldNode.cappedName = "Yield";
    YieldNode.argNames = ["node"];
    State.addNodeFactory("yield", YieldNode);
    _YieldNode_prototype.type = function () {
      return Type["undefined"];
    };
    _YieldNode_prototype.isStatement = function () {
      return true;
    };
    _YieldNode_prototype._reduce = function (o) {
      var node;
      node = this.node.reduce(o).doWrap(o);
      if (node !== this.node) {
        return YieldNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _YieldNode_prototype.inspect = function (depth) {
      return inspectHelper(depth, "YieldNode", this.node);
    };
    _YieldNode_prototype.walk = function (f) {
      var node;
      node = f(this.node);
      if (node !== this.node) {
        return YieldNode(this.startIndex, this.endIndex, this.scopeId, node);
      } else {
        return this;
      }
    };
    _YieldNode_prototype.walkAsync = function (f, callback) {
      var _this;
      _this = this;
      return f(this.node, function (_e, node) {
        if (_e != null) {
          return callback(_e);
        }
        return callback(null, node !== _this.node ? YieldNode(_this.startIndex, _this.endIndex, _this.scopeId, node) : _this);
      });
    };
    return YieldNode;
  }(Node));
  function withoutRepeats(array) {
    var _arr, _i, _len, item, lastItem, result;
    result = [];
    lastItem = void 0;
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (item !== lastItem) {
        result.push(item);
      }
      lastItem = item;
    }
    return result;
  }
  function buildExpected(errors) {
    var errs;
    errs = withoutRepeats(errors.slice().sort(function (a, b) {
      return __cmp(a.toLowerCase(), b.toLowerCase());
    }));
    switch (errs.length) {
    case 0: return "End of input";
    case 1: return errs[0];
    case 2: return __strnum(errs[0]) + " or " + __strnum(errs[1]);
    default:
      return __strnum(__slice(errs, 0, -1).join(", ")) + ", or " + __strnum(errs[__num(errs.length) - 1]);
    }
  }
  function buildErrorMessage(errors, lastToken) {
    return "Expected " + __strnum(buildExpected(errors)) + ", but " + __strnum(lastToken) + " found";
  }
  function parse(text, macros, options, callback) {
    var o, startTime;
    if (typeof text !== "string") {
      throw TypeError("Expected text to be a String, got " + __typeof(text));
    }
    if (macros == null) {
      macros = null;
    } else if (!(macros instanceof MacroHolder)) {
      throw TypeError("Expected macros to be a MacroHolder or null, got " + __typeof(macros));
    }
    if (options == null) {
      options = {};
    } else if (!__isObject(options)) {
      throw TypeError("Expected options to be an Object, got " + __typeof(options));
    }
    if (callback == null) {
      callback = null;
    } else if (typeof callback !== "function") {
      throw TypeError("Expected callback to be a Function or null, got " + __typeof(callback));
    }
    o = State(
      text,
      macros != null ? macros.clone() : void 0,
      options
    );
    startTime = new Date().getTime();
    function next(result) {
      var _ref, endParseTime, err, index, lastToken, line, messages, next;
      endParseTime = new Date().getTime();
      if (typeof options.progress === "function") {
        options.progress("parse", __num(endParseTime) - __num(startTime));
      }
      if (!result || __lt(o.index, o.data.length)) {
        index = (_ref = o.failures).index;
        line = _ref.line;
        messages = _ref.messages;
        if (__lt(index, o.data.length)) {
          lastToken = JSON.stringify(o.data.substring(index, __num(index) + 20));
        } else {
          lastToken = "end-of-input";
        }
        err = ParserError(
          buildErrorMessage(messages, lastToken),
          o.data,
          index,
          line
        );
        if (callback != null) {
          return callback(err);
        } else {
          throw err;
        }
      } else {
        next = function (expanded) {
          var endExpandTime, endReduceTime, reduced, ret;
          endExpandTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("macroExpand", __num(endExpandTime) - __num(endParseTime));
          }
          reduced = expanded.reduce(o);
          endReduceTime = new Date().getTime();
          if (typeof options.progress === "function") {
            options.progress("reduce", __num(endReduceTime) - __num(endExpandTime));
          }
          ret = {
            result: reduced,
            macros: o.macros,
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
        };
        if (callback != null) {
          return o.macroExpandAllAsync(result, function (_e, expanded) {
            if (_e != null) {
              return callback(_e);
            }
            return next(expanded);
          });
        } else {
          return next(o.macroExpandAll(result));
        }
      }
    }
    if (callback != null) {
      return Root(o, function (err, root) {
        if (err != null && err !== SHORT_CIRCUIT) {
          return callback(err);
        }
        return next(root);
      });
    } else {
      try {
        return next(Root(o));
      } catch (e) {
        if (e !== SHORT_CIRCUIT) {
          throw e;
        } else {
          return next();
        }
      }
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
      result: NothingNode(0, 0, -1),
      macros: macros
    };
  };
  function unique(array) {
    var _arr, _i, _len, item, result;
    result = [];
    for (_arr = __toArray(array), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      item = _arr[_i];
      if (!__in(item, result)) {
        result.push(item);
      }
    }
    return result;
  }
  module.exports.getReservedWords = function (macros) {
    return unique(__toArray(RESERVED_IDENTS).concat(__toArray((macros != null && typeof macros.getMacroAndOperatorNames === "function" ? macros.getMacroAndOperatorNames() : void 0) || [])));
  };
}.call(this));
