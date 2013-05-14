require! ast: './jsast'
let AstNode = ast.Node
require! Type: './types'
let {Node: ParserNode, MacroHolder} = require('./parser')
let {Cache} = require('./utils')

let needs-caching(item)
  return item not instanceofsome [ast.Ident, ast.Const, ast.This, ast.Arguments]

class Scope
  let get-id = do
    let mutable id = -1
    # -> id += 1
  def constructor(@options = {}, @macros as MacroHolder, @bound = false, @used-tmps = {}, @helper-names = {}, variables, @tmps = {})
    @variables := if variables then { extends variables } else {}
    @has-bound := false
    @used-this := false
    @id := get-id()

  def maybe-cache(item as ast.Expression, type as Type = Type.any, func as (AstNode, AstNode, Boolean) -> AstNode)
    unless needs-caching item
      func item, item, false
    else
      let ident = @reserve-ident item.pos, \ref, type
      let result = func ast.Assign(item.pos, ident, item), ident, true
      @release-ident(ident)
      result
  
  def maybe-cache-access(item as ast.Expression, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    if item instanceof ast.Binary and item.op == "."
      @maybe-cache item.left, Type.any, #(set-parent, parent, parent-cached)@
        @maybe-cache item.right, Type.any, #(set-child, child, child-cached)@
          if parent-cached or child-cached
            func(
              ast.Access(item.pos, set-parent, set-child)
              ast.Access(item.pos, parent, child)
              true)
          else
            func item, item, false
    else
      func item, item, false

  def reserve-ident(pos as {}, name-part = \ref, type as Type = Type.any)
    for first i in 1 to Infinity
      let name = if i == 1 then "_$(name-part)" else "_$(name-part)$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        let ident = ast.Ident pos, name
        @add-variable ident, type
        ident

  def reserve-param(pos as {})
    for first i in 1 to Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        ast.Ident pos, name

  def get-tmp(pos as {}, id, name, type as Type = Type.any)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserve-ident pos, name or \tmp, type

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
    @variables[ident.name].is-param := true

  def mark-as-function(ident as ast.Ident)!
    @variables[ident.name].is-function := true

  def add-helper(name as String)!
    @helper-names[name] := true
  
  def fill-helper-dependencies()!
    let mutable helper-names = @helper-names
    let mutable to-add = {}
    while true
      for name of helper-names
        if @macros.has-helper name
          for dep in @macros.helper-dependencies(name) by -1
            if helper-names not ownskey dep
              to-add[dep] := true
      
      for name of to-add
        @add-helper name
      else
        break
      helper-names := to-add
      to-add := {}

  let lower-sorter(a, b) -> a.to-lower-case() <=> b.to-lower-case()

  def get-helpers()
    let names = for k of @helper-names
      k

    names.sort lower-sorter
  
  def has-helper(name as String)
    @helper-names ownskey name

  def add-variable(ident as ast.Ident, type as Type = Type.any, is-mutable as Boolean)!
    @variables[ident.name] := {
      type
      is-mutable
    }

  def has-variable(ident as ast.Ident)
    @variables haskey ident.name and is-object! @variables[ident.name]
  
  def has-own-variable(ident as ast.Ident)
    @variables ownskey ident.name
  
  def is-variable-mutable(ident as ast.Ident)
    @variables[ident.name]?.is-mutable

  def remove-variable(ident as ast.Ident)!
    delete @variables[ident.name]

  def get-variables()
    let variables = for k, v of @variables
      if not v.is-param and not v.is-function
        k

    variables.sort lower-sorter

  def clone(bound)
    if bound
      @has-bound := true
    Scope(@options, @macros, bound, { extends @used-tmps }, @helper-names, @variables, { extends @tmps })

let wrap-return(x)
  x.mutate-last #(n) -> ast.Return n.pos, n

let identity(x) -> x

let make-auto-return(x) -> if x then wrap-return else identity

let make-has-generator-node = #
  let in-loop-cache = Cache<ParserNode, Boolean>()
  let has-in-loop(node)
    async <- in-loop-cache.get-or-add node
    let mutable result = false
    if node instanceofsome [ParserNode.Yield, ParserNode.Return]
      result := true
    else if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if has-in-loop n
            throw FOUND
          n
      catch e
        if e == FOUND
          result := true
        else
          throw e
    result

  let in-switch-cache = Cache<ParserNode, Boolean>()
  let has-in-switch(node)
    async <- in-switch-cache.get-or-add node
    returnif in-loop-cache.get node
    if node instanceofsome [ParserNode.Yield, ParserNode.Return, ParserNode.Continue]
      true
    else if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if n instanceofsome [ParserNode.For, ParserNode.ForIn]
            if has-in-loop n
              throw FOUND
          else
            if has-in-switch n
              throw FOUND
          n
      catch e
        if e == FOUND
          return true
        else
          throw e
      false

  let normal-cache = Cache<ParserNode, Boolean>()
  let has-generator-node(node as ParserNode)
    async <- normal-cache.get-or-add node
    returnif in-loop-cache.get node
    returnif in-switch-cache.get node
    if node instanceofsome [ParserNode.Yield, ParserNode.Return, ParserNode.Continue, ParserNode.Break]
      true
    else if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if n instanceofsome [ParserNode.For, ParserNode.ForIn]
            if has-in-loop n
              throw FOUND
          else if n instanceof ParserNode.Switch
            if has-in-switch n
              throw FOUND
          else
            if has-generator-node n
              throw FOUND
          n
      catch e
        if e == FOUND
          return true
        else
          throw e
      false
  has-generator-node

let uid()
  "$(Math.random().to-string(36).slice(2))-$(new Date().get-time())"
class GeneratorState
  def constructor(@builder as GeneratorBuilder)
    @nodes := []
  
  def has-generator-node(node)
    @builder.has-generator-node node
  
  def add(t-node as ->) as GeneratorState
    @nodes.push t-node
    this
  
  def branch() as GeneratorState
    let state = GeneratorState @builder
    if @builder.current-catch.length
      @builder.current-catch[* - 1].push state
    @builder.states-order.push state
    state
  
  def case-id() as Number
    @builder.case-id(@get-redirect())

  def make-goto(pos as {}, t-state as ->, include-break as Boolean)
    #@
      let state = t-state()
      
      let case-id = if state instanceof GeneratorState
        ast.Const pos, state.case-id()
      else if state instanceof ast.Node
        state
      else
        throw Error "Expected a GeneratorState or Node, got $(typeof! state)"
      
      if case-id instanceof ast.Const and is-number! case-id.value and case-id.value == @case-id() + 1
        ast.Unary pos, "++", @builder.state-ident
      else
        let assign = ast.Assign pos, @builder.state-ident, case-id
        if include-break
          ast.Block pos, [
            assign
            ast.Break pos
          ]
        else
          assign

  def yield(pos as {}, t-node as ->) as GeneratorState
    let branch = @branch()
    @nodes.push(
      @make-goto pos, #-> branch, false
      #-> ast.Return pos, ast.Obj pos, [
        ast.Obj.Pair pos, \done, ast.Const pos, false
        ast.Obj.Pair pos, \value, t-node()
      ])
    branch
  
  def return(pos as {}, t-node as ->|null)!
    if not t-node?
      @goto pos, #@-> @builder.stop
    else
      @add @make-goto pos, #@-> @builder.stop, false
      @add #-> ast.Return pos, ast.Obj pos, [
        ast.Obj.Pair pos, \done, ast.Const pos, true
        ast.Obj.Pair pos, \value, t-node()
      ]
  
  def get-redirect() as GeneratorState
    @builder.get-redirect(this)
  
  let get-case-id(pos as {}, value) as ast.Node
    if value instanceof GeneratorState
      ast.Const pos, value.case-id()
    else if value instanceof ast.Node
      value
    else
      throw TypeError "Expected a GeneratorState or Node, got $(typeof! value)"
  
  def goto(pos as {}, t-state as ->, prevent-redirect as Boolean)!
    let nodes = @nodes
    if nodes.length == 0 and not prevent-redirect
      @builder.add-redirect this, t-state
    nodes.push(@make-goto pos,
      # -> get-case-id(pos, t-state())
      true)

  def noop(pos as {}) as GeneratorState
    if @nodes.length == 0
      this
    else
      let branch = @branch()
      @goto pos, #-> branch
      branch
  
  def goto-if(pos as {}, t-test as ->, t-when-true as ->, t-when-false as ->)!
    @goto pos,
      #@ -> ast.IfExpression pos, t-test(),
        get-case-id(pos, t-when-true())
        get-case-id(pos, t-when-false())
      true
  
  def pending-finally(pos as {}, t-finally-body as ->) as GeneratorState
    let scope = @builder.scope
    let ident = scope.reserve-ident pos, \finally, Type.undefined.function()
    scope.mark-as-function ident
    @builder.finallies.push #-> ast.Func pos, ident, [], [], t-finally-body()
    @nodes.push #@-> ast.Call pos,
      ast.Access pos, @builder.pending-finallies-ident, \push
      [ident]
    this
  
  def run-pending-finally(pos as {}) as GeneratorState
    @nodes.push #@-> ast.Call pos,
      ast.Call pos,
        ast.Access pos, @builder.pending-finallies-ident, \pop
    this
  
  def enter-try-catch(pos as {}) as GeneratorState
    let fresh = @noop(pos)
    @builder.enter-try-catch fresh
    fresh
  
  def exit-try-catch(pos as {}, t-ident as ->, t-post-state as ->) as GeneratorState
    @goto pos, t-post-state
    let fresh = @noop(pos)
    @builder.exit-try-catch fresh, t-ident
    fresh

class GeneratorBuilder
  def constructor(@pos as {}, @scope as Scope)
    @current-catch := []
    @redirects := Map()
    @start := GeneratorState(this)
    @stop := GeneratorState(this).add #-> ast.Return pos, ast.Obj pos, [
      ast.Obj.Pair pos, \done, ast.Const pos, true
      ast.Obj.Pair pos, \value, ast.Const pos, void
    ]
    @states-order := [@start]
    
    @state-ident := state-ident ? scope.reserve-ident pos, \state, Type.number
    @pending-finallies-ident := scope.reserve-ident pos, \finallies, Type.undefined.function().array()
    let send-scope = scope.clone(false)
    @received-ident := send-scope.reserve-ident pos, \received, Type.any
    send-scope.mark-as-param @received-ident
    
    @finallies := []
    @catches := []
    @has-generator-node := make-has-generator-node()
  
  def add-redirect(from-state as GeneratorState, to-state as ->)!
    @redirects.set from-state, to-state
  
  def get-redirect(from-state as GeneratorState) as GeneratorState
    let mutable redirect-func = @redirects.get from-state
    if not redirect-func?
      from-state
    else if redirect-func instanceof GeneratorState
      redirect-func
    else if is-function! redirect-func
      let mutable redirect = redirect-func()
      if redirect instanceof GeneratorState
        redirect := @get-redirect redirect
      else
        throw Error "Expected a GeneratorState, got $(typeof! redirect-func)"
      @redirects.set from-state, redirect
      redirect
    else
      throw Error "Unknown value in redirects: $(typeof! redirect-func)"
  
  def _calculate-case-ids()!
    let mutable id = -1
    let case-ids = @case-ids := Map()
    for state in @states-order
      if not @redirects.has state
        case-ids.set state, (id += 1)
  
  def case-id(state as GeneratorState) as Number
    let case-ids = @case-ids
    if not case-ids?
      throw Error "_calculate-case-ids must be called first"
    
    if not case-ids.has state
      throw Error "case-ids does not contain state"
    
    case-ids.get state

  def enter-try-catch(state as GeneratorState)!
    @current-catch.push [state]
  
  def exit-try-catch(state as GeneratorState, t-ident as ->)!
    if @current-catch.length == 0
      throw Error "Unable to exit-try-catch without first using enter-try-catch"
    let catch-states = @current-catch.pop()
    let index = catch-states.index-of state
    if index != -1
      catch-states.splice index, 1
    
    @catches.push {
      try-states: catch-states
      t-ident
      catch-state: state
    }
    state
  
  def create()
    if @current-catch.length
      throw Error "Cannot create a generator if there are stray catches"
    @states-order.push @stop
    @_calculate-case-ids()
    let body =
      * ast.Assign @pos, @state-ident, ast.Const @pos, @start.case-id()
    let close = @scope.reserve-ident @pos, \close, Type.undefined.function()
    @scope.mark-as-function close
    if @finallies.length == 0
      @scope.remove-variable(@pending-finallies-ident)
      body.push ast.Func @pos, close, [], [], ast.Block @pos,
        * ast.Assign @pos, @state-ident, @stop.case-id()
    else
      body.push ast.Assign @pos, @pending-finallies-ident, ast.Arr(@pos)
      body.push ...(for f in @finallies; f())
      let inner-scope = @scope.clone(false)
      let f = inner-scope.reserve-ident @pos, \f, Type.undefined.function().union(Type.undefined)
      body.push ast.Func @pos, close, [], inner-scope.get-variables(), ast.Block @pos,
        * ast.Assign @pos, @state-ident, @stop.case-id()
        * ast.Assign @pos,
            f
            ast.Call @pos,
              ast.Access @pos,
                @pending-finallies-ident
                \pop
        * ast.If @pos,
            f
            ast.TryFinally @pos,
              ast.Call @pos, f
              ast.Call @pos, close
    let err = @scope.reserve-ident @pos, \e, Type.any
    let catches = @catches
    let state-ident = @state-ident
    let send = @scope.reserve-ident @pos, \send, Type.function
    let switch-step = ast.Switch @pos,
      state-ident
      for state in @states-order
        if not @redirects.has state
          let nodes = for t-node in state.nodes; t-node()
          if nodes.length == 0
            throw Error "Found state with no nodes in it"
          ast.Switch.Case nodes[0].pos,
            ast.Const nodes[0].pos, state.case-id()
            ast.Block nodes[0].pos, nodes
      ast.Throw @pos,
        ast.Call @pos,
          ast.Ident @pos, \Error
          [ast.Binary @pos, "Unknown state: ", "+", state-ident]
    body.push ast.Func @pos, send, [@received-ident], [], ast.While(@pos, true,
      if not catches.length and not @finallies.length
        switch-step
      else
        ast.TryCatch @pos,
          switch-step
          err
          for reduce catch-info in catches by -1, current = ast.Block @pos, [...if @finallies.length then [ast.Call(@pos, close)] else [], ast.Throw @pos, err]
            let err-ident = catch-info.t-ident()
            @scope.add-variable err-ident
            ast.If @pos,
              ast.Or @pos, ...(for state in catch-info.try-states
                if not @redirects.has state
                  ast.Binary(@pos, state-ident, "===", ast.Const(@pos, state.case-id())))
              ast.Block @pos,
                * ast.Assign @pos, err-ident, err
                * ast.Assign @pos, state-ident, ast.Const(@pos, catch-info.catch-state.case-id())
              current)
    body.push ast.Return @pos, ast.Obj @pos,
      * ast.Obj.Pair @pos, \close, close
      * ast.Obj.Pair @pos, \iterator, ast.Func @pos, null, [], [], ast.Return(@pos, ast.This(@pos))
      * ast.Obj.Pair @pos, \next, ast.Func @pos, null, [], [], ast.Return @pos, ast.Call @pos, send, [ast.Const @pos, void]
      * ast.Obj.Pair @pos, \send, send
      * ast.Obj.Pair @pos, \throw, ast.Func @pos, null, [ast.Ident @pos, \e], [], ast.Throw @pos, ast.Ident @pos, \e
    ast.Block @pos, body

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

let make-pos(line as Number, column as Number, file as String|void)
  let pos = { line, column }
  if file?
    pos.file := file
  pos

let get-pos(node as ParserNode)
  make-pos(node.line, node.column, node.file)

let do-nothing() ->
let generator-translate = do
  let memoize(mutable func)
    if not is-function! func
      throw TypeError "Expected func to be a Function, got $(typeof! func)"
    if func.memoized
      func
    else
      let mutable result = void
      (#
        if func
          result := func()
          func := null
        result) <<< {+memoized}
  let same(value)
    (#-> value) <<< {+memoized}
  let maybe-memoize(value)
    if is-function! value
      memoize value
    else
      same value
  let handle-assign(assign-to, scope, state as GeneratorState, mutable t-node as ->, cleanup as -> = do-nothing)
    if is-function! assign-to
      let t-assign-to = memoize assign-to
      {
        state: state.add #
          let node = t-node()
          ast.Assign node.pos, t-assign-to(), node
        t-node: t-assign-to
        cleanup
      }
    else if assign-to  
      t-node := memoize t-node
      let t-tmp = memoize # -> scope.reserve-ident t-node().pos, \tmp, Type.any
      let node-needs-caching = memoize #
        t-node() == state.builder.received-ident or needs-caching t-node()
      {
        state: state.add #
          let node = t-node()
          if node-needs-caching()
            ast.Assign node.pos, t-tmp(), node
          else
            node
        t-node: #
          if node-needs-caching()
            t-tmp()
          else
            t-node()
        cleanup: #
          cleanup()
          if node-needs-caching()
            scope.release-ident t-tmp()
      }
    else
      {
        state
        t-node
        cleanup
      }
  let make-t-tmp(assign-to, scope, pos, name = \tmp, type = Type.any)
    if is-function! assign-to
      memoize assign-to
    else
      same scope.reserve-ident pos, name, type
  let make-cleanup(assign-to, scope, t-tmp as ->)
    if is-function! assign-to
      #
        let value = assign-to()
        let tmp = t-tmp()
        if value == tmp
          scope.release-ident tmp
    else
      #-> scope.release-ident t-tmp()
  let generator-array-translate(pos, elements, scope, mutable state as GeneratorState, assign-to)
    let t-tmp = make-t-tmp assign-to, scope, pos, \arr, Type.array
    
    let mutable t-array-start = null
    for element, i in elements
      if t-array-start or state.has-generator-node element
        if not t-array-start?
          t-array-start := array-translate pos, elements[0 til i], scope, true, false
          state := state.add #-> ast.Assign pos, t-tmp(), t-array-start()
        if element instanceof ParserNode.Spread
          let expr = generator-translate-expression element.node, scope, state, false
          state := expr.state.add #
            let tmp = t-tmp()
            scope.add-helper \__to-array
            ast.Call get-pos(element),
              ast.Access get-pos(element),
                tmp
                ast.Const get-pos(element), \push
                ast.Const get-pos(element), \apply
              [
                tmp
                ast.Call get-pos(element),
                  ast.Ident get-pos(element), \__to-array
                  [first!(expr.t-node(), expr.cleanup())]
              ]
        else
          let expr = generator-translate-expression element, scope, state, false
          state := expr.state.add #-> ast.Call get-pos(element),
            ast.Access get-pos(element),
              t-tmp(),
              ast.Const get-pos(element), \push
            [first!(expr.t-node(), expr.cleanup())]
    if not t-array-start?
      {
        state
        t-node: array-translate pos, elements, scope, true, false
        cleanup: do-nothing
      }
    else
      {
        state
        t-node: t-tmp
        cleanup: make-cleanup(assign-to, scope, t-tmp)
      }
  let expressions =
    Access: #(node, scope, state, assign-to)
      let g-parent = generator-translate-expression node.parent, scope, state, true
      let g-child = generator-translate-expression node.child, scope, g-parent.state, false
      handle-assign assign-to, scope, g-child.state, #-> first!(
        ast.Access get-pos(node), g-parent.t-node(), g-child.t-node()
        g-parent.cleanup()
        g-child.cleanup())
    
    Array: #(node, scope, state, assign-to)
      generator-array-translate get-pos(node), node.elements, scope, state, assign-to
    
    Assign: #(node, scope, state, assign-to)
      let left = node.left
      let g-left = if left instanceof ParserNode.Access
        let g-parent = generator-translate-expression left.parent, scope, state, true
        let g-child = generator-translate-expression left.child, scope, g-parent.state, true
        {
          g-child.state
          t-node: #-> ast.Access get-pos(left), g-parent.t-node(), g-child.t-node()
          cleanup: #
            g-parent.cleanup()
            g-child.cleanup()
        }
      else
        {
          state
          t-node: translate node.left, scope, \left-expression
          cleanup: do-nothing
        }
      
      let g-right = generator-translate-expression node.right, scope, g-left.state, g-left.t-node
      handle-assign assign-to, scope, g-right.state, g-right.t-node, #
        g-left.cleanup()
        g-right.cleanup()
    
    Binary: do
      let lazy-ops = {
        "&&": #(node, scope, state, assign-to)
          let g-left = generator-translate-expression node.left, scope, state, assign-to or true
          let t-node = memoize g-left.t-node
          g-left.state.goto-if get-pos(node), t-node, #-> when-true-branch, #-> post-branch
          let when-true-branch = g-left.state.branch()
          let g-right = generator-translate-expression node.right, scope, when-true-branch, t-node
          g-right.state.goto get-pos(node), #-> post-branch
          let post-branch = g-left.state.branch()
          {
            t-node
            state: post-branch
            cleanup: #
              g-left.cleanup()
              g-right.cleanup()
          }
        "||": #(node, scope, state, assign-to)
          let g-left = generator-translate-expression node.left, scope, state, assign-to or true
          let t-node = memoize g-left.t-node
          g-left.state.goto-if get-pos(node), t-node, #-> post-branch, #-> when-false-branch
          let when-false-branch = g-left.state.branch()
          let g-right = generator-translate-expression node.right, scope, when-false-branch, t-node
          g-right.state.goto get-pos(node), #-> post-branch
          let post-branch = g-left.state.branch()
          {
            t-node
            state: post-branch
            cleanup: #
              g-left.cleanup()
              g-right.cleanup()
          }
      }
      #(node, scope, state, assign-to)
        if lazy-ops ownskey node.op
          lazy-ops[node.op] node, scope, state, assign-to
        else
          let g-left = generator-translate-expression node.left, scope, state, true
          let g-right = generator-translate-expression node.right, scope, g-left.state, false
          handle-assign assign-to, scope, g-right.state, #-> first!(
            ast.Binary get-pos(node),
              g-left.t-node()
              last!(g-left.cleanup(), node.op)
              first!(g-right.t-node(), g-right.cleanup()))
    
    Block: #(node, scope, mutable state, assign-to)
      for subnode, i, len in node.nodes
        let result = generator-translate-expression subnode, scope, state, i == len - 1 and assign-to
        state := result.state
        if i == len - 1
          return result
      throw Error "Unreachable state"
    
    Call: #(node, scope, mutable state, assign-to)
      let g-func = generator-translate-expression node.func, scope, state, true
      let {is-apply, is-new, args} = node
      
      if is-apply and (args.length == 0 or args[0] not instanceof ParserNode.Spread)
        let g-start = if args.length == 0
          {
            g-func.state
            t-node: #-> ast.Const get-pos(node), void
            cleanup: do-nothing
          }
        else
          generator-translate-expression args[0], scope, g-func.state, true
        let g-args = generator-array-translate get-pos(node), args[1 to -1], scope, g-start.state
        handle-assign assign-to, scope, g-args.state, #
          let func = g-func.t-node()
          let start = g-start.t-node()
          let args = g-args.t-node()
          g-func.cleanup()
          g-start.cleanup()
          g-args.cleanup()
          if args instanceof ast.Arr
            ast.Call get-pos(node),
              ast.Access get-pos(node), func, \call
              [
                start
                ...args.elements
              ]
          else
            ast.Call get-pos(node),
              ast.Access get-pos(node), func, \apply
              [
                start
                args
              ]
      else
        let g-args = generator-array-translate get-pos(node), args, scope, g-func.state
        handle-assign assign-to, scope, g-args.state, #
          let func = g-func.t-node()
          let args = g-args.t-node()
          g-func.cleanup()
          g-args.cleanup()
          if is-apply
            ast.Call get-pos(node),
              ast.Access get-pos(node), func, \apply
              [
                ast.Access get-pos(node), args, ast.Const get-pos(node), 0
                ast.Call get-pos(node),
                  ast.Access get-pos(node),
                    args
                    ast.Const get-pos(node), \slice
                  [ast.Const get-pos(node), 1]
              ]
          else if is-new
            scope.add-helper \__new
            ast.Call get-pos(node),
              ast.Ident get-pos(node), \__new
              [func, args]
          else if args instanceof ast.Arr
            ast.Call get-pos(node),
              ast.Access get-pos(node), func, \call
              [
                if func instanceof ast.Binary and func.op == "."
                  func.left
                else
                  ast.Const get-pos(node), void
                ...args.elements
              ]
          else
            ast.Call get-pos(node),
              ast.Access get-pos(node), func, \apply
              [
                if func instanceof ast.Binary and func.op == "."
                  func.left
                else
                  ast.Const get-pos(node), void
                args
              ]
    
    EmbedWrite: #(node, scope, mutable state, assign-to)
      let g-text = generator-translate-expression node.text, scope, state, false
      handle-assign assign-to, scope, g-text.state, (#-> ast.Call get-pos(node),
        ast.Ident get-pos(node), \write
        [
          g-text.t-node()
          ...if node.escape
            [ast.Const get-pos(node), true]
          else
            []
        ]), g-text.cleanup
    
    Eval: #(node, scope, mutable state, assign-to)
      let g-code = generator-translate-expression node.code, scope, state, false
      handle-assign assign-to, scope, g-code.state, #-> ast.Eval get-pos(node), g-code.t-node(), g-code.cleanup
    
    If: #(node, scope, mutable state, assign-to)
      let test = generator-translate-expression node.test, scope, state, state.has-generator-node(node.test)
      state := test.state
      
      if state.has-generator-node(node.when-true) or state.has-generator-node(node.when-false)
        // TODO: handle case when only one of when-true/when-false has generator nodes
        state.goto-if get-pos(node), #-> first!(test.t-node(), test.cleanup()), #-> when-true-branch, #-> when-false-branch
        let t-tmp = make-t-tmp(assign-to, scope, get-pos(node))
        let when-true-branch = state.branch()
        let g-when-true = generator-translate-expression node.when-true, scope, when-true-branch, t-tmp
        g-when-true.state.goto get-pos(node.when-true), #-> post-branch
        let when-false-branch = state.branch()
        let g-when-false = generator-translate-expression node.when-false, scope, when-false-branch, t-tmp
        g-when-false.state.goto get-pos(node.when-false), #-> post-branch
        let post-branch = state.branch()
        let cleanup = make-cleanup assign-to, scope, t-tmp
        {
          state: post-branch
          t-node: t-tmp
          cleanup: #
            g-when-true.cleanup()
            g-when-false.cleanup()
            cleanup()
        }
      else
        let t-when-true = translate node.when-true, scope, \expression
        let t-when-false = translate node.when-false, scope, \expression
        handle-assign assign-to, scope, state, #-> ast.If get-pos(node),
          test.t-node()
          last!(test.cleanup(), t-when-true())
          t-when-false()
    
    Regexp: #(node, scope, mutable state, assign-to)
      let g-source = generator-translate-expression node.source, scope, state, false
      handle-assign assign-to, scope, state, (#
        let source = g-source.t-node()
        if source.is-const()
          ast.Regex get-pos(node), String(source.const-value()), node.flags
        else
          ast.Call get-pos(node),
            ast.Ident get-pos(node), \RegExp
            [
              source
              ast.Const get-pos(node), flags
            ]), g-source.cleanup
    
    TmpWrapper: #(node, scope, state, assign-to)
      let g-node = generator-translate-expression node.node, scope, state, false
      handle-assign assign-to, scope, g-node.state, g-node.t-node, #
        g-node.cleanup()
        for tmp in node.tmps by -1
          scope.release-tmp tmp
    
    Unary: #(node, scope, state, assign-to)
      let g-node = generator-translate-expression node.node, scope, state, false
      handle-assign assign-to, scope, g-node.state, #-> first!(
        ast.Unary get-pos(node),
          node.op
          first!(g-node.t-node(), g-node.cleanup()))
    
    Yield: #(node, scope, mutable state, assign-to)
      let g-node = generator-translate-expression node.node, scope, state, false
      state := state.yield get-pos(node), g-node.t-node
      handle-assign assign-to, scope, state, #-> state.builder.received-ident, g-node.cleanup
  
  let generator-translate-expression(node as ParserNode, scope as Scope, state as GeneratorState, assign-to as Boolean|->)
    let key = node.constructor.capped-name
    if state.has-generator-node node
      if expressions ownskey key
        expressions[key](node, scope, state, assign-to)
      else
        throw Error "Unknown expression type: $(typeof! node)"
    else
      handle-assign assign-to, scope, state, translate node, scope, \expression
  
  let statements =
    Block: #(node, scope, state, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: block with label in generator"
      for reduce subnode in node.nodes, acc = state
        generator-translate subnode, scope, acc, break-state, continue-state

    Break: #(node, scope, state, break-state)
      if node.label?
        throw Error "Not implemented: break with label in a generator"
      if not break-state?
        throw Error "break found outside of a loop or switch"

      state.goto get-pos(node), break-state
      state
    
    Continue: #(node, scope, state, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: break with label in a generator"
      if not continue-state?
        throw Error "continue found outside of a loop"

      state.goto get-pos(node), continue-state
      state
    
    For: #(node, scope, mutable state)
      if node.label?
        throw Error "Not implemented: for with label in generator"
      if node.init? and node.init not instanceof ParserNode.Nothing
        state := generator-translate node.init, scope, state
      state.goto get-pos(node), #-> test-branch
      
      let test-branch = state.branch()
      let g-test = generator-translate-expression node.test, scope, test-branch, state.has-generator-node(node.test)
      test-branch.goto-if get-pos(node.test), #-> first!(g-test.t-node(), g-test.cleanup()), #-> body-branch, #-> post-branch
      
      let body-branch = state.branch()
      generator-translate(node.body, scope, body-branch, #-> post-branch, #-> step-branch).goto get-pos(node.body), #-> step-branch or test-branch
      
      let mutable step-branch = null
      if node.step? and node.step not instanceof ParserNode.Nothing
        step-branch := state.branch()
        generator-translate(node.step, scope, step-branch).goto get-pos(node.step), #-> test-branch
      
      let post-branch = state.branch()
      post-branch
    
    ForIn: #(node, scope, mutable state)
      if node.label?
        throw Error "Not implemented: for-in with label in generator"
      let t-key = translate node.key, scope, \left-expression
      let g-object = generator-translate-expression node.object, scope, state, false // TODO: check whether or not this should be cached
      state := g-object.state
      let keys = scope.reserve-ident get-pos(node), \keys, Type.string.array()
      let get-key = memoize #
        let key = t-key()
        if key not instanceof ast.Ident
          throw Error("Expected an Ident for a for-in key")
        scope.add-variable key, Type.string
        key
      let index = scope.reserve-ident get-pos(node), \i, Type.number
      let length = scope.reserve-ident get-pos(node), \len, Type.number
      scope.add-helper \__allkeys
      state := state.add # -> ast.Block get-pos(node), [
        ast.Assign get-pos(node), keys,
          ast.Call get-pos(node),
            ast.Ident get-pos(node), \__allkeys
            [first!(g-object.t-node(), g-object.cleanup())]
        ast.Assign get-pos(node), index, 0
        ast.Assign get-pos(node), length, ast.Access(get-pos(node), keys, \length)
      ]
      state.goto get-pos(node), #-> test-branch
      
      let test-branch = state.branch()
      test-branch.goto-if get-pos(node), #-> ast.Binary(get-pos(node), index, "<", length), #-> body-branch, #-> post-branch
      
      let body-branch = test-branch.branch()
      state := body-branch.add #-> ast.Assign get-pos(node), get-key(), ast.Access get-pos(node), keys, index
      generator-translate(node.body, scope, state, #-> post-branch, #-> step-branch).goto get-pos(node.body), #-> step-branch
      
      let step-branch = body-branch.branch()
      step-branch.add(#-> ast.Unary get-pos(node), "++", index).goto get-pos(node), #-> test-branch
      
      let post-branch = step-branch.branch()
      post-branch
    
    If: #(node, scope, mutable state, break-state, continue-state)
      let test = generator-translate-expression node.test, scope, state, state.has-generator-node(node.test)
      state := test.state
      
      if state.has-generator-node(node.when-true) or state.has-generator-node(node.when-false)
        state.goto-if get-pos(node), #-> first!(test.t-node(), test.cleanup()), #-> when-true-branch or post-branch, #-> when-false-branch or post-branch
        let when-true-branch = if node.when-true and node.when-true not instanceof ParserNode.Nothing then state.branch()
        if when-true-branch
          generator-translate(node.when-true, scope, when-true-branch, break-state, continue-state).goto get-pos(node.when-true), #-> post-branch
        let when-false-branch = if node.when-false and node.when-false not instanceof ParserNode.Nothing then state.branch()
        if when-false-branch
          generator-translate(node.when-false, scope, when-false-branch, break-state, continue-state).goto get-pos(node.when-false), #-> post-branch
        let post-branch = state.branch()
        post-branch
      else
        let t-when-true = translate node.when-true, scope, \statement
        let t-when-false = translate node.when-false, scope, \statement
        state.add #-> ast.If get-pos(node),
          test.t-node()
          last!(test.cleanup(), t-when-true())
          t-when-false()
    
    Return: #(node, scope, mutable state)
      let pos = get-pos(node)
      if node.node.is-const() and node.node.const-value() == void
        state.return get-pos(node)
        state
      else
        let g-node = generator-translate-expression node.node, scope, state, false
        state := g-node.state
        state.return get-pos(node), #-> first!(
          g-node.t-node()
          g-node.cleanup())
        state
      
    Switch: #(node, scope, state, , continue-state)
      if node.label?
        throw Error "Not implemented: switch with label in generator"
      let g-node = generator-translate-expression node.node, scope, state, false // TODO: should this be true?
      let body-states = []
      let result-cases = []
      g-node.state.add #-> ast.Switch get-pos(node),
        g-node.t-node()
        for case_ in result-cases; case_()
        default-case()
      g-node.state.add #-> ast.Break get-pos(node)
      for case_, i in node.cases
        if state.has-generator-node case_.node
          throw Error "Cannot use yield in the check of a switch's case"
        let t-case-node = translate case_.node, scope, \expression
        let case-branch = g-node.state.branch()
        body-states[i] := case-branch
        let g-case-body = generator-translate case_.body, scope, case-branch, #-> post-branch, continue-state
        g-case-body.goto get-pos(case_.node), if case_.fallthrough
          #-> body-states[i + 1] or post-branch
        else
          #-> post-branch
        let t-goto = case-branch.make-goto get-pos(case_.node), #-> case-branch
        result-cases.push #-> ast.Switch.Case get-pos(case_.node), t-case-node(), ast.Block get-pos(case_.node), [
          t-goto()
          ast.Break get-pos(case_.node)
        ]
      let default-case = if node.default-case?
        let default-branch = g-node.state.branch()
        let g-default-body = generator-translate node.default-case, scope, default-branch, #-> post-branch, continue-state
        g-default-body.goto get-pos(node.default-case), #-> post-branch
        default-branch.make-goto get-pos(node.default-case), #-> default-branch
      else
        g-node.state.make-goto get-pos(node), #-> post-branch
      let post-branch = state.branch()
      post-branch
    
    Throw: #(node, scope, state, break-state, continue-state)
      let g-node = generator-translate-expression node.node, scope, state, false
      g-node.state.add #-> ast.Throw get-pos(node), first!(g-node.t-node(), g-node.cleanup())
    
    TmpWrapper: #(node, scope, state, break-state, continue-state)
      let result = generator-translate node.node, scope, state, break-state, continue-state
      for tmp in node.tmps by -1
        scope.release-tmp tmp
      result
    
    TryCatch: #(node, scope, mutable state, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: try-catch with label in generator"
      
      state := state.enter-try-catch get-pos(node)
      state := generator-translate node.try-body, scope, state, break-state, continue-state
      state := state.exit-try-catch get-pos(node.try-body), (translate node.catch-ident, scope, \left-expression, false), #-> post-branch
      state := generator-translate node.catch-body, scope, state, break-state, continue-state
      state.goto get-pos(node), #-> post-branch
      let post-branch = state.branch()
      post-branch
    
    TryFinally: #(node, scope, mutable state, break-state, continue-state)
      if node.label?
        throw Error "Not implemented: try-finally with label in generator"
      
      if state.has-generator-node node.finally-body
        throw Error "Cannot use yield in a finally"
      
      state := state.pending-finally get-pos(node), translate node.finally-body, scope, \statement
      state := generator-translate node.try-body, scope, state, break-state, continue-state
      state.run-pending-finally get-pos(node)
    
    Yield: #(node, scope, mutable state)
      let g-node = generator-translate-expression node.node, scope, state, false
      state.yield get-pos(node), #-> first!(
        g-node.t-node()
        g-node.cleanup())
    
  #(node as ParserNode, scope as Scope, state as GeneratorState, break-state, continue-state)
    if state.has-generator-node node
      let key = node.constructor.capped-name
      if statements ownskey key
        let ret = statements[key](node, scope, state, break-state, continue-state)
        if ret not instanceof GeneratorState
          throw Error "Translated non-GeneratorState from $(typeof! node): $(typeof! ret)"
        ret
      else
        let ret = generator-translate-expression node, scope, state
        ret.state.add #-> first!(
          ret.t-node()
          ret.cleanup())
    else
      state.add translate node, scope, \statement, false

let array-translate(pos as {}, elements, scope, replace-with-slice, allow-array-like, unassigned)
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
    #-> ast.Arr pos, for t-item in translated-items[0]; t-item()
  else
    for translated-item, i in translated-items by -1
      if i %% 2
        if translated-item.length > 0
          translated-items[i] := #
            let items = for t-item in translated-item; t-item()
            ast.Arr items[0].pos, items
        else
          translated-items.splice i, 1
      else
        translated-items[i] := #
          let node = translated-item.t-node()
          if translated-item.type.is-subset-of Type.array
            node
          else
            scope.add-helper \__to-array
            ast.Call node.pos,
              ast.Ident node.pos, \__to-array
              [node]

    if translated-items.length == 1
      #
        let array = translated-items[0]()
        if replace-with-slice and array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array
          ast.Call pos,
            ast.Access(pos, ast.Ident(pos, \__slice), \call)
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
        ast.Call pos,
          ast.Access pos, head, \concat
          rest

let translators =
  Access: #(node, scope, location, auto-return, unassigned)
    let t-parent = translate node.parent, scope, \expression, null, unassigned
    let t-child = translate node.child, scope, \expression, null, unassigned
    #-> auto-return ast.Access(get-pos(node), t-parent(), t-child())

  Args: #(node, scope, location, auto-return)
    #-> auto-return ast.Arguments(get-pos(node))

  Array: #(node, scope, location, auto-return, unassigned)
    let t-arr = array-translate get-pos(node), node.elements, scope, true, false, unassigned
    #-> auto-return t-arr()

  Assign: #(node, scope, location, auto-return, unassigned)
    let op = node.op
    let t-left = translate node.left, scope, \left-expression
    let t-right = translate node.right, scope, \expression, null, unassigned
    if unassigned and node.left instanceof ParserNode.Ident
      if op == "=" and unassigned[node.left.name] and node.right.is-const() and is-void! node.right.const-value()
        return #-> ast.Noop(get-pos(node))
      unassigned[node.left.name] := false
    
    #
      let left = t-left()
      let right = t-right()
      if op == "=" and location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name? and scope.has-own-variable(left) and not scope.is-variable-mutable(left)
        scope.mark-as-function left
        let func = ast.Func(get-pos(node), left, right.params, right.variables, right.body, right.declarations)
        if auto-return != identity
          ast.Block get-pos(node),
            * func
            * auto-return left
        else
          func
      else
        auto-return ast.Binary(get-pos(node), left, op, right)

  Binary: #(node, scope, location, auto-return, unassigned)
    let t-left = translate node.left, scope, \expression, null, unassigned
    let t-right = translate node.right, scope, \expression, null, unassigned
    #-> auto-return ast.Binary(get-pos(node), t-left(), node.op, t-right())

  Block: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-nodes = translate-array node.nodes, scope, location, auto-return, unassigned
    # -> ast.Block get-pos(node), (for t-node in t-nodes; t-node()), t-label?()

  Break: #(node, scope)
    let t-label = node.label and translate node.label, scope, \label
    #-> ast.Break(get-pos(node), t-label?())
  
  Call: #(node, scope, location, auto-return, unassigned)
    let t-func = translate node.func, scope, \expression, null, unassigned
    let is-apply = node.is-apply
    let is-new = node.is-new
    let args = node.args
    if is-apply and (args.length == 0 or args[0] not instanceof ParserNode.Spread)
      let t-start = if args.length == 0 then #-> ast.Const(get-pos(node), void) else translate(args[0], scope, \expression, null, unassigned)
      let t-arg-array = array-translate(get-pos(node), args[1 to -1], scope, false, true, unassigned)
      #
        let func = t-func()
        let start = t-start()
        let arg-array = t-arg-array()
        if arg-array instanceof ast.Arr
          auto-return ast.Call get-pos(node),
            ast.Access get-pos(node), func, \call
            [start, ...arg-array.elements]
        else
          auto-return ast.Call get-pos(node),
            ast.Access get-pos(node), func, \apply
            [start, arg-array]
    else
      let t-arg-array = array-translate(get-pos(node), args, scope, false, true, unassigned)
      #
        let func = t-func()
        let arg-array = t-arg-array()
        if is-apply
          async set-array, array <- scope.maybe-cache arg-array, Type.array
          scope.add-helper \__slice
          auto-return ast.Call get-pos(node),
            ast.Access get-pos(node), func, \apply
            [
              ast.Access get-pos(node), set-array, 0
              ast.Call get-pos(node),
                ast.Access get-pos(node),
                  ast.Ident get-pos(node), \__slice
                  \call
                [array, ast.Const get-pos(node), 1]
            ]
        else if arg-array instanceof ast.Arr
          auto-return ast.Call get-pos(node),
            func
            arg-array.elements
            is-new
        else if is-new
          scope.add-helper \__new
          auto-return ast.Call get-pos(node),
            ast.Ident(get-pos(node), \__new)
            [func, arg-array]
        else if func instanceof ast.Binary and func.op == "."
          async set-parent, parent <- scope.maybe-cache func.left, Type.function
          auto-return ast.Call get-pos(node),
            ast.Access get-pos(node), set-parent, func.right, \apply
            [parent, arg-array]
        else
          auto-return ast.Call get-pos(node),
            ast.Access get-pos(node), func, \apply
            [ast.Const(get-pos(node), void), arg-array]
  
  Comment: #(node, scope, location, auto-return) -> #-> ast.Comment(get-pos(node), node.text)
  
  Const: #(node, scope, location, auto-return) -> #-> auto-return ast.Const(get-pos(node), node.value)
  
  Continue: #(node, scope)
    let t-label = node.label and translate node.label, scope, \label
    #-> ast.Continue(get-pos(node), t-label?())

  Debugger: #(node) -> #-> ast.Debugger(get-pos(node))

  Def: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray def"
  
  EmbedWrite: #(node, scope, location, auto-return, unassigned)
    let t-text = translate node.text, scope, \expression, null, unassigned
    #
      ast.Call get-pos(node),
        ast.Ident get-pos(node), \write
        [
          t-text()
          ...if node.escape
            [ast.Const get-pos(node), true]
          else
            []
        ]
  
  Eval: #(node, scope, location, auto-return, unassigned)
    let t-code = translate node.code, scope, \expression, null, unassigned
    #-> auto-return ast.Eval get-pos(node), t-code()

  For: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-init = if node.init? then translate node.init, scope, \expression, null, unassigned
    // don't send along the normal unassigned array, since the loop could be repeated thus requiring reset to void.
    let t-test = if node.test? then translate node.test, scope, \expression
    let t-step = if node.step? then translate node.step, scope, \expression
    let t-body = translate node.body, scope, \statement
    # -> ast.For get-pos(node),
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
      ast.ForIn(get-pos(node), key, t-object(), t-body(), t-label?())

  Function: do
    let primitive-types = {
      Boolean: \boolean
      String: \string
      Number: \number
      Function: \function
    }
    let translate-type-checks =
      Ident: #(node)
        if primitive-types ownskey node.name
          Type[primitive-types[node.name]]
        else
          Type.any // FIXME
      Access: #(node)
        Type.any // FIXME
      TypeUnion: #(node)
        let mutable result = Type.none
        for type in node.types
          if type instanceof ParserNode.Const
            if is-null! type.value
              result := result.union Type.null
            else if is-void! type.value
              result := result.union Type.undefined
            else
              throw Error "Unknown const value for typechecking: $(String type.value)"
          else if type instanceof ParserNode.Ident
            result := result.union if primitive-types ownskey type.name
              Type[primitive-types[type.name]]
            else
              Type.any // FIXME
          else
            throw Error "Not implemented: typechecking for non-idents/consts within a type-union"
        result
      TypeFunction: #(node)
        Type.function
      TypeGeneric: #(node)
        if node.basetype.name == \Array
          translate-type-check(node.args[0]).array()
        else if node.basetype.name == \Function
          Type.function
        else
          Type.any
      TypeObject: #(node)
        let type-data = {}
        
        for {key, value} in node.pairs
          if key instanceof ParserNode.Const
            type-data[key.value] := translate-type-check(value)
        
        Type.make-object type-data
    let translate-type-check(node)
      unless translate-type-checks ownskey node.constructor.capped-name
        throw Error "Unknown type: $(String node.constructor.capped-name)"

      translate-type-checks[node.constructor.capped-name] node
    let translate-param-types = {
      Param: #(param, scope, inner)
        let mutable ident = translate(param.ident, scope, \param)()

        let later-init = []
        if ident instanceof ast.Binary and ident.op == "." and ident.right instanceof ast.Const and is-string! ident.right.value
          let tmp = ast.Ident ident.pos, ident.right.value
          later-init.push ast.Binary(ident.pos, ident, "=", tmp)
          ident := tmp

        unless ident instanceof ast.Ident
          throw Error "Expecting param to be an Ident, got $(typeof! ident)"
        
        let type = if param.as-type then translate-type-check(param.as-type)
        // TODO: mark the param as having a type
        scope.add-variable ident, type, param.is-mutable
        scope.mark-as-param ident

        {
          init: later-init
          ident
          spread: not not param.spread
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
        TypeGeneric: #(node, scope)
          let base = translate-type(node.basetype, scope)
          let args = for arg in node.args; translate-type(arg, scope)
          Type.generic(base, ...args)
        TypeUnion: #(node, scope)
          for reduce type in node.types, current = Type.none
            current.union(translate-type(type))
      }
      #(node, scope)
        unless translate-types ownskey node.constructor.capped-name
          throw Error "Unknown type to translate: $(String node.constructor.capped-name)"
        translate-types[node.constructor.capped-name](node, scope)

    #(node, scope, location, auto-return) -> #
      let mutable inner-scope = scope.clone(not not node.bound)
      let real-inner-scope = inner-scope
      if node.generator and not inner-scope.bound
        inner-scope := inner-scope.clone(true)
      let param-idents = []
      let initializers = []

      for p, i, len in node.params
        let param = translate-param p, inner-scope, false
        if param.spread
          throw Error "Encountered a spread parameter"
        param-idents.push param.ident
        initializers.push ...param.init

      let unassigned = {}
      let mutable body = if node.generator
        let builder = GeneratorBuilder(get-pos(node), inner-scope)
        generator-translate(node.body, inner-scope, builder.start).goto(get-pos(node), #-> builder.stop)
        builder.create()
      else
        translate(node.body, inner-scope, \top-statement, node.auto-return, unassigned)()
      inner-scope.release-tmps()
      body := ast.Block get-pos(node.body), [...initializers, body]
      if inner-scope.used-this or node.bound instanceof ParserNode
        if node.bound instanceof ParserNode
          let fake-this = ast.Ident get-pos(node.body), \_this
          inner-scope.add-variable fake-this // TODO: the type for this?
          body := ast.Block get-pos(node.body),
            * ast.Assign get-pos(node.body), fake-this, translate(node.bound, scope, \expression, null, unassigned)()
            * body
            * ast.Return get-pos(node.body), fake-this
        else
          if inner-scope.bound
            scope.used-this := true
          if (inner-scope.has-bound or node.generator) and not real-inner-scope.bound
            let fake-this = ast.Ident get-pos(node.body), \_this
            inner-scope.add-variable fake-this // TODO: the type for this?
            body := ast.Block get-pos(node.body),
              * ast.Assign get-pos(node.body), fake-this, ast.This(get-pos(node.body))
              * body
      if node.curry
        throw Error "Expected node to already be curried"
      auto-return ast.Func get-pos(node), null, param-idents, inner-scope.get-variables(), body, []

  Ident: do
    let PRIMORDIAL_GLOBALS = {
      +Object
      +String
      +Number
      +Boolean
      +Function
      +Array
      +Math
      +JSON
      +Date
      +RegExp
      +Error
      +RangeError
      +ReferenceError
      +SyntaxError
      +TypeError
      +URIError
      +escape
      +unescape
      +parseInt
      +parseFloat
      +isNaN
      +isFinite
      +decodeURI
      +decodeURIComponent
      +encodeURI
      +encodeURIComponent
    }
    #(node, scope, location, auto-return)
      let name = node.name
      scope.add-helper name
      #
        let ident = ast.Ident get-pos(node), name
        if not scope.options.embedded or PRIMORDIAL_GLOBALS ownskey name or location != \expression or scope.has-variable(ident) or scope.macros.has-helper(name)
          auto-return ident
        else
          ast.Access get-pos(node),
            ast.Ident get-pos(node), \context
            ast.Const get-pos(node), name

  If: #(node, scope, location, auto-return, unassigned)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    let t-label = node.label and translate node.label, scope, \label
    let t-test = translate node.test, scope, \expression, null, unassigned
    let t-when-true = translate node.when-true, scope, inner-location, auto-return, unassigned
    let t-when-false = if node.when-false? then translate node.when-false, scope, inner-location, auto-return, unassigned
    #-> ast.If get-pos(node), t-test(), t-when-true(), t-when-false?(), t-label?()
  
  Nothing: #(node) -> #-> ast.Noop(get-pos(node))

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
        ast.Call get-pos(node),
          ast.Ident get-pos(node), \__create
          [prototype]
      else
        ast.Obj get-pos(node), for {key, value} in const-pairs
          ast.Obj.Pair key.pos, String(key.value), value
      
      if post-const-pairs.length == 0
        auto-return obj
      else
        let ident = scope.reserve-ident get-pos(node), \o, Type.object
        let result = ast.BlockExpression get-pos(node),
          * ast.Assign get-pos(node), ident, obj
          * ...for pair in post-const-pairs
              let {key, property} = pair
              if property
                scope.add-helper \__def-prop
                ast.Call key.pos, ast.Ident(key.pos, \__def-prop), [
                  ident
                  key
                  if property == \property
                    pair.value
                  else if property == \getset
                    ast.Obj pair.get.pos, [
                      ast.Obj.Pair pair.get.pos, \get, pair.get
                      ast.Obj.Pair pair.set.pos, \set, pair.set
                      ast.Obj.Pair pair.set.pos, \configurable, ast.Const(pair.set.pos, true)
                      ast.Obj.Pair pair.set.pos, \enumerable, ast.Const(pair.set.pos, true)
                    ]
                  else if property == \setget
                    ast.Obj pair.set.pos, [
                      ast.Obj.Pair pair.set.pos, \set, pair.set
                      ast.Obj.Pair pair.get.pos, \get, pair.get
                      ast.Obj.Pair pair.get.pos, \configurable, ast.Const(pair.get.pos, true)
                      ast.Obj.Pair pair.get.pos, \enumerable, ast.Const(pair.get.pos, true)
                    ]
                  else if property == \get
                    ast.Obj pair.value.pos, [
                      ast.Obj.Pair pair.value.pos, \get, pair.value
                      ast.Obj.Pair pair.value.pos, \configurable, ast.Const(pair.value.pos, true)
                      ast.Obj.Pair pair.value.pos, \enumerable, ast.Const(pair.value.pos, true)
                    ]
                  else if property == \set
                    ast.Obj pair.value.pos, [
                      ast.Obj.Pair pair.value.pos, \set, pair.value
                      ast.Obj.Pair pair.value.pos, \configurable, ast.Const(pair.value.pos, true)
                      ast.Obj.Pair pair.value.pos, \enumerable, ast.Const(pair.value.pos, true)
                    ]
                  else
                    throw Error("Unknown property type: $(String property)")
                ]
              else
                ast.Assign key.pos, ast.Access(key.pos, ident, key), pair.value
          * ident
        scope.release-ident ident
        auto-return result
  
  Regexp: #(node, scope, location, auto-return, unassigned)
    let t-source = translate(node.source, scope, \expression, null, unassigned)
    #
      let source = t-source()
      let flags = node.flags
      if source.is-const()
        auto-return ast.Regex get-pos(node), String(source.const-value()), flags
      else
        auto-return ast.Call get-pos(node),
          ast.Ident get-pos(node), \RegExp
          [
            source
            ast.Const get-pos(node), flags
          ]
  
  Return: #(node, scope, location, auto-return, unassigned)
    if location not in [\statement, \top-statement]
      throw Error "Expected Return in statement position"
    let t-value = translate node.node, scope, \expression, null, unassigned
    #-> ast.Return get-pos(node), t-value()
  
  Switch: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-node = translate node.node, scope, \expression, null, unassigned
    let t-cases = for case_ in node.cases
      {
        pos: get-pos(case_.node)
        t-node: translate case_.node, scope, \expression, null, unassigned
        t-body: translate case_.body, scope, \statement, null, unassigned
        case_.fallthrough
      }
    let t-default-case = if node.default-case? then translate node.default-case, scope, \statement, null, unassigned
    #
      ast.Switch get-pos(node),
        t-node()
        for case_, i, len in t-cases
          let case-node = case_.t-node()
          let mutable case-body = case_.t-body()
          if not case_.fallthrough or (i == len - 1 and default-case.is-noop())
            case-body := ast.Block case_.pos, [
              auto-return case-body
              ast.Break case-body.pos]
          ast.Switch.Case(case_.pos, case-node, case-body)
        if t-default-case?
          auto-return t-default-case()
        else
          ast.Noop(get-pos(node))
        t-label?()

  Super: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray super call"

  Tmp: #(node, scope, location, auto-return)
    let ident = scope.get-tmp(get-pos(node), node.id, node.name, node.type())
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
        ast.Ident get-pos(node), \_this
      else
        ast.This get-pos(node)

  Throw: #(node, scope, location, auto-return, unassigned)
    let t-node = translate node.node, scope, \expression, null, unassigned
    #-> ast.Throw get-pos(node), t-node()

  TryCatch: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-try-body = translate node.try-body, scope, \statement, auto-return, unassigned
    let inner-scope = scope.clone(false)
    let t-catch-ident = translate node.catch-ident, inner-scope, \left-expression
    let t-catch-body = translate node.catch-body, inner-scope, \statement, auto-return, unassigned
    #
      let catch-ident = t-catch-ident()
      if catch-ident instanceof ast.Ident
        inner-scope.add-variable catch-ident
        inner-scope.mark-as-param catch-ident
      let result = ast.TryCatch get-pos(node), t-try-body(), catch-ident, t-catch-body(), t-label?()
      scope.variables <<< inner-scope.variables
      result

  TryFinally: #(node, scope, location, auto-return, unassigned)
    let t-label = node.label and translate node.label, scope, \label
    let t-try-body = translate node.try-body, scope, \statement, auto-return, unassigned
    let t-finally-body = translate node.finally-body, scope, \statement, null, unassigned
    #-> ast.TryFinally get-pos(node), t-try-body(), t-finally-body(), t-label?()

  Unary: #(node, scope, location, auto-return, unassigned)
    if unassigned and node.op in ["++", "--", "++post", "--post"] and node.node instanceof ParserNode.Ident
      unassigned[node.node.name] := false
    let t-subnode = translate node.node, scope, \expression, null, unassigned
    #-> auto-return ast.Unary get-pos(node), node.op, t-subnode()
  
  Var: #(node, scope, location, auto-return, unassigned)
    if unassigned and node.ident instanceof ParserNode.Ident and unassigned not ownskey node.ident.name
      unassigned[node.ident.name] := true
    let t-ident = translate node.ident, scope, \left-expression, auto-return
    #
      let ident = t-ident()
      scope.add-variable ident, Type.any, node.is-mutable
      ast.Noop(get-pos(node))

let translate(node as Object, scope as Scope, location as String, mutable auto-return, unassigned)
  unless is-function! auto-return
    auto-return := make-auto-return auto-return

  unless translators ownskey node.constructor.capped-name
    throw Error "Unable to translate unknown node type: $(String node.constructor.capped-name)"

  let ret = translators[node.constructor.capped-name](node, scope, location, auto-return, unassigned)
  unless is-function! ret
    throw Error "Translated non-function: $(typeof! ret)"
  ret

let translate-array(nodes as [], scope as Scope, location as String, auto-return, unassigned)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and auto-return, unassigned

let translate-root(mutable roots as Object, scope as Scope)
  if not is-array! roots
    roots := [roots]
  if roots.length == 0
    roots.push { type: "Root", line: 0, column: 0, body: { type: "Nothing", line: 0, column: 0 } }

  let split-comments(mutable body)
    let comments = []
    while true
      if body instanceof ast.Comment
        comments.push body
        body := ast.Noop body.pos
      else if body instanceof ast.Block and body.body[0] instanceof ast.Comment
        comments.push body.body[0]
        body := ast.Block body.pos, body.body[1 to -1]
      else
        break
    { comments, body }

  let no-pos = make-pos 0, 0
  
  if scope.options.embedded
    for name in [\write, \context]
      let ident = ast.Ident { line: 0, column: 0 }, name
      scope.add-variable ident
      scope.mark-as-param ident
  
  let mutable body = if roots.length == 1
    if roots[0] not instanceof ParserNode.Root
      throw Error "Cannot translate non-Root object"
    ast.Block get-pos(roots[0]),
      [translate(roots[0].body, scope, \top-statement, scope.options.return or scope.options.eval, [])()]
  else
    ast.Block no-pos,
      for root in roots
        if root not instanceof ParserNode.Root
          throw Error "Cannot translate non-Root object"
        let inner-scope = scope.clone(true)
        let {comments, body: root-body} = split-comments translate(root.body, inner-scope, \top-statement, scope.options.return or scope.options.eval, [])()
        let root-pos = get-pos(root)
        ast.Block root-pos, [
          ...comments
          ast.Call root-pos,
            ast.Func root-pos, null, [], inner-scope.get-variables(), root-body
        ]
  
  let init = []
  if scope.has-bound and scope.used-this
    let fake-this = ast.Ident body.pos, \_this
    scope.add-variable fake-this // TODO: type for this?
    init.push ast.Assign body.pos, fake-this, ast.This(body.pos)
  
  scope.fill-helper-dependencies()
  for helper in scope.get-helpers()
    if helper != \GLOBAL and scope.macros.has-helper(helper)
      let ident = ast.Ident body.pos, helper
      scope.add-variable ident // TODO: type?
      init.push ast.Assign body.pos, ident, scope.macros.get-helper(helper)
  
  let bare-init = []
  
  if scope.options.eval
    let walker = #(node)
      if node instanceof ast.Func
        scope.add-helper \GLOBAL
        if node.name?
          ast.Block node.pos,
            * node
            * ast.Assign node.pos,
                ast.Access node.pos,
                  ast.Ident node.pos, \GLOBAL
                  node.name.name
                node.name
        else
          node
      else if node instanceof ast.Binary and node.op == "=" and node.left instanceof ast.Ident
        scope.add-helper \GLOBAL
        ast.Assign node.pos,
          ast.Access node.pos,
            ast.Ident node.pos, \GLOBAL
            node.left.name
          node.walk walker
    body := body.walk walker
    body := body.mutate-last (#(node)
      scope.add-helper \GLOBAL
      ast.Assign node.pos,
        ast.Access node.pos,
          ast.Ident node.pos, \GLOBAL
          ast.Const node.pos, \_
        node), { return: true }
  
  let {comments, body: mutable uncommented-body} = split-comments body
  if scope.options.embedded
    uncommented-body := ast.Block body.pos,
      [
        ast.Return body.pos,
          ast.Func body.pos,
            null
            [
              ast.Ident body.pos, \write
              ast.Ident body.pos, \context
            ]
            []
            ast.Block body.pos, [
              ast.If body.pos,
                ast.Binary body.pos, ast.Ident(body.pos, \context), "==", ast.Const(body.pos, null)
                ast.Assign body.pos, ast.Ident(body.pos, \context), ast.Obj(body.pos)
              uncommented-body
            ]
      ]
  
  if scope.options.bare
    if scope.has-helper(\GLOBAL)
      scope.add-variable ast.Ident body.pos, \GLOBAL
      bare-init.unshift ast.Assign body.pos,
        ast.Ident body.pos, \GLOBAL
        scope.macros.get-helper(\GLOBAL)
    if scope.options.undefined-name?
      scope.add-variable scope.options.undefined-name
    
    ast.Root body.pos,
      ast.Block body.pos, [...comments, ...bare-init, ...init, uncommented-body]
      scope.get-variables()
      ["use strict"]
  else
    let mutable call-func = ast.Call body.pos,
      ast.Access body.pos,
        ast.Func body.pos,
          null
          [
            ...if scope.has-helper(\GLOBAL)
              [ast.Ident body.pos, \GLOBAL]
            else
              []
            ...if scope.options.undefined-name?
              [ast.Ident body.pos, scope.options.undefined-name, true]
            else
              []
          ]
          scope.get-variables()
          ast.Block body.pos, [...init, uncommented-body]
          ["use strict"]
        \call
      [
        ast.This(body.pos)
        ...if scope.has-helper(\GLOBAL)
          [scope.macros.get-helper(\GLOBAL)]
        else
          []
      ]
    if scope.options.return
      call-func := ast.Return(body.pos, call-func)
    ast.Root body.pos,
      ast.Block body.pos, [...comments, ...bare-init, call-func]
      []
      []

module.exports := #(node, macros as MacroHolder, options = {}, callback)
  if is-function! options
    return module.exports(node, macros, null, options)
  let mutable result = void
  let start-time = new Date().get-time()
  try
    let scope = Scope(options, macros, false)
    result := translate-root(node, scope)
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

module.exports.define-helper := #(macros as MacroHolder, name, value, type as Type, mutable dependencies)
  let scope = Scope({}, macros, false)
  let ident = if is-string! name
    ast.Ident(make-pos(0, 0), name)
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
  macros.add-helper ident.name, helper, type, dependencies
  {
    helper
    dependencies
  }
  