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
