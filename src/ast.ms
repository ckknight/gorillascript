require! './types'

enum Level
  def block // { f(); `...`; g(); }
  def inside-parentheses // f() + (`...`) + g() or f[`...`]
  def sequence // [f(), `...`, g()] or x(f(), `...`, g())
  def assignment  // `...` += x
  def inline-condition // `...` ? x : y
  def logical-or // f() || `...`
  def logical-and // f() && `...`
  def bitwise-or // f() | `...`
  def bitwise-and // f() ^ `...`
  def bitwise-xor // f() & `...`
  def equality // f() == `...`
  def relational // f() < `...` or f() in `...` or f() instanceof `...`
  def bitwise-shift // f() << `...` or f() >> `...` or f() >>> `...`
  def addition // f() + `...` or f() - `...`
  def multiplication // f() * `...` or f() / `...` or f() % `...`
  def unary // +`...` or !`...`
  def increment // ++`...` or `...`++ or --`...` or `...`--
  def call // `...`()
  def access // `...`[0] or `...`.item

let INDENT = "  "

let inc-indent(options)
  let clone = ^options
  clone.indent += 1
  clone

let get-indent = do
  let cache = [""]
  #(indent)
    if indent >= cache.length
      let mutable result = cache[cache.length - 1]
      for i = cache.length, indent
        result &= INDENT
        cache.push result
    cache[indent]

let StringBuilder()
  let data = []
  let sb = #(item)! -> data.push item
  sb.indent := #(count)!
    data.push get-indent(count)
  sb.to-string := #
    switch data.length
    case 0; ""
    case 1; data[0]
    default
      let text = data.join ""
      data.splice 0, data.length, text
      text
  sb

let escape-unicode-helper(m)
  let num = m.char-code-at(0).to-string(16)
  switch num.length
  case 1; "\\u000$num"
  case 2; "\\u00$num"
  case 3; "\\u0$num"
  case 4; "\\u$num"
  default; throw Error()

let escape-unicode(text)
  text.replace r'[\u0000-\u001f\u0080-\uffff]'g, escape-unicode-helper

let to-JS-source-types = {
  undefined: #-> "void 0"
  number: #(value)
    if is-finite value
      JSON.stringify value
    else if isNaN value
      "0/0"
    else if value > 0
      "1/0"
    else
      "-1/0"
  string: #(value)
    let json-string = escape-unicode JSON.stringify(value)
    if value.index-of('"') == -1 or value.index-of("'") != -1
      json-string
    else
      "'" & json-string.substring(1, json-string.length - 1).replace(r'\\"'g, '"') & "'"
  boolean: #(value) -> if value then "true" else "false"
  object: #(value)
    if value instanceof RegExp
      let source = value.source.replace(r"(\\\\)*\\?/"g, "\$1\\/") or "(?:)"
      let flags = []
      if value.global
        flags.push "g"
      if value.ignore-case
        flags.push "i"
      if value.multiline
        flags.push "m"
      "/$(source)/$(flags.join '')"
    else
      JSON.stringify value
}
let to-JS-source(value)
  let f = to-JS-source-types[typeof value]
  unless f
    throw TypeError "Cannot compile const $(typeof! value)"
  f value

let is-acceptable-ident = exports.is-acceptable-ident := do
  let IDENTIFIER_REGEX = r'^[a-zA-Z_\$][a-zA-Z_\$0-9]*$'
  let RESERVED = [
    "arguments"
    "break"
    "case"
    "catch"
    "class"
    "const"
    "continue"
    "debugger"
    "default"
    "delete"
    "do"
    "else"
    "enum"
    "export"
    "extends"
    "eval"
    "false"
    "finally"
    "for"
    "function"
    "if"
    "implements"
    "import"
    "in"
    "Infinity"
    "instanceof"
    "interface"
    "let"
    "NaN"
    "new"
    "null"
    "package"
    "private"
    "protected"
    "public"
    "return"
    "static"
    "super"
    "switch"
    "this"
    "throw"
    "true"
    "try"
    "typeof"
    "undefined"
    "var"
    "void"
    "while"
    "with"
    "yield"
  ]
  #(name as String)
    IDENTIFIER_REGEX.test(name) and name not in RESERVED

exports.Node := class Node
  def constructor()@
    throw Error "Node cannot be instantiated directly"
  
  def to-string()
    let sb = StringBuilder()
    @compile-as-statement { indent: 0, bare: true }, true, sb
    sb.to-string()
  
  def to-function()
    new Function @to-string()
  
  def compile() -> throw Error "compile not implemented: $(@constructor.name)"
  
  def maybe-to-statement()
    if typeof @to-statement == "function"
      @to-statement()
    else
      this
  
  def is-const() -> false
  def is-noop() -> false
  def const-value() -> throw Error "$(@constructor.name) has no const value"
  
  def is-large() -> true
  def is-small() -> not @is-large()
  
  def mutate-last() -> this
  
  def exit-type() -> null
  def last() -> this

exports.Expression := class Expression extends Node
  def constructor()@
    throw Error "Expression cannot be instantiated directly"
  
  def to-string() -> super.to-string() & ";"
  
  def compile-as-statement(options, line-start, sb)!
    if typeof @to-statement == "function"
      @to-statement().compile-as-statement options, line-start, sb
    else
      @compile options, Level.block, line-start, sb
      sb ";"
  
  def type() -> types.any
  
  def is-large() -> false
  
  def mutate-last(func) -> func(this)

exports.Statement := class Statement extends Node
  def constructor()@
    throw Error "Expression cannot be instantiated directly"
  
  def compile-as-statement(options, line-start, sb)
    @compile options, Level.block, line-start, sb

exports.Access := #(parent, ...children)
  let mutable current = parent
  for child in children
    current := Binary current, ".", child
  current

exports.Arguments := class Arguments extends Expression
  def constructor()@ ->
  
  def compile(options, level, line-start, sb)! -> sb "arguments"
  def type() -> types.args
  def walk() -> this

let walk-array(array as Array, walker as Function)
  let mutable changed = false
  let result = for item in array
    let mutable new-item = walker item
    unless new-item?
      new-item := item.walk walker
    if item != new-item
      changed := true
    new-item
  if changed
    result
  else
    array

exports.Arr := class Arr extends Expression
  def constructor(elements as [Expression] = [])@
    @elements := elements
  
  let compile-large(elements, options, level, line-start, sb)!
    let child-options = inc-indent options
    for item, i, len in elements
      sb "\n"
      sb.indent child-options.indent
      item.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
  let compile-small(elements, options, level, line-start, sb)!
    if elements.length
      for item, i in elements
        if i > 0
          sb ", "
        item.compile options, Level.sequence, false, sb
  def compile(options, level, line-start, sb)!
    sb "["
    let f = if @should-compile-large() then compile-large else compile-small
    f(@elements, options, level, line-start, sb)
    sb "]"
  
  def type() -> types.array
  
  def should-compile-large()
    switch @elements.length
    case 0; false
    case 1; @elements[0].is-large()
    default; @is-large()
  
  def is-small()
    switch @elements.length
    case 0; true
    case 1; @elements[0].is-small()
    default; false
  
  def is-large()
    @_is-large ?= @elements.length > 4 or for some element in @elements
      not element.is-small()
  
  def walk(walker)
    let elements = walk-array @elements, walker
    if @elements != elements
      Arr elements
    else
      this

exports.Assign := #(left, right)
  Binary left, "=", right

exports.Concat := #(...args)
  let mutable current = Const ""
  for arg in args
    current := Binary current, "+", arg
  current

exports.And := #(...args)
  if args.length == 0
    Const true
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "&&", args[i]
    current

exports.Or := #(...args)
  if args.length == 0
    Const false
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "||", args[i]
    current

exports.Binary := class Binary extends Expression
  def constructor(mutable left, op as String, mutable right)@
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(JSON.stringify op)"
    
    if left not instanceof Expression
      left := to-const left
    if right not instanceof Expression
      right := to-const right
    
    if CONST_OPERATIONS ownskey op and left.is-const() and right.is-const()
      let node = CONST_OPERATIONS[op] left.const-value(), right.const-value()
      if node != void
        return if node instanceof Expression
          node
        else
          Const node
    
    if LEFT_CONSTANT_OPERATIONS ownskey op and left.is-const()
      return? LEFT_CONSTANT_OPERATIONS[op] left, right
    
    if RIGHT_CONSTANT_OPERATIONS ownskey op and right.is-const()
      return? RIGHT_CONSTANT_OPERATIONS[op] left, right
    
    @left := left
    @op := op
    @right := right
  
  let compile-access(op, left, right, options, level, line-start, sb)!
    let dot-access = right instanceof Const and typeof right.value == "string" and is-acceptable-ident(right.value)
    
    if left instanceof Const and typeof left.value == "number"
      let string-left = to-JS-source left.value
      if left.value < 0 or not is-finite(left.value)
        sb "("
        sb string-left
        sb ")"
      else
        sb string-left
        if dot-access and string-left.index-of("e") == -1 and string-left.index-of(".") == -1
          sb "."
    else if left.is-const() and left.const-value() == void
      sb "("
      sb to-JS-source(void)
      sb ")"
    else
      left.compile options, Level.access, line-start, sb
    
    if dot-access
      sb "."
      sb right.value
    else
      sb "["
      right.compile options, Level.inside-parentheses, false, sb
      sb "]"
  
  let compile-other(op, left, right, options, level, line-start, sb)!
    let op-level = OPERATOR_PRECEDENCE[op]
    let associativity = LEVEL_TO_ASSOCIATIVITY[op-level]
    let wrap = if associativity == "paren" then level >= op-level else level > op-level
  
    if wrap
      sb "("
    left.compile options, if associativity == "right" and left instanceof Binary and OPERATOR_PRECEDENCE[left.op] == op-level then op-level + 1 else op-level, line-start and not wrap, sb
    sb " "
    sb op
    sb " "
    right.compile options, if associativity == "left" and right instanceof Binary and OPERATOR_PRECEDENCE[right.op] == op-level then op-level + 1 else op-level, false, sb
    if wrap
      sb ")"
  
  def compile(options, level, line-start, sb)!
    let f = if @op == "." then compile-access else compile-other
    f(@op, @left, @right, options, level, line-start, sb)
  
  def compile-as-statement(options, line-start, sb)!
    let left = @left
    let op = @op
    if ASSIGNMENT_OPS ownskey op and left instanceof Ident and typeof @right.to-statement == "function"
      @right.to-statement()
        .mutate-last((#(node) -> Binary left, op, node), true)
        .compile-as-statement(options, line-start, sb)
    else
      super.compile-as-statement(options, line-start, sb)
  
  let ASSIGNMENT_OPS = {
    "=": true
    "-=": true
    "*=": true
    "/=": true
    "%=": true
    "<<=": true
    ">>=": true
    ">>>=": true
    "&=": true
    "^=": true
    "|=": true
  }
  
  let OPERATOR_TYPES = {
    ".": types.any
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
    "=": #(left, right) -> right
    "+=": #(left, right) -> OPERATOR_TYPES["+"](left, right)
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
  
  def type() -> @_type ?= do
    let handler = OPERATOR_TYPES[@op]
    if typeof handler == "function"
      handler @left.type(), @right.type()
    else
      handler
  
  let CONST_OPERATIONS = {
    "*": (~*)
    "/": (~/)
    "%": (~%)
    "+": #(x, y)
      if typeof x == "number" and typeof y == "number"
        x ~+ y
      else
        x ~& y
    "-": (~-)
    "<<": (~bitlshift)
    ">>": (~bitrshift)
    ">>>": (~biturshift)
    "<": (~<)
    "<=": (~<=)
    ">": (~>)
    ">=": (~>=)
    "===": (==)
    "!==": (!=)
    "==": (~=)
    "!=": (!~=)
    "&": (~bitand)
    "^": (~bitxor)
    "|": (~bitor)
    "&&": (and)
    "||": (or)
    ".": #(x, y)
      if Object(x) haskey y and typeof x[y] != "function"
        to-const x[y]
  }
  
  let LEFT_CONSTANT_OPERATIONS = {
    "&&": #(x, y) -> if x.const-value() then y else x
    "||": #(x, y) -> if x.const-value() then x else y
    "*": #(x, y)
      if x.const-value() == 1
        Unary "+", y
      else if x.const-value() == -1
        Unary "-", y
    "+": #(x, y)
      if x.const-value() == 0
        Unary "+", y
      else if x.const-value() == "" and y.type().is-subset-of(types.string)
        y
    "-": #(x, y)
      if x.const-value() == 0
        Unary "-", y
  }
  
  let RIGHT_CONSTANT_OPERATIONS = {
    "*": #(x, y)
      if y.const-value() == 1
        Unary "+", x
      else if y.const-value() == -1
        Unary "-", x
    "/": #(x, y)
      if y.const-value() == 1
        Unary "+", x
      else if y.const-value() == -1
        Unary "-", x
    "+": #(x, y)
      let y-value = y.const-value()
      if y-value == 0
        Unary "+", x
      else if typeof y-value == "number" and y-value < 0
        Binary x, "-", Const(-y-value)
      else if y-value == "" and x.type().is-subset-of(types.string)
        x
    "-": #(x, y)
      let y-value = y.const-value()
      if y-value == 0
        Unary "+", x
      else if typeof y-value == "number" and y-value < 0
        Binary x, "+", Const(-y-value)
  }
  
  let OPERATOR_PRECEDENCE = {
    ".": Level.access
    "*": Level.multiplication
    "/": Level.multiplication
    "%": Level.multiplication
    "+": Level.addition
    "-": Level.addition
    "<<": Level.bitwise-shift
    ">>": Level.bitwise-shift
    ">>>": Level.bitwise-shift
    "<": Level.relational
    "<=": Level.relational
    ">": Level.relational
    ">=": Level.relational
    "in": Level.relational
    "instanceof": Level.relational
    "==": Level.equality
    "!=": Level.equality
    "===": Level.equality
    "!==": Level.equality
    "&": Level.bitwise-and
    "^": Level.bitwise-xor
    "|": Level.bitwise-or
    "&&": Level.logical-and
    "||": Level.logical-or
    "=": Level.assignment
    "+=": Level.assignment
    "-=": Level.assignment
    "*=": Level.assignment
    "/=": Level.assignment
    "%=": Level.assignment
    "<<=": Level.assignment
    ">>=": Level.assignment
    ">>>=": Level.assignment
    "&=": Level.assignment
    "^=": Level.assignment
    "|=": Level.assignment
  }
  
  let LEVEL_TO_ASSOCIATIVITY = {
    (Level.equality): "paren"
    (Level.relational): "paren"
    (Level.addition): "left"
    (Level.multiplication): "left"
    (Level.bitwise-and): "none"
    (Level.bitwise-or): "none"
    (Level.bitwise-xor): "none"
    (Level.bitwise-shift): "left"
    (Level.assignment): "right"
  }
  
  def is-large()
    @_is-large ?= not @left.is-small() or not @right.is-small()
  
  def is-small()
    @_is-small ?= @left.is-small() and @right.is-small()
  
  def walk(walker)
    let mutable changed = false
    let left = walker(@left) ? @left.walk(walker)
    let right = walker(@right) ? @right.walk(walker)
    if @left != left or @right != right
      Binary left, @op, right
    else
      this

exports.BlockStatement := class BlockStatement extends Statement
  def constructor(body as [Node] = [])@
    let result = []
    for item in body
      let statement = item.maybe-to-statement()
      if not statement.is-noop()
        if statement instanceof BlockStatement
          result.push ...statement.body
        else
          result.push statement
        if statement.exit-type()?
          break
    switch result.length
    case 0; return Noop()
    case 1; return result[0]
    @body := result
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    for item, i in @body
      if i > 0
        sb "\n"
        sb.indent options.indent
      item.compile-as-statement options, true, sb
  
  def walk(walker)
    let body = walk-array(@body, walker)
    if @body != body
      Block body
    else
      this
  
  def mutate-last(func, include-noop)
    let last = @last()
    let new-last = last.mutate-last(func, include-noop)
    if last != new-last
      let body = @body[:-1]
      body.push new-last
      Block body
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[@body.length - 1]

exports.BlockExpression := class BlockExpression extends Expression
  def constructor(body as [Expression] = [])@
    let result = []
    result := []
    for item, i, len in body
      if i == len - 1 or not item.is-noop()
        if item instanceof BlockExpression
          result.push ...item.body
          if i < len - 1 and result[result.length - 1].is-noop()
            result.pop()
        else if item not instanceof Noop
          result.push item
    switch result.length
    case 0; return Noop()
    case 1; return result[0]
    @body := result
  
  def to-statement() -> BlockStatement @body
  
  def compile(options, level, line-start, sb)!
    if level == Level.block
      @to-statement().compile options, level, line-start, sb
    else
      let wrap = level > Level.inside-parentheses
      if wrap
        sb "("
      for item, i in @body
        if i > 0
          sb ", "
        item.compile options, Level.sequence, false, sb
      if wrap
        sb ")"
  
  def type() -> @last().type()
  
  def is-large()
    @_is-large ?= @body.length > 4 or for some part in @body
      part.is-large()
  
  def is-small() -> false
  
  def walk = BlockStatement::walk
  def last() -> @body[@body.length - 1]

let Block = exports.Block := #(body as [Node] = [])
  if body.length == 0
    Noop()
  else
    if (for every item in body; item instanceof Expression)
      BlockExpression body
    else
      BlockStatement body

exports.Break := class Break extends Statement
  def constructor()@ ->
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "break;"
  
  def walk() -> this
  
  def exit-type() -> \break

exports.Call := class Call extends Expression
  def constructor(func as Expression, args as [Expression] = [], is-new as Boolean)@
    @func := func
    @args := args
    @is-new := is-new
  
  let compile-large(args, options, level, line-start, sb)!
    sb "("
    let child-options = inc-indent options
    for item, i, len in args
      sb "\n"
      sb.indent child-options.indent
      item.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
    sb ")"
  let compile-small(args, options, level, line-start, sb)!
    sb "("
    for arg, i in args
      if i > 0
        sb ", "
      arg.compile options, Level.sequence, false, sb
    sb ")"
  def compile(options, level, line-start, sb)!
    if @is-new
      sb "new "
    
    let wrap = not @is-new and (@func instanceof Func or (@func instanceof Binary and @func.op == "." and @func.left instanceof Func))
    if wrap
      sb "("
    @func.compile options, Level.call, line-start and not wrap and not @is-new, sb
    let f = if @should-compile-large() then compile-large else compile-small
    f(@args, options, level, line-start, sb)
    if wrap
      sb ")"
  
  def should-compile-large()
    if @args.length > 4
      true
    else
      for some arg in @args[:-1]
        not arg.is-small()
  
  def has-large-args()
    @_has-large-args ?= if @args.length > 4
      true
    else
      for some arg in @args
        not arg.is-small()
  
  def is-large() -> @func.is-large() or @has-large-args()
  
  def is-small()
    @_is-small ?= if not @func.is-small()
      false
    else
      do // FIXME
        switch @args.length
        case 0; true
        case 1; @args[0].is-small()
        default; false
  
  def walk(walker)
    let func = walker(@func) ? @func.walk(walker)
    let args = walk-array(@args, walker)
    if @func != func or @args != args
      Call func, args, @is-new
    else
      this
  
  let HELPER_TYPES = {
    __num: types.number
    __str: types.string
    __strnum: types.string // converts to string regardless
    __lt: types.boolean
    __lte: types.boolean
    __owns: types.boolean
    __in: types.boolean
    __slice: types.array
    __splice: types.array // technically it just returns the 4th arg
    __typeof: types.string
    __cmp: types.number
    __freeze: #(args)
      if args.length >= 1
        args[0].type()
      else
        types.undefined
    __freeze-func: #(args)
      if args.length >= 1
        args[0].type()
      else
        types.undefined
    __is-array: types.boolean
    __to-array: types.array
    __create: types.object
    __pow: types.number
    __floor: types.number
    __sqrt: types.number
    __log: types.number
    __keys: types.string.array()
    __allkeys: types.string.array()
    __new: types.any
    __instanceofsome: types.boolean
    __xor: #(args)
      types.boolean.union(if args.length >= 2 then args[1].type() else types.undefined)
  }
  
  def type()
    @_type ?= if @func instanceof Ident and HELPER_TYPES ownskey @func.name
      let helper = HELPER_TYPES[@func.name]
      if typeof helper == "function"
        helper(@args)
      else
        helper
    else
      types.any

let to-const(value)
  if value instanceof Node
    throw Error "Cannot convert $(typeof! value) to a Const"
  else if Array.is-array(value)
    Arr (for item in value
      to-const item)
  else if value and typeof value == "object" and value not instanceof RegExp
    Obj (for k, v of value; Obj.Pair k, to-const v)
  else
    Const value

exports.Const := class Const extends Expression
  def constructor(value as (void|null|Boolean|Number|String|RegExp))@
    @value := value
  
  def compile(options, level, line-start, sb)!
    let value = @value
    let wrap = level >= Level.increment and (value == undefined or (typeof value == "number" and not is-finite(value)))
    if wrap
      sb "("
    sb to-JS-source(value)
    if wrap
      sb ")"
  
  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> @value
  
  def type()
    let value = @value
    switch typeof value
    case \undefined; types.undefined
    case \boolean; types.boolean
    case \number; types.number
    case \string; types.string
    default
      if value == null
        types.null
      else if value instanceof RegExp
        types.regexp
      else
        throw Error "Unknown value type: $type"
  
  def walk() -> this

exports.Continue := class Continue extends Statement
  def constructor()@ ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "continue;"
  
  def walk() -> this
  
  def exit-type() -> \continue

exports.Debugger := class Debugger extends Statement
  def constructor()@ ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "debugger;"
  
  def walk() -> this

exports.DoWhile := class DoWhile extends Statement
  def constructor(body as Node, test as Expression)@
    @body := body.maybe-to-statement()
    @test := test
    if test.is-const() and not test.const-value()
      return @body
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "do"
    if @body.is-noop()
      sb ";"
    else
      sb " {\n"
      sb.indent options.indent + 1
      @body.compile-as-statement inc-indent(options), true, sb
      sb "\n"
      sb.indent options.indent
      sb "}"
    sb " while ("
    @test.compile options, Level.inside-parentheses, false, sb
    sb ");"
  
  def walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    if body != @body or test != @test
      DoWhile body, test
    else
      this

exports.Eval := class Eval extends Expression
  def constructor(mutable code)@
    if code not instanceof Expression
      code := to-const code
    @code := code
  
  def compile(options, level, line-start, sb)!
    if @code instanceof Const
      sb String(@code.value)
    else
      sb "eval("
      @code.compile options, Level.sequence, false, sb
      sb ")"
  
  def walk(walker)
    let code = walker(@code) ? @code.walk(walker)
    if code != @code
      Eval code
    else
      this

exports.For := class For extends Statement
  def constructor(init as Expression = Noop(), test as Expression = Const(true), step as Expression = Noop(), body as Node)@
    if test.is-const() and not test.const-value()
      return init
    @init := init
    @test := test
    @step := step
    @body := body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    if not @init.is-noop()
      @init.compile options, Level.inside-parentheses, false, sb
    sb "; "
    if not @test.is-const() or not @test.const-value()
      @test.compile options, Level.inside-parentheses, false, sb
    sb "; "
    if not @step.is-noop()
      @step.compile options, Level.inside-parentheses, false, sb
    sb ")"
    if @body.is-noop()
      sb ";"
    else
      sb " {\n"
      sb.indent options.indent + 1
      @body.compile-as-statement inc-indent(options), true, sb
      sb "\n"
      sb.indent options.indent
      sb "}"
  
  def walk(walker)
    let init = walker(@init) ? @init.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    let step = walker(@step) ? @step.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if init != @init or test != @test or step != @step or body != @body
      For init, test, step, body
    else
      this

exports.ForIn := class ForIn extends Statement
  def constructor(key as Ident, object as Expression, body as Node)@
    @key := key
    @object := object
    @body := body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    @key.compile options, Level.inside-parentheses, false, sb
    sb " in "
    @object.compile options, Level.inside-parentheses, false, sb
    sb ")"
    if @body.is-noop()
      sb ";"
    else
      sb " {\n"
      sb.indent options.indent + 1
      @body.compile-as-statement inc-indent(options), true, sb
      sb "\n"
      sb.indent options.indent
      sb "}"
  
  def walk(walker)
    let key = walker(@key) ? @key.walk(walker)
    let object = walker(@object) ? @object.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if key != @key or object != @object or body != @body
      ForIn key, object, body
    else
      this

let validate-func-params-and-variables(params, variables)!
  let names = []
  for param in params
    if param.name in names
      throw Error "Duplicate parameter: $(param.name)"
    names.push param.name
  for variable in variables
    if variable in names
      throw Error "Duplicate variable: $variable"
    names.push variable

let compile-func-body(options, sb, declarations, variables, body)!
  for declaration in declarations
    sb.indent options.indent
    sb to-JS-source(declaration)
    sb ";\n"
  
  if variables.length > 0
    sb.indent options.indent
    sb "var "
    for variable, i in variables
      if i > 0
        sb ", "
      sb variables[i]
    sb ";\n"
  
  for line in body
    sb.indent options.indent
    line.compile-as-statement options, true, sb
    sb "\n"

let compile-func(options, sb, name, params, declarations, variables, body)
  sb "function "
  if name?
    name.compile sb, Level.inside-parentheses, false, sb
  sb "("
  for param, i in params
    if i > 0
      sb ", "
    param.compile options, Level.inside-parentheses, false, sb
  sb ") {"
  if variables.length or declarations.length or body.length
    sb "\n"
    compile-func-body inc-indent(options), sb, declarations, variables, body
    sb.indent options.indent
  sb "}"

exports.Func := class Func extends Expression
  def constructor(name as (null|Ident), params as [Ident] = [], variables as [String] = [], body as [Node] = [], declarations as [String] = [], meta)@
    validate-func-params-and-variables params, variables
    @name := name
    @params := params
    @variables := variables
    @body := []
    for item in body
      let statement = item.maybe-to-statement()
      if not statement.is-noop()
        if statement instanceof BlockStatement
          @body.push ...statement.body
        else
          @body.push statement
        if statement.exit-type()?
          break
    @declarations := declarations
    @meta := meta
  
  def compile(options, level, line-start, sb)!
    let wrap = line-start and not @name
    if wrap
      sb "("
    compile-func options, sb, @name, @params, @declarations, @variables, @body
    if wrap
      sb ")"
  
  def compile-as-statement(options, line-start, sb)!
    @compile options, Level.block, line-start, sb
    unless line-start and @name
      sb ";"
  
  def type() -> types.function
  
  def is-large() -> true
  
  def walk(walker)
    let name = if @name then walker(@name) ? @name.walk(walker) else @name
    let params = walk-array(@params, walker)
    let body = walk-array(@body, walker)
    if name != @name or params != @params or body != @body
      Func name, params, @variables, body, @declarations, @meta
    else
      this

exports.Ident := class Ident extends Expression
  def constructor(name as String)@
    unless is-acceptable-ident name
      throw Error "Not an acceptable identifier name: $name"
    @name := name
  
  def compile(options, level, line-start, sb)!
    sb @name
  
  def walk() -> this

exports.IfStatement := class IfStatement extends Statement
  def constructor(test as Expression, mutable when-true as Node, mutable when-false as Node = Noop())@
    if test.is-const()
      return if test.const-value()
        when-true
      else
        when-false
    else
      when-true := when-true.maybe-to-statement()
      when-false := when-false.maybe-to-statement()
      if when-true.is-noop()
        if when-false.is-noop()
          return test.maybe-to-statement()
        else
          @test := Unary "!", test
          @when-true := when-false
          @when-false := when-true
      else if when-false.is-noop() and when-true instanceof IfStatement and when-true.when-false.is-noop()
        @test := Binary test, "&&", when-true.test
        @when-true := when-true.when-true
        @when-false := when-false
      else
        @test := test
        @when-true := when-true
        @when-false := when-false
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "if ("
    @test.compile options, Level.inside-parentheses, false, sb
    sb ") {\n"
    let child-options = inc-indent options
    sb.indent child-options.indent
    @when-true.compile-as-statement child-options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
    let when-false = @when-false
    if not when-false.is-noop()
      sb " else "
      if when-false instanceof IfStatement
        when-false.compile options, level, false, sb
      else
        sb "{\n"
        sb.indent child-options.indent
        when-false.compile-as-statement child-options, true, sb
        sb "\n"
        sb.indent options.indent
        sb "}"
        
  def walk(walker)
    let test = walker(@test) ? @test.walk walker
    let when-true = walker(@when-true) ? @when-true.walk walker
    let when-false = walker(@when-false) ? @when-false.walk walker
    
    if test != @test or when-true != @when-true or when-false != @when-false
      If test, when-true, when-false
    else
      this
  
  def mutate-last(func, include-noop)
    let when-true = @when-true.mutate-last(func, include-noop)
    let when-false = @when-false.mutate-last(func, include-noop)
    if when-true != @when-true or when-false != @when-false
      If @test, when-true, when-false
    else
      this
  
  def exit-type()
    if @_exit-type == void
      let true-exit = @when-true.exit-type()
      let false-exit = @when-false.exit-type()
      @_exit-type := if true-exit == false-exit
        true-exit
      else
        null
    else
      @_exit-type

exports.IfExpression := class IfExpression extends Expression
  def constructor(test as Expression, when-true as Expression, when-false as Expression = Noop())@
    if test.is-const()
      return if test.const-value()
        when-true
      else
        when-false
    else if when-false.is-noop() and when-true instanceof IfExpression and when-true.when-false.is-noop()
      @test := Binary test, "&&", when-true.test
      @when-true := when-true.when-true
      @when-false := when-false
    else
      @test := test
      @when-true := when-true
      @when-false := when-false
  
  def to-statement() -> IfStatement @test, @when-true, @when-false
  
  let compile-small(test, when-true, when-false, options, line-start, sb)!
    test.compile options, Level.inline-condition, line-start, sb
    sb " ? "
    when-true.compile options, Level.inline-condition, false, sb
    sb " : "
    when-false.compile options, Level.inline-condition, false, sb
  let compile-large(test, when-true, when-false, options, line-start, sb)!
    let child-options = inc-indent options
    let wrap-test = test instanceof IfExpression
    if wrap-test
      sb "("
    test.compile child-options, if wrap-test then Level.inside-parentheses else Level.inline-condition, line-start and not wrap-test, sb
    if wrap-test
      sb ")"
    let large-when-true = when-true.is-large()
    if large-when-true
      sb "\n"
      sb.indent child-options.indent
      sb "? "
    else
      sb " ? "
    let wrap-when-true = when-true instanceof IfExpression
    if wrap-when-true
      sb "("
    when-true.compile child-options, if wrap-when-true then Level.inside-parentheses else Level.inline-condition, false, sb
    if wrap-when-true
      sb ")"
    sb "\n"
    sb.indent child-options.indent
    sb ": "
    if when-false instanceof IfExpression
      compile-large when-false.test, when-false.when-true, when-false.when-false, options, false, sb
    else
      when-false.compile child-options, Level.inline-condition, false, sb
  def compile(options, level, line-start, sb)!
    if level == Level.block
      @to-statement().compile(options, level, line-start, sb)
    else
      let wrap = level > Level.inline-condition
      if wrap
        sb "("
      let f = if @when-true.is-large() or @when-false.is-large() then compile-large else compile-small
      f @test, @when-true, @when-false, options, not wrap and line-start, sb
      if wrap
        sb ")"
  
  def type() -> @_type ?= @when-true.type().union(@when-false.type())
  
  def is-large()
    @_is-large ?= for some part in [@test, @when-true, @when-false]
      not part.is-small()
  
  def is-small() -> false
  
  def walk = IfStatement::walk

let If = exports.If := #(test, when-true, when-false)
  if when-true instanceof Expression and (not when-false or when-false instanceof Expression)
    IfExpression test, when-true, when-false
  else
    IfStatement test, when-true, when-false

exports.Noop := class Noop extends Expression
  def constructor()@ ->

  def compile-as-statement() ->

  def compile(options, level, line-start, sb)!
    if level > Level.block
      Const(void).compile options, level, line-start, sb

  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> void

  def type() -> types.undefined

  def walk() -> this
  def mutate-last(func, include-noop)
    if include-noop
      func(this)
    else
      this

exports.Obj := class Obj extends Expression
  let validate-unique-keys(elements)!
    let keys = []
    for pair in elements
      let {key} = pair
      if key in keys
        throw Error "Found duplicate key: $(to-JS-source key)"
      keys.push key
  
  def constructor(elements as [ObjPair] = [])@
    validate-unique-keys elements
    @elements := elements
  
  let compile-large(elements, options, sb)!
    let child-options = inc-indent options
    for element, i, len in elements
      sb "\n"
      sb.indent child-options.indent
      let {key} = element
      sb if is-acceptable-ident key
        key
      else
        to-JS-source key
      sb ": "
      element.value.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
  
  let compile-small(elements, options, sb)!
    if elements.length
      sb " "
      for element, i in elements
        if i > 0
          sb ", "
        let {key} = element
        sb if is-acceptable-ident key
          key
        else
          to-JS-source key
        sb ": "
        element.value.compile options, Level.sequence, false, sb
      sb " "
  
  def compile(options, level, line-start, sb)!
    if line-start
      sb "("
    sb "{"
    let f = if @should-compile-large() then compile-large else compile-small
    f @elements, options, sb
    sb "}"
    if line-start
      sb ")"
  
  def type() -> types.object
  
  def should-compile-large()
    switch @elements.length
    case 0; false
    case 1; @elements[0].is-large()
    default; @is-large()
  
  def is-small()
    switch @elements.length
    case 0; true
    case 1; @elements[0].is-small()
    default; false
  
  def is-large()
    @_is-large ?= @elements.length > 4 or for some element in @elements
      not element.is-small()
  
  def walk(walker)
    let elements = walk-array(@elements, walker)
    if elements != @elements
      Obj elements
    else
      this
  
  Obj.Pair := class ObjPair
    def constructor(key as String, mutable value)@
      if value not instanceof Expression
        value := to-const value
      @key := key
      @value := value
    
    def is-small() -> @value.is-small()
    def is-large() -> @value.is-large()
    def walk(walker)
      let value = walker(@value) ? @value.walk(walker)
      if value != @value
        ObjPair @key, value
      else
        this

exports.Return := class Return extends Statement
  def constructor(node as Expression = Const(void))@
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last Return
    @node := node
  
  def compile(options, level, line-start, sb)!
    sb "return"
    unless @node.is-const() and @node.const-value() == void
      sb " "
      @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Return node
    else
      this
  
  def exit-type() -> \return

exports.Root := class Root
  def constructor(body as [Node] = [], variables as [String] = [], declarations as [String] = [])@
    validate-func-params-and-variables [], variables
    @body := []
    for item in body
      let statement = item.maybe-to-statement()
      if not statement.is-noop()
        if statement instanceof BlockStatement
          @body.push ...statement.body
        else
          @body.push statement
        if statement.exit-type()?
          break
    @variables := variables
    @declarations := declarations

  def compile(options = {})
    if not options.indent
      options.indent := 0
    
    let sb = StringBuilder()
    compile-func-body(options, sb, @declarations, @variables, @body)
    sb.to-string()
  
  def to-string() -> @compile()
  
  def to-function = Node::to-function
  
  def is-large() -> true
  
  def walk(walker)
    let body = walk-array(@body, walker)
    if body != @body
      Root body, @variables, @declarations
    else
      this
  
  def mutate-last(func, include-noop)
    let body = @body.mutate-last func, include-noop
    if body != @body
      Root body, @variables, @declarations
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[@body.length - 1]

exports.This := class This extends Expression
  def constructor()@ ->
  
  def compile(options, level, line-start, sb)! -> sb "this"
  
  def walk() -> this

exports.Throw := class Throw extends Statement
  def constructor(node as Expression)@
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last Throw, true
    @node := node
  
  def compile(options, level, line-start, sb)
    sb "throw "
    @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Throw node
    else
      this
  
  def exit-type() -> \throw

exports.Switch := class Switch extends Statement
  def constructor(node as Expression, cases as [SwitchCase] = [], default-case as Node = Noop())@
    @node := node
    @cases := cases
    @default-case := default-case.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "switch ("
    @node.compile options, Level.inside-parentheses, false, sb
    sb ") {"
    let child-options = inc-indent options
    for case_ in @cases
      sb "\n"
      sb.indent options.indent
      sb "case "
      case_.node.compile options, Level.inside-parentheses, false, sb
      sb ":"
      if not case_.body.is-noop()
        sb "\n"
        sb.indent child-options.indent
        case_.body.compile-as-statement child-options, true, sb
    if not @default-case.is-noop()
      sb "\n"
      sb.indent options.indent
      sb "default:\n"
      sb.indent child-options.indent
      @default-case.compile-as-statement child-options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    let cases = walk-array(@cases, walker)
    let default-case = walker(@default-case) ? @default-case.walk(walker)
    if node != @node or cases != @cases or default-case != @default-case
      Switch node, cases, default-case
    else
      this
  
  Switch.Case := class SwitchCase
    def constructor(node as Expression, body as Node)@
      @node := node
      @body := body.maybe-to-statement()
    
    def is-large() -> true
    def is-small() -> false
    
    def walk(walker)
      let node = walker(@node) ? @node.walk(walker)
      let body = walker(@body) ? @body.walk(walker)
      if node != @node or body != @body
        SwitchCase(node, body)
      else
        this

exports.TryCatch := class TryCatch extends Statement
  def constructor(try-body as Node, catch-ident as Ident, catch-body as Node)@
    @try-body := try-body.maybe-to-statement()
    if @try-body.is-noop()
      return @try-body
    @catch-ident := catch-ident
    @catch-body := catch-body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let child-options = inc-indent options
    sb.indent child-options.indent
    @try-body.compile-as-statement child-options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "} catch ("
    @catch-ident.compile options, Level.inside-parentheses, false, sb
    sb ") {"
    if not @catch-body.is-noop()
      sb "\n"
      sb.indent child-options.indent
      @catch-body.compile-as-statement child-options, true, sb
      sb "\n"
      sb.indent options.indent
    sb "}"
  
  def walk(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let catch-ident = walker(@catch-ident) ? @catch-ident.walk(walker)
    let catch-body = walker(@catch-body) ? @catch-body.walk(walker)
    if try-body != @try-body or catch-ident != @catch-ident or catch-body != @catch-body
      TryCatch try-body, catch-ident, catch-body
    else
      this

exports.TryFinally := class TryFinally extends Statement
  def constructor(try-body as Node, finally-body as Node)@
    @try-body := try-body.maybe-to-statement()
    @finally-body := finally-body.maybe-to-statement()
    if @try-body.is-noop()
      return @finally-body
    else if @finally-body.is-noop()
      return @try-body
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let child-options = inc-indent(options)
    sb.indent child-options.indent
    if @try-body instanceof TryCatch
      @try-body.try-body.compile-as-statement child-options, true, sb
      sb "\n"
      sb.indent options.indent
      sb "} catch ("
      @try-body.catch-ident.compile options, Level.inside-parentheses, false, sb
      sb ") {"
      if not @try-body.catch-body.is-noop()
        sb "\n"
        sb.indent child-options.indent
        @try-body.catch-body.compile-as-statement child-options, true, sb
        sb "\n"
        sb.indent options.indent
    else
      @try-body.compile-as-statement child-options, true, sb
      sb "\n"
      sb.indent options.indent
    sb "} finally {\n"
    sb.indent child-options.indent
    @finally-body.compile-as-statement child-options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  def walk(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let finally-body = walker(@finally-body) ? @finally-body.walk(walker)
    if try-body != @try-body or finally-body != @finally-body
      TryFinally try-body, finally-body
    else
      this

exports.Unary := class Unary extends Expression
  def constructor(op as String, mutable node)@
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if node not instanceof Expression
      node := to-const node

    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    if CONST_OPERATIONS ownskey op and node.is-const()
      return Const CONST_OPERATIONS[op](node.const-value())
    
    if NONCONST_OPERATIONS ownskey op
      return? NONCONST_OPERATIONS[op](node)
    
    @op := op
    @node := node
  
  def compile(options, level, line-start, sb)!
    let op = @op
    if op in ["++post", "--post"]
      @node.compile options, Level.unary, false, sb
      sb op.substring(0, 2)
    else
      sb op
      if op in ["typeof", "void", "delete"] or (op in ["+", "-", "++", "--"] and ((@node instanceof Unary and op in ["+", "-", "++", "--"]) or (@node instanceof Const and typeof this.node.value == "number" and this.node.value < 0)))
        sb " "
      @node.compile options, Level.unary, false, sb
  
  let KNOWN_OPERATORS = [
    "++" // prefix
    "--" // prefix
    "++post" // postfix ++
    "--post" // postfix --
    "!"
    "~"
    "+"
    "-"
    "typeof"
    "void"
    "delete"
  ]
  
  let CONST_OPERATIONS = {
    "!": (not)
    "~": (bitnot)
    "+": #(x) -> +x
    "-": #(x) -> -x
    "typeof": (typeof)
  }
  
  let NONCONST_OPERATIONS = {
    "+": #(x)
      if x.type().is-subset-of types.number
        x
    "-": #(x)
      if x instanceof Unary
        if x.op in ["-", "+"]
          Unary if x.op == "-" then "+" else "-", x.node
      else if x instanceof Binary
        if x.op in ["-", "+"]
          Binary x.left, if x.op == "-" then "+" else "-", x.right
        else if x.op in ["*", "/"]
          Binary Unary("-", x.left), x.op, x.right
    "!": do
      let BINARY_INVERTABLE = {
        "<": ">="
        "<=": ">"
        ">": "<="
        ">=": "<"
        "==": "!="
        "!=": "=="
        "===": "!=="
        "!==": "==="
        "&&": #(x, y) -> Binary Unary("!", x), "||", Unary("!", y)
        "||": #(x, y) -> Binary Unary("!", x), "&&", Unary("!", y)
      }
      #(x)
        if x instanceof Unary
          if x.op == "!" and x.node.type().is-subset-of(types.boolean)
            x.node
        else if x instanceof Binary
          if BINARY_INVERTABLE ownskey x.op
            let invert = BINARY_INVERTABLE[x.op]
            switch typeof invert
            case \function
              invert x.left, x.right
            case \string
              Binary x.left, invert, x.right
            default
              throw Error()
  }
  
  let OPERATOR_TYPES = {
    "++": types.number
    "--": types.number
    "++post": types.number
    "--post": types.number
    "!": types.boolean
    "~": types.number
    "+": types.number
    "-": types.number
    "typeof": types.string
    "void": types.undefined
    "delete": types.boolean
  }
  
  def type() -> OPERATOR_TYPES[@op]
  
  def is-large() -> @node.is-large()
  def is-small() -> @node.is-small()
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Unary(@op, node)
    else
      this

let While = exports.While := #(test, body)
  For(null, test, null, body)
