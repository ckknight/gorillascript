let {expect} = require 'chai'

let cmp(a, b)
  if typeof a in [\string, \number]
    a <=> b
  else
    a.value <=> b.value

let map-to-array(map, known-keys = [])
  expect(map).to.be.an.instanceof(Map)
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

describe "single-line syntax", #
  it "should handle empty case", #
    let map = %{}
    expect(map-to-array map, [\x]).to.be.empty
  
  it "should work with string keys", #
    let map = %{a: 1, b: 2, c: 3}
    expect(map-to-array map, [\a, \b, \c, \x]).to.eql [[\a, 1], [\b, 2], [\c, 3]]
  
  it "should work with quoted string keys", #
    let map = %{"a": 1, "b": 2, "c": 3}
    expect(map-to-array map, [\a, \b, \c, \x]).to.eql [[\a, 1], [\b, 2], [\c, 3]]
  
  it "should work with object keys", #
    let a = { value: 0 }
    let b = { value: 2 }
    let c = { value: 1 }
    let map = %{[a]: 1, [b]: 2, [c]: 3}
    expect(map-to-array map, [a, b, c, \x]).to.eql [[a, 1], [c, 3], [b, 2]]

describe "multi-line syntax", #
  it "should work", #
    let a = { value: 0 }
    let b = { value: 2 }
    let c = { value: 1 }
    let map = %{
      [a]: 1
      [b]: 2
      [c]: 3
    }
    expect(map-to-array map, [a, b, c, \x]).to.eql [[a, 1], [c, 3], [b, 2]]
