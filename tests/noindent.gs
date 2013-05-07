test "normal operations", #
  eq 16, gorilla.eval("""
  let mutable a = 0
  let b = 2
  a += b
  a *= b
  a ^= b
  a
  """, noindent: true)

test "normal operations, odd indentation", #
  eq 16, gorilla.eval("""
  let mutable a = 0
    let b = 2
  a += b
      a *= b
  a ^= b
    a
  """, noindent: true)

test "function declaration", #
  eq "hello", gorilla.eval("""
  let f():
  "hello"
  end
  f()
  """, noindent: true)

test "function declaration, single-line", #
  eq "hello", gorilla.eval("""
  let f() -> "hello"
  f()
  """, noindent: true)

test "anonymous function", #
  eq "hello", gorilla.eval("""
  let call(f) -> f()
  call #:
  "hello"
  end
  """, noindent: true)

test "anonymous function, single-line", #
  eq "hello", gorilla.eval("""
  let call(f) -> f()
  call #-> "hello"
  """, noindent: true)

test "do block", #
  eq "hello", gorilla.eval("""
  do :
  "hello"
  end
  """, noindent: true)

test "if expression", #
  eq "yes", gorilla.eval("""
  let x = 5
  if x == 5 then "yes"
  """, noindent: true)
  
  eq "no", gorilla.eval("""
  let x = 6
  if x == 5 then "yes" else "no"
  """, noindent: true)

test "if statement", #
  eq "yes", gorilla.eval("""
  let x = 5
  if x == 5:
  "yes"
  end
  """, noindent: true)

test "if-else statement", #
  eq "no", gorilla.eval("""
  let x = 5
  if x == 6:
  "yes"
  else:
  "no"
  end
  """, noindent: true)

test "C-style for loop", #
  eq 45, gorilla.eval("""
  let mutable i = 0
  let mutable sum = 0
  for ; i < 10; i += 1:
  sum += i
  end
  sum
  """, noindent: true)

test "while loop", #
  eq 45, gorilla.eval("""
  let mutable i = 0
  let mutable sum = 0
  while i < 10, i += 1:
  sum += i
  end
  sum
  """, noindent: true)

test "for-in loop", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  for x in [1, 2, 3]:
  sum += x
  end
  sum
  """, noindent: true)

test "for-in loop, single-line", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  for x in [1, 2, 3]; sum += x; end
  sum
  """, noindent: true)

test "for-in-else loop", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  let arr = [1, 2, 3]
  for x in arr:
  sum += x
  else:
  throw Error()
  end
  sum
  """, noindent: true)
  
  eq "none", gorilla.eval("""
  let mutable sum = 0
  let arr = []
  for x in arr:
  sum += x
  else:
  return "none"
  end
  sum
  """, noindent: true)

test "for-from loop", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  for x from [1, 2, 3]:
  sum += x
  end
  sum
  """, noindent: true)

test "for-from loop, single-line", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  for x from [1, 2, 3]; sum += x; end
  sum
  """, noindent: true)

test "for-from-else loop", #
  eq 6, gorilla.eval("""
  let mutable sum = 0
  let arr = [1, 2, 3]
  for x from arr:
  sum += x
  else:
  throw Error()
  end
  sum
  """, noindent: true)
  
  eq "none", gorilla.eval("""
  let mutable sum = 0
  let arr = []
  for x from arr:
  sum += x
  else:
  return "none"
  end
  sum
  """, noindent: true)

test "try", #
  eq "caught", gorilla.eval("""
  let o = {}
  try:
  throw o
  catch e:
  "caught"
  else:
  return "nope"
  end
  """, noindent: true)

  eq "nope", gorilla.eval("""
  let o = {}
  try:
  o.blah := true
  catch e:
  "caught"
  else:
  return "nope"
  end
  """, noindent: true)

test "switch", #
  eq "charlie", gorilla.eval("""
  let x = 4
  switch x
  case 0, 1:
    "alpha"
  case 2, 3; "bravo"
  case 4; "charlie"
  end
  """, noindent: true)
  
  eq "delta", gorilla.eval("""
  let x = 5
  switch x
  case 0, 1:
    "alpha"
  case 2, 3; "bravo"
  case 4; "charlie"
  default:
    "delta"
  end
  """, noindent: true)

test "topicless switch", #
  eq "charlie", gorilla.eval("""
  let x = 2
  switch
  case x == 0:
    "alpha"
  case x == 1; "bravo"
  case x == 2; "charlie"
  end
  """, noindent: true)
  
  eq "delta", gorilla.eval("""
  let x = 3
  switch x
  case x == 0:
    "alpha"
  case x == 1; "bravo"
  case x == 2; "charlie"
  default:
    "delta"
  end
  """, noindent: true)

test "macros", #
  eq 10, gorilla.eval('''
  macro double(value):
  ASTE $value * 2
  end
  double 5
  ''', noindent: true)
  
  eq "BOOM!", gorilla.eval('''
  macro boom:
  syntax "goes", "the", "dynamite":
  ASTE "BOOM!"
  end
  end
  boom goes the dynamite
  ''', noindent: true)

test "array literal", #
  eq 5, gorilla.eval("""
  let arr = [1
  2, 3
        4
  5]
  arr.length""", noindent: true)

test "object literal", #
  eq 4, gorilla.eval("""
  let obj = { a: 1
    b: 2
  c: 3
        d: 4
    e: 5
  }
  obj.d""", noindent: true)

test "unclosed object literal", #
  eq 2, gorilla.eval("""
  let obj = a: 1, b: 2, c: 3
  obj.b""", noindent: true)

