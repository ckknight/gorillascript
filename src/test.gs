require! fs
require! path
require! assert
require! './gorilla'

let write = #(text)
  process.stdout.write text

let no-prelude = false
let mutable passed-tests = 0
let add-global(name, func)!
  GLOBAL[name] := #(...args)
    let result = func ...args
    passed-tests += 1
    result

for k of assert
  add-global k, assert[k]

add-global "success", #->
GLOBAL.eq := GLOBAL.strict-equal
GLOBAL.run-once := #(value)
  let f = #
    if f.ran
      fail "called more than once"
    f.ran := true
    value
  f.ran := false
  f

GLOBAL.gorilla := gorilla

let mutable current-file = null
let mutable num-failures = 0
let add-failure(filename, error)!
  num-failures += 1
  if filename
    console.log filename
  if error.description
    console.log "  $(error.description)"
  if error.stack
    console.log error.stack
  else
    console.log String(error)
  if error.source
    console.log error.source

GLOBAL.test := #(description, fn)!
  try
    fn.test := {
      description
      current-file
    }
    fn@ fn
  catch e
    e.description := description
    e.source := fn.to-string()
    add-failure fn.test.filename, e

let waiters = [[], []]
let handle-waiters()
  let mutable found = true
  while found
    found := false
    for type in waiters
      if type.length
        found := true
        type.splice((Math.random() * type.length) \ 1, 1)[0]()
        break
GLOBAL.async-test := #(description, fn)!
  fn.wait := #(get-value as ->, cb as ->)!
    waiters[0].push #-> fn.dont-wait(get-value, cb)
  fn.after := #(get-value as ->, cb as (null|Function))!
    waiters[1].push #-> fn.dont-wait(get-value, cb or #->)
  fn.dont-wait := #(get-value as ->, cb as ->)!
    let mutable result = void
    try
      result := get-value()
    catch e
      cb(e)
    else
      try
        cb(null, result)
      catch e
        e.description := description
        e.source := fn.to-string()
        add-failure fn.test.current-file, e
  test description, fn

let array-equal = #(a, b)
  if is-array! a
    unless is-array! b and a.length == b.length
      false
    else
      for every item, i in a
        array-equal item, b[i]
  else
    a is b

GLOBAL.array-eq := #(a, b, msg)
  if not array-equal a, b
    fail "$(JSON.stringify(a) or 'undefined') != $(JSON.stringify(b) or 'undefined')$(if msg then ': ' & msg else '')"
  else
    success()

let mutable total-time = 0

async err, filename-path <- fs.realpath __filename
throw? err
let tests-path = path.join(path.dirname(filename-path), "../tests")

async err, files <- fs.readdir tests-path
throw? err
if process.argv.length > 2
  files := for file in files
    if file in process.argv[2 to -1]
      file

files.sort()
let inputs = {}
asyncfor(0) err <- next, file, i in files
  unless r'\.gs$'i.test(file)
    return next()
  let filename = path.join tests-path, file
  async! next, code <- fs.read-file filename
  inputs[file] := { code, filename }
  next()
throw? err

let longest-name-len = for reduce file in files, current = 0
  path.basename(file).length max current

let string-repeat(text, count)
  if count < 1
    ""
  else if count == 1
    text
  else if count bitand 1
    text & string-repeat text, count - 1
  else
    string-repeat text & text, count / 2
let pad-left(mutable text, len, padding)
  string-repeat(padding, len - text.length) & text
let pad-right(mutable text, len, padding)
  text & string-repeat(padding, len - text.length)

if files.length == 0
  console.log "No files to test"
  return

asyncif next, not no-prelude
  async err <- gorilla.init()
  throw? err
  next()

write string-repeat(" ", longest-name-len)
write "     parse     macro     reduce    translate compile   eval            total\n"

let totals = {}
asyncfor err <- next, file in files
  if inputs not ownskey file
    return next(new Error("Missing file input for $file"))
  let {code, filename} = inputs[file]
  
  let basename = path.basename filename
  write "$(pad-right basename & ':', longest-name-len + 1, ' ') "
  let start = Date.now()
  let mutable failure = false
  let start-time = Date.now()
  current-file := filename
  let progress = #(name, time)
    totals[name] := (totals[name] or 0) + time
    write "  $(pad-left ((time / 1000_ms).to-fixed 3), 6, ' ') s"
  async err, result <- gorilla.eval code.to-string(), { filename, include-globals: true, no-prelude, progress }
  if err?
    write "\n"
    failure := true
    add-failure basename, err
  
  handle-waiters()
  
  let end-time = Date.now()
  total-time += end-time - start-time
  
  write " | $(if failure then 'fail' else 'pass') $(pad-left ((end-time - start-time) / 1000_ms).to-fixed(3), 6, ' ') s\n"
  gc?()
  next()
throw? err
if files.length > 1
  write string-repeat "-", longest-name-len + 63
  write "+"
  write string-repeat "-", 14
  write "\n"
  write pad-right "total: ", longest-name-len + 2, ' '
  for part in [\parse, \macro-expand, \reduce, \translate, \compile, \eval]
    write "  $(pad-left ((totals[part] / 1000_ms).to-fixed 3), 6, ' ') s"
  write " | "
  write if num-failures == 0 then "pass" else "fail"
  write " $(pad-left ((total-time / 1000_ms).to-fixed 3), 6, ' ') s\n"

let message = "passed $passed-tests tests"
if num-failures == 0
  console.log message
else
  console.log "failed $num-failures"
  set-timeout (# -> process.exit(1)), 100
