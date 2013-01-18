test "basic regular expression literals", #
  ok r"a" instanceof RegExp
  ok r'a' instanceof RegExp
  ok "a".match(r"a")
  ok "a".match r"a"
  ok "a".match(r"a"g)
  ok "a".match r"a"g
  ok r"a".test("a")
  ok r"a".test "a"
  ok r"a"g.test("a")
  ok r"a"g.test "a"

test "regular expressions should be indexable", #
  eq "0", r"0".source
  eq "0", r"$(0)".source
  eq "0", r'0'.source
  eq '$(0)', r'$(0)'.source
  eq "0", r"0"["source"]
  eq "0", r"$(0)"["source"]
  eq "0", r'0'["source"]
  eq '$(0)', r'$(0)'["source"]
  
  ok r"asdf"g.global
  ok not r"asdf"g.ignore-case
  ok not r"asdf"g.multiline
  ok not r"asdf"i.global
  ok r"asdf"i.ignore-case
  ok not r"asdf"i.multiline
  ok not r"asdf"m.global
  ok not r"asdf"m.ignore-case
  ok r"asdf"m.multiline
  ok not r"asdf".global
  ok not r"asdf".ignore-case
  ok not r"asdf".multiline
  ok r"asdf"gim.global
  ok r"asdf"gim.ignore-case
  ok r"asdf"gim.multiline

test "slashes are allowed in regexes", #
  ok r'^a/b$'.test "a/b"
  ok r"^a/b\$".test "a/b"
  ok r"^a\/b\$".test "a/b"
  ok r"^a\\/b\$".test "a\\/b"
  ok r"^a\\\/b\$".test "a\\/b"

test "regexes will escape backspaces", #
  eq "\\\\", r"\\".source

test "a triple-quoted regex will ignore whitespace and allow comments", #
  eq r"Ihavenowhitespace".source, r"""
  I
    have # and this is a comment
      no # and another comment
        whitespace""".source

test "a triple-quoted regex can have interpolation", #
  let value = "bravo"
  eq r"alphabravocharlie".source, r"""
  alpha
  $value # previously, that was a value.
  charlie
  """.source

test "and empty regex will compile to an empty, non-capturing group", #
  let regex = r""
  
  let match = regex.exec "test"
  ok match
  eq "", match[0]

test "Bad regex will throw a proper exception", #
  throws #-> gorilla.compile("""let x = 0
  let y = r'+'"""), #(e) -> e.line == 2
