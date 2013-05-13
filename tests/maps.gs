let cmp(a, b)
  if typeof a in [\string, \number]
    a <=> b
  else
    a.value <=> b.value

let map-to-array(map, known-keys = [])
  ok map instanceof Map
  let keys = []
  if is-function! map.keys
    for key from map.keys()
      keys.push key
  else if is-function! map.items
    for item from map.items()
      keys.push item[0]
  else if is-function! map.for-each
    map.for-each #(key)! -> keys.push key
  else
    for key in known-keys
      if map.has key
        keys.push key
  let items = []
  for key in keys.sort cmp
    items.push [key, map.get(key)]
  items

test "empty", #
  let map = %{}
  array-eq [], map-to-array map, [\x]

test "single-line, string keys", #
  let map = %{a: 1, b: 2, c: 3}
  array-eq [[\a, 1], [\b, 2], [\c, 3]], map-to-array map, [\a, \b, \c, \x]

test "single-line, object keys", #
  let a = { value: 0 }
  let b = { value: 2 }
  let c = { value: 1 }
  let map = %{[a]: 1, [b]: 2, [c]: 3}
  array-eq [[a, 1], [c, 3], [b, 2]], map-to-array map, [a, b, c]

test "single-line, quoted string keys", #
  let map = %{"a": 1, "b": 2, "c": 3}
  array-eq [[\a, 1], [\b, 2], [\c, 3]], map-to-array map, [\a, \b, \c, \x]

test "multi-line", #
  let a = { value: 0 }
  let b = { value: 2 }
  let c = { value: 1 }
  let map = %{
    [a]: 1
    [b]: 2
    [c]: 3
  }
  array-eq [[a, 1], [c, 3], [b, 2]], map-to-array map, [a, b, c, \x]
