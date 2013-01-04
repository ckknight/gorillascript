"use strict";
var __cmp, __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, _inAst, _indexSlice, _Name, _NameOrSymbol, _Space, _statement, _Symbol, Addition, Advance, AlphaNum, AnyChar, ArgumentsLiteral, ArrayLiteral, ArrayParameter, ArrayType, Assignment, Ast, Asterix, AsToken, AstToken, AsType, AtSign, Backslash, BackslashEscapeSequence, BackslashStringLiteral, BasicInvocationOrAccess, bB, BinaryDigit, BinaryInteger, BitwiseAnd, BitwiseOr, BitwiseShift, BitwiseXor, Block, Body, BodyOrStatement, Break, CheckIndent, CheckStop, CloseCurlyBrace, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonEqual, Comma, CommaOrNewline, CommaOrNewlineWithCheckIndent, Comment, Comparison, ComplexAssignable, CompoundAssignment, CompoundAssignmentOp, ConstantLiteral, Containment, Continue, CountIndent, Debugger, DecimalDigit, DecimalDigits, DecimalNumber, Declarable, DeclareEqualSymbol, DedentedBody, DefineHelper, DefineHelperStart, DirectAssignment, DollarSign, DoubleColon, DoubleQuote, DoubleStringLiteral, DualObjectKey, eE, EmptyLine, EmptyLines, Eof, EscapeSequence, Eval, EvalToken, ExistentialOr, ExistentialSymbol, ExistentialSymbolNoSpace, ExistentialUnary, Exponentiation, Expression, ExpressionAsStatement, ExpressionOrAssignment, ExpressionOrNothing, FailureManager, FalseLiteral, freeze, fromCharCode, FunctionBody, FunctionDeclaration, FunctionLiteral, generateCacheKey, HashSign, HexDigit, HexEscapeSequence, HexInteger, Identifier, IdentifierDeclarable, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrAccessPart, IdentifierOrAccessStart, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierParameter, inAst, InBlock, IndentedObjectLiteral, INDENTS, Index, IndexMultiple, IndexSlice, inExpression, InfinityLiteral, inIndexSlice, inStatement, InvocationArguments, InvocationOrAccess, KeyValuePair, KvpParameter, Let, Letter, LetToken, Line, Literal, Logic, LogicalAnd, LogicalOr, LogicalXor, LowerR, LowerU, LowerX, Macro, MacroBody, MacroHelper, MacroHolder, MacroName, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, MacroToken, Max, MaybeAdvance, MaybeAsType, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExistentialSymbol, MaybeExistentialSymbolNoSpace, MaybeMutableToken, MaybeNotToken, MaybeSpreadToken, Min, MinMax, Minus, MultiLineComment, Multiplication, MutableToken, Name, NameChar, NamePart, NameStart, NaNLiteral, Negate, Newline, NoSpace, NOTHING, Nothing, NotToken, NullLiteral, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectLiteral, ObjectParameter, OctalDigit, OctalInteger, oO, OpenCurlyBrace, OpenParenthesis, OpenParenthesisChar, OpenSquareBracket, OpenSquareBracketChar, Operator, ParamDualObjectKey, Parameter, Parameters, ParameterSequence, ParamSingularObjectKey, Parenthetical, ParserError, ParserNode, Period, Pipe, PipeChar, Plus, PlusOrMinus, PopIndent, PrimaryExpression, PushIndent, RadixInteger, RawDecimalDigits, RegexDoubleToken, RegexFlags, RegexLiteral, RegexSingleToken, Return, ReturnToken, Root, Semicolon, SemicolonChar, Shebang, SHORT_CIRCUIT, SimpleAssignable, SimpleConstantLiteral, SimpleOrArrayType, SimpleType, SingleEscapeCharacter, SingleLineComment, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, SomeSpace, Space, SpaceChar, SpaceNewline, Spaceship, SpreadOrExpression, SpreadToken, Stack, State, Statement, Stop, StringConcatenation, StringIndent, StringInterpolation, StringLiteral, Symbol, SymbolChar, SyntaxToken, ThisLiteral, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, TripleDoubleQuote, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TypeReference, Unary, UnclosedArguments, UnclosedObjectLiteral, Underscore, UnicodeEscapeSequence, UnionType, UseMacro, VoidLiteral, WhiteSpace, xX, Yield, YieldToken, Zero;
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
    throw TypeError("Expected a number, got " + typeof num);
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
__slice = Function.prototype.call.bind(Array.prototype.slice);
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
freeze = typeof Object.freeze === "function" ? Object.freeze
  : function (o) {
    return o;
  };
SHORT_CIRCUIT = freeze(__create({
  toString: function () {
    return "short-circuit";
  }
}));
NOTHING = freeze(__create({
  toString: function () {
    return "";
  }
}));
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
    throw Error("Assertion failed: " + __strnum(String(value)));
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
    return named(
      rule != null ? rule.parserName : void 0,
      function (o) {
        var _ref, cache, indent, indentCache, index, inner, item, result;
        cache = o.cache;
        indent = o.indent.peek();
        indentCache = (_ref = cache[indent]) != null ? _ref : (cache[indent] = []);
        inner = (_ref = indentCache[cacheKey]) != null ? _ref : (indentCache[cacheKey] = []);
        index = o.index;
        item = inner[index];
        if (item === void 0) {
          result = rule(o);
          if (o.indent.peek() !== indent) {
            throw Error("Changed indent during cache process: from " + __strnum(indent) + " to " + __strnum(o.indent.peek()));
          }
          if (!result) {
            inner[index] = false;
          } else {
            inner[index] = [o.index, result];
          }
          return result;
        } else if (!item) {
          return false;
        } else {
          o.index = item[0];
          return item[1];
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
  for (i = 0, _len = __num(array.length); i < _len; ++i) {
    item = array[i];
    key = void 0;
    rule = void 0;
    if (Array.isArray(item)) {
      if (item.length !== 2) {
        throw Error("Found an array with #(item.length) length at index #" + __strnum(i));
      }
      if (typeof item[0] !== "string") {
        throw TypeError("Array in index #" + __strnum(i) + " has an improper key: " + __strnum(__typeof(item[0])));
      }
      if (typeof item[1] !== "function") {
        throw TypeError("Array in index #" + __strnum(i) + " has an improper rule: " + __strnum(__typeof(item[1])));
      }
      key = item[0];
      rule = item[1];
    } else if (typeof item === "function") {
      rule = item;
    } else {
      throw TypeError("Found a non-array, non-function in index #" + __strnum(i) + ": " + __strnum(__typeof(item)));
    }
    rules.push(rule);
    mapping.push(key);
    ruleName = rule.parserName || "<unknown>";
    if (!__lte(i, 0) && name[__num(name.length) - 1].slice(-1) === '"' && ruleName.charAt(0) === '"' && ruleName.slice(-1) === '"') {
      name[__num(name.length) - 1] = name[__num(name.length) - 1].substring(0, __num(name[__num(name.length) - 1].length) - 1);
      name.push(ruleName.substring(1));
    } else {
      if (!__lte(i, 0)) {
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
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof mutator === "function") {
          return mutator(result, o, index);
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
    _rule = named(failureMessage, function (o) {
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
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof mutator === "function") {
          return mutator(result, o, index);
        } else if (mutator !== void 0) {
          return mutator;
        } else {
          return result;
        }
      }
    );
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
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof mutator === "function") {
          return mutator(result, o, index);
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
    throw TypeError("Expected a function, got " + __strnum(__typeof(func)));
  }
  if (func.displayName) {
    return func.displayName;
  } else if (func.name) {
    return func.name;
  } else {
    match = RegExp("^function\\s*(.*?)").exec(func.toString());
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
    id = __num(id) + 1;
    i = id;
    console.log(__strnum(i) + "-" + __strnum(name) + " starting at " + __strnum(o.indent.peek()) + ":" + __strnum(o.index));
    result = func(o);
    if (!result) {
      console.log(__strnum(i) + "-" + __strnum(name) + " failure at " + __strnum(o.indent.peek()) + ":" + __strnum(o.index));
    } else {
      console.log(__strnum(i) + "-" + __strnum(name) + " success at " + __strnum(o.indent.peek()) + ":" + __strnum(o.index), result);
    }
    return result;
  });
}
Stack = (function () {
  function Stack(initial, data) {
    this.initial = initial;
    if (data == null) {
      data = [];
    }
    this.data = data;
    if (!(this instanceof Stack)) {
      throw TypeError("Must be instantiated with new");
    }
  }
  Stack.prototype.push = function (value) {
    return this.data.push(value);
  };
  Stack.prototype.pop = function () {
    var data, len;
    data = this.data;
    len = data.length;
    if (len === 0) {
      throw Error("Cannot pop");
    }
    return data.pop();
  };
  Stack.prototype.canPop = function () {
    return !__lte(this.data.length, 0);
  };
  Stack.prototype.peek = function () {
    var data, len;
    data = this.data;
    len = data.length;
    if (len === 0) {
      return this.initial;
    } else {
      return data[__num(len) - 1];
    }
  };
  Stack.prototype.clone = function () {
    return new Stack(this.initial, __slice(
      this.data,
      void 0,
      void 0
    ));
  };
  return Stack;
}());
function makeAlterStack(stack, value) {
  if (!(stack instanceof Stack)) {
    throw TypeError("Expected stack to be a Stack, got " + __strnum(__typeof(stack)));
  }
  return function (func) {
    if (typeof func !== "function") {
      throw TypeError("Expected a function, got " + __strnum(__typeof(func)));
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
_statement = new Stack(true);
inStatement = makeAlterStack(_statement, true);
inExpression = makeAlterStack(_statement, false);
_inAst = new Stack(false);
inAst = makeAlterStack(_inAst, true);
Eof = cache(named("Eof", function (o) {
  return !__lt(o.index, o.data.length);
}));
WhiteSpace = cache(named("WhiteSpace", (function () {
  var _rule;
  _rule = named("[\\t \\r\\n]", function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 9 || c === 10 || c === 13 || c === 32) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail("[\\t \\r\\n]");
      return false;
    }
  });
  return (function () {
    var _rule2;
    _rule2 = named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        o.update(clone);
        return result;
      }
    );
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
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
SpaceChar = cache(named("SpaceChar", named("[\\t ]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 9 || c === 32) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[\\t ]");
    return false;
  }
})));
_Space = cache(named("_Space", (function () {
  var _rule;
  _rule = named(
    __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = SpaceChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
      o.update(clone);
      return result;
    }
  );
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    }
  );
}())));
Newline = cache(named("Newline", (function () {
  var _rule, _rule2;
  _rule = (function () {
    var _rule2;
    _rule2 = named('"\\r"', function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 13) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail('"\\r"');
        return false;
      }
    });
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          return true;
        } else {
          o.update(clone);
          return result;
        }
      }
    );
  }());
  _rule2 = named('"\\n"', function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 10) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail('"\\n"');
      return false;
    }
  });
  return (function () {
    function _rule3(o) {
      var clone;
      clone = o.clone();
      if (_rule(clone) && _rule2(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else {
          return true;
        }
      }
    );
  }());
}())));
Stop = cache(named("Stop", function (o) {
  return Newline(o) || Eof(o);
}));
CheckStop = cache(named("CheckStop", function (o) {
  return Stop(o.clone());
}));
SingleLineComment = cache(named("SingleLineComment", function (o) {
  var c, data, index, len;
  data = o.data;
  index = o.index;
  if (data.charCodeAt(index) === 47 && data.charCodeAt(__num(index) + 1) === 47) {
    len = data.length;
    index = __num(index) + 2;
    for (; ; index = __num(index) + 1) {
      c = data.charCodeAt(index);
      if (!__lt(index, len) || c === 13 || c === 10) {
        o.index = index;
        return true;
      }
    }
  } else {
    return false;
  }
}));
MultiLineComment = cache(named("MultiLineComment", function (o) {
  var c, data, index, len;
  data = o.data;
  index = o.index;
  if (data.charCodeAt(index) === 47 && data.charCodeAt(__num(index) + 1) === 42) {
    len = data.length;
    index = __num(index) + 2;
    for (; ; index = __num(index) + 1) {
      if (!__lt(index, len)) {
        o.error("Multi-line comment never ends");
      } else {
        c = data.charCodeAt(index);
        if (c === 42 && data.charCodeAt(__num(index) + 1) === 47) {
          o.index = __num(index) + 2;
          Space(o);
          return true;
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
  __strnum((Comment != null ? Comment.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
      __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = SpaceChar(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
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
  "!" + __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<unknown>"),
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
    __strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = EmptyLine(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
      o.update(clone);
      return result;
    }
  );
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
    __strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "<nothing>") + "+",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = EmptyLine(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  );
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    }
  );
}())));
Shebang = cache(named("Shebang", (function () {
  var _rule, _rule2, _rule3;
  _rule = named('"#"', function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 35) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail('"#"');
      return false;
    }
  });
  _rule2 = named('"!"', function (o) {
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 33) {
      o.index = __num(o.index) + 1;
      return c;
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
        "!" + __strnum((Newline != null ? Newline.parserName : void 0) || "<unknown>"),
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
      __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule4(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule4 != null ? _rule4.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
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
INDENTS = { "9": 4, "32": 1 };
CountIndent = cache(named("CountIndent", (function () {
  var _rule;
  _rule = named(
    __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = SpaceChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
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
        throw Error("Unexpected indent char: " + __strnum(JSON.stringify(c)));
      }
      count = __num(count) + __num(i);
    }
    return count;
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
    CountIndent != null ? CountIndent.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = CountIndent(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
function withSpace(func) {
  if (typeof func !== "function") {
    throw TypeError("Expected a function, got " + __strnum(__typeof(func)));
  }
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = func(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
}
Zero = cache(named("Zero", named('"0"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 48) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"0"');
    return false;
  }
})));
DecimalDigit = cache(named("DecimalDigit", named("[0123456789]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c >= 48 && c <= 57) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[0123456789]");
    return false;
  }
})));
Period = cache(named("Period", named('"."', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 46) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"."');
    return false;
  }
})));
Colon = cache(named("Colon", named('":"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 58) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('":"');
    return false;
  }
})));
PipeChar = cache(named("PipeChar", named('"|"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 124) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"|"');
    return false;
  }
})));
Pipe = cache(named("Pipe", withSpace(PipeChar)));
DoubleColon = cache(named("DoubleColon", (function () {
  function _rule(o) {
    var clone;
    clone = o.clone();
    if (Colon(clone) && Colon(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else {
        return "::";
      }
    }
  );
}())));
eE = cache(named("eE", named("[eE]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 69 || c === 101) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[eE]");
    return false;
  }
})));
Minus = cache(named("Minus", named('"-"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 45) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"-"');
    return false;
  }
})));
Plus = cache(named("Plus", named('"+"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 43) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"+"');
    return false;
  }
})));
PlusOrMinus = cache(named("PlusOrMinus", function (o) {
  return Minus(o) || Plus(o);
}));
xX = cache(named("xX", named("[xX]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 88 || c === 120) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[xX]");
    return false;
  }
})));
oO = cache(named("oO", named("[oO]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 79 || c === 111) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[oO]");
    return false;
  }
})));
bB = cache(named("bB", named("[bB]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 66 || c === 98) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[bB]");
    return false;
  }
})));
LowerU = cache(named("LowerU", named('"u"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 117) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"u"');
    return false;
  }
})));
LowerX = cache(named("LowerX", named('"x"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 120) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"x"');
    return false;
  }
})));
HexDigit = cache(named("HexDigit", named("[0123456789abcdefABCDEF]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c >= 48 && c <= 57 || c >= 65 && c <= 70 || c >= 97 && c <= 102) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[0123456789abcdefABCDEF]");
    return false;
  }
})));
OctalDigit = cache(named("OctalDigit", named("[01234567]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c >= 48 && c <= 55) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[01234567]");
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
Letter = cache(named("Letter", named("[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c >= 65 && c <= 90 || c >= 97 && c <= 122) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]");
    return false;
  }
})));
AlphaNum = cache(named("AlphaNum", named("[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]");
    return false;
  }
})));
Underscore = cache(named("Underscore", named('"_"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 95) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"_"');
    return false;
  }
})));
DollarSign = cache(named("DollarSign", named('"$"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 36) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"$"');
    return false;
  }
})));
AtSign = cache(named("AtSign", named('"@"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 64) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"@"');
    return false;
  }
})));
HashSign = cache(named("HashSign", withSpace(named('"#"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 35) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"#"');
    return false;
  }
}))));
NameStart = cache(named("NameStart", function (o) {
  return Letter(o) || Underscore(o) || DollarSign(o);
}));
NameChar = cache(named("NameChar", function (o) {
  return NameStart(o) || DecimalDigit(o);
}));
SymbolChar = cache(named("SymbolChar", named("[!#%&*+-/<=>?\\\\^`|~]", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 33 || c === 35 || c === 37 || c === 38 || c === 42 || c === 43 || c === 45 || c === 47 || c >= 60 && c <= 63 || c === 92 || c === 94 || c === 96 || c === 124 || c === 126) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("[!#%&*+-/<=>?\\\\^`|~]");
    return false;
  }
})));
DoubleQuote = cache(named("DoubleQuote", named("'\"'", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 34) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("'\"'");
    return false;
  }
})));
SingleQuote = cache(named("SingleQuote", named("\"'\"", function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 39) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail("\"'\"");
    return false;
  }
})));
TripleDoubleQuote = cache(named("TripleDoubleQuote", (function () {
  var _rule;
  _rule = named(
    __strnum((DoubleQuote != null ? DoubleQuote.parserName : void 0) || "<nothing>") + "{3}",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = DoubleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (!__lt(result.length, 3)) {
            break;
          }
        }
        return _arr;
      }());
      if (!__lt(result.length, 3)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  );
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
    __strnum((SingleQuote != null ? SingleQuote.parserName : void 0) || "<nothing>") + "{3}",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = SingleQuote(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (!__lt(result.length, 3)) {
            break;
          }
        }
        return _arr;
      }());
      if (!__lt(result.length, 3)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
  );
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 59) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('";"');
    return false;
  }
})));
Semicolon = cache(named("Semicolon", withSpace(SemicolonChar)));
Asterix = cache(named("Asterix", named('"*"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 42) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"*"');
    return false;
  }
})));
OpenParenthesisChar = cache(named("OpenParenthesisChar", named('"("', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 40) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"("');
    return false;
  }
})));
OpenParenthesis = cache(named("OpenParenthesis", withSpace(OpenParenthesisChar)));
CloseParenthesis = cache(named("CloseParenthesis", withSpace(named('")"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 41) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('")"');
    return false;
  }
}))));
OpenSquareBracketChar = cache(named("OpenSquareBracketChar", named('"["', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 91) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"["');
    return false;
  }
})));
OpenSquareBracket = cache(named("OpenSquareBracket", withSpace(OpenSquareBracketChar)));
CloseSquareBracket = cache(named("CloseSquareBracket", withSpace(named('"]"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 93) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"]"');
    return false;
  }
}))));
OpenCurlyBrace = cache(named("OpenCurlyBrace", withSpace(named('"{"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 123) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"{"');
    return false;
  }
}))));
CloseCurlyBrace = cache(named("CloseCurlyBrace", withSpace(named('"}"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 125) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"}"');
    return false;
  }
}))));
Backslash = cache(named("Backslash", named('"\\\\"', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 92) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"\\\\"');
    return false;
  }
})));
Comma = cache(named("Comma", withSpace(named('","', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 44) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('","');
    return false;
  }
}))));
MaybeComma = cache(named("MaybeComma", named(
  __strnum((Comma != null ? Comma.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
      __strnum((SomeEmptyLinesWithCheckIndent != null ? SomeEmptyLinesWithCheckIndent.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
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
  __strnum((CommaOrNewline != null ? CommaOrNewline.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
    __strnum((NameChar != null ? NameChar.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = NameChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
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
  if (array == null) {
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
      if (Minus(clone) && (result = NamePart(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Name = cache(named("Name", function (o) {
  var clone, result;
  clone = o.clone();
  result = void 0;
  if (Space(clone) && (result = _Name(clone))) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
}));
_Symbol = cache(named("_Symbol", (function () {
  var _rule;
  _rule = named(
    __strnum((SymbolChar != null ? SymbolChar.parserName : void 0) || "<nothing>") + "+",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = SymbolChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
      if (!__lt(result.length, 1)) {
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
Symbol = cache(named("Symbol", function (o) {
  var clone, result;
  clone = o.clone();
  result = void 0;
  if (Space(clone) && (result = _Symbol(clone))) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
}));
_NameOrSymbol = (function () {
  function _rule(o) {
    return _Name(o) || _Symbol(o);
  }
  return (function () {
    var _rule2;
    _rule2 = named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    o.index = __num(o.index) + 1;
    return o.data.charCodeAt(index) || -1;
  }
}));
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
      __strnum((Period != null ? Period.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
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
  __strnum((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "<nothing>") + "+",
  function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _arr, item;
      for (_arr = []; ; ) {
        item = DecimalDigit(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _arr;
    }());
    if (!__lt(result.length, 1)) {
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
        __strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = Underscore(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
          if (!__lt(result.length, 1)) {
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    var _rule2;
    _rule2 = (function () {
      function _rule3(o) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
    var _rule3;
    _rule3 = (function () {
      var _rule4;
      _rule4 = named(
        __strnum((PlusOrMinus != null ? PlusOrMinus.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = PlusOrMinus(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index);
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
          if ((result.e = eE(clone)) && (result.op = _rule4(clone)) && (result.digits = DecimalDigits(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return "" + (__strnum(fromCharCode(x.e)) + __strnum(x.op !== NOTHING ? fromCharCode(x.op) : "")) + __strnum(x.digits);
        }
        return named(
          _rule5 != null ? _rule5.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule5(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
      __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
        var clone, index, result;
        index = o.index;
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
      if (decimal === NOTHING) {
        decimal = "";
      }
      scientific = x.scientific;
      if (scientific === NOTHING) {
        scientific = "";
      }
      text = "" + (__strnum(x.integer) + __strnum(decimal)) + __strnum(scientific);
      value = Number(text);
      if (!isFinite(value)) {
        o.error("Unable to parse number: " + __strnum(text));
      }
      return o["const"](i, value);
    }
    return named(
      _rule4 != null ? _rule4.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule4(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = digit(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
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
          __strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = Underscore(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
            if (!__lt(result.length, 1)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
        );
        _rule5 = named(
          __strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = digit(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
            if (!__lt(result.length, 1)) {
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
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<nothing>") + "*",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = _rule3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _rule2(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index);
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
              value = __num(value) + __num(decimalNum) / __num(Math.pow(__num(radix), __num(decimal.length)));
              break;
            } else {
              decimal = decimal.slice(0, -1);
            }
          }
        }
        return o["const"](i, value);
      }
      return named(
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
HexInteger = cache(named("HexInteger", makeRadixInteger(16, xX, HexDigit)));
OctalInteger = cache(named("OctalInteger", makeRadixInteger(8, oO, OctalDigit)));
BinaryInteger = cache(named("BinaryInteger", makeRadixInteger(2, bB, BinaryDigit)));
RadixInteger = cache(named("RadixInteger", (function () {
  var GetDigits, Radix;
  GetDigits = (function () {
    var digitCache;
    digitCache = [];
    return function (radix) {
      var _ref;
      return (_ref = digitCache[radix]) != null ? _ref
        : (digitCache[radix] = (function () {
          var digit;
          digit = radix === 2 ? BinaryDigit
            : radix === 8 ? OctalDigit
            : radix === 10 ? DecimalDigit
            : radix === 16 ? HexDigit
            : (function () {
              var _end, chars, i;
              chars = [];
              for (i = 0, _end = __num(!__lte(radix, 10) ? radix : 10); i < _end; ++i) {
                chars[__num(i) + 48] = true;
              }
              for (i = 10, _end = __num(!__lte(radix, 36) ? radix : 36); i < _end; ++i) {
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
            }());
          return (function () {
            var _rule, _rule2;
            _rule = named(
              __strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+",
              function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _arr, item;
                  for (_arr = []; ; ) {
                    item = digit(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _arr;
                }());
                if (!__lt(result.length, 1)) {
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
                  __strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+",
                  function (o) {
                    var clone, result;
                    clone = o.clone();
                    result = [];
                    (function () {
                      var _arr, item;
                      for (_arr = []; ; ) {
                        item = Underscore(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      return _arr;
                    }());
                    if (!__lt(result.length, 1)) {
                      o.update(clone);
                      return result;
                    } else {
                      return false;
                    }
                  }
                );
                _rule5 = named(
                  __strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+",
                  function (o) {
                    var clone, result;
                    clone = o.clone();
                    result = [];
                    (function () {
                      var _arr, item;
                      for (_arr = []; ; ) {
                        item = digit(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      return _arr;
                    }());
                    if (!__lt(result.length, 1)) {
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
                __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<nothing>") + "*",
                function (o) {
                  var clone, result;
                  clone = o.clone();
                  result = [];
                  (function () {
                    var _arr, item;
                    for (_arr = []; ; ) {
                      item = _rule3(clone);
                      if (!item) {
                        break;
                      }
                      result.push(item);
                    }
                    return _arr;
                  }());
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
                _rule3 != null ? _rule3.parserName : void 0,
                function (o) {
                  var index, result;
                  index = o.index;
                  result = _rule3(o);
                  if (!result) {
                    return false;
                  } else if (typeof _mutator === "function") {
                    return _mutator(result, o, index);
                  } else if (_mutator !== void 0) {
                    return _mutator;
                  } else {
                    return result;
                  }
                }
              );
            }());
          }());
        }()));
    };
  }());
  Radix = named(
    (DecimalDigit != null ? DecimalDigit.parserName : void 0) || "<nothing>",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = DecimalDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (!__lt(result.length, 2)) {
            break;
          }
        }
        return _arr;
      }());
      if (!__lt(result.length, 1)) {
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
    } else if (__lt(radixNum, 2) || !__lte(radixNum, 36)) {
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
          if (isNaN(decimalNum)) {
            o.error("Unable to parse number: " + __strnum(radixNum) + "r" + __strnum(integer) + "." + __strnum(decimal));
          } else if (isFinite(decimalNum)) {
            value = __num(value) + __num(decimalNum) / __num(Math.pow(__num(radixNum), __num(decimal.length)));
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
      __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "<nothing>") + "{2}",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (!__lt(result.length, 2)) {
              break;
            }
          }
          return _arr;
        }());
        if (!__lt(result.length, 2)) {
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
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
      __strnum((HexDigit != null ? HexDigit.parserName : void 0) || "<nothing>") + "{4}",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = HexDigit(clone);
            if (!item) {
              break;
            }
            result.push(item);
            if (!__lt(result.length, 4)) {
              break;
            }
          }
          return _arr;
        }());
        if (!__lt(result.length, 4)) {
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
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
    "98": 8,
    "102": 12,
    "114": 13,
    "110": 10,
    "116": 9,
    "118": 11,
    "48": -1,
    "49": 1,
    "50": 2,
    "51": 3,
    "52": 4,
    "53": 5,
    "54": 6,
    "55": 7
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
      AnyChar != null ? AnyChar.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = AnyChar(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = _rule2(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
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
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
        var _rule3, _rule4;
        _rule3 = BackslashEscapeSequence;
        _rule4 = (function () {
          var _rule5;
          _rule5 = (function () {
            function _rule6(o) {
              return DoubleQuote(o) || Newline(o);
            }
            return named(
              "!" + __strnum((_rule6 != null ? _rule6.parserName : void 0) || "<unknown>"),
              function (o) {
                return !_rule6(o.clone());
              }
            );
          }());
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
        return function (o) {
          return _rule3(o) || StringInterpolation(o) || _rule4(o);
        };
      }());
      return named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = _rule2(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
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
          } else if (part.type !== "nothing") {
            if (!__lte(currentLiteral.length, 0)) {
              stringParts.push(processCharCodes(currentLiteral).join(""));
              currentLiteral = [];
            }
            stringParts.push(part);
          }
        }
        if (!__lte(currentLiteral.length, 0)) {
          stringParts.push(processCharCodes(currentLiteral).join(""));
        }
        if (stringParts.length === 0) {
          return o["const"](i, "");
        } else if (stringParts.length === 1 && typeof stringParts[0] === "string") {
          return o["const"](i, stringParts[0]);
        } else {
          return o.string(i, stringParts);
        }
      }
      return named(
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
      throw Error("Unexpected indent char: " + __strnum(JSON.stringify(c)));
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
      __strnum((_rule != null ? _rule.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        o.update(clone);
        return result;
      }
    );
    function _mutator(x) {
      return [processCharCodes(x).join("").replace(/[\t ]+$/, "")];
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    var _rule2, _rule3;
    _rule2 = BackslashEscapeSequence;
    _rule3 = (function () {
      var _rule4;
      _rule4 = (function () {
        function _rule5(o) {
          return TripleDoubleQuote(o) || Newline(o);
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
      return _rule2(o) || StringInterpolation(o) || _rule3(o);
    };
  }());
  return (function () {
    var _rule2;
    _rule2 = named(
      __strnum((_rule != null ? _rule.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
        } else if (part.type !== "nothing") {
          if (!__lte(currentLiteral.length, 0)) {
            stringParts.push(processCharCodes(currentLiteral).join(""));
            currentLiteral = [];
          }
          stringParts.push(part);
        }
      }
      if (!__lte(currentLiteral.length, 0)) {
        stringParts.push(processCharCodes(currentLiteral).join("").replace(/[\t ]+$/, ""));
      }
      return stringParts;
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
        function _rule2(o) {
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
          __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule2(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
            var _rule5;
            _rule5 = (function () {
              var _rule6;
              _rule6 = (function () {
                function _rule7(o) {
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
                  __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<nothing>") + "*",
                  function (o) {
                    var clone, result;
                    clone = o.clone();
                    result = [];
                    (function () {
                      var _arr, item;
                      for (_arr = []; ; ) {
                        item = _rule7(clone);
                        if (!item) {
                          break;
                        }
                        result.push(item);
                      }
                      return _arr;
                    }());
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
                  if (StringIndent(clone) && (result.head = line(clone)) && (result.tail = _rule6(clone))) {
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
                  _rule7 != null ? _rule7.parserName : void 0,
                  function (o) {
                    var index, result;
                    index = o.index;
                    result = _rule7(o);
                    if (!result) {
                      return false;
                    } else if (typeof _mutator === "function") {
                      return _mutator(result, o, index);
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
              __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
              function (o) {
                var clone, index, result;
                index = o.index;
                clone = o.clone();
                result = _rule5(clone);
                if (!result) {
                  if (typeof _missing === "function") {
                    return _missing(void 0, o, index);
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
          _rule5 = named(
            __strnum((Newline != null ? Newline.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, result;
              index = o.index;
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
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = _rule3(clone);
            if (!result) {
              if (typeof _missing === "function") {
                return _missing(void 0, o, index);
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
          var _end, _len, j, len, line, lines, result;
          lines = [x.first];
          if (lines[0].length === 0 || lines[0].length === 1 && lines[0][0] === "") {
            lines.shift();
          }
          for (j = 0, _end = __num(x.emptyLines.length); j < _end; ++j) {
            if (!__lte(j, 0) || !__lte(lines.length, 0)) {
              lines.push([""]);
            }
          }
          lines.push.apply(lines, __toArray(x.rest));
          len = lines.length;
          if (!__lte(len, 0) && (lines[__num(len) - 1].length === 0 || lines[__num(len) - 1].length === 1 && lines[__num(len) - 1][0] === "")) {
            lines.pop();
            len = __num(len) - 1;
          }
          result = [];
          for (j = 0, _len = __num(lines.length); j < _len; ++j) {
            line = lines[j];
            if (!__lte(j, 0)) {
              result.push("\n");
            }
            result.push.apply(result, __toArray(line));
          }
          for (j = __num(result.length) - 2; j > -1; --j) {
            if (typeof result[j] === "string" && typeof result[__num(j) + 1] === "string") {
              result.splice(j, 2, "" + result[j] + result[__num(j) + 1]);
            }
          }
          if (result.length === 0) {
            return o["const"](i, "");
          } else if (result.length === 1 && typeof result[0] === "string") {
            return o["const"](i, result[0]);
          } else {
            return o.string(i, result);
          }
        }
        return named(
          _rule3 != null ? _rule3.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule3(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
      _backend != null ? _backend.parserName : void 0,
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
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 114) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"r"');
    return false;
  }
})));
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
    __strnum((NamePart != null ? NamePart.parserName : void 0) || "<unknown>") + "?",
    function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = NamePart(clone);
      if (!result) {
        if (typeof _missing === "function") {
          return _missing(void 0, o, index);
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
RegexLiteral = cache(named("RegexLiteral", (function () {
  var _rule, _rule2;
  _rule = (function () {
    var _backend;
    _backend = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3;
        _rule3 = (function () {
          var _rule4, _rule5, _rule6;
          _rule4 = (function () {
            var _mutator;
            function _rule5(o) {
              var clone;
              clone = o.clone();
              if (DoubleQuote(clone) && DoubleQuote(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _mutator = 34;
            return named(
              _rule5 != null ? _rule5.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule5(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
          _rule5 = (function () {
            var _mutator;
            function _rule6(o) {
              var clone;
              clone = o.clone();
              if (Backslash(clone) && DollarSign(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _mutator = 36;
            return named(
              _rule6 != null ? _rule6.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule6(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              function _rule8(o) {
                return DoubleQuote(o) || Newline(o) || DollarSign(o);
              }
              return named(
                "!" + __strnum((_rule8 != null ? _rule8.parserName : void 0) || "<unknown>"),
                function (o) {
                  return !_rule8(o.clone());
                }
              );
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_rule7(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return _rule4(o) || _rule5(o) || _rule6(o) || StringInterpolation(o);
          };
        }());
        return named(
          __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule3(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
            o.update(clone);
            return result;
          }
        );
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (RegexDoubleToken(clone) && (result.text = _rule2(clone)) && DoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      _backend != null ? _backend.parserName : void 0,
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
  _rule2 = (function () {
    var _backend;
    _backend = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule5, _rule6;
          _rule5 = (function () {
            var _mutator;
            function _rule6(o) {
              var clone;
              clone = o.clone();
              if (SingleQuote(clone) && SingleQuote(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _mutator = 39;
            return named(
              _rule6 != null ? _rule6.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule6(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
                } else if (_mutator !== void 0) {
                  return _mutator;
                } else {
                  return result;
                }
              }
            );
          }());
          _rule6 = (function () {
            var _rule7;
            _rule7 = (function () {
              function _rule8(o) {
                return SingleQuote(o) || Newline(o);
              }
              return named(
                "!" + __strnum((_rule8 != null ? _rule8.parserName : void 0) || "<unknown>"),
                function (o) {
                  return !_rule8(o.clone());
                }
              );
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_rule7(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return _rule5(o) || _rule6(o);
          };
        }());
        return named(
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
            o.update(clone);
            return result;
          }
        );
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (RegexSingleToken(clone) && (result.text = _rule3(clone)) && SingleQuote(clone) && (result.flags = RegexFlags(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      _backend != null ? _backend.parserName : void 0,
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
    function _rule3(o) {
      return _rule(o) || _rule2(o);
    }
    function _mutator(x, o, i) {
      var _arr, _i, _len, currentLiteral, flags, part, stringParts, text;
      stringParts = [];
      currentLiteral = [];
      for (_arr = x.text, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
        part = _arr[_i];
        if (typeof part === "number") {
          currentLiteral.push(part);
        } else if (part.type !== "nothing") {
          if (!__lte(currentLiteral.length, 0)) {
            stringParts.push(processCharCodes(currentLiteral).join(""));
            currentLiteral = [];
          }
          stringParts.push(part);
        }
      }
      if (!__lte(currentLiteral.length, 0)) {
        stringParts.push(processCharCodes(currentLiteral).join(""));
      }
      flags = processCharCodes(x.flags).join("");
      text = stringParts.length === 0 ? o["const"](i, "")
        : stringParts.length === 1 && typeof stringParts[0] === "string" ? o["const"](i, stringParts[0])
        : o.string(i, stringParts);
      return o.regexp(i, text, flags);
    }
    return named(
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
  var result, startIndex;
  startIndex = o.index;
  result = Name(o);
  if (result) {
    return o["const"](startIndex, result);
  } else {
    return false;
  }
}));
IdentifierNameConstOrNumberLiteral = cache(named("IdentifierNameConstOrNumberLiteral", function (o) {
  return IdentifierNameConst(o) || NumberLiteral(o);
}));
Identifier = cache(named("Identifier", (function () {
  var RESERVED;
  RESERVED = [
    "and",
    "as",
    "AST",
    "arguments",
    "bitand",
    "bitlshift",
    "bitnot",
    "bitor",
    "bitrshift",
    "biturshift",
    "bitxor",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "def",
    "delete",
    "do",
    "else",
    "enum",
    "eval",
    "export",
    "extends",
    "fallthrough",
    "false",
    "finally",
    "for",
    "function",
    "haskey",
    "if",
    "import",
    "Infinity",
    "instanceofsome",
    "instanceof",
    "in",
    "let",
    "log",
    "macro",
    "max",
    "min",
    "mutable",
    "namespace",
    "NaN",
    "new",
    "not",
    "null",
    "or",
    "ownskey",
    "repeat",
    "return",
    "super",
    "switch",
    "then",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "unless",
    "until",
    "var",
    "void",
    "while",
    "with",
    "xor",
    "yield"
  ];
  return function (o) {
    var clone, index, result;
    index = o.index;
    clone = o.clone();
    result = Name(clone);
    if (!result || __in(result, RESERVED)) {
      o.fail("identifier");
      return false;
    } else {
      o.update(clone);
      return o.ident(index, result);
    }
  };
}())));
NotToken = cache(named("NotToken", word("not")));
MaybeNotToken = cache(named("MaybeNotToken", named(
  __strnum((NotToken != null ? NotToken.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
ExistentialSymbol = cache(named("ExistentialSymbol", symbol("?")));
MaybeExistentialSymbol = cache(named("MaybeExistentialSymbol", named(
  __strnum((ExistentialSymbol != null ? ExistentialSymbol.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
MaybeExistentialSymbolNoSpace = cache(named("MaybeExistentialSymbolNoSpace", named(
  __strnum((ExistentialSymbolNoSpace != null ? ExistentialSymbolNoSpace.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
Operator = cache(named("Operator", (function () {
  var _rule, _rule10, _rule11, _rule12, _rule13, _rule14, _rule15, _rule16, _rule17, _rule18, _rule19, _rule2, _rule20, _rule21, _rule22, _rule23, _rule24, _rule25, _rule26, _rule27, _rule28, _rule29, _rule3, _rule30, _rule31, _rule32, _rule33, _rule34, _rule35, _rule36, _rule37, _rule38, _rule39, _rule4, _rule40, _rule41, _rule42, _rule43, _rule44, _rule45, _rule46, _rule47, _rule48, _rule49, _rule5, _rule50, _rule51, _rule52, _rule53, _rule54, _rule55, _rule56, _rule57, _rule58, _rule59, _rule6, _rule60, _rule61, _rule62, _rule63, _rule64, _rule65, _rule7, _rule8, _rule9;
  _rule = wordOrSymbol("^");
  _rule2 = wordOrSymbol("*");
  _rule3 = wordOrSymbol("/");
  _rule4 = wordOrSymbol("\\");
  _rule5 = wordOrSymbol("%");
  _rule6 = wordOrSymbol("+");
  _rule7 = wordOrSymbol("-");
  _rule8 = wordOrSymbol("bitlshift");
  _rule9 = wordOrSymbol("bitrshift");
  _rule10 = wordOrSymbol("biturshift");
  _rule11 = wordOrSymbol("min");
  _rule12 = wordOrSymbol("max");
  _rule13 = wordOrSymbol("&");
  _rule14 = wordOrSymbol("~^");
  _rule15 = wordOrSymbol("~*");
  _rule16 = wordOrSymbol("~/");
  _rule17 = wordOrSymbol("~\\");
  _rule18 = wordOrSymbol("~%");
  _rule19 = wordOrSymbol("~+");
  _rule20 = wordOrSymbol("~-");
  _rule21 = wordOrSymbol("~bitlshift");
  _rule22 = wordOrSymbol("~bitrshift");
  _rule23 = wordOrSymbol("~biturshift");
  _rule24 = wordOrSymbol("~min");
  _rule25 = wordOrSymbol("~max");
  _rule26 = wordOrSymbol("~&");
  _rule27 = wordOrSymbol("in");
  _rule28 = wordOrSymbol("haskey");
  _rule29 = wordOrSymbol("ownskey");
  _rule30 = wordOrSymbol("instanceof");
  _rule31 = wordOrSymbol("instanceofsome");
  _rule32 = wordOrSymbol("<=>");
  _rule33 = wordOrSymbol("~=");
  _rule34 = wordOrSymbol("!~=");
  _rule35 = wordOrSymbol("==");
  _rule36 = wordOrSymbol("!=");
  _rule37 = wordOrSymbol("%%");
  _rule38 = wordOrSymbol("!%%");
  _rule39 = wordOrSymbol("~%%");
  _rule40 = wordOrSymbol("!~%%");
  _rule41 = wordOrSymbol("<");
  _rule42 = wordOrSymbol("<=");
  _rule43 = wordOrSymbol(">");
  _rule44 = wordOrSymbol(">=");
  _rule45 = wordOrSymbol("~<");
  _rule46 = wordOrSymbol("~<=");
  _rule47 = wordOrSymbol("~>");
  _rule48 = wordOrSymbol("~>=");
  _rule49 = wordOrSymbol("and");
  _rule50 = wordOrSymbol("or");
  _rule51 = wordOrSymbol("xor");
  _rule52 = wordOrSymbol("?");
  _rule53 = wordOrSymbol("bitand");
  _rule54 = wordOrSymbol("bitor");
  _rule55 = wordOrSymbol("bitxor");
  _rule56 = wordOrSymbol("~bitand");
  _rule57 = wordOrSymbol("~bitor");
  _rule58 = wordOrSymbol("~bitxor");
  _rule59 = (function () {
    function _rule60(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (NotToken(clone) && (result = MaybeNotToken(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x) {
      if (x === "not") {
        return "bool";
      } else {
        return "not";
      }
    }
    return named(
      _rule60 != null ? _rule60.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule60(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule60 = wordOrSymbol("bitnot");
  _rule61 = wordOrSymbol("~bitnot");
  _rule62 = (function () {
    var _rule63, _rule64;
    _rule63 = word("typeof");
    _rule64 = (function () {
      var _rule65;
      _rule65 = named('"!"', function (o) {
        var c;
        c = o.data.charCodeAt(o.index);
        if (c === 33) {
          o.index = __num(o.index) + 1;
          return c;
        } else {
          o.fail('"!"');
          return false;
        }
      });
      return named(
        __strnum((_rule65 != null ? _rule65.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _rule65(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index);
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
      function _rule65(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule63(clone) && (result = _rule64(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        if (x !== NOTHING) {
          return "typeof!";
        } else {
          return "typeof";
        }
      }
      return named(
        _rule65 != null ? _rule65.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule65(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }());
  _rule63 = (function () {
    var _rule64, _rule65;
    _rule64 = (function () {
      var _rule65, _rule66, _rule67;
      _rule65 = word("num");
      _rule66 = word("str");
      _rule67 = word("strnum");
      return function (o) {
        return _rule65(o) || _rule66(o) || _rule67(o);
      };
    }());
    _rule65 = named('"!"', function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 33) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail('"!"');
        return false;
      }
    });
    return (function () {
      function _rule66(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = _rule64(clone)) && _rule65(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        return __strnum(x) + "!";
      }
      return named(
        _rule66 != null ? _rule66.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule66(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
  }());
  _rule64 = wordOrSymbol("delete");
  _rule65 = (function () {
    var _rule66;
    _rule66 = word("throw");
    return (function () {
      function _rule67(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule66(clone) && (result = MaybeExistentialSymbolNoSpace(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x) {
        if (x === "?") {
          return "throw?";
        } else {
          return "throw";
        }
      }
      return named(
        _rule67 != null ? _rule67.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule67(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    function _rule66(o) {
      return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o) || _rule9(o) || _rule10(o) || _rule11(o) || _rule12(o) || _rule13(o) || _rule14(o) || _rule15(o) || _rule16(o) || _rule17(o) || _rule18(o) || _rule19(o) || _rule20(o) || _rule21(o) || _rule22(o) || _rule23(o) || _rule24(o) || _rule25(o) || _rule26(o) || _rule27(o) || _rule28(o) || _rule29(o) || _rule30(o) || _rule31(o) || _rule32(o) || _rule33(o) || _rule34(o) || _rule35(o) || _rule36(o) || _rule37(o) || _rule38(o) || _rule39(o) || _rule40(o) || _rule41(o) || _rule42(o) || _rule43(o) || _rule44(o) || _rule45(o) || _rule46(o) || _rule47(o) || _rule48(o) || _rule49(o) || _rule50(o) || _rule51(o) || _rule52(o) || _rule53(o) || _rule54(o) || _rule55(o) || _rule56(o) || _rule57(o) || _rule58(o) || _rule59(o) || _rule60(o) || _rule61(o) || _rule62(o) || _rule63(o) || _rule64(o) || _rule65(o);
    }
    function _mutator(x, o, i) {
      return o.operator(i, x);
    }
    return named(
      _rule66 != null ? _rule66.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule66(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Parenthetical = cache(named("Parenthetical", (function () {
  function _rule(o) {
    return Assignment(o) || Expression(o) || Operator(o);
  }
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenParenthesis(clone) && (result = _rule(clone)) && CloseParenthesis(clone)) {
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
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
  __strnum((SpreadToken != null ? SpreadToken.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
      return o.spread(i, x.node);
    } else {
      return x.node;
    }
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        function _rule4(o) {
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule3(clone)) && MaybeComma(clone)) {
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
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<nothing>") + "*",
              function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _arr, item;
                  for (_arr = []; ; ) {
                    item = _rule7(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _arr;
                }());
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
              _rule7 != null ? _rule7.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule7(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
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
          __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = _rule5(clone);
            if (!result) {
              if (typeof _missing === "function") {
                return _missing(void 0, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
ObjectKey = cache(named("ObjectKey", (function () {
  var _rule;
  _rule = (function () {
    function _mutator(x, o, i) {
      return o["const"](i, String(x.value));
    }
    return named(
      NumberLiteral != null ? NumberLiteral.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = NumberLiteral(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return function (o) {
    return Parenthetical(o) || StringLiteral(o) || _rule(o) || IdentifierNameConst(o);
  };
}())));
ObjectKeyColon = cache(named("ObjectKeyColon", (function () {
  var _rule;
  _rule = named(
    "!" + __strnum((Colon != null ? Colon.parserName : void 0) || "<unknown>"),
    function (o) {
      return !Colon(o.clone());
    }
  );
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if ((result = ObjectKey(clone)) && Space(clone) && Colon(clone) && _rule(clone)) {
      o.update(clone);
      return result;
    } else {
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
    _backend != null ? _backend.parserName : void 0,
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
    function _rule2(o) {
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule2 = (function () {
    function _rule3(o) {
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = DoubleColon(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
        _rule5 != null ? _rule5.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule5(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    function _rule2(o) {
      return Period(o) || DoubleColon(o);
    }
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _rule2(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
      __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = DoubleColon(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
        _rule4 != null ? _rule4.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    __strnum((IdentifierOrSimpleAccessPart != null ? IdentifierOrSimpleAccessPart.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = IdentifierOrSimpleAccessPart(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
  var _rule, _rule2, _rule3, _rule4, _rule5, _rule6;
  _rule = (function () {
    function _mutator(ident, o, i) {
      var key;
      key = ident.type === "access" ? ident.child
        : ident.type === "ident" ? o["const"](i, ident.name)
        : o.error("Unknown ident type: " + __strnum(ident.type));
      return { key: key, value: ident };
    }
    return named(
      IdentifierOrSimpleAccess != null ? IdentifierOrSimpleAccess.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = IdentifierOrSimpleAccess(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule2 = (function () {
    function _mutator(node, o, i) {
      var key;
      key = node.type === "const" && typeof node.value !== "string" ? o["const"](i, String(node.value)) : node;
      return { key: key, value: node };
    }
    return named(
      ConstantLiteral != null ? ConstantLiteral.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = ConstantLiteral(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule3 = (function () {
    function _mutator(node, o, i) {
      return {
        key: o["const"](i, "this"),
        value: node
      };
    }
    return named(
      ThisLiteral != null ? ThisLiteral.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = ThisLiteral(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule4 = (function () {
    function _mutator(node, o, i) {
      return {
        key: o["const"](i, "arguments"),
        value: node
      };
    }
    return named(
      ArgumentsLiteral != null ? ArgumentsLiteral.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = ArgumentsLiteral(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule5 = (function () {
    var _rule6;
    _rule6 = symbol("-");
    function _rule7(o) {
      return NumberLiteral(o) || InfinityLiteral(o);
    }
    return (function () {
      function _rule8(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule6(clone) && (result = _rule7(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return {
          key: o["const"](i, String(-__num(x.value))),
          value: o.unary(i, "-", x)
        };
      }
      return named(
        _rule8 != null ? _rule8.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule8(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    function _mutator(node) {
      return { key: node, value: node };
    }
    return named(
      Parenthetical != null ? Parenthetical.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = Parenthetical(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return function (o) {
    return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o) || _rule6(o);
  };
}())));
KeyValuePair = cache(named("KeyValuePair", function (o) {
  return DualObjectKey(o) || SingularObjectKey(o);
}));
ObjectLiteral = cache(named("ObjectLiteral", (function () {
  var _rule, _rule2;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        function _rule4(o) {
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
          if ((result.head = KeyValuePair(clone)) && (result.tail = _rule3(clone)) && MaybeComma(clone)) {
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
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
              if (CommaOrNewlineWithCheckIndent(clone) && (result = KeyValuePair(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            return named(
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<nothing>") + "*",
              function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _arr, item;
                  for (_arr = []; ; ) {
                    item = _rule7(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _arr;
                }());
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
              if (CheckIndent(clone) && (result.head = KeyValuePair(clone)) && (result.tail = _rule6(clone))) {
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
              _rule7 != null ? _rule7.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule7(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
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
          __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = _rule5(clone);
            if (!result) {
              if (typeof _missing === "function") {
                return _missing(void 0, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      if (OpenCurlyBrace(clone) && Space(clone) && (result.first = _rule(clone)) && (result.rest = _rule2(clone)) && CloseCurlyBrace(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o.object(i, __toArray(x.first).concat(__toArray(x.rest)));
    }
    return named(
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
BodyOrStatement = cache(named("BodyOrStatement", function (o) {
  return Body(o) || Statement(o);
}));
DedentedBody = cache(named("DedentedBody", function (o) {
  var clone, result;
  clone = o.clone();
  result = void 0;
  if (Space(clone) && Newline(clone) && EmptyLines(clone) && (result = Block(clone))) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
}));
DeclareEqualSymbol = cache(named("DeclareEqualSymbol", withSpace(named('"="', function (o) {
  var c;
  c = o.data.charCodeAt(o.index);
  if (c === 61) {
    o.index = __num(o.index) + 1;
    return c;
  } else {
    o.fail('"="');
    return false;
  }
}))));
MutableToken = cache(named("MutableToken", word("mutable")));
MaybeMutableToken = cache(named("MaybeMutableToken", named(
  __strnum((MutableToken != null ? MutableToken.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
  __strnum((AsType != null ? AsType.parserName : void 0) || "<unknown>") + "?",
  function (o) {
    var clone, index, result;
    index = o.index;
    clone = o.clone();
    result = AsType(clone);
    if (!result) {
      if (typeof NOTHING === "function") {
        return NOTHING(void 0, o, index);
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
    __strnum((ThisOrShorthandLiteralPeriod != null ? ThisOrShorthandLiteralPeriod.parserName : void 0) || "<unknown>") + "?",
    function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = ThisOrShorthandLiteralPeriod(clone);
      if (!result) {
        if (typeof NOTHING === "function") {
          return NOTHING(void 0, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    if (param.type === "param" && param.spread) {
      spreadCount = __num(spreadCount) + 1;
      if (!__lte(spreadCount, 1)) {
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
  if ((result.key = ObjectKey(clone)) && Colon(clone) && (result.value = Parameter(clone))) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
}));
ParamSingularObjectKey = cache(named("ParamSingularObjectKey", (function () {
  function _mutator(param, o, i) {
    var ident, key;
    ident = param.value.ident;
    key = ident.type === "ident" ? o["const"](i, ident.name)
      : ident.type === "access" ? ident.child
      : (function () {
        throw Error("Unknown object key type: " + __strnum(ident.type));
      }());
    return { key: key, value: param };
  }
  return named(
    IdentifierParameter != null ? IdentifierParameter.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = IdentifierParameter(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((Parameters != null ? Parameters.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = Parameters(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
    if (OpenParenthesis(clone) && EmptyLines(clone) && (result = _rule(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseParenthesis(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
}())));
FunctionBody = cache(named("FunctionBody", (function () {
  var _rule;
  _rule = (function () {
    var _rule2, _rule3;
    _rule2 = symbol("->");
    _rule3 = (function () {
      function _missing(x, o, i) {
        return o.nothing(i);
      }
      return named(
        __strnum((Statement != null ? Statement.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = Statement(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index);
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
FunctionDeclaration = cache(named("FunctionDeclaration", (function () {
  var _rule, _rule2, _rule3;
  _rule = (function () {
    function _missing() {
      return [];
    }
    return named(
      __strnum((ParameterSequence != null ? ParameterSequence.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = ParameterSequence(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
    _rule3 = named('"!"', function (o) {
      var c;
      c = o.data.charCodeAt(o.index);
      if (c === 33) {
        o.index = __num(o.index) + 1;
        return c;
      } else {
        o.fail('"!"');
        return false;
      }
    });
    return named(
      __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
    __strnum((AtSign != null ? AtSign.parserName : void 0) || "<unknown>") + "?",
    function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = AtSign(clone);
      if (!result) {
        if (typeof NOTHING === "function") {
          return NOTHING(void 0, o, index);
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
      if ((result.params = _rule(clone)) && (result.autoReturn = _rule2(clone)) && (result.bound = _rule3(clone)) && (result.body = FunctionBody(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o["function"](
        i,
        x.params,
        x.body,
        x.autoReturn === NOTHING,
        x.bound !== NOTHING
      );
    }
    return named(
      _rule4 != null ? _rule4.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule4(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
AstToken = cache(named("AstToken", word("AST")));
Ast = cache(named("Ast", inAst((function () {
  var _backend;
  _backend = (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (AstToken(clone) && (result = BodyOrStatement(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o.ast(i, x);
    }
    return named(
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return named(
    _backend != null ? _backend.parserName : void 0,
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
}()))));
Debugger = cache(named("Debugger", word("debugger", function (x, o, i) {
  return o["debugger"](i);
})));
MacroName = cache(named("MacroName", (function () {
  var _rule;
  _rule = (function () {
    function _rule2(o) {
      return _Symbol(o) || _Name(o);
    }
    return (function () {
      var _rule3;
      _rule3 = named(
        __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = _rule2(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
          if (!__lt(result.length, 1)) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    if (Space(clone) && (result = _rule(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
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
    var _rule2, _rule3;
    _rule2 = (function () {
      function _rule3(o) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule3 = (function () {
      function _rule4(o) {
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
        _rule4 != null ? _rule4.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return function (o) {
      return Identifier(o) || StringLiteral(o) || _rule2(o) || _rule3(o);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _rule4(clone);
          if (!result) {
            if (typeof NOTHING === "function") {
              return NOTHING(void 0, o, index);
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
        _rule4 != null ? _rule4.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
MacroSyntax = cache(named("MacroSyntax", (function () {
  var _rule;
  _rule = (function () {
    function _backend(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (SyntaxToken(clone) && (result = MacroSyntaxParameters(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _backend != null ? _backend.parserName : void 0,
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
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (CheckIndent(clone) && (result.params = _rule(clone)) && (result.body = FunctionBody(clone)) && Space(clone) && CheckStop(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      o.macroSyntax(i, "syntax", x.params, x.body);
      return true;
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
MacroBody = cache(named("MacroBody", (function () {
  var _rule, _rule2;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        function _rule4(o) {
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
            o.update(clone);
            return result;
          }
        );
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (Advance(clone) && (result.head = MacroSyntax(clone)) && (result.tail = _rule3(clone)) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Space(clone) && Newline(clone) && EmptyLines(clone) && (result = _rule2(clone))) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
      if ((result.params = ParameterSequence(clone)) && (result.body = FunctionBody(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      o.macroSyntax(i, "call", x.params, x.body);
      return true;
    }
    return named(
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
Macro = cache(named("Macro", (function () {
  var _backend;
  _backend = (function () {
    var _rule;
    _rule = named("(identifier MacroBody)", function (o) {
      var name;
      name = MacroName(o);
      if (name) {
        o.startMacro(name);
        try {
          return MacroBody(o);
        } finally {
          o.endMacro();
        }
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
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
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
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return named(
    _backend != null ? _backend.parserName : void 0,
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
Nothing = cache(named("Nothing", function (o) {
  return o.nothing(o.index);
}));
ExpressionOrNothing = cache(named("ExpressionOrNothing", function (o) {
  return Expression(o) || Nothing(o);
}));
_indexSlice = new Stack(false);
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
      left: x.type === "nothing" ? null : x.left,
      right: x.type === "nothing" ? null : x.right
    };
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if (!__lte(x.tail.length, 0)) {
        return { type: "multi", elements: [x.head].concat(__toArray(x.tail)) };
      } else {
        return { type: "single", node: x.head };
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    function _rule2(o) {
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  _rule2 = (function () {
    function _rule3(o) {
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
      __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = DoubleColon(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
        return o.accessIndex(i, parent, x.child);
      }
      return named(
        _rule5 != null ? _rule5.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule5(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    function _rule2(o) {
      return Period(o) || DoubleColon(o);
    }
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _rule2(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
      __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = DoubleColon(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
          return o.accessIndex(i, parent, x.child);
        };
      }
      return named(
        _rule4 != null ? _rule4.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    __strnum((IdentifierOrAccessPart != null ? IdentifierOrAccessPart.parserName : void 0) || "<nothing>") + "*",
    function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _arr, item;
        for (_arr = []; ; ) {
          item = IdentifierOrAccessPart(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _arr;
      }());
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
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    var c;
    c = o.data.charCodeAt(o.index);
    if (c === 61) {
      o.index = __num(o.index) + 1;
      return c;
    } else {
      o.fail('"="');
      return false;
    }
  });
  return (function () {
    function _rule2(o) {
      var clone;
      clone = o.clone();
      if (Space(clone) && Colon(clone) && _rule(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
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
ExpressionOrAssignment = cache(named("ExpressionOrAssignment", function (o) {
  return Assignment(o) || Expression(o);
}));
DirectAssignment = cache(named("DirectAssignment", (function () {
  function _rule(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.left = ComplexAssignable(clone)) && (result.op = ColonEqual(clone)) && (result.right = ExpressionOrAssignment(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _mutator(x, o, i) {
    return o.assign(i, x.left, x.op, x.right);
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
CompoundAssignmentOp = cache(named("CompoundAssignmentOp", (function () {
  var _rule, _rule10, _rule11, _rule12, _rule13, _rule14, _rule15, _rule16, _rule17, _rule18, _rule19, _rule2, _rule20, _rule21, _rule22, _rule23, _rule24, _rule25, _rule26, _rule27, _rule28, _rule29, _rule3, _rule30, _rule31, _rule32, _rule33, _rule34, _rule35, _rule36, _rule4, _rule5, _rule6, _rule7, _rule8, _rule9;
  _rule = wordOrSymbol("&=");
  _rule2 = wordOrSymbol("+=");
  _rule3 = wordOrSymbol("-=");
  _rule4 = wordOrSymbol("/=");
  _rule5 = wordOrSymbol("\\=");
  _rule6 = wordOrSymbol("%=");
  _rule7 = wordOrSymbol("*=");
  _rule8 = wordOrSymbol("^=");
  _rule9 = wordOrSymbol("~&=");
  _rule10 = wordOrSymbol("~+=");
  _rule11 = wordOrSymbol("~-=");
  _rule12 = wordOrSymbol("~/=");
  _rule13 = wordOrSymbol("~\\=");
  _rule14 = wordOrSymbol("~%=");
  _rule15 = wordOrSymbol("~*=");
  _rule16 = wordOrSymbol("~^=");
  _rule17 = wordOrSymbol("?=");
  _rule18 = wordOrSymbol("or=");
  _rule19 = wordOrSymbol("and=");
  _rule20 = wordOrSymbol("xor=");
  _rule21 = wordOrSymbol("bitand=");
  _rule22 = wordOrSymbol("bitor=");
  _rule23 = wordOrSymbol("bitxor=");
  _rule24 = wordOrSymbol("bitlshift=");
  _rule25 = wordOrSymbol("bitrshift=");
  _rule26 = wordOrSymbol("biturshift=");
  _rule27 = wordOrSymbol("min=");
  _rule28 = wordOrSymbol("max=");
  _rule29 = wordOrSymbol("~bitand=");
  _rule30 = wordOrSymbol("~bitor=");
  _rule31 = wordOrSymbol("~bitxor=");
  _rule32 = wordOrSymbol("~bitlshift=");
  _rule33 = wordOrSymbol("~bitrshift=");
  _rule34 = wordOrSymbol("~biturshift=");
  _rule35 = wordOrSymbol("~min=");
  _rule36 = wordOrSymbol("~max=");
  return function (o) {
    return _rule(o) || _rule2(o) || _rule3(o) || _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o) || _rule9(o) || _rule10(o) || _rule11(o) || _rule12(o) || _rule13(o) || _rule14(o) || _rule15(o) || _rule16(o) || _rule17(o) || _rule18(o) || _rule19(o) || _rule20(o) || _rule21(o) || _rule22(o) || _rule23(o) || _rule24(o) || _rule25(o) || _rule26(o) || _rule27(o) || _rule28(o) || _rule29(o) || _rule30(o) || _rule31(o) || _rule32(o) || _rule33(o) || _rule34(o) || _rule35(o) || _rule36(o);
  };
}())));
CompoundAssignment = cache(named("CompoundAssignment", (function () {
  function _rule(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.left = SimpleAssignable(clone)) && (result.op = CompoundAssignmentOp(clone)) && (result.right = ExpressionOrAssignment(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _mutator(x, o, i) {
    return o.assign(i, x.left, x.op, x.right);
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
Assignment = cache(named("Assignment", function (o) {
  return DirectAssignment(o) || CompoundAssignment(o);
}));
PrimaryExpression = cache(named("PrimaryExpression", function (o) {
  return UnclosedObjectLiteral(o) || Literal(o) || Parenthetical(o) || ArrayLiteral(o) || ObjectLiteral(o) || FunctionLiteral(o) || Ast(o) || Debugger(o) || UseMacro(o) || Identifier(o);
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
      __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        function _rule4(o) {
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
          __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
          function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _arr, item;
              for (_arr = []; ; ) {
                item = _rule4(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _arr;
            }());
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
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _rule3(clone)) && MaybeComma(clone)) {
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
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
              __strnum((_rule7 != null ? _rule7.parserName : void 0) || "<nothing>") + "*",
              function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _arr, item;
                  for (_arr = []; ; ) {
                    item = _rule7(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _arr;
                }());
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
              _rule7 != null ? _rule7.parserName : void 0,
              function (o) {
                var index, result;
                index = o.index;
                result = _rule7(o);
                if (!result) {
                  return false;
                } else if (typeof _mutator === "function") {
                  return _mutator(result, o, index);
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
          __strnum((_rule5 != null ? _rule5.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = _rule5(clone);
            if (!result) {
              if (typeof _missing === "function") {
                return _missing(void 0, o, index);
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
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule3(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
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
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<nothing>") + "*",
        function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _arr, item;
            for (_arr = []; ; ) {
              item = _rule3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _arr;
          }());
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
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
BasicInvocationOrAccess = cache(named("BasicInvocationOrAccess", (function () {
  var _rule, _rule2, _rule3;
  _rule = (function () {
    var _rule2;
    _rule2 = word("new");
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
    var _rule3, _rule4;
    _rule3 = (function () {
      function _rule4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.node = ThisShorthandLiteral(clone)) && (result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return { type: "thisAccess", node: x.node, child: x.child, existential: x.existential === "?" };
      }
      return named(
        _rule4 != null ? _rule4.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule4(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    _rule4 = (function () {
      function _mutator(x) {
        return { type: "normal", node: x };
      }
      return named(
        PrimaryExpression != null ? PrimaryExpression.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = PrimaryExpression(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    return function (o) {
      return _rule3(o) || _rule4(o);
    };
  }());
  _rule3 = (function () {
    var _rule4;
    _rule4 = (function () {
      var _rule5, _rule6, _rule7, _rule8;
      _rule5 = (function () {
        function _rule6(o) {
          return Period(o) || DoubleColon(o);
        }
        return (function () {
          function _rule7(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && EmptyLines(clone) && Space(clone) && (result.type = _rule6(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
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
              existential: x.existential === "?"
            };
          }
          return named(
            _rule7 != null ? _rule7.parserName : void 0,
            function (o) {
              var index, result;
              index = o.index;
              result = _rule7(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index);
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
        var _rule7;
        _rule7 = named(
          __strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?",
          function (o) {
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = DoubleColon(clone);
            if (!result) {
              return "index";
            } else {
              o.update(clone);
              return "protoIndex";
            }
          }
        );
        return (function () {
          function _rule8(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.type = _rule7(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return { type: x.type, child: x.child, existential: x.existential === "?" };
          }
          return named(
            _rule8 != null ? _rule8.parserName : void 0,
            function (o) {
              var index, result;
              index = o.index;
              result = _rule8(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index);
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
        function _rule8(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.args = InvocationArguments(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return { type: "call", args: x.args, existential: x.existential === "?", isNew: false };
        }
        return named(
          _rule8 != null ? _rule8.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule8(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      _rule8 = (function () {
        function _rule9(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (ExistentialSymbolNoSpace(clone) && (result = InvocationOrAccess(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          return { type: "?", child: x };
        }
        return named(
          _rule9 != null ? _rule9.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule9(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      return function (o) {
        return _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o);
      };
    }());
    return named(
      __strnum((_rule4 != null ? _rule4.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule4(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.isNew = _rule(clone)) && (result.head = _rule2(clone)) && (result.tail = _rule3(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      var _i, _len, _ref, clone, head, isNew, links, part, tail;
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
        if ((_ref = part.type) === "protoAccess" || _ref === "protoIndex") {
          links.push({
            type: "access",
            child: o["const"](i, "prototype"),
            existential: part.existential
          });
          clone = copy(part);
          clone.type = part.type === "protoAccess" ? "access" : "index";
          links.push(clone);
        } else if ((_ref = part.type) === "access" || _ref === "index") {
          links.push(part);
        } else if (part.type === "call") {
          clone = copy(part);
          clone.isNew = isNew;
          isNew = false;
          links.push(clone);
        } else if (part.type === "?") {
          if (isNew) {
            links.push({ type: "call", args: [], existential: false, isNew: true });
            isNew = false;
          }
          links.push(part);
        } else {
          o.error("Unknown link type: " + __strnum(part.type));
        }
      }
      if (isNew) {
        links.push({ type: "call", args: [], existential: false, isNew: true });
      }
      return o.callChain(i, head.node, links);
    }
    return named(
      _rule4 != null ? _rule4.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule4(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
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
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return named(
    _backend != null ? _backend.parserName : void 0,
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
InvocationOrAccess = cache(named("InvocationOrAccess", function (o) {
  return BasicInvocationOrAccess(o) || Eval(o);
}));
ExistentialUnary = cache(named("ExistentialUnary", (function () {
  function _rule(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.node = InvocationOrAccess(clone)) && (result.op = MaybeExistentialSymbolNoSpace(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _mutator(x, o, i) {
    if (x.op === "?") {
      return o.unary(i, x.op, x.node);
    } else {
      return x.node;
    }
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
Unary = cache(named("Unary", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3, _rule4, _rule5, _rule6, _rule7, _rule8, _rule9;
      _rule3 = (function () {
        function _rule4(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (NotToken(clone) && (result = MaybeNotToken(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _mutator(x) {
          if (x === "not") {
            return "bool";
          } else {
            return "not";
          }
        }
        return named(
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      _rule4 = word("bitnot");
      _rule5 = wordOrSymbol("~bitnot");
      _rule6 = (function () {
        var _rule7, _rule8;
        _rule7 = word("typeof");
        _rule8 = (function () {
          var _rule9;
          _rule9 = named('"!"', function (o) {
            var c;
            c = o.data.charCodeAt(o.index);
            if (c === 33) {
              o.index = __num(o.index) + 1;
              return c;
            } else {
              o.fail('"!"');
              return false;
            }
          });
          return named(
            __strnum((_rule9 != null ? _rule9.parserName : void 0) || "<unknown>") + "?",
            function (o) {
              var clone, index, result;
              index = o.index;
              clone = o.clone();
              result = _rule9(clone);
              if (!result) {
                if (typeof NOTHING === "function") {
                  return NOTHING(void 0, o, index);
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
          function _rule9(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_rule7(clone) && (result = _rule8(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            if (x !== NOTHING) {
              return "typeof!";
            } else {
              return "typeof";
            }
          }
          return named(
            _rule9 != null ? _rule9.parserName : void 0,
            function (o) {
              var index, result;
              index = o.index;
              result = _rule9(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index);
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
        var _rule8, _rule9;
        _rule8 = (function () {
          var _rule10, _rule11, _rule9;
          _rule9 = word("num");
          _rule10 = word("str");
          _rule11 = word("strnum");
          return function (o) {
            return _rule9(o) || _rule10(o) || _rule11(o);
          };
        }());
        _rule9 = named('"!"', function (o) {
          var c;
          c = o.data.charCodeAt(o.index);
          if (c === 33) {
            o.index = __num(o.index) + 1;
            return c;
          } else {
            o.fail('"!"');
            return false;
          }
        });
        return (function () {
          function _rule10(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if ((result = _rule8(clone)) && _rule9(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            return __strnum(x) + "!";
          }
          return named(
            _rule10 != null ? _rule10.parserName : void 0,
            function (o) {
              var index, result;
              index = o.index;
              result = _rule10(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index);
              } else if (_mutator !== void 0) {
                return _mutator;
              } else {
                return result;
              }
            }
          );
        }());
      }());
      _rule8 = word("delete");
      _rule9 = (function () {
        var _rule10;
        _rule10 = word("throw");
        return (function () {
          function _rule11(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_rule10(clone) && (result = MaybeExistentialSymbolNoSpace(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _mutator(x) {
            if (x === "?") {
              return "throw?";
            } else {
              return "throw";
            }
          }
          return named(
            _rule11 != null ? _rule11.parserName : void 0,
            function (o) {
              var index, result;
              index = o.index;
              result = _rule11(o);
              if (!result) {
                return false;
              } else if (typeof _mutator === "function") {
                return _mutator(result, o, index);
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
        return _rule3(o) || _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o) || _rule9(o);
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
      if ((result.op = _rule(clone)) && (result.node = ExistentialUnary(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      if (x.op !== NOTHING) {
        return o.unary(i, x.op, x.node);
      } else {
        return x.node;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Negate = cache(named("Negate", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4, _rule5, _rule6, _rule7, _rule8;
        _rule4 = symbol("+");
        _rule5 = symbol("-");
        _rule6 = symbol("~+");
        _rule7 = symbol("~-");
        _rule8 = symbol("^");
        return function (o) {
          return _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = _rule3(clone)) && NoSpace(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
      if ((result.op = _rule(clone)) && (result.node = Unary(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      var _ref;
      if (x.op !== NOTHING) {
        if (x.node.type === "const" && typeof x.node.value === "number" && ((_ref = x.op) === "+" || _ref === "-" || _ref === "~+" || _ref === "~-")) {
          return o["const"](i, (_ref = x.op) === "+" || _ref === "~+" ? __num(x.node.value) : -__num(x.node.value));
        } else {
          return o.unary(i, x.op, x.node);
        }
      } else {
        return x.node;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
function binaryLeftToRight(x, o, i) {
  var _arr, _i, _len, current, part;
  current = x.head;
  for (_arr = x.tail, _i = 0, _len = __num(_arr.length); _i < _len; ++_i) {
    part = _arr[_i];
    current = o.binary(i, current, part.op, part.node);
  }
  return current;
}
function binaryRightToLeft(x, o, i) {
  var current, head, j, tail;
  head = x.head;
  tail = x.tail;
  if (tail.length === 0) {
    return head;
  } else {
    current = tail[__num(tail.length) - 1].node;
    for (j = __num(tail.length) - 1; j > 0; --j) {
      current = o.binary(i, tail[__num(j) - 1].node, tail[j].op, current);
    }
    return o.binary(i, head, tail[0].op, current);
  }
}
Exponentiation = cache(named("Exponentiation", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4, _rule5;
        _rule4 = wordOrSymbol("^");
        _rule5 = wordOrSymbol("~^");
        return function (o) {
          return _rule4(o) || _rule5(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Negate(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.head = Negate(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryRightToLeft === "function") {
          return binaryRightToLeft(result, o, index);
        } else if (binaryRightToLeft !== void 0) {
          return binaryRightToLeft;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Multiplication = cache(named("Multiplication", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule10, _rule11, _rule4, _rule5, _rule6, _rule7, _rule8, _rule9;
        _rule4 = wordOrSymbol("*");
        _rule5 = wordOrSymbol("/");
        _rule6 = wordOrSymbol("%");
        _rule7 = wordOrSymbol("\\");
        _rule8 = wordOrSymbol("~*");
        _rule9 = wordOrSymbol("~/");
        _rule10 = wordOrSymbol("~%");
        _rule11 = wordOrSymbol("~\\");
        return function (o) {
          return _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o) || _rule9(o) || _rule10(o) || _rule11(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Exponentiation(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.head = Exponentiation(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Addition = cache(named("Addition", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4, _rule5, _rule6, _rule7;
        _rule4 = wordOrSymbol("+");
        _rule5 = wordOrSymbol("-");
        _rule6 = wordOrSymbol("~+");
        _rule7 = wordOrSymbol("~-");
        return function (o) {
          return _rule4(o) || _rule5(o) || _rule6(o) || _rule7(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Multiplication(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.head = Multiplication(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
BitwiseShift = cache(named("BitwiseShift", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule5, _rule6, _rule7;
          _rule5 = wordOrSymbol("bitlshift");
          _rule6 = wordOrSymbol("bitrshift");
          _rule7 = wordOrSymbol("biturshift");
          return function (o) {
            return _rule5(o) || _rule6(o) || _rule7(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _rule4(clone)) && (result.node = Addition(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _mutator(x) {
        return [x];
      }
      return named(
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    function _missing() {
      return [];
    }
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      result = {};
      if ((result.head = Addition(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Min = cache(named("Min", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("min");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = BitwiseShift(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = BitwiseShift(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Max = cache(named("Max", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("max");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = BitwiseShift(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.head = BitwiseShift(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
MinMax = cache(named("MinMax", function (o) {
  return Min(o) || Max(o);
}));
StringConcatenation = cache(named("StringConcatenation", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4, _rule5;
        _rule4 = wordOrSymbol("&");
        _rule5 = wordOrSymbol("~&");
        return function (o) {
          return _rule4(o) || _rule5(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = MinMax(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
      if ((result.head = MinMax(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Containment = cache(named("Containment", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule5;
          _rule5 = (function () {
            var _rule6;
            _rule6 = (function () {
              var _rule10, _rule11, _rule7, _rule8, _rule9;
              _rule7 = wordOrSymbol("in");
              _rule8 = wordOrSymbol("haskey");
              _rule9 = wordOrSymbol("ownskey");
              _rule10 = wordOrSymbol("instanceof");
              _rule11 = wordOrSymbol("instanceofsome");
              return function (o) {
                return _rule7(o) || _rule8(o) || _rule9(o) || _rule10(o) || _rule11(o);
              };
            }());
            return (function () {
              function _rule7(o) {
                var clone, result;
                clone = o.clone();
                result = {};
                if ((result.inverse = MaybeNotToken(clone)) && (result.op = _rule6(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              function _mutator(x) {
                if (x.inverse === "not") {
                  return "not " + __strnum(x.op);
                } else {
                  return x.op;
                }
              }
              return named(
                _rule7 != null ? _rule7.parserName : void 0,
                function (o) {
                  var index, result;
                  index = o.index;
                  result = _rule7(o);
                  if (!result) {
                    return false;
                  } else if (typeof _mutator === "function") {
                    return _mutator(result, o, index);
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
            result = {};
            if ((result.op = _rule5(clone)) && (result.node = StringConcatenation(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        function _mutator(x) {
          return [x];
        }
        return named(
          _rule4 != null ? _rule4.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule4(o);
            if (!result) {
              return false;
            } else if (typeof _mutator === "function") {
              return _mutator(result, o, index);
            } else if (_mutator !== void 0) {
              return _mutator;
            } else {
              return result;
            }
          }
        );
      }());
      function _missing() {
        return [];
      }
      return named(
        __strnum((_rule3 != null ? _rule3.parserName : void 0) || "<unknown>") + "?",
        function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _rule3(clone);
          if (!result) {
            if (typeof _missing === "function") {
              return _missing(void 0, o, index);
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
        if ((result.head = StringConcatenation(clone)) && (result.tail = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof binaryLeftToRight === "function") {
            return binaryLeftToRight(result, o, index);
          } else if (binaryLeftToRight !== void 0) {
            return binaryLeftToRight;
          } else {
            return result;
          }
        }
      );
    }());
  }());
  function _mutator(x, o, i) {
    if (x && x.type === "binary" && x.op.substring(0, 4) === "not ") {
      return o.unary(i, "not", o.binary(i, x.left, x.op.substring(4), x.right));
    } else {
      return x;
    }
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
Spaceship = cache(named("Spaceship", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = wordOrSymbol("<=>");
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _rule4(clone)) && (result.node = Containment(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _mutator(x) {
        return [x];
      }
      return named(
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    function _missing() {
      return [];
    }
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      result = {};
      if ((result.head = Containment(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Comparison = cache(named("Comparison", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = (function () {
        var _rule4;
        _rule4 = (function () {
          var _rule10, _rule11, _rule12, _rule13, _rule14, _rule15, _rule16, _rule17, _rule18, _rule19, _rule20, _rule5, _rule6, _rule7, _rule8, _rule9;
          _rule5 = wordOrSymbol("~=");
          _rule6 = wordOrSymbol("!~=");
          _rule7 = wordOrSymbol("==");
          _rule8 = wordOrSymbol("!=");
          _rule9 = wordOrSymbol("%%");
          _rule10 = wordOrSymbol("!%%");
          _rule11 = wordOrSymbol("~%%");
          _rule12 = wordOrSymbol("!~%%");
          _rule13 = wordOrSymbol("<");
          _rule14 = wordOrSymbol("<=");
          _rule15 = wordOrSymbol(">");
          _rule16 = wordOrSymbol(">=");
          _rule17 = wordOrSymbol("~<");
          _rule18 = wordOrSymbol("~<=");
          _rule19 = wordOrSymbol("~>");
          _rule20 = wordOrSymbol("~>=");
          return function (o) {
            return _rule5(o) || _rule6(o) || _rule7(o) || _rule8(o) || _rule9(o) || _rule10(o) || _rule11(o) || _rule12(o) || _rule13(o) || _rule14(o) || _rule15(o) || _rule16(o) || _rule17(o) || _rule18(o) || _rule19(o) || _rule20(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _rule4(clone)) && (result.node = Spaceship(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _mutator(x) {
        return [x];
      }
      return named(
        _rule3 != null ? _rule3.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule3(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
          } else if (_mutator !== void 0) {
            return _mutator;
          } else {
            return result;
          }
        }
      );
    }());
    function _missing() {
      return [];
    }
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _rule2(clone);
        if (!result) {
          if (typeof _missing === "function") {
            return _missing(void 0, o, index);
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
      result = {};
      if ((result.head = Spaceship(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
LogicalAnd = cache(named("LogicalAnd", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("and");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
LogicalOr = cache(named("LogicalOr", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("or");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
LogicalXor = cache(named("LogicalXor", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("xor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
ExistentialOr = cache(named("ExistentialOr", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = ExistentialSymbol;
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryRightToLeft === "function") {
          return binaryRightToLeft(result, o, index);
        } else if (binaryRightToLeft !== void 0) {
          return binaryRightToLeft;
        } else {
          return result;
        }
      }
    );
  }());
}())));
BitwiseAnd = cache(named("BitwiseAnd", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("bitand");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
BitwiseOr = cache(named("BitwiseOr", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("bitor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
BitwiseXor = cache(named("BitwiseXor", (function () {
  var _rule;
  _rule = (function () {
    var _rule2;
    _rule2 = (function () {
      var _rule3;
      _rule3 = wordOrSymbol("bitxor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _rule3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "+",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
    );
  }());
  return (function () {
    function _rule2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _rule(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Logic = cache(named("Logic", function (o) {
  return LogicalAnd(o) || LogicalOr(o) || LogicalXor(o) || ExistentialOr(o) || BitwiseAnd(o) || BitwiseOr(o) || BitwiseXor(o) || Comparison(o);
}));
ExpressionAsStatement = cache(named("ExpressionAsStatement", function (o) {
  return UseMacro(o) || Logic(o);
}));
Expression = cache(named("Expression", inExpression(ExpressionAsStatement)));
IdentifierDeclarable = cache(named("IdentifierDeclarable", (function () {
  function _rule(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.isMutable = MaybeMutableToken(clone)) && (result.ident = Identifier(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _mutator(x, o, i) {
    return o.declarable(i, x.ident, x.isMutable === "mutable");
  }
  return named(
    _rule != null ? _rule.parserName : void 0,
    function (o) {
      var index, result;
      index = o.index;
      result = _rule(o);
      if (!result) {
        return false;
      } else if (typeof _mutator === "function") {
        return _mutator(result, o, index);
      } else if (_mutator !== void 0) {
        return _mutator;
      } else {
        return result;
      }
    }
  );
}())));
Declarable = cache(named("Declarable", IdentifierDeclarable));
LetToken = cache(named("LetToken", word("let")));
Let = cache(named("Let", (function () {
  var _backend;
  _backend = (function () {
    var _rule;
    _rule = (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DeclareEqualSymbol(clone) && (result = ExpressionOrAssignment(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return function (o) {
        return _rule2(o) || FunctionDeclaration(o);
      };
    }());
    return (function () {
      function _rule2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (LetToken(clone) && (result.left = Declarable(clone)) && (result.right = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o["let"](i, x.left, x.right);
      }
      return named(
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
    function (o) {
      var result;
      if (!LetToken(o.clone())) {
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
ReturnToken = cache(named("ReturnToken", word("return")));
Return = cache(named("Return", (function () {
  var _backend;
  _backend = (function () {
    function _rule(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (ReturnToken(clone) && (result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.node = ExpressionOrNothing(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _mutator(x, o, i) {
      return o["return"](i, x.node, x.existential === "?");
    }
    return named(
      _rule != null ? _rule.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
  return named(
    _backend != null ? _backend.parserName : void 0,
    function (o) {
      var result;
      if (!ReturnToken(o.clone())) {
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
YieldToken = cache(named("YieldToken", word("yield")));
Yield = cache(named("Yield", (function () {
  var _backend;
  _backend = (function () {
    var _rule;
    _rule = named(
      __strnum((Asterix != null ? Asterix.parserName : void 0) || "<unknown>") + "?",
      function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = Asterix(clone);
        if (!result) {
          if (typeof NOTHING === "function") {
            return NOTHING(void 0, o, index);
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
        if (YieldToken(clone) && (result.multiple = _rule(clone)) && (result.node = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o["yield"](i, x.node, x.multiple !== NOTHING);
      }
      return named(
        _rule2 != null ? _rule2.parserName : void 0,
        function (o) {
          var index, result;
          index = o.index;
          result = _rule2(o);
          if (!result) {
            return false;
          } else if (typeof _mutator === "function") {
            return _mutator(result, o, index);
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
    _backend != null ? _backend.parserName : void 0,
    function (o) {
      var result;
      if (!YieldToken(o.clone())) {
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
Break = cache(named("Break", word("break", function (x, o, i) {
  return o["break"](i);
})));
Continue = cache(named("Continue", word("continue", function (x, o, i) {
  return o["continue"](i);
})));
Statement = cache(named("Statement", (function () {
  var _rule;
  _rule = inStatement(function (o) {
    return Let(o) || Return(o) || Yield(o) || Break(o) || Continue(o) || Macro(o) || DefineHelper(o) || Assignment(o) || ExpressionAsStatement(o);
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
      __strnum((_rule2 != null ? _rule2.parserName : void 0) || "<nothing>") + "*",
      function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _arr, item;
          for (_arr = []; ; ) {
            item = _rule2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _arr;
        }());
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
        if (item.type === "block") {
          nodes.push.apply(nodes, __toArray(item.nodes));
        } else {
          nodes.push(item);
        }
      }
      return o.block(i, nodes);
    }
    return named(
      _rule2 != null ? _rule2.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule2(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
Root = cache(named("Root", (function () {
  var _rule;
  _rule = named(
    __strnum((Shebang != null ? Shebang.parserName : void 0) || "<unknown>") + "?",
    function (o) {
      var clone, index, result;
      index = o.index;
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
      _rule3 != null ? _rule3.parserName : void 0,
      function (o) {
        var index, result;
        index = o.index;
        result = _rule3(o);
        if (!result) {
          return false;
        } else if (typeof _mutator === "function") {
          return _mutator(result, o, index);
        } else if (_mutator !== void 0) {
          return _mutator;
        } else {
          return result;
        }
      }
    );
  }());
}())));
ParserError = (function () {
  function ParserError(message, text, index) {
    var _this;
    _this = __create(ParserError.prototype);
    Error.call(_this, message);
    _this.message = __strnum(message) + " at " + __strnum(index);
    _this.text = text;
    _this.index = index;
    return _this;
  }
  ParserError.prototype = __create(Error.prototype);
  ParserError.prototype.constructor = ParserError;
  return ParserError;
}());
FailureManager = (function () {
  function FailureManager() {
    if (!(this instanceof FailureManager)) {
      throw TypeError("Must be instantiated with new");
    }
    this.messages = [];
    this.position = 0;
  }
  FailureManager.prototype.add = function (message, index) {
    if (!__lte(index, this.position)) {
      this.messages = [];
      this.position = index;
    }
    if (!__lt(index, this.position)) {
      this.messages.push(message);
    }
  };
  return FailureManager;
}());
MacroHelper = (function () {
  var getTmpId, KNOWN_HELPERS, mutators, walkers;
  function MacroHelper(state, index, expr) {
    this.state = state;
    this.index = index;
    this.expr = expr;
    if (!(this instanceof MacroHelper)) {
      throw TypeError("Must be instantiated with new");
    }
    this.unsavedTmps = [];
    this.savedTmps = [];
  }
  MacroHelper.prototype["if"] = function (test, whenTrue, whenFalse) {
    if (!(test instanceof Object)) {
      throw TypeError("Expected test to be a Object, got " + __typeof(test));
    }
    if (!(whenTrue instanceof Object)) {
      throw TypeError("Expected whenTrue to be a Object, got " + __typeof(whenTrue));
    }
    if (whenFalse == null) {
      whenFalse = null;
    } else if (!(whenFalse instanceof Object)) {
      throw TypeError("Expected whenFalse to be a Object or null, got " + __typeof(whenFalse));
    }
    return this.state["if"](this.index, test, whenTrue, whenFalse);
  };
  MacroHelper.prototype["for"] = function (init, test, step, body) {
    if (init == null) {
      init = null;
    } else if (!(init instanceof Object)) {
      throw TypeError("Expected init to be a Object or null, got " + __typeof(init));
    }
    if (test == null) {
      test = null;
    } else if (!(test instanceof Object)) {
      throw TypeError("Expected test to be a Object or null, got " + __typeof(test));
    }
    if (step == null) {
      step = null;
    } else if (!(step instanceof Object)) {
      throw TypeError("Expected step to be a Object or null, got " + __typeof(step));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    return this.state["for"](
      this.index,
      init,
      test,
      step,
      body
    );
  };
  MacroHelper.prototype.forIn = function (key, object, body) {
    if (!(key instanceof Object)) {
      throw TypeError("Expected key to be a Object, got " + __typeof(key));
    }
    if (!(object instanceof Object)) {
      throw TypeError("Expected object to be a Object, got " + __typeof(object));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    return this.state.forIn(this.index, key, object, body);
  };
  MacroHelper.prototype.tryCatch = function (tryBody, catchIdent, catchBody) {
    if (!(tryBody instanceof Object)) {
      throw TypeError("Expected tryBody to be a Object, got " + __typeof(tryBody));
    }
    if (!(catchIdent instanceof Object)) {
      throw TypeError("Expected catchIdent to be a Object, got " + __typeof(catchIdent));
    }
    if (!(catchBody instanceof Object)) {
      throw TypeError("Expected catchBody to be a Object, got " + __typeof(catchBody));
    }
    return this.state.tryCatch(this.index, tryBody, catchIdent, catchBody);
  };
  MacroHelper.prototype.tryFinally = function (tryBody, finallyBody) {
    if (!(tryBody instanceof Object)) {
      throw TypeError("Expected tryBody to be a Object, got " + __typeof(tryBody));
    }
    if (!(finallyBody instanceof Object)) {
      throw TypeError("Expected finallyBody to be a Object, got " + __typeof(finallyBody));
    }
    return this.state.tryFinally(this.index, tryBody, finallyBody);
  };
  getTmpId = (function () {
    var id;
    id = -1;
    return function () {
      return id = __num(id) + 1;
    };
  }());
  MacroHelper.prototype.tmp = function (name, save) {
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
    return this.state.tmp(this.index, id, name);
  };
  MacroHelper.prototype.getTmps = function () {
    return {
      unsaved: __slice(
        this.unsavedTmps,
        void 0,
        void 0
      ),
      saved: __slice(
        this.savedTmps,
        void 0,
        void 0
      )
    };
  };
  MacroHelper.prototype.isConst = function (node) {
    return node === void 0 || node != null && (node.type === "const" || node.type === "block" && node.nodes.length === 0);
  };
  MacroHelper.prototype.value = function (node) {
    if (node === void 0) {
      return;
    } else if (node != null) {
      if (node.type === "const") {
        return node.value;
      } else if (node.type === "block" && node.nodes.length === 0) {
        return;
      }
    }
  };
  MacroHelper.prototype["const"] = function (value) {
    var _ref;
    if (value instanceof RegExp || value === null || (_ref = typeof value) === "undefined" || _ref === "boolean" || _ref === "string" || _ref === "number") {
      return ParserNode("const", 0, 0, { value: value });
    } else {
      throw Error("Cannot make a const out of " + __strnum(String(value)));
    }
  };
  MacroHelper.prototype.isIdent = function (node) {
    return node != null && node.type === "ident";
  };
  MacroHelper.prototype.name = function (node) {
    if (node != null && node.type === "ident") {
      return node.name;
    }
  };
  MacroHelper.prototype.ident = function (name) {
    if (typeof name !== "string") {
      throw TypeError("Expected a string");
    }
    return ParserNode("ident", 0, 0, { name: name });
  };
  MacroHelper.prototype.isCall = function (node) {
    var links;
    if (node != null && node.type === "callChain") {
      links = node.links;
      return links[__num(links.length) - 1].type === "call";
    } else {
      return false;
    }
  };
  MacroHelper.prototype.callFunc = function (node) {
    var links;
    if (node != null && node.type === "callChain") {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        if (links.length === 1) {
          return node.head;
        } else {
          return ParserNode(node.type, node.startIndex, node.endIndex, {
            head: node.head,
            links: __slice(
              links,
              void 0,
              __num(links.length) - 1
            )
          });
        }
      }
    }
  };
  MacroHelper.prototype.callArgs = function (node) {
    var links;
    if (node != null && node.type === "callChain") {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        return links[__num(links.length) - 1].args;
      }
    }
  };
  MacroHelper.prototype.callIsNew = function (node) {
    var links;
    if (node != null && node.type === "callChain") {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        return !!links[__num(links.length) - 1].isNew;
      }
    }
    return false;
  };
  MacroHelper.prototype.call = function (func, args, isNew) {
    if (isNew == null) {
      isNew = false;
    }
    if (!func || typeof func !== "object") {
      throw TypeError("Expected func to be an object, got " + __strnum(__typeof(func)));
    }
    if (!Array.isArray(args)) {
      throw TypeError("Expected args to be an Array, got " + __strnum(__typeof(args)));
    }
    if (typeof isNew !== "boolean") {
      throw TypeError("Expected is-new to be a Boolean, got " + __strnum(__typeof(isNew)));
    }
    if (func.type === "callChain") {
      return ParserNode("callChain", func.startIndex, func.endIndex, {
        head: func.head,
        links: __toArray(func.links).concat([{ type: "call", args: args, isNew: isNew }])
      });
    } else {
      return ParserNode("callChain", func.startIndex, func.endIndex, {
        head: func,
        links: [{ type: "call", args: args, isNew: isNew }]
      });
    }
  };
  MacroHelper.prototype.func = function (params, body, autoReturn, bound) {
    if (!__isArray(params)) {
      throw TypeError("Expected params to be a Array, got " + __typeof(params));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    if (autoReturn == null) {
      autoReturn = true;
    } else if (typeof autoReturn !== "boolean") {
      throw TypeError("Expected autoReturn to be a Boolean, got " + __typeof(autoReturn));
    }
    if (bound == null) {
      bound = false;
    } else if (typeof bound !== "boolean") {
      throw TypeError("Expected bound to be a Boolean, got " + __typeof(bound));
    }
    return ParserNode("function", 0, 0, { params: params, body: body, autoReturn: autoReturn, bound: bound });
  };
  MacroHelper.prototype.isFunc = function (node) {
    return node && node.type === "function";
  };
  MacroHelper.prototype.funcBody = function (node) {
    if (node != null && node.type === "function") {
      return node.body;
    }
  };
  MacroHelper.prototype.funcParams = function (node) {
    if (node != null && node.type === "function") {
      return node.params;
    }
  };
  MacroHelper.prototype.funcIsAutoReturn = function (node) {
    if (node != null && node.type === "function") {
      return !!node.autoReturn;
    }
  };
  MacroHelper.prototype.funcIsBound = function (node) {
    if (node != null && node.type === "function") {
      return !!node.bound;
    }
  };
  MacroHelper.prototype.isArray = function (node) {
    return node && node.type === "array";
  };
  MacroHelper.prototype.elements = function (node) {
    if (node != null && node.type === "array") {
      return node.elements;
    }
  };
  MacroHelper.prototype.isObject = function (node) {
    return node && node.type === "object";
  };
  MacroHelper.prototype.pairs = function (node) {
    if (node != null && node.type === "object") {
      return node.pairs;
    }
  };
  MacroHelper.prototype.array = function (elements) {
    var _i, _len, _len2, element, i;
    if (!__isArray(elements)) {
      throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
    } else {
      for (_i = 0, _len = elements.length; _i < _len; ++_i) {
        if (!(elements[_i] instanceof Object)) {
          throw TypeError("Expected elements[" + _i + "] to be a Object, got " + __typeof(elements[_i]));
        }
      }
    }
    for (i = 0, _len2 = __num(elements.length); i < _len2; ++i) {
      element = elements[i];
      if (!element || typeof element !== "object") {
        throw Error("Expected at object at index #" + __strnum(i) + ", got " + __strnum(__typeof(element)));
      }
    }
    return ParserNode("array", 0, 0, { elements: elements });
  };
  MacroHelper.prototype.object = function (pairs) {
    var _len, i, pair;
    if (!__isArray(pairs)) {
      throw TypeError("Expected pairs to be a Array, got " + __typeof(pairs));
    }
    for (i = 0, _len = __num(pairs.length); i < _len; ++i) {
      pair = pairs[i];
      if (!pair || typeof pair !== "object") {
        throw Error("Expected an object at index #" + __strnum(i) + ", got " + __strnum(__typeof(pair)));
      } else if (!pair.key || typeof pair.key !== "object") {
        throw Error("Expected an object with object 'key' at index #" + __strnum(i) + ", got " + __strnum(__typeof(pair.key)));
      } else if (!pair.value || typeof pair.value !== "object") {
        throw Error("Expected an object with object 'value' at index #" + __strnum(i) + ", got " + __strnum(__typeof(pair.value)));
      }
    }
    return ParserNode("object", 0, 0, { pairs: pairs });
  };
  MacroHelper.prototype.isComplex = function (node) {
    var _ref;
    return node != null && (_ref = node.type) !== "const" && _ref !== "ident" && _ref !== "tmp" && (node.type !== "block" || node.nodes.length !== 0);
  };
  MacroHelper.prototype.cache = function (node, init, name, save) {
    var tmp;
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
    if (this.isComplex(node)) {
      tmp = this.tmp(name, save);
      init.push(ParserNode("let", this.index, this.index, {
        left: ParserNode("declarable", this.index, this.index, { ident: tmp, isMutable: false }),
        right: node
      }));
      return tmp;
    } else {
      return node;
    }
  };
  MacroHelper.prototype.empty = function (node) {
    var _this;
    _this = this;
    if (node == null) {
      return true;
    } else if (typeof node !== "object") {
      return false;
    } else if (node.type === "block") {
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
      return node.type === "nothing";
    }
  };
  function arrayEqual(x, y) {
    var i, len;
    if (x === y) {
      return true;
    } else {
      len = x.length;
      if (len !== y.length) {
        return false;
      } else {
        for (i = 0, __num(len); i < len; ++i) {
          if (x[i] !== y[i]) {
            return false;
          }
        }
        return true;
      }
    }
  }
  function objEqual(x, y) {
    var k;
    if (x === y) {
      return true;
    } else if (!x || typeof x !== "object") {
      return false;
    } else if (Array.isArray(x)) {
      return Array.isArray(y) && arrayEqual(x, y);
    } else {
      for (k in x) {
        if (__owns(x, k)) {
          if (!__owns(y, k) || x[k] !== y[k]) {
            return false;
          }
        }
      }
      return true;
    }
  }
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
  function constifyArray(array, startIndex, endIndex) {
    return ParserNode("array", startIndex, endIndex, {
      elements: (function () {
        var _arr, _i, _len, x;
        for (_arr = [], _i = 0, _len = __num(array.length); _i < _len; ++_i) {
          x = array[_i];
          _arr.push(constifyObject(x, startIndex, endIndex));
        }
        return _arr;
      }())
    });
  }
  KNOWN_HELPERS = require("./translator").knownHelpers;
  function constifyObject(obj, startIndex, endIndex) {
    var clone, hasAny, k, v;
    if (!obj || typeof obj !== "object" || obj instanceof RegExp) {
      return ParserNode("const", startIndex, endIndex, { value: obj });
    } else if (Array.isArray(obj)) {
      return constifyArray(obj, startIndex, endIndex);
    } else if (obj.type === "ident" && obj.name.charCodeAt(0) === 36) {
      return ParserNode("callChain", obj.startIndex, obj.endIndex, {
        head: ParserNode("ident", obj.startIndex, obj.endIndex, { name: "__wrap" }),
        links: [
          {
            type: "call",
            args: [ParserNode("ident", obj.startIndex, obj.endIndex, { name: obj.name.substring(1) })],
            existential: false,
            isNew: false
          }
        ]
      });
    } else if (obj.type === "ident" && __in(obj.name, KNOWN_HELPERS)) {
      return ParserNode("macroHelper", obj.startIndex, obj.endIndex, { name: obj.name });
    } else if (obj.type === "macroAccess") {
      return ParserNode("callChain", obj.startIndex, obj.endIndex, {
        head: ParserNode("ident", obj.startIndex, obj.endIndex, { name: "__macro" }),
        links: [
          {
            type: "call",
            args: [
              ParserNode("const", obj.startIndex, obj.endIndex, { value: obj.id }),
              constifyObject(obj.data, obj.startIndex, obj.endIndex)
            ],
            existential: false,
            isNew: false
          }
        ]
      });
    } else if (obj instanceof ParserNode) {
      clone = {};
      hasAny = false;
      for (k in obj) {
        if (__owns(obj, k)) {
          v = obj[k];
          if (k !== "type" && k !== "startIndex" && k !== "endIndex") {
            clone[k] = v;
            hasAny = true;
          }
        }
      }
      return ParserNode("callChain", obj.startIndex, obj.endIndex, {
        head: ParserNode("ident", obj.startIndex, obj.endIndex, { name: "__node" }),
        links: [
          {
            type: "call",
            args: [
              ParserNode("const", obj.startIndex, obj.endIndex, { value: obj.type }),
              ParserNode("const", obj.startIndex, obj.endIndex, { value: obj.startIndex }),
              ParserNode("const", obj.startIndex, obj.endIndex, { value: obj.endIndex })
            ].concat(hasAny
              ? [constifyObject(clone, obj.startIndex, obj.endIndex)]
              : [])
          }
        ]
      });
    } else {
      return ParserNode("object", startIndex, endIndex, {
        pairs: (function () {
          var _arr, k, v;
          _arr = [];
          for (k in obj) {
            if (__owns(obj, k)) {
              v = obj[k];
              _arr.push({
                key: ParserNode("const", startIndex, endIndex, { value: k }),
                value: constifyObject(v, startIndex, endIndex)
              });
            }
          }
          return _arr;
        }())
      });
    }
  }
  MacroHelper.constifyObject = constifyObject;
  walkers = {
    access: function (x, func) {
      var child, parent;
      parent = walk(x.parent, func);
      child = walk(x.child, func);
      if (parent !== x.parent || child !== x.child) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { parent: parent, child: child });
      } else {
        return x;
      }
    },
    "arguments": identity,
    array: function (x, func) {
      var elements;
      elements = walkArray(x.elements, func);
      if (elements !== x.elements) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { elements: elements });
      } else {
        return x;
      }
    },
    arrayParam: function (x, func) {
      var elements;
      elements = walkArray(x.elements, func);
      if (elements !== x.elements) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { elements: elements });
      } else {
        return x;
      }
    },
    assign: function (x, func) {
      var left, right;
      left = walk(x.left, func);
      right = walk(x.right, func);
      if (left !== x.left || right !== x.right) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { left: left, op: x.op, right: right });
      } else {
        return x;
      }
    },
    ast: function (x, func) {
      return constifyObject(x.node, x.startIndex, x.endIndex);
    },
    binary: function (x, func) {
      var left, right;
      left = walk(x.left, func);
      right = walk(x.right, func);
      if (left !== x.left || right !== x.right) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { left: left, op: x.op, right: right });
      } else {
        return x;
      }
    },
    block: function (x, func) {
      var nodes;
      nodes = walkArray(x.nodes, func);
      if (nodes !== x.nodes) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { nodes: nodes });
      } else {
        return x;
      }
    },
    "break": identity,
    callChain: (function () {
      var linkTypes;
      linkTypes = {
        access: function (link, func) {
          var child;
          child = walk(link.child, func);
          if (child !== link.child) {
            return { type: "access", child: child, existential: link.existential };
          } else {
            return link;
          }
        },
        call: function (link, func) {
          var args;
          args = walkArray(link.args, func);
          if (args !== link.args) {
            return { type: "call", args: args, existential: link.existential, isNew: link.isNew };
          } else {
            return link;
          }
        },
        index: (function () {
          var indexTypes;
          indexTypes = {
            single: function (x, func) {
              var node;
              node = walk(x.node, func);
              if (node !== x.node) {
                return { type: "single", node: node };
              } else {
                return x;
              }
            },
            slice: function (x, func) {
              var left, right;
              left = walk(x.left, func);
              right = walk(x.right, func);
              if (left !== x.left || right !== x.right) {
                return { type: "slice", left: left, right: right };
              } else {
                return x;
              }
            },
            multi: function (x, func) {
              var elements;
              elements = walkArray(x.elements, func);
              if (elements !== x.elements) {
                return { type: "multi", elements: elements };
              } else {
                return x;
              }
            }
          };
          return function (x, func) {
            var child, type;
            type = x.child.type;
            if (!__owns(indexTypes, type)) {
              throw Error("Unknown index type: " + __strnum(type));
            }
            child = indexTypes[type](x.child, func);
            if (child !== x.child) {
              return { type: "index", child: child, existential: x.existential };
            } else {
              return x;
            }
          };
        }())
      };
      function walkLink(link, func) {
        if (!__owns(linkTypes, link.type)) {
          throw Error("Unknown call-chain link type: " + __strnum(link.type));
        }
        return linkTypes[link.type](link, func);
      }
      return function (x, func) {
        var head, links;
        head = walk(x.head, func);
        links = map(x.links, walkLink, func);
        if (head !== x.head || links !== x.links) {
          return ParserNode(x.type, x.startIndex, x.endIndex, { head: head, links: links });
        } else {
          return x;
        }
      };
    }()),
    "const": identity,
    "continue": identity,
    "debugger": identity,
    declarable: function (x, func) {
      var ident;
      ident = walk(x.ident, func);
      if (ident !== x.ident) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { ident: ident, isMutable: x.isMutable });
      } else {
        return x;
      }
    },
    "eval": function (x, func) {
      var code;
      code = walk(x.code, func);
      if (code !== x.code) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { code: code });
      } else {
        return x;
      }
    },
    "for": function (x, func) {
      var body, init, step, test;
      init = walk(x.init, func);
      test = walk(x.test, func);
      step = walk(x.step, func);
      body = walk(x.body, func);
      if (init !== x.init || test !== x.test || step !== x.step || body !== x.body) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { init: init, test: test, step: step, body: body });
      } else {
        return x;
      }
    },
    forIn: function (x, func) {
      var body, key, object;
      key = walk(x.key, func);
      object = walk(x.object, func);
      body = walk(x.body, func);
      if (key !== x.key || object !== x.object || body !== x.body) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { key: key, object: object, body: body });
      } else {
        return x;
      }
    },
    "function": (function () {
      var paramTypes;
      paramTypes = {
        param: function (x, func) {
          var asType, defaultValue, ident;
          ident = walk(x.ident, func);
          defaultValue = walk(x.defaultValue, func);
          asType = walk(x.asType, func);
          if (ident !== x.ident || defaultValue !== x.defaultValue || asType !== x.asType) {
            return ParserNode(x.type, x.startIndex, x.endIndex, {
              ident: ident,
              defaultValue: defaultValue,
              spread: x.spread,
              isMutable: x.isMutable,
              asType: asType
            });
          } else {
            return x;
          }
        }
      };
      function walkParam(param, func) {
        if (!__owns(paramTypes, param.type)) {
          throw Error("Unknown param type: " + __strnum(param.type));
        }
        return paramTypes[param.type](param, func);
      }
      return function (x, func) {
        var body, params;
        params = map(x.params, walkParam, func);
        body = walk(x.body, func);
        if (params !== x.params || body !== x.body) {
          return ParserNode(x.type, x.startIndex, x.endIndex, { params: params, body: body, autoReturn: x.autoReturn, bound: x.bound });
        } else {
          return x;
        }
      };
    }()),
    ident: identity,
    "if": function (x, func) {
      var test, whenFalse, whenTrue;
      test = walk(x.test, func);
      whenTrue = walk(x.whenTrue, func);
      whenFalse = walk(x.whenFalse, func);
      if (test !== x.test || whenTrue !== x.whenTrue || whenFalse !== x.whenFalse) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { test: test, whenTrue: whenTrue, whenFalse: whenFalse });
      } else {
        return x;
      }
    },
    index: (function () {
      var indexTypes;
      indexTypes = {
        single: function (x, func) {
          var node;
          node = walk(x.node, func);
          if (node !== x.node) {
            return { type: "single", node: node };
          } else {
            return x;
          }
        }
      };
      return function (x, func) {
        var child, parent;
        if (!__owns(indexTypes, x.child.type)) {
          throw Error("Unknown index type: " + __strnum(x.child.type));
        }
        parent = walk(x.parent, func);
        child = indexTypes[x.child.type](x.child, func);
        if (parent !== x.parent || child !== x.child) {
          return ParserNode(x.type, x.startIndex, x.endIndex, { parent: parent, child: child });
        } else {
          return x;
        }
      };
    }()),
    "let": (function () {
      var declarableTypes;
      declarableTypes = {
        declarable: function (x, func) {
          var ident;
          ident = walk(x.ident, func);
          if (ident !== x.ident) {
            return ParserNode("declarable", x.startIndex, x.endIndex, { ident: ident, isMutable: x.isMutable });
          } else {
            return x;
          }
        }
      };
      return function (x, func) {
        var left, right;
        if (!__owns(declarableTypes, x.left.type)) {
          throw Error("Unknown let declarable type: " + __strnum(x.left.type));
        }
        left = declarableTypes[x.left.type](x.left, func);
        right = walk(x.right, func);
        if (left !== x.left || right !== x.right) {
          return ParserNode("let", x.startIndex, x.endIndex, { left: left, right: right });
        } else {
          return x;
        }
      };
    }()),
    nothing: identity,
    object: (function () {
      function walkPair(pair, func) {
        var key, value;
        key = walk(pair.key, func);
        value = walk(pair.value, func);
        if (key !== pair.key || value !== pair.value) {
          return { key: key, value: value };
        } else {
          return pair;
        }
      }
      return function (x, func) {
        var pairs;
        pairs = map(x.pairs, walkPair, func);
        if (pairs !== x.pairs) {
          return ParserNode(x.type, x.startIndex, x.endIndex, { pairs: pairs });
        } else {
          return x;
        }
      };
    }()),
    operator: identity,
    regexp: function (x, func) {
      var text;
      text = walk(x.text, func);
      if (text !== x.text) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { text: text, flags: x.flags });
      } else {
        return x;
      }
    },
    "return": function (x, func) {
      var node;
      node = walk(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node, existential: x.existential });
      } else {
        return x;
      }
    },
    root: function (x, func) {
      var body;
      body = walk(x.body, func);
      if (body !== x.body) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node, body: x.body });
      } else {
        return x;
      }
    },
    spread: function (x, func) {
      var node;
      node = walk(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node });
      } else {
        return x;
      }
    },
    string: function (x, func) {
      var parts;
      parts = walkArray(x.parts, func);
      if (parts !== x.parts) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { parts: parts });
      } else {
        return x;
      }
    },
    "this": identity,
    tmp: identity,
    tryCatch: function (x, func) {
      var catchBody, catchIdent, tryBody;
      tryBody = walk(x.tryBody, func);
      catchIdent = walk(x.catchIdent, func);
      catchBody = walk(x.catchBody, func);
      if (tryBody !== x.tryBody || catchIdent !== x.catchIdent || catchBody !== x.catchBody) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { tryBody: tryBody, catchIdent: catchIdent, catchBody: catchBody });
      } else {
        return x;
      }
    },
    tryFinally: function (x, func) {
      var finallyBody, tryBody;
      tryBody = walk(x.tryBody, func);
      finallyBody = walk(x.finallyBody, func);
      if (tryBody !== x.tryBody || finallyBody !== x.finallyBody) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { tryBody: tryBody, finallyBody: finallyBody });
      } else {
        return x;
      }
    },
    unary: function (x, func) {
      var node;
      node = walk(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { op: x.op, node: node });
      } else {
        return x;
      }
    },
    useMacro: function (x, func) {
      var node;
      node = walk(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node, tmps: x.tmps, macroHelpers: x.macroHelpers });
      } else {
        return x;
      }
    },
    "yield": function (x, func) {
      var node;
      node = walk(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node, multiple: x.multiple });
      } else {
        return x;
      }
    }
  };
  function walk(node, func) {
    var _ref;
    if (!node || typeof node !== "object" || node instanceof RegExp) {
      return node;
    }
    if (!__owns(walkers, node.type)) {
      throw Error("Unknown node type to walk through: " + __strnum(node.type));
    }
    if ((_ref = func(node)) != null) {
      return _ref;
    }
    return walkers[node.type](node, func);
  }
  function walkArray(array, func) {
    return map(array, walk, func);
  }
  MacroHelper.fixAsts = function (result) {
    return walk(result, function () {});
  };
  MacroHelper.wrap = function (value) {
    var _i, _len, item, nodes, wrapped;
    if (value == null) {
      value = [];
    }
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return MacroHelper.wrap(value[0]);
      } else {
        nodes = [];
        for (_i = 0, _len = __num(value.length); _i < _len; ++_i) {
          item = value[_i];
          wrapped = MacroHelper.wrap(item);
          if (wrapped.type === "block") {
            nodes.push.apply(nodes, __toArray(wrapped.nodes));
          } else {
            nodes.push(wrapped);
          }
        }
        return ParserNode("block", 0, 0, { nodes: nodes });
      }
    } else if (typeof value !== "object" || value instanceof RegExp) {
      throw Error("Trying to wrap a non-object: " + __strnum(__typeof(value)));
    } else {
      return value;
    }
  };
  MacroHelper.node = function (type, startIndex, endIndex, data) {
    return ParserNode(type, startIndex, endIndex, data);
  };
  MacroHelper.prototype.hasFunc = function (node) {
    var FOUND;
    FOUND = {};
    try {
      walk(node, function (x) {
        if (x.type === "function") {
          throw FOUND;
        }
      });
    } catch (e) {
      if (e !== FOUND) {
        (function () {
          throw e;
        }());
      }
      return true;
    }
    return false;
  };
  mutators = {
    block: function (x, func) {
      var lastNode, len, nodes;
      nodes = x.nodes;
      len = nodes.length;
      if (len !== 0) {
        lastNode = this.mutateLast(nodes[__num(len) - 1], func);
        if (lastNode !== nodes[__num(len) - 1]) {
          return ParserNode(x.type, x.startIndex, x.endIndex, {
            nodes: __toArray(__slice(
              nodes,
              void 0,
              __num(len) - 1
            )).concat([lastNode])
          });
        }
      }
      return x;
    },
    "if": function (x, func) {
      var whenFalse, whenTrue;
      whenTrue = this.mutateLast(x.whenTrue, func);
      whenFalse = this.mutateLast(x.whenFalse, func);
      if (whenTrue !== x.whenTrue || whenFalse !== x.whenFalse) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { test: x.test, whenTrue: whenTrue, whenFalse: whenFalse });
      } else {
        return x;
      }
    },
    useMacro: function (x, func) {
      var node;
      node = this.mutateLast(x.node, func);
      if (node !== x.node) {
        return ParserNode(x.type, x.startIndex, x.endIndex, { node: node, tmps: x.tmps, macroHelpers: x.macroHelpers });
      } else {
        return x;
      }
    },
    "break": identity,
    "continue": identity,
    nothing: identity,
    "return": identity,
    "debugger": identity,
    "throw": identity
  };
  MacroHelper.prototype.mutateLast = function (node, func) {
    var _ref;
    if (!node || typeof node !== "object" || node instanceof RegExp) {
      return node;
    } else if (!__owns(mutators, node.type)) {
      return (_ref = func(node)) != null ? _ref : node;
    } else {
      return mutators[node.type].call(this, node, func);
    }
  };
  return MacroHelper;
}());
MacroHolder = (function () {
  function MacroHolder() {
    if (!(this instanceof MacroHolder)) {
      throw TypeError("Must be instantiated with new");
    }
    this.byName = {};
    this.byId = [];
  }
  MacroHolder.prototype.getByName = function (name) {
    var byName;
    byName = this.byName;
    if (__owns(byName, name)) {
      return byName[name];
    }
  };
  MacroHolder.prototype.getOrAddByName = function (name) {
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
          _backend != null ? _backend.parserName : void 0,
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
  MacroHolder.prototype.getById = function (id) {
    var byId;
    byId = this.byId;
    if (!__lt(id, 0) && __lt(id, byId.length)) {
      return byId[id];
    }
  };
  MacroHolder.prototype.addMacro = function (m) {
    var byId;
    byId = this.byId;
    byId.push(m);
    return __num(byId.length) - 1;
  };
  return MacroHolder;
}());
ParserNode = (function () {
  function ParserNode(type, startIndex, endIndex, data) {
    var k, self, v;
    if (typeof type !== "string") {
      throw TypeError("Expected type to be a String, got " + __typeof(type));
    }
    if (typeof startIndex !== "number") {
      throw TypeError("Expected startIndex to be a Number, got " + __typeof(startIndex));
    }
    if (typeof endIndex !== "number") {
      throw TypeError("Expected endIndex to be a Number, got " + __typeof(endIndex));
    }
    if (data == null) {
      data = null;
    } else if (!(data instanceof Object)) {
      throw TypeError("Expected data to be a Object or null, got " + __typeof(data));
    }
    if (Array.isArray(data)) {
      throw TypeError("Expected a non-array for data");
    }
    self = this instanceof ParserNode ? this : __create(ParserNode.prototype);
    self.type = type;
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    if (data != null) {
      for (k in data) {
        if (__owns(data, k)) {
          v = data[k];
          self[k] = v;
        }
      }
    }
    return self;
  }
  return ParserNode;
}());
State = (function () {
  var macroSyntaxTypes;
  function State(data, macros, index, failures, cache, indent, currentMacro) {
    this.data = data;
    if (macros == null) {
      macros = new MacroHolder();
    }
    this.macros = macros;
    if (index == null) {
      index = 0;
    }
    this.index = index;
    if (failures == null) {
      failures = new FailureManager();
    }
    this.failures = failures;
    if (cache == null) {
      cache = [];
    }
    this.cache = cache;
    if (indent == null) {
      indent = new Stack(1);
    }
    this.indent = indent;
    if (currentMacro == null) {
      currentMacro = null;
    }
    this.currentMacro = currentMacro;
  }
  State.prototype.clone = function () {
    return new State(
      this.data,
      this.macros,
      this.index,
      this.failures,
      this.cache,
      this.indent.clone(),
      this.currentMacro
    );
  };
  State.prototype.update = function (clone) {
    this.index = clone.index;
    this.indent = clone.indent.clone();
    this.macros = clone.macros;
  };
  State.prototype.fail = function (message) {
    this.failures.add(message, this.index);
  };
  State.prototype.error = function (message) {
    throw ParserError(message, this.data, this.index);
  };
  State.prototype.startMacro = function (name) {
    if (this.currentMacro) {
      this.error("Attempting to define a macro " + __strnum(name) + " inside a macro " + __strnum(this.currentMacro));
    }
    this.currentMacro = name;
  };
  State.prototype.endMacro = function () {
    if (!this.currentMacro) {
      this.error("Ending a macro when not in a macro");
    }
    this.currentMacro = null;
    return this.nothing(this.index);
  };
  macroSyntaxTypes = {
    syntax: function (index, params, body) {
      var _this, funcParams, handler, nextParts, rawFunc, translated;
      _this = this;
      nextParts = [];
      function calcParam(param) {
        var calced, choices, ident, multiplier, string, type;
        type = param.type;
        if (type === "ident") {
          ident = param.name;
          if (ident === "Logic") {
            return Logic;
          } else if (ident === "Expression") {
            return Expression;
          } else if (ident === "Statement") {
            return Statement;
          } else if (ident === "Body") {
            nextParts.push(Newline, EmptyLines, CheckIndent);
            return Body;
          } else if (ident === "Identifier") {
            return Identifier;
          } else if (ident === "Declarable") {
            return Declarable;
          } else if (ident === "Parameter") {
            return Parameter;
          } else if (ident === "DedentedBody") {
            return DedentedBody;
          } else {
            return _this.error("Unexpected type ident: " + __strnum(ident));
          }
        } else if (type === "syntaxSequence") {
          return handleParams(param.params, []);
        } else if (type === "syntaxChoice") {
          choices = (function () {
            var _arr, _arr2, _i, _len, choice;
            for (_arr = [], _arr2 = param.choices, _i = 0, _len = __num(_arr2.length); _i < _len; ++_i) {
              choice = _arr2[_i];
              _arr.push(calcParam(choice));
            }
            return _arr;
          }());
          return cache(function (o) {
            var _i, _len, result, rule;
            for (_i = 0, _len = __num(choices.length); _i < _len; ++_i) {
              rule = choices[_i];
              result = rule(o);
              if (result) {
                return result;
              }
            }
            return false;
          });
        } else if (type === "const") {
          string = param.value;
          if (typeof string !== "string") {
            _this.error("Expected a constant string parameter, got " + __strnum(__typeof(string)));
          }
          if (string === ",") {
            return Comma;
          } else if (string === ";") {
            return Semicolon;
          } else if (string === "") {
            return Nothing;
          } else {
            return wordOrSymbol(string);
          }
        } else if (type === "syntaxMany") {
          multiplier = param.multiplier;
          calced = calcParam(param.inner);
          if (multiplier === "*") {
            return named(
              __strnum((calced != null ? calced.parserName : void 0) || "<nothing>") + "*",
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
          } else if (multiplier === "+") {
            return named(
              __strnum((calced != null ? calced.parserName : void 0) || "<nothing>") + "+",
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
                if (!__lt(result.length, 1)) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
            );
          } else if (multiplier === "?") {
            return function (o) {
              return calced(o) || Nothing(o);
            };
          } else {
            throw Error("Unknown syntax multiplier: " + __strnum(multiplier));
          }
        } else {
          return _this.error("Unexpected type: " + __strnum(type));
        }
      }
      function handleParams(params, sequence) {
        var _i, _len, _ref, ident, key, param, string, type;
        for (_i = 0, _len = __num(params.length); _i < _len; ++_i) {
          param = params[_i];
          if (param.type !== "syntaxParam" || !param.asType || param.asType.type !== "syntaxMany" && (param.asType.type !== "ident" || param.asType.name !== "DedentedBody")) {
            sequence.push.apply(sequence, __toArray(nextParts));
            nextParts = [];
          }
          type = param.type;
          if (type === "const") {
            string = param.value;
            if (typeof string !== "string") {
              _this.error("Expected a constant string parameter, got " + __strnum(__typeof(string)));
            }
            if (string === ",") {
              sequence.push(Comma);
            } else if (string === ";") {
              sequence.push(Semicolon);
            } else {
              sequence.push(wordOrSymbol(string));
            }
          } else if (type === "syntaxParam") {
            ident = param.ident;
            key = ident.type === "ident" ? ident.name
              : ident.type === "this" ? "this"
              : (function () {
                throw Error("Don't know how to handle ident type: " + __strnum(ident.type));
              }());
            type = (_ref = param.asType) != null ? _ref : ParserNode("ident", 0, 0, { name: "Expression" });
            sequence.push([key, calcParam(type)]);
          } else {
            _this.error("Unexpected parameter type: " + __strnum(type));
          }
        }
        return sequential(sequence);
      }
      funcParams = (function () {
        var _arr, _i, _len, param;
        for (_arr = [], _i = 0, _len = __num(params.length); _i < _len; ++_i) {
          param = params[_i];
          if (param.type === "syntaxParam") {
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
      rawFunc = this.root(index, this["return"](
        index,
        this["function"](
          index,
          [
            this.objectParam(index, funcParams),
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
      translated = require("./translator")(rawFunc);
      handler = translated.node.toFunction()();
      if (typeof handler !== "function") {
        throw Error("Error creating function for macro: " + __strnum(this.currentMacro));
      }
      return {
        handler: handler,
        rule: handleParams(params, []),
        macroHelpers: translated.macroHelpers
      };
    },
    call: function (index, params, body) {
      var handler, rawFunc, translated;
      rawFunc = this.root(index, this["return"](index, this["function"](
        index,
        [
          this.arrayParam(index, params),
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
      )));
      translated = require("./translator")(rawFunc);
      handler = translated.node.toFunction()();
      if (typeof handler !== "function") {
        throw Error("Error creating function for macro: " + __strnum(this.currentMacro));
      }
      return { handler: handler, rule: InvocationArguments, macroHelpers: translated.macroHelpers };
    }
  };
  State.prototype.macroSyntax = function (index, type, params, body) {
    var _this, data, func, handler, m, macroHelpers, macroId, macros, rule;
    _this = this;
    if (!Array.isArray(params)) {
      throw TypeError("Expected params to be an array, got " + __strnum(__typeof(params)));
    } else if (!body || typeof body !== "object" || body instanceof RegExp) {
      throw TypeError("Expected body to be an object, got " + __strnum(__typeof(body)));
    }
    if (!__owns(macroSyntaxTypes, type)) {
      throw Error("Unknown macro-syntax type: " + __strnum(type));
    }
    if (!this.currentMacro) {
      this.error("Attempting to specify a macro syntax when not in a macro");
    }
    data = macroSyntaxTypes[type].call(this, index, params, MacroHelper.fixAsts(body));
    handler = data.handler;
    rule = data.rule;
    macroHelpers = data.macroHelpers;
    macros = this.macros;
    function mutator(x, o, i) {
      var macroHelper, result, tmps;
      if (_inAst.peek()) {
        return o.macroAccess(i, macroId, x);
      } else {
        macroHelper = new MacroHelper(o, i, !_statement.peek());
        result = handler.call(
          macroHelper,
          x,
          MacroHelper.wrap,
          MacroHelper.node,
          function (id, data) {
            return macros.getById(id)(data, o, i);
          }
        );
        tmps = macroHelper.getTmps();
        return o.useMacro(i, result, tmps.unsaved, macroHelpers);
      }
    }
    m = macros.getOrAddByName(this.currentMacro);
    func = (function () {
      var _rule;
      _rule = m.token;
      return (function () {
        function _rule2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_rule(clone) && (result = rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(
          _rule2 != null ? _rule2.parserName : void 0,
          function (o) {
            var index, result;
            index = o.index;
            result = _rule2(o);
            if (!result) {
              return false;
            } else if (typeof mutator === "function") {
              return mutator(result, o, index);
            } else if (mutator !== void 0) {
              return mutator;
            } else {
              return result;
            }
          }
        );
      }());
    }());
    macroId = macros.addMacro(mutator);
    m.data.push(func);
  };
  State.prototype.regexp = function (index, text, flags) {
    return ParserNode("regexp", index, this.index, { text: text, flags: flags });
  };
  State.prototype["this"] = function (index) {
    return ParserNode("this", index, this.index);
  };
  State.prototype["break"] = function (index) {
    return ParserNode("break", index, this.index);
  };
  State.prototype["continue"] = function (index) {
    return ParserNode("continue", index, this.index);
  };
  State.prototype["const"] = function (index, value) {
    return ParserNode("const", index, this.index, { value: value });
  };
  State.prototype.string = function (index, parts) {
    if (!__isArray(parts)) {
      throw TypeError("Expected parts to be a Array, got " + __typeof(parts));
    }
    return ParserNode("string", index, this.index, { parts: parts });
  };
  State.prototype.args = function (index) {
    return ParserNode("arguments", index, this.index);
  };
  State.prototype.ident = function (index, name) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    return ParserNode("ident", index, this.index, { name: name });
  };
  State.prototype.operator = function (index, op) {
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    return ParserNode("operator", index, this.index, { op: op });
  };
  State.prototype.array = function (index, elements) {
    if (!__isArray(elements)) {
      throw TypeError("Expected elements to be a Array, got " + __typeof(elements));
    }
    return ParserNode("array", index, this.index, { elements: elements });
  };
  State.prototype.arrayParam = State.prototype.array;
  State.prototype.object = function (index, pairs) {
    var _i, _len;
    if (!__isArray(pairs)) {
      throw TypeError("Expected pairs to be an Array, got " + __typeof(pairs));
    } else {
      for (_i = 0, _len = pairs.length; _i < _len; ++_i) {
        if (!(pairs[_i] instanceof Object)) {
          throw TypeError("Expected pairs[" + _i + "] to be a Object, got " + __typeof(pairs[_i]));
        }
      }
    }
    return ParserNode("object", index, this.index, { pairs: pairs });
  };
  State.prototype.objectParam = State.prototype.object;
  State.prototype.access = function (index, parent, child) {
    if (!(parent instanceof Object)) {
      throw TypeError("Expected parent to be a Object, got " + __typeof(parent));
    }
    if (!(child instanceof Object)) {
      throw TypeError("Expected child to be a Object, got " + __typeof(child));
    }
    return ParserNode("access", index, this.index, { parent: parent, child: child });
  };
  State.prototype.accessIndex = function (index, parent, child) {
    if (!(parent instanceof Object)) {
      throw TypeError("Expected parent to be a Object, got " + __typeof(parent));
    }
    if (!(child instanceof Object)) {
      throw TypeError("Expected child to be a Object, got " + __typeof(child));
    }
    return ParserNode("index", index, this.index, { parent: parent, child: child });
  };
  State.prototype.unary = function (index, op, node) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    return ParserNode("unary", index, this.index, { op: op, node: node });
  };
  State.prototype.typeUnion = function (index, types) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!__isArray(types)) {
      throw TypeError("Expected types to be a Array, got " + __typeof(types));
    }
    return ParserNode("typeUnion", index, this.index, { types: types });
  };
  State.prototype.typeArray = function (index, subtype) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(subtype instanceof Object)) {
      throw TypeError("Expected subtype to be a Object, got " + __typeof(subtype));
    }
    return ParserNode("typeArray", index, this.index, { subtype: subtype });
  };
  State.prototype.param = function (index, ident, defaultValue, spread, isMutable, asType) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
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
    return ParserNode("param", index, this.index, {
      ident: ident,
      defaultValue: defaultValue,
      spread: spread,
      isMutable: isMutable,
      asType: asType
    });
  };
  State.prototype.nothing = function (index) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    return ParserNode("nothing", index, this.index);
  };
  State.prototype["debugger"] = function (index) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    return ParserNode("debugger", index, this.index);
  };
  State.prototype["function"] = function (index, params, body, autoReturn, bound) {
    var _i, _len;
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!__isArray(params)) {
      throw TypeError("Expected params to be an Array, got " + __typeof(params));
    } else {
      for (_i = 0, _len = params.length; _i < _len; ++_i) {
        if (!(params[_i] instanceof Object)) {
          throw TypeError("Expected params[" + _i + "] to be a Object, got " + __typeof(params[_i]));
        }
      }
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    if (autoReturn == null) {
      autoReturn = true;
    } else if (typeof autoReturn !== "boolean") {
      throw TypeError("Expected autoReturn to be a Boolean, got " + __typeof(autoReturn));
    }
    if (bound == null) {
      bound = false;
    } else if (typeof bound !== "boolean") {
      throw TypeError("Expected bound to be a Boolean, got " + __typeof(bound));
    }
    return ParserNode("function", index, this.index, { params: params, body: body, autoReturn: autoReturn, bound: bound });
  };
  State.prototype.syntaxSequence = function (index, params) {
    var _i, _len;
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!__isArray(params)) {
      throw TypeError("Expected params to be an Array, got " + __typeof(params));
    } else {
      for (_i = 0, _len = params.length; _i < _len; ++_i) {
        if (!(params[_i] instanceof Object)) {
          throw TypeError("Expected params[" + _i + "] to be a Object, got " + __typeof(params[_i]));
        }
      }
    }
    return ParserNode("syntaxSequence", index, this.index, { params: params });
  };
  State.prototype.syntaxChoice = function (index, choices) {
    var _i, _len;
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!__isArray(choices)) {
      throw TypeError("Expected choices to be an Array, got " + __typeof(choices));
    } else {
      for (_i = 0, _len = choices.length; _i < _len; ++_i) {
        if (!(choices[_i] instanceof Object)) {
          throw TypeError("Expected choices[" + _i + "] to be a Object, got " + __typeof(choices[_i]));
        }
      }
    }
    return ParserNode("syntaxChoice", index, this.index, { choices: choices });
  };
  State.prototype.syntaxParam = function (index, ident, asType) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(ident instanceof Object)) {
      throw TypeError("Expected ident to be a Object, got " + __typeof(ident));
    }
    return ParserNode("syntaxParam", index, this.index, { ident: ident, asType: asType });
  };
  State.prototype.syntaxMany = function (index, inner, multiplier) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(inner instanceof Object)) {
      throw TypeError("Expected inner to be a Object, got " + __typeof(inner));
    }
    if (typeof multiplier !== "string") {
      throw TypeError("Expected multiplier to be a String, got " + __typeof(multiplier));
    }
    return ParserNode("syntaxMany", index, this.index, { inner: inner, multiplier: multiplier });
  };
  State.prototype.defineHelper = function (index, name, value) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(name instanceof Object)) {
      throw TypeError("Expected name to be a Object, got " + __typeof(name));
    }
    if (!(value instanceof Object)) {
      throw TypeError("Expected value to be a Object, got " + __typeof(value));
    }
    return ParserNode("defineHelper", index, this.index, { name: name, value: value });
  };
  State.prototype.assign = function (index, left, op, right) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(left instanceof Object)) {
      throw TypeError("Expected left to be a Object, got " + __typeof(left));
    }
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(right instanceof Object)) {
      throw TypeError("Expected right to be a Object, got " + __typeof(right));
    }
    return ParserNode("assign", index, this.index, { left: left, op: op, right: right });
  };
  State.prototype.callChain = function (index, head, links) {
    var _i, _len;
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(head instanceof Object)) {
      throw TypeError("Expected head to be a Object, got " + __typeof(head));
    }
    if (!__isArray(links)) {
      throw TypeError("Expected links to be an Array, got " + __typeof(links));
    } else {
      for (_i = 0, _len = links.length; _i < _len; ++_i) {
        if (!(links[_i] instanceof Object)) {
          throw TypeError("Expected links[" + _i + "] to be a Object, got " + __typeof(links[_i]));
        }
      }
    }
    return ParserNode("callChain", index, this.index, { head: head, links: links });
  };
  State.prototype.binary = function (index, left, op, right) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(left instanceof Object)) {
      throw TypeError("Expected left to be a Object, got " + __typeof(left));
    }
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(right instanceof Object)) {
      throw TypeError("Expected right to be a Object, got " + __typeof(right));
    }
    return ParserNode("binary", index, this.index, { left: left, op: op, right: right });
  };
  State.prototype["return"] = function (index, node, existential) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    if (existential == null) {
      existential = false;
    } else if (typeof existential !== "boolean") {
      throw TypeError("Expected existential to be a Boolean, got " + __typeof(existential));
    }
    return ParserNode("return", index, this.index, { node: node, existential: existential });
  };
  State.prototype.spread = function (index, node) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    return ParserNode("spread", index, this.index, { node: node });
  };
  State.prototype.ast = function (index, node) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    return ParserNode("ast", index, this.index, { node: node });
  };
  State.prototype["eval"] = function (index, code) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(code instanceof Object)) {
      throw TypeError("Expected code to be a Object, got " + __typeof(code));
    }
    return ParserNode("eval", index, this.index, { code: code });
  };
  State.prototype["yield"] = function (index, node, multiple) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    if (multiple == null) {
      multiple = false;
    } else if (typeof multiple !== "boolean") {
      throw TypeError("Expected multiple to be a Boolean, got " + __typeof(multiple));
    }
    return ParserNode("yield", index, this.index, { node: node, multiple: multiple });
  };
  State.prototype.block = function (index, nodes) {
    var _i, _len;
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!__isArray(nodes)) {
      throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
    } else {
      for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
        if (!(nodes[_i] instanceof Object)) {
          throw TypeError("Expected nodes[" + _i + "] to be a Object, got " + __typeof(nodes[_i]));
        }
      }
    }
    return ParserNode("block", index, this.index, { nodes: nodes });
  };
  State.prototype.root = function (index, body) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    return ParserNode("root", index, this.index, { body: body });
  };
  State.prototype.macroAccess = function (index, id, data) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (typeof id !== "number") {
      throw TypeError("Expected id to be a Number, got " + __typeof(id));
    }
    if (!(data instanceof Object)) {
      throw TypeError("Expected data to be a Object, got " + __typeof(data));
    }
    return ParserNode("macroAccess", index, this.index, { id: id, data: data });
  };
  State.prototype.useMacro = function (index, node, tmps, macroHelpers) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(node instanceof Object)) {
      throw TypeError("Expected node to be a Object, got " + __typeof(node));
    }
    if (!__isArray(tmps)) {
      throw TypeError("Expected tmps to be a Array, got " + __typeof(tmps));
    }
    if (!__isArray(macroHelpers)) {
      throw TypeError("Expected macroHelpers to be a Array, got " + __typeof(macroHelpers));
    }
    return ParserNode("useMacro", index, this.index, { node: node, tmps: tmps, macroHelpers: macroHelpers });
  };
  State.prototype.declarable = function (index, ident, isMutable) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(ident instanceof Object)) {
      throw TypeError("Expected ident to be a Object, got " + __typeof(ident));
    }
    if (isMutable == null) {
      isMutable = false;
    } else if (typeof isMutable !== "boolean") {
      throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
    }
    return ParserNode("declarable", index, this.index, { ident: ident, isMutable: isMutable });
  };
  State.prototype["let"] = function (index, left, right) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(left instanceof Object)) {
      throw TypeError("Expected left to be a Object, got " + __typeof(left));
    }
    if (!(right instanceof Object)) {
      throw TypeError("Expected right to be a Object, got " + __typeof(right));
    }
    return ParserNode("let", index, this.index, { left: left, right: right });
  };
  State.prototype["if"] = function (index, test, whenTrue, whenFalse) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(test instanceof Object)) {
      throw TypeError("Expected test to be a Object, got " + __typeof(test));
    }
    if (!(whenTrue instanceof Object)) {
      throw TypeError("Expected whenTrue to be a Object, got " + __typeof(whenTrue));
    }
    if (whenFalse == null) {
      whenFalse = null;
    } else if (!(whenFalse instanceof Object)) {
      throw TypeError("Expected whenFalse to be a Object or null, got " + __typeof(whenFalse));
    }
    return ParserNode("if", index, this.index, { test: test, whenTrue: whenTrue, whenFalse: whenFalse });
  };
  State.prototype.tryCatch = function (index, tryBody, catchIdent, catchBody) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(tryBody instanceof Object)) {
      throw TypeError("Expected tryBody to be a Object, got " + __typeof(tryBody));
    }
    if (!(catchIdent instanceof Object)) {
      throw TypeError("Expected catchIdent to be a Object, got " + __typeof(catchIdent));
    }
    if (!(catchBody instanceof Object)) {
      throw TypeError("Expected catchBody to be a Object, got " + __typeof(catchBody));
    }
    return ParserNode("tryCatch", index, this.index, { tryBody: tryBody, catchIdent: catchIdent, catchBody: catchBody });
  };
  State.prototype.tryFinally = function (index, tryBody, finallyBody) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(tryBody instanceof Object)) {
      throw TypeError("Expected tryBody to be a Object, got " + __typeof(tryBody));
    }
    if (!(finallyBody instanceof Object)) {
      throw TypeError("Expected finallyBody to be a Object, got " + __typeof(finallyBody));
    }
    return ParserNode("tryFinally", index, this.index, { tryBody: tryBody, finallyBody: finallyBody });
  };
  State.prototype["for"] = function (index, init, test, step, body) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (init == null) {
      init = null;
    } else if (!(init instanceof Object)) {
      throw TypeError("Expected init to be a Object or null, got " + __typeof(init));
    }
    if (test == null) {
      test = null;
    } else if (!(test instanceof Object)) {
      throw TypeError("Expected test to be a Object or null, got " + __typeof(test));
    }
    if (step == null) {
      step = null;
    } else if (!(step instanceof Object)) {
      throw TypeError("Expected step to be a Object or null, got " + __typeof(step));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    return ParserNode("for", index, this.index, { init: init, test: test, step: step, body: body });
  };
  State.prototype.forIn = function (index, key, object, body) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (!(key instanceof Object)) {
      throw TypeError("Expected key to be a Object, got " + __typeof(key));
    }
    if (!(object instanceof Object)) {
      throw TypeError("Expected object to be a Object, got " + __typeof(object));
    }
    if (!(body instanceof Object)) {
      throw TypeError("Expected body to be a Object, got " + __typeof(body));
    }
    return ParserNode("forIn", index, this.index, { key: key, object: object, body: body });
  };
  State.prototype.tmp = function (index, id, name) {
    if (typeof index !== "number") {
      throw TypeError("Expected index to be a Number, got " + __typeof(index));
    }
    if (typeof id !== "number") {
      throw TypeError("Expected id to be a Number, got " + __typeof(id));
    }
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    return ParserNode("tmp", index, this.index, { id: id, name: name });
  };
  return State;
}());
function unique(array) {
  var _i, _len, item, result;
  result = [];
  for (_i = 0, _len = __num(array.length); _i < _len; ++_i) {
    item = array[_i];
    if (!__in(item, result)) {
      result.push(item);
    }
  }
  return result;
}
function buildExpected(errors) {
  var errs, len;
  errs = unique(errors);
  errs.sort(function (a, b) {
    return __cmp(a.toLowerCase(), b.toLowerCase());
  });
  len = errs.length;
  if (len === 0) {
    return "End of input";
  } else if (len === 1) {
    return errs[0];
  } else if (len === 2) {
    return __strnum(errs[0]) + " or " + __strnum(errs[1]);
  } else {
    return __strnum(__slice(
      errs,
      void 0,
      __num(len) - 1
    ).join(", ")) + ", or " + __strnum(errs[__num(errs.length) - 1]);
  }
}
function buildErrorMessage(errors, lastToken) {
  return "Expected " + __strnum(buildExpected(errors)) + ", but " + __strnum(lastToken) + " found";
}
function parse(text, macros, options) {
  var lastToken, o, position, result;
  if (options == null) {
    options = {};
  }
  if (typeof text !== "string") {
    throw TypeError("Expected text to be a string, got " + __strnum(__typeof(text)));
  }
  o = new State(text, macros);
  result = (function () {
    try {
      return Root(o);
    } catch (e) {
      if (e !== SHORT_CIRCUIT) {
        (function () {
          throw e;
        }());
      }
    }
  }());
  if (!result || __lt(o.index, o.data.length)) {
    position = o.failures.position;
    lastToken = __lt(position, o.data.length)
      ? JSON.stringify(o.data.substring(position, __num(position) + 20))
      : "end-of-input";
    throw ParserError(
      buildErrorMessage(o.failures.messages, lastToken),
      o.data,
      position
    );
  } else {
    return { result: result, macros: o.macros };
  }
}
module.exports = parse;
module.exports.ParserError = ParserError;
module.exports.ParserNode = ParserNode;
