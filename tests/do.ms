test "do statement", #
  let f()
    let self = this
    do
      eq self, this

test "do statement as expression", #
  let x = do
    5 + 5
  eq 10, x

test "do statement with local", #
  let value = runOnce(5)
  do x = value()
    eq 5, x
  ok value.ran

test "do statement with multiple locals", #
  let value1 = runOnce(1)
  let value2 = runOnce(2)
  let value3 = runOnce(3)
  do x = value1(), y = value2(), z = value3()
    eq 1, x
    eq 2, y
    eq 3, z
  ok value1.ran
  ok value2.ran
  ok value3.ran
