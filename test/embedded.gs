let {expect} = require 'chai'
let {stub} = require 'sinon'
let gorilla = require '../index'

describe "embedded compilation", #
  it "works with simple text and calculated value", #
    let f = gorilla.eval-sync """
    Hello, <%= "wor" & "ld" %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x)
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows for access from the context", #
    let f = gorilla.eval-sync """
    Hello, <%= name %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x), {name: "world"}
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows for a function call from a context helper", #
    let f = gorilla.eval-sync """
    Hello, <%= get-name() %>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x), {get-name: #-> "world"}
    expect(text.join "").to.equal "Hello, world!"
  
  it "allows if statements", #
    let f = gorilla.eval-sync """
    <% if name: %>
    Hello, <%= name %>!
    <% end %>
    """, embedded: true, noindent: true

    let text = []
    f #(x, escape) -> text.push(x), {name: "world"}
    expect(text.join("").trim()).to.equal "Hello, world!"

    text.length := 0
    f #(x, escape) -> text.push(x), null
    expect(text.join("").trim()).to.equal ""
  
  it "allows if-else statements", #
    let f = gorilla.eval-sync """
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
    let f = gorilla.eval-sync """
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
    let template = gorilla.eval-sync """
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
    let template = gorilla.eval-sync """
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
    let template = gorilla.eval-sync """
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
    let template = gorilla.eval-sync """
    <%-- ignore() --%>
    Hello<%-- this isn't even correct syntax. --%>, world!
    <% /* these comments should work, too */ %>
    """, embedded: true, noindent: true
  
    let text = []
    template #(x) -> text.push(x)
    expect(text.join("").trim()).equal "Hello, world!"
  
  it "allows non-standard tokens", #
    let template = gorilla.eval-sync """
      {* ignore() *}
      Hello{* ignore() *}, world!
      {% if test: %}
      Pass, {{ name }}
      {% else: %}
      Fail
      {% end %}
      {@{{ name }}@}
      """, {
      embedded: true
      noindent: true
      embedded-open: "{%"
      embedded-close: "%}"
      embedded-open-write: "{{"
      embedded-close-write: "}}"
      embedded-open-comment: "{*"
      embedded-close-comment: "*}"
      embedded-open-literal: "{@"
      embedded-close-literal: "@}"
    }

    let text = []
    template #(x) -> text.push(x), {+test, name: "friend"}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world! Pass, friend {{ name }}"

    text.length := 0
    template #(x) -> text.push(x), {-test}
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world! Fail {{ name }}"
  
  it "allows generators with yield statements", #
    let template = gorilla.eval-sync """
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
    let template = gorilla.eval-sync """
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

  it "as a generator, should allow yield in the main body", #
    let template = gorilla.eval-sync """
    Hello, <%= yield "name" %>. How are you today?
    """, embedded: true, noindent: true, embedded-generator: true
    
    let text = []
    let write(x)!
      text.push String x
    
    let iter = template write, {}
    expect(iter).to.have.property(\iterator).that.is.a \function
    expect(iter).to.have.property(\next).that.is.a \function
    expect(iter).to.have.property(\send).that.is.a \function
    expect(iter).to.have.property(\throw).that.is.a \function
    expect(text).to.be.empty
    
    expect(iter.send void).to.eql { -done, value: "name" }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello,"
    expect(iter.send "world").to.eql { +done, value: write }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world. How are you today?"
    for i in 0 til 10
      expect(iter.send void).to.eql { +done, value: void }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world. How are you today?"

  it "as a generator, should allow yield* in the main body", #
    let template = gorilla.eval-sync """
    <% let generator()*:
         yield "hello"
         yield "there"
       end %>
    Hello, <%= yield* generator() %>. How are you today?
    """, embedded: true, noindent: true, embedded-generator: true
    
    let text = []
    let write(x)!
      text.push String x
    
    let iter = template write, {}
    expect(iter).to.have.property(\iterator).that.is.a \function
    expect(iter).to.have.property(\next).that.is.a \function
    expect(iter).to.have.property(\send).that.is.a \function
    expect(iter).to.have.property(\throw).that.is.a \function
    expect(text).to.be.empty
    
    expect(iter.send void).to.eql { -done, value: "hello" }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello,"
    expect(iter.send void).to.eql { -done, value: "there" }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello,"
    expect(iter.send "world").to.eql { +done, value: write }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world. How are you today?"
    for i in 0 til 10
      expect(iter.send void).to.eql { +done, value: void }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, world. How are you today?"

  it "should allow a for loop within an embed write", #
    let template = gorilla.eval-sync """
    Hello, <%= for x in [1, 2, 3]:
      x
    end %>. How are you today?
    """, embedded: true, noindent: true, embedded-generator: true
    
    let text = []
    let write(x)!
      text.push String x
    
    let iter = template write, {}
    expect(iter).to.have.property(\iterator).that.is.a \function
    expect(iter).to.have.property(\next).that.is.a \function
    expect(iter).to.have.property(\send).that.is.a \function
    expect(iter).to.have.property(\throw).that.is.a \function
    expect(text).to.be.empty
    
    expect(iter.send void).to.eql { +done, value: write }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, 1,2,3. How are you today?"
    for i in 0 til 10
      expect(iter.send void).to.eql { +done, value: void }
    expect(text.join("").trim().replace(r"\s+"g, " ")).to.equal "Hello, 1,2,3. How are you today?"
  
  it "allows literal segments", #
    let f = gorilla.eval-sync """
    Hello, <%@<%= "wor" & "ld" %>@%>!
    """, embedded: true, noindent: true
    let text = []
    f #(x, escape) -> text.push(x)
    expect(text.join "").to.equal 'Hello, <%= "wor" & "ld" %>!'
