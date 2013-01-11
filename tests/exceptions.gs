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

/*
test "try-catch-as-type", -> do
  class MyError end
  
  try
    throw new MyError()
  catch e as MyError
    success()
  catch e
    fail()
  end
end

test "try-catch-as-type-without-base", -> do
  class MyError end
  
  let fun = (err) -> do
    try
      throw err
    catch e as MyError
      return "MyError"
    end
  end
  eq "MyError", fun(new MyError)
  let obj = {}
  throws -> fun(obj), (e) -> e == obj
end

test "try-multiple-catch-as-type", -> do
  class AlphaError end
  class BravoError end
  
  let fun = (err) -> do
    try
      throw err
    catch e as AlphaError
      return "alpha"
    catch e as BravoError
      return "bravo"
    catch e
      return "other"
    end
  end
  
  eq "alpha", fun(new AlphaError)
  eq "bravo", fun(new BravoError)
  eq "other", fun(new Error)
end

test "try-multiple-catch-as-type, differing error identifiers", -> do
  class AlphaError
    new = (@value) ->
  end
  class BravoError
    new = (@value) ->
  end
  
  let fun = (err) -> do
    try
      throw err
    catch e1 as AlphaError
      return "alpha: #{e1.value}"
    catch e2 as BravoError
      return "bravo: #{e2.value}"
    catch e3
      return e3
    end
  end
  
  eq "alpha: 1", fun(new AlphaError(1))
  eq "bravo: 2", fun(new BravoError(2))
  eq "other", fun("other")
end

test "try-catch-as-type-else", -> do
  class AlphaError
    new = (@value) ->
  end
  class BravoError
    new = (@value) ->
  end

  let fun = (err) -> do
    try
      if err?
        throw err
      end
    catch e1 as AlphaError
      return "alpha: #{e1.value}"
    catch e2 as BravoError
      return "bravo: #{e2.value}"
    catch e3
      return e3
    else
      return "no error"
    end
  end

  eq "alpha: 1", fun(new AlphaError(1))
  eq "bravo: 2", fun(new BravoError(2))
  eq "other", fun("other")
  eq "no error", fun()
end

test "try-catch-as-type-else-finally", -> do
  class AlphaError
    new = (@value) ->
  end
  class BravoError
    new = (@value) ->
  end

  let fun = (err) -> do
    let mutable result = null
    try
      if err?
        throw err
      end
    catch e1 as AlphaError
      result := "alpha: #{e1.value}"
    catch e2 as BravoError
      result := "bravo: #{e2.value}"
    catch e3
      result := e3
    else
      result := "no error"
    finally
      return ":#{result}"
    end
  end

  eq ":alpha: 1", fun(new AlphaError(1))
  eq ":bravo: 2", fun(new BravoError(2))
  eq ":other", fun("other")
  eq ":no error", fun()
end
*/