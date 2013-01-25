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
  ok not Array.is-array(strange.arguments)
  array-eq ["alpha", "bravo", "charlie"], strange.arguments[:]
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