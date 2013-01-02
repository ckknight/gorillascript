test "Double-quoted", #
  let word = "hello"
  eq 5, word.length
  eq "olleh", word.split("").reverse().join("")
  eq 0, "".length

test "Single-quoted", #
  let word = 'hello'
  eq 5, word.length
  eq 'olleh', word.split('').reverse().join('')
  eq 0, ''.length

test "Triple-double-quoted", #
  let paragraph = """
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
  est laborum.
  """
  eq "L", paragraph.charAt(0)
  eq ".", paragraph.charAt(paragraph.length - 1)
  eq 69, paragraph.split(RegExp("\\s+")).length
  eq 'Hello, "friend".', """Hello, "friend"."""
  
  let phrase = """
  Hello, friend!
  I am well today.
  """
  eq "Hello, friend!\nI am well today.", phrase
  
  eq "\nAlpha\n\nBravo\nCharlie\n\nDelta\n", """

  Alpha
    
  Bravo   
  Charlie

  Delta   
    
  """
  
  eq "Alpha\n  Bravo\n    Charlie\n  Delta\nEcho", """
  Alpha
    Bravo
      Charlie
    Delta
  Echo
  """
  
  eq "Alpha\nBravo\nCharlie", """
  Alpha
  Bravo
  Charlie"""
  
  eq 0, """""".length
  eq "", """"""

test "Triple-single-quoted", #
  let paragraph = '''
  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
  est laborum.
  '''
  
  eq "L", paragraph.charAt(0)
  eq ".", paragraph.charAt(paragraph.length - 1)
  eq 69, paragraph.split(RegExp("\\s+")).length
  eq "Hello, 'friend'.", '''Hello, 'friend'.'''
  
  let phrase = '''
  Hello, friend!
  I am well today.
  '''
  eq 'Hello, friend!\nI am well today.', phrase
  
  eq '\nAlpha\n\nBravo\nCharlie\n\nDelta\n', '''

  Alpha 
    
  Bravo   
  Charlie  

  Delta 
      
  '''
  
  eq 'Alpha\n  Bravo\n    Charlie\n  Delta\nEcho', '''
  Alpha
    Bravo
      Charlie
    Delta
  Echo
  '''
  
  eq 'Alpha\nBravo\nCharlie', '''
  Alpha
  Bravo
  Charlie'''
  
  eq 0, ''''''.length
  eq '', ''''''

test "Comments still persist in strings", #
  let alpha = "// hello"
  eq 8, alpha.length
  eq "olleh //", alpha.split("").reverse().join("")
  
  let bravo = '// there'
  eq 8, bravo.length
  eq "ereht //", bravo.split("").reverse().join("")
  
  let charlie = "/* ladies */"
  eq 12, charlie.length
  eq "/* seidal */", charlie.split("").reverse().join("")
  
  let delta = '/* and */'
  eq 9, delta.length
  eq "/* dna */", delta.split("").reverse().join("")
  
  let echo = """// gentlemen"""
  eq 12, echo.length
  eq "nemeltneg //", echo.split("").reverse().join("")
  
  let foxtrot = '''// how'''
  eq 6, foxtrot.length
  eq "woh //", foxtrot.split("").reverse().join("")
  
  let golf = """/* are */"""
  eq 9, golf.length
  eq "/* era */", golf.split("").reverse().join("")
  
  let hotel = '''/* you? */'''
  eq 10, hotel.length
  eq "/* ?uoy */", hotel.split("").reverse().join("")

test "Interpolation", #
  let value = 5
  eq "value: 5", "value: $(value)"
  eq 'value: 5', "value: $value"
  eq "value: 5", """value: $(value)"""
  eq "value: 5", """value: $value"""
  eq "5", "$(value)"
  eq "5", "$value"
  eq " ", "$(' ')"
  eq "", "$('')"
  eq "", "$( )"
  eq "(", """$("(")"""
  eq ")", """$(")")"""
  eq "(", "$('(')"
  eq ")", "$(')')"
  eq '$(value)', "\$(value)"
  eq '$value', "\$value"
  eq 'alpha $(value)', "alpha \$(value)"
  eq 'alpha $value', "alpha \$value"
  eq 'alpha $(value) bravo', "alpha \$(value) bravo"
  eq 'alpha $value bravo', "alpha \$value bravo"
  eq 'alpha 5 bravo', "alpha $(value) bravo"
  eq 'alpha 5 bravo', "alpha $value bravo"
  eq '$(value) bravo', "\$(value) bravo"
  eq '$value bravo', "\$value bravo"
  eq "525", "$(value)$(value * value)"
  eq "5 * 5 = 25", "$value * $value = $(value ^ 2)"
  eq "value:\n5", "value:\n$(value)"
  eq "value:\n5", "value:\n$value"

test "Escape codes", #
  eq 'Hello, "friend"', "Hello, \"friend\""
  eq "Hello, 'friend'", 'Hello, \'friend\''
  eq "\b", String.fromCharCode(8)
  eq "\f", String.fromCharCode(12)
  eq "\n", String.fromCharCode(10)
  eq "\r", String.fromCharCode(13)
  eq "\t", String.fromCharCode(9)
  eq "\v", String.fromCharCode(11)
  eq "\\", String.fromCharCode(92)
  eq "\x0f", String.fromCharCode(15)
  eq "\xff", String.fromCharCode(255)
  eq "\u000f", String.fromCharCode(15)
  eq "\u00ff", String.fromCharCode(255)
  eq "\u0fff", String.fromCharCode(4095)
  eq "\uffff", String.fromCharCode(65535)
  eq "\0", String.fromCharCode(0)
  eq "\1", String.fromCharCode(1)
  eq "\2", String.fromCharCode(2)
  eq "\3", String.fromCharCode(3)
  eq "\4", String.fromCharCode(4)
  eq "\5", String.fromCharCode(5)
  eq "\6", String.fromCharCode(6)
  eq "\7", String.fromCharCode(7)

/*
test "Raw strings", #
  eq "", @""
  eq "simple", @"simple"
  eq "con\"cat", @"con""cat"
  eq "\\b\\f\\n\\r\\t\\v\\\\\\xff\\u00ff\\0\\1\\2\\3\\4\\5\\6\\7", @"\b\f\n\r\t\v\\\xff\u00ff\0\1\2\3\4\5\6\7"
  eq "\\\\", @"\\"
  eq "c:\\program files", @"c:\program files"
*/
test "Indexing", #
  eq String::toString, "".toString
  eq String::toString, ''.toString
  eq String::toString, """""".toString
  eq String::toString, ''''''.toString
  /*
  eq String::toString, @"".toString
  eq String::toString, @''.toString
  eq String::toString, @"""""".toString
  eq String::toString, @''''''.toString
  */
  eq String::toString, ""["toString"]
  eq String::toString, ''["toString"]
  eq String::toString, """"""["toString"]
  eq String::toString, ''''''["toString"]
  /*
  eq String::toString, @""["toString"]
  eq String::toString, @''["toString"]
  eq String::toString, @""""""["toString"]
  eq String::toString, @''''''["toString"]
  */

/*
test "Newlines", -> do
  eq "alpha\nbravo", eval(Cotton.compile('"""alpha\r\nbravo"""', bare: true))
end
*/