let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "single-line arrays", #
  it "allows an empty array", #
    let arr = []
    expect(arr)
      .to.be.an(\array)
      .to.be.empty
    expect(Object.prototype.to-string.call(arr) == "[object Array]")
  
  it "allows for single-line arrays", #
    let arr = ["alpha", "bravo", "charlie"]
    expect(arr)
      .to.be.an(\array)
      .to.have.length(3)
      .to.have.property(0)
      .that.equals("alpha")
    expect(arr)
      .to.have.property(1)
      .that.equals("bravo")
    expect(arr)
      .to.have.property(2)
      .that.equals("charlie")
  
  /*
  it "fails on single-line array missing commas", #
    expect(#-> gorilla.compile-sync """let x = 0
    let y = ["alpha" "bravo" "charlie"]""").to.throw gorilla.ParserError
  */
  
  it "ignores trailing comma", #
    let arr = ["alpha", "bravo", "charlie",]
    expect(arr)
      .to.have.length(3)
      .to.eql ["alpha", "bravo", "charlie"]

describe "multi-line arrays", #
  it "works with commas", #
    let arr = [
      "alpha",
      "bravo",
      "charlie"
    ]
    expect(arr).to.eql ["alpha", "bravo", "charlie"]
  
  it "works without commas", #
    let arr = [
      "alpha"
      "bravo"
      "charlie"
    ]
    expect(arr).to.eql ["alpha", "bravo", "charlie"]

  it "works with mixed commas", #
    let arr = [
      "alpha"
      "bravo",
      "charlie"
    ]
    expect(arr).to.eql ["alpha", "bravo", "charlie"]
  
  it "works with multiple elements on one line", #
    let arr = [
      1, 2, 3
      4, 5, 6
      7, 8, 9
    ]
    expect(arr).to.eql [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  it "works with objects", #
    let arr = [
      { a: 1 }
      { b: 2 }
      { c: 3 }
    ]
    expect(arr).to.eql [{a: 1}, {b: 2}, {c: 3}]

describe "spread", #
  let arr = ["alpha", "bravo", "charlie"]
  it "works at the beginning of an array", #
    expect([...arr, "delta"]).to.eql ["alpha", "bravo", "charlie", "delta"]
  
  it "works at the end of an array", #
    expect(["delta", ...arr]).to.eql ["delta", "alpha", "bravo", "charlie"]
  
  it "works in the middle of an array", #
    expect(["delta", ...arr, "echo"]).to.eql ["delta", "alpha", "bravo", "charlie", "echo"]
  
  it "works with a literal array being spread", #
    expect([...[arr], "delta"]).to.eql [["alpha", "bravo", "charlie"], "delta"]
    expect(["delta", ...[arr]]).to.eql ["delta", ["alpha", "bravo", "charlie"]]
    expect(["delta", ...[arr], "echo"]).to.eql ["delta", ["alpha", "bravo", "charlie"], "echo"]
  
  it "works with an array of arrays being spread", #
    let arr2 = [arr]
    expect([...arr2, "delta"]).to.eql [["alpha", "bravo", "charlie"], "delta"]
    expect(["delta", ...arr2]).to.eql ["delta", ["alpha", "bravo", "charlie"]]
    expect(["delta", ...arr2, "echo"]).to.eql ["delta", ["alpha", "bravo", "charlie"], "echo"]
  
  it "does not create an array that is reference equal if the only item", #
    expect([...arr])
      .to.eql(arr)
      .to.not.equal(arr)
  
  it "works with multiple array spreads", #
    let alpha = [1, 2, 3]
    let bravo = [4, 5, 6]
    
    expect([...alpha, ...bravo]).to.eql [1, 2, 3, 4, 5, 6]
    expect([...bravo, ...alpha]).to.eql [4, 5, 6, 1, 2, 3]
    expect(["charlie", ...alpha, ...bravo]).to.eql ["charlie", 1, 2, 3, 4, 5, 6]
    expect(["charlie", ...alpha, "delta", ...bravo]).to.eql ["charlie", 1, 2, 3, "delta", 4, 5, 6]
    expect(["charlie", ...alpha, "delta", ...bravo, "echo"]).to.eql ["charlie", 1, 2, 3, "delta", 4, 5, 6, "echo"]
    expect([...alpha, "delta", ...bravo]).to.eql [1, 2, 3, "delta", 4, 5, 6]
    expect([...alpha, "delta", ...bravo, "echo"]).to.eql [1, 2, 3, "delta", 4, 5, 6, "echo"]
    expect([...alpha, ...bravo, "echo"]).to.eql [1, 2, 3, 4, 5, 6, "echo"]

describe "array containment", #
  it "works on an ident", #
    let array = ["alpha", "bravo", "charlie"]
    expect("alpha" in array).to.be.true
    expect("bravo" in array).to.be.true
    expect("charlie" in array).to.be.true
    expect("delta" in array).to.be.false
    expect("delta" not in array).to.be.true
  
  it "works on a literal array", #
    expect("alpha" in ["alpha", "bravo", "charlie"]).to.be.true
    expect("bravo" in ["alpha", "bravo", "charlie"]).to.be.true
    expect("charlie" in ["alpha", "bravo", "charlie"]).to.be.true
    expect("delta" in ["alpha", "bravo", "charlie"]).to.be.false
    expect("delta" not in ["alpha", "bravo", "charlie"]).to.be.true

  it "does not calculate key more than once", #
    let get-key = stub().returns "charlie"
    let array = ["alpha", "bravo", "charlie"]
    expect(get-key() in array).to.be.true
    expect(get-key).to.be.called-once

  it "does not calculate key more than once with literal array", #
    let get-key = stub().returns "charlie"
    expect(get-key() in ["alpha", "bravo", "charlie"]).to.be.true
    expect(get-key).to.be.called-once

  it "calculates key once with empty literal array", #
    let get-key = stub().returns "charlie"
    expect(get-key() in []).to.be.false
    expect(get-key).to.be.called-once
  
  it "does not calculate array more than once", #
    let get-array = stub().returns ["alpha", "bravo", "charlie"]
    expect("charlie" in get-array()).to.be.true
    expect(get-array).to.be.called-once

/*
it "array with holes", #
  expect(["alpha",,"bravo"]).to.eql ["alpha", undefined, "bravo"]
  expect(["alpha",,,"bravo"]).to.eql ["alpha", undefined, undefined, "bravo"]
  expect(["alpha",,,,"bravo"]).to.eql ["alpha", undefined, undefined, undefined, "bravo"]
  expect(["alpha",,,,"bravo",]).to.eql ["alpha", undefined, undefined, undefined, "bravo"]
  expect(["alpha",,,,"bravo",,]).to.eql ["alpha", undefined, undefined, undefined, "bravo", undefined]
  expect([,"alpha",,,,"bravo",,]).to.eql [undefined, "alpha", undefined, undefined, undefined, "bravo", undefined]
  expect([,,"alpha",,,,"bravo",,]).to.eql [undefined, undefined, "alpha", undefined, undefined, undefined, "bravo", undefined]
  expect([,]).to.eql [undefined]
  expect([,,]).to.eql [undefined, undefined]
*/

describe "multiple access", #
  it "returns an array", #
    let array = ["alpha", "bravo", "charlie", "delta", "echo"]
    expect(array[0, 2, 4]).to.eql ["alpha", "charlie", "echo"]
  
  it "only accesses object once", #
    let get-array = stub().returns ["alpha", "bravo", "charlie", "delta", "echo"]
    expect(get-array()[0, 2, 4]).to.eql ["alpha", "charlie", "echo"]
    expect(get-array).to.be.called-once
  
  /*
  it "multiple assignment", #
    let array = ["alpha", "bravo", "charlie", "delta", "echo"]

    array[0, 2, 4] := ["foxtrot", "golf", "hotel"]
    expect(array).to.eql ["foxtrot", "bravo", "golf", "delta", "hotel"]

    let x = array[1, 3] := ["india", "juliet"]
    expect(array).to.eql ["foxtrot", "india", "golf", "juliet", "hotel"]
    expect(x).to.eql ["india", "juliet"]
  */

describe "slicing", #
  let array = ["a", "b", "c", "d", "e"]
  
  it "returns a similar array when slicing from 0 to -1", #
    expect(array[0 to -1])
      .to.eql(array)
      .to.be.not.equal(array)
  
  it "works as expected", #
    expect(array[1 to -1]).to.eql ["b", "c", "d", "e"]
    expect(array[-1 to -1]).to.eql ["e"]
    expect(array[2 to -1]).to.eql ["c", "d", "e"]
    expect(array[0 to 2]).to.eql ["a", "b", "c"]
    expect(array[0 til 3]).to.eql ["a", "b", "c"]
    expect(array[0 til -1]).to.eql ["a", "b", "c", "d"]
    expect(array[1 to 3]).to.eql ["b", "c", "d"]
    expect(array[1 til 4]).to.eql ["b", "c", "d"]
    expect(array[4 to -1]).to.eql ["e"]
    expect(array[5 to -1]).to.eql []
    expect(array[-2 to -1]).to.eql ["d", "e"]
    expect(array[4 to 3]).to.eql []
    expect(array[4 til 4]).to.eql []
  
  it "only accesses array, left, and right once each", #
    let slice(get-array, get-left, get-right, inclusive)
      let result = if inclusive
        get-array()[get-left() to get-right()]
      else
        get-array()[get-left() til get-right()]
      expect(get-array).to.be.called-once
      expect(get-left).to.be.called-once
      expect(get-right).to.be.called-once
      result
    
    expect(slice stub().returns(array), stub().returns(0), stub().returns(-1), true)
      .to.eql(array)
      .to.be.not.equal(array)
    expect(slice stub().returns(array), stub().returns(1), stub().returns(-1), true).to.eql ["b", "c", "d", "e"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(-1), true).to.eql ["e"]
    expect(slice stub().returns(array), stub().returns(2), stub().returns(-1), true).to.eql ["c", "d", "e"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(2), true).to.eql ["a", "b", "c"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(3), false).to.eql ["a", "b", "c"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(-1), false).to.eql ["a", "b", "c", "d"]
    expect(slice stub().returns(array), stub().returns(1), stub().returns(3), true).to.eql ["b", "c", "d"]
    expect(slice stub().returns(array), stub().returns(1), stub().returns(4), false).to.eql ["b", "c", "d"]
    expect(slice stub().returns(array), stub().returns(4), stub().returns(-1), true).to.eql ["e"]
    expect(slice stub().returns(array), stub().returns(5), stub().returns(-1), true).to.eql []
    expect(slice stub().returns(array), stub().returns(-2), stub().returns(-1), true).to.eql ["d", "e"]
    expect(slice stub().returns(array), stub().returns(4), stub().returns(3), true).to.eql []
    expect(slice stub().returns(array), stub().returns(4), stub().returns(4), false).to.eql []
  
  it "works with a specified step", #
    expect(array[0 to -1 by 1])
      .to.eql(array)
      .to.be.not.equal(array)
    
    expect(array[-1 to 0 by -1]).to.eql ["e", "d", "c", "b", "a"]
    expect(array[-1 to 0 by -2]).to.eql ["e", "c", "a"]
    expect(array[0 to -1 by 2]).to.eql ["a", "c", "e"]
    expect(array[1 to -1 by 1]).to.eql ["b", "c", "d", "e"]
    expect(array[-1 to 1 by -1]).to.eql ["e", "d", "c", "b"]
    expect(array[-1 to 1 by -2]).to.eql ["e", "c"]
    expect(array[-1 to -1 by 100]).to.eql ["e"]
    expect(array[2 to -1 by 2]).to.eql ["c", "e"]
    expect(array[-1 to 2 by -2]).to.eql ["e", "c"]
    expect(array[0 to 2 by 2]).to.eql ["a", "c"]
    expect(array[2 to 0 by -2]).to.eql ["c", "a"]
    expect(array[0 til -1 by 3]).to.eql ["a", "d"]
    expect(array[1 to 3 by 2]).to.eql ["b", "d"]
    expect(array[1 til 4 by 2]).to.eql ["b", "d"]
    expect(array[3 to 1 by -2]).to.eql ["d", "b"]
    expect(array[3 til 0 by -2]).to.eql ["d", "b"]
    expect(array[4 to -1 by 1]).to.eql ["e"]
    expect(array[5 to -1 by 1]).to.eql []
    expect(array[-3 to -1 by 2]).to.eql ["c", "e"]
    expect(array[4 to 3 by 1]).to.eql []
    expect(array[4 til 4 by 1]).to.eql []
    expect(array[4 to -1 by -1]).to.eql ["e"]
    expect(array[5 to -1 by -1]).to.eql ["e"]
    expect(array[-1 to -3 by -2]).to.eql ["e", "c"]
    expect(array[3 to 4 by -1]).to.eql []
    expect(array[4 til 4 by -1]).to.eql []
  
  it "only accesses array, left, right, and step once", #
    let slice(get-array, get-left, get-right, get-step, inclusive)
      let result = if inclusive
        get-array()[get-left() to get-right() by get-step()]
      else
        get-array()[get-left() til get-right() by get-step()]
      expect(get-array).to.be.called-once
      expect(get-left).to.be.called-once
      expect(get-right).to.be.called-once
      result
    
    expect(slice stub().returns(array), stub().returns(0), stub().returns(-1), stub().returns(1), true)
      .to.eql(array)
      .to.be.not.equal(array)
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(0), stub().returns(-1), true).to.eql ["e", "d", "c", "b", "a"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(0), stub().returns(-2), true).to.eql ["e", "c", "a"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(-1), stub().returns(2), true).to.eql ["a", "c", "e"]
    expect(slice stub().returns(array), stub().returns(1), stub().returns(-1), stub().returns(1), true).to.eql ["b", "c", "d", "e"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(1), stub().returns(-1), true).to.eql ["e", "d", "c", "b"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(1), stub().returns(-2), true).to.eql ["e", "c"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(-1), stub().returns(100), true).to.eql ["e"]
    expect(slice stub().returns(array), stub().returns(2), stub().returns(-1), stub().returns(2), true).to.eql ["c", "e"]
    expect(slice stub().returns(array), stub().returns(-1), stub().returns(2), stub().returns(-2), true).to.eql ["e", "c"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(2), stub().returns(2), true).to.eql ["a", "c"]
    expect(slice stub().returns(array), stub().returns(2), stub().returns(0), stub().returns(-2), true).to.eql ["c", "a"]
    expect(slice stub().returns(array), stub().returns(0), stub().returns(-1), stub().returns(3), false).to.eql ["a", "d"]
    expect(slice stub().returns(array), stub().returns(1), stub().returns(3), stub().returns(2), true).to.eql ["b", "d"]
    expect(slice stub().returns(array), stub().returns(1), stub().returns(4), stub().returns(2), false).to.eql ["b", "d"]
    expect(slice stub().returns(array), stub().returns(3), stub().returns(1), stub().returns(-2), true).to.eql ["d", "b"]
    expect(slice stub().returns(array), stub().returns(3), stub().returns(0), stub().returns(-2), false).to.eql ["d", "b"]
/*
describe "splicing", #
  it "doesn't work currently", #
    let array = []

    array[:] := ["a", "b", "c"]
    expect(array).to.eql ["a", "b", "c"]

    array[:] := ["d", "e", "f"]
    expect(array).to.eql ["d", "e", "f"]

    array[1:] := ["g", "h"]
    expect(array).to.eql ["d", "g", "h"]

    array[:1] := ["i", "j"]
    expect(array).to.eql ["i", "j", "g", "h"]

    let result = array[2:] := ["k", "l"]
    expect(array).to.eql ["i", "j", "k", "l"]
    expect(result).to.eql ["k", "l"]

    array[2:2] := ["m", "n"]
    expect(array).to.eql ["i", "j", "m", "n", "k", "l"]

    array[-1:] := ["o", "p"]
    expect(array).to.eql ["i", "j", "m", "n", "k", "o", "p"]

    array[-2:-1] := ["q", "r"]
    expect(array).to.eql ["i", "j", "m", "n", "k", "q", "r", "p"]

    array[1:-1] := ["s", "t"]
    expect(array).to.eql ["i", "s", "t", "p"]

    array[:-1] := ["u", "v"]
    expect(array).to.eql ["u", "v", "p"]
*/

describe "unclosed array syntax", #
  it "works when assigned", #
    let arr =
      * 1
      * 2
      * 3
      * 4

    expect(arr).to.eql [1, 2, 3, 4]

  it "works with only a single item", #
    let arr =
      * 1

    expect(arr).to.eql [1]
  
  it "works in an invocation", #
    let f(a) -> a
    let arr = f
      * 1
      * 2
      * 3
      * 4

    expect(arr).to.eql [1, 2, 3, 4]

  it "works in an invocation with leading arguments", #
    let f(a, b, o) -> [a, b, o]
    let arr = f 1, 2,
      * 3
      * 4

    expect(arr).to.eql [1, 2, [3, 4]]
  
  it "acts as the function return if the last expression", #
    let f()
      * 1
      * 2
      * 3
      * 4
    expect(f()).to.eql [1, 2, 3, 4]
  
  it "allows for multiple levels", #
    let x =
      * 1
      * 2
      *
        * 3
        * 4
      * * 5
        * * 6
          * 7
        * 8
      * 9

    expect(x).to.eql [1, 2, [3, 4], [5, [6, 7], 8], 9]
  