test "existential return", #
  let fun(value)
    return? value
    "nope"
  
  eq "alpha", fun "alpha"
  arrayEq [], fun []
  let obj = {}
  eq obj, fun obj
  eq "nope", fun()
  eq "nope", fun undefined
  eq "nope", fun null
  eq 0, fun 0
  eq "", fun ""

test "existential return only calls value once", #
  let fun(callback)
    return? callback()
    "nope"
  
  eq "alpha", fun(runOnce "alpha")
  eq "nope", fun(runOnce null)
  eq "nope", fun(runOnce undefined)

test "existential member access", #
  let get(obj) -> obj?.key
  
  eq undefined, get()
  eq undefined, get(undefined)
  eq undefined, get(null)
  eq undefined, get({})
  eq "value", get({key: "value"})

test "existential member access only calculates object once", #
  let get(obj) -> obj()?.key
  
  eq undefined, get(runOnce undefined)
  eq undefined, get(runOnce null)
  eq undefined, get(runOnce {})
  eq "value", get(runOnce {key: "value"})

test "existential member access only calculates key once", #
  let get(obj, key) -> obj?[key()]
  
  eq undefined, get(undefined, runOnce "key")
  eq undefined, get(null, runOnce "key")
  eq undefined, get({}, runOnce "key")
  eq "value", get({key: "value"}, runOnce "key")

test "existential member access with trailing normal", #
  let get(obj) -> obj?.alpha.bravo

  eq undefined, get()
  eq undefined, get(undefined)
  eq undefined, get(null)
  throws #-> get({}), TypeError
  eq undefined, get({alpha: {}})
  eq "charlie", get({alpha: { bravo: "charlie" }})

test "existential member access with invocation", #
  let get(obj) -> obj?.method()
  
  eq undefined, get()
  eq undefined, get(undefined)
  eq undefined, get(null)
  throws #-> get({}), TypeError
  throws #-> get({method: null}), TypeError
  eq "result", get({method: #-> "result" })

test "existential member access with trailing invocation", #
  let get(obj) -> obj?.alpha.bravo()
  
  eq undefined, get()
  eq undefined, get(undefined)
  eq undefined, get(null)
  throws #-> get({}), TypeError
  throws #-> get({alpha: {}}), TypeError
  eq "charlie", get({alpha: { bravo: #-> "charlie" }})

test "existential new", #
  let call(func) -> new func?()
  
  let Class()! ->
  
  eq undefined, call()
  eq undefined, call undefined
  eq undefined, call null
  ok call(Class) instanceof Class
  let obj = {}
  eq obj, call #-> obj

test "existential new member", #
  let call(obj) -> new obj.func?()
  
  let obj = {func: #-> this}
  let Class()! ->
  
  eq undefined, call {}
  ok call({ func: Class }) instanceof Class
  let other = {}
  eq other, call { func: #-> other }

test "existential new member only calculates key once", #
  let call(obj, key) -> new obj[key()]?()
  
  let obj = {func: #-> this}
  let Class()! ->
  
  eq undefined, call {}, runOnce("key")
  ok call({ func: Class }, runOnce("func")) instanceof Class
  let other = {}
  eq other, call { func: #-> other }, runOnce("func")

test "existential new object", #
  let call(obj) -> new obj?.func()
    
  let Class()! ->
  
  eq undefined, call()
  eq undefined, call undefined
  eq undefined, call null
  ok call({ func: Class }) instanceof Class
  let obj = {}
  eq obj, call { func: #-> obj }

test "existential new object only calculates key once", #
  let call(obj, key) -> new obj?[key()]()
    
  let Class()! ->
  
  eq undefined, call undefined, runOnce("key")
  eq undefined, call null, runOnce("key")
  ok call({ func: Class }, runOnce("func")) instanceof Class
  let obj = {}
  eq obj, call({ func: #-> obj }, runOnce("func"))

test "existential prototype access", #
  let get(obj) -> obj?::key
  
  eq undefined, get undefined
  eq undefined, get {}
  eq undefined, get #->
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
  eq false, check(undefined)
  eq false, check(null)
  eq false, uncheck(0)
  eq false, uncheck("")
  eq false, uncheck(false)
  eq true, uncheck()
  eq true, uncheck(undefined)
  eq true, uncheck(null)

test "existential or operator", #
  let exist(x, y) -> x() ? y()
  
  eq "alpha", exist runOnce("alpha"), fail
  eq "", exist runOnce(""), fail
  eq 0, exist runOnce(0), fail
  eq false, exist runOnce(false), fail
  eq "bravo", exist runOnce(undefined), runOnce "bravo"
  eq "bravo", exist runOnce(null), runOnce "bravo"
  
  let f(a) -> a
  
  eq f, f ? "hey"
  eq f, f ?"hey"
  eq f, f?"hey"
  eq "hey", f? "hey"

test "existential or assign", #
  let existAssign(mutable x, y) -> x ?= y()
  let existMemberAssign(x, y, z) -> x[y()] ?= z()

  eq 0, existAssign 0, fail
  eq "", existAssign "", fail
  eq 1, existAssign null, runOnce 1
  eq 1, existAssign undefined, runOnce 1

  eq "value", existMemberAssign {}, runOnce("key"), runOnce "value"
  eq "value", existMemberAssign {key:null}, runOnce("key"), runOnce "value"
  eq "value", existMemberAssign {key:undefined}, runOnce("key"), runOnce "value"
  eq "alpha", existMemberAssign {key:"alpha"}, runOnce("key"), fail

