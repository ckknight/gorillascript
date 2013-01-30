# GorillaScript
GorillaScript is a compile-to-JavaScript language designed to empower the user while attempting to prevent some common errors.

## Why not use JavaScript?
JavaScript has a lot of warts in the language and while the ECMAScript community is doing a good job with its upcoming revisions, it's still left with a lot of the old cruft. Also, for those who want to code for older browsers, all the shiny new features that the newer versions of ECMAScript provide are for all intents and purposes unreachable.

## Strict vs unstrict equality
`==` and `!=` perform type coercion behind the scenes and can be the cause of some subtle bugs.
    
    // JavaScript, all the following are true
    1 == "1"
    0 != ""
    3 == "03"
    [] == ""
    [] == 0
    [] == ![]
    [] == false
    null != false
    null == undefined

These could all be fixed by adding an extra equal sign, but GorillaScript makes `==` and `!=` strict by default. If one reallys want the unstrict equality operators, one can use `~=` and `!~=`, but it is not recommended except for comparing against null or undefined, which has the nice postfix operator `?`.

## The `+` operator (and `+=`)
`+` can mean one of two things in JavaScript, addition or string concatenation. There is no way to know at compile-time what the consequences of using `+` is unless one is 100% certain what each type is.
  
    x + y
  
Is addition unless both `x` and `y` are numbers, booleans, undefined, or null, with any mixed variation. If either is not one of those, at which point it performs string concatenation.

    // JavaScript
    1 + 2 === 3 // as expected
    "hello, " + "world" === "hello, world" // as expected
    "hello, " + 123 === "hello, 123" // sure, I can accept this
    "1" + 2 === "12"
    1 + "2" === "12"
    
    // and for some oddities
    false + false === 0
    false + true === 1
    true + true === 2
    null + null === 0
    isNaN(undefined + undefined)
    [] + [] === ""
    {} + {} === "[object Object][object Object]"
    true + [] === "true"
    new Date() + 1 === "Tue Jan 29 2013 20:25:58 GMT-0800 (PST)1" // or something like it
    new Date() - 1 === 1359519958072 // or some other number
    var foo = {
      toString: function () { return 5; }
      valueOf: function () { return "foo"; }
    };
    foo.toString() + 1 === 6
    foo + 1 === "foo1"

GorillaScript solves this by splitting the operator into two: `+` for addition and `&` for string concatenation.

    // GorillaScript
    1 + 2 == 3
    "hello, " & "world" == "hello, world"
    "hello, " & 123 == "hello, 123" // concatenation with numbers still works perfectly fine
    1 & 2 == "12" // despite both being numbers, & always makes a string.
    
    1 + "2" // TypeError
    "1" + 2 // TypeError
    "1" + "2" // TypeError
    false + false // TypeError
    null + null // TypeError
    void + void // TypeError
    [] + [] // TypeError
    {} + {} // TypeError
    new Date() + 1 // TypeError
    new Date().getTime() + 1 == 1359519958072 // or some other number

As can be seen, the operators which don't fit the proper types exactly fail immediately, allowing one to catch bugs as early as possible rather than allowing them to permeate through one's programs.

Don't be worried about losing the bitwise and operator, that is now called `bitand`.

## Type safety of operators

All operators check the types of their operands to assure that there will be no improper inputs and that any errors that do occur are caught as early as possible.

* `==` and `!=` do not check the types, since they are already strict by default (in GorillaScript).
* `<`, `>`, `<=`, `>=` are restricted to primitive `String`s and `Number`s, but never mixing the two.
* `+` only works on primitive `Number`s.
* `&`, the new string concatenation operator, works on primitive `String`s and `Number`s.
* `-`, `*`, `/`, `\` (floor division), `%`, `%%` (divisible-by), `^` (exponentiation, not bitwise xor), `bitand` (instead of `&`), `bitor` (instead of `|`), `bitxor` (instead of `^`), `bitnot` (instead of `~`), `bitlshift` (instead of `<<`), `bitrshift` (instead of `>>`), `biturshift` (instead of `>>>`), `-` (unary negate), `+` (unary coerce-to-number), and all their respective assignment operators (`-=`, `+=`, etc.) all only work on primitive `Number`s.

No other operators' types are checked.

If one really wishes to work in an environment where the operands' types are not checked, one can always prepend the operator with `~`, so there is a `~*` operator which performs multiplication without checking. It is recommended to instead parse input data into conforming types before performing operations on them.

Thankfully, GorillaScript is able to tell which types most values are, so in the general case, there should be little to no runtime type checking occurring.

## Immutable by default

GorillaScript uses two separate tokens for declaration as compared to assignment. Also, instead of JavaScript's `var` keyword, GorillaScript uses `let`. Unless one specifies `let mutable`, the local constant cannot be reset to any other value. The object in the value can still be mutated (assuming it is mutable). This can prevent some errors and often helps with the clarity of one's code.

Also, no undeclared variables can be altered, preventing unexpected global pollution (and typos).

    let x = 5
    x := 6 // Error
    let mutable y = 5
    y := 6 // perfectly fine
    z := 6 // never declared, this is an error

As you may have noticed, there are two different operators for declaration `=` as compared to assignment `:=`. This is to clarify the difference. In an ideal program, having as little mutable state as possible is best, so if `:=` jumps out, that's a good thing.

## Indentation to mark code blocks

Instead of using braces to dictate code blocks, GorillaScript opts for whitespace indentation as a way to mark blocks. Although this may be jarring at first and one may be skeptical, any good programmer properly indents his or her code to have a consistent whitespace anyway. GorillaScript does not dictate how many spaces or tabs are used, as long as it is consistent within any given block.

    if hello
      if loudly
        "HELLO!"
      else
        "hi"
    else
      "Goodbye."

You may have also noticed the lack of semicolons. The parser is able to tell when the end of a statement is without them, so they are unnecessary.

## Changed operators

Many of the operators have changed to provide more clarity or to free up the usage of certain symbols.

* `===` - `==`
* `!==` - `!=`
* `==` - `~=`
* `!=` - `!~=`
* `!x` - `not x`
* `+` - `+` for addition, `&` for string concatenation, type-checked
* `&` - `bitand`, type-checked
* `|` - `bitor`, type-checked
* `^` - `bitxor`, type-checked
* `~x` - `bitnot x`, type-checked
* `<<` - `bitlshift`, type-checked
* `>>` - `bitrshift`, type-checked
* `>>>` - `biturshift`, type-checked
* `--x` - `x -= 1`, type-checked
* `++x` - `x += 1`, type-checked
* `x--` - `post-dec! x`, not recommended except for advanced cases
* `x++` - `post-inc! x`, not recommended except for advanced cases
* `&&` - `and`
* `||` - `or`, can no longer be used with `and` unless one group is in parentheses.
* `x ? y : z` - `if x then y else z`
* `key in obj` - `obj haskey key`, reversed arguments. Can use `not haskey`
* `obj instanceof constructor` - Can also use `not instanceof`
* `delete x.y` - Returns the value of `x.y` as well as deleting. Does not work on global variables anymore, use `delete GLOBAL.x`

Kept the same:

* `<` - type-checked
* `<=` - type-checked
* `>` - type-checked
* `>=` - type-checked
* `-` - type-checked
* `*` - type-checked
* `/` - type-checked
* `%` - type-checked
* `-x` - type-checked
* `+x` - type-checked
* `x[y]`
* `typeof x`
* `throw x` - Can now be used as an expression

Added:

* `typeof! x` - displays the constructor name of the object, typeof! {} == "Object", typeof! [] == "Array"
* `throw? x` - Only throws `x` if `x` is not null or undefined.
* `x ^ y` - Same as `Math.pow(x, y)`
* `x \ y` - Same as `Math.floor(x / y)`
* `xor` - For logical completeness with `and` and `or`
* `x and= y` - Same as `if x then x := y`
* `x or= y` - Same as `if not x then x := y`
* `x in y` - Does `x` exist in array `y`. Can use `not in`. Highly efficient if `y` is a literal array.
* `x ownskey y` - Does `x` own the property named `y`. Can use `not ownskey`
* `x <=> y` - if x == y, 0. if x < y, -1. otherwise, 1.
* `x %% y` - Is x divisible by `y`? Same as `x % y == 0`.
* `x min y` - Choose the lower number or lexicographically lesser string
* `x min= y` - If `y` is less than `x`, set `x` to `y`.
* `x max y` - Choose the higher number or lexicographically greater string
* `x max= y` - If `y` is greater than `x`, set `x` to `y`.
* `x?` - Is `x` `null` or `undefined`?
* `x ? y` - If `x` is `null` or `undefined`, then `y`, otherwise keep the value of `x`. `y` may not be executed.
* `x ?= y` - If `x` is `null` or `undefined`, then set `x` to `y`. `y` may not be executed.
* `is-array! x` - True if `x` is an Array (and not just an Array-like object). Works on arrays from a different context.
* `is-object! x` - True if `x` is an Object and not null. Works on objects from a different context.
* `x to y` - Create an array from `x` to inclusive `y`.
* `x til y` - Create an array from `x` until exclusive `y`.
* `array by step` - Take every `step`th value from the array. If `step` is less than 0, go in reverse.
* `x to y by step` - Create an array from `x` to inclusive `y`, stepping by `step`.
* `x til y by step` - Create an array from `x` until exclusive `y`, stepping by `step`.
* `x instanceofsome y` - Iterate over array and check with `instanceof`. Highly efficient if `y` is a literal array.
* `x is y` - Works like the ECMAScript6 Object.is, which is like GorillaScript's `==`, but differentiating between `0` and `-0` and properly comparing `NaN is NaN`. Not recommended to use unless you know you're working with numbers.
* `x isnt y` - Same as `not (x is y)`

## Slightly nicer function syntax

There are two ways to specify functions, one directly using `let`, and one as an anonymous function. Also, unlike JavaScript, the last expression is automatically returned (unless tagging the function with `!`). Functions can be called optionally without parentheses, as long as it is unambiguous.

    let increment(x)
      x + 1
    
    increment(0) == 1
    (increment 1) == 2
    
    let run(callback)
      callback()
    
    run(#-> "hello") == "hello"
    (run #-> "there") == "there"
    run(#
      "you") == "you"
    run(#
      let x = "guys"
      "good " & x) == "good guys"
    
    // this syntax also works
    let f() -> Math.random()
    f()

The outer `this` can also be captured be appending `@` to the head of the function declaration, creating a "bound" function. This is similar to ECMAScript 5's `Function.prototype.bind`, but more efficient since a hidden `_this` variable is used rather than an extra function call.

    let func()
      let inner()@
        this
      
      func() == this


## String interpolation

Inside double-quoted strings `("like this")`, not single-quoted strings `('like this')`, one can specify string interpolations using the `$` symbol, followed by an identifier or a parenthetical expression.

    let hello(name)
      "Hello, $name"
    
    hello("World") == "Hello, World"
    hello("Universe") == "Hello, Universe"
    
    // or
    
    let greet(names)
      "Hello, $(names.join ', ')"
    
    greet(["World", "Universe"]) == "Hello, World, Universe"

## Optional parameters

To specify an optional parameter, one simply need to specify `= value` in the function parameter list.

    let hello(name = "World")
      "Hello, $name"
    
    hello() == "Hello, World"
    hello("Universe") == "Hello, Universe"

If a value is passed in that is null or undefined, it will be automatically turned into the default value.

## Spread parameters

Instead of using JavaScript's atrociously broken `arguments` special, one can specify a spread parameter by prefixing `...`. Only one can occur in a function parameter list, but it can be at any position.

    let hello(...names)
      if names.length == 0
        "No one is here"
      else
        "Hello, $(names.join ', ')"
    
    hello() == "No one is here"
    hello("World") == "Hello, World"
    hello("World", "Universe") == "Hello, World, Universe"

And so that callers don't feel bad about themselves, you can call with spread as well.

    let f(a, b, c) -> [a, b, c]
    
    let items = [1, 2]
    
    f(0, ...f(...items, 3), 4)

## Dashed-identifiers

Although completely optional to use if you prefer using `camelScript`-style identifiers, one can now specify identifiers with dashes, such as `my-name` or `gorillas-are-awesome`. They are turned into `myName` and `gorillasAreAwesome`, respectively.

    let gorillas-are-awesome == "Yes, they are."

## Nicer number syntax

All numbers can have arbitrary underscores in the middle of them, which can be used for thousands separators or bitwise n-bit separators. (`1_234_567` or `0x1234_5678_90ab_cdef`)

Decimal numbers can have inline-comments appended to them after an underscore. (`1000_ms`)

Octals use the format `0o12345670` instead of `01234567`, to help with clarity.

Binary numbers are available with the format `0b10101010`.

Arbitrary-radix numbers are available by specifying a decimal number between 2 and 36, `r`, and the number. (`4r01230123`, `36rjdhremn`)

    let time = 10_000_ms
    let hex = 0x1234_5678
    let octal = 0o070
    let binary = 0b1010010101
    let radix = 36rNFfdH45
    let float = 123_456.789_012

Non-decimals do support floating point unlike JavaScript, though that is a lesser-used feature.

## Some new string syntaxes

Aside from the already-seen string interpolation, there are also triple-quoted strings, which allow for multi-line and are indentation-friendly.

    let name = "Jimmy"
    let string = """
      Hello there.
        I have a story to tell you, $name.
      I can't think of it right now, though.
      """
    
    The indentation is stripped (but not line 2's, since that's deliberate), and interpolation is done for `$name`, and the first and last newlines are removed. This all occurs at compile-time, so your result code will be as fast as possible.
    
    There are also string like `'''this'''` which do not have interpolation, if you wish to use it.

There is also a short syntax for single-word strings that also convert `dashed-names` to `camelCase` just as normal identifiers do.

    "Jimmy" == \Jimmy
    object.some-key == object[\some-key]
    "someKey" == \some-key

## Nicer syntaxes for objects and arrays

Although the standard JavaScript-style syntaxes work, there are a few other ways to specify objects and arrays.
    
    let list = [1, 2, 3]
    let other-list = [...list, 4, 5, 6] // now contains [1, 2, 3, 4, 5, 6]
    
    // another way to specify an array
    let items =
      * "Apples"
      * "Bananas"
      * "Cherries"
    
    let obj = {
      list // same as list: list
      sum: 6
    }
    
    let great-apes =
      bonobos:
        awesomeness: "pretty cool"
        population: 40_000
      humans:
        awesomeness: "let's not say anything bad about these guys"
        population: 7_000_000_000
      gorillas:
        awesomeness: "clearly the best"
        population: 100_000
    
    let special = {
      [1 + 2]: "three"
      "key$i": "interpolated key"
      class: "JavaScript would fail on the 'class' key."
    }

To specify the prototype of an object:

    let parent = { hello: \there }
    let child = { extends parent
      value: 1
    }
    child.hello == \there
    child.value == 1

## Unless statement

To correlate with the `if` statement, there is also an `unless` statement which works as its exact opposite.

    if hates-bananas
      "You monster."
    else unless loves-gorillas
      "How could you?"
    else if likes-the-gorillaz
      "Fire comes out of the monkey's head."
    else
      "Well, at least you love gorillas and don't hate bananas."

## Loops

GorillaScript provides many different looping constructs, all fitted for their own purposes.

Normal while loop, same as JavaScript:

    let mutable i = 0
    while i < 10
      console.log i
      i += 1

Opposite of a while loop, `until`:

    let mutable i = 0
    until i >= 10
      console.log i
      i += 1

Better version of the above, acts like JavaScript's for(;;)

    let mutable i = 0
    while i < 10, i += 1
      console.log i

Even better version:

    for i in 0 til 10
      console.log i

Or if you want to go in reverse,

    for i in 9 to 0 by -1
      console.log i

Or by twos:

    for i in 0 til 10 by 2
      console.log i

You don't have to use literal numbers, they can be any expression in GorillaScript. You can also use `to`, `til`, and `by` to make arrays outside of loops.

The difference between `til` and `to` is that `til` goes up until it hits the end, but `to` includes the end.

To iterate over an array,

    for food in ["Apples", "Bananas", "Cherries"]
      console.log food

If you want its index,
    
    for food, index in ["Apples", "Bananas", "Cherries"]
      console.log "$index: $food"

You can also get the total length of the array, if you need it:

    for value, index, length in some-array
      f()

To iterate an array in reverse (slightly more efficient):

    for value, index in some-array by -1
      // index goes from some-array.length - 1 down to 0.
      console.log value

To iterate only a part of the array:

    for value in some-array[2 to 5]
      console.log value

It works similarly to some-array.slice(2, 6). You can slice outside of loops as well.

To iterate over objects, you can use `of` instead of `in`:

    for key, value of some-object
      console.log key, value

GorillaScript automatically runs an Object.prototype.hasOwnProperty check on the key. To avoid this, use:

    for key, value ofall some-object
      console.log key, value

Any loop can be an expression simply by returning it or assigning it to a variable. This will create an array.

    let squares = for value in 0 to 10
      value ^ 2
    
    // squares now contains [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

Single-line loops can be specified as so:

    let squares = for value in 0 to 10; value ^ 2

There are also reducing loops which work by placing one of the reducers (`first`, `every`, `some`, `reduce`) on the `for` or `while` loop.

    let all-good = for every item in array; item.is-good()
    let has-bad = for some item in array; item.is-bad()
    let best-value = for first item in array
      if item.is-best()
        item.value
    let sum = for reduce value in [0, 1, 2, 3, 4], current = 0
      current + value

These work on any `for` or `while` loop.

## Lexical scoping in loops

A common bug in JavaScript is when one creates a function inside a loop that refers to the current index or value or some other variable that changes each loop iteration. GorillaScript solves this problem by wrapping any for loop that creates a function in another function, so the following works by seemingly lexically-scoping the inside of the for loop rather than abiding by JavaScript's normal function scoping.

    let funcs = []
    for i in 0 til 10
      funcs.push #-> i
    
    funcs[0]() == 0
    funcs[5]() == 5

With no extra work on the developer's part.

## Array slicing

As mentioned briefly earlier, one can use the `to`, `til`, and `by` syntaxes to slice on arrays.

    let array = [\a, \b, \c, \d, \e]
    array[1 to 3] // [\a, \b, \c]
    array[1 to 5 by 2] // [\a, \c, \e]
    array[5 to 1 by -2] // [\e, \c, \a]
    array by -1 // [\e, \d, \c, \b, \a]
    array[0 to -1] // [\a, \b, \c, \d, \e]
    array[0 to Infinity] // [\a, \b, \c, \d, \e]

## Everything is an expression (mostly)

Unlike JavaScript, `for` loops, `while` loops, `try` blocks, and `if` constructs can be used as expressions.

    let array = for i in 0 to 10; i
    let trial = try
      throw Error()
    catch e
      "Caught something"
    trial == "Caught something"
    let check = if youre-amazing
      "It's true"
    else
      "Not amazing."

## Existential operator

If one wishes to check a value against null or undefined, the existential operator (`?`) can be used.

    let exists = value?

It can also be used for access soaking

    let inner = value?.which.might?.not.exist

Turns into

    let inner = if value?
      let _ref = value.which.might
      if _ref?
        _ref.not.exist

It can also be used for function checking

    let result = f?()

Turns into

    let result = if typeof f == \function
      f()

## `in` operator

To correlate with array iteration, `in` checks if a value is in an array, in a similar way to `array.indexOf(value) != -1` would.

    \hello in [\hi, \there, \hello]

To check if an object contains a key, see the `haskey` operator.

## `haskey` and `ownskey`

Instead of using JavaScript's `in`, `haskey` is used to verify a key's existence on an object. Also, `ownskey` is also available to check if a key exists on an object without prototype-checking.

    let parent = { alpha: \bravo }
    let child = { extends parent, charlie: \delta }
    
    parent haskey \alpha
    parent ownskey \alpha
    parent not haskey \charlie
    parent not ownskey \charlie
    child haskey \alpha
    child not ownskey \alpha
    child haskey \charlie
    child ownskey \charlie

## Access with ownership

Sometimes you may have an object where you want to access its key but only in the case of the object owning the key as a property.

    if parent ownskey key
      parent[key]
    
    // functionally equivalent to
    
    parent![key]

Or, for a known key:

    if parent ownskey "key"
      parent.key
    
    parent!.key

## Apply syntax

In JavaScript, if you wish to specify the `this` argument passed to a function, one must use either `.call` or `.apply`. GorillaScript provides the `@` syntax:

    let f() -> this
    
    let obj = {}
    obj == f@ obj
    obj == f@(obj)
    
    Array.prototype.slice@ arguments, 1

It transparently converts to `.call` or `.apply` (whichever is more appropriate), using the first argument as its `this`.

## Binding access

ECMAScript 5 supplies `Function.prototype.bind` as a way to bind functions to a specific this (and specify arguments). To do a similar binding in GorillaScript, one need only use the familiar `@` syntax with access.

    let obj = {
      f: # -> this
    }
    
    let bound = obj@.f
    bound() == obj
    let unbound = obj.f
    unbound() == window

## Classes

GorillaScript provides a way to make classical-style classes. JavaScript does not have classes normally, so GorillaScript's creation is slightly hackish, but works for the general case.

    class Animal
      def constructor(@name) ->
    
      def eat() -> "$(@name) eats"
  
    class GreatApe extends Animal
      // no constructor, Animal's is automatically called
      def eat(food="fruit") -> super.eat() & " a " & food
  
    class Gorilla extends GreatApe
      def constructor(@name, @favorite-food)
        // important to call the super constructor.
        super(@name)
    
      def eat() -> super.eat(@favorite-food)
  
    class Chimp extends GreatApe
      def eat() -> super.eat("banana")
  
    let bobo = Chimp("Bobo") // new is not required on GorillaScript-made classes
    bobo.eat() == "Bobo eats a banana"
  
    let toko = Gorilla("Toko", "cherry")
    toko.eat() == "Toko eats a cherry"
    
    // set a method on the Gorilla constructor
    Gorilla::barrel := # -> @name & " throws a barrel!"
    
    toko.barrel() == "Toko throws a barrel!"

Classes can `extend` other classes and call into their superclass with `super`. The constructor functions automatically check the `this` argument and if it is not the current class's type (such as when called without `new`), it will create a new one on-the-fly.

## Destructuring

GorillaScript, like ECMAScript 6, provides a destructuring declaration.

    let [x, y] = [1, 2]
    x == 1
    y == 2
    
    let {a, b: c} = {a: 3, b: 4}
    a == 3
    c == 4

These can be nested like so:
    
    let [a, {b, c: [d]}] = get-data()

And the spread operator (`...`) can be used once per array destructure:

    let [value, ...rest] = array

## Switch

Like JavaScript, GorillaScript provides `switch`. The only major exception is that JavaScript is fallthrough-by-default, and GorillaScript is break-by-default. GorillaScript can also specify multiple values to check at once instead of having multiple cases. `switch` can also be used as an expression.

    switch value
    case 0, 1, 2
      "small"
    case 3, 4, 5
      fallthrough // in the last position of the case, causes the case to fall through to the next case.
    case 6, 7, 8
      "large"
    default
      "unknown"

## Try-catch-else-finally

Try-catch also works similarly to JavaScript, with the notable exception of the `else` statement, for when no error was caught, but occurs before the `finally` statement.

    try
      something-dangerous()
    catch e
      uh-oh()
    else
      whew()
    finally
      cleanup()

At least one of `catch`, `else`, or `finally` must be used, but so can all three.

## Regular Expressions

Unlike JavaScript, Regular Expressions borrow the string syntax simply prefixed with `r` and postfixed with any RegExp flags deemed necessary. Also, if triple-quoted strings (e.g. `r"""reg"""g`) are used, all spaces are ignored as well as any `# hash comments`

    r"l".test "apple"
    let regex = r"""
      This is a large regex, $name
      And all the space is ignored # and this is ignored, too!
      """gim

## Custom interpolation strings

If one doesn't wish to use simple string concatenation with string interpolation, `%` can be prefixed to any double-quoted string to return an array instead which can then be interpolated in a custom manner. All even-numbered strings are guaranteed to be source literals and all odd-numbered values (might not be strings) are interpolated input.

The following is an example of automatic HTML escaping, but the same concept could be applied to SQL strings or practically any string with unsafe input.

    class SafeHTML
      def constructor(@text as String) ->
      def to-string() -> @text
    let to-HTML = do
      let escapes = {
        "&": "&amp;"
        "<": "&lt;"
        ">": "&gt;"
        '"': "&quot;"
        "'": "&#39;"
      }
      let replacer(x) -> escapes[x]
      let regex = r"[&<>""']"g
      let escape(text) -> text.replace(regex, replacer)
      #(arr)
        (for x, i in arr
          if i %% 2 or x instanceof SafeHTML
            x
          else
            escape String(x)).join ""

    eq "<h1>normal</h1>", to-HTML %"<h1>normal</h1>"
    let evil-name = "<\"bob\" the 'great' & powerful>"
    eq "&lt;&quot;bob&quot; the &#39;great&#39; &amp; powerful&gt;", to-HTML %"$evil-name"
    eq "<span>&lt;&quot;bob&quot; the &#39;great&#39; &amp; powerful&gt;</span>", to-HTML %"<span>$evil-name</span>"
    eq "<span><\"bob\" the 'great' & powerful></span>", to-HTML %"<span>$(SafeHTML evil-name)</span>"

## Iterators

Iterators are an ECMAScript 6 feature that have been in Mozilla's JavaScript since 1.7. GorillaScript can both produce and consume such iterators.

    for value, index from some-iterable
      console.log value

Turns into the following code:

    let _iter = some-iterable.iterator()
    try
      let mutable index = -1
      while true
        index += 1
        let value = try
          _iter.next()
        catch e
          if e == StopIteration
            break
          else
            throw e
        console.log value
    finally
      _iter?.close?()

Which means that any object that implements the `iterator` method acts as an iterable. That return value merely needs to implement the `next` method, and optionally a `close` method.

If `Array.prototype` were to implement `iterator`, which the ECMAScript 6 draft is recommending, one could iterate over `Array`s, `Set`s, `Map`s, but one can iterate over any custom type now or by simply adding an `Array.prototype.iterator` method.

Production of iterators is easy as well in GorillaScript. You need merely append the `*` and use the `yield` statement.

    let fib()*
      let mutable a = 0
      let mutable b = 1
      while true
        yield b
        let tmp = a
        a := b
        b += tmp

Produces an iterable which returns the infinite sequence of fibonacci numbers. The resultant code looks something along the lines of:

    let fib()
      let mutable a = 0
      let mutable b = 1
      let mutable _state = 0
      {
        iterator: #-> this
        next: #
          while true
            switch _state
            case 0
              _state := 1
              return b
            case 1
              let tmp = a
              a := b
              b += tmp
              _state := 0
      }

The state machine is made for you and any GorillaScript construct can be used inside a generator function (except for `return`).

One could then easily then use the fib iterator:

    for value from fib()
      console.log value
      if value > 4000000
        break
