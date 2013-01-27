test "Addition verifies numericity with an idle return statement", #
  let f(x)
    if x
      return "234"
    234

  eq 235, 1 + f(false)
  throws #-> 1 + f(true), TypeError
