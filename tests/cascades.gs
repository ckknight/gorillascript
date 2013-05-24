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
  
  it "can contain an assignment", #
    let obj = {}
    let x = obj
      ..alpha := \bravo
      ..charlie := \delta
    
    expect(x).to.equal obj
    expect(x.alpha).to.equal \bravo
    expect(x.charlie).to.equal \delta