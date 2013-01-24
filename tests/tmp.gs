global.array-eq := #(a, b, msg)
  if not array-equal a, b
    fail "$(JSON.stringify a) != $(JSON.stringify b)$(if msg then ': ' & msg else '')"
  else
    success()
