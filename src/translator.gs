require! './ast'
let AstNode = ast.Node
require! Type: './types'
let {Node: ParserNode} = require('./parser')

let needs-caching(item)
  return item not instanceofsome [ast.Ident, ast.Const, ast.This, ast.Arguments]

class Scope
  let get-id = do
    let mutable id = -1
    # -> id += 1
  def constructor(@options = {}, @bound = false, @used-tmps = {}, @helpers = {}, variables, @tmps = {})
    @variables := if variables then { extends variables } else {}
    @has-bound := false
    @used-this := false
    @has-stop-iteration := false
    @id := get-id()

  def maybe-cache(item as ast.Expression, type as Type = Type.any, func as (AstNode, AstNode, Boolean) -> AstNode)
    unless needs-caching item
      func item, item, false
    else
      let ident = @reserve-ident item.line, item.column, \ref, type
      let result = func ast.Assign(item.line, item.column, ident, item), ident, true
      @release-ident(ident)
      result
  
  def reserve-ident(line as Number, column as Number, name-part = \ref, type as Type = Type.any)
    for first i in 1 to Infinity
      let name = if i == 1 then "_$(name-part)" else "_$(name-part)$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        let ident = ast.Ident line, column, name
        @add-variable ident, type
        ident

  def reserve-param(line as Number, column as Number)
    for first i in 1 to Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        ast.Ident line, column, name

  def get-tmp(line as Number, column as Number, id, name, type as Type = Type.any)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserve-ident line, column, name or \tmp, type

  def release-tmp(id)!
    if @tmps ownskey id
      @release-ident(delete @tmps[id])

  def release-tmps()!
    for id of @tmps
      @release-tmp(id)
    @tmps := {}

  def release-ident(ident as ast.Ident)!

    unless @used-tmps ownskey ident.name
      throw Error "Trying to release a non-reserved ident: $(ident.name)"

    delete @used-tmps[ident.name]

  def mark-as-param(ident as ast.Ident)!
    @remove-variable(ident)

  def add-helper(name)!
    @helpers[name] := true
  
  def fill-helper-dependencies()!
    let mutable helpers = @helpers
    let mutable to-add = {}
    while true
      for helper of helpers
        if HELPERS.has helper
          for dep in HELPERS.dependencies(helper) by -1
            if helpers not ownskey dep
              to-add[dep] := true
      
      for helper of to-add
        @add-helper helper
      else
        break
      helpers := to-add
      to-add := {}

  let lower-sorter(a, b) -> a.to-lower-case() <=> b.to-lower-case()

  def get-helpers()
    let helpers = for k of @helpers
      k

    helpers.sort lower-sorter

  def add-variable(ident as ast.Ident, type as Type = Type.any, is-mutable as Boolean)!
    @variables[ident.name] := {
      type
      is-mutable
    }

  def has-variable(ident as ast.Ident)
    if typeof @variables[ident.name] == \object
      @variables haskey ident.name
    else
      false
  
  def has-own-variable(ident as ast.Ident)
    @variables ownskey ident.name
  
  def is-variable-mutable(ident as ast.Ident)
    @variables[ident.name]?.is-mutable

  def remove-variable(ident as ast.Ident)!
    delete @variables[ident.name]

  def get-variables()
    let variables = for k of @variables; k

    variables.sort lower-sorter

  def clone(bound)
    if bound
      @has-bound := true
    Scope(@options, bound, { extends @used-tmps }, @helpers, @variables, { extends @tmps })

let wrap-return(x)
  x.mutate-last #(n) -> ast.Return n.line, n.column, n

let identity(x) -> x

let make-auto-return(x) -> if x then wrap-return else identity

let HELPERS = new class Helpers
  def constructor()
    @data := {}
    @types := {}
    @deps := {}

  def add(name as String, value as ast.Expression, type as Type, dependencies as [String])
    @data[name] := value
    @types[name] := type
    @deps[name] := dependencies

  def has(name as String)
    @data ownskey name

  def get(name as String)
    if @data ownskey name
      @data[name]
    else
      throw Error "No such helper: $name"
  
  def type(name as String)
    if @types ownskey name
      @types[name]
    else
      throw Error "No such helper: $name"
  
  def dependencies(name as String)
    if @deps ownskey name
      @deps[name]
    else
      throw Error "No such helper: $name"

class GeneratorBuilder
  def constructor(@line as Number, @column as Number, @scope as Scope, states, @current-state = 1, state-ident, pending-finallies-ident, @finallies = [], @catches = [], @current-catch = [])
    @states := states ? [
      [#-> ast.Throw line, column, ast.Ident line, column, \StopIteration]
      []
    ]
    @state-ident := state-ident ? scope.reserve-ident line, column, \state, Type.number
    @pending-finallies-ident := pending-finallies-ident ? scope.reserve-ident line, column, \finallies, Type.undefined.function().array()
  
  def add(t-node)
    unless t-node instanceof GeneratorBuilder
      unless typeof t-node == \function
        throw TypeError "Expected node to be a GeneratorBuilder or Function, got $(typeof! t-node)"
      @states[@current-state].push t-node
      this
    else
      t-node
  
  def yield(line as Number, column as Number, t-node)
    let branch = @branch()
    @states[@current-state].push(
      #@-> ast.Assign line, column, @state-ident, branch.state
      #-> ast.Return line, column, t-node())
    branch.builder
  
  def goto(line as Number, column as Number, t-state)!
    @states[@current-state].push(
      #@ -> ast.Assign line, column, @state-ident, t-state()
      #-> ast.Break(line, column))
  
  def pending-finally(line as Number, column as Number, t-finally-body)
    let ident = @scope.reserve-ident line, column, \finally, Type.undefined.function()
    @scope.remove-variable ident
    @finallies.push #-> ast.Func line, column, ident, [], [], t-finally-body()
    @states[@current-state].push #@-> ast.Call line, column,
      ast.Access line, column, @pending-finallies-ident, \push
      [ident]
    this
  
  def run-pending-finally(line as Number, column as Number)
    @states[@current-state].push #@-> ast.Call line, column,
      ast.Access line, column,
        ast.Call line, column,
          ast.Access line, column, @pending-finallies-ident, \pop
        \call
      [ast.This(line, column)]
    this
  
  def noop(line as Number, column as Number)
    if @states[@current-state].length
      let branch = @branch()
      @states[@current-state].push #@ -> ast.Assign line, column, @state-ident, branch.state
      branch.builder
    else
      this
  
  def enter-try-catch(line as Number, column as Number)
    let fresh = @noop(line, column)
    fresh.current-catch :=
      * ...fresh.current-catch
      * * fresh.current-state
    fresh
  
  def exit-try-catch(line as Number, column as Number, t-ident, t-post-state)
    if @current-catch.length == 0
      throw Error "Unable to exit-try-catch without first using enter-try-catch"
    @goto line, column, t-post-state
    let fresh = @noop(line, column)
    let catch-states = fresh.current-catch.pop()
    catch-states.splice catch-states.index-of(fresh.current-state), 1
    fresh.catches.push {
      try-states: catch-states
      t-ident
      catch-state: fresh.current-state
    }
    fresh
  
  def branch()
    let state = @states.length
    if @current-catch.length
      @current-catch[* - 1].push state
    @states.push []
    {
      state
      builder: GeneratorBuilder(@line, @column, @scope, @states, state, @state-ident, @pending-finallies-ident, @finallies, @catches, @current-catch)
    }
  
  def create()
    if @current-catch.length
      throw Error "Cannot create a generator if there are stray catches"
    @states[@current-state].push #@-> ast.Assign @line, @column, @state-ident, 0
    let body =
      * ast.Assign @line, @column, @state-ident, 1
    let close = @scope.reserve-ident @line, @column, \close, Type.undefined.function()
    @scope.remove-variable(close)
    if @finallies.length == 0
      @scope.remove-variable(@pending-finallies-ident)
      body.push ast.Func @line, @column, close, [], [], ast.Block @line, @column,
        * ast.Assign @line, @column, @state-ident, 0
    else
      body.push ast.Assign @line, @column, @pending-finallies-ident, ast.Arr(@line, @column)
      body.push ...(for f in @finallies; f())
      let inner-scope = @scope.clone(false)
      let f = inner-scope.reserve-ident @line, @column, \f, Type.undefined.function().union(Type.undefined)
      body.push ast.Func @line, @column, close, [], inner-scope.get-variables(), ast.Block @line, @column,
        * ast.Assign @line, @column, @state-ident, 0
        * ast.Assign @line, @column,
            f
            ast.Call @line, @column,
              ast.Access @line, @column,
                @pending-finallies-ident
                \pop
        * ast.If @line, @column,
            f
            ast.TryFinally @line, @column,
              ast.Call @line, @column, f
              ast.Call @line, @column, close
    let scope = @scope
    let err = scope.reserve-ident @line, @column, \e, Type.any
    let catches = @catches
    let state-ident = @state-ident
    body.push ast.Return @line, @column, ast.Obj @line, @column,
      * ast.Obj.Pair @line, @column, \close, close
      * ast.Obj.Pair @line, @column, \iterator, ast.Func @line, @column, null, [], [], ast.Return(@line, @column, ast.This(@line, @column))
      * ast.Obj.Pair @line, @column, \next, ast.Func @line, @column, null, [], [], ast.While(@line, @column, true,
          ast.TryCatch @line, @column,
            ast.Switch @line, @column,
              state-ident
              for state, i in @states
                let items = for item in state; item()
                ast.Switch.Case items[0].line, items[0].column, i, ast.Block @line, @column, [
                  ...items
                  ast.Break items[* - 1].line, items[* - 1].column
                ]
              ast.Throw @line, @column,
                ast.Call @line, @column,
                  ast.Ident @line, @column, \Error
                  [ast.Binary @line, @column, "Unknown state: ", "+", state-ident]
            err
            for reduce catch-info in catches by -1, current = ast.Block @line, @column, [ast.Call(@line, @column, close), ast.Throw @line, @column, err]
              let err-ident = catch-info.t-ident()
              scope.add-variable err-ident
              ast.If @line, @column,
                ast.Or @line, @column, ...(for state in catch-info.try-states; ast.Binary(@line, @column, state-ident, "===", state))
                ast.Block @line, @column,
                  * ast.Assign @line, @column, err-ident, err
                  * ast.Assign @line, @column, state-ident, catch-info.catch-state
                current)
    ast.Block @line, @column, body

let flatten-spread-array(elements)
  let result = []
  let mutable changed = false
  for element in elements
    if element instanceof ParserNode.Spread and element.node instanceof ParserNode.Array
      result.push ...element.node.elements
      changed := true
    else
      result.push element

  if changed
    flatten-spread-array result
  else
    elements

let generator-translate = do
  let generator-translators =
    Block: #(node, scope, mutable builder, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: block with label in generator"
      for reduce subnode in node.nodes, b = builder
        generator-translate subnode, scope, b, break-state, continue-state
    
    Break: #(node, scope, mutable builder, break-state)
      if node.label?
        throw Error "Not implemented: break with label in a generator"
      if not break-state?
        throw Error "break found outside of a loop"
      
      builder.goto node.line, node.column, break-state
      builder
    
    Continue: #(node, scope, mutable builder, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: continue with label in a generator"
      if not break-state?
        throw Error "break found outside of a loop"
      
      builder.goto node.line, node.column, continue-state
      builder
    
    For: #(node, scope, mutable builder)
      if node.label?
        throw Error "Not implemented: for with label in generator"
      if node.init?
        builder := generator-translate node.init, scope, builder
      let step-branch = builder.branch()
      step-branch.builder := generator-translate node.step, scope, step-branch.builder
      let test-branch = builder.branch()
      let t-test = translate node.test, scope, \expression, false
      let body-branch = builder.branch()
      body-branch.builder := generator-translate node.body, scope, body-branch.builder, #-> post-branch.state, #-> step-branch.state
      let post-branch = builder.branch()
      builder.goto node.line, node.column, #-> test-branch.state
      step-branch.builder.goto node.step.line, node.step.column, #-> test-branch.state
      test-branch.builder.goto node.test.line, node.test.column, #-> ast.IfExpression node.test.line, node.test.column, t-test(), body-branch.state, post-branch.state
      body-branch.builder.goto node.body.line, node.body.column, #-> step-branch.state
      post-branch.builder
    
    ForIn: #(node, scope, mutable builder)
      if node.label?
        throw Error "Not implemented: for-in with label in generator"
      let t-key = translate node.key, scope, \left-expression
      let t-object = translate node.object, scope, \expression
      let keys = scope.reserve-ident node.line, node.column, \keys, Type.string.array()
      let mutable key = void
      let get-key()
        if key?
          key
        else
          key := t-key()
          if key not instanceof ast.Ident
            throw Error("Expected an Ident for a for-in key")
          scope.add-variable key, Type.string
          key
      let index = scope.reserve-ident node.line, node.column, \i, Type.number
      let length = scope.reserve-ident node.line, node.column, \len, Type.number
      builder.add #
        ast.Block node.line, node.column,
          * ast.Assign node.line, node.column, keys, ast.Arr(node.line, node.column)
          * ast.ForIn node.line, node.column, get-key(), t-object(),
              ast.Call node.line, node.column,
                ast.Access(node.line, node.column, keys, \push)
                [get-key()]
          * ast.Assign node.line, node.column, index, 0
          * ast.Assign node.line, node.column, length, ast.Access(node.line, node.column, keys, \length)
      let step-branch = builder.branch()
      step-branch.builder.add #-> ast.Unary node.line, node.column, "++", index
      let test-branch = builder.branch()
      let body-branch = builder.branch()
      body-branch.builder.add #
        ast.Assign node.line, node.column, get-key(), ast.Access node.line, node.column, keys, index
      body-branch.builder := generator-translate node.body, scope, body-branch.builder, #-> post-branch.state, #-> step-branch.state
      let post-branch = builder.branch()
      builder.goto node.line, node.column, #-> test-branch.state
      step-branch.builder.goto node.line, node.column, #-> test-branch.state
      test-branch.builder.goto node.line, node.column, #-> ast.IfExpression node.line, node.column, ast.Binary(node.line, node.column, index, "<", length), body-branch.state, post-branch.state
      body-branch.builder.goto node.body.line, node.body.column, #-> step-branch.state
      post-branch.builder
    
    If: #(node, scope, mutable builder, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: if with label in generator"
      let t-test = translate node.test, scope, \expression
      let when-true-branch = builder.branch()
      let g-when-true = generator-translate node.when-true, scope, when-true-branch.builder, break-state, continue-state
      let mutable when-false = node.when-false
      if when-false instanceof ParserNode.Nothing
        when-false := null
      let when-false-branch = if when-false? then builder.branch()
      let g-when-false = if when-false? then generator-translate node.when-false, scope, when-false-branch.builder, break-state, continue-state
      let post-branch = builder.branch()
      builder.goto node.line, node.column, #-> ast.IfExpression node.test.line, node.test.column, t-test(), when-true-branch.state, if when-false-branch? then when-false-branch.state else post-branch.state
      g-when-true.goto node.when-true.line, node.when-true.column, #-> post-branch.state
      if when-false?
        g-when-false.goto node.when-false.line, node.when-false.column, #-> post-branch.state
      post-branch.builder
    
    TmpWrapper: #(node, scope, mutable builder, break-state, continue-state)
      builder := generator-translate node.node, scope, builder, break-state, continue-state
      for tmp in node.tmps by -1
        scope.release-tmp tmp
      builder
    
    TryCatch: #(node, scope, mutable builder, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: try-catch with label in generator"
      builder := builder.enter-try-catch(node.line, node.column)
      builder := generator-translate node.try-body, scope, builder, break-state, continue-state
      builder := builder.exit-try-catch node.try-body.line, node.try-body.column, (translate node.catch-ident, scope, \left-expression, false), #-> post-branch.state
      builder := generator-translate node.catch-body, scope, builder, break-state, continue-state
      let post-branch = builder.branch()
      builder.goto node.line, node.column, #-> post-branch.state
      post-branch.builder
    
    TryFinally: #(node, scope, mutable builder, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: try-finally with label in generator"
      builder := builder.pending-finally node.line, node.column, translate node.finally-body, scope, \top-statement
      builder := generator-translate node.try-body, scope, builder, break-state, continue-state
      builder.run-pending-finally(node.line, node.column)
    
    Yield: #(node, scope, builder)
      builder.yield node.line, node.column, translate node.node, scope, \expression
  #(node, scope, builder, break-state, continue-state)
    if generator-translators ownskey node.constructor.capped-name
      let ret = generator-translators[node.constructor.capped-name](node, scope, builder, break-state, continue-state)
      if ret not instanceof GeneratorBuilder
        throw Error "Translated non-GeneratorBuilder: $(typeof! ret)"
      ret
    else
      builder.add translate node, scope, \statement, false

let array-translate(line as Number, column as Number, elements, scope, replace-with-slice, allow-array-like, unassigned)
  let translated-items = []
  let mutable current = []
  translated-items.push(current)
  for element in flatten-spread-array elements
    if element instanceof ParserNode.Spread
      translated-items.push
        t-node: translate element.node, scope, \expression, null, unassigned
        type: element.node.type()
      current := []
      translated-items.push current
    else
      current.push translate element, scope, \expression, null, unassigned

  if translated-items.length == 1
    #-> ast.Arr line, column, for t-item in translated-items[0]; t-item()
  else
    for translated-item, i in translated-items by -1
      if i %% 2
        if translated-item.length > 0
          translated-items[i] := #
            let items = for t-item in translated-item; t-item()
            ast.Arr items[0].line, items[0].column, items
        else
          translated-items.splice i, 1
      else
        translated-items[i] := #
          let node = translated-item.t-node()
          if translated-item.type.is-subset-of Type.array
            node
          else
            scope.add-helper \__to-array
            ast.Call node.line, node.column,
              ast.Ident node.line, node.column, \__to-array
              [node]

    if translated-items.length == 1
      #
        let array = translated-items[0]()
        if replace-with-slice and array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array
          ast.Call line, column,
            ast.Access(line, column, ast.Ident(line, column, \__slice), \call)
            array.args
        else if allow-array-like and array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array and array.args[0] instanceof ast.Arguments
          array.args[0]
        else
          array
    else
      #
        let head = translated-items[0]()
        let rest = for item in translated-items[1 to -1]
          item()
        ast.Call line, column,
          ast.Access line, column, head, \concat
          rest

let translators =
  Access: #(node, scope, location, auto-return, unassigned)
    let t-parent = translate node.parent, scope, \expression, null, unassigned
    let t-child = translate node.child, scope, \expression, null, unassigned
    #-> auto-return ast.Access(node.line, node.column, t-parent(), t-child())

  Args: #(node, scope, location, auto-return)
    #-> auto-return ast.Arguments(node.line, node.column)

  Array: #(node, scope, location, auto-return, unassigned)
    let t-arr = array-translate node.line, node.column, node.elements, scope, true, false, unassigned
    #-> auto-return t-arr()

  Assign: do
    let ops = {
      "="
      "*="
      "/="
      "%="
      "+="
      "-="
      "<<="
      ">>="
      ">>>="
      "&="
      "|="
      "^="
    }
    #(node, scope, location, auto-return, unassigned)
      let op = node.op
      let t-left = translate node.left, scope, \left-expression
      let t-right = translate node.right, scope, \expression, null, unassigned
      if unassigned and node.left instanceof ParserNode.Ident
        if op == "=" and unassigned[node.left.name] and node.right.is-const() and node.right.const-value() == void
          return #-> ast.Noop(node.line, node.column)
        unassigned[node.left.name] := false
      
      #
        let left = t-left()
        let right = t-right()
        if op == "=" and location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name? and scope.has-own-variable(left) and not scope.is-variable-mutable(left)
          scope.remove-variable left
          let func = ast.Func(left.line, left.column, left, right.params, right.variables, right.body, right.declarations)
          if auto-return != identity
            ast.Block node.line, node.column,
              * func
              * auto-return left
          else
            func
        else
          auto-return ast.Binary(node.line, node.column, left, op, right)

  Binary: #(node, scope, location, auto-return, unassigned)
    let t-left = translate node.left, scope, \expression, null, unassigned
    let t-right = translate node.right, scope, \expression, null, unassigned
    #-> auto-return ast.Binary(node.line, node.column, t-left(), node.op, t-right())

  Block: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-nodes = translate-array node.nodes, scope, location, auto-return, unassigned
    # -> ast.Block node.line, node.column, (for t-node in t-nodes; t-node()), t-label?()

  Break: #(node, scope)
    let t-label = node.label and translate node.label, scope, \label
    #-> ast.Break(node.line, node.column, t-label?())
  
  Call: #(node, scope, location, auto-return, unassigned)
    let t-func = translate node.func, scope, \expression, null, unassigned
    let is-apply = node.is-apply
    let is-new = node.is-new
    let args = node.args
    if is-apply and (args.length == 0 or args[0] not instanceof ParserNode.Spread)
      let t-start = if args.length == 0 then #-> ast.Const(node.line, node.column, void) else translate(args[0], scope, \expression, null, unassigned)
      let t-arg-array = array-translate(node.line, node.column, args[1 to -1], scope, false, true, unassigned)
      #
        let func = t-func()
        let start = t-start()
        let arg-array = t-arg-array()
        if arg-array instanceof ast.Arr
          auto-return ast.Call node.line, node.column,
            ast.Access node.line, node.column, func, \call
            [start, ...arg-array.elements]
        else
          auto-return ast.Call node.line, node.column,
            ast.Access node.line, node.column, func, \apply
            [start, arg-array]
    else
      let t-arg-array = array-translate(node.line, node.column, args, scope, false, true, unassigned)
      #
        let func = t-func()
        let arg-array = t-arg-array()
        if is-apply
          async set-array, array <- scope.maybe-cache arg-array, Type.array
          scope.add-helper \__slice
          auto-return ast.Call node.line, node.column,
            ast.Access node.line, node.column, func, \apply
            [
              ast.Access node.line, node.column, set-array, 0
              ast.Call node.line, node.column,
                ast.Access node.line, node.column,
                  ast.Ident node.line, node.column, \__slice
                  \call
                [array, ast.Const node.line, node.column, 1]
            ]
        else if arg-array instanceof ast.Arr
          auto-return ast.Call node.line, node.column,
            func
            arg-array.elements
            is-new
        else if is-new
          scope.add-helper \__new
          auto-return ast.Call node.line, node.column,
            ast.Ident(node.line, node.column, \__new)
            [func, arg-array]
        else if func instanceof ast.Binary and func.op == "."
          async set-parent, parent <- scope.maybe-cache func.left, Type.function
          auto-return ast.Call node.line, node.column,
            ast.Access node.line, node.column, set-parent, func.right, \apply
            [parent, arg-array]
        else
          auto-return ast.Call node.line, node.column,
            ast.Access node.line, node.column, func, \apply
            [ast.Const(node.line, node.column, void), arg-array]
  
  Comment: #(node, scope, location, auto-return) -> #-> ast.Comment(node.line, node.column, node.text)
  
  Const: #(node, scope, location, auto-return) -> #-> auto-return ast.Const(node.line, node.column, node.value)
  
  Continue: #(node, scope)
    let t-label = node.label and translate node.label, scope, \label
    #-> ast.Continue(node.line, node.column, t-label?())

  Debugger: #(node) -> #-> ast.Debugger(node.line, node.column)

  Def: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray def"

  Eval: #(node, scope, location, auto-return, unassigned)
    let t-code = translate node.code, scope, \expression, null, unassigned
    #-> auto-return ast.Eval node.line, node.column, t-code()

  For: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-init = if node.init? then translate node.init, scope, \expression, null, unassigned
    // don't send along the normal unassigned array, since the loop could be repeated thus requiring reset to void.
    let t-test = if node.test? then translate node.test, scope, \expression
    let t-step = if node.step? then translate node.step, scope, \expression
    let t-body = translate node.body, scope, \statement
    # -> ast.For node.line, node.column,
      t-init?()
      t-test?()
      t-step?()
      t-body()
      t-label?()

  ForIn: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-key = translate node.key, scope, \left-expression
    let t-object = translate node.object, scope, \expression, null, unassigned
    let t-body = translate node.body, scope, \statement
    #
      let key = t-key()
      if key not instanceof ast.Ident
        throw Error("Expected an Ident for a for-in key")
      scope.add-variable key, Type.string
      ast.ForIn(node.line, node.column, key, t-object(), t-body(), t-label?())

  Function: do
    let primitive-types = {
      Boolean: \boolean
      String: \string
      Number: \number
      Function: \function
    }
    let make-type-check-test(ident, type, scope)
      if primitive-types ownskey type
        ast.Binary ident.line, ident.column,
          ast.Unary ident.line, ident.column, \typeof, ident
          "!=="
          primitive-types[type]
      else if type == \Array
        scope.add-helper \__is-array
        ast.Unary ident.line, ident.column,
          "!"
          ast.Call ident.line, ident.column,
            ast.Ident ident.line, ident.column, \__is-array
            [ident]
      else if type == \Object
        scope.add-helper \__is-object
        ast.Unary ident.line, ident.column,
          "!"
          ast.Call ident.line, ident.column,
            ast.Ident ident.line, ident.column, \__is-object
            [ident]
      else
        ast.Unary ident.line, ident.column,
          "!"
          ast.Binary ident.line, ident.column,
            ident
            \instanceof
            ast.Ident ident.line, ident.column, type
    let article(word)
      if r"^[aeiou]"i.test(word)
        "an"
      else
        "a"
    let with-article(word)
      "$(article word) $word"
    let build-access-string-node(accesses)
      if accesses.length == 0
        []
      else if accesses[0] instanceof ast.Const
        [
          if typeof accesses[0].value == \string and ast.is-acceptable-ident(accesses[0].value)
            ".$(accesses[0].value)"
          else
            "[$(JSON.stringify accesses[0].value)]"
          ...build-access-string-node(accesses[1 to -1])
        ]
      else
        [
          "["
          accesses[0]
          "]"
          ...build-access-string-node(accesses[1 to -1])
        ]
    let translate-type-checks =
      Ident: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident.line, ident.column, ident, ...accesses
        scope.add-helper \__typeof
        let result = ast.If ident.line, ident.column,
          make-type-check-test access, node.name, scope
          ast.Throw ident.line, ident.column,
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \TypeError
              [ast.BinaryChain ident.line, ident.column, "+",
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be $(with-article node.name), got "
                ast.Call ident.line, ident.column,
                  ast.Ident ident.line, ident.column, \__typeof
                  [access]]
        if not has-default-value and node.name == \Boolean
          {
            check: ast.If ident.line, ident.column,
              ast.Binary ident.line, ident.column, ident, "==", ast.Const ident.line, ident.column, null
              ast.Assign ident.line, ident.column, ident, ast.Const(ident.line, ident.column, false)
              result
            type: Type.boolean
          }
        else
          {
            check: result
            type: if primitive-types ownskey node.name
              Type[primitive-types[node.name]]
            else
              Type.any // FIXME
          }
      Access: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident.line, ident.column, ident, ...accesses
        scope.add-helper \__typeof
        let type = translate(node, scope, \expression)()
        {
          check: ast.If ident.line, ident.column,
            ast.Unary ident.line, ident.column,
              "!"
              ast.Binary ident.line, ident.column,
                access
                \instanceof
                type
            ast.Throw ident.line, ident.column,
              ast.Call ident.line, ident.column,
                ast.Ident ident.line, ident.column, \TypeError
                [ast.BinaryChain ident.line, ident.column, "+",
                  "Expected $(ident.name)"
                  ...build-access-string-node(accesses)
                  " to be $(with-article type.right.value), got "
                  ast.Call ident.line, ident.column,
                    ast.Ident ident.line, ident.column, \__typeof
                    [access]]
          type: Type.any // FIXME
        }
      TypeUnion: #(ident, node, scope, has-default-value, accesses)
        // TODO: cache typeof ident if requested more than once.
        let access = ast.Access ident.line, ident.column, ident, ...accesses
        scope.add-helper \__typeof
        let mutable check = void
        let mutable has-boolean = false
        let mutable has-void = false
        let mutable has-null = false
        let names = []
        let tests = []
        let types = []
        for type in node.types
          if type instanceof ParserNode.Const
            if type.value == null
              has-null := true
              names.push \null
              types.push Type.null
            else if type.value == void
              has-void := true
              names.push \undefined
              types.push Type.undefined
            else
              throw Error "Unknown const value for typechecking: $(String type.value)"
          else if type instanceof ParserNode.Ident
            if type.name == \Boolean
              has-boolean := true
            names.push type.name
            tests.push make-type-check-test access, type.name, scope
            types.push if primitive-types ownskey type.name
              Type[primitive-types[type.name]]
            else
              Type.any // FIXME
          else
            throw Error "Not implemented: typechecking for non-idents/consts within a type-union"

        if has-null and has-void and not has-default-value
          tests.unshift ast.Binary ident.line, ident.column, access, "!=", null
        let mutable result = ast.If ident.line, ident.column,
          ast.And ident.line, ident.column, ...tests
          ast.Throw ident.line, ident.column,
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \TypeError
              [ast.BinaryChain ident.line, ident.column, "+",
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be $(with-article names.join ' or '), got "
                ast.Call ident.line, ident.column,
                  ast.Ident ident.line, ident.column, \__typeof
                  [access]]

        if not has-default-value
          if has-null or has-void
            if has-null xor has-void
              result := ast.If ident.line, ident.column,
                ast.Binary ident.line, ident.column, access, "==", ast.Const ident.line, ident.column, null
                ast.Assign ident.line, ident.column, access, ast.Const ident.line, ident.column, if has-null then null else void
                result
          else if has-boolean
            result := ast.If ident.line, ident.column,
              ast.Binary ident.line, ident.column, access, "==", ast.Const ident.line, ident.column, null
              ast.Assign ident.line, ident.column, access, ast.Const ident.line, ident.column, false
              result
        {
          check: result
          type: for reduce type in types by -1, current = Type.none
            current.union(type)
        }
      TypeFunction: #(ident, node, scope, has-default-value, accesses)
        translate-type-checks.Ident(ident, { name: \Function }, scope, has-default-value, accesses)
      TypeArray: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident.line, ident.column, ident, ...accesses
        scope.add-helper \__is-array
        let index = scope.reserve-ident ident.line, ident.column, \i, Type.number
        let length = scope.reserve-ident ident.line, ident.column, \len, Type.number
        let sub-check = translate-type-check(ident, node.subtype, scope, false, [...accesses, index])
        let result = ast.If ident.line, ident.column,
          ast.Unary ident.line, ident.column,
            "!"
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \__is-array
              [access]
          ast.Throw ident.line, ident.column,
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \TypeError
              [ast.BinaryChain ident.line, ident.column, "+",
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be an Array, got "
                ast.Call ident.line, ident.column,
                  ast.Ident ident.line, ident.column, \__typeof
                  [access]]
          ast.For ident.line, ident.column,
            ast.Block ident.line, ident.column,
              * ast.Assign ident.line, ident.column, index, ast.Const ident.line, ident.column, 0
              * ast.Assign ident.line, ident.column, length, ast.Access ident.line, ident.column, access, \length
            ast.Binary ident.line, ident.column, index, "<", length
            ast.Unary ident.line, ident.column, "++", index
            sub-check.check
        scope.release-ident index
        scope.release-ident length
        {
          check: result
          type: sub-check.type.array()
        }
      TypeObject: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident.line, ident.column, ident, ...accesses
        scope.add-helper \__is-object
        let type-data = {}
        
        let result = ast.If ident.line, ident.column,
          ast.Unary ident.line, ident.column,
            "!"
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \__is-object
              [access]
          ast.Throw ident.line, ident.column,
            ast.Call ident.line, ident.column,
              ast.Ident ident.line, ident.column, \TypeError
              [ast.BinaryChain ident.line, ident.column, "+",
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be an Object, got "
                ast.Call ident.line, ident.column,
                  ast.Ident ident.line, ident.column, \__typeof
                  [access]]
          for reduce {key, value} in node.pairs, current = ast.Noop(ident.line, ident.column)
            if key instanceof ParserNode.Const
              let {check, type} = translate-type-check(ident, value, scope, false, [...accesses, ast.Const key.line, key.column, key.value])
              type-data[key.value] := type
              ast.Block ident.line, ident.column,
                * current
                * check
        
        {
          check: result
          type: Type.make-object type-data
        }
    let translate-type-check(ident, node, scope, has-default-value, accesses)
      unless translate-type-checks ownskey node.constructor.capped-name
        throw Error "Unknown type: $(String node.constructor.capped-name)"

      translate-type-checks[node.constructor.capped-name] ident, node, scope, has-default-value, accesses
    let translate-param-types = {
      Param: #(param, scope, inner)
        let mutable ident = translate(param.ident, scope, \param)()
        if param.ident instanceof ParserNode.Tmp
          scope.mark-as-param ident

        let later-init = []
        if ident instanceof ast.Binary and ident.op == "." and ident.right instanceof ast.Const and typeof ident.right.value == \string
          let tmp = ast.Ident ident.line, ident.column, ident.right.value
          later-init.push ast.Binary(ident.line, ident.column, ident, "=", tmp)
          ident := tmp

        unless ident instanceof ast.Ident
          throw Error "Expecting param to be an Ident, got $(typeof! ident)"
        
        let type-check = if param.as-type then translate-type-check(ident, param.as-type, scope, param.default-value?, [])
        // TODO: mark the param as having a type
        if inner
          scope.add-variable ident, type-check?.type, param.is-mutable

        let init = []
        if param.default-value?
          init.push ast.If ident.line, ident.column,
            ast.Binary ident.line, ident.column, ident, "==", ast.Const ident.line, ident.column, null
            ast.Assign ident.line, ident.column, ident, translate(param.default-value, scope, \expression)()
            type-check?.check
        else if type-check
          init.push type-check.check
        {
          init: [...init, ...later-init]
          ident
          spread: not not param.spread
        }

      Array: #(array, scope, inner)
        let array-ident = if inner then scope.reserve-ident array.line, array.column, \p, Type.array else scope.reserve-param(array.line, array.column)
        let init = []
        let mutable found-spread = -1
        let mutable spread-counter = void
        for p, i, len in array.elements
          let param = translate-param p, scope, true
          unless param.spread
            if param.ident?
              if found-spread == -1
                init.push ast.Assign param.ident.line, param.ident.column,
                  param.ident
                  ast.Access param.ident.line, param.ident.column, array-ident, i
              else
                let diff = i - found-spread - 1
                init.push ast.Assign param.ident.line, param.ident.column,
                  param.ident
                  ast.Access param.ident.line, param.ident.column,
                    array-ident
                    if diff == 0 then spread-counter else ast.Binary param.ident.line, param.ident.column, spread-counter, "+", diff
          else
            if found-spread != -1
              throw Error "Encountered multiple spread parameters"
            found-spread := i
            scope.add-helper \__slice
            if i == len - 1
              init.push ast.Assign param.ident.line, param.ident.column,
                param.ident
                ast.Call param.ident.line, param.ident.column,
                  ast.Access param.ident.line, param.ident.column,
                    ast.Ident param.ident.line, param.ident.column, \__slice
                    \call
                  [array-ident, ...(if i == 0 then [] else [ast.Const(param.ident.line, param.ident.column, i)])]
            else
              spread-counter := scope.reserve-ident param.ident.line, param.ident.column, \i, Type.number
              init.push ast.Assign param.ident.line, param.ident.column,
                param.ident
                ast.IfExpression param.ident.line, param.ident.column,
                  ast.Binary param.ident.line, param.ident.column,
                    i
                    "<"
                    ast.Assign param.ident.line, param.ident.column,
                      spread-counter
                      ast.Binary param.ident.line, param.ident.column,
                        ast.Access param.ident.line, param.ident.column, array-ident, \length
                        "-"
                        len - i - 1
                  ast.Call param.ident.line, param.ident.column,
                    ast.Access param.ident.line, param.ident.column,
                      ast.Ident param.ident.line, param.ident.column, \__slice
                      \call
                    [array-ident, ast.Const(param.ident.line, param.ident.column, i), spread-counter]
                  ast.BlockExpression param.ident.line, param.ident.column,
                    * ast.Assign param.ident.line, param.ident.column,
                        spread-counter
                        ast.Const(param.ident.line, param.ident.column, i)
                    * ast.Arr param.ident.line, param.ident.column
          init.push ...param.init
        if spread-counter?
          scope.release-ident spread-counter
        if inner
          scope.release-ident array-ident
        {
          init
          ident: array-ident
          -spread
        }

      Object: #(object, scope, inner)
        let object-ident = if inner then scope.reserve-ident object.line, object.column, \p, Type.object else scope.reserve-param(object.line, object.column)
        let init = []

        for pair in object.pairs
          let key = translate(pair.key, scope, \expression)()
          unless key instanceof ast.Const
            throw Error "Unexpected non-const object key: $(typeof! key)"

          let value = translate-param pair.value, scope, true
          if value.ident?
            scope.add-variable value.ident // TODO: is this needed? Array doesn't seem to use it.
            init.push ast.Assign key.line, key.column,
              value.ident
              ast.Access key.line, key.column, object-ident, key
            init.push ...value.init

        if inner
          scope.release-ident object-ident

        {
          init
          ident: object-ident
          -spread
        }
      
      Nothing: #(node, scope, inner)
        {
          init: []
          ident: if inner then null else scope.reserve-param(node.line, node.column)
          -spread
        }
    }

    let translate-param(param, scope, inner)
      let type = param.constructor.capped-name
      unless translate-param-types ownskey type
        throw Error "Unknown parameter type: $(type)"
      translate-param-types[type](param, scope, inner)

    let translate-type = do
      let translate-types = {
        Ident: do
          let primordial-types = {
            String: Type.string
            Number: Type.number
            Boolean: Type.boolean
            Function: Type.function
            Array: Type.array
          }
          #(node, scope)
            unless primordial-types ownskey node.name
              throw Error "Not implemented: custom type $(node.name)"
            primordial-types[node.name]
        Const: #(node, scope)
          switch node.value
          case null; Type.null
          case void; Type.undefined
          default
            throw Error "Unexpected const type: $(String node.value)"
        TypeArray: #(node, scope)
          translate-type(node.subtype, scope).array()
        TypeFunction: #(node, scope)
          translate-type(node.return-type, scope).function()
        TypeUnion: #(node, scope)
          for reduce type in node.types, current = Type.none
            current.union(translate-type(type))
      }
      #(node, scope)
        unless translate-types ownskey node.constructor.capped-name
          throw Error "Unknown type to translate: $(String node.constructor.capped-name)"
        translate-types[node.constructor.capped-name](node, scope)

    #(node, scope, location, auto-return) -> #
      let inner-scope = scope.clone(not not node.bound)
      let param-idents = []
      let initializers = []
      let mutable found-spread = -1
      let mutable spread-counter = void

      for p, i, len in node.params
        let param = translate-param p, inner-scope, false
        unless param.spread
          if found-spread == -1
            param-idents.push param.ident
          else
            inner-scope.add-variable param.ident, Type.any, param.is-mutable // TODO: figure out param type
            let diff = i - found-spread - 1
            initializers.push ast.Assign param.ident.line, param.ident.column,
              param.ident
              ast.Access param.ident.line, param.ident.column,
                ast.Arguments param.ident.line, param.ident.column
                if diff == 0 then spread-counter else ast.Binary(param.ident.line, param.ident.column, spread-counter, "+", diff)
        else
          if found-spread != -1
            throw Error "Encountered multiple spread parameters"
          found-spread := i
          inner-scope.add-helper \__slice
          inner-scope.add-variable param.ident, Type.array, param.is-mutable // TODO: figure out param type
          if i == len - 1
            initializers.push ast.Assign param.ident.line, param.ident.column,
              param.ident
              ast.Call param.ident.line, param.ident.column,
                ast.Access param.ident.line, param.ident.column,
                  ast.Ident param.ident.line, param.ident.column, \__slice
                  \call
                [ast.Arguments(param.ident.line, param.ident.column), ...(if i == 0 then [] else [ast.Const(param.ident.line, param.ident.column, i)])]
          else
            spread-counter := inner-scope.reserve-ident param.ident.line, param.ident.column, \ref, Type.number
            initializers.push ast.Assign param.ident.line, param.ident.column,
              param.ident
              ast.IfExpression param.ident.line, param.ident.column,
                ast.Binary param.ident.line, param.ident.column,
                  i
                  "<"
                  ast.Assign param.ident.line, param.ident.column,
                    spread-counter
                    ast.Binary param.ident.line, param.ident.column,
                      ast.Access param.ident.line, param.ident.column,
                        ast.Arguments(param.ident.line, param.ident.column)
                        \length
                      "-"
                      len - i - 1
                ast.Call param.ident.line, param.ident.column,
                  ast.Access param.ident.line, param.ident.column,
                    ast.Ident param.ident.line, param.ident.column, \__slice
                    \call
                  [ast.Arguments(param.ident.line, param.ident.column), ast.Const(param.ident.line, param.ident.column, i), spread-counter]
                ast.BlockExpression param.ident.line, param.ident.column,
                  * ast.Assign param.ident.line, param.ident.column, spread-counter, ast.Const(param.ident.line, param.ident.column, i)
                  * ast.Arr param.ident.line, param.ident.column
        initializers.push ...param.init

      if spread-counter
        inner-scope.release-ident spread-counter
      
      let unassigned = {}
      let body = if node.generator
        generator-translate(node.body, inner-scope, GeneratorBuilder(node.line, node.column, inner-scope)).create()
      else
        translate(node.body, inner-scope, \top-statement, node.auto-return, unassigned)()
      inner-scope.release-tmps()
      body := ast.Block node.body.line, node.body.column, [...initializers, body]
      if inner-scope.used-this or node.bound instanceof ParserNode
        if node.bound instanceof ParserNode
          let fake-this = ast.Ident node.body.line, node.body.column, \_this
          inner-scope.add-variable fake-this // TODO: the type for this?
          body := ast.Block node.body.line, node.body.column,
            * ast.Assign node.body.line, node.body.column, fake-this, translate(node.bound, scope, \expression, null, unassigned)()
            * body
            * ast.Return node.body.line, node.body.column, fake-this
        else
          if inner-scope.bound
            scope.used-this := true
          if inner-scope.has-bound and not inner-scope.bound
            let fake-this = ast.Ident node.body.line, node.body.column, \_this
            inner-scope.add-variable fake-this // TODO: the type for this?
            body := ast.Block node.body.line, node.body.column,
              * ast.Assign node.body.line, node.body.column, fake-this, ast.This(node.body.line, node.body.column)
              * body
      if inner-scope.has-stop-iteration
        scope.has-stop-iteration := true
      if inner-scope.has-global
        scope.has-global := true
      let func = ast.Func node.line, node.column, null, param-idents, inner-scope.get-variables(), body, []
      auto-return func

  Ident: #(node, scope, location, auto-return)
    let name = node.name
    if name.length > 2 and name.charCodeAt(0) == "_".charCodeAt(0) and name.charCodeAt(1) == "_".charCodeAt(0)
      scope.add-helper name
    if name == \StopIteration
      scope.has-stop-iteration := true
    if name == \GLOBAL
      scope.has-global := true
    #-> auto-return ast.Ident node.line, node.column, name

  If: #(node, scope, location, auto-return, unassigned)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    let t-label = node.label and translate node.label, scope, \label
    let t-test = translate node.test, scope, \expression, null, unassigned
    let t-when-true = translate node.when-true, scope, inner-location, auto-return, unassigned
    let t-when-false = if node.when-false? then translate node.when-false, scope, inner-location, auto-return, unassigned
    #-> ast.If node.line, node.column, t-test(), t-when-true(), t-when-false?(), t-label?()
  
  Nothing: #(node) -> #-> ast.Noop(node.line, node.column)

  Object: #(node, scope, location, auto-return, unassigned)
    let t-keys = []
    let t-values = []
    let properties = []
    for pair in node.pairs
      t-keys.push translate pair.key, scope, \expression, null, unassigned
      t-values.push translate pair.value, scope, \expression, null, unassigned
      properties.push pair.property
    let t-prototype = if node.prototype? then translate node.prototype, scope, \expression, null, unassigned

    #
      let const-pairs = []
      let post-const-pairs = []
      let prototype = t-prototype?()
      let mutable current-pairs = if prototype? then post-const-pairs else const-pairs
      let mutable last-property = null
      for t-key, i in t-keys
        let t-value = t-values[i]
        let key = t-key()
        let value = t-value()
        let property = properties[i]
        
        if key not instanceof ast.Const or property
          current-pairs := post-const-pairs
        
        let current-pair = current-pairs[* - 1]
        if property in [\get, \set] and last-property and property != last-property and key instanceof ast.Const and current-pair.key instanceof ast.Const and key.value == current-pair.key.value
          current-pair[last-property] := current-pair.value
          current-pair.property := last-property & property
          delete current-pair.value
          current-pair[property] := value
          last-property := null
        else
          current-pairs.push { key, value, property }
          if property in [\get, \set]
            last-property := property
      
      let obj = if prototype?
        scope.add-helper \__create
        ast.Call node.line, node.column,
          ast.Ident node.line, node.column, \__create
          [prototype]
      else
        ast.Obj node.line, node.column, for {key, value} in const-pairs
          ast.Obj.Pair key.line, key.column, String(key.value), value
      
      if post-const-pairs.length == 0
        auto-return obj
      else
        let ident = scope.reserve-ident node.line, node.column, \o, Type.object
        let result = ast.BlockExpression node.line, node.column,
          * ast.Assign node.line, node.column, ident, obj
          * ...for pair in post-const-pairs
              let {key, property} = pair
              if property
                scope.add-helper \__def-prop
                ast.Call pair.key.line, pair.key.column, ast.Ident(pair.key.line, pair.key.column, \__def-prop), [
                  ident
                  key
                  if property == \property
                    pair.value
                  else if property == \getset
                    ast.Obj pair.get.line, pair.get.column, [
                      ast.Obj.Pair pair.get.line, pair.get.column, \get, pair.get
                      ast.Obj.Pair pair.set.line, pair.set.column, \set, pair.set
                      ast.Obj.Pair pair.set.line, pair.set.column, \configurable, ast.Const(pair.set.line, pair.set.column, true)
                      ast.Obj.Pair pair.set.line, pair.set.column, \enumerable, ast.Const(pair.set.line, pair.set.column, true)
                    ]
                  else if property == \setget
                    ast.Obj pair.set.line, pair.set.column, [
                      ast.Obj.Pair pair.set.line, pair.set.column, \set, pair.set
                      ast.Obj.Pair pair.get.line, pair.get.column, \get, pair.get
                      ast.Obj.Pair pair.get.line, pair.get.column, \configurable, ast.Const(pair.get.line, pair.get.column, true)
                      ast.Obj.Pair pair.get.line, pair.get.column, \enumerable, ast.Const(pair.get.line, pair.get.column, true)
                    ]
                  else if property == \get
                    ast.Obj pair.value.line, pair.value.column, [
                      ast.Obj.Pair pair.value.line, pair.value.column, \get, pair.value
                      ast.Obj.Pair pair.value.line, pair.value.column, \configurable, ast.Const(pair.value.line, pair.value.column, true)
                      ast.Obj.Pair pair.value.line, pair.value.column, \enumerable, ast.Const(pair.value.line, pair.value.column, true)
                    ]
                  else if property == \set
                    ast.Obj pair.value.line, pair.value.column, [
                      ast.Obj.Pair pair.value.line, pair.value.column, \set, pair.value
                      ast.Obj.Pair pair.value.line, pair.value.column, \configurable, ast.Const(pair.value.line, pair.value.column, true)
                      ast.Obj.Pair pair.value.line, pair.value.column, \enumerable, ast.Const(pair.value.line, pair.value.column, true)
                    ]
                  else
                    throw Error("Unknown property type: $(String property)")
                ]
              else
                ast.Assign key.line, key.column, ast.Access(key.line, key.column, ident, key), pair.value
          * ident
        scope.release-ident ident
        auto-return result
  
  Regexp: #(node, scope, location, auto-return, unassigned)
    let t-source = translate(node.source, scope, \expression, null, unassigned)
    #
      let source = t-source()
      let flags = node.flags
      if source.is-const()
        auto-return ast.Regex node.line, node.column, String(source.const-value()), flags
      else
        auto-return ast.Call node.line, node.column,
          ast.Ident node.line, node.column, \RegExp
          [
            source
            ast.Const node.line, node.column, flags
          ]
  
  Return: #(node, scope, location, auto-return, unassigned)
    if location not in [\statement, \top-statement]
      throw Error "Expected Return in statement position"
    let t-value = translate node.node, scope, \expression, null, unassigned
    #-> ast.Return node.line, node.column, t-value()

  Root: #(node, scope, location, auto-return, unassigned)
    let t-body = translate node.body, scope, \top-statement, scope.options.return or scope.options.eval, unassigned

    #
      let mutable body = t-body()
      
      let comments = []
      while true
        if body instanceof ast.Comment
          comments.push body
          body := ast.Noop node.line, node.column
        else if body instanceof ast.Block and body.body[0] instanceof ast.Comment
          comments.push body.body[0]
          body := ast.Block node.line, node.column, body.body[1 to -1]
        else
          break
      
      let init = []
      if scope.has-bound and scope.used-this
        let fake-this = ast.Ident node.line, node.column, \_this
        scope.add-variable fake-this // TODO: type for this?
        init.push ast.Assign node.line, node.column, fake-this, ast.This(node.line, node.column)
      scope.fill-helper-dependencies()
      for helper in scope.get-helpers()
        if HELPERS.has(helper)
          let ident = ast.Ident node.line, node.column, helper
          scope.add-variable ident // TODO: type?
          init.push ast.Assign node.line, node.column, ident, HELPERS.get(helper)

      let bare-init = []
      if scope.has-stop-iteration
        // This probably needs to be redone to check StopIteration on the global object (whichever that is), so that cross-file generators work properly.
        bare-init.push ast.If node.line, node.column,
          ast.Binary node.line, node.column,
            ast.Unary node.line, node.column, \typeof, ast.Ident node.line, node.column, \StopIteration
            "==="
            \undefined
          ast.Assign node.line, node.column,
            ast.Ident node.line, node.column, \StopIteration
            ast.If node.line, node.column,
              ast.Binary node.line, node.column,
                ast.Unary node.line, node.column, \typeof, ast.Access node.line, node.column,
                  ast.Ident node.line, node.column, \Object
                  \freeze
                "==="
                \function
              ast.Call node.line, node.column,
                ast.Access node.line, node.column,
                  ast.Ident node.line, node.column, \Object
                  \freeze
                [ast.Obj node.line, node.column]
              ast.Obj node.line, node.column
      
      let global-node = ast.If node.line, node.column,
        ast.Binary node.line, node.column,
          ast.Unary node.line, node.column, \typeof, ast.Ident node.line, node.column, \window
          "!=="
          \undefined
        ast.Ident node.line, node.column, \window
        ast.If node.line, node.column,
          ast.Binary node.line, node.column,
            ast.Unary node.line, node.column, \typeof, ast.Ident node.line, node.column, \global
            "!=="
            \undefined
          ast.Ident node.line, node.column, \global
          ast.This node.line, node.column
      
      if scope.options.bare
        if scope.has-global
          scope.add-variable ast.Ident node.line, node.column, \GLOBAL
          bare-init.unshift ast.Assign node.line, node.column,
            ast.Ident node.line, node.column, \GLOBAL
            global-node
        if scope.options.undefined-name?
          scope.add-variable scope.options.undefined-name
        ast.Root node.line, node.column,
          ast.Block node.line, node.column, [...comments, ...bare-init, ...init, body]
          scope.get-variables()
          ["use strict"]
      else
        if scope.options.eval
          scope.has-global := true
          let walker = #(node)
            if node instanceof ast.Func
              if node.name?
                ast.Block node.line, node.column,
                  * node
                  * ast.Assign node.line, node.column,
                      ast.Access node.line, node.column,
                        ast.Ident node.line, node.column, \GLOBAL
                        node.name.name
                      node.name
              else
                node
            else if node instanceof ast.Binary and node.op == "=" and node.left instanceof ast.Ident
              ast.Assign node.line, node.column,
                ast.Access node.line, node.column,
                  ast.Ident node.line, node.column, \GLOBAL
                  node.left.name
                node.walk walker
          body := body.walk walker
        let mutable call-func = ast.Call node.line, node.column,
          ast.Access node.line, node.column,
            ast.Func node.line, node.column,
              null
              [
                ...if scope.has-global
                  [ast.Ident node.line, node.column, \GLOBAL]
                else
                  []
                ...if scope.options.undefined-name?
                  [ast.Ident node.line, node.column, scope.options.undefined-name, true]
                else
                  []
              ]
              scope.get-variables()
              ast.Block node.line, node.column, [...init, body]
              ["use strict"]
            \call
          [
            ast.This(node.line, node.column)
            ...if scope.has-global
              [global-node]
            else
              []
          ]
        if scope.options.return
          call-func := ast.Return(node.line, node.column, call-func)
        ast.Root node.line, node.column,
          ast.Block node.line, node.column, [...comments, ...bare-init, call-func]
          []
          []
  
  Switch: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-node = translate node.node, scope, \expression, null, unassigned
    let t-cases = for case_ in node.cases
      {
        case_.node.line
        case_.node.column
        t-node: translate case_.node, scope, \expression, null, unassigned
        t-body: translate case_.body, scope, \statement, null, unassigned
        case_.fallthrough
      }
    let t-default-case = if node.default-case? then translate node.default-case, scope, \statement, null, unassigned
    #
      ast.Switch node.line, node.column,
        t-node()
        for case_, i, len in t-cases
          let case-node = case_.t-node()
          let mutable case-body = case_.t-body()
          if not case_.fallthrough or (i == len - 1 and default-case.is-noop())
            case-body := ast.Block case_.line, case_.column, [
              auto-return case-body
              ast.Break case-body.line, case-body.column]
          ast.Switch.Case(case_.line, case_.column, case-node, case-body)
        if t-default-case?
          auto-return t-default-case()
        else
          ast.Noop(node.line, node.column)
        t-label?()

  Super: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray super call"

  Tmp: #(node, scope, location, auto-return)
    let ident = scope.get-tmp(node.line, node.column, node.id, node.name, node.type())
    # -> auto-return ident

  TmpWrapper: #(node, scope, location, auto-return, unassigned)
    let t-result = translate node.node, scope, location, auto-return, unassigned
    for tmp in node.tmps by -1
      scope.release-tmp tmp

    t-result

  This: #(node, scope, location, auto-return)
    #
      scope.used-this := true
      auto-return if scope.bound
        ast.Ident node.line, node.column, \_this
      else
        ast.This node.line, node.column

  Throw: #(node, scope, location, auto-return, unassigned)
    let t-node = translate node.node, scope, \expression, null, unassigned
    #-> ast.Throw node.line, node.column, t-node()

  TryCatch: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-try-body = translate node.try-body, scope, \statement, auto-return, unassigned
    let t-catch-ident = translate node.catch-ident, scope, \left-expression
    let t-catch-body = translate node.catch-body, scope, \statement, auto-return, unassigned
    #-> ast.TryCatch node.line, node.column, t-try-body(), t-catch-ident(), t-catch-body(), t-label?()

  TryFinally: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-try-body = translate node.try-body, scope, \statement, auto-return, unassigned
    let t-finally-body = translate node.finally-body, scope, \statement, null, unassigned
    #-> ast.TryFinally node.line, node.column, t-try-body(), t-finally-body(), t-label?()

  Unary: #(node, scope, location, auto-return, unassigned)
    if unassigned and node.op in ["++", "--", "++post", "--post"] and node.node instanceof ParserNode.Ident
      unassigned[node.node.name] := false
    let t-subnode = translate node.node, scope, \expression, null, unassigned
    #-> auto-return ast.Unary node.line, node.column, node.op, t-subnode()
  
  Var: #(node, scope, location, auto-return, unassigned)
    if unassigned and node.ident instanceof ParserNode.Ident and unassigned not ownskey node.ident.name
      unassigned[node.ident.name] := true
    let t-ident = translate node.ident, scope, \left-expression, auto-return
    #
      let ident = t-ident()
      scope.add-variable ident, Type.any, node.is-mutable
      ast.Noop(node.line, node.column)

let translate(node as Object, scope as Scope, location as String, auto-return, unassigned)
  if typeof auto-return != \function
    auto-return := make-auto-return auto-return

  unless translators ownskey node.constructor.capped-name
    throw Error "Unable to translate unknown node type: $(String node.constructor.capped-name)"

  let ret = translators[node.constructor.capped-name](node, scope, location, auto-return, unassigned)
  if typeof ret != "function"
    throw Error "Translated non-function: $(typeof! ret)"
  ret

let translate-array(nodes as [], scope as Scope, location as String, auto-return, unassigned)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and auto-return, unassigned

module.exports := #(node, options = {}, callback)
  if typeof options == \function
    return module.exports(node, null, options)
  let mutable result = void
  let start-time = new Date().get-time()
  try
    let scope = Scope(options, false)
    result := translate(node, scope, \statement, false, {})()
    scope.release-tmps()
  catch e
    if callback?
      return callback e
    else
      throw e
  let end-time = new Date().get-time()
  options.progress?(\translate, end-time - start-time)
  let ret = {
    node: result
    time: end-time - start-time
  }
  if callback?
    callback null, ret
  else
    ret

module.exports.helpers := HELPERS
module.exports.define-helper := #(name, value, type as Type, mutable dependencies)
  let scope = Scope({}, false)
  let ident = if typeof name == \string
    ast.Ident(0, 0, name)
  else if name instanceof ParserNode.Ident
    translate(name, scope, \left-expression)()
  else
    throw TypeError "Expecting name to be a String or Ident, got $(typeof! name)"
  unless ident instanceof ast.Ident
    throw Error "Expected name to be an Ident, got $(typeof! ident)"
  let helper = if value instanceof AstNode
    value
  else if value instanceof ParserNode
    translate(value, scope, \expression)()
  else
    throw TypeError "Expected value to be a parser or ast Node, got $(typeof! value)"
  dependencies ?= scope.get-helpers()
  HELPERS.add ident.name, helper, type, dependencies
  {
    helper
    dependencies
  }
  