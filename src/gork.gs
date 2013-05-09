require! './gorilla'
require! fs
require! path
require! cli

cli.enable 'version'

cli.set-app "gork", gorilla.version

cli.set-usage "gork [OPTIONS]"

let command-to-action = {}
let command-to-description = {}
let command-to-dependencies = {}
let switches = {}
let mutable options = {}

GLOBAL.command := #(name as String, description, dependencies, action)
  if is-function! description
    return GLOBAL.command(name, null, null, description)
  else if is-array! description
    return GLOBAL.command(name, null, description, action)
  else if is-function! dependencies
    return GLOBAL.command(name, description, null, dependencies)
  if description? and not is-string! description
    throw TypeError "Expected action to be a String or null, got $(typeof! description)"
  if dependencies? and not is-array! dependencies
    throw TypeError "Expected action to be an Array or null, got $(typeof! dependencies)"
  if not is-function! action
    throw TypeError "Expected action to be a Function, got $(typeof! action)"
  if description?
    command-to-description[name] := description
  if dependencies?
    command-to-dependencies[name] := dependencies
  command-to-action[name] := action

GLOBAL.option := #(flag as String, letter as String|null, description as String, type as String|void)!
  switches[flag] := [letter, description, ...if type? then [type] else []]

let ran-commands = []

let invoke-command(name as String, explicit as Boolean, callback as Function|null)
  if not explicit and name in ran-commands
    return callback?()
  
  if command-to-action not ownskey name
    fatal-error "No such command: '$name'"
  
  ran-commands.push name
  let dependencies = command-to-dependencies![name] or []
  asyncif next, callback?
    asyncfor err <- next, dependency in dependencies
      invoke-command dependency, false, next
    if err?
      return callback(err)
    next()
  else
    for dependency in dependencies
      invoke-command dependency, false
    next()
  
  let action = command-to-action[name]
  if action.length >= 2 and not callback?
    fatal-error "Cannot invoke command '$name' without specifying a callback"
  
  if action.length < 2 and callback?
    let mutable result = void
    try
      result := action(options)
    catch e
      return callback(e)
    callback(null, result)
  else
    action(options, callback)

GLOBAL.invoke := #(name as String, callback as Function|null)
  invoke-command(name, true, callback)

GLOBAL.exit := process.exit

GLOBAL.output := cli.output

exports.run := #(callback = fatal-error)
  async! callback, current-path <- fs.realpath(".")
  async! callback, filepath <- find-gorkfile current-path
  async! callback, text <- fs.read-file filepath, "utf-8"
  process.chdir path.dirname(filepath)
  async! callback <- gorilla.run text, filename: "Gorkfile", include-globals: true
  cli.parse switches, command-to-description
  if process.argv.length <= 2
    cli.get-usage()
    return
  cli.main #(args, opts)
    let commands = [@command, ...args]
    for command in commands
      if command and command-to-action not ownskey command
        fatal-error "Unknown command: $command"
    options := opts
    
    asyncfor err <- next, command in commands
      if command
        invoke command, next
      else
        next()
    callback(err)

let fatal-error(message)
  if not message?
    return
  console.error String(message) & "\n"
  console.log "To see a list of all commands/options, run 'gork'."
  process.exit 1

let find-gorkfile(dir, callback as ->)
  let filepath = path.join dir, "Gorkfile"
  async exists <- fs.exists filepath
  if exists
    callback(null, filepath)
  else
    let parent = path.normalize path.join dir, ".."
    if parent == dir
      return callback(Error "Gorkfile not found in $(process.cwd())")
    find-gorkfile parent, callback
