import 'shared.gs'
let {to-JS-source} = require './jsutils'
require! Type: './types'
let {Cache, is-primordial} = require './utils'
let {node-to-type} = require './parser-utils'

let capitalize(value as String)
  value.char-at(0).to-upper-case() & value.substring(1)

let is-primitive(value)
  is-null! value or typeof value in [\number, \string, \boolean, \undefined]

/**
 * Base class for the other nodes, not intended to be used on its own
 */
class Node
  def constructor()
    throw Error "Node is not intended to be initialized directly"
  
  def is-value = false
  def is-symbol = false
  def is-call = false
  def is-macro-access = false
  
  def is-noop
  def is-const() -> false
  def const-value() -> throw Error("Not a const: $(typeof! this)")
  def is-const-value() -> false
  def is-const-type() -> false
  def is-const-truthy() -> false
  def is-const-falsy() -> false
  def is-literal() -> @is-const()
  def literal-value() -> @const-value()
  def is-statement() -> false
  def do-wrap() -> this
  def type() -> Type.any
  def walk() -> this
  def walk-async(f, context, callback)! -> callback null, this
  def walk-with-this(f, context) -> f@(context, this) ? @walk f, context
  def walk-with-this-async(f, context, callback)!
    f@ context, #(err, value)@!
      if err
        callback err
      else if value?
        callback null, value
      else
        @walk-async f, context, callback
  def is-internal-call() -> false
  def is-unary-call() -> false
  def is-binary-call() -> false
  def is-assign-call() -> false
  def is-normal-call() -> false
  def do-wrap-args = true
  def convert-nothing() -> this

  def return-type(parser, is-last)
    if is-last
      Type.undefined
    else
      Type.none
  
  def mutate-last(o, func, context, include-noop)
    func@(context, this) ? this

  def with-label(label)
    if not label
      this
    else
      InternalCall \label, @index, @scope,
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

/**
 * Represents a constant primitive value such as a number, string, boolean,
 * void, or null.
 */
class Value extends Node
  def constructor(@index as Number, @value as Number|String|Boolean|void|null) ->
  
  def is-value = true
  def node-type = \value
  def node-type-id = ParserNodeTypeId.Value
  
  def cacheable = false
  def reduce() -> this
  def is-noop() -> true
  def const-value() -> @value
  def is-const() -> true
  def is-const-value(value) -> value == @value
  def is-const-type(type) -> type == typeof @value
  def is-const-truthy() -> not not @value
  def is-const-falsy() -> not @value
  
  def equals(other)
    other == this or (other instanceof Value and @value is other.value)
  
  def type()
    let value = @value
    if value == null
      Type.null
    else
      switch typeof value
      case \number; Type.number
      case \string; Type.string
      case \boolean; Type.boolean
      case \undefined; Type.undefined
  
  def inspect()
    "Value($(to-JS-source @value))"

  def to-string()
    let value = @value
    if value is NaN
      "NaN"
    else
      switch value
      case void
        "void"
      case null
        "null"
      case Infinity
        "Infinity"
      case -Infinity
        "-Infinity"
      default
        to-JS-source value

/**
 * Represents a reference of some kind, such as a named or unnamed (i.e. tmp)
 * local binding, a global operator (e.g. `+`) or binding (e.g. `String`), or
 * a compiler-internal (e.g. `new`)
 */
class Symbol extends Node
  def constructor()
    throw Error "Symbol is not intended to be instantiated directly"
  
  def is-symbol = true
  def node-type = \symbol
  def node-type-id = ParserNodeTypeId.Symbol

  def is-noop() -> true
  def is-ident = false
  def is-tmp = false
  def is-ident-or-tmp = false
  def is-internal = false
  def is-operator = false

  def reduce() -> this
  def cacheable = false
  
  /**
   * Represents an compiler-internal such as `new` or `apply`
   */
  class Internal extends Symbol
    def constructor()
      throw Error "Internal is not intended to be instantiated directly"
    
    def inspect()
      "Symbol.$(@name)"

    def to-string()
      "$(@name)!"
    
    def is-internal = true
    def symbol-type = \internal
    def symbol-type-id = ParserNodeSymbolTypeId.Internal

    def is-goto = false
    def used-as-statement = false
    
    let internal-symbols =
      access: {
        internal-id: ParserNodeInternalId.Access
        validate-args: #(parent as Node, child as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to access"
        _to-string(call)
          let sb = []
          sb.push call.args[0]
          let key = call.args[1]
          if key.is-const-type(\string) and r'^[\w\$_][\w\d\$_]*$'.test key.const-value()
            sb.push "."
            sb.push key.const-value()
          else
            sb.push "["
            sb.push key
            sb.push "]"
          sb.join ""
        _type: do
          let PRIMORDIAL_STATIC_PROPERTIES =
            Object:
              getPrototypeOf: Type.object.function().union(Type.undefined)
              getOwnPropertyDescriptor: Type.object.function().union(Type.undefined)
              getOwnPropertyNames: Type.string.array().function().union(Type.undefined)
              create: Type.object.function().union(Type.undefined)
              defineProperty: Type.object.function().union(Type.undefined)
              defineProperties: Type.object.function().union(Type.undefined)
              seal: Type.object.function().union(Type.undefined)
              freeze: Type.object.function().union(Type.undefined)
              preventExtensions: Type.object.function().union(Type.undefined)
              isSealed: Type.boolean.function().union(Type.undefined)
              isFrozen: Type.boolean.function().union(Type.undefined)
              isExtensible: Type.boolean.function().union(Type.undefined)
              keys: Type.string.array().function().union(Type.undefined)
            String:
              fromCharCode: Type.string.function()
            Number:
              isFinite: Type.boolean.function().union(Type.undefined)
              isNaN: Type.boolean.function().union(Type.undefined)
            Array:
              isArray: Type.boolean.function().union(Type.undefined)
            Math:
              abs: Type.number.function()
              acos: Type.number.function()
              asin: Type.number.function()
              atan: Type.number.function()
              atan2: Type.number.function()
              ceil: Type.number.function()
              cos: Type.number.function()
              exp: Type.number.function()
              floor: Type.number.function()
              imul: Type.number.function().union(Type.undefined)
              log: Type.number.function()
              max: Type.number.function()
              min: Type.number.function()
              pow: Type.number.function()
              random: Type.number.function()
              round: Type.number.function()
              sin: Type.number.function()
              sqrt: Type.number.function()
              tan: Type.number.function()
            JSON:
              stringify: Type.string.union(Type.undefined).function().union(Type.undefined)
              parse: Type.string.union(Type.number).union(Type.boolean).union(Type.null).union(Type.array).union(Type.object).function().union(Type.undefined)
            Date:
              UTC: Type.number.function().union(Type.undefined)
              now: Type.number.function().union(Type.undefined)
          let PRIMORDIAL_INSTANCE_PROPERTIES =
            Object:
              toString: Type.string.function()
              toLocaleString: Type.string.function()
            String:
              valueOf: Type.string.function()
              charAt: Type.string.function()
              charCodeAt: Type.number.function()
              concat: Type.string.function()
              indexOf: Type.number.function()
              lastIndexOf: Type.number.function()
              localeCompare: Type.number.function()
              match: Type.array.union(Type.null).function()
              replace: Type.string.function()
              search: Type.number.function()
              slice: Type.string.function()
              split: Type.string.array().function()
              substring: Type.string.function()
              toLowerCase: Type.string.function()
              toLocaleLowerCase: Type.string.function()
              toUpperCase: Type.string.function()
              toLocaleUpperCase: Type.string.function()
              trim: Type.string.function()
              length: Type.number
            Boolean:
              valueOf: Type.boolean.function()
            Number:
              valueOf: Type.number.function()
              toFixed: Type.string.function()
              toExponential: Type.string.function()
              toPrecision: Type.string.function()
            Array:
              length: Type.number
              join: Type.string.function()
              pop: Type.any.function()
              push: Type.number.function()
              concat: Type.array.function()
              reverse: Type.array.function()
              shift: Type.any.function()
              unshift: Type.number.function()
              slice: Type.array.function()
              splice: Type.array.function()
              sort: Type.array.function()
              filter: Type.array.function().union(Type.undefined)
              forEach: Type.undefined.function().union(Type.undefined)
              some: Type.boolean.function().union(Type.undefined)
              every: Type.boolean.function().union(Type.undefined)
              map: Type.array.function().union(Type.undefined)
              indexOf: Type.number.function()
              lastIndexOf: Type.number.function()
              reduce: Type.any.function().union(Type.undefined)
              reduceRight: Type.any.function().union(Type.undefined)
            Arguments:
              length: Type.number
              callee: Type.none
              caller: Type.none
            Date:
              toDateString: Type.string.function()
              toTimeString: Type.string.function()
              toLocaleDateString: Type.string.function()
              toLocaleTimeString: Type.string.function()
              valueOf: Type.number.function()
              getTime: Type.number.function()
              getFullYear: Type.number.function()
              getUTCFullYear: Type.number.function()
              getMonth: Type.number.function()
              getUTCMonth: Type.number.function()
              getDate: Type.number.function()
              getUTCDate: Type.number.function()
              getDay: Type.number.function()
              getUTCDay: Type.number.function()
              getHours: Type.number.function()
              getUTCHours: Type.number.function()
              getMinutes: Type.number.function()
              getUTCMinutes: Type.number.function()
              getSeconds: Type.number.function()
              getUTCSeconds: Type.number.function()
              getMilliseconds: Type.number.function()
              getUTCMilliseconds: Type.number.function()
              getTimezoneOffset: Type.number.function()
              setTime: Type.number.function()
              setMilliseconds: Type.number.function()
              setUTCMilliseconds: Type.number.function()
              setSeconds: Type.number.function()
              setUTCSeconds: Type.number.function()
              setMinutes: Type.number.function()
              setUTCMinutes: Type.number.function()
              setHours: Type.number.function()
              setUTCHours: Type.number.function()
              setDate: Type.number.function()
              setUTCDate: Type.number.function()
              setMonth: Type.number.function()
              setUTCMonth: Type.number.function()
              setFullYear: Type.number.function()
              setUTCFullYear: Type.number.function()
              toUTCString: Type.string.function()
              toISOString: Type.string.function()
              toJSON: Type.string.function()
            RegExp:
              exec: Type.array.union(Type.null).function()
              test: Type.boolean.function()
              global: Type.boolean
              ignoreCase: Type.boolean
              multiline: Type.boolean
              sticky: Type.boolean.union(Type.undefined)
            Error:
              name: Type.string
              message: Type.string
              stack: Type.any
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let [parent, mutable child] = call.args
              if parser
                child := parser.macro-expand-1(child).reduce(parser)
              let parent-type = parent.type(parser)
              if child.is-const()
                let child-value = child.const-value()
                if parent instanceof Ident and PRIMORDIAL_STATIC_PROPERTIES ownskey parent.name
                  let property-types = PRIMORDIAL_STATIC_PROPERTIES[parent.name]
                  if property-types ownskey child-value
                    return property-types[child-value]
                  
                let method-group = switch
                case parent-type.is-subset-of Type.string
                  PRIMORDIAL_INSTANCE_PROPERTIES.String
                case parent-type.is-subset-of Type.boolean
                  PRIMORDIAL_INSTANCE_PROPERTIES.Boolean
                case parent-type.is-subset-of Type.number
                  PRIMORDIAL_INSTANCE_PROPERTIES.Number
                case parent-type.is-subset-of Type.array
                  PRIMORDIAL_INSTANCE_PROPERTIES.Array
                case parent-type.is-subset-of Type.date
                  PRIMORDIAL_INSTANCE_PROPERTIES.Date
                case parent-type.is-subset-of Type.regexp
                  PRIMORDIAL_INSTANCE_PROPERTIES.RegExp
                case parent-type.is-subset-of Type.error
                  PRIMORDIAL_INSTANCE_PROPERTIES.Error
                default
                  void
                if method-group and method-group ownskey child-value
                  return method-group[child-value]

                if PRIMORDIAL_INSTANCE_PROPERTIES.Object ownskey child-value
                  return PRIMORDIAL_INSTANCE_PROPERTIES.Object[child-value]

                if parent-type.is-subset-of(Type.object) and is-function! parent-type.value
                  let type = parent-type.value(String child.const-value())
                  if type != Type.any
                    return type

              if child.type(parser).is-subset-of(Type.number)
                if parent-type.is-subset-of(Type.string)
                  return Type.string.union(Type.undefined)
                if parent-type.subtype and parent-type.is-subset-of(Type.array)
                  return parent-type.subtype

              Type.any
        __reduce(call, parser)
          let mutable parent = call.args[0]
          let mutable cached-parent = null
          let replace-length-ident(node)
            if node instanceof Ident and node.name == CURRENT_ARRAY_LENGTH_NAME
              if parent.cacheable and not cached-parent?
                cached-parent := parser.make-tmp node.index, \ref, parent.type(parser)
                cached-parent.scope := node.scope
              Call node.index, node.scope,
                Symbol.access node.index
                cached-parent ? parent
                Value node.index, \length
            else if node instanceof Node and node.is-internal-call(\access)
              node
            else
              node.walk replace-length-ident
          let child = replace-length-ident call.args[1].reduce(parser)
          if cached-parent?
            return Call call.index, call.scope,
              Symbol.tmp-wrapper call.index
              Call call.index, call.scope,
                Symbol.access call.index
                Call call.index, call.scope,
                  Symbol.assign["="] call.index
                  cached-parent
                  parent
                child
              Value call.index, cached-parent.id
          
          if parent.is-literal() and child.is-const()
            let c-value = child.const-value()
            if parent.is-const()
              let p-value = parent.const-value()
              if Object(p-value) haskey c-value
                let value = p-value[c-value]
                if is-null! value or typeof value in [\string, \number, \boolean, \undefined]
                  return Value call.index, value
            else if parent instanceof Node and parent.is-internal-call()
              if parent.func.is-array
                // TODO: verify there are no spread arguments
                if c-value == \length
                  return Value @index, parent.args.length
                else if is-number! c-value
                  return parent.args[c-value] or Value @index, void
              else if parent.func.is-object
                for pair in parent.args[1 to -1]
                  if pair.args[0].is-const-value(c-value) and not pair.args[2]
                    return pair.args[1]
          
          if child instanceof Call and child.func instanceof Ident and child.func.name == \__range
            let [start, mutable end, step, inclusive] = child.args
            let has-step = not step.is-const() or step.const-value() != 1
            if not has-step
              if inclusive.is-const()
                if inclusive.const-value()
                  end := if end.is-const() and is-number! end.const-value()
                    Value end.index, end.const-value() + 1 or Infinity
                  else
                    Call end.index, end.scope,
                      Symbol.binary["||"] end.index
                      Call end.index, end.scope,
                        Symbol.binary["+"] end.index
                        end
                        Value inclusive.index, 1
                      Value end.index, Infinity
              else
                end := Call end.index, end.scope,
                  Symbol.if end.index
                  inclusive
                  Call end.index, end.scope,
                    Symbol.binary["||"] end.index
                    Call end.index, end.scope,
                      Symbol.binary["+"] end.index
                      end
                      Value inclusive.index, 1
                    Value end.index, Infinity
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

            if has-step
              Call(call.index, call.scope,
                Ident call.index, call.scope, \__slice-step
                ...args).reduce(parser)
            else
              Call(call.index, call.scope,
                Symbol.context-call call.index
                Ident call.index, call.scope, \__slice
                ...args).reduce(parser)
          else if child != call.args[1]
            Call(call.index, call.scope,
              call.func
              parent
              child)

        ___reduce: do
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
          #(access, call, parser)
            let [parent, child] = access.args
            if child.is-const()
              let const-args = []
              for arg in call.args
                if arg.is-const()
                  const-args.push arg.const-value()
                else
                  // can't reduce if arguments are non-constant
                  return
              let child-value = child.const-value()
              if parent.is-const()
                let parent-value = parent.const-value()
                if is-function! parent-value[child-value]
                  let value = try
                    parent-value[child-value] ...const-args
                  catch
                    // TODO: do something here to alert the user?
                    return
                  if is-primitive value
                    Value call.index, value
              else if parent instanceof Ident and PURE_PRIMORDIAL_SUBFUNCTIONS ownskey parent.name and PURE_PRIMORDIAL_SUBFUNCTIONS[parent.name] ownskey child-value
                let value = try
                  GLOBAL[parent.name][child-value] ...const-args
                catch
                  // TODO: do something here to alert the user?
                  return
                if is-primitive value
                  Value call.index, value
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[0].is-noop(parser) and call.args[1].is-noop(parser)
      }
      array: {
        internal-id: ParserNodeInternalId.Array
        validate-args(...args as [Node]) ->
        _to-string(call)
          let sb = []
          sb.push "["
          sb.push call.args.join ", "
          sb.push "]"
          sb.join ""
        _type() Type.array
        _is-literal: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, for every element in call.args; element.is-literal()
        _literal-value(call)
          return for element in call.args
            element.literal-value()
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, for every element in call.args; element.is-noop(parser)
      }
      auto-return: {
        internal-id: ParserNodeInternalId.AutoReturn
        -do-wrap-args
        validate-args(node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to return"
        +is-goto
        +used-as-statement
        _return-type(call, parser, is-last)
          call.args[0].return-type(parser, false).union call.args[0].type(parser)
      }
      block: {
        internal-id: ParserNodeInternalId.Block
        -do-wrap-args
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let args = call.args
              if args.length == 0
                Type.undefined
              else
                // we go through all the types in case there is any macro expansion
                for node in args[0 til -1]
                  node.type(parser)
                args[* - 1].type(parser)
        _return-type(call, parser, is-last)
          for reduce arg, i, len in call.args, current = Type.none
            current.union arg.return-type(parser, is-last and i == len - 1)
        _with-label(call, label, parser)
          let args = call.args
          let len = args.length
          if len == 1
            return args[0].with-label label parser
          else if len > 1
            let last = args[len - 1]
            if last instanceof Node and last.is-internal-call(\for-in)
              if for every node in args[0 til -1]; node instanceof Node and (node.is-internal-call(\var) or node.is-assign-call())
                return Call call.index, call.scope,
                  call.func
                  ...args[0 til -1]
                  last.with-label label, parser
          Call call.index, call.scope,
            Symbol.label call.index
            label
            call
        __reduce: do
          let squish-body(mutable body)
            let mutable changed = false
            for i in body.length - 1 til 0 by -1
              let current = body[i]
              let previous = body[i - 1]
              if previous.is-assign-call("=") and not (previous.args[0].is-ident-or-tmp and not previous.scope.is-mutable(previous.args[0]) and previous.args[1].is-internal-call(\function))
                if previous.args[0].equals(current)
                  // convert (a = b, a) to (a = b)
                  if not changed
                    body := body.slice()
                    changed := true
                  body.splice i, 1
                else if current.is-assign-call() and previous.args[0].equals(current.args[1])
                  unless current.args[0].is-internal-call(\access) and current.args[0].args[0].equals(previous.args[0])
                    // convert (a = b, c op= a) to (c op= a = b)
                    if not changed
                      body := body.slice()
                      changed := true
                    body.splice i - 1, 2, Call current.index, current.scope,
                      current.func
                      current.args[0]
                      previous
            body
          #(call, parser)
            let mutable changed = false
            let mutable body = []
            let args = call.args
            for node, i, len in args
              if node instanceof Symbol.nothing or (i < len - 1 and node.is-const())
                changed := true
              else if node instanceof Node and node.is-internal-call()
                if node.func.is-block
                  body.push ...node.args
                  changed := true
                else if node.func.is-goto
                  body.push node
                  if i < len - 1
                    changed := true
                  break
                else
                  body.push node
              else
                body.push node
            let new-body = squish-body body
            if new-body != body
              changed := true
              body := new-body
            switch body.length
            case 0
              Symbol.nothing @index
            case 1
              body[0]
            default
              if changed
                Call @index, @scope,
                  call.func
                  ...body
        _is-statement: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, for some node in call.args; node.is-statement()
        _mutate-last(call, parser, func, context, include-noop)
          let args = call.args
          let len = args.length
          if len == 0
            Symbol.nothing(@index).mutate-last parser, func, context, include-noop
          else
            let last-node = args[len - 1].mutate-last parser, func, context, include-noop
            if last-node != args[len - 1]
              Call @index, @scope,
                call.func
                ...args[0 til -1]
                last-node
            else
              call
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, for every node in call.args; node.is-noop(parser)
      }
      break: {
        internal-id: ParserNodeInternalId.Break
        -do-wrap-args
        validate-args(label as Node|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to break"
        +is-goto
        +used-as-statement
      }
      comment: {
        internal-id: ParserNodeInternalId.Comment
        -do-wrap-args
        validate-args(text as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to comment"
      }
      context-call: {
        internal-id: ParserNodeInternalId.ContextCall
        validate-args(func as Node, context as Node) ->
        _type(call, parser)
          let func = call.args[0]
          if is-function! func._type
            let fake-call = Call call.index, call.scope, ...call.args
            func._type(fake-call, parser)
          else
            Type.any
      }
      continue: {
        internal-id: ParserNodeInternalId.Continue
        -do-wrap-args
        validate-args(label as Node|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to continue"
        +is-goto
        +used-as-statement
      }
      custom: {
        internal-id: ParserNodeInternalId.Custom
        -do-wrap-args
        validate-args(name as Value, ...rest as [Node]) ->
      }
      debugger: {
        internal-id: ParserNodeInternalId.Debugger
        -do-wrap-args
        validate-args(...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to debugger"
        +used-as-statement
      }
      embed-write: {
        internal-id: ParserNodeInternalId.EmbedWrite
        -do-wrap-args
        validate-args(text as Node, escape as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to embed-write"
      }
      for: {
        internal-id: ParserNodeInternalId.For
        -do-wrap-args
        validate-args(init as Node, test as Node, step as Node, body as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for"
        +used-as-statement
        _return-type(call, parser, is-last)
          let type = if is-last then Type.undefined else Type.none
          type.union call.args[3].return-type(parser, false)
      }
      for-in: {
        internal-id: ParserNodeInternalId.ForIn
        -do-wrap-args
        validate-args(key as Node, object as Node, body as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for-in"
        +used-as-statement
        _return-type(call, parser, is-last)
          let type = if is-last then Type.undefined else Type.none
          type.union call.args[2].return-type(parser, false)
      }
      function: {
        internal-id: ParserNodeInternalId.Function
        -do-wrap-args
        validate-args(params as Node, body as Node, bound as Node, as-type as Node, is-generator as Value)
          if not params.is-internal-call(\array)
            throw Error "Expected params to be an internal Array call, got $(typeof! params)"
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call,
              if call.args[3] and call.args[3] not instanceof Symbol.nothing
                node-to-type(call.args[3]).function()
              else if call.args[4].const-value()
                Type.generator
              else
                call.args[1].return-type(parser, true).function()
        _is-noop() true
      }
      if: {
        internal-id: ParserNodeInternalId.If
        -do-wrap-args
        validate-args(test as Node, when-true as Node, when-false as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to if"
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[1].type(parser).union(call.args[2].type(parser))
        _return-type(call, parser, is-last)
          call.args[1].return-type(parser, is-last).union call.args[2].return-type(parser, is-last)
        _is-statement: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, call.args[1].is-statement() or call.args[2].is-statement()
        _do-wrap(call, parser)
          let when-true = call.args[1].do-wrap(parser)
          let when-false = call.args[2].do-wrap(parser)
          if when-true != call.args[1] or when-false != call.args[2]
            Call call.index, call.scope,
              call.func
              call.args[0]
              when-true
              when-false
          else
            call
        __reduce(call, parser)
          let [mutable test, when-true, when-false] = call.args
          if test.is-const()
            if test.const-value()
              when-true
            else
              when-false
          else
            let test-type = test.type(parser)
            if test-type.is-subset-of(Type.always-truthy)
              Call(call.index, call.scope,
                Symbol.block call.index
                test
                when-true).reduce(parser)
            else if test-type.is-subset-of(Type.always-falsy)
              Call(call.index, call.scope,
                Symbol.block call.index
                test
                when-false).reduce(parser)
            else
              let wrapped-test = test.do-wrap(parser)
              if wrapped-test != test
                Call(call.index, call.scope,
                  call.func
                  wrapped-test
                  when-true
                  when-false)
        _mutate-last(call, parser, mutator, context, include-noop)
          let when-true = call.args[1].mutate-last(parser, mutator, context, include-noop)
          let when-false = call.args[2].mutate-last(parser, mutator, context, include-noop)
          if when-true != call.args[1] or when-false != call.args[2]
            Call call.index, call.scope,
              call.func
              call.args[0]
              when-true
              when-false
          else
            call
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, for every arg in call.args; arg.is-noop(parser)
      }
      label: {
        internal-id: ParserNodeInternalId.Label
        -do-wrap-args
        validate-args(label as Node, node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to label"
        +used-as-statement
      }
      macro-const: {
        internal-id: ParserNodeInternalId.MacroConst
        -do-wrap-args
        validate-args(name as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to macro-const"
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let c = o.get-const(call.args[0].const-value())
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
        _is-noop() true
      }
      new: {
        internal-id: ParserNodeInternalId.New
        validate-args(ctor as Node) ->
        _type: do
          let PRIMORDIAL_CONSTRUCTOR_TYPES = {
            Array: Type.array
            Function: Type.function
            Boolean: Type.object
            String: Type.object
            Number: Type.object
            RegExp: Type.regexp
            Date: Type.date
            Error: Type.error
            RangeError: Type.error
            ReferenceError: Type.error
            SyntaxError: Type.error
            TypeError: Type.error
            URIError: Type.error
          }
          #(call, parser)
            let ctor = call.args[0]
            if ctor instanceof Ident
              let name = ctor.name
              if PRIMORDIAL_CONSTRUCTOR_TYPES ownskey name
                return PRIMORDIAL_CONSTRUCTOR_TYPES[name]
            Type.not-undefined-or-null
      }
      nothing: {
        internal-id: ParserNodeInternalId.Nothing
        type: # Type.undefined
        const-value: # void
        is-const-type: (\undefined ==)
        is-const: # true
        is-const-value: (void ==)
        is-const-truthy: # false
        is-const-falsy: # true
        is-noop: # true
        mutate-last(parser, func, context, include-noop)
          if include-noop
            func@(context, this) ? this
          else
            this
        convert-nothing(value)
          if is-function! value
            value()
          else
            value
      }
      object: {
        internal-id: ParserNodeInternalId.Object
        validate-args(prototype as Node, ...pairs)!
          if DEBUG
            for pair, i in pairs
              if pair not instanceof Node or not pair.is-internal-call(\array)
                throw TypeError("Expected pair #$i to be an AST Array, got $(typeof! pair)")
              else if pair.args.length not in [2, 3]
                throw TypeError("Expected pair #$i to have a length of 2 or 3, got $(pair.args.length)")
              else if pair.args[2] and not pair.args[2].is-const-type(\string)
                throw TypeError("Expected pair #$i to have its 3rd item be a string, got $(typeof! pair.args[2])")
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let data = {}
              for pair in call.args[1 to -1]
                if pair.args.length == 2 and pair.args[0].is-const()
                  data[pair.args[0].const-value()] := if pair.args[1].is-const() and not pair.args[1].const-value()?
                    Type.any
                  else
                    pair.args[1].type(parser)
              Type.make-object data
        _is-literal: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, call.args[0] instanceof Symbol.nothing and for every arg in call.args[1 to -1]
              arg.args.length == 2 and arg.args[0].is-const() and arg.args[1].is-literal()
        _literal-value(call)
          if call.args[0] not instanceof Symbol.nothing
            throw Error "Cannot convert object with prototype to a literal"
          let result = {}
          for pair in call.args[1 to -1]
            result[pair.args[0].const-value()] := pair.args[1].literal-value()
          result
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, for every arg in call.args; arg.is-noop(parser)
        _to-string(call)
          let prototype = if call.args[0] not instanceof Symbol.nothing then call.args[0] else null
          if not prototype and call.args.length <= 1
            "{}"
          else
            let sb = []
            sb.push "{ "
            if prototype
              sb.push "extends $(prototype.to-string()); "
            for pair, i in call.args[1 to -1]
              if i > 1
                sb.push ", "
              if pair.args.length == 3
                sb.push pair.args[2].const-value()
                sb.push " "
              if pair.args[0].is-const-type \string
                let const-key = pair.args[0].const-value()
                sb.push if r'^[\w\$_][\w\d\$_]*$'.test const-key
                  const-key
                else
                  to-JS-source const-key
              else
                sb.push "["
                sb.push pair.args[0]
                sb.push "]"
              sb.push ": "
              sb.push pair.args[1]
            sb.push " }"
            sb.join ""
      }
      param: {
        internal-id: ParserNodeInternalId.Param
        -do-wrap-args
        validate-args(ident as Node, default-value as Node, is-spread as Value, is-mutable as Value, as-type as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to param"
      }
      return: {
        internal-id: ParserNodeInternalId.Return
        -do-wrap-args
        validate-args(node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to return"
        +is-goto
        +used-as-statement
        _return-type(call, parser)
          call.args[0].return-type(parser, false).union call.args[0].type(parser)
      }
      root: {
        internal-id: ParserNodeInternalId.Root
        -do-wrap-args
        validate-args(file as Value, body as Node, is-embedded as Value, is-generator as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to return"
        +used-as-statement
      }
      spread: {
        internal-id: ParserNodeInternalId.Spread
        validate-args(node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to spread"
        _to-string(call)
          "...$(call.args[0].to-string())"
      }
      switch: {
        internal-id: ParserNodeInternalId.Switch
        -do-wrap-args
        validate-args(...args as [Node])
          if DEBUG
            let len = args.length
            if len % 3 != 2
              throw Error "Unexpected number of arguments, got $len"
        +used-as-statement
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let args = call.args
              let len = args.length
              let mutable current = Type.none
              // case-bodies
              for i in 2 til len - 1 by 3
                // check fallthrough
                unless args[i + 1].const-value()
                  current := current.union args[i].type(parser)
              // default-case
              current.union args[len - 1].type(parser)
        _return-type(call, parser, is-last)
          let args = call.args
          let len = args.length
          let mutable current = Type.none
          for i in 2 til len - 1 by 3
            current := current.union args[i].return-type(parser, false)
          current.union args[len - 1].return-type(parser, is-last)
        _mutate-last(call, parser, mutator, context, include-noop)
          let args = call.args
          let len = args.length
          let mutable changed = false
          let new-args = []
          new-args.push args[0] // topic
          for i in 1 til len - 1 by 3
            new-args.push args[i] // case node
            if args[i + 2].const-value()
              // fallthrough
              new-args.push args[i + 1]
            else
              let body = args[i + 1]
              let new-body = body.mutate-last parser, mutator, context, include-noop
              changed or= body != new-body
              new-args.push new-body
            new-args.push args[i + 2]
          let default-case = args[* - 1]
          let new-default-case = default-case.mutate-last parser, mutator, context, include-noop
          changed or= default-case != new-default-case
          new-args.push new-default-case
          if changed
            Call call.index, call.scope,
              call.func
              ...new-args
          else
            call
      }
      super: {
        internal-id: ParserNodeInternalId.Super
        validate-args(child as Node) ->
      }
      syntax-choice: {
        internal-id: ParserNodeInternalId.SyntaxChoice
        -do-wrap-args
      }
      syntax-lookahead: {
        internal-id: ParserNodeInternalId.SyntaxLookahead
        -do-wrap-args
        validate-args(negated as Value, node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to syntax-lookahead"
      }
      syntax-many: {
        internal-id: ParserNodeInternalId.SyntaxMany
        -do-wrap-args
        validate-args(node as Node, multiplier as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to syntax-many"
      }
      syntax-param: {
        internal-id: ParserNodeInternalId.SyntaxParam
        -do-wrap-args
        validate-args(node as Node, as-type as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to syntax-param"
      }
      syntax-sequence: {
        internal-id: ParserNodeInternalId.SyntaxSequence
        -do-wrap-args
      }
      throw: {
        internal-id: ParserNodeInternalId.Throw
        validate-args(node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to throw"
        _type()
          Type.none
        _return-type()
          Type.none
        +is-goto
        +used-as-statement
        _do-wrap(call, parser)
          Call call.index, call.scope,
            Ident call.index, call.scope, \__throw
            call.args[0]
      }
      tmp-wrapper: {
        internal-id: ParserNodeInternalId.TmpWrapper
        -do-wrap-args
        _is-statement(call)
          call.args[0].is-statement()
        validate-args(node as Node, ...tmp-ids as [Value]) ->
        _type(call, parser)
          call.args[0].type parser
        _return-type(call, parser, is-last)
          call.args[0].return-type parser, is-last
        _with-label(call, label, parser)
          let labelled = call.args[0].with-label label, parser
          if labelled != call.args[0]
            Call call.index, call.scope,
              call.func
              labelled
              ...call.args[1 to -1]
          else
            call
        _do-wrap(call, parser)
          let wrapped = call.args[0].do-wrap parser
          if wrapped != call.args[0]
            Call call.index, call.scope,
              call.func
              wrapped
              ...call.args[1 to -1]
          else
            call
        _mutate-last(call, parser, func, context, include-noop)
          let mutated = call.args[0].mutate-last parser, func, context, include-noop
          if mutated != call.args[0]
            Call call.index, call.scope,
              call.func
              mutated
              ...call.args[1 to -1]
          else
            call
        _is-noop(call, parser)
          call.args[0].is-noop(parser)
      }
      try-catch: {
        internal-id: ParserNodeInternalId.TryCatch
        -do-wrap-args
        validate-args(try-body as Node, catch-ident as Node, catch-body as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-catch"
        +used-as-statement
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[0].type(parser).union(call.args[2].type(parser))
        _return-type(call, parser, is-last)
          call.args[0].return-type(parser, is-last).union call.args[2].return-type(parser, is-last)
        _mutate-last(call, parser, mutator, context, include-noop)
          let try-body = call.args[0].mutate-last(parser, mutator, context, include-noop)
          let catch-body = call.args[2].mutate-last(parser, mutator, context, include-noop)
          if try-body != call.args[0] or catch-body != call.args[2]
            Call call.index, call.scope,
              call.func
              try-body
              call.args[1]
              catch-body
          else
            call
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[0].is-noop(parser) and call.args[2].is-noop(parser)
      }
      try-finally: {
        internal-id: ParserNodeInternalId.TryFinally
        -do-wrap-args
        validate-args(try-body as Node, finally-body as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-finally"
        +used-as-statement
        _type(call, parser)
          call.args[0].type parser
        _return-type(call, parser, is-last)
          call.args[0].return-type(parser, false).union call.args[1].return-type(parser, is-last)
        _mutate-last(call, parser, mutator, context, include-noop)
          let try-body = call.args[0].mutate-last(parser, mutator, context, include-noop)
          if try-body != call.args[0]
            Call call.index, call.scope,
              call.func
              try-body
              call.args[1]
          else
            call
        _is-noop: do
          let cache = Cache<Call, Boolean>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[0].is-noop(parser) and call.args[1].is-noop(parser)
      }
      type-generic: {
        internal-id: ParserNodeInternalId.TypeGeneric
        -do-wrap-args
        validate-args(node as Node, arg as Node) ->
      }
      type-object: {
        internal-id: ParserNodeInternalId.TypeObject
        -do-wrap-args
        validate-args(...args)
          if DEBUG
            if args.length not %% 2
              throw Error "Expected an even number of arguments, got $(args.length)"
            for i in 0 til args.length by 2
              if args[i] not instanceof Value
                throw TypeError "Expected argument #$i to be a Value, got $(typeof! args[i])"
              if args[i + 1] not instanceof Node
                throw TypeError "Expected argument #$i to be a Value, got $(typeof! args[i])"
      }
      type-union: {
        internal-id: ParserNodeInternalId.TypeUnion
        -do-wrap-args
      }
      var: {
        internal-id: ParserNodeInternalId.Var
        -do-wrap-args
        validate-args(node as Node, is-mutable as Node|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to var"
      }
      yield: {
        internal-id: ParserNodeInternalId.Yield
        validate-args(node as Node, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to yield"
      }
    for name, data of internal-symbols
      let is-name-key = "is$(capitalize name)"
      def [is-name-key] = false
      Symbol[name] := class Symbol_name extends Internal
        def constructor(@index as Number) ->
        
        def name = name
        @display-name := "Symbol.$name"
        
        def equals(other)
          other == this or other instanceof Symbol_name
        def [is-name-key] = true
        for k, v of data
          def [k] = v
  
  /**
   * Represents a named binding
   */
  class Ident extends Symbol
    def constructor(@index as Number, @scope, @name as String) ->
    
    def is-ident = true
    def is-ident-or-tmp = true
    def symbol-type = \ident
    def symbol-type-id = ParserNodeSymbolTypeId.Ident
    
    def inspect()
      "Symbol.ident($(to-JS-source @name))"

    def to-string()
      @name
    
    def equals(other)
      other == this or (other instanceof Ident and @scope == other.scope and @name == other.name)

    def type(parser)
      let name = @name
      switch name
      case CURRENT_ARRAY_LENGTH_NAME
        Type.number
      case \arguments
        Type.args
      default
        let type = @scope.type(this)
        if type == Type.any and parser and parser.macros.has-helper name
          parser.macros.helper-type name
        else
          type

    let PRIMORDIAL_FUNCTION_RETURN_TYPES =
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
    def _type(call, parser)
      let name = @name
      if PRIMORDIAL_FUNCTION_RETURN_TYPES ownskey name
        PRIMORDIAL_FUNCTION_RETURN_TYPES[name]
      else
        @type(parser).return-type()

    // if eval(key) is called, automatically turn it into the known value
    // this allows us to do const true = eval("true")
    let EVAL_SIMPLIFIERS = {
      true: #(index) Value index, true
      false: #(index) Value index, false
      "void 0": #(index) Value index, void
      null: #(index) Value index, null
      "-1": #(index) Value index, -1
    }
    // if all arguments are constant, then these side-effect-free calls can be
    // reduced at compile-time.
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
    }
    def __reduce(call, parser)
      let name = @name
      if name == \eval
        if call.args.length == 1 and call.args[0].is-const()
          let eval-arg = call.args[0].const-value()
          if EVAL_SIMPLIFIERS ownskey eval-arg
            EVAL_SIMPLIFIERS[eval-arg] call.index
      else if PURE_PRIMORDIAL_FUNCTIONS ownskey name
        let const-args = []
        for arg in call.args
          if arg.is-const()
            const-args.push arg.const-value()
          else
            // one of the args isn't constant, so we can't reduce at compile-time
            return
        try
          let value = GLOBAL[func.name]@ void, ...const-args
          if is-null! value or typeof value in [\number, \string, \boolean, \undefined]
            Value @index, value
        catch
          // TODO: do something here to alert the user?
          void

    def is-noop() true
    def is-primordial() is-primordial(@name)

    Symbol.ident := Ident
  
  /**
   * Represents a temporary identifier
   */
  class Tmp extends Symbol
    def constructor(@index as Number, @scope, @id as Number, @name as String) ->
    
    def is-tmp = true
    def is-ident-or-tmp = true
    def symbol-type = \tmp
    def symbol-type-id = ParserNodeSymbolTypeId.Tmp
    
    def inspect()
      "Symbol.tmp($(@id), $(to-JS-source @name))"

    def to-string()
      "_$(@name)-$(@id)"
    
    def equals(other)
      other == this or (other instanceof Tmp and @scope == other.scope and @id == other.id)
    
    def type(parser)
      @scope.type(this)

    Symbol.tmp := Tmp
  
  /**
   * Represents a JavaScript unary or binary operator
   */
  class Operator extends Symbol
    def constructor()
      throw Error "Operator is not meant to be instantiated directly"
    
    def is-operator = true
    def is-binary = false
    def is-unary = false
    def is-assign = false
    def symbol-type = \operator
    def symbol-type-id = ParserNodeSymbolTypeId.Operator
    
    def equals(other)
      other == this or (other instanceof @constructor)
    
    def to-string()
      @name

    class BinaryOperator extends Operator
      def constructor()
        throw Error "UnaryOperator is not meant to be instantiated directly"
      
      def is-binary = true
      def operator-type = \binary
      def operator-type-id = ParserNodeOperatorTypeId.Binary
      
      def inspect()
        "Symbol.binary[$(to-JS-source @name)]"
      
      def validate-args(left as Node, right as Node, ...rest)
        if DEBUG and rest.length > 0
          throw Error "Too many arguments to binary operator $(@name)"

      def _to-string(call)
        "($(call.args[0].to-string()) $(@name) $(call.args[1].to-string()))"
      
      def _is-noop = do
        let cache = Cache<Call, Boolean>()
        #(call, parser)
          cache-get-or-add! cache, call, call.args[0].is-noop(parser) and call.args[1].is-noop(parser)
      
      let remove-unary-plus(node)
        if node instanceof Call and node.is-unary-call("+")
          node.args[0]
        else
          node
      
      let left-const-nan(call, left, right)
        if left.const-value() is NaN
          Call call.index, call.scope,
            Symbol.block call.index
            right
            left
      let right-const-nan(call, left, right)
        if right.const-value() is NaN
          Call call.index, call.scope,
            Symbol.block call.index
            left
            right
      Symbol.binary := {
        "*": class Multiply extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "*"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~* right.const-value()
              else
                switch left.const-value()
                case 1
                  return Call call.index, call.scope,
                    Symbol.unary["+"] call.index
                    right
                case -1
                  return Call call.index, call.scope,
                    Symbol.unary["-"] call.index
                    right
                default
                  return? left-const-nan call, left, right
            else if right.is-const()
              switch right.const-value()
              case 1
                return Call call.index, call.scope,
                  Symbol.unary["+"] call.index
                  left
              case -1
                return Call call.index, call.scope,
                  Symbol.unary["-"] call.index
                  left
              default
                return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "/": class Divide extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "/"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~/ right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              switch right.const-value()
              case 1
                return Call call.index, call.scope,
                  Symbol.unary["+"] call.index
                  left
              case -1
                return Call call.index, call.scope,
                  Symbol.unary["-"] call.index
                  left
              default
                return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "%": class Modulo extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "%"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~% right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "+": class AddOrStringConcat extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "+"
          def _type = do
            let cache = Cache<Call, Type>()
            #(call, parser)
              cache-get-or-add! cache, call, do
                let left = call.args[0].type(parser)
                let right = call.args[1].type(parser)
                if left.is-subset-of(Type.numeric) and right.is-subset-of(Type.numeric)
                  Type.number
                else if left.overlaps(Type.numeric) and right.overlaps(Type.numeric)
                  Type.string-or-number
                else
                  Type.string
          let is-JS-numeric(x)
            is-null! x or typeof x in [\number, \boolean, \undefined]
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            if left.is-const()
              if right.is-const()
                return Value call.index, (if is-JS-numeric(left.const-value()) and is-JS-numeric(right.const-value())
                  left.const-value() ~+ right.const-value()
                else
                  left.const-value() ~& right.const-value())
              else
                if left.is-const-value(0) and right.type(parser).is-subset-of(Type.numeric)
                  return Call call.index, call.scope,
                    Symbol.unary["+"] call.index
                    right
                else if left.is-const-value("") and right.type(parser).is-subset-of(Type.string)
                  return right
                else if left.is-const-type(\string) and right instanceof Call and right.is-binary-call("+") and right.args[0].is-const-type(\string)
                  return Call call.index, call.scope,
                    call.func
                    Value left.index, left.const-value() & right.args[0].const-value()
                    right.args[1]
                else
                  return? left-const-nan call, left, right
            else if right.is-const()
              if right.is-const-value(0) and left.type(parser).is-subset-of(Type.number)
                return Call call.index, call.scope,
                  Symbol.unary["+"] call.index
                  left
              else if right.is-const-type(\number) and right.const-value() < 0 and left.type(parser).is-subset-of(Type.numeric)
                return Call call.index, call.scope,
                  Subtract call.index
                  left
                  Value right.index, -right.const-value()
              else if right.is-const-value("") and left.type(parser).is-subset-of(Type.string)
                return left
              else if right.is-const-type(\string) and left instanceof Call and left.is-binary-call("+") and left.args[1].is-const-type(\string)
                return Call call.index, call.scope,
                  call.func
                  left.args[0]
                  Value left.args[1].index, left.args[1].const-value() & right.const-value()
              else
                return? right-const-nan call, left, right
              
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "-": class Subtract extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "-"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~- right.const-value()
              else if left.is-const-value(0)
                return Call call.index, call.scope,
                  Symbol.unary["-"] call.index
                  right
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              if right.is-const-value(0)
                return Call call.index, call.scope,
                  Symbol.unary["+"] call.index
                  right
              else if right.is-const-type(\number) and right.const-value() < 0 and left.type(parser).is-subset-of(Type.numeric)
                return Call call.index, call.scope,
                  AddOrStringConcat call.index
                  left
                  Value right.index, -right.const-value()
              else
                return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "<<": class BitwiseLeftShift extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "<<"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~bitlshift right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        ">>": class BitwiseRightShift extends BinaryOperator
          def constructor(@index as Number) ->
          def name = ">>"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~bitrshift right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        ">>>": class BitwiseUnsignedRightShift extends BinaryOperator
          def constructor(@index as Number) ->
          def name = ">>>"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~biturshift right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "&": class BitwiseAnd extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "&"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~bitand right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "|": class BitwiseOr extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "|"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~bitor right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "^": class BitwiseXor extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "^"
          def _type() Type.number
          def __reduce(call, parser)
            let left = remove-unary-plus call.args[0].reduce(parser)
            let right = remove-unary-plus call.args[1].reduce(parser)
            
            if left.is-const()
              if right.is-const()
                return Value call.index, left.const-value() ~bitxor right.const-value()
              else
                return? left-const-nan call, left, right
            else if right.is-const()
              return? right-const-nan call, left, right
            if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "<": class LessThan extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "<"
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() ~< right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "<=": class LessThanOrEqual extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "<="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() ~<= right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        ">": class GreaterThan extends BinaryOperator
          def constructor(@index as Number) ->
          def name = ">"
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() ~> right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        ">=": class GreaterThanOrEqual extends BinaryOperator
          def constructor(@index as Number) ->
          def name = ">="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() ~>= right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "==": class UnstrictEqual extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "=="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() ~= right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "!=": class UnstrictInequal extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "!="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() !~= right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "===": class StrictEqual extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "==="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() == right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "!==": class StrictInequal extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "!=="
          def _type() Type.boolean
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const() and right.is-const()
              Value call.index, left.const-value() != right.const-value()
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        instanceof: class Instanceof extends BinaryOperator
          def constructor(@index as Number) ->
          def name = \instanceof
          def _type() Type.boolean
        
        in: class HasKey extends BinaryOperator
          def constructor(@index as Number) ->
          def name = \in
          def _type() Type.boolean
        
        "&&": class LogicalAnd extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "&&"
          def _type = do
            let cache = Cache<Call, Type>()
            #(call, parser)
              cache-get-or-add! cache, call, call.args[0].type(parser).intersect(Type.potentially-falsy).union(call.args[1].type(parser))
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const()
              return return if left.const-value()
                right
              else
                left
            
            let left-type = left.type(parser)
            if left-type.is-subset-of(Type.always-truthy)
              Call call.index, call.scope,
                Symbol.block call.index,
                left
                right
            else if left-type.is-subset-of(Type.always-falsy)
              left
            else if left instanceof Call and left.is-binary-call("&&")
              // (((a && b) && c) && d) turns into (a && (b && (c && d)))
              Call call.index, call.scope,
                left.func
                left.args[0]
                Call left.args[1].index, call.scope,
                  call.func
                  left.args[1]
                  right
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
        
        "||": class LogicalOr extends BinaryOperator
          def constructor(@index as Number) ->
          def name = "||"
          def _type = do
            let cache = Cache<Call, Type>()
            #(call, parser)
              cache-get-or-add! cache, call, call.args[0].type(parser).intersect(Type.potentially-truthy).union(call.args[1].type(parser))
          
          def __reduce(call, parser)
            let left = call.args[0].reduce(parser)
            let right = call.args[1].reduce(parser)
            
            if left.is-const()
              return if left.const-value()
                left
              else
                right
            
            let left-type = left.type(parser)
            if left-type.is-subset-of(Type.always-truthy)
              left
            else if left-type.is-subset-of(Type.always-falsy)
              Call call.index, call.scope,
                Symbol.block call.index,
                left
                right
            else if left instanceof Call and left.is-binary-call("||")
              // (((a || b) || c) || d) turns into (a || (b || (c || d)))
              Call call.index, call.scope,
                left.func
                left.args[0]
                Call left.args[1].index, call.scope,
                  call.func
                  left.args[1]
                  right
            else if left instanceof Call and left.is-internal-call(\if) and left.args[2].is-const() and not left.args[2].const-value()
              // (a ? b : false) || c turns into (a && b) || c
              let mutable test = left.args[0]
              let mutable when-true = left.args[1]
              while when-true instanceof Call and when-true.is-internal-call(\if) and when-true.args[2].is-const() and not when-true.args[2].const-value()
                test := Call left.index, left.scope,
                  Symbol.binary["&&"] left.index
                  test
                  when-true.args[0]
                when-true := when-true.args[1]
              Call call.index, call.scope,
                call.func
                Call left.index, left.scope,
                  Symbol.binary["&&"] left.index
                  test
                  when-true
                right
            else if left != call.args[0] or right != call.args[1]
              Call call.index, call.scope,
                call.func
                left
                right
            else
              call
      }
    
    class UnaryOperator extends Operator
      def constructor()
        throw Error "UnaryOperator is not meant to be instantiated directly"
      
      def is-unary = true
      def operator-type = \unary
      def operator-type-id = ParserNodeOperatorTypeId.Unary
      
      def inspect()
        "Symbol.unary[$(to-JS-source @name)]"
      
      def validate-args(node as Node, ...rest)
        if DEBUG and rest.length > 0
          throw Error "Too many arguments to unary operator $(@name)"
      
      let noop-unary(call, parser)
        call.args[0].is-noop(parser)
      
      let symbolic-to-string(call)
        "($(@name)$(call.args[0].to-string()))"

      let wordy-to-string(call)
        "$(@name) $(call.args[0].to-string())"

      Symbol.unary := {
        "+": class ToNumber extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "+"
          def _to-string = symbolic-to-string
          def _type() Type.number
          def _is-noop = noop-unary
          def __reduce(call, parser)
            let node = call.args[0].reduce(parser)
            if node.is-const()
              Value call.index, ~+node.const-value()
            else if node.type(parser).is-subset-of(Type.number)
              node
            else if node != call.args[0]
              Call call.index, call.scope,
                call.func
                node
            else
              call

        "-": class Negate extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "-"
          def _to-string = symbolic-to-string
          def _type() Type.number
          def _is-noop = noop-unary
          def __reduce(call, parser)
            let node = call.args[0].reduce(parser)
            if node.is-const()
              return Value call.index, ~-node.const-value()
            else if node instanceof Call
              if node.func instanceofsome [ToNumber, Negate]
                return Call call.index, call.scope,
                  if node.func instanceof ToNumber
                    Negate call.index
                  else
                    ToNumber call.index
                  node.args[0]
              else if node.func instanceof BinaryOperator
                if node.func.name in ["-", "+"]
                  return Call call.index, call.scope,
                    Symbol.binary[if node.func.name == "-" then "+" else "-"] call.index
                    Call node.args[0].index, node.args[0].scope,
                      Negate node.args[0].index
                      node.args[0]
                    node.args[1]
                else if node.func.name in ["*", "/"]
                  return Call call.index, call.scope,
                    node.func
                    Call node.args[0].index, node.args[0].scope,
                      Negate node.args[0].index
                      node.args[0]
                    node.args[1]
            if node != call.args[0]
              Call call.index, call.scope,
                call.func
                node
            else
              call
        
        "++": class Increment extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "++"
          def _to-string = symbolic-to-string
          def _type() Type.number
        
        "--": class Decrement extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "--"
          def _to-string = symbolic-to-string
          def _type() Type.number
        
        "++post": class PostIncrement extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "++post"
          def _to-string(call)
            "($(call.args[0].to-string())++)"
          def _type() Type.number
      
        "--post": class PostDecrement extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "--post"
          def _to-string(call)
            "($(call.args[0].to-string())--)"
          def _type() Type.number
      
        "!": class Not extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "!"
          def _to-string = symbolic-to-string
          def _type() Type.boolean
          def _is-noop = noop-unary
        
          let invertible-binary-ops =
            "<": ">="
            "<=": ">"
            ">": "<="
            ">=": "<"
            "==": "!="
            "!=": "=="
            "===": "!=="
            "!==": "==="
            "&&": #(x, y) -> Call @index, @scope,
              Symbol.binary["||"] @index
              Call x.index, x.scope,
                Not x.index
                x
              Call y.index, y.scope,
                Not y.index
                y
            "||": #(x, y) -> Call @index, @scope,
              Symbol.binary["&&"] @index
              Call x.index, x.scope,
                Not x.index
                x
              Call y.index, y.scope,
                Not y.index
                y
          def __reduce(call, parser)
            let node = call.args[0].reduce(parser)
            if node.is-const()
              return Value call.index, not node.const-value()
            else if node instanceof Call
              if node.func instanceof Not
                if node.args[0].type(parser).is-subset-of(Type.boolean)
                  return node.args[0]
              else if node.func instanceof BinaryOperator
                if invertible-binary-ops ownskey node.func.name
                  let invert = invertible-binary-ops[node.func.name]
                  return if is-function! invert
                    invert@ call, node.args[0], node.args[1]
                  else
                    Call call.index, call.scope,
                      Symbol.binary[invert] call.index
                      node.args[0]
                      node.args[1]
            if node != call.args[0]
              Call call.index, call.scope,
                call.func
                node
            else
              call
      
        "~": class BitwiseNot extends UnaryOperator
          def constructor(@index as Number) ->
          def name = "~"
          def _to-string = symbolic-to-string
          def _type() Type.number
          def _is-noop = noop-unary
          def __reduce(call, parser)
            let node = call.args[0].reduce(parser)
            if node.is-const()
              Value call.index, ~bitnot node.const-value()
            else if node != call.args[0]
              Call call.index, call.scope,
                call.func
                node
            else
              call
      
        typeof: class Typeof extends UnaryOperator
          def constructor(@index as Number) ->
          def name = \typeof
          def _to-string = wordy-to-string
          def _type() Type.string
          def _is-noop = noop-unary
        
          let object-type = Type.null
            .union(Type.object)
            .union(Type.array-like)
            .union(Type.regexp)
            .union(Type.date)
            .union(Type.error)
          def __reduce(call, parser)
            let node = call.args[0].reduce(parser)
            if node.is-const()
              return Value call.index, typeof node.const-value()
            else if node.is-noop(parser)
              let type = node.type(parser)
              switch
              case type.is-subset-of Type.number
                return Value call.index, \number
              case type.is-subset-of Type.string
                return Value call.index, \string
              case type.is-subset-of Type.boolean
                return Value call.index, \boolean
              case type.is-subset-of Type.undefined
                return Value call.index, \undefined
              case type.is-subset-of Type.function
                return Value call.index, \function
              case type.is-subset-of object-type
                return Value call.index, \object
              default
                void
            if node != call.args[0]
              Call call.index, call.scope,
                call.func
                node
            else
              call
        
        delete: class Delete extends UnaryOperator
          def constructor(@index as Number) ->
          def name = \delete
          def _to-string = wordy-to-string
          def _type() Type.boolean
      }
    
    class AssignOperator extends Operator
      def constructor(@index as Number, @name as String) ->
      
      def is-assign = true
      def operator-type = \assign
      def operator-type-id = ParserNodeOperatorTypeId.Assign
      
      def inspect()
        "Symbol.assign[$(to-JS-source @name)]"
      
      def validate-args(left as Node, right as Node, ...rest)
        if DEBUG and rest.length > 0
          throw Error "Too many arguments to assign operator $(@name)"
      
      def _to-string(call)
        "$(call.args[0].to-string()) $(@name) $(call.args[1].to-string())"

      Symbol.assign := {
        "=": class NormalAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "="
          def _type(call, parser)
            call.args[1].type(parser)
        
        "+=": class AddOrStringConcatAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "+="
          def _type = do
            let cache = Cache<Call, Type>()
            #(call, parser)
              cache-get-or-add! cache, call, do
                let left = call.args[0].type(parser)
                let right = call.args[1].type(parser)
                if left.is-subset-of(Type.numeric) and right.is-subset-of(Type.numeric)
                  Type.number
                else if left.overlaps(Type.numeric) and right.overlaps(Type.numeric)
                  Type.string-or-number
                else
                  Type.string
        
        "-=": class SubtractAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "-="
          def _type() Type.number
        
        "*=": class MultiplyAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "*="
          def _type() Type.number
        
        "/=": class DivideAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "/="
          def _type() Type.number
        
        "%=": class ModuloAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "%="
          def _type() Type.number
        
        "<<=": class BitwiseLeftShiftAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "<<="
          def _type() Type.number
        
        ">>=": class BitwiseRightShiftAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = ">>="
          def _type() Type.number
        
        ">>>=": class BitwiseUnsignedRightShiftAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = ">>>="
          def _type() Type.number
        
        "&=": class BitwiseAndAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "&="
          def _type() Type.number
        
        "|=": class BitwiseOrAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "|="
          def _type() Type.number
        
        "^=": class BitwiseXorAssign extends AssignOperator
          def constructor(@index as Number) ->
          def name = "^="
          def _type() Type.number
      }

class Call extends Node
  def constructor(@index as Number, @scope, @func as Node, mutable ...args)
    while args.length == 1 and is-array! args[0]
      args := args[0]
    @args := args
    if DEBUG
      for arg, i in args
        if arg not instanceof Node
          throw TypeError "Expected args[$i] to be a Node, got $(typeof! arg)"
      if is-function! func.validate-args
        func.validate-args ...args
  
  def is-call = true
  def node-type = \call
  def node-type-id = ParserNodeTypeId.Call
  
  def cacheable = true
  
  def inspect(depth)
    let depth-1 = if depth? then depth - 1 else null
    let sb = []
    sb.push "Call("
    sb.push "\n  "
    sb.push @func.inspect(depth-1).split("\n").join("\n  ")
    for arg in @args
      sb.push ",\n  "
      sb.push arg.inspect(depth-1).split("\n").join("\n  ")
    sb.push ")"
    sb.join ""

  def to-string()
    if is-function! @func._to-string
      @func._to-string this
    else
      let sb = []
      sb.push @func
      sb.push "("
      for arg, i in @args
        if i > 0
          sb.push ", "
        sb.push arg
      sb.push ")"
      sb.join ""
  
  def equals(other)
    if other == this
      return true
    unless other instanceof Call and @func.equals(other.func)
      false
    else
      let args = @args
      let other-args = other.args
      let len = args.length
      if len != other-args.length
        false
      else
        for arg, i in args
          unless arg.equals(other-args[i])
            return false
        true
  
  def type(parser)
    let reduced = @reduce(parser)
    if reduced == this
      let func = @func
      if is-function! func._type
        return? func._type this, parser
      func.type(parser).return-type()
    else
      reduced.type(parser)

  def _type(call, parser)
    if is-function! @func.__type
      @func.__type this, call, parser

  def return-type(parser, is-last)
    let reduced = @reduce(parser)
    if reduced == this
      let func = @func
      if is-function! func._return-type
        return? func._return-type this, parser, is-last
      super.return-type(parser, is-last)
    else
      reduced.return-type(parser, is-last)
  
  def _reduce(parser)
    let mutable reduced = @walk #(x) -> x.reduce(this), parser
    if reduced.func.do-wrap-args
      reduced := reduced.walk #(x) -> x.do-wrap(this), parser
    if is-function! reduced.func.__reduce
      return? reduced.func.__reduce reduced, parser
    reduced

  def __reduce(call, parser)
    if is-function! @func.___reduce
      @func.___reduce this, call, parser
  
  def walk(walker, context)
    let func = walker@(context, @func) or @func.walk(walker, context)
    let args = []
    let mutable changed-args = false
    for arg in @args
      let new-arg = walker@(context, arg) or arg.walk(walker, context)
      changed-args or= new-arg != arg
      args.push new-arg
    if func != @func or changed-args
      Call @index, @scope, func, ...args
    else
      this
  def walk-async(walker, context, callback)!
    async! callback, func <- walker@ context, @func
    let mutable changed-args = false
    asyncfor err, args <- next, arg in @args
      async! next, new-arg <- walker@ context, arg
      changed-args or= new-arg != arg
      next null, new-arg
    if err
      callback err
    else if func != @func or changed-args
      callback null, Call @index, @scope, func, ...args
    else
      callback null, this
  
  def is-literal()
    if is-function! @func._is-literal
      @func._is-literal(this)
    else
      false
  
  def literal-value()
    if is-function! @func._literal-value
      @func._literal-value(this)
    else
      super.literal-value()
  
  def is-noop(parser)
    let self = @reduce(parser)
    if is-function! self.func._is-noop
      self.func._is-noop(self, parser)
    else
      false
  
  def is-statement()
    let func = @func
    if is-function! func._is-statement
      func._is-statement(this)
    else if func instanceof Symbol
      func.is-internal and func.used-as-statement
    else
      false
  
  def mutate-last(o, func, context, include-noop)
    if is-function! @func._mutate-last
      @func._mutate-last(this, o, func, context, include-noop)
    else if @is-statement()
      this
    else
      super.mutate-last(o, func, context, include-noop)
  
  def do-wrap(parser)
    if is-function! @func._do-wrap
      @func._do-wrap(this, parser)
    else if @is-statement()
      let inner-scope = parser.push-scope(true, @scope)
      let result = Call @index, @scope,
        InternalCall \function, @index, @scope,
          InternalCall \array, @index, @scope
          InternalCall \auto-return, @index, inner-scope,
            @rescope(inner-scope)
          Value @index, true
          Symbol.nothing @index
          Value @index, false
      parser.pop-scope()
      result
    else
      this
  
  def with-label(label, parser)
    if is-function! @func._with-label
      @func._with-label(this, label, parser)
    else
      super.with-label(label, parser)
  
  let is-name-match(name, args)
    switch args.length
    case 0
      true
    case 1
      name == args[0]
    default
      name in args
  
  def is-internal-call()
    let func = @func
    if func.is-symbol and func.is-internal
      is-name-match func.name, arguments
    else
      false
  
  def is-unary-call()
    let func = @func
    if func.is-symbol and func.is-operator and func.is-unary
      is-name-match func.name, arguments
    else
      false
  
  def is-binary-call()
    let func = @func
    if func.is-symbol and func.is-operator and func.is-binary
      is-name-match func.name, arguments
    else
      false
  
  def is-assign-call()
    let func = @func
    if func.is-symbol and func.is-operator and func.is-assign
      is-name-match func.name, arguments
    else
      false

  def is-normal-call()
    let func = @func
    not func.is-symbol or (not func.is-internal and not func.is-operator)

let InternalCall(internal-name, index, scope, ...args)
  Call index, scope,
    Symbol[internal-name] index
    ...args

class MacroAccess extends Node
  def constructor(@index as Number, @scope, @id as Number, @data as {}, @in-statement as Boolean, @in-generator as Boolean, @in-evil-ast as Boolean, @do-wrapped as Boolean) ->

  def is-macro-access = true
  def node-type = \macro-access
  def node-type-id = ParserNodeTypeId.MacroAccess

  def cacheable = true

  def inspect(depth)
    let depth-1 = if depth? then depth - 1 else null
    let sb = []
    sb.push "MacroAccess("
    sb.push "\n  id: "
    sb.push @id
    sb.push "\n  data: "
    let {inspect} = require('util')
    sb.push inspect(@data, null, depth-1).split("\n").join("\n  ")
    for key in [\in-statement, \in-generator, \in-evil-ast, \do-wrapped]
      if this[key]
        sb.push "\n  "
        sb.push key
        sb.push ": true"
    sb.push ")"
    sb.join ""

  def to-string()
    let sb = []
    sb.push "macro("
    sb.push @id
    sb.push ", "
    sb.push "{"
    for k, v, i of @data
      if i > 0
        sb.push ", "
      sb.push k
      sb.push ": "
      if is-string! v
        sb.push to-JS-source v
      else
        sb.push v
    sb.push "}"
    for key in [\in-statement, \in-generator, \in-evil-ast, \do-wrapped]
      if this[key]
        sb.push ", +"
        sb.push key
    sb.push ")"
    sb.join ""
  
  def equals = do
    let object-eql(left, right)
      let left-keys = keys! left
      let right-keys = keys! right
      if array-eql(left-keys, right-keys)
        for every key in left-keys
          item-eql left[key], right[key]
      else
        false
    let array-eql(left, right)
      let len = left.length
      if right.length != len
        false
      else
        for every i in 0 til len
          item-eql left[i], right[i]
    let item-eql(left, right)
      if left == right
        true
      else if left instanceof Node
        right instanceof Node and left.equals(right)
      else if is-array! left
        array-eql left, right
      else if is-object! left
        object-eql left, right
      else
        false
    #(other)
      if other == this
        true
      else if other instanceof MacroAccess
        unless @in-statement == other.in-statement and @in-generator == other.in-generator and @in-evil-ast == other.in-evil-ast and @do-wrapped == other.do-wrapped
          false
        else
          object-eql @data, other.data
      else
        false

  def type = do
    let cache = Cache<MacroAccess, Type>()
    #(parser)
      cache-get-or-add! cache, this, do
        let type = parser.macros.get-type-by-id @id
        if type?
          if is-string! type
            @data[type].type parser
          else
            type
        else
          parser.macro-expand-1(this).type parser

  def with-label(label, parser)
    parser.macro-expand-1(this).with-label label, parser

  def reduce() this

  def walk = do
    let walk-array(array, func, context)
      let result = []
      let mutable changed = false
      for item in array
        let new-item = walk-item item, func, context
        if not changed and new-item != item
          changed := true
        result.push item
      if changed
        result
      else
        array
    let walk-object(obj, func, context)
      let result = {}
      let mutable changed = false
      for k, v of obj
        let new-v = walk-item v, func, context
        if not changed and new-v != v
          changed := true
        result[k] := new-v
      if changed
        result
      else
        obj
    let walk-item(item, func, context)
      if item instanceof Node
        func@(context, item) ? item.walk(func, context)
      else if is-array! item
        walk-array item, func, context
      else if is-object! item
        walk-object item, func, context
      else
        item
    #(func, context)
      let data = walk-item(@data, func, context)
      if data != @data
        MacroAccess @index, @scope, @id, data, @in-statement, @in-generator, @in-evil-ast, @do-wrapped
      else
        this
  def walk-async = do
    let walk-array(array, func, context, callback)
      let mutable changed = false
      let result = []
      asyncfor err <- next, item in array
        async! next, new-item <- walk-item item, func, context
        if not changed and item != new-item
          changed := true
        result.push new-item
        next null
      if err?
        callback err
      else
        callback null, if changed then result else array
    let walk-object(obj, func, context, callback)
      let mutable changed = false
      let result = {}
      asyncfor err <- next, k, v of obj
        async! next, new-v <- walk-item v, func, context
        if not changed and v != new-v
          changed := true
        result[k] := new-v
        next null
      if err?
        callback err
      else
        callback null, if changed then result else obj
    let walk-item(item, func, context, callback)
      if item instanceof Node
        func item, context, #(err, value)
          if err
            callback err
          else
            callback null, value ? item
      else if is-array! item
        walk-array item, func, context, callback
      else if is-object! item
        walk-object item, func, context, callback
      else
        callback null, item
    #(func, context, callback)
      async! callback, data <- walk-item @data, func, context
      callback null, if data != @data
        MacroAccess @index, @scope, @id, data, @in-statement, @in-generator, @in-evil-ast, @do-wrapped
      else
        this

  def is-noop(parser)
    parser.macro-expand-1(this).is-noop(parser)

  def do-wrap()
    if @do-wrapped
      this
    else
      MacroAccess @index, @scope, @id, @data, @in-statement, @in-generator, @in-evil-ast, true

  def mutate-last(parser, func, context, include-noop)
    parser.macro-expand-1(this).mutate-last(parser, func, context, include-noop)

  def return-type(parser, is-last)
    // this is all a really hacky way of figuring out the return type without having to macro-expand
    if @data.macro-name in [\return, "return?"] // FIXME: so ungodly hackish
      if @data.macro-data.node
        @data.macro-data.node.type(parser)
      else
        Type.undefined
    else
      let mutable type = if is-last
        Type.undefined
      else
        Type.none
      @walk #(node)
        type := type.union node.return-type(parser, false)
        node
      type

module.exports := Node <<< {
  Value
  Symbol
  Call
  MacroAccess
  InternalCall
  Access: #(index, scope, parent, ...children)
    for reduce child in children, current = parent
      Call index, scope,
        Symbol.access index
        current
        child
}
