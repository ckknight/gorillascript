require! cli
require! './monkey'
require! util
require! fs
require! path
require! child_process

cli.enable 'version'

cli.set-app "monkey", "1.0"

cli.set-usage "monkey [OPTIONS] path/to/script.ms"

cli.parse {
  compile:     ["c", "Compile to JavaScript and save as .js files"]
  output:      ["o", "Set the directory for compiled JavaScript", "path"]
  interactive: ["i", "Run interactively with the REPL"]
  stdout:      ["p", "Print the compiled JavaScript to stdout"]
  stdin:       ["s", "Listen for and compile MonkeyScript from stdin"]
  eval:        ["e", "Compile and run a string from command line", "string"]
  noprelude:   [false, "Do not include the standard prelude"]
}

cli.main #(filenames, options)
  let handle-code(code)
    let result = if options.stdout
      monkey.compile code
    else
      util.inspect monkey.eval code
    process.stdout.write "$result\n"
  if options.eval?
    handle-code String(options.eval)
  else if options.interactive
    require './repl'
  else if options.stdin
    cli.with-stdin handle-code
  else if filenames.length
    let results = {}
    asyncfor next, filename in filenames
      async err, code <- fs.read-file filename
      if err
        throw err
      results[filename] := code.to-string()
      next()
    for filename in filenames
      let code = results[filename]
      if options.compile
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
        let js-code = monkey.compile code
        async err <- fs.write-file js-path, js-code
        if err
          cli.error err.to-string()
      else
        if options.stdout
          process.stdout.write monkey.compile(code) & "\n"
        else
          monkey.run code, { filename }
  else
    require './repl'
