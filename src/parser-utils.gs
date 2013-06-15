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
      if node.is-value
        if is-null! node.value
          Type.null
        else if is-void! node.value
          Type.undefined
        else
          // shouldn't really occur
          Type.any
      else
        throw Error "Unknown LispyNode: $(typeof! node)"
    else if node instanceof Node.Ident
      ident-to-type![node.name] or Type.any // TODO: possibly store types on scope
    else if node instanceof Node.TypeGeneric
      let basetype = node-to-type(node.basetype)
      let args = for arg in node.args; node-to-type(arg)
      if basetype in [Type.array, Type.function]
        Type.generic basetype.base, ...args
      else if basetype != Type.any
        Type.generic basetype, ...args
      else
        Type.any
    else if node instanceof Node.TypeUnion
      for reduce type in node.types by -1, current = Type.none
        current.union(node-to-type(type))
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
    if param.ident instanceofsome [Node.Ident, Node.Tmp]
      scope.add param.ident, force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else if param.ident instanceof Node.Access
      if not param.ident.child.is-const-type(\string)
        throw Error "Expected constant access: $(typeof! param.ident.child)"
      scope.add Node.Ident(param.index, param.scope, param.ident.child.value), force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else
      throw Error "Unknown param ident: $(typeof! param.ident)"
  else if param instanceof LispyNode and param.is-call and param.func.is-symbol and param.func.is-internal and param.func.is-array
    for element in param.args by -1
      add-param-to-scope scope, element, force-mutable
  else if param instanceof Node.Object
    for pair in param.pairs by -1
      add-param-to-scope scope, pair.value, force-mutable
  else if param not instanceof Node.Nothing
    throw Error "Unknown param node type: $(typeof! param)"

exports <<< {
  node-to-type
  map
  map-async
  add-param-to-scope
}