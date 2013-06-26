let {expect} = require 'chai'
let {stub} = require 'sinon'
let gorilla = require '../index'

describe "single-line objects", #
  it "can be empty", #
    let obj = {}
    expect(obj.to-string()).to.equal "[object Object]"

  it "single-line", #
    let obj = {a: 1, b: 2, c: 3}
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "single-line, trailing comma", #
    let obj = {a: 1, b: 2, c: 3,}
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "single-line, quoted keys", #
    let obj = {"a": 1, "b": 2, "c": 3}
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "single-line, quoted keys, trailing comma", #
    let obj = {"a": 1, "b": 2, "c": 3,}
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "single-line, parenthesized keys", #
    let key = "hello"
    let obj = {a: 1, b: 2, c: 3, key: 4, [key]: 5}
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3
    expect(obj.key).to.equal 4
    expect(obj.hello).to.equal 5

  it "single-line, parenthesized keys get overwritten", #
    let key = "hello"
    let obj = {a: 1, b: 2, c: 3, [key]: 5, hello: 4 }
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3
    expect(obj.hello).to.equal 4

  it "single-line, interpolated keys", #
    let value = 3
    let obj = {key1: 1, key2: 2, "key$(value)": value}
    expect(obj.key1).to.equal 1
    expect(obj.key2).to.equal 2
    expect(obj.key3).to.equal 3

  it "single-line, numeric keys", #
    let obj = {1: "a", 2: "b", 3: "c", "-1": "d", 0: "e", "-0": "f"}
    expect(obj[1]).to.equal "a"
    expect(obj[2]).to.equal "b"
    expect(obj[3]).to.equal "c"
    expect(obj[-1]).to.equal "d"
    expect(obj[0]).to.equal "e"
    expect(obj["-0"]).to.equal "f"

  it "single-line, numeric keys that aren't their string equivalents", #
    let obj = { "01234": "a", 1234: "b", 1e3: "c" }
    expect(obj["01234"]).to.equal "a"
    expect(obj["1234"]).to.equal "b"
    expect(obj[1234]).to.equal "b"
    expect(obj.1234).to.equal "b"
    expect(obj[1e3]).to.equal "c"
    expect(obj[1000]).to.equal "c"
    expect(obj["1000"]).to.equal "c"
    expect(obj["1e3"]).to.equal void
    expect(obj.1000).to.equal "c"

  it "multi-line", #
    let obj = {
      a: 1,
      b: 2,
      c: 3
    }
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "multi-line, no commas", #
    let obj = {
      a: 1
      b: 2
      c: 3
    }
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3

  it "multi-line, with functions", #
    let obj = {
      a: #-> 1
      b: #-> 2
      c: #-> 3
    }
    expect(obj.a()).to.equal 1
    expect(obj.b()).to.equal 2
    expect(obj.c()).to.equal 3

  it "keywords as literal keys", #
    let obj = {
      if: "woo"
      true: false
      false: true
    }
    expect(obj.if).to.equal "woo"
    expect(obj.true).to.equal false
    expect(obj.false).to.equal true

  it "keywords as string keys", #
    let obj = {
      "if": "woo"
      "true": false
      "false": true
    }
    expect(obj.if).to.equal "woo"
    expect(obj.true).to.equal false
    expect(obj.false).to.equal true

  it "setting keywords as strings", #
    let obj = {}
    obj["if"] := "woo"
    obj["true"] := false
    obj["false"] := true
    expect(obj["if"]).to.equal "woo"
    expect(obj["true"]).to.equal false
    expect(obj["false"]).to.equal true

  it "setting keywords", #
    let obj = {}
    obj.if := "woo"
    obj.true := false
    obj.false := true
    expect(obj.if).to.equal "woo"
    expect(obj.true).to.equal false
    expect(obj.false).to.equal true

  it "inline objects with this references", #
    let obj = {
      value: 1
      get: #-> this.value
    }
    expect(obj.get()).to.equal 1
    obj.value := 2
    expect(obj.get()).to.equal 2

  it "inline objects with method calls as values", #
    let third = #(a, b, c) -> c
    let obj = {
      one: "one"
      two: third "one", "two", "three"
    }
    expect(obj.one).to.equal "one"
    expect(obj.two).to.equal "three"

  it "setting fields of fields", #
    let obj = {}
    let obj2 = {}
    let obj3 = {}
    obj.alpha := obj2
    obj.alpha.bravo := obj3
  
    expect(obj["alpha"]).to.equal obj2
    expect(obj2["bravo"]).to.equal obj3
    expect(obj["alpha"]["bravo"]).to.equal obj3

  it "object key existence", #
    let obj = { alpha: "bravo" }
    expect(obj haskey "alpha").to.be.true
    expect(obj haskey "charlie").to.be.false
    expect(obj not haskey "charlie").to.be.true

  it "object key ownership", #
    let Class()!
      this.charlie := "delta"
    Class::alpha := "bravo"
  
    let obj = new Class()
    expect(obj haskey "alpha").to.be.true
    expect(obj ownskey "alpha").to.be.false
    expect(obj not ownskey "alpha").to.be.true
    expect(obj haskey "charlie").to.be.true
    expect(obj ownskey "charlie").to.be.true
    expect(obj haskey "echo").to.be.false
    expect(obj not haskey "echo").to.be.true
    expect(obj ownskey "echo").to.be.false
    expect(obj not ownskey "echo").to.be.true


  it "object with the same key twice", #
    expect(#-> gorilla.compile-sync """
    let x = {
      alpha: 'bravo'
      alpha: 'charlie'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*3:3"

  it "multiple access", #
    let obj = { alpha: "bravo", charlie: "delta", echo: "foxtrot" }
  
    expect(obj["alpha", "charlie"]).to.eql ["bravo", "delta"]

  it "multiple access only accesses object once", #
    let get-obj = stub().returns { alpha: "bravo", charlie: "delta", echo: "foxtrot" }
  
    expect(get-obj()["alpha", "charlie"]).to.eql ["bravo", "delta"]
    expect(get-obj).to.be.called-once

  it "access on literal", #
    expect({alpha: "bravo"}.alpha).to.equal "bravo"
    expect({alpha: "bravo"}["alpha"]).to.equal "bravo"

  it "implicit values", #
    let alpha = "bravo"
    let charlie = "delta"
  
    let obj = { alpha, charlie }
    expect(obj.alpha).to.equal "bravo"
    expect(obj.charlie).to.equal "delta"
  
    let other = { "alpha", "charlie" }
    expect(other.alpha).to.equal "alpha"
    expect(other.charlie).to.equal "charlie"
  
    let fun = #-> { undefined, this, arguments, true, false, 0, Infinity, NaN, 1 }
    let strange = fun.call(obj, "alpha", "bravo", "charlie")
  
    expect(strange ownskey "undefined").to.be.true
    expect(strange ownskey "this").to.be.true
    expect(strange ownskey "arguments").to.be.true
    expect(strange ownskey "true").to.be.true
    expect(strange ownskey "false").to.be.true
    expect(strange ownskey "0").to.be.true
    expect(strange ownskey "Infinity").to.be.true
    expect(strange ownskey "NaN").to.be.true
    expect(strange ownskey "1").to.be.true
    expect(strange.undefined).to.equal undefined
    expect(strange.this).to.equal obj
    expect(is-array! strange.arguments).to.be.false
    expect(strange.arguments[0 to -1]).to.eql ["alpha", "bravo", "charlie"]
    expect(strange.true).to.equal true
    expect(strange.false).to.equal false
    expect(strange["0"]).to.equal 0
    expect(strange.Infinity).to.equal Infinity
    expect(is-number! strange.NaN and isNaN(strange.NaN)).to.be.true
    expect(strange["1"]).to.equal 1

  it "implicit values as accesses", #
    let fun(obj) -> { obj.alpha, this.bravo, @charlie, obj.golf.hotel.india, obj::kilo }
  
    let obj = fun.call({ bravo: "echo", charlie: "foxtrot"}, { alpha: "delta", golf: { hotel: { india: "juliet" } }, prototype: { kilo: "lima" } })
    expect(obj.alpha).to.equal "delta"
    expect(obj.bravo).to.equal "echo"
    expect(obj.charlie).to.equal "foxtrot"
    expect(obj.india).to.equal "juliet"
    expect(obj.kilo).to.equal "lima"

  it "dashed-keys", #
    let obj = { dashed-key: "hello", normalKey: "there" }
    expect(obj.dashed-key).to.equal "hello"
    expect(obj.dashedKey).to.equal "hello"
    expect(obj.normalKey).to.equal "there"
    expect(obj.normal-key).to.equal "there"

  it "object with prototype", #
    let parent = { alpha: "bravo" }
  
    let child = { extends parent, charlie: "delta" }
  
    expect(parent.alpha).to.equal "bravo"
    expect(child.alpha).to.equal "bravo"
    expect(parent.charlie).to.equal void
    expect(child.charlie).to.equal "delta"

  it "object with protoype, multi-line", #
    let parent = { alpha: "bravo" }
  
    let child = { extends parent
      charlie: "delta"
    }
  
    expect(parent.alpha).to.equal "bravo"
    expect(child.alpha).to.equal "bravo"
    expect(parent.charlie).to.equal void
    expect(child.charlie).to.equal "delta"

  it "object with prototype, no members", #
    let parent = { alpha: "bravo" }
    let child = { extends parent }
  
    expect(parent.alpha).to.equal "bravo"
    expect(child.alpha).to.equal "bravo"
    child.charlie := "delta"
    expect(parent.charlie).to.equal void
    expect(child.charlie).to.equal "delta"

  it "object inheriting from literal object", #
    let obj = { extends { alpha: "bravo" }, charlie: "delta" }
  
    expect(obj.alpha).to.equal "bravo"
    expect(obj.charlie).to.equal "delta"
    expect(obj ownskey \charlie).to.be.true
    expect(obj ownskey \alpha).to.be.false

  it "object with boolean value syntax", #
    let x = 5
    let obj = { +alpha, -bravo, +"charlie", -"delta$x", +[x] }
  
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal true
    expect(obj.delta5).to.equal false
    expect(obj[5]).to.equal true

  it "unclosed object syntax, single-line", #
    let obj = alpha: true, bravo: false, charlie: "delta"
  
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "unclosed object syntax in invocation", #
    let f(o) -> o
    let obj = f alpha: true, bravo: false, charlie: "delta"
  
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "unclosed object syntax in invocation with leading args", #
    let f(a, b, o) -> [a, b, o]
    let arr = f 1, 2, alpha: true, bravo: false, charlie: "delta"
  
    expect(arr[0]).to.equal 1
    expect(arr[1]).to.equal 2
    expect(arr[2].alpha).to.equal true
    expect(arr[2].bravo).to.equal false
    expect(arr[2].charlie).to.equal "delta"

  it "unclosed object syntax as function return", #
    let f() -> alpha: true, bravo: false, charlie: "delta"
    let obj = f()
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "unclosed object syntax, multi-line", #
    let obj =
      alpha: true
      bravo: false
      charlie: "delta"
  
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "unclosed object syntax, multi-line with some pairs on same line", #
    let obj =
      alpha: true
      bravo: false, charlie: "delta"
      echo: "foxtrot"
  
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"
    expect(obj.echo).to.equal "foxtrot"

  it "unclosed object syntax in invocation, multi-line", #
    let f(o) -> o
    let obj = f
      alpha: true
      bravo: false
      charlie: "delta"
  
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "unclosed object syntax in invocation with leading args, multi-line", #
    let f(a, b, o) -> [a, b, o]
    let arr = f 1, 2,
      alpha: true
      bravo: false
      charlie: "delta"
  
    expect(arr[0]).to.equal 1
    expect(arr[1]).to.equal 2
    expect(arr[2].alpha).to.equal true
    expect(arr[2].bravo).to.equal false
    expect(arr[2].charlie).to.equal "delta"

  it "unclosed object syntax as function return", #
    let f()
      alpha: true
      bravo: false
      charlie: "delta"
    let obj = f()
    expect(obj).to.be.an \object
    expect(obj.alpha).to.equal true
    expect(obj.bravo).to.equal false
    expect(obj.charlie).to.equal "delta"

  it "multi-level unclosed object syntax", #
    let x =
      alpha: \bravo
      charlie:
        delta: \echo
        foxtrot:
          golf:
            hotel: \india
        juliet: \kilo
  
    expect(x.alpha).to.equal \bravo
    expect(x.charlie.delta).to.equal \echo
    expect(x.charlie.foxtrot.golf.hotel).to.equal \india
    expect(x.charlie.juliet).to.equal \kilo

  it "multi-level unclosed array and object syntax", #
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
  
    expect(x[0].alpha).to.equal \bravo
    expect(x[0].charlie).to.equal \delta
    expect(x[1].echo).to.equal \foxtrot
    expect(x[1].golf).to.equal \hotel
    expect(x[2].juliet[0].kilo).to.equal \lima
    expect(x[2].juliet[0].mike).to.equal \november
    expect(x[2].juliet[1].oscar).to.equal \papa

  it "multi-level closed array and unclosed object syntax", #
    let x = [
      alpha:
        bravo: \charlie
        delta: \echo
      foxtrot:
        * \golf
        * \hotel
    ]
  
    expect(x[0].alpha.bravo).to.equal \charlie
    expect(x[0].alpha.delta).to.equal \echo
    expect(x[0].foxtrot).to.eql [\golf, \hotel]

  it "unclosed object syntax inside closed object", #
    let x = {
      alpha: \bravo
      charlie:
        delta: \echo
        foxtrot: \golf
      hotel: \india
    }
  
    expect(x.alpha).to.equal \bravo
    expect(x.charlie.delta).to.equal \echo
    expect(x.charlie.foxtrot).to.equal \golf
    expect(x.hotel).to.equal \india

  it "unclosed array syntax inside closed object", #
    let x = {
      alpha: \bravo
      charlie:
        * \delta
        * \echo
      foxtrot: \golf
    }

    expect(x.alpha).to.equal \bravo
    expect(x.charlie[0]).to.equal \delta
    expect(x.charlie[1]).to.equal \echo
    expect(x.foxtrot).to.equal \golf

  it "unclosed object syntax in if statement", #
    let f(x)
      if x
        alpha: \bravo
        charlie: \delta
      else
        echo: \foxtrot
        golf: \hotel

    let a = f(true)
    expect(a.alpha).to.equal \bravo
    expect(a.charlie).to.equal \delta
    let b = f(false)
    expect(b.echo).to.equal \foxtrot
    expect(b.golf).to.equal \hotel

  it "unclosed object syntax in for statement", #
    let arr = [\alpha, \bravo, \charlie]
    let result = for x, i in arr
      index: i
      value: x
  
    expect(result.length).to.equal 3
    expect(result[0].index).to.equal 0
    expect(result[0].value).to.equal \alpha
    expect(result[1].index).to.equal 1
    expect(result[1].value).to.equal \bravo
    expect(result[2].index).to.equal 2
    expect(result[2].value).to.equal \charlie

  it "Can have a key of property, get, and set", #
    let obj = {
      property: 5
      get: 6
      set: 7
    }
  
    expect(obj.property).to.equal 5
    expect(obj.get).to.equal 6
    expect(obj.set).to.equal 7

  it "Property syntax with value", #
    if not is-function! Object.define-property
      return
  
    let make-key() -> Math.random().to-fixed(15)
    do random-key = make-key()
      let obj = {
        property x:
          value: 5
        property [random-key]:
          value: 6
      }
  
      expect(obj.x).to.equal 5
      expect(obj[random-key]).to.equal 6
    expect({ property x: { value: 5 } }.x).to.equal 5
  
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
      expect(for some k ofall { property [random-key]: { value: true, enumerable: true } }
        k == random-key).to.be.true
  
    let configurable-works = do random-key = make-key()
      let o = {}
      Object.define-property o, random-key, { value: true, configurable: false }
      expect(o ownskey random-key).to.be.true
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
        expect(o ownskey random-key).to.be.true
        expect(o[random-key]).to.be.true
  
    do random-key = make-key()
      let o = { property [random-key]: { value: true, configurable: true } }
      expect(o ownskey random-key).to.be.true
      delete o[random-key]
      expect(o not ownskey random-key).to.be.true
  
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
        expect(o[random-key]).to.be.true
  
    do random-key = make-key()
      let o = { property [random-key]: { value: true, writable: true } }
      expect(o[random-key]).to.equal true
      o[random-key] := false
      expect(o[random-key]).to.equal false

  let accessor-support = do
    if not is-function! Object.define-property
      return false
  
    let read(x) -> x
  
    let obj = {}
    let mutable gets = 0
    let mutable sets = 0
    try
      Object.define-property obj, "x", { get: #-> gets += 1, set: #-> sets += 1 }
    catch e
      return false
    expect(gets).to.equal 0
    expect(sets).to.equal 0
  
    if obj.x != 1 or gets != 1 or sets != 0
      return false
  
    obj.x := true
    gets == 1 and sets == 1
  
  it "Property syntax with get/set", #
    if not accessor-support
      return
  
    let mutable gets = 0
    let mutable sets = 0
    let obj = {}
    let mutable last-value = obj
    let o =
      get-x: #
        expect(this).to.equal o
        gets += 1
      set-x: #(value)!
        expect(this).to.equal o
        sets += 1
        last-value := value
      property x: {
        get: #-> @get-x()
        set: #(value) -> @set-x(value)
      }
  
    expect(last-value).to.equal obj
    expect(gets).to.equal 0
    expect(sets).to.equal 0
    expect(o.x).to.equal 1
    expect(gets).to.equal 1
    expect(sets).to.equal 0
    expect(last-value).to.equal obj
  
    o.x := "hello"
    expect(gets).to.equal 1
    expect(sets).to.equal 1
    expect(last-value).to.equal "hello"

  it "get syntax", #
    if not accessor-support
      return
  
    let mutable gets = 0
    let o =
      get-x: #
        expect(this).to.equal o
        gets += 1
      get x: #-> @get-x()
  
    expect(gets).to.equal 0
    expect(o.x).to.equal 1
    expect(gets).to.equal 1

  it "set syntax", #
    if not accessor-support
      return
  
    let mutable last-value = {}
    let mutable sets = 0
    let o =
      set-x: #(value)!
        expect(this).to.equal o
        last-value := value
        sets += 1
      set x: #(value) -> @set-x(value)
  
    expect(last-value).to.be.an \object
    expect(sets).to.equal 0
    o.x := "hello"
    expect(sets).to.equal 1
    expect(last-value).to.equal "hello"
  
  it "get/set syntax", #
    if not accessor-support
      return
  
    let mutable gets = 0
    let mutable sets = 0
    let obj = {}
    let mutable last-value = obj
    let o =
      get-x: #
        expect(this).to.equal o
        gets += 1
      set-x: #(value)!
        expect(this).to.equal o
        sets += 1
        last-value := value
      get x: #-> @get-x()
      set x: #(value) -> @set-x(value)
  
    expect(last-value).to.equal obj
    expect(gets).to.equal 0
    expect(sets).to.equal 0
    expect(o.x).to.equal 1
    expect(gets).to.equal 1
    expect(sets).to.equal 0
    expect(last-value).to.equal obj
  
    o.x := "hello"
    expect(gets).to.equal 1
    expect(sets).to.equal 1
    expect(last-value).to.equal "hello"

  it "get/set executes in the right order", #
    if not accessor-support or not is-function! Object.get-own-property-descriptor
      return
  
    let get-ided-func = do
      let mutable id = 0
      #(f)
        f.id := id += 1
        f
  
    let o =
      value: void
      get x: get-ided-func #
        expect(this).to.equal o
        @value
      set x: get-ided-func #(value)
        expect(this).to.equal o
        @value := value
  
    expect(Object.get-own-property-descriptor(o, \x).get.id).to.equal 1
    expect(Object.get-own-property-descriptor(o, \x).set.id).to.equal 2
    expect(o.x).to.equal void
    o.x := "hello"
    expect(o.x).to.equal "hello"
  
    let p =
      value: void
      set x: get-ided-func #(value)
        expect(this).to.equal p
        @value := value
      get x: get-ided-func #
        expect(this).to.equal p
        @value
  
    expect(Object.get-own-property-descriptor(p, \x).get.id).to.equal 4
    expect(Object.get-own-property-descriptor(p, \x).set.id).to.equal 3
    expect(p.x).to.equal void
    p.x := "hello"
    expect(p.x).to.equal "hello"

  it "get and set not next to each other", #
    expect(#-> gorilla.compile-sync """
    let x = {
      get alpha: 'bravo'
      bravo: 'charlie'
      set alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"
    expect(#-> gorilla.compile-sync """
    let x = {
      set alpha: 'bravo'
      bravo: 'charlie'
      get alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"

  it "Multiple gets of the same key", #
    expect(#-> gorilla.compile-sync """
    let x = {
      get alpha: 'bravo'
      get alpha: 'charlie'
      delta: 'echo'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*3:7"
    expect(#-> gorilla.compile-sync """
    let x = {
      get alpha: 'bravo'
      set bravo: 'charlie'
      get alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"
    expect(#-> gorilla.compile-sync """
    let x = {
      get alpha: 'bravo'
      set alpha: 'charlie'
      get alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"

  it "Multiple sets of the same key", #
    expect(#-> gorilla.compile-sync """
    let x = {
      set alpha: 'bravo'
      set alpha: 'charlie'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*3:7"
    expect(#-> gorilla.compile-sync """
    let x = {
      get alpha: 'bravo'
      set alpha: 'charlie'
      set alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"
    expect(#-> gorilla.compile-sync """
    let x = {
      set alpha: 'bravo'
      get alpha: 'charlie'
      set alpha: 'delta'
      echo: 'foxtrot'
    }
    """).throws gorilla.ParserError, r"Duplicate key 'alpha' in object.*4:7"

  it "Method declaration in object", #
    let x = {
      f() -> "g"
    }
  
    expect(x.f()).to.equal "g"

  it "Extending an object with get/set", #
    if not accessor-support
      return
  
    let obj = {value: "hello"}
    obj <<< {
      get x: #
        @value
      set x: #(value)!
        @value := value
    }
    expect(obj.x).to.equal "hello"
    obj.x := "there"
    expect(obj.x).to.equal "there"

  it "Extending an object with get", #
    if not accessor-support
      return
  
    let obj = {value: "hello"}
    obj <<< {
      get x: #
        @value
    }
    expect(obj.x).to.equal "hello"
    obj.value := "there"
    expect(obj.x).to.equal "there"

  it "Extending an object with set", #
    if not accessor-support
      return

    let obj = {value: "hello"}
    obj <<< {
      set x: #(value)!
        @value := value
    }
    expect(obj.value).to.equal "hello"
    obj.x := "there"
    expect(obj.value).to.equal "there"

  it "Extending an object with accessor property", #
    if not accessor-support
      return

    let obj = {value: "hello"}
    obj <<< {
      property x:
        get: #
          @value
        set: #(value)!
          @value := value
    }
    expect(obj.x).to.equal "hello"
    obj.x := "there"
    expect(obj.x).to.equal "there"

  it "Extending an object with getter property", #
    if not accessor-support
      return

    let obj = {value: "hello"}
    obj <<< {
      property x:
        get: #
          @value
    }
    expect(obj.x).to.equal "hello"
    obj.value := "there"
    expect(obj.x).to.equal "there"

  it "Extending an object with setter property", #
    if not accessor-support
      return

    let obj = {value: "hello"}
    obj <<< {
      property x:
        set: #(value)!
          @value := value
    }
    expect(obj.value).to.equal "hello"
    obj.x := "there"
    expect(obj.value).to.equal "there"

  it "Extending an object with value property", #
    let obj = {}
    obj <<< {
      property x:
        value: "hello"
        writable: true
    }
    expect(obj.x).to.equal "hello"
    obj.x := "there"
    expect(obj.x).to.equal "there"

  it "should be able to set a property on itself referencing itself", #
    let obj = {}
    obj.obj := obj
    expect(obj.obj).to.equal obj
