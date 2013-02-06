require! fs
require! path
let start-time = Date.now()
require! './gorilla'

async err, files <- fs.readdir './src'
throw? err

let argv = process.argv[2 to -1]

let options = {}
if argv[0] == "--uglify"
  options.uglify := true
  options.undefined-name := \undefined
  argv.shift()

files := for file in files.sort()
  if (argv.length == 0 or file in argv) and file.match(r"\.gs\$"i) and file != "prelude.gs"
    file

let write(text)
  process.stdout.write text

let done(err)
  if err?
    console.log "Failure building after $(((Date.now() - start-time) / 1000_ms).to-fixed 3) seconds\n"
    throw err
if files.length == 0
  return done(null)

async! done, err <- gorilla.init()

let inputs = {}
asyncfor(0) err <- next, file in files
  let filename = path.join "./src", file
  async! next, code <- fs.read-file filename, "utf8"
  inputs[file] := { filename, code }
  next()
if err?
  return done(err)

let longest-name-len = for reduce file in files, current = 0
  file.length max current

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

write string-repeat(" ", longest-name-len)
write "     parse     macro     reduce    translate compile $(if options.uglify then '  uglify  ' else '')|  total\n"
let totals = {}
let mutable total-time = 0
let results = {}
asyncfor err <- next, file in files
  let {filename, code} = inputs[file]
  write "$(pad-right file & ':', longest-name-len + 1, ' ') "
  let start-file-time = Date.now()
  let progress = #(name, time)!
    totals[name] := (totals[name] or 0) + time
    write "  $(pad-left ((time / 1000_ms).to-fixed 3), 6, ' ') s"
  async err, compiled <- gorilla.compile code, { extends options, filename: filename, progress: progress }
  if err?
    write "\n"
    return next(err)
  results[file] := compiled.code
  let end-file-time = Date.now()
  let file-time = end-file-time - start-file-time
  write " | $(pad-left ((file-time / 1000_ms).to-fixed 3), 6, ' ') s\n"
  total-time += file-time
  gc?()
  next()
if err?
  return done(err)
if files.length > 1
  write string-repeat "-", longest-name-len + 53
  if options.uglify
    write string-repeat "-", 10
  write "+"
  write string-repeat "-", 9
  write "\n"
  write pad-right "total: ", longest-name-len + 2, ' '
  for part in [\parse, \macro-expand, \reduce, \translate, \compile, ...if options.uglify then [\uglify] else []]
    write "  $(pad-left ((totals[part] / 1000_ms).to-fixed 3), 6, ' ') s"
  write " | $(pad-left ((total-time / 1000_ms).to-fixed 3), 6, ' ') s\n"

asyncfor(0) err <- next, file in files
  let compiled = results[file]
  let output-file = path.join "./lib", file.replace r"\.gs\$", ".js"
  async err <- fs.rename output-file, "$(output-file).bak"
  if err? and err.code != \ENOENT
    return next(err)
  async! next <- fs.write-file output-file, compiled, "utf8"
  next()
done(err)
