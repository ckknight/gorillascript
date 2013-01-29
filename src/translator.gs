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
  def constructor(options = {}, bound = false, used-tmps = {}, helpers = {}, variables, tmps = {})@
    @options := options
    @bound := bound
    @used-tmps := used-tmps
    @helpers := helpers
    @variables := if variables then { extends variables } else {}
    @tmps := tmps
    @has-bound := false
    @used-this := false
    @has-stop-iteration := false
    @id := get-id()

  def maybe-cache(item as ast.Expression, type as Type = Type.any, func as (AstNode, AstNode, Boolean) -> AstNode)
    unless needs-caching item
      func item, item, false
    else
      let ident = @reserve-ident \ref, type
      let result = func ast.Assign(ident, item), ident, true
      @release-ident(ident)
      result
  
  def reserve-ident(name-part = \ref, type as Type = Type.any)
    // TODO: would be better as for first
    for i in 1 to Infinity
      let name = if i == 1 then "_$(name-part)" else "_$(name-part)$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        let ident = ast.Ident name
        @add-variable ident, type
        return ident

  def reserve-param()
    // TODO: would be better as for first
    for i in 1 to Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        return ast.Ident name

  def get-tmp(id, name, type as Type = Type.any)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserve-ident name or \tmp, type

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
          for dep in HELPERS.dependencies helper
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
  x.mutate-last ast.Return

let identity(x) -> x

let make-auto-return(x) -> if x then wrap-return else identity

let HELPERS = new class Helpers
  def constructor()@
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
  def constructor(scope as Scope, states, current-state = 1, state-ident, pending-finallies-ident, finallies = [], catches = [], current-catch = [])@
    @scope := scope
    @states := states ? [
      [#-> ast.Throw ast.Ident \StopIteration]
      []
    ]
    @current-state := current-state
    @state-ident := state-ident ? scope.reserve-ident \state, Type.number
    @pending-finallies-ident := pending-finallies-ident ? scope.reserve-ident \finallies, Type.undefined.function().array()
    @finallies := finallies
    @catches := catches
    @current-catch := current-catch
  
  def add(t-node)
    unless t-node instanceof GeneratorBuilder
      unless typeof t-node == \function
        throw TypeError "Expected node to be a GeneratorBuilder or Function, got $(typeof! t-node)"
      @states[@current-state].push t-node
      this
    else
      t-node
  
  def yield(t-node)
    let branch = @branch()
    @states[@current-state].push(
      #@-> ast.Assign @state-ident, branch.state
      #-> ast.Return t-node())
    branch.builder
  
  def goto(t-state)!
    @states[@current-state].push(
      #@ -> ast.Assign @state-ident, t-state()
      #-> ast.Break())
  
  def pending-finally(t-finally-body)
    let ident = @scope.reserve-ident \finally, Type.undefined.function()
    @scope.remove-variable ident
    @finallies.push #-> ast.Func ident, [], [], t-finally-body()
    @states[@current-state].push #@-> ast.Call ast.Access(@pending-finallies-ident, \push), [ident]
    this
  
  def run-pending-finally()
    @states[@current-state].push #@-> ast.Call ast.Access(ast.Call(ast.Access(@pending-finallies-ident, \pop)), \call), [ast.This()]
    this
  
  def noop()
    if @states[@current-state].length
      let branch = @branch()
      @states[@current-state].push #@ -> ast.Assign @state-ident, branch.state
      branch.builder
    else
      this
  
  def enter-try-catch()
    let fresh = @noop()
    fresh.current-catch :=
      * ...fresh.current-catch
      * * fresh.current-state
    fresh
  
  def exit-try-catch(t-ident, t-post-state)
    if @current-catch.length == 0
      throw Error "Unable to exit-try-catch without first using enter-try-catch"
    @goto t-post-state
    let fresh = @noop()
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
      @current-catch[@current-catch.length - 1].push state
    @states.push []
    {
      state
      builder: GeneratorBuilder(@scope, @states, state, @state-ident, @pending-finallies-ident, @finallies, @catches, @current-catch)
    }
  
  def create()
    if @current-catch.length
      throw Error "Cannot create a generator if there are stray catches"
    @states[@current-state].push #@-> ast.Assign @state-ident, 0
    let body =
      * ast.Assign @state-ident, 1
    let close = @scope.reserve-ident \close, Type.undefined.function()
    @scope.remove-variable(close)
    if @finallies.length == 0
      @scope.remove-variable(@pending-finallies-ident)
      body.push ast.Func close, [], [], ast.Block
        * ast.Assign @state-ident, 0
    else
      body.push ast.Assign @pending-finallies-ident, ast.Arr()
      body.push ...(for f in @finallies; f())
      let inner-scope = @scope.clone(false)
      let f = inner-scope.reserve-ident \f, Type.undefined.function().union(Type.undefined)
      body.push ast.Func close, [], inner-scope.get-variables(), ast.Block
        * ast.Assign @state-ident, 0
        * ast.Assign f, ast.Call ast.Access(@pending-finallies-ident, \pop)
        * ast.If(
            f
            ast.TryFinally(
              ast.Call f
              ast.Call close))
    let scope = @scope
    let err = scope.reserve-ident \e, Type.any
    let catches = @catches
    let state-ident = @state-ident
    body.push ast.Return ast.Obj
      * ast.Obj.Pair \close, close
      * ast.Obj.Pair \next, ast.Func null, [], [], ast.While(true,
          ast.TryCatch(
            ast.Switch state-ident, (for state, i in @states
              ast.Switch.Case i, ast.Block [
                ...for item in state; item()
                ast.Break()
              ]), ast.Throw ast.Call ast.Ident(\Error), [ast.Binary("Unknown state: ", "+", state-ident)]
            err
            do
              let mutable current = ast.Block
                * ast.Call close
                * ast.Throw err
              for catch-info in catches by -1
                let err-ident = catch-info.t-ident()
                scope.add-variable err-ident
                current := ast.If(
                  ast.Or ...(for state in catch-info.try-states; ast.Binary(state-ident, "===", state))
                  ast.Block
                    * ast.Assign err-ident, err
                    * ast.Assign state-ident, catch-info.catch-state
                  current)
              current))
    ast.Block body

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
      for subnode in node.nodes
        builder := generator-translate subnode, scope, builder, break-state, continue-state
      builder
    
    Break: #(node, scope, mutable builder, break-state)
      if not break-state?
        throw Error "break found outside of a loop"
      
      builder.goto break-state
      builder
    
    Continue: #(node, scope, mutable builder, break-state, continue-state)
      if not break-state?
        throw Error "break found outside of a loop"
      
      builder.goto continue-state
      builder
    
    For: #(node, scope, mutable builder)
      if node.init?
        builder := generator-translate node.init, scope, builder
      let step-branch = builder.branch()
      step-branch.builder := generator-translate node.step, scope, step-branch.builder
      let test-branch = builder.branch()
      let t-test = translate node.test, scope, \expression, false
      let body-branch = builder.branch()
      body-branch.builder := generator-translate node.body, scope, body-branch.builder, #-> post-branch.state, #-> step-branch.state
      let post-branch = builder.branch()
      builder.goto #-> test-branch.state
      step-branch.builder.goto #-> test-branch.state
      test-branch.builder.goto #-> ast.IfExpression t-test(), body-branch.state, post-branch.state
      body-branch.builder.goto #-> step-branch.state
      post-branch.builder
    
    ForIn: #(node, scope, mutable builder)
      let t-key = translate node.key, scope, \left-expression
      let t-object = translate node.object, scope, \expression
      let keys = scope.reserve-ident \keys, Type.string.array()
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
      let index = scope.reserve-ident \i, Type.number
      let length = scope.reserve-ident \len, Type.number
      builder.add #
        ast.Block
          * ast.Assign keys, ast.Arr()
          * ast.ForIn get-key(), t-object(), ast.Call ast.Access(keys, \push), [get-key()]
          * ast.Assign index, 0
          * ast.Assign length, ast.Access(keys, \length)
      let step-branch = builder.branch()
      step-branch.builder.add #-> ast.Unary "++", index
      let test-branch = builder.branch()
      let body-branch = builder.branch()
      body-branch.builder.add #
        ast.Assign get-key(), ast.Access keys, index
      body-branch.builder := generator-translate node.body, scope, body-branch.builder, #-> post-branch.state, #-> step-branch.state
      let post-branch = builder.branch()
      builder.goto #-> test-branch.state
      step-branch.builder.goto #-> test-branch.state
      test-branch.builder.goto #-> ast.IfExpression ast.Binary(index, "<", length), body-branch.state, post-branch.state
      body-branch.builder.goto #-> step-branch.state
      post-branch.builder
    
    If: #(node, scope, mutable builder, break-state, continue-state)
      let t-test = translate node.test, scope, \expression
      let when-true-branch = builder.branch()
      let g-when-true = generator-translate node.when-true, scope, when-true-branch.builder, break-state, continue-state
      let mutable when-false = node.when-false
      if when-false instanceof ParserNode.Nothing
        when-false := null
      let when-false-branch = if when-false? then builder.branch()
      let g-when-false = if when-false? then generator-translate node.when-false, scope, when-false-branch.builder, break-state, continue-state
      let post-branch = builder.branch()
      builder.goto #-> ast.IfExpression t-test(), when-true-branch.state, if when-false-branch? then when-false-branch.state else post-branch.state
      g-when-true.goto #-> post-branch.state
      if when-false?
        g-when-false.goto #-> post-branch.state
      post-branch.builder
    
    TmpWrapper: #(node, scope, mutable builder, break-state, continue-state)
      builder := generator-translate node.node, scope, builder, break-state, continue-state
      for tmp in node.tmps
        scope.release-tmp tmp
      builder
    
    TryCatch: #(node, scope, mutable builder, break-state, continue-state)
      builder := builder.enter-try-catch()
      builder := generator-translate node.try-body, scope, builder, break-state, continue-state
      builder := builder.exit-try-catch (translate node.catch-ident, scope, \left-expression, false), #-> post-branch.state
      builder := generator-translate node.catch-body, scope, builder, break-state, continue-state
      let post-branch = builder.branch()
      builder.goto #-> post-branch.state
      post-branch.builder
    
    TryFinally: #(node, scope, mutable builder, break-state, continue-state)
      builder := builder.pending-finally translate node.finally-body, scope, \top-statement
      builder := generator-translate node.try-body, scope, builder, break-state, continue-state
      builder.run-pending-finally()
    
    Yield: #(node, scope, builder)
      builder.yield translate node.node, scope, \expression
  #(node, scope, builder, break-state, continue-state)
    if generator-translators ownskey node.constructor.capped-name
      let ret = generator-translators[node.constructor.capped-name](node, scope, builder, break-state, continue-state)
      if ret not instanceof GeneratorBuilder
        throw Error "Translated non-GeneratorBuilder: $(typeof! ret)"
      ret
    else
      builder.add translate node, scope, \statement, false

let array-translate(elements, scope, replace-with-slice)
  let translated-items = []
  let mutable current = []
  translated-items.push(current)
  for element in flatten-spread-array elements
    if element instanceof ParserNode.Spread
      translated-items.push
        t-node: translate element.node, scope, \expression
        type: element.node.type()
      current := []
      translated-items.push current
    else
      current.push translate element, scope, \expression

  if translated-items.length == 1
    #-> ast.Arr for item in translated-items[0]
      item()
  else
    for translated-item, i in translated-items by -1
      if i %% 2
        if translated-item.length > 0
          translated-items[i] := #-> ast.Arr for item in translated-item
            item()
        else
          translated-items.splice i, 1
      else
        translated-items[i] := #
          let node = translated-item.t-node()
          if translated-item.type.is-subset-of Type.array
            node
          else
            scope.add-helper \__to-array
            ast.Call(
              ast.Ident \__to-array
              [node])

    if translated-items.length == 1
      #
        let array = translated-items[0]()
        if replace-with-slice and array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array
          ast.Call(ast.Ident(\__slice), array.args)
        else
          array
    else
      #
        let head = translated-items[0]()
        let rest = for item in translated-items[1 to -1]
          item()
        ast.Call(
          ast.Access head, \concat
          rest)

let translators =
  Access: #(node, scope, location, auto-return)
    let t-parent = translate node.parent, scope, \expression
    let t-child = translate node.child, scope, \expression
    #
      let parent = t-parent()
      let child = t-child()
      if child instanceof ast.Call and child.func instanceof ast.Ident and child.func.name == \__range
        let [start, end, step, mutable inclusive] = child.args
        if not inclusive
          inclusive := false
        else if not inclusive.is-const()
          throw Error "Expected inclusive argument to be constant"
        else
          inclusive := not not inclusive.const-value()
        scope.add-helper \__slice
        let slice = ast.Call ast.Ident(\__slice), [
          parent
          start
          ...(if end.is-const() and end.const-value() == Infinity
            []
          else if inclusive
            if end.is-const() and typeof end.const-value() == \number
              if end.const-value() == -1
                []
              else
                [ast.Const end.const-value() + 1]
            else
              [ast.Binary(
                ast.Binary end, "+", 1
                "||"
                Infinity)]
          else
            [end])]
        auto-return if not step.is-const() or step.const-value() != 1
          scope.add-helper \__step
          ast.Call ast.Ident(\__step), [slice, step]
        else
          slice
      else
        auto-return ast.Access(parent, child)

  AccessIndex: do
    let indexes =
      multi: #-> throw Error "Not implemented: index multi"
      slice: #-> throw Error "Not implemented: index slice"
    #(node, scope, location, auto-return)
      let type = node.child.type
      unless indexes ownskey type
        throw Error "Unknown index type: $type"

      indexes[type](node, scope, location, auto-return)

  Args: #(node, scope, location, auto-return)
    #-> auto-return ast.Arguments()

  Array: #(node, scope, location, auto-return)
    let t-arr = array-translate node.elements, scope, true
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
    let indexes = {
      slice: #(t-parent, parent-type, child, t-value, value-type, scope)
        let left = child.left
        let right = child.right
        let t-left = if left and left not instanceof ParserNode.Nothing then translate(left, scope, \expression) else #-> ast.Const(0)
        let t-right = if right and right not instanceof ParserNode.Nothing then translate(right, scope, \expression) else #-> ast.Const(Infinity)
        #
          scope.add-helper \__splice
          ast.Call(
            ast.Ident \__splice
            [
              t-parent()
              t-left()
              t-right()
              t-value()
            ])
      multi: #(t-parent, parent-type, child, t-value, value-type, scope, location)
        let t-elements = translate-array child.elements, scope, \expression
        #
          async set-parent, parent <- scope.maybe-cache t-parent(), parent-type
          async set-value, value <- scope.maybe-cache t-value(), value-type
          let lines = for t-element, i in t-elements
            ast.Assign(
              ast.Access if i == 0 then set-parent else parent, t-element()
              ast.Access if i == 0 then set-value else value, i)
          if location == \expression
            lines.push value
          ast.Block lines
    }
    #(node, scope, location, auto-return)
      let op = node.op
      // TODO: this is ugly
      if op in "=" and node.left instanceof ParserNode.AccessIndex
        let type = node.left.child.type
        unless indexes ownskey type
          throw Error "Unexpected index type for assignment: $(JSON.stringify type)"

        let result = indexes[type](
          translate node.left.parent, scope, \expression
          node.left.parent.type()
          node.left.child
          translate node.right, scope, \expression
          node.right.type()
          scope
          location)
        #-> auto-return result()
      else
        let t-left = translate node.left, scope, \left-expression
        let t-right = translate node.right, scope, \expression
        
        #
          let left = t-left()
          let right = t-right()
          if op == "=" and location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name? and scope.has-own-variable(left) and not scope.is-variable-mutable(left)
            scope.remove-variable left
            let func = ast.Func(left, right.params, right.variables, right.body, right.declarations)
            if auto-return != identity
              ast.Block
                * func
                * auto-return left
            else
              func
          else
            auto-return ast.Binary(left, op, right)

  Binary: #(node, scope, location, auto-return)
    let t-left = translate node.left, scope, \expression
    let t-right = translate node.right, scope, \expression
    #-> auto-return ast.Binary(t-left(), node.op, t-right())

  Block: #(node, scope, location, auto-return)
    let t-nodes = translate-array node.nodes, scope, location, auto-return
    # -> ast.Block for t-node in t-nodes; t-node()

  Break: #-> #-> ast.Break()
  
  Call: #(node, scope, location, auto-return)
    let t-func = translate node.func, scope, \expression
    let is-apply = node.is-apply
    let is-new = node.is-new
    let args = node.args
    if is-apply and (args.length == 0 or args[0] not instanceof ParserNode.Spread)
      let t-start = if args.length == 0 then #-> ast.Const(void) else translate(args[0], scope, \expression)
      let t-arg-array = array-translate(args[1 to -1], scope, false)
      #
        let func = t-func()
        let start = t-start()
        let arg-array = t-arg-array()
        if arg-array instanceof ast.Arr
          auto-return ast.Call(
            ast.Access func, \call
            [start, ...arg-array.elements])
        else
          auto-return ast.Call(
            ast.Access func, \apply
            [start, arg-array])
    else
      let t-arg-array = array-translate(args, scope, false)
      #
        let func = t-func()
        let arg-array = t-arg-array()
        if is-apply
          async set-array, array <- scope.maybe-cache arg-array, Type.array
          scope.add-helper \__slice
          auto-return ast.Call(
            ast.Access func, \apply
            [
              ast.Access set-array, 0
              ast.Call(
                ast.Ident \__slice
                [array, ast.Const 1])
            ])
        else if arg-array instanceof ast.Arr
          auto-return ast.Call(
            func
            arg-array.elements
            is-new)
        else if is-new
          scope.add-helper \__new
          auto-return ast.Call ast.Ident(\__new), [func, arg-array]
        else if func instanceof ast.Binary and func.op == "."
          async set-parent, parent <- scope.maybe-cache func.left, Type.function
          auto-return ast.Call(
            ast.Access ast.Access(set-parent, func.right), \apply
            [parent, arg-array])
        else
          auto-return ast.Call(
            ast.Access func, \apply
            [ast.Const(void), arg-array])
  
  Const: #(node, scope, location, auto-return) -> #-> auto-return ast.Const(node.value)

  Continue: #-> #-> ast.Continue()

  Debugger: #(node, scope, location, auto-return)
    if location == \expression
      #-> ast.Call(
        ast.Func(null, [], [], ast.Debugger())
        [])
    else
      #-> ast.Debugger()

  Def: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray def"

  Eval: #(node, scope, location, auto-return)
    let t-code = translate node.code, scope, \expression
    #-> auto-return ast.Eval t-code()

  For: #(node, scope, location, auto-return)
    let t-init = if node.init? then translate node.init, scope, \expression
    let t-test = if node.test? then translate node.test, scope, \expression
    let t-step = if node.step? then translate node.step, scope, \expression
    let t-body = translate node.body, scope, \statement
    # -> ast.For(
      if t-init? then t-init()
      if t-test? then t-test()
      if t-step? then t-step()
      t-body())

  ForIn: #(node, scope, location, auto-return)
    let t-key = translate node.key, scope, \left-expression
    let t-object = translate node.object, scope, \expression
    let t-body = translate node.body, scope, \statement
    #
      let key = t-key()
      if key not instanceof ast.Ident
        throw Error("Expected an Ident for a for-in key")
      scope.add-variable key, Type.string
      ast.ForIn(key, t-object(), t-body())

  Function: do
    let primitive-types = {
      Boolean: \boolean
      String: \string
      Number: \number
      Function: \function
    }
    let make-type-check-test(ident, type, scope)
      if primitive-types ownskey type
        ast.Binary(
          ast.Unary \typeof, ident
          "!=="
          primitive-types[type])
      else if type == \Array
        scope.add-helper \__is-array
        ast.Unary(
          "!"
          ast.Call(
            ast.Ident(\__is-array)
            [ident]))
      else if type == \Object
        scope.add-helper \__is-object
        ast.Unary(
          "!"
          ast.Call(
            ast.Ident(\__is-object)
            [ident]))
      else
        ast.Unary(
          "!"
          ast.Binary(
            ident
            \instanceof
            ast.Ident(type)))
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
            ast.Const ".$(accesses[0].value)"
          else
            ast.Const "[$(JSON.stringify accesses[0].value)]"
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
        let access = ast.Access ident, ...accesses
        scope.add-helper \__typeof
        let result = ast.If(
          make-type-check-test access, node.name, scope
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.BinaryChain("+"
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be $(with-article node.name), got "
                ast.Call(
                  ast.Ident(\__typeof)
                  [access]))])))
        if not has-default-value and node.name == \Boolean
          {
            check: ast.If(
              ast.Binary ident, "==", ast.Const null
              ast.Assign ident, ast.Const(false)
              result)
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
        let access = ast.Access ident, ...accesses
        scope.add-helper \__typeof
        let type = translate(node, scope, \expression)()
        {
          check: ast.If(
            ast.Unary(
              "!"
              ast.Binary(
                access
                \instanceof
                type))
            ast.Throw(
              ast.Call(
                ast.Ident(\TypeError)
                [ast.BinaryChain("+"
                  "Expected $(ident.name)"
                  ...build-access-string-node(accesses)
                  " to be $(with-article type.right.value), got "
                  ast.Call(
                    ast.Ident(\__typeof)
                    [access]))])))
          type: Type.any // FIXME
        }
      TypeUnion: #(ident, node, scope, has-default-value, accesses)
        // TODO: cache typeof ident if requested more than once.
        let access = ast.Access ident, ...accesses
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
          tests.unshift ast.Binary access, "!=", null
        let mutable result = ast.If(
          ast.And ...tests
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.BinaryChain("+"
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be $(with-article names.join ' or '), got "
                ast.Call(
                  ast.Ident(\__typeof)
                  [access]))])))

        if not has-default-value
          if has-null or has-void
            if has-null xor has-void
              result := ast.If(
                ast.Binary access, "==", ast.Const null
                ast.Assign access, ast.Const(if has-null then null else void)
                result)
          else if has-boolean
            result := ast.If(
              ast.Binary access, "==", ast.Const null
              ast.Assign access, ast.Const(false)
              result)
        {
          check: result
          type: for reduce type in types, current = Type.none
            current.union(type)
        }
      TypeFunction: #(ident, node, scope, has-default-value, accesses)
        translate-type-checks.Ident(ident, { name: \Function }, scope, has-default-value, accesses)
      TypeArray: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident, ...accesses
        scope.add-helper \__is-array
        let index = scope.reserve-ident \i, Type.number
        let length = scope.reserve-ident \len, Type.number
        let sub-check = translate-type-check(ident, node.subtype, scope, false, [...accesses, index])
        let result = ast.If(
          ast.Unary(
            "!"
            ast.Call(
              ast.Ident \__is-array
              [access]))
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.BinaryChain("+"
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be an Array, got "
                ast.Call(
                  ast.Ident \__typeof
                  [access]))]))
          ast.For(
            ast.Block
              * ast.Assign index, ast.Const 0
              * ast.Assign length, ast.Access access, \length
            ast.Binary index, "<", length
            ast.Unary "++", index
            sub-check.check))
        scope.release-ident index
        scope.release-ident length
        {
          check: result
          type: sub-check.type.array()
        }
      TypeObject: #(ident, node, scope, has-default-value, accesses)
        let access = ast.Access ident, ...accesses
        scope.add-helper \__is-object
        let type-data = {}
        
        let result = ast.If(
          ast.Unary(
            "!"
            ast.Call(
              ast.Ident \__is-object
              [access]))
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.BinaryChain("+"
                "Expected $(ident.name)"
                ...build-access-string-node(accesses)
                " to be an Object, got "
                ast.Call(
                  ast.Ident \__typeof
                  [access]))]))
          for reduce {key, value} in node.pairs, current = ast.Noop()
            if key instanceof ParserNode.Const
              let {check, type} = translate-type-check(ident, value, scope, false, [...accesses, ast.Const key.value])
              type-data[key.value] := type
              ast.Block
                * current
                * check)
        
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
          let tmp = ast.Ident ident.right.value
          later-init.push ast.Binary(ident, "=", tmp)
          ident := tmp

        unless ident instanceof ast.Ident
          throw Error "Expecting param to be an Ident, got $(typeof! ident)"
        
        let type-check = if param.as-type then translate-type-check(ident, param.as-type, scope, param.default-value?, [])
        // TODO: mark the param as having a type
        if inner
          scope.add-variable ident, type-check?.type, param.is-mutable

        let init = []
        if param.default-value?
          init.push ast.If(
            ast.Binary ident, "==", ast.Const null
            ast.Assign ident, translate(param.default-value, scope, \expression)()
            type-check?.check)
        else if type-check
          init.push type-check.check
        {
          init: [...init, ...later-init]
          ident
          spread: not not param.spread
        }

      Array: #(array, scope, inner)
        let array-ident = if inner then scope.reserve-ident \p, Type.array else scope.reserve-param()
        let init = []
        let mutable found-spread = -1
        let mutable spread-counter = void
        for p, i, len in array.elements
          let param = translate-param p, scope, true
          unless param.spread
            if found-spread == -1
              init.push ast.Assign(
                param.ident
                ast.Access array-ident, i)
            else
              let diff = i - found-spread - 1
              init.push ast.Assign(
                param.ident
                ast.Access(
                  array-ident
                  if diff == 0 then spread-counter else ast.Binary spread-counter, "+", diff))
          else
            if found-spread != -1
              throw Error "Encountered multiple spread parameters"
            found-spread := i
            scope.add-helper \__slice
            if i == len - 1
              init.push ast.Assign(
                param.ident
                ast.Call(
                  ast.Ident(\__slice)
                  [array-ident, ...(if i == 0 then [] else [ast.Const(i)])]))
            else
              spread-counter := scope.reserve-ident \i, Type.number
              init.push ast.Assign(
                param.ident
                ast.IfExpression(
                  ast.Binary(
                    i
                    "<"
                    ast.Assign(
                      spread-counter
                      ast.Binary(
                        ast.Access array-ident, \length
                        "-"
                        len - i - 1)))
                  ast.Call(
                    ast.Ident \__slice
                    [array-ident, ast.Const(i), spread-counter])
                  ast.BlockExpression
                    * ast.Assign spread-counter, ast.Const(i)
                    * ast.Arr()))
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
        let object-ident = if inner then scope.reserve-ident \p, Type.object else scope.reserve-param()
        let init = []

        for pair in object.pairs
          let key = translate(pair.key, scope, \expression)()
          unless key instanceof ast.Const
            throw Error "Unexpected non-const object key: $(typeof! key)"

          let value = translate-param pair.value, scope, true
          scope.add-variable value.ident // TODO: is this needed? Array doesn't seem to use it.
          init.push ast.Assign(
            value.ident
            ast.Access object-ident, key), ...value.init

        if inner
          scope.release-ident object-ident

        {
          init
          ident: object-ident
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
          let mutable current = Type.none
          for type in node.types
            current := current.union(translate-type(type))
          current
      }
      #(node, scope)
        unless translate-types ownskey node.constructor.capped-name
          throw Error "Unknown type to translate: $(String node.constructor.capped-name)"
        translate-types[node.constructor.capped-name](node, scope)

    #(node, scope, location, auto-return) -> #
      let inner-scope = scope.clone(node.bound)
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
            initializers.push ast.Assign(
              param.ident
              ast.Access(
                ast.Arguments()
                if diff == 0 then spread-counter else ast.Binary(spread-counter, "+", diff)))
        else
          if found-spread != -1
            throw Error "Encountered multiple spread parameters"
          found-spread := i
          inner-scope.add-helper \__slice
          inner-scope.add-variable param.ident, Type.array, param.is-mutable // TODO: figure out param type
          if i == len - 1
            initializers.push ast.Assign(
              param.ident
              ast.Call(
                ast.Ident(\__slice)
                [ast.Arguments(), ...(if i == 0 then [] else [ast.Const(i)])]))
          else
            spread-counter := inner-scope.reserve-ident \ref, Type.number
            initializers.push ast.Assign(
              param.ident
              ast.IfExpression(
                ast.Binary(
                  i
                  "<"
                  ast.Assign(
                    spread-counter
                    ast.Binary(
                      ast.Access ast.Arguments(), \length
                      "-"
                      len - i - 1)))
                ast.Call(
                  ast.Ident \__slice
                  [ast.Arguments(), ast.Const(i), spread-counter])
                ast.BlockExpression
                  * ast.Assign spread-counter, ast.Const(i)
                  * ast.Arr()))
        initializers.push ...param.init

      if spread-counter
        inner-scope.release-ident spread-counter
      
      let body = if node.generator
        generator-translate(node.body, inner-scope, GeneratorBuilder(inner-scope)).create()
      else
        translate(node.body, inner-scope, \top-statement, node.auto-return)()
      inner-scope.release-tmps()
      body := ast.Block [...initializers, body]
      if inner-scope.used-this
        if inner-scope.bound
          scope.used-this := true
        if inner-scope.has-bound and not inner-scope.bound
          let fake-this = ast.Ident \_this
          inner-scope.add-variable fake-this // TODO: the type for this?
          body := ast.Block
            * ast.Assign fake-this, ast.This()
            * body
      if inner-scope.has-stop-iteration
        scope.has-stop-iteration := true
      let func = ast.Func null, param-idents, inner-scope.get-variables(), body, []
      auto-return func

  Ident: #(node, scope, location, auto-return)
    let name = node.name
    if name.length > 2 and name.charCodeAt(0) == "_".charCodeAt(0) and name.charCodeAt(1) == "_".charCodeAt(0)
      scope.add-helper name
    if name == \StopIteration
      scope.has-stop-iteration := true
    #-> auto-return ast.Ident(name)

  If: #(node, scope, location, auto-return)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    let t-test = translate node.test, scope, \expression
    let t-when-true = translate node.when-true, scope, inner-location, auto-return
    let t-when-false = if node.when-false? then translate node.when-false, scope, inner-location, auto-return
    #-> ast.If t-test(), t-when-true(), if t-when-false? then t-when-false()
  
  Nothing: #-> #-> ast.Noop()

  Object: #(node, scope, location, auto-return)
    let t-keys = []
    let t-values = []
    for pair in node.pairs
      t-keys.push translate pair.key, scope, \expression
      t-values.push translate pair.value, scope, \expression
    let t-prototype = if node.prototype? then translate node.prototype, scope, \expression

    #
      let const-pairs = []
      let post-const-pairs = []
      let prototype = t-prototype?()
      let mutable current-pairs = if prototype? then post-const-pairs else const-pairs
      for t-key, i in t-keys
        let t-value = t-values[i]
        let key = t-key()
        let value = t-value()

        if key not instanceof ast.Const
          current-pairs := post-const-pairs

        current-pairs.push { key, value }
      
      let obj = if prototype?
        scope.add-helper \__create
        ast.Call(ast.Ident(\__create), [prototype])
      else
        ast.Obj for pair in const-pairs
          ast.Obj.Pair String(pair.key.value), pair.value

      if post-const-pairs.length == 0
        auto-return obj
      else
        let ident = scope.reserve-ident \o, Type.object
        let result = ast.BlockExpression
          * ast.Assign ident, obj
          * ...for pair in post-const-pairs
              ast.Assign(
                ast.Access(ident, pair.key)
                pair.value)
          * ident
        scope.release-ident ident
        auto-return result
  
  Return: #(node, scope, location)
    if location not in [\statement, \top-statement]
      throw Error "Expected Return in statement position"
    let t-value = translate node.node, scope, \expression
    #-> ast.Return t-value()

  Root: #(node, scope)
    let t-body = translate node.body, scope, \top-statement, scope.options.return or scope.options.eval

    #
      let mutable body = t-body()
      let init = []
      if scope.has-bound and scope.used-this
        let fake-this = ast.Ident(\_this)
        scope.add-variable fake-this // TODO: type for this?
        init.push ast.Assign fake-this, ast.This()
      scope.fill-helper-dependencies()
      for helper in scope.get-helpers()
        if HELPERS.has(helper)
          let ident = ast.Ident(helper)
          scope.add-variable ident // TODO: type?
          init.push ast.Assign ident, HELPERS.get(helper)

      let bare-init = []
      if scope.has-stop-iteration
        // This probably needs to be redone to check StopIteration on the global object (whichever that is), so that cross-file generators work properly.
        bare-init.push ast.If(
          ast.Binary(
            ast.Unary \typeof, ast.Ident \StopIteration
            "==="
            \undefined)
          ast.Assign(
            ast.Ident \StopIteration
            ast.If(
              ast.Binary(
                ast.Unary \typeof, ast.Access(
                  ast.Ident \Object
                  \freeze)
                "==="
                \function)
              ast.Call(
                ast.Access(
                  ast.Ident \Object
                  \freeze)
                [ast.Obj()])
              ast.Obj())))

      if scope.options.bare
        ast.Root(
          ast.Block [...bare-init, ...init, body]
          scope.get-variables()
          ["use strict"])
      else
        if scope.options.eval
          let walker = #(node)
            if node instanceof ast.Func
              if node.name?
                ast.Block
                  * node
                  * ast.Assign ast.Access(ast.Ident("GLOBAL"), node.name.name), node.name
              else
                node
            else if node instanceof ast.Binary and node.op == "=" and node.left instanceof ast.Ident
              ast.Assign ast.Access(ast.Ident("GLOBAL"), node.left.name), node.walk walker
          body := body.walk walker
        let mutable call-func = ast.Call(
          ast.Access(
            ast.Func(
              null
              []
              scope.get-variables()
              ast.Block [...init, body]
              ["use strict"])
            \call)
          [ast.This()])
        if scope.options.return
          call-func := ast.Return(call-func)
        ast.Root(
          ast.Block [...bare-init, call-func]
          []
          [])
  
  Switch: #(node, scope, location, auto-return)
    let t-node = translate node.node, scope, \expression
    let t-cases = for case_ in node.cases
      {
        t-node: translate case_.node, scope, \expression
        t-body: translate case_.body, scope, \statement
        case_.fallthrough
      }
    let t-default-case = if node.default-case? then translate node.default-case, scope, \statement
    #
      let node = t-node()
      let default-case = if t-default-case? then auto-return t-default-case() else ast.Noop()
      ast.Switch(
        node
        for case_, i, len in t-cases
          let case-node = case_.t-node()
          let mutable case-body = case_.t-body()
          if not case_.fallthrough or (i == len - 1 and default-case.is-noop())
            case-body := ast.Block [auto-return(case-body), ast.Break()]
          ast.Switch.Case(case-node, case-body)
        default-case)

  Super: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray super call"

  Tmp: #(node, scope, location, auto-return)
    let ident = scope.get-tmp(node.id, node.name, node.type())
    # -> auto-return ident

  TmpWrapper: #(node, scope, location, auto-return)
    let t-result = translate node.node, scope, location, auto-return
    for tmp in node.tmps
      scope.release-tmp tmp

    t-result

  This: #(node, scope, location, auto-return)
    #
      scope.used-this := true
      auto-return if scope.bound
        ast.Ident(\_this)
      else
        ast.This()

  Throw: #(node, scope, location)
    let t-node = translate node.node, scope, \expression
    #-> ast.Throw t-node()

  TryCatch: #(node, scope, location, auto-return)
    let t-try-body = translate node.try-body, scope, \statement, auto-return
    let t-catch-ident = translate node.catch-ident, scope, \left-expression
    let t-catch-body = translate node.catch-body, scope, \statement, auto-return
    #-> ast.TryCatch t-try-body(), t-catch-ident(), t-catch-body()

  TryFinally: #(node, scope, location, auto-return)
    let t-try-body = translate node.try-body, scope, \statement, auto-return
    let t-finally-body = translate node.finally-body, scope, \statement
    #-> ast.TryFinally t-try-body(), t-finally-body()

  Unary: #(node, scope, location, auto-return)
    let t-subnode = translate node.node, scope, \expression
    #-> auto-return ast.Unary node.op, t-subnode()
  
  Var: #(node, scope, location, auto-return)
    let t-ident = translate node.ident, scope, \left-expression, auto-return
    #
      let ident = t-ident()
      scope.add-variable ident, Type.any, node.is-mutable
      ast.Noop()

let translate(node as Object, scope as Scope, location as String, auto-return)
  if typeof auto-return != \function
    auto-return := make-auto-return auto-return

  unless translators ownskey node.constructor.capped-name
    throw Error "Unable to translate unknown node type: $(String node.constructor.capped-name)"

  let ret = translators[node.constructor.capped-name](node, scope, location, auto-return)
  if typeof ret != "function"
    throw Error "Translated non-function: $(typeof! ret)"
  ret

let translate-array(nodes as [], scope as Scope, location as String, auto-return)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and auto-return

module.exports := #(node, options = {})
  let scope = Scope(options, false)
  let result = translate(node, scope, \statement, false)()
  scope.release-tmps()
  return {
    node: result
    macro-helpers: []
  }

module.exports.helpers := HELPERS
module.exports.define-helper := #(name, value, type as Type, mutable dependencies)
  let scope = Scope({}, false)
  let ident = if typeof name == \string
    ast.Ident(name)
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
  