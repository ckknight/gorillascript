require! './gorilla'
require! util
require! fs
require! path
require! child_process

async err, which-gjs-stdout, which-gjs-stderr <- child_process.exec "which gjs"

let has-gjs = not err? and which-gjs-stdout.length and not which-gjs-stderr.length

let optimist = require 'optimist'
  .usage '$0 [OPTIONS] path/to/script.gs', {
    help: { +boolean, desc: "Show this help screen" }
    v: { alias: "version", +boolean, desc: "GorillaScript v$(gorilla.version)" }
    a: { alias: "ast", +boolean, desc: "Display JavaScript AST nodes instead of compilation" }
    b: { alias: "bare", +boolean, desc: "Compile without safety top-level closure wrapper" }
    c: { alias: "compile", +boolean, desc: "Compile to JavaScript and save as .js files" }
    o: { alias: "output", +string, desc: "Set the file/directory for compiled JavaScript" }
    i: { alias: "interactive", +boolean, desc: "Run interactively with the REPL" }
    n: { alias: "parse", +boolean, desc: "Display GorillaScript parser nodes instead of compilation" }
    p: { alias: "stdout", +boolean, desc: "Print the compiled JavaScript to stdout" }
    s: { alias: "stdin", +boolean, desc: "Listen for and compile GorillaScript from stdin" }
    e: { alias: "eval", +string, desc: "Compile and a string from command line" }
    u: { alias: "uglify", +boolean, desc: "Uglify compiled code with UglifyJS2" }
    minify: { +boolean, desc: "Minimize the use of unnecessary whitespace" }
    m: { alias: "sourcemap", +string, desc: "Build a SourceMap" }
    j: { alias: "join", +boolean, desc: "Join all the generated JavaScript into a single file" }
    "no-prelude": { +boolean, desc: "Do not include the standard prelude" }
    w: { alias: "watch", +boolean, desc: "Watch for changes and compile as-needed" }
    options: { +string, desc: "a JSON object of options to pass into the compiler"}
  }

if has-gjs
  optimist.option "gjs", { +boolean, desc: "Run with gjs" }

optimist.check #(argv)
  let exclusive(...opts)!
    let mutable found = null
    for opt in opts
      if opt == \_
        if argv._.length
          if not found
            found := "filenames"
          else
            throw "Cannot specify both $found and filenames"
      else
        if argv[opt]
          if not found
            found := "--$opt"
          else
            throw "Cannot specify both $found and --$opt"
  let depend(main-opt, ...opts)!
    if argv[main-opt]
      for opt in opts
        if not argv[opt]
          throw "Must specify --$opt if specifying --$main-opt"
  exclusive \ast, \compile, \nodes, \stdout
  depend \output, \compile
  depend \sourcemap, \output
  depend \compile, \_
  exclusive \interactive, \_, \stdin, \eval
  depend \watch, \compile
  depend \join, \output
  if argv.watch
    if argv.join
      throw "TODO: --watch with --join"
    if argv.sourcemap
      throw "TODO: --watch with --sourcemap"
  if argv._.length > 1 and argv.sourcemap and not argv.join
    throw "Cannot specify --sourcemap with multiple files unless using --join"
  if argv.options
    try
      if not is-object! JSON.parse(argv.options)
        throw "Expected --options to provide an object"
    catch e as SyntaxError
      throw "Unable to parse options: $(e.message)"
  
let argv = optimist.argv

let read-stdin = #
  let defer = __defer()
  let mutable buffer = ""
  process.stdin.on 'data', #(chunk)
    buffer &= chunk.to-string()
  process.stdin.on 'end', #
    defer.fulfill buffer
  process.stdin.resume()
  defer.promise

let filenames = argv._
let main = promise!
  let lang = "js"

  if argv.help
    return optimist.show-help(console.log)
  
  if argv.version
    return console.log "GorillaScript v$(gorilla.version)"
  
  let options = {}
  if argv.options
    options <<< JSON.parse(argv.options)
  if argv.uglify
    options.undefined-name := \undefined
    options.uglify := true
  if argv.minify
    options.minify := true
  if argv.bare
    options.bare := true

  if argv["no-prelude"]
    options.no-prelude := true
  else
    yield gorilla.init { lang }
  
  if argv.interactive or (not filenames.length and not argv.stdin and not argv.eval)
    let repl-opts = {
      argv.stdout
      argv.parse
      argv.ast
    }
    if argv.gjs
      repl-opts.pipe := "gjs"
    return require('./repl').start(repl-opts)
  
  if argv.stdout
    options.writer := #(text) -> process.stdout.write text
  
  let handle-code = promise! #(code)*
    let result = if argv.ast
      let ast = yield gorilla.ast code, options
      util.inspect ast.node, false, null
    else if argv.parse
      let nodes = yield gorilla.parse code, options
      util.inspect nodes.result, false, null
    else if argv.stdout
      let compiled = yield gorilla.compile code, options
      if options.uglify
        process.stdout.write "\n"
      compiled.code
    else if argv.gjs
      let compiled = yield gorilla.compile code, { +\eval } <<< options
      console.log "running with gjs"
      let gjs = child_process.spawn "gjs"
      gjs.stdout.on 'data', #(data) -> process.stdout.write data
      gjs.stderr.on 'data', #(data) -> process.stderr.write data
      gjs.stdin.write compiled.code
      yield delay! 50_ms
      gjs.stdin.end()
      ""
    else
      let evaled = yield gorilla.eval code, options
      util.inspect evaled, false, null
    if result != ""
      process.stdout.write result
      process.stdout.write "\n"

  if argv.eval?
    return yield handle-code String(argv.eval)
  
  if argv.stdin
    let code = yield read-stdin()
    return yield handle-code String(code)
  
  if not filenames.length
    throw Error "Trying to compile without filenames"
  
  let sourcemap = if argv.sourcemap then require("./sourcemap")(argv.output, ".")
  options.sourcemap := sourcemap

  if argv["embedded-generator"]
    options.embedded-generator := true
    argv.embedded := true
  
  if argv.embedded
    options.embedded := true
    options.noindent := true
  
  let input-p = {}
  for filename in filenames
    input-p[filename] := to-promise! fs.read-file filename, "utf8"

  let input = yield every-promise! input-p

  let compiled = {}
  let handle-single = promise! #(filename, code)*
    options.filename := filename
    if argv.compile
      process.stdout.write "Compiling $(path.basename filename) ... "
      let start-time = Date.now()
      let compilation = yield gorilla.compile code, options
      let end-time = Date.now()
      process.stdout.write "$(((end-time - start-time) / 1000_ms).to-fixed(3)) seconds\n"
      compiled[filename] := compilation.code
    else if argv.stdout or argv.gjs or argv.ast or argv.parse
      yield handle-code code
    else
      yield gorilla.run code, options

  if not argv.join
    for filename in filenames
      yield handle-single filename, input[filename]
  else
    options.filenames := filenames
    process.stdout.write "Compiling $(filenames.join ", ") ... "
    let start-time = Date.now()
    let compilation = yield gorilla.compile (for filename in filenames; input[filename]), options
    let end-time = Date.now()
    process.stdout.write "$(((end-time - start-time) / 1000_ms).to-fixed(3)) seconds\n"
    compiled["join"] := compilation.code

  let get-js-output-path(filename)
    if argv.output and filenames.length == 1
      argv.output
    else
      let base-dir = path.dirname filename
      let dir = if argv.output
        path.join argv.output, base-dir
      else
        base-dir
      path.join dir, path.basename(filename, path.extname(filename)) & ".js"

  let write-single = promise! #(filename, js-code)*
    let js-path = get-js-output-path filename
    let js-dir = path.dirname(js-path)
    let defer = __defer()
    fs.exists js-dir, defer.fulfill
    let exists = yield defer.promise
    if not exists
      yield to-promise! child_process.exec "mkdir -p $js-dir"
    yield to-promise! fs.write-file js-path, js-code, "utf8"

  if argv.compile
    if not argv.join
      for filename in filenames
        yield write-single filename, compiled[filename]
    else
      yield write-single argv.output, compiled.join

  if sourcemap?
    yield to-promise! fs.write-file argv.sourcemap, options.sourcemap.to-string(), "utf8"
    process.stdout.write "Saved $(argv.sourcemap)"
  
  if argv.watch
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
          promise!
            try
              yield handle-single best-name, input[best-name]
              yield write-single best-name
            catch e
              console.error e?.stack or e
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
main.then null, #(e)
  console.error e?.stack or e
  process.exit(1)
