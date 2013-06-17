import 'shared.gs'

require! ast: './jsast'
let AstNode = ast.Node
require! Type: './types'
let {Node: ParserNode, MacroHolder} = require('./parser')
require! LispyNode: './parser-lispynodes'
let {Cache, is-primordial} = require('./utils')

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

let make-has-generator-node = #
  let in-loop-cache = Cache<ParserNode, Boolean>()
  let has-in-loop(node)
    async node <- in-loop-cache.get-or-add node
    let mutable result = false
    if node instanceof LispyNode and node.is-internal-call(\yield, \return)
      return true
    if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if has-in-loop n
            throw FOUND
          n
      catch e == FOUND
        return true
    false

  let in-switch-cache = Cache<ParserNode, Boolean>()
  let has-in-switch(node)
    async node <- in-switch-cache.get-or-add node
    returnif in-loop-cache.get node
    if node instanceof LispyNode and node.is-internal-call(\continue, \yield, \return)
      return true
    if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if n instanceof LispyNode and n.is-internal-call(\for, \for-in)
            if has-in-loop n
              throw FOUND
          else
            if has-in-switch n
              throw FOUND
          n
      catch e == FOUND
        return true
    false
  
  let return-free-cache = Cache<ParserNode, Boolean>()
  let normal-cache = Cache<ParserNode, Boolean>()
  let has-generator-node(node as ParserNode, allow-return as Boolean)
    async node <- (if allow-return then return-free-cache else normal-cache).get-or-add node
    if not allow-return
      returnif return-free-cache.get node
    returnif in-loop-cache.get node
    returnif in-switch-cache.get node
    if node instanceof LispyNode and (node.is-internal-call(\break, \continue, \yield) or (not allow-return and node.is-internal-call(\return)))
      return true
    if node not instanceof ParserNode.Function
      let FOUND = {}
      try
        node.walk #(n)
          if n instanceof LispyNode and n.is-internal-call()
            switch n.func.name
            case \for-in, \for
              if has-in-loop n
                throw FOUND
              return n
            case \switch
              if has-in-switch n
                throw FOUND
              return n
            default
              void
          if has-generator-node n, allow-return
            throw FOUND
          n
      catch e == FOUND
        return true
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
      @add #
        let node = t-node()
        if node not instanceof ast.Statement
          ast.Return pos, ast.Obj pos, [
            ast.Obj.Pair pos, \done, ast.Const pos, true
            ast.Obj.Pair pos, \value, node
          ]
        else
          node
  
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
  def constructor(@pos as {}, @scope as Scope, @has-generator-node as ->)
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
  
  let calculate-ranges(state-ids)
    let mutable ranges = []
    let mutable range-start = -Infinity
    let mutable last-range-id = -1
    for id, i, len in state-ids
      if id != last-range-id + 1
        if last-range-id != -1
          ranges.push { start: range-start, finish: last-range-id }
        range-start := id
      last-range-id := id
    if last-range-id != -1
      ranges.push { start: range-start, finish: last-range-id }
    ranges
  
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
    let step = @scope.reserve-ident @pos, \step, Type.function
    let send = @scope.reserve-ident @pos, \send, Type.function
    let throw-ident = @scope.reserve-ident @pos, \throw, Type.function
    body.push ast.Func @pos, step, [@received-ident], [], ast.While @pos, true,
      ast.Switch @pos,
        state-ident
        for state in @states-order
          if not @redirects.has state
            let nodes = for t-node in state.nodes; t-node()
            let mutable i = 0
            while i < nodes.length, i += 1
              let node = nodes[i]
              if node instanceof ast.Func and node.name?
                body.push node
                nodes.splice i, 1
                i -= 1
            if nodes.length == 0
              throw Error "Found state with no nodes in it"
            ast.Switch.Case nodes[0].pos,
              ast.Const nodes[0].pos, state.case-id()
              ast.Block nodes[0].pos, nodes
        ast.Throw @pos,
          ast.Call @pos,
            ast.Ident @pos, \Error
            [ast.Binary @pos, "Unknown state: ", "+", state-ident]
    body.push ast.Func @pos, throw-ident, [err], [], for reduce catch-info in catches by -1, current = ast.Block @pos, [ast.Call(@pos, close, []), ast.Throw @pos, err]
      let err-ident = catch-info.t-ident()
      @scope.add-variable err-ident
      let try-state-ids = for state in catch-info.try-states
        if not @redirects.has state
          state.case-id()
      try-state-ids.sort (<=>)
      let try-state-ranges = calculate-ranges try-state-ids
      ast.If @pos,
        ast.Or @pos, ...(for {start, finish} in try-state-ranges
          if start == -Infinity
            if finish == 0
              ast.Binary @pos, state-ident, "===", ast.Const @pos, 0
            else
              ast.Binary @pos, state-ident, "<=", ast.Const @pos, finish
          else if finish == start
            ast.Binary @pos, state-ident, "===", ast.Const @pos, start
          else if finish == start + 1
            ast.Or @pos,
              ast.Binary @pos, state-ident, "===", ast.Const @pos, start
              ast.Binary @pos, state-ident, "===", ast.Const @pos, finish
          else
            ast.And @pos,
              ast.Binary @pos, state-ident, ">=", ast.Const @pos, start
              ast.Binary @pos, state-ident, "<=", ast.Const @pos, finish)
        ast.Block @pos,
          * ast.Assign @pos, err-ident, err
          * ast.Assign @pos, state-ident, ast.Const(@pos, catch-info.catch-state.case-id())
        current
    let send-try-catch = ast.TryCatch @pos,
      ast.Return @pos, ast.Call @pos, step, [@received-ident]
      err
      ast.Call @pos, throw-ident, [err]
    let send-try-finally = if @finallies.length == 0
      send-try-catch
    else
      ast.TryFinally @pos,
        send-try-catch
        ast.If @pos,
          ast.Binary @pos, state-ident, "===", @stop.case-id()
          ast.Call @pos, close, []
    body.push ast.Func @pos, send, [@received-ident], [], if catches.length
      ast.While @pos, true, send-try-finally
    else
      send-try-finally
    body.push ast.Return @pos, ast.Obj @pos,
      * ast.Obj.Pair @pos, \close, close
      * ast.Obj.Pair @pos, \iterator, ast.Func @pos, null, [], [], ast.Return(@pos, ast.This(@pos))
      * ast.Obj.Pair @pos, \next, ast.Func @pos, null, [], [], ast.Return @pos, ast.Call @pos, send, [ast.Const @pos, void]
      * ast.Obj.Pair @pos, \send, send
      * ast.Obj.Pair @pos, \throw, ast.Func @pos, null, [err], [], ast.Block @pos, [
          ast.Call @pos,
            throw-ident
            [err]
          ast.Return @pos,
            ast.Call @pos,
              send
              [ast.Const @pos, void]
        ]
    ast.Block @pos, body

let flatten-spread-array(elements)
  let result = []
  let mutable changed = false
  for element in elements
    if element instanceof LispyNode and element.is-internal-call(\spread)
      let node = element.args[0]
      if node instanceof LispyNode and node.is-internal-call(\array)
        result.push ...node.args
        changed := true
      else
        result.push element
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

let mutable get-pos = #(node as ParserNode)
  throw Error "get-pos must be overridden"

const UNASSIGNED_TAINT_KEY = "\0"

let parse-switch(args)
  let result = {
    topic: args[0]
    cases: []
  }
  let mutable len = args.length
  for i in 1 til len - 1 by 3
    result.cases.push {
      node: args[i]
      body: args[i + 1]
      fallthrough: args[i + 2]
    }
  result.default-case := args[len - 1]
  result

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
  let has-single-node-with-noops-no-spread(nodes as [ParserNode], state as GeneratorState)
    let mutable count = 0
    for node in nodes
      if node instanceof LispyNode and node.is-internal-call(\spread)
        return false
      else if state.has-generator-node node
        count += 1
        if count > 1
          return false
      else if not node.is-noop()
        return false
    count == 1
  let generator-array-translate(pos, elements, scope, mutable state as GeneratorState, assign-to)
    let t-tmp = make-t-tmp assign-to, scope, pos, \arr, Type.array
    
    if has-single-node-with-noops-no-spread(elements, state)
      let g-expr = for first element, i in elements
        if not element.is-noop()
          generator-translate-expression element, scope, state, false
      else
        throw Error "Unreachable state"
      let translated-nodes = []
      for element in elements
        if state.has-generator-node element
          translated-nodes.push g-expr.t-node
        else
          translated-nodes.push translate element, scope, \expression

      return {
        t-node: #-> ast.Arr pos, for t-item in translated-nodes; t-item()
        g-expr.state
        g-expr.cleanup
      }
    
    let mutable t-array-start = null
    for element, i in elements
      if t-array-start or state.has-generator-node element
        if not t-array-start?
          t-array-start := array-translate pos, elements[0 til i], scope, true, false
          state := state.add #-> ast.Assign pos, t-tmp(), t-array-start()
        if element instanceof LispyNode and element.is-internal-call(\spread)
          let expr = generator-translate-expression element.args[0], scope, state, false
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
    [ParserNodeType.Assign]: #(node, scope, state, assign-to, unassigned)
      let left = node.left
      let g-left = if left instanceof LispyNode and left.is-internal-call(\access)
        let g-parent = generator-translate-expression left.args[0], scope, state, true, unassigned
        let g-child = generator-translate-expression left.args[1], scope, g-parent.state, true, unassigned
        {
          g-child.state
          t-node: #-> ast.Access get-pos(left), g-parent.t-node(), g-child.t-node()
          cleanup: #
            g-parent.cleanup()
            g-child.cleanup()
        }
      else
        if unassigned and node.left instanceof ParserNode.Ident
          unassigned[node.left.name] := false
        {
          state
          t-node: translate node.left, scope, \left-expression
          cleanup: do-nothing
        }
      
      let g-right = generator-translate-expression node.right, scope, g-left.state, g-left.t-node, unassigned
      handle-assign assign-to, scope, g-right.state, g-right.t-node, #
        g-left.cleanup()
        g-right.cleanup()
    
    [ParserNodeType.Binary]: do
      let lazy-ops = {
        "&&": #(node, scope, state, assign-to, unassigned)
          let g-left = generator-translate-expression node.left, scope, state, assign-to or true, unassigned
          let t-node = memoize g-left.t-node
          g-left.state.goto-if get-pos(node), t-node, #-> when-true-branch, #-> post-branch
          let when-true-branch = g-left.state.branch()
          let g-right = generator-translate-expression node.right, scope, when-true-branch, t-node, unassigned
          g-right.state.goto get-pos(node), #-> post-branch
          let post-branch = g-left.state.branch()
          {
            t-node
            state: post-branch
            cleanup: #
              g-left.cleanup()
              g-right.cleanup()
          }
        "||": #(node, scope, state, assign-to, unassigned)
          let g-left = generator-translate-expression node.left, scope, state, assign-to or true, unassigned
          let t-node = memoize g-left.t-node
          g-left.state.goto-if get-pos(node), t-node, #-> post-branch, #-> when-false-branch
          let when-false-branch = g-left.state.branch()
          let g-right = generator-translate-expression node.right, scope, when-false-branch, t-node, unassigned
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
      #(node, scope, state, assign-to, unassigned)
        if lazy-ops ownskey node.op
          lazy-ops[node.op] node, scope, state, assign-to, unassigned
        else
          let g-left = generator-translate-expression node.left, scope, state, true, unassigned
          let g-right = generator-translate-expression node.right, scope, g-left.state, false, unassigned
          handle-assign assign-to, scope, g-right.state, #-> first!(
            ast.Binary get-pos(node),
              g-left.t-node()
              last!(g-left.cleanup(), node.op)
              first!(g-right.t-node(), g-right.cleanup()))
    
    [ParserNodeType.Call]: #(node, scope, mutable state, assign-to, unassigned)
      if node.func instanceof ParserNode.Ident and node.func.name == \eval
        let g-code = generator-translate-expression node.args[0], scope, state, false, unassigned
        return handle-assign assign-to, scope, g-code.state, (#-> ast.Eval get-pos(node), g-code.t-node()), g-code.cleanup
      
      let g-func = if node.func instanceof LispyNode and node.func.is-internal-call(\access)
        let g-parent = generator-translate-expression node.func.args[0], scope, state, true, unassigned
        let g-child = generator-translate-expression node.func.args[1], scope, g-parent.state, true, unassigned
        {
          t-node: #-> ast.Access get-pos(node), g-parent.t-node(), g-child.t-node()
          cleanup: #
            g-parent.cleanup()
            g-child.cleanup()
          g-child.state
        }
      else
        generator-translate-expression node.func, scope, state, true, unassigned
      let {is-apply, is-new, args} = node
      
      if is-apply and (args.length == 0 or not (args[0] instanceof LispyNode and args[0].is-internal-call(\spread)))
        let g-start = if args.length == 0
          {
            g-func.state
            t-node: #-> ast.Const get-pos(node), void
            cleanup: do-nothing
          }
        else
          generator-translate-expression args[0], scope, g-func.state, true, unassigned
        let g-args = generator-array-translate get-pos(node), args[1 to -1], scope, g-start.state, unassigned
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
        let g-args = generator-array-translate get-pos(node), args, scope, g-func.state, unassigned
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
              ast.Access get-pos(node),
                ast.Ident get-pos(node), \__new
                ast.Const get-pos(node), \apply
              [func, args]
          else if args instanceof ast.Arr
            ast.Call get-pos(node),
              func
              args.elements
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
  
  let generator-translate-expression-lispy-internals =
    access: #(node, args, scope, state, assign-to, unassigned)
      let g-parent = generator-translate-expression args[0], scope, state, true, unassigned
      let g-child = generator-translate-expression args[1], scope, g-parent.state, false, unassigned
      handle-assign assign-to, scope, g-child.state, #-> first!(
        ast.Access get-pos(node), g-parent.t-node(), g-child.t-node()
        g-parent.cleanup()
        g-child.cleanup())
    
    yield: #(node, args, scope, mutable state, assign-to, unassigned)
      let g-node = generator-translate-expression args[0], scope, state, false, unassigned
      state := g-node.state.yield get-pos(node), g-node.t-node
      handle-assign assign-to, scope, state, #-> state.builder.received-ident, g-node.cleanup
    
    if: #(node, args, scope, mutable state, assign-to, unassigned)
      let test = generator-translate-expression args[0], scope, state, state.has-generator-node(args[0]), unassigned
      state := test.state
      
      let when-false-unassigned = unassigned and {} <<< unassigned
      let ret = if state.has-generator-node(args[1]) or state.has-generator-node(args[2])
        // TODO: handle case when only one of when-true/when-false has generator nodes
        state.goto-if get-pos(node), #-> first!(test.t-node(), test.cleanup()), #-> when-true-branch, #-> when-false-branch
        let t-tmp = make-t-tmp(assign-to, scope, get-pos(node))
        let when-true-branch = state.branch()
        let g-when-true = generator-translate-expression args[1], scope, when-true-branch, t-tmp, unassigned
        g-when-true.state.goto get-pos(args[1]), #-> post-branch
        let when-false-branch = state.branch()
        let g-when-false = generator-translate-expression args[2], scope, when-false-branch, t-tmp, when-false-unassigned
        g-when-false.state.goto get-pos(args[2]), #-> post-branch
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
        let t-when-true = translate args[1], scope, \expression, unassigned
        let t-when-false = translate args[2], scope, \expression, when-false-unassigned
        handle-assign assign-to, scope, state, #-> ast.If get-pos(node),
          test.t-node()
          last!(test.cleanup(), t-when-true())
          t-when-false()
      if unassigned
        for k, v of when-false-unassigned
          if not v
            unassigned[k] := false
      ret
    
    array: #(node, args, scope, state, assign-to, unassigned)
      generator-array-translate get-pos(node), args, scope, state, assign-to, unassigned
    
    tmp-wrapper: #(node, args, scope, state, assign-to, unassigned)
      let g-node = generator-translate-expression args[0], scope, state, false, unassigned
      handle-assign assign-to, scope, g-node.state, g-node.t-node, #
        g-node.cleanup()
        for tmp in args[1 to -1]
          scope.release-tmp tmp.const-value()
    
    block: #(node, args, scope, mutable state, assign-to, unassigned)
      for subnode, i, len in args
        if i == len - 1
          return generator-translate-expression subnode, scope, state, assign-to, unassigned
        else
          state := generator-translate subnode, scope, state, null, null, unassigned
      throw Error "Unreachable state"
  
  let generator-translate-expression-lispy-operators =
    unary: #(node, args, scope, state, assign-to, unassigned)
      let g-node = generator-translate-expression args[0], scope, state, false, unassigned
      handle-assign assign-to, scope, g-node.state, #-> first!(
        ast.Unary get-pos(node),
          node.func.name
          first!(g-node.t-node(), g-node.cleanup()))
  
  let generator-translate-expression-lispy(node as LispyNode, scope as Scope, state as GeneratorState, assign-to as Boolean|->, unassigned)
    switch
    case node.is-call
      let {func, args} = node
      switch
      case func.is-symbol
        switch
        case func.is-internal
          let name = func.name
          if generator-translate-expression-lispy-internals not ownskey name
            throw Error "Unable to translate internal call for '$name'"
          generator-translate-expression-lispy-internals[name] node, args, scope, state, assign-to, unassigned
        case func.is-operator
          let name = func.operator-type
          if generator-translate-expression-lispy-operators not ownskey name
            throw Error "Unable to translate operator call for '$name'"
          generator-translate-expression-lispy-operators[name] node, args, scope, state, assign-to, unassigned
  
  let generator-translate-expression(node as ParserNode, scope as Scope, state as GeneratorState, assign-to as Boolean|->, unassigned)
    if state.has-generator-node node
      if node instanceof LispyNode
        return generator-translate-expression-lispy(node, scope, state, assign-to, unassigned)
      let key = node.type-id
      if expressions ownskey key
        expressions[key](node, scope, state, assign-to, unassigned)
      else
        throw Error "Unknown expression type: $(typeof! node)"
    else
      handle-assign assign-to, scope, state, translate node, scope, \expression, unassigned
  
  let is-expression(node)
    if node instanceof LispyNode
      if node.is-internal-call()
        generator-translate-expression-lispy-internals ownskey node.func.name
      else
        true
    else
      expressions ownskey node.type-id
  
  let statements =
    [ParserNodeType.EmbedWrite]: #(node, scope, mutable state, break-state, continue-state, unassigned)
      let g-text = if is-expression node.text
        generator-translate-expression node.text, scope, state, false, unassigned
      else
        {
          state: generator-translate node.text, scope, state, break-state, continue-state, unassigned
          t-node: #-> ast.Noop get-pos(node.text)
          cleanup: #->
        }
      
      g-text.state.add #
        ast.Call get-pos(node),
          ast.Ident get-pos(node), \write
          [
            first!(g-text.t-node(), g-text.cleanup())
            ...if node.escape
              [ast.Const get-pos(node), true]
            else
              []
          ]
  
  let generator-translate-lispy-internals =
    block: #(node, args, scope, state, break-state, continue-state, unassigned, is-top)
      for reduce subnode, i, len in args, acc = state
        generator-translate subnode, scope, acc, break-state, continue-state, unassigned, is-top
    
    break: #(node, args, scope, state, break-state)
      if args[0]
        throw Error "Not implemented: break with label in a generator"
      if not break-state?
        throw Error "break found outside of a loop or switch"
    
      state.goto get-pos(node), break-state
      state
    
    continue: #(node, args, scope, state, break-state, continue-state)
      if args[0]
        throw Error "Not implemented: continue with label in a generator"
      if not continue-state?
        throw Error "continue found outside of a loop"
    
      state.goto get-pos(node), continue-state
      state
    
    throw: #(node, args, scope, state)
      let g-node = generator-translate-expression args[0], scope, state, false
      g-node.state.add #-> ast.Throw get-pos(node), first!(g-node.t-node(), g-node.cleanup())
    
    yield: #(node, args, scope, state)
      let g-node = generator-translate-expression args[0], scope, state, false
      g-node.state.yield get-pos(node), #-> first!(
        g-node.t-node()
        g-node.cleanup())
    
    return: #(node, args, scope, mutable state, break-state, continue-state, unassigned, is-top)
      let mutated-node = args[0].mutate-last null, (#(n)
        if n instanceof LispyNode and n.is-internal-call(\return)
          n
        else
          LispyNode.InternalCall \return, n.index, n.scope, n), null, true
      if mutated-node instanceof LispyNode and mutated-node.is-internal-call(\return) and mutated-node.args[0] == args[0]
        if args[0].is-const() and args[0].is-const-value(void)
          state.return get-pos(node)
          state
        else if not args[0].is-statement()
          let g-node = generator-translate-expression args[0], scope, state, false
          state := g-node.state
          state.return get-pos(node), #-> first!(
            g-node.t-node()
            g-node.cleanup())
          state
        else
          generator-translate args[0], scope, state, break-state, continue-state, unassigned, is-top
      else
        generator-translate mutated-node, scope, state, break-state, continue-state, unassigned, is-top
    
    try-catch: #(node, args, scope, mutable state, break-state, continue-state, unassigned, is-top)
      state := state.enter-try-catch get-pos(node)
      state := generator-translate args[0], scope, state, break-state, continue-state, unassigned
      state := state.exit-try-catch get-pos(args[0]), (translate args[1], scope, \left-expression), #-> post-branch
      state := generator-translate args[2], scope, state, break-state, continue-state, unassigned
      state.goto get-pos(node), #-> post-branch
      let post-branch = state.branch()
      post-branch
    
    try-finally: #(node, args, scope, mutable state, break-state, continue-state, unassigned, is-top)
      if state.has-generator-node args[1]
        throw Error "Cannot use yield in a finally"
      
      state := state.pending-finally get-pos(node), #-> t-finally()
      state := generator-translate args[0], scope, state, break-state, continue-state, unassigned
      let t-finally = translate args[1], scope, \statement, unassigned
      state.run-pending-finally get-pos(node)
    
    for: #(node, args, scope, mutable state, , , unassigned)
      if args[0]? and args[0] not instanceof ParserNode.Nothing
        state := generator-translate args[0], scope, state, null, null, unassigned
      state.goto get-pos(node), #-> test-branch
      
      let body-unassigned = unassigned and {[UNASSIGNED_TAINT_KEY]: true} <<< unassigned
      let test-branch = state.branch()
      let g-test = generator-translate-expression args[1], scope, test-branch, state.has-generator-node(args[1]), body-unassigned
      test-branch.goto-if get-pos(args[1]), #-> first!(g-test.t-node(), g-test.cleanup()), #-> body-branch, #-> post-branch
      
      let body-branch = state.branch()
      generator-translate(args[3], scope, body-branch, #-> post-branch, #-> step-branch, body-unassigned).goto get-pos(args[3]), #-> step-branch or test-branch
      
      let mutable step-branch = null
      if args[2]? and args[2] not instanceof ParserNode.Nothing
        step-branch := state.branch()
        generator-translate(args[2], scope, step-branch, null, null, body-unassigned).goto get-pos(args[2]), #-> test-branch
      if unassigned
        for k, v of body-unassigned
          if not v
            unassigned[k] := false
      
      let post-branch = state.branch()
      post-branch
    
    for-in: #(node, args, scope, mutable state, , , unassigned)
      let t-key = translate args[0], scope, \left-expression
      if unassigned and args[0] instanceof ParserNode.Ident
        unassigned[args[0].name] := false
      let g-object = generator-translate-expression args[1], scope, state, false // TODO: check whether or not this should be cached
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
      let body-unassigned = {[UNASSIGNED_TAINT_KEY]: true} <<< unassigned
      generator-translate(args[2], scope, state, #-> post-branch, #-> step-branch, body-unassigned).goto get-pos(args[2]), #-> step-branch
      
      let step-branch = body-branch.branch()
      step-branch.add(#-> ast.Unary get-pos(node), "++", index).goto get-pos(node), #-> test-branch

      if unassigned
        for k, v of body-unassigned
          if not v
            unassigned[k] := false
      
      let post-branch = step-branch.branch()
      post-branch
    
    if: #(node, args, scope, mutable state, break-state, continue-state, unassigned)
      let test = generator-translate-expression args[0], scope, state, state.has-generator-node(args[0])
      state := test.state
      
      let when-false-unassigned = unassigned and {} <<< unassigned
      let ret = if state.has-generator-node(args[1]) or state.has-generator-node(args[2])
        state.goto-if get-pos(node), #-> first!(test.t-node(), test.cleanup()), #-> when-true-branch or post-branch, #-> when-false-branch or post-branch
        let when-true-branch = if args[1] not instanceof ParserNode.Nothing then state.branch()
        if when-true-branch
          generator-translate(args[1], scope, when-true-branch, break-state, continue-state, unassigned).goto get-pos(args[1]), #-> post-branch
        let when-false-branch = if args[2] not instanceof ParserNode.Nothing then state.branch()
        if when-false-branch
          generator-translate(args[2], scope, when-false-branch, break-state, continue-state, when-false-unassigned).goto get-pos(args[2]), #-> post-branch
        let post-branch = state.branch()
        post-branch
      else
        let t-when-true = translate args[1], scope, \statement, unassigned
        let t-when-false = translate args[2], scope, \statement, when-false-unassigned
        state.add #-> ast.If get-pos(node),
          test.t-node()
          last!(test.cleanup(), t-when-true())
          t-when-false()
      if unassigned
        for k, v of when-false-unassigned
          if not v
            unassigned[k] := false
      ret
    
    switch: #(node, args, scope, state, , continue-state, unassigned)
      let data = parse-switch(args)
      let g-topic = generator-translate-expression data.topic, scope, state, false // TODO: should this be true?
      let body-states = []
      let result-cases = []
      g-topic.state.add #-> ast.Switch get-pos(node),
        g-topic.t-node()
        for case_ in result-cases; case_()
        default-case()
      g-topic.state.add #-> ast.Break get-pos(node)
      let base-unassigned = unassigned and {} <<< unassigned
      let mutable current-unassigned = unassigned and {} <<< unassigned
      for case_, i in data.cases
        if state.has-generator-node case_.node
          throw Error "Cannot use yield in the check of a switch's case"
        let t-case-node = translate case_.node, scope, \expression, current-unassigned
        let case-branch = g-topic.state.branch()
        body-states[i] := case-branch
        let g-case-body = generator-translate case_.body, scope, case-branch, #-> post-branch, continue-state, current-unassigned
        g-case-body.goto get-pos(case_.node), if case_.fallthrough.const-value()
          #-> body-states[i + 1] or post-branch
        else
          #-> post-branch
        let t-goto = case-branch.make-goto get-pos(case_.node), #-> case-branch
        result-cases.push #-> ast.Switch.Case get-pos(case_.node), t-case-node(), ast.Block get-pos(case_.node), [
          t-goto()
          ast.Break get-pos(case_.node)
        ]
        if not case_.fallthrough.const-value() and unassigned
          for k, v of current-unassigned
            if not v
              unassigned[k] := false
          current-unassigned := {} <<< base-unassigned
      let default-case = if data.default-case not instanceof ParserNode.Nothing
        let default-branch = g-topic.state.branch()
        let g-default-body = generator-translate data.default-case, scope, default-branch, #-> post-branch, continue-state, current-unassigned
        g-default-body.goto get-pos(data.default-case), #-> post-branch
        default-branch.make-goto get-pos(data.default-case), #-> default-branch
      else
        g-topic.state.make-goto get-pos(node), #-> post-branch
      for k, v of current-unassigned
        if not v
          unassigned[k] := false
      let post-branch = state.branch()
      post-branch
    
    tmp-wrapper: #(node, args, scope, state, break-state, continue-state, unassigned, is-top)
      let result = generator-translate args[0], scope, state, break-state, continue-state, unassigned, is-top
      for tmp in args[1 to -1]
        scope.release-tmp tmp.const-value()
      result
  
  let generator-translate-lispy(node as LispyNode, scope as Scope, state as GeneratorState, break-state, continue-state, unassigned, is-top)
    if node.is-internal-call()
      let name = node.func.name
      if generator-translate-lispy-internals not ownskey name
        throw Error "Unable to translate internal call '$name'"
      generator-translate-lispy-internals[name] node, node.args, scope, state, break-state, continue-state, unassigned, is-top
    else
      throw Error("Not implemented: Unable to translate non-internal call")
  
  #(node as ParserNode, scope as Scope, state as GeneratorState, break-state, continue-state, unassigned, is-top)
    if state.has-generator-node node
      if node instanceof LispyNode
        return generator-translate-lispy(node, scope, state, break-state, continue-state, unassigned, is-top)
      let key = node.type-id
      if statements ownskey key
        let ret = statements[key](node, scope, state, break-state, continue-state, unassigned, is-top)
        if ret not instanceof GeneratorState
          throw Error "Translated non-GeneratorState from $(typeof! node): $(typeof! ret)"
        ret
      else
        let ret = generator-translate-expression node, scope, state
        ret.state.add #-> first!(
          ret.t-node()
          ret.cleanup())
    else
      state.add translate node, scope, if is-top then \top-statement else \statement, unassigned

let array-translate(pos as {}, elements, scope, replace-with-slice, allow-array-like, unassigned)
  let translated-items = []
  let mutable current = []
  translated-items.push(current)
  for element in flatten-spread-array elements
    if element instanceof LispyNode and element.is-internal-call(\spread)
      translated-items.push
        t-node: translate element.args[0], scope, \expression, unassigned
        type: element.args[0].type()
      current := []
      translated-items.push current
    else
      current.push translate element, scope, \expression, unassigned

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
  [ParserNodeType.Assign]: #(node, scope, location, unassigned)
    let op = node.op
    let t-left = translate node.left, scope, \left-expression
    let t-right = translate node.right, scope, \expression, unassigned
    if unassigned and node.left instanceof ParserNode.Ident
      if op == "=" and unassigned[node.left.name] and not unassigned[UNASSIGNED_TAINT_KEY] and node.right.is-const() and is-void! node.right.const-value()
        return #-> ast.Noop(get-pos(node))
      unassigned[node.left.name] := false
    
    #
      let left = t-left()
      let right = t-right()
      if op == "=" and location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name? and scope.has-own-variable(left) and not scope.is-variable-mutable(left)
        scope.mark-as-function left
        ast.Func(get-pos(node), left, right.params, right.variables, right.body, right.declarations)
      else
        ast.Binary(get-pos(node), left, op, right)

  [ParserNodeType.Binary]: #(node, scope, location, unassigned)
    let t-left = translate node.left, scope, \expression, unassigned
    let t-right = translate node.right, scope, \expression, unassigned
    #-> ast.Binary(get-pos(node), t-left(), node.op, t-right())

  [ParserNodeType.Call]: #(node, scope, location, unassigned)
    if node.func instanceof ParserNode.Ident
      if node.func.name == \RegExp and node.args[0].is-const() and (not node.args[1] or node.args[1].is-const())
        return if node.args[1] and node.args[1].const-value()
          # ast.Regex get-pos(node), String(node.args[0].const-value()), String(node.args[1].const-value())
        else
          # ast.Regex get-pos(node), String(node.args[0].const-value())
      else if node.func.name == \eval
        let t-code = translate node.args[0], scope, \expression, unassigned
        return #-> ast.Eval get-pos(node), t-code()
    let t-func = translate node.func, scope, \expression, unassigned
    let is-apply = node.is-apply
    let is-new = node.is-new
    let args = node.args
    if is-apply and (args.length == 0 or not (args[0] instanceof LispyNode and args[0].is-internal-call(\spread)))
      let t-start = if args.length == 0 then #-> ast.Const(get-pos(node), void) else translate(args[0], scope, \expression, unassigned)
      let t-arg-array = array-translate(get-pos(node), args[1 to -1], scope, false, true, unassigned)
      #
        let func = t-func()
        let start = t-start()
        let arg-array = t-arg-array()
        if arg-array instanceof ast.Arr
          ast.Call get-pos(node),
            ast.Access get-pos(node), func, \call
            [start, ...arg-array.elements]
        else
          ast.Call get-pos(node),
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
          ast.Call get-pos(node),
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
          ast.Call get-pos(node),
            func
            arg-array.elements
            is-new
        else if is-new
          scope.add-helper \__new
          ast.Call get-pos(node),
            ast.Access get-pos(node),
              ast.Ident get-pos(node), \__new
              ast.Const get-pos(node), \apply
            [func, arg-array]
        else if func instanceof ast.Binary and func.op == "."
          async set-parent, parent <- scope.maybe-cache func.left, Type.function
          ast.Call get-pos(node),
            ast.Access get-pos(node), set-parent, func.right, \apply
            [parent, arg-array]
        else
          ast.Call get-pos(node),
            ast.Access get-pos(node), func, \apply
            [ast.Const(get-pos(node), void), arg-array]
  
  [ParserNodeType.EmbedWrite]: #(node, scope, location, unassigned)
    let wrapped = if node.text.is-statement()
      let inner-scope = node.text.scope.clone()
      ParserNode.Call node.text.index, node.text.scope,
        ParserNode.Function node.text.index, inner-scope,
          []
          node.text.rescope(inner-scope)
          true
          true
        []
    else
      node.text
    let t-text = translate wrapped, scope, \expression, unassigned
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

  [ParserNodeType.Function]: do
    let primitive-types = {
      Boolean: \boolean
      String: \string
      Number: \number
      Function: \function
    }
    let translate-type-checks =
      [ParserNodeType.Ident]: #(node)
        if primitive-types ownskey node.name
          Type[primitive-types[node.name]]
        else
          Type.any // FIXME
      [ParserNodeType.TypeUnion]: #(node)
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
      [ParserNodeType.TypeFunction]: #(node)
        Type.function
      [ParserNodeType.TypeGeneric]: #(node)
        if node.basetype.name == \Array
          translate-type-check(node.args[0]).array()
        else if node.basetype.name == \Function
          Type.function
        else
          Type.any
      [ParserNodeType.TypeObject]: #(node)
        let type-data = {}
        
        for {key, value} in node.pairs
          if key instanceof ParserNode.Const
            type-data[key.value] := translate-type-check(value)
        
        Type.make-object type-data
    let translate-type-check(node)
      if node instanceof LispyNode
        if node.is-internal-call(\access)
          // FIXME
          return Type.any
      unless translate-type-checks ownskey node.type-id
        throw Error "Unknown type: $(String typeof! node)"

      translate-type-checks[node.type-id] node
    let translate-param-types = {
      [ParserNodeType.Param]: #(param, scope, inner)
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
      let type = param.type-id
      unless translate-param-types ownskey type
        throw Error "Unknown parameter type: $(typeof! param)"
      translate-param-types[type](param, scope, inner)

    let translate-type = do
      let translate-types =
        [ParserNodeType.Ident]: do
          let primordial-types =
            String: Type.string
            Number: Type.number
            Boolean: Type.boolean
            Function: Type.function
            Array: Type.array
          #(node, scope)
            unless primordial-types ownskey node.name
              throw Error "Not implemented: custom type $(node.name)"
            primordial-types[node.name]
        [ParserNodeType.TypeGeneric]: #(node, scope)
          let base = translate-type(node.basetype, scope)
          let args = for arg in node.args; translate-type(arg, scope)
          Type.generic(base, ...args)
        [ParserNodeType.TypeUnion]: #(node, scope)
          for reduce type in node.types, current = Type.none
            current.union(translate-type(type))
      #(node, scope)
        if node instanceof LispyNode
          if node.is-value
            switch node.value
            case null; return Type.null
            case void; return Type.undefined
            default
              throw Error "Unexpected Value type: $(String node.value)"
        unless translate-types ownskey node.type-id
          throw Error "Unknown type to translate: $(typeof! node)"
        translate-types[node.type-id](node, scope)
    
    #(node, scope, location) -> #
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
      let {mutable body, wrap} = translate-function-body(get-pos(node), node.generator, inner-scope, if node.auto-return then LispyNode.InternalCall(\return, node.body.index, node.body.scope, node.body) else node.body, unassigned)
      inner-scope.release-tmps()
      body := ast.Block get-pos(node.body), [...initializers, body]
      if inner-scope.used-this or node.bound instanceof ParserNode
        if node.bound instanceof ParserNode
          let fake-this = ast.Ident get-pos(node.body), \_this
          inner-scope.add-variable fake-this // TODO: the type for this?
          body := ast.Block get-pos(node.body),
            * ast.Assign get-pos(node.body), fake-this, translate(node.bound, scope, \expression, unassigned)()
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
      wrap ast.Func get-pos(node), null, param-idents, inner-scope.get-variables(), body, []

  [ParserNodeType.Ident]: #(node, scope, location)
      let name = node.name
      scope.add-helper name
      #
        let ident = ast.Ident get-pos(node), name
        if not scope.options.embedded or is-primordial(name) or location != \expression or scope.has-variable(ident) or scope.macros.has-helper(name)
          ident
        else
          ast.Access get-pos(node),
            ast.Ident get-pos(node), \context
            ast.Const get-pos(node), name

  [ParserNodeType.Nothing]: #(node) -> #-> ast.Noop(get-pos(node))

  [ParserNodeType.Super]: #(node, scope, location)
    // TODO: line numbers
    throw Error "Cannot have a stray super call"

  [ParserNodeType.Tmp]: #(node, scope, location)
    let ident = scope.get-tmp(get-pos(node), node.id, node.name, node.type())
    # -> ident

let translate-lispy-internal =
  access: #(node, args, scope, location, unassigned)
    let t-parent = translate args[0], scope, \expression, unassigned
    let t-child = translate args[1], scope, \expression, unassigned
    #-> ast.Access(get-pos(node), t-parent(), t-child())
  
  label: #(node, args, scope, location, unassigned)
    let t-label = translate args[0], scope, \label
    let t-node = translate args[1], scope, location, unassigned
    # t-node().with-label(t-label())
  
  block: #(node, args, scope, location, unassigned)
    let t-nodes = for subnode, i, len in args
      translate subnode, scope, location, unassigned
    # ast.Block get-pos(node), (for t-node in t-nodes; t-node())
  
  break: #(node, args, scope)
    let t-label = args[0] and translate args[0], scope, \label
    # ast.Break get-pos(node), t-label?()
  
  continue: #(node, args, scope)
    let t-label = args[0] and translate args[0], scope, \label
    # ast.Continue get-pos(node), t-label?()
  
  debugger: #(node)
    # ast.Debugger get-pos(node)
  
  throw: #(node, args, scope, location, unassigned)
    let t-node = translate args[0], scope, \expression, unassigned
    # ast.Throw get-pos(node), t-node()
  
  return: #(node, args, scope, location, unassigned)
    if location not in [\statement, \top-statement]
      throw Error "Expected Return in statement position"
    
    let mutated-node = args[0].mutate-last null, (#(n)
      if n instanceof LispyNode and n.is-internal-call(\return)
        n
      else
        LispyNode.InternalCall \return, n.index, n.scope, n), null, true
    if mutated-node instanceof LispyNode and mutated-node.is-internal-call(\return) and mutated-node.args[0] == args[0]
      let t-value = translate args[0], scope, \expression, unassigned
      if args[0].is-statement()
        t-value
      else
        # ast.Return get-pos(node), t-value()
    else
      translate mutated-node, scope, location, unassigned
  
  comment: #(node, args, scope, location, unassigned)
    let t-text = translate args[0], scope, \expression, unassigned
    # ast.Comment get-pos(node), t-text().const-value()
  
  try-catch: #(node, args, scope, location, unassigned)
    let t-try-body = translate args[0], scope, \statement, unassigned
    let inner-scope = scope.clone(false)
    let t-catch-ident = translate args[1], inner-scope, \left-expression
    let t-catch-body = translate args[2], inner-scope, \statement, unassigned
    #
      let catch-ident = t-catch-ident()
      if catch-ident instanceof ast.Ident
        inner-scope.add-variable catch-ident
        inner-scope.mark-as-param catch-ident
      let result = ast.TryCatch get-pos(node), t-try-body(), catch-ident, t-catch-body()
      scope.variables <<< inner-scope.variables
      result
  
  try-finally: #(node, args, scope, location, unassigned)
    let t-try-body = translate args[0], scope, \statement, unassigned
    let t-finally-body = translate args[1], scope, \statement, unassigned
    # ast.TryFinally get-pos(node), t-try-body(), t-finally-body()
  
  for: #(node, args, scope, location, unassigned)
    let t-init = if args[0]? then translate args[0], scope, \expression, unassigned
    // don't send along the normal unassigned array, since the loop could be repeated thus requiring reset to void.
    let body-unassigned = unassigned and {[UNASSIGNED_TAINT_KEY]: true}
    let t-test = if args[1]? then translate args[1], scope, \expression, body-unassigned
    let t-body = translate args[3], scope, \statement, body-unassigned
    let t-step = if args[2]? then translate args[2], scope, \expression, body-unassigned
    if unassigned
      unassigned <<< body-unassigned
    # -> ast.For get-pos(node),
      t-init?()
      t-test?()
      t-step?()
      t-body()
  
  for-in: #(node, args, scope, location, unassigned)
    let t-key = translate args[0], scope, \left-expression
    if unassigned and args[0] instanceof ParserNode.Ident
      unassigned[args[0].name] := false
    let t-object = translate args[1], scope, \expression, unassigned
    let body-unassigned = unassigned and {[UNASSIGNED_TAINT_KEY]: true}
    let t-body = translate args[2], scope, \statement, body-unassigned
    if unassigned
      unassigned <<< body-unassigned
    #
      let key = t-key()
      if key not instanceof ast.Ident
        throw Error("Expected an Ident for a for-in key")
      scope.add-variable key, Type.string
      ast.ForIn(get-pos(node), key, t-object(), t-body())
  
  if: #(node, args, scope, location, unassigned)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    let t-test = translate args[0], scope, \expression, unassigned
    let when-false-unassigned = unassigned and {} <<< unassigned
    let t-when-true = translate args[1], scope, inner-location, unassigned
    let t-when-false = translate args[2], scope, inner-location, when-false-unassigned
    if unassigned
      for k, v of when-false-unassigned
        if not v
          unassigned[k] := false
    # ast.If get-pos(node), t-test(), t-when-true(), t-when-false?()
  
  array: #(node, args, scope, location, unassigned)
    let t-arr = array-translate get-pos(node), args, scope, true, unassigned
    #-> t-arr()
  
  object: #(node, args, scope, location, unassigned)
    let t-keys = []
    let t-values = []
    let properties = []
    for pair in args[1 to -1]
      t-keys.push translate pair.args[0], scope, \expression, unassigned
      t-values.push translate pair.args[1], scope, \expression, unassigned
      properties.push pair.args[2]?.const-value()
    let t-prototype = if args[0] not instanceof ParserNode.Nothing then translate args[0], scope, \expression, unassigned

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
        obj
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
        result
  
  switch: #(node, args, scope, location, unassigned)
    let data = parse-switch(args)
    let t-topic = translate data.topic, scope, \expression, unassigned
    let base-unassigned = unassigned and {} <<< unassigned
    let mutable current-unassigned = unassigned and {} <<< base-unassigned
    let t-cases = for case_ in data.cases
      let new-case = {
        pos: get-pos(case_.node)
        t-node: translate case_.node, scope, \expression, current-unassigned
        t-body: translate case_.body, scope, \statement, current-unassigned
        fallthrough: case_.fallthrough.const-value()
      }
      if not new-case.fallthrough and unassigned
        for k, v of current-unassigned
          if not v
            unassigned[k] := false
        current-unassigned := {} <<< base-unassigned
      new-case
    let t-default-case = translate data.default-case, scope, \statement, current-unassigned
    for k, v of current-unassigned
      if not v
        unassigned[k] := false
    #
      ast.Switch get-pos(node),
        t-topic()
        for case_, i, len in t-cases
          let case-node = case_.t-node()
          let mutable case-body = case_.t-body()
          if not case_.fallthrough
            case-body := ast.Block case_.pos, [
              case-body
              ast.Break case-body.pos]
          ast.Switch.Case(case_.pos, case-node, case-body)
        t-default-case()
  
  custom: #(node, args, scope, location, unassigned)
    // TODO: line numbers
    throw Error "Cannot have a stray custom node '$(args[0].const-value())'"
  
  var: #(node, args, scope, location, unassigned)
    let ident = args[0]
    if unassigned and not unassigned[UNASSIGNED_TAINT_KEY] and ident instanceof ParserNode.Ident and unassigned not ownskey ident.name
      unassigned[ident.name] := true
    let t-ident = translate ident, scope, \left-expression
    #
      scope.add-variable t-ident(), Type.any, args[1] and args[1].const-value()
      ast.Noop(get-pos(node))
  
  tmp-wrapper: #(node, args, scope, location, unassigned)
    let t-result = translate args[0], scope, location, unassigned
    for tmp in args[1 to -1]
      scope.release-tmp tmp.const-value()
    t-result

let translate-lispy-operator =
  unary: #(node, args, scope, location, unassigned)
    let op-name = node.func.name
    if unassigned and op-name in ["++", "--", "++post", "--post"] and args[0] instanceof ParserNode.Ident
      unassigned[args[0].name] := false
    let t-subnode = translate args[0], scope, \expression, unassigned
    # ast.Unary get-pos(node), op-name, t-subnode()

let translate-lispy(node as LispyNode, scope as Scope, location as String, unassigned)
  switch
  case node.is-value
    # ast.Const get-pos(node), node.value
  case node.is-ident
    switch node.name
    case \arguments
      # ast.Arguments get-pos(node)
    case \this
      #
        scope.used-this := true
        if scope.bound
          ast.Ident get-pos(node), \_this
        else
          ast.This get-pos(node)
  case node.is-call
    let {func, args} = node
    switch
    case func.is-symbol
      switch
      case func.is-internal
        let name = func.name
        if translate-lispy-internal not ownskey name
          throw Error "Unable to translate internal call '$name'"
        translate-lispy-internal[name] node, args, scope, location, unassigned
      case func.is-operator
        let name = func.operator-type
        if translate-lispy-operator not ownskey name
          throw Error "Unable to translate operator call '$name'"
        translate-lispy-operator[name] node, args, scope, location, unassigned

let translate(node as Object, scope as Scope, location as String, unassigned)
  if node instanceof LispyNode
    return translate-lispy(node, scope, location, unassigned)
  unless translators ownskey node.type-id
    throw Error "Unable to translate unknown node type: $(typeof! node)"
  
  let ret = translators[node.type-id](node, scope, location, unassigned)
  unless is-function! ret
    throw Error "Translated non-function: $(typeof! ret)"
  ret

let translate-function-body(pos, is-generator, scope, body, unassigned = {})
  let mutable is-simple-generator = false
  if is-generator
    let has-generator-node = make-has-generator-node()
    is-simple-generator := not has-generator-node(body, true)
    if not is-simple-generator
      let builder = GeneratorBuilder pos, scope, has-generator-node
      generator-translate(body, scope, builder.start, null, null, unassigned, true).goto(pos, #-> builder.stop)
      let translated-body = builder.create()
      if pos.file
        translated-body.pos.file or= pos.file
      return {
        wrap: #(x) -> x
        body: translated-body
      }
  
  let translated-body = translate(body, scope, \top-statement, unassigned)()
  if pos.file
    translated-body.pos.file or= pos.file
  {
    wrap: if is-simple-generator
      scope.add-helper \__generator
      #(x)
        ast.Call pos,
          ast.Ident pos, \__generator
          [x]
    else
      #(x) -> x
    body: translated-body
  }

let make-get-pos(get-position as ->) #(node as ParserNode)
  let pos = get-position(node.index)
  make-pos(pos.line, pos.column, node.file)

let propagate-filenames(node)
  let file = node.pos.file
  if file
    node.walk #(subnode)
      subnode.pos.file or= file
      propagate-filenames(subnode)
  else
    node.walk propagate-filenames

let translate-root(mutable roots as Object, mutable scope as Scope, mutable get-position)
  if not is-array! roots
    roots := [roots]
  if not is-array! get-position
    get-position := [get-position]
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
  
  let mutable inner-scope = scope
  if scope.options.embedded
    inner-scope := scope.clone()
    for name in [\write, \context]
      let ident = ast.Ident { line: 0, column: 0 }, name
      inner-scope.add-variable ident
      inner-scope.mark-as-param ident
  
  let handle-embedded(mutable body, wrap, scope)
    if scope.options.embedded
      let comments-body = split-comments body
      body := comments-body.body
      ast.Block body.pos,
        [
          ...comments-body.comments
          ast.Return body.pos,
            wrap ast.Func body.pos,
              null
              [
                ast.Ident body.pos, \write
                ast.Ident body.pos, \context
              ]
              scope.get-variables()
              ast.Block body.pos, [
                ast.If body.pos,
                  ast.Binary body.pos, ast.Ident(body.pos, \context), "==", ast.Const(body.pos, null)
                  ast.Assign body.pos, ast.Ident(body.pos, \context), ast.Obj(body.pos)
                body
              ]
        ]
    else
      wrap body
  
  let mutable body = if roots.length == 1
    get-pos := make-get-pos get-position[0]
    if roots[0] not instanceof ParserNode.Root
      throw Error "Cannot translate non-Root object"
    
    if roots[0].is-generator
      inner-scope := inner-scope.clone(true)
    let root-pos = get-pos(roots[0])
    let ret = translate-function-body(root-pos, roots[0].is-generator, inner-scope, if scope.options.return or scope.options.eval then LispyNode.InternalCall(\return, roots[0].body.index, roots[0].body.scope, roots[0].body) else roots[0].body)
    ret.body.pos.file or= root-pos.file
    get-pos := null
    handle-embedded ret.body, ret.wrap, inner-scope
  else
    ast.Block no-pos,
      for root, i in roots
        get-pos := make-get-pos get-position[i]
        if root not instanceof ParserNode.Root
          throw Error "Cannot translate non-Root object"
        let body-scope = inner-scope.clone(root.is-generator)
        let ret = translate-function-body(get-pos(root), root.is-generator, body-scope, root.body)
        ret.body.pos.file or= root-pos.file
        let root-pos = get-pos(root)
        get-pos := null
        let {comments, body: root-body} = split-comments ret.body
        ast.Block root-pos, [
          ...comments
          ast.Call root-pos,
            ast.Access root-pos,
              ast.Func root-pos, null, [], body-scope.get-variables(), handle-embedded ret.body, ret.wrap, body-scope
              ast.Const root-pos, \call
            [ast.This root-pos]
        ]
  
  let comments-body = split-comments body
  let {comments} = comments-body
  body := comments-body.body
  
  let init = []
  if inner-scope.has-bound and inner-scope.used-this
    let fake-this = ast.Ident body.pos, \_this
    inner-scope.add-variable fake-this // TODO: type for this?
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
  
  body := propagate-filenames body
  
  if scope.options.bare
    if scope.has-helper(\GLOBAL)
      scope.add-variable ast.Ident body.pos, \GLOBAL
      bare-init.unshift ast.Assign body.pos,
        ast.Ident body.pos, \GLOBAL
        scope.macros.get-helper(\GLOBAL)
    if scope.options.undefined-name?
      scope.add-variable scope.options.undefined-name
    
    propagate-filenames ast.Root body.pos,
      ast.Block body.pos, [...comments, ...bare-init, ...init, body]
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
          ast.Block body.pos, [...init, body]
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

module.exports := #(node, macros as MacroHolder, get-position as ->|[], options = {})
  let mutable result = void
  let start-time = new Date().get-time()
  try
    let scope = Scope(options, macros, false)
    result := translate-root(node, scope, get-position)
    scope.release-tmps()
  catch e
    if callback?
      return callback e
    else
      throw e
  let end-time = new Date().get-time()
  options.progress?(\translate, end-time - start-time)
  return {
    node: result
    time: end-time - start-time
  }

module.exports.define-helper := #(macros as MacroHolder, get-position as ->, name, value, type as Type, mutable dependencies)
  let scope = Scope({}, macros, false)
  get-pos := make-get-pos get-position
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
  get-pos := null
  {
    helper
    dependencies
  }
  