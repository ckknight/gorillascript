import 'shared.gs'

require! Type: './types'
let {node-to-type, map, map-async} = require './parser-utils'
let {quote, is-primordial} = require './utils'
let inspect = require('util')?.inspect

let LispyNode_Value(index, value)
  require('./parser-lispynodes').Value(index, value)

let simplify-array(mutable array as [])
  if array.length == 0
    array
  else
    array := array.slice()
    let LispyNode = require('./parser-lispynodes')
    for item, i in array by -1
      if not item or (item instanceof LispyNode and item.is-symbol and item.is-internal and item.is-nothing) or item.length == 0
        array.pop()
      else
        break
    array

class Node
  def constructor() -> throw Error "Node should not be instantiated directly"
  
  def type() -> Type.any
  def walk(f, context) -> this
  def walk-async(f, context, callback) -> callback(null, this)
  def cacheable = true
  def with-label(label)
    if not label
      this
    else
      let LispyNode = require('./parser-lispynodes')
      LispyNode.InternalCall \label, @index, @scope,
        label
        this
  def _reduce(parser)
    @walk #(node) -> node.reduce(parser)
  def reduce(parser)
    if @_reduced?
      @_reduced
    else
      let reduced = @_reduce(parser)
      if reduced == this
        @_reduced := this
      else
        @_reduced := reduced.reduce(parser)
  def is-const() -> false
  def const-value() -> throw Error("Not a const: $(typeof! this)")
  def is-const-type() -> false
  def is-const-value() -> false
  def is-literal() -> @is-const()
  def literal-value() -> @const-value()
  def is-noop(o) -> @reduce(o)._is-noop(o)
  def _is-noop(o) -> false
  def is-statement() -> false
  def rescope(new-scope)
    if not @scope or @scope == new-scope
      return this
    let old-scope = @scope
    @scope := new-scope
    let walker(node)
      let node-scope = node.scope
      if not node-scope or node-scope == new-scope
        node
      else if node-scope == old-scope
        node.rescope new-scope
      else
        let parent = node-scope.parent
        if parent == old-scope
          node-scope.reparent(new-scope)
        node.walk walker
    @walk walker
  def do-wrap(parser)
    if @is-statement()
      let inner-scope = parser.push-scope(true, @scope)
      let LispyNode = require('./parser-lispynodes')
      let result = LispyNode.Call @index, @scope,
        FunctionNode(@index, @scope, [], @rescope(inner-scope), true, true)
      parser.pop-scope()
      result
    else
      this
  def mutate-last(o, func, context, include-noop)
    func@(context, this) ? this
  
  @by-type-id := []
  def _to-JSON()
    return simplify-array(for arg-name in @constructor.arg-names; this[arg-name])

let inspect-helper(depth, name, index, ...args)
  let d = if depth? then depth - 1 else null
  let mutable found = false
  let LispyNode = require('./parser-lispynodes')
  for arg in args by -1
    if not arg or (arg instanceof LispyNode and arg.is-symbol and arg.is-internal and arg.is-nothing) or (is-array! arg and arg.length == 0)
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

macro node-class
  syntax ident as Identifier, args as ("(", head as Parameter, tail as (",", this as Parameter)*, ")")?, body as Body?
    
    let params =
      * @param AST index, null, null, null, AST Number
      * @param AST scope, null, null, null
    let full-name = @name(ident)
    if full-name.slice(-4) != "Node"
      throw Error "node-class's name must end in 'Node', got $(full-name)"
    let capped-name = full-name.slice(0, -4)
    let lower-name = capped-name.char-at(0).to-lower-case() & capped-name.substring(1)
    let type = @ident(full-name)
    let mutable ctor-body = AST
      @index := index
      @scope := scope
      @_reduced := void
      @_macro-expanded := void
      @_macro-expand-alled := void
    let inspect-parts = []
    let mutable arg-names = []
    if args
      args := [args.head, ...args.tail]
    else
      args := []
    for arg, i in args
      params.push arg
      let ident = @param-ident arg
      let key = @const(@name(ident))
      ctor-body := AST
        $ctor-body
        @[$key] := $ident
      arg-names.push key
      inspect-parts.push ASTE @[$key]
    
    let find-def(name)@
      if body
        let FOUND = {}
        let find-walk(node)@
          @walk node, #(node)@
            if @is-custom(node) and @name(node) == \def
              let key = @custom-data(node)[0]
              if @is-const(key) and @value(key) == name
                throw FOUND
        try
          find-walk(body)
        catch e == FOUND
          return true
      false
    
    let is-node-type(arg)@
      let param-type = @param-type(arg) or arg
      if @is-ident(param-type) and @name(param-type).slice(-4) == \Node
        true
      else if @is-type-union(param-type)
        for every type in @types(param-type)
          is-node-type(type)
    let has-node-type(arg)@
      @is-type-union(@param-type(arg)) and for some type in @types(@param-type(arg)); is-node-type(type)
    let is-node-array-type(arg)@
      @is-type-array(@param-type(arg)) and @is-ident(@subtype(@param-type(arg))) and @name(@subtype(@param-type(arg))) == \Node
    
    let add-methods = []
    if not find-def \inspect
      add-methods.push AST def inspect(depth) -> inspect-helper depth, $full-name, @index, ...$(@array inspect-parts)
    if args.length and not find-def \walk
      let walk-init = []
      let mutable walk-check = AST false
      let mutable walk-args = []
      for arg in args
        let ident = @param-ident arg
        let key = @name(ident)
        if is-node-type(arg)
          walk-init.push AST let $ident = f@ context, this[$key]
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else if has-node-type(arg)
          walk-init.push AST let $ident = if this[$key] instanceof Node then f@ context, this[$key] else this[$key]
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else if is-node-array-type(arg)
          walk-init.push AST let $ident = map this[$key], f, context
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else
          walk-args.push AST this[$key]
      walk-args := @array walk-args
      let walk-func = @func [@param(ASTE f), @param(ASTE context)], AST
        $walk-init
        if $walk-check
          $type @index, @scope, ...$walk-args
        else
          this
      add-methods.push AST def walk = mutate-function! $walk-func
    if args.length and not find-def \walk-async
      let mutable walk-check = AST false
      let mutable walk-args = []
      for arg in args
        let ident = @param-ident arg
        let key = @name(ident)
        if is-node-type(arg) or has-node-type(arg) or is-node-array-type(arg)
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else
          walk-args.push AST this[$key]
          
      walk-args := @array walk-args
      let walk-async-body = for reduce arg in args by -1, current = (AST
          callback null, if $walk-check
            $type @index, @scope, ...$walk-args
          else
            this)
        let ident = @param-ident arg
        let key = @name(ident)
        if is-node-type(arg)
          AST
            async! callback, $ident <- f@ context, this[$key]
            $current
        else if has-node-type(arg)
          AST
            asyncif $ident <- next, this[$key] instanceof Node
              async! callback, $ident <- f@ context, this[$key]
              next($ident)
            else
              next(this[$key])
            $current
        else if is-node-array-type(arg)
          AST
            async! callback, $ident <- map-async this[$key], f, context
            $current
        else
          current
      let walk-async-func = @func [@param(AST f), @param(AST context), @param(AST callback)], walk-async-body
      add-methods.push AST def walk-async = mutate-function! $walk-async-func
    
    let func = @func params, AST $ctor-body, false, true
    arg-names := @array arg-names
    let type-id = ASTE ParserNodeType[$capped-name]
    AST Node[$capped-name] := Node.by-type-id[$type-id] := class $type extends Node
      def constructor = mutate-function! $func
      def type-id = $type-id
      @arg-names := $arg-names
      $body
      $add-methods

node-class FunctionNode(params as [Node] = [], body as Node, auto-return as Boolean = true, bound as Node|Boolean = false, curry as Boolean, as-type as Node|void, generator as Boolean)
  def type(o) -> @_type ?=
    // TODO: handle generator types
    if @as-type?
      node-to-type(@as-type).function()
    else if @generator
      Type.generator
    else
      let mutable return-type = if @auto-return
        @body.type(o)
      else
        Type.undefined
      let LispyNode = require('./parser-lispynodes')
      let walker(node)
        if node instanceof LispyNode and node.is-internal-call(\return)
          return-type := return-type.union node.args[0].type(o)
          node
        else if node instanceof FunctionNode
          node
        else if node instanceof MacroAccessNode
          if node.data.macro-name in [\return, "return?"] // FIXME: so ungodly hackish
            if node.data.macro-data.node
              return-type := return-type.union node.data.macro-data.node.type(o)
            else
              return-type := return-type.union Type.undefined
          node.walk walker
        else
          node.walk walker
      walker @body
      return-type.function()
  def _is-noop(o) -> true
  def _to-JSON() -> [@params, @body, @auto-return, ...simplify-array [@bound, @curry, @as-type, @generator]]
node-class MacroAccessNode(id as Number, call-line as Number, data as Object, in-statement as Boolean, in-generator as Boolean, in-evil-ast as Boolean, do-wrapped as Boolean)
  def type(o) -> @_type ?=
    let type = o.macros.get-type-by-id(@id)
    if type?
      if is-string! type
        @data[type].type(o)
      else
        type
    else
      o.macro-expand-1(this).type(o)
  def with-label(label, o)
    o.macro-expand-1(this).with-label label, o
  def walk = do
    let walk-object(obj, func, context)
      let result = {}
      let mutable changed = false
      for k, v of obj
        let new-v = walk-item v, func, context
        if new-v != v
          changed := true
        result[k] := new-v
      if changed
        result
      else
        obj
    let walk-item(item, func, context)
      if item instanceof Node
        func@ context, item
      else if is-array! item
        map item, #(x) -> walk-item x, func, context
      else if is-object! item
        walk-object item, func, context
      else
        item
    #(func, context)
      let data = walk-item(@data, func, context)
      if data != @data
        MacroAccessNode @index, @scope, @id, @call-line, data, @in-statement, @in-generator, @in-evil-ast, @do-wrapped
      else
        this
  def walk-async = do
    let walk-object(obj, func, context, callback)
      let mutable changed = false
      let result = {}
      asyncfor err <- next, k, v of obj
        async! next, new-item <- walk-item item, func, context
        if item != new-item
          changed := true
        result[k] := new-item
        next null
      if err?
        callback err
      else
        callback null, if changed
          result
        else
          obj
    let walk-item(item, func, context, callback)
      if item instanceof Node
        func item, context, callback
      else if is-array! item
        map-async item, (#(x, cb) -> walk-item x, func, context, cb), null, callback
      else if is-object! item
        walk-object item, func, context, callback
      else
        callback null, item
    #(func, context, callback)
      async! callback, data <- walk-item @data, func, context
      callback null, if data != @data
        MacroAccessNode @index, @scope, @id, @call-line, data, @in-statement, @in-generator, @in-evil-ast, @do-wrapped
      else
        this
  def _is-noop(o) -> o.macro-expand-1(this).is-noop(o)
  def do-wrap()
    if @do-wrapped
      this
    else
      MacroAccessNode @index, @scope, @id, @call-line, @data, @in-statement, @in-generator, @in-evil-ast, true
  def mutate-last(o, func, context, include-noop)
    o.macro-expand-1(this).mutate-last(o, func, context, include-noop)

module.exports := Node