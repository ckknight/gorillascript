let {expect} = require 'chai'

let f()
  let alpha = [\a, \b, \c]
  let bravo = [1, 2]
  expect(alpha[* - bravo[* - 1]]).to.equal \b
f()