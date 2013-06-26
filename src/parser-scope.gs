import 'shared.gs'

require! Type: './types'
require! ParserNode: './parser-nodes'

let Ident = ParserNode.Symbol.ident
let Tmp = ParserNode.Symbol.tmp

class ScopeDestroyedError extends Error
  def constructor(@message as String = "Scope already destroyed")
    let err = super(@message)
    if is-function! Error.capture-stack-trace
      Error.capture-stack-trace this, ScopeDestroyedError
    else if err haskey \stack
      @stack := err.stack
  def name = "ScopeDestroyedError"

class Scope
  def constructor(@parent as Scope|null, @is-top as Boolean)
    if not parent and not is-top
      throw Error "Must either provide a parent or is-top = true"
    @destroyed := false
    @children := []
    @variables := {}
    @consts := {}
    @tmps := {}
    if not is-top
      parent.children.push this
  
  def _all-variables()
    let obj = {} <<< @variables
    for child in @children
      obj <<< child._all-variables()
    obj
  
  def _all-tmps()
    let obj = {} <<< @tmps
    for child in @children
      obj <<< child._all-tmps()
    obj
  
  def _all-consts()
    let obj = {} <<< @consts
    for child in @children
      obj <<< child._all-consts()
    obj
  
  let is-empty(obj)
    for k of obj
      return false
    true
  
  def inspect()
    if not @is-top
      return @top().inspect()
    let inspect = require('util').inspect
    let variables = @_all-variables()
    let tmps = @_all-tmps()
    let consts = @_all-consts()
    let text = []
    text.push "Scope("
    if not is-empty(variables) or not is-empty(tmps) or not is-empty(consts)
      text.push inspect variables
    if not is-empty(tmps) or not is-empty(consts)
      text.push ", "
      text.push inspect tmps
    if not is-empty(consts)
      text.push ", "
      text.push inspect consts
    text.push ")"
    if @parent
      text.push " -> "
      text.push @parent.inspect()
    text.join ""
  
  def destroy()!
    if @destroyed
      throw ScopeDestroyedError()
    for child in @children by -1
      child.destroy()
    if not @is-top
      let parent-children = @parent.children
      let index = parent-children.last-index-of(this)
      if index == -1
        throw Error "Not found in parents' children"
      parent-children.splice index, 1
  
  def clone(is-top as Boolean)
    if @destroyed
      throw ScopeDestroyedError()
    Scope this, is-top
  
  def reparent(parent as Scope|null)!
    if @destroyed
      throw ScopeDestroyedError()
    if not parent and not @is-top
      throw Error "Must either provide a parent or is-top = true"
    let old-parent = @parent
    if parent == old-parent
      return
    if parent == this
      throw Error "Cannot parent to self"
    if parent and parent.parent == this
      throw Error "Trying to become your own grandpa"
    @parent := parent
    if not @is-top
      let old-parent-children = old-parent.children
      let index = old-parent-children.last-index-of(this)
      if index == -1
        throw Error "Not found in old parents' children"
      old-parent-children.splice index, 1
      parent.children.push this
  
  def top()
    if @destroyed
      throw ScopeDestroyedError()
    if @is-top
      this
    else
      @parent.top()
  
  def add(ident as Ident|Tmp, is-mutable as Boolean, type as Type|->|null)!
    if @destroyed
      throw ScopeDestroyedError()
    if ident instanceof Tmp
      @tmps[ident.id] := { is-mutable, type }
    else
      @variables[ident.name] := { is-mutable, type }
  
  def add-const(name as String, value)!
    @consts[name] := value
  
  let get-ident(scope, name)
    let variables = scope.variables
    if variables ownskey name
      variables[name]
    else
      for child in scope.children
        return? get-ident child, name
  
  let get-tmp(scope, id)
    let tmps = scope.tmps
    if tmps ownskey id
      tmps[id]
    else
      for child in scope.children
        return? get-tmp child, id
  
  let get(scope, ident)
    let mutable current = scope
    let is-tmp = ident instanceof Tmp
    let mutable layers = 0
    while current
      layers += 1
      if layers > 1000
        throw Error "Infinite loop detected"
      current := current.top()
      return? if is-tmp
        get-tmp(current, ident.id)
      else
        get-ident(current, ident.name)
      current := current.parent
  
  def has(ident as Ident|Tmp)
    if @destroyed
      throw ScopeDestroyedError()
    get(this, ident)?

  def is-mutable(ident as Ident|Tmp)
    if @destroyed
      throw ScopeDestroyedError()
    get(this, ident)?.is-mutable or false

  def type(ident as Ident|Tmp)
    if @destroyed
      throw ScopeDestroyedError()
    let data = get(this, ident)
    if data
      let mutable type = data.type
      if is-function! type
        // in case type() ends up being self-referential, we will temporarily
        // mark this type as 'any'
        data.type := Type.any
        data.type := type := type()
      else
        type

      if data.is-mutable and type and type.is-subset-of(Type.undefined-or-null)
        data.type := Type.any
      else
        type
    else
      Type.any
  
  let get-const(scope, name)
    let consts = scope.consts
    if consts ownskey name
      { value: consts[name] }
    else
      for child in scope.children
        return? get-const child, name
  
  def const-value(name as String)
    if @destroyed
      throw ScopeDestroyedError()
    
    let mutable current = this
    let mutable layers = 0
    while current
      layers += 1
      if layers > 1000
        throw Error "Infinite loop detected"
      current := current.top()
      return? get-const(current, name)
      current := current.parent

module.exports := Scope
module.exports <<< {
  ScopeDestroyedError
}
