let iterator-to-array(iterator, values = [])
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

test "single-value yield on single-line", #
  let fun(value)* -> yield value
  
  array-eq ["alpha"], iterator-to-array(fun("alpha"))
  array-eq ["bravo"], iterator-to-array(fun("bravo"))
  array-eq ["charlie"], iterator-to-array(fun("charlie"))

test "single-value yield this on single-line", #
  let fun()* -> yield this
  
  let obj = {}
  array-eq [obj], iterator-to-array(fun@(obj))

test "single-value bound yield this on single-line", #
  let get-iter()
    let fun()@* -> yield this
  
  let obj = {}
  array-eq [obj], iterator-to-array(get-iter@(obj)())

test "multi-valued yield", #
  let fun()*
    yield "alpha"
    yield "bravo"
    yield "charlie"
  
  array-eq ["alpha", "bravo", "charlie"], iterator-to-array(fun())

test "yield with conditional", #
  let fun(value)*
    yield "alpha"
    if value
      yield "bravo"
    yield "charlie"
  
  array-eq ["alpha", "bravo", "charlie"], iterator-to-array(fun(true))
  array-eq ["alpha", "charlie"], iterator-to-array(fun(false))

test "yield with variables", #
  let fun()*
    let mutable i = 0
    yield i
    i += 1
    yield i
    i += 1
    yield i
  
  array-eq [0, 1, 2], iterator-to-array(fun())

test "yield with conditional that has no inner yields", #
  let fun(value)*
    yield "alpha"
    let mutable next = void
    if value
      next := "bravo"
    else
      next := "charlie"
    yield next

  array-eq ["alpha", "bravo"], iterator-to-array(fun(true))
  array-eq ["alpha", "charlie"], iterator-to-array(fun(false))

test "yield with while", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10
      yield i
      i += 1
    yield 10
  
  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array(fun())

test "yield with while and increment", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10, i += 1
      yield i
    yield 10
  
  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array(fun())

test "yield with while and break", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10
      if i > 5
        break
      yield i
      i += 1
    yield 10
  
  array-eq [0, 1, 2, 3, 4, 5, 10], iterator-to-array(fun())

test "yield with while and break that has no inner yields", #
  let fun(value)*
    yield "alpha"
    let mutable i = 1
    while i < 10
      if i > 5
        break
      i += 1
    yield i

  array-eq ["alpha", 6], iterator-to-array(fun())

test "yield with while and increment and continue", #
  let fun()*
    yield 0
    let mutable i = 1
    while i < 10, i += 1
      if i == 5
        i := 6
        continue
      yield i
    yield 10
  
  array-eq [0, 1, 2, 3, 4, 7, 8, 9, 10], iterator-to-array(fun())

test "yield with for-in", #
  let fun(arr)*
    yield "start"
    for x in arr
      yield x
    yield "end"
  
  array-eq ["start", "a", "b", "c", "d", "e", "end"], iterator-to-array(fun(["a", "b", "c", "d", "e"]))

test "yield with for-range", #
  let fun(start, finish)*
    yield start
    for i in start + 1 til finish
      yield i
    yield finish
  
  array-eq [1, 2, 3, 4, 5, 6], iterator-to-array(fun(1, 6))

test "yield with for-of", #
  let fun(obj)*
    yield ["start", 0]
    for k, v of obj
      yield [k, v]
    yield ["end", 1]
  
  array-eq [["alpha", "bravo"], ["charlie", "delta"], ["echo", "foxtrot"], ["end", 1], ["start", 0]], iterator-to-array(fun({ alpha: "bravo", charlie: "delta", echo: "foxtrot" })).sort #(a, b) -> a[0] <=> b[0]

test "yield with for-of with inheritance", #
  let fun(obj)*
    yield ["start", 0]
    for k, v of obj
      yield [k, v]
    yield ["end", 1]
  
  let Class()!
    @alpha := "bravo"
  Class::charlie := "delta"
  
  array-eq [["alpha", "bravo"], ["end", 1], ["start", 0]], iterator-to-array(fun(new Class)).sort #(a, b) -> a[0] <=> b[0]

test "yield with for-ofall with inheritance", #
  let fun(obj)*
    yield ["start", 0]
    for k, v ofall obj
      yield [k, v]
    yield ["end", 1]
  
  let Class()!
    @alpha := "bravo"
  Class::charlie := "delta"
  
  array-eq [["alpha", "bravo"], ["charlie", "delta"], ["end", 1], ["start", 0]], iterator-to-array(fun(new Class)).sort #(a, b) -> a[0] <=> b[0]

test "yield with try-catch", #  
  let obj = {}
  let fun(value)*
    yield "alpha"
    try
      yield "bravo"
      if value
        throw obj
      yield "charlie"
    catch e
      eq obj, e
      yield "delta"
    yield "echo"
  array-eq ["alpha", "bravo", "delta", "echo"], iterator-to-array fun(true)
  array-eq ["alpha", "bravo", "charlie", "echo"], iterator-to-array fun(false)

test "yield with try-finally", #
  let cleanup = runOnce void
  let obj = {}
  let fun-this = {}
  let fun()*
    eq this, fun-this
    yield "alpha"
    try
      eq this, fun-this
      yield "bravo"
      throw obj
      yield "charlie"
    finally
      eq this, fun-this
      cleanup()
    yield "delta"
  
  let g = fun@(fun-this)
  deep-equal { done: false, value: "alpha" }, g.next()
  deep-equal { done: false, value: "bravo" }, g.next()
  throws g.next, #(e) -> e == obj
  ok cleanup.ran
  deep-equal { done: true, value: void }, g.next()

test "yield with switch", #
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
  
  array-eq [0], iterator-to-array fun(run-once 0)
  array-eq [1, 2], iterator-to-array fun(run-once 1)
  array-eq [3, 4, 5], iterator-to-array fun(run-once 2)
  array-eq [4, 5], iterator-to-array fun(run-once 3)
  array-eq [6, 7], iterator-to-array fun(run-once 4)

test "yield with for-from", #
  let range(start, finish)*
    for i in start til finish
      yield i

  let fun()*
    yield 0
    for item from range(1, 10)
      yield item
    yield 10

  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array fun()

test "yield* iterator", #
  let range(start, finish)*
    for i in start til finish
      yield i

  let fun()*
    yield 0
    yield* range(1, 10)
    yield 10

  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array fun()

test "yield* array", #
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  
  let fun()*
    yield 0
    yield* arr
    yield 10

  array-eq [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], iterator-to-array fun()

test "yield in let statement", #
  let fun()*
    let x = yield 1
    yield x

  array-eq [1, 2], iterator-to-array fun(), [2]

test "yield in assign statement", #
  let order = order-list()
  let obj = {}
  let fun()*
    obj[order(\key)] := yield order(\value)
    array-eq [\key, \value], order.list
    yield obj.key
  
  array-eq [\value, \alpha], iterator-to-array fun(), [\alpha]

test "yield as throw expression", #
  let order = order-list()
  let fun()*
    throw yield order(\value)
  
  let generator = fun()
  array-eq [], order.list
  deep-equal { done: false, \value }, generator.send(void)
  array-eq [\value], order.list
  let obj = {}
  throws #-> generator.send(obj), #(e) -> e == obj
  array-eq [\value], order.list

test "yield in call statement", #
  let order = order-list()
  let obj = {}
  let mutable func-called = false
  let func()!
    func-called := true
  let fun()*
    order(func)(order(\alpha), yield order(\bravo), order(\charlie))
    ok func-called
    array-eq [func, \alpha, \bravo, \charlie], order.list
    yield \delta
  
  array-eq [\bravo, \delta], iterator-to-array fun(), [\echo]

test "yield in call statement, yield as func", #
  let order = order-list()
  let obj = {}
  let mutable func-called = false
  let func(...args)!
    func-called := true
    array-eq [\bravo, \charlie, \delta], args
  let fun()*
    order(yield \alpha)(order(\bravo), order(\charlie), order(\delta))
    ok func-called
    array-eq [func, \bravo, \charlie, \delta], order.list
    yield \delta
  
  array-eq [\alpha, \delta], iterator-to-array fun(), [func]

test "yield in call expression", #
  let order = order-list()
  let obj = {}
  let to-array(...args) -> args
  let fun()*
    let value = order(to-array)(order(\alpha), yield order(\bravo), order(\charlie))
    array-eq [to-array, \alpha, \bravo, \charlie], order.list
    array-eq [\alpha, \echo, \charlie], value
    yield \delta
  
  array-eq [\bravo, \delta], iterator-to-array fun(), [\echo]

test "multiple yields in call expression", #
  let order = order-list()
  let obj = {}
  let to-array(...args) -> args
  let fun()*
    let value = order(to-array)(order(\alpha), yield order(\bravo), yield order(\charlie), order(\delta))
    array-eq [to-array, \alpha, \bravo, \charlie, \delta], order.list
    array-eq [\alpha, \foxtrot, \golf, \delta], value
    yield \echo
  
  array-eq [\bravo, \charlie, \echo], iterator-to-array fun(), [\foxtrot, \golf]

test "yield in access", #
  let fun()*
    let value = (yield \alpha)[yield \bravo]
    yield value
  
  array-eq [\alpha, \bravo, \delta], iterator-to-array fun(), [{charlie: \delta}, \charlie]

test "yield in array", #
  let fun()*
    let value = [\alpha, yield \bravo, \charlie, yield \delta, \echo]
    yield value
  
  array-eq [\bravo, \delta, [\alpha, \foxtrot, \charlie, \golf, \echo]], iterator-to-array fun(), [\foxtrot, \golf]

test "yield in array with spread", #
  let arr-1 = [\alpha, \bravo]
  let arr-2 = [\charlie, \delta]
  let fun()*
    let value = [\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel]
    yield value
  
  array-eq [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]], iterator-to-array fun(), [\india, [\juliet, \kilo]]

test "yield in binary expression", #
  let fun()*
    let value = (yield 1) + (yield 2) + (yield 3)
    yield value
  
  array-eq [1, 2, 3, 15], iterator-to-array fun(), [4, 5, 6]

test "yield in binary and", #
  let fun()*
    let value = (yield 1) and (yield 2) and (yield 3)
    yield value
  
  array-eq [1, 2, 3, true], iterator-to-array fun(), [true, true, true]
  array-eq [1, 2, 3, false], iterator-to-array fun(), [true, true, false]
  array-eq [1, 2, false], iterator-to-array fun(), [true, false]
  array-eq [1, false], iterator-to-array fun(), [false]

test "yield in binary or", #
  let fun()*
    let value = (yield 1) or (yield 2) or (yield 3)
    yield value
  
  array-eq [1, 2, 3, false], iterator-to-array fun(), [false, false, false]
  array-eq [1, 2, 3, true], iterator-to-array fun(), [false, false, true]
  array-eq [1, 2, true], iterator-to-array fun(), [false, true]
  array-eq [1, true], iterator-to-array fun(), [true]

test "yield in call expression with spread", #
  let obj = {}
  let to-array(...args) -> args
  let arr-1 = [\alpha, \bravo]
  let arr-2 = [\charlie, \delta]
  let fun()*
    let value = to-array(\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
    yield value

  array-eq [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]], iterator-to-array fun(), [\india, [\juliet, \kilo]]

test "yield in new call expression", #
  let MyType(...args)!
    ok this instanceof MyType
    @args := args
  let arr-1 = [\alpha, \bravo]
  let arr-2 = [\charlie, \delta]
  let fun()*
    let value = new MyType(\echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
    ok value instanceof MyType
    yield value.args

  array-eq [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]], iterator-to-array fun(), [\india, [\juliet, \kilo]]

test "yield in apply call expression", #
  let obj = {}
  let to-array(...args)
    eq obj, this
    args
  let arr-1 = [\alpha, \bravo]
  let arr-2 = [\charlie, \delta]
  let fun()*
    let value = to-array@(obj, \echo, yield \foxtrot, ...arr-1, ...(yield \golf), ...arr-2, \hotel)
    yield value
  
  array-eq [\foxtrot, \golf, [\echo, \india, \alpha, \bravo, \juliet, \kilo, \charlie, \delta, \hotel]], iterator-to-array fun(), [\india, [\juliet, \kilo]]

test "yield in eval", #
  let fun()*
    let x = yield \alpha
    let y = eval yield \bravo
    yield y
  
  array-eq [\alpha, \bravo, \charlie], iterator-to-array fun(), [\charlie, \x]

test "yield in unary expression", #
  let fun()*
    let value = not (yield \alpha)
    yield value

  array-eq [\alpha, true], iterator-to-array fun(), [false]

test "yield in string interpolation", #
  let fun()*
    let value = "$(yield \alpha) $(yield \bravo)"
    yield value

  array-eq [\alpha, \bravo, "charlie delta"], iterator-to-array fun(), [\charlie, \delta]

test "yield in regexp interpolation", #
  let fun()*
    let value = r"$(yield \alpha) $(yield \bravo)"g
    yield value

  let arr = iterator-to-array fun(), [\charlie, \delta]
  eq 3, arr.length
  eq \alpha, arr[0]
  eq \bravo, arr[1]
  ok arr[2] instanceof RegExp
  eq "charlie delta", arr[2].source
  ok arr[2].global

test "return in generator", #
  let fun(return-early)*
    yield \alpha
    if return-early
      return
    yield \bravo
  
  array-eq [\alpha], iterator-to-array fun(true)
  array-eq [\alpha, \bravo], iterator-to-array fun(false)

test "return with value in generator", #
  let fun(value)*
    yield \alpha
    return? value
    yield \bravo
  
  deep-equal { arr: [\alpha], value: \charlie }, iterator-to-array fun(\charlie)
  deep-equal [\alpha, \bravo], iterator-to-array fun()
