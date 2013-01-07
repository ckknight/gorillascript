require! './ast'
require! './types'
require! './parser'

let needs-caching(item)
  return item not instanceofsome [ast.Ident, ast.Const, ast.This, ast.Arguments]

class Scope
  def constructor(options = {}, bound = false, used-tmps = {}, helpers = {}, macro-helpers = {}, variables, tmps = {})@
    @options := options
    @bound := bound
    @used-tmps := used-tmps
    @helpers := helpers
    @macro-helpers := macro-helpers
    @variables := if variables then ^variables else {}
    @tmps := tmps
    @has-bound := false
    @used-this := false
  
  def maybe-cache(item as ast.Expression, func as Function)
    unless needs-caching item
      func item, item, false
    else
      let ident = @reserve-ident \ref
      let result = func ast.Assign(ident, item), ident, true
      @release-ident(ident)
      result
  
  def maybe-cache-access(item as ast.Expression, func as Function)
    if item instanceof ast.Binary and item.op == "."
      async set-left, left <- @maybe-cache item.left
      async set-right, right <- @maybe-cache item.right
      func(
        ast.Access set-left, set-right
        ast.Access left, right
        true)
    else
      func item, item, false
  
  def reserve-ident(name-part = \ref)
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_$(name-part)" else "_$(name-part)$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        let ident = ast.Ident name
        @add-variable ident
        return ident
  
  def reserve-param()
    // TODO: would be better as for first
    for i = 1, Infinity
      let name = if i == 1 then "_p" else "_p$i"
      unless @used-tmps haskey name
        @used-tmps[name] := true
        return ast.Ident name
  
  def get-tmp(id, name)
    let tmps = @tmps
    if tmps haskey id
      let tmp = tmps[id]
      if tmp instanceof ast.Ident
        return tmp
    tmps[id] := @reserve-ident name or \tmp
  
  def release-tmp(id)!
    if @tmps ownskey id
      // FIXME: change when delete can be used in an expression
      let ident = @tmps[id]
      delete @tmps[id]
      @release-ident(ident)
  
  def release-tmps()!
    for id of @tmps
      @release-tmp(id)
    @tmps := {}
  
  def release-ident(ident as ast.Ident)!
    
    unless @used-tmps ownskey ident.name
      if maybe
        return
      throw Error "Trying to release a non-reserved ident: $(ident.name)"
    
    delete @used-tmps[ident.name]
  
  def mark-as-param(ident as ast.Ident)!
    @remove-variable(ident)
  
  def add-helper(name)!
    @helpers[name] := true
  
  let lower-sorter(a, b) -> a.to-lower-case() <=> b.to-lower-case()
  
  def get-helpers()
    let helpers = for k of @helpers
      k
    
    helpers.sort lower-sorter
  
  def add-variable(ident as ast.Ident)!
    @variables[ident.name] := true
  
  def has-variable(ident as ast.Ident)
    if @variables[ident.name]
      @variables haskey ident.name
    else
      false
  
  def remove-variable(ident as ast.Ident)!
    delete @variables[ident.name]
  
  def get-variables()
    let variables = for k of @variables
      k
    
    variables.sort lower-sorter
  
  def clone(bound)
    if bound
      @has-bound := true
    Scope(@options, bound, ^@used-tmps, @helpers, @macro-helpers, @variables, ^@tmps)

let wrap-return(x)
  if x instanceof ast.Throw
    x
  else
    ast.Return x

let identity(x) -> x

let make-auto-return(x) -> if x then wrap-return else identity

let HELPERS = {}

let wrap-in-function-call(node)
  // TODO: the translator shouldn't be making parser.Nodes
  
  parser.Node.CallChain(node.start-index, node.end-index
    parser.Node.Function node.start-index, node.end-index, [], node, true, true
    [{
      type: \call
      args: []
      existential: false
    }])

let flatten-spread-array(elements)
  let result = []
  let mutable changed = false
  for element in elements
    if element instanceof parser.Node.Spread and element.node instanceof parser.Node.Array
      result.push ...element.node.elements
      changed := true
    else
      result.push element
  
  if changed
    flatten-spread-array result
  else
    elements

let array-translate(elements, scope, replace-with-slice)
  let translated-items = []
  let mutable current = []
  translated-items.push(current)
  for element in flatten-spread-array elements
    if element instanceof parser.Node.Spread
      translated-items.push translate element.node, scope, \expression
      current := []
      translated-items.push current
    else
      current.push translate element, scope, \expression
  
  if translated-items.length == 1
    ast.Arr translated-items[0]
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
      if replace-with-slice and array instanceof ast.Call and array.func instanceof ast.Ident and array.func.name == \__to-array
        ast.Call(ast.Ident(\__slice), array.args)
      else
        array
    else
      ast.Call(
        ast.Access translated-items[0], \concat
        translated-items[1:])

let translators = {
  Access: #(node, scope, location, auto-return)
    return auto-return ast.Access(
      translate node.parent, scope, \expression
      translate node.child, scope, \expression)
  
  Args: #(node, scope, location, auto-return)
    auto-return ast.Arguments()
  
  Array: #(node, scope, location, auto-return)
    auto-return array-translate node.elements, scope, true
  
  Assign: do
    let ops = {
      "="
      "*="
      "/="
      "%="
      "+="
      "-="
      "<<="
      ">>="
      ">>>="
      "&="
      "|="
      "^="
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
            if left and left not instanceof parser.Node.Nothing then translate(left, scope, \expression) else ast.Const(0)
            if right and right not instanceof parser.Node.Nothing then translate(right, scope, \expression) else ast.Const(Infinity)
            value
          ])
      multi: #(parent, child, value, scope, location)
        async set-parent, parent <- scope.maybe-cache parent
        async set-value, value <- scope.maybe-cache value
        let elements = translate-array child.elements, scope, \expression
        let lines = for element, i in elements
          ast.Assign(
            ast.Access if i == 0 then set-parent else parent, element
            ast.Access if i == 0 then set-value else value, i)
        if location == \expression
          lines.push value
        ast.Block lines
    }
    #(node, scope, location, auto-return)
      let op = node.op
      // TODO: this is ugly
      if op in "=" and node.left instanceof parser.Node.AccessIndex
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
  
  Binary: #(node, scope, location, auto-return)
    auto-return ast.Binary(
      translate node.left, scope, \expression
      node.op
      translate node.right, scope, \expression)
  
  Block: #(node, scope, location, auto-return)
    ast.Block translate-array(node.nodes, scope, location, auto-return)
  
  Break: #(node) -> ast.Break()
  
  CallChain: do
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
          else if link.type == \access-index
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
              ast.Binary set-obj, "!=", null
              handle links, scope, i + 1, make-access(obj))
      access-index: #(...args)
        link-types.access@ this, ...args
      call: do
        let make-call(func, mutable args, is-new, is-apply, scope)
          let mutable this-arg = void
          if is-apply and (args.length == 0 or args[0] not instanceof parser.Node.Spread)
            let start = if args.length == 0 then ast.Const(void) else translate args[0], scope, \expression
            let arg-array = array-translate args[1:], scope, false
            if arg-array instanceof ast.Arr
              ast.Call(
                ast.Access func, \call
                [start, ...arg-array.elements])
            else
              ast.Call(
                ast.Access func, \apply
                [start, arg-array])
          else
            let arg-array = array-translate args, scope, false
            
            if is-apply
              async set-array, array <- scope.maybe-cache arg-array
              scope.add-helper \__slice
              ast.Call(
                ast.Access func, \apply
                [
                  ast.Access set-array, 0
                  ast.Call(
                    ast.Ident \__slice
                    [array, ast.Const 1])])
            else if arg-array instanceof ast.Arr
              ast.Call(
                func
                arg-array.elements
                is-new)
            else if is-new
              scope.add-helper \__new
              ast.Call ast.Ident(\__new), [func, arg-array]
            else if func instanceof ast.Binary and func.op == "."
              async set-parent, parent <- scope.maybe-cache func.left
              ast.Call(
                ast.Access ast.Access(set-parent, func.right), \apply
                [parent, arg-array])
            else
              ast.Call(
                ast.Access func, \apply
                [ast.Const(void), arg-array])
        
        #(links, link, scope, i, current)
          if link.is-new and link.is-apply
            throw Error "Cannot have a call link with both is-new and is-apply"
          
          unless link.existential
            handle links, scope, i + 1, make-call(current, link.args, link.is-new, link.is-apply, scope)
          else
            if current instanceof ast.Binary and current.op == "."
              async set-parent, parent <- scope.maybe-cache current.left
              async set-child, child <- scope.maybe-cache current.right
              ast.If(
                ast.Binary(
                  ast.Unary \typeof, ast.Access(set-parent, set-child)
                  "==="
                  \function)
                handle links, scope, i + 1, make-call(ast.Access(parent, child), link.args, link.is-new, link.is-apply, scope))
            else
              async set-func, func <- scope.maybe-cache current
              ast.If(
                ast.Binary(
                  ast.Unary \typeof, set-func
                  "==="
                  \function)
                handle links, scope, i + 1, make-call(func, link.args, link.is-new, link.is-apply, scope))
      "?": #(links, link, scope, i, current)
        async set-left, left <- scope.maybe-cache current
        ast.IfExpression(
          ast.Binary set-left, "!=", null
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
  
  Const: #(node, scope, location, auto-return) -> auto-return ast.Const(node.value)
  
  Continue: # -> ast.Continue()
  
  Debugger: #(node, scope, location, auto-return)
    if location == \expression
      ast.Call(
        ast.Func(null, [], [], [ast.Debugger()])
        [])
    else
      ast.Debugger()
  
  Def: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray def"
  
  DefineHelper: #(node, scope, location, auto-return)
    let ident = translate node.name, scope, \left-expression
    unless ident instanceof ast.Ident
      throw Error "Expected name to be an Ident, got $(typeof! ident)"
    let value = translate node.value, scope, \expression
    HELPERS[ident.name] := #-> value
    KNOWN_HELPERS.push(ident.name)
    ast.BlockExpression()
  
  Eval: #(node, scope, location, auto-return)
    auto-return ast.Eval translate(node.code, scope, \expression)
  
  For: #(node, scope, location, auto-return)
    ast.For(
      if node.init? then translate node.init, scope, \expression
      if node.test? then translate node.test, scope, \expression
      if node.step? then translate node.step, scope, \expression
      translate node.body, scope, \statement)
  
  ForIn: #(node, scope, location, auto-return)
    let key = translate node.key, scope, \left-expression
    if key not instanceof ast.Ident
      throw Error("Expected an Ident for a for-in key")
    scope.add-variable key
    ast.ForIn(
      key
      translate node.object, scope, \expression
      translate node.body, scope, \statement)
  
  Function: do
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
          primitive-types[type])
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
      Ident: #(ident, node, scope, has-default-value, array-index)
        let access = if array-index?
          ast.Access ident, array-index
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
                  "Expected $(ident.name)["
                  array-index
                  "] to be a $(node.name), got "
                  ast.Call(
                    ast.Ident(\__typeof)
                    [access]))
              else
                ast.Concat(
                  "Expected $(ident.name) to be a $(node.name), got "
                  ast.Call(
                    ast.Ident(\__typeof)
                    [ident]))])))
        if not has-default-value and node.name == \Boolean
          ast.If(
            ast.Binary ident, "==", null
            ast.Assign ident, ast.Const(false)
            result)
        else
          result
      Access: #(ident, node, scope, has-default-value, array-index)
        let access = if array-index?
          ast.Access ident, array-index
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
                  "Expected $(ident.name)["
                  array-index
                  "] to be a $(type.right.value), got "
                  ast.Call(
                    ast.Ident(\__typeof)
                    [access]))
              else
                ast.Concat(
                  "Expected $(ident.name) to be a $(type.right.value), got "
                  ast.Call(
                    ast.Ident(\__typeof)
                    [ident]))])))
      TypeUnion: #(ident, node, scope, has-default-value, array-index)
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
          if type instanceof parser.Node.Const
            if type.value == null
              has-null := true
              names.push \null
            else if type.value == void
              has-void := true
              names.push \undefined
            else
              throw Error "Unknown const value for typechecking: $(String type.value)"
          else if type instanceof parser.Node.Ident
            if type.name == \Boolean
              has-boolean := true
            names.push type.name
            tests.push make-type-check-test ident, type.name, scope
          else
            throw Error "Not implemented: typechecking for non-idents/consts within a type-union"
        
        if has-null and has-void and not has-default-value
          tests.unshift ast.Binary ident, "!=", null
        let mutable result = ast.If(
          ast.And ...tests
          ast.Throw(
            ast.Call(
              ast.Ident(\TypeError)
              [ast.Concat(
                "Expected $(ident.name) to be a $(names.join ' or '), got "
                ast.Call(
                  ast.Ident(\__typeof)
                  [ident]))])))
        
        if not has-default-value
          if has-null or has-void
            if has-null xor has-void
              result := ast.If(
                ast.Binary ident, "==", null
                ast.Assign ident, ast.Const(if has-null then null else void)
                result)
          else if has-boolean
            result := ast.If(
              ast.Binary ident, "==", null
              ast.Assign ident, ast.Const(false)
              result)
        result
      TypeArray: #(ident, node, scope, has-default-value, array-index)
        if array-index
          throw Error "Not implemented: arrays within arrays as types"
        scope.add-helper \__is-array
        let index = scope.reserve-ident \i
        let length = scope.reserve-ident \len
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
                "Expected $(ident.name) to be an Array, got "
                ast.Call(
                  ast.Ident(\__typeof)
                  [ident]))]))
          ast.For(
            ast.Block [
              ast.Assign index, ast.Const 0
              ast.Assign length, ast.Access ident, \length
            ]
            ast.Binary index, "<", length
            ast.Unary "++", index
            translate-type-check(ident, node.subtype, scope, false, index)))
    }
    let translate-type-check(ident, node, scope, has-default-value, array-index)
      unless translate-type-checks ownskey node.constructor.capped-name
        throw Error "Unknown type: $(String node.constructor.capped-name)"
      
      translate-type-checks[node.constructor.capped-name] ident, node, scope, has-default-value, array-index
    let translate-param-types = {
      Param: #(param, scope, inner)
        let mutable ident = translate param.ident, scope, \param
        if param.ident instanceof parser.Node.Tmp
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
            ast.Binary ident, "==", null
            ast.Assign ident, translate(param.default-value, scope, \expression)
            type-check)
        else if type-check
          init.push type-check
        {
          init: [...init, ...later-init]
          ident
          spread: not not param.spread
        }
      
      Array: #(array, scope, inner)
        let array-ident = if inner then scope.reserve-ident \p else scope.reserve-param()
        let init = []
        let mutable found-spread = -1
        let mutable spread-counter = void
        for p, i, len in array.elements
          let param = translate-param p, scope, true
          unless param.spread
            if found-spread == -1
              init.push ast.Assign(
                param.ident
                ast.Access array-ident, i)
            else
              let diff = i - found-spread - 1
              init.push ast.Assign(
                param.ident
                ast.Access(
                  array-ident
                  if diff == 0 then spread-counter else ast.Binary spread-counter, "+", diff))
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
              spread-counter := scope.reserve-ident \ref
              init.push ast.Assign(
                param.ident
                ast.IfExpresion(
                  ast.Binary(
                    i
                    "<"
                    ast.Assign(
                      spread-counter
                      ast.Binary(
                        ast.Access array-ident, \length
                        "-"
                        len - i - 1)))
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
      
      Object: #(object, scope, inner)
        let object-ident = if inner then scope.reserve-ident \p else scope.reserve-param()
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
      let type = param.constructor.capped-name
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
                if diff == 0 then spread-counter else ast.Binary(spread-counter, "+", diff)))
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
            spread-counter := inner-scope.reserve-ident \ref
            initializers.push ast.Assign(
              param.ident
              ast.IfExpression(
                ast.Binary(
                  i
                  "<"
                  ast.Assign(
                    spread-counter
                    ast.Binary(
                      ast.Access ast.Arguments(), \length
                      "-"
                      len - i - 1)))
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
  
  Ident: #(node, scope, location, auto-return)
    let name = node.name
    if name.length > 2 and name.charCodeAt(0) == "_".charCodeAt(0) and name.charCodeAt(1) == "_".charCodeAt(0)
      scope.add-helper name
    auto-return ast.Ident(name)
  
  If: #(node, scope, location, auto-return)
    let inner-location = if location in [\statement, \top-statement]
      \statement
    else
      location
    ast.If(
      translate node.test, scope, \expression
      translate node.when-true, scope, inner-location, auto-return
      if node.when-false? then translate node.when-false, scope, inner-location, auto-return)
  
  AccessIndex: #(node, scope, location, auto-return)
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
  
  Let: do
    let declarables = {
      Declarable: #(node, scope)
        if node.ident instanceof parser.Node.Declarable
          translate-declarable node.ident, scope
        else
          let ident = translate node.ident, scope, \left-expression
          scope.add-variable ident
          ident
    }
    let translate-declarable(node, scope)
      unless declarables ownskey node.constructor.capped-name
        throw Error "Unknown declarable type $(node.constructor.capped-name)"
      declarables[node.constructor.capped-name](node, scope)
    #(node, scope, location, auto-return)
      let left = translate-declarable node.left, scope
      let right = translate node.right, scope, \expression
      if location == \top-statement and left instanceof ast.Ident and right instanceof ast.Func and not right.name?
        scope.remove-variable left
        auto-return ast.Func(left, right.params, right.variables, right.body, right.declarations)
      else
        auto-return ast.Assign(left, right)
  
  Nothing: #-> ast.BlockExpression()
  
  Object: #(node, scope, location, auto-return)
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
      let ident = scope.reserve-ident \o
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
  
  Regexp: #(node, scope, location, auto-return)
    let text = translate node.text, scope, \expression
    let flags = node.flags
    if text instanceof ast.Const and typeof text.value == \string
      auto-return ast.Const(RegExp(text.value, flags))
    else
      auto-return ast.Call(
        ast.Ident(\RegExp)
        [text, ast.Const(flags)])
  
  Return: #(node, scope)
    let value = translate node.node, scope, \expression
    if node.existential
      async set-value, value <- scope.maybe-cache value
      ast.IfStatement(
        ast.Binary set-value, "!=", null
        ast.Return value)
    else
      ast.Return value
  
  Root: #(node, scope)
    let body = translate node.body, scope, \top-statement, scope.options.return
    let init = []
    if scope.has-bound and scope.used-this
      let fake-this = ast.Ident(\_this)
      scope.add-variable fake-this
      init.push ast.Assign fake-this, ast.This()
    for helper in scope.get-helpers()
      if HELPERS ownskey helper
        let ident = ast.Ident(helper)
        scope.add-variable ident
        init.push ast.Assign ident, HELPERS[helper]()
    
    if scope.options.bare
      ast.Root(
        [...init, body]
        scope.get-variables()
        ["use strict"])
    else
      let mutable call-func = ast.Call(
        ast.Access(
          ast.Func(
            null
            []
            scope.get-variables()
            [...init, body]
            ["use strict"])
          \call)
        [ast.This()])
      if scope.options.return
        call-func := ast.Return(call-func)
      ast.Root(
        [call-func]
        []
        [])
  
  String: #(node, scope, location, auto-return)
    let parts = node.parts
  
    let mutable current = void
    for p in parts
      let mutable part = if typeof p == \string
        ast.Const p
      else
        translate p, scope, \expression
      
      if not part.type().is-subset-of(types.string)
        if part.type().is-subset-of(types.string-or-number)
          if not current?
            current := ast.Const ""
        else
          scope.add-helper \__strnum
          part := ast.Call ast.Ident(\__strnum), [part]
      
      current := if current?
        ast.Binary current, "+", part
      else
        part
    unless current?
      current := ast.Const("")
    auto-return current
  
  Super: #(node, scope, location, auto-return)
    // TODO: line numbers
    throw Error "Cannot have a stray super call"
  
  Tmp: #(node, scope, location, auto-return)
    auto-return scope.get-tmp(node.id, node.name)
  
  This: #(node, scope, location, auto-return)
    scope.used-this := true
    auto-return if scope.bound
      ast.Ident(\_this)
    else
      ast.This()
  
  Throw: #(node, scope, location)    
    // TODO: the expression handling _should_ be handled through the operator in prelude.ms
    if location == \expression
      translate wrap-in-function-call(node), scope, \expression
    else
      ast.Throw(translate node.node, scope, \expression)
  
  TryCatch: #(node, scope, location, auto-return)
    ast.TryCatch(
      translate node.try-body, scope, \statement, auto-return
      translate node.catch-ident, scope, \left-expression
      translate node.catch-body, scope, \expression, auto-return)
  
  TryFinally: #(node, scope, location, auto-return)
    ast.TryFinally(
      translate node.try-body, scope, \statement, auto-return
      translate node.finally-body, scope, \statement)
  
  Unary: #(node, scope, location, auto-return)
    auto-return ast.Unary(
      node.op
      translate node.node, scope, \expression)
  
  UseMacro: #(node, scope, location, auto-return)
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
  
  unless translators ownskey node.constructor.capped-name
    throw Error "Unable to translate unknown node type: $(String node.constructor.capped-name)"
  
  let ret = translators[node.constructor.capped-name](node, scope, location, auto-return)
  if ret not instanceofsome [ast.Node, ast.Root]
    throw Error "Translated non-node: $(typeof! ret)"
  ret

let translate-array(nodes as Array, scope as Scope, location as String, auto-return)
  return for node, i, len in nodes
    translate nodes[i], scope, location, i == len - 1 and auto-return

module.exports := #(node, options = {})
  let scope = Scope(options, false)
  let result = translate node, scope, \statement, false
  scope.release-tmps()
  return {
    node: result
    macro-helpers: []
  }

let KNOWN_HELPERS = module.exports.known-helpers := []
