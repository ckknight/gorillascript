let T = require '../lib/types'

test "Basic string representation", #
  eq "undefined", T.undefined.to-string()
  eq "null", T.null.to-string()
  eq "String", T.string.to-string()
  eq "Number", T.number.to-string()
  eq "Boolean", T.boolean.to-string()
  eq "->", T.function.to-string()
  eq "{}", T.object.to-string()
  eq "[]", T.array.to-string()
  eq "Arguments", T.args.to-string()
  eq "any", T.any.to-string()
  eq "none", T.none.to-string()
  eq "RegExp", T.regexp.to-string()
  eq "(Number|String)", T.string-or-number.to-string()
  eq "([]|Arguments)", T.array-like.to-string()
  eq "(null|undefined)", T.undefined-or-null.to-string()
  eq "any \\ (null|undefined)", T.not-undefined-or-null.to-string()
  eq "(Boolean|Number|String|null|undefined)", T.primitive.to-string()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.non-primitive.to-string()
  eq "(null|undefined)", T.always-falsy.to-string()
  eq "any \\ (null|undefined)", T.potentially-truthy.to-string()
  eq "(Boolean|Number|String|null|undefined)", T.potentially-falsy.to-string()
  eq "any \\ (Boolean|Number|String|null|undefined)", T.always-truthy.to-string()
  eq "{x: Number}", T.make-object(x: T.number).to-string()
  eq "{x: Number, y: String}", T.make-object(x: T.number, y: T.string).to-string()
  eq "{x: Number, y: String}", T.make-object(y: T.string, x: T.number).to-string()
  eq "Thing<String>", T.generic("Thing", T.string).to-string()
  eq "Thing<Number>", T.generic("Thing", T.number).to-string()
  eq "Thing<(Number|String)>", T.generic("Thing", T.string-or-number).to-string()
  eq "Thing<String, Boolean>", T.generic("Thing", T.string, T.boolean).to-string()
  eq "Thing<Number, Boolean>", T.generic("Thing", T.number, T.boolean).to-string()
  eq "Thing<(Number|String), Boolean>", T.generic("Thing", T.string-or-number, T.boolean).to-string()
  eq "Thing<>", T.generic("Thing", T.any).to-string()
  eq "Thing<,Boolean>", T.generic("Thing", T.any, T.boolean).to-string()
  eq "Thing<Boolean,>", T.generic("Thing", T.boolean, T.any).to-string()
  eq "Thing<,>", T.generic("Thing", T.any, T.any).to-string()

define operator binary subset with maximum: 1, invertible: true
  AST $left.is-subset-of $right

define operator binary union
  AST $left.union $right

define operator binary intersect
  AST $left.intersect $right

define operator unary ~
  AST $node.complement()

define operator binary equals with maximum: 1, invertible: true
  AST $left.equals $right

define operator binary overlaps with maximum: 1, invertible: true
  AST $left.overlaps $right

test "Complement", #
  eq T.any, ~T.none
  eq T.none, ~T.any
  
  eq "any \\ Boolean", (~T.boolean).to-string()
  eq "any \\ ->", (~T.function).to-string()
  eq "any \\ (->|Boolean)", (~(T.boolean union T.function)).to-string()
  eq "any \\ [Boolean]", (~T.boolean.array()).to-string()
  eq "any \\ []", (~T.array).to-string()
  
  eq T.boolean, ~(~T.boolean)
  ok ~(~(T.boolean union T.function)) equals (T.boolean union T.function)
  eq T.boolean.array(), ~(~(T.boolean.array()))
  
  eq T.any, ~T.boolean union ~T.string
  ok ~(T.boolean union T.string) equals (~T.boolean intersect ~T.string)

test "Subset of simple", #
  ok T.number subset T.number, "N ⊆ N"
  ok T.number not subset T.string, "N ⊆ S"
  ok T.number subset T.string-or-number, "N ⊆ (S ∪ N)"
  ok T.number subset ~T.string, "N ⊆ !S"
  ok T.number not subset ~T.number, "N ⊆ !N"
  ok T.number subset T.any, "N ⊆ *"
  ok T.number not subset T.none, "N ⊆ 0"
  ok T.number not subset T.number.array(), "N ⊆ [N]"
  ok T.number not subset T.number.function(), "N ⊆ -> N"
  ok T.number not subset T.object, "N ⊆ {}"
  ok T.number not subset T.generic("Thing", T.number), "N ⊆ X<N>"

test "Subset of union", #
  ok T.string-or-number not subset T.number, "(S ∪ N) ⊆ N"
  ok T.string-or-number subset T.string-or-number, "(S ∪ N) ⊆ (S ∪ N)"
  ok T.string-or-number not subset (T.number union T.boolean), "(S ∪ N) ⊆ (N|B)"
  ok T.string-or-number subset (T.boolean union T.string-or-number), "(S ∪ N) ⊆ (S|N|B)"
  ok T.string-or-number subset T.any, "(S ∪ N) ⊆ *"
  ok T.string-or-number not subset T.none, "(S ∪ N) ⊆ 0"
  ok T.string-or-number not subset T.number.array(), "(S ∪ N) ⊆ [N]"
  ok T.string-or-number not subset T.string-or-number.array(), "(S ∪ N) ⊆ [(S ∪ N)]"
  ok T.string-or-number not subset T.string-or-number.function(), "(S ∪ N) ⊆ -> (S ∪ N)"
  ok T.string-or-number subset ~T.boolean, "(S ∪ N) ⊆ !B"
  ok T.string-or-number not subset ~T.number, "(S ∪ N) ⊆ !N"
  ok T.string-or-number not subset ~T.string, "(S ∪ N) ⊆ !S"
  ok T.string-or-number not subset ~T.string-or-number, "(S ∪ N) ⊆ !(S ∪ N)"
  ok T.string-or-number not subset T.object, "(S ∪ N) ⊆ {}"
  ok T.string-or-number not subset T.generic("Thing", T.number), "(S ∪ N) ⊆ X<N>"

test "Subset of complement", #
  ok ~T.number not subset T.number, "!N ⊆ N"
  ok ~T.number not subset T.string, "!N ⊆ S"
  ok ~T.number not subset T.string-or-number, "!N ⊆ (S ∪ N)"
  ok ~T.number not subset (T.boolean union T.string), "!N ⊆ (S|B)"
  ok ~T.number subset T.any, "!N ⊆ *"
  ok ~T.number not subset T.none, "!N ⊆ 0"
  ok ~T.number not subset T.array, "!N ⊆ [*]"
  ok ~T.number not subset T.number.array(), "!N ⊆ [N]"
  ok ~T.number not subset ~T.number.array(), "!N ⊆ [!N]"
  ok ~T.number not subset T.number.function(), "!N ⊆ -> N"
  ok ~T.number not subset ~T.number.function(), "!N ⊆ -> !N"
  ok ~T.number subset ~T.number, "!N ⊆ !N"
  ok ~T.number not subset ~T.string, "!N ⊆ !S"
  ok ~T.number not subset T.object, "!N ⊆ {}"
  ok ~T.number not subset T.generic("Thing", T.number), "!N ⊆ X<N>"

test "Subset of none", #
  ok T.none subset T.number, "0 ⊆ N"
  ok T.none subset T.string-or-number, "0 ⊆ (S ∪ N)"
  ok T.none subset T.any, "0 ⊆ *"
  ok T.none subset T.none, "0 ⊆ 0"
  ok T.none subset T.array, "0 ⊆ [*]"
  ok T.none subset T.number.array(), "0 ⊆ [N]"
  ok T.none subset T.number.function(), "0 ⊆ -> N"
  ok T.none subset ~T.number, "0 ⊆ !N"
  ok T.none subset T.object, "0 ⊆ {}"
  ok T.none subset T.generic("Thing", T.number), "0 ⊆ X<N>"

test "Subset of any", #
  ok T.any not subset T.number, "* ⊆ N"
  ok T.any not subset T.string-or-number, "* ⊆ (S ∪ N)"
  ok T.any subset T.any, "* ⊆ *"
  ok T.any not subset T.none, "* ⊆ 0"
  ok T.any not subset T.array, "* ⊆ [*]"
  ok T.any not subset T.number.array(), "* ⊆ [N]"
  ok T.any not subset T.number.function(), "* ⊆ -> N"
  ok T.any not subset ~T.number, "* ⊆ !N"
  ok T.any not subset T.object, "* ⊆ {}"
  ok T.any not subset T.generic("Thing", T.number), "* ⊆ X<N>"

test "Subset of specialized array", #
  ok T.number.array() not subset T.number, "[N] ⊆ N"
  ok T.number.array() not subset T.string, "[N] ⊆ S"
  ok T.number.array() not subset T.string-or-number, "[N] ⊆ (S ∪ N)"
  ok T.number.array() subset T.any, "[N] ⊆ *"
  ok T.number.array() not subset T.none, "[N] ⊆ 0"
  ok T.number.array() subset T.array, "[N] ⊆ [*]"
  ok T.number.array() subset T.number.array(), "[N] ⊆ [N]"
  ok T.number.array() not subset T.string.array(), "[N] ⊆ [S]"
  ok T.number.array() subset ~T.number, "[N] ⊆ !N"
  ok T.number.array() not subset T.number.function(), "[N] ⊆ -> N"
  ok T.number.array() not subset T.object, "[N] ⊆ {}"
  ok T.number.array() not subset T.generic("Thing", T.number), "[N] ⊆ X<N>"

test "Subset of array", #
  ok T.array not subset T.number, "[*] ⊆ N"
  ok T.array not subset T.string, "[*] ⊆ S"
  ok T.array not subset T.string-or-number, "[*] ⊆ (S ∪ N)"
  ok T.array subset T.any, "[*] ⊆ *"
  ok T.array not subset T.none, "[*] ⊆ 0"
  ok T.array subset T.array, "[*] ⊆ [*]"
  ok T.array not subset T.number.array(), "[*] ⊆ [N]"
  ok T.array subset ~T.number, "[*] ⊆ !N"
  ok T.array not subset T.number.function(), "[*] ⊆ -> N"
  // TODO: array is kind of a subset of {length: Number}
  ok T.array not subset T.object, "[*] ⊆ {}"
  ok T.array not subset T.generic("Thing", T.any), "[*] ⊆ X<*>"

test "Subset of specialized function", #
  ok T.number.function() not subset T.number, "-> N ⊆ N"
  ok T.number.function() not subset T.string, "-> N ⊆ S"
  ok T.number.function() not subset T.string-or-number, "-> N ⊆ (S ∪ N)"
  ok T.number.function() subset T.any, "-> N ⊆ *"
  ok T.number.function() not subset T.none, "-> N ⊆ 0"
  ok T.number.function() subset T.function, "-> N ⊆ [*]"
  ok T.number.function() subset T.number.function(), "-> N ⊆ -> N"
  ok T.number.function() not subset T.string.function(), "-> N ⊆ -> S"
  ok T.number.function() subset ~T.number, "-> N ⊆ !N"
  ok T.number.function() not subset T.number.array(), "-> N ⊆ [N]"
  // TODO: a function is kind of a subset of {name: String, length: Number, etc.}
  ok T.number.function() not subset T.object, "-> N ⊆ {}"
  ok T.number.function() not subset T.generic("Thing", T.number), "-> N ⊆ X<N>"

test "Subset of function", #
  ok T.function not subset T.number, "-> * ⊆ N"
  ok T.function not subset T.string, "-> * ⊆ S"
  ok T.function not subset T.string-or-number, "-> * ⊆ (S ∪ N)"
  ok T.function subset T.any, "-> * ⊆ *"
  ok T.function not subset T.none, "-> * ⊆ 0"
  ok T.function subset T.function, "-> * ⊆ -> *"
  ok T.function not subset T.number.function(), "-> * ⊆ [N]"
  ok T.function subset ~T.number, "-> * ⊆ !N"
  ok T.function not subset T.array, "-> * ⊆ [N]"
  ok T.function not subset T.number.array(), "-> * ⊆ [N]"
  // TODO: a function is kind of a subset of {name: String, length: Number, etc.}
  ok T.function not subset T.object, "-> * ⊆ {}"
  ok T.function not subset T.generic("Thing", T.any), "-> * ⊆ X<*>"

test "Subset of specialized object", #
  let my-object = T.make-object(x: T.number)
  ok my-object not subset T.number, "{x:N} ⊆ N"
  ok my-object not subset T.string, "{x:N} ⊆ S"
  ok my-object not subset T.string-or-number, "{x:N} ⊆ (S ∪ N)"
  ok my-object subset T.any, "{x:N} ⊆ *"
  ok my-object not subset T.none, "{x:N} ⊆ 0"
  ok my-object not subset T.function, "{x:N} ⊆ {x:N}"
  ok my-object not subset T.number.function(), "{x:N} ⊆ [N]"
  ok my-object subset ~T.number, "{x:N} ⊆ !N"
  ok my-object not subset T.array, "{x:N} ⊆ [N]"
  ok my-object not subset T.number.array(), "{x:N} ⊆ [N]"
  ok my-object subset T.object, "{x:N} ⊆ {}"
  ok my-object subset my-object, "{x:N} ⊆ {x:N}"
  ok my-object subset T.make-object(x: T.number), "{x:N} ⊆ {x:N}"
  ok my-object not subset T.make-object(x: T.string), "{x:N} ⊆ {x:S}"
  ok my-object not subset T.generic("Thing", T.number), "{x:N} ⊆ X<N>"

test "Subset of object", #
  ok T.object not subset T.number, "{} ⊆ N"
  ok T.object not subset T.string, "{} ⊆ S"
  ok T.object not subset T.string-or-number, "{} ⊆ (S ∪ N)"
  ok T.object subset T.any, "{} ⊆ *"
  ok T.object not subset T.none, "{} ⊆ 0"
  ok T.object not subset T.function, "{} ⊆ -> *"
  ok T.object not subset T.number.function(), "{} ⊆ -> N"
  ok T.object subset ~T.number, "{} ⊆ !N"
  ok T.object not subset T.array, "{} ⊆ [N]"
  ok T.object not subset T.number.array(), "{} ⊆ [N]"
  ok T.object subset T.object, "{} ⊆ {}"
  ok T.object not subset T.make-object(x: T.number), "{} ⊆ {x:N}"
  ok T.object not subset T.generic("Thing", T.number), "{} ⊆ X<N>"

test "Subset of generic", #
  let my-generic = T.generic("Thing", T.number)
  ok my-generic not subset T.number, "X<N> ⊆ N"
  ok my-generic not subset T.string, "X<N> ⊆ S"
  ok my-generic not subset T.string-or-number, "X<N> ⊆ (S ∪ N)"
  ok my-generic subset T.any, "X<N> ⊆ *"
  ok my-generic not subset T.none, "X<N> ⊆ 0"
  ok my-generic not subset T.function, "X<N> ⊆ -> *"
  ok my-generic not subset T.number.function(), "X<N> ⊆ -> N"
  ok my-generic subset ~T.number, "X<N> ⊆ !N"
  ok my-generic not subset T.array, "X<N> ⊆ [N]"
  ok my-generic not subset T.number.array(), "X<N> ⊆ [N]"
  ok my-generic not subset T.object, "X<N> ⊆ {}"
  ok my-generic not subset T.make-object(x: T.number), "X<N> ⊆ {x:N}"
  ok my-generic subset my-generic, "X<N> ⊆ X<N>"
  ok my-generic not subset T.generic("Other", T.number), "X<N> ⊆ Y<N>"
  // even though the name is the same, they might point to different 'Thing's
  ok my-generic not subset T.generic("Thing", T.number), "X<N> ⊆ Z<N>"
  ok my-generic subset T.generic(my-generic.base, T.number), "X<N> ⊆ X<N>"
  ok my-generic subset T.generic(my-generic.base, T.string-or-number), "X<N> ⊆ X<S ∪ N>"

test "Overlap of simple", #
  ok T.number overlaps T.number, "N ∩ N"
  ok T.number not overlaps T.string, "N ∩ S"
  ok T.number overlaps T.string-or-number, "N ∩ (S ∪ N)"
  ok T.number overlaps ~T.string, "N ∩ !S"
  ok T.number not overlaps ~T.number, "N ∩ !N"
  ok T.number overlaps T.any, "N ∩ *"
  ok T.number not overlaps T.none, "N ∩ 0"
  ok T.number not overlaps T.number.array(), "N ∩ [N]"
  ok T.number not overlaps T.number.function(), "N ∩ -> N"
  ok T.number not overlaps T.object, "N ∩ {}"
  ok T.number not overlaps T.generic("Thing", T.number), "N ∩ X<N>"

test "Overlap of union", #
  ok T.string-or-number overlaps T.number, "(S ∪ N) ∩ N"
  ok T.string-or-number overlaps T.string-or-number, "(S ∪ N) ∩ (S ∪ N)"
  ok T.string-or-number overlaps (T.number union T.boolean), "(S ∪ N) ∩ (N|B)"
  ok T.string-or-number overlaps (T.boolean union T.string-or-number), "(S ∪ N) ∩ (S|N|B)"
  ok T.string-or-number not overlaps (T.boolean union T.function), "(S ∪ N) ∩ (B|F)"
  ok T.string-or-number overlaps T.any, "(S ∪ N) ∩ *"
  ok T.string-or-number not overlaps T.none, "(S ∪ N) ∩ 0"
  ok T.string-or-number not overlaps T.number.array(), "(S ∪ N) ∩ [N]"
  ok T.string-or-number not overlaps T.string-or-number.array(), "(S ∪ N) ∩ [(S ∪ N)]"
  ok T.string-or-number overlaps ~T.boolean, "(S ∪ N) ∩ !B"
  ok T.string-or-number overlaps ~T.number, "(S ∪ N) ∩ !N"
  ok T.string-or-number overlaps ~T.string, "(S ∪ N) ∩ !S"
  ok T.string-or-number not overlaps ~T.string-or-number, "(S ∪ N) ∩ !(S ∪ N)"
  ok T.string-or-number not overlaps T.string-or-number.function(), "(S ∪ N) ∩ -> (S ∪ N)"
  ok T.string-or-number not overlaps T.object, "(S ∪ N) ∩ {}"
  ok T.string-or-number not overlaps T.generic("Thing", T.number), "(S ∪ N) ∩ X<N>"

test "Overlap of complement", #
  ok ~T.number not overlaps T.number, "!N ∩ N"
  ok ~T.number overlaps T.string, "!N ∩ S"
  ok ~T.number overlaps T.string-or-number, "!N ∩ (S ∪ N)"
  ok ~T.number overlaps (T.boolean union T.string), "!N ∩ (S|B)"
  ok ~T.number overlaps T.any, "!N ∩ *"
  ok ~T.number not overlaps T.none, "!N ∩ 0"
  ok ~T.number overlaps T.array, "!N ∩ [*]"
  ok ~T.number overlaps T.number.array(), "!N ∩ [N]"
  ok ~T.number overlaps (~T.number.array()), "!N ∩ [!N]"
  ok ~T.number overlaps ~T.number, "!N ∩ !N"
  ok ~T.number overlaps ~T.string, "!N ∩ !S"
  ok ~T.number overlaps T.number.function(), "!N ∩ -> N"
  ok ~T.number overlaps T.object, "!N ∩ {}"
  ok ~T.number overlaps T.generic("Thing", T.number), "!N ∩ X<N>"

test "Overlap of none", #
  ok T.none not overlaps T.number, "0 ∩ N"
  ok T.none not overlaps T.string-or-number, "0 ∩ (S ∪ N)"
  ok T.none not overlaps T.any, "0 ∩ *"
  ok T.none not overlaps T.none, "0 ∩ 0"
  ok T.none not overlaps T.array, "0 ∩ [*]"
  ok T.none not overlaps T.number.array(), "0 ∩ [N]"
  ok T.none not overlaps ~T.number, "0 ∩ !N"
  ok T.none not overlaps T.number.function(), "0 ∩ -> N"
  ok T.none not overlaps T.object, "0 ∩ {}"
  ok T.none not overlaps T.generic("Thing", T.number), "0 ∩ X<N>"

test "Overlap of any", #
  ok T.any overlaps T.number, "* ∩ N"
  ok T.any overlaps T.string-or-number, "* ∩ (S ∪ N)"
  ok T.any overlaps T.any, "* ∩ *"
  ok T.any overlaps T.none, "* ∩ 0"
  ok T.any overlaps T.array, "* ∩ [*]"
  ok T.any overlaps T.number.array(), "* ∩ [N]"
  ok T.any overlaps ~T.number, "* ∩ !N"
  ok T.any overlaps T.number.function(), "* ∩ -> N"
  ok T.any overlaps T.object, "* ∩ {}"
  ok T.any overlaps T.generic("Thing", T.number), "* ∩ X<N>"

test "Overlap of specialized array", #
  ok T.number.array() not overlaps T.number, "[N] ∩ N"
  ok T.number.array() not overlaps T.string, "[N] ∩ S"
  ok T.number.array() not overlaps T.string-or-number, "[N] ∩ (S ∪ N)"
  ok T.number.array() overlaps T.any, "[N] ∩ *"
  ok T.number.array() not overlaps T.none, "[N] ∩ 0"
  ok T.number.array() overlaps T.array, "[N] ∩ [*]"
  ok T.number.array() overlaps T.number.array(), "[N] ∩ [N]"
  ok T.number.array() overlaps T.string.array(), "[N] ∩ [S]"
  ok T.number.array() overlaps ~T.number, "[N] ∩ !N"
  ok T.number.array() not overlaps T.number.function(), "[N] ∩ -> N"
  ok T.number.array() not overlaps T.object, "[N] ∩ {}"
  ok T.number.array() not overlaps T.generic("Thing", T.number), "[N] ∩ X<N>"

test "Overlap of array", #
  ok T.array not overlaps T.number, "[*] ∩ N"
  ok T.array not overlaps T.string, "[*] ∩ S"
  ok T.array not overlaps T.string-or-number, "[*] ∩ (S ∪ N)"
  ok T.array overlaps T.any, "[*] ∩ *"
  ok T.array not overlaps T.none, "[*] ∩ 0"
  ok T.array overlaps T.array, "[*] ∩ [*]"
  ok T.array overlaps T.number.array(), "[*] ∩ [N]"
  ok T.array overlaps ~T.number, "[*] ∩ !N"
  ok T.array not overlaps T.number.function(), "[*] ∩ -> N"
  ok T.array not overlaps T.object, "[*] ∩ {}"
  ok T.array not overlaps T.generic("Thing", T.any), "[*] ∩ X<*>"

test "Overlap of specialized function", #
  ok T.number.function() not overlaps T.number, "-> N ∩ N"
  ok T.number.function() not overlaps T.string, "-> N ∩ S"
  ok T.number.function() not overlaps T.string-or-number, "-> N ∩ (S ∪ N)"
  ok T.number.function() overlaps T.any, "-> N ∩ *"
  ok T.number.function() not overlaps T.none, "-> N ∩ 0"
  ok T.number.function() not overlaps T.array, "-> N ∩ [*]"
  ok T.number.function() overlaps T.function, "-> N ∩ -> *"
  ok T.number.function() overlaps T.number.function(), "-> N ∩ -> N"
  ok T.number.function() overlaps T.string.function(), "-> N ∩ -> S"
  ok T.number.function() overlaps ~T.number, "-> N ∩ !N"
  ok T.number.function() not overlaps T.number.array(), "-> N ∩ -> N"
  ok T.number.function() not overlaps T.object, "-> N ∩ {}"
  ok T.number.function() not overlaps T.generic("Thing", T.number), "[*] ∩ X<N>"

test "Overlap of function", #
  ok T.function not overlaps T.number, "-> * ∩ N"
  ok T.function not overlaps T.string, "-> * ∩ S"
  ok T.function not overlaps T.string-or-number, "-> * ∩ (S ∪ N)"
  ok T.function overlaps T.any, "-> * ∩ *"
  ok T.function not overlaps T.none, "-> * ∩ 0"
  ok T.function not overlaps T.array, "-> * ∩ [*]"
  ok T.function not overlaps T.number.array(), "-> * ∩ [N]"
  ok T.function overlaps ~T.number, "-> * ∩ !N"
  ok T.function overlaps T.number.function(), "-> * ∩ -> N"
  ok T.function overlaps T.function, "-> * ∩ -> *"
  ok T.function not overlaps T.object, "-> * ∩ {}"
  ok T.function not overlaps T.generic("Thing", T.any), "-> * ∩ X<*>"

test "Overlap of specialized object", #
  let my-object = T.make-object(x: T.number)
  ok my-object not overlaps T.number, "{x:N} ∩ N"
  ok my-object not overlaps T.string, "{x:N} ∩ S"
  ok my-object not overlaps T.string-or-number, "{x:N} ∩ (S ∪ N)"
  ok my-object overlaps T.any, "{x:N} ∩ *"
  ok my-object not overlaps T.none, "{x:N} ∩ 0"
  ok my-object not overlaps T.array, "{x:N} ∩ [*]"
  ok my-object not overlaps T.function, "{x:N} ∩ -> *"
  ok my-object not overlaps T.number.function(), "{x:N} ∩ -> N"
  ok my-object not overlaps T.string.function(), "{x:N} ∩ -> S"
  ok my-object overlaps ~T.number, "{x:N} ∩ !N"
  ok my-object not overlaps ~my-object, "{x:N} ∩ !{x:N}"
  ok my-object not overlaps ~T.make-object(x: T.number), "{x:N} ∩ !{x:N}"
  ok my-object overlaps ~T.make-object(x: T.string), "{x:N} ∩ !{x:S}"
  ok my-object overlaps ~T.make-object(y: T.string), "{x:N} ∩ !{y:S}"
  ok my-object not overlaps ~T.object, "{x:N} ∩ !{}"
  ok my-object not overlaps T.number.array(), "{x:N} ∩ -> N"
  ok my-object overlaps T.object, "{x:N} ∩ {}"
  ok my-object overlaps my-object, "{x:N} ∩ {x:N}"
  ok my-object overlaps T.make-object(x: T.number), "{x:N} ∩ {x:N}"
  ok my-object overlaps T.make-object(x: T.string), "{x:N} ∩ {x:S}"
  ok my-object overlaps T.make-object(y: T.string), "{x:N} ∩ {y:S}"
  ok my-object not overlaps T.generic("Thing", T.number), "{x:N} ∩ X<N>"

test "Overlap of object", #
  ok T.object not overlaps T.number, "{} ∩ N"
  ok T.object not overlaps T.string, "{} ∩ S"
  ok T.object not overlaps T.string-or-number, "{} ∩ (S ∪ N)"
  ok T.object overlaps T.any, "{} ∩ *"
  ok T.object not overlaps T.none, "{} ∩ 0"
  ok T.object not overlaps T.array, "{} ∩ [*]"
  ok T.object not overlaps T.number.array(), "{} ∩ [N]"
  ok T.object overlaps ~T.number, "{} ∩ !N"
  ok T.object not overlaps ~T.object, "{} ∩ !{}"
  ok T.object overlaps ~T.make-object(x: T.number), "{} ∩ !{x:N}"
  ok T.object not overlaps T.number.function(), "{} ∩ -> N"
  ok T.object not overlaps T.function, "{} ∩ -> *"
  ok T.object overlaps T.object, "{} ∩ {}"
  ok T.object overlaps T.make-object(x: T.number), "{} ∩ {x:N}"
  ok T.object not overlaps T.generic("Thing", T.number), "{} ∩ X<N>"

test "Overlap of generic", #
  let my-generic = T.generic("Thing", T.number)
  ok my-generic not overlaps T.number, "X<N> ∩ N"
  ok my-generic not overlaps T.string, "X<N> ∩ S"
  ok my-generic not overlaps T.string-or-number, "X<N> ∩ (S ∪ N)"
  ok my-generic overlaps T.any, "X<N> ∩ *"
  ok my-generic not overlaps T.none, "X<N> ∩ 0"
  ok my-generic not overlaps T.array, "X<N> ∩ [*]"
  ok my-generic not overlaps T.function, "X<N> ∩ -> *"
  ok my-generic not overlaps T.number.function(), "X<N> ∩ -> N"
  ok my-generic not overlaps T.string.function(), "X<N> ∩ -> S"
  ok my-generic overlaps ~T.number, "X<N> ∩ !N"
  ok my-generic overlaps ~T.make-object(x: T.number), "X<N> ∩ !X<N>"
  ok my-generic overlaps ~T.object, "X<N> ∩ !{}"
  ok my-generic not overlaps T.number.array(), "X<N> ∩ [N]"
  ok my-generic not overlaps T.object, "X<N> ∩ {}"
  ok my-generic overlaps my-generic, "X<N> ∩ X<N>"
  ok my-generic not overlaps T.generic("Other", T.number), "X<N> ∩ Y<N>"
  ok my-generic not overlaps T.generic("Thing", T.number), "X<N> ∩ Z<N>"
  ok my-generic overlaps T.generic(my-generic.base, T.number), "X<N> ∩ X<N>"
  ok my-generic overlaps T.generic(my-generic.base, T.string), "X<N> ∩ X<S>"

test "Union of simple", #
  eq T.number, T.number union T.number, "N ∪ N"
  ok (T.number union T.string) equals T.string-or-number, "N ∪ S"
  ok (T.number union T.string-or-number) equals T.string-or-number, "N ∪ (S ∪ N)"
  ok (T.number union ~T.string) equals ~T.string, "N ∪ !S"
  eq T.any, T.number union ~T.number, "N ∪ !N"
  eq T.any, T.number union T.any, "N ∪ *"
  eq T.number, T.number union T.none, "N ∪ 0"
  ok (T.number union T.number.array()) equals (T.number.array() union T.number), "N ∪ [N]"
  eq "([Number]|Number)", (T.number union T.number.array()).to-string()
  ok (T.number union T.number.function()) equals (T.number.function() union T.number), "N ∪ -> N"
  eq "(-> Number|Number)", (T.number union T.number.function()).to-string()
  ok (T.number union T.object) equals (T.object union T.number), "N ∪ {}"
  eq "({}|Number)", (T.number union T.object).to-string()
  eq "({x: Number}|Number)", (T.number union T.make-object(x: T.number)).to-string()
  eq "(Thing<Number>|Number)", (T.number union T.generic("Thing", T.number)).to-string()

test "Union of union", #
  eq T.string-or-number, T.string-or-number union T.number, "(S ∪ N) ∪ N"
  eq T.string-or-number, T.string-or-number union T.string-or-number, "(S ∪ N) ∪ (S ∪ N)"
  ok (T.string-or-number union (T.number union T.boolean)) equals (T.string union T.number union T.boolean), "(S ∪ N) ∪ (N|B)"
  ok (T.string-or-number union (T.boolean union T.string-or-number)) equals (T.string union T.number union T.boolean), "(S ∪ N) ∪ (S|N|B)"
  eq T.any, T.string-or-number union T.any, "(S ∪ N) ∪ *"
  eq T.string-or-number, T.string-or-number union T.none, "(S ∪ N) ∪ 0"
  ok (T.string-or-number union T.number.array()) equals (T.string union T.number union T.number.array()), "(S ∪ N) ∪ [N]"
  eq "([Number]|Number|String)", (T.string union T.number union T.number.array()).to-string()
  ok (T.string-or-number union T.string-or-number.array()) equals (T.string union T.number union (T.number union T.string).array()), "(S ∪ N) ∪ [(S ∪ N)]"
  eq "([(Number|String)]|Number|String)", (T.string-or-number union T.string-or-number.array()).to-string()
  ok (T.string-or-number union T.number.function()) equals (T.string union T.number union T.number.function()), "(S ∪ N) ∪ -> N"
  eq "(-> Number|Number|String)", (T.string union T.number union T.number.function()).to-string()
  ok (T.string-or-number union T.string-or-number.function()) equals (T.string union T.number union (T.number union T.string).function()), "(S ∪ N) ∪ -> (S ∪ N)"
  eq "(-> (Number|String)|Number|String)", (T.string-or-number union T.string-or-number.function()).to-string()
  ok (T.string-or-number union ~T.boolean) equals ~T.boolean, "(S ∪ N) ∪ !B"
  eq T.any, T.string-or-number union ~T.number, "(S ∪ N) ∪ !N"
  eq T.any, T.string-or-number union ~T.string, "(S ∪ N) ∪ !S"
  eq T.any, T.string-or-number union ~T.string-or-number, "(S ∪ N) ∪ !(S ∪ N)"
  ok (T.string-or-number union T.object) equals (T.object union T.number union T.string), "(S ∪ N) ∪ {}"
  eq "({}|Number|String)", (T.string-or-number union T.object).to-string()
  eq "({x: (Number|String)}|Number|String)", (T.string-or-number union T.make-object(x: T.string-or-number)).to-string()
  eq "(Thing<(Number|String)>|Number|String)", (T.string-or-number union T.generic("Thing", T.string-or-number)).to-string()

test "Union of complement", #
  let not-number = ~T.number
  eq T.any, not-number union T.number, "!N ∪ N"
  eq not-number, not-number union T.string, "!N ∪ S"
  eq T.any, not-number union T.string-or-number, "!N ∪ (S ∪ N)"
  eq not-number, not-number union (T.boolean union T.string), "!N ∪ (S|B)"
  eq T.any, not-number union T.any, "!N ∪ *"
  eq not-number, not-number union T.none, "!N ∪ 0"
  eq not-number, not-number union T.array, "!N ∪ [*]"
  eq not-number, not-number union T.number.array(), "!N ∪ [N]"
  eq not-number, not-number union not-number.array(), "!N ∪ [!N]"
  eq T.any, not-number union ~T.number.array(), "!N ∪ ![N]"
  eq not-number, not-number union T.function, "!N ∪ -> *"
  eq not-number, not-number union T.number.function(), "!N ∪ -> N"
  eq not-number, not-number union not-number.function(), "!N ∪ -> !N"
  eq T.any, not-number union ~T.number.function(), "!N ∪ !(-> N)"
  ok (not-number union ~T.number) equals not-number, "!N ∪ !N"
  eq T.any, not-number union ~T.string, "!N ∪ !S"
  eq not-number, not-number union T.object, "!N ∪ {}"
  eq not-number, not-number union T.generic("Thing", T.number), "!N ∪ X<N>"

test "Union of none", #
  eq T.number, T.none union T.number, "0 ∪ N"
  eq T.string-or-number, T.none union T.string-or-number, "0 ∪ (S ∪ N)"
  eq T.any, T.none union T.any, "0 ∪ *"
  eq T.none, T.none union T.none, "0 ∪ 0"
  eq T.array, T.none union T.array, "0 ∪ [*]"
  eq T.number.array(), T.none union T.number.array(), "0 ∪ [N]"
  eq T.function, T.none union T.function, "0 ∪ -> *"
  eq T.number.function(), T.none union T.number.function(), "0 ∪ -> N"
  let not-number = ~T.number
  eq not-number, T.none union not-number, "0 ∪ !N"
  eq T.object, T.none union T.object, "0 ∪ {}"
  let my-object = T.make-object(x: T.number)
  eq my-object, T.none union my-object, "0 ∪ {x:N}"
  let my-generic = T.generic("Thing", T.number)
  eq my-generic, T.none union my-generic, "0 ∪ X<N>"

test "Union of any", #
  eq T.any, T.any union T.number, "* ∪ N"
  eq T.any, T.any union T.string-or-number, "* ∪ (S ∪ N)"
  eq T.any, T.any union T.any, "* ∪ *"
  eq T.any, T.any union T.none, "* ∪ 0"
  eq T.any, T.any union T.array, "* ∪ [*]"
  eq T.any, T.any union T.number.array(), "* ∪ [N]"
  eq T.any, T.any union T.function, "* ∪ -> *"
  eq T.any, T.any union T.number.function(), "* ∪ -> N"
  eq T.any, T.any union ~T.number, "* ∪ !N"
  eq T.any, T.any union T.object, "* ∪ {}"
  eq T.any, T.any union T.make-object(x: T.number), "* ∪ {}"
  eq T.any, T.any union T.generic("Thing", T.number), "* ∪ X<N>"

test "Union of specialized array", #
  eq "([Number]|Number)", (T.number.array() union T.number).to-string(), "[N] ∪ N"
  eq "([Number]|String)", (T.number.array() union T.string).to-string(), "[N] ∪ S"
  eq "([Number]|Number|String)", (T.number.array() union T.string-or-number).to-string(), "[N] ∪ (S ∪ N)"
  eq "([Number]|-> Number)", (T.number.array() union T.number.function()).to-string(), "[N] ∪ -> N"
  eq T.any, T.number.array() union T.any, "[N] ∪ *"
  eq T.number.array(), T.number.array() union T.none, "[N] ∪ 0"
  eq T.array, T.number.array() union T.array, "[N] ∪ [*]"
  eq T.number.array(), T.number.array() union T.number.array(), "[N] ∪ [N]"
  eq "([Number]|[String])", (T.number.array() union T.string.array()).to-string(), "[N] ∪ [S]"
  let not-number = ~T.number
  eq not-number, T.number.array() union not-number, "[N] ∪ !N"
  eq T.any, T.number.array() union ~T.number.array(), "[N] ∪ ![N]"
  eq "([Number]|{})", (T.number.array() union T.object).to-string(), "[N] ∪ {}"
  eq "([Number]|{x: Number})", (T.number.array() union T.make-object(x: T.number)).to-string(), "[N] ∪ {x:N}"
  eq "([Number]|Thing<Number>)", (T.number.array() union T.generic("Thing", T.number)).to-string(), "[N] ∪ X<N>"

test "Union of array", #
  eq "([]|Number)", (T.array union T.number).to-string(), "[*] ∪ N"
  eq "([]|String)", (T.array union T.string).to-string(), "[*] ∪ S"
  eq "([]|Number|String)", (T.array union T.string-or-number).to-string(), "[*] ∪ (S ∪ N)"
  eq "([]|->)", (T.array union T.function).to-string(), "[*] ∪ -> *"
  eq T.any, T.array union T.any, "[*] ∪ *"
  eq T.array, T.array union T.none, "[*] ∪ 0"
  eq T.array, T.array union T.array, "[*] ∪ [*]"
  eq T.array, T.array union T.number.array(), "[*] ∪ [N]"
  let not-number = ~T.number
  eq not-number, T.array union not-number, "[*] ∪ !N"
  eq T.any, T.array union ~T.array, "[*] ∪ ![*]"
  eq "([]|{})", (T.array union T.object).to-string(), "[*] ∪ {}"
  eq "([]|{x: Number})", (T.array union T.make-object(x: T.number)).to-string(), "[*] ∪ {x:*}"
  eq "([]|Thing<Number>)", (T.array union T.generic("Thing", T.number)).to-string(), "[*] ∪ X<N>"

test "Union of specialized function", #
  eq "(-> Number|Number)", (T.number.function() union T.number).to-string(), "-> N ∪ N"
  eq "(-> Number|String)", (T.number.function() union T.string).to-string(), "-> N ∪ S"
  eq "(-> Number|Number|String)", (T.number.function() union T.string-or-number).to-string(), "-> N ∪ (S ∪ N)"
  eq "([Number]|-> Number)", (T.number.function() union T.number.array()).to-string(), "-> N ∪ [N]"
  eq T.any, T.number.function() union T.any, "-> N ∪ *"
  eq T.number.function(), T.number.function() union T.none, "-> N ∪ 0"
  eq T.function, T.number.function() union T.function, "-> N ∪ -> *"
  eq T.number.function(), T.number.function() union T.number.function(), "-> N ∪ -> N"
  eq "(-> Number|-> String)", (T.number.function() union T.string.function()).to-string(), "-> N ∪ -> S"
  let not-number = ~T.number
  eq not-number, T.number.function() union not-number, "-> N ∪ !N"
  eq T.any, T.number.function() union ~T.number.function(), "-> N ∪ !(-> N)"
  eq "(-> Number|{})", (T.number.function() union T.object).to-string(), "-> N ∪ {}"
  eq "(-> Number|{x: Number})", (T.number.function() union T.make-object(x: T.number)).to-string(), "-> N ∪ {x:N}"
  eq "(-> Number|Thing<Number>)", (T.number.function() union T.generic("Thing", T.number)).to-string(), "-> N ∪ X<N>"

test "Union of function", #
  eq "(->|Number)", (T.function union T.number).to-string(), "-> * ∪ N"
  eq "(->|String)", (T.function union T.string).to-string(), "-> * ∪ S"
  eq "(->|Number|String)", (T.function union T.string-or-number).to-string(), "-> * ∪ (S ∪ N)"
  eq "([]|->)", (T.function union T.array).to-string(), "-> * ∪ [*]"
  eq T.any, T.function union T.any, "-> * ∪ *"
  eq T.function, T.function union T.none, "-> * ∪ 0"
  eq T.function, T.function union T.function, "-> * ∪ -> *"
  eq T.function, T.function union T.number.function(), "-> * ∪ -> N"
  let not-number = ~T.number
  eq not-number, T.function union not-number, "-> * ∪ !N"
  eq T.any, T.function union ~T.function, "-> * ∪ !(-> *)"
  eq "(->|{})", (T.function union T.object).to-string(), "-> * ∪ {}"
  eq "(->|{x: Number})", (T.function union T.make-object(x: T.number)).to-string(), "-> * ∪ {x:N}"
  eq "(->|Thing<Number>)", (T.function union T.generic("Thing", T.number)).to-string(), "-> * ∪ X<N>"

test "Union of specialized object", #
  let my-object = T.make-object(x: T.number)
  eq "({x: Number}|Number)", (my-object union T.number).to-string(), "{x:N} ∪ N"
  eq "({x: Number}|String)", (my-object union T.string).to-string(), "{x:N} ∪ S"
  eq "({x: Number}|Number|String)", (my-object union T.string-or-number).to-string(), "{x:N} ∪ (S ∪ N)"
  eq "([Number]|{x: Number})", (my-object union T.number.array()).to-string(), "{x:N} ∪ [N]"
  eq "(-> Number|{x: Number})", (my-object union T.number.function()).to-string(), "{x:N} ∪ -> N"
  eq T.any, my-object union T.any, "{x:N} ∪ *"
  eq my-object, my-object union T.none, "{x:N} ∪ 0"
  let not-number = ~T.number
  eq not-number, my-object union not-number, "{x:N} ∪ !N"
  eq T.any, my-object union ~my-object, "{x:N} ∪ !{x:N}"
  eq T.object, (my-object union T.object), "{x:N} ∪ {}"
  eq my-object, (my-object union T.make-object(x: T.number)), "{x:N} ∪ {x:N}"
  eq "({x: Number}|{x: String})", (my-object union T.make-object(x: T.string)).to-string(), "{x:N} ∪ {x:S}"
  eq my-object, my-object union T.make-object(x: T.number, y: T.string), "{x:N} ∪ {x:N, y:S}"
  eq my-object, T.make-object(x: T.number, y: T.string) union my-object, "{x:N, y:S} ∪ {x:N}"
  eq T.object, my-object union T.make-object(x: T.string) union T.object, "{x:N} ∪ {x:S} ∪ {}"
  eq my-object, T.make-object(x: T.number, y: T.string) union T.make-object(x: T.number, z: T.boolean) union my-object, "{x:N, x:S} ∪ {x:N, z:B} ∪ {x:N}"
  eq "(Thing<Number>|{x: Number})", (my-object union T.generic("Thing", T.number)).to-string(), "{x:N} ∪ X<N>"

test "Union of object", #
  eq "({}|Number)", (T.object union T.number).to-string(), "{} ∪ N"
  eq "({}|String)", (T.object union T.string).to-string(), "{} ∪ S"
  eq "({}|Number|String)", (T.object union T.string-or-number).to-string(), "{} ∪ (S ∪ N)"
  eq "([]|{})", (T.object union T.array).to-string(), "{} ∪ [*]"
  eq "(->|{})", (T.object union T.function).to-string(), "{} ∪ ->"
  eq T.any, T.object union T.any, "{} ∪ *"
  eq T.object, T.object union T.none, "{} ∪ 0"
  let not-number = ~T.number
  eq not-number, T.object union not-number, "{} ∪ !N"
  eq T.any, T.object union ~T.object, "{} ∪ !{}"
  eq T.object, T.object union T.object, "{} ∪ {}"
  eq T.object, T.object union T.make-object(x: T.number), "{} ∪ {x:N}"
  eq "(Thing<Number>|{})", (T.object union T.generic("Thing", T.number)).to-string(), "{} ∪ X<N>"

test "Union of generic", #
  let my-generic = T.generic("Thing", T.number)
  eq "(Thing<Number>|Number)", (my-generic union T.number).to-string(), "X<N> ∪ N"
  eq "(Thing<Number>|String)", (my-generic union T.string).to-string(), "X<N> ∪ S"
  eq "(Thing<Number>|Number|String)", (my-generic union T.string-or-number).to-string(), "X<N> ∪ (S ∪ N)"
  eq "([Number]|Thing<Number>)", (my-generic union T.number.array()).to-string(), "X<N> ∪ [N]"
  eq "(-> Number|Thing<Number>)", (my-generic union T.number.function()).to-string(), "X<N> ∪ -> N"
  eq T.any, my-generic union T.any, "X<N> ∪ *"
  eq my-generic, my-generic union T.none, "X<N> ∪ 0"
  let not-number = ~T.number
  eq not-number, my-generic union not-number, "X<N> ∪ !N"
  eq T.any, my-generic union ~my-generic, "X<N> ∪ !X<N>"
  eq "(Thing<Number>|{})", (my-generic union T.object).to-string(), "X<N> ∪ {}"
  eq "(Thing<Number>|{x: Number})", (my-generic union T.make-object(x: T.number)).to-string(), "X<N> ∪ {x:N}"
  eq "(Other<Number>|Thing<Number>)", (my-generic union T.generic("Other", T.number)).to-string(), "X<N> ∪ Y<N>"
  eq "(Thing<Number>|Thing<Number>)", (my-generic union T.generic("Thing", T.number)).to-string(), "X<N> ∪ Z<N>"
  eq my-generic, my-generic union T.generic(my-generic.base, T.number), "X<N> ∪ X<N>"
  eq "(Thing<Number>|Thing<String>)", (my-generic union T.generic(my-generic.base, T.string)).to-string(), "X<N> ∪ X<S>"

test "Intersection of simple", #
  eq T.number, T.number intersect T.number, "N ∩ N"
  eq T.none, T.number intersect T.string, "N ∩ S"
  eq T.number, T.number intersect T.string-or-number, "N ∩ (S ∪ N)"
  eq T.number, T.number intersect ~T.string, "N ∩ !S"
  eq T.none, T.number intersect ~T.number, "N ∩ !N"
  eq T.number, T.number intersect T.any, "N ∩ *"
  eq T.none, T.number intersect T.none, "N ∩ 0"
  eq T.none, T.number intersect T.number.array(), "N ∩ [N]"
  eq T.none, T.number intersect T.number.function(), "N ∩ -> N"
  eq T.none, T.number intersect T.object, "N ∩ {}"
  eq T.none, T.number intersect T.make-object(x: T.number), "N ∩ {x:N}"
  eq T.none, T.number intersect T.generic("Thing", T.number), "N ∩ X<N>"

test "Intersection of union", #
  eq T.number, T.string-or-number intersect T.number, "(S ∪ N) ∩ N"
  eq T.string-or-number, T.string-or-number intersect T.string-or-number, "(S ∪ N) ∩ (S ∪ N)"
  eq T.number, T.string-or-number intersect (T.number union T.boolean), "(S ∪ N) ∩ (N|B)"
  eq T.string-or-number, T.string-or-number intersect (T.boolean union T.string-or-number), "(S ∪ N) ∩ (S|N|B)"
  eq T.string-or-number, T.string-or-number intersect T.any, "(S ∪ N) ∩ *"
  eq T.none, T.string-or-number intersect T.none, "(S ∪ N) ∩ 0"
  eq T.none, T.string-or-number intersect T.number.array(), "(S ∪ N) ∩ [N]"
  eq T.none, T.string-or-number intersect T.string-or-number.array(), "(S ∪ N) ∩ [(S ∪ N)]"
  eq T.none, T.string-or-number intersect T.number.function(), "(S ∪ N) ∩ -> N"
  eq T.none, T.string-or-number intersect T.string-or-number.function(), "(S ∪ N) ∩ -> (S ∪ N)"
  eq T.string-or-number, T.string-or-number intersect ~T.boolean, "(S ∪ N) ∩ !B"
  eq T.string, T.string-or-number intersect ~T.number, "(S ∪ N) ∩ !N"
  eq T.number, T.string-or-number intersect ~T.string, "(S ∪ N) ∩ !S"
  eq T.none, T.string-or-number intersect ~T.string-or-number, "(S ∪ N) ∩ !(S ∪ N)"
  eq T.none, T.string-or-number intersect T.object, "(S ∪ N) ∩ {}"
  eq T.none, T.string-or-number intersect T.make-object(x: T.string-or-number), "(S ∪ N) ∩ {x:(S ∪ N)}"
  eq T.none, T.string-or-number intersect T.generic("Thing", T.number), "(S ∪ N) ∩ X<N>"

test "Intersection of complement", #
  let not-number = ~T.number
  eq T.none, not-number intersect T.number, "!N ∩ N"
  eq T.string, not-number intersect T.string, "!N ∩ S"
  eq T.string, not-number intersect T.string-or-number, "!N ∩ (S ∪ N)"
  let boolean-or-string = T.boolean union T.string
  eq boolean-or-string, not-number intersect boolean-or-string, "!N ∩ (S|B)"
  eq not-number, not-number intersect T.any, "!N ∩ *"
  eq T.none, not-number intersect T.none, "!N ∩ 0"
  eq T.array, not-number intersect T.array, "!N ∩ [*]"
  eq T.number.array(), not-number intersect T.number.array(), "!N ∩ [N]"
  ok (not-number intersect not-number.array()) equals not-number.array(), "!N ∩ [!N]"
  ok (not-number intersect ~T.number.array()) equals ~(T.number union T.number.array()), "!N ∩ ![N]"
  eq T.function, not-number intersect T.function, "!N ∩ -> *"
  eq T.number.function(), not-number intersect T.number.function(), "!N ∩ -> N"
  ok (not-number intersect not-number.function()) equals not-number.function(), "!N ∩ -> !N"
  ok (not-number intersect ~T.number.function()) equals ~(T.number union T.number.function()), "!N ∩ !(-> N)"
  ok (not-number intersect ~T.number) equals not-number, "!N ∩ !N"
  ok (not-number intersect ~T.string) equals ~T.string-or-number, "!N ∩ !S"
  eq T.object, (not-number intersect T.object), "!N ∩ {}"
  let my-object = T.make-object(x: not-number)
  eq my-object, not-number intersect my-object, "!N ∩ {x:!N}"
  let my-generic = T.generic("Thing", not-number)
  eq my-generic, not-number intersect my-generic, "!N ∩ X<!N>"

test "Intersection of none", #
  eq T.none, T.none intersect T.number, "0 ∩ N"
  eq T.none, T.none intersect T.string-or-number, "0 ∩ (S ∪ N)"
  eq T.none, T.none intersect T.any, "0 ∩ *"
  eq T.none, T.none intersect T.none, "0 ∩ 0"
  eq T.none, T.none intersect T.array, "0 ∩ [*]"
  eq T.none, T.none intersect T.number.array(), "0 ∩ [N]"
  eq T.none, T.none intersect T.function, "0 ∩ -> *"
  eq T.none, T.none intersect T.function.array(), "0 ∩ -> N"
  eq T.none, T.none intersect ~T.number, "0 ∩ !N"
  eq T.none, T.none intersect T.object, "0 ∩ {}"
  eq T.none, T.none intersect T.make-object(x: T.number), "0 ∩ {x:N}"
  eq T.none, T.none intersect T.generic("Thing", T.number), "0 ∩ X<N>"

test "Intersection of any", #
  eq T.number, T.any intersect T.number, "* ∩ N"
  eq T.string-or-number, T.any intersect T.string-or-number, "* ∩ (S ∪ N)"
  eq T.any, T.any intersect T.any, "* ∩ *"
  eq T.none, T.any intersect T.none, "* ∩ 0"
  eq T.array, T.any intersect T.array, "* ∩ [*]"
  eq T.number.array(), T.any intersect T.number.array(), "* ∩ [N]"
  eq T.function, T.any intersect T.function, "* ∩ -> *"
  eq T.number.function(), T.any intersect T.number.function(), "* ∩ -> N"
  let not-number = ~T.number
  eq not-number, T.any intersect not-number, "* ∩ !N"
  eq T.object, T.any intersect T.object, "* ∩ {}"
  let my-object = T.make-object(x: T.number)
  eq my-object, T.any intersect my-object, "* ∩ {x:N}"
  let my-generic = T.generic("Thing", T.number)
  eq my-generic, T.any intersect my-generic, "* ∩ X<N>"

test "Intersection of specialized array", #
  eq T.none, T.number.array() intersect T.number, "[N] ∩ N"
  eq T.none, T.number.array() intersect T.string, "[N] ∩ S"
  eq T.none, T.number.array() intersect T.string-or-number, "[N] ∩ (S ∪ N)"
  eq T.number.array(), T.number.array() intersect T.any, "[N] ∩ *"
  eq T.none, T.number.array() intersect T.none, "[N] ∩ 0"
  eq T.number.array(), T.number.array() intersect T.array, "[N] ∩ [*]"
  eq T.number.array(), T.number.array() intersect T.number.array(), "[N] ∩ [N]"
  eq T.none.array(), (T.number.array() intersect T.string.array()), "[N] ∩ [S]"
  eq T.number.array(), T.number.array() intersect ~T.number, "[N] ∩ !N"
  eq T.none, T.number.array() intersect ~T.number.array(), "[N] ∩ ![N]"
  eq T.none, T.number.array() intersect T.function, "[N] ∩ -> *"
  eq T.none, T.number.array() intersect T.number.function(), "[N] ∩ -> N"
  eq T.none, T.number.array() intersect T.object, "[N] ∩ {}"
  eq T.none, T.number.array() intersect T.make-object(x: T.number), "[N] ∩ {x:N}"
  eq T.none, T.number.array() intersect T.generic("Thing", T.number), "[N] ∩ X<N>"

test "Intersection of array", #
  eq T.none, T.array intersect T.number, "[*] ∩ N"
  eq T.none, T.array intersect T.string, "[*] ∩ S"
  eq T.none, T.array intersect T.string-or-number, "[*] ∩ (S ∪ N)"
  eq T.array, T.array intersect T.any, "[*] ∩ *"
  eq T.none, T.array intersect T.none, "[*] ∩ 0"
  eq T.array, T.array intersect T.array, "[*] ∩ [*]"
  eq T.number.array(), T.array intersect T.number.array(), "[*] ∩ [N]"
  eq T.array, T.array intersect ~T.number, "[*] ∩ !N"
  eq T.none, T.array intersect ~T.array, "[*] ∩ ![*]"
  eq T.none, T.array intersect T.function, "[*] ∩ -> *"
  eq T.none, T.array intersect T.number.function(), "[*] ∩ -> N"
  eq T.none, T.array intersect T.object, "[*] ∩ {}"
  eq T.none, T.array intersect T.make-object(x: T.number), "[*] ∩ {x:N}"
  eq T.none, T.array intersect T.generic("Thing", T.any), "[*] ∩ X<*>"

test "Intersection of specialized function", #
  eq T.none, T.number.function() intersect T.number, "-> N ∩ N"
  eq T.none, T.number.function() intersect T.string, "-> N ∩ S"
  eq T.none, T.number.function() intersect T.string-or-number, "-> N ∩ (S ∪ N)"
  eq T.number.function(), T.number.function() intersect T.any, "-> N ∩ *"
  eq T.none, T.number.function() intersect T.none, "-> N ∩ 0"
  eq T.number.function(), T.number.function() intersect T.function, "-> N ∩ -> *"
  eq T.number.function(), T.number.function() intersect T.number.function(), "-> N ∩ -> N"
  eq T.none.function(), (T.number.function() intersect T.string.function()), "-> N ∩ -> S"
  eq T.number.function(), T.number.function() intersect ~T.number, "-> N ∩ !N"
  eq T.none, T.number.function() intersect ~T.number.function(), "-> N ∩ !(-> N)"
  eq T.none, T.number.function() intersect T.array, "-> N ∩ [*]"
  eq T.none, T.number.function() intersect T.number.array(), "-> N ∩ [N]"
  eq T.none, T.number.function() intersect T.object, "-> N ∩ {}"
  eq T.none, T.number.function() intersect T.make-object(x: T.number), "-> N ∩ {x:N}"
  eq T.none, T.number.function() intersect T.generic("Thing", T.number), "-> N ∩ X<N>"

test "Intersection of function", #
  eq T.none, T.function intersect T.number, "-> * ∩ N"
  eq T.none, T.function intersect T.string, "-> * ∩ S"
  eq T.none, T.function intersect T.string-or-number, "-> * ∩ (S ∪ N)"
  eq T.function, T.function intersect T.any, "-> * ∩ *"
  eq T.none, T.function intersect T.none, "-> * ∩ 0"
  eq T.function, T.function intersect T.function, "-> * ∩ -> *"
  eq T.number.function(), T.function intersect T.number.function(), "-> * ∩ -> N"
  eq T.function, T.function intersect ~T.number, "-> * ∩ !N"
  eq T.none, T.function intersect ~T.function, "-> * ∩ !(-> *)"
  eq T.none, T.function intersect T.array, "-> * ∩ [*]"
  eq T.none, T.function intersect T.number.array(), "-> * ∩ [N]"
  eq T.none, T.function intersect T.object, "-> * ∩ {}"
  eq T.none, T.function intersect T.make-object(x: T.number), "-> * ∩ {x:N}"
  eq T.none, T.function intersect T.generic("Thing", T.number), "-> * ∩ X<N>"

test "Intersection of specialized object", #
  let my-object = T.make-object(x: T.number)
  eq T.none, my-object intersect T.number, "{x:N} ∩ N"
  eq T.none, my-object intersect T.string, "{x:N} ∩ S"
  eq T.none, my-object intersect T.string-or-number, "{x:N} ∩ (S ∪ N)"
  eq my-object, my-object intersect T.any, "{x:N} ∩ *"
  eq T.none, my-object intersect T.none, "{x:N} ∩ 0"
  eq T.none, my-object intersect T.function, "{x:N} ∩ -> *"
  eq T.none, my-object intersect T.number.function(), "{x:N} ∩ -> N"
  eq my-object, my-object intersect ~T.number, "{x:N} ∩ !N"
  eq T.none, my-object intersect ~my-object, "{x:N} ∩ !{x:N}"
  eq T.none, my-object intersect T.array, "{x:N} ∩ [*]"
  eq T.none, my-object intersect T.number.array(), "{x:N} ∩ [N]"
  eq my-object, my-object intersect T.object, "{x:N} ∩ {}"
  eq my-object, my-object intersect T.make-object(x: T.number), "{x:N} ∩ {x:N}"
  let other-object = T.make-object(x: T.number, y: T.string)
  eq other-object, my-object intersect other-object, "{x:N} ∩ {x:N, y:S}"
  let bad-object = T.make-object(x: T.string)
  ok (my-object intersect bad-object) equals T.make-object(x: T.none), "{x:N} ∩ {x:S}"
  eq T.none, my-object intersect T.generic("Thing", T.number), "{x:N} ∩ X<N>"

test "Intersection of object", #
  eq T.none, T.object intersect T.number, "{} ∩ N"
  eq T.none, T.object intersect T.string, "{} ∩ S"
  eq T.none, T.object intersect T.string-or-number, "{} ∩ (S ∪ N)"
  eq T.object, T.object intersect T.any, "{} ∩ *"
  eq T.none, T.object intersect T.none, "{} ∩ 0"
  eq T.none, T.object intersect T.function, "{} ∩ -> *"
  eq T.none, T.object intersect T.number.function(), "{} ∩ -> N"
  eq T.object, T.object intersect ~T.number, "{} ∩ !N"
  eq T.none, T.object intersect ~T.object, "{} ∩ !{}"
  eq T.none, T.object intersect T.array, "{} ∩ [*]"
  eq T.none, T.object intersect T.number.array(), "{} ∩ [N]"
  eq T.object, T.object intersect T.object, "{} ∩ {}"
  let my-object = T.make-object(x: T.number)
  eq my-object, T.object intersect my-object, "{} ∩ {x:N}"
  eq T.none, T.object intersect T.generic("Thing", T.number), "{} ∩ X<N>"

test "Intersection of generic", #
  let my-generic = T.generic("Thing", T.number)
  eq T.none, my-generic intersect T.number, "X<N> ∩ N"
  eq T.none, my-generic intersect T.string, "X<N> ∩ S"
  eq T.none, my-generic intersect T.string-or-number, "X<N> ∩ (S ∪ N)"
  eq my-generic, my-generic intersect T.any, "X<N> ∩ *"
  eq T.none, my-generic intersect T.none, "X<N> ∩ 0"
  eq T.none, my-generic intersect T.function, "X<N> ∩ -> *"
  eq T.none, my-generic intersect T.number.function(), "X<N> ∩ -> N"
  eq my-generic, my-generic intersect ~T.number, "X<N> ∩ !N"
  eq T.none, my-generic intersect ~my-generic, "X<N> ∩ !X<N>"
  eq T.none, my-generic intersect T.array, "X<N> ∩ [*]"
  eq T.none, my-generic intersect T.number.array(), "X<N> ∩ [N]"
  eq T.none, my-generic intersect T.object, "X<N> ∩ {}"
  eq T.none, my-generic intersect T.make-object(x: T.number), "X<N> ∩ {x:N}"
  eq my-generic, my-generic intersect T.generic(my-generic.base, T.string-or-number), "X<N> ∩ X<(S ∪ N)>"
  eq my-generic, T.generic(my-generic.base, T.string-or-number) intersect my-generic, "X<(S ∪ N)> ∩ X<N>"
  ok (my-generic intersect T.generic(my-generic.base, T.string)) equals T.generic(my-generic.base, T.none), "X<N> ∩ X<S>"
  eq T.none, my-generic intersect T.generic("Other", T.number), "X<N> ∩ Y<N>"
  eq T.none, my-generic intersect T.generic("Thing", T.number), "X<N> ∩ Z<N>"

test "Arrays", #
  eq "[]", T.array.to-string()
  eq "[Boolean]", T.boolean.array().to-string()
  eq "[String]", T.string.array().to-string()
  eq "[[String]]", T.string.array().array().to-string()
  ok T.boolean.array() equals T.boolean.array()
  ok T.string.array() equals T.string.array()
  ok T.boolean.array() not equals T.string.array()
  ok T.array overlaps T.boolean.array()
  ok T.boolean.array() overlaps T.array
  ok T.boolean.array() subset T.array
  ok T.array not subset T.boolean.array()
  eq T.array, T.boolean.array() union T.array
  
  ok T.array equals T.any.array()

test "Functions", #
  eq "->", T.function.to-string()
  eq "-> Boolean", T.boolean.function().to-string()
  eq "-> String", T.string.function().to-string()
  eq "-> -> String", T.string.function().function().to-string()
  eq "-> [String]", T.string.array().function().to-string()
  eq "[-> String]", T.string.function().array().to-string()
  ok T.boolean.function() equals T.boolean.function()
  ok T.string.function() equals T.string.function()
  ok T.boolean.function() not equals T.string.function()
  ok T.function overlaps T.boolean.function()
  ok T.boolean.function() overlaps T.function
  ok T.boolean.function() subset T.function
  ok T.function not subset T.boolean.function()
  eq T.function, T.boolean.function() union T.function
  
  ok T.function equals T.any.function()

test "Objects", #
  eq "{}", T.object.to-string()
  eq T.object, T.make-object(x: T.any)
  eq "{x: Number}", T.make-object(x: T.number).to-string()
  eq "{x: Number, y: String}", T.make-object(x: T.number, y: T.string).to-string()
  eq "{x: Number, y: String}", T.make-object(y: T.string, x: T.number).to-string()
  ok T.make-object(x: T.number, y: T.string) equals T.make-object(y: T.string, x: T.number)
  ok T.make-object(x: T.number) subset T.object
  ok T.object not subset T.make-object(x: T.number)
  ok T.make-object(x: T.number) subset T.make-object(x: T.number)
  ok T.make-object(x: T.number) not subset T.make-object(x: T.string)
  ok T.make-object(x: T.number) subset T.make-object(x: T.string-or-number)
  ok (T.make-object(x: T.number) intersect T.make-object(y: T.string)) equals T.make-object(x: T.number, y: T.string)
  
  eq T.any, T.object.value(\x)
  eq T.number, T.make-object(x: T.number).value(\x)
  eq T.any, T.make-object(x: T.number).value(\y)
  eq T.any, T.make-object(x: T.number).value(\w)
  eq T.number, T.make-object(x: T.number, y: T.string).value(\x)
  eq T.string, T.make-object(x: T.number, y: T.string).value(\y)
  eq T.any, T.make-object(x: T.number, y: T.string).value(\z)
  eq T.any, T.make-object(x: T.number, y: T.string).value(\w)

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
  eq "-> Alpha", alpha.function().to-string()
  eq "-> Bravo", bravo.function().to-string()
  eq "[(Alpha|Bravo)]", (alpha union bravo).array().to-string()
  eq "-> (Alpha|Bravo)", (alpha union bravo).function().to-string()
  ok (alpha union bravo).array() equals (bravo union alpha).array()
  eq "([Alpha]|[Bravo])", (alpha.array() union bravo.array()).to-string()
  eq "(-> Alpha|-> Bravo)", (alpha.function() union bravo.function()).to-string()
  ok (alpha.array() union bravo.array()) equals (bravo.array() union alpha.array())
  ok (alpha.function() union bravo.function()) equals (bravo.function() union alpha.function())
  ok (alpha union bravo).array() not equals (alpha.array() union bravo.array())
  ok (alpha union bravo).function() not equals (alpha.function() union bravo.function())
  eq "{x: Alpha}", T.make-object(x: alpha).to-string()
  ok T.make-object(x: alpha) equals T.make-object(x: alpha)

  ok T.make("Alpha") not equals alpha // could be from different scopes
  ok T.make("Alpha").compare(alpha) != 0 // since not equal, should not compare to 0

test "Serialization", #
  let handle(x) -> T.from-JSON(JSON.parse(JSON.stringify(x)))
  eq T.undefined, handle(T.undefined)
  eq T.null, handle(T.null)
  eq T.string, handle(T.string)
  eq T.number, handle(T.number)
  eq T.boolean, handle(T.boolean)
  eq T.function, handle(T.function)
  eq T.object, handle(T.object)
  eq T.array, handle(T.array)
  eq T.args, handle(T.args)
  eq T.any, handle(T.any)
  eq T.none, handle(T.none)
  eq T.regexp, handle(T.regexp)
  ok T.string-or-number equals handle(T.string-or-number)
  eq T.number.array(), handle(T.number.array())
  eq T.number.function(), handle(T.number.function())
  ok ~T.string-or-number equals handle(~T.string-or-number)
  ok ~T.number equals handle(~T.number)
  ok T.make-object(x: T.number) equals handle(T.make-object(x: T.number))
  ok T.generic(T.string, T.number) equals handle(T.generic(T.string, T.number))
