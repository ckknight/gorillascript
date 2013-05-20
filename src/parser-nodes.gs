require! Type: './types'
let {node-to-type, map, map-async} = require './parser-utils'
let {quote} = require './utils'
let inspect = require('util')?.inspect

let CURRENT_ARRAY_LENGTH_NAME = \__current-array-length

let map(array, func, arg)
  let result = []
  let mutable changed = false
  for item in array
    let new-item = func item, arg
    result.push new-item
    if item != new-item
      changed := true
  if changed
    result
  else
    array

class Node
  def constructor() -> throw Error "Node should not be instantiated directly"
  
  def type() -> Type.any
  def walk(f) -> this
  def walk-async(f, callback) -> callback(null, this)
  def cacheable = true
  def with-label(label as IdentNode|TmpNode|null)
    BlockNode @line, @column, @scope, [this], label
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
    if @scope == new-scope
      return this
    let old-scope = @scope
    @scope := new-scope
    let walker(node)
      let node-scope = node.scope
      if node-scope == new-scope
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
      let result = CallNode(@line, @column, @scope, FunctionNode(@line, @column, @scope, [], @rescope(inner-scope), true, true), [])
      parser.pop-scope()
      result
    else
      this

let inspect-helper(depth, name, line, column, ...args)
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
      * @param AST line, null, null, null, AST Number
      * @param AST column, null, null, null, AST Number
      * @param AST scope, null, null, null
    let full-name = @name(ident)
    if full-name.slice(-4) != "Node"
      throw Error "node-class's name must end in 'Node', got $(full-name)"
    let capped-name = full-name.slice(0, -4)
    let lower-name = capped-name.char-at(0).to-lower-case() & capped-name.substring(1)
    let type = @ident(full-name)
    let mutable ctor-body = AST
      @line := line
      @column := column
      if not scope or scope.constructor.name != \Scope
        throw TypeError "Expected scope to be a Scope, got $(typeof! scope)"
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
      add-methods.push AST def inspect(depth) -> inspect-helper depth, $full-name, @line, @column, ...$(@array inspect-parts)
    if args.length and not find-def \walk
      let walk-init = []
      let mutable walk-check = AST false
      let mutable walk-args = []
      for arg in args
        let ident = @param-ident arg
        let key = @name(ident)
        if is-node-type(arg)
          walk-init.push AST let $ident = f this[$key]
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else if has-node-type(arg)
          walk-init.push AST let $ident = if this[$key] instanceof Node then f this[$key] else this[$key]
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else if is-node-array-type(arg)
          walk-init.push AST let $ident = map this[$key], f
          walk-check := AST $walk-check or $ident != this[$key]
          walk-args.push ident
        else
          walk-args.push AST this[$key]
      walk-args := @array walk-args
      let walk-func = @func [@param(AST f)], AST
        $walk-init
        if $walk-check
          $type @line, @column, @scope, ...$walk-args
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
            $type @line, @column, @scope, ...$walk-args
          else
            this)
        let ident = @param-ident arg
        let key = @name(ident)
        if is-node-type(arg)
          AST
            async! callback, $ident <- f this[$key]
            $current
        else if has-node-type(arg)
          AST
            asyncif $ident <- next, this[$key] instanceof Node
              async! callback, $ident <- f this[$key]
              next($ident)
            else
              next(this[$key])
            $current
        else if is-node-array-type(arg)
          AST
            async! callback, $ident <- map-async this[$key], f
            $current
        else
          current
      let walk-async-func = @func [@param(AST f), @param(AST callback)], walk-async-body
      add-methods.push AST def walk-async = mutate-function! $walk-async-func
    
    let func = @func params, AST $ctor-body, false, true
    arg-names := @array arg-names
    AST Node[$capped-name] := class $type extends Node
      def constructor = mutate-function! $func
      @capped-name := $capped-name
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
          cached-parent := o.make-tmp o.index-from-position(node.line, node.column), \ref, parent.type(o)
          cached-parent.scope := node.scope
        AccessNode node.line, node.column, node.scope, cached-parent ? parent, ConstNode node.line, node.column, node.scope, \length
      else if node instanceof AccessNode
        let node-parent = replace-length-ident node.parent
        if node-parent != node.parent
          AccessNode(node.line, node.column, node.scope, node-parent, node.child).walk replace-length-ident
        else
          node.walk replace-length-ident
      else
        node.walk replace-length-ident
    let child = replace-length-ident @child.reduce(o).do-wrap(o)
    if cached-parent?
      return TmpWrapperNode(@line, @column, @scope
        AccessNode(@line, @column, @scope
          AssignNode(@line, @column, @scope, cached-parent, "=", parent)
          child)
        [cached-parent.id])
    
    if parent.is-const() and child.is-const()
      let p-value = parent.const-value()
      let c-value = child.const-value()
      if Object(p-value) haskey c-value
        let value = p-value[c-value]
        if is-null! value or value instanceof RegExp or typeof value in [\string, \number, \boolean, \undefined]
          return ConstNode @line, @column, @scope, value
    if child instanceof CallNode and child.func instanceof IdentNode and child.func.name == \__range
      let [start, mutable end, step, inclusive] = child.args
      let has-step = not step.is-const() or step.const-value() != 1
      if not has-step
        if inclusive.is-const()
          if inclusive.const-value()
            end := if end.is-const() and is-number! end.const-value()
              ConstNode end.line, end.column, end.scope, end.const-value() + 1 or Infinity
            else
              BinaryNode end.line, end.column, end.scope,
                BinaryNode end.line, end.column, end.scope,
                  end
                  "+"
                  ConstNode inclusive.line, inclusive.column, inclusive.scope, 1
                "||"
                ConstNode end.line, end.column, end.scope, Infinity
        else
          end := IfNode end.line, end.column, end.scope,
            inclusive
            BinaryNode end.line, end.column, end.scope,
              BinaryNode end.line, end.column, end.scope,
                end
                "+"
                ConstNode inclusive.line, inclusive.column, inclusive.scope, 1
              "||"
              ConstNode end.line, end.column, end.scope, Infinity
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
      (CallNode @line, @column, @scope,
        IdentNode @line, @column, @scope, if has-step then \__slice-step else \__slice
        args
        false
        not has-step).reduce(o)
    else if parent != @parent or child != @child
      AccessNode @line, @column, @scope, parent, child
    else
      this
  def _is-noop(o) -> @__is-noop ?= @parent.is-noop(o) and @child.is-noop(o)
node-class AccessMultiNode(parent as Node, elements as [Node])
  def type() -> Type.array
  def _reduce(o)
    let mutable parent = @parent.reduce(o)
    let mutable set-parent = parent
    let tmp-ids = []
    if parent.cacheable
      let tmp = o.make-tmp o.index-from-position(@line, @column), \ref, parent.type(o)
      tmp.scope := @scope
      tmp-ids.push tmp.id
      set-parent := AssignNode(@line, @column, @scope, tmp, "=", parent.do-wrap(o))
      parent := tmp
    let result = ArrayNode(@line, @column, @scope, for element, j in @elements
      AccessNode(@line, @column, @scope, if j == 0 then set-parent else parent, element.reduce(o)))
    if tmp-ids.length
      TmpWrapperNode(@line, @column, @scope, result, tmp-ids)
    else
      result
node-class ArgsNode
  def type() -> Type.args
  def cacheable = false
  def _is-noop() -> true
node-class ArrayNode(elements as [Node])
  def type() -> Type.array
  def _reduce(o)
    let elements = map @elements, #(x) -> x.reduce(o).do-wrap(o)
    if elements != @elements
      ArrayNode @line, @column, @scope, elements
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
    #(o) -> @_type ?= do
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
      AssignNode @line, @column, @scope, left, @op, right
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
    #(o) -> @_type ?= do
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
        BlockNode @line, @column, @scope, [y, x]
    let left-const-ops =
      "*": #(x, y)
        if x.const-value() == 1
          UnaryNode @line, @column, @scope, "+", y
        else if x.const-value() == -1
          UnaryNode @line, @column, @scope, "-", y
        else if x.const-value() is NaN
          BlockNode @line, @column, @scope, [y, x]
      "/": left-const-nan
      "%": left-const-nan
      "+": #(x, y, o)
        if x.const-value() == 0 and y.type(o).is-subset-of(Type.number)
          UnaryNode @line, @column, @scope, "+", y
        else if x.const-value() == "" and y.type(o).is-subset-of(Type.string)
          y
        else if is-string! x.const-value() and y instanceof BinaryNode and y.op == "+" and y.left.is-const() and is-string! y.left.const-value()
          BinaryNode @line, @column, @scope, ConstNode(x.line, x.column, @scope, x.const-value() & y.left.const-value()), "+", y.right
        else if x.const-value() is NaN
          BlockNode @line, @column, @scope, [y, x]
      "-": #(x, y)
        if x.const-value() == 0
          UnaryNode @line, @column, @scope, "-", y
        else if x.const-value() is NaN
          BlockNode @line, @column, @scope, [y, x]
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
        BlockNode @line, @column, @scope, [x, y]
    let right-const-ops =
      "*": #(x, y)
        if y.const-value() == 1
          UnaryNode @line, @column, @scope, "+", x
        else if y.const-value() == -1
          UnaryNode @line, @column, @scope, "-", x
        else if y.const-value() is NaN
          BlockNode @line, @column, @scope, [x, y]
      "/": #(x, y)
        if y.const-value() == 1
          UnaryNode @line, @column, @scope, "+", x
        else if y.const-value() == -1
          UnaryNode @line, @column, @scope, "-", x
        else if y.const-value() is NaN
          BlockNode @line, @column, @scope, [x, y]
      "%": right-const-nan
      "+": #(x, y, o)
        if y.const-value() == 0 and x.type(o).is-subset-of(Type.number)
          UnaryNode @line, @column, @scope, "+", x
        else if is-number! y.const-value() and y.const-value() < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @line, @column, @scope, x, "-", ConstNode(y.line, y.column, @scope, -y.const-value())
        else if y.const-value() == "" and x.type(o).is-subset-of(Type.string)
          x
        else if is-string! y.const-value() and x instanceof BinaryNode and x.op == "+" and x.right.is-const() and is-string! x.right.const-value()
          BinaryNode @line, @column, @scope, x.left, "+", ConstNode(x.right.line, x.right.column, @scope, x.right.const-value() & y.const-value())
        else if y.const-value() is NaN
          BlockNode @line, @column, @scope, [x, y]
      "-": #(x, y, o)
        if y.const-value() == 0
          UnaryNode @line, @column, @scope, "+", x
        else if is-number! y.const-value() and y.const-value() < 0 and x.type(o).is-subset-of(Type.number)
          BinaryNode @line, @column, @scope, x, "+", ConstNode(y.line, y.column, @scope, -y.const-value())
        else if y.const-value() is NaN
          BlockNode @line, @column, @scope, [x, y]
      "<<": right-const-nan
      ">>": right-const-nan
      ">>>": right-const-nan
      "&": right-const-nan
      "|": right-const-nan
      "^": right-const-nan
    let non-const-ops =
      "&&": #(x, y, o)
        let x-type = x.type(o)
        if x-type.is-subset-of(Type.always-truthy)
          BlockNode @line, @column, @scope, [x, y]
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
            BinaryNode @line, @column, @scope, x.left, "&&", BlockNode x.right.line, x.right.column, @scope, [x.right, y]
          else if truthy == false
            x
      "||": #(x, y, o)
        let x-type = x.type(o)
        if x-type.is-subset-of(Type.always-truthy)
          x
        else if x-type.is-subset-of(Type.always-falsy)
          BlockNode @line, @column, @scope, [x, y]
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
            BinaryNode @line, @column, @scope, x.left, "||", BlockNode x.right.line, x.right.column, @scope, [x.right, y]
        else if x instanceof IfNode and x.when-false.is-const() and not x.when-false.const-value()
          let mutable test = x.test
          let mutable when-true = x.when-true
          while when-true instanceof IfNode and when-true.when-false.is-const() and not when-true.when-false.const-value()
            test := BinaryNode x.line, x.column, x.scope, test, "&&", when-true.test
            when-true := when-true.when-true
          BinaryNode(@line, @column, @scope
            BinaryNode x.line, x.column, x.scope, test, "&&", when-true
            "||"
            y)
    #(o)
      let left = @left.reduce(o).do-wrap(o)
      let right = @right.reduce(o).do-wrap(o)
      let op = @op
      if left.is-const()
        if right.is-const() and const-ops ownskey op
          return ConstNode @line, @column, @scope, const-ops[op](left.const-value(), right.const-value())
        return? left-const-ops![op]@(this, left, right, o)
      if right.is-const()
        return? right-const-ops![op]@(this, left, right, o)
      
      return? non-const-ops![op]@(this, left, right, o)
      
      if left != @left or right != @right
        BinaryNode @line, @column, @scope, left, op, right
      else
        this
  def _is-noop(o) -> @__is-noop ?= @left.is-noop(o) and @right.is-noop(o)
node-class BlockNode(nodes as [Node], label as IdentNode|TmpNode|null)
  def type(o)
    let nodes = @nodes
    if nodes.length == 0
      Type.undefined
    else
      nodes[* - 1].type(o)
  def with-label(label as IdentNode|TmpNode|null, o)
    if not @label?
      if @nodes.length == 1
        return @nodes[0].with-label label, o
      else if @nodes.length > 1 and @nodes[* - 1] instanceof ForInNode
        if for every node in @nodes[0 til -1]; node instanceofsome [AssignNode, VarNode]
          return BlockNode @line, @column, @scope, @nodes[0 til -1].concat([@nodes[* - 1].with-label(label, o)])
    BlockNode @line, @column, @scope, @nodes, label
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
      else if reduced instanceofsome [BreakNode, ContinueNode, ThrowNode, ReturnNode]
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
      NothingNode @line, @column, @scope
    else if not label? and body.length == 1
      body[0]
    else
      if changed or label != @label
        BlockNode @line, @column, @scope, body, label
      else
        this
  def is-statement() -> for some node in @nodes by -1; node.is-statement()
  def _is-noop(o) -> @__is-noop ?= for every node in @nodes by -1; node.is-noop(o)
node-class BreakNode(label as IdentNode|TmpNode|null)
  def type() -> Type.undefined
  def is-statement() -> true
  def with-label(label as IdentNode|TmpNode|null)
    BreakNode @line, @column, @scope, label
node-class CallNode(func as Node, args as [Node], is-new as Boolean, is-apply as Boolean)
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
        if child instanceof ConstNode
          if child.value in [\call, \apply]
            let parent-type = parent.type(o)
            if parent-type.is-subset-of(Type.function)
              return parent-type.args[0]
          else if parent instanceof IdentNode
            return? PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.value]
          // else check the type of parent, maybe figure out its methods
      Type.any
  def _reduce = do
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
            if PURE_PRIMORDIAL_FUNCTIONS ownskey func.name
              try
                let value = GLOBAL[func.name]@ void, ...const-args
                return ConstNode @line, @column, @scope, value
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
                  return ConstNode @line, @column, @scope, value
                catch e
                  // TODO: do something here to alert the user
                  void
            else if parent instanceof IdentNode
              if PURE_PRIMORDIAL_SUBFUNCTIONS![parent.name]![child.value]
                try
                  let value = GLOBAL[parent.name][c-value] ...const-args
                  return ConstNode @line, @column, @scope, value
                catch e
                  // TODO: do something here to alert the user
                  void
      if func != @func or args != @args
        CallNode @line, @column, @scope, func, args, @is-new, @is-apply
      else
        this
node-class CommentNode(text as String)
  def type() -> Type.undefined
  def cacheable = false
  def is-count() -> true
  def const-value() -> void
  def _is-noop() -> true
node-class ConstNode(value as Number|String|Boolean|void|null)
  def type()
    let value = @value
    if is-null! value
      Type.null
    else
      switch typeof value
      case \number; Type.number
      case \string; Type.string
      case \boolean; Type.boolean
      case \undefined; Type.undefined
      default
        throw Error("Unknown type for $(String value)")
  def cacheable = false
  def is-const() -> true
  def const-value() -> @value
  def is-const-type(type) -> type == typeof @value
  def is-const-value(value) -> value == @value
  def _is-noop() -> true
  def inspect(depth) -> "ConstNode($(inspect @value, null, if depth? then depth - 1 else null))"
node-class ContinueNode(label as IdentNode|TmpNode|null)
  def type() -> Type.undefined
  def is-statement() -> true
  def with-label(label as IdentNode|TmpNode|null)
    ContinueNode @line, @column, @scope, label
node-class DebuggerNode
  def type() -> Type.undefined
  def is-statement() -> true
node-class DefNode(left as Node, right as Node|void)
  def type(o) -> if @right? then @right.type(o) else Type.any
node-class EmbedWriteNode(text as Node, escape as Boolean)
node-class EvalNode(code as Node)
node-class ForNode(init as Node = NothingNode(0, 0, scope), test as Node = ConstNode(0, 0, scope, true), step as Node = NothingNode(0, 0, scope), body as Node, label as IdentNode|TmpNode|null)
  def type() -> Type.undefined
  def is-statement() -> true
  def with-label(label as IdentNode|TmpNode|null)
    ForNode @line, @column, @scope, @init, @test, @step, @body, label
node-class ForInNode(key as Node, object as Node, body as Node, label as IdentNode|TmpNode|null)
  def type() -> Type.undefined
  def is-statement() -> true
  def with-label(label as IdentNode|TmpNode|null)
    ForInNode @line, @column, @scope, @key, @object, @body, label
node-class FunctionNode(params as [Node], body as Node, auto-return as Boolean = true, bound as Node|Boolean = false, curry as Boolean, as-type as Node|void, generator as Boolean, generic as [IdentNode] = [])
  def type(o) -> @_type ?= do
    // TODO: handle generator types
    if @as-type?
      node-to-type(@as-type).function()
    else
      let mutable return-type = if @auto-return
        @body.type(o)
      else
        Type.undefined
      let walker(node)
        if node instanceof ReturnNode
          return-type := return-type.union node.type(o)
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
node-class IfNode(test as Node, when-true as Node, when-false as Node = NothingNode(0, 0, scope), label as IdentNode|TmpNode|null)
  def type(o) -> @_type ?= @when-true.type(o).union(@when-false.type(o))
  def with-label(label as IdentNode|TmpNode|null)
    IfNode @line, @column, @scope, @test, @when-true, @when-false, label
  def _reduce(o)
    let test = @test.reduce(o)
    let when-true = @when-true.reduce(o)
    let when-false = @when-false.reduce(o)
    let label = if @label? then @label.reduce(o) else @label
    if test.is-const()
      BlockNode(@line, @column, @scope,
        [if test.const-value()
          when-true
        else
          when-false]
        label).reduce(o)
    else
      let test-type = test.type(o)
      if test-type.is-subset-of(Type.always-truthy)
        BlockNode(@line, @column, @scope, [test, when-true], label).reduce(o)
      else if test-type.is-subset-of(Type.always-falsy)
        BlockNode(@line, @column, @scope, [test, when-false], label).reduce(o)
      else if test != @test or when-true != @when-true or when-false != @when-false or label != @label
        IfNode(@line, @column, @scope, test, when-true, when-false, label)
      else
        this
  def is-statement() -> @_is-statement ?= @when-true.is-statement() or @when-false.is-statement()
  def do-wrap(o)
    let when-true = @when-true.do-wrap(o)
    let when-false = @when-false.do-wrap(o)
    if when-true != @when-true or when-false != @when-false
      IfNode @line, @column, @scope, @test, when-true, when-false, @label
    else
      this
  def _is-noop(o) -> @__is-noop ?= @test.is-noop(o) and @when-true.is-noop(o) and @when-false.is-noop(o)
node-class MacroAccessNode(id as Number, call-line as Number, data as Object, position as String, in-generator as Boolean, in-evil-ast as Boolean)
  def type(o) -> @_type ?= do
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
    let walk-object(obj, func)
      let result = {}
      let mutable changed = false
      for k, v of obj
        let new-v = walk-item v, func
        if new-v != v
          changed := true
        result[k] := new-v
      if changed
        result
      else
        obj
    let walk-item(item, func)
      if item instanceof Node
        func item
      else if is-array! item
        map item, #(x) -> walk-item x, func
      else if is-object! item
        walk-object item, func
      else
        item
    #(func)
      let data = walk-item(@data, func)
      if data != @data
        MacroAccessNode @line, @column, @scope, @id, @call-line, data, @position, @in-generator, @in-evil-ast
      else
        this
  def walk-async = do
    let walk-object(obj, func, callback)
      let mutable changed = false
      let result = {}
      asyncfor err <- next, k, v of obj
        async! next, new-item <- walk-item item, func
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
    let walk-item(item, func, callback)
      if item instanceof Node
        func item, callback
      else if is-array! item
        map-async item, (#(x, cb) -> walk-item x, func, cb), callback
      else if is-object! item
        walk-object item, func, callback
      else
        callback null, item
    #(func, callback)
      async! callback, data <- walk-item @data, func
      callback null, if data != @data
        MacroAccessNode @line, @column, @scope, @id, @call-line, data, @position, @in-generator, @in-evil-ast
      else
        this
  def _is-noop(o) -> o.macro-expand-1(this).is-noop(o)
node-class NothingNode
  def type() -> Type.undefined
  def cacheable = false
  def is-const() -> true
  def const-value() -> void
  def is-const-type(type) -> type == \undefined
  def is-const-value(value) -> value == void
  def _is-noop() -> true
node-class ObjectNode(pairs as [{ key: Node, value: Node, property: String|void }], prototype as Node|void)
  def type(o) -> @_type ?= do
    let data = {}
    for {key, value} in @pairs
      if key.is-const()
        data[key.const-value()] := value.type(o)
    Type.make-object data
  def walk = do
    let walk-pair(pair, func)
      let key = func pair.key
      let value = func pair.value
      if key != pair.key or value != pair.value
        { key, value, property: pair.property }
      else
        pair
    #(func)
      let pairs = map @pairs, walk-pair, func
      let prototype = if @prototype? then func @prototype else @prototype
      if pairs != @pairs or prototype != @prototype
        ObjectNode @line, @column, @scope, pairs, prototype
      else
        this
  def walk-async = do
    let walk-pair(pair, func, callback)
      async! callback, key <- func pair.key
      async! callback, value <- func pair.value
      callback null, if key != pair.key or value != pair.value
        { key, value, pair.property }
      else
        pair
    #(func, callback)
      async! callback, pairs <- map-async @pairs, walk-pair, func
      asyncif prototype <- next, @prototype?
        async! callback, p <- func @prototype
        next(p)
      else
        next(@prototype)
      callback null, if pairs != @pairs or prototype != @prototype
        ObjectNode @line, @column, @scope, pairs, prototype
      else
        this
  def _reduce = do
    let reduce-pair(pair, o)
      let key = pair.key.reduce(o)
      let value = pair.value.reduce(o).do-wrap(o)
      if key != pair.key or value != pair.value
        { key, value, pair.property }
      else
        pair
    #(o)
      let pairs = map @pairs, reduce-pair, o
      let prototype = if @prototype? then @prototype.reduce(o) else @prototype
      if pairs != @pairs or prototype != @prototype
        ObjectNode @line, @column, @scope, pairs, prototype
      else
        this
  def _is-noop(o) -> @__is-noop ?= for every {key, value} in @pairs; key.is-noop(o) and value.is-noop(o)
  def is-literal() -> @_is-literal ?= not @prototype? and for every {key, value} in @pairs; key.is-literal() and value.is-literal()
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
    if key instanceof ConstNode
      let key-value = String key.value
      if property in [\get, \set] and last-property-pair and last-property-pair.property != property and last-property-pair.key == key-value
        last-property-pair := null
        continue
      else if key-value in known-keys
        let {ParserError} = require('./parser')
        throw ParserError "Duplicate key $(quote key-value) in object", this, @index-from-position(key.line, key.column)
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
node-class RegexpNode(source as Node, flags as String)
  def type() -> Type.regexp
  def _is-noop(o) -> @text.is-noop(o)
  def _reduce(o)
    let source = @source.reduce(o).do-wrap(o)
    if not source.is-const()
      CallNode @line, @column, @scope, IdentNode(@line, @column, @scope, "RegExp"), [
        source
        ConstNode @line, @column, @scope, @flags
      ]
    else if source != @source
      RegexpNode @line, @column, @scope, source, @flags
    else
      this
node-class ReturnNode(node as Node = ConstNode(line, column, scope, void))
  def type(o) -> @node.type(o)
  def is-statement() -> true
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      ReturnNode @line, @column, @scope, node
    else
      this
node-class RootNode(file as String|void, body as Node, is-embedded as Boolean, is-generator as Boolean)
  def is-statement() -> true
node-class SpreadNode(node as Node)
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      SpreadNode @line, @column, @scope, node
    else
      this
Node.string := #(index, mutable parts as [Node])
  let concat-op = @get-macro-by-label(\string-concat)
  if not concat-op
    throw Error "Cannot use string interpolation until the string-concat operator has been defined"
  if parts.length == 0
    @Const index, ""
  else if parts.length == 1
    concat-op.func {
      left: @Const index, ""
      op: ""
      right: parts[0]
    }, this, index, @get-line(index)
  else
    for reduce part in parts[1 to -1], current = parts[0]
      concat-op.func {
        left: current
        op: ""
        right: part
      }, this, index, @get-line(index)

node-class SuperNode(child as Node|void, args as [Node])
  def _reduce(o)
    let child = if @child? then @child.reduce(o).do-wrap(o) else @child
    let args = map @args, #(node, o) -> node.reduce(o).do-wrap(o), o
    if child != @child or args != @args
      SuperNode @line, @column, @scope, child, args
    else
      this
node-class SwitchNode(node as Node, cases as [], default-case as Node|void, label as IdentNode|TmpNode|null)
  def type(o) -> @_type ?= do
    for reduce case_ in @cases, type = if @default-case? then @default-case.type(o) else Type.undefined
      if case_.fallthrough
        type
      else
        type.union case_.body.type(o)
  def with-label(label as IdentNode|TmpNode|null)
    SwitchNode @line, @column, @scope, @node, @cases, @default-case, label
  def walk(f)
    let node = f @node
    let cases = map @cases, #(case_)
      let case-node = f case_.node
      let case-body = f case_.body
      if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_
    let default-case = if @default-case then f @default-case else @default-case
    let label = if @label? then f @label else @label
    if node != @node or cases != @cases or default-case != @default-case or label != @label
      SwitchNode @line, @column, @scope, node, cases, default-case, label
    else
      this
  def walk-async(f, callback)
    async! callback, node <- f @node
    async! callback, cases <- map-async @cases, #(case_, cb)
      async! cb, case-node <- f case_.node
      async! cb, case-body <- f case_.body
      cb null, if case-node != case_.node or case-body != case_.body
        { node: case-node, body: case-body, case_.fallthrough }
      else
        case_
    asyncif default-case <- next, @default-case?
      async! callback, x <- f @default-case
      next(x)
    else
      next(@default-case)
    asyncif label <- next, @label?
      async! callback, x <- f @label
      next(x)
    else
      next(@label)
    callback null, if node != @node or cases != @cases or default-case != @default-case or label != @label
      SwitchNode @line, @column, @scope, node, cases, default-case, label
    else
      this
  def is-statement() -> true
node-class SyntaxChoiceNode(choices as [Node])
node-class SyntaxManyNode(inner as Node, multiplier as String)
node-class SyntaxParamNode(ident as Node, as-type as Node|void)
node-class SyntaxSequenceNode(params as [Node])
node-class ThisNode
  def cacheable = false
  def _is-noop() -> true
node-class ThrowNode(node as Node)
  def type() -> Type.none
  def is-statement() -> true
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      ThrowNode @line, @column, @scope, node
    else
      this
node-class TmpNode(id as Number, name as String, _type as Type = Type.any)
  def cacheable = false
  def type() -> @_type
  def _is-noop() -> true
node-class TmpWrapperNode(node as Node, tmps as [])
  def type(o) -> @node.type(o)
  def with-label(label as IdentNode|TmpNode|null, o)
    TmpWrapperNode @line, @column, @scope, @node.with-label(label, o), @tmps
  def _reduce(o)
    let node = @node.reduce(o)
    if @tmps.length == 0
      node
    else if @node != node
      TmpWrapperNode @line, @column, @scope, node, @tmps
    else
      this
  def is-statement() -> @node.is-statement()
  def _is-noop(o) -> @node.is-noop(o)
node-class TryCatchNode(try-body as Node, catch-ident as Node, catch-body as Node, label as IdentNode|TmpNode|null)
  def type(o) -> @_type ?= @try-body.type(o).union(@catch-body.type(o))
  def is-statement() -> true
  def _is-noop(o) -> @try-body.is-noop(o)
  def with-label(label as IdentNode|TmpNode|null)
    TryCatchNode @line, @column, @scope, @try-body, @catch-ident, @catch-body, label
node-class TryFinallyNode(try-body as Node, finally-body as Node, label as IdentNode|TmpNode|null)
  def type(o) -> @try-body.type(o)
  def _reduce(o)
    let try-body = @try-body.reduce(o)
    let finally-body = @finally-body.reduce(o)
    let label = if @label? then @label.reduce(o) else @label
    if finally-body instanceof NothingNode
      BlockNode(@line, @column, @scope-if [try-body], label).reduce(o)
    else if try-body instanceof NothingNode
      BlockNode(@line, @column, @scope-if [finally-body], label).reduce(o)
    else if try-body != @try-body or finally-body != @finally-body or label != @label
      TryFinallyNode @line, @column, @scope, try-body, finally-body, label
    else
      this
  def is-statement() -> true
  def _is-noop(o) -> @__is-noop ?= @try-body.is-noop(o) and @finally-body.is-noop()
  def with-label(label as IdentNode|TmpNode|null)
    TryFinallyNode @line, @column, @scope, @try-body, @finally-body, label
node-class TypeFunctionNode(return-type as Node)
node-class TypeGenericNode(basetype as Node, args as [Node])
node-class TypeObjectNode(pairs as [])
  let reduce-pair(pair, o)
    let key = pair.key.reduce(o)
    let value = pair.value.reduce(o)
    if key != pair.key or value != pair.value
      { key, value }
    else
      pair
  def _reduce(o)
    let pairs = map @pairs, reduce-pair, o
    if pairs != @pairs
      TypeObjectNode @line, @column, @scope, pairs
    else
      this
node-class TypeUnionNode(types as [Node])
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
            UnaryNode @line, @column, @scope, if node.op == "-" then "+" else "-", node.node
        else if node instanceof BinaryNode
          if node.op in ["-", "+"]
            BinaryNode @line, @column, @scope, node.left, if node.op == "-" then "+" else "-", node.right
          else if node.op in ["*", "/"]
            BinaryNode @line, @column, @scope, UnaryNode(node.left.line, node.left.column, node.left.scope, "-", node.left), node.op, node.right
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
          "&&": #(x, y) -> BinaryNode @line, @column, @scope, UnaryNode(x.line, x.column, x.scope, "!", x), "||", UnaryNode(y.line, y.column, y.scope, "!", y)
          "||": #(x, y) -> BinaryNode @line, @column, @scope, UnaryNode(x.line, x.column, x.scope, "!", x), "&&", UnaryNode(y.line, y.column, y.scope, "!", y)
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
                BinaryNode @line, @column, @scope, node.left, invert, node.right
      typeof: do
        let object-type = Type.null.union(Type.object).union(Type.array-like).union(Type.regexp).union(Type.date).union(Type.error)
        #(node, o)
          if node.is-noop(o)
            let type = node.type(o)
            if type.is-subset-of(Type.number)
              ConstNode @line, @column, @scope, \number
            else if type.is-subset-of(Type.string)
              ConstNode @line, @column, @scope, \string
            else if type.is-subset-of(Type.boolean)
              ConstNode @line, @column, @scope, \boolean
            else if type.is-subset-of(Type.undefined)
              ConstNode @line, @column, @scope, \undefined
            else if type.is-subset-of(Type.function)
              ConstNode @line, @column, @scope, \function
            else if type.is-subset-of(object-type)
              ConstNode @line, @column, @scope, \object
    #(o)
      let node = @node.reduce(o).do-wrap(o)
      let op = @op
      if node.is-const() and const-ops ownskey op
        return ConstNode @line, @column, @scope, const-ops[op](node.const-value())
      
      let result = nonconst-ops![op]@ this, node, o
      if result?
        return result.reduce(o)
      
      if node != @node
        UnaryNode @line, @column, @scope, op, node
      else
        this
  def _is-noop(o) -> @__is-noop ?= @op not in ["++", "--", "++post", "--post", "delete"] and @node.is-noop(o)
node-class VarNode(ident as IdentNode|TmpNode, is-mutable as Boolean)
  def type() -> Type.undefined
  def _reduce(o)
    let ident = @ident.reduce(o)
    if ident != @ident
      VarNode @line, @column, @scope, ident, @is-mutable
    else
      this
node-class YieldNode(node as Node)
  def type() -> Type.any
  def _reduce(o)
    let node = @node.reduce(o).do-wrap(o)
    if node != @node
      YieldNode @line, @column, @scope, node
    else
      this

module.exports := Node