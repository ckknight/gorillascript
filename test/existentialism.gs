let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "return?", #
  describe "on an ident", #
    let fun(value)
      return? value
      "none"
  
    it "should return if the value exists", #
      expect(fun true).to.be.true
      expect(fun false).to.be.false
      expect(fun 0).to.equal 0
  
    it "should not return if the value does not exist", #
      expect(fun null).to.equal "none"
      expect(fun void).to.equal "none"
  
  it "only execute expression once", #
    let fun(callback)
      return? callback()
      "nope"
    
    let alpha = stub().returns "alpha"
    expect(fun alpha).to.equal "alpha"
    expect(alpha).to.be.called-once
    let ret-null = stub().returns null
    expect(fun ret-null).to.equal "nope"
    expect(alpha).to.be.called-once

describe "existential access", #
  describe "on an ident", #
    let get(obj) -> obj?.key
    
    it "returns void if parent does not exist", #
      expect(get()).to.be.undefined
      expect(get(void)).to.be.undefined
      expect(get(null)).to.be.undefined
    
    it "returns the key if the parent exists", #
      expect(get({})).to.be.undefined
      expect(get({key: "value"})).to.equal "value"
  
  describe "where parent is a call", #
    let get(obj) -> obj()?.key
    
    it "only calculates parent once", #
      let ret-void = stub().returns void
      expect(get(ret-void)).to.be.undefined
      expect(ret-void).to.be.called-once
      
      let ret-obj = stub().returns {key: "value"}
      expect(get(ret-obj)).to.equal "value"
      expect(ret-obj).to.be.called-once
  
  describe "where child is a call", #
    let get(obj, key) -> obj?[key()]
    
    it "where parent exists, only calculates key once", #
      let key = stub().returns \key
      expect(get {key: "value"}, key).to.equal "value"
      expect(key).to.be.called-once
    
    it "where parent does not exist, never calculates key", #
      let key = stub().returns \key
      expect(get null, key).to.be.undefined
      expect(key).to.not.be.called

  describe "with trailing normal access", #
    let get(obj) -> obj?.alpha.bravo
    
    it "traverses the path if parent exists", #
      expect(get {alpha: {bravo: "charlie"}}).to.equal "charlie"
      expect(get {alpha: {}}).to.be.undefined
      
    it "returns void if the parent does not exist", #
      expect(get()).to.be.undefined
      expect(get void).to.be.undefined
      expect(get null).to.be.undefined
    
    it "errors if the parent exists but the initial child does not", #
      expect(#-> get({})).throws(TypeError)
  
  describe "where child is called as a method", #
    let get(obj) -> obj?.method()
    
    it "return void if the parent does not exist", #
      expect(get()).to.be.undefined
      expect(get void).to.be.undefined
      expect(get null).to.be.undefined
    
    it "calls the method if the parent exists", #
      let obj = {
        method: #
          expect(this).to.equal obj
          "value"
      }
      expect(get obj).to.equal "value"

describe "existential invocation", #
  describe "on an ident", #
    let call(f) -> f?()
    
    it "returns void if func is not a function", #
      expect(call()).to.be.undefined
      expect(call null).to.be.undefined
      expect(call void).to.be.undefined
      expect(call {}).to.be.undefined
      expect(call []).to.be.undefined
      expect(call 0).to.be.undefined
    
    it "calls the func if it is a function", #
      let fun = stub().returns "value"
      expect(call(fun)).to.equal "value"
      expect(fun).to.be.called-once
  
  describe "on a method", #
    let call(x) -> x.f?()
    
    it "errors if the parent does not exist", #
      expect(#-> call()).throws(TypeError)
    
    it "returns void if method is not a function", #
      expect(call({})).to.be.undefined
      expect(call({f: {}})).to.be.undefined
    
    it "calls the method if it is a function", #
      let obj = {
        f: #
          expect(this).to.equal obj
          "value"
      }
      expect(call(obj)).to.equal "value"
  
  describe "on a method with a callback as the key", #
    let call(x, k) -> x[k()]?()
    
    it "errors if the parent does not exist", #
      expect(#-> call(null, #-> \k)).throws(TypeError)
    
    it "returns void if method is not a function", #
      expect(call({}, #-> \k)).to.be.undefined
      expect(call({k: {}}, #-> \k)).to.be.undefined
    
    it "calls the method if it is a function", #
      let obj = {
        key: #
          expect(this).to.equal obj
          "value"
      }
      let get-key = stub().returns \key
      expect(call(obj, get-key)).to.equal "value"
      expect(get-key).to.be.called-once
  
  describe "called with new", #
    describe "on an ident", #
      let call(func) -> new func?()
      
      it "returns void if func is not a function", #
        expect(call()).to.be.undefined
        expect(call null).to.be.undefined
        expect(call void).to.be.undefined
        expect(call {}).to.be.undefined
        expect(call []).to.be.undefined
        expect(call 0).to.be.undefined

      it "calls the func with new if it is a function", #
        let ran = stub()
        let Class()!
          expect(this).to.be.instanceof(Class)
          ran()
        expect(call(Class)).to.be.instanceof(Class)
        expect(ran).to.be.called-once
    
    describe "on a member", #
      let call(obj) -> new obj.func?()
      
      it "errors if obj does not exist", #
        expect(#-> call()).throws(TypeError)
        expect(#-> call null).throws(TypeError)
        expect(#-> call void).throws(TypeError)
      
      it "returns void if func is not a function", #
        expect(call {}).to.be.undefined
        expect(call {func: {}}).to.be.undefined

      it "calls the func with new if it is a function", #
        let ran = stub()
        let Class()!
          expect(this).to.be.instanceof(Class)
          ran()
        let obj = {func: Class}
        expect(call(obj)).to.be.instanceof(Class)
        expect(ran).to.be.called-once
    
    describe "on the parent of an access", #
      let call(obj) -> new obj?.func()
      
      it "returns void if parent does not exist", #
        expect(call()).to.be.undefined
        expect(call null).to.be.undefined
        expect(call void).to.be.undefined
      
      it "errors if parent exists and func is not a function", #
        expect(#-> call({})).throws(TypeError)
        expect(#-> call({func: {}})).throws(TypeError)
      
      it "calls the func with new if it is a function", #
        let ran = stub()
        let Class()!
          expect(this).to.be.instanceof(Class)
          ran()
        let obj = {func: Class}
        expect(call(obj)).to.be.instanceof(Class)
        expect(ran).to.be.called-once

describe "deep existential access", #
  let fun(a, b, c, d) -> a()?[b()]?[c()]?[d()]?()
  let handle(a, b, c, d)
    let a-stub = stub().returns a
    let b-stub = stub().returns b
    let c-stub = stub().returns c
    let d-stub = if not is-function! d then stub().returns d
    let result = fun(a-stub, b-stub, c-stub, d-stub or d)
    expect(a-stub).to.be.called-once
    expect(b-stub).to.be.called-once
    expect(c-stub).to.be.called-once
    if d-stub
      expect(d-stub).to.be.called-once
    result
  
  it "works in the best-case", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \y, \z).to.equal "hello"
  
  it "returns void if not a function", #
    expect(handle {
      x: {
        y: {
          z: "hello"
        }
      }
    }, \x, \y, \z).to.be.undefined
  
  it "returns void if last key not found", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \y, \w).to.be.undefined
  
  it "does not execute the last key if failed before then", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \w, #-> throw Error("never reached")).to.be.undefined

describe "deep existential access with an or on the end", #
  let fun(a, b, c, d, e) -> a()?[b()]?[c()]?[d()]?() or e()
  let handle(a, b, c, d, e)
    let a-stub = stub().returns a
    let b-stub = stub().returns b
    let c-stub = stub().returns c
    let d-stub = if not is-function! d then stub().returns d
    let e-stub = if not is-function! e then stub().returns e
    let result = fun(a-stub, b-stub, c-stub, d-stub or d, e-stub or e)
    expect(a-stub).to.be.called-once
    expect(b-stub).to.be.called-once
    expect(c-stub).to.be.called-once
    if d-stub
      expect(d-stub).to.be.called-once
    if e-stub
      expect(e-stub).to.be.called-once
    result
  
  it "works in the best-case", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \y, \z, #-> throw Error("never reached")).to.equal "hello"
  
  it "returns void if not a function", #
    expect(handle {
      x: {
        y: {
          z: "hello"
        }
      }
    }, \x, \y, \z, \nope).to.equal \nope
  
  it "returns void if last key not found", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \y, \w, \nope).to.equal \nope
  
  it "does not execute the last key if failed before then", #
    expect(handle {
      x: {
        y: {
          z: #-> "hello"
        }
      }
    }, \x, \w, #-> throw Error("never reached"), \nope).to.equal \nope

describe "existential prototype access", #
  let get(obj) -> obj?::key
  
  it "returns void if object does not exist", #
    expect(get()).to.be.undefined
    expect(get null).to.be.undefined
    expect(get void).to.be.undefined
  
  it "returns void if object has a prototype that does not exist", #
    expect(get {}).to.be.undefined
    expect(get {prototype:null}).to.be.undefined
    expect(get {prototype:void}).to.be.undefined
  
  it "returns the key if the object has a prototype which exists", #
    expect(get {prototype:{}}).to.be.undefined
    expect(get {prototype:{key:void}}).to.be.undefined
    expect(get {prototype:{key:null}}).to.be.null
    expect(get {prototype:{key:"hello"}}).to.equal "hello"

describe "postfix ? operator", #
  let check(obj) -> obj?
  
  it "returns false if the object does not exist", #
    expect(check()).to.be.false
    expect(check null).to.be.false
    expect(check void).to.be.false
  
  it "returns true if the object exists", #
    expect(check 0).to.be.true
    expect(check "").to.be.true
    expect(check false).to.be.true
    expect(check true).to.be.true
    expect(check {}).to.be.true
  
  it "works on a potentially unknown global", #
    expect(Math?).to.be.true
    expect(NonexistentGlobal?).to.be.false
    GLOBAL.NonexistentGlobal := true
    expect(NonexistentGlobal?).to.be.true
    delete GLOBAL.NonexistentGlobal

describe "binary ? operator", #
  let exist(x, y) -> x() ? y()
  
  it "returns the left-hand-side if it exists, never executing right", #
    let left = stub().returns "hello"
    expect(exist left, #-> throw Error "never reached").to.equal "hello"
    expect(left).to.be.called-once
  
  it "returns the right if the left does not exist", #
    let left = stub().returns null
    let obj = {}
    let right = stub().returns obj
    expect(exist left, right).to.equal obj
    expect(left).to.be.called-once
    expect(right).to.be.called-once

describe "?= assignment", #
  let exist-assign(mutable x, y) -> x ?= y()
  let exist-member-assign(x, y, z) -> x[y()] ?= z()
  
  describe "with ident", #
    it "if the left exists, never execute the right", #
      expect(exist-assign true, #-> throw Error "never reached").to.be.true
      expect(exist-assign 0, #-> throw Error "never reached").to.equal 0
    
    it "if the left does not exist, assign it to the right", #
      let obj = {}
      let right = stub().returns obj
      expect(exist-assign null, right).to.equal obj
      expect(right).to.be.called-once
  
  describe "with access", #
    it "if the left exists, return its value and do not execute the right", #
      let key = stub().returns \key
      let obj = {key: 0}
      expect(exist-member-assign obj, key, #-> throw Error "never reached").to.equal 0
      expect(key).to.be.called-once
      expect(obj).to.eql {key: 0}
    
    it "if the left does not exist, execute the right and assign it", #
      let key = stub().returns \key
      let obj = {key: null}
      let value = stub().returns "hello"
      expect(exist-member-assign obj, key, value).to.equal "hello"
      expect(key).to.be.called-once
      expect(obj).to.eql {key: "hello"}
