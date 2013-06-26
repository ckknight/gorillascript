import 'shared.gs'

require! util
let inspect = util?.inspect
let {pad-left} = require './utils'
let {is-acceptable-ident, to-JS-source} = require './jsutils'

// how long `var x, y, z;` lines can be, including indents.
const VAR_LINE_LENGTH = 80_chars

const INDENT = "  "

const Level = {
  block:              1 // { f(); `...`; g(); }
  inside-parentheses: 2 // f() + (`...`) + g() or f[`...`]
  sequence:           3 // [f(), `...`, g()] or x(f(), `...`, g())
  assignment:         4 // `...` += x
  inline-condition:   5 // `...` ? x : y
  logical-or:         6 // f() || `...`
  logical-and:        7 // f() && `...`
  bitwise-or:         8 // f() | `...`
  bitwise-and:        9 // f() ^ `...`
  bitwise-xor:       10 // f() & `...`
  equality:          11 // f() == `...`
  relational:        12 // f() < `...` or f() in `...` or f() instanceof `...`
  bitwise-shift:     13 // f() << `...` or f() >> `...` or f() >>> `...`
  addition:          14 // f() + `...` or f() - `...`
  multiplication:    15 // f() * `...` or f() / `...` or f() % `...`
  unary:             16 // +`...` or !`...`
  increment:         17 // ++`...` or `...`++ or --`...` or `...`--
  call-or-access:    18 // `...`() or `...`[0] `...`.item
  new-call:          19 // new `...`()
}

const AstType = {
  Arguments:       1
  Arr:             2
  Binary:          3
  BlockStatement:  4
  BlockExpression: 5
  Break:           6
  Call:            7
  Comment:         8
  Const:           9
  Continue:       10
  Debugger:       11
  DoWhile:        12
  Eval:           13
  For:            14
  ForIn:          15
  Func:           16
  Ident:          17
  IfStatement:    18
  IfExpression:   19
  Noop:           20
  Obj:            21
  Regex:          22
  Return:         23
  Root:           24
  This:           25
  Throw:          26
  Switch:         27
  TryCatch:       28
  TryFinally:     29
  Unary:          30
}

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

let NEWLINE_REGEXP = r"(?:\r\n?|[\n\u2028\u2029])"g
let wrap-string-handler(callback)
  let cb(item)!
    let s = String(item)
    let parts = s.split(NEWLINE_REGEXP)
    switch parts.length
    case 0; void
    case 1
      cb.column += parts[0].length
    default
      let len = parts.length
      cb.line += len - 1
      cb.column := parts[len - 1].length + 1
    callback s
  cb.line := 1
  cb.column := 1
  cb.indent := #(count)!
    this get-indent(count)
  cb

let StringWriter(callback)
  wrap-string-handler callback

let StringBuilder()
  let mutable data as String|Array = []
  let sb = wrap-string-handler #(item)! -> data.push item
  sb.to-string := #
    if is-string! data
      data
    else
      data := data.join ""
  sb

exports.Node := class Node
  def constructor()
    throw Error "Node cannot be instantiated directly"
  
  def to-string(options = {})
    let sb = StringBuilder()
    @compile { indent: 0, +bare } <<< options, Level.inside-parentheses, false, sb
    sb.to-string()
  
  def compile
  
  def maybe-to-statement()
    if is-function! @to-statement
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
  
  def remove-trailing-return-voids() -> this
  
  def walk-with-this(walker)
    walker(this) ? @walk(walker)
  
  let inspect-array(depth, array)
    if array.length == 0
      "[]"
    else
      let mutable sb = ""
      sb &= "["
      for item in array
        sb &= "\n  "
        sb &= inspect(item, null, dec-depth(depth)).split("\n").join("\n  ")
      sb &= "\n]"
      sb
  
  def inspect(depth, include-empty)
    let mutable sb as String = @constructor.display-name
    sb &= ' "'
    if @pos.file
      sb &= @pos.file
      sb &= ":"
    sb &= @pos.line
    sb &= ":"
    sb &= @pos.column
    sb &= '"'
    for k, v of this
      if k != \pos and (include-empty or (v and not (is-array! v and v.length == 0) and v not instanceof Noop))
        sb &= "\n  "
        sb &= k
        sb &= ": "
        if is-array! v
          sb &= inspect-array(depth, v).split("\n").join("\n  ")
        else
          sb &= inspect(v, null, dec-depth(depth)).split("\n").join("\n  ")
    sb
  
  def to-ast(pos, ident)
    Call pos, ident,
      [
        Const pos, @type-id
        Const pos, @pos.line
        Const pos, @pos.column
        Const pos, @pos.file or 0
        ...@_to-ast(pos, ident)
      ]
  def _to-ast() -> []
  def to-JSON() -> [@type-id, @pos.line, @pos.column, @pos.file or 0, ...@_to-JSON()]
  def _to-JSON() -> []

exports.Expression := class Expression extends Node
  def constructor()
    throw Error "Expression cannot be instantiated directly"
  
  def compile-as-block(options, level, line-start, sb)! -> @compile options, level, line-start, sb
  
  def compile-as-statement(options, line-start, sb)!
    if is-function! @to-statement
      @to-statement().compile-as-statement options, line-start, sb
    else
      @compile options, Level.block, line-start, sb
      sb ";"
  
  def is-large() -> false
  
  def invert()
    Unary(@pos, "!", this)
  
  def mutate-last(func) -> func(this)
  
  def with-label(label as Ident|null)
    if label
      BlockStatement(@pos, [this], label)
    else
      this

exports.Statement := class Statement extends Node
  def constructor()
    throw Error "Expression cannot be instantiated directly"
  
  def compile-as-statement(options, line-start, sb)
    @compile options, Level.block, line-start, sb

exports.Access := #(pos, parent, ...children)
  for reduce child in children, current = parent
    Binary pos, current, ".", child

let make-pos(line as Number, column as Number, file as String|Number|void)
  let pos = { line, column }
  if file
    if not is-string! file
      throw TypeError "Must provide a valid string for file"
    pos.file := file
  pos

let dec-depth(depth)
  if depth?
    depth - 1
  else
    null

exports.Arguments := class Arguments extends Expression
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)!
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "arguments"
  def compile-as-block(options, level, line-start, sb)! -> Noop(@pos).compile-as-block(options, level, line-start, sb)
  def walk() -> this
  def is-noop() -> true
  def type-id = AstType.Arguments
  @_from-ast := #(pos) -> Arguments pos
  @from-JSON := #(line, column, file) -> Arguments(make-pos(line, column, file))

let walk-array(array as [], parent as Node, message, walker as ->)
  let mutable changed = false
  let result = for item in array
    let new-item = walker(item, parent, message) ? item.walk walker
    if item != new-item
      changed := true
    new-item
  if changed
    result
  else
    array

let simplify-array(array as [], child-default-value, keep-trailing as Boolean)
  if array.length == 0
    array
  else
    let result = []
    let mutable last-noop = -1
    for item, i in array
      if item instanceof Noop
        last-noop := i
      else
        last-noop := -1
      result.push simplify(item, child-default-value)
    if not keep-trailing and last-noop != -1
      result.splice last-noop, Infinity
    result

let simplify(obj, default-value)
  if is-array! obj
    simplify-array(obj)
  else if obj instanceof Noop
    default-value
  else
    obj

exports.Arr := class Arr extends Expression
  def constructor(@pos as {}, @elements as [Expression] = []) ->
  
  let compile-large(elements, options, level, line-start, sb)!
    let child-options = inc-indent options
    for item, i, len in elements
      sb options.linefeed or "\n"
      sb.indent child-options.indent
      item.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb options.linefeed or "\n"
    sb.indent options.indent
  let compile-small(elements, options, level, line-start, sb)!
    for item, i in elements
      if i > 0
        sb ","
        if not options.minify
          sb " "
      item.compile options, Level.sequence, false, sb
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file(@pos.file)
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "["
    let f = if not options.minify and @should-compile-large() then compile-large else compile-small
    f(@elements, options, level, line-start, sb)
    sb "]"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  def compile-as-block(options, level, line-start, sb)
    BlockExpression(@pos, @elements).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    BlockStatement(@pos, @elements).compile(options, Level.block, line-start, sb)
  
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
    let elements = walk-array @elements, this, \element, walker
    if @elements != elements
      Arr @pos, elements
    else
      this
  
  def type-id = AstType.Arr
  def _to-ast(pos, ident) -> return for element in @elements
    element.to-ast(pos, ident)
  @_from-ast := #(pos, ...elements) -> Arr pos, elements
  def _to-JSON() -> simplify-array(@elements, 0)
  @from-JSON := #(line, column, file, ...elements) -> Arr make-pos(line, column, file), array-from-JSON(elements)

exports.Assign := #(pos, ...start, end)
  for reduce left in start by -1, right = end
    Binary pos, left, "=", right

exports.BinaryChain := #(pos, op, ...args)
  if op == "+"
    for i in args.length - 2 to 0 by -1
      let left = args[i]
      let right = args[i + 1]
      if (is-string! left or (left instanceof Const and is-string! left.value)) and (is-string! right or (right instanceof Const and is-string! right.value))
        args.splice i, 2, (if is-string! left then left else left.value) & (if is-string! right then right else right.value)
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

let is-negative(value as Number) -> value < 0 or value is -0

exports.Binary := class Binary extends Expression
  def constructor(@pos as {}, mutable @left = Noop(pos), @op as String, mutable @right = Noop(pos))
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(to-JS-source op)"
    
    if left not instanceof Expression
      left := to-const pos, left
    if right not instanceof Expression
      right := to-const pos, right
    
    if ASSIGNMENT_OPS ownskey op
      if left not instanceof Ident and not (left instanceof Binary and left.op == ".")
        throw Error "Cannot assign with $op to non-Ident or Access: $(typeof! left)"
      if left instanceof Binary
        if left.left instanceof BlockExpression
          return BlockExpression pos, [
            ...left.left.body[0 til -1]
            Binary@ this, pos, Binary(left.pos, left.left.body[* - 1], ".", left.right), op, right
          ]
      
      if right instanceof BlockExpression and (left instanceof Ident or (left.left.is-noop() and left.right.is-noop()))
        return BlockExpression pos, [
          ...right.body[0 til -1]
          Binary@ this, pos, left, op, right.body[* - 1]
        ]
    else if left instanceof BlockExpression and op != "."
      return BlockExpression pos, [
        ...left.body[0 til -1]
        Binary@ this, pos, left.body[* - 1], op, right
      ]
    
    @left := left
    @right := right
  
  let compile-access(op, left, right, options, level, line-start, sb)!
    let dot-access = right instanceof Const and is-string! right.value and is-acceptable-ident(right.value)
    let wrap = level > Level.call-or-access
    
    if wrap
      sb "("
    
    if left instanceof Const and is-number! left.value
      let string-left = to-JS-source left.value
      if is-negative(left.value) or not is-finite(left.value)
        sb "("
        sb string-left
        sb ")"
      else
        sb string-left
        if dot-access and string-left.index-of("e") == -1 and string-left.index-of(".") == -1
          sb "."
    else if left.is-const() and is-void! left.const-value()
      sb "("
      (if left instanceof Const then left else Const(left.pos, void)).compile options, Level.inside-parentheses, false, sb
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
    let spaced = not options.minify or r"^\w".test(op)
    if spaced
      sb " "
    sb op
    if spaced
      sb " "
    right.compile options, if associativity == "left" and right instanceof Binary and OPERATOR_PRECEDENCE[right.op] == op-level then op-level + 1 else op-level, false, sb
    if wrap
      sb ")"
  
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file(@pos.file)
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let f = if @op == "." then compile-access else compile-other
    f(@op, @left, @right, options, level, line-start, sb)
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def compile-as-block(options, level, line-start, sb)!
    if ASSIGNMENT_OPS ownskey @op or @op in [".", "&&", "||"]
      super.compile-as-block(options, level, line-start, sb)
    else
      BlockExpression(@pos, [@left, @right]).compile-as-block(options, level, line-start, sb)
  def compile-as-statement(options, line-start, sb)!
    let left = @left
    let op = @op
    if ASSIGNMENT_OPS ownskey op
      if left instanceof Ident and is-function! @right.to-statement and false
        @right.to-statement()
          .mutate-last((#(node)@ -> Binary @pos, left, op, node), { +noop })
          .compile-as-statement(options, line-start, sb)
      else
        super.compile-as-statement(options, line-start, sb)
    else if @op == "&&"
      IfStatement(@pos, @left, @right).compile-as-statement(options, line-start, sb)
    else if @op == "||"
      IfStatement(@pos, @left.invert(), @right).compile-as-statement(options, line-start, sb)
    else if op == "."
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
  def is-assign() -> ASSIGNMENT_OPS ownskey @op
  
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
  
  let inversions =
    "<": ">="
    "<=": ">"
    ">": "<="
    ">=": ">"
    "==": "!="
    "!=": "=="
    "===": "!=="
    "!==": "==="
  
  def invert()
    if inversions ownskey @op
      Binary @pos, @left, inversions[@op], @right
    else
      super.invert()
  
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
    @_is-noop ?= ASSIGNMENT_OPS not ownskey @op and @op != "." and @left.is-noop() and @right.is-noop()
  
  def walk(walker)
    let mutable changed = false
    let left = walker(@left, this, \left) ? @left.walk(walker)
    let right = walker(@right, this, \right) ? @right.walk(walker)
    if @left != left or @right != right
      Binary @pos, left, @op, right
    else
      this
  
  def type-id = AstType.Binary
  def _to-ast(pos, ident) -> [@left.to-ast(pos, ident), Const(pos, @op), @right.to-ast(pos, ident)]
  @_from-ast := #(pos, left, op, right) -> Binary pos, left, op, right
  def _to-JSON()
    let result = [simplify(@left, 0), @op]
    if simplify(@right)
      result.push ...@right.to-JSON()
    result
  @from-JSON := #(line, column, file, left, op, ...right) -> Binary make-pos(line, column, file), from-JSON(left), op, from-JSON(right)

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
    default
      @body := result
  
  def compile(options, level, mutable line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    let nodes = for node in @body
      if not node.is-noop()
        node
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let child-options = if @label? then inc-indent(options) else options
    
    let minify = options.minify
    
    if @label?
      @label.compile options, level, line-start, sb
      line-start := false
      sb ":"
      if not minify
        sb " "
      sb "{"
      if not minify
        sb options.linefeed or "\n"
        sb.indent child-options.indent
        line-start := true
    
    for item, i in nodes
      if i > 0 and not minify
        sb options.linefeed or "\n"
        sb.indent child-options.indent
        line-start := true
      item.compile-as-statement child-options, line-start, sb
      line-start := false
    
    if @label?
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let body = walk-array(@body, this, \node, walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker, this) else @label
    if @body != body or @label != label
      Block @pos, body, label
    else
      this
  
  def mutate-last(func, options)
    let last = @last()
    let new-last = last.mutate-last(func, options)
    if last != new-last
      let body = @body[0 til -1]
      body.push new-last
      Block @pos, body, @label
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[* - 1]
  
  def remove-trailing-return-voids()
    let last = @last()
    let new-last = last.remove-trailing-return-voids()
    if last != new-last
      let body = @body[0 til -1]
      body.push new-last
      Block @pos, body, @label
    else
      this
  
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def with-label(label as Ident|null)
    BlockStatement @pos, @body, label
  
  def type-id = AstType.BlockStatement
  def _to-ast(pos, ident) -> [
    if @label?
      @label.to-ast pos, ident
    else
      Const pos, 0
    ...for node in @body
      node.to-ast pos, ident
  ]
  @_from-ast := #(pos, label, ...nodes) -> BlockStatement pos, nodes, label or null
  def _to-JSON() -> [@label or 0, ...@body]
  @from-JSON := #(line, column, file, label, ...body) -> BlockStatement make-pos(line, column, file), array-from-JSON(body), if label then from-JSON(label) else null

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
    default
      @body := result
  
  def to-statement() -> BlockStatement @pos, @body
  
  def compile(options, level, line-start, sb)!
    if level == Level.block
      @to-statement().compile options, level, line-start, sb
    else
      let nodes = for node, i, len in @body
        if not node.is-noop() or i == len - 1
          node
      
      if options.source-map? and @pos.file
        options.source-map.push-file @pos.file
      options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      let inner-level = if wrap then Level.sequence else level
      for item, i, len in nodes
        if i > 0
          sb ","
          if not options.minify
            sb " "
        if i < len - 1
          item.compile-as-block options, inner-level, not wrap and i == 0, sb
        else
          item.compile options, inner-level, not wrap and i == 0, sb
      if wrap
        sb ")"
      if options.source-map? and @pos.file
        options.source-map.pop-file()
  
  def compile-as-block(options, level, line-start, sb)!
    if level == Level.block
      @compile options, level, line-start, sb
    else
      let nodes = for node, i, len in @body
        if not node.is-noop()
          node
      
      if options.source-map? and @pos.file
        options.source-map.push-file @pos.file
      options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inside-parentheses and nodes.length > 1
      if wrap
        sb "("
      for item, i in nodes
        if i > 0
          sb ", "
        item.compile-as-block options, if wrap then Level.sequence else level, false, sb
      if wrap
        sb ")"
      if options.source-map? and @pos.file
        options.source-map.pop-file()
  
  def is-large()
    @_is-large ?= @body.length > 4 or for some part in @body by -1; part.is-large()
  
  def is-small() -> false
  def is-noop() -> @_is-noop ?= for every node in @body by -1; node.is-noop()
  
  def walk = BlockStatement::walk
  def last() -> @body[* - 1]
  
  def with-label = BlockStatement::with-label
  
  def type-id = AstType.BlockExpression
  def _to-ast(pos, ident) -> return for node in @body
    node.to-ast pos, ident
  @_from-ast := #(pos, ...nodes) -> BlockExpression pos, nodes
  def _to-JSON() -> @body
  @from-JSON := #(line, column, file, ...body) -> BlockExpression make-pos(line, column, file), array-from-JSON(body)

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
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "break"
    if @label?
      sb " "
      @label.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.source-map? and @pos.file
      options.source-map.pop-file @pos.file
  
  def walk() -> this
  
  def exit-type() -> \break
  
  def walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if label != @label
      Break @pos, label
    else
      this
  
  def is-large() -> false
  
  def type-id = AstType.Break
  def _to-ast(pos, ident) -> if @label? then [@label.to-ast(pos, ident)] else []
  @_from-ast := #(pos, label) -> Break pos, label
  def _to-JSON() -> if @label? then [@label] else []
  @from-JSON := #(line, column, file, label) -> Break make-pos(line, column, file), if label then from-JSON(label) else null

exports.Call := class Call extends Expression
  def constructor(@pos as {}, @func as Expression = Noop(pos), @args as [Expression] = [], @is-new as Boolean) ->
  
  let compile-large(args, options, level, line-start, sb)!
    sb "("
    let child-options = inc-indent options
    for item, i, len in args
      sb options.linefeed or "\n"
      sb.indent child-options.indent
      item.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb options.linefeed or "\n"
    sb.indent options.indent
    sb ")"
  let compile-small(args, options, level, line-start, sb)!
    sb "("
    for arg, i in args
      if i > 0
        sb ","
        if not options.minify
          sb " "
      arg.compile options, Level.sequence, false, sb
    sb ")"
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let wrap = level > Level.call-or-access or (not @is-new and (@func instanceof Func or (@func instanceof Binary and @func.op == "." and @func.left instanceof Func)))
    if wrap
      sb "("
    if @is-new
      sb "new "
    @func.compile options, if @is-new then Level.new-call else Level.call-or-access, line-start and not wrap and not @is-new, sb
    let f = if not options.minify and @should-compile-large() then compile-large else compile-small
    f(@args, options, level, line-start, sb)
    if wrap
      sb ")"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
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
    let func = walker(@func, this, \func) ? @func.walk(walker)
    let args = walk-array(@args, this, \arg, walker)
    if @func != func or @args != args
      Call @pos, func, args, @is-new
    else
      this
  
  def type-id = AstType.Call
  def _to-ast(pos, ident) -> [
    @func.to-ast(pos, ident)
    Const pos, if @is-new then 1 else 0
    ...for arg in @args
      arg.to-ast(pos, ident)
  ]
  @_from-ast := #(pos, func, is-new, ...args) -> Call pos, func, args, not not is-new
  def _to-JSON() -> [simplify(@func, 0), if @is-new then 1 else 0, ...simplify-array(@args, 0)]
  @from-JSON := #(line, column, file, func, is-new, ...args) -> Call make-pos(line, column, file), from-JSON(func), array-from-JSON(args), not not is-new

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
        sb options.linefeed or "\n"
        if not options.minify
          sb.indent options.indent
      sb line
  
  def is-const() -> true
  def const-value() -> void
  def is-noop() -> false
  
  def walk() -> this
  
  def type-id = AstType.Comment
  def _to-ast(pos, ident) -> [Const pos, @text]
  @_from-ast := #(pos, text) -> Comment pos, text
  def _to-JSON() -> [@text]
  @from-JSON := #(line, column, file, text) -> Comment(make-pos(line, column, file), text)

exports.Const := class Const extends Expression
  def constructor(@pos as {}, @value as void|null|Boolean|Number|String) ->
  
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let value = @value
    if is-void! value and options.undefined-name?
      sb options.undefined-name
    else
      let wrap = level >= Level.increment and (is-void! value or (is-number! value and not is-finite(value)))
      if wrap
        sb "("
      sb to-JS-source(value)
      if wrap
        sb ")"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def is-const() -> true
  def is-noop = @::is-const
  def const-value() -> @value
  def is-large() -> is-string! @value and (@value.match(r"\n") or @value.length > 50)
  
  def inspect(depth) -> super.inspect(depth, true)
  
  def walk() -> this
  
  def type-id = AstType.Const
  def _to-ast(pos, ident)
    if @value == void
      []
    else
      [Const pos, @value]
  @_from-ast := #(pos, value) -> Const pos, value
  def _to-JSON()
    if is-number! @value and not is-finite(@value)
      [
        if @value > 0
          1
        else if @value < 0
          -1
        else
          0
        1
      ]
    else if @value == 0 and is-negative(@value)
      [
        0
        2
      ]
    else if is-undefined! @value
      []
    else
      [@value]
  @from-JSON := #(line, column, file, value, state)
    Const make-pos(line, column, file), if state == 1
      value / 0
    else if value == 0 and state == 2
      -0
    else
      value

exports.Continue := class Continue extends Statement
  def constructor(@pos as {}, @label as Ident|null) ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "continue"
    if @label?
      sb " "
      @label.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk() -> this
  
  def exit-type() -> \continue
  
  def is-large() -> false
  
  def walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if label != @label
      Continue @pop, label
    else
      this
  
  def type-id = AstType.Continue
  def _to-ast(pos, ident) -> if @label? then [@label.to-ast(pos, ident)] else []
  @_from-ast := #(pos, label) -> Continue pos, label
  def _to-JSON() -> if @label? then [@label] else []
  @from-JSON := #(line, column, file, label) -> Continue make-pos(line, column, file), if label then from-JSON(label) else null

exports.Debugger := class Debugger extends Statement
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "debugger;"
  
  def walk() -> this

  def is-large() -> false
  
  def type-id = AstType.Debugger
  @_from-ast := #(pos) -> Debugger pos
  @from-JSON := #(line, column, file) -> Debugger(make-pos(line, column, file))

exports.DoWhile := class DoWhile extends Statement
  def constructor(@pos as {}, body as Node = Noop(pos), @test as Expression = Noop(pos), @label as Ident|null)
    @body := body.maybe-to-statement()
    if test.is-const() and not test.const-value()
      return Block(pos, [@body], label)
  
  def with-label(label as Ident|null)
    DoWhile @pos, @body, @test, label
  
  def compile(options, level, mutable line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      line-start := false
      sb ":"
      if not minify
        sb " "
    sb "do"
    if @body.is-noop()
      sb ";"
    else
      if not minify
        sb " "
      sb "{"
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent + 1
        line-start := true
      @body.compile-as-statement inc-indent(options), line-start, sb
      line-start := false
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "}"
    if not minify
      sb " "
    sb "while"
    if not minify
      sb " "
    sb "("
    @test.compile options, Level.inside-parentheses, false, sb
    sb ");"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let body = walker(@body, this, \body) ? @body.walk(walker)
    let test = walker(@test, this, \test) ? @test.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if body != @body or test != @test or label != @label
      DoWhile @pos, body, test, label
    else
      this

  def type-id = AstType.DoWhile
  def _to-ast(pos, ident) -> [
    @test.to-ast(pos, ident)
    @body.to-ast(pos, ident)
    ...if @label?
      [@label.to-ast(pos, ident)]
    else
      []
  ]
  @_from-ast := #(pos, test, body, label) -> DoWhile pos, test, body, label
  def _to-JSON() -> [@label or 0, simplify(@test, 0), simplify(@body, 0)]
  @from-JSON := #(line, column, file, label, test, body) -> DoWhile make-pos(line, column, file), from-JSON(body), from-JSON(test), if label then from-JSON(label) else null

exports.Eval := class Eval extends Expression
  def constructor(@pos as {}, mutable code = Noop(pos))
    if code not instanceof Expression
      code := to-const pos, code
    @code := code
  
  def compile(options, level, line-start, sb)!  
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    if @code instanceof Const
      sb String(@code.value)
    else
      sb "eval("
      @code.compile options, Level.sequence, false, sb
      sb ")"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let code = walker(@code, this, \code) ? @code.walk(walker)
    if code != @code
      Eval @pops, code
    else
      this
  
  def is-large() -> @code.is-large()
  
  def type-id = AstType.Eval
  def _to-ast(pos, ident) -> [@code.to-ast(pos, ident)]
  @_from-ast := #(pos, code) -> Eval pos, code
  def _to-JSON() -> [simplify(@code, 0)]
  @from-JSON := #(line, column, file, code) -> Eval make-pos(line, column, file), from-JSON(code)

exports.For := class For extends Statement
  def constructor(@pos as {}, @init as Expression = Noop(pos), mutable test = Const(pos, true), @step as Expression = Noop(pos), body as Node, @label as Ident|null)
    if test not instanceof Expression
      test := to-const pos, test
    if test.is-const() and not test.const-value()
      return init
    @test := test
    @body := body.maybe-to-statement()
  
  def with-label(label as Ident|null)
    For @pos, @init, @test, @step, @body, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    let test = if @test.is-const() and not is-boolean! @test.const-value()
      Const(@pos, not not @test.const-value())
    else
      @test
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      sb ":"
      if not minify
        sb " "
    
    if @init.is-noop() and @step.is-noop()
      sb "while"
      if not minify
        sb " "
      sb "("
      test.compile options, Level.inside-parentheses, false, sb
    else
      sb "for"
      if not minify
        sb " "
      sb "("
      if not @init.is-noop()
        @init.compile-as-block options, Level.inside-parentheses, false, sb
      sb ";"
      if not minify
        sb " "
      if not test.is-const() or not test.const-value()
        test.compile options, Level.inside-parentheses, false, sb
      sb ";"
      if not minify
        sb " "
      if not @step.is-noop()
        @step.compile-as-block options, Level.inside-parentheses, false, sb
    sb ")"
    if @body.is-noop()
      sb ";"
    else
      if not minify
        sb " "
      sb "{"
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent + 1
      @body.compile-as-statement inc-indent(options), not minify, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let init = walker(@init, this, \init) ? @init.walk(walker)
    let test = walker(@test, this, \test) ? @test.walk(walker)
    let step = walker(@step, this, \step) ? @step.walk(walker)
    let body = walker(@body, this, \body) ? @body.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if init != @init or test != @test or step != @step or body != @body or label != @label
      For @pos, init, test, step, body, label
    else
      this
  
  def type-id = AstType.For
  def _to-ast(pos, ident) -> [
    @init.to-ast(pos, ident)
    @test.to-ast(pos, ident)
    @step.to-ast(pos, ident)
    @body.to-ast(pos, ident)
    ...if @label?
      [@label.to-ast(pos, ident)]
    else
      []
  ]
  @_from-ast := #(pos, init, test, step, body, label) -> For pos, init, test, step, body, label or null
  def _to-JSON()
    let result = [@label or 0, simplify(@init, 0), simplify(@test, 0), simplify(@step, 0)]
    if simplify(@body)
      result.push ...@body.to-JSON()
    result
  @from-JSON := #(line, column, file, label, init, test, step, ...body) -> For make-pos(line, column, file), from-JSON(init), from-JSON(test), from-JSON(step), from-JSON(body), if label then from-JSON(label) else null

exports.ForIn := class ForIn extends Statement
  def constructor(@pos as {}, @key as Ident, @object as Expression = Noop(pos), body as Node = Noop(pos), @label as Ident|null)
    @body := body.maybe-to-statement()
  
  def with-label(label as Ident|null)
    ForIn @pos, @key, @object, @body, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      sb ":"
      if not minify
        sb " "
    
    sb "for"
    if not minify
      sb " "
    sb "("
    @key.compile options, Level.inside-parentheses, false, sb
    sb " in "
    @object.compile options, Level.inside-parentheses, false, sb
    sb ")"
    if @body.is-noop()
      sb ";"
    else
      if not minify
        sb " "
      sb "{"
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent + 1
      @body.compile-as-statement inc-indent(options), not minify, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let key = walker(@key, this, \key) ? @key.walk(walker)
    let object = walker(@object, this, \object) ? @object.walk(walker)
    let body = walker(@body, this, \body) ? @body.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if key != @key or object != @object or body != @body or label != @label
      ForIn @pos, key, object, body
    else
      this
  
  def type-id = AstType.ForIn
  def _to-ast(pos, ident) -> [
    @key.to-ast(pos, ident)
    @object.to-ast(pos, ident)
    @body.to-ast(pos, ident)
    ...if @label?
      [@label.to-ast(pos, ident)]
    else
      []
  ]
  @_from-ast := #(pos, key, object, body, label) -> ForIn pos, key, object, body, label or null
  def _to-JSON()
    let result = [@label or 0, @key, simplify(@object, 0)]
    if simplify(@body)
      result.push ...@body.to-JSON()
    result
  @from-JSON := #(line, column, file, label, key, object, ...body) -> ForIn make-pos(line, column, file), from-JSON(key), from-JSON(object), from-JSON(body), if label then from-JSON(label) else null

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

let to-JS-ident = do
  let unicode-replacer(m)
    "\\u$(pad-left m.char-code-at(0).to-string(16), 4, '0')"
  #(name as String) as String
    name.replace r"[\u0000-\u001f\u0080-\uffff]"g, unicode-replacer

let compile-func-body(options, sb, declarations, variables, body, mutable line-start)!
  let minify = options.minify
  for declaration in declarations
    if not minify
      sb.indent options.indent
    sb to-JS-source(declaration)
    sb ";"
    line-start := false
    if not minify
      sb options.linefeed or "\n"
      line-start := true
  
  if variables.length > 0
    let mutable column = 0
    if not minify
      sb.indent options.indent
      column := 4 + INDENT.length * options.indent
    sb "var "
    for variable, i in variables.sort #(a, b) -> a.to-lower-case() <=> b.to-lower-case() or a <=> b
      let name = to-JS-ident(variables[i])
      if i > 0
        if minify
          sb ","
        else
          if column + 2 + name.length < VAR_LINE_LENGTH
            sb ", "
            column += 2
          else
            sb ","
            sb options.linefeed or "\n"
            sb.indent options.indent
            sb "    "
            column := 4 + INDENT.length * options.indent
      sb name
      column += name.length
    sb ";"
    line-start := false
    if not minify
      sb options.linefeed or "\n"
      line-start := true
  
  if not body.is-noop()
    if not minify
      sb.indent options.indent
    body.compile-as-statement options, line-start, sb
    if not minify
      sb options.linefeed or "\n"

let compile-func(options, sb, name, params, declarations, variables, body)
  sb "function"
  let minify = options.minify
  if not minify or name?
    sb " "
  if name?
    name.compile options, Level.inside-parentheses, false, sb
  sb "("
  for param, i in params
    if i > 0
      sb ","
      if not minify
        sb " "
    param.compile options, Level.inside-parentheses, false, sb
  sb ")"
  if not minify
    sb " "
  sb "{"
  if variables.length or declarations.length or not body.is-noop()
    if not minify
      sb options.linefeed or "\n"
    compile-func-body inc-indent(options), sb, declarations, variables, body, not minify
    if not minify
      sb.indent options.indent
  sb "}"

exports.Func := class Func extends Expression
  def constructor(@pos as {}, @name as null|Ident, @params as [Ident] = [], @variables as [String] = [], body as Node = Noop(pos), @declarations as [String] = [])
    validate-func-params-and-variables params, variables
    @body := body.remove-trailing-return-voids()
  
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let wrap = line-start and not @name
    if wrap
      sb "("
    compile-func options, sb, @name, @params, @declarations, @variables, @body
    if wrap
      sb ")"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def compile-as-statement(options, line-start, sb)!
    @compile options, Level.block, line-start, sb
    // TODO: there's bound to be an issue with minify and line-start and using that as whether or not to add a semicolon
    unless line-start and @name
      sb ";"
  
  def is-large() -> true
  def is-noop() -> not @name?
  
  def walk(walker)
    let name = if @name then walker(@name, this, \name) ? @name.walk(walker) else @name
    let params = walk-array(@params, this, \param, walker)
    let body = walker(@body, this, \body) ? @body.walk(walker)
    if name != @name or params != @params or body != @body
      Func @pos, name, params, @variables, body, @declarations, @meta
    else
      this
  
  def type-id = AstType.Func
  def _to-ast(pos, ident) -> [
    if @name
      @name.to-ast(pos, ident)
    else
      Const pos, 0
    if @params.length
      Arr pos, for param in @params
        param.to-ast(pos, ident)
    else
      Const pos, 0
    if @variables.length
      Arr pos, for variable in @variables
        Const pos, variable
    else
      Const pos, 0
    @body.to-ast(pos, ident)
    ...for declaration in @declarations
      Const pos, declaration
  ]
  @_from-ast := #(pos, name, params, variables, body, ...declarations)
    Func pos, name or null, params or [], variables or [], body, ...declarations
  def _to-JSON()
    let result = [@name or 0, simplify-array(@params, 0), simplify-array(@variables, 0), simplify-array(@declarations, 0)]
    if simplify(@body)
      result.push ...@body.to-JSON()
    result
  @from-JSON := #(line, column, file, name, params, variables, declarations, ...body)
    Func make-pos(line, column, file), (if name then from-JSON(name)), array-from-JSON(params), variables, from-JSON(body), declarations

exports.Ident := class Ident extends Expression
  def constructor(@pos as {}, @name as String, allow-unacceptable as Boolean)
    unless allow-unacceptable or is-acceptable-ident name, true
      throw Error "Not an acceptable identifier name: $name"
  
  
  def compile(options, level, line-start, sb)!
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb to-JS-ident @name
  
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def walk() -> this
  
  def is-noop() -> true
  
  def type-id = AstType.Ident
  def _to-ast(pos, ident) -> [Const pos, @name]
  @_from-ast := #(pos, name) -> Ident pos, name, true
  def _to-JSON() -> [@name]
  @from-JSON := #(line, column, file, name) -> Ident make-pos(line, column, file), name, true

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
          return IfStatement@ this, pos, test.invert(), when-false, when-true, label
      else if when-false instanceof Noop and when-true instanceof IfStatement and when-true.when-false instanceof Noop and not when-true.label?
        return IfStatement@ this, pos, Binary(pos, test, "&&", when-true.test), when-true.when-true, when-false
      else if test instanceof BlockExpression
        return BlockStatement pos, [
          ...test.body[0 til -1]
          IfStatement@ this, pos, test.body[* - 1], when-true, when-false
        ]
    @test := test
    @when-true := when-true
    @when-false := when-false
  
  def with-label(label as Ident|null)
    IfStatement @pos, @test, @when-true, @when-false, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if @when-true.is-noop()
      if @when-false.is-noop()
        @test.compile-as-statement options, true, sb
      else
        IfStatement(@pos, @test.invert(), @when-false, @when-true, @label).compile(options, level, line-start, sb)
    else
      if options.source-map? and @pos.file
        options.source-map.push-file @pos.file
      options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
      let minify = options.minify
      if @label?
        @label.compile options, level, line-start, sb
        sb ":"
        if not minify
          sb " "
      sb "if"
      if not minify
        sb " "
      sb "("
      @test.compile options, Level.inside-parentheses, false, sb
      sb ")"
      if not minify
        sb " "
      sb "{"
      let child-options = inc-indent options
      if not minify
        sb options.linefeed or "\n"
        sb.indent child-options.indent
      @when-true.compile-as-statement child-options, not minify, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "}"
      let when-false = @when-false
      if not when-false.is-noop()
        if not minify
          sb " "
        sb "else"
        if when-false instanceof IfStatement and not when-false.label?
          sb " "
          when-false.compile options, level, false, sb
        else
          if not minify
            sb " "
          sb "{"
          if not minify
            sb options.linefeed or "\n"
            sb.indent child-options.indent
          when-false.compile-as-statement child-options, not minify, sb
          if not minify
            sb options.linefeed or "\n"
            sb.indent options.indent
          sb "}"
      if options.source-map? and @pos.file
        options.source-map.pop-file()
        
  def walk(walker)
    let test = walker(@test, this, \test) ? @test.walk walker
    let when-true = walker(@when-true, this, \when-true) ? @when-true.walk walker
    let when-false = walker(@when-false, this, \when-false) ? @when-false.walk walker
    let label = if @label? then walker(@label, this, \label) ? @label.walk walker else @label
    
    if test != @test or when-true != @when-true or when-false != @when-false or label != @label
      If @pos, test, when-true, when-false, label
    else
      this
  
  def mutate-last(func, options)
    let when-true = @when-true.mutate-last(func, options)
    let when-false = @when-false.mutate-last(func, options)
    if when-true != @when-true or when-false != @when-false
      If @pos, @test, when-true, when-false, @label
    else
      this
  
  def exit-type()
    if is-void! @_exit-type
      let true-exit = @when-true.exit-type()
      let false-exit = @when-false.exit-type()
      @_exit-type := if true-exit == false-exit
        true-exit
      else
        null
    else
      @_exit-type
  
  def remove-trailing-return-voids()
    let when-true = @when-true.remove-trailing-return-voids()
    let when-false = @when-false.remove-trailing-return-voids()
    if when-true != @when-true or when-false != @when-false
      If @pos, @test, when-true, when-false, @label
    else
      this
  
  def is-noop() -> @_is-noop ?= @test.is-noop() and @when-true.is-noop() and @when-false.is-noop()
  
  def type-id = AstType.IfStatement
  def _to-ast(pos, ident)
    let result = [
      @test.to-ast(pos, ident)
      @when-true.to-ast(pos, ident)
    ]
    if @when-false not instanceof Noop or @label
      result.push @when-false.to-ast(pos, ident)
    if @label
      result.push @label.to-ast(pos, ident)
    result
  @_from-ast := #(pos, test, when-true, when-false, label)
    IfStatement pos, test, when-true, when-false, label
  def _to-JSON()
    let result = [@label or 0, simplify(@test, 0), simplify(@when-true, 0)]
    if simplify(@when-false)
      result.push ...@when-false.to-JSON()
    result
  @from-JSON := #(line, column, file, label, test, when-true, ...when-false) -> IfStatement make-pos(line, column, file), from-JSON(test), from-JSON(when-true), from-JSON(when-false), if label then from-JSON(label) else null

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
  
  def with-label = IfStatement::with-label
  
  def to-statement() -> IfStatement @pos, @test, @when-true, @when-false
  
  let compile-small(test, when-true, when-false, options, line-start, sb)!
    let minify = options.minify
    test.compile options, Level.inline-condition, line-start, sb
    sb (if minify then "?" else " ? ")
    when-true.compile options, Level.inline-condition, false, sb
    sb (if minify then ":" else " : ")
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
      sb options.linefeed or "\n"
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
    sb options.linefeed or "\n"
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
      if options.source-map? and @pos.file
        options.source-map.push-file @pos.file
      options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
      let wrap = level > Level.inline-condition
      if wrap
        sb "("
      let f = if not options.minify and (@when-true.is-large() or @when-false.is-large()) then compile-large else compile-small
      f @test, @when-true, @when-false, options, not wrap and line-start, sb
      if wrap
        sb ")"
      if options.source-map? and @pos.file
        options.source-map.pop-file()
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
  
  def type-id = AstType.IfExpression
  def _to-ast(pos, ident)
    let result = [
      @test.to-ast(pos, ident)
      @when-true.to-ast(pos, ident)
    ]
    if @when-false not instanceof Noop
      result.push @when-false.to-ast(pos, ident)
    result
  @_from-ast := #(pos, test, when-true, when-false)
    IfExpression pos, test, when-true, when-false
  def _to-JSON()
    let result = [simplify(@test, 0), simplify(@when-true, 0)]
    if simplify(@when-false)
      result.push ...@when-false.to-JSON()
    result
  @from-JSON := #(line, column, file, test, when-true, ...when-false) -> IfExpression make-pos(line, column, file), from-JSON(test), from-JSON(when-true), from-JSON(when-false)

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
  def mutate-last(func, options)
    if options?.noop
      func(this)
    else
      this
  
  def type-id = AstType.Noop
  @_from-ast := #(pos) -> Noop pos
  @from-JSON := #(line, column, file) -> Noop make-pos(line, column, file)

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
    if is-acceptable-ident(key) or (String(Number(key)) == key and Number(key) >= 0)
      key
    else
      to-JS-source key
  
  let compile-large(elements, options, sb)!
    let child-options = inc-indent options
    for element, i, len in elements
      sb options.linefeed or "\n"
      sb.indent child-options.indent
      let {key} = element
      sb to-safe-key key
      sb ": "
      element.value.compile child-options, Level.sequence, false, sb
      if i < len - 1
        sb ","
    sb options.linefeed or "\n"
    sb.indent options.indent
  
  let compile-small(elements, options, sb)!
    if elements.length
      let minify = options.minify
      if not minify
        sb " "
      for element, i in elements
        if i > 0
          sb ","
          if not minify
            sb " "
        let {key} = element
        sb to-safe-key key
        sb ":"
        if not minify
          sb " "
        element.value.compile options, Level.sequence, false, sb
      if not minify
        sb " "
  
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let wrap = line-start // TODO: this might be wrong if immediately following a semicolon but not at the start of a line (as in minify)
    if wrap
      sb "("
    sb "{"
    let f = if not options.minify and @should-compile-large() then compile-large else compile-small
    f @elements, options, sb
    sb "}"
    if wrap
      sb ")"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
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
    let mutable changed = false
    let pairs = for pair in @elements
      let value = walker(pair.value, this, \element) ? pair.value.walk walker
      if value != pair.value
        changed := true
        ObjPair pair.pos, pair.key, value
      else
        pair
    
    if changed
      Obj @pos, pairs
    else
      this
  
  def type-id = AstType.Obj
  def _to-ast(pos, ident)
    let result = []
    for pair in @elements
      let pair-pos = pair.pos
      result.push Const pos, pair-pos.line
      result.push Const pos, pair-pos.column
      result.push Const pos, pair-pos.file
      result.push Const pos, pair.key
      result.push pair.value.to-ast(pos, ident)
    result
  @_from-ast := #(pos, ...element-data)
    let result-pairs = []
    for i in 0 til element-data.length by 5
      result-pairs.push ObjPair make-pos(element-data[i], element-data[i + 1], element-data[i + 2]),
        element-data[i + 3]
        element-data[i + 4]
    Obj pos, result-pairs
  def _to-JSON()
    let result = []
    for pair in @elements
      let pos = pair.pos
      result.push pos.line, pos.column, pos.file, pair.key, simplify(pair.value)
    result
  @from-JSON := #(line, column, file, ...element-data)
    let result-pairs = []
    for i in 0 til element-data.length by 5
      let p-line = element-data[i]
      let p-column = element-data[i + 1]
      let p-file = element-data[i + 2]
      let key = element-data[i + 3]
      let value = element-data[i + 4]
      result-pairs.push ObjPair make-pos(p-line, p-column, p-file), key, from-JSON(value)
    Obj make-pos(line, column, file), result-pairs
  
  Obj.Pair := class ObjPair
    def constructor(@pos as {}, @key as String, mutable value = Noop(pos))
      if value not instanceof Expression
        value := to-const pos, value
      @value := value
    
    def is-small() -> @value.is-small()
    def is-large() -> @value.is-large()
    def is-noop() -> @value.is-noop()
    def walk(walker)
      let value = walker(@value, this, \value) ? @value.walk(walker)
      if value != @value
        ObjPair @pos, @key, value
      else
        this
    
    def inspect = Node::inspect

exports.Regex := class Regex extends Expression
  def constructor(@pos as {}, @source as String, @flags as String = "") ->

  def compile(options, level, line-start, sb)!
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "/"
    sb @source.replace(r"(\\\\)*\\?/"g, "\$1\\/") or "(?:)"
    sb "/"
    sb @flags
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)

  def is-noop() -> true
  
  def walk() -> this

  def type-id = AstType.Regex
  def _to-ast(pos, ident) -> [
    Const pos, @source
    ...if @flags != ""
      [Const pos, @flags]
    else
      []
  ]
  @_from-ast := #(pos, source, flags) -> Regex pos, source, flags or ""
  def _to-JSON() -> [@source, @flags]
  @from-JSON := #(line, column, file, source, flags) -> Regex make-pos(line, column, file), source, flags

exports.Return := class Return extends Statement
  def constructor(@pos as {}, @node as Expression = Noop(pos))
    if is-function! node.to-statement
      return node.to-statement().mutate-last (#(n) -> Return pos, n), { +noop }
  
  def compile(options, level, line-start, sb)!
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "return"
    unless @node.is-const() and is-void! @node.const-value()
      sb " "
      @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let node = walker(@node, this, \node) ? @node.walk(walker)
    if node != @node
      Return @pos, node
    else
      this
  
  def exit-type() -> \return
  
  def remove-trailing-return-voids()
    if @node.is-const() and @node.const-value() == void
      Noop @pos
    else
      this
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def mutate-last(func, options)
    if options?.return
      let node = @node.mutate-last(func, options)
      if node != @node
        Return @pos, node
      else
        this
    else
      this

  def type-id = AstType.Return
  def _to-ast(pos, ident)
    if @node.is-const() and @node.const-value() == void
      []
    else
      [@node.to-ast(pos, ident)]
  @_from-ast := #(pos, node) -> Return pos, node
  def _to-JSON()
    if simplify(@node)
      @node.to-JSON()
    else
      []
  @from-JSON := #(line, column, file, ...node) -> Return make-pos(line, column, file), from-JSON(node)

exports.Root := class Root
  def constructor(@pos as {}, @body as Node = Noop(pos), @variables as [String] = [], @declarations as [String] = [])
    validate-func-params-and-variables [], variables

  def compile(options = {})
    if not options.indent
      options.indent := 0
    
    let writer = if not options.uglify and is-function! options.writer then options.writer
    let mutable sb = if writer then StringWriter(writer) else StringBuilder()
    let start-time = new Date().get-time()
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    compile-func-body(options, sb, @declarations, @variables, @body, true)
    if options.source-map? and @pos.file
      options.source-map.pop-file()
    let end-compile-time = new Date().get-time()
    options.progress?(\compile, end-compile-time - start-time)
    let mutable end-uglify-time = 0
    if not writer?
      let mutable code = sb.to-string()
      if options.uglify
        let mutable tmp-map = void
        let fs = require("fs")
        if options.source-map?
          let path = require("path")
          let os = require("os")
          tmp-map := path.join(os.tmp-dir(), "gs-$(Math.random() * 2^32).map")
          fs.write-file-sync(tmp-map, options.source-map.to-string(), "utf8")
        let UglifyJS = require("uglify-js")
        let old-warn_function = UglifyJS.AST_Node?.warn_function
        if is-function! old-warn_function
          UglifyJS.AST_Node.warn_function := #->
        let minified = UglifyJS.minify(code, from-string: true, in-source-map: tmp-map, out-source-map: options.source-map?.generated-file)
        if old-warn_function?
          UglifyJS.AST_Node.warn_function := old-warn_function
        if tmp-map?
          fs.unlink-sync tmp-map
        code := minified.code
        end-uglify-time := new Date().get-time()
        options.progress?(\uglify, end-uglify-time - end-compile-time)
        if options.source-map?
          options.source-map := minified.map
      if is-function! options.writer
        options.writer(code)
        code := ""
    sb := null
    {
      compile-time: end-compile-time - start-time
      uglify-time: if options.uglify then end-uglify-time - end-compile-time
      code: code or ""
    }
  
  def to-string(options = {}) -> @compile(options).code
  
  def is-large() -> true
  
  def walk(walker)
    let body = walker(@body, this, \body) ? @body.walk(walker)
    if body != @body
      Root @pos, body, @variables, @declarations
    else
      this
  
  def mutate-last(func, options)
    let body = @body.mutate-last func, options
    if body != @body
      Root @pos, body, @variables, @declarations
    else
      this
  
  def exit-type() -> @last().exit-type()
  def last() -> @body[* - 1]
  
  def remove-trailing-return-voids()
    let body = @body.remove-trailing-return-voids()
    if body != @body
      Root @pos, body, @variables, @declarations
    else
      this
  
  def inspect = Node::inspect
  
  def type-id = AstType.Root
  def _to-ast(pos, ident) -> [
    if @declarations.length
      Arr pos, for declaration in @declarations
        Const pos, declaration
    else
      Const pos, 0
    if @variables.length
      Arr pos, for variable in @variables
        Const pos, variable
    else
      Const pos, 0
    @body.to-ast(pos, ident)
  ]
  @_from-ast := #(pos, declarations, variables, body) -> Root pos, body, variables or [], declarations or []
  def _to-JSON()
    let result = [simplify-array(@variables, 0), simplify-array(@declarations, 0)]
    if simplify(@body)
      result.push ...@body.to-JSON()
    result
  @from-JSON := #(line, column, file, variables, declarations, ...body) -> Root make-pos(line, column, file), from-JSON(body), variables, declarations

exports.This := class This extends Expression
  def constructor(@pos as {}) ->
  
  def compile(options, level, line-start, sb)!
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column, @pos.file)
    sb "this"
  def compile-as-block(options, level, line-start, sb)!
    Noop(@pos).compile-as-block(options, level, line-start, sb)
  
  def is-noop() -> true
  
  def walk() -> this
  
  def type-id = AstType.This
  @_from-ast := #(pos) -> This pos
  @from-JSON := #(line, column, file) -> This(make-pos(line, column, file))

exports.Throw := class Throw extends Statement
  def constructor(@pos as {}, @node as Expression = Noop(pos))
    if is-function! node.to-statement
      return node.to-statement().mutate-last (#(n)@ -> Throw @pos, n), { +noop }
  
  def compile(options, level, line-start, sb)
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    sb "throw "
    @node.compile options, Level.inside-parentheses, false, sb
    sb ";"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let node = walker(@node, this, \node) ? @node.walk(walker)
    if node != @node
      Throw @pos, node
    else
      this
  
  def exit-type() -> \throw
  
  def is-small() -> @node.is-small()
  def is-large() -> @node.is-large()
  
  def type-id = AstType.Throw
  def _to-ast(pos, ident)
    [@node.to-ast(pos, ident)]
  @_from-ast := #(pos, node) -> Throw pos, node
  def _to-JSON()
    if simplify(@node)
      @node.to-JSON()
    else
      []
  @from-JSON := #(line, column, file, ...node) -> Throw make-pos(line, column, file), from-JSON(node)

exports.Switch := class Switch extends Statement
  def constructor(@pos as {}, mutable node = Noop(pos), @cases as [SwitchCase] = [], default-case as Node = Noop(pos), @label as Ident|null)
    if node not instanceof Expression
      node := to-const pos, node
    @node := node
    @default-case := default-case.maybe-to-statement()
  
  def with-label(label as Ident|null)
    Switch @pos, @node, @cases, @default-case, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      sb ":"
      if not minify
        sb " "
    sb "switch"
    if not minify
      sb " "
    sb "("
    @node.compile options, Level.inside-parentheses, false, sb
    sb ")"
    if not minify
      sb " "
    sb "{"
    let child-options = inc-indent options
    for case_ in @cases
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "case "
      case_.node.compile options, Level.inside-parentheses, false, sb
      sb ":"
      if not case_.body.is-noop()
        if case_.node.is-small() and case_.body.is-small()
          if not minify
            sb " "
          case_.body.compile-as-statement options, true, sb
        else
          if not minify
            sb options.linefeed or "\n"
            sb.indent child-options.indent
          case_.body.compile-as-statement child-options, true, sb
    if not @default-case.is-noop()
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb "default:"
      if @default-case.is-small()
        if not minify
          sb " "
        @default-case.compile-as-statement options, true, sb
      else
        if not minify
          sb options.linefeed or "\n"
          sb.indent child-options.indent
        @default-case.compile-as-statement child-options, true, sb
    if not minify
      sb options.linefeed or "\n"
      sb.indent options.indent
    sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let node = walker(@node, this, \node) ? @node.walk(walker)
    let mutable cases-changed = false
    let cases = for case_ in @cases
      let case-node = walker(case_.node, this, \case-node) ? case_.node.walk(walker)
      let case-body = walker(case_.body, this, \case-body) ? case_.body.walk(walker)
      if case-node != case_.node or case-body != case_.body
        cases-changed := true
        SwitchCase case_.pos, case-node, case-body
      else
        case_
    let default-case = walker(@default-case, this, \default-case) ? @default-case.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if node != @node or cases-changed or default-case != @default-case or label != @label
      Switch @pos, node, cases, default-case, label
    else
      this
  
  def type-id = AstType.Switch
  def _to-ast(pos, ident)
    let result = [
      if @label
        @label.to-ast(pos, ident)
      else
        Const pos, 0
      @node.to-ast(pos, ident)
    ]
    for case_ in @cases
      result.push Const pos, case_.pos.line
      result.push Const pos, case_.pos.column
      result.push Const pos, case_.pos.file or 0
      result.push case_.node.to-ast(pos, ident)
      result.push case_.body.to-ast(pos, ident)
    if @default-case not instanceof Noop
      result.push @default-case.to-ast(pos, ident)
    result
  @_from-ast := #(pos, label, node, ...case-data)
    let mutable len = case-data.length
    let mutable default-case = void
    switch len % 5
    case 0
      void
    case 1
      len -= 1
      default-case := case-data[len]
    default
      throw Error "Unknown number of arguments passed to _fromAst"
    let result-cases = []
    for i in 0 til len by 5
      result-cases.push SwitchCase make-pos(case-data[i], case-data[i + 1], case-data[i + 2]),
        case-data[i + 3]
        case-data[i + 4]
    Switch pos, node, result-cases, default-case, label or null
  
  def _to-JSON()
    let result = [@label or 0, simplify(@node, 0)]
    for case_ in @cases
      result.push case_.pos.line, case_.pos.column, case_.pos.file, simplify(case_.node, 0), simplify(case_.body, 0)
    if @default-case not instanceof Noop
      result.push simplify(@default-case, 0)
    result
  @from-JSON := #(line, column, file, label, node, ...case-data)
    let mutable len = case-data.length
    let mutable default-case = void
    switch len % 5
    case 0
      void
    case 1
      len -= 1
      default-case := case-data[len]
    default
      throw Error "Unknown number of arguments passed to fromJSON"
    let result-cases = []
    for i in 0 til len by 5
      let c-line = case-data[i]
      let c-column = case-data[i + 1]
      let c-file = case-data[i + 2]
      let c-node = case-data[i + 3]
      let c-body = case-data[i + 4]
      result-cases.push SwitchCase make-pos(c-line, c-column, c-file), from-JSON(c-node), from-JSON(c-body)
    Switch make-pos(line, column, file), from-JSON(node), result-cases, from-JSON(default-case), if label then from-JSON(label) else null
  
  Switch.Case := class SwitchCase
    def constructor(@pos as {}, mutable node = Noop(pos), body as Node = Noop(pos))
      if node not instanceof Expression
        node := to-const pos, node
      @node := node
      @body := body.maybe-to-statement()
    
    def is-large() -> true
    def is-small() -> false
    
    def walk(walker)
      let node = walker(@node, this, \node) ? @node.walk(walker)
      let body = walker(@body, this, \body) ? @body.walk(walker)
      if node != @node or body != @body
        SwitchCase @pos, node, body
      else
        this
    
    def inspect = Node::inspect

exports.TryCatch := class TryCatch extends Statement
  def constructor(@pos as {}, try-body as Node = Noop(pos), @catch-ident as Ident, catch-body as Node = Noop(pos), @label as Ident|null)
    @try-body := try-body.maybe-to-statement()
    if @try-body.is-noop()
      return @try-body
    @catch-body := catch-body.maybe-to-statement()
  
  def with-label(label as Ident|null)
    TryCatch @pos, @try-body, @catch-ident, @catch-body, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      sb ":"
      if not minify
        sb " "
    if minify
      sb "try{"
    else
      sb "try {"
      sb options.linefeed or "\n"
    let child-options = inc-indent options
    if not minify
      sb.indent child-options.indent
    @try-body.compile-as-statement child-options, true, sb
    if not minify
      sb options.linefeed or "\n"
      sb.indent options.indent
    sb (if minify then "}catch(" else "} catch (")
    @catch-ident.compile options, Level.inside-parentheses, false, sb
    sb (if minify then "){" else ") {")
    if not @catch-body.is-noop()
      if not minify
        sb options.linefeed or "\n"
        sb.indent child-options.indent
      @catch-body.compile-as-statement child-options, true, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
    sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let try-body = walker(@try-body, this, \try-body) ? @try-body.walk(walker)
    let catch-ident = walker(@catch-ident, this, \catch-ident) ? @catch-ident.walk(walker)
    let catch-body = walker(@catch-body, this, \catch-body) ? @catch-body.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if try-body != @try-body or catch-ident != @catch-ident or catch-body != @catch-body or label != @label
      TryCatch @pos, try-body, catch-ident, catch-body, label
    else
      this
  
  def remove-trailing-return-voids()
    let try-body = @try-body.remove-trailing-return-voids()
    let catch-body = @catch-body.remove-trailing-return-voids()
    if try-body != @try-body or catch-body != @catch-body
      TryCatch @pos, try-body, @catch-ident, catch-body, @label
    else
      this
  
  def type-id = AstType.TryCatch
  def _to-ast(pos, ident) -> [
    @try-body.to-ast(pos, ident)
    @catch-ident.to-ast(pos, ident)
    @catch-body.to-ast(pos, ident)
    ...if @label
      [@label.to-ast(pos, ident)]
    else
      []
  ]
  @_from-ast := #(pos, try-body, catch-ident, catch-body, label)
    TryCatch pos, try-body, catch-ident, catch-body, label
  def _to-JSON()
    let result = [@label or 0, simplify(@try-body, 0), @catch-ident]
    if simplify(@catch-body)
      result.push ...@catch-body.to-JSON()
    result
  @from-JSON := #(line, column, file, label, try-body, catch-ident, ...catch-body) -> TryCatch make-pos(line, column, file), from-JSON(try-body), from-JSON(catch-ident), from-JSON(catch-body), if label then from-JSON(label) else null

exports.TryFinally := class TryFinally extends Statement
  def constructor(@pos as {}, try-body as Node = Noop(pos), finally-body as Node = Noop(pos), @label as Ident|null)
    @try-body := try-body.maybe-to-statement()
    @finally-body := finally-body.maybe-to-statement()
    if not label?
      if @try-body.is-noop()
        return @finally-body
      else if @finally-body.is-noop()
        return @try-body
  
  def with-label(label as Ident|null)
    TryFinally @pos, @try-body, @finally-body, label
  
  def compile(options, level, line-start, sb)!
    if level != Level.block
      throw Error "Cannot compile a statement except on the Block level"
    
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    let minify = options.minify
    if @label?
      @label.compile options, level, line-start, sb
      sb ":"
      if not minify
        sb " "
    if minify
      sb "try{"
    else
      sb "try {"
      sb options.linefeed or "\n"
    let child-options = inc-indent(options)
    if not minify
      sb.indent child-options.indent
    if @try-body instanceof TryCatch and not @try-body.label?
      @try-body.try-body.compile-as-statement child-options, true, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
      sb (if minify then "}catch(" else "} catch (")
      @try-body.catch-ident.compile options, Level.inside-parentheses, false, sb
      sb (if minify then "){" else ") {")
      if not @try-body.catch-body.is-noop()
        if not minify
          sb options.linefeed or "\n"
          sb.indent child-options.indent
        @try-body.catch-body.compile-as-statement child-options, true, sb
        if not minify
          sb options.linefeed or "\n"
          sb.indent options.indent
    else
      @try-body.compile-as-statement child-options, true, sb
      if not minify
        sb options.linefeed or "\n"
        sb.indent options.indent
    if minify
      sb "}finally{"
    else
      sb "} finally {"
      sb options.linefeed or "\n"
    if not minify
      sb.indent child-options.indent
    @finally-body.compile-as-statement child-options, true, sb
    if not minify
      sb options.linefeed or "\n"
      sb.indent options.indent
    sb "}"
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
  def walk(walker)
    let try-body = walker(@try-body, this, \try-body) ? @try-body.walk(walker)
    let finally-body = walker(@finally-body, this, \finally-body) ? @finally-body.walk(walker)
    let label = if @label? then walker(@label, this, \label) ? @label.walk(walker) else @label
    if try-body != @try-body or finally-body != @finally-body or label != @label
      TryFinally @pos, try-body, finally-body, label
    else
      this
  
  def remove-trailing-return-voids()
    let try-body = @try-body.remove-trailing-return-voids()
    let finally-body = @finally-body.remove-trailing-return-voids()
    if try-body != @try-body or finally-body != @finally-body
      TryFinally @pos, try-body, finally-body, @label
    else
      this
  
  def type-id = AstType.TryFinally
  def _to-ast(pos, ident) -> [
    @try-body.to-ast(pos, ident)
    @finally-body.to-ast(pos, ident)
    ...if @label
      [@label.to-ast(pos, ident)]
    else
      []
  ]
  @_from-ast := #(pos, try-body, finally-body, label)
    TryFinally pos, try-body, finally-body, label
  def _to-JSON()
    let result = [@label or 0, simplify(@try-body, 0)]
    if simplify(@finally-body)
      result.push ...@finally-body.to-JSON()
    result
  @from-JSON := #(line, column, file, label, try-body, ...finally-body) -> TryFinally make-pos(line, column, file), from-JSON(try-body), from-JSON(finally-body), if label then from-JSON(label) else null

exports.Unary := class Unary extends Expression
  def constructor(@pos as {}, @op as String, mutable node = Noop(pos))
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if node not instanceof Expression
      node := to-const line, column, node

    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    @node := node
  
  def compile(options, level, line-start, sb)!
    let op = @op
    if options.source-map? and @pos.file
      options.source-map.push-file @pos.file
    options.source-map?.add(sb.line, sb.column, @pos.line, @pos.column)
    if op in ["++post", "--post"]
      @node.compile options, Level.unary, false, sb
      sb op.substring(0, 2)
    else
      sb op
      if op in ["typeof", "void", "delete"] or (op in ["+", "-", "++", "--"] and ((@node instanceof Unary and op in ["+", "-", "++", "--"]) or (@node instanceof Const and is-number! @node.value and is-negative(@node.value))))
        sb " "
      @node.compile options, Level.unary, false, sb
    if options.source-map? and @pos.file
      options.source-map.pop-file()
  
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
  
  def invert()
    if @op == "!" and @node instanceof Unary and @node.op == "!"
      @node
    else
      super.invert()
  
  def is-large() -> @node.is-large()
  def is-small() -> @node.is-small()
  
  def is-assign() -> ASSIGNMENT_OPERATORS ownskey @op
  
  def is-noop()
    @_is-noop ?= ASSIGNMENT_OPERATORS not ownskey @op and @node.is-noop()
  
  def walk(walker)
    let node = walker(@node, this, \node) ? @node.walk(walker)
    if node != @node
      Unary(@pos, @op, node)
    else
      this
  
  def type-id = AstType.Unary
  def _to-ast(pos, ident) -> [
    Const pos, @op
    @node.to-ast(pos, ident)
  ]
  @_from-ast := #(pos, op, node)
    Unary pos, op, node
  def _to-JSON()
    let result = [@op]
    if simplify(@node)
      result.push ...@node.to-JSON()
    result
  @from-JSON := #(line, column, file, op, ...node) -> Unary make-pos(line, column, file), op, from-JSON(node)

let While = exports.While := #(pos, test, body, label)
  For(pos, null, test, null, body, label)

let AstType-to-class = {
  [AstType.Arguments]: Arguments
  [AstType.Arr]: Arr
  [AstType.Binary]: Binary
  [AstType.BlockStatement]: BlockStatement
  [AstType.BlockExpression]: BlockExpression
  [AstType.Break]: Break
  [AstType.Call]: Call
  [AstType.Comment]: Comment
  [AstType.Const]: Const
  [AstType.Continue]: Continue
  [AstType.Debugger]: Debugger
  [AstType.DoWhile]: DoWhile
  [AstType.Eval]: Eval
  [AstType.For]: For
  [AstType.ForIn]: ForIn
  [AstType.Func]: Func
  [AstType.Ident]: Ident
  [AstType.IfStatement]: IfStatement
  [AstType.IfExpression]: IfExpression
  [AstType.Noop]: Noop
  [AstType.Obj]: Obj
  [AstType.Regex]: Regex
  [AstType.Return]: Return
  [AstType.Root]: Root
  [AstType.This]: This
  [AstType.Throw]: Throw
  [AstType.Switch]: Switch
  [AstType.TryCatch]: TryCatch
  [AstType.TryFinally]: TryFinally
  [AstType.Unary]: Unary
}

exports.by-type-id := #(type-id as Number, line as Number, column as Number, file, ...args)
  AstType-to-class[type-id]._from-ast(make-pos(line, column, file), ...args)

let from-JSON = exports.from-JSON := #(obj)
  if not obj
    return Noop(make-pos(0, 0))
  
  if is-array! obj
    if obj.length == 0
      return Noop(make-pos(0, 0))
    let type = obj[0]
    if obj.length < 1 or not is-number! type
      throw Error "Expected an array with a number as its first item, got $(typeof! type)"
    if AstType-to-class not ownskey type
      throw Error "Unknown node type: $(type)"

    AstType-to-class[type].from-JSON(...obj[1 til Infinity])
  else 
    throw TypeError "Must provide an object or array to deserialize"

let array-from-JSON(array)
  if not array?
    []
  else if is-array! array
    return for item in array; from-JSON(item)
  else
    throw Error "Expected an array, got $(typeof! array)"

let from-literal(pos as {}, value)
  if is-null! value or typeof value in [\undefined, \boolean, \number, \string]
    Const pos, value
  else if is-array! value
    Arr pos, for item in value; from-literal(pos, item)
  else if value.constructor == Object
    Obj pos, for k, v of value; Obj.Pair pos, k, from-literal(pos, v)
  else
    throw TypeError "Cannot convert $(typeof! value) to an ast literal"
exports.from-literal := from-literal
