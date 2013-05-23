require! Type: './types'

class MacroHolder
  def constructor(@syntaxes as {}, @macro-name as ->, @word-or-symbol as ->, @one-of as ->, @sequential as ->)
    @by-name := {}
    @by-id := []
    @by-label := {}
    @type-by-id := []
    @operator-names := {}
    @binary-operators := []
    @assign-operators := []
    @prefix-unary-operators := []
    @postfix-unary-operators := []
    @consts := {}
    @serialization := {}
    @helpers := {}
  
  def clone()
    let clone = MacroHolder(@syntaxes, @macro-name, @word-or-symbol, @one-of, @sequential)
    clone.by-name := {} <<< @by-name
    clone.by-id := @by-id.slice()
    clone.by-label := {} <<< @by-label
    clone.type-by-id := @type-by-id.slice()
    clone.operator-names := {} <<< @operator-names
    clone.binary-operators := @binary-operators.slice()
    clone.assign-operators := @assign-operators.slice()
    clone.prefix-unary-operators := @prefix-unary-operators.slice()
    clone.postfix-unary-operators := @postfix-unary-operators.slice()
    clone.consts := {} <<< @consts
    clone.serialization := {} <<< @serialization
    clone.helpers := {} <<< @helpers
    clone.syntaxes := {} <<< @syntaxes
    clone

  def get-by-name(name)
    @by-name![name]
  
  def get-or-add-by-name(name)
    let by-name = @by-name
    if by-name ownskey name
      by-name[name]
    else
      let token = @macro-name name
      let m(parser, index)
        for item in m.data
          returnif item parser, index
      m.token := token
      m.data := []
      by-name[name] := m
  
  def get-or-add-by-names(names as [String])
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
  
  def add-macro(m, mutable macro-id as Number|void, type as Type|String|void)
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
  
  def all-binary-operators() -> @_all-binary-operators ?=
    let result = []
    for array in @binary-operators
      result.push ...array
    result
  
  def add-binary-operator(operators, m, options, macro-id)
    for op in operators by -1
      @operator-names[op] := true
    let precedence = Number(options.precedence) or 0
    for i in @binary-operators.length to precedence
      @binary-operators[i] := []
    let binary-operators = @binary-operators[precedence]
    let data =
      rule: @one-of ...for op in operators
        @word-or-symbol op
      func: m
      right-to-left: not not options.right-to-left
      maximum: options.maximum or 0
      minimum: options.minimum or 0
      invertible: not not options.invertible
    binary-operators.push data
    @_all-binary-operators := null
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type in [\left, \right] then options.type else if options.type? then Type![options.type]
  
  def get-by-label(label)
    @by-label![label]
  
  def add-by-label(label as String, data)
    @by-label[label] := data
  
  def add-assign-operator(operators, m, options, macro-id)
    for op in operators by -1
      @operator-names[op] := true
    let data = 
      rule: @one-of ...for op in operators
        if op == ":="
          @syntaxes.ColonEqual
        else
          @word-or-symbol op
      func: m
    @assign-operators.push data
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type in [\left, \right] then options.type else if options.type? then Type![options.type]
  
  def add-unary-operator(operators, m, options, macro-id)
    for op in operators by -1
      @operator-names[op] := true
    let store = if options.postfix then @postfix-unary-operators else @prefix-unary-operators
    let data =
      rule: @one-of ...for op in operators
        let rule = @word-or-symbol op
        if not r"[a-zA-Z]".test(op)
          if options.postfix
            @sequential(
              @syntaxes.NoSpace
              [\this, rule])
          else
            @sequential(
              [\this, rule]
              @syntaxes.NoSpace)
        else
          rule
      func: m
      standalone: not options ownskey \standalone or not not options.standalone
    store.push data
    if options.label
      @add-by-label options.label, data
    @add-macro m, macro-id, if options.type == \node then options.type else if options.type? then Type![options.type]
  
  def add-serialized-helper(name as String, helper, type, dependencies)!
    let helpers = (@serialization.helpers ?= {})
    helpers[name] := { helper, type, dependencies }
  
  def add-const(name as String, value as Number|String|Boolean|null|void)!
    @consts[name] := value
  
  let serialize-const-value(value)
    switch value
    case 0
      { type: if value is 0 then "+0" else "-0" }
    case Infinity
      { type: "Infinity" }
    case -Infinity
      { type: "-Infinity" }
    default
      if value is NaN
        { type: "NaN" }
      else if value == void
        { type: "void" }
      else
        value
  
  let deserialize-const-value(value)
    if is-object! value and is-string! value.type
      switch value.type
      case "+0"; 0
      case "-0"; -0
      case "Infinity"; Infinity
      case "-Infinity"; -Infinity
      case "NaN"; NaN
      case "void"; void
      default
        throw Error "Unknown value"
    else
      value
  
  def add-serialized-const(name as String)!
    if @consts not ownskey name
      throw Error "Unknown const $name"
    let consts = (@serialization.consts ?= {})
    consts[name] := serialize-const-value(@consts[name])
  
  def add-macro-serialization(serialization as {type: String})!
    let obj = {} <<< serialization
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
  
  def serialize(allow-JS as Boolean)
    let serialization = {} <<< @serialization
    let helpers = serialization!.helpers
    if helpers
      for name, helper of helpers
        for dep, i in helper.dependencies by -1
          if helpers not ownskey dep
            helper.dependencies.splice i, 1
    if allow-JS
      require('./jsutils').to-JS-source(serialization)
    else
      JSON.stringify(serialization)
  
  def deserialize(data, state)!
    // TODO: pass in the output language rather than assume JS
    require! ast: './jsast'
    for name, {helper, type, dependencies} of (data!.helpers ? {})
      @add-helper name, ast.fromJSON(helper), Type.fromJSON(type), dependencies
    
    for name, value of (data!.consts ? {})
      @add-const name, deserialize-const-value value
    
    state.deserialize-macros(data)
  
  def add-helper(name as String, value, type as Type, dependencies as [String])
    if @helpers ownskey name
      throw Error "Trying to overwrite helper $name"
    @helpers[name] := { value, type, dependencies }

  def has-helper(name as String)
    @helpers ownskey name

  def get-helper(name as String)
    if @helpers ownskey name
      @helpers[name].value
    else
      throw Error "No such helper: $name"

  def helper-type(name as String)
    if @helpers ownskey name
      @helpers[name].type
    else
      throw Error "No such helper: $name"

  def helper-dependencies(name as String)
    if @helpers ownskey name
      @helpers[name].dependencies
    else
      throw Error "No such helper: $name"

module.exports := MacroHolder