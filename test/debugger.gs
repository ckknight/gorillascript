describe "debugger", #
  it "can be used in a statement", #
    let f(x)
      if x
        debugger
    f(false)
  
  it "can be used as an expression", #
    let f(x)
      x and debugger
    f(false)
