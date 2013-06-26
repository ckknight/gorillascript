let expect = require('chai').expect
let stub = require('sinon').stub

describe "function parameter destructuring", #
  describe "array parameter", #
    it "works", #
      let fun([a, b]) -> [a, b]
    
      expect(fun)
        .to.be.a(\function)
        .and.have.length(1)
    
      expect(fun []).to.eql [void, void]
      expect(fun [\a]).to.eql [\a, void]
      expect(fun [\a, \b]).to.eql [\a, \b]
      expect(fun [\a, \b, \c]).to.eql [\a, \b]
      expect(fun [\a, \b], \c).to.eql [\a, \b]
      expect(fun [\a, \b], \c).to.eql [\a, \b]
      expect(fun [\a, \b], \c).to.eql [\a, \b]
      expect(fun [\a], \b, \c).to.eql [\a, void]
  
    it "allows for spread", #
      let fun([a, ...b]) -> [a, b]
    
      expect(fun []).to.eql [void, []]
      expect(fun [\a]).to.eql [\a, []]
      expect(fun [\a, \b]).to.eql [\a, [\b]]
      expect(fun [\a, \b, \c]).to.eql [\a, [\b, \c]]
  
    it "allows for spread in middle", #
      let fun([a, ...b, c]) -> [a, b, c]
  
      expect(fun []).to.eql [void, [], void]
      expect(fun [\a]).to.eql [\a, [], void]
      expect(fun [\a, \b]).to.eql [\a, [], \b]
      expect(fun [\a, \b, \c]).to.eql [\a, [\b], \c]
      expect(fun [\a, \b, \c, \d]).to.eql [\a, [\b, \c], \d]
  
    it "allows for this-params", #
      let fun([@a, @b]) -> [a, b]
  
      let obj = {}
      expect(fun@ obj, [\a, \b]).to.eql [\a, \b]
      expect(obj).to.eql {a: \a, b: \b}
    
    it "it allows for deep destructure with this parameters", #
      let func([@alpha, [@bravo, [@charlie]]]) ->

      let obj = {}
      func@ obj, [\delta, [\echo, [\foxtrot]]]
      expect(obj).to.eql {alpha: \delta, bravo: \echo, charlie: \foxtrot}
  
  describe "object parameter", #
    it "works", #
      let fun({a, b}) -> [a, b]
      expect(fun)
        .to.be.a(\function)
        .and.have.property(\length).that.equals 1
      
      expect(fun {}).to.eql [void, void]
      expect(fun {\a}).to.eql [\a, void]
      expect(fun {\a, \b}).to.eql [\a, \b]
      expect(fun {\a, \b, \c}).to.eql [\a, \b]
      expect(fun {\a, \b}, \c).to.eql [\a, \b]
      expect(fun {\a}, \b, \c).to.eql [\a, void]
    
    it "allows for this-params", #
      let fun({@a, @b}) -> [a, b]
  
      let obj = {}
      expect(fun@ obj, {a: \a, b: \b}).to.eql [\a, \b]
      expect(obj).to.eql {a: \a, b: \b}
    
    it "allows for deep object destructure with this params", #
      let func({@alpha, bravo: { @charlie, delta: { @echo }}}) ->

      let obj = {}
      func@ obj, { alpha: "foxtrot", bravo: { charlie: "golf", delta: { echo: "hotel" } } }
      expect(obj).to.eql {alpha: "foxtrot", charlie: "golf", echo: "hotel"}
  
  it "allows for mixed object and array destructures", #
    let func({@alpha, bravo: [@charlie, { @delta }]}) ->

    let obj = {}
    func@ obj, { alpha: "echo", bravo: ["foxtrot", { delta: "golf" }] }  
    expect(obj).to.eql {alpha: "echo", charlie: "foxtrot", delta: "golf"}

describe "let destructuring", #
  describe "array", #
    it "works with an ident", #
      let arr = [\a, \b, \c]
  
      let [a, b, c] = arr
      expect(a).to.equal \a
      expect(b).to.equal \b
      expect(c).to.equal \c
    
    it "works with a function call", #
      let f = stub().returns [\a, \b, \c]
      
      let [a, b, c] = f()
      expect(a).to.equal \a
      expect(b).to.equal \b
      expect(c).to.equal \c
      expect(f).to.be.called-once
    
    it "works with a literal array", #
      let [a, b, c] = [\a, \b, \c]
      
      expect(a).to.equal \a
      expect(b).to.equal \b
      expect(c).to.equal \c
    
    it "works with a single element", #
      let f = stub().returns [\a, \b, \c]
      
      let [a] = f()
      expect(a).to.equal \a
      expect(f).to.be.called-once
    
    it "allows ignored values", #
      let [, x] = [5, 6]
      expect(x).to.equal 6

    it "allows ignored values in the middle", #
      let [x, , y] = [5, 6, 7]
      expect(x).to.equal 5
      expect(y).to.equal 7

    it "returns the full array if in the return position, with one destructure", #
      let f(get-arr)
        let [a] = get-arr()
      let get = stub().returns [1, 2, 3]
      expect(f(get)).to.be.undefined
      expect(get).to.be.called-once

    it "returns void if in the return position, with multiple destructures", #
      let f(get-arr)
        let [a, b] = get-arr()
      let get = stub().returns [1, 2, 3]
      expect(f(get)).to.be.undefined
      expect(get).to.be.called-once

  describe "object", #
    it "works with an ident", #
      let obj = {a: \b, c: \d, e: \f}
  
      let {a, c, e} = obj
      
      expect(a).to.equal \b
      expect(c).to.equal \d
      expect(e).to.equal \f
    
    it "works with an ident and named keys", #
      let obj = {a: \b, c: \d, e: \f}

      let {a: b, c: d, e: f} = obj

      expect(b).to.equal \b
      expect(d).to.equal \d
      expect(f).to.equal \f
    
    it "works with a call", #
      let fun = stub().returns {a: \b, c: \d, e: \f}
  
      let {a, c, e} = fun()
      
      expect(a).to.equal \b
      expect(c).to.equal \d
      expect(e).to.equal \f
      expect(fun).to.be.called-once
    
    it "works with a call and named keys", #
      let fun = stub().returns {a: \b, c: \d, e: \f}

      let {a: b, c: d, e: f} = fun()

      expect(b).to.equal \b
      expect(d).to.equal \d
      expect(f).to.equal \f
      expect(fun).to.be.called-once
    
    it "works with literal object", #
      let {a, c, e} = {a: \b, c: \d, e: \f}
  
      expect(a).to.equal \b
      expect(c).to.equal \d
      expect(e).to.equal \f

    it "works with literal object and named keys", #
      let {a: b, c: d, e: f} = {a: \b, c: \d, e: \f}
  
      expect(b).to.equal \b
      expect(d).to.equal \d
      expect(f).to.equal \f
    
    it "works with a single element", #
      let fun = stub().returns {a: \b, c: \d, e: \f}
      let {a} = fun()
      expect(a).to.equal \b
      expect(fun).to.be.called-once
    
    it "works with a single element and named key", #
      let fun = stub().returns {a: \b, c: \d, e: \f}
      let {a: b} = fun()
      expect(b).to.equal \b
      expect(fun).to.be.called-once
    
    it "returns void if in the return position, with one destructure", #
      let f(get-obj)
        let {a} = get-obj()
      let get = stub().returns {a: 1, b: 2, c: 3}
      expect(f(get)).to.be.undefined
      expect(get).to.be.called-once
    
    it "returns void if in the return position, with multiple destructures", #
      let f(get-obj)
        let {a, b} = get-obj()
      let get = stub().returns {a: 1, b: 2, c: 3}
      expect(f(get)).to.be.undefined
      expect(get).to.be.called-once

describe "for loop destructuring", #
  describe "in array", #
    it "works", #
      let arr = [[\a, \b], [\c, \d], [\e, \f]]
      let result = []
      for [x, y] in arr
        result.push x
        result.push y
    
      expect(result).to.eql [\a, \b, \c, \d, \e, \f]
    
    it "block-scopes the variables", #
      let arr = [[\a, \b], [\c, \d], [\e, \f]]
      let result = []
      for [x, y] in arr
        result.push #-> x
        result.push #-> y
      
      expect(for f in result; f()).to.eql [\a, \b, \c, \d, \e, \f]
  
  describe "of object", #
    it "works", #
      let obj = { x: [\a, \b], y: [\c, \d], z: [\e, \f] }

      let result = []
      for k, [x, y] of obj
        result.push k
        result.push x
        result.push y
      
      expect(result.sort()).to.eql [\a, \b, \c, \d, \e, \f, \x, \y, \z]
    
    it "block-scopes the variables", #
      let obj = { x: [\a, \b], y: [\c, \d], z: [\e, \f] }

      let result = []
      for k, [x, y] of obj
        result.push #-> k
        result.push #-> x
        result.push #-> y
      
      expect((for f in result; f()).sort()).to.eql [\a, \b, \c, \d, \e, \f, \x, \y, \z]
