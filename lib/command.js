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
  var _tmp, _tmp2, _tmp3, _tmp4, next, results;
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
    results = {};
    _tmp = filenames.length;
    _tmp2 = 0;
    __num(_tmp);
    _tmp3 = true;
    _tmp4 = function () {
      var _tmp5, _tmp7;
      _tmp5 = filenames.length;
      function _tmp6(_tmp7) {
        var baseDir, code, dir, filename, jsFilename, jsPath, sourceDir;
        filename = filenames[_tmp7];
        code = results[filename];
        if (options.compile) {
          jsFilename = __strnum(path.basename(filename, path.extname(filename))) + ".js";
          sourceDir = path.dirname(filename);
          baseDir = sourceDir;
          dir = options.output ? path.join(options.output, baseDir) : sourceDir;
          jsPath = path.join(dir, jsFilename);
          return fs.exists(dir, function (exists) {
            function done() {
              var jsCode;
              jsCode = monkey.compile(code);
              return fs.writeFile(jsPath, jsCode, function (err) {
                if (err) {
                  return cli.error(err.toString());
                }
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
        } else if (options.stdout) {
          return process.stdout.write(__strnum(monkey.compile(code)) + "\n");
        } else {
          return monkey.run(code, { filename: filename });
        }
      }
      for (_tmp7 = 0, __num(_tmp5); _tmp7 < _tmp5; _tmp7 = __num(_tmp7) + 1) {
        _tmp6(_tmp7);
      }
    };
    next = function () {
      var filename;
      if (_tmp3) {
        _tmp3 = false;
      } else {
        _tmp2 = __num(_tmp2) + 1;
      }
      if (_tmp2 >= _tmp) {
        return _tmp4();
      }
      filename = filenames[_tmp2];
      return fs.readFile(filename, function (err, code) {
        if (err) {
          throw err;
        }
        results[filename] = code.toString();
        return next();
      });
    };
    return next();
  } else {
    return require("./repl");
  }
});
