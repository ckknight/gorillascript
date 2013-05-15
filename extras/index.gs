jQuery #($)
  let mutable last-compile = void
  let handle-try = do
    let mutable compiling = false
    let handle()
      if compiling
        handle-try()
        return
      let text = $("#try-input").val()
      compiling := true
      async err, result <- GorillaScript.compile text
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
    let $try = $("#try")
    $try.slide-toggle()
    $("#run-link").toggle-class "hide"
    false
  $("a[href=#run]").click safe #
    handle-run()
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
          let gs-code = $this.find("code").text()
          let js-code = GorillaScript.compile(gs-code, return: true, bare: true).code
          $js-code.find("code").text(js-code)
          Prism.highlightElement($js-code.find("code")[0])
        $js-code.show()
      false
  let f = #
    if not Prism.languages.gorillascript
      return set-timeout f, 17_ms
    Prism.highlight-all()
  f()
