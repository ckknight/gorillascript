describe "namespaces", #
  it "can be empty", #
    let ns = namespace
    
    expect(ns).to.be.empty
  
  it "can be empty with a name", #
    namespace ns
    expect(ns).to.be.empty
  
  it "can have various values", #
    let ns = namespace
      def alpha = 1
      def bravo = "x"
      def charlie = true
      def delta
      def echo = null
    
    expect(ns).to.eql {alpha: 1, bravo: "x", charlie: true, delta: void, echo: null}
  
  it "can have logic in its body", #
    let make = #(value) -> namespace
      if value
        def alpha = 1
        def bravo = 2
      else
        def bravo = 3
        def charlie = 4
    
    expect(make(true)).to.eql {alpha: 1, bravo: 2}
    expect(make(false)).to.eql {bravo: 3, charlie: 4}

  it "can set values on this, works same as def", #
    namespace ns
      def alpha = 1
      @bravo := 2
    
    expect(ns).to.eql {alpha: 1, bravo: 2}
  
  it "can have inner namespaces and place them on their parent with this", #
    namespace alpha
      namespace @bravo
        namespace this.charlie
          def delta = "echo"
    expect(alpha).to.eql {bravo: { charlie: { delta: "echo" } } }
  
  it "can have inner namespaces and place them using def", #
    namespace alpha
      def bravo = namespace
        def charlie = namespace
          def delta = "echo"
  
    expect(alpha).to.eql {bravo: { charlie: { delta: "echo" } } }
  
  it "can specify its prototype", #
    namespace parent
      def alpha = "bravo"
  
    namespace child extends parent
      def charlie = "delta"
    
    expect(parent).to.eql {alpha: "bravo"}
    // probably wrong
    expect(child).to.eql {alpha: "bravo", charlie: "delta"}
  
  it "only calls its prototype once if it is a function", #
    let get-parent = stub().returns { alpha: "bravo" }
    
    namespace child extends get-parent()
      def charlie = "delta"
    
    expect(child).to.eql {alpha: "bravo", charlie: "delta"}
