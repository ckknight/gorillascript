test "without any other statements", #
  let obj = {}
  let f()
    returning obj
  
  eq obj, f()

test "with trailing statements", #
  let obj = {}
  let f()
    returning obj
    true

  eq obj, f()

test "with a trailing return", #
  let obj = {}
  let f()
    returning obj
    return true

  eq true, f()

test "async statement", #
  let obj = {}
  let fake-async(cb)
    cb()
  let f()
    returning obj
    async <- fake-async()
    true

  eq obj, f()
