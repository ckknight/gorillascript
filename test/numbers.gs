let {expect} = require 'chai'
let gorilla = require '../index'

describe "Decimal numbers", #
  it "can be represented in scientific notation", #
    expect(1e0, "1e0").to.equal 1
    expect(1e1, "1e1").to.equal 10
    expect(10e-1, "10e-1").to.equal 1
    expect(1e9, "1e9").to.equal 1000000000
    expect(1.23456789e8, "1.23456789e8").to.equal 123456789
  
  it "can be represented by decimal notation", #
    expect(1234.5678).to.equal 12345678 / 10000
    expect(String 1234.5678).to.equal "1234.5678"
    expect(0.43).to.equal 43 / 100
    expect(String 0.43).to.equal "0.43"
    expect(-5).to.equal 5 - 10
    expect(-1.5).to.equal 3.5 - 5
    expect(-0.5).to.equal 4.5 - 5
  
  it "can have a trailing comment", #
    expect(525600_minutes).to.equal 1_year * 365_days_per_year * 24_hours_per_day * 60_minutes_per_hour
  
  it "can include ignored underscores", #
    expect(1_000_000).to.equal 1000000
    expect(1_0_0_0_0_0_0_).to.equal 1000000
    expect(1_234_._5678_).to.equal 1234.5678
  
  it "should be indexable", #
    expect(42.to-string).to.equal Number::to-string
    expect((-42).to-string).to.equal Number::to-string
    expect(1000_ms.to-string).to.equal Number::to-string
    expect(42["toString"]).to.equal Number::to-string
    expect((-42)["toString"]).to.equal Number::to-string
    expect(1000_ms["toString"]).to.equal Number::to-string
  
  it "can have a method passed a spread parameter", #
    let arr = [16]
    
    expect(4660.to-string ...arr).to.equal "1234"
    arr[0] := 10
    expect(4660.to-string ...arr).to.equal "4660"

describe "Infinity", #
  it "should not be finite", #
    expect(is-finite Infinity).to.be.false
  
  it "should be 1 / 0", #
    expect(Infinity).to.equal 1 / 0
  
  it "should be indexable", #
    expect(Infinity.to-string).to.equal Number::to-string
    expect((-Infinity).to-string).to.equal Number::to-string
    expect(Infinity["toString"]).to.equal Number::to-string
    expect((-Infinity)["toString"]).to.equal Number::to-string

describe "NaN", #
  it "should not be finite", #
    expect(is-finite NaN).to.be.false
  
  it "should not equal itself", #
    let x = NaN
    expect(NaN == x).to.be.false
  
  it "is indexable", #
    expect(NaN.to-string).to.equal Number::to-string
    expect(NaN["toString"]).to.equal Number::to-string

describe "Negative zero", #
  it "should equal positive zero", #
    expect(0 == -0).to.be.true
  
  it "should not be positive zero", #
    expect(0 is -0).to.be.false
  
  it "should form -Infinity when the divisor of 1", #
    expect(1 / -0).to.equal -Infinity
    let x = -0
    expect(1 / x).to.equal -Infinity

describe "Positive zero", #
  it "should form Infinity when the divisor of 1", #
    expect(1 / 0).to.equal Infinity
    let x = 0
    expect(1 / x).to.equal Infinity

describe "Hex numbers", #
  it "has literal representation", #
    expect(0xff).to.equal 255
    expect(0x0000000A).to.equal 0xa
    expect(0x0).to.equal 0
    expect(0X0).to.equal 0
    expect(0XDEADBEEF).to.equal 0xdeadbeef
  
  it "can include ignored underscores", #
    expect(0xde_ad_be_ef).to.equal 0xDEAD_BEEF
  
  it "can have a fractional component", #
    expect(0x0.1).to.equal 1 / 16
    expect(-0x0.3).to.equal -3 / 16
    expect(0x1_234.56_78).to.equal 0x1234 + 0x5678 / 0x10000
  
  it "should be indexable", #
    expect(0x1234.to-string).to.equal Number::to-string
    expect(0xde_ad_be_ef.to-string).to.equal Number::to-string
    expect(0x1234["toString"]).to.equal Number::to-string
    expect(0xde_ad_be_ef["toString"]).to.equal Number::to-string

describe "Octal numbers", #
  it "has literal representation", #
    expect(0o377).to.equal 255
    expect(0o0).to.equal 0
    expect(0O0).to.equal 0
    expect(0o0000000017).to.equal 15
  
  it "can include ignored underscores", #
    expect(0o12_34_56_70).to.equal 0o1234_5670
  
  it "can have a fractional component", #
    expect(0o0.1).to.equal 1 / 8
    expect(-0o0.3).to.equal -3 / 8
    expect(0o1_234.56_7).to.equal 0o1234 + 0o567 / 0o1000
  
  it "should be indexable", #
    expect(0o177.to-string).to.equal Number::to-string
    expect(0o177["toString"]).to.equal Number::to-string

describe "Binary numbers", #
  it "has literal representation", #
    expect(0b11110001001000000).to.equal 123456
    expect(0b0).to.equal 0
    expect(0B0).to.equal 0
    expect(0b00000001000101).to.equal 69
  
  it "can include ignored underscores", #
    expect(0b0001_0010_0011_0100).to.equal 0b0001001000110100
  
  it "can have a fractional component", #  
    expect(0b0.1).to.equal 0.5
    expect(0b0.01).to.equal 0.25
    expect(0b0.11).to.equal 0.75
    expect(0b101_0101.0101_01).to.equal 0b1010101 + 0b10101 / 0b1000000
  
  it "should be indexable", #
    expect(0b1000101.to-string).to.equal Number::to-string
    expect(0b1000101["toString"]).to.equal Number::to-string

describe "Arbitrary-radix numbers", #
  it "has literal representation", #
    expect(2r00000000001000101).to.equal 69
    expect(2r11110001001000000).to.equal 123456
    expect(8r361100).to.equal 123456
    expect(36rAlphabetSoup).to.equal 1395584131931951600
  
  it "can include ignored underscores", #
    expect(2r0001_0010_0011_0100).to.equal 0b0001001000110100
  
  it "can have a fractional component", #
    expect(16r1_234.56_78).to.equal 0x1234 + 0x5678 / 0x10000
    expect(8r1_234.56_7).to.equal 0o1234 + 0o567 / 0o1000
    expect(2r101_0101.0101_01).to.equal 0b1010101 + 0b10101 / 0b1000000
    expect(36rAlphabet.Soup).to.equal 36rAlphabet + 36rSoup / 36r10000
    expect(32r1_234.56_78).to.equal 32r1234 + 32r5678 / 32r10000
  
  it "should error if a radix is too small", #
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 1r00000""").throws gorilla.ParserError, r"Radix must be at least 2, got 1.*2:9"
  
  it "should error if a radix is too large", #
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 37r12345""").throws gorilla.ParserError, r"Radix must be at most 36, got 37.*2:9"

describe "Numbers too large", #
  it "should error if a number too large is encountered", #
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 1e1000""").throws gorilla.ParserError, r"Unable to parse number '1e1000'.*2:9"
    expect(#-> gorilla.compile-sync """let x = 0
    let y = $(Number.MAX_VALUE.to-string(9))""").throws gorilla.ParserError, r"Unable to parse number '$(Number.MAX_VALUE.to-string(9))'.*2:9"
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 0b$(Number.MAX_VALUE.to-string(2))0""").throws gorilla.ParserError, r"Unable to parse number '0b$(Number.MAX_VALUE.to-string(2))0'.*2:9"
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 0o$(Number.MAX_VALUE.to-string(8))0""").throws gorilla.ParserError, r"Unable to parse number '0o$(Number.MAX_VALUE.to-string(8))0'.*2:9"
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 0x$(Number.MAX_VALUE.to-string(16))0""").throws gorilla.ParserError, r"Unable to parse number '0x$(Number.MAX_VALUE.to-string(16))0'.*2:9"
    expect(#-> gorilla.compile-sync """let x = 0
    let y = 36r$(Number.MAX_VALUE.to-string(36))0""").throws gorilla.ParserError, r"Unable to parse number '36r$(Number.MAX_VALUE.to-string(36))0'.*2:9"
