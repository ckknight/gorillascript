jQuery #($)
  let handle-try = do
    let mutable compiling = false
    let mutable last-compile = void
    let handle()
      if compiling
        handle-try()
        return
      let text = $("#try-input").val()
      compiling := true
      GorillaScript.compile text, #(err, result)
        compiling := false
        if err
          $("#try-input-wrap").add-class("error")
          $("#try-output").val("// Error: $(String err)\n\n$(last-compile or '')")
        else
          $("#try-input-wrap").remove-class("error")
          $("#try-output").val(result.code)
    let mutable interval = void
    #
      if interval?
        clear-timeout interval
      interval := set-timeout handle, 250
  set-interval (do
    let mutable last-text = ""
    #
      let text = $("#try-input").val()
      if text != last-text
        last-text := text
        handle-try()), 17
  $("a[href=#try]").click #
    handle-try()
    let $try = $("#try")
    $try.slide-toggle()
    $("#run-link").toggle-class "hide"
    false
  $("a[href=#run]").click #
    try
      eval GorillaScript.compile($("#try-input").val(), eval: true).code
    catch error
      alert error
    false
  $('.gs-code').each #
    let $this = $(this)
    if $this.has-class "no-convert"
      return
    let $div = $("<div>")
    $this.replace-with $div
    $div.append $("<ul class='tabs'><li class='gs-tab active'><a href='#'>GorillaScript</a><li class='js-tab'><a href='#'>JavaScript</a></ul>")
    $div.append $this
    $div.find(".tabs a").on "click", #
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
