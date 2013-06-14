import 'shared.gs'

let inspect = require('util')?.inspect
let path = require('path')
let fs = require('fs')

let string-repeat(text, count)
  if count < 1
    ""
  else if count == 1
    text
  else if count bitand 1
    text & string-repeat text, count - 1
  else
    string-repeat text & text, count / 2

let pad-left(text, len, padding)
  string-repeat(padding, len - text.length) & text
let pad-right(text, len, padding)
  text & string-repeat(padding, len - text.length)

class Cache<TKey, TValue>
  def constructor()
    @weakmap := WeakMap()
  
  def get(key as TKey) -> @weakmap.get(key)
  
  def set(key as TKey, value as TValue)! -> @weakmap.set(key, value)
  
  def get-or-add(key as TKey, factory as TKey -> TValue)
    let weakmap = @weakmap
    let mutable value = weakmap.get(key)
    if value == void
      value := factory(key)
      if value not instanceof TValue
        throw Error "Expected factory result to be a $(__name TValue), got $(typeof! value)"
      weakmap.set(key, value)
    value

let quote(value as String)
  if inspect
    inspect value
  else if value.index-of("'") == -1
    "'$(JSON.stringify(value).slice(1, -1))'"
  else
    JSON.stringify value

let unique(items)
  let result = []
  for item in items
    if item not in result
      result.push item
  result

let find-package-json(dir)
  let filepath = path.join dir, "package.json"
  if fs.exists-sync filepath
    filepath
  else
    let parent = path.normalize path.join dir, ".."
    if parent != dir
      find-package-json parent

let get-package-version(filename)
  if not is-string! filename or not fs or not path
    return ""
  
  let mutable package-json-filename = void
  try
    package-json-filename := find-package-json(path.dirname(filename))
  catch e
    void
  
  if not package-json-filename
    return ""
  
  let mutable version = void
  try
    version := JSON.parse(fs.read-file-sync(package-json-filename)).version
  catch e
    void
  
  if is-string! version
    version
  else
    ""

let is-primordial = do
  let PRIMORDIAL_GLOBALS = {
    +Object
    +String
    +Number
    +Boolean
    +Function
    +Array
    +Math
    +JSON
    +Date
    +RegExp
    +Error
    +RangeError
    +ReferenceError
    +SyntaxError
    +TypeError
    +URIError
    +escape
    +unescape
    +parseInt
    +parseFloat
    +isNaN
    +isFinite
    +decodeURI
    +decodeURIComponent
    +encodeURI
    +encodeURIComponent
  }
  #(name as String) -> PRIMORDIAL_GLOBALS ownskey name

let fs-exists-promise(path)
  let defer = __defer()
  fs.exists path, defer.fulfill
  defer.promise

let mkdirp = promise! #(dirpath, mutable mode, sync)!*
  if not mode?
    mode := 0o777 bitand (bitnot process.umask())
  for reduce part in dirpath.split(r"[/\\]"g), acc = if dirpath.char-at(0) == "/" then "/" else ""
    let current = path.resolve path.join acc, part
    let exists = if sync
      fs.exists-sync current
    else
      yield fs-exists-promise current
    if not exists
      try
        if sync
          fs.mkdir-sync current, mode
        else
          yield to-promise! fs.mkdir current, mode
      catch e
        throw Error "Unable to create directory '$current' (Error code: $(e.code))"
    current
let mkdirp-sync(dirpath, mutable mode)
  mkdirp.sync dirpath, mode, true

let write-file-with-mkdirp = promise! #(filepath, text, encoding, sync)!*
  if sync
    mkdirp-sync path.dirname(filepath)
    fs.write-file-sync filepath, text, encoding
  else
    yield mkdirp path.dirname(filepath)
    yield to-promise! fs.write-file filepath, text, encoding
let write-file-with-mkdirp-sync(filepath, text, encoding)
  write-file-with-mkdirp.sync filepath, text, encoding, true

exports <<< {
  string-repeat
  pad-left
  pad-right
  Cache
  quote
  unique
  get-package-version
  is-primordial
  mkdirp
  mkdirp-sync
  write-file-with-mkdirp
  write-file-with-mkdirp-sync
}
