let {expect} = require 'chai'

let random-wait(value, max-time = 10)
  //delay! (Math.random() * max-time) \ 1, value
  let defer = __defer()
  set-timeout #-> defer.fulfill(value), (Math.random() * max-time) \ 1
  defer.promise

describe "promise!", #
  describe "on a generator function", #
    it "can create a promise factory", #(cb)!
      let make-promise = promise! #*
        let d = __defer()
        d.fulfill(\bravo)
        let alpha = yield d.promise
        expect(alpha).to.equal \bravo
        let charlie = __defer()
        set-immediate #-> charlie.fulfill \delta
        let echo = yield charlie.promise
        expect(echo).to.equal \delta
        return \foxtrot
    
      make-promise()
        .then #(value)
          expect(value).to.equal \foxtrot
          cb()
        .then null, cb
    
    it "can work on a simple generator", #(cb)!
      let make-promise = promise! #*
        return \alpha
      
      make-promise()
        .then #(value)
          expect(value).to.equal \alpha
          cb()
        .then null, cb
    
    it "can work on a reference to a generator function", #(cb)!
      let generator()*
        let d = __defer()
        d.fulfill(\bravo)
        let alpha = yield d.promise
        expect(alpha).to.equal \bravo
        let charlie = __defer()
        set-immediate #-> charlie.fulfill \delta
        let echo = yield charlie.promise
        expect(echo).to.equal \delta
        return \foxtrot
      
      (promise! generator)()
        .then #(value)
          expect(value).to.equal \foxtrot
          cb()
        .then null, cb
    
    it "can work on a reference to a simple generator function", #(cb)!
      let generator()*
        return \foxtrot
      
      (promise! generator)()
        .then #(value)
          expect(value).to.equal \foxtrot
          cb()
        .then null, cb
  
  it "can create a promise factory from a generator function", #(cb)!
    let generator()*
      let d = __defer()
      d.fulfill(\bravo)
      let alpha = yield d.promise
      expect(alpha).to.equal \bravo
      let charlie = __defer()
      set-immediate #-> charlie.fulfill \delta
      let echo = yield charlie.promise
      expect(echo).to.equal \delta
      return \foxtrot
    
    let make-promise = promise! generator
    
    make-promise()
      .then #(value)
        expect(value).to.equal \foxtrot
        cb()
      .then null, cb
  
  describe "on a generator instance", #
    it "can create a promise from a generator instance", #(cb)!
      let generator()*
        let d = __defer()
        d.fulfill(\bravo)
        let alpha = yield d.promise
        expect(alpha).to.equal \bravo
        let charlie = __defer()
        set-immediate #-> charlie.fulfill \delta
        let echo = yield charlie.promise
        expect(echo).to.equal \delta
        return \foxtrot
    
      let promise = promise! generator()
    
      promise
        .then #(value)
          expect(value).to.equal \foxtrot
          cb()
        .then null, cb
    
    it "can work on a simple generator", #(cb)!
      let generator()*
        return \foxtrot
      
      let promise = promise! generator()
    
      promise
        .then #(value)
          expect(value).to.equal \foxtrot
          cb()
        .then null, cb
  
  it "can create a one-off promise", #(cb)!
    let promise = promise!
      let d = __defer()
      d.fulfill(\bravo)
      let alpha = yield d.promise
      expect(alpha).to.equal \bravo
      let charlie = __defer()
      set-immediate #-> charlie.fulfill \delta
      let echo = yield charlie.promise
      expect(echo).to.equal \delta
      return \foxtrot

    promise
      .then #(value)
        expect(value).to.equal \foxtrot
        cb()
      .then null, cb

describe "to-promise!", #
  describe "with a standard function call", #
    let get-args(...args, callback)
      callback(null, args)
    let error(err, callback)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise! get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb
    
      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise! error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise! get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb
    
      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise! error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with a method call", #
    let obj = {
      get-args: #(...args, callback)
        expect(this).to.equal obj
        callback(null, args)
      error: #(err, callback)
        expect(this).to.equal obj
        callback(err)
    }
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise! obj.get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise! obj.error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise! obj.get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise! obj.error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with an apply call", #
    let obj = {}
    let get-args = #(...args, callback)
      expect(this).to.equal obj
      callback(null, args)
    let error = #(err, callback)
      expect(this).to.equal obj
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise! get-args@(obj, \alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise! error@(obj, err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [obj, \alpha, \bravo]
        let promise = to-promise! get-args@(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [obj, err]
        let promise = to-promise! error@(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with a new call", #
    let get-args = #(...args, callback)
      expect(this).to.be.an.instanceof(get-args)
      callback(null, args)
    let error = #(err, callback)
      expect(this).to.be.an.instanceof(error)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise! new get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise! new error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise! new get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise! new error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb

describe "to-promise-array!", #
  describe "with a standard function call", #
    let get-args(...args, callback)
      callback(null, ...args)
    let error(err, callback)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise-array! get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb
    
      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise-array! error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise-array! get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb
    
      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise-array! error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with a method call", #
    let obj = {
      get-args: #(...args, callback)
        expect(this).to.equal obj
        callback(null, ...args)
      error: #(err, callback)
        expect(this).to.equal obj
        callback(err)
    }
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise-array! obj.get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise-array! obj.error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise-array! obj.get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise-array! obj.error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with an apply call", #
    let obj = {}
    let get-args = #(...args, callback)
      expect(this).to.equal obj
      callback(null, ...args)
    let error = #(err, callback)
      expect(this).to.equal obj
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise-array! get-args@(obj, \alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise-array! error@(obj, err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [obj, \alpha, \bravo]
        let promise = to-promise-array! get-args@(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [obj, err]
        let promise = to-promise-array! error@(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
  
  describe "with a new call", #
    let get-args = #(...args, callback)
      expect(this).to.be.an.instanceof(get-args)
      callback(null, ...args)
    let error = #(err, callback)
      expect(this).to.be.an.instanceof(error)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)!
        let promise = to-promise-array! new get-args(\alpha, \bravo, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let promise = to-promise-array! new error(err)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)!
        let args = [\alpha, \bravo]
        let promise = to-promise-array! new get-args(...args, \charlie)
        promise
          .then #(value)
            expect(value).to.eql [\alpha, \bravo, \charlie]
            cb()
          .then null, cb

      it "works with the rejected state", #(cb)!
        let err = {}
        let args = [err]
        let promise = to-promise-array! new error(...args)
        promise
          .then null, #(reason)
            expect(reason).to.equal err
            cb()
          .then null, cb

describe "fulfilled!", #
  it "produces an already-fulfilled promise", #(cb)!
    let alpha = fulfilled! \bravo
    alpha
      .then #(value)
        expect(value).to.equal \bravo
        cb()
      .then null, cb
  
describe "rejected!", #
  it "produces an already-rejected promise", #(cb)!
    let alpha = rejected! \bravo
    alpha
      .then null, #(reason)
        expect(reason).to.equal \bravo
        cb()
      .then null, cb

describe "from-promise!", #
  describe "converts a normal promise into a function which takes a single callback", #
    it "works on an already-fulfilled promise", #(cb)!
      let alpha = fulfilled! \bravo
      let fun = from-promise! alpha
      fun #(err, value)
        try
          expect(err).to.not.exist
          expect(value).to.equal \bravo
          cb()
        catch e
          cb(e)
    
    it "works on an already-rejected promise", #(cb)!
      let alpha = rejected! \bravo
      let fun = from-promise! alpha
      fun #(err, value)
        try
          expect(err).to.equal \bravo
          expect(value).to.not.exist
          cb()
        catch e
          cb(e)
    
    it "works on a promise that is fulfilled later", #(cb)!
      let alpha = __defer()
      let fun = from-promise! alpha.promise
      fun #(err, value)
        try
          expect(err).to.not.exist
          expect(value).to.equal \bravo
          cb()
        catch e
          cb(e)
      alpha.fulfill \bravo
    
    it "works on a promise that is rejected later", #(cb)!
      let alpha = __defer()
      let fun = from-promise! alpha.promise
      fun #(err, value)
        try
          expect(err).to.equal \bravo
          expect(value).to.not.exist
          cb()
        catch e
          cb(e)
      alpha.reject \bravo

describe "some-promise!", #
  it "succeeds when the first promise is fulfilled", #(cb)!
    let alpha = __defer()
    let bravo = __defer()
    let charlie = __defer()
    
    (some-promise! [alpha.promise, bravo.promise, charlie.promise])
      .then #(value)
        expect(value).to.equal \delta
        cb()
      .then null, cb
    
    bravo.fulfill \delta
    alpha.reject \echo
    charlie.reject \foxtrot
  
  it "fails when the first promise is rejected", #(cb)!
    let alpha = __defer()
    let bravo = __defer()
    let charlie = __defer()
    
    (some-promise! [alpha.promise, bravo.promise, charlie.promise])
      .then null, #(reason)
        expect(reason).to.equal \delta
        cb()
      .then null, cb
    
    alpha.reject \delta
    bravo.fulfill \echo
    charlie.reject \foxtrot


describe "every-promise!", #
  describe "with an array", #
    it "succeeds when the all promises are fulfilled", #(cb)!
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
    
      (every-promise! [alpha.promise, bravo.promise, charlie])
        .then #(value)
          expect(value).to.eql [\echo, \foxtrot, \delta]
          cb()
        .then null, cb
    
      alpha.fulfill \echo
      bravo.fulfill \foxtrot
  
    it "fails when the first promise is rejected", #(cb)!
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
    
      (every-promise! [alpha.promise, bravo.promise, charlie])
        .then null, #(reason)
          expect(reason).to.equal \echo
          cb()
        .then null, cb
    
      alpha.reject \echo
      bravo.fulfill \foxtrot

    it "succeeds immediately if array is empty", #(cb)!
      (every-promise! [])
        .then #(value)
          expect(value).to.eql []
          cb()
        .then null, cb

  describe "with an object", #
    it "succeeds when the all promises are fulfilled", #(cb)!
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
  
      (every-promise! { alpha: alpha.promise, bravo: bravo.promise, charlie })
        .then #(value)
          expect(value).to.eql { alpha: \echo, bravo: \foxtrot, charlie: \delta }
          cb()
        .then null, cb
  
      alpha.fulfill \echo
      bravo.fulfill \foxtrot

    it "fails when the first promise is rejected", #(cb)!
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
  
      (every-promise! { alpha: alpha.promise, bravo: bravo.promise, charlie: charlie })
        .then null, #(reason)
          expect(reason).to.equal \echo
          cb()
        .then null, cb
  
      alpha.reject \echo
      bravo.fulfill \foxtrot

    it "succeeds immediately if the object is empty", #(cb)!
      (every-promise! {})
        .then #(value)
          expect(value).to.eql {}
          cb()
        .then null, cb

describe "promisefor", #
  describe "in a range", #
    it "returns a promise which fulfills with an array", #(cb)!
      let items = []
      let loop = promisefor(3) i in 0 til 10
        let j = yield random-wait(i * i)
        items.push i
        return j
      
      loop
        .then #(value)
          expect(value).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
          expect(items.sort (<=>)).to.eql (0 til 10)
          cb()
        .then null, cb
  
  describe "in an array", #
    it "returns a promise which fulfills with an array", #(cb)!
      let items = []
      let arr = 0 til 10
      let loop = promisefor(3) i in arr
        let j = yield random-wait(i * i)
        items.push i
        return j
      
      loop
        .then #(value)
          expect(value).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
          expect(items.sort (<=>)).to.eql (0 til 10)
          cb()
        .then null, cb
  
  describe "of an object", #
    it "returns a promise which fulfills with an array", #(cb)!
      let items = []
      let loop = promisefor(3) k, v of { a: \b, c: \d, e: \f, g: \h, i: \j, k: \l, m: \n }
        let u = yield random-wait(v.to-upper-case())
        items.push [k, v]
        return u
      
      loop
        .then #(value)
          expect(value.sort()).to.eql [\B, \D, \F, \H, \J, \L, \N]
          expect(items.sort #(a, b) -> a[0] <=> b[0]).to.eql [[\a, \b], [\c, \d], [\e, \f], [\g, \h], [\i, \j], [\k, \l], [\m, \n]]
          cb()
        .then null, cb
  
  describe "from an iterator", #
    it "returns a promise which fulfills with an array", #(cb)!
      let iter()*
        for i in 0 til 10
          yield i
      let items = []
      let loop = promisefor(3) i, j from iter()
        expect(i).to.equal j
        let k = yield random-wait(i * i)
        items.push i
        return k
      
      loop
        .then #(value)
          expect(value).to.eql [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
          expect(items.sort (<=>)).to.eql (0 til 10)
          cb()
        .then null, cb
  
describe "delay!", #
  describe "with a value", #
    it "works for time <= 0", #(cb)!
      let alpha = delay! -1000_ms, \bravo
      alpha
        .then #(value)
          expect(value).to.equal \bravo
          cb()
        .then null, cb
    
    it "waits at least the specified time before fulfilling", #(cb)!
      let start = +new Date().get-time()
      let alpha = delay! 200_ms, \bravo
      alpha
        .then #(value)
          expect(value).to.equal \bravo
          let elapsed = new Date().get-time()
          expect(elapsed).to.be.at.least 200_ms
          cb()
        .then null, cb
    
    it "can be used with some-promise! as a timeout mechanism", #(cb)!
      let never-finish = __defer().promise
      let timeout = {}
      (some-promise! [never-finish, delay!(50_ms, timeout)])
        .then #(value)
          expect(value).to.equal timeout
          cb()
        .then null, cb

  describe "without a value", #
    it "works for time <= 0", #(cb)!
      let alpha = delay! -1000_ms
      alpha
        .then #(value)
          expect(value).to.equal void
          cb()
        .then null, cb
    
    it "waits at least the specified time before fulfilling", #(cb)!
      let start = +new Date().get-time()
      let alpha = delay! 200_ms
      alpha
        .then #(value)
          expect(value).to.equal void
          let elapsed = new Date().get-time()
          expect(elapsed).to.be.at.least 200_ms
          cb()
        .then null, cb
