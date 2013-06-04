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
        async! cb <- fs.unlink tmp-binary
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
        async! cb <- fs.unlink tmp-binary
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
        async! cb <- fs.unlink tmp-binary-gs
        async! cb <- fs.unlink tmp-binary-js
        cb()
  
  describe "compiling", #
    it "a single file", #(cb)
      let code = """
      @message := "Hello, world!"
      """
      let tmp-output-gs = path.join(fs.realpath-sync(os.tmpdir()), "hello.gs")
      let tmp-output-js = path.join(fs.realpath-sync(os.tmpdir()), "hello.js")
      async! cb <- fs.write-file tmp-output-gs, code, "utf8"
      async error, stdout, stderr <- exec "$gorilla-bin -c $tmp-output-gs"
      expect(error).to.not.exist
      expect(stderr).to.be.empty
      expect(stdout.trim()).to.match r"Compiling $(path.basename tmp-output-gs) \.\.\. \d+\.\d+ seconds"
      
      async! cb, js-code <- fs.read-file tmp-output-js, "utf8"
      async! cb <- fs.unlink tmp-output-gs
      async! cb <- fs.unlink tmp-output-js
      let obj = {}
      Function(js-code)@(obj)
      expect(obj.message).to.equal "Hello, world!"
      cb()
    
    it "a multiple files, compiled separately", #(cb)
      let alpha-code = """
      @alpha := "Hello"
      """
      let bravo-code = """
      @bravo := "World!"
      """
      let tmp-alpha-gs = path.join(fs.realpath-sync(os.tmpdir()), "alpha.gs")
      let tmp-alpha-js = path.join(fs.realpath-sync(os.tmpdir()), "alpha.js")
      let tmp-bravo-gs = path.join(fs.realpath-sync(os.tmpdir()), "bravo.gs")
      let tmp-bravo-js = path.join(fs.realpath-sync(os.tmpdir()), "bravo.js")
      async! cb <- fs.write-file tmp-alpha-gs, alpha-code, "utf8"
      async! cb <- fs.write-file tmp-bravo-gs, bravo-code, "utf8"
      async error, stdout, stderr <- exec "$gorilla-bin -c $tmp-alpha-gs $tmp-bravo-gs"
      expect(error).to.not.exist
      expect(stderr).to.be.empty
      expect(stdout.trim()).to.match r"Compiling $(path.basename tmp-alpha-gs) \.\.\. \d+\.\d+ seconds"
      expect(stdout.trim()).to.match r"Compiling $(path.basename tmp-bravo-gs) \.\.\. \d+\.\d+ seconds"
      
      async! cb, alpha-js-code <- fs.read-file tmp-alpha-js, "utf8"
      async! cb, bravo-js-code <- fs.read-file tmp-bravo-js, "utf8"
      async! cb <- fs.unlink tmp-alpha-gs
      async! cb <- fs.unlink tmp-alpha-js
      async! cb <- fs.unlink tmp-bravo-gs
      async! cb <- fs.unlink tmp-bravo-js
      let obj-alpha = {}
      Function(alpha-js-code)@(obj-alpha)
      expect(obj-alpha.alpha).to.equal "Hello"
      let obj-bravo = {}
      Function(bravo-js-code)@(obj-bravo)
      expect(obj-bravo.bravo).to.equal "World!"
      cb()
    
    it "a multiple files, compiled as joined output", #(cb)
      let alpha-code = """
      @alpha := "Hello"
      """
      let bravo-code = """
      @bravo := "World!"
      """
      let tmp-alpha-gs = path.join(fs.realpath-sync(os.tmpdir()), "alpha.gs")
      let tmp-bravo-gs = path.join(fs.realpath-sync(os.tmpdir()), "bravo.gs")
      let tmp-output-js = path.join(fs.realpath-sync(os.tmpdir()), "output.js")
      async! cb <- fs.write-file tmp-alpha-gs, alpha-code, "utf8"
      async! cb <- fs.write-file tmp-bravo-gs, bravo-code, "utf8"
      async error, stdout, stderr <- exec "$gorilla-bin -c $tmp-alpha-gs $tmp-bravo-gs -j -o $tmp-output-js"
      expect(error).to.not.exist
      expect(stderr).to.be.empty
      expect(stdout.trim()).to.match r"Compiling $(path.basename tmp-alpha-gs), $(path.basename tmp-bravo-gs) \.\.\. \d+\.\d+ seconds"
      
      async! cb, js-code <- fs.read-file tmp-output-js, "utf8"
      async! cb <- fs.unlink tmp-alpha-gs
      async! cb <- fs.unlink tmp-bravo-gs
      async! cb <- fs.unlink tmp-output-js
      let obj = {}
      Function(js-code)@(obj)
      expect(obj.alpha).to.equal "Hello"
      expect(obj.bravo).to.equal "World!"
      cb()
