let {expect} = require 'chai'
let gorilla = require '../index'
let coverage = require (if process.env.GORILLA_COV then '../lib-cov/coverage' else '../lib/coverage')

describe "coverage", #
  it "adds _\$jscoverage transforms", #
    let x = gorilla.compile-sync """
    console.log "Hello, world!"
    console.log "I hope you're well today."
    let f()
      let x = 0
      if x
        "good"
      else
        "bad"
    f()
    """, coverage: true, filename: "blah.gs"
    expect(x.code).to.match r'\+\+_\$jscoverage\["blah.gs"\]\[\d+\]'
  
  it "adds custom coverage transforms", #
    let x = gorilla.compile-sync """
    console.log "Hello, world!"
    console.log "I hope you're well today."
    let f()
      let x = 0
      if x
        "good"
      else
        "bad"
    f()
    """, coverage: "myCoverage", filename: "blah.gs"
    expect(x.code).to.match r'\+\+myCoverage\["blah.gs"\]\[\d+\]'
  
