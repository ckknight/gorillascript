describe "Promises/A+ Tests", #
  require("promises-aplus-tests").mocha {pending: __defer, __defer.fulfilled, __defer.reason}
