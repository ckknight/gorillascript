require! './parser'
require! './translator'
require! fs
require! path

// TODO: Remove register-extension when fully deprecated.
if require.extensions
  require.extensions[".ms"] := #(module, filename)
    let content = compile fs.read-file-sync(filename, "utf8"), { filename }
    module._compile content, filename
else if require.register-extension
  require.register-extension ".ms", #(content) -> compiler content

let fetch-and-parse-prelude = do
  let mutable parsed-prelude = void
  let fetchers = []
  let flush(err, value)
    while fetchers.length > 0
      fetchers.shift()(err, value)
  let prelude-path = path.join(path.dirname(fs.realpath-sync(__filename)), '../src/prelude.ms')
  let f(cb)
    if parsed-prelude?
      return cb null, parsed-prelude
    fetchers.push cb
    if fetchers.length > 1
      return
    async err, prelude <- fs.read-file prelude-path, "utf8"
    if err
      return flush(err, null)
    if not parsed-prelude?
      parsed-prelude := parser prelude
      translator parsed-prelude.result
    flush(null, parsed-prelude)
  f.sync := #
    if parsed-prelude?
      parsed-prelude
    else
      let prelude = fs.read-file-sync prelude-path, "utf8"
      parsed-prelude := parser prelude
      translator parsed-prelude.result
      parsed-prelude
  f
set-timeout (#
  async err <- fetch-and-parse-prelude()
  if err
    throw err), 1

let parse = (exports.parse := #(source, options = {})
  if options.no-prelude
    parser(source, null, options).result
  else
    let prelude = fetch-and-parse-prelude.sync()
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
    let mutable sandbox = Script.create-context()
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
      for r in Object.get-own-property-names require
        try
          _require[r] := require[r]
        catch e
          void
    if options.include-globals
      for k of global
        if sandbox not haskey k
          sandbox[k] := global[k]
    let code = root.compile(options)
    Script.run-in-context code, sandbox
  else
    let code = root.compile(options)
    let fun = Function(code)
    fun()

exports.run := #(source, options = {})
  let main-module = require.main
  main-module.filename := (process.argv[1] := if options.filename
    fs.realpath-sync(options.filename)
  else
    ".")
  main-module.module-cache and= {}
  if process.binding('natives').module
    let Module = require('module').Module
    main-module.paths := Module._node-module-paths path.dirname options.filename
  if path.extname(main-module.filename) != ".ms" or require.extensions
    main-module._compile compile(source, options), main-module.filename
  else
    main-module._compile source, main-module.filename
