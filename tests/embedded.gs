describe "embedded compilation", #
  it "works with simple text and calculated value", #
    let f = gorilla.eval """
    Hello, <%= "wor" & "ld" %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x)
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows for access from the context", #
    let f = gorilla.eval """
    Hello, <%= name %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x), {name: "world"}
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows for a function call from a context helper", #
    let f = gorilla.eval """
    Hello, <%= get-name() %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x), {get-name: #-> "world"}
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows if statements", #
    let f = gorilla.eval """
    <% if name: %>
    Hello, <%= name %>!
    <% else: %>
    Hello!
    <% end %>
    """, embedded: true, noindent: true

    let text = []
    f #(x, escape) -> text.push(x), {name: "world"}
    expect(text.join("").trim()).to.equal "Hello, world!"

    text.length := 0
    f #(x, escape) -> text.push(x), null
    expect(text.join("").trim()).to.equal "Hello!"
  
  it "allows for loops", #
    let f = gorilla.eval """
    <% for item in items: %>
    <%= item.name %>: \$<%= item.price.to-fixed(2) %>
    <% end %>
    """, embedded: true, noindent: true
    
    let text = []
    f #(x, escape) -> text.push(x), {items: [
      { name: "Apple", price: 1.23 }
      { name: "Banana", price: 0.5 }
      { name: "Cherry", price: 1 }
    ]}
    expect(text.join("").trim()).to.equal '''
      Apple: $1.23

      Banana: $0.50

      Cherry: $1.00
      '''
  
  it "allows custom escaping", #
    let template = gorilla.eval """
    Hello, <%= name %>
    """, embedded: true, noindent: true

    let text = []
    let write(x, escape)!
      let part = if escape
        String(x).to-upper-case()
      else
        String(x)
      text.push part

    template write, {name: "Bob"}
    expect(text.join "").to.equal "Hello, BOB"
  
  it "allows calling async helpers", #(cb)
    let template = gorilla.eval """
    <% async <- soon() %>
    Hello, <%= name %>!
    <% done() %>
    """, embedded: true, noindent: true

    let text = []
    let in-body = stub()
    let mutable body-ran = false
    template #(x) -> text.push(x), {
      name: "world"
      soon: set-immediate
      done: #
        expect(text.join("").trim()).equal "Hello, world!"
        cb()
    }
  
  it "allows calling an async helper in a block", #(cb)
    let template = gorilla.eval """
    <% do: %>
      <% async <- soon() %>
      Hello, <%= name %>!
      <% done() %>
    <% end %>
    """, embedded: true, noindent: true

    let text = []
    let in-body = stub()
    let mutable body-ran = false
    template #(x) -> text.push(x), {
      name: "world"
      soon: set-immediate
      done: #
        expect(text.join("").trim()).equal "Hello, world!"
        cb()
    }
  
  it "allows comments", #
    let template = gorilla.eval """
    <%-- ignore() --%>
    Hello<%-- this isn't even correct syntax. --%>, world!
    <% /* these comments should work, too */ %>
    """, embedded: true, noindent: true
  
    let text = []
    template #(x) -> text.push(x)
    expect(text.join("").trim()).equal "Hello, world!"
  
  it "allows non-standard tokens", #
    let template = gorilla.eval """
      {* ignore() *}
      Hello{* ignore() *}, world!
      {% if test: %}
      Pass, {{ name }}
      {% else: %}
      Fail
      {% end %}
      """, {
      embedded: true
      noindent: true
      embedded-open: "{%"
      embedded-close: "%}"
      embedded-open-write: "{{"
      embedded-close-write: "}}"
      embedded-open-comment: "{*"
      embedded-close-comment: "*}"
    }

    let text = []
    template #(x) -> text.push(x), {+test, name: "friend"}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world! Pass, friend"

    text.length := 0
    template #(x) -> text.push(x), {-test}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world! Fail"
  
  it "allows generators with yield statements", #
    let template = gorilla.eval """
    <% let f()*: %>
      [ <% yield "Alpha" %> ]
      [ <% yield "Bravo" %> ]
    <% end %>
    <% for item from f(): %>
      <%= item.to-upper-case() %>
    <% end %>
    """, embedded: true, noindent: true

    let text = []
    let write(x)!
      text.push String x

    template write, {}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "[ ALPHA ] [ BRAVO ]"
  
  it "allows generators with yield expressions", #
    let template = gorilla.eval """
    <% let f()*: %>
      [ <%= yield "Alpha" %> ]
      [ <%= yield "Bravo" %> ]
    <% end %>
    <% let iter = f()
       let mutable next-value = void
       while true:
         let item = iter.send(next-value)
         if item.done:
           break
         end %>
           <%= item.value.to-upper-case() %>
      <% next-value := item.value.to-lower-case()
       end %>
    """, embedded: true, noindent: true

    let text = []
    let write(x)!
      text.push String x

    template write, {}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "[ ALPHA alpha ] [ BRAVO bravo ]"
