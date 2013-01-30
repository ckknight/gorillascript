async-test "async", #
  let wait = @wait
  let value = run-once("hello")
  let mutable body-ran = false
  let f()
    let self = this
    async err, x <- wait value
    eq null, err
    eq "hello", x
    eq self, this
    ok value.ran
    body-ran := true
  
  f@ {}
  ok not value.ran
  @after #-> ok value.ran
  @after #-> ok body-ran

async-test "async!", #
  let wait = @wait
  let f(get-value, callback)
    let self = this
    async! callback, x <- wait get-value
    eq self, this
    callback(null, x)
  
  let mutable runs = 0
  f@ {}, run-once("hello"), #(err, value)
    eq null, err
    eq "hello", value
    runs += 1
  let error = {}
  f@ {}, #-> throw error, #(e, value)
    eq error, e
    eq void, value
    runs += 1
  @after #-> eq 2, runs

async-test "asyncfor", #
  let wait = @wait
  let mutable sum = 0
  let mutable i = 0
  let f()
    let self = this
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
  
  f@ {}    
  eq 0, sum
  @after #-> eq 45, sum

async-test "asyncfor with result", #
  let wait = @wait
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

async-test "asyncfor with result, error in the middle", #
  let mutable i = 0
  let my-error = {}
  asyncfor e, result <- next, ; i < 10; i += 1
    async err, x <- @wait run-once(i ^ 2)
    eq null, err
    if i == 5
      next(my-error)
    else
      next(null, x)
  eq my-error, e
  eq void, result

async-test "asyncfor with no after-body", #
  let mutable sum = 0
  let mutable i = 0
  if true
    asyncfor next, ; i < 10; i += 1
      let value = run-once(i)
      async err, x <- @wait value
      eq null, err
      ok value.ran
      sum += x
      next()
    eq 45, sum
  eq 0, sum

async-test "asyncfor range", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq 45, sum
    eq self, this
      
  f@ {}
  eq 0, sum
  @after #-> eq 45, sum

async-test "asyncfor range with result", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq null, e
    array-eq [0, 1, 3, 6, 10, 15, 21, 28, 36, 45], result
    eq self, this
  
  f@ {}  
  eq 0, sum
  after #-> eq 45, sum

async-test "asyncfor in array", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq 15, sum
    eq self, this
  
  f@ {}
  eq 0, sum
  after #-> eq 15, sum

async-test "asyncfor in array with result", #  
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq null, e
    array-eq [1, 3, 7, 15], result
    eq self, this
  
  f@ {}
  eq 0, sum
  after #-> eq 15, sum

async-test "asyncfor of object", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq 15, sum
    eq self, this
  
  f@ {}
  eq 0, sum
  after #-> eq 15, sum

async-test "asyncfor of object with result", #
  let wait = @wait
  let after = @after
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
      after #-> ok value.ran
    eq null, e
    array-eq [1, 2, 4, 8], result.sort()
    eq self, this
  
  f@ {}

async-test "asyncwhile", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
    let mutable i = 0
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
  
  f@ {}
  eq 0, sum
  after #-> eq 45, sum

async-test "asyncwhile with result", #
  let wait = @wait
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

async-test "asyncuntil", #
  let wait = @wait
  let mutable sum = 0
  let f()
    let self = this
    let mutable i = 0
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
  
  f@ {}    
  eq 0, sum
  @after #-> eq 45, sum

async-test "asyncuntil with result", #
  let wait = @wait
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

async-test "asyncif", #
  let wait = @wait
  let after = @after
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable later = false
    if true
      asyncif next, check
        eq self, this
        async err, x <- wait value
        eq "hello", x
        ok value.ran
        eq self, this
        next()
      eq self, this
      later := true
    ok not value.ran
    ok check xor later
    after #
      ok not (check xor value.ran)
      ok later
  run@ {}, true
  run@ {}, false

async-test "asyncif with else", #
  let wait = @wait
  let after = @after
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable later = false
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
      later := true
    ok not value.ran
    ok check xor later
    after #
      ok not (check xor value.ran)
      ok later
  run@ {}, true
  run@ {}, false

async-test "asyncunless", #
  let wait = @wait
  let after = @after
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable later = false
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
      later := true
    ok not value.ran
    ok not (check xor later)
    after #
      ok check xor value.ran
      ok later
  run@ {}, true
  run@ {}, false

async-test "asyncunless with else", #
  let wait = @wait
  let after = @after
  let run(check)
    let self = this
    let value = run-once("hello")
    let mutable later = false
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
      later := true
    ok not value.ran
    ok not (check xor later)
    after #
      ok check xor value.ran
      ok later
  run true
  run false

let array-to-iterator(array)
  {
    iterator: #-> this
    next: #
      if @index >= @array.length
        throw StopIteration
      let element = @array[@index]
      @index += 1
      element
    array
    index: 0
  }

async-test "asyncfor from iterator", #  
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq 15, sum
    eq self, this
  
  f@ {}
  eq 0, sum
  after #-> eq 15, sum

async-test "asyncfor from iterator with result", #
  let wait = @wait
  let after = @after
  let mutable sum = 0
  let f()
    let self = this
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
      after #-> ok value.ran
    eq null, e
    array-eq [1, 3, 7, 15], result
    eq self, this
  
  f@ {}
  eq 0, sum
  after #-> eq 15, sum
