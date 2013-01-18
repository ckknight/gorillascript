test "Hex", #
  eq 255, 0xff
  eq 0xa, 0x0000000A
  eq 0X0, 0x0
  eq 0xDEADBEEF, 0xdeadbeef

test "Octal", #
  eq 255, 0o377
  eq 0o0, 0O0
  eq 15, 0o0000000017

test "Binary", #
  eq 123456, 0b11110001001000000
  eq 0B101, 0b101
  eq 69, 0b000000001000101

test "Radix", #
  eq 69, 2r00000000001000101
  eq 123456, 2r11110001001000000
  eq 123456, 8r361100
  eq 1395584131931951600, 36rAlphabetSoup

test "Exponential", #
  eq 1, 1e0
  eq 10, 1e1
  eq 1000000000, 1e9
  eq 123456789, 1.23456789e8

test "Decimal", #
  eq 1234.5678, 12345678 / 10000
  eq -5, 5 - 10
  eq -1.5, 3.5 - 5
  eq -0.5, 4.5 - 5

test "Commented", #
  eq 525600_minutes, 1_year * 365_days_per_year * 24_hours_per_day * 60_minutes_per_hour

test "Underscore-separated", #
  eq 1000000, 1_000_000
  eq 0xDEAD_BEEF, 0xde_ad_be_ef
  eq 0o1234_5670, 0o12_34_56_70
  eq 2r0001_0010_0011_0100, 2r0001001000110100

test "Fractional hex", #
  eq 1/16, 0x0.1
  eq -3/16, -0x0.3
  eq 0x1234 + 0x5678 / 0x10000, 0x1_234.56_78

test "Fractional octal", #
  eq 1/8, 0o0.1
  eq -3/8, -0o0.3
  eq 0o1234 + 0o567 / 0o1000, 0o1_234.56_7

test "Fractional binary", #
  eq 0.5, 0b0.1
  eq 0.25, 0b0.01
  eq 0.75, 0b0.11
  eq 0b1010101 + 0b10101 / 0b1000000, 0b101_0101.0101_01

test "Fractional radix", #
  eq 0x1234 + 0x5678 / 0x10000, 16r1_234.56_78
  eq 0o1234 + 0o567 / 0o1000, 8r1_234.56_7
  eq 0b1010101 + 0b10101 / 0b1000000, 2r101_0101.0101_01
  eq 36rAlphabet + 36rSoup / 36r10000, 36rAlphabet.Soup

test "Numbers should be indexable", #
  eq Number::to-string, 42.to-string
  eq Number::to-string, 0x1234.to-string
  eq Number::to-string, (42).to-string
  eq Number::to-string, (-42).to-string
  eq Number::to-string, 0xde_ad_be_ef.to-string
  eq Number::to-string, 1000_ms.to-string
  eq Number::to-string, 0b1000101.to-string
  eq Number::to-string, 0o177.to-string
  eq Number::to-string, 2r1000101.to-string
  eq Number::to-string, Infinity.to-string
  eq Number::to-string, (-Infinity).to-string
  eq Number::to-string, NaN.to-string
  eq Number::to-string, 42["toString"]
  eq Number::to-string, 0x1234["toString"]
  eq Number::to-string, (42)["toString"]
  eq Number::to-string, (-42)["toString"]
  eq Number::to-string, 0xde_ad_be_ef["toString"]
  eq Number::to-string, 1000_ms["toString"]
  eq Number::to-string, 0b1000101["toString"]
  eq Number::to-string, 0o177["toString"]
  eq Number::to-string, 2r1000101["toString"]
  eq Number::to-string, Infinity["toString"]
  eq Number::to-string, (-Infinity)["toString"]
  eq Number::to-string, NaN["toString"]

test "Negative zero stays negative", #
  ok 1 / -0 == -Infinity
  let x = -0
  ok 1 / x == -Infinity

test "Positive zero stays negative", #
  ok 1 / 0 == Infinity
  let x = 0
  ok 1 / x == Infinity

test "Passing a spread to a method of a literal number", #
  let arr = [16]
  
  eq "1234", 4660.to-string ...arr
  arr[0] := 10
  eq "4660", 4660.to-string ...arr


test "Numbers too large", #
  throws #-> gorilla.compile("""let x = 0
  let y = 1e1000"""), #(e) -> e.line == 2
  throws #-> gorilla.compile("""let x = 0
  let y = #{Number.MAX_VALUE.to-string(9)}"""), #(e) -> e.line == 2
  throws #-> gorilla.compile("""let x = 0
  let y = 0b#{Number.MAX_VALUE.to-string(2)}0"""), #(e) -> e.line == 2
  throws #-> gorilla.compile("""let x = 0
  let y = 0o#{Number.MAX_VALUE.to-string(8)}0"""), #(e) -> e.line == 2
  throws #-> gorilla.compile("""let x = 0
  let y = 0x#{Number.MAX_VALUE.to-string(16)}0"""), #(e) -> e.line == 2
  throws #-> gorilla.compile("""let x = 0
  let y = 36r#{Number.MAX_VALUE.to-string(36)}0"""), #(e) -> e.line == 2

