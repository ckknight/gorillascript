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
  
  def is-noop() -> false
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
  def is-internal-call() -> false

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
      access: {
        validate-args: #(parent as OldNode, child as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to access"
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, do
              let parent-type = call.args[0].type(parser)
              let is-string = parent-type.is-subset-of(Type.string)
              if is-string or parent-type.is-subset-of(Type.array-like)
                let child = parser.macro-expand-1(call.args[1]).reduce(parser)
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
                    return Type.undefined
                else if child.type(parser).is-subset-of(Type.number)
                  return if is-string
                    Type.string.union(Type.undefined)
                  else if parent-type.subtype
                    parent-type.subtype.union(Type.undefined)
                  else
                    Type.any
              else if parent-type.is-subset-of(Type.object) and is-function! parent-type.value
                let child = parser.macro-expand-1(call.args[1]).reduce(parser)
                if child.is-const()
                  return parent-type.value(String child.const-value())
              Type.any
        __reduce(call, parser)
          let mutable parent = call.args[0].reduce(parser).do-wrap(parser)
          let mutable cached-parent = null
          let replace-length-ident(node)
            if node instanceof OldNode.Ident and node.name == CURRENT_ARRAY_LENGTH_NAME
              if parent.cacheable and not cached-parent?
                cached-parent := parser.make-tmp node.index, \ref, parent.type(parser)
                cached-parent.scope := node.scope
              Call node.index, node.scope,
                Symbol.access node.index
                cached-parent ? parent
                Value node.index, \length
            else
              let mutable result = node
              if node instanceof Node and node.is-internal-call(\access)
                let node-parent = replace-length-ident node.args[0]
                if node-parent != node.args[0]
                  result := Call node.index, node.scope,
                    Symbol.access node.index
                    node-parent
                    node.args[1]
              result.walk replace-length-ident
          let child = replace-length-ident call.args[1].reduce(parser).do-wrap(parser)
          if cached-parent?
            return Call call.index, call.scope,
              Symbol.tmp-wrapper call.index
              Call call.index, call.scope,
                Symbol.access call.index
                OldNode.Assign call.index, call.scope, cached-parent, "=", parent
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
                  return parent.args[c-value] or LispyNode_Value @index, void
              else if parent.func.is-object
                for pair in parent.args[1 to -1]
                  if pair.args[0].is-const-value(c-value) and not pair.args[2]
                    return pair.args[1]
          
          if child instanceof OldNode.Call and child.func instanceof OldNode.Ident and child.func.name == \__range
            let [start, mutable end, step, inclusive] = child.args
            let has-step = not step.is-const() or step.const-value() != 1
            if not has-step
              if inclusive.is-const()
                if inclusive.const-value()
                  end := if end.is-const() and is-number! end.const-value()
                    Value end.index, end.const-value() + 1 or Infinity
                  else
                    OldNode.Binary end.index, end.scope,
                      OldNode.Binary end.index, end.scope,
                        end
                        "+"
                        Value inclusive.index, 1
                      "||"
                      Value end.index, Infinity
              else
                end := Call end.index, end.scope,
                  Symbol.if end.index
                  inclusive
                  OldNode.Binary end.index, end.scope,
                    OldNode.Binary end.index, end.scope,
                      end
                      "+"
                      Value inclusive.index, 1
                    "||"
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
            (OldNode.Call call.index, call.scope,
              OldNode.Ident call.index, call.scope, if has-step then \__slice-step else \__slice
              args
              false
              not has-step).reduce(parser)
          else if parent != call.args[0] or child != call.args[1]
            Call call.index, call.scope,
              call.func
              parent
              child
          else
            call
        /*
        node-class AccessNode(parent as Node, child as Node)
          def _is-noop(o) -> @__is-noop ?= @parent.is-noop(o) and @child.is-noop(o)
        */
      }
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
      block: {
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
        _with-label(call, label, parser)
          let args = call.args
          let len = args.length
          if len == 1
            return args[0].with-label label parser
          else if len > 1
            let last = args[len - 1]
            if last instanceof Node and last.is-internal-call(\for-in)
              if for every node in args[0 til -1]; node instanceof OldNode.Assign or (node instanceof Node and node.is-internal-call(\var))
                return Call call.index, call.scope,
                  call.func
                  ...args[0 til -1]
                  last.with-label label, parser
          Call call.index, call.scope,
            Symbol.label call.index
            label
            call
        __reduce(call, parser)
          let mutable changed = false
          let body = []
          let args = call.args
          for node, i, len in args
            let reduced = node.reduce parser
            if reduced instanceof OldNode.Nothing
              changed := true
            else if reduced instanceof Node and reduced.is-internal-call()
              if reduced.func.is-block
                body.push ...reduced.args
                changed := true
              else if reduced.func.is-goto
                body.push reduced
                if reduced != node or i < len - 1
                  changed := true
                break
              else
                body.push reduced
                changed or= reduced != node
            else
              body.push reduced
              changed or= reduced != node
          switch body.length
          case 0
            OldNode.Nothing @index, @scope
          case 1
            body[0]
          default
            if changed
              Call @index, @scope,
                call.func
                ...body
            else
              call
        _is-statement: do
          let cache = Cache<Call, Boolean>()
          #(call)
            cache-get-or-add! cache, call, for some node in call.args; node.is-statement()
        _mutate-last(call, parser, func, context, include-noop)
          let args = call.args
          let len = args.length
          if len == 0
            OldNode.Nothing(@index, @scope).mutate-last parser, func, context, include-noop
          else
            let last-node = args[len - 1].mutate-last parser, func, context, include-noop
            if last-node != args[len - 1]
              Call @index, @scope,
                call.func
                ...args[0 til -1]
                last-node
            else
              call
        /*
        node-class BlockNode(nodes as [Node] = [], label as IdentNode|TmpNode|null)
          def _is-noop(o) -> @__is-noop ?= for every node in @nodes by -1; node.is-noop(o)
        */
      }
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
        validate-args(init as OldNode, test as OldNode, step as OldNode, body as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for"
        +used-as-statement
      }
      for-in: {
        validate-args(key as OldNode, object as OldNode, body as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to for-in"
        +used-as-statement
      }
      function: {}
      if: {
        validate-args(test as OldNode, when-true as OldNode, when-false as OldNode, ...rest)
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
          let test = call.args[0].reduce(parser)
          let when-true = call.args[1].reduce(parser)
          let when-false = call.args[2].reduce(parser)
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
            else if test != call.args[0] or when-true != call.args[1] or when-false != call.args[2]
              Call call.index, call.scope,
                call.func
                test
                when-true
                when-false
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
          else
            call
        /*
        node-class IfNode(test as Node, when-true as Node, when-false as Node = NothingNode(0, scope), label as IdentNode|TmpNode|null)
          def _is-noop(o) -> @__is-noop ?= @test.is-noop(o) and @when-true.is-noop(o) and @when-false.is-noop(o)
        */
      }
      label: {
        validate-args(label as OldNode, node as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to label"
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
              current.union args[* - 1].type(parser)
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
        validate-args(try-body as OldNode, catch-ident as OldNode, catch-body as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-catch"
        +used-as-statement
        _type: do
          let cache = Cache<Call, Type>()
          #(call, parser)
            cache-get-or-add! cache, call, call.args[0].type(parser).union(call.args[2].type(parser))
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
      }
      try-finally: {
        validate-args(try-body as OldNode, finally-body as OldNode, ...rest)
          if DEBUG and rest.length > 0
            throw Error "Too many arguments to try-finally"
        +used-as-statement
        _type(call, parser)
          call.args[0].type parser
        _mutate-last(call, parser, mutator, context, include-noop)
          let try-body = call.args[0].mutate-last(parser, mutator, context, include-noop)
          if try-body != call.args[0]
            Call call.index, call.scope,
              call.func
              try-body
              call.args[1]
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
  
  def is-internal-call()
    let func = @func
    if func.is-symbol and func.is-internal
      switch arguments.length
      case 0
        true
      case 1
        func.name == arguments[0]
      default
        func.name in arguments
    else
      false

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
        Symbol.access index
        current
        child
}
