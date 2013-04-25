test "Generic function", #
  let f<T>(x as T) -> x
  
  eq "Hello", f<String>("Hello")
  eq 1234, f<Number>(1234)
  eq true, f<Boolean>(true)
  let obj = {}
  eq obj, f<Object>(obj)
  let arr = []
  eq arr, f<Array>(arr)
  throws #-> f<String>(1234), TypeError
  throws #-> f<Number>("hello"), TypeError
  throws #-> f<Boolean>(0), TypeError
  throws #-> f<Boolean>({}), TypeError
  throws #-> f<Object>(true), TypeError
  throws #-> f<Array>({}), TypeError
  
  eq "Hello", f("Hello")
  eq "Hello", f<null>("Hello")
  eq 1234, f(1234)
  eq null, f(null)
  eq void, f(void)
