let expect = require('chai').expect

// basics of function testing before we add tests using `test`
let q = #-> "alpha"
expect(q).to.be.a \function
expect(q()).to.equal "alpha"

let {stub} = require 'sinon'
let gorilla = require '../index'

describe "functions", #
  it "simple function", #
    let fun = #-> "bravo"
    expect(fun).to.be.a \function
    expect(fun()).to.equal "bravo"
  
  it "doesn't require a function glyph", #
    let fun = # "bravo"
    expect(fun).to.be.a \function
    expect(fun()).to.equal "bravo"

  it "function replacement", #
    let mutable fun = #-> "alpha"
    expect(fun()).to.equal "alpha"
    fun := #-> "bravo"
    expect(fun()).to.equal "bravo"

  it "function replacement, no initial", #
    let mutable fun = void
    expect(fun).to.be.undefined
    fun := #-> "alpha"
    expect(fun()).to.equal "alpha"
    fun := #-> "bravo"
    expect(fun()).to.equal "bravo"

  it "function replacement with non-function", #
    let mutable fun = #-> "alpha"
    expect(fun()).to.equal "alpha"
    fun := "bravo"
    expect(fun).to.equal "bravo"

  it "method definition and calling", #
    let obj = {}
    obj.x := #-> "charlie"
    expect(obj.x).to.be.a \function
    expect(obj.x()).to.equal "charlie"
    obj.y := #-> this
    expect(obj.y()).to.equal obj
    let other = {}
    expect(obj.y.call(other)).to.equal other

  it "object definition with inline methods", #
    let obj = {
      x: #-> "charlie"
      y: #-> this
    }
  
    expect(obj.x()).to.equal "charlie"
    expect(obj.y()).to.equal obj
    let other = {}
    expect(obj.y.call(other)).to.equal other

  it "bound function", #
    let outer = #
      #@ -> this
  
    let obj = {}
    let inner = outer.call(obj)
    let other = {}
    expect(inner()).to.equal obj
    expect(inner.call(other)).to.equal obj
    expect(outer.call(other)()).to.equal other
    expect(outer.call(other).call(obj)).to.equal other

  it "nested bound function", #
    let obj = {}
    let outer = #
      expect(this).to.equal obj
      #@
        expect(this).to.equal obj
        #@
          expect(this).to.equal obj
          #@ -> this
  
    let inner = outer.call(obj)
    expect(inner.call({}).call({}).call({})).to.equal obj

  it "bound function doesn't get overly bound", #
    let alpha = {}
    let bravo = {}
    let outer = #
      expect(this).to.equal alpha
      #@
        expect(this).to.equal alpha
        # // not bound
          expect(this).to.equal bravo
          #@ -> this
  
    let ignored = {}
    expect(outer.call(alpha).call(ignored).call(bravo).call(ignored)).to.equal bravo

  it "bound method inside object", #
    let make-object = # -> {
      x: #-> this
      y: #@-> this
    }
  
    let other = {}
    let obj = make-object.call(other)
    expect(obj.x()).to.equal obj
    expect(obj.y()).to.equal other

  it "function self-redeclaration", #
    let mutable fun = #
      fun := #-> "bravo"
      "alpha"
  
    expect(fun()).to.equal "alpha"
    expect(fun()).to.equal "bravo"
    expect(fun()).to.equal "bravo"

  it "simple arguments", #
    let obj = {}
    let ret-obj = #-> obj
    let id = #(i) -> i
    let add = #(x, y) -> x + y
  
    expect(ret-obj).to.have.length 0
    expect(id).to.have.length 1
    expect(add).to.have.length 2
  
    expect(ret-obj()).to.equal obj
    expect(id(obj)).to.equal obj
    expect((id obj)).to.equal obj
    expect(add(1, 2)).to.equal 3
    expect((add 1, 2)).to.equal 3

  it "unnecessary trailing comma", #
    let obj = {}
    let ret-obj = #(,) -> obj
    let id = #(i,) -> i
    let add = #(x, y,) -> x + y

    expect(ret-obj).to.have.length 0
    expect(id).to.have.length 1
    expect(add).to.have.length 2

    expect(ret-obj()).to.equal obj
    expect(id(obj)).to.equal obj
    expect((id obj)).to.equal obj
    expect(add(1, 2)).to.equal 3
    expect((add 1, 2)).to.equal 3

  it "recursive function", #
    let factorial(n)
      if n <= 1
        1
      else
        n * factorial(n - 1)
  
    expect(factorial(0)).to.equal 1
    expect(factorial(1)).to.equal 1
    expect(factorial(2)).to.equal 2
    expect(factorial(3)).to.equal 2 * 3
    expect(factorial(4)).to.equal 2 * 3 * 4
    expect(factorial(5)).to.equal 2 * 3 * 4 * 5
    expect(factorial(6)).to.equal 2 * 3 * 4 * 5 * 6
    expect(factorial(7)).to.equal 2 * 3 * 4 * 5 * 6 * 7

  it "simple spread arguments", #
    let fun(...args) -> args
  
    let obj = {}
    expect(fun).to.have.length 0
    expect(fun()).to.be.an \array // not an Arguments type
    expect(fun()).to.have.length 0
    expect(fun(obj)).to.have.length 1
    expect(fun(obj)[0]).to.equal obj
    let other = {}
    expect(fun(obj, other)).to.eql [obj, other]
  
  it "spread arguments without a body should return void", #
    let fun(...args) ->

    expect(fun()).to.be.undefined

  it "spread arguments with leading arguments", #
    let fun(first, ...rest) -> [first, rest]
  
    expect(fun).to.have.length 1
    expect(fun()[1]).to.be.an \array
    expect(fun({})[1]).to.be.an \array
    expect(fun()).to.eql [void, []]
    let alpha = {}
    expect(fun(alpha)).to.eql [alpha, []]
    let bravo = {}
    expect(fun(alpha, bravo)).to.eql [alpha, [bravo]]
    let charlie = {}
    expect(fun(alpha, bravo, charlie)).to.eql [alpha, [bravo, charlie]]

  it "spread arguments with trailing arguments", #
    let fun(...start, last) -> [start, last]
  
    expect(fun).to.have.length 0
    expect(fun()[0]).to.be.an \array
    expect(fun({})[0]).to.be.an \array
    expect(fun()).to.eql [[], void]
    let alpha = {}
    expect(fun(alpha)).to.eql [[], alpha]
    let bravo = {}
    expect(fun(alpha, bravo)).to.eql [[alpha], bravo]
    let charlie = {}
    expect(fun(alpha, bravo, charlie)).to.eql [[alpha, bravo], charlie]

  it "spread arguments is mutable within function", #
    let alpha = {}
    let fun(...args)
      args.push(alpha)
      args
  
    expect(fun).to.have.length 0
    expect(fun()).to.eql [alpha]
    let bravo = {}
    expect(fun(bravo)).to.eql [bravo, alpha]
    let charlie = {}
    expect(fun(bravo, charlie)).to.eql [bravo, charlie, alpha]

  it "multiple spread arguments is an Error", #
    expect(#-> gorilla.compile-sync """let x = 0
    let f(...a, ...b) ->""").throws gorilla.ParserError, r"Cannot have more than one spread parameter.*?2:12"

  it "special `arguments` variable is still available", #
    let fun() -> arguments
  
    expect(fun).to.have.length 0
    expect({}.to-string.call(fun())).to.equal "[object Arguments]" // not [object Array]
    expect(Array::slice.call(fun())).to.eql []
    let alpha = {}
    expect(Array::slice.call(fun(alpha))).to.eql [alpha]
    let bravo = {}
    expect(Array::slice.call(fun(alpha, bravo))).to.eql [alpha, bravo]

  it "calling a function with spread", #
    let add(x, y) -> x + y
  
    expect(add).to.have.length 2
    expect(add(...[1, 2])).to.equal 3
    let nums = [1, 2]
    expect(add(...nums)).to.equal 3
    nums.push 3
    expect(add(...nums)).to.equal 3 // last argument is ignored
  
    let fun(...args) -> args
  
    expect(fun).to.have.length 0
    expect(fun(...["alpha", "bravo"])).to.eql ["alpha", "bravo"]
    let args = ["alpha", "bravo"]
    expect(fun(...args)).to.eql ["alpha", "bravo"]
    expect(fun(...args)).to.not.equal args // may have equivalent innards, but different references
    args.push "charlie"
    expect(fun(...args)).to.eql ["alpha", "bravo", "charlie"]
  
    args.splice(0, args.length)
    expect(fun()).to.eql []
    expect(fun(...[])).to.eql []
    expect(fun(...args)).to.eql []
    args.push(null)
    expect(fun(null)).to.eql [null]
    expect(fun(...[null])).to.eql [null]
    expect(fun(...args)).to.eql [null]
    args[0] := void
    expect(fun(void)).to.eql [void]
    expect(fun(...[void])).to.eql [void]
    expect(fun(...args)).to.eql [void]

  it "calling a function with multiple spreads", #
    let fun(...args) -> args
  
    let alpha = [1, 2, 3]
    let bravo = [4, 5, 6]
  
    expect(fun(...alpha, ...bravo)).to.eql [1, 2, 3, 4, 5, 6]
    expect(fun("a", ...alpha, ...bravo)).to.eql ["a", 1, 2, 3, 4, 5, 6]
    expect(fun(...alpha, "b", ...bravo)).to.eql [1, 2, 3, "b", 4, 5, 6]
    expect(fun(...alpha, ...bravo, "c")).to.eql [1, 2, 3, 4, 5, 6, "c"]
    expect(fun("a", ...alpha, "b", ...bravo)).to.eql ["a", 1, 2, 3, "b", 4, 5, 6]
    expect(fun("a", ...alpha, ...bravo, "c")).to.eql ["a", 1, 2, 3, 4, 5, 6, "c"]
    expect(fun(...alpha, "b", ...bravo, "c")).to.eql [1, 2, 3, "b", 4, 5, 6, "c"]
    expect(fun("a", ...alpha, "b", ...bravo, "c")).to.eql ["a", 1, 2, 3, "b", 4, 5, 6, "c"]

  it "calling a method with spread", #
    let obj = {
      fun: #(...args) -> [this, args]
    }
    let other = {}
  
    expect(obj.fun).to.have.length 0
  
    expect(obj.fun(...["alpha", "bravo"])).to.eql [obj, ["alpha", "bravo"]]
    let args = ["alpha", "bravo"]
    expect(obj.fun(...args)).to.eql [obj, ["alpha", "bravo"]]
    args.push "charlie"
    expect(obj.fun(...args)).to.eql [obj, ["alpha", "bravo", "charlie"]]
  
    expect(obj.fun.call(other, ...["alpha", "bravo"])).to.eql [other, ["alpha", "bravo"]]
    expect(obj.fun.call(other, ...args)).to.eql [other, ["alpha", "bravo", "charlie"]]
    args.push "delta"
    expect(obj.fun.call(other, ...args)).to.eql [other, ["alpha", "bravo", "charlie", "delta"]]

  it "calling a function with spread will only access object once", #
    let fun(...args) -> args
    
    let get-args = stub().returns ["alpha", "bravo"]
    expect(fun(...get-args())).to.eql ["alpha", "bravo"]
    expect(get-args).to.be.called-once

  it "calling a function with spread will only access function once", #
    let mutable ran = false
    let get-fun = stub().returns #(...args)
      expect(ran).to.be.false
      ran := true
      args
  
    let args = ["alpha", "bravo"]
    expect(get-fun()(...args)).to.eql ["alpha", "bravo"]
    expect(get-fun).to.be.called-once

  it "calling a method with spread will only access object once", #
    let get-obj = stub().returns {
      fun: #(...args)
        if this.method-called
          fail "method called more than once"
      
        this.method-called := true
        
        args
    }
  
    let args = ["alpha", "bravo"]
    expect(get-obj().fun(...args)).to.eql ["alpha", "bravo"]
    expect(get-obj).to.be.called-once

  it "spread arguments in middle", #
    let fun(first, ...middle, last) -> [first, middle, last]
  
    expect(fun).to.have.length 1
    expect(fun()).to.eql [void, [], void]
    expect(fun("alpha")).to.eql ["alpha", [], void]
    expect(fun("alpha", "bravo")).to.eql ["alpha", [], "bravo"]
    expect(fun("alpha", "bravo", "charlie")).to.eql ["alpha", ["bravo"], "charlie"]
    expect(fun("alpha", "bravo", "charlie", "delta")).to.eql ["alpha", ["bravo", "charlie"], "delta"]
  
    let args = []
    expect(fun(...args)).to.eql [void, [], void]
    args.push("alpha")
    expect(fun(...args)).to.eql ["alpha", [], void]
    args.push("bravo")
    expect(fun(...args)).to.eql ["alpha", [], "bravo"]
    args[0] := "bravo"
    args[1] := "charlie"
    expect(fun("alpha", ...args)).to.eql ["alpha", ["bravo"], "charlie"]
    expect(fun("alpha", ...args, "delta")).to.eql ["alpha", ["bravo", "charlie"], "delta"]

    let fun2(a, b, ...c, d, e) -> [a, b, c, d, e]
  
    expect(fun2).to.have.length 2
    expect(fun2()).to.eql [void, void, [], void, void]
    expect(fun2("alpha")).to.eql ["alpha", void, [], void, void]
    expect(fun2("alpha", "bravo")).to.eql ["alpha", "bravo", [], void, void]
    expect(fun2("alpha", "bravo", "charlie")).to.eql ["alpha", "bravo", [], "charlie", void]
    expect(fun2("alpha", "bravo", "charlie", "delta")).to.eql ["alpha", "bravo", [], "charlie", "delta"]
    expect(fun2("alpha", "bravo", "charlie", "delta", "echo")).to.eql ["alpha", "bravo", ["charlie"], "delta", "echo"]
    expect(fun2("alpha", "bravo", "charlie", "delta", "echo", "foxtrot")).to.eql ["alpha", "bravo", ["charlie", "delta"], "echo", "foxtrot"]
  
    args.splice(0, args.length)
    expect(fun2(...args)).to.eql [void, void, [], void, void]
    args.push("alpha")
    expect(fun2(...args)).to.eql ["alpha", void, [], void, void]
    args.push("bravo")
    expect(fun2(...args)).to.eql ["alpha", "bravo", [], void, void]
    args.push("charlie")
    expect(fun2(...args)).to.eql ["alpha", "bravo", [], "charlie", void]
    args.push("delta")
    expect(fun2(...args)).to.eql ["alpha", "bravo", [], "charlie", "delta"]
    args.shift()
    args.push("echo")
    expect(fun2("alpha", ...args)).to.eql ["alpha", "bravo", ["charlie"], "delta", "echo"]
    expect(fun2("alpha", ...args, "foxtrot")).to.eql ["alpha", "bravo", ["charlie", "delta"], "echo", "foxtrot"]
    args.shift()
    args.push("foxtrot")
    expect(fun2("alpha", "bravo", ...args, "golf")).to.eql ["alpha", "bravo", ["charlie", "delta", "echo"], "foxtrot", "golf"]
    expect(fun2("alpha", "bravo", ...args, "golf", "hotel")).to.eql ["alpha", "bravo", ["charlie", "delta", "echo", "foxtrot"], "golf", "hotel"]

  it "default values", #
    let obj = {}
    let fun = #(alpha = obj) -> alpha
  
    expect(fun).to.have.length 1
    expect(fun()).to.equal obj
    expect(fun(null)).to.equal obj
    expect(fun(void)).to.equal obj
    let other = {}
    expect(fun(other)).to.equal other
    expect(fun(0)).to.equal 0
    expect(fun(false)).to.be.false
    expect(fun("")).to.equal ""
    expect(fun(...[])).to.equal obj
    expect(fun(...[null])).to.equal obj
    expect(fun(...[void])).to.equal obj
    expect(fun(...[other])).to.equal other
    let arr = [other]
    expect(fun(...arr)).to.equal other

  it "default values and spreads", #
    let fun(a = 2, ...b, c = 3, d = 5)
      a * c * d * (b.length + 1)
  
    expect(fun).to.have.length 1
    expect(fun()).to.equal 2 * 3 * 5
    expect(fun(1)).to.equal 3 * 5
    expect(fun(1, 1)).to.equal 5
    expect(fun(1, 1, 1)).to.equal 1
    expect(fun(1, "x", 1, 1)).to.equal 2

  it "default value create new object each access", #
    let fun(alpha = {}) -> alpha
  
    let a = fun(null)
    expect(a).to.be.ok
    let b = fun(void)
    expect(b).to.be.ok
    expect(a).to.not.be.equal b

  it "default value call function each access", #
    let mutable i = 0
    let make()
      i += 1
      i
    let fun = #(val = make()) -> val
  
    expect(fun()).to.equal 1
    expect(fun(null)).to.equal 2
    expect(fun(5)).to.equal 5
    expect(fun(void)).to.equal 3
    expect(fun(4)).to.equal 4
    expect(fun()).to.equal 4

  it "function scope", #
    let mutable outer = 0
    let inc()
      outer += 1
      let inner = outer
      inner
    let reset()
      let inner = outer
      outer := 0
      inner

    expect(inc()).to.equal 1
    expect(inc()).to.equal 2
    expect(outer).to.equal 2
    expect(reset()).to.equal 2
    expect(outer).to.equal 0

  it "function scope with same-named variables", #
    let mutable value = 0
    let func()
      let mutable value = 5
      value += 1
      value
  
    expect(value).to.equal 0
    expect(func()).to.equal 6
    expect(value).to.equal 0
    expect(func()).to.equal 6
    expect(value).to.equal 0
    expect(func()).to.equal 6

  /*
  it "mutable functions", ->
    let fun = mutable -> 0
    fun.name = "fun"
  */

  it "fancy whitespace", #
    let fun = #(
      a,
      b = []
      ,
    ) -> [a, b]
  
    expect(fun("alpha")).to.eql ["alpha", []]
    expect(fun("alpha", "bravo")).to.eql ["alpha", "bravo"]

  it "setting values on this by their parameters", #
    let fun(this.alpha, this.bravo) ->
  
    let obj = {}
    fun.call(obj, "charlie", "delta")
    expect(obj.alpha).to.equal "charlie"
    expect(obj.bravo).to.equal "delta"
  
    let spread(...this.args) ->
    spread.call(obj, "echo", "foxtrot")
    expect(obj.args).to.eql ["echo", "foxtrot"]

  it "setting values on @ by their parameters", #
    let fun(@alpha, @bravo) ->
  
    let obj = {}
    fun.call(obj, "charlie", "delta")
    expect(obj.alpha).to.equal "charlie"
    expect(obj.bravo).to.equal "delta"
  
    let spread(...@args) ->
    spread.call(obj, "echo", "foxtrot")
    expect(obj.args).to.eql ["echo", "foxtrot"]

  it "setting values on @ by their parameters with defaults", #
    let fun = #(@alpha = 0, @bravo = 1) -> [alpha, bravo]
  
    let mutable obj = {}
    expect(fun.call(obj)).to.eql [0, 1]
    expect(obj.alpha).to.equal 0
    expect(obj.bravo).to.equal 1
  
    obj := {}
    expect(fun.call(obj, "charlie")).to.eql ["charlie", 1]
    expect(obj.alpha).to.equal "charlie"
    expect(obj.bravo).to.equal 1
  
    obj := {}
    expect(fun.call(obj, "charlie", "delta")).to.eql ["charlie", "delta"]
    expect(obj.alpha).to.equal "charlie"
    expect(obj.bravo).to.equal "delta"

  it "reserved word as parameter", #
    for name in gorilla.get-reserved-words()
      expect(#-> gorilla.compile-sync """let z = 5
      let fun(x, $name) ->""").throws gorilla.ParserError, r"2:\d+"

  it "eval is still usable, in case someone wants to use it", #
    expect(eval("5")).to.equal 5
    let f() -> "hello"
    expect(eval("f()")).to.equal "hello"

  it "chained function calls", #
    let wrap(x) -> #-> x
  
    let obj = {}
    expect(wrap(wrap(obj))()()).to.equal obj
    expect((wrap wrap obj)()()).to.equal obj

  it "passing two functions without paren-wrapping", #
    let sum(a, b) -> a() + b()
  
    expect(sum #-> 1 + 2, #-> 3 + 4).to.equal 10

  it "passing two functions with paren-wrapping", #
    let sum(a, b) -> a() + b()
  
    expect(sum(#-> 1 + 2
      #-> 3 + 4)).to.equal 10

  /*
  it "chained method calls without paren-wrapping", -> do
    let counter = {
      result: []
      tick: (value) -> do
        this.result.push value
        this
      end
    }
  
    counter
      .tick "a"
      .tick "b"
      .tick "c"
    expect(counter.result).to.eql ["a", "b", "c"]
  end
  */

  it "method calls with implicit last object", #
    let fun(...args, options = {})
      let opt = []
      for k, v of options
        opt.push([k, v])
      opt.sort #(a, b) -> a[0] <=> b[0]
      [args, opt]
  
    expect(fun "alpha", "bravo", {}).to.eql [["alpha", "bravo"], []]
    expect(fun "alpha", "bravo", charlie: 1).to.eql [["alpha", "bravo"], [["charlie", 1]]]
    expect(fun "alpha", "bravo", charlie: 1, delta: 2).to.eql [["alpha", "bravo"], [["charlie", 1], ["delta", 2]]]
    expect(fun "alpha", charlie: 1, delta: 2, echo: 3).to.eql [["alpha"], [["charlie", 1], ["delta", 2], ["echo", 3]]]
    expect(fun charlie: 1, delta: 2, echo: 3, foxtrot: 4).to.eql [[], [["charlie", 1], ["delta", 2], ["echo", 3], ["foxtrot", 4]]]
  
    expect(fun("alpha", "bravo", {})).to.eql [["alpha", "bravo"], []]
    expect(fun("alpha", "bravo", charlie: 1)).to.eql [["alpha", "bravo"], [["charlie", 1]]]
    expect(fun("alpha", "bravo", charlie: 1, delta: 2)).to.eql [["alpha", "bravo"], [["charlie", 1], ["delta", 2]]]
    expect(fun("alpha", charlie: 1, delta: 2, echo: 3)).to.eql [["alpha"], [["charlie", 1], ["delta", 2], ["echo", 3]]]
    expect(fun(charlie: 1, delta: 2, echo: 3, foxtrot: 4)).to.eql [[], [["charlie", 1], ["delta", 2], ["echo", 3], ["foxtrot", 4]]]

  it "whitespace checks", #
    let alpha(...args) -> args
    let bravo(options, ...rest)
      expect(rest).to.have.length 0
      (for k, v of options
        [k, v]).sort #(a, b) -> a[0] <=> b[0]
    let echo = bravo
    
    expect(alpha(
      bravo { charlie: "delta" },
      echo { foxtrot: "golf" }
    )).to.eql [[["charlie", "delta"]], [["foxtrot", "golf"]]]
    
    expect(alpha(
      bravo { charlie: "delta" }
      echo { foxtrot: "golf" }
    )).to.eql [[["charlie", "delta"]], [["foxtrot", "golf"]]]
  
    expect(alpha(
      bravo charlie: "delta",
      echo foxtrot: "golf"
    )).to.eql [[["charlie", "delta"]], [["foxtrot", "golf"]]], 
  
    expect(alpha(
      bravo charlie: "delta"
      echo foxtrot: "golf"
    )).to.eql [[["charlie", "delta"]], [["foxtrot", "golf"]]]

  it "duplicate parameter name", #
    expect(#-> gorilla.compile-sync """let x = 0
    let fun(a, a) ->""").throws gorilla.ParserError, r"Duplicate parameter name: \'a\'.*2:11"

  it "duplicate parameter name", #
    expect(#-> gorilla.compile-sync """let x = 0
    let fun(a, [a]) ->""").throws gorilla.ParserError, r"Duplicate parameter name: \'a\'.*2:13"

  it "duplicate parameter name", #
    expect(#-> gorilla.compile-sync """let x = 0
    let fun([a], [a]) ->""").throws gorilla.ParserError, r"Duplicate parameter name: \'a\'.*2:15"

  it "duplicate parameter name", #
    expect(#-> gorilla.compile-sync """let x = 0
    let fun([a], {a}) ->""").throws gorilla.ParserError, r"Duplicate parameter name: \'a\'.*2:15"

  it "typed parameters, Boolean", #
    let fun(val as Boolean) -> val
  
    expect(fun(false)).to.be.false
    expect(fun(true)).to.be.true
    expect(fun(null)).to.be.false
    expect(fun(void)).to.be.false
    expect(fun()).to.be.false
    expect(#-> fun(0)).throws TypeError, "Expected val to be a Boolean, got Number"
    expect(#-> fun(1)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun("stuff")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Boolean(false))).throws TypeError
    expect(#-> fun(new Boolean(true))).throws TypeError

  it "typed parameters, String", #
    let fun(val as String) -> val
  
    expect(fun("")).to.equal ""
    expect(fun("hello")).to.equal "hello"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(0)).throws TypeError, "Expected val to be a String, got Number"
    expect(#-> fun(NaN)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new String(""))).throws TypeError
    expect(#-> fun(new String("hello"))).throws TypeError

  it "typed parameters, Number", #
    let fun(val as Number) -> val
  
    expect(fun(0)).to.equal 0
    expect(fun(1)).to.equal 1
    expect(fun(-1)).to.equal -1
    expect(fun(Infinity)).to.equal Infinity
    expect(fun(-Infinity)).to.equal -Infinity
    expect(fun(NaN) is NaN).to.be.true
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError, "Expected val to be a Number, got String"
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Number(0))).throws TypeError
    expect(#-> fun(new Number(1))).throws TypeError
    expect(#-> fun(new Number(NaN))).throws TypeError
    expect(#-> fun(new Number(Infinity))).throws TypeError

  it "typed parameters, Function", #
    let fun(f as Function) -> f()
  
    expect(fun(#-> 0)).to.equal 0
    expect(fun(#-> "hello")).to.equal "hello"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(0)).throws TypeError, "Expected f to be a Function, got Number"
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed parameters, Array", #
    let fun(val as Array) -> val
  
    let getArgs() -> arguments
  
    let FakeArray()! ->
    FakeArray.prototype := []
  
    expect(fun([])).to.eql []
    expect(fun(["hello"])).to.eql ["hello"]
    expect(fun(["hello", 1, true])).to.eql ["hello", 1, true]
    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun(getArgs("hello"))).throws TypeError
    expect(#-> fun(new FakeArray())).throws TypeError

  it "typed parameters, Array as []", #
    let fun(val as []) -> val
  
    let getArgs() -> arguments
  
    let FakeArray()! ->
    FakeArray.prototype := []
  
    expect(fun([])).to.eql []
    expect(fun(["hello"])).to.eql ["hello"]
    expect(fun(["hello", 1, true])).to.eql ["hello", 1, true]
    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun(getArgs("hello"))).throws TypeError
    expect(#-> fun(new FakeArray())).throws TypeError

  it "typed parameters, Object", #
    let fun(val as Object) -> val
  
    expect(fun([])).to.eql [] // technically valid
    let obj = {}
    expect(fun(obj)).to.equal obj
    expect(#-> fun(0)).throws TypeError, "Expected val to be an Object, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError

  it "typed parameters, Object as {}", #
    let fun(val as {}) -> val
  
    expect(fun([])).to.eql [] // technically valid
    let obj = {}
    expect(fun(obj)).to.equal obj
    expect(#-> fun(0)).throws TypeError, "Expected val to be an Object, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError

  it "typed parameters, specific object", #
    let fun(val as {x: Number}) -> val.x
  
    let obj = {}
    expect(#-> fun({})).throws TypeError, "Expected val.x to be a Number, got Undefined"
    expect(fun({x: 1})).to.equal 1
    expect(fun({x: 1, y: 2})).to.equal 1
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(0)).throws TypeError, "Expected val to be an Object, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError

  it "typed parameters, arbitrary ident", #
    let Thing()! ->
    let fun(val as Thing) -> val
  
    let alpha = new Thing()
    let bravo = new Thing()
    expect(fun(alpha)).to.equal alpha
    expect(fun(bravo)).to.equal bravo
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError, "Expected val to be a Thing, got String"
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed parameters, Number or String", #
    let fun(val as Number|String) -> val
  
    expect(fun(0)).to.equal 0
    expect(fun(1)).to.equal 1
    expect(fun(-1)).to.equal -1
    expect(fun(Infinity)).to.equal Infinity
    expect(fun(-Infinity)).to.equal -Infinity
    expect(fun(NaN) is NaN).to.be.true
    expect(fun("")).to.equal ""
    expect(fun("hello")).to.equal "hello"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError, "Expected val to be one of Number or String, got Boolean"
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Number(0))).throws TypeError
    expect(#-> fun(new String(""))).throws TypeError

  it "typed parameters, Number or Boolean", #
    let fun(val as Number|Boolean) -> val
  
    expect(fun(0)).to.equal 0
    expect(fun(1)).to.equal 1
    expect(fun(-1)).to.equal -1
    expect(fun(Infinity)).to.equal Infinity
    expect(fun(-Infinity)).to.equal -Infinity
    expect(fun(NaN) is NaN).to.be.true
    expect(fun()).to.be.false
    expect(fun(void)).to.be.false
    expect(fun(null)).to.be.false
    expect(fun(true)).to.be.true
    expect(fun(false)).to.be.false
    expect(#-> fun("")).throws TypeError, "Expected val to be one of Number or Boolean, got String"
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Number(0))).throws TypeError
    expect(#-> fun(new Boolean(false))).throws TypeError

  it "typed parameters, Number or null", #
    let fun(val as Number|null) -> val
  
    expect(fun(0)).to.equal 0
    expect(fun(1)).to.equal 1
    expect(fun(-1)).to.equal -1
    expect(fun(Infinity)).to.equal Infinity
    expect(fun(-Infinity)).to.equal -Infinity
    expect(fun(NaN) is NaN).to.be.true
    expect(fun()).to.be.null
    expect(fun(void)).to.be.null
    expect(fun(null)).to.be.null
    expect(#-> fun(true)).throws TypeError, "Expected val to be one of Number or null, got Boolean"
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Number(0))).throws TypeError

  it "typed parameters, Number or void", #
    let fun(val as Number|void) -> val
  
    expect(fun(0)).to.equal 0
    expect(fun(1)).to.equal 1
    expect(fun(-1)).to.equal -1
    expect(fun(Infinity)).to.equal Infinity
    expect(fun(-Infinity)).to.equal -Infinity
    expect(fun(NaN) is NaN).to.be.true
    expect(fun()).to.be.undefined
    expect(fun(void)).to.be.undefined
    expect(fun(null)).to.be.undefined
    expect(#-> fun(true)).throws TypeError, "Expected val to be one of Number or undefined, got Boolean"
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Number(0))).throws TypeError

  it "typed parameters, Boolean or null", #
    let fun(val as Boolean|null) -> val
  
    expect(fun()).to.be.null
    expect(fun(true)).to.be.true
    expect(fun(false)).to.be.false
    expect(fun(void)).to.be.null
    expect(fun(null)).to.be.null
    expect(#-> fun(0)).throws TypeError, "Expected val to be one of Boolean or null, got Number"
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Boolean(false))).throws TypeError

  it "typed parameters, Boolean or void", #
    let fun(val as Boolean|void) -> val
  
    expect(fun()).to.be.undefined
    expect(fun(true)).to.be.true
    expect(fun(false)).to.be.false
    expect(fun(void)).to.be.undefined
    expect(fun(null)).to.be.undefined
    expect(#-> fun(0)).throws TypeError, "Expected val to be one of Boolean or undefined, got Number"
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Boolean(false))).throws TypeError

  it "typed parameters, Boolean or null or void", #
    let fun(val as Boolean|null|void) -> val
  
    expect(fun()).to.be.undefined
    expect(fun(true)).to.be.true
    expect(fun(false)).to.be.false
    expect(fun(void)).to.be.undefined
    expect(fun(null)).to.be.null
    expect(#-> fun(0)).throws TypeError, "Expected val to be one of Boolean or null or undefined, got Number"
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new Boolean(false))).throws TypeError

  it "typed parameters, special type or null", #
    let Thing()! ->
  
    let fun(val as Thing|null) -> val
  
    let x = new Thing()
    expect(fun(x)).to.equal x
    expect(#-> fun(0)).throws TypeError, "Expected val to be one of Thing or null, got Number"
    expect(fun()).to.be.null
    expect(fun(void)).to.be.null
    expect(fun(null)).to.be.null
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed parameters, special type or String", #
    let Thing()! ->
  
    let fun(val as Thing|String) -> val
  
    let x = new Thing()
    expect(fun(x)).to.equal x
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError, "Expected val to be one of Thing or String, got Boolean"
    expect(#-> fun(false)).throws TypeError
    expect(fun("")).to.equal ""
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new String(""))).throws TypeError

  it "typed parameters, special type or String or null", #
    let Thing()! ->
  
    let fun(val as Thing|String|null) -> val
  
    let x = new Thing()
    expect(fun(x)).to.equal x
    expect(#-> fun(0)).throws TypeError
    expect(fun()).to.be.null
    expect(fun(void)).to.be.null
    expect(fun(null)).to.be.null
    expect(#-> fun(true)).throws TypeError, "Expected val to be one of Thing or String or null, got Boolean"
    expect(#-> fun(false)).throws TypeError
    expect(fun("")).to.equal ""
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
    expect(#-> fun(new String(""))).throws TypeError

  it "typed array parameter", #
    let fun(val as [String]) -> val

    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(fun(["alpha"])).to.eql ["alpha"]
    expect(fun(["alpha", "bravo"])).to.eql ["alpha", "bravo"]
    expect(fun(["alpha", "bravo", "charlie"])).to.eql ["alpha", "bravo", "charlie"]
    expect(#-> fun([1])).throws TypeError, "Expected val[0] to be a String, got Number"
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([{}])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError

  it "typed array as generic", #
    let fun(val as Array<String>) -> val

    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(fun(["alpha"])).to.eql ["alpha"]
    expect(fun(["alpha", "bravo"])).to.eql ["alpha", "bravo"]
    expect(fun(["alpha", "bravo", "charlie"])).to.eql ["alpha", "bravo", "charlie"]
    expect(#-> fun([1])).throws TypeError, "Expected val[0] to be a String, got Number"
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([{}])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError

  it "typed array parameter of typed array parameter", #
    let fun(val as [[String]]) -> val

    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(fun([[]])).to.eql [[]]
    expect(fun([[], ["alpha"]])).to.eql [[], ["alpha"]]
    expect(fun([[], ["alpha"], ["bravo", "charlie"]])).to.eql [[], ["alpha"], ["bravo", "charlie"]]
    expect(#-> fun([1])).throws TypeError, "Expected val[0] to be an Array, got Number"
    expect(#-> fun([[1]])).throws TypeError, "Expected val[0][0] to be a String, got Number"
    expect(#-> fun([["alpha"], [1]])).throws TypeError, "Expected val[1][0] to be a String, got Number"
    expect(#-> fun(["alpha"])).throws TypeError
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([{}])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError

  it "typed array parameter of specific objects", #
    let fun(val as [{x: String}]) -> return for {x} in val; x

    expect(#-> fun(0)).throws TypeError, "Expected val to be an Array, got Number"
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(#-> fun(["alpha"])).throws TypeError, "Expected val[0] to be an Object, got String"
    expect(#-> fun([{}])).throws TypeError
    expect(fun([{x: "alpha"}])).to.eql ["alpha"]
    expect(fun([{x: "alpha"}, {x: "bravo"}])).to.eql ["alpha", "bravo"]
    expect(#-> fun([{x: "alpha"}, {x: 2}])).throws TypeError, "Expected val[1].x to be a String, got Number"
    expect(#-> fun([1])).throws TypeError
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError

  it "typed array parameter of specific objects with more than one key", #
    let fun(val as [{x: Number, y: Number}]) -> return for {x, y} in val; x * y

    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(#-> fun(["alpha"])).throws TypeError
    expect(#-> fun([{}])).throws TypeError
    expect(fun([{x: 2, y: 3}])).to.eql [6]
    expect(fun([{x: 5, y: 2, z: "blah!"}, {x: 100, y: 10, q: "ignored"}])).to.eql [10, 1000]
    expect(#-> fun([1])).throws TypeError
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError

  it "typed function parameter", #
    let fun(f as -> String) -> f()
  
    expect(fun #-> "hello").to.equal "hello"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed function parameter with argument", #
    let fun(f as Number -> String) -> f(0)
  
    expect(fun #(x) -> "hello$x").to.equal "hello0"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed function parameter with arguments", #
    let fun(f as (Number, Number) -> String) -> f(0, 1)
  
    expect(fun #(x, y) -> "hello $x $y").to.equal "hello 0 1"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed function which returns a typed function", #
    let fun(f as Number -> Number -> String) -> f(0)(1)
  
    expect(fun #(x) -> #(y) -> "hello $x $y").to.equal "hello 0 1"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed function which returns any", #
    let fun(f as ->) -> f()
  
    expect(fun #-> "hello").to.equal "hello"
    expect(fun #-> 10).to.equal 10
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed function which returns any but has a parameter", #
    let fun(f as Number ->) -> f(10)
  
    expect(fun #(x) -> "hello $x").to.equal "hello 10"
    expect(fun #(x) -> x * 10).to.equal 100
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed object or function", #
    let fun(x as {}|->)
      if typeof x == \function
        x()
      else
        x
  
    let obj = {}
    expect(fun obj).to.equal obj
    expect(fun #-> obj).to.equal obj
    expect(fun #-> "x").to.equal "x"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError

  it "typed function or object", #
    let fun(x as ->|{})
      if typeof x == \function
        x()
      else
        x
  
    let obj = {}
    expect(fun obj).to.equal obj
    expect(fun #-> obj).to.equal obj
    expect(fun #-> "x").to.equal "x"
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError

  it "function with return type", #
    let fun() as String -> "hello"
  
    expect(fun()).to.equal "hello"

  it "function with return type as a function", #
    let fun() as (Number -> String) -> #(i) -> String i
  
    expect(fun()(10)).to.equal "10"

  /*
  it "typed array parameter or null", #
    let fun(value as [String]|null) -> value
  
    expect(#-> fun(0)).throws TypeError
    expect(fun()).to.be.null
    expect(fun(void)).to.be.null
    expect(fun(null)).to.be.null
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(fun([])).to.eql []
    expect(fun(["alpha"])).to.eql ["alpha"]
    expect(fun(["alpha", "bravo"])).to.eql ["alpha", "bravo"]
    expect(fun(["alpha", "bravo", "charlie"])).to.eql ["alpha", "bravo", "charlie"]
    expect(#-> fun([1])).throws TypeError
    expect(#-> fun([null])).throws TypeError
    expect(#-> fun([void])).throws TypeError
    expect(#-> fun([false])).throws TypeError
    expect(#-> fun([{}])).throws TypeError
    expect(#-> fun([new String("hello")])).throws TypeError
  */

  it "typed parameter as access", #
    let ns = do
      let Thing()! ->
      { Thing }
  
    let fun(value as ns.Thing) -> value
  
    let alpha = new ns.Thing()
    let bravo = new ns.Thing()
    expect(fun(alpha)).to.equal alpha
    expect(fun(bravo)).to.equal bravo
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "Parenthetical access as function", #
    let map(array, func)
      return for x in array; func(x)
  
    expect(map ["alpha", "bravo", "charlie", "delta", "echo"], (.length)).to.eql [5, 5, 7, 5, 4]

  it "Parenthetical method call as function", #
    let map(array, func)
      return for x in array; func(x)

    expect(map ["alpha", "bravo", "charlie", "delta", "echo"], (.substring(2))).to.eql ["pha", "avo", "arlie", "lta", "ho"]

  it "Ignored parameter", #
    let f(, x) -> x
  
    expect(f()).to.be.undefined
    expect(f(5)).to.be.undefined
    expect(f(5, 6)).to.equal 6

  it "Ignored parameter in array", #
    let f([, x]) -> x
    expect(f []).to.be.undefined
    expect(f [5]).to.be.undefined
    expect(f [5, 6]).to.equal 6

  it "Ignored middle parameter", #
    let f(x, , y) -> [x, y]
  
    expect(f()).to.eql [void, void]
    expect(f(5)).to.eql [5, void]
    expect(f(5, 6)).to.eql [5, void]
    expect(f(5, 6, 7)).to.eql [5, 7]

  it "Ignored middle parameter in array", #
    let f([x, , y]) -> [x, y]
  
    expect(f []).to.eql [void, void]
    expect(f [5]).to.eql [5, void]
    expect(f [5, 6]).to.eql [5, void]
    expect(f [5, 6, 7]).to.eql [5, 7]

  it "Curried function", #
    let add(x, y)^ -> x + y
  
    expect(add 4, 6).to.equal 10
    let plus-5 = add 5
    expect(plus-5 5).to.equal 10
    expect(plus-5 10).to.equal 15
    expect(add()).to.equal add
    expect(plus-5()).to.equal plus-5
    let plus-4 = add 4
    expect(plus-4).to.not.equal plus-5
    expect(plus-4 6).to.equal 10

  it "Curried function takes the last this", #
    let get-this(x, y)^ -> this
  
    let obj = {}
    expect(get-this@({}, 1)@(obj, 2)).to.equal obj

  it "Generic function", #
    let f<T>(val as T) -> val
  
    expect(f<String>("Hello")).to.equal "Hello"
    expect(f<Number>(1234)).to.equal 1234
    expect(f<Boolean>(true)).to.be.true
    let obj = {}
    expect(f<Object>(obj)).to.equal obj
    let arr = []
    expect(f<Array>(arr)).to.equal arr
    expect(#-> f<String>(1234)).throws TypeError, "Expected val to be a String, got Number"
    expect(#-> f<Number>("hello")).throws TypeError
    expect(#-> f<Boolean>(0)).throws TypeError
    expect(#-> f<Boolean>({})).throws TypeError
    expect(#-> f<Object>(true)).throws TypeError
    expect(#-> f<Array>({})).throws TypeError
  
    let MyType() ->
    let my-obj = new MyType()
    expect(f<MyType>(my-obj)).to.equal my-obj
    expect(#-> f<MyType>("hello")).throws TypeError, "Expected val to be a MyType, got String"
  
    expect(f("Hello")).to.equal "Hello"
    expect(f<null>("Hello")).to.equal "Hello"
    expect(f<null>).to.equal f
    expect(f<Number>).to.equal f<Number>
    expect(f(1234)).to.equal 1234
    expect(f(null)).to.be.null
    expect(f(void)).to.be.undefined

  it "Generic anonymous function", #
    let call(arg, type, func) -> func<type>(arg)
    expect(call "Hello", String, #<T>(val as T) -> val).to.equal "Hello"
    expect(call 1234, Number, #<T>(val as T) -> val).to.equal 1234
    expect(call true, Boolean, #<T>(val as T) -> val).to.be.true
    expect(call "Hello", null, #<T>(val as T) -> val).to.equal "Hello"
    expect(#-> call(1234, String, #<T>(val as T) -> val)).throws TypeError, "Expected val to be a String, got Number"
    expect(#-> call("hello", Number, #<T>(val as T) -> val)).throws TypeError
  
    let check-equal(func)
      expect(func<null>).to.equal func
      expect(func<Number>).to.equal func<Number>
  
    check-equal #<T>(val as T) -> val

  it "Generic function as class", #
    let Box<T>(value as T)
      let self = if this instanceof Box<T>
        this
      else
        { extends Box<T>.prototype }
    
      self.value := value
    
      self
  
    expect(Box<String>("Hello").value).to.equal "Hello"
    expect(new Box<String>("Hello").value).to.equal "Hello"
    expect(Box<String>("Hello")).to.be.an.instanceof Box<String>
  
    expect(Box<Box<String>>(Box<String>("Hello")).value.value).to.equal "Hello"


  it "Generic function ignores provided generic arguments beyond the declared", #
    let func<T1, T2>() ->
  
    expect(func<String, String>).to.equal func<String, String>
    expect(func<String, Number>).to.not.equal func<String, String>
    expect(func<Number, String>).to.not.equal func<String, String>
    expect(func<Number, String>).to.not.equal func<String, Number>
    expect(func<String, Number>).to.equal func<String, Number>
    expect(func<Number, Number>).to.not.equal func<String, Number>
    expect(func<Number, Number>).to.not.equal func<Number, String>
    expect(func<Number, Number>).to.equal func<Number, Number>
  
    expect(func<Number, String, Boolean>).to.equal func<Number, String>
    expect(func<Number, String, null>).to.equal func<Number, String>
    expect(func<Number, String, void>).to.equal func<Number, String>
    expect(func<Number>).to.equal func<Number, null>
    expect(func<null, null>).to.equal func
    expect(func<void, void>).to.equal func
    expect(func<null>).to.equal func
    expect(func<void>).to.equal func
    expect(func<void, Boolean>).to.equal func<null, Boolean>
    expect(func<null, Boolean, Number>).to.equal func<null, Boolean>
    expect(func<null, Boolean, String>).to.equal func<null, Boolean>
    expect(func<null, Boolean, null>).to.equal func<null, Boolean>

  it "typed generic", #
    let MyType<T>(@value as T) ->
    let fun(x as MyType<Number>) -> x.value
  
    expect(new MyType<Number>(10).value).to.equal 10
    expect(new MyType<String>("hello").value).to.equal "hello"
    expect(fun new MyType<Number>(10)).to.equal 10
    expect(#-> fun(new MyType<String>("hello"))).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed generic of typed generic", #
    let MyType<T>(@value as T) ->
    let fun(x as MyType<MyType<Number>>) -> x.value.value

    expect(new MyType<Number>(10).value).to.equal 10
    expect(new MyType<String>("hello").value).to.equal "hello"
    expect(fun new MyType<MyType<Number>>(new MyType<Number>(10))).to.equal 10
    expect(#-> fun(new MyType<Number>(10))).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed generic of array", #
    let MyType<T>(@value as T) ->
    let fun(x as MyType<Array>) -> x.value

    expect(new MyType<Number>(10).value).to.equal 10
    expect(new MyType<String>("hello").value).to.equal "hello"
    expect(fun new MyType<Array>([1, 2])).to.eql [1, 2]
    expect(#-> fun(new MyType<Number>(10))).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed generic of array as []", #
    let MyType<T>(@value as T) ->
    let fun(x as MyType<[]>) -> x.value

    expect(new MyType<Number>(10).value).to.equal 10
    expect(new MyType<String>("hello").value).to.equal "hello"
    expect(fun new MyType<Array>([1, 2])).to.eql [1, 2]
    expect(#-> fun(new MyType<Number>(10))).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError

  it "typed generic of typed array", #
    let MyType<T>(@value as T) ->
    let fun(x as MyType<[Number]>) -> x.value

    expect(new MyType<Number>(10).value).to.equal 10
    expect(new MyType<String>("hello").value).to.equal "hello"
    expect(fun new MyType<Array>([1, 2])).to.eql [1, 2]
    expect(#-> fun(new MyType<Number>(10))).throws TypeError
    expect(#-> fun(0)).throws TypeError
    expect(#-> fun()).throws TypeError
    expect(#-> fun(void)).throws TypeError
    expect(#-> fun(null)).throws TypeError
    expect(#-> fun(true)).throws TypeError
    expect(#-> fun(false)).throws TypeError
    expect(#-> fun("")).throws TypeError
    expect(#-> fun({})).throws TypeError
    expect(#-> fun([])).throws TypeError
