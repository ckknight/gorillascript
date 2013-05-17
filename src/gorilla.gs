require! './parser'
require! os
require! fs
require! path

let DEFAULT_TRANSLATOR = './jstranslator'

exports.version := "0.6.6"
exports <<< {parser.ParserError, parser.MacroError}

// TODO: Remove register-extension when fully deprecated.
if require.extensions
  require.extensions[".gs"] := #(module, filename)
    let compiled = compile fs.read-file-sync(filename, "utf8"), { filename }
    module._compile compiled.code, filename
else if require.register-extension
  require.register-extension ".gs", #(content) -> compiler content

let fetch-and-parse-prelude = do
  let parsed-prelude-by-lang = {}
  let fetchers = []
  let flush(err, value)
    while fetchers.length > 0
      fetchers.shift()(err, value)
  let real-__filename = if __filename? then fs.realpath-sync(__filename)
  let get-prelude-src-path = if real-__filename? then #(lang) -> path.join(path.dirname(real-__filename), "../src/$(lang)prelude.gs")
  let get-prelude-cache-path = if os? then #(lang) -> path.join(os.tmp-dir(), "gs-$(lang)prelude.cache")
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
        console.error "Error deserializing prelude, reloading. $(String e)"
        async! flush <- fs.unlink get-prelude-cache-path(lang)
        next()
      else
        flush(null, parsed-prelude)
    async! flush, prelude <- fs.read-file get-prelude-src-path(lang), "utf8"
    if not parsed-prelude?
      parsed-prelude-by-lang[lang] := parsed-prelude := parser prelude, null, { +serialize-macros }
      fs.write-file get-prelude-cache-path(lang), parsed-prelude.macros.serialize(), "utf8", #(err)
        throw? err
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
        parsed-prelude := parsed-prelude-by-lang[lang] := parser prelude, null, { +serialize-macros }
        fs.write-file get-prelude-cache-path(lang), parsed-prelude.macros.serialize(), "utf8", #(err)
          throw? err
      parsed-prelude
  
  exports.with-prelude := #(lang as String, serialized-prelude as {})
    parsed-prelude-by-lang[lang] := parser.deserialize-prelude(serialized-prelude)
    this
  f

exports.get-serialized-prelude := fetch-and-parse-prelude.serialized

let parse = exports.parse := #(source, options = {}, callback)
  if is-function! options
    return parse source, null, options
  if options.macros
    parser(source, options.macros, options, callback)
  else if options.no-prelude
    parser(source, null, options, callback)
  else
    if callback?
      async! callback, prelude <- fetch-and-parse-prelude(options.lang or "js")
      parser(source, prelude.macros, options, callback)
    else
      let prelude = fetch-and-parse-prelude.sync(options.lang or "js")
      parser(source, prelude.macros, options, callback)

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
    result: []
  }
  for parsed in results
    joined-parsed.parse-time += parsed.parse-time
    joined-parsed.macro-expand-time += parsed.macro-expand-time
    joined-parsed.reduce-time += parsed.reduce-time
    joined-parsed.result.push parsed.result
  joined-parsed

let translate = exports.ast := #(source, options = {}, callback)
  if is-function! options
    return translate source, null, options
  let start-time = new Date().get-time()
  let translator = if is-function! options.translator
    options.translator
  else 
    require(if is-string! options.translator then options.translator else DEFAULT_TRANSLATOR)
  asyncif parsed, translated <- next, callback?
    asyncif parsed <- next2, is-array! source
      asyncfor err, results <- next3, item, i in source
        if is-array! options.filenames
          options.filename := options.filenames[i]
        parse item, options, next3
      if err?
        return callback(err)
      next2 join-parsed-results(results)
    else
      async! callback, parsed <- parse source, options
      next2 parsed
    async! callback, translated <- translator parsed.result, parsed.macros, options
    next parsed, translated
  else
    let parsed = if is-array! source
      join-parsed-results for item in source
        if is-array! options.filenames
          options.filename := options.filenames[i]
        parse item, options
    else
      parse source, options
    next parsed, translator(parsed.result, parsed.macros, options)
  
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
  if is-function! options
    return compile source, null, options
  let start-time = new Date().get-time()
  asyncif translated <- next, callback?
    async! callback, translated <- translate source, options
    next translated
  else
    next translate source, options
  let compiled = translated.node.compile options
  let result = {
    translated.parse-time
    translated.macro-expand-time
    translated.reduce-time
    translated.translate-time
    compiled.compile-time
    compiled.uglify-time
    time: new Date().get-time() - start-time
    compiled.code
  }
  if callback?
    callback null, result
  else
    result

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

exports.eval := #(source, options = {}, callback)
  if is-function! options
    return exports.eval source, null, options
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
  if is-function! options
    return exports.run source, null, options
  if is-void! process
    exports.eval(source, options, if callback? then #(err) -> callback(err))
    return
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

let init = exports.init := #(options = {}, callback)!
  if is-function! options
    return init(void, options)
  if callback?
    fetch-and-parse-prelude(options.lang or "js", callback)
  else
    fetch-and-parse-prelude.sync(options.lang or "js")
