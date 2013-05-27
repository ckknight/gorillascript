let {expect} = require 'chai'

let set-to-array(set, known-values = [])
  expect(set).to.be.an.instanceof(Set)
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
  values.sort #(a, b)
    typeof a <=> typeof b or a <=> b

describe "single-line syntax", #
  it "should handle empty case", #
    let set = %[]
    expect(set-to-array set, [\x]).to.be.empty

  it "should handle mixed values", #
    let obj = {}
    let set = %[1, "alpha", obj]
    
    expect(set-to-array set, [1, "alpha", obj, \x]).to.eql [1, obj, "alpha"]

describe "multi-line syntax", #
  it "should handle mixed commas", #
    let set = %[
      "alpha"
      "bravo",
      "charlie"
    ]
    expect(set-to-array set, [\alpha, \bravo, \charlie, \x]).to.eql ["alpha", "bravo", "charlie"]
  
  it "should handle matrix-style", #
    let set = %[
      1, 2, 3
      4, 5, 6
      7, 8, 9
    ]
    expect(set-to-array set, [1, 2, 3, 4, 5, 6, 7, 8, 9, \x]).to.eql [1, 2, 3, 4, 5, 6, 7, 8, 9]

describe "spread", #
  it "should handle spread in set construction", #
    let x = ["bravo", "charlie"]
    let set = %["alpha", ...x, "delta"]
    expect(set-to-array set, ["alpha", "bravo", "charlie", "delta", \x]).to.eql ["alpha", "bravo", "charlie", "delta"]

describe "literal access", #
  it "should handle access on its literal", #
    expect(%["alpha"].has("alpha")).to.be.true
    expect(%["alpha"].has("bravo")).to.be.false
