require! Node: './parser-nodes'
require! Type: './types'
require! Scope: './parser-scope'
let {node-to-type, add-param-to-scope, map} = require './parser-utils'

let AccessNode = Node.Access
let AccessMultiNode = Node.AccessMulti
let ArgsNode = Node.Args
let ArrayNode = Node.Array
let AssignNode = Node.Assign
let BinaryNode = Node.Binary
let BlockNode = Node.Block
let BreakNode = Node.Break
let CallNode = Node.Call
let CommentNode = Node.Comment
let ConstNode = Node.Const
let ContinueNode = Node.Continue
let DebuggerNode = Node.Debugger
let DefNode = Node.Def
let EmbedWriteNode = Node.EmbedWrite
let EvalNode = Node.Eval
let ForNode = Node.For
let ForInNode = Node.ForIn
let FunctionNode = Node.Function
let IdentNode = Node.Ident
let IfNode = Node.If
let MacroAccessNode = Node.MacroAccess
let NothingNode = Node.Nothing
let ObjectNode = Node.Object
let ParamNode = Node.Param
let RegexpNode = Node.Regexp
let ReturnNode = Node.Return
let RootNode = Node.Root
let SpreadNode = Node.Spread
let SuperNode = Node.Super
let SwitchNode = Node.Switch
let SyntaxChoiceNode = Node.SyntaxChoice
let SyntaxManyNode = Node.SyntaxMany
let SyntaxParamNode = Node.SyntaxParam
let SyntaxSequenceNode = Node.SyntaxSequence
let ThisNode = Node.This
let ThrowNode = Node.Throw
let TmpNode = Node.Tmp
let TmpWrapperNode = Node.TmpWrapper
let TryCatchNode = Node.TryCatch
let TryFinallyNode = Node.TryFinally
let TypeFunctionNode = Node.TypeFunction
let TypeGenericNode = Node.TypeGeneric
let TypeObjectNode = Node.TypeObject
let TypeUnionNode = Node.TypeUnion
let UnaryNode = Node.Unary
let VarNode = Node.Var
let YieldNode = Node.Yield

let identity(x) -> x
let ret-this() -> this


class MacroContext
  def constructor(@parser/* as Parser*/, @index, @position, @in-generator, @in-evil-ast)
    @unsaved-tmps := []
    @saved-tmps := []
  
  def do-wrap(node)
    if node instanceof Node
      node.do-wrap(@parser)
    else
      node
  
  def error(message as String, node as Node|null)
    throw @parser.build-error message, node or @index
  
  def scope() -> @parser.scope.peek()
  
  def let(ident as TmpNode|IdentNode, is-mutable as Boolean, mutable type as Type = Type.any)
    if ident instanceof IdentNode and is-mutable and type.is-subset-of(Type.undefined-or-null)
      type := Type.any
    @scope().add(ident, is-mutable, type)
  
  def has-variable(ident as TmpNode|IdentNode)
    @scope().has(ident)
  
  def is-variable-mutable(ident as TmpNode|IdentNode)
    @scope().is-mutable(ident)
  
  def var(ident as IdentNode|TmpNode, is-mutable as Boolean) -> @parser.Var @index, ident, is-mutable
  def def(key as Node = NothingNode(0, 0, @scope()), value as Node|void) -> @parser.Def @index, key, @do-wrap(value)
  def noop() -> @parser.Nothing @index
  def block(nodes as [Node], label as IdentNode|TmpNode|null) -> @parser.Block(@index, nodes, label).reduce(@parser)
  def if(test as Node = NothingNode(0, 0, @scope()), when-true as Node = NothingNode(0, 0, @scope()), when-false as Node|null, label as IdentNode|TmpNode|null) -> @parser.If(@index, @do-wrap(test), when-true, when-false, label).reduce(@parser)
  def switch(node as Node = NothingNode(0, 0, @scope()), cases as [], default-case as Node|null, label as IdentNode|TmpNode|null) -> @parser.Switch(@index, @do-wrap(node), (for case_ in cases; {node: @do-wrap(case_.node), case_.body, case_.fallthrough}), default-case, label).reduce(@parser)
  def for(init as Node|null, test as Node|null, step as Node|null, body as Node = NothingNode(0, 0, @scope()), label as IdentNode|TmpNode|null) -> @parser.For(@index, @do-wrap(init), @do-wrap(test), @do-wrap(step), body, label).reduce(@parser)
  def for-in(key as IdentNode, object as Node = NothingNode(0, 0), body as Node = NothingNode(0, 0, @scope()), label as IdentNode|TmpNode|null) -> @parser.ForIn(@index, key, @do-wrap(object), body, label).reduce(@parser)
  def try-catch(try-body as Node = NothingNode(0, 0, @scope()), catch-ident as Node = NothingNode(0, 0, @scope()), catch-body as Node = NothingNode(0, 0, @scope()), label as IdentNode|TmpNode|null) -> @parser.TryCatch(@index, try-body, catch-ident, catch-body, label).reduce(@parser)
  def try-finally(try-body as Node = NothingNode(0, 0, @scope()), finally-body as Node = NothingNode(0, 0, @scope()), label as IdentNode|TmpNode|null) -> @parser.TryFinally(@index, try-body, finally-body, label).reduce(@parser)
  def assign(left as Node = NothingNode(0, 0, @scope()), op as String, right as Node = NothingNode(0, 0, @scope())) -> @parser.Assign(@index, left, op, @do-wrap(right)).reduce(@parser)
  def binary(left as Node = NothingNode(0, 0, @scope()), op as String, right as Node = NothingNode(0, 0, @scope())) -> @parser.Binary(@index, @do-wrap(left), op, @do-wrap(right)).reduce(@parser)
  def binary-chain(op as String, nodes as [Node])
    if nodes.length == 0
      throw Error "Expected nodes to at least have a length of 1"
    let result = for reduce right in nodes[1 to -1], left = @do-wrap(nodes[0])
      @parser.Binary(@index, left, op, @do-wrap(right))
    result.reduce(@parser)
  def unary(op as String, node as Node = NothingNode(0, 0, @scope())) -> @parser.Unary(@index, op, @do-wrap(node)).reduce(@parser)
  def throw(node as Node = NothingNode(0, 0, @scope())) -> @parser.Throw(@index, @do-wrap(node)).reduce(@parser)
  def return(node as Node|void) -> @parser.Return(@index, @do-wrap(node)).reduce(@parser)
  def yield(node as Node = NothingNode(0, 0, @scope())) -> @parser.Yield(@index, @do-wrap(node)).reduce(@parser)
  def debugger() -> @parser.Debugger(@index)
  def break(label as IdentNode|TmpNode|null) -> @parser.Break(@index, label)
  def continue(label as IdentNode|TmpNode|null) -> @parser.Continue(@index, label)
  def spread(node as Node) -> @parser.Spread(@index, node)
  
  def real(mutable node)
    node := @macro-expand-1(node)
    if node instanceof TmpWrapperNode
      node.node
    else
      node
  
  def rewrap(new-node, mutable old-node)
    old-node := @macro-expand-1(old-node)
    if old-node instanceof TmpWrapperNode
      if new-node instanceof TmpWrapperNode
        TmpWrapperNode new-node.line, new-node.column, new-node.scope, new-node, old-node.tmps.concat(new-node.tmps)
      else
        TmpWrapperNode new-node.line, new-node.column, new-node.scope, new-node, old-node.tmps.slice()
    else
      new-node
  
  def eq(mutable alpha, mutable bravo)
    alpha := @real alpha
    bravo := @real bravo
    if alpha instanceof ConstNode
      bravo instanceof ConstNode and alpha.value == bravo.value
    else if alpha instanceof IdentNode
      bravo instanceof IdentNode and alpha.name == bravo.name
    else
      false
  
  def is-labeled-block(mutable node)
    node := @real(node)
    if node instanceofsome [BlockNode, IfNode, SwitchNode, ForNode, ForInNode, TryCatchNode, TryFinallyNode]
      node.label?
    else
      false
  
  def is-break(node) -> @real(node) instanceof BreakNode
  def is-continue(node) -> @real(node) instanceof ContinueNode
  def label(mutable node)
    node := @real(node)
    if node instanceofsome [BreakNode, ContinueNode, BlockNode, IfNode, SwitchNode, ForNode, ForInNode, TryCatchNode, TryFinallyNode]
      node.label
    else
      null
  def with-label(node, label as IdentNode|TmpNode|null)
    node.with-label label, @parser
  
  def macro-expand-1(node)
    if node instanceof Node
      let expanded = @parser.macro-expand-1(node)
      if expanded instanceof Node
        expanded.reduce(@parser)
      else
        expanded
    else
      node
  
  def macro-expand-all(node)
    if node instanceof Node
      let expanded = @parser.macro-expand-all(node)
      if expanded instanceof Node
        expanded.reduce(@parser)
      else
        expanded
    else
      node
  
  def tmp(name as String = \ref, save as Boolean, mutable type)
    if not type?
      type := Type.any
    else if is-string! type
      if Type![type] not instanceof Type
        throw Error "$type is not a known type name"
      type := Type![type]
    else if type not instanceof Type
      throw Error "Must provide a Type or a string for type, got $(typeof! type)"
      
    let tmp = @parser.make-tmp @index, name, type
    (if save then @saved-tmps else @unsaved-tmps).push tmp.id
    tmp
  
  def get-tmps()
    unsaved: @unsaved-tmps.slice()
    saved: @saved-tmps.slice()
  
  def is-const(node) -> is-void! node or (node instanceof Node and @real(node).is-const())
  def value(node)
    if is-void! node
      void
    else if node instanceof Node
      let expanded = @real(node)
      if expanded.is-const()
        expanded.const-value()
  def const(value)
    @parser.Const @index, value
  
  def is-spread(node) -> @real(node) instanceof SpreadNode
  def spread-subnode(mutable node)
    node := @real(node)
    if node instanceof SpreadNode
      node.node
  
  def is-node(node) -> node instanceof Node
  def is-ident(node) -> @real(node) instanceof IdentNode
  def is-tmp(node) -> @real(node) instanceof TmpNode
  def is-ident-or-tmp(node) -> @real(node) instanceofsome [IdentNode, TmpNode]
  def name(mutable node)
    node := @real(node)
    if @is-ident node
      node.name
  def ident(name as String)
    // TODO: don't assume JS
    if require('./jsutils').is-acceptable-ident(name, true)
      @parser.Ident @index, name
  
  def is-call(node) -> @real(node) instanceof CallNode
  
  def call-func(mutable node)
    node := @real(node)
    if node instanceof CallNode
      node.func
  
  def call-args(mutable node)
    node := @real(node)
    if node instanceof CallNode
      node.args
  
  def is-super(node) -> @real(node) instanceof SuperNode
  
  def super-child(mutable node)
    node := @real(node)
    if @is-super(node)
      node.child
  
  def super-args(mutable node)
    node := @real(node)
    if @is-super(node)
      node.args
  
  def call-is-new(mutable node)
    node := @real(node)
    if node instanceof CallNode
      not not node.is-new
    else
      false
  
  def call-is-apply(mutable node)
    node := @real(node)
    if node instanceof CallNode
      not not node.is-apply
    else
      false
  
  def call(func as Node, args as [Node] = [], is-new as Boolean = false, is-apply as Boolean = false)
    if is-new and is-apply
      throw Error "Cannot specify both is-new and is-apply"
    
    CallNode(func.line, func.column, @scope(), @do-wrap(func), (for arg in args; @do-wrap(arg)), is-new, is-apply).reduce(@parser)
  
  def func(mutable params, body as Node, auto-return as Boolean = true, bound as (Node|Boolean) = false, curry as Boolean, as-type as Node|void, generator as Boolean, generic as [IdentNode] = [])
    let scope = @parser.push-scope(true)
    params := for param in params
      let p = param.rescope scope
      add-param-to-scope scope, p
      p
    let func = FunctionNode(body.line, body.column, scope.parent, params, body.rescope(scope), auto-return, bound, curry, as-type, generator, generic).reduce(@parser)
    @parser.pop-scope()
    func
  
  def is-func(node) -> @real(node) instanceof FunctionNode
  def func-body(mutable node)
    node := @real node
    if @is-func node then node.body
  def func-params(mutable node)
    node := @real node
    if @is-func node then node.params
  def func-is-auto-return(mutable node)
    node := @real node
    if @is-func node then not not node.auto-return
  def func-is-bound(mutable node)
    node := @real node
    if @is-func node then not not node.bound and node.bound not instanceof Node
  def func-is-curried(mutable node)
    node := @real node
    if @is-func node then not not node.curry
  def func-as-type(mutable node)
    node := @real node
    if @is-func node then node.as-type
  def func-is-generator(mutable node)
    node := @real node
    if @is-func node then not not node.generator
  def func-generic(mutable node)
    node := @real node
    if @is-func node
      node.generic.slice()
    else
      []
  
  def param(ident as Node, default-value, spread, is-mutable, as-type)
    ParamNode(ident.line, ident.column, ident.scope, ident, default-value, spread, is-mutable, as-type).reduce(@parser)
  
  def is-param(node) -> @real(node) instanceof ParamNode
  def param-ident(mutable node)
    node := @real node
    if @is-param node then node.ident
  def param-default-value(mutable node)
    node := @real node
    if @is-param node then node.default-value
  def param-is-spread(mutable node)
    node := @real node
    if @is-param node then not not node.spread
  def param-is-mutable(mutable node)
    node := @real node
    if @is-param node then not not node.is-mutable
  def param-type(mutable node)
    node := @real node
    if @is-param node then node.as-type
  
  def is-array(node) -> @real(node) instanceof ArrayNode
  def elements(mutable node)
    node := @real node
    if @is-array node then node.elements
  
  def array-has-spread(mutable node)
    node := @real node
    if node instanceof ArrayNode
      for some element in node.elements
        @real(element) instanceof SpreadNode
    else
      false
  
  def is-object(node) -> @real(node) instanceof ObjectNode
  def pairs(mutable node)
    node := @real node
    if @is-object(node) or @is-type-object(node) then node.pairs
  
  def is-block(node) -> @real(node) instanceof BlockNode
  def nodes(mutable node)
    node := @real node
    if @is-block node then node.nodes
  
  def array(elements as [Node])
    @parser.Array(0, (for element in elements; @do-wrap(element))).reduce(@parser)
  def object(pairs as [{ key: Node, value: Node }])
    @parser.Object(0, (for {key, value, property} in pairs; {key: @do-wrap(key), value: @do-wrap(value) property})).reduce(@parser)
  
  def type(node)
    if is-string! node
      Type![node] or throw Error "Unknown type $(node)"
    else if node instanceof Node
      node.type(@parser)
    else
      throw Error "Can only retrieve type from a String or Node, got $(typeof! node)"
  
  def to-type = node-to-type
  
  def is-complex(mutable node)
    node := @real node
    node? and node not instanceofsome [ConstNode, IdentNode, TmpNode, ThisNode, ArgsNode] and not (node instanceof BlockNode and node.nodes.length == 0)
  
  def is-noop(mutable node)
    node := @real node
    node.is-noop(@parser)
  
  def is-nothing(mutable node)
    @real(node) instanceof NothingNode
  
  def is-type-array(mutable node)
    node := @real(node)
    node instanceof TypeGenericNode and node.basetype instanceof IdentNode and node.basetype.name == \Array
  def subtype(mutable node)
    node := @real node
    if node instanceof TypeGenericNode
      if node.basetype instanceof IdentNode and node.basetype.name == \Array
        node.args[0]
  
  def is-type-generic(node) -> @real(node) instanceof TypeGenericNode
  def basetype(mutable node)
    node := @real node
    node instanceof TypeGenericNode and node.basetype
  def type-arguments(mutable node)
    node := @real node
    node instanceof TypeGenericNode and node.args
  
  def is-type-object(node) -> @real(node) instanceof TypeObjectNode
  
  def is-type-function(mutable node)
    node := @real(node)
    node instanceof TypeGenericNode and node.basetype instanceof IdentNode and node.basetype.name == \Function
  def return-type(mutable node)
    node := @real node
    if node instanceof TypeGenericNode
      if node.basetype instanceof IdentNode and node.basetype.name == \Function
        node.args[0]
  
  def is-type-union(node) -> @real(node) instanceof TypeUnionNode
  def types(mutable node)
    node := @real node
    @is-type-union(node) and node.types
  
  def is-this(node) -> @real(node) instanceof ThisNode
  def is-arguments(mutable node)
    node := @real node
    node instanceof ArgsNode
  
  def is-def(node) -> @real(node) instanceof DefNode
  def is-assign(node) -> @real(node) instanceof AssignNode
  def is-binary(node) -> @real(node) instanceof BinaryNode
  def is-unary(node) -> @real(node) instanceof UnaryNode
  def op(mutable node)
    node := @real node
    if @is-assign(node) or @is-binary(node) or @is-unary(node)
      node.op
  def left(mutable node)
    node := @real node
    if @is-def(node) or @is-binary(node)
      node.left
  def right(mutable node)
    node := @real node
    if @is-def(node) or @is-binary(node)
      node.right
  def unary-node(mutable node)
    node := @real node
    if @is-unary(node)
      node.node

  def is-access(node) -> @real(node) instanceof AccessNode
  def parent(mutable node)
    node := @real node
    if node instanceof AccessNode
      node.parent
  def child(mutable node)
    node := @real node
    if node instanceof AccessNode
      node.child
  
  def is-if(node) -> @real(node) instanceof IfNode
  def test(mutable node)
    node := @real(node)
    if node instanceof IfNode
      node.test
  def when-true(mutable node)
    node := @real(node)
    if node instanceof IfNode
      node.when-true
  def when-false(mutable node)
    node := @real(node)
    if node instanceof IfNode
      node.when-false
  
  def cache(node as Node, init, name as String = \ref, save as Boolean)
    @maybe-cache node, (#(set-node, node, cached)
      if cached
        init.push set-node
      node), name, save
  
  def maybe-cache(mutable node as Node, func, name as String = \ref, save as Boolean)
    node := @macro-expand-1(node)
    if @is-complex node
      let type = node.type(@parser)
      let tmp = @tmp(name, save, type)
      @scope().add tmp, false, type
      func @parser.Block(@index, [
        @parser.Var @index, tmp, false
        @parser.Assign @index, tmp, "=", @do-wrap(node)
      ]), tmp, true
    else
      func node, node, false
  
  def maybe-cache-access(mutable node as Node, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    node := @macro-expand-1 node
    if @is-access(node)
      @maybe-cache @parent(node), (#(set-parent, parent, parent-cached)@
        @maybe-cache @child(node), (#(set-child, child, child-cached)@
          if parent-cached or child-cached
            func(
              @parser.Access(@index, set-parent, set-child)
              @parser.Access(@index, parent, child)
              true)
          else
            func node, node, false), child-name, save), parent-name, save
    else
      func node, node, false
  
  def empty(node)
    if not node?
      true
    else if node not instanceof Node
      false
    else if node instanceof BlockNode
      for every item in node.nodes by -1; @empty(item)
    else
      node instanceof NothingNode
  
  let constify-object(obj, line, column, scope as Scope)
    if not is-object! obj or obj instanceof RegExp
      ConstNode line, column, scope, obj
    else if is-array! obj
      ArrayNode line, column, scope, for item in obj
        constify-object item, line, column, scope
    else if obj instanceof IdentNode and obj.name.length > 1 and obj.name.char-code-at(0) == '$'.char-code-at(0)
      CallNode obj.line, obj.column, scope,
        IdentNode obj.line, obj.column, scope, \__wrap
        [
          IdentNode obj.line, obj.column, scope, obj.name.substring 1
        ]
    else if obj instanceof CallNode and not obj.is-new and not obj.is-apply and obj.func instanceof IdentNode and obj.func.name == '$'
      if obj.args.length != 1 or obj.args[0] instanceof SpreadNode
        throw Error "Can only use \$() in an AST if it has one argument."
      CallNode obj.line, obj.column, scope,
        IdentNode obj.line, obj.column, scope, \__wrap
        [
          obj.args[0]
        ]
    else if obj instanceof Node
      if obj.constructor == Node
        throw Error "Cannot constify a raw node"
      
      CallNode obj.line, obj.column, scope,
        IdentNode obj.line, obj.column, scope, \__node
        [
          ConstNode obj.line, obj.column, scope, obj.constructor.capped-name
          ConstNode obj.line, obj.column, scope, obj.line
          ConstNode obj.line, obj.column, scope, obj.column
          ...(for k in obj.constructor.arg-names
            constify-object obj[k], obj.line, obj.column, scope)
        ]
    else
      ObjectNode line, column, scope, for k, v of obj
        key: ConstNode line, column, scope, k
        value: constify-object v, line, column, scope
  @constify-object := constify-object
  
  let walk(node, func)
    if not is-object! node or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to walk through: $(typeof! node)"
    if node not instanceof BlockNode
      return? func(node)
    node.walk(#(x) -> walk x, func)
  
  def wrap(value)
    if is-array! value
      BlockNode(0, 0, @scope(), value).reduce(@parser)
    else if value instanceof Node
      value
    else if not value?
      NothingNode(0, 0, @scope())
    else if value instanceof RegExp or typeof value in [\string, \boolean, \number]
      ConstNode(0, 0, @scope(), value)
    else
      value//throw Error "Trying to wrap an unknown object: $(typeof! value)"
  
  def node(type, line, column, ...args)
    if type == "MacroAccess"
      @macro line, column, ...args
    else
      Node[type](line, column, @scope(), ...args).reduce(@parser)
  
  def macro(line, column, id, call-line, data, position, in-generator, in-evil-ast)
    Node.MacroAccess(line, column, @scope(), id, call-line, data, position, in-generator or @parser.in-generator.peek(), in-evil-ast).reduce(@parser)
  
  def walk(node as Node|void|null, func as Node -> Node)
    if node?
      walk node, func
    else
      node
  
  def has-func(node)
    if @_has-func?
      @_has-func
    else
      let FOUND = {}
      let walker(x)
        if x instanceof FunctionNode
          throw FOUND
        else
          x.walk(walker)
      try
        walk @macro-expand-all(node), walker
      catch e
        if e != FOUND
          throw e
        return (@_has-func := true)
      @_has-func := false
  
  def is-statement(mutable node)
    node := @macro-expand-1 node // TODO: should this be macro-expand-all?
    node instanceof Node and node.is-statement()
  
  def is-type(node, name as String)
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@parser).is-subset-of(type)
  
  def has-type(node, name as String)
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@parser).overlaps(type) // TODO: should this be macro-expand-all?
  
  let mutators =
    Block: #(x, func)
      let {nodes} = x
      let len = nodes.length
      if len != 0
        let last-node = @mutate-last(nodes[len - 1], func)
        if last-node != nodes[len - 1]
          return BlockNode x.line, x.column, x.scope, [...nodes[0 til -1], last-node], x.label
      x
    If: #(x, func)
      let when-true = @mutate-last x.when-true, func
      let when-false = @mutate-last x.when-false, func
      if when-true != x.when-true or when-false != x.when-false
        IfNode x.line, x.column, x.scope, x.test, when-true, when-false, x.label
      else
        x
    Switch: #(x, func)
      let cases = map x.cases, #(case_)@
        if case_.fallthrough
          case_
        else
          let body = @mutate-last case_.body, func
          if body != case_.body
            { case_.node, body, case_.fallthrough }
          else
            case_
      let default-case = @mutate-last (x.default-case or @noop()), func
      if cases != x.cases or default-case != x.default-case
        SwitchNode x.line, x.column, x.scope, x.node, cases, default-case, x.label
      else
        x
    TmpWrapper: #(x, func)
      let node = @mutate-last x.node, func
      if node != x.node
        TmpWrapperNode x.line, x.column, x.scope, node, x.tmps
      else
        x
    MacroAccess: #(x, func)
      @mutate-last @macro-expand-1(x), func
    Break: identity
    Continue: identity
    Nothing: identity
    Return: identity
    Debugger: identity
    Throw: identity
  def mutate-last(mutable node, func as Node -> Node, include-noop)
    if not is-object! node or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to mutate-last through: $(typeof! node)"
    
    if mutators not ownskey node.constructor.capped-name or (include-noop and node instanceof NothingNode)
      func@(this, node) ? node
    else
      mutators[node.constructor.capped-name]@(this, node, func)
  
  def can-mutate-last(node)
    node instanceof Node and mutators ownskey node.constructor.capped-name

module.exports := MacroContext