let {inspect} = require 'util'

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
  def call-or-access // `...`() or `...`[0] `...`.item
  def new-call // new `...`()

let INDENT = "  "

let inc-indent(options)
  let clone = { extends options }
  clone.indent += 1
  clone

let get-indent = do
  let cache = [""]
  #(indent)
    if indent >= cache.length
      let mutable result = cache[cache.length - 1]
      for i in cache.length to indent
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

let is-negative(value) -> value < 0 or 1 / value < 0

let to-JS-source = do
  let to-JS-source-types =
    undefined: #-> "void 0"
    number: #(value)
      if value == 0
        if is-negative value
          "-0"
        else
          "0"
      else if is-finite value
        String value
      else if value is NaN
        "0/0"
      else if value > 0
        "1/0"
      else
        "-1/0"
    string: do
      let escape-helper(m)
        switch m
        case "\b"; "\\b"
        case "\t"; "\\t"
        case "\n"; "\\n"
        case "\f"; "\\f"
        case "\r"; "\\r"
        case "\n"; "\\n"
        case '"'; '\\"'
        case "'"; "\\'"
        case "\\"; "\\\\"
        default
          let num = m.char-code-at(0).to-string(16)
          return switch num.length
          case 1; "\\u000$num"
          case 2; "\\u00$num"
          case 3; "\\u0$num"
          case 4; "\\u$num"
          default; throw Error()
      let DOUBLE_QUOTE_REGEX = r'[\u0000-\u001f"\\\u0080-\uffff]'g
      let SINGLE_QUOTE_REGEX = r"[\u0000-\u001f'\\\u0080-\uffff]"g
      #(value)
        if value.index-of('"') == -1 or value.index-of("'") != -1
          '"' & value.replace(DOUBLE_QUOTE_REGEX, escape-helper) & '"'
        else
          "'" & value.replace(SINGLE_QUOTE_REGEX, escape-helper) & "'"
    boolean: #(value) -> if value then "true" else "false"
    object: #(value)
      if value == null
        "null"
      else if value instanceof RegExp
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
        throw Error()
  #(value) as String
    let f = to-JS-source-types![typeof value]
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
  def constructor()
    throw Error "Node cannot be instantiated directly"
  
  def to-string()
    let sb = StringBuilder()
    @compile-as-statement { indent: 0, +bare }, true, sb
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
  def constructor()
    throw Error "Expression cannot be instantiated directly"
  
  def compile-as-block(options, level, line-start, sb)! -> @compile options, level, line-start, sb
  
  def compile-as-statement(options, line-start, sb)!
    if typeof @to-statement == "function"
      @to-statement().compile-as-statement options, line-start, sb
    else
      @compile options, Level.block, line-start, sb
      sb ";"
  
  def is-large() -> false
  
  def mutate-last(func) -> func(this)

exports.Statement := class Statement extends Node
  def constructor()
    throw Error "Expression cannot be instantiated directly"
  
  def compile-as-statement(options, line-start, sb)
    @compile options, Level.block, line-start, sb

exports.Access := #(parent, ...children)
  for reduce child in children, current = parent
    Binary current, ".", child

exports.Arguments := class Arguments extends Expression
  def constructor() ->
  
  def compile(options, level, line-start, sb)! -> sb "arguments"
  def compile-as-block(options, level, line-start, sb)! -> Noop().compile-as-block(options, level, line-start, sb)
  def walk() -> this
  def is-noop() -> true
  def inspect(depth) -> "Arguments()"
  def to-JSON() -> { type: "Arguments" }
  @from-JSON := #-> Arguments()

let walk-array(array as [], walker as ->)
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

let inspect-array-helper(sb, array, depth)
  if array.length == 0
    sb "[]"
  else if not depth? or depth > 0
    sb "[ "
    for item, i in array
      if i > 0
        sb ", "
      sb inspect(item, null, if depth? then depth - 1 else null)
    sb " ]"
  else
    sb "length: "
    sb item.length

let dec-depth(depth)
  if depth?
    depth - 1
  else
    null

let simplify(obj)
  if Array.isArray(obj)
    if obj.length == 0
      void
    else
      obj
  else if obj instanceof Noop
    void
  else
    obj

exports.Arr := class Arr extends Expression
  def constructor(@elements as [Expression] = []) ->
  
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
  def compile-as-block(options, level, line-start, sb)
    BlockExpression(@elements).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    BlockStatement(@elements).compile(options, line-start, sb)
  
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
    @_is-large ?= @elements.length > 4 or for some element in @elements by -1
      not element.is-small()
  
  def is-noop() -> @_is-noop ?= for every element in @elements by -1; element.is-noop()
  
  def walk(walker)
    let elements = walk-array @elements, walker
    if @elements != elements
      Arr elements
    else
      this
  
  def inspect(depth)
    let d = dec-depth depth
    "Arr($(inspect @elements, null, d))"
  
  def to-JSON() -> { type: "Arr", elements: simplify(@elements) }
  @from-JSON := #({elements}) -> Arr array-from-JSON(elements)

exports.Assign := #(left, right)
  Binary left, "=", right

exports.BinaryChain := #(op, ...args)
  if op == "+"
    for i in args.length - 2 to 0 by -1
      let left = args[i]
      let right = args[i + 1]
      if (typeof left == \string or (left instanceof Const and typeof left.value == \string)) and (typeof right == \string or (right instanceof Const and typeof right.value == \string))
        args.splice i, 2, (if typeof left == \string then left else left.value) & (if typeof right == \string then right else right.value)
  for reduce arg in args[1 to -1], current = args[0]
    Binary current, op, arg

exports.And := #(...args)
  if args.length == 0
    Const true
  else
    for reduce i in 1 til args.length, current = args[0]
      Binary current, "&&", args[i]

exports.Or := #(...args)
  if args.length == 0
    Const false
  else
    for reduce i in 1 til args.length, current = args[0]
      Binary current, "||", args[i]

exports.Binary := class Binary extends Expression
  def constructor(mutable left = Noop(), @op as String, mutable right = Noop())
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(to-JS-source op)"
    
    if left not instanceof Expression
      left := to-const left
    if right not instanceof Expression
      right := to-const right
    
    @left := left
    @right := right
  
  let compile-access(op, left, right, options, level, line-start, sb)!
    let dot-access = right instanceof Const and typeof right.value == "string" and is-acceptable-ident(right.value)
    let wrap = level > Level.call-or-access
    
    if wrap
      sb "("
    
    if left instanceof Const and typeof left.value == "number"
      let string-left = to-JS-source left.value
      if is-negative(left.value) or not is-finite(left.value)
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
      left.compile options, Level.call-or-access, line-start, sb
    
    if dot-access
      sb "."
      sb right.value
    else
      sb "["
      right.compile options, Level.inside-parentheses, false, sb
      sb "]"
    
    if wrap
      sb ")"
  
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
  
  def compile-as-block(options, level, line-start, sb)!
    if ASSIGNMENT_OPS ownskey @op or @op in ["&&", "||"]
      super.compile-as-block(options, level, line-start, sb)
    else
      BlockExpression([@left, @right]).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    let left = @left
    let op = @op
    if ASSIGNMENT_OPS ownskey op
      if left instanceof Ident and typeof @right.to-statement == "function" and false
        @right.to-statement()
          .mutate-last((#(node) -> Binary left, op, node), true)
          .compile-as-statement(options, line-start, sb)
      else
        super.compile-as-statement(options, line-start, sb)
    else
      BlockStatement([@left, @right]).compile-as-statement(options, line-start, sb)
  
  let ASSIGNMENT_OPS = {
    +"="
    +"+="
    +"-="
    +"*="
    +"/="
    +"%="
    +"<<="
    +">>="
    +">>>="
    +"&="
    +"^="
    +"|="
  }
  
  let OPERATOR_PRECEDENCE =
    ".": Level.call-or-access
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
  
  let LEVEL_TO_ASSOCIATIVITY =
    [Level.equality]: "paren"
    [Level.relational]: "paren"
    [Level.addition]: "left"
    [Level.multiplication]: "left"
    [Level.bitwise-and]: "none"
    [Level.bitwise-or]: "none"
    [Level.bitwise-xor]: "none"
    [Level.bitwise-shift]: "left"
    [Level.assignment]: "right"
  
  def is-large()
    @_is-large ?= not @left.is-small() or not @right.is-small()
  
  def is-small()
    @_is-small ?= @left.is-small() and @right.is-small()
  
  def is-noop()
    @_is-noop ?= ASSIGNMENT_OPS not ownskey @op and @left.is-noop() and @right.is-noop()
  
  def walk(walker)
    let mutable changed = false
    let left = walker(@left) ? @left.walk(walker)
    let right = walker(@right) ? @right.walk(walker)
    if @left != left or @right != right
      Binary left, @op, right
    else
      this
  
  def inspect(depth)
    let d = dec-depth depth
    "Binary($(inspect @left, null, d), $(inspect @op), $(inspect @right, null, d))"
  
  def to-JSON() -> { type: "Binary", left: simplify(@left), @op, right: simplify(@right) }
  @from-JSON := #({left, op, right}) -> Binary from-JSON(left), op, from-JSON(right)

exports.BlockStatement := class BlockStatement extends Statement
  def constructor(body as [Node] = [])
    let result = []
    for item in body
      let statement = item.maybe-to-statement()
      if statement instanceof BlockStatement
        result.push ...statement.body
      else if statement not instanceof Noop
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
    
    let nodes = for node in @body
      if not node.is-noop()
        node
    
    for item, i in nodes
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
      let body = @body[0 til -1]
      body.push new-last
      Block body
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[@body.length - 1]
  
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def inspect(depth)
    let d = dec-depth depth
    "BlockStatement($(inspect @body, null, d))"
  
  def to-JSON() -> { type: "BlockStatement", @body }
  @from-JSON := #({body}) -> BlockStatement array-from-JSON(body)

exports.BlockExpression := class BlockExpression extends Expression
  def constructor(body as [Expression] = [])
    let result = []
    for item, i, len in body
      if i == len - 1 or not item not instanceof Noop
        if item instanceof BlockExpression
          result.push ...item.body
          if i < len - 1 and result[result.length - 1] instanceof Noop
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
      let nodes = for node, i, len in @body
        if not node.is-noop() or i == len - 1
          node
      
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      for item, i in nodes
        if i > 0
          sb ", "
        item.compile options, if wrap then Level.sequence else level, false, sb
      if wrap
        sb ")"
  
  def compile-as-block(options, level, line-start, sb)!
    if level == Level.block
      @compile options, level, line-start, sb
    else
      let nodes = for node, i, len in @body
        if not node.is-noop()
          node
      
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      for item, i in nodes
        if i > 0
          sb ", "
        item.compile-as-block options, if wrap then Level.sequence else level, false, sb
      if wrap
        sb ")"
  
  def is-large()
    @_is-large ?= @body.length > 4 or for some part in @body by -1; part.is-large()
  
  def is-small() -> false
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def walk = BlockStatement::walk
  def last() -> @body[@body.length - 1]
  
  def inspect(depth)
    let d = dec-depth depth
    "BlockExpression($(inspect @body, null, d))"
  
  def to-JSON() -> { type: "BlockExpression", @body }
  @from-JSON := #({body}) -> BlockExpression array-from-JSON(body)

let Block = exports.Block := #(body as [Node] = [])
  if body.length == 0
    Noop()
  else
    if (for every item in body by -1; item instanceof Expression)
      BlockExpression body
    else
      BlockStatement body

exports.Break := class Break extends Statement
  def constructor() ->
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "break;"
  
  def walk() -> this
  
  def exit-type() -> \break
  
  def inspect() -> "Break()"
  
  def is-large() -> false
  
  def to-JSON() -> { type: "Break" }
  @from-JSON := #-> Break()

exports.Call := class Call extends Expression
  def constructor(@func as Expression = Noop(), @args as [Expression] = [], @is-new as Boolean) ->
  
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
    let wrap = level > Level.call-or-access or (not @is-new and (@func instanceof Func or (@func instanceof Binary and @func.op == "." and @func.left instanceof Func)))
    if wrap
      sb "("
    if @is-new
      sb "new "
    @func.compile options, if @is-new then Level.new-call else Level.call-or-access, line-start and not wrap and not @is-new, sb
    let f = if @should-compile-large() then compile-large else compile-small
    f(@args, options, level, line-start, sb)
    if wrap
      sb ")"
  
  def should-compile-large()
    if @args.length > 4
      true
    else
      for some arg in @args[-2 to 0 by -1]; not arg.is-small()
  
  def has-large-args()
    @_has-large-args ?= if @args.length > 4
      true
    else
      for some arg in @args by -1; not arg.is-small()
  
  def is-large() -> @func.is-large() or @has-large-args()
  
  def is-small()
    @_is-small ?= if not @func.is-small()
      false
    else
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
  
  def inspect(depth)
    let d = dec-depth depth
    let sb = StringBuilder()
    sb "Call("
    sb inspect @func, null, d
    if @args.length or @is-new
      sb ", "
      sb inspect @args, null, d
    if @is-new
      sb ", true"
    sb ")"
    sb.to-string()
  
  def to-JSON() -> { type: "Call", func: simplify(@func), args: simplify(@args), is-new: @is-new or void }
  @from-JSON := #({func, args, is-new}) -> Call from-JSON(func), array-from-JSON(args), is-new

let to-const(value)
  if value instanceof Node
    throw Error "Cannot convert $(typeof! value) to a Const"
  else if is-array! value
    Arr (for item in value; to-const item)
  else if value and typeof value == "object" and value not instanceof RegExp
    Obj (for k, v of value; Obj.Pair k, to-const v)
  else
    Const value

exports.Const := class Const extends Expression
  def constructor(@value as void|null|Boolean|Number|String|RegExp) ->
  
  def compile(options, level, line-start, sb)!
    let value = @value
    let wrap = level >= Level.increment and (value == undefined or (typeof value == "number" and not is-finite(value)))
    if wrap
      sb "("
    sb to-JS-source(value)
    if wrap
      sb ")"
  def compile-as-block(options, level, line-start, sb)!
    Noop().compile-as-block(options, level, line-start, sb)
  
  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> @value
  
  def walk() -> this
  
  def inspect() -> "Const($(inspect @value))"
  
  def to-JSON()
    if @value instanceof RegExp
      let flags = []
      if @value.global
        flags.push "g"
      if @value.ignore-case
        flags.push "i"
      if @value.multiline
        flags.push "m"
      { type: "Const", +regexp, @value.source, flags }
    else if @value == Infinity
      { type: "Const", +infinite, value: 1 }
    else if @value == -Infinity
      { type: "Const", +infinite, value: -1 }
    else if @value != @value
      { type: "Const", +infinite, value: 0 }
    else
      { type: "Const", @value }
  @from-JSON := #(obj)
    if obj.regexp
      Const RegExp(obj.source, obj.flags)
    else if obj.infinite
      Const obj.value / 0
    else
      Const obj.value

exports.Continue := class Continue extends Statement
  def constructor() ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "continue;"
  
  def walk() -> this
  
  def exit-type() -> \continue
  
  def is-large() -> false
  
  def inspect() -> "Continue()"
  
  def to-JSON() -> { type: "Continue" }
  @from-JSON := # -> Continue()

exports.Debugger := class Debugger extends Statement
  def constructor() ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    sb "debugger;"
  
  def walk() -> this

  def is-large() -> false
  
  def inspect() -> "Debugger()"
  
  def to-JSON() -> { type: "Debugger" }
  @from-JSON := # -> Debugger()

exports.DoWhile := class DoWhile extends Statement
  def constructor(body as Node = Noop(), @test as Expression = Noop())
    @body := body.maybe-to-statement()
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

  def inspect(depth)
    let d = dec-depth depth
    "DoWhile($(inspect @body, null, d), $(inspect @test, null, d))"
  
  def to-JSON() -> { type: "DoWhile", body: simplify(@body), test: simplify(@test) }
  @from-JSON := #({body, test}) -> DoWhile from-JSON(body), from-JSON(test)

exports.Eval := class Eval extends Expression
  def constructor(mutable code = Noop())
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
  
  def inspect(depth)
    let d = dec-depth depth
    "Eval($(inspect @code, null, d))"
  
  def to-JSON() -> { type: "Eval", code: simplify(@code) }
  @from-JSON := #({code}) -> Eval from-JSON(code)

exports.For := class For extends Statement
  def constructor(@init as Expression = Noop(), mutable test = Const(true), @step as Expression = Noop(), body as Node)
    if test not instanceof Expression
      test := to-const test
    if test.is-const() and not test.const-value()
      return init
    @test := test
    @body := body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    let test = if @test.is-const() and typeof @test.const-value() != \boolean
      Const(not not @test.const-value())
    else
      @test
    
    if @init.is-noop() and @step.is-noop()
      sb "while ("
      test.compile options, Level.inside-parentheses, false, sb
    else
      sb "for ("
      if not @init.is-noop()
        @init.compile-as-block options, Level.inside-parentheses, false, sb
      sb "; "
      if not test.is-const() or not test.const-value()
        test.compile options, Level.inside-parentheses, false, sb
      sb "; "
      if not @step.is-noop()
        @step.compile-as-block options, Level.inside-parentheses, false, sb
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
  
  def inspect(depth)
    let d = dec-depth depth
    "For($(inspect @init, null, d), $(inspect @test, null, d), $(inspect @step, null, d), $(inspect @body, null, d))"
  
  def to-JSON() -> { type: "For", init: simplify(@init), test: simplify(@test), step: simplify(@step), body: simplify(@body) }
  @from-JSON := #({init, test, step, body}) -> For from-JSON(init), from-JSON(test), from-JSON(step), from-JSON(body)

exports.ForIn := class ForIn extends Statement
  def constructor(@key as Ident, @object as Expression = Noop(), body as Node = Noop())
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
  
  def inspect(depth)
    let d = dec-depth depth
    "ForIn($(inspect @key, null, d), $(inspect @object, null, d), $(inspect @body, null, d))"
  
  def to-JSON() -> { type: "ForIn", @key, object: simplify(@object), body: simplify(@body) }
  @from-JSON := #({key, object, body}) -> ForIn from-JSON(key), from-JSON(object), from-JSON(body)

let validate-func-params-and-variables(params, variables)!
  let names = []
  for param in params by -1
    if param.name in names
      throw Error "Duplicate parameter: $(param.name)"
    names.push param.name
  for variable in variables by -1
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
  
  if not body.is-noop()
    sb.indent options.indent
    body.compile-as-statement options, true, sb
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
  if variables.length or declarations.length or not body.is-noop()
    sb "\n"
    compile-func-body inc-indent(options), sb, declarations, variables, body
    sb.indent options.indent
  sb "}"

exports.Func := class Func extends Expression
  def constructor(@name as null|Ident, @params as [Ident] = [], @variables as [String] = [], @body as Node = Noop(), @declarations as [String] = [])
    validate-func-params-and-variables params, variables
  
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
  
  def is-large() -> true
  def is-noop() -> not @name?
  
  def walk(walker)
    let name = if @name then walker(@name) ? @name.walk(walker) else @name
    let params = walk-array(@params, walker)
    let body = @body.walk(walker)
    if name != @name or params != @params or body != @body
      Func name, params, @variables, body, @declarations, @meta
    else
      this
  
  def inspect(depth)
    let d = dec-depth depth
    "Func($(inspect @name, null, d), $(inspect @params, null, d), $(inspect @variables, null, d), $(inspect @body, null, d), $(inspect @declarations, null, d), $(inspect @meta, null, d))"
  
  def to-JSON() -> { type: "Func", name: @name or void, params: simplify(@params), variables: simplify(@variables), body: simplify(@body), declarations: simplify(@declarations) }
  @from-JSON := #({name, params, variables, body, declarations})
    Func (if name then from-JSON(name)), array-from-JSON(params), variables, from-JSON(body), declarations

exports.Ident := class Ident extends Expression
  def constructor(@name as String)
    unless is-acceptable-ident name
      throw Error "Not an acceptable identifier name: $name"
  
  def compile(options, level, line-start, sb)!
    sb @name
  
  def compile-as-block(options, level, line-start, sb)!
    Noop().compile-as-block(options, level, line-start, sb)
  
  def walk() -> this
  
  def inspect(depth)
    let d = dec-depth depth
    "Ident($(inspect @name, null, d))"
  
  def is-noop() -> true
  
  def to-JSON() -> { type: "Ident", @name }
  @from-JSON := #({name}) -> Ident name

exports.IfStatement := class IfStatement extends Statement
  def constructor(mutable test as Expression = Noop(), mutable when-true as Node = Noop(), mutable when-false as Node = Noop())
    if test instanceof Unary and test.op == "!" and test.node instanceof Unary and test.node.op == "!"
      test := test.node.node
    if test.is-const()
      return if test.const-value()
        when-true
      else
        when-false
    else
      when-true := when-true.maybe-to-statement()
      when-false := when-false.maybe-to-statement()
      if when-true instanceof Noop
        if when-false instanceof Noop
          return test.maybe-to-statement()
        else
          // TODO: the test inversion doesn't change the inner operators, just wraps it all
          return IfStatement@ this, Unary("!", test), when-false, when-true
      else if when-false instanceof Noop and when-true instanceof IfStatement and when-true.when-false instanceof Noop
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
    
    if @when-true.is-noop()
      if @when-false.is-noop()
        @test.compile-as-statement options, true, sb
      else
        IfStatement(Unary("!", @test), @when-false, @when-true).compile(options, level, line-start, sb)
    else
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
  
  def is-noop() -> @_is-noop ?= @test.is-noop() and @when-true.is-noop() and @when-false.is-noop()
  
  def inspect(depth)
    let d = dec-depth depth
    "IfStatement($(inspect @test, null, d), $(inspect @when-true, null, d), $(inspect @when-false, null, d))"
  
  def to-JSON() -> { type: "IfStatement", test: simplify(@test), when-true: simplify(@when-true), when-false: simplify(@when-false) }
  @from-JSON := #({test, when-true, when-false}) -> IfStatement from-JSON(test), from-JSON(when-true), from-JSON(when-false)

exports.IfExpression := class IfExpression extends Expression
  def constructor(mutable test as Expression = Noop(), mutable when-true = Noop(), mutable when-false = Noop())
    if when-true not instanceof Expression
      when-true := to-const when-true
    if when-false not instanceof Expression
      when-false := to-const when-false
    if test instanceof Unary and test.op == "!" and test.node instanceof Unary and test.node.op == "!"
      test := test.node.node
    if test.is-const()
      return if test.const-value() then when-true else when-false
    else if when-false instanceof Noop and when-true instanceof IfExpression and when-true.when-false instanceof Noop
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
  def compile-as-block(options, level, line-start, sb)!
    if @when-true.is-noop()
      if @when-false.is-noop()
        @test.compile-as-block(options, level, line-start, sb)
      else
        Binary(@test, "||", @when-false).compile-as-block(options, level, line-start, sb)
    else if @when-false.is-noop()
      Binary(@test, "&&", @when-true).compile-as-block(options, level, line-start, sb)
    else
      @compile(options, level, line-start, sb)
  
  def is-large() -> @_is-large ?= not (@test.is-small() and @when-true.is-small() and @when-false.is-small())
  
  def is-small() -> false
  
  def is-noop() -> @_is-noop ?= @test.is-noop() and @when-true.is-noop() and @when-false.is-noop()
  
  def walk = IfStatement::walk
  
  def inspect(depth)
    let d = dec-depth depth
    "IfExpression($(inspect @test, null, d), $(inspect @when-true, null, d), $(inspect @when-false, null, d))"
  
  def to-JSON() -> { type: "IfExpression", test: simplify(@test), when-true: simplify(@when-true), when-false: simplify(@when-false) }
  @from-JSON := #({test, when-true, when-false}) -> IfExpression from-JSON(test), from-JSON(when-true), from-JSON(when-false)

let If = exports.If := #(test, when-true, when-false)
  if when-true instanceof Statement or when-false instanceof Statement
    IfStatement test, when-true, when-false
  else
    IfExpression test, when-true, when-false

exports.Noop := class Noop extends Expression
  def constructor() ->

  def compile-as-statement() ->

  def compile(options, level, line-start, sb)!
    if level > Level.block
      Const(void).compile options, level, line-start, sb

  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> void

  def walk() -> this
  def mutate-last(func, include-noop)
    if include-noop
      func(this)
    else
      this
  
  def inspect() -> "Noop()"
  
  def to-JSON() -> { type: "Noop" }
  @from-JSON := #() -> Noop()

exports.Obj := class Obj extends Expression
  let validate-unique-keys(elements)!
    let keys = []
    for pair in elements by -1
      let {key} = pair
      if key in keys
        throw Error "Found duplicate key: $(to-JS-source key)"
      keys.push key
  
  def constructor(@elements as [ObjPair] = [])
    validate-unique-keys elements
  
  let to-safe-key(key)
    if is-acceptable-ident(key)
      key
    else
      let num = Number(key)
      if num isnt NaN and String(num) == key
        key
      else
        to-JS-source key
  
  let compile-large(elements, options, sb)!
    let child-options = inc-indent options
    for element, i, len in elements
      sb "\n"
      sb.indent child-options.indent
      let {key} = element
      sb to-safe-key key
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
        sb to-safe-key key
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
  
  def compile-as-block(options, level, line-start, sb)!
    BlockExpression(for element in @elements; element.value).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    BlockStatement(for element in @elements; element.value).compile-as-statement(options, line-start, sb)
  
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
    @_is-large ?= @elements.length > 4 or for some element in @elements by -1
      not element.is-small()
  
  def is-noop()
    @_is-noop ?= for every element in @elements by -1; element.is-noop()
  
  def walk(walker)
    let elements = walk-array(@elements, walker)
    if elements != @elements
      Obj elements
    else
      this
  
  def inspect(depth)
    let d = dec-depth depth
    "Obj($(inspect @elements, null, d))"
  
  def to-JSON()
    type: "Obj"
    pairs: simplify(for pair in @pairs
      { pair.key, value: simplify(pair.value) })
  @from-JSON := #({pairs})
    let result-pairs = []
    for pair in (pairs or [])
      if not pair or typeof pair != \object
        throw Error "Expecting an object with a key and value"
      result-pairs.push ObjPair pair.key, from-JSON(pair.value)
    Obj result-pairs
  
  Obj.Pair := class ObjPair
    def constructor(@key as String, mutable value = Noop())
      if value not instanceof Expression
        value := to-const value
      @value := value
    
    def is-small() -> @value.is-small()
    def is-large() -> @value.is-large()
    def is-noop() -> @value.is-noop()
    def walk(walker)
      let value = walker(@value) ? @value.walk(walker)
      if value != @value
        ObjPair @key, value
      else
        this
    
    def inspect(depth)
      let d = dec-depth depth
      "Pair($(inspect @key, null, d), $(inspect @value, null, d))"

exports.Return := class Return extends Statement
  def constructor(@node as Expression = Noop())
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last Return
  
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
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def inspect(depth)
    let d = dec-depth depth
    "Return($(inspect @node, null, d))"
  
  def to-JSON() -> { type: "Return", node: simplify(@node) }
  @from-JSON := #({node}) -> Return from-JSON(node)

exports.Root := class Root
  def constructor(@body as Node = Noop(), @variables as [String] = [], @declarations as [String] = [])
    validate-func-params-and-variables [], variables

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
    let body = @body.walk(walker)
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
  
  def inspect(depth)
    let d = dec-depth depth
    "Root($(inspect @body, null, d), $(inspect @variables, null, d), $(inspect @declarations, null, d))"
  
  def to-JSON() -> { type: "Root", body: simplify(@body), variables: simplify(@variables), declarations: simplify(@declarations) }
  @from-JSON := #({body, variables, declarations}) -> Root from-JSON(body), variables, declarations

exports.This := class This extends Expression
  def constructor() ->
  
  def compile(options, level, line-start, sb)! -> sb "this"
  def compile-as-block(options, level, line-start, sb)!
    Noop().compile-as-block(options, level, line-start, sb)
  
  def is-noop() -> true
  
  def walk() -> this
  
  def inspect() -> "This()"
  
  def to-JSON() -> { type: "This" }
  @from-JSON := # -> This()

exports.Throw := class Throw extends Statement
  def constructor(@node as Expression = Noop())
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last Throw, true
  
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
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def inspect(depth)
    let d = dec-depth depth
    "Throw($(inspect @node, null, d))"
  
  def to-JSON() -> { type: "Throw", node: simplify(@node) }
  @from-JSON := #({node}) -> Throw from-JSON(node)

exports.Switch := class Switch extends Statement
  def constructor(mutable node = Noop(), @cases as [SwitchCase] = [], default-case as Node = Noop())
    if node not instanceof Expression
      node := to-const node
    @node := node
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
        if case_.node.is-small() and case_.body.is-small()
          sb " "
          case_.body.compile-as-statement options, true, sb
        else
          sb "\n"
          sb.indent child-options.indent
          case_.body.compile-as-statement child-options, true, sb
    if not @default-case.is-noop()
      sb "\n"
      sb.indent options.indent
      sb "default:"
      if @default-case.is-small()
        sb " "
        @default-case.compile-as-statement options, true, sb
      else
        sb "\n"
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
  
  def inspect(depth)
    let d = dec-depth depth
    "Switch($(inspect @node, null, d), $(inspect @cases, null, d), $(inspect @default-case, null, d))"
  
  def to-JSON()
    type: "Switch"
    node: simplify(@node)
    cases: simplify(for case_ in @cases
      { node: simplify(case_.node), body: simplify(case_.body) })
    default-case: simplify(@default-case)
  @from-JSON := #({node, cases, default-case})
    let result-cases = []
    for case_ in (cases or [])
      if not case_ or typeof case_ != \object
        throw Error "Expected an object with a node and body"
      result-cases.push SwitchCase from-JSON(case_.node), from-JSON(case_.body)
    Switch from-JSON(node), result-cases, from-JSON(default-case)
  
  Switch.Case := class SwitchCase
    def constructor(mutable node = Noop(), body as Node = Noop())
      if node not instanceof Expression
        node := to-const node
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
    
    def inspect(depth)
      let d = dec-depth depth
      "Case($(inspect @node, null, d), $(inspect @body, null, d))"

exports.TryCatch := class TryCatch extends Statement
  def constructor(try-body as Node = Noop(), @catch-ident as Ident, catch-body as Node = Noop())
    @try-body := try-body.maybe-to-statement()
    if @try-body.is-noop()
      return @try-body
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
  
  def inspect(depth)
    let d = dec-depth depth
    "TryCatch($(inspect @try-body, null, d), $(inspect @catch-ident, null, d), $(inspect @catch-body, null, d))"
  
  def to-JSON() -> { type: "TryCatch", try-body: simplify(@try-body), @catch-ident, catch-body: simplify(@catch-body) }
  @from-JSON := #({try-body, catch-ident, catch-body}) -> TryCatch from-JSON(try-body), from-JSON(catch-ident), from-JSON(catch-body)

exports.TryFinally := class TryFinally extends Statement
  def constructor(try-body as Node = Noop(), finally-body as Node = Noop())
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
  
  def inspect(depth)
    let d = dec-depth depth
    "Root($(inspect @try-body, null, d), $(inspect @finally-body, null, d))"
  
  def to-JSON() -> { type: "TryFinally", try-body: simplify(@try-body), finally-body: simplify(@finally-body) }
  @from-JSON := #({try-body, finally-body}) -> TryFinally from-JSON(try-body), from-JSON(finally-body)

exports.Unary := class Unary extends Expression
  def constructor(@op as String, mutable node = Noop())
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if node not instanceof Expression
      node := to-const node

    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    @node := node
  
  def compile(options, level, line-start, sb)!
    let op = @op
    if op in ["++post", "--post"]
      @node.compile options, Level.unary, false, sb
      sb op.substring(0, 2)
    else
      sb op
      if op in ["typeof", "void", "delete"] or (op in ["+", "-", "++", "--"] and ((@node instanceof Unary and op in ["+", "-", "++", "--"]) or (@node instanceof Const and typeof @node.value == "number" and is-negative(@node.value))))
        sb " "
      @node.compile options, Level.unary, false, sb
  
  def compile-as-block(options, level, line-start, sb)!
    let op = @op
    if ASSIGNMENT_OPERATORS ownskey op
      @compile(options, level, line-start, sb)
    else
      @node.compile-as-block(options, level, line-start, sb)
  
  def compile-as-statement(options, line-start, sb)!
    let op = @op
    if ASSIGNMENT_OPERATORS ownskey op
      super.compile-as-statement(options, line-start, sb)
    else
      @node.compile-as-statement(options, line-start, sb)
  
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
  
  let ASSIGNMENT_OPERATORS = {
    +"++"
    +"--"
    +"++post"
    +"--post"
    +"delete"
  }
  
  def is-large() -> @node.is-large()
  def is-small() -> @node.is-small()
  
  def is-noop()
    @_is-noop ?= ASSIGNMENT_OPERATORS not ownskey @op and @node.is-noop()
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Unary(@op, node)
    else
      this
  
  def inspect(depth)
    let d = dec-depth depth
    "Unary($(inspect @op, null, d), $(inspect @node, null, d))"
  
  def to-JSON() -> { type: "Unary", @op, node: simplify(@node) }
  @from-JSON := #({op, node}) -> Unary op, from-JSON(node)

let While = exports.While := #(test, body)
  For(null, test, null, body)

let from-JSON = exports.from-JSON := #(obj)
  if not obj?
    return Noop()
  
  if typeof obj != \object
    throw TypeError "Must provide an object to deserialize"
  
  if Array.isArray(obj)
    throw TypeError "Not expecting an array"
  
  if typeof obj.type != \string
    throw Error "Expected an object with a string 'type' key"
  
  if exports not ownskey obj.type
    throw Error "Unknown node type: $(obj.type)"
  
  exports[obj.type].from-JSON(obj)

let array-from-JSON(array)
  if not array?
    []
  else if Array.isArray(array)
    return for item in array; from-JSON(item)
  else
    throw Error "Expected an array, got $(typeof! array)"
