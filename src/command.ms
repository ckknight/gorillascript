require! cli
require! './monkey'
require! util
require! fs
require! path
require! child_process

cli.enable 'version'

cli.setApp "monkey", "1.0"

cli.setUsage "monkey [OPTIONS] path/to/script.ms"

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
  let handleCode(code)
    let result = if options.stdout
      monkey.compile code
    else
      util.inspect monkey.eval code
    process.stdout.write "$result\n"
  if options.eval?
    handleCode String(options.eval)
  else if options.interactive
    require './repl'
  else if options.stdin
    cli.withStdin handleCode
  else if filenames.length
    let results = {}
    asyncfor next, filename in filenames
      async err, code <- fs.readFile filename
      if err
        throw err
      results[filename] := code.toString()
      next()
    for filename in filenames
      let code = results[filename]
      if options.compile
        let jsFilename = path.basename(filename, path.extname(filename)) & ".js"
        let sourceDir = path.dirname filename
        let baseDir = sourceDir
        let dir = if options.output
          path.join options.output, baseDir
        else
          sourceDir
        let jsPath = path.join dir, jsFilename
        let compile()
          let jsCode = monkey.compile code
          async err <- fs.writeFile jsPath, jsCode
          if err
            cli.error err.toString()
        
        async exists <- fs.exists dir
        if not exists
          async <- child_process.exec "mkdir -p $dir"
          compile()
        else
          compile()
      else
        if options.stdout
          process.stdout.write monkey.compile(code) & "\n"
        else
          monkey.run code, { filename }
  else
    require './repl'
