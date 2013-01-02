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

let incIndent(options)
  let clone = ^options
  clone.indent += 1
  clone

let StringBuilder()
  let data = []
  let sb = #(item)! -> data.push item
  sb.indent := #(count)!
    for i = 0, count
      data.push INDENT
  sb.toString := #
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

let escapeUnicodeHelper(m)
  let num = m.charCodeAt(0).toString(16)
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

let escapeUnicode(text)
  text.replace r'[\u0000-\u001f\u0080-\uffff]'g, escapeUnicodeHelper

let toJSSourceTypes = {
  undefined: #-> "void 0"
  number: #(value)
    if isFinite value
      JSON.stringify value
    else if isNaN value
      "0/0"
    else if value > 0
      "1/0"
    else
      "-1/0"
  string: #(value)
    let jsonString = escapeUnicode JSON.stringify(value)
    if value.indexOf('"') == -1 or value.indexOf("'") != -1
      jsonString
    else
      "'" & jsonString.substring(1, jsonString.length - 1).replace(r'\\"'g, '"') & "'"
  boolean: #(value) -> if value then "true" else "false"
  object: #(value)
    if value instanceof RegExp
      let source = value.source.replace(r"(\\\\)*\\?/"g, "\$1\\/") or "(?:)"
      let flags = []
      if value.global
        flags.push "g"
      if value.ignoreCase
        flags.push "i"
      if value.multiline
        flags.push "m"
      "/$(source)/$(flags.join '')"
    else
      JSON.stringify value
}
let toJSSource(value)
  let f = toJSSourceTypes[typeof value]
  unless f
    throw TypeError "Cannot compile const $(typeof! value)"
  f value

let isAcceptableIdent = do
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
exports.isAcceptableIdent := isAcceptableIdent

let maybeToStatement(node)
  if node and typeof node.toStatement == "function"
    node.toStatement()
  else
    node

let Node = do
  let Node()!
    throw Error "Node cannot be instantiated directly"
  
  Node::toString := #
    let sb = StringBuilder()
    @compileAsStatement { indent: 0 }, true, sb
    sb.toString()
  
  Node::toFunction := #
    new Function @toString()
  
  Node::compile := # -> throw Error "compile not implemented: $(@constructor.name)"
  
  exports.Node := Node

let Expression = do
  let Expression()!
    throw Error "Expression cannot be instantiated directly"
  Expression.prototype := ^Node.prototype
  Expression::constructor := Expression
  
  Expression::toString := #-> Node::toString.call(this) & ";"
  
  Expression::compileAsStatement := #(options, lineStart, sb)!
    if typeof @toStatement == "function"
      @toStatement().compileAsStatement options, lineStart, sb
    else
      @compile options, LEVEL_BLOCK, lineStart, sb
      sb ";"
  
  Expression::type := #-> types.any
  
  Expression::isLarge := #-> false
  
  exports.Expression := Expression

let Statement = do
  let Statement()!
    throw Error "Expression cannot be instantiated directly"
  Statement.prototype := ^Node.prototype
  Statement::constructor := Statement
  
  Statement::compileAsStatement := #(options, lineStart, sb)
    @compile options, LEVEL_BLOCK, lineStart, sb
  
  Statement::isLarge := #-> true
  
  exports.Statement := Statement

let Access(parent, ...children)
  let mutable current = parent
  for child in children
    current := Binary current, ".", child
  current
exports.Access := Access

let Arguments = do
  let Arguments()
    let self = if this instanceof Arguments then this else ^Arguments.prototype
    self
  Arguments.prototype := ^Expression.prototype
  Arguments::constructor := Arguments
  
  Arguments::compile := #(options, level, lineStart, sb)! -> sb "arguments"
  
  Arguments::type := #-> types.args
  
  Arguments::walk := #-> this
  
  exports.Arguments := Arguments

let walkArray(array as Array, walker as Function)
  let mutable changed = false
  let result = for item in array
    let mutable newItem = walker item
    unless newItem?
      newItem := item.walk walker
    if item != newItem
      changed := true
    newItem
  if changed
    result
  else
    array

let Arr = do
  let Arr(elements as [Expression] = [])
    let self = if this instanceof Arr then this else ^Arr.prototype
    self.elements := elements
    self
  Arr.prototype := ^Expression.prototype
  Arr::constructor := Arr
  
  let compileLarge(elements, options, level, lineStart, sb)!
    let childOptions = incIndent options
    for item, i, len in elements
      sb "\n"
      sb.indent childOptions.indent
      item.compile childOptions, LEVEL_SEQUENCE, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
  let compileSmall(elements, options, level, lineStart, sb)!
    if elements.length
      for item, i in elements
        if i > 0
          sb ", "
        item.compile options, LEVEL_SEQUENCE, false, sb
  Arr::compile := #(options, level, lineStart, sb)!
    sb "["
    let f = if @isLarge() then compileLarge else compileSmall
    f(@elements, options, level, lineStart, sb)
    sb "]"
  
  Arr::type := #-> types.array
  
  Arr::isEmpty := #-> @elements.length == 0
  Arr::isLarge := #
    @_isLarge ?= @elements.length > 4 or for some element in @elements
      (element instanceofsome [Arr, Obj] and not element.isEmpty()) or element.isLarge()
  
  Arr::walk := #(walker)
    let elements = walkArray @elements, walker
    if @elements != elements
      Arr elements
    else
      this
  
  exports.Arr := Arr

let Assign(left as Expression, right as Expression)
  Binary left, "=", right
exports.Assign := Assign

let Concat(...args as [Expression])
  let mutable current = Const ""
  for arg in args
    current := Binary current, "+", arg
  current
exports.Concat := Concat

let And(...args as [Expression])
  if args.length == 0
    Const true
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "&&", args[i]
    current
exports.And := And

let Or(...args as [Expression])
  if args.length == 0
    Const false
  else
    let mutable current = args[0]
    for i = 1, args.length
      current := Binary current, "||", args[i]
    current
exports.Or := Or

let isConst(node)
  node instanceof Const or (node instanceof BlockExpression and node.body.length == 0)

let constValue(node)
  if node instanceof Const
    node.value
  else if node instanceof BlockExpression and node.body.length == 0
    undefined
  else
    throw TypeError "node is not a const value"

let Binary = do
  let Binary(mutable left, op as String, mutable right)
    let self = if this instanceof Binary then this else ^Binary.prototype
    if OPERATOR_PRECEDENCE not ownskey op
      throw Error "Unknown binary operator: $(JSON.stringify op)"
    
    if left not instanceof Expression
      left := toConst(left)
    if right not instanceof Expression
      right := toConst(right)
    
    if isConst(left) and isConst(right) and CONST_OPERATIONS ownskey op
      let node = CONST_OPERATIONS[op](constValue(left), constValue(right))
      if node != void
        if node instanceof Expression
          return node
        else
          return Const node
    
    if isConst(left) and LEFT_CONSTANT_OPERATIONS ownskey op
      return? LEFT_CONSTANT_OPERATIONS[op](left, right)
    
    if isConst(right) and RIGHT_CONSTANT_OPERATIONS ownskey op
      return? RIGHT_CONSTANT_OPERATIONS[op](left, right)
    
    self.left := left
    self.op := op
    self.right := right
    self
  Binary.prototype := ^Expression.prototype
  Binary::constructor := Binary
  
  let compileAccess(op, left, right, options, level, lineStart, sb)!
    let dotAccess = right instanceof Const and typeof right.value == "string" and isAcceptableIdent(right.value)
    
    if left instanceof Const and typeof left.value == "number"
      let stringLeft = toJSSource left.value
      if left.value < 0 or not isFinite(left.value)
        sb "("
        sb stringLeft
        sb ")"
      else
        sb stringLeft
        if dotAccess and stringLeft.indexOf("e") == -1 and stringLeft.indexOf(".") == -1
          sb "."
    else if isConst(left) and constValue(left) == void
      sb "("
      sb toJSSource(void)
      sb ")"
    else
      left.compile options, LEVEL_ACCESS, lineStart, sb
    
    if dotAccess
      sb "."
      sb right.value
    else
      sb "["
      right.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
      sb "]"
  
  let compileOther(op, left, right, options, level, lineStart, sb)!
    let opLevel = OPERATOR_PRECEDENCE[op]
    let associativity = LEVEL_TO_ASSOCIATIVITY[opLevel]
    let wrap = if associativity == "paren" then level >= opLevel else level > opLevel
    
    if wrap
      sb "("
    left.compile options, if associativity == "right" and left instanceof Binary and OPERATOR_PRECEDENCE[left.op] == opLevel then opLevel + 1 else opLevel, lineStart and not wrap, sb
    sb " "
    sb op
    sb " "
    right.compile options, if associativity == "left" and right instanceof Binary and OPERATOR_PRECEDENCE[right.op] == opLevel then opLevel + 1 else opLevel, false, sb
    if wrap
      sb ")"
  
  Binary::compile := #(options, level, lineStart, sb)!
    let f = if @op == "." then compileAccess else compileOther
    f(@op, @left, @right, options, level, lineStart, sb)
  
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
      if left.isSubsetOf(types.number) and right.isSubsetOf(types.number)
        types.number
      else if left.overlaps(types.number) and right.overlaps(types.number)
        types.stringOrNumber
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
    "&&": #(left, right) -> left.intersect(types.potentiallyFalsy).union(right)
    "||": #(left, right) -> left.intersect(types.potentiallyTruthy).union(right)
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
        toConst x[y]
  }
  
  let LEFT_CONSTANT_OPERATIONS = {
    "&&": #(x, y) -> if constValue x then y else x
    "||": #(x, y) -> if constValue x then x else y
    "*": #(x, y)
      if constValue(x) == 1
        Unary "+", y
      else if constValue(x) == -1
        Unary "-", y
    "+": #(x, y)
      if constValue(x) == 0
        Unary "+", y
    "-": #(x, y)
      if constValue(x) == 0
        Unary "-", y
  }
  
  let RIGHT_CONSTANT_OPERATIONS = {
    "*": #(x, y)
      if constValue(y) == 1
        Unary "+", x
      else if constValue(y) == -1
        Unary "-", x
    "/": #(x, y)
      if constValue(y) == 1
        Unary "+", x
      else if constValue(y) == -1
        Unary "-", x
    "+": #(x, y)
      let yValue = constValue(y)
      if yValue == 0
        Unary "+", x
      else if typeof yValue == "number" and yValue < 0
        Binary x, "-", Const(-yValue)
    "-": #(x, y)
      let yValue = constValue(y)
      if yValue == 0
        Unary "+", x
      else if typeof yValue == "number" and yValue < 0
        Binary x, "+", Const(-yValue)
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
  
  Binary::isLarge := #
    @_isLarge := @left.isLarge() or @right.isLarge()
  
  Binary::walk := #(walker)
    let mutable changed = false
    let left = walker(@left) ? @left.walk(walker)
    let right = walker(@right) ? @right.walk(walker)
    if @left != left or @right != right
      Binary left, @op, right
    else
      this
  
  exports.Binary := Binary

let BlockStatement = do
  let BlockStatement(body as [Node] = [])
    let self = if this instanceof BlockStatement then this else ^BlockStatement.prototype
    
    let result = []
    for item in body
      let statement = maybeToStatement item
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
  
  BlockStatement::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    for item, i in @body
      if i > 0
        sb "\n"
        sb.indent options.indent
      item.compileAsStatement options, true, sb
  
  BlockStatement::walk := #(walker)
    let body = walkArray(@body, walker)
    if @body != body
      Block body
    else
      this
  
  exports.BlockStatement := BlockStatement

let BlockExpression = do
  let BlockExpression(body as [Expression] = [])
    let self = if this instanceof BlockExpression then this else ^BlockExpression.prototype
    
    let result = []
    result := []
    for item in body
      if item instanceof BlockExpression
        result.push ...item.body
      else
        result.push item
    if result.length == 1
      return result[0]
    self.body := result
    self
  BlockExpression.prototype := ^Expression.prototype
  BlockExpression::constructor := BlockExpression
  
  BlockExpression::toStatement := #-> BlockStatement @body
  
  BlockExpression::compile := #(options, level, lineStart, sb)!
    if level == LEVEL_BLOCK
      @toStatement().compile options, level, lineStart, sb
    else
      let body = @body
      let len = body.length
      if len == 0
        Const(void).compile options, level, lineStart, sb
      else if len == 1
        body[0].compile options, level, lineStart, sb
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
  
  BlockExpression::type := #
    let body = @body
    if body.length == 0
      types.undefined
    else
      body[body.length - 1].type()
  
  BlockExpression::isLarge := #
    @_isLarge ?= @body.length > 4 or for some part in @body
      part.isLarge()
  
  BlockExpression::walk := BlockStatement::walk
  
  exports.BlockExpression := BlockExpression

let Block(body as [Node] = [])
  let allExpressions = for every item in body
    item instanceof Expression
  if allExpressions
    BlockExpression body
  else
    BlockStatement body
exports.Block := Block

let Break = do
  let Break()
    let self = if this instanceof Break then this else ^Break.prototype
    self
  Break.prototype := ^Statement.prototype
  Break::constructor := Break
  
  Break::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "break;"
  
  Break::walk := #-> this
  
  exports.Break := Break

let Call = do
  let Call(func as Expression, args as [Expression] = [], isNew as Boolean)
    let self = if this instanceof Call then this else ^Call.prototype
    
    if not isNew and for every arg in args
        isConst(arg)
      if func instanceof Ident
        if PRIMORDIAL_FUNCTIONS ownskey func.name and PRIMORDIAL_FUNCTIONS[func.name] == true and typeof global != "undefined" and typeof global[func.name] == "function"
          try
            return toConst global[func.name].apply(null, for arg in args
              constValue(arg))
          catch e
            void
      else if func instanceof Binary and func.op == "."
        if isConst(func.left) and isConst(func.right)
          if typeof constValue(func.left)[constValue(func.right)] == "function"
            try
              return toConst constValue(func.left)[constValue(func.right)] ...for arg in args
                constValue(arg)
            catch e
              void
        else if func.left instanceof Ident and isConst(func.right) and typeof constValue(func.right) == "string" and PRIMORDIAL_FUNCTIONS ownskey func.left.name and typeof PRIMORDIAL_FUNCTIONS[func.left.name] == "object" and PRIMORDIAL_FUNCTIONS[func.left.name][constValue(func.right)] == true and typeof Object(global[func.left.name])[constValue(func.right)] == "function"
          try
            return toConst global[func.left.name][constValue(func.right)] ...for arg in args
              constValue(arg)
          catch e
            void
    self.func := func
    self.args := args
    self.isNew := isNew
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
  
  let compileLarge(args, options, level, lineStart, sb)!
    sb "("
    let childOptions = incIndent options
    for item, i, len in args
      sb "\n"
      sb.indent childOptions.indent
      item.compile childOptions, LEVEL_SEQUENCE, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
    sb ")"
  let compileSmall(args, options, level, lineStart, sb)!
    sb "("
    for arg, i in args
      if i > 0
        sb ", "
      arg.compile options, LEVEL_SEQUENCE, false, sb
    sb ")"
  Call::compile := #(options, level, lineStart, sb)!
    if @isNew
      sb "new "
    
    let wrap = not @isNew and (@func instanceof Func or (@func instanceof Binary and @func.op == "." and @func.left instanceof Func))
    if wrap
      sb "("
    @func.compile options, LEVEL_CALL, lineStart and not wrap and not @isNew, sb
    let f = if @shouldCompileLargeArgs() then compileLarge else compileSmall
    f(@args, options, level, lineStart, sb)
    if wrap
      sb ")"
  
  Call::shouldCompileLargeArgs := #
    if @args.length > 4
      true
    else
      for some arg in @args[:-1]
        (arg instanceofsome [Arr, Obj] and not arg.isEmpty()) or arg.isLarge()
  
  Call::hasLargeArgs := #
    @_hasLargeArgs ?= if @args.length > 4
      true
    else
      for some arg in @args
        (arg instanceofsome [Arr, Obj] and not arg.isEmpty()) or arg.isLarge()
  
  Call::isLarge := #-> @func.isLarge() or @hasLargeArgs()
  
  Call::walk := #(walker)
    let func = walker(@func) ? @func.walk(walker)
    let args = walkArray(@args, walker)
    if @func != func or @args != args
      Call func, args, @isNew
    else
      this
  
  exports.Call := Call

let toConst = #(value)
  if value instanceof Node
    throw Error "Cannot convert $(typeof! value) to a Const"
  else if Array.isArray(value)
    Arr (for item in value
      toConst item)
  else if value and typeof value == "object" and value not instanceof RegExp
    Obj (for k, v of value
      ObjPair k, toConst v)
  else
    Const value

let Const = do
  let Const(value as (void|null|Boolean|Number|String|RegExp))
    let self = if this instanceof Const then this else ^Const.prototype
    self.value := value
    self
  Const.prototype := ^Expression.prototype
  Const::constructor := Const
  
  Const::compile := #(options, level, lineStart, sb)!
    let value = @value
    let wrap = level >= LEVEL_INCREMENT and (value == undefined or (typeof value == "number" and not isFinite(value)))
    if wrap
      sb "("
    sb toJSSource(value)
    if wrap
      sb ")"
  
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
  
  exports.Const := Const

let Continue = do
  let Continue()
    let self = if this instanceof Continue then this else ^Continue.prototype
    self
  Continue.prototype := ^Statement.prototype
  Continue::constructor := Continue
  
  Continue::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "continue;"
  
  Continue::walk := #-> this
  
  exports.Continue := Continue

let Debugger = do
  let Debugger()
    let self = if this instanceof Debugger then this else ^Debugger.prototype
    self
  Debugger.prototype := ^Statement.prototype
  Debugger::constructor := Debugger
  
  Debugger::compile := #(options, level, lineStart, sb)
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    sb "debugger;"
  
  Debugger::walk := #-> this
  
  exports.Debugger := Debugger

let DoWhile = do
  let DoWhile(body as Node, test as Expression)
    let self = if this instanceof DoWhile then this else ^DoWhile.prototype
    self.body := maybeToStatement body
    self.test := test
    self
  DoWhile.prototype := ^Statement.prototype
  DoWhile::constructor := DoWhile
  
  DoWhile::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "do {\n"
    sb.indent options.indent + 1
    @body.compileAsStatement incIndent(options), true, sb
    sb "\n"
    sb.indent options.indent
    sb "} while ("
    @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ");"
  
  DoWhile::walk := #(walker)
    let body = walker(@body) ? @body.walk(walker)
    let test = walker(@test) ? @test.walk(walker)
    if body != @body or test != @test
      DoWhile body, test
    else
      this
  
  exports.DoWhile := DoWhile

let Eval = do
  let Eval(mutable code)
    let self = if this instanceof Eval then this else ^Eval.prototype
    if code not instanceof Expression
      code := toConst code
    self.code := code
    self
  Eval.prototype := ^Expression.prototype
  Eval::constructor := Eval
  
  Eval::compile := #(options, level, lineStart, sb)!
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
  
  exports.Eval := Eval

let For = do
  let For(init as Expression = BlockExpression(), test as Expression = Const(true), step as Expression = BlockExpression(), body as Node)
    let self = if this instanceof For then this else ^For.prototype
    self.init := init
    self.test := test
    self.step := step
    self.body := maybeToStatement body
    self
  For.prototype := ^Statement.prototype
  For::constructor := For
  
  For::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    if not isConst(@init)
      @init.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb "; "
    if not isConst(@test) or not constValue(@test)
      @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb "; "
    if not isConst(@step)
      @step.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {\n"
    sb.indent options.indent + 1
    @body.compileAsStatement incIndent(options), true, sb
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
  
  exports.For := For

let ForIn = do
  let ForIn(key as Ident, object as Expression, body as Node)
    let self = if this instanceof ForIn then this else ^ForIn.prototype
    self.key := key
    self.object := object
    self.body := maybeToStatement(body)
    self
  ForIn.prototype := ^Statement.prototype
  ForIn::constructor := ForIn
  
  ForIn::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "for ("
    @key.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb " in "
    @object.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {\n"
    sb.indent options.indent + 1
    @body.compileAsStatement incIndent(options), true, sb
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
  
  exports.ForIn := ForIn

let validateFuncParamsAndVariables(params, variables)!
  let names = []
  for param in params
    if param.name in names
      throw Error "Duplicate parameter: $(param.name)"
    names.push param.name
  for variable in variables
    if variable in names
      throw Error "Duplicate variable: $variable"
    names.push variable

let compileFuncBody(options, sb, declarations, variables, body)!
  for declaration in declarations
    sb.indent options.indent
    sb toJSSource(declaration)
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
    line.compileAsStatement options, true, sb
    sb "\n"

let compileFunc(options, sb, name, params, declarations, variables, body)
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
    compileFuncBody incIndent(options), sb, declarations, variables, body
    sb.indent options.indent
  sb "}"

let Func = do
  let Func(name as (null|Ident), params as [Ident] = [], variables as [String] = [], body as [Node] = [], declarations as [String] = [])
    let self = if this instanceof Func then this else ^Func.prototype
    validateFuncParamsAndVariables params, variables
    self.name := name
    self.params := params
    self.variables := variables
    self.body := body
    self.declarations := declarations
    self
  Func.prototype := ^Expression.prototype
  Func::constructor := Func
  
  Func::compile := #(options, level, lineStart, sb)!
    let wrap = lineStart and not @name
    if wrap
      sb "("
    compileFunc options, sb, @name, @params, @declarations, @variables, @body
    if wrap
      sb ")"
  
  Func::compileAsStatement := #(options, lineStart, sb)!
    @compile options, LEVEL_BLOCK, lineStart, sb
    unless lineStart and @name
      sb ";"
  
  Func::type := #-> types.function
  
  Func::isLarge := #-> true
  
  Func::walk := #(walker)
    let name = if @name then walker(@name) ? @name.walk(walker) else @name
    let params = walkArray(@params, walker)
    let body = walkArray(@body, walker)
    if name != @name or params != @params or body != @body
      Func name, params, @variables, body, @declarations
    else
      this
  
  exports.Func := Func

let Ident = do
  let Ident(name as String)
    let self = if this instanceof Ident then this else ^Ident.prototype
    unless isAcceptableIdent name
      throw Error "Not an acceptable identifier name: $name"
    self.name := name
    self
  Ident.prototype := ^Expression.prototype
  Ident::constructor := Ident
  
  Ident::compile := #(options, level, lineStart, sb)!
    sb @name
  
  Ident::walk := #-> this
  
  exports.Ident := Ident

let IfStatement = do
  let IfStatement(test as Expression, mutable whenTrue as Node, mutable whenFalse as Node = BlockExpression())
    let self = if this instanceof IfStatement then this else ^IfStatement.prototype
    
    if isConst test
      if constValue test
        whenTrue
      else
        whenFalse
    else
      whenTrue := maybeToStatement whenTrue
      whenFalse := maybeToStatement whenFalse
      if whenTrue instanceof BlockStatement and whenTrue.body.length == 0
        if whenFalse instanceof BlockStatement and whenFalse.body.length == 0
          test
        else
          IfStatement.call(self
            Unary "!", test
            whenFalse
            BlockStatement())
      else
        self.test := test
        self.whenTrue := whenTrue
        self.whenFalse := whenFalse
        self
  IfStatement.prototype := ^Statement.prototype
  IfStatement::constructor := IfStatement
  
  IfStatement::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "if ("
    @test.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {\n"
    let childOptions = incIndent options
    sb.indent childOptions.indent
    @whenTrue.compileAsStatement childOptions, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
    let whenFalse = @whenFalse
    if whenFalse not instanceof BlockStatement or whenFalse.body.length > 0
      sb " else "
      if whenFalse instanceof IfStatement
        whenFalse.compile options, level, false, sb
      else
        sb "{\n"
        sb.indent childOptions.indent
        whenFalse.compileAsStatement childOptions, true, sb
        sb "\n"
        sb.indent options.indent
        sb "}"
        
  IfStatement::walk := #(walker)
    let test = walker(@test) ? @test.walk walker
    let whenTrue = walker(@whenTrue) ? @whenTrue.walk walker
    let whenFalse = walker(@whenFalse) ? @whenFalse.walk walker
    
    if test != @test or whenTrue != @whenTrue or whenFalse != @whenFalse
      If test, whenTrue, whenFalse
    else
      this
  
  exports.IfStatement := IfStatement

let IfExpression = do
  let IfExpression(test as Expression, whenTrue as Expression, whenFalse as Expression = BlockExpression())
    let self = if this instanceof IfExpression then this else ^IfExpression.prototype
    
    if isConst test
      if constValue test
        whenTrue
      else
        whenFalse
    else
      self.test := test
      self.whenTrue := whenTrue
      self.whenFalse := whenFalse
      self
  IfExpression.prototype := ^Expression.prototype
  IfExpression::constructor := IfExpression
  
  IfExpression::toStatement := #-> IfStatement @test, @whenTrue, @whenFalse
  
  IfExpression::compile := #(options, level, lineStart, sb)!
    if level == LEVEL_BLOCK
      @toStatement().compile(options, level, lineStart, sb)
    else
      let wrap = level > LEVEL_INLINE_CONDITION
      if wrap
        sb "("
      let wrapTest = @test instanceof IfExpression
      if wrapTest
        sb "("
      @test.compile options, if wrapTest then LEVEL_INSIDE_PARENTHESES else LEVEL_INLINE_CONDITION, lineStart and not wrap and not wrapTest, sb
      if wrapTest
        sb ")"
      sb " ? "
      @whenTrue.compile options, LEVEL_INLINE_CONDITION, false, sb
      sb " : "
      @whenFalse.compile options, LEVEL_INLINE_CONDITION, false, sb
      if wrap
        sb ")"
  
  IfExpression::type := #-> @_type ?= @whenTrue.type().union(@whenFalse.type())
  
  IfExpression::isLarge := #
    @_isLarge ?= for some part in [@test, @whenTrue, @whenFalse]
      (part instanceofsome [Arr, Obj] and not part.isEmpty()) or part.isLarge()
  
  IfExpression::walk := IfStatement::walk
  
  exports.IfExpression := IfExpression

let If(test, whenTrue, whenFalse)
  if whenTrue instanceof Expression and (not whenFalse or whenFalse instanceof Expression)
    IfExpression test, whenTrue, whenFalse
  else
    IfStatement test, whenTrue, whenFalse
exports.If := If

let Obj = do
  let validateUniqueKeys(elements)!
    let keys = []
    for pair in elements
      let key = pair.key
      if key in keys
        throw Error "Found duplicate key: $(toJSSource key)"
      keys.push key
  
  let Obj(elements as [ObjPair] = [])
    let self = if this instanceof Obj then this else ^Obj.prototype
    validateUniqueKeys elements
    self.elements := elements
    self
  Obj.prototype := ^Expression.prototype
  Obj::constructor := Obj
  
  let compileLarge(elements, options, sb)!
    let childOptions = incIndent options
    for element, i, len in elements
      sb "\n"
      sb.indent childOptions.indent
      let key = element.key
      sb if isAcceptableIdent key
        key
      else
        toJSSource key
      sb ": "
      element.value.compile childOptions, LEVEL_SEQUENCE, false, sb
      if i < len - 1
        sb ","
    sb "\n"
    sb.indent options.indent
  
  let compileSmall(elements, options, sb)!
    if elements.length
      sb " "
      for element, i in elements
        if i > 0
          sb ", "
        let key = element.key
        sb if isAcceptableIdent key
          key
        else
          toJSSource key
        sb ": "
        element.value.compile options, LEVEL_SEQUENCE, false, sb
      sb " "
  
  Obj::compile := #(options, level, lineStart, sb)!
    if lineStart
      sb "("
    sb "{"
    let f = if @isLarge() then compileLarge else compileSmall
    f @elements, options, sb
    sb "}"
    if lineStart
      sb ")"
  
  Obj::type := #-> types.object
  
  Obj::isEmpty := #-> @elements.length == 0
  Obj::isLarge := #
    @_isLarge ?= @elements.length > 4 or for some element in @elements
      (element.value instanceofsome [Arr, Obj] and not element.value.isEmpty()) or element.isLarge()
  
  Obj::walk := #(walker)
    let elements = walkArray(@elements, walker)
    if elements != @elements
      Obj elements
    else
      this
  
  let ObjPair(key as String, mutable value)
    let self = if this instanceof ObjPair then this else ^ObjPair.prototype
    self.key := key
    if value not instanceof Expression
      value := toConst value
    self.value := value
    self
  Obj.Pair := ObjPair
  
  ObjPair::isLarge := #-> @value.isLarge()
  
  ObjPair::walk := #(walker)
    let value = walker(@value) ? @value.walk(walker)
    if value != @value
      ObjPair @key, value
    else
      this
  
  exports.Obj := Obj

let Return = do
  let Return(@node as Expression = Const(void))
    let self = if this instanceof Return then this else ^Return.prototype
    self.node := node
    self
  Return.prototype := ^Statement.prototype
  Return::constructor := Return
  
  Return::compile := #(options, level, lineStart, sb)!
    sb "return"
    unless isConst(@node) and constValue(@node) == void
      sb " "
      @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ";"
  
  Return::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Return node
    else
      this
  
  exports.Return := Return

let Root = do
  let Root(body as [Node] = [], variables as [String] = [], declarations as [String] = [])
    let self = if this instanceof Root then this else ^Root.prototype
    
    validateFuncParamsAndVariables [], variables
    
    self.body := []
    for item in body
      let statement = maybeToStatement item
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
    compileFuncBody(options, sb, @declarations, @variables, @body)
    sb.toString()
  
  Root::toString := #-> @compile()
  
  Root::toFunction := Node::toFunction
  
  Root::isLarge := #-> true
  
  Root::walk := #(walker)
    let body = walkArray(@body, walker)
    if body != @body
      Root body, @variables, @declarations
    else
      this
  
  exports.Root := Root

let This = do
  let This()
    let self = if this instanceof This then this else ^This.prototype
    self
  This.prototype := ^Expression.prototype
  This::constructor := This
  
  This::compile := #(options, level, lineStart, sb)!
    sb "this"
  
  This::walk := #-> this
  
  exports.This := This

let Throw = do
  let Throw(node as Expression)
    let self = if this instanceof Throw then this else ^Throw.prototype
    self.node := node
    self
  Throw.prototype := ^Statement.prototype
  Throw::constructor := Throw
  
  Throw::compile := #(options, level, lineStart, sb)
    sb "throw "
    @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ";"
  
  Throw::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Throw node
    else
      this
  
  exports.Throw := Throw

let Switch = do
  let Switch(node as Expression, cases as [SwitchCase] = [], defaultCase as Node = BlockStatement())
    let self = if this instanceof Switch then this else ^Switch.prototype
    self.node := node
    self.cases := cases
    self.defaultCase := maybeToStatement defaultCase
    self
  Switch.prototype := ^Statement.prototype
  Switch::constructor := Switch
  
  Switch::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "switch ("
    @node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {"
    let childOptions = incIndent options
    for case_ in @cases
      sb "\n"
      sb.indent options.indent
      sb "case "
      case_.node.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
      sb ":"
      if case_.body not instanceof BlockStatement or case_.body.body.length > 0
        sb "\n"
        sb.indent childOptions.indent
        case_.body.compileAsStatement childOptions, true, sb
    if @defaultCase not instanceof BlockStatement or @defaultCase.body.length > 0
      sb "\n"
      sb.indent options.indent
      sb "default:\n"
      sb.indent childOptions.indent
      @defaultCase.compileAsStatement options, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  Switch::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    let cases = walkArray(@cases, walker)
    let defaultCase = walker(@defaultCase) ? @defaultCase.walk(walker)
    if node != @node or cases != @cases or defaultCases != @defaultCases
      Switch node, cases, defaultCase
    else
      this
  
  let SwitchCase(node as Expression, body as Node)
    let self = if this instanceof SwitchCase then this else ^SwitchCase.prototype
    self.node := node
    self.body := maybeToStatement body
    self
  Switch.Case := SwitchCase
  
  SwitchCase::isLarge := #-> true
  
  SwitchCase::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    let body = walker(@body) ? @body.walk(walker)
    if node != @node or body != @body
      SwitchCase(node, body)
    else
      this
  
  exports.Switch := Switch

let TryCatch = do
  let TryCatch(tryBody as Node, catchIdent as Ident, catchBody as Node)
    let self = if this instanceof TryCatch then this else ^TryCatch.prototype
    
    self.tryBody := maybeToStatement tryBody
    self.catchIdent := catchIdent
    self.catchBody := maybeToStatement catchBody
    self
  TryCatch.prototype := ^Statement.prototype
  TryCatch::constructor := TryCatch
  
  TryCatch::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let childOptions = incIndent options
    sb.indent childOptions.indent
    @tryBody.compileAsStatement childOptions, true, sb
    sb "\n"
    sb.indent options.indent
    sb "} catch ("
    @catchIdent.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
    sb ") {\n"
    sb.indent childOptions.indent
    @catchBody.compileAsStatement childOptions, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  TryCatch::walk := #(walker)
    let tryBody = walker(@tryBody) ? @tryBody.walk(walker)
    let catchIdent = walker(@catchIdent) ? @catchIdent.walk(walker)
    let catchBody = walker(@catchBody) ? @catchBody.walk(walker)
    if tryBody != @tryBody or catchIdent != @catchIdent or catchBody != @catchBody
      TryCatch tryBody, catchIdent, catchBody
    else
      this
  
  exports.TryCatch := TryCatch

let TryFinally = do
  let TryFinally(tryBody as Node, finallyBody as Node)
    let self = if this instanceof TryFinally then this else ^TryFinally.prototype
    self.tryBody := maybeToStatement tryBody
    self.finallyBody := maybeToStatement finallyBody
    self
  TryFinally.prototype := ^Statement.prototype
  TryFinally::constructor := TryFinally
  
  TryFinally::compile := #(options, level, lineStart, sb)!
    if level != LEVEL_BLOCK
      throw Error "Cannot compile a statement except on the Block level"
    
    sb "try {\n"
    let childOptions = incIndent(options)
    sb.indent childOptions.indent
    if @tryBody instanceof TryCatch
      @tryBody.tryBody.compileAsStatement childOptions, true, sb
      sb "\n"
      sb.indent options.indent
      sb "} catch ("
      @tryBody.catchIdent.compile options, LEVEL_INSIDE_PARENTHESES, false, sb
      sb ") {\n"
      sb.indent childOptions.indent
      @tryBody.catchBody.compileAsStatement childOptions, true, sb
    else
      @tryBody.compileAsStatement childOptions, true, sb
    sb "\n"
    sb.indent options.indent
    sb "} finally {\n"
    sb.indent childOptions.indent
    @finallyBody.compileAsStatement childOptions, true, sb
    sb "\n"
    sb.indent options.indent
    sb "}"
  
  TryFinally::walk := #(walker)
    let tryBody = walker(@tryBody) ? @tryBody.walk(walker)
    let finallyBody = walker(@finallyBody) ? @finallyBody.walk(walker)
    if tryBody != @tryBody or finallyBody != @finallyBody
      TryCatch tryBody, finallyBody
    else
      this

  exports.TryFinally := TryFinally

let Unary = do
  let Unary(op as String, mutable node)
    let self = if this instanceof Unary then this else ^Unary.prototype
    
    if op not in KNOWN_OPERATORS
      throw Error "Unknown unary operator: $op"
    
    if op == "delete" and (node not instanceof Binary or node.op != ".")
      throw Error "Cannot use delete operator on a non-access"
    
    if node not instanceof Expression
      node := toConst node
    
    if isConst(node) and CONST_OPERATIONS ownskey op
      return Const CONST_OPERATIONS[op](constValue node)
    
    if NONCONST_OPERATIONS ownskey op
      return? NONCONST_OPERATIONS[op](node)
    
    self.op := op
    self.node := node
    self
  Unary.prototype := ^Expression.prototype
  Unary::constructor := Unary
  
  Unary::compile := #(options, level, lineStart, sb)!
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
      if x.type().isSubsetOf types.number
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
          if x.op == "!" and x.node.type().isSubsetOf(types.boolean)
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
  
  Unary::isLarge := #-> @node.isLarge()
  
  Unary::walk := #(walker)
    let node = walker(@node) ? @node.walk(walker)
    if node != @node
      Unary(@op, node)
    else
      this
  
  exports.Unary := Unary

let While(test, body)
  For(null, test, null, body)
exports.While := While