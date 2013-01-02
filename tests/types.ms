let T = require '../lib/types'

test "Basic string representation", #
  eq "undefined", T.undefined.toString()
  eq "null", T.null.toString()
  eq "String", T.string.toString()
  eq "Number", T.number.toString()
  eq "Boolean", T.boolean.toString()
  eq "Function", T.function.toString()
  eq "Object", T.object.toString()
  eq "[any]", T.array.toString()
  eq "Arguments", T.args.toString()
  eq "any", T.any.toString()
  eq "none", T.none.toString()
  eq "RegExp", T.regexp.toString()
  eq "(Number|String)", T.stringOrNumber.toString()
  eq "([any]|Arguments)", T.arrayLike.toString()
  eq "(null|undefined)", T.undefinedOrNull.toString()
  eq "any \\ (null|undefined)", T.notUndefinedOrNull.toString()
  eq "(Boolean|Number|String|null|undefined)", T.primitive.toString()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.nonPrimitive.toString()
  eq "(null|undefined)", T.alwaysFalsy.toString()
  eq "any \\ (null|undefined)", T.potentiallyTruthy.toString()
  eq "(Boolean|Number|String|null|undefined)", T.potentiallyFalsy.toString()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.alwaysTruthy.toString()

let U(head, ...rest)
  let mutable current = head
  for item in rest
    current := current.union(item)
  current
let I(head, ...rest)
  let mutable current = head
  for item in rest
    current := current.intersect(item)
  current
let C(type)
  type.complement()

test "Complement", #
  eq T.any, C(T.none)
  eq T.none, C(T.any)
  
  eq "any \\ Boolean", C(T.boolean).toString()
  eq "any \\ Function", C(T.function).toString()
  eq "any \\ (Boolean|Function)", C(U(T.boolean, T.function)).toString()
  eq "any \\ [Boolean]", C(T.boolean.array()).toString()
  eq "any \\ [any]", C(T.array).toString()
  
  ok C(C(T.boolean)).equals(T.boolean)
  ok C(C(U(T.boolean, T.function))).equals(U(T.boolean, T.function))
  ok C(C(T.boolean.array())).equals(U(T.boolean.array()))
  
  eq T.any, U(C(T.boolean), C(T.string))
  ok C(U(T.boolean, T.string)).equals(I(C(T.boolean), C(T.string)))

test "Subset of simple", #
  ok T.number.isSubsetOf(T.number), "N ⊆ N"
  ok not T.number.isSubsetOf(T.string), "N ⊆ S"
  ok T.number.isSubsetOf(T.stringOrNumber), "N ⊆ (S|N)"
  ok T.number.isSubsetOf(C(T.string)), "N ⊆ -S"
  ok not T.number.isSubsetOf(C(T.number)), "N ⊆ -N"
  ok T.number.isSubsetOf(T.any), "N ⊆ *"
  ok not T.number.isSubsetOf(T.none), "N ⊆ 0"
  ok not T.number.isSubsetOf(T.number.array()), "N ⊆ [N]"

test "Subset of union", #
  ok not T.stringOrNumber.isSubsetOf(T.number), "(S|N) ⊆ N"
  ok T.stringOrNumber.isSubsetOf(T.stringOrNumber), "(S|N) ⊆ (S|N)"
  ok not T.stringOrNumber.isSubsetOf(U(T.number, T.boolean)), "(S|N) ⊆ (N|B)"
  ok T.stringOrNumber.isSubsetOf(U(T.boolean, T.stringOrNumber)), "(S|N) ⊆ (S|N|B)"
  ok T.stringOrNumber.isSubsetOf(T.any), "(S|N) ⊆ *"
  ok not T.stringOrNumber.isSubsetOf(T.none), "(S|N) ⊆ 0"
  ok not T.stringOrNumber.isSubsetOf(T.number.array()), "(S|N) ⊆ [N]"
  ok not T.stringOrNumber.isSubsetOf(T.stringOrNumber.array()), "(S|N) ⊆ [(S|N)]"
  ok T.stringOrNumber.isSubsetOf(C(T.boolean)), "(S|N) ⊆ -B"
  ok not T.stringOrNumber.isSubsetOf(C(T.number)), "(S|N) ⊆ -N"
  ok not T.stringOrNumber.isSubsetOf(C(T.string)), "(S|N) ⊆ -S"
  ok not T.stringOrNumber.isSubsetOf(C(T.stringOrNumber)), "(S|N) ⊆ -(S|N)"

test "Subset of complement", #
  ok not C(T.number).isSubsetOf(T.number), "-N ⊆ N"
  ok not C(T.number).isSubsetOf(T.string), "-N ⊆ S"
  ok not C(T.number).isSubsetOf(T.stringOrNumber), "-N ⊆ (S|N)"
  ok not C(T.number).isSubsetOf(U(T.boolean, T.string)), "-N ⊆ (S|B)"
  ok C(T.number).isSubsetOf(T.any), "-N ⊆ *"
  ok not C(T.number).isSubsetOf(T.none), "-N ⊆ 0"
  ok not C(T.number).isSubsetOf(T.array), "-N ⊆ [*]"
  ok not C(T.number).isSubsetOf(T.number.array()), "-N ⊆ [N]"
  ok not C(T.number).isSubsetOf(C(T.number.array())), "-N ⊆ [-N]"
  ok C(T.number).isSubsetOf(C(T.number)), "-N ⊆ -N"
  ok not C(T.number).isSubsetOf(C(T.string)), "-N ⊆ -S"

test "Subset of none", #
  ok T.none.isSubsetOf(T.number), "0 ⊆ N"
  ok T.none.isSubsetOf(T.stringOrNumber), "0 ⊆ (S|N)"
  ok T.none.isSubsetOf(T.any), "0 ⊆ *"
  ok T.none.isSubsetOf(T.none), "0 ⊆ 0"
  ok T.none.isSubsetOf(T.array), "0 ⊆ [*]"
  ok T.none.isSubsetOf(T.number.array()), "0 ⊆ [N]"
  ok T.none.isSubsetOf(C(T.number)), "0 ⊆ -N"

test "Subset of any", #
  ok not T.any.isSubsetOf(T.number), "* ⊆ N"
  ok not T.any.isSubsetOf(T.stringOrNumber), "* ⊆ (S|N)"
  ok T.any.isSubsetOf(T.any), "* ⊆ *"
  ok not T.any.isSubsetOf(T.none), "* ⊆ 0"
  ok not T.any.isSubsetOf(T.array), "* ⊆ [*]"
  ok not T.any.isSubsetOf(T.number.array()), "* ⊆ [N]"
  ok not T.any.isSubsetOf(C(T.number)), "* ⊆ -N"

test "Subset of specialized array", #
  ok not T.number.array().isSubsetOf(T.number), "[N] ⊆ N"
  ok not T.number.array().isSubsetOf(T.string), "[N] ⊆ S"
  ok not T.number.array().isSubsetOf(T.stringOrNumber), "[N] ⊆ (S|N)"
  ok T.number.array().isSubsetOf(T.any), "[N] ⊆ *"
  ok not T.number.array().isSubsetOf(T.none), "[N] ⊆ 0"
  ok T.number.array().isSubsetOf(T.array), "[N] ⊆ [*]"
  ok T.number.array().isSubsetOf(T.number.array()), "[N] ⊆ [N]"
  ok not T.number.array().isSubsetOf(T.string.array()), "[N] ⊆ [S]"
  ok T.number.array().isSubsetOf(C(T.number)), "[N] ⊆ -N"

test "Subset of array", #
  ok not T.array.isSubsetOf(T.number), "[*] ⊆ N"
  ok not T.array.isSubsetOf(T.string), "[*] ⊆ S"
  ok not T.array.isSubsetOf(T.stringOrNumber), "[*] ⊆ (S|N)"
  ok T.array.isSubsetOf(T.any), "[*] ⊆ *"
  ok not T.array.isSubsetOf(T.none), "[*] ⊆ 0"
  ok T.array.isSubsetOf(T.array), "[*] ⊆ [*]"
  ok not T.array.isSubsetOf(T.number.array()), "[*] ⊆ [N]"
  ok T.array.isSubsetOf(C(T.number)), "[*] ⊆ -N"

test "Overlap of simple", #
  ok T.number.overlaps(T.number), "N ∩ N"
  ok not T.number.overlaps(T.string), "N ∩ S"
  ok T.number.overlaps(T.stringOrNumber), "N ∩ (S|N)"
  ok T.number.overlaps(C(T.string)), "N ∩ -S"
  ok not T.number.overlaps(C(T.number)), "N ∩ -N"
  ok T.number.overlaps(T.any), "N ∩ *"
  ok not T.number.overlaps(T.none), "N ∩ 0"
  ok not T.number.overlaps(T.number.array()), "N ∩ [N]"

test "Overlap of union", #
  ok T.stringOrNumber.overlaps(T.number), "(S|N) ∩ N"
  ok T.stringOrNumber.overlaps(T.stringOrNumber), "(S|N) ∩ (S|N)"
  ok T.stringOrNumber.overlaps(U(T.number, T.boolean)), "(S|N) ∩ (N|B)"
  ok T.stringOrNumber.overlaps(U(T.boolean, T.stringOrNumber)), "(S|N) ∩ (S|N|B)"
  ok not T.stringOrNumber.overlaps(U(T.boolean, T.function)), "(S|N) ∩ (B|F)"
  ok T.stringOrNumber.overlaps(T.any), "(S|N) ∩ *"
  ok not T.stringOrNumber.overlaps(T.none), "(S|N) ∩ 0"
  ok not T.stringOrNumber.overlaps(T.number.array()), "(S|N) ∩ [N]"
  ok not T.stringOrNumber.overlaps(T.stringOrNumber.array()), "(S|N) ∩ [(S|N)]"
  ok T.stringOrNumber.overlaps(C(T.boolean)), "(S|N) ∩ -B"
  ok T.stringOrNumber.overlaps(C(T.number)), "(S|N) ∩ -N"
  ok T.stringOrNumber.overlaps(C(T.string)), "(S|N) ∩ -S"
  ok not T.stringOrNumber.overlaps(C(T.stringOrNumber)), "(S|N) ∩ -(S|N)"

test "Overlap of complement", #
  ok not C(T.number).overlaps(T.number), "-N ∩ N"
  ok C(T.number).overlaps(T.string), "-N ∩ S"
  ok C(T.number).overlaps(T.stringOrNumber), "-N ∩ (S|N)"
  ok C(T.number).overlaps(U(T.boolean, T.string)), "-N ∩ (S|B)"
  ok C(T.number).overlaps(T.any), "-N ∩ *"
  ok not C(T.number).overlaps(T.none), "-N ∩ 0"
  ok C(T.number).overlaps(T.array), "-N ∩ [*]"
  ok C(T.number).overlaps(T.number.array()), "-N ∩ [N]"
  ok C(T.number).overlaps(C(T.number.array())), "-N ∩ [-N]"
  ok C(T.number).overlaps(C(T.number)), "-N ∩ -N"
  ok C(T.number).overlaps(C(T.string)), "-N ∩ -S"

test "Overlap of none", #
  ok not T.none.overlaps(T.number), "0 ∩ N"
  ok not T.none.overlaps(T.stringOrNumber), "0 ∩ (S|N)"
  ok not T.none.overlaps(T.any), "0 ∩ *"
  ok not T.none.overlaps(T.none), "0 ∩ 0"
  ok not T.none.overlaps(T.array), "0 ∩ [*]"
  ok not T.none.overlaps(T.number.array()), "0 ∩ [N]"
  ok not T.none.overlaps(C(T.number)), "0 ∩ -N"

test "Overlap of any", #
  ok T.any.overlaps(T.number), "* ∩ N"
  ok T.any.overlaps(T.stringOrNumber), "* ∩ (S|N)"
  ok T.any.overlaps(T.any), "* ∩ *"
  ok T.any.overlaps(T.none), "* ∩ 0"
  ok T.any.overlaps(T.array), "* ∩ [*]"
  ok T.any.overlaps(T.number.array()), "* ∩ [N]"
  ok T.any.overlaps(C(T.number)), "* ∩ -N"

test "Overlap of specialized array", #
  ok not T.number.array().overlaps(T.number), "[N] ∩ N"
  ok not T.number.array().overlaps(T.string), "[N] ∩ S"
  ok not T.number.array().overlaps(T.stringOrNumber), "[N] ∩ (S|N)"
  ok T.number.array().overlaps(T.any), "[N] ∩ *"
  ok not T.number.array().overlaps(T.none), "[N] ∩ 0"
  ok T.number.array().overlaps(T.array), "[N] ∩ [*]"
  ok T.number.array().overlaps(T.number.array()), "[N] ∩ [N]"
  ok not T.number.array().overlaps(T.string.array()), "[N] ∩ [S]"
  ok T.number.array().overlaps(C(T.number)), "[N] ∩ -N"

test "Overlap of array", #
  ok not T.array.overlaps(T.number), "[*] ∩ N"
  ok not T.array.overlaps(T.string), "[*] ∩ S"
  ok not T.array.overlaps(T.stringOrNumber), "[*] ∩ (S|N)"
  ok T.array.overlaps(T.any), "[*] ∩ *"
  ok not T.array.overlaps(T.none), "[*] ∩ 0"
  ok T.array.overlaps(T.array), "[*] ∩ [*]"
  ok T.array.overlaps(T.number.array()), "[*] ∩ [N]"
  ok T.array.overlaps(C(T.number)), "[*] ∩ -N"

test "Union of simple", #
  eq T.number, U(T.number, T.number), "N ∪ N"
  ok U(T.number, T.string).equals(T.stringOrNumber), "N ∪ S"
  ok U(T.number, T.stringOrNumber).equals(T.stringOrNumber), "N ∪ (S|N)"
  ok U(T.number, C(T.string)).equals(C(T.string)), "N ∪ -S"
  eq T.any, U(T.number, C(T.number)), "N ∪ -N"
  eq T.any, U(T.number, T.any), "N ∪ *"
  eq T.number, U(T.number, T.none), "N ∪ 0"
  ok U(T.number, T.number.array()).equals(U(T.number.array(), T.number)), "N ∪ [N]"
  eq "([Number]|Number)", U(T.number, T.number.array()).toString()

test "Union of union", #
  eq T.stringOrNumber, U(T.stringOrNumber, T.number), "(S|N) ∪ N"
  eq T.stringOrNumber, U(T.stringOrNumber, T.stringOrNumber), "(S|N) ∪ (S|N)"
  ok U(T.stringOrNumber, U(T.number, T.boolean)).equals(U(T.string, T.number, T.boolean)), "(S|N) ∪ (N|B)"
  ok U(T.stringOrNumber, U(T.boolean, T.stringOrNumber)).equals(U(T.string, T.number, T.boolean)), "(S|N) ∪ (S|N|B)"
  eq T.any, U(T.stringOrNumber, T.any), "(S|N) ∪ *"
  eq T.stringOrNumber, U(T.stringOrNumber, T.none), "(S|N) ∪ 0"
  ok U(T.stringOrNumber, T.number.array()).equals(U(T.string, T.number, T.number.array())), "(S|N) ∪ [N]"
  eq "([Number]|Number|String)", U(T.string, T.number, T.number.array()).toString()
  ok not U(T.stringOrNumber, T.stringOrNumber.array()).equals(T.string, T.number, U(T.number, T.string).array()), "(S|N) ∪ [(S|N)]"
  eq "([(Number|String)]|Number|String)", U(T.stringOrNumber, T.stringOrNumber.array()).toString()
  ok U(T.stringOrNumber, C(T.boolean)).equals(C(T.boolean)), "(S|N) ∪ -B"
  eq T.any, U(T.stringOrNumber, C(T.number)), "(S|N) ∪ -N"
  eq T.any, U(T.stringOrNumber, C(T.string)), "(S|N) ∪ -S"
  eq T.any, U(T.stringOrNumber, C(T.stringOrNumber)), "(S|N) ∪ -(S|N)"

test "Union of complement", #
  let notNumber = C(T.number)
  eq T.any, U(notNumber, T.number), "-N ∪ N"
  eq notNumber, U(notNumber, T.string), "-N ∪ S"
  eq T.any, U(notNumber, T.stringOrNumber), "-N ∪ (S|N)"
  eq notNumber, U(notNumber, U(T.boolean, T.string)), "-N ∪ (S|B)"
  eq T.any, U(notNumber, T.any), "-N ∪ *"
  eq notNumber, U(notNumber, T.none), "-N ∪ 0"
  eq notNumber, U(notNumber, T.array), "-N ∪ [*]"
  eq notNumber, U(notNumber, T.number.array()), "-N ∪ [N]"
  eq notNumber, U(notNumber, C(T.number).array()), "-N ∪ [-N]"
  eq T.any, U(notNumber, C(T.number.array())), "-N ∪ -[N]"
  ok U(notNumber, C(T.number)).equals(notNumber), "-N ∪ -N"
  eq T.any, U(notNumber, C(T.string)), "-N ∪ -S"

test "Union of none", #
  eq T.number, U(T.none, T.number), "0 ∪ N"
  eq T.stringOrNumber, U(T.none, T.stringOrNumber), "0 ∪ (S|N)"
  eq T.any, U(T.none, T.any), "0 ∪ *"
  eq T.none, U(T.none, T.none), "0 ∪ 0"
  eq T.array, U(T.none, T.array), "0 ∪ [*]"
  eq T.number.array(), U(T.none, T.number.array()), "0 ∪ [N]"
  let notNumber = C(T.number)
  eq notNumber, U(T.none, notNumber), "0 ∪ -N"

test "Union of any", #
  eq T.any, U(T.any, T.number), "* ∪ N"
  eq T.any, U(T.any, T.stringOrNumber), "* ∪ (S|N)"
  eq T.any, U(T.any, T.any), "* ∪ *"
  eq T.any, U(T.any, T.none), "* ∪ 0"
  eq T.any, U(T.any, T.array), "* ∪ [*]"
  eq T.any, U(T.any, T.number.array()), "* ∪ [N]"
  eq T.any, U(T.any, C(T.number)), "* ∪ -N"

test "Union of specialized array", #
  eq "([Number]|Number)", U(T.number.array(), T.number).toString(), "[N] ∪ N"
  eq "([Number]|String)", U(T.number.array(), T.string).toString(), "[N] ∪ S"
  eq "([Number]|Number|String)", U(T.number.array(), T.stringOrNumber).toString(), "[N] ∪ (S|N)"
  eq T.any, U(T.number.array(), T.any), "[N] ∪ *"
  eq T.number.array(), U(T.number.array(),T.none), "[N] ∪ 0"
  eq T.array, U(T.number.array(), T.array), "[N] ∪ [*]"
  eq T.number.array(), U(T.number.array(), T.number.array()), "[N] ∪ [N]"
  eq "([Number]|[String])", U(T.number.array(), T.string.array()).toString(), "[N] ∪ [S]"
  let notNumber = C(T.number)
  eq notNumber, U(T.number.array(), notNumber), "[N] ∪ -N"
  eq T.any, U(T.number.array(), C(T.number.array())), "[N] ∪ -[N]"

test "Union of array", #
  eq "([any]|Number)", U(T.array, T.number).toString(), "[*] ∪ N"
  eq "([any]|String)", U(T.array, T.string).toString(), "[*] ∪ S"
  eq "([any]|Number|String)", U(T.array, T.stringOrNumber).toString(), "[*] ∪ (S|N)"
  eq T.any, U(T.array, T.any), "[*] ∪ *"
  eq T.array, U(T.array, T.none), "[*] ∪ 0"
  eq T.array, U(T.array, T.array), "[*] ∪ [*]"
  eq T.array, U(T.array, T.number.array()), "[*] ∪ [N]"
  let notNumber = C(T.number)
  eq notNumber, U(T.array, notNumber), "[*] ∪ -N"
  eq T.any, U(T.array, C(T.array)), "[*] ∪ -[*]"

test "Intersection of simple", #
  eq T.number, I(T.number, T.number), "N ∩ N"
  eq T.none, I(T.number, T.string), "N ∩ S"
  eq T.number, I(T.number, T.stringOrNumber), "N ∩ (S|N)"
  eq T.number, I(T.number, C(T.string)), "N ∩ -S"
  eq T.none, I(T.number, C(T.number)), "N ∩ -N"
  eq T.number, I(T.number, T.any), "N ∩ *"
  eq T.none, I(T.number, T.none), "N ∩ 0"
  eq T.none, I(T.number, T.number.array()), "N ∩ [N]"

test "Intersection of union", #
  eq T.number, I(T.stringOrNumber, T.number), "(S|N) ∩ N"
  eq T.stringOrNumber, I(T.stringOrNumber, T.stringOrNumber), "(S|N) ∩ (S|N)"
  eq T.number, I(T.stringOrNumber, U(T.number, T.boolean)), "(S|N) ∩ (N|B)"
  eq T.stringOrNumber, I(T.stringOrNumber, U(T.boolean, T.stringOrNumber)), "(S|N) ∩ (S|N|B)"
  eq T.stringOrNumber, I(T.stringOrNumber, T.any), "(S|N) ∩ *"
  eq T.none, I(T.stringOrNumber, T.none), "(S|N) ∩ 0"
  eq T.none, I(T.stringOrNumber, T.number.array()), "(S|N) ∩ [N]"
  eq T.none, I(T.stringOrNumber, T.stringOrNumber.array()), "(S|N) ∩ [(S|N)]"
  eq T.stringOrNumber, I(T.stringOrNumber, C(T.boolean)), "(S|N) ∩ -B"
  eq T.string, I(T.stringOrNumber, C(T.number)), "(S|N) ∩ -N"
  eq T.number, I(T.stringOrNumber, C(T.string)), "(S|N) ∩ -S"
  eq T.none, I(T.stringOrNumber, C(T.stringOrNumber)), "(S|N) ∩ -(S|N)"

test "Intersection of complement", #
  let notNumber = C(T.number)
  eq T.none, I(notNumber, T.number), "-N ∩ N"
  eq T.string, I(notNumber, T.string), "-N ∩ S"
  eq T.string, I(notNumber, T.stringOrNumber), "-N ∩ (S|N)"
  let boolOrString = I(T.boolean, T.string)
  eq boolOrString, I(notNumber, boolOrString), "-N ∩ (S|B)"
  eq notNumber, I(notNumber, T.any), "-N ∩ *"
  eq T.none, I(notNumber, T.none), "-N ∩ 0"
  eq T.array, I(notNumber, T.array), "-N ∩ [*]"
  eq T.number.array(), I(notNumber, T.number.array()), "-N ∩ [N]"
  ok I(notNumber, C(T.number).array()).equals(C(T.number).array()), "-N ∩ [-N]"
  ok I(notNumber, C(T.number.array())).equals(C(U(T.number, T.number.array()))), "-N ∩ -[N]"
  ok I(notNumber, C(T.number)).equals(notNumber), "-N ∩ -N"
  ok I(notNumber, C(T.string)).equals(C(T.stringOrNumber)), "-N ∩ -S"

test "Intersection of none", #
  eq T.none, I(T.none, T.number), "0 ∩ N"
  eq T.none, I(T.none, T.stringOrNumber), "0 ∩ (S|N)"
  eq T.none, I(T.none, T.any), "0 ∩ *"
  eq T.none, I(T.none, T.none), "0 ∩ 0"
  eq T.none, I(T.none, T.array), "0 ∩ [*]"
  eq T.none, I(T.none, T.number.array()), "0 ∩ [N]"
  eq T.none, I(T.none, C(T.number)), "0 ∩ -N"

test "Intersection of any", #
  eq T.number, I(T.any, T.number), "* ∩ N"
  eq T.stringOrNumber, I(T.any, T.stringOrNumber), "* ∩ (S|N)"
  eq T.any, I(T.any, T.any), "* ∩ *"
  eq T.none, I(T.any, T.none), "* ∩ 0"
  eq T.array, I(T.any, T.array), "* ∩ [*]"
  eq T.number.array(), I(T.any, T.number.array()), "* ∩ [N]"
  let notNumber = C(T.number)
  eq notNumber, I(T.any, notNumber), "* ∩ -N"

test "Intersection of specialized array", #
  eq T.none, I(T.number.array(), T.number), "[N] ∩ N"
  eq T.none, I(T.number.array(), T.string), "[N] ∩ S"
  eq T.none, I(T.number.array(), T.stringOrNumber), "[N] ∩ (S|N)"
  eq T.number.array(), I(T.number.array(), T.any), "[N] ∩ *"
  eq T.none, I(T.number.array(), T.none), "[N] ∩ 0"
  eq T.number.array(), I(T.number.array(), T.array), "[N] ∩ [*]"
  eq T.number.array(), I(T.number.array(), T.number.array()), "[N] ∩ [N]"
  eq T.none.array(), I(T.number.array(), T.string.array()), "[N] ∩ [S]"
  eq T.number.array(), I(T.number.array(), C(T.number)), "[N] ∩ -N"
  eq T.none, I(T.number.array(), C(T.number.array())), "[N] ∩ -[N]"

test "Intersection of array", #
  eq T.none, I(T.array, T.number), "[*] ∩ N"
  eq T.none, I(T.array, T.string), "[*] ∩ S"
  eq T.none, I(T.array, T.stringOrNumber), "[*] ∩ (S|N)"
  eq T.array, I(T.array, T.any), "[*] ∩ *"
  eq T.none, I(T.array, T.none), "[*] ∩ 0"
  eq T.array, I(T.array, T.array), "[*] ∩ [*]"
  eq T.number.array(), I(T.array, T.number.array()), "[*] ∩ [N]"
  eq T.array, I(T.array, C(T.number)), "[*] ∩ -N"
  eq T.none, I(T.array, C(T.array)), "[*] ∩ -[*]"

test "Arrays", #
  eq "[any]", T.array.toString()
  eq "[Boolean]", T.boolean.array().toString()
  eq "[String]", T.string.array().toString()
  eq "[[String]]", T.string.array().array().toString()
  ok T.boolean.array().equals(T.boolean.array())
  ok T.string.array().equals(T.string.array())
  ok not T.boolean.array().equals(T.string.array())
  ok T.array.overlaps(T.boolean.array())
  ok T.boolean.array().overlaps(T.array)
  ok T.boolean.array().isSubsetOf(T.array)
  ok not T.array.isSubsetOf(T.boolean)
  eq T.array, U(T.boolean.array(), T.array)
  
  ok T.array.equals(T.any.array())

test "Making types", #
  let alpha = T.make("Alpha")
  let bravo = T.make("Bravo")
  eq "Alpha", alpha.toString()
  eq "Bravo", bravo.toString()
  eq "(Alpha|Bravo)", U(alpha, bravo).toString()
  eq "(Alpha|Bravo)", U(bravo, alpha).toString()
  ok U(alpha, bravo).equals(U(bravo, alpha))
  eq "[Alpha]", alpha.array().toString()
  eq "[Bravo]", bravo.array().toString()
  eq "[(Alpha|Bravo)]", U(alpha, bravo).array().toString()
  ok U(alpha, bravo).array().equals(U(bravo, alpha).array())
  eq "([Alpha]|[Bravo])", U(alpha.array(), bravo.array()).toString()
  ok U(alpha.array(), bravo.array()).equals(U(bravo.array(), alpha.array()))
  ok not U(alpha, bravo).array().equals(U(alpha.array(), bravo.array()))

  ok not T.make("Alpha").equals(alpha) // could be from different scopes
  ok T.make("Alpha").compare(T.make("Alpha")) != 0 // since not equal, should not compare to 0
