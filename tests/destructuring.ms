test "array parameter", #
  let fun([a, b]) -> [a, b]
  
  eq "function", typeof fun
  eq 1, fun.length
  array-eq ['a', void], fun(['a'])
  array-eq ['a', 'b'], fun(['a', 'b'])
  array-eq ['a', 'b'], fun(['a', 'b', 'c'])