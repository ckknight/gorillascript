test "simple switch expression", #
  let run(num)
    switch num
    // comment
    case 1; "one"
    case 2
      "two"
    // another comment, why not?
    case "a"
      "eh"
  
  eq "one", run 1
  eq "two", run 2
  eq "eh", run "a"
  eq void, run "other"

test "switch expression with fallthrough", #
  let run(num)
    switch num
    case 1; "one"
    case 2
      fallthrough
    case 3
      "two or three"
    case "a"
      "eh"
  
  eq "one", run 1
  eq "two or three", run 2
  eq "two or three", run 3
  eq "eh", run "a"
  eq void, run "other"

test "simple switch expression with default", #
  let run(num)
    switch num
    case 1; "one"
    case 2
      "two"
    case "a"
      "eh"
    default
      "unknown"
  
  eq "one", run 1
  eq "two", run 2
  eq "eh", run "a"
  eq "unknown", run "other"

test "switch expression with multi-valued case", #
  let run(num)
    switch num
    case 1, 2, 3; "one, two, or three"
    case 4, 5, 6
      "four, five, or six"
    default; "other"

  eq "one, two, or three", run 1
  eq "one, two, or three", run 2
  eq "one, two, or three", run 3

  eq "four, five, or six", run 4
  eq "four, five, or six", run 5
  eq "four, five, or six", run 6

  eq "other", run 0

test "switch expression as assignment", #
  let run(num)
    let result = switch num
    case 1; "one"
    case 2
      "two"
    result

  eq "one", run 1
  eq "two", run 2
  eq undefined, run 3

test "switch expression allows non-const case checks, stops on first success", #
  let f = runOnce 1
  switch 1
  case f()
    success()
    fallthrough
  case f()
    success()
  case f()
    fail()
  case f()
    fail()
  case f(), f(), f(), f()
    fail()

test "Switch should not fallthrough in a case where a return is present but not guaranteed", #
  let mutable value = 1
  switch true
  case true
    if not value
      return 5
  default
    value := 2
  eq 1, value

test "Switch should have this and arguments available in the cases when an implicit closure is made", #
  let fun(value)
    let result = switch value
    case "this"
      this
    //case "arguments"
    //  arguments
    result

  let obj = {}
  eq obj, fun.call(obj, "this")
  //arrayEq ["arguments"], fun("arguments")[:]
  //arrayEq ["arguments", "alpha", "bravo", "charlie"], fun("arguments", "alpha", "bravo", "charlie")[:]

test "Switch should have this and arguments available in the case checks when an implicit closure is made", #
  let fun(value)
    let result = switch value
    case this.value
      "this"
    //case arguments[1]
    //  "arguments"
    default
      "other"
    result

  eq "this", fun.call({value: "alpha"}, "alpha")
  //eq "arguments", fun.call({}, "bravo", "bravo")
  eq "other", fun.call({}, "bravo", "charlie")

test "Switch should have this available in the value check when an implicit closure is made", #
  let fun()
    let result = switch this.value
    case 1
      "one"
    case 2
      "two"
    result

  eq "one", fun.call({ value: 1 })
  eq "two", fun.call({ value: 2 })

/*
test "Switch should have arguments available in the value check when an implicit closure is made", #
  let fun()
    let result = switch arguments[0]
    case 1
      "one"
    case 2
      "two"
    result

  eq "one", fun(1)
  eq "two", fun(2)
*/

/*
test "Switch should break out of a while loop using break", #
  let mutable i = 0
  while i < 100, i += 1
    switch i
    case 10
      break
  eq 10, i
*/

test "break inside of a loop inside of a switch should break the loop", #
  let fun(value)
    switch value
    case 1
      let mutable i = 0
      while i < 100, i += 1
        if i == 10
          break
      i

  eq 10, fun(1)