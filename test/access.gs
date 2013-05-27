let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "dot access", #
  it "can access on idents", #
    let x = { key: "value" }
    expect(x.key).to.equal "value"
  
  it "can access on literal objects", #
    expect({ key: "value" }.key).to.equal "value"
  
  it "can assign to an object", #
    let x = {}
    x.other := "blah"
    expect(x.other).to.equal "blah"
  
  it "can be used on arrays", #
    let y = ["value"]
    expect(y.0).to.equal "value"
  
  it "can be used on literal arrays", #
    expect(["value"].0).to.equal "value"
  
  it "can be used to assign on arrays", #
    let y = []
    y.0 := "blah"
    expect(y.0).to.equal "blah"
  
  it "can be used with a dashed-name", #
    let obj = {}
    obj.dashed-name := "hello"
    expect(obj.dashed-name).to.equal "hello"
    expect(obj.dashedName).to.equal "hello"
  
describe "bracket access", #
  it "can access on idents", #
    let x = { key: "value" }
    expect(x["key"]).to.equal "value"
  
  it "can access on literal objects", #
    expect({ key: "value" }["key"]).to.equal "value"
  
  it "can assign to an object", #
    let x = {}
    x["other"] := "blah"
    expect(x["other"]).to.equal "blah"
  
  it "can be used on arrays", #
    let y = ["value"]
    expect(y[0]).to.equal "value"
  
  it "can be used on literal arrays", #
    expect(["value"][0]).to.equal "value"
  
  it "can assign to arrays", #
    let y = []
    y[0] := "value"
    expect(y[0]).to.equal "value"

describe "prototypal access", #
  it "can access on idents", #
    let x = { prototype: { key: "value" } }
    expect(x::key).to.equal "value"
  
  it "can access on literal objects", #
    expect({ prototype: { key: "value" } }::key).to.equal "value"
  
  it "can assign to an object", #
    let x = { prototype: {} }
    x::other := "value"
    expect(x::other).to.equal "value"
    expect(x.prototype.other).to.equal "value"
  
  it "can access a prototype which is an array", #
    let y = { prototype: ["value"] }
    expect(y::0).to.equal "value"
  
  it "can access a literal object with prototype which is an array", #
    expect({ prototype: ["value"] }::0).to.equal "value"
  
  it "can assign a to a prototype which is an array", #
    let y = { prototype: [] }
    y::0 := "value"
    expect(y::0).to.equal "value"
    expect(y.prototype.0).to.equal "value"

describe "prototypal bracket access", #
  it "can access on idents", #
    let x = { prototype: { key: "value" } }
    expect(x::["key"]).to.equal "value"
  
  it "can access on literal objects", #
    expect({ prototype: { key: "value" } }::["key"]).to.equal "value"
  
  it "can assign to an object", #
    let x = { prototype: {} }
    x::["other"] := "value"
    expect(x::["other"]).to.equal "value"
    expect(x.prototype.other).to.equal "value"
  
  it "can access a prototype which is an array", #
    let y = { prototype: ["value"] }
    expect(y::[0]).to.equal "value"
  
  it "can access a literal object with prototype which is an array", #
    expect({ prototype: ["value"] }::[0]).to.equal "value"
  
  it "can assign a to a prototype which is an array", #
    let y = { prototype: [] }
    y::[0] := "value"
    expect(y::[0]).to.equal "value"
    expect(y.prototype.0).to.equal "value"

describe "access on this", #
  it "works with dot access", #
    let get() -> this.key
    let set(value) -> this.key := value

    let obj = {}
    expect(get.call obj).to.be.undefined
    set.call obj, "value"
    expect(get.call obj).to.equal "value"
  
  it "works with bracket access", #
    let get(key) -> this[key]
    let set(key, value) -> this[key] := value

    let obj = {}
    expect(get.call obj, "key").to.be.undefined
    set.call obj, "key", "value"
    expect(get.call obj, "key").to.equal "value"

  it "works with prototypal access", #
    let get() -> this::key
    let set(value) -> this::key := value

    let obj = { prototype: {} }
    expect(get.call obj).to.be.undefined
    set.call obj, "value"
    expect(get.call obj).to.equal "value"
  
  it "works with prototypal bracket access", #
    let get(key) -> this::[key]
    let set(key, value) -> this::[key] := value

    let obj = { prototype: {} }
    expect(get.call obj, "key").to.be.undefined
    set.call obj, "key", "value"
    expect(get.call obj, "key").to.equal "value"

describe "@ access", #
  it "works without a dot", #
    let get() -> @key
    let set(value) -> @key := value

    let obj = {}
    expect(get.call obj).to.be.undefined
    set.call obj, "value"
    expect(get.call obj).to.equal "value"

  it "works with a dot", #
    let get() -> @.key
    let set(value) -> @.key := value

    let obj = {}
    expect(get.call obj).to.be.undefined
    set.call obj, "value"
    expect(get.call obj).to.equal "value"

  it "works with bracket access", #
    let get(key) -> @[key]
    let set(key, value) -> @[key] := value

    let obj = {}
    expect(get.call obj, "key").to.be.undefined
    set.call obj, "key", "value"
    expect(get.call obj, "key").to.equal "value"

  it "works with prototypal access", #
    let get() -> @::key
    let set(value) -> @::key := value

    let obj = { prototype: {} }
    expect(get.call obj).to.be.undefined
    set.call obj, "value"
    expect(get.call obj).to.equal "value"

  it "works with prototypal bracket access", #
    let get(key) -> @::[key]
    let set(key, value) -> @::[key] := value

    let obj = { prototype: {} }
    expect(get.call obj, "key").to.be.undefined
    set.call obj, "key", "value"
    expect(get.call obj, "key").to.equal "value"

describe "chained access", #
  it "works all one one line", #
    let str = 'abc'
    let result = str.split('').reverse().reverse().reverse()
    expect(result).to.eql ['c','b','a']
    expect(str.split('').reverse().reverse().reverse()).to.eql ['c','b','a']
  
  it "allows splitting across lines", #
    let str = 'abc'
    let result = str
      .split('')
      .reverse()
      .reverse()
      .reverse()
    expect(result).to.eql ['c','b','a']
    expect(str
      .split('')
      .reverse()
      .reverse()
      .reverse()).to.eql ['c','b','a']

describe "access with ownership", #
  it "works as expected", #
    let x = { key: "value" }
    expect(x!.key).to.equal "value"
    let y = { extends x }
    expect(y.key).to.equal "value"
    expect(y!.key).to.be.undefined
  
  it "doesn't fail with access after-the-fact", #
    let x = { key: "value" }
    let y = { extends x }
    expect(y.key).to.equal "value"
    expect(y!.key.wont.be.checked).to.be.undefined
  
  it "works with existential check", #
    let x = { key: "value" }
    expect(x?!.key).to.equal "value"
    let y = { extends x }
    expect(y.key).to.equal "value"
    expect(y?!.key).to.be.undefined
    let z = null
    expect(z?!.key).to.be.undefined

describe "* represents length in bracket access", #
  it "works with subtraction", #
    let array = [\a, \b, \c]
    expect(array[* - 1]).to.equal \c
    expect(array[*-2]).to.equal \b
    let get-array = stub().returns array
    expect(get-array()[* - 3]).to.equal \a
    expect(get-array).to.be.called-once
  
  it "works multiple times in a row", #
    let array = [\a, \b, [\c, \d]]
    expect(array[* - 1][* - 1]).to.equal \d
    let get-array = stub().returns array
    expect(get-array()[* - 1][* - 1]).to.equal \d
    expect(get-array).to.be.called-once
  
  it "works within another index", #
    let alpha = [\a, \b, \c]
    let bravo = [1, 2]
    expect(alpha[bravo[* - 1]]).to.equal \c
    let get-alpha = stub().returns alpha
    let get-bravo = stub().returns bravo
    expect(get-alpha()[get-bravo()[* - 1]]).to.equal \c
    expect(get-alpha).to.be.called-once
    expect(get-bravo).to.be.called-once
  
  it "works within another index that also has *", #
    let alpha = [\a, \b, \c]
    let bravo = [1, 2]
    expect(alpha[* - bravo[* - 1]]).to.equal \b
    let get-alpha = stub().returns alpha
    let get-bravo = stub().returns bravo
    expect(get-alpha()[* - get-bravo()[* - 1]]).to.equal \b
    expect(get-alpha).to.be.called-once
    expect(get-bravo).to.be.called-once
  
  it "can be used for assignment", #
    let array = []
    array[*] := \a
    array[*] := \b
    array[* - 1] := \c
    array[*] := \d
    expect(array).to.eql [\a, \c, \d]

describe "Binding access", #
  it "works", #
    let make-x() -> { key: #-> this }
    let alpha = {}
    let bravo = {}
    let x = make-x@ alpha
    expect(x.key@ bravo).to.equal bravo
    expect(x.key()).to.equal x
    let f = x@.key
    expect(f()).to.equal x
    expect(f@ bravo).to.equal x
  
  it "works with arguments", #
    let make-x()
      { key: #-> [this, ...arguments] }
    let alpha = {}
    let bravo = {}
    let x = make-x@ alpha
    expect(x.key@ bravo).to.eql [bravo]
    expect(x.key@ bravo, alpha).to.eql [bravo, alpha]
    expect(x.key()).to.eql [x]
    expect(x.key alpha).to.eql [x, alpha]
    let f = x@.key
    expect(f()).to.eql [x]
    expect(f alpha).to.eql [x, alpha]
    expect(f@ bravo).to.eql [x]
    expect(f@ bravo, alpha).to.eql [x, alpha]

describe "Access as a statement", #
  it "should not be optimized away, in case of getters", #
    try
      let mutable called = false
      let o = {
        get x: #-> called := true
      }
      if o.x != true
        return
    catch e
      void
  
    let ran = stub().returns "hello"
    let obj = {
      get value: #-> ran()
    }
    obj.value
    expect(ran).to.be.called-once
