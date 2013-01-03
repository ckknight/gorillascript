require! './monkey'
require! readline
require! util
require! vm
require! module

let REPL_PROMPT = "monkey> "
let REPL_PROMPT_CONTINUATION = "......> "
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
for g in non-context-globals
  sandbox[g] := this[g]

sandbox.global := (sandbox.root := (sandbox.GLOBAL := sandbox))
sandbox._ := void

let run(buffer)
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
  try
    let ret = monkey.eval code, {
      sandbox
      filename: "repl"
      modulename: "repl"
    }
    if ret != void
      sandbox._ := ret
      process.stdout.write util.inspect(ret, false, 2, enable-colors) & "\n"
  catch err
    error err
  repl.prompt()

let ACCESSOR  = r'\s*([\w\.]+)(?:\.(\w*))$'
let SIMPLEVAR = r'\s*(\w*)$'

let autocomplete(text) -> complete-attribute(text) or complete-variable(text) or [[], text]

let complete-attribute(text)
  let match = text.match ACCESSOR
  if match
    let all = match[0]
    let obj = match[1]
    let prefix = match[2]
    let val = try
      vm.Script.run-in-context obj, sandbox
    catch err
      return
    let completions = get-completions prefix, Object.get-own-property-names(val)
    [completions, prefix]

let complete-variable(text)
  let free = (text.match SIMPLEVAR)?[1]
  if free
    let vars = vm.Script.run-in-context 'Object.getOwnPropertyNames(this)', sandbox
    let possibilities = [...vars, ...monkey.RESERVED]
    let completions = get-completions free, possibilities
    [completions, free]

let starts-with(source, check)
  let check-length = check.length
  if source.length < check-length
    false
  else if check-length == 0
    true
  else if source.char-code-at(0) != check.char-code-at(0)
    false
  else if source.char-code-at(check-length - 1) != check.char-code-at(check-length - 1)
    false
  else
    source.substring(0, check-length) == check

let get-completions(prefix, candidates)
  return for e in candidates
    if starts-with(e, prefix)
      e

process.on 'uncaughtException', error

let repl = if readline.create-interface.length < 3
  stdin.on 'data', #(buffer) -> repl.write buffer
  readline.create-interface stdin, autocomplete
else
  readline.create-interface stdin, stdout, autocomplete

repl.on 'attemptClose', #
  if backlog
    backlog := ''
    process.stdout.write '\n'
    repl.set-prompt REPL_PROMPT
    repl.prompt()
  else
    repl.close()

repl.on 'close', #
  process.stdout.write '\n'
  stdin.destroy()

repl.on 'line', run

repl.set-prompt REPL_PROMPT
repl.prompt()
