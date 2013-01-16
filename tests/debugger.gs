test "debugger as statement", #
  let f(x)
    if x
      debugger
  f(false)

test "debugger as expression", #
  let f(x)
    x and debugger
  f(false)
