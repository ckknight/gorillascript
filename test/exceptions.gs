let {expect} = require 'chai'
let {stub} = require 'sinon'

describe "throwing an exception", #
  it "works as expected", #
    let obj = {}
    expect(#-> throw obj).throws(obj)
  
  it "works as an expression", #
    let x = true
    let obj = {}
    expect(#-> x and throw obj).throws(obj)

describe "try-catch", #
  it "goes to the catch body if an error occurs", #
    let obj = {}
    let ran = stub()
    try
      throw obj
    catch e
      expect(e).to.equal obj
      ran()
    expect(ran).to.be.called-once
  
  it "does not go to the catch body if an error does not occur", #
    let ran = stub()
    try
      ran()
    catch e
      throw Error "Never reached"
    expect(ran).to.be.called-once
  
  it "can have an empty catch", #
    try
      throw {}
    catch e
      void
  
  it "does not require a catch ident", #
    try
      throw {}
    catch
      void

describe "try-catch-else", #
  describe "as a statement", #
    describe "if an error occurs", #
      it "goes to the catch body, not else body", #
        let obj = {}
        let in-catch = stub()
        let in-else = stub()
        
        try
          throw obj
        catch e
          expect(e).to.equal obj
          in-catch()
        else
          in-else()
        expect(in-catch).to.be.called-once
        expect(in-else).to.not.be.called
        
    describe "if an error does not occur", #
      it "goes to the else body, not catch body", #
        let obj = {}
        let ran = stub()
        let in-catch = stub()
        let in-else = stub()

        try
          ran()
        catch e
          in-catch()
        else
          in-else()
        expect(in-catch).to.not.be.called
        expect(in-else).to.be.called-once
  /*
  describe "as an expression", #
    describe "if an error occurs", #
      it "goes to the catch body, not else body", #
        let obj = {}
        let in-catch = stub()
        let in-else = stub()
        
        let x = try
          throw obj
        catch e
          expect(e).to.equal obj
          in-catch()
          \alpha
        else
          in-else()
          \bravo
        expect(in-catch).to.be.called-once
        expect(in-else).to.not.be.called
        expect(x).to.equal \alpha
        
    describe "if an error does not occur", #
      it "goes to the else body, not catch body", #
        let obj = {}
        let ran = stub()
        let in-catch = stub()
        let in-else = stub()

        let x = try
          ran()
        catch e
          in-catch()
          \alpha
        else
          in-else()
          \bravo
        expect(in-catch).to.not.be.called
        expect(in-else).to.be.called-once
        expect(x).to.equal \bravo
  */

describe "try-finally", #
  describe "if an error occurs", #
    it "should hit the finally and throw the error", #
      let err = Error()
      let hit-finally = stub()
      let after = stub()
      expect(#
        try
          throw err
        finally
          hit-finally()
        after()).throws(err)
      expect(hit-finally).to.be.called-once
      expect(after).to.not.be.called
  
  describe "if an error does not occur", #
    it "should hit the finally", #
      let err = Error()
      let ran = stub()
      let hit-finally = stub()
      try
        ran()
      finally
        hit-finally()
      expect(ran).to.be.called-once
      expect(hit-finally).to.be.called-once
  
  describe "as an auto-returned last statement", #
    it "should return the value in the try", #
      let ran = stub().returns \alpha
      let hit-finally = stub()
      let f()
        try
          ran()
        finally
          hit-finally()
      expect(f()).to.equal \alpha
      expect(ran).to.be.called-once
      expect(hit-finally).to.be.called-once

describe "try-catch-finally", #
  describe "if an error occurs", #
    it "should hit both the catch and the finally", #
      let err = Error()
      let in-catch = stub()
      let in-finally = stub()
      try
        throw err
      catch e
        expect(e).to.equal err
        in-catch()
      finally
        in-finally()
      expect(in-catch).to.be.called-once
      expect(in-finally).to.be.called-once
  
  describe "if an error does not occur", #
    it "should ignore the catch and hit finally", #
      let err = Error()
      let ran = stub()
      let in-finally = stub()
      try
        ran()
      catch e
        throw Error "never reached"
      finally
        in-finally()
      expect(ran).to.be.called-once
      expect(in-finally).to.be.called-once

describe "try-catch-else-finally", #
  describe "if an error occurs", #
    it "should hit the catch and the finally, ignore the else", #
      let err = Error()
      let in-catch = stub()
      let in-finally = stub()
      try
        throw err
      catch e
        expect(e).to.equal err
        in-catch()
      else
        throw Error "never reached"
      finally
        in-finally()
      expect(in-catch).to.be.called-once
      expect(in-finally).to.be.called-once
  
  describe "if an error does not occur", #
    it "should hit the else and the finally, ignore the catch", #
      let ran = stub()
      let in-else = stub()
      let in-finally = stub()
      try
        ran()
      catch e
        throw Error "never reached"
      else
        in-else()
      finally
        in-finally()
      expect(ran).to.be.called-once
      expect(in-else).to.be.called-once
      expect(in-finally).to.be.called-once

describe "try-catch as type", #
  class MyError
  describe "with an untyped catch", #
    describe "when the expected error is thrown", #
      it "should hit the specific catch but ignore the other", #
        let in-specific = stub()
        let err = MyError()
        try
          throw err
        catch e as MyError
          expect(e).to.equal err
          in-specific()
        catch e
          throw Error "never reached"
        
        expect(in-specific).to.be.called-once
    
    describe "when an unexpected error is thrown", #
      it "should hit the specific catch but ignore the other", #
        let err = {}
        let in-catch = stub()
        try
          throw err
        catch e as MyError
          throw Error "never reached"
        catch e
          expect(e).to.equal(err)
          in-catch()
        
        expect(in-catch).to.be.called-once
    
    describe "when no error is thrown", #
      it "should ignore both catches", #
        let ran = stub()
        try
          ran()
        catch e as MyError
          throw Error "never reached"
        catch e
          throw Error "never reached"
        expect(ran).to.be.called-once
    
    describe "with differing idents", #
      it "should work fine", #
        let err = Error()
        let in-catch = stub()
        try
          throw err
        catch e as MyError
          throw Error "never reached"
        catch e2
          expect(e2).to.equal err
          in-catch()
        
        expect(in-catch).to.be.called-once
  
  describe "without an untyped catch", #
    describe "when the expected error is thrown", #
      it "should hit the specific catch but ignore the other", #
        let in-specific = stub()
        let err = MyError()
        try
          throw err
        catch e as MyError
          expect(e).to.equal err
          in-specific()

        expect(in-specific).to.be.called-once

    describe "when an unexpected error is thrown", #
      it "should hit the specific catch but ignore the other", #
        let err = {}
        let in-catch = stub()
        expect(#
          try
            throw err
          catch e as MyError
            throw Error "never reached").throws(err)

    describe "when no error is thrown", #
      it "should ignore both catches", #
        let ran = stub()
        try
          ran()
        catch e as MyError
          throw Error "never reached"
        expect(ran).to.be.called-once
  
  describe "multiple catch as types", #
    class OtherError
    let f(err)
      try
        throw err
      catch e as MyError
        \my-error
      catch e as OtherError
        \other-error
      catch e
        \unknown
    
    it "when the first error is thrown", #
      expect(f(MyError())).to.equal \my-error
    
    it "when the second error is thrown", #
      expect(f(OtherError())).to.equal \other-error
    
    it "when an unknown error is thrown", #
      expect(f(Error())).to.equal \unknown
  
  describe "multiple catch as types using union syntax", #
    class OtherError
    let f(err)
      try
        throw err
      catch e as MyError|OtherError
        \my-error
      catch e
        \unknown
    
    it "when the first error is thrown", #
      expect(f(MyError())).to.equal \my-error

    it "when the second error is thrown", #
      expect(f(OtherError())).to.equal \my-error

    it "when an unknown error is thrown", #
      expect(f(Error())).to.equal \unknown

describe "try-catch == type", #
  class MyError
  let obj = {}
  let f(err)
    let mutable result = ""
    try
      throw? err
    catch e1 as MyError
      result := \my-error
    catch e2 == obj
      result := \obj
    catch e3
      result := String e3
    else
      result := \none
    finally
      return ":$result"
  
  it "when the first error is thrown", #
    expect(f(MyError())).to.equal ":myError"
  
  it "when the second error is thrown", #
    expect(f(obj)).to.equal ":obj"
  
  it "when an unknown error is thrown", #
    expect(f({ to-string: #-> \other })).to.equal ":other"
  
  it "when no error is thrown", #
    expect(f()).to.equal ":none"
