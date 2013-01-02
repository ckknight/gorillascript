test "empty", #
  let arr = []
  ok Array.isArray(arr)
  eq 0, arr.length

test "simple, single-line", #
  let arr = ["alpha", "bravo", "charlie"]
  
  eq 3, arr.length
  eq "alpha", arr[0]
  eq "bravo", arr[1]
  eq "charlie", arr[2]

/*
test "single-line, missing commas", -> do
  throws -> Cotton.compile("""let x = 0
  ["alpha" "bravo" "charlie"]"""), (e) -> e.line == 2
end
*/

test "trailing comma", #
  let arr = ["alpha", "bravo", "charlie",]
  eq 3, arr.length
  eq "alpha", arr[0]
  eq "bravo", arr[1]
  eq "charlie", arr[2]

test "multi-line, with commas", #
  let arr = [
    "alpha",
    "bravo",
    "charlie"
  ]
  arrayEq ["alpha", "bravo", "charlie"], arr

test "multi-line, no commas", #
  let arr = [
    "alpha"
    "bravo"
    "charlie"
  ]
  arrayEq ["alpha", "bravo", "charlie"], arr

test "multi-line, mixed commas", #
  let arr = [
    "alpha"
    "bravo",
    "charlie"
  ]
  arrayEq ["alpha", "bravo", "charlie"], arr

test "multi-line, matrix-style", #
  let arr = [
    1, 2, 3
    4, 5, 6
    7, 8, 9
  ]
  arrayEq [1, 2, 3, 4, 5, 6, 7, 8, 9], arr

test "objects in multi-line array", #
  let arr = [
    { a: 1 }
    { b: 2 }
    { c: 3 }
  ]
  eq 3, arr.length
  eq 1, arr[0].a
  eq 2, arr[1].b
  eq 3, arr[2].c

test "array spreads", #
  let arr = ["alpha", "bravo", "charlie"]
  
  arrayEq ["alpha", "bravo", "charlie", "delta"], [...arr, "delta"]
  arrayEq ["delta", "alpha", "bravo", "charlie"], ["delta", ...arr]
  arrayEq [["alpha", "bravo", "charlie"], "delta"], [...[arr], "delta"]
  arrayEq ["delta", ["alpha", "bravo", "charlie"]], ["delta", ...[arr]]
  let arr2 = [arr]
  arrayEq [["alpha", "bravo", "charlie"], "delta"], [...arr2, "delta"]
  arrayEq ["delta", ["alpha", "bravo", "charlie"]], ["delta", ...arr2]
  
  arrayEq arr, [...arr]
  ok arr != [...arr]

test "multiple array spreads", #
  let alpha = [1, 2, 3]
  let bravo = [4, 5, 6]
  
  arrayEq [1, 2, 3, 4, 5, 6], [...alpha, ...bravo]
  arrayEq [4, 5, 6, 1, 2, 3], [...bravo, ...alpha]
  arrayEq ["charlie", 1, 2, 3, 4, 5, 6], ["charlie", ...alpha, ...bravo]
  arrayEq ["charlie", 1, 2, 3, "delta", 4, 5, 6], ["charlie", ...alpha, "delta", ...bravo]
  arrayEq ["charlie", 1, 2, 3, "delta", 4, 5, 6, "echo"], ["charlie", ...alpha, "delta", ...bravo, "echo"]
  arrayEq [1, 2, 3, "delta", 4, 5, 6], [...alpha, "delta", ...bravo]
  arrayEq [1, 2, 3, "delta", 4, 5, 6, "echo"], [...alpha, "delta", ...bravo, "echo"]
  arrayEq [1, 2, 3, 4, 5, 6, "echo"], [...alpha, ...bravo, "echo"]

test "immediate index", #
  eq "alpha", ["alpha"][0]
  eq Array::slice, [].slice

test "array containment", #
  let array = ["alpha", "bravo", "charlie"]
  ok "alpha" in array
  ok "bravo" in array
  ok "charlie" in array
  ok not ("delta" in array)
  ok "delta" not in array

test "array containment with literal array", #
  ok "alpha" in ["alpha", "bravo", "charlie"]
  ok "bravo" in ["alpha", "bravo", "charlie"]
  ok "charlie" in ["alpha", "bravo", "charlie"]
  ok not ("delta" in ["alpha", "bravo", "charlie"])
  ok "delta" not in ["alpha", "bravo", "charlie"]

test "array containment does not calculate key more than once", #
  let getKey = runOnce "charlie"
  
  let array = ["alpha", "bravo", "charlie"]
  ok getKey() in array
  ok getKey.ran

test "array containment does not calculate key more than once with literal array", #
  let getKey = runOnce "charlie"
  
  ok getKey() in ["alpha", "bravo", "charlie"]
  ok getKey.ran

test "array containment calculates key at least once with literal array, even if empty", #
  let getKey = runOnce "charlie"
  
  ok getKey() not in []
  ok getKey.ran

test "array containment does not calculate array more than once", #
  let getArray = runOnce ["alpha", "bravo", "charlie"]

  ok "charlie" in getArray()

/*
test "array with holes", #
  arrayEq ["alpha", undefined, "bravo"], ["alpha",,"bravo"]
  arrayEq ["alpha", undefined, undefined, "bravo"], ["alpha",,,"bravo"]
  arrayEq ["alpha", undefined, undefined, undefined, "bravo"], ["alpha",,,,"bravo"]
  arrayEq ["alpha", undefined, undefined, undefined, "bravo"], ["alpha",,,,"bravo",]
  arrayEq ["alpha", undefined, undefined, undefined, "bravo", undefined], ["alpha",,,,"bravo",,]
  arrayEq [undefined, "alpha", undefined, undefined, undefined, "bravo", undefined], [,"alpha",,,,"bravo",,]
  arrayEq [undefined, undefined, "alpha", undefined, undefined, undefined, "bravo", undefined], [,,"alpha",,,,"bravo",,]
  arrayEq [undefined], [,]
  arrayEq [undefined, undefined], [,,]
*/

test "multiple access", #
  let array = ["alpha", "bravo", "charlie", "delta", "echo"]
  
  arrayEq ["alpha", "charlie", "echo"], array[0, 2, 4]

test "multiple access only accesses object once", #
  let array = runOnce ["alpha", "bravo", "charlie", "delta", "echo"]
  
  arrayEq ["alpha", "charlie", "echo"], array()[0, 2, 4]

test "multiple assignment", #
  let array = ["alpha", "bravo", "charlie", "delta", "echo"]
  
  array[0, 2, 4] := ["foxtrot", "golf", "hotel"]
  arrayEq ["foxtrot", "bravo", "golf", "delta", "hotel"], array
  
  let x = (array[1, 3] := ["india", "juliet"])
  arrayEq ["foxtrot", "india", "golf", "juliet", "hotel"], array
  arrayEq ["india", "juliet"], x

test "slicing", #
  let array = ["a", "b", "c", "d", "e"]
  
  arrayEq array, array[:]
  ok array != array[:]
  
  arrayEq ["b", "c", "d", "e"], array[1:]
  arrayEq ["e"], array[-1:]
  arrayEq ["c", "d", "e"], array[2:]
  arrayEq ["a", "b", "c"], array[:3]
  arrayEq ["a", "b", "c", "d"], array[:-1]
  arrayEq ["b", "c", "d"], array[1:4]

test "splicing", #
  let array = []
  
  array[:] := ["a", "b", "c"]
  arrayEq ["a", "b", "c"], array
  
  array[:] := ["d", "e", "f"]
  arrayEq ["d", "e", "f"], array
  
  array[1:] := ["g", "h"]
  arrayEq ["d", "g", "h"], array
  
  array[:1] := ["i", "j"]
  arrayEq ["i", "j", "g", "h"], array
  
  let result = (array[2:] := ["k", "l"])
  arrayEq ["i", "j", "k", "l"], array
  arrayEq ["k", "l"], result
  
  array[2:2] := ["m", "n"]
  arrayEq ["i", "j", "m", "n", "k", "l"], array
  
  array[-1:] := ["o", "p"]
  arrayEq ["i", "j", "m", "n", "k", "o", "p"], array
  
  array[-2:-1] := ["q", "r"]
  arrayEq ["i", "j", "m", "n", "k", "q", "r", "p"], array
  
  array[1:-1] := ["s", "t"]
  arrayEq ["i", "s", "t", "p"], array
  
  array[:-1] := ["u", "v"]
  arrayEq ["u", "v", "p"], array
