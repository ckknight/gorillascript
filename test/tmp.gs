let fun()*
  yield 0
  let mutable i = 1
  label! blah while i < 10
    if i > 5
      break
    yield i
    i += 1
  yield 10
