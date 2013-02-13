test "Labeled block", #
  let f(should-break)
    let mutable x = 0b0000
    label! blah
      x bitor= 0b01
      if should-break
        break blah
      x bitor= 0b10
    x
  
  eq 0b11, f(false)
  eq 0b01, f(true)

test "Labeled if", #
  let f(test, should-break)
    let mutable x = 0b0000
    label! blah if test
      x bitor= 0b0001
      if should-break
        break blah
      x bitor= 0b0010
    else
      x bitor= 0b0100
      if should-break
        break blah
      x bitor= 0b1000
    x
  
  eq 0b0001, f(true, true)
  eq 0b0011, f(true, false)
  eq 0b0100, f(false, true)
  eq 0b1100, f(false, false)

test "Labeled switch", #
  let f(topic, should-break)
    let mutable x = 0b0000
    label! blah switch topic
    case true
      x bitor= 0b0001
      if should-break
        break blah
      x bitor= 0b0010
    case false
      x bitor= 0b0100
      if should-break
        break blah
      x bitor= 0b1000
    x
  
  eq 0b0001, f(true, true)
  eq 0b0011, f(true, false)
  eq 0b0100, f(false, true)
  eq 0b1100, f(false, false)

test "Labeled while", #
  let mutable sum = 0
  let mutable i = 0
  label! blah while i < 10, i += 1
    if i %% 2
      continue blah
    else if i > 7
      break blah
    sum bitor= 2^i
  
  eq 0b10101010, sum

test "Labeled for-in", #
  let result = []
  label! blah for x in [\a, \b, \c, \d, \e, \f]
    if x == \c
      continue blah
    else if x == \e
      break blah
    result.push x
  array-eq [\a, \b, \d], result

test "Labeled for-of", #
  let result = []
  label! blah for x of {\a, \b, \c, \d, \e, \f}
    if x == \c
      continue blah
    result.push x
  result.sort()
  array-eq [\a, \b, \d, \e, \f], result

test "Labeled try-catch", #
  let f(should-break)
    let err = {}
    let mutable result = 0
    label! blah try
      result bitor= 0b001
      if should-break
        break blah
      result bitor= 0b010
      throw err
    catch e
      eq err, e
      result bitor= 0b100
    result
  
  eq 0b001, f(true)
  eq 0b111, f(false)

test "Labeled try-finally", #
  let f(should-break)
    let err = {}
    let mutable result = 0
    try
      label! blah try
        result bitor= 0b0001
        if should-break
          break blah
        result bitor= 0b0010
        throw err
      finally
        result bitor= 0b0100
    catch e
      eq err, e
      result bitor= 0b1000
    result
  
  eq 0b0101, f(true)
  eq 0b1111, f(false)

test "Multiple loops", #
  let mutable sum = 0
  label! blah for i in 1 to 10
    for j in 1 to 10
      if i == j
        continue blah
      sum += j
  eq 165, sum

test "Breaking outer loop", #
  let mutable sum = 0
  label! blah for i in 1 to 10
    for j in 1 to 10
      if i > 5 and j == i
        break blah
      sum += j
  eq 290, sum
