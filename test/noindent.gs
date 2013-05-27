let {expect} = require 'chai'
let gorilla = require '../index'

describe "compilation without indentation", #
  it "works with a series of statements that wouldn't be indented", #
    expect(gorilla.eval-sync """
    let mutable a = 0
    let b = 2
    a += b
    a *= b
    a ^= b
    a
    """, noindent: true).to.equal 16
  
  it "works with a series of statements with improper indentation", #
    expect(gorilla.eval-sync """
    let mutable a = 0
      let b = 2
    a += b
        a *= b
    a ^= b
      a
    """, noindent: true).to.equal 16
  
  it "allows function declarations", #
    expect(gorilla.eval-sync """
    let f():
    "hello"
    end
    f()
    """, noindent: true).to.equal "hello"
  
  it "allows for a single-line function declaration", #
    expect(gorilla.eval-sync """
    let f() -> "hello"
    f()
    """, noindent: true).to.equal "hello"
  
  it "allows for anonymous functions to be used in expressions", #
    expect(gorilla.eval-sync """
    let call(f) -> f()
    call #:
    "hello"
    end
    """, noindent: true).to.equal "hello"
  
  it "allows for do blocks", #
    expect(gorilla.eval-sync """
    do:
    "hello"
    end
    """, noindent: true).to.equal "hello"
  
  it "allows if expressions", #
    expect(gorilla.eval-sync """
    let same(q) -> q
    let x = 5
    same(if x == 5 then "yes" else "no")
    """, noindent: true).to.equal "yes"
    
    expect(gorilla.eval-sync """
    let same(q) -> q
    let x = 6
    same(if x == 5 then "yes" else "no")
    """, noindent: true).to.equal "no"
  
  it "allows if statements", #
    expect(gorilla.eval-sync """
    let x = 5
    if x == 5:
    "yes"
    end
    """, noindent: true).to.equal "yes"
  
  it "allows if-else statements", #
    expect(gorilla.eval-sync """
    let x = 5
    if x == 6:
    "yes"
    else:
    "no"
    end
    """, noindent: true).to.equal "no"

  it "allows for C-style for loops", #
    expect(gorilla.eval-sync """
    let mutable i = 0
    let mutable sum = 0
    for ; i < 10; i += 1:
    sum += i
    end
    sum
    """, noindent: true).to.equal 45
  
  it "allows while loops", #
    expect(gorilla.eval-sync """
    let mutable i = 0
    let mutable sum = 0
    while i < 10, i += 1:
    sum += i
    end
    sum
    """, noindent: true).to.equal 45
  
  it "allows for-in loops", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    for x in [1, 2, 3]:
    sum += x
    end
    sum
    """, noindent: true).to.equal 6
  
  it "allows single-line for-in loops", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    for x in [1, 2, 3]; sum += x; end
    sum
    """, noindent: true).to.equal 6

  it "allows for-in-else loops", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    let arr = [1, 2, 3]
    for x in arr:
    sum += x
    else:
    throw Error()
    end
    sum
    """, noindent: true).to.equal 6
  
    expect(gorilla.eval-sync """
    let mutable sum = 0
    let arr = []
    for x in arr:
    sum += x
    else:
    return "none"
    end
    sum
    """, noindent: true).to.equal "none"

  it "allows for-from loops", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    for x from [1, 2, 3]:
    sum += x
    end
    sum
    """, noindent: true).to.equal 6

  it "allows for-from loops, single-line", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    for x from [1, 2, 3]; sum += x; end
    sum
    """, noindent: true).to.equal 6

  it "allows for-from-else loops", #
    expect(gorilla.eval-sync """
    let mutable sum = 0
    let arr = [1, 2, 3]
    for x from arr:
    sum += x
    else:
    throw Error()
    end
    sum
    """, noindent: true).to.equal 6
  
    expect(gorilla.eval-sync """
    let mutable sum = 0
    let arr = []
    for x from arr:
    sum += x
    else:
    return "none"
    end
    sum
    """, noindent: true).to.equal "none"

  it "allows try statements", #
    expect(gorilla.eval-sync """
    let o = {}
    try:
    throw o
    catch e:
    "caught"
    else:
    return "nope"
    end
    """, noindent: true).to.equal "caught"

    expect(gorilla.eval-sync """
    let o = {}
    try:
    o.blah := true
    catch e:
    "caught"
    else:
    return "nope"
    end
    """, noindent: true).to.equal "nope"

  it "allows switch statements", #
    expect(gorilla.eval-sync """
    let x = 4
    switch x
    case 0, 1:
      "alpha"
    case 2, 3; "bravo"
    case 4; "charlie"
    end
    """, noindent: true).to.equal "charlie"
  
    expect(gorilla.eval-sync """
    let x = 5
    switch x
    case 0, 1:
      "alpha"
    case 2, 3; "bravo"
    case 4; "charlie"
    default:
      "delta"
    end
    """, noindent: true).to.equal "delta"

  it "allows topicless switch statements", #
    expect(gorilla.eval-sync """
    let x = 2
    switch
    case x == 0:
      "alpha"
    case x == 1; "bravo"
    case x == 2; "charlie"
    end
    """, noindent: true).to.equal "charlie"
  
    expect(gorilla.eval-sync """
    let x = 3
    switch x
    case x == 0:
      "alpha"
    case x == 1; "bravo"
    case x == 2; "charlie"
    default:
      "delta"
    end
    """, noindent: true).to.equal "delta"

  it "allows macros", #
    expect(gorilla.eval-sync '''
    macro double(value):
    ASTE $value * 2
    end
    double 5
    ''', noindent: true).to.equal 10
  
    expect(gorilla.eval-sync '''
    macro boom:
    syntax "goes", "the", "dynamite":
    ASTE "BOOM!"
    end
    end
    boom goes the dynamite
    ''', noindent: true).to.equal "BOOM!"

  it "allows improperly indented array literals", #
    expect(gorilla.eval-sync """
    let arr = [1
    2, 3
          4
    5]
    arr.length""", noindent: true).to.equal 5

  it "allows improperly indented object literals", #
    expect(gorilla.eval-sync """
    let obj = { a: 1
      b: 2
    c: 3
          d: 4
      e: 5
    }
    obj.d""", noindent: true).to.equal 4

  it "allows unclosed object literals", #
    expect(gorilla.eval-sync """
    let obj = a: 1, b: 2, c: 3
    obj.b""", noindent: true).to.equal 2

  it "allows do blocks in do blocks", #
    expect(gorilla.eval-sync """
    let a = 1
    do:
    let b = 2
    do:
    a + b
    end
    end""", noindent: true).to.equal 3

  it "allows async macro use", #
    expect(gorilla.eval-sync """
    let f(cb) -> cb "hello"
    async x <- f()
    x
    """, noindent: true).to.equal "hello"

  it "allows async macro use in a do block", #
    expect(gorilla.eval-sync """
    let f(cb) -> cb "hello"
    do:
    async x <- f()
    x
    end
    """, noindent: true).to.equal "hello"
