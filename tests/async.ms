let wait(value, cb)
  set-timeout #!-> dont-wait(value, cb), 1

let dont-wait(value, cb)
  let mutable result = value
  try
    result := value()
  catch e
    cb(e)
    return
  cb(null, result)

test "async", #
  let value = run-once("hello")
  let mutable body-ran = false
  if true
    async err, x <- wait value
    eq null, err
    eq "hello", x
    ok value.ran
    body-ran := true
  ok not value.ran
  set-timeout((#-> ok value.ran), 17)

test "asyncfor", #
  let mutable sum = 0
  let mutable i = 0
  if true
    asyncfor next, ; i < 10; i += 1
      let value = run-once(i)
      async err, x <- wait value
      eq null, err
      ok value.ran
      sum += x
      next()
    eq 45, sum
  eq 0, sum

test "asyncfor with result", #
  let mutable i = 0
  asyncfor result <- next, ; i < 10; i += 1
    async err, x <- wait run-once(i ^ 2)
    eq null, err
    next(x)
  array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result

test "asyncfor with no after-body", #
  let mutable sum = 0
  let mutable i = 0
  if true
    asyncfor next, ; i < 10; i += 1
      let value = run-once(i)
      async err, x <- dont-wait value
      eq null, err
      ok value.ran
      sum += x
      next()
    
  eq 45, sum

test "asyncfor range", #
  let mutable sum = 0
  if true
    asyncfor next, i = 0, 10
      let value = run-once(i)
      if true
        async err, x <- wait value
        eq null, err
        eq i, x
        ok value.ran
        sum += x
        next()
      ok not value.ran
      set-timeout((#-> ok value.ran), 17)
    eq 45, sum
  eq 0, sum

test "asyncfor range with result", #
  let mutable sum = 0
  if true
    asyncfor result <- next, i = 0, 10
      let value = run-once(i)
      if true
        async err, x <- wait value
        eq null, err
        eq i, x
        ok value.ran
        sum += x
        next(sum)
      ok not value.ran
      set-timeout((#-> ok value.ran), 17)
    array-eq [0, 1, 3, 6, 10, 15, 21, 28, 36, 45], result
  eq 0, sum

test "asyncfor in array", #
  let mutable sum = 0
  if true
    asyncfor next, v in [1, 2, 4, 8]
      let value = run-once(v)
      if true
        async err, x <- wait value
        eq null, err
        eq v, x
        ok value.ran
        sum += x
        next()
      ok not value.ran
      set-timeout((#-> ok value.ran), 17)
    eq 15, sum
  eq 0, sum

test "asyncfor in array with result", #
  let mutable sum = 0
  if true
    asyncfor result <- next, v in [1, 2, 4, 8]
      let value = run-once(v)
      if true
        async err, x <- wait value
        eq null, err
        eq v, x
        ok value.ran
        sum += x
        next(sum)
      ok not value.ran
      set-timeout((#-> ok value.ran), 17)
    array-eq [1, 3, 7, 15], result
  eq 0, sum

test "asyncfor of object", #
  let mutable sum = 0
  if true
    asyncfor next, k, v of { a: 1, b: 2, c: 4, d: 8 }
      let value = run-once(v)
      if true
        async err, x <- wait value
        eq null, err
        eq v, x
        ok value.ran
        sum += x
        next()
      ok not value.ran
      set-timeout((#-> ok value.ran), 17)
    eq 15, sum
  eq 0, sum

test "asyncfor of object with result", #
  asyncfor result <- next, k, v of { a: 1, b: 2, c: 4, d: 8 }
    let value = run-once(v)
    if true
      async err, x <- wait value
      eq null, err
      eq v, x
      ok value.ran
      next(x)
    ok not value.ran
    set-timeout((#-> ok value.ran), 17)
  array-eq [1, 2, 4, 8], result.sort()

test "asyncwhile", #
  let mutable sum = 0
  let mutable i = 0
  if true
    asyncwhile next, i < 10, i += 1
      let value = run-once(i)
      async err, x <- wait value
      eq null, err
      ok value.ran
      sum += x
      next()
    eq 45, sum
  eq 0, sum

test "asyncwhile with result", #
  let mutable i = 0
  asyncwhile result <- next, i < 10, i += 1
    async err, x <- wait run-once(i ^ 2)
    eq null, err
    next(x)
  array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result

test "asyncuntil", #
  let mutable sum = 0
  let mutable i = 0
  if true
    asyncuntil next, i >= 10, i += 1
      let value = run-once(i)
      async err, x <- wait value
      eq null, err
      ok value.ran
      sum += x
      next()
    eq 45, sum
  eq 0, sum

test "asyncuntil with result", #
  let mutable i = 0
  asyncuntil result <- next, i >= 10, i += 1
    async err, x <- wait run-once(i ^ 2)
    eq null, err
    next(x)
  array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result

test "asyncif", #
  let run(check)
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncif next, check
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        next()
      after := true
    ok not value.ran
    ok check xor after
    set-timeout((#
      ok not (check xor value.ran)
      ok after), 17)
  run true
  run false

test "asyncif with else", #
  let run(check)
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncif next, check
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        next()
      else
        next()
      ok not (check xor value.ran)
      after := true
    ok not value.ran
    ok check xor after
    set-timeout((#
      ok not (check xor value.ran)
      ok after), 17)
  run true
  run false

test "asyncunless", #
  let run(check)
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncunless next, check
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        next()
      ok check xor value.ran
      after := true
    ok not value.ran
    ok not (check xor after)
    set-timeout((#
      ok check xor value.ran
      ok after), 17)
  run true
  run false

test "asyncunless with else", #
  let run(check)
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncunless next, check
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        next()
      else
        next()
      ok check xor value.ran
      after := true
    ok not value.ran
    ok not (check xor after)
    set-timeout((#
      ok check xor value.ran
      ok after), 17)
  run true
  run false
