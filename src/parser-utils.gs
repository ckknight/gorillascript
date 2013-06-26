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
    if DEBUG
      require! ParserNode: './parser-nodes'
      if node not instanceof ParserNode
        throw TypeError("Expected a Node, got $(typeof! node)")
    switch node.node-type-id
    case ParserNodeTypeId.Value
      switch node.value
      case null; Type.null
      case void; Type.undefined
      default
        // shouldn't really occur
        Type.any
    case ParserNodeTypeId.Symbol
      if node.is-ident and ident-to-type ownskey node.name
        ident-to-type[node.name]
      else
        Type.any
    case ParserNodeTypeId.Call
      if node.is-internal-call()
        switch node.func.name
        case \type-union
          for reduce type in node.args, current = Type.none
            current.union node-to-type(type)
        case \type-generic
          let basetype = node-to-type(node.args[0])
          let args = for arg in node.args[1 to -1]; node-to-type(arg)
          if basetype in [Type.array, Type.function]
            Type.generic basetype.base, ...args
          else if basetype != Type.any
            Type.generic basetype, ...args
          else
            Type.any
        case \type-object
          let data = {}
          for i in 0 til node.args.length by 2
            let key = node.args[i]
            if key.is-const()
              data[key.const-value()] := node-to-type(node.args[i + 1])
          Type.make-object data
        default
          Type.any
      else
        Type.any
    default
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
  require! ParserNode: './parser-nodes'
  if DEBUG and param not instanceof ParserNode
    throw Error "Unknown param type: $(typeof! param)"
  if param.is-internal-call()
    if param.func.is-param
      let ident = param.args[0]
      let is-spread = param.args[2].const-value()
      let is-mutable = force-mutable or param.args[3].const-value()
      let as-type = param.args[4].convert-nothing(void)
      if ident.is-symbol and ident.is-ident-or-tmp
        scope.add ident, is-mutable, if as-type then node-to-type(as-type) else if is-spread then Type.array else Type.any
      else if ident.is-internal-call(\access)
        let [, child] = ident.args
        if not child.is-const-type(\string)
          throw Error "Expected constant access: $(typeof! child)"
        scope.add ParserNode.Symbol.ident(param.index, param.scope, child.value), is-mutable, if as-type then node-to-type(as-type) else if is-spread then Type.array else Type.any
      else
        throw Error "Unknown param ident: $(typeof! ident)"
    else if param.func.is-array
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