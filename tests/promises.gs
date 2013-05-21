describe "promise!", #
  describe "on a generator function", #
    it "can create a promise factory", #(cb)
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
    
      make-promise().then #(value)
        expect(value).to.equal \foxtrot
        cb()
    
    it "can work on a simple generator", #(cb)
      let make-promise = promise! #*
        return \alpha
      
      make-promise().then #(value)
        expect(value).to.equal \alpha
        cb()
    
    it "can work on a reference to a generator function", #(cb)
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
      
      (promise! generator)().then #(value)
        expect(value).to.equal \foxtrot
        cb()
    
    it "can work on a reference to a simple generator function", #(cb)
      let generator()*
        return \foxtrot
      
      (promise! generator)().then #(value)
        expect(value).to.equal \foxtrot
        cb()
  
  it "can create a promise factory from a generator function", #(cb)
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
    
    make-promise().then #(value)
      expect(value).to.equal \foxtrot
      cb()
  
  describe "on a generator instance", #
    it "can create a promise from a generator instance", #(cb)
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
    
      promise.then #(value)
        expect(value).to.equal \foxtrot
        cb()
    
    it "can work on a simple generator", #
      let generator()*
        return \foxtrot
      
      let promise = promise! generator()
    
      promise.then #(value)
        expect(value).to.equal \foxtrot
        cb()
  
  it "can create a one-off promise", #(cb)
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

    promise.then #(value)
      expect(value).to.equal \foxtrot
      cb()

describe "to-promise!", #
  describe "with a standard function call", #
    let get-args(...args, callback)
      callback(null, args)
    let error(err, callback)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)
        let p = to-promise! get-args(\alpha, \bravo, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()
    
      it "works with the rejected state", #(cb)
        let err = {}
        let p = to-promise! error(err)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)
        let args = [\alpha, \bravo]
        let p = to-promise! get-args(...args, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()
    
      it "works with the rejected state", #(cb)
        let err = {}
        let args = [err]
        let p = to-promise! error(...args)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
  
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
      it "works with the resolved state", #(cb)
        let p = to-promise! obj.get-args(\alpha, \bravo, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let p = to-promise! obj.error(err)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)
        let args = [\alpha, \bravo]
        let p = to-promise! obj.get-args(...args, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let args = [err]
        let p = to-promise! obj.error(...args)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
  
  describe "with an apply call", #
    let obj = {}
    let get-args = #(...args, callback)
      expect(this).to.equal obj
      callback(null, args)
    let error = #(err, callback)
      expect(this).to.equal obj
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)
        let p = to-promise! get-args@(obj, \alpha, \bravo, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let p = to-promise! error@(obj, err)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)
        let args = [obj, \alpha, \bravo]
        let p = to-promise! get-args@(...args, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let args = [obj, err]
        let p = to-promise! error@(...args)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
  
  describe "with a new call", #
    let get-args = #(...args, callback)
      expect(this).to.be.an.instanceof(get-args)
      callback(null, args)
    let error = #(err, callback)
      expect(this).to.be.an.instanceof(error)
      callback(err)
    
    describe "without a spread", #
      it "works with the resolved state", #(cb)
        let p = to-promise! new get-args(\alpha, \bravo, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let p = to-promise! new error(err)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()
    
    describe "with a spread", #
      it "works with the resolved state", #(cb)
        let args = [\alpha, \bravo]
        let p = to-promise! new get-args(...args, \charlie)
        p.then #(value)
          expect(value).to.eql [\alpha, \bravo, \charlie]
          cb()

      it "works with the rejected state", #(cb)
        let err = {}
        let args = [err]
        let p = to-promise! new error(...args)
        p.then null, #(reason)
          expect(reason).to.equal err
          cb()

describe "fulfilled!", #
  it "produces an already-fulfilled promise", #
    let alpha = fulfilled! \bravo
    alpha.then #(value)
      expect(value).to.equal \bravo
      cb()
  
describe "rejected!", #
  it "produces an already-rejected promise", #
    let alpha = rejected! \bravo
    alpha.then null, #(reason)
      expect(reason).to.equal \bravo
      cb()

describe "from-promise!", #
  describe "converts a normal promise into a function which takes a single callback", #
    it "works on an already-fulfilled promise", #(cb)
      let alpha = fulfilled! \bravo
      let fun = from-promise! alpha
      fun #(err, value)
        expect(err).to.not.exist
        expect(value).to.equal \bravo
        cb()
    
    it "works on an already-rejected promise", #(cb)
      let alpha = rejected! \bravo
      let fun = from-promise! alpha
      fun #(err, value)
        expect(err).to.equal \bravo
        expect(value).to.not.exist
        cb()
    
    it "works on a promise that is fulfilled later", #(cb)
      let alpha = __defer()
      let fun = from-promise! alpha.promise
      fun #(err, value)
        expect(err).to.not.exist
        expect(value).to.equal \bravo
        cb()
      alpha.fulfill \bravo
    
    it "works on a promise that is rejected later", #(cb)
      let alpha = __defer()
      let fun = from-promise! alpha.promise
      fun #(err, value)
        expect(err).to.equal \bravo
        expect(value).to.not.exist
        cb()
      alpha.reject \bravo

describe "any-promise!", #
  it "succeeds when the first promise is fulfilled", #(cb)
    let alpha = __defer()
    let bravo = __defer()
    let charlie = __defer()
    
    (any-promise! [alpha.promise, bravo.promise, charlie.promise]).then #(value)
      expect(value).to.equal \delta
      cb()
    
    bravo.fulfill \delta
    alpha.reject \echo
    charlie.reject \foxtrot
  
  it "fails when the first promise is rejected", #(cb)
    let alpha = __defer()
    let bravo = __defer()
    let charlie = __defer()
    
    (any-promise! [alpha.promise, bravo.promise, charlie.promise]).then null, #(reason)
      expect(reason).to.equal \delta
      cb()
    
    alpha.reject \delta
    bravo.fulfill \echo
    charlie.reject \foxtrot


describe "all-promises!", #
  describe "with an array", #
    it "succeeds when the all promises are fulfilled", #(cb)
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
    
      (all-promises! [alpha.promise, bravo.promise, charlie]).then(
        #(value)
          expect(value).to.eql [\echo, \foxtrot, \delta]
          cb())
    
      alpha.fulfill \echo
      bravo.fulfill \foxtrot
  
    it "fails when the first promise is rejected", #(cb)
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
    
      (all-promises! [alpha.promise, bravo.promise, charlie]).then null, #(reason)
        expect(reason).to.equal \echo
        cb()
    
      alpha.reject \echo
      bravo.fulfill \foxtrot

  describe "with an object", #
    it "succeeds when the all promises are fulfilled", #(cb)
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
  
      (all-promises! { alpha: alpha.promise, bravo: bravo.promise, charlie }).then(
        #(value)
          expect(value).to.eql { alpha: \echo, bravo: \foxtrot, charlie: \delta }
          cb())
  
      alpha.fulfill \echo
      bravo.fulfill \foxtrot

    it "fails when the first promise is rejected", #(cb)
      let alpha = __defer()
      let bravo = __defer()
      let charlie = __defer.fulfilled \delta
  
      (all-promises! { alpha: alpha.promise, bravo: bravo.promise, charlie: charlie }).then null, #(reason)
        expect(reason).to.equal \echo
        cb()
  
      alpha.reject \echo
      bravo.fulfill \foxtrot
