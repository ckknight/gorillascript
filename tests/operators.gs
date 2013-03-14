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
  x += 1
  eq 3, x
  x -= 1
  eq 2, x
  eq 2, post-inc! x
  eq 3, x
  eq 3, post-dec! x
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
  eq 3, add(run-once(1), run-once(2))
  throws #-> add(run-once("1"), run-once("2")), TypeError
  throws #-> add(run-once(1), run-once("2")), TypeError
  throws #-> add(run-once("1"), run-once(2)), TypeError
  let add-assign(mutable a, b) -> a += b()
  eq 3, add-assign(1, run-once(2))
  throws #-> add-assign("1", run-once("2")), TypeError
  throws #-> add-assign(1, run-once("2")), TypeError
  throws #-> add-assign("1", run-once(2)), TypeError
  let add-member-assign(a, b, c) -> a[b()] += c()
  eq 3, add-member-assign({key: 1}, run-once("key"), run-once 2)
  throws #-> add-member-assign({key: "1"}, run-once("key"), run-once "2"), TypeError
  throws #-> add-member-assign({key: 1}, run-once("key"), run-once "2"), TypeError
  throws #-> add-member-assign({key: "1"}, run-once("key"), run-once 2), TypeError

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
  eq 1, sub(run-once(3), run-once 2)
  throws #-> sub(run-once("3"), run-once "2"), TypeError
  throws #-> sub(run-once(3), run-once "2"), TypeError
  throws #-> sub(run-once("3"), run-once 2), TypeError
  let sub-assign(mutable a, b) -> a -= b()
  eq 1, sub-assign(3, run-once 2)
  throws #-> sub-assign("3", run-once "2"), TypeError
  throws #-> sub-assign(3, run-once "2"), TypeError
  throws #-> sub-assign("3", run-once 2), TypeError
  let sub-member-assign(a, b, c) -> a[b()] -= c()
  eq 1, sub-member-assign({key: 3}, run-once("key"), run-once 2)
  throws #-> sub-member-assign({key: "3"}, run-once("key"), run-once "2"), TypeError
  throws #-> sub-member-assign({key: 3}, run-once("key"), run-once "2"), TypeError
  throws #-> sub-member-assign({key: "3"}, run-once("key"), run-once 2), TypeError

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
  eq 6, mult(run-once(3), run-once(2))
  throws #-> mult(run-once("3"), run-once("2")), TypeError
  throws #-> mult(run-once(3), run-once("2")), TypeError
  throws #-> mult(run-once("3"), run-once(2)), TypeError
  let mult-assign(mutable a, b) -> a *= b()
  eq 6, mult-assign(3, run-once 2)
  throws #-> mult-assign("3", run-once "2"), TypeError
  throws #-> mult-assign(3, run-once "2"), TypeError
  throws #-> mult-assign("3", run-once 2), TypeError
  let mult-member-assign(a, b, c) -> a[b()] *= c()
  eq 6, mult-member-assign({key: 2}, run-once("key"), run-once 3)
  throws #-> mult-member-assign({key: "2"}, run-once("key"), run-once "3"), TypeError
  throws #-> mult-member-assign({key: 2}, run-once("key"), run-once "3"), TypeError
  throws #-> mult-member-assign({key: "2"}, run-once("key"), run-once 3), TypeError

test "Division", #
  let thirty-six = 36
  let six = 6
  let three = 3
  eq 6, thirty-six / six
  eq 2, thirty-six / six / three
  eq 2, (thirty-six / six) / three
  eq 18, thirty-six / (six / three)
  /*
  throws #-> Cotton.compile("""let x = 5
  let y = "2" / '3'"""), (e) -> e.line == 2
  */
  let div = #(a, b) -> a() / b()
  eq 2, div(run-once(6), run-once 3)
  throws #-> div(run-once("6"), run-once "3"), TypeError
  throws #-> div(run-once(6), run-once "3"), TypeError
  throws #-> div(run-once("6"), run-once 3), TypeError
  let div-assign = #(mutable a, b) -> a /= b()
  eq 2, div-assign(6, run-once 3)
  throws #-> div-assign("6", run-once "3"), TypeError
  throws #-> div-assign(6, run-once "3"), TypeError
  throws #-> div-assign("6", run-once 3), TypeError
  let div-member-assign = #(a, b, c) -> a[b()] /= c()
  eq 2, div-member-assign({key: 6}, run-once("key"), run-once 3)
  throws #-> div-member-assign({key: "6"}, run-once("key"), run-once "3"), TypeError
  throws #-> div-member-assign({key: 6}, run-once("key"), run-once "3"), TypeError
  throws #-> div-member-assign({key: "6"}, run-once("key"), run-once 3), TypeError

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
  eq 2, mod(run-once(8), run-once(3))
  throws #-> mod(run-once("8"), run-once("3")), TypeError
  throws #-> mod(run-once(8), run-once("3")), TypeError
  throws #-> mod(run-once("8"), run-once(3)), TypeError
  let mod-assign(mutable a, b) -> a %= b()
  eq 2, mod-assign(8, run-once 3)
  throws #-> mod-assign("8", run-once "3"), TypeError
  throws #-> mod-assign(8, run-once "3"), TypeError
  throws #-> mod-assign("8", run-once 3), TypeError
  let mod-member-assign(a, b, c) -> a[b()] %= c()
  eq 2, mod-member-assign({key: 8}, run-once("key"), run-once 3)
  throws #-> mod-member-assign({key: "8"}, run-once("key"), run-once "3"), TypeError
  throws #-> mod-member-assign({key: 8}, run-once("key"), run-once "3"), TypeError
  throws #-> mod-member-assign({key: "8"}, run-once("key"), run-once 3), TypeError

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
  eq 8, pow(run-once(2), run-once(3))
  throws #-> pow(run-once("2"), run-once("3")), TypeError
  throws #-> pow(run-once(2), run-once("3")), TypeError
  throws #-> pow(run-once("2"), run-once(3)), TypeError
  let pow-assign(mutable a, b) -> a ^= b()
  eq 8, pow-assign(2, run-once 3)
  throws #-> pow-assign("2", run-once "3"), TypeError
  throws #-> pow-assign(2, run-once "3"), TypeError
  throws #-> pow-assign("2", run-once 3), TypeError
  let pow-member-assign(a, b, c) -> a[b()] ^= c()
  eq 8, pow-member-assign({key: 2}, run-once("key"), run-once 3)
  throws #-> pow-member-assign({key: "2"}, run-once("key"), run-once "3"), TypeError
  throws #-> pow-member-assign({key: 2}, run-once("key"), run-once "3"), TypeError
  throws #-> pow-member-assign({key: "2"}, run-once("key"), run-once 3), TypeError

test "Exponentation still calculates left side if right is 0", #
  let ten = run-once(10)
  eq 1, ten() ^ 0
  ok ten.ran

test "Logical operators", #
  eq false, false and false
  eq false, true and false
  eq false, false and true
  eq true, true and true
  
  eq void, void and fail()
  eq 0, 0 and fail()
  eq 0, "yes" and 0
  eq "yes", 1 and "yes"
  
  eq false, false or false
  eq true, true or false
  eq true, false or true
  eq true, true or true
  
  eq 0, void or 0
  eq void, 0 or void
  eq "yes", "yes" or fail()
  eq "yes", 0 or "yes"
  
  eq false, false xor false
  eq true, true xor false
  eq true, false xor true
  eq false, true xor true
  eq 0, 0 xor void
  eq void, void xor 0
  eq "yes", "yes" xor void
  eq "yes", void xor "yes"
  eq false, "yes" xor 1
  
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
  let and-assign(mutable x, y)
    x and= y()
  let and-member-assign(x, y, z)
    x[y()] and= z()
  let or-assign(mutable x, y)
    x or= y()
  let or-member-assign(x, y, z)
    x[y()] or= z()
  let xor-assign(mutable x, y)
    x xor= y()
  let xor-member-assign(x, y, z)
    x[y()] xor= z()
  
  eq 2, and-assign(1, run-once 2)
  eq 0, and-assign(0, fail)
  eq 1, or-assign(1, fail)
  eq 2, or-assign(0, run-once 2)
  eq false, xor-assign(1, run-once 1), "a"
  eq 1, xor-assign(1, run-once 0), "b"
  eq 1, xor-assign(0, run-once 1), "c"
  eq 0, xor-assign(0, run-once 0), "d"
  
  eq undefined, and-member-assign({}, run-once("key"), fail)
  eq "bravo", and-member-assign({key:"alpha"}, run-once("key"), run-once "bravo")
  eq "value", or-member-assign({}, run-once("key"), run-once "value")
  eq "alpha", or-member-assign({key:"alpha"}, run-once("key"), fail)
  eq "value", xor-member-assign({}, run-once("key"), run-once "value")
  eq void, xor-member-assign({}, run-once("key"), run-once 0)
  eq false, xor-member-assign({key:"alpha"}, run-once("key"), run-once "value")
  eq void, xor-member-assign({key:"alpha"}, run-once(0), run-once 0)

test "not", #
  eq true, not false
  eq false, not true

test "instanceof", #
  let MyType() ->
  ok new MyType() instanceof MyType
  ok "hello" not instanceof MyType
  ok "hello" instanceof String
  ok new MyType() not instanceof String
  ok 1234 instanceof Number
  ok (#->) instanceof Function
  ok [] instanceof Array

test "instanceofsome", #
  ok "" instanceofsome [String]
  ok not ("" instanceofsome [Function])
  ok "" not instanceofsome [Function]
  
  ok "" not instanceofsome []
  ok "" instanceofsome [String, Function]
  ok "" instanceofsome [Function, String]
  ok "" not instanceofsome [Number, Function]
  
  let mutable str = run-once ""
  ok str() not instanceofsome []
  ok str.ran
  str := run-once ""
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
  let two = run-once 2
  let three = run-once 3
  let four = run-once 4
  
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
  eq "12", concat(run-once(1), run-once(2))
  eq "12", concat(run-once("1"), run-once("2"))
  eq "12", concat(run-once(1), run-once("2"))
  eq "12", concat(run-once("1"), run-once(2))
  throws #-> concat(run-once("1"), run-once({})), TypeError
  throws #-> concat(run-once({}), run-once("2")), TypeError
  throws #-> concat(run-once({}), run-once({})), TypeError
  throws #-> concat(run-once("1"), run-once(null)), TypeError
  throws #-> concat(run-once(null), run-once("2")), TypeError
  throws #-> concat(run-once(null), run-once(null)), TypeError
  throws #-> concat(run-once("1"), run-once(undefined)), TypeError
  throws #-> concat(run-once(undefined), run-once("2")), TypeError
  throws #-> concat(run-once(undefined), run-once(undefined)), TypeError
  let concat-assign(mutable a, b) -> a &= b()
  eq "12", concat-assign("1", run-once("2"))
  eq "12", concat-assign("1", run-once(2))
  //throws #-> concat-assign(1, run-once("2")), TypeError
  //throws #-> concat-assign(1, run-once(2)), TypeError
  throws #-> concat-assign("1", run-once({})), TypeError
  throws #-> concat-assign({}, run-once("2")), TypeError
  throws #-> concat-assign({}, run-once({})), TypeError
  throws #-> concat-assign("1", run-once(null)), TypeError
  throws #-> concat-assign(null, run-once("2")), TypeError
  throws #-> concat-assign(null, run-once(null)), TypeError
  throws #-> concat-assign("1", run-once(undefined)), TypeError
  throws #-> concat-assign(undefined, run-once("2")), TypeError
  throws #-> concat-assign(undefined, run-once(undefined)), TypeError
  let concat-member-assign(a, b, c) -> a[b()] &= c()
  eq "12", concat-member-assign({key: "1"}, run-once("key"), run-once 2)
  eq "12", concat-member-assign({key: "1"}, run-once("key"), run-once "2")
  //throws #-> concat-member-assign({key: 1}, run-once("key"), run-once "2"), TypeError
  //throws #-> concat-member-assign({key: 1}, run-once("key"), run-once 2), TypeError
  throws #-> concat-member-assign({key: "1"}, run-once("key"), run-once {}), TypeError
  throws #-> concat-member-assign({key: {}}, run-once("key"), run-once "2"), TypeError
  throws #-> concat-member-assign({key: {}}, run-once("key"), run-once {}), TypeError
  throws #-> concat-member-assign({key: "1"}, run-once("key"), run-once null), TypeError
  throws #-> concat-member-assign({key: null}, run-once("key"), run-once "2"), TypeError
  throws #-> concat-member-assign({key: null}, run-once("key"), run-once null), TypeError
  throws #-> concat-member-assign({key: "1"}, run-once("key"), run-once undefined), TypeError
  throws #-> concat-member-assign({key: undefined}, run-once("key"), run-once "2"), TypeError
  throws #-> concat-member-assign({key: undefined}, run-once("key"), run-once undefined), TypeError
  
  let concat-known-numbers()
    let a = 1
    let b = 2
    a & b
  eq "12", concat-known-numbers()

test "new operator", #
  let special = {}
  let Class(...args)
    if this instanceof Class
      [special, args]
    else
      [this, args]
  
  let container = { Class: Class }
  
  let undefined-this-value = (#-> this)()
  
  let array = ["alpha", "bravo", "charlie"]
  
  array-eq [special, []], new Class
  array-eq [special, []], new Class()
  array-eq [special, ["alpha"]], new Class("alpha")
  array-eq [undefined-this-value, []], Class()
  array-eq [undefined-this-value, ["alpha"]], Class("alpha")
  array-eq ["alpha", "bravo"], Class(...["alpha", "bravo"])[1]
  array-eq ["alpha", "bravo", "charlie"], Class(...array)[1]
  array-eq [special, ["alpha"]], Class.call(Object.create(Class.prototype), "alpha")
  array-eq [special, []], new container.Class
  array-eq [special, []], new container.Class()
  array-eq [special, ["alpha"]], new container.Class("alpha")
  array-eq [special, ["alpha", "bravo"]], new container.Class(...["alpha", "bravo"])
  array-eq [special, ["alpha", "bravo", "charlie"]], new container.Class(...array)
  array-eq [container, ["alpha"]], container.Class("alpha")
  array-eq [special, ["alpha"]], container.Class.call(Object.create(container.Class.prototype), "alpha")

test "new operator spread", #
  let Class(...args)!
    ok this instanceof Class
    this.args := args
    return this
  
  let make-class-with-this(...args)
    new Class(this, ...args)
  
  let make-class-with-arguments()
    new Class(arguments)
  
  array-eq [], new Class().args
  array-eq ["alpha"], new Class("alpha").args
  array-eq ["alpha", "bravo"], new Class("alpha", "bravo").args
  let array = ["alpha", "bravo", "charlie"]
  array-eq ["alpha", "bravo", "charlie"], new Class(...array).args
  let obj = {}
  array-eq [obj], make-class-with-this.call(obj).args
  array-eq [obj, "alpha", "bravo", "charlie"], make-class-with-this.apply(obj, array).args
  ok not is-array! make-class-with-arguments().args[0]
  eq 0, make-class-with-arguments().args[0].length
  eq 3, make-class-with-arguments(...array).args[0].length
  array-eq ["alpha", "bravo", "charlie"], [...(make-class-with-arguments(...array).args[0])]
  
  let arr = []
  for i in 0 til 200
    arr.push i
    let obj = new Class(...arr)
    array-eq arr, obj.args
    ok obj instanceof Class
    if typeof Object.get-prototype-of == "function"
      eq Class.prototype, Object.get-prototype-of(obj)
  
  let date-values = [1987]
  ok new Date(...date-values) instanceof Date
  date-values.push 7
  ok new Date(...date-values) instanceof Date
  date-values.push 22
  ok new Date(...date-values) instanceof Date

test "new operator precedence", #
  let Class(...args)!
    ok this instanceof Class
    this.args := args
    return this
  
  Class.method := #(...args)
    ["static", ...args]
  
  Class::method := #(...args)
    ["instance", ...args]
  
  array-eq [], (new Class).args
  array-eq [], new Class().args
  array-eq ["alpha"], (new Class("alpha")).args
  array-eq ["alpha"], new Class("alpha").args
  array-eq ["alpha", "bravo"], (new Class("alpha", "bravo")).args
  array-eq ["alpha", "bravo"], new Class("alpha", "bravo").args
  array-eq ["static"], Class.method()
  array-eq ["static", "alpha"], Class.method("alpha")
  array-eq ["static", "alpha", "bravo"], Class.method("alpha", "bravo")
  array-eq ["instance"], (new Class).method()
  array-eq ["instance"], new Class().method()
  array-eq ["instance", "alpha"], new Class().method("alpha")
  array-eq ["instance", "alpha"], (new Class).method("alpha")
  array-eq ["instance", "alpha", "bravo"], new Class().method("alpha", "bravo")
  array-eq ["instance", "alpha", "bravo"], (new Class).method("alpha", "bravo")
  array-eq ["static"], new Class.method()
  array-eq ["static", "alpha"], new Class.method("alpha")
  array-eq ["static", "alpha", "bravo"], new Class.method("alpha", "bravo")

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
  if typeof Object.define-property == "undefined"
    return
  
  let obj = {}
  Object.define-property(obj, "alpha", {
    get: #-> fail()
    configurable: true
  })
  delete obj.alpha
  eq undefined, obj.alpha

test "delete pluck only calculates object once", #
  let obj = run-once { alpha: "bravo" }
  eq "bravo", delete obj().alpha

test "delete pluck only calculates key once", #
  let obj = { alpha: "bravo" }
  let key = run-once "alpha"
  eq "bravo", delete obj[key()]

test "delete pluck only calculates value once", #
  if typeof Object.define-property != "function"
    return
  
  let obj = {}
  Object.define-property(obj, "alpha", {
    get: run-once "bravo"
    configurable: true
  })
  eq "bravo", delete obj.alpha

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
  array-eq [x, y, z], ["alpha", "alpha", "alpha"]

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
  
  ok not (10 not %% 1)
  ok not (10 not %% 2)
  ok 10 not %% 3
  ok 10 not %% 4
  ok not (10 not %% 5)
  ok 10 not %% 6
  ok 10 not %% 7
  ok 10 not %% 8
  ok 10 not %% 9
  ok not (10 not %% 10)

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
  eq 4, div(run-once(9), run-once 2)
  throws #-> div(run-once("9"), run-once "2"), TypeError
  throws #-> div(run-once(9), run-once "2"), TypeError
  throws #-> div(run-once("9"), run-once 2), TypeError
  let div-assign(mutable a, b) -> a \= b()
  eq 4, div-assign(9, run-once 2)
  throws #-> div-assign("9", run-once "2"), TypeError
  throws #-> div-assign(9, run-once "2"), TypeError
  throws #-> div-assign("9", run-once 2), TypeError
  let div-member-assign(a, b, c) -> a[b()] \= c()
  eq 4, div-member-assign({key: 9}, run-once("key"), run-once 2)
  throws #-> div-member-assign({key: "9"}, run-once("key"), run-once "2"), TypeError
  throws #-> div-member-assign({key: 9}, run-once("key"), run-once "2"), TypeError
  throws #-> div-member-assign({key: "9"}, run-once("key"), run-once 2), TypeError

test "min/max operators", #
  eq 1, 1 min 2 min 3 min 4
  eq 4, 1 max 2 max 3 max 4
  eq "alpha", "alpha" min "bravo" min "charlie" min "delta"
  eq "delta", "alpha" max "bravo" max "charlie" max "delta"

test "min/max assignment", #
  let min-assign(mutable x, y)
    x min= y()
  let min-member-assign(x, y, z)
    x[y()] min= z()
  let max-assign(mutable x, y)
    x max= y()
  let max-member-assign(x, y, z)
    x[y()] max= z()
  
  eq 1, min-assign(1, run-once 2)
  eq 1, min-assign(2, run-once 1)
  eq 2, max-assign(1, run-once 2)
  eq 2, max-assign(2, run-once 1)
  eq "alpha", min-assign("alpha", run-once "bravo")
  eq "alpha", min-assign("bravo", run-once "alpha")
  eq "bravo", max-assign("alpha", run-once "bravo")
  eq "bravo", max-assign("bravo", run-once "alpha")
  
  eq 1, min-member-assign({key: 1}, run-once("key"), run-once 2)
  eq 1, min-member-assign({key: 2}, run-once("key"), run-once 1)
  eq 2, max-member-assign({key: 1}, run-once("key"), run-once 2)
  eq 2, max-member-assign({key: 2}, run-once("key"), run-once 1)
  eq "alpha", min-member-assign({key: "alpha"}, run-once("key"), run-once "bravo")
  eq "alpha", min-member-assign({key: "bravo"}, run-once("key"), run-once "alpha")
  eq "bravo", max-member-assign({key: "alpha"}, run-once("key"), run-once "bravo")
  eq "bravo", max-member-assign({key: "bravo"}, run-once("key"), run-once "alpha")

test "negation on separate line does not look like subtraction", #
  let f()
    let x = 5
    -1
  
  eq -1, f()

test "ownskey", #
  let x = { alpha: true }
  let y = { extends x }
  y.bravo := true
  
  ok x ownskey \alpha
  ok y not ownskey \alpha
  ok y ownskey \bravo

test "haskey", #
  let x = { alpha: true }
  let y = { extends x }
  y.bravo := true
  
  ok x haskey \alpha
  ok y haskey \alpha
  ok y haskey \bravo

test "ownskey with hasOwnProperty in object", #
  let x = { hasOwnProperty: #-> false }
  
  ok x ownskey \hasOwnProperty
  ok not x.hasOwnProperty(\hasOwnProperty)

test "Operators as functions", #
  let n(f, x, y, expected, safe)
    eq "function", typeof f
    eq expected, f(x, y)
    if safe
      throws #-> f(x, String(y))
    else
      ok f(x, String(y)) in [expected, String(expected)]
  let s(f, x, y, expected, safe)
    eq "function", typeof f
    eq expected, f(x, y)
    if safe
      throws #-> f(x, Number(y))
    else
      ok f(x, Number(y)) in [expected, Number(expected)]
  
  n (^), 2, 10, 1024, true
  n (~^), 2, 10, 1024, false
  n (*), 5, 6, 30, true
  n (~*), 5, 6, 30, false
  n (/), 5, 4, 1.25, true
  n (~/), 5, 4, 1.25, false
  n (\), 5, 3, 1, true
  n (~\), 5, 3, 1, false
  n (%), 5, 3, 2, true
  n (~%), 5, 3, 2, false
  n (+), 2, 4, 6, true
  n (~+), 2, 4, 6, false
  n (-), 10, 4, 6, true
  n (~-), 10, 4, 6, false
  n (bitlshift), 0b10101, 4, 0b101010000, true
  n (~bitlshift), 0b10101, 4, 0b101010000, false
  n (bitrshift), 0b101010000, 4, 0b10101, true
  n (~bitrshift), 0b101010000, 4, 0b10101, false
  n (biturshift), 0b101010000, 4, 0b10101, true
  n (~biturshift), 0b101010000, 4, 0b10101, false
  n (biturshift), -1, 0, 2^32 - 1, true
  n (~biturshift), -1, 0, 2^32 - 1, false
  n (bitand), 0b1110, 0b1011, 0b1010, true
  n (~bitand), 0b1110, 0b1011, 0b1010, false
  n (bitor), 0b1110, 0b0101, 0b1111, true
  n (~bitor), 0b1110, 0b0101, 0b1111, false
  n (bitxor), 0b1100, 0b0101, 0b1001, true
  n (~bitxor), 0b1100, 0b0101, 0b1001, false
  n (min), 5, 2, 2, true
  n (~min), 5, 2, 2, false
  n (min), 2, 5, 2, true
  n (~min), 2, 5, 2, false
  n (max), 5, 2, 5, true
  n (~max), 5, 2, 5, false
  n (max), 2, 5, 5, true
  n (~max), 2, 5, 5, false
  n (&), 1, 2, "12"
  n (~&), "1", "2", "12"
  n (&), "hello", "there", "hellothere"
  n (~&), "hello", "there", "hellothere"
  throws #-> (&)(undefined, 1)
  n (~&), undefined, 1, "undefined1", false
  
  eq "function", typeof (in)
  ok (in)("c", ["a", "b", "c", "d"])
  ok not (in)("e", ["a", "b", "c", "d"])
  
  eq "function", typeof (not in)
  ok not (not in)("c", ["a", "b", "c", "d"])
  ok (not in)("e", ["a", "b", "c", "d"])
  
  eq "function", typeof (haskey)
  ok (haskey)({hello: "there"}, "hello")
  ok (haskey)({ extends {hello: "there"} }, "hello")
  ok not (haskey)({ extends {} }, "hello")
  
  eq "function", typeof (not haskey)
  ok not (not haskey)({hello: "there"}, "hello")
  ok not (not haskey)({ extends {hello: "there"} }, "hello")
  ok (not haskey)({ extends {} }, "hello")
  
  eq "function", typeof (ownskey)
  ok (ownskey)({hello: "there"}, "hello")
  ok not (ownskey)({ extends {hello: "there"} }, "hello")
  ok not (ownskey)({ extends {} }, "hello")
  
  eq "function", typeof (not ownskey)
  ok not (not ownskey)({hello: "there"}, "hello")
  ok (not ownskey)({ extends {hello: "there"} }, "hello")
  ok (not ownskey)({ extends {} }, "hello")
  
  eq "function", typeof (instanceof)
  ok (instanceof)(#->, Function)
  ok (instanceof)({}, Object)
  ok (instanceof)([], Array)
  ok not (instanceof)(#->, Array)
  ok not (instanceof)([], Number)
  
  eq "function", typeof (not instanceof)
  ok not (not instanceof)(#->, Function)
  ok not (not instanceof)({}, Object)
  ok not (not instanceof)([], Array)
  ok (not instanceof)(#->, Array)
  ok (not instanceof)([], Number)
  
  eq "function", typeof (instanceofsome)
  ok (instanceofsome)(#->, [Number, Function])
  ok (instanceofsome)(#->, [Function, Number])
  ok not (instanceofsome)(#->, [String, Number])
  
  eq "function", typeof (not instanceofsome)
  ok not (not instanceofsome)(#->, [Number, Function])
  ok not (not instanceofsome)(#->, [Function, Number])
  ok (not instanceofsome)(#->, [String, Number])
  
  eq "function", typeof (<=>)
  eq 0, (<=>)("hello", "hello")
  eq -1, (<=>)("alpha", "bravo")
  eq 1, (<=>)("bravo", "alpha")
  eq 0, (<=>)(1000, 1000)
  eq -1, (<=>)(1000, 1100)
  eq 1, (<=>)(1000, 900)
  
  eq "function", typeof (~=)
  ok (~=)("1", 1)
  ok (~=)("", 0)
  ok (~=)("", [])
  ok not (~=)(false, 1)
  
  eq "function", typeof (!~=)
  ok not (!~=)("1", 1)
  ok not (!~=)("", 0)
  ok not (!~=)("", [])
  ok (!~=)(false, 1)
  
  ok "function", typeof (==)
  ok (==)(1, 1)
  ok not (==)("1", 1)
  ok (==)("hello", "hello")
  ok not (==)("hello", "Hello")
  
  ok "function", typeof (!=)
  ok not (!=)(1, 1)
  ok (!=)("1", 1)
  ok not (!=)("hello", "hello")
  ok (!=)("hello", "Hello")
  
  n (%%), 10, 5, true, true
  n (~%%), 10, 5, true, false
  n (%%), 10, 6, false, true
  n (~%%), 10, 6, false, false
  
  n (not %%), 10, 5, false, true
  n (not ~%%), 10, 5, false, false
  n (not %%), 10, 6, true, true
  n (not ~%%), 10, 6, true, false
  
  n (<), 1, 5, true, true
  n (~<), 1, 5, true, false
  n (<), 5, 5, false, true
  n (~<), 5, 5, false, false
  n (<), 5, 1, false, true
  n (~<), 5, 1, false, false
  n (<=), 1, 5, true, true
  n (~<=), 1, 5, true, false
  n (<=), 5, 5, true, true
  n (~<=), 5, 5, true, false
  n (<=), 5, 1, false, true
  n (~<=), 5, 1, false, false
  n (>), 5, 1, true, true
  n (~>), 5, 1, true, false
  n (>), 5, 5, false, true
  n (~>), 5, 5, false, false
  n (>), 1, 5, false, true
  n (~>), 1, 5, false, false
  n (>=), 5, 1, true, true
  n (~>=), 5, 1, true, false
  n (>=), 5, 5, true, true
  n (~>=), 5, 5, true, false
  n (>=), 1, 5, false, true
  n (~>=), 1, 5, false, false
  
  s (<), "1", "5", true, true
  s (~<), "1", "5", true, false
  s (<), "5", "5", false, true
  s (~<), "5", "5", false, false
  s (<), "5", "1", false, true
  s (~<), "5", "1", false, false
  s (<=), "1", "5", true, true
  s (~<=), "1", "5", true, false
  s (<=), "5", "5", true, true
  s (~<=), "5", "5", true, false
  s (<=), "5", "1", false, true
  s (~<=), "5", "1", false, false
  s (>), "5", "1", true, true
  s (~>), "5", "1", true, false
  s (>), "5", "5", false, true
  s (~>), "5", "5", false, false
  s (>), "1", "5", false, true
  s (~>), "1", "5", false, false
  s (>=), "5", "1", true, true
  s (~>=), "5", "1", true, false
  s (>=), "5", "5", true, true
  s (~>=), "5", "5", true, false
  s (>=), "1", "5", false, true
  s (~>=), "1", "5", false, false
  
  ok "function", typeof (and)
  eq 5, (and)(1, 5)
  eq 0, (and)(0, 5)
  eq false, (and)(false, 5)
  eq 5, (and)(true, 5)
  eq void, (and)(void, 5)
  eq null, (and)(null, 5)
  eq "", (and)("", 5)
  eq 5, (and)("a", 5)
  
  ok "function", typeof (or)
  eq 1, (or)(1, 5)
  eq 5, (or)(0, 5)
  eq 5, (or)(false, 5)
  eq true, (or)(true, 5)
  eq 5, (or)(void, 5)
  eq 5, (or)(null, 5)
  eq 5, (or)("", 5)
  eq "a", (or)("a", 5)
  
  ok "function", typeof (xor)
  eq false, (xor)(1, 5)
  eq 1, (xor)(1, 0)
  eq 5, (xor)(0, 5)
  eq 5, (xor)(false, 5)
  eq false, (xor)(true, 5)
  eq true, (xor)(true, void)
  eq 5, (xor)(void, 5)
  eq 5, (xor)(null, 5)
  eq 5, (xor)("", 5)
  eq false, (xor)("a", 5)
  eq "a", (xor)("a", null)
  
  ok "function", typeof (?)
  eq 1, (?)(1, 5)
  eq 0, (?)(0, 5)
  eq false, (?)(false, 5)
  eq true, (?)(true, 5)
  eq 5, (?)(void, 5)
  eq 5, (?)(null, 5)
  eq "", (?)("", 5)
  eq "a", (?)("a", 5)
  
  eq "function", typeof (not)
  eq true, (not)(false)
  eq false, (not)(true)
  eq true, (not)("")
  eq false, (not)("a")
  eq true, (not)(0)
  eq false, (not)(1)
  eq true, (not)(void)
  eq true, (not)(null)
  
  /*
  eq "function", typeof (not not)
  eq false, (not not)(false)
  eq true, (not not)(true)
  eq false, (not not)("")
  eq true, (not not)("a")
  eq false, (not not)(0)
  eq true, (not not)(1)
  eq false, (not not)(void)
  eq false, (not not)(null)
  */
  eq "function", typeof (bitnot)
  eq -1, (bitnot)(0)
  eq -2, (bitnot)(1)
  eq -6, (bitnot)(5.5)
  throws #->(bitnot)("")
  throws #->(bitnot)(void)
  
  eq "function", typeof (~bitnot)
  eq -1, (~bitnot)(0)
  eq -2, (~bitnot)(1)
  eq -6, (~bitnot)(5.5)
  eq -1, (~bitnot)("")
  
  eq "function", typeof (typeof)
  eq "number", (typeof)(0)
  eq "number", (typeof)(1)
  eq "number", (typeof)(NaN)
  eq "string", (typeof)("")
  eq "undefined", (typeof)(void)
  eq "object", (typeof)(null)
  eq "object", (typeof)({})
  eq "object", (typeof)([])
  eq "function", (typeof)(#->)
  eq "boolean", (typeof)(true)
  eq "boolean", (typeof)(false)
  
  eq "function", typeof (typeof!)
  eq "Number", (typeof!)(0)
  eq "Number", (typeof!)(1)
  eq "Number", (typeof!)(NaN)
  eq "String", (typeof!)("")
  eq "Undefined", (typeof!)(void)
  eq "Null", (typeof!)(null)
  eq "Object", (typeof!)({})
  eq "Array", (typeof!)([])
  eq "Function", (typeof!)(#->)
  eq "Boolean", (typeof!)(true)
  eq "Boolean", (typeof!)(false)
  
  let t(f, obj, should-catch)
    eq "function", typeof f
    let mutable caught = false
    try
      f(obj)
    catch e
      caught := true
    ok not (caught xor should-catch)
  
  t (throw), {}, true
  t (throw), false, true
  t (throw), null, true
  t (throw), void, true
  
  t (throw?), {}, true
  t (throw?), false, true
  t (throw?), null, false
  t (throw?), void, false

test "Operators as functions are curried", #
  let add = (+)
  eq 3, add 1, 2
  let plus-5 = add 5
  eq 8, plus-5 3
  eq 9, plus-5 4
  let plus-6 = add 6
  eq 10, plus-6 4

test "Partial operator functions", #
  let double = (* 2)
  eq \function, typeof double
  eq 6, double 3
  
  let square = (^ 2)
  eq \function, typeof square
  eq 9, square 3
  
  let two-exp = (2 ^)
  eq \function, typeof two-exp
  eq 1024, two-exp 10
  
  let F()! ->
  let is-F = (instanceof F)
  let is-not-F = (not instanceof F)
  
  ok is-F(new F)
  ok not is-not-F(new F)
  ok not is-F({})
  ok is-not-F({})

test "til operator", #
  array-eq [0, 1, 2, 3, 4], 0 til 5
  array-eq [], 5 til 0
  array-eq [0.5, 1.5, 2.5, 3.5, 4.5], 0.5 til 5

test "to operator", #
  array-eq [0, 1, 2, 3, 4, 5], 0 to 5
  array-eq [], 5 to 0
  array-eq [0.5, 1.5, 2.5, 3.5, 4.5], 0.5 to 5

test "til with by", #
  array-eq [0, 2, 4], 0 til 5 by 2
  array-eq [], 5 til 0 by 2
  array-eq [5, 4, 3, 2, 1], 5 til 0 by -1
  array-eq [5, 3, 1], 5 til 0 by -2
  array-eq [0, 0.5, 1, 1.5, 2, 2.5], 0 til 3 by 0.5

test "to with by", #
  array-eq [0, 2, 4], 0 to 5 by 2
  array-eq [], 5 to 0 by 2
  array-eq [5, 4, 3, 2, 1, 0], 5 to 0 by -1
  array-eq [5, 3, 1], 5 to 0 by -2
  array-eq [0, 0.5, 1, 1.5, 2, 2.5, 3], 0 to 3 by 0.5

test "by on normal array", #
  array-eq [1, 2, 3, 4], [1, 2, 3, 4] by 1
  array-eq [1, 3], [1, 2, 3, 4] by 2
  array-eq [4, 3, 2, 1], [1, 2, 3, 4] by -1
  array-eq [4, 2], [1, 2, 3, 4] by -2

test "is/isnt operator", #
  ok 1 is 1
  ok 0 is 0
  ok -0 is -0
  ok NaN is NaN
  ok Infinity is Infinity
  ok -Infinity is -Infinity
  ok "hello" is "hello"
  ok 1 isnt -1
  ok 0 isnt -0
  ok -0 isnt 0
  ok Infinity isnt -Infinity
  ok -Infinity isnt Infinity
  ok NaN isnt 0
  ok NaN isnt Infinity
  ok NaN isnt -Infinity
  ok not (NaN isnt NaN)
  
  let positive-zero = 0
  let negative-zero = -0
  let nan = NaN
  
  ok positive-zero is 0
  ok 0 is positive-zero
  ok positive-zero is positive-zero
  ok negative-zero is -0
  ok -0 is negative-zero
  ok negative-zero is negative-zero
  ok nan is NaN
  ok NaN is nan
  ok nan is nan

test "percent operator", #
  ok 100% == 1
  ok 1.234% == 0.01234
  ok -100% == -1
  
  let x = 100
  ok x% == 1

test "Addition verifies numericity with different possible return types", #
  let f(x)
    if x
      "234"
    else
      234

  eq 235, 1 + f(false)
  throws #-> 1 + f(true), TypeError

test "Addition verifies numericity with an idle return statement", #
  let f(x)
    if x
      return "234"
    234

  eq 235, 1 + f(false)
  throws #-> 1 + f(true), TypeError

test "Assigning an unknown variable is an error", #
  throws #-> gorilla.compile("""let x = 0
  y := 5"""), #(e) -> e.line == 2

test "Assigning an immutable variable is an error", #
  throws #-> gorilla.compile("""let x = 0
  x := 5"""), #(e) -> e.line == 2

test "Compose operators", #
  let double(x) -> x * 2
  let square(x) -> x ^ 2
  
  let square-of-double = square << double
  let double-of-square = square >> double
  
  eq 100, square-of-double(5)
  eq 50, double-of-square(5)
  
  let times-8 = double << double << double
  eq 40, times-8 5

test "Compose operators are executed in expected order", #
  let with-addition = do
    let mutable id = 0
    #(f)
      let my-id = (id += 1)
      #(x) -> f(x) + my-id
  
  let double(x) -> x * 2
  let square(x) -> x ^ 2
  
  let alpha = with-addition(square) << with-addition(double) // ((x * 2) + 2) ^ 2 + 1
  array-eq [5, 17, 37, 65, 101, 145], [alpha(0), alpha(1), alpha(2), alpha(3), alpha(4), alpha(5)]
  
  let bravo = with-addition(square) >> with-addition(double) // ((x ^ 2) + 3) * 2 + 4
  array-eq [10, 12, 18, 28, 42, 60], [bravo(0), bravo(1), bravo(2), bravo(3), bravo(4), bravo(5)]

test "Pipe operators", #
  let double(x) -> x * 2
  let square(x) -> x ^ 2
  
  eq 100, 5 |> double |> square
  eq 100, square <| double <| 5

test "Pipe operators are executed in expected order", #
  let with-addition = do
    let mutable id = 0
    #(f)
      let my-id = (id += 1)
      #(x) -> f(x) + my-id
  
  let double(x) -> x * 2
  let square(x) -> x ^ 2
  
  // ((5 * 2) + 1) ^ 2 + 2
  eq 123, 5 |> with-addition(double) |> with-addition(square)
  // ((5 * 2) + 4) ^ 2 + 3
  eq 199, with-addition(square) <| with-addition(double) <| 5

test "Import operators", #
  let source = { alpha: \bravo }
  let mutable dest = { charlie: \delta }
  
  eq dest, dest <<< source
  eq \bravo, dest.alpha
  eq \delta, dest.charlie
  
  dest := { charlie: \delta }
  eq dest, source >>> dest
  eq \bravo, dest.alpha
  eq \delta, dest.charlie
  
  dest := { charlie: \delta }
  
  eq dest, dest <<< { alpha: \bravo }
  eq \bravo, dest.alpha
  eq \delta, dest.charlie

test "Import chain", #
  let a = {} <<< { alpha: \bravo } <<< { charlie: \delta }
  eq \bravo, a.alpha
  eq \delta, a.charlie
  
  let one = { alpha: \bravo }
  let two = { charlie: \delta }
  let b = {} <<< one <<< two
  eq \bravo, b.alpha
  eq \delta, b.charlie
  eq void, one.charlie
