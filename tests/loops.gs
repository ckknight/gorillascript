test "simple loop from 0 through 9", #
  let mutable j = 0
  for i in 0 til 10
    eq j, i
    j += 1
  eq 10, j // [0, 9], not [0, 10]

test "simple loop from 0 through 10, inclusive", #
  let mutable j = 0
  for i in 0 to 10
    eq j, i
    j += 1
  eq 11, j // [0, 10], not [0, 9]

test "simple loop from 0 through 8, evens only", #
  let mutable j = 0
  for i in 0 til 10 by 2
    eq j, i
    j += 2
  eq 10, j // [0, 8], not [0, 10]

test "simple loop from 0 through 10, evens only, inclusive", #
  let mutable j = 0
  for i in 0 to 10 by 2
    eq j, i
    j += 2
  eq 12, j // [0, 10], not [0, 12]

test "backwards loop", #
  let mutable j = 10
  for i in 10 til 0 by -1
    eq j, i
    j -= 1
  eq 0, j // [10, 1], not [10, 0]

test "backwards loop, inclusive", #
  let mutable j = 10
  for i in 10 to 0 by -1
    eq j, i
    j -= 1
  eq -1, j // [10, 0], not [10, 1]

test "loop with else", #
  let mutable sum = 0
  for i in 0 til 10
    sum += i
  else
    fail()
  eq 45, sum

  let mutable hit-else = false
  for i in 10 til 0
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "variable loop without step", #
  let test-loop(start, finish)
    let mutable j = start
    let mutable count = 0
    for i in start til finish
      eq j, i
      j += 1
      count += 1
    count
  eq 9, test-loop 0, 9
  eq 10, test-loop 0, 10
  eq 0, test-loop 10, 0 // unless step is specified, it will not go backwards automatically

test "variable loop with step", #
  let test-loop(start, finish, step)
    let mutable j = start
    let mutable count = 0
    for i in start til finish by step
      eq j, i
      j += step
      count += 1
    count
  eq 9, test-loop 0, 9, 1
  eq 10, test-loop 0, 10, 1
  eq 0, test-loop 10, 0, 1
  eq 5, test-loop 0, 9, 2
  eq 5, test-loop 0, 10, 2
  eq 0, test-loop 0, 5, -1
  eq 5, test-loop 5, 0, -1

test "loop variable start is only calculated once", #
  let start = run-once 0
  
  let mutable j = 0
  for i in start() til 10
    eq j, i
    j += 1
  eq 10, j

test "loop variable finish is only calculated once", #
  let finish = run-once 10
  
  let mutable j = 0
  for i in 0 til finish()
    eq j, i
    j += 1
  eq 10, j

test "loop variable step is only calculated once", #
  let step = run-once 1
  
  let mutable j = 0
  for i in 0 til 10 by step()
    eq j, i
    j += 1
  eq 10, j

test "loop variable step going backwards", #
  let step = run-once -1
  
  let mutable j = 10
  for i in 10 til 0 by step()
    eq j, i
    j -= 1
  eq 0, j

/*
test "loop variable finish is not respected when changed", #
  let mutable finish = 10
  
  let mutable sum = 0
  for i in 0 til finish
    finish := 20
    sum += i
  eq 45, sum

test "loop variable step is not respected when changed", #
  let mutable step = 1
  
  let mutable sum = 0
  for i in 0 til 10 by step
    step += 1
    sum += i
  eq 45, sum
*/

test "loop scope", #
  let funcs = []
  for i in 0 til 10
    funcs.push #-> i * i

  eq 0, funcs[0]()
  eq 1, funcs[1]()
  eq 4, funcs[2]()
  eq 9, funcs[3]()
  eq 81, funcs[9]()

test "loop scope using this", #
  let get-funcs()
    let funcs = []
    for i in 0 til 10
      funcs.push #@-> [this, i * i]
    funcs
  
  let obj = {}
  let funcs = get-funcs.call(obj)
  
  array-eq [obj, 0], funcs[0]()
  array-eq [obj, 81], funcs[9]()

test "multiple loops with same variables", #
  let mutable sum = 0
  for i in 1 til 10
    sum += i
  eq 45, sum
  for i in 9 til 0 by -1
    sum -= i
  eq 0, sum

test "loop scope with multiple variables", #
  let funcs = []
  for i in 0 til 10
    for j in 0 til 10
      funcs.push #-> i * j

  eq 0, funcs[0]()
  eq 20, funcs[45]()
  eq 81, funcs[99]()

test "loop scope with same variable used multiple times", #
  let funcs = []
  for i in 0 til 10
    funcs.push #-> i * i
  
  let mutable sum = 0
  for i in 0 til 100
    sum += i
  
  eq 4950, sum
  eq 0, funcs[0]()
  eq 1, funcs[1]()
  eq 4, funcs[2]()
  eq 9, funcs[3]()
  eq 81, funcs[9]()

test "multiple loops with same variables nested", #
  let mutable sum = 0
  for i in 1 til 10
    for j in 1 til i
      for k in 1 til j
        sum += 1
  
  eq 84, sum
  for k in 1 til 10
    for j in 1 til k
      for i in 1 til j
        sum -= 1
  
  eq 0, sum

test "continue", #
  let mutable count = 0
  for i in 0 til 100
    if i %% 2
      continue
    count += 1
  eq 50, count

test "break", #
  let mutable count = 0
  for i in 0 til 100
    if i == 50
      break
    else if i > 50
      fail()
    count += 1
  eq 50, count

test "while loop", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10
    sum += i
    i += 1
  eq 45, sum

test "while loop with break", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10
    sum += i
    if sum > 10
      break
    i += 1
  eq 15, sum
  eq 5, i

test "while loop with continue", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10
    i += 1
    if i % 2 == 0
      continue
    sum += i
  eq 25, sum

test "while loop with else", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10
    sum += i
    i += 1
  else
    fail()
  eq 45, sum
  
  let mutable hit-else = false
  while i < 10
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "until loop", #
  let mutable sum = 0
  let mutable i = 0
  until i > 10
    sum += i
    i += 1
  eq 55, sum

test "until loop with else", #
  let mutable sum = 0
  let mutable i = 0
  until i > 10
    sum += i
    i += 1
  else
    fail()
  eq 55, sum
  
  let mutable hit-else = false
  until i > 10
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "while loop with step", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10, i += 1
    sum += i
  eq 45, sum

test "while loop with step and else", #
  let mutable sum = 0
  let mutable i = 0
  while i < 10, i += 1
    sum += i
  else
    fail()
  eq 45, sum

  let mutable hit-else = false
  while i < 10, fail()
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "until loop with step", #
  let mutable sum = 0
  let mutable i = 0
  until i > 10, i += 1
    sum += i
  eq 55, sum

test "until loop with step and else", #
  let mutable sum = 0
  let mutable i = 0
  until i > 10, i += 1
    sum += i
  else
    fail()
  eq 55, sum
  
  let mutable hit-else = false
  until i > 10, fail()
    fail()
  else
    hit-else := true
    success()
  ok hit-else

/*
test "repeat-while loop", #
  let mutable sum = 0
  let mutable i = 0
  repeat while i < 10
    i += 1
    sum += i
  eq 10, i
  eq 55, sum
  
  throws #-> Cotton.compile("""
  repeat while true
    do-something()
  else
    throw Error()"""), (e) -> e.line == 3 or true

test "repeat-while false loop", #
  let mutable ran = false
  repeat while false
    ran := true
  ok ran

test "repeat-until loop", #
  let mutable sum = 0
  let mutable i = 0
  repeat until i > 10
    i += 1
    sum += i
  eq 11, i
  eq 66, sum
  
  throws #-> Cotton.compile("""
  repeat until true
    do-something()
  else
    throw Error()"""), (e) -> e.line == 3 or true
end
*/
test "object iteration loop", #
  let keys = []
  let obj = { a: 1, b: 4, c: 9, d: 16 }
  for k of obj
    keys.push k
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys

/*
test "object iteration loop does not respect mutable identifier if changed", #
  let keys = []
  let mutable obj = { a: 1, b: 4, c: 9, d: 16 }
  for k of obj
    keys.push(k)
    obj := {}
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys

test "object iteration loop does not respect mutable identifier if changed with value", #
  let items = []
  let mutable obj = { a: 1, b: 4, c: 9, d: 16 }
  for k, v of obj
    items.push [k, v]
    obj := {}
  items.sort #(a, b) -> a[0] <=> b[0]
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], items
*/

test "object iteration loop with value", #
  let data = []
  let obj = { a: 1, b: 4, c: 9, d: 16 }
  for k, v of obj
    data.push [k, v]
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with value and index", #
  let data = []
  let obj = { a: 1, b: 4, c: 9, d: 16 }
  let mutable j = 0
  for k, v, i of obj
    data.push [k, v]
    eq j, i
    j += 1
  eq j, 4
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with else", #
  let keys = []
  let obj = { a: 1, b: 4, c: 9, d: 16 }
  for k of obj
    keys.push k
  else
    fail()
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys
  
  let mutable hit-else = false
  let other = {}
  for k of other
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "object iteration loop with literal object", #
  let keys = []
  for k of { a: 1, b: 4, c: 9, d: 16 }
    keys.push k
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys

test "object iteration loop with value and literal object", #
  let data = []
  for k, v of { a: 1, b: 4, c: 9, d: 16 }
    data.push [k, v]
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with value and index and literal object", #
  let data = []
  let mutable j = 0
  for k, v, i of { a: 1, b: 4, c: 9, d: 16 }
    data.push [k, v]
    eq j, i
    j += 1
  eq j, 4
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with literal object", #
  let keys = []
  for k of { a: 1, b: 4, c: 9, d: 16 }
    keys.push k
  else
    fail()
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys
  
  let mutable hit-else = false
  for k of {}
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "object iteration loop only accesses object once", #
  let keys = []
  let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
  for k of obj()
    keys.push k
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys

test "object iteration loop with value only accesses object once", #
  let data = []
  let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
  for k, v of obj()
    data.push [k, v]
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with value and index only accesses object once", #
  let data = []
  let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
  let mutable j = 0
  for k, v, i of obj()
    data.push [k, v]
    eq j, i
    j += 1
  eq j, 4
  data.sort #(a, b) -> a[0] <=> b[0]
  
  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with inheritance", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16
  
  let keys = []
  for k ofall new Parent
    keys.push k
  keys.sort()
  array-eq ["a", "b", "c", "d"], keys

test "object iteration loop with inheritance and value", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16

  let data = []
  for k, v ofall new Parent
    data.push [k, v]
  data.sort #(a, b) -> a[0] <=> b[0]

  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop with inheritance and value and index", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16

  let data = []
  let mutable j = 0
  for k, v, i ofall new Parent
    data.push [k, v]
    eq j, i
    j += 1
  eq 4, j
  data.sort #(a, b) -> a[0] <=> b[0]

  array-eq [["a", 1], ["b", 4], ["c", 9], ["d", 16]], data

test "object iteration loop without inheritance", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16
  
  let keys = []
  for k of new Parent
    keys.push k
  keys.sort()
  array-eq ["a", "b"], keys

test "object iteration loop without inheritance and value", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16

  let data = []
  for k, v of new Parent
    data.push [k, v]
  data.sort #(a, b) -> a[0] <=> b[0]

  array-eq [["a", 1], ["b", 4]], data

test "object iteration loop without inheritance and value and index", #
  let Parent()!
    this.a := 1
    this.b := 4
  Parent::c := 9
  Parent::d := 16

  let data = []
  let mutable j = 0
  for k, v, i of new Parent
    data.push [k, v]
    eq j, i
    j += 1
  eq 2, j
  data.sort #(a, b) -> a[0] <=> b[0]
  array-eq [["a", 1], ["b", 4]], data

test "iteration loop", #
  let mutable sum = 0
  let arr = [1, 4, 9, 16]
  for value in arr
    sum += value
  eq 30, sum

/*
test "iteration loop does not respect identifier if reference is mutable", #
  let mutable sum = 0
  let mutable arr = [1, 4, 9, 16]
  for value in arr
    sum += value
    arr := [0, 0, 0, 0]
  eq 30, sum
*/

test "iteration loop with else", #
  let mutable sum = 0
  let arr = [1, 4, 9, 16]
  for value in arr
    sum += value
  else
    fail()
  eq 30, sum
  
  let mutable hit-else = false
  let other-arr = []
  for value in other-arr
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "iteration loop with literal array", #
  let mutable sum = 0
  for value in [1, 4, 9, 16]
    sum += value
  eq 30, sum

test "iteration loop with literal array and else", #
  let mutable sum = 0
  for value in [1, 4, 9, 16]
    sum += value
  else
    fail()
  eq 30, sum
  
  let mutable hit-else = false
  for value in []
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "iteration loop only calculates array once", #
  let arr = run-once [1, 4, 9, 16]
  let mutable sum = 0
  for value in arr()
    sum += value
  eq 30, sum

test "iteration loop with index", #
  let mutable sum = 0
  let mutable j = 0
  let arr = [1, 4, 9, 16]
  for value, index in arr
    sum += value
    eq j, index
    j += 1
  eq 30, sum

test "iteration loop with index and literal array", #
  let mutable sum = 0
  let mutable j = 0
  for value, index in [1, 4, 9, 16]
    sum += value
    eq j, index
    j += 1
  eq 30, sum

test "iteration loop with index only calculates array once", #
  let arr = run-once [1, 4, 9, 16]
  let mutable sum = 0
  let mutable j = 0
  for value, index in arr()
    sum += value
    eq j, index
    j += 1
  eq 30, sum

test "object iteration loop scope", #
  let value-factories = []
  for k, v of { a: 1, b: 2, c: 3, d: 4 }
    value-factories.push #-> v
  
  let mutable sum = 0
  for factory in value-factories
    sum += factory()
  eq 10, sum

test "array iteration loop scope", #
  let value-factories = []
  for v in [1, 4, 9, 16]
    value-factories.push #-> v
  
  let mutable sum = 0
  for factory in value-factories
    sum += factory()
  eq 30, sum

test "iteration loop scope", #
  let funcs = []
  for alpha, i in ["alpha", "bravo", "charlie"]
    funcs.push #-> [i, alpha]

  array-eq [0, "alpha"], funcs[0]()
  array-eq [1, "bravo"], funcs[1]()
  array-eq [2, "charlie"], funcs[2]()

test "iteration loop scope with multiple", #
  let funcs = []
  for alpha, i in ["alpha", "bravo", "charlie"]
    for bravo, j in ["delta", "echo", "foxtrot"]
      funcs.push #-> [i, alpha, j, bravo]

  array-eq [0, "alpha", 0, "delta"], funcs[0]()
  array-eq [1, "bravo", 1, "echo"], funcs[4]()
  array-eq [2, "charlie", 2, "foxtrot"], funcs[8]()

test "object iteration loop scope", #
  let funcs = []
  for k, v, i of {alpha:"one", bravo:"two", charlie:"three"}
    funcs.push #-> [k, v, i]
  
  let items = []
  for func in funcs
    items.push func()
  
  eq 0, items[0].pop()
  eq 1, items[1].pop()
  eq 2, items[2].pop()
  items.sort #(a, b) -> a[0] <=> b[0]
  array-eq ["alpha", "one"], items[0]
  array-eq ["bravo", "two"], items[1]
  array-eq ["charlie", "three"], items[2]

test "object iteration loop scope with multiple", #
  let funcs = []
  for k, v, i of {alpha:"one", bravo:"two", charlie:"three"}
    for k2, v2, j of {delta:"four", echo:"five", foxtrot:"six"}
      funcs.push #-> [k, k2, v, v2, i, j]
  
  let items = []
  for func in funcs
    items.push(func())
  
  array-eq [0, 0], items[0].splice(4, 2)
  array-eq [1, 1], items[4].splice(4, 2)
  array-eq [2, 2], items[8].splice(4, 2)
  items.sort #(a, b) -> a[0] <=> b[0] or a[1] <=> b[1]
  array-eq ["alpha", "delta", "one", "four"], items[0]
  array-eq ["bravo", "echo", "two", "five"], items[4]
  array-eq ["charlie", "foxtrot", "three", "six"], items[8]

test "single-line range loop", #
  let mutable sum = 0
  for i in 1 til 10;sum+=i
  eq 45, sum

test "Simple array comprehension", #
  let nums = for n in [1, 2, 3, 4, 5]
    n * n
  array-eq [1, 4, 9, 16, 25], nums

test "Array comprehension with if", #
  let nums = for n in [1, 2, 3, 4, 5]
    if n % 2 == 0
      n * n
  array-eq [4, 16], nums

test "Range comprehension", #
  let nums = for i in 1 til 100
    i
  
  let mutable j = 0
  for num in nums
    j += 1
    eq num, j
  eq 99, j

test "Object comprehension", #
  let obj = { alpha: 1, bravo: 2, charlie: 3 }
  let keys = for k of obj
    k
  keys.sort()
  
  array-eq ["alpha", "bravo", "charlie"], keys

test "For-some of range", #
  let mutable i = 0
  ok for some x in 1 til 10
    i += 1
    eq i, x
    x == 4
  eq 4, i
  
  ok not (for some x in 1 til 10
    x > 10)
  
  throws #-> gorilla.compile("""let y = 0
  for some x in 1 til 10
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-every of range", #
  let mutable i = 0
  ok not (for every x in 1 til 10
    i += 1
    eq i, x
    x <= 4)
  eq 5, i

  ok for every x in 1 til 10
    x <= 10
  
  throws #-> gorilla.compile("""let y = 0
  for some x in 1 til 10
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-first of range", #
  eq 36, for first x in 1 til 10
    if x > 5
      x ^ 2
  
  eq 1000000, for first x in 1 til 10
    if x > 10
      x ^ 2
  else
    1000000

test "For-reduce of range", #
  eq 45, for reduce i in 1 til 10, sum = 0
    sum + i
  
  throws #-> gorilla.compile("""let y = 0
  for reduce i in 1 til 10, sum = 0
    sum + i
  else
    throw Error()"""), #(e) -> e.line == 4

test "For-some in array", #
  ok for some x in [#-> 1, #-> 2, fail]
    x() == 2
  
  ok not (for some x in [#-> 1, #-> 2, #-> 3]
    x() == 4)
  
  throws #-> gorilla.compile("""let y = 0
  for some x in [1, 2]
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-every in array", #
  ok not (for every x in [#-> 1, #-> 2, fail]
    x() < 2)
  
  ok for every x in [#-> 1, #-> 2, #-> 3]
    x() < 4
  
  throws #-> gorilla.compile("""let y = 0
  for every x in [1, 2]
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-first in array", #
  eq 4, for first x in [#-> 1, #-> 2, fail]
    let value = x()
    if value > 1
      value ^ 2
  
  eq 1000000, for first x in [#-> 1, #-> 2, #-> 3]
    let value = x()
    if value > 3
      value ^ 2
  else
    1000000

test "For-reduce in array", #
  eq 10, for reduce i in [1, 2, 3, 4], sum = 0
    sum + i
  
  throws #-> gorilla.compile("""let y = 0
  for reduce i in [1, 2, 3, 4], sum = 0
    sum + i
  else
    throw Error()"""), #(e) -> e.line == 4

test "For-some of object", #
  ok for some k, v of {a:1, b:2, c:3}
    v == 2
  
  ok not (for some k, v of {a:1, b:2, c:3}
    v == 4)
  
  throws #-> gorilla.compile("""let y = 0
  for some k, v of {a:1, b:2, c:3}
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-every of object", #
  ok not (for every k, v of {a:1, b:2, c:3}
    v <= 2)
  
  ok for every k, v of {a:1, b:2, c:3}
    v < 4
  
  throws #-> gorilla.compile("""let y = 0
  for every k, v of {a:1, b:2, c:3}
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "For-first of object", #
  eq 9, for first k, v of {a:1, b:2, c:3}
    if v > 2
      v ^ 2
  
  eq 1000000, for first k, v of {a:1, b:2, c:3}
    if v > 3
      v ^ 2
  else
    1000000

test "For-reduce of object", #
  eq 6, for reduce k, v of {a:1, b:2, c:3}, sum = 0
    sum + v
  
  throws #-> gorilla.compile("""let y = 0
  for reduce k, v of {a:1, b:2, c:3}, sum = 0
    sum + v
  else
    throw Error()"""), #(e) -> e.line == 4

test "While-some", #
  let mutable i = 0
  ok while some i < 10, i += 1
    i == 4
  eq 4, i
  
  i := 0
  ok not (while some i < 10, i += 1
    i > 10)
  
  throws #-> gorilla.compile("""
  let mutable i = 0
  while some i < 10, i += 1
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "While-every", #
  let mutable i = 0
  ok not (while every i < 10, i += 1
    i <= 4)
  eq 5, i
  
  i := 0
  ok while every i < 10, i += 1
    i <= 10

  throws #-> gorilla.compile("""
  let mutable i = 0
  while every i < 10, i += 1
    true
  else
    throw Error()"""), #(e) -> e.line == 2

test "While-first", #
  let mutable i = 0
  eq 36, while first i < 10, i += 1
    if i > 5
      i ^ 2
  
  i := 0
  eq 1000000, while first i < 10, i += 1
    if i > 10
      i ^ 2
  else
    1000000

test "While-reduce", #
  let mutable i = 0
  eq 45, while reduce i < 10, i += 1, sum = 0
    sum + i
  
  throws #-> gorilla.compile("""
  let mutable i = 0
  while reduce i < 10, i += 1, sum = 0
    sum + i
  else
    throw Error()"""), #(e) -> e.line == 4

/*
test "Repeat-while-some", #
  let mutable i = 0
  ok repeat while some i > 0 and i < 10, i += 1
    i == 4
  eq 4, i
  
  i := 0
  ok not (repeat while some i < 10, i += 1
    i > 10)
  
  throws #-> Cotton.compile("""
  let mutable i = 0
  repeat while some i < 10, i += 1
    true
  else
    throw Error()"""), (e) -> e.line == 4 or true

test "Repeat-while-every", #
  let mutable i = 0
  ok not (repeat while every i > 0 and i < 10, i += 1
    i <= 4)
  eq 5, i
  
  i := 0
  ok repeat while every i < 10, i += 1
    i <= 10

  throws #-> Cotton.compile("""
  let mutable i = 0
  repeat while every i < 10, i += 1
    true
  else
    throw Error()"""), (e) -> e.line == 4 or true

test "Repeat-while-first", #
  let mutable i = 0
  eq 36, repeat while first i > 0 and i < 10, i += 1
    if i > 5
      i ^ 2
  
  i := 0
  eq 1000000, repeat while first i < 10, i += 1
    if i > 10
      i ^ 2
  else
    1000000

test "Repeat-while-reduce", #
  let mutable i = 0
  eq 45, repeat while reduce i > 0 and i < 10, i += 1, sum = 0
    sum + i
  
  throws #-> Cotton.compile("""
  let mutable i = 0
  repeat while reduce i < 10, i += 1, sum = 0
    sum + i
  else
    throw Error()"""), (e) -> e.line == 4 or true
*/
test "Variable inside loop should be reset til undefined", #
  for i in 1 til 10
    let mutable value = undefined
    if i == 5
      value := "other"
    else
      eq undefined, value

test "a simple for loop without a return does not return an array", #
  let fun()
    let x = 0
    for i in 1 til 10
      i
  eq undefined, fun()

test "for loop in string", #
  let array = "alpha".split("")
  let mutable j = 0
  for item, i in "alpha"
    eq j, i
    eq array[i], item
    j += 1
  eq 5, j

test "loop up til Infinity", #
  let mutable j = 0
  for i in 0 til Infinity
    eq j, i
    if i == 10
      break
    j += 1
  eq 10, j

test "loop down til Infinity", #
  for i in 0 til Infinity by -1
    fail()

test "loop down til -Infinity", #
  let mutable j = 0
  for i in 0 til -Infinity by -1
    eq j, i
    if i == -10
      break
    j -= 1
  eq -10, j

test "loop down til Infinity", #
  for i in 0 til Infinity by -1
    fail()

test "loop up til -Infinity", #
  for i in 0 til -Infinity
    fail()

let array-to-iterator(array)
  {
    next: #
      if @index >= @array.length
        throw StopIteration
      let element = @array[@index]
      @index += 1
      element
    array
    index: 0
  }

test "iterator loop", #
  let mutable sum = 0
  for value from array-to-iterator [1, 4, 9, 16]
    sum += value
  eq 30, sum

test "iterator loop with else", #
  let mutable sum = 0
  for value from array-to-iterator [1, 4, 9, 16]
    sum += value
  else
    fail()
  eq 30, sum
  
  let mutable hit-else = false
  for value from array-to-iterator []
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "iterator loop only calculates iterator once", #
  let iterator = run-once(array-to-iterator([1, 4, 9, 16]))
  let mutable sum = 0
  for value from iterator()
    sum += value
  eq 30, sum

test "iterator loop with index", #
  let mutable sum = 0
  let mutable j = 0
  for value, index from array-to-iterator([1, 4, 9, 16])
    sum += value
    eq j, index
    j += 1
  eq 30, sum

test "iterator iteration loop scope", #
  let value-factories = []
  for v from array-to-iterator([1, 4, 9, 16])
    value-factories.push(#-> v)
  
  let mutable sum = 0
  for factory in value-factories
    sum += factory()
  eq 30, sum

test "iterator iteration loop scope with multiple", #
  let funcs = []
  for alpha, i from array-to-iterator(["alpha", "bravo", "charlie"])
    for bravo, j from array-to-iterator(["delta", "echo", "foxtrot"])
      funcs.push(#-> [i, alpha, j, bravo])

  array-eq [0, "alpha", 0, "delta"], funcs[0]()
  array-eq [1, "bravo", 1, "echo"], funcs[4]()
  array-eq [2, "charlie", 2, "foxtrot"], funcs[8]()

test "C-style for loop", #
  let mutable i = 0
  let values = []
  for (i := 0); i < 10; i += 1
    values.push i
  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], values

test "C-style for every loop", #
  let mutable i = 0
  ok not (for every (i := 0); i < 10; i += 1
    i < 5)
  ok (for every (i := 0); i < 10; i += 1
    i < 10)

test "C-style for some loop", #
  let mutable i = 0
  ok not (for some (i := 0); i < 10; i += 1
    i == 10)
  ok (for some (i := 0); i < 10; i += 1
    i == 5)

test "C-style for reduce loop", #
  let mutable i = 0
  eq 45, (for reduce (i := 0); i < 10; i += 1, sum = 0
    sum + i)

test "For-in loop over a string", #
  let result = []
  for c in "hello"
    result.push c
  array-eq ["h", "e", "l", "l", "o"], result

test "For-in loop over a string as expression", #
  let result = for c in "hello"; c
  array-eq ["h", "e", "l", "l", "o"], result

test "For-in literal array with step = 1", #
  let result = []
  for v, i in [1, 4, 9, 16] by 1
    result.push [v, i]
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], result

test "For-in literal array with step = -1", #
  let result = []
  for v, i in [1, 4, 9, 16] by -1
    result.push [v, i]
  array-eq [[16, 3], [9, 2], [4, 1], [1, 0]], result

test "For-in literal array with step = 2", #
  let result = []
  for v, i in [1, 4, 9, 16] by 2
    result.push [v, i]
  array-eq [[1, 0], [9, 2]], result

test "For-in literal array with step = -2", #
  let result = []
  for v, i in [1, 4, 9, 16] by -2
    result.push [v, i]
  array-eq [[16, 3], [4, 1]], result

test "For-in literal array with dynamic step", #
  let run(step)
    let get-step = run-once step
    let result = []
    for v, i in [1, 4, 9, 16] by get-step()
      result.push [v, i]
    result
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], run 1
  array-eq [[16, 3], [9, 2], [4, 1], [1, 0]], run -1
  array-eq [[1, 0], [9, 2]], run 2
  array-eq [[16, 3], [4, 1]], run -2

test "For-in array with step = 1", #
  let result = []
  let arr = run-once [1, 4, 9, 16]
  for v, i in arr() by 1
    result.push [v, i]
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], result

test "For-in array with step = -1", #
  let result = []
  let arr = run-once [1, 4, 9, 16]
  for v, i in arr() by -1
    result.push [v, i]
  array-eq [[16, 3], [9, 2], [4, 1], [1, 0]], result

test "For-in array with step = 2", #
  let result = []
  let arr = run-once [1, 4, 9, 16]
  for v, i in arr() by 2
    result.push [v, i]
  array-eq [[1, 0], [9, 2]], result

test "For-in array with step = -2", #
  let result = []
  let arr = run-once [1, 4, 9, 16]
  for v, i in arr() by -2
    result.push [v, i]
  array-eq [[16, 3], [4, 1]], result

test "For-in array with dynamic step", #
  let run(arr, step)
    let get-arr = run-once arr
    let get-step = run-once step
    let result = []
    for v, i in get-arr() by get-step()
      result.push [v, i]
    result
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], run([1, 4, 9, 16], 1)
  array-eq [[16, 3], [9, 2], [4, 1], [1, 0]], run([1, 4, 9, 16], -1)
  array-eq [[1, 0], [9, 2]], run([1, 4, 9, 16], 2)
  array-eq [[16, 3], [4, 1]], run([1, 4, 9, 16], -2)

test "For-in array with slice", #
  let mutable result = []
  let array = [1, 4, 9, 16]
  let mutable arr = run-once array
  for v, i in arr()[1 to 2]
    result.push [v, i]
  array-eq [[4, 1], [9, 2]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[1 til -1]
    result.push [v, i]
  array-eq [[4, 1], [9, 2]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[-3 til -1]
    result.push [v, i]
  array-eq [[4, 1], [9, 2]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[-3 to -1]
    result.push [v, i]
  array-eq [[4, 1], [9, 2], [16, 3]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[3 til 6]
    result.push [v, i]
  array-eq [[16, 3]], result

test "For-in array with slice and step = -1", #
  let mutable result = []
  let array = [1, 4, 9, 16]
  let mutable arr = run-once array
  for v, i in arr()[2 to 1 by -1]
    result.push [v, i]
  array-eq [[9, 2], [4, 1]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[-2 til 0 by -1]
    result.push [v, i]
  array-eq [[9, 2], [4, 1]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[-2 to 1 by -1]
    result.push [v, i]
  array-eq [[9, 2], [4, 1]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[-1 to -3 by -1]
    result.push [v, i]
  array-eq [[16, 3], [9, 2], [4, 1]], result
  
  result := []
  arr := run-once array
  for v, i in arr()[6 to -2 by -1]
    result.push [v, i]
  array-eq [[16, 3], [9, 2]], result

test "For-in array with dynamic slice and step", #
  let run(array, start, end, step)
    let get-array = run-once array
    let get-start = run-once start
    let get-end = run-once end
    let get-step = run-once step
    
    let result = []
    for v, i in get-array()[get-start() to get-end() by get-step()]
      result.push [v, i]
    result
  
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], run([1, 4, 9, 16], 0, -1, 1)
  array-eq [[1, 0], [4, 1], [9, 2]], run([1, 4, 9, 16], 0, -2, 1)
  array-eq [[1, 0], [4, 1], [9, 2], [16, 3]], run([1, 4, 9, 16], 0, 10, 1)
  array-eq [[16, 3]], run([1, 4, 9, 16], -1, 10, 1)
  array-eq [], run([1, 4, 9, 16], -1, 2, 1)
  array-eq [[16, 3], [9, 2], [4, 1], [1, 0]], run([1, 4, 9, 16], -1, 0, -1)
  array-eq [[1, 0], [9, 2]], run([1, 4, 9, 16], 0, -1, 2)
  array-eq [[16, 3], [4, 1]], run([1, 4, 9, 16], -1, 0, -2)
  array-eq [[9, 2], [1, 0]], run([1, 4, 9, 16], -2, 0, -2)
  array-eq [], run([1, 4, 9, 16], -2, 3, -2)
