jQuery #($)
  $('.gs-code').each #
    let $this = $(this)
    let $div = $("<div>")
    $this.replace-with $div
    $div.append $("<ul class='tabs'><li><a href='#' class='gs-tab active'>GorillaScript</a><li><a href='#' class='js-tab'>JavaScript</a></ul>")
    $div.append $this
    $div.find(".tabs a").on "click", #
      $div.find(".tabs a").remove-class "active"
      $(this).add-class "active"
      if $(this).has-class "gs-tab"
        $div.find(".js-code").hide()
        $div.find(".gs-code").show()
      else
        $div.find(".gs-code").hide()
        let mutable $js-code = $div.find(".js-code")
        if $js-code.length == 0
          $js-code := $("<pre class='js-code'><code></code></pre>")
          $div.append $js-code
          let gs-code = $this.find("code").text()
          let js-code = GorillaScript.compile(gs-code, return: true, bare: true).code
          $js-code.find("code").text(js-code)
        $js-code.show()
      false