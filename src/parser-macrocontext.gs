import 'shared.gs'

require! ParserNode: './parser-nodes'
require! Type: './types'
require! Scope: './parser-scope'
let {node-to-type, add-param-to-scope} = require './parser-utils'
let {Cache, is-primordial} = require './utils'

let {Symbol, Value} = ParserNode
let Tmp = Symbol.tmp
let Ident = Symbol.ident

let identity(x) -> x
let ret-this() -> this

/**
 * Represents the object that will be passed in as the `this` binding to macros.
 */
class MacroContext
  def constructor(@parser/* as Parser*/, @index, @position, @in-generator, @in-evil-ast)
    @unsaved-tmps := []
    @saved-tmps := []
  
  /**
   * Throw a MacroError with the provided message and at the position of the provided node.
   */
  def error(message as String, node as ParserNode|null)
    throw @parser.build-error message, node or @index
  
  /**
   * Return whether the provided argument is a ParserNode
   */
  def is-node(node) -> node instanceof ParserNode

  /**
   * Construct and return a new Value with the provided `value`.
   */
  def const(value)
    unless not value? or typeof value in [\string, \number, \boolean]
      throw TypeError "Expected value to be null, undefined, a String, Number, or Boolean. Got $(typeof! value)"
    Value @index, value

  /**
   * Construct and return a new Ident with the provided name.
   *
   * If the name is a reserved word in JavaScript, returns undefined.
   */
  def ident(name)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"
    // TODO: don't assume JS
    if require('./jsutils').is-acceptable-ident(name, true)
      Ident @index, @scope(), name

  /**
   * Construct and return a new Tmp.
   *
   * If `save` is true, then the Tmp will not be reused in lower scopes.
   */
  def tmp(name = \ref, save as Boolean = false)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"
    let tmp = @parser.make-tmp @index, name
    (if save then @saved-tmps else @unsaved-tmps).push tmp.id
    tmp

  /**
   * Construct and return a new Internal symbol with the provided `name`.
   *
   * If `name` is not in the known set of internal symbols, an error is thrown.
   */
  def internal(name)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"

    let factory = Symbol![name]
    unless is-function! factory
      throw Error "Unknown internal symbol '$name'"

    factory @index

  /**
   * Alias for @internal(\nothing)
   */
  def noop()
    ParserNode.Symbol.nothing @index

  /**
   * Construct and return a new assign operator symbol with the provided `name`.
   *
   * If `name` is not in the known set of assign operator names, an error is thrown.
   */
  def assign-operator(name)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"

    let factory = Symbol.assign![name]
    unless is-function! factory
      throw Error "Unknown assign operator '$name'"

    factory @index

  /**
   * Construct and return a new binary operator symbol with the provided `name`.
   *
   * If `name` is not in the known set of assign operator names, an error is thrown.
   */
  def binary-operator(name)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"

    let factory = Symbol.binary![name]
    unless is-function! factory
      throw Error "Unknown binary operator '$name'"

    factory @index

  /**
   * Construct and return a new unary operator symbol with the provided `name`.
   *
   * If `name` is not in the known set of assign operator names, an error is thrown.
   */
  def unary-operator(name)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"

    let factory = Symbol.unary![name]
    unless is-function! factory
      throw Error "Unknown unary operator '$name'"

    factory @index

  /**
   * Construct and return a new Call node with the provided `func` and `args`.
   */
  def call(func, mutable ...args)
    if func not instanceof ParserNode
      throw TypeError "Expected func to be a Node, got $(typeof! func)"

    if args.length == 1 and is-array! args[0]
      args := args[0]

    let mutable scope = func.scope
    for arg, i in args
      if arg not instanceof ParserNode
        throw TypeError "Expected args[$i] to be a Node, got $(typeof! arg)"
      scope or= arg.scope

    ParserNode.Call(func.index, scope or @scope(),
      func
      ...args).reduce(@parser)

  /**
   * Return a Call with a func that is an Internal symbol with the name `name`.
   */
  def internal-call(name, ...args)
    @call(@internal(name), ...args)

  /**
   * Traverses through `node` and mutates all the nodes in the 'last' position
   * with the `mutator` function.
   */
  def mutate-last(mutable node, mutator, include-noop)
    if not node?
      node := Symbol.nothing @index
    else if node not instanceof ParserNode
      throw TypeError "Expected node to be a Node, got $(typeof! node)"
    unless is-function! mutator
      throw TypeError "Expected mutator to be a Function, got $(typeof! mutator)"

    node.mutate-last @parser, mutator, this, include-noop

  /**
   * Return whether the given node is a primordial. It will work on a primitive
   * string or an Ident.
   */
  def is-primordial(mutable node)
    if is-string! node
      is-primordial node
    else if node instanceof Ident
      node.is-primordial()
    else
      throw TypeError "Expected a String or Ident, got $(typeof! node)"

  /**
   * Return a Function node, properly rescoping the body and adding the params
   * to the scope.
   */
  def func(mutable params, body as ParserNode, bound as (ParserNode|Boolean) = false, as-type, is-generator as Value|Boolean)
    if params instanceof ParserNode
      if params.is-internal-call(\array)
        params := params.args
      else
        throw TypeError "Expected params to be an AST array or an Array, got $(typeof! params)"
    else if not is-array! params
      throw TypeError "Expected params to be an AST array or an Array, got $(typeof! params)"
    let scope = @parser.push-scope(true)
    params := for param, i in params
      if param not instanceof ParserNode
        throw TypeError "Expected params[$i] to be a Node, got $(typeof! param)"
      else if not param.is-internal-call(\param, \array, \object)
        throw Error "Expected params[$i] to be an internal call to param, array, or object, got $(param.inspect(0))"
      let p = param.rescope scope
      add-param-to-scope scope, p
      p
    if as-type and as-type not instanceof ParserNode
      throw TypeError "Expected asType to be a Node or undefined, got $(typeof! as-type)"
    let func = (ParserNode.InternalCall \function, body.index, scope.parent,
      ParserNode.InternalCall \array, body.index, scope.parent, ...params
      body.rescope(scope)
      if bound instanceof ParserNode
        bound
      else
        ParserNode.Value body.index, not not bound
      as-type or ParserNode.Symbol.nothing body.index
      if is-generator instanceof Value
        is-generator
      else
        ParserNode.Value body.index, not not is-generator).reduce(@parser)
    @parser.pop-scope()
    func

  /**
   * Return whether a given node has a function within it, useful for cases
   * where scoping needs to be kept within a loop.
   */
  def has-func = do
    let cache = Cache<ParserNode, Boolean>()
    #(node)
      if node instanceof ParserNode
        cache-get-or-add! cache, node, do
          if node.is-internal-call(\function)
            true
          else
            let expanded-node = @macro-expand-1(node)
            if expanded-node != node
              @has-func expanded-node
            else
              let FOUND = {}
              try
                node.walk (#(subnode)
                  if @has-func(subnode)
                    throw FOUND
                  subnode), this
              catch e == FOUND
                return true
              false
      else
        false

  /**
   * Return the current line or the line of the node passed in.
   */
  def line(node)
    let index = if node instanceof ParserNode
      node.index
    else
      @index
    @parser.get-position(index).line
  
  /**
   * Return the current column or the column of the node passed in.
   */
  def column(node)
    let index = if node instanceof ParserNode
      node.index
    else
      @index
    @parser.get-position(index).column
  
  /**
   * Return the current filename.
   */
  def file()
    @parser.options.filename or ""
  
  /**
   * Return the version within the closest package.json file, relative to the current file.
   */
  def version()
    @parser.get-package-version()

  /**
   * Add a variable to the current scope
   */
  def add-variable(ident, is-mutable, mutable type)
    if ident not instanceofsome [Ident, Tmp]
      throw TypeError "Expected ident to be an Ident or Tmp, got $(typeof! ident)"
    @scope().add(ident, not not is-mutable, type)
  
  /**
   * Return whether the provided Tmp or Ident is a known in-scope variable.
   */
  def has-variable(ident)
    if ident instanceofsome [Tmp, Ident]
      @scope().has(ident)
    else
      false
  
  /**
   * Return whether the provided Tmp or Ident is a known in-scope variable that is mutable.
   */
  def is-variable-mutable(ident)
    if ident instanceofsome [Tmp, Ident]
      @scope().is-mutable(ident)
    else
      false
  
  /**
   * Return a node with the provided label attached to it.
   */
  def with-label(node, label as Ident|Tmp|null)
    if node instanceof ParserNode
      node.with-label label, @parser
    else
      node
  
  /**
   * Cache a node if needed by pushing its initialization onto the `init` array.
   */
  def cache(node as ParserNode, init as [], name as String = \ref, save as Boolean)
    @maybe-cache node, (#(set-node, node, cached)
      if cached
        init.push set-node
      node), name, save
  
  /**
   * Cache a node if needed and call `func` with the results.
   */
  def maybe-cache(mutable node as ParserNode, func as ->, name as String = \ref, save as Boolean)
    node := @macro-expand-1(node)
    if node.cacheable
      let type = node.type(@parser)
      let tmp = @tmp(name, save, type)
      @scope().add tmp, false, type
      let set-tmp = ParserNode.InternalCall \block, @index, @scope(),
        ParserNode.InternalCall \var, @index, @scope(), tmp
        ParserNode.Call @index, @scope(),
          ParserNode.Symbol.assign["="] @index
          tmp
          @do-wrap(node)
      func@ this, set-tmp, tmp, true
    else
      func@ this, node, node, false
  
  /**
   * Cache an access node if needed, separately caching the parent and child.
   */
  def maybe-cache-access(mutable node as ParserNode, func, parent-name as String = \ref, child-name as String = \ref, save as Boolean)
    node := @macro-expand-1 node
    if node.is-internal-call \access
      @maybe-cache node.args[0], (#(set-parent, parent, parent-cached)
        @maybe-cache node.args[1], (#(set-child, child, child-cached)
          if parent-cached or child-cached
            func@ this,
              ParserNode.InternalCall \access, @index, @parser.scope.peek(),
                set-parent
                set-child
              ParserNode.InternalCall \access, @index, @parser.scope.peek(),
                parent
                child
              true
          else
            func@ this, node, node, false), child-name, save), parent-name, save
    else
      func@ this, node, node, false
  
  /**
   * Return whether a given node's type is a subset of the provided type name
   */
  def is-type(node, name as String)
    if node not instanceof ParserNode
      return false
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@parser).is-subset-of(type)
  
  /**
   * Return whether a given node's type overlaps with the provided type name
   */
  def has-type(node, name as String)
    if node not instanceof ParserNode
      return false
    let type = Type![name]
    if not type? or type not instanceof Type
      throw Error "$name is not a known type name"
    node.type(@parser).overlaps(type)

  /**
   * If `node` is a MacroAccess, then expand it, otherwise return the same node.
   */
  def macro-expand-1(node)
    if node instanceof ParserNode
      let expanded = @parser.macro-expand-1(node)
      if expanded instanceof ParserNode
        expanded.reduce(@parser)
      else
        expanded
    else
      node
  
  /**
   * Walk through node and all its subnodes, expanding any macros.
   */
  def macro-expand-all(node)
    if node instanceof ParserNode
      let expanded = @parser.macro-expand-all(node)
      if expanded instanceof ParserNode
        expanded.reduce(@parser)
      else
        expanded
    else
      node
  
  def get-tmps()
    unsaved: @unsaved-tmps.slice()
    saved: @saved-tmps.slice()

  def do-wrap(node)
    if node instanceof ParserNode
      node.do-wrap(@parser)
    else
      node
  
  def scope() -> @parser.scope.peek()

  def let(ident as Tmp|Ident, is-mutable as Boolean, mutable type as Type = Type.any)
    if ident instanceof Ident and is-mutable and type.is-subset-of(Type.undefined-or-null)
      type := Type.any
    @scope().add(ident, is-mutable, type)
  
  def var(ident as Tmp|Ident)
    ParserNode.InternalCall \var, @index, @scope(),
      ident
      ParserNode.Value @index, @is-variable-mutable(ident)
  def custom(name as String, ...data as [ParserNode])
    ParserNode.InternalCall(\custom, @index, @scope(),
      ParserNode.Value @index, name
      ...data).reduce(@parser)
  def block(nodes as [ParserNode])
    ParserNode.InternalCall(\block, @index, @scope(), ...nodes).reduce(@parser)
  def if(test as ParserNode = ParserNode.Symbol.nothing(0), when-true as ParserNode = ParserNode.Symbol.nothing(0), when-false as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\if, @index, @scope(),
      @do-wrap(test)
      when-true
      when-false).reduce(@parser)
  def switch(topic as ParserNode = ParserNode.Symbol.nothing(0), cases as [], default-case as ParserNode|null)
    let args = [
      @do-wrap(topic)
    ]
    for case_ in cases
      args.push(
        @do-wrap(case_.node)
        case_.body
        @const(case_.fallthrough))
    args.push default-case
    ParserNode.InternalCall(\switch, @index, @scope(),
      ...args).reduce(@parser)
  def for(init as ParserNode|null, test as ParserNode|null, step as ParserNode|null, body as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\for, @index, @scope(),
      @do-wrap(init)
      @do-wrap(test)
      @do-wrap(step)
      body).reduce(@parser)
  def for-in(key as Tmp|Ident, object as ParserNode = ParserNode.Symbol.nothing(0), body as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\for-in, @index, @scope(),
      key
      @do-wrap(object)
      body).reduce(@parser)
  def try-catch(try-body as ParserNode = ParserNode.Symbol.nothing(0), catch-ident as ParserNode = ParserNode.Symbol.nothing(0), catch-body as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\try-catch, @index, @scope(),
      try-body
      catch-ident
      catch-body).reduce(@parser)
  def try-finally(try-body as ParserNode = ParserNode.Symbol.nothing(0), finally-body as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\try-finally, @index, @scope(),
      try-body
      finally-body).reduce(@parser)
  def assign(left as ParserNode = ParserNode.Symbol.nothing(0), op as String, right as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.Call(@index, @scope()
      ParserNode.Symbol.assign[op] @index
      left
      @do-wrap(right)).reduce(@parser)
  def binary(left as ParserNode = ParserNode.Symbol.nothing(0), op as String, right as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.Call(@index, @scope()
      ParserNode.Symbol.binary[op] @index
      @do-wrap(left)
      @do-wrap(right)).reduce(@parser)
  def binary-chain(op as String, nodes as [ParserNode])
    if nodes.length == 0
      throw Error "Expected nodes to at least have a length of 1"
    let result = for reduce right in nodes[1 to -1], left = @do-wrap(nodes[0])
      ParserNode.Call(@index, @scope()
        ParserNode.Symbol.binary[op] @index
        left
        @do-wrap(right))
    result.reduce(@parser)
  def unary(op as String, node as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.Call(@index, @scope()
      ParserNode.Symbol.unary[op] @index
      @do-wrap(node)).reduce(@parser)
  def throw(node as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\throw, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def return(node as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\return, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def yield(node as ParserNode = ParserNode.Symbol.nothing(0))
    ParserNode.InternalCall(\yield, @index, @scope(),
      @do-wrap(node)).reduce(@parser)
  def debugger()
    ParserNode.InternalCall \debugger, @index, @scope()
  def break(label as Ident|Tmp|null)
    ParserNode.InternalCall \break, @index, @scope(),
      ...(if label then [label] else [])
  def continue(label as Ident|Tmp|null)
    ParserNode.InternalCall \continue, @index, @scope(),
      ...(if label then [label] else [])
  def spread(node as ParserNode)
    ParserNode.InternalCall \spread, @index, @scope(), node
  
  def real(mutable node)
    node := @macro-expand-1(node)
    if node instanceof ParserNode and node.is-internal-call(\tmp-wrapper)
      node.args[0]
    else
      node
  
  def rewrap(new-node, mutable old-node)
    if new-node instanceof ParserNode
      if old-node not instanceof ParserNode
        throw TypeError "Expected oldNode to be a ParserNode, got $(typeof! old-node)"
      old-node := @macro-expand-1(old-node)
      if old-node.is-internal-call(\tmp-wrapper)
        if new-node.is-internal-call(\tmp-wrapper)
          ParserNode.InternalCall \tmp-wrapper, new-node.index, new-node.scope,
            new-node.args[0]
            ...old-node.args[1 to -1]
            ...new-node.args[1 to -1]
        else
          ParserNode.InternalCall \tmp-wrapper, new-node.index, new-node.scope,
            new-node
            ...old-node.args[1 to -1]
      else
        new-node
    else
      new-node
  
  def eq(mutable alpha, mutable bravo)
    alpha := @real alpha
    bravo := @real bravo
    alpha == bravo or (alpha instanceof ParserNode and alpha.equals(bravo))
  
  def is-label(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\label)
  
  def is-break(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\break)
  def is-continue(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\continue)
  def is-return(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\return)
  def is-auto-return(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\auto-return)
  def auto-return(node)
    ParserNode.InternalCall \auto-return, node.index, node.scope, node
  def label(mutable node)
    node := @real(node)
    if node instanceof ParserNode and node.is-internal-call(\break, \continue, \label)
      node.args[0]
    else
      null

  def is-const(node) -> is-void! node or (node instanceof ParserNode and @real(node).is-const())
  def value(node)
    if is-void! node
      void
    else if node instanceof ParserNode
      let expanded = @real(node)
      if expanded.is-const()
        expanded.const-value()
  
  def is-spread(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\spread)
  def spread-subnode(mutable node)
    node := @real(node)
    if @is-spread(node)
      node.args[0]
  
  def is-ident(node) -> @real(node) instanceof Ident
  def is-tmp(node) -> @real(node) instanceof Tmp
  def is-ident-or-tmp(node) -> @real(node) instanceofsome [Ident, Tmp]
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
  
  def is-call(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-call and not node.is-internal-call()

  def is-context-call(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\context-call)
  
  def context-call(func as ParserNode, context as ParserNode, ...args as [ParserNode])
    ParserNode.InternalCall \context-call, @index, @scope(),
      func
      context
      ...args

  def is-new(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\new)
  
  def new(func as ParserNode, ...args as [ParserNode])
    ParserNode.InternalCall \new, @index, @scope(),
      func
      ...args

  def call-func(mutable node)
    node := @real(node)
    if @is-call(node)
      node.func
  
  def call-args(mutable node)
    node := @real(node)
    if @is-call(node)
      node.args
  
  def is-super(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\super)
  
  def super-child(mutable node)
    node := @real(node)
    if @is-super(node) and not @is-nothing(node.args[0])
      node.args[0]
  
  def super-args(mutable node)
    node := @real(node)
    if @is-super(node)
      node.args[1 to -1]
  
  def is-func(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\function)
  def func-body(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\function)
      node.args[1]
  def func-params(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\function)
      let params = node.args[0]
      if params.is-internal-call(\array)
        params.args
      else
        throw Error "For some reason, func params is not an array"
  def func-is-bound(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\function)
      let bound = node.args[2]
      if bound.is-const()
        bound.const-value()
      else
        false
  def func-as-type(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\function)
      let as-type = node.args[3]
      if as-type.is-symbol and as-type.is-internal and as-type.is-nothing
        void
      else
        as-type
  def func-is-generator(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\function)
      node.args[4].const-value()
  
  def param(ident as ParserNode, default-value as ParserNode|null, spread as Boolean, is-mutable as Boolean, as-type as ParserNode|null)
    ParserNode.InternalCall(\param, ident.index, ident.scope,
      ident
      default-value or ParserNode.Symbol.nothing ident.index
      ParserNode.Value ident.index, spread
      ParserNode.Value ident.index, is-mutable
      as-type or ParserNode.Symbol.nothing ident.index).reduce(@parser)
  
  def is-param(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\param)
  def param-ident(mutable node)
    node := @real node
    if @is-param node then node.args[0]
  def param-default-value(mutable node)
    node := @real node
    if @is-param node
      let default-value = node.args[1]
      if default-value.is-symbol and default-value.is-internal and default-value.is-nothing
        null
      else
        default-value
  def param-is-spread(mutable node)
    node := @real node
    if @is-param node then not not node.args[2].const-value()
  def param-is-mutable(mutable node)
    node := @real node
    if @is-param node then not not node.args[3].const-value()
  def param-type(mutable node)
    node := @real node
    if @is-param node
      let as-type = node.args[4]
      if as-type.is-symbol and as-type.is-internal and as-type.is-nothing
        null
      else
        as-type
  
  def is-array(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\array)
  def elements(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\array)
      node.args
  
  def array-has-spread(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\array)
      for some element in node.args
        @is-spread(element)
    else
      false
  
  def is-object(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\object)
  def pairs(mutable node)
    node := @real node
    if node instanceof ParserNode
      if node.is-internal-call(\type-object)
        return for i in 0 til node.args.length by 2
          { key: node.args[i], value: node.args[i + 1] }
      else if node.is-internal-call(\object)
        return for array in node.args[1 to -1]
          let pair = { key: array.args[0], value: array.args[1] }
          if array.args[2]
            pair.property := array.args[2].const-value()
          pair
  
  def is-block(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\block)
  def nodes(mutable node)
    node := @real node
    if @is-block node
      node.args[0 to -1]
  
  def array(elements as [ParserNode])
    ParserNode.InternalCall(\array, @index, @scope(),
      ...(for element in elements; @do-wrap(element))).reduce(@parser)
  def object(pairs as [], prototype as ParserNode|null)
    let array-pairs = for pair, i in pairs
      if pair instanceof ParserNode
        if pair.is-internal-call(\array)
          if pair.args.length not in [2, 3]
            throw Error "Expected object pair #$i to have a length of 2 or 3, got $(pair.args.length)"
          if pair.args.length == 3 and not pair.args[2].is-const-type(\string)
            throw Error "Expected object pair #$i to have a constant property type, got $(typeof! pair.args[2])"
          pair
        else
          throw Error "Exected object pair #$i to be an AST Array, got $(typeof! pair)"
      else if pair.constructor == Object
        let {key, value, property} = pair
        ParserNode.InternalCall(\array, @index, @scope(),
          @do-wrap(key)
          @do-wrap(value)
          ...(if property
            if is-string! property
              [ParserNode.Value @index, property]
            else if property instanceof ParserNode and property.is-const-type(\string)
              [property]
            else
              throw Error "Expected property in object pair #$i to be a string or a Value containing a string, got $(typeof! property)"
          else
            []))
      else
        throw Error "Expected object pair #$i to be an AST Array or a literal object, got $(typeof! pair)"
    ParserNode.InternalCall(\object, @index, @scope(),
      prototype or ParserNode.Symbol.nothing @index
      ...array-pairs).reduce(@parser)
  
  def type(node)
    if is-string! node
      Type![node] or throw Error "Unknown type $(node)"
    else if node instanceof ParserNode
      node.type(@parser)
    else
      throw Error "Can only retrieve type from a String or ParserNode, got $(typeof! node)"
  
  def to-type = node-to-type
  
  def is-complex(mutable node)
    node := @real node
    if not node?
      false
    else if node instanceof ParserNode
      node.cacheable
    else
      true
  
  def is-noop(mutable node)
    node := @real node
    node.is-noop(@parser)
  
  def is-nothing(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-symbol and node.is-internal and node.is-nothing
  
  def is-type-array(node)
    if @is-type-generic(node)
      let basetype = @basetype(node)
      basetype instanceof Ident and basetype.name == \Array
  def subtype(node)
    if @is-type-array(node)
      @type-arguments(node)[0]
  
  def is-type-generic(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\type-generic)
  def basetype(mutable node)
    node := @real node
    if @is-type-generic(node)
      node.args[0]
  def type-arguments(mutable node)
    node := @real node
    if @is-type-generic(node)
      node.args[1 to -1]
  
  def is-type-object(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\type-object)
  
  def is-type-union(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\type-union)
  def types(mutable node)
    node := @real node
    @is-type-union(node) and node.args
  
  def is-this(mutable node)
    node := @real node
    node instanceof ParserNode and node.is-ident and node.name == \this
  def is-arguments(mutable node)
    node := @real node
    node instanceof ParserNode and node.is-ident and node.name == \arguments

  def is-custom(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\custom)
  def is-assign(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-assign-call()
  def is-binary(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-binary-call()
  def is-unary(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-unary-call()
  def op(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-call and node.func.is-symbol and node.func.is-operator
      node.func.name
  def left(mutable node)
    node := @real node
    if node instanceof ParserNode and (node.is-binary-call() or node.is-assign-call())
      node.args[0]
  def right(mutable node)
    node := @real node
    if node instanceof ParserNode and (node.is-binary-call() or node.is-assign-call())
      node.args[1]
  def unary-node(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-unary-call()
      node.args[0]

  def is-access(mutable node)
    node := @real node
    node instanceof ParserNode and node.is-internal-call(\access)
  def parent(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\access)
      node.args[0]
  def child(mutable node)
    node := @real node
    if node instanceof ParserNode and node.is-internal-call(\access)
      node.args[1]
  
  def is-if(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\if)
  def test(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\if) and node.args[0]
  def when-true(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\if) and node.args[1]
  def when-false(mutable node)
    node := @real(node)
    node instanceof ParserNode and node.is-internal-call(\if) and node.args[2]
  
  def empty(node)
    if not node?
      true
    else if node instanceof ParserNode
      if node.is-internal-call(\block)
        for every item in node.args by -1; @empty(item)
      else
        @is-nothing(node)
    else
      false
  
  let constify-object(position, obj, index, scope as Scope)
    if obj == null or typeof obj in [\string, \number, \boolean, \undefined]
      ParserNode.Value index, obj
    else if obj instanceof RegExp
      ParserNode.InternalCall \new, obj.index, scope,
        Ident obj.index, scope, \RegExp
        ParserNode.Value index, obj.source
        ParserNode.Value index, "$(if obj.global then 'g' else '')$(if obj.ignore-case then 'i' else '')$(if obj.multiline then 'm' else '')$(if obj.sticky then 'y' else '')"
    else if is-array! obj
      ParserNode.InternalCall \array, index, scope,
        ...(for item in obj
          constify-object position, item, index, scope)
    else if obj instanceof ParserNode
      switch obj.node-type-id
      case ParserNodeTypeId.Value
        ParserNode.Call obj.index, scope,
          Ident obj.index, scope, \__value
          position or ParserNode.Value obj.index, void
          obj
      case ParserNodeTypeId.Symbol
        if obj.is-ident and obj.name.length > 1 and obj.name.char-code-at(0) == '$'.char-code-at(0)
          ParserNode.Call obj.index, scope,
            Ident obj.index, scope, \__wrap
            Ident obj.index, scope, obj.name.substring 1
        else
          ParserNode.Call obj.index, scope,
            Ident obj.index, scope, \__symbol
            position or ParserNode.Value obj.index, void
            ...(switch obj.symbol-type-id
            case ParserNodeSymbolTypeId.Ident
              [
                ParserNode.Value obj.index, \ident
                ParserNode.Value obj.index, obj.name
              ]
            case ParserNodeSymbolTypeId.Tmp
              [
                ParserNode.Value obj.index, \tmp
                ParserNode.Value obj.index, obj.id
                ParserNode.Value obj.index, obj.name
              ]
            case ParserNodeSymbolTypeId.Internal
              [
                ParserNode.Value obj.index, \internal
                ParserNode.Value obj.index, obj.name
              ]
            case ParserNodeSymbolTypeId.Operator
              [
                ParserNode.Value obj.index, \operator
                ParserNode.Value obj.index, obj.operator-type
                ParserNode.Value obj.index, obj.name
              ])
      case ParserNodeTypeId.Call
        if obj.is-internal-call(\macro-const)
          ParserNode.Call obj.index, scope,
            Ident obj.index, scope, \__const
            obj.args[0]
        else if obj.func instanceof Ident and obj.func.name == '$'
          if obj.args.length != 1
            throw Error "Can only use \$() in an AST if it has one argument."
          let arg = obj.args[0]
          if arg.is-internal-call(\spread)
            throw Error "Cannot use ... in \$() in an AST."
          ParserNode.Call obj.index, scope,
            Ident obj.index, scope, \__wrap
            arg
        else
          ParserNode.Call obj.index, scope,
            Ident obj.index, scope, \__call
            position or ParserNode.Value obj.index, void
            constify-object position, obj.func, index, scope
            ...(for arg in obj.args
              constify-object position, arg, index, scope)
      case ParserNodeTypeId.MacroAccess
        ParserNode.Call obj.index, scope,
          Ident obj.index, scope, \__macro
          position or ParserNode.Value obj.index, void
          ParserNode.Value obj.index, obj.id
          constify-object position, obj.data, obj.index, scope
          ParserNode.Value obj.index, obj.in-statement
          ParserNode.Value obj.index, obj.in-generator
          ParserNode.Value obj.index, obj.in-evil-ast
          ParserNode.Value obj.index, obj.do-wrapped
    else if obj.constructor == Object
      ParserNode.InternalCall \object, index, scope,
        ParserNode.Symbol.nothing index
        ...(for k, v of obj
          ParserNode.InternalCall \array, index, scope,
            ParserNode.Value index, k
            constify-object position, v, index, scope)
    else
      throw Error "Trying to constify a $(typeof! obj)"
  @constify-object := constify-object
  
  def wrap(value)
    if not value?
      ParserNode.Symbol.nothing @index
    else if typeof value in [\string, \boolean, \number]
      ParserNode.Value @index, value
    else if value instanceof ParserNode
      value
    else if is-array! value
      ParserNode.InternalCall(\block, @index, @scope(), ...value).reduce(@parser)
    else
      value//throw Error "Trying to wrap an unknown object: $(typeof! value)"
  
  def make-lispy-value(from-position, value)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    ParserNode.Value index, value
  
  def make-lispy-symbol(from-position, symbol-type, ...args)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    switch symbol-type
    case \internal
      ParserNode.Symbol[args[0]](index)
    case \ident
      ParserNode.Symbol.ident(index, @scope(), args[0])
    case \tmp
      ParserNode.Symbol.tmp(index, @scope(), args[0], args[1])
    case \operator
      ParserNode.Symbol[args[0]][args[1]](index)
  
  def make-lispy-call(from-position, func, ...args)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    ParserNode.Call index, @scope(), func, ...args

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
      ParserNode.Value 0, obj
    else if is-array! obj
      ParserNode.InternalCall \array, 0, @scope(),
        ...(for item in obj
          to-literal-node@ this, item)
    else if obj.constructor == Object
      ParserNode.InternalCall \object, 0, @scope(),
        ParserNode.Symbol.nothing 0
        ...(for k, v of obj
          ParserNode.InternalCall \array, 0, @scope(),
            to-literal-node@ this, k
            to-literal-node@ this, v)
    else
      throw Error "Cannot convert $(typeof! obj) to a literal node"
  
  def get-const(name as String)
    to-literal-node@ this, @get-const-value(name)
  
  def macro(from-position, id, data, position, in-generator, in-evil-ast)
    let index = if from-position and is-number! from-position.index
      from-position.index
    else
      @index
    ParserNode.MacroAccess(index, @scope(), id, data, position, in-generator or @parser.in-generator.peek(), in-evil-ast).reduce(@parser)
  
  let walk(node, func)
    if not is-object! node or node instanceof RegExp
      return node
    
    if node not instanceof ParserNode
      throw Error "Unexpected type to walk through: $(typeof! node)"
    unless node.is-internal-call(\block)
      return? func@ this, node
    node.walk (#(x) -> walk@ this, x, func), this
  
  def walk(node as ParserNode|void|null, func as ParserNode -> ParserNode)
    if node?
      walk@ this, node, func
    else
      node
  
  def is-statement(mutable node)
    node := @macro-expand-1 node // TODO: should this be macro-expand-all?
    node instanceof ParserNode and node.is-statement()

module.exports := MacroContext