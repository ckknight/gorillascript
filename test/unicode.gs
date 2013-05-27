let {expect} = require 'chai'

describe "Unicode characters in source", #
  it "can be used as identifiers", #
    let µ = "mu"
    expect(µ).to.equal "mu"
  
  it "can be used as properties", #
    let x = { µ: "mu" }
    expect(x.µ).to.equal "mu"
