let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "do", #
  it "preserves this", #(cb)
    let self = this
    do
      expect(this).to.equal self
      cb()
  
  it "shadows variables", #
    let alpha = \bravo
    let charlie = \delta
    expect(charlie).to.equal \delta
    do
      let charlie = \echo
      expect(alpha).to.equal \bravo
      expect(charlie).to.equal \echo
    expect(charlie).to.equal \delta
  
  it "can have a local passed in", #
    let get-value = stub().returns \alpha
    do x = get-value()
      expect(x).to.equal \alpha
    expect(get-value).to.be.called-once
  
  it "can have multiple locals passed in", #
    let get-value-1 = stub().returns \alpha
    let get-value-2 = stub().returns \bravo
    let get-value-3 = stub().returns \charlie
    do x = get-value-1(), y = get-value-2(), z = get-value-3()
      expect(x).to.equal \alpha
      expect(y).to.equal \bravo
      expect(z).to.equal \charlie
    expect(get-value-1).to.be.called-once
    expect(get-value-2).to.be.called-once
    expect(get-value-3).to.be.called-once
  
  it "can be used as an expression", #
    let alpha = \bravo
    let charlie = do
      let delta = \echo
      alpha & delta
    expect(charlie).to.equal "bravoecho"
