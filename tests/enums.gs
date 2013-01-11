test "empty Enum", #
  let Enum = enum
  
  for k of Enum
    fail()

test "empty named Enum", #
  enum Enum
  
  for k of Enum
    fail()

test "enum with a few values", #
  let Enum = enum
    def alpha
    def bravo
    def charlie
  
  for name, i in ["alpha", "bravo", "charlie"]
    eq i + 1, Enum[name]

test "enum with a few defined values", #
  let Enum = enum
    def alpha = 0
    def bravo = 1
    def charlie = 2
  
  for name, i in ["alpha", "bravo", "charlie"]
    eq i, Enum[name]

test "enum can have static members", #
  let Enum = enum
    def alpha
    def bravo
    def charlie
    
    this.delta := "delta"
  
  for name, i in ["alpha", "bravo", "charlie"]
    eq i + 1, Enum[name]
  
  eq "delta", Enum.delta

test "named enum", #
  enum Enum
    def alpha
    def bravo
    def charlie
  
  for name, i in ["alpha", "bravo", "charlie"]
    eq i + 1, Enum[name]

/*
test "enums are frozen", #
  if typeof Object.freeze != "function" or typeof Object.isFrozen != "function"
    return
  if not Object.isFrozen(Object.freeze({}))
    return
  
  ok Object.isFrozen(enum)
  ok Object.isFrozen(enum Enum)
*/