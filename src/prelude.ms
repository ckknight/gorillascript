macro if
  syntax test as Logic, "then", body, elseBody as ("else", this)?
    @if(test, body, elseBody)
  
  syntax test as Logic, "then", body, elseIfs as ("else", "if", test as Logic, "then", body)*, elseBody as ("else", this)?
    let f(i, current)
      if i ~< 0 then current else f.call(this, i ~- 1, @if(elseIfs[i].test, elseIfs[i].body, current))
    @if(test, body, f.call(this, elseIfs.length ~- 1, elseBody))
  
  syntax test as Logic, body as Body, elseIfs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, elseBody as ("else", this as Body)?
    let f(i, current)
      let mutable test = elseIfs[i]?.test
      test := if elseIfs[i]?.type == "unless" then (AST not $test) else test
      if i ~< 0 then current else f.call(this, i ~- 1, @if(test, elseIfs[i].body, current))
    @if(test, body, f.call(this, elseIfs.length ~- 1, elseBody))

macro unless
  syntax test as Logic, "then", body, elseBody as ("else", this)?
    AST if not $test then $body else $elseBody
  
  syntax test as Logic, body as Body, elseIfs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, elseBody as ("else", this as Body)?
    let f(i, current)
      let mutable test = elseIfs[i]?.test
      test := if elseIfs[i]?.type == "unless" then (AST not $test) else test
      if i ~< 0 then current else f.call(this, i ~- 1, @if(test, elseIfs[i].body, current))
    @if((AST not $test), body, f.call(this, elseIfs.length ~- 1, elseBody))

define helper __num = #(num)
  if typeof num != "number"
    throw TypeError("Expected a number, got " & typeof num)
  else
    num

define helper __str = #(str)
  if typeof str != "string"
    throw TypeError("Expected a string, got " & typeof str)
  else
    num

define helper __strnum = #(strnum)
  let type = typeof strnum
  if type == "string"
    strnum
  else if type == "number"
    String(strnum)
  else
    throw TypeError("Expected a string or number, got " ~& type)

macro do
  syntax body as Body
    let func = AST #@-> $body
    AST $func()

macro with
  syntax node as Expression, body as Body
    let func = if @expr
      AST #-> $body
    else
      AST #!-> $body
    AST $func.call($node)

define helper __lt = #(x, y)
  let type = typeof x
  if type not in ["number", "string"]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " & typeof y)
  else
    x ~< y

define helper __lte = #(x, y)
  let type = typeof x
  if type not in ["number", "string"]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " & typeof y)
  else
    x ~<= y

define helper __owns = do
  let has = Object.prototype.hasOwnProperty
  #(parent, child) -> has.call(parent, child)

define helper __in = do
  let indexOf = Array.prototype.indexOf
  #(child, parent) -> indexOf.call(parent, child) != -1

define helper __slice = Function.prototype.call.bind(Array.prototype.slice)

define helper __splice = do
  let splice = Array.prototype.splice
  #(array, mutable start, mutable end, right)
    let len = array.length
    if start ~< 0
      start ~+= len
    if end ~< 0
      end ~+= len
    splice.apply array, [start, end ~- start, ...right]
    right

define helper __typeof = do
  let _toString = Object.prototype.toString
  #(o)
    if o == undefined
      "undefined"
    else if o == null
      "null"
    else
      (o.constructor and o.constructor.name) or _toString.call(o).slice(8, -1)

define helper __cmp = #(left, right)
  let type = typeof left
  if type != "number" and type != "string"
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof right
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " & typeof right)
  else if left ~< right
    -1
  else if right ~< left
    1
  else
    0

define helper __freeze = if typeof Object.freeze == "function"
  Object.freeze
else
  #(x) -> x

define helper __freezeFunc = #(x)
  if x.prototype?
    __freeze(x.prototype)
  __freeze(x)

define helper __isArray = if typeof Array.isArray == "function"
  Array.isArray
else
  do
    let _toString = Object.prototype.toString
    #(x) -> _toString.call(x) == "[object Array]"

define helper __toArray = #(x)
  if __isArray(x)
    x
  else
    __slice(x)

define helper __create = if typeof Object.create == "function"
  Object.create
else
  #(x)
    let F = #->
    F.prototype := x
    new F()

define helper __pow = Math.pow
define helper __floor = Math.floor
define helper __sqrt = Math.sqrt
define helper __log = Math.log

macro for
  // FIXME: init should be an Expression or Assignment or Let
  syntax reducer as ("every" | "some" | "first")?, init as (Expression|""), ";", test as (Logic|""), ";", step as (Statement|""), body as Body, elseBody as ("else", this as Body)?
    if @empty(init)
      init := []
      init := AST $init
    if @empty(test)
      test := AST true
    if @empty(step)
      step := []
      step := AST $step
    if @empty(reducer)
      reducer := null
    if not @empty(elseBody)
      if @expr
        throw Error("Cannot use a for loop with an else as an expression")
      else if reducer
        throw Error("Cannot use a for loop with an else with " ~& reducer)
      let runElse = @tmp()
      body := AST
        $runElse := false
        $body
      init := AST
        $runElse := true
        $init
      let loop = @for(init, test, step, body)
      AST
        $loop
        if $runElse
          $elseBody
    else
      if reducer
        if reducer == "first"
          body := @mutateLast body, #(node) -> (AST return $node)
          let loop = @for(init, test, step, body)
          AST do
            $loop
        else if reducer == "some"
          body := @mutateLast body, #(node) -> AST
            if $node
              return true
          let loop = [@for(init, test, step, body), (AST return false)]
          AST do
            $loop
        else if reducer == "every"
          body := @mutateLast body, #(node) -> AST
            if not $node
              return false
          let loop = [@for(init, test, step, body), (AST return true)]
          AST do
            $loop
        else
          throw Error("Unknown reducer: " ~& reducer)
      else if @expr
        let tmp = @tmp()
        body := @mutateLast body, #(node) -> (AST $tmp.push $node)
        init := AST
          $tmp := []
          $init
        let loop = [@for(init, test, step, body), (AST return $tmp)]
        AST do
          $loop
      else
        @for(init, test, step, body)
  
  syntax reducer as ("every" | "some" | "first")?, ident as Identifier, "=", start, ",", end, step as (",", this)?, body as Body, elseBody as ("else", this as Body)?
    if not @empty(elseBody) and @expr
      throw Error("Cannot use a for loop with an else as an expression")
    
    if @empty(reducer)
      reducer := null
    if @empty(step)
      step := AST 1
    
    let init = []
    
    if @isConst(start)
      if typeof @value(start) != "number"
        throw Error "Cannot start with a non-number: #(@value start)"
    else
      start := AST +$start
    init.push (AST let $ident = $start)
    
    if @isConst(end)
      if typeof @value(end) != "number"
        throw Error "Cannot end with a non-number: #(@value start)"
    else if @isComplex(end)
      end := @cache (AST +$end), init
    else
      init.push AST +$end
    
    if @isConst(step)
      if typeof @value(step) != "number"
        throw Error "Cannot step with a non-number: #(@value step)"
    else if @isComplex(step)
      step := @cache (AST +$step), init
    else
      init.push AST +$step
    
    let test = if @isConst(step)
      if @value(step) ~> 0
        if @isConst(end) and @value(end) == Infinity
          AST true
        else
          AST $ident ~< $end
      else
        if @isConst(end) and @value(end) == -Infinity
          AST true
        else
          AST $ident ~> $end
    else
      AST if $step ~> 0 then $ident ~< $end else $ident ~> $end
    
    if @hasFunc(body)
      let func = @tmp()
      init.push (AST let $func = #($ident) -> $body)
      body := (AST $func($ident))
    
    if reducer == "every"
      AST
        for every $init; $test; $ident += $step
          $body
        else
          $elseBody
    else if reducer == "some"
      AST
        for some $init; $test; $ident += $step
          $body
        else
          $elseBody
    else if reducer == "first"
      AST
        for first $init; $test; $ident += $step
          $body
        else
          $elseBody
    else
      AST
        for $init; $test; $ident += $step
          $body
        else
          $elseBody
  
  syntax reducer as ("every" | "some" | "first")?, value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as Body, elseBody as ("else", this as Body)?
    if not @empty(elseBody) and @expr
      throw Error("Cannot use a for loop with an else as an expression")
    
    if @empty(reducer)
      reducer := null
    
    let init = []
    array := @cache array, init
    
    let mutable length = null
    if @empty(index)
      index := @tmp()
      length := @tmp()
    else
      length := index.length
      index := index.value
      if @empty(length)
        length := @tmp()
    
    init.push (AST let $length = $array.length)
    
    body := AST
      let $value = $array[$index]
      $body
    
    if @hasFunc(body)
      let func = @tmp()
      init.push (AST let $func = #($index) -> $body)
      body := AST $func($index)
    
    if reducer == "every"
      AST
        $init
        for every $index = 0, $length
          $body
        else
          $elseBody
    else if reducer == "some"
      AST
        $init
        for some $index = 0, $length
          $body
        else
          $elseBody
    else if reducer == "first"
      AST
        $init
        for first $index = 0, $length
          $body
        else
          $elseBody
    else
      AST
        $init
        for $index = 0, $length
          $body
        else
          $elseBody
  
  syntax reducer as ("every" | "some" | "first")?, key as Identifier, value as (",", value as Identifier, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as Body, elseBody as ("else", this as Body)?
    if not @empty(elseBody)
      if @expr
        throw Error("Cannot use a for loop with an else as an expression")
      else if reducer
        throw Error("Cannot use a for loop with an else with " ~& reducer)
    
    if @empty(reducer)
      reducer := null
    
    let mutable index = null
    if @empty(value)
      value := null
    else
      index := value.index
      value := value.value
      if @empty(index)
        index := null
    
    let own = type == "of"
    let init = []
    if own or value
      object := @cache object, init
    
    if value
      body := AST
        let $value = $object[$key]
        $body
    
    if @hasFunc(body)
      let func = @tmp()
      if index
        init.push (AST let $func = #($key, $index) -> $body)
        body := (AST $func($key, $index))
      else
        init.push (AST let $func = #($key) -> $body)
        body := (AST $func($key))
    
    let post = []
    if not @empty(elseBody)
      let runElse = @tmp()
      init.push (AST let $runElse = true)
      body := AST
        $runElse := false
        $body
      post.push AST
        if $runElse
          $elseBody
    
    if index
      init.push (AST let mutable $index = -1)
      body := AST
        $index += 1
        $body
    
    if own
      body := AST
        if $object ownskey $key
          $body
    
    if @empty(elseBody)
      if reducer
        if reducer == "first"
          body := @mutateLast body, #(node) -> (AST return $node)
          let loop = @forIn(key, object, body)
          return AST do
            $init
            $loop
            false
        else if reducer == "some"
          body := @mutateLast body, #(node) -> AST
            if $node
              return true
          let loop = @forIn(key, object, body)
          return AST do
            $init
            $loop
            false
        else if reducer == "every"
          body := @mutateLast body, #(node) -> AST
            if not $node
              return false
          let loop = @forIn(key, object, body)
          return AST do
            $init
            $loop
            true
        else
          throw Error("Unknown reducer: " ~& reducer)
      else if @expr
        let tmp = @tmp()
        body := @mutateLast body, #(node) -> (AST $tmp.push $node)
        init := AST
          $tmp := []
          $init
        let loop = [init, @forIn(key, object, body), (AST return $tmp)]
        return AST do
          $loop
    
    let loop = @forIn(key, object, body)
    AST
      $init
      $loop
      $post

macro while
  syntax test as Logic, step as (",", this as Statement)?, body as Body, elseBody as ("else", this as Body)?
    if not @empty(elseBody)
      if @expr
        throw Error("Cannot use a while loop with an else as an expression")
      AST
        for ; $test; $step
          $body
        else
          $elseBody
    else
      AST
        for ; $test; $step
          $body

macro until
  syntax test as Logic, step as (",", this as Statement)?, body as Body, elseBody as ("else", this as Body)?
    AST
      while not $test, $step
        $body
      else
        $elseBody

define helper __keys = if typeof Object.keys == "function"
  Object.keys
else
  #(x)
    let keys = []
    for key of x
      keys.push key
    keys

define helper __allkeys = #(x)
  let keys = []
  for key ofall x
    keys.push key
  keys

define helper __new = do
  let newCreators = []
  #(Ctor, args)
    let length = args.length
    let creator = newCreators[length]
    if not creator
      let func = ["return new C("]
      for i = 0, length
        if i ~> 0
          func.push ", "
        func.push "a[", i, "]"
      func.push ");"
      creator := Function("C", "a", func.join(""))
      newCreators[length] := creator
    creator(Ctor, args)

define helper __instanceofsome = #(value, array)
  for some item in array
    element instanceof item

macro try
  syntax tryBody as Body, catchPart as ("catch", ident as Identifier, body as Body)?, elseBody as ("else", this as Body)?, finallyBody as ("finally", this as Body)?
    let hasElse = not @empty(elseBody)
    if @empty(catchPart) and hasElse and @empty(finallyBody)
      throw Error("Must provide at least a catch, else, or finally to a try block")
    
    let mutable catchIdent = if not @empty(catchPart) then catchPart.ident
    let mutable catchBody = if not @empty(catchPart) then catchPart.body
    let init = []
    let mutable shouldRunElse = void
    if hasElse
      shouldRunElse := @tmp()
      init.push AST let $shouldRunElse = true
      if catchBody
        catchBody := AST
          $shouldRunElse := false
          $catchBody
      else
        catchIdent := @tmp()
        catchBody := AST
          $shouldRunElse := false
          throw $catchIdent
    
    let mutable current = tryBody
    if catchBody
      current := @tryCatch(current, catchIdent, catchBody)
    if hasElse
      current := @tryFinally current, AST
        if $shouldRunElse
          $elseBody
    if not @empty(finallyBody)
      current := @tryFinally(current, finallyBody)
    
    if @expr
      AST do
        $init
        $current
    else
      AST
        $init
        $current

macro async
  syntax params as (head as Parameter, tail as (",", this as Parameter)*)?, "<-", call as Expression, body as DedentedBody
    if not @isCall(call)
      throw Error("async call expression must be a call")
    
    params := if not @empty(params) then [params.head].concat(params.tail) else []
    let func = @func(params, body, true, true)
    @call @callFunc(call), @callArgs(call).concat([func]), @callIsNew(call)

define helper __xor = #(x, y)
  if x
    not y
  else
    y

macro require!
  syntax name as Expression
    if @isConst name
      if typeof @value(name) != "string"
        throw Error("Expected a constant string, got $(typeof @value(name))")
    else if not @isIdent name
      throw Error("Expected either a constant string or ident")

    if @isConst name
      let mutable identName = @value(name)
      if identName.lastIndexOf("/") != -1
        identName := identName.substring identName.lastIndexOf("/") ~+ 1
      let ident = @ident identName
      AST let $ident = require $name
    else
      let ident = name
      let path = @const @name name
      AST let $ident = require $path

macro asyncfor
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", init as (Statement|""), ";", test as (Logic|""), ";", step as (Statement|""), body as Body, rest as DedentedBody
    if @empty(init)
      init := []
      init := AST $init
    if @empty(test)
      test := AST true
    if @empty(step)
      step := []
      step := AST $step
    let done = @tmp true
    if @empty(result)
      if @empty(step)
        AST
          $init
          let $next()@
            unless $test
              return $done()
            $body
          let $done()@
            $rest
          $next()
      else
        let first = @tmp true
        AST
          $init
          let $first = true
          let $done()@
            $rest
          let $next()@
            if $first
              $first := false
            else
              $step
            unless $test
              return $done()
            $body
          $next()
    else
      let first = @tmp true
      let value = @tmp true
      AST
        $init
        let $first = true
        let $result = []
        let $done()@
          $rest
        let $next($value)@
          if $first
            $first := false
          else
            $step
            if arguments.length
              $result.push $value
          unless $test
            return $done()
          $body
        $next()
  
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", ident as Identifier, "=", start, ",", end, step as (",", this)?, body as Body, rest as DedentedBody
    if @empty(step)
      step := AST 1
    
    let init = []
    
    if @isConst(start)
      if typeof @value(start) != "number"
        throw Error "Cannot start with a non-number: #(@value start)"
    else
      start := AST +$start
    init.push (AST let $ident = $start)
    
    if @isConst(end)
      if typeof @value(end) != "number"
        throw Error "Cannot end with a non-number: #(@value start)"
    else if @isComplex(end)
      end := @cache (AST +$end), init
    else
      init.push AST +$end
    
    if @isConst(step)
      if typeof @value(step) != "number"
        throw Error "Cannot step with a non-number: #(@value step)"
    else if @isComplex(step)
      step := @cache (AST +$step), init
    else
      init.push AST +$step
    
    let test = if @isConst(step)
      if @value(step) ~> 0
        if @isConst(end) and @value(end) == Infinity
          AST true
        else
          AST $ident ~< $end
      else
        if @isConst(end) and @value(end) == -Infinity
          AST true
        else
          AST $ident ~> $end
    else
      AST if $step ~> 0 then $ident ~< $end else $ident ~> $end
    
    let done = @tmp true
    AST
      asyncfor $result <- $next, $init; $test; $ident += $step
        $body
      $rest
  
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as Body, rest as DedentedBody
    let init = []
    array := @cache array, init
    
    let mutable length = null
    if @empty(index)
      index := @tmp()
      length := @tmp()
    else
      length := index.length
      index := index.value
      if @empty(length)
        length := @tmp()

    init.push (AST let $length = $array.length)

    body := AST
      let $value = $array[$index]
      $body
    
    AST
      $init
      asyncfor $result <- $next, $index = 0, $length
        $body
      $rest
  
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", key as Identifier, value as (",", value as Identifier, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as Body, rest as DedentedBody
    let own = type == "of"
    let init = []
    object := @cache object, init
    
    let mutable index = null
    if @empty(value)
      value := null
    else
      index := value.index
      value := value.value
      if @empty(index)
        index := null
    if value
      body := AST
        let $value = $object[$key]
        $body
    if not index
      index := @tmp true
    
    let keys = @tmp true
    let getKeys = if own
      AST for $key of $object
        $keys.push $key
    else
      AST for $key ofall $object
        $keys.push $key
    AST
      $init
      let $keys = []
      $getKeys
      asyncfor $result <- $next, $key, $index in $keys
        $body
      $rest

macro asyncwhile
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", test as Logic, step as (",", this as Statement)?, body as Body, rest as DedentedBody
    AST
      asyncfor $result <- $next, ; $test; $step
        $body
      $rest

macro asyncuntil
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", test as Logic, step as (",", this as Statement)?, body as Body, rest as DedentedBody
    AST
      asyncwhile $result <- $next, not $test, $step
        $body
      $rest

macro asyncif
  syntax result as (this as Identifier, "<-")?, done as Identifier, ",", test as Logic, body as Body, elseIfs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, elseBody as ("else", this as Body)?, rest as DedentedBody
    
    let mutable current = elseBody
    if @empty(elseBody)
      current := AST $done()
    
    let mutable i = elseIfs.length ~- 1
    while i ~>= 0, i ~-= 1
      let elseIf = elseIfs[i]
      let mutable innerTest = elseIf.test
      if elseIf.type == "unless"
        innerTest := AST not $innerTest
      current := @if(innerTest, elseIf.body, current)
    
    current := @if(test, body, current)
    
    if @empty(result)
      AST
        let $done()@
          $rest
        $current
    else
      AST
        let $done($result)@
          $rest
        $current

macro asyncunless
  syntax result as (this as Identifier, "<-")?, done as Identifier, ",", test as Logic, body as Body, elseIfs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, elseBody as ("else", this as Body)?, rest as DedentedBody
    
    let mutable current = elseBody
    if @empty(elseBody)
      current := AST $done()
    
    let mutable i = elseIfs.length ~- 1
    while i ~>= 0, i ~-= 1
      let elseIf = elseIfs[i]
      let mutable innerTest = elseIf.test
      if elseIf.type == "unless"
        innerTest := AST not $innerTest
      current := @if(innerTest, elseIf.body, current)
    
    current := @if(AST not $test, body, current)
    
    if @empty(result)
      AST
        let $done()@
          $rest
        $current
    else
      AST
        let $done($result)@
          $rest
        $current
