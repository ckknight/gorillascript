import 'shared.gs'

require! ParserNode: './parser-nodes'
let {Value: LValue, Call: LCall, InternalCall: LInternalCall, Access: LAccess, Symbol: LSymbol} = ParserNode
require! Scope: './parser-scope'
require! MacroContext: './parser-macrocontext'
require! MacroHolder: './parser-macroholder'
require! Type: './types'
let {string-repeat} = require('./utils')
let {add-param-to-scope} = require('./parser-utils')
let {quote, unique, get-package-version} = require './utils'

const EMBED_OPEN_DEFAULT = "<%"
const EMBED_CLOSE_DEFAULT = "%>"
const EMBED_OPEN_WRITE_DEFAULT = "<%="
const EMBED_CLOSE_WRITE_DEFAULT = "%>"
const EMBED_OPEN_COMMENT_DEFAULT = "<%--"
const EMBED_CLOSE_COMMENT_DEFAULT = "--%>"
const EMBED_OPEN_LITERAL_DEFAULT = "<%@"
const EMBED_CLOSE_LITERAL_DEFAULT = "@%>"

let is-nothing(node)
  node instanceof LSymbol.nothing

class ParserError extends Error
  def constructor(mutable @message as String = "", parser as Parser|null, @index as Number = 0)
    if DEBUG and message and not parser
      throw TypeError("Expected parser to be a Parser, got $(typeof! parser)")
    if parser
      @source := parser.source
      @filename := parser.options.filename
      let pos = parser.get-position(index)
      @line := pos.line
      @column := pos.column
      @message := message & " at $(if @filename then @filename & ':' else '')$(@line):$(@column)"
    else
      @line := 0
      @column := 0
    let err = super(@message)
    if is-function! Error.capture-stack-trace
      Error.capture-stack-trace this, ParserError
    else if err haskey \stack
      @stack := err.stack
  def name = "ParserError"

class MacroError extends Error
  def constructor(inner as Error|String = "", parser as Parser|null, @index as Number = 0)
    if DEBUG and inner and not parser
      throw TypeError("Expected parser to be a Parser, got $(typeof! parser)")
    if parser
      @source := parser.source
      @filename := parser.options.filename
      let pos = parser.get-position(index)
      @line := pos.line
      @column := pos.column
      let msg = []
      if inner instanceof Error
        if typeof! inner != "Error"
          msg.push typeof! inner
          msg.push ": "
        msg.push String inner.message
      else
        msg.push String inner
      msg.push " at "
      if @filename
        msg.push String @filename
        msg.push ":"
      @_message := msg.join("")
      msg.push @line
      msg.push ":"
      msg.push @column
      @message := msg.join("")
    else
      @line := 0
      @column := 0
      @_message := ""
      @message := ""
    let err = super(@message)
    if is-function! Error.capture-stack-trace
      Error.capture-stack-trace this, MacroError
    else if err haskey \stack
      @stack := err.stack
    if inner instanceof Error
      @inner := inner
  def name = "MacroError"
  def set-position(line as Number, column as Number)!
    if true
      // FIXME: disabling this for now
      return
    @line := line
    @column := column
    @message := "$(@_message)$line:$column"

macro C(string, index)
  index ?= AST 0
  AST $string.char-code-at $index

class Box
  def constructor(@index as Number, @value)
    if index not %% 1 or index < 0
      throw RangeError "Expected index to be a non-negative integer, got $index"

let unused-caches = if DEBUG then Map()

let cache = do
  let mutable id = -1
  #(rule as ->)
    if DEBUG and arguments.length > 1
      throw Error "Expected only one argument"
    let cache-key = (id += 1)
    let f(parser, index)
      let cache = parser.cache
      let indent = parser.indent.peek()
      let indent-cache = (cache[indent] ?= [])
      // 16 was the best cache number I could find after running performance benchmarks
      let inner = (indent-cache[index ~% 16] ?= [])
      let item = inner[cache-key]
      if item and item.start == index
        if DEBUG
          unused-caches.delete f
        item.result
      else
        let result = rule parser, index
        if DEBUG
          if parser.indent.peek() != indent
            throw Error "Changed indent during cache process: from $indent to $(_indent.peek(o))"
          else if result and result not instanceof Box
            throw Error "Expected result to be a Box, got $(typeof! result)"
        inner[cache-key] := {
          start: index
          result
        }
        result
    if DEBUG
      unused-caches.set f, Error().stack
    f

macro define
  syntax name as Identifier, value as (("=", this as Expression)|FunctionDeclaration)
    AST let $name = cache $value

macro redefine
  syntax name as Identifier, value as (("=", this as Expression)|FunctionDeclaration)
    AST $name := cache $value

let identity(x) -> x
let make-return(x) -> #-> x

let wrap = if DEBUG
  let mutable wrap-indent = -1
  #(name as String, func as ->)
    let inspect = require('util').inspect
    #(parser, index)
      wrap-indent += 1
      let indent-text = string-repeat(" ", wrap-indent)
      try
        let pos = parser.get-position(index)
        console.log "$(indent-text)$name: begin at $(pos.line):$(pos.column): $(inspect parser.source.substring(index, index ~+ 20))"
        try
          let result = func parser, index
          if result
            let new-pos = parser.get-position(result.index)
            console.log "$(indent-text)$name: done  at $(pos.line):$(pos.column) -> $(new-pos.line):$(new-pos.column), $(inspect result.value)"
          else
            console.log "$(indent-text)$name: fail  at $(pos.line):$(pos.column)"
          return result
        catch e
          console.log "$(indent-text)$name: ERROR $(pos.line):$(pos.column) !!! $(String e)"
          throw e
      finally
        wrap-indent -= 1
else
  #(name as String, func as ->) -> func

macro wrap!(name, rule)
  if name.is-ident
    rule := name
    name := @const rule.name
  ASTE if DEBUG then wrap($name, $rule) else $rule

let from-char-code = do
  let f = String.from-char-code
  #(char-code) as String
    if char-code ~> 0xFFFF
      f(((char-code ~- 0x10000) ~bitrshift 10) ~+ 0xD800) ~& f(((char-code ~- 0x10000) ~% 0x400) ~+ 0xDC00)
    else
      f char-code
let process-char-codes(codes as [], array = [], start = 0) as [String]
  for code in codes[start to -1]
    array.push from-char-code code
  array

let codes-to-string(codes as []) as String
  process-char-codes(codes).join ""

let make-alter-stack<T>(name as String, value as T) -> #(rule as ->) -> #(parser, index)
  let stack as Stack<T> = parser[name]
  stack.push value
  try
    return rule(parser, index)
  finally
    stack.pop()

let chars-to-fake-set(array) as {}
  let obj = { extends null }
  for item in array
    if is-number! item
      obj[item] := true
    else
      for c in item[0] to item[1]
        obj[c] := true
  obj

let stack-wrap(func as ->)
  if DEBUG
    func.stack := Error().stack
  func
macro stack-wrap!(func)
  @mutate-last func, (#(n)@ -> ASTE if DEBUG then stack-wrap($n) else $n), true

let character(name as String, expected as Number) -> stack-wrap! #(parser, index as Number)
  if C(parser.source, index) == expected
    Box index ~+ 1, expected
  else
    parser.fail name, index

let characters(name as String, expected as {}) -> stack-wrap! #(parser, index as Number)
  let c = C(parser.source, index)
  if expected[c]
    Box index ~+ 1, c
  else
    parser.fail name, index

let mutate(mutable mutator, rule as ->)^
  if DEBUG and arguments.length > 2
    throw Error "Expected only two arguments"
  if mutator == identity
    return rule
  if not is-function! mutator
    mutator := make-return mutator
  let f(parser, index as Number)
    let result = rule parser, index
    if result
      if DEBUG and result not instanceof Box
        throw TypeError "Expected result to be a Box, got $(typeof! result)"
      Box result.index, mutator result.value, parser, index, result.index
  f.rule := rule
  f.mutator := mutator
  stack-wrap! f
let bool(rule as ->)
  if DEBUG and arguments.length > 1
    throw Error "Expected only two arguments"
  if is-function! rule.mutator and is-function! rule.rule
    bool rule.rule
  else
    mutate #(x) -> not not x, rule

let multiple<T>(mutable rule as ->, mutable minimum as Number = 0, mutable maximum as Number = Infinity, ignore-value as Boolean)
  if DEBUG and arguments.length > 5
    throw Error "Expected only five arguments"
  if minimum not %% 1 or minimum < 0
    throw RangeError "Expected minimum to be a non-negative integer, got $minimum"
  if (maximum != Infinity and maximum not %% 1) or maximum < minimum
    throw RangeError "Expected maximum to be Infinity or an integer of at least $minimum, got $maximum"
  
  let mutable mutator = identity
  if is-function! rule.mutator and is-function! rule.rule and false
    mutator := rule.mutator
    rule := rule.rule
  
  stack-wrap! if ignore-value
    #(parser, mutable index as Number)
      let mutable count = 0
      while count < maximum
        let item = rule parser, index
        if not item
          if count < minimum
            return
          else
            break
        if DEBUG
          if item not instanceof Box
            throw TypeError "Expected item to be a Box, got $(typeof! item)"
          if item.value not instanceof T
            throw TypeError "Expected item.value to be a $(__name T), got $(typeof! item.value)"
        count += 1
        let new-index = item.index
        if new-index == index
          throw Error "Infinite loop detected"
        else
          index := new-index
      Box index, count
  else if mutator == identity
    #(parser, mutable index as Number)
      let result = []
      let mutable count = 0
      while count < maximum
        let item = rule parser, index
        if not item
          if count < minimum
            return
          else
            break
        if DEBUG
          if item not instanceof Box
            throw TypeError "Expected item to be a Box, got $(typeof! item)"
          if item.value not instanceof T
            throw TypeError "Expected item.value to be a $(__name T), got $(typeof! item.value)"
        result[count] := item.value
        count += 1
        let new-index = item.index
        if new-index == index
          throw Error "Infinite loop detected"
        else
          index := new-index
      Box index, result
  else
    mutate(
      #(items, parser, index)
        return for item in items
          mutator item.value, parser, item.start-index, item.end-index
      #(parser, mutable index as Number)
        let result = []
        let mutable count = 0
        while count < maximum
          let item = rule parser, index
          if not item
            if count < minimum
              return
            else
              break
          if DEBUG
            if item not instanceof Box
              throw TypeError "Expected item to be a Box, got $(typeof! item)"
            if item.value not instanceof T
              throw TypeError "Expected item.value to be a $(__name T), got $(typeof! item.value)"
          let new-index = item.index
          result[count] := {
            start-index: index
            end-index: new-index
            item.value
          }
          if new-index == index
            throw Error "Infinite loop detected"
          else
            index := new-index
          count += 1
        Box index, result)

let zero-or-more<T>(rule, ignore-value) -> multiple<T> rule, 0, Infinity, ignore-value
let one-or-more<T>(rule, ignore-value) -> multiple<T> rule, 1, Infinity, ignore-value

let maybe(rule as ->, mutable default-value)
  if DEBUG and arguments.length > 2
    throw Error "Expected only two arguments"
  let MISSING = {}
  if is-function! rule.mutator and is-function! rule.rule and false
    let subrule = rule.rule
    let mutator = rule.mutator
    mutate(
      if is-function! default-value
        #(value, parser, start-index, end-index)
          if value == MISSING
            default-value parser, start-index
          else
            mutator value, parser, start-index, end-index
      else
        #(value, parser, start-index, end-index)
          if value == MISSING
            default-value
          else
            mutator value, parser, start-index, end-index
      stack-wrap! #(parser, index as Number) -> subrule(parser, index) or Box index, MISSING)
  else
    if is-function! default-value
      mutate(
        #(value, parser, start-index, end-index)
          if value == MISSING
            default-value parser, start-index
          else
            value
        stack-wrap! #(parser, index as Number) -> rule(parser, index) or Box index, MISSING)
    else
      stack-wrap! #(parser, index as Number) -> rule(parser, index) or Box index, default-value

let one-of<T>(...rules as [Function])
  switch rules.length
  case 0
    throw Error "Expected rules to be non-empty"
  case 1
    rules[0]
  default
    let expanded-rules = []
    for rule in rules
      if rule.one-of
        for subrule in rule.one-of
          expanded-rules.push subrule
      else
        expanded-rules.push rule
    let func(parser, index as Number)!
      for rule, i in expanded-rules
        let result = rule parser, index
        if result
          if DEBUG
            if result not instanceof Box
              throw TypeError "Expected rules[$i] to return a Box, got $(typeof! result)"
            if result.value not instanceof T
              throw TypeError "Expected rules[$i]'s return value to be a $(__name T), got $(typeof! result.value)"
          return result
    func.one-of := expanded-rules
    stack-wrap! func

let zero-or-more-of<T>(...rules) -> zero-or-more<T> one-of<T> ...rules
let one-or-more-of<T>(...rules) -> one-or-more<T> one-of<T> ...rules

let check(mutable rule as ->)
  if is-function! rule.mutator and is-function! rule.rule and false
    rule := rule.rule
  #(parser, index as Number)
    let result = rule parser, index
    if result
      if DEBUG and result not instanceof Box
        throw TypeError "Expected result to be a Box, got $(typeof! result)"
      Box index

let SHORT_CIRCUIT = {}
let sequential<T>(...items) as (->)
  if items.length == 0
    throw Error "Expected items to be non-empty"

  
  if items.length == 1
    if is-array! items[0]
      if items[0][0] == \this
        return items[0][1]
    else
      if is-function! items[0]
        let rule = items[0]
        return #(parser, mutable index as Number)
          let item = rule parser, index
          if not item
            return
          if DEBUG and item not instanceof Box
            throw TypeError "Expected item to be a Box, got $(typeof! item)"
          Box item.index
  
  let rules = []
  let mapping = []
  let keys = []
  let mutations = []
  let mutable this-index = -1
  let mutable has-other = false
  let mutable short-circuit-index = Infinity
  let mutable has-mutations = false
  for item, i in items
    let mutable key = void
    let mutable rule = void
    if is-array! item
      if item.length != 2
        throw Error "Found an array with $(item.length) length at index #$i"
      unless is-string! item[0]
        throw TypeError "Array in index #$i has an improper key: $(typeof! item[0])"
      unless is-function! item[1]
        throw TypeError "Array in index #$i has an improper rule: $(typeof! item[1])"
      key := item[0]
      if key in keys
        throw Error "Can only have one $(JSON.stringify key) key in sequential"
      keys.push key
      rule := item[1]
      if key == \this
        this-index := rules.length
      else
        has-other := true
    else if is-function! item
      rule := item
    else if item == SHORT_CIRCUIT
      if short-circuit-index != Infinity
        throw Error "Can only have one SHORT_CIRCUIT per sequential"
      short-circuit-index := i
      continue
    else
      throw TypeError "Found a non-array, non-function in index #$i: $(typeof! item)"
  
    if key and is-function! rule.mutator and is-function! rule.rule and false
      has-mutations := true
      mutations.push rule.mutator
      rules.push rule.rule
    else
      mutations.push null
      rules.push rule
    mapping.push key
  
  stack-wrap! if this-index != -1
    if has-other
      throw Error "Cannot specify both the 'this' key and another key"
    if not has-mutations
      #(parser, mutable index as Number)
        let mutable result = void
        for rule, i in rules
          let item = rule parser, index
          if not item
            if i < short-circuit-index
              return
            else
              throw SHORT_CIRCUIT
          if DEBUG and item not instanceof Box
            throw TypeError "Expected item to be a Box, got $(typeof! item)"

          index := item.index
          if i == this-index
            result := item.value
        if DEBUG and result not instanceof T
          throw TypeError "Expected result to be a $(__name T), got $(typeof! result)"
        Box index, result
    else
      let mutator = mutations[this-index]
      mutate(
        #(item, parser, index)
          mutator item.value, parser, item.start-index, item.end-index
        #(parser, mutable index as Number)
          let mutable result = void
          let mutable value-index = 0
          for rule, i in rules
            let item = rule parser, index
            if not item
              if i < short-circuit-index
                return
              else
                throw SHORT_CIRCUIT
            if DEBUG and item not instanceof Box
              throw TypeError "Expected item to be a Box, got $(typeof! item)"

            if i == this-index
              result := {
                item.value
                start-index: index
                end-index: item.index
              }
            index := item.index
          if DEBUG and result not instanceof T
            throw TypeError "Expected result to be a $(__name T), got $(typeof! result)"
          Box index, result)
  else if has-other
    if has-mutations
      mutate(
        #(value, parser, index)
          let result = {}
          for key, i in keys
            if key
              let item = value[key]
              let mutator = mutations[i]
              if mutator
                result[key] := mutator item.value, parser, item.start-index, item.end-index
              else
                result[key] := item.value
          result
        #(parser, mutable index as Number)
          let mutable result = {}
          let indexes = {}
          for rule, i in rules
            let item = rule parser, index
            if not item
              if i < short-circuit-index
                return
              else
                throw SHORT_CIRCUIT

            if DEBUG and item not instanceof Box
              throw TypeError "Expected item to be a Box, got $(typeof! item)"
            let key = mapping[i]
            if key
              result[key] := {
                item.value
                start-index: index
                end-index: item.index
              }
            index := item.index
          Box index, result)          
    else
      #(parser, mutable index as Number)
        let mutable value = {}
        let mutable i = 0
        let mutable length = rules.length
        while i ~< length, i += 1
          let rule = rules[i]
          let item = rule parser, index
          if not item
            if i < short-circuit-index
              return
            else
              throw SHORT_CIRCUIT
      
          if DEBUG and item not instanceof Box
            throw TypeError "Expected item to be a Box, got $(typeof! item)"
          index := item.index
          let key = mapping[i]
          if key
            value[key] := item.value
        Box index, value
  else
    if has-mutations
      throw Error "Cannot use a mutator on a sequential without keys"
    #(parser, mutable index as Number)
      for rule, i in rules
        let item = rule parser, index
        if not item
          if i < short-circuit-index
            return
          else
            throw SHORT_CIRCUIT
      
        if DEBUG and item not instanceof Box
          throw TypeError "Expected item to be a Box, got $(typeof! item)"
        index := item.index
      Box index

let cons<T>(head-rule as ->, tail-rule as ->)
  if DEBUG and arguments.length > 2
    throw Error "Expected only two arguments"
  stack-wrap! #(parser, mutable index as Number)
    let head = head-rule parser, index
    if not head
      return
    if DEBUG
      if head not instanceof Box
        throw TypeError "Expected head to be a Box, got $(typeof! head)"
      else if head.value not instanceof T
        throw TypeError "Expected head.value to be a $(__name T), got $(typeof! head.value)"
    let tail = tail-rule parser, head.index
    if not tail
      return
    if DEBUG
      if tail not instanceof Box
        throw TypeError "Expected tail to be a Box, got $(typeof! tail)"
      if not is-array! tail.value
        throw TypeError "Expected tail.value to be a Box, got $(typeof! tail.value)"
      for item, i in tail.value by -1
        if item not instanceof T
          throw TypeError "Expected tail.value[$i] to be a $(__name T), got $(typeof! item)"
    Box tail.index, [head.value].concat(tail.value)

let concat<T>(left-rule as ->, right-rule as ->)
  if DEBUG and arguments.length > 2
    throw Error "Expected only two arguments"
  stack-wrap! #(parser, mutable index as Number)
    let left = left-rule parser, index
    if not left
      return
    if DEBUG
      if left not instanceof Box
        throw TypeError "Expected left to be a Box, got $(typeof! left)"
      if not is-array! left.value
        throw TypeError "Expected left.value to be a Box, got $(typeof! left.value)"
      for item, i in left.value by -1
        if item not instanceof T
          throw TypeError "Expected left.value[$i] to be a $(__name T), got $(typeof! item)"
    let right = right-rule parser, left.index
    if not right
      return
    if DEBUG
      if right not instanceof Box
        throw TypeError "Expected right to be a Box, got $(typeof! right)"
      if not is-array! right.value
        throw TypeError "Expected right.value to be a Box, got $(typeof! right.value)"
      for item, i in right.value by -1
        if item not instanceof T
          throw TypeError "Expected right.value[$i] to be a $(__name T), got $(typeof! item)"
    Box right.index, left.value.concat(right.value)

let nothing-rule(parser, index) -> Box index
let separated-list<T>(item-rule as ->, separator-rule as -> = nothing-rule, tail-rule as -> = item-rule)
  if DEBUG and arguments.length > 3
    throw Error "Expected only three arguments"
  stack-wrap! #(parser, mutable index as Number)
    let head = item-rule parser, index
    if not head
      return
    if DEBUG
      if head not instanceof Box
        throw TypeError "Expected head to be a Box, got $(typeof! head)"
      else if head.value not instanceof T
        throw TypeError "Expected head.value to be a $(__name T), got $(typeof! head.value)"
    let mutable current-index = head.index
    let result = [head.value]
    let mutable i = 0
    while true, i += 1
      let separator = separator-rule parser, current-index
      if not separator
        break
      if DEBUG and separator not instanceof Box
        throw TypeError "Expected separator to be a Box, got $(typeof! separator)"
      let item = tail-rule parser, separator.index
      if not item
        break
      if DEBUG
        if item not instanceof Box
          throw TypeError "Expected item to be a Box, got $(typeof! item)"
        else if item.value not instanceof T
          throw TypeError "Expected head.value to be a $(__name T), got $(typeof! item.value)"
      let new-index = item.index
      if new-index == current-index
        throw Error "Infinite loop detected"
      else
        current-index := new-index
      result.push item.value
    Box current-index, result

let except(mutable rule as ->)
  if DEBUG and arguments.length > 1
    throw Error "Expected only one argument"
  if is-function! rule.mutator and is-function! rule.rule and false
    rule := rule.rule
  stack-wrap! #(parser, index as Number)
    if not rule parser, index
      Box index

let any-except(mutable rule as ->)
  if DEBUG and arguments.length > 1
    throw Error "Expected only one argument"
  if is-function! rule.mutator and is-function! rule.rule and false
    rule := rule.rule
  stack-wrap! #(parser, index as Number)
    if not rule parser, index
      AnyChar parser, index

macro character!(chars, name)
  chars := @macro-expand-1 chars
  if chars.is-const()
    unless chars.is-const-type \string
      @error "Must provide a literal array or string", chars
  else if not chars.is-internal-call \array
    @error "Must provide a literal array or string", chars
  let codes = []
  if chars.is-const()
    chars := chars.const-value()
    for i in 0 til chars.length
      codes.push C(chars, i)
  else
    for part in chars.args by -1
      if part.is-internal-call \array
        if part.args.length != 2
          @error "Sub-arrays must be length 2", part
        let [mutable left, mutable right] = part.args
        unless left.is-const() and right.is-const()
          @error "Sub-arrays must contain constant strings or numbers", part
        left := left.const-value()
        right := right.const-value()
        if is-string! left
          if left.length != 1
            throw Error "Expected a string of length 1"
          left := C(left)
        else if not is-number! left
          throw Error "Expected a string or number"
        if is-string! right
          if right.length != 1
            throw Error "Expected a string of length 1"
          right := C(right)
        else if not is-number! left
          throw Error "Expected a string or number"
        if left > right
          throw Error "left must be less than or equal to right"
        for i in left to right
          codes.push i
      else if part.is-const()
        let mutable value = part.const-value()
        if is-string! value
          for i in 0 til value.length
            codes.push C(value, i)
        else if is-number! value
          codes.push value
        else
          @error "Expected a string or number", part
      else
        @error "Array values must be length-2 Arrays or constant Strings or Numbers", part
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
  
  if chunks.length == 1 and chunks[0].start == chunks[0].end
    let code = chunks[0].start
    if not name
      let ch = String.from-char-code chunks[0].start
      name := if ch == '"' then "'\"'" else (JSON.stringify ch)
    ASTE character $name, $code
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
    let mutable array = []
    for chunk in chunks
      if chunk.start == chunk.end
        array.push @const chunk.start
      else if chunk.start == chunk.end - 1
        array.push @const chunk.start
        array.push @const chunk.end
      else
        array.push @internal-call \array, @const(chunk.start), @const(chunk.end)
    array := @internal-call \array, array
    ASTE characters $name, chars-to-fake-set($array)

let SpaceChar = character! [
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
define SpaceChars = zero-or-more(SpaceChar, true)

let Zero = character! "0"
let DecimalDigit = character! "0123456789"
let Period = character! "."
let ColonChar = character! ":"
define DoubleColonChar = sequential(ColonChar, ColonChar) |> mutate "::"
let PipeChar = character! "|"
let EqualChar = character! "="
let MinusChar = character! "-"
let PlusChar = character! "+"
let PlusOrMinusChar = character! "+-"
let Letter = character! [
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
let NumberChar = character! [
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
let Underscore = character! "_"
let DollarSignChar = character! '$'
let AtSignChar = character! "@"
let HashSignChar = character! "#"
let PercentSignChar = character! "%"
let EqualSignChar = character! "="
let SymbolChar = character! [
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
let DoubleQuote = character! '"'
let SingleQuote = character! "'"
define TripleDoubleQuote = multiple DoubleQuote, 3, 3, true
define TripleSingleQuote = multiple SingleQuote, 3, 3, true
let SemicolonChar = character! ";"
let AsterixChar = character! "*"
let CaretChar = character! "^"
let OpenSquareBracketChar = character! "["
let OpenCurlyBraceChar = character! "{"
let CloseCurlyBraceChar = character! "}"
let OpenParenthesisChar = character! "("
let BackslashChar = character! "\\"
let CommaChar = character! ","

let AnyChar(parser, mutable index)
  let source = parser.source
  if index ~>= source.length
    parser.fail "any", index
  else
    let mutable c = C(source, index)
    if c == C("\r") and C(source, index ~+ 1) == C("\n")
      index ~+= 1
      c := C("\n")
    Box index ~+ 1, c

let Newline(parser, mutable index)
  let source = parser.source
  let mutable c = C(source, index)
  if c == C("\r")
    if C(source, index ~+ 1) == C("\n")
      index ~+= 1
      c := C("\n")
  else if c not in [C("\n"), 0x2028, 0x2029]
    return
  Box index ~+ 1, c

let Eof(parser, index) -> if index ~>= parser.source.length then Box index
let CheckStop = one-of(
  Newline
  Eof
  #(parser, index)
    EmbeddedClose(parser, index) or EmbeddedCloseWrite(parser, index))

define MaybeComment = do
  let SingleLineComment(parser, mutable index)
    let source = parser.source
    if C(source, index) == C("/") and C(source, index ~+ 1) == C("/")
      let len = source.length
      index ~+= 2
      while true, index ~+= 1
        if index ~>= len or C(source, index) in [C("\r"), C("\n"), 0x2028, 0x2029]
          return Box index
  
  let MultiLineComment(parser, mutable index)
    let source = parser.source
    let start-index = index
    if C(source, index) == C("/") and C(source, index ~+ 1) == C("*") and C(source, index ~+ 2) != C("!")
      let len = source.length
      index ~+= 2
      while true, index ~+= 1
        if index ~>= len
          throw ParserError "Multi-line comment never ends", parser, start-index
        if C(source, index) == C("*") and C(source, index ~+ 1) == C("/")
          return Space parser, index ~+ 2
  
  maybe one-of SingleLineComment, MultiLineComment

define Space = sequential SpaceChars, MaybeComment

let with-space(rule as ->) -> sequential Space, [\this, rule]

define NoSpace = except SpaceChar
define EmptyLine = with-space Newline
define EmptyLines = zero-or-more EmptyLine, true
define SomeEmptyLines = one-or-more EmptyLine, true
let EmptyLinesSpace = sequential(EmptyLines, Space)
let NoSpaceNewline = except EmptyLine

define OpenParenthesis = with-space character! "("
define CloseParenthesis = with-space character! ")"
define OpenSquareBracket = with-space OpenSquareBracketChar
define CloseSquareBracket = with-space character! "]"
define OpenCurlyBrace = with-space OpenCurlyBraceChar
define CloseCurlyBrace = with-space CloseCurlyBraceChar

let EqualSign = with-space EqualSignChar
define PercentSign = with-space PercentSignChar
define DollarSign = with-space DollarSignChar

define Comma = with-space CommaChar
define MaybeComma = maybe Comma
let CommaOrNewline = one-of(
  sequential(
    [\this, Comma]
    EmptyLines)
  SomeEmptyLines)
define MaybeCommaOrNewline = maybe CommaOrNewline

let _SomeEmptyLinesWithCheckIndent = sequential(
  SomeEmptyLines
  CheckIndent)

define SomeEmptyLinesWithCheckIndent = #(parser, index)
  if parser.options.noindent
    EmptyLines parser, index
  else
    _SomeEmptyLinesWithCheckIndent parser, index

define CommaOrSomeEmptyLinesWithCheckIndent = one-of(
  sequential(
    Comma
    maybe SomeEmptyLinesWithCheckIndent)
  SomeEmptyLinesWithCheckIndent)

define ExclamationPointChar = character! "!"
define MaybeExclamationPointChar = maybe ExclamationPointChar
define MaybeAtSignChar = maybe AtSignChar

define Colon = sequential(
  Space
  [\this, ColonChar]
  except ColonChar)

define ColonNewline = sequential(
  Colon
  Space
  [\this, Newline])

define NotColon = except Colon
define NotColonUnlessNoIndentAndNewline(parser, index)
  let options = parser.options
  if options.noindent
    if ColonNewline parser, index
      return Box index
    else if options.embedded
      if ColonEmbeddedClose(parser, index) or ColonEmbeddedCloseWrite(parser, index)
        return Box index
  NotColon parser, index

define NameStart = one-of Letter, Underscore, DollarSignChar
define NameChar = one-of NameStart, NumberChar
define NamePart = one-or-more NameChar

define Nothing(parser, index) -> Box index, LSymbol.nothing index
// these will be redefined later, which is why they're calling themselves (their future versions)
let mutable Expression = #(parser, index) -> Expression(parser, index)
let mutable Statement = #(parser, index) -> Statement(parser, index)
let mutable Body = #(parser, index) -> Body(parser, index)
let mutable BodyNoEnd = #(parser, index) -> BodyNoEnd(parser, index)
let mutable Logic = #(parser, index) -> Logic(parser, index)

let End(parser, index)
  if parser.options.noindent
    EndNoIndent parser, index
  else
    Box index

define _Name = separated-list(
  cons NameStart, zero-or-more NameChar
  MinusChar
  NamePart) |> mutate #(items)
  let parts = process-char-codes items[0]
  for item in items[1 to -1]
    parts.push from-char-code(item[0]).to-upper-case()
    process-char-codes item, parts, 1
  parts.join ""

define Name = with-space _Name

define _Symbol = one-or-more(SymbolChar) |> mutate codes-to-string

define Symbol = with-space _Symbol

define ColonEqual = with-space sequential(ColonChar, EqualSignChar) |> mutate ":="
define NameOrSymbol = with-space one-of(
  with-space(one-or-more-of(_Name, _Symbol)) |> mutate #(parts) -> parts.join ""
  ColonEqual)

define MacroName = with-space sequential(
  [\this, NameOrSymbol]
  NotColonUnlessNoIndentAndNewline)
let MacroNames = separated-list<String> MacroName, Comma

define UseMacro(parser, index)
  let name = MacroName parser, index
  if not name
    return
  
  let m = parser.get-macro-by-name name.value
  if not m
    return
  
  let result = m parser, index
  if not result
    throw SHORT_CIRCUIT
  result

let rule-equal(rule as ->, text as String)
  let failure-message = JSON.stringify text
  #(parser, index)
    let result = rule parser, index
    if result and result.value == text
      result
    else
      parser.fail failure-message, index

let memoize(func as String ->)
  let cache = { extends null }
  #(key as String)
    if cache ownskey key
      cache[key]
    else
      cache[key] := func(key)
let word = memoize #(text as String) -> rule-equal Name, text
let symbol = memoize #(text as String) -> rule-equal Symbol, text
let macro-name = memoize #(text as String) -> rule-equal MacroName, text

let word-or-symbol = memoize #(text as String)
  let parts = [Space]
  for part, i in text.split r"([a-z]+)"ig
    if part
      parts.push rule-equal if i %% 2 then _Symbol else _Name, part
  
  sequential(...parts) |> mutate text

let INDENTS = { extends null
  [C "\t"]: 4
  [C " "]: 1
}
let CountIndent = zero-or-more(SpaceChar) |> mutate #(spaces)
  let mutable count = 0
  for c in spaces by -1
    let indent = INDENTS[c]
    if not indent
      throw Error "Unexpected indent char: $(JSON.stringify c)"
    count += indent
  count

let IndentationRequired(parser, index)
  if not parser.options.noindent
    Box index

let CheckIndent(parser, index)
  let count = CountIndent parser, index
  if parser.options.noindent or count.value == parser.indent.peek()
    count

let Advance(parser, index)
  if parser.options.noindent
    throw Error "Can't use Advance if in noindent mode"
  
  let count = CountIndent parser, index
  let count-value = count.value
  let {indent} = parser
  if count-value > indent.peek()
    indent.push count-value
    Box index, count-value

let MaybeAdvance(parser, index)
  let count = CountIndent parser, index
  parser.indent.push count.value
  Box index, count.value

let PushFakeIndent(n as Number) -> #(parser, index)
  let {indent} = parser
  indent.push indent.peek() ~+ n
  Box index, 0

let PopIndent(parser, index)
  let {indent} = parser
  if indent.can-pop()
    indent.pop()
    Box index
  else
    throw ParserError "Unexpected dedent", parser, index

let retain-indent(rule as ->) -> #(parser, index)
  let indent = parser.indent
  let count = indent.count()
  try
    return rule parser, index
  finally
    for i in count til indent.count()
      indent.pop()

define ThisLiteral = word("this") |> mutate #(, parser, index)
  LSymbol.ident index, parser.scope.peek(), \this

define ThisShorthandLiteral = with-space(AtSignChar) |> mutate #(, parser, index)
  LSymbol.ident index, parser.scope.peek(), \this

define ArgumentsLiteral = word("arguments") |> mutate #(, parser, index)
  LSymbol.ident index, parser.scope.peek(), \arguments

define ThisOrShorthandLiteral = one-of<ParserNode.Symbol>(ThisLiteral, ThisShorthandLiteral)
let ThisOrShorthandLiteralPeriod = one-of<ParserNode.Symbol>(
  sequential(
    [\this, ThisLiteral]
    Period)
  sequential(
    [\this, ThisShorthandLiteral]
    maybe Period))

let get-reserved-idents = do
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
  let RESERVED_IDENTS_NOINDENT = [...RESERVED_IDENTS, \end].sort()
  #(options)
    if options and options.noindent
      RESERVED_IDENTS_NOINDENT
    else
      RESERVED_IDENTS

define SpreadToken = with-space sequential(Period, Period, Period) |> mutate "..."
define MaybeSpreadToken = maybe SpreadToken

define SpreadOrExpression = sequential(
  [\spread, MaybeSpreadToken]
  [\node, Expression]) |> mutate #({spread, node}, parser, index)
  if spread == "..."
    LInternalCall \spread, index, parser.scope.peek(),
      node
  else
    node

let allow-space-before-access = make-alter-stack<Number>(\disallow-space-before-access, 0) << make-alter-stack<Boolean>(\inside-indented-access, false)
define ClosedArguments = sequential(
  OpenParenthesisChar
  Space
  [\this, allow-space-before-access concat<ParserNode>(
    maybe(sequential(
      [\this, separated-list<ParserNode>(
        SpreadOrExpression
        Comma)]
      MaybeComma), #-> [])
    maybe(retain-indent(sequential<Array>(
      SomeEmptyLines
      MaybeAdvance
      [\this, maybe(sequential(
        CheckIndent
        [\this, separated-list<ParserNode>(
          SpreadOrExpression
          CommaOrSomeEmptyLinesWithCheckIndent)]), #-> [])]
      EmptyLines
      MaybeCommaOrNewline
      PopIndent)), #-> []))]
  CloseParenthesis)

let disallow-space-before-access(rule)
  #(parser, index)
    let stack = parser.disallow-space-before-access
    stack.push stack.peek() + 1
    try
      return rule(parser, index)
    finally
      stack.pop()
define UnclosedArguments = disallow-space-before-access sequential(
  one-of(
    sequential(
      SpaceChar
      Space)
    check Newline)
  [\this, concat<ParserNode>(
    separated-list<ParserNode>(
      SpreadOrExpression
      Comma)
    one-of<Array>(
      sequential(
        IndentationRequired
        Comma
        SomeEmptyLines
        [\this, retain-indent sequential(
          Advance
          CheckIndent
          [\this, separated-list<ParserNode>(
            SpreadOrExpression
            CommaOrSomeEmptyLinesWithCheckIndent)]
          MaybeComma
          PopIndent
        )])
      MaybeComma |> mutate #-> []))])

define InvocationArguments = one-of(ClosedArguments, UnclosedArguments)
define Identifier = one-of(
  sequential(
    #(parser, index) -> if parser.in-ast.peek() then Box index
    DollarSign
    NoSpace
    [\this, InvocationArguments]) |> mutate #(args, parser, index)
    LCall index, parser.scope.peek(),
      LSymbol.ident index, parser.scope.peek(), '$'
      args
  #(parser, index)
    let name = Name parser, index
    if not name or name.value in get-reserved-idents(parser.options) or parser.has-macro-or-operator name.value or parser.scope.peek().has-const name.value
      parser.fail "identifier", index
    else
      Box name.index, LSymbol.ident index, parser.scope.peek(), name.value)

let make-digits-rule(digit as ->)
  separated-list(
    one-or-more digit
    one-or-more Underscore, true) |> mutate #(parts)
    let result = []
    for part in parts
      process-char-codes part, result
    result.join ""

define MaybeUnderscores = zero-or-more Underscore, true

let parse-radix-number(mutable integer as String, mutable fraction as String, radix as Number, mutable exponent as Number = 0)
  if exponent not %% 1
    throw RangeError("Expected exponent to be an integer, got $exponent")
  while exponent > 0
    integer &= fraction.char-at(0) or "0"
    fraction := fraction.substring(1)
    exponent -= 1
  while exponent < 0
    fraction := integer.slice(-1) & fraction
    integer := integer.slice(0, -1)
    exponent += 1
  let mutable current-value = 0
  for c in integer
    current-value := current-value * radix + parse-int c, radix
  if fraction
    let mutable fractional-value = 0
    let mutable fractional-exponent = 0
    for c, i in fraction
      if fractional-value >= 2^52 / radix
        break
      fractional-value := fractional-value * radix + parse-int c, radix
      fractional-exponent += 1
    current-value += fractional-value / radix ^ fractional-exponent
  current-value

define DecimalNumber = do
  let DecimalDigits = make-digits-rule DecimalDigit
  
  sequential(
    [\integer, DecimalDigits]
    [\fraction, maybe sequential(
      MaybeUnderscores
      Period
      MaybeUnderscores
      [\this, DecimalDigits]), ""]
    [\exponent, maybe (sequential(
      character! "eE"
      [\sign, maybe(PlusOrMinusChar)]
      [\digits, DecimalDigits]) |> mutate #({e, sign, digits})
        (if sign then from-char-code(sign) else "") & digits), ""]
    maybe sequential(
      Underscore
      maybe NamePart)) |> mutate #({integer, mutable fraction, mutable exponent}, parser, index, end-index)
    let value = parse-radix-number(integer, fraction, 10, if exponent then parse-int(exponent, 10) else 0)
    if not is-finite(value)
      throw ParserError "Unable to parse number $(quote parser.source.substring(index, end-index))", parser, index
    LValue index, value

let make-radix-number(radix as Number, separator as ->, digit as ->)
  let digits = make-digits-rule digit
  sequential(
    Zero
    [\separator, separator]
    SHORT_CIRCUIT
    [\integer, digits]
    [\fraction, maybe sequential(
      MaybeUnderscores
      Period
      MaybeUnderscores
      [\this, digits]), ""]
    MaybeUnderscores) |> mutate #({separator, integer, fraction}, parser, index, end-index)
    let value = parse-radix-number(integer, fraction, radix)
    if not is-finite value
      throw ParserError "Unable to parse number $(quote parser.source.substring(index, end-index))", parser, index
    LValue index, value

let HexDigit = character! "0123456789abcdefABCDEF"
define HexNumber = make-radix-number 16, character!("xX"), HexDigit
let OctalDigit = character! "01234567"
define OctalNumber = make-radix-number 8, character!("oO"), HexDigit
let BinaryDigit = character! "01"
define BinaryNumber = make-radix-number 2, character!("bB"), HexDigit

define RadixNumber = do
  let digits-cache = []
  let get-digits-rule(radix) -> digits-cache[radix] ?=
    let digit = switch radix
    case 2; BinaryDigit
    case 8; OctalDigit
    case 10; DecimalDigit
    case 16; HexDigit
    default
      let set = { extends null }
      for i in 0 til radix max 10
        set[i + C("0")] := true
      for i in 0 til (radix max 36) - 10
        set[i + C("A")] := true
        set[i + C("a")] := true
      let name = ["[0-"]
      name.push String.from-char-code (radix max 9) + C("0")
      if radix >= 10
        let letter-end = (radix max 36) - 10
        name.push "A-"
        name.push String.from-char-code letter-end + C("A")
        name.push "a-"
        name.push String.from-char-code letter-end + C("a")
      name.push "]"
      characters name.join(""), set
    make-digits-rule digit
  
  let Radix = multiple DecimalDigit, 1, 2
  let R = character!("rR")
  #(parser, index)
    let radix = Radix parser, index
    if not radix
      return
    let radix-value = codes-to-string(radix.value)
    
    let separator = R parser, radix.index
    if not separator
      return
    
    let radix-num = parse-int radix-value, 10
    if not is-finite radix-num
      throw ParserError "Unable to parse radix $(quote radix-value)", parser, index
    else if radix-num < 2
      throw ParserError "Radix must be at least 2, got $radix-num", parser, index
    else if radix-num > 36
      throw ParserError "Radix must be at most 36, got $radix-num", parser, index
    
    let digits-rule = get-digits-rule radix-num
    let integer = digits-rule parser, separator.index
    if not integer
      parser.fail "integer after radix", separator.index
      throw SHORT_CIRCUIT
    
    let mutable current-index = MaybeUnderscores(parser, integer.index).index
    let period = Period parser, current-index
    let mutable value = void
    if period
      let fraction = digits-rule parser, MaybeUnderscores(parser, period.index).index
      if fraction
        value := parse-radix-number(integer.value, fraction.value, radix-num)
        current-index := fraction.index
    if not value?
      value := parse-radix-number(integer.value, "", radix-num)
    if not is-finite value
      throw ParserError "Unable to parse number $(quote parser.source.substring(index, current-index))", parser, index
    let trailing = MaybeUnderscores(parser, current-index)
    Box trailing.index, LValue index, value

define NumberLiteral = with-space one-of(
  HexNumber
  OctalNumber
  BinaryNumber
  RadixNumber
  DecimalNumber)

define IdentifierNameConst(parser, index)
  let name = Name parser, index
  if name
    Box name.index, LValue index, name.value

define IdentifierNameConstOrNumberLiteral = one-of(IdentifierNameConst, NumberLiteral)

let make-const-literal(name as String, value)
  word(name) |> mutate #(, parser, index)
    LValue index, value

let HexEscapeSequence = sequential(
  character! "x"
  SHORT_CIRCUIT
  [\this, multiple HexDigit, 2, 2]) |> mutate #(digits)
  parse-int(codes-to-string(digits), 16)

let UnicodeEscapeSequence = sequential(
  character! "u"
  SHORT_CIRCUIT
  [\this, one-of(
    multiple(HexDigit, 4, 4) |> mutate #(digits)
      parse-int(codes-to-string(digits), 16)
    sequential(
      OpenCurlyBraceChar
      [\this, multiple(HexDigit, 1, 6)]
      CloseCurlyBraceChar) |> mutate #(digits, parser, index)
      let inner = codes-to-string(digits)
      let value = parse-int(inner, 16)
      if value > 0x10FFFF
        throw ParserError "Unicode escape sequence too large: '\\u{$inner}'", parser, index
      value)])

let SingleEscapeCharacter = do
  let ESCAPED_CHARACTERS = { extends null
    [C "b"]: C "\b"
    [C "f"]: C "\f"
    [C "r"]: C "\r"
    [C "n"]: C "\n"
    [C "t"]: C "\t"
    [C "v"]: C "\v"
  }
  one-of(
    Zero |> mutate 0
    AnyChar |> mutate #(c) -> ESCAPED_CHARACTERS[c] or c)

let BackslashEscapeSequence = sequential(
  BackslashChar
  SHORT_CIRCUIT
  [\this, one-of(
    HexEscapeSequence
    UnicodeEscapeSequence
    SingleEscapeCharacter)])

let in-expression = make-alter-stack<String> \position, \expression
let in-statement = make-alter-stack<String> \position, \statement
let AssignmentAsExpression = in-expression #(parser, index) -> Assignment parser, index
define ExpressionOrAssignment = one-of(AssignmentAsExpression, Expression)
define ExpressionOrAssignmentOrBody = one-of(ExpressionOrAssignment, Body)

let StringInterpolation = sequential(
  DollarSignChar
  NoSpace
  SHORT_CIRCUIT
  [\this, one-of(
    CustomConstantLiteral
    Identifier
    sequential(
      OpenParenthesis
      [\this, allow-space-before-access one-of(
        Expression
        Nothing)]
      CloseParenthesis))])

define SingleStringLiteral = sequential(
  SingleQuote
  SHORT_CIRCUIT
  [\this, zero-or-more-of(
    BackslashEscapeSequence
    any-except one-of(
      SingleQuote
      Newline))]
  SingleQuote) |> mutate #(codes, parser, index)
  LValue index, codes-to-string(codes)

let DoubleStringLiteralInner = zero-or-more-of(
  BackslashEscapeSequence
  StringInterpolation
  any-except one-of(
    DoubleQuote
    Newline))

let double-string-literal-handler = #(parts, parser, index)
  let string-parts = []
  let mutable current-literal = []
  for part in parts
    if is-number! part
      current-literal.push part
    else if not is-nothing(part)
      string-parts.push LValue index, codes-to-string(current-literal)
      current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push LValue index, codes-to-string(current-literal)
  string-parts

let concat-string(parser, index, parts as [ParserNode])
  let len = parts.length
  if len == 0
    return LValue index, ""
  else if len == 1 and parts[0].is-const-type(\string)
    return parts[0]
  
  let concat-op = parser.get-macro-by-label(\string-concat)
  if not concat-op
    throw Error "Cannot use string interpolation until the string-concat operator has been defined"
  
  if len == 1
    concat-op.func {
      left: LValue index, ""
      op: ""
      right: parts[0]
    }, parser, index
  else
    for reduce part in parts[1 to -1], current = parts[0]
      concat-op.func {
        left: current
        op: ""
        right: part
      }, parser, index

define DoubleStringLiteral = sequential(
  DoubleQuote
  SHORT_CIRCUIT
  [\this, DoubleStringLiteralInner]
  DoubleQuote) |> mutate #(parts, parser, index)
  let string-parts = for part in double-string-literal-handler parts, parser, index
    if not part.is-const-value("")
      part
  
  concat-string parser, index, string-parts

define DoubleStringArrayLiteral = sequential(
  PercentSignChar
  DoubleQuote
  SHORT_CIRCUIT
  [\this, DoubleStringLiteralInner]
  DoubleQuote) |> mutate #(parts, parser, index)
  let string-parts = double-string-literal-handler parts, parser, index
  LInternalCall \array, index, parser.scope.peek(), string-parts

let StringIndent(parser, index)
  let mutable count = 0
  let current-indent = parser.indent.peek()
  let mutable current-index = index
  while count < current-indent
    let c = SpaceChar parser, current-index
    if not c
      break
    current-index := c.index
    let indent-value = INDENTS[c.value]
    if not indent-value
      throw Error "Unexpected indent char: $(JSON.stringify c.value)"
    count ~+= indent-value
  if count > current-indent
    throw ParserError "Mixed tabs and spaces in string literal", parser, current-index
  else if count == current-indent or Newline(parser, current-index)
    Box current-index, count

let trim-right = if is-function! String::trim-right
  #(x) -> x.trim-right()
else
  #(x) -> x.replace r'\s+$', ""

let TripleSingleStringLine = zero-or-more-of(
  BackslashEscapeSequence
  any-except one-of(
    TripleSingleQuote
    Newline)) |> mutate #(codes) -> [trim-right codes-to-string(codes)]
let TripleDoubleStringLine = zero-or-more-of(
  BackslashEscapeSequence
  StringInterpolation
  any-except one-of(
    TripleDoubleQuote
    Newline)) |> mutate #(parts)
  let string-parts = []
  let mutable current-literal = []
  for part in parts
    if is-number! part
      current-literal.push part
    else if not is-nothing(part)
      if current-literal.length > 0
        string-parts.push codes-to-string(current-literal)
        current-literal := []
      string-parts.push part
  if current-literal.length > 0
    string-parts.push trim-right codes-to-string(current-literal)
  
  string-parts

let triple-string-handler(x, parser, index)
  let lines = [x.first]
  if lines[0].length == 0 or (lines[0].length == 1 and lines[0][0] == "")
    lines.shift()
  for j in 1 til x.num-empty-lines
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
  
  for i in string-parts.length - 2 to 0 by -1
    if is-string! string-parts[i] and is-string! string-parts[i + 1]
      string-parts.splice(i, 2, string-parts[i] ~& string-parts[i + 1])
  
  for part, i in string-parts
    if is-string! part
      string-parts[i] := LValue index, part
  
  string-parts

let make-triple-string(quote as ->, line as ->) -> sequential(
  quote
  SHORT_CIRCUIT
  [\first, line]
  [\num-empty-lines, zero-or-more(sequential(
    Space
    [\this, Newline]), true)]
  [\rest, maybe retain-indent(sequential(
    MaybeAdvance
    [\this, maybe separated-list(
      sequential(
        StringIndent
        [\this, line])
      Newline), #-> []]
    maybe Newline
    PopIndent)), #-> []]
  quote) |> mutate #(parts, parser, index)
    let string-parts = for part in triple-string-handler parts, parser, index
      if not part.is-const-value("")
        part
    
    concat-string parser, index, string-parts

define TripleSingleStringLiteral = make-triple-string TripleSingleQuote, TripleSingleStringLine
define TripleDoubleStringLiteral = make-triple-string TripleDoubleQuote, TripleDoubleStringLine
define TripleDoubleStringArrayLiteral = sequential(
  PercentSignChar
  TripleDoubleQuote
  SHORT_CIRCUIT
  [\first, TripleDoubleStringLine]
  [\num-empty-lines, zero-or-more(sequential(
    Space
    [\this, Newline]), true)]
  [\rest, maybe retain-indent(sequential(
    MaybeAdvance
    [\this, maybe sequential(
      StringIndent
      [\this, separated-list(
        TripleDoubleStringLine
        sequential(Newline, StringIndent))]), #-> []]
    maybe Newline
    PopIndent)), #-> []]
  TripleDoubleQuote) |> mutate #(parts, parser, index)
  let string-parts = triple-string-handler parts, parser, index
  
  LInternalCall \array, index, parser.scope.peek(), string-parts

define BackslashStringLiteral = sequential(
  BackslashChar
  NoSpace
  [\this, IdentifierNameConst])

define StringLiteral = with-space(one-of(
  BackslashStringLiteral
  TripleSingleStringLiteral
  TripleDoubleStringLiteral
  TripleDoubleStringArrayLiteral
  SingleStringLiteral
  DoubleStringLiteral
  DoubleStringArrayLiteral))

let RegexLiteral = do
  let LowerR = character! "r"
  let RegexFlags = zero-or-more(NameChar) |> mutate codes-to-string
  let NOTHING = {}
  let RegexComment = sequential(
    HashSignChar
    zero-or-more any-except(Newline), true) |> mutate NOTHING
  let RegexSpace = one-of(SpaceChar, Newline) |> mutate NOTHING
  with-space sequential(
    LowerR
    [\text, one-of(
      sequential(
        TripleDoubleQuote
        SHORT_CIRCUIT
        [\this, zero-or-more-of(
          sequential(BackslashChar, DollarSignChar) |> mutate C('$')
          RegexSpace
          RegexComment
          StringInterpolation
          any-except TripleDoubleQuote)]
        TripleDoubleQuote)
      sequential(
        TripleSingleQuote
        SHORT_CIRCUIT
        [\this, zero-or-more-of(
          RegexSpace
          RegexComment
          any-except TripleSingleQuote)]
        TripleSingleQuote)
      sequential(
        DoubleQuote
        SHORT_CIRCUIT
        [\this, zero-or-more-of(
          sequential(DoubleQuote, DoubleQuote) |> mutate C('"')
          sequential(BackslashChar, DollarSignChar) |> mutate C('$')
          StringInterpolation
          any-except one-of(
            DoubleQuote
            Newline
            DollarSignChar))]
        DoubleQuote)
      sequential(
        SingleQuote
        SHORT_CIRCUIT
        [\this, zero-or-more-of(
          sequential(SingleQuote, SingleQuote) |> mutate C("'")
          any-except one-of(
            SingleQuote
            Newline))]
        SingleQuote))]
    [\flags, RegexFlags]) |> mutate #({text, flags}, parser, index)
    let string-parts = []
    let mutable current-literal = []
    for part in text
      if is-number! part
        current-literal.push part
      else if part != NOTHING and not is-nothing(part)
        if current-literal.length > 0
          string-parts.push LValue index, codes-to-string(current-literal)
          current-literal := []
        string-parts.push part
    if current-literal.length > 0
      string-parts.push LValue index, codes-to-string(current-literal)
    
    let text = concat-string parser, index, string-parts
    if text.is-const()
      try
        new RegExp(String(text.const-value()))
      catch e
        throw ParserError e.message, parser, index
    let seen-flags = []
    for flag in flags
      if flag in seen-flags
        throw ParserError "Invalid regular expression: flag $(quote flag) occurred more than once", parser, index
      else if flag not in [\g, \i, \m, \y]
        throw ParserError "Invalid regular expression: unknown flag $(quote flag)", parser, index
      seen-flags.push flag
    LInternalCall \new, index, parser.scope.peek(),
      LSymbol.ident index, parser.scope.peek(), \RegExp
      text
      LValue index, flags

let ConstantLiteralAccessPart = one-of(
  sequential(
    Period
    [\this, IdentifierNameConstOrNumberLiteral])
  sequential(
    OpenSquareBracketChar
    [\this, allow-space-before-access Expression]
    CloseSquareBracket))
let CustomConstantLiteral(parser, index)
  let name = Name parser, index
  if not name
    return
  
  let value = parser.get-const name.value
  if not value
    return
  
  if parser.in-ast.peek()
    Box name.index, LInternalCall \macro-const, index, parser.scope.peek(), LValue index, name.value
  else
    let mutable current = value.value
    let mutable current-index = name.index
    while is-object! current
      let part = ConstantLiteralAccessPart parser, current-index
      if not part
        throw ParserError "Constant '$(name.value)' cannot appear without being accessed upon.", parser, index
      if not part.value.is-const()
        throw ParserError "Constant '$(name.value)' must only be accessed with constant keys.", parser, current-index
      let key = part.value.const-value()
      if current not ownskey key
        throw ParserError "Unknown key $(JSON.stringify String key) in constant.", parser, current-index
      current := current[key]
      current-index := part.index
    Box current-index, LValue index, current

let NullOrVoidLiteral(parser, index)
  let constant = CustomConstantLiteral parser, index
  if not constant
    return
  
  if constant.value.value?
    return
  
  constant

define ConstantLiteral = one-of(
  CustomConstantLiteral
  NumberLiteral
  StringLiteral
  RegexLiteral)

define Literal = one-of(
  ThisOrShorthandLiteral
  ArgumentsLiteral
  ConstantLiteral)

define MaybeNotToken = maybe word("not")

define MaybeQuestionMarkChar = maybe character! "?"

let GeneratorBody = make-alter-stack<Boolean>(\in-generator, true)(Body)
let GeneratorBodyNoEnd = make-alter-stack<Boolean>(\in-generator, true)(BodyNoEnd)

let LessThanChar = character! "<"
let LessThan = with-space LessThanChar
let GreaterThanChar = character! ">"
let GreaterThan = with-space GreaterThanChar

define FunctionGlyph = sequential(
  Space
  MinusChar
  GreaterThanChar)
let _FunctionBody = one-of<ParserNode>(
  sequential(
    FunctionGlyph
    [\this, one-of Statement, Nothing])
  Body
  Statement)

let FunctionBody = make-alter-stack<Boolean>(\in-generator, false)(_FunctionBody)
let GeneratorFunctionBody = make-alter-stack<Boolean>(\in-generator, true)(_FunctionBody)

let IdentifierOrSimpleAccessStart = one-of(
  Identifier
  sequential(
    [\parent, ThisOrShorthandLiteralPeriod]
    [\child, IdentifierNameConstOrNumberLiteral]) |> mutate #({parent, child}, parser, index)
      LAccess index, parser.scope.peek(),
        parent
        child
  sequential(
    [\parent, ThisOrShorthandLiteral]
    DoubleColonChar
    [\child, IdentifierNameConstOrNumberLiteral]) |> mutate #({parent, child}, parser, index)
      LAccess index, parser.scope.peek(),
        parent
        LValue index, \prototype
        child
  sequential(
    [\parent, ThisOrShorthandLiteral]
    [\is-proto, maybe DoubleColonChar]
    OpenSquareBracketChar
    [\child, allow-space-before-access Expression]
    CloseSquareBracket) |> mutate #({parent, is-proto, child}, parser, index)
      if is-proto
        LAccess index, parser.scope.peek(),
          parent
          LValue index, \prototype
          child
      else
        LAccess index, parser.scope.peek(),
          parent
          child)
define PeriodOrDoubleColonChar = one-of(Period, DoubleColonChar)
let IdentifierOrSimpleAccessPart = one-of(
  sequential(
    [\type, PeriodOrDoubleColonChar]
    [\child, IdentifierNameConstOrNumberLiteral])
  sequential(
    [\type, maybe DoubleColonChar]
    OpenSquareBracketChar
    [\child, allow-space-before-access Expression]
    CloseSquareBracket)) |> mutate #({type, child}, parser, child-index)
  let is-proto = type == "::"
  #(parent, parser, index)
    if is-proto
      LAccess index, parser.scope.peek(),
        parent
        LValue child-index, \prototype
        child
    else
      LAccess index, parser.scope.peek(),
        parent
        child

define IdentifierOrSimpleAccess = sequential(
  [\head, IdentifierOrSimpleAccessStart]
  [\tail, zero-or-more IdentifierOrSimpleAccessPart]) |> mutate #(parts, parser, index)
  for reduce creator in parts.tail, acc = parts.head
    creator acc, parser, index

let in-function-type-params = make-alter-stack<Boolean> \in-function-type-params, true
let not-in-function-type-params = make-alter-stack<Boolean> \in-function-type-params, false

// redeclared later
let mutable TypeReference = #(parser, index) -> TypeReference(parser, index)

define ArrayType = sequential(
  OpenSquareBracket
  [\this, maybe allow-space-before-access TypeReference]
  CloseSquareBracket) |> mutate #(subtype, parser, index)
  let array-ident = LSymbol.ident index, parser.scope.peek(), \Array
  if subtype
    LInternalCall \type-generic, index, parser.scope.peek(),
      array-ident
      subtype
  else
    array-ident

let ObjectTypePair = sequential(
  [\key, #(parser, index) -> ConstObjectKey parser, index]
  Colon
  [\value, TypeReference])

define ObjectType = sequential(
  OpenCurlyBrace
  [\this, allow-space-before-access maybe (separated-list ObjectTypePair, CommaOrNewline), #-> []]
  MaybeComma
  CloseCurlyBrace) |> mutate #(pairs, parser, index)
  if pairs.length == 0
    LSymbol.ident index, parser.scope.peek(), \Object
  else
    let keys = []
    let args = []
    for {key, value} in pairs
      if not key.is-const()
        throw ParserError "Expected a constant key, got $(typeof! key)", parser, key.index
      else
        let key-value = String key.const-value()
        if key-value in keys
          throw ParserError "Duplicate object key: $(quote key-value)", parser, key.index
        keys.push key-value
      args.push key, value
    LInternalCall \type-object, index, parser.scope.peek(), args

let FunctionType = sequential(
  one-of(
    sequential(
      OpenParenthesis
      allow-space-before-access separated-list(TypeReference, CommaOrNewline)
      CloseParenthesis
    )
    in-function-type-params TypeReference
    Nothing)
  FunctionGlyph
  [\this, maybe TypeReference]) |> mutate #(return-type, parser, index)
  let function-ident = LSymbol.ident index, parser.scope.peek(), \Function
  if return-type
    LInternalCall \type-generic, index, parser.scope.peek(),
      function-ident
      return-type
  else
    function-ident

let NonUnionType = one-of(
  #(parser, index) -> if not parser.in-function-type-params.peek()
    FunctionType parser, index
  sequential(
    OpenParenthesis
    [\this, allow-space-before-access not-in-function-type-params #(parser, index) -> TypeReference parser, index]
    CloseParenthesis)
  ArrayType
  ObjectType
  NullOrVoidLiteral
  sequential(
    [\base, IdentifierOrSimpleAccess]
    [\args, maybe sequential(
      character! "<"
      SHORT_CIRCUIT
      [\this, separated-list(
        #(parser, index) -> TypeReference parser, index
        Comma)]
      Space
      character! ">"
    ), #-> []]) |> mutate #({base, args}, parser, index)
    if not args.length
      base
    else
      LInternalCall \type-generic, index, parser.scope.peek(), [
        base
        ...args
      ])

define Pipe = with-space PipeChar
redefine TypeReference = separated-list(
  NonUnionType
  Pipe) |> mutate #(mutable types, parser, index)
    let result = []
    for type, i in types
      if type.is-internal-call(\type-union)
        result.push ...type.args
      else
        result.push type
    if result.length == 1
      result[0]
    else
      LInternalCall \type-union, index, parser.scope.peek(), result

let MaybeAsType = maybe sequential(
  word "as"
  SHORT_CIRCUIT
  [\this, TypeReference])

define BracketedObjectKey = sequential(
  OpenSquareBracket
  [\this, allow-space-before-access ExpressionOrAssignment]
  CloseSquareBracket)

let ConstObjectKey = one-of(
  StringLiteral
  NumberLiteral |> mutate #(node, parser, index)
    LValue index, String(node.const-value())
  IdentifierNameConst)

define ObjectKey = one-of(BracketedObjectKey, ConstObjectKey)
define ObjectKeyColon = sequential(
  [\this, ObjectKey]
  Colon
  except EqualChar
  #(parser, index)
    if parser.options.noindent
      if EmptyLine parser, index
        return
      else if parser.options.embedded
        if EmbeddedClose(parser, index) or EmbeddedCloseWrite(parser, index)
          return
    Box index)

let mutate-function(node as ParserNode, parser, index)
  let mutate-function-macro = parser.get-macro-by-label \mutate-function
  if not mutate-function-macro
    node
  else
    mutate-function-macro.func {
      op: ""
      node
    }, parser, index

let validate-spread-parameters(params, parser)
  let mutable spread-count = 0
  for param in params
    if param.is-internal-call(\param) and param.args[2].const-value()
      spread-count += 1
      if spread-count > 1
        throw ParserError "Cannot have more than one spread parameter", parser, param.index
  params

let remove-trailing-nothings(array as [])
  while array.length
    let last = array[* - 1]
    if not is-nothing(last)
      break
    array.pop()
  array

let IdentifierOrThisAccess = one-of(
  Identifier
  sequential(
    [\parent, ThisOrShorthandLiteralPeriod]
    [\child, IdentifierNameConst]) |> mutate #({parent, child}, parser, index)
    LAccess index, parser.scope.peek(),
      parent
      child)

let IdentifierParameter = sequential(
  [\is-mutable, bool maybe word "mutable"]
  [\is-spread, bool MaybeSpreadToken]
  [\ident, IdentifierOrThisAccess]
  [\as-type, MaybeAsType]
  [\default-value, maybe sequential(
    EqualSign
    [\this, Expression])]) |> mutate #({is-mutable, is-spread, ident, as-type, default-value}, parser, index)
  if is-spread and default-value
    throw ParserError "Cannot specify a default value for a spread parameter", parser, index
  LInternalCall \param, index, parser.scope.peek(),
    ident
    default-value or LSymbol.nothing index
    LValue index, is-spread
    LValue index, is-mutable
    as-type or LSymbol.nothing index

// redefined later
let mutable Parameter = #(parser, index) -> Parameter parser, index

let ArrayParameter = sequential(
  OpenSquareBracket
  EmptyLines
  [\this, allow-space-before-access #(parser, index) -> Parameters parser, index]
  EmptyLines
  CloseSquareBracket) |> mutate #(params, parser, index)
  LInternalCall \array, index, parser.scope.peek(), params

let ParamDualObjectKey = sequential(
  [\key, ObjectKeyColon]
  [\value, Parameter])

let ParamSingularObjectKey = sequential(
  [\this, IdentifierParameter]
  NotColon) |> mutate #(param, parser, index)
  let ident = param.args[0]
  let key = if ident.is-symbol and ident.is-ident
    LValue index, ident.name
  else if ident.is-internal-call(\access)
    ident.args[1]
  else
    throw Error "Unknown object key type: $(typeof! ident)"
  { key, value: param }

let KvpParameter = maybe one-of(ParamDualObjectKey, ParamSingularObjectKey)

let make-object-node(parser, index, prototype, pairs)
  let known-keys = []
  let mutable last-property-pair = null
  for {key, property} in pairs
    if key.is-const()
      let key-value = String key.const-value()
      if property in [\get, \set] and last-property-pair and last-property-pair.property != property and last-property-pair.key == key-value
        last-property-pair := null
        continue
      else if key-value in known-keys
        let {ParserError} = require('./parser')
        throw ParserError "Duplicate key $(quote key-value) in object", parser, key.index
      known-keys.push key-value
      if property in [\get, \set]
        last-property-pair := {key: key-value, property}
      else
        last-property-pair := null
    else
      last-property-pair := null
  LInternalCall \object, index, parser.scope.peek(), [
    prototype or LSymbol.nothing index
    ...(for {key, value, property} in pairs
      LInternalCall \array, key.index, parser.scope.peek(), [
        key
        value
        ...(if property
          if is-string! property
            [LValue index, property]
          else
            [property]
        else
          [])
      ])
  ]

let ObjectParameter = sequential(
  OpenCurlyBrace
  EmptyLines
  [\this, allow-space-before-access separated-list(KvpParameter, CommaOrNewline)]
  EmptyLines
  CloseCurlyBrace) |> mutate #(params, parser, index)
  make-object-node parser, index,
    LSymbol.nothing index
    (for filter param in params; param)

Parameter := one-of(
  IdentifierParameter
  ArrayParameter
  ObjectParameter)

let ParameterOrNothing = one-of(Parameter, Nothing)
let Parameters = allow-space-before-access separated-list(
  ParameterOrNothing
  CommaOrNewline) |> mutate #(params, parser, index)
    validate-spread-parameters remove-trailing-nothings(params), parser

let ParameterSequence = sequential(
  OpenParenthesis
  SHORT_CIRCUIT
  EmptyLines
  [\this, Parameters]
  EmptyLines
  CloseParenthesis) |> mutate do
  let check-param(param as ParserNode, parser, names as [])!
    if param.is-internal-call()
      if param.func.is-param
        let ident = param.args[0]
        let name = if ident.is-symbol and ident.is-ident
          ident.name
        else if ident.is-internal-call(\access)
          let child = ident.args[1]
          if not child.is-const-type(\string)
            throw Error "Expected constant access"
          child.const-value()
        else
          throw Error "Unknown param ident type: $(typeof! param)"
        if name in names
          throw ParserError "Duplicate parameter name: $(quote name)", parser, ident.index
        else
          names.push name
      else if param.func.is-array
        for element in param.args
          check-param element, parser, names
      else if param.func.is-object
        for pair in param.args[1 to -1]
          check-param pair.args[1], parser, names
      else
        throw Error "Unknown param type: $(typeof! param)"
    else if not is-nothing(param)
      throw Error "Unknown param type: $(typeof! param)"
  #(params, parser, index)
    let names = []
    for param in params
      check-param(param, parser, names)
    params

let require-parameter-sequence = make-alter-stack<Boolean> \require-parameter-sequence, true
let dont-require-parameter-sequence = make-alter-stack<Boolean> \require-parameter-sequence, false
let _FunctionDeclaration = do
  let FunctionFlag = one-of(
    ExclamationPointChar
    AtSignChar
    AsterixChar
    CaretChar)

  let FunctionFlags = zero-or-more(FunctionFlag) |> mutate #(codes, parser, index)
    let flags = { +auto-return, -bound, -generator, -curry }
    let unique-chars = []
    for c in codes
      if c in unique-chars
        throw ParserError "Function flag $(quote from-char-code c) specified more than once", parser, index
      else
        unique-chars.push c
        switch c
        case C("!")
          flags.auto-return := false
        case C("@")
          flags.bound := true
        case C("*")
          flags.generator := true
        case C("^")
          flags.curry := true
        default
          throw Error "Unknown function flag: $(quote from-char-code c)"
    flags
  let GenericDefinitionPart = maybe sequential(
    LessThanChar
    [\this, separated-list Identifier, Comma]
    GreaterThan), #-> []
  
  let maybe-params-rule = maybe ParameterSequence, #-> []
  let as-type-rule = in-function-type-params MaybeAsType
  let get-body-rule = #(generator)
    if generator
      GeneratorFunctionBody
    else
      FunctionBody
  allow-space-before-access #(parser, index)
    let generic = GenericDefinitionPart parser, index
    let scope = parser.push-scope(true)
    let params-rule = if parser.require-parameter-sequence.peek()
      ParameterSequence
    else
      maybe-params-rule
    let params = params-rule parser, generic.index
    if not params
      parser.pop-scope()
      return
    for param in params.value by -1
      add-param-to-scope scope, param
    let flags = FunctionFlags parser, params.index
    let flags-value = flags.value
    let as-type = as-type-rule parser, flags.index
    let body = get-body-rule(flags.value.generator)(parser, as-type.index)
    if not body
      parser.pop-scope()
      return

    let func = LInternalCall \function, index, parser.scope.peek(),
      LInternalCall \array, index, parser.scope.peek(), params.value
      if flags-value.auto-return
        LInternalCall \auto-return, body.value.index, body.value.scope,
          body.value
      else
        body.value
      LValue index, flags-value.bound
      as-type.value or LSymbol.nothing index
      LValue index, flags-value.generator
    let mutable result = mutate-function func, parser, index
    if flags-value.curry and params.value.length > 1
      // TODO: verify that there are no spread parameters
      result := LCall index, parser.scope.peek(),
        LSymbol.ident index, parser.scope.peek(), \__curry
        LValue index, params.value.length
        result
    if generic.value.length
      let generic-macro = parser.get-macro-by-label \generic
      if not generic-macro
        throw ParserError "Cannot use generics until the generic macro has been defined", parser, index
      result := generic-macro.func {
        macro-data: [
          result
          generic.value
        ]
      }, parser, index
    parser.pop-scope()
    Box body.index, result
let FunctionDeclaration = require-parameter-sequence _FunctionDeclaration

define FunctionLiteral = sequential(
  Space
  HashSignChar
  [\this, dont-require-parameter-sequence _FunctionDeclaration])

let prevent-unclosed-object-literal = make-alter-stack<Boolean> \prevent-unclosed-object-literal, true
define ArrayLiteral = prevent-unclosed-object-literal sequential(
  OpenSquareBracket
  Space
  [\this, allow-space-before-access concat(
    maybe sequential(
      [\this, separated-list(
        SpreadOrExpression
        Comma)]
      MaybeComma), #-> []
    maybe(retain-indent(sequential(
      SomeEmptyLines
      MaybeAdvance
      [\this, maybe(sequential(
        CheckIndent
        [\this, separated-list(
          SpreadOrExpression
          CommaOrSomeEmptyLinesWithCheckIndent)]), #-> [])]
      EmptyLines
      MaybeCommaOrNewline
      )), #-> []))]
  CloseSquareBracket) |> mutate #(items, parser, index)
  LInternalCall \array, index, parser.scope.peek(), items

define SetLiteral = sequential(
  PercentSign
  check OpenSquareBracketChar
  SHORT_CIRCUIT
  [\this, ArrayLiteral]) |> mutate #(value, parser, index)
  let construct-set = parser.get-macro-by-label(\construct-set)
  if not construct-set
    throw Error "Cannot use literal set until the construct-set macro has been defined"
  construct-set.func {
    op: ""
    node: value
  }, parser, index

define NoNewlineIfNoIndent(parser, index)
  if parser.options.noindent
    NoSpaceNewline parser, index
  else
    Box index

let DualObjectKey = sequential(
  [\key, ObjectKeyColon]
  NoNewlineIfNoIndent
  [\value, Expression])

define GetSetToken = one-of word("get"), word("set")

define PropertyDualObjectKey = sequential(
  [\property, one-of(
    word("property")
    GetSetToken)]
  Space
  [\key, ObjectKeyColon]
  NoNewlineIfNoIndent
  SHORT_CIRCUIT
  [\value, Expression]
)

define PropertyOrDualObjectKey = one-of(PropertyDualObjectKey, DualObjectKey)

let MethodDeclaration = sequential(
  [\property, maybe GetSetToken]
  [\key, ObjectKey]
  NotColon // TODO: is this needed?
  [\value, FunctionDeclaration])

let PropertyOrDualObjectKeyOrMethodDeclaration = one-of(PropertyOrDualObjectKey, MethodDeclaration)

define UnclosedObjectLiteral = separated-list(
  PropertyOrDualObjectKey
  Comma) |> mutate #(pairs, parser, index)
  make-object-node parser, index,
    LSymbol.nothing index
    pairs

define IdentifierOrAccess(parser, index)
  let result = _IdentifierOrAccess(parser, index)
  if result
    let {value} = result
    if (value.is-symbol and value.is-ident) or value.is-internal-call(\access)
      result

let SingularObjectKey = one-of(
  sequential(
    [\this, IdentifierOrAccess]
    NotColon) |> mutate #(ident, parser, index)
    let key = if ident.is-symbol and ident.is-ident
      LValue index, ident.name
    else if ident.is-internal-call(\access)
      ident.args[1]
    else
      throw ParserError "Unknown ident type: $(typeof! ident)", parser, index
    { key, value: ident }
  sequential(
    [\this, ConstantLiteral]
    NotColon) |> mutate #(node, parser, index)
    let key = if node.is-const() and not node.is-const-type(\string)
      LValue index, String(node.value)
    else
      node
    { key, value: node }
  sequential(
    [\this, ThisLiteral]
    NotColon) |> mutate #(node, parser, index)
    key: LValue index, \this
    value: node
  sequential(
    [\this, ArgumentsLiteral]
    NotColon) |> mutate #(node, parser, index)
    key: LValue index, \arguments
    value: node
  sequential(
    [\this, BracketedObjectKey]
    NotColon) |> mutate #(node, parser, index)
    key: node
    value: node)
define KeyValuePair = one-of(
  PropertyOrDualObjectKeyOrMethodDeclaration
  sequential(
    Space
    [\flag, maybe PlusOrMinusChar]
    [\key, SingularObjectKey]) |> mutate #({flag, key}, parser, index)
    if flag
      { key.key, value: LValue index, flag == C("+") }
    else
      key
  sequential(
    Space
    [\bool, PlusOrMinusChar]
    [\key, IdentifierNameConst]) |> mutate #({bool, key}, parser, index)
    { key, value: LValue index, bool == C("+") })

define ObjectLiteral = allow-space-before-access sequential(
  OpenCurlyBrace
  Space
  [\prototype, maybe sequential(
    word "extends"
    [\this, prevent-unclosed-object-literal Logic]
    Space
    one-of(
      Comma
      check Newline
      check CloseCurlyBrace))]
  [\pairs, concat(
    maybe sequential(
      [\this, separated-list(KeyValuePair, Comma)]
      MaybeComma), #-> []
    maybe (retain-indent sequential(
      SomeEmptyLines
      MaybeAdvance
      [\this, maybe sequential(
        CheckIndent
        [\this, separated-list(KeyValuePair, CommaOrSomeEmptyLinesWithCheckIndent)]), #-> []]
      PopIndent)), #-> [])]
  EmptyLines
  MaybeCommaOrNewline
  EmptyLines
  CloseCurlyBrace) |> mutate #({prototype, pairs}, parser, index)
  make-object-node parser, index,
    prototype
    pairs

define MapLiteral = sequential(
  PercentSign
  OpenCurlyBraceChar
  SHORT_CIRCUIT
  Space
  [\this, allow-space-before-access concat(
    maybe sequential(
      [\this, separated-list(DualObjectKey, Comma)]
      MaybeComma), #-> []
    maybe (retain-indent sequential(
      SomeEmptyLines
      MaybeAdvance
      [\this, maybe sequential(
        CheckIndent
        [\this, separated-list(DualObjectKey, CommaOrSomeEmptyLinesWithCheckIndent)]), #-> []]
      PopIndent)), #-> [])]
  EmptyLines
  MaybeCommaOrNewline
  EmptyLines
  CloseCurlyBrace) |> mutate #(pairs, parser, index)
  let construct-map = parser.macros.get-by-label(\construct-map)
  if not construct-map
    throw Error "Cannot use literal map until the construct-map macro has been defined"
  construct-map.func {
    op: ""
    node: make-object-node parser, index,
      LSymbol.nothing index
      pairs
  }, parser, index

let RighthandAssignment(parser, index)
  let make-func(op, right)
    #(left, start-index) -> operator.func {
      left
      op
      right
    }, parser, start-index
  for operator in parser.assign-operators() by -1
    let {rule} = operator
    let op = rule parser, index
    if not op
      continue
    let right = ExpressionOrAssignmentOrBody parser, op.index
    if not right
      continue
    return Box right.index, make-func(op.value, right.value)

let Assignment(parser, index)
  let left = IdentifierOrAccess parser, index
  if not left
    return
  let right = RighthandAssignment(parser, left.index)
  if not right
    return
  Box right.index, right.value left.value, index

let CustomOperatorCloseParenthesis = do
  let handle-unary-operator(operator, parser, index)
    let op = operator.rule parser, index
    if not op
      return
    let close = CloseParenthesis parser, op.index
    if not close
      return
    
    let node = LSymbol.ident index, parser.scope.peek(), \x
    let scope = parser.push-scope(true)
    scope.add node, false, Type.any

    let result = mutate-function (LInternalCall \function, index, parser.scope.peek(),
      LInternalCall \array, index, parser.scope.peek(),
        LInternalCall \param, index, parser.scope.peek(),
          node
          LSymbol.nothing index
          LValue index, false
          LValue index, false
          LSymbol.nothing index
      LInternalCall \auto-return, index, parser.scope.peek(),
        operator.func {
          op: op.value
          node
        }, parser, index
      LValue index, false
      LSymbol.nothing index
      LValue index, false), parser, index
    parser.pop-scope()
    Box close.index, result
  let handle-binary-operator(operator, parser, mutable index)
    let mutable inverted = false
    if operator.invertible
      let invert = MaybeNotToken(parser, index)
      if invert.value
        inverted := true
      index := invert.index
    let op = operator.rule parser, index
    if not op
      return
    let close = CloseParenthesis parser, op.index
    if not close
      return
    
    let left = LSymbol.ident index, parser.scope.peek(), \x
    let right = LSymbol.ident index, parser.scope.peek(), \y
    let scope = parser.push-scope(true)
    scope.add left, false, Type.any
    scope.add right, false, Type.any
    
    let result = mutate-function (LInternalCall \function, index, parser.scope.peek(),
      LInternalCall \array, index, parser.scope.peek(),
        for ident in [left, right]
          LInternalCall \param, index, parser.scope.peek(),
            ident
            LSymbol.nothing index
            LValue index, false
            LValue index, false
            LSymbol.nothing index
      LInternalCall \auto-return, index, parser.scope.peek(),
        operator.func {
          left
          inverted
          op: op.value
          right
        }, parser, index
      LValue index, false
      LSymbol.nothing index
      LValue index, false), parser, index
    parser.pop-scope()
    Box close.index, LCall index, parser.scope.peek(),
      LSymbol.ident index, parser.scope.peek(), \__curry
      LValue index, 2
      result
  #(parser, index)!
    for operator in parser.all-binary-operators() by -1
      return? handle-binary-operator operator, parser, index
    for operator in parser.prefix-unary-operators() by -1
      return? handle-unary-operator operator, parser, index
    for operator in parser.postfix-unary-operators() by -1
      return? handle-unary-operator operator, parser, index

let CustomBinaryOperator(parser, index)
  for operator in parser.all-binary-operators() by -1
    let mutable inverted = false
    let mutable current-index = index
    if operator.invertible
      let invert = MaybeNotToken parser, index
      if invert.value
        inverted := true
      current-index := invert.index
    let op = operator.rule parser, current-index
    if not op
      continue
    
    return Box op.index, {
      op: op.value
      operator
      inverted
    }

define Parenthetical = allow-space-before-access sequential(
  OpenParenthesis
  [\this, one-of<ParserNode>(
    sequential(
      [\this, AssignmentAsExpression]
      CloseParenthesis)
    sequential(
      [\left, Expression]
      [\operator, maybe CustomBinaryOperator]
      CloseParenthesis) |> mutate #({left, operator}, parser, index)
        if not operator
          return left
        let scope = parser.push-scope(true)
        let right = parser.make-tmp index, \x

        let result = mutate-function (LInternalCall \function, index, parser.scope.peek(),
          LInternalCall \array, index, parser.scope.peek(),
            LInternalCall \param, index, parser.scope.peek(),
              right
              LSymbol.nothing index
              LValue index, false
              LValue index, false
              LSymbol.nothing index
          LInternalCall \auto-return, index, parser.scope.peek(),
            operator.operator.func {
              left: left.rescope(scope)
              operator.inverted
              operator.op
              right
            }, parser, index
          LValue index, false
          LSymbol.nothing index
          LValue index, false), parser, index
        parser.pop-scope()
        result
    CustomOperatorCloseParenthesis
    sequential(
      [\operator, CustomBinaryOperator]
      [\right, Expression]
      CloseParenthesis) |> mutate #({right, operator: {op, operator, inverted}}, parser, index)
        let scope = parser.push-scope(true)
        let left = parser.make-tmp index, \x

        let result = mutate-function (LInternalCall \function, index, parser.scope.peek(),
          LInternalCall \array, index, parser.scope.peek(),
            LInternalCall \param, index, parser.scope.peek(),
              left
              LSymbol.nothing index
              LValue index, false
              LValue index, false
              LSymbol.nothing index
          LInternalCall \auto-return, index, parser.scope.peek(),
            operator.func {
              left
              inverted
              op
              right: right.rescope scope
            }, parser, index
          LValue index, false
          LSymbol.nothing index
          LValue index, false), parser, index
        parser.pop-scope()
        result
    sequential(
      [\this, SomeInvocationOrAccessParts]
      CloseParenthesis) |> mutate #(tail, parser, index)
        let scope = parser.push-scope(true)
        let left = parser.make-tmp index, \o

        let result = mutate-function (LInternalCall \function, index, parser.scope.peek(),
          LInternalCall \array, index, parser.scope.peek(),
            LInternalCall \param, index, parser.scope.peek(),
              left
              LSymbol.nothing index
              LValue index, false
              LValue index, false
              LSymbol.nothing index
          LInternalCall \auto-return, index, parser.scope.peek(),
            convert-invocation-or-access(false, {
              type: \normal
              -existential
              node: left
            }, tail, parser, index).rescope scope
          LValue index, false
          LSymbol.nothing index
          LValue index, false), parser, index
        parser.pop-scope()
        result)])

define CurrentArrayLength = #(parser, index)
  if parser.asterix-as-array-length.peek()
    let asterix = AsterixChar parser, index
    if asterix
      Box asterix.index, LSymbol.ident index, parser.scope.peek(), CURRENT_ARRAY_LENGTH_NAME

define IndentedUnclosedObjectLiteralInner = separated-list(
  PropertyOrDualObjectKey
  CommaOrSomeEmptyLinesWithCheckIndent) |> mutate #(pairs, parser, index)
  make-object-node parser, index,
    LSymbol.nothing index
    pairs

define UnclosedObjectLiteralsAllowed(parser, index) -> if not parser.prevent-unclosed-object-literal.peek() then Box index

define IndentedUnclosedObjectLiteral = sequential(
  UnclosedObjectLiteralsAllowed
  IndentationRequired
  Space
  Newline
  EmptyLines
  [\this, retain-indent sequential(
    Advance
    CheckIndent
    [\this, IndentedUnclosedObjectLiteralInner]
    PopIndent)])

let UnclosedArrayLiteralElement = sequential(
  AsterixChar
  Space
  [\this, one-of(
    retain-indent sequential(
      PushFakeIndent(2)
      [\this, one-of(
        IndentedUnclosedObjectLiteralInner
        #(parser, index) -> IndentedUnclosedArrayLiteralInner parser, index
        SpreadOrExpression)])
    SpreadOrExpression)])

define IndentedUnclosedArrayLiteralInner = separated-list(
  UnclosedArrayLiteralElement
  sequential(MaybeComma, SomeEmptyLinesWithCheckIndent)) |> mutate #(items, parser, index)
  LInternalCall \array, index, parser.scope.peek(), items

define IndentedUnclosedArrayLiteral = sequential(
  UnclosedObjectLiteralsAllowed
  IndentationRequired
  Space
  Newline
  EmptyLines
  [\this, retain-indent sequential(
    Advance
    CheckIndent
    [\this, IndentedUnclosedArrayLiteralInner]
    PopIndent)])

let in-ast = make-alter-stack<Boolean> \in-ast, true
let in-evil-ast = make-alter-stack<Boolean> \in-evil-ast, true

let AstPosition = maybe sequential(
  OpenParenthesisChar
  [\this, Expression]
  CloseParenthesis)

let AstExpression = sequential(
  word "ASTE"
  SHORT_CIRCUIT
  #(parser, index)
    if not parser.in-macro.peek()
      throw ParserError "Can only use ASTE inside of a macro", parser, index
    else if parser.in-ast.peek()
      throw ParserError "Can only use ASTE inside of another AST", parser, index
    else
      Box index
  [\position, AstPosition]
  [\body, do
    let rule = in-ast ExpressionOrAssignment
    let evil-rule = in-evil-ast rule
    #(parser, index)
      let is-evil = ExclamationPointChar parser, index
      if is-evil
        evil-rule parser, is-evil.index
      else
        rule parser, index])

let AstStatement = sequential(
  word "AST"
  SHORT_CIRCUIT
  #(parser, index)
    if not parser.in-macro.peek()
      throw ParserError "Can only use AST inside of a macro", parser, index
    else if parser.in-ast.peek()
      throw ParserError "Can only use AST inside of another AST", parser, index
    else
      Box index
  [\position, AstPosition]
  [\body, do
    let rule = in-ast one-of(Body, Statement)
    let evil-rule = in-evil-ast rule
    #(parser, index)
      let is-evil = ExclamationPointChar parser, index
      if is-evil
        evil-rule parser, is-evil.index
      else
        rule parser, index])

define Ast = one-of(AstExpression, AstStatement) |> mutate #({position, body}, parser, mutable index)
  if position and not is-number! position.index
    throw ParserError "Unexpected position node in AST", parser, index
  MacroContext.constify-object position, body, index, parser.scope.peek()

define PrimaryExpression = one-of<ParserNode>(
  UnclosedObjectLiteral
  Literal
  ArrayLiteral
  ObjectLiteral
  SetLiteral
  MapLiteral
  Ast
  Parenthetical
  FunctionLiteral
  UseMacro
  Identifier
  CurrentArrayLength
  IndentedUnclosedObjectLiteral
  IndentedUnclosedArrayLiteral)

let convert-invocation-or-access = do
  let link-types =
    access: do
      let index-types =
        multi: #(parser, index, child) -> #(mutable parent)
          let mutable set-parent = parent
          let tmp-ids = []
          if parent.cacheable
            let tmp = parser.make-tmp index, \ref, parent.type(parser)
            tmp-ids.push tmp.id
            set-parent := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              parent.do-wrap(parser)
            parent := tmp
          let result = LInternalCall \array, index, parser.scope.peek(),
            for element, i in child.elements
              LAccess index, parser.scope.peek(),
                if i == 0 then set-parent else parent
                element
          if tmp-ids.length
            LInternalCall \tmp-wrapper, index, result.scope, [
              result
              ...(for tmp-id in tmp-ids; LValue index, tmp-id)
            ]
          else
            result
      #(parser, index, mutable head, link, link-index, links)
        let bind-access = if link.bind
          #(parent, child)
            LCall index, parser.scope.peek(),
              LSymbol.ident(index, parser.scope.peek(), \__bind)
              parent
              child
        else
          #(parent, child) -> LAccess index, parser.scope.peek(), parent, child
        if link.owns
          let tmp-ids = []
          let mutable set-head = head
          if head.cacheable
            let tmp = parser.make-tmp index, \ref, head.type(parser)
            tmp-ids.push tmp.id
            set-head := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              head.do-wrap(parser)
            head := tmp
          let mutable child = link.child
          let mutable set-child = child
          if child.cacheable
            let tmp = parser.make-tmp index, \ref, child.type(parser)
            tmp-ids.push tmp.id
            set-child := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              child.do-wrap(parser)
            child := tmp
          
          let result = LInternalCall \if, index, parser.scope.peek(),
            do
              let ownership-op = parser.get-macro-by-label(\ownership)
              if not ownership-op
                throw Error "Cannot use ownership access until the ownership operator has been defined"
              if link.existential
                let existential-op = parser.get-macro-by-label(\existential)
                if not existential-op
                  throw Error "Cannot use existential access until the existential operator has been defined"
                
                LCall index, parser.scope.peek(),
                  LSymbol.binary["&&"] index
                  existential-op.func {
                    op: ""
                    node: set-head
                  }, parser, index
                  ownership-op.func {
                    left: head
                    op: ""
                    right: set-child
                  }, parser, index
              else
                ownership-op.func {
                  left: set-head
                  op: ""
                  right: set-child
                }, parser, index
            convert-call-chain(parser, index, bind-access(head, child), link-index + 1, links)
            LSymbol.nothing index
          if tmp-ids.length
            LInternalCall \tmp-wrapper, index, result.scope, [
              result
              ...(for tmp-id in tmp-ids; LValue index, tmp-id)
            ]
          else
            result
        else
          let make-access = switch link.type
          case \access
            #(parent) -> bind-access parent, link.child
          case \access-index
            unless index-types ownskey link.child.type
              throw Error "Unknown index type: $(link.child.type)"
            index-types[link.child.type](parser, index, link.child)
          default
            throw Error "Unknown link type: $(link.type)"
          if link.existential
            let tmp-ids = []
            let mutable set-head = head
            if head.cacheable
              let tmp = parser.make-tmp index, \ref, head.type(parser)
              tmp-ids.push tmp.id
              set-head := LCall index, parser.scope.peek(),
                LSymbol.assign["="] index
                tmp
                head.do-wrap(parser)
              head := tmp
            let existential-op = parser.get-macro-by-label(\existential)
            if not existential-op
              throw Error "Cannot use existential access until the existential operator has been defined"
            let result = LInternalCall \if, index, parser.scope.peek(),
              existential-op.func {
                op: ""
                node: set-head
              }, parser, index
              convert-call-chain parser, index, make-access(head), link-index + 1, links
              LSymbol.nothing index
            if tmp-ids.length
              LInternalCall \tmp-wrapper, index, result.scope, [
                result
                ...(for tmp-id in tmp-ids; LValue index, tmp-id)
              ]
            else
              result
          else
            convert-call-chain parser, index, make-access(head), link-index + 1, links
    call: #(parser, index, mutable head, link, link-index, links)
      let next-chain()
        convert-call-chain parser, index,
          if link.is-context-call
            LInternalCall \context-call, index, parser.scope.peek(), [
              head
              ...link.args
            ]
          else if link.is-new
            LInternalCall \new, index, parser.scope.peek(), [
              head
              ...link.args
            ]
          else
            LCall index, parser.scope.peek(), head, link.args
          link-index + 1
          links
      unless link.existential
        next-chain()
      else
        let tmp-ids = []
        let mutable set-head = head
        if head.is-internal-call(\access) and not link.is-context-call and not link.is-new
          let [mutable parent, mutable child] = head.args
          let mutable set-parent = parent
          let mutable set-child = child
          if parent.cacheable
            let tmp = parser.make-tmp index, \ref, parent.type(parser)
            tmp-ids.push tmp.id
            set-parent := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              parent.do-wrap(parser)
            parent := tmp
          if child.cacheable
            let tmp = parser.make-tmp index, \ref, child.type(parser)
            tmp-ids.push tmp.id
            set-child := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              child.do-wrap(parser)
            child := tmp
          if parent != set-parent or child != set-child
            set-head := LAccess index, parser.scope.peek(), set-parent, set-child
            head := LAccess index, parser.scope.peek(), parent, child
        else
          if head.cacheable
            let tmp = parser.make-tmp index, \ref, head.type(parser)
            tmp-ids.push tmp.id
            set-head := LCall index, parser.scope.peek(),
              LSymbol.assign["="] index
              tmp
              head.do-wrap(parser)
            head := tmp
        let result = LInternalCall \if, index, parser.scope.peek(),
          LCall index, parser.scope.peek(),
            LSymbol.binary["==="] index
            LCall index, parser.scope.peek(),
              LSymbol.unary.typeof index
              set-head
            LValue index, \function
          next-chain()
          LSymbol.nothing index
        if tmp-ids.length
          LInternalCall \tmp-wrapper, index, result.scope, [
            result
            ...(for tmp-id in tmp-ids; LValue index, tmp-id)
          ]
        else
          result
  link-types.access-index := link-types.access
  
  let convert-call-chain(parser, index, head, link-index, links)
    if link-index >= links.length
      head
    else
      let link = links[link-index]
      unless link-types ownskey link.type
        throw Error "Unknown call-chain link: $(link.type)"
      
      link-types[link.type](parser, index, head, link, link-index, links)
  #(mutable is-new, head, tail, parser, index)
    if tail.length == 0 and not is-new and head.type == \normal
      return head.node
    
    let links = []
    if head.type == \this-access
      links.push { type: \access, head.child, head.existential }
    
    for part in tail
      switch part.type
      case \proto-access, \proto-access-index
        links.push { type: \access, child: LValue(index, \prototype), part.existential }
        links.push {} <<< part <<< { type: if part.type == \proto-access then \access else \access-index }
      case \access, \access-index
        links.push part
      case \call
        if is-new and part.is-context-call
          throw ParserError "Cannot call with both new and @ at the same time", parser, index
        links.push {} <<< part <<< { is-new }
        is-new := false
      case \generic
        if not parser.get-const-value("DISABLE_GENERICS", false)
          links.push { type: \access, child: LValue(index, \generic), -existential }
          links.push { type: \call, args: part.args, -existential }
      default
        throw Error "Unknown link type: $(part.type)"
  
    if is-new
      links.push { type: \call, args: [], -existential, +is-new, -is-context-call }
    
    convert-call-chain parser, index, head.node, 0, links

let SpaceBeforeAccess = #(parser, index)
  if parser.disallow-space-before-access.peek()
    Box index
  else
    Space parser, index

let InvocationOrAccessPart = one-of(
  sequential(
    LessThanChar
    [\this, separated-list(
      #(parser, index) -> BasicInvocationOrAccess(parser, index)
      Comma)]
    GreaterThan) |> mutate #(args, , , index) -> {
    type: \generic
    args
    index
  }
  sequential(
    [\existential, MaybeQuestionMarkChar]
    [\owns, MaybeExclamationPointChar]
    [\bind, MaybeAtSignChar]
    SpaceBeforeAccess
    [\type, PeriodOrDoubleColonChar]
    [\child, IdentifierNameConstOrNumberLiteral]) |> mutate #(x, , , index) -> {
      type: if x.type == "::" then \proto-access else \access
      x.child
      x.existential
      x.owns
      x.bind
      index
    }
  sequential(
    [\existential, MaybeQuestionMarkChar]
    [\owns, MaybeExclamationPointChar]
    [\bind, MaybeAtSignChar]
    [\type, maybe DoubleColonChar]
    OpenSquareBracketChar
    [\child, allow-space-before-access separated-list(
      Expression |> make-alter-stack<Boolean>(\asterix-as-array-length, true)
      CommaOrNewline) |> mutate #(nodes)
      if nodes.length > 1
        type: \multi
        elements: nodes
      else
        type: \single
        node: nodes[0]]
    CloseSquareBracket) |> mutate #(x, parser, index, end-index)
    if x.child.type == \single
      {
        type: if x.type == "::" then \proto-access else \access
        child: x.child.node
        x.existential
        x.owns
        x.bind
        index: end-index
      }
    else
      if x.owns
        throw ParserError "Cannot use ! when using a multiple or slicing index", parser, index
      else if x.bind
        throw ParserError "Cannot use @ when using a multiple or slicing index", parser, index
      {
        type: if x.type == "::" then \proto-access-index else \access-index
        x.child
        x.existential
        index: end-index
      }
  sequential(
    [\existential, bool MaybeQuestionMarkChar]
    [\is-context-call, bool MaybeAtSignChar]
    [\args, InvocationArguments]) |> mutate #(x, , , index) -> {
      type: \call
      x.args
      x.existential
      -is-new
      x.is-context-call
      index
    })

let CheckPeriodNotDoublePeriod = check sequential(Period, except(Period))

let inside-indented-access = make-alter-stack<Boolean>(\inside-indented-access, true)
let InvocationOrAccessParts = concat(
  zero-or-more InvocationOrAccessPart
  maybe sequential(
    #(parser, index)
      let disallow-space = parser.disallow-space-before-access.peek()
      if not disallow-space or (disallow-space == 1 and parser.inside-indented-access.peek())
        Box index
    IndentationRequired
    SomeEmptyLines
    [\this, retain-indent sequential(
      Advance
      CheckIndent
      CheckPeriodNotDoublePeriod
      [\this, separated-list(
        inside-indented-access zero-or-more InvocationOrAccessPart
        sequential(
          SomeEmptyLinesWithCheckIndent
          CheckPeriodNotDoublePeriod))]
      PopIndent
    ) |> mutate #(x) -> [].concat ...x]), #-> [])

let SomeInvocationOrAccessParts = #(parser, index)
  let result = InvocationOrAccessParts(parser, index)
  if result.value.length > 0
    result

let BasicInvocationOrAccess = sequential(
  [\is-new, bool maybe word("new")]
  [\head, one-of(
    sequential(
      [\node, ThisShorthandLiteral]
      [\existential, MaybeQuestionMarkChar]
      [\owns, MaybeExclamationPointChar]
      [\bind, MaybeAtSignChar]
      [\child, IdentifierNameConstOrNumberLiteral]) |> mutate #(x, parser, index) -> { type: \this-access } <<< x
    PrimaryExpression |> mutate #(node as ParserNode) -> { type: \normal, node })]
  [\tail, InvocationOrAccessParts]) |> mutate #({is-new, head, tail}, parser, index)
  convert-invocation-or-access is-new, {} <<< head, tail, parser, index

let _IdentifierOrAccess = sequential(
  [\head, one-of(
    sequential(
      [\node, ThisShorthandLiteral]
      [\existential, MaybeQuestionMarkChar]
      [\owns, MaybeExclamationPointChar]
      [\bind, MaybeAtSignChar]
      [\child, IdentifierNameConstOrNumberLiteral]) |> mutate #(x, parser, index) -> { type: \this-access } <<< x
    PrimaryExpression |> mutate #(node as ParserNode) -> { type: \normal, node })]
  [\tail, #(parser, index)
    let {value: mutable tail} = InvocationOrAccessParts(parser, index)
    tail := tail.slice()
    while tail.length > 0 and tail[* - 1].type not in [\access, \proto-access]
      tail.pop()
    if tail.length == 0
      Box index, []
    else
      Box tail[* - 1].index, tail]) |> mutate #({head, tail}, parser, index)
  convert-invocation-or-access false, {} <<< head, tail, parser, index

define SuperInvocation = sequential(
  word "super"
  SHORT_CIRCUIT
  [\child, maybe one-of(
    sequential(
      EmptyLines
      Space
      Period
      [\this, IdentifierNameConstOrNumberLiteral])
    sequential(
      OpenSquareBracketChar
      [\this, allow-space-before-access Expression]
      CloseSquareBracket))]
  [\args, InvocationArguments]) |> mutate #({child, args}, parser, index)
  LInternalCall \super, index, parser.scope.peek(), [
    child or LSymbol.nothing index,
    ...args
  ]

define Eval = sequential(
  word "eval"
  SHORT_CIRCUIT
  [\this, InvocationArguments]) |> mutate #(args, parser, index)
  if args.length != 1
    throw ParserError "Expected only one argument to eval, got $(args.length)", parser, index
  LCall index, parser.scope.peek(),
    LSymbol.ident index, parser.scope.peek(), \eval, true
    args[0]

define InvocationOrAccess = one-of(
  #(parser, index)
    let in-ast = parser.in-ast
    if not in-ast.peek()
      return
    let dollar = DollarSign parser, Space(parser, index).index
    if not dollar
      return
    in-ast.push false
    try
      let args = InvocationArguments parser, dollar.index
      if not args
        return
      
      Box args.index, LCall index, parser.scope.peek(),
        LSymbol.ident index, parser.scope.peek(), \$
        args.value
    finally
      in-ast.pop()
  BasicInvocationOrAccess
  SuperInvocation
  Eval)

let in-cascade = make-alter-stack<Boolean> \in-cascade, true
define CascadePart = sequential(
  except SpreadToken
  Period
  check Period
  [\accesses, zero-or-more InvocationOrAccessPart]
  [\assignment, maybe in-cascade RighthandAssignment])

let mutable CascadePartWithCascade = #(parser, index) -> CascadePartWithCascade parser, index
redefine CascadePartWithCascade = sequential(
  [\main, CascadePart]
  [\subcascades, maybe (retain-indent sequential(
    SomeEmptyLines
    Advance
    CheckIndent
    [\this, separated-list(
      CascadePartWithCascade
      SomeEmptyLinesWithCheckIndent)]
    PopIndent)), #-> []])

define Cascade = sequential(
  [\head, InvocationOrAccess]
  [\tail, one-of(
    #(parser, index)
      if parser.in-cascade.peek()
        Box index, []
    concat(
      zero-or-more sequential(
        SpaceBeforeAccess
        [\this, CascadePart |> mutate #(main) -> {main, subcascades: []}])
      maybe sequential(
        IndentationRequired
        #(parser, index)
          unless parser.disallow-space-before-access.peek()
            Box index
        SomeEmptyLines
        [\this, retain-indent sequential(
          Advance
          CheckIndent
          [\this, separated-list(
            CascadePartWithCascade
            SomeEmptyLinesWithCheckIndent)]
          PopIndent)]), #-> []))]) |> mutate #({head, tail}, parser, index)
  if tail.length
    let mutate-function-macro = parser.get-macro-by-label \cascade
    if not mutate-function-macro
      throw ParserError "Cannot use cascades until the cascade macro has been defined", parser, index
    let handle(head, tail, index)
      if tail.length
        mutate-function-macro.func {
          macro-data: [
            head
            for {main: {accesses, assignment}, subcascades} in tail
              #(node)
                let access = convert-invocation-or-access false, { type: \normal, node }, accesses, parser, index
                let ret = if assignment?
                  assignment access, index
                else
                  access
                if subcascades
                  handle ret, subcascades, index
                else
                  ret
          ]
        }, parser, index
      else
        head
    handle(head, tail, index)
  else
    head

define PostfixUnaryOperation(parser, index)
  let mutable node = Cascade parser, index
  if not node
    return
  
  let mutable found = true
  while found
    found := false
    for operator in parser.postfix-unary-operators() by -1
      let {rule} = operator
      let op = rule parser, node.index
      if not op
        continue
      node := Box op.index, operator.func {
        op: op.value
        node: node.value
      }, parser, index
      found := true
      break
  node

define PrefixUnaryOperation(parser, index)
  for operator in parser.prefix-unary-operators() by -1
    let {rule} = operator
    let op = rule parser, index
    if not op
      continue
    let node = PrefixUnaryOperation parser, op.index
    if not node
      continue
    
    return Box node.index, operator.func {
      op: op.value
      node: node.value
    }, parser, index
  PostfixUnaryOperation parser, index

let BinaryOperationByPrecedence = do
  let precedence-cache = []
  #(precedence) -> precedence-cache[precedence] or= cache #(parser, index)
    let operators = parser.binary-operators(precedence)
    if not operators
      return PrefixUnaryOperation parser, index
    
    let next-rule = BinaryOperationByPrecedence precedence ~+ 1
    let head = next-rule parser, index
    if not head
      return
    
    for operator in operators by -1
      let {rule} = operator
      let tail = []
      let mutable current-index = head.index
      while true
        let mutable inverted = false
        if operator.invertible
          let invert = MaybeNotToken parser, current-index
          if invert.value
            inverted := true
          current-index := invert.index
        
        let op = rule parser, current-index
        if not op
          break
        
        let node = next-rule parser, op.index
        if not node
          break
        
        current-index := node.index
        tail.push { inverted, op: op.value, node: node.value }
        if operator.maximum and tail.length >= operator.maximum
          break
      
      if tail.length
        let result = if not operator.right-to-left
          for reduce part in tail, left = head.value
            operator.func {
              left
              part.inverted
              part.op
              right: part.node
            }, parser, index
        else
          for reduce part, j in tail by -1, right = tail[* - 1].node
            operator.func {
              left: if j == 0 then head.value else tail[j - 1].node
              part.inverted
              part.op
              right
            }, parser, index
        return Box current-index, result
    head

redefine Logic = BinaryOperationByPrecedence(0)
define ExpressionAsStatement = one-of(
  UseMacro
  Logic)
redefine Expression = in-expression ExpressionAsStatement

define LicenseComment = sequential(
  SpaceChars
  [\this, #(parser, index)
    let source = parser.source
    unless C(source, index) == C("/") and C(source, index ~+ 1) == C("*") and C(source, index ~+ 2) == C("!")
      return
    
    let mutable line = [C("/"), C("*"), C("!")]
    let lines = [line]
    let len = source.length
    let mutable current-index = index ~+ 3
    while true, current-index += 1
      if current-index ~>= len
        throw ParserError "Multi-line license comment never ends", parser, index
      let ch = C(source, current-index)
      if ch == C("*") and C(source, current-index ~+ 1) == C("/")
        line.push C("*"), C("/")
        let result = []
        for l, i in lines
          if i > 0
            result.push "\n"
          process-char-codes l, result
        return Box current-index + 2, LInternalCall \comment, index, parser.scope.peek(),
          LValue index, result.join ""
      else if ch in [C("\r"), C("\n"), 8232, 8233]
        if ch == C("\r") and C(data, current-index ~+ 1) == C("\n")
          current-index ~+= 1
        lines.push (line := [])
        let indent = StringIndent(parser, current-index ~+ 1)
        if not indent
          throw ParserError "Improper indent in multi-line license comment", parser, current-index ~+ 1
        current-index := indent.index ~- 1
      else
        line.push ch]
  Space)

let MacroSyntaxParameterType = allow-space-before-access sequential(
  [\type, one-of(
    Identifier
    StringLiteral
    sequential(
      OpenParenthesis
      EmptyLines
      [\this, #(parser, index) -> MacroSyntaxParameters parser, index]
      EmptyLines
      MaybeCommaOrNewline
      CloseParenthesis) |> mutate #(value, parser, index)
      LInternalCall \syntax-sequence, index, parser.scope.peek(), value
    sequential(
      OpenParenthesis
      EmptyLines
      [\this, #(parser, index) -> MacroSyntaxChoiceParameters parser, index]
      EmptyLines
      CloseParenthesis) |> mutate #(choices, parser, index)
      LInternalCall \syntax-choice, index, parser.scope.peek(), choices)]
  [\multiplier, maybe one-of(
    symbol "?"
    symbol "*"
    symbol "+")]) |> mutate #({type, multiplier}, parser, index)
  if multiplier
    LInternalCall \syntax-many, index, parser.scope.peek(),
      type
      LValue index, multiplier
  else
    type

let MacroSyntaxParameter = one-of(
  StringLiteral
  sequential(
    [\ident, one-of(ThisOrShorthandLiteral, Identifier)]
    [\type, maybe sequential(
      word "as"
      [\this, MacroSyntaxParameterType])]) |> mutate #({ident, type}, parser, index)
    LInternalCall \syntax-param, index, parser.scope.peek(),
      ident
      type or LSymbol.nothing index)

let MacroSyntaxParameterLookahead = one-of(
  sequential(
    [\lookahead, one-of(
      symbol "?="
      symbol "?!")]
    [\type, one-of(
      StringLiteral
      MacroSyntaxParameterType)]) |> mutate #({lookahead, type}, parser, index)
    LInternalCall \syntax-lookahead, index, parser.scope.peek(),
      LValue index, lookahead == "?!"
      type
  MacroSyntaxParameter)

let MacroSyntaxParameters = separated-list(MacroSyntaxParameterLookahead, Comma)

let MacroSyntaxChoiceParameters = separated-list(MacroSyntaxParameterType, Pipe)

let MacroOptions = maybe (sequential(
  word "with"
  [\this, UnclosedObjectLiteral]) |> mutate #(mutable object, parser, index)
  object := object.reduce(parser)
  if not object.is-literal()
    throw ParserError "Macro options must be a literal object without any logic, invocation, or anything else", parser, index
  object.literal-value()), #-> {}

let add-macro-syntax-parameters-to-scope(params, scope)!
  for param in params
    if param.is-internal-call(\syntax-param)
      let ident = param.args[0]
      if ident.is-symbol and ident.is-ident
        scope.add ident, true, Type.any

let MacroSyntax = sequential(
  CheckIndent
  word "syntax"
  SHORT_CIRCUIT
  #(parser, index)
    let scope = parser.push-scope(true)
    let params = MacroSyntaxParameters parser, index
    if not params
      throw SHORT_CIRCUIT
    let options = MacroOptions parser, params.index
    parser.start-macro-syntax index, params.value, options.value
    add-macro-syntax-parameters-to-scope params.value, scope
    scope.add LSymbol.ident(index, parser.scope.peek(), \macro-name), true, Type.string
    let body = FunctionBody parser, options.index
    if not body
      throw SHORT_CIRCUIT
    parser.macro-syntax index, \syntax, params.value, options.value, body.value
    parser.pop-scope()
    Box body.index
  Space
  CheckStop)

let MacroBody = one-of(
  sequential(
    #(parser, index) -> if parser.options.noindent then Colon(parser, index) else Box index
    Space
    Newline
    EmptyLines
    retain-indent sequential(
      #(parser, index) -> if parser.options.noindent
        MaybeAdvance parser, index
      else
        Advance parser, index
      separated-list(
        MacroSyntax
        SomeEmptyLines)
      PopIndent)
    End)
  #(parser, index)
    let scope = parser.push-scope(true)
    let params = ParameterSequence parser, index
    if not params
      throw SHORT_CIRCUIT
    for param in params.value by -1
      add-param-to-scope scope, param, true
    let options = MacroOptions parser, params.index
    let body = FunctionBody parser, options.index
    if not body
      throw SHORT_CIRCUIT
    parser.macro-syntax index, \call, params.value, options.value, body.value
    parser.pop-scope()
    Box body.index, LSymbol.nothing index)

let in-macro = make-alter-stack<Boolean> \in-macro, true
let _DefineMacro = sequential(
  word "macro"
  [\this, in-macro #(parser, index)
    let names = MacroNames parser, index
    if not names
      return
    parser.enter-macro index, names.value
    let body = MacroBody parser, names.index
    parser.exit-macro()
    Box body.index, LSymbol.nothing index])

let DefineSyntax = do
  let top-rule = sequential(
    one-of(
      word "define"
      word "macro")
    word "syntax"
    SHORT_CIRCUIT
    [\name, Identifier]
    EqualSign
    [\value, MacroSyntaxParameters])
  in-macro #(parser, index)
    let top = top-rule parser, index
    if not top
      return
    let body = FunctionBody parser, top.index
    parser.define-syntax index, top.value.name.name, top.value.value, body?.value
    Box (if body then body.index else top.index), LSymbol.nothing index

let DefineHelper = sequential(
  one-of(
    word "define"
    word "macro")
  word "helper"
  SHORT_CIRCUIT
  [\name, Identifier]
  [\value, one-of(
    sequential(
      EqualSign
      [\this, Expression])
    FunctionDeclaration)]) |> mutate #({name, value}, parser, index)
  parser.define-helper index, name, value
  LSymbol.nothing index

let DefineOperator = do
  let main-rule = sequential(
    one-of(
      word "define"
      word "macro")
    word "operator"
    SHORT_CIRCUIT
    [\type, one-of(
      word "binary"
      word "assign"
      word "unary")]
    [\ops, separated-list(NameOrSymbol, Comma)]
    [\options, MacroOptions])
  in-macro #(parser, index)
    let x = main-rule parser, index
    if not x
      return
    let {type, ops, options} = x.value
    let scope = parser.push-scope(true)
    switch type
    case \binary, \assign
      scope.add LSymbol.ident(index, parser.scope.peek(), \left), true, Type.any
      scope.add LSymbol.ident(index, parser.scope.peek(), \op), true, Type.string
      scope.add LSymbol.ident(index, parser.scope.peek(), \right), true, Type.any
    case \unary
      scope.add LSymbol.ident(index, parser.scope.peek(), \op), true, Type.string
      scope.add LSymbol.ident(index, parser.scope.peek(), \node), true, Type.any
    let body = FunctionBody parser, x.index
    if not body
      throw SHORT_CIRCUIT
    let ret = switch type
    case \binary; parser.define-binary-operator index, ops, options, body.value
    case \assign; parser.define-assign-operator index, ops, options, body.value
    case \unary; parser.define-unary-operator index, ops, options, body.value
    default; throw Error()
    parser.pop-scope()
    Box body.index, LSymbol.nothing index

define DefineMacro = one-of(DefineSyntax, DefineHelper, DefineOperator, _DefineMacro)

let DefineConstLiteral = sequential(
  word "const"
  SHORT_CIRCUIT
  [\name, Name]
  EqualSign
  [\value, Expression]) |> mutate #({name, mutable value}, parser, index)
  value := parser.macro-expand-all(value.reduce(parser))
  if not value.is-literal()
    throw ParserError "const value must be a literal.", parser, index
  parser.define-const index, name, value.literal-value()
  LSymbol.nothing index

redefine Statement = sequential(
  [\this, in-statement one-of<ParserNode>(
    LicenseComment
    DefineMacro
    DefineConstLiteral
    Assignment
    ExpressionAsStatement)]
  Space) // TODO: have statement decorators?

let make-embedded-rule = do
  let make(text as String)
    let len = text.length
    let codes = for i in 0 til len; C(text, i)
    #(parser, index)
      let source = parser.source
      for i in 0 til len
        if C(source, index + i) != codes[i]
          return
      Box index ~+ len, text
  let rules = { extends null }
  let get-embedded-rule(text) -> rules[text] or= make text
  #(key as String, default-value) -> #(parser, index)
    let mutable text = parser.options[key]
    if not is-string! text
      text := default-value
    get-embedded-rule(text)(parser, index)
define EmbeddedOpenLiteral = make-embedded-rule \embedded-open-literal, EMBED_OPEN_LITERAL_DEFAULT
let EmbeddedCloseLiteral = make-embedded-rule \embedded-close-literal, EMBED_CLOSE_LITERAL_DEFAULT

let EmbeddedReadExplicitLiteralText(parser, index)
  let open = EmbeddedOpenLiteral(parser, index)
  if not open
    return
  let source = parser.source
  let len = source.length
  let mutable current-index = open.index
  let codes = []
  while current-index ~< len, current-index += 1
    let close = EmbeddedCloseLiteral(parser, current-index)
    if close
      return Box close.index, codes
    let mutable c = C(source, current-index)
    if c == C("\r") and C(source, current-index + 1) == C("\n")
      c := C("\n")
      current-index += 1
    codes.push c
  throw ParserError "Literal text never ends", parser, index

let unpretty-text(text as String)
  text.replace r"\s+"g, " "
let EmbeddedReadLiteralText(parser, index)
  let source = parser.source
  let len = source.length
  let mutable current-index as Number = index
  let mutable codes = []
  while current-index ~< len, current-index += 1
    let explicit-literal = EmbeddedReadExplicitLiteralText(parser, current-index)
    if explicit-literal
      current-index := explicit-literal.index - 1
      codes := codes.concat(explicit-literal.value)
      continue
    
    if EmbeddedOpen(parser, current-index) or EmbeddedOpenWrite(parser, current-index) or EmbeddedOpenComment(parser, current-index)
      break
  
    let mutable c = C(source, current-index)
    if c == C("\r") and C(source, current-index + 1) == C("\n")
      c := C("\n")
      current-index += 1
    codes.push c
  if current-index == index
    return
  let mutable text = codes-to-string(codes)
  if parser.options.embedded-unpretty
    text := unpretty-text(text)
  Box current-index, LInternalCall \embed-write, index, parser.scope.peek(),
    LValue index, text
    LValue index, false

define EmbeddedOpenComment = make-embedded-rule \embedded-open-comment, EMBED_OPEN_COMMENT_DEFAULT
let EmbeddedCloseComment = make-embedded-rule \embedded-close-comment, EMBED_CLOSE_COMMENT_DEFAULT

let EmbeddedComment(parser, index)
  let open = EmbeddedOpenComment parser, index
  if not open
    return
  let mutable current-index = open.index
  let len = parser.source.length
  while current-index ~< len
    let close = EmbeddedCloseComment parser, current-index
    if close
      current-index := close.index
      break
    
    let any = AnyChar parser, current-index
    if not any
      break
    if current-index == any.index
      throw Error "Infinite loop detected"
    current-index := any.index
  Box current-index, LSymbol.nothing index

define EmbeddedOpen = make-embedded-rule \embedded-open, EMBED_OPEN_DEFAULT
define EmbeddedClose = sequential(
  EmptyLines
  Space
  one-of(
    Eof
    make-embedded-rule \embedded-close, EMBED_CLOSE_DEFAULT))

define EmbeddedOpenWrite = make-embedded-rule \embedded-open-write, EMBED_OPEN_WRITE_DEFAULT
define EmbeddedCloseWrite = sequential(
  EmptyLines
  Space
  one-of(
    Eof
    make-embedded-rule \embedded-close-write, EMBED_CLOSE_WRITE_DEFAULT))

define ColonEmbeddedClose = sequential(Colon, EmbeddedClose)
define ColonEmbeddedCloseWrite = sequential(Colon, EmbeddedCloseWrite)

define NotEmbeddedOpenLiteral = except EmbeddedOpenLiteral
define NotEmbeddedOpenComment = except EmbeddedOpenComment
define NotEmbeddedOpenWrite = except EmbeddedOpenWrite

let disallow-embedded-text = make-alter-stack<Boolean> \allow-embedded-text, false

let EmbeddedWriteExpression = disallow-embedded-text sequential(
  NotEmbeddedOpenComment
  NotEmbeddedOpenLiteral
  EmbeddedOpenWrite
  [\this, Expression]
  EmbeddedCloseWrite) |> mutate #(node, parser, index)
  LInternalCall \embed-write, index, parser.scope.peek(),
    node
    LValue index, true

let EmbeddedLiteralTextInnerPart = one-of(
  EmbeddedComment
  EmbeddedWriteExpression
  EmbeddedReadLiteralText)

define EmbeddedLiteralText = sequential(
  #(parser, index) -> if parser.options.embedded and parser.allow-embedded-text.peek() and index ~< parser.source.length then Box index
  EmbeddedClose
  [\this, zero-or-more(EmbeddedLiteralTextInnerPart)]
  one-of(
    Eof
    sequential(
      NotEmbeddedOpenComment
      NotEmbeddedOpenWrite
      NotEmbeddedOpenLiteral
      EmbeddedOpen))) |> mutate #(nodes, parser, index)
  LInternalCall \block, index, parser.scope.peek(), nodes

define Semicolon = with-space SemicolonChar
define Semicolons = zero-or-more Semicolon, true
define Line = do
  let SemicolonsStatement = sequential(
    Semicolons
    [\this, Statement])
  
  #(parser, index)
    let indent = CheckIndent(parser, index)
    if not indent
      return
    let mutable current-index = index
    let parts = []
    let mutable need-semicolon = false
    while true
      let mutable ret = EmbeddedLiteralText parser, current-index
      if ret
        if DEBUG and ret.value not instanceof ParserNode
          throw TypeError "Expected EmbeddedLiteralText to return a ParserNode, got $(typeof! ret.value)"
        need-semicolon := false
        parts.push ret.value
        current-index := ret.index
      else
        ret := if need-semicolon
          SemicolonsStatement parser, current-index
        else
          Statement parser, current-index
        if ret
          if DEBUG and ret.value not instanceof ParserNode
            throw TypeError "Expected $(if need-semicolon then 'Semicolons' else '')Statement to return a ParserNode, got $(typeof! ret.value)"
          need-semicolon := true
          parts.push ret.value
          current-index := ret.index
        else
          break
    if parts.length == 0
      return
    let end-semis = Semicolons parser, current-index
    if end-semis
      current-index := end-semis.index
    Box current-index, parts

let _Block-mutator(lines, parser, index)
  let nodes = []
  for item, i in lines
    for part, j in item
      if DEBUG and part not instanceof ParserNode
        throw TypeError "Expected lines[$i][$j] to be a ParserNode, got $(typeof! part)"
      else if part.is-internal-call(\block)
        nodes.push ...part.args
      else if not is-nothing(part)
        nodes.push part
  switch nodes.length
  case 0; LSymbol.nothing index
  case 1; nodes[0]
  default
    LInternalCall \block, index, parser.scope.peek(), nodes

let RootInnerP = promise! #(parser, index)*
  parser.clear-cache()
  let head = Line parser, index
  if not head
    return
  let result = [head.value]
  let mutable current-index = head.index
  while true
    parser.clear-cache()
    unless parser.options.sync
      yield fulfilled! void
    let separator = SomeEmptyLines parser, current-index
    if not separator
      break
    let item = Line parser, separator.index
    if not item
      break
    current-index := item.index
    result.push item.value
  parser.clear-cache()
  return Box current-index, _Block-mutator result, parser, index

let _Block = mutate _Block-mutator, separated-list(
  Line
  SomeEmptyLines)

let Block = one-of(
  sequential(
    CheckIndent
    [\this, one-of<ParserNode>(IndentedUnclosedObjectLiteralInner, IndentedUnclosedArrayLiteralInner)])
  _Block)

let EmbeddedBlock = sequential(
  NotEmbeddedOpenWrite
  NotEmbeddedOpenComment
  NotEmbeddedOpenLiteral
  EmbeddedOpen
  [\this, _Block]
  EmbeddedClose)

let EmbeddedLiteralTextInnerPartWithBlock = one-of(EmbeddedLiteralTextInnerPart, EmbeddedBlock)

let EmbeddedRootInnerP = promise! #(parser, index)*
  let nodes = []
  let mutable current-index = index
  while true
    parser.clear-cache()
    unless parser.options.sync
      yield fulfilled! void
    let item = EmbeddedLiteralTextInnerPartWithBlock parser, current-index
    if not item
      break
    nodes.push item.value
    if current-index == item.index
      throw Error "Infinite loop detected"
    current-index := item.index
  parser.clear-cache()
  return Box current-index, LInternalCall \block, index, parser.scope.peek(), [
    ...nodes
    LInternalCall \return, index, parser.scope.peek(),
      LSymbol.ident index, parser.scope.peek(), \write
  ]

let EndNoIndent = sequential(
  EmptyLines
  Space
  maybe Semicolons
  word "end")

let BodyWithIndent = retain-indent sequential(
  Space
  Newline
  EmptyLines
  Advance
  [\this, Block]
  PopIndent)

let BodyNoIndentNoEnd = sequential(
  #(parser, index)
    if ColonNewline(parser, index) or (parser.options.embedded and (ColonEmbeddedClose(parser, index) or ColonEmbeddedCloseWrite(parser, index)))
      Box index
  Colon
  EmptyLines
  [\this, #(parser, index)
    let indent = parser.indent
    indent.push indent.peek() ~+ 1
    try
      Block parser, index
    finally
      indent.pop()])

let BodyNoIndent = sequential(
  [\this, BodyNoIndentNoEnd]
  EndNoIndent)

redefine Body = #(parser, index)
  let scope = parser.push-scope(true)
  let ret = if parser.options.noindent
    BodyNoIndent parser, index
  else
    BodyWithIndent parser, index
  parser.pop-scope()
  ret

redefine BodyNoEnd = #(parser, index)
  let scope = parser.push-scope(true)
  let ret = if parser.options.noindent
    BodyNoIndentNoEnd parser, index
  else
    BodyWithIndent parser, index
  parser.pop-scope()
  ret

let BOM = maybe character! "\uFEFF"

let Shebang = maybe sequential(
  HashSignChar
  ExclamationPointChar
  zero-or-more any-except Newline)

let Imports = maybe separated-list(
  sequential(
    word "import"
    Space
    [\this, SingleStringLiteral]) |> mutate #(x, parser, index)
    if not x.is-const() or not is-string! x.const-value()
      throw ParserError "Expected a string literal in import statement", parser, index
    x.const-value()
  SomeEmptyLines), # []

let RootP = promise! #(parser as Parser)*
  let bom = BOM parser, 0
  let shebang = Shebang parser, bom.index
  let mutable empty = EmptyLines parser, shebang.index
  let imports = Imports parser, empty.index
  if imports.value.length and not parser.options.filename
    throw ParserError "Cannot use the import statement if not compiling from a file", parser, empty.index
  empty := EmptyLines parser, imports.index
  if Eof parser, empty.index
    return Box empty.index, LInternalCall \root, empty.index, parser.scope.peek(),
      LValue empty.index, parser.options.filename or null
      LSymbol.nothing empty.index
      LValue empty.index, false
      LValue empty.index, false
  for import-file in imports.value
    parser.clear-cache()
    if parser.options.sync
      parser.import-sync import-file, imports.index
    else
      yield parser.import import-file, imports.index
  parser.clear-cache()
  let root = if parser.options.sync then RootInnerP.sync parser, empty.index else yield RootInnerP parser, empty.index
  parser.clear-cache()
  if not root
    return
  let empty-again = EmptyLines parser, root.index
  let end-space = Space parser, empty-again.index
  parser.clear-cache()
  Box end-space.index, LInternalCall \root, empty.index, parser.scope.peek(),
    LValue empty.index, parser.options.filename or null
    root.value
    LValue empty.index, false
    LValue empty.index, false

let EmbeddedRootP = promise! #(parser as Parser)*
  let bom = BOM parser, 0
  let shebang = Shebang parser, bom.index
  parser.clear-cache()
  let root = if parser.options.sync then EmbeddedRootInnerP.sync parser, shebang.index else yield EmbeddedRootInnerP parser, shebang.index
  parser.clear-cache()
  if not root
    return
  return Box root.index, LInternalCall \root, shebang.index, parser.scope.peek(),
    LValue shebang.index, parser.options.filename or null
    root.value
    LValue shebang.index, true
    LValue shebang.index, parser.in-generator.peek()

let EmbeddedRootGeneratorP = promise! #(parser as Parser)*
  parser.in-generator.push true
  let result = if parser.options.sync then EmbeddedRootP.sync parser else yield EmbeddedRootP parser
  parser.in-generator.pop()
  return result

define AnyObjectLiteral = one-of(
  UnclosedObjectLiteral
  ObjectLiteral
  IndentedUnclosedObjectLiteral)

define AnyArrayLiteral = one-of(
  ArrayLiteral
  IndentedUnclosedArrayLiteral)

define DedentedBody = with-space one-of(
  sequential(
    Newline
    EmptyLines
    [\this, Block])
  sequential(
    #(parser, index) -> if parser.options.embedded then Box index
    check EmbeddedClose
    EmptyLines
    [\this, Block])
  Nothing)

class Stack<T>
  def constructor(initial as T)
    @initial := initial
    @data := []
  
  def count() as Number -> @data.length
  def push(value as T)! -> @data.push value
  def pop() as T
    let data = @data
    if data.length == 0
      throw Error "Cannot pop"
    data.pop()
  def can-pop() as Boolean -> @data.length > 0
  def peek() as T
    let data = @data
    let len = data.length
    if len == 0
      @initial
    else
      data[len - 1]

let make-macro-holder()
  MacroHolder {
    Logic: prevent-unclosed-object-literal Logic
    Expression
    Assignment
    ExpressionOrAssignment
    ExpressionOrAssignmentOrBody
    FunctionDeclaration
    Statement
    Body
    BodyNoEnd
    GeneratorBody
    GeneratorBodyNoEnd
    End
    Identifier
    SimpleAssignable: IdentifierOrSimpleAccess
    Parameter
    InvocationArguments
    ObjectLiteral: AnyObjectLiteral
    ArrayLiteral: AnyArrayLiteral
    DedentedBody
    ObjectKey
    Type: TypeReference
    NoSpace
    ColonEqual
  }, macro-name, word-or-symbol, one-of, sequential

class Parser
  def constructor(@source as String = "", @macros as MacroHolder = make-macro-holder(), @options as {} = {})
    @indent := Stack<Number>(0)
    @position := Stack<String>(\statement)
    @in-ast := Stack<Boolean>(false)
    @in-generator := Stack<Boolean>(false)
    @in-function-type-params := Stack<Boolean>(false)
    @prevent-unclosed-object-literal := Stack<Boolean>(false)
    @allow-embedded-text := Stack<Boolean>(true)
    @in-macro := Stack<Boolean>(false)
    @in-ast := Stack<Boolean>(false)
    @in-evil-ast := Stack<Boolean>(false)
    @asterix-as-array-length := Stack<Boolean>(false)
    @disallow-space-before-access := Stack<Number>(0)
    @inside-indented-access := Stack<Boolean>(false)
    @in-cascade := Stack<Boolean>(false)
    @require-parameter-sequence := Stack<Boolean>(false)
    @scope := Stack<Scope>(Scope(null, true))
    @failure-messages := []
    @failure-index := -1
    @calculate-line-info()
    @cache := []
    @current-tmp-id := -1
  
  def build-error(message as String, node as Number|ParserNode)
    let index = if is-number! node
      node
    else
      node.index
    MacroError message, this, index
  
  def make-tmp(index, name as String)
    LSymbol.tmp index, @scope.peek(), (@current-tmp-id += 1), name

  let make-get-position(line-info) -> #(index as Number)
    if index == 0
      return { line: 0, column: 0 }
    let mutable left = 0
    let mutable right as Number = line-info.length
    while left != right
      let i = (left + right) \ 2
      let current as Number = line-info[i]
      if current > index
        right := i
      else if current < index
        if left == i
          break
        left := i
      else
        left := i
        break
    { line: left + 1, column: index - line-info[left] + 1 }
  def calculate-line-info()!
    let newline-regex = r"(?:\r\n?|[\n\u2028\u2029])"g
    let source = @source
    let line-info = @line-info := []
    let mutable index = 0
    line-info.push 0
    while true
      let match = newline-regex.exec(source)
      if not match
        break
      index := match.index + match[0].length
      line-info.push index
    @get-position := make-get-position line-info
  
  def index-from-position(line as Number, column as Number)
    let line-info = @line-info[line - 1]
    if line-info?
      line-info + column - 1
    else
      0
    
  def get-position(index as Number)
    // this method is overridden during calculate-line-info
    throw Error "line-info not initialized"

  def get-line(index as Number = @index)
    @get-position(index).line

  def get-column(index as Number = @index)
    @get-position(index).column
    
  def fail(message as String, index as Number)!
    if index > @failure-index
      @failure-messages := []
      @failure-index := index
    if index >= @failure-index
      @failure-messages.push message
  
  let build-expected(messages)
    let errors = unique(messages).sort #(a, b) -> a.to-lower-case() <=> b.to-lower-case()
    switch errors.length
    case 0; "End of input"
    case 1; errors[0]
    case 2; "$(errors[0]) or $(errors[1])"
    default; "$(errors[0 til -1].join ', '), or $(errors[* - 1])"
  
  def get-failure(index as Number = @failure-index)
    let source = @source
    let last-token = if index < source.length
      JSON.stringify source.substring(index, index + 20)
    else
      "end-of-input"
    
    ParserError "Expected $(build-expected @failure-messages), but $last-token found", this, index
  
  def import = promise! #(filename as String, index as Number)!*
    require! fs
    require! path
    if not is-string! @options.filename
      throw ParserError "Cannot import if the filename option is not provided", this, index
    
    let full-filename = path.resolve path.dirname(@options.filename), filename
    
    let source = if @options.sync
      fs.read-file-sync full-filename, "utf8"
    else
      yield to-promise! fs.read-file full-filename, "utf8"
    
    let parse-options = {
      filename: full-filename
      noindent: @options.noindent
      sync: @options.sync
    }
    
    let result = if @options.sync
      parse.sync(source, @macros, parse-options)
    else
      yield parse(source, @macros, parse-options)
    @macros := result.macros
  
  def import-sync(filename as String, index as Number)
    if not @options.sync
      throw Error "Expected options.sync to be true"
    @import.sync@ this, filename, index
  
  def push-scope(is-top as Boolean, parent as Scope|null)
    let scope = (parent or @scope.peek()).clone(is-top)
    @scope.push scope
    scope
  
  def pop-scope()!
    @scope.pop()
  
  def get-package-version() -> @_package-version ?= get-package-version(@options.filename)
  
  def has-macro-or-operator(name as String) -> @macros.has-macro-or-operator name
  
  def assign-operators() -> @macros.assign-operators
  
  def all-binary-operators() -> @macros.all-binary-operators()
  def binary-operators(precedence)
    @macros.binary-operators[precedence]
  def prefix-unary-operators() -> @macros.prefix-unary-operators
  def postfix-unary-operators() -> @macros.postfix-unary-operators
  
  def get-macro-by-name(name as String)
    @macros.get-by-name(name)
  
  def get-macro-by-label(label as String)
    @macros.get-by-label(label)
  
  def enter-macro(index as Number, names)!
    if not names
      throw Error "Must provide a macro name"
    if @current-macro
      throw ParserError "Attempting to define a macro $(quote String names) inside a macro $(quote String @current-macro)", this, index
    @current-macro := names
  
  def exit-macro()!
    if not @current-macro
      throw Error "Attempting to exit a macro when not in one"
    @current-macro := null
  
  def define-helper(i, name as LSymbol.ident, value as ParserNode)!
    // TODO: keep helpers in the parser and have the translator ask for them
    require! translator: './jstranslator'
    let node = @macro-expand-all(value).reduce(this)
    let type = node.type(this)
    let {helper, dependencies} = translator.define-helper(@macros, @get-position, name, node, type)
    if @options.serialize-macros
      @macros.add-serialized-helper(name.name, helper, type, dependencies)
  
  let macro-syntax-const-literals =
    ",": Comma
    ";": Semicolon
    ":": Colon
    ":=": ColonEqual
    "": Nothing
    "\n": SomeEmptyLinesWithCheckIndent
    "<": LessThan
    ">": GreaterThan
    "(": OpenParenthesis
    ")": CloseParenthesis
    "[": OpenSquareBracket
    "]": CloseSquareBracket
    "{": OpenCurlyBrace
    "}": CloseCurlyBrace
    "end": End
  
  let reduce-object(o, obj)
    if obj instanceof ParserNode
      obj.reduce(o)
    else if is-array! obj
      return for item in obj; reduce-object o, item
    else if is-object! obj and obj.constructor == Object
      let result = {}
      for k, v of obj
        result[k] := reduce-object o, v
      result
    else
      obj
  
  let make-macro-root(index, macro-full-data-param, body)
    let scope = @scope.peek()
    LInternalCall \root, index, scope,
      LValue index, null
      LInternalCall \return, index, scope,
        LInternalCall \function, index, scope,
          LInternalCall \array, index, scope, [
            macro-full-data-param
            ...for name in [\__wrap, \__const, \__value, \__symbol, \__call, \__macro]
              LInternalCall \param, index, scope,
                LSymbol.ident index, scope, name
                LSymbol.nothing index // default-value
                LValue index, false // is-spread
                LValue index, true // is-mutable
                LSymbol.nothing index // as-type
          ]
          LInternalCall \auto-return, body.index, body.scope, body
          LValue index, false
          LSymbol.nothing index
          LValue index, false
      LValue index, false
      LValue index, false
  
  let serialize-param-type(as-type as ParserNode)
    switch
    case as-type.is-symbol and as-type.is-ident
      [\ident, as-type.name]
    case as-type.is-const()
      [\const, as-type.const-value()]
    case as-type.is-internal-call()
      switch as-type.func.name
      case \syntax-sequence
        [\sequence, ...fix-array serialize-params(as-type.args)]
      case \syntax-choice
        [\choice, ...for choice in as-type.args; serialize-param-type(choice)]
      case \syntax-many
        [\many, as-type.args[1].const-value(), ...serialize-param-type(as-type.args[0])]
  let serialize-param(param as ParserNode)
    switch
    case param.is-const()
      [\const, param.const-value()]
    case param.is-internal-call(\syntax-param)
      let [ident, as-type] = param.args
      if DEBUG and not (ident.is-symbol and ident.is-ident)
        throw Error("Unknown param type: $(typeof! ident)")
      let value = if ident.name == \this
        [\this]
      else
        [\ident, ident.name]
      if not is-nothing(as-type)
        value.push ...serialize-param-type(as-type)
      value
    case param.is-internal-call(\syntax-lookahead)
      let [negate, inner] = param.args
      [\lookahead, if negate.const-value() then 1 else 0, ...serialize-param-type(inner)]
  let serialize-params(params as [ParserNode])
    simplify-array for param in params
      serialize-param param
  let deserialize-param-type = do
    let deserialize-param-type-by-type =
      ident: #(scope, name)
        LSymbol.ident 0, scope, name
      sequence: #(scope, ...items)
        LInternalCall \syntax-sequence, 0, scope, deserialize-params(items, scope)
      choice: #(scope, ...choices)
        LInternalCall \syntax-choice, 0, scope,
          for choice in choices
            deserialize-param-type(choice, scope)
      const: #(scope, value)
        LValue 0, value
      many: #(scope, multiplier, ...inner)
        LInternalCall \syntax-many, 0, scope,
          deserialize-param-type(inner, scope)
          LValue 0, multiplier
    #(as-type as [] = [], scope)
      if as-type.length == 0
        LSymbol.nothing 0
      else
        let type = as-type[0]
        if deserialize-param-type-by-type ownskey type
          deserialize-param-type-by-type[type] scope, ...as-type[1 til Infinity]
        else
          throw Error "Unknown as-type: $(String type)"
  let deserialize-param = do
    let deserialize-param-by-type =
      const: #(scope, value)
        LValue 0, value
      ident: #(scope, name, ...as-type)
        LInternalCall \syntax-param, 0, scope,
          LSymbol.ident 0, scope, name
          deserialize-param-type(as-type, scope)
      this: #(scope, ...as-type)
        LInternalCall \syntax-param, 0, scope,
          LSymbol.ident 0, scope, \this
          deserialize-param-type(as-type, scope)
      lookahead: #(scope, negate, ...as-type)
        LInternalCall \syntax-lookahead, 0, scope,
          LValue 0, not not negate
          deserialize-param-type(as-type, scope)
    #(param, scope as Scope)
      let [type] = param
      if deserialize-param-by-type ownskey type
        deserialize-param-by-type[type] scope, ...param[1 til Infinity]
      else
        throw Error "Unknown param type: $(String type)"
  let deserialize-params(params, scope as Scope)
    return for param in fix-array(params)
      deserialize-param param
  
  let calc-param(param as ParserNode)
    switch
    case param.is-symbol and param.is-ident
      let name = param.name
      let macros = @macros
      if macros.has-syntax(name)
        macros.get-syntax(name)
      else
        #(parser, index) -> parser.macros.get-syntax(name)@(this, parser, index)
    case param.is-const-type(\string)
      let string = param.const-value()
      macro-syntax-const-literals![string] or word-or-symbol string
    case param.is-internal-call()
      switch param.func.name
      case \syntax-sequence
        handle-params@ this, param.args
      case \syntax-choice
        one-of ...for choice in param.args
          calc-param@ this, choice
      case \syntax-many
        let [inner, multiplier] = param.args
        let calced = calc-param@ this, inner
        switch multiplier.const-value()
        case "*"; zero-or-more calced
        case "+"; one-or-more calced
        case "?"; one-of calced, Nothing

  let handle-param(param)
    switch
    case param.is-const-type(\string)
      let string = param.const-value()
      macro-syntax-const-literals![string] or word-or-symbol string
    case param.is-internal-call(\syntax-param)
      let [ident, as-type] = param.args
      if DEBUG and not (ident.is-symbol and ident.is-ident)
        throw Error("Unknown param type: $(typeof! ident)")

      [ident.name, calc-param@ this, (if not is-nothing(as-type) then as-type else LSymbol.ident 0, param.scope, \Expression)]
    case param.is-internal-call(\syntax-lookahead)
      let [negate, as-type] = param.args
      let calced = calc-param@ this, as-type
      if negate.const-value()
        except calced
      else
        check calced
  
  let handle-params(params as [ParserNode])
    sequential ...for param in params
      handle-param@ this, param

  let simplify-array(operators as [])
    if operators.length == 0
      void
    else if operators.length == 1 and not is-array! operators[0]
      operators[0]
    else
      operators
  let simplify-object(options as {})
    for k, v of options
      return options
    return void
  let get-compilation-options(state-options as {})
    {
      +bare
    }
  let macro-syntax-types =
    syntax: #(index, params, mutable body, options, state-options, translator)
      let scope = @scope.peek()
      let macro-full-data-ident = LSymbol.ident index, scope, \macro-full-data
      let func-param = LInternalCall \param, index, scope,
        macro-full-data-ident
        LSymbol.nothing index // default-value
        LValue index, false // is-spread
        LValue index, false // is-mutable
        LSymbol.nothing index // as-type
      let macro-name-ident = LSymbol.ident index, scope, \macro-name
      scope.add macro-name-ident, false, Type.string
      let macro-data-ident = LSymbol.ident index, scope, \macro-data
      scope.add macro-data-ident, false, Type.object
      body := LInternalCall \block, index, scope, [
        LInternalCall \var, index, scope, macro-name-ident
        LCall index, scope,
          LSymbol.assign["="] index
          macro-name-ident
          LInternalCall \access, index, scope,
            macro-full-data-ident
            LValue index, \macro-name
        LInternalCall \var, index, scope, macro-data-ident
        LCall index, scope,
          LSymbol.assign["="] index
          macro-data-ident
          LInternalCall \access, index, scope,
            macro-full-data-ident
            LValue index, \macro-data
        ...for param in params
          if param.is-internal-call(\syntax-param)
            scope.add param.args[0], true, Type.any
            LInternalCall \block, index, scope,
              LInternalCall \var, index, scope,
                param.args[0]
                LValue index, true
              LCall index, scope,
                LSymbol.assign["="] index
                param.args[0]
                LInternalCall \access, index, scope,
                  macro-data-ident
                  LValue index, param.args[0].name
        body
      ]
      let raw-func = make-macro-root@ this, index, func-param, body
      let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
      let compilation = translated.node.to-string(get-compilation-options state-options)
      let serialization = if state-options.serialize-macros then compilation
      let handler = Function(compilation)()
      if not is-function! handler
        throw Error "Error creating function for macro: $(String @current-macro)"
      {
        handler: #(args, ...rest) -> handler@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
        rule: handle-params@ this, params
        serialization: if serialization?
          type: \syntax
          code: serialization
          options: simplify-object options
          params: serialize-params params
          names: simplify-array @current-macro
      }
    
    define-syntax: #(index, params, mutable body, options, state-options, translator)
      let mutable serialization = void
      let handler = if body?
        do
          let scope = @scope.peek()
          let macro-data-ident = LSymbol.ident index, scope, \macro-data
          let func-param = LInternalCall \param, index, scope,
            macro-data-ident
            LSymbol.nothing index // default-value
            LValue index, false // is-spread
            LValue index, false // is-mutable
            LSymbol.nothing index // as-type
          body := LInternalCall \block, index, scope, [
            ...for param in params
              if param.is-internal-call(\syntax-param)
                scope.add param.args[0], true, Type.any
                LInternalCall \block, index, scope,
                  LInternalCall \var, index, scope,
                    param.args[0]
                    ParserNode.Value index, true
                  LCall index, scope,
                    LSymbol.assign["="] index
                    param.args[0]
                    LInternalCall \access, index, scope,
                      macro-data-ident
                      LValue index, param.args[0].name
            body
          ]
          let raw-func = make-macro-root@ this, index, func-param, body
          let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
          let compilation = translated.node.to-string(get-compilation-options state-options)
          if state-options.serialize-macros
            serialization := compilation
          let handler = Function(compilation)()
          if not is-function! handler
            throw Error "Error creating function for syntax: $(options.name)"
          #(args, ...rest) -> reduce-object(@parser, handler@(this, reduce-object(@parser, args), ...rest))
      else
        #(args, ...rest) -> reduce-object(@parser, args)
      {
        handler
        rule: handle-params@ this, params
        serialization: if state-options.serialize-macros
          type: \define-syntax
          code: serialization
          options: simplify-object options
          params: serialize-params params
      }
    
    call: #(index, params, mutable body, options, state-options, translator)
      let scope = @scope.peek()
      let macro-full-data-ident = LSymbol.ident index, scope, \macro-full-data
      let func-param = LInternalCall \param, index, scope,
        macro-full-data-ident
        LSymbol.nothing index // default-value
        LValue index, false // is-spread
        LValue index, false // is-mutable
        LSymbol.nothing index // as-type
      let macro-name-ident = LSymbol.ident index, scope, \macro-name
      scope.add macro-name-ident, false, Type.string
      let macro-data-ident = LSymbol.ident index, scope, \macro-data
      scope.add macro-data-ident, false, Type.object
      body := LInternalCall \block, index, scope, [
        LInternalCall \var, index, scope, macro-name-ident
        LCall index, scope,
          LSymbol.assign["="] index
          macro-name-ident
          LInternalCall \access, index, scope,
            macro-full-data-ident
            LValue index, \macro-name
        LInternalCall \var, index, scope, macro-data-ident
        LCall index, scope,
          LSymbol.assign["="] index
          macro-data-ident
          LInternalCall \access, index, scope,
            macro-full-data-ident
            LValue index, \macro-data
        ...for param, i in params
          if param.is-internal-call(\param)
            let ident = param.args[0]
            scope.add ident, true, Type.any
            LInternalCall \block, index, scope,
              LInternalCall \var, index, scope,
                ident
                ParserNode.Value index, true
              LCall index, scope,
                LSymbol.assign["="] index
                ident
                LInternalCall \access, index, scope,
                  macro-data-ident
                  LValue index, i
        body
      ]
      let raw-func = make-macro-root@ this, index, func-param, body
      let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
      let compilation = translated.node.to-string(get-compilation-options state-options)
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if not is-function! handler
        throw Error "Error creating function for macro: $(@current-macro)"
      handler := do inner = handler
        #(args, ...rest)
          inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      {
        handler
        rule: InvocationArguments
        serialization: if serialization?
          type: \call
          code: serialization
          options: simplify-object options
          names: simplify-array @current-macro
      }
    
    binary-operator: #(index, operators, mutable body, options, state-options, translator)
      let macro-data-ident = LSymbol.ident index, scope, \macro-data
      let func-param = LInternalCall \param, index, scope,
        macro-data-ident
        LSymbol.nothing index // default-value
        LValue index, false // is-spread
        LValue index, false // is-mutable
        LSymbol.nothing index // as-type
      let scope = @scope.peek()
      body := LInternalCall \block, index, scope, [
        ...for name in [\left, \op, \right]
          let ident = LSymbol.ident index, scope, name
          scope.add ident, true, Type.any
          LInternalCall \block, index, scope,
            LInternalCall \var, index, scope,
              ident
              ParserNode.Value index, true
            LCall index, scope,
              LSymbol.assign["="] index
              ident
              LInternalCall \access, index, scope,
                macro-data-ident
                LValue index, name
        body
      ]
      let raw-func = make-macro-root@ this, index, func-param, body
      let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
      let compilation = translated.node.to-string(get-compilation-options state-options)
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if not is-function! handler
        throw Error "Error creating function for binary operator $(operators.join ', ')"
      if options.invertible
        handler := do inner = handler
          #(args, ...rest)
            let result = inner@ this, reduce-object(@parser, args), ...rest
            if args.inverted
              LCall(result.index, result.scope,
                LSymbol.unary["!"] result.index
                result).reduce(@parser)
            else
              result.reduce(@parser)
      else
        handler := do inner = handler
          #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \binary-operator
          code: serialization
          operators: simplify-array operators
          options: simplify-object options
      }
    
    assign-operator: #(index, operators, mutable body, options, state-options, translator)
      let scope = @scope.peek()
      let macro-data-ident = LSymbol.ident index, scope, \macro-data
      let func-param = LInternalCall \param, index, scope,
        macro-data-ident
        LSymbol.nothing index // default-value
        LValue index, false // is-spread
        LValue index, false // is-mutable
        LSymbol.nothing index // as-type
      body := LInternalCall \block, index, scope, [
        ...for name in [\left, \op, \right]
          let ident = LSymbol.ident index, scope, name
          scope.add ident, true, Type.any
          LInternalCall \block, index, scope,
            LInternalCall \var, index, scope,
              ident
              ParserNode.Value index, true
            LCall index, scope,
              LSymbol.assign["="] index
              ident
              LInternalCall \access, index, scope,
                macro-data-ident
                LValue index, name
        body
      ]
      let raw-func = make-macro-root@ this, index, func-param, body
      let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
      let compilation = translated.node.to-string(get-compilation-options state-options)
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if not is-function! handler
        throw Error "Error creating function for assign operator $(operators.join ', ')"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \assign-operator
          code: serialization
          operators: simplify-array operators
          options: simplify-object options
      }
    
    unary-operator: #(index, operators, mutable body, options, state-options, translator)
      let scope = @scope.peek()
      let macro-data-ident = LSymbol.ident index, scope, \macro-data
      let func-param = LInternalCall \param, index, scope,
        macro-data-ident
        LSymbol.nothing index // default-value
        LValue index, false // is-spread
        LValue index, false // is-mutable
        LSymbol.nothing index // as-type
      body := LInternalCall \block, index, scope, [
        ...for name in [\op, \node]
          let ident = LSymbol.ident index, scope, name
          scope.add ident, true, Type.any
          LInternalCall \block, index, scope,
            LInternalCall \var, index, scope,
              ident
              ParserNode.Value index, true
            LCall index, scope,
              LSymbol.assign["="] index
              ident
              LInternalCall \access, index, scope,
                macro-data-ident
                LValue index, name
        body
      ]
      let raw-func = make-macro-root@ this, index, func-param, body
      let translated = translator(@macro-expand-all(raw-func).reduce(this), @macros, @get-position, return: true)
      let compilation = translated.node.to-string(get-compilation-options state-options)
      let serialization = if state-options.serialize-macros then compilation
      let mutable handler = Function(compilation)()
      if not is-function! handler
        throw Error "Error creating function for unary operator $(operators.join ', ')"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      {
        handler
        rule: void
        serialization: if serialization?
          type: \unary-operator
          code: serialization
          operators: simplify-array operators
          options: simplify-object options
      }
  
  let fix-array(operators)
    if not operators?
      []
    else if is-array! operators
      operators
    else
      [operators]
  let macro-deserializers =
    syntax: #({code, params, mutable names, options = {}, id})
      names := fix-array names
      let mutable handler = code
      if not is-function! handler
        throw Error "Error deserializing function for macro $(name)"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      @enter-macro 0, names
      handle-macro-syntax@ this, 0, \syntax, handler, handle-params@(this, deserialize-params(params, @scope.peek())), null, options, id
      @exit-macro()
    
    call: #({code, mutable names, options = {}, id})
      names := fix-array names
      let mutable handler = code
      if not is-function! handler
        throw Error "Error deserializing function for macro $(name)"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      @enter-macro 0, names
      handle-macro-syntax@ this, 0, \call, handler, InvocationArguments, null, options, id
      @exit-macro()
    
    define-syntax: #({code, params, options = {}, id})
      if @macros.has-syntax(options.name)
        throw Error "Cannot override already-defined syntax: $(options.name)"
      
      let mutable handler = void
      if code?
        handler := code
        if not is-function! handler
          throw Error "Error deserializing function for macro syntax $(options.name)"
        handler := do inner = handler
          #(args, ...rest) -> reduce-object(@parser, inner@(this, reduce-object(@parser, args), ...rest))
      else
        handler := #(args) -> reduce-object(@parser, args)
      
      @enter-macro 0, DEFINE_SYNTAX
      handle-macro-syntax@ this, 0, \define-syntax, handler, handle-params@(this, deserialize-params(params, @scope.peek())), null, options, id
      @exit-macro()
    
    binary-operator: #({code, mutable operators, options = {}, id})
      operators := fix-array operators
      let mutable handler = code
      if not is-function! handler
        throw Error "Error deserializing function for binary operator $(operators.join ', ')"
      if options.invertible
        handler := do inner = handler
          #(args, ...rest)
            let result = inner@ this, reduce-object(@parser, args), ...rest
            if args.inverted
              LCall(result.index, result.scope,
                LSymbol.unary["!"] result.index
                result).reduce(@parser)
            else
              result.reduce(@parser)
      else
        handler := do inner = handler
          #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      @enter-macro 0, BINARY_OPERATOR
      handle-macro-syntax@ this, 0, \binary-operator, handler, void, operators, options, id
      @exit-macro()
      
    assign-operator: #({code, mutable operators, options = {}, id})
      operators := fix-array operators
      let mutable handler = code
      if not is-function! handler
        throw Error "Error deserializing function for assign operator $(operators.join ', ')"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      @enter-macro 0, ASSIGN_OPERATOR
      handle-macro-syntax@ this, 0, \assign-operator, handler, void, operators, options, id
      @exit-macro()
    
    unary-operator: #({code, mutable operators, options = {}, id})!
      operators := fix-array operators
      let mutable handler = code
      if not is-function! handler
        throw Error "Error deserializing function for unary operator $(operators.join ', ')"
      handler := do inner = handler
        #(args, ...rest) -> inner@(this, reduce-object(@parser, args), ...rest).reduce(@parser)
      @enter-macro 0, UNARY_OPERATOR
      handle-macro-syntax@ this, 0, \unary-operator, handler, void, operators, options, id
      @exit-macro()
  
  let remove-noops(obj)
    if is-array! obj
      return for item in obj
        if is-nothing(item)
          void
        else
          remove-noops(item)
    else if is-object! obj and obj.constructor == Object
      let result = {}
      for k, v of obj
        if not is-nothing(v)
          result[k] := remove-noops(v)
      result
    else
      obj
  
  def start-macro-syntax(index, params as [], options = {})
    if not @current-macro
      throw Error "Attempting to specify a macro syntax when not in a macro"
    
    let rule = handle-params@ this, params
    
    let macros = @macros
    let mutator = #(data, parser, index)
      if parser.in-ast.peek() or not parser.expanding-macros
        ParserNode.MacroAccess index, parser.scope.peek(),
          macro-id
          remove-noops(data)
          parser.position.peek() == \statement
          parser.in-generator.peek()
          parser.in-evil-ast.peek()
      else
        throw Error "Cannot use macro until fully defined"
    for m in macros.get-or-add-by-names @current-macro
      m.data.push sequential(
        [\macro-name, m.token]
        [\macro-data, rule]) |> mutate mutator
    let macro-id = macros.add-macro mutator, void, if options.type? then Type![options.type]
    @pending-macro-id := macro-id
    params
  
  let handle-macro-syntax(index, type, handler as Function, rule, params, options, mutable macro-id)
    let mutator = #(data, parser, index)
      if parser.in-ast.peek() or not parser.expanding-macros
        ParserNode.MacroAccess index, parser.scope.peek(),
          macro-id
          remove-noops(data)
          parser.position.peek() == \statement
          parser.in-generator.peek()
          parser.in-evil-ast.peek()
      else
        let scope = parser.push-scope(false)
        let macro-context = MacroContext parser, index, parser.position.peek(), parser.in-generator.peek(), parser.in-evil-ast.peek()
        if type == \assign-operator
          let left = macro-context.macro-expand-1(data.left)
          if left.is-ident and not parser.in-evil-ast.peek()
            if not macro-context.has-variable(left)
              macro-context.error "Trying to assign with $(data.op) to unknown variable '$(left.name)'", left
            else if not macro-context.is-variable-mutable(left)
              macro-context.error "Trying to assign with $(data.op) to immutable variable '$(left.name)'", left
        let mutable result = void
        try
          result := handler@ macro-context, remove-noops(data), macro-context@.wrap, macro-context@.get-const, macro-context@.make-lispy-value, macro-context@.make-lispy-symbol, macro-context@.make-lispy-call, macro-context@.macro
        catch e as ReferenceError
          throw e
        catch e as MacroError
          let pos = parser.get-position(index)
          e.set-position pos.line, pos.column
          throw e
        catch e
          if DEBUG
            throw e
          else
            throw MacroError e, parser, index
        
        if result instanceof ParserNode
          result := result.reduce(parser)
          let tmps = macro-context.get-tmps()
          if tmps.unsaved.length
            result := LInternalCall \tmp-wrapper, index, result.scope, [
              result
              ...(for tmp-id in tmps.unsaved; LValue index, tmp-id)
            ]
        parser.pop-scope()
        // TODO: do I need to watch tmps?
        result
    let macros = @macros
    macro-id := switch @current-macro
    case BINARY_OPERATOR
      macros.add-binary-operator(params, mutator, options, macro-id)
    case ASSIGN_OPERATOR
      macros.add-assign-operator(params, mutator, options, macro-id)
    case UNARY_OPERATOR
      macros.add-unary-operator(params, mutator, options, macro-id)
    case DEFINE_SYNTAX
      if not rule
        throw Error "Expected rule to exist"
      macros.add-syntax options.name, rule |> mutate mutator
      macros.add-macro mutator, macro-id, if options.type? then Type![options.type]
    default
      if not rule
        throw Error "Expected rule to exist"
      for m in macros.get-or-add-by-names @current-macro
        if @pending-macro-id?
          m.data.pop()
        m.data.push cache(sequential(
          [\macro-name, m.token]
          [\macro-data, rule]) |> mutate mutator)
      if options.label
        macros.add-by-label options.label, {
          func: mutator
        }
      if @pending-macro-id?
        if macro-id?
          throw Error "Cannot provide the macro id if there is a pending macro id"
        let id = @pending-macro-id
        @pending-macro-id := null
        macros.replace-macro id, mutator, if options.type? then Type![options.type]
        id
      else  
        macros.add-macro mutator, macro-id, if options.type? then Type![options.type]
  
  def macro-syntax(index, type, params as [], options, body)!
    if macro-syntax-types not ownskey type
      throw Error "Unknown macro-syntax type: $type"
    
    if not @current-macro
      this.error "Attempting to specify a macro syntax when not in a macro"
    
    // TODO: don't assume translator uses JS
    let {handler, rule, serialization} = macro-syntax-types[type]@(this, index, params, body, options, @options, require('./jstranslator'))
    
    let macro-id = handle-macro-syntax@ this, index, type, handler, rule, params, options
    if serialization?
      serialization.id := macro-id
      @macros.add-macro-serialization serialization
  
  let BINARY_OPERATOR = {}
  def define-binary-operator(index as Number, operators as [String], options as Object, body as ParserNode)
    @enter-macro index, BINARY_OPERATOR
    @macro-syntax index, \binary-operator, operators, options, body
    @exit-macro()
  
  let ASSIGN_OPERATOR = {}
  def define-assign-operator(index as Number, operators as [String], options as Object, body as ParserNode)
    @enter-macro index, ASSIGN_OPERATOR
    @macro-syntax index, \assign-operator, operators, options, body
    @exit-macro()
  
  let UNARY_OPERATOR = {}
  def define-unary-operator(index as Number, operators as [String], options as Object, body as ParserNode)
    @enter-macro index, UNARY_OPERATOR
    @macro-syntax index, \unary-operator, operators, options, body
    @exit-macro()
  
  let DEFINE_SYNTAX = {}
  def define-syntax(index, name, params, body)
    @enter-macro index, DEFINE_SYNTAX
    @macro-syntax index, \define-syntax, params, { name }, body
    @exit-macro()
  
  def define-const(index, name as String, value)!
    let scope = @scope.peek()
    if scope == @scope.initial
      @macros.add-const name, value
      if @options.serialize-macros
        @macros.add-serialized-const(name)
    scope.add-const name, value
  
  def get-const(name as String, scope as Scope = @scope.peek())
    return? scope.const-value(name)
    let consts = @macros.consts
    if consts ownskey name
      { value: consts[name] }
  
  def get-const-value(name as String, default-value)
    let c = @get-const(name)
    if c
      c.value
    else
      default-value
  
  def deserialize-macros(data)
    for type, deserializer of macro-deserializers
      for item in (data![type] ? [])
        deserializer@(this, item)
  
  def macro-expand-1(mutable node)
    if node._macro-expanded?
      return node._macro-expanded
    else if node instanceof ParserNode.MacroAccess
      let nodes = []
      while node instanceof ParserNode.MacroAccess
        nodes.push node
        @position.push if node.in-statement then \statement else \expression
        @in-generator.push node.in-generator
        @in-evil-ast.push node.in-evil-ast
        @scope.push node.scope
        let old-expanding-macros = @expanding-macros
        @expanding-macros := true
        let mutable result = void
        try
          // TODO: change start-index
          result := @macros.get-by-id(node.id)(node.data, this, node.index)
        catch e
          if e instanceof MacroError
            // TODO: add column as well
            e.set-position node.call-line, 0
          throw e
        finally
          @scope.pop()
          @position.pop()
          @in-generator.pop()
          @in-evil-ast.pop()
          @expanding-macros := old-expanding-macros
        node := if node.do-wrapped
          result.do-wrap(this)
        else
          result
      for n in nodes
        n._macro-expanded := node
      node
    else
      node._macro-expanded := node
  
  let with-delay(func as ->)
    let mutable start-time = new Date().get-time()
    let wrapped()
      if (new Date().get-time() - start-time) > 5_ms
        set-immediate (#(x, y)
          start-time := new Date().get-time()
          wrapped@ x, ...y), this, arguments
      else
        func@ this, ...arguments
    wrapped
  
  let make-macro-expand-all-async-walker()
    let walker = with-delay #(node, callback)
      if node._macro-expand-alled?
        callback null, node._macro-expand-alled
      else if node not instanceof ParserNode.MacroAccess
        async! callback, walked <- node.walk-async walker, this
        callback null, (walked._macro-expand-alled := walked._macro-expanded := node._macro-expand-alled := node._macro-expanded := walked)
      else
        let mutable expanded = void
        try
          expanded := @macro-expand-1 node
        catch e
          return callback e
        if expanded not instanceof ParserNode
          return callback null, (node._macro-expand-alled := node._macro-expanded := expanded)
        async! callback, walked <- walker@ this, expanded
        callback null, (expanded._macro-expand-alled := expanded._macro-expanded := walked._macro-expand-alled := walked._macro-expanded := node._macro-expand-alled := node._macro-expanded := walked)
    walker
  def macro-expand-all-async(node, callback)
    make-macro-expand-all-async-walker()@ this, node, #(err, result)
      callback err, result
  
  let macro-expand-all-walker(node)
    if node._macro-expand-alled?
      node._macro-expand-alled
    else if node not instanceof ParserNode.MacroAccess
      let walked = node.walk macro-expand-all-walker, this
      walked._macro-expand-alled := walked._macro-expanded := node._macro-expand-alled := node._macro-expanded := walked
    else
      let expanded = @macro-expand-1 node
      if expanded not instanceof ParserNode
        return (node._macro-expand-alled := node._macro-expanded := expanded)
      let walked = macro-expand-all-walker@ this, expanded
      expanded._macro-expand-alled := expanded._macro-expanded := walked._macro-expand-alled := walked._macro-expanded := node._macro-expand-alled := node._macro-expanded := walked
  def macro-expand-all(node)
    macro-expand-all-walker@ this, node
  
  def macro-expand-all-promise(node)
    if @options.sync
      fulfilled! @macro-expand-all(node)
    else
      let defer = __defer()
      @macro-expand-all-async node, #(err, result)
        if err
          defer.reject err
        else
          defer.fulfill result
      defer.promise
  
  def clear-cache()! -> @cache := []

let parse = promise! #(source as String, mutable macros as MacroHolder|null, options as {} = {})*
  let mutable parser = Parser source, macros?.clone(), options
  macros := parser.macros
  
  let root-rule = if options.embedded-generator
    EmbeddedRootGeneratorP
  else if options.embedded
    EmbeddedRootP
  else
    RootP

  let start-time = new Date().get-time()
  let mutable result = void
  try
    result := if options.sync then root-rule.sync(parser) else yield root-rule parser
  catch e == SHORT_CIRCUIT
    void

  parser.clear-cache()
  let end-parse-time = new Date().get-time()
  options.progress?(\parse, end-parse-time - start-time)

  if not result or result.index < source.length
    throw parser.get-failure(result?.index)

  let expanded = yield parser.macro-expand-all-promise result.value

  let end-expand-time = new Date().get-time()
  options.progress?(\macro-expand, end-expand-time - end-parse-time)
  let reduced = expanded.reduce(parser)
  let end-reduce-time = new Date().get-time()
  options.progress?(\reduce, end-reduce-time - end-expand-time)
  let {get-position} = parser
  parser := null
  return {
    result: reduced
    macros
    get-position
    parse-time: end-parse-time - start-time
    macro-expand-time: end-expand-time - end-parse-time
    reduce-time: end-reduce-time - end-expand-time
    time: end-reduce-time - start-time
  }
module.exports := parse <<< {
  ParserError
  MacroError
  Node: ParserNode
  MacroHolder
  unused-caches
  deserialize-prelude: #(data)
    let parsed = if is-string! data
      Function("'use strict'; return " & data)()
    else
      data
    let parser = Parser()
    parser.macros.deserialize(parsed, parser, {})
    parser.macros
  get-reserved-words: #(macros, options = {})
    unique [...get-reserved-idents(options), ...(macros?.get-macro-and-operator-names?() or [])]
}
