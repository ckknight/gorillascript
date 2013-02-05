test "License comments show up in result", #
  ok gorilla.compile("""
  /*!
    This is my license
  */
  """).code.index-of("This is my license") != -1