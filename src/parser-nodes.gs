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
    let LispyNode = require('./parser-lispynodes')
    if label == null
      this
    else
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
      else
        let LispyNode = require('./parser-lispynodes')
        if func instanceof LispyNode and func.is-internal-call(\access)
          let [parent, child] = func.args
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
          else
            let LispyNode = require('./parser-lispynodes')
            if func instanceof LispyNode and func.is-internal-call(\access) and func.args[1].is-const()
              let [parent, child] = func.args
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
node-class ParamNode(ident as Node, default-value as Node|void, spread as Boolean, is-mutable as Boolean, as-type as Node|void)
node-class RootNode(file as String|void, body as Node, is-embedded as Boolean, is-generator as Boolean)
  def is-statement() -> true
node-class SuperNode(child as Node|void, args as [Node] = [])
  def _reduce(o)
    let child = if @child? then @child.reduce(o).do-wrap(o) else @child
    let args = map @args, #(node) -> node.reduce(o).do-wrap(o)
    if child != @child or args != @args
      SuperNode @index, @scope, child, args
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

module.exports := Node