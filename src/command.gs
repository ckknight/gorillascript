require! cli
require! './gorilla'
require! util
require! fs
require! path
require! child_process

async err, which-gjs-stdout, which-gjs-stderr <- child_process.exec "which gjs"

let has-gjs = not err? and which-gjs-stdout.length and not which-gjs-stderr.length

cli.enable 'version'

cli.set-app "gorilla", "1.0"

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
  sourcemap:    ["m", "Build a SourceMap", "file"]
  join:         ["j", "Join all the generated JavaScript into a single file"]
  "no-prelude": [false, "Do not include the standard prelude"]
  //js:           [false, "Compile to JavaScript (default)"]

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

asyncif next, options["no-prelude"]
  opts.no-prelude := true
  next()
else
  async err <- gorilla.init { lang }
  throw? err
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
else if filenames.length
  let input = {}
  asyncfor(0) err <- next, filename in filenames
    async! next, code <- fs.read-file filename
    input[filename] := code.to-string()
    next()
  throw? err
  
  let sourcemap = if options.sourcemap then require("./sourcemap")(options.output, ".")
  opts.sourcemap := sourcemap
  
  let compiled = {}
  asyncif next, not options.join
    asyncfor err <- done, filename in filenames
      let code = input[filename]
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
    throw? err
    next()
  else
    opts.filenames := filenames
    async err, compilation <- gorilla.compile (for filename in filenames; input[filename]), opts
    throw? err
    compiled["join"] := compilation.code
    next()
  
  if options.compile
    if not options.join
      asyncfor(0) next, filename in filenames
        let js-filename = path.basename(filename, path.extname(filename)) & ".js"
        let source-dir = path.dirname filename
        let base-dir = source-dir
        let js-path = if options.output and filenames.length == 1
          options.output
        else
          let dir = if options.output
            path.join options.output, base-dir
          else
            source-dir
          path.join dir, js-filename
        let js-dir = path.dirname(js-path)
        async exists <- fs.exists js-dir
        asyncif done, not exists
          async <- child_process.exec "mkdir -p $js-dir"
          done()
        let js-code = compiled[filename]
        async err <- fs.write-file js-path, js-code, "utf8"
        if err
          cli.error err.to-string()
        next()
    else
      let js-path = if options.output
        options.output
      else
        path.join(path.dirname(filenames[0]), "out.js")
      
      async err <- fs.write-file js-path, compiled.join, "utf8"
      if err
        cli.error err.to-string()
  
  if sourcemap?
    async err <- fs.write-file options.sourcemap, opts.sourcemap.to-string(), "utf8"
    if err
      cli.error err.to-string()
else
  require('./repl').start(if options.gjs then { pipe: "gjs" })
