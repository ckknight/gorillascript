let cmp(a, b)
  if typeof a in [\string, \number]
    a <=> b
  else
    a.value <=> b.value

let map-to-array(map)
  ok map instanceof Map
  (for pair from map; pair).sort #(a, b) -> cmp a[0], b[0]

test "empty", #
  let map = %{}
  array-eq [], map-to-array map

test "single-line, string keys", #
  let map = %{a: 1, b: 2, c: 3}
  array-eq [[\a, 1], [\b, 2], [\c, 3]], map-to-array map

test "single-line, object keys", #
  let a = { value: 0 }
  let b = { value: 2 }
  let c = { value: 1 }
  let map = %{[a]: 1, [b]: 2, [c]: 3}
  array-eq [[a, 1], [c, 3], [b, 2]], map-to-array map

test "single-line, quoted string keys", #
  let map = %{"a": 1, "b": 2, "c": 3}
  array-eq [[\a, 1], [\b, 2], [\c, 3]], map-to-array map

test "multi-line", #
  let a = { value: 0 }
  let b = { value: 2 }
  let c = { value: 1 }
  let map = %{
    [a]: 1
    [b]: 2
    [c]: 3
  }
  array-eq [[a, 1], [c, 3], [b, 2]], map-to-array map
