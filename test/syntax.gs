let {expect} = require 'chai'
let gorilla = require '../index'

describe "semicolon-separated statements", #
  it "act as if they were on newlines", #
    let x = 5; let y = 6
    expect(x+1).to.equal y; expect(x).to.equal y - 1
  
    let f(a) -> a
    expect(f x).to.equal x; expect(f y).to.equal y

describe "first!", #
  it "returns the first value, but executes all in-order", #
    let order-list = []
    let order(value)
      order-list.push value
      value
    expect(first!(order(1), order(2), order(3))).to.equal 1
    expect(order-list).to.eql [1, 2, 3]

describe "last!", #
  it "returns the last value, executing all arguments in-order", #
    let order-list = []
    let order(value)
      order-list.push value
      value
    expect(last!(order(1), order(2), order(3))).to.equal 3
    expect(order-list).to.eql [1, 2, 3]

describe "let", #
  describe "as a function", #
    it "does not allow primordials to be declared", #
      for prim in ["Object", "Math", "Function"]
        expect(#-> gorilla.compile-sync """
        let x = 0
        let $prim() ->
        """).throws gorilla.MacroError, r"^Cannot declare primordial '$prim'.*2:\d+\$"
  
  describe "as an assignment", #
    it "does not allow primordials to be declared", #
      for prim in ["Object", "Math", "Function"]
        expect(#-> gorilla.compile-sync """
        let x = 0
        let $prim = 0
        """).throws gorilla.MacroError//, r"^Cannot declare primordial '$prim'.*2:\d+$"
