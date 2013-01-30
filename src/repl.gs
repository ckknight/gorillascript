require! './gorilla'
require! readline
require! util
require! vm
require! module

let REPL_PROMPT = "gs> "
let REPL_PROMPT_CONTINUATION = "..> "
let enable-colors = process.platform != 'win32' and not process.env.NODE_DISABLE_COLORS

let stdin = process.open-stdin()
let stdout = process.stdout

let error(err) -> process.stderr.write (err.stack or err.to-string()) & "\n\n"

let mutable backlog = ''

let sandbox = vm.Script.create-context()
let non-context-globals = [
  "Buffer"
  "console"
  "process"
  "setInterval"
  "clearInterval"
  "setTimeout"
  "clearTimeout"
]
for g in non-context-globals by -1
  sandbox[g] := this[g]

sandbox.global := sandbox.root := sandbox.GLOBAL := sandbox
sandbox._ := void

let unique(array)
  let result = []
  for item in array
    if item not in result
      result.push item
  result

let get-all-property-names(obj)
  let result = []
  let mutable current = obj
  while current?
    result.push ...Object.get-own-property-names(current)
    current := Object.get-prototype-of(current)
  unique result

let memoize(func)
  let cache = {}
  #(name)
    if cache ownskey name
      cache[name]
    else
      cache[name] := func(name)

let to-js-ident = memoize #(name as String)
  let parts = name.split "-"
  for i in 1 til parts.length
    let part = parts[i]
    parts[i] := part.char-at(0).to-upper-case() & part.substring(1)
  parts.join ""

let to-gs-ident = memoize #(name as String)
  if name.match(r'^[A-Z]') or not name.match(r'[A-Z]')
    name
  else if name == "isNaN"
    "is-NaN"
  else
    let parts = name.split r'([A-Z]+)'
    if parts.length == 1
      parts[0]
    else
      let result = [parts[0]]
      for i in 1 til parts.length by 2
        let upper = parts[i]
        let lower = parts[i + 1]
        if lower.length > 0
          if upper.length > 1
            result.push upper.substring(0, upper.length - 1)
          result.push upper.char-at(upper.length - 1).to-lower-case() & lower
        else if upper.length > 0
          result.push upper
      result.join "-"

let array-to-gs-idents(names as [String])
  return for name in names; to-gs-ident name

let auto-complete(text) -> complete-attribute(text) or complete-variable(text) or [[], text]

let complete-segment(prefix, possibilities)
  let completions = unique(get-completions prefix, array-to-gs-idents(possibilities)).sort #(a, b) -> a.to-lower-case() <=> b.to-lower-case()
  [completions, prefix]

let complete-attribute(text)
  let match = text.match r'\s*([\w\-\.]+)(?:\.([\w\-]*))$'
  if match
    let [all, obj, prefix] = match
    let val = try
      vm.Script.run-in-context to-js-ident(obj), sandbox
    catch err
      return
    complete-segment prefix, get-all-property-names(val)

let complete-variable(text)
  let free = (text.match r'\s*([\w\-]*)$')?[1]
  if free
    let global-this = try
      vm.Script.run-in-context 'this', sandbox
    catch err
      void
    complete-segment free, [...get-all-property-names(global-this), ...get-all-property-names(sandbox), ...gorilla.get-reserved-words()]

let starts-with(source, check)
  let check-length = check.length
  if source.length < check-length
    false
  else if check-length == 0
    true
  else
    source.last-index-of(check, 0) == 0

let get-completions(prefix, candidates)
  return for e in candidates
    if starts-with(e, prefix)
      e

process.on \uncaught-exception, error

let repl = if readline.create-interface.length < 3
  stdin.on \data, #(buffer) -> repl.write buffer
  readline.create-interface stdin, auto-complete
else
  readline.create-interface stdin, stdout, auto-complete

let mutable recent-sigint = false
repl.on \SIGINT, #
  if backlog
    backlog := ''
    process.stdout.write '\n'
    repl.set-prompt REPL_PROMPT
    repl.prompt()
    repl.write(null, {+ctrl, name: 'u'})
  else if not recent-sigint
    process.stdout.write "\n(^C again to quit)\n"
    repl.set-prompt REPL_PROMPT
    repl.prompt()
    repl.write(null, {+ctrl, name: 'u'})
    recent-sigint := true
  else
    repl.close()

repl.on \close, #
  process.stdout.write '\n'
  stdin.destroy()

repl.on \line, #(buffer)
  recent-sigint := false
  if not buffer.to-string().trim() and not backlog
    repl.prompt()
    return
  backlog &= buffer
  if backlog.char-at(backlog.length - 1) == "\\"
    backlog := backlog.substring(0, backlog.length - 1) & "\n"
    repl.set-prompt REPL_PROMPT_CONTINUATION
    repl.prompt()
    return
  repl.set-prompt REPL_PROMPT

  let code = backlog
  backlog := ""
  async err, ret <- gorilla.eval code, { sandbox, filename: \repl, modulename: \repl }
  if err
    error err
  else if ret != void
    sandbox._ := ret
    process.stdout.write util.inspect(ret, false, 2, enable-colors) & "\n"
  repl.prompt()

repl.set-prompt REPL_PROMPT
repl.prompt()
