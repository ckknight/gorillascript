test "Simple operators", #
  eq 3, 1 + 2
  eq 5, 10 - 5
  eq -5, 5 - 10
  eq 6, 2 * 3
  eq 4.5, 9 / 2
  eq 1, 9 % 2

test "Simple operator assignment", #
  let mutable x = 1
  x += 2
  eq 3, x
  x -= 5
  eq -2, x
  x *= 2
  eq -4, x
  x /= -0.5
  eq 8, x
  x %= 3
  eq 2, x

test "Addition",#
  eq 5, 2 + 3
  eq 10, 2 + 3 + 5
  eq 10, 2 + (3 + 5)
  eq 10, (2 + 3) + 5
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" + '3'"""), (e) -> e.line == 2
  */
  let add(a, b) -> a() + b()
  eq 3, add(runOnce(1), runOnce(2))
  throws #-> add(runOnce("1"), runOnce("2")), TypeError
  throws #-> add(runOnce(1), runOnce("2")), TypeError
  throws #-> add(runOnce("1"), runOnce(2)), TypeError
  let addAssign(mutable a, b) -> a += b()
  eq 3, addAssign(1, runOnce(2))
  throws #-> addAssign("1", runOnce("2")), TypeError
  throws #-> addAssign(1, runOnce("2")), TypeError
  throws #-> addAssign("1", runOnce(2)), TypeError
  let addMemberAssign(a, b, c) -> a[b()] += c()
  eq 3, addMemberAssign({key: 1}, runOnce("key"), runOnce 2)
  throws #-> addMemberAssign({key: "1"}, runOnce("key"), runOnce "2"), TypeError
  throws #-> addMemberAssign({key: 1}, runOnce("key"), runOnce "2"), TypeError
  throws #-> addMemberAssign({key: "1"}, runOnce("key"), runOnce 2), TypeError

test "Subtraction", #
  let two = 2
  let three = 3
  let five = 5
  eq 2, five - three
  eq -2, three - five
  eq 0, five - three - two
  eq 0, (five - three) - two
  eq 4, five - (three - two)
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" - '3'"""), (e) -> e.line == 2
  */
  let sub(a, b) -> a() - b()
  eq 1, sub(runOnce(3), runOnce 2)
  throws #-> sub(runOnce("3"), runOnce "2"), TypeError
  throws #-> sub(runOnce(3), runOnce "2"), TypeError
  throws #-> sub(runOnce("3"), runOnce 2), TypeError
  let subAssign(mutable a, b) -> a -= b()
  eq 1, subAssign(3, runOnce 2)
  throws #-> subAssign("3", runOnce "2"), TypeError
  throws #-> subAssign(3, runOnce "2"), TypeError
  throws #-> subAssign("3", runOnce 2), TypeError
  let subMemberAssign(a, b, c) -> a[b()] -= c()
  eq 1, subMemberAssign({key: 3}, runOnce("key"), runOnce 2)
  throws #-> subMemberAssign({key: "3"}, runOnce("key"), runOnce "2"), TypeError
  throws #-> subMemberAssign({key: 3}, runOnce("key"), runOnce "2"), TypeError
  throws #-> subMemberAssign({key: "3"}, runOnce("key"), runOnce 2), TypeError

test "Addition and Subtraction", #
  let two = 2
  let three = 3
  let five = 5
  eq 0, two + three - five
  eq 0, (two + three) - five
  eq 0, two + (three - five)
  eq 4, two - three + five
  eq 4, (two - three) + five
  eq -6, two - (three + five)

test "Subtraction versus negation", #
  let a = 1
  let b = 2
  eq -1, a - b
  eq -1, a- b
  let c(x) -> x*2
  let d = 3
  // translate to c(-d)
  eq -6, c -d

test "Addition versus unary plus", #
  let a = 1
  let b = 2
  eq 3, a + b
  eq 3, a+b
  eq 3, a+ b
  let c(x) -> x*2
  let d = 3
  // translate to c(+d)
  eq 6, c +d

test "Multiplication", #
  eq 6, 2 * 3
  eq 30, 2 * 3 * 5
  eq 30, (2 * 3) * 5
  eq 30, 2 * (3 * 5)
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" * '3'"""), (e) -> e.line == 2
  */
  let mult(a, b) -> a() * b()
  eq 6, mult(runOnce(3), runOnce(2))
  throws #-> mult(runOnce("3"), runOnce("2")), TypeError
  throws #-> mult(runOnce(3), runOnce("2")), TypeError
  throws #-> mult(runOnce("3"), runOnce(2)), TypeError
  let multAssign(mutable a, b) -> a *= b()
  eq 6, multAssign(3, runOnce 2)
  throws #-> multAssign("3", runOnce "2"), TypeError
  throws #-> multAssign(3, runOnce "2"), TypeError
  throws #-> multAssign("3", runOnce 2), TypeError
  let multMemberAssign(a, b, c) -> a[b()] *= c()
  eq 6, multMemberAssign({key: 2}, runOnce("key"), runOnce 3)
  throws #-> multMemberAssign({key: "2"}, runOnce("key"), runOnce "3"), TypeError
  throws #-> multMemberAssign({key: 2}, runOnce("key"), runOnce "3"), TypeError
  throws #-> multMemberAssign({key: "2"}, runOnce("key"), runOnce 3), TypeError

test "Division", #
  let thirtySix = 36
  let six = 6
  let three = 3
  eq 6, thirtySix / six
  eq 2, thirtySix / six / three
  eq 2, (thirtySix / six) / three
  eq 18, thirtySix / (six / three)
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" / '3'"""), (e) -> e.line == 2
  */
  let div = #(a, b) -> a() / b()
  eq 2, div(runOnce(6), runOnce 3)
  throws #-> div(runOnce("6"), runOnce "3"), TypeError
  throws #-> div(runOnce(6), runOnce "3"), TypeError
  throws #-> div(runOnce("6"), runOnce 3), TypeError
  let divAssign = #(mutable a, b) -> a /= b()
  eq 2, divAssign(6, runOnce 3)
  throws #-> divAssign("6", runOnce "3"), TypeError
  throws #-> divAssign(6, runOnce "3"), TypeError
  throws #-> divAssign("6", runOnce 3), TypeError
  let divMemberAssign = #(a, b, c) -> a[b()] /= c()
  eq 2, divMemberAssign({key: 6}, runOnce("key"), runOnce 3)
  throws #-> divMemberAssign({key: "6"}, runOnce("key"), runOnce "3"), TypeError
  throws #-> divMemberAssign({key: 6}, runOnce("key"), runOnce "3"), TypeError
  throws #-> divMemberAssign({key: "6"}, runOnce("key"), runOnce 3), TypeError

test "Multiplication and Division", #
  let fifteen = 15
  let three = 3
  let five = 5
  eq 9, fifteen * three / five
  eq 9, (fifteen * three) / five
  eq 9, fifteen * (three / five)
  eq 25, fifteen / three * five
  eq 25, (fifteen / three) * five
  eq 1, fifteen / (three * five)

test "Modulus", #
  eq 2, 5 % 3
  // test for left-associativity
  eq 1, 2 * 5 % 3
  eq 1, (2 * 5) % 3
  eq 4, 2 * (5 % 3)
  // modulus is higher than addition
  eq 3, 5 % 3 + 1
  eq 3, 1 + 5 % 3
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" % '3'"""), (e) -> e.line == 2
  */
  let mod(a, b) -> a() % b()
  eq 2, mod(runOnce(8), runOnce(3))
  throws #-> mod(runOnce("8"), runOnce("3")), TypeError
  throws #-> mod(runOnce(8), runOnce("3")), TypeError
  throws #-> mod(runOnce("8"), runOnce(3)), TypeError
  let modAssign(mutable a, b) -> a %= b()
  eq 2, modAssign(8, runOnce 3)
  throws #-> modAssign("8", runOnce "3"), TypeError
  throws #-> modAssign(8, runOnce "3"), TypeError
  throws #-> modAssign("8", runOnce 3), TypeError
  let modMemberAssign(a, b, c) -> a[b()] %= c()
  eq 2, modMemberAssign({key: 8}, runOnce("key"), runOnce 3)
  throws #-> modMemberAssign({key: "8"}, runOnce("key"), runOnce "3"), TypeError
  throws #-> modMemberAssign({key: 8}, runOnce("key"), runOnce "3"), TypeError
  throws #-> modMemberAssign({key: "8"}, runOnce("key"), runOnce 3), TypeError

test "Exponentiation", #
  eq 1, 3 ^ 0
  eq 3, 3 ^ 1
  eq 9, 3 ^ 2
  eq 27, 3 ^ 3
  eq 3, 9 ^ 0.5
  eq 27, 9 ^ 1.5
  eq 81, 9 ^ 2
  eq 243, 9 ^ 2.5
  eq 2, 0.5 ^ -1
  eq 4, 0.5 ^ -2
  eq 8, 0.5 ^ -3
  eq 16, 0.5 ^ -4
  eq 8, 0.25 ^ -1.5
  eq 32, 0.25 ^ -2.5
  eq 128, 0.25 ^ -3.5
  eq 262144, 4 ^ 3 ^ 2
  eq 4096, (4 ^ 3) ^ 2
  eq 262144, 4 ^ (3 ^ 2)
  
  let x = 2
  eq 1024, x ^ 10
  eq 2^32, x ^ 32
  
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" ^ '3'"""), (e) -> e.line == 2
  */
  let pow(a, b) -> a() ^ b()
  eq 8, pow(runOnce(2), runOnce(3))
  throws #-> pow(runOnce("2"), runOnce("3")), TypeError
  throws #-> pow(runOnce(2), runOnce("3")), TypeError
  throws #-> pow(runOnce("2"), runOnce(3)), TypeError
  let powAssign(mutable a, b) -> a ^= b()
  eq 8, powAssign(2, runOnce 3)
  throws #-> powAssign("2", runOnce "3"), TypeError
  throws #-> powAssign(2, runOnce "3"), TypeError
  throws #-> powAssign("2", runOnce 3), TypeError
  let powMemberAssign(a, b, c) -> a[b()] ^= c()
  eq 8, powMemberAssign({key: 2}, runOnce("key"), runOnce 3)
  throws #-> powMemberAssign({key: "2"}, runOnce("key"), runOnce "3"), TypeError
  throws #-> powMemberAssign({key: 2}, runOnce("key"), runOnce "3"), TypeError
  throws #-> powMemberAssign({key: "2"}, runOnce("key"), runOnce 3), TypeError

test "Exponentation still calculates left side if right is 0", #
  let ten = runOnce(10)
  eq 1, ten() ^ 0
  ok ten.ran

test "Logical operators", #
  eq false, false and false
  eq false, true and false
  eq false, false and true
  eq true, true and true
  
  eq false, false or false
  eq true, true or false
  eq true, false or true
  eq true, true or true
  
  eq false, false xor false
  eq true, true xor false
  eq true, false xor true
  eq false, true xor true
  
  /*
  throws #-> Cotton.compile("""
  let x = 2
  ok(false and false or false)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(false or false and false)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(false and false xor false)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(false xor false and false)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(false or false xor false)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(false xor false or false)"""), (e) -> e.line == 2
  */

test "logical assignment", #
  let andAssign(mutable x, y)
    x and= y()
  let andMemberAssign(x, y, z)
    x[y()] and= z()
  let orAssign(mutable x, y)
    x or= y()
  let orMemberAssign(x, y, z)
    x[y()] or= z()
  let xorAssign(mutable x, y)
    x xor= y()
  let xorMemberAssign(x, y, z)
    x[y()] xor= z()
  
  eq 2, andAssign(1, runOnce 2)
  eq 0, andAssign(0, fail)
  eq 1, orAssign(1, fail)
  eq 2, orAssign(0, runOnce 2)
  eq false, xorAssign(1, runOnce 1), "a"
  eq true, xorAssign(1, runOnce 0), "b"
  eq 1, xorAssign(0, runOnce 1), "c"
  eq 0, xorAssign(0, runOnce 0), "d"
  
  eq undefined, andMemberAssign({}, runOnce("key"), fail)
  eq "bravo", andMemberAssign({key:"alpha"}, runOnce("key"), runOnce "bravo")
  eq "value", orMemberAssign({}, runOnce("key"), runOnce "value")
  eq "alpha", orMemberAssign({key:"alpha"}, runOnce("key"), fail)
  eq "value", xorMemberAssign({}, runOnce("key"), runOnce "value")
  eq 0, xorMemberAssign({}, runOnce("key"), runOnce 0)
  eq false, xorMemberAssign({key:"alpha"}, runOnce("key"), runOnce "value")
  eq 0, xorMemberAssign({key:"alpha"}, runOnce(0), runOnce 0)

test "not", #
  eq true, not false
  eq false, not true

test "instanceof", #
  ok new String("") instanceof String
  ok not (new String("") instanceof Function)
  ok new String("") not instanceof Function

test "instanceofsome", #
  ok new String("") instanceofsome [String]
  ok not (new String("") instanceofsome [Function])
  ok new String("") not instanceofsome [Function]
  
  ok new String("") not instanceofsome []
  ok new String("") instanceofsome [String, Function]
  ok new String("") instanceofsome [Function, String]
  ok new String("") not instanceofsome [Number, Function]
  
  let mutable str = runOnce new String("")
  ok str() not instanceofsome []
  ok str.ran
  str := runOnce new String("")
  ok str() instanceofsome [Function, String]

test "unary negate", #
  eq 0 - 5, -5
  eq 5, -(-5)
  eq 0 - 5, -(-(-5))
  eq 5, -(-(-(-5)))
  eq 0 - 5, -(-(-(-(-5))))
  eq 5, -(-(-(-(-(-5)))))

test "Spaceship", #
  eq 0, 0 <=> 0
  eq 0, "hello" <=> "hello"
  eq 1, 1 <=> 0
  eq -1, 0 <=> 1
  eq 1, 1e9 <=> -1e9
  eq -1, -1e9 <=> 1e9
  eq 1, Infinity <=> -Infinity
  eq -1, -Infinity <=> Infinity
  eq -1, "alpha" <=> "bravo"
  eq 1, "bravo" <=> "alpha"
  
  let cmp = (<=>)
  
  eq 0, cmp(0, 0)
  eq 0, cmp("hello", "hello")
  eq 1, cmp(1, 0)
  eq -1, cmp(0, 1)
  eq 1, cmp(1e9, -1e9)
  eq -1, cmp(-1e9, 1e9)
  eq 1, cmp(Infinity, -Infinity)
  eq -1, cmp(-Infinity, Infinity)
  eq -1, cmp("alpha", "bravo")
  eq 1, cmp("bravo", "alpha")

test "Comparison", #
  eq true, 1 < 2
  eq false, 1 < 1
  eq true, 1 <= 2
  eq true, 1 <= 1
  eq false, 1 <= 0
  
  eq true, 2 > 1
  eq false, 1 > 1
  eq true, 2 >= 1
  eq true, 1 >= 1
  eq false, 0 >= 1
  
  eq true, "bravo" < "charlie"
  eq false, "bravo" < "bravo"
  eq true, "bravo" <= "charlie"
  eq true, "bravo" <= "bravo"
  eq false, "bravo" <= "alpha"
  
  eq true, "charlie" > "bravo"
  eq false, "bravo" > "bravo"
  eq true, "charlie" >= "bravo"
  eq true, "bravo" >= "bravo"
  eq false, "alpha" >= "bravo"
  
  /*
  throws #-> Cotton.compile("""let x = 0
  1 < 'alpha'"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  1 < {}"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  1 < true"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  1 < null"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  1 < undefined"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "alpha" < {}"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "alpha" < true"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "alpha" < null"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "alpha" < undefined"""), (e) -> e.line == 2
  */

/*
test "Comparison chaining", #
  ok 1 < 2
  ok 1 < 2 < 3
  ok 1 < 2 < 3 < 4
  ok 1 < 2 < 3 < 4 < 5
  ok 5 > 4
  ok 5 > 4 > 3
  ok 5 > 4 > 3 > 2
  ok 5 > 4 > 3 > 2 > 1
  ok 1 <= 2
  ok 1 <= 2 <= 2
  ok 1 <= 2 <= 2 <= 3
  ok 1 <= 2 <= 2 <= 3 <= 3
  ok 3 >= 3
  ok 3 >= 3 >= 2
  ok 3 >= 3 >= 2 >= 2
  ok 3 >= 3 >= 2 >= 2 >= 1
  ok 1 < 2
  ok 1 < 2 <= 2
  ok 1 < 2 <= 2 < 3
  ok 1 < 2 <= 2 < 3 <= 3
  ok 3 >= 3
  ok 3 >= 3 > 2
  ok 3 >= 3 > 2 >= 2
  ok 3 >= 3 > 2 >= 2 > 1
  ok not (1 < 0)
  ok not (1 < 2 < 0)
  ok not (1 < 2 < 3 < 0)
  ok not (1 < 2 < 3 < 4 < 0)
  ok not (5 > 6)
  ok not (5 > 4 > 6)
  ok not (5 > 4 > 3 > 6)
  ok not (5 > 4 > 3 > 2 > 6)
  
  throws #-> Cotton.compile("""
  let x = 2
  ok(1 < 2 > 1)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(1 < 2 >= 1)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(1 <= 2 > 1)"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""
  let x = 2
  ok(1 <= 2 >= 1)"""), (e) -> e.line == 2

test "comparison chaining only access inside once", #
  let two = runOnce 2
  let three = runOnce 3
  let four = runOnce 4
  
  ok 1 < two() < three() < four() < 5

test "comparison chaining fails on first false", #
  let zero = 0
  ok not (1 < zero < fail() < fail() < fail())

test "comparison chaining calculates values in-order", #
  let f = do
    let mutable x = 0
    -> do
      x += 1
      x
    end
  end
  
  ok f() < f() < f() < f() < f() < f()
  eq 7, f()
*/

test "String concatenation", #
  eq "hello there", "hello" & " " & "there"
  eq "12", 1 & 2
  
  let mutable x = "1"
  x &= 2
  eq "12", x
  
  let concat(a, b) -> a() & b()
  eq "12", concat(runOnce(1), runOnce(2))
  eq "12", concat(runOnce("1"), runOnce("2"))
  eq "12", concat(runOnce(1), runOnce("2"))
  eq "12", concat(runOnce("1"), runOnce(2))
  throws #-> concat(runOnce("1"), runOnce({})), TypeError
  throws #-> concat(runOnce({}), runOnce("2")), TypeError
  throws #-> concat(runOnce({}), runOnce({})), TypeError
  throws #-> concat(runOnce("1"), runOnce(null)), TypeError
  throws #-> concat(runOnce(null), runOnce("2")), TypeError
  throws #-> concat(runOnce(null), runOnce(null)), TypeError
  throws #-> concat(runOnce("1"), runOnce(undefined)), TypeError
  throws #-> concat(runOnce(undefined), runOnce("2")), TypeError
  throws #-> concat(runOnce(undefined), runOnce(undefined)), TypeError
  let concatAssign(mutable a, b) -> a &= b()
  eq "12", concatAssign("1", runOnce("2"))
  eq "12", concatAssign("1", runOnce(2))
  //throws #-> concatAssign(1, runOnce("2")), TypeError
  //throws #-> concatAssign(1, runOnce(2)), TypeError
  throws #-> concatAssign("1", runOnce({})), TypeError
  throws #-> concatAssign({}, runOnce("2")), TypeError
  throws #-> concatAssign({}, runOnce({})), TypeError
  throws #-> concatAssign("1", runOnce(null)), TypeError
  throws #-> concatAssign(null, runOnce("2")), TypeError
  throws #-> concatAssign(null, runOnce(null)), TypeError
  throws #-> concatAssign("1", runOnce(undefined)), TypeError
  throws #-> concatAssign(undefined, runOnce("2")), TypeError
  throws #-> concatAssign(undefined, runOnce(undefined)), TypeError
  let concatMemberAssign(a, b, c) -> a[b()] &= c()
  eq "12", concatMemberAssign({key: "1"}, runOnce("key"), runOnce 2)
  eq "12", concatMemberAssign({key: "1"}, runOnce("key"), runOnce "2")
  //throws #-> concatMemberAssign({key: 1}, runOnce("key"), runOnce "2"), TypeError
  //throws #-> concatMemberAssign({key: 1}, runOnce("key"), runOnce 2), TypeError
  throws #-> concatMemberAssign({key: "1"}, runOnce("key"), runOnce {}), TypeError
  throws #-> concatMemberAssign({key: {}}, runOnce("key"), runOnce "2"), TypeError
  throws #-> concatMemberAssign({key: {}}, runOnce("key"), runOnce {}), TypeError
  throws #-> concatMemberAssign({key: "1"}, runOnce("key"), runOnce null), TypeError
  throws #-> concatMemberAssign({key: null}, runOnce("key"), runOnce "2"), TypeError
  throws #-> concatMemberAssign({key: null}, runOnce("key"), runOnce null), TypeError
  throws #-> concatMemberAssign({key: "1"}, runOnce("key"), runOnce undefined), TypeError
  throws #-> concatMemberAssign({key: undefined}, runOnce("key"), runOnce "2"), TypeError
  throws #-> concatMemberAssign({key: undefined}, runOnce("key"), runOnce undefined), TypeError
  
  let concatKnownNumbers()
    let a = 1
    let b = 2
    a & b
  eq "12", concatKnownNumbers()

test "new operator", #
  let special = {}
  let Class(...args)
    if this instanceof Class
      [special, args]
    else
      [this, args]
  
  let container = { Class: Class }
  
  let undefinedThisValue = (#-> this)()
  
  let array = ["alpha", "bravo", "charlie"]
  
  arrayEq [special, []], new Class
  arrayEq [special, []], new Class()
  arrayEq [special, ["alpha"]], new Class("alpha")
  arrayEq [undefinedThisValue, []], Class()
  arrayEq [undefinedThisValue, ["alpha"]], Class("alpha")
  arrayEq ["alpha", "bravo"], Class(...["alpha", "bravo"])[1]
  arrayEq ["alpha", "bravo", "charlie"], Class(...array)[1]
  arrayEq [special, ["alpha"]], Class.call(Object.create(Class.prototype), "alpha")
  arrayEq [special, []], new container.Class
  arrayEq [special, []], new container.Class()
  arrayEq [special, ["alpha"]], new container.Class("alpha")
  arrayEq [special, ["alpha", "bravo"]], new container.Class(...["alpha", "bravo"])
  arrayEq [special, ["alpha", "bravo", "charlie"]], new container.Class(...array)
  arrayEq [container, ["alpha"]], container.Class("alpha")
  arrayEq [special, ["alpha"]], container.Class.call(Object.create(container.Class.prototype), "alpha")

test "new operator spread", #
  let Class(...args)!
    ok this instanceof Class
    this.args := args
    return this
  
  let makeClassWithThis(...args)
    new Class(this, ...args)
  
  let makeClassWithArguments()
    new Class(arguments)
  
  arrayEq [], new Class().args
  arrayEq ["alpha"], new Class("alpha").args
  arrayEq ["alpha", "bravo"], new Class("alpha", "bravo").args
  let array = ["alpha", "bravo", "charlie"]
  arrayEq ["alpha", "bravo", "charlie"], new Class(...array).args
  let obj = {}
  arrayEq [obj], makeClassWithThis.call(obj).args
  arrayEq [obj, "alpha", "bravo", "charlie"], makeClassWithThis.apply(obj, array).args
  ok not Array.isArray(makeClassWithArguments().args[0])
  eq 0, makeClassWithArguments().args[0].length
  eq 3, makeClassWithArguments(...array).args[0].length
  arrayEq ["alpha", "bravo", "charlie"], [...(makeClassWithArguments(...array).args[0])]
  
  let arr = []
  for i = 0, 200
    arr.push i
    let obj = new Class(...arr)
    arrayEq arr, obj.args
    ok obj instanceof Class
    if typeof Object.getPrototypeOf == "function"
      eq Class.prototype, Object.getPrototypeOf(obj)
  
  let dateValues = [1987]
  ok new Date(...dateValues) instanceof Date
  dateValues.push 7
  ok new Date(...dateValues) instanceof Date
  dateValues.push 22
  ok new Date(...dateValues) instanceof Date

test "new operator precedence", #
  let Class(...args)!
    ok this instanceof Class
    this.args := args
    return this
  
  Class.method := #(...args)
    ["static", ...args]
  
  Class::method := #(...args)
    ["instance", ...args]
  
  arrayEq [], (new Class).args
  arrayEq [], new Class().args
  arrayEq ["alpha"], (new Class("alpha")).args
  arrayEq ["alpha"], new Class("alpha").args
  arrayEq ["alpha", "bravo"], (new Class("alpha", "bravo")).args
  arrayEq ["alpha", "bravo"], new Class("alpha", "bravo").args
  arrayEq ["static"], Class.method()
  arrayEq ["static", "alpha"], Class.method("alpha")
  arrayEq ["static", "alpha", "bravo"], Class.method("alpha", "bravo")
  arrayEq ["instance"], (new Class).method()
  arrayEq ["instance"], new Class().method()
  arrayEq ["instance", "alpha"], new Class().method("alpha")
  arrayEq ["instance", "alpha"], (new Class).method("alpha")
  arrayEq ["instance", "alpha", "bravo"], new Class().method("alpha", "bravo")
  arrayEq ["instance", "alpha", "bravo"], (new Class).method("alpha", "bravo")
  arrayEq ["static"], new Class.method()
  arrayEq ["static", "alpha"], new Class.method("alpha")
  arrayEq ["static", "alpha", "bravo"], new Class.method("alpha", "bravo")

test "delete removes key", #
  let obj = { alpha: "bravo", charlie: "delta" }
  
  ok obj ownskey "alpha"
  delete obj.alpha
  ok obj not ownskey "alpha"

test "delete plucks values", #
  let obj = { alpha: "bravo", charlie: "delta" }
  
  ok obj ownskey "alpha"
  eq "bravo", delete obj.alpha
  ok obj not ownskey "alpha"

test "delete returns undefined if no value found", #
  let obj = {}
  eq undefined, delete obj.alpha

test "delete doesn't pluck if unnecessary", #
  if typeof Object.defineProperty == "undefined"
    return
  
  let obj = {}
  Object.defineProperty(obj, "alpha", {
    get: #-> fail()
    configurable: true
  })
  delete obj.alpha
  eq undefined, obj.alpha

test "delete pluck only calculates object once", #
  let obj = runOnce { alpha: "bravo" }
  eq "bravo", delete obj().alpha

test "delete pluck only calculates key once", #
  let obj = { alpha: "bravo" }
  let key = runOnce "alpha"
  eq "bravo", delete obj[key()]

test "delete pluck only calculates value once", #
  if typeof Object.defineProperty != "function"
    return
  
  let obj = {}
  Object.defineProperty(obj, "alpha", {
    get: runOnce "bravo"
    configurable: true
  })
  eq "bravo", delete obj.alpha

/*
test "let with assignment at the same time", #
  let mutable a = undefined
  let b = a := "alpha"
  eq a, "alpha"
  eq b, "alpha"
  
  let mutable x = undefined
  let mutable y = undefined
  let mutable z = undefined
  
  let w = x := y := z := "bravo"
  eq w, "bravo"
  eq x, "bravo"
  eq y, "bravo"
  eq z, "bravo"

test "let with ?= assignment", #
  let mutable x = undefined
  let y = x ?= {}
  let z = x ?= {}
  eq x, y
  eq x, z

test "let with or= assignment", #
  let mutable x = undefined
  let y = x or= {}
  let z = x or= {}
  eq x, y
  eq x, z

test "multiple assignment", #
  let mutable x = undefined
  let mutable y = undefined
  let mutable z = undefined
  
  x := y := z := "alpha"
  arrayEq [x, y, z], ["alpha", "alpha", "alpha"]

test "multiple ?= assignment", #
  let mutable x = undefined
  let mutable y = undefined
  let mutable z = undefined
  
  y := x ?= {}
  z := x ?= {}
  eq x, y
  eq x, z

test "multiple or= assignment", #
  let mutable x = undefined
  let mutable y = undefined
  let mutable z = undefined
  
  y := x ?= {}
  z := x ?= {}
  eq x, y
  eq x, z
  
*/
/*
test "assignment to reserved words", #
  for name in require('../lib/ast').RESERVED
    void
    throws (-> Cotton.compile("""
    let x = 2
    let mutable #{name} = 0""")), (e) -> e.line == 2, name
    throws (-> Cotton.compile("""
    let x = 2
    let #{name} = 0""")), (e) -> e.line == 2, name
    throws (-> Cotton.compile("""
    let x = 2
    #{name} := 0""")), (e) -> e.line == 2, name
*/

test "equality", #
  ok "a" == "a"
  ok "" == ""
  ok "" != " "
  let eq(a, b) -> a == b
  /*
  throws #-> Cotton.compile("""let x = 0
  "" == 0"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "" != 0"""), (e) -> e.line == 2
  */
  ok not eq("", 0)
  /*
  throws #-> Cotton.compile("""let x = 0
  "0" == 0"""), (e) -> e.line == 2
  throws #-> Cotton.compile("""let x = 0
  "0" != 0"""), (e) -> e.line == 2
  */
  ok not eq("0", 0)
  /*
  throws #-> Cotton.compile("""let x = 0
  null != undefined"""), (e) -> e.line == 2
  */
  ok not eq(null, undefined)

/*
test "newline suppression", #
  let six =
    1 +
    2
    + 3
  
  eq 6, six
*/
test "bitnot", #
  eq -1, bitnot 0
  eq -2, bitnot 1
  eq -6, bitnot 5.5

test "bitand", #
  eq 0b1010, 0b1110 bitand 0b1011

test "bitor", #
  eq 0b1111, 0b1011 bitor 0b0101

test "bitxor", #
  eq 0b1001, 0b1100 bitxor 0b0101

test "bitlshift", #
  eq 0b101010000, 0b10101 bitlshift 4

test "bitrshift", #
  eq 0b10101, 0b101010000 bitrshift 4

test "biturshift", #
  eq 0b10101, 0b101010000 biturshift 4
  eq 2^32 - 1, -1 biturshift 0

test "divisibility", #
  ok 10 %% 1
  ok 10 %% 2
  ok not (10 %% 3)
  ok not (10 %% 4)
  ok 10 %% 5
  ok not (10 %% 6)
  ok not (10 %% 7)
  ok not (10 %% 8)
  ok not (10 %% 9)
  ok 10 %% 10
  
  ok not (10 !%% 1)
  ok not (10 !%% 2)
  ok 10 !%% 3
  ok 10 !%% 4
  ok not (10 !%% 5)
  ok 10 !%% 6
  ok 10 !%% 7
  ok 10 !%% 8
  ok 10 !%% 9
  ok not (10 !%% 10)

test "floor division", #
  eq 4, 9 \ 2
  eq 5, 10 \ 2
  eq 4, 9.999 \ 2
  
  let mutable x = 10
  x \= 3
  eq 3, x
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" \ '3'"""), (e) -> e.line == 2
  */
  let div(a, b) -> a() \ b()
  eq 4, div(runOnce(9), runOnce 2)
  throws #-> div(runOnce("9"), runOnce "2"), TypeError
  throws #-> div(runOnce(9), runOnce "2"), TypeError
  throws #-> div(runOnce("9"), runOnce 2), TypeError
  let divAssign(mutable a, b) -> a \= b()
  eq 4, divAssign(9, runOnce 2)
  throws #-> divAssign("9", runOnce "2"), TypeError
  throws #-> divAssign(9, runOnce "2"), TypeError
  throws #-> divAssign("9", runOnce 2), TypeError
  let divMemberAssign(a, b, c) -> a[b()] \= c()
  eq 4, divMemberAssign({key: 9}, runOnce("key"), runOnce 2)
  throws #-> divMemberAssign({key: "9"}, runOnce("key"), runOnce "2"), TypeError
  throws #-> divMemberAssign({key: 9}, runOnce("key"), runOnce "2"), TypeError
  throws #-> divMemberAssign({key: "9"}, runOnce("key"), runOnce 2), TypeError

test "min/max operators", #
  eq 1, 1 min 2 min 3 min 4
  eq 4, 1 max 2 max 3 max 4
  eq "alpha", "alpha" min "bravo" min "charlie" min "delta"
  eq "delta", "alpha" max "bravo" max "charlie" max "delta"

/*
test "min/max assignment", #
  let minAssign(mutable x, y)
    x min= y()
  let minMemberAssign(x, y, z)
    x[y()] min= z()
  let maxAssign(mutable x, y)
    x max= y()
  let maxMemberAssign(x, y, z)
    x[y()] max= z()
  
  eq 1, minAssign(1, runOnce 2)
  eq 1, minAssign(2, runOnce 1)
  eq 2, maxAssign(1, runOnce 2)
  eq 2, maxAssign(2, runOnce 1)
  eq "alpha", minAssign("alpha", runOnce "bravo")
  eq "alpha", minAssign("bravo", runOnce "alpha")
  eq "bravo", maxAssign("alpha", runOnce "bravo")
  eq "bravo", maxAssign("bravo", runOnce "alpha")
  
  eq 1, minMemberAssign({key: 1}, runOnce("key"), runOnce 2)
  eq 1, minMemberAssign({key: 2}, runOnce("key"), runOnce 1)
  eq 2, maxMemberAssign({key: 1}, runOnce("key"), runOnce 2)
  eq 2, maxMemberAssign({key: 2}, runOnce("key"), runOnce 1)
  eq "alpha", minMemberAssign({key: "alpha"}, runOnce("key"), runOnce "bravo")
  eq "alpha", minMemberAssign({key: "bravo"}, runOnce("key"), runOnce "alpha")
  eq "bravo", maxMemberAssign({key: "alpha"}, runOnce("key"), runOnce "bravo")
  eq "bravo", maxMemberAssign({key: "bravo"}, runOnce("key"), runOnce "alpha")
*/
/*
test "logarithm", #
  let round(value)
    Math.round(value * 10^8) / 10^8
  eq 0, log 1
  for i = 1, 10
    eq i, round log Math.E ^ i
    eq i, round log 10 ^ i, 10
    eq i, round log 2 ^ i, 2
  end
  
  let log1 = (x) -> log x()
  eq Math.log(10), log1 runOnce(10)
  throws #-> log1(runOnce("10")), TypeError
  let log2 = (x, y) -> log x(), y()
  eq Math.log(10) / Math.log(2), log2 runOnce(10), runOnce(2)
  throws #-> log2(runOnce("10"), runOnce("2")), TypeError
  throws #-> log2(runOnce("10"), runOnce(2)), TypeError
  throws #-> log2(runOnce(10), runOnce("2")), TypeError
*/
test "negation on separate line does not look like subtraction", #
  let f()
    let x = 5
    -1
  
  eq -1, f()
