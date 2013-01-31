require! './parser'
require! './translator'
require! os
require! fs
require! path

// TODO: Remove register-extension when fully deprecated.
if require.extensions
  require.extensions[".gs"] := #(module, filename)
    let compiled = compile fs.read-file-sync(filename, "utf8"), { filename }
    module._compile compiled.code, filename
else if require.register-extension
  require.register-extension ".gs", #(content) -> compiler content

let fetch-and-parse-prelude = do
  let mutable parsed-prelude = void
  let fetchers = []
  let flush(err, value)
    while fetchers.length > 0
      fetchers.shift()(err, value)
  let prelude-src-path = path.join(path.dirname(fs.realpath-sync(__filename)), '../src/prelude.gs')
  let prelude-cache-path = path.join(os.tmp-dir(), 'gs-prelude.cache')
  let f(cb)
    if parsed-prelude?
      return cb null, parsed-prelude
    fetchers.push cb
    if fetchers.length > 1
      return
    async! flush, prelude-src-stat <- fs.stat prelude-src-path
    async err, prelude-cache-stat <- fs.stat prelude-cache-path
    if err? and err.code != "ENOENT"
      return flush(err, null)
    asyncif next, prelude-cache-stat and prelude-src-stat.mtime.get-time() <= prelude-cache-stat.mtime.get-time()
      async! flush, cache-prelude <- fs.read-file prelude-cache-path, "utf8"
      try
        parsed-prelude := parser.deserialize-prelude(cache-prelude)
      catch e as ReferenceError
        throw e
      catch e
        console.error "Error deserializing prelude, reloading. $(String e)"
        async! flush <- fs.unlink prelude-cache-path
        next()
      else
        flush(null, parsed-prelude)
    async! flush, prelude <- fs.read-file prelude-src-path, "utf8"
    if not parsed-prelude?
      parsed-prelude := parser prelude, null, { +serialize-macros }
      fs.write-file prelude-cache-path, parsed-prelude.macros.serialize(), "utf8", #(err)
        throw? err
    flush(null, parsed-prelude)
      
  f.sync := #
    if parsed-prelude?
      parsed-prelude
    else
      let prelude-src-stat = fs.stat-sync prelude-src-path
      let prelude-cache-stat = try
        fs.stat-sync prelude-cache-path
      catch e
        if e.code != "ENOENT"
          throw e
      if prelude-cache-stat and prelude-src-stat.mtime.get-time() <= prelude-cache-stat.mtime.get-time()
        let cache-prelude = fs.read-file-sync prelude-cache-path, "utf8"
        try
          parsed-prelude := parser.deserialize-prelude(cache-prelude)
        catch e as ReferenceError
          throw e
        catch e
          console.error "Error deserializing prelude, reloading. $(String e)"
          fs.unlink-sync prelude-cache-path
      if not parsed-prelude?
        let prelude = fs.read-file-sync prelude-src-path, "utf8"
        parsed-prelude := parser prelude, null, { +serialize-macros }
        fs.write-file prelude-cache-path, parsed-prelude.macros.serialize(), "utf8", #(err)
          throw? err
      parsed-prelude
  f

let parse = exports.parse := #(source, options = {}, callback)
  if typeof options == \function
    return parse source, null, options
  if options.no-prelude
    parser(source, null, options, callback)
  else
    if callback?
      async! callback, prelude <- fetch-and-parse-prelude()
      parser(source, prelude.macros, options, callback)
    else
      let prelude = fetch-and-parse-prelude.sync()
      parser(source, prelude.macros, options, callback)

exports.get-reserved-words := #(options = {})
  if options.no-prelude
    parser.get-reserved-words()
  else
    parser.get-reserved-words(fetch-and-parse-prelude.sync().macros)

let translate = exports.ast := #(source, options = {}, callback)
  if typeof options == \function
    return translate source, null, callback
  let start-time = new Date().get-time()
  asyncif parsed, translated <- next, callback?
    async! callback, parsed <- parse source, options
    async! callback, translated <- translator parsed.result, options
    next parsed, translated
  else
    let parsed = parse source, options
    next parsed, translator(parsed.result, options)
  
  let result = {
    translated.node
    parsed.parse-time
    parsed.macro-expand-time
    parsed.reduce-time
    translate-time: translated.time
    time: new Date().get-time() - start-time
  }
  if callback?
    callback null, result
  else
    result

let compile = exports.compile := #(source, options = {}, callback)
  if typeof options == \function
    return compile source, null, callback
  let start-time = new Date().get-time()
  asyncif translated <- next, callback?
    async! callback, translated <- translate source, options
    next translated
  else
    next translate source, options
  let start-compile-time = new Date().get-time()
  let code = translated.node.compile options
  let end-time = new Date().get-time()
  options.progress?(\compile, end-time - start-compile-time)
  let result = {
    translated.parse-time
    translated.macro-expand-time
    translated.reduce-time
    translated.translate-time
    compile-time: end-time - start-compile-time
    time: end-time - start-time
    code
  }
  if callback?
    callback null, result
  else
    result

let evaluate(code, options)
  let Script = require?('vm')?.Script
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
      let _module = sandbox.module := new Module(options.modulename or "eval")
      let _require = sandbox.require := #(path) -> Module._load path, _module
      _module.filename := sandbox.__filename
      for r in Object.get-own-property-names(require) by -1
        try
          _require[r] := require[r]
        catch e
          void
    if options.include-globals
      for k of global
        if sandbox not haskey k
          sandbox[k] := global[k]
    Script.run-in-context code, sandbox
  else
    let fun = Function(code)
    fun()

exports.eval := #(source, options = {}, callback)
  if typeof options == \function
    return exports.eval source, null, callback
  options.eval := true
  options.return := false
  asyncif compiled <- next, callback?
    async! callback, compiled <- compile source, options
    next compiled
  else
    next compile source, options
  
  let start-time = new Date().get-time()
  let mutable result = null
  try
    result := evaluate compiled.code, options
  catch e
    if callback?
      return callback e
    else
      throw e
  options.progress?(\eval, new Date().get-time() - start-time)
  
  if callback?
    callback null, result
  else
    result

exports.run := #(source, options = {}, callback)!
  if typeof options == \function
    return exports.run source, null, callback
  let main-module = require.main
  main-module.filename := (process.argv[1] := if options.filename
    fs.realpath-sync(options.filename)
  else
    ".")
  main-module.module-cache and= {}
  if process.binding('natives').module
    let {Module} = require('module')
    main-module.paths := Module._node-module-paths path.dirname options.filename
  if path.extname(main-module.filename) != ".gs" or require.extensions
    asyncif compiled <- next, callback?
      async! callback, ret <- compile(source, options)
      next ret
    else
      next compile(source, options)
    main-module._compile compiled.code, main-module.filename
    callback?()
  else
    main-module._compile source, main-module.filename
    callback?()

exports.init := #(callback)!
  if callback?
    fetch-and-parse-prelude(callback)
  else
    fetch-and-parse-prelude.sync()
