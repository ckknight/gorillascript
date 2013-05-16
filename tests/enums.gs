describe "enums", #
  it "can be empty", #
    let Alpha = enum
    expect(Alpha).to.be.empty
    
    enum Bravo
    expect(Bravo).to.be.empty
  
  it "marks values in order starting at 1", #
    let Alpha = enum
      def alpha
      def bravo
      def charlie
    
    expect(Alpha).to.have.property(\alpha).that.equals(1)
    expect(Alpha).to.have.property(\bravo).that.equals(2)
    expect(Alpha).to.have.property(\charlie).that.equals(3)
  
  it "allows for custom values", #
    enum Alpha
      def alpha = 0
      def bravo = 1
      def charlie = 2
    
    expect(Alpha).to.have.property(\alpha).that.equals(0)
    expect(Alpha).to.have.property(\bravo).that.equals(1)
    expect(Alpha).to.have.property(\charlie).that.equals(2)
  
  it "can have static members", #
    let Enum = enum
      def alpha
      def bravo
      def charlie

      this.delta := "delta"
    
    expect(Enum).to.have.property(\alpha).that.equals(1)
    expect(Enum).to.have.property(\bravo).that.equals(2)
    expect(Enum).to.have.property(\charlie).that.equals(3)
    expect(Enum).to.have.property(\delta).that.equals("delta")
