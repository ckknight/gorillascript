let {expect} = require 'chai'

let has-name = do
  let func() ->
  func.name == "func"

describe "classes", #
  it "empty class", #
    let Class = class
  
    expect(Class).to.be.a \function
    expect(Class).to.have.length(0)
    expect(new Class()).to.be.an.instanceof(Class)
    expect(Class()).to.be.an.instanceof(Class)

  it "empty class, two-level inheritance", #
    let Base = class
    let Child = class extends Base

    expect(Child).to.be.a \function
    expect(Child).to.have.length(0)
    expect(new Child()).to.be.an.instanceof(Child)
    expect(Child()).to.be.an.instanceof(Child)
    expect(new Child()).to.be.an.instanceof(Base)
    expect(Child()).to.be.an.instanceof(Base)

  it "simple class, empty constructor", #
    let Class = class
      def constructor() ->
  
    expect(Class).to.be.a \function
    expect(new Class()).to.be.an.instanceof(Class)

  it "simple class, simple constructor", #
    let mutable hit-constructor = false
    let Class = class
      def constructor()
        hit-constructor := true
  
    expect(Class).to.be.a \function
    expect(hit-constructor).to.be.false
    expect(new Class()).to.be.an.instanceof(Class)
    expect(hit-constructor).to.be.true

  it "empty class, two-level inheritance, base constructor is hit", #
    let mutable hit-constructor = false
    let Base = class
      def constructor()
        hit-constructor := true
    let Child = class extends Base

    expect(Child).to.be.a \function
    expect(Child).to.have.length(0)
    expect(hit-constructor).to.be.false
    expect(new Child()).to.be.an.instanceof(Child)
    expect(hit-constructor).to.be.true
    expect(new Child()).to.be.an.instanceof(Base)

  it "calling super from child constructor", #
    let mutable hit-constructor = false
    let Base = class
      def constructor()
        hit-constructor := true
    let Child = class extends Base
      def constructor()
        super()

    expect(Child).to.be.a \function
    expect(Child).to.have.length(0)
    expect(hit-constructor).to.equal false
    new Child()
    expect(hit-constructor).to.equal true

  it "simple class with members", #
    let Class = class
      def method(...args)
        [this, args]
  
    let obj = new Class
    expect(obj).to.be.an.instanceof(Class)
    expect(obj.method()).to.eql [obj, []]
    expect(obj.method \alpha).to.eql [obj, [\alpha]]
    expect(obj.method \alpha, \bravo).to.eql [obj, [\alpha, \bravo]]

  it "calling super from a child method", #
    let Base = class
      def method(...args) -> [this, args]
      def other(value) -> value + 1

    expect(Base).to.be.a \function
    let base = new Base()
    expect(base.method()).to.eql [base, []]
    expect(base.method \alpha).to.eql [base, [\alpha]]
    expect(base.method \alpha, \bravo).to.eql [base, [\alpha, \bravo]]
    expect(base.other(4)).to.equal 5

    let Child = class extends Base
      def other(value) -> super.other(value) + 1

    expect(Child).to.be.a \function
    let child = new Child()
    expect(child.method()).to.eql [child, []]
    expect(child.method(\alpha)).to.eql [child, [\alpha]]
    expect(child.method(\alpha, \bravo)).to.eql [child, [\alpha, \bravo]]
    expect(child.other(3)).to.equal 5

  it "class can have private static variables", #
    let calls = 5
    let Class = class
      let mutable calls = 0
      def hello()
        calls += 1
        "Hello: $calls"
  
    expect((new Class).hello()).to.equal "Hello: 1"
    expect((new Class).hello()).to.equal "Hello: 2"
    expect(calls).to.equal 5

  it "class with logic in declaration", #
    let make(value)
      let Class = class
        if value
          def name() -> "alpha"
        else
          def name() -> "bravo"
      Class
  
    let Alpha = make(true)
    let Bravo = make(false)
    expect(new Alpha().name()).to.equal "alpha"
    expect(new Bravo().name()).to.equal "bravo"

  it "calling super and passing along all arguments", #
    let Base = class
      def thing(...args) -> [this, args]

    let Child = class extends Base
      def thing(...args) -> [this, args, super.thing(...args)]
  
    let child = new Child
    expect(child.thing()).to.eql [child, [], [child, []]]
    expect(child.thing("alpha")).to.eql [child, ["alpha"], [child, ["alpha"]]]
    expect(child.thing("alpha", "bravo")).to.eql [child, ["alpha", "bravo"], [child, ["alpha", "bravo"]]]

  it "public static members", #
    let NoCtor = class
      @static := "alpha"
  
    expect(NoCtor.static).to.equal "alpha"
    expect((new NoCtor).static).to.equal void
  
    let WithCtor = class
      def constructor() ->
      @static := "bravo"
  
    expect(WithCtor.static).to.equal "bravo"
    expect((new WithCtor).static).to.equal void
  
    let WithLateCtor = class
      @static := "charlie"
      def constructor() ->
  
    expect(WithLateCtor.static).to.equal "charlie"
    expect((new WithLateCtor).static).to.equal void

  it "nested classes", #
    let Outer = class
      def constructor()
        @label := "Outer"
    
      def method() -> "from outer"
    
      @Inner := class
        def constructor()
          @label := "Inner"
      
        def method() -> "from inner"

    expect((new Outer).label).to.equal "Outer"
    expect(new Outer().label).to.equal "Outer"
    expect((new Outer).method()).to.equal "from outer"
    expect(new Outer().method()).to.equal "from outer"
    expect((new Outer.Inner).label).to.equal "Inner"
    expect(new Outer.Inner().label).to.equal "Inner"
    expect((new Outer.Inner).method()).to.equal "from inner"
    expect(new Outer.Inner().method()).to.equal "from inner"

  it "named nested classes", #
    class Outer
      def constructor()
        @label := "Outer"
    
      def method() -> "from outer"
    
      class @Inner
        def constructor()
          @label := "Inner"
      
        def method() -> "from inner"

    expect((new Outer).label).to.equal "Outer"
    expect(new Outer().label).to.equal "Outer"
    expect((new Outer).method()).to.equal "from outer"
    expect(new Outer().method()).to.equal "from outer"
    expect((new Outer.Inner).label).to.equal "Inner"
    expect(new Outer.Inner().label).to.equal "Inner"
    expect((new Outer.Inner).method()).to.equal "from inner"
    expect(new Outer.Inner().method()).to.equal "from inner"
    if has-name
      expect(Outer.name).to.equal "Outer"
      expect(Outer.Inner.name).to.equal "Inner"

  it "Nested inheritance", #
    let Outer = class
      def constructor()
        @label := "Outer"
    
      def outer() -> "outer"
      def method() -> "from outer"
    
      @Inner := class extends this
        def constructor()
          @label := "Inner"
    
        def method() -> "from inner"

    expect((new Outer).label).to.equal "Outer"
    expect(new Outer().label).to.equal "Outer"
    expect((new Outer).method()).to.equal "from outer"
    expect(new Outer().method()).to.equal "from outer"
    expect((new Outer).outer()).to.equal "outer"
    expect(new Outer().outer()).to.equal "outer"
    expect((new Outer.Inner).label).to.equal "Inner"
    expect(new Outer.Inner().label).to.equal "Inner"
    expect((new Outer.Inner).method()).to.equal "from inner"
    expect(new Outer.Inner().method()).to.equal "from inner"
    expect((new Outer.Inner).outer()).to.equal "outer"
    expect(new Outer.Inner().outer()).to.equal "outer"
    expect(new Outer.Inner()).to.be.an.instanceof(Outer.Inner)
    expect(new Outer.Inner()).to.be.an.instanceof(Outer)
    expect(new Outer()).to.be.an.instanceof(Outer)
    expect(new Outer()).to.not.be.an.instanceof(Outer.Inner)

  it "a four-level inheritance chain", #
    let Base = class
      def constructor(name)
        @name := name
    
      def bark() -> "arf"
    
      @static := "static"
  
    expect(Base).to.have.length(1)
    expect(Base.static).to.equal "static"
    expect(new Base("name").name).to.equal "name"
    expect(new Base("name").bark()).to.equal "arf"
  
    let FirstChild = class extends Base
      def bark() -> "woof"
  
    expect(new FirstChild("name").name).to.equal "name"
    expect(new FirstChild("name").bark()).to.equal "woof"
  
    let SecondChild = class extends FirstChild
      def constructor(name, sign)
        super(name)
        @sign := sign
  
    expect(SecondChild).to.have.length(2)
    expect(new SecondChild("name", "taurus").name).to.equal "name"
    expect(new SecondChild("name", "taurus").sign).to.equal "taurus"
    expect(new SecondChild("name", "taurus").bark()).to.equal "woof"
  
    let ThirdChild = class extends SecondChild
      def bark(name)
        super.bark() & ", " & name
  
    expect(new ThirdChild("name", "taurus").name).to.equal "name"
    expect(new ThirdChild("name", "taurus").sign).to.equal "taurus"
    expect(new ThirdChild("name", "taurus").bark("sammy")).to.equal "woof, sammy"

  it "spread constructor", #
    let Class = class
      def constructor(...args)
        @args := args
  
    expect(Class).to.have.length(0)
    expect(new Class("alpha", "bravo", "charlie").args).to.eql ["alpha", "bravo", "charlie"]
    let arr = [1, 2, 3]
    expect(new Class(...arr)).to.be.an.instanceof(Class)
    expect(new Class(...arr).args).to.eql arr

  it "class with JS-keyword properties as method names", #
    let Class = class
      def if() -> true
      def while = true
  
    expect(new Class().if()).to.equal true
    expect(new Class().while).to.equal true

  it "class with literal string names", #
    let Class = class
      def "method" = #-> "method"
      def "other method" = #-> "other method"

    let obj = new Class
    expect(obj).to.be.an.instanceof(Class)
    expect(obj.method()).to.equal "method"
    expect(obj["other method"]()).to.equal "other method"

  it "namespaced classes don't reserve their name outside their scope", #
    let alpha = {}
    let bravo = {}
  
    alpha.Monkey := class
      @label := "alpha"
  
    bravo.Monkey := class
      @label := "bravo"
  
    expect(typeof eval "Monkey").to.equal "undefined"
    expect(alpha.Monkey.label).to.equal "alpha"
    expect(bravo.Monkey.label).to.equal "bravo"

  it "class factory", #
    let makeClass(superClass)
      class extends superClass
        def fun()
          super.fun() & " B"
  
    let Base = class
      def fun() -> "A"
  
    let Child = makeClass(Base)
    expect(new Child().fun()).to.equal "A B"

  it "named class", #
    class Class
      def method() -> "result"
      @static := "hello"
  
    expect(Class).to.be.a \function
    expect(Class).to.have.length(0)
    expect(Class.display-name).to.equal "Class"
    expect(new Class).to.be.an.instanceof(Class)
    expect(new Class().method()).to.equal "result"
    expect(Class.static).to.equal "hello"
    if has-name
      expect(Class.name).to.equal "Class"

  it "namespaced named classes", #
    let alpha = {}
    let bravo = {}
  
    class alpha.Monkey
      @label := "alpha"
  
    class bravo.Monkey
      @label := "bravo"
  
    expect(typeof eval "Monkey").to.equal "undefined"
    expect(alpha.Monkey.label).to.equal "alpha"
    expect(bravo.Monkey.label).to.equal "bravo"
    expect(alpha.Monkey.display-name).to.equal "Monkey"
    expect(bravo.Monkey.display-name).to.equal "Monkey"
    if has-name
      expect(alpha.Monkey.name).to.equal "Monkey"
      expect(bravo.Monkey.name).to.equal "Monkey"

  it "named class as an expression rather than a statement", #
    let Alpha = class Bravo
      def method() -> "blah"
  
    expect(Bravo).to.equal Alpha
    expect(Alpha.display-name).to.equal "Bravo"
    expect(new Alpha).to.be.an.instanceof(Bravo)
    expect(new Bravo).to.be.an.instanceof(Alpha)
    if has-name
      expect(Alpha.name).to.equal "Bravo"

  it "named class with inheritance", #
    class Alpha
      def method() -> "alpha"
  
    class Bravo extends Alpha
      def method()
        "$(super.method()) bravo"
  
    expect(new Alpha().method()).to.equal "alpha"
    expect(new Bravo().method()).to.equal "alpha bravo"
    if has-name
      expect(Alpha.name).to.equal "Alpha"
      expect(Bravo.name).to.equal "Bravo"

  it "namespaced named class with inheritance", #
    class Base
      def method() -> "base"
  
    let alpha = {}
    let bravo = {}
  
    class alpha.Child extends Base
      def method()
        "$(super.method()) alpha"
  
    class bravo.Child extends Base
      def method()
        "$(super.method()) bravo"
  
    expect(new alpha.Child().method()).to.equal "base alpha"
    expect(new bravo.Child().method()).to.equal "base bravo"
    if has-name
      expect(Base.name).to.equal "Base"
      expect(alpha.Child.name).to.equal "Child"
      expect(bravo.Child.name).to.equal "Child"

  it "class with calculated method names", #
    class Class
      for i in 1 til 4
        def ["method" & i] = #-> i
  
    let obj = new Class()
    expect(obj.method1()).to.equal 1
    expect(obj.method2()).to.equal 2
    expect(obj.method3()).to.equal 3

  it "class with interpolated method names", #
    class Class
      for i in 1 til 4
        def "method$i" = #-> i
  
    let obj = new Class()
    expect(obj.method1()).to.equal 1
    expect(obj.method2()).to.equal 2
    expect(obj.method3()).to.equal 3

  it "calling class without new returns correct class", #
    class Class
  
    expect(Class()).to.be.an.instanceof(Class)
  
    let anon = class
  
    expect(anon()).to.be.an.instanceof(anon)

  it "calling class without new doesn't throw an error with constructor", #
    class Class
      def constructor() ->
  
    expect(Class()).to.be.an.instanceof(Class)
    expect(new Class()).to.be.an.instanceof(Class)
  
    let anon = class
      def constructor() ->
  
    expect(anon()).to.be.an.instanceof(anon)
    expect(new anon()).to.be.an.instanceof(anon)

  it "multiple constructors", #
    let makeClass(value) -> class Class
      @static := value // occurring before the constructor
      if value
        def constructor()
          @value := true
      else
        def constructor()
          @value := false

    let truthy = makeClass(true)
    let falsy = makeClass(false)
    expect(new truthy().value).to.be.true
    expect(new falsy().value).to.be.false
    expect(truthy.display-name).to.equal "Class"
    expect(falsy.display-name).to.equal "Class"
    expect(truthy.static).to.be.true
    expect(falsy.static).to.be.false

  it "bound constructors", #
    class Class
      def constructor(value)
        @value := value
  
    expect(Class("alpha")).to.be.an.instanceof(Class)
    expect(new Class("bravo")).to.be.an.instanceof(Class)
    expect(Class("charlie").value).to.equal "charlie"
    expect(new Class("delta").value).to.equal "delta"

  it "constructor set to other function", #
    class Class
      let ctor(value)
        @value := value
        return
      def constructor = ctor
  
    expect(new Class()).to.be.an.instanceof(Class)
    expect(new Class("alpha").value).to.equal "alpha"

  it "constructor set to mutable function, later changed.", #
    class Class
      let mutable ctor = #(value)
        @value := value
        return
      def constructor = ctor
      ctor := null
  
    expect(new Class()).to.be.an.instanceof(Class)
    expect(new Class("alpha").value).to.equal "alpha"

  it "constructor set to provided function", #
    let make(ctor) -> class
      def constructor = ctor
  
    let Class = make #(value) -> do
      @value := value
      return
  
    expect(new Class()).to.be.an.instanceof(Class)
    expect(new Class("alpha").value).to.equal "alpha"

  it "bound static methods", #
    let obj = {}
  
    class Class
      def constructor(@id) ->
    
      @new := #@ -> new this(obj)
  
    expect(Class.new()).to.be.an.instanceof(Class)
    expect(Class.new().id).to.equal obj

  it "extending expressions rather than simple accesses", #
    class Base
  
    let id(x) -> x
  
    class Child extends id Base
  
    expect(new Child).to.be.an.instanceof(Child)
    expect(new Child).to.be.an.instanceof(Base)

  it "Named class that is a reserved word", #
    let obj = {}
  
    class obj.if
  
    expect(new obj.if).to.be.an.instanceof(obj.if)
    //expect(obj.if.display-name).to.equal "if"


  it "constructor with this setters", #
    class Class
      def constructor(@alpha, @bravo) ->
  
    expect(new Class("charlie", "delta")).to.be.an.instanceof(Class)
    expect(new Class("charlie", "delta").alpha).to.equal "charlie"
    expect(new Class("charlie", "delta").bravo).to.equal "delta"

  it "bound constructor with this setters", #
    class Class
      def constructor(@alpha, @bravo) ->
  
    delete GLOBAL.alpha
    expect(Class("charlie", "delta")).to.be.an.instanceof(Class)
    expect(GLOBAL not ownskey "alpha").to.be.true
    expect(Class("charlie", "delta").alpha).to.equal "charlie"
    expect(Class("charlie", "delta").bravo).to.equal "delta"

  it "using super without having a superclass should direct to Object", #
    class Class
      def constructor(@value) ->
      def has(key)
        super.hasOwnProperty(key)
  
    expect(new Class).to.be.an.instanceof(Class)
    expect(new Class).to.be.an.instanceof(Object)
    expect(new Class().has("value")).to.be.true

  it "default value on method", #
    class Class
      def method(value = "hello")
        value
  
    expect(new Class).to.be.an.instanceof(Class)
    expect(new Class().method()).to.equal "hello"
    expect(new Class().method("there")).to.equal "there"

  it "type checking on method", #
    class Class
      def method(value as String)
        value
  
    expect(new Class).to.be.an.instanceof(Class)
    expect(new Class().method("hello")).to.equal "hello"
    expect(new Class().method("there")).to.equal "there"
    expect(#-> new Class().method()).throws(TypeError)
    expect(#-> new Class().method(void)).throws(TypeError)
    expect(#-> new Class().method(null)).throws(TypeError)
    expect(#-> new Class().method(0)).throws(TypeError)
    expect(#-> new Class().method({})).throws(TypeError)
    expect(#-> new Class().method([])).throws(TypeError)

  it "Empty definition turns into not implemented", #
    class Class
      def method
  
    expect(#-> new Class().method()).throws(Error, "Not implemented: Class.method()")

  it "Immediate new call of a class", #
    let object = new class
  
    expect(object).to.be.an \object

  it "Class with a curried constructor", #
    class Class
      def constructor(@a, @b, @c)^ ->
  
    expect(Class.display-name).to.equal "Class"
    if has-name
      expect(Class.name).to.equal "Class"
  
    expect(Class(1, 2, 3)).to.be.an.instanceof(Class)
    expect(new Class(1, 2, 3)).to.be.an.instanceof(Class)
    expect(Class(1, 2, 3).a).to.equal 1
    expect(Class(1, 2, 3).b).to.equal 2
    expect(Class(1, 2, 3).c).to.equal 3
  
    let f = Class(1)
    expect(f).to.be.a \function
    expect(f(2, 3)).to.be.an.instanceof(Class)
    expect(new f(2, 3)).to.be.an.instanceof(Class)
    let obj = { extends Class.prototype }
    expect(f@(obj, 2, 3)).to.equal obj
    expect(obj.a).to.equal 1
    expect(obj.b).to.equal 2
    expect(obj.c).to.equal 3
  
    let g = f(2)
    expect(g).to.be.a \function
    expect(g(3)).to.be.an.instanceof(Class)
    expect(new g(3)).to.be.an.instanceof(Class)
    expect(g(3).a).to.equal 1
    expect(g(3).b).to.equal 2
    expect(g(3).c).to.equal 3
    expect(g(4).c).to.equal 4

  it "Generic class", #
    class Class<T>
      def constructor(@value as T) ->

    let x = {Class}
  
    expect(Class<String>("hello")).to.be.an.instanceof(Class<String>)
    expect(Class<String>("hello")).to.not.be.an.instanceof(Class) // they're two separate classes
    expect(x.Class<String>("hello")).to.be.an.instanceof(x.Class<String>)
    expect(new Class<String>("hello")).to.be.an.instanceof(Class<String>)
    expect(new x.Class<String>("hello")).to.be.an.instanceof(x.Class<String>)
    expect(Class<String>("hello").value).to.equal "hello"
    expect(Class<String>.display-name).to.equal "Class<String>"
    expect(Class<Number>.display-name).to.equal "Class<Number>"
  
    expect(Class("hello")).to.be.an.instanceof(Class)
    expect(Class("hello")).to.not.be.an.instanceof(Class<String>) // no guarantee there
    expect(Class(1234)).to.be.an.instanceof(Class)
    expect(Class({})).to.be.an.instanceof(Class)
    expect(Class("hello").value).to.equal "hello"
    expect(Class(1234).value).to.equal 1234
    expect(Class(x).value).to.equal x
    expect(Class<null>).to.equal Class
    expect(Class<void>).to.equal Class
    expect(Class.display-name).to.equal "Class<>"

  it "Generic class extending normal class", #
    class Base
      def alpha() -> "Base.alpha()"
      def bravo() -> "Base.bravo()"
  
    class Child<T> extends Base
      def bravo() -> "Child.bravo(), not $(super.bravo())"
      def charlie(value as T) -> "Child.charlie($(String value))"
  
    let x = Child<Number>()
    expect(x).to.be.an.instanceof(Base)
    expect(x).to.be.an.instanceof(Child<Number>)
    expect(x.alpha()).to.equal "Base.alpha()"
    expect(x.bravo()).to.equal "Child.bravo(), not Base.bravo()"
    expect(x.charlie(1234)).to.equal "Child.charlie(1234)"
    expect(#-> x.charlie("hello")).throws TypeError

  it "Generic class extending generic class", #
    class Base<T>
      def alpha(value as T) -> "Base.alpha($(String value))"
      def bravo(value as T) -> "Base.bravo($(String value))"
  
    class Child<T> extends Base<T>
      def bravo(value as T) -> "Child.bravo($(String value)), not $(super.bravo value)"
      def charlie(value as T) -> "Child.charlie($(String value))"
  
    let x = Child<Number>()
    expect(x).to.be.an.instanceof(Base<Number>)
    expect(x).to.be.an.instanceof(Child<Number>)
    expect(x.alpha(1234)).to.equal "Base.alpha(1234)"
    expect(#-> x.alpha("hello")).throws TypeError
    expect(x.bravo(1234)).to.equal "Child.bravo(1234), not Base.bravo(1234)"
    expect(#-> x.bravo("hello")).throws TypeError
    expect(x.charlie(1234)).to.equal "Child.charlie(1234)"
    expect(#-> x.charlie("hello")).throws TypeError

  it "Normal class extending generic class", #
    class Base<T>
      def alpha(value as T) -> "Base.alpha($(String value))"
      def bravo(value as T) -> "Base.bravo($(String value))"
  
    class Child extends Base<Number>
      def bravo(value as Number) -> "Child.bravo($(String value)), not $(super.bravo value)"
      def charlie(value as Number) -> "Child.charlie($(String value))"
  
    let x = Child()
    expect(x).to.be.an.instanceof(Base<Number>)
    expect(x).to.be.an.instanceof(Child)
    expect(x.alpha(1234)).to.equal "Base.alpha(1234)"
    expect(#-> x.alpha("hello")).throws TypeError
    expect(x.bravo(1234)).to.equal "Child.bravo(1234), not Base.bravo(1234)"
    expect(#-> x.bravo("hello")).throws TypeError
    expect(x.charlie(1234)).to.equal "Child.charlie(1234)"
    expect(#-> x.charlie("hello")).throws TypeError

  it "Generic class with two arguments", #
    class Dict<TKey, TValue>
      def constructor()
        @keys := []
        @values := []
    
      def get(key as TKey, fallback as TValue|void) as TValue|void
        let index = @keys.index-of key
        if index == -1
          fallback
        else
          @values[index]
    
      def set(key as TKey, value as TValue)!
        let keys = @keys
        let mutable index = keys.index-of key
        if index == -1
          index := keys.length
          keys[index] := key
        @values[index] := value
    
      def has(key as TKey) as Boolean
        @keys.index-of(key) != -1
    
      def delete(key as TKey) as Boolean
        let keys = @keys
        let index = keys.index-of key
        if index == -1
          false
        else
          @keys.splice index, 1
          @values.splice index, 1
          true
  
    let number-to-string = Dict<Number, String>()
    expect(number-to-string.get(10)).to.equal void
    expect(#-> number-to-string.get("hello")).throws(TypeError)
    expect(#-> number-to-string.get(10, true)).throws(TypeError)
    number-to-string.set(1, "one")
    number-to-string.set(2, "two")
    number-to-string.set(3, "three")
    expect(#-> number-to-string.set(4, false)).throws(TypeError)
    expect(number-to-string.get(1)).to.equal "one"
    expect(number-to-string.get(2)).to.equal "two"
    expect(number-to-string.get(3)).to.equal "three"
    expect(number-to-string.get(4, "unknown")).to.equal "unknown"
    expect(number-to-string.has(1)).to.be.true
    expect(number-to-string.has(10)).to.be.false
    expect(#-> number-to-string.has(true)).throws(TypeError)
    expect(number-to-string.delete(1)).to.be.true
    expect(#-> number-to-string.delete(true)).throws(TypeError)
    expect(number-to-string.has(1)).to.be.false
    expect(number-to-string.delete(1)).to.be.false
    expect(Dict<Number, String>.display-name).to.equal "Dict<Number, String>"
  
    let boolean-to-any = Dict<Boolean, null>()
    boolean-to-any.set(true, "yes")
    boolean-to-any.set(false, 0)
    expect(boolean-to-any.get(true)).to.equal "yes"
    expect(boolean-to-any.get(false)).to.equal 0
    boolean-to-any.set(true, number-to-string)
    expect(boolean-to-any.get(true)).to.equal number-to-string
    expect(Dict<Boolean, null>.display-name).to.equal "Dict<Boolean, >"

  it "Generic class with generic class as arg", #
    class Class<T>
      def constructor(@value as T) ->
  
    let x = Class<String>("hello")
    expect(x.value).to.equal "hello"
    let y = Class<Class<String>>(x)
    expect(y.value).to.equal x
    let z = Class(y)
    expect(z.value).to.equal y
  
    expect(Class<String>.display-name).to.equal "Class<String>"
    expect(Class<Class<String>>.display-name).to.equal "Class<Class<String>>"
    expect(Class.display-name).to.equal "Class<>"

  it "Class with generic method", #
    class Class
      def run<T>(val as T) -> val
  
    let o = Class()
    expect(o.run("Hello")).to.equal "Hello"
    expect(o.run(1234)).to.equal 1234
    expect(o.run<String>("Hello")).to.equal "Hello"
    expect(o.run<Number>(1234)).to.equal 1234
    expect(#-> o.run<String>(1234)).throws TypeError, "Expected val to be a String, got Number"

  it "Generic class with generic method", #
    class Class<T>
      def run<U>(x as T, y as U) -> {x, y}
  
    let check(expected-x, expected-y, actual)
      expect(actual.x).to.equal expected-x
      expect(actual.y).to.equal expected-y
  
    check "one", 1, Class<String>().run<Number>("one", 1)
    check "yes", true, Class<String>().run<Boolean>("yes", true)
    check check, Class, Class<Function>().run<Function>(check, Class)
    expect(#-> Class<String>().run<Number>(1234, 1234)).throws TypeError, "Expected x to be a String, got Number"
    expect(#-> Class<String>().run<Number>("Hello", "There")).throws TypeError, "Expected y to be a Number, got String"
  
  it "calls .extended on its superclass", #
    class Base
      @children := []
      @extended := #(child as ->)
        expect(child.prototype).to.be.an.instanceof Base
        expect(child::constructor).to.equal child
        @children.push child
    
    expect(Base.children).to.eql []
    
    class Child extends Base
      expect(Base.children).to.eql [Child]
    
    expect(Base.children).to.eql [Child]
    
    class OtherChild extends Base
      expect(Base.children).to.eql [Child, OtherChild]
    
    expect(Base.children).to.eql [Child, OtherChild]
