import 'shared.gs'

require! Type: './types'

let node-to-type = do
  let ident-to-type = {
    Boolean: Type.boolean
    String: Type.string
    Number: Type.number
    Array: Type.array
    Object: Type.object
    Function: Type.function
    RegExp: Type.regexp
    Date: Type.date
    Error: Type.error
    RangeError: Type.error
    ReferenceError: Type.error
    SyntaxError: Type.error
    TypeError: Type.error
    URIError: Type.error
  }
  #(node)
    require! Node: './parser-nodes'
    require! LispyNode: './parser-lispynodes'
    if node not instanceof Node
      throw TypeError("Expected a Node, got $(typeof! node)")
    if node instanceof LispyNode
      switch
      case node.is-value
        switch node.value
        case null; Type.null
        case void; Type.undefined
        default
          // shouldn't really occur
          Type.any
      case node.is-symbol and node.is-ident
        if ident-to-type ownskey node.name
          ident-to-type[node.name]
        else
          node.type()
      case node.is-internal-call(\type-union)
        for reduce type in node.args, current = Type.none
          current.union node-to-type(type)
      case node.is-internal-call(\type-generic)
        let basetype = node-to-type(node.args[0])
        let args = for arg in node.args[1 to -1]; node-to-type(arg)
        if basetype in [Type.array, Type.function]
          Type.generic basetype.base, ...args
        else if basetype != Type.any
          Type.generic basetype, ...args
        else
          Type.any
      default
        Type.any
    else if node instanceof Node.TypeObject
      let data = {}
      for {key, value} in node.pairs
        if key instanceof LispyNode and key.is-value
          data[key.value] := node-to-type(value)
      Type.make-object data
    else
      // shouldn't really occur
      Type.any

let map(array, func, context)
  let result = []
  let mutable changed = false
  for item in array
    let new-item = func@ context, item
    result.push new-item
    if item != new-item
      changed := true
  if changed
    result
  else
    array

let map-async(array, func, context, callback)
  let mutable changed = false
  asyncfor err, result <- next, item in array
    async! next, new-item <- func@ context, item
    if item != new-item
      changed := true
    next null, new-item
  if err?
    callback err
  else
    callback null, if changed
      result
    else
      array

let add-param-to-scope(scope, param, force-mutable)!
  require! Node: './parser-nodes'
  require! LispyNode: './parser-lispynodes'
  if param instanceof Node.Param
    if param.ident instanceofsome [LispyNode.Symbol.ident, LispyNode.Symbol.tmp]
      scope.add param.ident, force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else if param.ident instanceof LispyNode and param.ident.is-internal-call(\access)
      let [, child] = param.ident.args
      if not child.is-const-type(\string)
        throw Error "Expected constant access: $(typeof! child)"
      scope.add LispyNode.Symbol.ident(param.index, param.scope, child.value), force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else
      throw Error "Unknown param ident: $(typeof! param.ident)"
  else if param instanceof LispyNode
    if param.is-internal-call()
      if param.func.is-array
        for element in param.args by -1
          add-param-to-scope scope, element, force-mutable
      else if param.func.is-object
        for element in param.args[-1 to 1 by -1]
          add-param-to-scope scope, element.args[1], force-mutable
    else if not (param.is-symbol and param.is-internal and param.is-nothing)
      throw Error "Unknown param node type: $(typeof! param)"

exports <<< {
  node-to-type
  map
  map-async
  add-param-to-scope
}