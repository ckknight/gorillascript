require! fs
require! path
require! assert
require! './monkey'

let mutable passedTests = 0
let addGlobal(name, func)!
  global[name] := #(...args)
    let result = func.apply(null, args)
    passedTests += 1
    result

for k of assert
  addGlobal k, assert[k]

addGlobal "success", #->
global.eq := global.strictEqual
global.runOnce := #(value)
  let f = #
    if f.ran
      fail "called more than once"
    f.ran := true
    value
  f.ran := false
  f

let mutable currentFile = null
let mutable numFailures = 0
let addFailure(filename, error)!
  numFailures += 1
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
      currentFile
    }
    fn.call(fn)
  catch e
    e.description := description
    e.source := fn.toString()
    addFailure currentFile, e

let arrayEqual = #(a, b)
  if a == b
    return a != 0 or (1 / a == 1 / b)
  else if Array.isArray a
    unless Array.isArray(b) and a.length == b.length
      false
    else
      for every item, i in a
        arrayEqual item, b[i]
  else
    a != a and b != b

global.arrayEq := #(a, b, msg)
  if not arrayEqual a, b
    fail "$(JSON.stringify a) != $(JSON.stringify b)$(if msg then ': ' & msg else '')"
  else
    success()

let startTime = Date.now()


async err, filenamePath <- fs.realpath __filename
throw? err
let testsPath = path.join(path.dirname(filenamePath), "../tests")

async err, files <- fs.readdir testsPath
throw? err
if process.argv.length > 2
  files := for file in files
    if file == process.argv[2]
      file

asyncfor next, file in files
  unless r'\.ms$'i.test(file)
    return next()
  
  let filename = (currentFile := path.join testsPath, file)
  async err, code <- fs.readFile filename
  throw? err
  let basename = path.basename filename
  process.stdout.write "$basename: "
  let start = Date.now()
  let mutable failure = false
  let mutable result = void
  try
    result := monkey.eval code.toString(), includeGlobals: true
  catch e
    failure := true
    addFailure basename, e
  
  asyncif end, basename.indexOf("async") != -1
    setTimeout end, 100
  
  process.stdout.write "$(if failure then 'fail' else 'pass') $(((Date.now() - start) / 1000_ms).toFixed(3)) seconds\n"
  next()

let time = ((Date.now() - startTime) / 1000_ms).toFixed(3)
let message = "passed $passedTests tests in $time seconds"
if numFailures == 0
  console.log message
else
  console.log "failed $numFailures and $message"
  setTimeout (# -> process.exit(1)), 100
