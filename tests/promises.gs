test "generator-to-promise", #
  let make-promise = promise! #*
    let d = __defer()
    d.fulfill(\bravo)
    let alpha = yield d.promise
    eq \bravo, alpha
    let charlie = __defer()
    set-timeout (#-> charlie.fulfill \delta), 5_ms
    let echo = yield charlie.promise
    eq \delta, echo
    return \foxtrot
  
  let mutable done = false
  make-promise().then (#(value)
    done := true
    eq \foxtrot, value), #
    fail()
  
  set-timeout (#-> ok done), 1000_ms

test "generator-to-promise as body", #
  let promise = promise!
    let d = __defer()
    d.fulfill(\bravo)
    let alpha = yield d.promise
    eq \bravo, alpha
    let charlie = __defer()
    set-timeout (#-> charlie.fulfill \delta), 5_ms
    let echo = yield charlie.promise
    eq \delta, echo
    return \foxtrot

  let mutable done = false
  promise.then (#(value)
    done := true
    eq \foxtrot, value), #
    fail()

  set-timeout (#-> ok done), 1000_ms

test "to-promise!", #
  let get-args(...args, callback)
    callback(null, args)
  
  let error(err, callback)
    callback(err)
  
  let p = to-promise! get-args(\alpha, \bravo, \charlie)
  let mutable done = 0
  p.then(
    #(value)
      done += 1
      array-eq [\alpha, \bravo, \charlie], value
    fail)
  
  let err = {}
  let q = to-promise! error(err)
  q.then(
    fail
    #(value)
      done += 2
      eq value, err)
  
  set-timeout (#-> eq 3, done), 1000_ms

test "to-promise! method call", #
  let get-args(...args, callback)
    eq obj, this
    callback(null, args)
  
  let error(err, callback)
    eq obj, this
    callback(err)
  
  let obj = {get-args, error}
  
  let p = to-promise! obj.get-args(\alpha, \bravo, \charlie)
  let mutable done = 0
  p.then(
    #(value)
      done += 1
      array-eq [\alpha, \bravo, \charlie], value
    fail)
  
  let err = {}
  let q = to-promise! obj.error(err)
  q.then(
    fail
    #(value)
      done += 2
      eq value, err)
  
  set-timeout (#-> eq 3, done), 1000_ms

test "to-promise! apply method call", #
  let get-args(...args, callback)
    eq other, this
    callback(null, args)
  
  let error(err, callback)
    eq other, this
    callback(err)
  
  let obj = {get-args}
  let other = {}
  
  let p = to-promise! obj.get-args@(other, \alpha, \bravo, \charlie)
  let mutable done = 0
  p.then(
    #(value)
      done += 1
      array-eq [\alpha, \bravo, \charlie], value
    fail)
  
  let err = {}
  let q = to-promise! error@(other, err)
  q.then(
    fail
    #(value)
      done += 2
      eq value, err)
  
  set-timeout (#-> eq 3, done), 1000_ms

test "to-promise! new method call", #
  let get-args(...args, callback)
    ok this instanceof get-args
    callback(null, args)
  
  let error(err, callback)
    ok this instanceof error
    callback(err)
  
  let obj = {get-args}
  
  let p = to-promise! new obj.get-args(\alpha, \bravo, \charlie)
  let mutable done = 0
  p.then(
    #(value)
      done += 1
      array-eq [\alpha, \bravo, \charlie], value
    fail)
  
  let err = {}
  let q = to-promise! new error(err)
  q.then(
    fail
    #(value)
      done += 2
      eq value, err)
  
  set-timeout (#-> eq 3, done), 1000_ms

/*
let promises-aplus-tests = try
  require "promises-aplus-tests"
catch e
  require "../node_modules/promises-aplus-tests"

promises-aplus-tests {pending: __defer}, #(err)
  throw? err
*/