let {expect} = require 'chai'
let {stub, spy} = require 'sinon'

describe "cascades", #
  describe "can work on an ident", #
    it "single-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let x = obj..alpha(\charlie)..bravo(\delta)
    
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "single-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let x = obj..alpha \charlie ..bravo \delta
    
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let x = obj
        ..alpha(\charlie)
        ..bravo(\delta)
    
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let x = obj
        ..alpha \charlie
        ..bravo \delta
    
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
  describe "can work on an expression", #
    it "single-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().returns obj
      let x = get-obj()..alpha(\charlie)..bravo(\delta)
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "single-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().returns obj
      let x = get-obj()..alpha \charlie ..bravo \delta
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().returns obj
      let x = get-obj()
        ..alpha(\charlie)
        ..bravo(\delta)
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().returns obj
      let x = get-obj()
        ..alpha \charlie
        ..bravo \delta
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
  describe "can work on an invocation with argument", #
    it "single-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().with-args(\echo).returns obj
      let x = get-obj(\echo)..alpha(\charlie)..bravo(\delta)
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "single-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().with-args(\echo).returns obj
      let x = get-obj \echo ..alpha \charlie ..bravo \delta
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line with paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().with-args(\echo).returns obj
      let x = get-obj(\echo)
        ..alpha(\charlie)
        ..bravo(\delta)
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
    it "multi-line without paren-wrapping", #
      let obj = {
        alpha: spy().with-args(\charlie)
        bravo: spy().with-args(\delta)
      }
      let get-obj = stub().with-args(\echo).returns obj
      let x = get-obj \echo
        ..alpha \charlie
        ..bravo \delta
    
      expect(get-obj).to.be.called-once
      expect(x).to.equal obj
      expect(obj.alpha.with-args(\charlie)).to.be.called-once
      expect(obj.bravo.with-args(\delta)).to.be.called-once
  
  it "can contain an assignment", #
    let obj = {}
    let x = obj
      ..alpha := \bravo
      ..charlie := \delta
    
    expect(x).to.equal obj
    expect(x.alpha).to.equal \bravo
    expect(x.charlie).to.equal \delta
  
  it "can have multiple levels", #
    let delta = {}
    let obj = {
      alpha: {
        bravo: spy().with-args(\charlie)
        delta: stub().with-args(\echo).returns delta
      }
      foxtrot: spy().with-args(\golf)
    }
    let get-obj = stub().returns obj
    
    let x = get-obj()
      ..alpha
        ..bravo \charlie
        ..hotel := \india
        ..delta \echo
          ..lima := \mike
      ..foxtrot \golf
      ..juliet := \kilo
    
    expect(x).to.equal obj
    expect(x.juliet).to.equal \kilo
    expect(x.alpha.hotel).to.equal \india
    expect(obj.alpha.bravo.with-args(\charlie)).to.be.called-once
    expect(obj.alpha.delta.with-args(\echo)).to.be.called-once
    expect(obj.foxtrot.with-args(\golf)).to.be.called-once
    expect(delta.lima).to.equal \mike
