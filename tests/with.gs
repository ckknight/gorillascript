test "with statement", #
  let obj = {}
  with obj
    eq this, obj

test "nested with statements", #
  let obj = {}
  let other = {}
  with obj
    eq this, obj
    with other
      eq this, other
    eq this, obj

test "class nested in with", #
  let obj = {}
  with obj
    eq this, obj
    let c = class this.Class
      def alpha() -> "bravo"
    eq this, obj
    eq c, obj.Class
  eq "bravo", new obj.Class().alpha()

test "enum nested in with", #
  let obj = {}
  with obj
    eq this, obj
    let e = enum this.Enum
      def Alpha
      def Bravo
      def Charlie
      
      this.thing := #-> "blah"
    eq this, obj
    eq e, obj.Enum
  eq 1, obj.Enum.Alpha
  eq 2, obj.Enum.Bravo
  eq 3, obj.Enum.Charlie
  eq "blah", obj.Enum.thing()
