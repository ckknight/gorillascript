import 'shared.gs'
let {to-JS-source} = require './jsutils'
require! Type: './types'
require! OldNode: './parser-nodes'

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
      access-multi: {}
      apply: {}
      array: {}
      block: {}
      break: {
        +is-goto
        +used-as-statement
      }
      cascade: {}
      comment: {}
      continue: {
        +is-goto
        +used-as-statement
      }
      debugger: {
        +used-as-statement
      }
      def: {}
      for: {
        +used-as-statement
      }
      for-in: {
        +used-as-statement
      }
      function: {}
      if: {}
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
      object: {}
      param: {}
      return: {
        +is-goto
        +used-as-statement
      }
      root: {
        +used-as-statement
      }
      spread: {}
      super: {}
      throw: {
        +is-goto
        +used-as-statement
        _do-wrap(call, parser)
          OldNode.Call call.index, call.scope,
            OldNode.Ident call.index, call.scope, \__throw
            [call.args[0]]
        /*
        node-class ThrowNode(node as Node)
          def type() -> Type.none
          def is-statement() -> true
          def _reduce(o)
            let node = @node.reduce(o).do-wrap(o)
            if node != @node
              ThrowNode @index, @scope, node
            else
              this
          def do-wrap(o)
            CallNode @index, @scope,
              IdentNode @index, @scope, \__throw
              [@node]
          def mutate-last() -> this
        */
      }
      tmp-wrapper: {}
      try-catch: {
        +used-as-statement
      }
      try-finally: {
        +used-as-statement
      }
      write: {}
      var: {}
      yield: {}
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
  def constructor(@index as Number, @scope, @func as Node, ...@args as [OldNode]) ->
  
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
  
  def _reduce(o)
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
  
  def is-statement()
    @func.is-internal and @func.used-as-statement
  
  def mutate-last(o, func, context, include-noop)
    if @is-statement()
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
