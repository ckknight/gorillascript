test "existential return", #
  let fun(value)
    return? value
    "nope"
  
  eq "alpha", fun "alpha"
  array-eq [], fun []
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
  
  eq "alpha", fun(run-once "alpha")
  eq "nope", fun(run-once null)
  eq "nope", fun(run-once undefined)

test "existential member access", #
  let get(obj) -> obj?.key
  
  eq undefined, get()
  eq undefined, get(undefined)
  eq undefined, get(null)
  eq undefined, get({})
  eq "value", get({key: "value"})

test "existential member access only calculates object once", #
  let get(obj) -> obj()?.key
  
  eq undefined, get(run-once undefined)
  eq undefined, get(run-once null)
  eq undefined, get(run-once {})
  eq "value", get(run-once {key: "value"})

test "existential member access only calculates key once", #
  let get(obj, key) -> obj?[key()]
  
  eq undefined, get(undefined, run-once "key")
  eq undefined, get(null, run-once "key")
  eq undefined, get({}, run-once "key")
  eq "value", get({key: "value"}, run-once "key")

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
  
  eq undefined, call {}, run-once("key")
  ok call({ func: Class }, run-once("func")) instanceof Class
  let other = {}
  eq other, call { func: #-> other }, run-once("func")

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
  
  eq undefined, call undefined, run-once("key")
  eq undefined, call null, run-once("key")
  ok call({ func: Class }, run-once("func")) instanceof Class
  let obj = {}
  eq obj, call({ func: #-> obj }, run-once("func"))

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
  
  eq "alpha", exist run-once("alpha"), fail
  eq "", exist run-once(""), fail
  eq 0, exist run-once(0), fail
  eq false, exist run-once(false), fail
  eq "bravo", exist run-once(undefined), run-once "bravo"
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
  eq 1, exist-assign undefined, run-once 1

  eq "value", exist-member-assign {}, run-once("key"), run-once "value"
  eq "value", exist-member-assign {key:null}, run-once("key"), run-once "value"
  eq "value", exist-member-assign {key:undefined}, run-once("key"), run-once "value"
  eq "alpha", exist-member-assign {key:"alpha"}, run-once("key"), fail

