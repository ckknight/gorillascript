describe "promise!", #
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
