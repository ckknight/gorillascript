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
    for item, i in array by -1
      if not item or item instanceof NothingNode or item.length == 0
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
  def with-label(label as IdentNode|TmpNode|null)
    BlockNode @index, @scope, [this], label
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
      let result = CallNode(@index, @scope, FunctionNode(@index, @scope, [], @rescope(inner-scope), true, true), [])
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
  for arg in args by -1
    if not arg or arg instanceof NothingNode or (is-array! arg and arg.length == 0)
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
            if @is-def(node)
              let key = @left(node)
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

node-class AccessNode(parent as Node, child as Node)
  def type(o) -> @_type ?= do
    let parent-type = @parent.type(o)
    let is-string = parent-type.is-subset-of(Type.string)
    if is-string or parent-type.is-subset-of(Type.array-like)
      let child = o.macro-expand-1(@child).reduce(o)
      if child.is-const()
        let child-value = child.const-value()
        if child-value == \length
          return Type.number
        else if is-number! child-value
          return if child-value >= 0 and child-value %% 1
            if is-string
              Type.string.union(Type.undefined)
            else if parent-type.subtype
              parent-type.subtype.union(Type.undefined)
            else
              Type.any
          else
            Type.undefined
      else
        let child-type = child.type(o)
        if child-type.is-subset-of(Type.number)
          return if is-string
            Type.string.union(Type.undefined)
          else if parent-type.subtype
            parent-type.subtype.union(Type.undefined)
          else
            Type.any
    else if parent-type.is-subset-of(Type.object) and is-function! parent-type.value
      let child = o.macro-expand-1(@child).reduce(o)
      if child.is-const()
        return parent-type.value(String child.const-value())
    Type.any
  def _reduce(o)
    let mutable parent = @parent.reduce(o).do-wrap(o)
    let mutable cached-parent = null
    let replace-length-ident(node)
      if node instanceof IdentNode and node.name == CURRENT_ARRAY_LENGTH_NAME
        if parent.cacheable and not cached-parent?
          cached-parent := o.make-tmp node.index, \ref, parent.type(o)
          cached-parent.scope := node.scope
        AccessNode node.index, node.scope, cached-parent ? parent, LispyNode_Value node.index, \length
      else if node instanceof AccessNode
        let node-parent = replace-length-ident node.parent
        if node-parent != node.parent
          AccessNode(node.index, node.scope, node-parent, node.child).walk replace-length-ident
        else
          node.walk replace-length-ident
      else
        node.walk replace-length-ident
    let child = replace-length-ident @child.reduce(o).do-wrap(o)
    if cached-parent?
      return TmpWrapperNode(@index, @scope
        AccessNode(@index, @scope
          AssignNode(@index, @scope, cached-parent, "=", parent)
          child)
        [cached-parent.id])
    
    if parent.is-literal() and child.is-const()
      let c-value = child.const-value()
      if parent.is-const()
        let p-value = parent.const-value()
        if Object(p-value) haskey c-value
          let value = p-value[c-value]
          if is-null! value or value instanceof RegExp or typeof value in [\string, \number, \boolean, \undefined]
            return LispyNode_Value @index, value
      else if parent instanceof ArrayNode
        if c-value == \length
          return LispyNode_Value @index, parent.elements.length
        else if is-number! c-value
          return parent.elements[c-value] or LispyNode_Value @index, void
      else if parent instanceof ObjectNode
        for {key, value} in parent.pairs
          if key.const-value() == c-value
            return value
    if child instanceof CallNode and child.func instanceof IdentNode and child.func.name == \__range
      let [start, mutable end, step, inclusive] = child.args
      let has-step = not step.is-const() or step.const-value() != 1
      if not has-step
        if inclusive.is-const()
          if inclusive.const-value()
            end := if end.is-const() and is-number! end.const-value()
              LispyNode_Value end.index, end.const-value() + 1 or Infinity
            else
              BinaryNode end.index, end.scope,
                BinaryNode end.index, end.scope,
                  end
                  "+"
                  LispyNode_Value inclusive.index, 1
                "||"
                LispyNode_Value end.index, Infinity
        else
          let LispyNode = require('./parser-lispynodes')
          end := LispyNode.InternalCall \if, end.index, end.scope,
            inclusive
            BinaryNode end.index, end.scope,
              BinaryNode end.index, end.scope,
                end
                "+"
                LispyNode_Value inclusive.index, 1
              "||"
              LispyNode_Value end.index, Infinity
            end
      let args = [parent]
      let has-end = not end.is-const() or end.const-value() not in [void, Infinity]
      if not start.is-const() or start.const-value() != 0 or has-end or has-step
        args.push start
      if has-end or has-step
        args.push end
      if has-step
        args.push step
        if not inclusive.is-const() or inclusive.const-value()
          args.push inclusive
      (CallNode @index, @scope,
        IdentNode @index, @scope, if has-step then \__slice-step else \__slice
        args
        false
        not has-step).reduce(o)
    else if parent != @parent or child != @child
      AccessNode @index, @scope, parent, child
    else
      this
  def _is-noop(o) -> @__is-noop ?= @parent.is-noop(o) and @child.is-noop(o)
node-class AccessMultiNode(parent as Node, elements as [Node] = [])
  def type() -> Type.array
  def _reduce(o)
    let mutable parent = @parent.reduce(o)
    let mutable set-parent = parent
    let tmp-ids = []
    if parent.cacheable
      let tmp = o.make-tmp o.index-from-position(@index), \ref, parent.type(o)
      tmp.scope := @scope
      tmp-ids.push tmp.id
      set-parent := AssignNode(@index, @scope, tmp, "=", parent.do-wrap(o))
      parent := tmp
    let result = ArrayNode(@index, @scope, for element, j in @elements
      AccessNode(@index, @scope, if j == 0 then set-parent else parent, element.reduce(o)))
    if tmp-ids.length
      TmpWrapperNode(@index, @scope, result, tmp-ids)
    else
      result
node-class ArrayNode(elements as [Node] = [])
  def type() -> Type.array
  def _reduce(o)
    let elements = map @elements, #(x) -> x.reduce(o).do-wrap(o)
    if elements != @elements
      ArrayNode @index, @scope, elements
    else
      this
  def _is-noop(o) -> @__is-noop ?= for every element in @elements; element.is-noop(o)
  def is-literal() -> @_is-literal ?= for every element in @elements; element.is-literal()
  def literal-value() -> return for element in @elements; element.literal-value()
node-class AssignNode(left as Node, op as String, right as Node)
  def type = do
    let ops =
      "=": #(left, right) -> right
      "+=": #(left, right)
        if left.is-subset-of(Type.numeric) and right.is-subset-of(Type.numeric)
          Type.number
        else if left.overlaps(Type.numeric) and right.overlaps(Type.numeric)
          Type.string-or-number
        else
          Type.string
      "-=": Type.number
      "*=": Type.number
      "/=": Type.number
      "%=": Type.number
      "<<=": Type.number
      ">>=": Type.number
      ">>>=": Type.number
      "&=": Type.number
      "^=": Type.number
      "|=": Type.number
    #(o) -> @_type ?=
      let type = ops![@op]
      if not type
        Type.any
      else if is-function! type
        type @left.type(o), @right.type(o)
      else
        type
  def _reduce(o)
    let left = @left.reduce(o)
    let right = @right.reduce(o).do-wrap(o)
    if left != @left or right != @right
      AssignNode @index, @scope, left, @op, right
    else
      this
node-class BinaryNode(left as Node, op as String, right as Node)
  def type = do
    let ops =
      "*": Type.number
      "/": Type.number
      "%": Type.number
      "+": #(left, right)
        if left.is-subset-of(Type.numeric) and right.is-subset-of(Type.numeric)
          Type.number
        else if left.overlaps(Type.numeric) and right.overlaps(Type.numeric)
          Type.string-or-number
        else
          Type.string
      "-": Type.number
      "<<": Type.number
      ">>": Type.number
      ">>>": Type.number
      "<": Type.boolean
      "<=": Type.boolean
      ">": Type.boolean
      ">=": Type.boolean
      "in": Type.boolean
      "instanceof": Type.boolean
      "==": Type.boolean
      "!=": Type.boolean
      "===": Type.boolean
      "!==": Type.boolean
      "&": Type.number
      "^": Type.number
      "|": Type.number
      "&&": #(left, right) -> left.intersect(Type.potentially-falsy).union(right)
      "||": #(left, right) -> left.intersect(Type.potentially-truthy).union(right)
    #(o) -> @_type ?=
      let type = ops![@op]
      if not type
        Type.any
      else if is-function! type
        type @left.type(o), @right.type(o)
      else
        type
  def _reduce = do
    let const-ops =
      "*": (~*)
      "/": (~/)
      "%": (~%)
      "+": do
        let is-JS-numeric(x)
          is-null! x or typeof x in [\number, \boolean, \undefined]
        #(left, right)
          if is-JS-numeric(left) and is-JS-numeric(right)
            left ~+ right
          else
            left ~& right
      "-": (~-)
      "<<": (~bitlshift)
      ">>": (~bitrshift)
      ">>>": (~biturshift)
      "<": (~<)
      "<=": (~<=)
      ">": (~>)
      ">=": (~>=)
      "==": (~=)
      "!=": (!~=)
      "===": (==)
      "!==": (!=)
      "&": (~bitand)
      "^": (~bitxor)
      "|": (~bitor)
      "&&": (and)
      "||": (or)
    let left-const-nan(x, y)
      if x.const-value() is NaN
        BlockNode @index, @scope, [y, x]
    let left-const-ops =
      "*": #(x, y)
        if x.const-value() == 1
          UnaryNode @index, @scope, "+", y
        else if x.const-value() == -1
          UnaryNode @index, @scope, "-", y
        else if x.const-value() is NaN
          BlockNode @index, @scope, [y, x]
      "/": left-const-nan
      "%": left-const-nan
      "+": #(x, y, o)
        if x.const-value() == 0 and y.type(o).is-subset-of(Type.number)
          UnaryNode @index, @scope, "+", y
        else if x.const-value() == "" and y.type(o).is-subset-of(Type.string)
          y
        else if is-string! x.const-value() and y instanceof BinaryNode and y.op == "+" and y.left.is-const() and is-string! y.left.const-value()
          BinaryNode @index, @scope, LispyNode_Value(x.index, x.const-value() & y.left.const-value()), "+", y.right
        else if x.const-value() is NaN
          BlockNode @index, @scope, [y, x]
      "-": #(x, y)
        if x.const-value() == 0
          UnaryNode @index, @scope, "-", y
        else if x.const-value() is NaN
          BlockNode @index, @scope, [y, x]
      "<<": left-const-nan
      ">>": left-const-nan
      ">>>": left-const-nan
      "&": left-const-nan
      "|": left-const-nan
      "^": left-const-nan
      "&&": #(x, y) -> if x.const-value() then y else x
      "||": #(x, y) -> if x.const-value() then x else y
    let right-const-nan = #(x, y)
      if y.const-value() is NaN
        BlockNode @index, @scope, [x, y]
    let right-const-ops =
      "*": #(x, y)
        if y.const-value() == 1
          UnaryNode @index, @scope, "+", x
        else if y.const-value() == -1
          UnaryNode @index, @scope, "-", x
        else if y.const-value() is NaN
          BlockNode @index, @scope, [x, y]
      "/": #(x, y)
        if y.const-value() == 1
          UnaryNode @index, @scope, "+", x
        else if y.const-value() == -1
          UnaryNode @index, @scope, "-", x
        else if y.const-value() is NaN
          BlockNode @index, @scope, [x, y]
      "%": right-const-nan
      "+": #(x, y, o)
        if y.const-value() == 0 and x.type(o).is-subset-of(Type.number)
          UnaryNode @index, @scope, "+", x
        else if is-number! y.const-value() and y.const-value() < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @index, @scope, x, "-", LispyNode_Value(y.index, -y.const-value())
        else if y.const-value() == "" and x.type(o).is-subset-of(Type.string)
          x
        else if is-string! y.const-value() and x instanceof BinaryNode and x.op == "+" and x.right.is-const() and is-string! x.right.const-value()
          BinaryNode @index, @scope, x.left, "+", LispyNode_Value(x.right.index, x.right.const-value() & y.const-value())
        else if y.const-value() is NaN
          BlockNode @index, @scope, [x, y]
      "-": #(x, y, o)
        if y.const-value() == 0
          UnaryNode @index, @scope, "+", x
        else if is-number! y.const-value() and y.const-value() < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @index, @scope, x, "+", LispyNode_Value(y.index, -y.const-value())
        else if y.const-value() is NaN
          BlockNode @index, @scope, [x, y]
      "<<": right-const-nan
      ">>": right-const-nan
      ">>>": right-const-nan
      "&": right-const-nan
      "|": right-const-nan
      "^": right-const-nan
    let remove-unary-plus(x, y)
      let new-x = if x instanceof UnaryNode and x.op == "+" then x.node else x
      let new-y = if y instanceof UnaryNode and y.op == "+" then y.node else y
      if x != new-x or y != new-y
        BinaryNode @index, @scope, new-x, @op, new-y
    let non-const-ops =
      "*": remove-unary-plus
      "/": remove-unary-plus
      "%": remove-unary-plus
      "-": remove-unary-plus
      "<<": remove-unary-plus
      ">>": remove-unary-plus
      ">>>": remove-unary-plus
      "&": remove-unary-plus
      "^": remove-unary-plus
      "|": remove-unary-plus
      "&&": #(x, y, o)
        let x-type = x.type(o)
        if x-type.is-subset-of(Type.always-truthy)
          BlockNode @index, @scope, [x, y]
        else if x-type.is-subset-of(Type.always-falsy)
          x
        else if x instanceof BinaryNode and x.op == "&&"
          let truthy = if x.right.is-const()
            not not x.right.const-value()
          else
            let x-right-type = x.right.type(o)
            if x-right-type.is-subset-of(Type.always-truthy)
              true
            else if x-right-type.is-subset-of(Type.always-falsy)
              false
            else
              null
          if truthy == true
            BinaryNode @index, @scope, x.left, "&&", BlockNode x.right.index, @scope, [x.right, y]
          else if truthy == false
            x
      "||": #(x, y, o)
        let x-type = x.type(o)
        if x-type.is-subset-of(Type.always-truthy)
          x
        else if x-type.is-subset-of(Type.always-falsy)
          BlockNode @index, @scope, [x, y]
        else if x instanceof BinaryNode and x.op == "||"
          let truthy = if x.right.is-const()
            not not x.right.const-value()
          else
            let x-right-type = x.right.type(o)
            if x-right-type.is-subset-of(Type.always-truthy)
              true
            else if x-right-type.is-subset-of(Type.always-falsy)
              false
            else
              null
          if truthy == true
            x
          else if truthy == false
            BinaryNode @index, @scope, x.left, "||", BlockNode x.right.index, @scope, [x.right, y]
        else
          let LispyNode = require('./parser-lispynodes')
          if x instanceof LispyNode and x.is-call and x.func.is-symbol and x.func.is-internal and x.func.is-if and x.args[2].is-const() and not x.args[2].const-value()
            let mutable test = x.args[0]
            let mutable when-true = x.args[1]
            while when-true instanceof LispyNode and when-true.is-call and when-true.func.is-symbol and when-true.func.is-internal and when-true.func.is-if and when-true.args[2].is-const() and not when-true.args[2].const-value()
              test := BinaryNode x.index, x.scope, test, "&&", when-true.args[0]
              when-true := when-true.args[2]
            BinaryNode(@index, @scope
              BinaryNode x.index, x.scope, test, "&&", when-true
              "||"
              y)
    #(o)
      let left = @left.reduce(o).do-wrap(o)
      let right = @right.reduce(o).do-wrap(o)
      let op = @op
      if left.is-const()
        if right.is-const() and const-ops ownskey op
          return LispyNode_Value @index, const-ops[op](left.const-value(), right.const-value())
        return? left-const-ops![op]@(this, left, right, o)
      if right.is-const()
        return? right-const-ops![op]@(this, left, right, o)
      
      return? non-const-ops![op]@(this, left, right, o)
      
      if left != @left or right != @right
        BinaryNode @index, @scope, left, op, right
      else
        this
  def _is-noop(o) -> @__is-noop ?= @left.is-noop(o) and @right.is-noop(o)
node-class BlockNode(nodes as [Node] = [], label as IdentNode|TmpNode|null)
  def type(o) @_type ?=
    let nodes = @nodes
    if nodes.length == 0
      Type.undefined
    else
      for node in nodes[0 til -1]
        node.type(o)
      nodes[* - 1].type(o)
  def with-label(label as IdentNode|TmpNode|null, o)
    if not @label?
      if @nodes.length == 1
        return @nodes[0].with-label label, o
      else if @nodes.length > 1
        let last = @nodes[* - 1]
        if last instanceof require('./parser-lispynodes') and last.is-call and last.func.is-internal and last.func.is-for-in
          if for every node in @nodes[0 til -1]; node instanceofsome [AssignNode, VarNode]
            return BlockNode @index, @scope, @nodes[0 til -1].concat([last.with-label(label, o)])
    BlockNode @index, @scope, @nodes, label
  def _reduce(o)
    let mutable changed = false
    let body = []
    for node, i, len in @nodes
      let reduced = node.reduce(o)
      if reduced instanceof BlockNode and not reduced.label?
        body.push ...reduced.nodes
        changed := true
      else if reduced instanceof NothingNode
        changed := true
      else if reduced instanceof require('./parser-lispynodes') and reduced.is-call and reduced.func.is-goto
        body.push reduced
        if reduced != node or i < len - 1
          changed := true
        break
      else
        body.push reduced
        if reduced != node
          changed := true
    let label = if @label? then @label.reduce(o) else @label
    if body.length == 0
      NothingNode @index, @scope
    else if not label? and body.length == 1
      body[0]
    else
      if changed or label != @label
        BlockNode @index, @scope, body, label
      else
        this
  def is-statement() -> for some node in @nodes by -1; node.is-statement()
  def _is-noop(o) -> @__is-noop ?= for every node in @nodes by -1; node.is-noop(o)
  def mutate-last(o, func, context, include-noop)
    let nodes = @nodes
    let len = nodes.length
    if len == 0
      Noop(@index, @scope).mutate-last o, func, context, include-noop
    else
      let last-node = nodes[len - 1].mutate-last o, func, context, include-noop
      if last-node != nodes[len - 1]
        BlockNode @index, @scope, [...nodes[0 til -1], last-node]
      else
        this
node-class CallNode(func as Node, args as [Node] = [], is-new as Boolean, is-apply as Boolean)
  def type = do
    let PRIMORDIAL_FUNCTIONS =
      Object: Type.object
      String: Type.string
      Number: Type.number
      Boolean: Type.boolean
      Function: Type.function
      Array: Type.array
      Date: Type.string
      RegExp: Type.regexp
      Error: Type.error
      RangeError: Type.error
      ReferenceError: Type.error
      SyntaxError: Type.error
      TypeError: Type.error
      URIError: Type.error
      escape: Type.string
      unescape: Type.string
      parseInt: Type.number
      parseFloat: Type.number
      isNaN: Type.boolean
      isFinite: Type.boolean
      decodeURI: Type.string
      decodeURIComponent: Type.string
      encodeURI: Type.string
      encodeURIComponent: Type.string
    let PRIMORDIAL_SUBFUNCTIONS =
      Object:
        getPrototypeOf: Type.object
        getOwnPropertyDescriptor: Type.object
        getOwnPropertyNames: Type.string.array()
        create: Type.object
        defineProperty: Type.object
        defineProperties: Type.object
        seal: Type.object
        freeze: Type.object
        preventExtensions: Type.object
        isSealed: Type.boolean
        isFrozen: Type.boolean
        isExtensible: Type.boolean
        keys: Type.string.array()
      String:
        fromCharCode: Type.string
      Number:
        isFinite: Type.boolean
        isNaN: Type.boolean
      Array:
        isArray: Type.boolean
      Math:
        abs: Type.number
        acos: Type.number
        asin: Type.number
        atan: Type.number
        atan2: Type.number
        ceil: Type.number
        cos: Type.number
        exp: Type.number
        floor: Type.number
        log: Type.number
        max: Type.number
        min: Type.number
        pow: Type.number
        random: Type.number
        round: Type.number
        sin: Type.number
        sqrt: Type.number
        tan: Type.number
      JSON:
        stringify: Type.string.union(Type.undefined)
        parse: Type.string.union(Type.number).union(Type.boolean).union(Type.null).union(Type.array).union(Type.object)
      Date:
        UTC: Type.number
        now: Type.number
    let PRIMORDIAL_METHODS =
      String:
        toString: Type.string
        valueOf: Type.string
        charAt: Type.string
        charCodeAt: Type.number
        concat: Type.string
        indexOf: Type.number
        lastIndexOf: Type.number
        localeCompare: Type.number
        match: Type.array.union(Type.null)
        replace: Type.string
        search: Type.number
        slice: Type.string
        split: Type.string.array()
        substring: Type.string
        toLowerCase: Type.string
        toLocaleLowerCase: Type.string
        toUpperCase: Type.string
        toLocaleUpperCase: Type.string
        trim: Type.string
      Boolean:
        toString: Type.string
        valueOf: Type.boolean
      Number:
        toString: Type.string
        valueOf: Type.number
        toLocaleString: Type.string
        toFixed: Type.string
        toExponential: Type.string
        toPrecision: Type.string
      Date:
        toString: Type.string
        toDateString: Type.string
        toTimeString: Type.string
        toLocaleString: Type.string
        toLocaleDateString: Type.string
        toLocaleTimeString: Type.string
        valueOf: Type.number
        getTime: Type.number
        getFullYear: Type.number
        getUTCFullYear: Type.number
        getMonth: Type.number
        getUTCMonth: Type.number
        getDate: Type.number
        getUTCDate: Type.number
        getDay: Type.number
        getUTCDay: Type.number
        getHours: Type.number
        getUTCHours: Type.number
        getMinutes: Type.number
        getUTCMinutes: Type.number
        getSeconds: Type.number
        getUTCSeconds: Type.number
        getMilliseconds: Type.number
        getUTCMilliseconds: Type.number
        getTimezoneOffset: Type.number
        setTime: Type.number
        setMilliseconds: Type.number
        setUTCMilliseconds: Type.number
        setSeconds: Type.number
        setUTCSeconds: Type.number
        setMinutes: Type.number
        setUTCMinutes: Type.number
        setHours: Type.number
        setUTCHours: Type.number
        setDate: Type.number
        setUTCDate: Type.number
        setMonth: Type.number
        setUTCMonth: Type.number
        setFullYear: Type.number
        setUTCFullYear: Type.number
        toUTCString: Type.string
        toISOString: Type.string
        toJSON: Type.string
      RegExp:
        exec: Type.array.union(Type.null)
        test: Type.boolean
        toString: Type.string
      Error:
        toString: Type.string
    #(o) -> @_type ?= do
      let func = @func
      let mutable func-type = func.type(o)
      if func-type.is-subset-of(Type.function)
        return func-type.args[0]
      else if func instanceof IdentNode
        let {name} = func
        if PRIMORDIAL_FUNCTIONS ownskey name
          return PRIMORDIAL_FUNCTIONS[name]
        else if o?.macros.has-helper name
          func-type := o.macros.helper-type name
          if func-type.is-subset-of(Type.function)
            return func-type.args[0]
      else if func instanceof AccessNode
        let {parent, child} = func
        if child.is-const()
          if child.const-value() in [\call, \apply]
            let parent-type = parent.type(o)
            if parent-type.is-subset-of(Type.function)
              return parent-type.args[0]
          else if parent instanceof IdentNode
            return? PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.const-value()]
          // else check the type of parent, maybe figure out its methods
      Type.any
  def _reduce = do
    let EVAL_SIMPLIFIERS = {
      "true": #-> LispyNode_Value @index, true
      "false": #-> LispyNode_Value @index, false
      "void 0": #-> LispyNode_Value @index, void
      "null": #-> LispyNode_Value @index, null
    }
    let PURE_PRIMORDIAL_FUNCTIONS = {
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
      +String
      +Boolean
      +Number
      +RegExp
    }
    let PURE_PRIMORDIAL_SUBFUNCTIONS =
      String: {
        +fromCharCode
      }
      Number: {
        +isFinite
        +isNaN
      }
      Math: {
        +abs
        +acos
        +asin
        +atan
        +atan2
        +ceil
        +cos
        +exp
        +floor
        +log
        +"max"
        +"min"
        +pow
        +round
        +sin
        +sqrt
        +tan
      }
      JSON: {
        +parse
        +stringify
      }
    #(o)
      let func = @func.reduce(o).do-wrap(o)
      let args = map @args, #(node) -> node.reduce(o).do-wrap(o)
      if not @is-new and not @is-apply
        let const-args = []
        let mutable all-const = true
        for arg in args
          if arg.is-const()
            const-args.push arg.const-value()
          else
            all-const := false
            break
        if all-const
          if func instanceof IdentNode
            if func.name == \eval
              if EVAL_SIMPLIFIERS ownskey const-args[0]
                return EVAL_SIMPLIFIERS[const-args[0]]@ this
            else if PURE_PRIMORDIAL_FUNCTIONS ownskey func.name
              try
                let value = GLOBAL[func.name]@ void, ...const-args
                if is-null! value or typeof value in [\number, \string, \boolean, \undefined]
                  return LispyNode_Value @index, value
              catch e
                // TODO: do something here to alert the user
                void
          else if func instanceof AccessNode and func.child.is-const()
            let {parent, child} = func
            let c-value = child.const-value()
            if parent.is-const()
              let p-value = parent.const-value()
              if is-function! p-value[c-value]
                try
                  let value = p-value[c-value] ...const-args
                  if is-null! value or typeof value in [\number, \string, \boolean, \undefined]
                    return LispyNode_Value @index, value
                catch e
                  // TODO: do something here to alert the user
                  void
            else if parent instanceof IdentNode
              if PURE_PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.value]
                try
                  let value = GLOBAL[parent.name][c-value] ...const-args
                  if is-null! value or typeof value in [\number, \string, \boolean, \undefined]
                    return LispyNode_Value @index, value
                catch e
                  // TODO: do something here to alert the user
                  void
      if func != @func or args != @args
        CallNode @index, @scope, func, args, @is-new, @is-apply
      else
        this

node-class DefNode(left as Node, right as Node|void)
  def type(o) -> if @right? then @right.type(o) else Type.any
node-class EmbedWriteNode(text as Node, escape as Boolean)
node-class FunctionNode(params as [Node] = [], body as Node, auto-return as Boolean = true, bound as Node|Boolean = false, curry as Boolean, as-type as Node|void, generator as Boolean, generic as [IdentNode] = [])
  def type(o) -> @_type ?=
    // TODO: handle generator types
    if @as-type?
      node-to-type(@as-type).function()
    else
      let mutable return-type = if @auto-return
        @body.type(o)
      else
        Type.undefined
      let LispyNode = require('./parser-lispynodes')
      let walker(node)
        if node instanceof LispyNode and node.is-call and node.func.is-return
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
  def _to-JSON() -> [@params, @body, @auto-return, ...simplify-array [@bound, @curry, @as-type, @generator, @generic]]
node-class IdentNode(name as String)
  def cacheable = false
  def type(o)
    if @name == CURRENT_ARRAY_LENGTH_NAME
      Type.number
    else if o
      @scope.type(this)
    else
      Type.any
  def _is-noop(o) -> true
  def is-primordial() -> is-primordial(@name)
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
  def with-label(label as IdentNode|TmpNode|null, o)
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
node-class MacroConstNode(name as String)
  def type(o) -> @_type ?=
    let c = o.get-const(@name)
    if not c
      Type.any
    else
      let value = c.value
      if is-null! value
        Type.null
      else
        switch typeof value
        case \number; Type.number
        case \string; Type.string
        case \boolean; Type.boolean
        case \undefined; Type.undefined
        default
          throw Error("Unknown type for $(String c.value)")
  def _is-noop(o) -> true
  def to-const(o)
    LispyNode_Value @index, o.get-const(@name)?.value
node-class NothingNode
  def type() -> Type.undefined
  def cacheable = false
  def is-const() -> true
  def const-value() -> void
  def is-const-type(type) -> type == \undefined
  def is-const-value(value) -> value == void
  def _is-noop() -> true
  def mutate-last(o, func, context, include-noop)
    if include-noop
      func@(context, this) ? this
    else
      this
node-class ObjectNode(pairs as [{ key: Node, value: Node, property: String|void }] = [], prototype as Node|void)
  def type(o) -> @_type ?=
    let data = {}
    for {key, value} in @pairs
      if key.is-const()
        data[key.const-value()] := if value.is-const() and not value.const-value()?
          Type.any
        else
          value.type(o)
    Type.make-object data
  def walk(func, context)
    let pairs = map @pairs, #(pair)
      let key = func@ context, pair.key
      let value = func@ context, pair.value
      if key != pair.key or value != pair.value
        { key, value, property: pair.property }
      else
        pair
    let prototype = if @prototype? then func@ context, @prototype else @prototype
    if pairs != @pairs or prototype != @prototype
      ObjectNode @index, @scope, pairs, prototype
    else
      this
  def walk-async(func, context, callback)
    async! callback, pairs <- map-async @pairs, (#(pair, cb)
      async! cb, key <- func@ context, pair.key
      async! cb, value <- func@ context, pair.value
      cb null, if key != pair.key or value != pair.value
        { key, value, pair.property }
      else
        pair), null
    asyncif prototype <- next, @prototype?
      async! callback, p <- func@ context, @prototype
      next(p)
    else
      next(@prototype)
    callback null, if pairs != @pairs or prototype != @prototype
      ObjectNode @index, @scope, pairs, prototype
    else
      this
  def _reduce(o)
    let pairs = map @pairs, #(pair)
      let key = pair.key.reduce(o)
      let value = pair.value.reduce(o).do-wrap(o)
      if key != pair.key or value != pair.value
        { key, value, pair.property }
      else
        pair
    let prototype = if @prototype? then @prototype.reduce(o) else @prototype
    if pairs != @pairs or prototype != @prototype
      ObjectNode @index, @scope, pairs, prototype
    else
      this
  def _is-noop(o) -> @__is-noop ?= for every {key, value} in @pairs; key.is-noop(o) and value.is-noop(o)
  def is-literal() -> @_is-literal ?= not @prototype? and for every {key, value, property} in @pairs; not property and key.is-literal() and value.is-literal()
  def literal-value()
    if @prototype?
      throw Error "Cannot convert object with prototype to a literal"
    let result = {}
    for {key, value} in @pairs
      result[key.literal-value()] := value.literal-value()
    result
Node.object := #(index, pairs, prototype)
  let known-keys = []
  let mutable last-property-pair = null
  for {key, property} in pairs
    if key.is-const()
      let key-value = String key.const-value()
      if property in [\get, \set] and last-property-pair and last-property-pair.property != property and last-property-pair.key == key-value
        last-property-pair := null
        continue
      else if key-value in known-keys
        let {ParserError} = require('./parser')
        throw ParserError "Duplicate key $(quote key-value) in object", this, key.index
      known-keys.push key-value
      if property in [\get, \set]
        last-property-pair := {key: key-value, property}
      else
        last-property-pair := null
    else
      last-property-pair := null
  @Object index, pairs, prototype
Node.object-param := Node.object
node-class ParamNode(ident as Node, default-value as Node|void, spread as Boolean, is-mutable as Boolean, as-type as Node|void)
node-class RootNode(file as String|void, body as Node, is-embedded as Boolean, is-generator as Boolean)
  def is-statement() -> true
node-class SpreadNode(node as Node)
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      SpreadNode @index, @scope, node
    else
      this

node-class SuperNode(child as Node|void, args as [Node] = [])
  def _reduce(o)
    let child = if @child? then @child.reduce(o).do-wrap(o) else @child
    let args = map @args, #(node) -> node.reduce(o).do-wrap(o)
    if child != @child or args != @args
      SuperNode @index, @scope, child, args
    else
      this
node-class SwitchNode(node as Node, cases as [] = [], default-case as Node = NoopNode(index, scope), label as IdentNode|TmpNode|null)
  def type(o) -> @_type ?=
    for reduce case_ in @cases, type = if @default-case? then @default-case.type(o) else Type.undefined
      if case_.fallthrough
        type
      else
        type.union case_.body.type(o)
  def with-label(label as IdentNode|TmpNode|null)
    SwitchNode @index, @scope, @node, @cases, @default-case, label
  def walk(f, context)
    let node = f@ context, @node
    let cases = map @cases, #(case_)
      let case-node = f@ context, case_.node
      let case-body = f@ context, case_.body
      if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_
    let default-case = if @default-case then f@ context, @default-case else @default-case
    let label = if @label? then f@ context, @label else @label
    if node != @node or cases != @cases or default-case != @default-case or label != @label
      SwitchNode @index, @scope, node, cases, default-case, label
    else
      this
  def walk-async(f, context, callback)
    async! callback, node <- f@ context, @node
    async! callback, cases <- map-async @cases, (#(case_, cb)
      async! cb, case-node <- f@ context, case_.node
      async! cb, case-body <- f@ context, case_.body
      cb null, if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_), null
    asyncif default-case <- next, @default-case?
      async! callback, x <- f@ context, @default-case
      next(x)
    else
      next(@default-case)
    asyncif label <- next, @label?
      async! callback, x <- f@ context, @label
      next(x)
    else
      next(@label)
    callback null, if node != @node or cases != @cases or default-case != @default-case or label != @label
      SwitchNode @index, @scope, node, cases, default-case, label
    else
      this
  def is-statement() -> true
  def mutate-last(o, func, context, include-noop)
    let mutable cases-changed = false
    let cases = for case_ in @cases
      if case_.fallthrough
        case_
      else
        let body = case_.body.mutate-last o, func, context, include-noop
        if body != case_.body
          cases-changed := true
          { case_.node, body, case_.fallthrough }
        else
          case_
    let default-case = @default-case.mutate-last o, func, context, include-noop
    if cases-changed or default-case != @default-case
      SwitchNode @index, @scope, @node, cases, default-case, @label
    else
      this
node-class SyntaxChoiceNode(choices as [Node] = [])
node-class SyntaxManyNode(inner as Node, multiplier as String)
node-class SyntaxParamNode(ident as Node, as-type as Node|void)
node-class SyntaxSequenceNode(params as [Node] = [])
node-class TmpNode(id as Number, name as String, _type as Type = Type.any)
  def cacheable = false
  def type() -> @_type
  def _is-noop() -> true
  def _to-JSON()
    if @_type == Type.any or true
      [@id, @name]
    else
      [@id, @name, @_type]
node-class TmpWrapperNode(node as Node, tmps as [] = [])
  def type(o) -> @node.type(o)
  def with-label(label as IdentNode|TmpNode|null, o)
    TmpWrapperNode @index, @scope, @node.with-label(label, o), @tmps
  def _reduce(o)
    let node = @node.reduce(o)
    if @tmps.length == 0
      node
    else if @node != node
      TmpWrapperNode @index, @scope, node, @tmps
    else
      this
  def is-statement() -> @node.is-statement()
  def _is-noop(o) -> @node.is-noop(o)
  def do-wrap(o)
    let node = @node.do-wrap(o)
    if node != @node
      TmpWrapperNode @index, @scope, node, @tmps
    else
      this
  def mutate-last(o, func, context, include-noop)
    let node = @node.mutate-last o, func, context, include-noop
    if node != @node
      TmpWrapperNode @index, @scope, node, @tmps
    else
      this
node-class TypeFunctionNode(return-type as Node)
node-class TypeGenericNode(basetype as Node, args as [Node] = [])
node-class TypeObjectNode(pairs as [])
  def _reduce(o)
    let pairs = map @pairs, #(pair)
      let key = pair.key.reduce(o)
      let value = pair.value.reduce(o)
      if key != pair.key or value != pair.value
        { key, value }
      else
        pair
    if pairs != @pairs
      TypeObjectNode @index, @scope, pairs
    else
      this
node-class TypeUnionNode(types as [Node] = [])
node-class UnaryNode(op as String, node as Node)
  def type = do
    let ops =
      "-": Type.number
      "+": Type.number
      "--": Type.number
      "++": Type.number
      "--post": Type.number
      "++post": Type.number
      "!": Type.boolean
      "~": Type.number
      typeof: Type.string
      delete: Type.boolean
    # -> ops![@op] or Type.any
  def _reduce = do
    let const-ops =
      "-": #(x) -> ~-x
      "+": #(x) -> ~+x
      "!": (not)
      "~": (~bitnot)
      typeof: (typeof)
    let nonconst-ops =
      "+": #(node, o)
        if node.type(o).is-subset-of Type.number
          node
      "-": #(node)
        if node instanceof UnaryNode
          if node.op in ["-", "+"]
            UnaryNode @index, @scope, if node.op == "-" then "+" else "-", node.node
        else if node instanceof BinaryNode
          if node.op in ["-", "+"]
            BinaryNode @index, @scope, UnaryNode(node.left.index, node.left.scope, "-", node.left), if node.op == "-" then "+" else "-", node.right
          else if node.op in ["*", "/"]
            BinaryNode @index, @scope, UnaryNode(node.left.index, node.left.scope, "-", node.left), node.op, node.right
      "!": do
        let invertible-binary-ops =
          "<": ">="
          "<=": ">"
          ">": "<="
          ">=": "<"
          "==": "!="
          "!=": "=="
          "===": "!=="
          "!==": "==="
          "&&": #(x, y) -> BinaryNode @index, @scope, UnaryNode(x.index, x.scope, "!", x), "||", UnaryNode(y.index, y.scope, "!", y)
          "||": #(x, y) -> BinaryNode @index, @scope, UnaryNode(x.index, x.scope, "!", x), "&&", UnaryNode(y.index, y.scope, "!", y)
        #(node, o)
          if node instanceof UnaryNode
            if node.op == "!" and node.node.type(o).is-subset-of(Type.boolean)
              node.node
          else if node instanceof BinaryNode
            if invertible-binary-ops ownskey node.op
              let invert = invertible-binary-ops[node.op]
              if is-function! invert
                invert@ this, node.left, node.right
              else
                BinaryNode @index, @scope, node.left, invert, node.right
      typeof: do
        let object-type = Type.null.union(Type.object).union(Type.array-like).union(Type.regexp).union(Type.date).union(Type.error)
        #(node, o)
          if node.is-noop(o)
            let type = node.type(o)
            if type.is-subset-of(Type.number)
              LispyNode_Value @index, \number
            else if type.is-subset-of(Type.string)
              LispyNode_Value @index, \string
            else if type.is-subset-of(Type.boolean)
              LispyNode_Value @index, \boolean
            else if type.is-subset-of(Type.undefined)
              LispyNode_Value @index, \undefined
            else if type.is-subset-of(Type.function)
              LispyNode_Value @index, \function
            else if type.is-subset-of(object-type)
              LispyNode_Value @index, \object
    #(o)
      let node = @node.reduce(o).do-wrap(o)
      let op = @op
      if node.is-const() and const-ops ownskey op
        return LispyNode_Value @index, const-ops[op](node.const-value())
      
      let result = nonconst-ops![op]@ this, node, o
      if result?
        return result.reduce(o)
      
      if node != @node
        UnaryNode @index, @scope, op, node
      else
        this
  def _is-noop(o) -> @__is-noop ?= @op not in ["++", "--", "++post", "--post", "delete"] and @node.is-noop(o)
node-class VarNode(ident as IdentNode|TmpNode, is-mutable as Boolean)
  def type() -> Type.undefined
  def _reduce(o)
    let ident = @ident.reduce(o)
    if ident != @ident
      VarNode @index, @scope, ident, @is-mutable
    else
      this

module.exports := Node