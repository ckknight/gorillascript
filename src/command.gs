require! cli
require! './gorilla'
require! util
require! fs
require! path
require! child_process

async err, which-gjs-stdout, which-gjs-stderr <- child_process.exec "which gjs"

let has-gjs = not err? and which-gjs-stdout.length and not which-gjs-stderr.length

cli.enable 'version'

cli.set-app "gorilla", gorilla.version

cli.set-usage "gorilla [OPTIONS] path/to/script.gs"

let parse-options =
  ast:          ["a", "Display JavaScript AST nodes instead of compilation"]
  compile:      ["c", "Compile to JavaScript and save as .js files"]
  output:       ["o", "Set the file/directory for compiled JavaScript", "path"]
  interactive:  ["i", "Run interactively with the REPL"]
  nodes:        ["n", "Display GorillaScript parser nodes instead of compilation"]
  stdout:       ["p", "Print the compiled JavaScript to stdout"]
  stdin:        ["s", "Listen for and compile GorillaScript from stdin"]
  eval:         ["e", "Compile and run a string from command line", "string"]
  uglify:       ["u", "Uglify compiled code with UglifyJS2"]
  minify:       [false, "Minimize the use of unnecessary whitespace"]
  sourcemap:    ["m", "Build a SourceMap", "file"]
  join:         ["j", "Join all the generated JavaScript into a single file"]
  "no-prelude": [false, "Do not include the standard prelude"]
  //js:           [false, "Compile to JavaScript (default)"]
  watch:        ["w", "Watch for changes and compile as-needed"]

if has-gjs
  parse-options <<<
    gjs:        [false, "Run with gjs"]

cli.parse parse-options

async filenames, options <- cli.main()

let lang = "js"

let opts = {}
if options.uglify
  opts.undefined-name := \undefined
  opts.uglify := true
if options.minify
  opts.minify := true

asyncif next, options["no-prelude"]
  opts.no-prelude := true
  next()
else
  async! throw <- gorilla.init { lang }
  next()

if options.stdout
  opts.writer := #(text) -> process.stdout.write text

let handle-code(code, callback = #->)
  asyncif err, result <- next, options.ast
    async! next, ast <- gorilla.ast code, opts
    next null, util.inspect ast.node, false, null
  else if options.nodes
    async! next, nodes <- gorilla.parse code, opts
    next null, util.inspect nodes.result, false, null
  else if options.stdout
    async! next, result <- gorilla.compile code, opts
    if opts.uglify
      process.stdout.write "\n"
    next null, result.code
  else if options.gjs
    async! next, compiled <- gorilla.compile code, { eval: true } <<< opts
    console.log "running with gjs"
    let gjs = child_process.spawn "gjs"
    gjs.stdout.on 'data', #(data) -> process.stdout.write data
    gjs.stderr.on 'data', #(data) -> process.stderr.write data
    gjs.stdin.write compiled.code
    set-timeout (#
      gjs.stdin.end()
      next null, ""), 50
  else
    async! next, result <- gorilla.eval code, opts
    next null, util.inspect result
  if err?
    callback(err)
  else
    if result != ""
      process.stdout.write "$result\n"
    callback()

if options.ast and options.compile
  console.error "Cannot specify both --ast and --compile"
else if options.ast and options.nodes
  console.error "Cannot specify both --ast and --nodes"
else if options.nodes and options.compile
  console.error "Cannot specify both --nodes and --compile"
else if options.output and not options.compile
  console.error "Must specify --compile if specifying --output"
else if options.sourcemap and not options.output
  console.error "Must specify --output if specifying --sourcemap"
else if filenames.length > 1 and options.sourcemap and not options.join
  console.error "Cannot specify --sourcemap with multiple files unless using --join"
else if options.eval?
  handle-code String(options.eval)
else if options.interactive and options.stdin
  console.error "Cannot specify --interactive and --stdin"
else if options.interactive and filenames.length
  console.error "Cannot specify --interactive and filenames"
else if options.stdin
  cli.with-stdin handle-code
else if options.watch and not filenames.length
  console.error "Cannot specify --watch without filenames"
else if options.watch and not options.compile
  console.error "Must specify --compile if specifying --watch"
else if options.watch and options.join
  console.error "TODO: Cannot specify --watch and --join"
else if options.watch and options.sourcemap
  console.error "TODO: Cannot specify --watch and --sourcemap"
else if filenames.length
  let sourcemap = if options.sourcemap then require("./sourcemap")(options.output, ".")
  opts.sourcemap := sourcemap
  
  let input = {}
  asyncfor(0) err <- next, filename in filenames
    async! next, code <- fs.read-file filename
    input[filename] := code.to-string()
    next()
  throw? err
  
  let compiled = {}
  let handle-single(filename, code, done as ->)
    opts.filename := filename
    if options.compile
      process.stdout.write "Compiling $(path.basename filename) ... "
      let start-time = Date.now()
      async! done, compilation <- gorilla.compile code, opts
      let end-time = Date.now()
      process.stdout.write "$(((end-time - start-time) / 1000_ms).to-fixed(3)) seconds\n"
      compiled[filename] := compilation.code
      done()
    else if options.stdout or options.gjs
      handle-code code, done
    else
      gorilla.run code, { extends opts, filename }, done
  
  asyncif next, not options.join
    asyncfor err <- done, filename in filenames
      handle-single filename, input[filename], done
    throw? err
    next()
  else
    opts.filenames := filenames
    async! throw, compilation <- gorilla.compile (for filename in filenames; input[filename]), opts
    compiled["join"] := compilation.code
    next()
  
  let get-js-output-path(filename)
    if options.output and filenames.length == 1
      options.output
    else
      let base-dir = path.dirname filename
      let dir = if options.output
        path.join options.output, base-dir
      else
        base-dir
      path.join dir, path.basename(filename, path.extname(filename)) & ".js"
  
  let write-single(filename, done as ->)
    let js-path = get-js-output-path filename
    let js-dir = path.dirname(js-path)
    async exists <- fs.exists js-dir
    asyncif next, not exists
      async <- child_process.exec "mkdir -p $js-dir"
      next()
    let js-code = compiled[filename]
    async! done <- fs.write-file js-path, js-code, "utf8"
    done()
  
  asyncif next, options.compile
    asyncif next, not options.join
      asyncfor(0) err <- next, filename in filenames
        write-single filename, next
      throw? err
      next()
    else
      let js-path = if options.output
        options.output
      else
        path.join(path.dirname(filenames[0]), "out.js")
      
      async! throw <- fs.write-file js-path, compiled.join, "utf8"
      next()
    next()
  
  asyncif next, sourcemap?
    async! throw <- fs.write-file options.sourcemap, opts.sourcemap.to-string(), "utf8"
    next()
  
  if options.watch
    let watch-queue = {}
    let handle-queue = do
      let mutable in-handle = false
      #
        if in-handle
          return
        in-handle := true
        let mutable lowest-time = new Date().get-time() - 1000_ms
        let mutable best-name = void
        for name, time of watch-queue
          if time < lowest-time
            lowest-time := time
            best-name := name
        if best-name?
          delete watch-queue[best-name]
          async! throw <- handle-single best-name, input[best-name]
          async! throw <- write-single best-name
          in-handle := false
          handle-queue()
        else
          in-handle := false
    for filename in filenames
      fs.watch filename, #(event, name = filename)!
        async err, code <- fs.read-file name
        input[name] := code.to-string()
        if watch-queue not ownskey name
          watch-queue[name] := new Date().get-time()
    set-interval handle-queue, 17
    console.log "Watching $(filenames.join ', ')..."
else
  require('./repl').start(if options.gjs then { pipe: "gjs" })
