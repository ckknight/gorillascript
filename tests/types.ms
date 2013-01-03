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
  
  eq "any \\ Boolean", C(T.boolean).to-string()
  eq "any \\ Function", C(T.function).to-string()
  eq "any \\ (Boolean|Function)", C(U(T.boolean, T.function)).to-string()
  eq "any \\ [Boolean]", C(T.boolean.array()).to-string()
  eq "any \\ [any]", C(T.array).to-string()
  
  ok C(C(T.boolean)).equals(T.boolean)
  ok C(C(U(T.boolean, T.function))).equals(U(T.boolean, T.function))
  ok C(C(T.boolean.array())).equals(U(T.boolean.array()))
  
  eq T.any, U(C(T.boolean), C(T.string))
  ok C(U(T.boolean, T.string)).equals(I(C(T.boolean), C(T.string)))

test "Subset of simple", #
  ok T.number.is-subset-of(T.number), "N ⊆ N"
  ok not T.number.is-subset-of(T.string), "N ⊆ S"
  ok T.number.is-subset-of(T.string-or-number), "N ⊆ (S|N)"
  ok T.number.is-subset-of(C(T.string)), "N ⊆ -S"
  ok not T.number.is-subset-of(C(T.number)), "N ⊆ -N"
  ok T.number.is-subset-of(T.any), "N ⊆ *"
  ok not T.number.is-subset-of(T.none), "N ⊆ 0"
  ok not T.number.is-subset-of(T.number.array()), "N ⊆ [N]"

test "Subset of union", #
  ok not T.string-or-number.is-subset-of(T.number), "(S|N) ⊆ N"
  ok T.string-or-number.is-subset-of(T.string-or-number), "(S|N) ⊆ (S|N)"
  ok not T.string-or-number.is-subset-of(U(T.number, T.boolean)), "(S|N) ⊆ (N|B)"
  ok T.string-or-number.is-subset-of(U(T.boolean, T.string-or-number)), "(S|N) ⊆ (S|N|B)"
  ok T.string-or-number.is-subset-of(T.any), "(S|N) ⊆ *"
  ok not T.string-or-number.is-subset-of(T.none), "(S|N) ⊆ 0"
  ok not T.string-or-number.is-subset-of(T.number.array()), "(S|N) ⊆ [N]"
  ok not T.string-or-number.is-subset-of(T.string-or-number.array()), "(S|N) ⊆ [(S|N)]"
  ok T.string-or-number.is-subset-of(C(T.boolean)), "(S|N) ⊆ -B"
  ok not T.string-or-number.is-subset-of(C(T.number)), "(S|N) ⊆ -N"
  ok not T.string-or-number.is-subset-of(C(T.string)), "(S|N) ⊆ -S"
  ok not T.string-or-number.is-subset-of(C(T.string-or-number)), "(S|N) ⊆ -(S|N)"

test "Subset of complement", #
  ok not C(T.number).is-subset-of(T.number), "-N ⊆ N"
  ok not C(T.number).is-subset-of(T.string), "-N ⊆ S"
  ok not C(T.number).is-subset-of(T.string-or-number), "-N ⊆ (S|N)"
  ok not C(T.number).is-subset-of(U(T.boolean, T.string)), "-N ⊆ (S|B)"
  ok C(T.number).is-subset-of(T.any), "-N ⊆ *"
  ok not C(T.number).is-subset-of(T.none), "-N ⊆ 0"
  ok not C(T.number).is-subset-of(T.array), "-N ⊆ [*]"
  ok not C(T.number).is-subset-of(T.number.array()), "-N ⊆ [N]"
  ok not C(T.number).is-subset-of(C(T.number.array())), "-N ⊆ [-N]"
  ok C(T.number).is-subset-of(C(T.number)), "-N ⊆ -N"
  ok not C(T.number).is-subset-of(C(T.string)), "-N ⊆ -S"

test "Subset of none", #
  ok T.none.is-subset-of(T.number), "0 ⊆ N"
  ok T.none.is-subset-of(T.string-or-number), "0 ⊆ (S|N)"
  ok T.none.is-subset-of(T.any), "0 ⊆ *"
  ok T.none.is-subset-of(T.none), "0 ⊆ 0"
  ok T.none.is-subset-of(T.array), "0 ⊆ [*]"
  ok T.none.is-subset-of(T.number.array()), "0 ⊆ [N]"
  ok T.none.is-subset-of(C(T.number)), "0 ⊆ -N"

test "Subset of any", #
  ok not T.any.is-subset-of(T.number), "* ⊆ N"
  ok not T.any.is-subset-of(T.string-or-number), "* ⊆ (S|N)"
  ok T.any.is-subset-of(T.any), "* ⊆ *"
  ok not T.any.is-subset-of(T.none), "* ⊆ 0"
  ok not T.any.is-subset-of(T.array), "* ⊆ [*]"
  ok not T.any.is-subset-of(T.number.array()), "* ⊆ [N]"
  ok not T.any.is-subset-of(C(T.number)), "* ⊆ -N"

test "Subset of specialized array", #
  ok not T.number.array().is-subset-of(T.number), "[N] ⊆ N"
  ok not T.number.array().is-subset-of(T.string), "[N] ⊆ S"
  ok not T.number.array().is-subset-of(T.string-or-number), "[N] ⊆ (S|N)"
  ok T.number.array().is-subset-of(T.any), "[N] ⊆ *"
  ok not T.number.array().is-subset-of(T.none), "[N] ⊆ 0"
  ok T.number.array().is-subset-of(T.array), "[N] ⊆ [*]"
  ok T.number.array().is-subset-of(T.number.array()), "[N] ⊆ [N]"
  ok not T.number.array().is-subset-of(T.string.array()), "[N] ⊆ [S]"
  ok T.number.array().is-subset-of(C(T.number)), "[N] ⊆ -N"

test "Subset of array", #
  ok not T.array.is-subset-of(T.number), "[*] ⊆ N"
  ok not T.array.is-subset-of(T.string), "[*] ⊆ S"
  ok not T.array.is-subset-of(T.string-or-number), "[*] ⊆ (S|N)"
  ok T.array.is-subset-of(T.any), "[*] ⊆ *"
  ok not T.array.is-subset-of(T.none), "[*] ⊆ 0"
  ok T.array.is-subset-of(T.array), "[*] ⊆ [*]"
  ok not T.array.is-subset-of(T.number.array()), "[*] ⊆ [N]"
  ok T.array.is-subset-of(C(T.number)), "[*] ⊆ -N"

test "Overlap of simple", #
  ok T.number.overlaps(T.number), "N ∩ N"
  ok not T.number.overlaps(T.string), "N ∩ S"
  ok T.number.overlaps(T.string-or-number), "N ∩ (S|N)"
  ok T.number.overlaps(C(T.string)), "N ∩ -S"
  ok not T.number.overlaps(C(T.number)), "N ∩ -N"
  ok T.number.overlaps(T.any), "N ∩ *"
  ok not T.number.overlaps(T.none), "N ∩ 0"
  ok not T.number.overlaps(T.number.array()), "N ∩ [N]"

test "Overlap of union", #
  ok T.string-or-number.overlaps(T.number), "(S|N) ∩ N"
  ok T.string-or-number.overlaps(T.string-or-number), "(S|N) ∩ (S|N)"
  ok T.string-or-number.overlaps(U(T.number, T.boolean)), "(S|N) ∩ (N|B)"
  ok T.string-or-number.overlaps(U(T.boolean, T.string-or-number)), "(S|N) ∩ (S|N|B)"
  ok not T.string-or-number.overlaps(U(T.boolean, T.function)), "(S|N) ∩ (B|F)"
  ok T.string-or-number.overlaps(T.any), "(S|N) ∩ *"
  ok not T.string-or-number.overlaps(T.none), "(S|N) ∩ 0"
  ok not T.string-or-number.overlaps(T.number.array()), "(S|N) ∩ [N]"
  ok not T.string-or-number.overlaps(T.string-or-number.array()), "(S|N) ∩ [(S|N)]"
  ok T.string-or-number.overlaps(C(T.boolean)), "(S|N) ∩ -B"
  ok T.string-or-number.overlaps(C(T.number)), "(S|N) ∩ -N"
  ok T.string-or-number.overlaps(C(T.string)), "(S|N) ∩ -S"
  ok not T.string-or-number.overlaps(C(T.string-or-number)), "(S|N) ∩ -(S|N)"

test "Overlap of complement", #
  ok not C(T.number).overlaps(T.number), "-N ∩ N"
  ok C(T.number).overlaps(T.string), "-N ∩ S"
  ok C(T.number).overlaps(T.string-or-number), "-N ∩ (S|N)"
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
  ok not T.none.overlaps(T.string-or-number), "0 ∩ (S|N)"
  ok not T.none.overlaps(T.any), "0 ∩ *"
  ok not T.none.overlaps(T.none), "0 ∩ 0"
  ok not T.none.overlaps(T.array), "0 ∩ [*]"
  ok not T.none.overlaps(T.number.array()), "0 ∩ [N]"
  ok not T.none.overlaps(C(T.number)), "0 ∩ -N"

test "Overlap of any", #
  ok T.any.overlaps(T.number), "* ∩ N"
  ok T.any.overlaps(T.string-or-number), "* ∩ (S|N)"
  ok T.any.overlaps(T.any), "* ∩ *"
  ok T.any.overlaps(T.none), "* ∩ 0"
  ok T.any.overlaps(T.array), "* ∩ [*]"
  ok T.any.overlaps(T.number.array()), "* ∩ [N]"
  ok T.any.overlaps(C(T.number)), "* ∩ -N"

test "Overlap of specialized array", #
  ok not T.number.array().overlaps(T.number), "[N] ∩ N"
  ok not T.number.array().overlaps(T.string), "[N] ∩ S"
  ok not T.number.array().overlaps(T.string-or-number), "[N] ∩ (S|N)"
  ok T.number.array().overlaps(T.any), "[N] ∩ *"
  ok not T.number.array().overlaps(T.none), "[N] ∩ 0"
  ok T.number.array().overlaps(T.array), "[N] ∩ [*]"
  ok T.number.array().overlaps(T.number.array()), "[N] ∩ [N]"
  ok not T.number.array().overlaps(T.string.array()), "[N] ∩ [S]"
  ok T.number.array().overlaps(C(T.number)), "[N] ∩ -N"

test "Overlap of array", #
  ok not T.array.overlaps(T.number), "[*] ∩ N"
  ok not T.array.overlaps(T.string), "[*] ∩ S"
  ok not T.array.overlaps(T.string-or-number), "[*] ∩ (S|N)"
  ok T.array.overlaps(T.any), "[*] ∩ *"
  ok not T.array.overlaps(T.none), "[*] ∩ 0"
  ok T.array.overlaps(T.array), "[*] ∩ [*]"
  ok T.array.overlaps(T.number.array()), "[*] ∩ [N]"
  ok T.array.overlaps(C(T.number)), "[*] ∩ -N"

test "Union of simple", #
  eq T.number, U(T.number, T.number), "N ∪ N"
  ok U(T.number, T.string).equals(T.string-or-number), "N ∪ S"
  ok U(T.number, T.string-or-number).equals(T.string-or-number), "N ∪ (S|N)"
  ok U(T.number, C(T.string)).equals(C(T.string)), "N ∪ -S"
  eq T.any, U(T.number, C(T.number)), "N ∪ -N"
  eq T.any, U(T.number, T.any), "N ∪ *"
  eq T.number, U(T.number, T.none), "N ∪ 0"
  ok U(T.number, T.number.array()).equals(U(T.number.array(), T.number)), "N ∪ [N]"
  eq "([Number]|Number)", U(T.number, T.number.array()).to-string()

test "Union of union", #
  eq T.string-or-number, U(T.string-or-number, T.number), "(S|N) ∪ N"
  eq T.string-or-number, U(T.string-or-number, T.string-or-number), "(S|N) ∪ (S|N)"
  ok U(T.string-or-number, U(T.number, T.boolean)).equals(U(T.string, T.number, T.boolean)), "(S|N) ∪ (N|B)"
  ok U(T.string-or-number, U(T.boolean, T.string-or-number)).equals(U(T.string, T.number, T.boolean)), "(S|N) ∪ (S|N|B)"
  eq T.any, U(T.string-or-number, T.any), "(S|N) ∪ *"
  eq T.string-or-number, U(T.string-or-number, T.none), "(S|N) ∪ 0"
  ok U(T.string-or-number, T.number.array()).equals(U(T.string, T.number, T.number.array())), "(S|N) ∪ [N]"
  eq "([Number]|Number|String)", U(T.string, T.number, T.number.array()).to-string()
  ok not U(T.string-or-number, T.string-or-number.array()).equals(T.string, T.number, U(T.number, T.string).array()), "(S|N) ∪ [(S|N)]"
  eq "([(Number|String)]|Number|String)", U(T.string-or-number, T.string-or-number.array()).to-string()
  ok U(T.string-or-number, C(T.boolean)).equals(C(T.boolean)), "(S|N) ∪ -B"
  eq T.any, U(T.string-or-number, C(T.number)), "(S|N) ∪ -N"
  eq T.any, U(T.string-or-number, C(T.string)), "(S|N) ∪ -S"
  eq T.any, U(T.string-or-number, C(T.string-or-number)), "(S|N) ∪ -(S|N)"

test "Union of complement", #
  let not-number = C(T.number)
  eq T.any, U(not-number, T.number), "-N ∪ N"
  eq not-number, U(not-number, T.string), "-N ∪ S"
  eq T.any, U(not-number, T.string-or-number), "-N ∪ (S|N)"
  eq not-number, U(not-number, U(T.boolean, T.string)), "-N ∪ (S|B)"
  eq T.any, U(not-number, T.any), "-N ∪ *"
  eq not-number, U(not-number, T.none), "-N ∪ 0"
  eq not-number, U(not-number, T.array), "-N ∪ [*]"
  eq not-number, U(not-number, T.number.array()), "-N ∪ [N]"
  eq not-number, U(not-number, C(T.number).array()), "-N ∪ [-N]"
  eq T.any, U(not-number, C(T.number.array())), "-N ∪ -[N]"
  ok U(not-number, C(T.number)).equals(not-number), "-N ∪ -N"
  eq T.any, U(not-number, C(T.string)), "-N ∪ -S"

test "Union of none", #
  eq T.number, U(T.none, T.number), "0 ∪ N"
  eq T.string-or-number, U(T.none, T.string-or-number), "0 ∪ (S|N)"
  eq T.any, U(T.none, T.any), "0 ∪ *"
  eq T.none, U(T.none, T.none), "0 ∪ 0"
  eq T.array, U(T.none, T.array), "0 ∪ [*]"
  eq T.number.array(), U(T.none, T.number.array()), "0 ∪ [N]"
  let not-number = C(T.number)
  eq not-number, U(T.none, not-number), "0 ∪ -N"

test "Union of any", #
  eq T.any, U(T.any, T.number), "* ∪ N"
  eq T.any, U(T.any, T.string-or-number), "* ∪ (S|N)"
  eq T.any, U(T.any, T.any), "* ∪ *"
  eq T.any, U(T.any, T.none), "* ∪ 0"
  eq T.any, U(T.any, T.array), "* ∪ [*]"
  eq T.any, U(T.any, T.number.array()), "* ∪ [N]"
  eq T.any, U(T.any, C(T.number)), "* ∪ -N"

test "Union of specialized array", #
  eq "([Number]|Number)", U(T.number.array(), T.number).to-string(), "[N] ∪ N"
  eq "([Number]|String)", U(T.number.array(), T.string).to-string(), "[N] ∪ S"
  eq "([Number]|Number|String)", U(T.number.array(), T.string-or-number).to-string(), "[N] ∪ (S|N)"
  eq T.any, U(T.number.array(), T.any), "[N] ∪ *"
  eq T.number.array(), U(T.number.array(),T.none), "[N] ∪ 0"
  eq T.array, U(T.number.array(), T.array), "[N] ∪ [*]"
  eq T.number.array(), U(T.number.array(), T.number.array()), "[N] ∪ [N]"
  eq "([Number]|[String])", U(T.number.array(), T.string.array()).to-string(), "[N] ∪ [S]"
  let not-number = C(T.number)
  eq not-number, U(T.number.array(), not-number), "[N] ∪ -N"
  eq T.any, U(T.number.array(), C(T.number.array())), "[N] ∪ -[N]"

test "Union of array", #
  eq "([any]|Number)", U(T.array, T.number).to-string(), "[*] ∪ N"
  eq "([any]|String)", U(T.array, T.string).to-string(), "[*] ∪ S"
  eq "([any]|Number|String)", U(T.array, T.string-or-number).to-string(), "[*] ∪ (S|N)"
  eq T.any, U(T.array, T.any), "[*] ∪ *"
  eq T.array, U(T.array, T.none), "[*] ∪ 0"
  eq T.array, U(T.array, T.array), "[*] ∪ [*]"
  eq T.array, U(T.array, T.number.array()), "[*] ∪ [N]"
  let not-number = C(T.number)
  eq not-number, U(T.array, not-number), "[*] ∪ -N"
  eq T.any, U(T.array, C(T.array)), "[*] ∪ -[*]"

test "Intersection of simple", #
  eq T.number, I(T.number, T.number), "N ∩ N"
  eq T.none, I(T.number, T.string), "N ∩ S"
  eq T.number, I(T.number, T.string-or-number), "N ∩ (S|N)"
  eq T.number, I(T.number, C(T.string)), "N ∩ -S"
  eq T.none, I(T.number, C(T.number)), "N ∩ -N"
  eq T.number, I(T.number, T.any), "N ∩ *"
  eq T.none, I(T.number, T.none), "N ∩ 0"
  eq T.none, I(T.number, T.number.array()), "N ∩ [N]"

test "Intersection of union", #
  eq T.number, I(T.string-or-number, T.number), "(S|N) ∩ N"
  eq T.string-or-number, I(T.string-or-number, T.string-or-number), "(S|N) ∩ (S|N)"
  eq T.number, I(T.string-or-number, U(T.number, T.boolean)), "(S|N) ∩ (N|B)"
  eq T.string-or-number, I(T.string-or-number, U(T.boolean, T.string-or-number)), "(S|N) ∩ (S|N|B)"
  eq T.string-or-number, I(T.string-or-number, T.any), "(S|N) ∩ *"
  eq T.none, I(T.string-or-number, T.none), "(S|N) ∩ 0"
  eq T.none, I(T.string-or-number, T.number.array()), "(S|N) ∩ [N]"
  eq T.none, I(T.string-or-number, T.string-or-number.array()), "(S|N) ∩ [(S|N)]"
  eq T.string-or-number, I(T.string-or-number, C(T.boolean)), "(S|N) ∩ -B"
  eq T.string, I(T.string-or-number, C(T.number)), "(S|N) ∩ -N"
  eq T.number, I(T.string-or-number, C(T.string)), "(S|N) ∩ -S"
  eq T.none, I(T.string-or-number, C(T.string-or-number)), "(S|N) ∩ -(S|N)"

test "Intersection of complement", #
  let not-number = C(T.number)
  eq T.none, I(not-number, T.number), "-N ∩ N"
  eq T.string, I(not-number, T.string), "-N ∩ S"
  eq T.string, I(not-number, T.string-or-number), "-N ∩ (S|N)"
  let boolean-or-string = I(T.boolean, T.string)
  eq boolean-or-string, I(not-number, boolean-or-string), "-N ∩ (S|B)"
  eq not-number, I(not-number, T.any), "-N ∩ *"
  eq T.none, I(not-number, T.none), "-N ∩ 0"
  eq T.array, I(not-number, T.array), "-N ∩ [*]"
  eq T.number.array(), I(not-number, T.number.array()), "-N ∩ [N]"
  ok I(not-number, C(T.number).array()).equals(C(T.number).array()), "-N ∩ [-N]"
  ok I(not-number, C(T.number.array())).equals(C(U(T.number, T.number.array()))), "-N ∩ -[N]"
  ok I(not-number, C(T.number)).equals(not-number), "-N ∩ -N"
  ok I(not-number, C(T.string)).equals(C(T.string-or-number)), "-N ∩ -S"

test "Intersection of none", #
  eq T.none, I(T.none, T.number), "0 ∩ N"
  eq T.none, I(T.none, T.string-or-number), "0 ∩ (S|N)"
  eq T.none, I(T.none, T.any), "0 ∩ *"
  eq T.none, I(T.none, T.none), "0 ∩ 0"
  eq T.none, I(T.none, T.array), "0 ∩ [*]"
  eq T.none, I(T.none, T.number.array()), "0 ∩ [N]"
  eq T.none, I(T.none, C(T.number)), "0 ∩ -N"

test "Intersection of any", #
  eq T.number, I(T.any, T.number), "* ∩ N"
  eq T.string-or-number, I(T.any, T.string-or-number), "* ∩ (S|N)"
  eq T.any, I(T.any, T.any), "* ∩ *"
  eq T.none, I(T.any, T.none), "* ∩ 0"
  eq T.array, I(T.any, T.array), "* ∩ [*]"
  eq T.number.array(), I(T.any, T.number.array()), "* ∩ [N]"
  let not-number = C(T.number)
  eq not-number, I(T.any, not-number), "* ∩ -N"

test "Intersection of specialized array", #
  eq T.none, I(T.number.array(), T.number), "[N] ∩ N"
  eq T.none, I(T.number.array(), T.string), "[N] ∩ S"
  eq T.none, I(T.number.array(), T.string-or-number), "[N] ∩ (S|N)"
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
  eq T.none, I(T.array, T.string-or-number), "[*] ∩ (S|N)"
  eq T.array, I(T.array, T.any), "[*] ∩ *"
  eq T.none, I(T.array, T.none), "[*] ∩ 0"
  eq T.array, I(T.array, T.array), "[*] ∩ [*]"
  eq T.number.array(), I(T.array, T.number.array()), "[*] ∩ [N]"
  eq T.array, I(T.array, C(T.number)), "[*] ∩ -N"
  eq T.none, I(T.array, C(T.array)), "[*] ∩ -[*]"

test "Arrays", #
  eq "[any]", T.array.to-string()
  eq "[Boolean]", T.boolean.array().to-string()
  eq "[String]", T.string.array().to-string()
  eq "[[String]]", T.string.array().array().to-string()
  ok T.boolean.array().equals(T.boolean.array())
  ok T.string.array().equals(T.string.array())
  ok not T.boolean.array().equals(T.string.array())
  ok T.array.overlaps(T.boolean.array())
  ok T.boolean.array().overlaps(T.array)
  ok T.boolean.array().is-subset-of(T.array)
  ok not T.array.is-subset-of(T.boolean)
  eq T.array, U(T.boolean.array(), T.array)
  
  ok T.array.equals(T.any.array())

test "Making types", #
  let alpha = T.make("Alpha")
  let bravo = T.make("Bravo")
  eq "Alpha", alpha.to-string()
  eq "Bravo", bravo.to-string()
  eq "(Alpha|Bravo)", U(alpha, bravo).to-string()
  eq "(Alpha|Bravo)", U(bravo, alpha).to-string()
  ok U(alpha, bravo).equals(U(bravo, alpha))
  eq "[Alpha]", alpha.array().to-string()
  eq "[Bravo]", bravo.array().to-string()
  eq "[(Alpha|Bravo)]", U(alpha, bravo).array().to-string()
  ok U(alpha, bravo).array().equals(U(bravo, alpha).array())
  eq "([Alpha]|[Bravo])", U(alpha.array(), bravo.array()).to-string()
  ok U(alpha.array(), bravo.array()).equals(U(bravo.array(), alpha.array()))
  ok not U(alpha, bravo).array().equals(U(alpha.array(), bravo.array()))

  ok not T.make("Alpha").equals(alpha) // could be from different scopes
  ok T.make("Alpha").compare(T.make("Alpha")) != 0 // since not equal, should not compare to 0
