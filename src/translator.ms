require! './ast'
require! './types'

let needs-caching(item)
  return item not instanceofsome [ast.Ident, ast.Const, ast.This, ast.Arguments]

let Scope = do
  let Scope(@options = {}, @bound = false, @used-tmps = {}, @helpers = {}, @macro-helpers = {}, variables, @tmps = {})!
    @variables := if variables then ^variables else {}
    @has-bound := false
    @used-this := false
  
  Scope::maybe-cache := #(item as ast.Expression, func as Function)
    unless needs-caching item
      func item, item, false
    else
      let ident = @reserve-ident()
      let result = func ast.Assign(ident, item), ident, true
      @release-ident(ident)
      result
  
  Scope::maybe-cache-access := #(item as ast.Expression, func as Function)
    if item instanceof ast.Binary and item.op == "."
      async set-left, left <- @maybe-cache item.left
      async set-right, right <- @maybe-cache item.right
      func(
        ast.Access set-left, set-right
        ast.Access left, right
        true)
    else
      func item, item, false
  
  Scope::reserve-ident := #
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_tmp" else "_tmp$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        let ident = ast.Ident name
        @add-variable ident
        return ident
  
  Scope::reserve-param := #
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        return ast.Ident name
  
  Scope::get-tmp := #(id)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserve-ident()
  
  Scope::release-tmp := #(id)!
    if @tmps ownskey id
      // FIXME: change when delete can be used in an expression
      let ident = @tmps[id]
      delete @tmps[id]
      @release-ident(ident)
  
  Scope::release-tmps := #!
    for id of @tmps
      @release-tmp(id)
    @tmps := {}
  
  Scope::release-ident := #(ident as ast.Ident)!
    
    unless @used-tmps ownskey ident.name
      if maybe
        return
      throw Error "Trying to release a non-reserved ident: $(ident.name)"
    
    delete @used-tmps[ident.name]
  
  Scope::mark-as-param := #(ident as ast.Ident)!
    @remove-variable(ident)
  
  Scope::add-helper := #(name)!
    @helpers[name] := true
  
  let lower-sorter(a, b) -> a.to-lower-case() <=> b.to-lower-case()
  
  Scope::get-helpers := #
    let helpers = for k of @helpers
      k
    
    helpers.sort lower-sorter
  
  Scope::add-macro-helper := #(name)!
    @macro-helpers[name] := true
  
  Scope::get-macro-helpers := #
    let helpers = for k of @macro-helpers
      k
    
    helpers.sort lower-sorter
  
  Scope::add-variable := #(ident as ast.Ident)!
    @variables[ident.name] := true
  
  Scope::remove-variable := #(ident as ast.Ident)!
    delete @variables[ident.name]
  
  Scope::get-variables := #
    let variables = for k of @variables
      k
    
    variables.sort lower-sorter
  
  Scope::clone := #(bound)
    if bound
      @has-bound := true
    new Scope(@options, bound, ^@used-tmps, @helpers, @macro-helpers, @variables, ^@tmps)
  
  Scope

let wrap-return(x)
  if x instanceof ast.Throw
    x
  else
    ast.Return x

let identity(x) -> x

let make-auto-return(x) -> if x then wrap-return else identity

let num-wrap(node, scope)
  if node.type().is-subset-of(types.number)
    node
  else
    scope.add-helper \__num
    ast.Call ast.Ident(\__num), [node]

let strnum-wrap(node, scope)
  if node.type().is-subset-of(types.string)
    node
  else if node.type().is-subset-of(types.string-or-number)
    ast.Binary ast.Const(""), "+", node
  else
    scope.add-helper \__strnum
    ast.Call ast.Ident(\__strnum), [node]

let binary-ops = {
  "~^": #(left, right)
    ast.Call(
      ast.Access ast.Ident(\Math), ast.Const(\pow)
      [left, right])
  "^": #(left, right, scope)
    binary-ops["~^"] num-wrap(left, scope), num-wrap(right, scope)
  "~*": "*"
  "*": #(left, right, scope)
    ast.Binary num-wrap(left, scope), "*", num-wrap(right, scope)
  "~/": "/"
  "/": #(left, right, scope)
    ast.Binary num-wrap(left, scope), "/", num-wrap(right, scope)
  "~%": "%"
  "%": #(left, right, scope)
    ast.Binary num-wrap(left, scope), "%", num-wrap(right, scope)
  "~\\": #(left, right)
    ast.Call(
      ast.Access ast.Ident(\Math), ast.Const(\floor)
      [ast.Binary left, "/", right])
  "\\": #(left, right, scope)
    binary-ops["~\\"] num-wrap(left, scope), num-wrap(right, scope)
  "~+": #(left, right)
    unless left.type().is-subset-of types.number
      left := ast.Unary "+", left
    unless right.type().is-subset-of types.number
      right := ast.Unary "+", right
    ast.Binary left, "+", right
  "+": #(left, right, scope)
    ast.Binary num-wrap(left, scope), "+", num-wrap(right, scope)
  "~-": "-"
  "-": #(left, right, scope)
    ast.Binary num-wrap(left, scope), "-", num-wrap(right, scope)
  "~bitlshift": "<<"
  bitlshift: #(left, right, scope)
    ast.Binary num-wrap(left, scope), "<<", num-wrap(right, scope)
  "~bitrshift": ">>"
  bitrshift: #(left, right, scope)
    ast.Binary num-wrap(left, scope), ">>", num-wrap(right, scope)
  "~biturshift": ">>>"
  biturshift: #(left, right, scope)
    ast.Binary num-wrap(left, scope), ">>>", num-wrap(right, scope)
  "~min": #(left, right, scope)
    async set-left, left <- scope.maybe-cache left
    async set-right, right <- scope.maybe-cache right
    ast.IfExpression(
      ast.Binary set-left, "<", set-right
      left
      right)
  min: #(left, right, scope)
    async set-left, left <- scope.maybe-cache left
    async set-right, right <- scope.maybe-cache right
    ast.IfExpression(
      binary-ops["<"](set-left, set-right, scope)
      left
      right)
  "~max": #(left, right, scope)
    async set-left, left <- scope.maybe-cache left
    async set-right, right <- scope.maybe-cache right
    ast.IfExpression(
      ast.Binary set-left, ">", set-right
      left
      right)
  max: #(left, right, scope)
    async set-left, left <- scope.maybe-cache left
    async set-right, right <- scope.maybe-cache right
    ast.IfExpression(
      binary-ops[">"](set-left, set-right, scope)
      left
      right)
  "~&": #(mutable left, right)
    if left.type().overlaps(types.number) and right.type().overlaps(types.number)
      left := ast.Binary ast.Const(""), "+", left
    ast.Binary left, "+", right
  "&": #(mutable left, mutable right, scope)
    if not left.type().is-subset-of(types.string)
      if left.type().is-subset-of(types.string-or-number) and not right.type().is-subset-of(types.string)
        left := ast.Binary ast.Const(""), "+", left
      else
        left := strnum-wrap left, scope
    if not right.type().is-subset-of(types.string-or-number)
      right := strnum-wrap right, scope
    ast.Binary left, "+", right
  in: #(left, right, scope)
    if right instanceof ast.Arr
      let elements = right.elements
      let len = elements.length
      if len == 0
        if needs-caching left
          ast.BlockExpression [left, ast.Const(false)]
        else
          ast.Const(false)
      else if len == 1
        ast.Binary left, "===", elements[0]
      else
        async set-left, left <- scope.maybe-cache left
        let mutable current = void
        for i = len - 1, 0, -1
          let check = ast.Binary left, "===", elements[i]
          unless current?
            current := check
          else
            current := ast.Binary check, "||", current
        ast.Binary(
          ast.Binary set-left, "===", elements[0]
          "||"
          current)
    else
      scope.add-helper \__in
      ast.Call ast.Ident(\__in), [left, right]
  haskey: #(left, right, scope) -> ast.Binary right, "in", left
  ownskey: #(left, right, scope)
    scope.add-helper \__owns
    ast.Call ast.Ident(\__owns), [left, right]
  instanceof: \instanceof
  instanceofsome: #(left, right, scope)
    if right instanceof ast.Arr
      let elements = right.elements
      let len = elements.length
      if len == 0
        if needs-caching left
          ast.BlockExpression [left, ast.Const(false)]
        else
          ast.Const(false)
      else if len == 1
        ast.Binary left, \instanceof, elements[0]
      else
        async set-left, left <- scope.maybe-cache left
        let mutable current = void
        for i = len - 1, 0, -1
          let check = ast.Binary left, \instanceof, elements[i]
          unless current?
            current := check
          else
            current := ast.Binary check, "||", current
        ast.Binary(
          ast.Binary set-left, \instanceof, elements[0]
          "||"
          current)
    else
      scope.add-helper \__instanceofsome
      ast.Call ast.Ident(\__instanceofsome), [left, right]
  "<=>": #(left, right, scope)
    scope.add-helper \__cmp
    ast.Call ast.Ident(\__cmp), [left, right]
  "~=": "=="
  "!~=": "!="
  "==": "==="
  "!=": "!=="
  "~%%": #(left, right)
    ast.Binary(
      ast.Binary left, "%", right
      "==="
      ast.Const(0))
  "%%": #(left, right, scope)
    ast.Binary(
      ast.Binary num-wrap(left, scope), "%", num-wrap(right, scope)
      "==="
      ast.Const(0))
  "!~%%": #(left, right, scope)
    ast.Unary "!", binary-ops["~%%"](left, right, scope)
  "!%%": #(left, right, scope)
    ast.Unary "!", binary-ops["%%"](left, right, scope)
  "~<": "<"
  "~<=": "<="
  "~>": ">"
  "~>=": ">="
  "<": #(left, right, scope)
    scope.add-helper \__lt
    ast.Call ast.Ident(\__lt), [left, right]
  "<=": #(left, right, scope)
    scope.add-helper \__lte
    ast.Call ast.Ident(\__lte), [left, right]
  ">": #(left, right, scope)
    scope.add-helper \__lte
    ast.Unary "!", ast.Call ast.Ident(\__lte), [left, right]
  ">=": #(left, right, scope)
    scope.add-helper \__lt
    ast.Unary "!", ast.Call ast.Ident(\__lt), [left, right]
  and: "&&"
  or: "||"
  xor: #(left, right, scope)
    scope.add-helper \__xor
    ast.Call ast.Ident(\__xor), [left, right]
  "?": #(left, right, scope)
    async set-left, left <- scope.maybe-cache left
    ast.IfExpression(
      ast.Binary set-left, "!=", ast.Const(null)
      left
      right)
  "~bitand": "&"
  bitand: #(left, right, scope)
    ast.Binary num-wrap(left, scope), "&", num-wrap(right, scope)
  "~bitor": "|"
  bitor: #(left, right, scope)
    ast.Binary num-wrap(left, scope), "|", num-wrap(right, scope)
  "~bitxor": "^"
  bitxor: #(left, right, scope)
    ast.Binary num-wrap(left, scope), "^", num-wrap(right, scope)
}

let unary-ops = {
  "~-": "-"
  "-": #(node, scope, location, auto-return)
    auto-return ast.Unary("-", num-wrap(translate(node.node, scope, \expression), scope))
  "~+": "+"
  "+": #(node, scope, location, auto-return)
    auto-return num-wrap(translate(node.node, scope, \expression), scope)
  not: "!"
  bool: #(node, scope, location, auto-return)
    auto-return ast.Unary("!", ast.Unary("!", translate node.node, scope, \expression))
  "?": #(node, scope, location, auto-return)
    auto-return ast.Binary(translate(node.node, scope, \expression), "!=", ast.Const(null))
  "~bitnot": "~"
  bitnot: #(node, scope, location, auto-return)
    auto-return ast.Unary("~", num-wrap(translate(node.node, scope, \expression), scope))
  typeof: \typeof
  "typeof!": #(node, scope, location, auto-return)
    scope.add-helper \__typeof
    auto-return ast.Call(
      ast.Ident \__typeof
      [translate node.node, scope, \expression])
  "num!": #(node, scope, location, auto-return)
    let translated = translate node.node, scope, \expression
    if translated.type().is-subset-of(types.number)
      auto-return translated
    else
      scope.add-helper \__num
      auto-return ast.Call(
        ast.Ident \__num
        [translated])
  "str!": #(node, scope, location, auto-return)
    let translated = translate node.node, scope, \expression
    if translated.type().is-subset-of(types.string)
      auto-return translated
    else
      scope.add-helper \__str
      auto-return ast.Call(
        ast.Ident \__str
        [translated])
  "strnum!": #(node, scope, location, auto-return)
    let translated = translate node.node, scope, \expression
    strnum-wrap translated, scope
  delete: #(node, scope, location, auto-return)
    if location == \expression
      async set-node, node <- scope.maybe-cache-access translate node.node, scope, \expression
      let ident = scope.reserve-ident()
      let block = ast.Block [
        ast.Assign ident, set-node
        ast.Unary "delete", node, scope, \expression
        ident
      ]
      scope.release-ident(ident)
      block
    else
      auto-return ast.Unary("delete", translate node.node, scope, \expression)
  throw: #(node, scope, location)
    if location == \expression
      translate wrap-in-function-call(node), scope, \expression
    else
      ast.Throw(translate node.node, scope, \expression)
  "throw?": #(node, scope, location)
    if location == \expression
      translate wrap-in-function-call(node), scope, \expression
    else
      async set-node, node <- scope.maybe-cache translate node.node, scope, \expression
      ast.If(
        ast.Binary set-node, "!=", ast.Const(null)
        ast.Throw(node, scope, \expression))
  "^": #(node, scope, location, auto-return)
    scope.add-helper \__create
    auto-return ast.Call(
      ast.Ident \__create
      [translate node.node, scope, \expression])
}

let HELPERS = {}

let wrap-in-function-call(node)
  // TODO: should be a ParserNode, or even better, the translator shouldn't be making ParserNodes
  {
    type: \call-chain
    node.start-index
    node.end-index
    head: {
      type: \function
      node.start-index
      node.end-index
      params: []
      auto-return: true
      body: node
      bound: true
    }
    links: [
      {
        type: \call
        args: []
        existential: false
      }
    ]
  }

let translators = {
  access: #(node, scope, location, auto-return)
    return auto-return ast.Access(
      translate node.parent, scope, \expression
      translate node.child, scope, \expression)
  arguments: #(node, scope, location, auto-return)
    auto-return ast.Arguments()
  array: #(node, scope, location, auto-return)
    let translated-items = []
    let mutable current = []
    translated-items.push(current)
    for element in node.elements
      if element.type == \spread
        translated-items.push translate element.node, scope, \expression
        current := []
        translated-items.push current
      else
        current.push translate element, scope, \expression
    
    if translated-items.length == 1
      auto-return ast.Arr(translated-items[0])
    else
      for i = translated-items.length - 1, -1, -1
        let translated-item = translated-items[i]
        if i %% 2
          if translated-item.length > 0
            translated-items[i] := ast.Arr translated-item
          else
            translated-items.splice i, 1
        else
          unless translated-item.type().is-subset-of types.array
            scope.add-helper \__slice // FIXME, these shouldn't be required to specify
            scope.add-helper \__is-array
            scope.add-helper \__to-array
            translated-items[i] := ast.Call(
              ast.Ident \__to-array
              [translated-item])
      
      if translated-items.length == 1
        let array = translated-items[0]
        if array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array
          auto-return ast.Call(ast.Ident(\__slice), array.args)
        else
          auto-return array
      else
        auto-return ast.Call(
          ast.Access(
            translated-items[0]
            ast.Const(\concat))
          translated-items[1:])
  assign: do
    let ops = {
      "~^=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["~^"](left, right, scope)
      "^=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["^"](left, right, scope)
      "~*=": "*="
      "*=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "*=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops["*"](left, right, scope)
      "~/=": "/="
      "/=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "/=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops["/"](left, right, scope)
      "~%=": "%="
      "%=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "%=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops["%"](left, right, scope)
      "~\\=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["~\\"](left, right, scope)
      "\\=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["\\"](left, right, scope)
      "~+=": #(left, mutable right, scope)
        if right instanceof ast.Const and typeof right.value == \number
          if right.value == 1
            ast.Unary "++", left
          else if right.value == -1
            ast.Unary "--", left
          else
            ast.Binary left, "-=", ast.Const(-right.value)
        else
          unless right.type().is-subset-of types.number
            right := ast.Unary "+", right
          
          unless left.type().is-subset-of types.number
            async set-left, left <- scope.maybe-cache-access left
            ast.Assign set-left, ast.Binary(ast.Unary("+", left), "+", right)
          else
            ast.Binary left, "+=", right
      "+=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          if right.type().is-subset-of(types.number)
            ops["~+="](left, right, scope)
          else
            ast.Binary left, "-=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops["+"](left, right, scope)
      "~-=": #(left, right, scope)
        if right instanceof ast.Const and typeof right.value == \number
          if right.value == 1
            return ast.Unary "--", left
          else if right.value == -1
            return ast.Unary "++", left
        ast.Binary left, "-=", right
      "-=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          if right.type().is-subset-of(types.number)
            ops["~-="](left, right, scope)
          else
            ast.Binary left, "-=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops["-"](left, right, scope)
      "~bitlshift=": "<<="
      "bitlshift=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "<<=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitlshift(left, right, scope)
      "~bitrshift=": ">>="
      "bitrshift=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, ">>=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitrshift(left, right, scope)
      "~biturshift=": ">>>="
      "biturshift=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, ">>>=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitrshift(left, right, scope)
      "~min=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["~min"](left, right, scope)
      "min=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops.min(left, right, scope)
      "~max=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops["~max"](left, right, scope)
      "max=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign set-left, binary-ops.max(left, right, scope)
      "~&=": #(left, right, scope)
        if left.type().overlaps(types.number) and right.type().overlaps(types.number)
          async set-left, left <- scope.maybe-cache-access left
          ast.Binary set-left, "+=", ast.Binary(ast.Const(""), "+", right)
        else
          ast.Binary left, "+=", right
      "&=": #(left, mutable right, scope)
        if left.type().is-subset-of(types.string)
          ast.Binary left, "+=", strnum-wrap right, scope
        else if left.type().is-subset-of(types.string-or-number)
          if right.type().is-subset-of(types.string)
            ast.Binary left, "+=", right
          else
            ast.Binary left, "+=", strnum-wrap right, scope
        else
          if not right.type().is-subset-of(types.string-or-number)
            right := strnum-wrap right, scope
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign(
            set-left
            ast.Binary(
              strnum-wrap left, scope
              "+"
              right))
      "and=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Binary set-left, "&&", ast.Assign(left, right)
      "or=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        ast.Binary set-left, "||", ast.Assign(left, right)
      "xor=": #(left, right, scope)
        scope.add-helper \__xor
        async set-left, left <- scope.maybe-cache-access left
        ast.Assign(set-left, ast.Call ast.Ident(\__xor), [left, right])
      "?=": #(left, right, scope)
        async set-left, left <- scope.maybe-cache-access left
        async set-left, left-value <- scope.maybe-cache set-left
        ast.If(
          ast.Binary set-left, "!=", ast.Const(null),
          left-value,
          ast.Binary left, "=", right)
      "~bitand=": "&="
      "bitand=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "&=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitand(left, right, scope)
      "~bitor=": "|="
      "bitor=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "|=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitor(left, right, scope)
      "~bitxor=": "^="
      "bitxor=": #(left, right, scope)
        if left.type().is-subset-of(types.number)
          ast.Binary left, "^=", num-wrap(right, scope)
        else
          async set-left, left <- scope.maybe-cache-access left
          ast.Assign set-left, binary-ops.bitxor(left, right, scope)
      ":=": "="
    }
    let indexes = {
      single: #(parent, child, value, scope)
        ast.Assign(
          ast.Access parent, translate child.node, scope, \expression
          value)
      slice: #(parent, child, value, scope)
        let left = child.left
        let right = child.right
        scope.add-helper \__splice
        ast.Call(
          ast.Ident \__splice
          [
            parent
            if left and left.type != \nothing then translate(left, scope, \expression) else ast.Const(0)
            if right and right.type != \nothing then translate(right, scope, \expression) else ast.Const(Infinity)
            value
          ])
      multi: #(parent, child, value, scope, location)
        async set-parent, parent <- scope.maybe-cache parent
        async set-value, value <- scope.maybe-cache value
        let elements = translate-array child.elements, scope, \expression
        let lines = for element, i in elements
          ast.Assign(
            ast.Access if i == 0 then set-parent else parent, element
            ast.Access if i == 0 then set-value else value, ast.Const(i))
        if location == \expression
          lines.push value
        ast.Block lines
    }
    #(node, scope, location, auto-return)
      let op = node.op
      // TODO: this is ugly
      if op == ":=" and node.left.type == \index
        let type = node.left.child.type
        unless indexes ownskey type
          throw Error "Unexpected index type for assignment: $(JSON.stringify type)"
        
        auto-return indexes[type](
            translate node.left.parent, scope, \expression
            node.left.child
            translate node.right, scope, \expression
            scope
            location)
      else
        let left = translate node.left, scope, \left-expression
        let right = translate node.right, scope, \expression
        unless ops ownskey op
          throw Error "Unexpected assign operator: $(JSON.stringify op)"
      
        let handler = ops[op]
        if typeof handler == \function
          auto-return handler(left, right, scope)
        else if typeof handler == \string
          auto-return ast.Binary(left, handler, right)
        else
          throw Error "Unexpected handler type: $(typeof! handler)"
  binary: #(node, scope, location, auto-return)
    let op = node.op
    unless binary-ops ownskey op
      throw Error "Unexpected binary operator: $(JSON.stringify op)"
    
    let handler = binary-ops[op]
    let left = translate node.left, scope, \expression
    let right = translate node.right, scope, \expression
    if typeof handler == \function
      auto-return handler(left, right, scope)
    else if typeof handler == \string
      auto-return ast.Binary(left, handler, right)
    else
      throw Error "Unexpected handler type: $(typeof! handler)"
  block: #(node, scope, location, auto-return)
    ast.Block translate-array(node.nodes, scope, location, auto-return)
  break: #(node) -> ast.Break()
  call-chain: do
    let link-types = {
      access: do
        let index-types = {
          single: #(child, scope) -> #(parent)
            ast.Access parent, translate child.node, scope, \expression
          slice: #(child, scope) -> #(parent)
            let left = child.left
            let right = child.right
            let args = [parent]
            if left or right
              args.push if left then translate(left, scope, \expression) else ast.Const(0)
            if right
              args.push translate right, scope, \expression
            scope.add-helper \__slice
            ast.Call(ast.Ident(\__slice), args)
          multi: #(child, scope) -> #(parent)
            async set-parent, parent <- scope.maybe-cache parent
            let elements = translate-array child.elements, scope, \expression
            ast.Arr for element, i in elements
              ast.Access(if i == 0 then set-parent else parent, element)
        }
        #(links, link, scope, i, current)
          let make-access = if link.type == \access
            #(parent) -> ast.Access parent, translate link.child, scope, \expression
          else if link.type == \index
            unless index-types ownskey link.child.type
              throw Error "Unknown index type: $(link.child.type)"
            index-types[link.child.type](link.child, scope)
          else
            throw Error "Unknown link type: $(link.type)"
        
          unless link.existential
            handle links, scope, i + 1, make-access(current)
          else
            async set-obj, obj <- scope.maybe-cache current
            ast.If(
              ast.Binary set-obj, "!=", ast.Const(null)
              handle links, scope, i + 1, make-access(obj))
      index: #(...args)
        link-types.access.apply this, args
      call: do
        let handle-spread-call(func, array, is-new, scope)
          if is-new
            scope.add-helper \__new
            ast.Call ast.Ident(\__new), [func, array]
          else if func instanceof ast.Binary and func.op == "."
            async set-parent, parent <- scope.maybe-cache func.left
            ast.Call(
              ast.Access(ast.Access(set-parent, func.right), ast.Const(\apply))
              [parent, array])
          else
            ast.Call(
              ast.Access(func, ast.Const(\apply))
              [ast.Const(undefined), array])
        
        let make-call(func, args, is-new, scope)
          let mutable current = []
          let translated-args = [current]
          for arg in args
            if arg.type == \spread
              current := []
              translated-args.push(
                translate arg.node, scope, \expression
                current)
            else
              current.push translate arg, scope, \expression
          
          if translated-args.length == 1
            ast.Call func, translated-args[0], is-new
          else
            for i = translated-args.length - 1, -1, -1
              let translated-arg = translated-args[i]
              if i %% 2
                if translated-arg.length > 0
                  translated-args[i] := ast.Arr translated-arg
                else
                  translated-args.splice i, 1
              else
                unless translated-arg.type().is-subset-of types.array
                  scope.add-helper \__slice // FIXME, these shouldn't be required to specify
                  scope.add-helper \__is-array
                  scope.add-helper \__to-array
                  translated-args[i] := ast.Call(
                    ast.Ident(\__to-array)
                    [translated-arg])
            let array = if translated-args.length == 1
              translated-args[0]
            else
              ast.Call(
                ast.Access(
                  translated-args[0],
                  ast.Const(\concat))
                translated-args[1:])
            handle-spread-call func, array, is-new, scope
        
        #(links, link, scope, i, current)
          unless link.existential
            handle links, scope, i + 1, make-call(current, link.args, link.is-new, scope)
          else
            if current instanceof ast.Binary and current.op == "."
              async set-parent, parent <- scope.maybe-cache current.left
              async set-child, child <- scope.maybe-cache current.right
              ast.If(
                ast.Binary(
                  ast.Unary \typeof, ast.Access(set-parent, set-child)
                  "==="
                  ast.Const(\function))
                handle links, scope, i + 1, make-call(ast.Access(parent, child), link.args, link.is-new, scope))
            else
              async set-func, func <- scope.maybe-cache current
              ast.If(
                ast.Binary(
                  ast.Unary(\typeof, set-func)
                  "==="
                  ast.Const(\function))
                handle links, scope, i + 1, make-call(func, link.args, link.is-new, scope))
      "?": #(links, link, scope, i, current)
        async set-left, left <- scope.maybe-cache current
        ast.IfExpression(
          ast.Binary set-left, "!=", ast.Const(null)
          left
          translate link.child, scope, \expression)
    }
    
    let handle(links, scope, i, current)
      if i >= links.length
        current
      else
        let link = links[i]
        unless link?
          throw Error "Encounted null call-chain link at index #$i"
        
        unless link-types ownskey link.type
          throw Error "Unknown call-chain link: $(link.type)"
        
        link-types[link.type](links, link, scope, i, current)
    
    #(node, scope, location, auto-return)
      auto-return handle node.links, scope, 0, translate(node.head, scope, \expression)
  
  const: #(node, scope, location, auto-return) -> auto-return ast.Const(node.value)
  continue: # -> ast.Continue()
  debugger: #(node, scope, location, auto-return)
    if location == \expression
      ast.Call(
        ast.Func(null, [], [], [ast.Debugger()])
        [])
    else
      ast.Debugger()
  define-helper: #(node, scope, location, auto-return)
    let ident = translate node.name, scope, \left-expression
    unless ident instanceof ast.Ident
      throw Error "Expected name to be an Ident, got $(typeof! ident)"
    let value = translate node.value, scope, \expression
    HELPERS[ident.name] := #-> value
    module.exports.known-helpers.push(ident.name)
    ast.BlockExpression()
  eval: #(node, scope, location, auto-return)
    auto-return ast.Eval translate(node.code, scope, \expression)
  for: #(node, scope, location, auto-return)
    ast.For(
      if node.init? then translate node.init, scope, \expression
      if node.test? then translate node.test, scope, \expression
      if node.step? then translate node.step, scope, \expression
      translate node.body, scope, \statement)
  for-in: #(node, scope, location, auto-return)
    let key = translate node.key, scope, \left-expression
    if key not instanceof ast.Ident
      throw Error("Expected an Ident for a for-in key")
    scope.add-variable key
    ast.ForIn(
      key
      translate node.object, scope, \expression
      translate node.body, scope, \statement)
  function: do
    let primitive-types = {
      Boolean: \boolean
      String: \string
      Number: \number
      Function: \function
    }
    let make-type-check-test(ident, type, scope)
      if primitive-types ownskey type
        ast.Binary(
          ast.Unary \typeof, ident
          "!=="
          ast.Const primitive-types[type])
      else if type == \Array
        scope.add-helper \__is-array
        ast.Unary(
          "!"
          ast.Call(
            ast.Ident(\__is-array)
            [ident]))
      else
        ast.Unary(
          "!"
          ast.Binary(
            ident
            \instanceof
            ast.Ident(type)))
    let translate-type-checks = {
      ident: #(ident, node, scope, has-default-value, array-index)
        let access = if array-index?
          ast.Access(ident, array-index)
        else
          ident
        scope.add-helper \__typeof
        let result = ast.If(
          make-type-check-test access, node.name, scope
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [if array-index?
                ast.Concat(
                  ast.Const("Expected $(ident.name)[")
                  array-index
                  ast.Const("] to be a $(node.name), got ")
                  ast.Call(
                    ast.Ident(\__typeof)
                    [access]))
              else
                ast.Concat(
                  ast.Const("Expected $(ident.name) to be a $(node.name), got ")
                  ast.Call(
                    ast.Ident(\__typeof)
                    [ident]))])))
        if not has-default-value and node.name == \Boolean
          ast.If(
            ast.Binary ident, "==", ast.Const(null)
            ast.Assign ident, ast.Const(false)
            result)
        else
          result
      access: #(ident, node, scope, has-default-value, array-index)
        let access = if array-index?
          ast.Access(ident, array-index)
        else
          ident
        scope.add-helper \__typeof
        let type = translate(node, scope, \expression)
        ast.If(
          ast.Unary(
            "!"
            ast.Binary(
              access
              \instanceof
              type))
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [if array-index?
                ast.Concat(
                  ast.Const("Expected $(ident.name)[")
                  array-index
                  ast.Const("] to be a $(type.right.value), got ")
                  ast.Call(
                    ast.Ident(\__typeof)
                    [access]))
              else
                ast.Concat(
                  ast.Const("Expected $(ident.name) to be a $(type.right.value), got ")
                  ast.Call(
                    ast.Ident(\__typeof)
                    [ident]))])))
      type-union: #(ident, node, scope, has-default-value, array-index)
        // TODO: cache typeof ident if requested more than once.
        if array-index?
          throw Error "Not implemented: type-union in type-array"
        scope.add-helper \__typeof
        let mutable check = void
        let mutable has-boolean = false
        let mutable has-void = false
        let mutable has-null = false
        let names = []
        let tests = []
        for type in node.types
          if type.type == \const
            if type.value == null
              has-null := true
              names.push \null
            else if type.value == void
              has-void := true
              names.push \undefined
            else
              throw Error "Unknown const value for typechecking: $(String type.value)"
          else
            if type.type != \ident
              throw Error "Not implemented: typechecking for non-idents/consts within a type-union"
            if type.name == \Boolean
              has-boolean := true
            names.push type.name
            tests.push make-type-check-test ident, type.name, scope
        
        if has-null and has-void and not has-default-value
          tests.unshift ast.Binary ident, "!=", ast.Const(null)
        let mutable result = ast.If(
          ast.And ...tests
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.Concat(
                ast.Const("Expected $(ident.name) to be a $(names.join ' or '), got ")
                ast.Call(
                  ast.Ident(\__typeof)
                  [ident]))])))
        
        if not has-default-value
          if has-null or has-void
            if has-null xor has-void
              result := ast.If(
                ast.Binary ident, "==", ast.Const(null)
                ast.Assign ident, ast.Const(if has-null then null else void)
                result)
          else if has-boolean
            result := ast.If(
              ast.Binary ident, "==", ast.Const(null)
              ast.Assign ident, ast.Const(false)
              result)
        result
      type-array: #(ident, node, scope, has-default-value, array-index)
        if array-index
          throw Error "Not implemented: arrays within arrays as types"
        scope.add-helper \__is-array
        let index = scope.reserve-ident()
        let length = scope.reserve-ident()
        ast.If(
          ast.Unary(
            "!"
            ast.Call(
              ast.Ident(\__is-array)
              [ident]))
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.Concat(
                ast.Const("Expected $(ident.name) to be an Array, got ")
                ast.Call(
                  ast.Ident(\__typeof)
                  [ident]))]))
          ast.For(
            ast.Block [
              ast.Assign index, ast.Const 0
              ast.Assign length, ast.Access ident, ast.Const \length
            ]
            ast.Binary(index, "<", length)
            ast.Unary("++", index)
            translate-type-check(ident, node.subtype, scope, false, index)))
    }
    let translate-type-check(ident, node, scope, has-default-value, array-index)
      unless translate-type-checks ownskey node.type
        throw Error "Unknown type: $(String node.type)"
      
      translate-type-checks[node.type] ident, node, scope, has-default-value, array-index
    let translate-param-types = {
      param: #(param, scope, inner)
        let mutable ident = translate param.ident, scope, \param
        if param.ident.type == \tmp
          scope.mark-as-param ident
        
        let later-init = []
        if ident instanceof ast.Binary and ident.op == "." and ident.right instanceof ast.Const and typeof ident.right.value == \string
          let tmp = ast.Ident ident.right.value
          later-init.push ast.Binary(ident, "=", tmp)
          ident := tmp
        
        unless ident instanceof ast.Ident
          throw Error "Expecting param to be an Ident, got $(typeof! ident)"
        if inner
          scope.add-variable ident
        
        let init = []
        let type-check = if param.as-type then translate-type-check(ident, param.as-type, scope, param.default-value?)
        if param.default-value?
          init.push ast.If(
            ast.Binary ident, "==", ast.Const(null)
            ast.Assign ident, translate(param.default-value, scope, \expression)
            type-check)
        else if type-check
          init.push type-check
        {
          init: [...init, ...later-init]
          ident
          spread: not not param.spread
        }
      
      array: #(array, scope, inner)
        let array-ident = if inner then scope.reserve-ident() else scope.reserve-param()
        let init = []
        let mutable found-spread = -1
        let mutable spread-counter = void
        for p, i, len in array.elements
          let param = translate-param p, scope, true
          unless param.spread
            if found-spread == -1
              init.push ast.Assign(
                param.ident
                ast.Access array-ident, ast.Const(i))
            else
              let diff = i - found-spread - 1
              init.push ast.Assign(
                param.ident
                ast.Access(
                  array-ident
                  if diff == 0 then spread-counter else ast.Binary spread-counter, "+", ast.Const(diff)))
          else
            if found-spread != -1
              throw Error "Encountered multiple spread parameters"
            found-spread := i
            scope.add-helper \__slice
            if i == len - 1
              init.push ast.Assign(
                param.ident
                ast.Call(
                  ast.Ident(\__slice)
                  [array-ident, ...(if i == 0 then [] else [ast.Const(i)])]))
            else
              spread-counter := scope.reserve-ident()
              init.push ast.Assign(
                param.ident
                ast.IfExpresion(
                  ast.Binary(
                    ast.Const(i)
                    "<"
                    ast.Assign(
                      spread-counter
                      ast.Binary(
                        ast.Binary array-ident, ".", ast.Const(\length)
                        "-"
                        ast.Const(len - i - 1))))
                  ast.Call(
                    ast.Ident \__slice
                    [array-ident, ast.Const(i), spread-counter])
                  ast.BlockExpression [
                    ast.Assign spread-counter, ast.Const(i)
                    ast.Arr()]))
          init.push ...param.init
        if spread-counter?
          scope.release-ident spread-counter
        if inner
          scope.release-ident array-ident
        {
          init
          ident: array-ident
          spread: false
        }
      
      object: #(object, scope, inner)
        let object-ident = if inner then scope.reserve-ident() else scope.reserve-param()
        let init = []
        
        for pair in object.pairs
          let key = translate pair.key, scope, \expression
          unless key instanceof ast.Const
            throw Error "Unexpected non-const object key: $(typeof! key)"
          
          let value = translate-param pair.value, scope, true
          scope.add-variable value.ident
          init.push ast.Assign(
            value.ident
            ast.Access object-ident, key), ...value.init
        
        if inner
          scope.release-ident object-ident
        
        {
          init
          ident: object-ident
          spread: false
        }
    }
    
    let translate-param(param, scope, inner)
      let type = param.type
      unless translate-param-types ownskey type
        throw Error "Unknown parameter type: $(type)"
      translate-param-types[type](param, scope, inner)
    
    #(node, scope, location, auto-return)
      let inner-scope = scope.clone(node.bound)
      let param-idents = []
      let initializers = []
      let mutable found-spread = -1
      let mutable spread-counter = void
      
      for p, i, len in node.params
        let param = translate-param p, inner-scope, false
        unless param.spread
          if found-spread == -1
            param-idents.push param.ident
          else
            inner-scope.add-variable param.ident
            let diff = i - found-spread - 1
            initializers.push ast.Assign(
              param.ident
              ast.Access(
                ast.Arguments()
                if diff == 0 then spread-counter else ast.Binary(spread-counter, "+", ast.Const(diff))))
        else
          if found-spread != -1
            throw Error "Encountered multiple spread parameters"
          found-spread := i
          inner-scope.add-helper \__slice
          inner-scope.add-variable param.ident
          if i == len - 1
            initializers.push ast.Assign(
              param.ident
              ast.Call(
                ast.Ident(\__slice)
                [ast.Arguments(), ...(if i == 0 then [] else [ast.Const(i)])]))
          else
            spread-counter := inner-scope.reserve-ident()
            initializers.push ast.Assign(
              param.ident
              ast.IfExpression(
                ast.Binary(
                  ast.Const(i)
                  "<"
                  ast.Assign(
                    spread-counter
                    ast.Binary(
                      ast.Binary ast.Arguments(), ".", ast.Const(\length)
                      "-"
                      ast.Const(len - i - 1))))
                ast.Call(
                  ast.Ident \__slice
                  [ast.Arguments(), ast.Const(i), spread-counter])
                ast.BlockExpression [
                  ast.Assign spread-counter, ast.Const(i)
                  ast.Arr()]))
        initializers.push ...param.init
      
      if spread-counter
        inner-scope.release-ident spread-counter
      
      let mutable body = translate node.body, inner-scope, \top-statement, node.auto-return
      body := if body instanceofsome [ast.BlockExpression, ast.BlockStatement]
        body.body
      else
        [body]
      inner-scope.release-tmps()
      body := [...initializers, ...body]
      if inner-scope.used-this
        if inner-scope.bound
          scope.used-this := true
        if inner-scope.has-bound and not inner-scope.bound
          let fake-this = ast.Ident \_this
          inner-scope.add-variable fake-this
          body.unshift ast.Assign fake-this, ast.This()
      let func = ast.Func null, param-idents, inner-scope.get-variables(), body
      auto-return func
  ident: #(node, scope, location, auto-return) -> auto-return ast.Ident(node.name)
  if: #(node, scope, location, auto-return)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    ast.If(
      translate node.test, scope, \expression
      translate node.when-true, scope, inner-location, auto-return
      if node.when-false? then translate node.when-false, scope, inner-location, auto-return)
  index: #(node, scope, location, auto-return)
    let type = node.child.type
    if type == \single
      auto-return ast.Access(
        translate node.parent, scope, \expression
        translate node.child.node, scope, \expression)
    else if type == \multi
      throw Error "Not implemented: index multi"
    else if type == \slice
      throw Error "Not implemented: index slice"
    else
      throw Error "Unknown index type: $type"
  let: do
    let declarables = {
      declarable: #(node, scope)
        if node.ident.type == \declarable
          translate-declarable node.ident, scope
        else
          let ident = translate node.ident, scope, \left-expression
          scope.add-variable ident
          ident
    }
    let translate-declarable(node, scope)
      unless declarables ownskey node.type
        throw Error "Unknown declarable type $(node.type)"
      declarables[node.type](node, scope)
    #(node, scope, location, auto-return)
      let left = translate-declarable node.left, scope
      let right = translate node.right, scope, \expression
      if location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name?
        scope.remove-variable left
        auto-return ast.Func(left, right.params, right.variables, right.body, right.declarations)
      else
        auto-return ast.Assign(left, right)
  macro-helper: #(node, scope, location, auto-return)
    let name = node.name
    scope.add-macro-helper name
    auto-return ast.Obj [
      ast.Obj.Pair \type, ast.Const(\ident)
      ast.Obj.Pair \name, ast.Const(name)
    ]
  nothing: #-> ast.BlockExpression()
  object: #(node, scope, location, auto-return)
    let const-pairs = []
    let post-const-pairs = []
    let mutable current-pairs = const-pairs
    for pair in node.pairs
      let key = translate pair.key, scope, \expression
      let value = translate pair.value, scope, \expression
      
      if key not instanceof ast.Const
        current-pairs := post-const-pairs
      
      current-pairs.push { key, value }
    
    let obj = ast.Obj for pair in const-pairs
      ast.Obj.Pair String(pair.key.value), pair.value
    
    if post-const-pairs.length == 0
      auto-return obj
    else
      let ident = scope.reserve-ident()
      let result = ast.BlockExpression [
        ast.Assign ident, obj
        ...for pair in post-const-pairs
          ast.Assign(
            ast.Access(ident, pair.key)
            pair.value)
        ident
      ]
      scope.release-ident ident
      auto-return result
  operator: do
    let make-num-op(op) -> #(scope)
      let left = ast.Ident \x
      let right = ast.Ident \y
      ast.Func null, [left, right], [], [ast.Return(ast.Binary(
        num-wrap left, scope
        op
        num-wrap right, scope))]
    let operators = {
      "~^": #(scope) -> ast.Access ast.Ident(\Math), ast.Const(\pow)
      "^": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          ast.Call(
            ast.Access ast.Ident(\Math), ast.Const(\pow)
            [num-wrap(left, scope), num-wrap(right, scope)]))]
      "*": make-num-op "*"
      "/": make-num-op "/"
      "%": make-num-op "%"
      "~\\": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          ast.Call(
            ast.Access ast.Ident(\Math), ast.Const(\floor)
            [ast.Binary left, "/", right]))]
      "\\": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          ast.Call(
            ast.Access ast.Ident(\Math), ast.Const(\floor)
            [ast.Binary num-wrap(left, scope), "/", num-wrap(right, scope)]))]
      "~+": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          ast.Unary "+", left
          "+"
          ast.Unary "+", right))]
      "+": make-num-op "+"
      "-": make-num-op "-"
      bitlshift: make-num-op "<<"
      bitrshift: make-num-op ">>"
      biturshift: make-num-op ">>>"
      bitand: make-num-op "&"
      bitor: make-num-op "|"
      bitxor: make-num-op "^"
      "~min": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, "<", right
          left
          right))]
      min: #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          binary-ops["<"](left, right, scope)
          left
          right))]
      "~max": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, ">", right
          left
          right))]
      max: #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          binary-ops[">"](left, right, scope)
          left
          right))]
      "~&": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          ast.Binary(
            ast.Const ""
            "+"
            left)
          "+"
          right))]
      "&": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          strnum-wrap left, scope
          "+"
          strnum-wrap right, scope))]
      in: #(scope)
        scope.add-helper \__in
        ast.Ident \__in
      haskey: #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          ast.Binary right, "in", left)]
      ownskey: #(scope)
        scope.add-helper \__owns
        ast.Ident \__owns
      instanceofsome: #(scope)
        scope.add-helper \__instanceofsome
        ast.Ident \__instanceofsome
      "<=>": #(scope)
        scope.add-helper \__cmp
        ast.Ident \__cmp
      "~%%": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          binary-ops["~%%"](left, right, scope))]
      "%%": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          binary-ops["%%"](left, right, scope))]
      "!~%%": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          binary-ops["!~%%"](left, right, scope))]
      "!%%": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(
          binary-ops["!%%"](left, right, scope))]
      "<": #(scope)
        scope.add-helper \__lt
        ast.Ident \__lt
      "<=": #(scope)
        scope.add-helper \__lte
        ast.Ident \__lte
      ">": #(scope)
        scope.add-helper \__lte
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.Unary(
          "!"
          ast.Call ast.Ident(\__lte), [left, right]))]
      ">=": #(scope)
        scope.add-helper \__lt
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.Unary(
          "!"
          ast.Call ast.Ident(\__lt), [left, right]))]
      xor: #(scope)
        scope.add-helper \__xor
        ast.Ident \__xor
      "?": #(scope)
        let left = ast.Ident \x
        let right = ast.Ident \y
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, "!=", ast.Const(null)
          left
          right))]
      bitnot: #(scope)
        let left = ast.Ident \x
        ast.Func null, [left], [], [ast.Return(ast.Unary(
          "~"
          num-wrap(left, scope)))]
      bool: #(scope)
        let value = ast.Ident \x
        ast.Func null, [value], [], [ast.Return(ast.Unary("!", ast.Unary("!", value)))]
      "typeof!": #(scope)
        scope.add-helper \__typeof
        ast.Ident \__typeof
      "num!": #(scope)
        scope.add-helper \__num
        ast.Ident \__num
      "str!": #(scope)
        scope.add-helper \__str
        ast.Ident \__str
      "strnum!": #(scope)
        scope.add-helper \__strnum
        ast.Ident \__strnum
      delete: #(scope)
        let object = ast.Ident \o
        let key = ast.Ident \k
        let ident = ast.Ident \v
        ast.Func null, [object, key], [ident.name], [
          ast.Assign(ident, ast.Access(object, key))
          ast.Unary(\delete, ast.Access(object, key))
          ast.Return(ident)]
      throw: #(scope)
        let error = ast.Ident \e
        ast.Func null, [error], [], [
          ast.Throw(error)]
      "throw?": #(scope)
        let error = ast.Ident \e
        ast.Func null, [error], [], [
          ast.IfStatement(
            ast.Binary(error, "!=", ast.Const(null))
            ast.Throw(error))]
    }
    #(node, scope, location, auto-return)
      let op = node.op
      if operators ownskey op
        auto-return operators[op](scope)
      else if binary-ops ownskey op and typeof binary-ops[op] == \string
        let left = ast.Ident \x
        let right = ast.Ident \y
        auto-return ast.Func(null, [left, right], [], [ast.Return(ast.Binary(left, binary-ops[op], right))])
      else if unary-ops ownskey op and typeof unary-ops[op] == \string
        let value = ast.Ident \x
        auto-return ast.Func(null, [value], [], [ast.Return(ast.Unary(unary-ops[op], value))])
      else
        throw Error "Unknown operator: $(String op)"
  regexp: #(node, scope, location, auto-return)
    let text = translate node.text, scope, \expression
    let flags = node.flags
    if text instanceof ast.Const and typeof text.value == \string
      auto-return ast.Const(RegExp(text.value, flags))
    else
      auto-return ast.Call(
        ast.Ident(\RegExp)
        [text, ast.Const(flags)])
  return: #(node, scope)
    let value = translate node.node, scope, \expression
    if node.existential
      async set-value, value <- scope.maybe-cache value
      ast.IfStatement(
        ast.Binary(
          set-value
          "!="
          ast.Const(null))
        ast.Return(value))
    else
      ast.Return(value)
  root: #(node, scope)
    let body = translate node.body, scope, \top-statement, scope.options.return
    let init = []
    if scope.has-bound and scope.used-this
      let fake-this = ast.Ident(\_this)
      scope.add-variable fake-this
      init.push ast.Assign fake-this, ast.This()
    for helper in scope.get-helpers()
      unless HELPERS ownskey helper
        throw Error "Helper not defined: $helper"
      let ident = ast.Ident(helper)
      scope.add-variable ident
      init.push ast.Assign ident, HELPERS[helper]()
    ast.Root(
      [...init, body]
      scope.get-variables()
      ["use strict"])
  string: #(node, scope, location, auto-return)
    let parts = node.parts
    
    let mutable current = void
    for p in parts
      let part = if typeof p == \string
        ast.Const p
      else
        translate p, scope, \expression
      
      if current?
        current := ast.Binary current, "+", strnum-wrap(part, scope)
      else
        current := strnum-wrap(part, scope)
    unless current?
      current := ast.Const("")
    auto-return current
  
  tmp: #(node, scope, location, auto-return)
    auto-return scope.get-tmp(node.id)
  
  this: #(node, scope, location, auto-return)
    scope.used-this := true
    auto-return if scope.bound
      ast.Ident(\_this)
    else
      ast.This()
  
  try-catch: #(node, scope, location, auto-return)
    ast.TryCatch(
      translate node.try-body, scope, \statement, auto-return
      translate node.catch-ident, scope, \left-expression
      translate node.catch-body, scope, \expression, auto-return)
  
  try-finally: #(node, scope, location, auto-return)
    ast.TryFinally(
      translate node.try-body, scope, \statement, auto-return
      translate node.finally-body, scope, \statement)
  
  unary: #(node, scope, location, auto-return)
    let op = node.op
    unless unary-ops ownskey op
      throw Error "Unexpected unary operator: $(JSON.stringify op)"
    
    let handler = unary-ops[op]
    if typeof handler == \function
      handler node, scope, location, auto-return
    else if typeof handler == \string
      auto-return ast.Unary(handler, translate node.node, scope, \expression)
    else
      throw Error "Unexpected handler type: $(typeof! handler)"
  
  use-macro: #(node, scope, location, auto-return)
    let result = translate node.node, scope, location, auto-return
    for tmp in node.tmps
      scope.release-tmp tmp
    
    for helper in node.macro-helpers
      scope.add-helper helper
    
    result
}

let translate(node as Object, scope as Scope, location as String, auto-return)
  if typeof auto-return != \function
    auto-return := make-auto-return auto-return
  
  unless translators ownskey node.type
    throw Error "Unable to translate unknown node type: $(JSON.stringify node.type)"
  
  translators[node.type](node, scope, location, auto-return)

let translate-array(nodes as Array, scope as Scope, location as String, auto-return)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and auto-return

module.exports := #(node, options = {})
  let scope = new Scope(options, false)
  let result = translate node, scope, \statement, false
  scope.release-tmps()
  return {
    node: result
    macro-helpers: scope.get-macro-helpers()
  }

module.exports.known-helpers := []
