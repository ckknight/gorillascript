require! './gorilla'
require! fs
require! path
require! cli

cli.enable 'version'

cli.set-app "gork", "1.0"

cli.set-usage "gork [OPTIONS]"

let command-to-action = {}
let command-to-description = {}
let switches = {}
let mutable options = {}

GLOBAL.command := #(name as String, description, action)
  if typeof description == \function
    return GLOBAL.command(name, null, action)
  if typeof action != \function
    throw TypeError "Expected action to be a Function, got $(typeof! action)"
  command-to-action[name] := action
  if description?
    command-to-description[name] := description
  action

GLOBAL.option := #(flag as String, letter as String|null, description as String, type as String|void)!
  switches[flag] := [letter, description, ...if type? then [type] else []]

GLOBAL.invoke := #(name as String, callback)
  if command-to-action not ownskey name
    fatal-error "No such command: $name"
  
  let action = command-to-action[name]
  if action.length >= 2 and typeof callback != \function
    fatal-error "Cannot invoke command $name without specifying a callback"
  action(options, callback)

GLOBAL.exit := process.exit

GLOBAL.output := cli.output

exports.run := #(callback = fatal-error)
  async! callback, path <- fs.realpath(".")
  async! callback, filepath <- find-gorkfile path
  async! callback, text <- fs.read-file filepath, "utf-8"
  async! callback <- gorilla.eval text, filename: "Gorkfile", include-globals: true
  cli.parse switches, command-to-description
  if process.argv.length <= 2
    cli.get-usage()
    return
  cli.main #(args, opts)
    let commands = [@command, ...args]
    for command in commands
      if command-to-action not ownskey command
        fatal-error "Unknown command: $command"
    options := opts
    asyncfor err <- next, arg in commands
      invoke arg, next
    callback(err)

let string-repeat(text, count)
  if count < 1
    ""
  else if count == 1
    text
  else if count bitand 1
    text & string-repeat text, count - 1
  else
    string-repeat text & text, count / 2

let pad-right(text, length)
  text & string-repeat(" ", length - text.length)

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
