require! Type: './types'
let {inspect} = require 'util'

let GLOBAL = if typeof window != \undefined then window else global

let freeze = if typeof Object.freeze == \function then Object.freeze else #(o) -> o

let SHORT_CIRCUIT = freeze { to-string: #-> "short-circuit" }
let NOTHING = freeze { to-string: #-> "" }

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

let named(name as null|String, func as Function)
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
      let {cache, index} = o
      let indent = o.indent.peek()
      let indent-cache = (cache[indent] ?= [])
      let inner = (indent-cache[cache-key] ?= [])
      let item = inner[index]
      if item == void
        let result = rule o
        if o.indent.peek() != indent
          throw Error "Changed indent during cache process: from $indent to $(o.indent.peek())"
        if not result
          inner[index] := false
        else
          inner[index] := [o.index, o.line, result]
        result
      else if not item
        false
      else
        o.index := item[0]
        o.line := item[1]
        item[2]
macro cache!(rule, dont-cache)
  if @is-const(dont-cache)
    if @value(dont-cache)
      rule
    else
      AST cache $rule
  else
    AST cache $rule, $dont-cache

macro with-message!(message, rule)
  let init = []
  message := @cache message, message, \message, true
  rule := @cache rule, init, \rule, true
  AST do
    $init
    #(o)
      o.prevent-fail()
      let mutable result = void
      try
        result := $rule o
      finally
        o.unprevent-fail()
      if result
        result
      else
        o.fail $message
        false

macro C(string, index)
  index ?= AST 0
  AST $string.char-code-at($index)

macro mutate!(rule, mutator)
  if mutator? and (not @is-const(mutator) or @value(mutator) != void)
    let init = []
    rule := @cache rule, init, \rule, true
    mutator := @cache mutator, init, \mutator, true
    let unknown-name = if @is-ident(rule) then @name(rule) else "<unknown>"
    let result = AST named($rule?.parser-name or $unknown-name, #(o)
      let {index, line} = o
      let result = $rule o
      if not result
        false
      else
        if typeof $mutator == \function
          $mutator result, o, index, line
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
    AST mutate! $(elements[0]), $mutator
  default
    let init = []
    let checks = AST false
    for rule, i, len in elements
      if @is-const(rule)
        if typeof @value(rule) != \string
          throw Error "Can only handle constant string literals"
        rule := AST word-or-symbol $rule
      rule := @cache rule, init, \rule, true
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
    if is-array! item
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
  let mutable code = AST true
  for check in checks
    code := AST $code and $check
  
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
  if (@is-const(missing-value) and not @value(missing-value)) or not missing-value
    throw Error "Expected a truthy missing-value, got $(String @value(missing-value))"
  let init = []
  rule := @cache rule, init, \rule, true
  missing-value := @cache missing-value, init, \missing, true
  found-value := if found-value then @cache found-value, init, \found, true
  
  let unknown-name = if @is-ident(rule) then @name(rule) else "<unknown>"
  
  let result = AST named(($rule?.parser-name or $unknown-name) & "?", #(o)
    let {index, line} = o
    let clone = o.clone()
    let result = $rule clone
    if not result
      if typeof $missing-value == \function
        $missing-value void, o, index, line
      else
        $missing-value
    else
      o.update clone
      if $found-value != void
        if typeof $found-value == \function
          $found-value result, o, index, line
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
  
  let unknown-name = if @is-ident(rule) then @name(rule) else "<unknown>"
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
  
  let unknown-name = if @is-ident(backend) then @name(backend) else "<unknown>"
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
  let ending = if @value(min-count) == @value(max-count)
    "{$(@value min-count)}"
  else
    "{$(@value min-count),$(@value max-count)}"
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
    let unknown-name = if @is-ident(rule) then @name(rule) else "<unknown>"
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
  let codes = []
  if @is-const(chars)
    chars := @value(chars)
    for i in 0 til chars.length
      codes.push C(chars, i)
  else
    for part in @elements(chars)
      if @is-array(part)
        if @elements(part).length != 2
          throw Error "Sub-arrays must be length 2"
        let mutable left = @elements(part)[0]
        let mutable right = @elements(part)[1]
        if not @is-const(left) or not @is-const(right)
          throw Error "Sub-arrays must contain constant strings or numbers"
        left := @value(left)
        right := @value(right)
        if typeof left == \string
          if left.length != 1
            throw Error "Expected a string of length 1"
          left := C(left)
        else if typeof left != \number
          throw Error "Expected a string or number"
        if typeof right == \string
          if right.length != 1
            throw Error "Expected a string of length 1"
          right := C(right)
        else if typeof left != \number
          throw Error "Expected a string or number"
        if left > right
          throw Error "left must be less than or equal to right"
        for i in left to right
          codes.push i
      else if @is-const(part)
        let mutable value = @value(part)
        if typeof value == \string
          for i in 0 til value.length
            codes.push C(value, i)
        else if typeof value == \number
          codes.push value
        else
          throw Error "Expected a string or number"
      else
        throw Error "Array values must be length-2 Arrays or constant Strings or Numbers"
  codes.sort #(x, y) -> x <=> y
  let chunks = []
  let mutable current-start = void
  let mutable current-end = void
  for code in codes
    if not current-start?
      current-start := code
      current-end := code
    else if code == current-end + 1
      if code == 128
        // separate the codes < 127 (common) vs >= 128 (uncommon)
        chunks.push
          start: current-start
          end: current-end
        current-start := code
      current-end := code
    else
      chunks.push
        start: current-start
        end: current-end
      current-start := code
      current-end := code
  chunks.push
    start: current-start
    end: current-end
  
  let mutable current = AST false
  let mutable uncommon-current = AST false
  let mutable has-uncommon = false
  for chunk in chunks
    let {start, end} = chunk
    let test = if start == end
      AST c == $start
    else if end == start + 1
      AST c == $start or c == $end
    else
      AST c ~>= $start and c ~<= $end
    if start >= 128
      uncommon-current := AST $uncommon-current or $test
      has-uncommon := true
    else
      current := AST $current or $test
  if has-uncommon
    current := AST if c ~< 128 then $current else $uncommon-current
  if chunks.length == 1 and chunks[0].start == chunks[0].end
    let code = chunks[0].start
    if not name
      let ch = String.from-char-code chunks[0].start
      name := if ch == '"' then "'\"'" else (JSON.stringify ch)
    AST
      named $name, #(o)
        if C(o.data, o.index) == $code
          o.index += 1
          $code
        else
          o.fail $name
          false
  else
    if not name
      name := ["["]
      for chunk in chunks
        let start = String.from-char-code chunk.start
        let end = String.from-char-code chunk.end
        if start == "-"
          name.push "\\"
        name.push start
        if start != end
          if chunk.start != chunk.end - 1
            name.push "-"
          if end == "-"
            name.push "\\"
          name.push end
      name.push "]"
      name := name.join ""
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
  return with-message! failure-message, mutate! named(failure-message, #(o)
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
    console.log "$(i)-$(name) starting at line #$(o.line), index $(o.index), indent $(o.indent.peek())"
    let result = func o
    if not result
      console.log "$(i)-$(name) failure at line #$(o.line), index $(o.index), indent $(o.indent.peek())"
    else
      console.log "$(i)-$(name) success at line #$(o.line), index $(o.index), indent $(o.indent.peek())", result
    result

macro define
  syntax name as Identifier, "=", value
    let name-str = @name(name)
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

let _position = Stack \statement
let in-statement = make-alter-stack _position, \statement
let in-expression = make-alter-stack _position, \expression

let _in-macro = Stack false
let in-macro = make-alter-stack _in-macro, true

let _in-ast = Stack false
let in-ast = make-alter-stack _in-ast, true

let _prevent-unclosed-object-literal = Stack false
let prevent-unclosed-object-literal = make-alter-stack _prevent-unclosed-object-literal, true

define Eof = #(o) -> o.index >= o.data.length

define SpaceChar = character! [
  " \t\v\f"
  160
  5760
  6158
  [8192, 8202]
  8239
  8287
  12288
  65263
], "space"
define _Space = zero-or-more! SpaceChar, true
define Newline = #(o)
  let {data, mutable index} = o
  let c = C(data, index)
  if c in [C("\r"), C("\n"), 8232, 8233]
    index ~+= 1
    if c == C("\r") and C(data, index) == C("\n")
      index ~+= 1
    o.index := index
    o.line ~+= 1
    true
  else
    o.fail "newline"
    false
define Stop = one-of! [Newline, Eof]
define CheckStop = check! Stop
define NewlineWithCheckIndent = sequential! [
  Newline
  EmptyLines
  CheckIndent
]

define SingleLineComment = #(o)
  let {data, index} = o
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
  let {data, index} = o
  if C(data, index) == C("/") and C(data, index ~+ 1) == C("*")
    let len = data.length
    index += 2
    while true, index ~+= 1
      if index ~>= len
        o.error "Multi-line comment never ends"
      else
        let ch = C(data, index)
        if ch == C("*") and C(data, index ~+ 1) == C("/")
          o.index := index ~+ 2
          Space o
          return true
        else if ch in [C("\r"), C("\n"), 8232, 8233]
          if ch == C("\r") and C(data, index ~+ 1) == C("\n")
            index ~+= 1
          o.line ~+= 1
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

let INDENTS =
  [C "\t"]: 4
  [C " "]: 1
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

let PushFakeIndent = do
  let cache = []
  #(n) -> cache[n] ?= named "PushFakeIndent($n)", #(o)
    o.indent.push o.indent.peek() + n
    true

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
define DecimalDigit = character! [["0", "9"]]
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
define HexDigit = character! [["0", "9"], ["a", "f"], ["A", "F"]]
define OctalDigit = character! [["0", "7"]]
define BinaryDigit = character! "01"
define Letter = character! [
  ["a", "z"]
  ["A", "Z"]
  170
  181
  186
  [192, 214]
  [216, 246]
  [248, 705]
  [710, 721]
  [736, 740]
  748
  750
  [880, 884]
  [886, 887]
  [890, 893]
  902
  [904, 906]
  908
  [910, 929]
  [931, 1013]
  [1015, 1153]
  [1162, 1317]
  [1329, 1366]
  1369
  [1377, 1415]
  [1488, 1514]
  [1520, 1522]
  [1569, 1610]
  [1646, 1647]
  [1649, 1747]
  1749
  [1765, 1766]
  [1774, 1775]
  [1786, 1788]
  1791
  1808
  [1810, 1839]
  [1869, 1957]
  1969
  [1994, 2026]
  [2036, 2037]
  2042
  [2048, 2069]
  2074
  2084
  2088
  [2308, 2361]
  2365
  2384
  [2392, 2401]
  [2417, 2418]
  [2425, 2431]
  [2437, 2444]
  [2447, 2448]
  [2451, 2472]
  [2474, 2480]
  2482
  [2486, 2489]
  2493
  2510
  [2524, 2525]
  [2527, 2529]
  [2544, 2545]
  [2565, 2570]
  [2575, 2576]
  [2579, 2600]
  [2602, 2608]
  [2610, 2611]
  [2613, 2614]
  [2616, 2617]
  [2649, 2652]
  2654
  [2674, 2676]
  [2693, 2701]
  [2703, 2705]
  [2707, 2728]
  [2730, 2736]
  [2738, 2739]
  [2741, 2745]
  2749
  2768
  [2784, 2785]
  [2821, 2828]
  [2831, 2832]
  [2835, 2856]
  [2858, 2864]
  [2866, 2867]
  [2869, 2873]
  2877
  [2908, 2909]
  [2911, 2913]
  2929
  2947
  [2949, 2954]
  [2958, 2960]
  [2962, 2965]
  [2969, 2970]
  2972
  [2974, 2975]
  [2979, 2980]
  [2984, 2986]
  [2990, 3001]
  3024
  [3077, 3084]
  [3086, 3088]
  [3090, 3112]
  [3114, 3123]
  [3125, 3129]
  3133
  [3160, 3161]
  [3168, 3169]
  [3205, 3212]
  [3214, 3216]
  [3218, 3240]
  [3242, 3251]
  [3253, 3257]
  3261
  3294
  [3296, 3297]
  [3333, 3340]
  [3342, 3344]
  [3346, 3368]
  [3370, 3385]
  3389
  [3424, 3425]
  [3450, 3455]
  [3461, 3478]
  [3482, 3505]
  [3507, 3515]
  3517
  [3520, 3526]
  [3585, 3632]
  [3634, 3635]
  [3648, 3654]
  [3713, 3714]
  3716
  [3719, 3720]
  3722
  3725
  [3732, 3735]
  [3737, 3743]
  [3745, 3747]
  3749
  3751
  [3754, 3755]
  [3757, 3760]
  [3762, 3763]
  3773
  [3776, 3780]
  3782
  [3804, 3805]
  3840
  [3904, 3911]
  [3913, 3948]
  [3976, 3979]
  [4096, 4138]
  4159
  [4176, 4181]
  [4186, 4189]
  4193
  [4197, 4198]
  [4206, 4208]
  [4213, 4225]
  4238
  [4256, 4293]
  [4304, 4346]
  4348
  [4352, 4680]
  [4682, 4685]
  [4688, 4694]
  4696
  [4698, 4701]
  [4704, 4744]
  [4746, 4749]
  [4752, 4784]
  [4786, 4789]
  [4792, 4798]
  4800
  [4802, 4805]
  [4808, 4822]
  [4824, 4880]
  [4882, 4885]
  [4888, 4954]
  [4992, 5007]
  [5024, 5108]
  [5121, 5740]
  [5743, 5759]
  [5761, 5786]
  [5792, 5866]
  [5888, 5900]
  [5902, 5905]
  [5920, 5937]
  [5952, 5969]
  [5984, 5996]
  [5998, 6000]
  [6016, 6067]
  6103
  6108
  [6176, 6263]
  [6272, 6312]
  6314
  [6320, 6389]
  [6400, 6428]
  [6480, 6509]
  [6512, 6516]
  [6528, 6571]
  [6593, 6599]
  [6656, 6678]
  [6688, 6740]
  6823
  [6917, 6963]
  [6981, 6987]
  [7043, 7072]
  [7086, 7087]
  [7168, 7203]
  [7245, 7247]
  [7258, 7293]
  [7401, 7404]
  [7406, 7409]
  [7424, 7615]
  [7680, 7957]
  [7960, 7965]
  [7968, 8005]
  [8008, 8013]
  [8016, 8023]
  8025
  8027
  8029
  [8031, 8061]
  [8064, 8116]
  [8118, 8124]
  8126
  [8130, 8132]
  [8134, 8140]
  [8144, 8147]
  [8150, 8155]
  [8160, 8172]
  [8178, 8180]
  [8182, 8188]
  8305
  8319
  [8336, 8340]
  8450
  8455
  [8458, 8467]
  8469
  [8473, 8477]
  8484
  8486
  8488
  [8490, 8493]
  [8495, 8505]
  [8508, 8511]
  [8517, 8521]
  8526
  [8579, 8580]
  [11264, 11310]
  [11312, 11358]
  [11360, 11492]
  [11499, 11502]
  [11520, 11557]
  [11568, 11621]
  11631
  [11648, 11670]
  [11680, 11686]
  [11688, 11694]
  [11696, 11702]
  [11704, 11710]
  [11712, 11718]
  [11720, 11726]
  [11728, 11734]
  [11736, 11742]
  11823
  [12293, 12294]
  [12337, 12341]
  [12347, 12348]
  [12353, 12438]
  [12445, 12447]
  [12449, 12538]
  [12540, 12543]
  [12549, 12589]
  [12593, 12686]
  [12704, 12727]
  [12784, 12799]
  [13312, 19893]
  [19968, 40907]
  [40960, 42124]
  [42192, 42237]
  [42240, 42508]
  [42512, 42527]
  [42538, 42539]
  [42560, 42591]
  [42594, 42606]
  [42623, 42647]
  [42656, 42725]
  [42775, 42783]
  [42786, 42888]
  [42891, 42892]
  [43003, 43009]
  [43011, 43013]
  [43015, 43018]
  [43020, 43042]
  [43072, 43123]
  [43138, 43187]
  [43250, 43255]
  43259
  [43274, 43301]
  [43312, 43334]
  [43360, 43388]
  [43396, 43442]
  43471
  [43520, 43560]
  [43584, 43586]
  [43588, 43595]
  [43616, 43638]
  43642
  [43648, 43695]
  43697
  [43701, 43702]
  [43705, 43709]
  43712
  43714
  [43739, 43741]
  [43968, 44002]
  [44032, 55203]
  [55216, 55238]
  [55243, 55291]
  [63744, 64045]
  [64048, 64109]
  [64112, 64217]
  [64256, 64262]
  [64275, 64279]
  64285
  [64287, 64296]
  [64298, 64310]
  [64312, 64316]
  64318
  [64320, 64321]
  [64323, 64324]
  [64326, 64433]
  [64467, 64829]
  [64848, 64911]
  [64914, 64967]
  [65008, 65019]
  [65136, 65140]
  [65142, 65262]
  [65264, 65276]
  [65313, 65338]
  [65345, 65370]
  [65382, 65470]
  [65474, 65479]
  [65482, 65487]
  [65490, 65495]
  [65498, 65500]
], "letter"
define NumberChar = character! [
  ["0", "9"]
  [178, 179]
  185
  [188, 190]
  [1632, 1641]
  [1776, 1785]
  [1984, 1993]
  [2406, 2415]
  [2534, 2543]
  [2548, 2553]
  [2662, 2671]
  [2790, 2799]
  [2918, 2927]
  [3046, 3058]
  [3174, 3183]
  [3192, 3198]
  [3302, 3311]
  [3430, 3445]
  [3664, 3673]
  [3792, 3801]
  [3872, 3891]
  [4160, 4169]
  [4240, 4249]
  [4969, 4988]
  [5870, 5872]
  [6112, 6121]
  [6128, 6137]
  [6160, 6169]
  [6470, 6479]
  [6608, 6618]
  [6784, 6793]
  [6800, 6809]
  [6992, 7001]
  [7088, 7097]
  [7232, 7241]
  [7248, 7257]
  8304
  [8308, 8313]
  [8320, 8329]
  [8528, 8578]
  [8581, 8585]
  [9312, 9371]
  [9450, 9471]
  [10102, 10131]
  11517
  12295
  [12321, 12329]
  [12344, 12346]
  [12690, 12693]
  [12832, 12841]
  [12881, 12895]
  [12928, 12937]
  [12977, 12991]
  [42528, 42537]
  [42726, 42735]
  [43056, 43061]
  [43216, 43225]
  [43264, 43273]
  [43472, 43481]
  [43600, 43609]
  [44016, 44025]
  [65296, 65305]
], "number"
define Underscore = character! "_"
define DollarSign = character! '$'
define AtSign = character! "@"
define HashSign = with-space! character! "#"
define PercentSign = character! "%"
define NameStart = one-of! [Letter, Underscore, DollarSign]
define NameChar = one-of! [NameStart, NumberChar]
define SymbolChar = character! [
  "!#%&*+-/<=>?\\^`|~"
  "\u007f"
  [128, 159]
  [161, 169]
  [171, 177]
  180
  [182, 184]
  187
  191
  215
  247
  [706, 709]
  [722, 735]
  [741, 747]
  749
  [751, 879]
  885
  [888, 889]
  [894, 901]
  903
  907
  909
  930
  1014
  [1154, 1161]
  [1318, 1328]
  [1367, 1368]
  [1370, 1376]
  [1416, 1487]
  [1515, 1519]
  [1523, 1568]
  [1611, 1631]
  [1642, 1645]
  1648
  1748
  [1750, 1764]
  [1767, 1773]
  [1789, 1790]
  [1792, 1807]
  1809
  [1840, 1868]
  [1958, 1968]
  [1970, 1983]
  [2027, 2035]
  [2038, 2041]
  [2043, 2047]
  [2070, 2073]
  [2075, 2083]
  [2085, 2087]
  [2089, 2307]
  [2362, 2364]
  [2366, 2383]
  [2385, 2391]
  [2402, 2405]
  2416
  [2419, 2424]
  [2432, 2436]
  [2445, 2446]
  [2449, 2450]
  2473
  2481
  [2483, 2485]
  [2490, 2492]
  [2494, 2509]
  [2511, 2523]
  2526
  [2530, 2533]
  [2546, 2547]
  [2554, 2564]
  [2571, 2574]
  [2577, 2578]
  2601
  2609
  2612
  2615
  [2618, 2648]
  2653
  [2655, 2661]
  [2672, 2673]
  [2677, 2692]
  2702
  2706
  2729
  2737
  2740
  [2746, 2748]
  [2750, 2767]
  [2769, 2783]
  [2786, 2789]
  [2800, 2820]
  [2829, 2830]
  [2833, 2834]
  2857
  2865
  2868
  [2874, 2876]
  [2878, 2907]
  2910
  [2914, 2917]
  2928
  [2930, 2946]
  2948
  [2955, 2957]
  2961
  [2966, 2968]
  2971
  2973
  [2976, 2978]
  [2981, 2983]
  [2987, 2989]
  [3002, 3023]
  [3025, 3045]
  [3059, 3076]
  3085
  3089
  3113
  3124
  [3130, 3132]
  [3134, 3159]
  [3162, 3167]
  [3170, 3173]
  [3184, 3191]
  [3199, 3204]
  3213
  3217
  3241
  3252
  [3258, 3260]
  [3262, 3293]
  3295
  [3298, 3301]
  [3312, 3332]
  3341
  3345
  3369
  [3386, 3388]
  [3390, 3423]
  [3426, 3429]
  [3446, 3449]
  [3456, 3460]
  [3479, 3481]
  3506
  3516
  [3518, 3519]
  [3527, 3584]
  3633
  [3636, 3647]
  [3655, 3663]
  [3674, 3712]
  3715
  [3717, 3718]
  3721
  [3723, 3724]
  [3726, 3731]
  3736
  3744
  3748
  3750
  [3752, 3753]
  3756
  3761
  [3764, 3772]
  [3774, 3775]
  3781
  [3783, 3791]
  [3802, 3803]
  [3806, 3839]
  [3841, 3871]
  [3892, 3903]
  3912
  [3949, 3975]
  [3980, 4095]
  [4139, 4158]
  [4170, 4175]
  [4182, 4185]
  [4190, 4192]
  [4194, 4196]
  [4199, 4205]
  [4209, 4212]
  [4226, 4237]
  4239
  [4250, 4255]
  [4294, 4303]
  4347
  [4349, 4351]
  4681
  [4686, 4687]
  4695
  4697
  [4702, 4703]
  4745
  [4750, 4751]
  4785
  [4790, 4791]
  4799
  4801
  [4806, 4807]
  4823
  4881
  [4886, 4887]
  [4955, 4968]
  [4989, 4991]
  [5008, 5023]
  [5109, 5120]
  [5741, 5742]
  [5787, 5791]
  [5867, 5869]
  [5873, 5887]
  5901
  [5906, 5919]
  [5938, 5951]
  [5970, 5983]
  5997
  [6001, 6015]
  [6068, 6102]
  [6104, 6107]
  [6109, 6111]
  [6122, 6127]
  [6138, 6157]
  6159
  [6170, 6175]
  [6264, 6271]
  6313
  [6315, 6319]
  [6390, 6399]
  [6429, 6469]
  [6510, 6511]
  [6517, 6527]
  [6572, 6592]
  [6600, 6607]
  [6619, 6655]
  [6679, 6687]
  [6741, 6783]
  [6794, 6799]
  [6810, 6822]
  [6824, 6916]
  [6964, 6980]
  [6988, 6991]
  [7002, 7042]
  [7073, 7085]
  [7098, 7167]
  [7204, 7231]
  [7242, 7244]
  [7294, 7400]
  7405
  [7410, 7423]
  [7616, 7679]
  [7958, 7959]
  [7966, 7967]
  [8006, 8007]
  [8014, 8015]
  8024
  8026
  8028
  8030
  [8062, 8063]
  8117
  8125
  [8127, 8129]
  8133
  [8141, 8143]
  [8148, 8149]
  [8156, 8159]
  [8173, 8177]
  8181
  [8189, 8191]
  [8203, 8231]
  [8234, 8238]
  [8240, 8286]
  [8288, 8303]
  [8306, 8307]
  [8314, 8318]
  [8330, 8335]
  [8341, 8449]
  [8451, 8454]
  [8456, 8457]
  8468
  [8470, 8472]
  [8478, 8483]
  8485
  8487
  8489
  8494
  [8506, 8507]
  [8512, 8516]
  [8522, 8525]
  8527
  [8586, 9311]
  [9372, 9449]
  [9472, 10101]
  [10132, 11263]
  11311
  11359
  [11493, 11498]
  [11503, 11516]
  [11518, 11519]
  [11558, 11567]
  [11622, 11630]
  [11632, 11647]
  [11671, 11679]
  11687
  11695
  11703
  11711
  11719
  11727
  11735
  [11743, 11822]
  [11824, 12287]
  [12289, 12292]
  [12296, 12320]
  [12330, 12336]
  [12342, 12343]
  [12349, 12352]
  [12439, 12444]
  12448
  12539
  [12544, 12548]
  [12590, 12592]
  [12687, 12689]
  [12694, 12703]
  [12728, 12783]
  [12800, 12831]
  [12842, 12880]
  [12896, 12927]
  [12938, 12976]
  [12992, 13311]
  [19894, 19967]
  [40908, 40959]
  [42125, 42191]
  [42238, 42239]
  [42509, 42511]
  [42540, 42559]
  [42592, 42593]
  [42607, 42622]
  [42648, 42655]
  [42736, 42774]
  [42784, 42785]
  [42889, 42890]
  [42893, 43002]
  43010
  43014
  43019
  [43043, 43055]
  [43062, 43071]
  [43124, 43137]
  [43188, 43215]
  [43226, 43249]
  [43256, 43258]
  [43260, 43263]
  [43302, 43311]
  [43335, 43359]
  [43389, 43395]
  [43443, 43470]
  [43482, 43519]
  [43561, 43583]
  43587
  [43596, 43599]
  [43610, 43615]
  [43639, 43641]
  [43643, 43647]
  43696
  [43698, 43700]
  [43703, 43704]
  [43710, 43711]
  43713
  [43715, 43738]
  [43742, 43967]
  [44003, 44015]
  [44026, 44031]
  [55204, 55215]
  [55239, 55242]
  [55292, 63743]
  [64046, 64047]
  [64110, 64111]
  [64218, 64255]
  [64263, 64274]
  [64280, 64284]
  64286
  64297
  64311
  64317
  64319
  64322
  64325
  [64434, 64466]
  [64830, 64847]
  [64912, 64913]
  [64968, 65007]
  [65020, 65135]
  65141
  [65277, 65295]
  [65306, 65312]
  [65339, 65344]
  [65371, 65381]
  [65471, 65473]
  [65480, 65481]
  [65488, 65489]
  [65496, 65497]
  [65501, 65535]
], "symbolic"
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

define NamePartWithNumbers = one-or-more! NameChar

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
    [\this, NamePartWithNumbers]
  ]]
], #(x)
  let parts = process-char-codes x.head
  for part in x.tail
    parts.push from-char-code(part[0]).to-upper-case()
    process-char-codes part[1:], parts
  parts.join ""

define Name = with-message! "name", with-space! _Name

define _Symbol = one-or-more! SymbolChar, #(x) -> process-char-codes(x).join ""

define Symbol = with-message! "symbol", with-space! _Symbol

let _NameOrSymbol = one-or-more-of! [
  _Name
  _Symbol
], #(x) -> x.join ""
let NameOrSymbol = with-space! _NameOrSymbol

define AnyChar = #(o)
  let {data, index} = o
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
  let {mutable decimal, mutable scientific} = x
  if decimal == NOTHING
    decimal := ""
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
    let {integer, mutable decimal} = x
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
        for i in 0 til radix max 10
          chars[i + C("0")] := true
        for i in 10 til radix max 36
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
          if decimal-num is NaN
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
  let ESCAPED_CHARACTERS =
    [C "b"]: C "\b"
    [C "f"]: C "\f"
    [C "r"]: C "\r"
    [C "n"]: C "\n"
    [C "t"]: C "\t"
    [C "v"]: C "\v"
    [C "0"]: -1 // to be non-falsy
    [C "1"]: 1
    [C "2"]: 2
    [C "3"]: 3
    [C "4"]: 4
    [C "5"]: 5
    [C "6"]: 6
    [C "7"]: 7
  
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

define DoubleStringLiteralInner = zero-or-more-of! [
  mutate! BackslashEscapeSequence
  StringInterpolation
  any-except! [
    DoubleQuote
    Newline
  ]
]

let double-string-literal-handler = #(x, o, i)
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
  string-parts

define DoubleStringLiteral = short-circuit! DoubleQuote, sequential! [
  DoubleQuote
  [\this, DoubleStringLiteralInner]
  DoubleQuote
], #(x, o, i)
  let string-parts = double-string-literal-handler x, o, i
  
  if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and string-parts[0].is-const() and typeof string-parts[0].const-value() == "string"
    string-parts[0]
  else
    o.string i, string-parts

define PercentSignDoubleQuote = sequential! [PercentSign, DoubleQuote]
define DoubleStringArrayLiteral = short-circuit! PercentSignDoubleQuote, sequential! [
  PercentSignDoubleQuote
  [\this, DoubleStringLiteralInner]
  DoubleQuote
], #(x, o, i)
  let string-parts = double-string-literal-handler x, o, i
  
  o.array i, string-parts

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

let triple-string-handler(x, o, i)
  let lines = [x.first]
  if lines[0].length == 0 or (lines[0].length == 1 and lines[0][0] == "")
    lines.shift()
  for j in 1 til x.empty-lines.length
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
  
  for j in string-parts.length - 2 to 0 by -1
    if typeof string-parts[j] == \string and typeof string-parts[j + 1] == \string
      string-parts.splice(j, 2, string-parts[j] ~& string-parts[j + 1])
  
  for part, j in string-parts
    if typeof part == \string
      string-parts[j] := o.const i, part
  
  string-parts

let make-triple-string(quote, line)
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
    let string-parts = triple-string-handler x, o, i
    
    if string-parts.length == 0
      o.const i, ""
    else if string-parts.length == 1 and string-parts[0].is-const() and typeof string-parts[0].const-value() == \string
      string-parts[0]
    else
      o.string i, string-parts
define TripleSingleStringLiteral = make-triple-string TripleSingleQuote, TripleSingleStringLine
define TripleDoubleStringLiteral = make-triple-string TripleDoubleQuote, TripleDoubleStringLine
define PercentSignTripleDoubleQuote = sequential! [PercentSign, TripleDoubleQuote]
define TripleDoubleStringArrayLiteral = short-circuit! PercentSignTripleDoubleQuote, sequential! [
  PercentSignTripleDoubleQuote
  [\first, TripleDoubleStringLine]
  [\empty-lines, zero-or-more! sequential! [
    _Space
    [\this, Newline]
  ]]
  [\rest, maybe! (sequential! [
    MaybeAdvance
    [\this, maybe! (sequential! [
      StringIndent
      [\head, TripleDoubleStringLine]
      [\tail, zero-or-more! sequential! [
        Newline
        StringIndent
        [\this, TripleDoubleStringLine]
      ]]
    ], #(x) -> [x.head, ...x.tail]), #-> []]
    maybe! Newline, true
    PopIndent
  ]), #-> []]
  TripleDoubleQuote
], #(x, o, i)
  let string-parts = triple-string-handler x, o, i
  
  o.array i, string-parts

define LowerR = character! "r"
define RegexTripleSingleToken = sequential! [LowerR, TripleSingleQuote]
define RegexTripleDoubleToken = sequential! [LowerR, TripleDoubleQuote]
define RegexSingleToken = sequential! [LowerR, SingleQuote]
define RegexDoubleToken = sequential! [LowerR, DoubleQuote]
define RegexFlags = maybe! NamePart, #-> []
define RegexComment = sequential! [
  HashSign
  zero-or-more! any-except! Newline
], NOTHING
define RegexLiteral = one-of! [
  short-circuit! RegexTripleDoubleToken, sequential! [
    RegexTripleDoubleToken
    [\text, zero-or-more-of! [
      sequential! [
        Backslash
        DollarSign
      ], C('$')
      mutate! SpaceChar, NOTHING
      mutate! Newline, NOTHING
      RegexComment
      StringInterpolation
      any-except! TripleDoubleQuote
    ]]
    TripleDoubleQuote
    [\flags, RegexFlags]
  ]
  short-circuit! RegexTripleDoubleToken, sequential! [
    RegexTripleSingleToken
    [\text, zero-or-more-of! [
      mutate! SpaceChar, NOTHING
      mutate! Newline, NOTHING
      RegexComment
      any-except! TripleSingleQuote
    ]]
    TripleSingleQuote
    [\flags, RegexFlags]
  ]
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
    else if part != NOTHING and part not instanceof NothingNode
      if current-literal.length > 0
        string-parts.push o.const i, process-char-codes(current-literal).join ""
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push o.const i, process-char-codes(current-literal).join ""

  let flags = process-char-codes(x.flags).join ""

  let text = if string-parts.length == 0
    o.const i, ""
  else if string-parts.length == 1 and string-parts[0].is-const() and typeof string-parts[0].const-value() == \string
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
  TripleDoubleStringArrayLiteral
  SingleStringLiteral
  DoubleStringLiteral
  DoubleStringArrayLiteral
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
  let {index} = o
  let result = Name o
  if result
    o.const index, result
  else
    false

define IdentifierNameConstOrNumberLiteral = one-of! [IdentifierNameConst, NumberLiteral]

let RESERVED_IDENTS = [
  \as
  \AST
  \arguments
  \break
  \case
  \catch
  \class
  \const
  \continue
  \debugger
  \default
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
  \if
  \import
  \Infinity
  \instanceof
  \in
  \let
  \macro
  \mutable
  \NaN
  \new
  \not
  \null
  \package
  \private
  \protected
  \public
  \return
  \static
  \super
  \switch
  \then
  \this
  \throw
  \true
  \try
  \typeof
  \undefined
  \var
  \void
  \while
  \with
  \yield
]
define Identifier = #(o)
  let {index} = o
  let clone = o.clone()
  let result = Name clone
  if not result or result in RESERVED_IDENTS or o.macros.has-macro-or-operator result
    o.fail "identifier"
    false
  else
    o.update clone
    o.ident index, result

define NotToken = word \not
define MaybeNotToken = maybe! NotToken, true

define ExistentialSymbol = mutate! (character! "?"), "?"
define MaybeExistentialSymbol = maybe! ExistentialSymbol, true
define ExistentialSymbolNoSpace = sequential! [
  NoSpace
  [\this, ExistentialSymbol]
]

define CustomOperatorCloseParenthesis = do
  let handle-unary-operator(operator, o, i, line)
    let clone = o.clone(o.clone-scope())
    let op = operator.rule clone
    if op and CloseParenthesis(clone)
      o.update clone
      let node = clone.ident i, \x
      clone.scope.add node, false
      o.function(i
        [clone.param i, node]
        operator.func {
          op
          node
        }, clone, i, line
        true
        false)
  #(o)
    let i = o.index
    let line = o.line
    for operators in o.macros.binary-operators
      if operators
        for operator in operators
          let clone = o.clone(o.clone-scope())
          let mutable inverted = false
          if operator.invertible
            inverted := MaybeNotToken clone
            if not inverted
              continue
          let op = operator.rule clone
          if op and CloseParenthesis(clone)
            let left = o.ident i, \x
            let right = o.ident i, \y
            clone.scope.add left, false
            clone.scope.add right, false
            let result = o.function(i
              [
                clone.param i, left
                clone.param i, right
              ]
              operator.func {
                left
                inverted: inverted == "not"
                op
                right
              }, clone, i, line
              true
              false)
            o.update clone
            return result
    for operator in o.macros.prefix-unary-operators
      return? handle-unary-operator operator, o, i, line
    for operator in o.macros.postfix-unary-operators
      return? handle-unary-operator operator, o, i, line
    false

define CustomBinaryOperator = #(o)
  let i = o.index
  for operators in o.macros.binary-operators
    if operators
      for operator in operators
        let clone = o.clone()
        let mutable inverted = false
        if operator.invertible
          inverted := MaybeNotToken clone
          if not inverted
            continue
        let op = operator.rule clone
        if op
          o.update clone
          return {
            op
            operator
            inverted: inverted == "not"
          }
  false

define Parenthetical = sequential! [
  OpenParenthesis
  [\this, one-of! [
    sequential! [
      [\this, AssignmentAsExpression]
      CloseParenthesis
    ]
    sequential! [
      [\left, Expression]
      [\operator, CustomBinaryOperator]
      CloseParenthesis
    ], #({left, operator: {op, operator, inverted}}, o, i, line)
      let clone = o.clone(o.clone-scope())
      let right = o.tmp i, get-tmp-id(), \x
      clone.scope.add right, false
      return o.function(i
        [clone.param i, right]
        operator.func {
          left: left.rescope(clone.scope.id, clone)
          inverted
          op
          right
        }, clone, i, line
        true
        false)
    sequential! [
      [\this, Expression]
      CloseParenthesis
    ]
    sequential! [
      [\operator, CustomBinaryOperator]
      [\right, Expression]
      CloseParenthesis
    ], #({right, operator: {op, operator, inverted}}, o, i, line)
      let clone = o.clone(o.clone-scope())
      let left = o.tmp i, get-tmp-id(), \x
      clone.scope.add left, false
      return o.function(i
        [clone.param i, left]
        operator.func {
          left
          inverted
          op
          right: right.rescope(clone.scope.id, clone)
        }, clone, i, line
        true
        false)
    CustomOperatorCloseParenthesis
  ]]
], #(node, o, i) -> node

define SpreadToken = sequential! [Space, Period, Period, Period], "..."
define MaybeSpreadToken = maybe! SpreadToken, true

define SpreadOrExpression = sequential! [
  [\spread, MaybeSpreadToken]
  [\node, Expression]
], #(x, o, i)
  if x.spread == "..."
    o.spread i, x.node.do-wrap(o)
  else
    x.node

define ArrayLiteral = prevent-unclosed-object-literal sequential! [
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

define BracketedObjectKey = sequential! [
  OpenSquareBracket
  [\this, ExpressionOrAssignment]
  CloseSquareBracket
]

define ObjectKey = one-of! [
  BracketedObjectKey
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

define ObjectKeyColon = with-message! 'key ":"', sequential! [
  [\this, ObjectKey]
  Colon
  except! character! "="
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
    let {mutable parent} = x
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
    let {child} = x
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
    let {child} = x
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
    let key = if node.is-const() and typeof node.const-value()
      o.const i, String(node.const-value())
    else
      node
    { key, value: node }
  sequential! [
    [\this, ThisLiteral]
    NotColon
  ], #(node, o, i)
    key: o.const i, \this
    value: node
  sequential! [
    [\this, ArgumentsLiteral]
    NotColon
  ], #(node, o, i)
    key: o.const i, \arguments
    value: node
  sequential! [
    [\this, BracketedObjectKey]
    NotColon
  ], #(node) -> { key: node, value: node }
]

define KeyValuePair = one-of! [
  DualObjectKey
  sequential! [
    Space
    [\bool, maybe! PlusOrMinus, NOTHING]
    [\pair, SingularObjectKey]
  ], #(x, o, i)
    if x.bool != NOTHING
      { x.pair.key, value: o.const(i, x.bool == C("+")) }
    else
      x.pair
]

define ExtendsToken = word \extends
define ObjectLiteral = sequential! [
  OpenCurlyBrace
  Space
  [\prototype, maybe! (sequential! [
    ExtendsToken
    [\this, prevent-unclosed-object-literal #(o) -> Logic o]
    Space
    one-of! [
      Comma
      check! Newline
      check! CloseCurlyBrace
    ]
  ]), NOTHING]
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
  o.object i, [...x.first, ...x.rest], if x.prototype != NOTHING then x.prototype

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

define ArrayType = sequential! [
  OpenSquareBracket
  [\this, TypeReference]
  CloseSquareBracket
], #(x, o, i) -> o.type-array i, x

let _in-function-type-params = Stack false
let in-function-type-params = make-alter-stack _in-function-type-params, true
let not-in-function-type-params = make-alter-stack _in-function-type-params, false
define FunctionType = sequential! [
  #(o) -> not _in-function-type-params.peek()
  one-of! [
    sequential! [
      OpenParenthesis
      TypeReference
      zero-or-more! sequential! [
        CommaOrNewline
        TypeReference
      ]
      CloseParenthesis
    ]
    in-function-type-params #(o) -> TypeReference o
    Nothing
  ]
  symbol "->"
  [\this, maybe! TypeReference, NOTHING]
], #(x, o, i)
  if x == NOTHING
    o.ident i, \Function
  else
    o.type-function i, x

define NonUnionType = one-of! [
  FunctionType
  sequential! [
    OpenParenthesis
    [\this, not-in-function-type-params #(o) -> TypeReference o]
    CloseParenthesis
  ]
  ArrayType
  IdentifierOrSimpleAccess
  VoidLiteral
  NullLiteral
]

define TypeReference = sequential! [
  [\head, NonUnionType]
  [\tail, zero-or-more! sequential! [
    Pipe
    [\this, NonUnionType]
  ]]
], #(x, o, i)
  let types = [x.head, ...x.tail]
  if types.length == 1
    types[0]
  else
    for j in types.length - 1 to 0
      let type = types[j]
      if type instanceof TypeUnionNode
        types[j:j + 1] := type.types
    if types.length == 1
      types[0]
    else
      o.type-union i, types

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
  [\key, ObjectKeyColon]
  [\value, Parameter]
]

define ParamSingularObjectKey = sequential! [
  [\this, IdentifierParameter]
  NotColon
], #(param, o, i)
  let {ident} = param
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
], do
  let check(names, param, o, i)!
    if param instanceof ParamNode
      let name = if param.ident instanceof IdentNode
        param.ident.name
      else if param.ident instanceof AccessNode
        if param.ident.child not instanceof ConstNode or typeof param.ident.child.value != \string
          throw Error "Expected constant access: $(typeof! param.ident.child)"
        param.ident.child.value
      else
        throw Error "Unknown param ident: $(typeof! param.ident)"
      if name in names
        o.error "Duplicate parameter name: $(name)"
      names.push name
    else if param instanceof ArrayNode
      for element in param.elements
        check(names, element, o, i)
    else if param instanceof ObjectNode
      for pair in param.pairs
        check(names, pair.value, o, i)
    else
      throw Error "Unknown param node: $(typeof! param)"
  #(x, o, i)
    let names = []
    for param in x
      check(names, param, o, i)
    x

define _FunctionBody = one-of! [
  sequential! [
    symbol "->"
    [\this, maybe! Statement, #(x, o, i) -> o.nothing i]
  ]
  Body
]

let add-param-to-scope(o, param)!
  if param instanceof ParamNode
    if param.ident instanceofsome [IdentNode, TmpNode]
      o.scope.add param.ident, param.is-mutable, param.as-type or (if param.spread then o.ident(param.start-index, \Array))
    else if param.ident instanceof AccessNode
      if param.ident.child not instanceof ConstNode or typeof param.ident.child.value != \string
        throw Error "Expected constant access: $(typeof! param.ident.child)"
      o.scope.add o.ident(param.start-index, param.ident.child.value), param.is-mutable, param.as-type or (if param.spread then o.ident(param.start-index, \Array))
    else
      throw Error "Unknown param ident: $(typeof! param.ident)"
  else if param instanceof ArrayNode
    for element in param.elements
      add-param-to-scope o, element
  else if param instanceof ObjectNode
    for pair in param.pairs
      add-param-to-scope o, pair.value
  else
    throw Error "Unknown param node type: $(typeof! param)"

let _in-generator = Stack false
define FunctionBody = make-alter-stack(_in-generator, false)(_FunctionBody)
define GeneratorFunctionBody = make-alter-stack(_in-generator, true)(_FunctionBody)
define FunctionDeclaration = do
  let params-rule = maybe! ParameterSequence, #-> []
  let rest-rule = sequential! [
    [\as-type, in-function-type-params MaybeAsType]
    [\auto-return, maybe! character!("!"), NOTHING]
    [\bound, maybe! AtSign, NOTHING]
    [\generator-body, #(o)
      let generator = not not Asterix(o)
      let body = if generator
        GeneratorFunctionBody(o)
      else
        FunctionBody(o)
      body and { generator, body}]
  ]
  #(o)
    let index = o.index
    let clone = o.clone(o.clone-scope())
    let params = params-rule clone
    if not params
      return false
    for param in params
      add-param-to-scope clone, param
    let rest = rest-rule clone
    if not rest
      return false
    let {as-type, auto-return, bound, generator-body: {generator, body}} = rest
    if auto-return != NOTHING and generator
      o.error "A function cannot be both non-returning and a generator"
    o.update clone
    o.function index, params, body, auto-return == NOTHING, bound != NOTHING, if as-type != NOTHING then as-type, generator

define FunctionLiteral = short-circuit! HashSign, sequential! [
  HashSign
  [\this, FunctionDeclaration]
]

define AssignmentAsExpression = in-expression #(o) -> Assignment(o)

define ExpressionOrAssignment = oneOf! [
  AssignmentAsExpression
  Expression
]

define AstToken = word \AST
define AstExpressionToken = word \ASTE
define AstExpression = short-circuit! AstExpressionToken, sequential! [
  #(o)
    if not _in-macro.peek()
      o.error "Can only use AST inside a macro"
    else if _in-ast.peek()
      o.error "Cannot use AST inside an AST"
    else
      true
  AstExpressionToken
  [\this, in-ast ExpressionOrAssignment]
]
define AstStatement = short-circuit! AstToken, sequential! [
  #(o)
    if not _in-macro.peek()
      o.error "Can only use AST inside a macro"
    else if _in-ast.peek()
      o.error "Cannot use AST inside an AST"
    else
      true
  AstToken
  [\this, in-ast BodyOrStatementOrNothing]
]
define Ast = oneOf! [
  AstExpression
  AstStatement
], #(x, o, i) -> MacroHelper.constify-object x, i, o.index, o.scope.id

define MacroName = with-message! 'macro-name', with-space! sequential! [
  [\this, one-or-more-of! [
    _Symbol
    _Name
  ], #(x) -> x.join ""]
  NotColon
]

define MacroNames = sequential! [
  [\head, MacroName]
  [\tail, zero-or-more! sequential! [
    Comma
    [\this, MacroName]
  ]]
], #(x, o, i) -> [x.head, ...x.tail]

define UseMacro = #(o)
  let clone = o.clone()
  let {macros} = clone
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

define MacroOptions = maybe! (sequential! [
  word \with
  [\this, UnclosedObjectLiteral]
], #(x)
  let options = {}
  for {key, value} in x.pairs
    unless key.is-const()
      o.error "Cannot have non-const keys in the options"
    unless value.is-const()
      o.error "Cannot have non-const value in the options"
    options[key.const-value()] := value.const-value()
  options), #-> {}

define MacroSyntax = sequential! [
  CheckIndent
  [\this, short-circuit! SyntaxToken, sequential! [
    SyntaxToken
    [\this, #(o)
      let i = o.index
      let params = MacroSyntaxParameters o
      if not params
        throw SHORT_CIRCUIT
      let options = MacroOptions o
      o.start-macro-syntax i, params, options
      let body = FunctionBody o
      if not body
        throw SHORT_CIRCUIT
      o.macro-syntax i, \syntax, params, options, body
      true]]]
  Space
  CheckStop
]

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
    [\options, MacroOptions]
    [\body, FunctionBody]
  ], #(x, o, i)
    o.macro-syntax i, \call, x.params, x.options, x.body
    true
]

define MacroToken = word \macro
define Macro = in-macro short-circuit! MacroToken, sequential! [
  MacroToken
  named "(identifier MacroBody)", #(o)
    let names = MacroNames o
    if names
      o.enter-macro names, #
        MacroBody o
    else
      false
], #(x, o, i) -> o.nothing i

define DefineSyntaxStart = sequential! [word(\define), word(\syntax)]
define DefineSyntax = short-circuit! DefineSyntaxStart, sequential! [
  DefineSyntaxStart
  [\name, Identifier]
  DeclareEqualSymbol
  [\value, MacroSyntaxParameters]
  [\body, maybe! FunctionBody, NOTHING]
], #(x, o, i) -> o.define-syntax i, x.name.name, x.value, if x.body != NOTHING then x.body

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
  [\options, MacroOptions]
  [\body, FunctionBody]
], #(x, o, i)
  let ops = [x.head, ...x.tail]
  switch x.type
  case \binary; o.define-binary-operator i, ops, x.options, x.body
  case \assign; o.define-assign-operator i, ops, x.options, x.body
  case \unary; o.define-unary-operator i, ops, x.options, x.body
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
], #(x)
  type: \slice
  left: if x instanceof NothingNode then null else x.left
  right: if x instanceof NothingNode then null else x.right

define IndexMultiple = sequential! [
  [\head, Expression]
  [\tail, zero-or-more! sequential! [
    CommaOrNewline
    [\this, Expression]
  ]]
], #(x)
  if x.tail.length > 0
    type: \multi
    elements: [x.head, ...x.tail]
  else
    type: \single
    node: x.head

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
    let {mutable parent} = x
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

define DirectAssignment = sequential! [
  [\left, ComplexAssignable]
  ColonEqual
  [\right, ExpressionOrAssignment]
], #(x, o, i) -> o.assign i, x.left, "=", x.right.do-wrap(o)

define CustomAssignment = #(o)
  let start-index = o.index
  let line = o.line
  let clone = o.clone()
  let left = SimpleAssignable clone
  if left
    for operator in o.macros.assign-operators
      let sub-clone = clone.clone()
      let {rule} = operator
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
      }, o, start-index, line
  false

define Assignment = one-of! [
  DirectAssignment
  CustomAssignment
]

define PrimaryExpression = one-of! [
  UnclosedObjectLiteral
  Literal
  ArrayLiteral
  ObjectLiteral
  Ast
  Parenthetical
  FunctionLiteral
  UseMacro
  Identifier
  IndentedUnclosedObjectLiteral
  IndentedUnclosedArrayLiteral
]

define UnclosedObjectLiteral = sequential! [
  #(o) -> not _indexSlice.peek()
  [\head, DualObjectKey]
  [\tail, zero-or-more! sequential! [
    Comma
    [\this, DualObjectKey]
  ]]
], #(x, o, i) -> o.object i, [x.head, ...x.tail]

define IndentedUnclosedObjectLiteralInner = sequential! [
  [\head, DualObjectKey]
  [\tail, zero-or-more! sequential! [
    CommaOrNewlineWithCheckIndent
    [\this, DualObjectKey]
  ]]
], #(x, o, i) -> o.object i, [x.head, ...x.tail]

define IndentedUnclosedObjectLiteral = sequential! [
  #(o) -> not _prevent-unclosed-object-literal.peek()
  Space
  Newline
  EmptyLines
  Advance
  CheckIndent
  [\this, IndentedUnclosedObjectLiteralInner]
  PopIndent
]

define UnclosedArrayLiteralElement = sequential! [
  Asterix
  Space
  [\this, one-of! [
    sequential! [
      PushFakeIndent(2)
      [\this, one-of! [
        IndentedUnclosedObjectLiteralInner
        IndentedUnclosedArrayLiteralInner
        SpreadOrExpression
      ]]
      PopIndent
    ]
    SpreadOrExpression
  ]]
]
define IndentedUnclosedArrayLiteralInner = sequential! [
  [\head, UnclosedArrayLiteralElement]
  [\tail, zero-or-more! sequential! [
    MaybeComma
    SomeEmptyLinesWithCheckIndent
    [\this, UnclosedArrayLiteralElement]
  ]]
], #(x, o, i) -> o.array i, [x.head, ...x.tail]
define IndentedUnclosedArrayLiteral = sequential! [
  #(o) -> not _prevent-unclosed-object-literal.peek()
  Space
  Newline
  EmptyLines
  Advance
  CheckIndent
  [\this, IndentedUnclosedArrayLiteralInner]
  PopIndent
]

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

define UnclosedArguments = sequential! [
  one-of! [
    SomeSpace
    CheckStop
  ]
  [\first, sequential! [
    [\head, SpreadOrExpression],
    [\tail, zero-or-more! sequential! [
      Comma
      [\this, SpreadOrExpression]
    ]]
  ], #(x) -> [x.head, ...x.tail]]
  [\rest, one-of! [
    sequential! [
      Comma
      SomeEmptyLines
      Advance
      CheckIndent
      [\head, SpreadOrExpression]
      [\tail, zero-or-more! sequential! [
        CommaOrNewlineWithCheckIndent
        [\this, SpreadOrExpression]
      ]]
      MaybeComma
      PopIndent
    ], #(x) -> [x.head, ...x.tail]
    mutate! MaybeComma, #-> []
  ]]
], #(x, o, i) -> [...x.first, ...x.rest]

define InvocationArguments = one-of! [ClosedArguments, UnclosedArguments]

define MaybeExclamationPointNoSpace = maybe! (sequential! [
  NoSpace
  character! "!"
], "!"), true
define MaybeExistentialSymbolNoSpace = maybe! ExistentialSymbolNoSpace, true
define BasicInvocationOrAccess = sequential! [
  [\is-new, maybe! word(\new), NOTHING]
  [\head, one-of! [
    sequential! [
      [\node, ThisShorthandLiteral]
      [\existential, MaybeExistentialSymbolNoSpace]
      [\owns, MaybeExclamationPointNoSpace]
      [\bind, maybe! AtSign, NOTHING]
      [\child, IdentifierNameConstOrNumberLiteral]
    ], #(x, o, i) -> {
      type: \this-access
      x.node
      x.child
      existential: x.existential == "?"
      owns: x.owns == "!"
      bind: x.bind != NOTHING
    }
    mutate! PrimaryExpression, #(x) -> {
      type: \normal
      node: x
    }
  ]]
  [\tail, zero-or-more-of! [
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      [\owns, MaybeExclamationPointNoSpace]
      [\bind, maybe! AtSign, NOTHING]
      EmptyLines
      Space
      [\type, one-of! [Period, DoubleColon]]
      [\child, IdentifierNameConstOrNumberLiteral]
    ], #(x) -> {
      type: if x.type == "::" then \proto-access else \access
      x.child
      existential: x.existential == "?"
      owns: x.owns == "!"
      bind: x.bind != NOTHING
    }
    sequential! [
      [\existential, MaybeExistentialSymbolNoSpace]
      [\owns, MaybeExclamationPointNoSpace]
      [\bind, maybe! AtSign, NOTHING]
      [\type, maybe! DoubleColon, \access-index, \proto-access-index]
      OpenSquareBracketChar
      [\child, Index]
      CloseSquareBracket
    ], #(x, o, i)
      if x.child.type == \single
        {
          type: if x.type == \access-index then \access else \proto-access
          child: x.child.node
          existential: x.existential == "?"
          owns: x.owns == "!"
          bind: x.bind != NOTHING
        }
      else
        if x.owns == "!"
          o.error "Cannot use ! when using a multiple or slicing index"
        if x.bind != NOTHING
          o.error "Cannot use @ when using a multiple or slicing index"
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
      -is-new
      is-apply: x.is-apply != NOTHING
    }
  ]]
], do
  let link-types =
    access: do
      let index-types =
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
            let tmp = o.tmp(i, get-tmp-id(), \ref, parent.type(o))
            tmp-ids.push tmp.id
            set-parent := o.assign(i, tmp, "=", parent.do-wrap(o))
            parent := tmp
          let result = o.array(i, for element, j in child.elements
            o.access(i, if j == 0 then set-parent else parent, element))
          if tmp-ids.length
            o.tmp-wrapper(i, result, tmp-ids)
          else
            result
      #(o, i, mutable head, link, j, links)
        let bind-access = if link.bind
          #(parent, child) -> o.call i, o.ident(i, \__bind), [parent, child]
        else
          #(parent, child) -> o.access i, parent, child
        if link.owns
          let tmp-ids = []
          let mutable set-head = head
          if head.cacheable
            let tmp = o.tmp(i, get-tmp-id(), \ref, head.type(o))
            tmp-ids.push tmp.id
            set-head := o.assign(i, tmp, "=", head.do-wrap(o))
            head := tmp
          let mutable child = link.child
          let mutable set-child = child
          if child.cacheable
            let tmp = o.tmp(i, get-tmp-id(), \ref, child.type(o))
            tmp-ids.push tmp.id
            set-child := o.assign(i, tmp, "=", child.do-wrap(o))
            child := tmp
          let mutable test = o.call(i, o.ident(i, \__owns), [set-head, set-child])
          
          let result = o.if(i
            if link.existential
              let existential-op = o.macros.get-by-label(\existential)
              if not existential-op
                throw Error "Cannot use existential access until the existential operator has been defined"
              
              o.binary(i
                existential-op.func {
                  op: ""
                  node: set-head
                }, o, i, o.line
                "&&"
                o.call(i, o.ident(i, \__owns), [head, set-child]))
            else
              o.call(i, o.ident(i, \__owns), [set-head, set-child])
            convert-call-chain(o, i, bind-access(head, child), j + 1, links))
          if tmp-ids.length
            o.tmp-wrapper(i, result, tmp-ids)
          else
            result
        else
          let make-access = switch link.type
          case \access
            #(parent) -> bind-access parent, link.child
          case \access-index
            unless index-types ownskey link.child.type
              throw Error "Unknown index type: $(link.child.type)"
            index-types[link.child.type](o, i, link.child)
          default
            throw Error "Unknown link type: $(link.type)"
          if link.existential
            let tmp-ids = []
            let mutable set-head = head
            if head.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref, head.type(o))
              tmp-ids.push tmp.id
              set-head := o.assign(i, tmp, "=", head.do-wrap(o))
              head := tmp
            let existential-op = o.macros.get-by-label(\existential)
            if not existential-op
              throw Error "Cannot use existential access until the existential operator has been defined"
            let result = o.if(i
              existential-op.func {
                op: ""
                node: set-head
              }, o, i, o.line
              convert-call-chain(o, i, make-access(head), j + 1, links))
            if tmp-ids.length
              o.tmp-wrapper(i, result, tmp-ids)
            else
              result
          else
            convert-call-chain(o, i, make-access(head), j + 1, links)
    call: do
      #(o, i, mutable head, link, j, links)
        unless link.existential
          convert-call-chain(o, i, o.call(i, head, link.args, link.is-new, link.is-apply), j + 1, links)
        else
          let tmp-ids = []
          let mutable set-head = head
          if head instanceof AccessNode and not link.is-apply and not link.is-new
            let {mutable parent, mutable child} = head
            let mutable set-parent = parent
            let mutable set-child = child
            if parent.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref, parent.type(o))
              tmp-ids.push tmp.id
              set-parent := o.assign(i, tmp, "=", parent.do-wrap(o))
              parent := tmp
            if child.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref, child.type(o))
              tmp-ids.push tmp.id
              set-child := o.assign(i, tmp, "=", child.do-wrap(o))
              child := tmp
            if parent != set-parent or child != set-child
              set-head := o.access(i, set-parent, set-child)
              head := o.access(i, parent, child)
          else
            if head.cacheable
              let tmp = o.tmp(i, get-tmp-id(), \ref, head.type(o))
              tmp-ids.push tmp.id
              set-head := o.assign(i, tmp, "=", head.do-wrap(o))
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
    let {head, tail} = x
  
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
      links.push { type: \call, args: [], -existential, +is-new, -is-apply }
    
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
  #(o)
    if _in-ast.peek()
      let i = o.index
      let clone = o.clone()
      Space(clone)
      if not DollarSign clone
        return false
      _in-ast.push false
      try
        let args = InvocationArguments clone
        if not args
          return false
        
        o.update(clone)
        o.call(i, o.ident(i, \$), args)
      finally
        _in-ast.pop()
  BasicInvocationOrAccess
  SuperInvocation
  Eval
]

define CustomPostfixUnary = #(o)
  let start-index = o.index
  let line = o.line
  let node = InvocationOrAccess o
  if not node
    false
  else
    for operator in o.macros.postfix-unary-operators
      let clone = o.clone()
      let {rule} = operator
      let op = rule clone
      if not op
        continue
      o.update clone
      return operator.func {
        op
        node
      }, o, start-index, line
    node

define CustomPrefixUnary = #(o)
  let start-index = o.index
  let line = o.line
  for operator in o.macros.prefix-unary-operators
    let clone = o.clone()
    let {rule} = operator
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
    }, o, start-index, line
  CustomPostfixUnary o

let get-use-custom-binary-operator = do
  let precedence-cache = []
  #(precedence) -> precedence-cache[precedence] ?= cache #(o)
    let start-index = o.index
    let line = o.line
    let {binary-operators} = o.macros
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
            let {rule} = operator
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
                  }, o, start-index, line
                return current
              else
                let mutable current = tail[tail.length - 1].node
                for j in tail.length - 1 til 0 by -1
                  current := operator.func {
                    left: tail[j - 1].node
                    tail[j].inverted
                    tail[j].op
                    right: current
                  }, o, start-index, line
                return operator.func {
                  left: head
                  tail[0].inverted
                  tail[0].op
                  right: current
                }, o, start-index, line
        head

let Logic = named("Logic", get-use-custom-binary-operator(0))
define ExpressionAsStatement = one-of! [
  UseMacro
  Logic
]
define Expression = in-expression ExpressionAsStatement 

define Statement = sequential! [
  [\this, in-statement one-of! [
    Macro
    DefineHelper
    DefineOperator
    DefineSyntax
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

define Block = one-of! [
  sequential! [
    CheckIndent
    [\this, IndentedUnclosedObjectLiteralInner]
  ]
  sequential! [
    CheckIndent
    [\this, IndentedUnclosedArrayLiteralInner]
  ]
  sequential! [
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
]

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
  def constructor(message as String, text as String, index as Number, line as Number)@
    let err = super("$message at line #$line")
    @message := err.message
    if typeof Error.capture-stack-trace == \function
      Error.capture-stack-trace this, ParserError
    else if err haskey \stack
      @stack := err.stack
    @text := text
    @index := index
    @line := line
  def name = @name

class MacroError extends Error
  def constructor(inner as Error, text as String, index as Number, line as Number)@
    let inner-type = typeof! inner
    let err = super("$(if inner-type == \Error then '' else inner-type & ': ')$(String inner?.message) at line #$line")
    @message := err.message
    if inner haskey \stack and typeof inner.stack == \string
      @stack := "MacroError: " & inner.stack
    else if typeof Error.capture-stack-trace == \function
      Error.capture-stack-trace this, MacroError
    else if err haskey \stack
      @stack := err.stack
    @inner := inner
    @text := text
    @index := index
    @line := line
  def name = @name

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
    @index := 0
    @line := 0
  
  def add(message, index, line)!
    if index > @index
      @messages := []
      @index := index
    @line max= line
    if index >= @index
      @messages.push message

class MacroHelper
  def constructor(state as State, index, position, in-generator)@
    @unsaved-tmps := []
    @saved-tmps := []
    @state := state
    @index := index
    @position := position
    @in-generator := in-generator
  
  def do-wrap(node)
    if node instanceof Node
      node.do-wrap(@state)
    else
      node
  
  def let(ident as TmpNode|IdentNode, is-mutable as Boolean)
    @state.scope.add(ident, is-mutable)
  
  def has-variable(ident as TmpNode|IdentNode)
    @state.scope.has(ident)
  
  def var(ident as IdentNode|TmpNode, is-mutable as Boolean, as-type as Node|void) -> @state.var @index, ident, is-mutable
  def def(key as Node = NothingNode(0, 0, @state.scope.id), value as Node|void) -> @state.def @index, key, @do-wrap(value)
  def noop() -> @state.nothing @index
  def block(nodes as [Node]) -> @state.block(@index, nodes).reduce(@state)
  def if(test as Node = NothingNode(0, 0, @state.scope.id), when-true as Node = NothingNode(0, 0, @state.scope.id), when-false as Node|null) -> @state.if(@index, @do-wrap(test), when-true, when-false).reduce(@state)
  def switch(node as Node = NothingNode(0, 0, @state.scope.id), cases as Array, default-case as Node|null) -> @state.switch(@index, @do-wrap(node), (for case_ in cases; {node: @do-wrap(case_.node), case_.body, case_.fallthrough}), default-case).reduce(@state)
  def for(init as Node|null, test as Node|null, step as Node|null, body as Node = NothingNode(0, 0, @state.scope.id)) -> @state.for(@index, @do-wrap(init), @do-wrap(test), @do-wrap(step), body).reduce(@state)
  def for-in(key as IdentNode, object as Node = NothingNode(0, 0), body as Node = NothingNode(0, 0, @state.scope.id)) -> @state.for-in(@index, key, @do-wrap(object), body).reduce(@state)
  def try-catch(try-body as Node = NothingNode(0, 0, @state.scope.id), catch-ident as Node = NothingNode(0, 0, @state.scope.id), catch-body as Node = NothingNode(0, 0, @state.scope.id)) -> @state.try-catch(@index, try-body, catch-ident, catch-body).reduce(@state)
  def try-finally(try-body as Node = NothingNode(0, 0, @state.scope.id), finally-body as Node = NothingNode(0, 0, @state.scope.id)) -> @state.try-finally(@index, try-body, finally-body).reduce(@state)
  def assign(left as Node = NothingNode(0, 0, @state.scope.id), op as String, right as Node = NothingNode(0, 0, @state.scope.id)) -> @state.assign(@index, left, op, @do-wrap(right)).reduce(@state)
  def binary(left as Node = NothingNode(0, 0, @state.scope.id), op as String, right as Node = NothingNode(0, 0, @state.scope.id)) -> @state.binary(@index, @do-wrap(left), op, @do-wrap(right)).reduce(@state)
  def unary(op as String, node as Node = NothingNode(0, 0, @state.scope.id)) -> @state.unary(@index, op, @do-wrap(node)).reduce(@state)
  def throw(node as Node = NothingNode(0, 0, @state.scope.id)) -> @state.throw(@index, @do-wrap(node)).reduce(@state)
  def return(node as Node|void) -> @state.return(@index, @do-wrap(node)).reduce(@state)
  def yield(node as Node = NothingNode(0, 0, @state.scope.id)) -> @state.yield(@index, @do-wrap(node)).reduce(@state)
  def debugger() -> @state.debugger(@index)
  def break() -> @state.break(@index)
  def continue() -> @state.continue(@index)
  
  def macro-expand-1(node)
    if node instanceof Node
      let expanded = @state.macro-expand-1(node)
      if expanded instanceof Node
        expanded.reduce(@state)
      else
        expanded
    else
      node
  
  def macro-expand-all(node)
    if node instanceof Node
      let expanded = @state.macro-expand-all(node)
      if expanded instanceof Node
        expanded.reduce(@state)
      else
        expanded
    else
      node
  
  def tmp(name as String = \ref, save as Boolean, mutable type)
    let id = get-tmp-id()
    (if save then @saved-tmps else @unsaved-tmps).push id
    if not type?
      type := Type.any
    else if typeof type == "string"
      if Type![type] not instanceof Type
        throw Error "$type is not a known type name"
      type := Type![type]
    else if type not instanceof Type
      throw Error "Must provide a Type or a string for type, got $(typeof! type)"
      
    @state.tmp @index, id, name, type
  
  def get-tmps()
    unsaved: @unsaved-tmps[:]
    saved: @saved-tmps[:]
  
  def is-const(node) -> node == void or (node instanceof Node and node.is-const())
  def value(node)
    if node == void
      void
    else if node instanceof Node and node.is-const()
      node.const-value()
  def const(value)
    @state.const @index, value
  
  def is-node(node) -> node instanceof Node
  def is-ident(node) -> @macro-expand-1(node) instanceof IdentNode
  def is-tmp(node) -> @macro-expand-1(node) instanceof TmpNode
  def name(mutable node)
    node := @macro-expand-1(node)
    if @is-ident node
      node.name
  def ident(name as String)
    if require('./ast').is-acceptable-ident(name)
      @state.ident @index, name
  
  def is-call(node) -> @macro-expand-1(node) instanceof CallNode
  
  def call-func(mutable node)
    node := @macro-expand-1(node)
    if node instanceof CallNode
      node.func
  
  def call-args(mutable node)
    node := @macro-expand-1(node)
    if node instanceof CallNode
      node.args
  
  def is-super(node) -> @macro-expand-1(node) instanceof SuperNode
  
  def super-child(mutable node)
    node := @macro-expand-1(node)
    if @is-super(node)
      node.child
  
  def super-args(mutable node)
    node := @macro-expand-1(node)
    if @is-super(node)
      node.args
  
  def call-is-new(mutable node)
    node := @macro-expand-1(node)
    if node instanceof CallNode
      not not node.is-new
    else
      false
  
  def call-is-apply(mutable node)
    node := @macro-expand-1(node)
    if node instanceof CallNode
      not not node.is-apply
    else
      false
  
  def call(func as Node, args as [Node] = [], is-new as Boolean = false, is-apply as Boolean = false)
    if is-new and is-apply
      throw Error "Cannot specify both is-new and is-apply"
    
    @state.call(func.start-index, @do-wrap(func), (for arg in args; @do-wrap(arg)), is-new, is-apply).reduce(@state)
  
  def func(mutable params, body, auto-return = true, bound = false)
    let clone = @state.clone(@state.clone-scope())
    params := for param in params
      let p = param.rescope(clone.scope.id, clone)
      add-param-to-scope clone, p
      p
    @state.function(0, params, body.rescope(clone.scope.id, clone), auto-return, bound).reduce(@state)
  
  def is-func(node) -> @macro-expand-1(node) instanceof FunctionNode
  def func-body(mutable node)
    node := @macro-expand-1 node
    if @is-func node then node.body
  def func-params(mutable node)
    node := @macro-expand-1 node
    if @is-func node then node.params
  def func-is-auto-return(mutable node)
    node := @macro-expand-1 node
    if @is-func node then not not node.auto-return
  def func-is-bound(mutable node)
    node := @macro-expand-1 node
    if @is-func node then not not node.bound
  
  def param(ident, default-value, spread, is-mutable, as-type)
    @state.param(0, ident, default-value, spread, is-mutable, as-type).reduce(@state)
  
  def is-param(node) -> @macro-expand-1(node) instanceof ParamNode
  def param-ident(mutable node)
    node := @macro-expand-1 node
    if @is-param node then node.ident
  def param-default-value(mutable node)
    node := @macro-expand-1 node
    if @is-param node then node.default-value
  def param-is-spread(mutable node)
    node := @macro-expand-1 node
    if @is-param node then not not node.spread
  def param-is-mutable(mutable node)
    node := @macro-expand-1 node
    if @is-param node then not not node.is-mutable
  def param-type(mutable node)
    node := @macro-expand-1 node
    if @is-param node then node.as-type
  
  def is-array(node) -> @macro-expand-1(node) instanceof ArrayNode
  def elements(mutable node)
    node := @macro-expand-1 node
    if @is-array node then node.elements
  
  def is-object(node) -> @macro-expand-1(node) instanceof ObjectNode
  def pairs(mutable node)
    node := @macro-expand-1 node
    if @is-object node then node.pairs
  
  def is-block(node) -> @macro-expand-1(node) instanceof BlockNode
  def nodes(mutable node)
    node := @macro-expand-1 node
    if @is-block node then node.nodes
  
  def array(elements as [Node])
    @state.array(0, (for element in elements; @do-wrap(element))).reduce(@state)
  def object(pairs as Array)
    for pair, i in pairs
      if not pair or typeof pair != \object
        throw Error "Expected an object at index #$i, got $(typeof! pair)"
      else if pair.key not instanceof Node
        throw Error "Expected an object with Node 'key' at index #$i, got $(typeof! pair.key)"
      else if pair.value not instanceof Node
        throw Error "Expected an object with Node 'value' at index #$i, got $(typeof! pair.value)"
    @state.object(0, (for {key, value} in pairs; {key: @do-wrap(key), value: @do-wrap(value)})).reduce(@state)
  
  def is-complex(mutable node)
    node := @macro-expand-1 node
    node? and node not instanceofsome [ConstNode, IdentNode, TmpNode, ThisNode, ArgsNode] and not (node instanceof BlockNode and node.nodes.length == 0)
  
  def is-type-array(node) -> @macro-expand-1(node) instanceof TypeArrayNode
  def subtype(mutable node)
    node := @macro-expand-1 node
    @is-type-array(node) and node.subtype
  
  def is-type-function(node) -> @macro-expand-1(node) instanceof TypeFunctionNode
  def return-type(mutable node)
    node := @macro-expand-1 node
    @is-type-function(node) and node.return-type
  
  def is-this(node) -> @macro-expand-1(node) instanceof ThisNode
  def is-arguments(mutable node)
    node := @macro-expand-1 node
    node instanceof ArgsNode
  
  def is-def(node) -> @macro-expand-1(node) instanceof DefNode
  def is-assign(node) -> @macro-expand-1(node) instanceof AssignNode
  def is-binary(node) -> @macro-expand-1(node) instanceof BinaryNode
  def is-unary(node) -> @macro-expand-1(node) instanceof UnaryNode
  def op(mutable node)
    node := @macro-expand-1 node
    if @is-assign(node) or @is-binary(node) or @is-unary(node)
      node.op
  def left(mutable node)
    node := @macro-expand-1 node
    if @is-def(node) or @is-let(node) or @is-binary(node)
      node.left
  def right(mutable node)
    node := @macro-expand-1 node
    if @is-def(node) or @is-let(node) or @is-binary(node)
      node.right
  def unary-node(mutable node)
    node := @macro-expand-1 node
    if @is-unary(node)
      node.node

  def is-access(node) -> @macro-expand-1(node) instanceof AccessNode
  def parent(mutable node)
    node := @macro-expand-1 node
    if node instanceof AccessNode
      node.parent
  def child(mutable node)
    node := @macro-expand-1 node
    if node instanceof AccessNode
      node.child
  
  def cache(node as Node, init, name as String = \ref, save as Boolean)
    @maybe-cache node, (#(set-node, node, cached)
      if cached
        init.push set-node
      node), name, save
  
  def maybe-cache(mutable node as Node, func, name as String = \ref, save as Boolean)
    node := @macro-expand-1(node)
    if @is-complex node
      let tmp = @tmp(name, save, node.type(@state))
      func @state.block(@index, [
        @state.var(@index, tmp, false)
        @state.assign(@index, tmp, "=", @do-wrap(node))
      ]), tmp, true
    else
      func node, node, false
  
  def maybe-cache-access(mutable node as Node, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    node := @macro-expand-1 node
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
  
  let constify-object(obj, start-index, end-index, scope-id)
    if not obj or typeof obj != \object or obj instanceof RegExp
      ConstNode start-index, end-index, scope-id, obj
    else if is-array! obj
      ArrayNode start-index, end-index, scope-id, for item in obj
        constify-object item, start-index, end-index, scope-id
    else if obj instanceof IdentNode and obj.name.length > 1 and C(obj.name, 0) == C('$')
      CallNode obj.start-index, obj.end-index, obj.scope-id,
        IdentNode obj.start-index, obj.end-index, obj.scope-id, \__wrap
        [
          IdentNode obj.start-index, obj.end-index, obj.scope-id, obj.name.substring 1
          ConstNode obj.start-index, obj.end-index, obj.scope-id, obj.scope-id
        ]
    else if obj instanceof CallNode and not obj.is-new and not obj.is-apply and obj.func instanceof IdentNode and obj.func.name == '$'
      if obj.args.length != 1 or obj.args[0] instanceof SpreadNode
        throw Error "Can only use \$() in an AST if it has one argument."
      CallNode obj.start-index, obj.end-index, obj.scope-id,
        IdentNode obj.start-index, obj.end-index, obj.scope-id, \__wrap
        [
          obj.args[0]
          ConstNode obj.start-index, obj.end-index, obj.scope-id, obj.scope-id
        ]
    else if obj instanceof Node
      if obj.constructor == Node
        throw Error "Cannot constify a raw node"
      
      CallNode obj.start-index, obj.end-index, obj.scope-id,
        IdentNode obj.start-index, obj.end-index, obj.scope-id, \__node
        [
          ConstNode obj.start-index, obj.end-index, obj.scope-id, obj.constructor.capped-name
          ConstNode obj.start-index, obj.end-index, obj.scope-id, obj.start-index
          ConstNode obj.start-index, obj.end-index, obj.scope-id, obj.end-index
          ...(for k in obj.constructor.arg-names
            constify-object obj[k], obj.start-index, obj.end-index, obj.scope-id)
        ]
    else
      ObjectNode start-index, end-index, scope-id, for k, v of obj
        key: ConstNode start-index, end-index, scope-id, k
        value: constify-object v, start-index, end-index, scope-id
  @constify-object := constify-object
  
  let walk(node, func)
    if not node or typeof node != \object or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to walk through: $(typeof! node)"
    if node not instanceof BlockNode
      return? func(node)
    node.walk(#(x) -> walk x, func)
  
  def wrap(value)
    if is-array! value
      BlockNode(0, 0, @state.scope.id, value).reduce(@state)
    else if value instanceof Node
      value
    else if not value?
      NothingNode(0, 0, @state.scope.id)
    else if value instanceof RegExp or typeof value in [\string, \boolean, \number]
      ConstNode(0, 0, @state.scope.id, value)
    else
      value//throw Error "Trying to wrap an unknown object: $(typeof! value)"
  
  def node(type, start-index, end-index, ...args)
    Node[type](start-index, end-index, @state.scope.id, ...args).reduce(@state)
  
  def walk(node as Node|void|null, func as Node -> Node)
    if node?
      walk node, func
    else
      node
  
  def has-func(node)
    let FOUND = {}
    let walker(x)
      if x instanceof FunctionNode
        throw FOUND
      else
        x.walk(walker)
    try
      walk @macro-expand-all(node), walker
    catch e
      if e != FOUND
        throw e
      return true
    false
  
  def is-statement(mutable node)
    node := @macro-expand-1 node // TODO: should this be macro-expand-all?
    node instanceof Node and node.is-statement()
  
  def is-type(node, name as String)
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@state).is-subset-of(type)
  
  def has-type(node, name as String)
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@state).overlaps(type) // TODO: should this be macro-expand-all?
  
  let mutators =
    Block: #(x, func)
      let {nodes} = x
      let len = nodes.length
      if len != 0
        let last-node = @mutate-last(nodes[len - 1], func)
        if last-node != nodes[len - 1]
          return BlockNode  x.start-index, x.end-index, x.scope-id, [...nodes[:len - 1], last-node]
      x
    If: #(x, func)
      let when-true = @mutate-last x.when-true, func
      let when-false = @mutate-last x.when-false, func
      if when-true != x.when-true or when-false != x.when-false
        IfNode x.start-index, x.end-index, x.scope-id, x.test, when-true, when-false
      else
        x
    TmpWrapper: #(x, func)
      let node = @mutate-last x.node, func
      if node != x.node
        TmpWrapperNode x.start-index, x.end-index, x.scope-id, node, x.tmps
      else
        x
    MacroAccess: #(x, func)
      @mutate-last @macro-expand-1(x), func
    Break: identity
    Continue: identity
    Nothing: identity
    Return: identity
    Debugger: identity
    Throw: identity
  def mutate-last(mutable node, func)
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

define AnyObjectLiteral = one-of! [
  UnclosedObjectLiteral
  ObjectLiteral
  IndentedUnclosedObjectLiteral
]

define AnyArrayLiteral = one-of! [
  ArrayLiteral
  IndentedUnclosedArrayLiteral
]

class MacroHolder
  def constructor()@
    @by-name := {}
    @by-id := []
    @by-label := {}
    @type-by-id := []
    @operator-names := {}
    @binary-operators := []
    @assign-operators := []
    @prefix-unary-operators := []
    @postfix-unary-operators := []
    @serialization := {}
    @syntaxes := {
      Logic: prevent-unclosed-object-literal Logic
      Expression
      Assignment
      ExpressionOrAssignment
      FunctionDeclaration
      Statement
      Body
      Identifier
      SimpleAssignable
      Parameter
      ObjectLiteral: AnyObjectLiteral
      ArrayLiteral: AnyArrayLiteral
      DedentedBody
      ObjectKey
      Type: TypeReference
    }
  
  def clone()
    let clone = MacroHolder()
    clone.by-name := copy(@by-name)
    clone.by-id := @by-id[:]
    clone.by-label := copy(@by-label)
    clone.type-by-id := @type-by-id[:]
    clone.operator-names := copy(@operator-names)
    clone.binary-operators := @binary-operators[:]
    clone.assign-operators := @assign-operators[:]
    clone.prefix-unary-operators := @prefix-unary-operators[:]
    clone.postfix-unary-operators := @postfix-unary-operators[:]
    clone.serialization := copy(@serialization)
    clone.syntaxes := copy(@syntaxes)
    clone

  def get-by-name(name)
    @by-name![name]
  
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
  
  def get-or-add-by-names(names as Array)
    return for name in names
      @get-or-add-by-name name
  
  def set-type-by-id(id as Number, type as Type)!
    @type-by-id[id] := type
  
  def get-type-by-id(id)
    @type-by-id[id]
  
  def get-by-id(id)
    let by-id = @by-id
    if id >= 0 and id < by-id.length
      by-id[id]
  
  def add-macro(m, mutable macro-id as Number|void, type as Type|void)
    let by-id = @by-id
    if macro-id?
      if by-id ownskey macro-id
        throw Error "Cannot add macro #$(macro-id), as it already exists"
      by-id[macro-id] := m
    else
      by-id.push m
      macro-id := by-id.length - 1
    if type?
      @type-by-id[macro-id] := type
    macro-id
  
  def replace-macro(id, m, type as Type|void)!
    let by-id = @by-id
    by-id[id] := m
    if type?
      @type-by-id[id] := type
  
  def has-macro-or-operator(name)
    @by-name ownskey name or @operator-names ownskey name
  
  def get-macro-and-operator-names()
    let names = []
    for name of @by-name
      names.push name
    for name of @operator-names
      names.push name
    names
  
  def add-binary-operator(operators, m, options, macro-id)
    for op in operators
      @operator-names[op] := true
    let precedence = Number(options.precedence) or 0
    let binary-operators = @binary-operators[precedence] ?= []
    let data =
      rule: one-of for op in operators
        word-or-symbol op
      func: m
      right-to-left: not not options.right-to-left
      maximum: options.maximum or 0
      minimum: options.minimum or 0
      invertible: not not options.invertible
    binary-operators.push data
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type? then Type![options.type]
  
  def get-by-label(label)
    @by-label![label]
  
  def add-by-label(label as String, data)
    @by-label[label] := data
  
  def add-assign-operator(operators, m, options, macro-id)
    for op in operators
      @operator-names[op] := true
    let data = 
      rule: one-of for op in operators
        word-or-symbol op
      func: m
    @assign-operators.push data
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type? then Type![options.type]
  
  def add-unary-operator(operators, m, options, macro-id)
    for op in operators
      @operator-names[op] := true
    let store = if options.postfix then @postfix-unary-operators else @prefix-unary-operators
    let data =
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
    store.push data
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type? then Type![options.type]
  
  def add-serialized-helper(name as String, helper, dependencies)!
    let helpers = (@serialization.helpers ?= {})
    helpers[name] := { helper, dependencies }
  
  def add-macro-serialization(serialization as Object)!
    if typeof serialization.type != \string
      throw Error "Expected a string type"
    let obj = copy(serialization)
    delete obj.type
    let by-type = (@serialization[serialization.type] ?= [])
    by-type.push obj
  
  def add-syntax(name as String, value as Function)!
    if @syntaxes ownskey name
      throw Error "Cannot override already-defined syntax: $(name)"
    @syntaxes[name] := value
  
  def has-syntax(name as String)
    @syntaxes ownskey name
  
  def get-syntax(name as String)
    if @syntaxes ownskey name
      @syntaxes[name]
    else
      throw Error "Unknown syntax: $(name)"
  
  def serialize()
    JSON.stringify(@serialization)
  
  def deserialize(data)!
    require! './translator'
    require! './ast'
    for name, {helper, dependencies} of (data!.helpers ? {})
      translator.define-helper(name, ast.fromJSON(helper), dependencies)
    
    State("", this).deserialize-macros(data)

class Node
  def constructor() -> throw Error "Node should not be instantiated directly"
  
  def type() -> Type.any
  def walk() -> this
  def cacheable = true
  def scope(o) -> o.get-scope(@scope-id)
  def _reduce(o)
    @walk #(node) -> node.reduce(o)
  def reduce(o as State)
    if @_reduced?
      @_reduced
    else
      let reduced = @_reduce(o)
      if reduced == this
        @_reduced := this
      else
        @_reduced := reduced._reduced ?= reduced
  def is-const() -> false
  def const-value() -> throw Error("Not a const: $(typeof! node)")
  def is-statement() -> false
  def rescope(new-scope-id, o)
    let old-scope-id = @scope-id
    if old-scope-id == new-scope-id
      this
    else
      @scope-id := new-scope-id
      @walk #(node)
        if node.scope-id == old-scope-id
          node.rescope new-scope-id, o
        else if node.scope-id != new-scope-id
          let node-scope = node.scope(o)
          if node-scope.parent?
            let parent-id = node-scope.parent.id
            if parent-id == old-scope-id
              node-scope.reparent(o.get-scope(new-scope-id))
          node
        else
          node
  def do-wrap(o)
    if @is-statement()
      let inner-scope = o.clone-scope(o.get-scope(@scope-id))
      CallNode(@start-index, @end-index, @scope-id, FunctionNode(@start-index, @end-index, @scope-id, [], @rescope(inner-scope.id, o), true, true), [])
    else
      this

macro node-class
  syntax ident as Identifier, args as ("(", head as Parameter, tail as (",", this as Parameter)*, ")")?, body as Body?
    
    let params =
      * @param AST start-index, null, null, null, AST Number
      * @param AST end-index, null, null, null, AST Number
      * @param AST scope-id, null, null, null, AST Number
    let full-name = @name(ident)
    if full-name.substring(full-name.length - 4) != "Node"
      throw Error "node-class's name must end in 'Node', got $(full-name)"
    let capped-name = full-name.substring(0, full-name.length - 4)
    let lower-name = full-name.char-at(0).to-lower-case() & full-name.substring(1, full-name.length - 4)
    let type = @ident(full-name)
    let ctor-body = AST
      @start-index := start-index
      @end-index := end-index
      @scope-id := scope-id
      @_reduced := void
      @_macro-expanded := void
      @_macro-expand-alled := void
    let mutable inspect-parts = @const(full-name & "(")
    let mutable arg-names = []
    if args
      args := [args.head, ...args.tail]
    else
      args := []
    for arg, i in args
      params.push arg
      let ident = @param-ident arg
      let key = @const(@name(ident))
      ctor-body := AST
        $ctor-body
        @[$key] := $ident
      arg-names.push key
      if i > 0
        inspect-parts := AST $inspect-parts ~& ", "
      inspect-parts := AST $inspect-parts ~& inspect(@[$key], null, if depth? then depth ~- 1 else null)
    inspect-parts := AST $inspect-parts ~& ")"
    
    let mutable found-walk = false
    if body
      let FOUND = {}
      let find-walk(node)@
        @walk node, #(node)@
          if @is-def(node)
            let key = @left(node)
            if @is-const(key) and @value(key) == \walk
              throw FOUND
      try
        find-walk(body)
      catch e
        if e == FOUND
          found-walk := true
        else
          throw e
    
    let add-methods = []
    if not found-walk
      let mutable walk-func = void
      if args.length
        let walk-init = []
        let walk-check = AST false
        let mutable walk-args = []
        for arg in args
          let ident = @param-ident arg
          let key = @name(ident)
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
            $type @start-index, @end-index, @scope-id, ...$walk-args
          else
            this)
      else
        walk-func := AST ret-this
      add-methods.push AST def walk = $walk-func
    
    let func = @func params, AST $ctor-body, false, true
    arg-names := @array arg-names
    AST Node[$capped-name] := class $type extends Node
      def constructor = $func
      @capped-name := $capped-name
      @arg-names := $arg-names
      State.add-node-factory $lower-name, this
      $body
      $add-methods
      def inspect(depth) -> $inspect-parts


class Scope
  def constructor(id, parent as Scope|null)@
    @id := id
    @parent := parent
    @variables := {}
    @tmps := {}

  def clone(id) -> Scope(id, this)
  
  def reparent(parent as Scope)!
    if parent == this
      throw Error("Trying to reparent to own scope")
    @parent := parent
  
  def add(ident as IdentNode|TmpNode, is-mutable as Boolean)!
    if ident instanceof TmpNode
      @tmps[ident.id] := { ident, is-mutable }
    else
      @variables[ident.name] := is-mutable
  
  def owns(ident as IdentNode|TmpNode)
    if ident instanceof TmpNode
      @tmps ownskey ident.id
    else
      @variables ownskey ident.name
  
  def has(ident as IdentNode|TmpNode)
    if @owns(ident)
      true
    else if @parent?
      @parent.has(ident)
    else
      false

class State
  def constructor(data, macros = MacroHolder(), options = {}, index = 0, line = 1, failures = FailureManager(), cache = [], indent = Stack(1), current-macro = null, prevent-failures = 0, known-scopes = [], scope)@
    @data := data
    @macros := macros
    @options := options
    @index := index
    @line := line
    @failures := failures
    @cache := cache
    @indent := indent
    @current-macro := current-macro
    @prevent-failures := prevent-failures
    @known-scopes := known-scopes
    if not scope
      @scope := Scope(known-scopes.length)
      known-scopes.push @scope
    else
      @scope := scope
    @expanding-macros := false
  
  def clone(scope as Scope|void) -> State @data, @macros, @options, @index, @line, @failures, @cache, @indent.clone(), @current-macro, @prevent-failures, @known-scopes, scope or @scope
  
  def clone-scope(outer-scope)
    let scope = (outer-scope or @scope).clone(@known-scopes.length)
    @known-scopes.push scope
    scope
  
  def get-scope(id as Number)
    @known-scopes[id] or throw Error "Unknown scope: $id"
  
  def update(clone)!
    @index := clone.index
    @line := clone.line
    @indent := clone.indent.clone()
    @macros := clone.macros
  
  def fail(message)!
    if not @prevent-failures
      @failures.add message, @index, @line
  
  def prevent-fail()!
    @prevent-failures ~+= 1
  
  def unprevent-fail()!
    @prevent-failures ~-= 1
  
  def error(message)!
    throw ParserError message, @data, @index, @line
  
  def enter-macro(names, func)
    if not names
      throw Error "Must provide a macro name"
    if @current-macro
      @error "Attempting to define a macro $(String names) inside a macro $(String @current-macro)"
    try
      @current-macro := names
      func()
    finally
      @current-macro := null
    @nothing @index
  
  def define-helper(i, name as IdentNode, value as Node)
    require! './translator'
    let {helper, dependencies} = translator.define-helper(name, @macro-expand-all(value).reduce(this))
    if @options.serialize-macros
      @macros.add-serialized-helper(name.name, helper, dependencies)
    @nothing i
  
  let macro-syntax-const-literals =
    ",": Comma
    ";": Semicolon
    ":": Colon
    "": Nothing
    "\n": NewlineWithCheckIndent
    "(": OpenParenthesis
    ")": CloseParenthesis
    "[": OpenSquareBracket
    "]": CloseSquareBracket
    "{": OpenCurlyBrace
    "}": CloseCurlyBrace
  
  let reduce-object(o, obj)
    if is-array! obj
      return for item in obj; reduce-object o, item
    else if obj instanceof Node
      obj.reduce(o)
    else if typeof obj == \object and obj != null
      let result = {}
      for k, v of obj
        result[k] := reduce-object o, v
      result
    else
      obj
  
  let make-macro-root(index, params, body)
    @root index, @return index, @function(index
      [
        params
        @param index, (@ident index, \__wrap), void, false, true, void
        @param index, (@ident index, \__node), void, false, true, void
      ]
      body
      true
      false), false
  
  let serialize-param-type(as-type)
    if as-type instanceof IdentNode
      { type: \ident, as-type.name }
    else if as-type instanceof SyntaxSequenceNode
      { type: \sequence, items: serialize-params(as-type.params) }
    else if as-type instanceof SyntaxChoiceNode
      { type: \choice, choices: for choice in as-type.choices; serialize-param-type(choice) }
    else if as-type.is-const()
      { type: \const, value: as-type.const-value() }
    else if as-type instanceof SyntaxManyNode
      { type: \many, as-type.multiplier, inner: serialize-param-type(as-type.inner) }
    else
      throw Error()
  let serialize-params(params)
    return for param in params
      if param.is-const()
        { type: \const, value: param.const-value() }
      else if param instanceof SyntaxParamNode
        let {ident} = param
        let value = if ident instanceof IdentNode
          { type: \ident, ident.name }
        else if ident instanceof ThisNode
          { type: \this }
        else
          throw Error()
        if param.as-type
          value.as-type := serialize-param-type(param.as-type)
        value
      else
        throw Error()
  let deserialize-param-type(as-type, scope-id)
    if not as-type?
      return void
    switch as-type.type
    case \ident
      IdentNode 0, 0, scope-id, as-type.name
    case \sequence
      SyntaxSequenceNode 0, 0, scope-id, deserialize-params(as-type.items, scope-id)
    case \choice
      SyntaxChoiceNode 0, 0, scope-id, for choice in as-type.choices; deserialize-param-type(choice, scope-id)
    case \const
      ConstNode 0, 0, scope-id, as-type.value
    case \many
      SyntaxManyNode 0, 0, scope-id, deserialize-param-type(as-type.inner, scope-id), as-type.multiplier
    default
      throw Error "Unknown as-type: $(String as-type.type)"
  let deserialize-params(params, scope-id)
    return for param in params
      if param.type == \const
        ConstNode 0, 0, scope-id, param.value
      else
        let node = if param.type == \ident
          IdentNode 0, 0, scope-id, param.name
        else if param.type == \this
          ThisNode 0, 0, scope-id
        else
          throw Error "Unknown param: $(String param.type)"
        SyntaxParamNode 0, 0, scope-id, node, deserialize-param-type(param.as-type, scope-id)
  
  let calc-param(param)
    if param instanceof IdentNode
      let name = param.name
      let macros = @macros
      if macros.has-syntax(name)
        macros.get-syntax(name)
      else
        named(name, #(o) -> macros.get-syntax(name)@(this, o))
    else if param instanceof SyntaxSequenceNode
      handle-params@ this, param.params
    else if param instanceof SyntaxChoiceNode
      cache! one-of for choice in param.choices
        calc-param@ this, choice
    else if param.is-const()
      let string = param.const-value()
      if typeof string != \string
        @error "Expected a constant string parameter, got $(typeof! string)"
      macro-syntax-const-literals![string] or word-or-symbol string
    else if param instanceof SyntaxManyNode
      let {multiplier} = param
      let calced = calc-param@ this, param.inner
      switch multiplier
      case "*"; zero-or-more! calced
      case "+"; one-or-more! calced
      case "?"; maybe! calced, #(x, o, i) -> o.nothing(i)
      default
        throw Error("Unknown syntax multiplier: $multiplier")
    else
      @error "Unexpected type: $(typeof! param)"
  
  let handle-params(params)
    let sequence = []
    for param in params
      if param.is-const()
        let string = param.const-value()
        if typeof string != \string
          @error "Expected a constant string parameter, got $(typeof! string)"

        sequence.push macro-syntax-const-literals![string] or word-or-symbol string
      else if param instanceof SyntaxParamNode
        let {ident} = param
        let key = if ident instanceof IdentNode
          ident.name
        else if ident instanceof ThisNode
          \this
        else
          throw Error "Don't know how to handle ident type: $(typeof! ident)"
        let type = param.as-type ? IdentNode 0, 0, -1, \Expression // FIXME: the lack of scope might break things
        sequence.push [key, calc-param@ this, type]
      else
        @error "Unexpected parameter type: $(typeof! param)"
    sequential sequence
  let macro-syntax-types =
    syntax: #(index, params, body, options, state-options)
      let func-params = @object-param index,
        * key: @const(index, \macro-name)
          value: @param index, (@ident index, \macro-name), void, false, true, void
        * key: @const(index, \macro-data)
          value: @object-param index, for param in params
            if param instanceof SyntaxParamNode
              key: @const index, param.ident.name
              value: @param index, param.ident, void, false, true, void
      
      let raw-func = make-macro-root@ this, index, func-params, body
      let translated = require('./translator')(@macro-expand-all(raw-func).reduce(this), return: true)
      let compilation = translated.node.to-string()
      let serialization = if state-options.serialize-macros then compilation
      let handler = Function(compilation)()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(String @current-macro)"
      let state = this
      {
        handler: #(args, ...rest) -> handler@(this, reduce-object(state, args), ...rest).reduce(state)
        rule: handle-params@ this, params
        serialization: if serialization?
          type: \syntax
          code: serialization
          options: options
          params: serialize-params params
          names: @current-macro
      }
    
    define-syntax: #(index, params, body, options, state-options)
      let func-params = for param in params
        if param instanceof SyntaxParamNode
          key: @const index, param.ident.name
          value: @param index, param.ident, void, false, true, void
      
      let mutable serialization = void
      let state = this
      let handler = if body?
        do
          let raw-func = make-macro-root@ this, index, @object-param(index, func-params), body
          let translated = require('./translator')(@macro-expand-all(raw-func).reduce(state), return: true)
          let compilation = translated.node.to-string()
          if state-options.serialize-macros
            serialization := compilation
          let handler = Function(compilation)()
          if typeof handler != \function
            throw Error "Error creating function for syntax: $(options.name)"
          #(args, ...rest) -> reduce-object(state, handler@(this, reduce-object(state, args), ...rest))
      else
        #(args, ...rest) -> reduce-object(state, args)
      {
        handler
        rule: handle-params@ this, params
        serialization: if state-options.serialize-macros
          type: \define-syntax
          code: serialization
          options: options
          params: serialize-params params
      }
    
    call: #(index, params, body, options, state-options)
      let func-params = @object-param index, [
        { key: @const(index, \macro-name), value: @param index, (@ident index, \macro-name), void, false, true, void }
        { key: @const(index, \macro-data), value: @array-param(index, params) }
      ]
      let raw-func = make-macro-root@ this, index, func-params, body
      let translated = require('./translator')(@macro-expand-all(raw-func).reduce(this), return: true)
      let compilation = translated.node.to-string()
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if typeof handler != \function
        throw Error "Error creating function for macro: $(@current-macro)"
      let state = this
      handler := do inner = handler
        #(args, ...rest)
          inner@(this, reduce-object(state, args), ...rest).reduce(state)
      {
        handler
        rule: InvocationArguments
        serialization: if serialization?
          type: \call
          code: serialization
          options: options
          names: @current-macro
      }
    
    binary-operator: #(index, operators, body, options, state-options)
      let raw-func = make-macro-root@ this, index, @object-param(index, [
        { key: @const(index, \left), value: @param index, (@ident index, \left), void, false, true, void }
        { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
        { key: @const(index, \right), value: @param index, (@ident index, \right), void, false, true, void }
      ]), body
      let translated = require('./translator')(@macro-expand-all(raw-func).reduce(this), return: true)
      let compilation = translated.node.to-string()
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if typeof handler != \function
        throw Error "Error creating function for binary operator $(operators.join ', ')"
      let state = this
      if options.invertible
        handler := do inner = handler
          #(args, ...rest)
            let result = inner@ this, reduce-object(state, args), ...rest
            if args.inverted
              UnaryNode(result.start-index, result.end-index, result.scope-id, "!", result).reduce(state)
            else
              result.reduce(state)
      else
        handler := do inner = handler
          #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \binary-operator
          code: serialization
          operators: operators
          options: options
      }
    
    assign-operator: #(index, operators, body, options, state-options)
      let raw-func = make-macro-root@ this, index, @object-param(index, [
        { key: @const(index, \left), value: @param index, (@ident index, \left), void, false, true, void }
        { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
        { key: @const(index, \right), value: @param index, (@ident index, \right), void, false, true, void }
      ]), body
      let translated = require('./translator')(@macro-expand-all(raw-func).reduce(this), return: true)
      let compilation = translated.node.to-string()
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if typeof handler != \function
        throw Error "Error creating function for assign operator $(operators.join ', ')"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \assign-operator
          code: serialization
          operators: operators
          options: options
      }
    
    unary-operator: #(index, operators, body, options, state-options)
      let raw-func = make-macro-root@ this, index, @object-param(index, [
        { key: @const(index, \op), value: @param index, (@ident index, \op), void, false, true, void }
        { key: @const(index, \node), value: @param index, (@ident index, \node), void, false, true, void }
      ]), body
      let translated = require('./translator')(@macro-expand-all(raw-func).reduce(this), return: true)
      let compilation = translated.node.to-string()
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if typeof handler != \function
        throw Error "Error creating function for unary operator $(operators.join ', ')"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \unary-operator
          code: serialization
          operators: operators
          options: options
      }
  
  let macro-deserializers =
    syntax: #({code, params, names, options, id})
      let mutable handler = Function(code)()
      if typeof handler != \function
        throw Error "Error deserializing function for macro $(name)"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      @enter-macro names, #@
        handle-macro-syntax@ this, 0, \syntax, handler, handle-params@(this, deserialize-params(params, @scope.id)), null, options, id
    
    call: #({code, names, options, id})
      let mutable handler = Function(code)()
      if typeof handler != \function
        throw Error "Error deserializing function for macro $(name)"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      @enter-macro name, #@
        handle-macro-syntax@ this, 0, \call, handler, InvocationArguments, null, options, id
    
    define-syntax: #({code, params, options, id})
      if @macros.has-syntax(options.name)
        throw Error "Cannot override already-defined syntax: $(options.name)"
      
      let mutable handler = void
      let state = this
      if code?
        handler := Function(code)()
        if typeof handler != \function
          throw Error "Error deserializing function for macro syntax $(options.name)"
        handler := do inner = handler
          #(args, ...rest) -> reduce-object(state, inner@(this, reduce-object(state, args), ...rest))
      else
        handler := #(args) -> reduce-object(state, args)
      
      @enter-macro DEFINE_SYNTAX, #@
        handle-macro-syntax@ this, 0, \define-syntax, handler, handle-params@(this, deserialize-params(params, @scope.id)), null, options, id
    
    binary-operator: #({code, operators, options, id})
      let handler = Function(code)()
      if typeof handler != \function
        throw Error "Error deserializing function for binary operator $(operators.join ', ')"
      let state = this
      if options.invertible
        handler := do inner = handler
          #(args, ...rest)
            let result = inner@ this, reduce-object(state, args), ...rest
            if args.inverted
              UnaryNode(result.start-index, result.end-index, result.scope-id, "!", result).reduce(state)
            else
              result.reduce(state)
      else
        handler := do inner = handler
          #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      @enter-macro BINARY_OPERATOR, #@
        handle-macro-syntax@ this, 0, \binary-operator, handler, void, operators, options, id
      
    assign-operator: #({code, operators, options, id})
      let handler = Function(code)()
      if typeof handler != \function
        throw Error "Error deserializing function for assign operator $(operators.join ', ')"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      @enter-macro ASSIGN_OPERATOR, #@
        handle-macro-syntax@ this, 0, \assign-operator, handler, void, operators, options, id
    
    unary-operator: #({code, operators, options, id})!
      let mutable handler = Function(code)()
      if typeof handler != \function
        throw Error "Error deserializing function for unary operator $(operators.join ', ')"
      let state = this
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(state, args), ...rest).reduce(state)
      @enter-macro UNARY_OPERATOR, #@
        handle-macro-syntax@ this, 0, \unary-operator, handler, void, operators, options, id
  
  let remove-noops(obj)
    if Array.isArray(obj)
      return for item in obj
        if item instanceof NothingNode
          void
        else
          remove-noops(item)
    else if obj instanceof Node
      obj
    else if obj and typeof obj == \object and obj not instanceof RegExp
      let result = {}
      for k, v of obj
        if v not instanceof NothingNode
          result[k] := remove-noops(v)
      result
    else
      obj
  
  def start-macro-syntax(index, params as Array, options)
    if not @current-macro
      this.error "Attempting to specify a macro syntax when not in a macro"
    
    let rule = handle-params@ this, params
    
    let macros = @macros
    let mutator = #(x, o, i, line)
      if _in-ast.peek() or not o.expanding-macros
        o.macro-access i, macro-id, line, remove-noops(x), _position.peek(), _in-generator.peek()
      else
        throw Error "Cannot use macro until fully defined"
    for m in macros.get-or-add-by-names @current-macro
      m.data.push sequential! [[\macro-name, m.token], [\macro-data, rule]], mutator
    let macro-id = macros.add-macro mutator, void, if options.type? then Type![options.type]
    @pending-macro-id := macro-id
    params
  
  let handle-macro-syntax(index, type, handler as Function, rule, params, options, mutable macro-id)
    let macros = @macros
    
    let mutator = #(x, o, i, line, scope-id)@
      if _in-ast.peek() or not o.expanding-macros
        o.macro-access i, macro-id, line, remove-noops(x), _position.peek(), _in-generator.peek()
      else
        let clone = o.clone(o.get-scope(scope-id))
        let macro-helper = MacroHelper clone, i, _position.peek(), _in-generator.peek()
        let mutable result = try
          handler@ macro-helper, remove-noops(x), macro-helper@.wrap, macro-helper@.node
        catch e
          if e instanceof MacroError
            e.line := line
            throw e
          else
            throw MacroError(e, o.data, i, line)
        o.update clone
        if result instanceof Node
          let walker(node)
            if node instanceof MacroAccessNode
              node.line := line
            node.walk walker
          result := walker result.reduce(this)
          let tmps = macro-helper.get-tmps()
          if tmps.unsaved.length
            o.tmp-wrapper i, result, tmps.unsaved
          else
            result
        else
          // TODO: do I need to watch tmps?
          result
    macro-id := switch @current-macro
    case BINARY_OPERATOR
      macros.add-binary-operator(params, mutator, options, macro-id)
    case ASSIGN_OPERATOR
      macros.add-assign-operator(params, mutator, options, macro-id)
    case UNARY_OPERATOR
      macros.add-unary-operator(params, mutator, options, macro-id)
    case DEFINE_SYNTAX
      assert(rule)
      macros.add-syntax options.name, mutate! rule, mutator
      macros.add-macro mutator, macro-id, if options.type? then Type![options.type]
    default
      assert(rule)
      for m in macros.get-or-add-by-names @current-macro
        if @pending-macro-id?
          m.data.pop()
        m.data.push sequential! [[\macro-name, m.token], [\macro-data, rule]], mutator
      
      if @pending-macro-id?
        if macro-id?
          throw Error "Cannot provide the macro id if there is a pending macro id"
        let id = @pending-macro-id
        @pending-macro-id := null
        macros.replace-macro id, mutator, if options.type? then Type![options.type]
        id
      else  
        macros.add-macro mutator, macro-id, if options.type? then Type![options.type]
  
  def macro-syntax(index, type, params as Array, options, body)!
    if macro-syntax-types not ownskey type
      throw Error "Unknown macro-syntax type: $type"
    
    if not @current-macro
      this.error "Attempting to specify a macro syntax when not in a macro"
    
    let {handler, rule, serialization} = macro-syntax-types[type]@(this, index, params, body, options, @options)
    
    let macro-id = handle-macro-syntax@ this, index, type, handler, rule, params, options
    if serialization?
      serialization.id := macro-id
      @macros.add-macro-serialization serialization
  
  let BINARY_OPERATOR = freeze {}
  def define-binary-operator(index, operators, options, body)
    @enter-macro BINARY_OPERATOR, #@
      @macro-syntax index, \binary-operator, operators, options, body
  
  let ASSIGN_OPERATOR = freeze {}
  def define-assign-operator(index, operators, options, body)
    @enter-macro ASSIGN_OPERATOR, #@
      @macro-syntax index, \assign-operator, operators, options, body
  
  let UNARY_OPERATOR = freeze {}
  def define-unary-operator(index, operators, options, body)
    @enter-macro UNARY_OPERATOR, #@
      @macro-syntax index, \unary-operator, operators, options, body
  
  let DEFINE_SYNTAX = freeze {}
  def define-syntax(index, name, params, body)
    @enter-macro DEFINE_SYNTAX, #@
      @macro-syntax index, \define-syntax, params, { name }, body
  
  def deserialize-macros(data)
    for type, deserializer of macro-deserializers
      for item in (data![type] ? [])
        deserializer@(this, item)
  
  def macro-expand-1(node)
    if node._macro-expanded?
      return node._macro-expanded
    else if node instanceof MacroAccessNode
      _position.push node.position
      _in-generator.push node.in-generator
      let old-expanding-macros = @expanding-macros
      @expanding-macros := true
      let result = try
        @macros.get-by-id(node.id)(node.data, this, node.start-index, node.line, node.scope-id)
      catch e
        if e instanceof MacroError
          e.line := node.line
        throw e
      finally
        _position.pop()
        _in-generator.pop()
        @expanding-macros := old-expanding-macros
      node._macro-expanded := if result instanceof MacroAccessNode
        // I know this somewhat violates the expanding only once assumption, but it makes
        // using this so much easier to know that macro-expand-1 will never return a MacroAccessNode
        @macro-expand-1(result)
      else
        result
    else
      node._macro-expanded := node
  
  def macro-expand-all(node)
    let walker = #(node)@
      if node._macro-expand-alled?
        node._macro-expand-alled
      else if node not instanceof MacroAccessNode
        let walked = node.walk walker
        walked._macro-expanded := walked
      else
        let expanded = @macro-expand-1(node)
        if expanded not instanceof Node
          return (node._macro-expand-alled := expanded)
        let walked = walker expanded
        expanded._macro-expand-alled := walked._macro-expanded := walked
    
    walker node
  
  @add-node-factory := #(name, type)!
    State::[name] := #(index, ...args) -> type(index, @index, @scope.id, ...args)

node-class AccessNode(parent as Node, child as Node)
  def type(o) -> @_type ?= do
    let parent-type = @parent.type(o)
    let is-string = parent-type.is-subset-of(Type.string)
    if is-string or parent-type.is-subset-of(Type.array-like)
      let child = o.macro-expand-1(@child).reduce(o)
      if child.is-const()
        let child-value = child.const-value()
        if child-value == \length
          return Type.number
        else if typeof child-value == \number
          return if child-value >= 0 and child-value %% 1
            if is-string
              Type.string.union(Type.undefined)
            else if parent-type.subtype
              parent-type.subtype.union(Type.undefined)
            else
              Type.any
          else
            Type.undefined
      else
        let child-type = child.type(o)
        if child-type.is-subset-of(Type.number)
          return if is-string
            Type.string.union(Type.undefined)
          else if parent-type.subtype
            parent-type.subtype.union(Type.undefined)
          else
            Type.any
    Type.any
  def _reduce(o)
    let parent = @parent.reduce(o).do-wrap(o)
    let child = @child.reduce(o).do-wrap(o)
    if parent.is-const() and child.is-const()
      let p-value = parent.const-value()
      let c-value = child.const-value()
      if Object(p-value) haskey c-value
        let value = p-value[c-value]
        if value == null or value instanceof RegExp or typeof value in [\string, \number, \boolean, \undefined]
          return ConstNode @start-index, @end-index, @scope-id, value
    if parent != @parent or child != @child
      AccessNode @start-index, @end-index, @scope-id, parent, child
    else
      this
node-class AccessIndexNode(parent as Node, child as Object)
  def walk = do
    let index-types =
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
    #(f)
      unless index-types ownskey @child.type
        throw Error "Unknown index type: $(@child.type)"
      let parent = f @parent
      let child = index-types[@child.type](@child, f)
      if parent != @parent or child != @child
        AccessIndexNode @start-index, @end-index, @scope-id, parent, child
      else
        this
node-class ArgsNode
  def type() -> Type.args
  def cacheable = false
node-class ArrayNode(elements as [Node])
  def type() -> Type.array
  def _reduce(o)
    let elements = map @elements, #(x) -> x.reduce(o).do-wrap(o)
    if elements != @elements
      ArrayNode @start-index, @end-index, @scope-id, elements
    else
      this
State::array-param := State::array
node-class AssignNode(left as Node, op as String, right as Node)
  def type = do
    let ops =
      "=": #(left, right) -> right
      "+=": #(left, right)
        if left.is-subset-of(Type.number) and right.is-subset-of(Type.number)
          Type.number
        else if left.overlaps(Type.number) and right.overlaps(Type.number)
          Type.string-or-number
        else
          Type.string
      "-=": Type.number
      "*=": Type.number
      "/=": Type.number
      "%=": Type.number
      "<<=": Type.number
      ">>=": Type.number
      ">>>=": Type.number
      "&=": Type.number
      "^=": Type.number
      "|=": Type.number
    #(o) -> @_type ?= do
      let type = ops![@op]
      if not type
        Type.any
      else if typeof type == "function"
        type @left.type(o), @right.type(o)
      else
        type
  def _reduce(o)
    let left = @left.reduce(o)
    let right = @right.reduce(o).do-wrap(o)
    if left != @left or right != @right
      AssignNode @start-index, @end-index, @scope-id, left, @op, right
    else
      this
node-class BinaryNode(left as Node, op as String, right as Node)
  def type = do
    let ops =
      "*": Type.number
      "/": Type.number
      "%": Type.number
      "+": #(left, right)
        if left.is-subset-of(Type.numeric) and right.is-subset-of(Type.numeric)
          Type.number
        else if left.overlaps(Type.numeric) and right.overlaps(Type.numeric)
          Type.string-or-number
        else
          Type.string
      "-": Type.number
      "<<": Type.number
      ">>": Type.number
      ">>>": Type.number
      "<": Type.boolean
      "<=": Type.boolean
      ">": Type.boolean
      ">=": Type.boolean
      "in": Type.boolean
      "instanceof": Type.boolean
      "==": Type.boolean
      "!=": Type.boolean
      "===": Type.boolean
      "!==": Type.boolean
      "&": Type.number
      "^": Type.number
      "|": Type.number
      "&&": #(left, right) -> left.intersect(Type.potentially-falsy).union(right)
      "||": #(left, right) -> left.intersect(Type.potentially-truthy).union(right)
    #(o) -> @_type ?= do
      let type = ops![@op]
      if not type
        Type.any
      else if typeof type == "function"
        type @left.type(o), @right.type(o)
      else
        type
  def _reduce = do
    let const-ops =
      "*": (~*)
      "/": (~/)
      "%": (~%)
      "+": do
        let is-JS-numeric(x)
          x == null or typeof x in [\number, \boolean, \undefined]
        #(left, right)
          if is-JS-numeric(left) and is-JS-numeric(right)
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
    let left-const-ops =
      "&&": #(x, y) -> if x.const-value() then y else x
      "||": #(x, y) -> if x.const-value() then x else y
      "*": #(x, y)
        if x.const-value() == 1
          UnaryNode @start-index, @end-index, @scope-id, "+", y
        else if x.const-value() == -1
          UnaryNode @start-index, @end-index, @scope-id, "-", y
      "+": #(x, y, o)
        if x.const-value() == 0 and y.type(o).is-subset-of(Type.number)
          UnaryNode @start-index, @end-index, @scope-id, "+", y
        else if x.const-value() == "" and y.type(o).is-subset-of(Type.string)
          y
        else if typeof x.const-value() == \string and y instanceof BinaryNode and y.op == "+" and y.left.is-const() and typeof y.left.const-value() == \string
          BinaryNode @start-index, @end-index, @scope-id, ConstNode(x.start-index, y.left.end-index, @scope-id, x.const-value() & y.left.const-value()), "+", y.right
      "-": #(x, y)
        if x.const-value() == 0
          UnaryNode @start-index, @end-index, @scope-id, "-", y
    let right-const-ops =
      "*": #(x, y)
        if y.const-value() == 1
          UnaryNode @start-index, @end-index, @scope-id, "+", x
        else if y.const-value() == -1
          UnaryNode @start-index, @end-index, @scope-id, "-", x
      "/": #(x, y)
        if y.const-value() == 1
          UnaryNode @start-index, @end-index, @scope-id, "+", x
        else if y.const-value() == -1
          UnaryNode @start-index, @end-index, @scope-id, "-", x
      "+": #(x, y, o)
        if y.const-value() == 0 and x.type(o).is-subset-of(Type.number)
          UnaryNode @start-index, @end-index, @scope-id, "+", x
        else if typeof y.const-value() == "number" and y.value < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @start-index, @end-index, @scope-id, x, "-", ConstNode(y.start-index, y.end-index, @scope-id, -y.const-value())
        else if y.const-value() == "" and x.type(o).is-subset-of(Type.string)
          x
        else if typeof y.const-value() == \string and x instanceof BinaryNode and x.op == "+" and x.right.is-const() and typeof x.right.const-value() == \string
          BinaryNode @start-index, @end-index, @scope-id, x.left, "+", ConstNode(x.right.start-index, y.end-index, @scope-id, x.right.const-value() & y.const-value())
      "-": #(x, y, o)
        if y.const-value() == 0
          UnaryNode @start-index, @end-index, @scope-id, "+", x
        else if typeof y.const-value() == "number" and y.const-value() < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @start-index, @end-index, @scope-id, x, "+", ConstNode(y.start-index, y.end-index, @scope-id, -y.const-value())
    #(o)
      let left = @left.reduce(o).do-wrap(o)
      let right = @right.reduce(o).do-wrap(o)
      let op = @op
      if left.is-const()
        if right.is-const() and const-ops ownskey op
          return ConstNode @start-index, @end-index, @scope-id, const-ops[op](left.const-value(), right.const-value())
        return? left-const-ops![op]@(this, left, right, o)
      if right.is-const()
        return? right-const-ops![op]@(this, left, right, o)
      
      if left != @left or right != @right
        BinaryNode @start-index, @end-index, @scope-id, left, op, right
      else
        this
node-class BlockNode(nodes as [Node])
  def type(o)
    let nodes = @nodes
    if nodes.length == 0
      Type.undefined
    else
      nodes[nodes.length - 1].type(o)
  def _reduce(o)
    let changed = false
    let body = []
    for node, i, len in @nodes
      let reduced = node.reduce(o)
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
      NothingNode @start-index, @end-index, @scope-id
    case 1
      body[0]
    default
      if changed
        BlockNode @start-index, @end-index, @scope-id, body
      else
        this
  def is-statement() -> for some node in @nodes; node.is-statement()
node-class BreakNode
  def is-statement() -> true
node-class CallNode(func as Node, args as [Node], is-new as Boolean, is-apply as Boolean)
  def type = do
    let PRIMORDIAL_FUNCTIONS =
      Object: Type.object
      String: Type.string
      Number: Type.number
      Boolean: Type.boolean
      Function: Type.function
      Array: Type.array
      Date: Type.string
      RegExp: Type.regexp
      Error: Type.error
      RangeError: Type.error
      ReferenceError: Type.error
      SyntaxError: Type.error
      TypeError: Type.error
      URIError: Type.error
      escape: Type.string
      unescape: Type.string
      parseInt: Type.number
      parseFloat: Type.number
      isNaN: Type.boolean
      isFinite: Type.boolean
      decodeURI: Type.string
      decodeURIComponent: Type.string
      encodeURI: Type.string
      encodeURIComponent: Type.string
    let PRIMORDIAL_SUBFUNCTIONS =
      Object:
        getPrototypeOf: Type.object
        getOwnPropertyDescriptor: Type.object
        getOwnPropertyNames: Type.string.array()
        create: Type.object
        defineProperty: Type.object
        defineProperties: Type.object
        seal: Type.object
        freeze: Type.object
        preventExtensions: Type.object
        isSealed: Type.boolean
        isFrozen: Type.boolean
        isExtensible: Type.boolean
        keys: Type.string.array()
      String:
        fromCharCode: Type.string
      Number:
        isFinite: Type.boolean
        isNaN: Type.boolean
      Array:
        isArray: Type.boolean
      Math:
        abs: Type.number
        acos: Type.number
        asin: Type.number
        atan: Type.number
        atan2: Type.number
        ceil: Type.number
        cos: Type.number
        exp: Type.number
        floor: Type.number
        log: Type.number
        max: Type.number
        min: Type.number
        pow: Type.number
        random: Type.number
        round: Type.number
        sin: Type.number
        sqrt: Type.number
        tan: Type.number
      JSON:
        stringify: Type.string.union(Type.undefined)
        parse: Type.string.union(Type.number).union(Type.boolean).union(Type.null).union(Type.array).union(Type.object)
      Date:
        UTC: Type.number
        now: Type.number
    let PRIMORDIAL_METHODS =
      String:
        toString: Type.string
        valueOf: Type.string
        charAt: Type.string
        charCodeAt: Type.number
        concat: Type.string
        indexOf: Type.number
        lastIndexOf: Type.number
        localeCompare: Type.number
        match: Type.array.union(Type.null)
        replace: Type.string
        search: Type.number
        slice: Type.string
        split: Type.string.array()
        substring: Type.string
        toLowerCase: Type.string
        toLocaleLowerCase: Type.string
        toUpperCase: Type.string
        toLocaleUpperCase: Type.string
        trim: Type.string
      Boolean:
        toString: Type.string
        valueOf: Type.boolean
      Number:
        toString: Type.string
        valueOf: Type.number
        toLocaleString: Type.string
        toFixed: Type.string
        toExponential: Type.string
        toPrecision: Type.string
      Date:
        toString: Type.string
        toDateString: Type.string
        toTimeString: Type.string
        toLocaleString: Type.string
        toLocaleDateString: Type.string
        toLocaleTimeString: Type.string
        valueOf: Type.number
        getTime: Type.number
        getFullYear: Type.number
        getUTCFullYear: Type.number
        getMonth: Type.number
        getUTCMonth: Type.number
        getDate: Type.number
        getUTCDate: Type.number
        getDay: Type.number
        getUTCDay: Type.number
        getHours: Type.number
        getUTCHours: Type.number
        getMinutes: Type.number
        getUTCMinutes: Type.number
        getSeconds: Type.number
        getUTCSeconds: Type.number
        getMilliseconds: Type.number
        getUTCMilliseconds: Type.number
        getTimezoneOffset: Type.number
        setTime: Type.number
        setMilliseconds: Type.number
        setUTCMilliseconds: Type.number
        setSeconds: Type.number
        setUTCSeconds: Type.number
        setMinutes: Type.number
        setUTCMinutes: Type.number
        setHours: Type.number
        setUTCHours: Type.number
        setDate: Type.number
        setUTCDate: Type.number
        setMonth: Type.number
        setUTCMonth: Type.number
        setFullYear: Type.number
        setUTCFullYear: Type.number
        toUTCString: Type.string
        toISOString: Type.string
        toJSON: Type.string
      RegExp:
        exec: Type.array.union(Type.null)
        test: Type.boolean
        toString: Type.string
      Error:
        toString: Type.string
    let helper-type-cache = {}
    let calculate-type(node)  
      let ast = require('./ast')
      let last = node.last()
      if last instanceof ast.Func
        last.meta?.as-type ? Type.any
      else if last instanceof ast.Return
        calculate-type(last.node)
      else if last instanceof ast.Call and last.func instanceof ast.Func
        calculate-type(last.func.body)
      else
        Type.any
    #(o) -> @_type ?= do
      let func = @func
      let func-type = func.type(o)
      if func-type.is-subset-of(Type.function)
        func-type.return-type
      else if func instanceof IdentNode
        let {name} = func
        if PRIMORDIAL_FUNCTIONS ownskey name
          return PRIMORDIAL_FUNCTIONS[name]
        else if name.length > 2 and C(name, 0) == C("_") and C(name, 1) == C("_")
          let {helpers} = require('./translator')
          if helpers.has name
            return if helper-type-cache ownskey name
              helper-type-cache[name]
            else
              helper-type-cache[name] := calculate-type helpers.get name
      else if func instanceof AccessNode
        let {parent, child} = func
        if child instanceof ConstNode
          if child.value in [\call, \apply]
            let parent-type = parent.type(o)
            if parent-type.is-subset-of(Type.function)
              return parent-type.return-type
          else if parent instanceof IdentNode
            return? PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.value]
          // else check the type of parent, maybe figure out its methods
      Type.any
  def _reduce = do
    let PURE_PRIMORDIAL_FUNCTIONS = {
      +escape
      +unescape
      +parseInt
      +parseFloat
      +isNaN
      +isFinite
      +decodeURI
      +decodeURIComponent
      +encodeURI
      +encodeURIComponent
      +String
      +Boolean
      +Number
      +RegExp
    }
    let PURE_PRIMORDIAL_SUBFUNCTIONS =
      String: {
        +fromCharCode
      }
      Number: {
        +isFinite
        +isNaN
      }
      Math: {
        +abs
        +acos
        +asin
        +atan
        +atan2
        +ceil
        +cos
        +exp
        +floor
        +log
        +"max"
        +"min"
        +pow
        +round
        +sin
        +sqrt
        +tan
      }
      JSON: {
        +parse
        +stringify
      }
    #(o)
      let func = @func.reduce(o).do-wrap(o)
      let args = map @args, #(node) -> node.reduce(o).do-wrap(o)
      if not @is-new and not @is-apply
        let const-args = []
        let mutable all-const = true
        for arg in args
          if arg.is-const()
            const-args.push arg.const-value()
          else
            all-const := false
            break
        if all-const
          if func instanceof IdentNode
            if PURE_PRIMORDIAL_FUNCTIONS ownskey func.name
              try
                let value = GLOBAL[func.name]@ void, ...const-args
                return ConstNode @start-index, @end-index, @scope-id, value
              catch e
                // TODO: do something here to alert the user
                void
          else if func instanceof AccessNode and func.child.is-const()
            let {parent, child} = func
            let c-value = child.const-value()
            if parent.is-const()
              let p-value = parent.const-value()
              if typeof p-value[c-value] == \function
                try
                  let value = p-value[c-value] ...const-args
                  return ConstNode @start-index, @end-index, @scope-id, value
                catch e
                  // TODO: do something here to alert the user
                  void
            else if parent instanceof IdentNode
              if PURE_PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.value]
                try
                  let value = GLOBAL[parent.name][c-value] ...const-args
                  return ConstNode @start-index, @end-index, @scope-id, value
                catch e
                  // TODO: do something here to alert the user
                  void
      if func != @func or args != @args
        CallNode @start-index, @end-index, @scope-id, func, args, @is-new, @is-apply
      else
        this
node-class ConstNode(value as Number|String|Boolean|RegExp|void|null)
  def type()
    let value = @value
    switch typeof value
    case \number; Type.number
    case \string; Type.string
    case \boolean; Type.boolean
    case \undefined; Type.undefined
    default
      if value == null
        Type.null
      else if value instanceof RegExp
        Type.regexp
      else
        throw Error("Unknown type for $(String value)")
  def cacheable = false
  def is-const() -> true
  def const-value() -> @value
node-class ContinueNode
  def is-statement() -> true
node-class DebuggerNode
  def is-statement() -> true
node-class DefNode(left as Node, right as Node|void)
  def walk(func)
    let left = func @left
    let right = if @right? then func @right else @right
    if left != @left or right != @right
      DefNode @start-index, @end-index, @scope-id, left, right
    else
      this
node-class EvalNode(code as Node)
node-class ForNode(init as Node = NothingNode(0, 0, scope-id), test as Node = ConstNode(0, 0, scope-id, true), step as Node = NothingNode(0, 0, scope-id), body as Node)
  def is-statement() -> true
node-class ForInNode(key as Node, object as Node, body as Node)
  def is-statement() -> true
node-class FunctionNode(params as [Node], body as Node, auto-return as Boolean = true, bound as Boolean = false, as-type as Node|void, generator as Boolean)
  def type(o) -> @body.type(o).function()
  def walk(func)
    let params = map @params, func
    let body = func @body
    let as-type = if @as-type? then func @as-type else @as-type
    if params != @params or body != @body or as-type != @as-type
      FunctionNode @start-index, @end-index, @scope-id, params, body, @auto-return, @bound, @as-type, @generator
    else
      this
node-class IdentNode(name as String)
  def cacheable = false
node-class IfNode(test as Node, when-true as Node, when-false as Node = NothingNode(0, 0, scope-id))
  def type(o) -> @_type ?= @when-true.type(o).union(@when-false.type(o))
  def _reduce(o)
    let test = @test.reduce(o)
    let when-true = @when-true.reduce(o)
    let when-false = @when-false.reduce(o)
    if test.is-const()
      if test.const-value()
        when-true
      else
        when-false
    else
      IfNode @start-index, @end-index, @scope-id, test, when-true, when-false
  def is-statement() -> @_is-statement ?= @when-true.is-statement() or @when-false.is-statement()
  def do-wrap(o)
    let when-true = @when-true.do-wrap(o)
    let when-false = @when-false.do-wrap(o)
    if when-true != @when-true or when-false != @when-false
      IfNode @start-index, @end-index, @scope-id, @test, when-true, when-false
    else
      this
node-class MacroAccessNode(id as Number, line as Number, data as Object, position as String, in-generator as Boolean)
  def type(o as State) -> @_type ?= do
    let type = o.macros.get-type-by-id(@id)
    if type?
      type
    else
      o.macro-expand-1(this).type(o)
  def walk = do
    let walk-array(array, func)
      let result = []
      let mutable changed = false
      for item in array
        let new-item = walk-item item, func
        if new-item != item
          changed := true
        result.push new-item
      if changed
        result
      else
        array
    let walk-object(obj, func)
      let result = {}
      let mutable changed = false
      for k, v of obj
        let new-v = walk-item v, func
        if new-v != v
          changed := true
        result[k] := new-v
      if changed
        result
      else
        obj
    let walk-item(item, func)
      if item instanceof Node
        func item
      else if is-array! item
        walk-array item, func
      else if item and typeof item == \object
        walk-object item, func
      else
        item
    #(func)
      let data = walk-item(@data, func)
      if data != @data
        MacroAccessNode @start-index, @end-index, @scope-id, @id, @line, data, @position, @in-generator
      else
        this
node-class NothingNode
  def type() -> Type.undefined
  def cacheable = false
  def is-const() -> true
  def const-value() -> void
node-class ObjectNode(pairs as Array, prototype as Node|void)
  def type() -> Type.object
  def walk = do
    let walk-pair(pair, func)
      let key = func pair.key
      let value = func pair.value
      if key != pair.key or value != pair.value
        { key, value }
      else
        pair
    #(func)
      let pairs = map @pairs, walk-pair, func
      let prototype = if @prototype? then func @prototype else @prototype
      if pairs != @pairs or prototype != @prototype
        ObjectNode @start-index, @end-index, @scope-id, pairs, prototype
      else
        this
  def _reduce = do
    let reduce-pair(pair, o)
      let key = pair.key.reduce(o)
      let value = pair.value.reduce(o).do-wrap(o)
      if key != pair.key or value != pair.value
        { key, value }
      else
        pair
    #(o)
      let pairs = map @pairs, reduce-pair, o
      let prototype = if @prototype? then @prototype.reduce(o) else @prototype
      if pairs != @pairs or prototype != @prototype
        ObjectNode @start-index, @end-index, @scope-id, pairs, prototype
      else
        this
State::object := #(i, pairs, prototype)
  let known-keys = []
  for {key} in pairs
    if key instanceof ConstNode
      let key-value = String key.value
      if key-value in known-keys
        @error "Duplicate key in object: $(key-value)"
      known-keys.push key-value
  ObjectNode(i, @index, @scope.id, pairs, prototype)
State::object-param := State::object
node-class ParamNode(ident as Node, default-value as Node|void, spread as Boolean, is-mutable as Boolean, as-type as Node|void)
  def walk(func)
    let ident = func @ident
    let default-value = if @default-value? then func @default-value else @default-value
    let as-type = if @as-type? then func @as-type else @as-type
    if ident != @ident or default-value != @default-value or as-type != @as-type
      ParamNode @start-index, @end-index, @scope-id, ident, default-value, @spread, @is-mutable, as-type
    else
      this
node-class RegexpNode(text as Node, flags as String)
  def type() -> Type.regexp
  def _reduce(o)
    let text = @text.reduce(o).do-wrap(o)
    if text.is-const()
      ConstNode @start-index, @end-index, @scope-id, RegExp(String(text.const-value()), @flags)
    else
      CallNode @start-index, @end-index, @scope-id, IdentNode(@start-index, @end-index, @scope-id, "RegExp"), [
        text
        ConstNode @start-index, @end-index, @scope-id, @flags
      ]
node-class ReturnNode(node as Node = ConstNode(end-index, end-index, scope-id, void))
  def type(o) -> @node.type(o)
  def is-statement() -> true
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      ReturnNode @start-index, @end-index, @scope-id, node
    else
      this
node-class RootNode(body as Node)
  def is-statement() -> true
node-class SpreadNode(node as Node)
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      SpreadNode @start-index, @end-index, @scope-id, node
    else
      this
State::string := #(index, mutable parts as [Node])
  let concat-op = @macros.get-by-label(\string-concat)
  if not concat-op
    throw Error "Cannot use string interpolation until the string-concat operator has been defined"
  if parts.length == 0
    ConstNode index, index, @scope.id, ""
  else if parts.length == 1
    concat-op.func {
      left: ConstNode index, index, @scope.id, ""
      op: ""
      right: parts[0]
    }, this, index, @line
  else
    for reduce part in parts[1:], current = parts[0]
      concat-op.func {
        left: current
        op: ""
        right: part
      }, this, index, @line

node-class SuperNode(child as Node|void, args as [Node])
  def walk(func)
    let child = if @child? then func @child else @child
    let args = map @args, func
    if child != @child or args != @args
      SuperNode @start-index, @end-index, @scope-id, child, args
    else
      this
  def _reduce(o)
    let child = if @child? then @child.reduce(o).do-wrap(o) else @child
    let args = map @args, #(node, o) -> node.reduce(o).do-wrap(o), o
    if child != @child or args != @args
      SuperNode @start-index, @end-index, @scope-id, child, args
    else
      this
node-class SwitchNode(node as Node, cases as Array, default-case as Node|void)
  def walk(func)
    let node = func @node
    let cases = map @cases, #(case_)
      let case-node = func case_.node
      let case-body = func case_.body
      if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_
    let default-case = if @default-case then func @default-case else @default-case
    if node != @node or cases != @cases or default-case != @default-case
      SwitchNode @start-index, @end-index, @scope-id, node, cases, default-case
    else
      this
  def is-statement() -> true
node-class SyntaxChoiceNode(choices as [Node])
node-class SyntaxManyNode(inner as Node, multiplier as String)
node-class SyntaxParamNode(ident as Node, as-type as Node|void)
  def walk(func)
    let ident = func @ident
    let as-type = if @as-type? then func @as-type else @as-type
    if ident != @ident or as-type != @as-type
      SyntaxParamNode @start-index, @end-index, @scope-id, ident, as-type
    else
      this
node-class SyntaxSequenceNode(params as [Node])
node-class ThisNode
  def cacheable = false
node-class ThrowNode(node as Node)
  def type() -> Type.none
  def is-statement() -> true
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      ThrowNode @start-index, @end-index, @scope-id, node
    else
      this
node-class TmpNode(id as Number, name as String, _type as Type = Type.any)
  def cacheable = false
  def type() -> @_type
node-class TmpWrapperNode(node as Node, tmps as Array)
  def type(o) -> @node.type(o)
  def _reduce(o)
    let node = @node.reduce(o)
    if @tmps.length == 0
      node
    else if @node != node
      TmpWrapperNode @start-index, @end-index, @scope-id, node, @tmps
    else
      this
  def is-statement() -> @node.is-statement()
node-class TryCatchNode(try-body as Node, catch-ident as Node, catch-body as Node)
  def type(o) -> @_type ?= @try-body.type(o).union(@catch-body.type(o))
  def is-statement() -> true
node-class TryFinallyNode(try-body as Node, finally-body as Node)
  def type(o) -> @try-body.type(o)
  def _reduce(o)
    let try-body = @try-body.reduce(o)
    let finally-body = @finally-body.reduce(o)
    if finally-body instanceof NothingNode
      try-body
    else if try-body instanceof NothingNode
      finally-body
    else if try-body != @try-body or finally-body != @finally-body
      TryFinallyNode @start-index, @end-index, @scope-id, try-body, finally-body
    else
      this
  def is-statement() -> true
node-class TypeArrayNode(subtype as Node)
node-class TypeFunctionNode(return-type as Node)
node-class TypeUnionNode(types as [Node])
node-class UnaryNode(op as String, node as Node)
  def type = do
    let ops =
      "-": Type.number
      "+": Type.number
      "--": Type.number
      "++": Type.number
      "!": Type.boolean
      "~": Type.number
      typeof: Type.string
      delete: Type.boolean
    # -> ops![@op] or Type.any
  def _reduce = do
    let const-ops =
      "-": #(x) -> ~-x
      "+": #(x) -> ~+x
      "!": (not)
      "~": (~bitnot)
      typeof: (typeof)
    let nonconst-ops =
      "+": #(node, o)
        if node.type(o).is-subset-of Type.number
          node
      "-": #(node)
        if node instanceof UnaryNode
          if node.op in ["-", "+"]
            UnaryNode @start-index, @end-index, @scope-id, if node.op == "-" then "+" else "-", node.node
        else if node instanceof BinaryNode
          if node.op in ["-", "+"]
            BinaryNode @start-index, @end-index, @scope-id, node.left, if node.op == "-" then "+" else "-", node.right
          else if node.op in ["*", "/"]
            BinaryNode @start-index, @end-index, @scope-id, UnaryNode(@start-index, node.left.end-index, node.left.scope-id, "-", node.left), node.op, node.right
      "!": do
        let invertible-binary-ops =
          "<": ">="
          "<=": ">"
          ">": "<="
          ">=": "<"
          "==": "!="
          "!=": "=="
          "===": "!=="
          "!==": "==="
          "&&": #(x, y) -> BinaryNode @start-index, @end-index, @scope-id, UnaryNode(x.start-index, x.end-index, x.scope-id, "!", x), "||", UnaryNode(y.start-index, y.end-index, y.scope-id, "!", y)
          "||": #(x, y) -> BinaryNode @start-index, @end-index, @scope-id, UnaryNode(x.start-index, x.end-index, x.scope-id, "!", x), "&&", UnaryNode(y.start-index, y.end-index, y.scope-id, "!", y)
        #(node, o)
          if node instanceof UnaryNode
            if node.op == "!" and node.node.type(o).is-subset-of(Type.boolean)
              node.node
          else if node instanceof BinaryNode
            if invertible-binary-ops ownskey node.op
              let invert = invertible-binary-ops[node.op]
              if typeof invert == \function
                invert@ this, node.left, node.right
              else
                BinaryNode @start-index, @end-index, @scope-id, node.left, invert, node.right
    
    #(o)
      let node = @node.reduce(o).do-wrap(o)
      let op = @op
      if node.is-const() and const-ops ownskey op
        return ConstNode @start-index, @end-index, @scope-id, const-ops[op](node.const-value())
      
      let result = nonconst-ops![op]@ this, node, o
      if result?
        return result.reduce(o)
      
      if node != @node
        UnaryNode @start-index, @end-index, @scope-id, op, node
      else
        this
node-class VarNode(ident as IdentNode|TmpNode, is-mutable as Boolean, as-type as Node|void)
  def _reduce(o)
    let ident = @ident.reduce(o)
    let as-type = if @as-type then @as-type.reduce(o) else @as-type
    if ident != @ident or as-type != @as-type
      VarNode @start-index, @end-index, @scope-id, ident, @is-mutable, as-type
    else
      this
node-class YieldNode(node as Node)
  def is-statement() -> true
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      YieldNode @start-index, @end-index, @scope-id, node
    else
      this

let without-repeats(array)
  let result = []
  let mutable last-item = void
  for item in array
    if item != last-item
      result.push item
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
    "$(errs[:-1].join ', '), or $(errs[errs.length - 1])"

let build-error-message(errors, last-token)
  "Expected $(build-expected errors), but $(last-token) found"

let parse(text, macros, options = {})
  if typeof text != \string
    throw TypeError "Expected text to be a string, got $(typeof! text)"
  
  let o = State text, macros?.clone(), options
  
  let result = try
    Root(o)
  catch e
    if e != SHORT_CIRCUIT
      throw e
  
  o.done-parsing := true
  
  if not result or o.index < o.data.length
    let {index, line, messages} = o.failures
    let last-token = if index < o.data.length
      JSON.stringify o.data.substring(index, index + 20)
    else
      "end-of-input"
    throw ParserError build-error-message(messages, last-token), o.data, index, line
  else
    {
      result: o.macro-expand-all(result).reduce(o)
      o.macros
    }
module.exports := parse
module.exports.ParserError := ParserError
module.exports.MacroError := MacroError
module.exports.Node := Node
module.exports.deserialize-prelude := #(data as String)
  let parsed = JSON.parse(data)
  let macros = MacroHolder()
  macros.deserialize(parsed)
  {
    result: NothingNode(0, 0, -1)
    macros
  }
let unique(array)
  let result = []
  for item in array
    if result.index-of(item) == -1
      result.push item
  result
module.exports.get-reserved-words := #(macros)
  unique [...RESERVED_IDENTS, ...(macros?.get-macro-and-operator-names?() or [])]
