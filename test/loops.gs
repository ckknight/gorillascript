let {expect} = require 'chai'
let {stub} = require 'sinon'
let gorilla = require '../index'

let fail()
  throw Error()
let run-once(value)
  let f = #
    if f.ran
      throw Error "Already ran function"
    f.ran := true
    value
  f

describe "loops", #
  it "simple loop from 0 through 9", #
    let mutable j = 0
    for i in 0 til 10
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 10 // [0, 9], not [0, 10]
  
  it "loop from 0 through 9 can be at the end of a function with a variable mutation. #82", #
    let f()
      let mutable j = 0
      for i in 0 til 10
        expect(i).to.equal j
        j += 1
    f()

  it "simple loop from 0 through 10, inclusive", #
    let mutable j = 0
    for i in 0 to 10
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 11 // [0, 10], not [0, 9]

  it "simple loop from 0 through 8, evens only", #
    let mutable j = 0
    for i in 0 til 10 by 2
      expect(i).to.equal j
      j += 2
    expect(j).to.equal 10 // [0, 8], not [0, 10]

  it "simple loop from 0 through 10, evens only, inclusive", #
    let mutable j = 0
    for i in 0 to 10 by 2
      expect(i).to.equal j
      j += 2
    expect(j).to.equal 12 // [0, 10], not [0, 12]

  it "backwards loop", #
    let mutable j = 10
    for i in 10 til 0 by -1
      expect(i).to.equal j
      j -= 1
    expect(j).to.equal 0 // [10, 1], not [10, 0]

  it "backwards loop, inclusive", #
    let mutable j = 10
    for i in 10 to 0 by -1
      expect(i).to.equal j
      j -= 1
    expect(j).to.equal -1 // [10, 0], not [10, 1]

  it "loop with else", #
    let mutable sum = 0
    for i in 0 til 10
      sum += i
    else
      fail()
    expect(sum).to.equal 45

    let mutable hit-else = false
    for i in 10 til 0
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "variable loop without step", #
    let test-loop(start, finish)
      let mutable j = start
      let mutable count = 0
      for i in start til finish
        expect(i).to.equal j
        j += 1
        count += 1
      count
    expect(test-loop 0, 9).to.equal 9
    expect(test-loop 0, 10).to.equal 10
    expect(test-loop 10, 0).to.equal 0 // unless step is specified, it will not go backwards automatically

  it "variable loop with step", #
    let test-loop(start, finish, step)
      let mutable j = start
      let mutable count = 0
      for i in start til finish by step
        expect(i).to.equal j
        j += step
        count += 1
      count
    expect(test-loop 0, 9, 1).to.equal 9
    expect(test-loop 0, 10, 1).to.equal 10
    expect(test-loop 10, 0, 1).to.equal 0
    expect(test-loop 0, 9, 2).to.equal 5
    expect(test-loop 0, 10, 2).to.equal 5
    expect(test-loop 0, 5, -1).to.equal 0
    expect(test-loop 5, 0, -1).to.equal 5

  it "loop variable start is only calculated once", #
    let start = run-once 0
  
    let mutable j = 0
    for i in start() til 10
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 10

  it "loop variable finish is only calculated once", #
    let finish = run-once 10
  
    let mutable j = 0
    for i in 0 til finish()
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 10

  it "loop variable step is only calculated once", #
    let step = run-once 1
  
    let mutable j = 0
    for i in 0 til 10 by step()
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 10

  it "loop variable step going backwards", #
    let step = run-once -1
  
    let mutable j = 10
    for i in 10 til 0 by step()
      expect(i).to.equal j
      j -= 1
    expect(j).to.equal 0

  /*
  it "loop variable finish is not respected when changed", #
    let mutable finish = 10
  
    let mutable sum = 0
    for i in 0 til finish
      finish := 20
      sum += i
    expect(sum).to.equal 45

  it "loop variable step is not respected when changed", #
    let mutable step = 1
  
    let mutable sum = 0
    for i in 0 til 10 by step
      step += 1
      sum += i
    expect(sum).to.equal 45
  */

  it "loop scope", #
    let funcs = []
    for i in 0 til 10
      funcs.push #-> i * i

    expect(funcs[0]()).to.equal 0
    expect(funcs[1]()).to.equal 1
    expect(funcs[2]()).to.equal 4
    expect(funcs[3]()).to.equal 9
    expect(funcs[9]()).to.equal 81

  it "loop scope using this", #
    let get-funcs()
      let funcs = []
      for i in 0 til 10
        funcs.push #@-> [this, i * i]
      funcs
  
    let obj = {}
    let funcs = get-funcs.call(obj)
  
    expect(funcs[0]()).to.eql [obj, 0]
    expect(funcs[9]()).to.eql [obj, 81]

  it "multiple loops with same variables", #
    let mutable sum = 0
    for i in 1 til 10
      sum += i
    expect(sum).to.equal 45
    for i in 9 til 0 by -1
      sum -= i
    expect(sum).to.equal 0

  it "loop scope with multiple variables", #
    let funcs = []
    for i in 0 til 10
      for j in 0 til 10
        funcs.push #-> i * j

    expect(funcs[0]()).to.equal 0
    expect(funcs[45]()).to.equal 20
    expect(funcs[99]()).to.equal 81

  it "loop scope with same variable used multiple times", #
    let funcs = []
    for i in 0 til 10
      funcs.push #-> i * i
  
    let mutable sum = 0
    for i in 0 til 100
      sum += i
  
    expect(sum).to.equal 4950
    expect(funcs[0]()).to.equal 0
    expect(funcs[1]()).to.equal 1
    expect(funcs[2]()).to.equal 4
    expect(funcs[3]()).to.equal 9
    expect(funcs[9]()).to.equal 81

  it "multiple loops with same variables nested", #
    let mutable sum = 0
    for i in 1 til 10
      for j in 1 til i
        for k in 1 til j
          sum += 1
  
    expect(sum).to.equal 84
    for k in 1 til 10
      for j in 1 til k
        for i in 1 til j
          sum -= 1
  
    expect(sum).to.equal 0

  it "continue", #
    let mutable count = 0
    for i in 0 til 100
      if i %% 2
        continue
      count += 1
    expect(count).to.equal 50

  it "break", #
    let mutable count = 0
    for i in 0 til 100
      if i == 50
        break
      else if i > 50
        fail()
      count += 1
    expect(count).to.equal 50

  it "while loop", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10
      sum += i
      i += 1
    expect(sum).to.equal 45

  it "while loop with break", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10
      sum += i
      if sum > 10
        break
      i += 1
    expect(sum).to.equal 15
    expect(i).to.equal 5

  it "while loop with continue", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10
      i += 1
      if i % 2 == 0
        continue
      sum += i
    expect(sum).to.equal 25

  it "while loop with else", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10
      sum += i
      i += 1
    else
      fail()
    expect(sum).to.equal 45
  
    let mutable hit-else = false
    while i < 10
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "until loop", #
    let mutable sum = 0
    let mutable i = 0
    until i > 10
      sum += i
      i += 1
    expect(sum).to.equal 55

  it "until loop with else", #
    let mutable sum = 0
    let mutable i = 0
    until i > 10
      sum += i
      i += 1
    else
      fail()
    expect(sum).to.equal 55
  
    let mutable hit-else = false
    until i > 10
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "while loop with step", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10, i += 1
      sum += i
    expect(sum).to.equal 45

  it "while loop with step and else", #
    let mutable sum = 0
    let mutable i = 0
    while i < 10, i += 1
      sum += i
    else
      fail()
    expect(sum).to.equal 45

    let mutable hit-else = false
    while i < 10, fail()
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "until loop with step", #
    let mutable sum = 0
    let mutable i = 0
    until i > 10, i += 1
      sum += i
    expect(sum).to.equal 55

  it "until loop with step and else", #
    let mutable sum = 0
    let mutable i = 0
    until i > 10, i += 1
      sum += i
    else
      fail()
    expect(sum).to.equal 55
  
    let mutable hit-else = false
    until i > 10, fail()
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "object iteration loop", #
    let keys = []
    let obj = { a: 1, b: 4, c: 9, d: 16 }
    for k of obj
      keys.push k
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]

  /*
  it "object iteration loop does not respect mutable identifier if changed", #
    let keys = []
    let mutable obj = { a: 1, b: 4, c: 9, d: 16 }
    for k of obj
      keys.push(k)
      obj := {}
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]

  it "object iteration loop does not respect mutable identifier if changed with value", #
    let items = []
    let mutable obj = { a: 1, b: 4, c: 9, d: 16 }
    for k, v of obj
      items.push [k, v]
      obj := {}
    items.sort #(a, b) -> a[0] <=> b[0]
    expect(items).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]
  */

  it "object iteration loop with value", #
    let data = []
    let obj = { a: 1, b: 4, c: 9, d: 16 }
    for k, v of obj
      data.push [k, v]
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with value and index", #
    let data = []
    let obj = { a: 1, b: 4, c: 9, d: 16 }
    let mutable j = 0
    for k, v, i of obj
      data.push [k, v]
      expect(i).to.equal j
      j += 1
    expect(4).to.equal j
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with else", #
    let keys = []
    let obj = { a: 1, b: 4, c: 9, d: 16 }
    for k of obj
      keys.push k
    else
      fail()
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]
  
    let mutable hit-else = false
    let other = {}
    for k of other
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "object iteration loop with literal object", #
    let keys = []
    for k of { a: 1, b: 4, c: 9, d: 16 }
      keys.push k
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]

  it "object iteration loop with value and literal object", #
    let data = []
    for k, v of { a: 1, b: 4, c: 9, d: 16 }
      data.push [k, v]
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with value and index and literal object", #
    let data = []
    let mutable j = 0
    for k, v, i of { a: 1, b: 4, c: 9, d: 16 }
      data.push [k, v]
      expect(i).to.equal j
      j += 1
    expect(4).to.equal j
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with literal object", #
    let keys = []
    for k of { a: 1, b: 4, c: 9, d: 16 }
      keys.push k
    else
      fail()
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]
  
    let mutable hit-else = false
    for k of {}
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "object iteration loop only accesses object once", #
    let keys = []
    let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
    for k of obj()
      keys.push k
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]

  it "object iteration loop with value only accesses object once", #
    let data = []
    let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
    for k, v of obj()
      data.push [k, v]
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with value and index only accesses object once", #
    let data = []
    let obj = run-once { a: 1, b: 4, c: 9, d: 16 }
    let mutable j = 0
    for k, v, i of obj()
      data.push [k, v]
      expect(i).to.equal j
      j += 1
    expect(4).to.equal j
    data.sort #(a, b) -> a[0] <=> b[0]
  
    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with inheritance", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16
  
    let keys = []
    for k ofall new Parent
      keys.push k
    keys.sort()
    expect(keys).to.eql ["a", "b", "c", "d"]

  it "object iteration loop with inheritance and value", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16

    let data = []
    for k, v ofall new Parent
      data.push [k, v]
    data.sort #(a, b) -> a[0] <=> b[0]

    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop with inheritance and value and index", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16

    let data = []
    let mutable j = 0
    for k, v, i ofall new Parent
      data.push [k, v]
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 4
    data.sort #(a, b) -> a[0] <=> b[0]

    expect(data).to.eql [["a", 1], ["b", 4], ["c", 9], ["d", 16]]

  it "object iteration loop without inheritance", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16
  
    let keys = []
    for k of new Parent
      keys.push k
    keys.sort()
    expect(keys).to.eql ["a", "b"]

  it "object iteration loop without inheritance and value", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16

    let data = []
    for k, v of new Parent
      data.push [k, v]
    data.sort #(a, b) -> a[0] <=> b[0]

    expect(data).to.eql [["a", 1], ["b", 4]]

  it "object iteration loop without inheritance and value and index", #
    let Parent()!
      this.a := 1
      this.b := 4
    Parent::c := 9
    Parent::d := 16

    let data = []
    let mutable j = 0
    for k, v, i of new Parent
      data.push [k, v]
      expect(i).to.equal j
      j += 1
    expect(j).to.equal 2
    data.sort #(a, b) -> a[0] <=> b[0]
    expect(data).to.eql [["a", 1], ["b", 4]]

  it "iteration loop", #
    let mutable sum = 0
    let arr = [1, 4, 9, 16]
    for value in arr
      sum += value
    expect(sum).to.equal 30

  /*
  it "iteration loop does not respect identifier if reference is mutable", #
    let mutable sum = 0
    let mutable arr = [1, 4, 9, 16]
    for value in arr
      sum += value
      arr := [0, 0, 0, 0]
    expect(sum).to.equal 30
  */

  it "iteration loop with else", #
    let mutable sum = 0
    let arr = [1, 4, 9, 16]
    for value in arr
      sum += value
    else
      fail()
    expect(sum).to.equal 30
  
    let mutable hit-else = false
    let other-arr = []
    for value in other-arr
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "iteration loop with literal array", #
    let mutable sum = 0
    for value in [1, 4, 9, 16]
      sum += value
    expect(sum).to.equal 30

  it "iteration loop with literal array and else", #
    let mutable sum = 0
    for value in [1, 4, 9, 16]
      sum += value
    else
      fail()
    expect(sum).to.equal 30
  
    let mutable hit-else = false
    for value in []
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "iteration loop only calculates array once", #
    let arr = run-once [1, 4, 9, 16]
    let mutable sum = 0
    for value in arr()
      sum += value
    expect(sum).to.equal 30

  it "iteration loop with index", #
    let mutable sum = 0
    let mutable j = 0
    let arr = [1, 4, 9, 16]
    for value, index in arr
      sum += value
      expect(index).to.equal j
      j += 1
    expect(sum).to.equal 30

  it "iteration loop with index and literal array", #
    let mutable sum = 0
    let mutable j = 0
    for value, index in [1, 4, 9, 16]
      sum += value
      expect(index).to.equal j
      j += 1
    expect(sum).to.equal 30

  it "iteration loop with index only calculates array once", #
    let arr = run-once [1, 4, 9, 16]
    let mutable sum = 0
    let mutable j = 0
    for value, index in arr()
      sum += value
      expect(index).to.equal j
      j += 1
    expect(sum).to.equal 30

  it "object iteration loop scope", #
    let value-factories = []
    for k, v of { a: 1, b: 2, c: 3, d: 4 }
      value-factories.push #-> v
  
    let mutable sum = 0
    for factory in value-factories
      sum += factory()
    expect(sum).to.equal 10

  it "array iteration loop scope", #
    let value-factories = []
    for v in [1, 4, 9, 16]
      value-factories.push #-> v
  
    let mutable sum = 0
    for factory in value-factories
      sum += factory()
    expect(sum).to.equal 30

  it "iteration loop scope", #
    let funcs = []
    for alpha, i in ["alpha", "bravo", "charlie"]
      funcs.push #-> [i, alpha]

    expect(funcs[0]()).to.eql [0, "alpha"]
    expect(funcs[1]()).to.eql [1, "bravo"]
    expect(funcs[2]()).to.eql [2, "charlie"]

  it "iteration loop scope with multiple", #
    let funcs = []
    for alpha, i in ["alpha", "bravo", "charlie"]
      for bravo, j in ["delta", "echo", "foxtrot"]
        funcs.push #-> [i, alpha, j, bravo]

    expect(funcs[0]()).to.eql [0, "alpha", 0, "delta"]
    expect(funcs[4]()).to.eql [1, "bravo", 1, "echo"]
    expect(funcs[8]()).to.eql [2, "charlie", 2, "foxtrot"]

  it "object iteration loop scope", #
    let funcs = []
    for k, v, i of {alpha:"one", bravo:"two", charlie:"three"}
      funcs.push #-> [k, v, i]
  
    let items = []
    for func in funcs
      items.push func()
  
    expect(items[0].pop()).to.equal 0
    expect(items[1].pop()).to.equal 1
    expect(items[2].pop()).to.equal 2
    items.sort #(a, b) -> a[0] <=> b[0]
    expect(items[0]).to.eql ["alpha", "one"]
    expect(items[1]).to.eql ["bravo", "two"]
    expect(items[2]).to.eql ["charlie", "three"]

  it "object iteration loop scope with multiple", #
    let funcs = []
    for k, v, i of {alpha:"one", bravo:"two", charlie:"three"}
      for k2, v2, j of {delta:"four", echo:"five", foxtrot:"six"}
        funcs.push #-> [k, k2, v, v2, i, j]
  
    let items = []
    for func in funcs
      items.push(func())
  
    expect(items[0].splice(4, 2)).to.eql [0, 0]
    expect(items[4].splice(4, 2)).to.eql [1, 1]
    expect(items[8].splice(4, 2)).to.eql [2, 2]
    items.sort #(a, b) -> a[0] <=> b[0] or a[1] <=> b[1]
    expect(items[0]).to.eql ["alpha", "delta", "one", "four"]
    expect(items[4]).to.eql ["bravo", "echo", "two", "five"]
    expect(items[8]).to.eql ["charlie", "foxtrot", "three", "six"]

  it "single-line range loop", #
    let mutable sum = 0
    for i in 1 til 10;sum+=i
    expect(sum).to.equal 45

  it "Simple array comprehension", #
    let nums = for n in [1, 2, 3, 4, 5]
      n * n
    expect(nums).to.eql [1, 4, 9, 16, 25]

  it "Array comprehension with if", #
    let nums = for n in [1, 2, 3, 4, 5]
      if n % 2 == 0
        n * n
    expect(nums).to.eql [4, 16]

  it "Range comprehension", #
    let nums = for i in 1 til 100
      i
  
    let mutable j = 0
    for num in nums
      j += 1
      expect(j).to.equal num
    expect(j).to.equal 99

  it "Object comprehension", #
    let obj = { alpha: 1, bravo: 2, charlie: 3 }
    let keys = for k of obj
      k
    keys.sort()
  
    expect(keys).to.eql ["alpha", "bravo", "charlie"]

  it "For-some in range", #
    let mutable i = 0
    expect(for some x in 1 til 10
      i += 1
      expect(x).to.equal i
      x == 4).to.be.true
    expect(i).to.equal 4
  
    expect(for some x in 1 til 10
      x > 10).to.be.false
  
    expect(#-> gorilla.compile-sync """let y = 0
    for some x in 1 til 10
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"
  
  it "For-some in range as an if test", #
    if (for some x in 0 til 10; x == 11)
      throw Error()
    unless (for some x in 0 til 10; x == 4)
      throw Error()

  it "For-every in range", #
    let mutable i = 0
    expect(for every x in 1 til 10
      i += 1
      expect(x).to.equal i
      x <= 4).to.be.false
    expect(i).to.equal 5

    expect(for every x in 1 til 10
      x <= 10).to.be.true
  
    expect(#-> gorilla.compile-sync """let y = 0
    for every x in 1 til 10
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"
  
  it "For-every in range as an if test", #
    if (for every x in 0 til 10; x < 5)
      throw Error()
    unless (for every x in 0 til 10; x < 10)
      throw Error()

  it "For-first in range", #
    expect(for first x in 1 til 10
      if x > 5
        x ^ 2).to.equal 36
  
    expect(for first x in 1 til 10
      if x > 10
        x ^ 2
    else
      1000000).to.equal 1000000

  it "For-filter in range", #
    let arr = for filter i in 1 til 10
      i not %% 2
    expect(arr).to.eql [1, 3, 5, 7, 9]

    expect(#-> gorilla.compile-sync """let y = 0
    for filter i in 1 til 10
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-reduce in range", #
    expect(for reduce i in 1 til 10, sum = 0
      sum + i).to.equal 45
    
    expect(#-> gorilla.compile-sync """let y = 0
    for reduce i in 1 til 10, sum = 0
      sum + i
    else
      throw Error()""").throws gorilla.ParserError, r"4:1"

  it "For-some in array", #
    expect(for some x in [#-> 1, #-> 2, fail]
      x() == 2).to.be.true
  
    expect(for some x in [#-> 1, #-> 2, #-> 3]
      x() == 4).to.be.false
  
    expect(#-> gorilla.compile-sync """let y = 0
    for some x in [1, 2]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-every in array", #
    expect(for every x in [#-> 1, #-> 2, fail]
      x() < 2).to.be.false
  
    expect(for every x in [#-> 1, #-> 2, #-> 3]
      x() < 4).to.be.true
  
    expect(#-> gorilla.compile-sync """let y = 0
    for every x in [1, 2]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-first in array", #
    expect(for first x in [#-> 1, #-> 2, fail]
      let value = x()
      if value > 1
        value ^ 2).to.equal 4
  
    expect(for first x in [#-> 1, #-> 2, #-> 3]
      let value = x()
      if value > 3
        value ^ 2
    else
      1000000).to.equal 1000000

  it "For-filter in array", #
    let arr = for filter x in [1, 4, 9, 16, 25, 36]
      x %% 2
    expect(arr).to.eql [4, 16, 36]
  
    expect(#-> gorilla.compile-sync """let y = 0
    for filter x in [1, 4, 9, 16, 25, 36]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-reduce in array", #
    expect(for reduce i in [1, 2, 3, 4], sum = 0
      sum + i).to.equal 10
  
    expect(#-> gorilla.compile-sync """let y = 0
    for reduce i in [1, 2, 3, 4], sum = 0
      sum + i
    else
      throw Error()""").throws gorilla.ParserError, r"4:1"

  it "For-some of object", #
    expect(for some k, v of {a:1, b:2, c:3}
      v == 2).to.be.true
  
    expect(for some k, v of {a:1, b:2, c:3}
      v == 4).to.be.false
  
    expect(#-> gorilla.compile-sync """let y = 0
    for some k, v of {a:1, b:2, c:3}
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-every of object", #
    expect(for every k, v of {a:1, b:2, c:3}
      v <= 2).to.be.false
  
    expect(for every k, v of {a:1, b:2, c:3}
      v < 4).to.be.true
  
    expect(#-> gorilla.compile-sync """let y = 0
    for every k, v of {a:1, b:2, c:3}
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-first of object", #
    expect(for first k, v of {a:1, b:2, c:3}
      if v > 2
        v ^ 2).to.equal 9
  
    expect(for first k, v of {a:1, b:2, c:3}
      if v > 3
        v ^ 2
    else
      1000000).to.equal 1000000

  it "For-reduce of object", #
    expect(for reduce k, v of {a:1, b:2, c:3}, sum = 0
      sum + v).to.equal 6
  
    expect(#-> gorilla.compile-sync """let y = 0
    for reduce k, v of {a:1, b:2, c:3}, sum = 0
      sum + v
    else
      throw Error()""").throws gorilla.ParserError, r"4:1"

  it "While-some", #
    let mutable i = 0
    expect(while some i < 10, i += 1
      i == 4).to.be.true
    expect(i).to.equal 4
  
    i := 0
    expect(while some i < 10, i += 1
      i > 10).to.be.false
  
    expect(#-> gorilla.compile-sync """
    let mutable i = 0
    while some i < 10, i += 1
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "While-every", #
    let mutable i = 0
    expect(while every i < 10, i += 1
      i <= 4).to.be.false
    expect(i).to.equal 5
  
    i := 0
    expect(while every i < 10, i += 1
      i <= 10).to.be.true

    expect(#-> gorilla.compile-sync """
    let mutable i = 0
    while every i < 10, i += 1
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "While-first", #
    let mutable i = 0
    expect(while first i < 10, i += 1
      if i > 5
        i ^ 2).to.equal 36
  
    i := 0
    expect(while first i < 10, i += 1
      if i > 10
        i ^ 2
    else
      1000000).to.equal 1000000

  it "While-reduce", #
    let mutable i = 0
    expect(while reduce i < 10, i += 1, sum = 0
      sum + i).to.equal 45
  
    expect(#-> gorilla.compile-sync """
    let mutable i = 0
    while reduce i < 10, i += 1, sum = 0
      sum + i
    else
      throw Error()""").throws gorilla.ParserError, r"4:1"

  /*
  it "Repeat-while-some", #
    let mutable i = 0
    ok repeat while some i > 0 and i < 10, i += 1
      i == 4
    expect(i).to.equal 4
  
    i := 0
    ok not (repeat while some i < 10, i += 1
      i > 10)
  
    throws #-> Cotton.compile-sync("""
    let mutable i = 0
    repeat while some i < 10, i += 1
      true
    else
      throw Error()"""), (e) -> e.line == 4 or true

  it "Repeat-while-every", #
    let mutable i = 0
    ok not (repeat while every i > 0 and i < 10, i += 1
      i <= 4)
    expect(i).to.equal 5
  
    i := 0
    ok repeat while every i < 10, i += 1
      i <= 10

    throws #-> Cotton.compile-sync("""
    let mutable i = 0
    repeat while every i < 10, i += 1
      true
    else
      throw Error()"""), (e) -> e.line == 4 or true

  it "Repeat-while-first", #
    let mutable i = 0
    expect(repeat while first i > 0 and i < 10, i += 1).to.equal 36
      if i > 5
        i ^ 2
  
    i := 0
    expect(repeat while first i < 10, i += 1).to.equal 1000000
      if i > 10
        i ^ 2
    else
      1000000

  it "Repeat-while-reduce", #
    let mutable i = 0
    expect(repeat while reduce i > 0 and i < 10, i += 1, sum = 0).to.equal 45
      sum + i
  
    throws #-> Cotton.compile-sync("""
    let mutable i = 0
    repeat while reduce i < 10, i += 1, sum = 0
      sum + i
    else
      throw Error()"""), (e) -> e.line == 4 or true
  */
  it "Variable inside loop should be reset to undefined", #
    for i in 1 til 10
      let mutable value = undefined
      if i == 5
        value := "other"
      else
        expect(value).to.equal undefined
  
  it "Variable outside loop should be reset to undefined", #
    let mutable value = undefined
    for i in 1 til 10
      value := undefined
      if i == 5
        value := "other"
      else
        expect(value).to.equal undefined
    expect(value).to.equal undefined
  
  it "Variable outside loop should be expected value, even after setting to undefined", #
    let mutable value = undefined
    for i in 1 til 10
      if i == 5
        value := "other"
        break
      else
        expect(value).to.equal undefined
    expect(value).to.equal "other"
    value := undefined
    expect(value).to.equal undefined

  it "a simple for loop without a return does not return an array", #
    let fun()
      let x = 0
      for i in 1 til 10
        i
    expect(fun()).to.equal undefined

  it "for loop in string", #
    let array = "alpha".split("")
    let mutable j = 0
    for item, i in "alpha"
      expect(i).to.equal j
      expect(item).to.equal array[i]
      j += 1
    expect(j).to.equal 5

  it "loop up til Infinity", #
    let mutable j = 0
    for i in 0 til Infinity
      expect(i).to.equal j
      if i == 10
        break
      j += 1
    expect(j).to.equal 10

  it "loop down til Infinity", #
    for i in 0 til Infinity by -1
      fail()

  it "loop down til -Infinity", #
    let mutable j = 0
    for i in 0 til -Infinity by -1
      expect(i).to.equal j
      if i == -10
        break
      j -= 1
    expect(j).to.equal -10

  it "loop down til Infinity", #
    for i in 0 til Infinity by -1
      fail()

  it "loop up til -Infinity", #
    for i in 0 til -Infinity
      fail()

  let array-to-iterator(array)
    {
      iterator: #-> this
      next: #
        if @index >= @array.length
          { done: true, value: void }
        else
          let element = @array[@index]
          @index += 1
          { done: false, value: element }
      array
      index: 0
    }

  it "iterator loop", #
    let mutable sum = 0
    for value from array-to-iterator [1, 4, 9, 16]
      sum += value
    expect(sum).to.equal 30

  it "iterator loop with else", #
    let mutable sum = 0
    for value from array-to-iterator [1, 4, 9, 16]
      sum += value
    else
      fail()
    expect(sum).to.equal 30
  
    let mutable hit-else = false
    for value from array-to-iterator []
      fail()
    else
      hit-else := true
    expect(hit-else).to.be.true

  it "iterator loop only calculates iterator once", #
    let iterator = run-once(array-to-iterator([1, 4, 9, 16]))
    let mutable sum = 0
    for value from iterator()
      sum += value
    expect(sum).to.equal 30

  it "iterator loop with index", #
    let mutable sum = 0
    let mutable j = 0
    for value, index from array-to-iterator([1, 4, 9, 16])
      sum += value
      expect(index).to.equal j
      j += 1
    expect(sum).to.equal 30

  it "iterator iteration loop scope", #
    let value-factories = []
    for v from array-to-iterator([1, 4, 9, 16])
      value-factories.push(#-> v)
  
    let mutable sum = 0
    for factory in value-factories
      sum += factory()
    expect(sum).to.equal 30

  it "iterator iteration loop scope with multiple", #
    let funcs = []
    for alpha, i from array-to-iterator(["alpha", "bravo", "charlie"])
      for bravo, j from array-to-iterator(["delta", "echo", "foxtrot"])
        funcs.push(#-> [i, alpha, j, bravo])

    expect(funcs[0]()).to.eql [0, "alpha", 0, "delta"]
    expect(funcs[4]()).to.eql [1, "bravo", 1, "echo"]
    expect(funcs[8]()).to.eql [2, "charlie", 2, "foxtrot"]

  it "For-some in iteration loop", #
    expect(for some x from array-to-iterator [#-> 1, #-> 2, fail]
      x() == 2).to.be.true

    expect(for some x from array-to-iterator [#-> 1, #-> 2, #-> 3]
      x() == 4).to.be.false

    expect(#-> gorilla.compile-sync """let y = 0
    for some x from array-to-iterator [1, 2]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-every in iteration loop", #
    expect(for every x from array-to-iterator [#-> 1, #-> 2, fail]
      x() < 2).to.be.false

    expect(for every x from array-to-iterator [#-> 1, #-> 2, #-> 3]
      x() < 4).to.be.true

    expect(#-> gorilla.compile-sync """let y = 0
    for every x from array-to-iterator [1, 2]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-first in iteration loop", #
    expect(for first x from array-to-iterator [#-> 1, #-> 2, fail]
      let value = x()
      if value > 1
        value ^ 2).to.equal 4

    expect(for first x from array-to-iterator [#-> 1, #-> 2, #-> 3]
      let value = x()
      if value > 3
        value ^ 2
    else
      1000000).to.equal 1000000

  it "For-filter in iteration loop", #
    let arr = for filter x from array-to-iterator [1, 4, 9, 16, 25, 36]
      x %% 2
    expect(arr).to.eql [4, 16, 36]

    expect(#-> gorilla.compile-sync """let y = 0
    for filter x from array-to-iterator [1, 4, 9, 16, 25, 36]
      true
    else
      throw Error()""").throws gorilla.MacroError, r"Cannot use a for loop with an else.*5:\d+"

  it "For-reduce in iteration loop", #
    expect(for reduce i from array-to-iterator([1, 2, 3, 4]), sum = 0
      sum + i).to.equal 10

    expect(#-> gorilla.compile-sync """let y = 0
    for reduce i from array-to-iterator([1, 2, 3, 4]), sum = 0
      sum + i
    else
      throw Error()""").throws gorilla.ParserError, r"4:1"

  it "C-style for loop", #
    let mutable i = 0
    let values = []
    for (i := 0); i < 10; i += 1
      values.push i
    expect(values).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  it "C-style for every loop", #
    let mutable i = 0
    expect(for every (i := 0); i < 10; i += 1
      i < 5).to.be.false
    expect(for every (i := 0); i < 10; i += 1
      i < 10).to.be.true

  it "C-style for some loop", #
    let mutable i = 0
    expect(for some (i := 0); i < 10; i += 1
      i == 10).to.be.false
    expect(for some (i := 0); i < 10; i += 1
      i == 5).to.be.true

  it "C-style for reduce loop", #
    let mutable i = 0
    expect(for reduce (i := 0); i < 10; i += 1, sum = 0
      sum + i).to.equal 45

  it "For-in loop over a string", #
    let result = []
    for c in "hello"
      result.push c
    expect(result).to.eql ["h", "e", "l", "l", "o"]

  it "For-in loop over a string as expression", #
    let result = for c in "hello"; c
    expect(result).to.eql ["h", "e", "l", "l", "o"]

  it "For-in literal array with step = 1", #
    let result = []
    for v, i in [1, 4, 9, 16] by 1
      result.push [v, i]
    expect(result).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]

  it "For-in literal array with step = -1", #
    let result = []
    for v, i in [1, 4, 9, 16] by -1
      result.push [v, i]
    expect(result).to.eql [[16, 3], [9, 2], [4, 1], [1, 0]]

  it "For-in literal array with step = 2", #
    let result = []
    for v, i in [1, 4, 9, 16] by 2
      result.push [v, i]
    expect(result).to.eql [[1, 0], [9, 2]]

  it "For-in literal array with step = -2", #
    let result = []
    for v, i in [1, 4, 9, 16] by -2
      result.push [v, i]
    expect(result).to.eql [[16, 3], [4, 1]]

  it "For-in literal array with dynamic step", #
    let run(step)
      let get-step = run-once step
      let result = []
      for v, i in [1, 4, 9, 16] by get-step()
        result.push [v, i]
      result
    expect(run 1).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]
    expect(run -1).to.eql [[16, 3], [9, 2], [4, 1], [1, 0]]
    expect(run 2).to.eql [[1, 0], [9, 2]]
    expect(run -2).to.eql [[16, 3], [4, 1]]

  it "For-in array with step = 1", #
    let result = []
    let arr = run-once [1, 4, 9, 16]
    for v, i in arr() by 1
      result.push [v, i]
    expect(result).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]

  it "For-in array with step = -1", #
    let result = []
    let arr = run-once [1, 4, 9, 16]
    for v, i in arr() by -1
      result.push [v, i]
    expect(result).to.eql [[16, 3], [9, 2], [4, 1], [1, 0]]

  it "For-in array with step = 2", #
    let result = []
    let arr = run-once [1, 4, 9, 16]
    for v, i in arr() by 2
      result.push [v, i]
    expect(result).to.eql [[1, 0], [9, 2]]

  it "For-in array with step = -2", #
    let result = []
    let arr = run-once [1, 4, 9, 16]
    for v, i in arr() by -2
      result.push [v, i]
    expect(result).to.eql [[16, 3], [4, 1]]

  it "For-in array with dynamic step", #
    let run(arr, step)
      let get-arr = run-once arr
      let get-step = run-once step
      let result = []
      for v, i in get-arr() by get-step()
        result.push [v, i]
      result
    expect(run [1, 4, 9, 16], 1).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]
    expect(run [1, 4, 9, 16], -1).to.eql [[16, 3], [9, 2], [4, 1], [1, 0]]
    expect(run [1, 4, 9, 16], 2).to.eql [[1, 0], [9, 2]]
    expect(run [1, 4, 9, 16], -2).to.eql [[16, 3], [4, 1]]

  it "For-in array with slice", #
    let mutable result = []
    let array = [1, 4, 9, 16]
    let mutable arr = run-once array
    for v, i in arr()[1 to 2]
      result.push [v, i]
    expect(result).to.eql [[4, 1], [9, 2]]
    
    result := []
    arr := run-once array
    for v, i in arr()[0 to -1]
      result.push [v, i]
    expect(result).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]
  
    result := []
    arr := run-once array
    for v, i in arr()[1 til -1]
      result.push [v, i]
    expect(result).to.eql [[4, 1], [9, 2]]
  
    result := []
    arr := run-once array
    for v, i in arr()[-3 til -1]
      result.push [v, i]
    expect(result).to.eql [[4, 1], [9, 2]]
  
    result := []
    arr := run-once array
    for v, i in arr()[-3 to -1]
      result.push [v, i]
    expect(result).to.eql [[4, 1], [9, 2], [16, 3]]
  
    result := []
    arr := run-once array
    for v, i in arr()[3 til 6]
      result.push [v, i]
    expect(result).to.eql [[16, 3]]

  it "For-in array with slice and step = -1", #
    let mutable result = []
    let array = [1, 4, 9, 16]
    let mutable arr = run-once array
    for v, i in arr()[2 to 1 by -1]
      result.push [v, i]
    expect(result).to.eql [[9, 2], [4, 1]]
  
    result := []
    arr := run-once array
    for v, i in arr()[-2 til 0 by -1]
      result.push [v, i]
    expect(result).to.eql [[9, 2], [4, 1]]
  
    result := []
    arr := run-once array
    for v, i in arr()[-2 to 1 by -1]
      result.push [v, i]
    expect(result).to.eql [[9, 2], [4, 1]]
  
    result := []
    arr := run-once array
    for v, i in arr()[-1 to -3 by -1]
      result.push [v, i]
    expect(result).to.eql [[16, 3], [9, 2], [4, 1]]
  
    result := []
    arr := run-once array
    for v, i in arr()[6 to -2 by -1]
      result.push [v, i]
    expect(result).to.eql [[16, 3], [9, 2]]

  it "For-in array with dynamic slice and step", #
    let run(array, start, end, step)
      let get-array = run-once array
      let get-start = run-once start
      let get-end = run-once end
      let get-step = run-once step
    
      let result = []
      for v, i in get-array()[get-start() to get-end() by get-step()]
        result.push [v, i]
      result
  
    expect(run [1, 4, 9, 16], 0, -1, 1).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]
    expect(run [1, 4, 9, 16], 0, -2, 1).to.eql [[1, 0], [4, 1], [9, 2]]
    expect(run [1, 4, 9, 16], 0, 10, 1).to.eql [[1, 0], [4, 1], [9, 2], [16, 3]]
    expect(run [1, 4, 9, 16], -1, 10, 1).to.eql [[16, 3]]
    expect(run [1, 4, 9, 16], -1, 2, 1).to.eql []
    expect(run [1, 4, 9, 16], -1, 0, -1).to.eql [[16, 3], [9, 2], [4, 1], [1, 0]]
    expect(run [1, 4, 9, 16], 0, -1, 2).to.eql [[1, 0], [9, 2]]
    expect(run [1, 4, 9, 16], -1, 0, -2).to.eql [[16, 3], [4, 1]]
    expect(run [1, 4, 9, 16], -2, 0, -2).to.eql [[9, 2], [1, 0]]
    expect(run [1, 4, 9, 16], -2, 3, -2).to.eql []

describe "spreading a loop", #
  it "within an invocation", #
    let fun = stub().with-args(0, 1, 4, 9, 16, 25).returns \alpha
    
    let result = fun(0, ...(for x in [1, 2, 3, 4]; x * x), 25)
    
    expect(fun).to.be.called-once
    expect(result).to.equal \alpha
  
  it "within an array", #
    let result = [0, ...(for x in [1, 2, 3, 4]; x * x), 25]
    
    expect(result).to.eql [0, 1, 4, 9, 16, 25]
