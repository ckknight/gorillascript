test "throwing", #
  let obj = {}
  throws (#-> throw obj), #(e) -> e == obj

test "throw as non-statement", #
  let x = true
  let obj = {}
  throws (#-> x and throw obj), #(e) -> e == obj

test "try-catch", #
  let obj = {}
  let mutable hitCatch = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hitCatch
    hitCatch := true
  ok hitCatch

test "try-empty-catch", #
  try
    throw {}
  catch e
    void

test "try-catch-else", #
  let obj = {}
  let mutable hitCatch = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hitCatch
    hitCatch := true
  else
    fail()
  ok hitCatch
  
  let doNothing = #->
  let mutable hitElse = false
  try
    doNothing()
  catch e
    fail()
  else
    hitElse := true
    success()
  ok hitElse

test "try-finally", #
  let obj = {}
  let mutable hitFinally = false
  let fun()
    try
      throw obj
    finally
      ok not hitFinally
      hitFinally := true
  throws fun, #(e) -> e == obj
  ok hitFinally

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
  let mutable hitCatch = false
  let mutable hitFinally = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hitCatch
    ok not hitFinally
    hitCatch := true
  finally
    ok hitCatch
    ok not hitFinally
    hitFinally := true
  ok hitCatch
  ok hitFinally

test "try-catch-else-finally", #
  let obj = {}
  let mutable hitCatch = false
  let mutable hitElse = false
  let mutable hitFinally = false
  try
    throw obj
  catch e
    eq obj, e
    ok not hitCatch
    ok not hitFinally
    hitCatch := true
  else
    hitElse := true
    fail()
  finally
    ok hitCatch
    ok not hitElse
    ok not hitFinally
    hitFinally := true
  ok hitCatch
  ok not hitElse
  ok hitFinally
  
  let doNothing = #->
  hitCatch := false
  hitElse := false
  hitFinally := false
  
  try
    doNothing()
  catch e
    hitCatch := true
    fail()
  else
    ok not hitCatch
    ok not hitElse
    hitElse := true
  finally
    ok not hitCatch
    ok hitElse
    ok not hitFinally
    hitFinally := true
  
  ok not hitCatch
  ok hitElse
  ok hitFinally

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