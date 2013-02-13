macro myif
  syntax test as Logic, body as Body, else-body as ("myelse", this as Body)?
    @if(test, body, else-body)

macro myfor
  syntax init as Expression, ";", test as Logic, ";", step as Statement, body as Body
    @for(init, test, step, body)
  
  syntax ident as Identifier, "=", start, ",", end, body as Body
    let init = []
    
    init.push (AST let mutable $ident = $start)
    
    myif @has-func(body)
      let func = @tmp \f
      init.push (AST let $func = #($ident) -> $body)
      body := (AST $func($ident))
    
    AST
      myfor $init; $ident ~< $end; $ident ~+= 1
        $body

macro poo()
  AST "poo"

macro one-of(thing)
  let parts = []
  let elements = @elements(thing)
  let len = elements.length
  myfor i = 0, len
    let item = elements[i]
    parts.push AST $item
  
  @array parts

one-of [5, 6]

macro square(value)
  let f = @tmp \f
  let tmp = @tmp \ref
  AST do
    let $f()
      $tmp * $tmp
    let $tmp = $value
    $f()

test "scope for tmp variables works properly given differing function scopes", #
  eq 0, square(0)
  eq 25, square(5)
