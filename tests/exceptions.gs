test "throwing", #
  let obj = {}
  throws (#-> throw obj), #(e) -> e == obj

test "throw as non-statement", #
  let x = true
  let obj = {}
  throws (#-> x and throw obj), #(e) -> e == obj

test "try-catch", #
  let obj = {}
  let mutable hit-catch = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hit-catch
    hit-catch := true
  ok hit-catch

test "try-empty-catch", #
  try
    throw {}
  catch e
    void

test "try-catch-else", #
  let obj = {}
  let mutable hit-catch = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hit-catch
    hit-catch := true
  else
    fail()
  ok hit-catch
  
  let do-nothing = #->
  let mutable hit-else = false
  try
    do-nothing()
  catch e
    fail()
  else
    hit-else := true
    success()
  ok hit-else

test "try-finally", #
  let obj = {}
  let mutable hit-finally = false
  let fun()
    try
      throw obj
    finally
      ok not hit-finally
      hit-finally := true
  throws fun, #(e) -> e == obj
  ok hit-finally

test "try-empty-finally", #
  try
    try
      throw {}
    finally
      void
  catch e
    void

test "try-catch-finally", #
  let obj = {}
  let mutable hit-catch = false
  let mutable hit-finally = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hit-catch
    ok not hit-finally
    hit-catch := true
  finally
    ok hit-catch
    ok not hit-finally
    hit-finally := true
  ok hit-catch
  ok hit-finally

test "try-catch-else-finally", #
  let obj = {}
  let mutable hit-catch = false
  let mutable hit-else = false
  let mutable hit-finally = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hit-catch
    ok not hit-finally
    hit-catch := true
  else
    hit-else := true
    fail()
  finally
    ok hit-catch
    ok not hit-else
    ok not hit-finally
    hit-finally := true
  ok hit-catch
  ok not hit-else
  ok hit-finally
  
  let do-nothing = #->
  hit-catch := false
  hit-else := false
  hit-finally := false
  
  try
    do-nothing()
  catch e
    hit-catch := true
    fail()
  else
    ok not hit-catch
    ok not hit-else
    hit-else := true
  finally
    ok not hit-catch
    ok hit-else
    ok not hit-finally
    hit-finally := true
  
  ok not hit-catch
  ok hit-else
  ok hit-finally

test "try-catch-as-type", #
  class MyError
  
  let f(err)
    try
      throw err
    catch e as MyError
      ["MyError", e]
    catch e
      ["other", e]
  
  let my-error = MyError()
  array-eq ["MyError", my-error], f my-error
  let other-error = Error()
  array-eq ["other", other-error], f other-error

test "try-catch-as-type, differing idents", #
  class MyError
  
  let f(err)
    try
      throw err
    catch e as MyError
      ["MyError", e]
    catch err
      ["other", err]
  
  let my-error = MyError()
  array-eq ["MyError", my-error], f my-error
  let other-error = Error()
  array-eq ["other", other-error], f other-error

test "try-catch-as-type-without-base", #
  class MyError
  
  let f(err)
    try
      throw err
    catch e as MyError
      "MyError"
  eq "MyError", f MyError()
  let obj = {}
  throws #-> f(obj), #(e) -> e == obj

test "try-multiple-catch-as-type", #
  class AlphaError
  class BravoError
  
  let f(err)
    try
      throw err
    catch e as AlphaError
      "alpha"
    catch e as BravoError
      "bravo"
    catch e
      "other"
  
  eq "alpha", f AlphaError()
  eq "bravo", f BravoError()
  eq "other", f Error()

test "try-multiple-catch-as-type using union syntax", #
  class AlphaError
  class BravoError
  
  let f(err)
    try
      throw err
    catch e as AlphaError|BravoError
      "alpha or bravo"
    catch e
      "other"
  
  eq "alpha or bravo", f AlphaError()
  eq "alpha or bravo", f BravoError()
  eq "other", f Error()

test "try-multiple-catch-as-type, differing error identifiers", #
  class AlphaError
    def constructor(@value) ->
  class BravoError
    def constructor(@value) ->
  
  let f(err)
    try
      throw err
    catch e1 as AlphaError
      "alpha: $(e1.value)"
    catch e2 as BravoError
      "bravo: $(e2.value)"
    catch e3
      e3
  
  eq "alpha: 1", f AlphaError(1)
  eq "bravo: 2", f BravoError(2)
  eq "other", f "other"

test "try-catch-as-type-else", #
  class AlphaError
    def constructor(@value) ->
  class BravoError
    def constructor(@value) ->

  let f(err)
    try
      throw? err
    catch e1 as AlphaError
      "alpha: $(e1.value)"
    catch e2 as BravoError
      "bravo: $(e2.value)"
    catch e3
      e3
    else
      return "no error"

  eq "alpha: 1", f AlphaError(1)
  eq "bravo: 2", f BravoError(2)
  eq "other", f "other"
  eq "no error", f()

test "try-catch-as-type-else-finally", #
  class AlphaError
    def constructor(@value) ->
  class BravoError
    def constructor(@value) ->
  
  let f(err)
    let mutable result = null
    try
      throw? err
    catch e1 as AlphaError
      result := "alpha: $(e1.value)"
    catch e2 as BravoError
      result := "bravo: $(e2.value)"
    catch e3
      result := e3
    else
      result := "no error"
    finally
      return ":$result"

  eq ":alpha: 1", f AlphaError(1)
  eq ":bravo: 2", f BravoError(2)
  eq ":other", f "other"
  eq ":no error", f()
