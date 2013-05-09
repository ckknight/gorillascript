async-test "Simple text", #
  let f = gorilla.eval("""
  Hello, <%= name %>!
  """, embedded: true, noindent: true)
  let text = []
  f #(x, escape) -> text.push(x), {name: "world"}
  eq "Hello, world!", text.join ""

async-test "Calling a helper", #
  let f = gorilla.eval("""
  Hello, <%= get-name() %>!
  """, embedded: true, noindent: true)
  let text = []
  f #(x, escape) -> text.push(x), {get-name: #-> "world"}
  eq "Hello, world!", text.join ""

async-test "if statement", #
  let f = gorilla.eval("""
  <% if name: %>
  Hello, <%= name %>!
  <% else: %>
  Hello!
  <% end %>
  """, embedded: true, noindent: true)

  let text = []
  f #(x, escape) -> text.push(x), {name: "world"}
  eq "Hello, world!", text.join("").trim()

  text.length := 0
  f #(x, escape) -> text.push(x), null
  eq "Hello!", text.join("").trim()

async-test "for loop", #
  let f = gorilla.eval("""
  <% for item in items: %>
  <%= item.name %>: \$<%= item.price.to-fixed(2) %>
  <% end %>
  """, embedded: true, noindent: true)

  let text = []
  f #(x, escape) -> text.push(x), {items: [
    { name: "Apple", price: 1.23 }
    { name: "Banana", price: 0.5 }
    { name: "Cherry", price: 1 }
  ]}
  eq '''
  Apple: $1.23

  Banana: $0.50

  Cherry: $1.00
  ''', text.join("").trim()

async-test "escaping", #
  let template = gorilla.eval("""
  Hello, <%= name %>
  """, embedded: true, noindent: true)

  let text = []
  let write(x, escape)!
    let part = if escape
      String(x).to-upper-case()
    else
      String(x)
    text.push part

  template write, {name: "Bob"}
  eq "Hello, BOB", text.join ""

async-test "Calling an async helper", #
  let template = gorilla.eval("""
  <% async! throw, name <- wait get-name %>
  Hello, <%= name %>!
  <% done() %>
  """, embedded: true, noindent: true)
  
  let get-name = run-once "world"
  let text = []
  let mutable body-ran = false
  template #(x) -> text.push(x), {@wait, get-name, done: #
    eq "Hello, world!", text.join("").trim()
    ok not body-ran
    body-ran := true}
  ok not get-name.ran
  @after #-> ok get-name.ran
  ok not body-ran
  @after #-> ok body-ran

async-test "Calling an async helper in a block", #
  let template = gorilla.eval("""
  <% do: %>
  <% async! throw, name <- wait get-name %>
  Hello, <%= name %>!
  <% done() %>
  <% end %>\
  """, embedded: true, noindent: true)
  
  let get-name = run-once "world"
  let text = []
  let mutable body-ran = false
  template #(x) -> text.push(x), {@wait, get-name, done: #
    eq "Hello, world!", text.join("").trim()
    ok not body-ran
    body-ran := true}
  ok not get-name.ran
  @after #-> ok get-name.ran
  ok not body-ran
  @after #-> ok body-ran

async-test "comments", #
  let template = gorilla.eval("""
  <%-- ignore() --%>
  Hello<%-- ignore() --%>, world!
  <% /* these comments should work, too */ %>
  """, embedded: true, noindent: true)
  
  let text = []
  template #(x) -> text.push(x)
  eq "Hello, world!", text.join("").trim()

async-test "Custom tokens", #
  let template = gorilla.eval("""
  {* ignore() *}
  Hello{* ignore() *}, world!
  {% if test: %}
  Pass, {{ name }}
  {% else: %}
  Fail
  {% end %}
  """, embedded: true, noindent: true, embedded-open: "{%", embedded-close: "%}", embedded-open-write: "{{", embedded-close-write: "}}", embedded-open-comment: "{*", embedded-close-comment: "*}")
  
  let text = []
  template #(x) -> text.push(x), {+test, name: "friend"}
  eq "Hello, world! Pass, friend", text.join("").trim().replace(r"\s+"g, " ")
  
  text.length := 0
  template #(x) -> text.push(x), {-test}
  eq "Hello, world! Fail", text.join("").trim().replace(r"\s+"g, " ")
  