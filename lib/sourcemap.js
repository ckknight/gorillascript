(function () {
  "use strict";
  var __create, __num, __typeof, SourceMap, sourceMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
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
  sourceMap = require("source-map");
  module.exports = SourceMap = (function () {
    var _SourceMap_prototype;
    function SourceMap(generatedFile, sourceRoot) {
      var _this;
      _this = this instanceof SourceMap ? this : __create(_SourceMap_prototype);
      _this.generatedFile = generatedFile;
      _this.generator = new (sourceMap.SourceMapGenerator)({ file: generatedFile, sourceRoot: sourceRoot });
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
    _SourceMap_prototype.pushFile = function (sourceFile) {
      if (typeof sourceFile !== "string") {
        throw TypeError("Expected sourceFile to be a String, got " + __typeof(sourceFile));
      }
      this.sourceFiles.push(sourceFile);
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
      } else if (sourceLine !== 0 && __num(this.sourceFiles.length) > 0) {
        this.generator.addMapping({
          generated: { line: generatedLine, column: generatedColumn },
          original: { line: sourceLine, column: sourceColumn },
          source: (_ref = this.sourceFiles)[__num(_ref.length) - 1]
        });
      }
    };
    return SourceMap;
  }());
}.call(this));
