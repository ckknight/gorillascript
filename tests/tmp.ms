test "Named class that is a reserved word", #
  let obj = {}
  
  class obj.if
  
  ok new obj.if instanceof obj.if
  //eq "if", obj.if.displayName