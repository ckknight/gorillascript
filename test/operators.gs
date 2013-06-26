let {expect} = require 'chai'
let {stub} = require 'sinon'
let gorilla = require '../index'

let fail()
  throw Error()
let run-once(value)
  let f = #
    if f.ran
      throw Error "Already ran function"
    f.ran := true
    value
  f

describe "Simple operators", #
  it "should perform the operation", #
    expect(1 + 2).to.equal 3
    expect(10 - 5).to.equal 5
    expect(5 - 10).to.equal -5
    expect(2 * 3).to.equal 6
    expect(9 / 2).to.equal 4.5
    expect(9 % 2).to.equal 1

  it "Simple operator assignment", #
    let mutable x = 1
    x += 2
    expect(x).to.equal 3
    x -= 5
    expect(x).to.equal -2
    x *= 2
    expect(x).to.equal -4
    x /= -0.5
    expect(x).to.equal 8
    x %= 3
    expect(x).to.equal 2
    x += 1
    expect(x).to.equal 3
    x -= 1
    expect(x).to.equal 2
    expect(post-inc! x).to.equal 2
    expect(x).to.equal 3
    expect(post-dec! x).to.equal 3
    expect(x).to.equal 2

  it "Addition",#
    expect(2 + 3).to.equal 5
    expect(2 + 3 + 5).to.equal 10
    expect(2 + (3 + 5)).to.equal 10
    expect((2 + 3) + 5).to.equal 10
    let add(a, b) -> a() + b()
    expect(add(run-once(1), run-once(2))).to.equal 3
    expect(#-> add(run-once("1"), run-once("2"))).throws TypeError
    expect(#-> add(run-once(1), run-once("2"))).throws TypeError
    expect(#-> add(run-once("1"), run-once(2))).throws TypeError
    let add-assign(mutable a, b) -> a += b()
    expect(add-assign(1, run-once(2))).to.equal 3
    expect(#-> add-assign("1", run-once("2"))).throws TypeError
    expect(#-> add-assign(1, run-once("2"))).throws TypeError
    expect(#-> add-assign("1", run-once(2))).throws TypeError
    let add-member-assign(a, b, c) -> a[b()] += c()
    expect(add-member-assign({key: 1}, run-once("key"), run-once 2)).to.equal 3
    expect(#-> add-member-assign({key: "1"}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> add-member-assign({key: 1}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> add-member-assign({key: "1"}, run-once("key"), run-once 2)).throws TypeError

  it "Subtraction", #
    let two = 2
    let three = 3
    let five = 5
    expect(five - three).to.equal 2
    expect(three - five).to.equal -2
    expect(five - three - two).to.equal 0
    expect((five - three) - two).to.equal 0
    expect(five - (three - two)).to.equal 4
    let sub(a, b) -> a() - b()
    expect(sub(run-once(3), run-once 2)).to.equal 1
    expect(#-> sub(run-once("3"), run-once "2")).throws TypeError
    expect(#-> sub(run-once(3), run-once "2")).throws TypeError
    expect(#-> sub(run-once("3"), run-once 2)).throws TypeError
    let sub-assign(mutable a, b) -> a -= b()
    expect(sub-assign(3, run-once 2)).to.equal 1
    expect(#-> sub-assign("3", run-once "2")).throws TypeError
    expect(#-> sub-assign(3, run-once "2")).throws TypeError
    expect(#-> sub-assign("3", run-once 2)).throws TypeError
    let sub-member-assign(a, b, c) -> a[b()] -= c()
    expect(sub-member-assign({key: 3}, run-once("key"), run-once 2)).to.equal 1
    expect(#-> sub-member-assign({key: "3"}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> sub-member-assign({key: 3}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> sub-member-assign({key: "3"}, run-once("key"), run-once 2)).throws TypeError

  it "Addition and Subtraction", #
    let two = 2
    let three = 3
    let five = 5
    expect(two + three - five).to.equal 0
    expect((two + three) - five).to.equal 0
    expect(two + (three - five)).to.equal 0
    expect(two - three + five).to.equal 4
    expect((two - three) + five).to.equal 4
    expect(two - (three + five)).to.equal -6

  it "Subtraction versus negation", #
    let a = 1
    let b = 2
    expect(a - b).to.equal -1
    expect(a- b).to.equal -1
    let c(x) -> x*2
    let d = 3
    // translate to c(-d)
    expect(c -d).to.equal -6

  it "Addition versus unary plus", #
    let a = 1
    let b = 2
    expect(a + b).to.equal 3
    expect(a+b).to.equal 3
    expect(a+ b).to.equal 3
    let c(x) -> x*2
    let d = 3
    // translate to c(+d)
    expect(c +d).to.equal 6

  it "Multiplication", #
    expect(2 * 3).to.equal 6
    expect(2 * 3 * 5).to.equal 30
    expect((2 * 3) * 5).to.equal 30
    expect(2 * (3 * 5)).to.equal 30
    let mult(a, b) -> a() * b()
    expect(mult(run-once(3), run-once(2))).to.equal 6
    expect(#-> mult(run-once("3"), run-once("2"))).throws TypeError
    expect(#-> mult(run-once(3), run-once("2"))).throws TypeError
    expect(#-> mult(run-once("3"), run-once(2))).throws TypeError
    let mult-assign(mutable a, b) -> a *= b()
    expect(mult-assign(3, run-once 2)).to.equal 6
    expect(#-> mult-assign("3", run-once "2")).throws TypeError
    expect(#-> mult-assign(3, run-once "2")).throws TypeError
    expect(#-> mult-assign("3", run-once 2)).throws TypeError
    let mult-member-assign(a, b, c) -> a[b()] *= c()
    expect(mult-member-assign({key: 2}, run-once("key"), run-once 3)).to.equal 6
    expect(#-> mult-member-assign({key: "2"}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> mult-member-assign({key: 2}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> mult-member-assign({key: "2"}, run-once("key"), run-once 3)).throws TypeError

  it "Division", #
    let thirty-six = 36
    let six = 6
    let three = 3
    expect(thirty-six / six).to.equal 6
    expect(thirty-six / six / three).to.equal 2
    expect((thirty-six / six) / three).to.equal 2
    expect(thirty-six / (six / three)).to.equal 18
    let div = #(a, b) -> a() / b()
    expect(div(run-once(6), run-once 3)).to.equal 2
    expect(#-> div(run-once("6"), run-once "3")).throws TypeError
    expect(#-> div(run-once(6), run-once "3")).throws TypeError
    expect(#-> div(run-once("6"), run-once 3)).throws TypeError
    let div-assign = #(mutable a, b) -> a /= b()
    expect(div-assign(6, run-once 3)).to.equal 2
    expect(#-> div-assign("6", run-once "3")).throws TypeError
    expect(#-> div-assign(6, run-once "3")).throws TypeError
    expect(#-> div-assign("6", run-once 3)).throws TypeError
    let div-member-assign = #(a, b, c) -> a[b()] /= c()
    expect(div-member-assign({key: 6}, run-once("key"), run-once 3)).to.equal 2
    expect(#-> div-member-assign({key: "6"}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> div-member-assign({key: 6}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> div-member-assign({key: "6"}, run-once("key"), run-once 3)).throws TypeError

  it "Multiplication and Division", #
    let fifteen = 15
    let three = 3
    let five = 5
    expect(fifteen * three / five).to.equal 9
    expect((fifteen * three) / five).to.equal 9
    expect(fifteen * (three / five)).to.equal 9
    expect(fifteen / three * five).to.equal 25
    expect((fifteen / three) * five).to.equal 25
    expect(fifteen / (three * five)).to.equal 1

  it "Modulus", #
    expect(5 % 3).to.equal 2
    // test for left-associativity
    expect(2 * 5 % 3).to.equal 1
    expect((2 * 5) % 3).to.equal 1
    expect(2 * (5 % 3)).to.equal 4
    // modulus is higher than addition
    expect(5 % 3 + 1).to.equal 3
    expect(1 + 5 % 3).to.equal 3
    let mod(a, b) -> a() % b()
    expect(mod(run-once(8), run-once(3))).to.equal 2
    expect(#-> mod(run-once("8"), run-once("3"))).throws TypeError
    expect(#-> mod(run-once(8), run-once("3"))).throws TypeError
    expect(#-> mod(run-once("8"), run-once(3))).throws TypeError
    let mod-assign(mutable a, b) -> a %= b()
    expect(mod-assign(8, run-once 3)).to.equal 2
    expect(#-> mod-assign("8", run-once "3")).throws TypeError
    expect(#-> mod-assign(8, run-once "3")).throws TypeError
    expect(#-> mod-assign("8", run-once 3)).throws TypeError
    let mod-member-assign(a, b, c) -> a[b()] %= c()
    expect(mod-member-assign({key: 8}, run-once("key"), run-once 3)).to.equal 2
    expect(#-> mod-member-assign({key: "8"}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> mod-member-assign({key: 8}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> mod-member-assign({key: "8"}, run-once("key"), run-once 3)).throws TypeError

  it "Exponentiation", #
    expect(3 ^ 0).to.equal 1
    expect(3 ^ 1).to.equal 3
    expect(3 ^ 2).to.equal 9
    expect(3 ^ 3).to.equal 27
    expect(9 ^ 0.5).to.equal 3
    expect(9 ^ 1.5).to.equal 27
    expect(9 ^ 2).to.equal 81
    expect(9 ^ 2.5).to.equal 243
    expect(0.5 ^ -1).to.equal 2
    expect(0.5 ^ -2).to.equal 4
    expect(0.5 ^ -3).to.equal 8
    expect(0.5 ^ -4).to.equal 16
    expect(0.25 ^ -1.5).to.equal 8
    expect(0.25 ^ -2.5).to.equal 32
    expect(0.25 ^ -3.5).to.equal 128
    expect(4 ^ 3 ^ 2).to.equal 262144
    expect((4 ^ 3) ^ 2).to.equal 4096
    expect(4 ^ (3 ^ 2)).to.equal 262144
  
    let x = 2
    expect(x ^ 10).to.equal 1024
    expect(x ^ 32).to.equal 2^32
  
    let pow(a, b) -> a() ^ b()
    expect(pow(run-once(2), run-once(3))).to.equal 8
    expect(#-> pow(run-once("2"), run-once("3"))).throws TypeError
    expect(#-> pow(run-once(2), run-once("3"))).throws TypeError
    expect(#-> pow(run-once("2"), run-once(3))).throws TypeError
    let pow-assign(mutable a, b) -> a ^= b()
    expect(pow-assign(2, run-once 3)).to.equal 8
    expect(#-> pow-assign("2", run-once "3")).throws TypeError
    expect(#-> pow-assign(2, run-once "3")).throws TypeError
    expect(#-> pow-assign("2", run-once 3)).throws TypeError
    let pow-member-assign(a, b, c) -> a[b()] ^= c()
    expect(pow-member-assign({key: 2}, run-once("key"), run-once 3)).to.equal 8
    expect(#-> pow-member-assign({key: "2"}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> pow-member-assign({key: 2}, run-once("key"), run-once "3")).throws TypeError
    expect(#-> pow-member-assign({key: "2"}, run-once("key"), run-once 3)).throws TypeError

  it "Exponentation still calculates left side if right is 0", #
    let ten = stub().returns 10
    expect(ten() ^ 0).to.equal 1
    expect(ten).to.be.called-once

  it "Logical operators", #
    expect(false and false).to.be.false
    expect(true and false).to.be.false
    expect(false and true).to.be.false
    expect(true and true).to.be.true
    
    let fail()
      throw Error "should not be reached"
    
    expect(void and fail()).to.equal void
    expect(0 and fail()).to.equal 0
    expect("yes" and 0).to.equal 0
    expect(1 and "yes").to.equal "yes"
  
    expect(false or false).to.be.false
    expect(true or false).to.be.true
    expect(false or true).to.be.true
    expect(true or true).to.be.true
  
    expect(void or 0).to.equal 0
    expect(0 or void).to.equal void
    expect("yes" or fail()).to.equal "yes"
    expect(0 or "yes").to.equal "yes"
  
    expect(false xor false).to.be.false
    expect(true xor false).to.be.true
    expect(false xor true).to.be.true
    expect(true xor true).to.be.false
    expect(0 xor void).to.equal 0
    expect(void xor 0).to.equal void
    expect("yes" xor void).to.equal "yes"
    expect(void xor "yes").to.equal "yes"
    expect("yes" xor 1).to.be.false

  it "logical assignment", #
    let and-assign(mutable x, y)
      x and= y()
    let and-member-assign(x, y, z)
      x[y()] and= z()
    let or-assign(mutable x, y)
      x or= y()
    let or-member-assign(x, y, z)
      x[y()] or= z()
    let xor-assign(mutable x, y)
      x xor= y()
    let xor-member-assign(x, y, z)
      x[y()] xor= z()
  
    expect(and-assign(1, run-once 2)).to.equal 2
    expect(and-assign(0, #-> throw Error())).to.equal 0
    expect(or-assign(1, #-> throw Error())).to.equal 1
    expect(or-assign(0, run-once 2)).to.equal 2
    expect(xor-assign(1, run-once 1)).to.equal false
    expect(xor-assign(1, run-once 0)).to.equal 1
    expect(xor-assign(0, run-once 1)).to.equal 1
    expect(xor-assign(0, run-once 0)).to.equal 0
  
    expect(and-member-assign({}, run-once("key"), #-> throw Error())).to.equal undefined
    expect(and-member-assign({key:"alpha"}, run-once("key"), run-once "bravo")).to.equal "bravo"
    expect(or-member-assign({}, run-once("key"), run-once "value")).to.equal "value"
    expect(or-member-assign({key:"alpha"}, run-once("key"), #-> throw Error())).to.equal "alpha"
    expect(xor-member-assign({}, run-once("key"), run-once "value")).to.equal "value"
    expect(xor-member-assign({}, run-once("key"), run-once 0)).to.equal void
    expect(xor-member-assign({key:"alpha"}, run-once("key"), run-once "value")).to.equal false
    expect(xor-member-assign({key:"alpha"}, run-once(0), run-once 0)).to.equal void

  it "not", #
    expect(not false).to.equal true
    expect(not true).to.equal false

  it "instanceof", #
    let MyType() ->
    expect(new MyType() instanceof MyType).to.be.true
    expect("hello" not instanceof MyType).to.be.true
    expect("hello" instanceof String).to.be.true
    expect(new MyType() not instanceof String).to.be.true
    expect(1234 instanceof Number).to.be.true
    expect((#->) instanceof Function).to.be.true
    expect([] instanceof Array).to.be.true

  it "instanceofsome", #
    expect("" instanceofsome [String]).to.be.true
    expect("" instanceofsome [Function]).to.be.false
    expect("" not instanceofsome [Function]).to.be.true
  
    expect("" not instanceofsome []).to.be.true
    expect("" instanceofsome [String, Function]).to.be.true
    expect("" instanceofsome [Function, String]).to.be.true
    expect("" not instanceofsome [Number, Function]).to.be.true
  
    let mutable str = run-once ""
    expect(str() not instanceofsome []).to.be.true
    expect(str.ran).to.be.true
    str := run-once ""
    expect(str() instanceofsome [Function, String]).to.be.true

  it "unary negate", #
    expect(-5).to.equal 0 - 5
    expect(-(-5)).to.equal 5
    expect(-(-(-5))).to.equal 0 - 5
    expect(-(-(-(-5)))).to.equal 5
    expect(-(-(-(-(-5))))).to.equal 0 - 5
    expect(-(-(-(-(-(-5)))))).to.equal 5

  it "Spaceship", #
    expect(0 <=> 0).to.equal 0
    expect("hello" <=> "hello").to.equal 0
    expect(1 <=> 0).to.equal 1
    expect(0 <=> 1).to.equal -1
    expect(1e9 <=> -1e9).to.equal 1
    expect(-1e9 <=> 1e9).to.equal -1
    expect(Infinity <=> -Infinity).to.equal 1
    expect(-Infinity <=> Infinity).to.equal -1
    expect("alpha" <=> "bravo").to.equal -1
    expect("bravo" <=> "alpha").to.equal 1
  
    let cmp = (<=>)
  
    expect(cmp(0, 0)).to.equal 0
    expect(cmp("hello", "hello")).to.equal 0
    expect(cmp(1, 0)).to.equal 1
    expect(cmp(0, 1)).to.equal -1
    expect(cmp(1e9, -1e9)).to.equal 1
    expect(cmp(-1e9, 1e9)).to.equal -1
    expect(cmp(Infinity, -Infinity)).to.equal 1
    expect(cmp(-Infinity, Infinity)).to.equal -1
    expect(cmp("alpha", "bravo")).to.equal -1
    expect(cmp("bravo", "alpha")).to.equal 1

  it "Comparison", #
    expect(1 < 2).to.equal true
    expect(1 < 1).to.equal false
    expect(1 <= 2).to.equal true
    expect(1 <= 1).to.equal true
    expect(1 <= 0).to.equal false
  
    expect(2 > 1).to.equal true
    expect(1 > 1).to.equal false
    expect(2 >= 1).to.equal true
    expect(1 >= 1).to.equal true
    expect(0 >= 1).to.equal false
  
    expect("bravo" < "charlie").to.equal true
    expect("bravo" < "bravo").to.equal false
    expect("bravo" <= "charlie").to.equal true
    expect("bravo" <= "bravo").to.equal true
    expect("bravo" <= "alpha").to.equal false
  
    expect("charlie" > "bravo").to.equal true
    expect("bravo" > "bravo").to.equal false
    expect("charlie" >= "bravo").to.equal true
    expect("bravo" >= "bravo").to.equal true
    expect("alpha" >= "bravo").to.equal false
  
  it "String concatenation", #
    expect("hello" & " " & "there").to.equal "hello there"
    expect(1 & 2).to.equal "12"
  
    let mutable x = "1"
    x &= 2
    expect(x).to.equal "12"
  
    let concat(a, b) -> a() & b()
    expect(concat(run-once(1), run-once(2))).to.equal "12"
    expect(concat(run-once("1"), run-once("2"))).to.equal "12"
    expect(concat(run-once(1), run-once("2"))).to.equal "12"
    expect(concat(run-once("1"), run-once(2))).to.equal "12"
    expect(#-> concat(run-once("1"), run-once({}))).throws TypeError
    expect(#-> concat(run-once({}), run-once("2"))).throws TypeError
    expect(#-> concat(run-once({}), run-once({}))).throws TypeError
    expect(#-> concat(run-once("1"), run-once(null))).throws TypeError
    expect(#-> concat(run-once(null), run-once("2"))).throws TypeError
    expect(#-> concat(run-once(null), run-once(null))).throws TypeError
    expect(#-> concat(run-once("1"), run-once(undefined))).throws TypeError
    expect(#-> concat(run-once(undefined), run-once("2"))).throws TypeError
    expect(#-> concat(run-once(undefined), run-once(undefined))).throws TypeError
    let concat-assign(mutable a, b) -> a &= b()
    expect(concat-assign("1", run-once("2"))).to.equal "12"
    expect(concat-assign("1", run-once(2))).to.equal "12"
    //expect(#-> concat-assign(1, run-once("2"))).throws TypeError
    //expect(#-> concat-assign(1, run-once(2))).throws TypeError
    expect(#-> concat-assign("1", run-once({}))).throws TypeError
    expect(#-> concat-assign({}, run-once("2"))).throws TypeError
    expect(#-> concat-assign({}, run-once({}))).throws TypeError
    expect(#-> concat-assign("1", run-once(null))).throws TypeError
    expect(#-> concat-assign(null, run-once("2"))).throws TypeError
    expect(#-> concat-assign(null, run-once(null))).throws TypeError
    expect(#-> concat-assign("1", run-once(undefined))).throws TypeError
    expect(#-> concat-assign(undefined, run-once("2"))).throws TypeError
    expect(#-> concat-assign(undefined, run-once(undefined))).throws TypeError
    let concat-member-assign(a, b, c) -> a[b()] &= c()
    expect(concat-member-assign({key: "1"}, run-once("key"), run-once 2)).to.equal "12"
    expect(concat-member-assign({key: "1"}, run-once("key"), run-once "2")).to.equal "12"
    //expect(#-> concat-member-assign({key: 1}, run-once("key"), run-once "2")).throws TypeError
    //expect(#-> concat-member-assign({key: 1}, run-once("key"), run-once 2)).throws TypeError
    expect(#-> concat-member-assign({key: "1"}, run-once("key"), run-once {})).throws TypeError
    expect(#-> concat-member-assign({key: {}}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> concat-member-assign({key: {}}, run-once("key"), run-once {})).throws TypeError
    expect(#-> concat-member-assign({key: "1"}, run-once("key"), run-once null)).throws TypeError
    expect(#-> concat-member-assign({key: null}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> concat-member-assign({key: null}, run-once("key"), run-once null)).throws TypeError
    expect(#-> concat-member-assign({key: "1"}, run-once("key"), run-once undefined)).throws TypeError
    expect(#-> concat-member-assign({key: undefined}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> concat-member-assign({key: undefined}, run-once("key"), run-once undefined)).throws TypeError
  
    let concat-known-numbers()
      let a = 1
      let b = 2
      a & b
    expect(concat-known-numbers()).to.equal "12"

    let unstrict-concat-assign(mutable a, b) -> a ~&= b()
    expect(unstrict-concat-assign("1", run-once("2"))).to.equal "12"
    expect(unstrict-concat-assign(1, run-once("2"))).to.equal "12"
    expect(unstrict-concat-assign("1", run-once(2))).to.equal "12"
    expect(unstrict-concat-assign(1, run-once(2))).to.equal "12"

  it "delete removes key", #
    let obj = { alpha: "bravo", charlie: "delta" }
  
    expect(obj ownskey "alpha").to.be.true
    delete obj.alpha
    expect(obj not ownskey "alpha").to.be.true

  it "delete plucks values", #
    let obj = { alpha: "bravo", charlie: "delta" }
  
    expect(obj ownskey "alpha").to.be.true
    expect(delete obj.alpha).to.equal "bravo"
    expect(obj not ownskey "alpha").to.be.true

  it "delete returns undefined if no value found", #
    let obj = {}
    expect(delete obj.alpha).to.equal undefined

  it "delete doesn't pluck if unnecessary", #
    if not is-function! Object.define-property
      return
  
    let obj = {}
    Object.define-property(obj, "alpha", {
      get: #-> fail()
      configurable: true
    })
    delete obj.alpha
    expect(obj.alpha).to.equal undefined

  it "delete pluck only calculates object once", #
    let obj = run-once { alpha: "bravo" }
    expect(delete obj().alpha).to.equal "bravo"

  it "delete pluck only calculates key once", #
    let obj = { alpha: "bravo" }
    let key = run-once "alpha"
    expect(delete obj[key()]).to.equal "bravo"

  it "delete pluck only calculates value once", #
    if not is-function! Object.define-property
      return
  
    let obj = {}
    Object.define-property(obj, "alpha", {
      get: run-once "bravo"
      configurable: true
    })
    expect(delete obj.alpha).to.equal "bravo"

  it "let with assignment at the same time", #
    let mutable a = undefined
    let b = a := "alpha"
    expect("alpha").to.equal a
    expect("alpha").to.equal b
  
    let mutable x = undefined
    let mutable y = undefined
    let mutable z = undefined
  
    let w = x := y := z := "bravo"
    expect("bravo").to.equal w
    expect("bravo").to.equal x
    expect("bravo").to.equal y
    expect("bravo").to.equal z

  it "let with ?= assignment", #
    let mutable x = undefined
    let y = x ?= {}
    let z = x ?= {}
    expect(y).to.equal x
    expect(z).to.equal x

  it "let with ownsor= assignment", #
    let x = {}
    let y = x.key ownsor= {}
    let z = x.key ownsor= {}
    expect(y).to.equal x.key
    expect(z).to.equal x.key

  it "let with or= assignment", #
    let mutable x = undefined
    let y = x or= {}
    let z = x or= {}
    expect(y).to.equal x
    expect(z).to.equal x

  it "multiple assignment", #
    let mutable x = undefined
    let mutable y = undefined
    let mutable z = undefined
  
    x := y := z := "alpha"
    expect("alpha").to.equal x
    expect("alpha").to.equal y
    expect("alpha").to.equal z

  it "multiple ?= assignment", #
    let mutable x = undefined
    let mutable y = undefined
    let mutable z = undefined
  
    y := x ?= {}
    z := x ?= {}
    expect(y).to.equal x
    expect(z).to.equal x

  it "multiple ownsor= assignment", #
    let x = {}
    let mutable y = undefined
    let mutable z = undefined
  
    y := x.key ownsor= {}
    z := x.key ownsor= {}
    expect(y).to.equal x.key
    expect(z).to.equal x.key

  it "multiple or= assignment", #
    let mutable x = undefined
    let mutable y = undefined
    let mutable z = undefined
  
    y := x or= {}
    z := x or= {}
    expect(y).to.equal x
    expect(z).to.equal x

  it "equality", #
    expect("a" == "a").to.be.true
    expect("" == "").to.be.true
    expect("" != " ").to.be.true
    let eq(a, b) -> a == b
    expect(eq("", 0)).to.be.false
    expect(eq("0", 0)).to.be.false
    expect(eq(null, undefined)).to.be.false

  it "bitnot", #
    expect(bitnot 0).to.equal -1
    expect(bitnot 1).to.equal -2
    expect(bitnot 5.5).to.equal -6

  it "bitand", #
    expect(0b1110 bitand 0b1011).to.equal 0b1010

  it "bitor", #
    expect(0b1011 bitor 0b0101).to.equal 0b1111

  it "bitxor", #
    expect(0b1100 bitxor 0b0101).to.equal 0b1001

  it "bitlshift", #
    expect(0b10101 bitlshift 4).to.equal 0b101010000

  it "bitrshift", #
    expect(0b101010000 bitrshift 4).to.equal 0b10101

  it "biturshift", #
    expect(0b101010000 biturshift 4).to.equal 0b10101
    expect(-1 biturshift 0).to.equal 2^32 - 1

  it "divisibility", #
    expect(10 %% 1).to.be.true
    expect(10 %% 2).to.be.true
    expect(10 %% 3).to.be.false
    expect(10 %% 4).to.be.false
    expect(10 %% 5).to.be.true
    expect(10 %% 6).to.be.false
    expect(10 %% 7).to.be.false
    expect(10 %% 8).to.be.false
    expect(10 %% 9).to.be.false
    expect(10 %% 10).to.be.true
  
    expect(10 not %% 1).to.be.false
    expect(10 not %% 2).to.be.false
    expect(10 not %% 3).to.be.true
    expect(10 not %% 4).to.be.true
    expect(10 not %% 5).to.be.false
    expect(10 not %% 6).to.be.true
    expect(10 not %% 7).to.be.true
    expect(10 not %% 8).to.be.true
    expect(10 not %% 9).to.be.true
    expect(10 not %% 10).to.be.false

  it "floor division", #
    expect(9 \ 2).to.equal 4
    expect(10 \ 2).to.equal 5
    expect(9.999 \ 2).to.equal 4
  
    let mutable x = 10
    x \= 3
    expect(x).to.equal 3
    let div(a, b) -> a() \ b()
    expect(div(run-once(9), run-once 2)).to.equal 4
    expect(#-> div(run-once("9"), run-once "2")).throws TypeError
    expect(#-> div(run-once(9), run-once "2")).throws TypeError
    expect(#-> div(run-once("9"), run-once 2)).throws TypeError
    let div-assign(mutable a, b) -> a \= b()
    expect(div-assign(9, run-once 2)).to.equal 4
    expect(#-> div-assign("9", run-once "2")).throws TypeError
    expect(#-> div-assign(9, run-once "2")).throws TypeError
    expect(#-> div-assign("9", run-once 2)).throws TypeError
    let div-member-assign(a, b, c) -> a[b()] \= c()
    expect(div-member-assign({key: 9}, run-once("key"), run-once 2)).to.equal 4
    expect(#-> div-member-assign({key: "9"}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> div-member-assign({key: 9}, run-once("key"), run-once "2")).throws TypeError
    expect(#-> div-member-assign({key: "9"}, run-once("key"), run-once 2)).throws TypeError

  it "min/max operators", #
    expect(1 min 2 min 3 min 4).to.equal 1
    expect(1 max 2 max 3 max 4).to.equal 4
    expect("alpha" min "bravo" min "charlie" min "delta").to.equal "alpha"
    expect("alpha" max "bravo" max "charlie" max "delta").to.equal "delta"

  it "min/max assignment", #
    let min-assign(mutable x, y)
      x min= y()
    let min-member-assign(x, y, z)
      x[y()] min= z()
    let max-assign(mutable x, y)
      x max= y()
    let max-member-assign(x, y, z)
      x[y()] max= z()
  
    expect(min-assign(1, run-once 2)).to.equal 1
    expect(min-assign(2, run-once 1)).to.equal 1
    expect(max-assign(1, run-once 2)).to.equal 2
    expect(max-assign(2, run-once 1)).to.equal 2
    expect(min-assign("alpha", run-once "bravo")).to.equal "alpha"
    expect(min-assign("bravo", run-once "alpha")).to.equal "alpha"
    expect(max-assign("alpha", run-once "bravo")).to.equal "bravo"
    expect(max-assign("bravo", run-once "alpha")).to.equal "bravo"
  
    expect(min-member-assign({key: 1}, run-once("key"), run-once 2)).to.equal 1
    expect(min-member-assign({key: 2}, run-once("key"), run-once 1)).to.equal 1
    expect(max-member-assign({key: 1}, run-once("key"), run-once 2)).to.equal 2
    expect(max-member-assign({key: 2}, run-once("key"), run-once 1)).to.equal 2
    expect(min-member-assign({key: "alpha"}, run-once("key"), run-once "bravo")).to.equal "alpha"
    expect(min-member-assign({key: "bravo"}, run-once("key"), run-once "alpha")).to.equal "alpha"
    expect(max-member-assign({key: "alpha"}, run-once("key"), run-once "bravo")).to.equal "bravo"
    expect(max-member-assign({key: "bravo"}, run-once("key"), run-once "alpha")).to.equal "bravo"

  it "negation on separate line does not look like subtraction", #
    let f()
      let x = 5
      -1
  
    expect(f()).to.equal -1

  it "ownskey", #
    let x = { alpha: true }
    let y = { extends x }
    y.bravo := true
  
    expect(x ownskey \alpha).to.be.true
    expect(y not ownskey \alpha).to.be.true
    expect(y ownskey \bravo).to.be.true

  it "haskey", #
    let x = { alpha: true }
    let y = { extends x }
    y.bravo := true
  
    expect(x haskey \alpha).to.be.true
    expect(y haskey \alpha).to.be.true
    expect(y haskey \bravo).to.be.true

  it "ownskey with hasOwnProperty in object", #
    let x = { hasOwnProperty: #-> false }
  
    expect(x ownskey \hasOwnProperty).to.be.true
    expect(x.hasOwnProperty(\hasOwnProperty)).to.be.false

  it "Operators as functions", #
    let n(f, x, y, expected, safe)
      expect(f).to.be.a(\function)
      expect(f(x, y)).to.equal expected
      if safe
        expect(#-> f(x, String(y))).throws TypeError
      else
        expect(f(x, String(y)) in [expected, String(expected)]).to.be.true
    let s(f, x, y, expected, safe)
      expect(f).to.be.a(\function)
      expect(f(x, y)).to.equal expected
      if safe
        expect(#-> f(x, Number(y))).throws TypeError
      else
        expect(f(x, Number(y)) in [expected, Number(expected)]).to.be.true
  
    n (^), 2, 10, 1024, true
    n (~^), 2, 10, 1024, false
    n (*), 5, 6, 30, true
    n (~*), 5, 6, 30, false
    n (/), 5, 4, 1.25, true
    n (~/), 5, 4, 1.25, false
    n (\), 5, 3, 1, true
    n (~\), 5, 3, 1, false
    n (%), 5, 3, 2, true
    n (~%), 5, 3, 2, false
    n (+), 2, 4, 6, true
    n (~+), 2, 4, 6, false
    n (-), 10, 4, 6, true
    n (~-), 10, 4, 6, false
    n (bitlshift), 0b10101, 4, 0b101010000, true
    n (~bitlshift), 0b10101, 4, 0b101010000, false
    n (bitrshift), 0b101010000, 4, 0b10101, true
    n (~bitrshift), 0b101010000, 4, 0b10101, false
    n (biturshift), 0b101010000, 4, 0b10101, true
    n (~biturshift), 0b101010000, 4, 0b10101, false
    n (biturshift), -1, 0, 2^32 - 1, true
    n (~biturshift), -1, 0, 2^32 - 1, false
    n (bitand), 0b1110, 0b1011, 0b1010, true
    n (~bitand), 0b1110, 0b1011, 0b1010, false
    n (bitor), 0b1110, 0b0101, 0b1111, true
    n (~bitor), 0b1110, 0b0101, 0b1111, false
    n (bitxor), 0b1100, 0b0101, 0b1001, true
    n (~bitxor), 0b1100, 0b0101, 0b1001, false
    n (min), 5, 2, 2, true
    n (~min), 5, 2, 2, false
    n (min), 2, 5, 2, true
    n (~min), 2, 5, 2, false
    n (max), 5, 2, 5, true
    n (~max), 5, 2, 5, false
    n (max), 2, 5, 5, true
    n (~max), 2, 5, 5, false
    n (&), 1, 2, "12"
    n (~&), "1", "2", "12"
    n (&), "hello", "there", "hellothere"
    n (~&), "hello", "there", "hellothere"
    expect(#-> (&)(undefined, 1)).throws TypeError
    n (~&), undefined, 1, "undefined1", false
  
    expect((in)).to.be.a \function
    expect((in)("c", ["a", "b", "c", "d"])).to.be.true
    expect((in)("e", ["a", "b", "c", "d"])).to.be.false
  
    expect((not in)).to.be.a \function
    expect((not in)("c", ["a", "b", "c", "d"])).to.be.false
    expect((not in)("e", ["a", "b", "c", "d"])).to.be.true
  
    expect((haskey)).to.be.a \function
    expect((haskey)({hello: "there"}, "hello")).to.be.true
    expect((haskey)({ extends {hello: "there"} }, "hello")).to.be.true
    expect((haskey)({ extends {} }, "hello")).to.be.false
  
    expect((not haskey)).to.be.a \function
    expect((not haskey)({hello: "there"}, "hello")).to.be.false
    expect((not haskey)({ extends {hello: "there"} }, "hello")).to.be.false
    expect((not haskey)({ extends {} }, "hello")).to.be.true
  
    expect((ownskey)).to.be.a \function
    expect((ownskey)({hello: "there"}, "hello")).to.be.true
    expect((ownskey)({ extends {hello: "there"} }, "hello")).to.be.false
    expect((ownskey)({ extends {} }, "hello")).to.be.false
  
    expect((not ownskey)).to.be.a \function
    expect((not ownskey)({hello: "there"}, "hello")).to.be.false
    expect((not ownskey)({ extends {hello: "there"} }, "hello")).to.be.true
    expect((not ownskey)({ extends {} }, "hello")).to.be.true
  
    expect((instanceof)).to.be.a \function
    expect((instanceof)(#->, Function)).to.be.true
    expect((instanceof)({}, Object)).to.be.true
    expect((instanceof)([], Array)).to.be.true
    expect((instanceof)(#->, Array)).to.be.false
    expect((instanceof)([], Number)).to.be.false
  
    expect((not instanceof)).to.be.a \function
    expect((not instanceof)(#->, Function)).to.be.false
    expect((not instanceof)({}, Object)).to.be.false
    expect((not instanceof)([], Array)).to.be.false
    expect((not instanceof)(#->, Array)).to.be.true
    expect((not instanceof)([], Number)).to.be.true
  
    expect((instanceofsome)).to.be.a \function
    expect((instanceofsome)(#->, [Number, Function])).to.be.true
    expect((instanceofsome)(#->, [Function, Number])).to.be.true
    expect((instanceofsome)(#->, [String, Number])).to.be.false
  
    expect((not instanceofsome)).to.be.a \function
    expect((not instanceofsome)(#->, [Number, Function])).to.be.false
    expect((not instanceofsome)(#->, [Function, Number])).to.be.false
    expect((not instanceofsome)(#->, [String, Number])).to.be.true
  
    expect((<=>)).to.be.a \function
    expect((<=>)("hello", "hello")).to.equal 0
    expect((<=>)("alpha", "bravo")).to.equal -1
    expect((<=>)("bravo", "alpha")).to.equal 1
    expect((<=>)(1000, 1000)).to.equal 0
    expect((<=>)(1000, 1100)).to.equal -1
    expect((<=>)(1000, 900)).to.equal 1
  
    expect((~=)).to.be.a \function
    expect((~=)("1", 1)).to.be.true
    expect((~=)("", 0)).to.be.true
    expect((~=)("", [])).to.be.true
    expect((~=)(false, 1)).to.be.false
  
    expect((!~=)).to.be.a \function
    expect((!~=)("1", 1)).to.be.false
    expect((!~=)("", 0)).to.be.false
    expect((!~=)("", [])).to.be.false
    expect((!~=)(false, 1)).to.be.true
  
    expect((==)).to.be.a \function
    expect((==)(1, 1)).to.be.true
    expect((==)("1", 1)).to.be.false
    expect((==)("hello", "hello")).to.be.true
    expect((==)("hello", "Hello")).to.be.false
  
    expect((!=)).to.be.a \function
    expect((!=)(1, 1)).to.be.false
    expect((!=)("1", 1)).to.be.true
    expect((!=)("hello", "hello")).to.be.false
    expect((!=)("hello", "Hello")).to.be.true
  
    n (%%), 10, 5, true, true
    n (~%%), 10, 5, true, false
    n (%%), 10, 6, false, true
    n (~%%), 10, 6, false, false
  
    n (not %%), 10, 5, false, true
    n (not ~%%), 10, 5, false, false
    n (not %%), 10, 6, true, true
    n (not ~%%), 10, 6, true, false
  
    n (<), 1, 5, true, true
    n (~<), 1, 5, true, false
    n (<), 5, 5, false, true
    n (~<), 5, 5, false, false
    n (<), 5, 1, false, true
    n (~<), 5, 1, false, false
    n (<=), 1, 5, true, true
    n (~<=), 1, 5, true, false
    n (<=), 5, 5, true, true
    n (~<=), 5, 5, true, false
    n (<=), 5, 1, false, true
    n (~<=), 5, 1, false, false
    n (>), 5, 1, true, true
    n (~>), 5, 1, true, false
    n (>), 5, 5, false, true
    n (~>), 5, 5, false, false
    n (>), 1, 5, false, true
    n (~>), 1, 5, false, false
    n (>=), 5, 1, true, true
    n (~>=), 5, 1, true, false
    n (>=), 5, 5, true, true
    n (~>=), 5, 5, true, false
    n (>=), 1, 5, false, true
    n (~>=), 1, 5, false, false
  
    s (<), "1", "5", true, true
    s (~<), "1", "5", true, false
    s (<), "5", "5", false, true
    s (~<), "5", "5", false, false
    s (<), "5", "1", false, true
    s (~<), "5", "1", false, false
    s (<=), "1", "5", true, true
    s (~<=), "1", "5", true, false
    s (<=), "5", "5", true, true
    s (~<=), "5", "5", true, false
    s (<=), "5", "1", false, true
    s (~<=), "5", "1", false, false
    s (>), "5", "1", true, true
    s (~>), "5", "1", true, false
    s (>), "5", "5", false, true
    s (~>), "5", "5", false, false
    s (>), "1", "5", false, true
    s (~>), "1", "5", false, false
    s (>=), "5", "1", true, true
    s (~>=), "5", "1", true, false
    s (>=), "5", "5", true, true
    s (~>=), "5", "5", true, false
    s (>=), "1", "5", false, true
    s (~>=), "1", "5", false, false
  
    expect((and)).to.be.a \function
    expect((and)(1, 5)).to.equal 5
    expect((and)(0, 5)).to.equal 0
    expect((and)(false, 5)).to.equal false
    expect((and)(true, 5)).to.equal 5
    expect((and)(void, 5)).to.equal void
    expect((and)(null, 5)).to.equal null
    expect((and)("", 5)).to.equal ""
    expect((and)("a", 5)).to.equal 5
  
    expect((or)).to.be.a \function
    expect((or)(1, 5)).to.equal 1
    expect((or)(0, 5)).to.equal 5
    expect((or)(false, 5)).to.equal 5
    expect((or)(true, 5)).to.equal true
    expect((or)(void, 5)).to.equal 5
    expect((or)(null, 5)).to.equal 5
    expect((or)("", 5)).to.equal 5
    expect((or)("a", 5)).to.equal "a"
  
    expect((xor)).to.be.a \function
    expect((xor)(1, 5)).to.equal false
    expect((xor)(1, 0)).to.equal 1
    expect((xor)(0, 5)).to.equal 5
    expect((xor)(false, 5)).to.equal 5
    expect((xor)(true, 5)).to.equal false
    expect((xor)(true, void)).to.equal true
    expect((xor)(void, 5)).to.equal 5
    expect((xor)(null, 5)).to.equal 5
    expect((xor)("", 5)).to.equal 5
    expect((xor)("a", 5)).to.equal false
    expect((xor)("a", null)).to.equal "a"
  
    expect((?)).to.be.a \function
    expect((?)(1, 5)).to.equal 1
    expect((?)(0, 5)).to.equal 0
    expect((?)(false, 5)).to.equal false
    expect((?)(true, 5)).to.equal true
    expect((?)(void, 5)).to.equal 5
    expect((?)(null, 5)).to.equal 5
    expect((?)("", 5)).to.equal ""
    expect((?)("a", 5)).to.equal "a"
  
    expect((not)).to.be.a \function
    expect((not)(false)).to.equal true
    expect((not)(true)).to.equal false
    expect((not)("")).to.equal true
    expect((not)("a")).to.equal false
    expect((not)(0)).to.equal true
    expect((not)(1)).to.equal false
    expect((not)(void)).to.equal true
    expect((not)(null)).to.equal true
  
    expect((bitnot)).to.be.a \function
    expect((bitnot)(0)).to.equal -1
    expect((bitnot)(1)).to.equal -2
    expect((bitnot)(5.5)).to.equal -6
    expect(#->(bitnot)("")).throws TypeError
    expect(#->(bitnot)(void)).throws TypeError
  
    expect((~bitnot)).to.be.a \function
    expect((~bitnot)(0)).to.equal -1
    expect((~bitnot)(1)).to.equal -2
    expect((~bitnot)(5.5)).to.equal -6
    expect((~bitnot)("")).to.equal -1
  
    expect((typeof)).to.be.a \function
    expect((typeof)(0)).to.equal "number"
    expect((typeof)(1)).to.equal "number"
    expect((typeof)(NaN)).to.equal "number"
    expect((typeof)("")).to.equal "string"
    expect((typeof)(void)).to.equal "undefined"
    expect((typeof)(null)).to.equal "object"
    expect((typeof)({})).to.equal "object"
    expect((typeof)([])).to.equal "object"
    expect((typeof)(#->)).to.equal "function"
    expect((typeof)(true)).to.equal "boolean"
    expect((typeof)(false)).to.equal "boolean"
  
    expect((typeof!)).to.be.a \function
    expect((typeof!)(0)).to.equal "Number"
    expect((typeof!)(1)).to.equal "Number"
    expect((typeof!)(NaN)).to.equal "Number"
    expect((typeof!)("")).to.equal "String"
    expect((typeof!)(void)).to.equal "Undefined"
    expect((typeof!)(null)).to.equal "Null"
    expect((typeof!)({})).to.equal "Object"
    expect((typeof!)([])).to.equal "Array"
    expect((typeof!)(#->)).to.equal "Function"
    expect((typeof!)(true)).to.equal "Boolean"
    expect((typeof!)(false)).to.equal "Boolean"
  
    let t(f, obj, should-catch)
      expect(f).to.be.a \function
      let mutable caught = false
      try
        f(obj)
      catch e
        caught := true
      expect(caught xor should-catch).to.be.false
  
    t (throw), {}, true
    t (throw), false, true
    t (throw), null, true
    t (throw), void, true
  
    t (throw?), {}, true
    t (throw?), false, true
    t (throw?), null, false
    t (throw?), void, false

  it "Operators as functions are curried", #
    let add = (+)
    expect(add 1, 2).to.equal 3
    let plus-5 = add 5
    expect(plus-5 3).to.equal 8
    expect(plus-5 4).to.equal 9
    let plus-6 = add 6
    expect(plus-6 4).to.equal 10

  it "Partial operator functions", #
    let double = (* 2)
    expect(double).to.be.a \function
    expect(double 3).to.equal 6
  
    let square = (^ 2)
    expect(square).to.be.a \function
    expect(square 3).to.equal 9
  
    let two-exp = (2 ^)
    expect(two-exp).to.be.a \function
    expect(two-exp 10).to.equal 1024
  
    let F()! ->
    let is-F = (instanceof F)
    let is-not-F = (not instanceof F)
  
    expect(is-F(new F)).to.be.true
    expect(is-not-F(new F)).to.be.false
    expect(is-F({})).to.be.false
    expect(is-not-F({})).to.be.true

  it "til operator", #
    expect(0 til 5).to.eql [0, 1, 2, 3, 4]
    expect(5 til 0).to.eql []
    expect(0.5 til 5).to.eql [0.5, 1.5, 2.5, 3.5, 4.5]

  it "to operator", #
    expect(0 to 5).to.eql [0, 1, 2, 3, 4, 5]
    expect(5 to 0).to.eql []
    expect(0.5 to 5).to.eql [0.5, 1.5, 2.5, 3.5, 4.5]

  it "til with by", #
    expect(0 til 5 by 2).to.eql [0, 2, 4]
    expect(5 til 0 by 2).to.eql []
    expect(5 til 0 by -1).to.eql [5, 4, 3, 2, 1]
    expect(5 til 0 by -2).to.eql [5, 3, 1]
    expect(0 til 3 by 0.5).to.eql [0, 0.5, 1, 1.5, 2, 2.5]

  it "to with by", #
    expect(0 to 5 by 2).to.eql [0, 2, 4]
    expect(5 to 0 by 2).to.eql []
    expect(5 to 0 by -1).to.eql [5, 4, 3, 2, 1, 0]
    expect(5 to 0 by -2).to.eql [5, 3, 1]
    expect(0 to 3 by 0.5).to.eql [0, 0.5, 1, 1.5, 2, 2.5, 3]

  it "by on normal array", #
    expect([1, 2, 3, 4] by 1).to.eql [1, 2, 3, 4]
    expect([1, 2, 3, 4] by 2).to.eql [1, 3]
    expect([1, 2, 3, 4] by -1).to.eql [4, 3, 2, 1]
    expect([1, 2, 3, 4] by -2).to.eql [4, 2]

  it "is/isnt operator", #
    expect(1 is 1).to.be.true
    expect(0 is 0).to.be.true
    expect(-0 is -0).to.be.true
    expect(NaN is NaN).to.be.true
    expect(Infinity is Infinity).to.be.true
    expect(-Infinity is -Infinity).to.be.true
    expect("hello" is "hello").to.be.true
    expect(1 isnt -1).to.be.true
    expect(0 isnt -0).to.be.true
    expect(-0 isnt 0).to.be.true
    expect(Infinity isnt -Infinity).to.be.true
    expect(-Infinity isnt Infinity).to.be.true
    expect(NaN isnt 0).to.be.true
    expect(NaN isnt Infinity).to.be.true
    expect(NaN isnt -Infinity).to.be.true
    expect(NaN isnt NaN).to.be.false
  
    let positive-zero = 0
    let negative-zero = -0
    let nan = NaN
  
    expect(positive-zero is 0).to.be.true
    expect(0 is positive-zero).to.be.true
    expect(positive-zero is positive-zero).to.be.true
    expect(negative-zero is -0).to.be.true
    expect(-0 is negative-zero).to.be.true
    expect(negative-zero is negative-zero).to.be.true
    expect(nan is NaN).to.be.true
    expect(NaN is nan).to.be.true
    expect(nan is nan).to.be.true

  it "percent operator", #
    expect(100% == 1).to.be.true
    expect(1.234% == 0.01234).to.be.true
    expect(-100% == -1).to.be.true
  
    let x = 100
    expect(x% == 1).to.be.true

  it "Addition verifies numericity with different possible return types", #
    let f(x)
      if x
        "234"
      else
        234

    expect(1 + f(false)).to.equal 235
    expect(#-> 1 + f(true)).throws TypeError

  it "Addition verifies numericity with an idle return statement", #
    let f(x)
      if x
        return "234"
      234

    expect(1 + f(false)).to.equal 235
    expect(#-> 1 + f(true)).throws TypeError

  it "Assigning an unknown variable is an error", #
    expect(#-> gorilla.compile-sync """let x = 0
    y := 5""").throws gorilla.MacroError, r"Trying to assign with := to unknown variable 'y'.*?2:\d+"

  it "Assigning an immutable variable is an error", #
    expect(#-> gorilla.compile-sync """let x = 0
    x := 5""").throws gorilla.MacroError, r"Trying to assign with := to immutable variable 'x'.*?2:\d+"

  it "Compose operators", #
    let double(x) -> x * 2
    let square(x) -> x ^ 2
  
    let square-of-double = square << double
    let double-of-square = square >> double
  
    expect(square-of-double(5)).to.equal 100
    expect(double-of-square(5)).to.equal 50
  
    let times-8 = double << double << double
    expect(times-8 5).to.equal 40

  it "Compose operators are executed in expected order", #
    let with-addition = do
      let mutable id = 0
      #(f)
        let my-id = (id += 1)
        #(x) -> f(x) + my-id
  
    let double(x) -> x * 2
    let square(x) -> x ^ 2
  
    let alpha = with-addition(square) << with-addition(double) // ((x * 2) + 2) ^ 2 + 1
    expect([alpha(0), alpha(1), alpha(2), alpha(3), alpha(4), alpha(5)]).to.eql [5, 17, 37, 65, 101, 145]
  
    let bravo = with-addition(square) >> with-addition(double) // ((x ^ 2) + 3) * 2 + 4
    expect([bravo(0), bravo(1), bravo(2), bravo(3), bravo(4), bravo(5)]).to.eql [10, 12, 18, 28, 42, 60]

  it "Pipe operators", #
    let double(x) -> x * 2
    let square(x) -> x ^ 2
  
    expect(5 |> double |> square).to.equal 100
    expect(square <| double <| 5).to.equal 100

  it "Pipe operators are executed in expected order", #
    let with-addition = do
      let mutable id = 0
      #(f)
        let my-id = (id += 1)
        #(x) -> f(x) + my-id
  
    let double(x) -> x * 2
    let square(x) -> x ^ 2
  
    // ((5 * 2) + 1) ^ 2 + 2
    expect(5 |> with-addition(double) |> with-addition(square)).to.equal 123
    // ((5 * 2) + 4) ^ 2 + 3
    expect(with-addition(square) <| with-addition(double) <| 5).to.equal 199

  it "Import operators", #
    let source = { alpha: \bravo }
    let mutable dest = { charlie: \delta }
  
    expect(dest <<< source).to.equal dest
    expect(dest.alpha).to.equal \bravo
    expect(dest.charlie).to.equal \delta
  
    dest := { charlie: \delta }
    expect(source >>> dest).to.equal dest
    expect(dest.alpha).to.equal \bravo
    expect(dest.charlie).to.equal \delta
  
    dest := { charlie: \delta }
  
    expect(dest <<< { alpha: \bravo }).to.equal dest
    expect(dest.alpha).to.equal \bravo
    expect(dest.charlie).to.equal \delta

  it "Import chain", #
    let a = {} <<< { alpha: \bravo } <<< { charlie: \delta }
    expect(a.alpha).to.equal \bravo
    expect(a.charlie).to.equal \delta
  
    let one = { alpha: \bravo }
    let two = { charlie: \delta }
    let b = {} <<< one <<< two
    expect(b.alpha).to.equal \bravo
    expect(b.charlie).to.equal \delta
    expect(one.charlie).to.equal void
  
  it "Let allows for bodies as the right-hand expression", #
    let a = stub()
    let b = stub()
    let c = stub().returns "hello"
    
    let value =
      a()
      b()
      c()
    
    expect(a).to.be.called-once
    expect(b).to.be.called-once
    expect(c).to.be.called-once
    expect(value).to.be.equal "hello"
  
  it "Assign allows for bodies as the right-hand expression", #
    let a = stub()
    let b = stub()
    let c = stub().returns "hello"
    
    let mutable value = void
    value :=
      a()
      b()
      c()
    
    expect(a).to.be.called-once
    expect(b).to.be.called-once
    expect(c).to.be.called-once
    expect(value).to.be.equal "hello"
