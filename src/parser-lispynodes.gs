import 'shared.gs'
let {to-JS-source} = require './jsutils'

let capitalize(value as String)
  value.char-at(0).to-upper-case() & value.substring(1)

/**
 * Base class for the other nodes, not intended to be used on its own
 */
class Node
  def constructor()
    throw Error "Node is not intended to be initialized directly"
  
  def is-value = false
  def is-symbol = false
  def is-call = false

/**
 * Represents a constant primitive value such as a number, string, boolean,
 * void, or null.
 */
class Value extends Node
  def constructor(@pos/* as Position*/, @scope, @value as Number|String|Boolean|void|null) ->
  
  def is-value = true
  
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
  def is-ident = false
  def is-tmp = false
  def is-ident-or-tmp = false
  def is-internal = false
  def is-operator = false
  
  /**
   * Represents an compiler-internal such as `new` or `apply`
   */
  class Internal extends Symbol
    def constructor(@pos/* as Position*/, @name as String)
      @["is$(capitalize name)"] := true
    
    def inspect()
      "Symbol.$(@name)"
    
    def is-internal = true
    
    let internal-symbol-names = [
      \access
      \access-multi
      \apply
      \array
      \block
      \break
      \cascade
      \comment
      \continue
      \debugger
      \def
      \for
      \for-in
      \function
      \if
      \label
      \macro-const
      \new
      \noop
      \object
      \return
      \root
      \spread
      \super
      \throw
      \tmp-wrapper
      \try-catch
      \try-finally
      \write
      \var
      \yield
    ]
    for name in internal-symbol-names
      def ["is$(capitalize name)"] = false
      Symbol[name] := #(pos)
        Internal pos, name
  
  /**
   * Represents a named binding
   */
  class Ident extends Symbol
    def constructor(@pos/* as Position*/, @scope, @name as String) ->
    
    def is-ident = true
    def is-ident-or-tmp = true
    
    def inspect()
      "Symbol.ident($(to-JS-source @name))"
    
    Symbol.ident := #(pos, scope, name)
      Ident pos, scope, name
  
  /**
   * Represents a temporary identifier
   */
  class Tmp extends Symbol
    def constructor(@pos/* as Position*/, @scope, @id as Number) ->
    
    def is-tmp = true
    def is-ident-or-tmp = true
    
    def inspect()
      "Symbol.tmp($(@id))"
    
    Symbol.tmp := #(pos, scope, name)
      Tmp pos, scope, name
  
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
      def constructor(@pos/* as Position*/, @name as String) ->
      
      def is-binary = true
      
      def inspect()
        "Symbol.binary[$(to-JS-source @name)]"
    
    class UnaryOperator extends Operator
      def constructor(@pos/* as Position*/, @name as String) ->
      
      def is-unary = true
      
      def inspect()
        "Symbol.unary[$(to-JS-source @name)]"
    
    class AssignOperator extends Operator
      def constructor(@pos/* as Position*/, @name as String) ->
      
      def is-assign = true
      
      def inspect()
        "Symbol.assign[$(to-JS-source @name)]"
    
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
      Symbol.binary[name] := #(pos)
        BinaryOperator pos, name
    
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
      Symbol.unary[name] := #(pos)
        UnaryOperator pos, name
    
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
      Symbol.assign[name] := #(pos)
        AssignOperator pos, name

class Call extends Node
  def constructor(@pos/* as Position*/, @scope, @func as Node, ...@args as [Node]) ->
  
  def is-call = true

module.exports := Node <<< {
  Value
  Symbol
  Call
}
