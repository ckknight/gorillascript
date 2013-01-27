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
  
  array-eq [], f()
  array-eq [1, 2, 3], f 1, 2, 3
  array-eq [1, 2, 3], f(1, 2, 3)
  let arr = [1, 2, 3]
  array-eq arr, f(...arr)
  array-eq arr, f ...arr

test "Apply invocation", #
  let obj = {}
  let f() -> [this, [].slice.call(arguments)]
  
  array-eq [obj, []], f@ obj
  let arr = []
  array-eq [obj, []], f@ obj, ...arr
  arr.push 1, 2, 3
  array-eq [obj, [1, 2, 3]], f@ obj, ...arr
  arr.unshift obj
  array-eq [obj, [1, 2, 3]], f@ ...arr

test "invocation with multi-line arguments", #
  let f(...args) -> args
  
  array-eq [1, 2, 3, 4], f(
    1
    2
    3
    4)
  
  array-eq [1, 2, 3, 4], f(1
    2
    3
    4)
  
  array-eq [1, 2, 3, 4], f(1, 2
    3, 4)

test "invocation with multi-line arguments, unclosed", #
  let f(...args) -> args
  
  array-eq [1, 2, 3, 4], f 1,
    2
    3
    4
  
  array-eq [1, 2, 3, 4], f 1, 2, 3,
    4

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

test "Binding access", #
  let make-x()
    { key: #-> this }
  let alpha = {}
  let bravo = {}
  let x = make-x@ alpha
  eq bravo, x.key@ bravo
  eq x, x.key()
  let f = x@.key
  eq x, f()
  eq x, f@ bravo

test "Binding access with arguments", #
  let make-x()
    { key: #-> [this, ...arguments] }
  let alpha = {}
  let bravo = {}
  let x = make-x@ alpha
  array-eq [bravo], x.key@ bravo
  array-eq [bravo, alpha], x.key@ bravo, alpha
  array-eq [x], x.key()
  array-eq [x, alpha], x.key alpha
  let f = x@.key
  array-eq [x], f()
  array-eq [x, alpha], f alpha
  array-eq [x], f@ bravo
  array-eq [x, alpha], f@ bravo, alpha
