let {expect} = require 'chai'
let gorilla = require('../index')

const unfalse = true
const untrue = false
const CONST_OBJECT = { alpha: 1, bravo: 2 }
const CONST_ARRAY = [\alpha, \bravo, \charlie]
const CONST_STRING = "hello"

describe "consts", #
  it "work from the top scope", #
    expect(unfalse).to.be.true
    expect(untrue).to.be.false
  
  it "converts directly to constant value", #
    let make-code(debug-value)
      gorilla.compile-sync("""
      const DEBUG = $debug-value
    
      if DEBUG
        throw Error "EVIL"
      else
        hello()
      """).code
    
    expect(make-code("false")).to.contain "hello"
    expect(make-code("false")).to.not.contain "EVIL"
    expect(make-code("true")).to.not.contain "hello"
    expect(make-code("true")).to.contain "EVIL"
  
  it "can exist in a lower scope", #
    let f()
      const MY_CONST = 5
      MY_CONST + 5
    expect(f()).to.equal 10
    expect(typeof MY_CONST).to.equal \undefined
  
  it "can shadow a higher-scoped variable", #
    let MY_VALUE = 0
    let f()
      const MY_VALUE = 5
      MY_VALUE + 5
    expect(f()).to.equal 10
    expect(MY_VALUE).to.equal 0
  
  it "can be redefined", #
    const DEBUG = false
    expect(DEBUG).to.be.false
    const DEBUG = true
    expect(DEBUG).to.be.true
  
  it "can be redefined in a lower scope", #
    const DEBUG = false
    expect(DEBUG).to.be.false
    let f()
      const DEBUG = true
      DEBUG
    expect(f()).to.be.true
    expect(DEBUG).to.be.false
  
  it "is accessed dynamically within a macro's AST", #
    const DEBUG = false
    macro get-debug()
      ASTE DEBUG
    expect(get-debug()).to.be.false
    let f()
      const DEBUG = true
      get-debug()
    expect(f()).to.be.true

describe "object consts", #
  it "work from the top scope", #
    expect(CONST_OBJECT.alpha).to.equal 1
    expect(CONST_OBJECT.bravo).to.equal 2
  
  it "converts directly to a constant value when accessing a const object's key", #
    let make-code(key)
      gorilla.compile-sync("""
      const VALUES = { alpha: 1, bravo: 2, charlie: 3 }
      
      let value = VALUES.$key
      """).code
    
    expect(make-code("alpha")).to.not.contain "alpha"
    expect(make-code("bravo")).to.not.contain "bravo"
    expect(make-code("charlie")).to.not.contain "charlie"

describe "array consts", #
  it "work from the top scope", #
    expect(CONST_ARRAY[0]).to.equal \alpha
    expect(CONST_ARRAY[1]).to.equal \bravo
    expect(CONST_ARRAY[2]).to.equal \charlie
    expect(CONST_ARRAY.length).to.equal 3
  
  it "converts directly to a constant value when accessing a const array's key", #
    let make-code(key)
      gorilla.compile-sync("""
      const VALUES = ["alpha", "bravo", "charlie"]
      
      let value = VALUES.$key
      """).code
    
    expect(make-code(0)).to.contain "alpha"
    expect(make-code(1)).to.contain "bravo"
    expect(make-code(2)).to.contain "charlie"
    expect(make-code("length")).to.contain "3"

describe "string consts", #
  it "can be used in a concat expression", #
    expect(CONST_STRING & ", world").to.equal "hello, world"

  it "can be interpolated with parentheses", #
    expect("$(CONST_STRING), world").to.equal "hello, world"

  it "can be interpolated without parentheses", #
    expect("$CONST_STRING, world").to.equal "hello, world"
