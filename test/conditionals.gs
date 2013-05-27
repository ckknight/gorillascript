let {expect} = require 'chai'
let {stub} = require 'sinon'
let gorilla = require('../index')

describe "if statement", #
  it "should not enter any bodies with falsy tests", #
    let x = false
    let bad = stub()
    let good = stub()
    if x
      bad()
    else if x
      bad()
    else
      good()
    expect(bad).to.not.be.called
    expect(good).to.be.called-once
  
  it "should enter the first body with a truthy test", #
    let x = true
    let bad = stub()
    let good = stub()
    if x
      good()
    else if x
      bad()
    else
      bad()
    expect(bad).to.not.be.called
    expect(good).to.be.called-once
  
  it "should handle logical operators in tests", #
    let f = false
    let t = true
    let bad = stub()
    let good = stub()
    if f and t
      bad()
    else if t and f
      bad()
    else if f or t
      good()
    else
      bad()
    expect(bad).to.not.be.called
    expect(good).to.be.called-once
  
  it "should handle variables in inner scopes", #
    let check(test)
      if test
        let y = 5
        expect(y).to.equal 5
        y
      else
        let z = 6
        expect(z).to.equal 6
        z
    expect(check true).to.equal 5
    expect(check false).to.equal 6
  
  it "should handle a complex return from an if expression", #
    let check(test, value)
      let result = if test
        let x = value
        x * x
      else
        let x = value
        x * 2
      result
    
    expect(check true, 5).to.equal 25
    expect(check true, 6).to.equal 36
    expect(check false, 5).to.equal 10
    expect(check false, 6).to.equal 12

describe "unless statement", #
  it "should not enter any bodies with truthy tests", #
    let x = true
    let bad = stub()
    let good = stub()
    unless x
      bad()
    else unless x
      bad()
    else
      good()
    expect(bad).to.not.be.called
    expect(good).to.be.called-once
  
  it "should enter the first body with a falsy test", #
    let x = false
    let bad = stub()
    let good = stub()
    unless x
      good()
    else unless x
      bad()
    else
      bad()
    expect(bad).to.not.be.called
    expect(good).to.be.called-once

describe "single-line", #
  let fail() -> throw Error "never reached"
  it "should work with 'then' syntax", #
    let obj = {}
    let f = false
    let t = true
    expect(if f then fail() else obj).to.equal obj
    expect(unless t then fail() else obj).to.equal obj
  
  it "should with with semicolon syntax", #
    let f = false
    let t = true
    let obj = {}
    let x = if f;fail()
    else;obj
    expect(x).to.equal(obj)
    let y = unless t;fail()
    else;obj
    expect(y).to.equal(obj)

describe "if statement shouldn't use ternary", #
  it "with a normal if", #
    expect(gorilla.compile-sync("""
    if Math then String else Object end""", bare: true).code).not.to.match r"\?"
  
  it "with a return if", #
    expect(gorilla.compile-sync("""
    return if Math then String else Object end""", bare: true).code).not.to.match r"\?"
  
  it "with a let if", #
    expect(gorilla.compile-sync("""
    let x = if Math then String else Object end""", bare: true).code).not.to.match r"\?"

describe "many conditionals in an inline expression", #
  it "should work", #
    let fun(a, b, c, d, e, f, g, h, i)
      expect(if (if a() then b() else c())
        if d() then e() else f()
      else
        if g() then h() else i()).to.be.true
  
    let no = #-> false
    let yes = #-> true
    let fail = #-> throw Error()
  
    fun(no, fail, no, fail, fail, fail, no, fail, yes)
    fun(yes, yes, fail, yes, yes, fail, fail, fail, fail)

describe "returnif", #
  it "should return the same value if truthy", #
    let otherwise = {}
    let f(get-value)
      returnif get-value()
      otherwise

    let obj = {}
    expect(f #-> obj).to.equal obj
    expect(f #-> true).to.be.true
    expect(f #-> 0).to.equal otherwise
    expect(f #-> false).to.equal otherwise
  
  it "should return true if working with a known boolean", #
    let otherwise = {}
    let f(x)
      returnif x == "yes"
      otherwise

    expect(f "no").to.equal otherwise
    expect(f "yes").to.be.true

describe "returnunless", #
  it "should return the same value if falsy", #
    let otherwise = {}
    let f(get-value)
      returnunless get-value()
      otherwise

    let obj = {}
    expect(f #-> obj).to.equal otherwise
    expect(f #-> true).to.equal otherwise
    expect(f #-> 0).to.equal 0
    expect(f #-> false).to.be.false
  
  it "should return false if working with a known boolean", #
    let otherwise = {}
    let f(x)
      returnunless x == "yes"
      otherwise

    expect(f "no").to.be.false
    expect(f "yes").to.equal otherwise
