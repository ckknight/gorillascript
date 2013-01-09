require! './types'

let GLOBAL = if typeof window != \undefined then window else global

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
let ret-this() -> this

let get-tmp-id = do
  let id = -1
  #-> id += 1

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

macro C(string, index)
  if @empty(index)
    index := AST 0
  AST $string.char-code-at($index)

macro mutate!(rule, mutator)
  if mutator? and (not @is-const(mutator) or @value(mutator) != void)
    let init = []
    rule := @cache rule, init, \rule, true
    mutator := @cache mutator, init, \mutator, true
    let unknown-name = @const(if @is-ident(rule) then @name(rule) else "<unknown>")
    let result = AST named($rule?.parser-name or $unknown-name, #(o)
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
  switch elements.length
  case 0
    throw Error "Cannot provide an empty array"
  case 1
    let rule = elements[0]
    AST mutate! $rule, $mutator
  default
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
  
  let unknown-name = @const(if @is-ident(rule) then @name(rule) else "<unknown>")
  
  let result = AST named(($rule?.parser-name or $unknown-name) & "?", #(o)
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
  
  let unknown-name = @const(if @is-ident(rule) then @name(rule) else "<unknown>")
  let result = AST named("!" & ($rule?.parser-name or $unknown-name), #(o)
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
  
  let unknown-name = @const(if @is-ident(backend) then @name(backend) else "<unknown>")
  let result = AST named($backend?.parser-name or $unknown-name, #(o)
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
    else if @value(max-count) == 1
      return AST "$($name)?"
  else if @value(min-count) == 1
    if @value(max-count) == 0
      return AST "$($name)+"
    else if @value(max-count) == 1
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
    let unknown-name = @const(if @is-ident(rule) then @name(rule) else "<unknown>")
    let result = AST mutate! named(calculate-multiple-name!($rule?.parser-name or $unknown-name, $min-count, $max-count), #(o)
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

macro character!(chars, name)
  if @is-const(chars)
    if typeof @value(chars) != \string
      throw Error "Must provide a literal array or string"
  else if not @is-array(chars)
    throw Error "Must provide a literal array or string"
  chars := @value(chars)
  let codes = []
  for i = 0, chars.length
    codes.push C(chars, i)
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
  
  let mutable current = AST false
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
    current := AST $current or $test
  if chunks.length == 1 and chunks[0].start == chunks[0].end
    let code = @const chunks[0].start
    if @empty(name)
      let ch = String.from-char-code chunks[0].start
      name := @const if ch == '"' then "'\"'" else (JSON.stringify ch)
    AST
      named $name, #(o)
        if C(o.data, o.index) == $code
          o.index += 1
          $code
        else
          o.fail $name
          false
  else
    if @empty(name)
      name := @const "[$((JSON.stringify chars).slice(1, -1))]"
    AST
      named $name, #(o)
        let c = C(o.data, o.index)
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

class Stack
  def constructor(initial, data = [])@
    @initial := initial
    @data := data
  
  def push(value) -> @data.push value
  def pop()
    let data = @data
    let len = data.length
    if len == 0
      throw Error "Cannot pop"
    data.pop()
  
  def can-pop() -> @data.length > 0
  
  def peek()
    let data = @data
    let len = data.length
    if len == 0
      @initial
    else
      data[len - 1]
  
  def clone() -> Stack @initial, @data[:]

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

let _statement = Stack true
let in-statement = make-alter-stack _statement, true
let in-expression = make-alter-stack _statement, false

let _in-macro = Stack false
let in-macro = make-alter-stack _in-macro, true

let _in-ast = Stack false
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
define NewlineWithCheckIndent = sequential! [
  Newline
  EmptyLines
  CheckIndent
]

define SingleLineComment = #(o)
  let data = o.data
  let index = o.index
  if C(data, index) == C("/") and C(data, index ~+ 1) == C("/")
    let len = data.length
    index += 2
    while true, index ~+= 1
      if index ~>= len or C(data, index) in [C("\r"), C("\n")]
        o.index := index
        return true
  else
    false

define MultiLineComment = #(o)
  let data = o.data
  let index = o.index
  if C(data, index) == C("/") and C(data, index ~+ 1) == C("*")
    let len = data.length
    index += 2
    while true, index ~+= 1
      if index ~>= len
        o.error "Multi-line comment never ends"
      else if C(data, index) == C("*") and C(data, index ~+ 1) == C("/")
        o.index := index ~+ 2
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

let INDENTS = {
  (C "\t"): 4
  (C " "): 1
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

macro with-space!(rule)
  AST sequential! [
    Space
    [\this, $rule]
  ]
  
define Zero = character! "0"
define DecimalDigit = character! "0123456789"
define Period = character! "."
define ColonChar = character! ":"
define PipeChar = character! "|"
define Pipe = with-space! PipeChar
define DoubleColon = sequential! [ColonChar, ColonChar], "::"
define eE = character! "eE"
define Minus = character! "-"
define Plus = character! "+"
define PlusOrMinus = one-of! [Minus, Plus]
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
define HashSign = with-space! character! "#"
define NameStart = one-of! [Letter, Underscore, DollarSign]
define NameChar = one-of! [NameStart, DecimalDigit]
define SymbolChar = character! "!#%&*+-/<=>?\\^`|~"
define DoubleQuote = character! '"'
define SingleQuote = character! "'"
define TripleDoubleQuote = multiple! 3, 3, DoubleQuote, '"""'
define TripleSingleQuote = multiple! 3, 3, SingleQuote, "'''"
define SemicolonChar = character! ";"
define Semicolon = with-space! SemicolonChar
define Asterix = character! "*"
define OpenParenthesisChar = character! "("
define OpenParenthesis = with-space! OpenParenthesisChar
define CloseParenthesis = with-space! character! ")"
define OpenSquareBracketChar = character! "["
define OpenSquareBracket = with-space! OpenSquareBracketChar
define CloseSquareBracket = with-space! character! "]"
define OpenCurlyBrace = with-space! character! "{"
define CloseCurlyBrace = with-space! character! "}"
define Backslash = character! "\\"
define Comma = with-space! character! ","
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

define Name = with-space! _Name

define _Symbol = one-or-more! SymbolChar, #(x) -> process-char-codes(x).join ""

define Symbol = with-space! _Symbol

let _NameOrSymbol = one-or-more-of! [
  _Name
  _Symbol
], #(x) -> x.join ""
let NameOrSymbol = with-space! _NameOrSymbol

define AnyChar = #(o)
  let data = o.data
  let index = o.index
  if index >= data.length
    o.fail "any"
    false
  else
    o.index ~+= 1
    C(o.data, index) or -1

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

define HexInteger = make-radix-integer 16, character!("xX"), HexDigit
define OctalInteger = make-radix-integer 8, character!("oO"), OctalDigit
define BinaryInteger = make-radix-integer 2, character!("bB"), BinaryDigit

define RadixInteger = do
  let GetDigits = do
    let digit-cache = []
    #(radix) -> digit-cache[radix] ?= do
      let digit = switch radix
      case 2; BinaryDigit
      case 8; OctalDigit
      case 10; DecimalDigit
      case 16; HexDigit
      default
        let chars = []
        for i = 0, radix max 10
          chars[i + C("0")] := true
        for i = 10, radix max 36
          chars[i - 10 + C("a")] := true
          chars[i - 10 + C("A")] := true
        #(o)
          let c = C(o.data, o.index)
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

define NumberLiteral = with-space! one-of! [
  HexInteger
  OctalInteger
  BinaryInteger
  RadixInteger
  DecimalNumber
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
    (C "b"): C "\b"
    (C "f"): C "\f"
    (C "r"): C "\r"
    (C "n"): C "\n"
    (C "t"): C "\t"
    (C "v"): C "\v"
    (C "0"): -1 // to be non-falsy
    (C "1"): 1
    (C "2"): 2
    (C "3"): 3
    (C "4"): 4
    (C "5"): 5
    (C "6"): 6
    (C "7"): 7
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
    else if part not instanceof NothingNode
      if current-literal.length > 0
        string-parts.push o.const i, process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push o.const i, process-char-codes(current-literal).join ""
  
  if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and string-parts[0] instanceof ConstNode and typeof string-parts[0].value == "string"
    string-parts[0]
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
    else if part not instanceof NothingNode
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
    
    let string-parts = []
    for line, j in lines
      if j > 0
        string-parts.push "\n"
      string-parts.push ...line
    
    for j = string-parts.length - 2, -1, -1
      if typeof string-parts[j] == \string and typeof string-parts[j + 1] == \string
        string-parts.splice(j, 2, string-parts[j] ~& string-parts[j + 1])
    
    for part, j in string-parts
      if typeof part == \string
        string-parts[j] := o.const i, part
    
    if string-parts.length == 0
      o.const i, ""
    else if string-parts.length == 1 and string-parts[0] instanceof ConstNode and typeof string-parts[0].value == \string
      string-parts[0]
    else
      o.string i, string-parts
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
      ], C('"')
      sequential! [
        Backslash
        DollarSign
      ], C('$')
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
      ], C("'")
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
    else if part not instanceof NothingNode
      if current-literal.length > 0
        string-parts.push o.const i, process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push o.const i, process-char-codes(current-literal).join ""

  let flags = process-char-codes(x.flags).join ""

  let text = if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and string-parts[0] instanceof ConstNode and typeof string-parts[0].value == \string
    string-parts[0]
  else
    o.string i, string-parts
  o.regexp i, text, flags

define BackslashStringLiteral = sequential! [
  Backslash
  NoSpace
  [\this, IdentifierNameConst]
]

define StringLiteral = with-space! one-of! [
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

define CustomOperator = do
  let handle-unary-operator(operator, o, i)
    let rule = operator.rule
    let op = rule o
    if op
      let node = o.ident i, \x
      o.function(i
        [o.param i, node]
        operator.func {
          op
          node
        }, o, i
        true
        false)
  #(o)
    let i = o.index
    for operators in o.macros.binary-operators
      if operators
        for operator in operators
          let rule = operator.rule
          let op = rule o
          if op
            let left = o.ident i, \x
            let right = o.ident i, \y
            return o.function(i
              [
                o.param i, left
                o.param i, right
              ]
              operator.func {
                left
                inverted: false
                op
                right
              }, o, i
              true
              false)
    for operator in o.macros.prefix-unary-operators
      return? handle-unary-operator operator, o, i
    for operator in o.macros.postfix-unary-operators
      return? handle-unary-operator operator, o, i
    false

define Parenthetical = sequential! [
  OpenParenthesis
  [\this, one-of! [
    Assignment
    Expression
    CustomOperator
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

define Colon = sequential! [
  Space
  [\this, ColonChar]
  except! ColonChar
]
define NotColon = except! Colon

define ObjectKeyColon = sequential! [
  [\this, ObjectKey]
  Colon
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
  sequential! [
    [\this, IdentifierOrSimpleAccess]
    NotColon
  ], #(ident, o, i)
    let key = if ident instanceof AccessNode
      ident.child
    else if ident instanceof IdentNode
      o.const i, ident.name
    else
      o.error "Unknown ident type: $(typeof! ident)"
    { key, value: ident }
  sequential! [
    [\this, ConstantLiteral]
    NotColon
  ], #(node, o, i)
    let key = if node instanceof ConstNode and typeof node.value != \string
      o.const i, String(node.value)
    else
      node
    { key, value: node }
  sequential! [
    [\this, ThisLiteral]
    NotColon
  ], #(node, o, i)
    {
      key: o.const i, \this
      value: node
    }
  sequential! [
    [\this, ArgumentsLiteral]
    NotColon
  ], #(node, o, i)
    {
      key: o.const i, \arguments
      value: node
    }
  sequential! [
    [\this, Parenthetical]
    NotColon
  ], #(node) -> { key: node, value: node }
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
define BodyOrStatementOrNothing = one-of! [
  Body
  Statement
  Nothing
]

define DedentedBody = sequential! [
  Space
  [\this, oneOf! [
    sequential! [
      Newline
      EmptyLines
      [\this, Block]
    ]
    Nothing
  ]]
]

define DeclareEqualSymbol = with-space! character! "="

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
    if param instanceof ParamNode and param.spread
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

define ParamSingularObjectKey = sequential! [
  [\this, IdentifierParameter]
  NotColon
], #(param, o, i)
  let ident = param.ident
  let key = if ident instanceof IdentNode
    o.const i, ident.name
  else if ident instanceof AccessNode
    ident.child
  else
    throw Error "Unknown object key type: $(typeof! ident)"
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
  [\as-type, MaybeAsType]
  [\auto-return, maybe! character!("!"), NOTHING]
  [\bound, maybe! AtSign, NOTHING]
  [\body, FunctionBody]
], #(x, o, i) -> o.function i, x.params, x.body, x.auto-return == NOTHING, x.bound != NOTHING, if x.as-type != NOTHING then x.as-type

define FunctionLiteral = short-circuit! HashSign, sequential! [
  HashSign
  [\this, FunctionDeclaration]
]

define AstToken = word \AST
define Ast = short-circuit! AstToken, sequential! [
  #(o)
    if not _in-macro.peek()
      o.error "Can only use AST inside a macro"
    else if _in-ast.peek()
      o.error "Cannot use AST inside an AST"
    else
      true
  AstToken
  [\this, in-ast BodyOrStatementOrNothing]
], #(x, o, i) -> MacroHelper.constify-object x, i, o.index

define Debugger = word \debugger, #(x, o, i) -> o.debugger i

define MacroName = with-space! one-or-more-of! [
  _Symbol
  _Name
], #(x) -> x.join ""

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
define Macro = in-macro short-circuit! MacroToken, sequential! [
  MacroToken
  named "(identifier MacroBody)", #(o)
    let name = MacroName o
    if name
      o.enter-macro name, #
        MacroBody o
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

define DefineOperatorStart = sequential! [word(\define), word(\operator)]
define DefineOperator = short-circuit! DefineOperatorStart, in-macro sequential! [
  DefineOperatorStart
  [\type, one-of! [
    \binary
    \assign
    \unary
  ]]
  [\head, NameOrSymbol]
  [\tail, zero-or-more! sequential! [
    Comma
    [\this, NameOrSymbol]
  ]]
  [\options, maybe! (sequential! [
    word \with
    [\this, UnclosedObjectLiteral]
  ]), NOTHING]
  [\body, FunctionBody]
], #(x, o, i)
  let options = {}
  if x.options != NOTHING
    for pair in x.options.pairs
      if pair.key not instanceof ConstNode
        o.error "Cannot have non-const keys in the options"
      if pair.value not instanceof ConstNode
        o.error "Cannot have non-const value in the options"
      options[pair.key.value] := pair.value.value
  
  let ops = [x.head, ...x.tail]
  switch x.type
  case \binary; o.define-binary-operator i, ops, options, x.body
  case \assign; o.define-assign-operator i, ops, options, x.body
  case \unary; o.define-unary-operator i, ops, options, x.body
  default; throw Error()

define Nothing = #(o) -> o.nothing o.index
define ExpressionOrNothing = one-of! [
  Expression
  Nothing
]

let _indexSlice = Stack false
let inIndexSlice = make-alter-stack _indexSlice, true

define IndexSlice = inIndexSlice sequential! [
  [\left, ExpressionOrNothing]
  Colon
  [\right, ExpressionOrNothing]
], #(x) -> {
  type: \slice
  left: if x instanceof NothingNode then null else x.left
  right: if x instanceof NothingNode then null else x.right
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
    if x.child.type == \single
      o.access i, parent, x.child.node
    else
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
    if x.child.type == \single
      o.access i, parent, x.child.node
    else
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
  ColonChar
  character! "="
], ":="

define ExpressionOrAssignment = oneOf! [
  Assignment
  Expression
]

define DirectAssignment = sequential! [
  [\left, ComplexAssignable]
  ColonEqual
  [\right, ExpressionOrAssignment]
], #(x, o, i) -> o.assign i, x.left, "=", x.right

define CustomAssignment = #(o)
  let start-index = o.index
  let clone = o.clone()
  let left = SimpleAssignable clone
  if left
    for operator in o.macros.assign-operators
      let sub-clone = clone.clone()
      let rule = operator.rule
      let op = rule sub-clone
      if not op
        continue
      let right = ExpressionOrAssignment sub-clone
      if not right
        continue
      o.update sub-clone
      return operator.func {
        left
        op
        right
      }, o, start-index
  false

define Assignment = one-of! [
  DirectAssignment
  CustomAssignment
]

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
      [\type, maybe! DoubleColon, \access-index, \proto-access-index]
      OpenSquareBracketChar
      [\child, Index]
      CloseSquareBracket
    ], #(x)
      if x.child.type == \single
        {
          type: if x.type == \access-index then \access else \proto-access
          child: x.child.node
          existential: x.existential == "?"
        }
      else
        {
          x.type
          x.child
          existential: x.existential == "?"
        }
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      [\is-apply, maybe! AtSign, NOTHING]
      [\args, InvocationArguments]
    ], #(x) -> {
      type: \call
      x.args
      existential: x.existential == "?"
      is-new: false
      is-apply: x.is-apply != NOTHING
    }
  ]]
], do
  let link-types = {
    access: do
      let index-types = {
        slice: #(o, i, child) -> #(parent)
          let args = [parent]
          if child.left or child.right
            args.push child.left or o.const(i, 0)
          if child.right
            args.push child.right
          o.call(i, o.ident(i, \__slice), args)
        multi: #(o, i, child) -> #(parent)
          let mutable set-parent = parent
          let tmp-ids = []
          if parent.cacheable
            let tmp = o.tmp(i, get-tmp-id(), \ref)
            tmp-ids.push tmp.id
            set-parent := o.assign(i, tmp, "=", parent)
            parent := tmp
          let result = o.array(i, for element, j in child.elements
            o.access(i, if j == 0 then set-parent else parent, element))
          if tmp-ids.length
            o.tmp-wrapper(i, result, tmp-ids)
          else
            result
      }
      #(o, i, mutable head, link, j, links)
        let make-access = switch link.type
        case \access
          #(parent) -> o.access i, parent, link.child
        case \access-index
          unless index-types ownskey link.child.type
            throw Error "Unknown index type: $(link.child.type)"
          index-types[link.child.type](o, i, link.child)
        default
          throw Error "Unknown link type: $(link.type)"

        unless link.existential
          convert-call-chain(o, i, make-access(head), j + 1, links)
        else
          let tmp-ids = []
          let mutable set-head = head
          if head.cacheable
            let tmp = o.tmp(i, get-tmp-id(), \ref)
            tmp-ids.push tmp.id
            set-head := o.assign(i, tmp, "=", head)
            head := tmp
          let result = o.if(i
            o.binary(i, set-head, "!=", o.const(i, null))
            convert-call-chain(o, i, make-access(head), j + 1, links))
          if tmp-ids.length
            o.tmp-wrapper(i, result, tmp-ids)
          else
            result
    call: do
      #(o, i, mutable head, link, j, links)
        unless link.existential
          convert-call-chain(o, i, o.call(i, head, link.args, link.is-new, link.is-apply), j + 1, links)
        else
          let tmp-ids = []
          let mutable set-head = head
          if head instanceof AccessNode and head.op == "." and not link.is-apply and not link.is-new
            let mutable parent = head.parent
            let mutable set-parent = parent
            let mutable child = head.child
            let mutable set-parent = child
            if parent.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref)
              tmp-ids.push tmp.id
              set-parent := o.assign(i, tmp, "=", parent)
              parent := tmp
            if child.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref)
              tmp-ids.push tmp.id
              set-child := o.assign(i, tmp, "=", parent)
              child := tmp
            if parent != set-parent or child != set-child
              set-head := o.access(i, set-parent, set-child)
              head := o.access(i, parent, child)
          else
            if head.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref)
              tmp-ids.push tmp.id
              set-head := o.assign(i, tmp, "=", head)
              head := tmp
          let result = o.if(i
            o.binary(i
              o.unary(i, \typeof, set-head)
              "==="
              o.const(i, \function))
            convert-call-chain(o, i, o.call(i, head, link.args, link.is-new, link.is-apply), j + 1, links))
          if tmp-ids.length
            o.tmp-wrapper(i, result, tmp-ids)
          else
            result
  }
  link-types.access-index := link-types.access
  
  let convert-call-chain(o, i, head, j, links)
    if j >= links.length
      head
    else
      let link = links[j]
      unless link-types ownskey link.type
        throw Error "Unknown call-chain link: $(link.type)"
      
      link-types[link.type](o, i, head, link, j, links)
  #(x, o, i)
    let mutable is-new = x.is-new != NOTHING
    let mutable head = x.head
    let tail = x.tail
  
    if tail.length == 0 and not is-new and head.type == \normal
      return head.node
  
    let links = []
    if head.type == \this-access
      links.push { type: \access, head.child, head.existential }
  
    for part in tail
      switch part.type
      case \proto-access, \proto-access-index
        links.push { type: \access, child: o.const(i, \prototype), part.existential }
        let clone = copy(part)
        clone.type := if part.type == \proto-access then \access else \access-index
        links.push clone
      case \access, \access-index
        links.push part
      case \call
        if is-new and part.is-apply
          o.error "Cannot call with both new and @ at the same time"
        let clone = copy(part)
        clone.is-new := is-new
        is-new := false
        links.push clone
      default
        o.error "Unknown link type: $(part.type)"
  
    if is-new
      links.push { type: \call, args: [], existential: false, is-new: true, is-apply: false }
    
    convert-call-chain o, i, head.node, 0, links

define SuperToken = word "super"
define SuperInvocation = short-circuit! SuperToken, sequential! [
  SuperToken
  ["child", maybe! (oneOf! [
    sequential! [
      EmptyLines
      Space
      Period
      [\this, IdentifierNameConstOrNumberLiteral]
    ]
    sequential! [
      OpenSquareBracketChar
      [\this, Expression]
      CloseSquareBracket
    ]
  ]), NOTHING]
  ["args", InvocationArguments]
], #(x, o, i)
  o.super i, if x.child != NOTHING then x.child else void, x.args

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
  SuperInvocation
  Eval
]

define CustomPostfixUnary = #(o)
  let start-index = o.index
  let node = InvocationOrAccess o
  if not node
    false
  else
    for operator in o.macros.postfix-unary-operators
      let clone = o.clone()
      let rule = operator.rule
      let op = rule clone
      if not op
        continue
      o.update clone
      return operator.func {
        op
        node
      }, o, start-index
    node

define CustomPrefixUnary = #(o)
  let start-index = o.index
  for operator in o.macros.prefix-unary-operators
    let clone = o.clone()
    let rule = operator.rule
    let op = rule clone
    if not op
      continue
    let node = CustomPrefixUnary clone
    if not node
      continue
    o.update clone
    return operator.func {
      op
      node
    }, o, start-index
  CustomPostfixUnary o

let get-use-custom-binary-operator = do
  let precedence-cache = []
  #(precedence) -> precedence-cache[precedence] ?= cache #(o)
    let start-index = o.index
    let binary-operators = o.macros.binary-operators
    if binary-operators.length < precedence
      CustomPrefixUnary o
    else
      let next-rule = get-use-custom-binary-operator(precedence + 1)
      let head = next-rule o
      if not head
        false
      else
        let operators = binary-operators[precedence]
        if operators
          for operator in operators
            let rule = operator.rule
            let tail = []
            while true
              let clone = o.clone()
              let mutable inverted = false
              if operator.invertible
                inverted := MaybeNotToken clone
                if not inverted
                  break
              let op = rule clone
              if not op
                break
              let node = next-rule clone
              if not node
                break
              o.update clone
              tail.push { inverted: inverted == "not", op, node }
              if operator.maximum and tail.length >= operator.maximum
                break
            if tail.length
              if not operator.right-to-left
                let mutable current = head
                for part in tail
                  current := operator.func {
                    left: current
                    part.inverted
                    part.op
                    right: part.node
                  }, o, start-index
                return current
              else
                let mutable current = tail[tail.length - 1].node
                for j = tail.length - 1, 0, -1
                  current := operator.func {
                    left: tail[j - 1].node
                    tail[j].inverted
                    tail[j].op
                    right: current
                  }, o, start-index
                return operator.func {
                  left: head
                  tail[0].inverted
                  tail[0].op
                  right: current
                }, o, start-index
        head

let Logic = named("Logic", get-use-custom-binary-operator(0))
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

define DefToken = word \def
define Def = short-circuit! DefToken, sequential! [
  DefToken
  [\left, ObjectKey]
  [\right, maybe! (one-of! [
    short-circuit! DeclareEqualSymbol, sequential! [
      DeclareEqualSymbol
      [\this, ExpressionOrAssignment]
    ]
    short-circuit! OpenParenthesisChar, FunctionDeclaration
  ]), NOTHING]
], #(x, o, i) -> o.def i, x.left, if x.right == NOTHING then void else x.right

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
    Def
    Return
    Yield
    Break
    Continue
    Macro
    DefineHelper
    DefineOperator
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
    if item instanceof BlockNode
      nodes.push ...item.nodes
    else if item not instanceof NothingNode
      nodes.push item
  switch nodes.length
  case 0; o.nothing i
  case 1; nodes[0]
  default; o.block i, nodes

define Shebang = sequential! [
  character! "#"
  character! "!"
  zero-or-more! any-except! Newline
], true

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

class ParserError extends Error
  def constructor(message, text, index)@
    super(message)
    
    @message := "$message at $index"
    @text := text
    @index := index

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

class FailureManager
  def constructor()@
    @messages := []
    @position := 0
  
  def add(message, index)!
    if index > @position
      @messages := []
      @position := index
    if index >= @position
      @messages.push message

class MacroHelper
  def constructor(state as State, index, expr)@
    @unsaved-tmps := []
    @saved-tmps := []
    @state := state
    @index := index
    @expr := expr
  
  def noop() -> @state.nothing @index
  def block(nodes as Array) -> @state.block(@index, nodes).reduce()
  def if(test as Object, when-true as Object, when-false as (Object|null)) -> @state.if(@index, test, when-true, when-false).reduce()
  def switch(node as Object, cases as Array, default-case as (Object|null)) -> @state.switch(@index, node, cases, default-case).reduce()
  def for(init as (Object|null), test as (Object|null), step as (Object|null), body as Object) -> @state.for(@index, init, test, step, body).reduce()
  def for-in(key as Object, object as Object, body as Object) -> @state.for-in(@index, key, object, body).reduce()
  def try-catch(try-body as Object, catch-ident as Object, catch-body as Object) -> @state.try-catch(@index, try-body, catch-ident, catch-body).reduce()
  def try-finally(try-body as Object, finally-body as Object) -> @state.try-finally(@index, try-body, finally-body).reduce()
  def assign(left as Object, op as String, right as Object) -> @state.assign(@index, left, op, right).reduce()
  def binary(left as Object, op as String, right as Object) -> @state.binary(@index, left, op, right).reduce()
  def unary(op as String, node as Object) -> @state.unary(@index, op, node).reduce()
  def throw(node as Node) -> @state.throw(@index, node).reduce()
  
  def tmp(name as String = \ref, save as Boolean)
    let id = get-tmp-id()
    (if save then @saved-tmps else @unsaved-tmps).push id
    @state.tmp @index, id, name
  
  def get-tmps() -> {
    unsaved: @unsaved-tmps[:]
    saved: @saved-tmps[:]
  }
  
  def is-const(node) -> node == void or (node? and (node instanceof ConstNode or (node instanceof BlockNode and node.nodes.length == 0)))
  def value(node)
    if node == void
      void
    else if node?
      if node instanceof ConstNode
        node.value
      else if node instanceof BlockNode and node.nodes.length == 0
        void
  def const(value)
    @state.const @index, value
  
  def is-ident(node) -> node instanceof IdentNode
  def name(node) -> if @is-ident node then node.name
  def ident(name as String)
    if require('./ast').is-acceptable-ident(name)
      @state.ident @index, name
  
  def is-call(node) -> node instanceof CallNode
  
  def call-func(node)
    if node instanceof CallNode
      node.func
  
  def call-args(node)
    if node instanceof CallNode
      node.args
  
  def is-super(node) -> node instanceof SuperNode
  
  def super-child(node)
    if @is-super(node)
      node.child
  
  def super-args(node)
    if @is-super(node)
      node.args
  
  def call-is-new(node)
    if node instanceof CallNode
      not not node.is-new
    else
      false
  
  def call-is-apply(node)
    if node instanceof CallNode
      not not node.is-apply
    else
      false
  
  def call(func as Node, args as [Node], is-new as Boolean = false, is-apply as Boolean = false)
    if is-new and is-apply
      throw Error "Cannot specify both is-new and is-apply"
    
    @state.call(func.start-index, func, args, is-new, is-apply).reduce()
  
  def func(params, body, auto-return = true, bound = false)
    @state.function(0, params, body, auto-return, bound).reduce()
  
  def is-func(node) -> node instanceof FunctionNode
  def func-body(node) -> if @is-func node then node.body
  def func-params(node) -> if @is-func node then node.params
  def func-is-auto-return(node) -> if @is-func node then not not node.auto-return
  def func-is-bound(node) -> if @is-func node then not not node.bound
  
  def param(ident, default-value, spread, is-mutable, as-type)
    @state.param(0, ident, default-value, spread, is-mutable, as-type).reduce()
  
  def is-param(node) -> node instanceof ParamNode
  def param-ident(node) -> if @is-param node then node.ident
  def param-default-value(node) -> if @is-param node then node.default-value
  def param-is-spread(node) -> if @is-param node then not not node.spread
  def param-is-mutable(node) -> if @is-param node then not not node.is-mutable
  def param-type(node) -> if @is-param node then node.as-type
  
  def is-array(node) -> node instanceof ArrayNode
  def elements(node) -> if @is-array node then node.elements
  
  def is-object(node) -> node instanceof ObjectNode
  def pairs(node) -> if @is-object node then node.pairs
  
  def is-block(node) -> node instanceof BlockNode
  def nodes(node) -> if @is-block node then node.nodes
  
  def array(elements)
    @state.array(0, elements).reduce()
  def object(pairs as Array)
    for pair, i in pairs
      if not pair or typeof pair != \object
        throw Error "Expected an object at index #$i, got $(typeof! pair)"
      else if pair.key not instanceof Node
        throw Error "Expected an object with Node 'key' at index #$i, got $(typeof! pair.key)"
      else if pair.value not instanceof Node
        throw Error "Expected an object with Node 'value' at index #$i, got $(typeof! pair.value)"
    @state.object(0, pairs).reduce()
  
  def is-complex(node)
    node? and node not instanceofsome [ConstNode, IdentNode, TmpNode, ThisNode, ArgsNode] and not (node instanceof BlockNode and node.nodes.length == 0)
  
  def is-type-array(node) -> node instanceof TypeArrayNode
  def subtype(node) -> @is-type-array(node) and node.subtype
  
  def is-this(node) -> node instanceof ThisNode
  def is-arguments(node) -> node instanceof ArgsNode
  
  def cache(node, init, name as String = \ref, save as Boolean)
    @maybe-cache node, (#(set-node, node, cached)
      if cached
        init.push set-node
      node), name, save
  
  def maybe-cache(node, func, name as String = \ref, save as Boolean)
    if @is-complex node
      let tmp = @tmp(name, save)
      func @state.let(@index, @state.declarable(@index, tmp, false), node), tmp, true
    else
      func node, node, false
  
  def maybe-cache-access(node, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    if @is-access(node)
      @maybe-cache @parent(node), (#(set-parent, parent, parent-cached)@
        @maybe-cache @child(node), (#(set-child, child, child-cached)@
          if parent-cached or child-cached
            func(
              @state.access(@index, set-parent, set-child)
              @state.access(@index, parent, child)
              true)
          else
            func node, node, false), child-name, save), parent-name, save
    else
      func node, node, false
  
  def empty(node)
    if not node?
      true
    else if node not instanceof Node
      false
    else if node instanceof BlockNode
      return for every item in node.nodes
        @empty(item)
    else
      node instanceof NothingNode
  
  let constify-array(array, start-index, end-index)
    ArrayNode start-index, end-index, for x in array
      constify-object x, start-index, end-index
  
  let constify-object(obj, start-index, end-index)
    if not obj or typeof obj != \object or obj instanceof RegExp
      ConstNode start-index, end-index, obj
    else if Array.is-array obj
      constify-array obj, start-index, end-index
    else if obj instanceof IdentNode and C(obj.name, 0) == C('$')
      CallNode(obj.start-index, obj.end-index
        IdentNode obj.start-index, obj.end-index, \__wrap
        [IdentNode obj.start-index, obj.end-index, obj.name.substring 1])
    else if obj instanceof MacroAccessNode
      CallNode(obj.start-index, obj.end-index
        IdentNode obj.start-index, obj.end-index, \__macro
        [
          ConstNode obj.start-index, obj.end-index, obj.id
          constify-object obj.data, obj.start-index, obj.end-index
        ])
    else if obj instanceof Node
      if obj.constructor == Node
        throw Error "Cannot constify a raw node"
      
      CallNode(obj.start-index, obj.end-index
        IdentNode obj.start-index, obj.end-index, \__node
        [
          ConstNode obj.start-index, obj.end-index, obj.constructor.capped-name
          ConstNode obj.start-index, obj.end-index, obj.start-index
          ConstNode obj.start-index, obj.end-index, obj.end-index
          ...(for k in obj.constructor.arg-names
            constify-object obj[k], start-index, end-index)
        ])
    else
      ObjectNode start-index, end-index, for k, v of obj
        {
          key: ConstNode start-index, end-index, k
          value: constify-object v, start-index, end-index
        }
  @constify-object := constify-object
  
  let walk(node, func)
    if not node or typeof node != \object or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to walk through: $(typeof! node)"
    if node not instanceof BlockNode
      return? func(node)
    node.walk(#(x) -> walk x, func)
  
  @wrap := #(value = [])
    if Array.is-array(value)
      BlockNode(0, 0, value).reduce()
    else if value instanceof Node
      value
    else if value instanceof RegExp or value == null or typeof value in [\undefined, \string, \boolean, \number]
      ConstNode(0, 0, value)
    else
      throw Error "Trying to wrap an unknown object: $(typeof! value)"
  
  @node := #(type, start-index, end-index, ...args)
    Node[type](start-index, end-index, ...args).reduce()
  
  def is-def(node) -> node instanceof DefNode
  def is-assign(node) -> node instanceof AssignNode
  def is-let(node) -> node instanceof LetNode
  def is-binary(node) -> node instanceof BinaryNode
  def is-unary(node) -> node instanceof UnaryNode
  def op(node)
    if @is-assign(node) or @is-binary(node) or @is-unary(node)
      node.op
  def left(node)
    if @is-def(node) or @is-let(node) or @is-binary(node)
      node.left
  def right(node)
    if @is-def(node) or @is-let(node) or @is-binary(node)
      node.right
  def unary-node(node)
    if @is-unary(node)
      node.node
  
  def is-access(node) -> node instanceof AccessNode
  def parent(node)
    if node instanceof AccessNode
      node.parent
  def child(node)
    if node instanceof AccessNode
      node.child
  
  def walk(node as Node, func as Function) -> walk node, func
  
  def has-func(node)
    let FOUND = {}
    try
      walk node, #(x)
        if x instanceof FunctionNode
          throw FOUND
    catch e
      if e != FOUND
        throw e
      return true
    false
  
  def is-type(node, name as String)
    let type = types[name]
    if not type? or type not instanceof types
      throw Error "$name is not a known type name"
    node.type().is-subset-of(type)
  
  def has-type(node, name as String)
    let type = types[name]
    if not type? or type not instanceof types
      throw Error "$name is not a known type name"
    node.type().overlaps(type)
  
  let mutators = {
    Block: #(x, func)
      let nodes = x.nodes
      let len = nodes.length
      if len != 0
        let last-node = @mutate-last(nodes[len - 1], func)
        if last-node != nodes[len - 1]
          return BlockNode  x.start-index, x.end-index, [...nodes[:len - 1], last-node]
      x
    If: #(x, func)
      let when-true = @mutate-last x.when-true, func
      let when-false = @mutate-last x.when-false, func
      if when-true != x.when-true or when-false != x.when-false
        IfNode x.start-index, x.end-index, x.test, when-true, when-false
      else
        x
    UseMacro: #(x, func)
      let node = @mutate-last x.node, func
      if node != x.node
        TmpWrapperNode x.start-index, x.end-index, node, x.tmps
      else
        x
    Break: identity
    Continue: identity
    Nothing: identity
    Return: identity
    Debugger: identity
    Throw: identity
  }
  def mutate-last(node, func)
    if not node or typeof node != \object or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to mutate-last through: $(typeof! node)"
    
    if mutators not ownskey node.constructor.capped-name
      func(node) ? node
    else
      mutators[node.constructor.capped-name]@(this, node, func)

let one-of(rules as [Function])
  let name = ["("]
  for rule, i in rules
    if i > 0
      name.push " | "
    name.push rule.parser-name or "<unknown>"
  name.push ")"
  named name.join(""), #(o)
    for rule in rules
      let result = rule o
      if result
        return result
    false

class MacroHolder
  def constructor()@
    @by-name := {}
    @by-id := []
    @binary-operators := []
    @assign-operators := []
    @prefix-unary-operators := []
    @postfix-unary-operators := []

  def get-by-name(name)
    let by-name = @by-name
    if by-name ownskey name
      by-name[name]
  
  def get-or-add-by-name(name)
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
  
  def get-by-id(id)
    let by-id = @by-id
    if id >= 0 and id < by-id.length
      by-id[id]
  
  def add-macro(m)
    let by-id = @by-id
    by-id.push m
    by-id.length - 1
  
  def add-binary-operator(operators, m, options)
    let precedence = Number(options.precedence) or 0
    let binary-operators = @binary-operators[precedence] ?= []
    binary-operators.push {
      rule: one-of for op in operators
        word-or-symbol op
      func: m
      right-to-left: not not options.right-to-left
      maximum: options.maximum or 0
      minimum: options.minimum or 0
      invertible: not not options.invertible
    }
    @add-macro m
  
  def add-assign-operator(operators, m, options)
    @assign-operators.push {
      rule: one-of for op in operators
        word-or-symbol op
      func: m
    }
    @add-macro m
  
  def add-unary-operator(operators, m, options)
    let data = if options.postfix then @postfix-unary-operators else @prefix-unary-operators
    data.push {
      rule: one-of for op in operators
        let rule = word-or-symbol op
        if not r"[a-zA-Z]".test(op)
          if options.postfix
            sequential [
              NoSpace
              [\this, rule]
            ]
          else
            sequential [
              [\this, rule]
              NoSpace
            ]
        else
          rule
      func: m
      standalone: not options ownskey \standalone or not not options.standalone
    }
    @add-macro m

class Node
  def constructor() -> throw Error "Node should not be instantiated directly"
  
  def type() -> types.any
  def walk() -> this
  let reduce-node(node) -> node.reduce()
  def cacheable = true
  def _reduce()
    @walk reduce-node
  def reduce()
    if @_reduced?
      @_reduced
    else
      let reduced = @_reduce()
      if reduced == this
        @_reduced := this
      else
        @_reduced := reduced._reduced ?= reduced

macro node-type!
  syntax name as Expression, args as (",", this as Parameter)*, methods as (",", this as ObjectLiteral)?
    if not @is-const(name) or typeof @value(name) != \string
      throw Error "Expected a constant string name"
    
    let params = [@param(AST start-index), @param(AST end-index)]
    let name-str = @value(name)
    let mutable capped-name = name-str.char-at(0).to-upper-case() & name-str.substring(1)
    let type = @ident(capped-name & "Node")
    let body = [
      AST @start-index := start-index
      AST @end-index := end-index
    ]
    let mutable arg-names = []
    for arg in args
      params.push arg
      let ident = @param-ident arg
      let key = @const(@name(ident))
      body.push AST @[$key] := $ident
      arg-names.push key
    
    let add-methods = []
    let found-walk = false
    unless @empty(methods)
      for pair in @pairs(methods)
        let key = pair.key
        let value = pair.value
        add-methods.push AST def ($key) = $value
        if @is-const(key) and @value(key) == "walk"
          found-walk := true
    
    if not found-walk
      let mutable walk-func = void
      if args.length
        let walk-init = []
        let walk-check = AST false
        let mutable walk-args = []
        for arg in args
          let ident = @param-ident arg
          let key = @const(@name(ident))
          if @is-ident(@param-type(arg)) and @name(@param-type(arg)) == \Node
            walk-init.push AST let $ident = f this[$key]
            walk-check := AST $walk-check or $ident != this[$key]
            walk-args.push ident
          else if @is-type-array(@param-type(arg)) and @is-ident(@subtype(@param-type(arg))) and @name(@subtype(@param-type(arg))) == \Node
            walk-init.push AST let $ident = map this[$key], f
            walk-check := AST $walk-check or $ident != this[$key]
            walk-args.push ident
          else
            walk-args.push AST this[$key]
        walk-args := @array walk-args
        walk-func := @func([@param(AST f)], AST
          $walk-init
          if $walk-check
            $type @start-index, @end-index, ...$walk-args
          else
            this)
      else
        walk-func := AST ret-this
      add-methods.push AST def walk = $walk-func
      
    let func = @func params, AST $body, false, true
    arg-names := @array arg-names
    capped-name := @const capped-name
    AST Node[$capped-name] := class $type extends Node
      def constructor = $func
      @capped-name := $capped-name
      @arg-names := $arg-names
      State.add-node-factory $name, this
      $add-methods

class State
  def constructor(data, macros = MacroHolder(), index = 0, failures = FailureManager(), cache = [], indent = Stack(1), current-macro = null)@
    @data := data
    @macros := macros
    @index := index
    @failures := failures
    @cache := cache
    @indent := indent
    @current-macro := current-macro
  
  def clone() -> State @data, @macros, @index, @failures, @cache, @indent.clone(), @current-macro
  
  def update(clone)!
    @index := clone.index
    @indent := clone.indent.clone()
    @macros := clone.macros
  
  def fail(message)!
    @failures.add message, @index
  
  def error(message)!
    throw ParserError message, @data, @index
  
  def enter-macro(name, func)
    if @current-macro
      @error "Attempting to define a macro $name inside a macro $(@current-macro)"
    try
      @current-macro := name
      func()
    finally
      @current-macro := null
    @nothing @index
  
  let macro-syntax-idents = {
    Logic
    Expression
    Statement
    Body
    Identifier
    SimpleAssignable
    Declarable
    Parameter
    ObjectLiteral
    ArrayLiteral
    DedentedBody
  }
  
  let macro-syntax-const-literals = {
    ",": Comma
    ";": Semicolon
    "": Nothing
    "\n": NewlineWithCheckIndent
  }
  
  let macro-syntax-types = {
    syntax: #(index, params, body)
      let calc-param(param)@
        if param instanceof IdentNode
          unless macro-syntax-idents ownskey param.name
            @error "Unexpected type ident: $ident"
          macro-syntax-idents[param.name]
        else if param instanceof SyntaxSequenceNode
          handle-params param.params, []
        else if param instanceof SyntaxChoiceNode
          cache! one-of for choice in param.choices
            calc-param choice
        else if param instanceof ConstNode
          let string = param.value
          if typeof string != \string
            @error "Expected a constant string parameter, got $(typeof! string)"
          if macro-syntax-const-literals ownskey string
            macro-syntax-const-literals[string]
          else
            word-or-symbol string
        else if param instanceof SyntaxManyNode
          let multiplier = param.multiplier
          let calced = calc-param param.inner
          switch multiplier
          case "*"; zero-or-more! calced
          case "+"; one-or-more! calced
          case "?"; maybe! calced, #(x, o, i) -> o.nothing(i)
          default
            throw Error("Unknown syntax multiplier: $multiplier")
        else
          @error "Unexpected type: $(typeof! param)"
    
      let handle-params(params, sequence)@
        for param in params
          if param instanceof ConstNode
            let string = param.value
            if typeof string != \string
              @error "Expected a constant string parameter, got $(typeof! string)"
          
            if macro-syntax-const-literals ownskey string
              sequence.push macro-syntax-const-literals[string]
            else
              sequence.push word-or-symbol string
          else if param instanceof SyntaxParamNode
            let ident = param.ident
            let key = if ident instanceof IdentNode
              ident.name
            else if ident instanceof ThisNode
              \this
            else
              throw Error "Don't know how to handle ident type: $(typeof! ident)"
            let type = param.as-type ? IdentNode 0, 0, \Expression
            sequence.push [key, calc-param type]
          else
            @error "Unexpected parameter type: $(typeof! param)"
        sequential sequence
    
      let func-params = for param in params
        if param instanceof SyntaxParamNode
          {
            key: @const index, param.ident.name
            value: @param index, param.ident, void, false, true, void
          }
    
      let raw-func = @root index, @return index, @function(index
        [
          @object-param index, func-params
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__node), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false), false
      let translated = require('./translator')(raw-func.reduce(), return: true)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(@current-macro)"
      {
        handler
        rule: handle-params params, []
      }
    
    call: #(index, params, body)
      let raw-func = @root index, @return index, @function(index
        [
          @array-param index, params
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__node), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false)
      let translated = require('./translator')(raw-func.reduce(), return: true)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(@current-macro)"
      {
        handler
        rule: InvocationArguments
      }
    
    binary-operator: #(index, operators, body, options)
      let raw-func = @root index, @return index, @function(index
        [
          @object-param index, [
            { key: @const(index, \left), value: @param index, (@ident index, \left), void, false, true, void }
            { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
            { key: @const(index, \right), value: @param index, (@ident index, \right), void, false, true, void }
            ...(if options.invertible
              [{ key: @const(index, \inverted), value: @param index, (@ident index, \inverted), void, false, true, void }]
            else
              [])
          ]
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__node), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false)
      let translated = require('./translator')(raw-func.reduce(), return: true)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for binary operator $(operators.join ', ')"
      {
        handler
        rule: void
      }
    
    assign-operator: #(index, operators, body, options)
      let raw-func = @root index, @return index, @function(index
        [
          @object-param index, [
            { key: @const(index, \left), value: @param index, (@ident index, \left), void, false, true, void }
            { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
            { key: @const(index, \right), value: @param index, (@ident index, \right), void, false, true, void }
          ]
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__node), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false)
      let translated = require('./translator')(raw-func.reduce(), return: true)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for assign operator $(operators.join ', ')"
      {
        handler
        rule: void
      }
    
    unary-operator: #(index, operators, body, options)
      let raw-func = @root index, @return index, @function(index
        [
          @object-param index, [
            { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
            { key: @const(index, \node), value: @param index, (@ident index, \node), void, false, true, void }
          ]
          @param index, (@ident index, \__wrap), void, false, true, void
          @param index, (@ident index, \__node), void, false, true, void
          @param index, (@ident index, \__macro), void, false, true, void
        ]
        body
        true
        false)
      let translated = require('./translator')(raw-func.reduce(), return: true)
      let handler = translated.node.to-function()()
      if typeof handler != \function
        throw Error "Error creating function for unary operator $(operators.join ', ')"
      {
        handler
        rule: void
      }
  }
  
  def macro-syntax(index, type, params, body, options = {})!
    if not Array.is-array params
      throw TypeError "Expected params to be an array, got $(typeof! params)"
    else if not body or typeof body != \object or body instanceof RegExp
      throw TypeError "Expected body to be an object, got $(typeof! body)"
    
    if macro-syntax-types not ownskey type
      throw Error "Unknown macro-syntax type: $type"
    
    if not @current-macro
      this.error "Attempting to specify a macro syntax when not in a macro"

    let data = macro-syntax-types[type]@(this, index, params, body, options)
    let handler = data.handler
    let rule = data.rule
    
    let macros = @macros
    let mutator = #(x, o, i)
      if _in-ast.peek()
        o.macro-access i, macro-id, x
      else
        let macro-helper = MacroHelper o, i, not _statement.peek()
        let mutable result = handler@ macro-helper, x, MacroHelper.wrap, MacroHelper.node, #(id, data)
          macros.get-by-id(id)(data, o, i)
        result := result.reduce()
        let tmps = macro-helper.get-tmps()
        if tmps.unsaved.length
          o.tmp-wrapper i, result, tmps.unsaved
        else
          result
    let macro-id = switch @current-macro
    case BINARY_OPERATOR
      macros.add-binary-operator(params, mutator, options)
    case ASSIGN_OPERATOR
      macros.add-assign-operator(params, mutator, options)
    case UNARY_OPERATOR
      macros.add-unary-operator(params, mutator, options)
    default
      let m = macros.get-or-add-by-name @current-macro
      m.data.push sequential! [m.token, [\this, rule]], mutator
      macros.add-macro(mutator)
  
  let BINARY_OPERATOR = freeze {}
  def define-binary-operator(index, operators, options, body)
    @enter-macro BINARY_OPERATOR, #@
      @macro-syntax index, \binary-operator, operators, body, options
  
  let ASSIGN_OPERATOR = freeze {}
  def define-assign-operator(index, operators, options, body)
    @enter-macro ASSIGN_OPERATOR, #@
      @macro-syntax index, \assign-operator, operators, body, options
  
  let UNARY_OPERATOR = freeze {}
  def define-unary-operator(index, operators, options, body)
    @enter-macro UNARY_OPERATOR, #@
      @macro-syntax index, \unary-operator, operators, body, options
  
  @add-node-factory := #(name, type)!
    State::[name] := #(index) -> type(index, @index, ...arguments[1:])

node-type! \access, parent as Node, child as Node
node-type! \access-index, parent as Node, child as Object, {
  walk: do
    let index-types = {
      multi: #(x, f)
        let elements = map x.elements, f
        if elements != x.elements
          { type: \multi, elements }
        else
          x
      slice: #(x, f)
        let left = if x.left? then f x.left else x.left
        let right = if x.right? then f x.right else x.right
        if left != x.left or right != x.right
          { type: \slice, left, right }
        else
          x
    }
    #(f)
      unless index-types ownskey @child.type
        throw Error "Unknown index type: $(@child.type)"
      let parent = f @parent
      let child = index-types[@child.type](@child, f)
      if parent != @parent or child != @child
        AccessIndexNode @start-index, @end-index, parent, child
      else
        this
}
node-type! \args, {
  type: #-> types.args
  cacheable: false
}
node-type! \array, elements as [Node], {
  type: #-> types.array
}
State::array-param := State::array
node-type! \assign, left as Node, op as String, right as Node, {
  type: do
    let ops = {
      "=": #(left, right) -> right
      "+=": #(left, right)
        if left.is-subset-of(types.number) and right.is-subset-of(types.number)
          types.number
        else if left.overlaps(types.number) and right.overlaps(types.number)
          types.string-or-number
        else
          types.string
      "-=": types.number
      "*=": types.number
      "/=": types.number
      "%=": types.number
      "<<=": types.number
      ">>=": types.number
      ">>>=": types.number
      "&=": types.number
      "^=": types.number
      "|=": types.number
    }
    # -> @_type ?= do
      let type = ops ownskey @op and ops[@op]
      if not type
        types.any
      else if typeof type == "function"
        type @left.type(), @right.type()
      else
        type
}
node-type! \binary, left as Node, op as String, right as Node, {
  type: do
    let ops = {
      "*": types.number
      "/": types.number
      "%": types.number
      "+": #(left, right)
        if left.is-subset-of(types.number) and right.is-subset-of(types.number)
          types.number
        else if left.overlaps(types.number) and right.overlaps(types.number)
          types.string-or-number
        else
          types.string
      "-": types.number
      "<<": types.number
      ">>": types.number
      ">>>": types.number
      "<": types.boolean
      "<=": types.boolean
      ">": types.boolean
      ">=": types.boolean
      "in": types.boolean
      "instanceof": types.boolean
      "==": types.boolean
      "!=": types.boolean
      "===": types.boolean
      "!==": types.boolean
      "&": types.number
      "^": types.number
      "|": types.number
      "&&": #(left, right) -> left.intersect(types.potentially-falsy).union(right)
      "||": #(left, right) -> left.intersect(types.potentially-truthy).union(right)
    }
    # -> @_type ?= do
      let type = ops ownskey @op and ops[@op]
      if not type
        types.any
      else if typeof type == "function"
        type @left.type(), @right.type()
      else
        type
  _reduce: do
    let const-ops = {
      "*": (~*)
      "/": (~/)
      "%": (~%)
      "+": #(left, right)
        if typeof left == \number and typeof right == \number
          left ~+ right
        else
          left ~& right
      "-": (~-)
      "<<": (~bitlshift)
      ">>": (~bitrshift)
      ">>>": (~biturshift)
      "<": (~<)
      "<=": (~<=)
      ">": (~>)
      ">=": (~>=)
      "==": (~=)
      "!=": (!~=)
      "===": (==)
      "!==": (!=)
      "&": (~bitand)
      "^": (~bitxor)
      "|": (~bitor)
      "&&": (and)
      "||": (or)
    }
    let left-const-ops = {
      "&&": #(x, y) -> if x.value then y else x
      "||": #(x, y) -> if x.value then x else y
      "*": #(x, y)
        if x.value == 1
          UnaryNode @start-index, @end-index, "+", y
        else if x.value == -1
          UnaryNode @start-index, @end-index, "-", y
      "+": #(x, y)
        if x.value == 0 and y.type().is-subset-of(types.number)
          UnaryNode @start-index, @end-index, "+", y
        else if x.value == "" and y.type().is-subset-of(types.string)
          y
      "-": #(x, y)
        if x.value == 0
          UnaryNode @start-index, @end-index, "-", y
    }
    let right-const-ops = {
      "*": #(x, y)
        if y.value == 1
          UnaryNode @start-index, @end-index, "+", x
        else if y.value == -1
          UnaryNode @start-index, @end-index, "-", x
      "/": #(x, y)
        if y.value == 1
          UnaryNode @start-index, @end-index, "+", x
        else if y.value == -1
          UnaryNode @start-index, @end-index, "-", x
      "+": #(x, y)
        if y.value == 0 and x.type().is-subset-of(types.number)
          UnaryNode @start-index, @end-index, "+", x
        else if typeof y.value == "number" and y.value < 0 and x.type().is-subset-of(types.number)
          BinaryNode @start-index, @end-index, x, "-", Const(-y.value)
        else if y.value == "" and x.type().is-subset-of(types.string)
          x
      "-": #(x, y)
        if y.value == 0
          UnaryNode @start-index, @end-index, "+", x
        else if typeof y.value == "number" and y.value < 0 and x.type().is-subset-of(types.number)
          BinaryNode @start-index, @end-index, x, "+", Const(-y.value)
    }
    #
      let left = @left.reduce()
      let right = @right.reduce()
      let op = @op
      if left instanceof ConstNode
        if right instanceof ConstNode and const-ops ownskey op
          return ConstNode @start-index, @end-index, const-ops[op](left.value, right.value)
        if left-const-ops ownskey op
          return? left-const-ops[op]@(this, left, right)
      if right instanceof ConstNode and right-const-ops ownskey op
        return? right-const-ops[op]@(this, left, right)
      if left != @left or right != @right
        BinaryNode @start-index, @end-index, left, op, right
      else
        this
}
node-type! \block, nodes as [Node], {
  type: #
    let nodes = @nodes
    if nodes.length == 0
      types.undefined
    else
      nodes[nodes.length - 1].type()
  _reduce: #
    let changed = false
    let body = []
    for node, i, len in @nodes
      let reduced = node.reduce()
      if reduced instanceof BlockNode
        body.push ...reduced.nodes
        changed := true
      else if reduced instanceof NothingNode
        changed := true
      else if reduced instanceofsome [BreakNode, ContinueNode, ThrowNode, ReturnNode] and not reduced.existential
        body.push reduced
        if reduced != node or i < len - 1
          changed := true
        break
      else
        body.push reduced
        if reduced != node
          changed := true
    switch body.length
    case 0
      NothingNode @start-index, @end-index
    case 1
      body[0]
    default
      if changed
        BlockNode @start-index, @end-index, body
      else
        this
}
node-type! \break
node-type! \call, func as Node, args as [Node], is-new as Boolean, is-apply as Boolean, {
  type: do
    let PRIMORDIAL_FUNCTIONS = {
      Object: types.object
      String: types.string
      Number: types.number
      Boolean: types.boolean
      Function: types.function
      Array: types.array
      Date: types.string
      RegExp: types.regexp
      Error: types.error
      RangeError: types.error
      ReferenceError: types.error
      SyntaxError: types.error
      TypeError: types.error
      URIError: types.error
      escape: types.string
      unescape: types.string
      parseInt: types.number
      parseFloat: types.number
      isNaN: types.boolean
      isFinite: types.boolean
      decodeURI: types.string
      decodeURIComponent: types.string
      encodeURI: types.string
      encodeURIComponent: types.string
    }
    let PRIMORDIAL_SUBFUNCTIONS = {
      Object: {
        getPrototypeOf: types.object
        getOwnPropertyDescriptor: types.object
        getOwnPropertyNames: types.string.array()
        create: types.object
        defineProperty: types.object
        defineProperties: types.object
        seal: types.object
        freeze: types.object
        preventExtensions: types.object
        isSealed: types.boolean
        isFrozen: types.boolean
        isExtensible: types.boolean
        keys: types.string.array()
      }
      String: {
        fromCharCode: types.string
      }
      Number: {
        isFinite: types.boolean
        isNaN: types.boolean
      }
      Array: {
        isArray: types.boolean
      }
      Math: {
        abs: types.number
        acos: types.number
        asin: types.number
        atan: types.number
        atan2: types.number
        ceil: types.number
        cos: types.number
        exp: types.number
        floor: types.number
        log: types.number
        max: types.number
        min: types.number
        pow: types.number
        random: types.number
        round: types.number
        sin: types.number
        sqrt: types.number
        tan: types.number
      }
      JSON: {
        stringify: types.string.union(types.undefined)
        parse: types.string.union(types.number).union(types.boolean).union(types.null).union(types.array).union(types.object)
      }
      Date: {
        UTC: types.number
        now: types.number
      }
    }
    let PRIMORDIAL_METHODS = {
      String: {
        toString: types.string
        valueOf: types.string
        charAt: types.string
        charCodeAt: types.number
        concat: types.string
        indexOf: types.number
        lastIndexOf: types.number
        localeCompare: types.number
        match: types.array.union(types.null)
        replace: types.string
        search: types.number
        slice: types.string
        split: types.string.array()
        substring: types.string
        toLowerCase: types.string
        toLocaleLowerCase: types.string
        toUpperCase: types.string
        toLocaleUpperCase: types.string
        trim: types.string
      }
      Boolean: {
        toString: types.string
        valueOf: types.boolean
      }
      Number: {
        toString: types.string
        valueOf: types.number
        toLocaleString: types.string
        toFixed: types.string
        toExponential: types.string
        toPrecision: types.string
      }
      Date: {
        toString: types.string
        toDateString: types.string
        toTimeString: types.string
        toLocaleString: types.string
        toLocaleDateString: types.string
        toLocaleTimeString: types.string
        valueOf: types.number
        getTime: types.number
        getFullYear: types.number
        getUTCFullYear: types.number
        getMonth: types.number
        getUTCMonth: types.number
        getDate: types.number
        getUTCDate: types.number
        getDay: types.number
        getUTCDay: types.number
        getHours: types.number
        getUTCHours: types.number
        getMinutes: types.number
        getUTCMinutes: types.number
        getSeconds: types.number
        getUTCSeconds: types.number
        getMilliseconds: types.number
        getUTCMilliseconds: types.number
        getTimezoneOffset: types.number
        setTime: types.number
        setMilliseconds: types.number
        setUTCMilliseconds: types.number
        setSeconds: types.number
        setUTCSeconds: types.number
        setMinutes: types.number
        setUTCMinutes: types.number
        setHours: types.number
        setUTCHours: types.number
        setDate: types.number
        setUTCDate: types.number
        setMonth: types.number
        setUTCMonth: types.number
        setFullYear: types.number
        setUTCFullYear: types.number
        toUTCString: types.string
        toISOString: types.string
        toJSON: types.string
      }
      RegExp: {
        test: types.boolean
        toString: types.string
      }
      Error: {
        toString: types.string
      }
    }
    let helper-type-cache = {}
    let calculate-type(node)  
      let ast = require('./ast')
      let last = node.last()
      if last instanceof ast.Func
        last.meta?.as-type ? types.any
      else if last instanceof ast.Return
        calculate-type(last.node)
      else if last instanceof ast.Call and last.func instanceof ast.Func
        calculate-type(last.func.body[last.func.body.length - 1])
      else
        types.any
    #-> @_type ?= do
      let func = @func
      if func instanceof IdentNode
        let name = func.name
        if PRIMORDIAL_FUNCTIONS ownskey name
          return PRIMORDIAL_FUNCTIONS[name]
        else if name.length > 2 and C(name, 0) == C("_") and C(name, 1) == C("_")
          let helpers = require('./translator').helpers
          if helpers.has name
            return if helper-type-cache ownskey name
              helper-type-cache[name]
            else
              helper-type-cache[name] := calculate-type helpers.get name
      /*
      else if links.length == 2 and links[0].type == \access and not links[0].existential and links[1].type == \call and not links[1].existential and links[0].child instanceof ConstNode
          if PRIMORDIAL_SUBFUNCTIONS ownskey name and PRIMORDIAL_SUBFUNCTIONS[name] ownskey links[0].child.value
            return PRIMORDIAL_SUBFUNCTIONS[name][links[0].child.value]
      */
      types.any
  _reduce: do
    let PURE_PRIMORDIAL_FUNCTIONS = {
      escape: true
      unescape: true
      parseInt: true
      parseFloat: true
      isNaN: true
      isFinite: true
      decodeURI: true
      decodeURIComponent: true
      encodeURI: true
      encodeURIComponent: true
      String: true
      Boolean: true
      Number: true
      RegExp: true
    }
    let PURE_PRIMORDIAL_SUBFUNCTIONS = {
      String: {
        fromCharCode: true
      }
      Number: {
        isFinite: true
        isNaN: true
      }
      Math: {
        abs: true
        acos: true
        asin: true
        atan: true
        atan2: true
        ceil: true
        cos: true
        exp: true
        floor: true
        log: true
        max: true
        min: true
        pow: true
        round: true
        sin: true
        sqrt: true
        tan: true
      }
      JSON: {
        parse: true
        stringify: true
      }
    }
    #
      let func = @func.reduce()
      let args = map @args, #(node) -> node.reduce()
      if not @is-new and not @is-apply
        let const-args = []
        let mutable all-const = true
        for arg in args
          if arg instanceof ConstNode
            const-args.push arg.value
          else
            all-const := false
            break
        if all-const
          if func instanceof IdentNode
            if PURE_PRIMORDIAL_FUNCTIONS ownskey func.name
              try
                let value = GLOBAL[func.name]@ void, ...const-args
                return ConstNode @start-index, @end-index, value
              catch e
                // TODO: do something here to alert the user
                void
          else if func instanceof AccessNode and func.child instanceof ConstNode
            let parent = func.parent
            let child = func.child
            if parent instanceof ConstNode
              if typeof parent.value[child.value] == \function
                try
                  let value = parent.value[child.value] ...const-args
                  return ConstNode @start-index, @end-index, value
                catch e
                  // TODO: do something here to alert the user
                  void
            else if parent instanceof IdentNode
              if PURE_PRIMORDIAL_SUBFUNCTIONS ownskey parent.name and PURE_PRIMORDIAL_SUBFUNCTIONS[parent.name] ownskey child.value
                try
                  let value = GLOBAL[parent.name][child.value] ...const-args
                  return ConstNode @start-index, @end-index, value
                catch e
                  // TODO: do something here to alert the user
                  void
      if func != @func or args != @args
        CallNode @start-index, @end-index, func, args, @is-new, @is-apply
      else
        this
}
/*
node-type! \call-chain, head as Node, links as Array, {
  type: do
    let PRIMORDIAL_FUNCTIONS = {
      Object: types.object
      String: types.string
      Number: types.number
      Boolean: types.boolean
      Function: types.function
      Array: types.array
      Date: types.string
      RegExp: types.regexp
      Error: types.error
      RangeError: types.error
      ReferenceError: types.error
      SyntaxError: types.error
      TypeError: types.error
      URIError: types.error
      escape: types.string
      unescape: types.string
      parseInt: types.number
      parseFloat: types.number
      isNaN: types.boolean
      isFinite: types.boolean
      decodeURI: types.string
      decodeURIComponent: types.string
      encodeURI: types.string
      encodeURIComponent: types.string
    }
    let PRIMORDIAL_SUBFUNCTIONS = {
      Object: {
        getPrototypeOf: types.object
        getOwnPropertyDescriptor: types.object
        getOwnPropertyNames: types.string.array()
        create: types.object
        defineProperty: types.object
        defineProperties: types.object
        seal: types.object
        freeze: types.object
        preventExtensions: types.object
        isSealed: types.boolean
        isFrozen: types.boolean
        isExtensible: types.boolean
        keys: types.string.array()
      }
      String: {
        fromCharCode: types.string
      }
      Number: {
        isFinite: types.boolean
        isNaN: types.boolean
      }
      Array: {
        isArray: types.boolean
      }
      Math: {
        abs: types.number
        acos: types.number
        asin: types.number
        atan: types.number
        atan2: types.number
        ceil: types.number
        cos: types.number
        exp: types.number
        floor: types.number
        log: types.number
        max: types.number
        min: types.number
        pow: types.number
        random: types.number
        round: types.number
        sin: types.number
        sqrt: types.number
        tan: types.number
      }
      JSON: {
        stringify: types.string.union(types.undefined)
        parse: types.string.union(types.number).union(types.boolean).union(types.null).union(types.array).union(types.object)
      }
      Date: {
        UTC: types.number
        now: types.number
      }
    }
    let PRIMORDIAL_METHODS = {
      String: {
        toString: types.string
        valueOf: types.string
        charAt: types.string
        charCodeAt: types.number
        concat: types.string
        indexOf: types.number
        lastIndexOf: types.number
        localeCompare: types.number
        match: types.array.union(types.null)
        replace: types.string
        search: types.number
        slice: types.string
        split: types.string.array()
        substring: types.string
        toLowerCase: types.string
        toLocaleLowerCase: types.string
        toUpperCase: types.string
        toLocaleUpperCase: types.string
        trim: types.string
      }
      Boolean: {
        toString: types.string
        valueOf: types.boolean
      }
      Number: {
        toString: types.string
        valueOf: types.number
        toLocaleString: types.string
        toFixed: types.string
        toExponential: types.string
        toPrecision: types.string
      }
      Date: {
        toString: types.string
        toDateString: types.string
        toTimeString: types.string
        toLocaleString: types.string
        toLocaleDateString: types.string
        toLocaleTimeString: types.string
        valueOf: types.number
        getTime: types.number
        getFullYear: types.number
        getUTCFullYear: types.number
        getMonth: types.number
        getUTCMonth: types.number
        getDate: types.number
        getUTCDate: types.number
        getDay: types.number
        getUTCDay: types.number
        getHours: types.number
        getUTCHours: types.number
        getMinutes: types.number
        getUTCMinutes: types.number
        getSeconds: types.number
        getUTCSeconds: types.number
        getMilliseconds: types.number
        getUTCMilliseconds: types.number
        getTimezoneOffset: types.number
        setTime: types.number
        setMilliseconds: types.number
        setUTCMilliseconds: types.number
        setSeconds: types.number
        setUTCSeconds: types.number
        setMinutes: types.number
        setUTCMinutes: types.number
        setHours: types.number
        setUTCHours: types.number
        setDate: types.number
        setUTCDate: types.number
        setMonth: types.number
        setUTCMonth: types.number
        setFullYear: types.number
        setUTCFullYear: types.number
        toUTCString: types.string
        toISOString: types.string
        toJSON: types.string
      }
      RegExp: {
        test: types.boolean
        toString: types.string
      }
      Error: {
        toString: types.string
      }
    }
    let helper-type-cache = {}
    let calculate-type(node)  
      let ast = require('./ast')
      let last = node.last()
      if last instanceof ast.Func
        last.meta?.as-type ? types.any
      else if last instanceof ast.Return
        calculate-type(last.node)
      else if last instanceof ast.Call and last.func instanceof ast.Func
        calculate-type(last.func.body[last.func.body.length - 1])
      else
        types.any
    #-> @_type ?= do
      let head = @head
      let links = @links
      if head instanceof IdentNode
        let name = head.name
        if links.length == 1 and links[0].type == \call and not links[0].existential
          if name.substring(0, 2) == "__"
            let helpers = require('./translator').helpers
            if helpers.has name
              if helper-type-cache ownskey name
                return helper-type-cache[name]
              else
                let type = calculate-type(helpers.get(name))
                if type?
                  return (helper-type-cache[name] := type)
          else if PRIMORDIAL_FUNCTIONS ownskey name
            return PRIMORDIAL_FUNCTIONS[head.name]
        else if links.length == 2 and links[0].type == \access and not links[0].existential and links[1].type == \call and not links[1].existential and links[0].child instanceof ConstNode
          if PRIMORDIAL_SUBFUNCTIONS ownskey name and PRIMORDIAL_SUBFUNCTIONS[name] ownskey links[0].child.value
            return PRIMORDIAL_SUBFUNCTIONS[name][links[0].child.value]
      types.any
  walk: do
    let link-types = {
      access: #(link, func)
        let child = func link.child
        if child != link.child
          {
            type: \access
            child
            link.existential
          }
        else
          link
      access-index: do
        let index-types = {
          slice: #(x, func)
            let left = func x.left
            let right = func x.right
            if left != x.left or right != x.right
              {
                type: \slice
                left
                right
              }
            else
              x
          multi: #(x, func)
            let elements = map x.elements, func
            if elements != x.elements
              {
                type: \multi
                elements
              }
            else
              x
        }
        #(link, func)
          let type = link.child.type
          unless index-types ownskey type
            throw Error "Unknown index type: $type"
          
          let child = index-types[type](link.child, func)
          if child != link.child
            {
              type: \access-index
              child
              link.existential
            }
          else
            link
      call: #(link, func)
        let args = map link.args, func
        if args != link.args
          {
            type: \call
            args
            link.existential
            link.is-new
            link.is-apply
          }
        else
          link
    }
    let walk-link(link, func)
      unless link-types ownskey link.type
        throw Error "Unknown call-chain link type: $(link.type)"
      
      link-types[link.type](link, func)
    #(func)
      let head = func @head
      let links = map @links, walk-link, func
      if head != @head or links != @links
        CallChainNode @start-index, @end-index, head, links
      else
        this
}
*/
node-type! \const, value as (Number|String|Boolean|RegExp|void|null), {
  type: #
    let value = @value
    switch typeof value
    case \number; types.number
    case \string; types.string
    case \boolean; types.boolean
    case \undefined; types.undefined
    default
      if value == null
        types.null
      else if value instanceof RegExp
        types.regexp
      else
        throw Error("Unknown type for $(String value)")
  cacheable: false
}
node-type! \continue
node-type! \debugger
node-type! \declarable, ident as Node, is-mutable as Boolean
node-type! \def, left as Node, right as (Node|void), {
  walk: #(func)
    let left = func @left
    let right = if @right? then func @right else @right
    if left != @left or right != @right
      DefNode @start-index, @end-index, left, right
    else
      this
}
node-type! \define-helper, name as Node, value as Node
node-type! \eval, code as Node
node-type! \for, init as Node = NothingNode(0, 0), test as Node = ConstNode(0, 0, true), step as Node = NothingNode(0, 0), body as Node
node-type! \for-in, key as Node, object as Node, body as Node
node-type! \function, params as [Node], body as Node, auto-return as Boolean = true, bound as Boolean = false, as-type as (Node|void), {
  type: # -> types.function
  walk: #(func)
    let params = map @params, func
    let body = func @body
    let as-type = if @as-type? then func @as-type else @as-type
    if params != @params or body != @body or as-type != @as-type
      FunctionNode @start-index, @end-index, params, body, @auto-return, @bound, @as-type
    else
      this
}
node-type! \ident, name as String, {
  cacheable: false
}
node-type! \if, test as Node, when-true as Node, when-false as Node = NothingNode(0, 0), {
  type: # -> @_type ?= @when-true.type().union(@when-false.type())
  _reduce: #
    let test = @test.reduce()
    let when-true = @when-true.reduce()
    let when-false = @when-false.reduce()
    if test instanceof ConstNode
      if test.value
        when-true
      else
        when-false
    else
      IfNode @start-index, @end-index, test, when-true, when-false
}
node-type! \let, left as Node, right as Node, {
  type: # -> @right.type()
}
node-type! \macro-access, id as Number, data as Object
node-type! \nothing, {
  type: # -> types.undefined
  cacheable: false
}
node-type! \object, pairs as Array, {
  type: # -> types.object
  walk: do
    let walk-pair(pair, func)
      let key = func pair.key
      let value = func pair.value
      if key != pair.key or value != pair.value
        { key, value }
      else
        pair
    #(func)
      let pairs = map @pairs, walk-pair, func
      if pairs != @pairs
        ObjectNode @start-index, @end-index, pairs
      else
        this
}
State::object-param := State::object
node-type! \param, ident as Node, default-value as (Node|void), spread as Boolean, is-mutable as Boolean, as-type as (Node|void), {
  walk: #(func)
    let ident = func @ident
    let default-value = if @default-value? then func @default-value else @default-value
    let as-type = if @as-type? then func @as-type else @as-type
    if ident != @ident or default-value != @default-value or as-type != @as-type
      ParamNode @start-index, @end-index, ident, default-value, @spread, @is-mutable, as-type
    else
      this
}
node-type! \regexp, text as Node, flags as String, {
  type: # -> types.regexp
}
node-type! \return, node as Node = ConstNode(0, 0, void), existential as Boolean, {
  type: # -> @node.type()
}
node-type! \root, body as Node
node-type! \spread, node as Node
node-type! \string, parts as [Node], {
  type: # -> types.string
  _reduce: #
    let segments = [ConstNode @start-index, @start-index, ""]
    for part in @parts
      let reduced = part.reduce()
      if reduced instanceof ConstNode
        if typeof reduced.value != \string
          segments.push ConstNode reduced.start-index, reduced.end-index, String(reduced.value)
        else
          segments.push reduced
      else
        if not reduced.type().is-subset-of(types.string-or-number)
          let i = reduced.start-index
          let j = reduced.end-index
          segments.push CallNode i, j, IdentNode(i, j, \__strnum), [reduced]
        else
          segments.push reduced
    for i = segments.length - 1, 0, -1
      let left = segments[i - 1]
      let right = segments[i]
      if left instanceof ConstNode and right instanceof ConstNode
        segments.splice i - 1, 2, ConstNode left.start-index, right.end-index, left.value & right.value
      else if right instanceof ConstNode and right.value == ""
        segments.splice i, 1
    if segments.length > 1 and segments[0] instanceof ConstNode and segments[0].value == "" and (segments[1].type().is-subset-of(types.string) or (segments.length > 2 and segments[2].type().is-subset-of(types.string)))
      segments.shift()
    let mutable result = segments[0]
    for i = 1, segments.length
      let segment = segments[i]
      result := BinaryNode result.start-index, segment.end-index, result, "+", segment
    result
}
node-type! \super, child as (Node|void), args as [Node], {
  walk: #(func)
    let child = if @child? then func @child else @child
    let args = map @args, func
    if child != @child or args != @args
      SuperNode @start-index, @end-index, child, args
    else
      this
}
node-type! \switch, node as Node, cases as Array, default-case as (Node|void), {
  walk: #(func)
    let node = func @node
    let cases = map @cases, #(case_)
      let case-node = func case_.node
      let case-body = func case_.body
      if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_
    let default-case = func @default-case
    if node != @node or cases != @cases or default-case != @default-case
      SwitchNode @start-index, @end-index, node, cases, default-case
    else
      this
}
node-type! \syntax-choice, choices as [Node]
node-type! \syntax-many, inner as Node, multiplier as String
node-type! \syntax-param, ident as Node, as-type as (Node|void), {
  walk: #(func)
    let ident = func @ident
    let as-type = if @as-type? then func @as-type else @as-type
    if ident != @ident or as-type != @as-type
      SyntaxParamNode @start-index, @end-index, ident, as-type
    else
      this
}
node-type! \syntax-sequence, params as [Node]
node-type! \this, {
  cacheable: false
}
node-type! \throw, node as Node, {
  type: # -> types.none
}
node-type! \tmp, id as Number, name as String, {
  cacheable: false
}
node-type! \try-catch, try-body as Node, catch-ident as Node, catch-body as Node, {
  type: # -> @_type ?= @try-body.type().union(@catch-body.type())
}
node-type! \try-finally, try-body as Node, finally-body as Node, {
  type: # -> @try-body.type()
  _reduce: #
    let try-body = @try-body.reduce()
    let finally-body = @finally-body.reduce()
    if finally-body instanceof NothingNode
      try-body
    else if try-body instanceof NothingNode
      finally-body
    else if try-body != @try-body or finally-body != @finally-body
      TryFinallyNode @start-index, @end-index, try-body, finally-body
    else
      this
}
node-type! \type-array, subtype as Node
node-type! \type-union, types as [Node]
node-type! \unary, op as String, node as Node, {
  type: do
    let ops = {
      "-": types.number
      "+": types.number
      "--": types.number
      "++": types.number
      "!": types.boolean
      "~": types.number
      typeof: types.string
      delete: types.boolean
    }
    #
      let type = ops ownskey @op and ops[@op]
      type or types.any
  _reduce: do
    let const-ops = {
      "-": #(x) -> ~-x
      "+": #(x) -> ~+x
      "!": #(x) -> not x
      "~": #(x) -> ~bitnot x
      typeof: #(x) -> typeof x
    }
    let nonconst-ops = {
      "+": #(node)
        if node.type().is-subset-of types.number
          node
      "-": #(node)
        if node instanceof UnaryNode
          if node.op in ["-", "+"]
            UnaryNode @start-index, @end-index, if node.op == "-" then "+" else "-", node.node
        else if node instanceof BinaryNode
          if node.op in ["-", "+"]
            BinaryNode @start-index, @end-index, node.left, if node.op == "-" then "+" else "-", node.right
          else if node.op in ["*", "/"]
            BinaryNode @start-index, @end-index, Unary("-", node.left), node.op, node.right
      "!": do
        let invertible-binary-ops = {
          "<": ">="
          "<=": ">"
          ">": "<="
          ">=": "<"
          "==": "!="
          "!=": "=="
          "===": "!=="
          "!==": "==="
          "&&": #(x, y) -> BinaryNode @start-index, @end-index, UnaryNode(x.start-index, x.end-index, "!", x), "||", UnaryNode(y.start-index, y.end-index, "!", y)
          "||": #(x, y) -> BinaryNode @start-index, @end-index, UnaryNode(x.start-index, x.end-index, "!", x), "&&", UnaryNode(y.start-index, y.end-index, "!", y)
        }
        #(node)
          if node instanceof UnaryNode
            if node.op == "!" and node.node.type().is-subset-of(types.boolean)
              node.node
          else if node instanceof BinaryNode
            if invertible-binary-ops ownskey node.op
              let invert = invertible-binary-ops[node.op]
              if typeof invert == \function
                invert@ this, node.left, node.right
              else
                BinaryNode @start-index, @end-index, node.left, invert, node.right
    }
    
    #
      let node = @node.reduce()
      let op = @op
      if node instanceof ConstNode and const-ops ownskey op
        return ConstNode @start-index, @end-index, const-ops[op](node.value)
      
      if nonconst-ops ownskey op
        let handler = nonconst-ops[op]
        let result = handler@ this, node
        if result?
          return result.reduce()
      
      if node != @node
        UnaryNode @start-index, @end-index, op, node
      else
        this
}
node-type! \tmp-wrapper, node as Node, tmps as Array, {
  type: # -> @node.type()
  _reduce: #
    let node = @node.reduce()
    if @tmps.length == 0
      node
    else if @node != node
      TmpWrapperNode @start-index, @end-index, node, @tmps
    else
      this
}
node-type! \yield, node as Node, multiple as Boolean

let without-repeats(array)
  let result = []
  let mutable last-item = void
  for item in array
    if item != last-item
      result.push item
    else
      last-item := item
  result

let build-expected(errors)
  let errs = without-repeats errors[:].sort #(a, b) -> a.to-lower-case() <=> b.to-lower-case()
  switch errs.length
  case 0
    "End of input"
  case 1
    errs[0]
  case 2
    "$(errs[0]) or $(errs[1])"
  default
    "$(errs[:-1].join ', ') or $(errs[errs.length - 1])"

let build-error-message(errors, last-token)
  "Expected $(build-expected errors), but $(last-token) found"

let parse(text, macros, options = {})
  if typeof text != \string
    throw TypeError "Expected text to be a string, got $(typeof! text)"
  
  let o = State text, macros
  
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
      result: result.reduce()
      o.macros
    }
module.exports := parse
module.exports.ParserError := ParserError
module.exports.Node := Node