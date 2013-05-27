let {expect} = require 'chai'
let gorilla = require('../index')

describe "newlines", #
  let code = """
  class Hello
    def constructor(@name) ->
    def print()
      console.log "Hello, \$name!"
  """
  it "should normally use \\n", #
    expect(gorilla.compile-sync(code).code).to.not.match r"\r"
  
  it "should not have newlines if minified", #
    expect(gorilla.compile-sync(code, minify: true).code).to.not.match r"[\r\n]"
  
  it "should use a custom linefeed if requested", #
    expect(gorilla.compile-sync(code, linefeed: "\r").code).to.not.match r"\n"
    let windows = gorilla.compile-sync(code, linefeed: "\r\n").code
    expect(windows).to.not.match r"\r(?!\n)"
    expect(windows.replace(r"\r\n"g, ";")).to.not.match r"[\r\n]"
