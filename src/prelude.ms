macro do
  syntax body as Body
    AST (#@ -> $body)()

define operator binary and with precedence: 0
  @binary left, "&&", right

define operator binary or with precedence: 0
  @binary left, "||", right

define operator unary not
  @unary "!", node

define operator unary typeof
  @unary "typeof", node

define operator assign and=
  @maybe-cache-access left, #(set-left, left)@
    AST $set-left and ($left := $right)

define operator assign or=
  @maybe-cache-access left, #(set-left, left)@
    AST $set-left or ($left := $right)

macro if
  // this uses eval instead of normal operators since those aren't defined yet
  // thankfully the eval uses constant strings and turns into pure code
  syntax test as Logic, "then", body, else-ifs as ("else", "if", test as Logic, "then", body)*, else-body as ("else", this)?
    let f(i, current)@
      (eval("i >= 0") and f(eval("i - 1"), @if(else-ifs[i].test, else-ifs[i].body, current))) or current
    let len = else-ifs.length
    @if(test, body, f(eval("len - 1"), else-body))

  syntax test as Logic, body as Body, else-ifs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, else-body as ("else", this as Body)?
    let f(i, current)@
      let mutable test = else-ifs[i]?.test
      let type = else-ifs[i]?.type
      test := if eval('type === "unless"') then (AST not $test) else test
      if eval("i >= 0") then f(eval("i - 1"), @if(test, else-ifs[i].body, current)) else current
    let len = else-ifs.length
    @if(test, body, f(eval("len - 1"), else-body))

define operator binary == with precedence: 1, maximum: 1
  @binary left, "===", right

define operator binary != with precedence: 1, maximum: 1
  AST not ($left == $right)

define operator binary ~= with precedence: 1, maximum: 1
  @binary left, "==", right

define operator binary !~= with precedence: 1, maximum: 1
  AST not ($left ~= $right)

define operator unary ? with postfix: true
  // TODO: support when node is not in-scope and thus should be typeof node != "undefined" and node != null
  AST $node !~= null

define operator binary ~<, ~<= with precedence: 1, maximum: 1
  if op == "~<"
    @binary left, "<", right
  else
    @binary left, "<=", right

define operator binary ~>, ~>= with precedence: 1, maximum: 1
  if op == "~>"
    AST not ($left ~<= $right)
  else
    AST not ($left ~< $right)

// let's define the unstrict operators first
define operator binary ~^ with precedence: 9, right-to-left: true
  AST Math.pow $left, $right

define operator assign ~^=
  @maybe-cache-access left, #(set-left, left)
    AST $set-left := $left ~^ $right

define operator binary ~*, ~/, ~%, ~\ with precedence: 8
  if op == "~\\"
    let div = @binary left, "/", right
    AST Math.floor $div
  else if op == "~*"
    @binary left, "*", right
  else if op == "~/"
    @binary left, "/", right
  else
    @binary left, "%", right

define operator assign ~*=, ~/=, ~%=
  if op == "~*="
    @assign left, "*=", right
  else if op == "~/="
    @assign left, "/=", right
  else
    @assign left, "%=", right

define operator assign ~\=
  @maybe-cache-access left, #(set-left, left)
    AST $set-left := $left ~\ $right

define operator binary ~+, ~- with precedence: 7
  if op == "~+"
    if not @is-type left, "number"
      left := @unary "+", left
    if not @is-type right, "number"
      right := @unary "+", right
    @binary left, "+", right
  else
    @binary left, "-", right

define operator unary ~+, ~-
  if @is-const(node)
    let mutable value = Number(@value(node))
    if op == "~-"
      value := 0 ~- value
    @const value
  else
    if op == "~+"
      @unary "+", node
    else
      @unary "-", node

define operator assign ~+=
  if @is-const(right)
    let value = @value(right)
    if value == 1
      return @unary "++", left
    else if value == ~-1
      return @unary "--", left
    else if typeof value == \number
      return @binary left, "-=", @const(~-value)
  
  if @is-type left, \number
    if not @is-type right, \number
      right := @unary "+", right
    @binary left, "+=", right
  else
    @binary left, "-=", @unary "-", right

define operator assign ~-=
  if @is-const(right)
    let value = @value(right)
    if value == 1
      return @unary "--", left
    else if value == ~-1
      return @unary "++", left
  @assign left, "-=", right

define operator binary ~bitlshift, ~bitrshift, ~biturshift with precedence: 6, maximum: 1
  if op == "~bitlshift"
    @binary left, "<<", right
  else if op == "~bitrshift"
    @binary left, ">>", right
  else
    @binary left, ">>>", right

define operator assign ~bitlshift=, ~bitrshift=, ~biturshift=
  if op == "~bitlshift="
    @assign left, "<<=", right
  else if op == "~bitrshift="
    @assign left, ">>=", right
  else
    @assign left, ">>>=", right

define operator binary ~& with precedence: 4
  if @has-type(left, \number) and @has-type(right, \number)
    left := @binary @const(""), "+", left
  @binary left, "+", right

define operator assign ~&=
  if @has-type(right, \number)
    right := AST "" ~& right
  @assign left, "+=", right

define operator unary throw
  @throw node

define helper __num = #(num)
  if typeof num != "number"
    throw TypeError("Expected a number, got " ~& typeof num)
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

// strict operators, should have same precedence as their respective unstrict versions

define operator unary +
  if @is-type node, "number"
    node
  else
    AST __num($node)

define operator unary -
  if @is-const(node) and typeof @value(node) == "number"
    @const(~-@value(node))
  else
    AST ~-(+$node)

define operator binary ^ with precedence: 9, right-to-left: true
  AST +$left ~^ +$right

define operator assign ^=
  @maybe-cache-access left, #(set-left, left)@
    AST $set-left := $left ^ $right

define operator binary *, /, %, \ with precedence: 8
  if op == "*"
    AST +$left ~* +$right
  else if op == "/"
    AST +$left ~/ +$right
  else if op == "%"
    AST +$left ~% +$right
  else
    AST +$left ~\ +$right

define operator binary +, - with precedence: 7
  if op == "+"
    AST +$left ~+ +$right
  else
    AST +$left ~- +$right

define operator binary bitlshift, bitrshift, biturshift with precedence: 6, maximum: 1
  if op == "bitlshift"
    AST +$left ~bitlshift +$right
  else if op == "bitrshift"
    AST +$left ~bitrshift +$right
  else
    AST +$left ~biturshift +$right

define operator assign \=
  @maybe-cache-access left, #(set-left, left)@
    AST $set-left := $left \ $right

define operator binary & with precedence: 4
  if not @is-type left, \string
    left := AST __strnum $left
  if not @is-type right, \string
    right := AST __strnum $right
  AST $left ~& $right

define operator assign &=
  // TODO: if left is proven to be a string, use raw operators instead
  @maybe-cache-access left, #(set-left, left)@
    AST $set-left := $left & $right

define helper __in = do
  let index-of = Array.prototype.index-of
  #(child, parent) -> index-of@(parent, child) != -1

define operator binary in with precedence: 3, maximum: 1, invertible: true
  let result = if @is-array(right)
    let elements = @elements(right)
    if elements.length == 0
      if @is-complex(left)
        AST
          $left
          false
      else
        AST false
    else if elements.length == 1
      let element = elements[0]
      AST $left == $element
    else
      let f(i, current, left)
        if i ~< elements.length
          let element = elements[i]
          f(i ~+ 1, AST $current or $left == $element, left)
        else
          current
      @maybe-cache left, #(set-left, left)
        let element = elements[0]
        f(1, AST $set-left == $element, left)
  else
    AST __in($left, $right)
  if inverted
    AST not $result
  else
    result

define operator binary haskey with precedence: 3, maximum: 1, invertible: true
  let result = @binary right, \in, left
  if inverted
    AST not $result
  else
    result

define helper __owns = do
  let has = Object.prototype.has-own-property
  #(parent, child) -> has@(parent, child)

define operator binary ownskey with precedence: 3, maximum: 1, invertible: true
  let result = AST __owns($left, $right)
  if inverted
    AST not $result
  else
    result

define operator binary instanceof with precedence: 3, maximum: 1, invertible: true
  let result = @binary left, \instanceof, right
  if inverted
    AST not $result
  else
    result

define helper __cmp = #(left, right)
  if left == right
    0
  else
    let type = typeof left
    if type != \number and type != \string
      throw TypeError "Cannot compare a non-number/string: " ~& type
    else if type != typeof right
      throw TypeError "Cannot compare elements of different types: " ~& type ~& " vs " ~& typeof right
    else if left ~< right
      -1
    else
      1

define operator binary <=> with precedence: 2, maximum: 1
  AST __cmp($left, $right)

define operator binary %% with precedence: 1, maximum: 1
  AST $left % $right == 0

define operator binary !%% with precedence: 1, maximum: 1
  AST not ($left %% $right)

define operator binary ~%% with precedence: 1, maximum: 1
  AST $left ~% $right == 0

define operator binary !~%% with precedence: 1, maximum: 1
  AST not ($left ~%% $right)

define operator binary <, <= with precedence: 1, maximum: 1
  if op == "<"
    AST __lt($left, $right)
  else
    AST __lte($left, $right)

define operator binary >, >= with precedence: 1, maximum: 1
  if op == ">"
    AST not ($left <= $right)
  else
    AST not ($left < $right)

define operator binary ~min with precedence: 5
  @maybe-cache left, #(set-left, left)@
    @maybe-cache right, #(set-right, right)@
      AST if $set-left ~< $set-right then $left else $right

define operator binary ~max with precedence: 5
  @maybe-cache left, #(set-left, left)@
    @maybe-cache right, #(set-right, right)@
      AST if $set-left ~> $set-right then $left else $right

define operator binary min with precedence: 5
  @maybe-cache left, #(set-left, left)@
    @maybe-cache right, #(set-right, right)@
      AST if $set-left < $set-right then $left else $right

define operator binary max with precedence: 5
  @maybe-cache left, #(set-left, left)@
    @maybe-cache right, #(set-right, right)@
      AST if $set-left > $set-right then $left else $right

define operator binary xor with precedence: 0
  AST __xor($left, $right)

define operator binary ? with precedence: 0
  @maybe-cache left, #(set-left, left)@
    AST if $set-left? then $left else $right

define operator assign ~min=, ~max=, min=, max=, xor=
  @maybe-cache-access left, #(set-left, left)@
    let action = if op == "~min="
      AST $left ~min $right
    else if op == "~max="
      AST $left ~max $right
    else if op == "min="
      AST $left min $right
    else if op == "max="
      AST $left max $right
    else if op == "xor="
      AST $left xor $right
    else
      throw Error()
    AST $set-left := $action

define operator assign ?=
  @maybe-cache-access left, #(set-left, left)@
    @maybe-cache set-left, #(set-left, left-value)@
      AST if $set-left? then $left-value else ($left := $right)

define operator binary ~bitand with precedence: 0
  @binary left, "&", right

define operator binary ~bitor with precedence: 0
  @binary left, "|", right

define operator binary ~bitxor with precedence: 0
  @binary left, "^", right

define operator assign ~bitand=, ~bitor=, ~bitxor=
  if op == "~bitand="
    @assign left, "&=", right
  else if op == "~bitor="
    @assign left, "|=", right
  else
    @assign left, "^=", right

define operator binary bitand with precedence: 0
  AST +$left ~bitand +$right

define operator binary bitor with precedence: 0
  AST +$left ~bitor +$right

define operator binary bitxor with precedence: 0
  AST +$left ~bitxor +$right

define operator unary ~bitnot
  @unary "~", node

define operator unary bitnot
  AST ~bitnot +$node

define operator unary typeof!
  AST __typeof($node)

define operator unary delete with standalone: false
  if not @is-access(node)
    throw Error "Can only use delete on an access"
  if @expr
    @maybe-cache-access node, #(set-node, node)@
      let tmp = @tmp \ref
      let del = @unary "delete", node
      AST
        let $tmp = $set-node
        $del
        $tmp
  else
    @unary "delete", node

define operator unary throw?
  @maybe-cache node, #(set-node, node)
    AST if $set-node?
      throw $node

define operator assign *=, /=, %=, +=, -=, bitlshift=, bitrshift=, biturshift=, bitand=, bitor=, bitxor=
  // TODO: if left is proven to be a number, use raw operators instead
  @maybe-cache-access left, #(set-left, left)@
    let action = if op == "*="
      AST $left * $right
    else if op == "/="
      AST $left / $right
    else if op == "%="
      AST $left % $right
    else if op == "+="
      AST $left + $right
    else if op == "-="
      AST $left - $right
    else if op == "bitlshift="
      AST $left bitlshift $right
    else if op == "bitrshift="
      AST $left bitrshift $right
    else if op == "biturshift="
      AST $left biturshift $right
    else if op == "bitand="
      AST $left bitand $right
    else if op == "bitor="
      AST $left bitor $right
    else if op == "bitxor="
      AST $left bitxor $right
    else
      throw Error()
    AST $set-left := $action

macro unless
  syntax test as Logic, "then", body, else-body as ("else", this)?
    AST if not $test then $body else $else-body

  syntax test as Logic, body as Body, else-ifs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, else-body as ("else", this as Body)?
    let f(i, current)@
      let mutable test = else-ifs[i]?.test
      test := if else-ifs[i]?.type == "unless" then (AST not $test) else test
      if i ~< 0 then current else f(i ~- 1, @if(test, else-ifs[i].body, current))
    @if((AST not $test), body, f(else-ifs.length ~- 1, else-body))

macro do
  syntax locals as (ident as Identifier, "=", value, rest as (",", ident as Identifier, "=", value)*)?, body as Body
    let params = []
    let values = []
    if not @empty(locals)
      if not @empty(locals.ident)
        params.push @param locals.ident
        values.push locals.value
      let f(i)@
        if i ~< locals.rest.length
          if not @empty(locals.rest[i].ident)
            params.push @param locals.rest[i].ident
            values.push locals.rest[i].value
          f i ~+ 1
      f 0
    @call(@func(params, body, true, true), values)

macro with
  syntax node as Expression, body as Body
    let func = if @expr
      AST #-> $body
    else
      AST #!-> $body
    AST $func@($node)

define helper __lt = #(x, y)
  let type = typeof x
  if type not in ["number", "string"]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " ~& typeof y)
  else
    x ~< y

define helper __lte = #(x, y)
  let type = typeof x
  if type not in ["number", "string"]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " ~& typeof y)
  else
    x ~<= y

define helper __slice = do
  let slice = Array.prototype.slice
  #(array, start, end) -> slice@(array, start, end)

define helper __splice = do
  let splice = Array.prototype.splice
  #(array, mutable start, mutable end, right)
    let len = array.length
    if start ~< 0
      start ~+= len
    if end ~< 0
      end ~+= len
    splice@ array, start, end ~- start, ...right
    right

define helper __typeof = do
  let _to-string = Object.prototype.to-string
  #(o)
    if o == undefined
      "Undefined"
    else if o == null
      "Null"
    else
      (o.constructor and o.constructor.name) or _to-string@(o).slice(8, -1)

define helper __freeze = if typeof Object.freeze == "function"
  Object.freeze
else
  #(x) -> x

define helper __freeze-func = #(x)
  if x.prototype?
    __freeze(x.prototype)
  __freeze(x)

define helper __is-array = if typeof Array.is-array == "function"
  Array.is-array
else
  do
    let _to-string = Object.prototype.to-string
    #(x) -> _to-string@(x) == "[object Array]"

define helper __to-array = #(x)
  if __is-array(x)
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

define operator unary ^
  AST __create($node)

define helper __pow = Math.pow
define helper __floor = Math.floor
define helper __sqrt = Math.sqrt
define helper __log = Math.log

macro for
  // FIXME: init should be an Expression or Assignment or Let
  syntax reducer as ("every" | "some" | "first")?, init as (Expression|""), ";", test as (Logic|""), ";", step as (Statement|""), body as Body, else-body as ("else", this as Body)?
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
    if not @empty(else-body)
      if @expr
        throw Error("Cannot use a for loop with an else as an expression")
      else if reducer
        throw Error("Cannot use a for loop with an else with " ~& reducer)
      let run-else = @tmp \else
      body := AST
        $run-else := false
        $body
      init := AST
        $run-else := true
        $init
      let loop = @for(init, test, step, body)
      AST
        $loop
        if $run-else
          $else-body
    else
      if reducer
        if reducer == "first"
          body := @mutate-last body, #(node) -> (AST return $node)
          let loop = @for(init, test, step, body)
          AST do
            $loop
        else if reducer == "some"
          body := @mutate-last body, #(node) -> AST
            if $node
              return true
          let loop = [@for(init, test, step, body), (AST return false)]
          AST do
            $loop
        else if reducer == "every"
          body := @mutate-last body, #(node) -> AST
            if not $node
              return false
          let loop = [@for(init, test, step, body), (AST return true)]
          AST do
            $loop
        else
          throw Error("Unknown reducer: " ~& reducer)
      else if @expr
        let arr = @tmp \arr
        body := @mutate-last body, #(node) -> (AST $arr.push $node)
        init := AST
          $arr := []
          $init
        let loop = [@for(init, test, step, body), (AST return $arr)]
        AST do
          $loop
      else
        @for(init, test, step, body)
  
  syntax reducer as ("every" | "some" | "first")?, ident as Identifier, "=", start, ",", end, step as (",", this)?, body as Body, else-body as ("else", this as Body)?
    if not @empty(else-body) and @expr
      throw Error("Cannot use a for loop with an else as an expression")
    
    if @empty(reducer)
      reducer := null
    if @empty(step)
      step := AST 1
    
    let has-func = @has-func(body)
    
    let init = []
    
    if @is-const(start)
      if typeof @value(start) != "number"
        throw Error "Cannot start with a non-number: #(@value start)"
    else
      start := AST +$start
    init.push (AST let $ident = $start)
    
    if @is-const(end)
      if typeof @value(end) != "number"
        throw Error "Cannot end with a non-number: #(@value start)"
    else if @is-complex(end)
      end := @cache (AST +$end), init, \end, has-func
    else
      init.push AST +$end
    
    if @is-const(step)
      if typeof @value(step) != "number"
        throw Error "Cannot step with a non-number: #(@value step)"
    else if @is-complex(step)
      step := @cache (AST +$step), init, \step, has-func
    else
      init.push AST +$step
    
    let test = if @is-const(step)
      if @value(step) ~> 0
        if @is-const(end) and @value(end) == Infinity
          AST true
        else
          AST $ident ~< $end
      else
        if @is-const(end) and @value(end) == -Infinity
          AST true
        else
          AST $ident ~> $end
    else
      AST if $step ~> 0 then $ident ~< $end else $ident ~> $end
    
    if has-func
      let func = @tmp \f
      init.push (AST let $func = #($ident) -> $body)
      body := (AST $func($ident))
    
    if reducer == "every"
      AST
        for every $init; $test; $ident ~+= $step
          $body
        else
          $else-body
    else if reducer == "some"
      AST
        for some $init; $test; $ident ~+= $step
          $body
        else
          $else-body
    else if reducer == "first"
      AST
        for first $init; $test; $ident ~+= $step
          $body
        else
          $else-body
    else
      AST
        for $init; $test; $ident ~+= $step
          $body
        else
          $else-body
  
  syntax reducer as ("every" | "some" | "first")?, value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as Body, else-body as ("else", this as Body)?
    if not @empty(else-body) and @expr
      throw Error("Cannot use a for loop with an else as an expression")
    
    if @empty(reducer)
      reducer := null
    
    let has-func = @has-func(body)
    
    let init = []
    array := @cache array, init, \arr, has-func
    
    let mutable length = null
    if @empty(index)
      index := @tmp \i
      length := @tmp \len
    else
      length := index.length
      index := index.value
      if @empty(length)
        length := @tmp \len
    
    init.push AST let mutable $index = 0
    init.push AST let $length = +$array.length
    
    body := AST
      let $value = $array[$index]
      $body
    
    if has-func
      let func = @tmp \f
      init.push AST let $func = #($index) -> $body
      body := AST $func($index)
    
    if reducer == "every"
      AST
        for every $init; $index ~< $length; $index ~+= 1
          $body
        else
          $else-body
    else if reducer == "some"
      AST
        for some $init; $index ~< $length; $index ~+= 1
          $body
        else
          $else-body
    else if reducer == "first"
      AST
        for first $init; $index ~< $length; $index ~+= 1
          $body
        else
          $else-body
    else
      AST
        for $init; $index ~< $length; $index ~+= 1
          $body
        else
          $else-body
  
  syntax reducer as ("every" | "some" | "first")?, key as Identifier, value as (",", value as Identifier, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as Body, else-body as ("else", this as Body)?
    if @empty(reducer)
      reducer := null
  
    if not @empty(else-body)
      if @expr
        throw Error("Cannot use a for loop with an else as an expression")
      else if reducer
        throw Error("Cannot use a for loop with an else with " ~& reducer)
    
    let mutable index = null
    if @empty(value)
      value := null
    else
      index := value.index
      value := value.value
      if @empty(index)
        index := null
    
    let has-func = @has-func(body)
    let own = type == "of"
    let init = []
    if own or value
      object := @cache object, init, \obj, has-func
    
    if value
      body := AST
        let $value = $object[$key]
        $body
    
    if has-func
      let func = @tmp \f
      if index
        init.push (AST let $func = #($key, $index) -> $body)
        body := (AST $func($key, $index))
      else
        init.push (AST let $func = #($key) -> $body)
        body := (AST $func($key))
    
    let post = []
    if not @empty(else-body)
      let run-else = @tmp \else
      init.push (AST let $run-else = true)
      body := AST
        $run-else := false
        $body
      post.push AST
        if $run-else
          $else-body
    
    if index
      init.push (AST let mutable $index = -1)
      body := AST
        $index ~+= 1
        $body
    
    if own
      body := AST
        if $object ownskey $key
          $body
    
    if @empty(else-body)
      if reducer
        if reducer == "first"
          body := @mutate-last body, #(node) -> (AST return $node)
          let loop = @for-in(key, object, body)
          return AST do
            $init
            $loop
            false
        else if reducer == "some"
          body := @mutate-last body, #(node) -> AST
            if $node
              return true
          let loop = @for-in(key, object, body)
          return AST do
            $init
            $loop
            false
        else if reducer == "every"
          body := @mutate-last body, #(node) -> AST
            if not $node
              return false
          let loop = @for-in(key, object, body)
          return AST do
            $init
            $loop
            true
        else
          throw Error("Unknown reducer: " ~& reducer)
      else if @expr
        let arr = @tmp \arr
        body := @mutate-last body, #(node) -> (AST $arr.push $node)
        init := AST
          $arr := []
          $init
        let loop = [init, @for-in(key, object, body), (AST return $arr)]
        return AST do
          $loop
    
    let loop = @for-in(key, object, body)
    AST
      $init
      $loop
      $post

macro while
  syntax test as Logic, step as (",", this as Statement)?, body as Body, else-body as ("else", this as Body)?
    if not @empty(else-body)
      if @expr
        throw Error("Cannot use a while loop with an else as an expression")
      AST
        for ; $test; $step
          $body
        else
          $else-body
    else
      AST
        for ; $test; $step
          $body

macro until
  syntax test as Logic, step as (",", this as Statement)?, body as Body, else-body as ("else", this as Body)?
    AST
      while not $test, $step
        $body
      else
        $else-body

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
  let new-creators = []
  #(Ctor, args)
    let length = args.length
    let creator = new-creators[length]
    if not creator
      let func = ["return new C("]
      for i = 0, length
        if i ~> 0
          func.push ", "
        func.push "a[", i, "]"
      func.push ");"
      creator := Function("C", "a", func.join(""))
      new-creators[length] := creator
    creator(Ctor, args)

define helper __instanceofsome = #(value, array)
  for some item in array
    value instanceof item

define operator binary instanceofsome with precedence: 3, maximum: 1, invertible: true
  let result = if @is-array(right)
    let elements = @elements(right)
    if elements.length == 0
      if @is-complex(left)
        AST
          $left
          false
      else
        AST false
    else if elements.length == 1
      let element = elements[0]
      AST $left instanceof $element
    else
      let f(i, current, left)
        if i ~< elements.length
          let element = elements[i]
          f(i ~+ 1, AST $current or $left instanceof $element, left)
        else
          current
      @maybe-cache left, #(set-left, left)
        let element = elements[0]
        f(1, AST $set-left instanceof $element, left)
  else
    AST __instanceofsome($left, $right)
  if inverted
    AST not $result
  else
    result

macro try
  syntax try-body as Body, catch-part as ("catch", ident as Identifier, body as Body)?, else-body as ("else", this as Body)?, finally-body as ("finally", this as Body)?
    let has-else = not @empty(else-body)
    if @empty(catch-part) and has-else and @empty(finally-body)
      throw Error("Must provide at least a catch, else, or finally to a try block")
    
    let mutable catch-ident = if not @empty(catch-part) then catch-part.ident
    let mutable catch-body = if not @empty(catch-part) then catch-part.body
    let init = []
    let mutable run-else = void
    if has-else
      run-else := @tmp \else
      init.push AST let $run-else = true
      if catch-body
        catch-body := AST
          $run-else := false
          $catch-body
      else
        catch-ident := @tmp \err
        catch-body := AST
          $run-else := false
          throw $catch-ident
    
    let mutable current = try-body
    if catch-body
      current := @try-catch(current, catch-ident, catch-body)
    if has-else
      current := @try-finally current, AST
        if $run-else
          $else-body
    if not @empty(finally-body)
      current := @try-finally(current, finally-body)
    
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
    if not @is-call(call)
      throw Error("async call expression must be a call")
    
    params := if not @empty(params) then [params.head].concat(params.tail) else []
    let func = @func(params, body, true, true)
    @call @call-func(call), @call-args(call).concat([func]), @call-is-new(call)

define helper __xor = #(x, y)
  if x
    not y
  else
    y

macro require!
  syntax name as Expression
    if @is-const name
      if typeof @value(name) != "string"
        throw Error("Expected a constant string, got $(typeof @value(name))")
    else if not @is-ident name
      throw Error("Expected either a constant string or ident")

    if @is-const name
      let mutable ident-name = @value(name)
      if ident-name.index-of("/") != -1
        ident-name := ident-name.substring ident-name.last-index-of("/") ~+ 1
      let ident = @ident ident-name
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
    let done = @tmp \done, true
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
        let first = @tmp \first, true
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
      let first = @tmp \first, true
      let value = @tmp \value, true
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
    
    if @is-const(start)
      if typeof @value(start) != "number"
        throw Error "Cannot start with a non-number: #(@value start)"
    else
      start := AST +$start
    init.push (AST let $ident = $start)
    
    if @is-const(end)
      if typeof @value(end) != "number"
        throw Error "Cannot end with a non-number: #(@value start)"
    else if @is-complex(end)
      end := @cache (AST +$end), init, \end, true
    else
      init.push AST +$end
    
    if @is-const(step)
      if typeof @value(step) != "number"
        throw Error "Cannot step with a non-number: #(@value step)"
    else if @is-complex(step)
      step := @cache (AST +$step), init, \step, true
    else
      init.push AST +$step
    
    let test = if @is-const(step)
      if @value(step) ~> 0
        if @is-const(end) and @value(end) == Infinity
          AST true
        else
          AST $ident ~< $end
      else
        if @is-const(end) and @value(end) == -Infinity
          AST true
        else
          AST $ident ~> $end
    else
      AST if $step ~> 0 then $ident ~< $end else $ident ~> $end
    
    AST
      asyncfor $result <- $next, $init; $test; $ident ~+= $step
        $body
      $rest
  
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as Body, rest as DedentedBody
    let init = []
    array := @cache array, init, \arr, true
    
    let mutable length = null
    if @empty(index)
      index := @tmp \i, true
      length := @tmp \len, true
    else
      length := index.length
      index := index.value
      if @empty(length)
        length := @tmp \len, true

    init.push AST let mutable $index = 0
    init.push AST let $length = +$array.length

    body := AST
      let $value = $array[$index]
      $body
    
    AST
      asyncfor $result <- $next, $init; $index ~< $length; $index ~+= 1
        $body
      $rest
  
  syntax result as (this as Identifier, "<-")?, next as Identifier, ",", key as Identifier, value as (",", value as Identifier, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as Body, rest as DedentedBody
    let own = type == "of"
    let init = []
    object := @cache object, init, \obj, true
    
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
      index := @tmp \i, true
    
    let keys = @tmp \keys, true
    let get-keys = if own
      AST for $key of $object
        $keys.push $key
    else
      AST for $key ofall $object
        $keys.push $key
    AST
      $init
      let $keys = []
      $get-keys
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
  syntax result as (this as Identifier, "<-")?, done as Identifier, ",", test as Logic, body as Body, else-ifs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, else-body as ("else", this as Body)?, rest as DedentedBody
    
    let mutable current = else-body
    if @empty(else-body)
      current := AST $done()
    
    let mutable i = else-ifs.length ~- 1
    while i ~>= 0, i ~-= 1
      let else-if = else-ifs[i]
      let mutable inner-test = else-if.test
      if else-if.type == "unless"
        inner-test := AST not $inner-test
      current := @if(inner-test, else-if.body, current)
    
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
  syntax result as (this as Identifier, "<-")?, done as Identifier, ",", test as Logic, body as Body, else-ifs as ("else", type as ("if" | "unless"), test as Logic, body as Body)*, else-body as ("else", this as Body)?, rest as DedentedBody
    
    let mutable current = else-body
    if @empty(else-body)
      current := AST $done()
    
    let mutable i = else-ifs.length ~- 1
    while i ~>= 0, i ~-= 1
      let else-if = else-ifs[i]
      let mutable inner-test = else-if.test
      if else-if.type == "unless"
        inner-test := AST not $inner-test
      current := @if(inner-test, else-if.body, current)
    
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

macro class
  syntax name as SimpleAssignable?, superclass as ("extends", this)?, body as Body?
    let mutable declaration = void
    let mutable assignment = void
    if @is-ident(name)
      declaration := name
    else if @is-access(name)
      assignment := name
      if @is-const(@child(name)) and typeof @value(@child(name)) == \string
        name := @ident(@value(@child(name))) ? @tmp \class
      else
        name := @tmp \class
    else
      name := @tmp \class
    
    let has-superclass-const = @const not @empty(superclass)
    let sup = if @empty(superclass) then superclass else @tmp \super
    let init = []
    let superproto = if @empty(superclass) then AST Object.prototype else @tmp \superproto
    let prototype = @tmp \proto
    if not @empty(superclass)
      init.push AST let $superproto = $sup.prototype
      init.push AST let $prototype = $name.prototype := ^$superproto
      init.push AST $prototype.constructor := $name
    else
      init.push AST let $prototype = $name.prototype
    
    let display-name = if @is-ident(name) then @const(@name(name))
    if display-name?
      init.push AST $name.display-name := $display-name
    
    let fix-supers(node)@ -> @walk node, #(node)@
      if @is-super(node)
        let mutable child = @super-child(node)
        if child?
          child := fix-supers child
        let args = []
        let super-args = @super-args node
        let mutable i = 0
        let len = super-args.length
        while i ~< len, i ~+= 1
          args.push fix-supers super-args[i]
        
        @call(
          if child?
            AST $superproto[$child]
          else if @empty(superclass)
            AST Object
          else
            AST $sup
          [AST this].concat(args)
          false
          true)
    body := fix-supers body
    
    let mutable constructor-count = 0
    @walk body, #(node)@
      if @is-def(node)
        let key = @left(node)
        if @is-const(key) and @value(key) == \constructor
          constructor-count ~+= 1
      void
    
    let mutable has-top-level-constructor = false
    if constructor-count == 1
      @walk body, #(node)@
        if @is-def(node)
          let key = @left(node)
          if @is-const(key) and @value(key) == \constructor and @is-func(@right(node))
            has-top-level-constructor := true
          node
        else
          node
          
    let self = @tmp \this
    if has-top-level-constructor
      body := @walk body, #(node)@
        if @is-def(node)
          let key = @left(node)
          if @is-const(key) and @value(key) == \constructor
            let value = @right(node)
            let constructor = if @func-is-bound(value)
              let func-body = [
                AST let $self = if this instanceof $name then this else ^$prototype
                @walk @func-body(value), #(node)@
                  if @is-func(node)
                    unless @func-is-bound(node)
                      node
                  else if @is-this(node)
                    self
                AST return $self
              ]
              @func(
                @func-params value
                AST $func-body
                false
                false)
            else
              let error-message = if display-name?
                AST "$($display-name) must be called with new"
              else
                AST "Must be called with new"
              let func-body = [
                AST if this not instanceof $name
                  throw TypeError $error-message
                @func-body(value)
              ]
              @func(
                @func-params value
                AST $func-body
                false
                false)
            init.unshift AST let $name = $constructor
            let noop = []
            AST $noop
        else
          node
    else if constructor-count != 0
      let ctor = @tmp \ctor
      let result = @tmp \ref
      init.push AST
        let mutable $ctor = void
        let $name()
          let $self = if this instanceof $name then this else ^$prototype
          
          if typeof $ctor == "function"
            let $result = $ctor@ $self, ...arguments
            if Object($result) == $result
              return $result
          else if $has-superclass-const
            let $result = $sup@ $self, ...arguments
            if Object($result) == $result
              return $result
          $self
      body := @walk body, #(node)@
        if @is-def(node)
          let key = @left(node)
          if @is-const(key) and @value(key) == \constructor
            let value = @right(node)
            AST $ctor := $value
    else
      if @empty(superclass)
        init.push AST
          let $name() -> if this instanceof $name then this else ^$prototype
      else
        let result = @tmp \ref
        init.push AST
          let $name()
            let $self = if this instanceof $name then this else ^$prototype
            let $result = $sup@ $self, ...arguments
            if Object($result) == $result
              $result
            else
              $self
    
    let change-defs(node)@ -> @walk node, #(node)@
      if @is-def(node)
        let key = @left(node)
        let mutable value = @right(node)
        if @empty(value)
          value := AST #-> throw Error "Not implemented: $(@constructor.name).$($key)()"
        change-defs AST $prototype[$key] := $value
    body := change-defs body
    
    body := @walk body, #(node)@
      if @is-func(node)
        unless @func-is-bound(node)
          node
      else if @is-this(node)
        name
    
    let mutable result = AST do $sup = $superclass
      $init
      $body
      return $name
    
    if declaration?
      AST let $declaration = $result
    else if assignment?
      AST $assignment := $result
    else
      result

macro enum
  syntax name as SimpleAssignable?, body as Body?
    let mutable declaration = void
    let mutable assignment = void
    if @is-ident(name)
      declaration := name
    else if @is-access(name)
      assignment := name
      if @is-const(@child(name)) and typeof @value(@child(name)) == \string
        name := @ident(@value(@child(name))) ? @tmp \enum
      else
        name := @tmp \enum
    else
      name := @tmp \enum
    
    let mutable index = 0
    body := @walk body, #(node)@
      if @is-def node
        let key = @left node
        let mutable value = @right node
        if not @is-const key
          throw Error "Cannot have non-const enum keys"
        if @empty value
          index ~+= 1
          value := @const index
        AST this[$key] := $value
      else
        node
    
    let result = AST with {}
      $body
      return this
    
    if declaration?
      AST let $declaration = $result
    else if assignment?
      AST $assignment := $result
    else
      result

macro namespace
  syntax name as SimpleAssignable?, superobject as ("extends", this)?, body as Body?
    let mutable declaration = void
    let mutable assignment = void
    if @is-ident(name)
      declaration := name
    else if @is-access(name)
      assignment := name
      if @is-const(@child(name)) and typeof @value(@child(name)) == \string
        name := @ident(@value(@child(name))) ? @tmp \ns
      else
        name := @tmp \ns
    else
      name := @tmp \ns
    
    let sup = if @empty(superobject) then superobject else @tmp \super
    let init = []
    if @empty(superobject)
      init.push AST let $name = {}
    else
      init.push AST let $name = ^$sup
    
    let fix-supers(node)@ -> @walk node, #(node)@
      if @is-super(node)
        let mutable child = @super-child(node)
        if child?
          child := fix-supers child
        let args = []
        let super-args = @super-args node
        let mutable i = 0
        let len = super-args.length
        while i ~< len, i ~+= 1
          args.push fix-supers super-args[i]
        let parent = if @empty(superobject)
          AST Object.prototype
        else
          AST $sup
        @call(
          if child?
            AST $parent[$child]
          else
            AST $parent
          [AST this].concat(args)
          false
          true)
    body := fix-supers body
    
    let change-defs(node)@ -> @walk node, #(node)@
      if @is-def(node)
        let key = @left(node)
        let value = @right(node)
        change-defs AST $name[$key] := $value
    body := change-defs body
    
    body := @walk body, #(node)@
      if @is-func(node)
        unless @func-is-bound(node)
          node
      else if @is-this(node)
        name
    
    let mutable result = AST do $sup = $superobject
      $init
      $body
      return $name
    
    if declaration?
      AST let $declaration = $result
    else if assignment?
      AST $assignment := $result
    else
      result
