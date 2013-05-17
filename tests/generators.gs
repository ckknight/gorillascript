let to-array(iterator, values = [])
  values.reverse()
  values.push void
  let arr = []
  while true
    let item = if iterator.send
      iterator.send values.pop()
    else
      iterator.next()
    if item.done
      if item.value?
        return { arr, item.value }
      else
        return arr
    arr.push item.value

let order-list()
  let list = []
  let f(value)
    list.push value
    value
  f.list := list
  f

describe "single-value yield", #
  describe "yielding value", #
    let fun(value)* -> yield value
  
    it "produces as single result", #
      expect(to-array fun("alpha")).to.eql ["alpha"]
      expect(to-array fun("bravo")).to.eql ["bravo"]
  
    it "on complete, always returns done", #
      let iter = fun("value")
      expect(iter.next()).to.eql { -done, value: "value" }
      for i in 0 til 10
        expect(iter.next()).to.eql { +done, value: void }
  
  describe "yielding this", #
    let fun()* -> yield this
    
    it "produces as single result", #
      let obj = {}
      expect(to-array fun@(obj)).to.eql [obj]
  
  describe "yielding bound this", #
    let get-iter()
      let fun()@* -> yield this
    
    it "produces as single result", #
      let obj = {}
      expect(to-array get-iter@(obj)@({})).to.eql [obj]

describe "multi-valued yield", #
  let fun()*
    yield "alpha"
    yield "bravo"
    yield "charlie"
  
  it "yields expected items", #
    expect(to-array fun()).to.eql ["alpha", "bravo", "charlie"]
  
  it "on complete, always returns done", #
    let iter = fun()
    to-array iter
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }

describe "yield with conditional", #
  let fun(value)*
    yield "alpha"
    if value
      yield "bravo"
    yield "charlie"
  
  it "yields expected items", #
    expect(to-array fun(true)).to.eql ["alpha", "bravo", "charlie"]
    expect(to-array fun(false)).to.eql ["alpha", "charlie"]

describe "yield with variables", #
  let fun()*
    let mutable i = 0
    yield i
    i += 1
    yield i
    i += 1
    yield i
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2]

describe "yield with conditional that has no inner yields", #
  let fun(value)*
    yield "alpha"
    let mutable next = void
    if value
      next := "bravo"
    else
      next := "charlie"
    yield next

  it "yields expected items", #
    expect(to-array fun(true)).to.eql ["alpha", "bravo"]
    expect(to-array fun(false)).to.eql ["alpha", "charlie"]

describe "yield with while", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10
      yield i
      i += 1
    yield 10
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe "yield with while and increment", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10, i += 1
      yield i
    yield 10
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe "yield with while and break", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10
      if i > 5
        break
      yield i
      i += 1
    yield 10
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 10]

describe "yield with while and break that has no inner yields", #
  let fun(value)*
    yield 0
    let mutable i = 1
    while i < 10
      if i > 5
        break
      i += 1
    yield i

  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 6]

describe "yield with while and increment and continue", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10, i += 1
      if i == 5
        i := 6
        continue
      yield i
    yield 10
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 7, 8, 9, 10]

describe "yield with for-in", #
  let fun(arr)*
    yield "start"
    for x in arr
      yield x
    yield "end"
  
  it "yields expected items", #
    expect(to-array fun(["a", "b", "c", "d", "e"])).to.eql ["start", "a", "b", "c", "d", "e", "end"]

describe "yield with for-range", #
  let fun(start, finish)*
    yield start
    for i in start + 1 til finish
      yield i
    yield finish
  
  it "yields expected items", #
    expect(to-array fun(1, 6)).to.eql [1, 2, 3, 4, 5, 6]

describe "yield with for-of", #
  let fun(obj)*
    yield ["start", 0]
    for k, v of obj
      yield [k, v]
    yield ["end", 1]
  
  it "yields expected items", #
    expect(to-array(fun({ alpha: "bravo", charlie: "delta", echo: "foxtrot" })).sort #(a, b) -> a[0] <=> b[0]).to.eql [["alpha", "bravo"], ["charlie", "delta"], ["echo", "foxtrot"], ["end", 1], ["start", 0]]

describe "yield with for-of with inheritance", #
  let fun(obj)*
    yield ["start", 0]
    for k, v of obj
      yield [k, v]
    yield ["end", 1]
  
  it "yields expected items", #
    let Class()!
      @alpha := "bravo"
    Class::charlie := "delta"
  
    expect(to-array(fun(new Class)).sort #(a, b) -> a[0] <=> b[0]).to.eql [["alpha", "bravo"], ["end", 1], ["start", 0]]

describe "yield with for-ofall with inheritance", #
  let fun(obj)*
    yield ["start", 0]
    for k, v ofall obj
      yield [k, v]
    yield ["end", 1]
  
  it "yields expected items", #
    let Class()!
      @alpha := "bravo"
    Class::charlie := "delta"
  
    expect(to-array(fun(new Class)).sort #(a, b) -> a[0] <=> b[0]).to.eql [["alpha", "bravo"], ["charlie", "delta"], ["end", 1], ["start", 0]]

describe "yield with try-catch", #  
  let obj = {}
  let fun(value)*
    yield "alpha"
    try
      yield "bravo"
      if value
        throw obj
      yield "charlie"
    catch e
      expect(e).to.equal obj
      yield "delta"
    yield "echo"
    
  it "yields expected items", #
    expect(to-array fun(true)).to.eql ["alpha", "bravo", "delta", "echo"]
    expect(to-array fun(false)).to.eql ["alpha", "bravo", "charlie", "echo"]

describe "yield with try-finally", #
  let obj = Error()
  let fun-this = {}
  let fun(cleanup)*
    expect(this).to.equal(fun-this)
    yield "alpha"
    try
      expect(this).to.equal(fun-this)
      yield "bravo"
      throw obj
      yield "charlie"
    finally
      expect(this).to.equal(fun-this)
      cleanup()
    yield "delta"
    
  it "yields expected items and calls cleanup at expected time", #
    let cleanup = stub()
    let g = fun@(fun-this, cleanup)
    expect(g.next()).to.eql { -done, value: "alpha" }
    expect(g.next()).to.eql { -done, value: "bravo" }
    expect(cleanup).to.not.be.called
    expect(#-> g.next()).throws(obj)
    expect(cleanup).to.be.called-once
    for i in 0 til 10
      expect(g.next()).to.eql { +done, value: void }
    expect(cleanup).to.be.called-once

describe "yield with switch", #
  let fun(get-value)*
    switch get-value()
    case 0; yield 0
    case 1
      yield 1
      yield 2
    case 2
      yield 3
      fallthrough
    case 3
      yield 4
      yield 5
    default
      yield 6
      yield 7

  it "yields expected items", #
    let run(value)
      let get-value = stub().returns value
      let iter = fun(get-value)
      expect(get-value).to.not.be.called
      let result = to-array iter
      expect(get-value).to.be.called-once
      result
    expect(run(0)).to.eql [0]
    expect(run(1)).to.eql [1, 2]
    expect(run(2)).to.eql [3, 4, 5]
    expect(run(3)).to.eql [4, 5]
    expect(run(4)).to.eql [6, 7]

describe "yield with for-from", #
  let range(start, finish)*
    for i in start til finish
      yield i

  let fun()*
    yield 0
    for item from range(1, 10)
      yield item
    yield 10
  
  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe "yield* iterator", #
  let range(start, finish)*
    for i in start til finish
      yield i

  let fun()*
    yield 0
    yield* range(1, 10)
    yield 10

  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe "yield* array", #
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  let fun()*
    yield 0
    yield* arr
    yield 10

  it "yields expected items", #
    expect(to-array fun()).to.eql [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

describe "yield in let statement", #
  let fun()*
    let x = yield 1
    yield x

  it "yields expected items", #
    expect(to-array fun(), [2]).to.eql [1, 2]

describe "yield in assign statement", #
  it "yields expected items", #
    let order = order-list()
    let obj = {}
    let fun()*
      obj[order(\key)] := yield order(\value)
      expect(order.list).to.eql [\key, \value]
      yield obj.key

    expect(to-array fun(), [\alpha]).to.eql [\value, \alpha]

describe "yield as throw expression", #
  it "yields expected items", #
    let order = order-list()
    let fun()*
      throw yield order(\value)

    let generator = fun()
    expect(order.list).to.eql []
    expect(generator.send(void)).to.eql { -done, \value }
    expect(order.list).to.eql [\value]
    let obj = Error()
    expect(#-> generator.send(obj)).throws(obj)
    expect(order.list).to.eql [\value]
    for i in 0 til 10
      expect(generator.send(void)).to.eql { +done, value: void }

describe "yield in call statement", #
  it "yields expected items", #
    let order = order-list()
    let ran = stub()
    let func(...args)
      expect(args).to.eql [\alpha, \echo, \charlie]
      ran()
    let fun()*
      order(func)(order(\alpha), yield order(\bravo), order(\charlie))
      expect(order.list).to.eql [func, \alpha, \bravo, \charlie]
      yield \delta

    expect(to-array fun(), [\echo]).to.eql [\bravo, \delta]
    expect(ran).to.be.called-once

describe "yield in call statement, yield as func", #
  it "yields expected items", #
    let order = order-list()
    let obj = {}
    let ran = stub()
    let func(...args)!
      expect(args).to.eql [\bravo, \charlie, \delta]
      ran()
    let fun()*
      order(yield \alpha)(order(\bravo), order(\charlie), order(\delta))
      expect(order.list).to.eql [func, \bravo, \charlie, \delta]
      yield \delta
  
    expect(to-array fun(), [func]).to.eql [\alpha, \delta]
    expect(ran).to.be.called-once

describe "yield in call expression", #
  it "yields expected items", #
    let order = order-list()
    let obj = {}
    let get-args(...args) -> args
    let fun()*
      let value = order(get-args)(order(\alpha), yield order(\bravo), order(\charlie))
      expect(order.list).to.eql [get-args, \alpha, \bravo, \charlie]
      expect(value).to.eql [\alpha, \echo, \charlie]
      yield \delta
  
    expect(to-array fun(), [\echo]).to.eql [\bravo, \delta]

describe "multiple yields in call expression", #
  it "yields expected items", #
    let order = order-list()
    let obj = {}
    let get-args(...args) -> args
    let fun()*
      let value = order(get-args)(order(\alpha), yield order(\bravo), yield order(\charlie), order(\delta))
      expect(order.list).to.eql [get-args, \alpha, \bravo, \charlie, \delta]
      expect(value).to.eql [\alpha, \foxtrot, \golf, \delta]
      yield \echo
  
    expect(to-array fun(), [\foxtrot, \golf]).to.eql [\bravo, \charlie, \echo]

describe "yield in access", #
  it "yields expected items", #
    let fun()*
      let value = (yield \alpha)[yield \bravo]
      yield value
  
    expect(to-array fun(), [{charlie: \delta}, \charlie]).to.eql [\alpha, \bravo, \delta]

describe "yield in array", #
  it "yields expected items", #
    let fun()*
      let value = [\alpha, yield \bravo, \charlie, yield \delta, \echo]
      yield value
  
    expect(to-array fun(), [\foxtrot, \golf]).to.eql [\bravo, \delta, [\alpha, \foxtrot, \charlie, \golf, \echo]]

describe "yield in array with spread", #
  it "yields expected items", #
    let arr-1 = [\alpha, \bravo]
    let arr-2 = [\charlie, \delta]
    let fun()*
      let value = [\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel]
      yield value
  
    expect(to-array fun(), [\india, [\juliet, \kilo]]).to.eql [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]]

describe "yield in binary expression", #
  it "yields expected items", #
    let fun()*
      let value = (yield 1) + (yield 2) + (yield 3)
      yield value
  
    expect(to-array fun(), [4, 5, 6]).to.eql [1, 2, 3, 15]

describe "yield in binary and", #
  it "yields expected items", #
    let fun()*
      let value = (yield 1) and (yield 2) and (yield 3)
      yield value
  
    expect(to-array fun(), [true, true, true]).to.eql [1, 2, 3, true]
    expect(to-array fun(), [true, true, false]).to.eql [1, 2, 3, false]
    expect(to-array fun(), [true, false]).to.eql [1, 2, false]
    expect(to-array fun(), [false]).to.eql [1, false]

describe "yield in binary or", #
  it "yields expected items", #
    let fun()*
      let value = (yield 1) or (yield 2) or (yield 3)
      yield value
  
    expect(to-array fun(), [false, false, false]).to.eql [1, 2, 3, false]
    expect(to-array fun(), [false, false, true]).to.eql [1, 2, 3, true]
    expect(to-array fun(), [false, true]).to.eql [1, 2, true]
    expect(to-array fun(), [true]).to.eql [1, true]

describe "yield in call expression with spread", #
  it "yields expected items", #
    let obj = {}
    let get-args(...args)
      args
    let arr-1 = [\alpha, \bravo]
    let arr-2 = [\charlie, \delta]
    let fun()*
      let value = get-args(\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
      yield value

    expect(to-array fun(), [\india, [\juliet, \kilo]]).to.eql [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]]

describe "yield in new call expression", #
  it "yields expected items", #
    let MyType(...args)!
      expect(this).to.be.an.instanceof(MyType)
      @args := args
    let arr-1 = [\alpha, \bravo]
    let arr-2 = [\charlie, \delta]
    let fun()*
      let value = new MyType(\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
      expect(value).to.be.an.instanceof(MyType)
      yield value.args

    expect(to-array fun(), [\india, [\juliet, \kilo]]).to.eql [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]]

describe "yield in apply call expression", #
  it "yields expected items", #
    let obj = {}
    let get-args(...args)
      expect(this).to.equal obj
      args
    let arr-1 = [\alpha, \bravo]
    let arr-2 = [\charlie, \delta]
    let fun()*
      let value = get-args@(obj, \echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
      yield value
  
    expect(to-array fun(), [\india, [\juliet, \kilo]]).to.eql [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]]

describe "yield in eval", #
  let fun()*
    let x = yield \alpha
    let y = eval yield \bravo
    yield y
  
  it "yields expected items", #
    expect(to-array fun(), [\charlie, \x]).to.eql [\alpha, \bravo, \charlie]

describe "yield in unary expression", #
  let fun()*
    let value = not (yield \alpha)
    yield value

  it "yields expected items", #
    expect(to-array fun(), [false]).to.eql [\alpha, true]

describe "yield in string interpolation", #
  let fun()*
    let value = "$(yield \alpha) $(yield \bravo)"
    yield value

  it "yields expected items", #
    expect(to-array fun(), [\charlie, \delta]).to.eql [\alpha, \bravo, "charlie delta"]

describe "yield in regexp interpolation", #
  let fun()*
    let value = r"$(yield \alpha) $(yield \bravo)"g
    yield value

  it "yields expected items", #
    let arr = to-array fun(), [\charlie, \delta]
    expect(arr).to.eql [\alpha, \bravo, r"charlie delta"g]

describe "return in generator", #
  let fun(return-early)*
    yield \alpha
    if return-early
      return
    yield \bravo
  
  it "yields expected items", #
    expect(to-array fun(true)).to.eql [\alpha]
    expect(to-array fun(false)).to.eql [\alpha, \bravo]

describe "return with value in generator", #
  let fun(value)*
    yield \alpha
    return? value
    yield \bravo
  
  it "yields expected items", #
    let mutable iter = fun(\charlie)
    expect(to-array iter).to.eql { arr: [\alpha], value: \charlie }
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }
    iter := fun()
    expect(to-array iter).to.eql [\alpha, \bravo]
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }

describe "yield with an uncaught error returns that it's done after error", #
  let fun(obj)*
    yield \alpha
    throw obj
    fail()
    yield \bravo
    fail()
  
  it "yields expected items", #
    let err = Error()
    let iter = fun(err)
    expect(iter.next()).to.eql { -done, value: \alpha }
    expect(#-> iter.next()).throws(err)
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }

describe "a generator without yield statements", #
  it "has no items", #
    let ran = stub()
    let fun()*
      ran()
    
    let iter = fun()
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }
    expect(ran).to.be.called-once
  
  it "is not executed until the first .next call", #
    let ran = stub()
    let fun()*
      ran()
    
    let iter = fun()
    expect(ran).to.not.be.called
    iter.next()
    expect(ran).to.be.called-once
  
  it "has a result if value is returned", #
    let ran = stub()
    let fun()*
      ran()
      return "hello"
    
    let iter = fun()
    expect(iter.next()).to.eql { +done, value: "hello" }
    for i in 0 til 10
      expect(iter.next()).to.eql { +done, value: void }
    expect(ran).to.be.called-once
  
  it "has the expected this value", #
    let obj = {}
    let ran = stub()
    let fun()*
      ran()
      expect(this).to.equal obj
    
    let iter = fun@(obj)
    iter.next()
    expect(ran).to.be.called-once
  
  it "receives expected arguments", #
    let ran = stub()
    let fun(...args)*
      ran()
      expect(args).to.eql [\alpha, \bravo, \charlie]
    
    let iter = fun(\alpha, \bravo, \charlie)
    iter.next()
    expect(ran).to.be.called-once
