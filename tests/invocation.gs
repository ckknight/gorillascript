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
  