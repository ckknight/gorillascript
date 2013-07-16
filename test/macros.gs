let {expect} = require 'chai'

it "has standard macros to give file information", #
  expect(__LINE__).to.equal 4
  expect(__LINE__).to.equal 5
  expect(__LINE__).to.equal 6
  expect(__COLUMN__).to.equal 10
  expect(__FILE__).to.match r'/macros\.gs$'
  expect(__VERSION__).to.not.be.empty

macro myif
  syntax test as Logic, body as Body, else-body as ("myelse", this as Body)?
    @internal-call(\if, test, body, else-body or @noop())

macro myfor
  syntax init as Expression, ";", test as Logic, ";", step as Statement, body as Body
    @internal-call(\for, init, test, step, body)
  
  syntax ident as Identifier, "=", start, ",", end, body as Body
    let init = []
    
    init.push (AST let mutable $ident = $start)
    
    myif @has-func(body)
      let func = @tmp \f
      init.push (AST let $func = #($ident) -> $body)
      body := (AST $func($ident))
    
    AST
      myfor $init; $ident ~< $end; $ident ~+= 1
        $body

macro make-array(thing)
  if not thing or not thing.is-internal-call \array
    @error "Expected an array", thing
  let parts = []
  let elements = thing.args
  let len = elements.length
  myfor i = 0, len
    let item = elements[i]
    parts.push AST $item
  
  @array parts

macro square(value)
  let f = @tmp \f
  let tmp = @tmp \ref
  AST do
    let $f()
      $tmp * $tmp
    let $tmp = $value
    $f()

describe "scope of tmp variables", #
  it "should work given differing function scopes", #
    expect(square 0).to.equal 0
    expect(square 5).to.equal 25

macro do-yield(value)
  ASTE yield $value

describe "Macros", #
  it "should allow for indirect yield expresion", #
    let generator()*
      do-yield "hello"
      do-yield "there"
    
    let iter = generator()
    expect(iter.next()).to.eql { -done, value: "hello" }
    expect(iter.next()).to.eql { -done, value: "there" }

macro code-string
  syntax value as Statement
    let string = String @macro-expand-all value
    ASTE $string

describe "to-string method on nodes", #
  it "on constants", #
    expect(code-string 1234).to.equal "1234"
    expect(code-string "hello").to.equal '"hello"'
    expect(code-string true).to.equal "true"
    expect(code-string false).to.equal "false"
    expect(code-string Infinity).to.equal "Infinity"
    expect(code-string -Infinity).to.equal "-Infinity"
    expect(code-string NaN).to.equal "NaN"

  it "on idents", #
    expect(code-string dunno).to.equal 'dunno'

  it "on arrays", #
    expect(code-string [1, true, "hello"]).to.equal '[1, true, "hello"]'

  it "on objects", #
    expect(code-string {a: b, c: 1234, +d, -e, f: "hello", "g h": null}).to.equal '{ a: b, c: 1234, d: true, e: false, f: "hello", "g h": null }'

  it "on accesses", #
    expect(code-string a.b[c].d).to.equal 'a.b[c].d'

  it "on calls", #
    expect(code-string f x, y).to.equal 'f(x, y)'
    expect(code-string f x, ...y).to.equal 'f(x, ...y)'
    expect(code-string o.f x, y).to.equal 'o.f(x, y)'
    expect(code-string o.f x, ...y).to.equal 'o.f(x, ...y)'

  it "on unary", #
    let mutable x = void
    expect(code-string ~+x).to.equal '(+x)'
    expect(code-string ~-x).to.equal '(-x)'
    expect(code-string x ~+= 1).to.equal '(++x)'
    expect(code-string x ~-= 1).to.equal '(--x)'
    expect(code-string post-inc! x).to.equal '(x++)'
    expect(code-string post-dec! x).to.equal '(x--)'
    expect(code-string not x).to.equal '(!x)'
    expect(code-string ~bitnot x).to.equal '(~x)'
    expect(code-string typeof something).to.equal 'typeof something'
    expect(code-string delete o.x).to.equal 'delete o.x'

  it "on binary", #
    expect(code-string a ~+ b ~* c ~/ d ~- e).to.equal "(((+a) + ((b * c) / d)) - e)"

  it "on assign", #
    let mutable y = 0
    let mutable x = 0
    expect(code-string y := x ~*= 2).to.equal 'y = x *= 2'

macro test-override-call()
  ASTE "alpha"

macro test-override-syntax
  syntax "woo"
    ASTE "alpha"

describe "Before overriding", #
  it "should evaluate the old macro", #
    expect(test-override-call()).to.equal "alpha"
    expect(test-override-syntax woo).to.equal "alpha"

macro test-override-call()
  ASTE "bravo"

macro test-override-syntax
  syntax "woo"
    ASTE "bravo"

  syntax "woo", "doggy"
    ASTE "charlie"

describe "After overriding", #
  it "should evaluate the new macro", #
    expect(test-override-call()).to.equal "bravo"
    expect(test-override-syntax woo).to.equal "bravo"
    expect(test-override-syntax woo doggy).to.equal "charlie"

macro lookahead-test
  syntax ?="\n", ""
    ASTE \newline

  syntax "(", ")"
    ASTE \call

  syntax ?=ArrayLiteral, x as Expression
    ASTE \array

  syntax ?!ArrayLiteral, x as Expression
    ASTE \not-array

it "Lookahead should work", #
  let call = lookahead-test()
  let newline = lookahead-test
  let array = lookahead-test []
  let not-array = lookahead-test 1 + 2

  expect(call).to.equal \call
  expect(newline).to.equal \newline
  expect(array).to.equal \array
  expect(not-array).to.equal \not-array
