let {expect} = require 'chai'

describe "scope", #
  it "should handle types of shadowed variables gracefully", #
    let value = 1 // a number
    let f()
      let value = "hello" // a number
      let g()
        expect(typeof value).to.equal \string
        value
      g()
    expect(f()).to.equal "hello"
  
  it "should handle a parameter shadowing a variable", #
    let value = 1 // a number
    let f()
      let g(value)
        expect(typeof value).to.equal \string
        value
      g "hello"
    expect(f()).to.equal "hello"
  
  it "should handle a parameter with type info shadowing a variable", #
    let value = 1 // a number
    let f()
      let g(value as String)
        expect(typeof value).to.equal \string
        value
      g "hello"
    expect(f()).to.equal "hello"

  it "should allow mutation of a variable declared outside of a for loop", #
    let f()
      let mutable sum = 0
      for x in [1, 2, 3, 4]
        sum += x
      sum
    expect(f()).to.equal 10
  
  it "should allow mutation of a variable declared as a parameter", #
    let f(mutable sum)
      for x in [1, 2, 3, 4]
        sum += x
      sum
    expect(f(10)).to.equal 20
  
  it "should allow mutation within an async block", #
    async <- set-immediate()

    let f()
      let mutable sum = 0
      for x in [1, 2, 3, 4]
        sum += x
      sum
    expect(f()).to.equal 10
  
  it "should allow mutation of a shadowed immutable variable", #
    let value = 0
    let f()
      let mutable value = 10
      value *= 2
      value
    expect(f()).to.equal 20
  
  it "should allow mutation of a shadowed immutable variable in another function", #
    let value = 0
    let f()
      let mutable value = 10
      let g()
        value *= 2
        value
      g()
    expect(f()).to.equal 20
  
  it "should allow mutation of a shadowed immutable variable in a class", #
    let value = 0
    class Class
      let mutable value = 1
      def f()
        value *= 2
        value
    let c = Class()
    expect(c.f()).to.equal 2
    expect(c.f()).to.equal 4
    expect(c.f()).to.equal 8
