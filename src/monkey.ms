require! './parser'
require! './translator'
require! fs
require! path

// TODO: Remove registerExtension when fully deprecated.
if require.extensions
  require.extensions[".ms"] := #(module, filename)
    let content = compile fs.readFileSync(filename, "utf8"), { filename }
    module._compile content, filename
else if require.registerExtension
  require.registerExtension ".ms", #(content) -> compiler content

let fetchAndParsePrelude = do
  let mutable parsedPrelude = void
  let fetchers = []
  let flush(err, value)
    while fetchers.length > 0
      fetchers.shift()(err, value)
  let preludePath = path.join(path.dirname(fs.realpathSync(__filename)), '../src/prelude.ms')
  let f(cb)
    if parsedPrelude?
      return cb null, parsedPrelude
    fetchers.push cb
    if fetchers.length > 1
      return
    async err, prelude <- fs.readFile preludePath, "utf8"
    if err
      return flush(err, null)
    if not parsedPrelude?
      parsedPrelude := parser prelude
      translator parsedPrelude.result
    flush(null, parsedPrelude)
  f.sync := #
    if parsedPrelude?
      parsedPrelude
    else
      let prelude = fs.readFileSync preludePath, "utf8"
      parsedPrelude := parser prelude
      translator parsedPrelude.result
      parsedPrelude
  f
setTimeout (#
  async err <- fetchAndParsePrelude()
  if err
    throw err), 1

let parse = (exports.parse := #(source, options = {})
  if options.noPrelude
    parser(source, null, options).result
  else
    let prelude = fetchAndParsePrelude.sync()
    parser(source, prelude.macros, options))

let translate = (exports.ast := #(source, options = {})
  let parsed = parse source, options
  translator(parsed.result, options).node)

let compile = (exports.compile := #(source, options = {})
  let node = translate source, options
  node.compile options)

exports.eval := #(source, options = {})
  options.return := false
  let root = translate source, options
  let Script = require('vm').Script
  if Script
    let mutable sandbox = Script.createContext()
    sandbox.global := (sandbox.root := (sandbox.GLOBAL := sandbox))
    if options.sandbox?
      if options.sandbox instanceof sandbox.constructor
        sandbox := options.sandbox
      else
        for k, v of options.sandbox
          sandbox[k] := v
    sandbox.__filename := options.filename or "eval"
    sandbox.__dirname := path.dirname sandbox.__filename
    if not sandbox.module and not sandbox.require
      let Module = require "module"
      let _module = (sandbox.module := new Module(options.modulename or "eval"))
      let _require = (sandbox.require := #(path) -> Module._load path, _module)
      _module.filename := sandbox.__filename
      for r in Object.getOwnPropertyNames require
        try
          _require[r] := require[r]
        catch e
          void
    if options.includeGlobals
      for k of global
        if sandbox not haskey k
          sandbox[k] := global[k]
    let code = root.compile(options)
    Script.runInContext code, sandbox
  else
    let code = root.compile(options)
    let fun = Function(code)
    fun()

exports.run := #(source, options = {})
  let mainModule = require.main
  mainModule.filename := (process.argv[1] := if options.filename
    fs.realpathSync(options.filename)
  else
    ".")
  mainModule.moduleCache and= {}
  if process.binding('natives').module
    let Module = require('module').Module
    mainModule.paths := Module._nodeModulePaths path.dirname options.filename
  if path.extname(mainModule.filename) != ".ms" or require.extensions
    mainModule._compile compile(source, options), mainModule.filename
  else
    mainModule._compile source, mainModule.filename
