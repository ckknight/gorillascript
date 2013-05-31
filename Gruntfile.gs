require! path
require! fs

module.exports := #(grunt)
  grunt.init-config
    gorilla:
      build:
        options: {
          +verbose
        }
        files: [{
          expand: true
          cwd: "src/"
          src: for filter file in fs.readdir-sync('./src')
            path.extname(file) == ".gs" and not file.match(r"prelude\.gs\$") and file != "shared.gs"
          dest: "lib/"
          ext: ".js"
        }]
      
      "build-cov":
        options: {
          +verbose
          +coverage
        }
        files: [{
          expand: true
          cwd: "src/"
          src: for filter file in fs.readdir-sync('./src')
            path.extname(file) == ".gs" and not file.match(r"prelude\.gs\$") and file != "shared.gs"
          dest: "lib-cov/"
          ext: ".js"
        }]
      
      test:
        options: {
          +verbose
        }
        files: [{
          expand: true
          cwd: "test/"
          src: ["**/*.gs"]
          dest: "test-js/"
          ext: ".js"
        }]
    
    uglify:
      browser:
        files: {
          "extras/gorillascript.min.js": ["extras/gorillascript.js"]
        }
    
    clean:
      test: ["test-js"]
    
    mochaTest:
      test:
        options:
          timeout: 10_000_ms
        src: ["test-js/**/*.js"]
      
      "test-cov":
        options:
          reporter: "html-cov"
          timeout: 10_000_ms
          quiet: true
        src: ["test-js/**/*.js"]
        dest: "coverage.html"
  
  grunt.load-npm-tasks "grunt-gorilla"
  grunt.load-npm-tasks "grunt-contrib-clean"
  grunt.load-npm-tasks "grunt-contrib-uglify"
  grunt.load-npm-tasks "grunt-mocha-test"
  grunt.register-task "build", ["gorilla:build"]
  grunt.register-task "build-cov", ["gorilla:build-cov"]
  grunt.register-task "browser", "Build gorillascript.js for use in the browser", #
    let done = @async()
    let promise = promise!
      let filename-path = yield to-promise! fs.realpath __filename
      let lib-path = path.join(path.dirname(filename-path), "lib")
      let parts = []
      for file in ["utils", "jsutils", "types", "jsast", "parser", "parser-utils", "parser-scope", "parser-nodes", "parser-macroholder", "parser-macrocontext", "jstranslator", "gorilla", "browser"]
        let text = yield to-promise! fs.read-file path.join(lib-path, file & ".js"), "utf8"
        parts.push """
          require['./$file'] = function () {
            var module = { exports: this };
            var exports = this;
            $(text.split("\n").join("\n  "))
            return module.exports;
          };
          """
  
      let gorilla = require('./lib/gorilla')
      let serialized-prelude = yield gorilla.get-serialized-prelude()
      let mutable code = """
        ;(function (root) {
          "use strict";
          var GorillaScript = (function (realRequire) {
            function require(path) {
              var has = Object.prototype.hasOwnProperty;
              if (has.call(require._cache, path)) {
                return require._cache[path];
              } else if (has.call(require, path)) {
                var func = require[path];
                delete require[path];
                return require._cache[path] = func.call({});
              } else if (realRequire) {
                return realRequire(path);
              }
            }
            require._cache = {};
            $(parts.join("\n").split("\n").join("\n    "))
        
            require("./browser");
            return require("./gorilla").withPrelude($(serialized-prelude.split("\n").join("\n    ")));
          }(typeof module !== "undefined" && typeof require === "function" ? require : void 0));
      
          if (typeof define === "function" && define.amd) {
            define(function () { return GorillaScript; });
          } else {
            root.GorillaScript = GorillaScript;
          }
        }(this));
        """
      grunt.file.write "extras/gorillascript.js", code
      grunt.log.writeln 'File "extras/gorillascript.js" created.'
    promise.then(
      #-> done()
      #(e)
        grunt.log.error e?.stack or e
        done(false))
  grunt.register-task "test", ["clean:test", "gorilla:test", "mochaTest:test"]
  grunt.register-task "check-env-cov", "Verify that GORILLA_COV is set", #
    unless process.env.GORILLASCRIPT_COV
      grunt.log.error "You must set the GORILLASCRIPT_COV environment variable"
      false
  grunt.register-task "test-cov", ["check-env-cov", "clean:test", "gorilla:test", "mochaTest:test-cov"]
  grunt.register-task "default", ["build", "test", "browser"]
  grunt.register-task "full", ["default", "uglify"]
