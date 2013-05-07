test "semicolon-separated statements act as if they were on newlines", #
  let x = 5; let y = 6
  eq y, x + 1; eq y - 1, x
  
  let f(a) -> a
  eq x, f x; eq y, f y