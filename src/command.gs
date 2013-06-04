import 'shared.gs'

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
    m: { alias: "map", +string, desc: "Build a SourceMap" }
    "source-root": { +string, desc: "Specify a sourceRoot in a SourceMap, defaults to ''"}
    j: { alias: "join", +boolean, desc: "Join all the generated JavaScript into a single file" }
    "no-prelude": { +boolean, desc: "Do not include the standard prelude" }
    w: { alias: "watch", +boolean, desc: "Watch for changes and compile as-needed" }
    options: { +string, desc: "a JSON object of options to pass into the compiler" }
    coverage: { +boolean, desc: "Instrument with _\$jscoverage support" }
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
  exclusive \nodes, \cov
  depend \output, \compile
  depend \map, \output
  depend "source-root", \map
  depend \compile, \_
  exclusive \interactive, \_, \stdin, \eval
  depend \watch, \compile
  depend \join, \output
  if argv.watch
    if argv.join
      throw "TODO: --watch with --join"
    if argv.map
      throw "TODO: --watch with --map"
  if argv._.length > 1 and argv.map and not argv.join
    throw "Cannot specify --map with multiple files unless using --join"
  if argv.map and not is-string! argv.map
    throw "Must specify a filename with --map"
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

macro timer!
  syntax body as Body
    let time = @tmp \time
    AST
      let mutable $time = new Date().get-time()
      $body
      new Date().get-time() - $time

let filenames = argv._
let main = promise!
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
  if argv.coverage
    options.coverage := true

  if argv["no-prelude"]
    options.no-prelude := true
  else
    yield gorilla.init()
  
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
    else if argv.eval
      let evaled = yield gorilla.eval code, options
      util.inspect evaled, false, null
    else
      yield gorilla.run code, options
      ""
    if result != ""
      process.stdout.write result
      process.stdout.write "\n"

  if argv["embedded-generator"]
    options.embedded-generator := true
    argv.embedded := true
  
  if argv.embedded
    options.embedded := true
    options.noindent := true
  
  if argv.eval?
    return yield handle-code String(argv.eval)
  
  if argv.stdin
    let code = yield read-stdin()
    return yield handle-code String(code)
  
  if not filenames.length
    throw Error "Expected at least one filename by this point"
  
  if not argv.compile
    let input = yield to-promise! fs.read-file filenames[0]

    options.filename := filenames[0]
    let new-argv = ["gorilla"]
    for item, i in process.argv
      if item == filenames[0]
        new-argv.push ...process.argv[i to -1]
        break
    process.argv := new-argv
    return yield handle-code String input
  
  if argv.map
    options.source-map := {
      file: argv.map
      source-root: argv["source-root"] or ""
    }

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

  if filenames.length > 1 and argv.join
    let base-filenames = for filename in filenames
      path.basename filename
    process.stdout.write "Compiling $(base-filenames.join ', ') ... "
    let compile-time = timer!
      yield gorilla.compile-file {} <<< options <<< {
        input: filenames
        output: argv.output
      }
    process.stdout.write "$((compile-time / 1000_ms).to-fixed(3)) seconds\n"
  else
    for filename in filenames
      process.stdout.write "Compiling $(path.basename filename) ... "
      let compile-time = timer!
        yield gorilla.compile-file {} <<< options <<< {
          input: filename
          output: get-js-output-path filename
        }
      process.stdout.write "$((compile-time / 1000_ms).to-fixed(3)) seconds\n"
  
  if argv.watch
    let watch-queue = { extends null }
    let handle-queue = do
      let mutable in-handle = false
      #
        if in-handle
          return
        let mutable lowest-time = new Date().get-time() - 1000_ms
        let mutable best-name = void
        for name, time of watch-queue
          if time < lowest-time
            lowest-time := time
            best-name := name
        if best-name?
          delete watch-queue[best-name]
          in-handle := true
          promise!
            try
              process.stdout.write "Compiling $(path.basename best-name) ... "
              let compile-time = timer!
                yield gorilla.compile-file {} <<< options <<< {
                  input: best-name
                  output: get-js-output-path best-name
                }
              process.stdout.write "$((compile-time / 1000_ms).to-fixed(3)) seconds\n"
            catch e
              console.error e?.stack or e
            in-handle := false
            handle-queue()
    // we have to keep rewatching because some editors mv a tmp file on top of the saved file,
    // meaning a different file pointer, which isn't watched.
    let watch-file(filename)!
      let watcher = fs.watch filename, #(event, name = filename)!
        watch-queue[name] := new Date().get-time()
        watcher.close()
        set-timeout #-> watch-file(filename), 50_ms
      watcher.on 'error', #(e)
        console.error e?.stack or e
    for filename in filenames
      watch-file filename
    set-interval handle-queue, 17
    console.log "Watching $(filenames.join ', ')..."

main.then null, #(e)
  console.error e?.stack or e
  process.exit(1)
