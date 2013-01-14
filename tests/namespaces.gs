let object-to-array = #(obj) -> (for k, v of obj
  [k, v]).sort #(a, b) -> a[0] <=> b[0]

test "empty namespace", #
  let ns = namespace
  
  for k of ns
    fail()
  else
    success()

test "empty named namespace", #
  namespace ns 
  
  for k of ns
    fail()
  else
    success()

test "namespace with a few values", #
  let ns = namespace
    def alpha = 1
    def bravo = "x"
    def charlie = true
    def delta
    def echo = null
  
  array-eq [["alpha", 1], ["bravo", "x"], ["charlie", true], ["delta", void], ["echo", null]], object-to-array(ns)

test "namespace with logic", #
  let make = #(value) -> namespace
    if value
      def alpha = 1
      def bravo = 2
    else
      def bravo = 3
      def charlie = 4
  
  array-eq [["alpha", 1], ["bravo", 2]], object-to-array(make(true))
  array-eq [["bravo", 3], ["charlie", 4]], object-to-array(make(false))

/*
test "namespaces are frozen", #
  if typeof Object.freeze != "function" or typeof Object.isFrozen != "function"
    return
  if not Object.isFrozen(Object.freeze({}))
    return
  
  ok Object.isFrozen(namespace)
  ok Object.isFrozen(namespace ns)
*/

test "setting this on a namespace works same as def", #
  namespace ns
    def alpha = 1
    @bravo := 2
  
  array-eq [["alpha", 1], ["bravo", 2]], object-to-array(ns)

test "inner namespaces using this", #
  namespace alpha
    namespace @bravo
      namespace @charlie
        def delta = "echo"
  
  eq "echo", alpha.bravo.charlie.delta


test "inner namespaces using def", #
  namespace alpha
    def bravo = namespace
      def charlie = namespace
        def delta = "echo"
  
  eq "echo", alpha.bravo.charlie.delta

test "namespace with prototype", #
  namespace parent
    def alpha = "bravo"
  
  namespace child extends parent
    def charlie = "delta"
  
  eq "bravo", parent.alpha
  eq "bravo", child.alpha
  eq "delta", child.charlie

test "namespace with prototype only called once", #
  let make-parent = runOnce { alpha: "bravo" }
  
  namespace child extends make-parent()
    def charlie = "delta"
  
  eq "bravo", child.alpha
  eq "delta", child.charlie
