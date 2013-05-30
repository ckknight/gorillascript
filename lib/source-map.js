(function () {
  "use strict";
  var __create, path, SourceMap, sourceMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  sourceMap = require("source-map");
  path = require("path");
  module.exports = SourceMap = (function () {
    var _SourceMap_prototype;
    function SourceMap(sourceMapFile, generatedFile, sourceRoot) {
      var _this;
      _this = this instanceof SourceMap ? this : __create(_SourceMap_prototype);
      _this.sourceMapFile = sourceMapFile;
      _this.generatedFile = generatedFile;
      _this.generator = new (sourceMap.SourceMapGenerator)({
        file: path.relative(path.dirname(sourceMapFile), generatedFile),
        sourceRoot: sourceRoot
      });
      _this.sourceFiles = [];
      return _this;
    }
    _SourceMap_prototype = SourceMap.prototype;
    SourceMap.displayName = "SourceMap";
    _SourceMap_prototype.get = function () {
      return this.generator;
    };
    _SourceMap_prototype.toString = function () {
      return this.generator.toString();
    };
    _SourceMap_prototype.getRelativePath = function (sourceFile) {
      return path.relative(path.dirname(this.sourceMapFile), sourceFile);
    };
    _SourceMap_prototype.pushFile = function (sourceFile) {
      this.sourceFiles.push(this.getRelativePath(sourceFile));
    };
    _SourceMap_prototype.popFile = function () {
      this.sourceFiles.pop();
    };
    _SourceMap_prototype.add = function (generatedLine, generatedColumn, sourceLine, sourceColumn, sourceFile) {
      var _ref;
      if (sourceFile) {
        this.pushFile(sourceFile);
        this.add(generatedLine, generatedColumn, sourceLine, sourceColumn);
        this.popFile();
      } else if (sourceLine > 0 && this.sourceFiles.length > 0) {
        this.generator.addMapping({
          generated: { line: generatedLine, column: generatedColumn },
          original: { line: sourceLine, column: sourceColumn },
          source: (_ref = this.sourceFiles)[_ref.length - 1]
        });
      }
    };
    return SourceMap;
  }());
}.call(this));
