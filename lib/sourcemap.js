(function () {
  "use strict";
  var __create, sourceMap, SourceMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  sourceMap = require("source-map");
  module.exports = SourceMap = (function () {
    var _SourceMap_prototype;
    function SourceMap(generatedFile, sourceRoot) {
      var _this;
      _this = this instanceof SourceMap ? this : __create(_SourceMap_prototype);
      _this.generator = new (sourceMap.SourceMapGenerator)({ file: generatedFile, sourceRoot: sourceRoot });
      return _this;
    }
    _SourceMap_prototype = SourceMap.prototype;
    SourceMap.displayName = "SourceMap";
    _SourceMap_prototype.setSource = function (sourceFile) {
      return this.sourceFile = sourceFile;
    };
    _SourceMap_prototype.get = function () {
      return this.generator;
    };
    _SourceMap_prototype.toString = function () {
      return this.generator.toString();
    };
    _SourceMap_prototype.add = function (generatedLine, generatedColumn, sourceLine, sourceColumn) {
      if (sourceLine === 0) {
        return;
      }
      if (!this.sourceFile) {
        throw Error("Must call set-source before calling add");
      }
      this.generator.addMapping({
        generated: { line: generatedLine, column: generatedColumn },
        original: { line: sourceLine, column: sourceColumn },
        source: this.sourceFile
      });
    };
    return SourceMap;
  }());
}.call(this));
