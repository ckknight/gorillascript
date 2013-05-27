let {expect} = require 'chai'

describe "literals", #
  it "include true", #
    expect(true).to.be.true
  
  it "include false", #
    expect(false).to.be.false
  
  it "can be directly indexed", #
    expect(true.to-string).to.equal Boolean::to-string
    expect(false.to-string).to.equal Boolean::to-string
    expect(true[\to-string]).to.equal Boolean::to-string
    expect(false[\to-string]).to.equal Boolean::to-string
