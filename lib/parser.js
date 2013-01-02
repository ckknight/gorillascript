"use strict";
var __cmp, __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, _inAst, _indexSlice, _Name, _NameOrSymbol, _Space, _statement, _Symbol, Addition, Advance, AlphaNum, AnyChar, ArgumentsLiteral, ArrayLiteral, ArrayParameter, ArrayType, Assignment, Ast, Asterix, AsToken, AstToken, AsType, AtSign, Backslash, BackslashEscapeSequence, BasicInvocationOrAccess, bB, BinaryDigit, BinaryInteger, BitwiseAnd, BitwiseOr, BitwiseShift, BitwiseXor, Block, Body, BodyOrStatement, Break, CheckIndent, CheckStop, CloseCurlyBrace, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonEqual, Comma, CommaOrNewline, CommaOrNewlineWithCheckIndent, Comment, Comparison, ComplexAssignable, CompoundAssignment, CompoundAssignmentOp, ConstantLiteral, Containment, Continue, CountIndent, Debugger, DecimalDigit, DecimalDigits, DecimalNumber, Declarable, DeclareEqualSymbol, DedentedBody, DefineHelper, DefineHelperStart, DirectAssignment, DollarSign, DoubleColon, DoubleQuote, DoubleStringLiteral, DualObjectKey, eE, EmptyLine, EmptyLines, Eof, EscapeSequence, Eval, EvalToken, ExistentialOr, ExistentialSymbol, ExistentialSymbolNoSpace, ExistentialUnary, Exponentiation, Expression, ExpressionAsStatement, ExpressionOrNothing, FailureManager, FalseLiteral, freeze, fromCharCode, FunctionBody, FunctionDeclaration, FunctionLiteral, generateCacheKey, HashSign, HexDigit, HexEscapeSequence, HexInteger, Identifier, IdentifierDeclarable, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrAccessPart, IdentifierOrAccessStart, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierParameter, inAst, InBlock, IndentedObjectLiteral, INDENTS, Index, IndexMultiple, IndexSlice, inExpression, InfinityLiteral, inIndexSlice, inStatement, InvocationArguments, InvocationOrAccess, KeyValuePair, KvpParameter, Let, Letter, LetToken, Line, Literal, Logic, LogicalAnd, LogicalOr, LogicalXor, LowerR, LowerU, LowerX, Macro, MacroBody, MacroHelper, MacroHolder, MacroName, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, MacroToken, Max, MaybeAdvance, MaybeAsType, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExistentialSymbol, MaybeExistentialSymbolNoSpace, MaybeMutableToken, MaybeNotToken, MaybeSpreadToken, Min, MinMax, Minus, MultiLineComment, Multiplication, MutableToken, Name, NameChar, NamePart, NameStart, NaNLiteral, Negate, Newline, NoSpace, Nothing, NOTHING, NotToken, NullLiteral, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectLiteral, ObjectParameter, OctalDigit, OctalInteger, oO, OpenCurlyBrace, OpenParenthesis, OpenParenthesisChar, OpenSquareBracket, OpenSquareBracketChar, Operator, ParamDualObjectKey, Parameter, Parameters, ParameterSequence, ParamSingularObjectKey, Parenthetical, ParserError, Period, Pipe, PipeChar, Plus, PlusOrMinus, PopIndent, PrimaryExpression, PushIndent, RadixInteger, RawDecimalDigits, RegexDoubleToken, RegexFlags, RegexLiteral, RegexSingleToken, Return, ReturnToken, Root, Semicolon, SemicolonChar, Shebang, SHORT_CIRCUIT, SimpleAssignable, SimpleConstantLiteral, SimpleOrArrayType, SimpleType, SingleEscapeCharacter, SingleLineComment, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, SomeSpace, Space, SpaceChar, SpaceNewline, Spaceship, SpreadOrExpression, SpreadToken, Stack, State, Statement, Stop, StringConcatenation, StringIndent, StringInterpolation, StringLiteral, Symbol, SymbolChar, SyntaxToken, ThisLiteral, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, TripleDoubleQuote, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TypeReference, Unary, UnclosedArguments, UnclosedObjectLiteral, Underscore, UnicodeEscapeSequence, UnionType, UseMacro, VoidLiteral, WhiteSpace, xX, Yield, YieldToken, Zero;
__cmp = function (left, right) {
  var type;
  type = typeof left;
  if (type !== "number" && type !== "string") {
    throw TypeError("Cannot compare a non-number/string: " + type);
  } else if (type !== typeof right) {
    throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
  } else if (left < right) {
    return -1;
  } else if (right < left) {
    return 1;
  } else {
    return 0;
  }
};
__create = typeof Object.create === "function" ? Object.create : function (x) {
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
__isArray = typeof Array.isArray === "function" ? Array.isArray : (function () {
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
      return "undefined";
    } else if (o === null) {
      return "null";
    } else {
      return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
    }
  };
}());
freeze = typeof Object.freeze === "function" ? Object.freeze : function (o) {
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
    id = __num(id) + 1;
    return id;
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
    return named(rule != null ? rule.parserName : void 0, function (o) {
      var _tmp, cache, indent, indentCache, index, inner, item, result;
      cache = o.cache;
      indent = o.indent.peek();
      indentCache = (_tmp = cache[indent]) != null ? _tmp : (cache[indent] = []);
      inner = (_tmp = indentCache[cacheKey]) != null ? _tmp : (indentCache[cacheKey] = []);
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
    });
  }
}
function sequential(array, mutator, dontCache) {
  var _tmp, i, item, key, mapping, name, rule, ruleName, rules, shouldWrapName;
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
  _tmp = array.length;
  for (i = 0, __num(_tmp); i < _tmp; i = __num(i) + 1) {
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
    var _tmp;
    _tmp = named(name, function (o) {
      var _tmp2, clone, i, item, key, result, rule;
      clone = o.clone();
      result = {};
      _tmp2 = rules.length;
      for (i = 0, __num(_tmp2); i < _tmp2; i = __num(i) + 1) {
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
    return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp(o);
      if (!result) {
        return false;
      } else if (typeof mutator === "function") {
        return mutator(result, o, index);
      } else if (mutator !== void 0) {
        return mutator;
      } else {
        return result;
      }
    });
  }());
}
function ruleEqual(rule, text, mutator) {
  var failureMessage;
  failureMessage = JSON.stringify(text);
  return (function () {
    var _tmp;
    _tmp = named(failureMessage, function (o) {
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
    return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp(o);
      if (!result) {
        return false;
      } else if (typeof mutator === "function") {
        return mutator(result, o, index);
      } else if (mutator !== void 0) {
        return mutator;
      } else {
        return result;
      }
    });
  }());
}
function word(text, mutator) {
  return ruleEqual(Name, text, mutator);
}
function symbol(text, mutator) {
  return ruleEqual(Symbol, text, mutator);
}
function wordOrSymbol(text, mutator) {
  var _tmp, _tmp2, parts;
  parts = [Space];
  parts.push.apply(parts, __toArray((_tmp = text.split(/([a-z]+)/gi), _tmp2 = _tmp.length, (function () {
    var _tmp3, i, part;
    for (_tmp3 = [], i = 0, __num(_tmp2); i < _tmp2; i = __num(i) + 1) {
      part = _tmp[i];
      if (part) {
        if (__num(i) % 2 === 0) {
          _tmp3.push(ruleEqual(_Symbol, part));
        } else {
          _tmp3.push(ruleEqual(_Name, part));
        }
      }
    }
    return _tmp3;
  }()))));
  return sequential(parts, mutator || text);
}
function macroName(text, mutator) {
  var failureMessage;
  failureMessage = JSON.stringify(text);
  return (function () {
    var _tmp;
    _tmp = named(failureMessage, function (o) {
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
    return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp(o);
      if (!result) {
        return false;
      } else if (typeof mutator === "function") {
        return mutator(result, o, index);
      } else if (mutator !== void 0) {
        return mutator;
      } else {
        return result;
      }
    });
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
    return new Stack(this.initial, __slice(this.data, void 0, void 0));
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
  var _tmp;
  _tmp = named("[\\t \\r\\n]", function (o) {
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
    var _tmp2;
    _tmp2 = named(__strnum((_tmp != null ? _tmp.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
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
  var _tmp;
  _tmp = named(__strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = SpaceChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return true;
    }
  });
}())));
Newline = cache(named("Newline", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named('"\\r"', function (o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  _tmp2 = named('"\\n"', function (o) {
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
    function _tmp3(o) {
      var clone;
      clone = o.clone();
      if (_tmp(clone) && _tmp2(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
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
MaybeComment = cache(named("MaybeComment", named(__strnum((Comment != null ? Comment.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
Space = cache(named("Space", (function () {
  function _tmp(o) {
    var clone;
    clone = o.clone();
    if (_Space(clone) && MaybeComment(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return true;
    }
  });
}())));
SomeSpace = cache(named("SomeSpace", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named(__strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = SpaceChar(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone;
      clone = o.clone();
      if (_tmp(clone) && MaybeComment(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
  }());
}())));
NoSpace = cache(named("NoSpace", named("!" + __strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<unknown>"), function (o) {
  return !SpaceChar(o.clone());
})));
SpaceNewline = cache(named("SpaceNewline", (function () {
  function _tmp(o) {
    var clone;
    clone = o.clone();
    if (Space(clone) && Newline(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return true;
    }
  });
}())));
EmptyLine = cache(named("EmptyLine", SpaceNewline));
EmptyLines = cache(named("EmptyLines", (function () {
  var _tmp;
  _tmp = named(__strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = EmptyLine(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return true;
    }
  });
}())));
SomeEmptyLines = cache(named("SomeEmptyLines", (function () {
  var _tmp;
  _tmp = named(__strnum((EmptyLine != null ? EmptyLine.parserName : void 0) || "<nothing>") + "+", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = EmptyLine(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    if (!__lt(result.length, 1)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return true;
    }
  });
}())));
Shebang = cache(named("Shebang", (function () {
  var _tmp, _tmp2, _tmp3;
  _tmp = named('"#"', function (o) {
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
  _tmp2 = named('"!"', function (o) {
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
  _tmp3 = (function () {
    var _tmp4;
    _tmp4 = (function () {
      var _tmp5;
      _tmp5 = named("!" + __strnum((Newline != null ? Newline.parserName : void 0) || "<unknown>"), function (o) {
        return !Newline(o.clone());
      });
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp5(clone) && (result = AnyChar(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp5, item;
        for (_tmp5 = []; ; ) {
          item = _tmp4(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp5;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp4(o) {
      var clone;
      clone = o.clone();
      if (_tmp(clone) && _tmp2(clone) && _tmp3(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp4(o);
      if (!result) {
        return false;
      } else {
        return true;
      }
    });
  }());
}())));
INDENTS = { "9": 4, "32": 1 };
CountIndent = cache(named("CountIndent", (function () {
  var _tmp;
  _tmp = named(__strnum((SpaceChar != null ? SpaceChar.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = SpaceChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  function _tmp2(x) {
    var _tmp3, _tmp4, c, count, i;
    count = 1;
    _tmp3 = x.length;
    for (_tmp4 = 0, __num(_tmp3); _tmp4 < _tmp3; _tmp4 = __num(_tmp4) + 1) {
      c = x[_tmp4];
      i = INDENTS[c];
      if (!i) {
        throw Error("Unexpected indent char: " + __strnum(JSON.stringify(c)));
      }
      count = __num(count) + __num(i);
    }
    return count;
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
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
MaybeAdvance = named("Advance", function (o) {
  var clone, indent;
  clone = o.clone();
  indent = CountIndent(clone);
  o.indent.push(indent);
  return true;
});
PushIndent = named("PushIndent", (function () {
  function _tmp(indent, o) {
    o.indent.push(indent);
    return true;
  }
  return named(CountIndent != null ? CountIndent.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = CountIndent(o);
    if (!result) {
      return false;
    } else if (typeof _tmp === "function") {
      return _tmp(result, o, index);
    } else if (_tmp !== void 0) {
      return _tmp;
    } else {
      return result;
    }
  });
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
  function _tmp(o) {
    var clone;
    clone = o.clone();
    if (Colon(clone) && Colon(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return "::";
    }
  });
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
  var _tmp;
  _tmp = named(__strnum((DoubleQuote != null ? DoubleQuote.parserName : void 0) || "<nothing>") + "{3}", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = DoubleQuote(clone);
        if (!item) {
          break;
        }
        result.push(item);
        if (!__lt(result.length, 3)) {
          break;
        }
      }
      return _tmp2;
    }());
    if (!__lt(result.length, 3)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return '"""';
    }
  });
}())));
TripleSingleQuote = cache(named("TripleSingleQuote", (function () {
  var _tmp;
  _tmp = named(__strnum((SingleQuote != null ? SingleQuote.parserName : void 0) || "<nothing>") + "{3}", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = SingleQuote(clone);
        if (!item) {
          break;
        }
        result.push(item);
        if (!__lt(result.length, 3)) {
          break;
        }
      }
      return _tmp2;
    }());
    if (!__lt(result.length, 3)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return '"""';
    }
  });
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
MaybeComma = cache(named("MaybeComma", named(__strnum((Comma != null ? Comma.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
CommaOrNewline = cache(named("CommaOrNewline", (function () {
  function _tmp(o) {
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
    return _tmp(o) || SomeEmptyLines(o);
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
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named(__strnum((SomeEmptyLinesWithCheckIndent != null ? SomeEmptyLinesWithCheckIndent.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = Comma(clone)) && _tmp2(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }());
  return function (o) {
    return _tmp(o) || SomeEmptyLinesWithCheckIndent(o);
  };
}())));
MaybeCommaOrNewline = cache(named("MaybeCommaOrNewline", named(__strnum((CommaOrNewline != null ? CommaOrNewline.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
NamePart = cache(named("NamePart", (function () {
  var _tmp;
  _tmp = named(__strnum((NameChar != null ? NameChar.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = NameChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = NameStart(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      return [x.head].concat(__toArray(x.tail));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
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
  var _tmp, _tmp2, v;
  if (array == null) {
    array = [];
  }
  _tmp = codes.length;
  for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
    v = codes[_tmp2];
    array.push(fromCharCode(v));
  }
  return array;
}
_Name = cache(named("_Name", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = NamePart(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      var _tmp4, _tmp5, _tmp6, part, parts;
      parts = processCharCodes(x.head);
      _tmp4 = x.tail;
      _tmp5 = _tmp4.length;
      for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
        part = _tmp4[_tmp6];
        parts.push(fromCharCode(part[0]).toUpperCase());
        processCharCodes(__slice(part, 1, void 0), parts);
      }
      return parts.join("");
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
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
  var _tmp;
  _tmp = named(__strnum((SymbolChar != null ? SymbolChar.parserName : void 0) || "<nothing>") + "+", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = SymbolChar(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    if (!__lt(result.length, 1)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
  function _tmp2(x) {
    return processCharCodes(x).join("");
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
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
  function _tmp(o) {
    return _Name(o) || _Symbol(o);
  }
  return (function () {
    var _tmp2;
    _tmp2 = named(__strnum((_tmp != null ? _tmp.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
    function _tmp3(x) {
      return x.join("");
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
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
  return o.node("this", i);
})));
ThisShorthandLiteral = cache(named("ThisShorthandLiteral", (function () {
  function _tmp(o) {
    var clone;
    clone = o.clone();
    if (Space(clone) && AtSign(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  function _tmp2(x, o, i) {
    return o.node("this", i);
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
ThisOrShorthandLiteral = cache(named("ThisOrShorthandLiteral", function (o) {
  return ThisLiteral(o) || ThisShorthandLiteral(o);
}));
ThisOrShorthandLiteralPeriod = cache(named("ThisOrShorthandLiteralPeriod", (function () {
  var _tmp2;
  function _tmp(o) {
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
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = named(__strnum((Period != null ? Period.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = ThisShorthandLiteral(clone)) && _tmp3(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }());
  return function (o) {
    return _tmp(o) || _tmp2(o);
  };
}())));
RawDecimalDigits = cache(named("RawDecimalDigits", named(__strnum((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "<nothing>") + "+", function (o) {
  var clone, result;
  clone = o.clone();
  result = [];
  (function () {
    var _tmp, item;
    for (_tmp = []; ; ) {
      item = DecimalDigit(clone);
      if (!item) {
        break;
      }
      result.push(item);
    }
    return _tmp;
  }());
  if (!__lt(result.length, 1)) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
})));
DecimalDigits = cache(named("DecimalDigits", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = named(__strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = Underscore(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      });
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp3(clone) && (result = RawDecimalDigits(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = RawDecimalDigits(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      var _tmp4, _tmp5, _tmp6, part, parts;
      parts = processCharCodes(x.head);
      _tmp4 = x.tail;
      _tmp5 = _tmp4.length;
      for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
        part = _tmp4[_tmp6];
        processCharCodes(part, parts);
      }
      return parts.join("");
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
DecimalNumber = cache(named("DecimalNumber", (function () {
  var _tmp, _tmp2, _tmp3;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      function _tmp3(o) {
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
      function _tmp4(x) {
        return "." + __strnum(x);
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
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
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = named(__strnum((PlusOrMinus != null ? PlusOrMinus.parserName : void 0) || "<unknown>") + "?", function (o) {
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
      });
      return (function () {
        function _tmp5(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.e = eE(clone)) && (result.op = _tmp4(clone)) && (result.digits = DecimalDigits(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp6(x) {
          return "e" + __strnum(x.op !== NOTHING ? fromCharCode(x.op) : "") + __strnum(x.digits);
        }
        return named(_tmp5 != null ? _tmp5.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp5(o);
          if (!result) {
            return false;
          } else if (typeof _tmp6 === "function") {
            return _tmp6(result, o, index);
          } else if (_tmp6 !== void 0) {
            return _tmp6;
          } else {
            return result;
          }
        });
      }());
    }());
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
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
    });
  }());
  _tmp3 = (function () {
    function _tmp4(o) {
      var clone;
      clone = o.clone();
      if (Underscore(clone) && NamePart(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp4(clone);
      if (!result) {
        return true;
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp4(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.integer = DecimalDigits(clone)) && (result.decimal = _tmp(clone)) && (result.scientific = _tmp2(clone)) && _tmp3(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp5(x, o, i) {
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
      return o.node("const", i, value);
    }
    return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp4(o);
      if (!result) {
        return false;
      } else if (typeof _tmp5 === "function") {
        return _tmp5(result, o, index);
      } else if (_tmp5 !== void 0) {
        return _tmp5;
      } else {
        return result;
      }
    });
  }());
}())));
function makeRadixInteger(radix, separator, digit) {
  var digits;
  digits = (function () {
    var _tmp, _tmp2;
    _tmp = named(__strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp2, item;
        for (_tmp2 = []; ; ) {
          item = digit(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp2;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5;
        _tmp4 = named(__strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = Underscore(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          if (!__lt(result.length, 1)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        });
        _tmp5 = named(__strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp6, item;
            for (_tmp6 = []; ; ) {
              item = digit(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp6;
          }());
          if (!__lt(result.length, 1)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        });
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_tmp4(clone) && (result = _tmp5(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = _tmp3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        o.update(clone);
        return result;
      });
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = _tmp(clone)) && (result.tail = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x) {
        var _tmp5, _tmp6, _tmp7, part, parts;
        parts = processCharCodes(x.head);
        _tmp5 = x.tail;
        _tmp6 = _tmp5.length;
        for (_tmp7 = 0, __num(_tmp6); _tmp7 < _tmp6; _tmp7 = __num(_tmp7) + 1) {
          part = _tmp5[_tmp7];
          processCharCodes(part, parts);
        }
        return parts.join("");
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return (function () {
    var _tmp;
    _tmp = (function () {
      function _tmp2(o) {
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
      return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _tmp2(clone);
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
      });
    }());
    return (function () {
      function _tmp2(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (Zero(clone) && (result.separator = separator(clone)) && (result.integer = digits(clone)) && (result.decimal = _tmp(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp3(x, o, i) {
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
        return o.node("const", i, value);
      }
      return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp2(o);
        if (!result) {
          return false;
        } else if (typeof _tmp3 === "function") {
          return _tmp3(result, o, index);
        } else if (_tmp3 !== void 0) {
          return _tmp3;
        } else {
          return result;
        }
      });
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
      var _tmp;
      return (_tmp = digitCache[radix]) != null ? _tmp : (digitCache[radix] = (function () {
        var digit;
        digit = radix === 2 ? BinaryDigit : radix === 8 ? OctalDigit : radix === 10 ? DecimalDigit : radix === 16 ? HexDigit : (function () {
          var _tmp, chars, i;
          chars = [];
          for (i = 0, _tmp = __num(!__lte(radix, 10) ? radix : 10); i < _tmp; i = __num(i) + 1) {
            chars[__num(i) + 48] = true;
          }
          for (i = 10, _tmp = __num(!__lte(radix, 36) ? radix : 36); i < _tmp; i = __num(i) + 1) {
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
          var _tmp, _tmp2;
          _tmp = named(__strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+", function (o) {
            var clone, result;
            clone = o.clone();
            result = [];
            (function () {
              var _tmp2, item;
              for (_tmp2 = []; ; ) {
                item = digit(clone);
                if (!item) {
                  break;
                }
                result.push(item);
              }
              return _tmp2;
            }());
            if (!__lt(result.length, 1)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          });
          _tmp2 = (function () {
            var _tmp3;
            _tmp3 = (function () {
              var _tmp4, _tmp5;
              _tmp4 = named(__strnum((Underscore != null ? Underscore.parserName : void 0) || "<nothing>") + "+", function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _tmp5, item;
                  for (_tmp5 = []; ; ) {
                    item = Underscore(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _tmp5;
                }());
                if (!__lt(result.length, 1)) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              });
              _tmp5 = named(__strnum((digit != null ? digit.parserName : void 0) || "<nothing>") + "+", function (o) {
                var clone, result;
                clone = o.clone();
                result = [];
                (function () {
                  var _tmp6, item;
                  for (_tmp6 = []; ; ) {
                    item = digit(clone);
                    if (!item) {
                      break;
                    }
                    result.push(item);
                  }
                  return _tmp6;
                }());
                if (!__lt(result.length, 1)) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              });
              return function (o) {
                var clone, result;
                clone = o.clone();
                result = void 0;
                if (_tmp4(clone) && (result = _tmp5(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              };
            }());
            return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
              var clone, result;
              clone = o.clone();
              result = [];
              (function () {
                var _tmp4, item;
                for (_tmp4 = []; ; ) {
                  item = _tmp3(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                return _tmp4;
              }());
              o.update(clone);
              return result;
            });
          }());
          return (function () {
            function _tmp3(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if ((result.head = _tmp(clone)) && (result.tail = _tmp2(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _tmp4(x) {
              var _tmp5, _tmp6, _tmp7, part, parts;
              parts = processCharCodes(x.head);
              _tmp5 = x.tail;
              _tmp6 = _tmp5.length;
              for (_tmp7 = 0, __num(_tmp6); _tmp7 < _tmp6; _tmp7 = __num(_tmp7) + 1) {
                part = _tmp5[_tmp7];
                processCharCodes(part, parts);
              }
              return parts.join("");
            }
            return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp3(o);
              if (!result) {
                return false;
              } else if (typeof _tmp4 === "function") {
                return _tmp4(result, o, index);
              } else if (_tmp4 !== void 0) {
                return _tmp4;
              } else {
                return result;
              }
            });
          }());
        }());
      }()));
    };
  }());
  Radix = named((DecimalDigit != null ? DecimalDigit.parserName : void 0) || "<nothing>", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp, item;
      for (_tmp = []; ; ) {
        item = DecimalDigit(clone);
        if (!item) {
          break;
        }
        result.push(item);
        if (!__lt(result.length, 2)) {
          break;
        }
      }
      return _tmp;
    }());
    if (!__lt(result.length, 1)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  });
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
    return o.node("const", startIndex, value);
  };
}())));
NumberLiteral = cache(named("NumberLiteral", (function () {
  function _tmp(o) {
    return HexInteger(o) || OctalInteger(o) || BinaryInteger(o) || RadixInteger(o) || DecimalNumber(o);
  }
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = _tmp(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
}())));
function makeConstLiteral(name, value) {
  return word(name, function (x, o, i) {
    return o.node("const", i, value);
  });
}
NullLiteral = cache(named("NullLiteral", makeConstLiteral("null", null)));
VoidLiteral = cache(named("VoidLiteral", (function () {
  var _tmp, _tmp2;
  _tmp = makeConstLiteral("undefined", void 0);
  _tmp2 = makeConstLiteral("void", void 0);
  return function (o) {
    return _tmp(o) || _tmp2(o);
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
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named(__strnum((HexDigit != null ? HexDigit.parserName : void 0) || "<nothing>") + "{2}", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = HexDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (!__lt(result.length, 2)) {
            break;
          }
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 2)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (LowerX(clone) && (result = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x) {
        return parseInt(processCharCodes(x).join(""), 16) || -1;
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!LowerX(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
UnicodeEscapeSequence = cache(named("UnicodeEscapeSequence", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named(__strnum((HexDigit != null ? HexDigit.parserName : void 0) || "<nothing>") + "{4}", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = HexDigit(clone);
          if (!item) {
            break;
          }
          result.push(item);
          if (!__lt(result.length, 4)) {
            break;
          }
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 4)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (LowerU(clone) && (result = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x) {
        return parseInt(processCharCodes(x).join(""), 16) || -1;
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!LowerU(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
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
    function _tmp(c) {
      if (__owns(ESCAPED_CHARACTERS, c)) {
        return ESCAPED_CHARACTERS[c];
      } else {
        return c;
      }
    }
    return named(AnyChar != null ? AnyChar.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = AnyChar(o);
      if (!result) {
        return false;
      } else if (typeof _tmp === "function") {
        return _tmp(result, o, index);
      } else if (_tmp !== void 0) {
        return _tmp;
      } else {
        return result;
      }
    });
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
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      function _tmp3(o) {
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
        return Identifier(o) || _tmp3(o);
      };
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (DollarSign(clone) && (result = _tmp2(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!DollarSign(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
SingleStringLiteral = cache(named("SingleStringLiteral", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp5;
          _tmp5 = (function () {
            function _tmp6(o) {
              return SingleQuote(o) || Newline(o);
            }
            return named("!" + __strnum((_tmp6 != null ? _tmp6.parserName : void 0) || "<unknown>"), function (o) {
              return !_tmp6(o.clone());
            });
          }());
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_tmp5(clone) && (result = AnyChar(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        return function (o) {
          return BackslashEscapeSequence(o) || _tmp4(o);
        };
      }());
      return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = _tmp3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        o.update(clone);
        return result;
      });
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (SingleQuote(clone) && (result = _tmp2(clone)) && SingleQuote(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        return o.node("const", i, processCharCodes(x).join(""));
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!SingleQuote(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
DoubleStringLiteral = cache(named("DoubleStringLiteral", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5;
        _tmp4 = BackslashEscapeSequence;
        _tmp5 = (function () {
          var _tmp6;
          _tmp6 = (function () {
            function _tmp7(o) {
              return DoubleQuote(o) || Newline(o);
            }
            return named("!" + __strnum((_tmp7 != null ? _tmp7.parserName : void 0) || "<unknown>"), function (o) {
              return !_tmp7(o.clone());
            });
          }());
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_tmp6(clone) && (result = AnyChar(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        return function (o) {
          return _tmp4(o) || StringInterpolation(o) || _tmp5(o);
        };
      }());
      return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = _tmp3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        o.update(clone);
        return result;
      });
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (DoubleQuote(clone) && (result = _tmp2(clone)) && DoubleQuote(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        var _tmp5, _tmp6, currentLiteral, part, stringParts;
        stringParts = [];
        currentLiteral = [];
        _tmp5 = x.length;
        for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
          part = x[_tmp6];
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
          return o.node("const", i, "");
        } else if (stringParts.length === 1 && typeof stringParts[0] === "string") {
          return o.node("const", i, stringParts[0]);
        } else {
          return o.node("string", i, stringParts);
        }
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!DoubleQuote(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
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
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
          return TripleSingleQuote(o) || Newline(o);
        }
        return named("!" + __strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<unknown>"), function (o) {
          return !_tmp4(o.clone());
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp3(clone) && (result = AnyChar(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return BackslashEscapeSequence(o) || _tmp2(o);
    };
  }());
  return (function () {
    var _tmp2;
    _tmp2 = named(__strnum((_tmp != null ? _tmp.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
    function _tmp3(x) {
      return [processCharCodes(x).join("").replace(/[\t ]+$/, "")];
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
TripleDoubleStringLine = cache(named("TripleDoubleStringLine", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2, _tmp3;
    _tmp2 = BackslashEscapeSequence;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = (function () {
        function _tmp5(o) {
          return TripleDoubleQuote(o) || Newline(o);
        }
        return named("!" + __strnum((_tmp5 != null ? _tmp5.parserName : void 0) || "<unknown>"), function (o) {
          return !_tmp5(o.clone());
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp4(clone) && (result = AnyChar(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return function (o) {
      return _tmp2(o) || StringInterpolation(o) || _tmp3(o);
    };
  }());
  return (function () {
    var _tmp2;
    _tmp2 = named(__strnum((_tmp != null ? _tmp.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
    function _tmp3(x) {
      var _tmp4, _tmp5, currentLiteral, part, stringParts;
      stringParts = [];
      currentLiteral = [];
      _tmp4 = x.length;
      for (_tmp5 = 0, __num(_tmp4); _tmp5 < _tmp4; _tmp5 = __num(_tmp5) + 1) {
        part = x[_tmp5];
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
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
function makeTripleString(quote, line) {
  return (function () {
    var _tmp;
    _tmp = (function () {
      var _tmp2, _tmp3;
      _tmp2 = (function () {
        function _tmp3(o) {
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
        return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp4, item;
            for (_tmp4 = []; ; ) {
              item = _tmp3(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp4;
          }());
          o.update(clone);
          return result;
        });
      }());
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp5, _tmp6;
          _tmp5 = (function () {
            var _tmp6;
            _tmp6 = (function () {
              var _tmp7;
              _tmp7 = (function () {
                function _tmp8(o) {
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
                return named(__strnum((_tmp8 != null ? _tmp8.parserName : void 0) || "<nothing>") + "*", function (o) {
                  var clone, result;
                  clone = o.clone();
                  result = [];
                  (function () {
                    var _tmp9, item;
                    for (_tmp9 = []; ; ) {
                      item = _tmp8(clone);
                      if (!item) {
                        break;
                      }
                      result.push(item);
                    }
                    return _tmp9;
                  }());
                  o.update(clone);
                  return result;
                });
              }());
              return (function () {
                function _tmp8(o) {
                  var clone, result;
                  clone = o.clone();
                  result = {};
                  if (StringIndent(clone) && (result.head = line(clone)) && (result.tail = _tmp7(clone))) {
                    o.update(clone);
                    return result;
                  } else {
                    return false;
                  }
                }
                function _tmp9(x) {
                  return [x.head].concat(__toArray(x.tail));
                }
                return named(_tmp8 != null ? _tmp8.parserName : void 0, function (o) {
                  var index, result;
                  index = o.index;
                  result = _tmp8(o);
                  if (!result) {
                    return false;
                  } else if (typeof _tmp9 === "function") {
                    return _tmp9(result, o, index);
                  } else if (_tmp9 !== void 0) {
                    return _tmp9;
                  } else {
                    return result;
                  }
                });
              }());
            }());
            function _tmp7() {
              return [];
            }
            return named(__strnum((_tmp6 != null ? _tmp6.parserName : void 0) || "<unknown>") + "?", function (o) {
              var clone, index, result;
              index = o.index;
              clone = o.clone();
              result = _tmp6(clone);
              if (!result) {
                if (typeof _tmp7 === "function") {
                  return _tmp7(void 0, o, index);
                } else {
                  return _tmp7;
                }
              } else {
                o.update(clone);
                return result;
              }
            });
          }());
          _tmp6 = named(__strnum((Newline != null ? Newline.parserName : void 0) || "<unknown>") + "?", function (o) {
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
          });
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (MaybeAdvance(clone) && (result = _tmp5(clone)) && _tmp6(clone) && PopIndent(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        function _tmp5() {
          return [];
        }
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<unknown>") + "?", function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _tmp4(clone);
          if (!result) {
            if (typeof _tmp5 === "function") {
              return _tmp5(void 0, o, index);
            } else {
              return _tmp5;
            }
          } else {
            o.update(clone);
            return result;
          }
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if (quote(clone) && (result.first = line(clone)) && (result.emptyLines = _tmp2(clone)) && (result.rest = _tmp3(clone)) && quote(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x, o, i) {
          var _tmp6, j, len, line, lines, result;
          lines = [x.first];
          if (lines[0].length === 0 || lines[0].length === 1 && lines[0][0] === "") {
            lines.shift();
          }
          for (j = 0, _tmp6 = __num(x.emptyLines.length); j < _tmp6; j = __num(j) + 1) {
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
          _tmp6 = lines.length;
          for (j = 0, __num(_tmp6); j < _tmp6; j = __num(j) + 1) {
            line = lines[j];
            if (!__lte(j, 0)) {
              result.push("\n");
            }
            result.push.apply(result, __toArray(line));
          }
          for (j = __num(result.length) - 2; j > -1; j = __num(j) - 1) {
            if (typeof result[j] === "string" && typeof result[__num(j) + 1] === "string") {
              result.splice(j, 2, "" + result[j] + result[__num(j) + 1]);
            }
          }
          if (result.length === 0) {
            return o.node("const", i, "");
          } else if (result.length === 1 && typeof result[0] === "string") {
            return o.node("const", i, result[0]);
          } else {
            return o.node("string", i, result);
          }
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
      var result;
      if (!quote(o.clone())) {
        return false;
      } else {
        result = _tmp(o);
        if (!result) {
          throw SHORT_CIRCUIT;
        }
        return result;
      }
    });
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
  function _tmp() {
    return [];
  }
  return named(__strnum((NamePart != null ? NamePart.parserName : void 0) || "<unknown>") + "?", function (o) {
    var clone, index, result;
    index = o.index;
    clone = o.clone();
    result = NamePart(clone);
    if (!result) {
      if (typeof _tmp === "function") {
        return _tmp(void 0, o, index);
      } else {
        return _tmp;
      }
    } else {
      o.update(clone);
      return result;
    }
  });
}())));
RegexLiteral = cache(named("RegexLiteral", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp5, _tmp6, _tmp7;
          _tmp5 = (function () {
            var _tmp7;
            function _tmp6(o) {
              var clone;
              clone = o.clone();
              if (DoubleQuote(clone) && DoubleQuote(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _tmp7 = 34;
            return named(_tmp6 != null ? _tmp6.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp6(o);
              if (!result) {
                return false;
              } else if (typeof _tmp7 === "function") {
                return _tmp7(result, o, index);
              } else if (_tmp7 !== void 0) {
                return _tmp7;
              } else {
                return result;
              }
            });
          }());
          _tmp6 = (function () {
            var _tmp8;
            function _tmp7(o) {
              var clone;
              clone = o.clone();
              if (Backslash(clone) && DollarSign(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _tmp8 = 36;
            return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp7(o);
              if (!result) {
                return false;
              } else if (typeof _tmp8 === "function") {
                return _tmp8(result, o, index);
              } else if (_tmp8 !== void 0) {
                return _tmp8;
              } else {
                return result;
              }
            });
          }());
          _tmp7 = (function () {
            var _tmp8;
            _tmp8 = (function () {
              function _tmp9(o) {
                return DoubleQuote(o) || Newline(o) || DollarSign(o);
              }
              return named("!" + __strnum((_tmp9 != null ? _tmp9.parserName : void 0) || "<unknown>"), function (o) {
                return !_tmp9(o.clone());
              });
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_tmp8(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return _tmp5(o) || _tmp6(o) || _tmp7(o) || StringInterpolation(o);
          };
        }());
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (RegexDoubleToken(clone) && (result.text = _tmp3(clone)) && DoubleQuote(clone) && (result.flags = RegexFlags(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var result;
      if (!RegexDoubleToken(o.clone())) {
        return false;
      } else {
        result = _tmp2(o);
        if (!result) {
          throw SHORT_CIRCUIT;
        }
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = (function () {
        var _tmp5;
        _tmp5 = (function () {
          var _tmp6, _tmp7;
          _tmp6 = (function () {
            var _tmp8;
            function _tmp7(o) {
              var clone;
              clone = o.clone();
              if (SingleQuote(clone) && SingleQuote(clone)) {
                o.update(clone);
                return true;
              } else {
                return false;
              }
            }
            _tmp8 = 39;
            return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp7(o);
              if (!result) {
                return false;
              } else if (typeof _tmp8 === "function") {
                return _tmp8(result, o, index);
              } else if (_tmp8 !== void 0) {
                return _tmp8;
              } else {
                return result;
              }
            });
          }());
          _tmp7 = (function () {
            var _tmp8;
            _tmp8 = (function () {
              function _tmp9(o) {
                return SingleQuote(o) || Newline(o);
              }
              return named("!" + __strnum((_tmp9 != null ? _tmp9.parserName : void 0) || "<unknown>"), function (o) {
                return !_tmp9(o.clone());
              });
            }());
            return function (o) {
              var clone, result;
              clone = o.clone();
              result = void 0;
              if (_tmp8(clone) && (result = AnyChar(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            };
          }());
          return function (o) {
            return _tmp6(o) || _tmp7(o);
          };
        }());
        return named(__strnum((_tmp5 != null ? _tmp5.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp6, item;
            for (_tmp6 = []; ; ) {
              item = _tmp5(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp6;
          }());
          o.update(clone);
          return result;
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (RegexSingleToken(clone) && (result.text = _tmp4(clone)) && SingleQuote(clone) && (result.flags = RegexFlags(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var result;
      if (!RegexSingleToken(o.clone())) {
        return false;
      } else {
        result = _tmp3(o);
        if (!result) {
          throw SHORT_CIRCUIT;
        }
        return result;
      }
    });
  }());
  return (function () {
    function _tmp3(o) {
      return _tmp(o) || _tmp2(o);
    }
    function _tmp4(x, o, i) {
      var _tmp5, _tmp6, _tmp7, currentLiteral, flags, part, str, stringParts;
      stringParts = [];
      currentLiteral = [];
      _tmp5 = x.text;
      _tmp6 = _tmp5.length;
      for (_tmp7 = 0, __num(_tmp6); _tmp7 < _tmp6; _tmp7 = __num(_tmp7) + 1) {
        part = _tmp5[_tmp7];
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
      str = stringParts.length === 0 ? o.node("const", i, "") : stringParts.length === 1 && typeof stringParts[0] === "string" ? o.node("const", i, stringParts[0]) : o.node("string", i, stringParts);
      return o.node("regexp", i, { text: str, flags: flags });
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
StringLiteral = cache(named("StringLiteral", (function () {
  function _tmp(o) {
    return TripleSingleStringLiteral(o) || TripleDoubleStringLiteral(o) || SingleStringLiteral(o) || DoubleStringLiteral(o) || RegexLiteral(o);
  }
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = _tmp(clone))) {
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
  return o.node("arguments", i);
})));
Literal = cache(named("Literal", function (o) {
  return ThisOrShorthandLiteral(o) || ArgumentsLiteral(o) || ConstantLiteral(o);
}));
IdentifierNameConst = cache(named("IdentifierNameConst", function (o) {
  var result, startIndex;
  startIndex = o.index;
  result = Name(o);
  if (result) {
    return o.node("const", startIndex, result);
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
      return o.node("ident", index, result);
    }
  };
}())));
NotToken = cache(named("NotToken", word("not")));
MaybeNotToken = cache(named("MaybeNotToken", named(__strnum((NotToken != null ? NotToken.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
ExistentialSymbol = cache(named("ExistentialSymbol", symbol("?")));
MaybeExistentialSymbol = cache(named("MaybeExistentialSymbol", named(__strnum((ExistentialSymbol != null ? ExistentialSymbol.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
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
MaybeExistentialSymbolNoSpace = cache(named("MaybeExistentialSymbolNoSpace", named(__strnum((ExistentialSymbolNoSpace != null ? ExistentialSymbolNoSpace.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
Operator = cache(named("Operator", (function () {
  var _tmp, _tmp10, _tmp11, _tmp12, _tmp13, _tmp14, _tmp15, _tmp16, _tmp17, _tmp18, _tmp19, _tmp2, _tmp20, _tmp21, _tmp22, _tmp23, _tmp24, _tmp25, _tmp26, _tmp27, _tmp28, _tmp29, _tmp3, _tmp30, _tmp31, _tmp32, _tmp33, _tmp34, _tmp35, _tmp36, _tmp37, _tmp38, _tmp39, _tmp4, _tmp40, _tmp41, _tmp42, _tmp43, _tmp44, _tmp45, _tmp46, _tmp47, _tmp48, _tmp49, _tmp5, _tmp50, _tmp51, _tmp52, _tmp53, _tmp54, _tmp55, _tmp56, _tmp57, _tmp58, _tmp59, _tmp6, _tmp60, _tmp61, _tmp62, _tmp63, _tmp64, _tmp65, _tmp7, _tmp8, _tmp9;
  _tmp = wordOrSymbol("^");
  _tmp2 = wordOrSymbol("*");
  _tmp3 = wordOrSymbol("/");
  _tmp4 = wordOrSymbol("\\");
  _tmp5 = wordOrSymbol("%");
  _tmp6 = wordOrSymbol("+");
  _tmp7 = wordOrSymbol("-");
  _tmp8 = wordOrSymbol("bitlshift");
  _tmp9 = wordOrSymbol("bitrshift");
  _tmp10 = wordOrSymbol("biturshift");
  _tmp11 = wordOrSymbol("min");
  _tmp12 = wordOrSymbol("max");
  _tmp13 = wordOrSymbol("&");
  _tmp14 = wordOrSymbol("~^");
  _tmp15 = wordOrSymbol("~*");
  _tmp16 = wordOrSymbol("~/");
  _tmp17 = wordOrSymbol("~\\");
  _tmp18 = wordOrSymbol("~%");
  _tmp19 = wordOrSymbol("~+");
  _tmp20 = wordOrSymbol("~-");
  _tmp21 = wordOrSymbol("~bitlshift");
  _tmp22 = wordOrSymbol("~bitrshift");
  _tmp23 = wordOrSymbol("~biturshift");
  _tmp24 = wordOrSymbol("~min");
  _tmp25 = wordOrSymbol("~max");
  _tmp26 = wordOrSymbol("~&");
  _tmp27 = wordOrSymbol("in");
  _tmp28 = wordOrSymbol("haskey");
  _tmp29 = wordOrSymbol("ownskey");
  _tmp30 = wordOrSymbol("instanceof");
  _tmp31 = wordOrSymbol("instanceofsome");
  _tmp32 = wordOrSymbol("<=>");
  _tmp33 = wordOrSymbol("~=");
  _tmp34 = wordOrSymbol("!~=");
  _tmp35 = wordOrSymbol("==");
  _tmp36 = wordOrSymbol("!=");
  _tmp37 = wordOrSymbol("%%");
  _tmp38 = wordOrSymbol("!%%");
  _tmp39 = wordOrSymbol("~%%");
  _tmp40 = wordOrSymbol("!~%%");
  _tmp41 = wordOrSymbol("<");
  _tmp42 = wordOrSymbol("<=");
  _tmp43 = wordOrSymbol(">");
  _tmp44 = wordOrSymbol(">=");
  _tmp45 = wordOrSymbol("~<");
  _tmp46 = wordOrSymbol("~<=");
  _tmp47 = wordOrSymbol("~>");
  _tmp48 = wordOrSymbol("~>=");
  _tmp49 = wordOrSymbol("and");
  _tmp50 = wordOrSymbol("or");
  _tmp51 = wordOrSymbol("xor");
  _tmp52 = wordOrSymbol("?");
  _tmp53 = wordOrSymbol("bitand");
  _tmp54 = wordOrSymbol("bitor");
  _tmp55 = wordOrSymbol("bitxor");
  _tmp56 = wordOrSymbol("~bitand");
  _tmp57 = wordOrSymbol("~bitor");
  _tmp58 = wordOrSymbol("~bitxor");
  _tmp59 = (function () {
    function _tmp60(o) {
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
    function _tmp61(x) {
      if (x === "not") {
        return "bool";
      } else {
        return "not";
      }
    }
    return named(_tmp60 != null ? _tmp60.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp60(o);
      if (!result) {
        return false;
      } else if (typeof _tmp61 === "function") {
        return _tmp61(result, o, index);
      } else if (_tmp61 !== void 0) {
        return _tmp61;
      } else {
        return result;
      }
    });
  }());
  _tmp60 = wordOrSymbol("bitnot");
  _tmp61 = wordOrSymbol("~bitnot");
  _tmp62 = (function () {
    var _tmp63, _tmp64;
    _tmp63 = word("typeof");
    _tmp64 = (function () {
      var _tmp65;
      _tmp65 = named('"!"', function (o) {
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
      return named(__strnum((_tmp65 != null ? _tmp65.parserName : void 0) || "<unknown>") + "?", function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _tmp65(clone);
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
      });
    }());
    return (function () {
      function _tmp65(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp63(clone) && (result = _tmp64(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp66(x) {
        if (x !== NOTHING) {
          return "typeof!";
        } else {
          return "typeof";
        }
      }
      return named(_tmp65 != null ? _tmp65.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp65(o);
        if (!result) {
          return false;
        } else if (typeof _tmp66 === "function") {
          return _tmp66(result, o, index);
        } else if (_tmp66 !== void 0) {
          return _tmp66;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp63 = (function () {
    var _tmp64, _tmp65;
    _tmp64 = (function () {
      var _tmp65, _tmp66, _tmp67;
      _tmp65 = word("num");
      _tmp66 = word("str");
      _tmp67 = word("strnum");
      return function (o) {
        return _tmp65(o) || _tmp66(o) || _tmp67(o);
      };
    }());
    _tmp65 = named('"!"', function (o) {
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
      function _tmp66(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = _tmp64(clone)) && _tmp65(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp67(x) {
        return __strnum(x) + "!";
      }
      return named(_tmp66 != null ? _tmp66.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp66(o);
        if (!result) {
          return false;
        } else if (typeof _tmp67 === "function") {
          return _tmp67(result, o, index);
        } else if (_tmp67 !== void 0) {
          return _tmp67;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp64 = wordOrSymbol("delete");
  _tmp65 = (function () {
    var _tmp66;
    _tmp66 = word("throw");
    return (function () {
      function _tmp67(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp66(clone) && (result = MaybeExistentialSymbolNoSpace(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp68(x) {
        if (x === "?") {
          return "throw?";
        } else {
          return "throw";
        }
      }
      return named(_tmp67 != null ? _tmp67.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp67(o);
        if (!result) {
          return false;
        } else if (typeof _tmp68 === "function") {
          return _tmp68(result, o, index);
        } else if (_tmp68 !== void 0) {
          return _tmp68;
        } else {
          return result;
        }
      });
    }());
  }());
  return (function () {
    function _tmp66(o) {
      return _tmp(o) || _tmp2(o) || _tmp3(o) || _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o) || _tmp9(o) || _tmp10(o) || _tmp11(o) || _tmp12(o) || _tmp13(o) || _tmp14(o) || _tmp15(o) || _tmp16(o) || _tmp17(o) || _tmp18(o) || _tmp19(o) || _tmp20(o) || _tmp21(o) || _tmp22(o) || _tmp23(o) || _tmp24(o) || _tmp25(o) || _tmp26(o) || _tmp27(o) || _tmp28(o) || _tmp29(o) || _tmp30(o) || _tmp31(o) || _tmp32(o) || _tmp33(o) || _tmp34(o) || _tmp35(o) || _tmp36(o) || _tmp37(o) || _tmp38(o) || _tmp39(o) || _tmp40(o) || _tmp41(o) || _tmp42(o) || _tmp43(o) || _tmp44(o) || _tmp45(o) || _tmp46(o) || _tmp47(o) || _tmp48(o) || _tmp49(o) || _tmp50(o) || _tmp51(o) || _tmp52(o) || _tmp53(o) || _tmp54(o) || _tmp55(o) || _tmp56(o) || _tmp57(o) || _tmp58(o) || _tmp59(o) || _tmp60(o) || _tmp61(o) || _tmp62(o) || _tmp63(o) || _tmp64(o) || _tmp65(o);
    }
    function _tmp67(x, o, i) {
      return o.node("operator", i, x);
    }
    return named(_tmp66 != null ? _tmp66.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp66(o);
      if (!result) {
        return false;
      } else if (typeof _tmp67 === "function") {
        return _tmp67(result, o, index);
      } else if (_tmp67 !== void 0) {
        return _tmp67;
      } else {
        return result;
      }
    });
  }());
}())));
Parenthetical = cache(named("Parenthetical", (function () {
  function _tmp(o) {
    return Assignment(o) || Expression(o) || Operator(o);
  }
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenParenthesis(clone) && (result = _tmp(clone)) && CloseParenthesis(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(node, o, i) {
      return o.node("paren", i, node);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
SpreadToken = cache(named("SpreadToken", (function () {
  function _tmp(o) {
    var clone;
    clone = o.clone();
    if (Space(clone) && Period(clone) && Period(clone) && Period(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else {
      return "...";
    }
  });
}())));
MaybeSpreadToken = cache(named("MaybeSpreadToken", named(__strnum((SpreadToken != null ? SpreadToken.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
SpreadOrExpression = cache(named("SpreadOrExpression", (function () {
  function _tmp(o) {
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
  function _tmp2(x, o, i) {
    if (x.spread === "...") {
      return o.node("spread", i, x.node);
    } else {
      return x.node;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
ArrayLiteral = cache(named("ArrayLiteral", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _tmp3(clone)) && MaybeComma(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = (function () {
        var _tmp5;
        _tmp5 = (function () {
          var _tmp6;
          _tmp6 = (function () {
            function _tmp7(o) {
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
            return named(__strnum((_tmp7 != null ? _tmp7.parserName : void 0) || "<nothing>") + "*", function (o) {
              var clone, result;
              clone = o.clone();
              result = [];
              (function () {
                var _tmp8, item;
                for (_tmp8 = []; ; ) {
                  item = _tmp7(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                return _tmp8;
              }());
              o.update(clone);
              return result;
            });
          }());
          return (function () {
            function _tmp7(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if (CheckIndent(clone) && (result.head = SpreadOrExpression(clone)) && (result.tail = _tmp6(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _tmp8(x) {
              return [x.head].concat(__toArray(x.tail));
            }
            return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp7(o);
              if (!result) {
                return false;
              } else if (typeof _tmp8 === "function") {
                return _tmp8(result, o, index);
              } else if (_tmp8 !== void 0) {
                return _tmp8;
              } else {
                return result;
              }
            });
          }());
        }());
        function _tmp6() {
          return [];
        }
        return named(__strnum((_tmp5 != null ? _tmp5.parserName : void 0) || "<unknown>") + "?", function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _tmp5(clone);
          if (!result) {
            if (typeof _tmp6 === "function") {
              return _tmp6(void 0, o, index);
            } else {
              return _tmp6;
            }
          } else {
            o.update(clone);
            return result;
          }
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _tmp4(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    function _tmp4() {
      return [];
    }
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
      if (!result) {
        if (typeof _tmp4 === "function") {
          return _tmp4(void 0, o, index);
        } else {
          return _tmp4;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (OpenSquareBracket(clone) && Space(clone) && (result.first = _tmp(clone)) && (result.rest = _tmp2(clone)) && CloseSquareBracket(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      return o.node("array", i, __toArray(x.first).concat(__toArray(x.rest)));
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
ObjectKey = cache(named("ObjectKey", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(x, o, i) {
      return o.node("const", i, String(x.value));
    }
    return named(NumberLiteral != null ? NumberLiteral.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = NumberLiteral(o);
      if (!result) {
        return false;
      } else if (typeof _tmp2 === "function") {
        return _tmp2(result, o, index);
      } else if (_tmp2 !== void 0) {
        return _tmp2;
      } else {
        return result;
      }
    });
  }());
  return function (o) {
    return Parenthetical(o) || StringLiteral(o) || _tmp(o) || IdentifierNameConst(o);
  };
}())));
ObjectKeyColon = cache(named("ObjectKeyColon", (function () {
  var _tmp;
  _tmp = named("!" + __strnum((Colon != null ? Colon.parserName : void 0) || "<unknown>"), function (o) {
    return !Colon(o.clone());
  });
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if ((result = ObjectKey(clone)) && Space(clone) && Colon(clone) && _tmp(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
}())));
DualObjectKey = cache(named("DualObjectKey", (function () {
  function _tmp(o) {
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
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!ObjectKeyColon(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
IdentifierOrSimpleAccessStart = cache(named("IdentifierOrSimpleAccessStart", (function () {
  var _tmp, _tmp2, _tmp3;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(x, o, i) {
      return o.node("access", i, x);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    function _tmp3(o) {
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
    function _tmp4(x, o, i) {
      return o.node("access", i, {
        parent: o.node("access", i, { parent: x.parent, child: o.node("const", i, "prototype") }),
        child: x.child
      });
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
  _tmp3 = (function () {
    var _tmp4;
    _tmp4 = named(__strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return (function () {
      function _tmp5(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteral(clone)) && (result.proto = _tmp4(clone)) && OpenSquareBracketChar(clone) && (result.child = Expression(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp6(x, o, i) {
        var parent;
        parent = x[0];
        if (x.proto !== NOTHING) {
          parent = o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") });
        }
        return o.node("access", i, { parent: parent, child: x.child });
      }
      return named(_tmp5 != null ? _tmp5.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp5(o);
        if (!result) {
          return false;
        } else if (typeof _tmp6 === "function") {
          return _tmp6(result, o, index);
        } else if (_tmp6 !== void 0) {
          return _tmp6;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    return Identifier(o) || _tmp(o) || _tmp2(o) || _tmp3(o);
  };
}())));
IdentifierOrSimpleAccessPart = cache(named("IdentifierOrSimpleAccessPart", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    function _tmp2(o) {
      return Period(o) || DoubleColon(o);
    }
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _tmp2(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        var child, isProto;
        isProto = x.type === "::";
        child = x.child;
        return function (parent) {
          return o.node("access", i, {
            parent: isProto ? o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") }) : parent,
            child: child
          });
        };
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = named(__strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return (function () {
      function _tmp4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _tmp3(clone)) && OpenSquareBracketChar(clone) && (result.child = Expression(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp5(x, o, i) {
        var child, isProto;
        isProto = x.type !== NOTHING;
        child = x.child;
        return function (parent) {
          return o.node("access", i, {
            parent: isProto ? o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") }) : parent,
            child: child
          });
        };
      }
      return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp4(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    return _tmp(o) || _tmp2(o);
  };
}())));
IdentifierOrSimpleAccess = cache(named("IdentifierOrSimpleAccess", (function () {
  var _tmp;
  _tmp = named(__strnum((IdentifierOrSimpleAccessPart != null ? IdentifierOrSimpleAccessPart.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = IdentifierOrSimpleAccessPart(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = IdentifierOrSimpleAccessStart(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      var _tmp4, _tmp5, _tmp6, creator, current;
      current = x.head;
      _tmp4 = x.tail;
      _tmp5 = _tmp4.length;
      for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
        creator = _tmp4[_tmp6];
        current = creator(current);
      }
      return current;
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
SingularObjectKey = cache(named("SingularObjectKey", (function () {
  var _tmp, _tmp2, _tmp3, _tmp4, _tmp5, _tmp6;
  _tmp = (function () {
    function _tmp2(ident, o, i) {
      var key;
      key = ident.type === "access" ? ident.value.child : ident.type === "ident" ? o.node("const", i, ident.value) : o.error("Unknown ident type: " + __strnum(ident.type));
      return { key: key, value: ident };
    }
    return named(IdentifierOrSimpleAccess != null ? IdentifierOrSimpleAccess.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = IdentifierOrSimpleAccess(o);
      if (!result) {
        return false;
      } else if (typeof _tmp2 === "function") {
        return _tmp2(result, o, index);
      } else if (_tmp2 !== void 0) {
        return _tmp2;
      } else {
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    function _tmp3(node, o, i) {
      var key;
      key = node.type === "const" && typeof node.value !== "string" ? o.node("const", i, String(node.value)) : node;
      return { key: key, value: node };
    }
    return named(ConstantLiteral != null ? ConstantLiteral.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = ConstantLiteral(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  _tmp3 = (function () {
    function _tmp4(node, o, i) {
      return { key: o.node("const", i, "this"), value: node };
    }
    return named(ThisLiteral != null ? ThisLiteral.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = ThisLiteral(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
  _tmp4 = (function () {
    function _tmp5(node, o, i) {
      return { key: o.node("const", i, "arguments"), value: node };
    }
    return named(ArgumentsLiteral != null ? ArgumentsLiteral.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = ArgumentsLiteral(o);
      if (!result) {
        return false;
      } else if (typeof _tmp5 === "function") {
        return _tmp5(result, o, index);
      } else if (_tmp5 !== void 0) {
        return _tmp5;
      } else {
        return result;
      }
    });
  }());
  _tmp5 = (function () {
    var _tmp6;
    _tmp6 = symbol("-");
    function _tmp7(o) {
      return NumberLiteral(o) || InfinityLiteral(o);
    }
    return (function () {
      function _tmp8(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_tmp6(clone) && (result = _tmp7(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp9(x, o, i) {
        return {
          key: o.node("const", i, String(-__num(x.value))),
          value: o.node("unary", i, { op: "-", node: x })
        };
      }
      return named(_tmp8 != null ? _tmp8.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp8(o);
        if (!result) {
          return false;
        } else if (typeof _tmp9 === "function") {
          return _tmp9(result, o, index);
        } else if (_tmp9 !== void 0) {
          return _tmp9;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp6 = (function () {
    function _tmp7(node) {
      return { key: node, value: node };
    }
    return named(Parenthetical != null ? Parenthetical.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = Parenthetical(o);
      if (!result) {
        return false;
      } else if (typeof _tmp7 === "function") {
        return _tmp7(result, o, index);
      } else if (_tmp7 !== void 0) {
        return _tmp7;
      } else {
        return result;
      }
    });
  }());
  return function (o) {
    return _tmp(o) || _tmp2(o) || _tmp3(o) || _tmp4(o) || _tmp5(o) || _tmp6(o);
  };
}())));
KeyValuePair = cache(named("KeyValuePair", function (o) {
  return DualObjectKey(o) || SingularObjectKey(o);
}));
ObjectLiteral = cache(named("ObjectLiteral", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = KeyValuePair(clone)) && (result.tail = _tmp3(clone)) && MaybeComma(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = (function () {
        var _tmp5;
        _tmp5 = (function () {
          var _tmp6;
          _tmp6 = (function () {
            function _tmp7(o) {
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
            return named(__strnum((_tmp7 != null ? _tmp7.parserName : void 0) || "<nothing>") + "*", function (o) {
              var clone, result;
              clone = o.clone();
              result = [];
              (function () {
                var _tmp8, item;
                for (_tmp8 = []; ; ) {
                  item = _tmp7(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                return _tmp8;
              }());
              o.update(clone);
              return result;
            });
          }());
          return (function () {
            function _tmp7(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if (CheckIndent(clone) && (result.head = KeyValuePair(clone)) && (result.tail = _tmp6(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _tmp8(x) {
              return [x.head].concat(__toArray(x.tail));
            }
            return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp7(o);
              if (!result) {
                return false;
              } else if (typeof _tmp8 === "function") {
                return _tmp8(result, o, index);
              } else if (_tmp8 !== void 0) {
                return _tmp8;
              } else {
                return result;
              }
            });
          }());
        }());
        function _tmp6() {
          return [];
        }
        return named(__strnum((_tmp5 != null ? _tmp5.parserName : void 0) || "<unknown>") + "?", function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _tmp5(clone);
          if (!result) {
            if (typeof _tmp6 === "function") {
              return _tmp6(void 0, o, index);
            } else {
              return _tmp6;
            }
          } else {
            o.update(clone);
            return result;
          }
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _tmp4(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    function _tmp4() {
      return [];
    }
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
      if (!result) {
        if (typeof _tmp4 === "function") {
          return _tmp4(void 0, o, index);
        } else {
          return _tmp4;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (OpenCurlyBrace(clone) && Space(clone) && (result.first = _tmp(clone)) && (result.rest = _tmp2(clone)) && CloseCurlyBrace(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      return o.node("object", i, __toArray(x.first).concat(__toArray(x.rest)));
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
IndentedObjectLiteral = cache(named("IndentedObjectLiteral", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (Space(clone) && Newline(clone) && EmptyLines(clone) && Advance(clone) && CheckIndent(clone) && (result.head = DualObjectKey(clone)) && Space(clone) && (result.tail = _tmp(clone)) && PopIndent(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      return o.node("object", i, [x.head].concat(__toArray(x.tail)));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
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
MaybeMutableToken = cache(named("MaybeMutableToken", named(__strnum((MutableToken != null ? MutableToken.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
SimpleType = cache(named("SimpleType", function (o) {
  return IdentifierOrSimpleAccess(o) || VoidLiteral(o) || NullLiteral(o);
}));
SimpleOrArrayType = cache(named("SimpleOrArrayType", function (o) {
  return SimpleType(o) || ArrayType(o);
}));
UnionType = cache(named("UnionType", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (OpenParenthesis(clone) && (result.head = SimpleOrArrayType(clone)) && (result.tail = _tmp(clone)) && CloseParenthesis(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      return o.node("typeunion", i, [x.head].concat(__toArray(x.tail)));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
ArrayType = cache(named("ArrayType", (function () {
  function _tmp(o) {
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
  function _tmp2(x, o, i) {
    return o.node("typearray", i, x);
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
TypeReference = cache(named("TypeReference", function (o) {
  return IdentifierOrSimpleAccess(o) || UnionType(o) || ArrayType(o);
}));
AsToken = cache(named("AsToken", word("as")));
AsType = cache(named("AsType", (function () {
  function _tmp(o) {
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
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!AsToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
MaybeAsType = cache(named("MaybeAsType", named(__strnum((AsType != null ? AsType.parserName : void 0) || "<unknown>") + "?", function (o) {
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
})));
IdentifierParameter = cache(named("IdentifierParameter", (function () {
  var _tmp, _tmp2;
  _tmp = named(__strnum((ThisOrShorthandLiteralPeriod != null ? ThisOrShorthandLiteralPeriod.parserName : void 0) || "<unknown>") + "?", function (o) {
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
  });
  _tmp2 = (function () {
    function _tmp3(o) {
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
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
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
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.isMutable = MaybeMutableToken(clone)) && (result.spread = MaybeSpreadToken(clone)) && (result.parent = _tmp(clone)) && (result.ident = Identifier(clone)) && (result.asType = MaybeAsType(clone)) && (result.defaultValue = _tmp2(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      var name;
      name = x.parent !== NOTHING ? o.node("access", i, { parent: x.parent, child: o.node("const", i, x.ident.value) }) : x.ident;
      if (x.spread === "..." && x.defaultValue !== NOTHING) {
        o.error("Cannot specify a default value for a spread parameter");
      }
      return o.node("param", i, {
        ident: name,
        defaultValue: x.defaultValue !== NOTHING ? x.defaultValue : void 0,
        spread: x.spread === "...",
        isMutable: x.isMutable === "mutable",
        asType: x.asType !== NOTHING ? x.asType : void 0
      });
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
Parameter = cache(named("Parameter", function (o) {
  return IdentifierParameter(o) || ArrayParameter(o) || ObjectParameter(o);
}));
function validateSpreadParameters(params, o) {
  var _tmp, _tmp2, param, spreadCount;
  spreadCount = 0;
  _tmp = params.length;
  for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
    param = params[_tmp2];
    if (param.type === "param" && param.value.spread) {
      spreadCount = __num(spreadCount) + 1;
      if (!__lte(spreadCount, 1)) {
        o.error("Cannot have more than one spread parameter");
      }
    }
  }
  return params;
}
ArrayParameter = cache(named("ArrayParameter", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = Parameter(clone)) && (result.tail = _tmp3(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenSquareBracket(clone) && EmptyLines(clone) && (result = _tmp(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseSquareBracket(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      return o.node("array", i, validateSpreadParameters(x, o));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
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
  function _tmp(param, o, i) {
    var ident, key;
    ident = param.value.ident;
    key = ident.type === "ident" ? o.node("const", i, ident.value) : ident.type === "access" ? ident.child : (function () {
      throw Error("Unknown object key type: " + __strnum(ident.type));
    }.call(this));
    return { key: key, value: param };
  }
  return named(IdentifierParameter != null ? IdentifierParameter.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = IdentifierParameter(o);
    if (!result) {
      return false;
    } else if (typeof _tmp === "function") {
      return _tmp(result, o, index);
    } else if (_tmp !== void 0) {
      return _tmp;
    } else {
      return result;
    }
  });
}())));
KvpParameter = cache(named("KvpParameter", function (o) {
  return ParamDualObjectKey(o) || ParamSingularObjectKey(o);
}));
ObjectParameter = cache(named("ObjectParameter", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = KvpParameter(clone)) && (result.tail = _tmp3(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (OpenCurlyBrace(clone) && EmptyLines(clone) && (result = _tmp(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseCurlyBrace(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      return o.node("object", i, x);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
Parameters = cache(named("Parameters", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Parameter(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      return validateSpreadParameters([x.head].concat(__toArray(x.tail)), o);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
ParameterSequence = cache(named("ParameterSequence", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2() {
      return [];
    }
    return named(__strnum((Parameters != null ? Parameters.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = Parameters(clone);
      if (!result) {
        if (typeof _tmp2 === "function") {
          return _tmp2(void 0, o, index);
        } else {
          return _tmp2;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (OpenParenthesis(clone) && EmptyLines(clone) && (result = _tmp(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && CloseParenthesis(clone)) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  };
}())));
FunctionBody = cache(named("FunctionBody", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2, _tmp3;
    _tmp2 = symbol("->");
    _tmp3 = (function () {
      function _tmp4(x, o, i) {
        return o.node("nothing", i);
      }
      return named(__strnum((Statement != null ? Statement.parserName : void 0) || "<unknown>") + "?", function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = Statement(clone);
        if (!result) {
          if (typeof _tmp4 === "function") {
            return _tmp4(void 0, o, index);
          } else {
            return _tmp4;
          }
        } else {
          o.update(clone);
          return result;
        }
      });
    }());
    return function (o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (_tmp2(clone) && (result = _tmp3(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    };
  }());
  return function (o) {
    return _tmp(o) || Body(o);
  };
}())));
FunctionDeclaration = cache(named("FunctionDeclaration", (function () {
  var _tmp, _tmp2, _tmp3;
  _tmp = (function () {
    function _tmp2() {
      return [];
    }
    return named(__strnum((ParameterSequence != null ? ParameterSequence.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = ParameterSequence(clone);
      if (!result) {
        if (typeof _tmp2 === "function") {
          return _tmp2(void 0, o, index);
        } else {
          return _tmp2;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = named('"!"', function (o) {
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
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
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
    });
  }());
  _tmp3 = named(__strnum((AtSign != null ? AtSign.parserName : void 0) || "<unknown>") + "?", function (o) {
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
  });
  return (function () {
    function _tmp4(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.params = _tmp(clone)) && (result.autoReturn = _tmp2(clone)) && (result.bound = _tmp3(clone)) && (result.body = FunctionBody(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp5(x, o, i) {
      return o.node("function", i, { params: x.params, autoReturn: x.autoReturn === NOTHING, bound: x.bound !== NOTHING, body: x.body });
    }
    return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp4(o);
      if (!result) {
        return false;
      } else if (typeof _tmp5 === "function") {
        return _tmp5(result, o, index);
      } else if (_tmp5 !== void 0) {
        return _tmp5;
      } else {
        return result;
      }
    });
  }());
}())));
FunctionLiteral = cache(named("FunctionLiteral", (function () {
  function _tmp(o) {
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
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!HashSign(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
AstToken = cache(named("AstToken", word("AST")));
Ast = cache(named("Ast", inAst((function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(x, o, i) {
      return o.node("ast", i, x);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!AstToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}()))));
Debugger = cache(named("Debugger", word("debugger", function (x, o, i) {
  return o.node("debugger", i);
})));
MacroName = cache(named("MacroName", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
      return _Symbol(o) || _Name(o);
    }
    return (function () {
      var _tmp3;
      _tmp3 = named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = _tmp2(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        if (!__lt(result.length, 1)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      });
      function _tmp4(x) {
        return x.join("");
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (Space(clone) && (result = _tmp(clone))) {
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
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2, _tmp3;
    _tmp2 = (function () {
      function _tmp3(o) {
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
      function _tmp4(x, o, i) {
        return o.node("sequence", i, x);
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
    _tmp3 = (function () {
      function _tmp4(o) {
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
      function _tmp5(x, o, i) {
        return o.node("choice", i, x);
      }
      return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp4(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
    return function (o) {
      return Identifier(o) || StringLiteral(o) || _tmp2(o) || _tmp3(o);
    };
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4, _tmp5, _tmp6;
      _tmp4 = symbol("?");
      _tmp5 = symbol("*");
      _tmp6 = symbol("+");
      return function (o) {
        return _tmp4(o) || _tmp5(o) || _tmp6(o);
      };
    }());
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
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
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.type = _tmp(clone)) && (result.multiplier = _tmp2(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      if (x.multiplier === NOTHING) {
        return x.type;
      } else {
        return o.node("many", i, x);
      }
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
MacroSyntaxParameter = cache(named("MacroSyntaxParameter", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp3;
    function _tmp2(o) {
      return ThisOrShorthandLiteral(o) || Identifier(o);
    }
    _tmp3 = (function () {
      function _tmp4(o) {
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
      return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<unknown>") + "?", function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _tmp4(clone);
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
      });
    }());
    return (function () {
      function _tmp4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.ident = _tmp2(clone)) && (result.type = _tmp3(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp5(x, o, i) {
        return o.node("param", i, { ident: x.ident, type: x.type === NOTHING ? void 0 : x.type });
      }
      return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp4(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    return StringLiteral(o) || _tmp(o);
  };
}())));
MacroSyntaxParameters = cache(named("MacroSyntaxParameters", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = MacroSyntaxParameter(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      return [x.head].concat(__toArray(x.tail));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
MacroSyntaxChoiceParameters = cache(named("MacroSyntaxChoiceParameters", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = MacroSyntaxParameterType(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      return [x.head].concat(__toArray(x.tail));
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
SyntaxToken = cache(named("SyntaxToken", word("syntax")));
MacroSyntax = cache(named("MacroSyntax", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var result;
      if (!SyntaxToken(o.clone())) {
        return false;
      } else {
        result = _tmp2(o);
        if (!result) {
          throw SHORT_CIRCUIT;
        }
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (CheckIndent(clone) && (result.params = _tmp(clone)) && (result.body = FunctionBody(clone)) && Space(clone) && CheckStop(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      o.macroSyntax(i, "syntax", x.params, x.body);
      return true;
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
MacroBody = cache(named("MacroBody", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (Advance(clone) && (result.head = MacroSyntax(clone)) && (result.tail = _tmp3(clone)) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (Space(clone) && Newline(clone) && EmptyLines(clone) && (result = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x) {
        return true;
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp2 = (function () {
    function _tmp3(o) {
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
    function _tmp4(x, o, i) {
      o.macroSyntax(i, "call", x.params, x.body);
      return true;
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
  return function (o) {
    return _tmp(o) || _tmp2(o);
  };
}())));
MacroToken = cache(named("MacroToken", word("macro")));
Macro = cache(named("Macro", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named("(identifier MacroBody)", function (o) {
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
      function _tmp3(o) {
        var clone;
        clone = o.clone();
        if (MacroToken(clone) && _tmp2(clone)) {
          o.update(clone);
          return true;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        return o.node("nothing", i);
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!MacroToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
DefineHelperStart = cache(named("DefineHelperStart", (function () {
  var _tmp, _tmp2;
  _tmp = word("define");
  _tmp2 = word("helper");
  return function (o) {
    var clone;
    clone = o.clone();
    if (_tmp(clone) && _tmp2(clone)) {
      o.update(clone);
      return true;
    } else {
      return false;
    }
  };
}())));
DefineHelper = cache(named("DefineHelper", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(x, o, i) {
      return o.node("definehelper", i, x);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!DefineHelperStart(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
Nothing = cache(named("Nothing", function (o) {
  return o.node("nothing", o.index);
}));
ExpressionOrNothing = cache(named("ExpressionOrNothing", function (o) {
  return Expression(o) || Nothing(o);
}));
_indexSlice = new Stack(false);
inIndexSlice = makeAlterStack(_indexSlice, true);
IndexSlice = cache(named("IndexSlice", inIndexSlice((function () {
  function _tmp(o) {
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
  function _tmp2(x) {
    return { type: "slice", left: x.type === "nothing" ? null : x.left, right: x.type === "nothing" ? null : x.right };
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}()))));
IndexMultiple = cache(named("IndexMultiple", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Expression(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x) {
      if (!__lte(x.tail.length, 0)) {
        return { type: "multi", elements: [x.head].concat(__toArray(x.tail)) };
      } else {
        return { type: "single", node: x.head };
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
Index = cache(named("Index", function (o) {
  return IndexSlice(o) || IndexMultiple(o);
}));
IdentifierOrAccessStart = cache(named("IdentifierOrAccessStart", (function () {
  var _tmp, _tmp2, _tmp3;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(x, o, i) {
      return o.node("access", i, x);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    function _tmp3(o) {
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
    function _tmp4(x, o, i) {
      return o.node("access", i, {
        parent: o.node("access", i, { parent: x.parent, child: o.node("const", i, "prototype") }),
        child: x.child
      });
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
  _tmp3 = (function () {
    var _tmp4;
    _tmp4 = named(__strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return (function () {
      function _tmp5(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.parent = ThisOrShorthandLiteral(clone)) && (result.isProto = _tmp4(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp6(x, o, i) {
        var parent;
        parent = x.parent;
        if (x.isProto !== NOTHING) {
          parent = o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") });
        }
        return o.node("index", i, { parent: parent, child: x.child });
      }
      return named(_tmp5 != null ? _tmp5.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp5(o);
        if (!result) {
          return false;
        } else if (typeof _tmp6 === "function") {
          return _tmp6(result, o, index);
        } else if (_tmp6 !== void 0) {
          return _tmp6;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    return Identifier(o) || _tmp(o) || _tmp2(o) || _tmp3(o);
  };
}())));
IdentifierOrAccessPart = cache(named("IdentifierOrAccessPart", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    function _tmp2(o) {
      return Period(o) || DoubleColon(o);
    }
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _tmp2(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        return function (parent) {
          if (x.type === "::") {
            parent = o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") });
          }
          return o.node("access", i, { parent: parent, child: x.child });
        };
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = named(__strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return (function () {
      function _tmp4(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.type = _tmp3(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp5(x, o, i) {
        return function (parent) {
          if (x.type !== NOTHING) {
            parent = o.node("access", i, { parent: parent, child: o.node("const", i, "prototype") });
          }
          return o.node("index", i, { parent: parent, child: x.child });
        };
      }
      return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp4(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    return _tmp(o) || _tmp2(o);
  };
}())));
IdentifierOrAccess = cache(named("IdentifierOrAccess", (function () {
  var _tmp;
  _tmp = named(__strnum((IdentifierOrAccessPart != null ? IdentifierOrAccessPart.parserName : void 0) || "<nothing>") + "*", function (o) {
    var clone, result;
    clone = o.clone();
    result = [];
    (function () {
      var _tmp2, item;
      for (_tmp2 = []; ; ) {
        item = IdentifierOrAccessPart(clone);
        if (!item) {
          break;
        }
        result.push(item);
      }
      return _tmp2;
    }());
    o.update(clone);
    return result;
  });
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = IdentifierOrAccessStart(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      var _tmp4, _tmp5, _tmp6, current, part;
      current = x.head;
      _tmp4 = x.tail;
      _tmp5 = _tmp4.length;
      for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
        part = _tmp4[_tmp6];
        current = part(current);
      }
      return current;
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
SimpleAssignable = IdentifierOrAccess;
ComplexAssignable = cache(named("ComplexAssignable", SimpleAssignable));
ColonEqual = cache(named("ColonEqual", (function () {
  var _tmp;
  _tmp = named('"="', function (o) {
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
    function _tmp2(o) {
      var clone;
      clone = o.clone();
      if (Space(clone) && Colon(clone) && _tmp(clone)) {
        o.update(clone);
        return true;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else {
        return ":=";
      }
    });
  }());
}())));
DirectAssignment = cache(named("DirectAssignment", (function () {
  function _tmp(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.left = ComplexAssignable(clone)) && (result.op = ColonEqual(clone)) && (result.right = Expression(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _tmp2(x, o, i) {
    return o.node("assign", i, x);
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
CompoundAssignmentOp = cache(named("CompoundAssignmentOp", (function () {
  var _tmp, _tmp10, _tmp11, _tmp12, _tmp13, _tmp14, _tmp15, _tmp16, _tmp17, _tmp18, _tmp19, _tmp2, _tmp20, _tmp21, _tmp22, _tmp23, _tmp24, _tmp25, _tmp26, _tmp27, _tmp28, _tmp29, _tmp3, _tmp30, _tmp31, _tmp32, _tmp33, _tmp34, _tmp35, _tmp36, _tmp4, _tmp5, _tmp6, _tmp7, _tmp8, _tmp9;
  _tmp = wordOrSymbol("&=");
  _tmp2 = wordOrSymbol("+=");
  _tmp3 = wordOrSymbol("-=");
  _tmp4 = wordOrSymbol("/=");
  _tmp5 = wordOrSymbol("\\=");
  _tmp6 = wordOrSymbol("%=");
  _tmp7 = wordOrSymbol("*=");
  _tmp8 = wordOrSymbol("^=");
  _tmp9 = wordOrSymbol("~&=");
  _tmp10 = wordOrSymbol("~+=");
  _tmp11 = wordOrSymbol("~-=");
  _tmp12 = wordOrSymbol("~/=");
  _tmp13 = wordOrSymbol("~\\=");
  _tmp14 = wordOrSymbol("~%=");
  _tmp15 = wordOrSymbol("~*=");
  _tmp16 = wordOrSymbol("~^=");
  _tmp17 = wordOrSymbol("?=");
  _tmp18 = wordOrSymbol("or=");
  _tmp19 = wordOrSymbol("and=");
  _tmp20 = wordOrSymbol("xor=");
  _tmp21 = wordOrSymbol("bitand=");
  _tmp22 = wordOrSymbol("bitor=");
  _tmp23 = wordOrSymbol("bitxor=");
  _tmp24 = wordOrSymbol("bitlshift=");
  _tmp25 = wordOrSymbol("bitrshift=");
  _tmp26 = wordOrSymbol("biturshift=");
  _tmp27 = wordOrSymbol("min=");
  _tmp28 = wordOrSymbol("max=");
  _tmp29 = wordOrSymbol("~bitand=");
  _tmp30 = wordOrSymbol("~bitor=");
  _tmp31 = wordOrSymbol("~bitxor=");
  _tmp32 = wordOrSymbol("~bitlshift=");
  _tmp33 = wordOrSymbol("~bitrshift=");
  _tmp34 = wordOrSymbol("~biturshift=");
  _tmp35 = wordOrSymbol("~min=");
  _tmp36 = wordOrSymbol("~max=");
  return function (o) {
    return _tmp(o) || _tmp2(o) || _tmp3(o) || _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o) || _tmp9(o) || _tmp10(o) || _tmp11(o) || _tmp12(o) || _tmp13(o) || _tmp14(o) || _tmp15(o) || _tmp16(o) || _tmp17(o) || _tmp18(o) || _tmp19(o) || _tmp20(o) || _tmp21(o) || _tmp22(o) || _tmp23(o) || _tmp24(o) || _tmp25(o) || _tmp26(o) || _tmp27(o) || _tmp28(o) || _tmp29(o) || _tmp30(o) || _tmp31(o) || _tmp32(o) || _tmp33(o) || _tmp34(o) || _tmp35(o) || _tmp36(o);
  };
}())));
CompoundAssignment = cache(named("CompoundAssignment", (function () {
  function _tmp(o) {
    var clone, result;
    clone = o.clone();
    result = {};
    if ((result.left = SimpleAssignable(clone)) && (result.op = CompoundAssignmentOp(clone)) && (result.right = Expression(clone))) {
      o.update(clone);
      return result;
    } else {
      return false;
    }
  }
  function _tmp2(x, o, i) {
    return o.node("assign", i, x);
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
Assignment = cache(named("Assignment", function (o) {
  return DirectAssignment(o) || CompoundAssignment(o);
}));
PrimaryExpression = cache(named("PrimaryExpression", function (o) {
  return UnclosedObjectLiteral(o) || Literal(o) || Parenthetical(o) || ArrayLiteral(o) || ObjectLiteral(o) || FunctionLiteral(o) || Ast(o) || Debugger(o) || UseMacro(o) || Identifier(o);
}));
UnclosedObjectLiteral = cache(named("UnclosedObjectLiteral", (function () {
  var _tmp2;
  function _tmp(o) {
    return !_indexSlice.peek();
  }
  _tmp2 = (function () {
    function _tmp3(o) {
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
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp4, item;
        for (_tmp4 = []; ; ) {
          item = _tmp3(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp4;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (_tmp(clone) && (result.head = DualObjectKey(clone)) && (result.tail = _tmp2(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      return o.node("object", i, [x.head].concat(__toArray(x.tail)));
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
ClosedArguments = cache(named("ClosedArguments", (function () {
  var _tmp, _tmp2;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
          var clone, result;
          clone = o.clone();
          result = [];
          (function () {
            var _tmp5, item;
            for (_tmp5 = []; ; ) {
              item = _tmp4(clone);
              if (!item) {
                break;
              }
              result.push(item);
            }
            return _tmp5;
          }());
          o.update(clone);
          return result;
        });
      }());
      return (function () {
        function _tmp4(o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.head = SpreadOrExpression(clone)) && (result.tail = _tmp3(clone)) && MaybeComma(clone)) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        function _tmp5(x) {
          return [x.head].concat(__toArray(x.tail));
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  _tmp2 = (function () {
    var _tmp3;
    _tmp3 = (function () {
      var _tmp4;
      _tmp4 = (function () {
        var _tmp5;
        _tmp5 = (function () {
          var _tmp6;
          _tmp6 = (function () {
            function _tmp7(o) {
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
            return named(__strnum((_tmp7 != null ? _tmp7.parserName : void 0) || "<nothing>") + "*", function (o) {
              var clone, result;
              clone = o.clone();
              result = [];
              (function () {
                var _tmp8, item;
                for (_tmp8 = []; ; ) {
                  item = _tmp7(clone);
                  if (!item) {
                    break;
                  }
                  result.push(item);
                }
                return _tmp8;
              }());
              o.update(clone);
              return result;
            });
          }());
          return (function () {
            function _tmp7(o) {
              var clone, result;
              clone = o.clone();
              result = {};
              if (CheckIndent(clone) && (result.head = SpreadOrExpression(clone)) && (result.tail = _tmp6(clone))) {
                o.update(clone);
                return result;
              } else {
                return false;
              }
            }
            function _tmp8(x) {
              return [x.head].concat(__toArray(x.tail));
            }
            return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
              var index, result;
              index = o.index;
              result = _tmp7(o);
              if (!result) {
                return false;
              } else if (typeof _tmp8 === "function") {
                return _tmp8(result, o, index);
              } else if (_tmp8 !== void 0) {
                return _tmp8;
              } else {
                return result;
              }
            });
          }());
        }());
        function _tmp6() {
          return [];
        }
        return named(__strnum((_tmp5 != null ? _tmp5.parserName : void 0) || "<unknown>") + "?", function (o) {
          var clone, index, result;
          index = o.index;
          clone = o.clone();
          result = _tmp5(clone);
          if (!result) {
            if (typeof _tmp6 === "function") {
              return _tmp6(void 0, o, index);
            } else {
              return _tmp6;
            }
          } else {
            o.update(clone);
            return result;
          }
        });
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (SomeEmptyLines(clone) && MaybeAdvance(clone) && (result = _tmp4(clone)) && EmptyLines(clone) && MaybeCommaOrNewline(clone) && PopIndent(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    function _tmp4() {
      return [];
    }
    return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp3(clone);
      if (!result) {
        if (typeof _tmp4 === "function") {
          return _tmp4(void 0, o, index);
        } else {
          return _tmp4;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if (OpenParenthesisChar(clone) && Space(clone) && (result.first = _tmp(clone)) && (result.rest = _tmp2(clone)) && CloseParenthesis(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      return __toArray(x.first).concat(__toArray(x.rest));
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
  }());
}())));
UnclosedArguments = cache(named("UnclosedArguments", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      function _tmp3(o) {
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
      return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<nothing>") + "*", function (o) {
        var clone, result;
        clone = o.clone();
        result = [];
        (function () {
          var _tmp4, item;
          for (_tmp4 = []; ; ) {
            item = _tmp3(clone);
            if (!item) {
              break;
            }
            result.push(item);
          }
          return _tmp4;
        }());
        o.update(clone);
        return result;
      });
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = SpreadOrExpression(clone)) && (result.tail = _tmp2(clone)) && MaybeComma(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x) {
        return [x.head].concat(__toArray(x.tail));
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if (SomeSpace(clone) && (result = _tmp(clone))) {
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
  var _tmp, _tmp2, _tmp3;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = word("new");
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
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
    });
  }());
  _tmp2 = (function () {
    var _tmp3, _tmp4;
    _tmp3 = (function () {
      function _tmp4(o) {
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
      function _tmp5(x, o, i) {
        return { type: "thisAccess", node: x.node, child: x.child, existential: x.existential === "?" };
      }
      return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp4(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
    _tmp4 = (function () {
      function _tmp5(x) {
        return { type: "normal", node: x };
      }
      return named(PrimaryExpression != null ? PrimaryExpression.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = PrimaryExpression(o);
        if (!result) {
          return false;
        } else if (typeof _tmp5 === "function") {
          return _tmp5(result, o, index);
        } else if (_tmp5 !== void 0) {
          return _tmp5;
        } else {
          return result;
        }
      });
    }());
    return function (o) {
      return _tmp3(o) || _tmp4(o);
    };
  }());
  _tmp3 = (function () {
    var _tmp4;
    _tmp4 = (function () {
      var _tmp5, _tmp6, _tmp7, _tmp8;
      _tmp5 = (function () {
        function _tmp6(o) {
          return Period(o) || DoubleColon(o);
        }
        return (function () {
          function _tmp7(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && EmptyLines(clone) && Space(clone) && (result.type = _tmp6(clone)) && (result.child = IdentifierNameConstOrNumberLiteral(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _tmp8(x) {
            return { type: x.type === "::" ? "protoAccess" : "access", child: x.child, existential: x.existential === "?" };
          }
          return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
            var index, result;
            index = o.index;
            result = _tmp7(o);
            if (!result) {
              return false;
            } else if (typeof _tmp8 === "function") {
              return _tmp8(result, o, index);
            } else if (_tmp8 !== void 0) {
              return _tmp8;
            } else {
              return result;
            }
          });
        }());
      }());
      _tmp6 = (function () {
        var _tmp7;
        _tmp7 = named(__strnum((DoubleColon != null ? DoubleColon.parserName : void 0) || "<unknown>") + "?", function (o) {
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
        });
        return (function () {
          function _tmp8(o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.existential = MaybeExistentialSymbolNoSpace(clone)) && (result.type = _tmp7(clone)) && OpenSquareBracketChar(clone) && (result.child = Index(clone)) && CloseSquareBracket(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _tmp9(x) {
            return { type: x.type, child: x.child, existential: x.existential === "?" };
          }
          return named(_tmp8 != null ? _tmp8.parserName : void 0, function (o) {
            var index, result;
            index = o.index;
            result = _tmp8(o);
            if (!result) {
              return false;
            } else if (typeof _tmp9 === "function") {
              return _tmp9(result, o, index);
            } else if (_tmp9 !== void 0) {
              return _tmp9;
            } else {
              return result;
            }
          });
        }());
      }());
      _tmp7 = (function () {
        function _tmp8(o) {
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
        function _tmp9(x) {
          return { type: "call", args: x.args, existential: x.existential === "?", isNew: false };
        }
        return named(_tmp8 != null ? _tmp8.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp8(o);
          if (!result) {
            return false;
          } else if (typeof _tmp9 === "function") {
            return _tmp9(result, o, index);
          } else if (_tmp9 !== void 0) {
            return _tmp9;
          } else {
            return result;
          }
        });
      }());
      _tmp8 = (function () {
        function _tmp9(o) {
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
        function _tmp10(x) {
          return { type: "?", child: x };
        }
        return named(_tmp9 != null ? _tmp9.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp9(o);
          if (!result) {
            return false;
          } else if (typeof _tmp10 === "function") {
            return _tmp10(result, o, index);
          } else if (_tmp10 !== void 0) {
            return _tmp10;
          } else {
            return result;
          }
        });
      }());
      return function (o) {
        return _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o);
      };
    }());
    return named(__strnum((_tmp4 != null ? _tmp4.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp5, item;
        for (_tmp5 = []; ; ) {
          item = _tmp4(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp5;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp4(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.isNew = _tmp(clone)) && (result.head = _tmp2(clone)) && (result.tail = _tmp3(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp5(x, o, i) {
      var _tmp6, _tmp7, _tmp8, clone, head, isNew, links, part, tail;
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
      _tmp6 = tail.length;
      for (_tmp7 = 0, __num(_tmp6); _tmp7 < _tmp6; _tmp7 = __num(_tmp7) + 1) {
        part = tail[_tmp7];
        if ((_tmp8 = part.type) === "protoAccess" || _tmp8 === "protoIndex") {
          links.push({ type: "access", child: o.node("const", i, "prototype"), existential: part.existential });
          clone = copy(part);
          clone.type = part.type === "protoAccess" ? "access" : "index";
          links.push(clone);
        } else if ((_tmp8 = part.type) === "access" || _tmp8 === "index") {
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
      return o.node("callchain", i, { head: head.node, links: links });
    }
    return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp4(o);
      if (!result) {
        return false;
      } else if (typeof _tmp5 === "function") {
        return _tmp5(result, o, index);
      } else if (_tmp5 !== void 0) {
        return _tmp5;
      } else {
        return result;
      }
    });
  }());
}())));
EvalToken = cache(named("EvalToken", word("eval")));
Eval = cache(named("Eval", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(args, o, i) {
      if (args.length !== 1) {
        o.error("Expected only one argument to eval");
      }
      return o.node("eval", i, args[0]);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!EvalToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
InvocationOrAccess = cache(named("InvocationOrAccess", function (o) {
  return BasicInvocationOrAccess(o) || Eval(o);
}));
ExistentialUnary = cache(named("ExistentialUnary", (function () {
  function _tmp(o) {
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
  function _tmp2(x, o, i) {
    if (x.op === "?") {
      return o.node("unary", i, x);
    } else {
      return x.node;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
Unary = cache(named("Unary", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3, _tmp4, _tmp5, _tmp6, _tmp7, _tmp8, _tmp9;
      _tmp3 = (function () {
        function _tmp4(o) {
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
        function _tmp5(x) {
          if (x === "not") {
            return "bool";
          } else {
            return "not";
          }
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
      _tmp4 = word("bitnot");
      _tmp5 = wordOrSymbol("~bitnot");
      _tmp6 = (function () {
        var _tmp7, _tmp8;
        _tmp7 = word("typeof");
        _tmp8 = (function () {
          var _tmp9;
          _tmp9 = named('"!"', function (o) {
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
          return named(__strnum((_tmp9 != null ? _tmp9.parserName : void 0) || "<unknown>") + "?", function (o) {
            var clone, index, result;
            index = o.index;
            clone = o.clone();
            result = _tmp9(clone);
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
          });
        }());
        return (function () {
          function _tmp9(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_tmp7(clone) && (result = _tmp8(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _tmp10(x) {
            if (x !== NOTHING) {
              return "typeof!";
            } else {
              return "typeof";
            }
          }
          return named(_tmp9 != null ? _tmp9.parserName : void 0, function (o) {
            var index, result;
            index = o.index;
            result = _tmp9(o);
            if (!result) {
              return false;
            } else if (typeof _tmp10 === "function") {
              return _tmp10(result, o, index);
            } else if (_tmp10 !== void 0) {
              return _tmp10;
            } else {
              return result;
            }
          });
        }());
      }());
      _tmp7 = (function () {
        var _tmp8, _tmp9;
        _tmp8 = (function () {
          var _tmp10, _tmp11, _tmp9;
          _tmp9 = word("num");
          _tmp10 = word("str");
          _tmp11 = word("strnum");
          return function (o) {
            return _tmp9(o) || _tmp10(o) || _tmp11(o);
          };
        }());
        _tmp9 = named('"!"', function (o) {
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
          function _tmp10(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if ((result = _tmp8(clone)) && _tmp9(clone)) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _tmp11(x) {
            return __strnum(x) + "!";
          }
          return named(_tmp10 != null ? _tmp10.parserName : void 0, function (o) {
            var index, result;
            index = o.index;
            result = _tmp10(o);
            if (!result) {
              return false;
            } else if (typeof _tmp11 === "function") {
              return _tmp11(result, o, index);
            } else if (_tmp11 !== void 0) {
              return _tmp11;
            } else {
              return result;
            }
          });
        }());
      }());
      _tmp8 = word("delete");
      _tmp9 = (function () {
        var _tmp10;
        _tmp10 = word("throw");
        return (function () {
          function _tmp11(o) {
            var clone, result;
            clone = o.clone();
            result = void 0;
            if (_tmp10(clone) && (result = MaybeExistentialSymbolNoSpace(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          }
          function _tmp12(x) {
            if (x === "?") {
              return "throw?";
            } else {
              return "throw";
            }
          }
          return named(_tmp11 != null ? _tmp11.parserName : void 0, function (o) {
            var index, result;
            index = o.index;
            result = _tmp11(o);
            if (!result) {
              return false;
            } else if (typeof _tmp12 === "function") {
              return _tmp12(result, o, index);
            } else if (_tmp12 !== void 0) {
              return _tmp12;
            } else {
              return result;
            }
          });
        }());
      }());
      return function (o) {
        return _tmp3(o) || _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o) || _tmp9(o);
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
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
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.op = _tmp(clone)) && (result.node = ExistentialUnary(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      if (x.op !== NOTHING) {
        return o.node("unary", i, x);
      } else {
        return x.node;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
Negate = cache(named("Negate", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5, _tmp6, _tmp7, _tmp8;
        _tmp4 = symbol("+");
        _tmp5 = symbol("-");
        _tmp6 = symbol("~+");
        _tmp7 = symbol("~-");
        _tmp8 = symbol("^");
        return function (o) {
          return _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if ((result = _tmp3(clone)) && NoSpace(clone)) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
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
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.op = _tmp(clone)) && (result.node = Unary(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      var _tmp4;
      if (x.op !== NOTHING) {
        if (x.node.type === "const" && typeof x.node.value === "number" && ((_tmp4 = x.op) === "+" || _tmp4 === "-" || _tmp4 === "~+" || _tmp4 === "~-")) {
          return o.node("const", i, (_tmp4 = x.op) === "+" || _tmp4 === "~+" ? __num(x.node.value) : -__num(x.node.value));
        } else {
          return o.node("unary", i, x);
        }
      } else {
        return x.node;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
function binaryLeftToRight(x, o, i) {
  var _tmp, _tmp2, _tmp3, current, part;
  current = x.head;
  _tmp = x.tail;
  _tmp2 = _tmp.length;
  for (_tmp3 = 0, __num(_tmp2); _tmp3 < _tmp2; _tmp3 = __num(_tmp3) + 1) {
    part = _tmp[_tmp3];
    current = o.node("binary", i, { left: current, right: part.node, op: part.op });
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
    for (j = __num(tail.length) - 1; j > 0; j = __num(j) - 1) {
      current = o.node("binary", i, { left: tail[__num(j) - 1].node, right: current, op: tail[j].op });
    }
    return o.node("binary", i, { left: head, right: current, op: tail[0].op });
  }
}
Exponentiation = cache(named("Exponentiation", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5;
        _tmp4 = wordOrSymbol("^");
        _tmp5 = wordOrSymbol("~^");
        return function (o) {
          return _tmp4(o) || _tmp5(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Negate(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Negate(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryRightToLeft === "function") {
        return binaryRightToLeft(result, o, index);
      } else if (binaryRightToLeft !== void 0) {
        return binaryRightToLeft;
      } else {
        return result;
      }
    });
  }());
}())));
Multiplication = cache(named("Multiplication", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp10, _tmp11, _tmp4, _tmp5, _tmp6, _tmp7, _tmp8, _tmp9;
        _tmp4 = wordOrSymbol("*");
        _tmp5 = wordOrSymbol("/");
        _tmp6 = wordOrSymbol("%");
        _tmp7 = wordOrSymbol("\\");
        _tmp8 = wordOrSymbol("~*");
        _tmp9 = wordOrSymbol("~/");
        _tmp10 = wordOrSymbol("~%");
        _tmp11 = wordOrSymbol("~\\");
        return function (o) {
          return _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o) || _tmp9(o) || _tmp10(o) || _tmp11(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Exponentiation(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Exponentiation(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
Addition = cache(named("Addition", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5, _tmp6, _tmp7;
        _tmp4 = wordOrSymbol("+");
        _tmp5 = wordOrSymbol("-");
        _tmp6 = wordOrSymbol("~+");
        _tmp7 = wordOrSymbol("~-");
        return function (o) {
          return _tmp4(o) || _tmp5(o) || _tmp6(o) || _tmp7(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Multiplication(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Multiplication(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
BitwiseShift = cache(named("BitwiseShift", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp5, _tmp6, _tmp7;
          _tmp5 = wordOrSymbol("bitlshift");
          _tmp6 = wordOrSymbol("bitrshift");
          _tmp7 = wordOrSymbol("biturshift");
          return function (o) {
            return _tmp5(o) || _tmp6(o) || _tmp7(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _tmp4(clone)) && (result.node = Addition(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _tmp4(x) {
        return [x];
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Addition(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
Min = cache(named("Min", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("min");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = BitwiseShift(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = BitwiseShift(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
Max = cache(named("Max", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("max");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = BitwiseShift(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = BitwiseShift(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
MinMax = cache(named("MinMax", function (o) {
  return Min(o) || Max(o);
}));
StringConcatenation = cache(named("StringConcatenation", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4, _tmp5;
        _tmp4 = wordOrSymbol("&");
        _tmp5 = wordOrSymbol("~&");
        return function (o) {
          return _tmp4(o) || _tmp5(o);
        };
      }());
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = MinMax(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = MinMax(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
Containment = cache(named("Containment", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp5;
          _tmp5 = (function () {
            var _tmp6;
            _tmp6 = (function () {
              var _tmp10, _tmp11, _tmp7, _tmp8, _tmp9;
              _tmp7 = wordOrSymbol("in");
              _tmp8 = wordOrSymbol("haskey");
              _tmp9 = wordOrSymbol("ownskey");
              _tmp10 = wordOrSymbol("instanceof");
              _tmp11 = wordOrSymbol("instanceofsome");
              return function (o) {
                return _tmp7(o) || _tmp8(o) || _tmp9(o) || _tmp10(o) || _tmp11(o);
              };
            }());
            return (function () {
              function _tmp7(o) {
                var clone, result;
                clone = o.clone();
                result = {};
                if ((result.inverse = MaybeNotToken(clone)) && (result.op = _tmp6(clone))) {
                  o.update(clone);
                  return result;
                } else {
                  return false;
                }
              }
              function _tmp8(x) {
                if (x.inverse === "not") {
                  return "not " + __strnum(x.op);
                } else {
                  return x.op;
                }
              }
              return named(_tmp7 != null ? _tmp7.parserName : void 0, function (o) {
                var index, result;
                index = o.index;
                result = _tmp7(o);
                if (!result) {
                  return false;
                } else if (typeof _tmp8 === "function") {
                  return _tmp8(result, o, index);
                } else if (_tmp8 !== void 0) {
                  return _tmp8;
                } else {
                  return result;
                }
              });
            }());
          }());
          return function (o) {
            var clone, result;
            clone = o.clone();
            result = {};
            if ((result.op = _tmp5(clone)) && (result.node = StringConcatenation(clone))) {
              o.update(clone);
              return result;
            } else {
              return false;
            }
          };
        }());
        function _tmp5(x) {
          return [x];
        }
        return named(_tmp4 != null ? _tmp4.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp4(o);
          if (!result) {
            return false;
          } else if (typeof _tmp5 === "function") {
            return _tmp5(result, o, index);
          } else if (_tmp5 !== void 0) {
            return _tmp5;
          } else {
            return result;
          }
        });
      }());
      function _tmp4() {
        return [];
      }
      return named(__strnum((_tmp3 != null ? _tmp3.parserName : void 0) || "<unknown>") + "?", function (o) {
        var clone, index, result;
        index = o.index;
        clone = o.clone();
        result = _tmp3(clone);
        if (!result) {
          if (typeof _tmp4 === "function") {
            return _tmp4(void 0, o, index);
          } else {
            return _tmp4;
          }
        } else {
          o.update(clone);
          return result;
        }
      });
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.head = StringConcatenation(clone)) && (result.tail = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof binaryLeftToRight === "function") {
          return binaryLeftToRight(result, o, index);
        } else if (binaryLeftToRight !== void 0) {
          return binaryLeftToRight;
        } else {
          return result;
        }
      });
    }());
  }());
  function _tmp2(x, o, i) {
    if (x && x.type === "binary" && x.value.op.substring(0, 4) === "not ") {
      return o.node("unary", i, {
        op: "not",
        node: o.node("binary", i, { left: x.value.left, right: x.value.right, op: x.value.op.substring(4) })
      });
    } else {
      return x;
    }
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
Spaceship = cache(named("Spaceship", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = wordOrSymbol("<=>");
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _tmp4(clone)) && (result.node = Containment(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _tmp4(x) {
        return [x];
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Containment(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
Comparison = cache(named("Comparison", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = (function () {
        var _tmp4;
        _tmp4 = (function () {
          var _tmp10, _tmp11, _tmp12, _tmp13, _tmp14, _tmp15, _tmp16, _tmp17, _tmp18, _tmp19, _tmp20, _tmp5, _tmp6, _tmp7, _tmp8, _tmp9;
          _tmp5 = wordOrSymbol("~=");
          _tmp6 = wordOrSymbol("!~=");
          _tmp7 = wordOrSymbol("==");
          _tmp8 = wordOrSymbol("!=");
          _tmp9 = wordOrSymbol("%%");
          _tmp10 = wordOrSymbol("!%%");
          _tmp11 = wordOrSymbol("~%%");
          _tmp12 = wordOrSymbol("!~%%");
          _tmp13 = wordOrSymbol("<");
          _tmp14 = wordOrSymbol("<=");
          _tmp15 = wordOrSymbol(">");
          _tmp16 = wordOrSymbol(">=");
          _tmp17 = wordOrSymbol("~<");
          _tmp18 = wordOrSymbol("~<=");
          _tmp19 = wordOrSymbol("~>");
          _tmp20 = wordOrSymbol("~>=");
          return function (o) {
            return _tmp5(o) || _tmp6(o) || _tmp7(o) || _tmp8(o) || _tmp9(o) || _tmp10(o) || _tmp11(o) || _tmp12(o) || _tmp13(o) || _tmp14(o) || _tmp15(o) || _tmp16(o) || _tmp17(o) || _tmp18(o) || _tmp19(o) || _tmp20(o);
          };
        }());
        return function (o) {
          var clone, result;
          clone = o.clone();
          result = {};
          if ((result.op = _tmp4(clone)) && (result.node = Spaceship(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        };
      }());
      function _tmp4(x) {
        return [x];
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
    function _tmp3() {
      return [];
    }
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<unknown>") + "?", function (o) {
      var clone, index, result;
      index = o.index;
      clone = o.clone();
      result = _tmp2(clone);
      if (!result) {
        if (typeof _tmp3 === "function") {
          return _tmp3(void 0, o, index);
        } else {
          return _tmp3;
        }
      } else {
        o.update(clone);
        return result;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Spaceship(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
LogicalAnd = cache(named("LogicalAnd", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("and");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
LogicalOr = cache(named("LogicalOr", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("or");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
LogicalXor = cache(named("LogicalXor", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("xor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
ExistentialOr = cache(named("ExistentialOr", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = ExistentialSymbol;
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryRightToLeft === "function") {
        return binaryRightToLeft(result, o, index);
      } else if (binaryRightToLeft !== void 0) {
        return binaryRightToLeft;
      } else {
        return result;
      }
    });
  }());
}())));
BitwiseAnd = cache(named("BitwiseAnd", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("bitand");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
BitwiseOr = cache(named("BitwiseOr", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("bitor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
  }());
}())));
BitwiseXor = cache(named("BitwiseXor", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      var _tmp3;
      _tmp3 = wordOrSymbol("bitxor");
      return function (o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if ((result.op = _tmp3(clone)) && (result.node = Comparison(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      };
    }());
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "+", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      if (!__lt(result.length, 1)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Comparison(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof binaryLeftToRight === "function") {
        return binaryLeftToRight(result, o, index);
      } else if (binaryLeftToRight !== void 0) {
        return binaryLeftToRight;
      } else {
        return result;
      }
    });
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
  function _tmp(o) {
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
  function _tmp2(x, o, i) {
    return o.node("declarable", i, { ident: x.ident, isMutable: x.isMutable === "mutable" });
  }
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var index, result;
    index = o.index;
    result = _tmp(o);
    if (!result) {
      return false;
    } else if (typeof _tmp2 === "function") {
      return _tmp2(result, o, index);
    } else if (_tmp2 !== void 0) {
      return _tmp2;
    } else {
      return result;
    }
  });
}())));
Declarable = cache(named("Declarable", IdentifierDeclarable));
LetToken = cache(named("LetToken", word("let")));
Let = cache(named("Let", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = (function () {
      function _tmp3(o) {
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
      return function (o) {
        return _tmp3(o) || FunctionDeclaration(o);
      };
    }());
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (LetToken(clone) && (result.left = Declarable(clone)) && (result.right = _tmp2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        return o.node("let", i, x);
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!LetToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
ReturnToken = cache(named("ReturnToken", word("return")));
Return = cache(named("Return", (function () {
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    function _tmp3(x, o, i) {
      return o.node("return", i, { node: x.node, existential: x.existential === "?" });
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!ReturnToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
YieldToken = cache(named("YieldToken", word("yield")));
Yield = cache(named("Yield", (function () {
  var _tmp;
  _tmp = (function () {
    var _tmp2;
    _tmp2 = named(__strnum((Asterix != null ? Asterix.parserName : void 0) || "<unknown>") + "?", function (o) {
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
    });
    return (function () {
      function _tmp3(o) {
        var clone, result;
        clone = o.clone();
        result = {};
        if (YieldToken(clone) && (result.multiple = _tmp2(clone)) && (result.node = Expression(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _tmp4(x, o, i) {
        return o.node("yield", i, { multiple: x.multiple !== NOTHING, node: x.node });
      }
      return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
        var index, result;
        index = o.index;
        result = _tmp3(o);
        if (!result) {
          return false;
        } else if (typeof _tmp4 === "function") {
          return _tmp4(result, o, index);
        } else if (_tmp4 !== void 0) {
          return _tmp4;
        } else {
          return result;
        }
      });
    }());
  }());
  return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
    var result;
    if (!YieldToken(o.clone())) {
      return false;
    } else {
      result = _tmp(o);
      if (!result) {
        throw SHORT_CIRCUIT;
      }
      return result;
    }
  });
}())));
Break = cache(named("Break", word("break", function (x, o, i) {
  return o.node("break", i);
})));
Continue = cache(named("Continue", word("continue", function (x, o, i) {
  return o.node("continue", i);
})));
Statement = cache(named("Statement", (function () {
  var _tmp;
  _tmp = inStatement(function (o) {
    return Let(o) || Return(o) || Yield(o) || Break(o) || Continue(o) || Macro(o) || DefineHelper(o) || Assignment(o) || ExpressionAsStatement(o);
  });
  return function (o) {
    var clone, result;
    clone = o.clone();
    result = void 0;
    if ((result = _tmp(clone)) && Space(clone)) {
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
  var _tmp;
  _tmp = (function () {
    function _tmp2(o) {
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
    return named(__strnum((_tmp2 != null ? _tmp2.parserName : void 0) || "<nothing>") + "*", function (o) {
      var clone, result;
      clone = o.clone();
      result = [];
      (function () {
        var _tmp3, item;
        for (_tmp3 = []; ; ) {
          item = _tmp2(clone);
          if (!item) {
            break;
          }
          result.push(item);
        }
        return _tmp3;
      }());
      o.update(clone);
      return result;
    });
  }());
  return (function () {
    function _tmp2(o) {
      var clone, result;
      clone = o.clone();
      result = {};
      if ((result.head = Line(clone)) && (result.tail = _tmp(clone))) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp3(x, o, i) {
      var _tmp4, _tmp5, _tmp6, body, item;
      body = [];
      _tmp4 = [x.head].concat(__toArray(x.tail));
      _tmp5 = _tmp4.length;
      for (_tmp6 = 0, __num(_tmp5); _tmp6 < _tmp5; _tmp6 = __num(_tmp6) + 1) {
        item = _tmp4[_tmp6];
        if (item.type === "block") {
          body.push.apply(body, __toArray(item.value));
        } else {
          body.push(item);
        }
      }
      return o.node("block", i, body);
    }
    return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp2(o);
      if (!result) {
        return false;
      } else if (typeof _tmp3 === "function") {
        return _tmp3(result, o, index);
      } else if (_tmp3 !== void 0) {
        return _tmp3;
      } else {
        return result;
      }
    });
  }());
}())));
Root = cache(named("Root", (function () {
  var _tmp;
  _tmp = named(__strnum((Shebang != null ? Shebang.parserName : void 0) || "<unknown>") + "?", function (o) {
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
  });
  function _tmp2(o) {
    return Block(o) || Nothing(o);
  }
  return (function () {
    function _tmp3(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if (_tmp(clone) && EmptyLines(clone) && (result = _tmp2(clone)) && EmptyLines(clone) && Space(clone)) {
        o.update(clone);
        return result;
      } else {
        return false;
      }
    }
    function _tmp4(x, o, i) {
      return o.node("root", i, x);
    }
    return named(_tmp3 != null ? _tmp3.parserName : void 0, function (o) {
      var index, result;
      index = o.index;
      result = _tmp3(o);
      if (!result) {
        return false;
      } else if (typeof _tmp4 === "function") {
        return _tmp4(result, o, index);
      } else if (_tmp4 !== void 0) {
        return _tmp4;
      } else {
        return result;
      }
    });
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
    return this.state.node("if", this.index, { test: test, whenTrue: whenTrue, whenFalse: whenFalse });
  };
  MacroHelper.prototype["for"] = function (init, test, step, body) {
    return this.state.node("for", this.index, { init: init, test: test, step: step, body: body });
  };
  MacroHelper.prototype.forIn = function (key, object, body) {
    return this.state.node("forin", this.index, { key: key, object: object, body: body });
  };
  MacroHelper.prototype.tryCatch = function (tryBody, catchIdent, catchBody) {
    return this.state.node("trycatch", this.index, { tryBody: tryBody, catchIdent: catchIdent, catchBody: catchBody });
  };
  MacroHelper.prototype.tryFinally = function (tryBody, finallyBody) {
    return this.state.node("tryfinally", this.index, { tryBody: tryBody, finallyBody: finallyBody });
  };
  getTmpId = (function () {
    var id;
    id = -1;
    return function () {
      return id = __num(id) + 1;
    };
  }());
  MacroHelper.prototype.tmp = function (save) {
    var id;
    id = getTmpId();
    (save ? this.savedTmps : this.unsavedTmps).push(id);
    return this.state.node("tmp", this.index, id);
  };
  MacroHelper.prototype.getTmps = function () {
    return { unsaved: __slice(this.unsavedTmps, void 0, void 0), saved: __slice(this.savedTmps, void 0, void 0) };
  };
  MacroHelper.prototype.isConst = function (node) {
    return node === void 0 || node != null && (node.type === "const" || node.type === "block" && node.value.length === 0);
  };
  MacroHelper.prototype.value = function (node) {
    if (node === void 0) {
      return;
    } else if (node != null) {
      if (node.type === "const") {
        return node.value;
      } else if (node.type === "block" && node.value.length === 0) {
        return;
      }
    }
  };
  MacroHelper.prototype["const"] = function (value) {
    var _tmp;
    if (value instanceof RegExp || value === null || (_tmp = typeof value) === "undefined" || _tmp === "boolean" || _tmp === "string" || _tmp === "number") {
      return { type: "const", value: value };
    } else {
      throw Error("Cannot make a const out of " + __strnum(String(value)));
    }
  };
  MacroHelper.prototype.isIdent = function (node) {
    return node != null && node.type === "ident";
  };
  MacroHelper.prototype.name = function (node) {
    if (node != null && node.type === "ident") {
      return node.value;
    }
  };
  MacroHelper.prototype.ident = function (name) {
    if (typeof name !== "string") {
      throw TypeError("Expected a string");
    }
    return { type: "ident", value: name };
  };
  MacroHelper.prototype.isCall = function (node) {
    var links;
    if (node != null && node.type === "callchain") {
      links = node.value.links;
      return links[__num(links.length) - 1].type === "call";
    } else {
      return false;
    }
  };
  MacroHelper.prototype.callFunc = function (node) {
    var links;
    if (node != null && node.type === "callchain") {
      links = node.value.links;
      if (links[__num(links.length) - 1].type === "call") {
        return {
          type: node.type,
          startIndex: node.startIndex,
          endIndex: node.endIndex,
          value: { head: node.value.head, links: __slice(links, void 0, __num(links.length) - 1) }
        };
      }
    }
  };
  MacroHelper.prototype.callArgs = function (node) {
    var links;
    if (node != null && node.type === "callchain") {
      links = node.value.links;
      if (links[__num(links.length) - 1].type === "call") {
        return links[__num(links.length) - 1].args;
      }
    }
  };
  MacroHelper.prototype.callIsNew = function (node) {
    var links;
    if (node != null && node.type === "callchain") {
      links = node.value.links;
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
      throw TypeError("Expected isNew to be a Boolean, got " + __strnum(__typeof(isNew)));
    }
    if (func.type === "callchain") {
      return {
        type: "callchain",
        startIndex: func.startIndex,
        endIndex: func.endIndex,
        value: {
          head: func.value.head,
          links: __toArray(func.value.links).concat([
            { type: "call", args: args, isNew: !!isNew }
          ])
        }
      };
    } else {
      return {
        type: "callchain",
        startIndex: func.startIndex,
        endIndex: func.endIndex,
        value: {
          head: func,
          links: [
            { type: "call", args: args, isNew: !!isNew }
          ]
        }
      };
    }
  };
  MacroHelper.prototype.func = function (params, body, autoReturn, bound) {
    if (autoReturn == null) {
      autoReturn = true;
    }
    if (bound == null) {
      bound = false;
    }
    if (!Array.isArray(params)) {
      throw TypeError("Expected params to be an Array, got " + __strnum(__typeof(params)));
    } else if (!body || typeof body !== "object") {
      throw TypeError("Expected body to be an object, got " + __strnum(__typeof(body)));
    } else if (typeof autoReturn !== "boolean") {
      throw TypeError("Expected autoReturn to be a boolean, got " + __strnum(__typeof(autoReturn)));
    } else if (typeof bound !== "boolean") {
      throw TypeError("Expected bound to be a boolean, got " + __strnum(__typeof(bound)));
    }
    return {
      type: "function",
      value: { params: params, body: body, autoReturn: autoReturn, bound: bound }
    };
  };
  MacroHelper.prototype.isFunc = function (node) {
    return node && node.type === "function";
  };
  MacroHelper.prototype.funcBody = function (node) {
    if (node != null && node.type === "function") {
      return node.value.body;
    }
  };
  MacroHelper.prototype.funcParams = function (node) {
    if (node != null && node.type === "function") {
      return node.value.params;
    }
  };
  MacroHelper.prototype.funcIsAutoReturn = function (node) {
    if (node != null && node.type === "function") {
      return !!node.value.autoReturn;
    }
  };
  MacroHelper.prototype.funcIsBound = function (node) {
    if (node != null && node.type === "function") {
      return !!node.value.bound;
    }
  };
  MacroHelper.prototype.isArray = function (node) {
    return node && node.type === "array";
  };
  MacroHelper.prototype.isObject = function (node) {
    return node && node.type === "object";
  };
  MacroHelper.prototype.elements = function (node) {
    var _tmp;
    if (node != null && ((_tmp = node.type) === "array" || _tmp === "object")) {
      return node.value;
    }
  };
  MacroHelper.prototype.array = function (elements) {
    var _tmp, element, i;
    if (!Array.isArray(elements)) {
      throw Error("Expected an array, got " + __strnum(__typeof(elements)));
    }
    _tmp = elements.length;
    for (i = 0, __num(_tmp); i < _tmp; i = __num(i) + 1) {
      element = elements[i];
      if (!element || typeof element !== "object") {
        throw Error("Expected at object at index #" + __strnum(i) + ", got " + __strnum(__typeof(element)));
      }
    }
    return { type: "array", value: elements };
  };
  MacroHelper.prototype.object = function (elements) {
    var _tmp, element, i;
    if (!Array.isArray(elements)) {
      throw Error("Expected an array, got " + __strnum(__typeof(elements)));
    }
    _tmp = elements.length;
    for (i = 0, __num(_tmp); i < _tmp; i = __num(i) + 1) {
      element = elements[i];
      if (!element || typeof element !== "object") {
        throw Error("Expected an object at index #" + __strnum(i) + ", got " + __strnum(__typeof(element)));
      } else if (!element.key || typeof element.key !== "object") {
        throw Error("Expected an object with object 'key' at index #" + __strnum(i) + ", got " + __strnum(__typeof(element.key)));
      } else if (!element.value || typeof element.value !== "object") {
        throw Error("Expected an object with object 'value' at index #" + __strnum(i) + ", got " + __strnum(__typeof(element.value)));
      }
    }
    return { type: "object", value: elements };
  };
  MacroHelper.prototype.isComplex = function (node) {
    var _tmp;
    return node != null && (_tmp = node.type) !== "const" && _tmp !== "ident" && _tmp !== "tmp" && (node.type !== "block" || node.value.length !== 0);
  };
  MacroHelper.prototype.cache = function (node, init, save) {
    var tmp;
    if (this.isComplex(node)) {
      tmp = this.tmp(save);
      init.push({
        type: "let",
        startIndex: this.index,
        endIndex: this.index,
        value: {
          left: {
            type: "declarable",
            startIndex: this.index,
            endIndex: this.index,
            value: { ident: tmp, isMutable: false }
          },
          right: node
        }
      });
      return tmp;
    } else {
      return node;
    }
  };
  MacroHelper.prototype.empty = function (node) {
    var _this, _tmp, _tmp2;
    _this = this;
    if (node == null) {
      return true;
    } else if (typeof node !== "object") {
      return false;
    } else if (node.type === "block") {
      return _tmp = node.value, _tmp2 = _tmp.length, (function () {
        var _tmp3, item;
        for (_tmp3 = 0, __num(_tmp2); _tmp3 < _tmp2; _tmp3 = __num(_tmp3) + 1) {
          item = _tmp[_tmp3];
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
        for (i = 0, __num(len); i < len; i = __num(i) + 1) {
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
    var _tmp, _tmp2, changed, item, newItem, result;
    result = [];
    changed = false;
    _tmp = array.length;
    for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
      item = array[_tmp2];
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
    var _tmp;
    return {
      type: "array",
      startIndex: startIndex,
      endIndex: endIndex,
      value: (_tmp = array.length, (function () {
        var _tmp2, _tmp3, x;
        for (_tmp2 = [], _tmp3 = 0, __num(_tmp); _tmp3 < _tmp; _tmp3 = __num(_tmp3) + 1) {
          x = array[_tmp3];
          _tmp2.push(constifyObject(x, startIndex, endIndex));
        }
        return _tmp2;
      }()))
    };
  }
  KNOWN_HELPERS = require("./translator").knownHelpers;
  function constifyObject(obj, startIndex, endIndex) {
    if (!obj || typeof obj !== "object" || obj instanceof RegExp) {
      return { type: "const", startIndex: startIndex, endIndex: endIndex, value: obj };
    } else if (Array.isArray(obj)) {
      return constifyArray(obj, startIndex, endIndex);
    } else if (obj.type === "ident" && obj.value.charAt(0) === "$") {
      return {
        type: "callchain",
        startIndex: obj.startIndex,
        endIndex: obj.endIndex,
        value: {
          head: { type: "ident", startIndex: obj.startIndex, endIndex: obj.endIndex, value: "__wrap" },
          links: [
            {
              type: "call",
              args: [
                { type: "ident", startIndex: obj.startIndex, endIndex: obj.endIndex, value: obj.value.substring(1) }
              ],
              existential: false,
              isNew: false
            }
          ]
        }
      };
    } else if (obj.type === "ident" && __in(obj.value, KNOWN_HELPERS)) {
      return { type: "macrohelper", startIndex: obj.startIndex, endIndex: obj.endIndex, value: obj.value };
    } else if (obj.type === "macroaccess") {
      return {
        type: "callchain",
        startIndex: obj.startIndex,
        endIndex: obj.endIndex,
        value: {
          head: { type: "ident", startIndex: obj.startIndex, endIndex: obj.endIndex, value: "__macro" },
          links: [
            {
              type: "call",
              args: [
                { type: "const", startIndex: obj.startIndex, endIndex: obj.endIndex, value: obj.value.id },
                constifyObject(obj.value.data, obj.startIndex, obj.endIndex)
              ],
              existential: false,
              isNew: false
            }
          ]
        }
      };
    } else {
      return {
        type: "object",
        startIndex: startIndex,
        endIndex: endIndex,
        value: (function () {
          var _tmp, k, v;
          _tmp = [];
          for (k in obj) {
            if (__owns(obj, k)) {
              v = obj[k];
              _tmp.push({
                key: { type: "const", startIndex: startIndex, endIndex: endIndex, value: k },
                value: constifyObject(v, startIndex, endIndex)
              });
            }
          }
          return _tmp;
        }())
      };
    }
  }
  MacroHelper.constifyObject = constifyObject;
  walkers = {
    access: function (x, func) {
      return { parent: walk(x.parent, func), child: walk(x.child, func) };
    },
    "arguments": identity,
    array: walkArray,
    assign: function (x, func) {
      return { left: walk(x.left, func), right: walk(x.right, func), op: x.op };
    },
    ast: function (x, func) {
      return constifyObject(x, x.startIndex, x.endIndex);
    },
    binary: function (x, func) {
      return { left: walk(x.left, func), right: walk(x.right, func), op: x.op };
    },
    block: walkArray,
    "break": identity,
    callchain: (function () {
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
          throw Error("Unknown callchain link type: " + __strnum(link.type));
        }
        return linkTypes[link.type](link, func);
      }
      return function (x, func) {
        return { head: walk(x.head, func), links: map(x.links, walkLink, func) };
      };
    }()),
    "const": identity,
    "continue": identity,
    "debugger": identity,
    declarable: function (x, func) {
      return { ident: walk(x.ident, func), isMutable: x.isMutable };
    },
    "for": function (x, func) {
      return { init: walk(x.init, func), test: walk(x.test, func), step: walk(x.step, func), body: walk(x.body, func) };
    },
    forin: function (x, func) {
      return { key: walk(x.key, func), object: walk(x.object, func), body: walk(x.body, func) };
    },
    "function": (function () {
      var paramTypes;
      paramTypes = {
        param: function (x, func) {
          return {
            ident: walk(x.ident, func),
            defaultValue: walk(x.defaultValue, func),
            asType: walk(x.asType, func),
            spread: x.spread,
            isMutable: x.isMutable
          };
        }
      };
      function walkParam(param, func) {
        var value;
        if (!__owns(paramTypes, param.type)) {
          throw Error("Unknown param type: " + __strnum(param.type));
        }
        value = paramTypes[param.type](param.value, func);
        if (objEqual(param.value, value)) {
          return param;
        } else {
          return { type: param.type, startIndex: param.startIndex, endIndex: param.endIndex, value: value };
        }
      }
      return function (x, func) {
        return { params: map(x.params, walkParam, func), body: walk(x.body, func), autoReturn: x.autoReturn, bound: x.bound };
      };
    }()),
    ident: identity,
    "if": function (x, func) {
      return { test: walk(x.test, func), whenTrue: walk(x.whenTrue, func), whenFalse: walk(x.whenFalse, func) };
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
        if (!__owns(indexTypes, x.child.type)) {
          throw Error("Unknown index type: " + __strnum(x.child.type));
        }
        return { parent: walk(x.parent, func), child: indexTypes[x.child.type](x.child, func) };
      };
    }()),
    "let": (function () {
      var declarableTypes;
      declarableTypes = {
        declarable: function (x, func) {
          var ident;
          ident = walk(x.ident, func);
          if (ident !== x.ident) {
            return { ident: ident, isMutable: x.isMutable };
          } else {
            return x;
          }
        }
      };
      return function (x, func) {
        var left, leftValue;
        left = x.left;
        if (!__owns(declarableTypes, left.type)) {
          throw Error("Unknown let declarable type: " + __strnum(left.type));
        }
        leftValue = declarableTypes[left.type](left.value, func);
        return {
          left: leftValue === left.value ? left : { type: left.type, startIndex: left.startIndex, endIndex: left.endIndex, value: leftValue },
          right: walk(x.right, func)
        };
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
        return map(x, walkPair, func);
      };
    }()),
    paren: walk,
    regexp: function (x, func) {
      return { text: walk(x.text, func), flags: x.flags };
    },
    "return": function (x, func) {
      return { node: walk(x.node, func), existential: x.existential };
    },
    spread: walk,
    string: walkArray,
    "this": identity,
    tmp: identity,
    trycatch: function (x, func) {
      return { tryBody: walk(x.tryBody, func), catchIdent: walk(x.catchIdent, func), catchBody: walk(x.catchBody, func) };
    },
    tryfinally: function (x, func) {
      return { tryBody: walk(x.tryBody, func), finallyBody: walk(x.finallyBody, func) };
    },
    unary: function (x, func) {
      return { op: x.op, node: walk(x.node, func) };
    },
    usemacro: function (x, func) {
      return { tmps: x.tmps, node: walk(x.node, func), macroHelpers: x.macroHelpers };
    }
  };
  function walk(node, func) {
    var _tmp, value;
    if (!node || typeof node !== "object" || node instanceof RegExp) {
      return node;
    }
    if (!__owns(walkers, node.type)) {
      throw Error("Unknown node type to walk through: " + __strnum(node.type));
    }
    if ((_tmp = func(node)) != null) {
      return _tmp;
    }
    value = walkers[node.type](node.value, func);
    if (objEqual(value, node.value)) {
      return node;
    } else if (node.type === "ast") {
      return value;
    } else {
      return { type: node.type, startIndex: node.startIndex, endIndex: node.endIndex, value: value };
    }
  }
  function walkArray(array, func) {
    return map(array, walk, func);
  }
  MacroHelper.fixAsts = function (result) {
    return walk(result, function () {});
  };
  MacroHelper.wrap = function (value) {
    var _tmp, _tmp2, item, items, wrapped;
    if (value == null) {
      value = [];
    }
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return MacroHelper.wrap(value[0]);
      } else {
        items = [];
        _tmp = value.length;
        for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
          item = value[_tmp2];
          wrapped = MacroHelper.wrap(item);
          if (wrapped.type === "block") {
            items.push.apply(items, __toArray(wrapped.value));
          } else {
            items.push(wrapped);
          }
        }
        return { type: "block", startIndex: 0, endIndex: 0, value: items };
      }
    } else if (typeof value !== "object" || value instanceof RegExp) {
      throw Error("Trying to wrap a non-object: " + __strnum(__typeof(value)));
    } else {
      return value;
    }
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
        }.call(this));
      }
      return true;
    }
    return false;
  };
  mutators = {
    block: function (x, func) {
      var len;
      len = x.length;
      if (!__lte(len, 0)) {
        return __toArray(__slice(x, void 0, __num(len) - 1)).concat([this.mutateLast(x[__num(len) - 1], func)]);
      } else {
        return x;
      }
    },
    "if": function (x, func) {
      return { test: x.test, whenTrue: this.mutateLast(x.whenTrue, func), whenFalse: this.mutateLast(x.whenFalse, func) };
    },
    usemacro: function (x, func) {
      return { node: this.mutateLast(x.node, func), tmps: x.tmps, macroHelpers: x.macroHelpers };
    },
    "break": identity,
    "continue": identity,
    nothing: identity,
    "return": identity,
    "debugger": identity,
    "throw": identity
  };
  MacroHelper.prototype.mutateLast = function (node, func) {
    var _tmp, result;
    if (!node || typeof node !== "object" || node instanceof RegExp) {
      return node;
    } else if (!__owns(mutators, node.type)) {
      return (_tmp = func(node)) != null ? _tmp : node;
    } else {
      result = mutators[node.type].call(this, node.value, func);
      if (objEqual(result, node.value)) {
        return node;
      } else if (node.type === "ast") {
        return result;
      } else {
        return { type: node.type, startIndex: node.startIndex, endIndex: node.endIndex, value: result };
      }
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
        var _tmp;
        _tmp = named("<" + __strnum(name) + " macro>", function (o) {
          var _tmp2, _tmp3, _tmp4, item, result;
          _tmp2 = m.data;
          _tmp3 = _tmp2.length;
          for (_tmp4 = 0, __num(_tmp3); _tmp4 < _tmp3; _tmp4 = __num(_tmp4) + 1) {
            item = _tmp2[_tmp4];
            result = item(o);
            if (result) {
              return result;
            }
          }
          return false;
        });
        return named(_tmp != null ? _tmp.parserName : void 0, function (o) {
          var result;
          if (!token(o.clone())) {
            return false;
          } else {
            result = _tmp(o);
            if (!result) {
              throw SHORT_CIRCUIT;
            }
            return result;
          }
        });
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
  State.prototype.node = function (type, index, value) {
    return { type: type, startIndex: index, endIndex: this.index, value: value };
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
    return this.node("nothing", this.index);
  };
  macroSyntaxTypes = {
    syntax: function (index, params, body) {
      var _this, _tmp, funcParams, handler, nextParts, rawFunc, translated;
      _this = this;
      nextParts = [];
      function calcParam(param) {
        var _tmp, _tmp2, calced, choices, ident, multiplier, string, type;
        type = param.type;
        if (type === "ident") {
          ident = param.value;
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
        } else if (type === "sequence") {
          return handleParams(param.value, []);
        } else if (type === "choice") {
          choices = (_tmp = param.value, _tmp2 = _tmp.length, (function () {
            var _tmp3, _tmp4, param;
            for (_tmp3 = [], _tmp4 = 0, __num(_tmp2); _tmp4 < _tmp2; _tmp4 = __num(_tmp4) + 1) {
              param = _tmp[_tmp4];
              _tmp3.push(calcParam(param));
            }
            return _tmp3;
          }()));
          return cache(function (o) {
            var _tmp, _tmp2, result, rule;
            _tmp = choices.length;
            for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
              rule = choices[_tmp2];
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
        } else if (type === "many") {
          multiplier = param.value.multiplier;
          calced = calcParam(param.value.type);
          if (multiplier === "*") {
            return named(__strnum((calced != null ? calced.parserName : void 0) || "<nothing>") + "*", function (o) {
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
            });
          } else if (multiplier === "+") {
            return named(__strnum((calced != null ? calced.parserName : void 0) || "<nothing>") + "+", function (o) {
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
            });
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
        var _tmp, _tmp2, _tmp3, ident, key, param, string, type;
        _tmp = params.length;
        for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
          param = params[_tmp2];
          if (param.type !== "param" || !param.value.type || param.value.type.type !== "many" && (param.value.type.type !== "ident" || param.value.type.value !== "DedentedBody")) {
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
          } else if (type === "param") {
            ident = param.value.ident;
            key = ident.type === "ident" ? ident.value : ident.type === "this" ? "this" : (function () {
              throw Error("Don't know how to handle ident type: " + __strnum(ident.type));
            }.call(_this));
            type = (_tmp3 = param.value.type) != null ? _tmp3 : { type: "ident", value: "Expression" };
            sequence.push([key, calcParam(type)]);
          } else {
            _this.error("Unexpected parameter type: " + __strnum(type));
          }
        }
        return sequential(sequence);
      }
      funcParams = (_tmp = params.length, (function () {
        var _tmp2, _tmp3, param;
        for (_tmp2 = [], _tmp3 = 0, __num(_tmp); _tmp3 < _tmp; _tmp3 = __num(_tmp3) + 1) {
          param = params[_tmp3];
          if (param.type === "param") {
            _tmp2.push({
              key: _this.node("const", index, param.value.ident.value),
              value: _this.node("param", index, { ident: param.value.ident, defaultValue: void 0, spread: false })
            });
          }
        }
        return _tmp2;
      }()));
      rawFunc = this.node("root", index, this.node("return", index, {
        node: this.node("function", index, {
          params: [
            this.node("object", index, funcParams),
            this.node("param", index, { ident: this.node("ident", index, "__wrap"), defaultValue: void 0, spread: false }),
            this.node("param", index, { ident: this.node("ident", index, "__macro"), defaultValue: void 0, spread: false })
          ],
          body: body,
          autoReturn: true,
          bound: false
        }),
        existential: false
      }));
      translated = require("./translator")(rawFunc);
      handler = translated.node.toFunction()();
      if (typeof handler !== "function") {
        throw Error("Error creating function for macro: " + __strnum(this.currentMacro));
      }
      return { handler: handler, rule: handleParams(params, []), macroHelpers: translated.macroHelpers };
    },
    call: function (index, params, body) {
      var handler, rawFunc, translated;
      rawFunc = this.node("root", index, this.node("return", index, {
        node: this.node("function", index, {
          params: [
            this.node("array", index, params),
            this.node("param", index, { ident: this.node("ident", index, "__wrap"), defaultValue: void 0, spread: false }),
            this.node("param", index, { ident: this.node("ident", index, "__macro"), defaultValue: void 0, spread: false })
          ],
          body: body,
          autoReturn: true,
          bound: false
        }),
        existential: false
      }));
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
      throw Error("Unknown macroSyntax type: " + __strnum(type));
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
        return o.node("macroaccess", i, { id: macroId, data: x });
      } else {
        macroHelper = new MacroHelper(o, i, !_statement.peek());
        result = handler.call(macroHelper, x, MacroHelper.wrap, function (id, data) {
          return macros.getById(id)(data, o, i);
        });
        tmps = macroHelper.getTmps();
        return o.node("usemacro", i, { node: result, tmps: tmps.unsaved, savedTmps: tmps.saved, macroHelpers: macroHelpers });
      }
    }
    m = macros.getOrAddByName(this.currentMacro);
    func = (function () {
      var _tmp;
      _tmp = m.token;
      return (function () {
        function _tmp2(o) {
          var clone, result;
          clone = o.clone();
          result = void 0;
          if (_tmp(clone) && (result = rule(clone))) {
            o.update(clone);
            return result;
          } else {
            return false;
          }
        }
        return named(_tmp2 != null ? _tmp2.parserName : void 0, function (o) {
          var index, result;
          index = o.index;
          result = _tmp2(o);
          if (!result) {
            return false;
          } else if (typeof mutator === "function") {
            return mutator(result, o, index);
          } else if (mutator !== void 0) {
            return mutator;
          } else {
            return result;
          }
        });
      }());
    }());
    macroId = macros.addMacro(mutator);
    m.data.push(func);
  };
  return State;
}());
function unique(array) {
  var _tmp, _tmp2, item, result;
  result = [];
  _tmp = array.length;
  for (_tmp2 = 0, __num(_tmp); _tmp2 < _tmp; _tmp2 = __num(_tmp2) + 1) {
    item = array[_tmp2];
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
    return __strnum(__slice(errs, void 0, __num(len) - 1).join(", ")) + ", or " + __strnum(errs[__num(errs.length) - 1]);
  }
}
function buildErrorMessage(errors, lastToken) {
  return "Expected " + __strnum(buildExpected(errors)) + ", but " + __strnum(lastToken) + " found";
}
function parse(text, macros, options) {
  var _this, lastToken, o, position, result;
  _this = this;
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
        }.call(_this));
      }
    }
  }());
  if (!result || __lt(o.index, o.data.length)) {
    position = o.failures.position;
    lastToken = __lt(position, o.data.length) ? JSON.stringify(o.data.substring(position, __num(position) + 20)) : "end-of-input";
    throw ParserError(buildErrorMessage(o.failures.messages, lastToken), o.data, position);
  } else {
    return { result: result, macros: o.macros };
  }
}
module.exports = parse;
module.exports.ParserError = ParserError;
