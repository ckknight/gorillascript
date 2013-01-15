require! fs
require! path
let start-time = Date.now()
require! './gorilla'

async err, files <- fs.readdir './src'
throw? err

files := for file in files.sort()
  if (process.argv.length < 3 or file in process.argv[2:]) and file.match(r"\.gs\$"i) and file != "prelude.gs"
    file

let done(err)
  if err?
    console.log "Failure building after $(((Date.now() - start-time) / 1000).to-fixed 3) seconds\n"
    throw err
  else
    console.log "Finished building after $(((Date.now() - start-time) / 1000).to-fixed 3) seconds\n"

let inputs = {}
asyncfor(0) err <- next, file in files
  let filename = path.join "./src", file
  async err, code <- fs.read-file filename, "utf8"
  if err?
    return next(err)
  inputs[file] := { filename, code }
  next()
if err?
  return done(err)

let results = {}
for file in files
  let {filename, code} = inputs[file]
  process.stdout.write "$filename: "
  let start-file-time = Date.now()
  results[file] := gorilla.compile code, filename: filename
  process.stdout.write "$(((Date.now() - start-file-time) / 1000).to-fixed 3) seconds\n"

asyncfor(0) err <- next, file in files
  let compiled = results[file]
  let output-file = path.join "./lib", file.replace r"\.gs\$", ".js"
  async err <- fs.rename output-file, "$(output-file).bak"
  if err?
    return next(err)
  async err <- fs.write-file output-file, compiled, "utf8"
  if err?
    return next(err)
  next()
done(err)
