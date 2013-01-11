test "debugger as statement", #
  let x = false
  if x
    debugger

test "debugger as expression", #
  let x = false
  x and debugger
