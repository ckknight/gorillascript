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
        src: ["test-js/**/*.js"]
    
  
  grunt.load-npm-tasks "grunt-gorilla"
  grunt.load-npm-tasks "grunt-contrib-clean"
  grunt.load-npm-tasks "grunt-contrib-uglify"
  grunt.load-npm-tasks "grunt-mocha-test"
  grunt.register-task "build", ["gorilla:build"]
  grunt.register-task "browser", "Build gorillascript.js for use in the browser", #
    let done = @async()
    async! cb, filename-path <- fs.realpath __filename
    let lib-path = path.join(path.dirname(filename-path), "lib")
    let parts = []
    asyncfor next, file in ["utils", "jsutils", "types", "jsast", "parser", "parser-utils", "parser-scope", "parser-nodes", "parser-macroholder", "parser-macrocontext", "jstranslator", "gorilla", "browser"]
      async! cb, text <- fs.read-file path.join(lib-path, file & ".js"), "utf8"
      parts.push """
        require['./$file'] = function () {
          var module = { exports: this };
          var exports = this;
          $(text.split("\n").join("\n  "))
          return module.exports;
        };
        """
      next()
  
    let gorilla = require('./lib/gorilla')
    async! cb, serialized-prelude <- (from-promise! gorilla.get-serialized-prelude("js"))()
    let mutable deserialized-prelude = JSON.parse serialized-prelude
    for k, v of deserialized-prelude
      if is-array! v
        for item, i in v
          if typeof item.code == \string and item.code.substring(0, 7) == "return "
            let mutable minified = require("uglify-js").minify(item.code.substring(7), from-string: true).code
            if minified.char-at(0) == "("
              minified := "return$minified"
            else
              minified := "return $minified"
            item.code := minified
    let full-serialized-prelude = require('./lib/jsutils').to-JS-source deserialized-prelude, null, indent: 2
    let mutable code = """
      ;(function (root) {
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
          $(parts.join("\n").split("\n").join("\n  "))
        
          require("./browser");
          return require("./gorilla").withPrelude("js", $full-serialized-prelude);
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
    done()
  grunt.register-task "test", ["clean:test", "gorilla:test", "mochaTest:test"]
  grunt.register-task "default", ["build", "test", "browser"]
  grunt.register-task "full", ["default", "uglify"]
