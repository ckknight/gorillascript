let set-to-array(set, known-values = [])
  ok set instanceof Set
  let values = []
  if is-function! set.values
    for value from set.values()
      values.push value
  else if is-function! set.iterator
    for value from set
      values.push value
  else if is-function! set.for-each
    set.for-each #(value)! -> values.push value
  else
    for value in known-values
      if set.has value
        values.push value
  values.sort (<=>)

test "empty", #
  let set = %[]
  array-eq [], set-to-array set, [\x]

test "simple, single-line", #
  let set = %["alpha", "bravo", "charlie"]

  array-eq ["alpha", "bravo", "charlie"], set-to-array set, [\alpha, \bravo, \charlie, \x]

test "multi-line, mixed commas", #
  let set = %[
    "alpha"
    "bravo",
    "charlie"
  ]
  array-eq ["alpha", "bravo", "charlie"], set-to-array set, [\alpha, \bravo, \charlie, \x]

test "multi-line, matrix-style", #
  let set = %[
    1, 2, 3
    4, 5, 6
    7, 8, 9
  ]
  array-eq [1, 2, 3, 4, 5, 6, 7, 8, 9], set-to-array set, [1, 2, 3, 4, 5, 6, 7, 8, 9, \x]

test "spread in set construction", #
  let x = ["bravo", "charlie"]
  let set = %["alpha", ...x, "delta"]
  array-eq ["alpha", "bravo", "charlie", "delta"], set-to-array set, ["alpha", "bravo", "charlie", "delta", \x]

test "immediate access", #
  ok %["alpha"].has("alpha")
  ok not %["alpha"].has("bravo")
