let {expect} = require 'chai'

describe "with statement", #
  it "replaces this", #
    let obj = {}
    with obj
      expect(this).to.equal obj
  
  it "can be nested", #
    let obj = {}
    let other = {}
    with obj
      expect(this).to.equal obj
      with other
        expect(this).to.equal other
      expect(this).to.equal obj
  
  it "can have a class whose name includes this", #
    let obj = {}
    with obj  
      expect(this).to.equal obj
      let c = class this.Class
        def alpha() -> "bravo"
      expect(this).to.equal obj
      expect(obj.Class).to.equal c
    expect(new obj.Class().alpha()).to.equal "bravo"
