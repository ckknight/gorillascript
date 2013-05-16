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
  
  it "can have an enum whose name includes this", #
    let obj = {}
    with obj
      expect(this).to.equal obj
      let e = enum this.Enum
        def Alpha
        def Bravo
        def Charlie

        this.thing := #-> "blah"
      expect(this).to.equal obj
      expect(obj.Enum).to.equal e
    expect(obj.Enum.Alpha).to.equal 1
    expect(obj.Enum.Bravo).to.equal 2
    expect(obj.Enum.Charlie).to.equal 3
    expect(obj.Enum.thing()).to.equal "blah"
