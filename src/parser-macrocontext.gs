import 'shared.gs'

require! Node: './parser-nodes'
require! LispyNode: './parser-lispynodes'
require! Type: './types'
require! Scope: './parser-scope'
let {node-to-type, add-param-to-scope} = require './parser-utils'

let AccessNode = Node.Access
let AssignNode = Node.Assign
let BinaryNode = Node.Binary
let BlockNode = Node.Block
let CallNode = Node.Call
let EmbedWriteNode = Node.EmbedWrite
let FunctionNode = Node.Function
let IdentNode = Node.Ident
let MacroAccessNode = Node.MacroAccess
let MacroConstNode = Node.MacroConst
let NothingNode = Node.Nothing
let ParamNode = Node.Param
let RootNode = Node.Root
let SpreadNode = Node.Spread
let SuperNode = Node.Super
let SyntaxChoiceNode = Node.SyntaxChoice
let SyntaxManyNode = Node.SyntaxMany
let SyntaxParamNode = Node.SyntaxParam
let SyntaxSequenceNode = Node.SyntaxSequence
let TmpNode = Node.Tmp
let TypeFunctionNode = Node.TypeFunction
let TypeGenericNode = Node.TypeGeneric
let TypeObjectNode = Node.TypeObject
let TypeUnionNode = Node.TypeUnion
let UnaryNode = Node.Unary

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
    
  def line(node)
    let index = if node instanceof Node
      node.index
    else
      @index
    @parser.get-position(index).line
  
  def column(node)
    let index = if node instanceof Node
      node.index
    else
      @index
    @parser.get-position(index).column
  
  def file()
    @parser.options.filename or ""
  
  def version()
    @parser.get-package-version()
  
  def let(ident as TmpNode|IdentNode, is-mutable as Boolean, mutable type as Type = Type.any)
    if ident instanceof IdentNode and is-mutable and type.is-subset-of(Type.undefined-or-null)
      type := Type.any
    @scope().add(ident, is-mutable, type)
  
  def has-variable(ident as TmpNode|IdentNode)
    @scope().has(ident)
  
  def is-variable-mutable(ident as TmpNode|IdentNode)
    @scope().is-mutable(ident)
  
  def var(ident as IdentNode|TmpNode, is-mutable as Boolean)
    LispyNode.InternalCall \var, @index, @scope(),
      ident
      LispyNode.Value @index, is-mutable
  def custom(name as String, ...data as [Node])
    LispyNode.InternalCall(\custom, @index, @scope(),
      LispyNode.Value @index, name
      ...data).reduce(@parser)
  def noop() -> @parser.Nothing @index
  def block(nodes as [Node], label as IdentNode|TmpNode|null) -> @parser.Block(@index, nodes, label).reduce(@parser)
  def if(test as Node = NothingNode(0, @scope()), when-true as Node = NothingNode(0, @scope()), when-false as Node = NothingNode(0, @scope()), label as IdentNode|TmpNode|null)
    LispyNode.InternalCall(\if, @index, @scope(),
      @do-wrap(test)
      when-true
      when-false
      ...(if label then [label] else [])).reduce(@parser)
  def switch(topic as Node = NothingNode(0, @scope()), cases as [], default-case as Node|null, label as IdentNode|TmpNode|null)
    let args = [
      @do-wrap(topic)
    ]
    for case_ in cases
      args.push(
        @do-wrap(case_.node)
        case_.body
        @const(case_.fallthrough))
    args.push default-case
    if label
      args.push label
    LispyNode.InternalCall(\switch, @index, @scope(),
      ...args).reduce(@parser)
  def for(init as Node|null, test as Node|null, step as Node|null, body as Node = NothingNode(0, @scope()), label as IdentNode|TmpNode|null)
    LispyNode.InternalCall(\for, @index, @scope(),
      @do-wrap(init)
      @do-wrap(test)
      @do-wrap(step)
      body
      ...(if label then [label] else [])).reduce(@parser)
  def for-in(key as IdentNode, object as Node = NothingNode(0), body as Node = NothingNode(0, @scope()), label as IdentNode|TmpNode|null)
    LispyNode.InternalCall(\for-in, @index, @scope(),
      key
      @do-wrap(object)
      body
      ...(if label then [label] else [])).reduce(@parser)
  def try-catch(try-body as Node = NothingNode(0, @scope()), catch-ident as Node = NothingNode(0, @scope()), catch-body as Node = NothingNode(0, @scope()), label as IdentNode|TmpNode|null)
    LispyNode.InternalCall(\try-catch, @index, @scope(),
      try-body
      catch-ident
      catch-body
      ...(if label then [label] else [])).reduce(@parser)
  def try-finally(try-body as Node = NothingNode(0, @scope()), finally-body as Node = NothingNode(0, @scope()), label as IdentNode|TmpNode|null)
    LispyNode.InternalCall(\try-finally, @index, @scope(),
      try-body
      finally-body
      ...(if label then [label] else [])).reduce(@parser)
  def assign(left as Node = NothingNode(0, @scope()), op as String, right as Node = NothingNode(0, @scope())) -> @parser.Assign(@index, left, op, @do-wrap(right)).reduce(@parser)
  def binary(left as Node = NothingNode(0, @scope()), op as String, right as Node = NothingNode(0, @scope())) -> @parser.Binary(@index, @do-wrap(left), op, @do-wrap(right)).reduce(@parser)
  def binary-chain(op as String, nodes as [Node])
    if nodes.length == 0
      throw Error "Expected nodes to at least have a length of 1"
    let result = for reduce right in nodes[1 to -1], left = @do-wrap(nodes[0])
      @parser.Binary(@index, left, op, @do-wrap(right))
    result.reduce(@parser)
  def unary(op as String, node as Node = NothingNode(0, @scope())) -> @parser.Unary(@index, op, @do-wrap(node)).reduce(@parser)
  def throw(node as Node = NothingNode(0, @scope()))
    LispyNode.InternalCall(\throw, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def return(node as Node = NothingNode(0, @scope()))
    LispyNode.InternalCall(\return, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def yield(node as Node = NothingNode(0, @scope()))
    LispyNode.InternalCall(\yield, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def debugger()
    LispyNode.InternalCall \debugger, @index, @scope()
  def break(label as IdentNode|TmpNode|null)
    LispyNode.InternalCall \break, @index, @scope(),
      ...(if label then [label] else [])
  def continue(label as IdentNode|TmpNode|null)
    LispyNode.InternalCall \continue, @index, @scope(),
      ...(if label then [label] else [])
  def spread(node as Node) -> @parser.Spread(@index, node)
  
  def real(mutable node)
    node := @macro-expand-1(node)
    if node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-tmp-wrapper
      node.args[0]
    else
      node
  
  def rewrap(new-node, mutable old-node)
    old-node := @macro-expand-1(old-node)
    if old-node instanceof LispyNode and old-node.is-call and old-node.func.is-symbol and old-node.func.is-internal and old-node.func.is-tmp-wrapper
      if new-node instanceof LispyNode and new-node.is-call and new-node.func.is-symbol and new-node.func.is-internal and new-node.func.is-tmp-wrapper
        LispyNode.InternalCall \tmp-wrapper, new-node.index, new-node.scope,
          new-node.args[0]
          ...old-node.args[1 to -1]
          ...new-node.args[1 to -1]
      else
        LispyNode.InternalCall \tmp-wrapper, new-node.index, new-node.scope,
          new-node
          ...old-node.args[1 to -1]
    else
      new-node
  
  def eq(mutable alpha, mutable bravo)
    alpha := @real alpha
    bravo := @real bravo
    if alpha instanceof LispyNode
      if alpha.is-value and bravo.is-value
        alpha.value == bravo.value
      else
        false
    else if alpha instanceof IdentNode
      bravo instanceof IdentNode and alpha.name == bravo.name
    else
      false
  
  def is-labeled-block(mutable node)
    node := @real(node)
    if node instanceof LispyNode and node.is-call
      let func = node.func
      if func.is-symbol and func.is-internal
        switch func.name
        case \try-finally
          node.args[2]?
        case \try-catch, \for-in, \if
          node.args[3]?
        case \for
          node.args[4]?
        case \switch
          let args = node.args
          if args.length %% 3
            args[* - 1]?
          else
            false
        default
          false
      else
        false
    else if node instanceof BlockNode
      node.label?
    else
      false
  
  def is-break(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-break
  def is-continue(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-continue
  def label(mutable node)
    node := @real(node)
    if node instanceof LispyNode
      if node.is-call
        let {func} = node
        if func.is-symbol and func.is-internal
          switch func.name
          case \break, \continue
            return node.args[0]
          case \try-finally
            return node.args[2]
          case \try-catch, \for-in, \if
            return node.args[3]
          case \for
            return node.args[4]
          case \switch
            let args = node.args
            if args.length %% 3
              return args[* - 1]
    else if node instanceof BlockNode
      return node.label
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
    LispyNode.Value @index, value
  
  def is-spread(node) -> @real(node) instanceof SpreadNode
  def spread-subnode(mutable node)
    node := @real(node)
    if node instanceof SpreadNode
      node.node
  
  def is-node(node) -> node instanceof Node
  def is-ident(node) -> @real(node) instanceof IdentNode
  def is-primordial(mutable node)
    node := @real node
    node instanceof IdentNode and node.is-primordial()
  def is-tmp(node) -> @real(node) instanceof TmpNode
  def is-ident-or-tmp(node) -> @real(node) instanceofsome [IdentNode, TmpNode]
  def name(mutable node)
    node := @real(node)
    if @is-ident(node)
      node.name
    else if @is-custom(node)
      node.args[0].const-value()
  def custom-data(mutable node)
    node := @real(node)
    if @is-custom(node)
      node.args.slice(1)
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
    
    CallNode(func.index, @scope(), @do-wrap(func), (for arg in args; @do-wrap(arg)), is-new, is-apply).reduce(@parser)
  
  def func(mutable params, body as Node, auto-return as Boolean = true, bound as (Node|Boolean) = false, curry as Boolean, as-type as Node|void, generator as Boolean, generic as [IdentNode] = [])
    let scope = @parser.push-scope(true)
    params := for param in params
      let p = param.rescope scope
      add-param-to-scope scope, p
      p
    let func = FunctionNode(body.index, scope.parent, params, body.rescope(scope), auto-return, bound, curry, as-type, generator, generic).reduce(@parser)
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
    ParamNode(ident.index, ident.scope, ident, default-value, spread, is-mutable, as-type).reduce(@parser)
  
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
  
  def is-array(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-array
  def elements(mutable node)
    node := @real node
    if node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-array
      node.args
  
  def array-has-spread(mutable node)
    node := @real node
    if node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-array
      for some element in node.args
        @real(element) instanceof SpreadNode
    else
      false
  
  def is-object(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-object
  def pairs(mutable node)
    node := @real node
    if @is-type-object(node)
      node.pairs
    else if node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-object
      return for array in node.args[1 to -1]
        let pair = { key: array.args[0], value: array.args[1] }
        if array.args[2]
          pair.property := array.args[2].const-value()
        pair
  
  def is-block(node) -> @real(node) instanceof BlockNode
  def nodes(mutable node)
    node := @real node
    if @is-block node then node.nodes
  
  def array(elements as [Node])
    LispyNode.InternalCall(\array, @index, @scope(),
      ...(for element in elements; @do-wrap(element))).reduce(@parser)
  def object(pairs as [{ key: Node, value: Node }], prototype as Node|null)
    let array-pairs = for pair, i in pairs
      if pair instanceof OldNode
        if pair instanceof LispyNode and pair.is-call and pair.func.is-symbol and pair.func.is-internal and pair.func.is-array
          if pair.args.length not in [2, 3]
            throw Error "Expected object pair #$i to have a length of 2 or 3, got $(pair.args.length)"
          if pair.args.length == 3 and (pair.args[2] not instanceof Node or not pair.args[2].is-const-type(\string))
            throw Error "Expected object pair #$i to have a constant property type, got $(typeof! pair.args[2])"
          pair
        else
          throw Error "Exected object pair #$i to be an AST Array, got $(typeof! pair)"
      else if pair.constructor == Object
        let {key, value, property} = pair
        LispyNode.InternalCall(\array, @index, @scope(),
          @do-wrap(key)
          @do-wrap(value)
          ...(if property
            if is-string! property
              [LispyNode.Value @index, property]
            else if property instanceof Node and property.is-const-type(\string)
              [property]
            else
              throw Error "Expected property in object pair #$i to be a string or a Value containing a string, got $(typeof! property)"
          else
            []))
      else
        throw Error "Expected object pair #$i to be an AST Array or a literal object, got $(typeof! pair)"
    LispyNode.InternalCall(\object, @index, @scope(),
      prototype or NothingNode @index, @scope()
      ...array-pairs).reduce(@parser)
  
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
    if not node?
      false
    else if node instanceof LispyNode
      node.is-call
    else
      node not instanceofsome [IdentNode, TmpNode] and not (node instanceof BlockNode and node.nodes.length == 0)
  
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
  
  def is-this(mutable node)
    node := @real node
    node instanceof LispyNode and node.is-ident and node.name == \this
  def is-arguments(mutable node)
    node := @real node
    node instanceof LispyNode and node.is-ident and node.name == \arguments

  def is-custom(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-custom
  def is-assign(node) -> @real(node) instanceof AssignNode
  def is-binary(node) -> @real(node) instanceof BinaryNode
  def is-unary(node) -> @real(node) instanceof UnaryNode
  def op(mutable node)
    node := @real node
    if @is-assign(node) or @is-binary(node) or @is-unary(node)
      node.op
  def left(mutable node)
    node := @real node
    if @is-binary(node)
      node.left
  def right(mutable node)
    node := @real node
    if @is-binary(node)
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
  
  def is-if(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-if
  def test(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-if and node.args[0]
  def when-true(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-if and node.args[1]
  def when-false(mutable node)
    node := @real(node)
    node instanceof LispyNode and node.is-call and node.func.is-symbol and node.func.is-internal and node.func.is-if and node.args[2]
  
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
      func@ this, @parser.Block(@index, [
        LispyNode.InternalCall \var, @index, @scope(), tmp
        @parser.Assign @index, tmp, "=", @do-wrap(node)
      ]), tmp, true
    else
      func@ this, node, node, false
  
  def maybe-cache-access(mutable node as Node, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    node := @macro-expand-1 node
    if @is-access(node)
      @maybe-cache @parent(node), (#(set-parent, parent, parent-cached)
        @maybe-cache @child(node), (#(set-child, child, child-cached)
          if parent-cached or child-cached
            func@ this,
              @parser.Access(@index, set-parent, set-child)
              @parser.Access(@index, parent, child)
              true
          else
            func@ this, node, node, false), child-name, save), parent-name, save
    else
      func@ this, node, node, false
  
  def empty(node)
    if not node?
      true
    else if node not instanceof Node
      false
    else if node instanceof BlockNode
      for every item in node.nodes by -1; @empty(item)
    else
      node instanceof NothingNode
  
  let constify-object(position, obj, index, scope as Scope)
    if obj == null or typeof obj in [\string, \number, \boolean, \undefined]
      LispyNode.Value index, obj
    else if obj instanceof RegExp
      CallNode obj.index, scope,
        IdentNode obj.index, scope, \RegExp
        [
          LispyNode.Value index, obj.source
          LispyNode.Value index, "$(if obj.global then 'g' else '')$(if obj.ignore-case then 'i' else '')$(if obj.multiline then 'm' else '')$(if obj.sticky then 'y' else '')"
        ]
    else if is-array! obj
      LispyNode.InternalCall \array, index, scope,
        ...(for item in obj
          constify-object position, item, index, scope)
    else if obj instanceof IdentNode and obj.name.length > 1 and obj.name.char-code-at(0) == '$'.char-code-at(0)
      CallNode obj.index, scope,
        IdentNode obj.index, scope, \__wrap
        [
          IdentNode obj.index, scope, obj.name.substring 1
        ]
    else if obj instanceof CallNode and not obj.is-new and not obj.is-apply and obj.func instanceof IdentNode and obj.func.name == '$'
      if obj.args.length != 1 or obj.args[0] instanceof SpreadNode
        throw Error "Can only use \$() in an AST if it has one argument."
      CallNode obj.index, scope,
        IdentNode obj.index, scope, \__wrap
        [
          obj.args[0]
        ]
    else if obj instanceof MacroConstNode
      CallNode obj.index, scope,
        IdentNode obj.index, scope, \__const
        [
          LispyNode.Value obj.index, obj.name
        ]
    else if obj instanceof LispyNode
      switch obj.node-type
      case \value
        CallNode obj.index, scope,
          IdentNode obj.index, scope, \__value
          [
            position or LispyNode.Value obj.index, void
            obj
          ]
      case \symbol
        CallNode obj.index, scope,
          IdentNode obj.index, scope, \__symbol
          [
            position or LispyNode.Value obj.index, void
            ...(switch
            case obj.is-ident
              [
                LispyNode.Value obj.index, \ident
                LispyNode.Value obj.index, obj.name
              ]
            case obj.is-tmp
              [
                LispyNode.Value obj.index, \tmp
                LispyNode.Value obj.index, obj.id
                LispyNode.Value obj.index, obj.name
              ]
            case obj.is-internal
              [
                LispyNode.Value obj.index, \internal
                LispyNode.Value obj.index, obj.name
              ]
            case obj.is-operator
              [
                LispyNode.Value obj.index, \operator
                LispyNode.Value obj.index, obj.operator-type
                LispyNode.Value obj.index, obj.name
              ])
          ]
      case \call
        CallNode obj.index, scope,
          IdentNode obj.index, scope, \__call
          [
            position or LispyNode.Value obj.index, void
            constify-object position, obj.func, index, scope
            ...(for arg in obj.args
              constify-object position, arg, index, scope)
          ]
    else if obj instanceof Node
      if obj.constructor == Node
        throw Error "Cannot constify a raw node"
      
      CallNode obj.index, scope,
        IdentNode obj.index, scope, \__node
        [
          LispyNode.Value obj.index, obj.type-id
          position or LispyNode.Value obj.index, void
          ...(for item in obj._to-JSON()
            constify-object position, item, obj.index, scope)
        ]
    else if obj.constructor == Object
      LispyNode.InternalCall \object, index, scope,
        NothingNode index, scope
        ...(for k, v of obj
          LispyNode.InternalCall \array, index, scope,
            LispyNode.Value index, k
            constify-object position, v, index, scope)
    else
      throw Error "Trying to constify a $(typeof! obj)"
  @constify-object := constify-object
  
  def wrap(value)
    if is-array! value
      BlockNode(@index, @scope(), value).reduce(@parser)
    else if value instanceof Node
      value
    else if not value?
      NothingNode(@index, @scope())
    else if typeof value in [\string, \boolean, \number]
      LispyNode.Value @index, value
    else
      value//throw Error "Trying to wrap an unknown object: $(typeof! value)"
  
  def make-lispy-value(from-position, value)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    LispyNode.Value index, value
  
  def make-lispy-symbol(from-position, symbol-type, ...args)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    switch symbol-type
    case \internal
      LispyNode.Symbol[args[0]](index)
    case \ident
      LispyNode.Symbol.ident(index, @scope(), args[0])
    case \tmp
      LispyNode.Symbol.tmp(index, @scope(), args[0], args[1])
    case \operator
      LispyNode.Symbol[args[0]](index, args[1])
  
  def make-lispy-call(from-position, func, ...args)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    LispyNode.Call index, @scope(), func, ...args
  
  def node(type-id as Number, from-position, ...args)
    if type-id == ParserNodeType.MacroAccess
      @macro from-position, ...args
    else
      let index = if from-position and is-number! from-position.index
        from-position.index
      else
        @index
      Node.by-type-id[type-id](index, @scope(), ...args).reduce(@parser)
  
  def get-const-value(name as String, default-value)
    let c = @parser.get-const(name)
    if not c
      if arguments.length < 2
        throw Error "Unknown const '$name'"
      else
        default-value
    else
      c.value
  
  let to-literal-node(obj)
    if is-null! obj or typeof obj in [\undefined, \boolean, \number, \string]
      LispyNode.Value 0, obj
    else if is-array! obj
      LispyNode.InternalCall \array, 0, @scope(),
        ...(for item in obj
          to-literal-node@ this, item)
    else if obj.constructor == Object
      LispyNode.InternalCall \object, 0, @scope(),
        NothingNode 0, @scope()
        ...(for k, v of obj
          LispyNode.InternalCall \array, 0, @scope(),
            to-literal-node@ this, k
            to-literal-node@ this, v)
    else
      throw Error "Cannot convert $(typeof! obj) to a literal node"
  
  def get-const(name as String)
    to-literal-node@ this, @get-const-value(name)
  
  def macro(from-position, id, call-line, data, position, in-generator, in-evil-ast)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    Node.MacroAccess(index, @scope(), id, call-line, data, position, in-generator or @parser.in-generator.peek(), in-evil-ast).reduce(@parser)
  
  let walk(node, func)
    if not is-object! node or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to walk through: $(typeof! node)"
    if node not instanceof BlockNode
      return? func@ this, node
    node.walk (#(x) -> walk@ this, x, func), this
  
  def walk(node as Node|void|null, func as Node -> Node)
    if node?
      walk@ this, node, func
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
  
  def mutate-last(mutable node, func as Node -> Node, include-noop)
    if not is-object! node or node instanceof RegExp
      return node
    
    if node not instanceof Node
      throw Error "Unexpected type to mutate-last through: $(typeof! node)"
    
    node.mutate-last @parser, func, this, include-noop

module.exports := MacroContext