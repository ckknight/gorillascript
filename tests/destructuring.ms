test "array parameter", #
  let fun([a, b]) -> [a, b]
  
  eq \function, typeof fun
  eq 1, fun.length
  array-eq [void, void], fun([])
  array-eq ["a", void], fun(["a"])
  array-eq ["a", "b"], fun(["a", "b"])
  array-eq ["a", "b"], fun(["a", "b", "c"])
  array-eq ["a", "b"], fun(["a", "b"], "c")
  array-eq ["a", void], fun(["a"], "b", "c")

test "array parameter destructure with spread", #
  let fun([a, ...b]) -> [a, b]
  
  array-eq [void, []], fun([])
  array-eq ["a", []], fun(["a"])
  array-eq ["a", ["b"]], fun(["a", "b"])
  array-eq ["a", ["b", "c"]], fun(["a", "b", "c"])


test "array parameter destructure with spread in middle", #
  let fun([a, ...b, c]) -> [a, b, c]
  
  array-eq [void, [], void], fun([])
  array-eq ["a", [], void], fun(["a"])
  array-eq ["a", [], "b"], fun(["a", "b"])
  array-eq ["a", ["b"], "c"], fun(["a", "b", "c"])
  array-eq ["a", ["b", "c"], "d"], fun(["a", "b", "c", "d"])

test "array parameter with this params", #
  let fun([@a, @b]) -> [a, b]
  
  let obj = {}
  eq \function, typeof fun
  eq 1, fun.length
  array-eq ["a", "b"], fun@ obj, ["a", "b"]
  eq "a", obj.a
  eq "b", obj.b

test "object parameter", #
  let fun({a, b}) -> [a, b]
  
  eq \function, typeof fun
  eq 1, fun.length
  array-eq [void, void], fun({})
  array-eq ["a", void], fun({"a"})
  array-eq ["a", "b"], fun({"a", "b"})
  array-eq ["a", "b"], fun({"a", "b", "c"})
  array-eq ["a", "b"], fun({"a", "b"}, "c")
  array-eq ["a", void], fun({"a"}, "b", "c")

test "object parameter with this params", #
  let fun({@a, @b}) -> [a, b]
  
  let obj = {}
  eq \function, typeof fun
  eq 1, fun.length
  array-eq ["a", "b"], fun@ obj, {"a", "b"}
  eq "a", obj.a
  eq "b", obj.b

test "deep array destructure in function parameter, this parameters", #
  let func([@alpha, [@bravo, [@charlie]]]) ->

  let obj = {}
  func@ obj, ["delta", ["echo", ["foxtrot"]]]
  eq "delta", obj.alpha
  eq "echo", obj.bravo
  eq "foxtrot", obj.charlie

test "deep object destructure in function parameter, this parameters", #
  let func({@alpha, bravo: { @charlie, delta: { @echo }}}) ->

  let obj = {}
  func.call(obj, { alpha: "foxtrot", bravo: { charlie: "golf", delta: { echo: "hotel" } } })
  eq "foxtrot", obj.alpha
  eq "golf", obj.charlie
  eq "hotel", obj.echo

test "mixed object and array destructure in function parameters, this parameters", #
  let func({@alpha, bravo: [@charlie, { @delta }]}) ->

  let obj = {}
  func@ obj, { alpha: "echo", bravo: ["foxtrot", { delta: "golf" }] }
  eq "echo", obj.alpha
  eq "foxtrot", obj.charlie
  eq "golf", obj.delta

test "let destructure", #
  let arr = ["a", "b", "c"]
  
  let [a, b, c] = arr
  
  eq "a", a
  eq "b", b
  eq "c", c

test "let destructure with call", #
  let f = run-once ["a", "b", "c"]
  
  let [a, b, c] = f()
  
  eq "a", a
  eq "b", b
  eq "c", c

test "let destructure with literal array", #
  let [a, b, c] = ["a", "b", "c"]
  
  eq "a", a
  eq "b", b
  eq "c", c

test "let destructure with a single element", #
  let f = run-once ["a", "b", "c"]
  
  let [a] = f()
  
  eq "a", a

test "let object destructure", #
  let obj = {a: "b", c: "d", e: "f"}
  
  let {a, c, e} = obj
  
  eq "b", a
  eq "d", c
  eq "f", e

test "let object destructure with named keys", #
  let obj = {a: "b", c: "d", e: "f"}
  
  let {a: b, c: d, e: f} = obj
  
  eq "b", b
  eq "d", d
  eq "f", f

test "let object destructure with call", #
  let fun = run-once {a: "b", c: "d", e: "f"}
  
  let {a, c, e} = fun()
  
  eq "b", a
  eq "d", c
  eq "f", e

test "let object destructure with call and named keys", #
  let fun = run-once {a: "b", c: "d", e: "f"}
  
  let {a: b, c: d, e: f} = fun()
  
  eq "b", b
  eq "d", d
  eq "f", f

test "let object destructure with literal object", #
  let {a, c, e} = {a: "b", c: "d", e: "f"}
  
  eq "b", a
  eq "d", c
  eq "f", e

test "let object destructure with literal object and named keys", #
  let {a: b, c: d, e: f} = {a: "b", c: "d", e: "f"}
  
  eq "b", b
  eq "d", d
  eq "f", f

test "let object destructure with a single element", #
  let fun = run-once {a: "b", c: "d", e: "f"}
  
  let {a} = fun()
  
  eq "b", a

test "let object destructure with a single element and named key", #
  let fun = run-once {a: "b", c: "d", e: "f"}
  
  let {a: b} = fun()
  
  eq "b", b
