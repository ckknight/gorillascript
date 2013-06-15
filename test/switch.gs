let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "switch", #
  it "works as the return value if the last statement", #
    let run(num)
      switch num
      // comment
      case 1; "one"
      case 2
        "two"
      // another comment, why not?
      case "a"
        "eh"
    
    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"
  
  it "fallsthrough to the next case if fallthrough is detected", #
    let run(num)
      switch num
      case 1; "one"
      case 2
        fallthrough
      case 3
        "two or three"
      case "a"
        "eh"
  
    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two or three"
    expect(run 3).to.equal "two or three"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"
  
  it "will execute code before falling through", #
    let run(num)
      let mutable found-two = false
      switch num
      case 1; "one"
      case 2
        found-two := true
        fallthrough
      case 3
        if found-two
          "two"
        else
          "three"
      case "a"
        "eh"
  
    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run 3).to.equal "three"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"
  
  it "will execute the default block if no case reached", #
    let run(num)
      switch num
      case 1; "one"
      case 2
        "two"
      case "a"
        "eh"
      default
        "unknown"
  
    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run "a").to.equal "eh"
    expect(run "other").to.equal "unknown"

  it "can support multiple case values at once", #
    let run(num)
      switch num
      case 1, 2, 3; "one, two, or three"
      case 4, 5, 6
        "four, five, or six"
      default; "other"

    expect(run 1).to.equal "one, two, or three"
    expect(run 2).to.equal "one, two, or three"
    expect(run 3).to.equal "one, two, or three"

    expect(run 4).to.equal "four, five, or six"
    expect(run 5).to.equal "four, five, or six"
    expect(run 6).to.equal "four, five, or six"

    expect(run 0).to.equal "other"

  it "can be used as an expression", #
    let run(num)
      let result = switch num
      case 1; "one"
      case 2
        "two"
      result

    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(#-> run 3).throws Error, r"Unhandled value in switch"

  it "allows non-const case nodes, stopping on the first equal value", #
    let f = stub().returns 1
    let ran = stub()
    switch 1
    case f()
      ran()
      fallthrough
    case f()
      ran()
    case f()
      throw Error "never reached"
    case f()
      throw Error "never reached"
    case f(), f(), f(), f()
      throw Error "never reached"
    expect(f).to.be.called-once
    expect(ran).to.be.called-twice

  it "should not fallthrough in a case where a return is present but not guaranteed", #
    let mutable value = 1
    switch true
    case true
      if not value
        return 5
    default
      value := 2
    expect(value).to.equal 1

  it "should have this and arguments available in the cases when an implicit closure is made", #
    let fun(value)
      let result = switch value
      case "this"
        this
      //case "arguments"
      //  arguments
      result

    let obj = {}
    expect(fun.call(obj, "this")).to.equal obj
    //arrayEq ["arguments"], fun("arguments")[:]
    //arrayEq ["arguments", "alpha", "bravo", "charlie"], fun("arguments", "alpha", "bravo", "charlie")[:]
    expect(#-> fun.call(obj, "other")).throws Error, r"Unhandled value in switch"
  
  it "should have this and arguments available in the case checks when an implicit closure is made", #
    let fun(value)
      let result = switch value
      case this.value
        "this"
      //case arguments[1]
      //  "arguments"
      default
        "other"
      result

    expect(fun.call({value: "alpha"}, "alpha")).to.equal "this"
    //expect(fun.call({}, "bravo", "bravo")).to.equal "arguments"
    expect(fun.call({}, "bravo", "charlie")).to.equal "other"

  it "should have this available in the value check when an implicit closure is made", #
    let fun()
      let result = switch this.value
      case 1
        "one"
      case 2
        "two"
      result

    expect(fun.call({ value: 1 })).to.equal "one"
    expect(fun.call({ value: 2 })).to.equal "two"
    expect(#-> fun.call({ value: 3 })).throws Error, r"Unhandled value in switch"

  /*
  it "should have arguments available in the value check when an implicit closure is made", #
    let fun()
      let result = switch arguments[0]
      case 1
        "one"
      case 2
        "two"
      result

    expect(fun(1)).to.equal "one"
    expect(fun(2)).to.equal "two"
  */

  /*
  it "should break out of a while loop using break", #
    let mutable i = 0
    while i < 100, i += 1
      switch i
      case 10
        break
    expect(i).to.equal 10
  */

  it "should not allow inner loops to break out of the switch without labels", #
    let fun(value)
      switch value
      case 1
        let mutable i = 0
        while i < 100, i += 1
          if i == 10
            break
        i

    expect(fun(1)).to.equal 10
  
  it "should allow return statements within switch", #
    let fun(value)
      switch value
      case 0
        return \zero
      case 1
        return \one
      default
        void
      return \other
    expect(fun(0)).to.equal \zero
    expect(fun(1)).to.equal \one
    expect(fun(2)).to.equal \other
  
  it "should allow return statements within switch as the last statement", #
    let fun(value)
      switch value
      case 0
        return \zero
      case 1
        return \one
      default
        return \other
    expect(fun(0)).to.equal \zero
    expect(fun(1)).to.equal \one
    expect(fun(2)).to.equal \other

describe "topicless switch", #
  it "works", #
    let run(num)
      switch
      // comment
      case num == 1; "one"
      case num == 2
        "two"
      // another comment, why not?
      case num == "a"
        "eh"

    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"

  it "works with fallthrough", #
    let run(num)
      switch
      case num == 1; "one"
      case num == 2
        fallthrough
      case num == 3
        "two or three"
      case num == "a"
        "eh"

    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two or three"
    expect(run 3).to.equal "two or three"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"

  it "works with fallthrough and body", #
    let run(num)
      let mutable found-two = false
      switch
      case num == 1; "one"
      case num == 2
        found-two := true
        fallthrough
      case num == 3
        if found-two
          "two"
        else
          "three"
      case num == "a"
        "eh"

    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run 3).to.equal "three"
    expect(run "a").to.equal "eh"
    expect(#-> run "other").throws Error, r"Unhandled value in switch"

  it "works with default case", #
    let run(num)
      switch
      case num == 1; "one"
      case num == 2
        "two"
      case num == "a"
        "eh"
      default
        "unknown"

    expect(run 1).to.equal "one"
    expect(run 2).to.equal "two"
    expect(run "a").to.equal "eh"
    expect(run "other").to.equal "unknown"
