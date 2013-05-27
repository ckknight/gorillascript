let {expect} = require 'chai'

describe "labels", #
  it "works with blocks", #
    let f(should-break)
      let mutable x = 0b0000
      label! blah
        x bitor= 0b01
        if should-break
          break blah
        x bitor= 0b10
      x

    expect(f(false)).to.equal 0b11
    expect(f(true)).to.equal 0b01

  it "works with if statements", #
    let f(test, should-break)
      let mutable x = 0b0000
      label! blah if test
        x bitor= 0b0001
        if should-break
          break blah
        x bitor= 0b0010
      else
        x bitor= 0b0100
        if should-break
          break blah
        x bitor= 0b1000
      x
  
    expect(f(true, true)).to.equal 0b0001
    expect(f(true, false)).to.equal 0b0011
    expect(f(false, true)).to.equal 0b0100
    expect(f(false, false)).to.equal 0b1100

  it "works with switch statements", #
    let f(topic, should-break)
      let mutable x = 0b0000
      label! blah switch topic
      case true
        x bitor= 0b0001
        if should-break
          break blah
        x bitor= 0b0010
      case false
        x bitor= 0b0100
        if should-break
          break blah
        x bitor= 0b1000
      x
  
    expect(f(true, true)).to.equal 0b0001
    expect(f(true, false)).to.equal 0b0011
    expect(f(false, true)).to.equal 0b0100
    expect(f(false, false)).to.equal 0b1100
  
  it "works with while statements", #
    let mutable sum = 0
    let mutable i = 0
    label! blah while i < 10, i += 1
      if i %% 2
        continue blah
      else if i > 7
        break blah
      sum bitor= 2^i
  
    expect(sum).to.equal 0b10101010

  it "works with for-in loop statements", #
    let result = []
    label! blah for x in [\a, \b, \c, \d, \e, \f]
      if x == \c
        continue blah
      else if x == \e
        break blah
      result.push x
    expect(result).to.eql [\a, \b, \d]

  it "works with for-of loop statements", #
    let result = []
    label! blah for x of {\a, \b, \c, \d, \e, \f}
      if x == \c
        continue blah
      result.push x
    result.sort()
    expect(result).to.eql [\a, \b, \d, \e, \f]

  it "works with try-catch statements", #
    let f(should-break)
      let err = {}
      let mutable result = 0
      label! blah try
        result bitor= 0b001
        if should-break
          break blah
        result bitor= 0b010
        throw err
      catch e
        expect(e).to.equal err
        result bitor= 0b100
      result
  
    expect(f(true)).to.equal 0b001
    expect(f(false)).to.equal 0b111

  it "works with try-finally statements", #
    let f(should-break)
      let err = {}
      let mutable result = 0
      try
        label! blah try
          result bitor= 0b0001
          if should-break
            break blah
          result bitor= 0b0010
          throw err
        finally
          result bitor= 0b0100
      catch e
        expect(e).to.equal err
        result bitor= 0b1000
      result
  
    expect(f(true)).to.equal 0b0101
    expect(f(false)).to.equal 0b1111

  it "works with nested loops", #
    let mutable sum = 0
    label! blah for i in 1 to 10
      for j in 1 to 10
        if i == j
          continue blah
        sum += j
    expect(sum).to.equal 165

  it "can break an outer loop", #
    let mutable sum = 0
    label! blah for i in 1 to 10
      for j in 1 to 10
        if i > 5 and j == i
          break blah
        sum += j
    expect(sum).to.equal 290
