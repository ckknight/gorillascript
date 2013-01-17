// normal invocation, before we start tests
ok true
ok not false
ok(true)
ok(not false)
success()

test "Normal invocation", #
  ok true
  ok not false
  ok(true)
  ok(not false)
  success()
  
  let id(x) -> x
  
  ok id true
  ok id(true)
  ok (id true)
  ok(id true)
  ok not id false
  ok not id(false)
  ok not (id false)
  ok (not id false)
  ok(not id false)
  
  if id true
    success()
  
  if not id true
    fail()

test "Spread invocation", #
  let f() -> [].slice.call(arguments)
  
  arrayEq [], f()
  arrayEq [1, 2, 3], f 1, 2, 3
  arrayEq [1, 2, 3], f(1, 2, 3)
  let arr = [1, 2, 3]
  arrayEq arr, f(...arr)
  arrayEq arr, f ...arr

test "Apply invocation", #
  let obj = {}
  let f() -> [this, [].slice.call(arguments)]
  
  arrayEq [obj, []], f@ obj
  let arr = []
  arrayEq [obj, []], f@ obj, ...arr
  arr.push 1, 2, 3
  arrayEq [obj, [1, 2, 3]], f@ obj, ...arr
  arr.unshift obj
  arrayEq [obj, [1, 2, 3]], f@ ...arr

test "New on the result of a call", #
  let f() -> Date
  let now = new Date().get-time()
  let weird-date = new (f()) now
  eq now, weird-date.get-time()

test "New on the result of a method call", #
  let g = {
    f: #-> Date
  }
  let now = new Date().get-time()
  let weird-date = new (g.f()) now
  eq now, weird-date.get-time()

test "New on the result of call with access", #
  let f = #-> {
    g: Date
  }
  let now = new Date().get-time()
  let weird-date = new (f().g) now
  eq now, weird-date.get-time()

test "New on an array index", #
  let now = new Date().get-time()
  let weird-date = new [Date][0] now
  eq now, weird-date.get-time()

test "New on a sliced array index", #
  let now = new Date().get-time()
  let weird-date = new [Date][0:1][0] now
  eq now, weird-date.get-time()
