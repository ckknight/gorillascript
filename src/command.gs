require! cli
require! './gorilla'
require! util
require! fs
require! path
require! child_process

cli.enable 'version'

cli.set-app "gorilla", "1.0"

cli.set-usage "gorilla [OPTIONS] path/to/script.gs"

cli.parse
  ast:          ["a", "Display JavaScript AST nodes instead of compilation"]
  compile:      ["c", "Compile to JavaScript and save as .js files"]
  output:       ["o", "Set the directory for compiled JavaScript", "path"]
  interactive:  ["i", "Run interactively with the REPL"]
  nodes:        ["n", "Display GorillaScript parser nodes instead of compilation"]
  stdout:       ["p", "Print the compiled JavaScript to stdout"]
  stdin:        ["s", "Listen for and compile GorillaScript from stdin"]
  eval:         ["e", "Compile and run a string from command line", "string"]
  "no-prelude": [false, "Do not include the standard prelude"]

cli.main #(filenames, options)
  let opts = {}
  if options["no-prelude"]
    opts.no-prelude := true
  else
    gorilla.init()
  let handle-code(code)
    let result = if options.ast
      util.inspect (gorilla.ast code, opts), false, null
    else if options.nodes
      util.inspect gorilla.parse(code, opts).result, false, null
    else if options.stdout
      gorilla.compile code, opts
    else
      util.inspect gorilla.eval code, opts
    process.stdout.write "$result\n"
  if options.ast and options.compile
    console.error "Cannot specify both --ast and --compile"
  else if options.ast and options.nodes
    console.error "Cannot specify both --ast and --nodes"
  else if options.nodes and options.compile
    console.error "Cannot specify both --nodes and --compile"
  else if options.eval?
    handle-code String(options.eval)
  else if options.interactive
    require './repl'
  else if options.stdin
    cli.with-stdin handle-code
  else if filenames.length
    let input = {}
    asyncfor(0) err <- next, filename in filenames
      async! next, code <- fs.read-file filename
      input[filename] := code.to-string()
      next()
    throw? err
    let compiled = {}
    for filename in filenames
      let code = input[filename]
      if options.compile
        process.stdout.write "Compiling $(path.basename filename) ... "
        let start-time = Date.now()
        let js-code = gorilla.compile code, opts
        let end-time = Date.now()
        process.stdout.write "$(((end-time - start-time) / 1000_ms).toFixed(3)) seconds\n"
        compiled[filename] := js-code
      else if options.stdout
        handle-code(code)
      else
        opts.filename := filename
        gorilla.run code, opts
        opts.filename := null
    
    if options.compile
      asyncfor(0) next, filename in filenames
        let js-filename = path.basename(filename, path.extname(filename)) & ".js"
        let source-dir = path.dirname filename
        let base-dir = source-dir
        let dir = if options.output
          path.join options.output, base-dir
        else
          source-dir
        let js-path = path.join dir, js-filename
        async exists <- fs.exists dir
        asyncif done, not exists
          async <- child_process.exec "mkdir -p $dir"
          done()
        let js-code = compiled[filename]
        async err <- fs.write-file js-path, js-code
        if err
          cli.error err.to-string()
        next()
  else
    require './repl'
