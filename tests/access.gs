test "dot access", #
  let x = { key: "value" }
  eq "value", x.key
  eq "value", { key: "value" }.key
  
  x.other := "blah"
  eq "blah", x.other
  
  let y = ["value"]
  eq "value", y.0
  eq "value", ["value"].0
  
  y.0 := "blah"
  eq "blah", y.0

test "access on dashed name", #
  let obj = {}
  obj.dashed-name := "hello"
  eq "hello", obj.dashed-name
  eq "hello", obj.dashedName

test "bracket access", #
  let x = { key: "value" }
  eq "value", x["key"]
  eq "value", { key: "value" }["key"]
  
  x["other"] := "blah"
  eq "blah", x["other"]
  
  let y = ["value"]
  eq "value", y[0]
  eq "value", ["value"][0]
  
  y[0] := "blah"
  eq "blah", y[0]

test "prototypal access", #
  let x = { prototype: { key: "value" } }
  eq "value", x::key
  eq "value", { prototype: { key: "value" } }::key
  
  x::other := "blah"
  eq "blah", x::other
  eq "blah", x.prototype.other
  
  let y = { prototype: ["value"] }
  eq "value", y::0
  eq "value", { prototype: ["value"] }::0
  
  y::0 := "blah"
  eq "blah", y::0
  eq "blah", y.prototype.0

test "prototypal bracket access", #
  let x = { prototype: { key: "value" } }
  eq "value", x::["key"]
  eq "value", { prototype: { key: "value" } }::["key"]
  
  x::other := "blah"
  eq "blah", x::["other"]
  eq "blah", x.prototype.other
  
  let y = { prototype: ["value"] }
  eq "value", y::[0]
  eq "value", { prototype: ["value"] }::[0]
  
  y::[0] := "blah"
  eq "blah", y::[0]
  eq "blah", y.prototype[0]

test "dot access on this", #
  let get() -> this.key
  let set(value) -> this.key := value
  
  let obj = {}
  eq undefined, get.call obj
  set.call obj, "value"
  eq "value", get.call obj

test "bracket access on this", #
  let get(key) -> this[key]
  let set(key, value) -> this[key] := value
  
  let obj = {}
  eq undefined, get.call obj, "key"
  set.call obj, "key", "value"
  eq "value", get.call obj, "key"

test "prototypal access on this", #
  let get() -> this::key
  let set(value) -> this::key := value
  
  let obj = { prototype: {} }
  eq undefined, get.call obj
  set.call obj, "value"
  eq "value", get.call obj

test "prototypal bracket access on this", #
  let get(key) -> this::[key]
  let set(key, value) -> this::[key] := value
  
  let obj = { prototype: {} }
  eq undefined, get.call obj, "key"
  set.call obj, "key", "value"
  eq "value", get.call obj, "key"

test "@ access", #
  let get() -> @key
  let set(value) -> @key := value
  
  let obj = {}
  eq undefined, get.call obj
  set.call obj, "value"
  eq "value", get.call obj

test "@ dot access", #
  let get() -> @.key
  let set(value) -> @.key := value
  
  let obj = {}
  eq undefined, get.call obj
  set.call obj, "value"
  eq "value", get.call obj

test "@ bracket access", #
  let get(key) -> @[key]
  let set(key, value) -> @[key] := value
  
  let obj = {}
  eq undefined, get.call obj, "key"
  set.call obj, "key", "value"
  eq "value", get.call obj, "key"

test "prototypal access on @", #
  let get() -> @::key
  let set(value) -> @::key := value
  
  let obj = { prototype: {} }
  eq undefined, get.call obj
  set.call obj, "value"
  eq "value", get.call obj

test "prototypal bracket access on @", #
  let get(key) -> @::[key]
  let set(key, value) -> @::[key] := value
  
  let obj = { prototype: {} }
  eq undefined, get.call obj, "key"
  set.call obj, "key", "value"
  eq "value", get.call obj, "key"

test "chained access", #
  let str = 'abc'
  let result = str
    .split('')
    .reverse()
    .reverse()
    .reverse()
  array-eq ['c','b','a'], result
  array-eq ['c','b','a'], str
    .split('')
    .reverse()
    .reverse()
    .reverse()

/*
test "access on undefined", -> do
  throws -> Cotton.compile("""let x = 0
  undefined.thing"""), (e) -> e.line == 2
end

test "access on null", -> do
  throws -> Cotton.compile("""let x = 0
  null.thing"""), (e) -> e.line == 2
end
*/

test "access with ownership", #
  let x = { key: "value" }
  eq "value", x!.key
  let y = { extends x }
  eq "value", y.key
  eq void, y!.key

test "access with ownership, with access after-the-fact", #
  let x = { key: "value" }
  eq "value", x!.key
  let y = { extends x }
  eq "value", y.key
  eq void, y!.key.wont.be.checked

test "access with ownership, existential", #
  let x = { key: "value" }
  eq "value", x?!.key
  let y = { extends x }
  eq "value", y.key
  eq void, y?!.key
  let z = null
  eq void, z?!.key

test "access with * representing length", #
  let array = [\a, \b, \c]
  eq \c, array[* - 1]
  eq \b, array[*-2]
  let get-array = run-once array
  eq \a, get-array()[* - 3]

test "access with * followed by another access with *", #
  let array = [\a, \b, [\c, \d]]
  eq \d, array[* - 1][* - 1]
  let get-array = run-once array
  eq \d, get-array()[* - 1][* - 1]

test "* inside another index in an index", #
  let alpha = [\a, \b, \c]
  let bravo = [1, 2]
  eq \c, alpha[bravo[* - 1]]
  let get-alpha = run-once alpha
  let get-bravo = run-once bravo
  eq \c, get-alpha()[get-bravo()[* - 1]]

test "* inside another index in an index with *", #
  let alpha = [\a, \b, \c]
  let bravo = [1, 2]
  eq \b, alpha[* - bravo[* - 1]]
  let get-alpha = run-once alpha
  let get-bravo = run-once bravo
  eq \b, get-alpha()[* - get-bravo()[* - 1]]

test "Assigning to an access with *", #
  let array = []
  array[*] := \a
  array[*] := \b
  array[* - 1] := \c
  array[*] := \d
  array-eq [\a, \c, \d], array
