let {expect} = require 'chai'
let gorilla = require '../index'
let coverage = require '../lib/coverage'

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
    """, ast-pipe: coverage, filename: "blah.gs"
    expect(x.code).to.match r'\+\+_\$jscoverage\["blah.gs"\]\[\d+\]'
