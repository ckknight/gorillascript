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
        LispyNode.InternalCall \function, @index, @scope,
          LispyNode.InternalCall \array, @index, @scope
          LispyNode.InternalCall \return, @index, inner-scope,
            @rescope(inner-scope)
          LispyNode.Value @index, true
          LispyNode.Symbol.nothing @index
          LispyNode.Value @index, false
      parser.pop-scope()
      result
    else
      this
  def mutate-last(o, func, context, include-noop)
    func@(context, this) ? this
  
  @by-type-id := []
  def _to-JSON()
    return simplify-array(for arg-name in @constructor.arg-names; this[arg-name])

module.exports := Node