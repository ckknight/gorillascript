require! cli
require! './gorilla'
require! util
require! fs
require! path
require! child_process

cli.enable 'version'

cli.set-app "gorilla", "1.0"

cli.set-usage "gorilla [OPTIONS] path/to/script.gs"

cli.parse {
  compile:     ["c", "Compile to JavaScript and save as .js files"]
  output:      ["o", "Set the directory for compiled JavaScript", "path"]
  interactive: ["i", "Run interactively with the REPL"]
  stdout:      ["p", "Print the compiled JavaScript to stdout"]
  stdin:       ["s", "Listen for and compile GorillaScript from stdin"]
  eval:        ["e", "Compile and run a string from command line", "string"]
  noprelude:   [false, "Do not include the standard prelude"]
}

cli.main #(filenames, options)
  gorilla.init()
  let handle-code(code)
    let result = if options.stdout
      gorilla.compile code
    else
      util.inspect gorilla.eval code
    process.stdout.write "$result\n"
  if options.eval?
    handle-code String(options.eval)
  else if options.interactive
    require './repl'
  else if options.stdin
    cli.with-stdin handle-code
  else if filenames.length
    let input = {}
    asyncfor next, filename in filenames
      async err, code <- fs.read-file filename
      throw? err
      input[filename] := code.to-string()
      next()
    let compiled = {}
    for filename in filenames
      let code = input[filename]
      if options.compile
        process.stdout.write "Compiling $(path.basename filename) ... "
        let start-time = Date.now()
        let js-code = gorilla.compile code
        let end-time = Date.now()
        process.stdout.write "$(((end-time - start-time) / 1000_ms).toFixed(3)) seconds\n"
        compiled[filename] := js-code
      else if options.stdout
        process.stdout.write gorilla.compile(code) & "\n"
      else
        gorilla.run code, { filename }
    
    if options.compile
      asyncfor next, filename in filenames
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
