"use strict";
var __num, __strnum, child_process, cli, fs, monkey, path, util;
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
monkey = require("./monkey");
util = require("util");
fs = require("fs");
path = require("path");
child_process = require("child_process");
cli.enable("version");
cli.setApp("monkey", "1.0");
cli.setUsage("monkey [OPTIONS] path/to/script.ms");
cli.parse({
  compile: ["c", "Compile to JavaScript and save as .js files"],
  output: ["o", "Set the directory for compiled JavaScript", "path"],
  interactive: ["i", "Run interactively with the REPL"],
  stdout: ["p", "Print the compiled JavaScript to stdout"],
  stdin: ["s", "Listen for and compile MonkeyScript from stdin"],
  "eval": ["e", "Compile and run a string from command line", "string"],
  noprelude: [false, "Do not include the standard prelude"]
});
cli.main(function (filenames, options) {
  var _done, _first, _i, _len, input, next;
  monkey.init();
  function handleCode(code) {
    var result;
    result = options.stdout ? monkey.compile(code) : util.inspect(monkey["eval"](code));
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
    _i = 0;
    _len = __num(filenames.length);
    _first = true;
    _done = function () {
      var _done2, _first2, _i2, _len2, code, compiled, endTime, filename, jsCode, next, startTime;
      compiled = {};
      for (_i2 = 0, _len2 = __num(filenames.length); _i2 < _len2; ++_i2) {
        filename = filenames[_i2];
        code = input[filename];
        if (options.compile) {
          process.stdout.write("Compiling " + __strnum(path.basename(filename)) + " ... ");
          startTime = Date.now();
          jsCode = monkey.compile(code);
          endTime = Date.now();
          process.stdout.write(__strnum(((__num(endTime) - __num(startTime)) / 1000).toFixed(3)) + " seconds\n");
          compiled[filename] = jsCode;
        } else if (options.stdout) {
          process.stdout.write(__strnum(monkey.compile(code)) + "\n");
        } else {
          monkey.run(code, { filename: filename });
        }
      }
      if (options.compile) {
        _i2 = 0;
        _len2 = __num(filenames.length);
        _first2 = true;
        _done2 = function () {
          return;
        };
        next = function () {
          var baseDir, dir, filename, jsFilename, jsPath, sourceDir;
          if (_first2) {
            _first2 = false;
          } else {
            ++_i2;
          }
          if (_i2 >= _len2) {
            return _done2();
          }
          filename = filenames[_i2];
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
        };
        return next();
      }
    };
    next = function () {
      var filename;
      if (_first) {
        _first = false;
      } else {
        ++_i;
      }
      if (_i >= _len) {
        return _done();
      }
      filename = filenames[_i];
      return fs.readFile(filename, function (err, code) {
        if (err) {
          throw err;
        }
        input[filename] = code.toString();
        return next();
      });
    };
    return next();
  } else {
    return require("./repl");
  }
});
