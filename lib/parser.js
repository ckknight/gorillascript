"use strict";
var __cmp, __create, __in, __isArray, __lt, __lte, __num, __owns, __slice, __strnum, __toArray, __typeof, _inAst, _indexSlice, _inMacro, _Name, _NameOrSymbol, _Space, _statement, _Symbol, AccessIndexNode, AccessNode, Addition, Advance, AlphaNum, AnyChar, ArgsNode, ArgumentsLiteral, ArrayLiteral, ArrayNode, ArrayParameter, ArrayType, Assignment, AssignNode, Ast, Asterix, AsToken, AstToken, AsType, AtSign, Backslash, BackslashEscapeSequence, BackslashStringLiteral, BasicInvocationOrAccess, bB, BinaryDigit, BinaryInteger, BinaryNode, BitwiseAnd, BitwiseOr, BitwiseShift, BitwiseXor, Block, BlockNode, Body, BodyOrStatementOrNothing, Break, BreakNode, CallChainNode, CheckIndent, CheckStop, CloseCurlyBrace, ClosedArguments, CloseParenthesis, CloseSquareBracket, Colon, ColonChar, ColonEqual, Comma, CommaOrNewline, CommaOrNewlineWithCheckIndent, Comment, Comparison, ComplexAssignable, CompoundAssignment, CompoundAssignmentOp, ConstantLiteral, ConstNode, Containment, Continue, ContinueNode, CountIndent, Debugger, DebuggerNode, DecimalDigit, DecimalDigits, DecimalNumber, Declarable, DeclarableNode, DeclareEqualSymbol, DedentedBody, Def, DefineHelper, DefineHelperNode, DefineHelperStart, DefNode, DefToken, DirectAssignment, DollarSign, DoubleColon, DoubleQuote, DoubleStringLiteral, DualObjectKey, eE, EmptyLine, EmptyLines, Eof, EscapeSequence, Eval, EvalNode, EvalToken, ExistentialOr, ExistentialSymbol, ExistentialSymbolNoSpace, ExistentialUnary, Exponentiation, Expression, ExpressionAsStatement, ExpressionOrAssignment, ExpressionOrNothing, FailureManager, FalseLiteral, ForInNode, ForNode, freeze, fromCharCode, FunctionBody, FunctionDeclaration, FunctionLiteral, FunctionNode, generateCacheKey, HashSign, HexDigit, HexEscapeSequence, HexInteger, Identifier, IdentifierDeclarable, IdentifierNameConst, IdentifierNameConstOrNumberLiteral, IdentifierOrAccess, IdentifierOrAccessPart, IdentifierOrAccessStart, IdentifierOrSimpleAccess, IdentifierOrSimpleAccessPart, IdentifierOrSimpleAccessStart, IdentifierParameter, IdentNode, IfNode, inAst, InBlock, IndentedObjectLiteral, INDENTS, Index, IndexMultiple, IndexSlice, inExpression, InfinityLiteral, inIndexSlice, inMacro, inStatement, InvocationArguments, InvocationOrAccess, KeyValuePair, KvpParameter, Let, LetNode, Letter, LetToken, Line, Literal, Logic, LogicalAnd, LogicalOr, LogicalXor, LowerR, LowerU, LowerX, Macro, MacroAccessNode, MacroBody, MacroHelper, MacroHolder, MacroName, MacroSyntax, MacroSyntaxChoiceParameters, MacroSyntaxParameter, MacroSyntaxParameters, MacroSyntaxParameterType, MacroToken, Max, MaybeAdvance, MaybeAsType, MaybeComma, MaybeCommaOrNewline, MaybeComment, MaybeExistentialSymbol, MaybeExistentialSymbolNoSpace, MaybeMutableToken, MaybeNotToken, MaybeSpreadToken, Min, MinMax, Minus, MultiLineComment, Multiplication, MutableToken, Name, NameChar, NamePart, NameStart, NaNLiteral, Negate, Newline, Node, NoSpace, NotColon, Nothing, NOTHING, NothingNode, NotToken, NullLiteral, NumberLiteral, ObjectKey, ObjectKeyColon, ObjectLiteral, ObjectNode, ObjectParameter, OctalDigit, OctalInteger, oO, OpenCurlyBrace, OpenParenthesis, OpenParenthesisChar, OpenSquareBracket, OpenSquareBracketChar, Operator, OperatorNode, ParamDualObjectKey, Parameter, Parameters, ParameterSequence, ParamNode, ParamSingularObjectKey, Parenthetical, ParserError, Period, Pipe, PipeChar, Plus, PlusOrMinus, PopIndent, PrimaryExpression, PushIndent, RadixInteger, RawDecimalDigits, RegexDoubleToken, RegexFlags, RegexLiteral, RegexpNode, RegexSingleToken, Return, ReturnNode, ReturnToken, Root, RootNode, Semicolon, SemicolonChar, Shebang, SHORT_CIRCUIT, SimpleAssignable, SimpleConstantLiteral, SimpleOrArrayType, SimpleType, SingleEscapeCharacter, SingleLineComment, SingleQuote, SingleStringLiteral, SingularObjectKey, SomeEmptyLines, SomeEmptyLinesWithCheckIndent, SomeSpace, Space, SpaceChar, SpaceNewline, Spaceship, SpreadNode, SpreadOrExpression, SpreadToken, Stack, State, Statement, Stop, StringConcatenation, StringIndent, StringInterpolation, StringLiteral, StringNode, SuperInvocation, SuperNode, SuperToken, Symbol, SymbolChar, SyntaxChoiceNode, SyntaxManyNode, SyntaxParamNode, SyntaxSequenceNode, SyntaxToken, ThisLiteral, ThisNode, ThisOrShorthandLiteral, ThisOrShorthandLiteralPeriod, ThisShorthandLiteral, TmpNode, TripleDoubleQuote, TripleDoubleStringLine, TripleDoubleStringLiteral, TripleSingleQuote, TripleSingleStringLine, TripleSingleStringLiteral, TrueLiteral, TryCatchNode, TryFinallyNode, TypeArrayNode, TypeReference, TypeUnionNode, Unary, UnaryNode, UnclosedArguments, UnclosedObjectLiteral, Underscore, UnicodeEscapeSequence, UnionType, UseMacro, UseMacroNode, VoidLiteral, WhiteSpace, xX, Yield, YieldNode, YieldToken, Zero;
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
function retThis() {
  return this;
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
    throw TypeError("Expected a function, got " + __typeof(func));
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
_statement = new Stack(true);
inStatement = makeAlterStack(_statement, true);
inExpression = makeAlterStack(_statement, false);
_inMacro = new Stack(false);
inMacro = makeAlterStack(_inMacro, true);
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
          for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
    throw TypeError("Expected a function, got " + __typeof(func));
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
ColonChar = cache(named("ColonChar", named('":"', function (o) {
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
    if (ColonChar(clone) && ColonChar(clone)) {
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
        for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
      for (_arr = [], void 0; ; ) {
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
            for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          return __strnum(fromCharCode(x.e)) + __strnum(x.op !== NOTHING ? fromCharCode(x.op) : "") + __strnum(x.digits);
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
      text = __strnum(x.integer) + __strnum(decimal) + __strnum(scientific);
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
          for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
            for (_arr = [], void 0; ; ) {
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
                  for (_arr = [], void 0; ; ) {
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
                      for (_arr = [], void 0; ; ) {
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
                      for (_arr = [], void 0; ; ) {
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
                    for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
            for (_arr = [], void 0; ; ) {
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
            for (_arr = [], void 0; ; ) {
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
          } else if (!(part instanceof NothingNode)) {
            if (!__lte(currentLiteral.length, 0)) {
              stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
              currentLiteral = [];
            }
            stringParts.push(part);
          }
        }
        if (!__lte(currentLiteral.length, 0)) {
          stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
        }
        if (stringParts.length === 0) {
          return o["const"](i, "");
        } else if (stringParts.length === 1 && stringParts[0] instanceof ConstNode && typeof stringParts[0].value === "string") {
          return stringParts[0];
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
        } else if (!(part instanceof NothingNode)) {
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
              for (_arr = [], void 0; ; ) {
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
                      for (_arr = [], void 0; ; ) {
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
          var _end, _len, j, len, line, lines, part, stringParts;
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
          stringParts = [];
          for (j = 0, _len = __num(lines.length); j < _len; ++j) {
            line = lines[j];
            if (!__lte(j, 0)) {
              stringParts.push("\n");
            }
            stringParts.push.apply(stringParts, __toArray(line));
          }
          for (j = __num(stringParts.length) - 2; j > -1; --j) {
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
          } else if (stringParts.length === 1 && stringParts[0] instanceof ConstNode && typeof stringParts[0].value === "string") {
            return stringParts[0];
          } else {
            return o.string(i, stringParts);
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
              for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
        } else if (!(part instanceof NothingNode)) {
          if (!__lte(currentLiteral.length, 0)) {
            stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
            currentLiteral = [];
          }
          stringParts.push(part);
        }
      }
      if (!__lte(currentLiteral.length, 0)) {
        stringParts.push(o["const"](i, processCharCodes(currentLiteral).join("")));
      }
      flags = processCharCodes(x.flags).join("");
      text = stringParts.length === 0 ? o["const"](i, "")
        : stringParts.length === 1 && stringParts[0] instanceof ConstNode && typeof stringParts[0].value === "string" ? stringParts[0]
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
              for (_arr = [], void 0; ; ) {
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
                  for (_arr = [], void 0; ; ) {
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
Colon = cache(named("Colon", (function () {
  var _rule;
  _rule = named(
    "!" + __strnum((ColonChar != null ? ColonChar.parserName : void 0) || "<unknown>"),
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
  "!" + __strnum((Colon != null ? Colon.parserName : void 0) || "<unknown>"),
  function (o) {
    return !Colon(o.clone());
  }
)));
ObjectKeyColon = cache(named("ObjectKeyColon", function (o) {
  var clone, result;
  clone = o.clone();
  result = void 0;
  if ((result = ObjectKey(clone)) && Colon(clone)) {
    o.update(clone);
    return result;
  } else {
    return false;
  }
}));
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
        for (_arr = [], void 0; ; ) {
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
    function _rule2(o) {
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
      key = node instanceof ConstNode && typeof node.value !== "string" ? o["const"](i, String(node.value)) : node;
      return { key: key, value: node };
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
    function _rule5(o) {
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
        if (_rule6(clone) && (result = _rule7(clone)) && NotColon(clone)) {
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
    function _rule7(o) {
      var clone, result;
      clone = o.clone();
      result = void 0;
      if ((result = Parenthetical(clone)) && NotColon(clone)) {
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
              for (_arr = [], void 0; ; ) {
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
                  for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
    if (param instanceof ParamNode && param.spread) {
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
              for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
Ast = cache(named("Ast", (function () {
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
    return (function () {
      function _rule3(o) {
        var clone, result;
        clone = o.clone();
        result = void 0;
        if (_rule(clone) && AstToken(clone) && (result = _rule2(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return MacroHelper.constifyObject(x, i, o.index);
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
            for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
Macro = cache(named("Macro", inMacro((function () {
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
}()))));
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
      left: x instanceof NothingNode ? null : x.left,
      right: x instanceof NothingNode ? null : x.right
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
          for (_arr = [], void 0; ; ) {
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
        for (_arr = [], void 0; ; ) {
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
      if (Space(clone) && ColonChar(clone) && _rule(clone)) {
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
          for (_arr = [], void 0; ; ) {
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
              for (_arr = [], void 0; ; ) {
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
                  for (_arr = [], void 0; ; ) {
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
            for (_arr = [], void 0; ; ) {
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
              return "accessIndex";
            } else {
              o.update(clone);
              return "protoAccessIndex";
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
        var _rule8;
        _rule8 = named(
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
          for (_arr = [], void 0; ; ) {
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
        if ((_ref = part.type) === "protoAccess" || _ref === "protoAccessIndex") {
          links.push({
            type: "access",
            child: o["const"](i, "prototype"),
            existential: part.existential
          });
          clone = copy(part);
          clone.type = part.type === "protoAccess" ? "access" : "accessIndex";
          links.push(clone);
        } else if ((_ref = part.type) === "access" || _ref === "accessIndex") {
          links.push(part);
        } else if (part.type === "call") {
          if (isNew && part.isApply) {
            o.error("Cannot call with both new and @ at the same time");
          }
          clone = copy(part);
          clone.isNew = isNew;
          isNew = false;
          links.push(clone);
        } else if (part.type === "?") {
          if (isNew) {
            links.push({
              type: "call",
              args: [],
              existential: false,
              isNew: true,
              isApply: false
            });
            isNew = false;
          }
          links.push(part);
        } else {
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
  return BasicInvocationOrAccess(o) || SuperInvocation(o) || Eval(o);
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
        if (x.node instanceof ConstNode && typeof x.node.value === "number" && ((_ref = x.op) === "+" || _ref === "-" || _ref === "~+" || _ref === "~-")) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
    if (x instanceof BinaryNode && x.op.substring(0, 4) === "not ") {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
          for (_arr = [], void 0; ; ) {
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
DefToken = cache(named("DefToken", word("def")));
Def = cache(named("Def", (function () {
  var _backend;
  _backend = (function () {
    var _rule;
    _rule = (function () {
      var _rule2;
      _rule2 = (function () {
        var _rule3, _rule4;
        _rule3 = (function () {
          function _backend2(o) {
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
          return named(
            _backend2 != null ? _backend2.parserName : void 0,
            function (o) {
              var result;
              if (!DeclareEqualSymbol(o.clone())) {
                return false;
              } else {
                result = _backend2(o);
                if (!result) {
                  throw SHORT_CIRCUIT;
                }
                return result;
              }
            }
          );
        }());
        _rule4 = named(
          FunctionDeclaration != null ? FunctionDeclaration.parserName : void 0,
          function (o) {
            var result;
            if (!OpenParenthesisChar(o.clone())) {
              return false;
            } else {
              result = FunctionDeclaration(o);
              if (!result) {
                throw SHORT_CIRCUIT;
              }
              return result;
            }
          }
        );
        return function (o) {
          return _rule3(o) || _rule4(o);
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
        if (DefToken(clone) && (result.left = ObjectKey(clone)) && (result.right = _rule(clone))) {
          o.update(clone);
          return result;
        } else {
          return false;
        }
      }
      function _mutator(x, o, i) {
        return o.def(i, x.left, x.right === NOTHING ? void 0 : x.right);
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
      if (!DefToken(o.clone())) {
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
    return Let(o) || Def(o) || Return(o) || Yield(o) || Break(o) || Continue(o) || Macro(o) || DefineHelper(o) || Assignment(o) || ExpressionAsStatement(o);
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
          for (_arr = [], void 0; ; ) {
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
        if (item instanceof BlockNode) {
          nodes.push.apply(nodes, __toArray(item.nodes));
        } else if (!(item instanceof NothingNode)) {
          nodes.push(item);
        }
      }
      if (nodes.length === 0) {
        return o.nothing(i);
      } else if (nodes.length === 1) {
        return nodes[0];
      } else {
        return o.block(i, nodes);
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
  var getTmpId, mutators;
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
      unsaved: __slice(this.unsavedTmps, void 0, void 0),
      saved: __slice(this.savedTmps, void 0, void 0)
    };
  };
  MacroHelper.prototype.isConst = function (node) {
    return node === void 0 || typeof node !== "undefined" && node !== null && (node instanceof ConstNode || node instanceof BlockNode && node.nodes.length === 0);
  };
  MacroHelper.prototype.value = function (node) {
    if (node === void 0) {
      return;
    } else if (typeof node !== "undefined" && node !== null) {
      if (node instanceof ConstNode) {
        return node.value;
      } else if (node instanceof BlockNode && node.nodes.length === 0) {
        return;
      }
    }
  };
  MacroHelper.prototype["const"] = function (value) {
    return this.state["const"](this.index, value);
  };
  MacroHelper.prototype.isIdent = function (node) {
    return node instanceof IdentNode;
  };
  MacroHelper.prototype.name = function (node) {
    if (this.isIdent(node)) {
      return node.name;
    }
  };
  MacroHelper.prototype.ident = function (name) {
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    if (require("./ast").isAcceptableIdent(name)) {
      return this.state.ident(this.index, name);
    }
  };
  MacroHelper.prototype.isCall = function (node) {
    var links;
    if (node instanceof CallChainNode) {
      links = node.links;
      return links[__num(links.length) - 1].type === "call";
    } else {
      return false;
    }
  };
  MacroHelper.prototype.callFunc = function (node) {
    var links;
    if (node instanceof CallChainNode) {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        if (links.length === 1) {
          return node.head;
        } else {
          return CallChainNode(node.startIndex, node.endIndex, node.head, __slice(links, void 0, __num(links.length) - 1));
        }
      }
    }
  };
  MacroHelper.prototype.callArgs = function (node) {
    var links;
    if (node instanceof CallChainNode) {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        return links[__num(links.length) - 1].args;
      }
    }
  };
  MacroHelper.prototype.isSuper = function (node) {
    return node instanceof SuperNode;
  };
  MacroHelper.prototype.superChild = function (node) {
    if (this.isSuper(node)) {
      return node.child;
    }
  };
  MacroHelper.prototype.superArgs = function (node) {
    if (this.isSuper(node)) {
      return node.args;
    }
  };
  MacroHelper.prototype.callIsNew = function (node) {
    var links;
    if (node instanceof CallChainNode) {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        return !!links[__num(links.length) - 1].isNew;
      }
    }
    return false;
  };
  MacroHelper.prototype.callIsApply = function (node) {
    var links;
    if (node instanceof CallChainNode) {
      links = node.links;
      if (links[__num(links.length) - 1].type === "call") {
        return !!links[__num(links.length) - 1].isApply;
      }
    }
    return false;
  };
  MacroHelper.prototype.call = function (func, args, isNew, isApply) {
    var _i, _len;
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
    if (isNew && isApply) {
      throw Error("Cannot specify both is-new and is-apply");
    }
    if (func instanceof CallChainNode) {
      return this.state.callChain(func.startIndex, func.head, __toArray(func.links).concat([{ type: "call", args: args, isNew: isNew, isApply: isApply }]));
    } else {
      return this.state.callChain(func.startIndex, func, [{ type: "call", args: args, isNew: isNew, isApply: isApply }]);
    }
  };
  MacroHelper.prototype.func = function (params, body, autoReturn, bound) {
    if (autoReturn == null) {
      autoReturn = true;
    }
    if (bound == null) {
      bound = false;
    }
    return this.state["function"](
      0,
      params,
      body,
      autoReturn,
      bound
    );
  };
  MacroHelper.prototype.isFunc = function (node) {
    return node instanceof FunctionNode;
  };
  MacroHelper.prototype.funcBody = function (node) {
    if (this.isFunc(node)) {
      return node.body;
    }
  };
  MacroHelper.prototype.funcParams = function (node) {
    if (this.isFunc(node)) {
      return node.params;
    }
  };
  MacroHelper.prototype.funcIsAutoReturn = function (node) {
    if (this.isFunc(node)) {
      return !!node.autoReturn;
    }
  };
  MacroHelper.prototype.funcIsBound = function (node) {
    if (this.isFunc(node)) {
      return !!node.bound;
    }
  };
  MacroHelper.prototype.param = function (ident, defaultValue, spread, isMutable, asType) {
    return this.state.param(
      0,
      ident,
      defaultValue,
      spread,
      isMutable,
      asType
    );
  };
  MacroHelper.prototype.isParam = function (node) {
    return node instanceof ParamNode;
  };
  MacroHelper.prototype.paramIdent = function (node) {
    if (this.isParam(node)) {
      return node.ident;
    }
  };
  MacroHelper.prototype.paramDefaultValue = function (node) {
    if (this.isParam(node)) {
      return node.defaultValue;
    }
  };
  MacroHelper.prototype.paramIsSpread = function (node) {
    if (this.isParam(node)) {
      return !!node.spread;
    }
  };
  MacroHelper.prototype.paramIsMutable = function (node) {
    if (this.isParam(node)) {
      return !!node.isMutable;
    }
  };
  MacroHelper.prototype.paramType = function (node) {
    if (this.isParam(node)) {
      return node.asType;
    }
  };
  MacroHelper.prototype.isArray = function (node) {
    return node instanceof ArrayNode;
  };
  MacroHelper.prototype.elements = function (node) {
    if (this.isArray(node)) {
      return node.elements;
    }
  };
  MacroHelper.prototype.isObject = function (node) {
    return node instanceof ObjectNode;
  };
  MacroHelper.prototype.pairs = function (node) {
    if (this.isObject(node)) {
      return node.pairs;
    }
  };
  MacroHelper.prototype.isBlock = function (node) {
    return node instanceof BlockNode;
  };
  MacroHelper.prototype.nodes = function (node) {
    if (this.isBlock(node)) {
      return node.nodes;
    }
  };
  MacroHelper.prototype.array = function (elements) {
    return this.state.array(0, elements);
  };
  MacroHelper.prototype.object = function (pairs) {
    var _len, i, pair;
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
    return this.state.object(0, pairs);
  };
  MacroHelper.prototype.isComplex = function (node) {
    return typeof node !== "undefined" && node !== null && !(node instanceof ConstNode) && !(node instanceof IdentNode) && !(node instanceof TmpNode) && (!(node instanceof BlockNode) || node.nodes.length !== 0);
  };
  MacroHelper.prototype.isTypeArray = function (node) {
    return node instanceof TypeArrayNode;
  };
  MacroHelper.prototype.subtype = function (node) {
    return this.isTypeArray(node) && node.subtype;
  };
  MacroHelper.prototype.isThis = function (node) {
    return node instanceof ThisNode;
  };
  MacroHelper.prototype.isArguments = function (node) {
    return node instanceof ArgsNode;
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
      init.push(this.state["let"](
        this.index,
        this.state.declarable(this.index, tmp, false),
        node
      ));
      return tmp;
    } else {
      return node;
    }
  };
  MacroHelper.prototype.empty = function (node) {
    var _this;
    _this = this;
    if (typeof node === "undefined" || node === null) {
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
    } else if (obj instanceof IdentNode && obj.name.charCodeAt(0) === 36) {
      return CallChainNode(
        obj.startIndex,
        obj.endIndex,
        IdentNode(obj.startIndex, obj.endIndex, "__wrap"),
        [
          {
            type: "call",
            args: [IdentNode(obj.startIndex, obj.endIndex, obj.name.substring(1))],
            existential: false,
            isNew: false,
            isApply: false
          }
        ]
      );
    } else if (obj instanceof IdentNode && __in(obj.name, require("./translator").knownHelpers)) {
      return MacroHelperNode(obj.startIndex, obj.endIndex, obj.name);
    } else if (obj instanceof MacroAccessNode) {
      return CallChainNode(
        obj.startIndex,
        obj.endIndex,
        IdentNode(obj.startIndex, obj.endIndex, "__macro"),
        [
          {
            type: "call",
            args: [
              ConstNode(obj.startIndex, obj.endIndex, obj.id),
              constifyObject(obj.data, obj.startIndex, obj.endIndex)
            ],
            existential: false,
            isNew: false,
            isApply: false
          }
        ]
      );
    } else if (obj instanceof Node) {
      if (obj.constructor === Node) {
        throw Error("Cannot constify a raw node");
      }
      return CallChainNode(
        obj.startIndex,
        obj.endIndex,
        IdentNode(obj.startIndex, obj.endIndex, "__node"),
        [
          {
            type: "call",
            args: [
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
          }
        ]
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
    if (!(node instanceof BlockNode)) {
      if ((_ref = func(node)) != null) {
        return _ref;
      }
    }
    return node.walk(function (x) {
      return walk(x, func);
    });
  }
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
          if (wrapped instanceof BlockNode) {
            nodes.push.apply(nodes, __toArray(wrapped.nodes));
          } else {
            nodes.push(wrapped);
          }
        }
        return BlockNode(0, 0, nodes);
      }
    } else if (typeof value !== "object" || value instanceof RegExp) {
      throw Error("Trying to wrap a non-object: " + __typeof(value));
    } else {
      return value;
    }
  };
  MacroHelper.node = function (type, startIndex, endIndex) {
    var args;
    args = __slice(arguments, 3);
    return Node[type].apply(Node, [startIndex, endIndex].concat(__toArray(args)));
  };
  MacroHelper.prototype.isDef = function (node) {
    return node instanceof DefNode;
  };
  MacroHelper.prototype.isAssign = function (node) {
    return node instanceof AssignNode;
  };
  MacroHelper.prototype.isLet = function (node) {
    return node instanceof LetNode;
  };
  MacroHelper.prototype.isBinary = function (node) {
    return node instanceof BinaryNode;
  };
  MacroHelper.prototype.isUnary = function (node) {
    return node instanceof UnaryNode;
  };
  MacroHelper.prototype.op = function (node) {
    if (this.isAssign(node) || this.isBinary(node) || this.isUnary(node)) {
      return node.op;
    }
  };
  MacroHelper.prototype.left = function (node) {
    if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
      return node.left;
    }
  };
  MacroHelper.prototype.right = function (node) {
    if (this.isDef(node) || this.isLet(node) || this.isBinary(node)) {
      return node.right;
    }
  };
  MacroHelper.prototype.unaryNode = function (node) {
    if (this.isUnary(node)) {
      return node.node;
    }
  };
  MacroHelper.prototype.isAccess = function (node) {
    return node instanceof AccessNode;
  };
  MacroHelper.prototype.parent = function (node) {
    if (this.isAccess(node)) {
      return node.parent;
    }
  };
  MacroHelper.prototype.child = function (node) {
    if (this.isAccess(node)) {
      return node.child;
    }
  };
  MacroHelper.prototype.walk = function (node, func) {
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return walk(node, func);
  };
  MacroHelper.prototype.hasFunc = function (node) {
    var FOUND;
    FOUND = {};
    try {
      walk(node, function (x) {
        if (x instanceof FunctionNode) {
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
    UseMacro: function (x, func) {
      var node;
      node = this.mutateLast(x.node, func);
      if (node !== x.node) {
        return UseMacroNode(
          x.startIndex,
          x.endIndex,
          node,
          x.tmps,
          x.macroHelpers
        );
      } else {
        return x;
      }
    },
    Break: identity,
    Continue: identity,
    Nothing: identity,
    Return: identity,
    Debugger: identity,
    Throw: identity
  };
  MacroHelper.prototype.mutateLast = function (node, func) {
    var _ref;
    if (!node || typeof node !== "object" || node instanceof RegExp) {
      return node;
    }
    if (!(node instanceof Node)) {
      throw Error("Unexpected type to mutate-last through: " + __typeof(node));
    }
    if (!__owns(mutators, node.constructor.cappedName)) {
      return (_ref = func(node)) != null ? _ref : node;
    } else {
      return mutators[node.constructor.cappedName].call(this, node, func);
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
Node = (function () {
  function Node() {
    throw Error("Node should not be instantiated directly");
  }
  return Node;
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
        var calced, choices, ident, multiplier, string;
        if (param instanceof IdentNode) {
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
          } else if (ident === "SimpleAssignable") {
            return SimpleAssignable;
          } else if (ident === "Declarable") {
            return Declarable;
          } else if (ident === "Parameter") {
            return Parameter;
          } else if (ident === "ObjectLiteral") {
            return ObjectLiteral;
          } else if (ident === "ArrayLiteral") {
            return ArrayLiteral;
          } else if (ident === "DedentedBody") {
            return DedentedBody;
          } else {
            return _this.error("Unexpected type ident: " + __strnum(ident));
          }
        } else if (param instanceof SyntaxSequenceNode) {
          return handleParams(param.params, []);
        } else if (param instanceof SyntaxChoiceNode) {
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
        } else if (param instanceof ConstNode) {
          string = param.value;
          if (typeof string !== "string") {
            _this.error("Expected a constant string parameter, got " + __typeof(string));
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
        } else if (param instanceof SyntaxManyNode) {
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
          return _this.error("Unexpected type: " + __typeof(param));
        }
      }
      function handleParams(params, sequence) {
        var _i, _len, _ref, ident, key, param, string, type;
        for (_i = 0, _len = __num(params.length); _i < _len; ++_i) {
          param = params[_i];
          if (!(param instanceof SyntaxParamNode) || !param.asType || !(param.asType instanceof SyntaxManyNode) && (!(param.asType instanceof IdentNode) || param.asType.name !== "DedentedBody")) {
            sequence.push.apply(sequence, __toArray(nextParts));
            nextParts = [];
          }
          if (param instanceof ConstNode) {
            string = param.value;
            if (typeof string !== "string") {
              _this.error("Expected a constant string parameter, got " + __typeof(string));
            }
            if (string === ",") {
              sequence.push(Comma);
            } else if (string === ";") {
              sequence.push(Semicolon);
            } else {
              sequence.push(wordOrSymbol(string));
            }
          } else if (param instanceof SyntaxParamNode) {
            ident = param.ident;
            key = ident instanceof IdentNode ? ident.name
              : ident instanceof ThisNode ? "this"
              : (function () {
                throw Error("Don't know how to handle ident type: " + __typeof(ident));
              }());
            type = (_ref = param.asType) != null ? _ref : IdentNode(0, 0, "Expression");
            sequence.push([key, calcParam(type)]);
          } else {
            _this.error("Unexpected parameter type: " + __typeof(param));
          }
        }
        return sequential(sequence);
      }
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
      throw TypeError("Expected params to be an array, got " + __typeof(params));
    } else if (!body || typeof body !== "object" || body instanceof RegExp) {
      throw TypeError("Expected body to be an object, got " + __typeof(body));
    }
    if (!__owns(macroSyntaxTypes, type)) {
      throw Error("Unknown macro-syntax type: " + __strnum(type));
    }
    if (!this.currentMacro) {
      this.error("Attempting to specify a macro syntax when not in a macro");
    }
    data = macroSyntaxTypes[type].call(this, index, params, body);
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
  State.addNodeFactory = function (name, type) {
    State.prototype[name] = function (index) {
      return type.apply(void 0, [index, this.index].concat(__slice(arguments, 1, void 0)));
    };
  };
  return State;
}());
AccessNode = Node.Access = (function () {
  function AccessNode(startIndex, endIndex, parent, child) {
    var self;
    if (!(parent instanceof Node)) {
      throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
    }
    if (!(child instanceof Node)) {
      throw TypeError("Expected child to be a Node, got " + __typeof(child));
    }
    self = __create(AccessNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.parent = parent;
    self.child = child;
    return self;
  }
  AccessNode.prototype = __create(Node.prototype);
  AccessNode.prototype.constructor = AccessNode;
  AccessNode.cappedName = "Access";
  AccessNode.argNames = ["parent", "child"];
  State.addNodeFactory("access", AccessNode);
  AccessNode.prototype.walk = function (f) {
    var child, parent;
    parent = f(this.parent);
    child = f(this.child);
    if (parent !== this.parent || child !== this.child) {
      return AccessNode(this.startIndex, this.endIndex, parent, child);
    } else {
      return this;
    }
  };
  return AccessNode;
}());
AccessIndexNode = Node.AccessIndex = (function () {
  function AccessIndexNode(startIndex, endIndex, parent, child) {
    var self;
    if (!(parent instanceof Node)) {
      throw TypeError("Expected parent to be a Node, got " + __typeof(parent));
    }
    if (!(child instanceof Object)) {
      throw TypeError("Expected child to be a Object, got " + __typeof(child));
    }
    self = __create(AccessIndexNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.parent = parent;
    self.child = child;
    return self;
  }
  AccessIndexNode.prototype = __create(Node.prototype);
  AccessIndexNode.prototype.constructor = AccessIndexNode;
  AccessIndexNode.cappedName = "AccessIndex";
  AccessIndexNode.argNames = ["parent", "child"];
  State.addNodeFactory("accessIndex", AccessIndexNode);
  AccessIndexNode.prototype.walk = (function () {
    var indexTypes;
    indexTypes = {
      single: function (x, f) {
        var node;
        node = f(x.node);
        if (node !== x.node) {
          return { type: "single", node: node };
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
  return AccessIndexNode;
}());
ArgsNode = Node.Args = (function () {
  function ArgsNode(startIndex, endIndex) {
    var self;
    self = __create(ArgsNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  ArgsNode.prototype = __create(Node.prototype);
  ArgsNode.prototype.constructor = ArgsNode;
  ArgsNode.cappedName = "Args";
  ArgsNode.argNames = [];
  State.addNodeFactory("args", ArgsNode);
  ArgsNode.prototype.walk = retThis;
  return ArgsNode;
}());
ArrayNode = Node.Array = (function () {
  function ArrayNode(startIndex, endIndex, elements) {
    var _i, _len, self;
    if (!__isArray(elements)) {
      throw TypeError("Expected elements to be an Array, got " + __typeof(elements));
    } else {
      for (_i = 0, _len = elements.length; _i < _len; ++_i) {
        if (!(elements[_i] instanceof Node)) {
          throw TypeError("Expected elements[" + _i + "] to be a Node, got " + __typeof(elements[_i]));
        }
      }
    }
    self = __create(ArrayNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.elements = elements;
    return self;
  }
  ArrayNode.prototype = __create(Node.prototype);
  ArrayNode.prototype.constructor = ArrayNode;
  ArrayNode.cappedName = "Array";
  ArrayNode.argNames = ["elements"];
  State.addNodeFactory("array", ArrayNode);
  ArrayNode.prototype.walk = function (f) {
    var elements;
    elements = map(this.elements, f);
    if (elements !== this.elements) {
      return ArrayNode(this.startIndex, this.endIndex, elements);
    } else {
      return this;
    }
  };
  return ArrayNode;
}());
State.prototype.arrayParam = State.prototype.array;
AssignNode = Node.Assign = (function () {
  function AssignNode(startIndex, endIndex, left, op, right) {
    var self;
    if (!(left instanceof Node)) {
      throw TypeError("Expected left to be a Node, got " + __typeof(left));
    }
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(right instanceof Node)) {
      throw TypeError("Expected right to be a Node, got " + __typeof(right));
    }
    self = __create(AssignNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.left = left;
    self.op = op;
    self.right = right;
    return self;
  }
  AssignNode.prototype = __create(Node.prototype);
  AssignNode.prototype.constructor = AssignNode;
  AssignNode.cappedName = "Assign";
  AssignNode.argNames = ["left", "op", "right"];
  State.addNodeFactory("assign", AssignNode);
  AssignNode.prototype.walk = function (f) {
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
  return AssignNode;
}());
BinaryNode = Node.Binary = (function () {
  function BinaryNode(startIndex, endIndex, left, op, right) {
    var self;
    if (!(left instanceof Node)) {
      throw TypeError("Expected left to be a Node, got " + __typeof(left));
    }
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(right instanceof Node)) {
      throw TypeError("Expected right to be a Node, got " + __typeof(right));
    }
    self = __create(BinaryNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.left = left;
    self.op = op;
    self.right = right;
    return self;
  }
  BinaryNode.prototype = __create(Node.prototype);
  BinaryNode.prototype.constructor = BinaryNode;
  BinaryNode.cappedName = "Binary";
  BinaryNode.argNames = ["left", "op", "right"];
  State.addNodeFactory("binary", BinaryNode);
  BinaryNode.prototype.walk = function (f) {
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
  return BinaryNode;
}());
BlockNode = Node.Block = (function () {
  function BlockNode(startIndex, endIndex, nodes) {
    var _i, _len, self;
    if (!__isArray(nodes)) {
      throw TypeError("Expected nodes to be an Array, got " + __typeof(nodes));
    } else {
      for (_i = 0, _len = nodes.length; _i < _len; ++_i) {
        if (!(nodes[_i] instanceof Node)) {
          throw TypeError("Expected nodes[" + _i + "] to be a Node, got " + __typeof(nodes[_i]));
        }
      }
    }
    self = __create(BlockNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.nodes = nodes;
    return self;
  }
  BlockNode.prototype = __create(Node.prototype);
  BlockNode.prototype.constructor = BlockNode;
  BlockNode.cappedName = "Block";
  BlockNode.argNames = ["nodes"];
  State.addNodeFactory("block", BlockNode);
  BlockNode.prototype.walk = function (f) {
    var nodes;
    nodes = map(this.nodes, f);
    if (nodes !== this.nodes) {
      return BlockNode(this.startIndex, this.endIndex, nodes);
    } else {
      return this;
    }
  };
  return BlockNode;
}());
BreakNode = Node.Break = (function () {
  function BreakNode(startIndex, endIndex) {
    var self;
    self = __create(BreakNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  BreakNode.prototype = __create(Node.prototype);
  BreakNode.prototype.constructor = BreakNode;
  BreakNode.cappedName = "Break";
  BreakNode.argNames = [];
  State.addNodeFactory("break", BreakNode);
  BreakNode.prototype.walk = retThis;
  return BreakNode;
}());
CallChainNode = Node.CallChain = (function () {
  function CallChainNode(startIndex, endIndex, head, links) {
    var self;
    if (!(head instanceof Node)) {
      throw TypeError("Expected head to be a Node, got " + __typeof(head));
    }
    if (!__isArray(links)) {
      throw TypeError("Expected links to be a Array, got " + __typeof(links));
    }
    self = __create(CallChainNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.head = head;
    self.links = links;
    return self;
  }
  CallChainNode.prototype = __create(Node.prototype);
  CallChainNode.prototype.constructor = CallChainNode;
  CallChainNode.cappedName = "CallChain";
  CallChainNode.argNames = ["head", "links"];
  State.addNodeFactory("callChain", CallChainNode);
  CallChainNode.prototype.walk = (function () {
    var linkTypes;
    linkTypes = {
      access: function (link, func) {
        var child;
        child = func(link.child);
        if (child !== link.child) {
          return { type: "access", child: child, existential: link.existential };
        } else {
          return link;
        }
      },
      accessIndex: (function () {
        var indexTypes;
        indexTypes = {
          single: function (x, func) {
            var node;
            node = func(x.node);
            if (node !== x.node) {
              return { type: "single", node: node };
            } else {
              return x;
            }
          },
          slice: function (x, func) {
            var left, right;
            left = func(x.left);
            right = func(x.right);
            if (left !== x.left || right !== x.right) {
              return { type: "slice", left: left, right: right };
            } else {
              return x;
            }
          },
          multi: function (x, func) {
            var elements;
            elements = map(x.elements, func);
            if (elements !== x.elements) {
              return { type: "multi", elements: elements };
            } else {
              return x;
            }
          }
        };
        return function (link, func) {
          var child, type;
          type = link.child.type;
          if (!__owns(indexTypes, type)) {
            throw Error("Unknown index type: " + __strnum(type));
          }
          child = indexTypes[type](link.child, func);
          if (child !== link.child) {
            return { type: "accessIndex", child: child, existential: x.existential };
          } else {
            return link;
          }
        };
      }()),
      call: function (link, func) {
        var args;
        args = map(link.args, func);
        if (args !== link.args) {
          return {
            type: "call",
            args: args,
            existential: link.existential,
            isNew: link.isNew,
            isApply: link.isApply
          };
        } else {
          return link;
        }
      }
    };
    function walkLink(link, func) {
      if (!__owns(linkTypes, link.type)) {
        throw Error("Unknown call-chain link type: " + __strnum(link.type));
      }
      return linkTypes[link.type](link, func);
    }
    return function (func) {
      var head, links;
      head = func(this.head);
      links = map(this.links, walkLink, func);
      if (head !== this.head || links !== this.links) {
        return CallChainNode(this.startIndex, this.endIndex, head, links);
      } else {
        return this;
      }
    };
  }());
  return CallChainNode;
}());
ConstNode = Node.Const = (function () {
  function ConstNode(startIndex, endIndex, value) {
    var self;
    if (value != null && typeof value !== "number" && typeof value !== "string" && typeof value !== "boolean" && !(value instanceof RegExp)) {
      throw TypeError("Expected value to be a Number or String or Boolean or RegExp or undefined or null, got " + __typeof(value));
    }
    self = __create(ConstNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.value = value;
    return self;
  }
  ConstNode.prototype = __create(Node.prototype);
  ConstNode.prototype.constructor = ConstNode;
  ConstNode.cappedName = "Const";
  ConstNode.argNames = ["value"];
  State.addNodeFactory("const", ConstNode);
  ConstNode.prototype.walk = function (f) {
    return this;
  };
  return ConstNode;
}());
ContinueNode = Node.Continue = (function () {
  function ContinueNode(startIndex, endIndex) {
    var self;
    self = __create(ContinueNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  ContinueNode.prototype = __create(Node.prototype);
  ContinueNode.prototype.constructor = ContinueNode;
  ContinueNode.cappedName = "Continue";
  ContinueNode.argNames = [];
  State.addNodeFactory("continue", ContinueNode);
  ContinueNode.prototype.walk = retThis;
  return ContinueNode;
}());
DebuggerNode = Node.Debugger = (function () {
  function DebuggerNode(startIndex, endIndex) {
    var self;
    self = __create(DebuggerNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  DebuggerNode.prototype = __create(Node.prototype);
  DebuggerNode.prototype.constructor = DebuggerNode;
  DebuggerNode.cappedName = "Debugger";
  DebuggerNode.argNames = [];
  State.addNodeFactory("debugger", DebuggerNode);
  DebuggerNode.prototype.walk = retThis;
  return DebuggerNode;
}());
DeclarableNode = Node.Declarable = (function () {
  function DeclarableNode(startIndex, endIndex, ident, isMutable) {
    var self;
    if (!(ident instanceof Node)) {
      throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
    }
    if (isMutable == null) {
      isMutable = false;
    } else if (typeof isMutable !== "boolean") {
      throw TypeError("Expected isMutable to be a Boolean, got " + __typeof(isMutable));
    }
    self = __create(DeclarableNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.ident = ident;
    self.isMutable = isMutable;
    return self;
  }
  DeclarableNode.prototype = __create(Node.prototype);
  DeclarableNode.prototype.constructor = DeclarableNode;
  DeclarableNode.cappedName = "Declarable";
  DeclarableNode.argNames = ["ident", "isMutable"];
  State.addNodeFactory("declarable", DeclarableNode);
  DeclarableNode.prototype.walk = function (f) {
    var ident;
    ident = f(this.ident);
    if (ident !== this.ident) {
      return DeclarableNode(this.startIndex, this.endIndex, ident, this.isMutable);
    } else {
      return this;
    }
  };
  return DeclarableNode;
}());
DefNode = Node.Def = (function () {
  function DefNode(startIndex, endIndex, left, right) {
    var self;
    if (!(left instanceof Node)) {
      throw TypeError("Expected left to be a Node, got " + __typeof(left));
    }
    if (right == null) {
      right = void 0;
    } else if (!(right instanceof Node)) {
      throw TypeError("Expected right to be a Node or undefined, got " + __typeof(right));
    }
    self = __create(DefNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.left = left;
    self.right = right;
    return self;
  }
  DefNode.prototype = __create(Node.prototype);
  DefNode.prototype.constructor = DefNode;
  DefNode.cappedName = "Def";
  DefNode.argNames = ["left", "right"];
  State.addNodeFactory("def", DefNode);
  DefNode.prototype.walk = function (func) {
    var left, right;
    left = func(this.left);
    right = this.right != null ? func(this.right) : this.right;
    if (left !== this.left || right !== this.right) {
      return DefNode(this.startIndex, this.endIndex, left, right);
    } else {
      return this;
    }
  };
  return DefNode;
}());
DefineHelperNode = Node.DefineHelper = (function () {
  function DefineHelperNode(startIndex, endIndex, name, value) {
    var self;
    if (!(name instanceof Node)) {
      throw TypeError("Expected name to be a Node, got " + __typeof(name));
    }
    if (!(value instanceof Node)) {
      throw TypeError("Expected value to be a Node, got " + __typeof(value));
    }
    self = __create(DefineHelperNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.name = name;
    self.value = value;
    return self;
  }
  DefineHelperNode.prototype = __create(Node.prototype);
  DefineHelperNode.prototype.constructor = DefineHelperNode;
  DefineHelperNode.cappedName = "DefineHelper";
  DefineHelperNode.argNames = ["name", "value"];
  State.addNodeFactory("defineHelper", DefineHelperNode);
  DefineHelperNode.prototype.walk = function (f) {
    var name, value;
    name = f(this.name);
    value = f(this.value);
    if (name !== this.name || value !== this.value) {
      return DefineHelperNode(this.startIndex, this.endIndex, name, value);
    } else {
      return this;
    }
  };
  return DefineHelperNode;
}());
EvalNode = Node.Eval = (function () {
  function EvalNode(startIndex, endIndex, code) {
    var self;
    if (!(code instanceof Node)) {
      throw TypeError("Expected code to be a Node, got " + __typeof(code));
    }
    self = __create(EvalNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.code = code;
    return self;
  }
  EvalNode.prototype = __create(Node.prototype);
  EvalNode.prototype.constructor = EvalNode;
  EvalNode.cappedName = "Eval";
  EvalNode.argNames = ["code"];
  State.addNodeFactory("eval", EvalNode);
  EvalNode.prototype.walk = function (f) {
    var code;
    code = f(this.code);
    if (code !== this.code) {
      return EvalNode(this.startIndex, this.endIndex, code);
    } else {
      return this;
    }
  };
  return EvalNode;
}());
ForNode = Node.For = (function () {
  function ForNode(startIndex, endIndex, init, test, step, body) {
    var self;
    if (init == null) {
      init = NothingNode(0, 0);
    } else if (!(init instanceof Node)) {
      throw TypeError("Expected init to be a Node, got " + __typeof(init));
    }
    if (test == null) {
      test = ConstNode(0, 0, true);
    } else if (!(test instanceof Node)) {
      throw TypeError("Expected test to be a Node, got " + __typeof(test));
    }
    if (step == null) {
      step = NothingNode(0, 0);
    } else if (!(step instanceof Node)) {
      throw TypeError("Expected step to be a Node, got " + __typeof(step));
    }
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = __create(ForNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.init = init;
    self.test = test;
    self.step = step;
    self.body = body;
    return self;
  }
  ForNode.prototype = __create(Node.prototype);
  ForNode.prototype.constructor = ForNode;
  ForNode.cappedName = "For";
  ForNode.argNames = ["init", "test", "step", "body"];
  State.addNodeFactory("for", ForNode);
  ForNode.prototype.walk = function (f) {
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
  return ForNode;
}());
ForInNode = Node.ForIn = (function () {
  function ForInNode(startIndex, endIndex, key, object, body) {
    var self;
    if (!(key instanceof Node)) {
      throw TypeError("Expected key to be a Node, got " + __typeof(key));
    }
    if (!(object instanceof Node)) {
      throw TypeError("Expected object to be a Node, got " + __typeof(object));
    }
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = __create(ForInNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.key = key;
    self.object = object;
    self.body = body;
    return self;
  }
  ForInNode.prototype = __create(Node.prototype);
  ForInNode.prototype.constructor = ForInNode;
  ForInNode.cappedName = "ForIn";
  ForInNode.argNames = ["key", "object", "body"];
  State.addNodeFactory("forIn", ForInNode);
  ForInNode.prototype.walk = function (f) {
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
  return ForInNode;
}());
FunctionNode = Node.Function = (function () {
  function FunctionNode(startIndex, endIndex, params, body, autoReturn, bound) {
    var _i, _len, self;
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
    } else if (typeof bound !== "boolean") {
      throw TypeError("Expected bound to be a Boolean, got " + __typeof(bound));
    }
    self = __create(FunctionNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.params = params;
    self.body = body;
    self.autoReturn = autoReturn;
    self.bound = bound;
    return self;
  }
  FunctionNode.prototype = __create(Node.prototype);
  FunctionNode.prototype.constructor = FunctionNode;
  FunctionNode.cappedName = "Function";
  FunctionNode.argNames = ["params", "body", "autoReturn", "bound"];
  State.addNodeFactory("function", FunctionNode);
  FunctionNode.prototype.walk = function (f) {
    var body, params;
    params = map(this.params, f);
    body = f(this.body);
    if (params !== this.params || body !== this.body) {
      return FunctionNode(
        this.startIndex,
        this.endIndex,
        params,
        body,
        this.autoReturn,
        this.bound
      );
    } else {
      return this;
    }
  };
  return FunctionNode;
}());
IdentNode = Node.Ident = (function () {
  function IdentNode(startIndex, endIndex, name) {
    var self;
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    self = __create(IdentNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.name = name;
    return self;
  }
  IdentNode.prototype = __create(Node.prototype);
  IdentNode.prototype.constructor = IdentNode;
  IdentNode.cappedName = "Ident";
  IdentNode.argNames = ["name"];
  State.addNodeFactory("ident", IdentNode);
  IdentNode.prototype.walk = function (f) {
    return this;
  };
  return IdentNode;
}());
IfNode = Node.If = (function () {
  function IfNode(startIndex, endIndex, test, whenTrue, whenFalse) {
    var self;
    if (!(test instanceof Node)) {
      throw TypeError("Expected test to be a Node, got " + __typeof(test));
    }
    if (!(whenTrue instanceof Node)) {
      throw TypeError("Expected whenTrue to be a Node, got " + __typeof(whenTrue));
    }
    if (whenFalse == null) {
      whenFalse = NothingNode(0, 0);
    } else if (!(whenFalse instanceof Node)) {
      throw TypeError("Expected whenFalse to be a Node, got " + __typeof(whenFalse));
    }
    self = __create(IfNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.test = test;
    self.whenTrue = whenTrue;
    self.whenFalse = whenFalse;
    return self;
  }
  IfNode.prototype = __create(Node.prototype);
  IfNode.prototype.constructor = IfNode;
  IfNode.cappedName = "If";
  IfNode.argNames = ["test", "whenTrue", "whenFalse"];
  State.addNodeFactory("if", IfNode);
  IfNode.prototype.walk = function (f) {
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
  return IfNode;
}());
LetNode = Node.Let = (function () {
  function LetNode(startIndex, endIndex, left, right) {
    var self;
    if (!(left instanceof Node)) {
      throw TypeError("Expected left to be a Node, got " + __typeof(left));
    }
    if (!(right instanceof Node)) {
      throw TypeError("Expected right to be a Node, got " + __typeof(right));
    }
    self = __create(LetNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.left = left;
    self.right = right;
    return self;
  }
  LetNode.prototype = __create(Node.prototype);
  LetNode.prototype.constructor = LetNode;
  LetNode.cappedName = "Let";
  LetNode.argNames = ["left", "right"];
  State.addNodeFactory("let", LetNode);
  LetNode.prototype.walk = function (f) {
    var left, right;
    left = f(this.left);
    right = f(this.right);
    if (left !== this.left || right !== this.right) {
      return LetNode(this.startIndex, this.endIndex, left, right);
    } else {
      return this;
    }
  };
  return LetNode;
}());
MacroAccessNode = Node.MacroAccess = (function () {
  function MacroAccessNode(startIndex, endIndex, id, data) {
    var self;
    if (typeof id !== "number") {
      throw TypeError("Expected id to be a Number, got " + __typeof(id));
    }
    if (!(data instanceof Object)) {
      throw TypeError("Expected data to be a Object, got " + __typeof(data));
    }
    self = __create(MacroAccessNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.id = id;
    self.data = data;
    return self;
  }
  MacroAccessNode.prototype = __create(Node.prototype);
  MacroAccessNode.prototype.constructor = MacroAccessNode;
  MacroAccessNode.cappedName = "MacroAccess";
  MacroAccessNode.argNames = ["id", "data"];
  State.addNodeFactory("macroAccess", MacroAccessNode);
  MacroAccessNode.prototype.walk = function (f) {
    return this;
  };
  return MacroAccessNode;
}());
NothingNode = Node.Nothing = (function () {
  function NothingNode(startIndex, endIndex) {
    var self;
    self = __create(NothingNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  NothingNode.prototype = __create(Node.prototype);
  NothingNode.prototype.constructor = NothingNode;
  NothingNode.cappedName = "Nothing";
  NothingNode.argNames = [];
  State.addNodeFactory("nothing", NothingNode);
  NothingNode.prototype.walk = retThis;
  return NothingNode;
}());
ObjectNode = Node.Object = (function () {
  function ObjectNode(startIndex, endIndex, pairs) {
    var self;
    if (!__isArray(pairs)) {
      throw TypeError("Expected pairs to be a Array, got " + __typeof(pairs));
    }
    self = __create(ObjectNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.pairs = pairs;
    return self;
  }
  ObjectNode.prototype = __create(Node.prototype);
  ObjectNode.prototype.constructor = ObjectNode;
  ObjectNode.cappedName = "Object";
  ObjectNode.argNames = ["pairs"];
  State.addNodeFactory("object", ObjectNode);
  ObjectNode.prototype.walk = function (f) {
    return this;
  };
  return ObjectNode;
}());
State.prototype.objectParam = State.prototype.object;
OperatorNode = Node.Operator = (function () {
  function OperatorNode(startIndex, endIndex, op) {
    var self;
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    self = __create(OperatorNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.op = op;
    return self;
  }
  OperatorNode.prototype = __create(Node.prototype);
  OperatorNode.prototype.constructor = OperatorNode;
  OperatorNode.cappedName = "Operator";
  OperatorNode.argNames = ["op"];
  State.addNodeFactory("operator", OperatorNode);
  OperatorNode.prototype.walk = function (f) {
    return this;
  };
  return OperatorNode;
}());
ParamNode = Node.Param = (function () {
  function ParamNode(startIndex, endIndex, ident, defaultValue, spread, isMutable, asType) {
    var self;
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
    self = __create(ParamNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.ident = ident;
    self.defaultValue = defaultValue;
    self.spread = spread;
    self.isMutable = isMutable;
    self.asType = asType;
    return self;
  }
  ParamNode.prototype = __create(Node.prototype);
  ParamNode.prototype.constructor = ParamNode;
  ParamNode.cappedName = "Param";
  ParamNode.argNames = [
    "ident",
    "defaultValue",
    "spread",
    "isMutable",
    "asType"
  ];
  State.addNodeFactory("param", ParamNode);
  ParamNode.prototype.walk = function (func) {
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
  return ParamNode;
}());
RegexpNode = Node.Regexp = (function () {
  function RegexpNode(startIndex, endIndex, text, flags) {
    var self;
    if (!(text instanceof Node)) {
      throw TypeError("Expected text to be a Node, got " + __typeof(text));
    }
    if (typeof flags !== "string") {
      throw TypeError("Expected flags to be a String, got " + __typeof(flags));
    }
    self = __create(RegexpNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.text = text;
    self.flags = flags;
    return self;
  }
  RegexpNode.prototype = __create(Node.prototype);
  RegexpNode.prototype.constructor = RegexpNode;
  RegexpNode.cappedName = "Regexp";
  RegexpNode.argNames = ["text", "flags"];
  State.addNodeFactory("regexp", RegexpNode);
  RegexpNode.prototype.walk = function (f) {
    var text;
    text = f(this.text);
    if (text !== this.text) {
      return RegexpNode(this.startIndex, this.endIndex, text, this.flags);
    } else {
      return this;
    }
  };
  return RegexpNode;
}());
ReturnNode = Node.Return = (function () {
  function ReturnNode(startIndex, endIndex, node, existential) {
    var self;
    if (node == null) {
      node = ConstNode(0, 0, void 0);
    } else if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    if (existential == null) {
      existential = false;
    } else if (typeof existential !== "boolean") {
      throw TypeError("Expected existential to be a Boolean, got " + __typeof(existential));
    }
    self = __create(ReturnNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.node = node;
    self.existential = existential;
    return self;
  }
  ReturnNode.prototype = __create(Node.prototype);
  ReturnNode.prototype.constructor = ReturnNode;
  ReturnNode.cappedName = "Return";
  ReturnNode.argNames = ["node", "existential"];
  State.addNodeFactory("return", ReturnNode);
  ReturnNode.prototype.walk = function (f) {
    var node;
    node = f(this.node);
    if (node !== this.node) {
      return ReturnNode(this.startIndex, this.endIndex, node, this.existential);
    } else {
      return this;
    }
  };
  return ReturnNode;
}());
RootNode = Node.Root = (function () {
  function RootNode(startIndex, endIndex, body) {
    var self;
    if (!(body instanceof Node)) {
      throw TypeError("Expected body to be a Node, got " + __typeof(body));
    }
    self = __create(RootNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.body = body;
    return self;
  }
  RootNode.prototype = __create(Node.prototype);
  RootNode.prototype.constructor = RootNode;
  RootNode.cappedName = "Root";
  RootNode.argNames = ["body"];
  State.addNodeFactory("root", RootNode);
  RootNode.prototype.walk = function (f) {
    var body;
    body = f(this.body);
    if (body !== this.body) {
      return RootNode(this.startIndex, this.endIndex, body);
    } else {
      return this;
    }
  };
  return RootNode;
}());
SpreadNode = Node.Spread = (function () {
  function SpreadNode(startIndex, endIndex, node) {
    var self;
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    self = __create(SpreadNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.node = node;
    return self;
  }
  SpreadNode.prototype = __create(Node.prototype);
  SpreadNode.prototype.constructor = SpreadNode;
  SpreadNode.cappedName = "Spread";
  SpreadNode.argNames = ["node"];
  State.addNodeFactory("spread", SpreadNode);
  SpreadNode.prototype.walk = function (f) {
    var node;
    node = f(this.node);
    if (node !== this.node) {
      return SpreadNode(this.startIndex, this.endIndex, node);
    } else {
      return this;
    }
  };
  return SpreadNode;
}());
StringNode = Node.String = (function () {
  function StringNode(startIndex, endIndex, parts) {
    var _i, _len, self;
    if (!__isArray(parts)) {
      throw TypeError("Expected parts to be an Array, got " + __typeof(parts));
    } else {
      for (_i = 0, _len = parts.length; _i < _len; ++_i) {
        if (!(parts[_i] instanceof Node)) {
          throw TypeError("Expected parts[" + _i + "] to be a Node, got " + __typeof(parts[_i]));
        }
      }
    }
    self = __create(StringNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.parts = parts;
    return self;
  }
  StringNode.prototype = __create(Node.prototype);
  StringNode.prototype.constructor = StringNode;
  StringNode.cappedName = "String";
  StringNode.argNames = ["parts"];
  State.addNodeFactory("string", StringNode);
  StringNode.prototype.walk = function (f) {
    var parts;
    parts = map(this.parts, f);
    if (parts !== this.parts) {
      return StringNode(this.startIndex, this.endIndex, parts);
    } else {
      return this;
    }
  };
  return StringNode;
}());
SuperNode = Node.Super = (function () {
  function SuperNode(startIndex, endIndex, child, args) {
    var _i, _len, self;
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
    self = __create(SuperNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.child = child;
    self.args = args;
    return self;
  }
  SuperNode.prototype = __create(Node.prototype);
  SuperNode.prototype.constructor = SuperNode;
  SuperNode.cappedName = "Super";
  SuperNode.argNames = ["child", "args"];
  State.addNodeFactory("super", SuperNode);
  SuperNode.prototype.walk = function (func) {
    var args, child;
    child = this.child != null ? func(this.child) : this.child;
    args = map(this.args, func);
    if (child !== this.child || args !== this.args) {
      return SuperNode(this.startIndex, this.endIndex, child, args);
    } else {
      return this;
    }
  };
  return SuperNode;
}());
SyntaxChoiceNode = Node.SyntaxChoice = (function () {
  function SyntaxChoiceNode(startIndex, endIndex, choices) {
    var _i, _len, self;
    if (!__isArray(choices)) {
      throw TypeError("Expected choices to be an Array, got " + __typeof(choices));
    } else {
      for (_i = 0, _len = choices.length; _i < _len; ++_i) {
        if (!(choices[_i] instanceof Node)) {
          throw TypeError("Expected choices[" + _i + "] to be a Node, got " + __typeof(choices[_i]));
        }
      }
    }
    self = __create(SyntaxChoiceNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.choices = choices;
    return self;
  }
  SyntaxChoiceNode.prototype = __create(Node.prototype);
  SyntaxChoiceNode.prototype.constructor = SyntaxChoiceNode;
  SyntaxChoiceNode.cappedName = "SyntaxChoice";
  SyntaxChoiceNode.argNames = ["choices"];
  State.addNodeFactory("syntaxChoice", SyntaxChoiceNode);
  SyntaxChoiceNode.prototype.walk = function (f) {
    var choices;
    choices = map(this.choices, f);
    if (choices !== this.choices) {
      return SyntaxChoiceNode(this.startIndex, this.endIndex, choices);
    } else {
      return this;
    }
  };
  return SyntaxChoiceNode;
}());
SyntaxManyNode = Node.SyntaxMany = (function () {
  function SyntaxManyNode(startIndex, endIndex, inner, multiplier) {
    var self;
    if (!(inner instanceof Node)) {
      throw TypeError("Expected inner to be a Node, got " + __typeof(inner));
    }
    if (typeof multiplier !== "string") {
      throw TypeError("Expected multiplier to be a String, got " + __typeof(multiplier));
    }
    self = __create(SyntaxManyNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.inner = inner;
    self.multiplier = multiplier;
    return self;
  }
  SyntaxManyNode.prototype = __create(Node.prototype);
  SyntaxManyNode.prototype.constructor = SyntaxManyNode;
  SyntaxManyNode.cappedName = "SyntaxMany";
  SyntaxManyNode.argNames = ["inner", "multiplier"];
  State.addNodeFactory("syntaxMany", SyntaxManyNode);
  SyntaxManyNode.prototype.walk = function (f) {
    var inner;
    inner = f(this.inner);
    if (inner !== this.inner) {
      return SyntaxManyNode(this.startIndex, this.endIndex, inner, this.multiplier);
    } else {
      return this;
    }
  };
  return SyntaxManyNode;
}());
SyntaxParamNode = Node.SyntaxParam = (function () {
  function SyntaxParamNode(startIndex, endIndex, ident, asType) {
    var self;
    if (!(ident instanceof Node)) {
      throw TypeError("Expected ident to be a Node, got " + __typeof(ident));
    }
    if (asType == null) {
      asType = void 0;
    } else if (!(asType instanceof Node)) {
      throw TypeError("Expected asType to be a Node or undefined, got " + __typeof(asType));
    }
    self = __create(SyntaxParamNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.ident = ident;
    self.asType = asType;
    return self;
  }
  SyntaxParamNode.prototype = __create(Node.prototype);
  SyntaxParamNode.prototype.constructor = SyntaxParamNode;
  SyntaxParamNode.cappedName = "SyntaxParam";
  SyntaxParamNode.argNames = ["ident", "asType"];
  State.addNodeFactory("syntaxParam", SyntaxParamNode);
  SyntaxParamNode.prototype.walk = function (func) {
    var asType, ident;
    ident = func(this.ident);
    asType = this.asType != null ? func(this.asType) : this.asType;
    if (ident !== this.ident || asType !== this.asType) {
      return SyntaxParamNode(this.startIndex, this.endIndex, ident, asType);
    } else {
      return this;
    }
  };
  return SyntaxParamNode;
}());
SyntaxSequenceNode = Node.SyntaxSequence = (function () {
  function SyntaxSequenceNode(startIndex, endIndex, params) {
    var _i, _len, self;
    if (!__isArray(params)) {
      throw TypeError("Expected params to be an Array, got " + __typeof(params));
    } else {
      for (_i = 0, _len = params.length; _i < _len; ++_i) {
        if (!(params[_i] instanceof Node)) {
          throw TypeError("Expected params[" + _i + "] to be a Node, got " + __typeof(params[_i]));
        }
      }
    }
    self = __create(SyntaxSequenceNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.params = params;
    return self;
  }
  SyntaxSequenceNode.prototype = __create(Node.prototype);
  SyntaxSequenceNode.prototype.constructor = SyntaxSequenceNode;
  SyntaxSequenceNode.cappedName = "SyntaxSequence";
  SyntaxSequenceNode.argNames = ["params"];
  State.addNodeFactory("syntaxSequence", SyntaxSequenceNode);
  SyntaxSequenceNode.prototype.walk = function (f) {
    var params;
    params = map(this.params, f);
    if (params !== this.params) {
      return SyntaxSequenceNode(this.startIndex, this.endIndex, params);
    } else {
      return this;
    }
  };
  return SyntaxSequenceNode;
}());
ThisNode = Node.This = (function () {
  function ThisNode(startIndex, endIndex) {
    var self;
    self = __create(ThisNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    return self;
  }
  ThisNode.prototype = __create(Node.prototype);
  ThisNode.prototype.constructor = ThisNode;
  ThisNode.cappedName = "This";
  ThisNode.argNames = [];
  State.addNodeFactory("this", ThisNode);
  ThisNode.prototype.walk = retThis;
  return ThisNode;
}());
TmpNode = Node.Tmp = (function () {
  function TmpNode(startIndex, endIndex, id, name) {
    var self;
    if (typeof id !== "number") {
      throw TypeError("Expected id to be a Number, got " + __typeof(id));
    }
    if (typeof name !== "string") {
      throw TypeError("Expected name to be a String, got " + __typeof(name));
    }
    self = __create(TmpNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.id = id;
    self.name = name;
    return self;
  }
  TmpNode.prototype = __create(Node.prototype);
  TmpNode.prototype.constructor = TmpNode;
  TmpNode.cappedName = "Tmp";
  TmpNode.argNames = ["id", "name"];
  State.addNodeFactory("tmp", TmpNode);
  TmpNode.prototype.walk = function (f) {
    return this;
  };
  return TmpNode;
}());
TryCatchNode = Node.TryCatch = (function () {
  function TryCatchNode(startIndex, endIndex, tryBody, catchIdent, catchBody) {
    var self;
    if (!(tryBody instanceof Node)) {
      throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
    }
    if (!(catchIdent instanceof Node)) {
      throw TypeError("Expected catchIdent to be a Node, got " + __typeof(catchIdent));
    }
    if (!(catchBody instanceof Node)) {
      throw TypeError("Expected catchBody to be a Node, got " + __typeof(catchBody));
    }
    self = __create(TryCatchNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.tryBody = tryBody;
    self.catchIdent = catchIdent;
    self.catchBody = catchBody;
    return self;
  }
  TryCatchNode.prototype = __create(Node.prototype);
  TryCatchNode.prototype.constructor = TryCatchNode;
  TryCatchNode.cappedName = "TryCatch";
  TryCatchNode.argNames = ["tryBody", "catchIdent", "catchBody"];
  State.addNodeFactory("tryCatch", TryCatchNode);
  TryCatchNode.prototype.walk = function (f) {
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
  return TryCatchNode;
}());
TryFinallyNode = Node.TryFinally = (function () {
  function TryFinallyNode(startIndex, endIndex, tryBody, finallyBody) {
    var self;
    if (!(tryBody instanceof Node)) {
      throw TypeError("Expected tryBody to be a Node, got " + __typeof(tryBody));
    }
    if (!(finallyBody instanceof Node)) {
      throw TypeError("Expected finallyBody to be a Node, got " + __typeof(finallyBody));
    }
    self = __create(TryFinallyNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.tryBody = tryBody;
    self.finallyBody = finallyBody;
    return self;
  }
  TryFinallyNode.prototype = __create(Node.prototype);
  TryFinallyNode.prototype.constructor = TryFinallyNode;
  TryFinallyNode.cappedName = "TryFinally";
  TryFinallyNode.argNames = ["tryBody", "finallyBody"];
  State.addNodeFactory("tryFinally", TryFinallyNode);
  TryFinallyNode.prototype.walk = function (f) {
    var finallyBody, tryBody;
    tryBody = f(this.tryBody);
    finallyBody = f(this.finallyBody);
    if (tryBody !== this.tryBody || finallyBody !== this.finallyBody) {
      return TryFinallyNode(this.startIndex, this.endIndex, tryBody, finallyBody);
    } else {
      return this;
    }
  };
  return TryFinallyNode;
}());
TypeArrayNode = Node.TypeArray = (function () {
  function TypeArrayNode(startIndex, endIndex, subtype) {
    var self;
    if (!(subtype instanceof Node)) {
      throw TypeError("Expected subtype to be a Node, got " + __typeof(subtype));
    }
    self = __create(TypeArrayNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.subtype = subtype;
    return self;
  }
  TypeArrayNode.prototype = __create(Node.prototype);
  TypeArrayNode.prototype.constructor = TypeArrayNode;
  TypeArrayNode.cappedName = "TypeArray";
  TypeArrayNode.argNames = ["subtype"];
  State.addNodeFactory("typeArray", TypeArrayNode);
  TypeArrayNode.prototype.walk = function (f) {
    var subtype;
    subtype = f(this.subtype);
    if (subtype !== this.subtype) {
      return TypeArrayNode(this.startIndex, this.endIndex, subtype);
    } else {
      return this;
    }
  };
  return TypeArrayNode;
}());
TypeUnionNode = Node.TypeUnion = (function () {
  function TypeUnionNode(startIndex, endIndex, types) {
    var _i, _len, self;
    if (!__isArray(types)) {
      throw TypeError("Expected types to be an Array, got " + __typeof(types));
    } else {
      for (_i = 0, _len = types.length; _i < _len; ++_i) {
        if (!(types[_i] instanceof Node)) {
          throw TypeError("Expected types[" + _i + "] to be a Node, got " + __typeof(types[_i]));
        }
      }
    }
    self = __create(TypeUnionNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.types = types;
    return self;
  }
  TypeUnionNode.prototype = __create(Node.prototype);
  TypeUnionNode.prototype.constructor = TypeUnionNode;
  TypeUnionNode.cappedName = "TypeUnion";
  TypeUnionNode.argNames = ["types"];
  State.addNodeFactory("typeUnion", TypeUnionNode);
  TypeUnionNode.prototype.walk = function (f) {
    var types;
    types = map(this.types, f);
    if (types !== this.types) {
      return TypeUnionNode(this.startIndex, this.endIndex, types);
    } else {
      return this;
    }
  };
  return TypeUnionNode;
}());
UnaryNode = Node.Unary = (function () {
  function UnaryNode(startIndex, endIndex, op, node) {
    var self;
    if (typeof op !== "string") {
      throw TypeError("Expected op to be a String, got " + __typeof(op));
    }
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    self = __create(UnaryNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.op = op;
    self.node = node;
    return self;
  }
  UnaryNode.prototype = __create(Node.prototype);
  UnaryNode.prototype.constructor = UnaryNode;
  UnaryNode.cappedName = "Unary";
  UnaryNode.argNames = ["op", "node"];
  State.addNodeFactory("unary", UnaryNode);
  UnaryNode.prototype.walk = function (f) {
    var node;
    node = f(this.node);
    if (node !== this.node) {
      return UnaryNode(this.startIndex, this.endIndex, this.op, node);
    } else {
      return this;
    }
  };
  return UnaryNode;
}());
UseMacroNode = Node.UseMacro = (function () {
  function UseMacroNode(startIndex, endIndex, node, tmps, macroHelpers) {
    var self;
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    if (!__isArray(tmps)) {
      throw TypeError("Expected tmps to be a Array, got " + __typeof(tmps));
    }
    if (!__isArray(macroHelpers)) {
      throw TypeError("Expected macroHelpers to be a Array, got " + __typeof(macroHelpers));
    }
    self = __create(UseMacroNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.node = node;
    self.tmps = tmps;
    self.macroHelpers = macroHelpers;
    return self;
  }
  UseMacroNode.prototype = __create(Node.prototype);
  UseMacroNode.prototype.constructor = UseMacroNode;
  UseMacroNode.cappedName = "UseMacro";
  UseMacroNode.argNames = ["node", "tmps", "macroHelpers"];
  State.addNodeFactory("useMacro", UseMacroNode);
  UseMacroNode.prototype.walk = function (f) {
    var node;
    node = f(this.node);
    if (node !== this.node) {
      return UseMacroNode(
        this.startIndex,
        this.endIndex,
        node,
        this.tmps,
        this.macroHelpers
      );
    } else {
      return this;
    }
  };
  return UseMacroNode;
}());
YieldNode = Node.Yield = (function () {
  function YieldNode(startIndex, endIndex, node, multiple) {
    var self;
    if (!(node instanceof Node)) {
      throw TypeError("Expected node to be a Node, got " + __typeof(node));
    }
    if (multiple == null) {
      multiple = false;
    } else if (typeof multiple !== "boolean") {
      throw TypeError("Expected multiple to be a Boolean, got " + __typeof(multiple));
    }
    self = __create(YieldNode.prototype);
    Object.defineProperty(self, "type", {
      get: function () {
        throw Error("Don't access type on Node");
      }
    });
    self.startIndex = startIndex;
    self.endIndex = endIndex;
    self.node = node;
    self.multiple = multiple;
    return self;
  }
  YieldNode.prototype = __create(Node.prototype);
  YieldNode.prototype.constructor = YieldNode;
  YieldNode.cappedName = "Yield";
  YieldNode.argNames = ["node", "multiple"];
  State.addNodeFactory("yield", YieldNode);
  YieldNode.prototype.walk = function (f) {
    var node;
    node = f(this.node);
    if (node !== this.node) {
      return YieldNode(this.startIndex, this.endIndex, node, this.multiple);
    } else {
      return this;
    }
  };
  return YieldNode;
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
    return __strnum(__slice(errs, void 0, __num(len) - 1).join(", ")) + ", or " + __strnum(errs[__num(errs.length) - 1]);
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
    throw TypeError("Expected text to be a string, got " + __typeof(text));
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
module.exports.Node = Node;
