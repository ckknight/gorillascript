require! fs
require! path
require! assert
require! './gorilla'

let no-prelude = false
let mutable passed-tests = 0
let add-global(name, func)!
  global[name] := #(...args)
    let result = func ...args
    passed-tests += 1
    result

for k of assert
  add-global k, assert[k]

add-global "success", #->
global.eq := global.strict-equal
global.run-once := #(value)
  let f = #
    if f.ran
      fail "called more than once"
    f.ran := true
    value
  f.ran := false
  f

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

global.test := #(description, fn)!
  try
    fn.test := {
      description
      current-file
    }
    fn@ fn
  catch e
    e.description := description
    e.source := fn.to-string()
    add-failure current-file, e

let array-equal = #(a, b)
  if a == b
    return a != 0 or (1 / a == 1 / b)
  else if Array.is-array a
    unless Array.is-array(b) and a.length == b.length
      false
    else
      for every item, i in a
        array-equal item, b[i]
  else
    a != a and b != b

global.array-eq := #(a, b, msg)
  if not array-equal a, b
    fail "$(JSON.stringify a) != $(JSON.stringify b)$(if msg then ': ' & msg else '')"
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
    if file in process.argv[2:]
      file

asyncfor next, file, i in files
  if i == 0 and not no-prelude
    gorilla.init()
  unless r'\.gs$'i.test(file)
    return next()
  
  let filename = current-file := path.join tests-path, file
  async err, code <- fs.read-file filename
  throw? err
  let basename = path.basename filename
  process.stdout.write "$basename: "
  let start = Date.now()
  let mutable failure = false
  let mutable result = void
  let start-time = Date.now()
  let mutable end-time = void
  try
    result := gorilla.eval code.to-string(), filename: filename, include-globals: true, no-prelude: no-prelude
  catch e
    failure := true
    add-failure basename, e
  finally
    end-time := Date.now()
    total-time += end-time - start-time
  
  asyncif end, basename.index-of("async") != -1
    set-timeout end, 500
  
  process.stdout.write "$(if failure then 'fail' else 'pass') $(((end-time - start-time) / 1000_ms).to-fixed(3)) seconds\n"
  next()

let message = "passed $passed-tests tests in $((total-time / 1000_ms).to-fixed(3)) seconds"
if num-failures == 0
  console.log message
else
  console.log "failed $num-failures and $message"
  set-timeout (# -> process.exit(1)), 100
