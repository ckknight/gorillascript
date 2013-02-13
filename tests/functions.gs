// basics of function testing before we add tests using `test`
let x = #-> "alpha"
eq "function", typeof x
eq "alpha", x()

test "simple function", #
  let fun = #-> "bravo"
  eq "function", typeof fun
  eq "bravo", fun()

test "function replacement", #
  let mutable fun = #-> "alpha"
  eq "alpha", fun()
  fun := #-> "bravo"
  eq "bravo", fun()

test "function replacement, no initial", #
  let mutable fun = void
  eq void, fun
  fun := #-> "alpha"
  eq "alpha", fun()
  fun := #-> "bravo"
  eq "bravo", fun()

test "function replacement with non-function", #
  let mutable fun = #-> "alpha"
  eq "alpha", fun()
  fun := "bravo"
  eq "bravo", fun

test "method definition and calling", #
  let obj = {}
  obj.x := #-> "charlie"
  eq "function", typeof obj.x
  eq "charlie", obj.x()
  obj.y := #-> this
  eq obj, obj.y()
  let other = {}
  eq other, obj.y.call(other)

test "object definition with inline methods", #
  let obj = {
    x: #-> "charlie"
    y: #-> this
  }
  
  eq "charlie", obj.x()
  eq obj, obj.y()
  let other = {}
  eq other, obj.y.call(other)

test "bound function", #
  let outer = #
    #@ -> this
  
  let obj = {}
  let inner = outer.call(obj)
  let other = {}
  eq obj, inner()
  eq obj, inner.call(other)
  eq other, outer.call(other)()
  eq other, outer.call(other).call(obj)

test "nested bound function", #
  let obj = {}
  let outer = #
    eq obj, this
    #@
      eq obj, this
      #@
        eq obj, this
        #@ -> this
  
  let inner = outer.call(obj)
  eq obj, inner.call({}).call({}).call({})

test "bound function doesn't get overly bound", #
  let alpha = {}
  let bravo = {}
  let outer = #
    eq alpha, this
    #@
      eq alpha, this
      # // not bound
        eq bravo, this
        #@ -> this
  
  let ignored = {}
  eq bravo, outer.call(alpha).call(ignored).call(bravo).call(ignored)

test "bound method inside object", #
  let make-object = # -> {
    x: #-> this
    y: #@-> this
  }
  
  let other = {}
  let obj = make-object.call(other)
  eq obj, obj.x()
  eq other, obj.y()

test "function self-redeclaration", #
  let mutable fun = #
    fun := #-> "bravo"
    "alpha"
  
  eq "alpha", fun()
  eq "bravo", fun()
  eq "bravo", fun()

test "simple arguments", #
  let obj = {}
  let ret-obj = #-> obj
  let id = #(i) -> i
  let add = #(x, y) -> x + y
  
  eq 0, ret-obj.length
  eq 1, id.length
  eq 2, add.length
  
  eq obj, ret-obj()
  eq obj, id(obj)
  eq obj, (id obj)
  eq 3, add(1, 2)
  eq 3, (add 1, 2)

test "unnecessary trailing comma", #
  let obj = {}
  let ret-obj = #(,) -> obj
  let id = #(i,) -> i
  let add = #(x, y,) -> x + y

  eq 0, ret-obj.length
  eq 1, id.length
  eq 2, add.length

  eq obj, ret-obj()
  eq obj, id(obj)
  eq obj, (id obj)
  eq 3, add(1, 2)
  eq 3, (add 1, 2)

test "recursive function", #
  let factorial(n)
    if n <= 1
      1
    else
      n * factorial(n - 1)
  
  eq 1, factorial(0)
  eq 1, factorial(1)
  eq 2, factorial(2)
  eq 2 * 3, factorial(3)
  eq 2 * 3 * 4, factorial(4)
  eq 2 * 3 * 4 * 5, factorial(5)
  eq 2 * 3 * 4 * 5 * 6, factorial(6)
  eq 2 * 3 * 4 * 5 * 6 * 7, factorial(7)

test "simple spread arguments", #
  let fun(...args) -> args
  
  let obj = {}
  eq 0, fun.length
  ok is-array! fun() // not an Arguments type
  eq 0, fun().length
  eq 1, fun(obj).length
  eq obj, fun(obj)[0]
  let other = {}
  array-eq [obj, other], fun(obj, other)

test "spread arguments with leading arguments", #
  let fun(first, ...rest) -> [first, rest]
  
  eq 1, fun.length
  ok is-array! fun()[1]
  ok is-array! fun({})[1]
  array-eq [void, []], fun()
  let alpha = {}
  array-eq [alpha, []], fun(alpha)
  let bravo = {}
  array-eq [alpha, [bravo]], fun(alpha, bravo)
  let charlie = {}
  array-eq [alpha, [bravo, charlie]], fun(alpha, bravo, charlie)

test "spread arguments with trailing arguments", #
  let fun(...start, last) -> [start, last]
  
  eq 0, fun.length
  ok is-array! fun()[0]
  ok is-array! fun({})[0]
  array-eq [[], void], fun()
  let alpha = {}
  array-eq [[], alpha], fun(alpha)
  let bravo = {}
  array-eq [[alpha], bravo], fun(alpha, bravo)
  let charlie = {}
  array-eq [[alpha, bravo], charlie], fun(alpha, bravo, charlie)

test "spread arguments is mutable within function", #
  let alpha = {}
  let fun(...args)
    args.push(alpha)
    args
  
  eq 0, fun.length
  array-eq [alpha], fun()
  let bravo = {}
  array-eq [bravo, alpha], fun(bravo)
  let charlie = {}
  array-eq [bravo, charlie, alpha], fun(bravo, charlie)

test "multiple spread arguments is an Error", #
  throws #-> gorilla.compile("""let x = 0
  let f(...a, ...b) ->"""), #(e) -> e.line == 2

test "special `arguments` variable is still available", #
  let fun() -> arguments
  
  eq 0, fun.length
  ok {}.to-string.call(fun()) == "[object Arguments]" // not [object Array]
  array-eq [], Array::slice.call(fun())
  let alpha = {}
  array-eq [alpha], Array::slice.call(fun(alpha))
  let bravo = {}
  array-eq [alpha, bravo], Array::slice.call(fun(alpha, bravo))

test "calling a function with spread", #
  let add(x, y) -> x + y
  
  eq 2, add.length
  eq 3, add(...[1, 2])
  let nums = [1, 2]
  eq 3, add(...nums)
  nums.push 3
  eq 3, add(...nums) // last argument is ignored
  
  let fun(...args) -> args
  
  eq 0, fun.length
  array-eq ["alpha", "bravo"], fun(...["alpha", "bravo"])
  let args = ["alpha", "bravo"]
  array-eq ["alpha", "bravo"], fun(...args)
  ok fun(...args) != args // may have equivalent innards, but different references
  args.push "charlie"
  array-eq ["alpha", "bravo", "charlie"], fun(...args)
  
  args.splice(0, args.length)
  array-eq [], fun()
  array-eq [], fun(...[])
  array-eq [], fun(...args)
  args.push(null)
  array-eq [null], fun(null)
  array-eq [null], fun(...[null])
  array-eq [null], fun(...args)
  args[0] := void
  array-eq [void], fun(void)
  array-eq [void], fun(...[void])
  array-eq [void], fun(...args)

test "calling a function with multiple spreads", #
  let fun(...args) -> args
  
  let alpha = [1, 2, 3]
  let bravo = [4, 5, 6]
  
  array-eq [1, 2, 3, 4, 5, 6], fun(...alpha, ...bravo)
  array-eq ["a", 1, 2, 3, 4, 5, 6], fun("a", ...alpha, ...bravo)
  array-eq [1, 2, 3, "b", 4, 5, 6], fun(...alpha, "b", ...bravo)
  array-eq [1, 2, 3, 4, 5, 6, "c"], fun(...alpha, ...bravo, "c")
  array-eq ["a", 1, 2, 3, "b", 4, 5, 6], fun("a", ...alpha, "b", ...bravo)
  array-eq ["a", 1, 2, 3, 4, 5, 6, "c"], fun("a", ...alpha, ...bravo, "c")
  array-eq [1, 2, 3, "b", 4, 5, 6, "c"], fun(...alpha, "b", ...bravo, "c")
  array-eq ["a", 1, 2, 3, "b", 4, 5, 6, "c"], fun("a", ...alpha, "b", ...bravo, "c")

test "calling a method with spread", #
  let obj = {
    fun: #(...args) -> [this, args]
  }
  let other = {}
  
  eq 0, obj.fun.length
  
  array-eq [obj, ["alpha", "bravo"]], obj.fun(...["alpha", "bravo"]), "literal array spread"
  let args = ["alpha", "bravo"]
  array-eq [obj, ["alpha", "bravo"]], obj.fun(...args), "normal"
  args.push "charlie"
  array-eq [obj, ["alpha", "bravo", "charlie"]], obj.fun(...args), "normal"
  
  array-eq [other, ["alpha", "bravo"]], obj.fun.call(other, ...["alpha", "bravo"]), "literal array spread on call"
  array-eq [other, ["alpha", "bravo", "charlie"]], obj.fun.call(other, ...args), "spread on call"
  args.push "delta"
  array-eq [other, ["alpha", "bravo", "charlie", "delta"]], obj.fun.call(other, ...args), "spread on call"

test "calling a function with spread will only access object once", #
  let fun(...args) -> args
  
  let args = run-once(["alpha", "bravo"])
  array-eq ["alpha", "bravo"], fun(...args())

test "calling a function with spread will only access function once", #
  let get-fun = run-once #(...args) -> args
  
  let args = ["alpha", "bravo"]
  array-eq ["alpha", "bravo"], get-fun()(...args)

test "calling a method with spread will only access object once", #
  let get-obj = run-once {
    fun: #(...args)
      if this.method-called
        fail "method called more than once"
      
      this.method-called := true
      
      args
  }
  
  let args = ["alpha", "bravo"]
  array-eq ["alpha", "bravo"], get-obj().fun(...args)

test "spread arguments in middle", #
  let fun(first, ...middle, last) -> [first, middle, last]
  
  eq 1, fun.length
  array-eq [void, [], void], fun()
  array-eq ["alpha", [], void], fun("alpha")
  array-eq ["alpha", [], "bravo"], fun("alpha", "bravo")
  array-eq ["alpha", ["bravo"], "charlie"], fun("alpha", "bravo", "charlie")
  array-eq ["alpha", ["bravo", "charlie"], "delta"], fun("alpha", "bravo", "charlie", "delta")
  
  let args = []
  array-eq [void, [], void], fun(...args)
  args.push("alpha")
  array-eq ["alpha", [], void], fun(...args)
  args.push("bravo")
  array-eq ["alpha", [], "bravo"], fun(...args)
  args[0] := "bravo"
  args[1] := "charlie"
  array-eq ["alpha", ["bravo"], "charlie"], fun("alpha", ...args)
  array-eq ["alpha", ["bravo", "charlie"], "delta"], fun("alpha", ...args, "delta")

  let fun2(a, b, ...c, d, e) -> [a, b, c, d, e]
  
  eq 2, fun2.length
  array-eq [void, void, [], void, void], fun2()
  array-eq ["alpha", void, [], void, void], fun2("alpha")
  array-eq ["alpha", "bravo", [], void, void], fun2("alpha", "bravo")
  array-eq ["alpha", "bravo", [], "charlie", void], fun2("alpha", "bravo", "charlie")
  array-eq ["alpha", "bravo", [], "charlie", "delta"], fun2("alpha", "bravo", "charlie", "delta")
  array-eq ["alpha", "bravo", ["charlie"], "delta", "echo"], fun2("alpha", "bravo", "charlie", "delta", "echo")
  array-eq ["alpha", "bravo", ["charlie", "delta"], "echo", "foxtrot"], fun2("alpha", "bravo", "charlie", "delta", "echo", "foxtrot")
  
  args.splice(0, args.length)
  array-eq [void, void, [], void, void], fun2(...args)
  args.push("alpha")
  array-eq ["alpha", void, [], void, void], fun2(...args)
  args.push("bravo")
  array-eq ["alpha", "bravo", [], void, void], fun2(...args)
  args.push("charlie")
  array-eq ["alpha", "bravo", [], "charlie", void], fun2(...args)
  args.push("delta")
  array-eq ["alpha", "bravo", [], "charlie", "delta"], fun2(...args)
  args.shift()
  args.push("echo")
  array-eq ["alpha", "bravo", ["charlie"], "delta", "echo"], fun2("alpha", ...args)
  array-eq ["alpha", "bravo", ["charlie", "delta"], "echo", "foxtrot"], fun2("alpha", ...args, "foxtrot")
  args.shift()
  args.push("foxtrot")
  array-eq ["alpha", "bravo", ["charlie", "delta", "echo"], "foxtrot", "golf"], fun2("alpha", "bravo", ...args, "golf")
  array-eq ["alpha", "bravo", ["charlie", "delta", "echo", "foxtrot"], "golf", "hotel"], fun2("alpha", "bravo", ...args, "golf", "hotel")

test "default values", #
  let obj = {}
  let fun = #(alpha = obj) -> alpha
  
  eq 1, fun.length
  eq obj, fun()
  eq obj, fun(null)
  eq obj, fun(void)
  let other = {}
  eq other, fun(other)
  eq 0, fun(0)
  eq false, fun(false)
  eq "", fun("")
  eq obj, fun(...[])
  eq obj, fun(...[null])
  eq obj, fun(...[void])
  eq other, fun(...[other])
  let arr = [other]
  eq other, fun(...arr)

test "default values and spreads", #
  let fun(a = 2, ...b, c = 3, d = 5)
    a * c * d * (b.length + 1)
  
  eq 1, fun.length
  eq 2 * 3 * 5, fun()
  eq 3 * 5, fun(1)
  eq 5, fun(1, 1)
  eq 1, fun(1, 1, 1)
  eq 2, fun(1, "x", 1, 1)

test "default value create new object each access", #
  let fun(alpha = {}) -> alpha
  
  let a = fun(null)
  ok a
  let b = fun(void)
  ok b
  ok a != b

test "default value call function each access", #
  let mutable i = 0
  let make()
    i += 1
    i
  let fun = #(value = make()) -> value
  
  eq 1, fun()
  eq 2, fun(null)
  eq 5, fun(5)
  eq 3, fun(void)
  eq 4, fun(4)
  eq 4, fun()

test "function scope", #
  let mutable outer = 0
  let inc()
    outer += 1
    let inner = outer
    inner
  let reset()
    let inner = outer
    outer := 0
    inner

  eq 1, inc()
  eq 2, inc()
  eq 2, outer
  eq 2, reset()
  eq 0, outer

test "function scope with same-named variables", #
  let mutable value = 0
  let func()
    let mutable value = 5
    value += 1
    value
  
  eq 0, value
  eq 6, func()
  eq 0, value
  eq 6, func()
  eq 0, value
  eq 6, func()

/*
test "mutable functions", ->
  let fun = mutable -> 0
  fun.name = "fun"
*/

test "fancy whitespace", #
  let fun = #(
    a,
    b = []
    ,
  ) -> [a, b]
  
  array-eq ["alpha", []], fun("alpha")
  array-eq ["alpha", "bravo"], fun("alpha", "bravo")

test "setting values on this by their parameters", #
  let fun(this.alpha, this.bravo) ->
  
  let obj = {}
  fun.call(obj, "charlie", "delta")
  eq "charlie", obj.alpha
  eq "delta", obj.bravo
  
  let spread(...this.args) ->
  spread.call(obj, "echo", "foxtrot")
  array-eq ["echo", "foxtrot"], obj.args

test "setting values on @ by their parameters", #
  let fun(@alpha, @bravo) ->
  
  let obj = {}
  fun.call(obj, "charlie", "delta")
  eq "charlie", obj.alpha
  eq "delta", obj.bravo
  
  let spread(...@args) ->
  spread.call(obj, "echo", "foxtrot")
  array-eq ["echo", "foxtrot"], obj.args

test "setting values on @ by their parameters with defaults", #
  let fun = #(@alpha = 0, @bravo = 1) -> [alpha, bravo]
  
  let mutable obj = {}
  array-eq [0, 1], fun.call(obj)
  eq 0, obj.alpha
  eq 1, obj.bravo
  
  obj := {}
  array-eq ["charlie", 1], fun.call(obj, "charlie")
  eq "charlie", obj.alpha
  eq 1, obj.bravo
  
  obj := {}
  array-eq ["charlie", "delta"], fun.call(obj, "charlie", "delta")
  eq "charlie", obj.alpha
  eq "delta", obj.bravo

test "reserved word as parameter", #
  for name in require('../lib/parser').get-reserved-words()
    throws #-> gorilla.compile("""let z = 5
    let fun(x, $name) ->"""), #(e) -> e.line == 2, name

test "eval is still usable, in case someone wants to use it", #
  eq 5, eval("5")
  let f() -> "hello"
  eq "hello", eval("f()")

test "chained function calls", #
  let wrap(x) -> #-> x
  
  let obj = {}
  eq obj, wrap(wrap(obj))()()
  eq obj, (wrap wrap obj)()()

test "passing two functions without paren-wrapping", #
  let sum(a, b) -> a() + b()
  
  eq 10, sum #-> 1 + 2, #-> 3 + 4

test "passing two functions with paren-wrapping", #
  let sum(a, b) -> a() + b()
  
  eq 10, sum(#-> 1 + 2
    #-> 3 + 4)

/*
test "chained method calls without paren-wrapping", -> do
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
  array-eq ["a", "b", "c"], counter.result
end
*/

test "method calls with implicit last object", #
  let fun(...args, options = {})
    let opt = []
    for k, v of options
      opt.push([k, v])
    opt.sort #(a, b) -> a[0] <=> b[0]
    [args, opt]
  
  array-eq [["alpha", "bravo"], []], fun "alpha", "bravo", {}
  array-eq [["alpha", "bravo"], [["charlie", 1]]], fun "alpha", "bravo", charlie: 1
  array-eq [["alpha", "bravo"], [["charlie", 1], ["delta", 2]]], fun "alpha", "bravo", charlie: 1, delta: 2
  array-eq [["alpha"], [["charlie", 1], ["delta", 2], ["echo", 3]]], fun "alpha", charlie: 1, delta: 2, echo: 3
  array-eq [[], [["charlie", 1], ["delta", 2], ["echo", 3], ["foxtrot", 4]]], fun charlie: 1, delta: 2, echo: 3, foxtrot: 4
  
  array-eq [["alpha", "bravo"], []], fun("alpha", "bravo", {})
  array-eq [["alpha", "bravo"], [["charlie", 1]]], fun("alpha", "bravo", charlie: 1)
  array-eq [["alpha", "bravo"], [["charlie", 1], ["delta", 2]]], fun("alpha", "bravo", charlie: 1, delta: 2)
  array-eq [["alpha"], [["charlie", 1], ["delta", 2], ["echo", 3]]], fun("alpha", charlie: 1, delta: 2, echo: 3)
  array-eq [[], [["charlie", 1], ["delta", 2], ["echo", 3], ["foxtrot", 4]]], fun(charlie: 1, delta: 2, echo: 3, foxtrot: 4)

test "whitespace checks", #
  let alpha(...args) -> args
  let bravo(options, ...rest)
    eq 0, rest.length
    (for k, v of options
      [k, v]).sort #(a, b) -> a[0] <=> b[0]
  let echo = bravo
  
  array-eq [[["charlie", "delta"]], [["foxtrot", "golf"]]], alpha(
    bravo { charlie: "delta" },
    echo { foxtrot: "golf" }
  )
  
  array-eq [[["charlie", "delta"]], [["foxtrot", "golf"]]], alpha(
    bravo { charlie: "delta" }
    echo { foxtrot: "golf" }
  )
  
  array-eq [[["charlie", "delta"]], [["foxtrot", "golf"]]], alpha(
    bravo charlie: "delta",
    echo foxtrot: "golf"
  )
  
  array-eq [[["charlie", "delta"]], [["foxtrot", "golf"]]], alpha(
    bravo charlie: "delta"
    echo foxtrot: "golf"
  )

test "duplicate parameter name", #
  throws #-> gorilla.compile("""let x = 0
  let fun(a, a) ->"""), #(e) -> e.line == 2

test "duplicate parameter name", #
  throws #-> gorilla.compile("""let x = 0
  let fun(a, [a]) ->"""), #(e) -> e.line == 2

test "duplicate parameter name", #
  throws #-> gorilla.compile("""let x = 0
  let fun([a], [a]) ->"""), #(e) -> e.line == 2

test "duplicate parameter name", #
  throws #-> gorilla.compile("""let x = 0
  let fun([a], {a}) ->"""), #(e) -> e.line == 2

test "typed parameters, Boolean", #
  let fun(value as Boolean) -> value
  
  eq false, fun(false)
  eq true, fun(true)
  eq false, fun(null)
  eq false, fun(void)
  eq false, fun()
  throws #-> fun(0), TypeError
  throws #-> fun(1), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun("stuff"), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Boolean(false)), TypeError
  throws #-> fun(new Boolean(true)), TypeError

test "typed parameters, String", #
  let fun(value as String) -> value
  
  eq "", fun("")
  eq "hello", fun("hello")
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(0), TypeError
  throws #-> fun(NaN), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new String("")), TypeError
  throws #-> fun(new String("hello")), TypeError

test "typed parameters, Number", #
  let fun(value as Number) -> value
  
  eq 0, fun(0)
  eq 1, fun(1)
  eq -1, fun(-1)
  eq Infinity, fun(Infinity)
  eq -Infinity, fun(-Infinity)
  array-eq NaN, fun(NaN)
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Number(0)), TypeError
  throws #-> fun(new Number(1)), TypeError
  throws #-> fun(new Number(NaN)), TypeError
  throws #-> fun(new Number(Infinity)), TypeError

test "typed parameters, Function", #
  let fun(f as Function) -> f()
  
  eq 0, fun(#-> 0)
  eq "hello", fun(#-> "hello")
  throws #-> fun(), TypeError
  throws #-> fun(0), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed parameters, Array", #
  let fun(value as Array) -> value
  
  let getArgs() -> arguments
  
  let FakeArray()! ->
  FakeArray.prototype := []
  
  array-eq [], fun([])
  array-eq ["hello"], fun(["hello"])
  array-eq ["hello", 1, true], fun(["hello", 1, true])
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun(getArgs("hello")), TypeError
  throws #-> fun(new FakeArray()), TypeError

test "typed parameters, Array as []", #
  let fun(value as []) -> value
  
  let getArgs() -> arguments
  
  let FakeArray()! ->
  FakeArray.prototype := []
  
  array-eq [], fun([])
  array-eq ["hello"], fun(["hello"])
  array-eq ["hello", 1, true], fun(["hello", 1, true])
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun(getArgs("hello")), TypeError
  throws #-> fun(new FakeArray()), TypeError

test "typed parameters, Object", #
  let fun(value as Object) -> value
  
  array-eq [], fun([]) // technically valid
  let obj = {}
  eq obj, fun(obj)
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError

test "typed parameters, Object as {}", #
  let fun(value as {}) -> value
  
  array-eq [], fun([]) // technically valid
  let obj = {}
  eq obj, fun(obj)
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError

test "typed parameters, specific object", #
  let fun(value as {x: Number}) -> value.x
  
  let obj = {}
  throws #-> fun({}), TypeError
  eq 1, fun({x: 1})
  eq 1, fun({x: 1, y: 2})
  throws #-> fun([]), TypeError
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError

test "typed parameters, arbitrary ident", #
  let Thing()! ->
  let fun(value as Thing) -> value
  
  let alpha = new Thing()
  let bravo = new Thing()
  eq alpha, fun(alpha)
  eq bravo, fun(bravo)
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(0), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed parameters, Number or String", #
  let fun(value as Number|String) -> value
  
  eq 0, fun(0)
  eq 1, fun(1)
  eq -1, fun(-1)
  eq Infinity, fun(Infinity)
  eq -Infinity, fun(-Infinity)
  array-eq NaN, fun(NaN)
  eq "", fun("")
  eq "hello", fun("hello")
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Number(0)), TypeError
  throws #-> fun(new String("")), TypeError

test "typed parameters, Number or Boolean", #
  let fun(value as Number|Boolean) -> value
  
  eq 0, fun(0)
  eq 1, fun(1)
  eq -1, fun(-1)
  eq Infinity, fun(Infinity)
  eq -Infinity, fun(-Infinity)
  array-eq NaN, fun(NaN)
  eq false, fun()
  eq false, fun(void)
  eq false, fun(null)
  eq true, fun(true)
  eq false, fun(false)
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Number(0)), TypeError
  throws #-> fun(new Boolean(false)), TypeError

test "typed parameters, Number or null", #
  let fun(value as Number|null) -> value
  
  eq 0, fun(0)
  eq 1, fun(1)
  eq -1, fun(-1)
  eq Infinity, fun(Infinity)
  eq -Infinity, fun(-Infinity)
  array-eq NaN, fun(NaN)
  eq null, fun()
  eq null, fun(void)
  eq null, fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Number(0)), TypeError

test "typed parameters, Number or void", #
  let fun(value as Number|void) -> value
  
  eq 0, fun(0)
  eq 1, fun(1)
  eq -1, fun(-1)
  eq Infinity, fun(Infinity)
  eq -Infinity, fun(-Infinity)
  array-eq NaN, fun(NaN)
  eq void, fun()
  eq void, fun(void)
  eq void, fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Number(0)), TypeError

test "typed parameters, Boolean or null", #
  let fun(value as Boolean|null) -> value
  
  eq null, fun()
  eq true, fun(true)
  eq false, fun(false)
  eq null, fun(void)
  eq null, fun(null)
  throws #-> fun(0)
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Boolean(false)), TypeError

test "typed parameters, Boolean or void", #
  let fun(value as Boolean|void) -> value
  
  eq void, fun()
  eq true, fun(true)
  eq false, fun(false)
  eq void, fun(void)
  eq void, fun(null)
  throws #-> fun(0)
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Boolean(false)), TypeError

test "typed parameters, Boolean or null or void", #
  let fun(value as Boolean|null|void) -> value
  
  eq void, fun()
  eq true, fun(true)
  eq false, fun(false)
  eq void, fun(void)
  eq null, fun(null)
  throws #-> fun(0)
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new Boolean(false)), TypeError

test "typed parameters, special type or null", #
  let Thing()! ->
  
  let fun(value as Thing|null) -> value
  
  let x = new Thing()
  eq x, fun(x)
  throws #-> fun(0)
  eq null, fun()
  eq null, fun(void)
  eq null, fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed parameters, special type or String", #
  let Thing()! ->
  
  let fun(value as Thing|String) -> value
  
  let x = new Thing()
  eq x, fun(x)
  throws #-> fun(0)
  throws #-> fun()
  throws #-> fun(void)
  throws #-> fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  eq "", fun("")
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new String("")), TypeError

test "typed parameters, special type or String or null", #
  let Thing()! ->
  
  let fun(value as Thing|String|null) -> value
  
  let x = new Thing()
  eq x, fun(x)
  throws #-> fun(0), TypeError
  eq null, fun()
  eq null, fun(void)
  eq null, fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  eq "", fun("")
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError
  throws #-> fun(new String("")), TypeError

test "typed array parameter", #
  let fun(value as [String]) -> value

  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  array-eq [], fun([])
  array-eq ["alpha"], fun(["alpha"])
  array-eq ["alpha", "bravo"], fun(["alpha", "bravo"])
  array-eq ["alpha", "bravo", "charlie"], fun(["alpha", "bravo", "charlie"])
  throws #-> fun([1]), TypeError
  throws #-> fun([null]), TypeError
  throws #-> fun([void]), TypeError
  throws #-> fun([false]), TypeError
  throws #-> fun([{}]), TypeError
  throws #-> fun([new String("hello")]), TypeError

test "typed array parameter of typed array parameter", #
  let fun(value as [[String]]) -> value

  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  array-eq [], fun([])
  array-eq [[]], fun([[]])
  array-eq [[], ["alpha"]], fun([[], ["alpha"]])
  array-eq [[], ["alpha"], ["bravo", "charlie"]], fun([[], ["alpha"], ["bravo", "charlie"]])
  throws #-> fun([1]), TypeError
  throws #-> fun([[1]]), TypeError
  throws #-> fun([["alpha"], [1]]), TypeError
  throws #-> fun(["alpha"]), TypeError
  throws #-> fun([null]), TypeError
  throws #-> fun([void]), TypeError
  throws #-> fun([false]), TypeError
  throws #-> fun([{}]), TypeError
  throws #-> fun([new String("hello")]), TypeError

test "typed array parameter of specific objects", #
  let fun(value as [{x: String}]) -> return for {x} in value; x

  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  array-eq [], fun([])
  throws #-> fun(["alpha"]), TypeError
  throws #-> fun([{}]), TypeError
  array-eq ["alpha"], fun([{x: "alpha"}])
  array-eq ["alpha", "bravo"], fun([{x: "alpha"}, {x: "bravo"}])
  throws #-> fun([1]), TypeError
  throws #-> fun([null]), TypeError
  throws #-> fun([void]), TypeError
  throws #-> fun([false]), TypeError
  throws #-> fun([new String("hello")]), TypeError

test "typed array parameter of specific objects with more than one key", #
  let fun(value as [{x: Number, y: Number}]) -> return for {x, y} in value; x * y

  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  array-eq [], fun([])
  throws #-> fun(["alpha"]), TypeError
  throws #-> fun([{}]), TypeError
  array-eq [6], fun([{x: 2, y: 3}])
  array-eq [10, 1000], fun([{x: 5, y: 2, z: "blah!"}, {x: 100, y: 10, q: "ignored"}])
  throws #-> fun([1]), TypeError
  throws #-> fun([null]), TypeError
  throws #-> fun([void]), TypeError
  throws #-> fun([false]), TypeError
  throws #-> fun([new String("hello")]), TypeError

test "typed function parameter", #
  let fun(f as -> String) -> f()
  
  eq "hello", fun #-> "hello"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed function parameter with argument", #
  let fun(f as Number -> String) -> f(0)
  
  eq "hello0", fun #(x) -> "hello$x"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed function parameter with arguments", #
  let fun(f as (Number, Number) -> String) -> f(0, 1)
  
  eq "hello 0 1", fun #(x, y) -> "hello $x $y"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed function which returns a typed function", #
  let fun(f as Number -> Number -> String) -> f(0)(1)
  
  eq "hello 0 1", fun #(x) -> #(y) -> "hello $x $y"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed function which returns any", #
  let fun(f as ->) -> f()
  
  eq "hello", fun #-> "hello"
  eq 10, fun #-> 10
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed function which returns any but has a parameter", #
  let fun(f as Number ->) -> f(10)
  
  eq "hello 10", fun #(x) -> "hello $x"
  eq 100, fun #(x) -> x * 10
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "typed object or function", #
  let fun(x as {}|->)
    if typeof x == \function
      x()
    else
      x
  
  let obj = {}
  eq obj, fun obj
  eq obj, fun #-> obj
  eq "x", fun #-> "x"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError

test "typed function or object", #
  let fun(x as ->|{})
    if typeof x == \function
      x()
    else
      x
  
  let obj = {}
  eq obj, fun obj
  eq obj, fun #-> obj
  eq "x", fun #-> "x"
  throws #-> fun(0), TypeError
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError

test "function with return type", #
  let fun() as String -> "hello"
  
  eq "hello", fun()

test "function with return type as a function", #
  let fun() as (Number -> String) -> #(i) -> String i
  
  eq "10", fun()(10)

/*
test "typed array parameter or null", #
  let fun(value as [String]|null) -> value
  
  throws #-> fun(0), TypeError
  eq null, fun()
  eq null, fun(void)
  eq null, fun(null)
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun({}), TypeError
  array-eq [], fun([])
  array-eq ["alpha"], fun(["alpha"])
  array-eq ["alpha", "bravo"], fun(["alpha", "bravo"])
  array-eq ["alpha", "bravo", "charlie"], fun(["alpha", "bravo", "charlie"])
  throws #-> fun([1]), TypeError
  throws #-> fun([null]), TypeError
  throws #-> fun([void]), TypeError
  throws #-> fun([false]), TypeError
  throws #-> fun([{}]), TypeError
  throws #-> fun([new String("hello")]), TypeError
*/

test "typed parameter as access", #
  let ns = do
    let Thing()! ->
    { Thing }
  
  let fun(value as ns.Thing) -> value
  
  let alpha = new ns.Thing()
  let bravo = new ns.Thing()
  eq alpha, fun(alpha)
  eq bravo, fun(bravo)
  throws #-> fun(), TypeError
  throws #-> fun(void), TypeError
  throws #-> fun(null), TypeError
  throws #-> fun(""), TypeError
  throws #-> fun(true), TypeError
  throws #-> fun(false), TypeError
  throws #-> fun(0), TypeError
  throws #-> fun({}), TypeError
  throws #-> fun([]), TypeError

test "Parenthetical access as function", #
  let map(array, func)
    return for x in array; func(x)
  
  array-eq [5, 5, 7, 5, 4], map ["alpha", "bravo", "charlie", "delta", "echo"], (.length)

test "Parenthetical method call as function", #
  let map(array, func)
    return for x in array; func(x)

  array-eq ["pha", "avo", "arlie", "lta", "ho"], map ["alpha", "bravo", "charlie", "delta", "echo"], (.substring(2))

test "Ignored parameter", #
  let f(, x) -> x
  
  eq void, f()
  eq void, f(5)
  eq 6, f(5, 6)

test "Ignored parameter in array", #
  let f([, x]) -> x
  eq void, f []
  eq void, f [5]
  eq 6, f [5, 6]

test "Ignored middle parameter", #
  let f(x, , y) -> [x, y]
  
  array-eq [void, void], f()
  array-eq [5, void], f(5)
  array-eq [5, void], f(5, 6)
  array-eq [5, 7], f(5, 6, 7)

test "Ignored middle parameter in array", #
  let f([x, , y]) -> [x, y]
  
  array-eq [void, void], f []
  array-eq [5, void], f [5]
  array-eq [5, void], f [5, 6]
  array-eq [5, 7], f [5, 6, 7]
