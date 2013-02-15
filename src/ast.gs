require! util
let inspect = util?.inspect
let {pad-left} = require './utils'

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
      let mutable result = cache[* - 1]
      for i in cache.length to indent
        result &= INDENT
        cache.push result
    cache[indent]

let wrap-string-handler(callback)
  let cb = #(item)!
    let s = String(item)
    let parts = s.split(r"(?:\r\n?|[\n\u2028\u2029])"g)
    if parts.length == 1
      cb.column += parts[0].length
    else
      let len = parts.length
      cb.line += len - 1
      cb.column := parts[len - 1].length + 1
    callback s
  cb.line := 1
  cb.column := 1
  cb.indent := #(count)!
    callback get-indent(count)
    cb.column += count
  cb

let StringWriter(callback)
  let sb = wrap-string-handler callback

let StringBuilder()
  let data = []
  let sb = wrap-string-handler #(item)! -> data.push item
  sb.to-string := #
    switch data.length
    case 0; ""
    case 1; data[0]
    default
      let text = data.join ""
      data.splice 0, data.length, text
      text
  sb

let is-negative(value) -> value < 0 or value is -0

let unicode-replacer(m)
  "\\u$(pad-left m.char-code-at(0).to-string(16), 4, '0')"

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
        default; unicode-replacer(m)
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
      else
        throw Error()
  #(value) as String
    let f = to-JS-source-types![typeof value]
    unless f
      throw TypeError "Cannot compile const $(typeof! value)"
    f value

let is-acceptable-ident = exports.is-acceptable-ident := do
  let IDENTIFIER_REGEX = r'^[a-zA-Z_\$][a-zA-Z_\$0-9]*$'
  let IDENTIFIER_UNICODE_REGEX = r'^[a-zA-Z_\$\u00a0-\uffff][a-zA-Z_\$0-9\u00a0-\uffff]*$'
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
  #(name as String, allow-unicode as Boolean)
    let regex = if allow-unicode then IDENTIFIER_UNICODE_REGEX else IDENTIFIER_REGEX
    regex.test(name) and name not in RESERVED

exports.Node := class Node
  def constructor()
    throw Error "Node cannot be instantiated directly"
  
  def to-string()
    let sb = StringBuilder()
    @compile-as-statement { indent: 0, +bare }, true, sb
    sb.to-string()
  
  def compile
  
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

exports.Access := #(pos, parent, ...children)
  for reduce child in children, current = parent
    Binary pos, current, ".", child

let make-pos(line as Number, column as Number, file as String|void)
  let pos = { line, column }
  if file
    pos.file := file
  pos

exports.Arguments := class Arguments extends Expression
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)!
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "arguments"
  def compile-as-block(options, level, line-start, sb)! -> Noop(@pos).compile-as-block(options, level, line-start, sb)
  def walk() -> this
  def is-noop() -> true
  def inspect(depth) -> inspect-helper depth, "Arguments", @pos
  def to-JSON() -> { type: "Arguments", @pos.line, @pos.column, @pos.file }
  @from-JSON := #({line, column, file}) -> Arguments(make-pos(line, column, file))

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

let dec-depth(depth)
  if depth?
    depth - 1
  else
    null

let inspect-helper(depth, name, pos, ...args)
  let d = dec-depth depth
  let mutable found = false
  for arg in args by -1
    if not arg or arg instanceof Noop or (is-array! arg and arg.length == 0)
      args.pop()
    else
      break
  
  let mutable parts = for arg in args; inspect(arg, null, d)
  let has-large = for some part in parts
    parts.length > 50 or part.index-of("\n") != -1
  if has-large
    parts := for part in parts
      "  " & part.split("\n").join("\n  ")
    "$name(\n$(parts.join ',\n'))"
  else
    "$name($(parts.join ', '))"

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
  def constructor(@pos as {}, @elements as [Expression] = []) ->
  
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
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file(@pos.file)
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "["
    let f = if @should-compile-large() then compile-large else compile-small
    f(@elements, options, level, line-start, sb)
    sb "]"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  def compile-as-block(options, level, line-start, sb)
    BlockExpression(@pos, @elements).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    BlockStatement(@pos, @elements).compile(options, line-start, sb)
  
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
      Arr @pos, elements
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Arr", @pos, @elements
  
  def to-JSON() -> { type: "Arr", @pos.line, @pos.column, @pos.file, elements: simplify(@elements) }
  @from-JSON := #({line, column, file, elements}) -> Arr make-pos(line, column, file), array-from-JSON(elements)

exports.Assign := #(pos, left, right)
  Binary pos, left, "=", right

exports.BinaryChain := #(pos, op, ...args)
  if op == "+"
    for i in args.length - 2 to 0 by -1
      let left = args[i]
      let right = args[i + 1]
      if (typeof left == \string or (left instanceof Const and typeof left.value == \string)) and (typeof right == \string or (right instanceof Const and typeof right.value == \string))
        args.splice i, 2, (if typeof left == \string then left else left.value) & (if typeof right == \string then right else right.value)
  for reduce arg in args[1 to -1], current = args[0]
    Binary pos, current, op, arg

exports.And := #(pos, ...args)
  if args.length == 0
    Const pos, true
  else
    for reduce i in 1 til args.length, current = args[0]
      Binary pos, current, "&&", args[i]

exports.Or := #(pos, ...args)
  if args.length == 0
    Const pos, false
  else
    for reduce i in 1 til args.length, current = args[0]
      Binary pos, current, "||", args[i]

let to-const(pos, value)
  if value instanceof Node
    throw Error "Cannot convert $(typeof! value) to a Const"
  else if value instanceof RegExp
    Regex pos, value.source, value.flags
  else
    Const pos, value

exports.Binary := class Binary extends Expression
  def constructor(@pos as {}, mutable left = Noop(pos), @op as String, mutable right = Noop(pos))
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(to-JS-source op)"
    
    if left not instanceof Expression
      left := to-const pos, left
    if right not instanceof Expression
      right := to-const pos, right
    
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
      (if left instanceof Const then left else Const(@pos, void)).compile options, Level.inside-parentheses, false, sb
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
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file(@pos.file)
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    let f = if @op == "." then compile-access else compile-other
    f(@op, @left, @right, options, level, line-start, sb)
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def compile-as-block(options, level, line-start, sb)!
    if ASSIGNMENT_OPS ownskey @op or @op in ["&&", "||"]
      super.compile-as-block(options, level, line-start, sb)
    else
      BlockExpression(@pos, [@left, @right]).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    let left = @left
    let op = @op
    if ASSIGNMENT_OPS ownskey op
      if left instanceof Ident and typeof @right.to-statement == "function" and false
        @right.to-statement()
          .mutate-last((#(node)@ -> Binary @pos, left, op, node), true)
          .compile-as-statement(options, line-start, sb)
      else
        super.compile-as-statement(options, line-start, sb)
    else
      BlockStatement(@pos, [@left, @right]).compile-as-statement(options, line-start, sb)
  
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
      Binary @pos, left, @op, right
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Binary", @pos, @left, @op, @right
  
  def to-JSON() -> { type: "Binary", @pos.line, @pos.column, @pos.file, left: simplify(@left), @op, right: simplify(@right) }
  @from-JSON := #({line, column, file, left, op, right}) -> Binary make-pos(line, column, file), from-JSON(left), op, from-JSON(right)

exports.BlockStatement := class BlockStatement extends Statement
  def constructor(@pos as {}, body as [Node] = [], @label as Ident|null)
    let result = []
    for item in body
      let statement = item.maybe-to-statement()
      if statement instanceof BlockStatement and not statement.label and (statement.pos.file == pos.file or not statement.pos.file)
        result.push ...statement.body
      else if statement not instanceof Noop
        result.push statement
      if statement.exit-type()?
        break
    switch result.length
    case 0; return Noop(pos)
    case 1
      if pos.file and not result[0].pos.file
        result[0].pos.file := pos.file
      return result[0]
    @body := result
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    let nodes = for node in @body
      if not node.is-noop()
        node
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    let child-options = if @label? then inc-indent(options) else options
    
    if @label?
      @label.compile options, level, line-start, sb
      sb ": {\n"
      sb.indent child-options.indent
    
    for item, i in nodes
      if i > 0
        sb "\n"
        sb.indent child-options.indent
      item.compile-as-statement child-options, true, sb
    
    if @label?
      sb "\n"
      sb.indent options.indent
      sb "}"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let body = walk-array(@body, walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if @body != body or @label != label
      Block @pos, body, label
    else
      this
  
  def mutate-last(func, include-noop)
    let last = @last()
    let new-last = last.mutate-last(func, include-noop)
    if last != new-last
      let body = @body[0 til -1]
      body.push new-last
      Block @pos, body
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[* - 1]
  
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def inspect(depth) -> inspect-helper depth, "BlockStatement", @pos, @body, @label
  
  def to-JSON() -> { type: "BlockStatement", @pos.line, @pos.column, @pos.file, @body, label: @label ? void }
  @from-JSON := #({line, column, file, body, label}) -> BlockStatement make-pos(line, column, file), array-from-JSON(body), if label? then from-JSON(label) else null

exports.BlockExpression := class BlockExpression extends Expression
  def constructor(@pos as {}, body as [Expression] = [])
    let result = []
    for item, i, len in body
      if i == len - 1 or not item not instanceof Noop
        if item instanceof BlockExpression and (item.pos.file == pos.file or not item.pos.file)
          result.push ...item.body
          if i < len - 1 and result[* - 1] instanceof Noop
            result.pop()
        else if item not instanceof Noop
          result.push item
    switch result.length
    case 0; return Noop(pos)
    case 1
      if pos.file and not result[0].pos.file
        result[0].pos.file := pos.file
      return result[0]
    @body := result
  
  def to-statement() -> BlockStatement @pos, @body
  
  def compile(options, level, line-start, sb)!
    if level == Level.block
      @to-statement().compile options, level, line-start, sb
    else
      let nodes = for node, i, len in @body
        if not node.is-noop() or i == len - 1
          node
      
      if options.sourcemap? and @pos.file
        options.sourcemap.push-file @pos.file
      options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      for item, i in nodes
        if i > 0
          sb ", "
        item.compile options, if wrap then Level.sequence else level, false, sb
      if wrap
        sb ")"
      if options.sourcemap? and @pos.file
        options.sourcemap.pop-file()
  
  def compile-as-block(options, level, line-start, sb)!
    if level == Level.block
      @compile options, level, line-start, sb
    else
      let nodes = for node, i, len in @body
        if not node.is-noop()
          node
      
      if options.sourcemap? and @pos.file
        options.sourcemap.push-file @pos.file
      options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      for item, i in nodes
        if i > 0
          sb ", "
        item.compile-as-block options, if wrap then Level.sequence else level, false, sb
      if wrap
        sb ")"
      if options.sourcemap? and @pos.file
        options.sourcemap.pop-file()
  
  def is-large()
    @_is-large ?= @body.length > 4 or for some part in @body by -1; part.is-large()
  
  def is-small() -> false
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def walk = BlockStatement::walk
  def last() -> @body[* - 1]
  
  def inspect(depth) -> inspect-helper depth, "BlockExpression", @pos, @body
  
  def to-JSON() -> { type: "BlockExpression", @pos.line, @pos.column, @pos.file, @body }
  @from-JSON := #({line, column, file, body}) -> BlockExpression make-pos(line, column, file), array-from-JSON(body)

let Block = exports.Block := #(pos, body as [Node] = [], label as Ident|null)
  if body.length == 0
    Noop(pos)
  else
    if not label? and (for every item in body by -1; item instanceof Expression)
      BlockExpression pos, body
    else
      BlockStatement pos, body, label

exports.Break := class Break extends Statement
  def constructor(@pos as {}, @label as Ident|null) ->
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "break"
    if @label?
      sb " "
      @label.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file @pos.file
  
  def walk() -> this
  
  def exit-type() -> \break
  
  def walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if label != @label
      Break @pos, label
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Break", @pos, @label
  
  def is-large() -> false
  
  def to-JSON() -> { type: "Break", @pos.line, @pos.column, @pos.file, label: @label ? void }
  @from-JSON := #({line, column, file, label}) -> Break make-pos(line, column, file), if label then from-JSON(label) else null

exports.Call := class Call extends Expression
  def constructor(@pos as {}, @func as Expression = Noop(pos), @args as [Expression] = [], @is-new as Boolean) ->
  
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
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
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
      Call @pos, func, args, @is-new
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Call", @pos, @func, @args, @is-new
  
  def to-JSON() -> { type: "Call", @pos.line, @pos.column, @pos.file, func: simplify(@func), args: simplify(@args), is-new: @is-new or void }
  @from-JSON := #({line, column, file, func, args, is-new}) -> Call make-pos(line, column, file), from-JSON(func), array-from-JSON(args), is-new

exports.Comment := class Comment extends Statement
  def constructor(@pos as {}, @text as String)
    if text.substring(0, 2) != "/*"
      throw Error "Expected text to start with '/*'"
    if text.slice(-2) != "*/"
      throw Error "Expected text to end with '*/'"
  
  def compile(options, level, line-start, sb)!
    let lines = @text.split("\n")
    for line, i in lines
      if i > 0
        sb "\n"
        sb.indent options.indent
      sb line
  
  def is-const() -> true
  def const-value() -> void
  def is-noop() -> false
  
  def walk() -> this
  
  def inspect(depth) -> inspect-helper "Comment", @pos, @text
  
  def to-JSON() -> { type: "Comment", @pos.line, @pos.column, @pos.file, @text }
  @from-JSON := #({line, column, file, text}) -> Comment(make-pos(line, column, file), text)

exports.Const := class Const extends Expression
  def constructor(@pos as {}, @value as void|null|Boolean|Number|String) ->
  
  def compile(options, level, line-start, sb)!
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    let value = @value
    if value == void and options.undefined-name?
      sb options.undefined-name
    else
      let wrap = level >= Level.increment and (value == void or (typeof value == "number" and not is-finite(value)))
      if wrap
        sb "("
      sb to-JS-source(value)
      if wrap
        sb ")"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> @value
  
  def walk() -> this
  
  def inspect(depth) -> "Const($(inspect @value, null, dec-depth depth))"
  
  def to-JSON()
    let result = { type: "Const", @pos.line, @pos.column, @pos.file, @value }
    if typeof @value == \number and not is-finite(@value)
      result.infinite := true
      if @value == Infinity
        result.value := 1
      else if @value == -Infinity
        result.value := -1
      else if @value is NaN
        result.value := 0
    else if @value == 0
      result.sign := if is-negative(@value) then -1 else 1
    result
  @from-JSON := #(obj)
    Const make-pos(obj.line, obj.column, obj.file), if obj.infinite
      obj.value / 0
    else if obj.value == 0
      if obj.sign and obj.sign < 0 then -0 else 0
    else
      obj.value

exports.Continue := class Continue extends Statement
  def constructor(@pos as {}, @label as Ident|null) ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "continue"
    if @label?
      sb " "
      @label.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk() -> this
  
  def exit-type() -> \continue
  
  def is-large() -> false
  
  def walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if label != @label
      Continue @pop, label
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Continue", @pos, @label
  
  def to-JSON() -> { type: "Continue", @pos.line, @pos.column, @pos.file, label: @label ? void }
  @from-JSON := #({line, column, file, label}) -> Continue make-pos(line, column, file), if label then from-JSON(label) else null

exports.Debugger := class Debugger extends Statement
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "debugger;"
  
  def walk() -> this

  def is-large() -> false
  
  def inspect(depth) -> inspect-helper depth, "Debugger", @pos
  
  def to-JSON() -> { type: "Debugger", @pos.line, @pos.column, @pos.file }
  @from-JSON := #({line, column, file}) -> Debugger(make-pos(line, column, file))

exports.DoWhile := class DoWhile extends Statement
  def constructor(@pos as {}, body as Node = Noop(pos), @test as Expression = Noop(pos), @label as Ident|null)
    @body := body.maybe-to-statement()
    if test.is-const() and not test.const-value()
      return Block(pos, [@body], label)
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if body != @body or test != @test or label != @label
      DoWhile @pos, body, test, label
    else
      this

  def inspect(depth) -> inspect-helper depth, "DoWhile", @pos, @body, @test, @label
  
  def to-JSON() -> { type: "DoWhile", @pos.line, @pos.column, @pos.file, body: simplify(@body), test: simplify(@test), label: @label ? void }
  @from-JSON := #({line, column, file, body, test, label}) -> DoWhile make-pos(line, column, file), from-JSON(body), from-JSON(test), if label? then from-JSON(label) else null

exports.Eval := class Eval extends Expression
  def constructor(@pos as {}, mutable code = Noop(pos))
    if code not instanceof Expression
      code := to-const pos, code
    @code := code
  
  def compile(options, level, line-start, sb)!  
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @code instanceof Const
      sb String(@code.value)
    else
      sb "eval("
      @code.compile options, Level.sequence, false, sb
      sb ")"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let code = walker(@code) ? @code.walk(walker)
    if code != @code
      Eval @pops, code
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Eval", @pos, @code
  
  def to-JSON() -> { type: "Eval", @pos.line, @pos.column, @pos.file, code: simplify(@code) }
  @from-JSON := #({line, column, file, code}) -> Eval make-pos(line, column, file), from-JSON(code)

exports.For := class For extends Statement
  def constructor(@pos as {}, @init as Expression = Noop(pos), mutable test = Const(pos, true), @step as Expression = Noop(pos), body as Node, @label as Ident|null)
    if test not instanceof Expression
      test := to-const pos, test
    if test.is-const() and not test.const-value()
      return init
    @test := test
    @body := body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    let test = if @test.is-const() and typeof @test.const-value() != \boolean
      Const(@pos, not not @test.const-value())
    else
      @test
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
    
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let init = walker(@init) ? @init.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    let step = walker(@step) ? @step.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if init != @init or test != @test or step != @step or body != @body or label != @label
      For @pos, init, test, step, body, label
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "For", @pos, @init, @test, @step, @body, @label
  
  def to-JSON()
    type: "For"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    init: simplify(@init)
    test: simplify(@test)
    step: simplify(@step)
    body: simplify(@body)
    label: @label ? void
  @from-JSON := #({line, column, file, init, test, step, body, label}) -> For make-pos(line, column, file), from-JSON(init), from-JSON(test), from-JSON(step), from-JSON(body), if label? then from-JSON(label) else null

exports.ForIn := class ForIn extends Statement
  def constructor(@pos as {}, @key as Ident, @object as Expression = Noop(line, column), body as Node = Noop(line, column), @label as Ident|null)
    @body := body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
    
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let key = walker(@key) ? @key.walk(walker)
    let object = walker(@object) ? @object.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if key != @key or object != @object or body != @body or label != @label
      ForIn @pos, key, object, body
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "ForIn", @pos, @key, @object, @body, @label
  
  def to-JSON()
    type: "ForIn"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    key: @key
    object: simplify(@object)
    body: simplify(@body)
    label: @label ? void
  @from-JSON := #({line, column, file, key, object, body, label}) -> ForIn make-pos(line, column, file), from-JSON(key), from-JSON(object), from-JSON(body), if label? then from-JSON(label) else null

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
      Ident(body.pos, variables[i], true).compile options, Level.inside-parentheses, false, sb
    sb ";\n"
  
  if not body.is-noop()
    sb.indent options.indent
    body.compile-as-statement options, true, sb
    sb "\n"

let compile-func(options, sb, name, params, declarations, variables, body)
  sb "function "
  if name?
    name.compile options, Level.inside-parentheses, false, sb
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
  def constructor(@pos as {}, @name as null|Ident, @params as [Ident] = [], @variables as [String] = [], @body as Node = Noop(line, column), @declarations as [String] = [])
    validate-func-params-and-variables params, variables
  
  def compile(options, level, line-start, sb)!
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    let wrap = line-start and not @name
    if wrap
      sb "("
    compile-func options, sb, @name, @params, @declarations, @variables, @body
    if wrap
      sb ")"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
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
      Func @pos, name, params, @variables, body, @declarations, @meta
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Func", @pos, @name, @params, @variables, @body, @declarations, @meta
  
  def to-JSON() -> { type: "Func", @pos.line, @pos.column, @pos.file, name: @name or void, params: simplify(@params), variables: simplify(@variables), body: simplify(@body), declarations: simplify(@declarations) }
  @from-JSON := #({line, column, file, name, params, variables, body, declarations})
    Func make-pos(line, column, file), (if name then from-JSON(name)), array-from-JSON(params), variables, from-JSON(body), declarations

exports.Ident := class Ident extends Expression
  def constructor(@pos as {}, @name as String, allow-unacceptable as Boolean)
    unless allow-unacceptable or is-acceptable-ident name, true
      throw Error "Not an acceptable identifier name: $name"
    
  def compile(options, level, line-start, sb)!
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb @name.replace r"[\u0000-\u001f\u0080-\uffff]"g, unicode-replacer
  
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def walk() -> this
  
  def inspect(depth) -> inspect-helper depth, "Ident", @pos, @name
  
  def is-noop() -> true
  
  def to-JSON() -> { type: "Ident", @pos.line, @pos.column, @pos.file, @name }
  @from-JSON := #({line, column, file, name}) -> Ident make-pos(line, column, file), name

exports.IfStatement := class IfStatement extends Statement
  def constructor(@pos as {}, mutable test as Expression = Noop(pos), mutable when-true as Node = Noop(pos), mutable when-false as Node = Noop(pos), @label as Ident|null)
    if test instanceof Unary and test.op == "!" and test.node instanceof Unary and test.node.op == "!"
      test := test.node.node
    if test.is-const()
      return if test.const-value()
        Block pos, [when-true], label
      else
        Block pos, [when-false], label
    else
      when-true := when-true.maybe-to-statement()
      when-false := when-false.maybe-to-statement()
      if when-true instanceof Noop
        if when-false instanceof Noop
          return test.maybe-to-statement()
        else
          // TODO: the test inversion doesn't change the inner operators, just wraps it all
          return IfStatement@ this, pos, Unary(test.pos, "!", test), when-false, when-true, label
      else if when-false instanceof Noop and when-true instanceof IfStatement and when-true.when-false instanceof Noop and not when-true.label?
        @test := Binary pos, test, "&&", when-true.test
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
        IfStatement(@pos, Unary(@test.pos, "!", @test), @when-false, @when-true, @label).compile(options, level, line-start, sb)
    else
      if options.sourcemap? and @pos.file
        options.sourcemap.push-file @pos.file
      options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
      if @label?
        @label.compile options, level, line-start, sb
        sb ": "
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
        if when-false instanceof IfStatement and not when-false.label?
          when-false.compile options, level, false, sb
        else
          sb "{\n"
          sb.indent child-options.indent
          when-false.compile-as-statement child-options, true, sb
          sb "\n"
          sb.indent options.indent
          sb "}"
      if options.sourcemap? and @pos.file
        options.sourcemap.pop-file()
        
  def walk(walker)
    let test = walker(@test) ? @test.walk walker
    let when-true = walker(@when-true) ? @when-true.walk walker
    let when-false = walker(@when-false) ? @when-false.walk walker
    let label = if @label? then walker(@label) ? @label.walk walker else @label
    
    if test != @test or when-true != @when-true or when-false != @when-false or label != @label
      If @pos, test, when-true, when-false, label
    else
      this
  
  def mutate-last(func, include-noop)
    let when-true = @when-true.mutate-last(func, include-noop)
    let when-false = @when-false.mutate-last(func, include-noop)
    if when-true != @when-true or when-false != @when-false
      If @pos, @test, when-true, when-false, @label
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
  
  def inspect(depth) -> inspect-helper depth, "IfStatement", @pos, @test, @when-true, @when-false
  
  def to-JSON() -> { type: "IfStatement", @pos.line, @pos.column, @pos.file, test: simplify(@test), when-true: simplify(@when-true), when-false: simplify(@when-false), label: @label ? void }
  @from-JSON := #({line, column, file, test, when-true, when-false, label}) -> IfStatement make-pos(line, column, file), from-JSON(test), from-JSON(when-true), from-JSON(when-false), if label? then from-JSON(label) else null

exports.IfExpression := class IfExpression extends Expression
  def constructor(@pos as {}, mutable test as Expression = Noop(pos), mutable when-true = Noop(pos), mutable when-false = Noop(pos))
    if when-true not instanceof Expression
      when-true := to-const pos, when-true
    if when-false not instanceof Expression
      when-false := to-const pos, when-false
    if test instanceof Unary and test.op == "!" and test.node instanceof Unary and test.node.op == "!"
      test := test.node.node
    if test.is-const()
      return if test.const-value() then when-true else when-false
    else if when-false instanceof Noop and when-true instanceof IfExpression and when-true.when-false instanceof Noop
      @test := Binary pos, test, "&&", when-true.test
      @when-true := when-true.when-true
      @when-false := when-false
    else
      @test := test
      @when-true := when-true
      @when-false := when-false
  
  def to-statement() -> IfStatement @pos, @test, @when-true, @when-false
  
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
      if options.sourcemap? and @pos.file
        options.sourcemap.push-file @pos.file
      options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inline-condition
      if wrap
        sb "("
      let f = if @when-true.is-large() or @when-false.is-large() then compile-large else compile-small
      f @test, @when-true, @when-false, options, not wrap and line-start, sb
      if wrap
        sb ")"
      if options.sourcemap? and @pos.file
        options.sourcemap.pop-file()
  def compile-as-block(options, level, line-start, sb)!
    if @when-true.is-noop()
      if @when-false.is-noop()
        @test.compile-as-block(options, level, line-start, sb)
      else
        Binary(@pos, @test, "||", @when-false).compile-as-block(options, level, line-start, sb)
    else if @when-false.is-noop()
      Binary(@pos, @test, "&&", @when-true).compile-as-block(options, level, line-start, sb)
    else
      @compile(options, level, line-start, sb)
  
  def is-large() -> @_is-large ?= not (@test.is-small() and @when-true.is-small() and @when-false.is-small())
  
  def is-small() -> false
  
  def is-noop() -> @_is-noop ?= @test.is-noop() and @when-true.is-noop() and @when-false.is-noop()
  
  def walk = IfStatement::walk
  
  def inspect(depth) -> inspect-helper depth, "IfExpression", @pos, @test, @when-true, @when-false
  
  def to-JSON() -> { type: "IfExpression", @pos.line, @pos.column, @pos.file, test: simplify(@test), when-true: simplify(@when-true), when-false: simplify(@when-false) }
  @from-JSON := #({line, column, file, test, when-true, when-false}) -> IfExpression make-pos(line, column, file), from-JSON(test), from-JSON(when-true), from-JSON(when-false)

let If = exports.If := #(pos as {}, test, when-true, when-false, label)
  if when-true instanceof Statement or when-false instanceof Statement or label?
    IfStatement pos, test, when-true, when-false, label
  else
    IfExpression pos, test, when-true, when-false

exports.Noop := class Noop extends Expression
  def constructor(@pos as {}) ->

  def compile-as-statement() ->

  def compile(options, level, line-start, sb)!
    if level > Level.block
      Const(@pos, void).compile options, level, line-start, sb

  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> void

  def walk() -> this
  def mutate-last(func, include-noop)
    if include-noop
      func(this)
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Noop", @pos
  
  def to-JSON() -> { type: "Noop", @pos.line, @pos.column, @pos.file }
  @from-JSON := #({line, column, file}) -> Noop make-pos(line, column, file)

exports.Obj := class Obj extends Expression
  let validate-unique-keys(elements)!
    let keys = []
    for pair in elements by -1
      let {key} = pair
      if key in keys
        throw Error "Found duplicate key: $(to-JS-source key)"
      keys.push key
  
  def constructor(@pos as {}, @elements as [ObjPair] = [])
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
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if line-start
      sb "("
    sb "{"
    let f = if @should-compile-large() then compile-large else compile-small
    f @elements, options, sb
    sb "}"
    if line-start
      sb ")"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def compile-as-block(options, level, line-start, sb)!
    BlockExpression(@pos, for element in @elements; element.value).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    BlockStatement(@pos, for element in @elements; element.value).compile-as-statement(options, line-start, sb)
  
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
      Obj @pos, elements
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Obj", @pos, @elements
  
  def to-JSON()
    type: "Obj"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    elements: simplify(for pair in @elements
      { pair.pos.line, pair.pos.column, pair.pos.file, pair.key, value: simplify(pair.value) })
  @from-JSON := #({line, column, file, elements})
    let result-pairs = []
    for pair in (elements or [])
      if not pair or not is-object! pair
        throw Error "Expecting an object with a key and value"
      result-pairs.push ObjPair make-pos(pair.line, pair.column, pair.file), pair.key, from-JSON(pair.value)
    Obj make-pos(line, column, file), result-pairs
  
  Obj.Pair := class ObjPair
    def constructor(@pos as {}, @key as String, mutable value = Noop(line, column))
      if value not instanceof Expression
        value := to-const pos, value
      @value := value
    
    def is-small() -> @value.is-small()
    def is-large() -> @value.is-large()
    def is-noop() -> @value.is-noop()
    def walk(walker)
      let value = walker(@value) ? @value.walk(walker)
      if value != @value
        ObjPair @pos, @key, value
      else
        this
    
    def inspect(depth) -> inspect-helper depth, "Pair", @pos, @key, @value

exports.Regex := class Regex extends Expression
  def constructor(@pos as {}, @source as String, @flags as String = "") ->

  def compile(options, level, line-start, sb)!
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "/"
    sb @source.replace(r"(\\\\)*\\?/"g, "\$1\\/") or "(?:)"
    sb "/"
    sb @flags
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)

  def is-noop() -> true
  
  def walk() -> this

  def inspect(depth) -> inspect-helper depth, "Regex", @pos, @source, @flags

  def to-JSON()
    { type: "Regex", @pos.line, @pos.column, @pos.file, @source, @flags }
  @from-JSON := #({line, column, file, source, flags}) -> Regex make-pos(line, column, file), source, flags

exports.Return := class Return extends Statement
  def constructor(@pos as {}, @node as Expression = Noop(pos))
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last (#(n) -> Return pos, n), true
  
  def compile(options, level, line-start, sb)!
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "return"
    unless @node.is-const() and @node.const-value() == void
      sb " "
      @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Return @pos, node
    else
      this
  
  def exit-type() -> \return
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def inspect(depth) -> inspect-helper depth, "Return", @pos, @node
  
  def to-JSON() -> { type: "Return", @pos.line, @pos.column, @pos.file, node: simplify(@node) }
  @from-JSON := #({line, column, file, node}) -> Return make-pos(line, column, file), from-JSON(node)

exports.Root := class Root
  def constructor(@pos as {}, @body as Node = Noop(pos), @variables as [String] = [], @declarations as [String] = [])
    validate-func-params-and-variables [], variables

  def compile(options = {})
    if not options.indent
      options.indent := 0
    
    let writer = if not options.uglify and typeof options.writer == \function then options.writer
    let sb = if writer then StringWriter(writer) else StringBuilder()
    let start-time = new Date().get-time()
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    compile-func-body(options, sb, @declarations, @variables, @body)
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
    let end-compile-time = new Date().get-time()
    options.progress?(\compile, end-compile-time - start-time)
    let mutable end-uglify-time = 0
    if not writer?
      let mutable code = sb.to-string()
      if options.uglify
        let mutable tmp-map = void
        let fs = require("fs")
        if options.sourcemap?
          let path = require("path")
          let os = require("os")
          tmp-map := path.join(os.tmp-dir(), "gs-$(Math.random() * 2^32).map")
          fs.write-file-sync(tmp-map, options.sourcemap.to-string(), "utf8")
        let UglifyJS = require("uglify-js")
        let old-warn_function = UglifyJS.AST_Node?.warn_function
        if typeof old-warn_function == \function
          UglifyJS.AST_Node.warn_function := #->
        let minified = UglifyJS.minify(code, from-string: true, in-source-map: tmp-map, out-source-map: options.sourcemap?.generated-file)
        if old-warn_function?
          UglifyJS.AST_Node.warn_function := old-warn_function
        if tmp-map?
          fs.unlink-sync tmp-map
        code := minified.code
        end-uglify-time := new Date().get-time()
        options.progress?(\uglify, end-uglify-time - end-compile-time)
        if options.sourcemap?
          options.sourcemap := minified.map
      if typeof options.writer == \function
        options.writer(code)
        code := ""
    {
      compile-time: end-compile-time - start-time
      uglify-time: if options.uglify then end-uglify-time - end-compile-time
      code: code or ""
    }
  
  def to-string() -> @compile().code
  
  def is-large() -> true
  
  def walk(walker)
    let body = @body.walk(walker)
    if body != @body
      Root @pos, body, @variables, @declarations
    else
      this
  
  def mutate-last(func, include-noop)
    let body = @body.mutate-last func, include-noop
    if body != @body
      Root @pos, body, @variables, @declarations
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[* - 1]
  
  def inspect(depth) -> inspect-helper depth, "Root", @pos, @body, @variables, @declarations
  
  def to-JSON() -> { type: "Root", @pos.line, @pos.column, @pos.file, body: simplify(@body), variables: simplify(@variables), declarations: simplify(@declarations) }
  @from-JSON := #({line, column, file, body, variables, declarations}) -> Root make-pos(line, column, file), from-JSON(body), variables, declarations

exports.This := class This extends Expression
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)!
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "this"
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def is-noop() -> true
  
  def walk() -> this
  
  def inspect(depth) -> inspect-helper depth, "This", @pos
  
  def to-JSON() -> { type: "This", @pos.line, @pos.column, @pos.file }
  @from-JSON := #({line, column, file}) -> This(make-pos(line, column, file))

exports.Throw := class Throw extends Statement
  def constructor(@pos as {}, @node as Expression = Noop(line, column))
    if typeof node.to-statement == "function"
      return node.to-statement().mutate-last (#(n)@ -> Throw @pos, n), true
  
  def compile(options, level, line-start, sb)
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "throw "
    @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Throw @pos, node
    else
      this
  
  def exit-type() -> \throw
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def inspect(depth) -> inspect-helper depth, "Throw", @pos, @node
  
  def to-JSON() -> { type: "Throw", @pos.line, @pos.column, @pos.file, node: simplify(@node) }
  @from-JSON := #({line, column, file, node}) -> Throw make-pos(line, column, file), from-JSON(node)

exports.Switch := class Switch extends Statement
  def constructor(@pos as {}, mutable node = Noop(pos), @cases as [SwitchCase] = [], default-case as Node = Noop(pos), @label as Ident|null)
    if node not instanceof Expression
      node := to-const pos, node
    @node := node
    @default-case := default-case.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let node = walker(@node) ? @node.walk(walker)
    let cases = walk-array(@cases, walker)
    let default-case = walker(@default-case) ? @default-case.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if node != @node or cases != @cases or default-case != @default-case or label != @label
      Switch @pos, node, cases, default-case, label
    else
      this
  
  def inspect(depth) -> @inspect-helper depth, "Switch", @pos, @node, @cases, @default-case, @label
  
  def to-JSON()
    type: "Switch"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    node: simplify(@node)
    cases: simplify(for case_ in @cases
      { case_.pos.line, case_.pos.column, case_.pos.file, node: simplify(case_.node), body: simplify(case_.body) })
    default-case: simplify(@default-case)
    label: @label ? void
  @from-JSON := #({line, column, file, node, cases, default-case, label})
    let result-cases = []
    for case_ in (cases or [])
      if not case_ or typeof case_ != \object
        throw Error "Expected an object with a node and body"
      result-cases.push SwitchCase make-pos(case_.line, case_.column, case_.file), from-JSON(case_.node), from-JSON(case_.body)
    Switch make-pos(line, column, file), from-JSON(node), result-cases, from-JSON(default-case), if label? then from-JSON(label) else null
  
  Switch.Case := class SwitchCase
    def constructor(@pos as {}, mutable node = Noop(pos), body as Node = Noop(pos))
      if node not instanceof Expression
        node := to-const pos, node
      @node := node
      @body := body.maybe-to-statement()
    
    def is-large() -> true
    def is-small() -> false
    
    def walk(walker)
      let node = walker(@node) ? @node.walk(walker)
      let body = walker(@body) ? @body.walk(walker)
      if node != @node or body != @body
        SwitchCase @pos, node, body
      else
        this
    
    def inspect(depth) -> inspect-helper depth, "Case", @pos, @node, @body

exports.TryCatch := class TryCatch extends Statement
  def constructor(@pos as {}, try-body as Node = Noop(pos), @catch-ident as Ident, catch-body as Node = Noop(pos), @label as Ident|null)
    @try-body := try-body.maybe-to-statement()
    if @try-body.is-noop()
      return @try-body
    @catch-body := catch-body.maybe-to-statement()
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let catch-ident = walker(@catch-ident) ? @catch-ident.walk(walker)
    let catch-body = walker(@catch-body) ? @catch-body.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if try-body != @try-body or catch-ident != @catch-ident or catch-body != @catch-body or label != @label
      TryCatch @pos, try-body, catch-ident, catch-body, label
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "TryCatch", @pos, @try-body, @catch-ident, @catch-body, @label
  
  def to-JSON()
    type: "TryCatch"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    try-body: simplify(@try-body)
    catch-ident: @catch-ident
    catch-body: simplify(@catch-body)
    label: @label ? void
  @from-JSON := #({line, column, file, try-body, catch-ident, catch-body, label}) -> TryCatch make-pos(line, column, file), from-JSON(try-body), from-JSON(catch-ident), from-JSON(catch-body), if label? then from-JSON(label) else null

exports.TryFinally := class TryFinally extends Statement
  def constructor(@pos as {}, try-body as Node = Noop(pos), finally-body as Node = Noop(pos), @label as Ident|null)
    @try-body := try-body.maybe-to-statement()
    @finally-body := finally-body.maybe-to-statement()
    if not label?
      if @try-body.is-noop()
        return @finally-body
      else if @finally-body.is-noop()
        return @try-body
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @label?
      @label.compile options, level, line-start, sb
      sb ": "
    sb "try {\n"
    let child-options = inc-indent(options)
    sb.indent child-options.indent
    if @try-body instanceof TryCatch and not @try-body.label?
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
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
  def walk(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let finally-body = walker(@finally-body) ? @finally-body.walk(walker)
    let label = if @label? then walker(@label) ? @label.walk(walker) else @label
    if try-body != @try-body or finally-body != @finally-body or label != @label
      TryFinally @pos, try-body, finally-body, label
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "TryFinally", @pos, @try-body, @finally-body, @label
  
  def to-JSON()
    type: "TryFinally"
    line: @pos.line
    column: @pos.column
    file: @pos.file
    try-body: simplify(@try-body)
    finally-body: simplify(@finally-body)
    label: @label ? void
  @from-JSON := #({line, column, file, try-body, finally-body, label}) -> TryFinally make-pos(line, column, file), from-JSON(try-body), from-JSON(finally-body), if label? then from-JSON(label) else null

exports.Unary := class Unary extends Expression
  def constructor(@pos as {}, @op as String, mutable node = Noop(line, column))
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if node not instanceof Expression
      node := to-const line, column, node

    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    @node := node
  
  def compile(options, level, line-start, sb)!
    let op = @op
    if options.sourcemap? and @pos.file
      options.sourcemap.push-file @pos.file
    options.sourcemap?.add(sb.line, sb.column, @pos.line, @pos.column)
    if op in ["++post", "--post"]
      @node.compile options, Level.unary, false, sb
      sb op.substring(0, 2)
    else
      sb op
      if op in ["typeof", "void", "delete"] or (op in ["+", "-", "++", "--"] and ((@node instanceof Unary and op in ["+", "-", "++", "--"]) or (@node instanceof Const and typeof @node.value == "number" and is-negative(@node.value))))
        sb " "
      @node.compile options, Level.unary, false, sb
    if options.sourcemap? and @pos.file
      options.sourcemap.pop-file()
  
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
      Unary(@pos, @op, node)
    else
      this
  
  def inspect(depth) -> inspect-helper depth, "Unary", @pos, @op, @node
  
  def to-JSON() -> { type: "Unary", @pos.line, @pos.column, @pos.file, @op, node: simplify(@node) }
  @from-JSON := #({line, column, file, op, node}) -> Unary make-pos(line, column, file), op, from-JSON(node)

let While = exports.While := #(pos, test, body, label)
  For(pos, null, test, null, body, label)

let from-JSON = exports.from-JSON := #(obj)
  if not obj?
    return Noop(make-pos(0, 0))
  
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
