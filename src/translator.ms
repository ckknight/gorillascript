require! './ast'
require! './types'

let needsCaching(item)
  return item not instanceofsome [ast.Ident, ast.Const, ast.This, ast.Arguments]

let Scope = do
  let Scope(@options = {}, @bound = false, @usedTmps = {}, @helpers = {}, @macroHelpers = {}, variables, @tmps = {})!
    @variables := if variables then ^variables else {}
    @hasBound := false
    @usedThis := false
  
  Scope::maybeCache := #(item as ast.Expression, func as Function)
    unless needsCaching item
      func item, item, false
    else
      let ident = @reserveIdent()
      let result = func ast.Assign(ident, item), ident, true
      @releaseIdent(ident)
      result
  
  Scope::maybeCacheAccess := #(item as ast.Expression, func as Function)
    if item instanceof ast.Binary and item.op == "."
      async setLeft, left <- @maybeCache item.left
      async setRight, right <- @maybeCache item.right
      func(
        ast.Access setLeft, setRight
        ast.Access left, right
        true)
    else
      func item, item, false
  
  Scope::reserveIdent := #
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_tmp" else "_tmp$i"
      unless @usedTmps haskey name
        @usedTmps[name] := true
        let ident = ast.Ident name
        @addVariable ident
        return ident
  
  Scope::reserveParam := #
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @usedTmps haskey name
        @usedTmps[name] := true
        return ast.Ident name
  
  Scope::getTmp := #(id)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserveIdent()
  
  Scope::releaseTmp := #(id)!
    if @tmps ownskey id
      // FIXME: change when delete can be used in an expression
      let ident = @tmps[id]
      delete @tmps[id]
      @releaseIdent(ident)
  
  Scope::releaseTmps := #!
    for id of @tmps
      @releaseTmp(id)
    @tmps := {}
  
  Scope::releaseIdent := #(ident as ast.Ident)!
    
    unless @usedTmps ownskey ident.name
      if maybe
        return
      throw Error "Trying to release a non-reserved ident: $(ident.name)"
    
    delete @usedTmps[ident.name]
  
  Scope::markAsParam := #(ident as ast.Ident)!
    @removeVariable(ident)
  
  Scope::addHelper := #(name)!
    @helpers[name] := true
  
  let lowerSorter(a, b) -> a.toLowerCase() <=> b.toLowerCase()
  
  Scope::getHelpers := #
    let helpers = for k of @helpers
      k
    
    helpers.sort lowerSorter
  
  Scope::addMacroHelper := #(name)!
    @macroHelpers[name] := true
  
  Scope::getMacroHelpers := #
    let helpers = for k of @macroHelpers
      k
    
    helpers.sort lowerSorter
  
  Scope::addVariable := #(ident as ast.Ident)!
    @variables[ident.name] := true
  
  Scope::removeVariable := #(ident as ast.Ident)!
    delete @variables[ident.name]
  
  Scope::getVariables := #
    let variables = for k of @variables
      k
    
    variables.sort lowerSorter
  
  Scope::clone := #(bound)
    if bound
      @hasBound := true
    new Scope(@options, bound, ^@usedTmps, @helpers, @macroHelpers, @variables, ^@tmps)
  
  Scope

let wrapReturn(x)
  if x instanceof ast.Throw
    x
  else
    ast.Return x

let identity(x) -> x

let makeAutoReturn(x) -> if x then wrapReturn else identity

let numWrap(node, scope)
  if node.type().isSubsetOf(types.number)
    node
  else
    scope.addHelper "__num"
    ast.Call ast.Ident("__num"), [node]

let strnumWrap(node, scope)
  if node.type().isSubsetOf(types.string)
    node
  else if node.type().isSubsetOf(types.stringOrNumber)
    ast.Binary ast.Const(""), "+", node
  else
    scope.addHelper "__strnum"
    ast.Call ast.Ident("__strnum"), [node]

let binaryOps = {
  "~^": #(left, right)
    ast.Call(
      ast.Access ast.Ident("Math"), ast.Const("pow")
      [left, right])
  "^": #(left, right, scope)
    binaryOps["~^"] numWrap(left, scope), numWrap(right, scope)
  "~*": "*"
  "*": #(left, right, scope)
    ast.Binary numWrap(left, scope), "*", numWrap(right, scope)
  "~/": "/"
  "/": #(left, right, scope)
    ast.Binary numWrap(left, scope), "/", numWrap(right, scope)
  "~%": "%"
  "%": #(left, right, scope)
    ast.Binary numWrap(left, scope), "%", numWrap(right, scope)
  "~\\": #(left, right)
    ast.Call(
      ast.Access ast.Ident("Math"), ast.Const("floor")
      [ast.Binary left, "/", right])
  "\\": #(left, right, scope)
    binaryOps["~\\"] numWrap(left, scope), numWrap(right, scope)
  "~+": #(left, right)
    unless left.type().isSubsetOf types.number
      left := ast.Unary "+", left
    unless right.type().isSubsetOf types.number
      right := ast.Unary "+", right
    ast.Binary left, "+", right
  "+": #(left, right, scope)
    ast.Binary numWrap(left, scope), "+", numWrap(right, scope)
  "~-": "-"
  "-": #(left, right, scope)
    ast.Binary numWrap(left, scope), "-", numWrap(right, scope)
  "~bitlshift": "<<"
  bitlshift: #(left, right, scope)
    ast.Binary numWrap(left, scope), "<<", numWrap(right, scope)
  "~bitrshift": ">>"
  bitrshift: #(left, right, scope)
    ast.Binary numWrap(left, scope), ">>", numWrap(right, scope)
  "~biturshift": ">>>"
  biturshift: #(left, right, scope)
    ast.Binary numWrap(left, scope), ">>>", numWrap(right, scope)
  "~min": #(left, right, scope)
    async setLeft, left <- scope.maybeCache left
    async setRight, right <- scope.maybeCache right
    ast.IfExpression(
      ast.Binary setLeft, "<", setRight
      left
      right)
  min: #(left, right, scope)
    async setLeft, left <- scope.maybeCache left
    async setRight, right <- scope.maybeCache right
    ast.IfExpression(
      binaryOps["<"](setLeft, setRight, scope)
      left
      right)
  "~max": #(left, right, scope)
    async setLeft, left <- scope.maybeCache left
    async setRight, right <- scope.maybeCache right
    ast.IfExpression(
      ast.Binary setLeft, ">", setRight
      left
      right)
  max: #(left, right, scope)
    async setLeft, left <- scope.maybeCache left
    async setRight, right <- scope.maybeCache right
    ast.IfExpression(
      binaryOps[">"](setLeft, setRight, scope)
      left
      right)
  "~&": #(mutable left, right)
    if left.type().overlaps(types.number) and right.type().overlaps(types.number)
      left := ast.Binary ast.Const(""), "+", left
    ast.Binary left, "+", right
  "&": #(mutable left, mutable right, scope)
    if not left.type().isSubsetOf(types.string)
      if left.type().isSubsetOf(types.stringOrNumber) and not right.type().isSubsetOf(types.string)
        left := ast.Binary ast.Const(""), "+", left
      else
        left := strnumWrap left, scope
    if not right.type().isSubsetOf(types.stringOrNumber)
      right := strnumWrap right, scope
    ast.Binary left, "+", right
  in: #(left, right, scope)
    if right instanceof ast.Arr
      let elements = right.elements
      let len = elements.length
      if len == 0
        if needsCaching left
          ast.BlockExpression [left, ast.Const(false)]
        else
          ast.Const(false)
      else if len == 1
        ast.Binary left, "===", elements[0]
      else
        async setLeft, left <- scope.maybeCache left
        let mutable current = void
        for i = len - 1, 0, -1
          let check = ast.Binary left, "===", elements[i]
          unless current?
            current := check
          else
            current := ast.Binary check, "||", current
        ast.Binary(
          ast.Binary setLeft, "===", elements[0]
          "||"
          current)
    else
      scope.addHelper "__in"
      ast.Call ast.Ident("__in"), [left, right]
  haskey: #(left, right, scope) -> ast.Binary right, "in", left
  ownskey: #(left, right, scope)
    scope.addHelper "__owns"
    ast.Call ast.Ident("__owns"), [left, right]
  instanceof: "instanceof"
  instanceofsome: #(left, right, scope)
    if right instanceof ast.Arr
      let elements = right.elements
      let len = elements.length
      if len == 0
        if needsCaching left
          ast.BlockExpression [left, ast.Const(false)]
        else
          ast.Const(false)
      else if len == 1
        ast.Binary left, "instanceof", elements[0]
      else
        async setLeft, left <- scope.maybeCache left
        let mutable current = void
        for i = len - 1, 0, -1
          let check = ast.Binary left, "instanceof", elements[i]
          unless current?
            current := check
          else
            current := ast.Binary check, "||", current
        ast.Binary(
          ast.Binary setLeft, "instanceof", elements[0]
          "||"
          current)
    else
      scope.addHelper "__instanceofsome"
      ast.Call ast.Ident("__instanceofsome"), [left, right]
  "<=>": #(left, right, scope)
    scope.addHelper "__cmp"
    ast.Call ast.Ident("__cmp"), [left, right]
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
      ast.Binary numWrap(left, scope), "%", numWrap(right, scope)
      "==="
      ast.Const(0))
  "!~%%": #(left, right, scope)
    ast.Unary "!", binaryOps["~%%"](left, right, scope)
  "!%%": #(left, right, scope)
    ast.Unary "!", binaryOps["%%"](left, right, scope)
  "~<": "<"
  "~<=": "<="
  "~>": ">"
  "~>=": ">="
  "<": #(left, right, scope)
    scope.addHelper "__lt"
    ast.Call ast.Ident("__lt"), [left, right]
  "<=": #(left, right, scope)
    scope.addHelper "__lte"
    ast.Call ast.Ident("__lte"), [left, right]
  ">": #(left, right, scope)
    scope.addHelper "__lte"
    ast.Unary "!", ast.Call ast.Ident("__lte"), [left, right]
  ">=": #(left, right, scope)
    scope.addHelper "__lt"
    ast.Unary "!", ast.Call ast.Ident("__lt"), [left, right]
  and: "&&"
  or: "||"
  xor: #(left, right, scope)
    scope.addHelper "__xor"
    ast.Call ast.Ident("__xor"), [left, right]
  "?": #(left, right, scope)
    async setLeft, left <- scope.maybeCache left
    ast.IfExpression(
      ast.Binary setLeft, "!=", ast.Const(null)
      left
      right)
  "~bitand": "&"
  bitand: #(left, right, scope)
    ast.Binary numWrap(left, scope), "&", numWrap(right, scope)
  "~bitor": "|"
  bitor: #(left, right, scope)
    ast.Binary numWrap(left, scope), "|", numWrap(right, scope)
  "~bitxor": "^"
  bitxor: #(left, right, scope)
    ast.Binary numWrap(left, scope), "^", numWrap(right, scope)
}

let unaryOps = {
  "~-": "-"
  "-": #(node, scope, location, autoReturn)
    autoReturn ast.Unary("-", numWrap(translate(node.value.node, scope, "expression"), scope))
  "~+": "+"
  "+": #(node, scope, location, autoReturn)
    autoReturn numWrap(translate(node.value.node, scope, "expression"), scope)
  not: "!"
  bool: #(node, scope, location, autoReturn)
    autoReturn ast.Unary("!", ast.Unary("!", translate node.value.node, scope, "expression"))
  "?": #(node, scope, location, autoReturn)
    autoReturn ast.Binary(translate(node.value.node, scope, "expression"), "!=", ast.Const(null))
  "~bitnot": "~"
  bitnot: #(node, scope, location, autoReturn)
    autoReturn ast.Unary("~", numWrap(translate(node.value.node, scope, "expression"), scope))
  typeof: "typeof"
  "typeof!": #(node, scope, location, autoReturn)
    scope.addHelper "__typeof"
    autoReturn ast.Call(
      ast.Ident "__typeof"
      [translate node.value.node, scope, "expression"])
  "num!": #(node, scope, location, autoReturn)
    let translated = translate node.value.node, scope, "expression"
    if translated.type().isSubsetOf(types.number)
      autoReturn translated
    else
      scope.addHelper "__num"
      autoReturn ast.Call(
        ast.Ident "__num"
        [translated])
  "str!": #(node, scope, location, autoReturn)
    let translated = translate node.value.node, scope, "expression"
    if translated.type().isSubsetOf(types.string)
      autoReturn translated
    else
      scope.addHelper "__str"
      autoReturn ast.Call(
        ast.Ident "__str"
        [translated])
  "strnum!": #(node, scope, location, autoReturn)
    let translated = translate node.value.node, scope, "expression"
    strnumWrap translated, scope
  delete: #(node, scope, location, autoReturn)
    if location == "expression"
      async setNode, node <- scope.maybeCacheAccess translate node.value.node, scope, "expression"
      let ident = scope.reserveIdent()
      let block = ast.Block [
        ast.Assign ident, setNode
        ast.Unary "delete", node, scope, "expression"
        ident
      ]
      scope.releaseIdent(ident)
      block
    else
      autoReturn ast.Unary("delete", translate node.value.node, scope, "expression")
  throw: #(node, scope, location)
    if location == "expression"
      translate wrapInFunctionCall(node), scope, "expression"
    else
      ast.Throw(translate node.value.node, scope, "expression")
  "throw?": #(node, scope, location)
    if location == "expression"
      translate wrapInFunctionCall(node), scope, "expression"
    else
      async setNode, node <- scope.maybeCache translate node.value.node, scope, "expression"
      ast.If(
        ast.Binary setNode, "!=", ast.Const(null)
        ast.Throw(node, scope, "expression"))
  "^": #(node, scope, location, autoReturn)
    scope.addHelper "__create"
    autoReturn ast.Call(
      ast.Ident "__create"
      [translate node.value.node, scope, "expression"])
}

let HELPERS = {}

let wrapInFunctionCall(node)
  {
    type: "callchain"
    node.startIndex
    node.endIndex
    value: {
      head: {
        type: "function"
        node.startIndex
        node.endIndex
        value: {
          params: []
          autoReturn: true
          body: node
        }
      }
      links: [
        {
          type: "access"
          child: {
            type: "const"
            value: "call"
          }
          existential: false
        }
        {
          type: "call"
          args: [{
            type: "this"
            node.startIndex
            node.endIndex
          }]
          existential: false
        }
      ]
    }
  }

let translators = {
  access: #(node, scope, location, autoReturn)
    return autoReturn ast.Access(
      translate node.value.parent, scope, "expression"
      translate node.value.child, scope, "expression")
  arguments: #(node, scope, location, autoReturn)
    autoReturn ast.Arguments()
  array: #(node, scope, location, autoReturn)
    let translatedItems = []
    let mutable current = []
    translatedItems.push(current)
    for arg in node.value
      if arg.type == "spread"
        translatedItems.push translate arg.value, scope, "expression"
        current := []
        translatedItems.push current
      else
        current.push translate arg, scope, "expression"
    
    if translatedItems.length == 1
      autoReturn ast.Arr(translatedItems[0])
    else
      for i = translatedItems.length - 1, -1, -1
        let translatedItem = translatedItems[i]
        if i %% 2
          if translatedItem.length > 0
            translatedItems[i] := ast.Arr translatedItem
          else
            translatedItems.splice i, 1
        else
          unless translatedItem.type().isSubsetOf types.array
            scope.addHelper "__slice" // FIXME, these shouldn't be required to specify
            scope.addHelper "__isArray"
            scope.addHelper "__toArray"
            translatedItems[i] := ast.Call(
              ast.Ident "__toArray"
              [translatedItem])
      
      if translatedItems.length == 1
        let array = translatedItems[0]
        if array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == "__toArray"
          autoReturn ast.Call(ast.Ident("__slice"), array.args)
        else
          autoReturn array
      else
        autoReturn ast.Call(
          ast.Access(
            translatedItems[0]
            ast.Const("concat"))
          translatedItems[1:])
  assign: do
    let ops = {
      "~^=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["~^"](left, right, scope)
      "^=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["^"](left, right, scope)
      "~*=": "*="
      "*=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "*=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps["*"](left, right, scope)
      "~/=": "/="
      "/=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "/=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps["/"](left, right, scope)
      "~%=": "%="
      "%=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "%=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps["%"](left, right, scope)
      "~\\=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["~\\"](left, right, scope)
      "\\=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["\\"](left, right, scope)
      "~+=": #(left, mutable right, scope)
        if right instanceof ast.Const and typeof right.value == "number"
          if right.value == 1
            ast.Unary "++", left
          else if right.value == -1
            ast.Unary "--", left
          else
            ast.Binary left, "-=", ast.Const(-right.value)
        else
          unless right.type().isSubsetOf types.number
            right := ast.Unary "+", right
          
          unless left.type().isSubsetOf types.number
            async setLeft, left <- scope.maybeCacheAccess left
            ast.Assign setLeft, ast.Binary(ast.Unary("+", left), "+", right)
          else
            ast.Binary left, "+=", right
      "+=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          if right.type().isSubsetOf(types.number)
            ops["~+="](left, right, scope)
          else
            ast.Binary left, "-=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps["+"](left, right, scope)
      "~-=": #(left, right, scope)
        if right instanceof ast.Const and typeof right.value == "number"
          if right.value == 1
            return ast.Unary "--", left
          else if right.value == -1
            return ast.Unary "++", left
        ast.Binary left, "-=", right
      "-=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          if right.type().isSubsetOf(types.number)
            ops["~-="](left, right, scope)
          else
            ast.Binary left, "-=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps["-"](left, right, scope)
      "~bitlshift=": "<<="
      "bitlshift=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "<<=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitlshift(left, right, scope)
      "~bitrshift=": ">>="
      "bitrshift=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, ">>=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitrshift(left, right, scope)
      "~biturshift=": ">>>="
      "biturshift=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, ">>>=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitrshift(left, right, scope)
      "~min=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["~min"](left, right, scope)
      "min=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps.min(left, right, scope)
      "~max=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps["~max"](left, right, scope)
      "max=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign setLeft, binaryOps.max(left, right, scope)
      "~&=": #(left, right, scope)
        if left.type().overlaps(types.number) and right.type().overlaps(types.number)
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Binary setLeft, "+=", ast.Binary(ast.Const(""), "+", right)
        else
          ast.Binary left, "+=", right
      "&=": #(left, mutable right, scope)
        if left.type().isSubsetOf(types.string)
          ast.Binary left, "+=", strnumWrap right, scope
        else if left.type().isSubsetOf(types.stringOrNumber)
          if right.type().isSubsetOf(types.string)
            ast.Binary left, "+=", right
          else
            ast.Binary left, "+=", strnumWrap right, scope
        else
          if not right.type().isSubsetOf(types.stringOrNumber)
            right := strnumWrap right, scope
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign(
            setLeft
            ast.Binary(
              strnumWrap left, scope
              "+"
              right))
      "and=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Binary setLeft, "&&", ast.Assign(left, right)
      "or=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Binary setLeft, "||", ast.Assign(left, right)
      "xor=": #(left, right, scope)
        scope.addHelper "__xor"
        async setLeft, left <- scope.maybeCacheAccess left
        ast.Assign(setLeft, ast.Call ast.Ident("__xor"), [left, right])
      "?=": #(left, right, scope)
        async setLeft, left <- scope.maybeCacheAccess left
        async setLeft, leftValue <- scope.maybeCache setLeft
        ast.If(
          ast.Binary setLeft, "!=", ast.Const(null),
          leftValue,
          ast.Binary left, "=", right)
      "~bitand=": "&="
      "bitand=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "&=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitand(left, right, scope)
      "~bitor=": "|="
      "bitor=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "|=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitor(left, right, scope)
      "~bitxor=": "^="
      "bitxor=": #(left, right, scope)
        if left.type().isSubsetOf(types.number)
          ast.Binary left, "^=", numWrap(right, scope)
        else
          async setLeft, left <- scope.maybeCacheAccess left
          ast.Assign setLeft, binaryOps.bitxor(left, right, scope)
      ":=": "="
    }
    let indexes = {
      single: #(parent, child, value, scope)
        ast.Assign(
          ast.Access parent, translate child.node, scope, "expression"
          value)
      slice: #(parent, child, value, scope)
        let left = child.left
        let right = child.right
        scope.addHelper "__splice"
        ast.Call(
          ast.Ident "__splice"
          [
            parent
            if left and left.type != "nothing" then translate(left, scope, "expression") else ast.Const(0)
            if right and right.type != "nothing" then translate(right, scope, "expression") else ast.Const(Infinity)
            value
          ])
      multi: #(parent, child, value, scope, location)
        async setParent, parent <- scope.maybeCache parent
        async setValue, value <- scope.maybeCache value
        let elements = translateArray child.elements, scope, "expression"
        let lines = for element, i in elements
          ast.Assign(
            ast.Access if i == 0 then setParent else parent, element
            ast.Access if i == 0 then setValue else value, ast.Const(i))
        if location == "expression"
          lines.push value
        ast.Block lines
    }
    #(node, scope, location, autoReturn)
      let op = node.value.op
      if op == ":=" and node.value.left.type == "index"
        let type = node.value.left.value.child.type
        unless indexes ownskey type
          throw Error "Unexpected index type for assignment: $(JSON.stringify type)"
        
        autoReturn indexes[type](
            translate node.value.left.value.parent, scope, "expression"
            node.value.left.value.child
            translate node.value.right, scope, "expression"
            scope
            location)
      else
        let left = translate node.value.left, scope, "leftexpression"
        let right = translate node.value.right, scope, "expression"
        unless ops ownskey op
          throw Error "Unexpected assign operator: $(JSON.stringify op)"
      
        let handler = ops[op]
        if typeof handler == "function"
          autoReturn handler(left, right, scope)
        else if typeof handler == "string"
          autoReturn ast.Binary(left, handler, right)
        else
          throw Error "Unexpected handler type: $(typeof! handler)"
  binary: #(node, scope, location, autoReturn)
    let op = node.value.op
    unless binaryOps ownskey op
      throw Error "Unexpected binary operator: $(JSON.stringify op)"
    
    let handler = binaryOps[op]
    let left = translate node.value.left, scope, "expression"
    let right = translate node.value.right, scope, "expression"
    if typeof handler == "function"
      autoReturn handler(left, right, scope)
    else if typeof handler == "string"
      autoReturn ast.Binary(left, handler, right)
    else
      throw Error "Unexpected handler type: $(typeof! handler)"
  block: #(node, scope, location, autoReturn)
    ast.Block translateArray(node.value, scope, location, autoReturn)
  "break": #(node) -> ast.Break()
  callchain: do
    let linkTypes = {
      access: do
        let indexTypes = {
          single: #(child, scope) -> #(parent)
            ast.Access parent, translate child.node, scope, "expression"
          slice: #(child, scope) -> #(parent)
            let left = child.left
            let right = child.right
            let args = [parent]
            if left or right
              args.push if left then translate(left, scope, "expression") else ast.Const(0)
            if right
              args.push translate right, scope, "expression"
            scope.addHelper "__slice"
            ast.Call(ast.Ident("__slice"), args)
          multi: #(child, scope) -> #(parent)
            async setParent, parent <- scope.maybeCache parent
            let elements = translateArray child.elements, scope, "expression"
            ast.Arr for element, i in elements
              ast.Access(if i == 0 then setParent else parent, element)
        }
        #(links, link, scope, i, current)
          let makeAccess = if link.type == "access"
            #(parent) -> ast.Access parent, translate link.child, scope, "expression"
          else if link.type == "index"
            unless indexTypes ownskey link.child.type
              throw Error "Unknown index type: $(link.child.type)"
            indexTypes[link.child.type](link.child, scope)
          else
            throw Error "Unknown link type: $(link.type)"
        
          unless link.existential
            handle links, scope, i + 1, makeAccess(current)
          else
            async setObj, obj <- scope.maybeCache current
            ast.If(
              ast.Binary setObj, "!=", ast.Const(null)
              handle links, scope, i + 1, makeAccess(obj))
      index: #(...args)
        linkTypes.access.apply this, args
      call: do
        let handleSpreadCall(func, array, isNew, scope)
          if isNew
            scope.addHelper "__new"
            ast.Call ast.Ident("__new"), [func, array]
          else if func instanceof ast.Binary and func.op == "."
            async setParent, parent <- scope.maybeCache func.left
            ast.Call(
              ast.Access(ast.Access(setParent, func.right), ast.Const("apply"))
              [parent, array])
          else
            ast.Call(
              ast.Access(func, ast.Const("apply"))
              [ast.Const(undefined), array])
        
        let makeCall(func, args, isNew, scope)
          let mutable current = []
          let translatedArgs = [current]
          for arg in args
            if arg.type == "spread"
              current := []
              translatedArgs.push(
                translate arg.value, scope, "expression"
                current)
            else
              current.push translate arg, scope, "expression"
          
          if translatedArgs.length == 1
            ast.Call func, translatedArgs[0], isNew
          else
            for i = translatedArgs.length - 1, -1, -1
              let translatedArg = translatedArgs[i]
              if i %% 2
                if translatedArg.length > 0
                  translatedArgs[i] := ast.Arr translatedArg
                else
                  translatedArgs.splice i, 1
              else
                unless translatedArg.type().isSubsetOf types.array
                  scope.addHelper "__slice" // FIXME, these shouldn't be required to specify
                  scope.addHelper "__isArray"
                  scope.addHelper "__toArray"
                  translatedArgs[i] := ast.Call(
                    ast.Ident("__toArray")
                    [translatedArg])
            let array = if translatedArgs.length == 1
              translatedArgs[0]
            else
              ast.Call(
                ast.Access(
                  translatedArgs[0],
                  ast.Const("concat"))
                translatedArgs[1:])
            handleSpreadCall func, array, isNew, scope
        
        #(links, link, scope, i, current)
          unless link.existential
            handle links, scope, i + 1, makeCall(current, link.args, link.isNew, scope)
          else
            if current instanceof ast.Binary and current.op == "."
              async setParent, parent <- scope.maybeCache current.left
              async setChild, child <- scope.maybeCache current.right
              ast.If(
                ast.Binary(
                  ast.Unary "typeof", ast.Access(setParent, setChild)
                  "==="
                  ast.Const("function"))
                handle links, scope, i + 1, makeCall(ast.Access(parent, child), link.args, link.isNew, scope))
            else
              async setFunc, func <- scope.maybeCache current
              ast.If(
                ast.Binary(
                  ast.Unary("typeof", setFunc)
                  "==="
                  ast.Const("function"))
                handle links, scope, i + 1, makeCall(func, link.args, link.isNew, scope))
      "?": #(links, link, scope, i, current)
        async setLeft, left <- scope.maybeCache current
        ast.IfExpression(
          ast.Binary setLeft, "!=", ast.Const(null)
          left
          translate link.child, scope, "expression")
    }
    
    let handle(links, scope, i, current)
      if i >= links.length
        current
      else
        let link = links[i]
        unless link?
          throw Error "Encounted null callchain link at index #$i"
        
        unless linkTypes ownskey link.type
          throw Error "Unknown callchain link: $(link.type)"
        
        linkTypes[link.type](links, link, scope, i, current)
    
    #(node, scope, location, autoReturn)
      autoReturn handle node.value.links, scope, 0, translate(node.value.head, scope, "expression")
  
  const: #(node, scope, location, autoReturn) -> autoReturn ast.Const(node.value)
  continue: # -> ast.Continue()
  debugger: #(node, scope, location, autoReturn)
    if location == "expression"
      ast.Call(
        ast.Func(null, [], [], [ast.Debugger()])
        [])
    else
      ast.Debugger()
  definehelper: #(node, scope, location, autoReturn)
    let name = translate node.value.name, scope, "leftexpression"
    unless name instanceof ast.Ident
      throw Error "Expected name to be an Ident, got $(typeof! name)"
    let value = translate node.value.value, scope, "expression"
    HELPERS[name.name] := #-> value
    module.exports.knownHelpers.push(name.name)
    ast.BlockExpression()
  eval: #(node, scope, location, autoReturn)
    autoReturn ast.Eval translate(node.value, scope, "expression")
  for: #(node, scope, location, autoReturn)
    ast.For(
      if node.value.init? then translate node.value.init, scope, "expression"
      if node.value.test? then translate node.value.test, scope, "expression"
      if node.value.step? then translate node.value.step, scope, "expression"
      translate node.value.body, scope, "statement")
  forin: #(node, scope, location, autoReturn)
    let key = translate node.value.key, scope, "leftexpression"
    if key not instanceof ast.Ident
      throw Error("Expected an Ident for a for-in key")
    scope.addVariable key
    ast.ForIn(
      key
      translate node.value.object, scope, "expression"
      translate node.value.body, scope, "statement")
  function: do
    let primitiveTypes = {
      "Boolean": "boolean"
      "String": "string"
      "Number": "number"
      "Function": "function"
    }
    let makeTypeCheckTest(ident, type, scope)
      if primitiveTypes ownskey type
        ast.Binary(
          ast.Unary "typeof", ident
          "!=="
          ast.Const primitiveTypes[type])
      else if type == "Array"
        scope.addHelper "__isArray"
        ast.Unary(
          "!"
          ast.Call(
            ast.Ident("__isArray")
            [ident]))
      else
        ast.Unary(
          "!"
          ast.Binary(
            ident
            "instanceof"
            ast.Ident(type)))
    let translateTypeChecks = {
      ident: #(ident, value, scope, hasDefaultValue, arrayIndex)
        let access = if arrayIndex?
          ast.Access(ident, arrayIndex)
        else
          ident
        scope.addHelper "__typeof"
        let result = ast.If(
          makeTypeCheckTest access, value, scope
          ast.Throw(
            ast.Call(
              ast.Ident("TypeError")
              [if arrayIndex?
                ast.Concat(
                  ast.Const("Expected $(ident.name)[")
                  arrayIndex
                  ast.Const("] to be a $(value), got ")
                  ast.Call(
                    ast.Ident("__typeof")
                    [access]))
              else
                ast.Concat(
                  ast.Const("Expected $(ident.name) to be a $(value), got ")
                  ast.Call(
                    ast.Ident("__typeof")
                    [ident]))])))
        if not hasDefaultValue and value == "Boolean"
          ast.If(
            ast.Binary ident, "==", ast.Const(null)
            ast.Assign ident, ast.Const(false)
            result)
        else
          result
      access: #(ident, value, scope, hasDefaultValue, arrayIndex)
        let access = if arrayIndex?
          ast.Access(ident, arrayIndex)
        else
          ident
        scope.addHelper "__typeof"
        let type = translate({ type: "access", value }, scope, "expression")
        ast.If(
          ast.Unary(
            "!"
            ast.Binary(
              access
              "instanceof"
              type))
          ast.Throw(
            ast.Call(
              ast.Ident("TypeError")
              [if arrayIndex?
                ast.Concat(
                  ast.Const("Expected $(ident.name)[")
                  arrayIndex
                  ast.Const("] to be a $(type.right.value), got ")
                  ast.Call(
                    ast.Ident("__typeof")
                    [access]))
              else
                ast.Concat(
                  ast.Const("Expected $(ident.name) to be a $(type.right.value), got ")
                  ast.Call(
                    ast.Ident("__typeof")
                    [ident]))])))
      typeunion: #(ident, value, scope, hasDefaultValue, arrayIndex)
        // TODO: cache typeof ident if requested more than once.
        if arrayIndex?
          throw Error "Not implemented: typeunion in typearray"
        scope.addHelper "__typeof"
        let mutable check = void
        let mutable hasBoolean = false
        let mutable hasVoid = false
        let mutable hasNull = false
        let names = []
        let tests = []
        for type in value
          if type.type == "const"
            if type.value == null
              hasNull := true
              names.push "null"
            else if type.value == void
              hasVoid := true
              names.push "undefined"
            else
              throw Error "Unknown const value for typechecking: $(String type.value)"
          else
            if type.type != "ident"
              throw Error "Not implemented: typechecking for non-idents/consts within a typeunion"
            if type.value == "Boolean"
              hasBoolean := true
            names.push type.value
            tests.push makeTypeCheckTest ident, type.value, scope
        
        if hasNull and hasVoid and not hasDefaultValue
          tests.unshift ast.Binary ident, "!=", ast.Const(null)
        let mutable result = ast.If(
          ast.And ...tests
          ast.Throw(
            ast.Call(
              ast.Ident("TypeError")
              [ast.Concat(
                ast.Const("Expected $(ident.name) to be a $(names.join ' or '), got ")
                ast.Call(
                  ast.Ident("__typeof")
                  [ident]))])))
        
        if not hasDefaultValue
          if hasNull or hasVoid
            if hasNull xor hasVoid
              result := ast.If(
                ast.Binary ident, "==", ast.Const(null)
                ast.Assign ident, ast.Const(if hasNull then null else void)
                result)
          else if hasBoolean
            result := ast.If(
              ast.Binary ident, "==", ast.Const(null)
              ast.Assign ident, ast.Const(false)
              result)
        result
      typearray: #(ident, value, scope, hasDefaultValue, arrayIndex)
        if arrayIndex
          throw Error "Not implemented: arrays within arrays as types"
        scope.addHelper "__isArray"
        let index = scope.reserveIdent()
        let length = scope.reserveIdent()
        ast.If(
          ast.Unary(
            "!"
            ast.Call(
              ast.Ident("__isArray")
              [ident]))
          ast.Throw(
            ast.Call(
              ast.Ident("TypeError")
              [ast.Concat(
                ast.Const("Expected $(ident.name) to be an Array, got ")
                ast.Call(
                  ast.Ident("__typeof")
                  [ident]))]))
          ast.For(
            ast.Block [
              ast.Assign index, ast.Const 0
              ast.Assign length, ast.Access ident, ast.Const "length"
            ]
            ast.Binary(index, "<", length)
            ast.Unary("++", index)
            translateTypeCheck(ident, value, scope, false, index)))
    }
    let translateTypeCheck(ident, node, scope, hasDefaultValue, arrayIndex)
      unless translateTypeChecks ownskey node.type
        throw Error "Unknown type: $(String node.type)"
      
      translateTypeChecks[node.type] ident, node.value, scope, hasDefaultValue, arrayIndex
    let translateParamTypes = {
      param: #(param, scope, inner)
        let mutable ident = translate param.value.ident, scope, "param"
        if param.value.ident.type == "tmp"
          scope.markAsParam ident
        
        let laterInit = []
        if ident instanceof ast.Binary and ident.op == "." and ident.right instanceof ast.Const and typeof ident.right.value == "string"
          let tmp = ast.Ident ident.right.value
          laterInit.push ast.Binary(ident, "=", tmp)
          ident := tmp
        
        unless ident instanceof ast.Ident
          throw Error "Expecting param to be an Ident, got $(typeof! ident)"
        if inner
          scope.addVariable ident
        
        let init = []
        let typeCheck = if param.value.asType then translateTypeCheck(ident, param.value.asType, scope, param.value.defaultValue?)
        if param.value.defaultValue?
          init.push ast.If(
            ast.Binary ident, "==", ast.Const(null)
            ast.Assign ident, translate(param.value.defaultValue, scope, "expression")
            typeCheck)
        else if typeCheck
          init.push typeCheck
        {
          init: [...init, ...laterInit]
          ident
          spread: not not param.value.spread
        }
      
      array: #(array, scope, inner)
        let arrayIdent = if inner then scope.reserveIdent() else scope.reserveParam()
        let init = []
        let mutable foundSpread = -1
        let mutable spreadCounter = void
        for p, i, len in array.value
          let param = translateParam p, scope, true
          unless param.spread
            if foundSpread == -1
              init.push ast.Assign(
                param.ident
                ast.Access arrayIdent, ast.Const(i))
            else
              let diff = i - foundSpread - 1
              init.push ast.Assign(
                param.ident
                ast.Access(
                  arrayIdent
                  if diff == 0 then spreadCounter else ast.Binary spreadCounter, "+", ast.Const(diff)))
          else
            if foundSpread != -1
              throw Error "Encountered multiple spread parameters"
            foundSpread := i
            scope.addHelper "__slice"
            if i == len - 1
              init.push ast.Assign(
                param.ident
                ast.Call(
                  ast.Ident("__slice")
                  [arrayIdent, ...(if i == 0 then [] else [ast.Const(i)])]))
            else
              spreadCounter := scope.reserveIdent()
              init.push ast.Assign(
                param.ident
                ast.IfExpresion(
                  ast.Binary(
                    ast.Const(i)
                    "<"
                    ast.Assign(
                      spreadCounter
                      ast.Binary(
                        ast.Binary arrayIdent, ".", ast.Const("length")
                        "-"
                        ast.Const(len - i - 1))))
                  ast.Call(
                    ast.Ident "__slice"
                    [arrayIdent, ast.Const(i), spreadCounter])
                  ast.BlockExpression [
                    ast.Assign spreadCounter, ast.Const(i)
                    ast.Arr()]))
          init.push ...param.init
        if spreadCounter?
          scope.releaseIdent spreadCounter
        if inner
          scope.releaseIdent arrayIdent
        {
          init
          ident: arrayIdent
          spread: false
        }
      
      object: #(object, scope, inner)
        let objectIdent = if inner then scope.reserveIdent() else scope.reserveParam()
        let init = []
        
        for param in object.value
          let key = translate param.key, scope, "expression"
          unless key instanceof ast.Const
            throw Error "Unexpected non-const object key: $(typeof! key)"
          
          let value = translateParam param.value, scope, true
          scope.addVariable value.ident
          init.push ast.Assign(
            value.ident
            ast.Access objectIdent, key), ...value.init
        
        if inner
          scope.releaseIdent objectIdent
        
        {
          init
          ident: objectIdent
          spread: false
        }
    }
    
    let translateParam(param, scope, inner)
      let type = param.type
      unless translateParamTypes ownskey type
        throw Error "Unknown parameter type: $(type)"
      translateParamTypes[type](param, scope, inner)
    
    #(node, scope, location, autoReturn)
      let innerScope = scope.clone(node.value.bound)
      let paramIdents = []
      let initializers = []
      let mutable foundSpread = -1
      let mutable spreadCounter = void
      
      for p, i, len in node.value.params
        let param = translateParam p, innerScope, false
        unless param.spread
          if foundSpread == -1
            paramIdents.push param.ident
          else
            innerScope.addVariable param.ident
            let diff = i - foundSpread - 1
            initializers.push ast.Assign(
              param.ident
              ast.Access(
                ast.Arguments()
                if diff == 0 then spreadCounter else ast.Binary(spreadCounter, "+", ast.Const(diff))))
        else
          if foundSpread != -1
            throw Error "Encountered multiple spread parameters"
          foundSpread := i
          innerScope.addHelper "__slice"
          innerScope.addVariable param.ident
          if i == len - 1
            initializers.push ast.Assign(
              param.ident
              ast.Call(
                ast.Ident("__slice")
                [ast.Arguments(), ...(if i == 0 then [] else [ast.Const(i)])]))
          else
            spreadCounter := innerScope.reserveIdent()
            initializers.push ast.Assign(
              param.ident
              ast.IfExpression(
                ast.Binary(
                  ast.Const(i)
                  "<"
                  ast.Assign(
                    spreadCounter
                    ast.Binary(
                      ast.Binary ast.Arguments(), ".", ast.Const("length")
                      "-"
                      ast.Const(len - i - 1))))
                ast.Call(
                  ast.Ident "__slice"
                  [ast.Arguments(), ast.Const(i), spreadCounter])
                ast.BlockExpression [
                  ast.Assign spreadCounter, ast.Const(i)
                  ast.Arr()]))
        initializers.push ...param.init
      
      if spreadCounter
        innerScope.releaseIdent spreadCounter
      
      let mutable body = translate node.value.body, innerScope, "topstatement", node.value.autoReturn
      body := if body instanceofsome [ast.BlockExpression, ast.BlockStatement]
        body.body
      else
        [body]
      innerScope.releaseTmps()
      body := [...initializers, ...body]
      if innerScope.usedThis
        if innerScope.bound
          scope.usedThis := true
        if innerScope.hasBound and not innerScope.bound
          let fakeThis = ast.Ident "_this"
          innerScope.addVariable fakeThis
          body.unshift ast.Assign fakeThis, ast.This()
      let func = ast.Func null, paramIdents, innerScope.getVariables(), body
      autoReturn func
  ident: #(node, scope, location, autoReturn) -> autoReturn ast.Ident(node.value)
  if: #(node, scope, location, autoReturn)
    let innerLocation = if location in ["statement", "topstatement"]
      "statement"
    else
      location
    ast.If(
      translate node.value.test, scope, "expression"
      translate node.value.whenTrue, scope, innerLocation, autoReturn
      if node.value.whenFalse? then translate node.value.whenFalse, scope, innerLocation, autoReturn)
  index: #(node, scope, location, autoReturn)
    let type = node.value.child.type
    if type == "single"
      autoReturn ast.Access(
        translate node.value.parent, scope, "expression"
        translate node.value.child.node, scope, "expression")
    else if type == "multi"
      throw Error "Not implemented: index multi"
    else if type == "slice"
      throw Error "Not implemented: index slice"
    else
      throw Error "Unknown index type: $type"
  let: do
    let declarables = {
      declarable: #(node, scope)
        if node.value.ident.type == "declarable"
          translateDeclarable node.value.ident, scope
        else
          let ident = translate node.value.ident, scope, "leftexpression"
          scope.addVariable ident
          ident
    }
    let translateDeclarable(node, scope)
      unless declarables ownskey node.type
        throw Error "Unknown declarable type $(node.type)"
      declarables[node.type](node, scope)
    #(node, scope, location, autoReturn)
      let left = translateDeclarable node.value.left, scope
      let right = translate node.value.right, scope, "expression"
      if location == "topstatement" and left instanceof ast.Ident and right instanceof ast.Func and not right.name?
        scope.removeVariable left
        autoReturn ast.Func(left, right.params, right.variables, right.body, right.declarations)
      else
        autoReturn ast.Assign(left, right)
  macrohelper: #(node, scope, location, autoReturn)
    let value = node.value
    scope.addMacroHelper value
    autoReturn ast.Obj [
      ast.Obj.Pair "type", ast.Const("ident")
      ast.Obj.Pair "value", ast.Const(value)
    ]
  nothing: #-> ast.BlockExpression()
  object: #(node, scope, location, autoReturn)
    let constPairs = []
    let postConstPairs = []
    let mutable currentPairs = constPairs
    for element in node.value
      let key = translate element.key, scope, "expression"
      let value = translate element.value, scope, "expression"
      
      if key not instanceof ast.Const
        currentPairs := postConstPairs
      
      currentPairs.push { key, value }
    
    let obj = ast.Obj for pair in constPairs
      ast.Obj.Pair String(pair.key.value), pair.value
    
    if postConstPairs.length == 0
      autoReturn obj
    else
      let ident = scope.reserveIdent()
      let result = ast.BlockExpression [
        ast.Assign ident, obj
        ...for pair in postConstPairs
          ast.Assign(
            ast.Access(ident, pair.key)
            pair.value)
        ident
      ]
      scope.releaseIdent ident
      autoReturn result
  operator: do
    let makeNumOp(op) -> #(scope)
      let left = ast.Ident("x")
      let right = ast.Ident("y")
      ast.Func null, [left, right], [], [ast.Return(ast.Binary(
        numWrap left, scope
        op
        numWrap right, scope))]
    let operators = {
      "~^": #(scope) -> ast.Access ast.Ident("Math"), ast.Const("pow")
      "^": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          ast.Call(
            ast.Access ast.Ident("Math"), ast.Const("floor")
            [ast.Binary numWrap(left, scope), "/", numWrap(right, scope)]))]
      "*": makeNumOp "*"
      "/": makeNumOp "/"
      "%": makeNumOp "%"
      "\\": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          ast.Call(
            ast.Access ast.Ident("Math"), ast.Const("floor")
            [ast.Binary left, "/", right]))]
      "~+": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          ast.Unary "+", left
          "+"
          ast.Unary "+", right))]
      "+": makeNumOp "+"
      "-": makeNumOp "-"
      bitlshift: makeNumOp "<<"
      bitrshift: makeNumOp ">>"
      biturshift: makeNumOp ">>>"
      bitand: makeNumOp "&"
      bitor: makeNumOp "|"
      bitxor: makeNumOp "^"
      "~min": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, "<", right
          left
          right))]
      min: #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          binaryOps["<"](left, right)
          left
          right))]
      "~max": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, "<", right
          left
          right))]
      max: #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          binaryOps[">"](left, right)
          left
          right))]
      "~&": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          ast.Binary(
            ast.Const ""
            "+"
            left)
          "+"
          right))]
      "&": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          strnumWrap left, scope
          "+"
          strnumWrap right, scope))]
      in: #(scope)
        scope.addHelper "__in"
        ast.Ident "__in"
      haskey: #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Binary(
          ast.Binary right, "in", left))]
      ownskey: #(scope)
        scope.addHelper "__owns"
        ast.Ident "__owns"
      instanceofsome: #(scope)
        scope.addHelper "__instanceofsome"
        ast.Ident "__instanceofsome"
      "<=>": #(scope)
        scope.addHelper "__cmp"
        ast.Ident "__cmp"
      "~%%": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          binaryOps["~%%"](left, right, scope))]
      "%%": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          binaryOps["%%"](left, right, scope))]
      "!~%%": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          binaryOps["!~%%"](left, right, scope))]
      "!%%": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(
          binaryOps["!%%"](left, right, scope))]
      "<": #(scope)
        scope.addHelper "__lt"
        ast.Ident "__lt"
      "<=": #(scope)
        scope.addHelper "__lte"
        ast.Ident "__lte"
      ">": #(scope)
        scope.addHelper "__lte"
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Unary(
          "!"
          ast.Call ast.Ident("__lte"), [left, right]))]
      ">=": #(scope)
        scope.addHelper "__lt"
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.Unary(
          "!"
          ast.Call ast.Ident("__lt"), [left, right]))]
      xor: #(scope)
        scope.addHelper "__xor"
        ast.Ident "__xor"
      "?": #(scope)
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        ast.Func null, [left, right], [], [ast.Return(ast.IfExpression(
          ast.Binary left, "!=", ast.Const(null)
          left
          right))]
      bool: #(scope)
        let value = ast.Ident("x")
        ast.Func null, [value], [], [ast.Return(ast.Unary("!", ast.Unary("!", value)))]
      "typeof!": #(scope)
        scope.addHelper "__typeof"
        ast.Ident "__typeof"
      "num!": #(scope)
        scope.addHelper "__num"
        ast.Ident "__num"
      "str!": #(scope)
        scope.addHelper "__str"
        ast.Ident "__str"
      "strnum!": #(scope)
        scope.addHelper "__strnum"
        ast.Ident "__strnum"
      delete: #(scope)
        let object = ast.Ident("o")
        let key = ast.Ident("k")
        let ident = ast.Ident("v")
        ast.Func null, [object, key], [ident.name], [
          ast.Assign(ident, ast.Access(object, key))
          ast.Unary("delete", ast.Access(object, key))
          ast.Return(ident)]
      throw: #(scope)
        let error = ast.Ident("e")
        ast.Func null, [error], [], [
          ast.Throw(error)]
      "throw?": #(scope)
        let error = ast.Ident("e")
        ast.Func null, [error], [], [
          ast.IfStatement(
            ast.Binary(error, "!=", ast.Const(null))
            ast.Throw(error))]
    }
    #(node, scope, location, autoReturn)
      if operators ownskey node.value
        autoReturn operators[node.value](scope)
      else if binaryOps ownskey node.value and typeof binaryOps[node.value] == "string"
        let left = ast.Ident("x")
        let right = ast.Ident("y")
        autoReturn ast.Func(null, [left, right], [], [ast.Return(ast.Binary(left, binaryOps[node.value], right))])
      else if unaryOps ownskey node.value and typeof unaryOps[node.value] == "string"
        let value = ast.Ident("x")
        autoReturn ast.Func(null, [value], [], [ast.Return(ast.Unary(unaryOps[node.value], value))])
      else
        throw Error "Unknown operator: $(node.value)"
  paren: #(node, scope, location, autoReturn)
    translate node.value, scope, location, autoReturn
  regexp: #(node, scope, location, autoReturn)
    let text = translate node.value.text, scope, "expression"
    let flags = node.value.flags
    if text instanceof ast.Const and typeof text.value == "string"
      autoReturn ast.Const(RegExp(text.value, flags))
    else
      autoReturn ast.Call(
        ast.Ident("RegExp")
        [text, ast.Const(flags)])
  return: #(node, scope)
    let value = translate node.value.node, scope, "expression"
    if node.value.existential
      async setValue, value <- scope.maybeCache value
      ast.IfStatement(
        ast.Binary(
          setValue
          "!="
          ast.Const(null))
        ast.Return(value))
    else
      ast.Return(value)
  root: #(node, scope)
    let body = translate node.value, scope, "topstatement", scope.options.return
    let init = []
    if scope.hasBound and scope.usedThis
      let fakeThis = ast.Ident("_this")
      scope.addVariable fakeThis
      init.push ast.Assign fakeThis, ast.This()
    for helper in scope.getHelpers()
      unless HELPERS ownskey helper
        throw Error "Helper not defined: $helper"
      let ident = ast.Ident(helper)
      scope.addVariable ident
      init.push ast.Assign ident, HELPERS[helper]()
    ast.Root(
      [...init, body]
      scope.getVariables()
      ["use strict"])
  string: #(node, scope, location, autoReturn)
    let parts = node.value
    
    let mutable current = void
    for p in parts
      let part = if typeof p == "string"
        ast.Const p
      else
        translate p, scope, "expression"
      
      if current?
        current := ast.Binary current, "+", strnumWrap(part, scope)
      else
        current := strnumWrap(part, scope)
    unless current?
      current := ast.Const("")
    autoReturn current
  
  tmp: #(node, scope, location, autoReturn)
    autoReturn scope.getTmp(node.value)
  
  this: #(node, scope, location, autoReturn)
    scope.usedThis := true
    autoReturn if scope.bound
      ast.Ident("_this")
    else
      ast.This()
  
  trycatch: #(node, scope, location, autoReturn)
    ast.TryCatch(
      translate node.value.tryBody, scope, "statement", autoReturn
      translate node.value.catchIdent, scope, "leftexpression"
      translate node.value.catchBody, scope, "expression", autoReturn)
  
  tryfinally: #(node, scope, location, autoReturn)
    ast.TryFinally(
      translate node.value.tryBody, scope, "statement", autoReturn
      translate node.value.finallyBody, scope, "statement")
  
  unary: #(node, scope, location, autoReturn)
    let op = node.value.op
    unless unaryOps ownskey op
      throw Error "Unexpected unary operator: $(JSON.stringify op)"
    
    let handler = unaryOps[op]
    if typeof handler == "function"
      handler node, scope, location, autoReturn
    else if typeof handler == "string"
      autoReturn ast.Unary(handler, translate node.value.node, scope, "expression")
    else
      throw Error "Unexpected handler type: $(typeof! handler)"
  
  usemacro: #(node, scope, location, autoReturn)
    let result = translate node.value.node, scope, location, autoReturn
    for tmp in node.value.tmps
      scope.releaseTmp tmp
    
    for helper in node.value.macroHelpers
      scope.addHelper helper
    
    result
}

let translate(node as Object, scope as Scope, location as String, autoReturn)
  if typeof autoReturn != "function"
    autoReturn := makeAutoReturn autoReturn
  
  unless translators ownskey node.type
    throw Error "Unable to translate unknown node type: $(JSON.stringify node.type)"
  
  translators[node.type](node, scope, location, autoReturn)

let translateArray(nodes as Array, scope as Scope, location as String, autoReturn)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and autoReturn

module.exports := #(node, options = {})
  let scope = new Scope(options, false)
  let result = translate node, scope, "statement", false
  scope.releaseTmps()
  return {
    node: result
    macroHelpers: scope.getMacroHelpers()
  }

module.exports.knownHelpers := []
