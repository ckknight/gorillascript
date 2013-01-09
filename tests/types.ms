let T = require '../lib/types'

test "Basic string representation", #
  eq "undefined", T.undefined.to-string()
  eq "null", T.null.to-string()
  eq "String", T.string.to-string()
  eq "Number", T.number.to-string()
  eq "Boolean", T.boolean.to-string()
  eq "Function", T.function.to-string()
  eq "Object", T.object.to-string()
  eq "[any]", T.array.to-string()
  eq "Arguments", T.args.to-string()
  eq "any", T.any.to-string()
  eq "none", T.none.to-string()
  eq "RegExp", T.regexp.to-string()
  eq "(Number|String)", T.string-or-number.to-string()
  eq "([any]|Arguments)", T.array-like.to-string()
  eq "(null|undefined)", T.undefined-or-null.to-string()
  eq "any \\ (null|undefined)", T.not-undefined-or-null.to-string()
  eq "(Boolean|Number|String|null|undefined)", T.primitive.to-string()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.non-primitive.to-string()
  eq "(null|undefined)", T.always-falsy.to-string()
  eq "any \\ (null|undefined)", T.potentially-truthy.to-string()
  eq "(Boolean|Number|String|null|undefined)", T.potentially-falsy.to-string()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.always-truthy.to-string()

define operator binary subset with maximum: 1, invertible: true
  let result = AST $left.is-subset-of $right
  if inverted
    AST not $result
  else
    result

define operator binary union
  AST $left.union $right

define operator binary intersect
  AST $left.intersect $right

define operator unary ~
  AST $node.complement()

define operator binary equals with maximum: 1, invertible: true
  let result = AST $left.equals $right
  if inverted
    AST not $result
  else
    result

define operator binary overlaps with maximum: 1, invertible: true
  let result = AST $left.overlaps $right
  if inverted
    AST not $result
  else
    result

test "Complement", #
  eq T.any, ~T.none
  eq T.none, ~T.any
  
  eq "any \\ Boolean", (~T.boolean).to-string()
  eq "any \\ Function", (~T.function).to-string()
  eq "any \\ (Boolean|Function)", (~(T.boolean union T.function)).to-string()
  eq "any \\ [Boolean]", (~T.boolean.array()).to-string()
  eq "any \\ [any]", (~T.array).to-string()
  
  ok ~(~T.boolean) equals T.boolean
  ok ~(~(T.boolean union T.function)) equals (T.boolean union T.function)
  ok ~(~(T.boolean.array())) equals T.boolean.array()
  
  eq T.any, ~T.boolean union ~T.string
  ok ~(T.boolean union T.string) equals (~T.boolean intersect ~T.string)

test "Subset of simple", #
  ok T.number subset T.number, "N ⊆ N"
  ok T.number not subset T.string, "N ⊆ S"
  ok T.number subset T.string-or-number, "N ⊆ (S|N)"
  ok T.number subset ~T.string, "N ⊆ -S"
  ok T.number not subset ~T.number, "N ⊆ -N"
  ok T.number subset T.any, "N ⊆ *"
  ok T.number not subset T.none, "N ⊆ 0"
  ok T.number not subset T.number.array(), "N ⊆ [N]"

test "Subset of union", #
  ok T.string-or-number not subset T.number, "(S|N) ⊆ N"
  ok T.string-or-number subset T.string-or-number, "(S|N) ⊆ (S|N)"
  ok T.string-or-number not subset (T.number union T.boolean), "(S|N) ⊆ (N|B)"
  ok T.string-or-number subset (T.boolean union T.string-or-number), "(S|N) ⊆ (S|N|B)"
  ok T.string-or-number subset T.any, "(S|N) ⊆ *"
  ok T.string-or-number not subset T.none, "(S|N) ⊆ 0"
  ok T.string-or-number not subset T.number.array(), "(S|N) ⊆ [N]"
  ok T.string-or-number not subset T.string-or-number.array(), "(S|N) ⊆ [(S|N)]"
  ok T.string-or-number subset ~T.boolean, "(S|N) ⊆ -B"
  ok T.string-or-number not subset ~T.number, "(S|N) ⊆ -N"
  ok T.string-or-number not subset ~T.string, "(S|N) ⊆ -S"
  ok T.string-or-number not subset ~T.string-or-number, "(S|N) ⊆ -(S|N)"

test "Subset of complement", #
  ok ~T.number not subset T.number, "-N ⊆ N"
  ok ~T.number not subset T.string, "-N ⊆ S"
  ok ~T.number not subset T.string-or-number, "-N ⊆ (S|N)"
  ok ~T.number not subset (T.boolean union T.string), "-N ⊆ (S|B)"
  ok ~T.number subset T.any, "-N ⊆ *"
  ok ~T.number not subset T.none, "-N ⊆ 0"
  ok ~T.number not subset T.array, "-N ⊆ [*]"
  ok ~T.number not subset T.number.array(), "-N ⊆ [N]"
  ok ~T.number not subset ~T.number.array(), "-N ⊆ [-N]"
  ok ~T.number subset ~T.number, "-N ⊆ -N"
  ok ~T.number not subset ~T.string, "-N ⊆ -S"

test "Subset of none", #
  ok T.none subset T.number, "0 ⊆ N"
  ok T.none subset T.string-or-number, "0 ⊆ (S|N)"
  ok T.none subset T.any, "0 ⊆ *"
  ok T.none subset T.none, "0 ⊆ 0"
  ok T.none subset T.array, "0 ⊆ [*]"
  ok T.none subset T.number.array(), "0 ⊆ [N]"
  ok T.none subset ~T.number, "0 ⊆ -N"

test "Subset of any", #
  ok T.any not subset T.number, "* ⊆ N"
  ok T.any not subset T.string-or-number, "* ⊆ (S|N)"
  ok T.any subset T.any, "* ⊆ *"
  ok T.any not subset T.none, "* ⊆ 0"
  ok T.any not subset T.array, "* ⊆ [*]"
  ok T.any not subset T.number.array(), "* ⊆ [N]"
  ok T.any not subset ~T.number, "* ⊆ -N"

test "Subset of specialized array", #
  ok T.number.array() not subset T.number, "[N] ⊆ N"
  ok T.number.array() not subset T.string, "[N] ⊆ S"
  ok T.number.array() not subset T.string-or-number, "[N] ⊆ (S|N)"
  ok T.number.array() subset T.any, "[N] ⊆ *"
  ok T.number.array() not subset T.none, "[N] ⊆ 0"
  ok T.number.array() subset T.array, "[N] ⊆ [*]"
  ok T.number.array() subset T.number.array(), "[N] ⊆ [N]"
  ok T.number.array() not subset T.string.array(), "[N] ⊆ [S]"
  ok T.number.array() subset ~T.number, "[N] ⊆ -N"

test "Subset of array", #
  ok T.array not subset T.number, "[*] ⊆ N"
  ok T.array not subset T.string, "[*] ⊆ S"
  ok T.array not subset T.string-or-number, "[*] ⊆ (S|N)"
  ok T.array subset T.any, "[*] ⊆ *"
  ok T.array not subset T.none, "[*] ⊆ 0"
  ok T.array subset T.array, "[*] ⊆ [*]"
  ok T.array not subset T.number.array(), "[*] ⊆ [N]"
  ok T.array subset ~T.number, "[*] ⊆ -N"

test "Overlap of simple", #
  ok T.number overlaps T.number, "N ∩ N"
  ok T.number not overlaps T.string, "N ∩ S"
  ok T.number overlaps T.string-or-number, "N ∩ (S|N)"
  ok T.number overlaps ~T.string, "N ∩ -S"
  ok T.number not overlaps ~T.number, "N ∩ -N"
  ok T.number overlaps T.any, "N ∩ *"
  ok T.number not overlaps T.none, "N ∩ 0"
  ok T.number not overlaps T.number.array(), "N ∩ [N]"

test "Overlap of union", #
  ok T.string-or-number overlaps T.number, "(S|N) ∩ N"
  ok T.string-or-number overlaps T.string-or-number, "(S|N) ∩ (S|N)"
  ok T.string-or-number overlaps (T.number union T.boolean), "(S|N) ∩ (N|B)"
  ok T.string-or-number overlaps (T.boolean union T.string-or-number), "(S|N) ∩ (S|N|B)"
  ok T.string-or-number not overlaps (T.boolean union T.function), "(S|N) ∩ (B|F)"
  ok T.string-or-number overlaps T.any, "(S|N) ∩ *"
  ok T.string-or-number not overlaps T.none, "(S|N) ∩ 0"
  ok T.string-or-number not overlaps T.number.array(), "(S|N) ∩ [N]"
  ok T.string-or-number not overlaps T.string-or-number.array(), "(S|N) ∩ [(S|N)]"
  ok T.string-or-number overlaps ~T.boolean, "(S|N) ∩ -B"
  ok T.string-or-number overlaps ~T.number, "(S|N) ∩ -N"
  ok T.string-or-number overlaps ~T.string, "(S|N) ∩ -S"
  ok T.string-or-number not overlaps ~T.string-or-number, "(S|N) ∩ -(S|N)"

test "Overlap of complement", #
  ok ~T.number not overlaps T.number, "-N ∩ N"
  ok ~T.number overlaps T.string, "-N ∩ S"
  ok ~T.number overlaps T.string-or-number, "-N ∩ (S|N)"
  ok ~T.number overlaps (T.boolean union T.string), "-N ∩ (S|B)"
  ok ~T.number overlaps T.any, "-N ∩ *"
  ok ~T.number not overlaps T.none, "-N ∩ 0"
  ok ~T.number overlaps T.array, "-N ∩ [*]"
  ok ~T.number overlaps T.number.array(), "-N ∩ [N]"
  ok ~T.number overlaps (~T.number.array()), "-N ∩ [-N]"
  ok ~T.number overlaps ~T.number, "-N ∩ -N"
  ok ~T.number overlaps ~T.string, "-N ∩ -S"

test "Overlap of none", #
  ok T.none not overlaps T.number, "0 ∩ N"
  ok T.none not overlaps T.string-or-number, "0 ∩ (S|N)"
  ok T.none not overlaps T.any, "0 ∩ *"
  ok T.none not overlaps T.none, "0 ∩ 0"
  ok T.none not overlaps T.array, "0 ∩ [*]"
  ok T.none not overlaps T.number.array(), "0 ∩ [N]"
  ok T.none not overlaps ~T.number, "0 ∩ -N"

test "Overlap of any", #
  ok T.any overlaps T.number, "* ∩ N"
  ok T.any overlaps T.string-or-number, "* ∩ (S|N)"
  ok T.any overlaps T.any, "* ∩ *"
  ok T.any overlaps T.none, "* ∩ 0"
  ok T.any overlaps T.array, "* ∩ [*]"
  ok T.any overlaps T.number.array(), "* ∩ [N]"
  ok T.any overlaps ~T.number, "* ∩ -N"

test "Overlap of specialized array", #
  ok T.number.array() not overlaps T.number, "[N] ∩ N"
  ok T.number.array() not overlaps T.string, "[N] ∩ S"
  ok T.number.array() not overlaps T.string-or-number, "[N] ∩ (S|N)"
  ok T.number.array() overlaps T.any, "[N] ∩ *"
  ok T.number.array() not overlaps T.none, "[N] ∩ 0"
  ok T.number.array() overlaps T.array, "[N] ∩ [*]"
  ok T.number.array() overlaps T.number.array(), "[N] ∩ [N]"
  ok T.number.array() not overlaps T.string.array(), "[N] ∩ [S]"
  ok T.number.array() overlaps ~T.number, "[N] ∩ -N"

test "Overlap of array", #
  ok T.array not overlaps T.number, "[*] ∩ N"
  ok T.array not overlaps T.string, "[*] ∩ S"
  ok T.array not overlaps T.string-or-number, "[*] ∩ (S|N)"
  ok T.array overlaps T.any, "[*] ∩ *"
  ok T.array not overlaps T.none, "[*] ∩ 0"
  ok T.array overlaps T.array, "[*] ∩ [*]"
  ok T.array overlaps T.number.array(), "[*] ∩ [N]"
  ok T.array overlaps ~T.number, "[*] ∩ -N"

test "Union of simple", #
  eq T.number, T.number union T.number, "N ∪ N"
  ok (T.number union T.string) equals T.string-or-number, "N ∪ S"
  ok (T.number union T.string-or-number) equals T.string-or-number, "N ∪ (S|N)"
  ok (T.number union ~T.string) equals ~T.string, "N ∪ -S"
  eq T.any, T.number union ~T.number, "N ∪ -N"
  eq T.any, T.number union T.any, "N ∪ *"
  eq T.number, T.number union T.none, "N ∪ 0"
  ok (T.number union T.number.array()) equals (T.number.array() union T.number), "N ∪ [N]"
  eq "([Number]|Number)", (T.number union T.number.array()).to-string()

test "Union of union", #
  eq T.string-or-number, T.string-or-number union T.number, "(S|N) ∪ N"
  eq T.string-or-number, T.string-or-number union T.string-or-number, "(S|N) ∪ (S|N)"
  ok (T.string-or-number union (T.number union T.boolean)) equals (T.string union T.number union T.boolean), "(S|N) ∪ (N|B)"
  ok (T.string-or-number union (T.boolean union T.string-or-number)) equals (T.string union T.number union T.boolean), "(S|N) ∪ (S|N|B)"
  eq T.any, T.string-or-number union T.any, "(S|N) ∪ *"
  eq T.string-or-number, T.string-or-number union T.none, "(S|N) ∪ 0"
  ok (T.string-or-number union T.number.array()) equals (T.string union T.number union T.number.array()), "(S|N) ∪ [N]"
  eq "([Number]|Number|String)", (T.string union T.number union T.number.array()).to-string()
  ok (T.string-or-number union T.string-or-number.array()) equals (T.string union T.number union (T.number union T.string).array()), "(S|N) ∪ [(S|N)]"
  eq "([(Number|String)]|Number|String)", (T.string-or-number union T.string-or-number.array()).to-string()
  ok (T.string-or-number union ~T.boolean) equals ~T.boolean, "(S|N) ∪ -B"
  eq T.any, T.string-or-number union ~T.number, "(S|N) ∪ -N"
  eq T.any, T.string-or-number union ~T.string, "(S|N) ∪ -S"
  eq T.any, T.string-or-number union ~T.string-or-number, "(S|N) ∪ -(S|N)"

test "Union of complement", #
  let not-number = ~T.number
  eq T.any, not-number union T.number, "-N ∪ N"
  eq not-number, not-number union T.string, "-N ∪ S"
  eq T.any, not-number union T.string-or-number, "-N ∪ (S|N)"
  eq not-number, not-number union (T.boolean union T.string), "-N ∪ (S|B)"
  eq T.any, not-number union T.any, "-N ∪ *"
  eq not-number, not-number union T.none, "-N ∪ 0"
  eq not-number, not-number union T.array, "-N ∪ [*]"
  eq not-number, not-number union T.number.array(), "-N ∪ [N]"
  eq not-number, not-number union not-number.array(), "-N ∪ [-N]"
  eq T.any, not-number union ~T.number.array(), "-N ∪ -[N]"
  ok (not-number union ~T.number) equals not-number, "-N ∪ -N"
  eq T.any, not-number union ~T.string, "-N ∪ -S"

test "Union of none", #
  eq T.number, T.none union T.number, "0 ∪ N"
  eq T.string-or-number, T.none union T.string-or-number, "0 ∪ (S|N)"
  eq T.any, T.none union T.any, "0 ∪ *"
  eq T.none, T.none union T.none, "0 ∪ 0"
  eq T.array, T.none union T.array, "0 ∪ [*]"
  eq T.number.array(), T.none union T.number.array(), "0 ∪ [N]"
  let not-number = ~T.number
  eq not-number, T.none union not-number, "0 ∪ -N"

test "Union of any", #
  eq T.any, T.any union T.number, "* ∪ N"
  eq T.any, T.any union T.string-or-number, "* ∪ (S|N)"
  eq T.any, T.any union T.any, "* ∪ *"
  eq T.any, T.any union T.none, "* ∪ 0"
  eq T.any, T.any union T.array, "* ∪ [*]"
  eq T.any, T.any union T.number.array(), "* ∪ [N]"
  eq T.any, T.any union ~T.number, "* ∪ -N"

test "Union of specialized array", #
  eq "([Number]|Number)", (T.number.array() union T.number).to-string(), "[N] ∪ N"
  eq "([Number]|String)", (T.number.array() union T.string).to-string(), "[N] ∪ S"
  eq "([Number]|Number|String)", (T.number.array() union T.string-or-number).to-string(), "[N] ∪ (S|N)"
  eq T.any, T.number.array() union T.any, "[N] ∪ *"
  eq T.number.array(), T.number.array() union T.none, "[N] ∪ 0"
  eq T.array, T.number.array() union T.array, "[N] ∪ [*]"
  eq T.number.array(), T.number.array() union T.number.array(), "[N] ∪ [N]"
  eq "([Number]|[String])", (T.number.array() union T.string.array()).to-string(), "[N] ∪ [S]"
  let not-number = ~T.number
  eq not-number, T.number.array() union not-number, "[N] ∪ -N"
  eq T.any, T.number.array() union ~T.number.array(), "[N] ∪ -[N]"

test "Union of array", #
  eq "([any]|Number)", (T.array union T.number).to-string(), "[*] ∪ N"
  eq "([any]|String)", (T.array union T.string).to-string(), "[*] ∪ S"
  eq "([any]|Number|String)", (T.array union T.string-or-number).to-string(), "[*] ∪ (S|N)"
  eq T.any, T.array union T.any, "[*] ∪ *"
  eq T.array, T.array union T.none, "[*] ∪ 0"
  eq T.array, T.array union T.array, "[*] ∪ [*]"
  eq T.array, T.array union T.number.array(), "[*] ∪ [N]"
  let not-number = ~T.number
  eq not-number, T.array union not-number, "[*] ∪ -N"
  eq T.any, T.array union ~T.array, "[*] ∪ -[*]"

test "Intersection of simple", #
  eq T.number, T.number intersect T.number, "N ∩ N"
  eq T.none, T.number intersect T.string, "N ∩ S"
  eq T.number, T.number intersect T.string-or-number, "N ∩ (S|N)"
  eq T.number, T.number intersect ~T.string, "N ∩ -S"
  eq T.none, T.number intersect ~T.number, "N ∩ -N"
  eq T.number, T.number intersect T.any, "N ∩ *"
  eq T.none, T.number intersect T.none, "N ∩ 0"
  eq T.none, T.number intersect T.number.array(), "N ∩ [N]"

test "Intersection of union", #
  eq T.number, T.string-or-number intersect T.number, "(S|N) ∩ N"
  eq T.string-or-number, T.string-or-number intersect T.string-or-number, "(S|N) ∩ (S|N)"
  eq T.number, T.string-or-number intersect (T.number union T.boolean), "(S|N) ∩ (N|B)"
  eq T.string-or-number, T.string-or-number intersect (T.boolean union T.string-or-number), "(S|N) ∩ (S|N|B)"
  eq T.string-or-number, T.string-or-number intersect T.any, "(S|N) ∩ *"
  eq T.none, T.string-or-number intersect T.none, "(S|N) ∩ 0"
  eq T.none, T.string-or-number intersect T.number.array(), "(S|N) ∩ [N]"
  eq T.none, T.string-or-number intersect T.string-or-number.array(), "(S|N) ∩ [(S|N)]"
  eq T.string-or-number, T.string-or-number intersect ~T.boolean, "(S|N) ∩ -B"
  eq T.string, T.string-or-number intersect ~T.number, "(S|N) ∩ -N"
  eq T.number, T.string-or-number intersect ~T.string, "(S|N) ∩ -S"
  eq T.none, T.string-or-number intersect ~T.string-or-number, "(S|N) ∩ -(S|N)"

test "Intersection of complement", #
  let not-number = ~T.number
  eq T.none, not-number intersect T.number, "-N ∩ N"
  eq T.string, not-number intersect T.string, "-N ∩ S"
  eq T.string, not-number intersect T.string-or-number, "-N ∩ (S|N)"
  let boolean-or-string = T.boolean union T.string
  eq boolean-or-string, not-number intersect boolean-or-string, "-N ∩ (S|B)"
  eq not-number, not-number intersect T.any, "-N ∩ *"
  eq T.none, not-number intersect T.none, "-N ∩ 0"
  eq T.array, not-number intersect T.array, "-N ∩ [*]"
  eq T.number.array(), not-number intersect T.number.array(), "-N ∩ [N]"
  ok (not-number intersect not-number.array()) equals not-number.array(), "-N ∩ [-N]"
  ok (not-number intersect ~T.number.array()) equals ~(T.number union T.number.array()), "-N ∩ -[N]"
  ok (not-number intersect ~T.number) equals not-number, "-N ∩ -N"
  ok (not-number intersect ~T.string) equals ~T.string-or-number, "-N ∩ -S"

test "Intersection of none", #
  eq T.none, T.none intersect T.number, "0 ∩ N"
  eq T.none, T.none intersect T.string-or-number, "0 ∩ (S|N)"
  eq T.none, T.none intersect T.any, "0 ∩ *"
  eq T.none, T.none intersect T.none, "0 ∩ 0"
  eq T.none, T.none intersect T.array, "0 ∩ [*]"
  eq T.none, T.none intersect T.number.array(), "0 ∩ [N]"
  eq T.none, T.none intersect ~T.number, "0 ∩ -N"

test "Intersection of any", #
  eq T.number, T.any intersect T.number, "* ∩ N"
  eq T.string-or-number, T.any intersect T.string-or-number, "* ∩ (S|N)"
  eq T.any, T.any intersect T.any, "* ∩ *"
  eq T.none, T.any intersect T.none, "* ∩ 0"
  eq T.array, T.any intersect T.array, "* ∩ [*]"
  eq T.number.array(), T.any intersect T.number.array(), "* ∩ [N]"
  let not-number = ~T.number
  eq not-number, T.any intersect not-number, "* ∩ -N"

test "Intersection of specialized array", #
  eq T.none, T.number.array() intersect T.number, "[N] ∩ N"
  eq T.none, T.number.array() intersect T.string, "[N] ∩ S"
  eq T.none, T.number.array() intersect T.string-or-number, "[N] ∩ (S|N)"
  eq T.number.array(), T.number.array() intersect T.any, "[N] ∩ *"
  eq T.none, T.number.array() intersect T.none, "[N] ∩ 0"
  eq T.number.array(), T.number.array() intersect T.array, "[N] ∩ [*]"
  eq T.number.array(), T.number.array() intersect T.number.array(), "[N] ∩ [N]"
  eq T.none.array(), T.number.array() intersect T.string.array(), "[N] ∩ [S]"
  eq T.number.array(), T.number.array() intersect ~T.number, "[N] ∩ -N"
  eq T.none, T.number.array() intersect ~T.number.array(), "[N] ∩ -[N]"

test "Intersection of array", #
  eq T.none, T.array intersect T.number, "[*] ∩ N"
  eq T.none, T.array intersect T.string, "[*] ∩ S"
  eq T.none, T.array intersect T.string-or-number, "[*] ∩ (S|N)"
  eq T.array, T.array intersect T.any, "[*] ∩ *"
  eq T.none, T.array intersect T.none, "[*] ∩ 0"
  eq T.array, T.array intersect T.array, "[*] ∩ [*]"
  eq T.number.array(), T.array intersect T.number.array(), "[*] ∩ [N]"
  eq T.array, T.array intersect ~T.number, "[*] ∩ -N"
  eq T.none, T.array intersect ~T.array, "[*] ∩ -[*]"

test "Arrays", #
  eq "[any]", T.array.to-string()
  eq "[Boolean]", T.boolean.array().to-string()
  eq "[String]", T.string.array().to-string()
  eq "[[String]]", T.string.array().array().to-string()
  ok T.boolean.array() equals T.boolean.array()
  ok T.string.array() equals T.string.array()
  ok T.boolean.array() not equals T.string.array()
  ok T.array overlaps T.boolean.array()
  ok T.boolean.array() overlaps T.array
  ok T.boolean.array() subset T.array
  ok T.array not subset T.boolean
  eq T.array, T.boolean.array() union T.array
  
  ok T.array equals T.any.array()

test "Making types", #
  let alpha = T.make("Alpha")
  let bravo = T.make("Bravo")
  eq "Alpha", alpha.to-string()
  eq "Bravo", bravo.to-string()
  eq "(Alpha|Bravo)", (alpha union bravo).to-string()
  eq "(Alpha|Bravo)", (bravo union alpha).to-string()
  ok (alpha union bravo) equals (bravo union alpha)
  eq "[Alpha]", alpha.array().to-string()
  eq "[Bravo]", bravo.array().to-string()
  eq "[(Alpha|Bravo)]", (alpha union bravo).array().to-string()
  ok (alpha union bravo).array() equals (bravo union alpha).array()
  eq "([Alpha]|[Bravo])", (alpha.array() union bravo.array()).to-string()
  ok (alpha.array() union bravo.array()) equals (bravo.array() union alpha.array())
  ok (alpha union bravo).array() not equals (alpha.array() union bravo.array())

  ok T.make("Alpha") not equals alpha // could be from different scopes
  ok T.make("Alpha").compare(T.make("Alpha")) != 0 // since not equal, should not compare to 0
