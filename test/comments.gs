let {expect} = require 'chai'
let gorilla = require('../index')

describe "License comments", #
  it "should appear in result code", #
    expect(gorilla.compile-sync("""
    /*!
      This is my license
    */
    """).code).to.contain("This is my license")
  
  it "should error if it never ends", #
    expect(#-> gorilla.compile-sync """
    let x = 0
    /*!
      This is my license
    """).throws gorilla.ParserError, r"Multi-line license comment never ends at.*2:1"

describe "Multi-line comments", #
  it "should error if it never ends", #
    expect(#-> gorilla.compile-sync """
    let x = 0
    /*
      This is a comment
    """).throws gorilla.ParserError, r"Multi-line comment never ends at.*2:1"