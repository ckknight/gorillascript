let {expect} = require 'chai'

describe "WeakMap", #
  it "should handle mutable object keys", #
    let wm = WeakMap()
    let obj = {}
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false
    wm.set obj, "hello"
    expect(wm.get obj).to.equal "hello"
    expect(wm.has obj).to.be.true
    wm.set obj, "there"
    expect(wm.get obj).to.equal "there"
    expect(wm.has obj).to.be.true
    wm.delete obj
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false

  let has-frozen = is-function! Object.freeze and is-function! Object.is-frozen and Object.is-frozen(Object.freeze({}))
  it "should handle frozen keys", #
    let wm = WeakMap()
    let obj = Object.freeze {}
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false
    wm.set obj, "hello"
    expect(wm.get obj).to.equal "hello"
    expect(wm.has obj).to.be.true
    wm.set obj, "there"
    expect(wm.get obj).to.equal "there"
    expect(wm.has obj).to.be.true
    wm.delete obj
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false
  
  it "should handle keys which are frozen after placed into WeakMap", #
    let wm = WeakMap()
    let obj = Object.freeze {}
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false
    wm.set obj, "hello"
    expect(wm.get obj).to.equal "hello"
    expect(wm.has obj).to.be.true
    Object.freeze obj
    wm.set obj, "there"
    expect(wm.get obj).to.equal "there"
    expect(wm.has obj).to.be.true
    wm.delete obj
    expect(wm.get obj).to.be.undefined
    expect(wm.has obj).to.be.false
