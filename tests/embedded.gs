async-test "Simple text", #
  let f = gorilla.eval("""
  Hello, <%= name %>!
  """, embedded: true, noindent: true)
  let text = []
  async <- f #(x, escape) -> text.push(x), {name: "world"}
  eq "Hello, world!", text.join ""

async-test "Calling a helper", #
  let f = gorilla.eval("""
  Hello, <%= get-name() %>!
  """, embedded: true, noindent: true)
  let text = []
  async <- f #(x, escape) -> text.push(x), {get-name: #-> "world"}
  eq "Hello, world!", text.join ""

async-test "Calling an async helper", #
  let wait = @wait
  let f = gorilla.eval("""
  Hello, <% async! done, name <- wait get-name %><%= name %>!<% done() %>
  """, embedded: true, noindent: true)
  let text = []
  let get-name = run-once "world"
  let mutable body-ran = false
  f #(x, escape) -> text.push(x), {wait, get-name}, #(err)
    eq "Hello, world!", text.join ""
    ok not body-ran
    body-ran := true
  ok not get-name.ran
  @after #-> ok get-name.ran
  ok not body-ran
  @after #-> ok body-ran

async-test "if statement", #
  let f = gorilla.eval("""
  <% if name: %>
  Hello, <%= name %>!
  <% else: %>
  Hello!
  <% end %>
  """, embedded: true, noindent: true)
  
  let text = []
  async <- f #(x, escape) -> text.push(x), {name: "world"}
  eq "Hello, world!", text.join("").trim()
  
  text.length := 0
  async <- f #(x, escape) -> text.push(x), null
  eq "Hello!", text.join("").trim()

async-test "for loop", #
  let f = gorilla.eval("""
  <% for item in items: %>
  <%= item.name %>: \$<%= item.price.to-fixed(2) %>
  <% end %>
  """, embedded: true, noindent: true)
  
  let text = []
  async <- f #(x, escape) -> text.push(x), {items: [
    { name: "Apple", price: 1.23 }
    { name: "Banana", price: 0.5 }
    { name: "Cherry", price: 1 }
  ]}
  eq '''
  Apple: $1.23
  
  Banana: $0.50
  
  Cherry: $1.00
  ''', text.join("").trim()

async-test "escape test", #
  let to-HTML = do
    let escapes = {
      "&": "&amp;"
      "<": "&lt;"
      ">": "&gt;"
      '"': "&quot;"
      "'": "&#39;"
    }
    let replacer(x) -> escapes[x]
    let regex = r"[&<>""']"g
    let escape(text) -> text.replace(regex, replacer)
    #(text)
      if text? and is-function! text.to-HTML
        String text.to-HTML()
      else
        escape String text
  
  class SafeHTML
    def constructor(@text as String) ->
    def to-string() -> @text
    def to-HTML() -> @text
  
  let escaped-template = gorilla.eval("""
  Hello, <%= name %>
  """, embedded: true, noindent: true)
  
  let unescaped-template = gorilla.eval("""
  Hello, <%=h name %>
  """, embedded: true, noindent: true)

  let text = []
  let write(x, escape)!
    let part = if escape
      to-HTML(x)
    else
      String(x)
    text.push part  
  
  async <- escaped-template write, {name: "<\"bob\" the 'great' & powerful>"}
  eq "Hello, &lt;&quot;bob&quot; the &#39;great&#39; &amp; powerful&gt;", text.join("")
  
  text.length := 0
  async <- escaped-template write, {name: SafeHTML "<\"bob\" the 'great' & powerful>"}
  eq "Hello, <\"bob\" the 'great' & powerful>", text.join("")
  
  text.length := 0
  async <- unescaped-template write, {h: SafeHTML, name: "<\"bob\" the 'great' & powerful>"}
  eq "Hello, <\"bob\" the 'great' & powerful>", text.join("")
