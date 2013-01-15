(function () {
  "use strict";
  var __async, __num, __strnum, child_process, cli, fs, gorilla, path, util;
  __async = function (limit, length, onValue, onComplete) {
    var broken, index, slotsUsed, sync;
    if (length <= 0) {
      return onComplete(null);
    }
    if (limit <= 0) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    function onValueCallback(err) {
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (!sync) {
        return next();
      }
    }
    index = 0;
    function next() {
      var f, i;
      for (; broken == null && slotsUsed < limit && index < length; ) {
        ++slotsUsed;
        i = index;
        ++index;
        sync = true;
        onValue(i, onValueCallback);
        sync = false;
      }
      if (broken != null || slotsUsed === 0) {
        f = onComplete;
        onComplete = void 0;
        if (f) {
          return f(broken);
        }
      }
    }
    return next();
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + typeof num);
    } else {
      return num;
    }
  };
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + type);
    }
  };
  cli = require("cli");
  gorilla = require("./gorilla");
  util = require("util");
  fs = require("fs");
  path = require("path");
  child_process = require("child_process");
  cli.enable("version");
  cli.setApp("gorilla", "1.0");
  cli.setUsage("gorilla [OPTIONS] path/to/script.gs");
  cli.parse({
    compile: ["c", "Compile to JavaScript and save as .js files"],
    output: ["o", "Set the directory for compiled JavaScript", "path"],
    interactive: ["i", "Run interactively with the REPL"],
    stdout: ["p", "Print the compiled JavaScript to stdout"],
    stdin: ["s", "Listen for and compile GorillaScript from stdin"],
    "eval": ["e", "Compile and run a string from command line", "string"],
    noprelude: [false, "Do not include the standard prelude"]
  });
  cli.main(function (filenames, options) {
    var input;
    gorilla.init();
    function handleCode(code) {
      var result;
      result = options.stdout ? gorilla.compile(code) : util.inspect(gorilla["eval"](code));
      return process.stdout.write(__strnum(result) + "\n");
    }
    if (options["eval"] != null) {
      return handleCode(String(options["eval"]));
    } else if (options.interactive) {
      return require("./repl");
    } else if (options.stdin) {
      return cli.withStdin(handleCode);
    } else if (filenames.length) {
      input = {};
      return __async(
        0,
        __num(filenames.length),
        function (_i, next) {
          var filename;
          filename = filenames[_i];
          return fs.readFile(filename, function (err, code) {
            if (err != null) {
              throw err;
            }
            input[filename] = code.toString();
            return next();
          });
        },
        function (_err) {
          var _i, _len, code, compiled, endTime, filename, jsCode, startTime;
          compiled = {};
          for (_i = 0, _len = __num(filenames.length); _i < _len; ++_i) {
            filename = filenames[_i];
            code = input[filename];
            if (options.compile) {
              process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
              startTime = Date.now();
              jsCode = gorilla.compile(code);
              endTime = Date.now();
              process.stdout.write(__strnum(((__num(endTime) - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
              compiled[filename] = jsCode;
            } else if (options.stdout) {
              process.stdout.write(__strnum(gorilla.compile(code)) + "\n");
            } else {
              gorilla.run(code, { filename: filename });
            }
          }
          if (options.compile) {
            return __async(
              0,
              __num(filenames.length),
              function (_i, next) {
                var baseDir, dir, filename, jsFilename, jsPath, sourceDir;
                filename = filenames[_i];
                jsFilename = __strnum(path.basename(filename, path.extname(filename))) + ".js";
                sourceDir = path.dirname(filename);
                baseDir = sourceDir;
                dir = options.output ? path.join(options.output, baseDir) : sourceDir;
                jsPath = path.join(dir, jsFilename);
                return fs.exists(dir, function (exists) {
                  function done() {
                    var jsCode;
                    jsCode = compiled[filename];
                    return fs.writeFile(jsPath, jsCode, function (err) {
                      if (err) {
                        cli.error(err.toString());
                      }
                      return next();
                    });
                  }
                  if (!exists) {
                    return child_process.exec("mkdir -p " + __strnum(dir), function () {
                      return done();
                    });
                  } else {
                    return done();
                  }
                });
              },
              function (_err2) {}
            );
          }
        }
      );
    } else {
      return require("./repl");
    }
  });
}.call(this));
