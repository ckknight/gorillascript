let freeze = if typeof Object.freeze == "function" then Object.freeze else #(o) -> o

let SHORT_CIRCUIT = freeze ^{ toString: #-> "short-circuit" }
let NOTHING = freeze ^{ toString: #-> "" }

let generateCacheKey = do
  let mutable id = -1
  #
    id += 1
    id

let copy(o as Object)
  let result = {}
  for k, v of o
    result[k] := v
  result

let assert(value)
  if not value
    throw Error "Assertion failed: $(String value)"
  value

let named(name as (null|String), func as Function)
  if name
    func.parserName := name
  func

let identity(x) -> x

let cache(rule as Function, dontCache as Boolean)
  if dontCache
    rule
  else
    let cacheKey = generateCacheKey()
    named rule?.parserName, #(o)
      let cache = o.cache
      let indent = o.indent.peek()
      let indentCache = (cache[indent] ?= [])
      let inner = (indentCache[cacheKey] ?= [])
      let index = o.index
      let item = inner[index]
      if item == void
        let result = rule o
        if o.indent.peek() != indent
          throw Error "Changed indent during cache process: from $indent to $(o.indent.peek())"
        if not result
          inner[index] := false
        else
          inner[index] := [o.index, result]
        result
      else if not item
        false
      else
        o.index := item[0]
        item[1]
macro cache!(rule, dontCache)
  if @isConst(dontCache)
    if @value(dontCache)
      rule
    else
      AST cache $rule
  else
    AST cache $rule, $dontCache

macro mutate!(rule, mutator)
  if mutator? and (not @isConst(mutator) or @value(mutator) != void)
    let init = []
    rule := @cache rule, init, true
    mutator := @cache mutator, init, true
    let result = AST named($rule?.parserName, #(o)
      let index = o.index
      let result = $rule o
      if not result
        false
      else
        if typeof $mutator == "function"
          $mutator result, o, index
        else if $mutator != void
          $mutator
        else
          result)
    if init.length
      AST do
        $init
        $result
    else
      result
  else
    rule

macro check!(rule, mutator)
  let init = []
  rule := @cache rule, init, true
  let result = AST mutate! (#(o) -> $rule o.clone()), $mutator
  if init.length
    AST do
      $init
      $result
  else
    result

macro oneOf!(array, mutator)
  if not @isArray(array)
    throw Error "Expected a literal array"
  
  let elements = @elements(array)
  if elements.length == 0
    throw Error "Cannot provide an empty array"
  else if elements.length == 1
    let rule = elements[0]
    AST mutate! $rule, $mutator
  else
    let init = []
    let checks = void
    for rule, i, len in elements
      if @isConst(rule)
        if typeof @value(rule) != "string"
          throw Error "Can only handle constant string literals"
        rule := AST wordOrSymbol $rule
      rule := @cache rule, init, true
      if checks == void
        checks := AST $rule o
      else
        checks := AST $checks or $rule o
    let ret = AST mutate! (#(o) -> $checks), $mutator
    if init.length
      AST do
        $init
        $ret
    else
      ret

let sequential(array as Array, mutator, dontCache as Boolean)
  if array.length == 0
    throw Error "Cannot provide an empty array"
  
  let mutable name = []
  let rules = []
  let mapping = []
  let mutable shouldWrapName = false
  for item, i in array
    let mutable key = void
    let mutable rule = void
    if Array.isArray item
      if item.length != 2
        throw Error "Found an array with #(item.length) length at index #$i"
      if typeof item[0] != "string"
        throw TypeError "Array in index #$i has an improper key: $(typeof! item[0])"
      if typeof item[1] != "function"
        throw TypeError "Array in index #$i has an improper rule: $(typeof! item[1])"
      key := item[0]
      rule := item[1]
    else if typeof item == "function"
      rule := item
    else
      throw TypeError "Found a non-array, non-function in index #$i: $(typeof! item)"
    
    rules.push rule
    mapping.push key
    let ruleName = rule.parserName or "<unknown>"
    if i > 0 and name[name.length - 1].slice(-1) == '"' and ruleName.charAt(0) == '"' and ruleName.slice(-1) == '"'
      name[name.length - 1] := name[name.length - 1].substring 0, name[name.length - 1].length - 1
      name.push ruleName.substring(1)
    else
      if i > 0
        name.push " "
        shouldWrapName := true
      name.push ruleName
  if shouldWrapName
    name.splice 0, 0, "("
    name.push ")"
  name := name.join ""
  
  return mutate! named(name, #(o)
    let clone = o.clone()
    let mutable result = {}
    for rule, i in rules
      let item = rule clone
      if not item
        return false
      
      let key = mapping[i]
      if key
        if key == "this"
          result := item
        else
          result[key] := item
    o.update clone
    result), mutator, dontCache

macro sequential!(array, mutator)
  if not @isArray(array)
    throw Error "Expected a literal array"
  
  let init = []
  let code = []
  
  let mutable hasResult = false
  let mutable hasThis = false
  let checks = for item, i in @elements(array)
    if @isArray(item)
      let parts = @elements(item)
      if parts.length != 2
        throw TypeError "Found an array with $(parts.length) length at index #$i"
      else if not @isConst(parts[0]) or typeof @value(parts[0]) != "string"
        throw TypeError "Array in index #$i has an improper key"
      
      hasResult := true
      let key = parts[0]
      let rule = @cache parts[1], init, true
      if @value(key) == "this"
        hasThis := true
        AST result := $rule clone
      else
        AST result[$key] := $rule clone
    else
      let rule = @cache item, init, true
      AST $rule clone
  let mutable code = void
  for check in checks
    if code == void
      code := check
    else
      code := AST $code and $check
  hasThis := @const(hasThis)
  
  let result = if hasResult
    AST mutate! (#(o)
      let clone = o.clone()
      let mutable result = if $hasThis then void else {}
      if $code
        o.update clone
        result
      else
        false), $mutator
  else
    AST mutate! (#(o)
      let clone = o.clone()
      if $code
        o.update clone
        true
      else
        false), $mutator
  if init.length
    AST do
      $init
      $result
  else
    result

macro maybe!(rule, missingValue, foundValue)
  if @isConst(missingValue) and not @value(missingValue)
    throw Error "Expected a truthy missingValue, got $(String @value(missingValue))"
  let init = []
  rule := @cache rule, init, true
  missingValue := @cache missingValue, init, true
  foundValue := @cache foundValue, init, true
  
  let result = AST named(($rule?.parserName or "<unknown>") & "?", #(o)
    let index = o.index
    let clone = o.clone()
    let result = $rule clone
    if not result
      if typeof $missingValue == "function"
        $missingValue void, o, index
      else
        $missingValue
    else
      o.update clone
      if $foundValue != void
        if typeof $foundValue == "function"
          $foundValue result, o, index
        else
          $foundValue
      else
        result)
  if init.length
    AST do
      $init
      $result
  else
    result

macro except!(rule)
  let init = []
  rule := @cache rule, init, true
  
  let result = AST named("!" & ($rule?.parserName or "<unknown>"), #(o)
    not $rule o.clone())
  if init.length
    AST do
      $init
      $result
  else
    result

macro anyExcept!(rule, mutator)
  if @isArray(rule)
    rule := AST oneOf! $rule
  AST sequential! [
    except! $rule
    ["this", AnyChar]
  ], $mutator

macro shortCircuit!(expected, backend)
  let init = []
  expected := @cache expected, init, true
  backend := @cache backend, init, true
  
  let result = AST named($backend?.parserName, #(o)
    if not $expected(o.clone())
      false
    else
      let result = $backend(o)
      if not result
        throw SHORT_CIRCUIT
      result)
  if init.length
    AST do
      $init
      $result
  else
    result

macro calculateMultipleName!(name, minCount, maxCount)
  if not @isConst(minCount) or typeof @value(minCount) != "number"
    throw Error "Expected minCount to be a const number"
  if not @isConst(maxCount) or typeof @value(maxCount) != "number"
    throw Error "Expected maxCount to be a const number"
  
  if @value(minCount) == 0
    if @value(maxCount) == 0
      return AST "$($name)*"
    else if @value
      return AST "$($name)?"
  else if @value(minCount) == 1
    if @value(maxCount) == 0
      return AST "$($name)+"
    else
      return name
  let ending = @const(if @value(minCount) == @value(maxCount)
    "{$(@value minCount)}"
  else
    "{$(@value minCount),$(@value maxCount)}")
  if @value(minCount) == @value(maxCount)
    AST "$($name)$($ending)"
  else
    AST "$($name)$($ending)"

macro multiple!(minCount, maxCount, rule, mutator)
  if not @isConst(minCount) or typeof @value(minCount) != "number"
    throw Error "Expected minCount to be a const number"
  if not @isConst(maxCount) or typeof @value(maxCount) != "number"
    throw Error "Expected minCount to be a const number"
  
  if @value(minCount) == 0 and @value(maxCount) == 1
    AST maybe! mutate!($rule, #(x) -> [x], true), #-> [], $mutator
  else if @value(minCount) == 1 and @value(maxCount) == 1
    AST mutate! mutate!($rule, #(x) -> [x], true), $mutator
  else
    let init = []
    rule := @cache rule, init, true
    let result = AST mutate! named(calculateMultipleName!($rule?.parserName or "<nothing>", $minCount, $maxCount), #(o)
      let clone = o.clone()
      let result = []
      while true
        let item = $rule clone
        if not item
          break
        result.push item
        if $maxCount and result.length >= $maxCount
          break
      if not $minCount or result.length >= $minCount
        o.update clone
        result
      else
        false), $mutator
    if init.length
      AST do
        $init
        $result
    else
      result

macro zeroOrMore!(rule, mutator) -> AST multiple! 0, 0, $rule, $mutator
macro oneOrMore!(rule, mutator) -> AST multiple! 1, 0, $rule, $mutator

macro zeroOrMoreOf!(array, mutator) -> AST zeroOrMore! (oneOf! $array), $mutator
macro oneOrMoreOf!(array, mutator) -> AST oneOrMore! (oneOf! $array), $mutator

macro character!(chars)
  // TODO: properly handle "\u0000"
  if not @isConst(chars) or typeof @value(chars) != "string"
    throw Error "Must provide a literal string"
  chars := @value(chars)
  if chars.length == 1
    let code = @const chars.charCodeAt 0
    let ch = chars.charAt 0
    let name = @const if ch == '"' then "'\"'" else (JSON.stringify ch)
    AST
      named $name, #(o)
        let c = o.data.charCodeAt o.index
        if c == $code
          o.index += 1
          c
        else
          o.fail $name
          false
  else
    let name = @const "[$((JSON.stringify chars).slice(1, -1))]"
    let codes = []
    for i = 0, chars.length
      codes.push chars.charCodeAt i
    codes.sort #(x, y) -> x <=> y
    let chunks = []
    let mutable currentStart = void
    let mutable currentEnd = void
    for code in codes
      if not currentStart?
        currentStart := code
        currentEnd := code
      else if code == currentEnd + 1
        currentEnd := code
      else
        chunks.push {
          start: currentStart
          end: currentEnd
        }
        currentStart := code
        currentEnd := code
    chunks.push {
      start: currentStart
      end: currentEnd
    }
    let mutable current = void
    for chunk in chunks
      let start = chunk.start
      let end = chunk.end
      let startConst = @const(start)
      let endConst = @const(end)
      let test = if start == end
        AST c == $startConst
      else if end == start + 1
        AST c == $startConst or c == $endConst
      else
        AST c ~>= $startConst and c ~<= $endConst
      if current?
        current := AST $current or $test
      else
        current := test
    AST
      named $name, #(o)
        let c = o.data.charCodeAt o.index
        if $current
          o.index += 1
          c
        else
          o.fail $name
          false

let ruleEqual(rule, text, mutator)
  let failureMessage = JSON.stringify(text)
  return mutate! named(failureMessage, #(o)
    let clone = o.clone()
    let result = rule clone
    if result == text
      o.update clone
      result
    else
      o.fail failureMessage
      false), mutator

let word(text, mutator)
  ruleEqual Name, text, mutator

let symbol(text, mutator)
  ruleEqual Symbol, text, mutator

let wordOrSymbol(text, mutator)
  let parts = [Space]
  parts.push ...(for part, i in text.split r"([a-z]+)"ig
    if part
      if i %% 2
        ruleEqual _Symbol, part
      else
        ruleEqual _Name, part)
  
  sequential parts, mutator or text

let macroName(text, mutator)
  let failureMessage = JSON.stringify(text)
  mutate! named(failureMessage, #(o)
    let clone = o.clone()
    let result = MacroName(clone)
    if result == text
      o.update clone
      result
    else
      o.fail failureMessage
      false), mutator

let getFuncName(func)
  if typeof func != "function"
    throw TypeError "Expected a function, got $(typeof! func)"
  if func.displayName
    func.displayName
  else if func.name
    func.name
  else
    let match = RegExp("^function\\s*(.*?)").exec func.toString()
    (match and match[1]) or func.parserName or "(anonymous)"

let wrap(func, name = getFuncName(func))
  let mutable id = -1
  named func.parserName, #(o)
    id += 1
    let i = id
    console.log "$(i)-$(name) starting at $(o.indent.peek()):$(o.index)"
    let result = func o
    if not result
      console.log "$(i)-$(name) failure at $(o.indent.peek()):$(o.index)"
    else
      console.log "$(i)-$(name) success at $(o.indent.peek()):$(o.index)", result
    result

macro define
  syntax name as Identifier, "=", value
    let nameStr = @const @name(name)
    AST let $name = cache named $nameStr, $value

let Stack = do
  let Stack(@initial, @data = [])!
    if this not instanceof Stack
      throw TypeError "Must be instantiated with new"
  
  Stack::push := #(value) -> @data.push value
  Stack::pop := #
    let data = @data
    let len = data.length
    if len == 0
      throw Error "Cannot pop"
    data.pop()
  
  Stack::canPop := #-> @data.length > 0
  
  Stack::peek := #
    let data = @data
    let len = data.length
    if len == 0
      @initial
    else
      data[len - 1]
  
  Stack::clone := #-> new Stack @initial, @data[:]
  
  Stack

let makeAlterStack(stack, value)
  if stack not instanceof Stack
    throw TypeError "Expected stack to be a Stack, got $(typeof! stack)"
  
  #(func)
    if typeof func != "function"
      throw TypeError "Expected a function, got $(typeof! func)"
    
    named func.parserName, #(o)
      stack.push value
      let mutable result = void
      try
        result := func(o)
      finally
        stack.pop()
      result

let _statement = new Stack true
let inStatement = makeAlterStack _statement, true
let inExpression = makeAlterStack _statement, false

let _inAst = new Stack false
let inAst = makeAlterStack _inAst, true

define Eof = #(o) -> o.index >= o.data.length

define WhiteSpace = zeroOrMore! character!("\t \r\n"), true
define SpaceChar = character! "\t "
define _Space = zeroOrMore! SpaceChar, true
define Newline = sequential! [
  maybe! character!("\r"), true
  character! "\n"
], true
define Stop = oneOf! [Newline, Eof]
define CheckStop = check! Stop

define SingleLineComment = #(o)
  let data = o.data
  let index = o.index
  if data.charCodeAt(index) == "/".charCodeAt(0) and data.charCodeAt(index + 1) == "/".charCodeAt(0)
    let len = data.length
    index += 2
    while true, index += 1
      let c = data.charCodeAt(index)
      if index >= len or c in ["\r".charCodeAt(0), "\n".charCodeAt(0)]
        o.index := index
        return true
  else
    false

define MultiLineComment = #(o)
  let data = o.data
  let index = o.index
  if data.charCodeAt(index) == "/".charCodeAt(0) and data.charCodeAt(index + 1) == "*".charCodeAt(0)
    let len = data.length
    index += 2
    while true, index += 1
      if index >= len
        o.error "Multi-line comment never ends"
      else
        let c = data.charCodeAt(index)
        if c == "*".charCodeAt(0) and data.charCodeAt(index + 1) == "/".charCodeAt(0)
          o.index := index + 2
          Space o
          return true
  else
    false

define Comment = oneOf! [SingleLineComment, MultiLineComment]
define MaybeComment = maybe! Comment, true

define Space = sequential! [
  _Space
  MaybeComment
], true
define SomeSpace = sequential! [
  oneOrMore! SpaceChar, true
  MaybeComment
], true
define NoSpace = except! SpaceChar

define SpaceNewline = sequential! [
  Space
  Newline
], true
define EmptyLine = SpaceNewline
define EmptyLines = zeroOrMore! EmptyLine, true
define SomeEmptyLines = oneOrMore! EmptyLine, true

define Shebang = sequential! [
  character! "#"
  character! "!"
  zeroOrMore! anyExcept! Newline
], true

let INDENTS = {
  ("\t".charCodeAt(0)): 4
  (" ".charCodeAt(0)): 1
}
define CountIndent = zeroOrMore! SpaceChar, #(x)
  let mutable count = 1
  for c in x
    let i = INDENTS[c]
    if not i
      throw Error "Unexpected indent char: $(JSON.stringify c)"
    count += i
  count

define CheckIndent = #(o)
  let clone = o.clone()
  let indent = CountIndent clone
  if indent == clone.indent.peek()
    o.update clone
    true
  else
    false

let Advance = named "Advance", #(o)
  let clone = o.clone()
  let indent = CountIndent clone
  if indent > clone.indent.peek()
    // don't update o, we don't want to move the index
    o.indent.push indent
    true
  else
    false

let MaybeAdvance = named "Advance", #(o)
  let clone = o.clone()
  let indent = CountIndent clone
  o.indent.push indent
  true

let PushIndent = named "PushIndent", mutate! CountIndent, (#(indent, o)
  o.indent.push indent
  true), true

let PopIndent = named "PopIndent", #(o)
  if o.indent.canPop()
    o.indent.pop()
    true
  else
    o.error "Unexpected dedent"

let withSpace(func)
  if typeof func != "function"
    throw TypeError "Expected a function, got $(typeof! func)"
  
  sequential! [
    Space
    ["this", func]
  ]

define Zero = character! "0"
define DecimalDigit = character! "0123456789"
define Period = character! "."
define Colon = character! ":"
define PipeChar = character! "|"
define Pipe = withSpace PipeChar
define DoubleColon = sequential! [Colon, Colon], "::"
define eE = character! "eE"
define Minus = character! "-"
define Plus = character! "+"
define PlusOrMinus = oneOf! [Minus, Plus]
define xX = character! "xX"
define oO = character! "oO"
define bB = character! "bB"
define LowerU = character! "u"
define LowerX = character! "x"
define HexDigit = character! "0123456789abcdefABCDEF"
define OctalDigit = character! "01234567"
define BinaryDigit = character! "01"
define Letter = character! "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
define AlphaNum = character! "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
define Underscore = character! "_"
define DollarSign = character! "\$"
define AtSign = character! "@"
define HashSign = withSpace character! "#"
define NameStart = oneOf! [Letter, Underscore, DollarSign]
define NameChar = oneOf! [NameStart, DecimalDigit]
define SymbolChar = character! "!#%&*+-/<=>?\\^`|~"
define DoubleQuote = character! '"'
define SingleQuote = character! "'"
define TripleDoubleQuote = multiple! 3, 3, DoubleQuote, '"""'
define TripleSingleQuote = multiple! 3, 3, SingleQuote, '"""'
define SemicolonChar = character! ";"
define Semicolon = withSpace SemicolonChar
define Asterix = character! "*"
define OpenParenthesisChar = character! "("
define OpenParenthesis = withSpace OpenParenthesisChar
define CloseParenthesis = withSpace character! ")"
define OpenSquareBracketChar = character! "["
define OpenSquareBracket = withSpace OpenSquareBracketChar
define CloseSquareBracket = withSpace character! "]"
define OpenCurlyBrace = withSpace character! "{"
define CloseCurlyBrace = withSpace character! "}"
define Backslash = character! "\\"
define Comma = withSpace character! ","
define MaybeComma = maybe! Comma, true
define CommaOrNewline = oneOf! [
  sequential! [
    ["this", Comma]
    EmptyLines
  ]
  SomeEmptyLines
]
define SomeEmptyLinesWithCheckIndent = sequential! [
  SomeEmptyLines
  CheckIndent
]
define CommaOrNewlineWithCheckIndent = oneOf! [
  sequential! [
    ["this", Comma]
    maybe! SomeEmptyLinesWithCheckIndent, true
  ]
  SomeEmptyLinesWithCheckIndent
]
define MaybeCommaOrNewline = maybe! CommaOrNewline, true

define NamePart = sequential! [
  ["head", NameStart]
  ["tail", zeroOrMore! NameChar]
], #(x) -> [x.head, ...x.tail]

let fromCharCode = do
  let f = String.fromCharCode
  #(x)
    if x == -1
      "\u0000"
    else
      f x
let processCharCodes(codes, array = [])
  for v in codes
    array.push fromCharCode(v)
  array

define _Name = sequential! [
  ["head", NamePart]
  ["tail", zeroOrMore! sequential! [
    Minus
    ["this", NamePart]
  ]]
], #(x)
  let parts = processCharCodes x.head
  for part in x.tail
    parts.push fromCharCode(part[0]).toUpperCase()
    processCharCodes part[1:], parts
  parts.join ""

define Name = sequential! [
  Space
  ["this", _Name]
]

define _Symbol = oneOrMore! SymbolChar, #(x) -> processCharCodes(x).join ""

define Symbol = sequential! [
  Space
  ["this", _Symbol]
]

let _NameOrSymbol = oneOrMoreOf! [
  _Name
  _Symbol
], #(x) -> x.join ""
let NameOrSymbol = sequential! [
  Space
  ["this", _NameOrSymbol]
]

define AnyChar = #(o)
  let data = o.data
  let index = o.index
  if index >= data.length
    o.fail "any"
    false
  else
    o.index += 1
    o.data.charCodeAt(index) or -1

define ThisLiteral = word "this", #(x, o, i) -> o.node "this", i

define ThisShorthandLiteral = sequential! [Space, AtSign], #(x, o, i) -> o.node "this", i

define ThisOrShorthandLiteral = oneOf! [ThisLiteral, ThisShorthandLiteral]
define ThisOrShorthandLiteralPeriod = oneOf! [
  sequential! [
    ["this", ThisLiteral]
    Period
  ]
  sequential! [
    ["this", ThisShorthandLiteral]
    maybe! Period, true
  ]
]

define RawDecimalDigits = oneOrMore! DecimalDigit

define DecimalDigits = sequential! [
  ["head", RawDecimalDigits]
  ["tail", zeroOrMore! sequential! [
    oneOrMore! Underscore
    ["this", RawDecimalDigits]
  ]]
], #(x)
  let parts = processCharCodes x.head
  for part in x.tail
    processCharCodes part, parts
  parts.join ""

define DecimalNumber = sequential! [
  ["integer", DecimalDigits]
  ["decimal", maybe! (sequential! [
    Period
    ["this", DecimalDigits]
  ], #(x) -> "." & x), NOTHING]
  ["scientific", maybe! (sequential! [
    ["e", eE]
    ["op", maybe! PlusOrMinus, NOTHING]
    ["digits", DecimalDigits]
  ], #(x) -> "e" & (if x.op != NOTHING then fromCharCode(x.op) else "") & x.digits), NOTHING]
  maybe! (sequential! [
    Underscore
    NamePart
  ]), true
], #(x, o, i)
  let mutable decimal = x.decimal
  if decimal == NOTHING
    decimal := ""
  let mutable scientific = x.scientific
  if scientific == NOTHING
    scientific := ""
  let text = x.integer & decimal & scientific
  let value = Number(text)
  if not isFinite value
    o.error "Unable to parse number: $text"
  o.node "const", i, value

let makeRadixInteger(radix, separator, digit)
  let digits = sequential! [
    ["head", oneOrMore! digit]
    ["tail", zeroOrMore! sequential! [
      oneOrMore! Underscore
      ["this", oneOrMore! digit]
    ]]
  ], #(x)
    let parts = processCharCodes x.head
    for part in x.tail
      processCharCodes part, parts
    parts.join ""
  sequential! [
    Zero
    ["separator", separator]
    ["integer", digits]
    ["decimal", maybe! (sequential! [
      Period
      ["this", digits]
    ]), NOTHING]
  ], #(x, o, i)
    let integer = x.integer
    let mutable decimal = x.decimal
    if decimal == NOTHING
      decimal := ""
    let mutable value = parseInt integer, radix
    if not isFinite value
      let decimalText = if decimal then ".$decimal" else ""
      o.error "Unable to parse number: 0$(fromCharCode x.separator)$(integer)$decimalText"
    if decimal
      while true
        let decimalNum = parseInt decimal, radix
        if isFinite(decimalNum)
          value += decimalNum / radix ^ decimal.length
          break
        else
          decimal := decimal.slice(0, -1)
    o.node "const", i, value

define HexInteger = makeRadixInteger 16, xX, HexDigit
define OctalInteger = makeRadixInteger 8, oO, OctalDigit
define BinaryInteger = makeRadixInteger 2, bB, BinaryDigit

define RadixInteger = do
  let GetDigits = do
    let digitCache = []
    #(radix) -> digitCache[radix] ?= do
      let digit = if radix == 2
        BinaryDigit
      else if radix == 8
        OctalDigit
      else if radix == 10
        DecimalDigit
      else if radix == 16
        HexDigit
      else
        do
          let chars = []
          for i = 0, radix max 10
            chars[i + "0".charCodeAt(0)] := true
          for i = 10, radix max 36
            chars[i - 10 + "a".charCodeAt(0)] := true
            chars[i - 10 + "A".charCodeAt(0)] := true
          #(o)
            let c = o.data.charCodeAt(o.index)
            if chars[c]
              o.index += 1
              c
            else
              false
      sequential! [
        ["head", oneOrMore! digit]
        ["tail", zeroOrMore! sequential! [
          oneOrMore! Underscore
          ["this", oneOrMore! digit]
        ]]
      ], #(x)
        let parts = processCharCodes x.head
        for part in x.tail
          processCharCodes part, parts
        parts.join ""
  
  let Radix = multiple! 1, 2, DecimalDigit
  #(o)
    let startIndex = o.index
    let clone = o.clone()
    let mutable radix = Radix(clone)
    if not radix
      return false
    radix := processCharCodes(radix).join ""
    
    if not LowerR(clone)
      return false
    
    let radixNum = Number(radix)
    if not isFinite radixNum
      o.error "Unable to parse radix: $radix"
    else if radixNum < 2 or radixNum > 36
      o.error "Radix must be at least 2 and at most 36, not $radixNum"
    
    let digits = GetDigits(radixNum)
    let integer = digits(clone)
    if not integer
      return false
    let mutable value = parseInt integer, radixNum
    if not isFinite value
      o.error "Unable to parse number: $(radixNum)r$(integer)"
    
    let subClone = clone.clone()
    if Period(subClone)
      let mutable decimal = digits(subClone)
      if decimal
        clone.update subClone
        while true
          let decimalNum = parseInt decimal, radixNum
          if isNaN(decimalNum)
            o.error "Unable to parse number: $(radixNum)r$integer.$decimal"
          else if isFinite(decimalNum)
            value += decimalNum / radixNum ^ decimal.length
            break
          else
            decimal := decimal.slice(0, -1)
    o.update clone
    o.node "const", startIndex, value

define NumberLiteral = sequential! [
  Space
  ["this", oneOf! [
    HexInteger
    OctalInteger
    BinaryInteger
    RadixInteger
    DecimalNumber
  ]]
]

let makeConstLiteral(name, value)
  word name, #(x, o, i)
    o.node "const", i, value

define NullLiteral = makeConstLiteral "null", null
define VoidLiteral = oneOf! [
  makeConstLiteral "undefined", void
  makeConstLiteral "void", void
]
define InfinityLiteral = makeConstLiteral "Infinity", Infinity
define NaNLiteral = makeConstLiteral "NaN", NaN
define TrueLiteral = makeConstLiteral "true", true
define FalseLiteral = makeConstLiteral "false", false

define SimpleConstantLiteral = oneOf! [
  NullLiteral
  VoidLiteral
  InfinityLiteral
  NaNLiteral
  TrueLiteral
  FalseLiteral
]

define HexEscapeSequence = shortCircuit! LowerX, sequential! [
  LowerX
  ["this", multiple! 2, 2, HexDigit]
], #(x) -> parseInt(processCharCodes(x).join(""), 16) or -1

define UnicodeEscapeSequence = shortCircuit! LowerU, sequential! [
  LowerU
  ["this", multiple! 4, 4, HexDigit]
], #(x) -> parseInt(processCharCodes(x).join(""), 16) or -1

define SingleEscapeCharacter = do
  let ESCAPED_CHARACTERS = {
    ("b".charCodeAt(0)): "\b".charCodeAt(0)
    ("f".charCodeAt(0)): "\f".charCodeAt(0)
    ("r".charCodeAt(0)): "\r".charCodeAt(0)
    ("n".charCodeAt(0)): "\n".charCodeAt(0)
    ("t".charCodeAt(0)): "\t".charCodeAt(0)
    ("v".charCodeAt(0)): "\v".charCodeAt(0)
    ("0".charCodeAt(0)): -1
    ("1".charCodeAt(0)): 1
    ("2".charCodeAt(0)): 2
    ("3".charCodeAt(0)): 3
    ("4".charCodeAt(0)): 4
    ("5".charCodeAt(0)): 5
    ("6".charCodeAt(0)): 6
    ("7".charCodeAt(0)): 7
  }
  
  mutate! AnyChar, #(c)
    if ESCAPED_CHARACTERS ownskey c
      ESCAPED_CHARACTERS[c]
    else
      c

define EscapeSequence = oneOf! [
  HexEscapeSequence
  UnicodeEscapeSequence
  SingleEscapeCharacter
]

define BackslashEscapeSequence = sequential! [
  Backslash
  ["this", EscapeSequence]
]

define StringInterpolation = shortCircuit! DollarSign, sequential! [
  DollarSign
  ["this", oneOf! [
    Identifier
    sequential! [
      OpenParenthesisChar
      ["this", ExpressionOrNothing]
      CloseParenthesis
    ]
  ]]
]

define SingleStringLiteral = shortCircuit! SingleQuote, sequential! [
  SingleQuote
  ["this", zeroOrMoreOf! [
    BackslashEscapeSequence
    anyExcept! [
      SingleQuote
      Newline
    ]
  ]]
  SingleQuote
], #(x, o, i) -> o.node "const", i, processCharCodes(x).join ""

define DoubleStringLiteral = shortCircuit! DoubleQuote, sequential! [
  DoubleQuote
  ["this", zeroOrMoreOf! [
    mutate! BackslashEscapeSequence
    StringInterpolation
    anyExcept! [
      DoubleQuote
      Newline
    ]
  ]]
  DoubleQuote
], #(x, o, i)
  let stringParts = []
  let mutable currentLiteral = []
  for part in x
    if typeof part == "number"
      currentLiteral.push part
    else if part.type != "nothing"
      if currentLiteral.length > 0
        stringParts.push processCharCodes(currentLiteral).join ""
        currentLiteral := []
      stringParts.push part
  if currentLiteral.length > 0
    stringParts.push processCharCodes(currentLiteral).join ""
  
  if stringParts.length == 0
    o.node "const", i, ""
  else if stringParts.length == 1 and typeof stringParts[0] == "string"
    o.node "const", i, stringParts[0]
  else
    o.node "string", i, stringParts

define StringIndent = #(o)
  let clone = o.clone()
  let mutable count = 1
  let currentIndent = clone.indent.peek()
  while count < currentIndent
    let c = SpaceChar(clone)
    if not c
      break
    let i = INDENTS[c]
    if not i
      throw Error "Unexpected indent char: $(JSON.stringify c)"
    count += i
  if count > currentIndent
    o.error "Mixed tabs and spaces in string literal"
  else if count < currentIndent and not Newline(clone.clone())
    false
  else
    o.update clone
    count

define TripleSingleStringLine = zeroOrMoreOf! [
  BackslashEscapeSequence
  anyExcept! [
    TripleSingleQuote
    Newline
  ]
], #(x) -> [processCharCodes(x).join("").replace(r"[\t ]+\$", "")]
define TripleDoubleStringLine = zeroOrMoreOf! [
  mutate! BackslashEscapeSequence
  StringInterpolation
  anyExcept! [
    TripleDoubleQuote
    Newline
  ]
], #(x)
  let stringParts = []
  let mutable currentLiteral = []
  for part in x
    if typeof part == "number"
      currentLiteral.push part
    else if part.type != "nothing"
      if currentLiteral.length > 0
        stringParts.push processCharCodes(currentLiteral).join ""
        currentLiteral := []
      stringParts.push part
  if currentLiteral.length > 0
    stringParts.push processCharCodes(currentLiteral).join("").replace(r"[\t ]+\$", "")
  
  stringParts

let makeTripleString(quote, line)
  shortCircuit! quote, sequential! [
    quote
    ["first", line]
    ["emptyLines", zeroOrMore! sequential! [
      _Space
      ["this", Newline]
    ]]
    ["rest", maybe! (sequential! [
      MaybeAdvance
      ["this", maybe! (sequential! [
        StringIndent
        ["head", line]
        ["tail", zeroOrMore! sequential! [
          Newline
          StringIndent
          ["this", line]
        ]]
      ], #(x) -> [x.head, ...x.tail]), #-> []]
      maybe! Newline, true
      PopIndent
    ]), #-> []]
    quote
  ], #(x, o, i)
    let lines = [x.first]
    if lines[0].length == 0 or (lines[0].length == 1 and lines[0][0] == "")
      lines.shift()
    for j = 0, x.emptyLines.length
      if j > 0 or lines.length > 0
        lines.push [""]
    lines.push ...x.rest
    let mutable len = lines.length
    if len > 0 and (lines[len - 1].length == 0 or (lines[len - 1].length == 1 and lines[len - 1][0] == ""))
      lines.pop()
      len -= 1
    
    let result = []
    for line, j in lines
      if j > 0
        result.push "\n"
      result.push ...line
    
    for j = result.length - 2, -1, -1
      if typeof result[j] == "string" and typeof result[j + 1] == "string"
        result.splice(j, 2, result[j] ~& result[j + 1])
    
    if result.length == 0
      o.node "const", i, ""
    else if result.length == 1 and typeof result[0] == "string"
      o.node "const", i, result[0]
    else
      o.node "string", i, result
define TripleSingleStringLiteral = makeTripleString TripleSingleQuote, TripleSingleStringLine
define TripleDoubleStringLiteral = makeTripleString TripleDoubleQuote, TripleDoubleStringLine

define LowerR = character! "r"
define RegexSingleToken = sequential! [LowerR, SingleQuote]
define RegexDoubleToken = sequential! [LowerR, DoubleQuote]
define RegexFlags = maybe! NamePart, #-> []
define RegexLiteral = oneOf! [
  shortCircuit! RegexDoubleToken, sequential! [
    RegexDoubleToken
    ["text", zeroOrMoreOf! [
      sequential! [
        DoubleQuote
        DoubleQuote
      ], '"'.charCodeAt 0
      sequential! [
        Backslash
        DollarSign
      ], "\$".charCodeAt 0
      anyExcept! [
        DoubleQuote
        Newline
        DollarSign
      ]
      StringInterpolation
    ]]
    DoubleQuote
    ["flags", RegexFlags]
  ]
  shortCircuit! RegexSingleToken, sequential! [
    RegexSingleToken
    ["text", zeroOrMoreOf! [
      sequential! [
        SingleQuote
        SingleQuote
      ], "'".charCodeAt 0
      anyExcept! [
        SingleQuote
        Newline
      ]
    ]]
    SingleQuote
    ["flags", RegexFlags]
  ]
], #(x, o, i)
  let stringParts = []
  let mutable currentLiteral = []
  for part in x.text
    if typeof part == "number"
      currentLiteral.push part
    else if part.type != "nothing"
      if currentLiteral.length > 0
        stringParts.push processCharCodes(currentLiteral).join ""
        currentLiteral := []
      stringParts.push part
  if currentLiteral.length > 0
    stringParts.push processCharCodes(currentLiteral).join ""

  let flags = processCharCodes(x.flags).join ""

  let str = if stringParts.length == 0
    o.node "const", i, ""
  else if stringParts.length == 1 and typeof stringParts[0] == "string"
    o.node "const", i, stringParts[0]
  else
    o.node "string", i, stringParts
  o.node "regexp", i, text: str, flags: flags

define StringLiteral = sequential! [
  Space
  ["this", oneOf! [
    TripleSingleStringLiteral
    TripleDoubleStringLiteral
    SingleStringLiteral
    DoubleStringLiteral
    RegexLiteral
    /*
    RawTripleSingleStringLiteral
    RawTripleDoubleStringLiteral
    RawSingleStringLiteral
    RawDoubleStringLiteral
    */
  ]]
]

define ConstantLiteral = oneOf! [
  SimpleConstantLiteral
  NumberLiteral
  StringLiteral
]

define ArgumentsLiteral = word "arguments", #(x, o, i) -> o.node "arguments", i

define Literal = oneOf! [
  ThisOrShorthandLiteral
  ArgumentsLiteral
  ConstantLiteral
]

define IdentifierNameConst = #(o)
  let startIndex = o.index
  let result = Name o
  if result
    o.node "const", startIndex, result
  else
    false

define IdentifierNameConstOrNumberLiteral = oneOf! [IdentifierNameConst, NumberLiteral]

define Identifier = do
  let RESERVED = [
    "and"
    "as"
    "AST"
    "arguments"
    "bitand"
    "bitlshift"
    "bitnot"
    "bitor"
    "bitrshift"
    "biturshift"
    "bitxor"
    "break"
    "case"
    "catch"
    "class"
    "const"
    "continue"
    "debugger"
    "default"
    "def"
    "delete"
    "do"
    "else"
    "enum"
    "eval"
    "export"
    "extends"
    "fallthrough"
    "false"
    "finally"
    "for"
    "function"
    "haskey"
    "if"
    "import"
    "Infinity"
    "instanceofsome"
    "instanceof"
    "in"
    "let"
    "log"
    "macro"
    "max"
    "min"
    "mutable"
    "namespace"
    "NaN"
    "new"
    "not"
    "null"
    "or"
    "ownskey"
    "repeat"
    "return"
    //"StopIteration"
    "super"
    "switch"
    "then"
    "this"
    "throw"
    "true"
    "try"
    "typeof"
    "undefined"
    "unless"
    "until"
    "var"
    "void"
    "while"
    "with"
    "xor"
    "yield"
  ]
  #(o)
    let index = o.index
    let clone = o.clone()
    let result = Name clone
    if not result or result in RESERVED
      o.fail "identifier"
      false
    else
      o.update clone
      o.node "ident", index, result

define NotToken = word "not"
define MaybeNotToken = maybe! NotToken, true

define ExistentialSymbol = symbol "?"
define MaybeExistentialSymbol = maybe! ExistentialSymbol, true
define ExistentialSymbolNoSpace = sequential! [
  NoSpace
  ["this", ExistentialSymbol]
]
define MaybeExistentialSymbolNoSpace = maybe! ExistentialSymbolNoSpace, true

define Operator = oneOf! [
  "^"
  "*"
  "/"
  "\\"
  "%"
  "+"
  "-"
  "bitlshift"
  "bitrshift"
  "biturshift"
  "min"
  "max"
  "&"
  "~^"
  "~*"
  "~/"
  "~\\"
  "~%"
  "~+"
  "~-"
  "~bitlshift"
  "~bitrshift"
  "~biturshift"
  "~min"
  "~max"
  "~&"
  "in"
  "haskey"
  "ownskey"
  "instanceof"
  "instanceofsome"
  "<=>"
  "~="
  "!~="
  "=="
  "!="
  "%%"
  "!%%"
  "~%%"
  "!~%%"
  "<"
  "<="
  ">"
  ">="
  "~<"
  "~<="
  "~>"
  "~>="
  "and"
  "or"
  "xor"
  "?"
  "bitand"
  "bitor"
  "bitxor"
  "~bitand"
  "~bitor"
  "~bitxor"
  sequential! [
    NotToken
    ["this", MaybeNotToken]
  ], #(x) -> if x == "not" then "bool" else "not"
  "bitnot"
  "~bitnot"
  sequential! [
    word "typeof"
    ["this", maybe! (character! "!"), NOTHING]
  ], #(x) -> if x != NOTHING then "typeof!" else "typeof"
  sequential! [
    ["this", oneOf! [
      word "num"
      word "str"
      word "strnum"
    ]]
    character! "!"
  ], #(x) -> x & "!"
  "delete"
  sequential! [
    word "throw"
    ["this", MaybeExistentialSymbolNoSpace]
  ], #(x) -> if x == "?" then "throw?" else "throw"
], #(x, o, i) -> o.node "operator", i, x

define Parenthetical = sequential! [
  OpenParenthesis
  ["this", oneOf! [
    Assignment
    Expression
    Operator
  ]]
  CloseParenthesis
], #(node, o, i) -> o.node "paren", i, node

define SpreadToken = sequential! [Space, Period, Period, Period], "..."
define MaybeSpreadToken = maybe! SpreadToken, true

define SpreadOrExpression = sequential! [
  ["spread", MaybeSpreadToken]
  ["node", Expression]
], #(x, o, i)
  if x.spread == "..."
    o.node "spread", i, x.node
  else
    x.node

define ArrayLiteral = sequential! [
    OpenSquareBracket
    Space
    ["first", maybe! (sequential! [
      ["head", SpreadOrExpression],
      ["tail", zeroOrMore! sequential! [
        Comma
        ["this", SpreadOrExpression]
      ]]
      MaybeComma
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    ["rest", maybe! (sequential! [
      SomeEmptyLines
      MaybeAdvance
      ["this", maybe! (sequential! [
        CheckIndent
        ["head", SpreadOrExpression]
        ["tail", zeroOrMore! sequential! [
          CommaOrNewlineWithCheckIndent
          ["this", SpreadOrExpression]
        ]]
      ], #(x) -> [x.head, ...x.tail]), #-> []]
      EmptyLines
      MaybeCommaOrNewline
      PopIndent
    ]), #-> []]
    CloseSquareBracket
  ], #(x, o, i)
    o.node "array", i, [...x.first, ...x.rest]

define ObjectKey = oneOf! [
  Parenthetical
  StringLiteral
  mutate! NumberLiteral, #(x, o, i) -> o.node "const", i, String(x.value)
  IdentifierNameConst
]

define ObjectKeyColon = sequential! [
  ["this", ObjectKey]
  Space
  Colon
  except! Colon
]

define DualObjectKey = shortCircuit! ObjectKeyColon, sequential! [
  ["key", ObjectKeyColon]
  ["value", Expression]
]

define IdentifierOrSimpleAccessStart = oneOf! [
  Identifier
  sequential! [
    ["parent", ThisOrShorthandLiteralPeriod]
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.node "access", i, x
  sequential! [
    ["parent", ThisOrShorthandLiteral]
    DoubleColon
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i)
    o.node "access", i, {
      parent: o.node "access", i, {
        x.parent
        child: o.node "const", i, "prototype"
      }
      x.child
    }
  sequential! [
    ["parent", ThisOrShorthandLiteral]
    ["proto", maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    ["child", Expression]
    CloseSquareBracket
  ], #(x, o, i)
    let mutable parent = x[0]
    if x.proto != NOTHING
      parent := o.node "access", i, {
        parent
        child: o.node "const", i, "prototype"
      }
    return o.node "access", i, { parent, x.child }
]

define IdentifierOrSimpleAccessPart = oneOf! [
  sequential! [
    ["type", oneOf! [Period, DoubleColon]]
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i)
    let isProto = x.type == "::"
    let child = x.child
    #(parent) -> o.node "access", i, {
      parent: (if isProto then o.node "access", i, {
          parent
          child: o.node "const", i, "prototype"
        } else parent)
      child
    }
  sequential! [
    ["type", maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    ["child", Expression]
    CloseSquareBracket
  ], #(x, o, i)
    let isProto = x.type != NOTHING
    let child = x.child
    #(parent) -> o.node "access", i, {
      parent: (if isProto then o.node "access", i, {
          parent
          child: o.node "const", i, "prototype"
        } else parent)
      child
    }
]

define IdentifierOrSimpleAccess = sequential! [
  ["head", IdentifierOrSimpleAccessStart]
  ["tail", zeroOrMore! IdentifierOrSimpleAccessPart]
], #(x, o, i)
  let mutable current = x.head
  for creator in x.tail
    current := creator current
  current

define SingularObjectKey = oneOf! [
  mutate! IdentifierOrSimpleAccess, #(ident, o, i)
    let key = if ident.type == "access"
      ident.value.child
    else if ident.type == "ident"
      o.node "const", i, ident.value
    else
      o.error "Unknown ident type: $(ident.type)"
    { key, value: ident }
  mutate! ConstantLiteral, #(node, o, i)
    let key = if node.type == "const" and typeof node.value != "string"
      o.node "const", i, String(node.value)
    else
      node
    { key, value: node }
  mutate! ThisLiteral, #(node, o, i)
    {
      key: o.node "const", i, "this"
      value: node
    }
  mutate! ArgumentsLiteral, #(node, o, i)
    {
      key: o.node "const", i, "arguments"
      value: node
    }
  sequential! [
    symbol("-")
    ["this", oneOf! [NumberLiteral, InfinityLiteral]]
  ], #(x, o, i)
    {
      key: o.node "const", i, String(-x.value)
      value: o.node "unary", i, {
        op: "-"
        node: x
      }
    }
  mutate! Parenthetical, #(node) -> { key: node, value: node }
]

define KeyValuePair = oneOf! [
  DualObjectKey
  SingularObjectKey
]

define ObjectLiteral = sequential! [
  OpenCurlyBrace
  Space
  ["first", maybe! (sequential! [
    ["head", KeyValuePair],
    ["tail", zeroOrMore! sequential! [
      Comma
      ["this", KeyValuePair]
    ]]
    MaybeComma
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  ["rest", maybe! (sequential! [
    SomeEmptyLines
    MaybeAdvance
    ["this", maybe! (sequential! [
      CheckIndent
      ["head", KeyValuePair]
      ["tail", zeroOrMore! sequential! [
        CommaOrNewlineWithCheckIndent
        ["this", KeyValuePair]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    EmptyLines
    MaybeCommaOrNewline
    PopIndent
  ]), #-> []]
  CloseCurlyBrace
], #(x, o, i)
  o.node "object", i, [...x.first, ...x.rest]

define IndentedObjectLiteral = sequential! [
  Space
  Newline
  EmptyLines
  Advance
  CheckIndent
  ["head", DualObjectKey]
  Space
  ["tail", zeroOrMore! sequential! [
    CommaOrNewline
    CheckIndent
    ["this", DualObjectKey]
    Space
  ]]
  PopIndent
], #(x, o, i) -> o.node "object", i, [x.head, ...x.tail]

define InBlock = sequential! [
  Advance
  ["this", Block]
  PopIndent
]

define Body = sequential! [
  Space
  Newline
  EmptyLines
  ["this", InBlock]
]
define BodyOrStatement = oneOf! [
  Body
  Statement
]

define DedentedBody = sequential! [
  Space
  Newline
  EmptyLines
  ["this", Block]
]

define DeclareEqualSymbol = withSpace character! "="

define MutableToken = word "mutable"
define MaybeMutableToken = maybe! MutableToken, true

define SimpleType = oneOf! [
  IdentifierOrSimpleAccess
  VoidLiteral
  NullLiteral
]

define SimpleOrArrayType = oneOf! [
  SimpleType
  ArrayType
]

define UnionType = sequential! [
  OpenParenthesis
  ["head", SimpleOrArrayType]
  ["tail", zeroOrMore! sequential! [
    Pipe
    ["this", SimpleOrArrayType]
  ]]
  CloseParenthesis
], #(x, o, i) -> o.node "typeunion", i, [x.head, ...x.tail]

define ArrayType = sequential! [
  OpenSquareBracket
  ["this", TypeReference]
  CloseSquareBracket
], #(x, o, i) -> o.node "typearray", i, x

define TypeReference = oneOf! [
  IdentifierOrSimpleAccess
  UnionType
  ArrayType
]

define AsToken = word "as"
define AsType = shortCircuit! AsToken, sequential! [
  AsToken
  ["this", TypeReference]
]

define MaybeAsType = maybe! AsType, NOTHING

define IdentifierParameter = sequential! [
  ["isMutable", MaybeMutableToken]
  ["spread", MaybeSpreadToken]
  ["parent", maybe! ThisOrShorthandLiteralPeriod, NOTHING]
  ["ident", Identifier]
  ["asType", MaybeAsType]
  ["defaultValue", maybe! (sequential! [
    DeclareEqualSymbol
    ["this", Expression]
  ]), NOTHING]
], #(x, o, i)
  let name = if x.parent != NOTHING
    o.node "access", i, {
      x.parent
      child: o.node "const", i, x.ident.value
    }
  else
    x.ident
  if x.spread == "..." and x.defaultValue != NOTHING
    o.error "Cannot specify a default value for a spread parameter"
  return o.node "param", i, {
    ident: name
    defaultValue: if x.defaultValue != NOTHING then x.defaultValue else void
    spread: x.spread == "..."
    isMutable: x.isMutable == "mutable"
    asType: if x.asType != NOTHING then x.asType else void
  }

define Parameter = oneOf! [
  IdentifierParameter
  ArrayParameter
  ObjectParameter
]

let validateSpreadParameters(params, o)
  let mutable spreadCount = 0
  for param in params
    if param.type == "param" and param.value.spread
      spreadCount += 1
      if spreadCount > 1
        o.error "Cannot have more than one spread parameter"
  params

define ArrayParameter = sequential! [
  OpenSquareBracket
  EmptyLines
  ["this", maybe! (sequential! [
    ["head", Parameter]
    ["tail", zeroOrMore! sequential! [
      CommaOrNewline
      ["this", Parameter]
    ]]
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseSquareBracket
], #(x, o, i) -> o.node "array", i, validateSpreadParameters(x, o)

define ParamDualObjectKey = sequential! [
  ["key", ObjectKey]
  Colon
  ["value", Parameter]
]

define ParamSingularObjectKey = mutate! IdentifierParameter, #(param, o, i)
  let ident = param.value.ident
  let key = if ident.type == "ident"
    o.node "const", i, ident.value
  else if ident.type == "access"
    ident.child
  else
    throw Error "Unknown object key type: $(ident.type)"
  { key, value: param }

define KvpParameter = oneOf! [
  ParamDualObjectKey
  ParamSingularObjectKey
]

define ObjectParameter = sequential! [
  OpenCurlyBrace
  EmptyLines
  ["this", maybe! (sequential! [
    ["head", KvpParameter]
    ["tail", zeroOrMore! sequential! [
      CommaOrNewline
      ["this", KvpParameter]
    ]]
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseCurlyBrace
], #(x, o, i) -> o.node "object", i, x

define Parameters = sequential! [
  ["head", Parameter]
  ["tail", zeroOrMore! sequential! [
    CommaOrNewline
    ["this", Parameter]
  ]]
], #(x, o, i) -> validateSpreadParameters [x.head, ...x.tail], o

define ParameterSequence = sequential! [
  OpenParenthesis
  EmptyLines
  ["this", maybe! Parameters, #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseParenthesis
]

define FunctionBody = oneOf! [
  sequential! [
    symbol "->"
    ["this", maybe! Statement, #(x, o, i) -> o.node "nothing", i]
  ]
  Body
]

define FunctionDeclaration = sequential! [
  ["params", maybe! ParameterSequence, #-> []]
  ["autoReturn", maybe! character!("!"), NOTHING]
  ["bound", maybe! AtSign, NOTHING]
  ["body", FunctionBody]
], #(x, o, i) -> o.node "function", i, {
  x.params
  autoReturn: x.autoReturn == NOTHING
  bound: x.bound != NOTHING
  x.body
}

define FunctionLiteral = shortCircuit! HashSign, sequential! [
  HashSign
  ["this", FunctionDeclaration]
]

define AstToken = word "AST"
define Ast = inAst shortCircuit! AstToken, sequential! [
  AstToken
  ["this", BodyOrStatement]
], #(x, o, i) -> o.node "ast", i, x

define Debugger = word "debugger", #(x, o, i) -> o.node "debugger", i

define MacroName = sequential! [
  Space
  ["this", oneOrMoreOf! [
    _Symbol
    _Name
  ], #(x) -> x.join ""]
]

define UseMacro = #(o)
  let clone = o.clone()
  let macros = clone.macros
  let name = MacroName clone
  if name
    let m = macros.getByName(name)
    if m
      return m o
  false

define AsToken = word "as"
define MacroSyntaxParameterType = sequential! [
  ["type", oneOf! [
    Identifier
    StringLiteral
    sequential! [
      OpenParenthesis
      EmptyLines
      ["this", MacroSyntaxParameters]
      EmptyLines
      MaybeCommaOrNewline
      CloseParenthesis
    ], #(x, o, i) -> o.node "sequence", i, x
    sequential! [
      OpenParenthesis
      EmptyLines
      ["this", MacroSyntaxChoiceParameters]
      EmptyLines
      CloseParenthesis
    ], #(x, o, i) -> o.node("choice", i, x)
  ]]
  ["multiplier", maybe! (oneOf! [
    symbol "?"
    symbol "*"
    symbol "+"
  ]), NOTHING]
], #(x, o, i)
  if x.multiplier == NOTHING
    x.type
  else
    o.node "many", i, x

define MacroSyntaxParameter = oneOf! [
  StringLiteral
  sequential! [
    ["ident", oneOf! [
      ThisOrShorthandLiteral
      Identifier
    ]]
    ["type", maybe! (sequential! [
      AsToken
      ["this", MacroSyntaxParameterType]
    ]), NOTHING]
  ], #(x, o, i) -> o.node "param", i, {
    ident: x.ident
    type: if x.type == NOTHING then void else x.type
  }
]

define MacroSyntaxParameters = sequential! [
  ["head", MacroSyntaxParameter]
  ["tail", zeroOrMore! sequential! [
    Comma
    ["this", MacroSyntaxParameter]
  ]]
], #(x) -> [x.head, ...x.tail]

define MacroSyntaxChoiceParameters = sequential! [
  ["head", MacroSyntaxParameterType]
  ["tail", zeroOrMore! sequential! [
    Pipe
    ["this", MacroSyntaxParameterType]
  ]]
], #(x) -> [x.head, ...x.tail]

define SyntaxToken = word "syntax"

define MacroSyntax = sequential! [
  CheckIndent
  ["params", shortCircuit! SyntaxToken, sequential! [
    SyntaxToken
    ["this", MacroSyntaxParameters]
  ]]
  ["body", FunctionBody]
  Space
  CheckStop
], #(x, o, i)
  o.macroSyntax i, "syntax", x.params, x.body
  true

define MacroBody = oneOf! [
  sequential! [
    Space
    Newline
    EmptyLines
    ["this", sequential! [
      Advance
      ["head", MacroSyntax]
      ["tail", zeroOrMore! sequential! [
        Newline
        EmptyLines
        ["this", MacroSyntax]
      ]]
      PopIndent
    ]]
  ], #(x) -> true
  sequential! [
    ["params", ParameterSequence]
    ["body", FunctionBody]
  ], #(x, o, i)
    o.macroSyntax i, "call", x.params, x.body
    true
]

define MacroToken = word "macro"
define Macro = shortCircuit! MacroToken, sequential! [
  MacroToken
  named "(identifier MacroBody)", #(o)
    let name = MacroName o
    if name
      o.startMacro(name)
      try
        MacroBody o
      finally
        o.endMacro()
    else
      false
], #(x, o, i) -> o.node("nothing", i)

define DefineHelperStart = sequential! [word("define"), word("helper")]
define DefineHelper = shortCircuit! DefineHelperStart, sequential! [
  DefineHelperStart
  ["name", Identifier]
  DeclareEqualSymbol
  ["value", Expression]
], #(x, o, i) -> o.node "definehelper", i, x

define Nothing = #(o) -> o.node "nothing", o.index
define ExpressionOrNothing = oneOf! [
  Expression
  Nothing
]

let _indexSlice = new Stack false
let inIndexSlice = makeAlterStack _indexSlice, true

define IndexSlice = inIndexSlice sequential! [
  ["left", ExpressionOrNothing]
  Colon
  ["right", ExpressionOrNothing]
], #(x) -> {
  type: "slice"
  left: if x.type == "nothing" then null else x.left
  right: if x.type == "nothing" then null else x.right
}

define IndexMultiple = sequential! [
  ["head", Expression]
  ["tail", zeroOrMore! sequential! [
    CommaOrNewline
    ["this", Expression]
  ]]
], #(x)
  if x.tail.length > 0
    {
      type: "multi"
      elements: [x.head, ...x.tail]
    }
  else
    {
      type: "single"
      node: x.head
    }

define Index = oneOf! [IndexSlice, IndexMultiple]

define IdentifierOrAccessStart = oneOf! [
  Identifier
  sequential! [
    ["parent", ThisOrShorthandLiteralPeriod]
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.node "access", i, x
  sequential! [
    ["parent", ThisOrShorthandLiteral]
    DoubleColon
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.node "access", i, {
    parent: o.node "access", i, {
      x.parent
      child: o.node "const", i, "prototype"
    }
    x.child
  }
  sequential! [
    ["parent", ThisOrShorthandLiteral]
    ["isProto", maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    ["child", Index]
    CloseSquareBracket
  ], #(x, o, i)
    let mutable parent = x.parent
    if x.isProto != NOTHING
      parent := o.node "access", i, {
        parent
        child: o.node "const", i, "prototype"
      }
    o.node "index", i, { parent, x.child }
]

define IdentifierOrAccessPart = oneOf! [
  sequential! [
    ["type", oneOf! [Period, DoubleColon]]
    ["child", IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> #(mutable parent)
    if x.type == "::"
      parent := o.node "access", i, {
        parent
        child: o.node "const", i, "prototype"
      }
    o.node "access", i, { parent, x.child }
  sequential! [
    ["type", maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    ["child", Index]
    CloseSquareBracket
  ], #(x, o, i) -> #(mutable parent)
    if x.type != NOTHING
      parent := o.node "access", i, {
        parent
        child: o.node "const", i, "prototype"
      }
    o.node "index", i, { parent, x.child }
]

define IdentifierOrAccess = sequential! [
  ["head", IdentifierOrAccessStart]
  ["tail", zeroOrMore! IdentifierOrAccessPart]
], #(x, o, i)
  let mutable current = x.head
  for part in x.tail
    current := part(current)
  current

let SimpleAssignable = IdentifierOrAccess

define ComplexAssignable = oneOf! [
  SimpleAssignable
  //ArrayAssignable
  //ObjectAssignable
]

define ColonEqual = sequential! [
  Space
  Colon
  character! "="
], ":="
define DirectAssignment = sequential! [
  ["left", ComplexAssignable]
  ["op", ColonEqual]
  ["right", Expression]
], #(x, o, i) -> o.node "assign", i, x

define CompoundAssignmentOp = oneOf! [
  "&="
  "+="
  "-="
  "/="
  "\\="
  "%="
  "*="
  "^="
  "~&="
  "~+="
  "~-="
  "~/="
  "~\\="
  "~%="
  "~*="
  "~^="
  "?="
  "or="
  "and="
  "xor="
  "bitand="
  "bitor="
  "bitxor="
  "bitlshift="
  "bitrshift="
  "biturshift="
  "min="
  "max="
  "~bitand="
  "~bitor="
  "~bitxor="
  "~bitlshift="
  "~bitrshift="
  "~biturshift="
  "~min="
  "~max="
]

define CompoundAssignment = sequential! [
  ["left", SimpleAssignable]
  ["op", CompoundAssignmentOp]
  ["right", Expression]
], #(x, o, i) -> o.node "assign", i, x

define Assignment = oneOf! [DirectAssignment, CompoundAssignment]

define PrimaryExpression = oneOf! [
  UnclosedObjectLiteral
  Literal
  Parenthetical
  ArrayLiteral
  ObjectLiteral
  FunctionLiteral
  Ast
  Debugger
  UseMacro
  Identifier
]

define UnclosedObjectLiteral = sequential! [
  #(o) -> not _indexSlice.peek()
  ["head", DualObjectKey]
  ["tail", zeroOrMore! sequential! [
    Comma
    ["this", DualObjectKey]
  ]]
], #(x, o, i) -> o.node "object", i, [x.head, ...x.tail]

define ClosedArguments = sequential! [
  OpenParenthesisChar
  Space
  ["first", maybe! (sequential! [
    ["head", SpreadOrExpression],
    ["tail", zeroOrMore! sequential! [
      Comma
      ["this", SpreadOrExpression]
    ]]
    MaybeComma
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  ["rest", maybe! (sequential! [
    SomeEmptyLines
    MaybeAdvance
    ["this", maybe! (sequential! [
      CheckIndent
      ["head", SpreadOrExpression]
      ["tail", zeroOrMore! sequential! [
        CommaOrNewlineWithCheckIndent
        ["this", SpreadOrExpression]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    EmptyLines
    MaybeCommaOrNewline
    PopIndent
  ]), #-> []]
  CloseParenthesis
], #(x, o, i) -> [...x.first, ...x.rest]

define UnclosedArguments = oneOf! [
  sequential! [
    SomeSpace, // FIXME: do I need this?
    ["this", sequential! [
      ["head", SpreadOrExpression],
      ["tail", zeroOrMore! sequential! [
        Comma
        ["this", SpreadOrExpression]
      ]]
      MaybeComma
    ], #(x) -> [x.head, ...x.tail]]
  ]
//  mutate! IndentedArrayLiteral, #(x) -> [x]
//  mutate! IndentedObjectLiteral, #(x) -> [x]
]

define InvocationArguments = oneOf! [ClosedArguments, UnclosedArguments]

define BasicInvocationOrAccess = sequential! [
  ["isNew", maybe! word("new"), NOTHING]
  ["head", oneOf! [
    sequential! [
      ["node", ThisShorthandLiteral]
      ["existential", MaybeExistentialSymbolNoSpace]
      ["child", IdentifierNameConstOrNumberLiteral]
    ], #(x, o, i) -> {
      type: "thisAccess"
      x.node
      x.child
      existential: x.existential == "?"
    }
    mutate! PrimaryExpression, #(x) -> {
      type: "normal"
      node: x
    }
  ]]
  ["tail", zeroOrMoreOf! [
    sequential! [
      ["existential", MaybeExistentialSymbolNoSpace]
      EmptyLines
      Space
      ["type", oneOf! [Period, DoubleColon]]
      ["child", IdentifierNameConstOrNumberLiteral]
    ], #(x) -> {
      type: if x.type == "::" then "protoAccess" else "access"
      x.child
      existential: x.existential == "?"
    }
    sequential! [
      ["existential", MaybeExistentialSymbolNoSpace]
      ["type", maybe! DoubleColon, "index", "protoIndex"]
      OpenSquareBracketChar
      ["child", Index]
      CloseSquareBracket
    ], #(x) -> {
      x.type
      x.child
      existential: x.existential == "?"
    }
    sequential! [
      ["existential", MaybeExistentialSymbolNoSpace]
      ["args", InvocationArguments]
    ], #(x) -> {
      type: "call"
      x.args
      existential: x.existential == "?"
      isNew: false
    }
    sequential! [
      ExistentialSymbolNoSpace
      ["this", InvocationOrAccess]
    ], #(x) -> {
      type: "?"
      child: x
    }
  ]]
], #(x, o, i)
  let mutable isNew = x.isNew != NOTHING
  let head = x.head
  let tail = x.tail

  if tail.length == 0 and not isNew and head.type == "normal"
    return head.node

  let links = []
  if head.type == "thisAccess"
    links.push { type: "access", head.child, head.existential }
  
  for part in tail
    if part.type in ["protoAccess", "protoIndex"]
      links.push { type: "access", child: o.node("const", i, "prototype"), part.existential }
      let clone = copy(part)
      clone.type := if part.type == "protoAccess" then "access" else "index"
      links.push clone
    else if part.type in ["access", "index"]
      links.push part
    else if part.type == "call"
      let clone = copy(part)
      clone.isNew := isNew
      isNew := false
      links.push clone
    else if part.type == "?"
      if isNew
        links.push { type: "call", args: [], existential: false, isNew: true }
        isNew := false
      links.push part
    else
      o.error "Unknown link type: $(part.type)"
  
  if isNew
    links.push { type: "call", args: [], existential: false, isNew: true }
  
  o.node "callchain", i, { head: head.node, links }

define EvalToken = word "eval"
define Eval = shortCircuit! EvalToken, sequential! [
  EvalToken
  ["this", InvocationArguments]
], #(args, o, i)
  if args.length != 1
    o.error("Expected only one argument to eval")
  return o.node "eval", i, args[0]

define InvocationOrAccess = oneOf! [
  BasicInvocationOrAccess
  Eval
]

define ExistentialUnary = sequential! [
  ["node", InvocationOrAccess]
  ["op", MaybeExistentialSymbolNoSpace]
], #(x, o, i)
  if x.op == "?"
    o.node "unary", i, x
  else
    x.node

define Unary = sequential! [
  ["op", maybe! (oneOf! [
    sequential! [
      NotToken
      ["this", MaybeNotToken]
    ], #(x) -> if x == "not" then "bool" else "not"
    word "bitnot"
    wordOrSymbol "~bitnot"
    sequential! [
      word "typeof"
      ["this", maybe! (character! "!"), NOTHING]
    ], #(x) -> if x != NOTHING then "typeof!" else "typeof"
    sequential! [
      ["this", oneOf! [
        word "num"
        word "str"
        word "strnum"
      ]]
      character! "!"
    ], #(x) -> x & "!"
    word "delete"
    sequential! [
      word "throw"
      ["this", MaybeExistentialSymbolNoSpace]
    ], #(x) -> if x == "?" then "throw?" else "throw"
  ]), NOTHING]
  ["node", ExistentialUnary]
], #(x, o, i)
  if x.op != NOTHING
    return o.node "unary", i, x
  else
    return x.node

define Negate = sequential! [
  ["op", maybe! (sequential! [
    ["this", oneOf! [
      symbol "+"
      symbol "-"
      symbol "~+"
      symbol "~-"
      symbol "^"
    ]]
    NoSpace
  ]), NOTHING]
  ["node", Unary]
], #(x, o, i)
  if x.op != NOTHING
    if x.node.type == "const" and typeof x.node.value == "number" and x.op in ["+", "-", "~+", "~-"]
      o.node "const", i, if x.op in ["+", "~+"] then +x.node.value else -x.node.value
    else
      o.node "unary", i, x
  else
    x.node

let binaryLeftToRight(x, o, i)
  let mutable current = x.head
  for part in x.tail
    current := o.node "binary", i, {
      left: current
      right: part.node
      part.op
    }
  current

let binaryRightToLeft(x, o, i)
  let head = x.head
  let tail = x.tail

  if tail.length == 0
    head
  else
    let mutable current = tail[tail.length - 1].node
    for j = tail.length - 1, 0, -1
      current := o.node "binary", i, {
        left: tail[j - 1].node
        right: current
        tail[j].op
      }
    o.node "binary", i, {
      left: head
      right: current
      tail[0].op
    }
macro makeBinary!(operators, nextRule, minimumExtra, maximumExtra, rightToLeft)
  if not @isArray operators
    operators := @array [operators]
  
  let init = []
  nextRule := @cache nextRule, init, true
  
  let opChoices = @array for x in @elements(operators)
    if @isConst(x)
      unless typeof @value(x) == "string"
        throw Error "Unexpected non-string const: $(@value x)"
      AST wordOrSymbol $x
    else
      x
  
  if not minimumExtra
    minimumExtra := AST 0
  if not maximumExtra
    maximumExtra := AST 0
  //if not @isConst(minimumExtra) or typeof @value(minimumExtra) != "number"
  //  throw Error "Expected minimumExtra to be a const number"
  //if not @isConst(maximumExtra) or typeof @value(maximumExtra) != "number"
  //  throw Error "Expected maximumExtra to be a const number"
  if rightToLeft and not @isConst(rightToLeft)
    throw Error "Expected rightToLeft to be a const"
  
  let mutator = if @value(rightToLeft) then AST binaryRightToLeft else AST binaryLeftToRight
  
  let result = AST sequential! [
    ["head", $nextRule]
    ["tail", multiple! $minimumExtra, $maximumExtra, sequential! [
      ["op", oneOf! $opChoices]
      ["node", $nextRule]
    ]]
  ], $mutator
  if init.length
    AST do
      $init
      $result
  else
    result

define Exponentiation = makeBinary! ["^", "~^"], Negate, 0, 0, true

define Multiplication = makeBinary! ["*", "/", "%", "\\", "~*", "~/", "~%", "~\\"], Exponentiation
define Addition = makeBinary! ["+", "-", "~+", "~-"], Multiplication

define BitwiseShift = makeBinary! ["bitlshift", "bitrshift", "biturshift"], Addition, 0, 1

define Min = makeBinary! "min", BitwiseShift, 1
define Max = makeBinary! "max", BitwiseShift, 0
define MinMax = oneOf! [
  Min
  Max
]

define StringConcatenation = makeBinary! ["&", "~&"], MinMax

define Containment = mutate! (makeBinary! (sequential! [
  ["inverse", MaybeNotToken]
  ["op", oneOf! [
    "in"
    "haskey"
    "ownskey"
    "instanceof"
    "instanceofsome"
  ]]
], #(x)
  if x.inverse == "not"
    "not $(x.op)"
  else
    x.op), StringConcatenation, 0, 1), #(x, o, i)
  if x and x.type == "binary" and x.value.op.substring(0, 4) == "not "
    o.node "unary", i, {
      op: "not"
      node: o.node "binary", i, {
        x.value.left
        x.value.right
        op: x.value.op.substring(4)
      }
    }
  else
    x

define Spaceship = makeBinary! "<=>", Containment, 0, 1

define Comparison = makeBinary! ["~=", "!~=", "==", "!=", "%%", "!%%", "~%%", "!~%%", "<", "<=", ">", ">=", "~<", "~<=", "~>", "~>="], Spaceship, 0, 1

define LogicalAnd = makeBinary! "and", Comparison, 1
define LogicalOr = makeBinary! "or", Comparison, 1
define LogicalXor = makeBinary! "xor", Comparison, 1
define ExistentialOr = makeBinary! ExistentialSymbol, Comparison, 1, 0, true
define BitwiseAnd = makeBinary! "bitand", Comparison, 1
define BitwiseOr = makeBinary! "bitor", Comparison, 1
define BitwiseXor = makeBinary! "bitxor", Comparison, 1

define Logic = oneOf! [
  LogicalAnd
  LogicalOr
  LogicalXor
  ExistentialOr
  BitwiseAnd
  BitwiseOr
  BitwiseXor
  Comparison
]

define ExpressionAsStatement = oneOf! [
  UseMacro
  Logic
]
define Expression = inExpression ExpressionAsStatement 

define IdentifierDeclarable = sequential! [
  ["isMutable", MaybeMutableToken]
  ["ident", Identifier]
], #(x, o, i) -> o.node "declarable", i, {
  x.ident
  isMutable: x.isMutable == "mutable"
}

define Declarable = oneOf! [
  IdentifierDeclarable
  //ArrayDeclarable
  //ObjectDeclarable
]

define LetToken = word "let"
define Let = shortCircuit! LetToken, sequential! [
  LetToken
  ["left", Declarable]
  ["right", oneOf! [
    sequential! [
      DeclareEqualSymbol
      ["this", Expression]
    ]
    FunctionDeclaration
  ]]
], #(x, o, i) -> o.node "let", i, x

define ReturnToken = word "return"
define Return = shortCircuit! ReturnToken, sequential! [
  ReturnToken
  ["existential", MaybeExistentialSymbolNoSpace]
  ["node", ExpressionOrNothing]
], #(x, o, i) -> o.node "return", i, {
  x.node
  existential: x.existential == "?"
}

define YieldToken = word "yield"
define Yield = shortCircuit! YieldToken, sequential! [
  YieldToken
  ["multiple", maybe! Asterix, NOTHING]
  ["node", Expression]
], #(x, o, i) -> o.node "yield", i, {
  multiple: x.multiple != NOTHING
  x.node
}

define Break = word "break", #(x, o, i) -> o.node "break", i

define Continue = word "continue", #(x, o, i) -> o.node "continue", i

define Statement = sequential! [
  ["this", inStatement oneOf! [
    Let
    //Def
    Return
    Yield
    Break
    Continue
    Macro
    DefineHelper
    //Constructor
    Assignment
    ExpressionAsStatement
  ]]
  Space
  // TODO: have statement decorators?
]

define Line = sequential! [
  CheckIndent
  ["this", Statement]
]

define Block = sequential! [
  ["head", Line]
  ["tail", zeroOrMore! sequential! [
    Newline
    EmptyLines
    ["this", Line]
  ]]
], #(x, o, i)
  let body = []
  for item in [x.head, ...x.tail]
    if item.type == "block"
      body.push ...item.value
    else
      body.push item
  o.node "block", i, body

define Root = sequential! [
  maybe! Shebang, true
  EmptyLines
  ["this", oneOf! [
    Block
    Nothing
  ]]
  EmptyLines
  Space
], #(x, o, i) -> o.node "root", i, x

let ParserError = do
  let ParserError(message, text, index)
    let _this = ^ParserError.prototype
    Error.call _this, message
    
    // TODO: line numbers
    _this.message := "$message at $index"
    _this.text := text
    _this.index := index
    
    _this
  ParserError.prototype := ^Error.prototype
  ParserError::constructor := ParserError

  ParserError

let FailureManager = do
  let FailureManager()!
    if this not instanceof FailureManager
      throw TypeError "Must be instantiated with new"
    @messages := []
    @position := 0
  
  FailureManager::add := #(message, index)!
    if index > @position
      @messages := []
      @position := index
    if index >= @position
      @messages.push message
  
  FailureManager

let MacroHelper = do
  let MacroHelper(@state, @index, @expr)!
    if this not instanceof MacroHelper
      throw TypeError "Must be instantiated with new"
    @unsavedTmps := []
    @savedTmps := []
  
  MacroHelper::if := #(test, whenTrue, whenFalse) -> @state.node "if", @index, { test, whenTrue, whenFalse }
  MacroHelper::for := #(init, test, step, body) -> @state.node "for", @index, { init, test, step, body }
  MacroHelper::forIn := #(key, object, body) -> @state.node "forin", @index, { key, object, body }
  MacroHelper::tryCatch := #(tryBody, catchIdent, catchBody) -> @state.node "trycatch", @index, { tryBody, catchIdent, catchBody }
  MacroHelper::tryFinally := #(tryBody, finallyBody) -> @state.node "tryfinally", @index, { tryBody, finallyBody }
  
  let getTmpId = do
    let id = -1
    #-> id += 1
  
  MacroHelper::tmp := #(save)
    let id = getTmpId()
    (if save then @savedTmps else @unsavedTmps).push id
    @state.node "tmp", @index, id
  
  MacroHelper::getTmps := #-> {
    unsaved: @unsavedTmps[:]
    saved: @savedTmps[:]
  }
  
  MacroHelper::isConst := #(node) -> node == void or (node? and (node.type == "const" or (node.type == "block" and node.value.length == 0)))
  MacroHelper::value := #(node)
    if node == void
      void
    else if node?
      if node.type == "const"
        node.value
      else if node.type == "block" and node.value.length == 0
        void
  MacroHelper::const := #(value)
    if value instanceof RegExp or value == null or typeof value in ["undefined", "boolean", "string", "number"]
      {
        type: "const"
        value
      }
    else
      throw Error("Cannot make a const out of $(String value)")
  
  MacroHelper::isIdent := #(node) -> node? and node.type == "ident"
  MacroHelper::name := #(node)
    if node? and node.type == "ident"
      node.value
  MacroHelper::ident := #(name)
    if typeof name != "string"
      throw TypeError "Expected a string"
    {
      type: "ident"
      value: name
    }
  
  MacroHelper::isCall := #(node)
    if node? and node.type == "callchain"
      let links = node.value.links
      links[links.length - 1].type == "call"
    else
      false
  
  MacroHelper::callFunc := #(node)
    if node? and node.type == "callchain"
      let links = node.value.links
      if links[links.length - 1].type == "call"
        {
          node.type
          node.startIndex
          node.endIndex
          value: {
            head: node.value.head
            links: links[:links.length - 1]
          }
        }
  
  MacroHelper::callArgs := #(node)
    if node? and node.type == "callchain"
      let links = node.value.links
      if links[links.length - 1].type == "call"
        links[links.length - 1].args
  
  MacroHelper::callIsNew := #(node)
    if node? and node.type == "callchain"
      let links = node.value.links
      if links[links.length - 1].type == "call"
        return not not links[links.length - 1].isNew
    false
  
  MacroHelper::call := #(func, args, isNew = false)
    if not func or typeof func != "object"
      throw TypeError "Expected func to be an object, got $(typeof! func)"
    if not Array.isArray args
      throw TypeError "Expected args to be an Array, got $(typeof! args)"
    if typeof isNew != "boolean"
      throw TypeError "Expected isNew to be a Boolean, got $(typeof! isNew)"
    if func.type == "callchain"
      {
        type: "callchain"
        func.startIndex
        func.endIndex
        value: {
          head: func.value.head
          links: [
            ...func.value.links
            {
              type: "call"
              args
              isNew: not not isNew
            }
          ]
        }
      }
    else
      {
        type: "callchain",
        func.startIndex
        func.endIndex
        value: {
          head: func
          links: [
            {
              type: "call"
              args
              isNew: not not isNew
            }
          ]
        }
      }
  
  MacroHelper::func := #(params, body, autoReturn = true, bound = false)
    if not Array.isArray params
      throw TypeError "Expected params to be an Array, got $(typeof! params)"
    else if not body or typeof body != "object"
      throw TypeError "Expected body to be an object, got $(typeof! body)"
    else if typeof autoReturn != "boolean"
      throw TypeError "Expected autoReturn to be a boolean, got $(typeof! autoReturn)"
    else if typeof bound != "boolean"
      throw TypeError "Expected bound to be a boolean, got $(typeof! bound)"
    {
      type: "function"
      value: {
        params
        body
        autoReturn
        bound
      }
    }
  
  MacroHelper::isFunc := #(node) -> node and node.type == "function"
  MacroHelper::funcBody := #(node)
    if node? and node.type == "function"
      node.value.body
  MacroHelper::funcParams := #(node)
    if node? and node.type == "function"
      node.value.params
  MacroHelper::funcIsAutoReturn := #(node)
    if node? and node.type == "function"
      not not node.value.autoReturn
  MacroHelper::funcIsBound := #(node)
    if node? and node.type == "function"
      not not node.value.bound
  
  MacroHelper::isArray := #(node) -> node and node.type == "array"
  MacroHelper::isObject := #(node) -> node and node.type == "object"
  MacroHelper::elements := #(node)
    if node? and node.type in ["array", "object"]
      node.value
  
  MacroHelper::array := #(elements)
    if not Array.isArray elements
      throw Error "Expected an array, got $(typeof! elements)"
    for element, i in elements
      if not element or typeof element != "object"
        throw Error "Expected at object at index #$i, got $(typeof! element)"
    {
      type: "array"
      value: elements
    }
  MacroHelper::object := #(elements)
    if not Array.isArray elements
      throw Error "Expected an array, got $(typeof! elements)"
    for element, i in elements
      if not element or typeof element != "object"
        throw Error "Expected an object at index #$i, got $(typeof! element)"
      else if not element.key or typeof element.key != "object"
        throw Error "Expected an object with object 'key' at index #$i, got $(typeof! element.key)"
      else if not element.value or typeof element.value != "object"
        throw Error "Expected an object with object 'value' at index #$i, got $(typeof! element.value)"
    {
      type: "object"
      value: elements
    }
  
  MacroHelper::isComplex := #(node)
    node? and node.type not in ["const", "ident", "tmp"] and not (node.type == "block" and node.value.length == 0)
  
  MacroHelper::cache := #(node, init, save)
    if @isComplex node
      let tmp = @tmp(save)
      init.push {
        type: "let"
        startIndex: @index
        endIndex: @index
        value: {
          left: {
            type: "declarable"
            startIndex: @index
            endIndex: @index
            value: {
              ident: tmp
              isMutable: false
            }
          }
          right: node
        }
      }
      tmp
    else
      node
  
  MacroHelper::empty := #(node)
    if not node?
      true
    else if typeof node != "object"
      false
    else if node.type == "block"
      return for every item in node.value
        @empty(item)
    else
      node.type == "nothing"
  
  let arrayEqual(x, y)
    if x == y
      true
    else
      let len = x.length
      if len != y.length
        false
      else
        for i = 0, len
          if x[i] != y[i]
            return false
        true
  
  let objEqual(x, y)
    if x == y
      true
    else if not x or typeof x != "object"
      false
    else if Array.isArray x
      Array.isArray(y) and arrayEqual(x, y)
    else
      for k of x
        if y not ownskey k or x[k] != y[k]
          return false
      true
  
  let map(array, func, arg)
    let result = []
    let mutable changed = false
    for item in array
      let newItem = func item, arg
      result.push newItem
      if item != newItem
        changed := true
    if changed
      result
    else
      array
  
  let constifyArray(array, startIndex, endIndex) -> {
    type: "array"
    startIndex
    endIndex
    value: for x in array
      constifyObject x, startIndex, endIndex
  }
  
  let KNOWN_HELPERS = require('./translator').knownHelpers
  
  let constifyObject(obj, startIndex, endIndex)
    if not obj or typeof obj != "object" or obj instanceof RegExp
      {
        type: "const"
        startIndex
        endIndex
        value: obj
      }
    else if Array.isArray obj
      constifyArray obj, startIndex, endIndex
    else if obj.type == "ident" and obj.value.charAt(0) == "\$"
      {
        type: "callchain"
        obj.startIndex
        obj.endIndex
        value: {
          head: {
            type: "ident"
            obj.startIndex
            obj.endIndex
            value: "__wrap"
          }
          links: [{
            type: "call"
            args: [{
              type: "ident"
              obj.startIndex
              obj.endIndex
              value: obj.value.substring 1
            }]
            existential: false
            isNew: false
          }]
        }
      }
    else if obj.type == "ident" and obj.value in KNOWN_HELPERS
      {
        type: "macrohelper"
        obj.startIndex
        obj.endIndex
        obj.value
      }
    else if obj.type == "macroaccess"
      {
        type: "callchain"
        obj.startIndex
        obj.endIndex
        value: {
          head: {
            type: "ident"
            obj.startIndex
            obj.endIndex
            value: "__macro"
          }
          links: [{
            type: "call"
            args: [
              {
                type: "const"
                obj.startIndex
                obj.endIndex
                value: obj.value.id
              }
              constifyObject obj.value.data, obj.startIndex, obj.endIndex
            ]
            existential: false
            isNew: false
          }]
        }
      }
    else
      {
        type: "object"
        startIndex
        endIndex
        value: for k, v of obj
          {
            key: {
              type: "const"
              startIndex
              endIndex
              value: k
            }
            value: constifyObject v, startIndex, endIndex
          }
      }
  MacroHelper.constifyObject := constifyObject
  
  let walkers = {
    access: #(x, func) -> {
      parent: walk x.parent, func
      child: walk x.child, func
    }
    arguments: identity
    array: walkArray
    assign: #(x, func) -> {
      left: walk x.left, func
      right: walk x.right, func
      x.op
    }
    ast: #(x, func) -> constifyObject x, x.startIndex, x.endIndex
    binary: #(x, func) -> {
      left: walk x.left, func
      right: walk x.right, func
      x.op
    }
    block: walkArray
    break: identity
    callchain: do
      let linkTypes = {
        access: #(link, func)
          let child = walk link.child, func
          if child != link.child
            {
              type: "access"
              child
              link.existential
            }
          else
            link
        call: #(link, func)
          let args = walkArray link.args, func
          if args != link.args
            {
              type: "call"
              args
              link.existential
              link.isNew
            }
          else
            link
        index: do
          let indexTypes = {
            single: #(x, func)
              let node = walk x.node, func
              if node != x.node
                {
                  type: "single"
                  node
                }
              else
                x
            slice: #(x, func)
              let left = walk x.left, func
              let right = walk x.right, func
              if left != x.left or right != x.right
                {
                  type: "slice"
                  left
                  right
                }
              else
                x
            multi: #(x, func)
              let elements = walkArray x.elements, func
              if elements != x.elements
                {
                  type: "multi"
                  elements
                }
              else
                x
          }
          #(x, func)
            let type = x.child.type
            unless indexTypes ownskey type
              throw Error "Unknown index type: $type"
            
            let child = indexTypes[type](x.child, func)
            if child != x.child
              {
                type: "index"
                child
                x.existential
              }
            else
              x
      }
      let walkLink(link, func)
        unless linkTypes ownskey link.type
          throw Error "Unknown callchain link type: $(link.type)"
        
        linkTypes[link.type](link, func)
      #(x, func) -> {
        head: walk x.head, func
        links: map x.links, walkLink, func
      }
    const: identity
    continue: identity
    debugger: identity
    declarable: #(x, func) -> {
      ident: walk x.ident, func
      x.isMutable
    }
    for: #(x, func) -> {
      init: walk x.init, func
      test: walk x.test, func
      step: walk x.step, func
      body: walk x.body, func
    }
    forin: #(x, func) -> {
      key: walk x.key, func
      object: walk x.object, func
      body: walk x.body, func
    }
    function: do
      let paramTypes = {
        param: #(x, func) -> {
          ident: walk x.ident, func
          defaultValue: walk x.defaultValue, func
          asType: walk x.asType, func
          x.spread
          x.isMutable
        }
      }
      let walkParam(param, func)
        unless paramTypes ownskey param.type
          throw Error "Unknown param type: $(param.type)"
        
        let value = paramTypes[param.type](param.value, func)
        if objEqual param.value, value
          param
        else
          {
            param.type
            param.startIndex
            param.endIndex
            value
          }
      #(x, func) -> {
        params: map x.params, walkParam, func
        body: walk x.body, func
        x.autoReturn
        x.bound
      }
    ident: identity
    if: #(x, func) -> {
      test: walk x.test, func
      whenTrue: walk x.whenTrue, func
      whenFalse: walk x.whenFalse, func
    }
    index: do
      let indexTypes = {
        single: #(x, func)
          let node = walk x.node, func
          if node != x.node
            { type: "single", node }
          else
            x
      }
      #(x, func)
        unless indexTypes ownskey x.child.type
          throw Error "Unknown index type: $(x.child.type)"
        {
          parent: walk x.parent, func
          child: indexTypes[x.child.type](x.child, func)
        }
    let: do
      let declarableTypes = {
        declarable: #(x, func)
          let ident = walk x.ident, func
          if ident != x.ident
            { ident, x.isMutable }
          else
            x
      }
      #(x, func)
        let left = x.left
        unless declarableTypes ownskey left.type
          throw Error "Unknown let declarable type: $(left.type)"
        
        let leftValue = declarableTypes[left.type](left.value, func)
        {
          left: if leftValue == left.value then left else {
            left.type
            left.startIndex
            left.endIndex
            value: leftValue
          }
          right: walk x.right, func
        }
    nothing: identity
    object: do
      let walkPair(pair, func)
        let key = walk pair.key, func
        let value = walk pair.value, func
        if key != pair.key or value != pair.value
          { key, value }
        else
          pair
      #(x, func) -> map x, walkPair, func
    paren: walk
    regexp: #(x, func) -> {
      text: walk x.text, func
      x.flags
    }
    return: #(x, func) -> {
      node: walk x.node, func
      x.existential
    }
    spread: walk
    string: walkArray
    this: identity
    tmp: identity
    trycatch: #(x, func) -> {
      tryBody: walk x.tryBody, func
      catchIdent: walk x.catchIdent, func
      catchBody: walk x.catchBody, func
    }
    tryfinally: #(x, func) -> {
      tryBody: walk x.tryBody, func
      finallyBody: walk x.finallyBody, func
    }
    unary: #(x, func) -> {
      x.op
      node: walk x.node, func
    }
    usemacro: #(x, func) -> {
      x.tmps
      node: walk x.node, func
      x.macroHelpers
    }
  }
  let walk(node, func)
    if not node or typeof node != "object" or node instanceof RegExp
      return node
    
    unless walkers ownskey node.type
      throw Error "Unknown node type to walk through: $(node.type)"
    
    return? func node
    let value = walkers[node.type](node.value, func)
    if objEqual value, node.value
      node
    else if node.type == "ast"
      value
    else
      {
        node.type
        node.startIndex
        node.endIndex
        value: value
      }
  let walkArray(array, func) -> map array, walk, func
  
  MacroHelper.fixAsts := #(result) -> walk result, #->
  
  MacroHelper.wrap := #(value = [])
    if Array.isArray(value)
      if value.length == 1
        MacroHelper.wrap(value[0])
      else
        let items = []
        for item in value
          let wrapped = MacroHelper.wrap(item)
          if wrapped.type == "block"
            items.push ...wrapped.value
          else
            items.push wrapped
        {
          type: "block"
          startIndex: 0
          endIndex: 0
          value: items
        }
    else if typeof value != "object" or value instanceof RegExp
      throw Error "Trying to wrap a non-object: $(typeof! value)"
    else
      value
  
  MacroHelper::hasFunc := #(node)
    let FOUND = {}
    try
      walk node, #(x)
        if x.type == "function"
          throw FOUND
    catch e
      if e != FOUND
        throw e
      return true
    false
  
  let mutators = {
    block: #(x, func)
      let len = x.length
      if len > 0
        [...x[:len - 1], @mutateLast(x[len - 1], func)]
      else
        x
    if: #(x, func) -> {
      test: x.test
      whenTrue: @mutateLast x.whenTrue, func
      whenFalse: @mutateLast x.whenFalse, func
    }
    usemacro: #(x, func) -> {
      node: @mutateLast x.node, func
      x.tmps
      x.macroHelpers
    }
    break: identity
    continue: identity
    nothing: identity
    return: identity
    debugger: identity
    throw: identity
  }
  MacroHelper::mutateLast := #(node, func)
    if not node or typeof node != "object" or node instanceof RegExp
      node
    else if mutators not ownskey node.type
      func(node) ? node
    else
      let result = mutators[node.type].call(this, node.value, func)
      if objEqual result, node.value
        node
      else if node.type == "ast"
        result
      else
        {
          node.type
          node.startIndex
          node.endIndex
          value: result
        }
  
  MacroHelper

let MacroHolder = do
  let MacroHolder()!
    if this not instanceof MacroHolder
      throw TypeError "Must be instantiated with new"
    @byName := {}
    @byId := []
  
  MacroHolder::getByName := #(name)
    let byName = @byName
    if byName ownskey name
      byName[name]
  
  MacroHolder::getOrAddByName := #(name)
    let byName = @byName
    if byName ownskey name
      byName[name]
    else
      let token = macroName name
      let m = shortCircuit! token, named "<$name macro>", #(o)
        for item in m.data
          let result = item o
          if result
            return result
        false
      m.token := token
      m.data := []
      byName[name] := m
  
  MacroHolder::getById := #(id)
    let byId = @byId
    if id >= 0 and id < byId.length
      byId[id]
  
  MacroHolder::addMacro := #(m)
    let byId = @byId
    byId.push m
    byId.length - 1
  
  MacroHolder

let State = do
  let State(@data, @macros = new MacroHolder(), @index = 0, @failures = new FailureManager(), @cache = [], @indent = new Stack(1), @currentMacro = null)! ->
  
  State::clone := #-> new State @data, @macros, @index, @failures, @cache, @indent.clone(), @currentMacro
  
  State::update := #(clone)!
    @index := clone.index
    @indent := clone.indent.clone()
    @macros := clone.macros
  
  State::fail := #(message)!
    @failures.add message, @index
  
  State::error := #(message)!
    throw ParserError message, @data, @index
  
  State::node := #(type, index, value) -> {
    type
    startIndex: index
    endIndex: @index
    value
  }
  
  State::startMacro := #(name)!
    if @currentMacro
      @error "Attempting to define a macro $name inside a macro $(@currentMacro)"
    @currentMacro := name
  
  State::endMacro := #()
    if not @currentMacro
      @error "Ending a macro when not in a macro"
    @currentMacro := null
    @node "nothing", @index
  
  let macroSyntaxTypes = {
    syntax: #(index, params, body)
      let nextParts = []
      let calcParam(param)@
        let type = param.type
        if type == "ident"
          let ident = param.value
          if ident == "Logic"
            Logic
          else if ident == "Expression"
            Expression
          else if ident == "Statement"
            Statement
          else if ident == "Body"
            // this is definitely wrong
            nextParts.push Newline, EmptyLines, CheckIndent
            Body
          else if ident == "Identifier"
            Identifier
          else if ident == "Declarable"
            Declarable
          else if ident == "Parameter"
            Parameter
          else if ident == "DedentedBody"
            DedentedBody
          else
            // TODO: add specific index
            @error "Unexpected type ident: $ident"
        else if type == "sequence"
          handleParams param.value, []
        else if type == "choice"
          let choices = for param in param.value
            calcParam param
          cache! #(o)
            // TODO: change for to for first-else
            for rule in choices
              let result = rule o
              if result
                return result
            false
        else if type == "const"
          let string = param.value
          if typeof string != "string"
            @error "Expected a constant string parameter, got $(typeof! string)"
          if string == ","
            Comma
          else if string == ";"
            Semicolon
          else if string == ""
            Nothing
          else
            wordOrSymbol string
        else if type == "many"
          let multiplier = param.value.multiplier
          let calced = calcParam param.value.type
          if multiplier == "*"
            zeroOrMore! calced
          else if multiplier == "+"
            oneOrMore! calced
          else if multiplier == "?"
            oneOf! [calced, Nothing]
          else
            throw Error("Unknown syntax multiplier: $multiplier")
        else
          @error "Unexpected type: $type"
    
      let handleParams(params, sequence)@
        for param in params
          if param.type != "param" or not param.value.type or (param.value.type.type != "many" and (param.value.type.type != "ident" or param.value.type.value != "DedentedBody"))
            sequence.push ...nextParts
            nextParts := []
        
          let type = param.type
          if type == "const"
            let string = param.value
            if typeof string != "string"
              @error "Expected a constant string parameter, got $(typeof! string)"
          
            if string == ","
              sequence.push Comma
            else if string == ";"
              sequence.push Semicolon
            else
              sequence.push wordOrSymbol string
          else if type == "param"
            let ident = param.value.ident
            let key = if ident.type == "ident"
              ident.value
            else if ident.type == "this"
              "this"
            else
              throw Error "Don't know how to handle ident type: $(ident.type)"
            let type = param.value.type ? {
              type: "ident"
              value: "Expression"
            }
            sequence.push [key, calcParam type]
          else
            @error "Unexpected parameter type: $type"
        sequential sequence
    
      let funcParams = for param in params
        if param.type == "param"
          {
            key: @node "const", index, param.value.ident.value
            value: @node "param", index, {
              param.value.ident
              defaultValue: void
              spread: false
            }
          }
    
      let rawFunc = @node "root", index, @node "return", index, {
        node: @node "function", index, {
          params: [
            @node "object", index, funcParams
            @node "param", index, {
              ident: @node "ident", index, "__wrap"
              defaultValue: void
              spread: false
            }
            @node "param", index, {
              ident: @node "ident", index, "__macro"
              defaultValue: void
              spread: false
            }
          ]
          body
          autoReturn: true
          bound: false
        }
        existential: false
      }
      let translated = require('./translator')(rawFunc)
      let handler = translated.node.toFunction()()
      if typeof handler != "function"
        throw Error "Error creating function for macro: $(@currentMacro)"
      {
        handler
        rule: handleParams(params, [])
        translated.macroHelpers
      }
    
    call: #(index, params, body)
      let rawFunc = @node "root", index, @node "return", index, {
        node: @node "function", index, {
          params: [
            @node "array", index, params
            @node "param", index, {
              ident: @node "ident", index, "__wrap"
              defaultValue: void
              spread: false
            }
            @node "param", index, {
              ident: @node "ident", index, "__macro"
              defaultValue: void
              spread: false
            }
          ]
          body
          autoReturn: true
          bound: false
        }
        existential: false
      }
      let translated = require('./translator')(rawFunc)
      let handler = translated.node.toFunction()()
      if typeof handler != "function"
        throw Error "Error creating function for macro: $(@currentMacro)"
      {
        handler
        rule: InvocationArguments
        translated.macroHelpers
      }
  }
  
  State::macroSyntax := #(index, type, params, body)!
    if not Array.isArray params
      throw TypeError "Expected params to be an array, got $(typeof! params)"
    else if not body or typeof body != "object" or body instanceof RegExp
      throw TypeError "Expected body to be an object, got $(typeof! body)"
    
    if macroSyntaxTypes not ownskey type
      throw Error "Unknown macroSyntax type: $type"
    
    if not @currentMacro
      this.error "Attempting to specify a macro syntax when not in a macro"

    let data = macroSyntaxTypes[type].call this, index, params, MacroHelper.fixAsts(body)
    let handler = data.handler
    let rule = data.rule
    let macroHelpers = data.macroHelpers
    
    let macros = @macros
    let mutator = #(x, o, i)
      if _inAst.peek()
        o.node "macroaccess", i, id: macroId, data: x
      else
        let macroHelper = new MacroHelper o, i, not _statement.peek()
        let result = handler.call macroHelper, x, MacroHelper.wrap, #(id, data)
          macros.getById(id)(data, o, i)
        let tmps = macroHelper.getTmps()
        o.node "usemacro", i, {
          node: result
          tmps: tmps.unsaved
          savedTmps: tmps.saved
          macroHelpers
        }
    let m = macros.getOrAddByName @currentMacro
    let func = sequential! [m.token, ["this", rule]], mutator
    let macroId = macros.addMacro(mutator)
    m.data.push func
  
  State

let unique(array)
  let result = []
  for item in array
    if item not in result
      result.push item
  result

let buildExpected(errors)
  let errs = unique errors
  errs.sort #(a, b) -> a.toLowerCase() <=> b.toLowerCase()
  let len = errs.length
  if len == 0
    "End of input"
  else if len == 1
    errs[0]
  else if len == 2
    "$(errs[0]) or $(errs[1])"
  else
    "$(errs[:len - 1].join ', '), or $(errs[errs.length - 1])"

let buildErrorMessage(errors, lastToken)
  "Expected $(buildExpected errors), but $(lastToken) found"

let parse(text, macros, options = {})
  if typeof text != "string"
    throw TypeError "Expected text to be a string, got $(typeof! text)"
  
  let o = new State text, macros
  
  let result = try
    Root(o)
  catch e
    if e != SHORT_CIRCUIT
      throw e
  
  if not result or o.index < o.data.length
    let position = o.failures.position
    let lastToken = if position < o.data.length
      JSON.stringify o.data.substring(position, position + 20)
    else
      "end-of-input"
    throw ParserError buildErrorMessage(o.failures.messages, lastToken), o.data, position
  else
    {
      result
      o.macros
    }
module.exports := parse
module.exports.ParserError := ParserError
