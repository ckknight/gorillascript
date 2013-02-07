test "empty", #
  let obj = {}
  eq "[object Object]", obj.to-string()

test "single-line", #
  let obj = {a: 1, b: 2, c: 3}
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "single-line, trailing comma", #
  let obj = {a: 1, b: 2, c: 3,}
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "single-line, quoted keys", #
  let obj = {"a": 1, "b": 2, "c": 3}
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "single-line, quoted keys, trailing comma", #
  let obj = {"a": 1, "b": 2, "c": 3,}
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "single-line, parenthesized keys", #
  let key = "hello"
  let obj = {a: 1, b: 2, c: 3, key: 4, [key]: 5}
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c
  eq 4, obj.key
  eq 5, obj.hello

test "single-line, parenthesized keys get overwritten", #
  let key = "hello"
  let obj = {a: 1, b: 2, c: 3, [key]: 5, hello: 4 }
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c
  eq 4, obj.hello

test "single-line, interpolated keys", #
  let value = 3
  let obj = {key1: 1, key2: 2, "key$(value)": value}
  eq 1, obj.key1
  eq 2, obj.key2
  eq 3, obj.key3

test "single-line, numeric keys", #
  let obj = {1: "a", 2: "b", 3: "c"}
  eq "a", obj[1]
  eq "b", obj[2]
  eq "c", obj[3]

test "single-line, numeric keys that aren't their string equivalents", #
  let obj = { "01234": "a", 1234: "b", 1e3: "c" }
  eq "a", obj["01234"]
  eq "b", obj["1234"]
  eq "b", obj[1234]
  eq "b", obj.1234
  eq "c", obj[1e3]
  eq "c", obj[1000]
  eq "c", obj["1000"]
  eq void, obj["1e3"]
  eq "c", obj.1000

test "multi-line", #
  let obj = {
    a: 1,
    b: 2,
    c: 3
  }
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "multi-line, no commas", #
  let obj = {
    a: 1
    b: 2
    c: 3
  }
  eq 1, obj.a
  eq 2, obj.b
  eq 3, obj.c

test "multi-line, with functions", #
  let obj = {
    a: #-> 1
    b: #-> 2
    c: #-> 3
  }
  eq 1, obj.a()
  eq 2, obj.b()
  eq 3, obj.c()

test "keywords as literal keys", #
  let obj = {
    if: "woo"
    true: false
    false: true
  }
  eq "woo", obj.if
  eq false, obj.true
  eq true, obj.false

test "keywords as string keys", #
  let obj = {
    "if": "woo"
    "true": false
    "false": true
  }
  eq "woo", obj.if
  eq false, obj.true
  eq true, obj.false

test "setting keywords as strings", #
  let obj = {}
  obj["if"] := "woo"
  obj["true"] := false
  obj["false"] := true
  eq "woo", obj["if"]
  eq false, obj["true"]
  eq true, obj["false"]

test "setting keywords", #
  let obj = {}
  obj.if := "woo"
  obj.true := false
  obj.false := true
  eq "woo", obj.if
  eq false, obj.true
  eq true, obj.false

test "inline objects with this references", #
  let obj = {
    value: 1
    get: #-> this.value
  }
  eq 1, obj.get()
  obj.value := 2
  eq 2, obj.get()

test "inline objects with method calls as values", #
  let third = #(a, b, c) -> c
  let obj = {
    one: "one"
    two: third "one", "two", "three"
  }
  eq "one", obj.one
  eq "three", obj.two

test "setting fields of fields", #
  let obj = {}
  let obj2 = {}
  let obj3 = {}
  obj.alpha := obj2
  obj.alpha.bravo := obj3
  
  eq obj2, obj["alpha"]
  eq obj3, obj2["bravo"]
  eq obj3, obj["alpha"]["bravo"]

test "object key existence", #
  let obj = { alpha: "bravo" }
  ok obj haskey "alpha"
  ok not (obj haskey "charlie")
  ok obj not haskey "charlie"

test "object key ownership", #
  let Class()!
    this.charlie := "delta"
  Class::alpha := "bravo"
  
  let obj = new Class()
  ok obj haskey "alpha"
  ok not (obj ownskey "alpha")
  ok obj not ownskey "alpha"
  ok obj haskey "charlie"
  ok obj ownskey "charlie"
  ok not (obj haskey "echo")
  ok obj not haskey "echo"
  ok not (obj ownskey "echo")
  ok obj not ownskey "echo"


test "object with the same key twice", #
  throws #-> gorilla.compile("""
  let x = {
    alpha: 'bravo'
    alpha: 'charlie'
  }
  """), #(e) -> e.line == 4

test "multiple access", #
  let obj = { alpha: "bravo", charlie: "delta", echo: "foxtrot" }

  array-eq ["bravo", "delta"], obj["alpha", "charlie"]

test "multiple access only accesses object once", #
  let obj = run-once { alpha: "bravo", charlie: "delta", echo: "foxtrot" }

  array-eq ["bravo", "delta"], obj()["alpha", "charlie"]

test "access on literal", #
  eq "bravo", {alpha: "bravo"}.alpha
  eq "bravo", {alpha: "bravo"}["alpha"]

test "implicit values", #
  let alpha = "bravo"
  let charlie = "delta"
  
  let obj = { alpha, charlie }
  eq "bravo", obj.alpha
  eq "delta", obj.charlie
  
  let other = { "alpha", "charlie" }
  eq "alpha", other.alpha
  eq "charlie", other.charlie
  
  let fun = #-> { undefined, this, arguments, true, false, 0, Infinity, NaN, 1 }
  let strange = fun.call(obj, "alpha", "bravo", "charlie")
  
  ok strange ownskey "undefined"
  ok strange ownskey "this"
  ok strange ownskey "arguments"
  ok strange ownskey "true"
  ok strange ownskey "false"
  ok strange ownskey "0"
  ok strange ownskey "Infinity"
  ok strange ownskey "NaN"
  ok strange ownskey "1"
  eq undefined, strange.undefined
  eq obj, strange.this
  ok not is-array! strange.arguments
  array-eq ["alpha", "bravo", "charlie"], strange.arguments[0 to -1]
  eq true, strange.true
  eq false, strange.false
  eq 0, strange["0"]
  eq Infinity, strange.Infinity
  array-eq NaN, strange.NaN
  eq 1, strange["1"]

test "implicit values as accesses", #
  let fun(obj) -> { obj.alpha, this.bravo, @charlie, obj.golf.hotel.india, obj::kilo }
  
  let obj = fun.call({ bravo: "echo", charlie: "foxtrot"}, { alpha: "delta", golf: { hotel: { india: "juliet" } }, prototype: { kilo: "lima" } })
  eq "delta", obj.alpha
  eq "echo", obj.bravo
  eq "foxtrot", obj.charlie
  eq "juliet", obj.india
  eq "lima", obj.kilo

test "dashed-keys", #
  let obj = { dashed-key: "hello", normalKey: "there" }
  eq "hello", obj.dashed-key
  eq "hello", obj.dashedKey
  eq "there", obj.normalKey
  eq "there", obj.normal-key

test "object with prototype", #
  let parent = { alpha: "bravo" }
  
  let child = { extends parent, charlie: "delta" }
  
  eq "bravo", parent.alpha
  eq "bravo", child.alpha
  eq void, parent.charlie
  eq "delta", child.charlie

test "object with protoype, multi-line", #
  let parent = { alpha: "bravo" }
  
  let child = { extends parent
    charlie: "delta"
  }
  
  eq "bravo", parent.alpha
  eq "bravo", child.alpha
  eq void, parent.charlie
  eq "delta", child.charlie

test "object with prototype, no members", #
  let parent = { alpha: "bravo" }
  let child = { extends parent }
  
  eq "bravo", parent.alpha
  eq "bravo", child.alpha
  child.charlie := "delta"
  eq void, parent.charlie
  eq "delta", child.charlie

test "object inheriting from literal object", #
  let obj = { extends { alpha: "bravo" }, charlie: "delta" }
  
  eq "bravo", obj.alpha
  eq "delta", obj.charlie
  ok obj ownskey \charlie
  ok not (obj ownskey \alpha)

test "object with boolean value syntax", #
  let x = 5
  let obj = { +alpha, -bravo, +"charlie", -"delta$x", +[x] }
  
  eq true, obj.alpha
  eq false, obj.bravo
  eq true, obj.charlie
  eq false, obj.delta5
  eq true, obj[5]

test "unclosed object syntax, single-line", #
  let obj = alpha: true, bravo: false, charlie: "delta"
  
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "unclosed object syntax in invocation", #
  let f(o) -> o
  let obj = f alpha: true, bravo: false, charlie: "delta"
  
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "unclosed object syntax in invocation with leading args", #
  let f(a, b, o) -> [a, b, o]
  let arr = f 1, 2, alpha: true, bravo: false, charlie: "delta"
  
  eq 1, arr[0]
  eq 2, arr[1]
  eq true, arr[2].alpha
  eq false, arr[2].bravo
  eq "delta", arr[2].charlie

test "unclosed object syntax as function return", #
  let f() -> alpha: true, bravo: false, charlie: "delta"
  let obj = f()
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "unclosed object syntax, multi-line", #
  let obj =
    alpha: true
    bravo: false
    charlie: "delta"
  
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "unclosed object syntax, multi-line with some pairs on same line", #
  let obj =
    alpha: true
    bravo: false, charlie: "delta"
    echo: "foxtrot"
  
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie
  eq "foxtrot", obj.echo

test "unclosed object syntax in invocation, multi-line", #
  let f(o) -> o
  let obj = f
    alpha: true
    bravo: false
    charlie: "delta"
  
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "unclosed object syntax in invocation with leading args, multi-line", #
  let f(a, b, o) -> [a, b, o]
  let arr = f 1, 2,
    alpha: true
    bravo: false
    charlie: "delta"
  
  eq 1, arr[0]
  eq 2, arr[1]
  eq true, arr[2].alpha
  eq false, arr[2].bravo
  eq "delta", arr[2].charlie

test "unclosed object syntax as function return", #
  let f()
    alpha: true
    bravo: false
    charlie: "delta"
  let obj = f()
  eq \object, typeof obj
  eq true, obj.alpha
  eq false, obj.bravo
  eq "delta", obj.charlie

test "multi-level unclosed object syntax", #
  let x =
    alpha: \bravo
    charlie:
      delta: \echo
      foxtrot:
        golf:
          hotel: \india
      juliet: \kilo
  
  eq \bravo, x.alpha
  eq \echo, x.charlie.delta
  eq \india, x.charlie.foxtrot.golf.hotel
  eq \kilo, x.charlie.juliet

test "multi-level unclosed array and object syntax", #
  let x =
    * alpha: \bravo
      charlie: \delta
    *
      echo: \foxtrot
      golf: \hotel
    * juliet:
        * kilo: \lima
          mike: \november
        * oscar: \papa
  
  eq \bravo, x[0].alpha
  eq \delta, x[0].charlie
  eq \foxtrot, x[1].echo
  eq \hotel, x[1].golf
  eq \lima, x[2].juliet[0].kilo
  eq \november, x[2].juliet[0].mike
  eq \papa, x[2].juliet[1].oscar

test "multi-level closed array and unclosed object syntax", #
  let x = [
    alpha:
      bravo: \charlie
      delta: \echo
    foxtrot:
      * \golf
      * \hotel
  ]
  
  eq \charlie, x[0].alpha.bravo
  eq \echo, x[0].alpha.delta
  array-eq [\golf, \hotel], x[0].foxtrot

test "unclosed object syntax inside closed object", #
  let x = {
    alpha: \bravo
    charlie:
      delta: \echo
      foxtrot: \golf
    hotel: \india
  }
  
  eq \bravo, x.alpha
  eq \echo, x.charlie.delta
  eq \golf, x.charlie.foxtrot
  eq \india, x.hotel

test "unclosed array syntax inside closed object", #
  let x = {
    alpha: \bravo
    charlie:
      * \delta
      * \echo
    foxtrot: \golf
  }

  eq \bravo, x.alpha
  eq \delta, x.charlie[0]
  eq \echo, x.charlie[1]
  eq \golf, x.foxtrot

test "unclosed object syntax in if statement", #
  let f(x)
    if x
      alpha: \bravo
      charlie: \delta
    else
      echo: \foxtrot
      golf: \hotel

  let a = f(true)
  eq \bravo, a.alpha
  eq \delta, a.charlie
  let b = f(false)
  eq \foxtrot, b.echo
  eq \hotel, b.golf

test "unclosed object syntax in for statement", #
  let arr = [\alpha, \bravo, \charlie]
  let result = for x, i in arr
    index: i
    value: x
  
  eq 3, result.length
  eq 0, result[0].index
  eq \alpha, result[0].value
  eq 1, result[1].index
  eq \bravo, result[1].value
  eq 2, result[2].index
  eq \charlie, result[2].value

test "Can have a key of property, get, and set", #
  let obj = {
    property: 5
    get: 6
    set: 7
  }
  
  eq 5, obj.property
  eq 6, obj.get
  eq 7, obj.set

test "Property syntax with value", #
  if typeof Object.define-property != \function
    return
  
  let make-key() -> Math.random().to-fixed(15)
  do random-key = make-key()
    let obj = {
      property x:
        value: 5
      property [random-key]:
        value: 6
    }
  
    eq 5, obj.x
    eq 6, obj[random-key]
  eq 5, { property x: { value: 5 } }.x
  
  let enumerable-works = do random-key = make-key()
    let o = {}
    Object.define-property o, random-key, {value: true, enumerable: false}
    for every k ofall o
      k != random-key
  
  if enumerable-works
    do random-key = make-key()
      for k ofall { property [random-key]: { value: true, enumerable: false } }
        if k == random-key
          fail()
  
  do random-key = make-key()
    ok for some k ofall { property [random-key]: { value: true, enumerable: true } }
      k == random-key
  
  let configurable-works = do random-key = make-key()
    let o = {}
    Object.define-property o, random-key, { value: true, configurable: false }
    ok o ownskey random-key
    try
      delete o[random-key]
    catch e
      void
    o[random-key]
  
  if configurable-works
    do random-key = make-key()
      let o = { property [random-key]: { value: true, configurable: false } }
      try
        delete o[random-key]
      catch e
        void
      ok o ownskey random-key
      ok o[random-key]
  
  do random-key = make-key()
    let o = { property [random-key]: { value: true, configurable: true } }
    ok o ownskey random-key
    delete o[random-key]
    ok o not ownskey random-key
  
  let writable-works = do random-key = make-key()
    let o = {}
    Object.define-property o, random-key, { value: true, writable: false }
    try
      o[random-key] := false
    catch e
      void
    o[random-key]
  
  if writable-works
    do random-key = make-key()
      let o = { property [random-key]: { value: true, writable: false } }
      try
        o[random-key] := false
      catch e
        void
      ok o[random-key]
  
  do random-key = make-key()
    let o = { property [random-key]: { value: true, writable: true } }
    eq true, o[random-key]
    o[random-key] := false
    eq false, o[random-key]

let accessor-support = do
  if typeof Object.define-property != \function
    return false
  
  let read(x) -> x
  
  let obj = {}
  let mutable gets = 0
  let mutable sets = 0
  try
    Object.define-property obj, "x", { get: #-> gets += 1, set: #-> sets += 1 }
  catch e
    return false
  eq 0, gets
  eq 0, sets
  
  if obj.x != 1 or gets != 1 or sets != 0
    return false
  
  obj.x := true
  gets == 1 and sets == 1
  
test "Property syntax with get/set", #
  if not accessor-support
    return
  
  let mutable gets = 0
  let mutable sets = 0
  let obj = {}
  let mutable last-value = obj
  let o =
    get-x: #
      eq o, this
      gets += 1
    set-x: #(value)!
      eq o, this
      sets += 1
      last-value := value
    property x: {
      get: #-> @get-x()
      set: #(value) -> @set-x(value)
    }
  
  eq obj, last-value
  eq 0, gets
  eq 0, sets
  eq 1, o.x
  eq 1, gets
  eq 0, sets
  eq obj, last-value
  
  o.x := "hello"
  eq 1, gets
  eq 1, sets
  eq "hello", last-value

test "get syntax", #
  if not accessor-support
    return
  
  let mutable gets = 0
  let o =
    get-x: #
      eq o, this
      gets += 1
    get x: #-> @get-x()
  
  eq 0, gets
  eq 1, o.x
  eq 1, gets

test "set syntax", #
  if not accessor-support
    return
  
  let mutable last-value = {}
  let mutable sets = 0
  let o =
    set-x: #(value)!
      eq o, this
      last-value := value
      sets += 1
    set x: #(value) -> @set-x(value)
  
  eq \object, typeof last-value
  eq 0, sets
  o.x := "hello"
  eq 1, sets
  eq "hello", last-value
  
test "get/set syntax", #
  if not accessor-support
    return
  
  let mutable gets = 0
  let mutable sets = 0
  let obj = {}
  let mutable last-value = obj
  let o =
    get-x: #
      eq o, this
      gets += 1
    set-x: #(value)!
      eq o, this
      sets += 1
      last-value := value
    get x: #-> @get-x()
    set x: #(value) -> @set-x(value)
  
  eq obj, last-value
  eq 0, gets
  eq 0, sets
  eq 1, o.x
  eq 1, gets
  eq 0, sets
  eq obj, last-value
  
  o.x := "hello"
  eq 1, gets
  eq 1, sets
  eq "hello", last-value

test "get/set executes in the right order", #
  if not accessor-support or typeof Object.get-own-property-descriptor != \function
    return
  
  let get-ided-func = do
    let mutable id = 0
    #(f)
      f.id := id += 1
      f
  
  let o =
    value: void
    get x: get-ided-func #
      eq o, this
      @value
    set x: get-ided-func #(value)
      eq o, this
      @value := value
  
  eq 1, Object.get-own-property-descriptor(o, \x).get.id
  eq 2, Object.get-own-property-descriptor(o, \x).set.id
  eq void, o.x
  o.x := "hello"
  eq "hello", o.x
  
  let p =
    value: void
    set x: get-ided-func #(value)
      eq p, this
      @value := value
    get x: get-ided-func #
      eq p, this
      @value
  
  eq 4, Object.get-own-property-descriptor(p, \x).get.id
  eq 3, Object.get-own-property-descriptor(p, \x).set.id
  eq void, p.x
  p.x := "hello"
  eq "hello", p.x

test "get and set not next to each other", #
  throws #-> gorilla.compile("""
  let x = {
    get alpha: 'bravo'
    bravo: 'charlie'
    set alpha: 'delta'
  }
  """), #(e) -> e.line == 5
  throws #-> gorilla.compile("""
  let x = {
    set alpha: 'bravo'
    bravo: 'charlie'
    get alpha: 'delta'
  }
  """), #(e) -> e.line == 5

test "Multiple gets of the same key", #
  throws #-> gorilla.compile("""
  let x = {
    get alpha: 'bravo'
    get alpha: 'delta'
  }
  """), #(e) -> e.line == 4
  throws #-> gorilla.compile("""
  let x = {
    get alpha: 'bravo'
    set bravo: 'charlie'
    get alpha: 'delta'
  }
  """), #(e) -> e.line == 5
  throws #-> gorilla.compile("""
  let x = {
    get alpha: 'bravo'
    set alpha: 'charlie'
    get alpha: 'delta'
  }
  """), #(e) -> e.line == 5

test "Multiple sets of the same key", #
  throws #-> gorilla.compile("""
  let x = {
    set alpha: 'bravo'
    set alpha: 'delta'
  }
  """), #(e) -> e.line == 4
  throws #-> gorilla.compile("""
  let x = {
    get alpha: 'bravo'
    set alpha: 'charlie'
    set alpha: 'delta'
  }
  """), #(e) -> e.line == 5
  throws #-> gorilla.compile("""
  let x = {
    set alpha: 'bravo'
    get alpha: 'charlie'
    set alpha: 'delta'
  }
  """), #(e) -> e.line == 5

test "Method declaration in object", #
  let x = {
    f() -> "g"
  }
  
  eq "g", x.f()
