describe "License comments", #
  it "should appear in result code", #
    expect(gorilla.compile("""
    /*!
      This is my license
    */
    """).code).to.contain("This is my license")