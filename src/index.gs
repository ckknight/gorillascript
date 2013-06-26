jQuery #($)
  $("#try-link").remove-class "hide"
  let mutable last-compile = void
  let handle-try = do
    let mutable compiling = false
    let handle()
      if compiling
        handle-try()
        return
      let text = $("#try-input").val()
      compiling := true
      async err, result <- (from-promise! GorillaScript.compile text)()
      compiling := false
      if err
        $("#try-input-wrap").add-class("error")
        last-compile := "// Error: $(String err)"
      else
        $("#try-input-wrap").remove-class("error")
        last-compile := result.code
      $("#try-output").val(last-compile)
    let mutable interval = void
    #
      if interval?
        clear-timeout interval
      interval := set-timeout handle, 250
  let handle-run()
    if last-compile
      try
        Function(last-compile)()
      catch e
        alert String e
        return
  set-interval (do
    let mutable last-text = ""
    #
      let text = $("#try-input").val()
      if text != last-text
        last-text := text
        handle-try()), 17
  let safe(func) -> #
    try
      return func@ this, ...arguments
    catch e
      set-immediate #-> throw e
    false
  $("a[href=#try]").click safe #
    handle-try()
    $("#repl").hide()
    let $try = $("#try")
    if $try.is(":visible")
      $("#run-link").add-class "hide"
      $("#repl-link").remove-class "hide"
    else
      $("#run-link").remove-class "hide"
      $("#repl-link").add-class "hide"
    $("#try").slide-toggle()
    false
  $("a[href=#run]").click safe #
    handle-run()
    false
  $("a[href=#repl]").click safe #
    $("#try").hide()
    $("#repl").slide-toggle()
    $("#run-link").add-class "hide"
    $("#repl-link").remove-class "hide"
    let $repl-input = $("#repl-input")
    set-timeout (#
      if $repl-input.is ":visible"
        $("#repl-input").focus()), 17_ms
    false

  let inspect(value, depth)
    if is-null! value or typeof value in [\undefined, \number, \boolean, \function]
      String value
    else if is-string! value
      JSON.stringify value
    else if is-function! value.inspect
      value.inspect(depth)
    else if not depth
      Object::to-string@ value
    else if is-array! value
      inspect-array value, depth
    else if value.constructor == Object
      inspect-object value, depth
    else if value::to-string != Object::to-string
      String value
    else
      "(object $(typeof! value))"

  let inspect-array(array, depth)
    if array.length == 0
      return "[]"
    let depth-1 = if depth? then depth - 1
    let sb = []
    sb.push "[ "
    for item, i, len in array
      sb.push inspect(item, depth-1).split("\n").join("\n  ")
      if i < len - 1
        sb.push ",\n  "
    sb.push " ]"
    sb.join ""

  let inspect-object(object, depth)
    let depth-1 = if depth? then depth - 1
    let keys = keys! object
    if keys.length == 0
      return "{}"
    let sb = []
    sb.push "{ "
    for key, i, len in keys
      let value = object[key]
      sb.push JSON.stringify(key)
      sb.push ":"
      let inspected-value = inspect(value, depth-1)
      if inspected-value.index-of("\n") != -1
        sb.push "\n    "
        sb.push inspected-value.split("\n").join("\n    ")
      else
        sb.push " "
        sb.push inspected-value
      if i < len - 1
        sb.push ",\n  "
    sb.push " }"
    sb.join ""

  let is-enter(event)
    event.which in [10, 13]
  let mutable repl-buffer = null
  $("#repl-input").keypress safe #(event)
    if is-enter(event)
      let mutable text = $(this).val()
      $(this).val("")
      let $output = $("#repl-output")
      let has-buffer = repl-buffer?
      let mutable total-text = ""
      let buffering = text.length > 0 and text.char-code-at(text.length - 1) == "\\".char-code-at(0)
      if repl-buffer?
        repl-buffer &= "\n"
      else
        repl-buffer := ""
      repl-buffer &= if buffering
        text.substring(0, text.length - 1)
      else
        text
      $output.val $output.val() & "\n$(if has-buffer then '..' else 'gs')> $text"
      if buffering
        $("#repl-input-label").text("..>")
      else
        $("#repl-input-label").text("gs>")
        let buffer = repl-buffer
        repl-buffer := null
        async err, result <- (from-promise! GorillaScript.eval buffer)()
        if err
          $output.val $output.val() & "\n" & String(err?.stack or err)
        else
          $output.val $output.val() & "\n" & inspect(result, 2)
      false
  $("#irc-button").click safe #
    let url = $(this).data("url")
    $(this).replace-with $("<iframe id='irc-iframe' src='$url'></iframe>")
    false
  let mutable has-touch = window haskey 'ontouchstart'
  let mutable in-toc-label = false
  let mutable in-toc = false
  let handle-toc-unhover()
    if not in-toc and not in-toc-label and not has-touch
      $("#toc").remove-class "hover"
  $("#toc").remove-class "hover"
  if not has-touch
    $("#toc-label").add-class("no-touch").bind 'touchstart', safe #
      has-touch := true
      $(this).remove-class "no-touch"
      true
    $("#toc-label").hover(
      safe #
        if has-touch
          return
        in-toc-label := true
        $("#toc").add-class "hover"
      safe #
        if has-touch
          return
        in-toc-label := false
        set-timeout handle-toc-unhover, 17_ms)
    $("#toc").hover(
      safe #
        if has-touch
          return
        in-toc := true
        $("#toc").add-class "hover"
      safe #
        if has-touch
          return
        in-toc := false
        set-timeout handle-toc-unhover, 17_ms)
  $("#toc-label a").click safe #
    set-immediate #
      $("#toc").toggle-class "hover"
      set-timeout handle-toc-unhover, 17_ms
    false
  let side-by-side = do
    let pending = []
    let mutable working = false
    let flush()
      if pending.length == 0 or working
        return
      
      working := true
      
      let {gs-code, $js-code} = pending.shift()
      
      async err, result <- (from-promise! GorillaScript.compile gs-code, return: true, bare: true)()
      let $code = $js-code.find("code")
      $code.text if err?
        "// Error: $(String err)"
      else
        result.code
      
      async <- set-immediate()
      Prism.highlightElement($code[0])
      working := false
      flush()
    #(gs-code, $js-code)
      $js-code.find("code").text "// Compiling..."
      pending.push { gs-code, $js-code }
      flush()
  $('.gs-code').each #
    let $this = $(this)
    if $this.has-class "no-convert"
      return
    let $div = $("<div>")
    $this.replace-with $div
    $div.append $("<ul class='tabs'><li class='gs-tab active'><a href='#'>GorillaScript</a><li class='js-tab'><a href='#'>JavaScript</a></ul>")
    $div.append $this
    $div.find(".tabs a").on "click", safe #
      $div.find(".tabs li").remove-class "active"
      $(this).parent().add-class "active"
      if $(this).parent().has-class "gs-tab"
        $div.find(".js-code").hide()
        $div.find(".gs-code").show()
      else
        $div.find(".gs-code").hide()
        let mutable $js-code = $div.find(".js-code")
        if $js-code.length == 0
          $js-code := $("<pre class='js-code'><code class='language-javascript'></code></pre>")
          $div.append $js-code
          side-by-side $this.find("code").text(), $js-code
        $js-code.show()
      false
  let f = #
    if not Prism.languages.gorillascript
      return set-timeout f, 17_ms
    let $elements = $('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code')
    asyncfor next, element in $elements
      Prism.highlight-element element
      set-immediate next
  f()
