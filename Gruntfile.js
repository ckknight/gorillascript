(function () {
  // this is absolutely terrible, but it's the only way I know for the grunt task to see 'gorillascript'
  var path = require("path");
  var Module = require("module");
  var old_resolveFilename = Module._resolveFilename;
  Module._resolveFilename = function (request, parent) {
    if (request === "gorillascript") {
      return path.resolve('./index.js');
    }
    return old_resolveFilename.apply(this, arguments);
  }
}());
require("gorillascript");
module.exports = require('./Gruntfile.gs');