import 'shared.gs'
let {to-JS-source} = require './jsutils'
require! Type: './types'
require! OldNode: './parser-nodes'
let {Cache} = require './utils'

let capitalize(value as String)
  value.char-at(0).to-upper-case() & value.substring(1)

/**
 * Base class for the other nodes, not intended to be used on its own
 */
class Node extends OldNode
  def constructor()
    throw Error "Node is not intended to be initialized directly"
  
  def is-value = false
  def is-symbol = false
  def is-call = false
  
  def is-const() -> false
  def is-const-value() -> false
  def is-const-type() -> false
  def is-literal() -> @is-const()
  def literal-value() -> @const-value()
  def is-statement() -> false
  def do-wrap() -> this
  def type() -> Type.any
  def walk() -> this
  def walk-async(f, context, callback)! -> callback null, this

/**
 * Represents a constant primitive value such as a number, string, boolean,
 * void, or null.
 */
class Value extends Node
  def constructor(@index as Number, @value as Number|String|Boolean|void|null) ->
  
  def is-value = true
  def node-type = \value
  
  def cacheable = false
  def reduce() -> this
  // FIXME: maybe get rid of this
  def const-value() -> @value
  def is-const() -> true
  def is-const-value(value) -> value == @value
  def is-const-type(type) -> type == typeof @value
  
  def equals(other)
    other instanceof Value and @value is other.value
  
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
    
    def is-internal = true
    def is-goto = false
    def used-as-statement = false
    
    let internal-symbols =
      access: {}
      apply: {}
      array: {
        validate-args(...args as [OldNode]) ->
        _type() Type.array
        __reduce(call, parser)
          let mutable changed = false
          let elements = []
          for element in call.args
            let new-element = element.reduce(parser).do-wrap(parser)
            changed or= element != new-element
            elements.push new-element
          if changed
            Call call.index, call.scope,
              call.func
              ...elements
          else
            call
        _is-literal: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, for every element in call.args; element.is-literal()
        _literal-value(call)
          return for element in call.args
            element.literal-value()
        /*
        node-class ArrayNode(elements as [Node] = [])
          def _is-noop(o) -> @__is-noop ?= for every element in @elements; element.is-noop(o)
        */
      }
      block: {}
      break: {
        validate-args(label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to break"
        +is-goto
        +used-as-statement
      }
      comment: {
        validate-args(text as Value, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to comment"
      }
      continue: {
        validate-args(label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to continue"
        +is-goto
        +used-as-statement
      }
      custom: {
        validate-args(name as Value, ...rest as [OldNode]) ->
      }
      debugger: {
        validate-args(...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to debugger"
        +used-as-statement
      }
      for: {
        validate-args(init as OldNode, test as OldNode, step as OldNode, body as OldNode, label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for"
        +used-as-statement
        _with-label(call, label)
          Call call.index, call.scope,
            call.func
            call.args[0]
            call.args[1]
            call.args[2]
            call.args[3]
            label
      }
      for-in: {
        validate-args(key as OldNode, object as OldNode, body as OldNode, label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for-in"
        +used-as-statement
        _with-label(call, label)
          Call call.index, call.scope,
            call.func
            call.args[0]
            call.args[1]
            call.args[2]
            label
      }
      function: {}
      if: {
        validate-args(test as OldNode, when-true as OldNode, when-false as OldNode, label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to if"
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[1].type(parser).union(call.args[2].type(parser))
        _is-statement: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, call.args[1].is-statement() or call.args[2].is-statement()
        _with-label(call, label)
          Call call.index, call.scope,
            call.func
            call.args[0]
            call.args[1]
            call.args[2]
            label
        _do-wrap(call, parser)
          let when-true = call.args[1].do-wrap(parser)
          let when-false = call.args[2].do-wrap(parser)
          if when-true != call.args[1] or when-false != call.args[2]
            Call call.index, call.scope,
              call.func
              call.args[0]
              when-true
              when-false
              ...call.args[3 to -1]
          else
            call
        __reduce(call, parser)
          let test = call.args[0].reduce(parser)
          let when-true = call.args[1].reduce(parser)
          let when-false = call.args[2].reduce(parser)
          let label = call.args[3] and call.args[3].reduce(parser)
          if test.is-const()
            OldNode.Block(call.index, call.scope
              [if test.const-value()
                when-true
              else
                when-false]
              label).reduce(parser)
          else
            let test-type = test.type(parser)
            if test-type.is-subset-of(Type.always-truthy)
              OldNode.Block(@index, @scope, [test, when-true], label).reduce(parser)
            else if test-type.is-subset-of(Type.always-falsy)
              OldNode.Block(@index, @scope, [test, when-false], label).reduce(parser)
            else if test != call.args[0] or when-true != call.args[1] or when-false != call.args[2] or label != call.args[3]
              Call call.index, call.scope,
                call.func
                test
                when-true
                when-false
                ...(if label then [label] else [])
            else
              call
        _mutate-last(call, parser, mutator, context, include-noop)
          let when-true = call.args[1].mutate-last(parser, mutator, context, include-noop)
          let when-false = call.args[2].mutate-last(parser, mutator, context, include-noop)
          if when-true != call.args[1] or when-false != call.args[2]
            Call call.index, call.scope,
              call.func
              call.args[0]
              when-true
              when-false
              ...call.args[3 to -1]
          else
            call
        /*
        node-class IfNode(test as Node, when-true as Node, when-false as Node = NothingNode(0, scope), label as IdentNode|TmpNode|null)
          def _is-noop(o) -> @__is-noop ?= @test.is-noop(o) and @when-true.is-noop(o) and @when-false.is-noop(o)
        */
      }
      label: {
        +used-as-statement
      }
      macro-const: {}
      new: {}
      noop: {
        const-value: #-> void
        is-const-type: (\undefined ==)
        is-const: #-> true
        is-const-value: (void ==)
      }
      object: {
        validate-args(prototype as OldNode, ...pairs)!
          if DEBUG
            for pair, i in pairs
              if pair not instanceof Node or not pair.is-call or not pair.func.is-symbol or not pair.func.is-internal or not pair.func.is-array
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
            cache-get-or-add! cache, call, call.args[0] instanceof OldNode.Nothing and for every arg in call.args[1 to -1]
              arg.args.length == 2 and arg.args[0].is-const() and arg.args[1].is-literal()
        _literal-value(call)
          if call.args[0] not instanceof OldNode.Nothing
            throw Error "Cannot convert object with prototype to a literal"
          let result = {}
          for pair in call.args[1 to -1]
            result[pair.args[0].const-value()] := pair.args[1].literal-value()
          result
        /*
        node-class ObjectNode(pairs as [{ key: Node, value: Node, property: String|void }] = [], prototype as Node|void)
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
        */
      }
      param: {}
      return: {
        validate-args(node as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to return"
        +is-goto
        +used-as-statement
      }
      root: {
        +used-as-statement
      }
      spread: {
        validate-args(node as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to spread"
        __reduce: #(call, parser)
          let arg = call.args[0].reduce(parser).do-wrap(parser)
          if arg != call.args[0]
            Call call.index, call.scope,
              call.func
              arg
          else
            call
      }
      switch: {
        validate-args(...args as [OldNode])
          if DEBUG
            let len = args.length
            if len % 3 not in [0, 2]
              throw Error "Unexpected number of arguments, got $len"
            if len %% 3
              let label = args[len - 1]
              if label not instanceofsome [OldNode.Ident, OldNode.Tmp]
                throw Error "Expected an Ident or Tmp for label"
        +used-as-statement
        _with-label(call, label)
          let args = call.args.slice()
          if args.length %% 3
            args.pop()
          args.push label
          Call call.index, call.scope,
            call.func
            ...args
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let args = call.args
              let len = args.length
              let mutable current = Type.none
              // case-bodies
              let last-case-index = if len %% 3 then len - 2 else len - 1
              for i in 2 til last-case-index by 3
                // check fallthrough
                unless args[i + 1].const-value()
                  current := current.union args[i].type(parser)
              // default-case
              current.union args[last-case-index].type(parser)
        _mutate-last(call, parser, mutator, context, include-noop)
          let args = call.args
          let len = args.length
          let mutable changed = false
          let new-args = []
          new-args.push args[0] // topic
          let last-case-index = if len %% 3 then len - 2 else len - 1
          for i in 1 til last-case-index by 3
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
          let default-case = args[last-case-index]
          let new-default-case = default-case.mutate-last parser, mutator, context, include-noop
          changed or= default-case != new-default-case
          new-args.push new-default-case
          for i in last-case-index + 1 til len
            new-args.push args[i]
          if changed
            Call call.index, call.scope,
              call.func
              ...new-args
          else
            call
      }
      super: {}
      throw: {
        validate-args(node as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to throw"
        _type()
          Type.none
        +is-goto
        +used-as-statement
        _do-wrap(call, parser)
          OldNode.Call call.index, call.scope,
            OldNode.Ident call.index, call.scope, \__throw
            [call.args[0]]
        /*
        node-class ThrowNode(node as Node)
          def _reduce(o)
            let node = @node.reduce(o).do-wrap(o)
            if node != @node
              ThrowNode @index, @scope, node
            else
              this
        */
      }
      tmp-wrapper: {
        _is-statement(call)
          call.args[0].is-statement()
        validate-args(node as OldNode, ...tmp-ids as [Value]) ->
        _type(call, parser)
          call.args[0].type parser
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
        /*
        node-class TmpWrapperNode(node as Node, tmps as [] = [])
          def _is-noop(o) -> @node.is-noop(o)
        */
      }
      try-catch: {
        validate-args(try-body as OldNode, catch-ident as OldNode, catch-body as OldNode, label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-catch"
        +used-as-statement
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[1].type(parser).union(call.args[2].type(parser))
        _with-label(call, label)
          Call call.index, call.scope,
            call.func
            call.args[0]
            call.args[1]
            call.args[2]
            label
        _mutate-last(call, parser, mutator, context, include-noop)
          let try-body = call.args[0].mutate-last(parser, mutator, context, include-noop)
          let catch-body = call.args[2].mutate-last(parser, mutator, context, include-noop)
          if try-body != call.args[0] or catch-body != call.args[2]
            Call call.index, call.scope,
              call.func
              try-body
              call.args[1]
              catch-body
              ...call.args[3 to -1]
          else
            call
      }
      try-finally: {
        validate-args(try-body as OldNode, finally-body as OldNode, label as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-finally"
        +used-as-statement
        _type(call, parser)
          call.args[0].type parser
        _with-label(call, label)
          Call call.index, call.scope,
            call.func
            call.args[0]
            call.args[1]
            label
        _mutate-last(call, parser, mutator, context, include-noop)
          let try-body = call.args[0].mutate-last(parser, mutator, context, include-noop)
          if try-body != call.args[0]
            Call call.index, call.scope,
              call.func
              try-body
              ...call.args[1 to -1]
          else
            call
        /*
        node-class TryFinallyNode(try-body as Node, finally-body as Node, label as IdentNode|TmpNode|null)
          def _reduce(o)
            let try-body = @try-body.reduce(o)
            let finally-body = @finally-body.reduce(o)
            let label = if @label? then @label.reduce(o) else @label
            if finally-body instanceof NothingNode
              BlockNode(@index, @scope-if [try-body], label).reduce(o)
            else if try-body instanceof NothingNode
              BlockNode(@index, @scope-if [finally-body], label).reduce(o)
            else if try-body != @try-body or finally-body != @finally-body or label != @label
              TryFinallyNode @index, @scope, try-body, finally-body, label
            else
              this
          def _is-noop(o) -> @__is-noop ?= @try-body.is-noop(o) and @finally-body.is-noop()
        */
      }
      write: {}
      var: {
        validate-args(node as OldNode, is-mutable as OldNode|null, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to var"
      }
      yield: {
        validate-args(node as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to yield"
      }
    for name, data of internal-symbols
      let is-name-key = "is$(capitalize name)"
      def [is-name-key] = false
      Symbol[name] := class Symbol_name extends Internal
        def constructor(@index as Number)
          @name := name
        
        def display-name = "Symbol.$name"
        
        def equals(other)
          other instanceof Symbol_name
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
    
    def inspect()
      "Symbol.ident($(to-JS-source @name))"
    
    def equals(other)
      other instanceof Ident and @scope == other.scope and @name == other.name
    
    Symbol.ident := Ident
  
  /**
   * Represents a temporary identifier
   */
  class Tmp extends Symbol
    def constructor(@index as Number, @scope, @id as Number, @name as String) ->
    
    def is-tmp = true
    def is-ident-or-tmp = true
    
    def inspect()
      "Symbol.tmp($(@id), $(to-JS-source @name))"
    
    def equals(other)
      other instanceof Tmp and @scope == other.scope and @id == other.id
    
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
    
    class BinaryOperator extends Operator
      def constructor(@index as Number, @name as String) ->
      
      def is-binary = true
      def operator-type = \binary
      
      def inspect()
        "Symbol.binary[$(to-JS-source @name)]"
      
      def equals(other)
        other instanceof BinaryOperator and @name == other.name
    
    class UnaryOperator extends Operator
      def constructor(@index as Number, @name as String) ->
      
      def is-unary = true
      def operator-type = \unary
      
      def inspect()
        "Symbol.unary[$(to-JS-source @name)]"
    
      def equals(other)
        other instanceof UnaryOperator and @name == other.name
    
    class AssignOperator extends Operator
      def constructor(@index as Number, @name as String) ->
      
      def is-assign = true
      def operator-type = \assign
      
      def inspect()
        "Symbol.assign[$(to-JS-source @name)]"
      
      def equals(other)
        other instanceof AssignOperator and @name == other.name
    
    let binary-operators = [
      "*"
      "/"
      "%"
      "+"
      "-"
      "<<"
      ">>"
      ">>>"
      "<"
      "<="
      ">"
      ">="
      "in"
      "instanceof"
      "=="
      "!="
      "==="
      "!=="
      "&"
      "^"
      "|"
      "&&"
      "||"
    ]
    Symbol.binary := {}
    for name in binary-operators
      Symbol.binary[name] := #(index)
        BinaryOperator index, name
    
    let unary-operators = [
      "-"
      "+"
      "--"
      "++"
      "--post"
      "++post"
      "!"
      "~"
      "typeof"
      "delete"
    ]
    Symbol.unary := {}
    for name in unary-operators
      Symbol.unary[name] := #(index)
        UnaryOperator index, name
    
    let assign-operators = [
      "="
      "+="
      "-="
      "*="
      "/="
      "%="
      "<<="
      ">>="
      ">>>="
      "&="
      "^="
      "|="
    ]
    Symbol.assign := {}
    for name in assign-operators
      Symbol.assign[name] := #(index)
        AssignOperator index, name

class Call extends Node
  def constructor(@index as Number, @scope, @func as Node, ...@args as [OldNode])
    if DEBUG and is-function! func.validate-args
      func.validate-args ...args
  
  def is-call = true
  def node-type = \call
  
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
  
  def equals(other)
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
  
  def type(o)
    if is-function! @func._type
      @func._type this, o
    else
      super.type o
  
  def _reduce(o)
    if is-function! @func.__reduce
      @func.__reduce this, o
    else
      @walk #(x) -> x.reduce(this), o
  
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
  
  def is-statement()
    if is-function! @func._is-statement
      @func._is-statement(this)
    else
      @func.is-internal and @func.used-as-statement
  
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
      let result = OldNode.Call(@index, @scope, OldNode.Function(@index, @scope, [], @rescope(inner-scope), true, true), [])
      parser.pop-scope()
      result
    else
      this
  
  def with-label(label, parser)
    if is-function! @func._with-label
      @func._with-label(this, label, parser)
    else
      super.with-label(label, parser)

module.exports := Node <<< {
  Value
  Symbol
  Call
  InternalCall: #(internal-name, index, scope, ...args)
    Call index, scope,
      Symbol[internal-name] index
      ...args
  Access: #(index, scope, parent, ...children)
    for reduce child in children, current = parent
      Call index, scope,
        Symbol.access
        current
        child
}
