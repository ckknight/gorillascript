let {expect} = require 'chai'
let T = require (if process.env.GORILLA_COV then '../lib-cov/types' else '../lib/types')

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

describe "Types", #
  it "Basic string representation", #
    expect(T.undefined.to-string()).to.equal "undefined"
    expect(T.null.to-string()).to.equal "null"
    expect(T.string.to-string()).to.equal "String"
    expect(T.number.to-string()).to.equal "Number"
    expect(T.boolean.to-string()).to.equal "Boolean"
    expect(T.function.to-string()).to.equal "->"
    expect(T.object.to-string()).to.equal "{}"
    expect(T.array.to-string()).to.equal "[]"
    expect(T.args.to-string()).to.equal "Arguments"
    expect(T.any.to-string()).to.equal "any"
    expect(T.none.to-string()).to.equal "none"
    expect(T.regexp.to-string()).to.equal "RegExp"
    expect(T.string-or-number.to-string()).to.equal "(Number|String)"
    expect(T.array-like.to-string()).to.equal "([]|Arguments)"
    expect(T.undefined-or-null.to-string()).to.equal "(null|undefined)"
    expect(T.not-undefined-or-null.to-string()).to.equal "any \\ (null|undefined)"
    expect(T.primitive.to-string()).to.equal "(Boolean|Number|String|null|undefined)"
    expect(T.non-primitive.to-string()).to.equal "any \\ (Boolean|Number|String|null|undefined)"
    expect(T.always-falsy.to-string()).to.equal "(null|undefined)"
    expect(T.potentially-truthy.to-string()).to.equal "any \\ (null|undefined)"
    expect(T.potentially-falsy.to-string()).to.equal "(Boolean|Number|String|null|undefined)"
    expect(T.always-truthy.to-string()).to.equal "any \\ (Boolean|Number|String|null|undefined)"
    expect(T.make-object(x: T.number).to-string()).to.equal "{x: Number}"
    expect(T.make-object(x: T.number, y: T.string).to-string()).to.equal "{x: Number, y: String}"
    expect(T.make-object(y: T.string, x: T.number).to-string()).to.equal "{x: Number, y: String}"
    expect(T.generic("Thing", T.string).to-string()).to.equal "Thing<String>"
    expect(T.generic("Thing", T.number).to-string()).to.equal "Thing<Number>"
    expect(T.generic("Thing", T.string-or-number).to-string()).to.equal "Thing<(Number|String)>"
    expect(T.generic("Thing", T.string, T.boolean).to-string()).to.equal "Thing<String, Boolean>"
    expect(T.generic("Thing", T.number, T.boolean).to-string()).to.equal "Thing<Number, Boolean>"
    expect(T.generic("Thing", T.string-or-number, T.boolean).to-string()).to.equal "Thing<(Number|String), Boolean>"
    expect(T.generic("Thing", T.any).to-string()).to.equal "Thing<>"
    expect(T.generic("Thing", T.any, T.boolean).to-string()).to.equal "Thing<,Boolean>"
    expect(T.generic("Thing", T.boolean, T.any).to-string()).to.equal "Thing<Boolean,>"
    expect(T.generic("Thing", T.any, T.any).to-string()).to.equal "Thing<,>"

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

  it "Complement", #
    expect(~T.none).to.equal T.any
    expect(~T.any).to.equal T.none

    expect((~T.boolean).to-string()).to.equal "any \\ Boolean"
    expect((~T.function).to-string()).to.equal "any \\ ->"
    expect((~(T.boolean union T.function)).to-string()).to.equal "any \\ (->|Boolean)"
    expect((~T.boolean.array()).to-string()).to.equal "any \\ [Boolean]"
    expect((~T.array).to-string()).to.equal "any \\ []"

    expect(~(~T.boolean)).to.equal T.boolean
    expect(~(~(T.boolean union T.function)) equals (T.boolean union T.function)).to.be.true
    expect(~(~(T.boolean.array()))).to.equal T.boolean.array()

    expect(~T.boolean union ~T.string).to.equal T.any
    expect(~(T.boolean union T.string) equals (~T.boolean intersect ~T.string)).to.be.true

  it "Subset of simple", #
    expect(T.number subset T.number, "N ⊆ N").to.be.true
    expect(T.number subset T.string, "N ⊆ S").to.be.false
    expect(T.number subset T.string-or-number, "N ⊆ (S ∪ N)").to.be.true
    expect(T.number subset ~T.string, "N ⊆ !S").to.be.true
    expect(T.number subset ~T.number, "N ⊆ !N").to.be.false
    expect(T.number subset T.any, "N ⊆ *").to.be.true
    expect(T.number subset T.none, "N ⊆ 0").to.be.false
    expect(T.number subset T.number.array(), "N ⊆ [N]").to.be.false
    expect(T.number subset T.number.function(), "N ⊆ -> N").to.be.false
    expect(T.number subset T.object, "N ⊆ {}").to.be.false
    expect(T.number subset T.generic("Thing", T.number), "N ⊆ X<N>").to.be.false

  it "Subset of union", #
    expect(T.string-or-number subset T.number, "(S ∪ N) ⊆ N").to.be.false
    expect(T.string-or-number subset T.string-or-number, "(S ∪ N) ⊆ (S ∪ N)").to.be.true
    expect(T.string-or-number subset (T.number union T.boolean), "(S ∪ N) ⊆ (N|B)").to.be.false
    expect(T.string-or-number subset (T.boolean union T.string-or-number), "(S ∪ N) ⊆ (S|N|B)").to.be.true
    expect(T.string-or-number subset T.any, "(S ∪ N) ⊆ *").to.be.true
    expect(T.string-or-number subset T.none, "(S ∪ N) ⊆ 0").to.be.false
    expect(T.string-or-number subset T.number.array(), "(S ∪ N) ⊆ [N]").to.be.false
    expect(T.string-or-number subset T.string-or-number.array(), "(S ∪ N) ⊆ [(S ∪ N)]").to.be.false
    expect(T.string-or-number subset T.string-or-number.function(), "(S ∪ N) ⊆ -> (S ∪ N)").to.be.false
    expect(T.string-or-number subset ~T.boolean, "(S ∪ N) ⊆ !B").to.be.true
    expect(T.string-or-number subset ~T.number, "(S ∪ N) ⊆ !N").to.be.false
    expect(T.string-or-number subset ~T.string, "(S ∪ N) ⊆ !S").to.be.false
    expect(T.string-or-number subset ~T.string-or-number, "(S ∪ N) ⊆ !(S ∪ N)").to.be.false
    expect(T.string-or-number subset T.object, "(S ∪ N) ⊆ {}").to.be.false
    expect(T.string-or-number subset T.generic("Thing", T.number), "(S ∪ N) ⊆ X<N>").to.be.false

  it "Subset of complement", #
    expect(~T.number subset T.number, "!N ⊆ N").to.be.false
    expect(~T.number subset T.string, "!N ⊆ S").to.be.false
    expect(~T.number subset T.string-or-number, "!N ⊆ (S ∪ N)").to.be.false
    expect(~T.number subset (T.boolean union T.string), "!N ⊆ (S|B)").to.be.false
    expect(~T.number subset T.any, "!N ⊆ *").to.be.true
    expect(~T.number subset T.none, "!N ⊆ 0").to.be.false
    expect(~T.number subset T.array, "!N ⊆ [*]").to.be.false
    expect(~T.number subset T.number.array(), "!N ⊆ [N]").to.be.false
    expect(~T.number subset ~T.number.array(), "!N ⊆ [!N]").to.be.false
    expect(~T.number subset T.number.function(), "!N ⊆ -> N").to.be.false
    expect(~T.number subset ~T.number.function(), "!N ⊆ -> !N").to.be.false
    expect(~T.number subset ~T.number, "!N ⊆ !N").to.be.true
    expect(~T.number subset ~T.string, "!N ⊆ !S").to.be.false
    expect(~T.number subset T.object, "!N ⊆ {}").to.be.false
    expect(~T.number subset T.generic("Thing", T.number), "!N ⊆ X<N>").to.be.false

  it "Subset of none", #
    expect(T.none subset T.number, "0 ⊆ N").to.be.true
    expect(T.none subset T.string-or-number, "0 ⊆ (S ∪ N)").to.be.true
    expect(T.none subset T.any, "0 ⊆ *").to.be.true
    expect(T.none subset T.none, "0 ⊆ 0").to.be.true
    expect(T.none subset T.array, "0 ⊆ [*]").to.be.true
    expect(T.none subset T.number.array(), "0 ⊆ [N]").to.be.true
    expect(T.none subset T.number.function(), "0 ⊆ -> N").to.be.true
    expect(T.none subset ~T.number, "0 ⊆ !N").to.be.true
    expect(T.none subset T.object, "0 ⊆ {}").to.be.true
    expect(T.none subset T.generic("Thing", T.number), "0 ⊆ X<N>").to.be.true

  it "Subset of any", #
    expect(T.any subset T.number, "* ⊆ N").to.be.false
    expect(T.any subset T.string-or-number, "* ⊆ (S ∪ N)").to.be.false
    expect(T.any subset T.any, "* ⊆ *").to.be.true
    expect(T.any subset T.none, "* ⊆ 0").to.be.false
    expect(T.any subset T.array, "* ⊆ [*]").to.be.false
    expect(T.any subset T.number.array(), "* ⊆ [N]").to.be.false
    expect(T.any subset T.number.function(), "* ⊆ -> N").to.be.false
    expect(T.any subset ~T.number, "* ⊆ !N").to.be.false
    expect(T.any subset T.object, "* ⊆ {}").to.be.false
    expect(T.any subset T.generic("Thing", T.number), "* ⊆ X<N>").to.be.false

  it "Subset of specialized array", #
    expect(T.number.array() subset T.number, "[N] ⊆ N").to.be.false
    expect(T.number.array() subset T.string, "[N] ⊆ S").to.be.false
    expect(T.number.array() subset T.string-or-number, "[N] ⊆ (S ∪ N)").to.be.false
    expect(T.number.array() subset T.any, "[N] ⊆ *").to.be.true
    expect(T.number.array() subset T.none, "[N] ⊆ 0").to.be.false
    expect(T.number.array() subset T.array, "[N] ⊆ [*]").to.be.true
    expect(T.number.array() subset T.number.array(), "[N] ⊆ [N]").to.be.true
    expect(T.number.array() subset T.string.array(), "[N] ⊆ [S]").to.be.false
    expect(T.number.array() subset ~T.number, "[N] ⊆ !N").to.be.true
    expect(T.number.array() subset T.number.function(), "[N] ⊆ -> N").to.be.false
    expect(T.number.array() subset T.object, "[N] ⊆ {}").to.be.false
    expect(T.number.array() subset T.generic("Thing", T.number), "[N] ⊆ X<N>").to.be.false

  it "Subset of array", #
    expect(T.array subset T.number, "[*] ⊆ N").to.be.false
    expect(T.array subset T.string, "[*] ⊆ S").to.be.false
    expect(T.array subset T.string-or-number, "[*] ⊆ (S ∪ N)").to.be.false
    expect(T.array subset T.any, "[*] ⊆ *").to.be.true
    expect(T.array subset T.none, "[*] ⊆ 0").to.be.false
    expect(T.array subset T.array, "[*] ⊆ [*]").to.be.true
    expect(T.array subset T.number.array(), "[*] ⊆ [N]").to.be.false
    expect(T.array subset ~T.number, "[*] ⊆ !N").to.be.true
    expect(T.array subset T.number.function(), "[*] ⊆ -> N").to.be.false
    // TODO: array is kind of a subset of {length: Number}
    expect(T.array subset T.object, "[*] ⊆ {}").to.be.false
    expect(T.array subset T.generic("Thing", T.any), "[*] ⊆ X<*>").to.be.false

  it "Subset of specialized function", #
    expect(T.number.function() subset T.number, "-> N ⊆ N").to.be.false
    expect(T.number.function() subset T.string, "-> N ⊆ S").to.be.false
    expect(T.number.function() subset T.string-or-number, "-> N ⊆ (S ∪ N)").to.be.false
    expect(T.number.function() subset T.any, "-> N ⊆ *").to.be.true
    expect(T.number.function() subset T.none, "-> N ⊆ 0").to.be.false
    expect(T.number.function() subset T.function, "-> N ⊆ [*]").to.be.true
    expect(T.number.function() subset T.number.function(), "-> N ⊆ -> N").to.be.true
    expect(T.number.function() subset T.string.function(), "-> N ⊆ -> S").to.be.false
    expect(T.number.function() subset ~T.number, "-> N ⊆ !N").to.be.true
    expect(T.number.function() subset T.number.array(), "-> N ⊆ [N]").to.be.false
    // TODO: a function is kind of a subset of {name: String, length: Number, etc.}
    expect(T.number.function() subset T.object, "-> N ⊆ {}").to.be.false
    expect(T.number.function() subset T.generic("Thing", T.number), "-> N ⊆ X<N>").to.be.false

  it "Subset of function", #
    expect(T.function subset T.number, "-> * ⊆ N").to.be.false
    expect(T.function subset T.string, "-> * ⊆ S").to.be.false
    expect(T.function subset T.string-or-number, "-> * ⊆ (S ∪ N)").to.be.false
    expect(T.function subset T.any, "-> * ⊆ *").to.be.true
    expect(T.function subset T.none, "-> * ⊆ 0").to.be.false
    expect(T.function subset T.function, "-> * ⊆ -> *").to.be.true
    expect(T.function subset T.number.function(), "-> * ⊆ [N]").to.be.false
    expect(T.function subset ~T.number, "-> * ⊆ !N").to.be.true
    expect(T.function subset T.array, "-> * ⊆ [N]").to.be.false
    expect(T.function subset T.number.array(), "-> * ⊆ [N]").to.be.false
    // TODO: a function is kind of a subset of {name: String, length: Number, etc.}
    expect(T.function subset T.object, "-> * ⊆ {}").to.be.false
    expect(T.function subset T.generic("Thing", T.any), "-> * ⊆ X<*>").to.be.false

  it "Subset of specialized object", #
    let my-object = T.make-object(x: T.number)
    expect(my-object subset T.number, "{x:N} ⊆ N").to.be.false
    expect(my-object subset T.string, "{x:N} ⊆ S").to.be.false
    expect(my-object subset T.string-or-number, "{x:N} ⊆ (S ∪ N)").to.be.false
    expect(my-object subset T.any, "{x:N} ⊆ *").to.be.true
    expect(my-object subset T.none, "{x:N} ⊆ 0").to.be.false
    expect(my-object subset T.function, "{x:N} ⊆ {x:N}").to.be.false
    expect(my-object subset T.number.function(), "{x:N} ⊆ [N]").to.be.false
    expect(my-object subset ~T.number, "{x:N} ⊆ !N").to.be.true
    expect(my-object subset T.array, "{x:N} ⊆ [N]").to.be.false
    expect(my-object subset T.number.array(), "{x:N} ⊆ [N]").to.be.false
    expect(my-object subset T.object, "{x:N} ⊆ {}").to.be.true
    expect(my-object subset my-object, "{x:N} ⊆ {x:N}").to.be.true
    expect(my-object subset T.make-object(x: T.number), "{x:N} ⊆ {x:N}").to.be.true
    expect(my-object subset T.make-object(x: T.string), "{x:N} ⊆ {x:S}").to.be.false
    expect(my-object subset T.generic("Thing", T.number), "{x:N} ⊆ X<N>").to.be.false

  it "Subset of object", #
    expect(T.object subset T.number, "{} ⊆ N").to.be.false
    expect(T.object subset T.string, "{} ⊆ S").to.be.false
    expect(T.object subset T.string-or-number, "{} ⊆ (S ∪ N)").to.be.false
    expect(T.object subset T.any, "{} ⊆ *").to.be.true
    expect(T.object subset T.none, "{} ⊆ 0").to.be.false
    expect(T.object subset T.function, "{} ⊆ -> *").to.be.false
    expect(T.object subset T.number.function(), "{} ⊆ -> N").to.be.false
    expect(T.object subset ~T.number, "{} ⊆ !N").to.be.true
    expect(T.object subset T.array, "{} ⊆ [N]").to.be.false
    expect(T.object subset T.number.array(), "{} ⊆ [N]").to.be.false
    expect(T.object subset T.object, "{} ⊆ {}").to.be.true
    expect(T.object subset T.make-object(x: T.number), "{} ⊆ {x:N}").to.be.false
    expect(T.object subset T.generic("Thing", T.number), "{} ⊆ X<N>").to.be.false

  it "Subset of generic", #
    let my-generic = T.generic("Thing", T.number)
    expect(my-generic subset T.number, "X<N> ⊆ N").to.be.false
    expect(my-generic subset T.string, "X<N> ⊆ S").to.be.false
    expect(my-generic subset T.string-or-number, "X<N> ⊆ (S ∪ N)").to.be.false
    expect(my-generic subset T.any, "X<N> ⊆ *").to.be.true
    expect(my-generic subset T.none, "X<N> ⊆ 0").to.be.false
    expect(my-generic subset T.function, "X<N> ⊆ -> *").to.be.false
    expect(my-generic subset T.number.function(), "X<N> ⊆ -> N").to.be.false
    expect(my-generic subset ~T.number, "X<N> ⊆ !N").to.be.true
    expect(my-generic subset T.array, "X<N> ⊆ [N]").to.be.false
    expect(my-generic subset T.number.array(), "X<N> ⊆ [N]").to.be.false
    expect(my-generic subset T.object, "X<N> ⊆ {}").to.be.false
    expect(my-generic subset T.make-object(x: T.number), "X<N> ⊆ {x:N}").to.be.false
    expect(my-generic subset my-generic, "X<N> ⊆ X<N>").to.be.true
    expect(my-generic subset T.generic("Other", T.number), "X<N> ⊆ Y<N>").to.be.false
    // even though the name is the same, they might point to different 'Thing's
    expect(my-generic subset T.generic("Thing", T.number), "X<N> ⊆ Z<N>").to.be.false
    expect(my-generic subset T.generic(my-generic.base, T.number), "X<N> ⊆ X<N>").to.be.true
    expect(my-generic subset T.generic(my-generic.base, T.string-or-number), "X<N> ⊆ X<S ∪ N>").to.be.true

  it "Overlap of simple", #
    expect(T.number overlaps T.number, "N ∩ N").to.be.true
    expect(T.number not overlaps T.string, "N ∩ S").to.be.true
    expect(T.number overlaps T.string-or-number, "N ∩ (S ∪ N)").to.be.true
    expect(T.number overlaps ~T.string, "N ∩ !S").to.be.true
    expect(T.number not overlaps ~T.number, "N ∩ !N").to.be.true
    expect(T.number overlaps T.any, "N ∩ *").to.be.true
    expect(T.number not overlaps T.none, "N ∩ 0").to.be.true
    expect(T.number not overlaps T.number.array(), "N ∩ [N]").to.be.true
    expect(T.number not overlaps T.number.function(), "N ∩ -> N").to.be.true
    expect(T.number not overlaps T.object, "N ∩ {}").to.be.true
    expect(T.number not overlaps T.generic("Thing", T.number), "N ∩ X<N>").to.be.true

  it "Overlap of union", #
    expect(T.string-or-number overlaps T.number, "(S ∪ N) ∩ N").to.be.true
    expect(T.string-or-number overlaps T.string-or-number, "(S ∪ N) ∩ (S ∪ N)").to.be.true
    expect(T.string-or-number overlaps (T.number union T.boolean), "(S ∪ N) ∩ (N|B)").to.be.true
    expect(T.string-or-number overlaps (T.boolean union T.string-or-number), "(S ∪ N) ∩ (S|N|B)").to.be.true
    expect(T.string-or-number not overlaps (T.boolean union T.function), "(S ∪ N) ∩ (B|F)").to.be.true
    expect(T.string-or-number overlaps T.any, "(S ∪ N) ∩ *").to.be.true
    expect(T.string-or-number not overlaps T.none, "(S ∪ N) ∩ 0").to.be.true
    expect(T.string-or-number not overlaps T.number.array(), "(S ∪ N) ∩ [N]").to.be.true
    expect(T.string-or-number not overlaps T.string-or-number.array(), "(S ∪ N) ∩ [(S ∪ N)]").to.be.true
    expect(T.string-or-number overlaps ~T.boolean, "(S ∪ N) ∩ !B").to.be.true
    expect(T.string-or-number overlaps ~T.number, "(S ∪ N) ∩ !N").to.be.true
    expect(T.string-or-number overlaps ~T.string, "(S ∪ N) ∩ !S").to.be.true
    expect(T.string-or-number not overlaps ~T.string-or-number, "(S ∪ N) ∩ !(S ∪ N)").to.be.true
    expect(T.string-or-number not overlaps T.string-or-number.function(), "(S ∪ N) ∩ -> (S ∪ N)").to.be.true
    expect(T.string-or-number not overlaps T.object, "(S ∪ N) ∩ {}").to.be.true
    expect(T.string-or-number not overlaps T.generic("Thing", T.number), "(S ∪ N) ∩ X<N>").to.be.true

  it "Overlap of complement", #
    expect(~T.number not overlaps T.number, "!N ∩ N").to.be.true
    expect(~T.number overlaps T.string, "!N ∩ S").to.be.true
    expect(~T.number overlaps T.string-or-number, "!N ∩ (S ∪ N)").to.be.true
    expect(~T.number overlaps (T.boolean union T.string), "!N ∩ (S|B)").to.be.true
    expect(~T.number overlaps T.any, "!N ∩ *").to.be.true
    expect(~T.number not overlaps T.none, "!N ∩ 0").to.be.true
    expect(~T.number overlaps T.array, "!N ∩ [*]").to.be.true
    expect(~T.number overlaps T.number.array(), "!N ∩ [N]").to.be.true
    expect(~T.number overlaps (~T.number.array()), "!N ∩ [!N]").to.be.true
    expect(~T.number overlaps ~T.number, "!N ∩ !N").to.be.true
    expect(~T.number overlaps ~T.string, "!N ∩ !S").to.be.true
    expect(~T.number overlaps T.number.function(), "!N ∩ -> N").to.be.true
    expect(~T.number overlaps T.object, "!N ∩ {}").to.be.true
    expect(~T.number overlaps T.generic("Thing", T.number), "!N ∩ X<N>").to.be.true

  it "Overlap of none", #
    expect(T.none not overlaps T.number, "0 ∩ N").to.be.true
    expect(T.none not overlaps T.string-or-number, "0 ∩ (S ∪ N)").to.be.true
    expect(T.none not overlaps T.any, "0 ∩ *").to.be.true
    expect(T.none not overlaps T.none, "0 ∩ 0").to.be.true
    expect(T.none not overlaps T.array, "0 ∩ [*]").to.be.true
    expect(T.none not overlaps T.number.array(), "0 ∩ [N]").to.be.true
    expect(T.none not overlaps ~T.number, "0 ∩ !N").to.be.true
    expect(T.none not overlaps T.number.function(), "0 ∩ -> N").to.be.true
    expect(T.none not overlaps T.object, "0 ∩ {}").to.be.true
    expect(T.none not overlaps T.generic("Thing", T.number), "0 ∩ X<N>").to.be.true

  it "Overlap of any", #
    expect(T.any overlaps T.number, "* ∩ N").to.be.true
    expect(T.any overlaps T.string-or-number, "* ∩ (S ∪ N)").to.be.true
    expect(T.any overlaps T.any, "* ∩ *").to.be.true
    expect(T.any overlaps T.none, "* ∩ 0").to.be.true
    expect(T.any overlaps T.array, "* ∩ [*]").to.be.true
    expect(T.any overlaps T.number.array(), "* ∩ [N]").to.be.true
    expect(T.any overlaps ~T.number, "* ∩ !N").to.be.true
    expect(T.any overlaps T.number.function(), "* ∩ -> N").to.be.true
    expect(T.any overlaps T.object, "* ∩ {}").to.be.true
    expect(T.any overlaps T.generic("Thing", T.number), "* ∩ X<N>").to.be.true

  it "Overlap of specialized array", #
    expect(T.number.array() not overlaps T.number, "[N] ∩ N").to.be.true
    expect(T.number.array() not overlaps T.string, "[N] ∩ S").to.be.true
    expect(T.number.array() not overlaps T.string-or-number, "[N] ∩ (S ∪ N)").to.be.true
    expect(T.number.array() overlaps T.any, "[N] ∩ *").to.be.true
    expect(T.number.array() not overlaps T.none, "[N] ∩ 0").to.be.true
    expect(T.number.array() overlaps T.array, "[N] ∩ [*]").to.be.true
    expect(T.number.array() overlaps T.number.array(), "[N] ∩ [N]").to.be.true
    expect(T.number.array() overlaps T.string.array(), "[N] ∩ [S]").to.be.true
    expect(T.number.array() overlaps ~T.number, "[N] ∩ !N").to.be.true
    expect(T.number.array() not overlaps T.number.function(), "[N] ∩ -> N").to.be.true
    expect(T.number.array() not overlaps T.object, "[N] ∩ {}").to.be.true
    expect(T.number.array() not overlaps T.generic("Thing", T.number), "[N] ∩ X<N>").to.be.true

  it "Overlap of array", #
    expect(T.array not overlaps T.number, "[*] ∩ N").to.be.true
    expect(T.array not overlaps T.string, "[*] ∩ S").to.be.true
    expect(T.array not overlaps T.string-or-number, "[*] ∩ (S ∪ N)").to.be.true
    expect(T.array overlaps T.any, "[*] ∩ *").to.be.true
    expect(T.array not overlaps T.none, "[*] ∩ 0").to.be.true
    expect(T.array overlaps T.array, "[*] ∩ [*]").to.be.true
    expect(T.array overlaps T.number.array(), "[*] ∩ [N]").to.be.true
    expect(T.array overlaps ~T.number, "[*] ∩ !N").to.be.true
    expect(T.array not overlaps T.number.function(), "[*] ∩ -> N").to.be.true
    expect(T.array not overlaps T.object, "[*] ∩ {}").to.be.true
    expect(T.array not overlaps T.generic("Thing", T.any), "[*] ∩ X<*>").to.be.true

  it "Overlap of specialized function", #
    expect(T.number.function() not overlaps T.number, "-> N ∩ N").to.be.true
    expect(T.number.function() not overlaps T.string, "-> N ∩ S").to.be.true
    expect(T.number.function() not overlaps T.string-or-number, "-> N ∩ (S ∪ N)").to.be.true
    expect(T.number.function() overlaps T.any, "-> N ∩ *").to.be.true
    expect(T.number.function() not overlaps T.none, "-> N ∩ 0").to.be.true
    expect(T.number.function() not overlaps T.array, "-> N ∩ [*]").to.be.true
    expect(T.number.function() overlaps T.function, "-> N ∩ -> *").to.be.true
    expect(T.number.function() overlaps T.number.function(), "-> N ∩ -> N").to.be.true
    expect(T.number.function() overlaps T.string.function(), "-> N ∩ -> S").to.be.true
    expect(T.number.function() overlaps ~T.number, "-> N ∩ !N").to.be.true
    expect(T.number.function() not overlaps T.number.array(), "-> N ∩ -> N").to.be.true
    expect(T.number.function() not overlaps T.object, "-> N ∩ {}").to.be.true
    expect(T.number.function() not overlaps T.generic("Thing", T.number), "[*] ∩ X<N>").to.be.true

  it "Overlap of function", #
    expect(T.function not overlaps T.number, "-> * ∩ N").to.be.true
    expect(T.function not overlaps T.string, "-> * ∩ S").to.be.true
    expect(T.function not overlaps T.string-or-number, "-> * ∩ (S ∪ N)").to.be.true
    expect(T.function overlaps T.any, "-> * ∩ *").to.be.true
    expect(T.function not overlaps T.none, "-> * ∩ 0").to.be.true
    expect(T.function not overlaps T.array, "-> * ∩ [*]").to.be.true
    expect(T.function not overlaps T.number.array(), "-> * ∩ [N]").to.be.true
    expect(T.function overlaps ~T.number, "-> * ∩ !N").to.be.true
    expect(T.function overlaps T.number.function(), "-> * ∩ -> N").to.be.true
    expect(T.function overlaps T.function, "-> * ∩ -> *").to.be.true
    expect(T.function not overlaps T.object, "-> * ∩ {}").to.be.true
    expect(T.function not overlaps T.generic("Thing", T.any), "-> * ∩ X<*>").to.be.true

  it "Overlap of specialized object", #
    let my-object = T.make-object(x: T.number)
    expect(my-object not overlaps T.number, "{x:N} ∩ N").to.be.true
    expect(my-object not overlaps T.string, "{x:N} ∩ S").to.be.true
    expect(my-object not overlaps T.string-or-number, "{x:N} ∩ (S ∪ N)").to.be.true
    expect(my-object overlaps T.any, "{x:N} ∩ *").to.be.true
    expect(my-object not overlaps T.none, "{x:N} ∩ 0").to.be.true
    expect(my-object not overlaps T.array, "{x:N} ∩ [*]").to.be.true
    expect(my-object not overlaps T.function, "{x:N} ∩ -> *").to.be.true
    expect(my-object not overlaps T.number.function(), "{x:N} ∩ -> N").to.be.true
    expect(my-object not overlaps T.string.function(), "{x:N} ∩ -> S").to.be.true
    expect(my-object overlaps ~T.number, "{x:N} ∩ !N").to.be.true
    expect(my-object not overlaps ~my-object, "{x:N} ∩ !{x:N}").to.be.true
    expect(my-object not overlaps ~T.make-object(x: T.number), "{x:N} ∩ !{x:N}").to.be.true
    expect(my-object overlaps ~T.make-object(x: T.string), "{x:N} ∩ !{x:S}").to.be.true
    expect(my-object overlaps ~T.make-object(y: T.string), "{x:N} ∩ !{y:S}").to.be.true
    expect(my-object not overlaps ~T.object, "{x:N} ∩ !{}").to.be.true
    expect(my-object not overlaps T.number.array(), "{x:N} ∩ -> N").to.be.true
    expect(my-object overlaps T.object, "{x:N} ∩ {}").to.be.true
    expect(my-object overlaps my-object, "{x:N} ∩ {x:N}").to.be.true
    expect(my-object overlaps T.make-object(x: T.number), "{x:N} ∩ {x:N}").to.be.true
    expect(my-object overlaps T.make-object(x: T.string), "{x:N} ∩ {x:S}").to.be.true
    expect(my-object overlaps T.make-object(y: T.string), "{x:N} ∩ {y:S}").to.be.true
    expect(my-object not overlaps T.generic("Thing", T.number), "{x:N} ∩ X<N>").to.be.true

  it "Overlap of object", #
    expect(T.object not overlaps T.number, "{} ∩ N").to.be.true
    expect(T.object not overlaps T.string, "{} ∩ S").to.be.true
    expect(T.object not overlaps T.string-or-number, "{} ∩ (S ∪ N)").to.be.true
    expect(T.object overlaps T.any, "{} ∩ *").to.be.true
    expect(T.object not overlaps T.none, "{} ∩ 0").to.be.true
    expect(T.object not overlaps T.array, "{} ∩ [*]").to.be.true
    expect(T.object not overlaps T.number.array(), "{} ∩ [N]").to.be.true
    expect(T.object overlaps ~T.number, "{} ∩ !N").to.be.true
    expect(T.object not overlaps ~T.object, "{} ∩ !{}").to.be.true
    expect(T.object overlaps ~T.make-object(x: T.number), "{} ∩ !{x:N}").to.be.true
    expect(T.object not overlaps T.number.function(), "{} ∩ -> N").to.be.true
    expect(T.object not overlaps T.function, "{} ∩ -> *").to.be.true
    expect(T.object overlaps T.object, "{} ∩ {}").to.be.true
    expect(T.object overlaps T.make-object(x: T.number), "{} ∩ {x:N}").to.be.true
    expect(T.object not overlaps T.generic("Thing", T.number), "{} ∩ X<N>").to.be.true

  it "Overlap of generic", #
    let my-generic = T.generic("Thing", T.number)
    expect(my-generic not overlaps T.number, "X<N> ∩ N").to.be.true
    expect(my-generic not overlaps T.string, "X<N> ∩ S").to.be.true
    expect(my-generic not overlaps T.string-or-number, "X<N> ∩ (S ∪ N)").to.be.true
    expect(my-generic overlaps T.any, "X<N> ∩ *").to.be.true
    expect(my-generic not overlaps T.none, "X<N> ∩ 0").to.be.true
    expect(my-generic not overlaps T.array, "X<N> ∩ [*]").to.be.true
    expect(my-generic not overlaps T.function, "X<N> ∩ -> *").to.be.true
    expect(my-generic not overlaps T.number.function(), "X<N> ∩ -> N").to.be.true
    expect(my-generic not overlaps T.string.function(), "X<N> ∩ -> S").to.be.true
    expect(my-generic overlaps ~T.number, "X<N> ∩ !N").to.be.true
    expect(my-generic overlaps ~T.make-object(x: T.number), "X<N> ∩ !X<N>").to.be.true
    expect(my-generic overlaps ~T.object, "X<N> ∩ !{}").to.be.true
    expect(my-generic not overlaps T.number.array(), "X<N> ∩ [N]").to.be.true
    expect(my-generic not overlaps T.object, "X<N> ∩ {}").to.be.true
    expect(my-generic overlaps my-generic, "X<N> ∩ X<N>").to.be.true
    expect(my-generic not overlaps T.generic("Other", T.number), "X<N> ∩ Y<N>").to.be.true
    expect(my-generic not overlaps T.generic("Thing", T.number), "X<N> ∩ Z<N>").to.be.true
    expect(my-generic overlaps T.generic(my-generic.base, T.number), "X<N> ∩ X<N>").to.be.true
    expect(my-generic overlaps T.generic(my-generic.base, T.string), "X<N> ∩ X<S>").to.be.true

  it "Union of simple", #
    expect(T.number union T.number).to.equal T.number, "N ∪ N"
    expect((T.number union T.string) equals T.string-or-number, "N ∪ S").to.be.true
    expect((T.number union T.string-or-number) equals T.string-or-number, "N ∪ (S ∪ N)").to.be.true
    expect((T.number union ~T.string) equals ~T.string, "N ∪ !S").to.be.true
    expect(T.number union ~T.number).to.equal T.any, "N ∪ !N"
    expect(T.number union T.any).to.equal T.any, "N ∪ *"
    expect(T.number union T.none).to.equal T.number, "N ∪ 0"
    expect((T.number union T.number.array()) equals (T.number.array() union T.number), "N ∪ [N]").to.be.true
    expect((T.number union T.number.array()).to-string()).to.equal "([Number]|Number)"
    expect((T.number union T.number.function()) equals (T.number.function() union T.number), "N ∪ -> N").to.be.true
    expect((T.number union T.number.function()).to-string()).to.equal "(-> Number|Number)"
    expect((T.number union T.object) equals (T.object union T.number), "N ∪ {}").to.be.true
    expect((T.number union T.object).to-string()).to.equal "({}|Number)"
    expect((T.number union T.make-object(x: T.number)).to-string()).to.equal "({x: Number}|Number)"
    expect((T.number union T.generic("Thing", T.number)).to-string()).to.equal "(Thing<Number>|Number)"

  it "Union of union", #
    expect(T.string-or-number union T.number).to.equal T.string-or-number, "(S ∪ N) ∪ N"
    expect(T.string-or-number union T.string-or-number).to.equal T.string-or-number, "(S ∪ N) ∪ (S ∪ N)"
    expect((T.string-or-number union (T.number union T.boolean)) equals (T.string union T.number union T.boolean), "(S ∪ N) ∪ (N|B)").to.be.true
    expect((T.string-or-number union (T.boolean union T.string-or-number)) equals (T.string union T.number union T.boolean), "(S ∪ N) ∪ (S|N|B)").to.be.true
    expect(T.string-or-number union T.any).to.equal T.any, "(S ∪ N) ∪ *"
    expect(T.string-or-number union T.none).to.equal T.string-or-number, "(S ∪ N) ∪ 0"
    expect((T.string-or-number union T.number.array()) equals (T.string union T.number union T.number.array()), "(S ∪ N) ∪ [N]").to.be.true
    expect((T.string union T.number union T.number.array()).to-string()).to.equal "([Number]|Number|String)"
    expect((T.string-or-number union T.string-or-number.array()) equals (T.string union T.number union (T.number union T.string).array()), "(S ∪ N) ∪ [(S ∪ N)]").to.be.true
    expect((T.string-or-number union T.string-or-number.array()).to-string()).to.equal "([(Number|String)]|Number|String)"
    expect((T.string-or-number union T.number.function()) equals (T.string union T.number union T.number.function()), "(S ∪ N) ∪ -> N").to.be.true
    expect((T.string union T.number union T.number.function()).to-string()).to.equal "(-> Number|Number|String)"
    expect((T.string-or-number union T.string-or-number.function()) equals (T.string union T.number union (T.number union T.string).function()), "(S ∪ N) ∪ -> (S ∪ N)").to.be.true
    expect((T.string-or-number union T.string-or-number.function()).to-string()).to.equal "(-> (Number|String)|Number|String)"
    expect((T.string-or-number union ~T.boolean) equals ~T.boolean, "(S ∪ N) ∪ !B").to.be.true
    expect(T.string-or-number union ~T.number).to.equal T.any, "(S ∪ N) ∪ !N"
    expect(T.string-or-number union ~T.string).to.equal T.any, "(S ∪ N) ∪ !S"
    expect(T.string-or-number union ~T.string-or-number).to.equal T.any, "(S ∪ N) ∪ !(S ∪ N)"
    expect((T.string-or-number union T.object) equals (T.object union T.number union T.string), "(S ∪ N) ∪ {}").to.be.true
    expect((T.string-or-number union T.object).to-string()).to.equal "({}|Number|String)"
    expect((T.string-or-number union T.make-object(x: T.string-or-number)).to-string()).to.equal "({x: (Number|String)}|Number|String)"
    expect((T.string-or-number union T.generic("Thing", T.string-or-number)).to-string()).to.equal "(Thing<(Number|String)>|Number|String)"

  it "Union of complement", #
    let not-number = ~T.number
    expect(not-number union T.number).to.equal T.any, "!N ∪ N"
    expect(not-number union T.string).to.equal not-number, "!N ∪ S"
    expect(not-number union T.string-or-number).to.equal T.any, "!N ∪ (S ∪ N)"
    expect(not-number union (T.boolean union T.string)).to.equal not-number, "!N ∪ (S|B)"
    expect(not-number union T.any).to.equal T.any, "!N ∪ *"
    expect(not-number union T.none).to.equal not-number, "!N ∪ 0"
    expect(not-number union T.array).to.equal not-number, "!N ∪ [*]"
    expect(not-number union T.number.array()).to.equal not-number, "!N ∪ [N]"
    expect(not-number union not-number.array()).to.equal not-number, "!N ∪ [!N]"
    expect(not-number union ~T.number.array()).to.equal T.any, "!N ∪ ![N]"
    expect(not-number union T.function).to.equal not-number, "!N ∪ -> *"
    expect(not-number union T.number.function()).to.equal not-number, "!N ∪ -> N"
    expect(not-number union not-number.function()).to.equal not-number, "!N ∪ -> !N"
    expect(not-number union ~T.number.function()).to.equal T.any, "!N ∪ !(-> N)"
    expect((not-number union ~T.number) equals not-number, "!N ∪ !N").to.be.true
    expect(not-number union ~T.string).to.equal T.any, "!N ∪ !S"
    expect(not-number union T.object).to.equal not-number, "!N ∪ {}"
    expect(not-number union T.generic("Thing", T.number)).to.equal not-number, "!N ∪ X<N>"

  it "Union of none", #
    expect(T.none union T.number).to.equal T.number, "0 ∪ N"
    expect(T.none union T.string-or-number).to.equal T.string-or-number, "0 ∪ (S ∪ N)"
    expect(T.none union T.any).to.equal T.any, "0 ∪ *"
    expect(T.none union T.none).to.equal T.none, "0 ∪ 0"
    expect(T.none union T.array).to.equal T.array, "0 ∪ [*]"
    expect(T.none union T.number.array()).to.equal T.number.array(), "0 ∪ [N]"
    expect(T.none union T.function).to.equal T.function, "0 ∪ -> *"
    expect(T.none union T.number.function()).to.equal T.number.function(), "0 ∪ -> N"
    let not-number = ~T.number
    expect(T.none union not-number).to.equal not-number, "0 ∪ !N"
    expect(T.none union T.object).to.equal T.object, "0 ∪ {}"
    let my-object = T.make-object(x: T.number)
    expect(T.none union my-object).to.equal my-object, "0 ∪ {x:N}"
    let my-generic = T.generic("Thing", T.number)
    expect(T.none union my-generic).to.equal my-generic, "0 ∪ X<N>"

  it "Union of any", #
    expect(T.any union T.number).to.equal T.any, "* ∪ N"
    expect(T.any union T.string-or-number).to.equal T.any, "* ∪ (S ∪ N)"
    expect(T.any union T.any).to.equal T.any, "* ∪ *"
    expect(T.any union T.none).to.equal T.any, "* ∪ 0"
    expect(T.any union T.array).to.equal T.any, "* ∪ [*]"
    expect(T.any union T.number.array()).to.equal T.any, "* ∪ [N]"
    expect(T.any union T.function).to.equal T.any, "* ∪ -> *"
    expect(T.any union T.number.function()).to.equal T.any, "* ∪ -> N"
    expect(T.any union ~T.number).to.equal T.any, "* ∪ !N"
    expect(T.any union T.object).to.equal T.any, "* ∪ {}"
    expect(T.any union T.make-object(x: T.number)).to.equal T.any, "* ∪ {}"
    expect(T.any union T.generic("Thing", T.number)).to.equal T.any, "* ∪ X<N>"

  it "Union of specialized array", #
    expect((T.number.array() union T.number).to-string()).to.equal "([Number]|Number)", "[N] ∪ N"
    expect((T.number.array() union T.string).to-string()).to.equal "([Number]|String)", "[N] ∪ S"
    expect((T.number.array() union T.string-or-number).to-string()).to.equal "([Number]|Number|String)", "[N] ∪ (S ∪ N)"
    expect((T.number.array() union T.number.function()).to-string()).to.equal "([Number]|-> Number)", "[N] ∪ -> N"
    expect(T.number.array() union T.any).to.equal T.any, "[N] ∪ *"
    expect(T.number.array() union T.none).to.equal T.number.array(), "[N] ∪ 0"
    expect(T.number.array() union T.array).to.equal T.array, "[N] ∪ [*]"
    expect(T.number.array() union T.number.array()).to.equal T.number.array(), "[N] ∪ [N]"
    expect((T.number.array() union T.string.array()).to-string()).to.equal "([Number]|[String])", "[N] ∪ [S]"
    let not-number = ~T.number
    expect(T.number.array() union not-number).to.equal not-number, "[N] ∪ !N"
    expect(T.number.array() union ~T.number.array()).to.equal T.any, "[N] ∪ ![N]"
    expect((T.number.array() union T.object).to-string()).to.equal "([Number]|{})", "[N] ∪ {}"
    expect((T.number.array() union T.make-object(x: T.number)).to-string()).to.equal "([Number]|{x: Number})", "[N] ∪ {x:N}"
    expect((T.number.array() union T.generic("Thing", T.number)).to-string()).to.equal "([Number]|Thing<Number>)", "[N] ∪ X<N>"

  it "Union of array", #
    expect((T.array union T.number).to-string()).to.equal "([]|Number)", "[*] ∪ N"
    expect((T.array union T.string).to-string()).to.equal "([]|String)", "[*] ∪ S"
    expect((T.array union T.string-or-number).to-string()).to.equal "([]|Number|String)", "[*] ∪ (S ∪ N)"
    expect((T.array union T.function).to-string()).to.equal "([]|->)", "[*] ∪ -> *"
    expect(T.array union T.any).to.equal T.any, "[*] ∪ *"
    expect(T.array union T.none).to.equal T.array, "[*] ∪ 0"
    expect(T.array union T.array).to.equal T.array, "[*] ∪ [*]"
    expect(T.array union T.number.array()).to.equal T.array, "[*] ∪ [N]"
    let not-number = ~T.number
    expect(T.array union not-number).to.equal not-number, "[*] ∪ !N"
    expect(T.array union ~T.array).to.equal T.any, "[*] ∪ ![*]"
    expect((T.array union T.object).to-string()).to.equal "([]|{})", "[*] ∪ {}"
    expect((T.array union T.make-object(x: T.number)).to-string()).to.equal "([]|{x: Number})", "[*] ∪ {x:*}"
    expect((T.array union T.generic("Thing", T.number)).to-string()).to.equal "([]|Thing<Number>)", "[*] ∪ X<N>"

  it "Union of specialized function", #
    expect((T.number.function() union T.number).to-string()).to.equal "(-> Number|Number)", "-> N ∪ N"
    expect((T.number.function() union T.string).to-string()).to.equal "(-> Number|String)", "-> N ∪ S"
    expect((T.number.function() union T.string-or-number).to-string()).to.equal "(-> Number|Number|String)", "-> N ∪ (S ∪ N)"
    expect((T.number.function() union T.number.array()).to-string()).to.equal "([Number]|-> Number)", "-> N ∪ [N]"
    expect(T.number.function() union T.any).to.equal T.any, "-> N ∪ *"
    expect(T.number.function() union T.none).to.equal T.number.function(), "-> N ∪ 0"
    expect(T.number.function() union T.function).to.equal T.function, "-> N ∪ -> *"
    expect(T.number.function() union T.number.function()).to.equal T.number.function(), "-> N ∪ -> N"
    expect((T.number.function() union T.string.function()).to-string()).to.equal "(-> Number|-> String)", "-> N ∪ -> S"
    let not-number = ~T.number
    expect(T.number.function() union not-number).to.equal not-number, "-> N ∪ !N"
    expect(T.number.function() union ~T.number.function()).to.equal T.any, "-> N ∪ !(-> N)"
    expect((T.number.function() union T.object).to-string()).to.equal "(-> Number|{})", "-> N ∪ {}"
    expect((T.number.function() union T.make-object(x: T.number)).to-string()).to.equal "(-> Number|{x: Number})", "-> N ∪ {x:N}"
    expect((T.number.function() union T.generic("Thing", T.number)).to-string()).to.equal "(-> Number|Thing<Number>)", "-> N ∪ X<N>"

  it "Union of function", #
    expect((T.function union T.number).to-string()).to.equal "(->|Number)", "-> * ∪ N"
    expect((T.function union T.string).to-string()).to.equal "(->|String)", "-> * ∪ S"
    expect((T.function union T.string-or-number).to-string()).to.equal "(->|Number|String)", "-> * ∪ (S ∪ N)"
    expect((T.function union T.array).to-string()).to.equal "([]|->)", "-> * ∪ [*]"
    expect(T.function union T.any).to.equal T.any, "-> * ∪ *"
    expect(T.function union T.none).to.equal T.function, "-> * ∪ 0"
    expect(T.function union T.function).to.equal T.function, "-> * ∪ -> *"
    expect(T.function union T.number.function()).to.equal T.function, "-> * ∪ -> N"
    let not-number = ~T.number
    expect(T.function union not-number).to.equal not-number, "-> * ∪ !N"
    expect(T.function union ~T.function).to.equal T.any, "-> * ∪ !(-> *)"
    expect((T.function union T.object).to-string()).to.equal "(->|{})", "-> * ∪ {}"
    expect((T.function union T.make-object(x: T.number)).to-string()).to.equal "(->|{x: Number})", "-> * ∪ {x:N}"
    expect((T.function union T.generic("Thing", T.number)).to-string()).to.equal "(->|Thing<Number>)", "-> * ∪ X<N>"

  it "Union of specialized object", #
    let my-object = T.make-object(x: T.number)
    expect((my-object union T.number).to-string()).to.equal "({x: Number}|Number)", "{x:N} ∪ N"
    expect((my-object union T.string).to-string()).to.equal "({x: Number}|String)", "{x:N} ∪ S"
    expect((my-object union T.string-or-number).to-string()).to.equal "({x: Number}|Number|String)", "{x:N} ∪ (S ∪ N)"
    expect((my-object union T.number.array()).to-string()).to.equal "([Number]|{x: Number})", "{x:N} ∪ [N]"
    expect((my-object union T.number.function()).to-string()).to.equal "(-> Number|{x: Number})", "{x:N} ∪ -> N"
    expect(my-object union T.any).to.equal T.any, "{x:N} ∪ *"
    expect(my-object union T.none).to.equal my-object, "{x:N} ∪ 0"
    let not-number = ~T.number
    expect(my-object union not-number).to.equal not-number, "{x:N} ∪ !N"
    expect(my-object union ~my-object).to.equal T.any, "{x:N} ∪ !{x:N}"
    expect((my-object union T.object)).to.equal T.object, "{x:N} ∪ {}"
    expect((my-object union T.make-object(x: T.number))).to.equal my-object, "{x:N} ∪ {x:N}"
    expect((my-object union T.make-object(x: T.string)).to-string()).to.equal "({x: Number}|{x: String})", "{x:N} ∪ {x:S}"
    expect(my-object union T.make-object(x: T.number, y: T.string)).to.equal my-object, "{x:N} ∪ {x:N, y:S}"
    expect(T.make-object(x: T.number, y: T.string) union my-object).to.equal my-object, "{x:N, y:S} ∪ {x:N}"
    expect(my-object union T.make-object(x: T.string) union T.object).to.equal T.object, "{x:N} ∪ {x:S} ∪ {}"
    expect(T.make-object(x: T.number, y: T.string) union T.make-object(x: T.number, z: T.boolean) union my-object).to.equal my-object, "{x:N, x:S} ∪ {x:N, z:B} ∪ {x:N}"
    expect((my-object union T.generic("Thing", T.number)).to-string()).to.equal "(Thing<Number>|{x: Number})", "{x:N} ∪ X<N>"

  it "Union of object", #
    expect((T.object union T.number).to-string()).to.equal "({}|Number)", "{} ∪ N"
    expect((T.object union T.string).to-string()).to.equal "({}|String)", "{} ∪ S"
    expect((T.object union T.string-or-number).to-string()).to.equal "({}|Number|String)", "{} ∪ (S ∪ N)"
    expect((T.object union T.array).to-string()).to.equal "([]|{})", "{} ∪ [*]"
    expect((T.object union T.function).to-string()).to.equal "(->|{})", "{} ∪ ->"
    expect(T.object union T.any).to.equal T.any, "{} ∪ *"
    expect(T.object union T.none).to.equal T.object, "{} ∪ 0"
    let not-number = ~T.number
    expect(T.object union not-number).to.equal not-number, "{} ∪ !N"
    expect(T.object union ~T.object).to.equal T.any, "{} ∪ !{}"
    expect(T.object union T.object).to.equal T.object, "{} ∪ {}"
    expect(T.object union T.make-object(x: T.number)).to.equal T.object, "{} ∪ {x:N}"
    expect((T.object union T.generic("Thing", T.number)).to-string()).to.equal "(Thing<Number>|{})", "{} ∪ X<N>"

  it "Union of generic", #
    let my-generic = T.generic("Thing", T.number)
    expect((my-generic union T.number).to-string()).to.equal "(Thing<Number>|Number)", "X<N> ∪ N"
    expect((my-generic union T.string).to-string()).to.equal "(Thing<Number>|String)", "X<N> ∪ S"
    expect((my-generic union T.string-or-number).to-string()).to.equal "(Thing<Number>|Number|String)", "X<N> ∪ (S ∪ N)"
    expect((my-generic union T.number.array()).to-string()).to.equal "([Number]|Thing<Number>)", "X<N> ∪ [N]"
    expect((my-generic union T.number.function()).to-string()).to.equal "(-> Number|Thing<Number>)", "X<N> ∪ -> N"
    expect(my-generic union T.any).to.equal T.any, "X<N> ∪ *"
    expect(my-generic union T.none).to.equal my-generic, "X<N> ∪ 0"
    let not-number = ~T.number
    expect(my-generic union not-number).to.equal not-number, "X<N> ∪ !N"
    expect(my-generic union ~my-generic).to.equal T.any, "X<N> ∪ !X<N>"
    expect((my-generic union T.object).to-string()).to.equal "(Thing<Number>|{})", "X<N> ∪ {}"
    expect((my-generic union T.make-object(x: T.number)).to-string()).to.equal "(Thing<Number>|{x: Number})", "X<N> ∪ {x:N}"
    expect((my-generic union T.generic("Other", T.number)).to-string()).to.equal "(Other<Number>|Thing<Number>)", "X<N> ∪ Y<N>"
    expect((my-generic union T.generic("Thing", T.number)).to-string()).to.equal "(Thing<Number>|Thing<Number>)", "X<N> ∪ Z<N>"
    expect(my-generic union T.generic(my-generic.base, T.number)).to.equal my-generic, "X<N> ∪ X<N>"
    expect((my-generic union T.generic(my-generic.base, T.string)).to-string()).to.equal "(Thing<Number>|Thing<String>)", "X<N> ∪ X<S>"

  it "Intersection of simple", #
    expect(T.number intersect T.number).to.equal T.number, "N ∩ N"
    expect(T.number intersect T.string).to.equal T.none, "N ∩ S"
    expect(T.number intersect T.string-or-number).to.equal T.number, "N ∩ (S ∪ N)"
    expect(T.number intersect ~T.string).to.equal T.number, "N ∩ !S"
    expect(T.number intersect ~T.number).to.equal T.none, "N ∩ !N"
    expect(T.number intersect T.any).to.equal T.number, "N ∩ *"
    expect(T.number intersect T.none).to.equal T.none, "N ∩ 0"
    expect(T.number intersect T.number.array()).to.equal T.none, "N ∩ [N]"
    expect(T.number intersect T.number.function()).to.equal T.none, "N ∩ -> N"
    expect(T.number intersect T.object).to.equal T.none, "N ∩ {}"
    expect(T.number intersect T.make-object(x: T.number)).to.equal T.none, "N ∩ {x:N}"
    expect(T.number intersect T.generic("Thing", T.number)).to.equal T.none, "N ∩ X<N>"

  it "Intersection of union", #
    expect(T.string-or-number intersect T.number).to.equal T.number, "(S ∪ N) ∩ N"
    expect(T.string-or-number intersect T.string-or-number).to.equal T.string-or-number, "(S ∪ N) ∩ (S ∪ N)"
    expect(T.string-or-number intersect (T.number union T.boolean)).to.equal T.number, "(S ∪ N) ∩ (N|B)"
    expect(T.string-or-number intersect (T.boolean union T.string-or-number)).to.equal T.string-or-number, "(S ∪ N) ∩ (S|N|B)"
    expect(T.string-or-number intersect T.any).to.equal T.string-or-number, "(S ∪ N) ∩ *"
    expect(T.string-or-number intersect T.none).to.equal T.none, "(S ∪ N) ∩ 0"
    expect(T.string-or-number intersect T.number.array()).to.equal T.none, "(S ∪ N) ∩ [N]"
    expect(T.string-or-number intersect T.string-or-number.array()).to.equal T.none, "(S ∪ N) ∩ [(S ∪ N)]"
    expect(T.string-or-number intersect T.number.function()).to.equal T.none, "(S ∪ N) ∩ -> N"
    expect(T.string-or-number intersect T.string-or-number.function()).to.equal T.none, "(S ∪ N) ∩ -> (S ∪ N)"
    expect(T.string-or-number intersect ~T.boolean).to.equal T.string-or-number, "(S ∪ N) ∩ !B"
    expect(T.string-or-number intersect ~T.number).to.equal T.string, "(S ∪ N) ∩ !N"
    expect(T.string-or-number intersect ~T.string).to.equal T.number, "(S ∪ N) ∩ !S"
    expect(T.string-or-number intersect ~T.string-or-number).to.equal T.none, "(S ∪ N) ∩ !(S ∪ N)"
    expect(T.string-or-number intersect T.object).to.equal T.none, "(S ∪ N) ∩ {}"
    expect(T.string-or-number intersect T.make-object(x: T.string-or-number)).to.equal T.none, "(S ∪ N) ∩ {x:(S ∪ N)}"
    expect(T.string-or-number intersect T.generic("Thing", T.number)).to.equal T.none, "(S ∪ N) ∩ X<N>"

  it "Intersection of complement", #
    let not-number = ~T.number
    expect(not-number intersect T.number).to.equal T.none, "!N ∩ N"
    expect(not-number intersect T.string).to.equal T.string, "!N ∩ S"
    expect(not-number intersect T.string-or-number).to.equal T.string, "!N ∩ (S ∪ N)"
    let boolean-or-string = T.boolean union T.string
    expect(not-number intersect boolean-or-string).to.equal boolean-or-string, "!N ∩ (S|B)"
    expect(not-number intersect T.any).to.equal not-number, "!N ∩ *"
    expect(not-number intersect T.none).to.equal T.none, "!N ∩ 0"
    expect(not-number intersect T.array).to.equal T.array, "!N ∩ [*]"
    expect(not-number intersect T.number.array()).to.equal T.number.array(), "!N ∩ [N]"
    expect((not-number intersect not-number.array()) equals not-number.array(), "!N ∩ [!N]").to.be.true
    expect((not-number intersect ~T.number.array()) equals ~(T.number union T.number.array()), "!N ∩ ![N]").to.be.true
    expect(not-number intersect T.function).to.equal T.function, "!N ∩ -> *"
    expect(not-number intersect T.number.function()).to.equal T.number.function(), "!N ∩ -> N"
    expect((not-number intersect not-number.function()) equals not-number.function(), "!N ∩ -> !N").to.be.true
    expect((not-number intersect ~T.number.function()) equals ~(T.number union T.number.function()), "!N ∩ !(-> N)").to.be.true
    expect((not-number intersect ~T.number) equals not-number, "!N ∩ !N").to.be.true
    expect((not-number intersect ~T.string) equals ~T.string-or-number, "!N ∩ !S").to.be.true
    expect((not-number intersect T.object)).to.equal T.object, "!N ∩ {}"
    let my-object = T.make-object(x: not-number)
    expect(not-number intersect my-object).to.equal my-object, "!N ∩ {x:!N}"
    let my-generic = T.generic("Thing", not-number)
    expect(not-number intersect my-generic).to.equal my-generic, "!N ∩ X<!N>"

  it "Intersection of none", #
    expect(T.none intersect T.number).to.equal T.none, "0 ∩ N"
    expect(T.none intersect T.string-or-number).to.equal T.none, "0 ∩ (S ∪ N)"
    expect(T.none intersect T.any).to.equal T.none, "0 ∩ *"
    expect(T.none intersect T.none).to.equal T.none, "0 ∩ 0"
    expect(T.none intersect T.array).to.equal T.none, "0 ∩ [*]"
    expect(T.none intersect T.number.array()).to.equal T.none, "0 ∩ [N]"
    expect(T.none intersect T.function).to.equal T.none, "0 ∩ -> *"
    expect(T.none intersect T.function.array()).to.equal T.none, "0 ∩ -> N"
    expect(T.none intersect ~T.number).to.equal T.none, "0 ∩ !N"
    expect(T.none intersect T.object).to.equal T.none, "0 ∩ {}"
    expect(T.none intersect T.make-object(x: T.number)).to.equal T.none, "0 ∩ {x:N}"
    expect(T.none intersect T.generic("Thing", T.number)).to.equal T.none, "0 ∩ X<N>"

  it "Intersection of any", #
    expect(T.any intersect T.number).to.equal T.number, "* ∩ N"
    expect(T.any intersect T.string-or-number).to.equal T.string-or-number, "* ∩ (S ∪ N)"
    expect(T.any intersect T.any).to.equal T.any, "* ∩ *"
    expect(T.any intersect T.none).to.equal T.none, "* ∩ 0"
    expect(T.any intersect T.array).to.equal T.array, "* ∩ [*]"
    expect(T.any intersect T.number.array()).to.equal T.number.array(), "* ∩ [N]"
    expect(T.any intersect T.function).to.equal T.function, "* ∩ -> *"
    expect(T.any intersect T.number.function()).to.equal T.number.function(), "* ∩ -> N"
    let not-number = ~T.number
    expect(T.any intersect not-number).to.equal not-number, "* ∩ !N"
    expect(T.any intersect T.object).to.equal T.object, "* ∩ {}"
    let my-object = T.make-object(x: T.number)
    expect(T.any intersect my-object).to.equal my-object, "* ∩ {x:N}"
    let my-generic = T.generic("Thing", T.number)
    expect(T.any intersect my-generic).to.equal my-generic, "* ∩ X<N>"

  it "Intersection of specialized array", #
    expect(T.number.array() intersect T.number).to.equal T.none, "[N] ∩ N"
    expect(T.number.array() intersect T.string).to.equal T.none, "[N] ∩ S"
    expect(T.number.array() intersect T.string-or-number).to.equal T.none, "[N] ∩ (S ∪ N)"
    expect(T.number.array() intersect T.any).to.equal T.number.array(), "[N] ∩ *"
    expect(T.number.array() intersect T.none).to.equal T.none, "[N] ∩ 0"
    expect(T.number.array() intersect T.array).to.equal T.number.array(), "[N] ∩ [*]"
    expect(T.number.array() intersect T.number.array()).to.equal T.number.array(), "[N] ∩ [N]"
    expect((T.number.array() intersect T.string.array())).to.equal T.none.array(), "[N] ∩ [S]"
    expect(T.number.array() intersect ~T.number).to.equal T.number.array(), "[N] ∩ !N"
    expect(T.number.array() intersect ~T.number.array()).to.equal T.none, "[N] ∩ ![N]"
    expect(T.number.array() intersect T.function).to.equal T.none, "[N] ∩ -> *"
    expect(T.number.array() intersect T.number.function()).to.equal T.none, "[N] ∩ -> N"
    expect(T.number.array() intersect T.object).to.equal T.none, "[N] ∩ {}"
    expect(T.number.array() intersect T.make-object(x: T.number)).to.equal T.none, "[N] ∩ {x:N}"
    expect(T.number.array() intersect T.generic("Thing", T.number)).to.equal T.none, "[N] ∩ X<N>"

  it "Intersection of array", #
    expect(T.array intersect T.number).to.equal T.none, "[*] ∩ N"
    expect(T.array intersect T.string).to.equal T.none, "[*] ∩ S"
    expect(T.array intersect T.string-or-number).to.equal T.none, "[*] ∩ (S ∪ N)"
    expect(T.array intersect T.any).to.equal T.array, "[*] ∩ *"
    expect(T.array intersect T.none).to.equal T.none, "[*] ∩ 0"
    expect(T.array intersect T.array).to.equal T.array, "[*] ∩ [*]"
    expect(T.array intersect T.number.array()).to.equal T.number.array(), "[*] ∩ [N]"
    expect(T.array intersect ~T.number).to.equal T.array, "[*] ∩ !N"
    expect(T.array intersect ~T.array).to.equal T.none, "[*] ∩ ![*]"
    expect(T.array intersect T.function).to.equal T.none, "[*] ∩ -> *"
    expect(T.array intersect T.number.function()).to.equal T.none, "[*] ∩ -> N"
    expect(T.array intersect T.object).to.equal T.none, "[*] ∩ {}"
    expect(T.array intersect T.make-object(x: T.number)).to.equal T.none, "[*] ∩ {x:N}"
    expect(T.array intersect T.generic("Thing", T.any)).to.equal T.none, "[*] ∩ X<*>"

  it "Intersection of specialized function", #
    expect(T.number.function() intersect T.number).to.equal T.none, "-> N ∩ N"
    expect(T.number.function() intersect T.string).to.equal T.none, "-> N ∩ S"
    expect(T.number.function() intersect T.string-or-number).to.equal T.none, "-> N ∩ (S ∪ N)"
    expect(T.number.function() intersect T.any).to.equal T.number.function(), "-> N ∩ *"
    expect(T.number.function() intersect T.none).to.equal T.none, "-> N ∩ 0"
    expect(T.number.function() intersect T.function).to.equal T.number.function(), "-> N ∩ -> *"
    expect(T.number.function() intersect T.number.function()).to.equal T.number.function(), "-> N ∩ -> N"
    expect((T.number.function() intersect T.string.function())).to.equal T.none.function(), "-> N ∩ -> S"
    expect(T.number.function() intersect ~T.number).to.equal T.number.function(), "-> N ∩ !N"
    expect(T.number.function() intersect ~T.number.function()).to.equal T.none, "-> N ∩ !(-> N)"
    expect(T.number.function() intersect T.array).to.equal T.none, "-> N ∩ [*]"
    expect(T.number.function() intersect T.number.array()).to.equal T.none, "-> N ∩ [N]"
    expect(T.number.function() intersect T.object).to.equal T.none, "-> N ∩ {}"
    expect(T.number.function() intersect T.make-object(x: T.number)).to.equal T.none, "-> N ∩ {x:N}"
    expect(T.number.function() intersect T.generic("Thing", T.number)).to.equal T.none, "-> N ∩ X<N>"

  it "Intersection of function", #
    expect(T.function intersect T.number).to.equal T.none, "-> * ∩ N"
    expect(T.function intersect T.string).to.equal T.none, "-> * ∩ S"
    expect(T.function intersect T.string-or-number).to.equal T.none, "-> * ∩ (S ∪ N)"
    expect(T.function intersect T.any).to.equal T.function, "-> * ∩ *"
    expect(T.function intersect T.none).to.equal T.none, "-> * ∩ 0"
    expect(T.function intersect T.function).to.equal T.function, "-> * ∩ -> *"
    expect(T.function intersect T.number.function()).to.equal T.number.function(), "-> * ∩ -> N"
    expect(T.function intersect ~T.number).to.equal T.function, "-> * ∩ !N"
    expect(T.function intersect ~T.function).to.equal T.none, "-> * ∩ !(-> *)"
    expect(T.function intersect T.array).to.equal T.none, "-> * ∩ [*]"
    expect(T.function intersect T.number.array()).to.equal T.none, "-> * ∩ [N]"
    expect(T.function intersect T.object).to.equal T.none, "-> * ∩ {}"
    expect(T.function intersect T.make-object(x: T.number)).to.equal T.none, "-> * ∩ {x:N}"
    expect(T.function intersect T.generic("Thing", T.number)).to.equal T.none, "-> * ∩ X<N>"

  it "Intersection of specialized object", #
    let my-object = T.make-object(x: T.number)
    expect(my-object intersect T.number).to.equal T.none, "{x:N} ∩ N"
    expect(my-object intersect T.string).to.equal T.none, "{x:N} ∩ S"
    expect(my-object intersect T.string-or-number).to.equal T.none, "{x:N} ∩ (S ∪ N)"
    expect(my-object intersect T.any).to.equal my-object, "{x:N} ∩ *"
    expect(my-object intersect T.none).to.equal T.none, "{x:N} ∩ 0"
    expect(my-object intersect T.function).to.equal T.none, "{x:N} ∩ -> *"
    expect(my-object intersect T.number.function()).to.equal T.none, "{x:N} ∩ -> N"
    expect(my-object intersect ~T.number).to.equal my-object, "{x:N} ∩ !N"
    expect(my-object intersect ~my-object).to.equal T.none, "{x:N} ∩ !{x:N}"
    expect(my-object intersect T.array).to.equal T.none, "{x:N} ∩ [*]"
    expect(my-object intersect T.number.array()).to.equal T.none, "{x:N} ∩ [N]"
    expect(my-object intersect T.object).to.equal my-object, "{x:N} ∩ {}"
    expect(my-object intersect T.make-object(x: T.number)).to.equal my-object, "{x:N} ∩ {x:N}"
    let other-object = T.make-object(x: T.number, y: T.string)
    expect(my-object intersect other-object).to.equal other-object, "{x:N} ∩ {x:N, y:S}"
    let bad-object = T.make-object(x: T.string)
    expect((my-object intersect bad-object) equals T.make-object(x: T.none), "{x:N} ∩ {x:S}").to.be.true
    expect(my-object intersect T.generic("Thing", T.number)).to.equal T.none, "{x:N} ∩ X<N>"

  it "Intersection of object", #
    expect(T.object intersect T.number).to.equal T.none, "{} ∩ N"
    expect(T.object intersect T.string).to.equal T.none, "{} ∩ S"
    expect(T.object intersect T.string-or-number).to.equal T.none, "{} ∩ (S ∪ N)"
    expect(T.object intersect T.any).to.equal T.object, "{} ∩ *"
    expect(T.object intersect T.none).to.equal T.none, "{} ∩ 0"
    expect(T.object intersect T.function).to.equal T.none, "{} ∩ -> *"
    expect(T.object intersect T.number.function()).to.equal T.none, "{} ∩ -> N"
    expect(T.object intersect ~T.number).to.equal T.object, "{} ∩ !N"
    expect(T.object intersect ~T.object).to.equal T.none, "{} ∩ !{}"
    expect(T.object intersect T.array).to.equal T.none, "{} ∩ [*]"
    expect(T.object intersect T.number.array()).to.equal T.none, "{} ∩ [N]"
    expect(T.object intersect T.object).to.equal T.object, "{} ∩ {}"
    let my-object = T.make-object(x: T.number)
    expect(T.object intersect my-object).to.equal my-object, "{} ∩ {x:N}"
    expect(T.object intersect T.generic("Thing", T.number)).to.equal T.none, "{} ∩ X<N>"

  it "Intersection of generic", #
    let my-generic = T.generic("Thing", T.number)
    expect(my-generic intersect T.number).to.equal T.none, "X<N> ∩ N"
    expect(my-generic intersect T.string).to.equal T.none, "X<N> ∩ S"
    expect(my-generic intersect T.string-or-number).to.equal T.none, "X<N> ∩ (S ∪ N)"
    expect(my-generic intersect T.any).to.equal my-generic, "X<N> ∩ *"
    expect(my-generic intersect T.none).to.equal T.none, "X<N> ∩ 0"
    expect(my-generic intersect T.function).to.equal T.none, "X<N> ∩ -> *"
    expect(my-generic intersect T.number.function()).to.equal T.none, "X<N> ∩ -> N"
    expect(my-generic intersect ~T.number).to.equal my-generic, "X<N> ∩ !N"
    expect(my-generic intersect ~my-generic).to.equal T.none, "X<N> ∩ !X<N>"
    expect(my-generic intersect T.array).to.equal T.none, "X<N> ∩ [*]"
    expect(my-generic intersect T.number.array()).to.equal T.none, "X<N> ∩ [N]"
    expect(my-generic intersect T.object).to.equal T.none, "X<N> ∩ {}"
    expect(my-generic intersect T.make-object(x: T.number)).to.equal T.none, "X<N> ∩ {x:N}"
    expect(my-generic intersect T.generic(my-generic.base, T.string-or-number)).to.equal my-generic, "X<N> ∩ X<(S ∪ N)>"
    expect(T.generic(my-generic.base, T.string-or-number) intersect my-generic).to.equal my-generic, "X<(S ∪ N)> ∩ X<N>"
    expect((my-generic intersect T.generic(my-generic.base, T.string)) equals T.generic(my-generic.base, T.none), "X<N> ∩ X<S>").to.be.true
    expect(my-generic intersect T.generic("Other", T.number)).to.equal T.none, "X<N> ∩ Y<N>"
    expect(my-generic intersect T.generic("Thing", T.number)).to.equal T.none, "X<N> ∩ Z<N>"

  it "Arrays", #
    expect(T.array.to-string()).to.equal "[]"
    expect(T.boolean.array().to-string()).to.equal "[Boolean]"
    expect(T.string.array().to-string()).to.equal "[String]"
    expect(T.string.array().array().to-string()).to.equal "[[String]]"
    expect(T.boolean.array() equals T.boolean.array()).to.be.true
    expect(T.string.array() equals T.string.array()).to.be.true
    expect(T.boolean.array() equals T.string.array()).to.be.false
    expect(T.array overlaps T.boolean.array()).to.be.true
    expect(T.boolean.array() overlaps T.array).to.be.true
    expect(T.boolean.array() subset T.array).to.be.true
    expect(T.array subset T.boolean.array()).to.be.false
    expect(T.boolean.array() union T.array).to.equal T.array

    expect(T.array equals T.any.array()).to.be.true

  it "Functions", #
    expect(T.function.to-string()).to.equal "->"
    expect(T.boolean.function().to-string()).to.equal "-> Boolean"
    expect(T.string.function().to-string()).to.equal "-> String"
    expect(T.string.function().function().to-string()).to.equal "-> -> String"
    expect(T.string.array().function().to-string()).to.equal "-> [String]"
    expect(T.string.function().array().to-string()).to.equal "[-> String]"
    expect(T.boolean.function() equals T.boolean.function()).to.be.true
    expect(T.string.function() equals T.string.function()).to.be.true
    expect(T.boolean.function() equals T.string.function()).to.be.false
    expect(T.function overlaps T.boolean.function()).to.be.true
    expect(T.boolean.function() overlaps T.function).to.be.true
    expect(T.boolean.function() subset T.function).to.be.true
    expect(T.function subset T.boolean.function()).to.be.false
    expect(T.boolean.function() union T.function).to.equal T.function

    expect(T.function equals T.any.function()).to.be.true

  it "Objects", #
    expect(T.object.to-string()).to.equal "{}"
    expect(T.make-object(x: T.any)).to.equal T.object
    expect(T.make-object(x: T.number).to-string()).to.equal "{x: Number}"
    expect(T.make-object(x: T.number, y: T.string).to-string()).to.equal "{x: Number, y: String}"
    expect(T.make-object(y: T.string, x: T.number).to-string()).to.equal "{x: Number, y: String}"
    expect(T.make-object(x: T.number, y: T.string) equals T.make-object(y: T.string, x: T.number)).to.be.true
    expect(T.make-object(x: T.number) subset T.object).to.be.true
    expect(T.object subset T.make-object(x: T.number)).to.be.false
    expect(T.make-object(x: T.number) subset T.make-object(x: T.number)).to.be.true
    expect(T.make-object(x: T.number) subset T.make-object(x: T.string)).to.be.false
    expect(T.make-object(x: T.number) subset T.make-object(x: T.string-or-number)).to.be.true
    expect((T.make-object(x: T.number) intersect T.make-object(y: T.string)) equals T.make-object(x: T.number, y: T.string)).to.be.true

    expect(T.object.value(\x)).to.equal T.any
    expect(T.make-object(x: T.number).value(\x)).to.equal T.number
    expect(T.make-object(x: T.number).value(\y)).to.equal T.any
    expect(T.make-object(x: T.number).value(\w)).to.equal T.any
    expect(T.make-object(x: T.number, y: T.string).value(\x)).to.equal T.number
    expect(T.make-object(x: T.number, y: T.string).value(\y)).to.equal T.string
    expect(T.make-object(x: T.number, y: T.string).value(\z)).to.equal T.any
    expect(T.make-object(x: T.number, y: T.string).value(\w)).to.equal T.any

  it "Making types", #
    let alpha = T.make("Alpha")
    let bravo = T.make("Bravo")
    expect(alpha.to-string()).to.equal "Alpha"
    expect(bravo.to-string()).to.equal "Bravo"
    expect((alpha union bravo).to-string()).to.equal "(Alpha|Bravo)"
    expect((bravo union alpha).to-string()).to.equal "(Alpha|Bravo)"
    expect((alpha union bravo) equals (bravo union alpha)).to.be.true
    expect(alpha.array().to-string()).to.equal "[Alpha]"
    expect(bravo.array().to-string()).to.equal "[Bravo]"
    expect(alpha.function().to-string()).to.equal "-> Alpha"
    expect(bravo.function().to-string()).to.equal "-> Bravo"
    expect((alpha union bravo).array().to-string()).to.equal "[(Alpha|Bravo)]"
    expect((alpha union bravo).function().to-string()).to.equal "-> (Alpha|Bravo)"
    expect((alpha union bravo).array() equals (bravo union alpha).array()).to.be.true
    expect((alpha.array() union bravo.array()).to-string()).to.equal "([Alpha]|[Bravo])"
    expect((alpha.function() union bravo.function()).to-string()).to.equal "(-> Alpha|-> Bravo)"
    expect((alpha.array() union bravo.array()) equals (bravo.array() union alpha.array())).to.be.true
    expect((alpha.function() union bravo.function()) equals (bravo.function() union alpha.function())).to.be.true
    expect((alpha union bravo).array() equals (alpha.array() union bravo.array())).to.be.false
    expect((alpha union bravo).function() equals (alpha.function() union bravo.function())).to.be.false
    expect(T.make-object(x: alpha).to-string()).to.equal "{x: Alpha}"
    expect(T.make-object(x: alpha) equals T.make-object(x: alpha)).to.be.true

    expect(T.make("Alpha") equals alpha).to.be.false // could be from different scopes
    expect(T.make("Alpha").compare(alpha)).to.not.equal 0 // since not equal, should not compare to 0

  it "Serialization", #
    let handle(x) -> T.from-JSON(JSON.parse(JSON.stringify(x)))
    expect(handle(T.undefined)).to.equal T.undefined
    expect(handle(T.null)).to.equal T.null
    expect(handle(T.string)).to.equal T.string
    expect(handle(T.number)).to.equal T.number
    expect(handle(T.boolean)).to.equal T.boolean
    expect(handle(T.function)).to.equal T.function
    expect(handle(T.object)).to.equal T.object
    expect(handle(T.array)).to.equal T.array
    expect(handle(T.args)).to.equal T.args
    expect(handle(T.any)).to.equal T.any
    expect(handle(T.none)).to.equal T.none
    expect(handle(T.regexp)).to.equal T.regexp
    expect(T.string-or-number equals handle(T.string-or-number)).to.be.true
    expect(handle(T.number.array())).to.equal T.number.array()
    expect(handle(T.number.function())).to.equal T.number.function()
    expect(~T.string-or-number equals handle(~T.string-or-number)).to.be.true
    expect(~T.number equals handle(~T.number)).to.be.true
    expect(T.make-object(x: T.number) equals handle(T.make-object(x: T.number))).to.be.true
    expect(T.generic(T.string, T.number) equals handle(T.generic(T.string, T.number))).to.be.true
  
  it "Return type", #
    expect(T.none.return-type()).to.equal T.none
    expect(T.any.return-type()).to.equal T.any
    expect(T.string.return-type()).to.equal T.none
    expect(T.array.return-type()).to.equal T.none
    expect(T.string.array().return-type()).to.equal T.none
    expect(T.function.return-type()).to.equal T.any
    expect(T.string.function().return-type()).to.equal T.string
    expect(T.string.function().union(T.number).return-type()).to.equal T.string
    expect(T.string.function().union(T.number.function()).return-type() equals T.string.union(T.number)).to.be.true
    expect(T.string-or-number.function().return-type()).to.equal T.string-or-number
    expect(~T.string.return-type()).to.equal T.any
    expect(~T.string-or-number.return-type()).to.equal T.any
    expect(T.make-object(x: T.number).return-type()).to.equal T.none
    expect(T.generic(T.string, T.number).return-type()).to.equal T.none
