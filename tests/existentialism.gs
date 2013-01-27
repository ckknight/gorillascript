test "existential return", #
  let fun(value)
    return? value
    "nope"
  
  eq "alpha", fun "alpha"
  array-eq [], fun []
  let obj = {}
  eq obj, fun obj
  eq "nope", fun()
  eq "nope", fun void
  eq "nope", fun null
  eq 0, fun 0
  eq "", fun ""

test "existential return only calls value once", #
  let fun(callback)
    return? callback()
    "nope"
  
  eq "alpha", fun(run-once "alpha")
  eq "nope", fun(run-once null)
  eq "nope", fun(run-once void)

test "existential member access", #
  let get(obj) -> obj?.key
  
  eq void, get()
  eq void, get(void)
  eq void, get(null)
  eq void, get({})
  eq "value", get({key: "value"})

test "existential member access only calculates object once", #
  let get(obj) -> obj()?.key
  
  eq void, get(run-once void)
  eq void, get(run-once null)
  eq void, get(run-once {})
  eq "value", get(run-once {key: "value"})

test "existential member access only calculates key once", #
  let get(obj, key) -> obj?[key()]
  
  eq void, get(void, run-once "key")
  eq void, get(null, run-once "key")
  eq void, get({}, run-once "key")
  eq "value", get({key: "value"}, run-once "key")

test "existential member access with trailing normal", #
  let get(obj) -> obj?.alpha.bravo

  eq void, get()
  eq void, get(void)
  eq void, get(null)
  throws #-> get({}), TypeError
  eq void, get({alpha: {}})
  eq "charlie", get({alpha: { bravo: "charlie" }})

test "existential member access with invocation", #
  let get(obj) -> obj?.method()
  
  eq void, get()
  eq void, get(void)
  eq void, get(null)
  throws #-> get({}), TypeError
  throws #-> get({method: null}), TypeError
  eq "result", get({method: #-> "result" })

test "existential member access with trailing invocation", #
  let get(obj) -> obj?.alpha.bravo()
  
  eq void, get()
  eq void, get(void)
  eq void, get(null)
  throws #-> get({}), TypeError
  throws #-> get({alpha: {}}), TypeError
  eq "charlie", get({alpha: { bravo: #-> "charlie" }})

test "existential function", #
  let call(f) -> f?()
  
  eq void, call void
  eq void, call null
  eq void, call "hello"
  eq void, call 1234
  eq void, call #->
  eq null, call #-> null
  eq "hello", call #-> "hello"
  eq 1234, call #-> 1234

test "existential method", #
  let call(x) -> x.f?()
  
  eq void, call {}
  eq void, call {f:null}
  eq void, call {f:"hello"}
  eq void, call {f:1234}
  eq void, call {f:#->}
  eq null, call {f:#-> null}
  eq "hello", call {f:#-> "hello"}
  eq 1234, call {f:#-> 1234}
  let obj = {f:#->this}
  eq obj, call obj

test "existential method with variable key", #
  let call(x, k) -> x[k()]?()
  
  eq void, call {}, run-once "f"
  eq void, call {f:null}, run-once "f"
  eq void, call {f:"hello"}, run-once "f"
  eq void, call {f:1234}, run-once "f"
  eq void, call {f:#->}, run-once "f"
  eq null, call {f:#-> null}, run-once "f"
  eq "hello", call {f:#-> "hello"}, run-once "f"
  eq 1234, call {f:#-> 1234}, run-once "f"
  let obj = {f:#->this}
  eq obj, call obj, run-once "f"

test "deep existential access", #
  let fun(a, b, c, d) -> a?[b()]?[c()]?[d()]?()
  
  eq "hello", fun({
    x: {
      y: {
        z: #-> "hello"
      }
    }
  }, runOnce(\x), runOnce(\y), runOnce(\z))
  eq void, fun({
    x: {
      y: {
        z: "hello"
      }
    }
  }, runOnce(\x), runOnce(\y), runOnce(\z))
  eq void, fun({
    x: {
      y: {
        z: #-> "hello"
      }
    }
  }, runOnce(\x), runOnce(\y), runOnce(\w))
  eq void, fun({
    x: {
      y: {
        z: #-> "hello"
      }
    }
  }, runOnce(\x), runOnce(\w), fail)
  eq void, fun({
    x: {
      y: {
        z: #-> "hello"
      }
    }
  }, runOnce(\w), fail, fail)
  eq void, fun(null, fail, fail, fail)
  eq void, fun(void, fail, fail, fail)

test "existential new", #
  let call(func) -> new func?()
  
  let Class()! ->
  
  eq void, call()
  eq void, call void
  eq void, call null
  ok call(Class) instanceof Class
  let obj = {}
  eq obj, call #-> obj

test "existential new member", #
  let call(obj) -> new obj.func?()
  
  let obj = {func: #-> this}
  let Class()! ->
  
  eq void, call {}
  ok call({ func: Class }) instanceof Class
  let other = {}
  eq other, call { func: #-> other }

test "existential new member only calculates key once", #
  let call(obj, key) -> new obj[key()]?()
  
  let obj = {func: #-> this}
  let Class()! ->
  
  eq void, call {}, run-once("key")
  ok call({ func: Class }, run-once("func")) instanceof Class
  let other = {}
  eq other, call { func: #-> other }, run-once("func")

test "existential new object", #
  let call(obj) -> new obj?.func()
    
  let Class()! ->
  
  eq void, call()
  eq void, call void
  eq void, call null
  ok call({ func: Class }) instanceof Class
  let obj = {}
  eq obj, call { func: #-> obj }

test "existential new object only calculates key once", #
  let call(obj, key) -> new obj?[key()]()
    
  let Class()! ->
  
  eq void, call void, run-once("key")
  eq void, call null, run-once("key")
  ok call({ func: Class }, run-once("func")) instanceof Class
  let obj = {}
  eq obj, call({ func: #-> obj }, run-once("func"))

test "existential prototype access", #
  let get(obj) -> obj?::key
  
  eq void, get void
  eq void, get {}
  eq void, get #->
  let f = #->
  f::key := "blah"
  eq "blah", get f

test "existential check", #
  let check(obj) -> obj?
  let uncheck(obj) -> not obj?
  
  eq true, check(0)
  eq true, check("")
  eq true, check(false)
  eq false, check()
  eq false, check(void)
  eq false, check(null)
  eq false, uncheck(0)
  eq false, uncheck("")
  eq false, uncheck(false)
  eq true, uncheck()
  eq true, uncheck(void)
  eq true, uncheck(null)

test "existential or operator", #
  let exist(x, y) -> x() ? y()
  
  eq "alpha", exist run-once("alpha"), fail
  eq "", exist run-once(""), fail
  eq 0, exist run-once(0), fail
  eq false, exist run-once(false), fail
  eq "bravo", exist run-once(void), run-once "bravo"
  eq "bravo", exist run-once(null), run-once "bravo"
  
  let f(a) -> a
  
  eq f, f ? "hey"
  eq f, f ?"hey"
  //eq f, f?"hey"
  eq "hey", f? "hey"

test "existential or assign", #
  let exist-assign(mutable x, y) -> x ?= y()
  let exist-member-assign(x, y, z) -> x[y()] ?= z()

  eq 0, exist-assign 0, fail
  eq "", exist-assign "", fail
  eq 1, exist-assign null, run-once 1
  eq 1, exist-assign void, run-once 1

  eq "value", exist-member-assign {}, run-once("key"), run-once "value"
  eq "value", exist-member-assign {key:null}, run-once("key"), run-once "value"
  eq "value", exist-member-assign {key:void}, run-once("key"), run-once "value"
  eq "alpha", exist-member-assign {key:"alpha"}, run-once("key"), fail

test "existential check on global", #
  ok Math?
  ok Number?
  ok not NonexistentGlobal?

test "existential access on global", #
  eq Math.floor, Math?.floor
  eq void, NonexistentGlobal?.doesntExist()
