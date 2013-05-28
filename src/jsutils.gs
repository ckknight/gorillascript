import 'shared.gs'

let {pad-left} = require './utils'

let is-acceptable-ident = do
  let IDENTIFIER_REGEX = r'^[a-zA-Z_\$][a-zA-Z_\$0-9]*$'
  let IDENTIFIER_UNICODE_REGEX = r'^[a-zA-Z_\$\u00a0-\uffff][a-zA-Z_\$0-9\u00a0-\uffff]*$'
  let RESERVED = [
    "arguments"
    "break"
    "case"
    "catch"
    "class"
    "const"
    "continue"
    "debugger"
    "default"
    "delete"
    "do"
    "else"
    "enum"
    "export"
    "extends"
    "eval"
    "false"
    "finally"
    "for"
    "function"
    "if"
    "implements"
    "import"
    "in"
    "Infinity"
    "instanceof"
    "interface"
    "let"
    "NaN"
    "new"
    "null"
    "package"
    "private"
    "protected"
    "public"
    "return"
    "static"
    "super"
    "switch"
    "this"
    "throw"
    "true"
    "try"
    "typeof"
    "undefined"
    "var"
    "void"
    "while"
    "with"
    "yield"
  ]
  #(name as String, allow-unicode as Boolean)
    let regex = if allow-unicode then IDENTIFIER_UNICODE_REGEX else IDENTIFIER_REGEX
    regex.test(name) and name not in RESERVED

let to-JS-source = do
  let indent(sb, amount, space = "  ")
    for i in 0 til amount
      sb space
  let more-indent(options)
    { extends options, indent: options.indent + 1 }
  let LARGE_CHARACTER_SIZE = 50
  let LARGE_CONTAINER_SIZE = 7
  let is-large(value)
    if not value?
      false
    else if value instanceof RegExp
      is-large(value.source)
    else if value instanceof Date
      false
    else if is-array! value
      switch value.length
      case 0; false
      case 1; is-large(value[0])
      default; true
    else
      switch typeof value
      case \string; value.length >= LARGE_CHARACTER_SIZE
      case \number, \boolean; false
      case \object
        for k, v, i of value
          if i >= 1 or is-large(k) or is-large(v)
            return true
        false
      default; true
  let types =
    null: #(, sb)! -> sb "null"
    undefined: #(, sb)!
      sb "void 0"
    number: #(value, sb)!
      sb if value == 0
        if 1 / value < 0
          "-0"
        else
          "0"
      else if is-finite value
        String value
      else if value is NaN
        "0/0"
      else if value > 0
        "1/0"
      else
        "-1/0"
    regexp: #(regex, sb)!
      sb "/"
      sb regex.source.replace(r"(\\\\)*\\?/"g, "\$1\\/") or "(?:)"
      sb "/"
      if regex.global
        sb "g"
      if regex.ignore-case
        sb "i"
      if regex.multiline
        sb "m"
    string: do
      let escape-helper(m)
        switch m
        case "\b"; "\\b"
        case "\t"; "\\t"
        case "\n"; "\\n"
        case "\f"; "\\f"
        case "\r"; "\\r"
        case "\n"; "\\n"
        case '"'; '\\"'
        case "'"; "\\'"
        case "\\"; "\\\\"
        default; "\\u$(pad-left m.char-code-at(0).to-string(16), 4, '0')"
      let DOUBLE_QUOTE_REGEX = r'[\u0000-\u001f"\\\u0080-\uffff]'g
      let SINGLE_QUOTE_REGEX = r"[\u0000-\u001f'\\\u0080-\uffff]"g
      let double-quote(value)
        '"' & value.replace(DOUBLE_QUOTE_REGEX, escape-helper) & '"'
      let single-quote(value)
        "'" & value.replace(SINGLE_QUOTE_REGEX, escape-helper) & "'"
      let shorter(x, y)
        if x.length <= y.length
          x
        else
          y
      #(string, sb)
        sb if string.index-of('"') == -1
          double-quote string
        else if string.index-of("'") == -1
          single-quote string
        else
          shorter double-quote(string), single-quote(string)
    boolean: #(bool, sb)
      sb if bool then "true" else "false"
    date: #(date, sb)
      sb "new Date("
      sb String date.get-time()
      sb ")"
    array: #(array, sb, options)
      let has-indent = options haskey \indent
      if array.length == 0
        sb "[]"
      else if has-indent and array.length > 1 and (array.length >= LARGE_CONTAINER_SIZE or (for some item in array; is-large(item)))
        sb "[\n"
        let child-options = more-indent(options)
        for item, i, len in array
          indent sb, child-options.indent
          to-JS-source item, sb, child-options
          if i < len - 1
            sb ","
          sb "\n"
        indent sb, options.indent
        sb "]"
      else
        sb "["
        for item, i in array
          if i > 0
            sb ","
            if has-indent
              sb " "
          to-JS-source item, sb, options
        sb "]"
    object: do
      let write-safe-key(key, sb, options)!
        if is-acceptable-ident(key)
          sb key
        else
          let num = Number(key)
          if num isnt NaN and String(num) == key
            sb key
          else
            to-JS-source key, sb, options
      #(obj, sb, options)
        let pairs = for key, value of obj; {key, value}
        let has-indent = options haskey \indent
        if pairs.length == 0
          sb "{}"
        else if has-indent and pairs.length > 1 and (pairs.length >= LARGE_CONTAINER_SIZE or (for some {key, value} in pairs; is-large(key) or is-large(value)))
          sb "{\n"
          let child-options = more-indent(options)
          for {key, value}, i, len in pairs
            indent sb, child-options.indent
            write-safe-key key, sb, child-options
            sb ": "
            to-JS-source value, sb, child-options
            if i < len - 1
              sb ","
            sb "\n"
          indent sb, options.indent
          sb "}"
        else
          sb "{"
          for {key, value}, i in pairs
            if i > 0
              sb ","
              if has-indent
                sb " "
            write-safe-key key, sb, options
            sb ":"
            if has-indent
              sb " "
            to-JS-source value, sb, options
          sb "}"
  #(value, sb as ->|null, options = {})
    if not sb?
      let arr = []
      to-JS-source(value, arr@.push, options)
      arr.join ""
    else
      if is-null! value
        types.null value, sb, options
      else if is-array! value
        types.array value, sb, options
      else if value instanceof RegExp
        types.regexp value, sb, options
      else if value instanceof Date
        types.date value, sb, options
      else
        let handler = types![typeof value]
        if not is-function! handler
          throw Error "Cannot convert $(typeof! value) to JS source"
        handler value, sb, options
      void

exports <<< {
  to-JS-source
  is-acceptable-ident
}
