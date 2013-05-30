let {expect} = require 'chai'
let gorilla = require '../index'
let ast = require (if process.env.GORILLA_COV then '../lib-cov/jsast' else '../lib/jsast')

describe "ast-pipe", #
  it "can alter the AST of the JavaScript", #
    let x = gorilla.compile-sync """
    console.log "Hello, world!"
    """, ast-pipe: #(node)
      node.walk #(subnode)
        if subnode.is-const() and subnode.const-value() == "Hello, world!"
          ast.Const subnode.pos, "Goodbye, world!"
    expect(x.code).to.match r"Goodbye, world!"
    expect(x.code).to.not.match r"Hello, world!"
