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
  let f()
    let self = this
    let value = run-once("hello")
    let mutable body-ran = false
    if true
      async err, x <- wait value
      eq null, err
      eq "hello", x
      eq self, this
      ok value.ran
      body-ran := true
    ok not value.ran
    set-timeout((#-> ok value.ran), 50)
  
  f@ {}

test "asyncfor", #
  let f()
    let self = this
    let mutable sum = 0
    let mutable i = 0
    if true
      asyncfor next, ; i < 10; i += 1
        let value = run-once(i)
        async err, x <- wait value
        eq null, err
        ok value.ran
        eq self, this
        sum += x
        next()
      eq 45, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor with result", #
  let f()
    let self = this
    let mutable i = 0
    asyncfor e, result <- next, ; i < 10; i += 1
      eq self, this
      async err, x <- wait run-once(i ^ 2)
      eq null, err
      eq self, this
      next(null, x)
    eq null, e
    array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result
    eq self, this
  
  f@ {}

test "asyncfor with result, error in the middle", #
  let mutable i = 0
  let my-error = {}
  asyncfor e, result <- next, ; i < 10; i += 1
    async err, x <- wait run-once(i ^ 2)
    eq null, err
    if i == 5
      next(my-error)
    else
      next(null, x)
  eq my-error, e
  eq void, result

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
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor next, i in 0 til 10
        eq self, this
        let value = run-once(i)
        if true
          async err, x <- wait value
          eq null, err
          eq i, x
          ok value.ran
          eq self, this
          sum += x
          next()
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq 45, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor range with result", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor e, result <- next, i in 0 til 10
        eq self, this
        let value = run-once(i)
        if true
          async err, x <- wait value
          eq null, err
          eq i, x
          ok value.ran
          eq self, this
          sum += x
          next(null, sum)
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq null, e
      array-eq [0, 1, 3, 6, 10, 15, 21, 28, 36, 45], result
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor in array", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor next, v in [1, 2, 4, 8]
        eq self, this
        let value = run-once(v)
        if true
          async err, x <- wait value
          eq null, err
          eq v, x
          ok value.ran
          eq self, this
          sum += x
          next()
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq 15, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor in array with result", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor e, result <- next, v in [1, 2, 4, 8]
        eq self, this
        let value = run-once(v)
        if true
          async err, x <- wait value
          eq null, err
          eq v, x
          ok value.ran
          eq self, this
          sum += x
          next(null, sum)
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq null, e
      array-eq [1, 3, 7, 15], result
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor of object", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor next, k, v of { a: 1, b: 2, c: 4, d: 8 }
        eq self, this
        let value = run-once(v)
        if true
          async err, x <- wait value
          eq null, err
          eq v, x
          ok value.ran
          eq self, this
          sum += x
          next()
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq 15, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor of object with result", #
  let f()
    let self = this
    asyncfor e, result <- next, k, v of { a: 1, b: 2, c: 4, d: 8 }
      eq self, this
      let value = run-once(v)
      if true
        async err, x <- wait value
        eq null, err
        eq v, x
        ok value.ran
        eq self, this
        next(null, x)
      ok not value.ran
      set-timeout((#-> ok value.ran), 50)
    eq null, e
    array-eq [1, 2, 4, 8], result.sort()
    eq self, this
  
  f@ {}

test "asyncwhile", #
  let f()
    let self = this
    let mutable sum = 0
    let mutable i = 0
    if true
      asyncwhile next, i < 10, i += 1
        eq self, this
        let value = run-once(i)
        async err, x <- wait value
        eq null, err
        ok value.ran
        eq self, this
        sum += x
        next()
      eq 45, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncwhile with result", #
  let f()
    let self = this
    let mutable i = 0
    asyncwhile e, result <- next, i < 10, i += 1
      eq self, this
      async err, x <- wait run-once(i ^ 2)
      eq null, err
      eq self, this
      next(null, x)
    eq null, e
    array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result
    eq self, this
  
  f@ {}

test "asyncuntil", #
  let f()
    let self = this
    let mutable sum = 0
    let mutable i = 0
    if true
      asyncuntil next, i >= 10, i += 1
        eq self, this
        let value = run-once(i)
        async err, x <- wait value
        eq null, err
        ok value.ran
        eq self, this
        sum += x
        next()
      eq 45, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncuntil with result", #
  let f()
    let self = this
    let mutable i = 0
    asyncuntil e, result <- next, i >= 10, i += 1
      eq self, this
      async err, x <- wait run-once(i ^ 2)
      eq null, err
      eq self, this
      next(null, x)
    eq null, e
    array-eq [0, 1, 4, 9, 16, 25, 36, 49, 64, 81], result
    eq self, this
  
  f@ {}

test "asyncif", #
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncif next, check
        eq self, this
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        eq self, this
        next()
      eq self, this
      after := true
    ok not value.ran
    ok check xor after
    set-timeout((#
      ok not (check xor value.ran)
      ok after), 50)
  run@ {}, true
  run@ {}, false

test "asyncif with else", #
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncif next, check
        eq self, this
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        eq self, this
        next()
      else  
        eq self, this
        next()
      eq self, this
      ok not (check xor value.ran)
      after := true
    ok not value.ran
    ok check xor after
    set-timeout((#
      ok not (check xor value.ran)
      ok after), 50)
  run@ {}, true
  run@ {}, false

test "asyncunless", #
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncunless next, check
        eq self, this
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        eq self, this
        next()
      eq self, this
      ok check xor value.ran
      after := true
    ok not value.ran
    ok not (check xor after)
    set-timeout((#
      ok check xor value.ran
      ok after), 50)
  run@ {}, true
  run@ {}, false

test "asyncunless with else", #
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable after = false
    if true
      asyncunless next, check
        eq self, this
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        eq self, this
        next()
      else
        eq self, this
        next()
      eq self, this
      ok check xor value.ran
      after := true
    ok not value.ran
    ok not (check xor after)
    set-timeout((#
      ok check xor value.ran
      ok after), 50)
  run true
  run false

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

test "asyncfor from iterator", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor next, v from array-to-iterator [1, 2, 4, 8]
        eq self, this
        let value = run-once(v)
        if true
          async err, x <- wait value
          eq null, err
          eq v, x
          ok value.ran
          eq self, this
          sum += x
          next()
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq 15, sum
      eq self, this
    eq 0, sum
  
  f@ {}

test "asyncfor from iterator with result", #
  let f()
    let self = this
    let mutable sum = 0
    if true
      asyncfor e, result <- next, v from array-to-iterator [1, 2, 4, 8]
        eq self, this
        let value = run-once(v)
        if true
          async err, x <- wait value
          eq null, err
          eq v, x
          ok value.ran
          eq self, this
          sum += x
          next(null, sum)
        ok not value.ran
        set-timeout((#-> ok value.ran), 50)
      eq null, e
      array-eq [1, 3, 7, 15], result
      eq self, this
    eq 0, sum
  
  f@ {}
