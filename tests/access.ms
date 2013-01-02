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
  arrayEq ['c','b','a'], result
  arrayEq ['c','b','a'], str
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
