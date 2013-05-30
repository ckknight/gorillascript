(function () {
  "use strict";
  var __create, __isArray, __num, __owns, __slice, __toArray, __typeof, ast;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw TypeError("Expected an object with a length property, got " + __typeof(x));
    }
  };
  __typeof = (function () {
    var _toString;
    _toString = Object.prototype.toString;
    return function (o) {
      if (o === void 0) {
        return "Undefined";
      } else if (o === null) {
        return "Null";
      } else {
        return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
      }
    };
  }());
  ast = require("./jsast");
  module.exports = function (root, sources, coverageName) {
    var _this, doneLinesByFile, pos, walked;
    _this = this;
    if (coverageName == null) {
      coverageName = "_$jscoverage";
    }
    doneLinesByFile = __create(null);
    function walker(node, parent, position) {
      var _ref, doneLines, file, line, pos;
      pos = node.pos;
      file = pos.file;
      line = pos.line;
      if (file && sources[file] && __num(line) > 0) {
        if ((_ref = doneLinesByFile[file]) != null) {
          doneLines = _ref;
        } else {
          doneLines = doneLinesByFile[file] = [];
        }
        if (!doneLines[line] && (!(node instanceof ast.Binary) || node.op !== "." || !(parent instanceof ast.Call) || position !== "func") && (!(parent instanceof ast.Func) || position !== "param") && (!(parent instanceof ast.TryCatch) || position !== "catchIdent") && (!(parent instanceof ast.ForIn) || position !== "key") && (!(parent instanceof ast.Binary) || !parent.isAssign() || position !== "left") && (!(parent instanceof ast.Switch) || position !== "caseNode") && (!(parent instanceof ast.IfStatement) && !(parent instanceof ast.IfExpression) || position !== "test" || parent.test.pos.line !== parent.whenTrue.pos.line) && !(node instanceof ast.Noop) && (!(node instanceof ast.Func) || node.body.pos.line !== line) && (!(parent instanceof ast.Unary) || !parent.isAssign()) && (!(parent instanceof ast.Func) || position !== "name")) {
          doneLines[line] = true;
          return ast.Block(pos, [
            ast.Unary(pos, "++", ast.Access(
              pos,
              ast.Ident(pos, coverageName),
              ast.Const(pos, file),
              ast.Const(pos, line)
            )),
            node.walk(walker)
          ]);
        }
      }
    }
    walked = root.walk(walker);
    pos = root.pos;
    return ast.Root(
      pos,
      ast.Block(pos, [
        ast.TryCatch(
          pos,
          ast.If(
            pos,
            ast.And(
              pos,
              ast.Binary(
                pos,
                ast.Unary(pos, "typeof", ast.Ident(pos, "top")),
                "===",
                ast.Const(pos, "object")
              ),
              ast.Binary(
                pos,
                ast.Ident(pos, "top"),
                "!==",
                ast.Const(pos, null)
              ),
              ast.Binary(
                pos,
                ast.Unary(pos, "typeof", ast.Access(
                  pos,
                  ast.Ident(pos, "top"),
                  ast.Const(pos, "opener")
                )),
                "===",
                ast.Const(pos, "object")
              ),
              ast.Binary(
                pos,
                ast.Access(
                  pos,
                  ast.Ident(pos, "top"),
                  ast.Const(pos, "opener")
                ),
                "!==",
                ast.Const(pos, null)
              ),
              ast.Unary(pos, "!", ast.Access(
                pos,
                ast.Ident(pos, "top"),
                ast.Const(pos, "opener"),
                ast.Const(pos, coverageName)
              ))
            ),
            ast.Assign(
              pos,
              ast.Access(
                pos,
                ast.Ident(pos, "top"),
                ast.Const(pos, "opener"),
                ast.Const(pos, coverageName)
              ),
              ast.Obj(pos)
            )
          ),
          ast.Ident(pos, "e"),
          ast.Noop(pos)
        ),
        ast.TryCatch(
          pos,
          ast.If(
            pos,
            ast.And(
              pos,
              ast.Binary(
                pos,
                ast.Unary(pos, "typeof", ast.Ident(pos, "top")),
                "===",
                ast.Const(pos, "object")
              ),
              ast.Binary(
                pos,
                ast.Ident(pos, "top"),
                "!==",
                ast.Const(pos, null)
              )
            ),
            ast.Block(pos, [
              ast.TryCatch(
                pos,
                ast.If(
                  pos,
                  ast.And(
                    pos,
                    ast.Binary(
                      pos,
                      ast.Unary(pos, "typeof", ast.Access(
                        pos,
                        ast.Ident(pos, "top"),
                        ast.Const(pos, "opener")
                      )),
                      "===",
                      ast.Const(pos, "object")
                    ),
                    ast.Binary(
                      pos,
                      ast.Access(
                        pos,
                        ast.Ident(pos, "top"),
                        ast.Const(pos, "opener")
                      ),
                      "!==",
                      ast.Const(pos, null)
                    ),
                    ast.Access(
                      pos,
                      ast.Ident(pos, "top"),
                      ast.Const(pos, "opener"),
                      ast.Const(pos, coverageName)
                    )
                  ),
                  ast.Assign(
                    pos,
                    ast.Access(
                      pos,
                      ast.Ident(pos, "top"),
                      ast.Const(pos, coverageName)
                    ),
                    ast.Access(
                      pos,
                      ast.Ident(pos, "top"),
                      ast.Const(pos, "opener"),
                      ast.Const(pos, coverageName)
                    )
                  )
                ),
                ast.Ident(pos, "e"),
                ast.Noop(pos)
              ),
              ast.If(
                pos,
                ast.Unary(pos, "!", ast.Access(
                  pos,
                  ast.Ident(pos, "top"),
                  ast.Const(pos, coverageName)
                )),
                ast.Assign(
                  pos,
                  ast.Access(
                    pos,
                    ast.Ident(pos, "top"),
                    ast.Const(pos, coverageName)
                  ),
                  ast.Obj(pos)
                )
              )
            ])
          ),
          ast.Ident(pos, "e"),
          ast.Noop(pos)
        ),
        ast.TryCatch(
          pos,
          ast.If(pos, ast.And(
            pos,
            ast.Binary(
              pos,
              ast.Unary(pos, "typeof", ast.Ident(pos, "top")),
              "===",
              ast.Const(pos, "object")
            ),
            ast.Binary(
              pos,
              ast.Ident(pos, "top"),
              "!==",
              ast.Const(pos, null)
            ),
            ast.Access(
              pos,
              ast.Ident(pos, "top"),
              ast.Const(pos, coverageName)
            )
          )),
          ast.Ident(pos, "e"),
          ast.Noop(pos)
        ),
        ast.If(
          pos,
          ast.Binary(
            pos,
            ast.Unary(pos, "typeof", ast.Ident(pos, coverageName)),
            "!==",
            ast.Const(pos, "object")
          ),
          ast.Assign(
            pos,
            ast.Ident(pos, coverageName),
            ast.Obj(pos)
          )
        )
      ].concat(
        (function () {
          var _arr, file;
          _arr = [];
          function _f(file, lines) {
            var _arr2, _len, i, line, lineNumbers;
            lineNumbers = [];
            for (_arr2 = __toArray(lines), i = 0, _len = _arr2.length; i < _len; ++i) {
              line = _arr2[i];
              if (line) {
                lineNumbers.push(i);
              }
            }
            return ast.If(
              pos,
              ast.Unary(pos, "!", ast.Access(
                pos,
                ast.Ident(pos, coverageName),
                ast.Const(pos, file)
              )),
              ast.Call(pos, ast.Func(
                pos,
                null,
                [],
                ["cov", "i", "lines"],
                ast.Block(pos, [
                  ast.Assign(
                    pos,
                    ast.Access(
                      pos,
                      ast.Ident(pos, coverageName),
                      ast.Const(pos, file)
                    ),
                    ast.Ident(pos, "cov"),
                    ast.Arr(pos, [])
                  ),
                  ast.For(
                    pos,
                    ast.Block(pos, [
                      ast.Assign(
                        pos,
                        ast.Ident(pos, "i"),
                        ast.Const(pos, 0)
                      ),
                      ast.Assign(
                        pos,
                        ast.Ident(pos, "lines"),
                        ast.Arr(pos, (function () {
                          var _arr2, _i, _len, line;
                          for (_arr2 = [], _i = 0, _len = lineNumbers.length; _i < _len; ++_i) {
                            line = lineNumbers[_i];
                            _arr2.push(ast.Const(pos, line));
                          }
                          return _arr2;
                        }()))
                      )
                    ]),
                    ast.Binary(
                      pos,
                      ast.Ident(pos, "i"),
                      "<",
                      ast.Const(pos, lineNumbers.length)
                    ),
                    ast.Unary(pos, "++", ast.Ident(pos, "i")),
                    ast.Assign(
                      pos,
                      ast.Access(
                        pos,
                        ast.Ident(pos, "cov"),
                        ast.Access(
                          pos,
                          ast.Ident(pos, "lines"),
                          ast.Ident(pos, "i")
                        )
                      ),
                      ast.Const(pos, 0)
                    )
                  ),
                  ast.Assign(
                    pos,
                    ast.Access(
                      pos,
                      ast.Ident(pos, "cov"),
                      ast.Const(pos, "source")
                    ),
                    ast.Arr(pos, (function () {
                      var _arr2, _arr3, _i, _len, line;
                      for (_arr2 = [], _arr3 = __toArray(sources[file].split(/(?:\r\n?|[\n\u2028\u2029])/g)), _i = 0, _len = _arr3.length; _i < _len; ++_i) {
                        line = _arr3[_i];
                        _arr2.push(ast.Const(pos, line));
                      }
                      return _arr2;
                    }()))
                  )
                ])
              ))
            );
          }
          for (file in doneLinesByFile) {
            if (__owns.call(doneLinesByFile, file)) {
              _arr.push(_f.call(_this, file, doneLinesByFile[file]));
            }
          }
          return _arr;
        }()),
        [walked.body]
      )),
      walked.variables,
      walked.declarations
    );
  };
}.call(this));
