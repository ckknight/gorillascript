let {expect} = require 'chai'

describe "returning", #
  it "returns without any other statements", #
    let obj = {}
    let f()
      returning obj
  
    expect(f()).to.equal obj
  
  it "returns a specific value given other statements", #
    let obj = {}
    let f()
      returning obj
      true
    
    expect(f()).to.equal obj
  
  it "is co-opted by a trailing return", #
    let f()
      returning false
      return true
    
    expect(f()).to.be.true
  
  it "plays nicely with async statement", #
    let obj = {}
    let fake-async(cb)
      cb()
    let f()
      returning obj
      async <- fake-async()
      true
    
    expect(f()).to.equal obj
