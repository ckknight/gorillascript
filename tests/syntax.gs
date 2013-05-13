test "semicolon-separated statements act as if they were on newlines", #
  let x = 5; let y = 6
  eq y, x + 1; eq y - 1, x
  
  let f(a) -> a
  eq x, f x; eq y, f y

test "first!", #
  let order-list = []
  let order(value)
    order-list.push value
    value
  eq 1, first!(order(1), order(2), order(3))
  array-eq [1, 2, 3], order-list
  first!(order(1), order(2), order(3))

test "last!", #
  let order-list = []
  let order(value)
    order-list.push value
    value
  eq 3, last!(order(1), order(2), order(3))
  array-eq [1, 2, 3], order-list
  last!(order(1), order(2), order(3))
