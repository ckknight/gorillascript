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
  asyncif next, options["no-prelude"]
    opts.no-prelude := true
    next()
  else
    async err <- gorilla.init()
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
      next null, util.inspect nodes, false, null
    else if options.stdout
      async! next <- gorilla.compile code, opts
      next null, ""
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
    asyncfor err <- next, filename in filenames
      let code = input[filename]
      if options.compile
        process.stdout.write "Compiling $(path.basename filename) ... "
        let start-time = Date.now()
        async! next, compilation <- gorilla.compile code, opts
        let end-time = Date.now()
        process.stdout.write "$(((end-time - start-time) / 1000_ms).to-fixed(3)) seconds\n"
        compiled[filename] := compilation.code
        next()
      else if options.stdout
        handle-code code, next
      else
        gorilla.run code, { extends opts, filename }, next
    throw? err
    
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
