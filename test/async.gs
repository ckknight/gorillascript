let {expect} = require 'chai'
let {stub, spy} = require 'sinon'

let now(...args, cb) -> cb ...args
let soon(...args, cb) -> set-immediate cb, ...args

describe "async statement", #
  it "receives expected values", #(cb)
    async x, y, z <- soon(\a, \b, \c)
    expect(x).to.equal \a
    expect(y).to.equal \b
    expect(z).to.equal \c
    cb()
  
  it "preserves this", #(cb)
    let f()
      let self = this
      async <- soon()
      expect(this).to.equal self
      cb()
    f@ {}

describe "async! statement", #
  it "calls the provided function if an existing argument is provided", #(cb)
    let err = spy()
    let handler(x)
      expect(x).to.equal err
      cb()
    async! handler <- soon(err)
    throw Error "never reached"
  
  it "does not call the provided function if an existing argument is not provided", #(cb)
    let handler = stub()
    async! handler <- soon null
    expect(handler).to.not.be.called
    cb()
  
  it "receives expected values", #(cb)
    let handler = stub()
    async! handler, x, y, z <- soon null, \a, \b, \c
    expect(handler).to.not.be.called
    expect(x).to.equal \a
    expect(y).to.equal \b
    expect(z).to.equal \c
    cb()
  
  it "preserves this", #(cb)
    let f()
      let handler = stub()
      let self = this
      async! handler <- soon null
      expect(handler).to.not.be.called
      expect(this).to.equal self
      cb()
    f@ {}
  
  it "throws with async! throw", #(cb)
    let err = Error()
    let f()
      async! throw <- now err
      throw Error "never reached"
    expect(f).to.throw(err)
    cb()

describe "asyncfor", #
  describe "C-style", #
    it "can count up to 45", #(cb)
      let mutable i = 0
      let mutable sum = 0
      asyncfor next, ; i < 10; i += 1
        async <- soon()
        sum += i
        next()
      expect(sum).to.equal 45
      cb()
    
    it "preserves this", #(cb)
      let f()
        let self = this
        let mutable i = 0
        asyncfor next, ; i < 10; i += 1
          expect(this).to.equal self
          async <- soon()
          expect(this).to.equal self
          next()
        cb()
      f@ {}
    
    it "breaks when an error is passed to the callback", #(cb)
      let mutable i = 0
      let err = spy()
      asyncfor e <- next, ; i < 10; i += 1
        async <- soon()
        if i == 3
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(i).to.equal(3)
      cb()
    
    it "breaks when an error is passed to the callback, if a result is expected", #(cb)
      let mutable i = 0
      let err = spy()
      asyncfor e, result <- next, ; i < 10; i += 1
        async <- soon()
        if i == 3
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(i).to.equal(3)
      expect(result).to.not.exist
      cb()
    
    it "produces an array if a result is expected", #(cb)
      let mutable i = 0
      asyncfor e, result <- next, ; i < 10; i += 1
        async <- soon()
        next null, i ^ 2
      expect(e).to.not.exist
      expect(result).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
      cb()
  
  describe "in range", #
    it "can count up to 45", #(cb)
      let mutable sum = 0
      asyncfor next, i in 0 til 10
        async <- soon()
        sum += i
        next()
      expect(sum).to.equal 45
      cb()

    it "preserves this", #(cb)
      let f()
        let self = this
        asyncfor next, i in 0 til 10
          expect(this).to.equal self
          async <- soon()
          expect(this).to.equal self
          next()
        cb()
      f@ {}

    it "breaks when an error is passed to the callback", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e <- next, i in 0 til 10
        maximum := i
        async <- soon()
        if i == 3
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(3)
      cb()

    it "breaks when an error is passed to the callback, if a result is expected", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e, result <- next, i in 0 til 10
        maximum := i
        async <- soon()
        if i == 3
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(3)
      expect(result).to.not.exist
      cb()

    it "produces an array if a result is expected", #(cb)
      asyncfor e, result <- next, i in 0 til 10
        async <- soon()
        next null, i ^ 2
      expect(e).to.not.exist
      expect(result).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
      cb()
  
  describe "in array", #
    it "can sum the values", #(cb)
      let mutable sum = 0
      asyncfor next, i in [1, 2, 4, 8]
        async <- soon()
        sum += i
        next()
      expect(sum).to.equal 15
      cb()

    it "preserves this", #(cb)
      let f()
        let self = this
        asyncfor next, i in [1, 2, 4, 8]
          expect(this).to.equal self
          async <- soon()
          expect(this).to.equal self
          next()
        cb()
      f@ {}

    it "breaks when an error is passed to the callback", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e <- next, i in [1, 2, 4, 8]
        maximum := i
        async <- soon()
        if i == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(4)
      cb()

    it "breaks when an error is passed to the callback, if a result is expected", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e, result <- next, i in [1, 2, 4, 8]
        maximum := i
        async <- soon()
        if i == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(4)
      expect(result).to.not.exist
      cb()

    it "produces an array if a result is expected", #(cb)
      asyncfor e, result <- next, i in [1, 2, 4, 8]
        async <- soon()
        next null, i ^ 2
      expect(e).to.not.exist
      expect(result).to.eql [1, 4, 16, 64]
      cb()
  
  describe "of object", #
    it "can sum the values", #(cb)
      let mutable sum = 0
      asyncfor next, k, v of { a: 1, b: 2, c: 4, d: 8 }
        async <- soon()
        sum += v
        next()
      expect(sum).to.equal 15
      cb()

    it "preserves this", #(cb)
      let f()
        let self = this
        asyncfor next, k, v of { a: 1, b: 2, c: 4, d: 8 }
          expect(this).to.equal self
          async <- soon()
          expect(this).to.equal self
          next()
        cb()
      f@ {}

    it "breaks when an error is passed to the callback", #(cb)
      let err = spy()
      asyncfor e <- next, k, v of { a: 1, b: 2, c: 4, d: 8 }
        async <- soon()
        if v == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      cb()

    it "breaks when an error is passed to the callback, if a result is expected", #(cb)
      let err = spy()
      asyncfor e, result <- next, k, v of { a: 1, b: 2, c: 4, d: 8 }
        async <- soon()
        if v == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      cb()

    it "produces an array if a result is expected", #(cb)
      asyncfor e, result <- next, k, v of { a: 1, b: 2, c: 4, d: 8 }
        async <- soon()
        next null, v ^ 2
      expect(e).to.not.exist
      expect(result.sort (<=>)).to.eql [1, 4, 16, 64]
      cb()
  
  describe "from iterator", #
    let array-to-iterator(array) -> {
      iterator: #-> this
      next: #
        if @index >= @array.length
          { done: true, value: void }
        else
          let element = @array[@index]
          @index += 1
          { done: false, value: element }
      array
      index: 0
    }
    
    it "can sum the values", #(cb)
      let mutable sum = 0
      asyncfor next, i from array-to-iterator [1, 2, 4, 8]
        async <- soon()
        sum += i
        next()
      expect(sum).to.equal 15
      cb()

    it "preserves this", #(cb)
      let f()
        let self = this
        asyncfor next, i from array-to-iterator [1, 2, 4, 8]
          expect(this).to.equal self
          async <- soon()
          expect(this).to.equal self
          next()
        cb()
      f@ {}

    it "breaks when an error is passed to the callback", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e <- next, i from array-to-iterator [1, 2, 4, 8]
        maximum := i
        async <- soon()
        if i == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(4)
      cb()

    it "breaks when an error is passed to the callback, if a result is expected", #(cb)
      let mutable maximum = 0
      let err = spy()
      asyncfor e, result <- next, i from array-to-iterator [1, 2, 4, 8]
        maximum := i
        async <- soon()
        if i == 4
          next(err)
        else
          next()
      expect(e).to.equal(err)
      expect(maximum).to.equal(4)
      expect(result).to.not.exist
      cb()

    it "produces an array if a result is expected", #(cb)
      asyncfor e, result <- next, i from array-to-iterator [1, 2, 4, 8]
        async <- soon()
        next null, i ^ 2
      expect(e).to.not.exist
      expect(result).to.eql [1, 4, 16, 64]
      cb()

describe "asyncwhile", #
  it "can count up to 45", #(cb)
    let mutable i = 0
    let mutable sum = 0
    asyncwhile next, i < 10, i += 1
      async <- soon()
      sum += i
      next()
    expect(sum).to.equal 45
    cb()
  
  it "preserves this", #(cb)
    let f()
      let self = this
      let mutable i = 0
      asyncwhile next, i < 10, i += 1
        expect(this).to.equal self
        async <- soon()
        expect(this).to.equal self
        next()
      cb()
    f@ {}
  
  it "breaks when an error is passed to the callback", #(cb)
    let mutable i = 0
    let err = spy()
    asyncwhile e <- next, i < 10, i += 1
      async <- soon()
      if i == 3
        next(err)
      else
        next()
    expect(e).to.equal(err)
    expect(i).to.equal(3)
    cb()
  
  it "breaks when an error is passed to the callback, if a result is expected", #(cb)
    let mutable i = 0
    let err = spy()
    asyncwhile e, result <- next, i < 10, i += 1
      async <- soon()
      if i == 3
        next(err)
      else
        next()
    expect(e).to.equal(err)
    expect(i).to.equal(3)
    expect(result).to.not.exist
    cb()
  
  it "produces an array if a result is expected", #(cb)
    let mutable i = 0
    asyncwhile e, result <- next, i < 10, i += 1
      async <- soon()
      next null, i ^ 2
    expect(e).to.not.exist
    expect(result).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
    cb()

describe "asyncif", #
  describe "without else", #
    it "runs the when-true clause", #(cb)
      let run(check, callback)
        let mutable in-true = false
        asyncif next, check
          async <- soon()
          in-true := true
          next()
        callback(in-true)
      async value <- run 1
      expect(value).to.be.true
      cb()
    
    it "skips the when-true clause", #(cb)
      let run(check, callback)
        let mutable in-true = false
        asyncif next, check
          async <- soon()
          in-true := true
          next()
        callback(in-true)
      async value <- run 0
      expect(value).to.be.false
      cb()
    
    it "preserves this inside and after", #(cb)
      let run(check)
        let self = this
        asyncif next, check
          expect(this).to.equal self
          next()
        expect(this).to.equal self
        cb()
      run@ {}, true
  
  describe "with else", #
    it "runs the when-true clause", #(cb)
      let run(check, callback)
        let mutable in-true = void
        asyncif next, check
          async <- soon()
          in-true := true
          next()
        else
          throw Error "Never reached"
        callback(in-true)
      async value <- run 1
      expect(value).to.be.true
      cb()

    it "runs the when-false clause", #(cb)
      let run(check, callback)
        let mutable in-true = void
        asyncif next, check
          throw Error "Never reached"
        else
          async <- soon()
          in-true := false
          next()
        callback(in-true)
      async value <- run 0
      expect(value).to.be.false
      cb()

    it "preserves this inside and after", #(cb)
      let run(check, callback)
        let self = this
        asyncif next, check
          expect(this).to.equal self
          next()
        else
          expect(this).to.equal self
          next()
        expect(this).to.equal self
        callback()
      async <- run@ {}, true
      async <- run@ {}, false
      cb()
