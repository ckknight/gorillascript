test "Literals", #
  eq not 0, true
  eq not 1, false

test "Indexing", #
  eq Boolean::toString, true.toString
  eq Boolean::toString, false.toString
  
  eq Boolean::toString, true["toString"]
  eq Boolean::toString, false["toString"]
