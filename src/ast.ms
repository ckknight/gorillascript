require! './types'

let LEVEL_BLOCK = 0 // { f(); `...`; g(); }
let LEVEL_INSIDE_PARENTHESES = 1 // f() + (`...`) + g() or f[`...`]
let LEVEL_SEQUENCE = 2 // [f(), `...`, g()] or x(f(), `...`, g())
let LEVEL_ASSIGNMENT = 3  // `...` += x
let LEVEL_INLINE_CONDITION = 4 // `...` ? x : y
let LEVEL_LOGICAL_OR = 5 // f() || `...`
let LEVEL_LOGICAL_AND = 6 // f() && `...`
let LEVEL_BITWISE_OR = 7 // f() | `...`
let LEVEL_BITWISE_XOR = 8 // f() ^ `...`
let LEVEL_BITWISE_AND = 9 // f() & `...`
let LEVEL_EQUALITY = 10 // f() == `...`
let LEVEL_RELATIONAL = 11 // f() < `...` or f() in `...` or f() instanceof `...`
let LEVEL_BITWISE_SHIFT = 12 // f() << `...` or f() >> `...` or f() >>> `...`
let LEVEL_ADDITION = 13 // f() + `...` or f() - `...`
let LEVEL_MULTIPLICATION = 14 // f() * `...` or f() / `...` or f() % `...`
let LEVEL_UNARY = 14 // +`...` or !`...`
let LEVEL_INCREMENT = 15 // ++`...` or `...`++ or --`...` or `...`--
let LEVEL_CALL = 16 // `...`()
let LEVEL_ACCESS = 17 // `...`[0] or `...`.item

let INDENT = "  "

let inc-indent(options)
  let clone = ^options
  clone.indent += 1
  clone

let StringBuilder()
  let data = []
  let sb = #(item)! -> data.push item
  sb.indent := #(count)!
    for i = 0, count
      data.push INDENT
  sb.to-string := #
    let len = data.length
    if len == 0
      ""
    else if len == 1
      data[0]
    else
      let text = data.join ""
      data.splice 0, len, text
      text
  sb

let escape-unicode-helper(m)
  let num = m.char-code-at(0).to-string(16)
  let len = num.length
  if len == 1
    "\\u000$num"
  else if len == 2
    "\\u00$num"
  else if len == 3
    "\\u0$num"
  else if len == 4
    "\\u$num"
  else
    throw Error()

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

let Node = exports.Node := do
  let Node()!
    throw Error "Node cannot be instantiated directly"
  
  Node::to-string := #
    let sb = StringBuilder()
    @compile-as-statement { indent: 0 }, true, sb
    sb.to-string()
  
  Node::to-function := #
    new Function @to-string()
  
  Node::compile := # -> throw Error "compile not implemented: $(@constructor.name)"
  
  Node::maybe-to-statement := #
    if typeof @to-statement == "function"
      @to-statement()
    else
      this
  
  Node::is-const := #-> false
  Node::is-noop := #-> false
  Node::const-value := #-> throw Error "$(@constructor.name) has no const value"
  
  Node

let Expression = exports.Expression := do
  let Expression()!
    throw Error "Expression cannot be instantiated directly"
  Expression.prototype := ^Node.prototype
  Expression::constructor := Expression
  
  Expression::to-string := #-> Node::to-string.call(this) & ";"
  
  Expression::compile-as-statement := #(options, line-start, sb)!
    if typeof @to-statement == "function"
      @to-statement().compile-as-statement options, line-start, sb
    else
      @compile options, LEVEL_BLOCK, line-start, sb
      sb ";"
  
  Expression::type := #-> types.any
  
  Expression::is-large := #-> false
  
  Expression

let Statement = exports.Statement := do
  let Statement()!
    throw Error "Expression cannot be instantiated directly"
  Statement.prototype := ^Node.prototype
  Statement::constructor := Statement
  
  Statement::compile-as-statement := #(options, line-start, sb)
    @compile options, LEVEL_BLOCK, line-start, sb
  
  Statement::is-large := #-> true
  
  Statement

let Access = exports.Access := #(parent, ...children)
  let mutable current = parent
  for child in children
    current := Binary current, ".", child
  current

let Arguments = exports.Arguments := do
  let Arguments()
    let self = if this instanceof Arguments then this else ^Arguments.prototype
    self
  Arguments.prototype := ^Expression.prototype
  Arguments::constructor := Arguments
  
  Arguments::compile := #(options, level, line-start, sb)! -> sb "arguments"
  
  Arguments::type := #-> types.args
  
  Arguments::walk := #-> this
  
  Arguments

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

let Arr = exports.Arr := do
  let Arr(elements as [Expression] = [])
    let self = if this instanceof Arr then this else ^Arr.prototype
    self.elements := elements
    self
  Arr.prototype := ^Expression.prototype
  Arr::constructor := Arr
  
  let compile-large(elements, options, level, line-start, sb)!
    let child-options = inc-indent options
    for item, i, len in elements
      sb "\n"
      sb.indent child-options.indent
      item.compile child-options, LEVEL_SEQUENCE, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
  let compile-small(elements, options, level, line-start, sb)!
    if elements.length
      for item, i in elements
        if i > 0
          sb ", "
        item.compile options, LEVEL_SEQUENCE, false, sb
  Arr::compile := #(options, level, line-start, sb)!
    sb "["
    let f = if @is-large() and @elements.length > 1 then compile-large else compile-small
    f(@elements, options, level, line-start, sb)
    sb "]"
  
  Arr::type := #-> types.array
  
  Arr::is-empty := #-> @elements.length == 0
  Arr::is-large := #
    @_is-large ?= @elements.length > 4 or for some element in @elements
      (element instanceofsome [Arr, Obj, Call] and not element.is-empty()) or element.is-large()
  
  Arr::walk := #(walker)
    let elements = walk-array @elements, walker
    if @elements != elements
      Arr elements
    else
      this
  
  Arr

let Assign = exports.Assign := #(left as Expression, right as Expression)
  Binary left, "=", right

let Concat = exports.Concat := #(...args as [Expression])
  let mutable current = Const ""
  for arg in args
    current := Binary current, "+", arg
  current

let And = exports.And := #(...args as [Expression])
  if args.length == 0
    Const true
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "&&", args[i]
    current

let Or = exports.Or := #(...args as [Expression])
  if args.length == 0
    Const false
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "||", args[i]
    current

let Binary = exports.Binary := do
  let Binary(mutable left, op as String, mutable right)
    let self = if this instanceof Binary then this else ^Binary.prototype
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(JSON.stringify op)"
    
    if left not instanceof Expression
      left := to-const(left)
    if right not instanceof Expression
      right := to-const(right)
    
    if left.is-const() and right.is-const() and CONST_OPERATIONS ownskey op
      let node = CONST_OPERATIONS[op](left.const-value(), right.const-value())
      if node != void
        if node instanceof Expression
          return node
        else
          return Const node
    
    if left.is-const() and LEFT_CONSTANT_OPERATIONS ownskey op
      return? LEFT_CONSTANT_OPERATIONS[op](left, right)
    
    if right.is-const() and RIGHT_CONSTANT_OPERATIONS ownskey op
      return? RIGHT_CONSTANT_OPERATIONS[op](left, right)
    
    self.left := left
    self.op := op
    self.right := right
    self
  Binary.prototype := ^Expression.prototype
  Binary::constructor := Binary
  
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
      left.compile options, LEVEL_ACCESS, line-start, sb
    
    if dot-access
      sb "."
      sb right.value
    else
      sb "["
      right.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
  
  Binary::compile := #(options, level, line-start, sb)!
    let f = if @op == "." then compile-access else compile-other
    f(@op, @left, @right, options, level, line-start, sb)
  
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
  
  Binary::type := #-> @_type ?= do
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
    "<<": (bitlshift) // TODO: change to ~bitlshift
    ">>": (bitrshift)
    ">>>": (biturshift)
    "<": (~<)
    "<=": (~<=)
    ">": (~>)
    ">=": (~>=)
    "===": (==)
    "!==": (!=)
    "==": (~=)
    "!=": (!~=)
    "&": (bitand)
    "^": (bitxor)
    "|": (bitor)
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
    "-": #(x, y)
      let y-value = y.const-value()
      if y-value == 0
        Unary "+", x
      else if typeof y-value == "number" and y-value < 0
        Binary x, "+", Const(-y-value)
  }
  
  let OPERATOR_PRECEDENCE = {
    ".": LEVEL_ACCESS
    "*": LEVEL_MULTIPLICATION
    "/": LEVEL_MULTIPLICATION
    "%": LEVEL_MULTIPLICATION
    "+": LEVEL_ADDITION
    "-": LEVEL_ADDITION
    "<<": LEVEL_BITWISE_SHIFT
    ">>": LEVEL_BITWISE_SHIFT
    ">>>": LEVEL_BITWISE_SHIFT
    "<": LEVEL_RELATIONAL
    "<=": LEVEL_RELATIONAL
    ">": LEVEL_RELATIONAL
    ">=": LEVEL_RELATIONAL
    "in": LEVEL_RELATIONAL
    "instanceof": LEVEL_RELATIONAL
    "==": LEVEL_EQUALITY
    "!=": LEVEL_EQUALITY
    "===": LEVEL_EQUALITY
    "!==": LEVEL_EQUALITY
    "&": LEVEL_BITWISE_AND
    "^": LEVEL_BITWISE_XOR
    "|": LEVEL_BITWISE_OR
    "&&": LEVEL_LOGICAL_AND
    "||": LEVEL_LOGICAL_OR
    "=": LEVEL_ASSIGNMENT
    "+=": LEVEL_ASSIGNMENT
    "-=": LEVEL_ASSIGNMENT
    "*=": LEVEL_ASSIGNMENT
    "/=": LEVEL_ASSIGNMENT
    "%=": LEVEL_ASSIGNMENT
    "<<=": LEVEL_ASSIGNMENT
    ">>=": LEVEL_ASSIGNMENT
    ">>>=": LEVEL_ASSIGNMENT
    "&=": LEVEL_ASSIGNMENT
    "^=": LEVEL_ASSIGNMENT
    "|=": LEVEL_ASSIGNMENT
  }
  
  let LEVEL_TO_ASSOCIATIVITY = {
    (LEVEL_EQUALITY): "paren"
    (LEVEL_RELATIONAL): "paren"
    (LEVEL_ADDITION): "left"
    (LEVEL_MULTIPLICATION): "left"
    (LEVEL_BITWISE_AND): "none"
    (LEVEL_BITWISE_OR): "none"
    (LEVEL_BITWISE_XOR): "none"
    (LEVEL_BITWISE_SHIFT): "left"
    (LEVEL_ASSIGNMENT): "right"
  }
  
  Binary::is-large := #
    @_is-large := @left.is-large() or @right.is-large()
  
  Binary::walk := #(walker)
    let mutable changed = false
    let left = walker(@left) ? @left.walk(walker)
    let right = walker(@right) ? @right.walk(walker)
    if @left != left or @right != right
      Binary left, @op, right
    else
      this
  
  Binary

let BlockStatement = exports.BlockStatement := do
  let BlockStatement(body as [Node] = [])
    let self = if this instanceof BlockStatement then this else ^BlockStatement.prototype
    
    let result = []
    for item in body
      let statement = item.maybe-to-statement()
      if not statement.is-noop()
        if statement instanceof BlockStatement
          result.push ...statement.body
        else
          result.push statement
    if result.length == 1
      return result[0]
    self.body := result
    self
  BlockStatement.prototype := ^Statement.prototype
  BlockStatement::constructor := BlockStatement
  
  BlockStatement::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    for item, i in @body
      if i > 0
        sb "\n"
        sb.indent options.indent
      item.compile-as-statement options, true, sb
  
  BlockStatement::is-noop := #-> @body.length == 0
  
  BlockStatement::walk := #(walker)
    let body = walk-array(@body, walker)
    if @body != body
      Block body
    else
      this
  
  BlockStatement

let BlockExpression = exports.BlockExpression := do
  let BlockExpression(body as [Expression] = [])
    let self = if this instanceof BlockExpression then this else ^BlockExpression.prototype
    
    let result = []
    result := []
    for item, i, len in body
      if i == len - 1 or not item.is-noop()
        if item instanceof BlockExpression
          result.push ...item.body
          if i < len - 1 and result[result.length - 1].is-noop()
            result.pop()
        else
          result.push item
    if result.length == 1
      return result[0]
    self.body := result
    self
  BlockExpression.prototype := ^Expression.prototype
  BlockExpression::constructor := BlockExpression
  
  BlockExpression::to-statement := #-> BlockStatement @body
  
  BlockExpression::compile := #(options, level, line-start, sb)!
    if level == LEVEL_BLOCK
      @to-statement().compile options, level, line-start, sb
    else
      let body = @body
      let len = body.length
      if len == 0
        Const(void).compile options, level, line-start, sb
      else if len == 1
        body[0].compile options, level, line-start, sb
      else
        let wrap = level > LEVEL_INSIDE_PARENTHESES
        if wrap
          sb "("
        for item, i in body
          if i > 0
            sb ", "
          item.compile options, LEVEL_SEQUENCE, false, sb
        if wrap
          sb ")"
  
  BlockExpression::is-const := #-> @body.length == 0
  BlockExpression::is-noop := BlockExpression::is-const
  BlockExpression::const-value := #
    if @body.length == 0
      void
    else
      throw Error "BlockExpression has no const value"
  
  BlockExpression::type := #
    let body = @body
    if body.length == 0
      types.undefined
    else
      body[body.length - 1].type()
  
  BlockExpression::is-large := #
    @_is-large ?= @body.length > 4 or for some part in @body
      part.is-large()
  
  BlockExpression::walk := BlockStatement::walk
  
  BlockExpression

let Block = exports.Block := #(body as [Node] = [])
  let all-expressions = for every item in body
    item instanceof Expression
  if all-expressions
    BlockExpression body
  else
    BlockStatement body

let Break = exports.Break := do
  let Break()
    let self = if this instanceof Break then this else ^Break.prototype
    self
  Break.prototype := ^Statement.prototype
  Break::constructor := Break
  
  Break::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "break;"
  
  Break::walk := #-> this
  
  Break

let Call = exports.Call := do
  let Call(func as Expression, args as [Expression] = [], is-new as Boolean)
    let self = if this instanceof Call then this else ^Call.prototype
    
    if not is-new and for every arg in args
        arg.is-const()
      if func instanceof Ident
        if PRIMORDIAL_FUNCTIONS ownskey func.name and PRIMORDIAL_FUNCTIONS[func.name] == true and typeof global != "undefined" and typeof global[func.name] == "function"
          try
            return to-const global[func.name].apply(null, for arg in args
              arg.const-value())
          catch e
            void
      else if func instanceof Binary and func.op == "."
        if func.left.is-const() and func.right.is-const()
          if typeof func.left.const-value()[func.right.const-value()] == "function"
            try
              return to-const func.left.const-value()[func.right.const-value()] ...for arg in args
                arg.const-value()
            catch e
              void
        else if func.left instanceof Ident and func.right.is-const() and typeof func.right.const-value() == "string" and PRIMORDIAL_FUNCTIONS ownskey func.left.name and typeof PRIMORDIAL_FUNCTIONS[func.left.name] == "object" and PRIMORDIAL_FUNCTIONS[func.left.name][func.right.const-value()] == true and typeof Object(global[func.left.name])[func.right.const-value()] == "function"
          try
            return to-const global[func.left.name][func.right.const-value()] ...for arg in args
              arg.const-value()
          catch e
            void
    self.func := func
    self.args := args
    self.is-new := is-new
    self
  Call.prototype := ^Expression.prototype
  Call::constructor := Call
  
  let PRIMORDIAL_FUNCTIONS = {
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
  
  let compile-large(args, options, level, line-start, sb)!
    sb "("
    let child-options = inc-indent options
    for item, i, len in args
      sb "\n"
      sb.indent child-options.indent
      item.compile child-options, LEVEL_SEQUENCE, false, sb
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
      arg.compile options, LEVEL_SEQUENCE, false, sb
    sb ")"
  Call::compile := #(options, level, line-start, sb)!
    if @is-new
      sb "new "
    
    let wrap = not @is-new and (@func instanceof Func or (@func instanceof Binary and @func.op == "." and @func.left instanceof Func))
    if wrap
      sb "("
    @func.compile options, LEVEL_CALL, line-start and not wrap and not @is-new, sb
    let f = if @should-compile-large-args() then compile-large else compile-small
    f(@args, options, level, line-start, sb)
    if wrap
      sb ")"
  
  Call::should-compile-large-args := #
    if @args.length > 4
      true
    else
      for some arg in @args[:-1]
        (arg instanceofsome [Arr, Obj, Call] and not arg.is-empty()) or arg.is-large()
  
  Call::has-large-args := #
    @_has-large-args ?= if @args.length > 4
      true
    else
      for some arg in @args
        (arg instanceofsome [Arr, Obj, Call] and not arg.is-empty()) or arg.is-large()
  
  Call::is-large := #-> @func.is-large() or @has-large-args()
  
  Call::is-empty := #-> @args.length == 0
  
  Call::walk := #(walker)
    let func = walker(@func) ? @func.walk(walker)
    let args = walk-array(@args, walker)
    if @func != func or @args != args
      Call func, args, @is-new
    else
      this
  
  Call

let to-const = #(value)
  if value instanceof Node
    throw Error "Cannot convert $(typeof! value) to a Const"
  else if Array.is-array(value)
    Arr (for item in value
      to-const item)
  else if value and typeof value == "object" and value not instanceof RegExp
    Obj (for k, v of value
      ObjPair k, to-const v)
  else
    Const value

let Const = exports.Const := do
  let Const(value as (void|null|Boolean|Number|String|RegExp))
    let self = if this instanceof Const then this else ^Const.prototype
    self.value := value
    self
  Const.prototype := ^Expression.prototype
  Const::constructor := Const
  
  Const::compile := #(options, level, line-start, sb)!
    let value = @value
    let wrap = level >= LEVEL_INCREMENT and (value == undefined or (typeof value == "number" and not is-finite(value)))
    if wrap
      sb "("
    sb to-JS-source(value)
    if wrap
      sb ")"
  
  Const::is-const := #-> true
  Const::is-noop := Const::is-const
  Const::const-value := #-> @value
  
  Const::type := #
    let value = @value
    let type = typeof value
    if type == "undefined"
      types.undefined
    else if type == "boolean"
      types.boolean
    else if type == "number"
      types.number
    else if type == "string"
      types.string
    else if value == null
      types.null
    else if value instanceof RegExp
      types.regexp
    else
      throw Error "Unknown value type: $type"
  
  Const::walk := #-> this
  
  Const

let Continue = exports.Continue := do
  let Continue()
    let self = if this instanceof Continue then this else ^Continue.prototype
    self
  Continue.prototype := ^Statement.prototype
  Continue::constructor := Continue
  
  Continue::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "continue;"
  
  Continue::walk := #-> this
  
  Continue

let Debugger = exports.Debugger := do
  let Debugger()
    let self = if this instanceof Debugger then this else ^Debugger.prototype
    self
  Debugger.prototype := ^Statement.prototype
  Debugger::constructor := Debugger
  
  Debugger::compile := #(options, level, line-start, sb)
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "debugger;"
  
  Debugger::walk := #-> this
  
  Debugger

let DoWhile = exports.DoWhile := do
  let DoWhile(body as Node, test as Expression)
    let self = if this instanceof DoWhile then this else ^DoWhile.prototype
    self.body := body.maybe-to-statement()
    self.test := test
    self
  DoWhile.prototype := ^Statement.prototype
  DoWhile::constructor := DoWhile
  
  DoWhile::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
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
    @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ");"
  
  DoWhile::walk := #(walker)
    let body = walker(@body) ? @body.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    if body != @body or test != @test
      DoWhile body, test
    else
      this
  
  DoWhile

let Eval = exports.Eval := do
  let Eval(mutable code)
    let self = if this instanceof Eval then this else ^Eval.prototype
    if code not instanceof Expression
      code := to-const code
    self.code := code
    self
  Eval.prototype := ^Expression.prototype
  Eval::constructor := Eval
  
  Eval::compile := #(options, level, line-start, sb)!
    if @code instanceof Const
      sb String(@code.value)
    else
      sb "eval("
      @code.compile options, LEVEL_SEQUENCE, false, sb
      sb ")"
    
  Eval::walk := #(walker)
    let code = walker(@code) ? @code.walk(walker)
    if code != @code
      Eval code
    else
      this
  
  Eval

let For = exports.For := do
  let For(init as Expression = BlockExpression(), test as Expression = Const(true), step as Expression = BlockExpression(), body as Node)
    let self = if this instanceof For then this else ^For.prototype
    self.init := init
    self.test := test
    self.step := step
    self.body := body.maybe-to-statement()
    self
  For.prototype := ^Statement.prototype
  For::constructor := For
  
  For::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    if not @init.is-noop()
      @init.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb "; "
    if not @test.is-const() or not @test.const-value()
      @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb "; "
    if not @step.is-noop()
      @step.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
  
  For::walk := #(walker)
    let init = walker(@init) ? @init.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    let step = walker(@step) ? @step.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if init != @init or test != @test or step != @step or body != @body
      For init, test, step, body
    else
      this
  
  For

let ForIn = exports.ForIn := do
  let ForIn(key as Ident, object as Expression, body as Node)
    let self = if this instanceof ForIn then this else ^ForIn.prototype
    self.key := key
    self.object := object
    self.body := body.maybe-to-statement()
    self
  ForIn.prototype := ^Statement.prototype
  ForIn::constructor := ForIn
  
  ForIn::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    @key.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb " in "
    @object.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
  
  ForIn::walk := #(walker)
    let key = walker(@key) ? @key.walk(walker)
    let object = walker(@object) ? @object.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if key != @key or object != @object or body != @body
      ForIn key, object, body
    else
      this
  
  ForIn

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
    name.compile sb, LEVEL_INSIDE_PARENTHESES, false, sb
  sb "("
  for param, i in params
    if i > 0
      sb ", "
    param.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
  sb ") {"
  if variables.length or declarations.length or body.length
    sb "\n"
    compile-func-body inc-indent(options), sb, declarations, variables, body
    sb.indent options.indent
  sb "}"

let Func = exports.Func := do
  let Func(name as (null|Ident), params as [Ident] = [], variables as [String] = [], body as [Node] = [], declarations as [String] = [])
    let self = if this instanceof Func then this else ^Func.prototype
    validate-func-params-and-variables params, variables
    self.name := name
    self.params := params
    self.variables := variables
    self.body := body
    self.declarations := declarations
    self
  Func.prototype := ^Expression.prototype
  Func::constructor := Func
  
  Func::compile := #(options, level, line-start, sb)!
    let wrap = line-start and not @name
    if wrap
      sb "("
    compile-func options, sb, @name, @params, @declarations, @variables, @body
    if wrap
      sb ")"
  
  Func::compile-as-statement := #(options, line-start, sb)!
    @compile options, LEVEL_BLOCK, line-start, sb
    unless line-start and @name
      sb ";"
  
  Func::type := #-> types.function
  
  Func::is-large := #-> true
  
  Func::walk := #(walker)
    let name = if @name then walker(@name) ? @name.walk(walker) else @name
    let params = walk-array(@params, walker)
    let body = walk-array(@body, walker)
    if name != @name or params != @params or body != @body
      Func name, params, @variables, body, @declarations
    else
      this
  
  Func

let Ident = exports.Ident := do
  let Ident(name as String)
    let self = if this instanceof Ident then this else ^Ident.prototype
    unless is-acceptable-ident name
      throw Error "Not an acceptable identifier name: $name"
    self.name := name
    self
  Ident.prototype := ^Expression.prototype
  Ident::constructor := Ident
  
  Ident::compile := #(options, level, line-start, sb)!
    sb @name
  
  Ident::walk := #-> this
  
  Ident

let IfStatement = exports.IfStatement := do
  let IfStatement(test as Expression, mutable when-true as Node, mutable when-false as Node = BlockExpression())
    let self = if this instanceof IfStatement then this else ^IfStatement.prototype
    
    if test.is-const()
      if test.const-value()
        when-true
      else
        when-false
    else
      when-true := when-true.maybe-to-statement()
      when-false := when-false.maybe-to-statement()
      if when-true.is-noop()
        if when-false.is-noop()
          test
        else
          IfStatement.call(self
            Unary "!", test
            when-false
            BlockStatement())
      else
        self.test := test
        self.when-true := when-true
        self.when-false := when-false
        self
  IfStatement.prototype := ^Statement.prototype
  IfStatement::constructor := IfStatement
  
  IfStatement::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "if ("
    @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
        
  IfStatement::walk := #(walker)
    let test = walker(@test) ? @test.walk walker
    let when-true = walker(@when-true) ? @when-true.walk walker
    let when-false = walker(@when-false) ? @when-false.walk walker
    
    if test != @test or when-true != @when-true or when-false != @when-false
      If test, when-true, when-false
    else
      this
  
  IfStatement

let IfExpression = exports.IfExpression := do
  let IfExpression(test as Expression, when-true as Expression, when-false as Expression = BlockExpression())
    let self = if this instanceof IfExpression then this else ^IfExpression.prototype
    
    if test.is-const()
      if test.const-value()
        when-true
      else
        when-false
    else if when-true.is-const() and when-false.is-const() and when-true.const-value() == when-false.const-value()
      BlockExpression [test, when-true]
    else
      self.test := test
      self.when-true := when-true
      self.when-false := when-false
      self
  IfExpression.prototype := ^Expression.prototype
  IfExpression::constructor := IfExpression
  
  IfExpression::to-statement := #-> IfStatement @test, @when-true, @when-false
  
  IfExpression::compile := #(options, level, line-start, sb)!
    if level == LEVEL_BLOCK
      @to-statement().compile(options, level, line-start, sb)
    else
      let wrap = level > LEVEL_INLINE_CONDITION
      if wrap
        sb "("
      let wrap-test = @test instanceof IfExpression
      if wrap-test
        sb "("
      @test.compile options, if wrap-test then LEVEL_INSIDE_PARENTHESES else LEVEL_INLINE_CONDITION, line-start and not wrap and not wrap-test, sb
      if wrap-test
        sb ")"
      sb " ? "
      @when-true.compile options, LEVEL_INLINE_CONDITION, false, sb
      sb " : "
      @when-false.compile options, LEVEL_INLINE_CONDITION, false, sb
      if wrap
        sb ")"
  
  IfExpression::type := #-> @_type ?= @when-true.type().union(@when-false.type())
  
  IfExpression::is-large := #
    @_is-large ?= for some part in [@test, @when-true, @when-false]
      (part instanceofsome [Arr, Obj, Call] and not part.is-empty()) or part.is-large()
  
  IfExpression::walk := IfStatement::walk
  
  IfExpression

let If = exports.If := #(test, when-true, when-false)
  if when-true instanceof Expression and (not when-false or when-false instanceof Expression)
    IfExpression test, when-true, when-false
  else
    IfStatement test, when-true, when-false

let Obj = exports.Obj := do
  let validate-unique-keys(elements)!
    let keys = []
    for pair in elements
      let key = pair.key
      if key in keys
        throw Error "Found duplicate key: $(to-JS-source key)"
      keys.push key
  
  let Obj(elements as [ObjPair] = [])
    let self = if this instanceof Obj then this else ^Obj.prototype
    validate-unique-keys elements
    self.elements := elements
    self
  Obj.prototype := ^Expression.prototype
  Obj::constructor := Obj
  
  let compile-large(elements, options, sb)!
    let child-options = inc-indent options
    for element, i, len in elements
      sb "\n"
      sb.indent child-options.indent
      let key = element.key
      sb if is-acceptable-ident key
        key
      else
        to-JS-source key
      sb ": "
      element.value.compile child-options, LEVEL_SEQUENCE, false, sb
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
        let key = element.key
        sb if is-acceptable-ident key
          key
        else
          to-JS-source key
        sb ": "
        element.value.compile options, LEVEL_SEQUENCE, false, sb
      sb " "
  
  Obj::compile := #(options, level, line-start, sb)!
    if line-start
      sb "("
    sb "{"
    let f = if @is-large() then compile-large else compile-small
    f @elements, options, sb
    sb "}"
    if line-start
      sb ")"
  
  Obj::type := #-> types.object
  
  Obj::is-empty := #-> @elements.length == 0
  Obj::is-large := #
    @_is-large ?= @elements.length > 4 or for some element in @elements
      (element.value instanceofsome [Arr, Obj, Call] and not element.value.is-empty()) or element.is-large()
  
  Obj::walk := #(walker)
    let elements = walk-array(@elements, walker)
    if elements != @elements
      Obj elements
    else
      this
  
  let ObjPair(key as String, mutable value)
    let self = if this instanceof ObjPair then this else ^ObjPair.prototype
    self.key := key
    if value not instanceof Expression
      value := to-const value
    self.value := value
    self
  Obj.Pair := ObjPair
  
  ObjPair::is-large := #-> @value.is-large()
  
  ObjPair::walk := #(walker)
    let value = walker(@value) ? @value.walk(walker)
    if value != @value
      ObjPair @key, value
    else
      this
  
  Obj

let Return = exports.Return := do
  let Return(@node as Expression = Const(void))
    let self = if this instanceof Return then this else ^Return.prototype
    self.node := node
    self
  Return.prototype := ^Statement.prototype
  Return::constructor := Return
  
  Return::compile := #(options, level, line-start, sb)!
    sb "return"
    unless @node.is-const() and @node.const-value() == void
      sb " "
      @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ";"
  
  Return::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Return node
    else
      this
  
  Return

let Root = exports.Root := do
  let Root(body as [Node] = [], variables as [String] = [], declarations as [String] = [])
    let self = if this instanceof Root then this else ^Root.prototype
    
    validate-func-params-and-variables [], variables
    
    self.body := []
    for item in body
      let statement = item.maybe-to-statement()
      if statement instanceof BlockStatement
        self.body.push ...statement.body
      else
        self.body.push statement
    self.variables := variables
    self.declarations := declarations
    self
  
  Root::compile := #(options = {})
    if not options.indent
      options.indent := 0
    
    let sb = StringBuilder()
    compile-func-body(options, sb, @declarations, @variables, @body)
    sb.to-string()
  
  Root::to-string := #-> @compile()
  
  Root::to-function := Node::to-function
  
  Root::is-large := #-> true
  
  Root::walk := #(walker)
    let body = walk-array(@body, walker)
    if body != @body
      Root body, @variables, @declarations
    else
      this
  
  Root

let This = exports.This := do
  let This()
    let self = if this instanceof This then this else ^This.prototype
    self
  This.prototype := ^Expression.prototype
  This::constructor := This
  
  This::compile := #(options, level, line-start, sb)!
    sb "this"
  
  This::walk := #-> this
  
  This

let Throw = exports.Throw := do
  let Throw(node as Expression)
    let self = if this instanceof Throw then this else ^Throw.prototype
    self.node := node
    self
  Throw.prototype := ^Statement.prototype
  Throw::constructor := Throw
  
  Throw::compile := #(options, level, line-start, sb)
    sb "throw "
    @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ";"
  
  Throw::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Throw node
    else
      this
  
  Throw

let Switch = exports.Switch := do
  let Switch(node as Expression, cases as [SwitchCase] = [], default-case as Node = BlockStatement())
    let self = if this instanceof Switch then this else ^Switch.prototype
    self.node := node
    self.cases := cases
    self.default-case := default-case.maybe-to-statement()
    self
  Switch.prototype := ^Statement.prototype
  Switch::constructor := Switch
  
  Switch::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "switch ("
    @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {"
    let child-options = inc-indent options
    for case_ in @cases
      sb "\n"
      sb.indent options.indent
      sb "case "
      case_.node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
      @default-case.compile-as-statement options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  Switch::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    let cases = walk-array(@cases, walker)
    let default-case = walker(@default-case) ? @default-case.walk(walker)
    if node != @node or cases != @cases or default-case != @default-case
      Switch node, cases, default-case
    else
      this
  
  let SwitchCase(node as Expression, body as Node)
    let self = if this instanceof SwitchCase then this else ^SwitchCase.prototype
    self.node := node
    self.body := body.maybe-to-statement()
    self
  Switch.Case := SwitchCase
  
  SwitchCase::is-large := #-> true
  
  SwitchCase::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if node != @node or body != @body
      SwitchCase(node, body)
    else
      this
  
  Switch

let TryCatch = exports.TryCatch := do
  let TryCatch(try-body as Node, catch-ident as Ident, catch-body as Node)
    let self = if this instanceof TryCatch then this else ^TryCatch.prototype
    
    self.try-body := try-body.maybe-to-statement()
    if self.try-body.is-noop()
      return BlockStatement()
    self.catch-ident := catch-ident
    self.catch-body := catch-body.maybe-to-statement()
    self
  TryCatch.prototype := ^Statement.prototype
  TryCatch::constructor := TryCatch
  
  TryCatch::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let child-options = inc-indent options
    sb.indent child-options.indent
    @try-body.compile-as-statement child-options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "} catch ("
    @catch-ident.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {"
    if not @catch-body.is-noop()
      sb "\n"
      sb.indent child-options.indent
      @catch-body.compile-as-statement child-options, true, sb
      sb "\n"
      sb.indent options.indent
    sb "}"
  
  TryCatch::walk := #(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let catch-ident = walker(@catch-ident) ? @catch-ident.walk(walker)
    let catch-body = walker(@catch-body) ? @catch-body.walk(walker)
    if try-body != @try-body or catch-ident != @catch-ident or catch-body != @catch-body
      TryCatch try-body, catch-ident, catch-body
    else
      this
  
  TryCatch

let TryFinally = exports.TryFinally := do
  let TryFinally(try-body as Node, finally-body as Node)
    let self = if this instanceof TryFinally then this else ^TryFinally.prototype
    self.try-body := try-body.maybe-to-statement()
    self.finally-body := finally-body.maybe-to-statement()
    if self.try-body.is-noop()
      if self.finally-body.is-noop()
        BlockStatement()
      else
        self.finally-body
    else if self.finally-body.is-noop()
      self.try-body
    else
      self
  TryFinally.prototype := ^Statement.prototype
  TryFinally::constructor := TryFinally
  
  TryFinally::compile := #(options, level, line-start, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let child-options = inc-indent(options)
    sb.indent child-options.indent
    if @try-body instanceof TryCatch
      @try-body.try-body.compile-as-statement child-options, true, sb
      sb "\n"
      sb.indent options.indent
      sb "} catch ("
      @try-body.catch-ident.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
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
  
  TryFinally::walk := #(walker)
    let try-body = walker(@try-body) ? @try-body.walk(walker)
    let finally-body = walker(@finally-body) ? @finally-body.walk(walker)
    if try-body != @try-body or finally-body != @finally-body
      TryCatch try-body, finally-body
    else
      this

  TryFinally

let Unary = exports.Unary := do
  let Unary(op as String, mutable node)
    let self = if this instanceof Unary then this else ^Unary.prototype
    
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    if node not instanceof Expression
      node := to-const node
    
    if node.is-const() and CONST_OPERATIONS ownskey op
      return Const CONST_OPERATIONS[op](node.const-value())
    
    if NONCONST_OPERATIONS ownskey op
      return? NONCONST_OPERATIONS[op](node)
    
    self.op := op
    self.node := node
    self
  Unary.prototype := ^Expression.prototype
  Unary::constructor := Unary
  
  Unary::compile := #(options, level, line-start, sb)!
    let op = @op
    if op in ["++post", "--post"]
      @node.compile options, LEVEL_UNARY, false, sb
      sb op.substring(0, 2)
    else
      sb op
      if op in ["typeof", "void", "delete"] or (op in ["+", "-", "++", "--"] and ((@node instanceof Unary and op in ["+", "-", "++", "--"]) or (@node instanceof Const and typeof this.node.value == "number" and this.node.value < 0)))
        sb " "
      @node.compile options, LEVEL_UNARY, false, sb
  
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
    "!": #(x) -> not x
    "~": #(x) -> bitnot x
    "+": #(x) -> +x
    "-": #(x) -> -x
    "typeof": #(x) -> typeof x
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
            if typeof invert == "function"
              invert x.left, x.right
            else if typeof invert == "string"
              Binary x.left, invert, x.right
            else
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
  
  Unary::type := #-> OPERATOR_TYPES[@op]
  
  Unary::is-large := #-> @node.is-large()
  
  Unary::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Unary(@op, node)
    else
      this
  
  Unary

let While = exports.While := #(test, body)
  For(null, test, null, body)
