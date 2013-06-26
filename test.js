(function () {
  "use strict";
  var _arr, _i, _len, item;
  console.log("This is a test!");
  for (_arr = ["a", "b", "c"], _i = 0, _len = _arr.length; _i < _len; ++_i) {
    item = _arr[_i];
    if (item === "c") {
      throw Error("oh noes!");
    }
  }
}.call(this));

/*
//@ sourceMappingURL=test.js.map
*/
