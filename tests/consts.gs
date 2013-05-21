const unfalse = true
const untrue = false

describe "consts", #
  it "work from the top scope", #
    expect(unfalse).to.be.true
    expect(untrue).to.be.false
  
  it "converts directly to constant value", #
    let make-code(debug-value)
      gorilla.compile("""
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
