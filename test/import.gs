import 'imported.gs'

let {expect} = require 'chai'

describe "importing from another file", #
  it "should make macros defined in the other file usable", #
    expect(hello()).to.equal "Hello!"
  
  it "should make consts defined in the other file accessible", #
    expect(MY_CONST).to.equal "some value"