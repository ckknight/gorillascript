test "simple if statement", #
  let mutable hit-success = false
  if false
    fail()
  else if false
    fail()
  else
    success()
    hit-success := true
  
  ok hit-success
  hit-success := false
  
  if true
    success()
    hit-success := true
  else if true
    fail()
  else
    fail()
  
  ok hit-success

test "logical operators", #
  if false and true
    fail()
  else if true and false
    fail()
  else if false or false
    fail()
  else if false or true
    success()
  else
    fail()
  
  if false or true
    success()
  else if true
    fail()
  else
    fail()

test "variables in if statement", #
  let check(x)
    if x
      let y = 5
      eq 5, y
    else
      let z = 6
      eq 6, z
  
  check true
  check false

test "complex return from if statement", #
  let check(type, value)
    let result = if type
      let x = value
      x * x
    else
      let x = value
      x * 2
    result
  
  eq 25, check(true, 5)
  eq 36, check(true, 6)
  eq 10, check(false, 5)
  eq 12, check(false, 6)

test "simple unless statement", #
  unless true
    fail()
  else unless true
    fail()
  else
    success()
  
  unless false
    success()
  else unless false
    fail()
  else
    fail()

test "single-line", #
  let obj = {}
  let x = if false then fail() else obj
  eq obj, x
  let y = unless true then fail() else obj
  eq obj, y

test "single-line with semicolons", #
  let obj = {}
  let x = if false;fail()
  else;obj
  eq obj, x
  let y = unless true;fail()
  else;obj
  eq obj, y

test "If statement doesn't use ternary", #
  ok not gorilla.compile("""
  if Math then String else Object end""", bare: true).code.match(r"\?")

test "Return-If statement doesn't use ternary", #
  ok not gorilla.compile("""
  return if Math then String else Object end""", bare: true).code.match(r"\?")

test "Let-If statement doesn't use ternary", #
  ok not gorilla.compile("""
  let x = if Math then String else Object end""", bare: true).code.match(r"\?")

test "inline expression with lots of conditionals", #
  let fun(a, b, c, d, e, f, g, h, i)
    ok(if (if a() then b() else c())
      if d() then e() else f()
    else
      if g() then h() else i())
  
  let no = #-> false
  let yes = #-> true
  
  fun(no, fail, no, fail, fail, fail, no, fail, yes)
  fun(yes, yes, fail, yes, yes, fail, fail, fail, fail)

test "returnif", #
  let otherwise = {}
  let f(get-value)
    returnif get-value()
    otherwise

  let obj = {}
  eq obj, f(#-> obj)
  eq true, f(#-> true)
  eq otherwise, f(#-> 0)
  eq otherwise, f(#-> false)

test "returnunless", #
  let otherwise = {}
  let f(get-value)
    returnunless get-value()
    otherwise
  
  let obj = {}
  eq otherwise, f(#-> obj)
  eq otherwise, f(#-> true)
  eq false, f(#-> false)
  eq 0, f(#-> 0)

test "returnif with known boolean", #
  let otherwise = {}
  let f(x)
    returnif x == "yes"
    otherwise

  eq otherwise, f("no")
  eq true, f("yes")

test "returnunless with known boolean", #
  let otherwise = {}
  let f(x)
    returnunless x == "yes"
    otherwise

  eq false, f("no")
  eq otherwise, f("yes")
