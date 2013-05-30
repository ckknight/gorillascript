let {expect} = require 'chai'
let {spawn, exec} = require 'child_process'
require! path
require! fs
require! os
let {inspect} = require 'util'

let gorilla-bin = path.join(__dirname, "..", "bin", "gorilla")

let exec-with-stdin(binary, argv, stdin, callback)
  let proc = spawn binary, argv
  let mutable stdout = ""
  proc.stdout.on 'data', #(data) stdout &= data.to-string()
  let mutable stderr = ""
  proc.stderr.on 'data', #(data) stderr &= data.to-string()
  proc.on 'exit', #(code, signal)
    let mutable err = void
    if code != 0
      err := Error("$binary exited with code $(String code) and signal $(String signal)")
      err.code := code
      err.signal := signal
    callback(err, stdout, stderr)
  proc.stdin.write stdin
  proc.stdin.end()

describe "gorilla binary", #
  describe "command-line interface", #
    describe "passing in an expression with -e", #
      it "should work with a single word", #(cb)
        async error, stdout, stderr <- exec "$gorilla-bin -e 1234"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal "1234"
        cb()
    
      it "should work with multiple words", #(cb)
        async error, stdout, stderr <- exec "$gorilla-bin -e '1 + 2 + 3'"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal "6"
        cb()
  
    describe "passing in code with --stdin", #
      it "should be able to run a simple program", #(cb)
        async error, stdout, stderr <- exec-with-stdin gorilla-bin, ["--stdin"], "console.log 'Hello, world!'"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal "Hello, world!"
        cb()

  describe "when used as the binary to launch a file", #
    describe "as the shebang", #
      it "should have the expected process.argv", #(cb)
        let code = """
        #!/usr/bin/env $gorilla-bin
        console.log process.argv
      
        """
        let tmp-binary = path.join(fs.realpath-sync(os.tmpdir()), "command-shebang-argv.gs")
        async! cb <- fs.write-file tmp-binary, code, { encoding: "utf8", mode: 0o777 }
        async error, stdout, stderr <- exec "$tmp-binary alpha bravo charlie"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["gorilla", tmp-binary, "alpha", "bravo", "charlie"])
      
        async error, stdout, stderr <- exec "$tmp-binary alpha --bravo charlie"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["gorilla", tmp-binary, "alpha", "--bravo", "charlie"])
        fs.unlink tmp-binary, #->
        cb()
  
    describe "called with the gorilla command", #
      it "should have the expected process.argv", #(cb)
        let code = """
        console.log process.argv
      
        """
        let tmp-binary = path.join(fs.realpath-sync(os.tmpdir()), "command-argv.gs")
        async! cb <- fs.write-file tmp-binary, code, { encoding: "utf8", mode: 0o777 }
        async error, stdout, stderr <- exec "$gorilla-bin $tmp-binary alpha bravo charlie"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["gorilla", tmp-binary, "alpha", "bravo", "charlie"])
      
        async error, stdout, stderr <- exec "$gorilla-bin $tmp-binary alpha --bravo charlie"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["gorilla", tmp-binary, "alpha", "--bravo", "charlie"])
      
        async error, stdout, stderr <- exec """$gorilla-bin --options='{"x":"y"}' $tmp-binary alpha --bravo charlie"""
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["gorilla", tmp-binary, "alpha", "--bravo", "charlie"])
        fs.unlink tmp-binary, #->
        cb()
  
    describe "compiling a file", #
      it "should have the expected process.argv in the compiled file", #(cb)
        let code = """
        console.log process.argv
      
        """
        let tmp-binary-gs = path.join(fs.realpath-sync(os.tmpdir()), "command-argv.gs")
        let tmp-binary-js = path.join(fs.realpath-sync(os.tmpdir()), "command-argv.js")
        async! cb <- fs.write-file tmp-binary-gs, code, "utf8"
        async error, stdout, stderr <- exec "$gorilla-bin -c $tmp-binary-gs"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.match r"Compiling $(path.basename tmp-binary-gs) \.\.\. \d+\.\d+ seconds"
      
        async error, stdout, stderr <- exec "node $tmp-binary-js alpha bravo charlie"
        expect(error).to.not.exist
        expect(stderr).to.be.empty
        expect(stdout.trim()).to.equal inspect(["node", tmp-binary-js, "alpha", "bravo", "charlie"])
        cb()
