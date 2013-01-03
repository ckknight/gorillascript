let freeze = if typeof Object.freeze == \function then Object.freeze else #(o) -> o

let SHORT_CIRCUIT = freeze ^{ to-string: #-> "short-circuit" }
let NOTHING = freeze ^{ to-string: #-> "" }

let generate-cache-key = do
  let mutable id = -1
  #-> id += 1

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
    func.parser-name := name
  func

let identity(x) -> x

let cache(rule as Function, dont-cache as Boolean)
  if dont-cache
    rule
  else
    let cache-key = generate-cache-key()
    named rule?.parser-name, #(o)
      let cache = o.cache
      let indent = o.indent.peek()
      let indent-cache = (cache[indent] ?= [])
      let inner = (indent-cache[cache-key] ?= [])
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
macro cache!(rule, dont-cache)
  if @is-const(dont-cache)
    if @value(dont-cache)
      rule
    else
      AST cache $rule
  else
    AST cache $rule, $dont-cache

macro mutate!(rule, mutator)
  if mutator? and (not @is-const(mutator) or @value(mutator) != void)
    let init = []
    rule := @cache rule, init, \rule, true
    mutator := @cache mutator, init, \mutator, true
    let result = AST named($rule?.parser-name, #(o)
      let index = o.index
      let result = $rule o
      if not result
        false
      else
        if typeof $mutator == \function
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
  rule := @cache rule, init, \rule, true
  let result = AST mutate! (#(o) -> $rule o.clone()), $mutator
  if init.length
    AST do
      $init
      $result
  else
    result

macro one-of!(array, mutator)
  if not @is-array(array)
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
      if @is-const(rule)
        if typeof @value(rule) != \string
          throw Error "Can only handle constant string literals"
        rule := AST word-or-symbol $rule
      rule := @cache rule, init, \rule, true
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

let sequential(array as Array, mutator, dont-cache as Boolean)
  if array.length == 0
    throw Error "Cannot provide an empty array"
  
  let mutable name = []
  let rules = []
  let mapping = []
  let mutable should-wrap-name = false
  for item, i in array
    let mutable key = void
    let mutable rule = void
    if Array.is-array item
      if item.length != 2
        throw Error "Found an array with #(item.length) length at index #$i"
      if typeof item[0] != \string
        throw TypeError "Array in index #$i has an improper key: $(typeof! item[0])"
      if typeof item[1] != \function
        throw TypeError "Array in index #$i has an improper rule: $(typeof! item[1])"
      key := item[0]
      rule := item[1]
    else if typeof item == \function
      rule := item
    else
      throw TypeError "Found a non-array, non-function in index #$i: $(typeof! item)"
    
    rules.push rule
    mapping.push key
    let rule-name = rule.parser-name or "<unknown>"
    if i > 0 and name[name.length - 1].slice(-1) == '"' and rule-name.char-at(0) == '"' and rule-name.slice(-1) == '"'
      name[name.length - 1] := name[name.length - 1].substring 0, name[name.length - 1].length - 1
      name.push rule-name.substring(1)
    else
      if i > 0
        name.push " "
        should-wrap-name := true
      name.push rule-name
  if should-wrap-name
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
        if key == \this
          result := item
        else
          result[key] := item
    o.update clone
    result), mutator, dont-cache

macro sequential!(array, mutator)
  if not @is-array(array)
    throw Error "Expected a literal array"
  
  let init = []
  let code = []
  
  let mutable has-result = false
  let mutable has-this = false
  let checks = for item, i in @elements(array)
    if @is-array(item)
      let parts = @elements(item)
      if parts.length != 2
        throw TypeError "Found an array with $(parts.length) length at index #$i"
      else if not @is-const(parts[0]) or typeof @value(parts[0]) != \string
        throw TypeError "Array in index #$i has an improper key"
      
      has-result := true
      let key = parts[0]
      let rule = @cache parts[1], init, \rule, true
      if @value(key) == \this
        has-this := true
        AST result := $rule clone
      else
        AST result[$key] := $rule clone
    else
      let rule = @cache item, init, \rule, true
      AST $rule clone
  let mutable code = void
  for check in checks
    if code == void
      code := check
    else
      code := AST $code and $check
  has-this := @const(has-this)
  
  let result = if has-result
    AST mutate! (#(o)
      let clone = o.clone()
      let mutable result = if $has-this then void else {}
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

macro maybe!(rule, missing-value, found-value)
  if @is-const(missing-value) and not @value(missing-value)
    throw Error "Expected a truthy missing-value, got $(String @value(missing-value))"
  let init = []
  rule := @cache rule, init, \rule, true
  missing-value := @cache missing-value, init, \missing, true
  found-value := @cache found-value, init, \found, true
  
  let result = AST named(($rule?.parser-name or "<unknown>") & "?", #(o)
    let index = o.index
    let clone = o.clone()
    let result = $rule clone
    if not result
      if typeof $missing-value == \function
        $missing-value void, o, index
      else
        $missing-value
    else
      o.update clone
      if $found-value != void
        if typeof $found-value == \function
          $found-value result, o, index
        else
          $found-value
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
  rule := @cache rule, init, \rule, true
  
  let result = AST named("!" & ($rule?.parser-name or "<unknown>"), #(o)
    not $rule o.clone())
  if init.length
    AST do
      $init
      $result
  else
    result

macro any-except!(rule, mutator)
  if @is-array(rule)
    rule := AST one-of! $rule
  AST sequential! [
    except! $rule
    [\this, AnyChar]
  ], $mutator

macro short-circuit!(expected, backend)
  let init = []
  expected := @cache expected, init, \expected, true
  backend := @cache backend, init, \backend, true
  
  let result = AST named($backend?.parser-name, #(o)
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

macro calculate-multiple-name!(name, min-count, max-count)
  if not @is-const(min-count) or typeof @value(min-count) != \number
    throw Error "Expected min-count to be a const number"
  if not @is-const(max-count) or typeof @value(max-count) != \number
    throw Error "Expected max-count to be a const number"
  
  if @value(min-count) == 0
    if @value(max-count) == 0
      return AST "$($name)*"
    else if @value
      return AST "$($name)?"
  else if @value(min-count) == 1
    if @value(max-count) == 0
      return AST "$($name)+"
    else
      return name
  let ending = @const(if @value(min-count) == @value(max-count)
    "{$(@value min-count)}"
  else
    "{$(@value min-count),$(@value max-count)}")
  if @value(min-count) == @value(max-count)
    AST "$($name)$($ending)"
  else
    AST "$($name)$($ending)"

macro multiple!(min-count, max-count, rule, mutator)
  if not @is-const(min-count) or typeof @value(min-count) != \number
    throw Error "Expected min-count to be a const number"
  if not @is-const(max-count) or typeof @value(max-count) != \number
    throw Error "Expected min-count to be a const number"
  
  if @value(min-count) == 0 and @value(max-count) == 1
    AST maybe! mutate!($rule, #(x) -> [x], true), #-> [], $mutator
  else if @value(min-count) == 1 and @value(max-count) == 1
    AST mutate! mutate!($rule, #(x) -> [x], true), $mutator
  else
    let init = []
    rule := @cache rule, init, \rule, true
    let result = AST mutate! named(calculate-multiple-name!($rule?.parser-name or "<nothing>", $min-count, $max-count), #(o)
      let clone = o.clone()
      let result = []
      while true
        let item = $rule clone
        if not item
          break
        result.push item
        if $max-count and result.length >= $max-count
          break
      if not $min-count or result.length >= $min-count
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

macro zero-or-more!(rule, mutator) -> AST multiple! 0, 0, $rule, $mutator
macro one-or-more!(rule, mutator) -> AST multiple! 1, 0, $rule, $mutator

macro zero-or-more-of!(array, mutator) -> AST zero-or-more! (one-of! $array), $mutator
macro one-or-more-of!(array, mutator) -> AST one-or-more! (one-of! $array), $mutator

macro character!(chars)
  if not @is-const(chars) or typeof @value(chars) != \string
    throw Error "Must provide a literal string"
  chars := @value(chars)
  if chars.length == 1
    let code = @const chars.char-code-at 0
    let ch = chars.char-at 0
    let name = @const if ch == '"' then "'\"'" else (JSON.stringify ch)
    AST
      named $name, #(o)
        let c = o.data.char-code-at o.index
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
      codes.push chars.char-code-at i
    codes.sort #(x, y) -> x <=> y
    let chunks = []
    let mutable current-start = void
    let mutable current-end = void
    for code in codes
      if not current-start?
        current-start := code
        current-end := code
      else if code == current-end + 1
        current-end := code
      else
        chunks.push {
          start: current-start
          end: current-end
        }
        current-start := code
        current-end := code
    chunks.push {
      start: current-start
      end: current-end
    }
    let mutable current = void
    for chunk in chunks
      let start = chunk.start
      let end = chunk.end
      let start-const = @const(start)
      let end-const = @const(end)
      let test = if start == end
        AST c == $start-const
      else if end == start + 1
        AST c == $start-const or c == $end-const
      else
        AST c ~>= $start-const and c ~<= $end-const
      if current?
        current := AST $current or $test
      else
        current := test
    AST
      named $name, #(o)
        let c = o.data.char-code-at o.index
        if $current
          o.index += 1
          c
        else
          o.fail $name
          false

let rule-equal(rule, text, mutator)
  let failure-message = JSON.stringify(text)
  return mutate! named(failure-message, #(o)
    let clone = o.clone()
    let result = rule clone
    if result == text
      o.update clone
      result
    else
      o.fail failure-message
      false), mutator

let word(text, mutator)
  rule-equal Name, text, mutator

let symbol(text, mutator)
  rule-equal Symbol, text, mutator

let word-or-symbol(text, mutator)
  let parts = [Space]
  parts.push ...(for part, i in text.split r"([a-z]+)"ig
    if part
      if i %% 2
        rule-equal _Symbol, part
      else
        rule-equal _Name, part)
  
  sequential parts, mutator or text

let macro-name(text, mutator)
  let failure-message = JSON.stringify(text)
  mutate! named(failure-message, #(o)
    let clone = o.clone()
    let result = MacroName(clone)
    if result == text
      o.update clone
      result
    else
      o.fail failure-message
      false), mutator

let get-func-name(func)
  if typeof func != \function
    throw TypeError "Expected a function, got $(typeof! func)"
  if func.display-name
    func.display-name
  else if func.name
    func.name
  else
    let match = RegExp("^function\\s*(.*?)").exec func.to-string()
    (match and match[1]) or func.parser-name or "(anonymous)"

let wrap(func, name = get-func-name(func))
  let mutable id = -1
  named func.parser-name, #(o)
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
    let name-str = @const @name(name)
    AST let $name = cache named $name-str, $value

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
  
  Stack::can-pop := #-> @data.length > 0
  
  Stack::peek := #
    let data = @data
    let len = data.length
    if len == 0
      @initial
    else
      data[len - 1]
  
  Stack::clone := #-> new Stack @initial, @data[:]
  
  Stack

let make-alter-stack(stack, value)
  if stack not instanceof Stack
    throw TypeError "Expected stack to be a Stack, got $(typeof! stack)"
  
  #(func)
    if typeof func != \function
      throw TypeError "Expected a function, got $(typeof! func)"
    
    named func.parser-name, #(o)
      stack.push value
      let mutable result = void
      try
        result := func(o)
      finally
        stack.pop()
      result

let _statement = new Stack true
let in-statement = make-alter-stack _statement, true
let in-expression = make-alter-stack _statement, false

let _in-ast = new Stack false
let in-ast = make-alter-stack _in-ast, true

define Eof = #(o) -> o.index >= o.data.length

define WhiteSpace = zero-or-more! character!("\t \r\n"), true
define SpaceChar = character! "\t "
define _Space = zero-or-more! SpaceChar, true
define Newline = sequential! [
  maybe! character!("\r"), true
  character! "\n"
], true
define Stop = one-of! [Newline, Eof]
define CheckStop = check! Stop

define SingleLineComment = #(o)
  let data = o.data
  let index = o.index
  if data.char-code-at(index) == "/".char-code-at(0) and data.char-code-at(index + 1) == "/".char-code-at(0)
    let len = data.length
    index += 2
    while true, index += 1
      let c = data.char-code-at(index)
      if index >= len or c in ["\r".char-code-at(0), "\n".char-code-at(0)]
        o.index := index
        return true
  else
    false

define MultiLineComment = #(o)
  let data = o.data
  let index = o.index
  if data.char-code-at(index) == "/".char-code-at(0) and data.char-code-at(index + 1) == "*".char-code-at(0)
    let len = data.length
    index += 2
    while true, index += 1
      if index >= len
        o.error "Multi-line comment never ends"
      else
        let c = data.char-code-at(index)
        if c == "*".char-code-at(0) and data.char-code-at(index + 1) == "/".char-code-at(0)
          o.index := index + 2
          Space o
          return true
  else
    false

define Comment = one-of! [SingleLineComment, MultiLineComment]
define MaybeComment = maybe! Comment, true

define Space = sequential! [
  _Space
  MaybeComment
], true
define SomeSpace = sequential! [
  one-or-more! SpaceChar, true
  MaybeComment
], true
define NoSpace = except! SpaceChar

define SpaceNewline = sequential! [
  Space
  Newline
], true
define EmptyLine = SpaceNewline
define EmptyLines = zero-or-more! EmptyLine, true
define SomeEmptyLines = one-or-more! EmptyLine, true

define Shebang = sequential! [
  character! "#"
  character! "!"
  zero-or-more! any-except! Newline
], true

let INDENTS = {
  ("\t".char-code-at(0)): 4
  (" ".char-code-at(0)): 1
}
define CountIndent = zero-or-more! SpaceChar, #(x)
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

let Advance = named \Advance, #(o)
  let clone = o.clone()
  let indent = CountIndent clone
  if indent > clone.indent.peek()
    // don't update o, we don't want to move the index
    o.indent.push indent
    true
  else
    false

let MaybeAdvance = named \MaybeAdvance, #(o)
  let clone = o.clone()
  let indent = CountIndent clone
  o.indent.push indent
  true

let PushIndent = named \PushIndent, mutate! CountIndent, (#(indent, o)
  o.indent.push indent
  true), true

let PopIndent = named \PopIndent, #(o)
  if o.indent.can-pop()
    o.indent.pop()
    true
  else
    o.error "Unexpected dedent"

let withSpace(func)
  if typeof func != \function
    throw TypeError "Expected a function, got $(typeof! func)"
  
  sequential! [
    Space
    [\this, func]
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
define PlusOrMinus = one-of! [Minus, Plus]
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
define NameStart = one-of! [Letter, Underscore, DollarSign]
define NameChar = one-of! [NameStart, DecimalDigit]
define SymbolChar = character! "!#%&*+-/<=>?\\^`|~"
define DoubleQuote = character! '"'
define SingleQuote = character! "'"
define TripleDoubleQuote = multiple! 3, 3, DoubleQuote, '"""'
define TripleSingleQuote = multiple! 3, 3, SingleQuote, "'''"
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
define CommaOrNewline = one-of! [
  sequential! [
    [\this, Comma]
    EmptyLines
  ]
  SomeEmptyLines
]
define SomeEmptyLinesWithCheckIndent = sequential! [
  SomeEmptyLines
  CheckIndent
]
define CommaOrNewlineWithCheckIndent = one-of! [
  sequential! [
    [\this, Comma]
    maybe! SomeEmptyLinesWithCheckIndent, true
  ]
  SomeEmptyLinesWithCheckIndent
]
define MaybeCommaOrNewline = maybe! CommaOrNewline, true

define NamePart = sequential! [
  [\head, NameStart]
  [\tail, zero-or-more! NameChar]
], #(x) -> [x.head, ...x.tail]

let from-char-code = do
  let f = String.from-char-code
  #(x)
    if x == -1
      "\u0000"
    else
      f x
let process-char-codes(codes, array = [])
  for v in codes
    array.push from-char-code(v)
  array

define _Name = sequential! [
  [\head, NamePart]
  [\tail, zero-or-more! sequential! [
    Minus
    [\this, NamePart]
  ]]
], #(x)
  let parts = process-char-codes x.head
  for part in x.tail
    parts.push from-char-code(part[0]).to-upper-case()
    process-char-codes part[1:], parts
  parts.join ""

define Name = sequential! [
  Space
  [\this, _Name]
]

define _Symbol = one-or-more! SymbolChar, #(x) -> process-char-codes(x).join ""

define Symbol = sequential! [
  Space
  [\this, _Symbol]
]

let _NameOrSymbol = one-or-more-of! [
  _Name
  _Symbol
], #(x) -> x.join ""
let NameOrSymbol = sequential! [
  Space
  [\this, _NameOrSymbol]
]

define AnyChar = #(o)
  let data = o.data
  let index = o.index
  if index >= data.length
    o.fail "any"
    false
  else
    o.index += 1
    o.data.char-code-at(index) or -1

define ThisLiteral = word \this, #(x, o, i) -> o.this i

define ThisShorthandLiteral = sequential! [Space, AtSign], #(x, o, i) -> o.this i

define ThisOrShorthandLiteral = one-of! [ThisLiteral, ThisShorthandLiteral]
define ThisOrShorthandLiteralPeriod = one-of! [
  sequential! [
    [\this, ThisLiteral]
    Period
  ]
  sequential! [
    [\this, ThisShorthandLiteral]
    maybe! Period, true
  ]
]

define RawDecimalDigits = one-or-more! DecimalDigit

define DecimalDigits = sequential! [
  [\head, RawDecimalDigits]
  [\tail, zero-or-more! sequential! [
    one-or-more! Underscore
    [\this, RawDecimalDigits]
  ]]
], #(x)
  let parts = process-char-codes x.head
  for part in x.tail
    process-char-codes part, parts
  parts.join ""

define DecimalNumber = sequential! [
  [\integer, DecimalDigits]
  [\decimal, maybe! (sequential! [
    Period
    [\this, DecimalDigits]
  ], #(x) -> "." & x), NOTHING]
  [\scientific, maybe! (sequential! [
    [\e, eE]
    [\op, maybe! PlusOrMinus, NOTHING]
    [\digits, DecimalDigits]
  ], #(x) -> from-char-code(x.e) & (if x.op != NOTHING then from-char-code(x.op) else "") & x.digits), NOTHING]
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
  if not is-finite value
    o.error "Unable to parse number: $text"
  o.const i, value

let make-radix-integer(radix, separator, digit)
  let digits = sequential! [
    [\head, one-or-more! digit]
    [\tail, zero-or-more! sequential! [
      one-or-more! Underscore
      [\this, one-or-more! digit]
    ]]
  ], #(x)
    let parts = process-char-codes x.head
    for part in x.tail
      process-char-codes part, parts
    parts.join ""
  sequential! [
    Zero
    [\separator, separator]
    [\integer, digits]
    [\decimal, maybe! (sequential! [
      Period
      [\this, digits]
    ]), NOTHING]
  ], #(x, o, i)
    let integer = x.integer
    let mutable decimal = x.decimal
    if decimal == NOTHING
      decimal := ""
    let mutable value = parse-int integer, radix
    if not is-finite value
      let decimal-text = if decimal then ".$decimal" else ""
      o.error "Unable to parse number: 0$(from-char-code x.separator)$(integer)$decimal-text"
    if decimal
      while true
        let decimal-num = parse-int decimal, radix
        if is-finite(decimal-num)
          value += decimal-num / radix ^ decimal.length
          break
        else
          decimal := decimal.slice(0, -1)
    o.const i, value

define HexInteger = make-radix-integer 16, xX, HexDigit
define OctalInteger = make-radix-integer 8, oO, OctalDigit
define BinaryInteger = make-radix-integer 2, bB, BinaryDigit

define RadixInteger = do
  let GetDigits = do
    let digit-cache = []
    #(radix) -> digit-cache[radix] ?= do
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
            chars[i + "0".char-code-at(0)] := true
          for i = 10, radix max 36
            chars[i - 10 + "a".char-code-at(0)] := true
            chars[i - 10 + "A".char-code-at(0)] := true
          #(o)
            let c = o.data.char-code-at(o.index)
            if chars[c]
              o.index += 1
              c
            else
              false
      sequential! [
        [\head, one-or-more! digit]
        [\tail, zero-or-more! sequential! [
          one-or-more! Underscore
          [\this, one-or-more! digit]
        ]]
      ], #(x)
        let parts = process-char-codes x.head
        for part in x.tail
          process-char-codes part, parts
        parts.join ""
  
  let Radix = multiple! 1, 2, DecimalDigit
  #(o)
    let start-index = o.index
    let clone = o.clone()
    let mutable radix = Radix(clone)
    if not radix
      return false
    radix := process-char-codes(radix).join ""
    
    if not LowerR(clone)
      return false
    
    let radix-num = Number(radix)
    if not is-finite radix-num
      o.error "Unable to parse radix: $radix"
    else if radix-num < 2 or radix-num > 36
      o.error "Radix must be at least 2 and at most 36, not $radix-num"
    
    let digits = GetDigits(radix-num)
    let integer = digits(clone)
    if not integer
      return false
    let mutable value = parse-int integer, radix-num
    if not is-finite value
      o.error "Unable to parse number: $(radix-num)r$(integer)"
    
    let sub-clone = clone.clone()
    if Period(sub-clone)
      let mutable decimal = digits(sub-clone)
      if decimal
        clone.update sub-clone
        while true
          let decimal-num = parse-int decimal, radix-num
          if isNaN(decimal-num)
            o.error "Unable to parse number: $(radix-num)r$integer.$decimal"
          else if is-finite(decimal-num)
            value += decimal-num / radix-num ^ decimal.length
            break
          else
            decimal := decimal.slice(0, -1)
    o.update clone
    o.const start-index, value

define NumberLiteral = sequential! [
  Space
  [\this, one-of! [
    HexInteger
    OctalInteger
    BinaryInteger
    RadixInteger
    DecimalNumber
  ]]
]

let make-const-literal(name, value)
  word name, #(x, o, i)
    o.const i, value

define NullLiteral = make-const-literal \null, null
define VoidLiteral = one-of! [
  make-const-literal \undefined, void
  make-const-literal \void, void
]
define InfinityLiteral = make-const-literal \Infinity, Infinity
define NaNLiteral = make-const-literal "NaN", NaN
define TrueLiteral = make-const-literal \true, true
define FalseLiteral = make-const-literal \false, false

define SimpleConstantLiteral = one-of! [
  NullLiteral
  VoidLiteral
  InfinityLiteral
  NaNLiteral
  TrueLiteral
  FalseLiteral
]

define HexEscapeSequence = short-circuit! LowerX, sequential! [
  LowerX
  [\this, multiple! 2, 2, HexDigit]
], #(x) -> parse-int(process-char-codes(x).join(""), 16) or -1

define UnicodeEscapeSequence = short-circuit! LowerU, sequential! [
  LowerU
  [\this, multiple! 4, 4, HexDigit]
], #(x) -> parse-int(process-char-codes(x).join(""), 16) or -1

define SingleEscapeCharacter = do
  let ESCAPED_CHARACTERS = {
    ("b".char-code-at(0)): "\b".char-code-at(0)
    ("f".char-code-at(0)): "\f".char-code-at(0)
    ("r".char-code-at(0)): "\r".char-code-at(0)
    ("n".char-code-at(0)): "\n".char-code-at(0)
    ("t".char-code-at(0)): "\t".char-code-at(0)
    ("v".char-code-at(0)): "\v".char-code-at(0)
    ("0".char-code-at(0)): -1
    ("1".char-code-at(0)): 1
    ("2".char-code-at(0)): 2
    ("3".char-code-at(0)): 3
    ("4".char-code-at(0)): 4
    ("5".char-code-at(0)): 5
    ("6".char-code-at(0)): 6
    ("7".char-code-at(0)): 7
  }
  
  mutate! AnyChar, #(c)
    if ESCAPED_CHARACTERS ownskey c
      ESCAPED_CHARACTERS[c]
    else
      c

define EscapeSequence = one-of! [
  HexEscapeSequence
  UnicodeEscapeSequence
  SingleEscapeCharacter
]

define BackslashEscapeSequence = sequential! [
  Backslash
  [\this, EscapeSequence]
]

define StringInterpolation = short-circuit! DollarSign, sequential! [
  DollarSign
  [\this, one-of! [
    Identifier
    sequential! [
      OpenParenthesisChar
      [\this, ExpressionOrNothing]
      CloseParenthesis
    ]
  ]]
]

define SingleStringLiteral = short-circuit! SingleQuote, sequential! [
  SingleQuote
  [\this, zero-or-more-of! [
    BackslashEscapeSequence
    any-except! [
      SingleQuote
      Newline
    ]
  ]]
  SingleQuote
], #(x, o, i) -> o.const i, process-char-codes(x).join ""

define DoubleStringLiteral = short-circuit! DoubleQuote, sequential! [
  DoubleQuote
  [\this, zero-or-more-of! [
    mutate! BackslashEscapeSequence
    StringInterpolation
    any-except! [
      DoubleQuote
      Newline
    ]
  ]]
  DoubleQuote
], #(x, o, i)
  let string-parts = []
  let mutable current-literal = []
  for part in x
    if typeof part == \number
      current-literal.push part
    else if part.type != \nothing
      if current-literal.length > 0
        string-parts.push process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push process-char-codes(current-literal).join ""
  
  if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and typeof string-parts[0] == \string
    o.const i, string-parts[0]
  else
    o.string i, string-parts

define StringIndent = #(o)
  let clone = o.clone()
  let mutable count = 1
  let current-indent = clone.indent.peek()
  while count < current-indent
    let c = SpaceChar(clone)
    if not c
      break
    let i = INDENTS[c]
    if not i
      throw Error "Unexpected indent char: $(JSON.stringify c)"
    count += i
  if count > current-indent
    o.error "Mixed tabs and spaces in string literal"
  else if count < current-indent and not Newline(clone.clone())
    false
  else
    o.update clone
    count

define TripleSingleStringLine = zero-or-more-of! [
  BackslashEscapeSequence
  any-except! [
    TripleSingleQuote
    Newline
  ]
], #(x) -> [process-char-codes(x).join("").replace(r"[\t ]+\$", "")]
define TripleDoubleStringLine = zero-or-more-of! [
  mutate! BackslashEscapeSequence
  StringInterpolation
  any-except! [
    TripleDoubleQuote
    Newline
  ]
], #(x)
  let string-parts = []
  let mutable current-literal = []
  for part in x
    if typeof part == \number
      current-literal.push part
    else if part.type != \nothing
      if current-literal.length > 0
        string-parts.push process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push process-char-codes(current-literal).join("").replace(r"[\t ]+\$", "")
  
  string-parts

let makeTripleString(quote, line)
  short-circuit! quote, sequential! [
    quote
    [\first, line]
    [\empty-lines, zero-or-more! sequential! [
      _Space
      [\this, Newline]
    ]]
    [\rest, maybe! (sequential! [
      MaybeAdvance
      [\this, maybe! (sequential! [
        StringIndent
        [\head, line]
        [\tail, zero-or-more! sequential! [
          Newline
          StringIndent
          [\this, line]
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
    for j = 0, x.empty-lines.length
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
      if typeof result[j] == \string and typeof result[j + 1] == \string
        result.splice(j, 2, result[j] ~& result[j + 1])
    
    if result.length == 0
      o.const i, ""
    else if result.length == 1 and typeof result[0] == \string
      o.const i, result[0]
    else
      o.string i, result
define TripleSingleStringLiteral = makeTripleString TripleSingleQuote, TripleSingleStringLine
define TripleDoubleStringLiteral = makeTripleString TripleDoubleQuote, TripleDoubleStringLine

define LowerR = character! "r"
define RegexSingleToken = sequential! [LowerR, SingleQuote]
define RegexDoubleToken = sequential! [LowerR, DoubleQuote]
define RegexFlags = maybe! NamePart, #-> []
define RegexLiteral = one-of! [
  short-circuit! RegexDoubleToken, sequential! [
    RegexDoubleToken
    [\text, zero-or-more-of! [
      sequential! [
        DoubleQuote
        DoubleQuote
      ], '"'.char-code-at 0
      sequential! [
        Backslash
        DollarSign
      ], "\$".char-code-at 0
      any-except! [
        DoubleQuote
        Newline
        DollarSign
      ]
      StringInterpolation
    ]]
    DoubleQuote
    [\flags, RegexFlags]
  ]
  short-circuit! RegexSingleToken, sequential! [
    RegexSingleToken
    [\text, zero-or-more-of! [
      sequential! [
        SingleQuote
        SingleQuote
      ], "'".char-code-at 0
      any-except! [
        SingleQuote
        Newline
      ]
    ]]
    SingleQuote
    [\flags, RegexFlags]
  ]
], #(x, o, i)
  let string-parts = []
  let mutable current-literal = []
  for part in x.text
    if typeof part == \number
      current-literal.push part
    else if part.type != \nothing
      if current-literal.length > 0
        string-parts.push process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push process-char-codes(current-literal).join ""

  let flags = process-char-codes(x.flags).join ""

  let text = if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and typeof string-parts[0] == \string
    o.const i, string-parts[0]
  else
    o.string i, string-parts
  o.regexp i, text, flags

define BackslashStringLiteral = sequential! [
  Backslash
  NoSpace
  [\this, IdentifierNameConst]
]

define StringLiteral = sequential! [
  Space
  [\this, one-of! [
    BackslashStringLiteral
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

define ConstantLiteral = one-of! [
  SimpleConstantLiteral
  NumberLiteral
  StringLiteral
]

define ArgumentsLiteral = word \arguments, #(x, o, i) -> o.args i

define Literal = one-of! [
  ThisOrShorthandLiteral
  ArgumentsLiteral
  ConstantLiteral
]

define IdentifierNameConst = #(o)
  let start-index = o.index
  let result = Name o
  if result
    o.const start-index, result
  else
    false

define IdentifierNameConstOrNumberLiteral = one-of! [IdentifierNameConst, NumberLiteral]

define Identifier = do
  let RESERVED = [
    \and
    \as
    \AST
    \arguments
    \bitand
    \bitlshift
    \bitnot
    \bitor
    \bitrshift
    \biturshift
    \bitxor
    \break
    \case
    \catch
    \class
    \const
    \continue
    \debugger
    \default
    \def
    \delete
    \do
    \else
    \enum
    \eval
    \export
    \extends
    \fallthrough
    \false
    \finally
    \for
    \function
    \haskey
    \if
    \import
    \Infinity
    \instanceofsome
    \instanceof
    \in
    \let
    \log
    \macro
    \max
    \min
    \mutable
    \namespace
    \NaN
    \new
    \not
    \null
    \or
    \ownskey
    \repeat
    \return
    //"StopIteration"
    \super
    \switch
    \then
    \this
    \throw
    \true
    \try
    \typeof
    \undefined
    \unless
    \until
    \var
    \void
    \while
    \with
    \xor
    \yield
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
      o.ident index, result

define NotToken = word \not
define MaybeNotToken = maybe! NotToken, true

define ExistentialSymbol = symbol "?"
define MaybeExistentialSymbol = maybe! ExistentialSymbol, true
define ExistentialSymbolNoSpace = sequential! [
  NoSpace
  [\this, ExistentialSymbol]
]
define MaybeExistentialSymbolNoSpace = maybe! ExistentialSymbolNoSpace, true

define Operator = one-of! [
  "^"
  "*"
  "/"
  "\\"
  "%"
  "+"
  "-"
  \bitlshift
  \bitrshift
  \biturshift
  \min
  \max
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
  \in
  \haskey
  \ownskey
  \instanceof
  \instanceofsome
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
  \and
  \or
  \xor
  "?"
  \bitand
  \bitor
  \bitxor
  "~bitand"
  "~bitor"
  "~bitxor"
  sequential! [
    NotToken
    [\this, MaybeNotToken]
  ], #(x) -> if x == \not then \bool else \not
  \bitnot
  "~bitnot"
  sequential! [
    word \typeof
    [\this, maybe! (character! "!"), NOTHING]
  ], #(x) -> if x != NOTHING then "typeof!" else \typeof
  sequential! [
    [\this, one-of! [
      word \num
      word \str
      word \strnum
    ]]
    character! "!"
  ], #(x) -> x & "!"
  \delete
  sequential! [
    word \throw
    [\this, MaybeExistentialSymbolNoSpace]
  ], #(x) -> if x == "?" then "throw?" else \throw
], #(x, o, i) -> o.operator i, x

define Parenthetical = sequential! [
  OpenParenthesis
  [\this, one-of! [
    Assignment
    Expression
    Operator
  ]]
  CloseParenthesis
], #(node, o, i) -> node

define SpreadToken = sequential! [Space, Period, Period, Period], "..."
define MaybeSpreadToken = maybe! SpreadToken, true

define SpreadOrExpression = sequential! [
  [\spread, MaybeSpreadToken]
  [\node, Expression]
], #(x, o, i)
  if x.spread == "..."
    o.spread i, x.node
  else
    x.node

define ArrayLiteral = sequential! [
  OpenSquareBracket
  Space
  [\first, maybe! (sequential! [
    [\head, SpreadOrExpression],
    [\tail, zero-or-more! sequential! [
      Comma
      [\this, SpreadOrExpression]
    ]]
    MaybeComma
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  [\rest, maybe! (sequential! [
    SomeEmptyLines
    MaybeAdvance
    [\this, maybe! (sequential! [
      CheckIndent
      [\head, SpreadOrExpression]
      [\tail, zero-or-more! sequential! [
        CommaOrNewlineWithCheckIndent
        [\this, SpreadOrExpression]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    EmptyLines
    MaybeCommaOrNewline
    PopIndent
  ]), #-> []]
  CloseSquareBracket
], #(x, o, i)
  o.array i, [...x.first, ...x.rest]

define ObjectKey = one-of! [
  Parenthetical
  StringLiteral
  mutate! NumberLiteral, #(x, o, i) -> o.const i, String(x.value)
  IdentifierNameConst
]

define ObjectKeyColon = sequential! [
  [\this, ObjectKey]
  Space
  Colon
  except! Colon
]

define DualObjectKey = short-circuit! ObjectKeyColon, sequential! [
  [\key, ObjectKeyColon]
  [\value, Expression]
]

define IdentifierOrSimpleAccessStart = one-of! [
  Identifier
  sequential! [
    [\parent, ThisOrShorthandLiteralPeriod]
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.access i, x.parent, x.child
  sequential! [
    [\parent, ThisOrShorthandLiteral]
    DoubleColon
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i)
    o.access i, (o.access i, x.parent, o.const i, \prototype), x.child
  sequential! [
    [\parent, ThisOrShorthandLiteral]
    [\is-proto, maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    [\child, Expression]
    CloseSquareBracket
  ], #(x, o, i)
    let mutable parent = x.parent
    if x.is-proto != NOTHING
      parent := o.access i, parent, o.const i, \prototype
    o.access i, parent, x.child
]

define IdentifierOrSimpleAccessPart = one-of! [
  sequential! [
    [\type, one-of! [Period, DoubleColon]]
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i)
    let is-proto = x.type == "::"
    let child = x.child
    #(parent) -> o.access(i
      if is-proto then o.access i, parent, o.const i, \prototype else parent
      child)
  sequential! [
    [\type, maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    [\child, Expression]
    CloseSquareBracket
  ], #(x, o, i)
    let is-proto = x.type != NOTHING
    let child = x.child
    #(parent) -> o.access(i
      if is-proto then o.access i, parent, o.const i, \prototype else parent
      child)
]

define IdentifierOrSimpleAccess = sequential! [
  [\head, IdentifierOrSimpleAccessStart]
  [\tail, zero-or-more! IdentifierOrSimpleAccessPart]
], #(x, o, i)
  let mutable current = x.head
  for creator in x.tail
    current := creator current
  current

define SingularObjectKey = one-of! [
  mutate! IdentifierOrSimpleAccess, #(ident, o, i)
    let key = if ident.type == \access
      ident.child
    else if ident.type == \ident
      o.const i, ident.name
    else
      o.error "Unknown ident type: $(ident.type)"
    { key, value: ident }
  mutate! ConstantLiteral, #(node, o, i)
    let key = if node.type == \const and typeof node.value != \string
      o.const i, String(node.value)
    else
      node
    { key, value: node }
  mutate! ThisLiteral, #(node, o, i)
    {
      key: o.const i, \this
      value: node
    }
  mutate! ArgumentsLiteral, #(node, o, i)
    {
      key: o.const i, \arguments
      value: node
    }
  sequential! [
    symbol("-")
    [\this, one-of! [NumberLiteral, InfinityLiteral]]
  ], #(x, o, i)
    {
      key: o.const i, String(-x.value)
      value: o.unary i, "-", x
    }
  mutate! Parenthetical, #(node) -> { key: node, value: node }
]

define KeyValuePair = one-of! [
  DualObjectKey
  SingularObjectKey
]

define ObjectLiteral = sequential! [
  OpenCurlyBrace
  Space
  [\first, maybe! (sequential! [
    [\head, KeyValuePair],
    [\tail, zero-or-more! sequential! [
      Comma
      [\this, KeyValuePair]
    ]]
    MaybeComma
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  [\rest, maybe! (sequential! [
    SomeEmptyLines
    MaybeAdvance
    [\this, maybe! (sequential! [
      CheckIndent
      [\head, KeyValuePair]
      [\tail, zero-or-more! sequential! [
        CommaOrNewlineWithCheckIndent
        [\this, KeyValuePair]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    EmptyLines
    MaybeCommaOrNewline
    PopIndent
  ]), #-> []]
  CloseCurlyBrace
], #(x, o, i)
  o.object i, [...x.first, ...x.rest]

define IndentedObjectLiteral = sequential! [
  Space
  Newline
  EmptyLines
  Advance
  CheckIndent
  [\head, DualObjectKey]
  Space
  [\tail, zero-or-more! sequential! [
    CommaOrNewline
    CheckIndent
    [\this, DualObjectKey]
    Space
  ]]
  PopIndent
], #(x, o, i) -> o.object i, [x.head, ...x.tail]

define InBlock = sequential! [
  Advance
  [\this, Block]
  PopIndent
]

define Body = sequential! [
  Space
  Newline
  EmptyLines
  [\this, InBlock]
]
define BodyOrStatement = one-of! [
  Body
  Statement
]

define DedentedBody = sequential! [
  Space
  Newline
  EmptyLines
  [\this, Block]
]

define DeclareEqualSymbol = withSpace character! "="

define MutableToken = word \mutable
define MaybeMutableToken = maybe! MutableToken, true

define SimpleType = one-of! [
  IdentifierOrSimpleAccess
  VoidLiteral
  NullLiteral
]

define SimpleOrArrayType = one-of! [
  SimpleType
  ArrayType
]

define UnionType = sequential! [
  OpenParenthesis
  [\head, SimpleOrArrayType]
  [\tail, zero-or-more! sequential! [
    Pipe
    [\this, SimpleOrArrayType]
  ]]
  CloseParenthesis
], #(x, o, i) -> o.type-union i, [x.head, ...x.tail]

define ArrayType = sequential! [
  OpenSquareBracket
  [\this, TypeReference]
  CloseSquareBracket
], #(x, o, i) -> o.type-array i, x

define TypeReference = one-of! [
  IdentifierOrSimpleAccess
  UnionType
  ArrayType
]

define AsToken = word \as
define AsType = short-circuit! AsToken, sequential! [
  AsToken
  [\this, TypeReference]
]

define MaybeAsType = maybe! AsType, NOTHING

define IdentifierParameter = sequential! [
  [\is-mutable, MaybeMutableToken]
  [\spread, MaybeSpreadToken]
  [\parent, maybe! ThisOrShorthandLiteralPeriod, NOTHING]
  [\ident, Identifier]
  [\as-type, MaybeAsType]
  [\default-value, maybe! (sequential! [
    DeclareEqualSymbol
    [\this, Expression]
  ]), NOTHING]
], #(x, o, i)
  let name = if x.parent != NOTHING
    o.access i, x.parent, o.const i, x.ident.name
  else
    x.ident
  if x.spread == "..." and x.default-value != NOTHING
    o.error "Cannot specify a default value for a spread parameter"
  o.param(i
    name
    if x.default-value != NOTHING then x.default-value else void
    x.spread == "..."
    x.is-mutable == \mutable
    if x.as-type != NOTHING then x.as-type else void)

define Parameter = one-of! [
  IdentifierParameter
  ArrayParameter
  ObjectParameter
]

let validate-spread-parameters(params, o)
  let mutable spread-count = 0
  for param in params
    if param.type == \param and param.spread
      spread-count += 1
      if spread-count > 1
        o.error "Cannot have more than one spread parameter"
  params

define ArrayParameter = sequential! [
  OpenSquareBracket
  EmptyLines
  [\this, maybe! (sequential! [
    [\head, Parameter]
    [\tail, zero-or-more! sequential! [
      CommaOrNewline
      [\this, Parameter]
    ]]
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseSquareBracket
], #(x, o, i) -> o.array-param i, validate-spread-parameters(x, o)

define ParamDualObjectKey = sequential! [
  [\key, ObjectKey]
  Colon
  [\value, Parameter]
]

define ParamSingularObjectKey = mutate! IdentifierParameter, #(param, o, i)
  let ident = param.value.ident
  let key = if ident.type == \ident
    o.const i, ident.name
  else if ident.type == \access
    ident.child
  else
    throw Error "Unknown object key type: $(ident.type)"
  { key, value: param }

define KvpParameter = one-of! [
  ParamDualObjectKey
  ParamSingularObjectKey
]

define ObjectParameter = sequential! [
  OpenCurlyBrace
  EmptyLines
  [\this, maybe! (sequential! [
    [\head, KvpParameter]
    [\tail, zero-or-more! sequential! [
      CommaOrNewline
      [\this, KvpParameter]
    ]]
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseCurlyBrace
], #(x, o, i) -> o.object-param i, x

define Parameters = sequential! [
  [\head, Parameter]
  [\tail, zero-or-more! sequential! [
    CommaOrNewline
    [\this, Parameter]
  ]]
], #(x, o, i) -> validate-spread-parameters [x.head, ...x.tail], o

define ParameterSequence = sequential! [
  OpenParenthesis
  EmptyLines
  [\this, maybe! Parameters, #-> []]
  EmptyLines
  MaybeCommaOrNewline
  CloseParenthesis
]

define FunctionBody = one-of! [
  sequential! [
    symbol "->"
    [\this, maybe! Statement, #(x, o, i) -> o.nothing i]
  ]
  Body
]

define FunctionDeclaration = sequential! [
  [\params, maybe! ParameterSequence, #-> []]
  [\auto-return, maybe! character!("!"), NOTHING]
  [\bound, maybe! AtSign, NOTHING]
  [\body, FunctionBody]
], #(x, o, i) -> o.function i, x.params, x.body, x.auto-return == NOTHING, x.bound != NOTHING

define FunctionLiteral = short-circuit! HashSign, sequential! [
  HashSign
  [\this, FunctionDeclaration]
]

define AstToken = word \AST
define Ast = in-ast short-circuit! AstToken, sequential! [
  AstToken
  [\this, BodyOrStatement]
], #(x, o, i) -> o.ast i, x

define Debugger = word \debugger, #(x, o, i) -> o.debugger i

define MacroName = sequential! [
  Space
  [\this, one-or-more-of! [
    _Symbol
    _Name
  ], #(x) -> x.join ""]
]

define UseMacro = #(o)
  let clone = o.clone()
  let macros = clone.macros
  let name = MacroName clone
  if name
    let m = macros.get-by-name(name)
    if m
      return m o
  false

define AsToken = word \as
define MacroSyntaxParameterType = sequential! [
  [\type, one-of! [
    Identifier
    StringLiteral
    sequential! [
      OpenParenthesis
      EmptyLines
      [\this, MacroSyntaxParameters]
      EmptyLines
      MaybeCommaOrNewline
      CloseParenthesis
    ], #(x, o, i) -> o.syntax-sequence i, x
    sequential! [
      OpenParenthesis
      EmptyLines
      [\this, MacroSyntaxChoiceParameters]
      EmptyLines
      CloseParenthesis
    ], #(x, o, i) -> o.syntax-choice i, x
  ]]
  [\multiplier, maybe! (one-of! [
    symbol "?"
    symbol "*"
    symbol "+"
  ]), NOTHING]
], #(x, o, i)
  if x.multiplier == NOTHING
    x.type
  else
    o.syntax-many i, x.type, x.multiplier

define MacroSyntaxParameter = one-of! [
  StringLiteral
  sequential! [
    [\ident, one-of! [
      ThisOrShorthandLiteral
      Identifier
    ]]
    [\type, maybe! (sequential! [
      AsToken
      [\this, MacroSyntaxParameterType]
    ]), NOTHING]
  ], #(x, o, i) -> o.syntax-param i, x.ident, if x.type != NOTHING then x.type else void
]

define MacroSyntaxParameters = sequential! [
  [\head, MacroSyntaxParameter]
  [\tail, zero-or-more! sequential! [
    Comma
    [\this, MacroSyntaxParameter]
  ]]
], #(x) -> [x.head, ...x.tail]

define MacroSyntaxChoiceParameters = sequential! [
  [\head, MacroSyntaxParameterType]
  [\tail, zero-or-more! sequential! [
    Pipe
    [\this, MacroSyntaxParameterType]
  ]]
], #(x) -> [x.head, ...x.tail]

define SyntaxToken = word \syntax

define MacroSyntax = sequential! [
  CheckIndent
  [\params, short-circuit! SyntaxToken, sequential! [
    SyntaxToken
    [\this, MacroSyntaxParameters]
  ]]
  [\body, FunctionBody]
  Space
  CheckStop
], #(x, o, i)
  o.macro-syntax i, \syntax, x.params, x.body
  true

define MacroBody = one-of! [
  sequential! [
    Space
    Newline
    EmptyLines
    [\this, sequential! [
      Advance
      [\head, MacroSyntax]
      [\tail, zero-or-more! sequential! [
        Newline
        EmptyLines
        [\this, MacroSyntax]
      ]]
      PopIndent
    ]]
  ], #(x) -> true
  sequential! [
    [\params, ParameterSequence]
    [\body, FunctionBody]
  ], #(x, o, i)
    o.macro-syntax i, \call, x.params, x.body
    true
]

define MacroToken = word \macro
define Macro = short-circuit! MacroToken, sequential! [
  MacroToken
  named "(identifier MacroBody)", #(o)
    let name = MacroName o
    if name
      o.start-macro(name)
      try
        MacroBody o
      finally
        o.end-macro()
    else
      false
], #(x, o, i) -> o.nothing i

define DefineHelperStart = sequential! [word(\define), word(\helper)]
define DefineHelper = short-circuit! DefineHelperStart, sequential! [
  DefineHelperStart
  [\name, Identifier]
  DeclareEqualSymbol
  [\value, Expression]
], #(x, o, i) -> o.define-helper i, x.name, x.value

define Nothing = #(o) -> o.nothing o.index
define ExpressionOrNothing = one-of! [
  Expression
  Nothing
]

let _indexSlice = new Stack false
let inIndexSlice = make-alter-stack _indexSlice, true

define IndexSlice = inIndexSlice sequential! [
  [\left, ExpressionOrNothing]
  Colon
  [\right, ExpressionOrNothing]
], #(x) -> {
  type: \slice
  left: if x.type == \nothing then null else x.left
  right: if x.type == \nothing then null else x.right
}

define IndexMultiple = sequential! [
  [\head, Expression]
  [\tail, zero-or-more! sequential! [
    CommaOrNewline
    [\this, Expression]
  ]]
], #(x)
  if x.tail.length > 0
    {
      type: \multi
      elements: [x.head, ...x.tail]
    }
  else
    {
      type: \single
      node: x.head
    }

define Index = one-of! [IndexSlice, IndexMultiple]

define IdentifierOrAccessStart = one-of! [
  Identifier
  sequential! [
    [\parent, ThisOrShorthandLiteralPeriod]
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.access i, x.parent, x.child
  sequential! [
    [\parent, ThisOrShorthandLiteral]
    DoubleColon
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> o.access(i
    o.access i, x.parent, o.const i, \prototype
    x.child)
  sequential! [
    [\parent, ThisOrShorthandLiteral]
    [\is-proto, maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    [\child, Index]
    CloseSquareBracket
  ], #(x, o, i)
    let mutable parent = x.parent
    if x.is-proto != NOTHING
      parent := o.access i, parent, o.const i, \prototype
    o.access-index i, parent, x.child
]

define IdentifierOrAccessPart = one-of! [
  sequential! [
    [\type, one-of! [Period, DoubleColon]]
    [\child, IdentifierNameConstOrNumberLiteral]
  ], #(x, o, i) -> #(mutable parent)
    if x.type == "::"
      parent := o.access i, parent, o.const i, \prototype
    o.access i, parent, x.child
  sequential! [
    [\type, maybe! DoubleColon, NOTHING]
    OpenSquareBracketChar
    [\child, Index]
    CloseSquareBracket
  ], #(x, o, i) -> #(mutable parent)
    if x.type != NOTHING
      parent := o.access i, parent, o.const i, \prototype
    o.access-index i, parent, x.child
]

define IdentifierOrAccess = sequential! [
  [\head, IdentifierOrAccessStart]
  [\tail, zero-or-more! IdentifierOrAccessPart]
], #(x, o, i)
  let mutable current = x.head
  for part in x.tail
    current := part(current)
  current

let SimpleAssignable = IdentifierOrAccess

define ComplexAssignable = one-of! [
  SimpleAssignable
  //ArrayAssignable
  //ObjectAssignable
]

define ColonEqual = sequential! [
  Space
  Colon
  character! "="
], ":="

define ExpressionOrAssignment = oneOf! [
  Assignment
  Expression
]

define DirectAssignment = sequential! [
  [\left, ComplexAssignable]
  [\op, ColonEqual]
  [\right, ExpressionOrAssignment]
], #(x, o, i) -> o.assign i, x.left, x.op, x.right

define CompoundAssignmentOp = one-of! [
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
  [\left, SimpleAssignable]
  [\op, CompoundAssignmentOp]
  [\right, ExpressionOrAssignment]
], #(x, o, i) -> o.assign i, x.left, x.op, x.right

define Assignment = one-of! [DirectAssignment, CompoundAssignment]

define PrimaryExpression = one-of! [
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
  [\head, DualObjectKey]
  [\tail, zero-or-more! sequential! [
    Comma
    [\this, DualObjectKey]
  ]]
], #(x, o, i) -> o.object i, [x.head, ...x.tail]

define ClosedArguments = sequential! [
  OpenParenthesisChar
  Space
  [\first, maybe! (sequential! [
    [\head, SpreadOrExpression],
    [\tail, zero-or-more! sequential! [
      Comma
      [\this, SpreadOrExpression]
    ]]
    MaybeComma
  ], #(x) -> [x.head, ...x.tail]), #-> []]
  [\rest, maybe! (sequential! [
    SomeEmptyLines
    MaybeAdvance
    [\this, maybe! (sequential! [
      CheckIndent
      [\head, SpreadOrExpression]
      [\tail, zero-or-more! sequential! [
        CommaOrNewlineWithCheckIndent
        [\this, SpreadOrExpression]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    EmptyLines
    MaybeCommaOrNewline
    PopIndent
  ]), #-> []]
  CloseParenthesis
], #(x, o, i) -> [...x.first, ...x.rest]

define UnclosedArguments = one-of! [
  sequential! [
    SomeSpace, // FIXME: do I need this?
    [\this, sequential! [
      [\head, SpreadOrExpression],
      [\tail, zero-or-more! sequential! [
        Comma
        [\this, SpreadOrExpression]
      ]]
      MaybeComma
    ], #(x) -> [x.head, ...x.tail]]
  ]
//  mutate! IndentedArrayLiteral, #(x) -> [x]
//  mutate! IndentedObjectLiteral, #(x) -> [x]
]

define InvocationArguments = one-of! [ClosedArguments, UnclosedArguments]

define BasicInvocationOrAccess = sequential! [
  [\is-new, maybe! word(\new), NOTHING]
  [\head, one-of! [
    sequential! [
      [\node, ThisShorthandLiteral]
      [\existential, MaybeExistentialSymbolNoSpace]
      [\child, IdentifierNameConstOrNumberLiteral]
    ], #(x, o, i) -> {
      type: \this-access
      x.node
      x.child
      existential: x.existential == "?"
    }
    mutate! PrimaryExpression, #(x) -> {
      type: \normal
      node: x
    }
  ]]
  [\tail, zero-or-more-of! [
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      EmptyLines
      Space
      [\type, one-of! [Period, DoubleColon]]
      [\child, IdentifierNameConstOrNumberLiteral]
    ], #(x) -> {
      type: if x.type == "::" then \proto-access else \access
      x.child
      existential: x.existential == "?"
    }
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      [\type, maybe! DoubleColon, \index, \proto-index]
      OpenSquareBracketChar
      [\child, Index]
      CloseSquareBracket
    ], #(x) -> {
      x.type
      x.child
      existential: x.existential == "?"
    }
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      [\args, InvocationArguments]
    ], #(x) -> {
      type: \call
      x.args
      existential: x.existential == "?"
      is-new: false
    }
    sequential! [
      ExistentialSymbolNoSpace
      [\this, InvocationOrAccess]
    ], #(x) -> {
      type: "?"
      child: x
    }
  ]]
], #(x, o, i)
  let mutable is-new = x.is-new != NOTHING
  let head = x.head
  let tail = x.tail

  if tail.length == 0 and not is-new and head.type == \normal
    return head.node

  let links = []
  if head.type == \this-access
    links.push { type: \access, head.child, head.existential }
  
  for part in tail
    if part.type in [\proto-access, \proto-index]
      links.push { type: \access, child: o.const(i, \prototype), part.existential }
      let clone = copy(part)
      clone.type := if part.type == \proto-access then \access else \index
      links.push clone
    else if part.type in [\access, \index]
      links.push part
    else if part.type == \call
      let clone = copy(part)
      clone.is-new := is-new
      is-new := false
      links.push clone
    else if part.type == "?"
      if is-new
        links.push { type: \call, args: [], existential: false, is-new: true }
        is-new := false
      links.push part
    else
      o.error "Unknown link type: $(part.type)"
  
  if is-new
    links.push { type: \call, args: [], existential: false, is-new: true }
  
  o.call-chain i, head.node, links

define EvalToken = word \eval
define Eval = short-circuit! EvalToken, sequential! [
  EvalToken
  [\this, InvocationArguments]
], #(args, o, i)
  if args.length != 1
    o.error("Expected only one argument to eval")
  o.eval i, args[0]

define InvocationOrAccess = one-of! [
  BasicInvocationOrAccess
  Eval
]

define ExistentialUnary = sequential! [
  [\node, InvocationOrAccess]
  [\op, MaybeExistentialSymbolNoSpace]
], #(x, o, i)
  if x.op == "?"
    o.unary i, x.op, x.node
  else
    x.node

define Unary = sequential! [
  [\op, maybe! (one-of! [
    sequential! [
      NotToken
      [\this, MaybeNotToken]
    ], #(x) -> if x == \not then \bool else \not
    word \bitnot
    word-or-symbol "~bitnot"
    sequential! [
      word \typeof
      [\this, maybe! (character! "!"), NOTHING]
    ], #(x) -> if x != NOTHING then "typeof!" else \typeof
    sequential! [
      [\this, one-of! [
        word \num
        word \str
        word \strnum
      ]]
      character! "!"
    ], #(x) -> x & "!"
    word \delete
    sequential! [
      word \throw
      [\this, MaybeExistentialSymbolNoSpace]
    ], #(x) -> if x == "?" then "throw?" else \throw
  ]), NOTHING]
  [\node, ExistentialUnary]
], #(x, o, i)
  if x.op != NOTHING
    o.unary i, x.op, x.node
  else
    x.node

define Negate = sequential! [
  [\op, maybe! (sequential! [
    [\this, one-of! [
      symbol "+"
      symbol "-"
      symbol "~+"
      symbol "~-"
      symbol "^"
    ]]
    NoSpace
  ]), NOTHING]
  [\node, Unary]
], #(x, o, i)
  if x.op != NOTHING
    if x.node.type == \const and typeof x.node.value == \number and x.op in ["+", "-", "~+", "~-"]
      o.const i, if x.op in ["+", "~+"] then +x.node.value else -x.node.value
    else
      o.unary i, x.op, x.node
  else
    x.node

let binary-left-to-right(x, o, i)
  let mutable current = x.head
  for part in x.tail
    current := o.binary i, current, part.op, part.node
  current

let binary-right-to-left(x, o, i)
  let head = x.head
  let tail = x.tail

  if tail.length == 0
    head
  else
    let mutable current = tail[tail.length - 1].node
    for j = tail.length - 1, 0, -1
      current := o.binary i, tail[j - 1].node, tail[j].op, current
    o.binary i, head, tail[0].op, current
macro make-binary!(operators, next-rule, minimum-extra, maximum-extra, right-to-left)
  if not @is-array operators
    operators := @array [operators]
  
  let init = []
  next-rule := @cache next-rule, init, \rule, true
  
  let op-choices = @array for x in @elements(operators)
    if @is-const(x)
      unless typeof @value(x) == \string
        throw Error "Unexpected non-string const: $(@value x)"
      AST word-or-symbol $x
    else
      x
  
  if not minimum-extra
    minimum-extra := AST 0
  if not maximum-extra
    maximum-extra := AST 0
  //if not @is-const(minimum-extra) or typeof @value(minimum-extra) != \number
  //  throw Error "Expected minimum-extra to be a const number"
  //if not @is-const(maximum-extra) or typeof @value(maximum-extra) != \number
  //  throw Error "Expected maximum-extra to be a const number"
  if right-to-left and not @is-const(right-to-left)
    throw Error "Expected right-to-left to be a const"
  
  let mutator = if @value(right-to-left) then AST binary-right-to-left else AST binary-left-to-right
  
  let result = AST sequential! [
    [\head, $next-rule]
    [\tail, multiple! $minimum-extra, $maximum-extra, sequential! [
      [\op, one-of! $op-choices]
      [\node, $next-rule]
    ]]
  ], $mutator
  if init.length
    AST do
      $init
      $result
  else
    result

define Exponentiation = make-binary! ["^", "~^"], Negate, 0, 0, true

define Multiplication = make-binary! ["*", "/", "%", "\\", "~*", "~/", "~%", "~\\"], Exponentiation
define Addition = make-binary! ["+", "-", "~+", "~-"], Multiplication

define BitwiseShift = make-binary! [\bitlshift, \bitrshift, \biturshift], Addition, 0, 1

define Min = make-binary! \min, BitwiseShift, 1
define Max = make-binary! \max, BitwiseShift, 0
define MinMax = one-of! [
  Min
  Max
]

define StringConcatenation = make-binary! ["&", "~&"], MinMax

define Containment = mutate! (make-binary! (sequential! [
  [\inverse, MaybeNotToken]
  [\op, one-of! [
    \in
    \haskey
    \ownskey
    \instanceof
    \instanceofsome
  ]]
], #(x)
  if x.inverse == \not
    "not $(x.op)"
  else
    x.op), StringConcatenation, 0, 1), #(x, o, i)
  if x and x.type == \binary and x.op.substring(0, 4) == "not "
    o.unary i, \not, o.binary(i, x.left, x.op.substring(4), x.right)
  else
    x

define Spaceship = make-binary! "<=>", Containment, 0, 1

define Comparison = make-binary! ["~=", "!~=", "==", "!=", "%%", "!%%", "~%%", "!~%%", "<", "<=", ">", ">=", "~<", "~<=", "~>", "~>="], Spaceship, 0, 1

define LogicalAnd = make-binary! \and, Comparison, 1
define LogicalOr = make-binary! \or, Comparison, 1
define LogicalXor = make-binary! \xor, Comparison, 1
define ExistentialOr = make-binary! ExistentialSymbol, Comparison, 1, 0, true
define BitwiseAnd = make-binary! \bitand, Comparison, 1
define BitwiseOr = make-binary! \bitor, Comparison, 1
define BitwiseXor = make-binary! \bitxor, Comparison, 1

define Logic = one-of! [
  LogicalAnd
  LogicalOr
  LogicalXor
  ExistentialOr
  BitwiseAnd
  BitwiseOr
  BitwiseXor
  Comparison
]

define ExpressionAsStatement = one-of! [
  UseMacro
  Logic
]
define Expression = in-expression ExpressionAsStatement 

define IdentifierDeclarable = sequential! [
  [\is-mutable, MaybeMutableToken]
  [\ident, Identifier]
], #(x, o, i) -> o.declarable i, x.ident, x.is-mutable == \mutable

define Declarable = one-of! [
  IdentifierDeclarable
  //ArrayDeclarable
  //ObjectDeclarable
]

define LetToken = word \let
define Let = short-circuit! LetToken, sequential! [
  LetToken
  [\left, Declarable]
  [\right, one-of! [
    sequential! [
      DeclareEqualSymbol
      [\this, ExpressionOrAssignment]
    ]
    FunctionDeclaration
  ]]
], #(x, o, i) -> o.let i, x.left, x.right

define ReturnToken = word \return
define Return = short-circuit! ReturnToken, sequential! [
  ReturnToken
  [\existential, MaybeExistentialSymbolNoSpace]
  [\node, ExpressionOrNothing]
], #(x, o, i) -> o.return i, x.node, x.existential == "?"

define YieldToken = word \yield
define Yield = short-circuit! YieldToken, sequential! [
  YieldToken
  [\multiple, maybe! Asterix, NOTHING]
  [\node, Expression]
], #(x, o, i) -> o.yield i, x.node, x.multiple != NOTHING

define Break = word \break, #(x, o, i) -> o.break i

define Continue = word \continue, #(x, o, i) -> o.continue i

define Statement = sequential! [
  [\this, in-statement one-of! [
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
  [\this, Statement]
]

define Block = sequential! [
  [\head, Line]
  [\tail, zero-or-more! sequential! [
    Newline
    EmptyLines
    [\this, Line]
  ]]
], #(x, o, i)
  let nodes = []
  for item in [x.head, ...x.tail]
    if item.type == \block
      nodes.push ...item.nodes
    else
      nodes.push item
  o.block i, nodes

define Root = sequential! [
  maybe! Shebang, true
  EmptyLines
  [\this, one-of! [
    Block
    Nothing
  ]]
  EmptyLines
  Space
], #(x, o, i) -> o.root i, x

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
    @unsaved-tmps := []
    @saved-tmps := []
  
  MacroHelper::if := #(test as Object, when-true as Object, when-false as (Object|null)) -> @state.if @index, test, when-true, when-false
  MacroHelper::for := #(init as (Object|null), test as (Object|null), step as (Object|null), body as Object) -> @state.for @index, init, test, step, body
  MacroHelper::for-in := #(key as Object, object as Object, body as Object) -> @state.for-in @index, key, object, body
  MacroHelper::try-catch := #(try-body as Object, catch-ident as Object, catch-body as Object) -> @state.try-catch @index, try-body, catch-ident, catch-body
  MacroHelper::try-finally := #(try-body as Object, finally-body as Object) -> @state.try-finally @index, try-body, finally-body
  
  let get-tmp-id = do
    let id = -1
    #-> id += 1
  
  MacroHelper::tmp := #(name as String = \ref, save as Boolean)
    let id = get-tmp-id()
    (if save then @saved-tmps else @unsaved-tmps).push id
    @state.tmp @index, id, name
  
  MacroHelper::get-tmps := #-> {
    unsaved: @unsaved-tmps[:]
    saved: @saved-tmps[:]
  }
  
  MacroHelper::is-const := #(node) -> node == void or (node? and (node.type == \const or (node.type == \block and node.nodes.length == 0)))
  MacroHelper::value := #(node)
    if node == void
      void
    else if node?
      if node.type == \const
        node.value
      else if node.type == \block and node.nodes.length == 0
        void
  MacroHelper::const := #(value)
    if value instanceof RegExp or value == null or typeof value in [\undefined, \boolean, \string, \number]
      ParserNode \const, 0, 0, { value }
    else
      throw Error("Cannot make a const out of $(String value)")
  
  MacroHelper::is-ident := #(node) -> node? and node.type == \ident
  MacroHelper::name := #(node)
    if node? and node.type == \ident
      node.name
  MacroHelper::ident := #(name)
    if typeof name != \string
      throw TypeError "Expected a string"
    ParserNode \ident, 0, 0, { name }
  
  MacroHelper::is-call := #(node)
    if node? and node.type == \call-chain
      let links = node.links
      links[links.length - 1].type == \call
    else
      false
  
  MacroHelper::call-func := #(node)
    if node? and node.type == \call-chain
      let links = node.links
      if links[links.length - 1].type == \call
        if links.length == 1
          node.head
        else
          ParserNode node.type, node.start-index, node.end-index, {
            node.head
            links: links[:links.length - 1]
          }
  
  MacroHelper::call-args := #(node)
    if node? and node.type == \call-chain
      let links = node.links
      if links[links.length - 1].type == \call
        links[links.length - 1].args
  
  MacroHelper::call-is-new := #(node)
    if node? and node.type == \call-chain
      let links = node.links
      if links[links.length - 1].type == \call
        return not not links[links.length - 1].is-new
    false
  
  MacroHelper::call := #(func, args, is-new = false)
    if not func or typeof func != \object
      throw TypeError "Expected func to be an object, got $(typeof! func)"
    if not Array.is-array args
      throw TypeError "Expected args to be an Array, got $(typeof! args)"
    if typeof is-new != \boolean
      throw TypeError "Expected is-new to be a Boolean, got $(typeof! is-new)"
    if func.type == \call-chain
      ParserNode \call-chain, func.start-index, func.end-index, {
        head: func.head
        links: [
          ...func.links
          {
            type: \call
            args
            is-new
          }
        ]
      }
    else
      ParserNode \call-chain, func.start-index, func.end-index, {
        head: func
        links: [
          {
            type: \call
            args
            is-new
          }
        ]
      }
  
  MacroHelper::func := #(params as Array, body as Object, auto-return as Boolean = true, bound as Boolean = false)
    ParserNode \function, 0, 0, { params, body, auto-return, bound }
  
  MacroHelper::is-func := #(node) -> node and node.type == \function
  MacroHelper::func-body := #(node)
    if node? and node.type == \function
      node.body
  MacroHelper::func-params := #(node)
    if node? and node.type == \function
      node.params
  MacroHelper::func-is-auto-return := #(node)
    if node? and node.type == \function
      not not node.auto-return
  MacroHelper::func-is-bound := #(node)
    if node? and node.type == \function
      not not node.bound
  
  MacroHelper::is-array := #(node) -> node and node.type == \array
  MacroHelper::elements := #(node)
    if node? and node.type == \array
      node.elements
  
  MacroHelper::is-object := #(node) -> node and node.type == \object
  MacroHelper::pairs := #(node)
    if node? and node.type == \object
      node.pairs
  
  MacroHelper::array := #(elements as [Object])
    for element, i in elements
      if not element or typeof element != \object
        throw Error "Expected at object at index #$i, got $(typeof! element)"
    ParserNode \array, 0, 0, { elements }
  MacroHelper::object := #(pairs as Array)
    for pair, i in pairs
      if not pair or typeof pair != \object
        throw Error "Expected an object at index #$i, got $(typeof! pair)"
      else if not pair.key or typeof pair.key != \object
        throw Error "Expected an object with object 'key' at index #$i, got $(typeof! pair.key)"
      else if not pair.value or typeof pair.value != \object
        throw Error "Expected an object with object 'value' at index #$i, got $(typeof! pair.value)"
    ParserNode \object, 0, 0, { pairs }
  
  MacroHelper::is-complex := #(node)
    node? and node.type not in [\const, \ident, \tmp] and not (node.type == \block and node.nodes.length == 0)
  
  MacroHelper::cache := #(node, init, name as String = \ref, save as Boolean)
    if @is-complex node
      let tmp = @tmp(name, save)
      init.push ParserNode \let, @index, @index, { left: (ParserNode \declarable, @index, @index, { ident: tmp, is-mutable: false }), right: node }
      tmp
    else
      node
  
  MacroHelper::empty := #(node)
    if not node?
      true
    else if typeof node != \object
      false
    else if node.type == \block
      return for every item in node.nodes
        @empty(item)
    else
      node.type == \nothing
  
  let array-equal(x, y)
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
  
  let obj-equal(x, y)
    if x == y
      true
    else if not x or typeof x != \object
      false
    else if Array.is-array x
      Array.is-array(y) and array-equal(x, y)
    else
      for k of x
        if y not ownskey k or x[k] != y[k]
          return false
      true
  
  let map(array, func, arg)
    let result = []
    let mutable changed = false
    for item in array
      let new-item = func item, arg
      result.push new-item
      if item != new-item
        changed := true
    if changed
      result
    else
      array
  
  let constify-array(array, start-index, end-index)
    ParserNode \array, start-index, end-index, {
      elements: for x in array
        constify-object x, start-index, end-index
    }
  
  let KNOWN_HELPERS = require('./translator').known-helpers
  
  let constify-object(obj, start-index, end-index)
    if not obj or typeof obj != \object or obj instanceof RegExp
      ParserNode \const, start-index, end-index, { value: obj }
    else if Array.is-array obj
      constify-array obj, start-index, end-index
    else if obj.type == \ident and obj.name.char-code-at(0) == "\$".char-code-at(0)
      ParserNode \call-chain, obj.start-index, obj.end-index, {
        head: ParserNode \ident, obj.start-index, obj.end-index, { name: \__wrap }
        links: [{
          type: \call
          args: [ParserNode \ident, obj.start-index, obj.end-index, { name: obj.name.substring 1 }]
          existential: false
          is-new: false
        }]
      }
    else if obj.type == \ident and obj.name in KNOWN_HELPERS
      ParserNode \macro-helper, obj.start-index, obj.end-index, { obj.name }
    else if obj.type == \macro-access
      ParserNode \call-chain, obj.start-index, obj.end-index, {
        head: ParserNode \ident, obj.start-index, obj.end-index, { name: \__macro }
        links: [{
          type: \call
          args: [
            ParserNode \const, obj.start-index, obj.end-index, { value: obj.id }
            constify-object obj.data, obj.start-index, obj.end-index
          ]
          existential: false
          is-new: false
        }]
      }
    else
      ParserNode \object, start-index, end-index, {
        pairs: for k, v of obj
          {
            key: ParserNode \const, start-index, end-index, { value: k }
            value: constify-object v, start-index, end-index
          }
      }
  MacroHelper.constify-object := constify-object
  
  let walkers = {
    access: #(x, func)
      let parent = walk x.parent, func
      let child = walk x.child, func
      if parent != x.parent or child != x.child
        ParserNode x.type, x.start-index, x.end-index, { parent, child }
      else
        x
    arguments: identity
    array: #(x, func)
      let elements = walk-array x.elements, func
      if elements != x.elements
        ParserNode x.type, x.start-index, x.end-index, { elements }
      else
        x
    array-param: #(x, func)
      let elements = walk-array x.elements, func
      if elements != x.elements
        ParserNode x.type, x.start-index, x.end-index, { elements }
      else
        x
    assign: #(x, func)
      let left = walk x.left, func
      let right = walk x.right, func
      if left != x.left or right != x.right
        ParserNode x.type, x.start-index, x.end-index, { left, x.op, right }
      else
        x
    ast: #(x, func) -> constify-object x.node, x.start-index, x.end-index
    binary: #(x, func)
      let left = walk x.left, func
      let right = walk x.right, func
      if left != x.left or right != x.right
        ParserNode x.type, x.start-index, x.end-index, { left, x.op, right }
      else
        x
    block: #(x, func)
      let nodes = walk-array x.nodes, func
      if nodes != x.nodes
        ParserNode x.type, x.start-index, x.end-index, { nodes }
      else
        x
    break: identity
    call-chain: do
      let link-types = {
        access: #(link, func)
          let child = walk link.child, func
          if child != link.child
            {
              type: \access
              child
              link.existential
            }
          else
            link
        call: #(link, func)
          let args = walk-array link.args, func
          if args != link.args
            {
              type: \call
              args
              link.existential
              link.is-new
            }
          else
            link
        index: do
          let index-types = {
            single: #(x, func)
              let node = walk x.node, func
              if node != x.node
                {
                  type: \single
                  node
                }
              else
                x
            slice: #(x, func)
              let left = walk x.left, func
              let right = walk x.right, func
              if left != x.left or right != x.right
                {
                  type: \slice
                  left
                  right
                }
              else
                x
            multi: #(x, func)
              let elements = walk-array x.elements, func
              if elements != x.elements
                {
                  type: \multi
                  elements
                }
              else
                x
          }
          #(x, func)
            let type = x.child.type
            unless index-types ownskey type
              throw Error "Unknown index type: $type"
            
            let child = index-types[type](x.child, func)
            if child != x.child
              {
                type: \index
                child
                x.existential
              }
            else
              x
      }
      let walk-link(link, func)
        unless link-types ownskey link.type
          throw Error "Unknown call-chain link type: $(link.type)"
        
        link-types[link.type](link, func)
      #(x, func)
        let head = walk x.head, func
        let links = map x.links, walk-link, func
        if head != x.head or links != x.links
          ParserNode x.type, x.start-index, x.end-index, { head, links }
        else
          x
    const: identity
    continue: identity
    debugger: identity
    declarable: #(x, func)
      // FIXME: is this necessary? it should be only referenced as a child of let
      let ident = walk x.ident, func
      if ident != x.ident
        ParserNode x.type, x.start-index, x.end-index, { ident, x.is-mutable }
      else
        x
    eval: #(x, func)
      let code = walk x.code, func
      if code != x.code
        ParserNode x.type, x.start-index, x.end-index, { code }
      else
        x
    for: #(x, func)
      let init = walk x.init, func
      let test = walk x.test, func
      let step = walk x.step, func
      let body = walk x.body, func
      if init != x.init or test != x.test or step != x.step or body != x.body
        ParserNode x.type, x.start-index, x.end-index, { init, test, step, body }
      else
        x
    for-in: #(x, func)
      let key = walk x.key, func
      let object = walk x.object, func
      let body = walk x.body, func
      if key != x.key or object != x.object or body != x.body
        ParserNode x.type, x.start-index, x.end-index, { key, object, body }
      else
        x
    function: do
      let param-types = {
        param: #(x, func)
          let ident = walk x.ident, func
          let default-value = walk x.default-value, func
          let as-type = walk x.as-type, func
          if ident != x.ident or default-value != x.default-value or as-type != x.as-type
            ParserNode x.type, x.start-index, x.end-index, { ident, default-value, x.spread, x.is-mutable, as-type }
          else
            x
      }
      let walk-param(param, func)
        unless param-types ownskey param.type
          throw Error "Unknown param type: $(param.type)"
        
        param-types[param.type](param, func)
      #(x, func)
        let params = map x.params, walk-param, func
        let body = walk x.body, func
        if params != x.params or body != x.body
          ParserNode x.type, x.start-index, x.end-index, { params, body, x.auto-return, x.bound }
        else
          x
    ident: identity
    if: #(x, func)
      let test = walk x.test, func
      let when-true = walk x.when-true, func
      let when-false = walk x.when-false, func
      if test != x.test or when-true != x.when-true or when-false != x.when-false
        ParserNode x.type, x.start-index, x.end-index, { test, when-true, when-false }
      else
        x
    index: do
      let index-types = {
        single: #(x, func)
          let node = walk x.node, func
          if node != x.node
            { type: \single, node }
          else
            x
      }
      #(x, func)
        unless index-types ownskey x.child.type
          throw Error "Unknown index type: $(x.child.type)"
        let parent = walk x.parent, func
        let child = index-types[x.child.type](x.child, func)
        if parent != x.parent or child != x.child
          ParserNode x.type, x.start-index, x.end-index, { parent, child }
        else
          x
    let: do
      let declarable-types = {
        declarable: #(x, func)
          let ident = walk x.ident, func
          if ident != x.ident
            ParserNode \declarable, x.start-index, x.end-index, { ident, x.is-mutable }
          else
            x
      }
      #(x, func)
        unless declarable-types ownskey x.left.type
          throw Error "Unknown let declarable type: $(x.left.type)"
        
        let left = declarable-types[x.left.type](x.left, func)
        let right = walk x.right, func
        if left != x.left or right != x.right
          ParserNode \let, x.start-index, x.end-index, { left, right }
        else
          x
    nothing: identity
    object: do
      let walk-pair(pair, func)
        let key = walk pair.key, func
        let value = walk pair.value, func
        if key != pair.key or value != pair.value
          { key, value }
        else
          pair
      #(x, func)
        let pairs = map x.pairs, walk-pair, func
        if pairs != x.pairs
          ParserNode x.type, x.start-index, x.end-index, { pairs }
        else
          x
    operator: identity
    regexp: #(x, func)
      let text = walk x.text, func
      if text != x.text
        ParserNode x.type, x.start-index, x.end-index, { text, x.flags }
      else
        x
    return: #(x, func)
      let node = walk x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { node, x.existential }
      else
        x
    root: #(x, func)
      let body = walk x.body, func
      if body != x.body
        ParserNode x.type, x.start-index, x.end-index, { node, x.body }
      else
        x
    spread: #(x, func)
      let node = walk x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { node }
      else
        x
    string: #(x, func)
      let parts = walk-array x.parts, func
      if parts != x.parts
        ParserNode x.type, x.start-index, x.end-index, { parts }
      else
        x
    this: identity
    tmp: identity
    try-catch: #(x, func)
      let try-body = walk x.try-body, func
      let catch-ident = walk x.catch-ident, func
      let catch-body = walk x.catch-body, func
      if try-body != x.try-body or catch-ident != x.catch-ident or catch-body != x.catch-body
        ParserNode x.type, x.start-index, x.end-index, { try-body, catch-ident, catch-body }
      else
        x
    try-finally: #(x, func)
      let try-body = walk x.try-body, func
      let finally-body = walk x.finally-body, func
      if try-body != x.try-body or finally-body != x.finally-body
        ParserNode x.type, x.start-index, x.end-index, { try-body, finally-body }
      else
        x
    unary: #(x, func)
      let node = walk x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { x.op, node }
      else
        x
    use-macro: #(x, func)
      let node = walk x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { node, x.tmps, x.macro-helpers }
      else
        x
    yield: #(x, func)
      let node = walk x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { node, x.multiple }
      else
        x
  }
  let walk(node, func)
    if not node or typeof node != \object or node instanceof RegExp
      return node
    
    unless walkers ownskey node.type
      throw Error "Unknown node type to walk through: $(node.type)"
    
    return? func node
    if NEW_STYLE_NODES ownskey node.type
      walkers[node.type](node, func)
    else
      let value = walkers[node.type](node.value, func)
      if obj-equal value, node.value
        node
      else
        {
          node.type
          node.start-index
          node.end-index
          value: value
        }
  let walk-array(array, func) -> map array, walk, func
  
  MacroHelper.fix-asts := #(result) -> walk result, #->
  
  MacroHelper.wrap := #(value = [])
    if Array.is-array(value)
      if value.length == 1
        MacroHelper.wrap(value[0])
      else
        let nodes = []
        for item in value
          let wrapped = MacroHelper.wrap(item)
          if wrapped.type == \block
            nodes.push ...wrapped.nodes
          else
            nodes.push wrapped
        ParserNode \block, 0, 0, { nodes }
    else if typeof value != \object or value instanceof RegExp
      throw Error "Trying to wrap a non-object: $(typeof! value)"
    else
      value
  
  MacroHelper::has-func := #(node)
    let FOUND = {}
    try
      walk node, #(x)
        if x.type == \function
          throw FOUND
    catch e
      if e != FOUND
        throw e
      return true
    false
  
  let mutators = {
    block: #(x, func)
      let nodes = x.nodes
      let len = nodes.length
      if len != 0
        let last-node = @mutate-last(nodes[len - 1], func)
        if last-node != nodes[len - 1]
          return ParserNode x.type, x.start-index, x.end-index, { nodes: [...nodes[:len - 1], last-node] }
      x
    if: #(x, func)
      let when-true = @mutate-last x.when-true, func
      let when-false = @mutate-last x.when-false, func
      if when-true != x.when-true or when-false != x.when-false
        ParserNode x.type, x.start-index, x.end-index, { x.test, when-true, when-false }
      else
        x
    use-macro: #(x, func)
      let node = @mutate-last x.node, func
      if node != x.node
        ParserNode x.type, x.start-index, x.end-index, { node, x.tmps, x.macro-helpers }
      else
        x
    break: identity
    continue: identity
    nothing: identity
    return: identity
    debugger: identity
    throw: identity
  }
  MacroHelper::mutate-last := #(node, func)
    if not node or typeof node != \object or node instanceof RegExp
      node
    else if mutators not ownskey node.type
      func(node) ? node
    else
      mutators[node.type].call(this, node, func)
  
  MacroHelper

let MacroHolder = do
  let MacroHolder()!
    if this not instanceof MacroHolder
      throw TypeError "Must be instantiated with new"
    @by-name := {}
    @by-id := []
  
  MacroHolder::get-by-name := #(name)
    let by-name = @by-name
    if by-name ownskey name
      by-name[name]
  
  MacroHolder::get-or-add-by-name := #(name)
    let by-name = @by-name
    if by-name ownskey name
      by-name[name]
    else
      let token = macro-name name
      let m = short-circuit! token, named "<$name macro>", #(o)
        for item in m.data
          let result = item o
          if result
            return result
        false
      m.token := token
      m.data := []
      by-name[name] := m
  
  MacroHolder::get-by-id := #(id)
    let by-id = @by-id
    if id >= 0 and id < by-id.length
      by-id[id]
  
  MacroHolder::add-macro := #(m)
    let by-id = @by-id
    by-id.push m
    by-id.length - 1
  
  MacroHolder

let State = do
  let State(@data, @macros = new MacroHolder(), @index = 0, @failures = new FailureManager(), @cache = [], @indent = new Stack(1), @current-macro = null)! ->
  
  State::clone := #-> new State @data, @macros, @index, @failures, @cache, @indent.clone(), @current-macro
  
  State::update := #(clone)!
    @index := clone.index
    @indent := clone.indent.clone()
    @macros := clone.macros
  
  State::fail := #(message)!
    @failures.add message, @index
  
  State::error := #(message)!
    throw ParserError message, @data, @index
  
  State::node := #(type, index, value) -> ParserNode type, index, @index, { value }
  
  State::start-macro := #(name)!
    if @current-macro
      @error "Attempting to define a macro $name inside a macro $(@current-macro)"
    @current-macro := name
  
  State::end-macro := #()
    if not @current-macro
      @error "Ending a macro when not in a macro"
    @current-macro := null
    @nothing @index
  
  let macro-syntax-types = {
    syntax: #(index, params, body)
      let next-parts = []
      let calc-param(param)@
        let type = param.type
        if type == \ident
          let ident = param.name
          if ident == \Logic
            Logic
          else if ident == \Expression
            Expression
          else if ident == \Statement
            Statement
          else if ident == \Body
            // TODO: this is definitely wrong
            next-parts.push Newline, EmptyLines, CheckIndent
            Body
          else if ident == \Identifier
            Identifier
          else if ident == \Declarable
            Declarable
          else if ident == \Parameter
            Parameter
          else if ident == \DedentedBody
            DedentedBody
          else
            // TODO: add specific index
            @error "Unexpected type ident: $ident"
        else if type == \syntax-sequence
          handle-params param.params, []
        else if type == \syntax-choice
          let choices = for choice in param.choices
            calc-param choice
          cache! #(o)
            // TODO: change for to for first-else
            for rule in choices
              let result = rule o
              if result
                return result
            false
        else if type == \const
          let string = param.value
          if typeof string != \string
            @error "Expected a constant string parameter, got $(typeof! string)"
          if string == ","
            Comma
          else if string == ";"
            Semicolon
          else if string == ""
            Nothing
          else
            word-or-symbol string
        else if type == \syntax-many
          let multiplier = param.multiplier
          let calced = calc-param param.inner
          if multiplier == "*"
            zero-or-more! calced
          else if multiplier == "+"
            one-or-more! calced
          else if multiplier == "?"
            one-of! [calced, Nothing]
          else
            throw Error("Unknown syntax multiplier: $multiplier")
        else
          @error "Unexpected type: $type"
    
      let handle-params(params, sequence)@
        for param in params
          // TODO: fix this, it's ugly
          if param.type != \syntax-param or not param.as-type or (param.as-type.type != \syntax-many and (param.as-type.type != \ident or param.as-type.name != \DedentedBody))
            sequence.push ...next-parts
            next-parts := []
        
          let type = param.type
          if type == \const
            let string = param.value
            if typeof string != \string
              @error "Expected a constant string parameter, got $(typeof! string)"
          
            if string == ","
              sequence.push Comma
            else if string == ";"
              sequence.push Semicolon
            else
              sequence.push word-or-symbol string
          else if type == \syntax-param
            let ident = param.ident
            let key = if ident.type == \ident
              ident.name
            else if ident.type == \this
              \this
            else
              throw Error "Don't know how to handle ident type: $(ident.type)"
            let type = param.as-type ? ParserNode \ident, 0, 0, { name: \Expression }
            sequence.push [key, calc-param type]
          else
            @error "Unexpected parameter type: $type"
        sequential sequence
    
      let func-params = for param in params
        if param.type == \syntax-param
          {
            key: @const index, param.ident.name
            value: @param index, param.ident, void, false, true, void
          }
    
      let raw-func = @root index, @return index, @function(index
        [
          @object-param index, func-params
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false), false
      let translated = require('./translator')(raw-func)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(@current-macro)"
      {
        handler
        rule: handle-params params, []
        translated.macro-helpers
      }
    
    call: #(index, params, body)
      let raw-func = @root index, @return index, @function(index
        [
          @array-param index, params
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false)
      let translated = require('./translator')(raw-func)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(@current-macro)"
      {
        handler
        rule: InvocationArguments
        translated.macro-helpers
      }
  }
  
  State::macro-syntax := #(index, type, params, body)!
    if not Array.is-array params
      throw TypeError "Expected params to be an array, got $(typeof! params)"
    else if not body or typeof body != \object or body instanceof RegExp
      throw TypeError "Expected body to be an object, got $(typeof! body)"
    
    if macro-syntax-types not ownskey type
      throw Error "Unknown macro-syntax type: $type"
    
    if not @current-macro
      this.error "Attempting to specify a macro syntax when not in a macro"

    let data = macro-syntax-types[type].call this, index, params, MacroHelper.fix-asts(body)
    let handler = data.handler
    let rule = data.rule
    let macro-helpers = data.macro-helpers
    
    let macros = @macros
    let mutator = #(x, o, i)
      if _in-ast.peek()
        o.macro-access i, macro-id, x
      else
        let macro-helper = new MacroHelper o, i, not _statement.peek()
        let result = handler.call macro-helper, x, MacroHelper.wrap, #(id, data)
          macros.get-by-id(id)(data, o, i)
        let tmps = macro-helper.get-tmps()
        o.use-macro i, result, tmps.unsaved, macro-helpers
    let m = macros.get-or-add-by-name @current-macro
    let func = sequential! [m.token, [\this, rule]], mutator
    let macro-id = macros.add-macro(mutator)
    m.data.push func
  
  State

let NEW_STYLE_NODES = {
  regexp: true
  this: true
  const: true
  string: true
  arguments: true
  ident: true
  operator: true
  array: true
  array-param: true
  access: true
  unary: true
  object: true
  type-union: true
  type-array: true
  param: true
  nothing: true
  debugger: true
  function: true
  syntax-sequence: true
  syntax-choice: true
  syntax-param: true
  define-helper: true
  index: true
  assign: true
  call-chain: true
  binary: true
  return: true
  spread: true
  ast: true
  eval: true
  break: true
  continue: true
  yield: true
  block: true
  root: true
  macro-access: true
  use-macro: true
  declarable: true
  let: true
  try-catch: true
  try-finally: true
  if: true
  for: true
  tmp: true
}
let ParserNode = do
  let ParserNode(type as String, start-index as Number, end-index as Number, data as (Object|null))
    if Array.is-array(data)
      throw TypeError "Expected a non-array for data"
    let self = if this instanceof ParserNode then this else ^ParserNode.prototype
    self.type := type
    self.start-index := start-index
    self.end-index := end-index
    if data?
      for k, v of data
        self[k] := v
    self
  
  ParserNode

State::regexp := #(index, text, flags) -> ParserNode \regexp, index, @index, { text, flags }
State::this := #(index) -> ParserNode \this, index, @index
State::break := #(index) -> ParserNode \break, index, @index
State::continue := #(index) -> ParserNode \continue, index, @index
State::const := #(index, value) -> ParserNode \const, index, @index, { value }
State::string := #(index, parts as Array) -> ParserNode \string, index, @index, { parts }
State::args := #(index) -> ParserNode \arguments, index, @index
State::ident := #(index, name as String) -> ParserNode \ident, index, @index, { name }
State::operator := #(index, op as String) -> ParserNode \operator, index, @index, { op }
State::array := #(index, elements as Array) -> ParserNode \array, index, @index, { elements }
State::array-param := State::array
State::object := #(index, pairs as [Object]) -> ParserNode \object, index, @index, { pairs }
State::object-param := State::object
State::access := #(index, parent as Object, child as Object) -> ParserNode \access, index, @index, { parent, child }
State::access-index := #(index, parent as Object, child as Object) -> ParserNode \index, index, @index, { parent, child }
State::unary := #(index as Number, op as String, node as Object) -> ParserNode \unary, index, @index, { op, node }
State::type-union := #(index as Number, types as Array) -> ParserNode \type-union, index, @index, { types }
State::type-array := #(index as Number, subtype as Object) -> ParserNode \type-array, index, @index, { subtype }
State::param := #(index as Number, ident, default-value, spread as Boolean, is-mutable as Boolean, as-type) -> ParserNode \param, index, @index, { ident, default-value, spread, is-mutable, as-type }
State::nothing := #(index as Number) -> ParserNode \nothing, index, @index
State::debugger := #(index as Number) -> ParserNode \debugger, index, @index
State::function := #(index as Number, params as [Object], body as Object, auto-return as Boolean = true, bound as Boolean = false) -> ParserNode \function, index, @index, { params, body, auto-return, bound }
State::syntax-sequence := #(index as Number, params as [Object]) -> ParserNode \syntax-sequence, index, @index, { params }
State::syntax-choice := #(index as Number, choices as [Object]) -> ParserNode \syntax-choice, index, @index, { choices }
State::syntax-param := #(index as Number, ident as Object, as-type) -> ParserNode \syntax-param, index, @index, { ident, as-type }
State::syntax-many := #(index as Number, inner as Object, multiplier as String) -> ParserNode \syntax-many, index, @index, { inner, multiplier }
State::define-helper := #(index as Number, name as Object, value as Object) -> ParserNode \define-helper, index, @index, { name, value }
State::assign := #(index as Number, left as Object, op as String, right as Object) -> ParserNode \assign, index, @index, { left, op, right }
State::call-chain := #(index as Number, head as Object, links as [Object]) -> ParserNode \call-chain, index, @index, { head, links }
State::binary := #(index as Number, left as Object, op as String, right as Object) -> ParserNode \binary, index, @index, { left, op, right }
State::return := #(index as Number, node as Object, existential as Boolean) -> ParserNode \return, index, @index, { node, existential }
State::spread := #(index as Number, node as Object) -> ParserNode \spread, index, @index, { node }
State::ast := #(index as Number, node as Object) -> ParserNode \ast, index, @index, { node }
State::eval := #(index as Number, code as Object) -> ParserNode \eval, index, @index, { code }
State::yield := #(index as Number, node as Object, multiple as Boolean) -> ParserNode \yield, index, @index, { node, multiple }
State::block := #(index as Number, nodes as [Object]) -> ParserNode \block, index, @index, { nodes }
State::root := #(index as Number, body as Object) -> ParserNode \root, index, @index, { body }
State::macro-access := #(index as Number, id as Number, data as Object) -> ParserNode \macro-access, index, @index, { id, data }
State::use-macro := #(index as Number, node as Object, tmps as Array, macro-helpers as Array) -> ParserNode \use-macro, index, @index, { node, tmps, macro-helpers }
State::declarable := #(index as Number, ident as Object, is-mutable as Boolean) -> ParserNode \declarable, index, @index, { ident, is-mutable }
State::let := #(index as Number, left as Object, right as Object) -> ParserNode \let, index, @index, { left, right }
State::if := #(index as Number, test as Object, when-true as Object, when-false as (Object|null)) -> ParserNode \if, index, @index, { test, when-true, when-false }
State::try-catch := #(index as Number, try-body as Object, catch-ident as Object, catch-body as Object) -> ParserNode \try-catch, index, @index, { try-body, catch-ident, catch-body }
State::try-finally := #(index as Number, try-body as Object, finally-body as Object) -> ParserNode \try-finally, index, @index, { try-body, finally-body }
State::for := #(index as Number, init as (Object|null), test as (Object|null), step as (Object|null), body as Object) -> ParserNode \for, index, @index, { init, test, step, body }
State::for-in := #(index as Number, key as Object, object as Object, body as Object) -> ParserNode \for-in, index, @index, { key, object, body }
State::tmp := #(index as Number, id as Number, name as String) -> ParserNode \tmp, index, @index, { id, name }

let unique(array)
  let result = []
  for item in array
    if item not in result
      result.push item
  result

let build-expected(errors)
  let errs = unique errors
  errs.sort #(a, b) -> a.to-lower-case() <=> b.to-lower-case()
  let len = errs.length
  if len == 0
    "End of input"
  else if len == 1
    errs[0]
  else if len == 2
    "$(errs[0]) or $(errs[1])"
  else
    "$(errs[:len - 1].join ', '), or $(errs[errs.length - 1])"

let build-error-message(errors, last-token)
  "Expected $(build-expected errors), but $(last-token) found"

let parse(text, macros, options = {})
  if typeof text != \string
    throw TypeError "Expected text to be a string, got $(typeof! text)"
  
  let o = new State text, macros
  
  let result = try
    Root(o)
  catch e
    if e != SHORT_CIRCUIT
      throw e
  
  if not result or o.index < o.data.length
    let position = o.failures.position
    let last-token = if position < o.data.length
      JSON.stringify o.data.substring(position, position + 20)
    else
      "end-of-input"
    throw ParserError build-error-message(o.failures.messages, last-token), o.data, position
  else
    {
      result
      o.macros
    }
module.exports := parse
module.exports.ParserError := ParserError
module.exports.ParserNode := ParserNode