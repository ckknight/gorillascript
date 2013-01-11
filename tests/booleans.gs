test "Literals", #
  eq not 0, true
  eq not 1, false

test "Indexing", #
  eq Boolean::to-string, true.to-string
  eq Boolean::to-string, false.to-string
  
  eq Boolean::to-string, true["toString"]
  eq Boolean::to-string, false["toString"]
