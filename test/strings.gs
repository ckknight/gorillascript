let {expect} = require 'chai'
let {spy} = require 'sinon'
let gorilla = require '../index'

let reverse(x as String) -> x.split("").reverse().join("")
let num-words(x as String) -> x.trim().split(r"\s+").length

describe "Double-quoted strings", #
  it "can be empty", #
    expect("").to.be.a(\string).and.be.empty
  
  it "has an expected length", #
    expect("hello").to.be.a(\string).to.have.length 5
  
  it "is the expected reverse value", #
    expect(reverse "hello").to.equal "olleh"
  
  it "retains // comments", #
    let value = "hello // there"
    expect(value).to.be.a(\string).and.have.length(14)
    expect(reverse value).to.equal "ereht // olleh"
  
  it "retains /* */ comments", #
    let value = "hello /* there */ friend"
    expect(value).to.be.a(\string).and.have.length(24)
    expect(reverse value).to.equal "dneirf /* ereht */ olleh"
  
  it "can have interpolation", #
    let value = 5
    expect("value: $(value)").to.equal "value: 5"
    expect("value: $value").to.equal "value: 5"
    
    expect("$(value)").to.equal "5"
    expect("$value").to.equal "5"
    expect("$(' ')").to.equal " "
    expect("$('')").to.equal ""
    expect("$( )").to.equal ""
    expect("\$(value)").to.equal '$(value)'
    expect("\$value").to.equal '$value'
    expect("start \$(value)").to.equal 'start $(value)'
    expect("start \$value").to.equal 'start $value'
    expect("start \$(value) end").to.equal 'start $(value) end'
    expect("start \$value end").to.equal 'start $value end'
    expect("start $(value) end").to.equal 'start 5 end'
    expect("start $value end").to.equal 'start 5 end'
    expect("\$(value) end").to.equal '$(value) end'
    expect("\$value end").to.equal '$value end'
    expect("$(value)$(value * value)").to.equal "525"
    expect("$value * $value = $(value ^ 2)").to.equal "5 * 5 = 25"
    expect("value:\n$(value)").to.equal "value:\n5"
    expect("value:\n$value").to.equal "value:\n5"
    let a = 1
    let b = 2
    expect("$(a)$(b)").to.equal "12"
    expect("$(a)$(b)c").to.equal "12c"
    expect("c$(a)$(b)").to.equal "c12"
    expect("c$(a)$(b)c").to.equal "c12c"
  
  it "can be indexed", #
    expect("hello".to-string).to.equal String::to-string
    expect("hello"[\to-string]).to.equal String::to-string

describe "Single-quoted strings", #
  it "can be empty", #
    expect('').to.be.a(\string).and.to.be.empty

  it "has an expected length", #
    expect('hello').to.be.a(\string).and.to.have.length 5

  it "is the expected reverse value", #
    expect(reverse 'hello').to.equal 'olleh'
  
  it "retains // comments", #
    let value = 'hello // there'
    expect(value).to.be.a(\string).and.have.length(14)
    expect(reverse value).to.equal "ereht // olleh"
  
  it "retains /* */ comments", #
    let value = 'hello /* there */ friend'
    expect(value).to.be.a(\string).and.have.length(24)
    expect(reverse value).to.equal "dneirf /* ereht */ olleh"
  
  it "ignores interpolation", #
    expect(reverse '$(value)').to.equal ')eulav($'
    expect(reverse '$value').to.equal 'eulav$'
  
  it "can be indexed", #
    expect('hello'.to-string).to.equal String::to-string
    expect('hello'[\to-string]).to.equal String::to-string

describe "Triple-double-quoted strings", #  
  it "can be empty", #
    expect("""""").to.be.a(\string).and.be.empty

  describe "Lorem ipsum", #
    let paragraph = """
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
    """
  
    it "ignores the first line of whitespace", #
      expect(paragraph).to.match r"^Lorem "
  
    it "ignores the last line of whitespace", #
      expect(paragraph).to.match r" laborum\.\$"
  
    it "has the expected amount of words", #
      expect(num-words paragraph).to.equal 69
  
  it "can contain double quotes", #
    expect("""Hello, "friend".""").to.equal 'Hello, "friend".'
  
  it "converts any newlines to \\n", #
    expect("""
    Hello, friend!
    I am well today.
    """).to.equal "Hello, friend!\nI am well today."
    
    expect(gorilla.eval-sync '"""alpha\r\nbravo"""').to.equal "alpha\nbravo"
  
  it "only ignores one line of whitespace on start and end", #
    expect("""

    Alpha

    Bravo   
    Charlie

    Delta   

    """).to.equal "\nAlpha\n\nBravo\nCharlie\n\nDelta\n"
  
  it "retains indentation", #
    expect("""
    Alpha
      Bravo
        Charlie
      Delta
    Echo
    """).to.equal "Alpha\n  Bravo\n    Charlie\n  Delta\nEcho"
  
  it "can end quote on same line as text", #
    expect("""
    Alpha
    Bravo
    Charlie""").to.equal "Alpha\nBravo\nCharlie"
  
  it "can start text immediately after quote", #
    expect("""Alpha
    Bravo
    Charlie
    """).to.equal "Alpha\nBravo\nCharlie"

  it "retains // comments", #
    let value = """hello // there"""
    expect(value).to.be.a(\string).and.have.length(14)
    expect(reverse value).to.equal "ereht // olleh"
  
  it "retains /* */ comments", #
    let value = """hello /* there */ friend"""
    expect(value).to.be.a(\string).and.have.length(24)
    expect(reverse value).to.equal "dneirf /* ereht */ olleh"
  
  it "can have interpolation", #
    let value = 5
    expect("""value: $(value)""").to.equal "value: 5"
    expect("""value: $value""").to.equal "value: 5"
  
  it "can be indexed", #
    expect("""hello""".to-string).to.equal String::to-string
    expect("""hello"""[\to-string]).to.equal String::to-string

describe "Triple-single-quoted strings", #  
  it "can be empty", #
    expect('''''').to.be.a(\string).and.be.empty

  describe "Lorem ipsum", #
    let paragraph = '''
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.
    '''
  
    it "ignores the first line of whitespace", #
      expect(paragraph).to.match r"^Lorem "
  
    it "ignores the last line of whitespace", #
      expect(paragraph).to.match r" laborum\.\$"
  
    it "has the expected amount of words", #
      expect(num-words paragraph).to.equal 69
  
  it "can contain double quotes", #
    expect('''Hello, "friend".''').to.equal 'Hello, "friend".'
  
  it "converts any newlines to \\n", #
    expect('''
    Hello, friend!
    I am well today.
    ''').to.equal "Hello, friend!\nI am well today."

    expect(gorilla.eval-sync "'''alpha\r\nbravo'''").to.equal "alpha\nbravo"
  
  it "only ignores one line of whitespace on start and end", #
    expect('''

    Alpha

    Bravo   
    Charlie

    Delta   

    ''').to.equal "\nAlpha\n\nBravo\nCharlie\n\nDelta\n"
  
  it "retains indentation", #
    expect('''
    Alpha
      Bravo
        Charlie
      Delta
    Echo
    ''').to.equal "Alpha\n  Bravo\n    Charlie\n  Delta\nEcho"
  
  it "can end quote on same line as text", #
    expect('''
    Alpha
    Bravo
    Charlie''').to.equal "Alpha\nBravo\nCharlie"
  
  it "can start text immediately after quote", #
    expect('''Alpha
    Bravo
    Charlie
    ''').to.equal "Alpha\nBravo\nCharlie"
  
  it "retains // comments", #
    let value = '''hello // there'''
    expect(value).to.be.a(\string).and.have.length(14)
    expect(reverse value).to.equal "ereht // olleh"
  
  it "retains /* */ comments", #
    let value = '''hello /* there */ friend'''
    expect(value).to.be.a(\string).and.have.length(24)
    expect(reverse value).to.equal "dneirf /* ereht */ olleh"
  
  it "ignores interpolation", #
    expect(reverse '''$(value)''').to.equal ')eulav($'
    expect(reverse '''$value''').to.equal 'eulav$'
  
  it "can be indexed", #
    expect('''hello'''.to-string).to.equal String::to-string
    expect('''hello'''[\to-string]).to.equal String::to-string
  
describe "Escape codes", #
  let C = String.from-char-code
  
  it "handle escaping the quote used to create the string", #
    expect("Hello, \"friend\"").to.equal 'Hello, "friend"'
    expect('Hello, \'friend\'').to.equal "Hello, 'friend'"
  
  it "can be 2-octet hex escapes", #
    expect("\x00").to.equal C(0x00)
    expect("\x0f").to.equal C(0x0f)
    expect("\xff").to.equal C(0xff)
    expect("0\xff0").to.equal "0" & C(0xff) & "0"
  
  it "can be 4-octet hex escapes", #
    expect("\u0000").to.equal C(0x0000)
    expect("\u000f").to.equal C(0x000f)
    expect("\u00ff").to.equal C(0x00ff)
    expect("\u0fff").to.equal C(0x0fff)
    expect("\uffff").to.equal C(0xffff)
    expect("0\uffff0").to.equal "0" & C(0xffff) & "0"
  
  it "can be 1 to 6-octet hex escapes", #
    expect("\u{0}").to.equal C(0x0000)
    expect("\u{00}").to.equal C(0x0000)
    expect("\u{000}").to.equal C(0x0000)
    expect("\u{0000}").to.equal C(0x0000)
    expect("\u{00000}").to.equal C(0x0000)
    expect("\u{000000}").to.equal C(0x0000)
    expect("\u{f}").to.equal C(0x000f)
    expect("\u{0f}").to.equal C(0x000f)
    expect("\u{00f}").to.equal C(0x000f)
    expect("\u{000f}").to.equal C(0x000f)
    expect("\u{0000f}").to.equal C(0x000f)
    expect("\u{00000f}").to.equal C(0x000f)
    expect("\u{ff}").to.equal C(0x00ff)
    expect("\u{0ff}").to.equal C(0x00ff)
    expect("\u{00ff}").to.equal C(0x00ff)
    expect("\u{000ff}").to.equal C(0x00ff)
    expect("\u{0000ff}").to.equal C(0x00ff)
    expect("\u{fff}").to.equal C(0x0fff)
    expect("\u{0fff}").to.equal C(0x0fff)
    expect("\u{00fff}").to.equal C(0x0fff)
    expect("\u{000fff}").to.equal C(0x0fff)
    expect("\u{ffff}").to.equal C(0xffff)
    expect("\u{0ffff}").to.equal C(0xffff)
    expect("\u{00ffff}").to.equal C(0xffff)
    expect("\u{00ffff}").to.have.length 1
    expect("\u{010000}").to.have.length 2
    expect("\u{10ffff}").to.have.length 2
    expect(#-> gorilla.compile-sync('''let x = 0
    let y = "\\u{110000}"''')).throws(gorilla.ParserError, r"Unicode escape sequence too large.*?\b2:\d+")
    expect("\u{20bb7}").to.have.length 2
    expect("\u{20bb7}").to.equal "\ud842\udfb7"
  
  it "implements all ECMAScript 5.1 standard single-char escape codes", #
    expect("\b").to.equal C(0x0008)
    expect("\t").to.equal C(0x0009)
    expect("\n").to.equal C(0x000a)
    expect("\v").to.equal C(0x000b)
    expect("\f").to.equal C(0x000c)
    expect("\r").to.equal C(0x000d)
    expect("\"").to.equal C(0x0022)
    expect("\'").to.equal C(0x0027)
    expect('\"').to.equal C(0x0022)
    expect('\'').to.equal C(0x0027)
    expect("\\").to.equal C(0x005c)
    expect('\\').to.equal C(0x005c)
  
  it "implements \\0", #
    expect("\0").to.equal C(0x0000)

describe "Backslash strings", #
  it "can be keywords", #
    expect(\null).to.equal "null"
    expect(\void).to.equal "void"
    expect(\undefined).to.equal "undefined"
  
  it "converts to camelCase", #
    expect(\hello-there).to.equal "helloThere"
    expect(\hello-there-everyone).to.equal "helloThereEveryone"
  
  it "can have trailing digits", #
    expect(\trailing-1).to.equal "trailing1"
    expect(\trailing-1234).to.equal "trailing1234"
  
  it "can contain digits", #
    expect(\start-1234-end).to.equal "start1234End"
  
  it "can be indexed", #
    expect(\hello.to-string).to.equal String::to-string
    expect(\hello[\to-string]).to.equal String::to-string

describe "Array strings", #
  it "can be empty", #
    expect(%"").to.be.an(\array).and.be.empty
  
  it "should be a single-valued array with no interpolation", #
    expect(%"hello").to.eql ["hello"]
  
  it "should include interpolations verbatim as their own values", #
    let x = spy()
    expect(%"hello$x").to.eql ["hello", x]
    expect(%"hello $x friend").to.eql ["hello ", x, " friend"]
  
  it "should only place interpolations at odd indices", #
    let x = spy()
    let y = spy()
    expect(%"$(x)$(y)").to.eql ["", x, "", y]
  
  it "should allow triple-quoted strings", #
    expect(%"""""").to.eql []
    let obj = spy()
    let other = spy()
    expect(%"""
    Alpha
      $obj
        Charlie
      $other
    Echo
    """).to.eql ["Alpha\n  ", obj, "\n    Charlie\n  ", other, "\nEcho"]
