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
      args).reduce(@parser)

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
      ParserNode.InternalCall \array, body.index, scope.parent, params
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
          if node.is-internal-call \function
            true
          else if node.is-normal-call() and (node.func.is-internal-call \function or (node.func.is-internal-call(\access) and node.func.args[0].is-internal-call(\function) and node.func.args[1].is-const-value(\call, \apply) and node.args[0].is-ident and node.args[0].name == \this))
            for some arg in [...node.func.args, ...node.args]
              @has-func arg
          else if node.is-internal-call(\context-call) and node.args[0].is-internal-call(\function) and node.args[1].is-ident and node.args[1].name == \this
            for some arg in [...node.args[0].args, ...node.args[2 to -1]]
              @has-func arg
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
          node.do-wrap(@parser)
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
  
  /**
   * Return whether the provided node, when standalone, is essentially a
   * non-operation. This includes any symbol or any internal call that can be
   * determined to be a noop.
   */
  def is-noop(mutable node)
    node := @real node
    node.is-noop(@parser)
  
  /**
   * Dynamically retrieve the value of a const within the current scope.
   * If `default-value` is not provided and the const does not exist, an error
   * is thrown.
   */
  def get-const-value(name, default-value)
    unless is-string! name
      throw TypeError "Expected name to be a String, got $(typeof! name)"
    let c = @parser.get-const(name)
    if not c
      if arguments.length < 2
        @error "Unknown const '$name'"
      else
        default-value
    else
      c.value
  
  def get-tmps()
    unsaved: @unsaved-tmps.slice()
    saved: @saved-tmps.slice()
  
  def scope() -> @parser.scope.peek()
  
  def real(mutable node)
    node := @macro-expand-1(node)
    if node instanceof ParserNode and node.is-internal-call(\tmp-wrapper)
      node.args[0]
    else
      node
  
  def type(node)
    if is-string! node
      Type![node] or throw Error "Unknown type $(node)"
    else if node instanceof ParserNode
      node.type(@parser)
    else
      throw Error "Can only retrieve type from a String or ParserNode, got $(typeof! node)"
  
  def to-type = node-to-type
  
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
        for item in obj
          constify-object position, item, index, scope
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
            [
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
            ]
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
            [
              position or ParserNode.Value obj.index, void
              constify-object position, obj.func, index, scope
              ...(for arg in obj.args
                constify-object position, arg, index, scope)
            ]
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
      ParserNode.InternalCall \object, index, scope, [
        ParserNode.Symbol.nothing index
        ...for k, v of obj
          ParserNode.InternalCall \array, index, scope,
            ParserNode.Value index, k
            constify-object position, v, index, scope
      ]
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
      ParserNode.InternalCall(\block, @index, @scope(), value).reduce(@parser)
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
    ParserNode.Call index, @scope(), func, args

  let to-literal-node(obj)
    if is-null! obj or typeof obj in [\undefined, \boolean, \number, \string]
      ParserNode.Value 0, obj
    else if is-array! obj
      ParserNode.InternalCall \array, 0, @scope(),
        for item in obj
          to-literal-node@ this, item
    else if obj.constructor == Object
      ParserNode.InternalCall \object, 0, @scope(), [
        ParserNode.Symbol.nothing 0
        ...(for k, v of obj
          ParserNode.InternalCall \array, 0, @scope(),
            to-literal-node@ this, k
            to-literal-node@ this, v)
      ]
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

module.exports := MacroContext