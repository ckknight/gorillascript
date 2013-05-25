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
    if node not instanceof Node
      throw TypeError("Expected a Node, got $(typeof! node)")
    if node instanceof Node.Ident
      ident-to-type![node.name] or Type.any // TODO: possibly store types on scope
    else if node instanceof Node.Const
      if is-null! node.value
        Type.null
      else if is-void! node.value
        Type.undefined
      else
        // shouldn't really occur
        Type.any
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
        if key instanceof Node.Const
          data[key.value] := node-to-type(value)
      Type.make-object data
    else
      // shouldn't really occur
      Type.any

let map(array, func, arg)
  let result = []
  let mutable changed = false
  for item in array
    let new-item = func item, arg
    result.push new-item
    if item != new-item
      changed := true
  if changed
    result
  else
    array

let map-async(array, func, ...args, callback)
  let mutable changed = false
  asyncfor err, result <- next, item in array
    async! next, new-item <- func item, ...args
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
  if param instanceof Node.Param
    if param.ident instanceofsome [Node.Ident, Node.Tmp]
      scope.add param.ident, force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else if param.ident instanceof Node.Access
      if param.ident.child not instanceof Node.Const or not is-string! param.ident.child.value
        throw Error "Expected constant access: $(typeof! param.ident.child)"
      scope.add Node.Ident(param.index, param.scope, param.ident.child.value), force-mutable or param.is-mutable, if param.as-type then node-to-type(param.as-type) else if param.spread then Type.array else Type.any
    else
      throw Error "Unknown param ident: $(typeof! param.ident)"
  else if param instanceof Node.Array
    for element in param.elements by -1
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