let {expect} = require 'chai'
let gorilla = require '../index'

describe "regular expressions", #
  it "can be single-quoted", #
    expect(r'a').to.be.an.instanceof(RegExp)
    expect("a".match(r'a')).to.be.an('array')
    expect("a".match(r'a'g)).to.be.an('array')
    expect(r'a'.test("a")).to.be.true
    expect(r'a'g.test("a")).to.be.true
  
  it "can be double-quoted", #
    expect(r"a").to.be.an.instanceof(RegExp)
    expect("a".match(r"a")).to.be.an('array')
    expect("a".match(r"a"g)).to.be.an('array')
    expect(r"a".test("a")).to.be.true
    expect(r"a"g.test("a")).to.be.true
  
  it "should be indexable", #
    expect(r"0".source).to.equal "0"
    expect(r"$(0)".source).to.equal "0"
    expect(r'0'.source).to.equal "0"
    expect(r'$(0)'.source).to.equal '$(0)'
    expect(r"0"[\source]).to.equal "0"
    expect(r"$(0)"[\source]).to.equal "0"
    expect(r'0'[\source]).to.equal "0"
    expect(r'$(0)'[\source]).to.equal '$(0)'
  
  it "should have expected flags set", #
    expect(r"asdf"g.global).to.be.true
    expect(r"asdf"g.ignore-case).to.be.false
    expect(r"asdf"g.multiline).to.be.false
    expect(r"asdf"i.global).to.be.false
    expect(r"asdf"i.ignore-case).to.be.true
    expect(r"asdf"i.multiline).to.be.false
    expect(r"asdf"m.global).to.be.false
    expect(r"asdf"m.ignore-case).to.be.false
    expect(r"asdf"m.multiline).to.be.true
    expect(r"asdf"gim.global).to.be.true
    expect(r"asdf"gim.ignore-case).to.be.true
    expect(r"asdf"gim.multiline).to.be.true
  
  it "should allow slashes", #
    expect(r'^a/b$'.test "a/b").to.be.true
    expect(r"^a/b\$".test "a/b").to.be.true
    expect(r"^a\/b\$".test "a/b").to.be.true
    expect(r"^a\\/b\$".test "a\\/b").to.be.true
    expect(r"^a\\\/b\$".test "a\\/b").to.be.true
  
  it "will properly escape backslashes", #
    expect(r"\\".source).to.equal "\\\\"
  
  it "will ignore whitespace and comments in triple-quoted string", #
    expect(r"""
    I
      have # and this is a comment
        no # and another comment
          whitespace""".source).to.equal "Ihavenowhitespace"
  
    expect(r'''
    I
      have # and this is a comment
        no # and another comment
          whitespace'''.source).to.equal "Ihavenowhitespace"
  
  it "can have interpolation when triple-double-quoted", #
    let value = "bravo"
    expect(r"""
    alpha
    $value # previously, that was a value.
    charlie
    """.source).to.equal "alphabravocharlie"
  
  it "doesn't interpolate when triple-single-quoted", #
    let value = "bravo"
    expect(r'''
    alpha
    $value # previously, that was a value.
    charlie
    '''.source).to.equal 'alpha$valuecharlie'
  
  it "allows for empty regex", #
    let regex = r""
    
    let match = regex.exec "test"
    expect(regex.exec "test")
      .to.be.ok
      .and.have.property(0).that.equal ""
  
  it "throws an exception if the regex is improper", #
    expect(#-> gorilla.compile-sync """let x = 0
    let y = r'+'""").throws(gorilla.ParserError, r'Invalid regular expression.*?\b2:\d+')
    
    expect(#-> gorilla.compile-sync """let x = 0
    let y = r'x'gg""").throws(gorilla.ParserError, r'Invalid regular expression.*?\b2:\d+')
    
    expect(#-> gorilla.compile-sync """let x = 0
    let y = r'x'q""").throws(gorilla.ParserError, r'Invalid regular expression.*?\b2:\d+')
  
  it "allows the sticky flag", #
    expect(gorilla.compile-sync("let y = r'x'y")).to.be.ok
