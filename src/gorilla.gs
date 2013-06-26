import 'shared.gs'

// since this is the public API, we want to keep type-checking on here, at least
const DISABLE_TYPE_CHECKING = false

require! './parser'
require! ast: './jsast'
require! os
require! fs
require! path
require! SourceMap: './source-map'
let {write-file-with-mkdirp, write-file-with-mkdirp-sync} = require('./utils')
let {is-acceptable-ident} = require './jsutils'

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

let real-__filename = if __filename? then fs.realpath-sync(__filename)
let fetch-and-parse-prelude-macros = do
  let mutable parsed-prelude-macros = void
  let prelude-src-path = if real-__filename? then path.join(path.dirname(real-__filename), "../src/jsprelude.gs")
  let prelude-cache-path = if os? then path.join(os.tmp-dir(), "gs-jsprelude-$(exports.version).cache")
  let mutable prelude-promise = void
  let mutable work = promise! #(sync)*
    let prelude-src-stat = if sync
      fs.stat-sync prelude-src-path
    else
      yield to-promise! fs.stat prelude-src-path
    
    let mutable prelude-cache-stat = void
    try
      prelude-cache-stat := if sync
        fs.stat-sync prelude-cache-path
      else
        yield to-promise! fs.stat prelude-cache-path
    catch e
      if e.code != "ENOENT"
        throw e
    
    if prelude-cache-stat and prelude-src-stat.mtime.get-time() <= prelude-cache-stat.mtime.get-time()
      let cache-prelude = if sync
        fs.read-file-sync prelude-cache-path, "utf8"
      else
        yield to-promise! fs.read-file prelude-cache-path, "utf8"
      let mutable errored = false
      try
        parsed-prelude-macros := parser.deserialize-prelude(cache-prelude)
      catch e as ReferenceError
        throw e
      catch e
        console.error "Error deserializing prelude, reloading. $(String(e.stack or e))"
        errored := true
      if errored
        if sync
          fs.unlink-sync prelude-cache-path
        else
          yield to-promise! fs.unlink prelude-cache-path
    if not parsed-prelude-macros?
      let prelude = if sync
        fs.read-file-sync prelude-src-path, "utf8"
      else
        yield to-promise! fs.read-file prelude-src-path, "utf8"
      let parsed-prelude = if sync
        parser.sync prelude, null, { +serialize-macros, +sync, filename: prelude-src-path }
      else
        yield parser prelude, null, { +serialize-macros, filename: prelude-src-path }
      parsed-prelude-macros := parsed-prelude.macros
      write-file-with-mkdirp prelude-cache-path, parsed-prelude-macros.serialize(), "utf8"
    work := null
    prelude-promise := void
    parsed-prelude-macros
  let f(sync as Boolean)
    if parsed-prelude-macros?
      if sync
        parsed-prelude-macros
      else
        fulfilled! parsed-prelude-macros
    else
      if sync
        work.sync true
      else
        prelude-promise ?= work()

  exports.get-serialized-prelude := promise! #*
    yield f()
    return yield to-promise! fs.read-file prelude-cache-path, "utf8"
  
  exports.with-prelude := #(serialized-prelude as ->)
    exports.with-prelude := #-> throw Error("Cannot provide a prelude more than once")
    parsed-prelude-macros := parser.deserialize-prelude(serialized-prelude)
    work := null
    this
  f

exports.parse := promise! #(source, options = {})*
  let sync = options.sync
  let macros = if options.macros
    options.macros
  else if options.no-prelude
    null
  else if sync
    fetch-and-parse-prelude-macros(true)
  else
    yield fetch-and-parse-prelude-macros()
  
  let parse-options = {
    options.filename
    noindent: not not options.noindent
    sync: not not options.sync
    options.progress
  }
  if options.embedded
    parse-options <<< {
      embedded: not not options.embedded
      embedded-unpretty: not not options.embedded-unpretty
      embedded-generator: not not options.embedded-generator
      options.embedded-open
      options.embedded-close
      options.embedded-open-write
      options.embedded-close-write
      options.embedded-open-comment
      options.embedded-close-comment
      options.embedded-open-literal
      options.embedded-close-literal
    }
  if sync
    parser.sync(source, macros, parse-options)
  else
    yield parser(source, macros, parse-options)
exports.parse-sync := #(source, options = {})
  exports.parse.sync source, {} <<< options <<< {+sync}

exports.get-reserved-words := #(options = {})
  if options.no-prelude
    parser.get-reserved-words(null, options)
  else
    parser.get-reserved-words(fetch-and-parse-prelude-macros(true), options)

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

let handle-ast-pipe(mutable node, options, file-sources)
  if is-function! options.ast-pipe
    node := options.ast-pipe node, file-sources, ast
    if node not instanceof ast.Root
      throw Error "Expected astPipe to return a Root, got $(typeof! node)"
  if options.coverage
    require! './coverage'
    let coverage-name = if is-string! options.coverage
      if not is-acceptable-ident options.coverage
        throw Error "coverage option must be an acceptable ident. '$(options.coverage)' is not."
      options.coverage
    else
      null
    node := coverage node, file-sources, coverage-name
  node

exports.ast := promise! #(source, options = {})*
  let start-time = new Date().get-time()
  let sync = options.sync
  let translator = if is-function! options.translator
    options.translator
  else 
    require(if is-string! options.translator then options.translator else DEFAULT_TRANSLATOR)
  
  let parsed = if is-array! source
    let array = []
    let original-progress = options.progress
    let progress-counts = {parse: 0, macro-expand: 0, reduce: 0}
    if is-function! original-progress
      options.progress := #(name, time)
        progress-counts[name] += time
    for item in source
      if is-array! options.filenames
        options.filename := options.filenames[i]
      array.push if sync
        exports.parse-sync item, options
      else
        yield exports.parse item, options
    options.progress := original-progress
    if is-function! original-progress
      for name in [\parse, \macro-expand, \reduce]
        options.progress name, progress-counts[name]
    join-parsed-results array
  else
    if sync
      exports.parse-sync source, options
    else
      yield exports.parse source, options
  let translated = translator(parsed.result, parsed.macros, parsed.get-position, options)

  let file-sources = {}
  if options.filename
    file-sources[options.filename] := source
  let start-ast-pipe-time = new Date().get-time()
  let node = handle-ast-pipe translated.node, options, file-sources
  let done-ast-pipe-time = new Date().get-time()
  
  return {
    node
    parsed.parse-time
    parsed.macro-expand-time
    parsed.reduce-time
    translate-time: translated.time
    ast-pipe-time: done-ast-pipe-time - start-ast-pipe-time
    time: done-ast-pipe-time - start-time
  }
exports.ast-sync := #(source, options = {})
  exports.ast.sync source, {} <<< options <<< {+sync}

exports.compile := promise! #(source, options = {})*
  let sync = options.sync
  let start-time = new Date().get-time()
  let translated = if sync
    exports.ast-sync source, options
  else
    yield exports.ast source, options
  let mutable node = translated.node
  let compiled = node.compile options
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
  exports.compile.sync source, {} <<< options <<< {+sync}

exports.compile-file := promise! #(mutable options = {})!*
  options := {} <<< options
  let sync = options.sync
  let mutable inputs = options.input
  if is-string! inputs
    inputs := [inputs]
  else if not is-array! inputs
    throw Error "Expected options.input to be a string or array of strings"
  else if inputs.length == 0
    throw Error "Expected options.input to not be empty"
  let output = options.output
  if not is-string! output
    throw Error "Expected options.output to be a string, got $(typeof! output)"
  let mutable source-map-file = void
  if not options.source-map
    options.source-map := null // in case it was set to a falsy value
  else if is-string! options.source-map
    source-map-file := options.source-map
    options.source-map := SourceMap(source-map-file, options.output, "")
  else
    if not is-string! options.source-map.file
      throw Error "Expected options.sourceMap.file to be a string, got $(typeof! options.source-map.file)"
    if not is-string! options.source-map.source-root
      throw Error "Expected options.sourceMap.sourceRoot to be a string, got $(typeof! options.source-map.source-root)"
    source-map-file := options.source-map.file
    options.source-map := SourceMap(source-map-file, options.output, options.source-map.source-root)
  let mutable sources = []
  if sync
    for input in inputs
      sources.push fs.read-file-sync input, "utf8"
  else
    sources := yield promisefor(5) input in inputs
      yield to-promise! fs.read-file input, "utf8"
  let original-progress = sources.length > 0 and options.progress
  let progress-counts = {parse: 0, macro-expand: 0, reduce: 0}
  if is-function! original-progress
    options.progress := #(name, time)
      progress-counts[name] += time
  let parsed = for source, i in sources
    let start-parse-time = Date.now()
    options.filename := inputs[i]
    if sync
      exports.parse-sync source, options
    else
      yield exports.parse source, options
  if is-function! original-progress
    options.progress := original-progress
    for name in [\parse, \macro-expand, \reduce]
      options.progress name, progress-counts[name]
  // FIXME: only using macros from the first parsed source, which is most likely wrong.
  // Only the helpers need to be exposed to the translator, as it no longer cares for the rest of the
  // macro system.
  options.filenames := inputs
  let translator = require('./jstranslator')
  let translated = translator(
    (for x in parsed; x.result)
    parsed[0].macros
    (for x in parsed; x.get-position)
    options)
  let mutable node = translated.node
  let file-sources = {}
  for input, i in inputs
    file-sources[input] := sources[i]
  node := handle-ast-pipe node, options, file-sources
  let compiled = node.compile options
  unless sync
    yield delay! 0
  let mutable code = compiled.code
  if source-map-file
    let linefeed = options.linefeed or "\n"
    let footer = "$(linefeed)//# sourceMappingURL=$(path.relative path.dirname(options.output), source-map-file)$(linefeed)"
    code &= footer
  if sync
    write-file-with-mkdirp-sync options.output, code, options.encoding or "utf8"
  else
    yield write-file-with-mkdirp options.output, code, options.encoding or "utf8"
  if source-map-file
    // don't use options.encoding for source-maps, as in the spec, it's always utf8
    if sync
      write-file-with-mkdirp-sync source-map-file, options.source-map.to-string(), "utf8"
    else
      yield write-file-with-mkdirp source-map-file, options.source-map.to-string(), "utf8"
exports.compile-file-sync := #(options = {})
  exports.compile-file.sync {} <<< options <<< {+sync}

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
  exports.eval.sync source, {} <<< options <<< {+sync}

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
  exports.run.sync source, {} <<< options <<< {+sync}

let init = exports.init := promise! #(options = {})!*
  if options.sync
    fetch-and-parse-prelude-macros(true)
  else
    yield fetch-and-parse-prelude-macros()
exports.init-sync := #(options = {})!
  init.sync {} <<< options <<< {+sync}

exports.get-mtime := promise! #(source)*
  let files = []
  files.push path.join(path.dirname(real-__filename), "../src/jsprelude.gs")
  let lib-dir = path.join(path.dirname(real-__filename), "../lib")
  let lib-files = yield to-promise! fs.readdir lib-dir
  for lib-file in lib-files
    if path.extname(lib-file) == ".js"
      files.push path.join lib-dir, lib-file
  let file-stats-p = every-promise! for file in files
    to-promise! fs.stat file
  
  let file-stats = try
    yield file-stats-p
  catch
    return new Date()
  
  let time = for reduce stat in file-stats, acc = -(2 ^ 52)
    acc max stat.mtime.get-time()
  return new Date(time)

exports.AST := ast