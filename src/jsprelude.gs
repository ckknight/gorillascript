const true = eval("true")
const false = eval("false")
const null = eval("null")
const void = eval("void 0")
const undefined = void

macro do
  syntax body as (Body | (";", this as Statement))
    ASTE (#@ -> $body)()

// Precedences:
// 0: |>, <|
// 1: and, or, xor, ?, bitand, bitor, bitxor
// 2: ==, !=, ~=, !~=, is, isnt, <, <= (shared with <), >, >= (shared with >), %%
// 3: by
// 4: to, til
// 5: <=>
// 6: in, haskey, ownskey, instanceof, instanceofsome, <<<, >>>
// 7: &
// 8: min, max
// 9: biturshift, bitrshift, bitlshift
// 10: +, - (shared)
// 11: *, /, %, \ (shared)
// 12: ^
// 13: <<, >>

macro operator binary and with precedence: 1
  @call(
    @binary-operator "&&"
    left
    right)

macro operator binary or with precedence: 1
  @call(
    @binary-operator "||"
    left
    right)

macro operator unary not with type: \boolean
  @mutate-last node,
    #(subnode)
      @call(
        @unary-operator "!"
        subnode)
    true

macro operator unary typeof with type: \string
  @mutate-last node,
    #(subnode)
      @call(
        @unary-operator "typeof"
        subnode)
    true

macro operator binary == with precedence: 2, maximum: 1, type: \boolean
  @call(
    @binary-operator "==="
    left
    right)

macro operator binary != with precedence: 2, maximum: 1, type: \boolean
  ASTE not ($left == $right)

macro operator binary ~= with precedence: 2, maximum: 1, type: \boolean
  @call(
    @binary-operator "=="
    left
    right)

macro operator binary !~= with precedence: 2, maximum: 1, type: \boolean
  ASTE not ($left ~= $right)

macro operator binary ~<, ~<= with precedence: 2, maximum: 1, type: \boolean
  @call(
    @binary-operator op.substring(1)
    left
    right)

macro operator unary throw with type: \none
  @mutate-last node,
    #(subnode)
      @internal-call \throw, subnode
    true

macro helper __throw = (throw)

macro operator unary post-inc! with type: \number
  @call(
    @unary-operator "++post"
    node)

macro operator unary post-dec! with type: \number
  @call(
    @unary-operator "--post"
    node)

macro debugger
  syntax ""
    @internal-call \debugger

macro let
  syntax ident as Identifier, func as FunctionDeclaration
    ident.is-ident and @is-primordial(ident) and @error ["Cannot declare primordial '", ident.name, "'"].join(""), ident
    @add-variable ident, false, #@ @type(func)
    @internal-call \block,
      @internal-call \var, ident
      @call(
        @assign-operator "="
        ident
        func)

macro if, unless
  // this uses eval instead of normal operators since those aren't defined yet
  // thankfully the eval uses constant strings and turns into pure code
  syntax test as Logic, "then", body, else-ifs as ("else", "if", test as Logic, "then", body)*, else-body as ("else", this)?
    let dec(x) -> eval "x - 1"
    let f(i, current)
      (i ~< 0 and current) or f@ this,
        dec(i)
        @internal-call \if,
          else-ifs[i].test or @noop()
          else-ifs[i].body or @noop()
          current
    @internal-call \if,
      (macro-name == \unless and ASTE(test) not $test) or test or @noop()
      body or @noop()
      f@ this,
        dec(else-ifs.length)
        else-body or @noop()

  syntax test as Logic, body as (BodyNoEnd | (";", this as Statement)), else-ifs as ("\n", "else", type as ("if" | "unless"), test as Logic, body as (BodyNoEnd | (";", this as Statement)))*, else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    let dec(x) -> eval "x - 1"
    let f(i, current)
      if i ~< 0 then current else f@ this,
        dec(i)
        @internal-call \if,
          if else-ifs[i].type == \unless then (ASTE(else-ifs[i].test) not $(else-ifs[i].test)) else (else-ifs[i].test or @noop())
          else-ifs[i].body or @noop()
          current
    @internal-call \if,
      (macro-name == \unless and ASTE(test) not $test) or test or @noop()
      body or @noop()
      f@ this,
        dec(else-ifs.length)
        else-body or @noop()

macro operator binary ~>, ~>= with precedence: 2, maximum: 1, type: \boolean
  if op == "~>"
    ASTE not ($left ~<= $right)
  else
    ASTE not ($left ~< $right)

macro continue
  syntax label as (Identifier|"")
    if @position == \expression
      @error "continue can only be used in a statement position"
    @internal-call \continue, if label then [label] else []

macro break
  syntax label as (Identifier|"")
    if @position == \expression
      @error "break can only be used in a statement position"
    @internal-call \break, if label then [label] else []

macro operator unary ? with postfix: true, type: \boolean, label: \existential
  if node and node.is-ident-or-tmp and not @has-variable(node)
    ASTE typeof $node != \undefined and $node != null
  else
    ASTE $node !~= null

macro operator unary is-void!, is-undefined! with type: \boolean
  if node and node.is-ident-or-tmp and not @has-variable(node)
    ASTE typeof $node == \undefined
  else
    ASTE $node == void

macro operator unary is-null! with type: \boolean
  if node and node.is-ident-or-tmp and not @has-variable(node)
    ASTE typeof $node != \undefined and $node == null
  else
    ASTE $node == null

macro operator unary is-string! with type: \boolean
  ASTE typeof $node == \string

macro operator unary is-number! with type: \boolean
  ASTE typeof $node == \number

macro operator unary is-boolean! with type: \boolean
  ASTE typeof $node == \boolean

macro operator unary is-function! with type: \boolean
  ASTE typeof $node == \function

macro operator unary is-array! with type: \boolean
  if node and node.is-ident-or-tmp and not @has-variable(node)
    ASTE typeof $node != \undefined and __is-array($node)
  else
    ASTE __is-array($node)

macro operator unary is-object! with type: \boolean
  ASTE typeof $node == \object and $node != null

macro helper GLOBAL = if not is-void! window then window else if not is-void! global then global else this

macro helper __xor = #(x, y)
  if x
    not y and x
  else
    y or x

macro operator assign := with type: \right
  if not left.cacheable or (left.is-internal-call(\access) and not left.args[0].cacheable and not left.args[1].cacheable)
    @mutate-last right,
      #(subnode)
        @call(
          @assign-operator "="
          left
          subnode)
      true
  else
    @call(
      @assign-operator "="
      left
      right)

macro operator binary ~& with precedence: 7, type: \string
  if @has-type(left, \numeric) and @has-type(right, \numeric)
    @call(
      @binary-operator "+"
      @call(
        @binary-operator "+"
        @const ""
        left)
      right)
  else if @is-type(right, \string) and @macro-expand-1(left).is-const-value("")
    right
  else if @is-type(left, \string) and @macro-expand-1(right).is-const-value("")
    left
  else
    @call(
      @binary-operator "+"
      left
      right)

macro syntax DeclarableIdent = is-mutable as "mutable"?, ident as Identifier, as-type as ("as", this as Type)?
  ident := @macro-expand-1 ident
  if @is-node(ident)
    type: \ident
    is-mutable: is-mutable == "mutable"
    ident: ident
    as-type: as-type
  else
    ident

macro syntax DeclarableArray = "[", head as (Declarable|""), tail as (",", this as (Declarable|""))*, "]"
  type: \array
  elements: [head].concat(tail)

macro syntax DeclarableObjectSingularPair = value as DeclarableIdent
  value := @macro-expand-1(value)
  {
    key: value.ident.name
    value
  }
macro syntax DeclarableObjectDualPair = this as (key as ObjectKey, ":", value as Declarable)
macro syntax DeclarableObjectPair = this as (DeclarableObjectDualPair | DeclarableObjectSingularPair)
macro syntax DeclarableObject = "{", head as DeclarableObjectPair, tail as (",", this as DeclarableObjectPair)*, "}"
  type: \object
  pairs: [head].concat(tail)

macro syntax Declarable = this as (DeclarableArray | DeclarableObject | DeclarableIdent)

macro let
  syntax declarable as Declarable, "=", value as ExpressionOrAssignmentOrBody
    let inc(x) -> eval("x + 1")
    declarable := @macro-expand-1(declarable)
    if not declarable
      @error "Unknown declarable: " ~& String declarable
    if declarable.type == \ident
      if declarable.ident.is-ident and @is-primordial(declarable.ident)
        @error "Cannot declare primordial '" ~& declarable.ident.name ~& "'", declarable.ident
      @add-variable declarable.ident, declarable.is-mutable, if declarable.as-type then #@ @to-type(declarable.as-type) else #@ @type(value)
      @internal-call \block,
        @internal-call \var, declarable.ident
        @mutate-last value,
          #(subnode)
            @call(
              @assign-operator "="
              declarable.ident
              subnode)
          true
        ASTE void
    else if declarable.type == \array
      let num-real-elements(i, acc)
        if i ~< declarable.elements.length
          num-real-elements inc(i), if declarable.elements[i] then inc(acc) else acc
        else
          acc
      value := @macro-expand-1 value
      if value.is-internal-call(\array) // TODO: and there are no spreads
        let handle-item(elements, i, element, element-value, block)
          block.push @macro-expand-1 AST let $element = $element-value
          handle@ this, elements, inc(i), block
        let handle(elements, i, block)
          if i ~< declarable.elements.length and i ~< elements.length
            if declarable.elements[i]
              handle-item@ this, elements, i, declarable.elements[i], elements[i], block
            else
              block.push elements[i]
              handle@ this, elements, inc(i), block
          else
            block.push ASTE void
            @internal-call \block, block
        handle@ this, value.args, 0, []
      else if num-real-elements(0, 0) ~<= 1
        let handle-item(element, index)
          @internal-call \block,
            @macro-expand-1 AST let $element = $value[$index]
            ASTE void
        let handle(i)
          if i ~< declarable.elements.length
            if declarable.elements[i]
              handle-item@ this, declarable.elements[i], @const i
            else
              handle@ this, inc(i)
          else
            AST
              $value
              void
        handle@ this, 0
      else 
        @maybe-cache value, #(set-value, value, cached)
          let handle-item(i, element, index, block)
            block.push @macro-expand-1 AST let $element = $value[$index]
            handle@ this, inc(i), block
          let handle(i, block)
            if i ~< declarable.elements.length
              if declarable.elements[i]
                handle-item@ this, i, declarable.elements[i], @const(i), block
              else
                handle@ this, inc(i), block
            else
              if cached
                block.push AST $value := null
              block.push ASTE void
              @internal-call \block, block
          handle@ this, 0, [set-value]
    else if declarable.type == \object
      if declarable.pairs.length == 1
        let handle-item(left, key)
          @internal-call \block,
            @macro-expand-1 AST let $left = $value[$key]
            ASTE void
        let handle(pair)
          handle-item@ this, pair.value, pair.key
        handle@ this, @macro-expand-1(declarable.pairs[0])
      else
        @maybe-cache value, #(set-value, value, cached)
          let handle-item(i, left, key, block)
            block.push @macro-expand-1 AST let $left = $value[$key]
            handle@ this, inc(i), block
          let handle-pair(i, pair, block)
            handle-item@ this, i, pair.value, pair.key, block
          let handle(i, block)
            if i ~< declarable.pairs.length
              handle-pair@ this, i, @macro-expand-1(declarable.pairs[i]), block
            else
              if cached
                block.push AST $value := null
              block.push ASTE void
              @internal-call \block, block
          handle@ this, 0, [set-value]
    else
      @error "Unknown declarable: " ~& String declarable ~& " " ~& (String declarable?.constructor?.name)

macro return
  syntax node as Expression?
    @mutate-last node,
      #(subnode)
        @internal-call \return, subnode
      true

macro return?
  syntax node as Expression
    @mutate-last node,
      #(subnode)
        @maybe-cache subnode, #(set-subnode, subnode)
          AST
            if $set-subnode?
              return $subnode
      true

macro returnif
  syntax node as Expression
    @mutate-last node,
      #(subnode)
        if @is-type subnode, \boolean
          AST
            if $subnode
              return true
        else
          @maybe-cache subnode, #(set-subnode, subnode)
            AST
              if $set-subnode
                return $subnode
      true

macro returnunless
  syntax node as Expression
    @mutate-last node,
      #(subnode)
        if @is-type subnode, \boolean
          AST
            unless $subnode
              return false
        else
          @maybe-cache subnode, #(set-subnode, subnode)
            AST
              unless $set-subnode
                return $subnode
      true

macro operator assign and=
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left and ($left := $right)

macro operator assign or=
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left or ($left := $right)

// let's define the unstrict operators first
macro operator binary ~*, ~/, ~%, ~\ with precedence: 11, type: \number
  if op == "~\\"
    ASTE Math.floor $(@call @binary-operator("/"), left, right)
  else if op == "~*"
    @call @binary-operator("*"), left, right
  else if op == "~/"
    @call @binary-operator("/"), left, right
  else
    @call @binary-operator("%"), left, right

const Infinity = 1 ~/ 0
const NaN = 0 ~/ 0

macro operator assign ~*=, ~/=, ~%= with type: \number
  left := @macro-expand-1 left
  if left.is-ident-or-tmp
    @mutate-last right,
      #(subnode)
        if op == "~*="
          @call @assign-operator("*="), left, subnode
        else if op == "~/="
          @call @assign-operator("/="), left, subnode
        else
          @call @assign-operator("%="), left, subnode
      true
  else
    if op == "~*="
      @call @assign-operator("*="), left, right
    else if op == "~/="
      @call @assign-operator("/="), left, right
    else
      @call @assign-operator("%="), left, right

macro operator assign ~\= with type: \number
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left := $left ~\ $right

macro operator unary ~+, ~- with type: \number
  node := @macro-expand-1 node
  if node.is-value
    let mutable value = Number(node.value)
    if op == "~-"
      let negate(x) -> eval("-1") ~* x
      value := negate value
    @const value
  else
    @mutate-last node,
      #(subnode)
        @call(
          @unary-operator op.char-at(1)
          subnode)
      true

macro operator binary ~+, ~- with precedence: 10, type: \number
  if op == "~+"
    if not @is-type(left, \numeric) and not @is-type(right, \numeric)
      @call(
        @binary-operator "-"
        left
        ASTE(right) ~-($right))
    else
      if not @is-type left, \numeric
        left := ASTE(left) ~+($left)
      else if not @is-type right, \numeric
        right := ASTE(right) ~+($right)
      @call(
        @binary-operator "+"
        left
        right)
  else
    @call(
      @binary-operator "-"
      left
      right)

macro operator binary ~^ with precedence: 12, right-to-left: true, type: \number
  right := @macro-expand-1 right
  if right.is-value
    let value = Number(right.value)
    if value == 0
      return AST
        $left
        1
    else if value == 0.5
      return ASTE Math.sqrt $left
    else if value == 1
      return ASTE ~+$left
    else if value == 2
      return @maybe-cache left, #(set-left, left)
        ASTE $set-left ~* $left
    else if value == 3
      return @maybe-cache left, #(set-left, left)
        ASTE $set-left ~* $left ~* $left
    else if value == ~-0.5
      return ASTE 1 ~/ Math.sqrt($left)
    else if value == ~-1
      return ASTE 1 ~/ $left
    else if value == ~-2
      return @maybe-cache left, #(set-left, left)
        ASTE 1 ~/ ($set-left ~* $left)
    else if value == ~-3
      return @maybe-cache left, #(set-left, left)
        ASTE 1 ~/ ($set-left ~* $left ~* $left)
  ASTE Math.pow $left, $right

macro operator assign ~^= with type: \number
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left := $left ~^ $right

macro operator assign ~+= with type: \number
  right := @macro-expand-1 right
  if right.is-value
    let value = Number(right.value)
    if value == 1
      return @call @unary-operator("++"), left
    else if value == ~-1
      return @call @unary-operator("--"), left
  
  left := @macro-expand-1 left
  if @is-type left, \numeric
    let addAssign(right)@
      @call @assign-operator("+="), left, if @is-type right, \numeric
        right
      else
        ASTE(right) ~+$right
    if left.is-ident-or-tmp
      @mutate-last right, addAssign, true
    else
      addAssign right
  else
    let subtractAssign(right)@
      @call @assign-operator("-="), left, ASTE(right) ~-$right
    if left.is-ident-or-tmp
      @mutate-last right, subtractAssign, true
    else
      subtractAssign right

macro operator assign ~-= with type: \number
  right := @macro-expand-1 right
  if right.is-value
    let value = Number(right.value)
    if value == 1
      return @call @unary-operator("--"), left
    else if value == ~-1
      return @call @unary-operator("++"), left

  left := @macro-expand-1 left
  let subtractAssign(right)@
    @call @assign-operator("-="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, subtractAssign, true
  else
    subtractAssign right

macro operator binary ~bitlshift with precedence: 9, maximum: 1, type: \number
  @call @binary-operator("<<"), left, right

macro operator binary ~bitrshift with precedence: 9, maximum: 1, type: \number
  @call @binary-operator(">>"), left, right

macro operator binary ~biturshift with precedence: 9, maximum: 1, type: \number
  @call @binary-operator(">>>"), left, right

macro operator assign ~bitlshift= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator("<<="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator assign ~bitrshift= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator(">>="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator assign ~biturshift= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator(">>>="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator assign ~&= with type: \string
  left := @macro-expand-1 left
  let left-is-numeric = @has-type(left, \numeric)
  let assign(right)@
    @call @assign-operator("+="), left, if left-is-numeric and @has-type(right, \numeric)
      ASTE(right) "" ~& $right
    else
      right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro helper __typeof = do
  let _to-string = Object.prototype.to-string
  #(o) as String
    if is-void! o
      "Undefined"
    else if is-null! o
      "Null"
    else
      (o.constructor and o.constructor.name) or _to-string@(o).slice(8, ~-1)

macro operator unary typeof! with type: \string
  node := @macro-expand-1 node
  if node.is-ident-or-tmp and not @has-variable(node)
    ASTE if typeof $node == \undefined then "Undefined" else __typeof($node)
  else
    @mutate-last node, (#(subnode) -> ASTE __typeof($subnode)), true

macro helper __first = #(x) -> x

macro first!(head)
  // FIXME: this is hackish, macro should be (head, ...tail)
  let mutable tail = arguments[0].macroData.slice(1)
  if tail.length == 0
    ASTE $head
  else if @position == \statement
    let tmp = @tmp \ref
    AST
      let $tmp = $head
      $tail
      $tmp
  else
    tail.push ASTE void
    AST __first($head, $tail)

macro last!()
  // FIXME: this is hackish, macro should be (...start, finish)
  let start = arguments[0].macroData.slice(0, ~-1)
  let finish = arguments[0].macroData[* ~- 1]
  if start.length == 0
    ASTE $finish
  else
    AST
      $start
      $finish

macro helper __num = #(num) as Number
  if not is-number! num
    throw TypeError("Expected a number, got " ~& typeof! num)
  else
    num

macro helper __str = #(str) as String
  if not is-string! str
    throw TypeError("Expected a string, got " ~& typeof! str)
  else
    str

macro helper __strnum = #(strnum) as String
  let type = typeof strnum
  if type == \string
    strnum
  else if type == \number
    String(strnum)
  else
    throw TypeError("Expected a string or number, got " ~& typeof! strnum)

// strict operators, should have same precedence as their respective unstrict versions

macro operator unary + with type: \number
  @mutate-last node,
    #(subnode)
      if @is-type subnode, \number
        subnode
      else if @get-const-value("DISABLE_TYPE_CHECKING", false)
        ASTE ~+($subnode)
      else
        ASTE __num($subnode)
    true

macro operator unary - with type: \number
  @mutate-last node,
    #(mutable subnode)
      subnode := @macro-expand-1 subnode
      if subnode.is-const-type \number
        @const ~-subnode.const-value()
      else if @get-const-value("DISABLE_TYPE_CHECKING", false)
        ASTE ~-($subnode)
      else
        ASTE ~-(+$subnode)

macro operator binary ^ with precedence: 12, right-to-left: true, type: \number
  if @get-const-value("DISABLE_TYPE_CHECKING", false)
    ASTE $left ~^ $right
  else
    ASTE +$left ~^ +$right

macro operator assign ^= with type: \number
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left := $left ^ $right

macro operator binary *, /, %, \ with precedence: 11, type: \number
  if op == "*"
    ASTE +$left ~* +$right
  else if op == "/"
    ASTE +$left ~/ +$right
  else if op == "%"
    ASTE +$left ~% +$right
  else
    ASTE +$left ~\ +$right

macro operator unary % with postfix: true, type: \number
  ASTE $node / 100

macro operator binary +, - with precedence: 10, type: \number
  if op == "+"
    ASTE +$left ~+ +$right
  else
    ASTE +$left ~- +$right

macro operator binary bitlshift with precedence: 9, maximum: 1, type: \number
  ASTE +$left ~bitlshift +$right

macro operator binary bitrshift with precedence: 9, maximum: 1, type: \number
  ASTE +$left ~bitrshift +$right

macro operator binary biturshift with precedence: 9, maximum: 1, type: \number
  ASTE +$left ~biturshift +$right

macro operator assign \= with type: \number
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left := $left \ $right

macro operator binary & with precedence: 7, type: \string, label: \string-concat
  if not @get-const-value("DISABLE_TYPE_CHECKING", false)
    if not @is-type left, \string-or-number
      left := if not @has-type left, \number
        ASTE(left) __str $left
      else
        ASTE(left) __strnum $left
    if not @is-type right, \string-or-number
      right := if not @has-type right, \number
        ASTE(right) __str $right
      else
        ASTE(right) __strnum $right
  ASTE $left ~& $right

macro operator assign &= with type: \string
  if @get-const-value("DISABLE_TYPE_CHECKING", false)
    ASTE $left ~&= $right
  else if @is-type left, \string
    ASTE $left ~&= "" & $right
  else
    @maybe-cache-access left, #(set-left, left)
      ASTE $set-left := $left & $right

macro operator binary in with precedence: 6, maximum: 1, invertible: true, type: \boolean
  right := @macro-expand-1 right
  if right.is-internal-call \array
    let elements = right.args
    if elements.length == 0
      AST
        $left
        false
    else if elements.length == 1
      ASTE $left == $(elements[0])
    else
      let f(i, current, left)
        if i ~< elements.length
          f(i ~+ 1, ASTE $current or $left == $(elements[i]), left)
        else
          current
      @maybe-cache left, #(set-left, left)
        f(1, ASTE $set-left == $(elements[0]), left)
  else
    ASTE __in($left, $right)

macro operator binary haskey with precedence: 6, maximum: 1, invertible: true, type: \boolean
  @call @binary-operator(\in), right, left

macro helper __owns = Object.prototype.has-own-property

macro operator binary ownskey with precedence: 6, maximum: 1, invertible: true, type: \boolean, label: \ownership
  ASTE __owns@($left, $right)

macro operator binary instanceof with precedence: 6, maximum: 1, invertible: true, type: \boolean
  right := @macro-expand-1 right
  if right.is-ident
    if right.name == \String
      return ASTE is-string! $left
    else if right.name == \Number
      return ASTE is-number! $left
    else if right.name == \Boolean
      return ASTE is-boolean! $left
    else if right.name == \Function
      return ASTE is-function! $left
    else if right.name == \Array
      return ASTE is-array! $left
    else if right.name == \Object
      return ASTE is-object! $left
  @call @binary-operator(\instanceof), left, right

macro helper __cmp = #(left, right) as Number
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

macro operator binary <=> with precedence: 5, maximum: 1, type: \number
  ASTE __cmp($left, $right)

macro operator binary %% with precedence: 2, maximum: 1, invertible: true, type: \boolean
  ASTE $left % $right == 0

macro operator binary ~%% with precedence: 2, maximum: 1, invertible: true, type: \boolean
  ASTE $left ~% $right == 0

macro helper __int = #(num) as Number
  if not is-number! num
    throw TypeError("Expected a number, got " ~& typeof! num)
  else if num not ~%% 1
    throw TypeError("Expected an integer, got " ~& num)
  else
    num

macro helper __nonzero = #(num)
  if num == 0
    throw RangeError("Expected non-zero, got " ~& num)
  else
    num

macro helper __lt = #(x, y) as Boolean
  let type = typeof x
  if type not in [\number, \string]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " ~& typeof y)
  else
    x ~< y

macro helper __lte = #(x, y) as Boolean
  let type = typeof x
  if type not in [\number, \string]
    throw TypeError("Cannot compare a non-number/string: " ~& type)
  else if type != typeof y
    throw TypeError("Cannot compare elements of different types: " ~& type ~& " vs " ~& typeof y)
  else
    x ~<= y

macro operator binary <, <= with precedence: 2, maximum: 1, type: \boolean
  if @get-const-value("DISABLE_TYPE_CHECKING", false)
    if op == "<"
      ASTE $left ~< $right
    else
      ASTE $left ~<= $right
  else if @is-type(left, \numeric) or @is-type(right, \numeric)
    if op == "<"
      ASTE +$left ~< +$right
    else
      ASTE +$left ~<= +$right
  else if @is-type(left, \string) or @is-type(right, \string)
    let check-string(node)@
      if @is-type node, \string
        node
      else
        ASTE(node) __str($node)
    left := check-string left
    right := check-string right
    if op == "<"
      ASTE $left ~< $right
    else
      ASTE $left ~<= $right
  else
    if op == "<"
      ASTE __lt($left, $right)
    else
      ASTE __lte($left, $right)

macro operator binary >, >= with precedence: 2, maximum: 1, type: \boolean
  if op == ">"
    ASTE not ($left <= $right)
  else
    ASTE not ($left < $right)

macro operator binary ~min with precedence: 8
  @maybe-cache left, #(set-left, left)
    @maybe-cache right, #(set-right, right)
      ASTE if $set-left ~< $set-right then $left else $right

macro operator binary ~max with precedence: 8
  @maybe-cache left, #(set-left, left)
    @maybe-cache right, #(set-right, right)
      ASTE if $set-left ~> $set-right then $left else $right

macro operator binary min with precedence: 8
  @maybe-cache left, #(set-left, left)
    @maybe-cache right, #(set-right, right)
      ASTE if $set-left < $set-right then $left else $right

macro operator binary max with precedence: 8
  @maybe-cache left, #(set-left, left)
    @maybe-cache right, #(set-right, right)
      ASTE if $set-left > $set-right then $left else $right

macro operator binary xor with precedence: 1
  ASTE __xor($left, $right)

macro operator binary ? with precedence: 1
  @maybe-cache left, #(set-left, left)
    ASTE if $set-left? then $left else $right

macro operator assign ~min=
  @maybe-cache-access left, #(set-left, left)
    @maybe-cache set-left, #(set-left, left-value)
      @maybe-cache right, #(set-right, right)
        ASTE if $set-left ~> $set-right then ($left := $right) else $left-value

macro operator assign ~max=
  @maybe-cache-access left, #(set-left, left)
    @maybe-cache set-left, #(set-left, left-value)
      @maybe-cache right, #(set-right, right)
        ASTE if $set-left ~< $set-right then ($left := $right) else $left-value

macro operator assign min=
  @maybe-cache-access left, #(set-left, left)
    @maybe-cache set-left, #(set-left, left-value)
      @maybe-cache right, #(set-right, right)
        ASTE if $set-left > $set-right then ($left := $right) else $left-value

macro operator assign max=
  @maybe-cache-access left, #(set-left, left)
    @maybe-cache set-left, #(set-left, left-value)
      @maybe-cache right, #(set-right, right)
        ASTE if $set-left < $set-right then ($left := $right) else $left-value

macro operator assign xor=
  @maybe-cache-access left, #(set-left, left)
    ASTE $set-left := $left xor $right

macro operator assign ?=
  @maybe-cache-access left, #(set-left, left)
    @maybe-cache set-left, #(set-left, left-value)
      if @position == \expression
        ASTE if $set-left? then $left-value else ($left := $right)
      else
        AST if not $set-left?
          $left := $right
        else
          $left-value

macro operator assign ownsor=
  left := @macro-expand-1 left
  unless left.is-internal-call \access
    @error "Can only use ownsor= on an access", left
  let [parent, child] = left.args
  @maybe-cache parent, #(set-parent, parent)
    @maybe-cache child, #(set-child, child)
      if @position == \expression
        ASTE if $set-parent ownskey $set-child then $parent[$child] else ($parent[$child] := $right)
      else
        AST if $set-parent not ownskey $set-child
          $parent[$child] := $right
        else
          $parent[$child]

macro operator binary ~bitand with precedence: 1, type: \number
  @call @binary-operator("&"), left, right

macro operator binary ~bitor with precedence: 1, type: \number
  @call @binary-operator("|"), left, right

macro operator binary ~bitxor with precedence: 1, type: \number
  @call @binary-operator("^"), left, right

macro operator assign ~bitand= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator("&="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator assign ~bitor= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator("|="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator assign ~bitxor= with type: \number
  left := @macro-expand-1 left
  let assign(right)@
    @call @assign-operator("^="), left, right
  if left.is-ident-or-tmp
    @mutate-last right, assign, true
  else
    assign right

macro operator binary bitand with precedence: 1, type: \number
  ASTE +$left ~bitand +$right

macro operator binary bitor with precedence: 1, type: \number
  ASTE +$left ~bitor +$right

macro operator binary bitxor with precedence: 1, type: \number
  ASTE +$left ~bitxor +$right

macro operator unary ~bitnot with type: \number
  @mutate-last node,
    #(subnode) -> @call @unary-operator("~"), subnode
    true

macro operator unary bitnot with type: \number
  ASTE ~bitnot +$node

macro operator unary delete with standalone: false
  node := @macro-expand-1 node
  unless node.is-internal-call \access
    @error "Can only use delete on an access", node
  if @position == \expression
    @maybe-cache-access node, #(set-node, node)
      let tmp = @tmp \ref
      let del = @call @unary-operator(\delete), node
      AST
        let $tmp = $set-node
        $del
        $tmp
  else
    @call @unary-operator(\delete), node

macro operator unary throw? with type: \undefined
  @maybe-cache node, #(set-node, node)
    ASTE if $set-node? then throw $node

macro operator assign *=, /=, %=, +=, -=, bitlshift=, bitrshift=, biturshift=, bitand=, bitor=, bitxor= with type: \number
  if @get-const-value("DISABLE_TYPE_CHECKING", false) or @is-type left, \number
    if op == "*="
      ASTE $left ~*= +$right
    else if op == "/="
      ASTE $left ~/= +$right
    else if op == "%="
      ASTE $left ~%= +$right
    else if op == "+="
      ASTE $left ~+= +$right
    else if op == "-="
      ASTE $left ~-= +$right
    else if op == "bitlshift="
      ASTE $left ~bitlshift= +$right
    else if op == "bitrshift="
      ASTE $left ~bitrshift= +$right
    else if op == "biturshift="
      ASTE $left ~biturshift= +$right
    else if op == "bitand="
      ASTE $left ~bitand= +$right
    else if op == "bitor="
      ASTE $left ~bitor= +$right
    else if op == "bitxor="
      ASTE $left ~bitxor= +$right
    else
      @error "Unknown operator " ~& op
  else
    @maybe-cache-access left, #(set-left, left)
      let action = if op == "*="
        ASTE $left * $right
      else if op == "/="
        ASTE $left / $right
      else if op == "%="
        ASTE $left % $right
      else if op == "+="
        ASTE $left + $right
      else if op == "-="
        ASTE $left - $right
      else if op == "bitlshift="
        ASTE $left bitlshift $right
      else if op == "bitrshift="
        ASTE $left bitrshift $right
      else if op == "biturshift="
        ASTE $left biturshift $right
      else if op == "bitand="
        ASTE $left bitand $right
      else if op == "bitor="
        ASTE $left bitor $right
      else if op == "bitxor="
        ASTE $left bitxor $right
      else
        @error "Unknown operator " ~& op
      ASTE $set-left := $action

macro do
  syntax locals as (ident as Identifier, "=", value, rest as (",", ident as Identifier, "=", value)*)?, body as (Body | (";", this as Statement))
    if locals
      let params = []
      let values = []
      let all-locals = [{locals.ident, locals.value}].concat(locals.rest)
      let f(i)@
        if i < all-locals.length
          if all-locals[i].ident
            params.push @internal-call \param,
              all-locals[i].ident
              @noop()
              @const false
              @const false
              @noop()
            values.push all-locals[i].value
          f i + 1
      f 0
      @call(
        @func(params, @internal-call(\auto-return, body), true)
        values)
    else
      ASTE (#@ -> $body)()

macro with
  syntax node as Expression, body as (Body | (";", this as Statement))
    ASTE (# $body)@($node)

macro helper __slice = Array.prototype.slice

macro helper __is-array = if is-function! Array.is-array
  Array.is-array
else
  do _to-string = Object.prototype.to-string
    #(x) as Boolean -> _to-string@(x) == "[object Array]"

macro helper __to-array = #(x) as []
  if not x?
    throw TypeError "Expected an object, got " ~& typeof! x
  else if is-array! x
    x
  else if is-string! x
    x.split ""
  else if is-number! x.length
    __slice@ x
  else
    throw TypeError "Expected an object with a length property, got " ~& typeof! x

macro helper __create = if is-function! Object.create
  Object.create
else
  #(x)
    let F() ->
    F.prototype := x
    new F()

macro for
  syntax reducer as (\every | \some | \first)?, init as (ExpressionOrAssignment|""), ";", test as (Logic|""), ";", step as (ExpressionOrAssignment|""), body as (BodyNoEnd | (";", this as Statement)), else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    init ?= @noop()
    test ?= ASTE true
    step ?= @noop()
    if reducer
      if reducer == \first
        body := @mutate-last body, #(node) AST(node) return $node
        let loop = @internal-call(\for, init, test, step, body)
        ASTE(loop) do
          $loop
          $else-body
      else
        if else-body
          @error "Cannot use a for loop with an else with $(reducer)", else-body
        if reducer == \some
          let some = @tmp \some
          @internal-call \block, [
            AST let $some = false
            @internal-call \for, init, test, step, @mutate-last body, #(node) -> AST(node)
              if $node
                $some := true
                break
            some
          ]
        else if reducer == \every
          let every = @tmp \every
          @internal-call \block, [
            AST let $every = true
            @internal-call \for, init, test, step, @mutate-last body, #(node) -> AST(node)
              if not $node
                $every := false
                break
            every
          ]
        else
          @error "Unknown reducer: $reducer"
    else if else-body
      if @position == \expression
        @error "Cannot use a for loop with an else with as an expression", else-body
      let run-else = @tmp \else
      @internal-call \block, [
        AST let mutable $run-else = true
        @internal-call \for,
          init
          test
          step
          AST(body)
            $run-else := false
            $body
        AST if $run-else
          $else-body
      ]
    else if @position == \expression
      let arr = @tmp \arr//, @type(body).array()
      @internal-call \block, [
        AST let $arr = []
        @internal-call \for,
          init
          test
          step
          @mutate-last body, #(node) -> ASTE(node) $arr.push $node
        arr
      ]
    else
      @internal-call \for, init, test, step, body ? @noop()
  
  syntax "reduce", init as (Expression|""), ";", test as (Logic|""), ";", step as (Statement|""), ",", current as Identifier, "=", current-start, body as (Body | (";", this as Statement))
    init ?= @noop()
    test ?= ASTE true
    step ?= @noop()
    
    body := @mutate-last body, #(node) -> ASTE(node) $current := $node
    AST
      let mutable $current = $current-start
      for $init; $test; $step
        $body
      $current

macro while, until
  syntax reducer as (\every | \some | \first)?, test as Logic, step as (",", this as ExpressionOrAssignment)?, body as (BodyNoEnd | (";", this as Statement)), else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    if macro-name == \until
      test := ASTE(test) not $test
    
    if reducer == \every
      ASTE for every ; $test; $step
        $body
      else
        $else-body
    else if reducer == \some
      ASTE for some ; $test; $step
        $body
      else
        $else-body
    else if reducer == \first
      ASTE for first ; $test; $step
        $body
      else
        $else-body
    else if @position == \expression
      ASTE for ; $test; $step
        $body
      else
        $else-body
    else
      AST
        for ; $test; $step
          $body
        else
          $else-body
  
  syntax "reduce", test as Logic, step as (",", this as ExpressionOrAssignment)?, ",", current as Identifier, "=", current-start, body as (Body | (";", this as Statement))
    if macro-name == \until
      test := ASTE(test) not $test
    
    AST
      for reduce ; $test; $step, $current = $current-start
        $body

macro operator binary to with maximum: 1, precedence: 4, type: \array
  ASTE __range($left, $right, 1, true)

macro operator binary til with maximum: 1, precedence: 4, type: \array
  ASTE __range($left, $right, 1, false)

macro operator binary by with maximum: 1, precedence: 3, type: \array
  if not @has-type(right, \number)
    @error "Must provide a number to the 'by' operator", right
  right := @macro-expand-1 right
  if right.is-const-value(0)
    @error "'by' step must be non-zero", right
  left := @macro-expand-1 left
  if left.is-call
    let func = @macro-expand-1 left.func
    if func.is-ident and func.name == \__range
      return ASTE __range $(left.args[0]), $(left.args[1]), $right, $(left.args[3])

  ASTE __step($left, $right)

macro helper __in = if is-function! Array.prototype.index-of
  do index-of = Array.prototype.index-of
    #(child, parent) as Boolean -> index-of@(parent, child) != -1
else
  #(child, parent) as Boolean
    let len = ~+parent.length
    let mutable i = -1
    while (i ~+= 1) < len
      if child == parent[i] and parent haskey i
        return true
    false

macro for
  syntax reducer as (\every | \some | \first | \filter)?, value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array as Logic, body as (BodyNoEnd | (";", this as Statement)), else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    value := @macro-expand-1 value
  
    let mutable length = null
    if index
      length := index.length
      index := index.value
    
    array := @macro-expand-1 array
    let mutable func = void
    if array.is-call
      func := @macro-expand-1 array.func
      if func.is-ident and func.name == \__to-array
        array := @macro-expand-1 array.args[0]
    
    let init = []
    if array.is-call
      func := @macro-expand-1 array.func
      if func.is-ident and func.name == \__range
        unless value.ident
          @error "Cannot assign a number to a complex declarable", value

        value := value.ident
        let [mutable start, mutable end, mutable step, mutable inclusive] = array.args
        start := @macro-expand-1 start
        end := @macro-expand-1 end
        step := @macro-expand-1 step
        inclusive := @macro-expand-1 inclusive

        if start.is-const()
          unless start.is-const-type \number
            @error "Cannot start with a non-number: $(typeof! start.const-value())", start
        else
          start := ASTE(start) +$start
        init.push @macro-expand-all AST(start) let mutable $value = $start

        if end.is-const()
          unless end.is-const-type \number
            @error "Cannot end with a non-number: $(typeof! end.const-value())", end
        else if end.cacheable
          end := @cache (ASTE(end) +$end), init, \end, false
        else
          init.push ASTE(end) +$end

        if step.is-const()
          unless step.is-const-type \number
            @error "Cannot step with a non-number: $(typeof! step.const-value())", step
        else if step.cacheable
          step := @cache (ASTE(step) +$step), init, \step, false
        else
          init.push ASTE(step) +$step


        if inclusive.cacheable
          inclusive := @cache (ASTE(inclusive) $inclusive), init, \incl, false

        let test = if step.is-const()
          if step.const-value() > 0
            if end.is-const() and end.is-const-value(Infinity)
              ASTE(array) true
            else
              ASTE(array) if $inclusive then $value ~<= $end else $value ~< $end
          else
            if end.is-const() and end.is-const-value(-Infinity)
              ASTE(array) true
            else
              ASTE(array) if $inclusive then $value ~>= $end else $value ~> $end
        else
          ASTE(array) if $step ~> 0
            if $inclusive then $value ~<= $end else $value ~< $end
          else
            if $inclusive then $value ~>= $end else $value ~> $end

        let mutable increment = ASTE(step) $value ~+= $step

        if length
          init.push @macro-expand-all AST(array) let $length = if $inclusive
            ($end ~- $start ~+ $step) ~\ $step
          else
            ($end ~- $start) ~\ $step

        if index
          init.push @macro-expand-all AST(index) let mutable $index = 0
          increment := AST(increment)
            $increment
            $index += 1
          if @has-func body
            let func = @tmp \f, false
            init.push (AST(body) let $func = #($value, $index) -> $body)
            body := (ASTE(body) $func@(this, $value, $index))
        else if @has-func body
          let func = @tmp \f, false
          init.push (AST(body) let $func = #($value) -> $body)
          body := (ASTE(body) $func@(this, $value))

        return if reducer == \every
          ASTE for every $init; $test; $increment
            $body
          else
            $else-body
        else if reducer == \some
          ASTE for some $init; $test; $increment
            $body
          else
            $else-body
        else if reducer == \first
          ASTE for first $init; $test; $increment
            $body
          else
            $else-body
        else if reducer == \filter
          body := @mutate-last body, #(node)
            AST(node) if $node
              $value
          ASTE for $init; $test; $increment
            $body
          else
            $else-body
        else if @position == "expression"
          ASTE for $init; $test; $increment
            $body
          else
            $else-body
        else if else-body and index
          AST
            for $init; $test; $increment
              $body
            if $value == 0
              $else-body
        else if else-body and start.is-const()
          AST
            for $init; $test; $increment
              $body
            if $value == $start
              $else-body
        else
          AST
            for $init; $test; $increment
              $body
            else
              $else-body

    let is-string = @is-type array, \string

    let has-index = index?
    index ?= @tmp \i, false
    let mutable has-length = length?
    length ?= @tmp \len, false
  
    @macro-expand-all AST(length) let $length = 0
    
    array := @macro-expand-all array
    let mutable step = ASTE(array) 1
    let mutable start = ASTE(array) 0
    let mutable end = ASTE(array) Infinity
    let mutable inclusive = ASTE(array) false
    if array.is-call and array.func.is-ident
      let args = array.args
      if array.func.name == \__step
        array := args[0]
        step := @macro-expand-1 args[1]
        if step.is-const()
          if step.const-value() >= 0
            start := ASTE(array) 0
            end := ASTE(array) Infinity
          else
            start := ASTE(array) Infinity
            end := ASTE(array) 0
        else
          start := void
          end := void
        inclusive := ASTE(array) true
      else if array.func.name == \__slice-step
        array := args[0]
        start := args[1]
        end := args[2]
        step := args[3]
        inclusive := args[4]
    else if array.is-internal-call(\context-call) and array.args[0].is-ident and array.args[0].name == \__slice
      let args = array.args
      array := args[1]
      start := args[2]
      if not start or start.is-const-value(void)
        start := ASTE(array) 0
      end := args[3]
      if not end or end.is-const-value(void)
        end := ASTE(array) Infinity

    if step.is-const()
      if not step.is-const-type \number
        @error "Expected step to be a number, got $(typeof! step.const-value())", step
      else if step.const-value() not %% 1
        @error "Expected step to be an integer, got $(step.const-value())", step
      else if step.const-value() == 0
        @error "Expected step to non-zero", step
    if start and start.is-const() and not start.is-const-value(Infinity) and (not start.is-const-type(\number) or start.const-value() not %% 1)
      @error "Expected start to be an integer, got $(typeof! start.const-value()) ($(String start.const-value()))", start
    if end and end.is-const() and not end.is-const-value(Infinity) and (not end.is-const-type(\number) or end.const-value() not %% 1)
      @error "Expected end to be an integer, got $(typeof! end.const-value()) ($(String end.const-value()))", end
    
    if not is-string and not @is-type array, \array-like
      array := ASTE(array) __to-array $array
    array := @cache array, init, if is-string then \str else \arr, false
    
    let value-expr = ASTE(value) if $is-string then $array.char-at($index) else $array[$index]
    let let-index = @macro-expand-all AST(index) let mutable $index = 0
    let value-ident = if value and value.type == \ident and not value.is-mutable then value.ident else @tmp \v, false
    let let-value = @macro-expand-all AST(value) let $value as Number = $value-expr
    let let-length = @macro-expand-all AST(length) let $length as Number = +$array.length
    
    let [test, increment] = if step.is-const()
      if step.const-value() > 0
        if start.is-const()
          if start.const-value() >= 0
            init.push AST(index) let mutable $index as Number = $start
            init.push let-length
          else
            init.push let-length
            init.push AST(index) let mutable $index as Number = $length + $start
        else
          init.push let-length
          init.push if @get-const-value("DISABLE_TYPE_CHECKING", false)
            AST(index) let mutable $index as Number = +$start
          else
            AST(index) let mutable $index as Number = __int($start)
          init.push ASTE(index) if $index ~< 0 then ($index += $length)
        if end.is-const() and (end.is-const-value(Infinity) or (inclusive.is-const() and inclusive.const-value() and end.is-const-value(-1)))
          [ASTE(array) $index ~< $length, ASTE(array) ($index ~+= $step)]
        else
          let tmp = @tmp \end, false
          init.push AST(end) let mutable $tmp as Number = +$end
          if not end.is-const()
            init.push ASTE(end) if $tmp ~< 0 then ($tmp ~+= $length)
          else if end.const-value() < 0
            init.push ASTE(end) $tmp ~+= $length
          init.push ASTE(inclusive) if $inclusive then ($tmp := $tmp + 1 or Infinity)
          init.push ASTE(end) $tmp ~min= $length
          [ASTE(end) $index ~< $tmp, ASTE(step) $index ~+= $step]
      else if step.is-const-value(-1) and (not start or (start.is-const() and start.const-value() in [-1, Infinity] and end.is-const-value(0) and inclusive.is-const() and inclusive.const-value()))
        if has-length
          init.push let-length
          init.push AST(index) let mutable $index as Number = $length
        else
          init.push AST(index) let mutable $index as Number = +$array.length
        [ASTE(index) post-dec! $index, @noop()]
      else
        if not end.is-const() or end.const-value() < 0
          has-length := true
        if start.is-const()
          if start.const-value() in [-1, Infinity]
            if has-length
              init.push let-length
              init.push AST(index) let mutable $index as Number = $length ~- 1
            else
              init.push AST(index) let mutable $index as Number = +$array.length ~- 1
          else
            init.push let-length
            if start.const-value() >= 0
              init.push AST(index) let mutable $index as Number = if $start ~< $length then $start else $length ~- 1
            else
              init.push AST(index) let mutable $index as Number = $length ~+ +$start
        else
          init.push let-length
          init.push AST(index) let mutable $index as Number = +$start
          init.push AST(index) if $index ~< 0 then ($index ~+= $length) else ($index ~min= $length)
          init.push AST(index) $index ~-= 1
        if end.is-const()
          if end.const-value() >= 0
            [ASTE(array) if $inclusive then $index ~>= $end else $index ~> $end, ASTE(step) $index ~+= $step]
          else
            [ASTE(array) if $inclusive then $index ~>= $end + $length else $index ~> $end + $length, ASTE(step) $index ~+= $step]
        else
          let tmp = @tmp \end, false
          init.push AST(end) let mutable $tmp as Number = +$end
          init.push AST(end) if $tmp ~< 0 then ($tmp ~+= $length)
          [ASTE(array) if $inclusive then $index ~>= $tmp else $index ~> $tmp, ASTE(step) $index ~+= $step]
    else
      if step.cacheable
        if @get-const-value("DISABLE_TYPE_CHECKING", false)
          step := @cache (ASTE(step) +$step), init, \step, false
        else
          step := @cache (ASTE(step) __int(__nonzero($step))), init, \step, false
      else
        if not @get-const-value("DISABLE_TYPE_CHECKING", false)
          init.unshift ASTE(step) __int(__nonzero($step))
      init.push let-length
      if not start
        init.push AST(array) let mutable $index as Number = if $step ~> 0 then 0 else $length ~- 1
        [
          ASTE(array) if $step ~> 0 then $index ~< $length else $index ~>= 0
          ASTE(step) $index ~+= $step
        ]
      else
        if start.is-const()
          if start.is-const-value(Infinity)
            init.push AST(index) let mutable $index as Number = $length ~- 1
          else
            init.push AST(index) let mutable $index as Number = if $start ~>= 0 then $start else $start + $length
        else
          init.push AST(index) let mutable $index as Number = $start
          init.push AST(array) if $index ~< 0 then ($index += $length) else if $step ~< 0 then ($index ~min= $length)
        let tmp = @tmp \end, false
        if end.is-const()
          init.push AST(end) let mutable $tmp as Number = if $end ~< 0 then $end ~+ $length else $end max (if $inclusive then $length ~- 1 else $length)
        else
          init.push AST(end) let mutable $tmp as Number = +$end
          init.push AST(end) if $tmp ~< 0 then ($tmp += $length) else if $step ~> 0 then ($tmp ~min= if $inclusive then $length ~- 1 else $length) else ($tmp ~max= (if $inclusive then 0 else -1))
        end := tmp
        [
          ASTE(array) if $step ~> 0
            if $inclusive then $index ~<= $end else $index ~< $end
          else
            if $inclusive then $index ~>= $end else $index ~< $end
          ASTE(step) $index ~+= $step
        ]
  
    if @has-func(body)
      let func = @tmp \f, false
      if value and value-ident != value.ident
        body := AST(body)
          let $value = $value-ident
          $body
      if has-index
        init.push AST(body) let $func = #($value-ident, $index) -> $body
        body := ASTE(body) $func@(this, $value-expr, $index)
      else
        init.push AST(body) let $func = #($value-ident) -> $body
        body := ASTE(body) $func@(this, $value-expr)
    else if value-ident == value.ident or reducer != \filter
      body := AST(body)
        let $value = $value-expr
        $body
    else
      body := AST(body)
        let $value-ident = $value-expr
        let $value = $value-ident
        $body

    if reducer == \every
      ASTE for every $init; $test; $increment
        $body
      else
        $else-body
    else if reducer == \some
      ASTE for some $init; $test; $increment
        $body
      else
        $else-body
    else if reducer == \first
      ASTE for first $init; $test; $increment
        $body
      else
        $else-body
    else if reducer == \filter
      body := @mutate-last body, #(node)
        AST(node) if $node
          $value-ident
      ASTE for $init; $test; $increment
        $body
      else
        $else-body
    else if @position == \expression
      ASTE for $init; $test; $increment
        $body
      else
        $else-body
    else if else-body and start.is-const()
      AST
        for $init; $test; $increment
          $body
        if $index == $start
          $else-body
    else
      AST
        for $init; $test; $increment
          $body
        else
          $else-body

  syntax "reduce", value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array as Logic, ",", current as Identifier, "=", current-start, body as (Body | (";", this as Statement))
    value := @macro-expand-1 value
    body := @mutate-last body, #(node) -> (ASTE(node) $current := $node)
    let length = index?.length
    index := index?.value
    AST
      let mutable $current = $current-start
      for $value, $index, $length in $array
        $body
      $current

  syntax reducer as (\every | \some | \first)?, key as Identifier, value as (",", value as Declarable, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object as Logic, body as (BodyNoEnd | (";", this as Statement)), else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    let mutable index = null
    if value
      index := value.index
      value := @macro-expand-1(value.value)
    
    let own = type == "of"
    let init = []
    if own or value
      object := @cache object, init, \obj, false
    
    @add-variable key, false, @type(\string)
    let let-value = value and @macro-expand-all AST(value) let $value = $object[$key]
    let let-index = index and @macro-expand-all AST(index) let mutable $index = -1
    if @has-func(body)
      let func = @tmp \f, false
      let value-ident = if value then (if value.type == \ident then value.ident else @tmp \v, false)
      if value and value-ident != value.ident
        body := AST(body)
          let $value = $value-ident
          $body
      if index
        init.push (AST(body) let $func = #($key, $value-ident, $index) -> $body)
        body := (ASTE(body) $func@(this, $key, $object[$key], $index))
      else if value
        init.push (AST(body) let $func = #($key, $value-ident) -> $body)
        body := (ASTE(body) $func@(this, $key, $object[$key]))
      else
        init.push (AST(body) let $func = #($key) -> $body)
        body := (ASTE(body) $func@(this, $key))
    else if value
      body := AST(body)
        $let-value
        $body

    let post = []
    if else-body
      let run-else = @tmp \else, false
      init.push (AST let $run-else = true)
      body := AST(body)
        $run-else := false
        $body
      post.push AST(else-body)
        if $run-else
          $else-body
  
    if index
      init.push let-index
      body := AST(body)
        $index ~+= 1
        $body
  
    if own
      body := AST(body)
        if $object ownskey $key
          $body
  
    if reducer
      if reducer == \first
        body := @mutate-last body, #(node) -> (AST(node) return $node)
        let loop = @internal-call(\for-in, key, object, body)
        AST do
          $init
          $loop
          $else-body
      else
        if else-body
          @error "Cannot use a for loop with an else with $(reducer)", else-body
        if reducer == \some
          body := @mutate-last body, #(node) -> AST(node)
            if $node
              return true
          let loop = @internal-call(\for-in, key, object, body)
          AST do
            $init
            $loop
            false
        else if reducer == \every
          body := @mutate-last body, #(node) -> AST(node)
            if not $node
              return false
          let loop = @internal-call(\for-in, key, object, body)
          AST do
            $init
            $loop
            true
        else
          @error "Unknown reducer: $reducer"
    else if @position == \expression
      if else-body
        @error "Cannot use a for loop with an else as an expression", else-body
      let arr = @tmp \arr, false//, @type(body).array()
      body := @mutate-last body, #(node) -> (ASTE(node) $arr.push $node)
      init.unshift AST let $arr = []
      let loop = @internal-call(\for-in, key, object, body)
      AST
        $init
        $loop
        $arr
    else
      let loop = @internal-call(\for-in, key, object, body)
      AST
        $init
        $loop
        $post
  
  syntax "reduce", key as Identifier, value as (",", value as Declarable, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object as Logic, ",", current as Identifier, "=", current-start, body as (Body | (";", this as Statement))
    body := @mutate-last body, #(node) -> (ASTE(node) $current := $node)
    let index = value?.index
    value := value?.value
    let loop = if type == "of"
      AST for $key, $value, $index of $object
        $body
    else
      AST for $key, $value, $index ofall $object
        $body
    AST
      let mutable $current = $current-start
      $loop
      $current

macro helper __generic-func = #(num-args as Number, make as ->)
  let cache = WeakMap()
  let any = {}
  let generic = #
    for reduce i in num-args - 1 to 0 by -1, current = cache
      let type = arguments[i] ? any
      let mutable item = current.get(type)
      if not item?
        item := if i == 0
          make@ this, ...arguments
        else
          WeakMap()
        current.set type, item
      item
  let result = generic()
  result.generic := generic
  result

macro generic!(func, types) with label: \generic
  types := @macro-expand-1 types
  if @is-node(types) and types.is-internal-call(\array)
    types := types.args
  else if not is-array! types
    @error "Expected types to be an array"
  if types.length == 0
    return func
  let params = for type in types
    @internal-call \param,
      type
      @noop()
      @const false
      @const false
      @noop()
  let make-function-ident = @tmp \make, false
  let instanceofs = {}
  for type in types
    unless @is-node(type) and type.is-ident
      @error "Expected type to be an Ident, got $(typeof! type)", type
    let name = type.name
    let key = @tmp "instanceof_$(name)", false
    if instanceofs ownskey name
      @error "Duplicate generic type '$name'", type
    instanceofs[name] := {
      key
      let: AST(type) let $key as -> = __get-instanceof($type)
      used: false
    }
  let disable-generics = @get-const-value("DISABLE_GENERICS", false)
  func := @macro-expand-all(func).walk-with-this #(node)
    if node.is-binary-call(\instanceof)
      let right = node.args[1]
      if right.is-ident
        let name = right.name
        if instanceofs ownskey name
          if disable-generics
            ASTE(node) true
          else
            let key = instanceofs[name].key
            instanceofs[name].used := true
            let left = node.args[0]
            ASTE(node) $key($left)
  if disable-generics
    func
  else
    let instanceof-lets = for name, item of instanceofs
      if item.used
        item.let
    let make-function-func = @func params, AST
      $instanceof-lets
      return $func
    AST __generic-func $(types.length), $make-function-func

macro operator unary mutate-function! with type: \node, label: \mutate-function
  node := @macro-expand-1 node
  if not node.is-internal-call \function
    return node

  let disable-type-checking = @get-const-value("DISABLE_TYPE_CHECKING", false)
  let article(text)
    if r"^[aeiou]"i.test(text)
      "an"
    else
      "a"
  let with-article(text) -> "$(article text) $text"
  let PRIMORDIAL_TYPES = {
    +Number
    +String
    +Boolean
    +Function
    +Array
    +Object
  }
  let translate-generic-type(mutable type)@
    type := @macro-expand-1 type
    if not type.is-internal-call \type-generic
      type
    else
      let basetype = type.args[0]
      if (basetype.is-ident and basetype.name in [\Array, \Function]) or @get-const-value("DISABLE_GENERICS", false)
        basetype
      else
        let type-arguments = @internal-call \array, (for subtype in type.args[1 to -1]; translate-generic-type subtype)
        ASTE $basetype.generic(...$type-arguments)
  let translate-type-check(value, value-name, mutable type, has-default-value)@
    type := @macro-expand-all type
    if type.is-ident
      let result = if disable-type-checking
        @noop()
      else if PRIMORDIAL_TYPES ownskey type.name
        AST(value)
          if $value not instanceof $type
            throw TypeError "Expected $($value-name) to be $($(with-article type.name)), got $(typeof! $value)"
      else
        AST(value)
          if $value not instanceof $type
            throw TypeError "Expected $($value-name) to be a $(__name $type), got $(typeof! $value)"
      if not has-default-value and type.name == \Boolean
        AST(value)! if not $value?
          $value := false
        else
          $result
      else
        result
    else if type.is-internal-call(\access)
      if disable-type-checking
        @noop()
      else
        AST(value)
          if $value not instanceof $type
            throw TypeError "Expected $($value-name) to be a $(__name $type), got $(typeof! $value)"
    else if type.is-internal-call(\type-union)
      let mutable check = void
      let mutable has-boolean = false
      let mutable has-void = false
      let mutable has-null = false
      let names = []
      let tests = []
      for subtype in type.args
        if subtype.is-const()
          if subtype.is-const-value(null)
            has-null := true
            names.push @const \null
          else if subtype.is-const-value(void)
            has-void := true
            names.push @const \undefined
          else
            @error "Unknown const for type-checking: $(typeof! subtype.const-value())", subtype
        else if subtype.is-ident
          if subtype.name == \Boolean
            has-boolean := true
          if PRIMORDIAL_TYPES ownskey subtype.name
            names.push @const subtype.name
          else
            names.push ASTE(subtype) __name $subtype
          tests.push ASTE(value) $value not instanceof $subtype
        else
          @error "Not implemented: typechecking for non-idents/consts within a type-union", subtype

      let mutable result = if disable-type-checking
        @noop()
      else
        let test = for reduce test in tests, current = ASTE true
          ASTE $current and $test
        let type-names = for reduce name in names[1 til Infinity], current = names[0]
          ASTE(current) "$($current) or $($name)"
        AST(value) if $test
          throw TypeError "Expected $($value-name) to be one of $($type-names), got $(typeof! $value)"

      if not has-default-value
        if has-null or has-void
          if has-null xor has-void
            result := AST(value)! if not $value?
              $value := if $has-null then null else void
            else
              $result
          else
            result := AST(value) if $value?
              $result
        else if has-boolean
          result := AST(value)! if not $value?
            $value := false
          else
            $result
      result
    else if type.is-internal-call \type-generic
      if disable-type-checking
        @noop()
      else if type.args[0].is-ident and type.args[0].name == \Array
        let index = @tmp \i, false
        let sub-check = translate-type-check (ASTE(value) $value[$index]), (ASTE(value) $value-name & "[" & $index & "]"), type.args[1], false
        AST(value) if not is-array! $value
          throw TypeError "Expected $($value-name) to be an Array, got $(typeof! $value)"
        else
          for (let mutable $index as Number = +$value.length); post-dec! $index;
            $sub-check
      else if type.args[0].is-ident and type.args[0].name == \Function
        translate-type-check(value, value-name, type.args[0], has-default-value)
      else
        let generic-type = translate-generic-type(type)
        AST(value)
          if $value not instanceof $generic-type
            throw TypeError "Expected $($value-name) to be a $(__name $generic-type), got $(typeof! $value)"
    else if type.is-internal-call \type-object
      if disable-type-checking
        @noop()
      else
        let checks = for i in 0 til type.args.length by 2
          let key = type.args[i]
          let pair-value = type.args[i + 1]
          translate-type-check (ASTE(value) $value[$key]), (ASTE(value) $value-name & "." & $key), pair-value, false
        AST(value) if not is-object! $value
          throw TypeError "Expected $($value-name) to be an Object, got $(typeof! $value)"
        else
          $checks
    else
      @error "Unknown type to translate: $(typeof! type)", type
  let init = []
  let mutable changed = false
  let translate-param(mutable param, in-destructure)@
    param := @macro-expand-1 param
    if param.is-internal-call \array
      changed := true
      let array-ident = @tmp \p, false
      let mutable found-spread = -1
      let mutable spread-counter = void
      for element, i, len in param.args
        let init-index = init.length
        let element-param = translate-param element, true
        if element-param?
          let element-ident = element-param.args[0]
          unless element-param.args[2].is-const-truthy() // is-spread
            if found-spread == -1
              init.splice init-index, 0, AST(element) let $element-ident = $array-ident[$i]
            else
              init.splice init-index, 0, AST(element) let $element-ident = $array-ident[$spread-counter + ($i - $found-spread - 1)]
          else
            if found-spread != -1
              @error "Cannot have multiple spread parameters in an array destructure", element
            found-spread := i
            if i == len - 1
              init.splice init-index, 0, AST(element) let $element-ident = __slice@ $array-ident, ...(if $i == 0 then [] else [$i])
            else
              spread-counter := @tmp \i, false
              init.splice init-index, 0, AST(element)
                let mutable $spread-counter as Number = $array-ident.length - ($len - $i - 1)
                let $element-ident as [] = if $spread-counter > $i
                  __slice@ $array-ident, $i, $spread-counter
                else
                  $spread-counter := $i
                  []
      @internal-call \param,
        array-ident
        @noop()
        @const false
        @const false
        @noop()
    else if param.is-internal-call \object
      changed := true
      let object-ident = @tmp \p, false
      
      for pair in param.args[1 to -1]
        let init-index = init.length
        let value = translate-param pair.args[1], true
        if value?
          let value-ident = value.args[0]
          let key = pair.args[0]
          init.splice init-index, 0, AST(pair.value) let $value-ident = $object-ident[$key]
      
      @internal-call \param,
        object-ident
        @noop()
        @const false
        @const false
        @noop()
    else if param.is-internal-call \param
      let default-value = param.args[1]
      let as-type = param.args[4]
      let param-ident = param.args[0]
      if default-value.is-nothing and as-type.is-nothing and param-ident.is-ident-or-tmp
        param
      else
        changed := true
        let ident = if param-ident.is-ident-or-tmp
          param-ident
        else if param-ident.is-internal-call \access
          @ident param-ident.args[1].const-value()
        else
          @error "Not an ident or this-access: $(typeof! param-ident) $(param-ident?.inspect?() or '')", param-ident
        let type-check = if not as-type.is-nothing
          translate-type-check(ident, ident.name, as-type, not default-value.is-nothing)
        else
          @noop()
        init.push if not default-value.is-nothing
          AST(param)!
            if not $ident?
              $ident := $default-value
            else
              $type-check
        else
          type-check
        if param-ident != ident
          init.push AST(param) $param-ident := $ident
        @internal-call \param,
          ident
          @noop()
          param.args[2] // is-spread
          param.args[3] // is-mutable
          @noop()
    else if param.is-nothing
      changed := true
      if in-destructure
        null
      else
        @internal-call \param,
          @tmp \p, false
          @noop()
          @const false
          @const false
          @noop()
    else
      @error "Unknown param type: $(typeof! param)", param
  
  let mutable found-spread = -1
  let mutable spread-counter = void
  let params = []
  for param, i, len in node.args[0].args
    let init-index = init.length
    let p = translate-param(param, false)
    let ident = p.args[0]
    if p.args[2].is-const-truthy() // is-spread
      if found-spread != -1
        @error "Cannot have two spread parameters", p
      changed := true
      found-spread := i
      if i == len - 1
        init.splice init-index, 0, AST(param)
          let $ident = __slice@ arguments, ...(if $i == 0 then [] else [$i])
      else
        spread-counter := @tmp \i, false
        init.splice init-index, 0, AST(param)
          let mutable $spread-counter as Number = arguments.length - ($len - $i - 1)
          let $ident as [] = if $spread-counter > $i
            __slice@ arguments, $i, $spread-counter
          else
            $spread-counter := $i
            []
    else
      if found-spread == -1
        params.push p
      else
        init.splice init-index, 0, AST(param)
          let $ident = arguments[$spread-counter + ($i - $found-spread - 1)]

  let mutable result = if init.length or changed
    let body = node.args[1]
    @func(
      params
      AST(body)
        $init
        void
        $body
      node.args[2]
      node.args[3]
      node.args[4])
  else
    node
  
  result

macro helper __range = #(start as Number, end as Number, step as Number, inclusive as Boolean) as [Number]
  if step == 0
    throw RangeError "step cannot be zero"
  else if not is-finite start
    throw RangeError "start must be finite"
  else if not is-finite end
    throw RangeError "end must be finite"
  let result = []
  let mutable i = start
  if step ~> 0
    while i ~< end, i ~+= step
      result.push i
    if inclusive and i ~<= end
      result.push i
  else
    while i ~> end, i ~+= step
      result.push i
    if inclusive and i ~>= end
      result.push i
  result

macro helper __step = #(mutable array, step as Number) as []
  if step == 0
    throw RangeError "step cannot be zero"
  else if step == 1
    __to-array(array)
  else if step == -1
    __slice@(array).reverse()
  else if step not %% 1
    throw RangeError "step must be an integer, got $(String step)"
  else
    array := __to-array(array)
    let len as Number = array.length
    let result = []
    if step > 0
      let mutable i = 0
      while i < len, i += step
        result.push array[i]
    else
      let mutable i = len - 1
      while i >= 0, i += step
        result.push array[i]
    result

macro helper __slice-step = #(array, start, end, mutable step, inclusive) as []
  let arr = if step ~< 0
    __slice@(array, if inclusive then end else end ~+ 1, start ~+ 1 or Infinity)
  else
    __slice@(array, start, if inclusive then end ~+ 1 or Infinity else end)
  if step == 1
    arr
  else if step == -1
    arr.reverse()
  else
    __step(arr, step)

macro operator binary instanceofsome with precedence: 6, maximum: 1, invertible: true, type: \boolean
  right := @macro-expand-1 right
  if right.is-internal-call \array
    let elements = right.args
    if elements.length == 0
      AST
        $left
        false
    else if elements.length == 1
      let element = elements[0]
      ASTE $left instanceof $element
    else
      let f(i, current, left)
        if i < elements.length
          let element = elements[i]
          f(i + 1, ASTE $current or $left instanceof $element, left)
        else
          current
      @maybe-cache left, #(set-left, left)
        let element = elements[0]
        f(1, ASTE $set-left instanceof $element, left)
  else
    ASTE __instanceofsome($left, $right)

macro try
  syntax try-body as (BodyNoEnd | (";", this as Statement)), typed-catches as ("\n", "catch", ident as Identifier, check as ((type as "as", value as Type)|(type as "==", value as Expression)), body as (BodyNoEnd | (";", this as Statement)))*, catch-part as ("\n", "catch", ident as Identifier?, body as (BodyNoEnd | (";", this as Statement)))?, else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, finally-body as ("\n", "finally", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    let has-else = not not else-body
    if typed-catches.length == 0 and not catch-part and not has-else and not finally-body
      @error "Must provide at least a catch, else, or finally to a try block"

    let mutable catch-ident = catch-part?.ident
    let mutable catch-body = catch-part?.body
    if typed-catches.length != 0
      if not catch-ident
        catch-ident := typed-catches[0].ident
      catch-body := for reduce type-catch in typed-catches by -1, current = catch-body or AST(catch-ident) throw $catch-ident
        let type-ident = type-catch.ident
        let let-err = unless type-ident.equals(catch-ident)
          AST(type-ident) let $type-ident = $catch-ident
        else
          @noop()
        if type-catch.check.type == "as"
          let types = @internal-call \array, for type in (if type-catch.check.value.is-internal-call(\type-union) then type-catch.check.value.args else [type-catch.check.value])
            if type.is-internal-call \type-generic
              @error "Expected a normal type, cannot use a generic type", type
            if type.is-internal-call \type-object
              @error "Expected a normal type, cannot use an object type", type
            type
          AST(type-ident)
            if $catch-ident instanceofsome $types
              $let-err
              $(type-catch.body)
            else
              $current
        else
          let value = type-catch.check.value
          AST(type-ident)
            if $catch-ident == $value
              $let-err
              $(type-catch.body)
            else
              $current
    let init = []
    let mutable run-else = void
    if has-else
      run-else := @tmp \else, false
      init.push AST let $run-else = true
      if catch-body
        catch-body := AST(catch-body)
          $run-else := false
          $catch-body
      else
        catch-ident := @tmp \err
        catch-body := AST
          $run-else := false
          throw $catch-ident

    let mutable current = try-body
    if catch-body
      current := @internal-call \try-catch, current, catch-ident or @tmp(\err), catch-body
    if has-else
      current := @internal-call \try-finally, current, AST(else-body)
        if $run-else
          $else-body
    if finally-body
      current := @internal-call \try-finally, current, finally-body

    AST
      $init
      $current

macro helper __array-to-iter = do
  let proto = {
    iterator: #-> this
    next: #
      let i = @index ~+ 1
      let array = @array
      if i ~>= array.length
        { done: true, value: void }
      else
        @index := i
        { done: false, value: array[i] }
  }
  #(array as [])
    { extends proto
      array
      index: -1
    }

macro helper __iter = #(iterable)
  if not iterable?
    throw TypeError "Expected iterable to be an Object, got $(typeof! iterable)"
  else if is-array! iterable
    __array-to-iter(iterable)
  else if is-function! iterable.iterator
    iterable.iterator()
  else if is-function! iterable.next
    iterable
  else
    throw Error "Expected iterable to be an Array or an Object with an 'iterator' function or an Object with a 'next' function, got $(typeof! iterable)"

macro for
  syntax reducer as (\every | \some | \first | \filter)?, value as Identifier, index as (",", this as Identifier)?, "from", iterable as Logic, body as (BodyNoEnd | (";", this as Statement)), else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end"
    let init = []
    let iterator = @cache AST __iter($iterable), init, \iter, false
    let item = @tmp \item, false
    let err = @tmp \e, true
    
    let step = []
    if index
      init.push AST(index) let mutable $index = 0
      step.push ASTE(index) $index ~+= 1
  
    let capture-value = AST(iterable)
      let $item = $iterator.next()
      if $item.done
        break
      let $value = $item.value
  
    let post = []
    if else-body and not reducer and @position != \expression
      let run-else = @tmp \else, false
      init.push (AST let $run-else = true)
      body := AST(body)
        $run-else := false
        $body
      post.push AST(else-body)
        if $run-else
          $else-body

    if @has-func(body)
      let func = @tmp \f, false
      if not index
        init.push AST(body) let $func = #($value) -> $body
        body := AST(capture-value)
          $capture-value
          $func@(this, $value)
      else
        init.push AST(body) let $func = #($value, $index) -> $body
        body := AST(capture-value)
          $capture-value
          $func@(this, $value, $index)
    else
      body := AST(capture-value)
        $capture-value
        $body

    let main = if reducer == \every
      ASTE for every $init; true; $step
        $body
      else
        $else-body
    else if reducer == \some
      ASTE for some $init; true; $step
        $body
      else
        $else-body
    else if reducer == \first
      ASTE for first $init; true; $step
        $body
      else
        $else-body
    else if reducer == \filter
      body := @mutate-last body, #(node)
        AST(node) if $node
          $value
      ASTE for $init; true; $step
        $body
      else
        $else-body
    else if @position == \expression
      ASTE for $init; true; $step
        $body
      else
        $else-body
    else
      AST
        for $init; true; $step
          $body
        $post
    
    AST try
      $main
    finally
      try
        $iterator.close()
      catch $err
        void

  syntax "reduce", value as Identifier, index as (",", this as Identifier)?, "from", iterator as Logic, ",", current as Identifier, "=", current-start, body as (Body | (";", this as Statement))
    body := @mutate-last body, #(node) -> (ASTE(node) $current := $node)
    AST
      let mutable $current = $current-start
      for $value, $index from $iterator
        $body
      $current

macro switch
  syntax topic as Logic, cases as ("\n", "case", node-head as Logic, node-tail as (",", this as Logic)*, body as (BodyNoEnd | (";", this as Statement))?)*, default-case as ("\n", "default", this as (BodyNoEnd | (";", this as Statement))?)?, "end"
    let result-cases = []
    for case_ in cases
      let case-nodes = [case_.node-head].concat(case_.node-tail)
      let mutable body = @macro-expand-1 case_.body
      let mutable is-fallthrough = false
      let nodes = if body.is-internal-call \block
        body.args
      else
        [body]

      let last-node = nodes[* - 1]
      if last-node.is-ident and last-node.name == \fallthrough
        if nodes.length == 1
          body := @noop()
        else
          body := @internal-call \block, nodes[0 til -1]
        is-fallthrough := true

      for case-node in case-nodes[0 til -1]
        result-cases.push(
          case-node
          @noop()
          @const true)
      result-cases.push(
        case-nodes[* - 1]
        body
        @const is-fallthrough)
    @internal-call \switch,
      topic
      ...result-cases
      default-case or AST throw Error "Unhandled value in switch"
  
  syntax ?="\n", cases as ("\n", "case", test as Logic, body as (BodyNoEnd | (";", this as Statement))?)*, default-case as ("\n", "default", this as (BodyNoEnd | (";", this as Statement))?)?, "end"
    for reduce case_ in cases by -1, current = default-case or AST throw Error "Unhandled value in switch"
      let test = case_.test
      let mutable body = @macro-expand-1 case_.body
      let mutable is-fallthrough = false
      let mutable result = void
      if body.is-internal-call \block
        let nodes = body.args
        let last-node = nodes[* - 1]
        if last-node.is-ident and last-node.name == \fallthrough
          body := @internal-call \block, nodes[0 til -1]
          result := if current.is-internal-call(\if)
            let fall = @tmp \fall, false
            AST(test)
              let mutable $fall = false
              if $test
                $fall := true
                $body
              if $fall or $(current.args[0])
                $(current.args[1])
              else
                $(current.args[2])
          else
            AST(test)
              if $test
                $body
              $current
      else if body.is-ident and body.name == \fallthrough
        if current.is-internal-call(\if)
          result := @macro-expand-1 AST(test) if $test or $(current.args[0])
            $(current.args[1])
          else
            $(current.args[2])
        else
          result := AST(test)
            $test
            $current
            
      result or @macro-expand-1 AST(case_.test) if $(case_.test)
        $body
      else
        $current

macro helper __keys = if is-function! Object.keys
  Object.keys
else
  #(x) as [String]
    let keys = []
    for key of x
      keys.push key
    keys

macro operator unary keys!
  ASTE __keys($node)

macro helper __allkeys = #(x) as [String]
  let keys = []
  for key ofall x
    keys.push key
  keys

macro operator unary allkeys!
  ASTE __allkeys($node)

macro helper __new = do
  let new-creators = []
  #
    if not is-function! this
      throw Error "Expected this to be a Function, got $(typeof! this)"
    let length = arguments.length
    let mutable creator = new-creators[length]
    if not creator
      let func = ["return new C("]
      for i in 0 til length
        if i > 0
          func.push ", "
        func.push "a[", i, "]"
      func.push ");"
      creator := Function("C", "a", func.join(""))
      new-creators[length] := creator
    creator(this, arguments)

macro helper __instanceofsome = #(value, array) as Boolean
  for some item in array by -1
    value instanceof item

macro helper __get-instanceof = do
  let is-any = # true
  let is-str = (is-string!)
  let is-num = (is-number!)
  let is-func = (is-function!)
  let is-bool = (is-boolean!)
  let is-object = (is-object!)
  #(ctor) as (-> Boolean)
    if not ctor?
      is-any
    else
      switch ctor
      case String; is-str
      case Number; is-num
      case Function; is-func
      case Boolean; is-bool
      case Array; __is-array
      case Object; is-object
      default; (instanceof ctor)

macro helper __name = #(func as ->) as String -> func.display-name or func.name or ""

macro helper __once = do
  let replacement() -> throw Error "Attempted to call function more than once"
  let do-nothing() ->
  #(mutable func as ->, silent-fail as Boolean) -> #
    let f = func
    func := if silent-fail then do-nothing else replacement
    f@ this, ...arguments

macro once!(func, silent-fail)
  func := @macro-expand-1 func
  if func.is-internal-call \function
    let body = func.args[1]
    let ran = @tmp \once, true
    func := @func(
      func.args[0]
      AST(body)
        if $ran
          if $silent-fail
            return
          else
            throw Error "Attempted to call function more than once"
        else
          $ran := true
        $body
      func.args[2]
      func.args[3]
      func.args[4])
    AST
      let mutable $ran = false
      $func
  else
    if not silent-fail or silent-fail.is-const-falsy()
      ASTE __once $func
    else
      ASTE __once $func, $silent-fail

macro async
  syntax params as (head as Parameter, tail as (",", this as Parameter)*)?, "<-", call as Expression, body as DedentedBody
    body ?= @noop()
    params := if params then [params.head].concat(params.tail) else []
    let func = @func params,
      @internal-call \auto-return, body
      true
    
    call := @macro-expand-1 call

    unless call.is-internal-call(\context-call, \new) or call.is-normal-call()
      @error "async call expression must be a call", call

    @call call.func, [...call.args, ASTE(func) once! (mutate-function! $func)]

macro async!
  syntax callback as ("throw" | Expression), params as (",", this as Parameter)*, "<-", call as Expression, body as DedentedBody
    body ?= @noop()
    
    let error = @tmp \e, false
    params := [@internal-call(\param,
      error
      @noop()
      @const false
      @const false
      @noop())].concat(params)
    let func = @func params,
      @internal-call \auto-return, if callback == "throw"
        AST(body)
          throw? $error
          $body
      else
        AST(body)
          if $error?
            return $callback $error
          $body
      true

    call := @macro-expand-1 call

    unless call.is-internal-call(\context-call, \new) or call.is-normal-call()
      @error "async call expression must be a call", call

    @call call.func, [...call.args, ASTE(func) once! (mutate-function! $func)]

macro require!
  syntax name as Expression
    name := @macro-expand-all name

    if name.is-const() and not name.is-const-type(\string)
      @error "Expected a constant string, got $(typeof! name.const-value())", name
    
    if name.is-const()
      let mutable ident-name = name.const-value()
      if ident-name.index-of("/") != -1
        ident-name := ident-name.substring ident-name.last-index-of("/") + 1
      let ident = @ident ident-name
      AST(name) let $ident = require $name
    else if name.is-ident
      let path = name.name
      AST(name) let $name = require $path
    else if name.is-internal-call \object
      let requires = []
      for pair in name.args[1 to -1]
        let [key, value] = pair.args
        
        unless key.is-const-type(\string)
          @error "If providing an object to require!, all keys must be constant strings", key

        let mutable ident-name = key.const-value()
        if ident-name.index-of("/") != -1
          ident-name := ident-name.substring ident-name.last-index-of("/") + 1
        let ident = @ident ident-name
        if value.is-const()
          requires.push AST(key) let $ident = require $value
        else if value.is-ident
          let path = value.name
          requires.push AST(key) let $ident = require $path
        else
          @error "If providing an object to require!, all values must be constant strings or idents", value
      @internal-call \block, requires
    else
      @error "Expected either a constant string or ident or object", name

macro helper __async = #(mutable limit as Number, length as Number, has-result as Boolean, on-value as ->, on-complete as ->)!
  let result = if has-result then [] else null
  if length ~<= 0
    return on-complete null, result
  if limit ~< 1 or limit != limit
    limit := Infinity

  let mutable broken = null
  let mutable slots-used = 0
  let mutable sync = false
  let mutable completed = false
  let on-value-callback(err, value)!
    if completed
      return
    slots-used ~-= 1
    if err? and not broken?
      broken := err
    if has-result and not broken? and arguments.length ~> 1
      result.push value
    if not sync
      next()
  let mutable index = -1
  let next()!
    while not completed and not broken? and slots-used ~< limit and (index += 1) ~< length
      slots-used ~+= 1
      sync := true
      on-value index, once!(on-value-callback)
      sync := false
    if not completed and (broken? or slots-used == 0)
      completed := true
      if broken?
        on-complete(broken)
      else
        on-complete(null, result)
  next()

macro helper __async-iter = #(mutable limit as Number, iterator as {next: Function}, has-result as Boolean, on-value as ->, on-complete as ->)!
  if limit ~< 1 or limit != limit
    limit := Infinity
  let mutable broken = null
  let mutable slots-used = 0
  let mutable sync = false
  let result = if has-result then [] else null
  let mutable completed = false
  let on-value-callback(err, value)!
    if completed
      return
    slots-used ~-= 1
    if err? and not broken?
      broken := err
    if has-result and not broken? and arguments.length ~> 1
      result.push value
    if not sync
      next()
  let mutable index = -1
  let mutable iter-stopped = false
  let mutable close = #
    close := #->
    try
      iterator.close()
    catch e
      void
  let next()!
    while not completed and not broken? and slots-used ~< limit and not iter-stopped
      try
        let item = iterator.next()
      catch e
        broken := e
        break
      
      if item.done
        iter-stopped := true
        break
      
      slots-used ~+= 1
      sync := true
      try
        on-value item.value, (index += 1), once!(on-value-callback)
      catch e
        close()
        throw e
      sync := false
    if not completed and (broken? or slots-used == 0)
      completed := true
      close()
      if broken?
        on-complete(broken)
      else
        on-complete(null, result)
  next()

macro asyncfor
  syntax results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, next as Identifier, ",", init as (Statement|""), ";", test as (Logic|""), ";", step as (Statement|""), body as (BodyNoEnd | (";", this as Statement)), "end", rest as DedentedBody
    let {mutable err, result} = results ? {}
    err ?= @tmp \err, true
    init ?= @noop()
    test ?= ASTE true
    step ?= @noop()
    rest ?= @noop()
    let done = @tmp \done, true
    if not result
      if not step
        AST
          $init
          let $next($err)@
            if $err?
              return $done($err)
            unless $test
              return $done(null)
            $body
          let $done($err)@
            $rest
          $next()
      else
        let first = @tmp \first, true
        AST
          $init
          let $first = true
          let $next($err)@
            if $err?
              return $done($err)
            if $first
              $first := false
            else
              $step
            unless $test
              return $done(null)
            $body
          let $done($err)@
            $rest
          $next()
    else
      let first = @tmp \first, true
      let value = @tmp \value, true
      let arr = @tmp \arr, true
      AST
        $init
        let $first = true
        let $arr = []
        let $next($err, $value)@
          if $err?
            return $done($err)
          if $first
            $first := false
          else
            $step
            if arguments.length ~> 1
              $arr.push $value
          unless $test
            return $done(null, $arr)
          $body
        let $done($err, $result)@
          $rest
        $next()
  
  syntax parallelism as ("(", this as Expression, ")")?, results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, next as Identifier, ",", value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as (BodyNoEnd | (";", this as Statement)), "end", rest as DedentedBody
    let {mutable err, result} = results ? {}
    let has-result = not not result
    err ?= @tmp \err, true
    let init = []
    
    rest ?= @noop()
    
    value := @macro-expand-1(value)
    let mutable length = null
    if index
      length := index.length
      index := index.value
    
    parallelism ?= ASTE 1
    
    index ?= @tmp \i, true
    array := @macro-expand-1 array
    if array.is-call and array.func.is-ident and array.func.name == \__range
      if not value.ident
        @error "Cannot assign a number to a complex declarable", value
      value := value.ident
      let [mutable start, mutable end, mutable step, mutable inclusive] = array.args
      
      if start.is-const()
        unless start.is-const-type \number
          @error "Cannot start with a non-number: $(typeof! start.const-value())", start
      else
        start := ASTE(start) +$start

      if end.is-const()
        unless end.is-const-type \number
          @error "Cannot end with a non-number: $(typeof! end.const-value())", end
      else if end.cacheable
        end := @cache (ASTE(end) +$end), init, \end, false
      else
        init.push ASTE(end) +$end

      if step.is-const()
        unless step.is-const-type \number
          @error "Cannot step with a non-number: $(typeof! step.const-value())", step
      else if step.cacheable
        step := @cache (ASTE(step) +$step), init, \step, false
      else
        init.push ASTE(step) +$step
      
      body := AST(body)
        let $value as Number = $index ~* $step ~+ $start
        $body

      let length-calc = ASTE(array) if $inclusive
        ($end ~- $start ~+ $step) ~\ $step
      else
        ($end ~- $start) ~\ $step
      if not length
        length := length-calc
      else
        init.push AST(array) let $length as Number = $length-calc
    else
      array := @cache array, init, \arr, true

      body := AST(body)
        let $value = $array[$index]
        $body
      
      if not length
        length := ASTE(array) +$array.length
      else
        init.push AST(array) let $length as Number = +$array.length
    
    AST
      $init
      __async +$parallelism, $length, $has-result,
        #($index, $next)@ -> $body
        if $has-result
          #($err, $result)@ -> $rest 
        else
          #($err)@ -> $rest
  
  syntax parallelism as ("(", this as Expression, ")")?, results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, next as Identifier, ",", key as Identifier, value as (",", value as Declarable, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as (BodyNoEnd | (";", this as Statement)), "end", rest as DedentedBody
    let {err, result} = results ? {}
    let own = type == "of"
    let init = []
    object := @cache object, init, \obj, true
    
    rest ?= @noop()
    
    let mutable index = null
    if value
      index := value.index
      value := @macro-expand-1(value.value)
    if value
      body := AST(body)
        let $value = $object[$key]
        $body
    
    let keys = @tmp \keys, true
    AST
      $init
      let $keys as [String] = if $own
        __keys $object
      else
        __allkeys $object
      asyncfor($parallelism) $err, $result <- $next, $key, $index in $keys
        $body
      $rest
  
  syntax parallelism as ("(", this as Expression, ")")?, results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, next as Identifier, ",", value as Identifier, index as (",", this as Identifier)?, "from", iterator, body as (BodyNoEnd | (";", this as Statement)), "end", rest as DedentedBody
    let {mutable err, result} = results ? {}
    let has-result = not not result
    
    rest ?= @noop()
    
    index ?= @tmp \i, true
    err ?= @tmp \err, true
    parallelism ?= ASTE 1
    
    ASTE __async-iter +$parallelism, __iter($iterator), $has-result,
      #($value, $index, $next)@ -> $body
      if $has-result
        #($err, $result)@ -> $rest
      else
        #($err)@ -> $rest

macro asyncwhile, asyncuntil
  syntax results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, next as Identifier, ",", test as Logic, step as (",", this as Statement)?, body as (BodyNoEnd | (";", this as Statement)), "end", rest as DedentedBody
    if macro-name == \asyncuntil
      test := ASTE(test) not $test
    
    rest ?= @noop()
    
    let {err, result} = results ? {}
    AST
      asyncfor $err, $result <- $next, ; $test; $step
        $body
      $rest

macro asyncif, asyncunless
  syntax results as (err as Identifier, result as (",", this as Identifier)?, "<-")?, done as Identifier, ",", test as Logic, body as (BodyNoEnd | (";", this as Statement)), else-ifs as ("\n", "else", type as ("if" | "unless"), test as Logic, body as (BodyNoEnd | (";", this as Statement)))*, else-body as ("\n", "else", this as (BodyNoEnd | (";", this as Statement)))?, "end", rest as DedentedBody
    if macro-name == \asyncunless
      test := ASTE(test) not $test
    let {mutable err, result} = results ? {}
    
    rest ?= @noop()
    
    let mutable current = if else-body
      ASTE(else-body) #($done)@ -> $else-body
    else
      ASTE #($done)@ -> $done()
    
    let mutable i = else-ifs.length - 1
    while i >= 0, i -= 1
      let else-if = else-ifs[i]
      let mutable inner-test = else-if.test
      if else-if.type == "unless"
        inner-test := ASTE(inner-test) not $inner-test
      current := AST(inner-test) if $inner-test
        #($done)@ -> $(else-if.body)
      else
        $current
    
    current := AST(test) if $test
      #($done)@ -> $body
    else
      $current
    
    if not err and not result
      AST
        $current(#@-> $rest)
    else if not result
      AST
        $current(#($err)@ -> $rest)
    else
      err ?= @tmp \err, true
      AST
        $current(#($err, $result)@ -> $rest)

macro def
  syntax key as ObjectKey
    @internal-call \custom,
      @const \def
      key
  
  syntax key as ObjectKey, func as FunctionDeclaration
    @internal-call \custom,
      @const \def
      key
      func
  
  syntax key as ObjectKey, "=", value as ExpressionOrAssignment
    @internal-call \custom,
      @const \def
      key
      value // do-wrap?

macro class
  syntax name as SimpleAssignable?, generic as ("<", head as Identifier, tail as (",", this as Identifier)*, ">")?, superclass as ("extends", this)?, body as Body?
    let mutable declaration = void
    let mutable assignment = void
    let generic-args = if generic? then [generic.head, ...generic.tail] else []
    name := @macro-expand-1 name
    if name and name.is-ident
      declaration := name
    else if name and name.is-internal-call \access
      assignment := name
      name := (if name.args[1].is-const-type(\string) then @ident(name.args[1].const-value())) or @tmp \class, false
    else
      name := @tmp \class, false
    
    superclass := @macro-expand-1 superclass
    if superclass and superclass.is-ident and superclass.name == \Object
      superclass := null
    
    let has-superclass = not not superclass
    let sup = superclass and if superclass.is-ident then superclass else @tmp \super, false
    let init = []
    let superproto = if not superclass
      ASTE Object.prototype
    else
      @tmp (if sup.is-ident then sup.name & \_prototype else \super_prototype), false
    let prototype = @tmp (if name.is-ident then name.name & \_prototype else \prototype), false
    if superclass
      init.push AST(superclass) let $superproto as {} = $sup.prototype
      init.push AST(superclass) let $prototype = $name.prototype := { extends $superproto }
      init.push ASTE(superclass) $prototype.constructor := $name
    else
      init.push AST(name) let $prototype = $name.prototype
    
    let mutable display-name = if name.is-ident then @const name.name
    if display-name?
      if generic-args.length > 0 and not @get-const-value("DISABLE_GENERICS", false)
        let parts = [display-name, @const("<")]
        for generic-arg, i in generic-args
          if i > 0
            parts.push @const(", ")
          parts.push ASTE(generic-arg) if $generic-arg !~= null then __name $generic-arg else ""
        parts.push @const(">")
        display-name := for reduce part in parts, current = @const ""
          ASTE(name) $current ~& $part
      init.push ASTE(name) $name.display-name := $display-name
    
    if superclass
      init.push AST(superclass) $sup.extended?($name)
    
    let fix-supers(node)@ -> node.walk-with-this #(node)@
      if node.is-internal-call \super
        let args = for arg in node.args
          fix-supers arg
        
        @internal-call \context-call, [
          if not args[0].is-nothing
            ASTE(node) $superproto[$(args[0])]
          else if not superclass
            ASTE(node) Object
          else
            sup
          ASTE(node) this
          ...args[1 to -1]
        ]
    body := fix-supers @macro-expand-all(body or @noop())
    
    let mutable constructor-count = 0
    let is-def(node)
      node and node.is-internal-call(\custom) and node.args[0].is-const-value(\def)
    body.walk-with-this #(node)
      if is-def(node) and node.args[1].is-const-value \constructor
        constructor-count += 1
      void

    let mutable has-top-level-constructor = false
    if constructor-count == 1
      body.walk-with-this #(node)
        if is-def(node) and node.args[1].is-const-value(\constructor) and (not node.args[2] or node.args[2].is-internal-call \function)
          has-top-level-constructor := true
        if node.is-internal-call \block
          // keep walking
          void
        else
          node
    
    let self = @tmp \this
    if has-top-level-constructor
      body := body.walk-with-this #(node)@
        if is-def(node) and node.args[1].is-const-value(\constructor)
          let value = @macro-expand-1 node.args[2]
          if not value
            init.unshift ASTE(node) let $name as (-> $name) = # throw Error "Not implemented"
          else
            let constructor = @func(
              value.args[0]
              value.args[1]
              AST(value) if eval("this") instanceof $name then eval("this") else { extends $prototype })
            init.unshift AST(node) let $name as (-> $name) = $constructor
          @noop()
        else if node.is-internal-call \block
          void
        else
          node
    else if constructor-count != 0
      let ctor = @tmp \ctor, false
      let result = @tmp \ref
      init.push AST
        let mutable $ctor as (->|void) = void
        let $name() as $name
          let $self = if this instanceof $name then this else { extends $prototype }
          
          if is-function! $ctor
            let $result = $ctor@ $self, ...arguments
            if Object($result) == $result
              return $result
          else if $has-superclass
            let $result = $sup@ $self, ...arguments
            if Object($result) == $result
              return $result
          $self
      body := body.walk-with-this #(node)@
        if is-def(node) and node.args[1].is-const-value \constructor
          let value = node.args[2]
          if not value
            ASTE(node) $ctor := # throw Error "Not implemented"
          else if value.is-call and value.func.is-ident and value.func.name == \__curry and value.args.length == 2 and value.args[1].is-internal-call \function
            let curry-arg = value.args[0]
            let mutable constructor = value.args[1]
            constructor := @func(
              constructor.args[0]
              constructor.args[1]
              AST(constructor) if eval("this") instanceof $name then eval("this") else { extends $prototype })
            ASTE(node) $ctor := __curry $curry-arg, $constructor
          else if value.is-internal-call \function
            let constructor = @func(
              value.args[0]
              value.args[1]
              AST(constructor) if eval("this") instanceof $name then eval("this") else { extends $prototype })
            ASTE(node) $ctor := $constructor
          else
            ASTE(node) $ctor := $value
    else
      if not superclass
        init.push AST(name)
          let $name() as $name
            if this instanceof $name then this else { extends $prototype }
      else
        let result = @tmp \ref
        init.push AST(name)
          let $name() as $name
            let $self = if this instanceof $name then this else { extends $prototype }
            let $result = $sup@ $self, ...arguments
            if Object($result) == $result
              $result
            else
              $self
    
    let change-defs(node) -> node.walk-with-this #(node)
      if is-def(node)
        let key = node.args[1]
        let value = node.args[2] ? ASTE(node) #-> throw Error "Not implemented: $(__name @constructor).$($key)()"
        change-defs ASTE(node) $prototype[$key] := $value
    body := change-defs body
    
    body := body.walk-with-this #(node)
      if node.is-internal-call \function
        unless node.args[2].is-const-truthy() // is-bound
          node
      else if node.is-ident and node.name == \this
        name

    let mutable result = AST do $sup = $superclass
      $init
      $body
      return $name
    
    if generic-args.length > 0
      let generic-args-array = @internal-call \array, generic-args
      result := ASTE generic! $result, $generic-args-array
    
    if declaration?
      AST
        let $declaration = $result
        $declaration
    else if assignment?
      ASTE $assignment := $result
    else
      result

macro yield
  syntax node as Expression?
    if not @in-generator
      @error "Can only use yield in a generator function"
    @mutate-last node, (#(subnode) -> @internal-call \yield, subnode), true

macro yield*
  syntax node as Expression
    if not @in-generator
      @error "Can only use yield* in a generator function"
    let init = []
    if @is-type node, \array-like
      let index = @tmp \i, false
      init.push AST let $index = 0
      let length = @tmp \len, false
      node := @cache node, init, \arr, false
      init.push AST let $length as Number = $node.length
      AST
        for $init; $index ~< $length; $index ~+= 1
          yield $node[$index]
        void
    else
      let iterator = @cache ASTE __iter($node), init, \iter, false
      let err = @tmp \e, true
      let send = @tmp \send
      let item = @tmp \item
      let received = @tmp \tmp
      AST
        $init
        let mutable $received = void
        let mutable $send = true
        
        while true
          let $item = if $send then $iterator.send($received) else $iterator.throw($received)
          if $item.done
            break
          try
            $received := yield $item.value
            $send := true
          catch $err
            $received := $err
            $send := false
        try
          $iterator.close()
        catch $err
          void
        $item.value

macro returning
  syntax node as Expression, rest as DedentedBody
    AST
      $rest
      return $node

macro helper __is = if is-function! Object.is
  Object.is
else
  #(x, y) as Boolean
    if x == y
      x != 0 or (1 ~/ x == 1 ~/ y)
    else
      x != x and y != y

macro operator binary is with precedence: 2, maximum: 1, type: \boolean
  left := @macro-expand-1 left
  right := @macro-expand-1 right
  if @has-type(left, \number) and @has-type(right, \number)
    if left.is-const()
      if right.is-const()
        @const __is(left.const-value(), right.const-value())
      else
        if isNaN left.const-value()
          @maybe-cache right, #(set-right, right)
            ASTE $set-right != $right
        else if left.const-value() == 0
          @maybe-cache right, #(set-right, right)
            if 1 / left.const-value() < 0
              ASTE $set-right == 0 and 1 ~/ $right < 0
            else
              ASTE $set-right == 0 and 1 ~/ $right > 0
        else
          ASTE $left == $right
    else if right.is-const()
      if isNaN right.const-value()
        @maybe-cache left, #(set-left, left)
          ASTE $set-left != $left
      else if right.const-value() == 0
        @maybe-cache left, #(set-left, left)
          if 1 / right.const-value() < 0
            ASTE $set-left == 0 and 1 ~/ $left < 0
          else
            ASTE $set-left == 0 and 1 ~/ $left > 0
      else
        ASTE $left == $right
    else
      ASTE __is $left, $right
  else
    ASTE $left == $right

macro operator binary isnt with precedence: 2, maximum: 1, type: \boolean
  ASTE not ($left is $right)

macro helper __bind = #(parent, child) as Function
  if not parent?
    throw TypeError "Expected parent to be an object, got $(typeof! parent)"
  let func = parent[child]
  if not is-function! func
    throw Error "Trying to bind child '$(String child)' which is not a function"
  # -> func@ parent, ...arguments

macro helper __def-prop = do
  let fallback = Object.define-property
  if is-function! fallback and (do
      try
        let o = {}
        fallback(o, \sentinel, {})
        o haskey \sentinel
      catch e
        false)
    fallback
  else
    let supports-accessors = Object.prototype ownskey \__define-getter__
    let lookup-getter = supports-accessors and Object::__lookup-getter__
    let lookup-setter = supports-accessors and Object::__lookup-setter__
    let define-getter = supports-accessors and Object::__define-getter__
    let define-setter = supports-accessors and Object::__define-setter__
    #(object as {}|->, property as String, descriptor as {})
      if is-function! fallback
        try
          return fallback object, property, descriptor
        catch e
          void
      
      if descriptor ownskey \value
        if supports-accessors and (lookup-getter@ object, property or lookup-setter@ object, property)
          let proto = object.__proto__
          object.__proto__ := Object.prototype
          delete object[property]
          object[property] := descriptor.value
          object.__proto__ := proto
        else
          object[property] := descriptor.value
      else
        if not supports-accessors
          throw Error "Getters and setters cannot be defined on this Javascript engine"
        if descriptor ownskey \get
          define-getter@ object, property, descriptor.get
        if descriptor ownskey \set
          define-setter@ object, property, descriptor.set
      object

macro label!
  syntax label as Identifier, node as (Statement|Body)
    @with-label node, label

macro helper __compose = #(left as ->, right as ->) as (->)
  #-> left@(this, right@(this, ...arguments))

macro operator binary << with precedence: 13, type: \function
  ASTE __compose $left, $right

macro operator binary >> with precedence: 13, type: \function, right-to-left: true
  if not @is-noop(left) and not @is-noop(right)
    let tmp = @tmp \ref
    AST
      let $tmp = $left
      __compose $right, $tmp
  else
    ASTE __compose $right, $left

macro helper __curry = #(num-args as Number, f as ->) as (->)
  if num-args > 1
    let currier(args)
      if args.length ~>= num-args
        f.apply this, args
      else
        let ret()
          if arguments.length == 0
            ret
          else
            currier@ this, args.concat(__slice@(arguments))
        ret
    currier []
  else
    f

macro operator binary <| with precedence: 0, right-to-left: true
  ASTE $left($right)

macro operator binary |> with precedence: 0
  if not @is-noop(left) and not @is-noop(right)
    let tmp = @tmp \ref
    AST
      let $tmp = $left
      $right($tmp)
  else
    ASTE $right($left)

macro helper __import = #(dest, source) as {}
  for k of source
    dest[k] := source[k]
  dest

macro operator binary <<< with precedence: 6
  right := @macro-expand-1 right
  if right.is-internal-call \object
    @maybe-cache left, #(set-left, left)
      let block = [set-left]
      let right-args = right.args
      for pair, i, len in right-args[1 to -1]
        let [key, value, mutable property] = pair.args
        property := property?.const-value()

        if property
          if property in [\get, \set] and i < len - 1
            let next-pair = right-args[i + 1]
            let [next-key, next-value, next-property] = next-pair.args
            if next-property and key.equals(next-key) and property != next-property and next-property in [\get, \set]
              continue
          
          if property == \property
            block.push AST(key) __def-prop $left, $key, $value
          else if property in [\get, \set]
            let last-pair = if i > 1 then right-args[i - 1].args
            let descriptor = if last-pair and last-pair[2]?.const-value() in [\get, \set] and key.equals(last-pair[0]) and last-pair[2].const-value() != property
              ASTE(value) {
                [$(last-pair[2])]: $(last-pair[1])
                [$(pair.args[2])]: $value
                enumerable: true
                configurable: true
              }
            else
              ASTE(value) {
                [$(pair.args[2])]: $value
                enumerable: true
                configurable: true
              }
            block.push AST(key) __def-prop $left, $key, $descriptor
          else
            @error "Unknown property: $property", key
        else
          block.push AST(key) $left[$key] := $value
      block.push left
      @internal-call \block, block
  else
    ASTE __import $left, $right

macro operator binary >>> with precedence: 6, right-to-left: true
  if not @is-noop(left) and not @is-noop(right)
    let tmp = @tmp \ref
    AST
      let $tmp = $left
      $right <<< $tmp
  else
    ASTE $right <<< $left

macro helper WeakMap = if is-function! GLOBAL.WeakMap then GLOBAL.WeakMap else class WeakMap
  let uid-rand()
    Math.random().to-string(36).slice(2)
  let create-uid()
    "$(uid-rand())-$(new Date().get-time())-$(uid-rand())-$(uid-rand())"
  let is-extensible = Object.is-extensible or #-> true
  
  def constructor()
    @_keys := []
    @_values := []
    // the keys which were once extensible but no longer are
    @_chilly := []
    @_uid := create-uid()
  
  let check(key)!
    let uid = @_uid
    if key ownskey uid
      let chilly = @_chilly
      if chilly.index-of(key) == -1
        chilly.push key
        @_keys.push key
        @_values.push key[uid]
  
  def get(key)
    if Object(key) != key
      throw TypeError "Invalid value used as weak map key"
    
    if is-extensible(key)
      key![@_uid]
    else
      check@ this, key
      let index = @_keys.index-of key
      if index == -1
        void
      else
        @_values[index]
  
  def has(key)
    if Object(key) != key
      throw TypeError "Invalid value used as weak map key"
    
    if is-extensible(key)
      key ownskey @_uid
    else
      check@ this, key
      @_keys.index-of(key) != -1
  
  let def-prop = if is-function! Object.define-property then Object.define-property else #(o, k, d)! -> o[k] := d.value
  def set(key, value)!
    if Object(key) != key
      throw TypeError "Invalid value used as weak map key"
    
    if is-extensible(key)
      def-prop key, @_uid, {
        +configurable
        +writable
        -enumerable
        value
      }
    else
      check@ this, key
      let keys = @_keys
      let mutable index = keys.index-of key
      if index == -1
        index := keys.length
        keys[index] := key
      @_values[index] := value
  
  def delete(key)!
    if Object(key) != key
      throw TypeError "Invalid value used as weak map key"
    
    if is-extensible(key)
      delete key[@_uid]
    else
      check@ this, key
      let keys = @_keys
      let mutable index = keys.index-of key
      if index != -1
        keys.splice index, 1
        @_values.splice index, 1

macro helper __index-of-identical = #(array, item)
  if is-number! item
    if item is NaN
      for check, i in array by -1
        if check is NaN
          return i
      return -1
    else if item == 0
      let inf = 1 ~/ item
      for check, i in array by -1
        if check == 0 and 1 ~/ check == inf
          return i
      return -1
  array.index-of item

macro helper Map = if is-function! GLOBAL.Map then GLOBAL.Map else class Map
  def constructor(iterable)
    @_keys := []
    @_values := []
    if iterable?
      for x from iterable
        @set x[0], x[1]
  
  def get(key)
    let index = __index-of-identical @_keys, key
    if index == -1
      void
    else
      @_values[index]
  
  def has(key)
    __index-of-identical(@_keys, key) != -1
  
  def set(key, value)!
    let keys = @_keys
    let mutable index = __index-of-identical keys, key
    if index == -1
      index := keys.length
      keys[index] := key
    @_values[index] := value
  
  def delete(key)
    let keys = @_keys
    let index = __index-of-identical(keys, key)
    if index == -1
      false
    else
      keys.splice index, 1
      @_values.splice index, 1
  
  def keys()*
    for key in @_keys by -1
      yield key
  
  def values()*
    for value in @_values by -1
      yield value
  
  def items()*
    let values = @_values
    for key, i in @_keys by -1
      yield [key, values[i]]
  def iterator = Map::items

macro helper Set = if is-function! GLOBAL.Set then GLOBAL.Set else class Set
  def constructor(iterable)
    @_items := []
    if iterable?
      for item from iterable
        @add item
  
  def has(item)
    __index-of-identical(@_items, item) != -1
  def add(item)!
    let items = @_items
    if __index-of-identical(items, item) == -1
      items.push item
  def delete(item)!
    let items = @_items
    let index = __index-of-identical items, item
    if index != -1
      items.splice index, 1
      true
    else
      false
  def values()*
    for item in @_items by -1
      yield item
  def iterator = Set::values

macro operator unary set! with type: \object, label: \construct-set
  let set = @tmp \s
  node := @macro-expand-1 node
  if node.is-internal-call \array
    if node.args.length == 0
      ASTE Set()
    else
      let parts = []
      let tmp = @tmp \x
      for element in node.args
        let el = @macro-expand-1(element)
        if el.is-internal-call \spread
          parts.push AST(el) for $tmp in $(el.args[0]); $set.add $tmp
        else
          parts.push AST(el) $set.add $el
      AST
        let $set = Set()
        $parts
        $set
  else
    let item = @tmp \x
    AST
      let $set as Set = Set()
      for $item in $node
        $set.add $item
      $set

macro operator unary map! with type: \object, label: \construct-map
  let map = @tmp \m

  node := @macro-expand-1 node
  if node.is-internal-call \object
    let pairs = node.args
    if pairs.length == 0
      ASTE Map()
    else
      let parts = []
      for pair in pairs[1 to -1]
        if pair.args[2]?.const-value()
          @error "Cannot use map! on an object with custom properties", pair
        parts.push AST(pair) $map.set $(pair.args[0]), $(pair.args[1])
      AST
        let $map as Map = Map()
        $parts
        $map
  else
    let key = @tmp \k
    let value = @tmp \v
    AST
      let $map as Map = Map()
      for $key, $value of $node
        $map.set $key, $value
      $map

macro helper set-immediate = if is-function! GLOBAL.set-immediate
  GLOBAL.set-immediate
else if not is-void! process and is-function! process.next-tick
  do next-tick = process.next-tick
    #(func as ->, ...args)
      if args.length
        next-tick #!-> func(...args)
      else
        next-tick func
else
  #(func as ->, ...args)
    if args.length
      set-timeout(#!-> func(...args), 0)
    else
      set-timeout(func, 0)

macro helper __defer = do
  let __defer()
    let mutable is-error = false
    let mutable value = null
  
    let mutable deferred as Array|null = []
    let complete(new-is-error, new-value)!
      if deferred
        let funcs as Array = deferred
        deferred := null
        is-error := new-is-error
        value := new-value
        if funcs.length
          set-immediate #
            for i in 0 til funcs.length
              funcs[i]()
  
    {
      promise: {
        then: #(on-fulfilled, on-rejected, mutable allow-sync)
          if allow-sync != true
            allow-sync := void
          let {promise, fulfill, reject} = __defer()
          let step = #! -> try
            let f = if is-error then on-rejected else on-fulfilled
            if is-function! f
              let result = f value
              if result and is-function! result.then
                result.then fulfill, reject, allow-sync
              else
                fulfill result
            else
              (if is-error then reject else fulfill)(value)
          catch e
            reject e

          if deferred
            deferred.push step
          else if allow-sync
            step()
          else
            set-immediate step
          promise
        sync: #
          let mutable state = 0
          let mutable result = 0
          @then(
            #(ret)!
              state := 1
              result := ret
            #(err)!
              state := 2
              result := err
            true)
          switch state
          case 0
            throw Error "Promise did not execute synchronously"
          case 1
            return result
          case 2
            throw result
          default
            throw Error "Unknown state"
      }
      fulfill(value)! -> complete false, value
      reject(reason)! -> complete true, reason
    }
  __defer.fulfilled := #(value)
    let d = __defer()
    d.fulfill value
    d.promise
  __defer.rejected := #(reason)
    let d = __defer()
    d.reject reason
    d.promise
  __defer

macro helper __generator-to-promise = #(generator as { send: (->), throw: (->) }, allow-sync as Boolean)
  let continuer(verb, arg)
    let mutable item = void
    try
      item := generator[verb](arg)
    catch e
      return __defer.rejected(e)
    if item.done
      __defer.fulfilled(item.value)
    else
      item.value.then callback, errback, allow-sync
  let callback(value) -> continuer \send, value
  let errback(value) -> continuer \throw, value
  callback(void)

macro helper __promise = #(mutable value, allow-sync as Boolean)
  if is-function! value
    let factory() -> __generator-to-promise value@(this, ...arguments)
    factory.sync := #-> __generator-to-promise(value@(this, ...arguments), true).sync()
    factory.maybe-sync := #-> __generator-to-promise(value@(this, ...arguments), true)
    factory
  else
    __generator-to-promise value, allow-sync

macro promise!
  syntax sync as ("(", this as Expression, ")")?, node as Expression
    node := @macro-expand-1 node
    if node.is-internal-call(\function) and node.args[4].is-const-falsy()
      @error "promise! must be used with a generator function", node
    if sync and node.is-internal-call(\function)
      @error "Use .sync() to retrieve asynchronously", sync
    
    if not sync or sync.is-const-falsy()
      ASTE __promise($node)
    else
      ASTE __promise($node, $sync)
  
  syntax sync as ("(", this as Expression, ")")?, body as GeneratorBody
    let func = @func([]
      @internal-call \auto-return, body
      true
      null
      true)
    
    if not sync or sync.is-const-falsy()
      ASTE __generator-to-promise($func())
    else
      ASTE __generator-to-promise($func(), $sync)

macro fulfilled!(node)
  if macro-data.length > 1
    @error "fulfilled! only expects one argument"
  @mutate-last node, (#(subnode) -> ASTE __defer.fulfilled($subnode)), true

macro rejected!(node)
  if macro-data.length > 1
    @error "rejected! only expects one argument"
  @mutate-last node, (#(subnode) -> ASTE __defer.rejected($subnode)), true

macro helper __from-promise = #(promise as { then: (->) }) -> #(callback as ->)!
  promise.then(
    #(value) set-immediate callback, null, value
    #(reason) set-immediate callback, reason)

macro from-promise!(node)
  if macro-data.length > 1
    @error "from-promise! only expects one argument"
  ASTE __from-promise $node

macro helper __to-promise = #(func as ->, context, args)
  let {promise, reject, fulfill} = __defer()
  func@ context, ...args, #(err, value)!
    if err?
      reject err
    else
      fulfill value
  promise

macro to-promise!(node) with type: \promise
  if macro-data.length > 1
    @error "to-promise! only expects one argument"
  node := @macro-expand-1 node
  if node.is-internal-call \context-call
    let func = node.args[0]
    let context = @macro-expand-1 node.args[1]
    unless context.is-internal-call \spread
      let args = @internal-call \array, node.args[2 to -1]
      ASTE __to-promise $func, $context, $args
    else
      let context-and-args = node.args[1 to -1]
      @maybe-cache @internal-call(\array, context-and-args), #(set-context-and-args, context-and-args)
        ASTE __to-promise $func, $set-context-and-args[0], $context-and-args.slice(1)
  else if node.is-internal-call \new
    let func = node.args[0]
    let args = @internal-call \array, node.args[1 to -1]
    ASTE __to-promise __new, $func, $args
  else if node.is-normal-call()
    let func = @macro-expand-1 node.func
    let args = @internal-call \array, node.args
    if func.is-internal-call \access
      @maybe-cache func.args[0], #(set-parent, parent)
        let child = func.args[1]
        ASTE __to-promise $set-parent[$child], $parent, $args
    else
      ASTE __to-promise $func, void, $args
  else
    @error "to-promise! call expression must be a call", node

macro helper __to-promise-array = #(func as ->, context, args)
  let {promise, reject, fulfill} = __defer()
  func@ context, ...args, #(err, ...values)!
    if err?
      reject err
    else
      fulfill values
  promise

macro to-promise-array!(node) with type: \promise
  if macro-data.length > 1
    @error "to-promise-array! only expects one argument"
  node := @macro-expand-1 node
  if node.is-internal-call \context-call
    let func = node.args[0]
    let context = @macro-expand-1 node.args[1]
    unless context.is-internal-call \spread
      let args = @internal-call \array, node.args[2 to -1]
      ASTE __to-promise-array $func, $context, $args
    else
      let context-and-args = node.args[1 to -1]
      @maybe-cache @internal-call(\array, context-and-args), #(set-context-and-args, context-and-args)
        ASTE __to-promise-array $func, $set-context-and-args[0], $context-and-args.slice(1)
  else if node.is-internal-call \new
    let func = node.args[0]
    let args = @internal-call \array, node.args[1 to -1]
    ASTE __to-promise-array __new, $func, $args
  else if node.is-normal-call()
    let func = @macro-expand-1 node.func
    let args = @internal-call \array, node.args
    if func.is-internal-call \access
      @maybe-cache func.args[0], #(set-parent, parent)
        let child = func.args[1]
        ASTE __to-promise-array $set-parent[$child], $parent, $args
    else
      ASTE __to-promise-array $func, void, $args
  else
    @error "to-promise-array! call expression must be a call", node

macro helper __generator = #(func) -> #
  let mutable self = this
  let mutable args as []|null = arguments
  {
    iterator() -> this
    send()
      let mutable value = void
      if args
        value := func@ self, ...args
        self := null
        args := null
      { +done, value }
    next() -> @send()
    throw(err)
      self := null
      args := null
      throw err
  }

macro helper __some-promise = #(promises as [])
  let defer = __defer()
  for promise in promises by -1
    promise.then(defer.fulfill, defer.reject)
  defer.promise

macro some-promise!(node)
  if macro-data.length > 1
    @error "some-promise! only expects one argument"
  if not @has-type(node, \array)
    @error "some-promise! should be used on an Array", node
  
  ASTE __some-promise $node

macro helper __every-promise = #(promises as {})
  let is-array = is-array! promises
  let {promise: result-promise, fulfill, reject} = __defer()
  let result = if is-array then [] else {}
  let mutable remaining = 1 // start at one and decrement immediately at the end
  let dec()!
    if (remaining -= 1) == 0
      fulfill result
  let handle(key, promise)!
    promise.then(
      #(value)!
        result[key] := value
        dec()
      reject)
  if is-array
    for promise, i in promises by -1
      remaining += 1
      handle i, promise
  else
    for k, promise of promises
      remaining += 1
      handle k, promise
  dec()
  result-promise

macro every-promise!(node)
  if macro-data.length > 1
    @error "some-promise! only expects one argument"
  if not @has-type(node, \array) and not @has-type(node, \object)
    @error "every-promise! should be used on an Array or Object", node
  
  ASTE __every-promise $node

macro helper __delay = #(milliseconds as Number, value)
  if milliseconds <= 0
    __defer.fulfilled(value)
  else
    let {fulfill, promise} = __defer()
    set-timeout (#!-> fulfill(value)), milliseconds
    promise

macro delay!(milliseconds, value)
  if not @has-type(milliseconds, \number)
    @error "delay! should take a number in milliseconds"
  
  value := @macro-expand-1(value)
  let has-value = value and not value.is-const-value(void)
  milliseconds := @macro-expand-1 milliseconds
  if milliseconds.is-const-type(\number) and milliseconds.const-value() <= 0
    if has-value
      ASTE __defer.fulfilled $value
    else
      ASTE __defer.fulfilled()
  else
    if has-value
      ASTE __delay $milliseconds, $value
    else
      ASTE __delay $milliseconds

macro helper __promise-loop = #(mutable limit as Number, length as Number, body as ->)
  if limit ~< 1 or limit is NaN
    limit := Infinity
  
  let result = []
  let mutable done = false
  let mutable slots-used = 0
  let {fulfill, reject, promise} = __defer()
  let mutable index = 0
  let handle(index)
    slots-used += 1
    body(index).then(
      #(value)
        result[index] := value
        slots-used -= 1
        flush()
      #(reason)
        done := true
        reject reason)
  let flush()
    while not done and slots-used < limit and index < length, index += 1
      handle(index)
    if not done and index >= length and slots-used == 0
      done := true
      fulfill result
  set-immediate flush
  promise

macro helper __promise-iter = #(mutable limit as Number, iterator as {next: Function}, body as ->)
  if limit ~< 1 or limit != limit
    limit := Infinity
  
  let result = []
  let mutable done = false
  let mutable slots-used = 0
  let {reject, fulfill, promise} = __defer()
  let mutable index = 0
  let mutable iter-stopped = false
  let handle(item, index)
    slots-used += 1
    body(item, index).then(
      #(value)
        result[index] := value
        slots-used -= 1
        flush()
      #(reason)
        done := true
        reject reason)
  let flush()
    while not done and not iter-stopped and slots-used < limit
      let mutable item = void
      try
        item := iterator.next()
      catch e
        done := true
        reject e
        return
      
      if item.done
        iter-stopped := true
        break
      
      handle(item.value, post-inc! index)
    
    if not done and slots-used == 0 and iter-stopped
      done := true
      fulfill result
  set-immediate flush
  promise

macro promisefor
  syntax "(", parallelism as Expression, ")", value as Declarable, index as (",", value as Identifier, length as (",", this as Identifier)?)?, "in", array, body as GeneratorBody
    let init = []
    
    value := @macro-expand-1 value
    let mutable length = null
    if index
      length := index.length
      index := index.value
    
    parallelism ?= ASTE 1
    
    index ?= @tmp \i, true
    array := @macro-expand-1 array
    if array.is-call
      let func = @macro-expand-1 array.func
      if func.is-ident and func.name == \__range
        unless value.ident
          @error "Cannot assign a number to a complex declarable", value

        let [mutable start, mutable end, mutable step, mutable inclusive] = array.args
        start := @macro-expand-1 start
        end := @macro-expand-1 end
        step := @macro-expand-1 step
        inclusive := @macro-expand-1 inclusive

        if start.is-const()
          unless start.is-const-type(\number)
            @error "Cannot start with a non-number: $(typeof! start.const-value())", start
        else
          start := ASTE(start) +$start

        if end.is-const()
          unless end.is-const-type(\number)
            @error "Cannot end with a non-number: $(typeof! end.const-value())", end
        else if end.cacheable
          end := @cache (ASTE(end) +$end), init, \end, false
        else
          init.push ASTE(end) +$end

        if step.is-const()
          unless step.is-const-type(\number)
            @error "Cannot step with a non-number: $(typeof! step.const-value())", step
        else if step.cacheable
          step := @cache (ASTE(step) +$step), init, \step, false
        else
          init.push ASTE(step) +$step
        
        let length-calc = ASTE(array) if $inclusive
          ($end ~- $start ~+ $step) ~\ $step
        else
          ($end ~- $start) ~\ $step
        if not length
          length := length-calc
        else
          init.push AST(array) let $length as Number = $length-calc

        return AST
          $init
          __promise-loop +$parallelism, $length, __promise #($index)*
            let $value as Number = $index ~* $step ~+ $start
            $body

    array := @cache array, init, \arr, true

    if not length
      length := ASTE(array) +$array.length
    else
      init.push AST(array) let $length as Number = +$array.length
    AST
      $init
      __promise-loop +$parallelism, $length, __promise #($index)*
        let $value = $array[$index]
        $body
  
  syntax "(", parallelism as Expression, ")", key as Identifier, value as (",", value as Declarable, index as (",", this as Identifier)?)?, type as ("of" | "ofall"), object, body as GeneratorBody
      let own = type == "of"
      let init = []
      object := @cache object, init, \obj, true
      
      let mutable index = null
      if value
        index := value.index
        value := @macro-expand-1(value.value)
      if value
        body := AST(body)
          let $value = $object[$key]
          $body
    
      let keys = @tmp \keys, true
      AST
        $init
        let $keys as [String] = if $own
          __keys $object
        else
          __allkeys $object
        promisefor($parallelism) $key, $index in $keys
          $body
  
  syntax "(", parallelism as Expression, ")", value as Identifier, index as (",", this as Identifier)?, "from", iterator, body as GeneratorBody
    
    let func = if index
      ASTE(body) #($value, $index)* -> $body
    else
      ASTE(body) #($value)* -> $body

    ASTE __promise-iter +$parallelism, __iter($iterator), __promise $func

macro __LINE__
  syntax "" with type: \number
    @const @line()

macro __COLUMN__
  syntax "" with type: \number
    @const @column()

macro __FILE__
  syntax "" with type: \string
    @const @file()

macro __DATEMSEC__
  syntax "" with type: \number
    @const new Date().get-time()

macro __VERSION__
  syntax "" with type: \string
    @const @version()

macro cascade!(top, cascades) with label: \cascade
  @maybe-cache top, #(set-top, top)
    let parts = for cascade, i in cascades
      cascade(top)
    AST
      $set-top
      $parts
      $top
