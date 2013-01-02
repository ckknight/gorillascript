require! './monkey'
require! readline
require! util
require! vm
require! module

let REPL_PROMPT = "monkey> "
let REPL_PROMPT_CONTINUATION = "......> "
let enableColors = process.platform != 'win32' and not process.env.NODE_DISABLE_COLORS

let stdin = process.openStdin()
let stdout = process.stdout

let error(err) -> process.stderr.write (err.stack or err.toString()) & "\n\n"

let mutable backlog = ''

let sandbox = vm.Script.createContext()
let nonContextGlobals = [
  "Buffer"
  "console"
  "process"
  "setInterval"
  "clearInterval"
  "setTimeout"
  "clearTimeout"
]
for g in nonContextGlobals
  sandbox[g] := this[g]

sandbox.global := (sandbox.root := (sandbox.GLOBAL := sandbox))
sandbox._ := void

let run(buffer)
  if not buffer.toString().trim() and not backlog
    repl.prompt()
    return
  backlog &= buffer
  if backlog.charAt(backlog.length - 1) == "\\"
    backlog := backlog.substring(0, backlog.length - 1) & "\n"
    repl.setPrompt REPL_PROMPT_CONTINUATION
    repl.prompt()
    return
  repl.setPrompt REPL_PROMPT
  
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
      process.stdout.write util.inspect(ret, false, 2, enableColors) & "\n"
  catch err
    error err
  repl.prompt()

let ACCESSOR  = r'\s*([\w\.]+)(?:\.(\w*))$'
let SIMPLEVAR = r'\s*(\w*)$'

let autocomplete(text) -> completeAttribute(text) or completeVariable(text) or [[], text]

let completeAttribute(text)
  let match = text.match ACCESSOR
  if match
    let all = match[0]
    let obj = match[1]
    let prefix = match[2]
    let val = try
      vm.Script.runInContext obj, sandbox
    catch err
      return
    let completions = getCompletions prefix, Object.getOwnPropertyNames(val)
    [completions, prefix]

let completeVariable(text)
  let free = (text.match SIMPLEVAR)?[1]
  if free
    let vars = vm.Script.runInContext 'Object.getOwnPropertyNames(this)', sandbox
    let possibilities = [...vars, ...monkey.RESERVED]
    let completions = getCompletions free, possibilities
    [completions, free]

let startsWith(source, check)
  let checkLength = check.length
  if source.length < checkLength
    false
  else if checkLength == 0
    true
  else if source.charCodeAt(0) != check.charCodeAt(0)
    false
  else if source.charCodeAt(checkLength - 1) != check.charCodeAt(checkLength - 1)
    false
  else
    source.substring(0, checkLength) == check

let getCompletions(prefix, candidates)
  return for e in candidates
    if startsWith(e, prefix)
      e

process.on 'uncaughtException', error

let repl = if readline.createInterface.length < 3
  stdin.on 'data', #(buffer) -> repl.write buffer
  readline.createInterface stdin, autocomplete
else
  readline.createInterface stdin, stdout, autocomplete

repl.on 'attemptClose', #
  if backlog
    backlog := ''
    process.stdout.write '\n'
    repl.setPrompt REPL_PROMPT
    repl.prompt()
  else
    repl.close()

repl.on 'close', #
  process.stdout.write '\n'
  stdin.destroy()

repl.on 'line', run

repl.setPrompt REPL_PROMPT
repl.prompt()
