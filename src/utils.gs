let inspect = require('util')?.inspect

let string-repeat(text, count)
  if count < 1
    ""
  else if count == 1
    text
  else if count bitand 1
    text & string-repeat text, count - 1
  else
    string-repeat text & text, count / 2
exports.string-repeat := string-repeat

exports.pad-left := #(text, len, padding)
  string-repeat(padding, len - text.length) & text
exports.pad-right := #(text, len, padding)
  text & string-repeat(padding, len - text.length)

exports.Cache := class Cache<TKey, TValue>
  def constructor()
    @weakmap := WeakMap()
  
  def get(key as TKey) -> @weakmap.get(key)

  def get-or-add(key as TKey, factory as TKey -> TValue)
    let weakmap = @weakmap
    let mutable value = weakmap.get(key)
    if value == void
      value := factory(key)
      if value not instanceof TValue
        throw Error "Expected factory result to be a $(__name TValue), got $(typeof! value)"
      weakmap.set(key, value)
    value

exports.quote := #(value as String)
  if inspect
    inspect value
  else if value.index-of("'") == -1
    "'$(JSON.stringify(value).slice(1, -1))'"
  else
    JSON.stringify value

exports.unique := #(items)
  let result = []
  for item in items
    if item not in result
      result.push item
  result
