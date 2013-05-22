require! './parser'
require! os
require! fs
require! path

const DEFAULT_TRANSLATOR = './jstranslator'

exports.version := __VERSION__
exports <<< {parser.ParserError, parser.MacroError}

// TODO: Remove register-extension when fully deprecated.
if require.extensions
  require.extensions[".gs"] := #(module, filename)
    let compiled = exports.compile-sync fs.read-file-sync(filename, "utf8"), { filename }
    module._compile compiled.code, filename
else if require.register-extension
  require.register-extension ".gs", #(content) -> exports.compile-sync content, { filename }

let fetch-and-parse-prelude = do
  let parsed-prelude-by-lang = {}
  let fetchers = []
  let flush(err, value)
    while fetchers.length > 0
      fetchers.shift()(err, value)
  let real-__filename = if __filename? then fs.realpath-sync(__filename)
  let get-prelude-src-path = if real-__filename? then #(lang) -> path.join(path.dirname(real-__filename), "../src/$(lang)prelude.gs")
  let get-prelude-cache-path = if os? then #(lang) -> path.join(os.tmp-dir(), "gs-$(lang)prelude-$(exports.version).cache")
  let f(lang as String, cb as ->)
    let mutable parsed-prelude = parsed-prelude-by-lang![lang]
    if parsed-prelude?
      return cb null, parsed-prelude
    fetchers.push cb
    if fetchers.length > 1
      return
    async! flush, prelude-src-stat <- fs.stat get-prelude-src-path(lang)
    async err, prelude-cache-stat <- fs.stat get-prelude-cache-path(lang)
    if err? and err.code != "ENOENT"
      return flush(err, null)
    asyncif next, prelude-cache-stat and prelude-src-stat.mtime.get-time() <= prelude-cache-stat.mtime.get-time()
      async! flush, cache-prelude <- fs.read-file get-prelude-cache-path(lang), "utf8"
      try
        parsed-prelude-by-lang[lang] := parsed-prelude := parser.deserialize-prelude(cache-prelude)
      catch e as ReferenceError
        throw e
      catch e
        console.error "GorillaScript: Error deserializing prelude, reloading. $(String e)"
        async! flush <- fs.unlink get-prelude-cache-path(lang)
        next()
      else
        flush(null, parsed-prelude)
    async! flush, prelude <- fs.read-file get-prelude-src-path(lang), "utf8"
    asyncif next, not parsed-prelude?
      process.stderr.write "GorillaScript: Compiling prelude ... "
      let start-time = new Date().get-time()
      async! flush, result <- (from-promise! parser prelude, null, { +serialize-macros })()
      parsed-prelude-by-lang[lang] := parsed-prelude := result
      process.stderr.write "$(((new Date().get-time() - start-time) / 1000_ms).to-fixed(3)) s\n"
      fs.write-file get-prelude-cache-path(lang), parsed-prelude.macros.serialize(), "utf8", #(err)
        throw? err
      next()
    flush(null, parsed-prelude)
  
  f.serialized := #(lang as String, cb as ->)
    async! cb <- f(lang)
    fs.read-file get-prelude-cache-path(lang), "utf8", cb
      
  f.sync := #(lang as String)
    let mutable parsed-prelude = parsed-prelude-by-lang![lang]
    if parsed-prelude?
      parsed-prelude
    else
      let prelude-src-stat = fs.stat-sync get-prelude-src-path(lang)
      let prelude-cache-stat = try
        fs.stat-sync get-prelude-cache-path(lang)
      catch e
        if e.code != "ENOENT"
          throw e
      if prelude-cache-stat and prelude-src-stat.mtime.get-time() <= prelude-cache-stat.mtime.get-time()
        let cache-prelude = fs.read-file-sync get-prelude-cache-path(lang), "utf8"
        try
          parsed-prelude := parsed-prelude-by-lang[lang] := parser.deserialize-prelude(cache-prelude)
        catch e as ReferenceError
          throw e
        catch e
          console.error "Error deserializing prelude, reloading. $(String e)"
          fs.unlink-sync get-prelude-cache-path(lang)
      if not parsed-prelude?
        let prelude = fs.read-file-sync get-prelude-src-path(lang), "utf8"
        parsed-prelude := parsed-prelude-by-lang[lang] := parser.sync prelude, null, { +serialize-macros }
        fs.write-file get-prelude-cache-path(lang), parsed-prelude.macros.serialize(), "utf8", #(err)
          throw? err
      parsed-prelude
  
  exports.with-prelude := #(lang as String, serialized-prelude as {})
    parsed-prelude-by-lang[lang] := parser.deserialize-prelude(serialized-prelude)
    this
  f

exports.get-serialized-prelude := fetch-and-parse-prelude.serialized

exports.parse := promise! #(source, options = {})*
  let sync = options.sync
  let macros = if options.macros
    options.macros
  else if options.no-prelude
    null
  else if sync
    fetch-and-parse-prelude.sync(options.lang or "js").macros
  else
    (yield to-promise! fetch-and-parse-prelude(options.lang or "js")).macros
  
  return if sync
    parser.sync(source, macros, options)
  else
    yield parser(source, macros, options)
exports.parse-sync := #(source, options = {})
  options.sync := true
  exports.parse.sync source, options

exports.get-reserved-words := #(options = {})
  if options.no-prelude
    parser.get-reserved-words(null, options)
  else
    parser.get-reserved-words(fetch-and-parse-prelude.sync(options.lang or "js").macros, options)

let join-parsed-results(results)
  let joined-parsed = {
    parse-time: 0
    macro-expand-time: 0
    reduce-time: 0
    results[0].macros
    result: []
  }
  for parsed in results
    joined-parsed.parse-time += parsed.parse-time
    joined-parsed.macro-expand-time += parsed.macro-expand-time
    joined-parsed.reduce-time += parsed.reduce-time
    joined-parsed.result.push parsed.result
  joined-parsed

exports.ast := promise! #(source, options = {})*
  let start-time = new Date().get-time()
  let sync = options.sync
  let translator = if is-function! options.translator
    options.translator
  else 
    require(if is-string! options.translator then options.translator else DEFAULT_TRANSLATOR)
  
  let parsed = if is-array! source
    let array = []
    for item in source
      if is-array! options.filenames
        options.filename := options.filenames[i]
      array.push if sync
        exports.parse-sync item, options
      else
        yield exports.parse item, options
    join-parsed-results array
  else
    if sync
      exports.parse-sync source, options
    else
      yield exports.parse source, options
  let translated = translator(parsed.result, parsed.macros, options)
  
  return {
    translated.node
    parsed.parse-time
    parsed.macro-expand-time
    parsed.reduce-time
    translate-time: translated.time
    time: new Date().get-time() - start-time
  }
exports.ast-sync := #(source, options = {})
  options.sync := true
  exports.ast.sync source, options

exports.compile := promise! #(source, options = {})*
  let sync = options.sync
  let start-time = new Date().get-time()
  let translated = if sync
    exports.ast-sync source, options
  else
    yield exports.ast source, options
  let compiled = translated.node.compile options
  return {
    translated.parse-time
    translated.macro-expand-time
    translated.reduce-time
    translated.translate-time
    compiled.compile-time
    compiled.uglify-time
    time: new Date().get-time() - start-time
    compiled.code
  }
exports.compile-sync := #(source, options = {})
  options.sync := true
  exports.compile.sync source, options

let evaluate(code, options)
  let Script = require?('vm')?.Script
  if Script
    let mutable sandbox = Script.create-context()
    sandbox.global := sandbox.root := sandbox.GLOBAL := sandbox
    if options.sandbox?
      if options.sandbox instanceof sandbox.constructor
        sandbox := options.sandbox
      else
        for k, v of options.sandbox
          sandbox[k] := v
    else
      for k, v of GLOBAL
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
      for k of GLOBAL
        if sandbox not haskey k
          sandbox[k] := GLOBAL[k]
    Script.run-in-context code, sandbox
  else
    let fun = Function("return $code")
    fun()

exports.eval := promise! #(source, options = {})*
  let sync = options.sync
  options.eval := true
  options.return := false
  let compiled = if sync
    exports.compile-sync source, options
  else
    yield exports.compile source, options
  
  let start-time = new Date().get-time()
  let result = evaluate compiled.code, options
  options.progress?(\eval, new Date().get-time() - start-time)
  return result

exports.eval-sync := #(source, options = {})
  options.sync := true
  exports.eval.sync source, options

exports.run := promise! #(source, options = {})*
  let sync = options.sync
  if is-void! process
    return if sync
      exports.eval-sync(source, options)
    else
      yield exports.eval(source, options)
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
    let compiled = if sync
      exports.compile-sync source, options
    else
      yield exports.compile source, options
    main-module._compile compiled.code, main-module.filename
  else
    main-module._compile source, main-module.filename
exports.run-sync := #(source, options = {})
  options.sync := true
  exports.run.sync source, options

let init = exports.init := promise! #(options = {})*
  if options.sync
    fetch-and-parse-prelude.sync(options.lang or "js")
  else
    yield to-promise! fetch-and-parse-prelude(options.lang or "js")
exports.init-sync := #(options = {})!
  options.sync := true
  init.sync options