let set-to-array(set)
  ok set instanceof Set
  (for value from set; value).sort()

test "empty", #
  let set = %[]
  array-eq [], set-to-array set

test "simple, single-line", #
  let set = %["alpha", "bravo", "charlie"]

  array-eq ["alpha", "bravo", "charlie"], set-to-array set

test "multi-line, mixed commas", #
  let set = %[
    "alpha"
    "bravo",
    "charlie"
  ]
  array-eq ["alpha", "bravo", "charlie"], set-to-array set

test "multi-line, matrix-style", #
  let set = %[
    1, 2, 3
    4, 5, 6
    7, 8, 9
  ]
  array-eq [1, 2, 3, 4, 5, 6, 7, 8, 9], set-to-array set

test "spread in set construction", #
  let x = ["bravo", "charlie"]
  let set = %["alpha", ...x, "delta"]
  array-eq ["alpha", "bravo", "charlie", "delta"], set-to-array set

test "immediate access", #
  ok %["alpha"].has("alpha")
  ok not %["alpha"].has("bravo")
